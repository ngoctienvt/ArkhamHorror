import { computed, readonly, ref, shallowRef } from 'vue'
import type { SkillTestSummary } from '@/arkham/skillTestSummary'
import type { LogEntry } from '@/arkham/types/GameLog'

/* The summary of the skill test that just ended, waiting for the player to
 * confirm it. Game.vue sets it when a test ends (and holds the autopilot while
 * it is up); Scenario.vue shows it where the test panel was.
 *
 * Module-level, like useChaosDraw: one summary at a time, shared without props. */
const current = ref<SkillTestSummary | null>(null)
/* The log lines filed inside that test's block, kept current by Game.vue since
 * they can arrive after the update that ended the test. */
const log = shallowRef<readonly LogEntry[]>([])

export function setSkillTestSummaryLog(entries: readonly LogEntry[]): void {
  log.value = entries
}

export function showSkillTestSummary(summary: SkillTestSummary): void {
  current.value = summary
}

export function dismissSkillTestSummary(): void {
  current.value = null
  log.value = []
}

export function useSkillTestSummary() {
  return { summary: readonly(current), log: computed(() => log.value), dismiss: dismissSkillTestSummary }
}
