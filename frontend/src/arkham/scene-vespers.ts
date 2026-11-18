import type { Point } from './locationGraph'
import type { SceneSnapshot, StageBoard } from './scene-stage-types'
import { areaMask, cleanCode, panorama, scenePath } from './scene-stage-types'

const hotelFloors: Record<string, Point> = {
  '008': [54, 66], '009': [8, 56], '010': [80, 23], '011': [16, 85], '012': [49, 41],
  '013': [39, 66], '015': [25, 41], '017': [78, 65], '019': [25, 65],
  '021': [79, 42], '023': [65, 43], '025': [94, 65], '027': [40, 24], '029': [54, 85],
}
const pairs: Record<string, string> = {
  '014': '013', '016': '015', '018': '017', '020': '019', '022': '021',
  '024': '023', '026': '025', '028': '027', '030': '029',
}
const diningArea: Point[] = [[45, 46], [62, 46], [62, 70], [45, 70]]
// Preserve the ballroom fire through the rear door when the dining room is also La Brutta Vita.
const wingDiningArea: Point[] = [[23, 70], [77, 70], [77, 100], [23, 100]]

export function vespersScene(state: SceneSnapshot): StageBoard {
  const codes = state.locations.map((location) => cleanCode(location.cardCode))
  const expanded = codes.some((code) => /^:night-of-vespers:(009|01[012569]|02\d|030)$/.test(code))
  const burning = state.acts.some((act) => act.sequence.number >= 3
    || (act.sequence.number === 2 && act.sequence.side === 'B'))
  const wing = codes.some((code) => /^:night-of-vespers:01[3478]$/.test(code))
  const family = expanded ? 'hotel' : wing || burning ? 'restaurant-wing' : 'trattoria'
  const bad = codes.includes(':night-of-vespers:008b')
  const suffix = burning ? '-inferno' : bad ? '-brutta' : ''
  const art = `night-of-vespers/${family}`
  const anchors: Record<string, Point> = {}
  for (const code of ['008', ...Object.keys(hotelFloors).filter((key) => key !== '008'), ...Object.keys(pairs)]) {
    const canonical = pairs[code] ?? code
    const point = family === 'hotel' ? hotelFloors[canonical]
      : family === 'trattoria' ? (canonical === '008' ? [50, 72] as Point : undefined)
      : canonical === '008' ? [51, 81] as Point : canonical === '013' ? [14, 79] as Point
      : canonical === '017' ? [88, 79] as Point : undefined
    if (point) anchors[`:night-of-vespers:${code}`] = point
  }
  return { ...panorama(`${art}${suffix}`, anchors), layoutArt: art,
    ...(burning && bad ? { layers: [{ image: scenePath(`${art}-brutta`),
      mask: areaMask([family === 'hotel' ? diningArea : wingDiningArea]),
    }] } : {}),
  }
}
