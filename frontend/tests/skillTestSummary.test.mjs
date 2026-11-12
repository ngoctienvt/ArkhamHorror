import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

// skillTestSummary.ts is import-free on purpose, like sfxEvents.ts.
const source = readFileSync(new URL('../src/arkham/skillTestSummary.ts', import.meta.url), 'utf8')
const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
const { trackSkillTest, resultMargin, skillTestLogEntries, skillTestOutcome, withoutCosts, boardHeldForSummary } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))

const card = (id) => ({ tag: 'PlayerCard', contents: { id } })
const inv = (o = {}) => ({ tokens: {}, hand: [card('c1'), card('c2')], ...o })
const results = (o = {}) => ({
  skillTestResultsSkillValue: 4,
  skillTestResultsIconValue: 1,
  skillTestResultsChaosTokensValue: -1,
  skillTestResultsDifficulty: 2,
  skillTestResultsResultModifiers: null,
  skillTestResultsSuccess: true,
  ...o,
})
const skillTest = (o = {}) => ({
  id: 't1',
  investigator: 'i1',
  action: 'Investigate',
  skills: ['SkillIntellect'],
  target: { tag: 'LocationTarget', contents: 'loc' },
  revealedChaosTokens: [{ face: 'Skull' }],
  resolvedChaosTokens: [],
  ...o,
})
const game = (o = {}) => ({ skillTest: null, skillTestResults: null, investigators: { i1: inv() }, enemies: {}, ...o })

/* Runs a list of states through the tracker the way Game.vue does. */
function run(states) {
  let tracker = null
  let previous = null
  let summary = null
  for (const next of states) {
    const out = trackSkillTest(tracker, previous, next)
    tracker = out.tracker
    summary = out.summary ?? summary
    previous = next
  }
  return summary
}

test('test_skillTestSummary_investigateSucceeds_reportsCluesAndMargin', () => {
  // Arrange
  const before = game()
  const running = game({ skillTest: skillTest(), investigators: { i1: inv({ hand: [card('c1')] }) } })
  const resolved = game({ skillTest: skillTest(), skillTestResults: results(), investigators: { i1: inv({ hand: [card('c1')] }) } })
  const after = game({ investigators: { i1: inv({ tokens: { Clue: 1 }, hand: [card('c1')] }) } })

  // Act
  const summary = run([before, running, resolved, after])

  // Assert
  assert.equal(summary.success, true)
  assert.equal(summary.margin, 2)
  assert.deepEqual(summary.tokenFaces, ['Skull'])
  assert.deepEqual(summary.lines, [{ kind: 'clues', amount: 1 }])
})

test('test_skillTestSummary_committedCardLeavesHand_isNotCountedAsDraw', () => {
  // Arrange: c2 is committed, c3 is drawn by a "draw 1 card" reward
  const states = [
    game(),
    game({ skillTest: skillTest(), skillTestResults: results() }),
    game({ investigators: { i1: inv({ hand: [card('c1'), card('c3')] }) } }),
  ]

  // Act
  const summary = run(states)

  // Assert
  assert.deepEqual(summary.lines, [{ kind: 'cardsDrawn', amount: 1 }])
})

test('test_skillTestSummary_failedWithSkullHorror_reportsHorrorTaken', () => {
  // Arrange
  const states = [
    game(),
    game({ skillTest: skillTest(), skillTestResults: results({ skillTestResultsSuccess: false, skillTestResultsSkillValue: 1 }) }),
    game({ investigators: { i1: inv({ tokens: { Horror: 1 } }) } }),
  ]

  // Act
  const summary = run(states)

  // Assert
  assert.equal(summary.success, false)
  assert.equal(summary.margin, 1)
  assert.deepEqual(summary.lines, [{ kind: 'horror', amount: 1 }])
})

test('test_skillTestSummary_fightKillsEnemy_reportsDefeat', () => {
  // Arrange
  const fight = skillTest({ action: 'Fight', target: { tag: 'EnemyTarget', contents: 'e1' } })
  const states = [
    game({ enemies: { e1: { tokens: { Damage: 1 } } } }),
    game({ skillTest: fight, skillTestResults: results(), enemies: { e1: { tokens: { Damage: 1 } } } }),
    game({ enemies: {} }),
  ]

  // Act
  const summary = run(states)

  // Assert
  assert.deepEqual(summary.lines, [{ kind: 'enemyDefeated', amount: 1 }])
})

test('test_skillTestSummary_fightWoundsAndEvadeSucceeds_reportsEach', () => {
  // Arrange
  const fight = skillTest({ action: 'Fight', target: { tag: 'EnemyTarget', contents: 'e1' } })
  const evade = skillTest({ id: 't2', action: 'Evade', target: { tag: 'EnemyTarget', contents: 'e1' } })

  // Act
  const fought = run([
    game({ enemies: { e1: { tokens: {} } } }),
    game({ skillTest: fight, skillTestResults: results(), enemies: { e1: { tokens: {} } } }),
    game({ enemies: { e1: { tokens: { Damage: 2 } } } }),
  ])
  const evaded = run([
    game({ enemies: { e1: { tokens: {} } } }),
    game({ skillTest: evade, skillTestResults: results(), enemies: { e1: { tokens: {} } } }),
    game({ enemies: { e1: { tokens: {} } } }),
  ])

  // Assert
  assert.deepEqual(fought.lines, [{ kind: 'enemyDamage', amount: 2 }])
  assert.deepEqual(evaded.lines, [{ kind: 'enemyEvaded', amount: 1 }])
})

test('test_skillTestSummary_cancelledOrUnchanged_givesNoSummaryOrNoLines', () => {
  // Arrange / Act
  const cancelled = run([game(), game({ skillTest: skillTest() }), game()])
  const nothing = run([game(), game({ skillTest: skillTest(), skillTestResults: results() }), game()])

  // Assert
  assert.equal(cancelled, null)
  assert.deepEqual(nothing.lines, [])
})

