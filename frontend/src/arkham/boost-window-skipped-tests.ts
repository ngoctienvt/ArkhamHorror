import { ref } from 'vue'

/* Skill tests (by id) whose pre-commit fast window was passed by itself because it only
 * offered skill boosts. Game.vue records them; the skill test panel explains the skip. */
export const boostOnlySkippedTests = ref<ReadonlySet<string>>(new Set())

export function markBoostOnlySkipped(testId: string): void {
  boostOnlySkippedTests.value = new Set([...boostOnlySkippedTests.value, testId])
}
