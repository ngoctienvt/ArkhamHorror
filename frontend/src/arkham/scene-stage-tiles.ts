import type { SceneSnapshot, StageBoard } from './scene-stage-types'
import { cleanCode, panorama, scenePath } from './scene-stage-types'

export type TileSet = {
  art: string
  back: string
  faces: Record<string, string>
  publicBacks?: Record<string, string>
  alwaysVisible?: readonly string[]
}

/** Unknown faces show a neutral back; hidden identities never select visible artwork. */
export function tiledScene(state: SceneSnapshot, set: TileSet): StageBoard {
  const back = scenePath(set.back)
  return {
    ...panorama(set.art), islands: `img/scenes/${set.art}`, tileBack: back,
    tileImages: Object.fromEntries(state.locations.map((location) => {
      const code = cleanCode(location.cardCode)
      const visible = location.revealed || location.enemyLocation || set.alwaysVisible?.includes(code)
      return [location.id, visible && set.faces[code] ? scenePath(set.faces[code])
        : set.publicBacks?.[code] ? scenePath(set.publicBacks[code]) : back]
    })),
  }
}
