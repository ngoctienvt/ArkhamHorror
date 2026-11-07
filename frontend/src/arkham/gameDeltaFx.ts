/* What just changed on the board, as a list of things worth showing.
 *
 * The engine resolves an enemy attack, a treachery or a doom placement in one
 * state update, so the client only ever sees "before" and "after". This turns
 * two snapshots into events (damage taken, doom placed, enemy lunging, a clue
 * going from a location to the investigator who found it) that the FX layer
 * animates. Import-free so the node tests can load it without the Vue
 * toolchain; tokens are matched by the plain names the backend sends.
 *
 * Events are timed in beats, so one busy update reads in order:
 *   transfers (tokens travelling) -> attack lunge -> hits -> marks (doom, uses,
 *   clues and resources that appeared or vanished with no partner).
 * Each beat starts a little before the previous one ends so the sequence feels
 * continuous rather than stop-and-go.
 */

export type FxKind =
  | 'damage'
  | 'horror'
  | 'enemyDamage'
  | 'enemyDefeated'
  | 'doom'
  | 'clue'
  | 'resource'
  | 'uses'
  | 'attack'
  | 'transfer'

export type FxToken = 'clue' | 'resource'

export type FxEvent = {
  kind: FxKind
  /* Anchor key, `<entity>-<id>`, matched against `data-fx-target`. For a
   * transfer this is where the tokens leave from. */
  anchor: string
  /* Signed change; positive is "more of it on the card". Zero for attack/defeat.
   * For a transfer, the number of tokens moved. */
  amount: number
  /* For `attack`: the anchor the enemy lunges toward. For `transfer`: where the
   * tokens land. */
  toward?: string
  /* For `transfer`: which token travels. */
  token?: FxToken
  /* Staggers the effects of one update so they read in order. */
  delayMs: number
}

type ClueHolder = { clues: number }

export type FxSnapshot = {
  investigators: Record<
    string,
    { damage: number; horror: number; clues: number; resources: number; locationId?: string | null }
  >
  enemies: Record<string, { damage: number; exhausted: boolean; engagedWith: string | null }>
  agendas: Record<string, number>
  /* Optional so older callers (and tests) that only care about combat still work. */
  locations?: Record<string, ClueHolder>
  acts?: Record<string, ClueHolder>
  /* Doom on anything that is not an agenda, keyed by anchor (`enemy-x`, `location-y`, `asset-z`). */
  doom?: Record<string, number>
  /* Uses (ammo, charges, secrets, supplies...) left on each asset. */
  uses?: Record<string, number>
  /* Where each tracked card is: `hand:<iid>`, `discard:<iid>`, `asset:<placement>`... */
  cards?: Record<string, string>
}

/* Beats of one update, in ms at normal speed. The FX layer scales them with the
 * player's speed setting. `travelMs` matches `--motion-travel`. */
export const FX_TIMINGS = {
  lungeMs: 450,
  hitDelayMs: 300,
  floaterMs: 1000,
  gapMs: 120,
  travelMs: 440,
  staggerMs: 60,
  /* A beat starts when the previous one is this far through. */
  overlap: 0.7,
}

type TokenBag = Record<string, number | undefined> | undefined
type Placed = { cardId?: string; placement?: unknown; tokens?: TokenBag }
type CardLike = { tag?: string; id?: string; contents?: unknown }
type GameLike = {
  investigators: Record<
    string,
    {
      tokens?: TokenBag
      assignedHealthDamage?: number
      assignedSanityDamage?: number
      placement?: { tag: string; contents?: unknown }
      hand?: CardLike[]
      discard?: { id: string }[]
      deck?: { id: string }[]
    }
  >
  enemies: Record<string, { tokens?: TokenBag; assignedDamage?: number; exhausted?: boolean; placement?: { tag: string; contents?: unknown } }>
  agendas: Record<string, { doom?: number }>
  locations?: Record<string, { tokens?: TokenBag }>
  acts?: Record<string, { tokens?: TokenBag }>
  assets?: Record<string, Placed>
  events?: Record<string, Placed>
  skills?: Record<string, Placed>
  treacheries?: Record<string, Placed>
  scenario?: { discard?: { id: string }[] } | null
}

/* Tokens on an asset that are not uses. */
const NOT_USES = new Set(['Damage', 'Horror', 'Doom', 'Clue'])

const sumUses = (tokens: TokenBag) =>
  Object.entries(tokens ?? {}).reduce((n, [k, v]) => (NOT_USES.has(k) ? n : n + (v ?? 0)), 0)

