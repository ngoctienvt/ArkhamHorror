import { entryBlocked } from './blockedEntryHint'
import type { StageBoard } from './scene-stage-types'
import type { Location } from './types/Location'

export function gatheringBarrier(
  board: StageBoard | undefined,
  scenarioId: string,
  locations: readonly Pick<Location, 'cardCode' | 'revealed' | 'modifiers'>[],
): StageBoard | undefined {
  const scenario = scenarioId.replace(/^c/, '')
  if (!board || !['01104', '50011'].includes(scenario)) return board
  const figures = [...(board.figures ?? [])]
  // The original house and Return to have different perspectives and need separate calibration.
  if (scenario === '01104') {
    if (locations.some((location) => /^c?01113[ab]?$/.test(location.cardCode) && location.revealed)) {
      figures.push({ id: 'attic-carcass', image: 'img/scenes/night-of-the-zealot/attic-carcass.webp', point: [59, 25.5], size: [12, 25] })
    }
  }
  if (scenario === '50011') {
    if (locations.some((location) => /^c?50016[ab]?$/.test(location.cardCode) && location.revealed)) {
      figures.push({ id: 'bathroom-tub', image: 'img/scenes/night-of-the-zealot/bathroom-tub.webp', point: [28.8, 73], size: [9.38, 8.4] })
    }
    const attic = locations.find((location) => /^c?(01113|50018)[ab]?$/.test(location.cardCode) && location.revealed)
    if (attic) {
      figures.push({ id: 'attic-carcass', image: 'img/scenes/night-of-the-zealot/attic-carcass.webp', point: [71, 34], size: [8, 24] })
      if (/^c?50018[ab]?$/.test(attic.cardCode)) {
        figures.push({ id: 'attic-ladder', image: 'img/scenes/night-of-the-zealot/attic-ladder.webp', point: [62, 34], size: [9, 25] })
      }
    }
  }
  const parlor = locations.find((location) => /^c?01115[ab]?$/.test(location.cardCode))
  if (parlor && !parlor.revealed && entryBlocked(parlor.modifiers)) {
    figures.push({
      id: 'parlor-barrier',
      image: 'img/scenes/night-of-the-zealot/parlor-barrier.webp',
      point: scenario === '01104' ? [74, 59] : [67, 57],
      size: scenario === '01104' ? [12, 30] : [9, 22],
    })
  }
  return figures.length === (board.figures?.length ?? 0) ? board : { ...board, figures }
}
