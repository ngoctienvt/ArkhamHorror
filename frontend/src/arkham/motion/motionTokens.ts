/* One set of durations and easings for everything that moves on the board.
 *
 * The CSS side lives in styles/tokens.css (`--motion-*`, `--ease-*`) and is
 * multiplied by `--motion-scale`, which the settings store keeps in step with
 * the player's speed choice. Code that schedules timers reads the same numbers
 * from here, scaled with `scaledMs`, so a CSS animation and the timer waiting on
 * it never drift apart.
 *
 * Import-free so the node tests can load it without the Vue toolchain.
 */

export type MotionSpeed = 'normal' | 'fast' | 'off'

/* What the board is allowed to do right now.
 * - `full`: everything.
 * - `reduced`: decorative motion is off (extra animations setting); only
 *   movement that carries information -- a card or a token travelling -- is kept,
 *   and without shakes or lunges.
 * - `static`: the OS asked for reduced motion. Nothing translates or scales, but
 *   the information is still shown in place: a number that fades, a brief
 *   highlight. Someone who asked for less motion still needs to know they just
 *   lost two health.
 * - `off`: the player turned animations off. No effects at all. */
export type MotionLevel = 'full' | 'reduced' | 'static' | 'off'

export const MOTION_MS = {
  /* Hover, press, selection. */
  fast: 160,
  /* A piece of UI changing state. */
  base: 280,
  /* Something travelling between two places on the board. */
  travel: 440,
  /* How long a floating number stays readable. */
  linger: 1000,
  /* Gap between several tokens of one transfer. */
  stagger: 60,
} as const

export const EASE = {
  out: 'cubic-bezier(0.22, 1, 0.36, 1)',
  inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
  land: 'cubic-bezier(0.32, 0.72, 0, 1)',
} as const

/* Multiplier applied to every duration. `off` is never used to scale -- at that
 * level nothing is scheduled -- but a non-zero value keeps a stray CSS
 * transition from dividing by nothing. */
export const SPEED_FACTOR: Record<MotionSpeed, number> = { normal: 1, fast: 0.55, off: 0.01 }

export function isMotionSpeed(value: unknown): value is MotionSpeed {
  return value === 'normal' || value === 'fast' || value === 'off'
}

export function motionLevelOf(opts: {
  speed: MotionSpeed
  prefersReducedMotion: boolean
  extraAnimations: boolean
}): MotionLevel {
  if (opts.speed === 'off') return 'off'
  if (opts.prefersReducedMotion) return 'static'
  return opts.extraAnimations ? 'full' : 'reduced'
}

export function scaledMs(ms: number, speed: MotionSpeed): number {
  return Math.round(ms * SPEED_FACTOR[speed])
}

/* Whether a level lets things travel across the screen (cards, tokens). */
export const allowsTravel = (level: MotionLevel) => level === 'full' || level === 'reduced'
/* Whether a level allows shakes, lunges and other flourishes. */
export const allowsFlourish = (level: MotionLevel) => level === 'full'
