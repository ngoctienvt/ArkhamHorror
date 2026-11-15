/*
 * Telling an undo apart from the game moving forward.
 *
 * An undo reaches a client as an ordinary game update: only the seat that pressed
 * Undo knows one was asked for, every other seat (and every other tab) just sees
 * a new state. Client-side state that follows the game forward -- the skill test
 * tracker, an update held behind a summary, a queued act/agenda reading, a "skip
 * all" in progress -- belongs to the history that was thrown away and has to go
 * with it on every client, not only on the one that asked.
 *
 * `scenarioSteps` counts the answers given in the current scenario and only ever
 * goes down when history is rewound, which is what FxLayer already keys its own
 * rebase on. A new scenario restarts the count, so the scenario has to match:
 * that is the game moving on, not back.
 *
 * Import-free on purpose (it reads a structural slice of the game) so the node
 * tests can load it without the Vue toolchain, like sfxEvents.ts.
 */

interface RollbackSlice {
  id: string
  scenarioSteps: number
  scenario?: { id?: string } | null
}

export function isRollback(
  previous: RollbackSlice | null | undefined,
  next: RollbackSlice | null | undefined,
): boolean {
  if (!previous || !next) return false
  if (previous.id !== next.id) return false
  if ((previous.scenario?.id ?? null) !== (next.scenario?.id ?? null)) return false
  return next.scenarioSteps < previous.scenarioSteps
}
