import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { Game } from '@/arkham/types/Game'
import type { Scenario } from '@/arkham/types/Scenario'
import type { GameValue } from '@/arkham/types/Location'
import { MessageType } from '@/arkham/types/Message'
import type { ArkhamDBCard } from '@/stores/dbCards'
import { cardImage } from '@/arkham/cardImages'
import { useCardInfo } from '@/arkham/composables/useCardNames'
import { useGameChoices } from '@/arkham/composables/useGameChoices'
import { choicesFor, kindOf, LINE_KIND, type EntityChoice } from '@/arkham/locationChoices'
import { replaceText } from '@/arkham/cardTextFormat'

/* Data behind the mission strip: one panel per agenda and act in play, described from the card
 * database (title, flavor, rules text) and the server state (doom, clues, the abilities on offer). */

/** Printed text carries markup (bold tags, [[Trait]], [action]); the strip shows flavor plain. */
export const plainText = (text: string | undefined) => (text ?? '')
  .replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\[\[([^\]]+)\]\]/g, '$1').replace(/\[[a-z]+\]/gi, '').trim()

/** How much a panel's body has to say, as its share of the strip's width: panels with more text grow
 * wider so the three bodies end up about the same height. Floored so a near-empty panel keeps room for
 * its header line. */
export const textWeight = (...htmls: (string | undefined)[]) =>
  Math.max(200, htmls.reduce((sum, h) => sum + plainText(h).length, 0))

/** A card sitting on / next to an act or agenda (a treachery attached to the agenda, a story beside the act ...). */
export type AttachedCard = { key: string; id: string; code: string; image: string; name: string }

/* An act or agenda's printed action / fast lines are always listed. A line is usable when the server
 * offers its ability right now (and then it sends that choice), greyed when it cannot be used. The server
 * only offers usable abilities, so offered ones are matched to the printed lines of the same kind in
 * order; when fewer are offered than printed, the offered ones come first. */
export type ActionRow = { key: string; kind: 'action' | 'fast'; html: string; choice: EntityChoice | null }

export type MissionPanel = {
  key: string; kind: 'act' | 'agenda'; code: string; image: string; step: number; total: number
  title: string; flavor: string; textHtml: string
  /** Doom on the agenda card itself / the threshold it advances at. */
  doom: number | null; doomMax: number | null
  clues: number | null; clueMax: number | null; advanceIndex: number | null
  choices: EntityChoice[]; actions: ActionRow[]; attached: AttachedCard[]
}

/** How a meter's value just changed, so the pips between the two counts can animate. */
export type MeterChange = { from: number; to: number }

function costClueValue(cost: unknown): GameValue | null {
  if (!cost || typeof cost !== 'object') return null
  const c = cost as { tag?: string; contents?: unknown }
  switch (c.tag) {
    case 'ClueCost':
    case 'PlaceClueOnLocationCost':
      return (c.contents as GameValue) ?? null
    case 'GroupClueCost':
    case 'SameLocationGroupClueCost':
    case 'GroupPlaceClueOnLocationCost':
      return Array.isArray(c.contents) ? (c.contents[0] as GameValue) ?? null : null
    case 'Costs':
      if (Array.isArray(c.contents)) {
        for (const sub of c.contents) {
          const found = costClueValue(sub)
          if (found) return found
        }
      }
      return null
    default:
      return null
  }
}

function actionRows(text: string, offered: EntityChoice[], code: string): ActionRow[] {
  const lines = text.split(/\n|<br\s*\/?>/i).flatMap((line) => {
    const kind = LINE_KIND.find(([re]) => re.test(line))?.[1]
    return kind === 'action' || kind === 'fast' ? [{ kind, html: replaceText(line.trim()) }] : []
  })
  const rows: ActionRow[] = []
  for (const kind of ['action', 'fast'] as const) {
    const printed = lines.filter((l) => l.kind === kind)
    const usable = offered.filter((c) => kindOf(c.contents) === kind)
    printed.forEach((line, i) => rows.push({ key: `${code}-${kind}-${i}`, kind, html: line.html, choice: usable[i] ?? null }))
    // An offered ability with no printed line to pair with (an act with its text elsewhere) is still shown.
    usable.slice(printed.length).forEach((choice, i) => rows.push({ key: `${code}-${kind}-x${i}`, kind, html: '', choice }))
  }
  return rows
}

