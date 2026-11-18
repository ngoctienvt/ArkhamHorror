/**
 * "Pick this card" choices (CardIdTarget) whose card lies in a zone the scene map does not draw.
 *
 * Question.vue leaves out every card choice whose card the card board renders, since the board makes that
 * card clickable: the scenario discard, the victory display, set-aside cards, cards under the act, agenda,
 * locations or the scenario reference, cards removed from play. In scene mode that part of the board is
 * hidden (it only opens with the DECK toggle), so without this list such a choice had no visible control
 * and could only be answered by switching to the card board.
 *
 * The player zone (hand, play area, own discard, cards under your assets) is drawn in scene mode as well,
 * and the skill test panel shows committed cards, so those are left out here.
 *
 * Types only at runtime, like sceneTargetFallback, so node tests can load it without the Vue toolchain.
 */
import type { Game } from '@/arkham/types/Game'
import type { Message } from '@/arkham/types/Message'

export interface HiddenCardChoice { index: number; id: string; cardCode: string }

type CardLike = { tag?: string; id?: string; cardCode?: string; contents?: unknown }

/** A Card (PlayerCard / EncounterCard / VengeanceCard) or bare card contents, as `{ id, cardCode }`. */
function contentsOf(card: unknown, depth = 0): { id: string; cardCode: string } | null {
  if (!card || typeof card !== 'object' || depth > 3) return null
  const c = card as CardLike
  if (typeof c.id === 'string' && typeof c.cardCode === 'string') return { id: c.id, cardCode: c.cardCode }
  return c.contents === undefined ? null : contentsOf(c.contents, depth + 1)
}

const list = (cards: unknown): unknown[] => (Array.isArray(cards) ? cards : [])

/** Every card in a zone only the card board draws, by id. */
function boardOnlyCards(game: Game): Map<string, string> {
  const found = new Map<string, string>()
  const add = (cards: unknown) => list(cards).forEach((card) => {
    const c = contentsOf(card)
    if (c) found.set(c.id, c.cardCode)
  })
  const scenario = game.scenario as unknown as Record<string, unknown> | null | undefined
  if (scenario) {
    for (const key of ['discard', 'victoryDisplay', 'setAsideCards', 'cardsUnderScenarioReference', 'cardsUnderAgendaDeck',
      'cardsUnderActDeck', 'cardsNextToAgendaDeck', 'cardsNextToActDeck']) add(scenario[key])
    list(scenario.deckDiscards).forEach((entry) => Array.isArray(entry) && add(entry[1]))
  }
  add(game.removedFromPlay)
  for (const pool of [game.locations, game.acts, game.agendas]) {
    Object.values((pool ?? {}) as Record<string, { cardsUnderneath?: unknown }>).forEach((e) => add(e.cardsUnderneath))
  }
  return found
}

export function sceneHiddenCardChoices(game: Game, choices: readonly Message[]): HiddenCardChoice[] {
  const hidden = boardOnlyCards(game)
  if (hidden.size === 0) return []
  const result: HiddenCardChoice[] = []
  choices.forEach((choice, index) => {
    if ((choice.tag as string) !== 'TargetLabel') return
    const target = (choice as { target?: { tag?: string; contents?: unknown } }).target
    if (target?.tag !== 'CardIdTarget' || typeof target.contents !== 'string') return
    const cardCode = hidden.get(target.contents)
    if (cardCode) result.push({ index, id: target.contents, cardCode })
  })
  return result
}
