/**
 * Pure graph helpers for the location map view.
 * Deliberately import-free (types are structural) so node tests can load it directly.
 */
export type GraphLocation = {
  id: string
  connectedLocations: string[]
  investigators: string[]
  enemies: string[]
  /** Scenario grid label, when the scenario lays its locations out on a grid. */
  label?: string
}

export type LocationGraph = Record<string, GraphLocation>

/** Neighbours of a location, treating connections as undirected and ignoring locations not in play. */
function neighbours(graph: LocationGraph): Map<string, Set<string>> {
  const result = new Map<string, Set<string>>(Object.keys(graph).map((id) => [id, new Set<string>()]))
  for (const [id, location] of Object.entries(graph)) {
    for (const other of location.connectedLocations) {
      if (other === id || !(other in graph)) continue
      result.get(id)!.add(other)
      result.get(other)!.add(id)
    }
  }
  return result
}

/** Each connection once, as [from, to]. */
export function locationLinks(graph: LocationGraph): [string, string][] {
  const links: [string, string][] = []
  for (const [id, next] of neighbours(graph)) {
    for (const other of next) if (id < other) links.push([id, other])
  }
  return links
}

/** Direction of a displayed connection, independent of the order of its endpoints. */
export function locationLinkDirection(
  a: Pick<GraphLocation, 'id' | 'connectedLocations'>,
  b: Pick<GraphLocation, 'id' | 'connectedLocations'>,
): 'both' | 'forward' | 'backward' | null {
  const forward = a.connectedLocations.includes(b.id)
  const backward = b.connectedLocations.includes(a.id)
  if (forward && backward) return 'both'
  if (forward) return 'forward'
  return backward ? 'backward' : null
}

/**
 * Fewest-hops route from `from` to `to`, both ends included; empty when unreachable.
 * `isBlocked` rules out intermediate and final stops (e.g. a barred location); the start is never blocked.
 */
export function shortestPath(
  graph: LocationGraph,
  from: string,
  to: string,
  isBlocked: (id: string) => boolean = () => false,
): string[] {
  if (!(from in graph) || !(to in graph)) return []
  if (from === to) return [from]
  const next = neighbours(graph)
  const previous = new Map<string, string>()
  const seen = new Set([from])
  const queue = [from]
  for (let head = 0; head < queue.length; head++) {
    const current = queue[head]
    for (const other of next.get(current) ?? []) {
      if (seen.has(other) || isBlocked(other)) continue
      seen.add(other)
      previous.set(other, current)
      if (other === to) {
        const route = [to]
        while (route[0] !== from) route.unshift(previous.get(route[0])!)
        return route
      }
      queue.push(other)
    }
  }
  return []
}

export function locationRoster(graph: LocationGraph, id: string): { investigators: string[]; enemies: string[] } {
  const location = graph[id]
  return { investigators: [...(location?.investigators ?? [])], enemies: [...(location?.enemies ?? [])] }
}

export type Point = [number, number]

/** Centre of every label in a scenario grid, as percentages of the map. Labels may span several cells. */
export function gridPositions(rows: string[]): Record<string, Point> {
  const cells = rows.map((row) => row.trim().split(/\s+/))
  const width = Math.max(1, ...cells.map((r) => r.length))
  const height = Math.max(1, cells.length)
  const sums = new Map<string, { x: number; y: number; n: number }>()
  cells.forEach((row, y) => row.forEach((label, x) => {
    if (label === '.' || label === '') return
    const entry = sums.get(label) ?? { x: 0, y: 0, n: 0 }
    sums.set(label, { x: entry.x + x + 0.5, y: entry.y + y + 0.5, n: entry.n + 1 })
  }))
  return Object.fromEntries(
    [...sums].map(([label, s]) => [label, [(s.x / s.n / width) * 100, (s.y / s.n / height) * 100] as Point]),
  )
}

/**
 * The grid as the card board draws it: rows and columns sized to their content, so a row or column
 * holding none of `keep` (no card and no cell on offer) collapses away.
 */
export function compactGridLayout(rows: readonly string[], keep: ReadonlySet<string>): string[] {
  const cells = rows.map((row) => row.trim().split(/\s+/))
  const width = Math.max(0, ...cells.map((r) => r.length))
  const keptRows = cells.filter((row) => row.some((label) => keep.has(label)))
  const keptColumns = [...Array(width).keys()].filter((x) => keptRows.some((row) => keep.has(row[x] ?? '')))
  return keptRows.map((row) => keptColumns.map((x) => row[x] ?? '.').join(' '))
}

/** Layered layout for locations without a grid: columns by distance from the first location of each cluster. */
export function autoPositions(graph: LocationGraph): Record<string, Point> {
  const next = neighbours(graph)
  const cell = new Map<string, [number, number]>()
  let rowOffset = 0
  let columns = 1
  for (const root of Object.keys(graph)) {
    if (cell.has(root)) continue
    const layers: string[][] = []
    const depth = new Map([[root, 0]])
    const queue = [root]
    for (let head = 0; head < queue.length; head++) {
      const id = queue[head]
      const d = depth.get(id)!
      ;(layers[d] ??= []).push(id)
      for (const other of next.get(id) ?? []) {
        if (cell.has(other) || depth.has(other)) continue
        depth.set(other, d + 1)
        queue.push(other)
      }
    }
    layers.forEach((ids, column) => ids.forEach((id, row) => cell.set(id, [column, rowOffset + row])))
    columns = Math.max(columns, layers.length)
    rowOffset += Math.max(...layers.map((l) => l.length))
  }
  const rows = Math.max(1, rowOffset)
  return Object.fromEntries(
    [...cell].map(([id, [c, r]]) => [id, [((c + 0.5) / columns) * 100, ((r + 0.5) / rows) * 100] as Point]),
  )
}

