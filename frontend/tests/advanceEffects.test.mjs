import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

const source = readFileSync(new URL('../src/arkham/advanceEffects.ts', import.meta.url), 'utf8')
const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
const { advanceEffectSteps, stagedBoard, EFFECT_DICTS, discardedCardCodes, discardSourceCode } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))

const loc = (id, extra = {}) => ({ id, cardCode: `c${id}`, revealed: true, investigators: [], enemies: [], assets: [], treacheries: [], connectedLocations: [], ...extra })
const inv = (id, location) => ({ id, cardCode: `c${id}`, location, engagedEnemies: [], assets: [], treacheries: [] })
const enemy = (id, at) => ({ id, cardCode: `c${id}`, placement: { tag: 'AtLocation', contents: at }, treacheries: [], assets: [] })
const row = (seq, ...entityIds) => ({
  tag: 'LogRowStructured',
  contents: { seq, body: entityIds.map((entityId) => ({ tag: 'LogRefPart', contents: { entityId } })), source: null, children: [] },
})

const sentence = (seq, key, ...entityIds) => ({
  tag: 'LogRowStructured',
  contents: {
    seq,
    body: [{ tag: 'LogI18n', contents: [`log.${key}`, Object.fromEntries(entityIds.map((entityId, i) => [`p${i}`, { tag: 'LogRefPart', contents: { entityId } }]))] }],
    source: null,
    children: [],
  },
})

/* Study → Hallway: discard the ghoul, put Hallway into play, move everyone, remove Study. */
const before = {
  log: [row(1)],
  investigators: { i1: inv('i1', 'study') },
  enemies: { g1: enemy('g1', 'study') },
  locations: { study: loc('study', { investigators: ['i1'], enemies: ['g1'] }) },
  assets: {},
  treacheries: {},
  acts: { a2: { id: 'a2' } },
}
const after = {
  log: [row(1), row(2, 'g1'), row(3, 'i1', 'hallway')],
  investigators: { i1: inv('i1', 'hallway') },
  enemies: {},
  locations: { hallway: loc('hallway', { investigators: ['i1'] }) },
  assets: {},
  treacheries: {},
  acts: { a3: { id: 'a3' } },
}

/* Same, but the study stays: no scene change, each change is its own step. */
const afterKeep = {
  ...after,
  locations: { study: loc('study'), hallway: loc('hallway', { investigators: ['i1'] }) },
}

test('steps follow the act: discard, put into play, move', () => {
  const steps = advanceEffectSteps(before, afterKeep)
  assert.deepEqual(steps.map((s) => s.kind), ['discardEnemy', 'placeLocation', 'moveInvestigator'])
  assert.equal(steps[2].toLocation.id, 'hallway')
})

test('locations swapped for others become one scene change', () => {
  const steps = advanceEffectSteps(before, after)
  assert.deepEqual(steps.map((s) => s.kind), ['discardEnemy', 'changeScene'])
  assert.deepEqual(steps[1].items.map((i) => i.id).sort(), ['hallway', 'i1'])
  assert.deepEqual(steps[1].removed.map((i) => i.id), ['study'])
})

test('a new location is revealed only after the scene change', () => {
  // The log reveals the hallway before anyone is said to move into it.
  const a = { ...after, log: [row(1), sentence(2, 'locationRevealed', 'hallway'), row(3, 'i1')] }
  const steps = advanceEffectSteps(before, a)
  assert.deepEqual(steps.map((s) => s.kind), ['discardEnemy', 'changeScene', 'logged'])
  assert.equal(steps[2].logKey, 'locationRevealed')
})

test('no visible change, no steps', () => {
  assert.deepEqual(advanceEffectSteps(before, { ...before, acts: after.acts }), [])
  assert.deepEqual(advanceEffectSteps(null, after), [])
})

