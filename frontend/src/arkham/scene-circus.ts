import { gridPositions, type Point } from './locationGraph'
import type { SceneSnapshot, StageBoard } from './scene-stage-types'
import { areaMask, cleanCode, panorama, scenePath } from './scene-stage-types'
import { tiledScene } from './scene-stage-tiles'

const pack = ':circus-ex-mortis:'
const folder = 'circus-ex-mortis'
const grounds: Record<string, Point> = {
  '011': [52, 13], '117': [52, 13], '219': [19, 78], '220': [14, 25],
  '221': [87, 24], '222': [78, 85], '223': [51, 36], '224': [34, 51], '225': [66, 51],
  '118': [51, 49], '118b': [51, 49],
}
const manor: Record<string, Point> = {
  '129': [48, 46], '130': [21, 49], '131': [82, 46], '132': [22, 22], '133': [75, 24],
  '134': [48, 15], '135': [71, 69], '136': [28, 69], '137': [50, 92],
}
const basement: Record<string, Point[]> = {
  '135': [[54, 55], [92, 55], [92, 75], [54, 75]],
  '136': [[8, 55], [45, 55], [45, 75], [8, 75]],
  '137': [[29, 75], [72, 75], [72, 99], [29, 99]],
}

function anchors(points: Record<string, Point>): Record<string, Point> {
  return Object.fromEntries(Object.entries(points).map(([code, point]) => [pack + code, point]))
}

function circusGrounds(state: SceneSnapshot): StageBoard {
  const board = panorama(`${folder}/grounds`, anchors(grounds))
  const blake = state.enemies.find((enemy) => /^118b?$/.test(cleanCode(enemy.cardCode).replace(pack, ''))
    && enemy.asSelfLocation && enemy.placement.tag !== 'OutOfPlay')
  if (blake) {
    const code = blake.flipped || cleanCode(blake.cardCode).endsWith('b') ? '118b' : '118'
    board.figures = [{ id: blake.id, image: scenePath(`${folder}/tiles/${code}`), point: [51, 49], size: [15, 21] }]
  }
  return board
}

function bacchanalia(state: SceneSnapshot): StageBoard {
  const board = panorama(`${folder}/bacchanalia-sealed`, anchors(manor))
  board.layoutArt = `${folder}/bacchanalia`
  const rooms = state.locations.flatMap((location) => {
    const code = cleanCode(location.cardCode).replace(pack, '')
    return basement[code] ? [basement[code]] : []
  })
  if (rooms.length) {
    rooms.push([[44, 54], [56, 54], [56, 84], [44, 84]])
    board.layers = [{ image: scenePath(`${folder}/bacchanalia`), mask: areaMask(rooms) }]
  }
  return board
}

export function circusScene(state: SceneSnapshot): StageBoard | undefined {
  const id = cleanCode(state.id)
  if (id === `${pack}001` || id === `${pack}108`) return circusGrounds(state)
  if (id === `${pack}122`) return bacchanalia(state)
  const faces: Record<string, string> = {}
  const add = (code: number | string, shared: number | string = code) => {
    faces[pack + String(code).padStart(3, '0')] = `${folder}/tiles/${String(shared).padStart(3, '0')}`
  }
  let art = `${folder}/forest-night`
  if (id === `${pack}017`) for (let code = 21; code <= 34; code++) add(code)
  else if (id === `${pack}040`) {
    add(47)
    for (let code = 48; code <= 51; code++) add(code, 48)
    for (let code = 52; code <= 55; code++) add(code, 52)
    add(56); add(57, 56)
    for (let code = 65; code <= 69; code++) add(code, 65)
  } else if (id === `${pack}074`) {
    art = `${folder}/railway`
    for (let code = 81; code <= 95; code++) add(code)
  } else if (id === `${pack}153`) {
    art = `${folder}/forest-dawn`
    add(160); add(161)
    for (let code = 162; code <= 177; code++) add(code, code <= 165 ? 162 : code <= 169 ? 166 : code <= 172 ? 170 : 173)
    for (let code = 178; code <= 181; code++) { add(code, 'path'); add(`${code}b`, 'path') }
  } else if (id === `${pack}190`) {
    art = `${folder}/forest-dawn`
    add(195, 161)
    for (let code = 196; code <= 200; code++) add(code)
    for (let code = 203; code <= 206; code++) { add(`${code}b`); add(code, `${code}b`) }
  } else return undefined
  const board = tiledScene(state, { art, back: `${folder}/tiles/${id === `${pack}074` ? 'train-back' : 'forest-back'}`, faces })
  if (id === `${pack}040` || id === `${pack}153`) {
    const slots = gridPositions([...(state.layout ?? [])])
    board.positions = Object.fromEntries(state.locations.flatMap((location) => slots[location.label] ? [[location.id, slots[location.label]]] : []))
    board.figures = []
    if (id === `${pack}040`) for (const enemy of state.enemies) {
      const point = enemy.asSelfLocation && slots[enemy.asSelfLocation]
      if (point && enemy.placement.tag !== 'OutOfPlay' && /^:circus-ex-mortis:06[5-9]$/.test(cleanCode(enemy.cardCode))) {
        board.figures.push({ id: enemy.id, image: scenePath(`${folder}/tiles/065`), point: [point[0], point[1] + 8], size: [25, 29] })
      }
    }
    if (id === `${pack}153`) {
      const rows = (state.layout ?? []).map((row) => row.trim().split(/\s+/))
      const width = Math.max(1, ...rows.map((row) => row.length))
      for (const key of new Set(state.locations.map((location) => location.group?.key).filter(Boolean))) {
        const cells = rows.flatMap((row) => row.flatMap((label, column) => label === key ? [column] : []))
        const center = key && slots[key]
        if (!center || !cells.length) continue
        const members = state.locations.filter((location) => location.group?.key === key)
          .sort((a, b) => (a.group?.index ?? 0) - (b.group?.index ?? 0))
        const left = Math.min(...cells), span = Math.max(...cells) - left + 1
        members.forEach((location, index) => {
          board.positions![location.id] = [(left + (index + 0.5) * span / members.length) / width * 100, center[1]]
        })
      }
      for (const story of state.stories ?? []) {
        if (story.placement.tag !== 'AsSelfLocation' || !/^path[1-4]$/.test(story.placement.contents)) continue
        const point = slots[story.placement.contents]
        if (point) board.figures.push({ id: story.id, image: scenePath(`${folder}/tiles/path`), point: [point[0], point[1] + 5], size: [15, 13] })
      }
      board.tileSize = [16, 13]
    }
  }
  return board
}
