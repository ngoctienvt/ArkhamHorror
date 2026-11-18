import type { Point } from './locationGraph'
import type { SceneSnapshot, StageBoard } from './scene-stage-types'
import { areaMask, cleanCode, panorama, scenePath } from './scene-stage-types'

const prefix = ':the-symphony-of-erich-zann:'
const art = 'the-symphony-of-erich-zann'
const floors: Record<string, Point> = {
  '009': [31, 23], '010': [32, 42], '011': [11, 48], '012': [34, 68], '019': [76, 50],
  backstage1: [62, 27], backstage2: [85, 27], backstage3: [66, 80], backstage4: [87, 80],
}
const areas: Record<string, Point[]> = {
  '009': [[22, 6], [42, 6], [43, 24], [23, 24]],
  '010': [[20, 27], [43, 25], [49, 34], [46, 46], [18, 46]],
  '011': [[3, 21], [18, 19], [18, 60], [3, 60]],
  '012': [[19, 48], [48, 47], [56, 61], [55, 78], [30, 78], [16, 63]],
  '019': [[59, 35], [95, 35], [97, 60], [61, 60]],
  backstage1: [[52, 8], [72, 8], [72, 29], [52, 29]],
  backstage2: [[74, 8], [94, 8], [94, 29], [74, 29]],
  backstage3: [[57, 65], [75, 65], [75, 83], [57, 83]],
  backstage4: [[77, 65], [96, 65], [96, 83], [77, 83]],
}

/** Backstage identity belongs to its shuffled slot; removed rooms open into the void. */
export function zannScene(state: SceneSnapshot): StageBoard {
  const opened = state.locations.some((location) => /^backstage[1-4]$/.test(location.label)
    || cleanCode(location.cardCode) === `${prefix}019`)
    || state.acts.some((act) => act.sequence.number >= 3)
  const board = panorama(`${art}/theatre-${opened ? 'open' : 'closed'}`)
  board.layoutArt = `${art}/theatre`
  board.positions = {}
  board.layers = []
  const occupied = new Set<string>()
  const furnishings = new Map<string, Point[][]>()
  for (const location of state.locations) {
    const code = cleanCode(location.cardCode).replace(prefix, '')
    const slot = /^backstage[1-4]$/.test(location.label) ? location.label : code
    if (!floors[slot]) continue
    occupied.add(slot)
    board.positions[location.id] = floors[slot]
    if (opened && slot.startsWith('backstage') && /^01[3-8]$/.test(code)
      && (location.revealed || location.enemyLocation)) {
      const list = furnishings.get(code) ?? []
      list.push(areas[slot])
      furnishings.set(code, list)
    }
  }
  for (const [code, rooms] of furnishings) {
    board.layers.push({ image: scenePath(`${art}/rooms/${code}`), mask: areaMask(rooms) })
  }
  const missing = Object.keys(areas).filter((slot) => !occupied.has(slot)
    && (opened || (!slot.startsWith('backstage') && slot !== '019')))
  if (missing.length) board.layers.push({ image: scenePath(`${art}/theatre-voids`), mask: areaMask(missing.map((slot) => areas[slot])) })
  return board
}
