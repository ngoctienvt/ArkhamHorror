import type { Point } from './locationGraph'
import type { SceneSnapshot, StageBoard } from './scene-stage-types'
import { areaMask, cleanCode, panorama, scenePath } from './scene-stage-types'
import { landmarkPositions } from './scene-stage-landmarks'
import { deadHeatScene } from './scene-dead-heat'

const sewerFloors: Record<string, Point> = {
  '12174': [50, 39], '12175': [50, 19], '12182': [50, 86],
  '12183': [13, 63], '12184': [32, 63], '12185': [51, 65],
  '12186': [69, 62], '12187': [88, 64],
}
const simulatorArea: Point[] = [[52, 25], [57, 24], [65, 26], [68, 33], [68, 43], [64, 47], [56, 47], [52, 41]]

function sewerPositions(state: SceneSnapshot): Record<string, Point> {
  return landmarkPositions(state, Object.fromEntries(['12174', '12175', '12182'].map((code) => [code, sewerFloors[code]])), [{
    labels: Array.from({ length: 5 }, (_, i) => `sewerTunnels${i + 1}`),
    floors: Object.fromEntries(['12183', '12184', '12185', '12186', '12187'].map((code) => [code, sewerFloors[code]])),
  }])
}

export function environmentSceneStage(base: StageBoard | undefined, state: SceneSnapshot): StageBoard | undefined {
  const id = cleanCode(state.id)
  if (id === '09520') return deadHeatScene()
  if ((id === '04277' || id === '53059') && base) {
    const depth = state.counts?.CurrentDepth ?? 1
    const art = `the-forgotten-age/the-depths-of-yoth${depth >= 5 ? '' : depth >= 3 ? '-middle' : '-upper'}`
    return { ...base, image: scenePath(art), layoutArt: 'the-forgotten-age/the-depths-of-yoth' }
  }
  if (id === '12168') {
    const awakened = state.enemies.some((enemy) => cleanCode(enemy.cardCode) === '12179b')
      || state.agendas.some((agenda) => agenda.sequence.step > 2
        || (agenda.sequence.step === 2 && (agenda.flipped || agenda.sequence.side === 'B')))
    const ritual = state.enemies.some((enemy) => cleanCode(enemy.cardCode) === '12179')
      || state.acts.some((act) => act.sequence.number > 1 || act.sequence.side === 'B')
    const art = `brethren-of-ash/queen-of-ash-${awakened ? 'awakened' : ritual ? 'ritual' : 'chambers'}`
    return { ...panorama(art), layoutArt: 'brethren-of-ash/queen-of-ash-chambers', positions: sewerPositions(state) }
  }
  if (id === ':dark-matter:153' && base) {
    const simulation = state.locations.find((location) => /^:dark-matter:17[0-5]$/.test(cleanCode(location.cardCode))
      && (location.revealed || location.enemyLocation))
    if (!simulation) return base
    const code = cleanCode(simulation.cardCode).split(':').pop()
    return { ...base, layers: [{ image: scenePath(`dark-matter/simulations/${code}`), mask: areaMask([simulatorArea]) }] }
  }
  return base
}
