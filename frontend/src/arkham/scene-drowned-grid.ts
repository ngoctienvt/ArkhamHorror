import type { SceneSnapshot, StageBoard } from './scene-stage-types'
import { tiledScene } from './scene-stage-tiles'

/** Archives, lift levels and platform swaps use the current board grid, not a card-name anchor. */
export function drownedGridScene(state: SceneSnapshot): StageBoard {
  const court = state.id.replace(/^c/, '') === '11612'
  const folder = `the-drowned-city/${court ? 'court' : 'vault'}`
  const faces: Record<string, string> = {}
  if (court) {
    for (const code of ['11619', '11620', '11621', '11622', '11623', '11624', '11626', '11628']) faces[code] = `${folder}/${code}`
    faces['11622b'] = `${folder}/11622`
    faces['11625'] = `${folder}/11624`
    faces['11627'] = `${folder}/11626`
    faces['11629'] = `${folder}/11628`
  } else {
    for (const code of ['11593', '11594', '11595', '11596', '11598', '11599', '11600', '11604']) faces[code] = `${folder}/${code}`
    for (const code of ['11601', '11602', '11603']) faces[code] = `${folder}/11600`
  }
  return tiledScene(state, { art: `${folder}/floor`, back: `${folder}/back`, faces,
    ...(court ? { publicBacks: { '11622': `${folder}/11622`, '11622b': `${folder}/11622` } } : {}),
  })
}
