import type { Point } from './locationGraph'
import type { SceneSnapshot, StageBoard } from './scene-stage-types'
import { areaMask, cleanCode, hasCode, panorama, scenePath } from './scene-stage-types'

const usherFloors: Record<string, Point> = {
  '007': [41, 61], '008': [40, 29], '009': [17, 29], '010': [63, 29],
  '011': [15, 61], '012': [66, 61], '013': [22, 86], '014': [57, 86], '015': [86, 71],
}
const shipFloors: Record<string, Point> = {
  '015': [16, 76], '016': [45, 76], '017': [74, 76],
  '018': [14, 56], '019': [38, 56], '020': [60, 56], '021': [78, 56],
  '022': [26, 40], '023': [54, 40], '024': [74, 40], '025': [93, 91], '026': [92, 74],
}
const masqueFloors: Record<string, Point> = {
  '007': [43, 66], '008': [81, 82], '009': [81, 45], '010': [81, 18],
  '011': [43, 18], '012': [12, 18], '013': [12, 45], '014': [12, 82],
}
const usherRooms: Record<string, [number, number, number, number]> = {
  '007': [27, 32, 26, 33], '008': [27, 14, 26, 18], '009': [8, 14, 19, 18],
  '010': [53, 14, 24, 18], '011': [5, 32, 22, 33], '012': [53, 32, 24, 33],
  '013': [6, 65, 32, 27], '014': [38, 65, 39, 27],
}
const shipRooms: Record<string, [number, number, number, number]> = {
  '015': [6, 61, 23, 19], '016': [29, 61, 31, 19], '017': [60, 61, 26, 19],
  '018': [5, 43, 18, 17], '019': [27, 43, 25, 17], '020': [52, 43, 18, 17], '021': [70, 43, 17, 17],
  '022': [9, 29, 32, 14], '023': [42, 35, 23, 8], '024': [66, 29, 18, 14],
}
const rectangle = ([x, y, width, height]: [number, number, number, number]): Point[] =>
  [[x, y], [x + width, y], [x + width, y + height], [x, y + height]]
function anchors(prefix: string, floors: Record<string, Point>): Record<string, Point> {
  return Object.fromEntries(Object.entries(floors).map(([code, point]) => [`:${prefix}:${code}`, point]))
}

export function homebrewManorStage(base: StageBoard | undefined, state: SceneSnapshot): StageBoard | undefined {
  const id = cleanCode(state.id)
  if (id === ':the-fall-of-the-house-of-usher:001') {
    const art = 'the-fall-of-the-house-of-usher/manor'
    const ruined = state.locations.flatMap((location) => {
      const match = /^:the-fall-of-the-house-of-usher:(00[7-9]|01[0-4])b$/.exec(cleanCode(location.cardCode))
      return match && (location.revealed || location.enemyLocation) ? [rectangle(usherRooms[match[1]])] : []
    })
    return { ...panorama(art, anchors('the-fall-of-the-house-of-usher', usherFloors)),
      ...(ruined.length ? { layers: [{ image: scenePath(`${art}-ruined`), mask: areaMask(ruined) }] } : {}) }
  }
  if (id === ':consternation-on-the-constellation:001') {
    const art = 'consternation-on-the-constellation/ship'
    // This scenario uses exhausted rooms as its sinking state, not floodLevel.
    const flooded = state.locations.flatMap((location) => {
      const match = /^:consternation-on-the-constellation:(01[5-9]|02[0-4])$/.exec(cleanCode(location.cardCode))
      return match && location.exhausted ? [rectangle(shipRooms[match[1]])] : []
    })
    const launched = hasCode(state, /^:consternation-on-the-constellation:026$/)
    return { ...panorama(launched ? `${art}-lifeboat` : art, anchors('consternation-on-the-constellation', shipFloors)), layoutArt: art,
      ...(flooded.length ? { layers: [{ image: scenePath(`${art}-flooded`), mask: areaMask(flooded) }] } : {}) }
  }
  if (id === ':the-masque-of-the-red-death:001') {
    const art = 'the-masque-of-the-red-death/manor'
    const massacre = state.acts.some((act) => act.sequence.number >= 2
      || (act.sequence.number === 1 && act.sequence.side === 'B'))
    return { ...panorama(massacre ? `${art}-midnight` : art, anchors('the-masque-of-the-red-death', masqueFloors)), layoutArt: art }
  }
  return base
}
