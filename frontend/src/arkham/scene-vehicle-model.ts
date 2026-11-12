/* Vehicles drawn on a scene map (Devil Reef's Fishing Vessel): which cell each one is in and who rides it.
 * Pure data, read from the game state the server sends; no rules are decided here. No runtime imports, so
 * tests can load it on its own. */

type Placement = { tag: string; contents?: unknown }
type AssetLike = { id: string; cardCode: string; placement: Placement }
type InvestigatorLike = { id: string; placement: Placement }
export type VehicleGameLike = {
  assets: Readonly<Record<string, AssetLike>>
  investigators: Readonly<Record<string, InvestigatorLike>>
}

export type SceneVehicle = {
  id: string
  cardCode: string
  /** Location the vehicle is at. */
  locationId: string
  /** Sprite drawn for it. */
  image: string
  /** Investigators inside it, in the game's order. */
  passengers: string[]
}

/** Every vehicle at a location that has a sprite on this board (`spriteOf` returns undefined for the rest). */
export function sceneVehicles(game: VehicleGameLike, spriteOf: (cardCode: string) => string | undefined): SceneVehicle[] {
  const vehicles: SceneVehicle[] = []
  for (const asset of Object.values(game.assets)) {
    const image = spriteOf(asset.cardCode)
    if (!image || asset.placement.tag !== 'AtLocation' || typeof asset.placement.contents !== 'string') continue
    vehicles.push({ id: asset.id, cardCode: asset.cardCode, locationId: asset.placement.contents, image, passengers: passengersOf(game, asset.id) })
  }
  return vehicles
}

/** Investigators whose placement is inside this vehicle. */
export function passengersOf(game: VehicleGameLike, vehicleId: string): string[] {
  return Object.values(game.investigators)
    .filter((i) => i.placement.tag === 'InVehicle' && i.placement.contents === vehicleId)
    .map((i) => i.id)
}

/** Everyone riding any of these vehicles, so they are drawn on the deck rather than on the ground too. */
export function riders(vehicles: readonly SceneVehicle[]): Set<string> {
  return new Set(vehicles.flatMap((v) => v.passengers))
}

/** Which way the sprite (drawn bow to the right) faces after moving from `fromX` to `toX`; it keeps its
 * heading when the move is straight up or down. */
export function headingAfterMove(fromX: number, toX: number, previous: 'left' | 'right'): 'left' | 'right' {
  if (toX < fromX) return 'left'
  if (toX > fromX) return 'right'
  return previous
}
