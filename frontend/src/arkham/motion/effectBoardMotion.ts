/* Board motion for the effect replay (Game.vue playEffectSteps):
 *
 * - Walking: a figure that changes location during a step already glides there
 *   through the view transition (it keeps its view-transition-name). For move
 *   steps we slow that glide down and add a footstep bob, scoped to the moving
 *   figures by a short-lived stylesheet naming exactly their transition groups.
 * - Spawning: an enemy that enters play leaps out of its card. A copy of the
 *   card art jumps from the encounter deck (or the top of the board), hangs
 *   for a beat so it can be read, then dives onto the spot where the enemy now
 *   stands, which only becomes visible as the card lands.
 *
 * Both are DOM-only and never touch game state; callers decide whether motion
 * is allowed at all.
 */

const FX_PREFIX: Record<string, string> = {
  enemies: 'enemy',
  locations: 'location',
  investigators: 'investigator',
  assets: 'asset',
  treacheries: 'treachery',
}

export type MotionItem = { dict: string; id: string }

const WALK_STYLE_ID = 'effect-walk-style'
const BOB_STEPS_PER_SECOND = 3.6

function targetsOf(item: MotionItem): HTMLElement[] {
  const prefix = FX_PREFIX[item.dict]
  if (!prefix) return []
  return [...document.querySelectorAll<HTMLElement>(`[data-fx-target="${prefix}-${item.id}"]`)]
}

function firstVisible(elements: HTMLElement[]): HTMLElement | null {
  return elements.find((el) => {
    const rect = el.getBoundingClientRect()
    return rect.width > 0 && rect.height > 0
  }) ?? null
}

/* The view-transition names the moving figures carry right now (only those
 * set on the element itself; an unnamed figure just cross-fades). */
export function walkingTransitionNames(items: MotionItem[]): string[] {
  const names = new Set<string>()
  for (const item of items) {
    for (const el of targetsOf(item)) {
      const name = getComputedStyle(el).viewTransitionName
      if (name && name !== 'none') names.add(name)
    }
  }
  return [...names]
}

/* Makes the named transition groups walk for `ms`: a slower glide plus a bob.
 * Must be installed before the browser builds the transition pseudo-elements,
 * i.e. inside the view-transition update callback. Returns the cleanup. */
export function installWalkingStyle(names: string[], ms: number): () => void {
  document.getElementById(WALK_STYLE_ID)?.remove()
  if (names.length === 0) return () => {}
  const steps = Math.max(2, Math.round((ms / 1000) * BOB_STEPS_PER_SECOND))
  const groups = names.map((n) => `::view-transition-group(${CSS.escape(n)})`).join(',\n')
  const pairs = names.map((n) => `::view-transition-image-pair(${CSS.escape(n)})`).join(',\n')
  const style = document.createElement('style')
  style.id = WALK_STYLE_ID
  style.textContent = `
${groups} { animation-duration: ${ms}ms; animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); }
${pairs} { animation: effect-walk-bob ${Math.round(ms / steps)}ms ease-in-out ${steps}; }
@keyframes effect-walk-bob {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-7px) rotate(-3deg); }
  75% { transform: translateY(-7px) rotate(3deg); }
}`
  document.head.appendChild(style)
  return () => style.remove()
}

function launchRect(): DOMRect {
  const deck = firstVisible([...document.querySelectorAll<HTMLElement>('.encounter-deck')])
  if (deck) return deck.getBoundingClientRect()
  const w = 90
  return new DOMRect(window.innerWidth / 2 - w / 2, window.innerHeight * 0.18, w, w * 1.4)
}

/* An enemy leaps out of its card onto the board. Hides the landed figure until
 * the card reaches it; resolves once the flight is over (or immediately when
 * there is nothing on the board to land on). */
export async function flySpawnedCard(item: MotionItem, image: string, ms: number): Promise<void> {
  const target = firstVisible(targetsOf(item))
  if (!target || typeof target.animate !== 'function') return
  const to = target.getBoundingClientRect()
  const from = launchRect()

  const card = document.createElement('img')
  card.src = image
  card.alt = ''
  card.className = 'effect-spawn-card no-overlay'
  const width = 150
  Object.assign(card.style, {
    position: 'fixed',
    left: '0px',
    top: '0px',
    width: `${width}px`,
    zIndex: '1300',
    pointerEvents: 'none',
    borderRadius: '8px',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.7), 0 0 22px rgba(224, 83, 61, 0.55)',
    transformOrigin: '0 0',
  })
  document.body.appendChild(card)

  const height = width * 1.4
  const at = (x: number, y: number, scale: number, rotate: number) =>
    `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotate}deg)`
  const startScale = Math.max(0.3, from.width / width)
  const peakX = (from.left + from.width / 2 + to.left + to.width / 2) / 2 - width / 2
  // Hang just above the landing spot, never over the header and act/agenda row.
  const peakY = Math.max(window.innerHeight * 0.2, to.top - height * 1.1)
  const endScale = Math.max(0.15, Math.min(to.width / width, to.height / height))
  const endX = to.left + to.width / 2 - (width * endScale) / 2
  const endY = to.top + to.height / 2 - (height * endScale) / 2

  const previousVisibility = target.style.visibility
  target.style.visibility = 'hidden'
  try {
    const flight = card.animate(
      [
        { transform: at(from.left, from.top, startScale, 0), opacity: 0 },
        { transform: at(peakX, peakY, 1, -6), opacity: 1, offset: 0.3 },
        { transform: at(peakX, peakY + 6, 1, -4), opacity: 1, offset: 0.55 },
        { transform: at(endX, endY, endScale, 0), opacity: 0.85, offset: 0.92 },
        { transform: at(endX, endY, endScale, 0), opacity: 0 },
      ],
      { duration: ms, easing: 'cubic-bezier(0.3, 0, 0.3, 1)', fill: 'forwards' },
    )
    await flight.finished.catch(() => {})
  } finally {
    card.remove()
    target.style.visibility = previousVisibility
  }
}

/* ---- Scene change: turn the page ------------------------------------------
 * When the story moves to a new place, the board is a new picture, not the old
 * one with rooms added and taken away. The scene turns like a book page: the
 * old picture swings away from its left edge and the new one is underneath.
 * Only the scene itself is named for the transition; figures and other named
 * pieces are folded into it (base.css, `effect-page-turn`), so nothing glides
 * across from one picture to the other. */

const PAGE_NAME = 'effect-scene-page'
const PAGE_CLASS = 'effect-page-turn'

function scenePage(): HTMLElement | null {
  return firstVisible([...document.querySelectorAll<HTMLElement>('.map-scroll:not(.compact)')])
}

/* Call right before the view transition starts (the old picture is captured
 * then); `refresh` again inside the update once the new scene is rendered.
 * Returns the cleanup for after the transition. */
export function beginPageTurn(): { refresh: () => void; end: () => void } {
  const root = document.documentElement
  root.classList.add(PAGE_CLASS)
  const named = new Set<HTMLElement>()
  const name = () => {
    const page = scenePage()
    if (!page) return
    page.style.viewTransitionName = PAGE_NAME
    named.add(page)
  }
  name()
  return {
    refresh: name,
    end: () => {
      root.classList.remove(PAGE_CLASS)
      for (const el of named) el.style.viewTransitionName = ''
    },
  }
}
