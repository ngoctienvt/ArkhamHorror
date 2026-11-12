import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

const source = readFileSync(new URL('../src/arkham/scene-storm.ts', import.meta.url), 'utf8')
const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
const { rainDropCount, makeDrop, makeRain, advanceDrop, nextLightningDelay, RAIN_SLANT, MAX_PER_LAYER } =
  await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))

/** A repeatable stand-in for Math.random. */
const seeded = (seed = 1) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }

test('rain density grows with the stage, has a ceiling and stops on an empty stage', () => {
  assert.equal(rainDropCount('far', 0, 500), 0)
  assert.ok(rainDropCount('far', 1600, 900) > rainDropCount('far', 800, 450))
  assert.ok(rainDropCount('far', 1600, 900) > rainDropCount('near', 1600, 900), 'far rain is denser than near rain')
  assert.equal(rainDropCount('far', 20000, 20000), MAX_PER_LAYER)
})

test('rain stays sparse so it never distracts from the board: under 150 drops on a 1600×900 map', () => {
  assert.ok(rainDropCount('far', 1600, 900) + rainDropCount('near', 1600, 900) < 150)
})

test('the whole rain starts on the stage, far drops before near ones', () => {
  const rain = makeRain(1000, 600, seeded())
  assert.equal(rain.length, rainDropCount('far', 1000, 600) + rainDropCount('near', 1000, 600))
  assert.equal(rain.findIndex((d) => d.layer === 'near'), rainDropCount('far', 1000, 600))
  for (const d of rain) assert.ok(d.y >= 0 && d.y <= 600)
})

test('a drop falls down and blows right, and starts again above the top once it leaves the stage', () => {
  const rand = seeded(7)
  const drop = { layer: 'near', x: 100, y: 100, length: 20, speed: 800 }
  const next = advanceDrop(drop, 0.1, 1000, 600, rand)
  assert.deepEqual(next, { ...drop, x: 100 + 80 * RAIN_SLANT, y: 180 })
  assert.equal(drop.y, 100, 'the old drop is left as it was')
  const respawned = advanceDrop({ ...drop, y: 590 }, 0.1, 1000, 600, rand)
  assert.ok(respawned.y < 0, 'back above the top edge')
  assert.equal(respawned.layer, 'near')
  assert.ok(makeDrop('far', 1000, 600, rand, false).y < 0)
})

test('lightning is rare: between 18 and 50 seconds apart', () => {
  assert.equal(nextLightningDelay(() => 0), 18000)
  assert.equal(nextLightningDelay(() => 1), 50000)
})
