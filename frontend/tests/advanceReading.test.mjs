import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

const source = readFileSync(new URL('../src/arkham/advanceReading.ts', import.meta.url), 'utf8')
const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
const { advancesBetween, enqueueAdvanceReadings } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))

const act = (id, number, deckId = 1) => ({ id, deckId, sequence: { number, side: 'a' } })
const agenda = (id, step, deckId = 1) => ({ id, deckId, sequence: { step, side: 'a' } })
const board = (acts = [], agendas = []) => ({
  acts: Object.fromEntries(acts.map((a) => [a.id, a])),
  agendas: Object.fromEntries(agendas.map((a) => [a.id, a])),
})

test('an act moving to the next stage of its deck is an advance', () => {
  assert.deepEqual(advancesBetween(board([act('c01108', 1)]), board([act('c01109', 2)])), [
    { key: 'act:c01108>c01109', kind: 'act', fromCode: 'c01108', toCode: 'c01109', steps: ['back', 'next'] },
  ])
})

test('an agenda moving to the next step is an advance', () => {
  const result = advancesBetween(board([], [agenda('c01105', 1)]), board([], [agenda('c01106', 2)]))
  assert.equal(result.length, 1)
  assert.equal(result[0].kind, 'agenda')
})

test('act and agenda advancing in the same update are both reported', () => {
  const result = advancesBetween(
    board([act('c1', 1)], [agenda('c2', 1)]),
    board([act('c3', 2)], [agenda('c4', 2)]),
  )
  assert.deepEqual(result.map((r) => r.kind), ['act', 'agenda'])
})

test('nothing changed, no earlier state, or a reload is not an advance', () => {
  assert.deepEqual(advancesBetween(board([act('c1', 1)]), board([act('c1', 1)])), [])
  assert.deepEqual(advancesBetween(null, board([act('c1', 1)])), [])
  assert.deepEqual(advancesBetween(board([act('c1', 1)]), null), [])
})

test('going back (undo) is not an advance', () => {
  assert.deepEqual(advancesBetween(board([act('c2', 2)]), board([act('c1', 1)])), [])
})

test('a different scenario (other deck) is not an advance', () => {
  assert.deepEqual(advancesBetween(board([act('c1', 3, 1)]), board([act('c9', 1, 7)])), [])
})

const flippedAgenda = (id, step) => ({ ...agenda(id, step), flipped: true })
const backAct = (id, number) => ({ id, deckId: 1, sequence: { number, side: 'B' } })

test('an agenda turning over is a back-only reading, before the next card exists', () => {
  const result = advancesBetween(board([], [agenda('c1', 1)]), board([], [flippedAgenda('c1', 1)]))
  assert.deepEqual(result, [
    { key: 'flip:agenda:c1', kind: 'agenda', fromCode: 'c1', toCode: null, steps: ['back'] },
  ])
})

test('an act turning to its back side is a back-only reading', () => {
  const result = advancesBetween(board([act('c1', 1)]), board([backAct('c1', 1)]))
  assert.deepEqual(result.map((r) => [r.key, r.steps]), [['flip:act:c1', ['back']]])
})

test('a card already flipped does not flip again', () => {
  assert.deepEqual(advancesBetween(board([], [flippedAgenda('c1', 1)]), board([], [flippedAgenda('c1', 1)])), [])
})

test('the advance after a read turn-over only shows the next card', () => {
  const result = advancesBetween(board([], [flippedAgenda('c1', 1)]), board([], [agenda('c2', 2)]), new Set(['c1']))
  assert.deepEqual(result.map((r) => r.steps), [['next']])
})

test('finishes reading the new act before an agenda that turns over in the same update', () => {
  const result = advancesBetween(
    board([backAct('act-1', 1)], [agenda('agenda-1', 1)]),
    board([act('act-2', 2)], [flippedAgenda('agenda-1', 1)]),
    new Set(['act-1']),
  )
  assert.deepEqual(result.map((r) => [r.kind, r.fromCode, r.toCode, r.steps]), [
    ['act', 'act-1', 'act-2', ['next']],
    ['agenda', 'agenda-1', null, ['back']],
  ])
})

test('end-of-round updates read act back, new act, agenda back, then new agenda once each', () => {
  const initial = board([act('act-1', 1)], [agenda('agenda-1', 1)])
  const actTurned = board([backAct('act-1', 1)], [agenda('agenda-1', 1)])
  const roundEnded = board([act('act-2', 2)], [flippedAgenda('agenda-1', 1)])
  const agendaAdvanced = board([act('act-2', 2)], [agenda('agenda-2', 2)])
  const readings = [
    ...advancesBetween(initial, actTurned),
    ...advancesBetween(actTurned, roundEnded, new Set(['act-1'])),
    ...advancesBetween(roundEnded, agendaAdvanced, new Set(['act-1', 'agenda-1'])),
  ]
  assert.deepEqual(readings.map((r) => [r.kind, r.steps]), [
    ['act', ['back']], ['act', ['next']], ['agenda', ['back']], ['agenda', ['next']],
  ])
  assert.equal(new Set(readings.map((r) => r.key)).size, 4)
})

test('finishes an ongoing agenda before starting an act, rather than always prioritising acts', () => {
  const result = advancesBetween(
    board([act('act-1', 1)], [flippedAgenda('agenda-1', 1)]),
    board([backAct('act-1', 1)], [agenda('agenda-2', 2)]),
    new Set(['agenda-1']),
  )
  assert.deepEqual(result.map((r) => [r.kind, r.steps]), [['agenda', ['next']], ['act', ['back']]])
})

test('a continuation arriving later stays with the active reading ahead of waiting readings', () => {
  for (const [kind, otherKind] of [['act', 'agenda'], ['agenda', 'act']]) {
    const current = { key: `flip:${kind}:1`, kind, fromCode: 'first', toCode: null, steps: ['back'] }
    const waiting = { key: `flip:${otherKind}:1`, kind: otherKind, fromCode: 'other', toCode: null, steps: ['back'] }
    const continuation = { key: `${kind}:1>2`, kind, fromCode: 'first', toCode: 'second', steps: ['next'] }
    const result = enqueueAdvanceReadings([current, waiting], [continuation])
    assert.deepEqual(result, [current, continuation, waiting])
    assert.deepEqual(enqueueAdvanceReadings(result, [continuation]), result)
  }
})

test('the reader already open decides the order when both sequences complete together', () => {
  const before = board([backAct('act-1', 1)], [flippedAgenda('agenda-1', 1)])
  const after = board([act('act-2', 2)], [agenda('agenda-2', 2)])
  for (const kind of ['act', 'agenda']) {
    const result = advancesBetween(before, after, new Set(['act-1', 'agenda-1']), kind)
    assert.equal(result[0].kind, kind)
    assert.deepEqual(result.map((r) => r.steps), [['next'], ['next']])
  }
})

test('a different act does not jump ahead of readings already waiting', () => {
  const active = { key: 'flip:act:1', kind: 'act', fromCode: 'act-1', toCode: null, steps: ['back'] }
  const waiting = { key: 'flip:agenda:1', kind: 'agenda', fromCode: 'agenda-1', toCode: null, steps: ['back'] }
  const unrelated = { key: 'flip:act:3', kind: 'act', fromCode: 'act-3', toCode: null, steps: ['back'] }
  assert.deepEqual(enqueueAdvanceReadings([active, waiting], [unrelated]), [active, waiting, unrelated])
})
