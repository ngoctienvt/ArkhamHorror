import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

// touchLayout.ts is import-free on purpose so it can be loaded here without the Vue toolchain.
const source = readFileSync(new URL('../src/arkham/touchLayout.ts', import.meta.url), 'utf8')
const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
const { layoutClassFor, inputModeFor } = await import(
  'data:text/javascript;base64,' + Buffer.from(js).toString('base64')
)

test('phones are phones whatever the pointer', () => {
  assert.equal(layoutClassFor(390, true), 'phone')
  assert.equal(layoutClassFor(743, true), 'phone')
  assert.equal(layoutClassFor(500, false), 'phone')
})

test('iPad sizes held upright are tablet-portrait', () => {
  for (const w of [744, 810, 820, 834, 1023]) assert.equal(layoutClassFor(w, true), 'tablet-portrait', String(w))
})

test('iPad sizes held sideways are tablet-landscape', () => {
  for (const w of [1024, 1080, 1180, 1194, 1366]) assert.equal(layoutClassFor(w, true), 'tablet-landscape', String(w))
})

test('a mouse-driven window of tablet width keeps the desktop layout', () => {
  for (const w of [744, 900, 1180, 1366]) assert.equal(layoutClassFor(w, false), 'desktop', String(w))
})

test('wide touch screens are desktop', () => {
  assert.equal(layoutClassFor(1367, true), 'desktop')
  assert.equal(layoutClassFor(1920, true), 'desktop')
})

test('touch input needs a coarse pointer and no hover', () => {
  assert.equal(inputModeFor(true, false), 'touch')
  assert.equal(inputModeFor(true, true), 'mouse') // touch laptop with a trackpad
  assert.equal(inputModeFor(false, true), 'mouse')
  assert.equal(inputModeFor(false, false), 'mouse')
})
