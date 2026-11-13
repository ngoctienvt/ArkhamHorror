/* Boards whose grid grows or reshuffles during play (Before the Black Throne's Cosmos, Devil Reef's islands)
 * cannot paint their places ahead of time: each location stands on a sprite of its own, drawn under its plate
 * in its grid cell. This module says which sprite, by the board's sprite folder and the location's card code.
 *
 * It has no runtime imports, so tests can load it on its own. */

export type FloodLevel = 'Unflooded' | 'PartiallyFlooded' | 'FullyFlooded'

export type RailDirection = 'North' | 'East' | 'South' | 'West'

type IslandSet = {
  faces: readonly string[]
  /** File name (without folder or extension) of the sprite under this location. */
  sprite: (code: string, revealed: boolean) => string
  /** Sprites drawn square; every other sprite is a 3:2 scene. */
  square: ReadonlySet<string>
  /** Sprite of an open cell a card can be placed in. */
  spot: string
  /** Water layers drawn over a flooded location's 3:2 sprite, and locations that already are open sea. */
  water?: { PartiallyFlooded: string; FullyFlooded: string; dry: ReadonlySet<string> }
  /** Sprites of vehicles that sail between the cells, by card code. */
  vehicles?: Readonly<Record<string, string>>
  /** Rail arm drawn over a revealed location for each track it carries, and where each card's tracks run. */
  rails?: { arm: string; directions: Readonly<Record<string, readonly RailDirection[]>> }
}

/** Card code without the `c` prefix or a double-sided card's a/b/c suffix. */
function baseCode(cardCode: string): string {
  return cardCode.replace(/^c/, '').replace(/^(\d{5})[abc]$/, '$1')
}

/** `<folder>/<name>.webp`; a name may climb into a sibling folder (`../devil-reef/07102`) to share its sprite. */
function spriteFile(folder: string, name: string): string {
  const parts = folder.split('/')
  const names = name.split('/')
  while (names[0] === '..') { names.shift(); parts.pop() }
  return `${[...parts, ...names].join('/')}.webp`
}

const COSMOS_CODES = new Set([
  '05332', '05333', '05334', '05335', '05336', '05337', '05338', '05339', '05340', '54058', '54059', '54060',
])

const cosmos: IslandSet = {
  faces: [...COSMOS_CODES],
  // A face-down card stands on the plain round rock.
  sprite: (code, revealed) => (revealed && COSMOS_CODES.has(code) ? code : 'cosmos'),
  square: new Set(['cosmos']),
  spot: 'cosmos',
}

const RETURN_TO_INNSMOUTH = ':return-to-the-innsmouth-conspiracy:'
/* The three flooded caverns shared by every Innsmouth board that shuffles Tidal Tunnels in (Devil Reef, the Pit of
 * Despair, Into the Maelstrom, A Light in the Fog). Return to's copies share the original cards' art. */
const FLOODED_CAVERNS: Readonly<Record<string, string>> = {
  '07102': '07102', '07103': '07103', '07104': '07104',
  [`${RETURN_TO_INNSMOUTH}065`]: '07102',
  [`${RETURN_TO_INNSMOUTH}066`]: '07103',
  [`${RETURN_TO_INNSMOUTH}067`]: '07104',
}
const DEVIL_REEF_FOLDER = '../devil-reef'
/** Those sprites as another board's folder reaches them, without copying a file. */
const sharedCaverns = (): Record<string, string> =>
  Object.fromEntries(Object.entries(FLOODED_CAVERNS).map(([code, name]) => [code, `${DEVIL_REEF_FOLDER}/${name}`]))
const SHARED_TUNNEL_BACK = `${DEVIL_REEF_FOLDER}/tunnel-back`
const SHARED_WATER = {
  PartiallyFlooded: `${DEVIL_REEF_FOLDER}/water-partial`,
  FullyFlooded: `${DEVIL_REEF_FOLDER}/water-full`,
}
/* Devil Reef: each revealed location has the sprite drawn after its card art. Return to's three Tidal Tunnels
 * share the original cards' art, so they share the sprites too. */
