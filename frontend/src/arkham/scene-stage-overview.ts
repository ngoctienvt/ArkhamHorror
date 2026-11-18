import type { HemlockOverview } from './hemlock-overview'
import type { SceneSnapshot, StageBoard } from './scene-stage-types'
import { officialSceneStage } from './scene-official-stages'
import { homebrewSceneStage } from './scene-homebrew-stages'
import { regionalSceneStage } from './scene-regional-stages'
import { homebrewManorStage } from './scene-homebrew-manors'
import { antarcticGrid } from './scene-antarctic-grid'
import { standaloneSceneStage } from './scene-standalone-stages'
import { environmentSceneStage } from './scene-environment-stages'
import { arkhamDistrictStage } from './scene-arkham-districts'
import { sharedReferenceStage } from './scene-shared-reference'

/** Scene choices are derived exclusively from the current public game snapshot. */
export function stageOverview(base: HemlockOverview | undefined, state: SceneSnapshot): StageBoard | undefined {
  const official = sharedReferenceStage(antarcticGrid(state) ?? officialSceneStage(base, state), state)
  const homebrew = homebrewManorStage(homebrewSceneStage(official, state), state)
  return environmentSceneStage(arkhamDistrictStage(standaloneSceneStage(regionalSceneStage(homebrew, state), state), state), state)
}
