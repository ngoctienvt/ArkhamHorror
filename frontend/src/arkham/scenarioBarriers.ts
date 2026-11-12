/**
 * Barriers standing between two locations (In Too Deep). The engine keeps them in the scenario's meta as
 * `{ barriers: { "<idA>--<idB>": n } }`, the two ids sorted (Haskell `SortedPair`, plain text order).
 */
export type BarrierCounts = Record<string, number>

/** The meta key for the barriers between two locations, whichever order they are given in. */
export function barrierKey(a: string, b: string): string {
  return [a, b].sort().join('--')
}

/** The barrier counts in a scenario's meta, or null when the scenario has none. */
export function barrierCounts(meta: unknown): BarrierCounts | null {
  const barriers = (meta as { barriers?: unknown } | null | undefined)?.barriers
  if (!barriers || typeof barriers !== 'object') return null
  return barriers as BarrierCounts
}

/** How many barriers stand between two locations (0 when none or unknown). */
export function barriersBetween(counts: BarrierCounts | null, a: string, b: string): number {
  const n = counts?.[barrierKey(a, b)]
  return typeof n === 'number' && n > 0 ? n : 0
}

/** Every link that holds at least one barrier, as its two location ids and the count. */
export function blockedLinks(counts: BarrierCounts | null): { a: string; b: string; key: string; count: number }[] {
  if (!counts) return []
  return Object.entries(counts).flatMap(([key, count]) => {
    const ids = key.split('--')
    if (ids.length !== 2 || typeof count !== 'number' || count <= 0) return []
    return [{ a: ids[0], b: ids[1], key, count }]
  })
}
