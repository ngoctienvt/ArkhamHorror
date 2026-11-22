import type { StageBoard } from './scene-stage-types'
import type { Location } from './types/Location'

/** The burner is visible only when the set-aside Alchemy Labs is actually in play. */
export function dunwichProps(
  board: StageBoard | undefined,
  scenarioId: string,
  locations: readonly Pick<Location, 'cardCode' | 'revealed'>[],
): StageBoard | undefined {
  if (!board) return board
  const scenario = scenarioId.replace(/^c/, '')
  const figures = [...(board.figures ?? [])]
  if (['02041', '51012'].includes(scenario) && locations.some(({ cardCode }) => /^c?02057[ab]?$/.test(cardCode))) {
    figures.push({
      id: 'alchemy-burner',
      image: 'img/scenes/the-dunwich-legacy/alchemy-burner.webp',
      point: [86, 86], size: [1.8, 3],
    })
  }
  // Its printed entrance cost, rather than a Blocked modifier, ends when the peak is revealed.
  if (['02274', '51047'].includes(scenario) && locations.some(({ cardCode, revealed }) => /^c?02284[ab]?$/.test(cardCode) && !revealed)) {
    figures.push({
      id: 'sentinel-arcane-wall',
      image: 'img/scenes/the-dunwich-legacy/sentinel-arcane-wall.webp',
      point: [75, 47], size: [12.5, 14],
    })
  }
  if (figures.length === (board.figures?.length ?? 0)) return board
  return {
    ...board,
    figures,
  }
}
