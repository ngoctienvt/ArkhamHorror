/*
 * What a finished skill test got you, for the summary the player confirms
 * before the test panel goes away.
 *
 * The engine does not report "you discovered a clue because of this test" --
 * it just sends the next state -- so the summary is the difference between the
 * board as the test began and the board as it ended, for the tested
 * investigator and the enemy it targeted. Chaos symbol effects ("if you fail,
 * take 1 horror") land inside that window, so they show up too.
 *
 * Import-free on purpose (it reads a structural slice of the game) so the node
 * tests can load it without the Vue toolchain, like sfxEvents.ts.
 */

type Counts = Partial<Record<string, number>>

interface CardLike {
  contents?: { id?: string; contents?: { id?: string } }
}

interface InvestigatorSlice {
  tokens?: Counts
  hand?: readonly CardLike[]
  /** Treacheries in the threat area. */
  treacheries?: readonly string[]
}

interface EnemySlice {
  tokens?: Counts
}

interface TestSlice {
  id: string
  investigator: string
  action?: string | null
  skills?: readonly string[]
  target?: { tag: string; contents?: unknown } | null
  revealedChaosTokens?: readonly { face: string }[]
  resolvedChaosTokens?: readonly { face: string }[]
  resultForced?: boolean
  result?: { tag: string; contents?: readonly unknown[] } | null
}

interface ResultsSlice {
  skillTestResultsSkillValue: number
  skillTestResultsIconValue: number
  skillTestResultsChaosTokensValue: number
  skillTestResultsDifficulty: number
  skillTestResultsResultModifiers: number | null
  skillTestResultsSuccess: boolean
}

export interface SummaryGameSlice {
  skillTest?: TestSlice | null
  skillTestResults?: ResultsSlice | null
  investigators?: Readonly<Record<string, InvestigatorSlice | undefined>>
  enemies?: Readonly<Record<string, EnemySlice | undefined>>
  treacheries?: Readonly<Record<string, { cardCode: string } | undefined>>
}

interface Snapshot {
  investigator: { tokens: Counts; handIds: readonly string[]; threatIds: readonly string[] } | null
  enemy: { id: string; damage: number } | null
}

/* What is remembered about a running test between updates. */
export interface SkillTestTracker {
  testId: string
  baseline: Snapshot
  test: TestSlice
  results: ResultsSlice | null
}

export type SummaryLineKind =
  | 'clues'
  | 'resources'
  | 'damage'
  | 'horror'
  | 'cardsDrawn'
  | 'enemyDamage'
  | 'enemyDefeated'
  | 'enemyEvaded'
  | 'threatArea'

/* `amount` is signed for the investigator's tokens: -1 clues is a clue lost,
 * -2 damage is damage healed. */
export interface SummaryLine {
  kind: SummaryLineKind
  amount: number
  /** The card a 'threatArea' line is about. */
  cardCode?: string
}

export interface SkillTestSummary {
  testId: string
  investigatorId: string
  action: string | null
  skills: readonly string[]
  tokenFaces: readonly string[]
  success: boolean
  /* By how much it passed or failed, as the test panel shows it. */
  margin: number
  lines: readonly SummaryLine[]
}

const TOKEN_LINES: readonly [string, SummaryLineKind][] = [
  ['Clue', 'clues'],
  ['Resource', 'resources'],
  ['Damage', 'damage'],
  ['Horror', 'horror'],
]

const cardId = (card: CardLike) => card.contents?.id ?? card.contents?.contents?.id

function targetEnemyId(test: TestSlice): string | null {
  const target = test.target
  return target?.tag === 'EnemyTarget' && typeof target.contents === 'string' ? target.contents : null
}

function snapshot(game: SummaryGameSlice, test: TestSlice): Snapshot {
  const investigator = game.investigators?.[test.investigator]
  const enemyId = targetEnemyId(test)
  const enemy = enemyId ? game.enemies?.[enemyId] : undefined
  return {
    investigator: investigator
      ? {
          tokens: { ...(investigator.tokens ?? {}) },
          handIds: (investigator.hand ?? []).map(cardId).filter((id): id is string => !!id),
          threatIds: [...(investigator.treacheries ?? [])],
        }
      : null,
    enemy: enemyId && enemy
      ? { id: enemyId, damage: enemy.tokens?.Damage ?? 0 }
      : null,
  }
}