const DEVIL_REEF_FACES: Readonly<Record<string, string>> = {
  '07168': '07168', // Churning Waters
  '07169': '07169', '07170': '07170', '07171': '07171', '07172': '07172', '07173': '07173', // the five islands
  ...FLOODED_CAVERNS, '07174': '07174', // Tidal Tunnels
  '07175': '07175', '07176': '07176', '07177': '07177', // Unfathomable Depths
  [`${RETURN_TO_INNSMOUTH}033`]: 'cave-mouth',
  [`${RETURN_TO_INNSMOUTH}032`]: 'shrine-to-hydra',
}
/* Face-down cards show their back: "Tidal Tunnel" and "Unfathomable Depths" each have their own; the islands
 * (and any stray card from another set) show the "Devil Reef" back. */
const TIDAL_TUNNELS = new Set([...Object.keys(FLOODED_CAVERNS), '07174'])
const UNFATHOMABLE_DEPTHS = new Set(['07175', '07176', '07177'])
// Always face up: the sea the scenario starts in, and Return to's shrine placed straight from the encounter set.
const ALWAYS_FACE_UP = new Set(['07168', `${RETURN_TO_INNSMOUTH}032`])

const devilReef: IslandSet = {
  faces: Object.values(DEVIL_REEF_FACES),
  sprite: (code, revealed) => {
    const face = DEVIL_REEF_FACES[code]
    if (face && (revealed || ALWAYS_FACE_UP.has(code))) return face
    if (TIDAL_TUNNELS.has(code)) return 'tunnel-back'
    if (UNFATHOMABLE_DEPTHS.has(code)) return 'depths-back'
    return 'reef-back'
  },
  square: new Set(['reef-back', 'tunnel-back', 'depths-back']),
  spot: 'reef-back',
  water: { PartiallyFlooded: 'water-partial', FullyFlooded: 'water-full', dry: new Set(['07168']) },
  vehicles: { '07178': 'fishing-vessel', [`${RETURN_TO_INNSMOUTH}034`]: 'fishing-vessel' },
}

/** A board whose locations are each drawn after their card, with one back per kind of face-down card. */
function spriteSet(
  faces: Readonly<Record<string, string>>,
  backs: ReadonlyArray<readonly [readonly string[], string]>,
  fallbackBack: string,
  alwaysFaceUp: readonly string[] = [],
): Pick<IslandSet, 'faces' | 'sprite'> {
  const up = new Set(alwaysFaceUp)
  const kinds = backs.map(([codes, back]) => [new Set(codes), back] as const)
  return {
    faces: [...new Set(Object.values(faces))],
    sprite: (code, revealed) => {
      const face = faces[code]
      if (face && (revealed || up.has(code))) return face
      return kinds.find(([codes]) => codes.has(code))?.[1] ?? fallbackBack
    },
  }
}
const range = (from: number, to: number): string[] =>
  Array.from({ length: to - from + 1 }, (_, i) => String(from + i).padStart(5, '0'))
const own = (codes: readonly string[]): Record<string, string> => Object.fromEntries(codes.map((c) => [c, c]))
const sharedWater = (dry: readonly string[] = []) => ({ ...SHARED_WATER, dry: new Set(dry) })

/* The Pit of Despair: the cave the investigators wake in is face up; every other card is a Tidal Tunnel until
 * flipped (the five set-aside caves included). */
const pit: IslandSet = {
  ...spriteSet({ ...own(range(7047, 7052)), ...sharedCaverns() }, [], SHARED_TUNNEL_BACK, ['07047']),
  square: new Set([SHARED_TUNNEL_BACK]),
  spot: SHARED_TUNNEL_BACK,
  water: sharedWater(),
}

/* Into the Maelstrom: Y'ha-nthlei and its sanctums have their own backs; the Gateway and the two Lairs are
 * always face up. */
