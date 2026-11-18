/* Keeping the scene map's name plates and link badges off each other. Import-free on purpose so the
 * tests can load it without the Vue toolchain. Every number is in percent of the map stage. */

/** A box by its centre and half sizes. */
export type Box = { id: string; cx: number; cy: number; hw: number; hh: number }

const overlaps = (a: Box, b: Box, gap: number) =>
  Math.abs(a.cx - b.cx) < a.hw + b.hw + gap && Math.abs(a.cy - b.cy) < a.hh + b.hh + gap

/**
 * Vertical shifts that pull overlapping plates apart. The lowest plate stays put and each plate above it
 * that touches an already placed one moves up just clear of it: a plate's figures stand under it, so up
 * is the side with nothing of its own to cover. A plate that would leave the top of the stage moves down
 * instead. A plate in `fixed` (one the player dragged) never moves, but others still avoid it.
 * The same input always gives the same shifts, so plates do not jump between updates.
 */
export function plateShifts(
  boxes: readonly Box[],
  { gap = 0.4, maxShift = 12, fixed = new Set<string>() }: { gap?: number; maxShift?: number; fixed?: ReadonlySet<string> } = {},
): Record<string, number> {
  const order = [...boxes].sort((a, b) => (b.cy - a.cy) || (a.cx - b.cx) || a.id.localeCompare(b.id))
  const placed: Box[] = order.filter((box) => fixed.has(box.id))
  const shifts: Record<string, number> = {}
  for (const box of order) {
    if (fixed.has(box.id)) continue
    const at = { ...box }
    const settle = (direction: -1 | 1) => {
      at.cy = box.cy
      // Each pass clears one blocker; one pass per placed plate is enough for any real map.
      for (let pass = 0; pass <= placed.length; pass++) {
        const blocker = placed.find((other) => overlaps(at, other, gap))
        if (!blocker) return true
        // A hair more than the gap, so rounding never leaves the two still counted as touching.
        at.cy = blocker.cy + direction * (blocker.hh + at.hh + gap + 1e-6)
        if (Math.abs(at.cy - box.cy) > maxShift) return false
      }
      return false
    }
    const up = settle(-1) && at.cy - at.hh >= 0
    const ok = up || (settle(1) && at.cy + at.hh <= 100)
    if (!ok) at.cy = box.cy
    if (at.cy !== box.cy) shifts[box.id] = at.cy - box.cy
    placed.push(at)
  }
  return shifts
}

/**
 * How far to slide a link badge along its link so it sits on no plate. `ux, uy` is one step along the
 * link in stage percent, `reach` how many steps it may go either way. Returns the smallest slide that
 * clears every box, or 0 when the badge is already clear or no spot on the link is.
 */
export function badgeSlide(
  badge: Box, [ux, uy]: readonly [number, number], reach: number, boxes: readonly Box[], steps = 12,
): number {
  const clearAt = (along: number) => {
    const moved = { ...badge, cx: badge.cx + ux * along, cy: badge.cy + uy * along }
    return !boxes.some((box) => overlaps(moved, box, 0))
  }
  if (clearAt(0)) return 0
  for (let step = 1; step <= steps; step++) {
    const along = (reach * step) / steps
    if (clearAt(along)) return along
    if (clearAt(-along)) return -along
  }
  return 0
}
