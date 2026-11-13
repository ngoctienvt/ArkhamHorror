/* Boards whose grid grows or reshuffles during play (Before the Black Throne's Cosmos, Devil Reef's islands)
 * cannot paint their places ahead of time: each location stands on a sprite of its own, drawn under its plate
 * in its grid cell. This module says which sprite, by the board's sprite folder and the location's card code.
 *
 * It has no runtime imports, so tests can load it on its own. */

export type FloodLevel = 'Unflooded' | 'PartiallyFlooded' | 'FullyFlooded'

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

/** Whether this location has a sprite of its own on this board (not just a card back or a stray rock). */
export function hasOwnIsland(folder: string, cardCode: string): boolean {
  const set = ISLAND_SETS[folder]
  return !!set && set.faces.includes(set.sprite(baseCode(cardCode), true))
}

/** Every file an island set refers to, so a test can check each one exists. */
export function islandSetFiles(folder: string): string[] {
  const set = setOf(folder)
  const names = new Set([...set.faces, ...set.square, set.spot, ...Object.values(set.water ?? {}).filter((v): v is string => typeof v === 'string'), ...Object.values(set.vehicles ?? {})])
  return [...names].map((name) => spriteFile(folder, name))
}