/* Same arithmetic as the result line in SkillTest.vue, so the two never disagree. */
export function resultMargin(test: TestSlice, results: ResultsSlice): number {
  const skillValue = Math.max(
    0,
    results.skillTestResultsSkillValue + results.skillTestResultsIconValue + results.skillTestResultsChaosTokensValue,
  )
  const forced = test.resultForced ? test.result?.contents?.[1] : undefined
  const testResult = typeof forced === 'number' ? forced : skillValue - results.skillTestResultsDifficulty
  const modifiers = results.skillTestResultsResultModifiers ?? 0
  return results.skillTestResultsSuccess ? Math.abs(testResult + modifiers) : Math.abs(testResult - modifiers)
}

function rewardLines(before: Snapshot, game: SummaryGameSlice, test: TestSlice, success: boolean): SummaryLine[] {
  const lines: SummaryLine[] = []
  const now = game.investigators?.[test.investigator]
  if (before.investigator && now) {
    for (const [token, kind] of TOKEN_LINES) {
      const delta = (now.tokens?.[token] ?? 0) - (before.investigator.tokens[token] ?? 0)
      if (delta !== 0) lines.push({ kind, amount: delta })
    }
    // New card ids rather than a hand count, so cards committed out of the hand
    // are not read as cards lost.
    const had = new Set(before.investigator.handIds)
    const drawn = (now.hand ?? []).map(cardId).filter((id) => id && !had.has(id)).length
    if (drawn > 0) lines.push({ kind: 'cardsDrawn', amount: drawn })
    // A card put into the threat area (a Poisoned weakness on a failed test) has no log line
    // of its own, so it is read off the board like the rest.
    const threatened = new Set(before.investigator.threatIds)
    for (const id of now.treacheries ?? []) {
      const code = threatened.has(id) ? undefined : game.treacheries?.[id]?.cardCode
      if (code) lines.push({ kind: 'threatArea', amount: 1, cardCode: code })
    }
  }
  if (before.enemy) {
    const enemy = game.enemies?.[before.enemy.id]
    if (!enemy) {
      lines.push({ kind: 'enemyDefeated', amount: 1 })
    } else {
      const dealt = (enemy.tokens?.Damage ?? 0) - before.enemy.damage
      if (dealt > 0) lines.push({ kind: 'enemyDamage', amount: dealt })
      // An evade that passed: the engine exhausts and disengages it, but it may
      // already have been exhausted, so the action and result are what count.
      if (test.action === 'Evade' && success) {
        lines.push({ kind: 'enemyEvaded', amount: 1 })
      }
    }
  }
  return lines
}

/* Feed every update through this. It remembers the board as each test begins,
 * keeps the test's latest result, and hands back a summary on the update the
 * test ends -- only if the test actually got a result (a cancelled test has
 * nothing to summarise). The first state a client sees starts tracking from
 * there, so reloading mid-test still summarises what is left of it. */
export function trackSkillTest(
  tracker: SkillTestTracker | null,
  previous: SummaryGameSlice | null | undefined,
  next: SummaryGameSlice,
): { tracker: SkillTestTracker | null; summary: SkillTestSummary | null } {
  const test = next.skillTest
  if (test) {
    const started = !tracker || tracker.testId !== test.id
    const baseline = started ? snapshot(previous?.skillTest ? next : previous ?? next, test) : tracker.baseline
    const results = next.skillTestResults ?? (started ? null : tracker.results)
    return { tracker: { testId: test.id, baseline, test, results }, summary: null }
  }

  if (!tracker || !tracker.results) return { tracker: null, summary: null }

  const { test: last, results, baseline } = tracker
  const tokens = (last.resolvedChaosTokens?.length ? last.resolvedChaosTokens : last.revealedChaosTokens) ?? []
  return {
    tracker: null,
    summary: {
      testId: last.id,
      investigatorId: last.investigator,
      action: last.action ?? null,
      skills: last.skills ?? [],
      tokenFaces: tokens.map((token) => token.face),
      success: results.skillTestResultsSuccess,
      margin: resultMargin(last, results),
      lines: rewardLines(baseline, next, last, results.skillTestResultsSuccess),
    },
  }
}

/* What the server's log says happened during a test: the lines it filed inside
 * the test's block. The block is keyed "skillTest:<id>", possibly below an outer
 * block ("navigate:x/skillTest:<id>"). The header ("is testing...") and the
 * closing result line are left out: the summary already shows both. */
