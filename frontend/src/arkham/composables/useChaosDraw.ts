import { computed, readonly, ref } from 'vue'
import type { ChaosDrawStyle } from '@/arkham/chaosDrawReveal'

/* The draw in progress, shared between the update handler in Game.vue (which
 * starts it the moment a token arrives) and the skill test panel (which hides
 * the token and everything that follows from it until the draw is over).
 *
 * Module-level on purpose: there is only ever one chaos bag being drawn from,
 * and both sides have to agree on it without passing it through props. */
interface ChaosDraw {
  ids: ReadonlySet<string>
  style: Exclude<ChaosDrawStyle, 'off'>
  /* Bumped whenever the draw is (re)started, so the animation can restart. */
  run: number
}

const current = ref<ChaosDraw | null>(null)
let timer: ReturnType<typeof setTimeout> | null = null
let afterReveal: (() => void)[] = []
let runs = 0

/* Ends the draw: the tokens show, and anything held back for the reveal runs. */
export function finishChaosDraw(): void {
  if (timer !== null) clearTimeout(timer)
  timer = null
  if (current.value === null) return
  current.value = null
  const queued = afterReveal
  afterReveal = []
  for (const run of queued) run()
}

/* Starts holding these tokens back for `ms`. A token drawn while a draw is still
 * running (Rex, "reveal another") joins it rather than waiting its turn. */
export function startChaosDraw(ids: readonly string[], style: ChaosDraw['style'], ms: number): void {
  if (ids.length === 0 || ms <= 0) return
  const merged = new Set([...(current.value?.ids ?? []), ...ids])
  current.value = { ids: merged, style, run: ++runs }
  if (timer !== null) clearTimeout(timer)
  timer = setTimeout(finishChaosDraw, ms)
}

/* Runs `callback` once the tokens are shown -- now, if nothing is being drawn. */
export function afterChaosDraw(callback: () => void): void {
  if (current.value === null) callback()
  else afterReveal = [...afterReveal, callback]
}

export function useChaosDraw() {
  const draw = readonly(current)
  const isDrawing = computed(() => current.value !== null)
  const isHeldBack = (tokenId: string) => current.value?.ids.has(tokenId) ?? false
  return { draw, isDrawing, isHeldBack, finish: finishChaosDraw }
}
