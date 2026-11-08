import { computed, ref } from 'vue'
import {
  IDENTITY, clampViewport, isIdentity, panBy, pinchStep, viewportTransform, zoomAt,
  type Point, type Size, type Viewport,
} from '@/arkham/mapViewport'

/* Pinch-zoom and pan for the map stage, on a touch screen. One finger on empty map pans once the map is
 * zoomed (when it is not, the page scrolls as usual); two fingers zoom and pan; a double tap on empty
 * map goes back to the whole picture. Plates, figures and buttons keep their own taps and drags.
 * Plain Pointer Events, no library. The maths lives in mapViewport.ts. */

const ZOOM_STEP = 1.4
const WHEEL_SENSITIVITY = 0.0015 // zoom per wheel pixel; one 100px notch is about 16%
const DOUBLE_TAP_MS = 300
const DOUBLE_TAP_SLOP = 30
const TAP_SLOP = 10
// Things that take a tap or a drag of their own: a single finger starting on one does not pan the map.
const INTERACTIVE = '.node, .room-plate, .connection-arrow, .spot, .fig, button, a, input'

export function useMapViewport() {
  const view = ref<Viewport>({ ...IDENTITY })
  const zoomed = computed(() => !isIdentity(view.value))
  const transform = computed(() => viewportTransform(view.value))
  const canZoomIn = computed(() => view.value.scale < 3)

  let stage: HTMLElement | null = null
  const sizeOf = (): Size => {
    // The stage is laid out at its unzoomed size; offsetWidth ignores the transform.
    return { width: stage?.offsetWidth ?? 0, height: stage?.offsetHeight ?? 0 }
  }
  /** Screen position of the stage's unzoomed top-left corner. */
  const originOf = (): Point => {
    const rect = stage?.getBoundingClientRect()
    return rect ? { x: rect.left - view.value.tx, y: rect.top - view.value.ty } : { x: 0, y: 0 }
  }
  const local = (clientX: number, clientY: number): Point => {
    const origin = originOf()
    return { x: clientX - origin.x, y: clientY - origin.y }
  }

  const reset = () => { view.value = { ...IDENTITY } }
  /** After the frame changed size (rotation, resize) the old offsets may leave an empty border. */
  const refit = () => { view.value = clampViewport(view.value, sizeOf()) }
  const zoomBy = (factor: number) => {
    const size = sizeOf()
    view.value = zoomAt(view.value, factor, { x: size.width / 2, y: size.height / 2 }, size)
  }
  const zoomIn = () => zoomBy(ZOOM_STEP)
  const zoomOut = () => zoomBy(1 / ZOOM_STEP)

  /**
   * Listen for gestures on `container`, moving `stageEl`. `enabled` is asked on every gesture (the house
   * cutaway never zooms); `arranging` says plates are being dragged, so one finger never pans then.
   * Returns the function that stops listening.
   */
  function bind(container: HTMLElement, stageEl: HTMLElement, options: { enabled: () => boolean; arranging: () => boolean }) {
    stage = stageEl
    const fingers = new Map<number, Point>()
    let panFrom: Point | null = null
    let tap: { time: number; x: number; y: number } | null = null
    let lastTap: { time: number; x: number; y: number } | null = null

    const pair = (): [Point, Point] | null => {
      const [a, b] = [...fingers.values()]
      return a && b ? [local(a.x, a.y), local(b.x, b.y)] : null
    }

    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'touch' || !options.enabled()) return
      fingers.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (fingers.size === 1) {
        const onThing = (e.target as Element | null)?.closest?.(INTERACTIVE)
        panFrom = !onThing && zoomed.value && !options.arranging() ? { x: e.clientX, y: e.clientY } : null
        tap = onThing ? null : { time: e.timeStamp, x: e.clientX, y: e.clientY }
      } else {
        panFrom = null
        tap = null
      }
    }

    const move = (e: PointerEvent) => {
      const known = fingers.get(e.pointerId)
      if (!known) return
      const before = fingers.size === 2 ? pair() : null
      fingers.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (tap && Math.hypot(e.clientX - tap.x, e.clientY - tap.y) > TAP_SLOP) tap = null
      if (before) {
        const after = pair()
        if (after) view.value = pinchStep(before, after, view.value, sizeOf())
      } else if (panFrom && fingers.size === 1) {
        view.value = panBy(view.value, e.clientX - panFrom.x, e.clientY - panFrom.y, sizeOf())
        panFrom = { x: e.clientX, y: e.clientY }
      }
    }

    const up = (e: PointerEvent) => {
      if (!fingers.delete(e.pointerId)) return
      panFrom = null // a finger lifted from a pinch must not make the remaining one jump
      if (fingers.size > 0 || !tap) { tap = null; return }
      // A double tap on empty map goes back to the whole picture.
      if (lastTap && e.timeStamp - lastTap.time < DOUBLE_TAP_MS && Math.hypot(tap.x - lastTap.x, tap.y - lastTap.y) < DOUBLE_TAP_SLOP) {
        reset()
        lastTap = null
      } else {
        lastTap = tap
      }
      tap = null
    }

    const cancel = (e: PointerEvent) => { fingers.delete(e.pointerId); panFrom = null; tap = null }

    // Mouse wheel (and trackpad pinch, which arrives as ctrl+wheel) zooms towards the cursor.
    const wheel = (e: WheelEvent) => {
      if (!options.enabled() || e.deltaY === 0) return
      // Fully zoomed out, scrolling down keeps scrolling the page as usual.
      if (!zoomed.value && e.deltaY > 0) return
      e.preventDefault()
      // deltaMode 1 = lines, 2 = pages; normalise to pixels before turning it into a factor.
      const pixels = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1)
      const factor = Math.exp(-Math.max(-120, Math.min(120, pixels)) * WHEEL_SENSITIVITY)
      view.value = zoomAt(view.value, factor, local(e.clientX, e.clientY), sizeOf())
    }

    // Mouse: drag empty map with the left button to pan once zoomed. Listens on window while dragging so
    // leaving the map does not drop the drag, and without pointer capture so clicks keep their targets.
    let mouseFrom: Point | null = null
    const mouseDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0 || !options.enabled() || !zoomed.value || options.arranging()) return
      if ((e.target as Element | null)?.closest?.(INTERACTIVE)) return
      mouseFrom = { x: e.clientX, y: e.clientY }
      e.preventDefault() // no text/image selection while dragging
      window.addEventListener('pointermove', mouseMove)
      window.addEventListener('pointerup', mouseEnd)
      window.addEventListener('pointercancel', mouseEnd)
    }
    const mouseMove = (e: PointerEvent) => {
      if (!mouseFrom) return
      view.value = panBy(view.value, e.clientX - mouseFrom.x, e.clientY - mouseFrom.y, sizeOf())
      mouseFrom = { x: e.clientX, y: e.clientY }
    }
    const mouseEnd = () => {
      mouseFrom = null
      window.removeEventListener('pointermove', mouseMove)
      window.removeEventListener('pointerup', mouseEnd)
      window.removeEventListener('pointercancel', mouseEnd)
    }

    // Non-passive so preventDefault can stop the page scrolling while the map zooms.
    container.addEventListener('wheel', wheel, { passive: false })
    // Captured, so a figure that stops the event for its own drag still counts as a finger on the map.
    container.addEventListener('pointerdown', down, true)
    container.addEventListener('pointerdown', mouseDown)
    container.addEventListener('pointermove', move)
    container.addEventListener('pointerup', up)
    container.addEventListener('pointercancel', cancel)
    return () => {
      container.removeEventListener('wheel', wheel)
      container.removeEventListener('pointerdown', mouseDown)
      mouseEnd()
      container.removeEventListener('pointerdown', down, true)
      container.removeEventListener('pointermove', move)
      container.removeEventListener('pointerup', up)
      container.removeEventListener('pointercancel', cancel)
      if (stage === stageEl) stage = null
    }
  }

  return { view, zoomed, transform, canZoomIn, bind, reset, refit, zoomIn, zoomOut }
}

export type MapViewport = ReturnType<typeof useMapViewport>
