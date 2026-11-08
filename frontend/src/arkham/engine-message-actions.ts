/* Reads the undecoded engine messages a choice will run (every answer button carries them) and names the
 * game action inside: place doom, take damage, discard, move ... The UI uses it to explain prompts the
 * engine left unlabelled. Pure and defensive: an unknown shape yields null, never an error. */

export type Raw = Record<string, unknown>
export const isRaw = (v: unknown): v is Raw => typeof v === 'object' && v !== null && !Array.isArray(v)

/** First object (depth-first, bounded) inside an undecoded engine value that satisfies `pred`. */
export function findRaw(value: unknown, pred: (o: Raw) => boolean, depth = 10): Raw | null {
  if (depth < 0) return null
  if (Array.isArray(value)) {
    for (const v of value) {
      const r = findRaw(v, pred, depth - 1)
      if (r) return r
    }
    return null
  }
  if (!isRaw(value)) return null
  if (pred(value)) return value
  for (const v of Object.values(value)) {
    const r = findRaw(v, pred, depth - 1)
    if (r) return r
  }
  return null
}

/** The entity id behind an undecoded Source/Target (or a bare id string), unwrapping ability/proxy tuples. */
export function rawEntityId(value: unknown, depth = 6): string | null {
  if (typeof value === 'string') return value
  if (depth < 0 || !isRaw(value)) return null
  const c = value.contents
  if (typeof c === 'string') return c
  // A wrapper around one target/source, e.g. SingleAttackTarget { contents: InvestigatorTarget }.
  if (isRaw(c)) return rawEntityId(c, depth - 1)
  if (Array.isArray(c)) {
    for (const x of c) {
      const r = rawEntityId(x, depth - 1)
      if (r) return r
    }
  }
  return null
}

/** One recognised game action: an i18n key plus the numbers and ids needed to phrase it. */
export type EngineAction = {
  key: string
  subjectId: string | null
  sourceId: string | null
  n: number | null
  horror: number | null
  token: string | null
}

const arg = (o: Raw, i: number): unknown => Array.isArray(o.contents) ? o.contents[i] : i === 0 ? o.contents : undefined
const num = (v: unknown): number | null => typeof v === 'number' ? v : null
const str = (v: unknown): string | null => typeof v === 'string' ? v : null
const field = (v: unknown, name: string): unknown => isRaw(v) ? v[name] : undefined
const playedCardId = (card: unknown) => str(field(field(card, 'contents'), 'id'))
const anyTarget = (v: unknown) => rawEntityId(findRaw(v, (o) => typeof o.tag === 'string' && o.tag.endsWith('Target')))

type Read = (o: Raw) => Partial<Omit<EngineAction, 'key'>>

