import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

function moduleUrl(name, imports = {}) {
  const source = readFileSync(new URL(`../src/arkham/${name}.ts`, import.meta.url), 'utf8')
  let javascript = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
  for (const [path, url] of Object.entries(imports)) javascript = javascript.replace(`'${path}'`, JSON.stringify(url))
  return 'data:text/javascript;base64,' + Buffer.from(javascript).toString('base64')
}

const { gatheringBarrier } = await import(moduleUrl('scene-gathering-barrier', {
  './blockedEntryHint': moduleUrl('blockedEntryHint'),
}))
const board = { image: 'house.webp', fixedPassages: false, village: true }
const parlor = {
  cardCode: 'c01115',
  revealed: false,
  modifiers: [{ type: { tag: 'OtherModifier', contents: 'Blocked' } }],
}

test('the Parlor barrier follows its blocked state in both versions', () => {
  for (const [scenario, point] of [['c01104', [74, 59]], ['c50011', [67, 57]]]) {
    const blocked = gatheringBarrier(board, scenario, [parlor])
    assert.equal(blocked.figures.length, 1)
    assert.deepEqual(blocked.figures[0].point, point)
    assert.equal(blocked.figures[0].image, 'img/scenes/night-of-the-zealot/parlor-barrier.webp')
    assert.deepEqual(gatheringBarrier(board, scenario, [{ ...parlor, revealed: true, modifiers: [] }]), board)
    assert.deepEqual(gatheringBarrier(board, scenario, [{ ...parlor, modifiers: [] }]), board)
    assert.deepEqual(gatheringBarrier(board, scenario, []), board)
    assert.deepEqual(gatheringBarrier(board, scenario, [parlor]), blocked)
  }
})

test('the barrier only appears in The Gathering and preserves other figures', () => {
  assert.deepEqual(gatheringBarrier(board, 'c01120', [parlor]), board)
  assert.equal(gatheringBarrier(undefined, 'c01104', [parlor]), undefined)
  const existing = { ...board, figures: [{ id: 'existing' }] }
  assert.deepEqual(gatheringBarrier(existing, 'c01104', [parlor]).figures.map((figure) => figure.id), [
    'existing', 'parlor-barrier',
  ])
  const asset = readFileSync(new URL('../public/img/scenes/night-of-the-zealot/parlor-barrier.webp', import.meta.url))
  assert.equal(asset.toString('ascii', 8, 12), 'WEBP')
})

test('the Attic prop follows its revealed state and undo', () => {
  const hallway = { cardCode: 'c01112', revealed: true, modifiers: [] }
  const attic = { cardCode: '01113', revealed: true, modifiers: [] }
  const ids = (locations) => (gatheringBarrier(board, '01104', locations).figures ?? []).map((figure) => figure.id)
  assert.deepEqual(ids([hallway, attic]), ['attic-carcass'])
  assert.deepEqual(ids([hallway, { ...attic, revealed: false }]), [])
  assert.deepEqual(ids([{ ...hallway, revealed: false }, attic]), ['attic-carcass'])
  assert.deepEqual(ids([]), [])
  assert.deepEqual(gatheringBarrier(board, '50011', [hallway, { ...attic, revealed: false }]), board)
  for (const asset of ['attic-carcass']) {
    assert.equal(readFileSync(new URL(`../public/img/scenes/night-of-the-zealot/${asset}.webp`, import.meta.url)).toString('ascii', 8, 12), 'WEBP')
  }
})

test('Return to Attic props follow the actual revealed version', () => {
  const original = { cardCode: '01113', revealed: true, modifiers: [] }
  const returned = { ...original, cardCode: '50018' }
  const ids = (loc) => (gatheringBarrier(board, '50011', [loc]).figures ?? []).map((x) => x.id)
  assert.deepEqual(ids(original), ['attic-carcass'])
  assert.deepEqual(ids(returned), ['attic-carcass', 'attic-ladder'])
  assert.deepEqual(ids({ ...returned, revealed: false }), [])
})

test('Return to bathroom shows its contaminated tub only when revealed', () => {
  const bathroom = { cardCode: '50016', revealed: true, modifiers: [] }
  assert.equal(gatheringBarrier(board, '50011', [bathroom]).figures[0].id, 'bathroom-tub')
  assert.equal(gatheringBarrier(board, '50011', [{ ...bathroom, revealed: false }]), board)
  assert.equal(gatheringBarrier(board, '01104', [bathroom]), board)
})
