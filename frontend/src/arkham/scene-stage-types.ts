import type { Act } from './types/Act'
import type { Agenda } from './types/Agenda'
import type { Enemy } from './types/Enemy'
import type { Location } from './types/Location'
import type { Story } from './types/Story'
import type { HemlockOverview } from './hemlock-overview'
import type { Point } from './locationGraph'

export type SceneSnapshot = {
  id: string
  layout: readonly string[] | null
  locations: readonly Location[]
  acts: readonly Act[]
  agendas: readonly Agenda[]
  enemies: readonly Enemy[]
  stories?: readonly Story[]
  meta: Record<string, unknown>
  counts?: Record<string, number>
}

export type StageBoard = HemlockOverview & {
  stageArt?: boolean
  positions?: Record<string, Point>
  tileImages?: Record<string, string>
  tileBack?: string
  tileSize?: Point
  /** Width/height in grid cells for a location occupying a repeated layout label. */
  tileSpans?: Record<string, Point>
  layers?: { image: string; mask: string }[]
  figures?: { id: string; image: string; point: Point; size: Point; mask?: string }[]
}

export const cleanCode = (value: string) => value.replace(/^c/, '')
export const scenePath = (value: string) => `img/scenes/${value}.webp`
export const hasCode = (snapshot: SceneSnapshot, pattern: RegExp) =>
  snapshot.locations.some((location) => pattern.test(cleanCode(location.cardCode)))

export function panorama(art: string, anchors: Record<string, Point> = {}): StageBoard {
  return { image: scenePath(art), layoutArt: art, fixedPassages: false, village: true, anchors, stageArt: true }
}

/** Explicit room silhouettes keep a transformed chamber out of its neighbours. */
export function areaMask(areas: readonly (readonly Point[])[]): string {
  const polygons = areas.map((points) => `<polygon points="${points.map((point) => point.join(',')).join(' ')}"/>`).join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><defs><filter id="soft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="0.35"/></filter></defs><g fill="white" filter="url(#soft)">${polygons}</g></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}