// Engine constructor tag -> how to read its arguments. Argument positions follow the backend `Message`
// constructors (positional fields encode as a `contents` array). Keys name entries under
// `locationMap.status.intent.action`.
const READERS: Record<string, [string, Read]> = {
  Move: ['move', (o) => ({ subjectId: rawEntityId(field(o.contents, 'moveTarget')), sourceId: rawEntityId(field(o.contents, 'moveSource')) })],
  PlaceTokens_: ['placeTokens', (o) => ({ sourceId: rawEntityId(arg(o, 0)), subjectId: rawEntityId(arg(o, 1)), token: str(arg(o, 2)), n: num(arg(o, 3)) })],
  RemoveTokens_: ['removeTokens', (o) => ({ sourceId: rawEntityId(arg(o, 0)), subjectId: rawEntityId(arg(o, 1)), token: str(arg(o, 2)), n: num(arg(o, 3)) })],
  MoveTokens_: ['moveTokens', (o) => ({ sourceId: rawEntityId(arg(o, 0)), subjectId: rawEntityId(arg(o, 2)), token: str(arg(o, 3)), n: num(arg(o, 4)) })],
  InvestigatorAssignDamage_: ['takeDamage', (o) => ({ subjectId: str(arg(o, 0)), sourceId: rawEntityId(arg(o, 1)), n: num(arg(o, 3)), horror: num(arg(o, 4)) })],
  InvestigatorDirectDamage_: ['takeDamage', (o) => ({ subjectId: str(arg(o, 0)), sourceId: rawEntityId(arg(o, 1)), n: num(arg(o, 2)), horror: num(arg(o, 3)) })],
  InvestigatorDamage_: ['takeDamage', (o) => ({ subjectId: str(arg(o, 0)), sourceId: rawEntityId(arg(o, 1)), n: num(arg(o, 2)), horror: num(arg(o, 3)) })],
  DealDamage_: ['dealDamage', (o) => ({ subjectId: rawEntityId(arg(o, 0)), sourceId: rawEntityId(field(arg(o, 1), 'damageAssignmentSource')), n: num(field(arg(o, 1), 'damageAssignmentAmount')) })],
  InvestigatorDamageEnemy_: ['dealDamage', (o) => ({ subjectId: str(arg(o, 1)), sourceId: rawEntityId(arg(o, 2)) })],
  HealDamage_: ['healDamage', (o) => ({ subjectId: rawEntityId(arg(o, 0)), sourceId: rawEntityId(arg(o, 1)), n: num(arg(o, 2)) })],
  HealHorror_: ['healHorror', (o) => ({ subjectId: rawEntityId(arg(o, 0)), sourceId: rawEntityId(arg(o, 1)), n: num(arg(o, 2)) })],
  HealAllDamage_: ['healAllDamage', (o) => ({ subjectId: rawEntityId(arg(o, 0)), sourceId: rawEntityId(arg(o, 1)) })],
  HealAllHorror_: ['healAllHorror', (o) => ({ subjectId: rawEntityId(arg(o, 0)), sourceId: rawEntityId(arg(o, 1)) })],
  RemoveAllDoom_: ['removeAllDoom', (o) => ({ sourceId: rawEntityId(arg(o, 0)), subjectId: rawEntityId(arg(o, 1)) })],
  RemoveAllClues_: ['removeAllClues', (o) => ({ sourceId: rawEntityId(arg(o, 0)), subjectId: rawEntityId(arg(o, 1)) })],
  EngageEnemy_: ['engage', (o) => ({ subjectId: str(arg(o, 1)) })],
  EnemyEngageInvestigator_: ['engage', (o) => ({ subjectId: str(arg(o, 0)) })],
  DisengageEnemy_: ['disengage', (o) => ({ subjectId: str(arg(o, 1)) })],
  DefeatEnemy_: ['defeat', (o) => ({ subjectId: str(arg(o, 0)), sourceId: rawEntityId(arg(o, 2)) })],
  AssetDefeated_: ['defeat', (o) => ({ sourceId: rawEntityId(arg(o, 0)), subjectId: str(arg(o, 1)) })],
  Exhaust_: ['exhaust', (o) => ({ subjectId: anyTarget(o.contents) })],
  Ready_: ['ready', (o) => ({ subjectId: rawEntityId(arg(o, 0)) })],
  Discard: ['discard', (o) => ({ sourceId: rawEntityId(arg(o, 1)), subjectId: rawEntityId(arg(o, 2)) })],
  DiscardCard: ['discardCard', (o) => ({ subjectId: str(arg(o, 0)), sourceId: rawEntityId(arg(o, 1)) })],
  DiscardHand: ['discardHand', (o) => ({ subjectId: str(arg(o, 0)), sourceId: rawEntityId(arg(o, 1)) })],
  DiscardTopOfDeck: ['discardTopOfDeck', (o) => ({ subjectId: str(arg(o, 0)), n: num(arg(o, 1)), sourceId: rawEntityId(arg(o, 2)) })],
  DiscardTopOfEncounterDeck: ['discardTopOfEncounterDeck', (o) => ({ n: num(arg(o, 1)), sourceId: rawEntityId(arg(o, 2)) })],
  DrawCards: ['drawCards', (o) => ({ subjectId: str(arg(o, 0)), n: num(field(arg(o, 1), 'cardDrawAmount')), sourceId: rawEntityId(field(arg(o, 1), 'cardDrawSource')) })],
  DrawEncounterCards: ['drawEncounter', (o) => ({ subjectId: rawEntityId(arg(o, 0)), n: num(arg(o, 1)) })],
  InvestigatorDrawEnemy_: ['drawEnemy', (o) => ({ subjectId: str(arg(o, 1)) })],
  GainClues: ['gainClues', (o) => ({ subjectId: str(arg(o, 0)), sourceId: rawEntityId(arg(o, 1)), n: num(arg(o, 2)) })],
  InvestigatorDiscardAllClues_: ['discardAllClues', (o) => ({ sourceId: rawEntityId(arg(o, 0)), subjectId: str(arg(o, 1)) })],
  InvestigatorPlaceCluesOnLocation_: ['dropClues', (o) => ({ subjectId: str(arg(o, 0)), sourceId: rawEntityId(arg(o, 1)), n: num(arg(o, 2)) })],
  SpendClues: ['spendClues', (o) => ({ n: num(arg(o, 0)) })],
  TakeResources: ['gainResources', (o) => ({ subjectId: str(arg(o, 0)), n: num(arg(o, 1)), sourceId: rawEntityId(arg(o, 2)) })],
  LoseResources: ['loseResources', (o) => ({ subjectId: str(arg(o, 0)), sourceId: rawEntityId(arg(o, 1)), n: num(arg(o, 2)) })],
  SpendResources: ['spendResources', (o) => ({ subjectId: str(arg(o, 0)), n: num(arg(o, 1)) })],
  GainActions: ['gainActions', (o) => ({ subjectId: str(arg(o, 0)), sourceId: rawEntityId(arg(o, 1)), n: num(arg(o, 2)) })],
  LoseActions: ['loseActions', (o) => ({ subjectId: str(arg(o, 0)), sourceId: rawEntityId(arg(o, 1)), n: num(arg(o, 2)) })],
  SpendUses: ['spendUses', (o) => ({ sourceId: rawEntityId(arg(o, 0)), subjectId: rawEntityId(arg(o, 1)), token: str(arg(o, 2)), n: num(arg(o, 3)) })],
  PlaceDoomOnAgenda: ['placeDoomOnAgenda', (o) => ({ n: num(arg(o, 0)) })],
  ShuffleIntoDeck: ['shuffleIntoDeck', (o) => ({ subjectId: rawEntityId(arg(o, 1)) })],
  ReturnToHand: ['returnToHand', (o) => ({ subjectId: rawEntityId(arg(o, 1)) })],
  AddToHand: ['addToHand', (o) => ({ subjectId: str(arg(o, 0)) })],
  DrawToHand: ['addToHand', (o) => ({ subjectId: str(arg(o, 0)) })],
  PlaceUnderneath: ['placeUnderneath', (o) => ({ subjectId: rawEntityId(arg(o, 0)) })],
  RemoveFromGame: ['removeFromGame', (o) => ({ subjectId: rawEntityId(arg(o, 0)) })],
  Flip: ['flip', (o) => ({ sourceId: rawEntityId(arg(o, 1)), subjectId: rawEntityId(arg(o, 2)) })],
  TakeControlOfAsset: ['takeControl', (o) => ({ subjectId: str(arg(o, 1)) })],
  EnemySpawn_: ['spawn', () => ({})],
  SpawnEnemyAt: ['spawn', (o) => ({ subjectId: str(arg(o, 1)) })],
  ChooseFightEnemy_: ['fight', () => ({})],
  FightTarget_: ['fight', (o) => ({ subjectId: rawEntityId(arg(o, 0)) })],
  ChooseEvadeEnemy_: ['evade', () => ({})],
  EvadeTarget_: ['evade', (o) => ({ subjectId: rawEntityId(arg(o, 2)) })],
  Search_: ['search', () => ({})],
  // Playing a card from hand: arg 1 is the Card, `{tag: 'PlayerCard', contents: {id, cardCode, ...}}`.
  InitiatePlayCardWithWindows: ['playCard', (o) => ({ subjectId: playedCardId(arg(o, 1)) })],
  InitiatePlayCard: ['playCard', (o) => ({ subjectId: playedCardId(arg(o, 1)) })],
  PlayCard: ['playCard', (o) => ({ subjectId: playedCardId(arg(o, 1)) })],
  PlaceKey: ['placeKey', (o) => ({ subjectId: rawEntityId(arg(o, 0)) })],
  PlaceBreaches: ['placeBreaches', (o) => ({ subjectId: rawEntityId(arg(o, 0)), n: num(arg(o, 1)) })],
  RemoveBreaches: ['removeBreaches', (o) => ({ subjectId: rawEntityId(arg(o, 0)), n: num(arg(o, 1)) })],
  InvestigatorDefeated_: ['defeatInvestigator', (o) => ({ sourceId: rawEntityId(arg(o, 0)), subjectId: str(arg(o, 1)) })],
}

