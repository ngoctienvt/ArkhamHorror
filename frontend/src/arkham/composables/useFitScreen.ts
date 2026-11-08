import { watch, onUnmounted } from 'vue'
import { useStorage } from '@vueuse/core'

/** The class on <html> that the layout CSS (styles/fit-screen.css) keys off. */
const FIT_SCREEN_CLASS = 'fit-screen'

// Remembered across reloads: someone who wants the whole board in view wants it every game.
const fitScreen = useStorage('arkham-fit-screen', false)

function toggle(): void {
  fitScreen.value = !fitScreen.value
}

/**
 * "Fit to screen": hides the site nav, the game bar and the footer and lets the board take the
 * whole window, so agenda, map and player area are visible without scrolling.
 *
 * Call from the game view's setup: the flag is mirrored onto <html> while that view is mounted
 * and removed when it goes, so the nav is back on every other page.
 */
export function useFitScreen() {
  const root = document.documentElement
  watch(fitScreen, (on) => root.classList.toggle(FIT_SCREEN_CLASS, on), { immediate: true })
  onUnmounted(() => root.classList.remove(FIT_SCREEN_CLASS))
  return { fitScreen, toggle }
}
