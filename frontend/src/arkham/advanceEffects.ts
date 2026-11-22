/* What the engine just did to the table, one step at a time.
 *
 * Used for act / agenda advances and for everything the game resolves on its
 * own (Mythos, Enemy and Upkeep phases; enemy attacks and moves at any time).
 *
 * The engine resolves all of that inside one answer, so the client only ever
 * sees the board before and after: enemies discarded, locations put into play,
 * investigators moved, enemies attacking all land in the same frame. This module
 * turns that before/after pair into an ordered list of steps and builds the
 * intermediate boards between them, so the game view can replay them one by one
 * with an announcement for each.
 *
 * Sources: the structured log rows written since `before` (they carry the
 * sentence and the real order), and a diff of the entity dictionaries (locations
 * put into play or removed have no log line). A board change that a log line
 * describes is shown with that line. Anything the log does not mention falls
 * back to the order acts are usually printed in (discard, put into play, move,
 * remove). Hard constraints win: a location is in play before anything moves to
 * it, and leaves only after everything has moved off it.
 *
 * Import-free so the node tests can load it.
 */

export type EffectKind =
  | 'discardEnemy'
  | 'removeCard'
  | 'placeLocation'
  | 'revealLocation'
  | 'moveInvestigator'
  | 'spawnEnemy'
  | 'moveEnemy'
  | 'putIntoPlay'
  | 'removeLocation'
  /* Locations swapped for others (the story moves on to a new place): the
   * placements, the investigators moved into them and the removals as one. */
  | 'changeScene'
  /* A log sentence worth reading on its own (an attack, doom placed, ...). */
  | 'logged'

/* The entity dictionaries a step can add to, remove from or change. */
export const EFFECT_DICTS = ['enemies', 'locations', 'investigators', 'assets', 'treacheries'] as const
export type EffectDict = (typeof EFFECT_DICTS)[number]

export type EffectItem = {
  dict: EffectDict
  id: string
  cardCode: string
  /* Locations show their unrevealed side until revealed. */
  revealed: boolean
}

export type LogEntryLike = { body: any[]; children?: LogEntryLike[]; seq?: number; source?: unknown }

export type EffectStep = {
  kind: EffectKind
  items: EffectItem[]
  /* Where things went (moves, spawns), when that is a location. */
  toLocation: EffectItem | null
  /* The log entry that says what happened, rendered as the step's sentence. */
  entry: LogEntryLike | null
  /* Its i18n key without the `log.` prefix. */
  logKey: string | null
  /* Locations that leave play with a scene change. */
  removed?: EffectItem[]
  /* A run of cards discarded straight from a deck (an agenda searching the
   * encounter deck for a monster): every entry of the run, read as one step
   * instead of one announcement per card. `entry` is the first of them. */
  grouped?: LogEntryLike[]
}

/* How much to announce.
 * - advance: an act / agenda resolving -- every change on the table.
 * - phase: Mythos, Enemy, Upkeep -- every change, and the log lines below.
 * - turn: during the investigation phase the player is driving, so only what
 *   the game does by itself (enemies attacking, moving, spawning; doom). */
export type EffectScope = 'advance' | 'phase' | 'turn'

/* Log lines that are announced. */
const ANNOUNCED_KEYS = new Set([
  'enemyAttacks', 'enemyMovesTo', 'enemySpawned', 'enemySpawnedAt', 'engages', 'disengages',
  'placesDoom', 'doomOnAgenda', 'removesDoom', 'placesClues', 'removesClues',
  'discarded', 'discardedBy', 'defeated', 'defeatedBy', 'removedFromGame', 'exiled',
  'isMovedTo', 'locationRevealed', 'attachesTo',
])
/* The subset the game does on its own during a player's turn. */
const AUTOMATIC_KEYS = new Set([
  'enemyAttacks', 'enemyMovesTo', 'enemySpawned', 'enemySpawnedAt', 'placesDoom', 'doomOnAgenda',
])

type Entity = Record<string, any>
type Dict = Record<string, Entity>
type BoardLike = Record<string, any> & { log?: any[] }

const NO_LOCATION = '00000000-0000-0000-0000-000000000000'

/* Fallback position for steps the log says nothing about, relative to the
 * logged ones (which sit at 0, 1, 2, ...). */
