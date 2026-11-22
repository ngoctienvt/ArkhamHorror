/* A card the player just chose to discard -- from their hand, or an asset or
 * event they have in play -- goes to their discard pile at once.
 *
 * The server's update for that answer can wait a while behind other things: an
 * upkeep hand-size discard ends the round, so the board holding the discard
 * arrives with the next round's Mythos banner and is applied only once that has
 * been read. Until then the card would sit where it was as if the click had done
 * nothing. Game.vue moves it on the client right away, and keeps it from showing
 * in its old place until an update newer than the answered question arrives.
 *
 * Import-free so the node tests can load it.
 */

type TargetChoice = { tag: string; target?: { tag: string; contents?: unknown } }

/* Where the card a discard choice picks sits: a card in a hand (by card id), or
 * an asset / event in play (by its entity id). */
export type DiscardZone = 'hand' | 'assets' | 'events'
export type DiscardTarget = { zone: DiscardZone; id: string }

const ZONE_BY_TARGET: Record<string, DiscardZone> = {
  CardIdTarget: 'hand',
  CardTarget: 'hand',
  AssetTarget: 'assets',
  EventTarget: 'events',
}

export function discardTarget(choice: TargetChoice | undefined): DiscardTarget | null {
  const target = choice?.target
  const zone = target ? ZONE_BY_TARGET[target.tag] : undefined
  if (!zone || typeof target?.contents !== 'string') return null
  return { zone, id: target.contents }
}

/* Whether a board at `steps` already reflects an answer given at `answeredAt`.
 * A rejected answer produces no newer board, so callers also time it out. */
export function discardSettled(answeredAt: number, steps: number | undefined): boolean {
  return steps !== undefined && steps > answeredAt
}

/* The board as it will be once the server applies the discard: the card out of
 * its owner's hand and on top of their discard. Shown at once so the card flies
 * hand to pile on the click instead of after whatever the server's update waits
 * behind (the next round's Mythos banner). `idOf`/`contentsOf` come from the
 * caller so this stays import-free. Returns null when no hand holds the card. */
type HandHolder<C, D> = { hand: C[]; discard: D[] }
export function withCardDiscarded<C, D, G extends { investigators: Record<string, HandHolder<C, D>> }>(
  game: G,
  id: string,
  idOf: (card: C) => string,
  contentsOf: (card: C) => D,
): G | null {
  for (const [key, inv] of Object.entries(game.investigators)) {
    const card = inv.hand.find((c) => idOf(c) === id)
    if (!card) continue
    const moved = { ...inv, hand: inv.hand.filter((c) => c !== card), discard: [contentsOf(card), ...inv.discard] }
    return { ...game, investigators: { ...game.investigators, [key]: moved } }
  }
  return null
}

/* The same for an asset or event in play: off the table and out of its
 * controller's list, its card on top of their discard. `cardId` is what the
 * caller flies, since both the board copy and the pile are keyed by card id.
 * Null when no investigator holds it (attached elsewhere, or already gone). */
type InPlay = { cardId: string }
type InPlayHolder<D> = { assets: string[]; events: string[]; discard: D[] }
export function withInPlayDiscarded<
  D,
  E extends InPlay,
  G extends { assets: Record<string, E>; events: Record<string, E>; investigators: Record<string, InPlayHolder<D>> },
>(game: G, zone: 'assets' | 'events', id: string, contentsOf: (entity: E) => D): { game: G; cardId: string } | null {
  const entity = game[zone][id]
  const owner = entity && Object.entries(game.investigators).find(([, inv]) => inv[zone].includes(id))
  if (!entity || !owner) return null
  const [key, inv] = owner
  const { [id]: _gone, ...rest } = game[zone]
  const moved = { ...inv, [zone]: inv[zone].filter((x) => x !== id), discard: [contentsOf(entity), ...inv.discard] }
  return {
    game: { ...game, [zone]: rest, investigators: { ...game.investigators, [key]: moved } },
    cardId: entity.cardId,
  }
}
