/* The scenario's own setup (act and agenda decks, starting locations) runs after every investigator's
 * setup: "before drawing your opening hand" abilities, the mulligan. In that window the server has no act
 * or agenda in play yet, so the mission strip says they are coming instead of silently showing nothing. */

interface SetupState {
  inSetup: boolean
  acts: Record<string, unknown>
  agendas: Record<string, unknown>
}

/** True while the game is still being set up and neither an act nor an agenda has been placed. */
export function missionAwaitingSetup(game: SetupState): boolean {
  return game.inSetup
    && Object.keys(game.acts ?? {}).length === 0
    && Object.keys(game.agendas ?? {}).length === 0
}
