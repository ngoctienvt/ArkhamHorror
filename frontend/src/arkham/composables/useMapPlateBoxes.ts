import { onBeforeUnmount, onMounted, ref, watch, nextTick, type Ref, type WatchSource } from 'vue'

/** Where a location's plate really sits, in percent of the map stage, relative to the location's map spot. */
export type PlateBox = {
  /** Plate centre minus the location's map spot. */
  dx: number
  dy: number
  /** Half the plate's width and height. */
  hw: number
  hh: number
}

/**
 * A location node is centred on its map spot, but it also holds things below the plate (concealed cards),
 * so the plate itself is usually above that spot. Lines drawn spot-to-spot then stop short of the plate
 * or run under it. This measures each plate (or the whole node, when `selector` is null) against the node
 * centre, so links can be drawn from plate edge to plate edge. Measured as an offset from the node centre,
 * the result stays right while a plate is dragged; it is re-measured when anything changes size.
 */
export function useMapPlateBoxes(stage: Ref<HTMLElement | null>, selector: () => string | null, deps: WatchSource[]) {
  const boxes = ref<Record<string, PlateBox>>({})
  let observer: ResizeObserver | null = null
  let frame = 0

  function measure() {
    frame = 0
    const el = stage.value
    if (!el) return
    const s = el.getBoundingClientRect()
    if (!s.width || !s.height) return
    const sel = selector()
    const next: Record<string, PlateBox> = {}
    el.querySelectorAll<HTMLElement>('.node[data-id]').forEach((node) => {
      const id = node.dataset.id
      if (!id) return
      const box = (sel ? node.querySelector<HTMLElement>(sel) : null) ?? node
      observer?.observe(node)
      if (box !== node) observer?.observe(box)
      const n = node.getBoundingClientRect()
      const r = box.getBoundingClientRect()
      next[id] = {
        dx: ((r.left + r.width / 2 - (n.left + n.width / 2)) / s.width) * 100,
        dy: ((r.top + r.height / 2 - (n.top + n.height / 2)) / s.height) * 100,
        hw: (r.width / 2 / s.width) * 100,
        hh: (r.height / 2 / s.height) * 100,
      }
    })
    // Skip no-op updates so a resize callback never re-renders the links for nothing.
    if (JSON.stringify(next) !== JSON.stringify(boxes.value)) boxes.value = next
  }

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(measure)
  }

  onMounted(() => {
    observer = new ResizeObserver(schedule)
    if (stage.value) observer.observe(stage.value)
    nextTick(schedule)
  })
  onBeforeUnmount(() => {
    observer?.disconnect()
    if (frame) cancelAnimationFrame(frame)
  })
  watch(deps, () => nextTick(schedule), { deep: true })

  return boxes
}

/**
 * Trim the segment between two map spots so it starts and ends on the plates' edges.
 * Coordinates are stage percent; both axes are percent, so clipping to the axis-aligned box is linear.
 * Returns null when the plates overlap and there is no gap to draw a line through.
 */
export function clipBetweenBoxes(
  [x1, y1]: [number, number], a: PlateBox | undefined,
  [x2, y2]: [number, number], b: PlateBox | undefined,
): { from: [number, number]; to: [number, number] } | null {
  const ax = x1 + (a?.dx ?? 0)
  const ay = y1 + (a?.dy ?? 0)
  const bx = x2 + (b?.dx ?? 0)
  const by = y2 + (b?.dy ?? 0)
  const vx = bx - ax
  const vy = by - ay
  // Fraction of the segment inside a box centred at one end.
  const exit = (box: PlateBox | undefined) => {
    if (!box) return 0
    const tx = vx === 0 ? Infinity : box.hw / Math.abs(vx)
    const ty = vy === 0 ? Infinity : box.hh / Math.abs(vy)
    return Math.min(tx, ty)
  }
  const ta = exit(a)
  const tb = exit(b)
  if (ta + tb >= 1) return null
  return { from: [ax + vx * ta, ay + vy * ta], to: [bx - vx * tb, by - vy * tb] }
}
