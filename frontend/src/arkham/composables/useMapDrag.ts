import { ref } from 'vue'
import { useStorage } from '@vueuse/core'

/* Player-chosen display offsets for location plates and figures on the map. They only change where
 * things are drawn: the game still knows each figure's real location, and links/arrows are computed
 * from the drawn positions so they follow. Location offsets are percent of the map stage; figure
 * offsets are pixels in the figure's own (unscaled) coordinates. Kept per game in local storage. */
type Offset = [number, number]

const offsets = useStorage<Record<string, Offset>>('arkham-map-offsets', {})

export const offsetOf = (key: string): Offset => offsets.value[key] ?? [0, 0]

export const hasMapOffsets = (gameId: string) => Object.keys(offsets.value).some((k) => k.startsWith(gameId + ':'))

export function resetMapOffsets(gameId: string) {
  offsets.value = Object.fromEntries(Object.entries(offsets.value).filter(([k]) => !k.startsWith(gameId + ':')))
}

/** Arrange mode (the "Arrange" button on a touch screen): off, a finger never drags a plate, figure or arrow, so swiping scrolls and taps stay taps. */
export const arrangeMode = ref(false)

const THRESHOLD = 5
// A finger wobbles more than a mouse does.
const TOUCH_THRESHOLD = 10

/**
 * Begin a possible drag on pointerdown. Nothing moves until the pointer travels a few pixels, so
 * ordinary clicks still work; after a real drag the click that follows is swallowed.
 * `unit` says how the stored offset is measured: 'pct' of the stage, or local 'px'.
 */
/* How far past its location's box a figure's centre may be dragged (screen px), so it always reads as standing there. */
const BOUNDS_MARGIN = 28

/** Screen-pixel range the pointer may travel so the dragged element's centre stays inside `bounds` (grown by a margin). */
export function dragRange(target: DOMRect, bounds: DOMRect, margin = BOUNDS_MARGIN) {
  const cx = target.left + target.width / 2
  const cy = target.top + target.height / 2
  return {
    minX: Math.min(0, bounds.left - margin - cx), maxX: Math.max(0, bounds.right + margin - cx),
    minY: Math.min(0, bounds.top - margin - cy), maxY: Math.max(0, bounds.bottom + margin - cy),
  }
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

/**
 * Begin a possible drag on pointerdown. Nothing moves until the pointer travels a few pixels, so
 * ordinary clicks still work; after a real drag the click that follows is swallowed.
 * `unit` says how the stored offset is measured: 'pct' of the stage, or local 'px'.
 * `bounds`, when given, keeps the element's centre within that element's box (its location).
 */
export function beginDrag(event: PointerEvent, key: string, unit: 'pct' | 'px', stage: HTMLElement | null, bounds: HTMLElement | null = null) {
  if (event.button !== 0 || !event.isPrimary) return
  if (event.pointerType === 'touch' && !arrangeMode.value) return
  const threshold = event.pointerType === 'touch' ? TOUCH_THRESHOLD : THRESHOLD
  const target = event.currentTarget as HTMLElement
  const start: Offset = [...offsetOf(key)]
  const x0 = event.clientX
  const y0 = event.clientY
  const stageRect = stage?.getBoundingClientRect()
  // Screen pixels per local pixel (the map scales plates and figures by player settings).
  const scale = target.offsetWidth ? target.getBoundingClientRect().width / target.offsetWidth || 1 : 1
  const range = bounds ? dragRange(target.getBoundingClientRect(), bounds.getBoundingClientRect()) : null
  let dragging = false

  const move = (e: PointerEvent) => {
    const dx = range ? clamp(e.clientX - x0, range.minX, range.maxX) : e.clientX - x0
    const dy = range ? clamp(e.clientY - y0, range.minY, range.maxY) : e.clientY - y0
    if (!dragging) {
      if (Math.hypot(dx, dy) < threshold) return
      dragging = true
    }
    offsets.value = {
      ...offsets.value,
      [key]: unit === 'pct' && stageRect
        ? [start[0] + (dx / stageRect.width) * 100, start[1] + (dy / stageRect.height) * 100]
        : [start[0] + dx / scale, start[1] + dy / scale],
    }
  }
  const up = () => {
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
    window.removeEventListener('pointercancel', up)
    if (!dragging) return
    const swallow = (e: Event) => e.stopPropagation()
    window.addEventListener('click', swallow, { capture: true, once: true })
    setTimeout(() => window.removeEventListener('click', swallow, { capture: true }), 0)
  }
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
  window.addEventListener('pointercancel', up)
}
