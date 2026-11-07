/* Immediate feedback for a choice the player just made.
 *
 * Sending an answer blanks the question straight away, so every highlight on the
 * board goes out and nothing marks what was picked until the server's update
 * arrives. This remembers the element the player last pressed and, when that
 * press turns into an answer, marks it as "sent" until the next update lands.
 *
 * Only the player's own presses count: the autopilot and other seats never go
 * through here, so the board does not flicker while automatic steps run.
 */

const PENDING_CLASS = 'choice-pending'
/* A press older than this is not what the answer came from. */
const PRESS_WINDOW_MS = 1500
/* Never leave a mark behind if the update is lost. */
const SAFETY_CLEAR_MS = 8000

/* The nearest thing that reads as "the option": a card, a location, a button. */
const OPTION_SELECTOR = [
  '[data-index]',
  '[data-fx-target]',
  '[data-investigator-mini]',
  'button',
  '.card',
].join(', ')

let pressed: { el: HTMLElement; at: number } | null = null
let marked: HTMLElement | null = null
let safety: ReturnType<typeof setTimeout> | null = null

function onPointerDown(event: PointerEvent) {
  const target = event.target instanceof Element ? event.target.closest(OPTION_SELECTOR) : null
  pressed = target instanceof HTMLElement ? { el: target, at: Date.now() } : null
}

/* Starts watching presses on the document. Returns the teardown. */
export function trackChoicePresses(): () => void {
  document.addEventListener('pointerdown', onPointerDown, { capture: true, passive: true })
  return () => document.removeEventListener('pointerdown', onPointerDown, { capture: true })
}

/* The element the player just pressed, if the press is recent and still on the page. */
export function recentPress(): HTMLElement | null {
  if (!pressed || Date.now() - pressed.at > PRESS_WINDOW_MS || !pressed.el.isConnected) return null
  return pressed.el
}

/* The same option after a re-render: a confirmation dialog opening re-renders
 * the board, so the element pressed before it may have been replaced by an
 * identical one. Found again by the attribute that names it. */
function sameOption(el: HTMLElement): HTMLElement | null {
  if (el.isConnected) return el
  for (const attr of ['data-index', 'data-fx-target', 'data-investigator-mini']) {
    const value = el.getAttribute(attr)
    if (!value) continue
    for (const candidate of document.querySelectorAll<HTMLElement>(`[${attr}="${CSS.escape(value)}"]`)) {
      const r = candidate.getBoundingClientRect()
      if (r.width || r.height) return candidate
    }
  }
  return null
}

export function markPendingChoice(pressedEl: HTMLElement | null = recentPress()) {
  clearPendingChoice()
  const el = pressedEl ? sameOption(pressedEl) : null
  if (!el) return
  el.classList.add(PENDING_CLASS)
  marked = el
  safety = setTimeout(clearPendingChoice, SAFETY_CLEAR_MS)
}

export function clearPendingChoice() {
  marked?.classList.remove(PENDING_CLASS)
  marked = null
  if (safety) clearTimeout(safety)
  safety = null
}