/* A card's id whatever wrapper it comes in (PlayerCard, EncounterCard,
 * VengeanceCard, bare contents). Mirrors `toCardContents` in types/Card.ts. */
function cardIdOf(card: CardLike | undefined): string | undefined {
  if (!card) return undefined
  if (typeof card.id === 'string') return card.id
  return cardIdOf(card.contents as CardLike | undefined)
}

export function snapshotOf(game: GameLike): FxSnapshot {
  const investigators: FxSnapshot['investigators'] = {}
  const cards: Record<string, string> = {}
  for (const [id, i] of Object.entries(game.investigators)) {
    investigators[id] = {
      damage: (i.tokens?.Damage ?? 0) + (i.assignedHealthDamage ?? 0),
      horror: (i.tokens?.Horror ?? 0) + (i.assignedSanityDamage ?? 0),
      clues: i.tokens?.Clue ?? 0,
      resources: i.tokens?.Resource ?? 0,
      locationId: i.placement?.tag === 'AtLocation' ? String(i.placement.contents) : null,
    }
    for (const c of i.hand ?? []) {
      const cid = cardIdOf(c)
      if (cid) cards[cid] = `hand:${id}`
    }
    for (const c of i.discard ?? []) cards[c.id] = `discard:${id}`
    // The deck is face down, but it is still a place on the table: a drawn card
    // flies out of it, a shuffled-back discard flies into it.
    for (const c of i.deck ?? []) cards[c.id] = `deck:${id}`
  }
  const enemies: FxSnapshot['enemies'] = {}
  const doom: Record<string, number> = {}
  for (const [id, e] of Object.entries(game.enemies)) {
    enemies[id] = {
      damage: (e.tokens?.Damage ?? 0) + (e.assignedDamage ?? 0),
      exhausted: Boolean(e.exhausted),
      engagedWith: e.placement?.tag === 'InThreatArea' ? String(e.placement.contents) : null,
    }
    doom[`enemy-${id}`] = e.tokens?.Doom ?? 0
  }
  const agendas: FxSnapshot['agendas'] = {}
  for (const [id, a] of Object.entries(game.agendas)) agendas[id] = a.doom ?? 0

  const locations: Record<string, ClueHolder> = {}
  for (const [id, l] of Object.entries(game.locations ?? {})) {
    locations[id] = { clues: l.tokens?.Clue ?? 0 }
    doom[`location-${id}`] = l.tokens?.Doom ?? 0
  }
  const acts: Record<string, ClueHolder> = {}
  for (const [id, a] of Object.entries(game.acts ?? {})) acts[id] = { clues: a.tokens?.Clue ?? 0 }

  const uses: Record<string, number> = {}
  for (const [id, a] of Object.entries(game.assets ?? {})) {
    doom[`asset-${id}`] = a.tokens?.Doom ?? 0
    uses[id] = sumUses(a.tokens)
    if (a.cardId) cards[a.cardId] = `asset:${JSON.stringify(a.placement ?? null)}`
  }
  for (const [kind, record] of [
    ['event', game.events],
    ['skill', game.skills],
    ['treachery', game.treacheries],
  ] as const) {
    for (const e of Object.values(record ?? {})) {
      if (e.cardId) cards[e.cardId] = `${kind}:${JSON.stringify(e.placement ?? null)}`
    }
  }
  for (const c of game.scenario?.discard ?? []) cards[c.id] = 'encounterDiscard'

  return { investigators, enemies, agendas, locations, acts, doom, uses, cards }
}

/* Cards that were on the table before and are somewhere else on the table now:
 * drawn from the deck, played from hand, discarded, attached, moved into a
 * threat area. A card that left for a zone this does not track (removed from
 * game, the encounter deck) or came out of one has no on-screen start or end,
 * so it is not a move. Enemies and locations are left
 * out on purpose: their own movement transition already carries them. */
export function cardMoves(prev: FxSnapshot, next: FxSnapshot): string[] {
  const before = prev.cards ?? {}
  const after = next.cards ?? {}
  return Object.entries(after)
    .filter(([id, zone]) => before[id] !== undefined && before[id] !== zone)
    .map(([id]) => id)
}

type Change = { anchor: string; amount: number; used?: boolean }

/* Pairs token losses with token gains into transfers. A transfer is only
 * claimed when it is unambiguous; anything else stays a separate change and is
 * shown as a floating number, which is honest about not knowing the source. */