const FALLBACK_ANCHOR: Record<EffectKind, number> = {
  discardEnemy: -6,
  removeCard: -5,
  placeLocation: -4,
  revealLocation: -3.5,
  moveInvestigator: -3,
  spawnEnemy: -2,
  moveEnemy: -1.5,
  putIntoPlay: -1,
  removeLocation: Number.MAX_SAFE_INTEGER,
  changeScene: -4,
  logged: 0,
}
const KIND_ORDER = Object.keys(FALLBACK_ANCHOR) as EffectKind[]

const dictOf = (board: BoardLike | null | undefined, dict: string): Dict => (board?.[dict] ?? {}) as Dict

const itemOf = (dict: EffectDict, e: Entity): EffectItem => ({
  dict,
  id: e.id,
  cardCode: e.cardCode ?? '',
  revealed: dict === 'locations' ? Boolean(e.revealed) : true,
})

/* The location an enemy or investigator is at, or null. */
function locationOf(dict: EffectDict, e: Entity | undefined, board: BoardLike): string | null {
  if (!e) return null
  if (dict === 'investigators') {
    const at = e.location
    return at && at !== NO_LOCATION ? at : null
  }
  const p = e.placement
  if (p?.tag === 'AtLocation') return p.contents ?? null
  if (p?.tag === 'InThreatArea') return locationOf('investigators', dictOf(board, 'investigators')[p.contents], board)
  return null
}

/* ---- Log ------------------------------------------------------------------ */

/* Entries are grouped (a phase row holds what happened in it) and an existing
 * group grows children, so newness is decided per entry by its position: the
 * top-level seq plus the child path, which the append-only log keeps stable. */
function flatten(log: any[] | undefined): { path: string; entry: LogEntryLike }[] {
  const out: { path: string; entry: LogEntryLike }[] = []
  const walk = (entry: LogEntryLike, path: string) => {
    out.push({ path, entry })
    ;(entry.children ?? []).forEach((c, i) => walk(c, `${path}.${i}`))
  }
  for (const row of log ?? []) {
    if (row?.tag === 'LogRowStructured' && row.contents) walk(row.contents, String(row.contents.seq ?? 0))
  }
  return out
}

/** The entries written since `before`, in reading order. */
export function newLogEntries(before: BoardLike | null | undefined, after: BoardLike): LogEntryLike[] {
  const seen = new Set(flatten(before?.log).map((f) => f.path))
  return flatten(after.log).filter((f) => !seen.has(f.path)).map((f) => f.entry)
}

function collectRefs(node: any, out: string[]) {
  if (!node || typeof node !== 'object') return
  if (Array.isArray(node)) {
    for (const n of node) collectRefs(n, out)
    return
  }
  if (node.tag === 'LogRefPart' && node.contents) {
    if (node.contents.entityId) out.push(node.contents.entityId)
    return
  }
  for (const v of Object.values(node)) collectRefs(v, out)
}

const refsOf = (entry: LogEntryLike): string[] => {
  const out: string[] = []
  collectRefs([entry.body, entry.source], out)
  return out
}

/** The i18n key of an entry's sentence, without `log.`. */
export function logKeyOf(entry: LogEntryLike): string | null {
  const first = entry.body?.[0]
  if (first?.tag !== 'LogI18n') return null
  const key: string = first.contents?.[0] ?? ''
  return key.startsWith('log.') ? key.slice(4) : key
}

/* First entry (index into `entries`) mentioning each entity. */
function logMentions(entries: LogEntryLike[]): Map<string, number> {
  const at = new Map<string, number>()
  entries.forEach((e, i) => { for (const id of refsOf(e)) if (!at.has(id)) at.set(id, i) })
  return at
}

/* ---- Steps -------------------------------------------------------------- */

type RawStep = EffectStep & { anchor: number; fromLocations: string[] }

