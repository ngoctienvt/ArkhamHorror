/* Where "undo back to here" lands for a log line.
 *
 * A log line carries the step of the question that was open BEFORE the answer
 * that wrote it, and one answer can write a whole chain: assigning the damage of
 * an attack, a treachery, and the start of the next skill test all share the
 * damage prompt's step. Landing on that step for the test line put the player
 * back on the damage prompt -- the earlier effect's consequence asked again.
 *
 * So:
 * - the first line an answer wrote is what that answer did: land on its step,
 *   just before it, as before;
 * - a later line in the chain has no decision of its own in front of it: land on
 *   the first decision after it (step + 1, for a skill test its commit window),
 *   keeping what the chain did before it.
 * The second only when the game is provably past step + 1 (a later line exists),
 * because the server refuses an undo to the step that is open now; otherwise
 * the only point there is to go back to is the step itself.
 *
 * Chat is ignored throughout: a typed line is re-stamped to wherever an undo
 * leaves it, so it says nothing about where the game was. Import-free so the
 * node tests can load it.
 */

type StepEntry = { seq: number; step: number | null; kind: string }

const counts = (e: StepEntry) => e.kind !== 'Chat' && e.step !== null

export function undoTargetFor(entries: readonly StepEntry[], entry: StepEntry): number | null {
  const step = entry.step
  if (step === null) return null
  const sameStep = entries.filter((e) => counts(e) && e.step === step)
  const opensStep = sameStep.every((e) => e.seq >= entry.seq)
  if (opensStep) return step
  const movedOn = entries.some((e) => counts(e) && (e.step as number) > step + 1)
  return movedOn ? step + 1 : step
}
