import type { Enemy } from './types/Enemy'
import { gridPositions, type Point } from './locationGraph'

export const WEAVER_FOLDER = 'img/scenes/the-dream-eaters/weaver'
export const STAIRS_FOLDER = 'img/scenes/the-dream-eaters/endless-stairs'
export const WEB_RING = ['theGreatWeb4', 'theGreatWeb5', 'theGreatWeb6', 'theGreatWeb7', 'theGreatWeb8', 'theGreatWeb9', 'theGreatWeb10', 'theGreatWeb11']

type Slot = { id: string; label: string; revealed: boolean }
const stairsLabels = ['mysteriousStairs1', 'mysteriousStairs2', 'mysteriousStairs3', 'mysteriousStairs4', 'mysteriousStairs5']
const steps: Point[] = [[50, 13], [43, 31], [56, 49], [44, 67], [55, 85]]
const modulo = (n: number, size: number) => ((n % size) + size) % size

export const webRingPoint = (step: number, radiusX = 22): Point => {
  const angle = step * Math.PI / 4
  return [50 + radiusX * Math.sin(angle), 50 - 39 * Math.cos(angle)]
}

export function dreamGridPositions(folder: string | undefined, layout: readonly string[], ring: boolean): Record<string, Point> | undefined {
  if (folder === STAIRS_FOLDER) return Object.fromEntries(stairsLabels.map((label, i) => [label, steps[i]]))
  if (folder !== WEAVER_FOLDER) return undefined
  if (!ring) return Object.fromEntries([16, 38, 60, 82].map((y, i) => [`theGreatWeb${i + 1}`, [50, y]]))

  const centers = gridPositions([...layout])
  const left = centers.theGreatWeb10
  const right = centers.theGreatWeb6
  const top = centers.theGreatWeb4
  const bottom = centers.theGreatWeb8
  const axis = left && right && top && bottom && right[0] > left[0] && bottom[1] > top[1]
    ? { x: (left[0] + right[0]) / 2, y: (top[1] + bottom[1]) / 2, rx: (right[0] - left[0]) / 2, ry: (bottom[1] - top[1]) / 2 }
    : undefined
  const sectors = WEB_RING.map((label, i) => {
    const at = centers[label]
    if (!axis || !at) return i
    return modulo(Math.round(Math.atan2((at[0] - axis.x) / axis.rx, (axis.y - at[1]) / axis.ry) / (Math.PI / 4)), 8)
  })
  return Object.fromEntries(WEB_RING.map((label, i) => [label, webRingPoint(new Set(sectors).size === 8 ? sectors[i] : i)]))
}

/** A rotation can arrive with the face-down locations already reshuffled by Endless Descent. */
export function stairsRotation(before: readonly Slot[], after: readonly Slot[]): string | undefined {
  if (before.length !== 5 || after.length !== 5) return undefined
  if (!stairsLabels.every((label) => before.some((l) => l.label === label) && after.some((l) => l.label === label))) return undefined
  const moved = new Map(after.map((l) => [l.id, l]))
  const top = before.find((l) => l.label === stairsLabels[0])!
  const wrapped = moved.get(top.id)
  if (!wrapped || wrapped.revealed || wrapped.label === top.label) return undefined
  if (!before.every((l) => moved.has(l.id))) return undefined
  const rests = before.filter((l) => l.id !== top.id)
  const shifted = (l: Slot) => moved.get(l.id)?.label === stairsLabels[stairsLabels.indexOf(l.label) - 1]
  if (wrapped.label === stairsLabels[4] && rests.every(shifted)) return top.id
  const revealed = rests.filter((l) => l.revealed)
  return revealed.length > 0 && revealed.every(shifted) ? top.id : undefined
}

const legStart: Record<string, number> = { '06347': 7, '06348': 1, '06349': 5, '06350': 3 }
const enemyCode = (enemy: Enemy) => enemy.cardCode.replace(/^c/, '').replace(/[ab]$/, '')

export function weaverEnemies(enemies: readonly Enemy[], locations: readonly Pick<Slot, 'id' | 'label'>[]) {
  const labels = new Map(locations.map((l) => [l.id, l.label]))
  const ringIndex = (e: Enemy) => e.placement.tag === 'AtLocation'
    ? WEB_RING.indexOf(labels.get(e.placement.contents) ?? '') : -1
  const body = enemies.find((e) => enemyCode(e) === '06346'
    && ((!e.flipped && e.placement.tag === 'OtherPlacement' && e.placement.contents === 'Global') || ringIndex(e) >= 0))
  const legs = enemies.flatMap((e) => {
    const base = legStart[enemyCode(e)]
    const step = ringIndex(e)
    return base === undefined || step < 0 ? [] : [{ enemy: e, base, step }]
  })
  const fallback = legs.length ? modulo(legs[0].step - legs[0].base, 8) * 45 : 0
  const rotation: unknown = body?.meta?.rotation
  return {
    body,
    bodyStep: body ? ringIndex(body) : -1,
    legs,
    rotation: typeof rotation === 'number' && Number.isFinite(rotation) ? modulo(rotation, 360) : fallback,
  }
}

export function weaverEnemyIds(spider: ReturnType<typeof weaverEnemies> | undefined): Set<string> {
  const ids = new Set(spider?.legs.map((leg) => leg.enemy.id))
  if (spider?.body) ids.add(spider.body.id)
  return ids
}

export function clockwiseArc(from: number, to: number, radiusX = 22): Point[] {
  const distance = modulo(to - from, 8)
  return Array.from({ length: distance * 4 + 1 }, (_, i) => webRingPoint(from + i / 4, radiusX))
}
