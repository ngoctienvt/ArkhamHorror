import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

// chaosDrawReveal.ts is import-free on purpose, like sfxEvents.ts.
const source = readFileSync(new URL('../src/arkham/chaosDrawReveal.ts', import.meta.url), 'utf8')
const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
const {
  isChaosDrawStyle,
  newlyDrawnTokenIds,
  drawDurationMs,
  reelStrip,
  splitSpoilerSfx,
} = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))

const tok = (id) => ({ id })
const test1 = { id: 't1' }

test('only known styles are accepted from storage', () => {
  assert.equal(isChaosDrawStyle('bag'), true)
  assert.equal(isChaosDrawStyle('reel'), true)
  assert.equal(isChaosDrawStyle('off'), true)
  assert.equal(isChaosDrawStyle('slot'), false)
  assert.equal(isChaosDrawStyle(null), false)
})

test('the first state and updates outside a skill test draw nothing', () => {
  assert.deepEqual(newlyDrawnTokenIds(null, { skillTest: test1, skillTestChaosTokens: [tok('a')] }), [])
  assert.deepEqual(newlyDrawnTokenIds({ skillTestChaosTokens: [] }, { skillTest: null, skillTestChaosTokens: [tok('a')] }), [])
})

test('tokens new to this update are the ones drawn', () => {
  const before = { skillTest: test1, skillTestChaosTokens: [tok('a')] }
  const after = { skillTest: test1, skillTestChaosTokens: [tok('a'), tok('b'), tok('c')] }
  assert.deepEqual(newlyDrawnTokenIds(before, after), ['b', 'c'])
  assert.deepEqual(newlyDrawnTokenIds(after, after), [])
})

test('the pause grows with extra tokens but is capped', () => {
  assert.equal(drawDurationMs('off', 1), 0)
  assert.equal(drawDurationMs('bag', 0), 0)
  assert.equal(drawDurationMs('bag', 1), 1400)
  assert.equal(drawDurationMs('reel', 2), 2150)
  assert.equal(drawDurationMs('bag', 10), drawDurationMs('bag', 4))
})

test('a reel ends on the drawn face, never repeating a face back to back', () => {
  let n = 0
  const random = () => ((n++ * 0.37) % 1)
  const strip = reelStrip(['Skull', 'M1', 'Zero', 'ElderSign'], 'Skull', 12, random)
  assert.equal(strip.length, 12)
  assert.equal(strip.at(-1), 'Skull')
  assert.notEqual(strip.at(-2), 'Skull')
  for (let i = 1; i < strip.length; i++) assert.notEqual(strip[i], strip[i - 1])
})

test('a reel over an empty or one-face bag still lands', () => {
  assert.deepEqual(reelStrip([], 'AutoFail', 3), ['AutoFail', 'AutoFail', 'AutoFail'])
  assert.deepEqual(reelStrip(['M1'], 'M1', 1), ['M1'])
})

test('sounds that give the result away wait for the reveal', () => {
  assert.deepEqual(splitSpoilerSfx(['move', 'token', 'fail']), { now: ['move'], afterReveal: ['token', 'fail'] })
})
