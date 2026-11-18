import { computed, ref, type Ref } from 'vue'

/* Lets a fixed-position floating panel be dragged by a handle (its header) and remembers where the player
 * left it. The panel keeps its CSS home position; the drag is an offset applied as a translate, clamped so
 * the handle always stays on screen. Double-clicking the handle puts the panel back home. */

interface Offset { x: number; y: number }

/** How much of the panel must stay inside the viewport, so it can always be grabbed again. */
const KEEP_VISIBLE = 48

function loadOffset(key: string): Offset {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return { x: 0, y: 0 }
    const v = JSON.parse(raw) as Partial<Offset>
    return { x: Number(v.x) || 0, y: Number(v.y) || 0 }
  } catch {
    return { x: 0, y: 0 }
  }
}

function saveOffset(key: string, offset: Offset) {
  try { localStorage.setItem(key, JSON.stringify(offset)) } catch { /* storage unavailable: position is per visit */ }
}

export function useDraggableFloatingPanel(panel: Ref<HTMLElement | null>, storageKey: string) {
  const offset = ref<Offset>(loadOffset(storageKey))
  const dragging = ref(false)
  let start: { px: number; py: number; ox: number; oy: number; home: DOMRect } | null = null

  /* Keep the panel's rectangle at least KEEP_VISIBLE px inside the viewport on every side. */
  function clamp(next: Offset, home: DOMRect): Offset {
    const minX = KEEP_VISIBLE - home.right
    const maxX = window.innerWidth - KEEP_VISIBLE - home.left
    const minY = -home.top
    const maxY = window.innerHeight - KEEP_VISIBLE - home.top
    return {
      x: Math.round(Math.min(maxX, Math.max(minX, next.x))),
      y: Math.round(Math.min(maxY, Math.max(minY, next.y))),
    }
  }

  function onMove(e: PointerEvent) {
    if (!start) return
    offset.value = clamp({ x: start.ox + e.clientX - start.px, y: start.oy + e.clientY - start.py }, start.home)
  }

  function onUp() {
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
    window.removeEventListener('pointercancel', onUp)
    if (start) saveOffset(storageKey, offset.value)
    start = null
    dragging.value = false
  }

  /** Bind to the handle's pointerdown. Presses on buttons inside the handle (e.g. close) are left alone. */
  function onHandleDown(e: PointerEvent) {
    if (e.button !== 0 || (e.target as HTMLElement).closest('button')) return
    const el = panel.value
    if (!el) return
    e.preventDefault()
    const rect = el.getBoundingClientRect()
    // The panel's rectangle without the current offset: its CSS home position.
    const home = new DOMRect(rect.left - offset.value.x, rect.top - offset.value.y, rect.width, rect.height)
    start = { px: e.clientX, py: e.clientY, ox: offset.value.x, oy: offset.value.y, home }
    dragging.value = true
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
  }

  function reset() {
    offset.value = { x: 0, y: 0 }
    saveOffset(storageKey, offset.value)
  }

  const style = computed(() => (offset.value.x || offset.value.y)
    ? { transform: `translate(${offset.value.x}px, ${offset.value.y}px)` }
    : undefined)

  return { style, dragging, onHandleDown, reset, stop: onUp }
}