interface LogPartLike {
  tag: string
  contents?: unknown
}

interface LogEntryLike {
  kind?: string
  body?: readonly LogPartLike[]
  group?: { id: string; role: string } | null
}

export function skillTestLogEntries<T extends LogEntryLike>(entries: readonly T[], testId: string): T[] {
  return entries.filter((entry) =>
    entry.group?.role === 'GroupMember' && entry.group.id.includes(`skillTest:`) && entry.group.id.includes(testId))
}

/* The i18n key and variables of an entry's sentence ("log.discarded", {card}). */
function sentence(entry: LogEntryLike): { key: string; vars: Record<string, LogPartLike> } | null {
  const first = entry.body?.[0]
  if (first?.tag !== 'LogI18n' || !Array.isArray(first.contents)) return null
  const [key, vars] = first.contents as [string, Record<string, LogPartLike>]
  return { key, vars: vars ?? {} }
}

/* How the test was played rather than what it did: abilities used, costs paid,
 * tokens revealed, the value breakdown, cards committed. */
const PROCESS_KEYS = new Set([
  'log.activatesAbility',
  'log.spendsResources',
  'log.resourceSurcharge',
  'log.drawsChaosTokens',
  'log.testRevealed',
  'log.testBreakdown',
  'log.commits',
])

/* Outcomes the summary already shows as a headline line when they hit the tested
 * investigator (clues, resources, damage, horror). */
const HEADLINE_KEYS = new Set([
  'log.discoveredClues',
  'log.discoveredCluesAt',
  'log.gainsResources',
  'log.takesDamage',
  'log.takesDamageFrom',
  'log.takesHorror',
  'log.takesHorrorFrom',
  'log.takesDamageAndHorror',
  'log.takesDamageAndHorrorFrom',
])

function refEntityId(part: LogPartLike | undefined): string | null {
  if (part?.tag !== 'LogRefPart') return null
  return (part.contents as { entityId?: string | null } | undefined)?.entityId ?? null
}

function numberOf(part: LogPartLike | undefined): number {
  return part && (part.tag === 'LogNumber' || part.tag === 'LogDelta') && typeof part.contents === 'number' ? part.contents : 0
}

/* Splits a test's log lines into what it did (a card discarded, doom placed, an
 * ally hurt...) and the resources paid along the way, so paying for Higher
 * Education twice is not reported as "lost 2 resources". */
export function skillTestOutcome<T extends LogEntryLike>(
  entries: readonly T[],
  investigatorId: string,
): { events: T[]; resourcesSpent: number } {
  let resourcesSpent = 0
  const events = entries.filter((entry) => {
    if (entry.kind === 'Action') return false
    const s = sentence(entry)
    if (!s) return true
    if (s.key === 'log.spendsResources' && refEntityId(s.vars.investigator) === investigatorId) {
      resourcesSpent += numberOf(s.vars.count)
    }
    if (PROCESS_KEYS.has(s.key) || s.key.startsWith('log.triggers') || s.key.startsWith('log.debug.')) return false
    if (HEADLINE_KEYS.has(s.key)) {
      const who = refEntityId(s.vars.investigator) ?? refEntityId(s.vars.target)
      if (who === investigatorId) return false
    }
    return true
  })
  return { events, resourcesSpent }
}

/* The headline lines with the resources paid as costs added back: what is left
 * is what the test itself gave or took. */
export function withoutCosts(lines: readonly SummaryLine[], resourcesSpent: number): SummaryLine[] {
  if (resourcesSpent === 0) return [...lines]
  return lines.flatMap((line) => {
    if (line.kind !== 'resources') return [line]
    const amount = line.amount + resourcesSpent
    return amount === 0 ? [] : [{ ...line, amount }]
  })
}

/* The board to show while a summary waits for its confirm. The update that ended the
 * test usually also carries whatever the test set in motion (an agenda advancing, the
 * next question), because the server runs straight on; that update is held back and
 * the board stays as the test left it, minus the test panel and anything to answer. */
export function boardHeldForSummary<G extends { skillTest?: unknown; skillTestResults?: unknown; question?: unknown }>(resolving: G): G {
  return { ...resolving, skillTest: null, skillTestResults: null, question: {} }
}
