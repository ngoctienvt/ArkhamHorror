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

/** Card code without the `c` prefix or a double-sided card's a/b suffix. */
function baseCode(cardCode: string): string {
  return cardCode.replace(/^c/, '').replace(/^(\d{5})[ab]$/, '$1')
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
/* Devil Reef: each revealed location has the sprite drawn after its card art. Return to's three Tidal Tunnels
 * share the original cards' art, so they share the sprites too. */
const DEVIL_REEF_FACES: Readonly<Record<string, string>> = {
  '07168': '07168', // Churning Waters
  '07169': '07169', '07170': '07170', '07171': '07171', '07172': '07172', '07173': '07173', // the five islands
  '07102': '07102', '07103': '07103', '07104': '07104', '07174': '07174', // Tidal Tunnels
  '07175': '07175', '07176': '07176', '07177': '07177', // Unfathomable Depths
  [`${RETURN_TO_INNSMOUTH}033`]: 'cave-mouth',
  [`${RETURN_TO_INNSMOUTH}032`]: 'shrine-to-hydra',
  [`${RETURN_TO_INNSMOUTH}065`]: '07102',
  [`${RETURN_TO_INNSMOUTH}066`]: '07103',
  [`${RETURN_TO_INNSMOUTH}067`]: '07104',
}
/* Face-down cards show their back: "Tidal Tunnel" and "Unfathomable Depths" each have their own; the islands
 * (and any stray card from another set) show the "Devil Reef" back. */
const TIDAL_TUNNELS = new Set(['07102', '07103', '07104', '07174', `${RETURN_TO_INNSMOUTH}065`, `${RETURN_TO_INNSMOUTH}066`, `${RETURN_TO_INNSMOUTH}067`])
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
  'img/scenes/the-dream-eaters/weaver': weaver,
  'img/scenes/the-dream-eaters/endless-stairs': stairs,
}

const setOf = (folder: string): IslandSet => ISLAND_SETS[folder] ?? cosmos

/** The sprite under a location on a board with this sprite folder. */
export function islandImage(folder: string, cardCode: string, revealed: boolean): string {
  return `${folder}/${setOf(folder).sprite(baseCode(cardCode), revealed)}.webp`
}

/** Width over height of that sprite: 3:2 scenes, or 1 for the square card backs. */
export function islandAspect(folder: string, cardCode: string, revealed: boolean): number {
  const set = setOf(folder)
  return set.square.has(set.sprite(baseCode(cardCode), revealed)) ? 1 : 3 / 2
}

/** The sprite of an open cell where a card can be placed. */
export function islandSpotImage(folder: string): string {
  return `${folder}/${setOf(folder).spot}.webp`
}

/** The water layer over a flooded location's sprite, or undefined when it is dry, open sea, or face down. */
export function islandWaterImage(folder: string, cardCode: string, revealed: boolean, flood: FloodLevel | null | undefined): string | undefined {
  const water = setOf(folder).water
  if (!water || !flood || flood === 'Unflooded') return undefined
  const code = baseCode(cardCode)
  if (water.dry.has(code) || islandAspect(folder, cardCode, revealed) === 1) return undefined
  return `${folder}/${water[flood]}.webp`
}

/** The sprite of a vehicle card sailing on this board, or undefined when the board draws none for it. */
export function vehicleSprite(folder: string, cardCode: string): string | undefined {
  const name = setOf(folder).vehicles?.[baseCode(cardCode)]
  return name ? `${folder}/${name}.webp` : undefined
}

/** Every file an island set refers to, so a test can check each one exists. */
export function islandSetFiles(folder: string): string[] {
  const set = setOf(folder)
  const names = new Set([...set.faces, ...set.square, set.spot, ...Object.values(set.water ?? {}).filter((v): v is string => typeof v === 'string'), ...Object.values(set.vehicles ?? {})])
  return [...names].map((name) => `${folder}/${name}.webp`)
}
