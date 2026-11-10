<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Game } from '@/arkham/types/Game'
import type { Scenario } from '@/arkham/types/Scenario'
import type { GameValue } from '@/arkham/types/Location'
import { MessageType } from '@/arkham/types/Message'
import type { ArkhamDBCard } from '@/stores/dbCards'
import { cardImage } from '@/arkham/cardImages'
import { useCardInfo } from '@/arkham/composables/useCardNames'
import { useGameChoices } from '@/arkham/composables/useGameChoices'
import { choicesFor, kindOf, LINE_KIND, type EntityChoice } from '@/arkham/locationChoices'
import AbilityButton from '@/arkham/components/AbilityButton.vue'
import ChaosTokenIcon from '@/arkham/components/ChaosTokenIcon.vue'
import { replaceText } from '@/arkham/cardTextFormat'
import { REFERENCE_TEXT_VI } from '@/arkham/referenceCardTextVi'

/* The current act and agenda as two banner panels above the map, the way the offline demo shows its
 * mission strip: a small card thumbnail, "ACT 1 / 3", the title, the full objective, and for the
 * agenda a doom meter. Text comes from the card database, formatted with its icons the way the card
 * overlay formats it; the abilities are the server's own choices. Hovering the thumbnail opens the
 * card overlay with the card at full size (CardOverlay reads `data-image`). */
const props = defineProps<{ game: Game; scenario: Scenario; playerId: string; referenceImage?: string }>()
const emit = defineEmits<{ (e: 'choose', index: number): void }>()

const { t, locale } = useI18n()
const cardInfo = useCardInfo()
const choices = useGameChoices(() => props.game, () => props.playerId)

// Printed text carries markup (bold tags, [[Trait]], [action]); the banner shows it plain.
const plain = (text: string | undefined) => (text ?? '')
  .replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\[\[([^\]]+)\]\]/g, '$1').replace(/\[[a-z]+\]/gi, '').trim()

type Panel = {
  key: string; kind: 'act' | 'agenda'; code: string; image: string; step: number; total: number
  title: string; flavor: string; textHtml: string
  doom: number | null; doomMax: number | null
  clues: number | null; clueMax: number | null; advanceIndex: number | null
  choices: EntityChoice[]; actions: ActionRow[]; attached: Attached[]
}

/* A card sitting on / next to an act or agenda (a treachery attached to the agenda, a story placed
 * beside the act ...), shown as a small card so it is not lost off the strip. */
type Attached = { key: string; code: string; image: string; name: string }

/* The agenda's real threshold comes from the server (a fixed number, or per investigator); the card
 * database only has it for some cards, so it is the fallback. */
function doomLimit(threshold: GameValue | null | undefined, fallback: number | null): number | null {
  if (threshold?.tag === 'Static') return threshold.contents
  if (threshold?.tag === 'PerPlayer') return threshold.contents * Math.max(1, Object.keys(props.game.investigators).length)
  return fallback
}

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

function clueLimit(advanceCost: unknown, offered: EntityChoice[], card: ArkhamDBCard | null): number | null {
  const players = Math.max(1, Object.keys(props.game.investigators).length)
  let gv = costClueValue(advanceCost)
  if (!gv) {
    for (const c of offered) {
      if (kindOf(c.contents) === 'objective' && 'ability' in c.contents && c.contents.ability.type.tag === 'Objective') {
        const inner = c.contents.ability.type.abilityType as { cost?: unknown }
        gv = costClueValue(inner.cost)
        if (gv) break
      }
    }
  }
  if (gv?.tag === 'Static') return gv.contents
  if (gv?.tag === 'PerPlayer') return gv.contents * players
  if (card?.clues && card.clues > 0) return card.clues_fixed ? card.clues : card.clues * players
  return null
}

/* An act or agenda's printed action / fast lines are always listed. A line is green when the server
 * offers its ability right now (and then it sends that choice), grey when it cannot be used. The server
 * only offers usable abilities, so offered ones are matched to the printed lines of the same kind in
 * order; when fewer are offered than printed, the offered ones come first. */