function rawSteps(before: BoardLike, after: BoardLike): RawStep[] {
  const out: RawStep[] = []
  const push = (kind: EffectKind, item: EffectItem, toLocation: EffectItem | null = null, fromLocations: string[] = []) =>
    out.push({ kind, items: [item], toLocation, anchor: 0, fromLocations, entry: null, logKey: null })
  const locItem = (id: string | null): EffectItem | null => {
    const l = id ? dictOf(after, 'locations')[id] ?? dictOf(before, 'locations')[id] : null
    return l ? itemOf('locations', l) : null
  }

  for (const dict of EFFECT_DICTS) {
    const was = dictOf(before, dict)
    const now = dictOf(after, dict)
    for (const [id, e] of Object.entries(was)) {
      if (now[id]) continue
      const from = locationOf(dict, e, before)
      const kind: EffectKind | null =
        dict === 'enemies' ? 'discardEnemy'
          : dict === 'locations' ? 'removeLocation'
            : dict === 'investigators' ? null
              : 'removeCard'
      if (kind) push(kind, itemOf(dict, e), null, from ? [from] : [])
    }
    for (const [id, e] of Object.entries(now)) {
      const old = was[id]
      if (!old) {
        if (dict === 'locations') push('placeLocation', itemOf(dict, e))
        else if (dict === 'enemies') push('spawnEnemy', itemOf(dict, e), locItem(locationOf(dict, e, after)))
        else if (dict !== 'investigators') push('putIntoPlay', itemOf(dict, e))
        continue
      }
      if (dict === 'locations' && !old.revealed && e.revealed) push('revealLocation', itemOf(dict, e))
      if (dict === 'investigators' || dict === 'enemies') {
        const from = locationOf(dict, old, before)
        const to = locationOf(dict, e, after)
        if (to && from !== to) {
          push(dict === 'investigators' ? 'moveInvestigator' : 'moveEnemy', itemOf(dict, e), locItem(to), from ? [from] : [])
        }
      }
    }
  }
  return out
}

/* Anchors from the log, then the two placement constraints. An enemy whose
 * spawn has its own sentence appears with that sentence (see `spawnFirst`). */
function anchorSteps(steps: RawStep[], mentions: Map<string, number>, spawnAnchors: Map<string, number>) {
  for (const s of steps) {
    const spawnedAt = s.kind === 'spawnEnemy' ? spawnAnchors.get(s.items[0].id) : undefined
    const logged = s.items.map((i) => mentions.get(i.id)).filter((n): n is number => n !== undefined)
    s.anchor = spawnedAt ?? (logged.length ? Math.min(...logged) : FALLBACK_ANCHOR[s.kind])
  }
  // A location is in play (and revealed) before anything goes to it.
  for (const s of steps) {
    if (s.kind !== 'placeLocation' && s.kind !== 'revealLocation') continue
    const id = s.items[0].id
    const users = steps.filter((o) => o.toLocation?.id === id).map((o) => o.anchor)
    const bump = s.kind === 'placeLocation' ? 0.5 : 0.25
    if (users.length) s.anchor = Math.min(s.anchor, Math.min(...users) - bump)
  }
  // A location leaves only after everything has moved off it.
  for (const s of steps) {
    if (s.kind !== 'removeLocation') continue
    const id = s.items[0].id
    const leaving = steps.filter((o) => o !== s && o.fromLocations.includes(id)).map((o) => o.anchor)
    if (leaving.length) s.anchor = Math.max(s.anchor, Math.max(...leaving) + 0.5)
  }
}

/* Entities a sentence talks about, as items to show and highlight. */
function itemsOf(entry: LogEntryLike, before: BoardLike, after: BoardLike): EffectItem[] {
  const out: EffectItem[] = []
  for (const id of new Set(refsOf(entry))) {
    for (const dict of EFFECT_DICTS) {
      const e = dictOf(after, dict)[id] ?? dictOf(before, dict)[id]
      if (e) {
        out.push(itemOf(dict, e))
        break
      }
    }
  }
  return out
}

/* A board change that the log sentence at the same position already describes
 * rides on that sentence: one announcement, with the board moving under it. */
function absorbIntoLog(board: RawStep[], logged: RawStep[]): RawStep[] {
  const rest: RawStep[] = []
  for (const s of board) {
    const host = logged.find((l) => l.kind === 'logged' && l.anchor === s.anchor
      && s.items.every((i) => l.items.some((x) => x.id === i.id)))
    if (host) {
      host.kind = s.kind
      host.toLocation = s.toLocation
      host.fromLocations = s.fromLocations
      host.items = [...s.items, ...host.items.filter((x) => !s.items.some((i) => i.id === x.id))]
    } else {
      rest.push(s)
    }
  }
  return [...rest, ...logged]
}

