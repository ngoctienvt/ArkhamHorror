import type { Point } from './locationGraph'
import type { SceneSnapshot, StageBoard } from './scene-stage-types'
import { cleanCode, hasCode, panorama } from './scene-stage-types'
import { tiledScene } from './scene-stage-tiles'
import { fragmentReality } from './scene-fragment-reality'
import { starfallScene } from './scene-starfall'
import { wendigoScene } from './scene-wendigo'
import { vespersScene } from './scene-vespers'
import { zannScene } from './scene-zann'
import { circusScene } from './scene-circus'
import { darkMatterScene } from './scene-dark-matter-stages'
import { agesUnwoundScene } from './scene-ages-unwound'

function unstuck(state: SceneSnapshot): StageBoard {
  const faces: Record<string, string> = {}
  for (let number = 69; number <= 84; number++) {
    const shared = number % 2 === 0 ? number - 1 : number
    faces[`:ages-unwound:${String(number).padStart(3, '0')}`] = `ages-unwound/unstuck/${String(shared).padStart(3, '0')}`
  }
  faces[':ages-unwound:085'] = 'ages-unwound/unstuck/085'
  faces[':ages-unwound:086'] = 'ages-unwound/unstuck/086'
  const board = tiledScene(state, {
    art: 'the-circle-undone/before-the-black-throne',
    back: 'the-circle-undone/cosmos/cosmos', faces,
  })
  const positions: Record<string, Point> = {}
  for (const location of state.locations) {
    const match = /^location([1-8])$/.exec(location.label)
    if (match) {
      const angle = (Number(match[1]) - 1) * Math.PI / 4
      positions[location.id] = [50 + 36 * Math.sin(angle), 50 - 35 * Math.cos(angle)]
    } else if (cleanCode(location.cardCode) === ':ages-unwound:085') positions[location.id] = [43, 50]
    else if (cleanCode(location.cardCode) === ':ages-unwound:086') positions[location.id] = [65, 50]
  }
  return { ...board, positions, tileSize: [18, 22] }
}

export function homebrewSceneStage(base: StageBoard | undefined, state: SceneSnapshot): StageBoard | undefined {
  const circus = circusScene(state)
  if (circus) return circus
  const darkMatter = darkMatterScene(state)
  if (darkMatter) return darkMatter
  const ages = agesUnwoundScene(state)
  if (ages) return ages
  switch (state.id.replace(/^c/, '')) {
    case ':the-symphony-of-erich-zann:001': return zannScene(state)
    case ':night-of-vespers:001': return vespersScene(state)
    case ':against-the-wendigo:001': return wendigoScene(state)
    case ':dark-matter:209': return fragmentReality(state)
    case ':dark-matter:243': return starfallScene(state)
    case ':ages-unwound:062': return unstuck(state)
    case ':the-phantom-of-the-opera:001': {
      if (hasCode(state, /^:the-phantom-of-the-opera:01[67]$/)) {
        return panorama('the-phantom-of-the-opera/domain', {
          hourglass: [12, 67], plus: [47, 55], star: [86, 56],
          ':the-phantom-of-the-opera:016': [12, 67],
          ':the-phantom-of-the-opera:023': [47, 55],
          ':the-phantom-of-the-opera:017': [86, 56],
        })
      }
      if (hasCode(state, /^:the-phantom-of-the-opera:0(?:1[89]|2[0-2])$/)) {
        return panorama('the-phantom-of-the-opera/sewers', {
          parisSewers1: [14, 38], parisSewers2: [47, 41], parisSewers3: [84, 40],
          plus: [63, 85], ':the-phantom-of-the-opera:023': [63, 85],
        })
      }
      if (hasCode(state, /^:the-phantom-of-the-opera:01[3-5]$/)) {
        return panorama('the-phantom-of-the-opera/opera-house', {
          grandFoyer: [50, 74], heart: [49, 54], moon: [82, 43], square: [16, 21],
          ':the-phantom-of-the-opera:013': [49, 54],
          ':the-phantom-of-the-opera:014': [82, 43],
          ':the-phantom-of-the-opera:015': [16, 21],
        })
      }
      return panorama('the-phantom-of-the-opera/foyer', {
        grandFoyer1: [22, 58], grandFoyer2: [50, 74], grandFoyer3: [80, 58],
      })
    }
  }
  return base
}
