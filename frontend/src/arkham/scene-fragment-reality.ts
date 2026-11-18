import type { Point } from './locationGraph'
import type { SceneSnapshot, StageBoard } from './scene-stage-types'
import { areaMask, cleanCode, panorama, scenePath } from './scene-stage-types'

const floors: Record<string, Point> = {
  '216': [65, 23], '217': [41, 18], '218': [47, 39], '219': [61, 51],
  '220': [39, 37], '221': [73, 53], '222': [46, 59], '223': [31, 55],
}
const patches: Record<string, Point[]> = {
  '218': [[44, 20], [57, 19], [60, 27], [58, 37], [46, 41], [44, 37]],
  '219': [[54, 39], [61, 37], [67, 41], [66, 53], [57, 55], [52, 50]],
  '220': [[31, 23], [44, 23], [44, 39], [33, 43], [30, 36]],
  '221': [[67, 36], [76, 36], [81, 43], [81, 54], [74, 60], [66, 57], [65, 50]],
  '222': [[42, 54], [56, 54], [63, 61], [62, 76], [50, 84], [41, 70]],
  '223': [[20, 36], [30, 34], [34, 40], [40, 41], [41, 56], [34, 61], [23, 60], [19, 52]],
}

/** Surface and lander stay fixed; each cave can independently manifest Carcosa. */
export function fragmentReality(state: SceneSnapshot): StageBoard {
  const positions: Record<string, Point> = {}
  const changed = new Set<string>()
  for (const location of state.locations) {
    const match = /^:dark-matter:(21[6-9]|22[0-3])(b)?$/.exec(cleanCode(location.cardCode))
    if (!match || !floors[match[1]]) continue
    const transformed = Boolean(match[2] && (location.revealed || location.enemyLocation) && patches[match[1]])
    positions[location.id] = transformed && match[1] === '222' ? [50, 72] : floors[match[1]]
    if (transformed) changed.add(match[1])
  }
  const caves = 'dark-matter/fragment-of-carcosa-caves'
  const carcosa = 'dark-matter/fragment-of-carcosa-manifest'
  const complete = changed.size === 6
  return {
    ...panorama(complete ? carcosa : caves), layoutArt: caves, positions,
    ...(!complete && changed.size ? { layers: [{
      image: scenePath(carcosa),
      mask: areaMask([...changed].map((code) => patches[code])),
    }] } : {}),
  }
}
