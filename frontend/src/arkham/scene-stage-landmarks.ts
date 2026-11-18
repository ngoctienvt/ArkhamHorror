import type { Point } from './locationGraph'
import type { SceneSnapshot } from './scene-stage-types'
import { cleanCode } from './scene-stage-types'

type LandmarkGroup = { labels: string[]; floors: Record<string, Point> }

/** Reserve revealed landmarks first; place unknown cards by public slot, never private identity. */
export function landmarkPositions(state: SceneSnapshot, fixed: Record<string, Point>, groups: LandmarkGroup[]): Record<string, Point> {
  const positions: Record<string, Point> = {}
  const occupied = new Set<string>()
  for (const location of state.locations) {
    const code = cleanCode(location.cardCode)
    const point = fixed[code] ?? ((location.revealed || location.enemyLocation)
      ? groups.map((group) => group.floors[code]).find(Boolean) : undefined)
    if (point) { positions[location.id] = point; occupied.add(point.join(',')) }
  }
  for (const group of groups) {
    const floors = Object.values(group.floors)
    for (const location of [...state.locations].sort((a, b) => a.label.localeCompare(b.label))) {
      if (positions[location.id]) continue
      const slot = group.labels.indexOf(location.label)
      if (slot < 0) continue
      const preferred = floors[slot]
      const point = preferred && !occupied.has(preferred.join(',')) ? preferred : floors.find((floor) => !occupied.has(floor.join(',')))
      if (point) { positions[location.id] = point; occupied.add(point.join(',')) }
    }
  }
  return positions
}
