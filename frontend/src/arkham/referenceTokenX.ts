/* The value of X on a scenario reference card ("-X. X is the number of locations in play (max 5)"),
 * worked out on the client from the card's English text and the game state.
 *
 * The engine computes token values itself but does not send them, so this reads the sentence instead:
 * a base quantity ("the number of vengeance points in the victory display") wrapped in a few shapes
 * that recur on every campaign's cards ("2 more than ...", "twice ...", "half ... (rounded up)",
 * "(max 5)", "to a minimum of 1"). A sentence it cannot read yields null and the card keeps its "X".
 *
 * Import-free on purpose so the tests can load it without the Vue toolchain; `referenceTokenXContext.ts`
 * builds the context from a game. */

/** One card or entity, reduced to what the sentences ask about. */
export type XThing = {
  name?: string
  traits: string[]
  type?: string
  doom: number
  clues: number
  breaches?: number
  /** At your location (enemies, assets) or your location itself (locations). */
  yours?: boolean
  revealed?: boolean
  shroud?: number | null
  printedShroud?: number | null
  cardsUnderneath?: number
  vengeance?: number
}

export type XContext = {
  enemies: XThing[]
  locations: XThing[]
  agendas: XThing[]
  assets: XThing[]
  treacheries: XThing[]
  victoryDisplay: XThing[]
  /** Doom on every card in play, agendas included. */
  doomInPlay: number
  agendaNumber: number | null
  actNumber: number | null
  you: { horror: number; damage: number; hand: number; clues: number; keys: number; poisoned?: boolean } | null
  investigatorKeys: number
  explorationDeck: number | null
  /** Scenario counters (depth, alarm, darkness ...) keyed by their name in lower case without spaces. */
  counters: Record<string, number>
}

type Eval = (ctx: XContext) => number | null

const TRAIT = /\[\[([^\]]+)\]\]/g

/** "[[Cultist]] and [[Monster]]" -> ['cultist', 'monster']; empty when the phrase names no trait. */
function traitsIn(phrase: string | undefined): string[] {
  return [...(phrase ?? '').matchAll(TRAIT)].map((m) => m[1].toLowerCase())
}

/** Whether a thing has one of the traits (any thing does when none are asked for). */
const hasTrait = (thing: XThing, traits: string[]): boolean =>
  traits.length === 0 || thing.traits.some((t) => traits.includes(t.toLowerCase()))

const sum = (xs: number[]): number => xs.reduce((a, b) => a + b, 0)
const max = (xs: number[]): number => (xs.length ? Math.max(...xs) : 0)

/* A trait list in front of a noun: "[[cultist]] " or "[[cultist]] and [[monster]] ". */
const T = '((?:\\[\\[[^\\]]+\\]\\]\\s*(?:and|or)?\\s*)*)'
const THE = '(?:the )?'
const COUNT = `${THE}(?:total )?(?:number|amount) of`

