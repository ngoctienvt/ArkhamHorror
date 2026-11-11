import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

const source = readFileSync(new URL('../src/arkham/missionStripSetup.ts', import.meta.url), 'utf8')
const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
const { missionAwaitingSetup } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))

test('investigator setup, before the scenario places its decks: awaiting', () => {
  assert.equal(missionAwaitingSetup({ inSetup: true, acts: {}, agendas: {} }), true)
})

test('setup already placed the act and agenda: not awaiting', () => {
  assert.equal(missionAwaitingSetup({ inSetup: true, acts: { a: {} }, agendas: { g: {} } }), false)
})

test('scenario under way with no act or agenda left (resolving): not awaiting', () => {
  assert.equal(missionAwaitingSetup({ inSetup: false, acts: {}, agendas: {} }), false)
})

test('only one of the two placed: not awaiting', () => {
  assert.equal(missionAwaitingSetup({ inSetup: true, acts: {}, agendas: { g: {} } }), false)
})