/**
 * Where each location sits on the map: by the scenario grid when its label is on it, otherwise in a
 * strip along the bottom laid out by connections. The grid is squeezed up only when that strip is needed.
 */
export function mapPositions(graph: LocationGraph, layout: string[] | null): Record<string, Point> {
  const grid = layout ? gridPositions(layout) : {}
  const placed: Record<string, Point> = {}
  const loose: LocationGraph = {}
  for (const [id, location] of Object.entries(graph)) {
    const point = location.label !== undefined ? grid[location.label] : undefined
    if (point) placed[id] = point
    else loose[id] = location
  }
  if (Object.keys(loose).length === 0) return placed
  if (Object.keys(placed).length === 0) return autoPositions(loose)
  const squeezed = Object.fromEntries(Object.entries(placed).map(([id, [x, y]]) => [id, [x, y * 0.8] as Point]))
  const strip = Object.fromEntries(
    Object.entries(autoPositions(loose)).map(([id, [x, y]]) => [id, [x, 84 + y * 0.14] as Point]),
  )
  return { ...squeezed, ...strip }
}

// The painted chambers zigzag left to right. Anchors sit above the open floor
// so figures have their own space below each plate.
const MINE_DESCENT_ANCHORS: Record<string, Point> = {
  pos0101: [14, 66],
  pos0201: [27, 20],
  pos0301: [48, 66],
  pos0401: [70, 20],
  pos0501: [85, 66],
}

// The walkway centers sit off the direct line between some room plates.
const MINE_DESCENT_PASSAGES: Record<string, Point> = {
  'pos0101:pos0201': [17, 47],
  'pos0201:pos0301': [38, 47],
  'pos0301:pos0401': [58, 47],
  'pos0401:pos0501': [79, 47],
}

export function mineDescentPassage(a: string, b: string): Point | undefined {
  return MINE_DESCENT_PASSAGES[a < b ? `${a}:${b}` : `${b}:${a}`]
}

export function mineDescentPositions(
  graph: LocationGraph,
  fallback: Record<string, Point>,
): Record<string, Point> {
  return Object.fromEntries(Object.entries(graph).map(([id, location]) => [
    id,
    MINE_DESCENT_ANCHORS[location.label ?? ''] ?? fallback[id],
  ]))
}

/**
 * Locations in a straight line that all connect to each other (a row joined by "LocationInRow", say).
 * Drawing every pair stacks the long links on top of the short ones: their badges land on the middle
 * locations. So a link A–C is folded away when another location B sits on the segment between them and
 * A–B and B–C are links too; what is left is one link per gap plus a `lane` (its two far ends and members)
 * that the map draws as one rail, so the row reads as "all joined".
 * `foldable` says whether a link may be folded (two-way, no barriers on it); others always stay.
 */
export function foldRowLinks(
  links: readonly [string, string][],
  at: (id: string) => Point | undefined,
  foldable: (a: string, b: string) => boolean,
  tolerance = 1.5,
): { links: [string, string][]; lanes: { ends: [string, string]; members: string[] }[] } {
  const key = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`)
  const linked = new Set(links.map(([a, b]) => key(a, b)))
  const ids = [...new Set(links.flat())]
  const folded = new Set<string>()
  const parent = new Map<string, string>()
  const root = (id: string): string => {
    const p = parent.get(id) ?? id
    if (p === id) return id
    const r = root(p)
    parent.set(id, r)
    return r
  }
  const join = (a: string, b: string) => parent.set(root(a), root(b))
  for (const [a, c] of links) {
    const pa = at(a)
    const pc = at(c)
    if (!pa || !pc || !foldable(a, c)) continue
    const [dx, dy] = [pc[0] - pa[0], pc[1] - pa[1]]
    const length = Math.hypot(dx, dy)
    if (length === 0) continue
    const between = ids.filter((b) => {
      if (b === a || b === c || !linked.has(key(a, b)) || !linked.has(key(b, c))) return false
      const pb = at(b)
      if (!pb) return false
      const t = ((pb[0] - pa[0]) * dx + (pb[1] - pa[1]) * dy) / (length * length)
      const off = Math.abs((pb[0] - pa[0]) * dy - (pb[1] - pa[1]) * dx) / length
      return t > 0.02 && t < 0.98 && off <= tolerance
    })
    if (!between.length) continue
    folded.add(key(a, c))
    for (const b of between) { join(a, b); join(b, c) }
  }
  const groups = new Map<string, string[]>()
  for (const id of parent.keys()) {
    const r = root(id)
    groups.set(r, [...(groups.get(r) ?? []), id])
  }
  const lanes = [...groups.values()].map((members) => {
    let ends: [string, string] = [members[0], members[1]]
    let best = -1
    for (const a of members) for (const b of members) {
      const [pa, pb] = [at(a)!, at(b)!]
      const d = Math.hypot(pa[0] - pb[0], pa[1] - pb[1])
      if (a < b && d > best) { best = d; ends = [a, b] }
    }
    return { ends, members: [...members].sort() }
  })
  return { links: links.filter(([a, b]) => !folded.has(key(a, b))), lanes }
}
