import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

/* Written in Rock, Standalone Mode: a location pushed out of the grid is left off the map, like on the card board. */
const toUrl = (src) => 'data:text/javascript;base64,' + Buffer.from(ts.transpile(src, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })).toString('base64')
const { isOffGrid } = await import(toUrl(readFileSync(new URL('../src/arkham/written-in-rock-caves.ts', import.meta.url), 'utf8')))

const layout = ['  .    x2y4  .    .    .  ', 'x1y3 .  x3y3 . x5y3', 'x1y1 x2y1 x3y1 x4y1 x5y1']

test('written in rock: a label with a cell is drawn', () => {
  assert.equal(isOffGrid('c10501', layout, 'x3y1'), false)
  assert.equal(isOffGrid('c10501', layout, 'x2y4'), false)
})

test('written in rock: a label the layout has no cell for is left off the map', () => {
  assert.equal(isOffGrid('c10501', layout, 'x9y9'), true)
  assert.equal(isOffGrid('c10501', layout, ''), true)
})

test('written in rock: no layout yet, or another scenario, draws everything', () => {
  assert.equal(isOffGrid('c10501', null, 'x9y9'), false)
  assert.equal(isOffGrid('c10501', [], 'x9y9'), false)
  assert.equal(isOffGrid('c10549', layout, 'x9y9'), false)
})