function pairTransfers(
  losers: Change[],
  gainers: Change[],
  prefer: (loser: Change) => Change[],
): { from: string; to: string; amount: number }[] {
  const out: { from: string; to: string; amount: number }[] = []
  // A loser whose own candidates (e.g. investigators standing on the location
  // that lost the clue) contain exactly one gain of the same size.
  for (const l of losers) {
    const candidates = prefer(l).filter((g) => !g.used)
    if (candidates.length === 1 && candidates[0].amount === l.amount) {
      out.push({ from: l.anchor, to: candidates[0].anchor, amount: l.amount })
      l.used = true
      candidates[0].used = true
    }
  }
  // Exactly one loss and one gain of the same size left anywhere on the board.
  const ls = losers.filter((l) => !l.used)
  const gs = gainers.filter((g) => !g.used)
  if (ls.length === 1 && gs.length === 1 && ls[0].amount === gs[0].amount) {
    out.push({ from: ls[0].anchor, to: gs[0].anchor, amount: ls[0].amount })
    ls[0].used = true
    gs[0].used = true
  }
  return out
}

function changesOf<T>(prev: Record<string, T> | undefined, next: Record<string, T> | undefined, read: (t: T) => number, anchor: (id: string) => string) {
  const losers: Change[] = []
  const gainers: Change[] = []
  for (const [id, now] of Object.entries(next ?? {})) {
    const before = prev?.[id]
    if (before === undefined) continue
    const d = read(now) - read(before)
    if (d < 0) losers.push({ anchor: anchor(id), amount: -d })
    if (d > 0) gainers.push({ anchor: anchor(id), amount: d })
  }
  return { losers, gainers }
}

