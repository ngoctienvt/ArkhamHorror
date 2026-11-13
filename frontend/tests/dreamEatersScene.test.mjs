import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

function moduleUrl(file, graphUrl) {
  const source = readFileSync(new URL(`../src/arkham/${file}.ts`, import.meta.url), 'utf8')
  let js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
  if (graphUrl) js = js.replace("'./locationGraph'", JSON.stringify(graphUrl))
  return 'data:text/javascript;base64,' + Buffer.from(js).toString('base64')
}

const { dreamGridPositions, weaverEnemies, stairsRotation, clockwiseArc, webRingPoint, STAIRS_FOLDER, WEAVER_FOLDER, WEB_RING } = await import(
  moduleUrl('dream-eaters-scene-model', moduleUrl('locationGraph'))
)
const { islandImage, islandAspect, islandSetFiles } = await import(moduleUrl('scene-island-sprites'))

test('Weaver follows the span centers of the real backend Act 2 layout', () => {
  const backend = readFileSync(new URL('../../backend/arkham-api/library/Arkham/Act/Cards/TheDreamEaters/WeaverOfTheCosmos/JourneyAcrossTheBridge.hs', import.meta.url), 'utf8')
  const rows = [...backend.matchAll(/"([.a-zA-Z0-9 ]+)"/g)].map((match) => match[1]).filter((row) => row.trim().split(/\s+/).length === 12)
  assert.equal(rows.length, 28)
  const ring = dreamGridPositions(WEAVER_FOLDER, rows, true)
  for (const [i, label] of WEB_RING.entries()) assert.deepEqual(ring[label], webRingPoint(i))
  const bridge = dreamGridPositions(WEAVER_FOLDER, [], false)
  assert.equal(Object.keys(bridge).length, 4)
  assert.ok(bridge.theGreatWeb4[1] > bridge.theGreatWeb1[1])
})

test('Weaver uses live leg placement, falls back when meta is absent and keeps a clockwise body arc', () => {
  const locations = WEB_RING.map((label, i) => ({ id: `loc${i}`, label }))
  const body = { id: 'body', cardCode: 'c06346', placement: { tag: 'OtherPlacement', contents: 'Global' }, meta: { rotation: 45 } }
  const leg = { id: 'leg', cardCode: 'c06347', placement: { tag: 'AtLocation', contents: 'loc0' } }
  const gone = { id: 'gone', cardCode: '06348', placement: { tag: 'OutOfPlay' } }
  const setup = weaverEnemies([body, leg, gone], locations)
  assert.equal(setup.rotation, 45)
  assert.equal(setup.bodyStep, -1)
  assert.deepEqual(setup.legs.map(({ base, step }) => [base, step]), [[7, 0]])
  assert.equal(weaverEnemies([{ ...body, meta: {} }, leg], locations).rotation, 45)
  const flipped = { ...body, flipped: true, placement: { tag: 'AtLocation', contents: 'loc2' } }
  assert.equal(weaverEnemies([flipped, leg], locations).bodyStep, 2)
  const arc = clockwiseArc(7, 1)
  assert.deepEqual(arc[0], webRingPoint(7))
  assert.deepEqual(arc[4], webRingPoint(8))
  assert.deepEqual(arc[8], webRingPoint(9))
})

test('Endless Descent recognizes the wrap and a subsequent shuffle of unrevealed cards', () => {
  const slot = (id, index, revealed) => ({ id, label: `mysteriousStairs${index}`, revealed })
  const before = [slot('a', 1, true), slot('b', 2, true), slot('c', 3, false), slot('d', 4, false), slot('e', 5, true)]
  const after = [slot('b', 1, true), slot('c', 2, false), slot('d', 3, false), slot('e', 4, true), slot('a', 5, false)]
  assert.equal(stairsRotation(before, after), 'a')
  assert.equal(stairsRotation(before, [after[0], slot('a', 2, false), after[2], after[3], slot('c', 5, false)]), 'a')
  assert.equal(stairsRotation(before, before), undefined)
  assert.equal(stairsRotation(before, after.slice(1)), undefined)
  const positions = Object.values(dreamGridPositions(STAIRS_FOLDER, [], false))
  assert.equal(positions.length, 5)
  assert.ok(positions.every((point, i) => i === 0 || point[1] > positions[i - 1][1]))
})

test('dynamic map faces and hidden backs select the shipped sprites', () => {
  for (const [folder, first, ratio] of [[WEAVER_FOLDER, '06340', 1], [STAIRS_FOLDER, '06183', 1.5]]) {
    assert.equal(islandImage(folder, 'c' + first + 'b', true), `${folder}/${first}.webp`)
    assert.equal(islandImage(folder, first, false), `${folder}/back.webp`)
    assert.equal(islandAspect(folder, first, false), ratio)
    for (const file of islandSetFiles(folder)) {
      assert.equal(readFileSync(new URL(`../public/${file}`, import.meta.url)).toString('ascii', 8, 12), 'WEBP')
    }
  }
})

test('Atlach-Nacha is one front-facing image; the leg cards are hit areas, not sprites', () => {
  const file = readFileSync(new URL(`../public/${WEAVER_FOLDER}/atlach-nacha-front.webp`, import.meta.url))
  assert.equal(file.toString('ascii', 8, 12), 'WEBP')
})
