import { readonly, ref } from 'vue'
import type { EnemyActivity, EnemyActivityKind } from '@/arkham/enemyActivityLog'

/* Enemies that just moved or attacked, keyed by enemy id, for the map to light up. Game.vue feeds
 * it from the log; every LocationStandees reads it. Module-level so one feed serves every room. */
const HOLD_MS = 2400
const active = ref<Record<string, EnemyActivityKind>>({})
const timers = new Map<string, ReturnType<typeof setTimeout>>()

export function flagEnemyActivity(list: readonly EnemyActivity[]): void {
  if (list.length === 0) return
  const next = { ...active.value }
  for (const { enemyId, kind } of list) {
    // An attack outranks a move made in the same update: it is the part worth noticing.
    if (next[enemyId] !== 'attack' || kind === 'attack') next[enemyId] = kind
    clearTimeout(timers.get(enemyId))
    timers.set(enemyId, setTimeout(() => {
      timers.delete(enemyId)
      const { [enemyId]: _gone, ...rest } = active.value
      active.value = rest
    }, HOLD_MS))
  }
  active.value = next
}

export function useEnemyActivity() {
  return readonly(active)
}
