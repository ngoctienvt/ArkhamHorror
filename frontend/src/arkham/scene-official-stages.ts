import type { SceneSnapshot, StageBoard } from './scene-stage-types'
import { hasCode, panorama } from './scene-stage-types'
import { tiledScene } from './scene-stage-tiles'
import { onThinIceScene } from './scene-on-thin-ice'
import { apiaryScene } from './scene-apiary'
import { drownedGridScene } from './scene-drowned-grid'

const escape = {
  theGateOfYquaa: [10, 44], titanicRamp1: [23, 56], titanicRamp2: [43, 47],
  titanicRamp3: [61, 54], titanicRamp4: [82, 50], hiddenTunnel: [96, 38],
} as const

/** Location presence also covers advancing the agenda, saved games and undo. */
export function officialSceneStage(base: StageBoard | undefined, state: SceneSnapshot): StageBoard | undefined {
  switch (state.id.replace(/^c/, '')) {
    case '09609': return onThinIceScene(state)
    case '11612':
    case '11587': return drownedGridScene(state)
    case '08549': return tiledScene(state, {
      art: 'the-edge-of-the-earth/mirage/floor', back: 'the-edge-of-the-earth/mirage/back',
      faces: Object.fromEntries(Array.from({ length: 19 }, (_, i) => {
        const code = String(8556 + i).padStart(5, '0')
        return [code, `the-edge-of-the-earth/mirage/${code}`]
      })),
    })
    case '70001':
      return tiledScene(state, {
        art: 'side-stories/labyrinth/floor', back: 'side-stories/labyrinth/back',
        faces: {
          '70016': 'side-stories/labyrinth/secrets', '70017': 'side-stories/labyrinth/secrets', '70018': 'side-stories/labyrinth/secrets',
          '70019': 'side-stories/labyrinth/rain', '70020': 'side-stories/labyrinth/sorrows', '70021': 'side-stories/labyrinth/sorrows',
          '70022': 'side-stories/labyrinth/night', '70023': 'side-stories/labyrinth/night', '70024': 'side-stories/labyrinth/regret',
          '70025': 'side-stories/labyrinth/halls', '70026': 'side-stories/labyrinth/halls', '70027': 'side-stories/labyrinth/halls',
          '70028': 'side-stories/labyrinth/hunger', '70029': 'side-stories/labyrinth/decay', '70030': 'side-stories/labyrinth/rot',
          '70031': 'side-stories/labyrinth/poison', '70032': 'side-stories/labyrinth/warehouse',
        },
      })
    case '07231':
    case ':return-to-the-innsmouth-conspiracy:039': {
      const above = hasCode(state, /^072(?:39|4[0-3])$/)
      if (base && !above && hasCode(state, /^0724[4-6]$/)) {
        return { ...base, image: 'img/scenes/the-innsmouth-conspiracy/the-lair-of-dagon-caves.webp', weather: undefined }
      }
      break
    }
    case '08648b':
      if (hasCode(state, /^0868[2-6]$/)) {
        return panorama('the-edge-of-the-earth/the-heart-of-madness-escape',
          Object.fromEntries(Object.entries(escape).map(([key, point]) => [key, [...point]])))
      }
      break
    case '72001':
      if (hasCode(state, /^720(?:2[7-9]|3[014])$/)) return tiledScene(state, {
        art: 'side-stories/film-fatale-cosmos', back: 'the-circle-undone/cosmos/cosmos',
        faces: {
          '72009': 'side-stories/film-cosmos/space-set',
          '72027': 'side-stories/film-cosmos/bastion', '72028': 'side-stories/film-cosmos/teetawn',
          '72029': 'side-stories/film-cosmos/ritual-teetawn', '72030': 'side-stories/film-cosmos/tothis',
          '72031': 'side-stories/film-cosmos/ritual-tothis', '72034': 'side-stories/film-cosmos/asteroid',
        },
      })
      if (hasCode(state, /^7205[0-4]$/)) return panorama('side-stories/film-fatale-castle', {
        gothicSet: [48, 88], '72011': [48, 88], throneOfBlood: [55, 26], '72054': [55, 26],
        moonlitGarden: [16, 37], '72053': [16, 37], clockTower: [88, 43], '72052': [88, 43],
        castleHallways: [15, 74], '72050': [15, 74], catacombs: [83, 86], '72051': [83, 86],
      })
      if (hasCode(state, /^720(?:39|4[0-3])$/)) return panorama('side-stories/film-fatale-jungle', {
        jungleSet: [5, 61], '72010': [5, 61], westernRidge: [24, 43], '72039': [24, 43],
        easternRidge: [84, 43], '72041': [84, 43], ruinsOfTheSerpentKing: [62, 56], '72043': [62, 56],
        jungleRiver: [51, 86], '72042': [51, 86], tarPit: [58, 22], '72040': [58, 22],
      })
      break
    case '07274':
    case ':return-to-the-innsmouth-conspiracy:043':
      if (state.locations.some((location) => /^tidalTunnel\d+$/.test(location.label))) {
        return tiledScene(state, {
          art: 'the-innsmouth-conspiracy/the-lair-of-dagon-caves',
          back: 'the-innsmouth-conspiracy/devil-reef/tunnel-back',
          faces: {
            '07283': 'the-innsmouth-conspiracy/dagon/entryway',
            '07290': 'the-innsmouth-conspiracy/dagon/doorway',
            '07291': 'the-innsmouth-conspiracy/dagon/lair',
            '07102': 'the-innsmouth-conspiracy/devil-reef/07102',
            '07103': 'the-innsmouth-conspiracy/devil-reef/07103',
            '07104': 'the-innsmouth-conspiracy/devil-reef/07104',
            ':return-to-the-innsmouth-conspiracy:065': 'the-innsmouth-conspiracy/devil-reef/07102',
            ':return-to-the-innsmouth-conspiracy:066': 'the-innsmouth-conspiracy/devil-reef/07103',
            ':return-to-the-innsmouth-conspiracy:067': 'the-innsmouth-conspiracy/devil-reef/07104',
          },
        })
      }
      break
    case '11553': return apiaryScene(state)
  }
  return base
}
