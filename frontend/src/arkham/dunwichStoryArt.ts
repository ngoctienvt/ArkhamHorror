import { entryKeys } from './narration'
import type { FlavorTextEntry } from './types/FlavorText'

const campaignIds = new Set(['02', '51'])
const campaignPrefix = 'theDunwichLegacy.'

// The original and Return to use the same story keys.
export const dunwichStoryArtByPassage: Readonly<Record<string, string>> = {
  'prologue.body': 'armitage-request',
  'extracurricularActivity.intro.body': 'rice-search',
  'extracurricularActivity.resolutions.noResolution.body': 'campus-ambulance',
  'extracurricularActivity.resolutions.resolution1.body': 'rice-rescued',
  'extracurricularActivity.resolutions.resolution2.body': 'campus-evacuation',
  'extracurricularActivity.resolutions.resolution3.body': 'rice-empty-office',
  'extracurricularActivity.resolutions.resolution4.body': 'campus-awakening',
  'theHouseAlwaysWins.intro.body': 'bella-luna-door',
  'theHouseAlwaysWins.resolutions.resolution1.body': 'clover-collapse',
  'theHouseAlwaysWins.resolutions.resolution2.body': 'morgan-rescued',
  'theHouseAlwaysWins.resolutions.resolution3.body': 'naomi-and-peter',
  'theHouseAlwaysWins.resolutions.resolution4.body': 'clover-firefighters',
  'interlude1.armitagesFate1': 'armitage-kidnapped',
  'interlude1.armitagesFate2': 'armitage-confession',
  'theMiskatonicMuseum.intro.body': 'orne-library-wilbur',
  'theMiskatonicMuseum.intro.part1.body': 'restricted-hall-notes',
  'theMiskatonicMuseum.intro.part2.body': 'armitage-museum-warning',
  'theMiskatonicMuseum.resolutions.noResolution.body': 'museum-retreat',
  'theMiskatonicMuseum.resolutions.resolution1.body': 'necronomicon-burning',
  'theMiskatonicMuseum.resolutions.resolution2.body': 'necronomicon-kept',
  'theEssexCountyExpress.intro.body': 'train-jolt',
  'theEssexCountyExpress.resolutions.defeat': 'train-woods-wreck',
  'theEssexCountyExpress.resolutions.resolution1.body': 'train-gate-closes',
  'theEssexCountyExpress.resolutions.resolution2.body': 'train-track-walk',
  'bloodOnTheAltar.intro.body': 'zebulon-empty-house',
  'bloodOnTheAltar.resolutions.noResolution.body': 'dunwich-silence',
  'bloodOnTheAltar.resolutions.resolution1.body': 'silas-destroyed',
  'bloodOnTheAltar.resolutions.resolution2.body': 'silas-restored',
  'bloodOnTheAltar.resolutions.resolution3.body': 'silas-ichor',
  'interlude2.body': 'survivors-freed',
  'interlude2.drHenryArmitage': 'survivors-armitage',
  'interlude2.professorWarrenRice': 'survivors-rice',
  'interlude2.drFrancisMorgan': 'survivors-morgan',
  'interlude2.zebulonWhateley': 'survivors-zebulon',
  'interlude2.earlSawyer': 'survivors-earl',
  'undimensionedAndUnseen.intro.body': 'brood-news',
  'undimensionedAndUnseen.intro.part1': 'brood-calm',
  'undimensionedAndUnseen.intro.part2': 'brood-evacuation',
  'undimensionedAndUnseen.resolutions.resolution1.body': 'brood-retreat',
  'undimensionedAndUnseen.resolutions.resolution2.body': 'brood-ended',
  'whereDoomAwaits.intro.body': 'sentinel-approach',
  'whereDoomAwaits.intro.part1.body': 'naomi-gunmen',
  'whereDoomAwaits.resolutions.resolution1.body': 'sentinel-portal',
  'whereDoomAwaits.resolutions.resolution2.body': 'yog-earth',
  'lostInTimeAndSpace.intro.body': 'beyond-gate',
  'lostInTimeAndSpace.resolutions.defeated': 'beyond-ledge',
  'lostInTimeAndSpace.resolutions.resolution1.body': 'sentinel-returned',
  'lostInTimeAndSpace.resolutions.resolution2.body': 'sentinel-no-trace',
  'lostInTimeAndSpace.resolutions.resolution3.body': 'rift-engulfed',
  'lostInTimeAndSpace.resolutions.resolution4.body': 'yog-earth',
  'epilogue.epilogue1': 'curtis-whateley-farm',
  'epilogue.epilogue2': 'gene-tracks',
}

export function dunwichStoryArtFor(
  campaignId: string | undefined,
  entries: FlavorTextEntry[],
): string | undefined {
  if (!campaignId || !campaignIds.has(campaignId)) return

  for (const key of entryKeys(entries)) {
    if (!key.startsWith(campaignPrefix)) continue
    const passage = key.slice(campaignPrefix.length)
    if (Object.hasOwn(dunwichStoryArtByPassage, passage)) return dunwichStoryArtByPassage[passage]
  }
}
