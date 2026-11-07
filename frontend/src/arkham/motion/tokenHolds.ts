import { reactive } from 'vue'
import type { FxEvent } from '@/arkham/gameDeltaFx'

/* What a token count shows while its tokens are travelling.
 *
 * The game state changes the moment an update is applied, so without this the
 * investigator would already show +1 clue while the clue is still flying in from
 * the location -- the flight would read as decoration, not as the clue moving.
 * Counts that take part in a transfer show the *old* number and step to the new
 * one token by token: the source drops as each token leaves, the destination
 * rises as each one lands.
 *
 * Display only. The real value is in the game state throughout, and every hold
 * is dropped when the FX layer rebases, is turned off, or a safety timeout runs.
 *
 * Two layers: `pending` is recomputed from scratch each time an update arrives
 * (the diff since the last shown state, which is what the next timeline will
 * play), `flying` belongs to a timeline already playing and is released token by
 * token. A count shows real + pending + flying.
 */

export type HeldToken = 'clue' | 'resource'

const pending = reactive(new Map<string, number>())
const flying = reactive(new Map<string, number>())

const keyOf = (anchor: string, token: HeldToken) => `${anchor}|${token}`

function add(map: Map<string, number>, key: string, delta: number) {
  const next = (map.get(key) ?? 0) + delta
  if (next === 0) map.delete(key)
  else map.set(key, next)
}

/* Adjustments that undo a list of transfers on screen: the source shows the
 * tokens it still has to give, the destination hides the ones not arrived yet. */
function holdTransfers(map: Map<string, number>, events: FxEvent[]) {
  for (const e of events) {
    if (e.kind !== 'transfer' || !e.toward || !e.token) continue
    add(map, keyOf(e.anchor, e.token), e.amount)
    add(map, keyOf(e.toward, e.token), -e.amount)
  }
}

export function setPendingHolds(events: FxEvent[]) {
  pending.clear()
  holdTransfers(pending, events)
}

/* A timeline starts playing these transfers: they stop being pending and are
 * released one token at a time by `tokenLeft` / `tokenLanded`. */
export function startFlying(events: FxEvent[]) {
  pending.clear()
  holdTransfers(flying, events)
}

export function tokenLeft(anchor: string, token: HeldToken, count = 1) {
  const key = keyOf(anchor, token)
  const held = flying.get(key) ?? 0
  if (held > 0) add(flying, key, -Math.min(count, held))
}

export function tokenLanded(anchor: string, token: HeldToken, count = 1) {
  const key = keyOf(anchor, token)
  const held = flying.get(key) ?? 0
  if (held < 0) add(flying, key, Math.min(count, -held))
}

/* Drops the holds of one transfer whose tokens could not be drawn (no route on
 * screen), so its counts settle at once. */
export function settleTransfer(from: string, to: string, token: HeldToken) {
  flying.delete(keyOf(from, token))
  flying.delete(keyOf(to, token))
}

/* A timeline finished: whatever it still holds (a token whose animation was
 * cancelled) settles to the real value. */
export function clearFlying() {
  flying.clear()
}

export function clearHolds() {
  pending.clear()
  flying.clear()
}

/* The number to show for `real` tokens of `token` on `anchor`. Never negative. */
export function heldCount(anchor: string, token: HeldToken, real: number): number {
  const key = keyOf(anchor, token)
  return Math.max(0, real + (pending.get(key) ?? 0) + (flying.get(key) ?? 0))
}
