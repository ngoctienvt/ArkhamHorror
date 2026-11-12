import type { Point } from './locationGraph'

const root = 'the-dream-eaters'

export const dreamEatersAnchors: Record<string, Record<string, Point>> = {
  [`${root}/waking-nightmare`]: {
    '06070': [39, 48], '06071': [14, 55], '06072': [78, 48], '06073': [38, 18], '06074': [54, 72],
    basementDoor1: [40, 73], basementDoor2: [62, 90], basementDoor3: [82, 73],
  },
  [`${root}/beyond-the-gates-steps`]: {
    '06045': [42, 23], '06046': [77, 32], '06047': [51, 44], '06048': [49, 61], '06049': [49, 88],
  },
  [`${root}/beyond-the-gates-woods`]: {
    '06049': [50.5, 28.1], enchantedWoods1: [16.8, 18.7], enchantedWoods2: [83.3, 19.8],
    enchantedWoods3: [21.3, 47], enchantedWoods4: [80.7, 48], enchantedWoods5: [18, 76.8], enchantedWoods6: [82.7, 76.7],
  },
  [`${root}/kadath-kingdom-of-the-skai`]: { '06127': [18, 54], '06128': [48, 49], '06129': [80, 47] },
  [`${root}/kadath-oriab`]: { '06136': [79, 64], '06137': [48, 43], '06138': [18, 67] },
  [`${root}/kadath-mnar`]: { '06130': [82, 42], '06131': [43, 33], '06132': [44, 79] },
  [`${root}/kadath-forbidden-lands`]: { '06133': [84, 42], '06134': [44, 70], '06135': [18, 50] },
  [`${root}/kadath-timeless-realm`]: {
    '06139': [27, 51], '06140': [26, 20], '06141': [26, 88], '06142': [75, 88], '06143': [77, 52],
  },
  [`${root}/thousand-shapes-house`]: {
    '06174': [49, 83], '06175': [49, 64], '06178': [49, 43], '06181': [49, 20], '06182': [83, 80],
    upstairsDoorway1: [28, 29], upstairsDoorway2: [72, 29], downstairsDoorway1: [30, 64], downstairsDoorway2: [71, 64],
  },
  [`${root}/dark-side-of-the-moon`]: {
    '06223': [12.8, 19], '06222': [49.2, 18], '06221': [86.1, 16], '06215': [18, 41], '06216': [52.8, 46.5],
    '06220': [83.2, 43.2], '06217': [17.7, 75], '06218': [45.5, 70.9], '06219': [89, 73.5], '06214': [51, 91.2],
  },
  [`${root}/point-of-no-return`]: {
    enchantedWoods: [11.8, 7.8], '06053': [11.8, 7.8], '06256': [30.3, 26.7], '06259': [52, 35], '06260': [75, 24.2],
    '06254': [13.1, 50], '06255': [30, 55.8], '06261': [51.6, 60], '06257': [15, 74.6], '06258': [34.6, 69],
    seaOfPitch1: [90.4, 37.6], seaOfPitch2: [77.4, 53], seaOfPitch3: [65.7, 74.5], seaOfPitch4: [89, 74.5],
  },
  [`${root}/where-the-gods-dwell-leng`]: {
    '06295': [49, 21], '06297': [17, 54], '06296': [50, 51], '06298': [50, 86], '06299': [83, 83],
  },
  [`${root}/where-the-gods-dwell-towers`]: {
    '06299': [50, 55], northTower: [50, 14], eastTower: [82, 45], southTower: [50, 84], westTower: [18, 45],
  },
}

const staticArt: Readonly<Record<string, string>> = {
  '06063': 'waking-nightmare',
  '06206': 'dark-side-of-the-moon',
  '06247': 'point-of-no-return',
}

export function dreamEatersArt(
  scenario: string,
  layout?: readonly string[] | null,
  activeLabels?: readonly string[],
): string | undefined {
  const layoutLabels = new Set(layout?.flatMap((row) => row.trim().split(/\s+/)))
  const placed = activeLabels?.length ? new Set(activeLabels) : layoutLabels
  let art = staticArt[scenario]

  switch (scenario) {
    case '06039':
      art = [...placed].some((label) => /^enchantedWoods[1-6]$/.test(label))
        && !placed.has('seventySteps') && !placed.has('sevenHundredSteps')
        ? 'beyond-the-gates-woods' : 'beyond-the-gates-steps'
      break
    case '06119':
      // The server's full layout includes every region even while only one is in play.
      if (placed.has('ulthar') || placed.has('skaiRiver') || placed.has('dylathLeen')) art = 'kadath-kingdom-of-the-skai'
      else if (placed.has('baharna') || placed.has('mtNgranek') || placed.has('namelessRuins')) art = 'kadath-oriab'
      else if (placed.has('kadatheron') || placed.has('sarnath') || placed.has('ruinsOfIb')) art = 'kadath-mnar'
      else if (placed.has('ilekVad') || placed.has('forbiddenLands') || placed.has('zulanThek')) art = 'kadath-forbidden-lands'
      else if (['celephaïs', 'celephais', 'serannian', 'hazuthKleg', 'templeOfUnattainableDesires', 'cityWhichAppearsOnNoMap'].some((label) => placed.has(label))) art = 'kadath-timeless-realm'
      else art = 'kadath-kingdom-of-the-skai'
      break
    case '06168':
      art = [...placed].some((label) => /^mysteriousStairs[1-5]$/.test(label)) ? 'endless-stairs/bg' : 'thousand-shapes-house'
      break
    case '06286':
      art = ['northTower', 'eastTower', 'southTower', 'westTower'].some((label) => placed.has(label))
        ? 'where-the-gods-dwell-towers' : 'where-the-gods-dwell-leng'
      break
    case '06333':
      // The ring remains after the center enemy flips and stops acting as a location.
      art = layoutLabels.has('atlachNacha') || [...placed].some((label) => /^theGreatWeb(?:[5-9]|1[01])$/.test(label))
        ? 'weaver/bg-ring' : 'weaver/bg-bridge'
      break
  }

  return art ? `${root}/${art}` : undefined
}
