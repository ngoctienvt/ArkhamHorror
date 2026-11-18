import type { SceneSnapshot, StageBoard } from './scene-stage-types'
import { hasCode, panorama } from './scene-stage-types'

/** Only the Hive Mind branch tears down the old cavern; Lost Pilgrims keeps it. */
export function apiaryScene(state: SceneSnapshot): StageBoard {
  if (hasCode(state, /^11572$/)) return panorama('the-drowned-city/the-apiary-hive-mind', {
    apiaryEntrance: [13, 48], '11559': [13, 48], centralChamber: [50, 47], '11572': [50, 47],
    graspingCorridor: [50, 16], '11569': [50, 16], starvingCorridor: [87, 44], '11570': [87, 44],
    acidicCoelom: [50, 87], '11571': [50, 87],
  })
  const nest = hasCode(state, /^115(?:69|70|71)$/)
  const board = panorama(`the-drowned-city/the-apiary-${nest ? 'nest-region' : 'region'}`, {
    '11559': [50, 48], '11560': [82, 45], '11561': [20, 46], '11562': [50, 25],
    '11563': [89, 88], '11564': [17, 86], '11565': [37, 70], '11566': [59, 82],
    '11567': [68, 61], '11569': [37, 70], '11570': [59, 82], '11571': [68, 61], '11579': [50, 14],
  })
  board.layoutArt = 'the-drowned-city/the-apiary-region'
  return board
}
