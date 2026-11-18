import type { Point } from './locationGraph'
import { gridPositions } from './locationGraph'
import type { SceneSnapshot, StageBoard } from './scene-stage-types'
import { cleanCode, scenePath } from './scene-stage-types'
import { tiledScene } from './scene-stage-tiles'

/** Repeated CSS grid areas represent one room spanning cells; use its centre. */
export function spannedRoomPositions(state: SceneSnapshot): Record<string, Point> {
  const slots = gridPositions([...(state.layout ?? [])])
  return Object.fromEntries(state.locations.flatMap((location) => {
    const point = slots[location.label]
    return point ? [[location.id, point]] : []
  }))
}

export function antarcticGrid(state: SceneSnapshot): StageBoard | undefined {
  const id = cleanCode(state.id)
  const city = id === '08621'
  if (!city && !['08648a', '08648b'].includes(id)) return undefined
  if (state.locations.some((location) => /^0868[2-6]$/.test(cleanCode(location.cardCode)))) return undefined
  const folder = 'the-edge-of-the-earth/antarctic'
  const codes = city
    ? Array.from({ length: 11 }, (_, i) => String(8630 + i).padStart(5, '0'))
    : ['08649', ...Array.from({ length: 7 }, (_, i) => String(8650 + i).padStart(5, '0')),
      ...Array.from({ length: 5 }, (_, i) => String(8664 + i).padStart(5, '0')),
      ...Array.from({ length: 5 }, (_, i) => String(8674 + i).padStart(5, '0'))]
  const faces = Object.fromEntries(codes.map((code) => [code, `${folder}/${/^0867[4-8]$/.test(code) ? 'pylon' : code}`]))
  const publicBacks = Object.fromEntries(codes.filter((code) => /^0867[4-8]$/.test(code)).map((code) => [code, `${folder}/pylon`]))
  const board = tiledScene(state, {
    art: `${folder}/${city ? 'city-floor' : 'facility-floor'}`,
    back: `${folder}/${city ? 'city-back' : 'facility-back'}`, faces, publicBacks,
  })
  for (const location of state.locations) {
    if (location.revealed && /^0867[4-8]$/.test(cleanCode(location.cardCode))
      && location.modifiers?.some((modifier) => modifier.type.tag === 'ScenarioModifier' && modifier.type.contents === 'collapsed')) {
      board.tileImages![location.id] = scenePath(`${folder}/pylon-collapsed`)
    }
  }
  // Keep the facility's five spokes and three rings exactly as the card-board areas.
  return city ? board : { ...board, positions: spannedRoomPositions(state), tileSize: [13, 14] }
}
