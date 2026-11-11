/**
 * Concealed mini-cards (The Scarlet Keys): where they lie and how they group, shared by the card board
 * (Scenario.vue, Location.vue) and the scene map (LocationMap / LocationMapCanvas).
 *
 * A concealed card lies either at a location (`location.concealedCards`) or, in grid scenarios
 * (Without a Trace, Congress of the Keys), in a grid position kept in the scenario's
 * `meta.concealedCards` as `[[x, y], ids][]`. Unknown cards look alike, so they are drawn as one stack
 * with a count; known ones are drawn one by one.
 */
import type { Game } from '@/arkham/types/Game'
import type { Location } from '@/arkham/types/Location'
import type { Scenario } from '@/arkham/types/Scenario'
import type { Position } from '@/arkham/types/Placement'
import { concealedCardBackPath, concealedCardImagePath, type ConcealedCard } from '@/arkham/types/ConcealedCard'

export type ConcealedSplit = { known: ConcealedCard[]; unknown: ConcealedCard[] }
export type ConcealedGroup = ConcealedSplit & { position: Position }

/** Grid label of a position, the same one the backend's `gridLabel` builds: (-1, 0) is `posn0100`. */
export function positionToGridArea(pos: Position): string {
  const fmt = (n: number): string => (n < 0 ? 'n' : '') + Math.abs(n).toString().padStart(2, '0')
  return `pos${fmt(pos.x)}${fmt(pos.y)}`
}

export function splitConcealed(cards: ConcealedCard[]): ConcealedSplit {
  return { known: cards.filter((c) => c.known), unknown: cards.filter((c) => !c.known) }
}

/** The concealed cards lying at this location. */
export function concealedAt(game: Game, location: Location): ConcealedCard[] {
  const ids = location.concealedCards ?? []
  return ids.map((id) => game.concealed[id]).filter((c): c is ConcealedCard => Boolean(c))
}

/** Concealed cards in grid positions (not at a location), grouped by position. */
export function gridConcealedGroups(game: Game, scenario: Scenario): ConcealedGroup[] {
  const entries = scenario.meta?.concealedCards as [[number, number], string[]][] | undefined
  if (!Array.isArray(entries)) return []
  const groups = new Map<string, ConcealedGroup>()
  for (const [[x, y], ids] of entries) {
    const cards = ids.map((id) => game.concealed[id]).filter((c): c is ConcealedCard => Boolean(c))
    if (cards.length === 0) continue
    const key = `${x}:${y}`
    const group = groups.get(key) ?? { position: { x, y }, known: [], unknown: [] }
    const split = splitConcealed(cards)
    groups.set(key, { ...group, known: [...group.known, ...split.known], unknown: [...group.unknown, ...split.unknown] })
  }
  return [...groups.values()]
}

/** The image a player may see for this card: its face once flipped or known (as the board's hover shows), the shared back otherwise. */
export function visibleConcealedImage(card: ConcealedCard): string {
  return card.flipped || card.known ? concealedCardImagePath(card.kind) : concealedCardBackPath
}
