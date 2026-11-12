/* Builds the plain context `referenceTokenX.ts` evaluates reference-card X values against, from the game
 * the client already holds. Card traits, types, names and vengeance come from the card store. */
import type { Game } from '@/arkham/types/Game'
import type { Scenario } from '@/arkham/types/Scenario'
import type { Placement } from '@/arkham/types/Placement'
import type { Tokens } from '@/arkham/types/Token'
import type { CardDef } from '@/arkham/types/CardDef'
import { type Card, toCardContents } from '@/arkham/types/Card'
import { computeStat } from '@/arkham/statModel'
import { ownInvestigator } from '@/arkham/ownInvestigator'
import type { XContext, XThing } from '@/arkham/referenceTokenX'

/** Placements that are not in play: out of play, in a hand or discard, on a deck, or in limbo. */
const NOT_IN_PLAY = new Set(['OutOfPlay', 'StillInHand', 'StillInDiscard', 'HiddenInHand', 'OnTopOfDeck', 'Limbo'])
const inPlay = (p: Placement): boolean => !NOT_IN_PLAY.has(p.tag)

const count = (tokens: Tokens | undefined, key: string): number => (tokens as Record<string, number> | undefined)?.[key] ?? 0

/** The scenario's counters and tokens, keyed by name in lower case without spaces ("StormIntensity" -> "stormintensity"). */
function countersOf(scenario: Scenario): Record<string, number> {
  const out: Record<string, number> = {}
  for (const [k, v] of [...Object.entries(scenario.counts ?? {}), ...Object.entries(scenario.tokens ?? {})]) {
    if (typeof v === 'number') out[k.toLowerCase().replace(/[^a-z]/g, '')] = v
  }
  return out
}

export function buildXContext(game: Game, scenario: Scenario, playerId: string, cards: readonly CardDef[]): XContext {
  const defs = new Map(cards.map((d) => [d.cardCode, d]))
  const def = (code: string) => defs.get(code) ?? defs.get(code.replace(/^c/, ''))
  const thing = (code: string, extra: Partial<XThing> = {}): XThing => {
    const d = def(code)
    return { name: d?.name.title, traits: d?.cardTraits ?? [], type: d?.cardType, doom: 0, clues: 0, ...extra }
  }

  const me = ownInvestigator(game, playerId)
  const myLocation = me?.location ?? null
  /* Investigators standing where you are: an enemy in their threat area or an asset in their play area is at your location. */
  const here = new Set(Object.values(game.investigators).filter((i) => myLocation && i.location === myLocation).map((i) => i.id))
  const atMyLocation = (p: Placement): boolean => {
    if (!myLocation) return false
    if (p.tag === 'AtLocation') return p.contents === myLocation
    if (p.tag === 'InThreatArea' || p.tag === 'InPlayArea') return here.has(p.contents)
    return false
  }

  const enemies = Object.values(game.enemies).filter((e) => inPlay(e.placement)).map((e) =>
    thing(e.cardCode, { doom: count(e.tokens, 'Doom'), clues: count(e.tokens, 'Clue'), yours: atMyLocation(e.placement) }))

  const locations = Object.values(game.locations).map((l) => thing(l.cardCode, {
    doom: count(l.tokens, 'Doom'),
    clues: count(l.tokens, 'Clue'),
    breaches: l.breaches?.contents ?? 0,
    yours: l.id === myLocation,
    revealed: l.revealed,
    printedShroud: l.shroud,
    shroud: l.shroud === null ? null : computeStat('shroud', l.shroud, l.modifiers).current,
    cardsUnderneath: l.cardsUnderneath.length,
  }))

  // An agenda's id is its card code.
  const agendas = Object.values(game.agendas).map((a) => thing(a.id, { doom: a.doom }))
  const assets = Object.values(game.assets).filter((a) => inPlay(a.placement)).map((a) =>
    thing(a.cardCode, { doom: count(a.tokens, 'Doom'), clues: count(a.tokens, 'Clue'), yours: atMyLocation(a.placement) }))
  const treacheries = Object.values(game.treacheries).filter((t) => inPlay(t.placement)).map((t) =>
    thing(t.cardCode, { doom: count(t.tokens, 'Doom') }))

  const victoryDisplay = (scenario.victoryDisplay ?? []).map((card: Card) => {
    const code = toCardContents(card).cardCode
    return thing(code, { vengeance: (def(code)?.vengeancePoints ?? 0) + (card.tag === 'VengeanceCard' ? 1 : 0) })
  })

  const doomInPlay =
    [...enemies, ...locations, ...agendas, ...assets, ...treacheries].reduce((n, t) => n + t.doom, 0)
    + Object.values(game.investigators).reduce((n, i) => n + count(i.tokens, 'Doom'), 0)

  const agendaSteps = Object.values(game.agendas).map((a) => a.sequence.step)
  const actNumbers = Object.values(game.acts).map((a) => a.sequence.number)
  const exploration = (scenario.decks ?? []).find(([k]) => k === 'ExplorationDeck')?.[1]

  return {
    enemies, locations, agendas, assets, treacheries, victoryDisplay, doomInPlay,
    agendaNumber: agendaSteps.length ? Math.min(...agendaSteps) : null,
    actNumber: actNumbers.length ? Math.min(...actNumbers) : null,
    you: me ? {
      horror: count(me.tokens, 'Horror'),
      damage: count(me.tokens, 'Damage'),
      hand: me.hand.length,
      clues: count(me.tokens, 'Clue'),
      keys: me.keys.length,
      // The Forgotten Age: a Poisoned weakness in your threat area.
      poisoned: Object.values(game.treacheries).some((t) =>
        t.placement.tag === 'InThreatArea' && t.placement.contents === me.id && def(t.cardCode)?.name.title === 'Poisoned'),
    } : null,
    investigatorKeys: Object.values(game.investigators).reduce((n, i) => n + i.keys.length, 0),
    explorationDeck: exploration ? exploration.length : null,
    counters: countersOf(scenario),
  }
}