type ActionRow = { key: string; kind: 'action' | 'fast'; html: string; choice: EntityChoice | null }

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

function attachedTo(kind: 'act' | 'agenda', id: string, first: boolean): Attached[] {
  const g = props.game
  const here = (p: { tag: string; contents?: unknown }) =>
    first && p.tag === (kind === 'act' ? 'NextToAct' : 'NextToAgenda') ||
    kind === 'agenda' && p.tag === 'AttachedToAgenda' && p.contents === id
  const make = (key: string, code: string, art = code): Attached => ({ key, code, image: cardImage(art), name: cardInfo(code)?.name ?? code })
  return [
    ...Object.values(g.treacheries).filter((c) => here(c.placement)).map((c) => make(`t${c.id}`, c.cardCode)),
    ...Object.values(g.enemies).filter((c) => here(c.placement)).map((c) => make(`e${c.id}`, c.cardCode, c.flipped ? `${c.cardCode}b` : c.cardCode)),
    ...Object.values(g.events).filter((c) => here(c.placement)).map((c) => make(`v${c.id}`, c.cardCode)),
    ...Object.values(g.assets).filter((c) => here(c.placement)).map((c) => make(`a${c.id}`, c.cardCode, c.flipped ? `${c.cardCode}b` : c.cardCode)),
    ...Object.values(g.stories).filter((c) => here(c.placement)).map((c) => make(`s${c.id}`, c.id.replace(/^c/, ''), c.flipped ? c.flippedArt : c.art)),
  ]
}

/* Cards placed 'next to' the act / agenda deck belong to the first deck of that kind. */
const firstDeck = computed(() => ({
  act: Math.min(...Object.values(props.game.acts).map((a) => a.deckId)),
  agenda: Math.min(...Object.values(props.game.agendas).map((a) => a.deckId)),
}))

function describe(kind: 'act' | 'agenda', id: string, deckId: number, step: number, flipped: boolean, doom: number | null, threshold?: GameValue | null, advanceCost?: unknown): Panel {
  const card = cardInfo(id)
  const stack = kind === 'act'
    ? [props.scenario.actStack[deckId], props.scenario.completedActStack[deckId]]
    : [props.scenario.agendaStack[deckId], props.scenario.completedAgendaStack[deckId]]
  const total = Math.max(step, step + (stack[0]?.length ?? 0) + (stack[1]?.length ?? 0))
  const entityChoices = choicesFor(choices.value, id)
  const objectiveChoice = entityChoices.find((c) => kindOf(c.contents) === 'objective')
  const targetIndex = choices.value.findIndex((c) => c.tag === MessageType.TARGET_LABEL && c.target.contents === id)
  const advanceIndex = objectiveChoice?.index ?? (targetIndex !== -1 ? targetIndex : null)
  return {
    key: `${kind}${deckId}`, kind, code: id, image: cardImage(id, flipped ? 'b' : ''), step, total,
    title: (flipped ? card?.back_name : card?.name) ?? card?.name ?? id,
    flavor: plain(flipped ? card?.back_flavor : card?.flavor),
    // The action / fast lines are shown inside their own action box, so they are left out of the body text.
    textHtml: replaceText(
      ((flipped ? card?.back_text : card?.text) ?? '').split(/\n|<br\s*\/?>/i)
        .filter((line) => line.trim() && !LINE_KIND.some(([re, k]) => (k === 'action' || k === 'fast') && re.test(line)))
        .join('\n'),
    ),
    doom, doomMax: kind === 'agenda' ? doomLimit(threshold, card?.doom ?? null) : null,
    clues: kind === 'act' ? props.game.totalClues : null,
    clueMax: kind === 'act' ? clueLimit(advanceCost, entityChoices, card) : null,
    advanceIndex,
    choices: entityChoices.filter((c) => !['action', 'fast'].includes(kindOf(c.contents) ?? '') && c.index !== objectiveChoice?.index),
    actions: actionRows((flipped ? card?.back_text : card?.text) ?? '', entityChoices, id),
    attached: attachedTo(kind, id, deckId === firstDeck.value[kind]),
  }
}

