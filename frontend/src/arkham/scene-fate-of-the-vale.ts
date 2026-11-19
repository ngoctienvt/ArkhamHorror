import type { SceneSnapshot, StageBoard } from './scene-stage-types'
import { cleanCode, scenePath } from './scene-stage-types'
import { tiledScene } from './scene-stage-tiles'

/** The shuffled nests and new caves follow public slots; the village replaces this whole board. */
export function fateOfTheValeScene(base: StageBoard | undefined, state: SceneSnapshot): StageBoard | undefined {
  const rows = (state.layout ?? []).map((row) => row.trim().split(/\s+/))
  if (rows.some((row) => row.includes('diamond'))) return base
  const faces: Record<string, string> = { '10670': 'hemlock-vale/fate/abyss' }
  for (let code = 10666; code <= 10669; code++) faces[String(code)] = 'hemlock-vale/fate/nest'
  for (let code = 10716; code <= 10720; code++) faces[String(code)] = `hemlock-vale/silent-heath/${code}`
  const board = tiledScene(state, { art: 'the-circle-undone/before-the-black-throne',
    back: 'hemlock-vale/fate/back', faces })
  board.tileSpans = {}
  for (const location of state.locations) {
    const code = cleanCode(location.cardCode)
    if (!location.revealed && !location.enemyLocation && /^107(?:1[6-9]|20)$/.test(code)) {
      board.tileImages![location.id] = scenePath('hemlock-vale/silent-heath/cavern-back')
    }
    if (code === '10670') {
      const cells = rows.flatMap((row, y) => row.flatMap((label, x) => label === location.label ? [{ x, y }] : []))
      if (cells.length) board.tileSpans[location.id] = [
        Math.max(...cells.map((cell) => cell.x)) - Math.min(...cells.map((cell) => cell.x)) + 1,
        Math.max(...cells.map((cell) => cell.y)) - Math.min(...cells.map((cell) => cell.y)) + 1,
      ]
    }
  }
  return board
}