export function useMissionStripPanels(game: () => Game, scenario: () => Scenario, playerId: () => string) {
  const cardInfo = useCardInfo()
  const choices = useGameChoices(game, playerId)
  const players = () => Math.max(1, Object.keys(game().investigators).length)

  /* The agenda's real threshold comes from the server (a fixed number, or per investigator); the card
   * database only has it for some cards, so it is the fallback. */
  function doomLimit(id: string, threshold: GameValue | null | undefined, fallback: number | null): number | null {
    let base: number | null = fallback
    if (threshold?.tag === 'Static') base = threshold.contents
    else if (threshold?.tag === 'PerPlayer') base = threshold.contents * players()
    if (base === null) return null
    // Effects such as "+2 doom threshold per investigator" are modifiers on the agenda, not part of its printed value.
    return game().modifiers
      .filter(([target]) => target.tag === 'AgendaTarget' && target.contents === id)
      .flatMap(([, mods]) => mods)
      .reduce((acc, m) => (m.type.tag === 'DoomThresholdModifier' ? Math.max(0, acc + m.type.contents) : acc), base)
  }

  function clueLimit(advanceCost: unknown, offered: EntityChoice[], card: ArkhamDBCard | null): number | null {
    let gv = costClueValue(advanceCost)
    if (!gv) {
      for (const c of offered) {
        if (kindOf(c.contents) === 'objective' && 'ability' in c.contents && c.contents.ability.type.tag === 'Objective') {
          gv = costClueValue((c.contents.ability.type.abilityType as { cost?: unknown }).cost)
          if (gv) break
        }
      }
    }
    if (gv?.tag === 'Static') return gv.contents
    if (gv?.tag === 'PerPlayer') return gv.contents * players()
    if (card?.clues && card.clues > 0) return card.clues_fixed ? card.clues : card.clues * players()
    return null
  }

  function attachedTo(kind: 'act' | 'agenda', id: string, first: boolean): AttachedCard[] {
    const g = game()
    const here = (p: { tag: string; contents?: unknown }) =>
      first && p.tag === (kind === 'act' ? 'NextToAct' : 'NextToAgenda') ||
      kind === 'agenda' && p.tag === 'AttachedToAgenda' && p.contents === id
    const make = (key: string, id: string, code: string, art = code): AttachedCard => ({ key, id, code, image: cardImage(art), name: cardInfo(code)?.name ?? code })
    return [
      ...Object.values(g.treacheries).filter((c) => here(c.placement)).map((c) => make(`t${c.id}`, c.id, c.cardCode)),
      ...Object.values(g.enemies).filter((c) => here(c.placement)).map((c) => make(`e${c.id}`, c.id, c.cardCode, c.flipped ? `${c.cardCode}b` : c.cardCode)),
      ...Object.values(g.events).filter((c) => here(c.placement)).map((c) => make(`v${c.id}`, c.id, c.cardCode)),
      ...Object.values(g.assets).filter((c) => here(c.placement)).map((c) => make(`a${c.id}`, c.id, c.cardCode, c.flipped ? `${c.cardCode}b` : c.cardCode)),
      ...Object.values(g.stories).filter((c) => here(c.placement)).map((c) => make(`s${c.id}`, c.id, c.id.replace(/^c/, ''), c.flipped ? c.flippedArt : c.art)),
    ]
  }

  /* Cards placed 'next to' the act / agenda deck belong to the first deck of that kind. */
  const firstDeck = computed(() => ({
    act: Math.min(...Object.values(game().acts).map((a) => a.deckId)),
    agenda: Math.min(...Object.values(game().agendas).map((a) => a.deckId)),
  }))

  function describe(kind: 'act' | 'agenda', id: string, deckId: number, step: number, flipped: boolean, doom: number | null, threshold?: GameValue | null, advanceCost?: unknown): MissionPanel {
    const card = cardInfo(id)
    const s = scenario()
    const stack = kind === 'act'
      ? [s.actStack[deckId], s.completedActStack[deckId]]
      : [s.agendaStack[deckId], s.completedAgendaStack[deckId]]
    const total = Math.max(step, step + (stack[0]?.length ?? 0) + (stack[1]?.length ?? 0))
    const entityChoices = choicesFor(choices.value, id)
    const objectiveChoice = entityChoices.find((c) => kindOf(c.contents) === 'objective')
    const targetIndex = choices.value.findIndex((c) => c.tag === MessageType.TARGET_LABEL && c.target.contents === id)
    const printed = (flipped ? card?.back_text : card?.text) ?? ''
    return {
      key: `${kind}${deckId}`, kind, code: id, image: cardImage(id, flipped ? 'b' : ''), step, total,
      title: (flipped ? card?.back_name : card?.name) ?? card?.name ?? id,
      flavor: plainText(flipped ? card?.back_flavor : card?.flavor),
      // The action / fast lines get their own rows, so they are left out of the body text.
      textHtml: replaceText(
        printed.split(/\n|<br\s*\/?>/i)
          .filter((line) => line.trim() && !LINE_KIND.some(([re, k]) => (k === 'action' || k === 'fast') && re.test(line)))
          .join('\n'),
      ),
      doom, doomMax: kind === 'agenda' ? doomLimit(id, threshold, card?.doom ?? null) : null,
      clues: kind === 'act' ? game().totalClues : null,
      clueMax: kind === 'act' ? clueLimit(advanceCost, entityChoices, card) : null,
      advanceIndex: objectiveChoice?.index ?? (targetIndex !== -1 ? targetIndex : null),
      choices: entityChoices.filter((c) => !['action', 'fast'].includes(kindOf(c.contents) ?? '') && c.index !== objectiveChoice?.index),
      actions: actionRows(printed, entityChoices, id),
      attached: attachedTo(kind, id, deckId === firstDeck.value[kind]),
    }
  }

  // Agenda first (the clock), then the act (the goal); the reference card follows in the template.
  const panels = computed<MissionPanel[]>(() => [
    ...Object.values(game().agendas).sort((a, b) => a.deckId - b.deckId)
      .map((a) => describe('agenda', a.id, a.deckId, a.sequence.step, a.flipped, a.doom, a.doomThreshold)),
    ...Object.values(game().acts).sort((a, b) => a.deckId - b.deckId)
      .map((a) => describe('act', a.id, a.deckId, a.sequence.number, /[bdfh]/i.test(a.sequence.side), null, null, a.advanceCost)),
  ])

  /* An agenda advances on all the doom in play (on enemies, locations, assets ... too), not just the doom on
   * the card, so its meter fills to that total and the warning counts what is left before the threshold. */
  const totalDoom = computed(() => game().totalDoom)
  const doomLeft = (p: MissionPanel) => p.doomMax === null ? null : p.doomMax - totalDoom.value
  const meterValue = (p: MissionPanel) => (p.kind === 'agenda' ? totalDoom.value : p.clues) ?? 0

  /* When a meter's value changes, the pips between the old and new count animate for a moment. */
  const changes = ref<Record<string, MeterChange>>({})
  const timers = new Map<string, ReturnType<typeof setTimeout>>()
  watch(
    () => panels.value.map((p) => [p.key, meterValue(p)] as const),
    (now, before) => {
      for (const [key, value] of now) {
        const prev = before?.find(([k]) => k === key)?.[1]
        if (prev === undefined || prev === value) continue
        changes.value = { ...changes.value, [key]: { from: prev, to: value } }
        clearTimeout(timers.get(key))
        timers.set(key, setTimeout(() => {
          const { [key]: _gone, ...rest } = changes.value
          changes.value = rest
        }, 2200))
      }
    },
  )
  onBeforeUnmount(() => timers.forEach(clearTimeout))

  return { panels, totalDoom, doomLeft, changes }
}
