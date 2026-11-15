import { entryKeys } from './narration'
import type { FlavorTextEntry } from './types/FlavorText'

type CampaignStoryArt = {
  prefix: string
  directory: string
  passages: Readonly<Record<string, string>>
}

export const lateCampaignStoryArt: Readonly<Partial<Record<string, CampaignStoryArt>>> = {
  '08': {
    prefix: 'edgeOfTheEarth',
    directory: 'edge-of-the-earth-story',
    passages: {
      'prologue1.body': 'edge-dyer-warning',
      'iceAndDeath.part1.intro4.body': 'ice-death-burning-wreck',
      'iceAndDeath.part1.resolutions.resolution1.body': 'ice-death-silent-camp',
      'iceAndDeath.part2.intro.body': 'ice-death-missing-search',
      'iceAndDeath.part3.intro.body': 'ice-death-binoculars',
      'fatalMirage.intro1.body': 'fatal-mirage-icy-door',
      'fatalMirage.intro2.body': 'fatal-mirage-icy-door',
      'toTheForbiddenPeaks.intro1.body': 'forbidden-peaks-departure',
      'cityOfTheElderThings.intro.body': 'elder-things-first-sight',
      'theHeartOfMadness.part1.intro.body': 'heart-of-madness-cavern',
      'theHeartOfMadness.part2.intro1.main.body': 'heart-of-madness-beyond-gate',
      'cityOfTheElderThings.resolutions.noResolution.body': 'elder-things-hide-in-tower',
      'cityOfTheElderThings.resolutions.resolution1.body': 'elder-things-secret-passage',
      'fatalMirage.resolutions.resolution1': 'fatal-mirage-waking',
      'iceAndDeath.part2.resolutions.resolution1.body': 'ice-death-search-terror',
      'iceAndDeath.part3.resolutions.noResolution.body': 'ice-death-endless-sun',
      'iceAndDeath.part3.resolutions.resolution1.body': 'ice-death-endless-sun',
      'iceAndDeath.part3.resolutions.resolution2.body': 'ice-death-endless-sun',
    },
  },
  '09': {
    prefix: 'theScarletKeys',
    directory: 'scarlet-keys-story',
    passages: {
      'riddlesAndRain.intro.intro2': 'scarlet-flint-cinema',
      'riddlesAndRain.intro.intro3': 'scarlet-flint-cinema',
      'riddlesAndRain.resolutions.resolution1.body': 'riddles-red-marble',
      'riddlesAndRain.resolutions.resolution2.body': 'riddles-coffin-parley',
      'dogsOfWar.intro.intro2Part1': 'dogs-claret-knight',
      'dogsOfWar.intro.intro3': 'dogs-claret-knight',
      'shadesOfSuffering.intro.intro2': 'shades-kl-station',
      'dancingMad.intro.intro1Part1': 'dancing-mad-cafe-luna',
      'deadHeat.intro.intro1': 'dead-heat-train-arrival',
      'dealingsInTheDark.intro.intro1Part1': 'dealings-galata-bridge',
      'onThinIce.intro.introPart1': 'on-thin-ice-package',
    },
  },
  '10': {
    prefix: 'theFeastOfHemlockVale',
    directory: 'hemlock-vale-story',
    passages: {
      'prelude1.intro.intro1': 'hemlock-causeway-arrival',
      'fateOfTheVale.resolutions.resolution3.body': 'hemlock-lighthouse-white-ash',
      'fateOfTheVale.resolutions.resolution4.body': 'hemlock-lighthouse-gray-ash',
      'prelude2.intro.body': 'hemlock-second-morning',
      'prelude3.intro.intro1': 'hemlock-third-morning',
      'prelude3.intro.intro2': 'hemlock-third-morning',
      'prelude4.intro.intro1': 'hemlock-final-procession',
      'writtenInRock.intro.body': 'north-point-ravine',
      'hemlockHouse.intro.intro1.body': 'hemlock-house-arrival',
      'hemlockHouse.intro.intro3.body': 'hemlock-house-arrival',
      'theSilentHeath.intro.intro3.body': 'heath-ash-arrival',
    },
  },
  '11': {
    prefix: 'theDrownedCity',
    directory: 'drowned-city-story',
    passages: {
      'prologue.body': 'drowned-eerie-arkham',
      'oneLastJob.resolutions.resolution1.body': 'drowned-jade-idol',
      'theDoomOfArkhamPartII.resolutions.resolution2.body': 'drowned-doom-ritual',
      'theDoomOfArkhamPartII.resolutions.resolution3.body': 'drowned-doom-ritual',
    },
  },
}

export function lateCampaignStoryArtFor(
  campaignId: string | undefined,
  entries: FlavorTextEntry[],
): string | undefined {
  if (!campaignId || !Object.hasOwn(lateCampaignStoryArt, campaignId)) return
  const campaign = lateCampaignStoryArt[campaignId]
  if (!campaign) return

  const prefix = campaign.prefix + '.'
  for (const key of entryKeys(entries, { includeInvalid: false })) {
    if (!key.startsWith(prefix)) continue
    const passage = key.slice(prefix.length)
    if (Object.hasOwn(campaign.passages, passage)) {
      return `${campaign.directory}/${campaign.passages[passage]}`
    }
  }
}
