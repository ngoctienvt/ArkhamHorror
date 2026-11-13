/* Horror in High Gear lays its road out as a string layout of six rows. Each column is one stretch of road
 * (`road1`, `road2`, ...): a single tile spans rows 3-4 (`road3a road3a` on those two rows), two tiles span rows
 * 2-3 and 4-5, three tiles rows 1-2, 3-4 and 5-6. A tile therefore fills SEVERAL rows of one column, which
 * `compactGridLayout` (one cell per label) cannot read. Driving on adds a column on the right and drops the
 * columns behind the last investigator, so the first token of every row changes.
 *
 * Pure functions with no runtime imports, so tests can load the file on its own. */

export type Point = [number, number]

export type RoadCell = {
  /** Index of the column among those that hold a tile, from the rear (0) to the front. */
  column: number
  /** Centre of the rows the tile spans, in row units from the top (a tile on rows 3-4 sits at 3). */
  rowCenter: number
  /** How many rows it spans. */
  rows: number
}

export type RoadGrid = {
  columns: number
  rows: number
  cells: Record<string, RoadCell>
}

const EMPTY = '.'

/** The road's tiles and where they sit, or undefined when the layout holds none. */
export function readRoadLayout(layout: readonly string[] | null | undefined): RoadGrid | undefined {
  const rows = (layout ?? []).map((row) => row.trim().split(/\s+/).filter(Boolean))
  if (rows.length === 0) return undefined
  const width = Math.max(...rows.map((row) => row.length))
  const kept = [...Array(width).keys()].filter((x) => rows.some((row) => row[x] !== undefined && row[x] !== EMPTY))
  if (kept.length === 0) return undefined

  const spans = new Map<string, { column: number; first: number; last: number }>()
  rows.forEach((row, y) => {
    kept.forEach((x, column) => {
      const label = row[x]
      if (!label || label === EMPTY) return
      const span = spans.get(label)
      if (!span) spans.set(label, { column, first: y, last: y })
      else { span.first = Math.min(span.first, y); span.last = Math.max(span.last, y) }
    })
  })
  return {
    columns: kept.length,
    rows: rows.length,
    cells: Object.fromEntries([...spans].map(([label, span]) => [label, {
      column: span.column,
      rowCenter: (span.first + span.last + 1) / 2,
      rows: span.last - span.first + 1,
    }])),
  }
}

/** Centre of a tile on the map, in percent of the stage: columns share the width, rows share the height. */
export function roadPosition(grid: RoadGrid, label: string): Point | undefined {
  const cell = grid.cells[label]
  return cell ? [((cell.column + 0.5) / grid.columns) * 100, (cell.rowCenter / grid.rows) * 100] : undefined
}

/** Every tile's centre by label. */
export function roadPositions(grid: RoadGrid | undefined): Record<string, Point> {
  if (!grid) return {}
  return Object.fromEntries(Object.keys(grid.cells).map((label) => [label, roadPosition(grid, label) as Point]))
}

export type RoadSlides = {
  /** Tiles that were not there a moment ago (the new column on the right). */
  entering: string[]
  /** Tiles that are gone (the columns behind the last investigator). */
  leaving: string[]
  /** Tiles that stayed but moved, with how far (percent of the stage) from where they were to where they are. */
  shifting: { id: string; dx: number; dy: number }[]
}

/** What changed between two snapshots of tile centres, keyed by location id. */
export function roadSlides(before: Readonly<Record<string, Point>>, after: Readonly<Record<string, Point>>): RoadSlides {
  const entering = Object.keys(after).filter((id) => !(id in before))
  const leaving = Object.keys(before).filter((id) => !(id in after))
  const shifting = Object.keys(after).flatMap((id) => {
    const from = before[id]
    if (!from) return []
    const dx = from[0] - after[id][0]
    const dy = from[1] - after[id][1]
    return Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01 ? [] : [{ id, dx, dy }]
  })
  return { entering, leaving, shifting }
}

/** Whether a column was added on the right or taken away at the rear (any change worth a slide). */
export const roadAdvanced = (slides: RoadSlides): boolean => slides.entering.length > 0 || slides.leaving.length > 0