/** The first game action (depth-first) inside one choice's engine messages, or null when none is known. */
export function firstEngineAction(messages: unknown): EngineAction | null {
  const found = findRaw(messages, (o) => typeof o.tag === 'string' && o.tag in READERS)
  if (!found) return null
  const [key, read] = READERS[found.tag as string]
  const parts = read(found)
  return {
    key,
    subjectId: parts.subjectId ?? null,
    sourceId: parts.sourceId ?? null,
    n: parts.n ?? null,
    horror: parts.horror ?? null,
    token: parts.token ?? null,
  }
}

/** The ability being resolved, if the messages name one: the card whose effect raised the prompt.
 * Only ability sources count; a plain source inside a timing window is what triggered it, not who asks. */
export function firstAbilitySourceId(messages: unknown): string | null {
  return rawEntityId(findRaw(messages, (o) => o.tag === 'AbilitySource' || o.tag === 'UseAbilitySource'))
}

/** The timing window an answer would play into ("when an enemy attacks ..."), as its type and actors. */
export type EngineWindow = { type: string; timing: string | null; enemyId: string | null; targetId: string | null }

export function firstWindow(messages: unknown): EngineWindow | null {
  const w = findRaw(messages, (o) => 'windowType' in o && 'windowTiming' in o)
  const type = w && isRaw(w.windowType) && typeof w.windowType.tag === 'string' ? w.windowType : null
  if (!w || !type) return null
  const details = type.contents
  return {
    type: type.tag as string,
    timing: str(w.windowTiming),
    enemyId: str(field(details, 'attackEnemy')),
    targetId: anyTarget(field(details, 'attackTarget')),
  }
}
