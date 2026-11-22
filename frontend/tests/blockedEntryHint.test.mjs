import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

const source = readFileSync(new URL('../src/arkham/blockedEntryHint.ts', import.meta.url), 'utf8')
const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
const { entryBlocked, blockedReason } = await import(
  'data:text/javascript;base64,' + Buffer.from(js).toString('base64')
)

const flag = (contents) => ({ type: { tag: 'OtherModifier', contents } })

test('a location is blocked by the Blocked flag or a cannot-enter modifier', () => {
  assert.equal(entryBlocked([flag('Blocked')]), true)
  assert.equal(entryBlocked([{ type: { tag: 'CannotEnter', contents: 'x' } }]), true)
  assert.equal(entryBlocked([flag('Something')]), false)
  assert.equal(entryBlocked(null), false)
})

test('the blocked reason is the location text as plain prose', () => {
  assert.equal(blockedReason('<i>The entrance to the Parlor\nis blocked.</i>'), 'The entrance to the Parlor is blocked.')
  assert.equal(blockedReason('  <b></b> '), null)
  assert.equal(blockedReason(null), null)
})
