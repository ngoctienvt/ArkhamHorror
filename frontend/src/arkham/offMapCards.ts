/**
 * Cards in play that sit on no location, which the card board draws in its scenario row and the scene
 * map would otherwise not show at all:
 * - "in the shadows" (The Scarlet Keys): concealed enemies, investigators, and the locations of
 *   Without a Trace / Congress of the Keys waiting in the shadows (left / middle / right);
 * - enemies in the pursuit zone, and the top enemy of the Void or of The Depths;
 * - global enemies, stories and assets (in play, at no location);
 * - treacheries lying next to the scenario reference card.
 *
 * Import-free at runtime (types only), so tests/offMapCards.test.mjs can load it without the Vue toolchain.
 */
import type { Game } from '@/arkham/types/Game'
import type { Scenario } from '@/arkham/types/Scenario'

export type OffMapKind = 'shadows' | 'pursuit' | 'void' | 'depths' | 'global' | 'reference'

export interface OffMapGroup {
  kind: OffMapKind
  locations: string[]
  enemies: string[]
  investigators: string[]
  stories: string[]
  assets: string[]
  treacheries: string[]
}

type Placed = { placement?: { tag: string; contents?: unknown } | null }

const ORDER: OffMapKind[] = ['shadows', 'pursuit', 'void', 'depths', 'global', 'reference']

const idsWhere = (pool: Record<string, Placed> | undefined, test: (p: NonNullable<Placed['placement']>) => boolean): string[] =>
  Object.entries(pool ?? {}).filter(([, e]) => e.placement && test(e.placement)).map(([id]) => id)

const isGlobal = (p: NonNullable<Placed['placement']>) => p.tag === 'OtherPlacement' && p.contents === 'Global'
const outOfPlayIn = (zone: string) => (p: NonNullable<Placed['placement']>) => p.tag === 'OutOfPlay' && p.contents === zone

/** The off-map cards, grouped by where they lie, in a fixed order; empty groups are left out. */
export function offMapGroups(game: Game, scenario: Scenario | null | undefined): OffMapGroup[] {
  const enemies = game.enemies as unknown as Record<string, Placed & { asSelfLocation?: string | null }>
  const empty = (kind: OffMapKind): OffMapGroup => ({ kind, locations: [], enemies: [], investigators: [], stories: [], assets: [], treacheries: [] })
  const groups = new Map<OffMapKind, OffMapGroup>(ORDER.map((k) => [k, empty(k)]))
  const at = (k: OffMapKind) => groups.get(k) as OffMapGroup

  const shadowSlots = (scenario?.meta as { locationsInShadows?: Record<string, string | null> } | undefined)?.locationsInShadows
  at('shadows').locations = ['left', 'middle', 'right']
    .map((slot) => shadowSlots?.[slot])
    .filter((id): id is string => typeof id === 'string' && id in (game.locations ?? {}))
  at('shadows').enemies = idsWhere(enemies, (p) => p.tag === 'InTheShadows')
  at('shadows').investigators = idsWhere(game.investigators as unknown as Record<string, Placed>, (p) => p.tag === 'InTheShadows')

  at('pursuit').enemies = idsWhere(enemies, outOfPlayIn('PursuitZone'))
  // Only the top card of the Void / The Depths is shown, as on the card board.
  at('void').enemies = idsWhere(enemies, outOfPlayIn('VoidZone')).slice(0, 1)
  at('depths').enemies = idsWhere(enemies, outOfPlayIn('TheDepths')).slice(0, 1)

  // An enemy that is its own location (Atlach-Nacha) sits at Global but is drawn on the map.
  at('global').enemies = idsWhere(enemies, isGlobal).filter((id) => !enemies[id].asSelfLocation)
  at('global').stories = idsWhere(game.stories as unknown as Record<string, Placed>, isGlobal)
  at('global').assets = idsWhere(game.assets as unknown as Record<string, Placed>, isGlobal)

  at('reference').treacheries = idsWhere(game.treacheries as unknown as Record<string, Placed>, (p) => p.tag === 'NextToScenarioReference')

  return ORDER.map(at).filter((g) => g.locations.length + g.enemies.length + g.investigators.length + g.stories.length + g.assets.length + g.treacheries.length > 0)
}
