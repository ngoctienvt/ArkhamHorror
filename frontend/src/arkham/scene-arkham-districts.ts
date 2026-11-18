import type { Point } from './locationGraph'
import type { SceneSnapshot, StageBoard } from './scene-stage-types'
import { areaMask, cleanCode, scenePath } from './scene-stage-types'

// District markers sit on accessible streets and courtyards in the painted city.
const districts: Record<string, Point> = {
  '01134': [26, 29], '50028': [26, 29],
  '01130': [47, 31], '01131': [47, 31],
  '01132': [82, 35], '50027': [82, 35],
  '01129': [18, 58], '50029': [18, 58],
  '01125': [49, 45], '50030': [38, 53],
  '01133': [82, 56], '01128': [15, 91],
  '01126': [65, 90], '01127': [65, 90], '01124': [86, 90],
}

export function arkhamDistrictStage(base: StageBoard | undefined, state: SceneSnapshot): StageBoard | undefined {
  if (!base || !['01120', '50025', '90032'].includes(cleanCode(state.id))) return base
  const positions: Record<string, Point> = {}
  const police = cleanCode(state.id) === '90032' || state.locations.some((location) =>
    cleanCode(location.cardCode) === '50027' && (location.revealed || location.enemyLocation))
  for (const location of state.locations) {
    const code = cleanCode(location.cardCode)
    if (districts[code]) positions[location.id] = districts[code]
    if (code === '90036' || (code === '50027' && (location.revealed || location.enemyLocation))) positions[location.id] = [78, 43]
  }
  const burned = base.image.endsWith('midnight-masks-burned.webp')
  return { ...base, stageArt: true, anchors: { ...base.anchors, ...districts, '90036': [78, 43] }, positions,
    ...(police ? { image: scenePath('night-of-the-zealot/midnight-masks-police'),
      ...(burned ? { layers: [{ image: base.image, mask: areaMask([[[77, 69], [100, 69], [100, 100], [77, 100]]]) }] } : {}),
    } : {}),
  }
}
