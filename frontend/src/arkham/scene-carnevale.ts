import type { Point } from './locationGraph'
import type { SceneSnapshot, StageBoard } from './scene-stage-types'
import { cleanCode, hasCode, panorama, scenePath } from './scene-stage-types'
import { tiledScene } from './scene-stage-tiles'

/** Shuffled Venice landmarks occupy the public clockwise slots; Gondola removes that whole ring. */
export function carnevaleScene(state: SceneSnapshot): StageBoard {
  const folder = 'side-stories/carnevale'
  const gondola = hasCode(state, /^82006b$/)
  const departed = gondola && !hasCode(state, /^820(?:0[89]|1[0-6])$/)
  const board = departed ? panorama(`${folder}/gondola`) : tiledScene(state, {
    art: `${folder}/floor`, back: `${folder}/back`,
    faces: { ...Object.fromEntries(Array.from({ length: 9 }, (_, i) => {
      const code = String(82008 + i)
      return [code, `${folder}/${code}`]
    })), '82006b': `${folder}/gondola-tile` },
    publicBacks: { '82006b': `${folder}/gondola-tile` },
  })
  board.positions = {}
  if (!departed) board.tileSize = [21, 23]
  for (const location of state.locations) {
    if (cleanCode(location.cardCode) === '82006b') board.positions[location.id] = departed ? [54, 61] : [57, 55]
    else {
      const match = /^location([1-8])$/.exec(location.label)
      if (!match) continue
      const angle = (Number(match[1]) - 1) * Math.PI / 4
      board.positions[location.id] = [50 + 36 * Math.sin(angle), 50 - 36 * Math.cos(angle)]
    }
  }
  const beast = state.enemies.find((enemy) => cleanCode(enemy.cardCode) === '82027'
    && enemy.asSelfLocation && enemy.placement.tag !== 'OutOfPlay')
  if (beast) {
    const point: Point = departed ? [28, 55] : [50, 62]
    board.figures = [{ id: beast.id, image: scenePath(`${folder}/cnidathqua`), point,
      size: departed ? [30, 40] : [22, 27], mask: 'linear-gradient(to bottom, black 70%, transparent 100%)' }]
  }
  return board
}