test('consecutive steps of one kind merge into one announcement', () => {
  const b = { ...before, enemies: { g1: enemy('g1', 'study'), g2: enemy('g2', 'study') } }
  const steps = advanceEffectSteps(b, after)
  assert.equal(steps[0].kind, 'discardEnemy')
  assert.deepEqual(steps[0].items.map((i) => i.id).sort(), ['g1', 'g2'])
})

test('a location is placed before anything moves to it, even if the log names it later', () => {
  const a = { ...afterKeep, log: [row(1), row(2, 'i1'), row(3, 'hallway')] }
  const kinds = advanceEffectSteps(before, a).map((s) => s.kind)
  assert.ok(kinds.indexOf('placeLocation') < kinds.indexOf('moveInvestigator'))
})

/* Every id an intermediate board lists must exist in it. */
function assertNoDangling(board) {
  const ids = new Set(EFFECT_DICTS.flatMap((d) => Object.keys(board[d] ?? {})))
  const all = new Set([...ids, ...EFFECT_DICTS.flatMap((d) => [...Object.keys(before[d] ?? {}), ...Object.keys(after[d] ?? {})])])
  for (const d of EFFECT_DICTS) {
    for (const e of Object.values(board[d] ?? {})) {
      for (const [field, v] of Object.entries(e)) {
        if (Array.isArray(v)) for (const id of v) if (all.has(id)) assert.ok(ids.has(id), `${d}.${e.id}.${field} -> ${id}`)
      }
      if (d === 'investigators') assert.ok(ids.has(e.location), `investigator ${e.id} at missing ${e.location}`)
      if (e.placement?.tag === 'AtLocation') assert.ok(ids.has(e.placement.contents))
    }
  }
}

test('intermediate boards apply the steps one at a time without dangling ids', () => {
  const steps = advanceEffectSteps(before, after)
  const boards = steps.map((_, i) => stagedBoard(before, after, steps, i + 1))
  boards.forEach(assertNoDangling)
  // 1: ghoul gone, still in the study
  assert.deepEqual(Object.keys(boards[0].enemies), [])
  assert.deepEqual(boards[0].locations.study.enemies, [])
  assert.equal(boards[0].investigators.i1.location, 'study')
  // 2: the scene changes at once: hallway in, everyone there, study gone
  assert.equal(boards.length, 2)
  assert.deepEqual(Object.keys(boards[1].locations), ['hallway'])
  assert.equal(boards[1].investigators.i1.location, 'hallway')
  assert.deepEqual(boards[1].locations.hallway.investigators, ['i1'])
  // Not an effect dict: always the new one.
  assert.deepEqual(Object.keys(boards[0].acts), ['a3'])
})

/* Enemy phase: the ghoul moves into the hall and attacks. */
const hall = { ...before, locations: { study: loc('study', { investigators: ['i1'], enemies: ['g1'] }), hall: loc('hall') }, phase: 'EnemyPhase' }
const phaseRow = (children) => ({ tag: 'LogRowStructured', contents: { seq: 5, body: [], source: null, children } })
const hallBefore = { ...hall, log: [phaseRow([])], enemies: { g1: enemy('g1', 'hall') } }
const hallAfter = {
  ...hall,
  log: [phaseRow([sentence(0, 'enemyMovesTo', 'g1', 'study').contents, sentence(0, 'enemyAttacks', 'g1', 'i1').contents])],
  enemies: { g1: enemy('g1', 'study') },
  investigators: { i1: { ...inv('i1', 'study'), damage: 2 } },
}

test('phase: new children of an existing log group become steps, the move rides on its sentence', () => {
  const steps = advanceEffectSteps(hallBefore, hallAfter, 'phase')
  assert.deepEqual(steps.map((s) => [s.kind, s.logKey]), [['moveEnemy', 'enemyMovesTo'], ['logged', 'enemyAttacks']])
  const moved = stagedBoard(hallBefore, hallAfter, steps, 1)
  assert.equal(moved.enemies.g1.placement.contents, 'study')
  assert.equal(moved.investigators.i1.damage, undefined)
  const attacked = stagedBoard(hallBefore, hallAfter, steps, 2)
  assert.equal(attacked.investigators.i1.damage, 2)
})

