import { computed, ref } from 'vue'

/* The one way the app starts a view transition.
 *
 * A document runs at most one view transition: starting a second skips the
 * first, and a skipped game transition is a board that jumps instead of moving.
 * Token pools, draggable windows and the game itself all animate this way, so
 * they share this owner. While one transition runs, any other request just
 * applies its update directly -- the state change always happens, only the
 * animation is dropped.
 *
 * `transitionActive` lets the FX layer wait: floating numbers measured while
 * the board is still a snapshot land in the wrong place.
 */

type ViewTransitionLike = { ready: Promise<void>; finished: Promise<void> }
type TransitionDocument = Document & {
  startViewTransition?: (callback: () => Promise<void> | void) => ViewTransitionLike
}

const running = ref(0)
export const transitionActive = computed(() => running.value > 0)

export type GuardedTransitionOptions = {
  /* False to apply without animating (motion off, nothing to animate...). */
  animate?: boolean
}

/* Runs `update` inside a view transition when possible, directly otherwise.
 * Resolves when the update has been applied and any animation has finished or
 * been skipped; never rejects because of the animation. */
export async function runViewTransition(
  update: () => Promise<void> | void,
  options: GuardedTransitionOptions = {},
): Promise<void> {
  const doc = document as TransitionDocument
  if (options.animate === false || running.value > 0 || typeof doc.startViewTransition !== 'function') {
    await update()
    return
  }
  running.value += 1
  try {
    const transition = doc.startViewTransition.call(document, update)
    void transition.ready.catch(() => {})
    await transition.finished.catch(() => {})
  } catch (e) {
    console.error(e)
    await update()
  } finally {
    running.value = Math.max(0, running.value - 1)
  }
}
