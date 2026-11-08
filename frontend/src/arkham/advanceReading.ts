/* Which acts and agendas advanced between two game states.
 *
 * The engine advances an act or agenda inside one state update, so the client
 * only sees "before" and "after". A moment this important is shown in a reading
 * box that waits for the players to accept it (AdvanceReader.vue), instead of
 * flashing past on the board.
 *
 * Only a real step forward counts: the same deck, a higher act number / agenda
 * step. A new scenario (different decks), an undo (lower stage) or a reload
 * (no earlier state) never opens the box. Import-free so the node tests can
 * load it without the Vue toolchain.
 */

export type AdvanceKind = 'act' | 'agenda'
export type ReadingStep = 'back' | 'next'

export type AdvanceReading = {
  /* Stable per transition, so the same one is never queued twice. */
  key: string
  kind: AdvanceKind
  /* Card codes as the engine names them (`c01108`). `toCode` is the card that
   * replaces it; a flip has none yet. */
  fromCode: string
  toCode: string | null
  /* What to read, in order: the back of the finished card, then the next card. */
  steps: ReadingStep[]
}

type Step = {
  id: string
  deckId: number
  flipped?: boolean
  sequence: { number?: number; step?: number; side?: string }
}
type BoardLike = {
  acts?: Record<string, Step>
  agendas?: Record<string, Step>
}

const stageOf = (s: Step): number => s.sequence.number ?? s.sequence.step ?? 0

/* The engine turns an act or agenda over BEFORE it resolves the back (that is
 * when it asks "find the Bystander...", spawns things, and so on) and only then
 * puts the next card in play. The back has to be read at the turn-over, or the
 * player is asked to act on text they have not seen. */
const FRONT_SIDES = new Set(['A', 'C', 'E', 'G'])
const isFlipped = (kind: AdvanceKind, s: Step): boolean =>
  kind === 'agenda' ? Boolean(s.flipped) : !FRONT_SIDES.has((s.sequence.side ?? 'A').toUpperCase())

function flipsOf(
  kind: AdvanceKind,
  before: Record<string, Step> | undefined,
  after: Record<string, Step> | undefined,
): AdvanceReading[] {
  const out: AdvanceReading[] = []
  for (const now of Object.values(after ?? {})) {
    const was = before?.[now.id]
    if (was && !isFlipped(kind, was) && isFlipped(kind, now)) {
      out.push({ key: `flip:${kind}:${now.id}`, kind, fromCode: now.id, toCode: null, steps: ['back'] })
    }
  }
  return out
}

function advancesOf(
  kind: AdvanceKind,
  before: Record<string, Step> | undefined,
  after: Record<string, Step> | undefined,
  alreadyRead: ReadonlySet<string>,
): AdvanceReading[] {
  const previous = Object.values(before ?? {})
  const out: AdvanceReading[] = []
  for (const now of Object.values(after ?? {})) {
    if (previous.some((p) => p.id === now.id)) continue
    const from = previous.find((p) => p.deckId === now.deckId && stageOf(p) < stageOf(now))
    if (from) {
      out.push({
        key: `${kind}:${from.id}>${now.id}`,
        kind,
        fromCode: from.id,
        toCode: now.id,
        // The back was already read when the card turned over.
        steps: alreadyRead.has(from.id) ? ['next'] : ['back', 'next'],
      })
    }
  }
  return out
}

/* `alreadyRead`: cards whose back was shown at the turn-over. */
export function advancesBetween(
  before: BoardLike | null | undefined,
  after: BoardLike | null | undefined,
  alreadyRead: ReadonlySet<string> = new Set(),
): AdvanceReading[] {
  if (!before || !after) return []
  return [
    ...flipsOf('act', before.acts, after.acts),
    ...flipsOf('agenda', before.agendas, after.agendas),
    ...advancesOf('act', before.acts, after.acts, alreadyRead),
    ...advancesOf('agenda', before.agendas, after.agendas, alreadyRead),
  ]
}