const YHANTHLEI_BACK = 'yhanthlei-back'
const SANCTUM_BACK = 'sanctum-back'
const maelstrom: IslandSet = {
  ...spriteSet({ ...own(range(7319, 7329)), ...sharedCaverns() }, [
    [range(7321, 7323), YHANTHLEI_BACK],
    [range(7324, 7327), SANCTUM_BACK],
  ], SHARED_TUNNEL_BACK, ['07320', '07328', '07329']),
  square: new Set([SHARED_TUNNEL_BACK, YHANTHLEI_BACK, SANCTUM_BACK]),
  spot: SHARED_TUNNEL_BACK,
  water: sharedWater(),
}

/* A Light in the Fog: the lighthouse and the grotto stairs are face up from the start; the Lighthouse Basement is
 * the back of the first Sunken Grotto; Holding Cells (the back of Captured!) always shows its own face. */
const fogBase = spriteSet({ ...own(range(7239, 7251)), '07252': '07252b', ...sharedCaverns() }, [], SHARED_TUNNEL_BACK,
  [...range(7239, 7243), '07245', '07246', '07252'])
const fog: IslandSet = {
  faces: [...fogBase.faces, '07244b'],
  sprite: (code, revealed) => (code === '07244' && !revealed ? '07244b' : fogBase.sprite(code, revealed)),
  square: new Set([SHARED_TUNNEL_BACK]),
  spot: SHARED_TUNNEL_BACK,
  // Holding Cells cannot be flooded.
  water: sharedWater(['07252']),
}

/* Horror in High Gear: a road tile faces up as soon as it is drawn, otherwise it shows the Old Innsmouth Road
 * back (3:2 like the faces, so the road reads as one strip). The two cars are vehicles on the road. */
const highGear: IslandSet = {
  ...spriteSet({
    ...own(range(7203, 7210)),
    [`${RETURN_TO_INNSMOUTH}036`]: 'mud-tracks',
    [`${RETURN_TO_INNSMOUTH}037`]: 'straight-section',
  }, [], 'road-back'),
  square: new Set(),
  spot: 'road-back',
  vehicles: { '07211': '07211', '07212': '07212' },
}

/* The Pallid Mask: every Catacombs shares one face-down back; the start location is revealed when placed.
 * Return to's four extra Catacombs (52049-52052) have their own sprites. */
const pallidMask: IslandSet = {
  ...spriteSet(own([...range(3247, 3257), ...range(52049, 52052)]), [], 'back'),
  square: new Set(), // the back is a flat 3:2 slab trimmed to its edges, so links reach it
  spot: 'back',
}

/* Obsidian Canyons: every unrevealed Summit shares one back, Open Sky is a faint tile that is never flipped,
 * and the two Athenaeums share one painting. R'lyeh Streets and Glyph Orrery are single-sided. */
const obsidianCanyons: IslandSet = {
  ...spriteSet(
    { ...own([...range(11648, 11653), ...range(11655, 11662)]), '11654': '11653', xsky: 'open-sky' },
    [],
    'summit-back',
    ['11648', '11662', 'xsky'],
  ),
  square: new Set(['summit-back']),
  spot: 'summit-back',
}

/* Written in Rock: caves (Act 1) show the Cavern back, rail tiles (after the cave-in) the Rail Tunnel back; Control
 * Station and Rail Exit are single-sided. The mine cart is a vehicle on the rails. Both backs are flat 3:2 slabs. */
const writtenInRockBase = spriteSet(own([...range(10508, 10516), ...range(10716, 10720)]), [[range(10510, 10516), 'rail-back']], 'cavern-back', ['10508', '10509'])
/* The tracks printed on each rail card (the backend's `railIcons`); A and B printings differ, so the code keeps its
 * suffix. North is up the grid, as the server's `GridUp`. */
