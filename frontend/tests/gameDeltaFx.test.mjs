import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

const source = readFileSync(new URL('../src/arkham/gameDeltaFx.ts', import.meta.url), 'utf8')
const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
const { diffSnapshots, snapshotOf, cardMoves, eventsEndMs } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))

const inv = (damage = 0, horror = 0) => ({ damage, horror, clues: 0, resources: 0 })
const snap = (o = {}) => ({ investigators: {}, enemies: {}, agendas: {}, ...o })

test('reports damage and horror taken, with the hit staggered after the beat', () => {
  const events = diffSnapshots(snap({ investigators: { a: inv() } }), snap({ investigators: { a: inv(2, 1) } }))
  assert.deepEqual(events.map((e) => [e.kind, e.amount]), [['damage', 2], ['horror', 1]])
  assert.ok(events[1].delayMs > events[0].delayMs)
})

test('an exhausting engaged enemy that hurt its investigator lunges first', () => {
  const prev = snap({ investigators: { a: inv() }, enemies: { e: { damage: 0, exhausted: false, engagedWith: 'a' } } })
  const next = snap({ investigators: { a: inv(1) }, enemies: { e: { damage: 0, exhausted: true, engagedWith: 'a' } } })
  const events = diffSnapshots(prev, next)
  assert.equal(events[0].kind, 'attack')
  assert.equal(events[0].toward, 'investigator-a')
  assert.ok(events.find((e) => e.kind === 'damage').delayMs >= 400)
})

test('doom on an agenda and a defeated enemy are reported; unchanged boards are quiet', () => {
  const prev = snap({ agendas: { g: 1 }, enemies: { e: { damage: 0, exhausted: false, engagedWith: null } } })
  const next = snap({ agendas: { g: 2 } })
  assert.deepEqual(diffSnapshots(prev, next).map((e) => [e.kind, e.amount]), [['enemyDefeated', 0], ['doom', 1]])
  assert.deepEqual(diffSnapshots(next, next), [])
})

test('snapshotOf reads tokens and pending assignments', () => {
  const s = snapshotOf({
    investigators: { a: { tokens: { Damage: 1, Clue: 2 }, assignedHealthDamage: 1 } },
    enemies: { e: { tokens: { Damage: 3 }, assignedDamage: 1, exhausted: true, placement: { tag: 'InThreatArea', contents: 'a' } } },
    agendas: { g: { doom: 4 } },
  })
  assert.equal(s.investigators.a.damage, 2)
  assert.equal(s.investigators.a.clues, 2)
  assert.deepEqual(s.enemies.e, { damage: 4, exhausted: true, engagedWith: 'a' })
  assert.equal(s.agendas.g, 4)
})

const invAt = (locationId, clues = 0, resources = 0) => ({ damage: 0, horror: 0, clues, resources, locationId })
const kinds = (events) => events.map((e) => [e.kind, e.anchor, e.toward, e.amount])

test('investigating turns a location clue into a clue flying to the investigator standing there', () => {
  const prev = snap({ investigators: { a: invAt('L', 0), b: invAt('M', 0) }, locations: { L: { clues: 2 }, M: { clues: 1 } } })
  const next = snap({ investigators: { a: invAt('L', 1), b: invAt('M', 0) }, locations: { L: { clues: 1 }, M: { clues: 1 } } })
  assert.deepEqual(kinds(diffSnapshots(prev, next)), [['transfer', 'location-L', 'investigator-a', 1]])
})

test('two investigators gaining clues at the same location is ambiguous and falls back to floaters', () => {
  const prev = snap({ investigators: { a: invAt('L'), b: invAt('L') }, locations: { L: { clues: 2 } } })
  const next = snap({ investigators: { a: invAt('L', 1), b: invAt('L', 1) }, locations: { L: { clues: 0 } } })
  const events = diffSnapshots(prev, next)
  assert.equal(events.filter((e) => e.kind === 'transfer').length, 0)
  assert.deepEqual(
    events.map((e) => [e.kind, e.anchor, e.amount]).sort(),
    [['clue', 'investigator-a', 1], ['clue', 'investigator-b', 1], ['clue', 'location-L', -2]].sort(),
  )
})

test('mismatched amounts are not paired', () => {
  const prev = snap({ investigators: { a: invAt('L') }, locations: { L: { clues: 3 } } })
  const next = snap({ investigators: { a: invAt('L', 1) }, locations: { L: { clues: 1 } } })
  assert.equal(diffSnapshots(prev, next).filter((e) => e.kind === 'transfer').length, 0)
})

