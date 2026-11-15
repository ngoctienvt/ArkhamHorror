import { entryKeys } from './narration'
import type { FlavorTextEntry } from './types/FlavorText'

const campaignIds = new Set(['01', '50'])
const campaignPrefix = 'nightOfTheZealot.'

// Return to uses the same narrative keys. Leave campaign-log checks and
// instructions that point to another passage unillustrated.
export const nightOfTheZealotStoryArtByPassage: Readonly<Record<string, string>> = {
  'prologue': 'hankersons-call',
  'theGathering.intro.body': 'gathering-study',
  'theGathering.resolutions.noResolution.body': 'gathering-escape',
  'theGathering.resolutions.resolution1.body': 'gathering-house-fire',
  'theGathering.resolutions.resolution2.body': 'gathering-turned-away',
  'theGathering.resolutions.resolution3.body': 'gathering-trapped',
  'theMidnightMasks.intro1': 'masks-new-allies',
  'theMidnightMasks.intro2': 'masks-ghoul-revelation',
  'theMidnightMasks.intro3': 'masks-skull-clue',
  'theMidnightMasks.resolutions.resolution1.body': 'masks-leads-recorded',
  'theMidnightMasks.resolutions.resolution2.body': 'masks-midnight-bells',
  'theDevourerBelow.intro.body': 'devourer-woods-trail',
  'theDevourerBelow.resolutions.noResolution.body': 'devourer-arkham-falls',
  'theDevourerBelow.resolutions.resolution1.body': 'devourer-ritual-broken',
  'theDevourerBelow.resolutions.resolution2.body': 'devourer-repelled',
  'theDevourerBelow.resolutions.resolution3.body': 'devourer-lita-sacrificed',
}

export function nightOfTheZealotStoryArtFor(
  campaignId: string | undefined,
  entries: FlavorTextEntry[],
): string | undefined {
  if (!campaignId || !campaignIds.has(campaignId)) return

  for (const key of entryKeys(entries, { includeInvalid: false })) {
    if (!key.startsWith(campaignPrefix)) continue
    const passage = key.slice(campaignPrefix.length)
    if (Object.hasOwn(nightOfTheZealotStoryArtByPassage, passage)) {
      return nightOfTheZealotStoryArtByPassage[passage]
    }
  }
}