const ROCK_RAILS: Readonly<Record<string, readonly RailDirection[]>> = {
  '10508': ['North', 'East'], '10509': ['South'],
  '10510a': ['North', 'West'], '10510b': ['North', 'West'],
  '10511a': ['East', 'South'], '10511b': ['East', 'South'],
  '10512a': ['East', 'West'], '10512b': ['North', 'South'],
  '10513a': ['East', 'West'], '10513b': ['North', 'East', 'South'],
  '10514a': ['East', 'South', 'West'], '10514b': ['North', 'East', 'South'],
  '10515': ['North', 'East', 'South', 'West'], '10516': ['North', 'South'],
}
const writtenInRock: IslandSet = {
  ...writtenInRockBase,
  rails: { arm: 'rail-arm', directions: ROCK_RAILS },
  faces: [...writtenInRockBase.faces, 'rail-back'], // listed so every file is checked and preloaded
  square: new Set(),
  spot: 'cavern-back',
  vehicles: { '10507': 'mine-cart' },
}

/* The Silent Heath: the three start locations and the three lairs are always face up; caves are placed face down. */
const silentHeath: IslandSet = {
  ...spriteSet(own([...range(10555, 10560), ...range(10716, 10720)]), [], 'cavern-back', range(10555, 10560)),
  square: new Set(),
  spot: 'cavern-back',
}

/* The City of Remnants (Without a Trace, Congress of the Keys): the four Otherworld cards share one face-down back;
 * A/B/C printings share a painting (baseCode drops the suffix). */
const REMNANTS = own(range(9747, 9750))
const withoutATrace: IslandSet = {
  ...spriteSet({ ...own(['09688', '09689']), ...REMNANTS }, [], 'remnants-back', ['09688']),
  square: new Set(),
  spot: 'remnants-back',
}

/* Congress of the Keys: Lair and Sanctum printings share a painting; the Coterie Sanctuaries are placed face down
 * with their own back, the Remnants with the shared one. The Scarlet Halls and the Knotted Tower are always up. */
const congressBase = spriteSet(
    {
      ...own(['09704', '09706', '09708', '09710', '09712', '09713', '09714']),
      '09705': '09704', '09707': '09706', '09709': '09708', '09711': '09710',
      ...REMNANTS,
    },
    [[range(9706, 9711), 'sanctuary-back']],
    'remnants-back',
    ['09704', '09705', '09712'],
  )
const congressOfTheKeys: IslandSet = {
  ...congressBase,
  faces: [...congressBase.faces, 'sanctuary-back'], // listed so every file is checked and preloaded
  square: new Set(),
  spot: 'remnants-back',
}

/* The Lost Sister: every unrevealed cave shares one back; Akwan is single-sided. */
const lostSister: IslandSet = {
  ...spriteSet(own([...range(10575, 10582), ...range(10716, 10720)]), [], 'back', ['10575']),
  square: new Set(['back']),
  spot: 'back',
}

/* The Twisted Hollow: every unrevealed Western Woods shares one back (revealed empty Dark woods flip back). */
const twistedHollow: IslandSet = {
  ...spriteSet(own(range(10612, 10621)), [], 'back'),
  square: new Set(['back']),
  spot: 'back',
}

const weaverFaces = ['06340', '06341', '06342', '06343', '06344', '06345']
const stairsFaces = ['06183', '06184', '06185', '06186', '06187', '06188']
const weaver: IslandSet = {
  faces: weaverFaces,
  sprite: (code, revealed) => revealed && weaverFaces.includes(code) ? code : 'back',
  square: new Set(['back']),
  spot: 'back',
}
const stairs: IslandSet = {
  faces: stairsFaces,
  sprite: (code, revealed) => revealed && stairsFaces.includes(code) ? code : 'back',
  square: new Set(),
  spot: 'back',
}

