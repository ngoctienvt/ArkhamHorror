import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

// endTurnAttention.ts is import-free on purpose so it can be loaded here without the Vue toolchain.
const source = readFileSync(new URL('../src/arkham/endTurnAttention.ts', import.meta.url), 'utf8')
const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
const { onlyEndTurnLeft, shouldPulseEndTurn } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))

const endTurn = { tag: 'EndTurnButton' }
const ability = { tag: 'AbilityLabel' }

test('test_end_turn_pulse_no_actions_left_pulses', () => {
  assert.equal(shouldPulseEndTurn(true, 0, [endTurn, ability]), true)
})

test('test_end_turn_pulse_only_end_turn_offered_pulses', () => {
  assert.equal(shouldPulseEndTurn(true, 2, [endTurn]), true)
  assert.equal(shouldPulseEndTurn(true, 2, [{ tag: 'InvalidLabel' }, endTurn]), true)
})

test('test_end_turn_pulse_other_choices_with_actions_stays_still', () => {
  assert.equal(shouldPulseEndTurn(true, 2, [endTurn, ability]), false)
})

test('test_end_turn_pulse_not_offered_never_pulses', () => {
  assert.equal(shouldPulseEndTurn(false, 0, []), false)
  assert.equal(onlyEndTurnLeft([]), false)
})
