/*
 * The beat before a chaos token is shown: at the table you rummage in the bag,
 * online the server answers instantly. These are the pure rules behind the
 * client-side pause -- which tokens are new, how long the pause lasts, what the
 * reel spins through, and which sounds have to wait for the reveal.
 *
 * Import-free on purpose (it reads a structural slice of the game) so the node
 * tests can load it without the Vue toolchain, like sfxEvents.ts.
 */

/* 'bag': the bag shakes and a face-down token comes out and flips.
 * 'reel': the faces in the bag spin past and slow down onto the drawn one.
 * 'off': the token appears straight away, as before. */
export type ChaosDrawStyle = 'bag' | 'reel' | 'off'
export const CHAOS_DRAW_STYLES: readonly ChaosDrawStyle[] = ['bag', 'reel', 'off']
export const DEFAULT_CHAOS_DRAW_STYLE: ChaosDrawStyle = 'bag'

export function isChaosDrawStyle(value: unknown): value is ChaosDrawStyle {
  return CHAOS_DRAW_STYLES.includes(value as ChaosDrawStyle)
}

interface DrawSlice {
  skillTest?: { id?: string } | null
  skillTestChaosTokens?: readonly { id: string }[]
}

/* Tokens revealed into the running skill test by this update. The first state a
 * client sees is never compared, so loading or reloading a game mid-test shows
 * the tokens already on the table without replaying the draw. */
export function newlyDrawnTokenIds(previous: DrawSlice | null | undefined, next: DrawSlice): string[] {
  if (!previous || !next.skillTest) return []
  const before = new Set((previous.skillTestChaosTokens ?? []).map((token) => token.id))
  return (next.skillTestChaosTokens ?? []).map((token) => token.id).filter((id) => !before.has(id))
}

/* How long the pause holds the result back. Several tokens drawn together share
 * one rummage; each extra one adds a short beat, capped so a Rex-style
 * "reveal three" never turns into a wait. */
const BASE_MS: Record<Exclude<ChaosDrawStyle, 'off'>, number> = { bag: 1400, reel: 1800 }
const EXTRA_TOKEN_MS = 350
const MAX_EXTRA_TOKENS = 3

export function drawDurationMs(style: ChaosDrawStyle, tokenCount: number): number {
  if (style === 'off' || tokenCount <= 0) return 0
  const extra = Math.min(Math.max(tokenCount - 1, 0), MAX_EXTRA_TOKENS)
  return BASE_MS[style] + extra * EXTRA_TOKEN_MS
}

/* The faces a reel spins through, ending on the face actually drawn. Picks from
 * what is in the bag, so the spin also shows the odds you were up against, and
 * never repeats a face twice in a row when the bag offers any choice. */
export function reelStrip(
  bagFaces: readonly string[],
  finalFace: string,
  length: number,
  random: () => number = Math.random,
): string[] {
  const pool = bagFaces.length > 0 ? bagFaces : [finalFace]
  const strip: string[] = []
  for (let i = 0; i < Math.max(length - 1, 0); i++) {
    const previous = strip[strip.length - 1]
    const options = pool.filter((face) => face !== previous)
    const from = options.length > 0 ? options : pool
    strip.push(from[Math.min(Math.floor(random() * from.length), from.length - 1)])
  }
  // The face before the stop should not be the stop itself, or the reel looks stuck.
  if (strip.length > 0 && strip[strip.length - 1] === finalFace) {
    const other = pool.find((face) => face !== finalFace)
    if (other !== undefined) strip[strip.length - 1] = other
  }
  strip.push(finalFace)
  return strip
}

/* Sounds that would give the result away before the token is shown. */
const SPOILER_SFX = new Set(['token', 'success', 'fail'])

export function splitSpoilerSfx<T extends string>(names: readonly T[]): { now: T[]; afterReveal: T[] } {
  return {
    now: names.filter((name) => !SPOILER_SFX.has(name)),
    afterReveal: names.filter((name) => SPOILER_SFX.has(name)),
  }
}
