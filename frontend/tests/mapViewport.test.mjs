import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

// mapViewport.ts is import-free on purpose so it can be loaded here without the Vue toolchain.
const source = readFileSync(new URL('../src/arkham/mapViewport.ts', import.meta.url), 'utf8')
const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
const { IDENTITY, MAX_SCALE, clampViewport, zoomAt, panBy, pinchStep, viewportTransform, isIdentity } = await import(
  'data:text/javascript;base64,' + Buffer.from(js).toString('base64')
)

const size = { width: 1000, height: 600 }
const close = (a, b, msg) => assert.ok(Math.abs(a - b) < 1e-9, `${msg}: ${a} vs ${b}`)

test('zooming never goes below 1 or above the maximum', () => {
  assert.equal(zoomAt(IDENTITY, 0.2, { x: 500, y: 300 }, size).scale, 1)
  assert.equal(zoomAt(IDENTITY, 50, { x: 500, y: 300 }, size).scale, MAX_SCALE)
})

test('zooming keeps the point under the pivot where it was', () => {
  const pivot = { x: 400, y: 200 }
  const v = zoomAt(IDENTITY, 2, pivot, size)
  // The pivot is in the middle of the picture, so no clamping interferes: its screen position is unchanged.
  close(v.tx + v.scale * pivot.x, pivot.x, 'x')
  close(v.ty + v.scale * pivot.y, pivot.y, 'y')
})

test('the picture cannot be dragged off its frame', () => {
  const zoomed = { scale: 2, tx: 0, ty: 0 }
  assert.deepEqual(panBy(zoomed, 300, 300, size), zoomed)
  const far = panBy(zoomed, -5000, -5000, size)
  assert.equal(far.tx, -1000)
  assert.equal(far.ty, -600)
})

test('a view that is not zoomed cannot pan at all', () => {
  assert.deepEqual(panBy(IDENTITY, 120, -80, size), IDENTITY)
})

test('zooming back out recentres a picture that was panned to an edge', () => {
  const edge = { scale: 3, tx: -2000, ty: -1200 }
  const out = zoomAt(edge, 1 / 3, { x: 500, y: 300 }, size)
  assert.equal(out.scale, 1)
  assert.equal(out.tx, 0)
  assert.equal(out.ty, 0)
})

test('spreading two fingers zooms in and moving them together pans', () => {
  const prev = [{ x: 400, y: 300 }, { x: 600, y: 300 }]
  const spread = [{ x: 300, y: 300 }, { x: 700, y: 300 }]
  const zoomed = pinchStep(prev, spread, IDENTITY, size)
  close(zoomed.scale, 2, 'scale')
  const shifted = pinchStep(spread, [{ x: 250, y: 300 }, { x: 650, y: 300 }], zoomed, size)
  close(shifted.scale, 2, 'scale unchanged')
  assert.ok(shifted.tx < zoomed.tx, 'dragging left moves the picture left')
})

test('fingers pinched together zoom out, never below 1', () => {
  const start = { scale: 1.5, tx: -100, ty: -50 }
  const out = pinchStep([{ x: 300, y: 300 }, { x: 700, y: 300 }], [{ x: 480, y: 300 }, { x: 520, y: 300 }], start, size)
  assert.equal(out.scale, 1)
})

test('clamping repairs a viewport left stale by a smaller frame', () => {
  const stale = { scale: 2, tx: -1500, ty: -900 }
  assert.deepEqual(clampViewport(stale, { width: 500, height: 300 }), { scale: 2, tx: -500, ty: -300 })
})

test('the stage only gets a transform when zoomed or panned', () => {
  assert.equal(viewportTransform(IDENTITY), undefined)
  assert.equal(isIdentity(IDENTITY), true)
  assert.equal(viewportTransform({ scale: 2, tx: -10, ty: -20 }), 'translate(-10px, -20px) scale(2)')
})
