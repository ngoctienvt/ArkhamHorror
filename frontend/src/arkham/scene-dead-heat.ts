import type { SceneSnapshot, StageBoard } from './scene-stage-types'
import { cleanCode, panorama, scenePath } from './scene-stage-types'

/** Normal and abandoned printings keep the same physical Marrakesh landmarks. */
export function deadHeatScene(state: SceneSnapshot): StageBoard {
  const night = state.agendas.some((agenda) => agenda.sequence.step > 1
    || (agenda.sequence.step === 1 && (agenda.flipped || agenda.sequence.side === 'B')))
  const vines = state.acts.some((act) => cleanCode(act.id) === '09525' || act.sequence.number >= 3)
  const suffix = `${night ? '-night' : ''}${vines ? '-vines' : ''}`
  const board = panorama(`the-scarlet-keys/dead-heat${suffix}`, {
    '09526': [52, 24], '09531': [52, 24],
    '09527': [51, 82], '09532': [51, 82],
    '09528': [17, 30], '09533': [17, 30],
    '09529': [90, 80], '09534': [90, 80],
    '09530': [83, 33], '09535': [83, 33],
  })
  board.layoutArt = 'the-scarlet-keys/dead-heat'
  // Her replacement side is public only after the brazier is toppled in Act 2B.
  // Defeating the last boss then immediately ends Act 3 and the scenario.
  if (state.enemies.some((enemy) => cleanCode(enemy.cardCode) === '09537b')) {
    board.figures = [{ id: 'bahia-garden-fire', image: scenePath('the-scarlet-keys/dead-heat-garden-fire'),
      point: [81, 41], size: [11, 18] }]
  }
  return board
}
