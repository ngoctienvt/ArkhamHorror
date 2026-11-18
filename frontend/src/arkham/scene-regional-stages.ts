import type { Point } from './locationGraph'
import type { SceneSnapshot, StageBoard } from './scene-stage-types'
import { areaMask, cleanCode, panorama, scenePath } from './scene-stage-types'

const boundaryRegions: { present: string[]; ancient: string[]; label: string; point: Point }[] = [
  { present: ['04168', '53039'], ancient: ['04174', '04175'], label: 'circle', point: [45, 83] },
  { present: ['04169', '53040'], ancient: ['04176', '04177'], label: 'square', point: [49, 61] },
  { present: ['04170', '53041'], ancient: ['04178', '04179'], label: 'triangle', point: [19, 39] },
  { present: ['04171', '53042'], ancient: ['04180', '04181'], label: 'diamond', point: [25, 68] },
  { present: ['04172', '53043'], ancient: ['04182', '04183'], label: 'heart', point: [90, 82] },
  { present: ['04173', '53044'], ancient: ['04184', '04185'], label: 'star', point: [78, 53] },
]

// Boundaries follow the plaza, canal and hillside in both geometry-matched paintings.
const regionAreas: Record<string, Point[]> = {
  circle: [[25, 94], [40, 68], [70, 59], [76, 100], [23, 100]],
  square: [[32, 20], [70, 20], [70, 59], [40, 68], [32, 49]],
  triangle: [[0, 12], [31, 15], [32, 49], [0, 61]],
  diamond: [[0, 61], [32, 49], [40, 68], [25, 94], [0, 92]],
  star: [[70, 20], [100, 20], [100, 64], [76, 75], [70, 59]],
  heart: [[76, 75], [100, 64], [100, 100], [76, 100], [70, 59]],
}

export function regionalSceneStage(base: StageBoard | undefined, state: SceneSnapshot): StageBoard | undefined {
  const id = cleanCode(state.id)
  if (id !== '04161' && id !== '53038') return base
  const codes = new Set(state.locations.map((location) => cleanCode(location.cardCode)))
  const active = boundaryRegions.filter((region) => [...region.present, ...region.ancient].some((code) => codes.has(code)))
  const ancient = active.filter((region) => region.ancient.some((code) => codes.has(code)))
  const allAncient = active.length > 0 && ancient.length === active.length
  const presentArt = 'the-forgotten-age/the-boundary-beyond-present'
  const ancientArt = 'the-forgotten-age/the-boundary-beyond-ancient'
  const anchors: Record<string, Point> = {}
  for (const region of boundaryRegions) {
    anchors[region.label] = region.point
    for (const code of [...region.present, ...region.ancient]) anchors[code] = region.point
  }
  return {
    ...panorama(allAncient ? ancientArt : presentArt, anchors), layoutArt: presentArt,
    ...(!allAncient && ancient.length ? { layers: [{
      image: scenePath(ancientArt),
      mask: areaMask(ancient.map((region) => regionAreas[region.label])),
    }] } : {}),
  }
}
