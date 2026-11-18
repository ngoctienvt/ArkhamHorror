import type { Point } from './locationGraph'
import type { SceneSnapshot, StageBoard } from './scene-stage-types'
import { areaMask, cleanCode, hasCode, panorama, scenePath } from './scene-stage-types'
import { landmarkPositions } from './scene-stage-landmarks'
import { tiledScene } from './scene-stage-tiles'

const pack = ':ages-unwound:'
const keyed = (points: Record<string, Point>) => Object.fromEntries(Object.entries(points).map(([code, point]) => [pack + code, point]))
const schoolFloors = keyed({
  '056': [9, 57], '169': [9, 57], '057': [10, 35], '170': [10, 35],
  '058': [91, 43], '171': [91, 43], '059': [90, 24], '172': [90, 24],
  '222': [51, 43], '223': [48, 26], '226': [73, 42], '230': [29, 41],
  '227': [33, 19], '228': [51, 19], '229': [68, 19],
  '224': [23, 82], '173': [51, 83], '225': [78, 83],
})
const schoolAreas: Record<string, Point[]> = {
  '227': [[22, 4], [43, 4], [43, 22], [22, 22]],
  '228': [[43, 4], [61, 4], [61, 22], [43, 22]],
  '229': [[61, 4], [78, 4], [78, 22], [61, 22]],
  '224': [[1, 58], [35, 58], [35, 98], [1, 98]],
  '173': [[35, 58], [65, 58], [65, 98], [35, 98]],
  '225': [[65, 58], [99, 58], [99, 98], [65, 98]],
}

function school(state: SceneSnapshot): StageBoard {
  if (state.locations.length && state.locations.every((location) => cleanCode(location.cardCode) === `${pack}168`)) {
    return panorama('ages-unwound/featureless-streets', { [`${pack}168`]: [50, 68] })
  }
  const board = panorama('ages-unwound/school-sealed', schoolFloors)
  board.layoutArt = 'ages-unwound/school-temporal'
  const opened = state.locations.flatMap((location) => {
    const code = cleanCode(location.cardCode).replace(pack, '')
    const visible = ['173', '224', '225'].includes(code) || location.revealed || location.enemyLocation
    return visible && schoolAreas[code] ? [schoolAreas[code]] : []
  })
  if (opened.length) board.layers = [{ image: scenePath('ages-unwound/school-temporal'), mask: areaMask(opened) }]
  return board
}

function finale(state: SceneSnapshot): StageBoard {
  const faces: Record<string, string> = {}
  for (let code = 189; code <= 204; code++) {
    const shared = code % 2 === 0 ? code - 1 : code
    faces[pack + code] = `ages-unwound/time-runs-out/${shared}`
  }
  for (const code of [205, 206, 207]) faces[pack + code] = `ages-unwound/time-runs-out/${code}`
  for (const code of ['189b', '191b', '201b', '202b']) {
    faces[pack + code] = `ages-unwound/time-runs-out/${code === '202b' ? code : code.slice(0, -1)}`
  }
  return tiledScene(state, { art: 'the-circle-undone/before-the-black-throne', back: 'the-circle-undone/cosmos/cosmos', faces })
}

function world(state: SceneSnapshot): StageBoard {
  const board = panorama('ages-unwound/a-year-to-plan-clear', keyed({
    '111': [31, 46], '112': [14, 45], '113': [24, 61], '114': [51, 34],
    '115': [49, 42], '116': [55, 42], '117': [61, 46], '118': [57, 54],
    '119': [77, 26], '120': [73, 48], '121': [80, 52], '122': [88, 82],
    '142': [41, 51], '143': [42, 30],
  }))
  board.layoutArt = 'ages-unwound/a-year-to-plan-refined'
  const areas: Point[][] = []
  if (hasCode(state, /^:ages-unwound:143$/)) areas.push([[35, 18], [49, 18], [49, 36], [35, 36]])
  if (hasCode(state, /^:ages-unwound:142$/)) areas.push([[37, 43], [45, 43], [45, 58], [37, 58]])
  if (areas.length) board.layers = [{ image: scenePath('ages-unwound/a-year-to-plan-refined'), mask: areaMask(areas) }]
  return board
}

export function agesUnwoundScene(state: SceneSnapshot): StageBoard | undefined {
  const id = cleanCode(state.id)
  if (id === `${pack}048` || id === `${pack}155`) return school(state)
  if (id === `${pack}182`) return finale(state)
  if (id === `${pack}105`) return world(state)
  if (id === `${pack}023`) return panorama('ages-unwound/the-myriad-gentleman', keyed({
    '030': [63, 55], '031': [73, 20], '032': [83, 14], '033': [87, 64],
    '034': [34, 59], '035': [52, 80], '036': [20, 85], '037': [28, 32],
    '038': [13, 53], '039': [46, 26],
  }))
  if (id === `${pack}001`) {
    const board = panorama('ages-unwound/night-of-fire')
    board.positions = landmarkPositions(state, {}, [{
      labels: ['circle', 'square', 'moon', 't', 'diamond', 'hourglass', 'triangle', 'plus'],
      floors: keyed({ '008': [40, 60], '009': [61, 56], '010': [22, 25], '011': [64, 25],
        '012': [55, 84], '013': [89, 82], '014': [80, 61], '015': [13, 85] }),
    }])
    return board
  }
  return undefined
}
