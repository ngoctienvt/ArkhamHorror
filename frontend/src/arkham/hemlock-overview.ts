import type { Point } from './locationGraph'

const boards = new Map([
  // Night of the Zealot
  ['01120', 'night-of-the-zealot/midnight-masks'],
  ['50025', 'night-of-the-zealot/midnight-masks'],
  ['01142', 'night-of-the-zealot/devourer-below'],
  ['50032', 'night-of-the-zealot/devourer-below'],

  // The Dunwich Legacy (Season 2)
  ['02041', 'the-dunwich-legacy/extracurricular-activity'],
  ['51012', 'the-dunwich-legacy/extracurricular-activity'],
  ['02062', 'the-dunwich-legacy/the-house-always-wins'],
  ['51016', 'the-dunwich-legacy/the-house-always-wins'],
  ['02118', 'the-dunwich-legacy/the-miskatonic-museum'],
  ['51025', 'the-dunwich-legacy/the-miskatonic-museum'],
  ['02159', 'the-dunwich-legacy/the-essex-county-express'],
  ['51031', 'the-dunwich-legacy/the-essex-county-express'],
  ['02195', 'the-dunwich-legacy/blood-on-the-altar'],
  ['51032', 'the-dunwich-legacy/blood-on-the-altar'],
  ['51036', 'the-dunwich-legacy/blood-on-the-altar'],
  ['02236', 'the-dunwich-legacy/undimensioned-and-unseen'],
  ['51041', 'the-dunwich-legacy/undimensioned-and-unseen'],
  ['02274', 'the-dunwich-legacy/where-doom-awaits'],
  ['51047', 'the-dunwich-legacy/where-doom-awaits'],
  ['02311', 'the-dunwich-legacy/lost-in-time-and-space'],
  ['51051', 'the-dunwich-legacy/lost-in-time-and-space'],

  // The Feast of Hemlock Vale
  ['10704', 'hemlock-vale/vale-day'],
  ['10677a', 'hemlock-vale/vale-day'],
  ['10679a', 'hemlock-vale/vale-day'],
  ['10679b', 'hemlock-vale/vale-night'],
  ['10523', 'hemlock-vale/hemlock-house'],
  ['10549', 'hemlock-vale/silent-heath'],
  ['10569', 'hemlock-vale/lost-sister'],
  ['10588', 'hemlock-vale/thing-in-the-depths'],
  ['10605', 'hemlock-vale/twisted-hollow'],
  ['10626', 'hemlock-vale/longest-night'],
  ['10651', 'hemlock-vale/fate-of-the-vale'],

  // The Scarlet Keys
  ['09501', 'the-scarlet-keys/riddles-and-rain'],
  ['09520', 'the-scarlet-keys/dead-heat'],
  ['09545', 'the-scarlet-keys/sanguine-shadows'],
  ['09566', 'the-scarlet-keys/dealings-in-the-dark'],
  ['09591', 'the-scarlet-keys/dancing-mad'],
  ['09609', 'the-scarlet-keys/on-thin-ice'],
  ['09635', 'the-scarlet-keys/dogs-of-war'],
  ['09660', 'the-scarlet-keys/shades-of-suffering'],
  ['09681', 'the-scarlet-keys/without-a-trace'],
  ['09694', 'the-scarlet-keys/congress-of-the-keys'],

  // The Path to Carcosa & Return to The Path to Carcosa
  ['03043', 'the-path-to-carcosa/curtain-call'],
  ['52014', 'the-path-to-carcosa/curtain-call'],
  ['03061', 'the-path-to-carcosa/the-last-king'],
  ['52021', 'the-path-to-carcosa/the-last-king'],
  ['03120', 'the-path-to-carcosa/echoes-of-the-past'],
  ['52028', 'the-path-to-carcosa/echoes-of-the-past'],
  ['03159', 'the-path-to-carcosa/the-unspeakable-oath'],
  ['52034', 'the-path-to-carcosa/the-unspeakable-oath'],
  ['03200', 'the-path-to-carcosa/a-phantom-of-truth'],
  ['52040', 'the-path-to-carcosa/a-phantom-of-truth'],
  ['03240', 'the-path-to-carcosa/the-pallid-mask'],
  ['52048', 'the-path-to-carcosa/the-pallid-mask'],
  ['03274', 'the-path-to-carcosa/black-stars-rise'],
  ['52054', 'the-path-to-carcosa/black-stars-rise'],
  ['03316', 'the-path-to-carcosa/dim-carcosa'],
  ['52059', 'the-path-to-carcosa/dim-carcosa'],

  // The Drowned City
  ['11501', 'the-drowned-city/one-last-job'],
  ['11517', 'the-drowned-city/the-western-wall'],
  ['11536', 'the-drowned-city/the-drowned-quarter'],
  ['11553', 'the-drowned-city/the-apiary'],
  ['11587', 'the-drowned-city/the-grand-vault'],
  ['11612', 'the-drowned-city/court-of-the-ancients'],
  ['11639', 'the-drowned-city/obsidian-canyons'],
  ['11673', 'the-drowned-city/sepulchre-of-the-sleeper'],
  ['11682', 'the-drowned-city/the-doom-of-arkham-part-1'],
  ['11688a', 'the-drowned-city/the-doom-of-arkham-part-2'],
  ['11688b', 'the-drowned-city/the-doom-of-arkham-part-2'],

  // Dark Matter (Homebrew)
  [':dark-matter:014', 'dark-matter/the-tatterdemalion'],
  [':dark-matter:054', 'dark-matter/electric-nightmare'],
  [':dark-matter:089', 'dark-matter/lost-quantum'],
  [':dark-matter:112', 'dark-matter/in-the-shadow-of-earth'],
  [':dark-matter:153', 'dark-matter/strange-moons'],
  [':dark-matter:190', 'dark-matter/the-machine-in-yellow'],
  [':dark-matter:209', 'dark-matter/fragment-of-carcosa'],
  [':dark-matter:243', 'dark-matter/starfall'],
])