// Agenda first (the clock), then the act (the goal); the reference card follows in the template.
/* The pips show the doom on the agenda card itself, but an agenda advances on all the doom in play (on enemies,
 * locations, assets ... too), so the warning counts that total: how much is left before the threshold. */
const doomLeft = (p: Panel) => p.doomMax === null ? null : p.doomMax - props.game.totalDoom

const panels = computed<Panel[]>(() => [
  ...Object.values(props.game.agendas).sort((a, b) => a.deckId - b.deckId)
    .map((a) => describe('agenda', a.id, a.deckId, a.sequence.step, a.flipped, a.doom, a.doomThreshold)),
  ...Object.values(props.game.acts).sort((a, b) => a.deckId - b.deckId)
    .map((a) => describe('act', a.id, a.deckId, a.sequence.number, /[bdfh]/i.test(a.sequence.side), null, null, a.advanceCost)),
])

/* When an agenda's doom or act's clues change, the pips between the old and new count animate for a moment
 * so the player sees the change. Keyed by panel; cleared after the animation. */
const doomChange = ref<Record<string, { from: number; to: number }>>({})
const timers = new Map<string, ReturnType<typeof setTimeout>>()
watch(
  () => panels.value.map((p) => [p.key, (p.kind === 'agenda' ? p.doom : p.clues) ?? 0] as const),
  (now, before) => {
    for (const [key, doom] of now) {
      const prev = before?.find(([k]) => k === key)?.[1]
      if (prev === undefined || prev === doom) continue
      doomChange.value = { ...doomChange.value, [key]: { from: prev, to: doom } }
      clearTimeout(timers.get(key))
      timers.set(key, setTimeout(() => {
        const { [key]: _gone, ...rest } = doomChange.value
        doomChange.value = rest
      }, 2200))
    }
  },
)
onBeforeUnmount(() => timers.forEach(clearTimeout))
const pipChanged = (key: string, n: number) => {
  const c = doomChange.value[key]
  return !!c && n > Math.min(c.from, c.to) && n <= Math.max(c.from, c.to)
}

/* The Feast of Hemlock Vale tracks a day and a time of day in the campaign meta; show it beside the
 * reference card (the same source the campaign log's Day / Time sheet reads). */
const dayTime = computed(() => {
  if (props.game.campaign?.id !== '10') return null
  const meta = props.game.campaign.meta as { day?: string; time?: string } | undefined
  const day = /^Day(\d+)$/.exec(meta?.day ?? '')?.[1]
  if (!day || !meta?.time) return null
  return { day, time: meta.time }
})
/* Counters the scenario keeps on its reference card (scraps, switches, targets ...), shown as chips. */
const referenceCounters = computed(() => [
  ...Object.entries(props.scenario.tokens ?? {}),
  ...Object.entries(props.scenario.counts ?? {}),
].filter(([, n]) => typeof n === 'number' && n > 0)
  .map(([name, n]) => ({ name, label: name.replace(/([a-z])([A-Z])/g, '$1 $2'), n: n as number })))

/* The scenario reference card's chaos-token lines, in the player's language, for the side that is
 * showing (the image path ends in the card code, with a trailing `b` for the back / hard side). The
 * Vietnamese card file still carries English for these cards, so a bundled translation wins there. */
type TokenLine = { key: string; token: string; html: string }
const parsedReference = computed(() => {
  const hb = /homebrew\/([^/]+)\/cards\/([^/.]+?)(b?)\.[a-z0-9]+(?:\?.*)?$/i.exec(props.referenceImage ?? '')
  if (hb) {
    return { code: `:${hb[1]}:${hb[2]}`, side: hb[3] }
  }
  const m = /(\d{5})(b?)\.[a-z0-9]+(?:\?.*)?$/i.exec(props.referenceImage ?? '')
  if (m) {
    return { code: m[1], side: m[2] }
  }
  return null
})

