/* Puts the phase announcements of one answer back where they happened.
 *
 * The server sends the results of an answer in an order that suits it, not the
 * rules: a draw spotlight is broadcast while the engine runs, the final board
 * after the commit, and the phases that were entered (PhaseChanged) last of all.
 * Ending the round in one answer therefore showed the upkeep draw and the new
 * resources first and announced "Enemy Phase" / "Upkeep Phase" afterwards.
 *
 * The game view collects the results of one answer into a batch and hands it
 * here before playing it. Import-free so the node tests can load it.
 */

/* GameDrewCards is a record on the server, so its fields (`kind` among them)
 * sit beside `tag` on the wire, not under `contents`. */
type Result = { tag: string; contents?: any; kind?: string }

/* Results that start a batch: the ones a later PhaseChanged has to go before. */
export function opensPhaseBatch(result: Result): boolean {
  return result.tag === 'GameUpdate' || result.tag === 'GameDrewCards' || result.tag === 'GameCardOnly'
}

const isPhase = (r: Result) => r.tag === 'PhaseChanged'
const isUpkeepDraw = (r: Result) => r.tag === 'GameDrewCards' && r.kind === 'upkeep'

/* Phases go first, except that an upkeep draw sits right after the Upkeep
 * announcement: phases entered after upkeep (the next round's Mythos) follow the
 * draw and still come before whatever else the batch holds. Everything that is
 * not a phase keeps its relative order. */
export function orderPhaseBatch<T extends Result>(batch: T[]): T[] {
  const phases = batch.filter(isPhase)
  if (phases.length === 0) return batch
  const rest = batch.filter((r) => !isPhase(r))
  const drawAt = rest.findIndex(isUpkeepDraw)
  const upkeepAt = phases.map((p) => p.contents).lastIndexOf('UpkeepPhase')
  if (drawAt < 0 || upkeepAt < 0) return [...phases, ...rest]
  return [
    ...phases.slice(0, upkeepAt + 1),
    ...rest.slice(0, drawAt + 1),
    ...phases.slice(upkeepAt + 1),
    ...rest.slice(drawAt + 1),
  ]
}