// Places to stand in front of the painted buildings, shared by the day and night plates.
const villageAnchors: Record<string, Point> = {
  '10705': [51, 88], // Boarding House
  '10706': [50, 59], // Crossroads
  '10707': [49, 26], // Chapel
  '10708': [21, 85], // Old Mill
  '10709': [16, 47], // Atwood House
  '10710': [83, 27], // General Store
  '10711': [84, 87], // Schoolhouse
  '10712': [81, 55], // Commons
  '10690': [50, 59], // Crossroads on the final day
  '10691': [21, 85], // Old Mill on the final day
  // The Midnight Masks (3x3 Arkham City grid)
  '01134': [18, 18], // Northside
  '01130': [50, 18], // Downtown (First Bank)
  '01131': [50, 18], // Downtown (Arkham Asylum)
  '01132': [82, 18], // Easttown
  '01129': [18, 50], // Miskatonic University
  '01125': [50, 50], // Rivertown
  '01133': [82, 50], // Graveyard
  '01128': [18, 82], // St. Mary's Hospital
  '01126': [50, 82], // Southside (Historical Society)
  '01127': [50, 82], // Southside (Ma's Boarding House)
  '01124': [82, 82], // Your House
  // Dark Matter — Scenario 1: The Tatterdemalion (ship cutaway rooms)
  ':dark-matter:025': [35, 28], // Escape Pod Bay
  ':dark-matter:026': [60, 28], // Infirmary
  ':dark-matter:041': [81, 31], // Ventilation Shaft
  ':dark-matter:022': [35, 50], // Cargo Hold
  ':dark-matter:027': [60, 50], // Mess Hall
  ':dark-matter:028': [83, 50], // Ship's Bridge
  ':dark-matter:024': [35, 72], // Engine Room
  ':dark-matter:023': [60, 72], // Cryosleep Quarters
  // Dark Matter — Scenario 3: Lost Quantum (Elbrus Station landmarks)
  ':dark-matter:098': [13, 24], // Ice Spires
  ':dark-matter:097': [36, 26], // Crystal Peak
  ':dark-matter:096': [62, 38], // Cold Wastes
  ':dark-matter:101': [87, 26], // Omni-Transmitters
  ':dark-matter:102': [15, 65], // Q-Crystal Mines
  ':dark-matter:103': [41, 61], // Schröd Generators
  ':dark-matter:099': [76, 63], // Landing Craft
  ':dark-matter:100': [36, 85], // Main Facility
  // Dark Matter — Scenario 4: In the Shadow of Earth (Nostalgia II cutaway rooms)
  ':dark-matter:122': [26, 36], // Airlocks
  ':dark-matter:126': [42, 36], // Hydroponics
  ':dark-matter:127': [60, 36], // Infirmary
  ':dark-matter:128': [45, 52], // Ship Mainframe
  ':dark-matter:125': [78, 52], // Flight Deck
  ':dark-matter:123': [49, 68], // Crew Quarters
  ':dark-matter:129': [66, 68], // Telecoms
  ':dark-matter:124': [28, 68], // Engine Room
  // Dark Matter — Scenario 5: Strange Moons (Mi-Go Saturn moon facility)
  ':dark-matter:166': [17, 46], // Dream Diagnostics
  ':dark-matter:169': [60, 38], // Reality Simulator
  ':dark-matter:170': [60, 38], // A Hiding Place (Simulation)
  ':dark-matter:171': [60, 38], // A Mutiny (Simulation)
  ':dark-matter:172': [60, 38], // Adrift in Space (Simulation)
  ':dark-matter:173': [60, 38], // An Accident (Simulation)
  ':dark-matter:174': [60, 38], // City of Cats (Simulation)
  ':dark-matter:175': [60, 38], // Fever Dream (Simulation)
  ':dark-matter:168': [87, 46], // Memory Scanner
  ':dark-matter:165': [38, 36], // Communicator
  ':dark-matter:164': [60, 66], // Brain Storage
  ':dark-matter:167': [50, 88], // Entrance Tunnel
  // Dark Matter — Scenario 7: Fragment of Carcosa (Asteroid & Carcosa ruins cutaway)
  ':dark-matter:217': [30, 22], // Surface of Fragment
  ':dark-matter:216': [67, 16], // Abandoned Lander
  ':dark-matter:220': [36, 40], // Hidden Passage / Palace Gates
  ':dark-matter:218': [50, 50], // Bottomless Pit / Spiral Staircase
  ':dark-matter:223': [22, 68], // Stalagmite Forest / Labyrinths of Tasylock
  ':dark-matter:219': [62, 65], // Cyclopean Caverns / Grand Ballroom
  ':dark-matter:221': [83, 72], // Ice Cavity / Gardens of Thothut
  ':dark-matter:222': [51, 88], // Impassable Ravine / The Yellow Throne
}

