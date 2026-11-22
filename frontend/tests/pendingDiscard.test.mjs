import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

const source = readFileSync(new URL('../src/arkham/pendingDiscard.ts', import.meta.url), 'utf8')
const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
const { discardTarget, discardSettled, withCardDiscarded, withInPlayDiscarded } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))

test('a hand-size discard names the card it picks', () => {
  const choice = { tag: 'TargetLabel', target: { tag: 'CardIdTarget', contents: 'card-1' }, messages: [] }
  assert.deepEqual(discardTarget(choice), { zone: 'hand', id: 'card-1' })
})

test('a discard of something in play names its zone', () => {
  assert.deepEqual(discardTarget({ tag: 'TargetLabel', target: { tag: 'AssetTarget', contents: 'a1' } }), { zone: 'assets', id: 'a1' })
  assert.deepEqual(discardTarget({ tag: 'TargetLabel', target: { tag: 'EventTarget', contents: 'e1' } }), { zone: 'events', id: 'e1' })
})

test('a choice that targets nothing discardable names nothing', () => {
  assert.equal(discardTarget({ tag: 'TargetLabel', target: { tag: 'LocationTarget', contents: 'l1' } }), null)
  assert.equal(discardTarget({ tag: 'Label' }), null)
  assert.equal(discardTarget(undefined), null)
})

test('a discarded asset leaves the table and its card tops the controller discard', () => {
  const game = {
    assets: { a1: { cardId: 'c-a1', cardCode: '01' }, a2: { cardId: 'c-a2', cardCode: '02' } },
    events: {},
    investigators: { r: { assets: ['a1', 'a2'], events: [], discard: [{ id: 'old' }] } },
  }
  const result = withInPlayDiscarded(game, 'assets', 'a1', (e) => ({ id: e.cardId }))
  assert.equal(result.cardId, 'c-a1')
  assert.deepEqual(Object.keys(result.game.assets), ['a2'])
  assert.deepEqual(result.game.investigators.r, { assets: ['a2'], events: [], discard: [{ id: 'c-a1' }, { id: 'old' }] })
  assert.equal(game.investigators.r.assets.length, 2)
})

test('an asset no investigator holds is left alone', () => {
  const game = { assets: { a1: { cardId: 'c' } }, events: {}, investigators: { r: { assets: [], events: [], discard: [] } } }
  assert.equal(withInPlayDiscarded(game, 'assets', 'a1', (e) => e), null)
  assert.equal(withInPlayDiscarded(game, 'assets', 'missing', (e) => e), null)
})

test('the card stays hidden until a board newer than the answered question arrives', () => {
  assert.equal(discardSettled(11, 11), false)
  assert.equal(discardSettled(11, undefined), false)
  assert.equal(discardSettled(11, 12), true)
})

test('the discarded card moves from its owner hand to the top of their discard', () => {
  const game = { investigators: { a: { hand: [{ id: 'x' }], discard: [] }, b: { hand: [{ id: 'c1' }, { id: 'c2' }], discard: [{ id: 'old' }] } } }
  const next = withCardDiscarded(game, 'c1', (c) => c.id, (c) => ({ ...c }))
  assert.deepEqual(next.investigators.b, { hand: [{ id: 'c2' }], discard: [{ id: 'c1' }, { id: 'old' }] })
  assert.equal(next.investigators.a, game.investigators.a)
  assert.equal(game.investigators.b.hand.length, 2)
})

test('a card in no hand leaves the board alone', () => {
  assert.equal(withCardDiscarded({ investigators: { a: { hand: [], discard: [] } } }, 'z', (c) => c.id, (c) => c), null)
})