/* When locations both enter and leave play, the table is moving to a new place.
 * Showing that piece by piece puts the old room into the new picture only to
 * take it away again, so the placements, the removals and the investigators
 * walking into the new locations become one scene change, at the point the
 * first new location was put into play. */
function collapseSceneChange(input: RawStep[]): RawStep[] {
  // A placement that rode on a reveal sentence splits back in two: the
  // placement joins the scene, the sentence stays to flip the card after it.
  const sorted = input.flatMap((s): RawStep[] => s.kind === 'placeLocation' && s.logKey === 'locationRevealed'
    ? [{ ...s, entry: null, logKey: null, items: s.items.filter((i) => i.dict === 'locations').slice(0, 1) }, { ...s, kind: 'logged' }]
    : [s])
  const placed = new Set(sorted.filter((s) => s.kind === 'placeLocation').flatMap((s) => s.items.map((i) => i.id)))
  if (placed.size === 0 || !sorted.some((s) => s.kind === 'removeLocation')) return sorted
  const partOfScene = (s: RawStep) => s.kind === 'placeLocation' || s.kind === 'removeLocation'
    || (s.kind === 'moveInvestigator' && placed.has(s.toLocation?.id ?? ''))
  const at = sorted.findIndex(partOfScene)
  const parts = sorted.filter(partOfScene)
  const scene: RawStep = {
    kind: 'changeScene',
    items: parts.filter((s) => s.kind !== 'removeLocation').flatMap((s) => s.items),
    removed: parts.filter((s) => s.kind === 'removeLocation').flatMap((s) => s.items),
    toLocation: null,
    entry: null,
    logKey: null,
    anchor: sorted[at].anchor,
    fromLocations: [],
  }
  // A new location can only be revealed once the new scene is on the table.
  const revealsNew = (s: RawStep) => (s.kind === 'revealLocation' || s.logKey === 'locationRevealed')
    && s.items.some((i) => placed.has(i.id))
  const early = sorted.slice(0, at).filter(revealsNew)
  const rest = sorted.filter((s) => !partOfScene(s) && !early.includes(s))
  rest.splice(at - early.length, 0, scene, ...early)
  return rest
}

/* Consecutive board steps of one kind (and, for moves, one destination) read
 * as one. A step with its own sentence is never merged. */
function mergeSteps(sorted: RawStep[]): EffectStep[] {
  const out: EffectStep[] = []
  for (const s of sorted) {
    const last = out[out.length - 1]
    if (last && !last.entry && !s.entry && last.kind === s.kind && last.toLocation?.id === s.toLocation?.id) {
      last.items.push(...s.items)
    } else {
      const step: EffectStep = { kind: s.kind, items: [...s.items], toLocation: s.toLocation, entry: s.entry, logKey: s.logKey }
      if (s.removed) step.removed = [...s.removed]
      out.push(step)
    }
  }
  return out
}

const SPAWN_KEYS = new Set(['enemySpawned', 'enemySpawnedAt'])

/* The engine logs a drawn enemy engaging before it logs the spawn. Read in that
 * order, the enemy appeared on the "engages" line and then appeared again on the
 * spawn line. The spawn sentence moves up to just before the enemy's first
 * mention, and the enemy enters the board with it -- once. Returns where each
 * spawned enemy now appears. */
function spawnFirst(logged: RawStep[], mentions: Map<string, number>): Map<string, number> {
  const anchors = new Map<string, number>()
  for (const l of logged) {
    if (!SPAWN_KEYS.has(l.logKey ?? '')) continue
    const enemies = l.items.filter((i) => i.dict === 'enemies')
    const first = Math.min(l.anchor, ...enemies.map((i) => mentions.get(i.id) ?? l.anchor))
    if (first < l.anchor) l.anchor = first - 0.5
    for (const i of enemies) if (!anchors.has(i.id)) anchors.set(i.id, l.anchor)
  }
  return anchors
}

