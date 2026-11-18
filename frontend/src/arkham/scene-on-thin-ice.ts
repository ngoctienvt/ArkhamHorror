import type { SceneSnapshot, StageBoard } from './scene-stage-types'
import { hasCode, panorama } from './scene-stage-types'
import { landmarkPositions } from './scene-stage-landmarks'

/** The lair opens beside the current public entry connection; Alaska stays in play. */
export function onThinIceScene(state: SceneSnapshot): StageBoard {
  const art = 'the-scarlet-keys/on-thin-ice-region'
  return {
    ...panorama(hasCode(state, /^09615b$/) ? 'the-scarlet-keys/on-thin-ice-lair' : art), layoutArt: art,
    positions: landmarkPositions(state, { '09617': [18, 80], '09618': [61, 30], '09615b': [76, 89] }, [
      { labels: ['alaskanWilderness1', 'alaskanWilderness2', 'alaskanWilderness3'],
        floors: { '09619': [38, 31], '09620': [55, 54], '09621': [33, 65] } },
      { labels: ['outerWilderness1', 'outerWilderness2', 'outerWilderness3'],
        floors: { '09622': [88, 19], '09623': [88, 39], '09624': [90, 61] } },
    ]),
  }
}