test('clues spent with nowhere else to go fly to the only act', () => {
  const prev = snap({ investigators: { a: invAt('L', 2), b: invAt('L', 1) }, acts: { act1: { clues: 0 } } })
  const next = snap({ investigators: { a: invAt('L', 0), b: invAt('L', 0) }, acts: { act2: { clues: 0 } } })
  assert.deepEqual(kinds(diffSnapshots(prev, next)), [
    ['transfer', 'investigator-a', 'act-act2', 2],
    ['transfer', 'investigator-b', 'act-act2', 1],
  ])
})

test('a clue lost while the act stays put is not a spend on the act', () => {
  const prev = snap({ investigators: { a: invAt('L', 2) }, acts: { act1: { clues: 0 } } })
  const next = snap({ investigators: { a: invAt('L', 1) }, acts: { act1: { clues: 0 } } })
  assert.deepEqual(kinds(diffSnapshots(prev, next)), [['clue', 'investigator-a', undefined, -1]])
})

test('beats run in order: transfers, then the lunge, then the hit', () => {
  const prev = snap({
    investigators: { a: invAt('L') },
    locations: { L: { clues: 1 } },
    enemies: { e: { damage: 0, exhausted: false, engagedWith: 'a' } },
  })
  const next = snap({
    investigators: { a: { ...invAt('L', 1), damage: 1 } },
    locations: { L: { clues: 0 } },
    enemies: { e: { damage: 0, exhausted: true, engagedWith: 'a' } },
  })
  const events = diffSnapshots(prev, next)
  const at = (k) => events.find((e) => e.kind === k).delayMs
  assert.ok(at('transfer') < at('attack'))
  assert.ok(at('attack') < at('damage'))
  assert.ok(eventsEndMs(events) >= at('damage'))
})

test('doom on enemies and locations, and uses spent on assets, are reported', () => {
  const prev = snap({ doom: { 'enemy-e': 0, 'location-L': 1 }, uses: { x: 4 } })
  const next = snap({ doom: { 'enemy-e': 1, 'location-L': 1 }, uses: { x: 3 } })
  assert.deepEqual(kinds(diffSnapshots(prev, next)), [['doom', 'enemy-e', undefined, 1], ['uses', 'asset-x', undefined, -1]])
})

test('resources given from one investigator to another become a transfer', () => {
  const prev = snap({ investigators: { a: invAt('L', 0, 5), b: invAt('L', 0, 1) } })
  const next = snap({ investigators: { a: invAt('L', 0, 3), b: invAt('L', 0, 3) } })
  assert.deepEqual(kinds(diffSnapshots(prev, next)), [['transfer', 'investigator-a', 'investigator-b', 2]])
})

test('snapshotOf tracks card zones and cardMoves reports cards that changed zone on the table', () => {
  const base = {
    investigators: { a: { tokens: {}, hand: [{ tag: 'PlayerCard', contents: { id: 'c1' } }, { tag: 'VengeanceCard', contents: { tag: 'PlayerCard', contents: { id: 'c2' } } }], discard: [] } },
    enemies: {},
    agendas: {},
    assets: {},
  }
  const prev = snapshotOf(base)
  assert.equal(prev.cards.c1, 'hand:a')
  assert.equal(prev.cards.c2, 'hand:a')
  const next = snapshotOf({
    ...base,
    investigators: { a: { tokens: {}, hand: [], discard: [{ id: 'c2' }] } },
    assets: { x: { cardId: 'c1', placement: { tag: 'InPlayArea', contents: 'a' }, tokens: { Ammo: 2 } } },
  })
  assert.deepEqual(cardMoves(prev, next).sort(), ['c1', 'c2'])
  assert.equal(next.uses.x, 2)
  assert.deepEqual(cardMoves(next, next), [])
})

test('a card drawn from the deck is a move from the deck to the hand', () => {
  const inv = (hand, deck) => ({ investigators: { a: { tokens: {}, hand, discard: [], deck } }, enemies: {}, agendas: {} })
  const prev = snapshotOf(inv([], [{ id: 'd1' }, { id: 'd2' }]))
  const next = snapshotOf(inv([{ tag: 'PlayerCard', contents: { id: 'd1' } }], [{ id: 'd2' }]))
  assert.equal(prev.cards.d1, 'deck:a')
  assert.deepEqual(cardMoves(prev, next), ['d1'])
})
