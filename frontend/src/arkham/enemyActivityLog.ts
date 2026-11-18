/*
 * Which enemies just moved or attacked. A hunter's move or an attack resolves inside one server
 * step, so the board only ever shows the result (the figure in a new room, a token on an
 * investigator). The log keeps the event itself: "<enemy> moves to <location>" and
 * "<enemy> attacks <target>". This reads those lines so the map can light the enemy that acted.
 *
 * Import-free on purpose, like chaosRevealLog.ts, so the node tests can load it without Vue.
 */

interface PartLike {
  tag: string
  contents?: unknown
}

interface EntryLike {
  seq: number
  body?: readonly PartLike[]
  children?: readonly EntryLike[]
}

export type EnemyActivityKind = 'move' | 'attack'

export interface EnemyActivity {
  seq: number
  enemyId: string
  kind: EnemyActivityKind
}

const KINDS: Record<string, EnemyActivityKind> = {
  'log.enemyMovesTo': 'move',
  'log.enemyAttacks': 'attack',
}

function activityOf(entry: EntryLike): EnemyActivity | null {
  const first = entry.body?.[0]
  if (first?.tag !== 'LogI18n' || !Array.isArray(first.contents)) return null
  const [key, vars] = first.contents as [string, Record<string, PartLike> | undefined]
  const kind = KINDS[key]
  if (!kind) return null
  const enemy = vars?.enemy
  if (enemy?.tag !== 'LogRefPart') return null
  const enemyId = (enemy.contents as { entityId?: string | null } | undefined)?.entityId
  return enemyId ? { seq: entry.seq, enemyId, kind } : null
}

function collect(entries: readonly EntryLike[], after: number, out: EnemyActivity[]): void {
  for (const entry of entries) {
    const activity = entry.seq > after ? activityOf(entry) : null
    if (activity) out.push(activity)
    if (entry.children?.length) collect(entry.children, after, out)
  }
}

/* Enemy moves and attacks written after log position `after`, oldest first. */
export function enemyActivityAfter(entries: readonly EntryLike[], after: number): EnemyActivity[] {
  const out: EnemyActivity[] = []
  collect(entries, after, out)
  return out
}