export function diffSnapshots(prev: FxSnapshot, next: FxSnapshot): FxEvent[] {
  const { lungeMs, hitDelayMs, gapMs, travelMs, staggerMs, overlap } = FX_TIMINGS

  // --- Clues: location -> investigator (investigate), investigator -> act (spend),
  //     and any other unambiguous one-to-one move.
  const invClues = changesOf(prev.investigators, next.investigators, (i) => i.clues, (id) => `investigator-${id}`)
  const locClues = changesOf(prev.locations, next.locations, (l) => l.clues, (id) => `location-${id}`)
  const actClues = changesOf(prev.acts, next.acts, (a) => a.clues, (id) => `act-${id}`)
  const clueLosers = [...locClues.losers, ...invClues.losers, ...actClues.losers]
  const clueGainers = [...invClues.gainers, ...locClues.gainers, ...actClues.gainers]
  const standingOn = ({ anchor }: Change) => {
    if (!anchor.startsWith('location-')) return []
    const lid = anchor.slice('location-'.length)
    return invClues.gainers.filter((g) => next.investigators[g.anchor.slice('investigator-'.length)]?.locationId === lid)
  }
  const transfers: { token: FxToken; from: string; to: string; amount: number }[] = pairTransfers(
    clueLosers,
    clueGainers,
    standingOn,
  ).map((t) => ({ token: 'clue', ...t }))

  // Clues spent with no gain anywhere go to the act -- but only when the act
  // actually advanced in this update (its id changed) and there is one act it
  // could have gone to. A clue paid for an ability or lost to a treachery while
  // the act sits still is not a spend on the act, and is shown as a floater.
  const actIds = Object.keys(next.acts ?? {})
  const prevActIds = Object.keys(prev.acts ?? {})
  const actAdvanced = actIds.some((id) => !prevActIds.includes(id))
  if (actAdvanced && actIds.length === 1 && clueGainers.every((g) => g.used)) {
    for (const l of invClues.losers.filter((l) => !l.used)) {
      transfers.push({ token: 'clue', from: l.anchor, to: `act-${actIds[0]}`, amount: l.amount })
      l.used = true
    }
  }

  // --- Resources between investigators (e.g. Lone Wolf aside, a gift of resources).
  const res = changesOf(prev.investigators, next.investigators, (i) => i.resources, (id) => `investigator-${id}`)
  transfers.push(...pairTransfers(res.losers, res.gainers, () => []).map((t) => ({ token: 'resource' as const, ...t })))

  const events: FxEvent[] = []
  let transferEnd = 0
  transfers.forEach((t, i) => {
    const delayMs = i * staggerMs
    events.push({ kind: 'transfer', token: t.token, anchor: t.from, toward: t.to, amount: t.amount, delayMs })
    transferEnd = Math.max(transferEnd, delayMs + travelMs + (Math.min(t.amount, 5) - 1) * staggerMs)
  })
  const afterTransfers = Math.round(transferEnd * overlap)

  // --- Attack: an enemy engaged with an investigator that became exhausted in
  //     the same update that hurt them attacked.
  const hurt = new Set<string>()
  for (const [id, now] of Object.entries(next.investigators)) {
    const before = prev.investigators[id]
    if (before && (now.damage > before.damage || now.horror > before.horror)) hurt.add(id)
  }
  let attacked = false
  for (const [id, now] of Object.entries(next.enemies)) {
    const before = prev.enemies[id]
    if (before && !before.exhausted && now.exhausted && now.engagedWith && hurt.has(now.engagedWith)) {
      events.push({ kind: 'attack', anchor: `enemy-${id}`, toward: `investigator-${now.engagedWith}`, amount: 0, delayMs: afterTransfers })
      attacked = true
    }
  }
  let hitDelay = afterTransfers + (attacked ? lungeMs : transfers.length ? 0 : hitDelayMs)
  const marksAt = afterTransfers

  const usedAnchor = (list: Change[], anchor: string) => list.some((c) => c.anchor === anchor && c.used)

  // --- Hits and per-investigator marks.
  for (const [id, now] of Object.entries(next.investigators)) {
    const before = prev.investigators[id]
    if (!before) continue
    const anchor = `investigator-${id}`
    const pairs: [FxKind, number][] = [
      ['damage', now.damage - before.damage],
      ['horror', now.horror - before.horror],
      ['clue', now.clues - before.clues],
      ['resource', now.resources - before.resources],
    ]
    for (const [kind, amount] of pairs) {
      if (amount === 0) continue
      if (kind === 'clue' && (usedAnchor(clueLosers, anchor) || usedAnchor(clueGainers, anchor))) continue
      if (kind === 'resource' && (usedAnchor(res.losers, anchor) || usedAnchor(res.gainers, anchor))) continue
      const isHit = kind === 'damage' || kind === 'horror'
      events.push({ kind, anchor, amount, delayMs: isHit ? hitDelay : marksAt })
      if (isHit) hitDelay += gapMs
    }
  }

  // Clues that appeared on or vanished from a location or act with no partner.
  for (const c of [...locClues.losers, ...locClues.gainers, ...actClues.losers, ...actClues.gainers]) {
    if (c.used) continue
    const isLoss = locClues.losers.includes(c) || actClues.losers.includes(c)
    events.push({ kind: 'clue', anchor: c.anchor, amount: isLoss ? -c.amount : c.amount, delayMs: marksAt })
  }

  for (const [id, now] of Object.entries(next.enemies)) {
    const before = prev.enemies[id]
    if (before && now.damage !== before.damage) {
      events.push({ kind: 'enemyDamage', anchor: `enemy-${id}`, amount: now.damage - before.damage, delayMs: marksAt })
    }
  }
  for (const id of Object.keys(prev.enemies)) {
    if (!(id in next.enemies)) events.push({ kind: 'enemyDefeated', anchor: `enemy-${id}`, amount: 0, delayMs: marksAt })
  }

  for (const [id, doom] of Object.entries(next.agendas)) {
    const before = prev.agendas[id]
    if (before !== undefined && doom !== before) {
      events.push({ kind: 'doom', anchor: `agenda-${id}`, amount: doom - before, delayMs: marksAt })
    }
  }
  for (const [anchor, doom] of Object.entries(next.doom ?? {})) {
    const before = prev.doom?.[anchor]
    if (before !== undefined && doom !== before) {
      events.push({ kind: 'doom', anchor, amount: doom - before, delayMs: marksAt })
    }
  }
  for (const [id, n] of Object.entries(next.uses ?? {})) {
    const before = prev.uses?.[id]
    if (before !== undefined && n !== before) {
      events.push({ kind: 'uses', anchor: `asset-${id}`, amount: n - before, delayMs: marksAt })
    }
  }
  return events
}

/* When the last effect of a list finishes, for holding the autopilot. */
export function eventsEndMs(events: FxEvent[]): number {
  if (events.length === 0) return 0
  return Math.max(
    ...events.map((e) =>
      e.kind === 'transfer'
        ? e.delayMs + FX_TIMINGS.travelMs + (Math.min(e.amount, 5) - 1) * FX_TIMINGS.staggerMs
        : e.delayMs + FX_TIMINGS.floaterMs,
    ),
  )
}
