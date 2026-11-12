/* The storm over a sea board (Devil Reef): where rain drops fall and when lightning strikes. Pure numbers, no
 * drawing and no runtime imports, so tests can load it on its own. `rand` is injected (Math.random in play). */

export type Rand = () => number

/** Two depths of rain: far drops are short, thin, slow and faint; near ones long, faster and brighter. */
export type RainLayer = 'far' | 'near'

export type RainDrop = {
  layer: RainLayer
  /** Top of the streak, in stage pixels. */
  x: number
  y: number
  /** Streak length in pixels. */
  length: number
  /** Fall speed in pixels per second. */
  speed: number
}

/** Rain blows a little to the right: horizontal travel per pixel of fall. */
export const RAIN_SLANT = 0.22

const LAYERS: Record<RainLayer, { perPixel: number; length: [number, number]; speed: [number, number] }> = {
  // Sparse on purpose: enough to read as a storm, not so much that it pulls the eye away from the board.
  far: { perPixel: 1 / 18000, length: [7, 12], speed: [420, 560] },
  near: { perPixel: 1 / 42000, length: [14, 22], speed: [760, 980] },
}
/** Never more drops than this per layer, so a huge screen costs no more than a large one. */
export const MAX_PER_LAYER = 150

const between = (rand: Rand, [low, high]: [number, number]) => low + rand() * (high - low)

/** How many drops of a layer a stage of this size holds. */
export function rainDropCount(layer: RainLayer, width: number, height: number): number {
  if (width <= 0 || height <= 0) return 0
  return Math.min(MAX_PER_LAYER, Math.round(width * height * LAYERS[layer].perPixel))
}

/** A new drop anywhere on the stage (`anywhere`) or just above its top edge (a drop that fell off and comes back). */
export function makeDrop(layer: RainLayer, width: number, height: number, rand: Rand, anywhere = true): RainDrop {
  const { length, speed } = LAYERS[layer]
  const dropLength = between(rand, length)
  // Drops drift right as they fall, so new ones also start a little left of the stage to cover its left edge.
  const x = rand() * (width + height * RAIN_SLANT) - height * RAIN_SLANT
  const y = anywhere ? rand() * height : -dropLength - rand() * height * 0.1
  return { layer, x, y, length: dropLength, speed: between(rand, speed) }
}

/** The whole rain for a stage: far drops first, so near ones are drawn over them. */
export function makeRain(width: number, height: number, rand: Rand): RainDrop[] {
  return (['far', 'near'] as const).flatMap((layer) =>
    Array.from({ length: rainDropCount(layer, width, height) }, () => makeDrop(layer, width, height, rand)))
}

/** Where a drop is `seconds` later; once it has left the stage it starts again above the top. */
export function advanceDrop(drop: RainDrop, seconds: number, width: number, height: number, rand: Rand): RainDrop {
  const fall = drop.speed * seconds
  const next = { ...drop, x: drop.x + fall * RAIN_SLANT, y: drop.y + fall }
  return next.y > height || next.x > width + drop.length ? makeDrop(drop.layer, width, height, rand, false) : next
}

/** Milliseconds until the next lightning: rare, so it stays a surprise and never becomes a flicker. */
export function nextLightningDelay(rand: Rand): number {
  return Math.round(18000 + rand() * 32000)
}
