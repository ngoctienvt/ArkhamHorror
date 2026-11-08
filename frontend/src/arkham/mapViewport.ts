/* The maths of zooming and panning the map stage. Import-free on purpose so the tests can load it
 * without the Vue toolchain; composables/useMapViewport.ts is the reactive, event-driven wrapper.
 *
 * The stage is drawn with `transform: translate(tx px, ty px) scale(scale)` from its top-left corner,
 * so a point at `local` (in unzoomed stage pixels) lands at `t + scale * local` on screen. All points
 * below are measured from the stage's unzoomed top-left corner. */

export type Viewport = { scale: number; tx: number; ty: number }
export type Size = { width: number; height: number }
export type Point = { x: number; y: number }

/** Master switch for zooming and panning the map (wheel, drag, pinch, buttons). Off for now; set true to bring it back. */
export const MAP_ZOOM_ENABLED = false

export const MIN_SCALE = 1
export const MAX_SCALE = 3
export const IDENTITY: Viewport = { scale: 1, tx: 0, ty: 0 }

export const isIdentity = (v: Viewport) => v.scale === 1 && v.tx === 0 && v.ty === 0

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))

/** Keep the scale in range and the picture covering the whole frame (no empty border shows). */
export function clampViewport(v: Viewport, size: Size): Viewport {
  const scale = clamp(v.scale, MIN_SCALE, MAX_SCALE)
  return {
    scale,
    tx: clamp(v.tx, size.width * (1 - scale), 0),
    ty: clamp(v.ty, size.height * (1 - scale), 0),
  }
}

/** Zoom by `factor`, keeping the point under `pivot` where it is. */
export function zoomAt(v: Viewport, factor: number, pivot: Point, size: Size): Viewport {
  const scale = clamp(v.scale * factor, MIN_SCALE, MAX_SCALE)
  const ratio = scale / v.scale
  return clampViewport({
    scale,
    tx: pivot.x - (pivot.x - v.tx) * ratio,
    ty: pivot.y - (pivot.y - v.ty) * ratio,
  }, size)
}

export const panBy = (v: Viewport, dx: number, dy: number, size: Size): Viewport =>
  clampViewport({ ...v, tx: v.tx + dx, ty: v.ty + dy }, size)

const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y)
const midpoint = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 })

/** One step of a two-finger gesture: the fingers' spread zooms, the movement of their midpoint pans. */
export function pinchStep(prev: [Point, Point], next: [Point, Point], v: Viewport, size: Size): Viewport {
  const before = distance(prev[0], prev[1])
  const factor = before > 0 ? distance(next[0], next[1]) / before : 1
  const from = midpoint(prev[0], prev[1])
  const to = midpoint(next[0], next[1])
  const zoomed = zoomAt(v, factor, from, size)
  return panBy(zoomed, to.x - from.x, to.y - from.y, size)
}

/** The CSS transform for a viewport, or undefined at rest so the stage keeps its normal stacking. */
export const viewportTransform = (v: Viewport): string | undefined =>
  isIdentity(v) ? undefined : `translate(${v.tx}px, ${v.ty}px) scale(${v.scale})`