const DISCARD_KEYS = new Set(['discarded', 'discardedBy'])
const argsOf = (entry: LogEntryLike | null): Record<string, any> | null => {
  const first = entry?.body?.[0]
  return first?.tag === 'LogI18n' ? first.contents?.[1] ?? null : null
}

/* A discard of a card that was never on the table: its ref names a card but no
 * entity in play. */
function isDeckDiscard(step: EffectStep): boolean {
  if (step.kind !== 'logged' || !DISCARD_KEYS.has(step.logKey ?? '')) return false
  const card = argsOf(step.entry)?.card?.contents
  return Boolean(card) && !card.entityId
}

/** Card codes of the cards a discard step names, in order. */
export function discardedCardCodes(step: EffectStep): string[] {
  return (step.grouped ?? (step.entry ? [step.entry] : []))
    .map((e) => argsOf(e)?.card?.contents?.cardCode)
    .filter((code): code is string => typeof code === 'string')
}

/** Card code of what caused a discard step, when the log names one. */
export function discardSourceCode(step: EffectStep): string | null {
  const code = argsOf(step.entry)?.source?.contents?.cardCode
  return typeof code === 'string' ? code : null
}

/* Consecutive deck discards become one step: sixteen encounter cards turned
 * over in search of a monster read as one discard, not sixteen. */
function groupDeckDiscards(steps: EffectStep[]): EffectStep[] {
  const out: EffectStep[] = []
  for (const s of steps) {
    const last = out[out.length - 1]
    if (last && isDeckDiscard(last) && isDeckDiscard(s) && last.logKey === s.logKey) {
      last.grouped = [...(last.grouped ?? [last.entry as LogEntryLike]), s.entry as LogEntryLike]
    } else {
      out.push(s)
    }
  }
  return out
}

/** What changed between two boards, in the order it should be replayed. */
export function advanceEffectSteps(
  before: BoardLike | null | undefined,
  after: BoardLike | null | undefined,
  scope: EffectScope = 'advance',
): EffectStep[] {
  if (!before || !after) return []
  const entries = newLogEntries(before, after)
  const board = scope === 'turn' ? [] : rawSteps(before, after)
  const keys = scope === 'turn' ? AUTOMATIC_KEYS : ANNOUNCED_KEYS
  const logged: RawStep[] = []
  entries.forEach((entry, i) => {
    const logKey = logKeyOf(entry)
    if (!logKey || !keys.has(logKey)) return
    logged.push({ kind: 'logged', items: itemsOf(entry, before, after), toLocation: null, anchor: i, fromLocations: [], entry, logKey })
  })
  if (board.length === 0 && logged.length === 0) return []
  const mentions = logMentions(entries)
  anchorSteps(board, mentions, spawnFirst(logged, mentions))
  const sorted = absorbIntoLog(board, logged)
    .map((s, i) => ({ s, i }))
    .sort((a, b) => a.s.anchor - b.s.anchor || KIND_ORDER.indexOf(a.s.kind) - KIND_ORDER.indexOf(b.s.kind) || a.i - b.i)
    .map(({ s }) => s)
  return groupDeckDiscards(mergeSteps(collapseSceneChange(sorted)))
}

/** Which scope an update falls in, from the phase the board was and is in. */
export function effectScopeFor(before: BoardLike, after: BoardLike): EffectScope {
  const quiet = (b: BoardLike) => b.phase === 'InvestigationPhase' || b.phase === 'CampaignPhase'
  return quiet(before) && quiet(after) ? 'turn' : 'phase'
}

/* ---- Intermediate boards ------------------------------------------------ */

const keyOf = (dict: string, id: string) => `${dict}|${id}`

/* Which entities have taken their `after` shape once `count` steps are applied.
 * Removing a location also settles everything still pointing at it, and
 * settling something brings in any new entity it points at, so no intermediate
 * board references an entity that is not on it. */