/* The base quantities, tried in order. Each pattern matches the whole (lower-cased) phrase. */
const BASES: Array<[RegExp, (m: RegExpMatchArray) => Eval]> = [
  [/^(\d+)$/, (m) => () => Number(m[1])],

  // Victory display
  [new RegExp(`^${COUNT} vengeance points? in the victory display$`), () => (c) => sum(c.victoryDisplay.map((t) => t.vengeance ?? 0))],
  [new RegExp(`^${COUNT} copies of (.+?) in the victory display$`), (m) => (c) =>
    c.victoryDisplay.filter((t) => t.name?.toLowerCase() === m[1].trim()).length],
  [new RegExp(`^${COUNT} story cards in the victory display$`), () => (c) => c.victoryDisplay.filter((t) => t.type === 'StoryType').length],
  [new RegExp(`^${COUNT} ${T}enemies in play and in the victory display$`), (m) => (c) => {
    const tr = traitsIn(m[1])
    return c.enemies.filter((t) => hasTrait(t, tr)).length + c.victoryDisplay.filter((t) => t.type === 'EnemyType' && hasTrait(t, tr)).length
  }],
  [new RegExp(`^${COUNT} ${T}enemies in the victory display$`), (m) => (c) =>
    c.victoryDisplay.filter((t) => t.type === 'EnemyType' && hasTrait(t, traitsIn(m[1]))).length],
  [new RegExp(`^${COUNT} ${T}cards in the victory display$`), (m) => (c) => c.victoryDisplay.filter((t) => hasTrait(t, traitsIn(m[1]))).length],

  // Doom
  [new RegExp(`^${COUNT} doom in play$`), () => (c) => c.doomInPlay],
  [new RegExp(`^${COUNT} doom (?:on|among) ${T}enemies(?: in play)?$`), (m) => (c) => sum(c.enemies.filter((t) => hasTrait(t, traitsIn(m[1]))).map((t) => t.doom))],
  [new RegExp(`^${COUNT} doom on enemies and assets in play$`), () => (c) => sum([...c.enemies, ...c.assets].map((t) => t.doom))],
  [new RegExp(`^${THE}highest (?:number|amount) of doom on an? ${T}enemy(?: in play)?$`), (m) => (c) => max(c.enemies.filter((t) => hasTrait(t, traitsIn(m[1]))).map((t) => t.doom))],
  [new RegExp(`^${COUNT} doom on locations(?: in play)?$`), () => (c) => sum(c.locations.map((t) => t.doom))],
  [new RegExp(`^${THE}highest (?:number|amount) of doom on a location(?: in play)?$`), () => (c) => max(c.locations.map((t) => t.doom))],
  [new RegExp(`^${COUNT} doom on agendas(?: in play)?$`), () => (c) => sum(c.agendas.map((t) => t.doom))],
  [new RegExp(`^${THE}highest (?:number|amount) of doom on an agenda(?: in play)?$`), () => (c) => max(c.agendas.map((t) => t.doom))],
  [new RegExp(`^${COUNT} locations with doom on them$`), () => (c) => c.locations.filter((t) => t.doom > 0).length],
  [new RegExp(`^${COUNT} locations with (\\d+) or more doom on them$`), (m) => (c) => c.locations.filter((t) => t.doom >= Number(m[1])).length],
  [new RegExp(`^${COUNT} doom and breaches on your location$`), () => (c) => {
    const l = c.locations.find((t) => t.yours)
    return l ? l.doom + (l.breaches ?? 0) : null
  }],

  // Clues on enemies
  [new RegExp(`^${COUNT} clues on ${T}enemies(?: in play)?$`), (m) => (c) => sum(c.enemies.filter((t) => hasTrait(t, traitsIn(m[1]))).map((t) => t.clues))],
  [new RegExp(`^${THE}highest number of clues on an? ${T}enemy(?: in play)?$`), (m) => (c) => max(c.enemies.filter((t) => hasTrait(t, traitsIn(m[1]))).map((t) => t.clues))],

  // Locations
  [new RegExp(`^${COUNT} revealed ${T}locations(?: in play)?$`), (m) => (c) => c.locations.filter((t) => t.revealed && hasTrait(t, traitsIn(m[1]))).length],
  [new RegExp(`^${COUNT} ${T}locations in play$`), (m) => (c) => c.locations.filter((t) => hasTrait(t, traitsIn(m[1]))).length],
  [new RegExp(`^${COUNT} locations with no scenario cards beneath them$`), () => (c) => c.locations.filter((t) => !t.cardsUnderneath).length],
  [new RegExp(`^${THE}base shroud value of your location$`), () => (c) => c.locations.find((t) => t.yours)?.printedShroud ?? null],
  [new RegExp(`^${THE}shroud value of your location$`), () => (c) => c.locations.find((t) => t.yours)?.shroud ?? null],

  // Enemies, treacheries, assets
  [new RegExp(`^${COUNT} ${T}enemies at your location$`), (m) => (c) => c.enemies.filter((t) => t.yours && hasTrait(t, traitsIn(m[1]))).length],
  [new RegExp(`^${COUNT} ${T}enemies in play$`), (m) => (c) => c.enemies.filter((t) => hasTrait(t, traitsIn(m[1]))).length],
  [new RegExp(`^${COUNT} ${T}treacheries in play$`), (m) => (c) => c.treacheries.filter((t) => hasTrait(t, traitsIn(m[1]))).length],
  [new RegExp(`^${COUNT} story assets at your location$`), () => (c) => c.assets.filter((t) => t.yours && t.type === 'StoryAssetType').length],
  [new RegExp(`^${COUNT} ${T}assets at your location$`), (m) => (c) => c.assets.filter((t) => t.yours && hasTrait(t, traitsIn(m[1]))).length],

  // Acts and agendas
  [new RegExp(`^${THE}(?:current agenda (?:number|#)|number of the current agenda)$`), () => (c) => c.agendaNumber],
  [new RegExp(`^${THE}(?:current act number|number of the current act)$`), () => (c) => c.actNumber],

  // You and the investigators
  [new RegExp(`^${COUNT} horror on you$`), () => (c) => c.you?.horror ?? null],
  [new RegExp(`^${COUNT} damage on you$`), () => (c) => c.you?.damage ?? null],
  [new RegExp(`^${COUNT} cards in your hand$`), () => (c) => c.you?.hand ?? null],
  [new RegExp(`^${COUNT} keys you control$`), () => (c) => c.you?.keys ?? null],
  [new RegExp(`^${COUNT} keys the investigators control$`), () => (c) => c.investigatorKeys],

  // Decks
  [new RegExp(`^${COUNT} cards in the exploration deck$`), () => (c) => c.explorationDeck],
]