test('test_skillTestSummary_backToBackTests_summariseTheLastOneFromItsOwnStart', () => {
  // Arrange: a second test starts straight from the first, no gap between them
  const second = skillTest({ id: 't2' })
  const states = [
    game(),
    game({ skillTest: skillTest(), skillTestResults: results() }),
    game({ skillTest: second, investigators: { i1: inv({ tokens: { Clue: 1 } }) } }),
    game({ skillTest: second, skillTestResults: results(), investigators: { i1: inv({ tokens: { Clue: 1 } }) } }),
    game({ investigators: { i1: inv({ tokens: { Clue: 1, Resource: 2 } }) } }),
  ]

  // Act
  const summary = run(states)

  // Assert
  assert.equal(summary.testId, 't2')
  assert.deepEqual(summary.lines, [{ kind: 'resources', amount: 2 }])
})

test('test_skillTestSummary_forcedResult_usesEngineValue', () => {
  // Arrange
  const forced = skillTest({ resultForced: true, result: { tag: 'SucceededBy', contents: [true, 3] } })

  // Act
  const margin = resultMargin(forced, results())

  // Assert
  assert.equal(margin, 3)
})

test('test_skillTestSummary_logEntries_keepOnlyTheTestsMemberLines', () => {
  const g = (id, role) => ({ group: { id, role } })
  const entries = [
    { n: 'other', group: null },
    { n: 'header', ...g('skillTest:t1', 'GroupHeader') },
    { n: 'discarded', ...g('skillTest:t1', 'GroupMember') },
    { n: 'nested', ...g('navigate:x/skillTest:t1', 'GroupMember') },
    { n: 'result', ...g('skillTest:t1', 'GroupSummary') },
    { n: 'otherTest', ...g('skillTest:t2', 'GroupMember') },
  ]
  assert.deepEqual(skillTestLogEntries(entries, 't1').map((e) => e.n), ['discarded', 'nested'])
})

test('test_skillTestSummary_outcome_dropsPlayByPlayAndRefundsCosts', () => {
  const ref = (entityId) => ({ tag: 'LogRefPart', contents: { kind: 'RefInvestigator', name: 'Kate', cardCode: null, cardId: null, entityId, faceDown: false } })
  const line = (key, vars, kind = 'Mechanic') => ({ kind, body: [{ tag: 'LogI18n', contents: [key, vars] }] })
  const entries = [
    line('log.activatesAbility', { investigator: ref('i1') }),
    line('log.spendsResources', { investigator: ref('i1'), count: { tag: 'LogNumber', contents: 1 } }),
    line('log.spendsResources', { investigator: ref('i1'), count: { tag: 'LogNumber', contents: 1 } }),
    line('log.drawsChaosTokens', { investigator: ref('i1') }),
    line('log.testBreakdown', {}),
    line('log.takesHorror', { target: ref('i1') }),
    line('log.takesHorror', { target: ref('ally') }),
    line('log.discarded', { card: ref('tr1') }),
  ]
  const { events, resourcesSpent } = skillTestOutcome(entries, 'i1')
  assert.equal(resourcesSpent, 2)
  assert.deepEqual(events.map((e) => e.body[0].contents[0]), ['log.takesHorror', 'log.discarded'])
  assert.equal(events[0].body[0].contents[1].target.contents.entityId, 'ally')
  assert.deepEqual(withoutCosts([{ kind: 'resources', amount: -2 }, { kind: 'horror', amount: 1 }], 2), [{ kind: 'horror', amount: 1 }])
})

test('test_skillTestSummary_failPutsWeaknessInThreatArea_reportsTheCard', () => {
  // Arrange: a failed test whose effect puts a treachery (Poisoned) into the threat area, which the engine does not log
  const before = game({ investigators: { i1: inv({ treacheries: ['tOld'] }) }, treacheries: { tOld: { cardCode: 'c08130' } } })
  const running = game({ skillTest: skillTest(), investigators: { i1: inv({ treacheries: ['tOld'] }) }, treacheries: { tOld: { cardCode: 'c08130' } } })
  const resolved = game({ skillTest: skillTest(), skillTestResults: results({ skillTestResultsSuccess: false }), investigators: { i1: inv({ treacheries: ['tOld'] }) }, treacheries: { tOld: { cardCode: 'c08130' } } })
  const after = game({ investigators: { i1: inv({ treacheries: ['tOld', 'tNew'] }) }, treacheries: { tOld: { cardCode: 'c08130' }, tNew: { cardCode: 'c04102' } } })

  // Act
  const summary = run([before, running, resolved, after])

  // Assert: only the card that arrived is reported
  assert.deepEqual(summary.lines.filter((l) => l.kind === 'threatArea'), [{ kind: 'threatArea', amount: 1, cardCode: 'c04102' }])
})

test('test_skillTestSummary_boardHeldForSummary_keepsBoardDropsTestAndQuestion', () => {
  // Arrange: the board as the test was resolving, still carrying the test and its question
  const resolving = { ...game({ skillTest: skillTest(), skillTestResults: results() }), question: { p1: { tag: 'ChooseOne' } }, agendas: { a1: { id: 'a1' } } }

  // Act
  const held = boardHeldForSummary(resolving)

  // Assert: the board stays as it was, without the test panel or anything to answer
  assert.equal(held.skillTest, null)
  assert.equal(held.skillTestResults, null)
  assert.deepEqual(held.question, {})
  assert.deepEqual(held.agendas, { a1: { id: 'a1' } })
  assert.notEqual(resolving.skillTest, null)
})
