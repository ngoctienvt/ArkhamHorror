/* Written in Rock, Standalone Mode: the server leaves the four setup caves in play, and the Cave-In then puts rail
 * tiles (and the Control Station) into the cells they held. A cave pushed out of its cell is on no cell of the grid, so
 * the card board does not draw it, but the scene map used to place it at a fallback spot, on top of its neighbours.
 * The scene map now follows the card board here: on this scenario, a location the layout has no cell for is not drawn.
 * Pure data, no runtime imports. */

const WRITTEN_IN_ROCK = '10501'

/** True when the layout has no cell for this label, on Written in Rock: the card board leaves it out, so does the map. */
export function isOffGrid(scenarioId: string, layout: readonly string[] | null | undefined, label: string): boolean {
  if (scenarioId.replace(/^c/, '') !== WRITTEN_IN_ROCK || !layout?.length) return false
  return !layout.some((row) => row.trim().split(/\s+/).includes(label))
}