const referenceCardCode = computed(() => {
  const parsed = parsedReference.value
  if (parsed) return `${parsed.code}${parsed.side}`
  return props.scenario?.reference
})

const referenceInfo = computed<{ heading: string; lines: TokenLine[] } | null>(() => {
  const parsed = parsedReference.value
  if (!parsed) return null
  const { code, side } = parsed
  const card = cardInfo(code)
  const key = side === 'b' ? 'back_text' : 'text'
  const own = card?.[key] ?? ''
  const vi = locale.value === 'vi' && /^(Easy|Hard)/.test(own) ? REFERENCE_TEXT_VI[code]?.[key] : undefined
  const raw = (vi ?? own).split('\n').map((l) => l.trim()).filter(Boolean)
  if (!raw.length) return null
  const lines: TokenLine[] = []
  let heading = ''
  for (const line of raw) {
    const tok = /^\[(skull|cultist|tablet|elder_thing|auto_fail|elder_sign)\]:?\s*(.*)$/.exec(line)
    if (tok) lines.push({ key: `${code}-${lines.length}`, token: tok[1], html: replaceText(tok[2]) })
    else if (!lines.length) heading = plain(line)
  }
  if (locale.value === 'vi') {
    if (/^Easy\s*\/\s*Standard/i.test(heading)) heading = 'Dễ / Tiêu chuẩn'
    else if (/^Hard\s*\/\s*Expert/i.test(heading)) heading = 'Khó / Chuyên gia'
  }
  return { heading, lines }
})
import GameIcon from '@/arkham/components/GameIcon.vue'
</script>

