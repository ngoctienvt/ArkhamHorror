import type { Point } from './locationGraph'
import type { SceneSnapshot, StageBoard } from './scene-stage-types'
import { cleanCode } from './scene-stage-types'
import { tiledScene } from './scene-stage-tiles'

const floors: Record<string, Point> = {
  '244b': [8, 50], '250': [9, 18], '251': [67, 50], '252': [47, 50], '253': [87, 50],
  '255': [87, 18], '259': [27, 50], '260': [67, 18], '261': [47, 18],
  '262': [47, 82], '263': [67, 82], '264': [27, 82], '265': [87, 82],
}
const names: Record<string, string> = {
  '244b': 'sol', '251': 'new-brooklyn', '252': 'hope', '253': 'yuggoth', '255': 'cassilda',
  '259': 'earth', '260': 'mount-sinai', '261': 'cassilda', '262': 'martian-ruins',
  '263': 'olympus-telescope', '264': 'moonbase', '265': 'threshold',
}

/** The two ships are locations, so their placement—not the asset vehicle model—owns docking. */
export function starfallScene(state: SceneSnapshot): StageBoard {
  const prefix = ':dark-matter:'
  const faces = Object.fromEntries(Object.entries(names).map(([code, name]) => [prefix + code, `dark-matter/starfall/${name}`]))
  faces[`${prefix}250`] = 'ages-unwound/unstuck/083'
  const board = tiledScene(state, {
    art: 'side-stories/film-fatale-cosmos', back: 'the-circle-undone/cosmos/cosmos', faces,
    publicBacks: {
      [`${prefix}251`]: 'dark-matter/starfall/asteroid-belt-hidden',
      [`${prefix}252`]: 'dark-matter/starfall/mars-hidden',
      [`${prefix}253`]: 'dark-matter/starfall/pluto-hidden',
    },
  })
  const positions: Record<string, Point> = {}
  for (const location of state.locations) {
    const code = cleanCode(location.cardCode).slice(prefix.length)
    if (floors[code]) positions[location.id] = floors[code]
  }
  for (const location of state.locations) {
    const code = cleanCode(location.cardCode)
    if (![`${prefix}250`, `${prefix}255`].includes(code) || location.placement?.tag !== 'AttachedToLocation') continue
    const host = positions[location.placement.contents]
    if (!host) continue
    const left = code === `${prefix}250`
    positions[location.id] = [Math.max(8, Math.min(92, host[0] + (left ? -6 : 6))), host[1] < 30 ? host[1] + 18 : host[1] - 18]
  }
  return { ...board, positions, tileSize: [13, 18] }
}
