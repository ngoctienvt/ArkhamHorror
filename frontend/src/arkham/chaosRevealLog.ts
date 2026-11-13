/*
 * A chaos token drawn outside a skill test (an act's Forced ability, a scenario effect) is
 * revealed and put away inside one server step, so no game state ever shows it on the table.
 * The only trace is the log line "<investigator> reveals <tokens>". This reads those lines so the
 * client can put the draw on screen itself.
 *
 * Import-free on purpose, like sfxEvents.ts, so the node tests can load it without Vue.
 */

interface PartLike {
  tag: string
  contents?: unknown
}

interface EntryLike {
  seq: number
  body?: readonly PartLike[]
  children?: readonly EntryLike[]
  group?: { id: string } | null
}

export interface ChaosReveal {
  seq: number
  investigator: string
  faces: string[]
}

const DRAW_KEY = 'log.drawsChaosTokens'

function drawOf(entry: EntryLike): ChaosReveal | null {
  const first = entry.body?.[0]
  if (first?.tag !== 'LogI18n' || !Array.isArray(first.contents)) return null
  const [key, vars] = first.contents as [string, Record<string, PartLike> | undefined]
  if (key !== DRAW_KEY) return null
  const list = vars?.tokens
  const parts = list?.tag === 'LogList' ? (list.contents as PartLike[]) : list ? [list] : []
  const faces = parts.filter((part) => part.tag === 'LogToken').map((part) => part.contents as string)
  if (faces.length === 0) return null
  const who = vars?.investigator
  const name = who?.tag === 'LogRefPart' ? ((who.contents as { name?: string }).name ?? '') : ''
  return { seq: entry.seq, investigator: name, faces }
}

function collect(entries: readonly EntryLike[], after: number, out: ChaosReveal[]): void {
  for (const entry of entries) {
    // A skill test shows its own tokens, with the draw animation.
    if (!entry.group?.id.includes('skillTest:')) {
      const draw = entry.seq > after ? drawOf(entry) : null
      if (draw) out.push(draw)
    }
    if (entry.children?.length) collect(entry.children, after, out)
  }
}

/* The reveals outside a skill test written after log position `after`, oldest first. */
export function revealsAfter(entries: readonly EntryLike[], after: number): ChaosReveal[] {
  const out: ChaosReveal[] = []
  collect(entries, after, out)
  return out
}

export function lastSeq(entries: readonly EntryLike[]): number {
  return entries.reduce((max, entry) => Math.max(max, entry.seq), 0)
}
