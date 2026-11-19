import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

const source = readFileSync(new URL('../src/arkham/forced-effect-log.ts', import.meta.url), 'utf8')
const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
const { forcedEffectLogEntries } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))
const line = (seq, key, children = [], kind = 'Action') => ({
  seq, step: seq, kind, body: [{ tag: 'LogI18n', contents: [key, {}] }], children,
})

test('a Forced activation with no consequence displays nothing', () => {
  assert.deepEqual(forcedEffectLogEntries([line(1, 'log.triggersForcedAbility')]), [])
})

test('keeps actual consequences and other activations without mutating the source stream', () => {
  const entries = [line(1, 'log.triggersForcedAbility'), line(2, 'log.takesDamage'), line(3, 'log.triggersAbility')]
  const before = structuredClone(entries)
  assert.deepEqual(forcedEffectLogEntries(entries), entries.slice(1))
  assert.deepEqual(entries, before)
})

test('preserves nested consequences and their undo steps when removing activation lines', () => {
  const effect = line(2, 'log.takesHorror')
  const entries = [line(1, 'log.triggersForcedAbility', [effect])]
  assert.deepEqual(forcedEffectLogEntries(entries), [effect])
  assert.deepEqual(forcedEffectLogEntries([line(3, 'log.test', entries)]), [line(3, 'log.test', [effect])])
})

test('preserves narrative, chat and mixed entries', () => {
  const entries = [line(1, 'log.triggersForcedAbility', [], 'Chat'), line(2, 'log.story', [], 'Narrative')]
  const mixed = line(3, 'log.triggersForcedAbility')
  mixed.body.push({ tag: 'LogText', contents: 'Actual effect' })
  entries.push(mixed)
  assert.deepEqual(forcedEffectLogEntries(entries), entries)
})
