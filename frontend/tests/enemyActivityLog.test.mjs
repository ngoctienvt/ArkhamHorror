import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

// enemyActivityLog.ts is import-free on purpose, like chaosRevealLog.ts.
const source = readFileSync(new URL('../src/arkham/enemyActivityLog.ts', import.meta.url), 'utf8')
const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
const { enemyActivityAfter } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))

const ref = (entityId) => ({ tag: 'LogRefPart', contents: { kind: 'RefEnemy', name: 'Ghoul', entityId } })
const line = (seq, key, vars, children = []) => ({ seq, body: [{ tag: 'LogI18n', contents: [key, vars] }], children })

test('test_enemyActivity_moveAndAttackLines_returnsEnemyIdsOldestFirst', () => {
  // Arrange
  const entries = [
    line(1, 'log.enemyMovesTo', { enemy: ref('e1'), location: { tag: 'LogText', contents: 'Hall' } }),
    line(2, 'log.enemyAttacks', { enemy: ref('e2'), target: { tag: 'LogList', contents: [] } }),
  ]
  // Act
  const found = enemyActivityAfter(entries, 0)
  // Assert
  assert.deepEqual(found, [
    { seq: 1, enemyId: 'e1', kind: 'move' },
    { seq: 2, enemyId: 'e2', kind: 'attack' },
  ])
})

test('test_enemyActivity_linesAtOrBeforeCursor_areSkipped', () => {
  // Arrange
  const entries = [line(4, 'log.enemyAttacks', { enemy: ref('e1') }), line(5, 'log.enemyMovesTo', { enemy: ref('e2') })]
  // Act
  const found = enemyActivityAfter(entries, 4)
  // Assert
  assert.deepEqual(found.map((a) => a.enemyId), ['e2'])
})

test('test_enemyActivity_nestedAndUnrelatedLines_onlyNestedEnemyLinesCount', () => {
  // Arrange
  const entries = [
    line(7, 'log.enemyHealed', { enemy: ref('e9') }, [line(7, 'log.enemyAttacks', { enemy: ref('e3') })]),
    line(8, 'log.enemyAttacks', { enemy: { tag: 'LogText', contents: 'something' } }),
    { seq: 9, body: [{ tag: 'LogText', contents: 'plain' }] },
  ]
  // Act
  const found = enemyActivityAfter(entries, 0)
  // Assert
  assert.deepEqual(found, [{ seq: 7, enemyId: 'e3', kind: 'attack' }])
})
