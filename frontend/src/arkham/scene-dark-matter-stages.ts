import type { SceneSnapshot, StageBoard } from './scene-stage-types'
import { cleanCode, panorama } from './scene-stage-types'
import { tiledScene } from './scene-stage-tiles'

/** The room identity follows its current slot, including the three initial school permutations. */
export function darkMatterScene(state: SceneSnapshot): StageBoard | undefined {
  const id = cleanCode(state.id)
  if (id === ':dark-matter:054') {
    const folder = 'dark-matter/electric-rooms'
    return tiledScene(state, { art: `${folder}/floor`, back: `${folder}/back`,
      faces: Object.fromEntries(Array.from({ length: 7 }, (_, i) => {
        const code = String(69 + i).padStart(3, '0')
        return [`:dark-matter:${code}`, `${folder}/${code}`]
      })),
    })
  }
  if (id === ':dark-matter:089') {
    const elbrus = state.locations.filter((location) => /^:dark-matter:(09[6-9]|10[0-3])$/.test(cleanCode(location.cardCode)))
    const stable = state.acts.some((act) => cleanCode(act.id) === ':dark-matter:092')
      && elbrus.length === 8 && elbrus.every((location) => (location.tokens?.resource ?? 0) > 0)
    const board = panorama(`dark-matter/lost-quantum${stable ? '-stable' : ''}`, {
      ':dark-matter:096': [63, 42], ':dark-matter:097': [36, 31], ':dark-matter:098': [10, 35],
      ':dark-matter:099': [78, 74], ':dark-matter:100': [37, 90], ':dark-matter:101': [86, 32],
      ':dark-matter:102': [15, 72], ':dark-matter:103': [37, 67],
    })
    board.layoutArt = 'dark-matter/lost-quantum'
    return board
  }
  return undefined
}