function settledKeys(before: BoardLike, after: BoardLike, steps: EffectStep[], count: number): Set<string> {
  const settled = new Set<string>()
  for (const step of steps.slice(0, count)) {
    for (const i of step.items) {
      // A sentence that only names something changes nothing by itself, except
      // an attack: the damage it deals shows on the investigator right then.
      const attacked = step.logKey === 'enemyAttacks' && i.dict === 'investigators'
      if (step.kind !== 'logged' || attacked) settled.add(keyOf(i.dict, i.id))
    }
    for (const i of step.removed ?? []) settled.add(keyOf(i.dict, i.id))
  }
  const removed = steps.slice(0, count)
    .flatMap((s) => [...(s.kind === 'removeLocation' ? s.items : []), ...(s.removed ?? [])])
    .filter((i) => i.dict === 'locations')
    .map((i) => i.id)
  if (removed.length) {
    for (const dict of EFFECT_DICTS) {
      for (const [id, e] of Object.entries(dictOf(before, dict))) {
        if (settled.has(keyOf(dict, id))) continue
        const json = JSON.stringify(e)
        if (removed.some((l) => json.includes(l))) settled.add(keyOf(dict, id))
      }
    }
  }
  const additions = EFFECT_DICTS.flatMap((dict) =>
    Object.keys(dictOf(after, dict)).filter((id) => !dictOf(before, dict)[id]).map((id) => ({ dict, id })))
  let grew = true
  while (grew) {
    grew = false
    const settledJson = [...settled].map((k) => {
      const [dict, id] = k.split('|')
      return JSON.stringify(dictOf(after, dict)[id] ?? '')
    }).join('\n')
    for (const { dict, id } of additions) {
      if (settled.has(keyOf(dict, id)) || !settledJson.includes(id)) continue
      settled.add(keyOf(dict, id))
      grew = true
    }
  }
  return settled
}

/** The board once the first `count` steps have happened. Everything a step did
 * not touch keeps its `before` shape; the caller applies `after` itself at the end. */
export function stagedBoard<T extends BoardLike>(before: T, after: T, steps: EffectStep[], count: number): T {
  const settled = settledKeys(before, after, steps, count)
  const version = new Map<string, 'before' | 'after'>()
  const staged: Record<string, Dict> = {}

  for (const dict of EFFECT_DICTS) {
    const was = dictOf(before, dict)
    const now = dictOf(after, dict)
    const out: Dict = {}
    for (const id of new Set([...Object.keys(was), ...Object.keys(now)])) {
      const useAfter = settled.has(keyOf(dict, id))
      const e = useAfter ? now[id] : was[id]
      if (!e) continue
      out[id] = e
      version.set(id, useAfter ? 'after' : 'before')
    }
    staged[dict] = out
  }

  const known = new Set<string>()
  for (const dict of EFFECT_DICTS) {
    for (const id of Object.keys(dictOf(before, dict))) known.add(id)
    for (const id of Object.keys(dictOf(after, dict))) known.add(id)
  }

  /* Each child decides which container it is in: one still in its `before`
   * shape stays where `before` listed it, one in its `after` shape is where
   * `after` lists it. Ids that are not entities here are kept as listed. */
  const listed = (list: unknown, v: string) => Array.isArray(list) && list.includes(v)
  const mentionsKnown = (list: unknown) => Array.isArray(list) && list.some((v) => known.has(v))
  const reconcile = (dict: EffectDict, id: string, e: Entity): Entity => {
    const was = dictOf(before, dict)[id] ?? {}
    const now = dictOf(after, dict)[id] ?? {}
    const own = version.get(id) === 'after' ? now : was
    let copy: Entity | null = null
    for (const [field, value] of Object.entries(e)) {
      if (!Array.isArray(value) || !value.every((v) => typeof v === 'string')) continue
      if (!mentionsKnown(value) && !mentionsKnown(was[field]) && !mentionsKnown(now[field])) continue
      const candidates = [...new Set<string>([...(now[field] ?? []), ...(was[field] ?? [])])]
      const next = candidates.filter((c) => {
        if (!known.has(c)) return listed(own[field], c)
        const v = version.get(c)
        if (!v) return false
        return v === 'after' ? listed(now[field], c) : listed(was[field], c)
      })
      copy = copy ?? { ...e }
      copy[field] = next
    }
    return copy ?? e
  }

  const result: BoardLike = { ...after }
  for (const dict of EFFECT_DICTS) {
    const out: Dict = {}
    for (const [id, e] of Object.entries(staged[dict])) out[id] = reconcile(dict, id, e)
    result[dict] = out
  }
  return result as T
}
