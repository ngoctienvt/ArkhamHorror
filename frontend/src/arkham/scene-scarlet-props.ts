import type { StageBoard } from './scene-stage-types'
import type { Location } from './types/Location'

/** The unrevealed Tower of London describes ravens circling above its walls. */
export function scarletProps(
  board: StageBoard | undefined,
  scenarioId: string,
  locations: readonly Pick<Location, 'cardCode'>[],
): StageBoard | undefined {
  if (!board || scenarioId.replace(/^c/, '') !== '09501'
    || !board.image.endsWith('/the-scarlet-keys/riddles-and-rain.webp')
    || !locations.some(({ cardCode }) => /^c?09516[ab]?$/.test(cardCode))) return board
  return {
    ...board,
    figures: [...(board.figures ?? []), {
      id: 'tower-ravens',
      image: 'img/scenes/the-scarlet-keys/tower-ravens.webp',
      point: [14.58, 35.28], size: [14.06, 7.5],
    }],
  }
}
