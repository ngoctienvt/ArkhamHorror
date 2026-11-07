import { computed, ref } from 'vue'

/* True while the FX layer is playing something, or has effects it is still
 * waiting to play. Shared on purpose: the layer lives inside the scenario, the
 * autopilot in the game view, and the autopilot must not answer the next prompt
 * over an animation the player is still reading -- nor in the gap between an
 * update landing and its effects starting (the board is mid view transition,
 * or covered by an overlay). */
const running = ref(0)
const deferred = ref(false)

export const fxBusy = computed(() => running.value > 0 || deferred.value)

export function holdFxBusy(ms: number) {
  running.value += 1
  setTimeout(() => {
    running.value = Math.max(0, running.value - 1)
  }, ms)
}

/* Set when the FX layer has seen an update whose effects it has not played yet;
 * cleared in the same synchronous call that starts playing them (or finds there
 * is nothing to play), so the autopilot is never let through in between. */
export function setFxDeferred(value: boolean) {
  deferred.value = value
}
