import { entryKeys } from './narration'
import type { FlavorTextEntry } from './types/FlavorText'

const campaignIds = new Set(['03', '52'])
const campaignPrefix = 'thePathToCarcosa.'

// The Return to scenarios reuse the original campaign's narrative keys.
// Only map passages with a story moment of their own. Routing prompts lead to
// separately illustrated passages, and should never preview a branch's outcome.
export const carcosaStoryArtByPassage: Readonly<Record<string, string>> = {
  'prologue.yellowSign.body': 'lake-of-hali',
  'prologue.body': 'campaign-prologue',
  'prologue.lola': 'lola-backstage',
  'curtainCall.intro.body': 'curtain-call-waking',
  'curtainCall.resolutions.noResolution.body': 'curtain-call-stranger',
  'curtainCall.resolutions.resolution1.body': 'curtain-call-police',
  'curtainCall.resolutions.resolution2.body': 'curtain-call-stranger',
  'theLastKing.intro.body': 'last-king-arrival',
  'theLastKing.resolutions.resolution1.body': 'last-king-outside',
  'theLastKing.resolutions.resolution2.body': 'last-king-late-party',
  'theLastKing.resolutions.resolution3.body': 'last-king-memory',
  'interlude1.body': 'last-king-outside',
  'interlude1.lunacysReward1': 'last-king-secret',
  'interlude1.lunacysReward2': 'last-king-barricade',
  'interlude1.lunacysReward3': 'last-king-burning',
  'echoesOfThePast.intro.body': 'echoes-arrival',
  'echoesOfThePast.intro.sebastiensInformation': 'echoes-arrival',
  'echoesOfThePast.resolutions.noResolution.body': 'echoes-escape',
  'echoesOfThePast.resolutions.resolution1.body': 'echoes-clasp-taken',
  'echoesOfThePast.resolutions.resolution2.body': 'echoes-clasp-left',
  'echoesOfThePast.resolutions.resolution3.body': 'echoes-oathspeaker',
  'echoesOfThePast.resolutions.resolution4.body': 'echoes-daniel-vision',
  'theUnspeakableOath.intro.intro1': 'oath-daniel-lead',
  'theUnspeakableOath.intro.intro2': 'oath-daniel-records',
  'theUnspeakableOath.intro.intro3': 'oath-reception',
  'theUnspeakableOath.intro.constancesInformation': 'oath-constance',
  'theUnspeakableOath.resolutions.defeated.body': 'oath-doctor',
  'theUnspeakableOath.resolutions.resolution1.body': 'oath-king-claimed',
  'theUnspeakableOath.resolutions.resolution2.body': 'oath-guards',
  'theUnspeakableOath.resolutions.resolution3.body': 'oath-garden',
  'interlude2.danielSurvived': 'lost-soul-daniel',
  'interlude2.danielDidNotSurvive': 'lost-soul-notes',
  'interlude2.danielWasPossessed': 'lost-soul-script',
  'interlude2.ignoreTheWarning': 'lost-soul-notes',
  'interlude2.heedTheWarning': 'lost-soul-notes',
  'aPhantomOfTruth.intro.intro1': 'phantom-carcosan-dream',
  'aPhantomOfTruth.intro.intro2': 'phantom-carcosan-dream',
  'aPhantomOfTruth.intro.dream1': 'phantom-abyss',
  'aPhantomOfTruth.intro.dream2.body': 'phantom-dance',
  'aPhantomOfTruth.intro.dream3': 'phantom-wine',
  'aPhantomOfTruth.intro.dream4': 'last-king-burning',
  'aPhantomOfTruth.intro.dream5': 'phantom-self-reflection',
  'aPhantomOfTruth.intro.dream6.body': 'phantom-stage',
  'aPhantomOfTruth.intro.dream7': 'phantom-arrest',
  'aPhantomOfTruth.intro.dream8.body': 'phantom-mirror',
  'aPhantomOfTruth.intro.dream9': 'phantom-bone-chase',
  'aPhantomOfTruth.intro.dream10': 'phantom-stained-glass',
  'aPhantomOfTruth.intro.dream11': 'phantom-confrontation',
  'aPhantomOfTruth.intro.dream12': 'phantom-window-shadow',
  'aPhantomOfTruth.intro.dream13': 'phantom-daniel-voice',
  'aPhantomOfTruth.intro.awakening': 'phantom-awakening',
  'aPhantomOfTruth.intro.jordansInformation': 'phantom-cafe',
  'aPhantomOfTruth.resolutions.noResolution.body': 'phantom-court',
  'aPhantomOfTruth.resolutions.resolution1.body': 'phantom-engram-warning',
  'aPhantomOfTruth.resolutions.resolution2.body': 'phantom-engram-study',
  'aPhantomOfTruth.resolutions.resolution3.body': 'phantom-strange-awakening',
  'thePallidMask.intro.intro1': 'pallid-mask-awakening',
  'thePallidMask.intro.intro2': 'phantom-engram-map',
  'thePallidMask.intro.harukosInformation': 'pallid-mask-secret',
  'thePallidMask.resolutions.noResolution.body': 'pallid-mask-script',
  'thePallidMask.resolutions.resolution1.body': 'pallid-mask-louvre',
  'thePallidMask.resolutions.resolution2.body': 'pallid-mask-vortex',
  'blackStarsRise.intro.body': 'black-stars-island',
  'blackStarsRise.intro.ashleighsInformation': 'black-stars-island',
  'blackStarsRise.resolutions.resolution1.body': 'carcosa-below',
  'blackStarsRise.resolutions.resolution2.body': 'carcosa-above',
  'blackStarsRise.resolutions.resolution3.body': 'carcosa-abbey-threshold',
  'dimCarcosa.intro.intro1': 'carcosa-below',
  'dimCarcosa.intro.intro2': 'carcosa-above',
  'dimCarcosa.resolutions.resolution1.body': 'dim-mask-throw',
  'dimCarcosa.resolutions.resolution2.body': 'dim-stranger-bow',
  'dimCarcosa.resolutions.resolution3.body': 'dim-calm-island',
  'dimCarcosa.resolutions.resolution4.body': 'carcosa-abbey-threshold',
  'dimCarcosa.resolutions.resolution5.body': 'dim-lost-soul',
  'epilogue.body': 'epilogue-new-production',
}

export function carcosaStoryArtFor(
  campaignId: string | undefined,
  entries: FlavorTextEntry[],
): string | undefined {
  if (!campaignId || !campaignIds.has(campaignId)) return

  for (const key of entryKeys(entries)) {
    if (!key.startsWith(campaignPrefix)) continue
    const passage = key.slice(campaignPrefix.length)
    if (Object.hasOwn(carcosaStoryArtByPassage, passage)) return carcosaStoryArtByPassage[passage]
  }
}
