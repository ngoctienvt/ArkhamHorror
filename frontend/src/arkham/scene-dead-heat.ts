import type { StageBoard } from './scene-stage-types'
import { panorama } from './scene-stage-types'

/** Normal and abandoned printings keep the same physical Marrakesh landmarks. */
export function deadHeatScene(): StageBoard {
  const board = panorama('the-scarlet-keys/dead-heat', {
    '09526': [52, 24], '09531': [52, 24],
    '09527': [51, 82], '09532': [51, 82],
    '09528': [17, 30], '09533': [17, 30],
    '09529': [90, 80], '09534': [90, 80],
    '09530': [83, 33], '09535': [83, 33],
  })
  board.layoutArt = 'the-scarlet-keys/dead-heat'
  return board
}
