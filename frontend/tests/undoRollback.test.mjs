import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

// Both modules are import-free on purpose, like sfxEvents.ts.
const load = async (path) => {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8')
  const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
  return import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))
}
const { isRollback } = await load('../src/arkham/undoRollback.ts')
const { trackSkillTest } = await load('../src/arkham/skillTestSummary.ts')
const { newlyDrawnTokenIds } = await load('../src/arkham/chaosDrawReveal.ts')

const game = (o = {}) => ({ id: 'g1', scenarioSteps: 10, scenario: { id: 's1' }, ...o })

test('a lower step count in the same scenario is a rollback', () => {
  assert.equal(isRollback(game(), game({ scenarioSteps: 9 })), true)
  assert.equal(isRollback(game(), game({ scenarioSteps: 1 })), true)
})

test('the game moving forward or standing still is not a rollback', () => {
  assert.equal(isRollback(game(), game({ scenarioSteps: 11 })), false)
  assert.equal(isRollback(game(), game()), false)
})

test('the first state, another game and a new scenario are not rollbacks', () => {
  assert.equal(isRollback(null, game()), false)
  assert.equal(isRollback(game(), game({ id: 'g2', scenarioSteps: 1 })), false)
  assert.equal(isRollback(game(), game({ scenario: { id: 's2' }, scenarioSteps: 1 })), false)
})

/* Why the rollback has to be noticed: fed to the trackers as an ordinary update,
 * an undo reads as the game moving forward. */
test('an undone skill test looks like a finished one to the tracker', () => {
  const skillTest = { id: 't1', investigator: 'i1', skills: [], revealedChaosTokens: [{ face: 'Skull' }] }
  const results = { skillTestResultsSuccess: true, skillTestResultsSkillValue: 4, skillTestResultsDifficulty: 2 }
  const resolving = game({ skillTest, skillTestResults: results, investigators: { i1: { tokens: {}, hand: [] } } })
  const undone = game({ scenarioSteps: 7, skillTest: null, investigators: { i1: { tokens: {}, hand: [] } } })

  const { tracker } = trackSkillTest(null, null, resolving)
  assert.notEqual(trackSkillTest(tracker, resolving, undone).summary, null)
  assert.equal(isRollback(resolving, undone), true)
  // With the tracker dropped, as a rollback now does, there is nothing to summarise.
  assert.equal(trackSkillTest(null, resolving, undone).summary, null)
})

test('undoing back into a skill test looks like a fresh token draw', () => {
  const after = game({ skillTest: null, skillTestChaosTokens: [] })
  const during = game({ scenarioSteps: 9, skillTest: { id: 't1' }, skillTestChaosTokens: [{ id: 'tok1' }] })

  assert.deepEqual(newlyDrawnTokenIds(after, during), ['tok1'])
  assert.equal(isRollback(after, during), true)
  // Compared against nothing, as a rollback now is, the draw is not replayed.
  assert.deepEqual(newlyDrawnTokenIds(null, during), [])
})
