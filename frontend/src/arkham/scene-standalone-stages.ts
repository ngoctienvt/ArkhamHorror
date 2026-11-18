import type { Point } from './locationGraph'
import type { SceneSnapshot, StageBoard } from './scene-stage-types'
import { cleanCode, hasCode, panorama, scenePath } from './scene-stage-types'
import { carnevaleScene } from './scene-carnevale'

function homebrewPanorama(pack: string, art: string, rooms: Record<string, Point>): StageBoard {
  const anchors: Record<string, Point> = {}
  for (const [code, point] of Object.entries(rooms)) anchors[`:${pack}:${code}`] = point
  return panorama(`${pack}/${art}`, anchors)
}

/** Keep interiors physically inside their owning buildings and paths in one view. */
export function standaloneSceneStage(base: StageBoard | undefined, state: SceneSnapshot): StageBoard | undefined {
  if (cleanCode(state.id) === '82001') return carnevaleScene(state)
  if (cleanCode(state.id) === '86001' && base && !hasCode(state, /^86024$/)) {
    return { ...base, image: scenePath('side-stories/war-of-the-outer-gods-before-hub'), layoutArt: 'side-stories/war-of-the-outer-gods' }
  }
  switch (cleanCode(state.id)) {
    case ':and-then-there-were-none:001':
      return homebrewPanorama('and-then-there-were-none', 'soldier-island', {
        '005': [49, 53], '006': [79, 80], '007': [52, 26],
        '008': [35, 43], '009': [69, 44], '010': [22, 77],
      })
    case ':the-invisible-man:001':
      return homebrewPanorama('the-invisible-man', 'countryside', {
        '009': [50, 78], '010': [79, 72], '011': [70, 43], '012': [87, 24],
        '013': [37, 30], '014': [12, 42], '015': [20, 68],
      })
    case ':the-legend-of-sleepy-hollow:001':
      return homebrewPanorama('the-legend-of-sleepy-hollow', 'valley', {
        '006': [78, 69], '007': [39, 72], '008': [60, 47],
        '009': [86, 27], '010': [21, 39], '011': [49, 23],
      })
    case ':the-strange-case-of-dr-jekyll-and-mr-hyde:001':
      return homebrewPanorama('the-strange-case-of-dr-jekyll-and-mr-hyde', 'northside', {
        '007': [50, 52], '008': [75, 53], '009': [75, 53],
        '010': [76, 86], '011': [76, 86], '012': [43, 87], '013': [43, 87],
        '014': [20, 47], '015': [20, 47], '016': [44, 32], '017': [44, 32],
        '018': [85, 26], '019': [17, 84],
      })
    case '83001':
    case '83016': {
      if (hasCode(state, /^8302[2-6][ab]?$/)) return panorama('guardians-of-the-abyss/the-great-abyss', {
        aDreamBetwixt: [48, 81], theGreatAbyss: [50, 36], tunnelsUnderNgranek: [51, 29],
        mistFilledCaverns: [13, 43], stairwayToSarkomand: [85, 46],
        '83022': [48, 81], '83023': [50, 36], '83024': [51, 29],
        '83025': [85, 46], '83026': [13, 43],
      })
      return {
        ...panorama(hasCode(state, /^83028$/) ? 'guardians-of-the-abyss/cairo-expedition' : 'guardians-of-the-abyss/cairo-before-gate', {
          '83008': [41, 83], '83009': [12, 64], '83010': [15, 40], '83011': [30, 43], '83012': [14, 86],
          '83037': [33, 28], '83038': [52, 48], '83039': [53, 22], '83040': [83, 14],
          '83041': [87, 84], '83042': [74, 29], '83043': [70, 43], '83044': [82, 61], '83028': [92, 29],
        }), layoutArt: 'guardians-of-the-abyss/cairo-expedition',
      }
    }
  }
  return base
}
