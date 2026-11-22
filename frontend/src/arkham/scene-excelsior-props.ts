import type { StageBoard } from './scene-stage-types'
import type { Location } from './types/Location'

/** The office's private papers become visible only once its location is revealed. */
export function excelsiorProps(
  board: StageBoard | undefined,
  scenarioId: string,
  locations: readonly Pick<Location, 'cardCode' | 'revealed'>[],
): StageBoard | undefined {
  if (!board || scenarioId.replace(/^c/, '') !== '84001'
    || !locations.some(({ cardCode, revealed }) => /^c?84018[ab]?$/.test(cardCode) && revealed)) return board
  return {
    ...board,
    figures: [...(board.figures ?? []), {
      id: 'excelsior-office-documents',
      image: 'img/scenes/side-stories/excelsior-office-documents.webp',
      point: [84.1, 63.6], size: [2.34, 1.85],
    }],
  }
}