const ISLAND_SETS: Readonly<Record<string, IslandSet>> = {
  'img/scenes/the-circle-undone/cosmos': cosmos,
  'img/scenes/the-innsmouth-conspiracy/devil-reef': devilReef,
  'img/scenes/the-innsmouth-conspiracy/pit': pit,
  'img/scenes/the-innsmouth-conspiracy/maelstrom': maelstrom,
  'img/scenes/the-innsmouth-conspiracy/fog': fog,
  'img/scenes/the-innsmouth-conspiracy/high-gear': highGear,
  'img/scenes/the-path-to-carcosa/pallid-mask': pallidMask,
  'img/scenes/the-drowned-city/obsidian-canyons': obsidianCanyons,
  'img/scenes/hemlock-vale/lost-sister': lostSister,
  'img/scenes/hemlock-vale/written-in-rock': writtenInRock,
  'img/scenes/hemlock-vale/silent-heath': silentHeath,
  'img/scenes/the-scarlet-keys/without-a-trace': withoutATrace,
  'img/scenes/the-scarlet-keys/congress-of-the-keys': congressOfTheKeys,
  'img/scenes/hemlock-vale/twisted-hollow': twistedHollow,
  'img/scenes/the-dream-eaters/weaver': weaver,
  'img/scenes/the-dream-eaters/endless-stairs': stairs,
}

const setOf = (folder: string): IslandSet => ISLAND_SETS[folder] ?? cosmos

/** The sprite under a location on a board with this sprite folder. */
export function islandImage(folder: string, cardCode: string, revealed: boolean): string {
  return spriteFile(folder, setOf(folder).sprite(baseCode(cardCode), revealed))
}

/** Width over height of that sprite: 3:2 scenes, or 1 for the square card backs. */
export function islandAspect(folder: string, cardCode: string, revealed: boolean): number {
  const set = setOf(folder)
  return set.square.has(set.sprite(baseCode(cardCode), revealed)) ? 1 : 3 / 2
}

/** The sprite of an open cell where a card can be placed. */
export function islandSpotImage(folder: string): string {
  return spriteFile(folder, setOf(folder).spot)
}

/** The water layer over a flooded location's sprite, or undefined when it is dry, open sea, or face down. */
export function islandWaterImage(folder: string, cardCode: string, revealed: boolean, flood: FloodLevel | null | undefined): string | undefined {
  const water = setOf(folder).water
  if (!water || !flood || flood === 'Unflooded') return undefined
  const code = baseCode(cardCode)
  if (water.dry.has(code) || islandAspect(folder, cardCode, revealed) === 1) return undefined
  return spriteFile(folder, water[flood])
}

/** The sprite of a vehicle card sailing on this board, or undefined when the board draws none for it. */
export function vehicleSprite(folder: string, cardCode: string): string | undefined {
  const name = setOf(folder).vehicles?.[baseCode(cardCode)]
  return name ? spriteFile(folder, name) : undefined
}

/** The tracks to draw over this location's sprite (rotated rail arms), or none when it has no rails or is face down. */
export function islandRails(folder: string, cardCode: string, revealed: boolean): { src: string; turns: number[] } | undefined {
  const rails = ISLAND_SETS[folder]?.rails
  const code = cardCode.replace(/^c/, '')
  const directions = rails?.directions[code] ?? rails?.directions[baseCode(code)]
  if (!rails || !directions || !(revealed || code === '10508' || code === '10509')) return undefined
  return { src: spriteFile(folder, rails.arm), turns: directions.map((d) => ({ North: 0, East: 90, South: 180, West: 270 })[d]) }
}

/** Whether this location has a sprite of its own on this board (not just a card back or a stray rock). */
export function hasOwnIsland(folder: string, cardCode: string): boolean {
  const set = ISLAND_SETS[folder]
  return !!set && set.faces.includes(set.sprite(baseCode(cardCode), true))
}

/** Every file an island set refers to, so a test can check each one exists. */
export function islandSetFiles(folder: string): string[] {
  const set = setOf(folder)
  const names = new Set([...set.faces, ...set.square, set.spot, ...Object.values(set.water ?? {}).filter((v): v is string => typeof v === 'string'), ...Object.values(set.vehicles ?? {}), ...(set.rails ? [set.rails.arm] : [])])
  return [...names].map((name) => spriteFile(folder, name))
}
