import type { SceneSnapshot, StageBoard } from './scene-stage-types'
import { tiledScene } from './scene-stage-tiles'

/** The shuffled banks and river variants keep the real north/south/east/west grid. */
export function wendigoScene(state: SceneSnapshot): StageBoard {
  const folder = 'against-the-wendigo'
  const codes = ['008', '009', '010', '011', '012', '013', '014', '015', '016', '017', '018', '019', '020', '023b', '028b']
  const faces = Object.fromEntries(codes.map((code) => [
    `:against-the-wendigo:${code}`, `${folder}/${['014', '015'].includes(code) ? '013' : code}`,
  ]))
  return tiledScene(state, {
    art: `${folder}/valley-floor`, back: `${folder}/uncharted-back`, faces,
    publicBacks: Object.fromEntries(['008', '009'].map((code) => [`:against-the-wendigo:${code}`, `${folder}/mountain-back`])),
  })
}
