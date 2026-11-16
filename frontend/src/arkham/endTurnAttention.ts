/* When the End Turn button should pulse to draw the player's eye.
 *
 * The turn is never ended for the player (see autoAnswerPolicy): instead the
 * button blinks once there is no action left to spend, or once End Turn is the
 * only real choice on offer. Import-free so the node tests can load it; tags
 * are the plain strings the backend sends.
 */

type ChoiceLike = { tag: string }

const END_TURN_BUTTON = 'EndTurnButton'
const INVALID_LABEL = 'InvalidLabel'

// Every choice still selectable is an End Turn button (greyed-out ones ignored).
export function onlyEndTurnLeft(choices: readonly ChoiceLike[]): boolean {
  const valid = choices.filter((c) => c.tag !== INVALID_LABEL)
  return valid.length > 0 && valid.every((c) => c.tag === END_TURN_BUTTON)
}

export function shouldPulseEndTurn(
  endTurnOffered: boolean,
  spendableActions: number,
  choices: readonly ChoiceLike[],
): boolean {
  if (!endTurnOffered) return false
  return spendableActions <= 0 || onlyEndTurnLeft(choices)
}