<template>
  <div v-if="panels.length" class="mission-strip">
    <article v-for="p in panels" :key="p.key" class="mission" :class="p.kind">
      <div class="body">
        <img class="thumb thumb--landscape" :src="p.image" :data-image="p.image" :data-card-code="p.code" :alt="p.title" loading="lazy" />
        <div class="head">
          <span class="eyebrow">{{ t(`locationMap.${p.kind}`) }} {{ p.step }} / {{ p.total }}</span>
          <div class="head-aside">
            <div
              v-if="p.doom !== null"
              class="doom"
              :class="{ 'doom--changed': !!doomChange[p.key], 'doom--critical': doomLeft(p) !== null && doomLeft(p)! <= 1 }"
            >
              <span v-if="!p.doomMax">{{ t('locationMap.doomCount', { count: p.doom, max: '?' }) }}</span>
              <div v-if="p.doomMax && p.doomMax <= 14" class="doom-pips" role="img" :title="t('locationMap.doomCount', { count: p.doom, max: p.doomMax })" :aria-label="t('locationMap.doomCount', { count: p.doom, max: p.doomMax })">
                <i
                  v-for="n in p.doomMax"
                  :key="n"
                  class="pip"
                  :class="{ filled: n <= p.doom!, 'pip--gain': pipChanged(p.key, n) && n <= p.doom!, 'pip--loss': pipChanged(p.key, n) && n > p.doom! }"
                ><GameIcon type="doom" /></i>
                <span v-if="doomChange[p.key] && doomChange[p.key].to !== doomChange[p.key].from" :key="doomChange[p.key].to" class="doom-delta" :class="{ 'doom-delta--loss': doomChange[p.key].to < doomChange[p.key].from }">
                  {{ doomChange[p.key].to > doomChange[p.key].from ? '+' : '−' }}{{ Math.abs(doomChange[p.key].to - doomChange[p.key].from) }}
                </span>
              </div>
              <i v-else-if="p.doomMax" class="doom-bar"><b :style="{ width: Math.min(100, (100 * p.doom) / p.doomMax) + '%' }"></b></i>
              <span v-if="doomLeft(p) !== null && doomLeft(p)! <= 0" class="doom-alert">{{ t('locationMap.doomAdvancing') }}</span>
              <span v-else-if="doomLeft(p) === 1" class="doom-alert">{{ t('locationMap.doomImminent') }}</span>
            </div>
            <div
              v-if="p.clues !== null"
              class="clues"
              :class="{ 'clues--changed': !!doomChange[p.key], 'clues--ready': p.clueMax !== null && p.clues >= p.clueMax }"
            >
              <div class="clue-row">
                <span v-if="!p.clueMax" class="total clue-total" :title="t('locationMap.clueCount', { count: p.clues, max: '—' })">
                  <GameIcon type="clue" /> {{ t('locationMap.clueCount', { count: p.clues, max: '—' }) }}
                </span>
                <div v-else-if="p.clueMax <= 14" class="doom-pips clue-pips" role="img" :title="t('locationMap.clueCount', { count: p.clues, max: p.clueMax })" :aria-label="t('locationMap.clueCount', { count: p.clues, max: p.clueMax })">
                  <i
                    v-for="n in p.clueMax"
                    :key="n"
                    class="pip pip--clue"
                    :class="{ filled: n <= p.clues!, 'pip--clue-gain': pipChanged(p.key, n) && n <= p.clues!, 'pip--loss': pipChanged(p.key, n) && n > p.clues! }"
                  ><GameIcon type="clue" /></i>
                  <span v-if="doomChange[p.key] && doomChange[p.key].to !== doomChange[p.key].from" :key="doomChange[p.key].to" class="doom-delta clue-delta" :class="{ 'doom-delta--loss': doomChange[p.key].to < doomChange[p.key].from }">
                    {{ doomChange[p.key].to > doomChange[p.key].from ? '+' : '−' }}{{ Math.abs(doomChange[p.key].to - doomChange[p.key].from) }}
                  </span>
                </div>
                <template v-else>
                  <i class="clue-bar"><b :style="{ width: Math.min(100, (100 * p.clues) / p.clueMax) + '%' }"></b></i>
                  <span class="total clue-total" :title="t('locationMap.clueCount', { count: p.clues, max: p.clueMax })">
                    <GameIcon type="clue" /> {{ t('locationMap.clueCount', { count: p.clues, max: p.clueMax }) }}
                  </span>
                </template>
                <button
                  type="button"
                  class="advance-btn"
                  :class="p.advanceIndex !== null ? 'advance-btn--ready' : 'advance-btn--disabled'"
                  :disabled="p.advanceIndex === null"
                  :title="p.advanceIndex !== null ? t('locationMap.advanceAct') : t('locationMap.actionUnavailable')"
                  @click="p.advanceIndex !== null && emit('choose', p.advanceIndex)"
                >{{ t('locationMap.advanceAct') }}</button>
              </div>
            </div>
          </div>
        </div>
        <h3 class="title">{{ p.title }}</h3>
        <p v-if="p.flavor" class="flavor" :title="p.flavor">{{ p.flavor }}</p>
        <p v-if="p.textHtml" class="text" v-html="p.textHtml"></p>
        <div v-for="a in p.actions" :key="a.key" class="act-row" :class="a.choice ? 'act-row--usable' : 'act-row--disabled'">
          <!-- the printed line already starts with the action icon, so the button is just the text -->
          <button v-if="a.choice && a.html" type="button" class="act-row__use" @click="emit('choose', a.choice.index)">
            <span class="act-row__text" v-html="a.html"></span>
          </button>
          <AbilityButton v-else-if="a.choice" :game="game" :ability="a.choice.contents" @choose="emit('choose', a.choice.index)" />
          <div v-else class="act-row__btn" :title="t('locationMap.actionUnavailable')">
            <span v-if="a.html" class="act-row__text" v-html="a.html"></span>
          </div>
        </div>
        <AbilityButton v-for="c in p.choices" :key="c.index" :game="game" :ability="c.contents" @choose="emit('choose', c.index)" />
        <div v-if="p.attached.length" class="attached">
          <img v-for="a in p.attached" :key="a.key" :src="a.image" :data-image="a.image" :data-card-code="a.code" :title="a.name" :alt="a.name" loading="lazy" />
        </div>
      </div>
    </article>
    <article v-if="referenceImage" class="mission reference">
      <div class="body">
        <img class="thumb thumb--portrait" :src="referenceImage" :data-image="referenceImage" :data-card-code="referenceCardCode" :alt="t('locationMap.reference')" loading="lazy" />
        <div class="head">
          <span class="eyebrow">{{ t('locationMap.reference') }}<template v-if="referenceInfo?.heading"> · {{ referenceInfo.heading }}</template></span>
          <div class="head-aside">
            <div v-if="dayTime" class="total day-total" :title="t('locationMap.dayCount', { count: dayTime.day })">
              {{ dayTime.time === 'Night' ? '☾' : '☀' }}
              {{ t('locationMap.dayCount', { count: dayTime.day }) }} ·
              <b>{{ t(`locationMap.timeOfDay.${dayTime.time}`) }}</b>
            </div>
          </div>
        </div>
        <h3 class="title">{{ scenario.name?.title ?? '' }}</h3>
        <div v-if="referenceCounters.length" class="counters">
          <span v-for="c in referenceCounters" :key="c.name" class="counter">{{ c.label }} <b>{{ c.n }}</b></span>
        </div>
        <template v-if="referenceInfo">
          <ul class="ref-tokens">
            <li v-for="l in referenceInfo.lines" :key="l.key"><span class="ref-token"><ChaosTokenIcon :token="l.token" /></span><span class="ref-effect" v-html="l.html"></span></li>
          </ul>
        </template>
      </div>
    </article>
  </div>
