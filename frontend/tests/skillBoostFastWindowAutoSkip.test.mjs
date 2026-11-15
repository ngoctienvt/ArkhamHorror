import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

// skill-boost-fast-window-auto-skip.ts is import-free on purpose, like skillTestSummary.ts.
const source = readFileSync(new URL('../src/arkham/skill-boost-fast-window-auto-skip.ts', import.meta.url), 'utf8')
const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
const { boostOnlyFastWindowSkip, isSkillBoostAbility } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))

// The engine's aeson encoding of `wantsSkillTest (YourSkillTest $ SkillTestWants #combat)`.
const wantsCombat = { tag: 'YourSkillTest', contents: { tag: 'SkillTestWants', contents: 'SkillCombat' } }
const boost = { tag: 'AbilityLabel', ability: { wantsSkillTest: wantsCombat } }
const otherFast = { tag: 'AbilityLabel', ability: { wantsSkillTest: { tag: 'YourSkillTest', contents: { tag: 'AnySkillTest' } } } }
const untagged = { tag: 'AbilityLabel', ability: { wantsSkillTest: null } }
const playableCard = { tag: 'TargetLabel' }
const skip = { tag: 'SkipTriggersButton' }

test('recognises skill boosts by their SkillTestWants matcher', () => {
  assert.equal(isSkillBoostAbility(boost.ability), true)
  assert.equal(isSkillBoostAbility(otherFast.ability), false)
  assert.equal(isSkillBoostAbility(untagged.ability), false)
  assert.equal(isSkillBoostAbility(undefined), false)
})

test('skips the pre-commit window when it offers only skill boosts', () => {
  assert.equal(boostOnlyFastWindowSkip('SkillTestFastWindow1', [boost, boost, skip]), 2)
})

test('stops when anything other than a boost is on offer', () => {
  assert.equal(boostOnlyFastWindowSkip('SkillTestFastWindow1', [boost, otherFast, skip]), -1)
  assert.equal(boostOnlyFastWindowSkip('SkillTestFastWindow1', [boost, untagged, skip]), -1)
  assert.equal(boostOnlyFastWindowSkip('SkillTestFastWindow1', [boost, playableCard, skip]), -1)
})

test('never skips the window after committing, or a window with no skip button', () => {
  assert.equal(boostOnlyFastWindowSkip('SkillTestFastWindow2', [boost, skip]), -1)
  assert.equal(boostOnlyFastWindowSkip('SkillTestFastWindow1', [boost]), -1)
  assert.equal(boostOnlyFastWindowSkip('SkillTestFastWindow1', [skip]), -1)
  assert.equal(boostOnlyFastWindowSkip(undefined, [boost, skip]), -1)
})
