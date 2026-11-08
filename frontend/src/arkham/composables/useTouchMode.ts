import { computed, effectScope } from 'vue'
import { useMediaQuery, useWindowSize } from '@vueuse/core'
import { inputModeFor, layoutClassFor } from '@/arkham/touchLayout'

function create() {
  const coarse = useMediaQuery('(pointer: coarse)')
  const canHover = useMediaQuery('(hover: hover)')
  const { width } = useWindowSize()

  const input = computed(() => inputModeFor(coarse.value, canHover.value))
  const isTouch = computed(() => input.value === 'touch')
  // iPadOS reports a coarse pointer even in "desktop site" mode, so the pointer, not the user agent, decides.
  const layout = computed(() => layoutClassFor(width.value, coarse.value))

  return { input, isTouch, layout }
}

let shared: ReturnType<typeof create> | null = null

/**
 * Whether the player is using a finger, and which size class the screen falls in. The scene map
 * puts both on its root as `data-input` / `data-layout`, so CSS and components read one answer
 * instead of each guessing from the width or the user agent. One set of listeners serves every
 * caller (each plate asks), so it is built once on first use.
 */
export function useTouchMode() {
  // A detached scope, so the listeners outlive the first component that happened to ask.
  return (shared ??= effectScope(true).run(create)!)
}
