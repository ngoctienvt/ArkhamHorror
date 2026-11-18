/* What the scene map's side panel shows. Import-free on purpose so the tests can load it without the
 * Vue toolchain. */

export type PanelMode = 'here' | 'viewing'

/**
 * The panel lists your actions where you stand ('here'), or describes another location you clicked
 * ('viewing'). Clicking the location you stand on is not a second view: the panel already describes it.
 */
export function panelModeFor(inspectedId: string | null, standingId: string | null): PanelMode {
  return inspectedId !== null && inspectedId !== standingId ? 'viewing' : 'here'
}

/**
 * Which printed lines of a location the "about" block leaves out because the action list under it already
 * offers them as buttons carrying the same text. `lineKinds` is the kind of each printed line in order,
 * `offeredKinds` the kind of each ability of this location on offer right now. A kind is only left out
 * when every printed line of that kind is on offer; with fewer offers than lines there is no telling
 * which line is which, so all of them stay.
 */
export function offeredLineIndexes(lineKinds: readonly string[], offeredKinds: readonly string[]): Set<number> {
  const count = (kinds: readonly string[]) => {
    const counts = new Map<string, number>()
    for (const kind of kinds) counts.set(kind, (counts.get(kind) ?? 0) + 1)
    return counts
  }
  const offered = count(offeredKinds)
  const printed = count(lineKinds)
  const hidden = new Set<number>()
  lineKinds.forEach((kind, index) => {
    const have = offered.get(kind) ?? 0
    if (have > 0 && have >= (printed.get(kind) ?? 0)) hidden.add(index)
  })
  return hidden
}
