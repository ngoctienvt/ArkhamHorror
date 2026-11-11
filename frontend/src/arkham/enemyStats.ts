/* An enemy's fight, evade and health as they stand right now. The server sends the printed values
 * (a Calculation) and the modifiers separately, so a "+1 fight per vengeance" or a "+2 health" effect
 * would otherwise never show. */
import type { Enemy } from '@/arkham/types/Enemy'
import { resolveCalculation } from '@/arkham/types/Calculation'
import { computeStat, type Stat } from '@/arkham/statModel'

export type EnemyStatKey = 'fight' | 'evade' | 'health'

const STAT_KEY = { fight: 'fight', evade: 'evade', health: 'enemyHealth' } as const

/** The stat after modifiers, or null when the printed value is a dash, an X or otherwise not a number. */
export function enemyStat(enemy: Enemy, key: EnemyStatKey, players: number): Stat | null {
  const printed = resolveCalculation(enemy[key], players)
  if (printed === null) return null
  return computeStat(STAT_KEY[key], printed, enemy.modifiers)
}
