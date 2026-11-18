import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

// These modules are import-free on purpose so they can be loaded here without the Vue toolchain.
const load = async (file) => {
  const source = readFileSync(new URL(`../src/arkham/${file}`, import.meta.url), 'utf8')
  const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
  return import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))
}
const { widthClassFor, isShortMap, barModeFor } = await load('touchLayout.ts')
const { panelModeFor, offeredLineIndexes } = await load('location-panel-mode.ts')
const { plateShifts, badgeSlide } = await load('map-plate-collision.ts')

test('the map width picks the size class at its thresholds', () => {
  assert.equal(widthClassFor(375), 'narrow')
  assert.equal(widthClassFor(699), 'narrow')
  assert.equal(widthClassFor(700), 'medium')
  assert.equal(widthClassFor(1099), 'medium')
  assert.equal(widthClassFor(1100), 'wide')
  assert.equal(widthClassFor(1605), 'wide')
})

test('a width just past a threshold keeps the class it had', () => {
  assert.equal(widthClassFor(705, 'narrow'), 'narrow')
  assert.equal(widthClassFor(716, 'narrow'), 'medium')
  assert.equal(widthClassFor(690, 'medium'), 'medium')
  assert.equal(widthClassFor(683, 'medium'), 'narrow')
  assert.equal(widthClassFor(1090, 'wide'), 'wide')
  assert.equal(widthClassFor(1000, 'wide'), 'medium')
  assert.equal(widthClassFor(500, 'wide'), 'narrow')
})

test('a map area under 420px high is short; an unmeasured one is not', () => {
  assert.equal(isShortMap(351), true)
  assert.equal(isShortMap(419), true)
  assert.equal(isShortMap(420), false)
  assert.equal(isShortMap(0), false)
})

test('the controls ride in the game bar only while its free room fits the core buttons', () => {
  assert.deepEqual(barModeFor(703, 1125), { inGameBar: true, collapsed: false })
  assert.deepEqual(barModeFor(400, 753), { inGameBar: true, collapsed: true })
  assert.deepEqual(barModeFor(287, 753), { inGameBar: false, collapsed: false })
  assert.deepEqual(barModeFor(0, 375), { inGameBar: false, collapsed: true })
})

test('the panel only switches to viewing for a location other than the one you stand on', () => {
  assert.equal(panelModeFor(null, 'a'), 'here')
  assert.equal(panelModeFor('a', 'a'), 'here')
  assert.equal(panelModeFor('b', 'a'), 'viewing')
  assert.equal(panelModeFor('b', null), 'viewing')
})

test('printed lines already on offer as buttons are left out of the about block', () => {
  assert.deepEqual([...offeredLineIndexes(['constant', 'action'], ['action'])], [1])
  assert.deepEqual([...offeredLineIndexes(['action', 'forced', 'action'], ['action', 'action'])], [0, 2])
  // One offer for two printed actions: no telling which, so both stay.
  assert.deepEqual([...offeredLineIndexes(['action', 'action'], ['action'])], [])
  assert.deepEqual([...offeredLineIndexes(['forced', 'constant'], [])], [])
})

const box = (id, cx, cy, hw = 8, hh = 2) => ({ id, cx, cy, hw, hh })
const overlap = (a, b) => Math.abs(a.cx - b.cx) < a.hw + b.hw && Math.abs(a.cy - b.cy) < a.hh + b.hh

test('plates that do not touch are left where they are', () => {
  assert.deepEqual(plateShifts([box('a', 20, 20), box('b', 60, 20), box('c', 20, 60)]), {})
})

test('overlapping plates are pulled apart, the upper one moving up', () => {
  const boxes = [box('a', 40, 50), box('b', 46, 51)]
  const shifts = plateShifts(boxes)
  assert.deepEqual(Object.keys(shifts), ['a'])
  assert.ok(shifts.a < 0)
  const moved = boxes.map((b) => ({ ...b, cy: b.cy + (shifts[b.id] ?? 0) }))
  assert.equal(overlap(moved[0], moved[1]), false)
})

test('a plate at the top edge moves down instead of off the stage', () => {
  const shifts = plateShifts([box('a', 40, 2.5), box('b', 44, 3)])
  assert.ok(shifts.a > 0)
})

test('a dragged plate stays put and the same input gives the same shifts', () => {
  const boxes = [box('a', 40, 50), box('b', 46, 51)]
  const shifts = plateShifts(boxes, { fixed: new Set(['a']) })
  assert.deepEqual(Object.keys(shifts), ['b'])
  assert.deepEqual(plateShifts(boxes), plateShifts([...boxes].reverse()))
})

test('a link badge slides along its link until it is off every plate', () => {
  const badge = { id: 'x', cx: 50, cy: 50, hw: 1.5, hh: 2 }
  assert.equal(badgeSlide(badge, [1, 0], 10, [box('a', 80, 50)]), 0)
  const along = badgeSlide(badge, [1, 0], 12, [box('a', 52, 50, 4, 2)])
  assert.notEqual(along, 0)
  assert.ok(Math.abs(50 + along - 52) >= 4 + 1.5)
  // Nowhere to go within reach: stay put.
  assert.equal(badgeSlide(badge, [1, 0], 2, [box('a', 50, 50, 20, 5)]), 0)
})
