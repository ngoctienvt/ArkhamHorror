import { entryKeys } from './narration'
import type { FlavorTextEntry } from './types/FlavorText'

const campaignIds = new Set(['07'])
const campaignPrefix = 'theInnsmouthConspiracy.'

// Only map passages with a story moment of their own. Routing prompts and
// campaign-log checks leave the illustration to the actual narrative passage.
export const innsmouthStoryArtByPassage: Readonly<Record<string, string>> = {
  'thePitOfDespair.intro.body': 'pit-awakening',
  'thePitOfDespair.resolutions.noResolution.body': 'pit-rescued-shore',
  'thePitOfDespair.resolutions.resolution1.body': 'pit-rescued-shore',
  'interlude1.part1.body': 'interlude1-harper-questioning',
  'interlude1.aMeetingWithThomasDawson.body': 'interlude1-dawson-memory',
  'interlude1.noMemoriesRecovered.body': 'interlude1-amnesia-briefing',
  'interlude1.aBattleWithAHorrifyingDevil.body': 'interlude1-devil-reef-memory',
  'interlude1.aDecisionToStickTogether.body': 'interlude1-dawson-pledge',
  'interlude1.anEncounterWithASecretCult.body': 'interlude1-cult-hq-memory',
  'interlude1.part2.body': 'interlude1-crimson-eclipse',
  'theVanishingOfElinaHarper.intro1.body': 'vanishing-arrival-station',
  'theVanishingOfElinaHarper.townInfo': 'vanishing-joe-sargent',
  'theVanishingOfElinaHarper.intro2.body': 'vanishing-harper-letter',
  'theVanishingOfElinaHarper.resolutions.noResolution.body': 'vanishing-hotel-ransacked',
  'theVanishingOfElinaHarper.resolutions.resolution1.body': 'vanishing-notebook-door',
  'theVanishingOfElinaHarper.resolutions.resolution2.body': 'vanishing-suspect-brian',
  'theVanishingOfElinaHarper.resolutions.resolution3.body': 'vanishing-suspect-othera',
  'theVanishingOfElinaHarper.resolutions.resolution4.body': 'vanishing-suspect-joyce',
  'theVanishingOfElinaHarper.resolutions.resolution5.body': 'vanishing-suspect-barnabas',
  'theVanishingOfElinaHarper.resolutions.resolution6.body': 'vanishing-suspect-zadok',
  'theVanishingOfElinaHarper.resolutions.resolution7.body': 'vanishing-suspect-friendly',
  'interlude2.theSyzygy1.body': 'interlude2-beach-waking',
  'interlude2.theSyzygy2.body': 'interlude2-harper-wounds',
  'interlude2.theSyzygy3.body': 'interlude2-harper-trust',
  'interlude2.theSyzygy4.body': 'interlude2-syzygy-storm',
  'inTooDeep.intro.body': 'intoodeep-overlook',
  'inTooDeep.resolutions.noResolution.body': 'intoodeep-hiding-house',
  'inTooDeep.resolutions.resolution1.body': 'intoodeep-car-key-flash',
  'devilReef.intro1.body': 'devilreef-mr-moore',
  'devilReef.intro2.body': 'devilreef-dawson-shotgun',
  'devilReef.intro3.body': 'devilreef-dawson-weary',
  'devilReef.resolutions.resolution1.body': 'devilreef-return-harbor',
  'interlude3.beneathTheWaves1.body': 'interlude3-oceiros-vision',
  'interlude3.purpleKey': 'interlude3-idol-memory',
  'interlude3.whiteKey': 'interlude3-mantle-memory',
  'interlude3.blackKey': 'interlude3-headdress-memory',
  'interlude3.noKeys': 'interlude3-empty-reef-memory',
  'interlude3.beneathTheWaves2': 'interlude3-road-sunset',
  'horrorInHighGear.intro.body': 'highgear-car-chase',
  'horrorInHighGear.resolutions.noResolution.body': 'highgear-abandoned-dawn',
  'horrorInHighGear.resolutions.resolution1.body': 'highgear-pullover-fog',
  'aLightInTheFog.intro.body': 'fog-lighthouse-cliffs',
  'aLightInTheFog.resolutions.resolution1.body': 'fog-collapse-shore',
  'aLightInTheFog.resolutions.resolution2.body': 'fog-collapse-woods',
  'aLightInTheFog.resolutions.resolution3.body': 'fog-drowned-hatch',
  'aLightInTheFog.resolutions.resolution4.body': 'fog-collapse-woods',
  'theLairOfDagon.intro1.body': 'lair-masonic-steps',
  'theLairOfDagon.intro2.body': 'lair-cult-revelation',
  'theLairOfDagon.intro3.body': 'lair-cult-revelation',
  'theLairOfDagon.intro4.body': 'lair-enter-together',
  'theLairOfDagon.intro5.body': 'lair-split-up',
  'theLairOfDagon.resolutions.noResolution.body': 'lair-angry-mob',
  'theLairOfDagon.resolutions.resolution1.body': 'lair-dawson-sacrifice',
  'theLairOfDagon.resolutions.resolution2.body': 'lair-defiant-silence',
  'theLairOfDagon.resolutions.resolution3.body': 'lair-shoved-pit',
  'theLairOfDagon.resolutions.resolution4.body': 'lair-shoved-pit',
  'interlude4.hiddenTruths.body': 'interlude4-harbor-plan',
  'interlude4.guardianDispatched': 'interlude4-reef-trophy',
  'interlude4.rightfulKeeper': 'interlude4-relic-heir',
  'intoTheMaelstrom.intro.body': 'maelstrom-stolen-boat',
  'intoTheMaelstrom.resolutions.noResolution.body': 'maelstrom-yhanthlei-flood',
  'intoTheMaelstrom.resolutions.resolution1.body': 'maelstrom-surface-rock',
  'intoTheMaelstrom.resolutions.resolution2.body': 'maelstrom-calm-sky',
  'intoTheMaelstrom.resolutions.resolution3.body': 'maelstrom-ominous-sky',
  'intoTheMaelstrom.resolutions.resolution4.body': 'maelstrom-flare-victory',
  'intoTheMaelstrom.resolutions.resolution5.body': 'maelstrom-harper-missing',
  'intoTheMaelstrom.resolutions.resolution6.body': 'maelstrom-flare-grim',
  'intoTheMaelstrom.resolutions.resolution7.body': 'maelstrom-delay-inevitable',
  'intoTheMaelstrom.resolutions.resolution8.body': 'maelstrom-world-drowned',
  'epilogue.epilogue1.body': 'epilogue-drive-arkham',
  'epilogue.epilogue2.body': 'epilogue-accelerator',
  'epilogue.flashback15.body': 'epilogue-dawson-map',
}

export function innsmouthStoryArtFor(
  campaignId: string | undefined,
  entries: FlavorTextEntry[],
): string | undefined {
  if (!campaignId || !campaignIds.has(campaignId)) return

  for (const key of entryKeys(entries)) {
    if (!key.startsWith(campaignPrefix)) continue
    const passage = key.slice(campaignPrefix.length)
    if (Object.hasOwn(innsmouthStoryArtByPassage, passage)) return innsmouthStoryArtByPassage[passage]
  }
}
