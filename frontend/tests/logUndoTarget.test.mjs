import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

const source = readFileSync(new URL('../src/arkham/logUndoTarget.ts', import.meta.url), 'utf8')
const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
const { undoTargetFor } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))

const entry = (seq, step, kind = 'Event') => ({ seq, step, kind })

test('undoing a skill test begun by an earlier damage prompt does not ask for that damage again', () => {
  // Arrange: answering the damage prompt (step 41) assigned it and began the test;
  // the commit window (42) was answered since.
  const damage = entry(1, 41)
  const testBegins = entry(2, 41)
  const log = [entry(0, 40), damage, testBegins, entry(3, 42), entry(4, 43)]
  // Act
  const target = undoTargetFor(log, testBegins)
  // Assert: back to the commit window, the damage assignment kept.
  assert.equal(target, 42)
})

test('the first line an answer wrote still undoes to just before it', () => {
  const action = entry(1, 41)
  const log = [entry(0, 40), action, entry(2, 41), entry(3, 43)]
  assert.equal(undoTargetFor(log, action), 41)
})

test('a chain line falls back to its own step when the decision after it is the one open now', () => {
  const later = entry(2, 41)
  const log = [entry(1, 41), later, entry(3, 42)]
  assert.equal(undoTargetFor(log, later), 41)
})

test('chat neither opens a step nor proves the game moved on', () => {
  const line = entry(2, 41)
  const log = [entry(1, 41, 'Chat'), line, entry(3, 45, 'Chat')]
  assert.equal(undoTargetFor(log, line), 41)
})

test('a line with no step has no undo target', () => {
  assert.equal(undoTargetFor([], entry(1, null)), null)
})