</template>

<style scoped>
.mission-strip { display: flex; flex-wrap: wrap; align-items: stretch; gap: 6px; padding: 4px 8px; background: #101a14; border-bottom: 1px solid #a68b5540; }
.mission { flex: 1 1 320px; display: flex; padding: 5px 8px; background: #16221b; border: 1px solid #c6a87366; border-radius: 6px; color: #e5e2d4; min-width: 0; }
/* The reference card's token lines are short, so it takes less width and leaves it to the agenda / act text. */
.mission.reference { flex: 0.8 1 300px; border-color: #8fb4a066; }
.day-total { color: #f0d9a8; border: 1px solid #c6a87388; white-space: nowrap; }
.mission.agenda { border-color: #c9887a88; }
/* The card art floats top-right: the title row and text run to its left, then take the full width below it. */
.thumb { float: right; margin: 1px 0 4px 10px; height: auto; object-fit: cover; border-radius: 5px; border: 1px solid #c6a87355; box-shadow: 0 2px 8px #0008; }
.thumb--landscape { width: 92px; aspect-ratio: 1.4; }
.thumb--portrait { width: 50px; aspect-ratio: 0.72; }
.head { display: flex; align-items: center; justify-content: space-between; gap: 6px; flex-wrap: wrap; }
.head-aside { display: flex; align-items: center; gap: 4px; flex: none; }
.head-aside .total { margin-top: 0; }
.body { display: flow-root; min-width: 0; flex: 1; }
.body > * + * { margin-top: 3px; }
.body > .thumb + * { margin-top: 0; }
.eyebrow { text-transform: uppercase; letter-spacing: 0.18em; font-size: 0.6rem; color: #c6a873; line-height: 1.2; flex: none; }
.agenda .eyebrow { color: #d99e8e; }
.title, h3 { margin: 1px 0 2px; font: 600 0.92rem/1.25 var(--ui-serif); color: #fff4df; word-break: normal; overflow-wrap: break-word; }
p { margin: 0; font-size: 0.74rem; line-height: 1.3; }
.flavor { color: #b9c2ad; font-style: italic; max-height: 5.2em; overflow-y: auto; padding-right: 4px; scrollbar-width: thin; }
.text { color: #e9e3cc; white-space: pre-line; }
.thumb { cursor: zoom-in; }
.doom { display: flex; flex-direction: column; gap: 2px; font-size: 0.7rem; color: #f0d9a8; }
.doom .doom-bar { display: block; height: 6px; background: #5a4a40; border-radius: 3px; overflow: hidden; }
.doom-pips { display: flex; flex-wrap: wrap; gap: 3px; }
/* Every slot gets a ring so the track length reads at a glance: empty slots show a pale outline
   on a lighter well (the dark doom glyph alone vanished into the dark strip), filled ones a red ring. */
.pip { font-style: normal; display: inline-grid; place-items: center; width: 18px; height: 18px; font-size: 0.8rem; line-height: 1; border-radius: 50%; box-sizing: border-box; border: 1.5px solid #c6a87399; background: #f0d9a81a; }
.pip :deep(.game-icon) { width: 14px; height: 14px; opacity: 0.35; filter: grayscale(1) brightness(1.3); }
.pip.filled { border-color: #ff7a64; background: #5a1a14aa; box-shadow: 0 0 4px #ff5a4a88; }
.pip.filled :deep(.game-icon) { opacity: 1; filter: drop-shadow(0 1px 1.5px #000a); }
.pip--clue { border-color: #7ab8cc99; background: #9fd3e61a; }
.pip--clue.filled { border-color: #6ce0a3; background: #144932cc; box-shadow: 0 0 5px #45d98888; }
.clues { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; font-size: 0.7rem; color: #9fd3e6; }
.clue-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: 6px; }
.clue-bar { display: block; width: 72px; height: 6px; background: #27424c; border-radius: 3px; overflow: hidden; }
.clue-bar b { display: block; height: 100%; background: #5fd88a; }
.clues--ready .clue-total { border-color: #5fd88acc; color: #c7f9d8; }
.clues--changed { animation: clue-flash 1.4s ease-out; }
.pip--clue-gain { animation: pip-clue-gain 1.1s cubic-bezier(.2,1.6,.4,1) both; }
.clue-delta { color: #7ef0a8; text-shadow: 0 0 8px #3ddc7a; }
.advance-btn { padding: 2px 9px; border-radius: 999px; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.03em; border: 1px solid #4a5550; background: #232c27; color: #7f8c84; transition: background 0.15s, border-color 0.15s, box-shadow 0.15s, transform 0.1s; }
.advance-btn--disabled { cursor: not-allowed; opacity: 0.65; }
.advance-btn--ready { cursor: pointer; background: linear-gradient(180deg, #279a4c, #1b6e35); border-color: #7ef0a8; color: #f4fff7; box-shadow: 0 0 8px #3ddc7a88; animation: advance-pulse 1.5s ease-in-out infinite; }
.advance-btn--ready:hover { background: linear-gradient(180deg, #2fb359, #218340); transform: translateY(-1px); }
@keyframes advance-pulse { 50% { box-shadow: 0 0 12px 2px #5fd88acc; } }
@keyframes pip-clue-gain {
  0% { transform: scale(2.4); box-shadow: 0 0 0 0 #45d988cc; filter: brightness(2); }
  50% { transform: scale(1.35); box-shadow: 0 0 14px 6px #45d98899; }
  100% { transform: scale(1); box-shadow: 0 0 0 0 #45d98800; filter: none; }
}
@keyframes clue-flash { 0% { background: #3ddc7a44; } 100% { background: transparent; } }
.doom-left { color: #b9a88a; }
.doom-alert { font-weight: 700; color: #ff9b86; }
.doom--critical { padding: 3px 6px; border-radius: 6px; background: #5a1a1466; box-shadow: 0 0 0 1px #ff5a4a99; animation: doom-pulse 1.2s ease-in-out infinite; }
.doom--critical .pip.filled :deep(.game-icon) { filter: drop-shadow(0 0 4px #ff5a4a); }
@keyframes doom-pulse { 50% { box-shadow: 0 0 10px 2px #ff5a4acc; } }
/* One box per action: the printed text sits inside it, green when usable, grey when not. */
.act-row { display: flex; flex-direction: column; gap: 2px; margin-top: 2px; padding: 2px 6px 3px; border-radius: 6px; border: 1px solid #4a4f4b; background: #2b2f2c; }
.act-row__text { font-size: 0.68rem; line-height: 1.25; text-align: left; }
.act-row--usable { background: #1f7a3d; border-color: #5fd88a; color: #f1fff4; box-shadow: 0 0 8px #3ddc7a55; cursor: pointer; }
.act-row--usable:hover { background: #279a4c; }
.act-row__use { all: unset; display: block; width: 100%; cursor: pointer; }
.act-row--usable :deep(button) { background: transparent; border: 0; padding: 0; min-height: 0; color: inherit; cursor: pointer; }
.act-row--disabled { color: #8b918c; cursor: not-allowed; }
.act-row--disabled .act-row__text :deep(img) { opacity: 0.5; filter: grayscale(1); }
.doom-pips { align-items: center; }
.pip--gain { animation: pip-gain 1.1s cubic-bezier(.2,1.6,.4,1) both; }
.pip--loss { animation: pip-loss 0.9s ease-out both; }
.doom--changed { animation: doom-flash 1.4s ease-out; }
.doom-delta { margin-left: 4px; font-weight: 800; font-size: 0.95rem; color: #ff9b86; text-shadow: 0 0 8px #ff5a4a; animation: doom-delta 2.1s ease-out both; }
.doom-delta--loss { color: #9fd3a6; text-shadow: 0 0 8px #4aff7a88; }
@keyframes pip-gain {
  0% { transform: scale(2.4); box-shadow: 0 0 0 0 #ff5a4acc; filter: brightness(2); }
  50% { transform: scale(1.35); box-shadow: 0 0 14px 6px #ff5a4a99; }
  100% { transform: scale(1); box-shadow: 0 0 0 0 #ff5a4a00; filter: none; }
}
@keyframes pip-loss { 0% { transform: scale(1.4); opacity: 0.4; } 100% { transform: scale(1); opacity: 1; } }
@keyframes doom-flash { 0% { background: #c9684f66; } 100% { background: transparent; } }
@keyframes doom-delta { 0% { transform: translateY(6px) scale(.6); opacity: 0; } 15% { transform: translateY(0) scale(1.4); opacity: 1; } 70% { opacity: 1; } 100% { transform: translateY(-6px) scale(1); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .doom--critical, .pip--gain, .pip--loss, .doom--changed, .doom-delta { animation: none; } }
.total { display: inline-flex; align-items: center; gap: 6px; align-self: flex-start; margin-top: 2px; padding: 2px 8px; border-radius: 999px; font-size: 0.7rem; background: #0006; }
.total b { font-size: 0.9rem; color: #fff4df; }
.doom-total { color: #e8a08d; border: 1px solid #c9684f88; }
.clue-total { color: #9fd3e6; border: 1px solid #5fa8c488; }
.attached { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
.attached img { height: 44px; width: auto; border-radius: 4px; border: 1px solid #c9887a88; box-shadow: 0 2px 6px #0008; cursor: zoom-in; }
.counters { display: flex; flex-wrap: wrap; gap: 6px; margin: 2px 0; }
.counter { padding: 2px 10px; border-radius: 999px; font-size: 0.78rem; color: #f0d9a8; background: #0006; border: 1px solid #c6a87388; }
.counter b { color: #fff4df; font-size: 0.95rem; }
.ref-tokens { list-style: none; margin: 1px 0 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 2px 6px; }
.ref-tokens li { display: flex; align-items: flex-start; gap: 6px; padding: 1px 4px; border-radius: 4px; background: #0003; font-size: 0.7rem; line-height: 1.25; }
.ref-token { flex: none; width: 26px; height: 26px; }
.ref-effect { min-width: 0; color: #e9e3cc; }
.doom b { display: block; height: 100%; background: #c9684f; }
</style>