test('turn: only what the game does by itself, and no bare board diffs', () => {
  const a = { ...hallAfter, log: [phaseRow([sentence(0, 'defeated', 'g1').contents, sentence(0, 'enemyAttacks', 'g1', 'i1').contents])] }
  const steps = advanceEffectSteps(hallBefore, a, 'turn')
  assert.deepEqual(steps.map((s) => s.logKey), ['enemyAttacks'])
})

/* Mythos, as the server logs it: an agenda turns over encounter cards looking
 * for a monster, then a drawn enemy is logged engaging before it spawns. */
const ref = (kind, cardCode, entityId = null) => ({ tag: 'LogRefPart', contents: { kind, cardCode, entityId } })
const i18n = (seq, key, args) => ({ tag: 'LogRowStructured', contents: { seq, body: [{ tag: 'LogI18n', contents: [`log.${key}`, args] }], source: null, children: [] } })
const deckDiscard = (seq, cardCode) => i18n(seq, 'discardedBy', { card: ref('RefCard', cardCode), source: ref('RefAgenda', 'c01143', 'c01143') })
const mythosBefore = { ...hall, phase: 'MythosPhase', log: [row(1)], enemies: {} }
const mythosAfter = {
  ...mythosBefore,
  log: [
    row(1),
    deckDiscard(2, 'c01166'), deckDiscard(3, 'c01165'), deckDiscard(4, 'c01163'),
    i18n(5, 'engages', { enemy: ref('RefEnemy', 'cdy', 'dy'), investigator: ref('RefInvestigator', 'ci1', 'i1') }),
    i18n(6, 'enemySpawnedAt', { enemy: ref('RefEnemy', 'cdy', 'dy'), location: ref('RefLocation', 'cstudy', 'study') }),
  ],
  enemies: { dy: enemy('dy', 'study') },
}

test('cards turned over from the encounter deck read as one discard', () => {
  const steps = advanceEffectSteps(mythosBefore, mythosAfter, 'phase')
  const discard = steps.find((s) => s.logKey === 'discardedBy')
  assert.equal(steps.filter((s) => s.logKey === 'discardedBy').length, 1)
  assert.equal(discard.grouped.length, 3)
  assert.deepEqual(discardedCardCodes(discard), ['c01166', 'c01165', 'c01163'])
  assert.equal(discardSourceCode(discard), 'c01143')
})

test('a discard of a card in play is never folded into a deck run', () => {
  const inPlay = i18n(7, 'discardedBy', { card: ref('RefCard', 'cg1', 'g1'), source: ref('RefAgenda', 'c01143', 'c01143') })
  const steps = advanceEffectSteps(mythosBefore, { ...mythosAfter, log: [...mythosAfter.log, inPlay] }, 'phase')
  assert.equal(steps.filter((s) => s.logKey === 'discardedBy').length, 2)
})

test('a drawn enemy appears once, on its spawn line, before it engages', () => {
  const steps = advanceEffectSteps(mythosBefore, mythosAfter, 'phase')
  const spawns = steps.filter((s) => s.kind === 'spawnEnemy')
  assert.equal(spawns.length, 1)
  assert.equal(spawns[0].logKey, 'enemySpawnedAt')
  const engage = steps.findIndex((s) => s.logKey === 'engages')
  assert.equal(steps[engage].kind, 'logged')
  assert.ok(steps.indexOf(spawns[0]) < engage)
})

test('removing a location settles whatever still pointed at it', () => {
  const steps = advanceEffectSteps(before, after).filter((s) => s.kind === 'changeScene')
  const board = stagedBoard(before, after, steps, 1)
  assertNoDangling(board)
  assert.equal(board.investigators.i1.location, 'hallway')
})