export function hemlockVillagePosition(code: string): Point | undefined {
  return villageAnchors[code.replace(/^c/, '').replace(/[ab]$/, '')]
}

const houseRows: Record<string, number> = {
  '03': 13, '02': 31, '01': 50, '00': 75, n01: 92,
}

export function hemlockHousePosition(label: string): Point | undefined {
  const cell = /^pos(n01|00|01)(n01|00|01|02|03)$/.exec(label)
  if (!cell) return undefined
  const [, column, row] = cell
  if ((row === '03' || row === 'n01') && column !== '00') return undefined
  return [column === 'n01' ? 18 : column === '01' ? 82 : 50, houseRows[row]]
}

export type HemlockOverview = {
  image: string
  fixedPassages: boolean
  village?: boolean
  house?: boolean
}

export function hemlockOverview(id: string, reference: string, layout?: readonly string[] | null): HemlockOverview | undefined {
  const scenario = id.replace(/^c/, '')
  if (scenario === '10501') {
    // The reference flips when the cave-in replaces the caves with rails.
    const fixedPassages = !reference.endsWith('b')
    const art = fixedPassages ? 'written-in-rock-descent' : 'written-in-rock-maze'
    return { image: `img/scenes/hemlock-vale/${art}.webp`, fixedPassages, village: true }
  }
  // Some branches of the finale leave the Abyss and rebuild the village board.
  const isNightVale = scenario === '10651' && layout?.some((row) => row.trim().split(/\s+/).includes('diamond'))
  const art = isNightVale ? 'hemlock-vale/vale-night' : boards.get(scenario)
  if (!art) return undefined
  return {
    image: `img/scenes/${art}.webp`,
    fixedPassages: false,
    village: true,
    house: art.endsWith('hemlock-house'),
  }
}