/* Scenario counters named in the sentence ("the current depth level", "your alarm level", "Cthulhu's Rage"):
 * the longest counter name found in the phrase wins. */
function counterOf(phrase: string): Eval {
  const words = phrase.replace(/[^a-z]/g, '')
  return (c) => {
    const hit = Object.keys(c.counters)
      .filter((k) => k.length >= 4 && words.includes(k))
      .sort((a, b) => b.length - a.length)[0]
    return hit === undefined ? null : c.counters[hit]
  }
}

function baseOf(phrase: string): Eval | null {
  for (const [re, make] of BASES) {
    const m = re.exec(phrase)
    if (m) return make(m)
  }
  if (/^(?:the |your )?(?:current )?[a-z' ]+$/.test(phrase)) return counterOf(phrase)
  return null
}

const lift = (e: Eval, f: (n: number) => number): Eval => (c) => {
  const v = e(c)
  return v === null ? null : f(v)
}

const normalize = (definition: string): string =>
  definition.toLowerCase().replace(/[’`]/g, "'").replace(/\s+/g, ' ').trim()

/* Limits written after the quantity: "(max 5)", ", to a maximum of 5", "(X cannot be greater than 3)". */
const LIMIT = /^(.+?),?\s*\(?\s*(?:to a |x cannot be )?(max(?:imum)?|min(?:imum)?|greater than)(?: of)?\s+(\d+)\s*\)?$/

/** Reads a definition ("2 more than the current act number") into a function of the game state. */
export function parseXDefinition(definition: string): Eval | null {
  const s = normalize(definition)

  const limit = LIMIT.exec(s)
  if (limit) {
    const inner = parseXDefinition(limit[1])
    const n = Number(limit[3])
    if (!inner) return null
    return lift(inner, (v) => (limit[2].startsWith('min') ? Math.max(n, v) : Math.min(n, v)))
  }

  const half = /^half (?:of )?(.+?),?\s*\(?rounded (up|down)\)?$/.exec(s)
  if (half) {
    const inner = parseXDefinition(half[1])
    if (!inner) return null
    return lift(inner, (v) => (half[2] === 'up' ? Math.ceil(v / 2) : Math.floor(v / 2)))
  }

  const twice = /^twice (.+)$/.exec(s)
  if (twice) {
    const inner = parseXDefinition(twice[1])
    return inner && lift(inner, (v) => v * 2)
  }

  const more = /^(\d+) (?:more|higher) than (.+)$/.exec(s)
  if (more) {
    const inner = parseXDefinition(more[2])
    return inner && lift(inner, (v) => v + Number(more[1]))
  }

  const plus = /^(.+?) plus (.+)$/.exec(s)
  if (plus) {
    const a = parseXDefinition(plus[1])
    const b = parseXDefinition(plus[2])
    if (!a || !b) return null
    return (c) => {
      const x = a(c)
      const y = b(c)
      return x === null || y === null ? null : x + y
    }
  }

  return baseOf(s)
}

/** The first "X is ..." definition in a reference card line, or null when the line defines no X. */
export function xDefinitionIn(line: string): string | null {
  return /\bX is ([^.]+)\./.exec(line)?.[1]?.trim() ?? null
}

/** X and, when the card caps it ("(max 5)"), the count before the cap: `raw` 7 with `value` 5 means the cap is reached. */
export type XDetail = { value: number; raw: number }

/** X for a reference card line with its uncapped count, or null when the line has no X or its sentence is not one this file reads. */
export function referenceXDetail(line: string, ctx: XContext): XDetail | null {
  const definition = xDefinitionIn(line)
  if (!definition) return null
  const evaluate = parseXDefinition(definition)
  if (!evaluate) return null
  const value = evaluate(ctx)
  if (value === null || !Number.isFinite(value)) return null
  const limit = LIMIT.exec(normalize(definition))
  const raw = limit ? parseXDefinition(limit[1])?.(ctx) ?? value : value
  return { value, raw }
}

/** X for a reference card line, or null when the line has no X or its sentence is not one this file reads. */
export function referenceX(line: string, ctx: XContext): number | null {
  return referenceXDetail(line, ctx)?.value ?? null
}

/** How hard a token hits right now: no effect, a small or a big penalty, a bonus, an automatic failure, or not
 * known (an X this file cannot count, or a token with no number). The badge styles 'zero', 'fail' and 'unknown'. */
export type TokenTier = 'zero' | 'mild' | 'bad' | 'good' | 'fail' | 'unknown'
export type TokenBadge = { modifier: number | null; tier: TokenTier }

/** The modifier a token line applies now: its printed number ("-2"), or its X filled in ("-X" with X = 3 -> -3). */
export function tokenBadge(short: string, x: XDetail | null, autoFail: boolean): TokenBadge {
  if (autoFail) return { modifier: null, tier: 'fail' }
  const m = /^([+-])(\d+|x)$/i.exec(short)
  if (!m) return { modifier: null, tier: 'unknown' }
  const size = /x/i.test(m[2]) ? x?.value ?? null : Number(m[2])
  if (size === null) return { modifier: null, tier: 'unknown' }
  return valueBadge(m[1] === '-' ? -size : size)
}

/** The badge for a modifier already known as a number (the engine's own value for a drawn token). */
export function valueBadge(value: number): TokenBadge {
  const modifier = value || 0 // "-X" with X = 0 is 0, not -0
  const tier: TokenTier = modifier === 0 ? 'zero' : modifier > 0 ? 'good' : modifier >= -2 ? 'mild' : 'bad'
  return { modifier, tier }
}

/* "-3", "+1", "0": a real minus sign so the numbers line up. */
export const formatModifier = (n: number): string => (n === 0 ? '0' : n > 0 ? `+${n}` : `−${-n}`)

/** Whether the line makes the test fail outright right now: "If you are poisoned, this test automatically fails" while you are. */
export function autoFailsNow(line: string, ctx: XContext): boolean {
  return !!ctx.you?.poisoned && /\bif you are poisoned\b[^.]*\bautomatically fails?\b/i.test(line)
}
