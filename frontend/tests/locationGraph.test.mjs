import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

// locationGraph.ts is import-free on purpose so it can be loaded here without the Vue toolchain.
const source = readFileSync(new URL('../src/arkham/locationGraph.ts', import.meta.url), 'utf8')
const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
const { locationLinks, locationLinkDirection, shortestPath, locationRoster, foldRowLinks } = await import(
  'data:text/javascript;base64,' + Buffer.from(js).toString('base64')
)

const loc = (id, connectedLocations = [], extra = {}) =>
  ({ id, connectedLocations, investigators: [], enemies: [], ...extra })
const world = (...ls) => Object.fromEntries(ls.map(l => [l.id, l]))

test('connection arrows show the actual direction regardless of endpoint order', () => {
  const a = loc('a', ['b'])
  const b = loc('b')
  assert.equal(locationLinkDirection(a, b), 'forward')
  assert.equal(locationLinkDirection(b, a), 'backward')
  assert.equal(locationLinkDirection(a, loc('b', ['a'])), 'both')
  assert.equal(locationLinkDirection(b, loc('c')), null)
})

test('links are undirected and deduplicated', () => {
  const g = world(loc('a', ['b']), loc('b', ['a', 'c']), loc('c'))
  const links = locationLinks(g).map(l => [...l].sort().join('-')).sort()
  assert.deepEqual(links, ['a-b', 'b-c'])
})

test('one-sided connection data still yields a link', () => {
  const g = world(loc('a', ['b']), loc('b'))
  assert.equal(locationLinks(g).length, 1)
})

test('links to locations not in play are ignored', () => {
  const g = world(loc('a', ['ghost']))
  assert.deepEqual(locationLinks(g), [])
})

test('shortest path picks the fewest hops', () => {
  const g = world(loc('a', ['b', 'd']), loc('b', ['a', 'c']), loc('c', ['b', 'd']), loc('d', ['a', 'c']))
  assert.equal(shortestPath(g, 'a', 'c').length, 3)
})

test('path from a location to itself is that location', () => {
  assert.deepEqual(shortestPath(world(loc('a')), 'a', 'a'), ['a'])
})

test('disconnected target gives an empty path', () => {
  assert.deepEqual(shortestPath(world(loc('a'), loc('b')), 'a', 'b'), [])
})

test('unknown endpoints give an empty path', () => {
  assert.deepEqual(shortestPath(world(loc('a')), 'a', 'zzz'), [])
  assert.deepEqual(shortestPath(world(loc('a')), 'zzz', 'a'), [])
})

test('blocked locations are routed around or make target unreachable', () => {
  const g = world(loc('a', ['b', 'c']), loc('b', ['a', 'd']), loc('c', ['a', 'd']), loc('d', ['b', 'c']))
  assert.deepEqual(shortestPath(g, 'a', 'd', id => id === 'b'), ['a', 'c', 'd'])
  assert.deepEqual(shortestPath(g, 'a', 'd', id => id === 'b' || id === 'c'), [])
})

test('roster lists investigators and enemies at a location', () => {
  const g = world(loc('a', [], { investigators: ['i1', 'i2'], enemies: ['e1'] }), loc('b'))
  assert.deepEqual(locationRoster(g, 'a'), { investigators: ['i1', 'i2'], enemies: ['e1'] })
  assert.deepEqual(locationRoster(g, 'b'), { investigators: [], enemies: [] })
  assert.deepEqual(locationRoster(g, 'nope'), { investigators: [], enemies: [] })
})

const { compactGridLayout, gridPositions, autoPositions, mapPositions, mineDescentPositions, mineDescentPassage } = await import(
  'data:text/javascript;base64,' + Buffer.from(js).toString('base64')
)

test('the mine entrance uses painted chamber positions even when the grid has extra columns', () => {
  const g = world(
    loc('station', [], { label: 'pos0501' }),
    loc('random-cave', [], { label: 'pos0101' }),
    loc('off-grid'),
  )
  const fallback = mapPositions(g, ['posn0201 posn0101 pos0001 pos0101 pos0201 pos0301 pos0401 pos0501'])
  assert.deepEqual(mineDescentPositions(g, fallback), {
    station: [85, 66],
    'random-cave': [14, 66],
    'off-grid': fallback['off-grid'],
  })
})

test('the mine passage anchor is the same for either direction', () => {
  assert.deepEqual(mineDescentPassage('pos0201', 'pos0101'), [17, 47])
  assert.equal(mineDescentPassage('pos0101', 'pos0301'), undefined)
})

test('grid layout centres each label in its cell, as percentages', () => {
  const p = gridPositions(['a b', 'c .'])
  assert.deepEqual(p.a, [25, 25])
  assert.deepEqual(p.b, [75, 25])
  assert.deepEqual(p.c, [25, 75])
  assert.equal('.' in p, false)
})

test('grid layout uses the middle of a label spanning several cells', () => {
  const p = gridPositions(['a a', 'b c'])
  assert.deepEqual(p.a, [50, 25])
})

test('grid layout tolerates ragged rows and extra spaces', () => {
  const p = gridPositions(['  a   b ', 'c'])
  assert.equal(p.a[1], 25)
  assert.equal(p.c[1], 75)
})

test('auto layout places every location inside the map, neighbours in later columns', () => {
  const g = world(loc('a', ['b']), loc('b', ['a', 'c']), loc('c', ['b']), loc('lonely'))
  const p = autoPositions(g)
  assert.equal(Object.keys(p).length, 4)
  assert.ok(p.a[0] < p.b[0] && p.b[0] < p.c[0])
  for (const [x, y] of Object.values(p)) assert.ok(x > 0 && x < 100 && y > 0 && y < 100)
})

test('auto layout never stacks two locations on one point', () => {
  const g = world(loc('a', ['b', 'c', 'd']), loc('b', ['a']), loc('c', ['a']), loc('d', ['a']), loc('e'))
  const keys = Object.values(autoPositions(g)).map(p => p.join(','))
  assert.equal(new Set(keys).size, keys.length)
})

test('auto layout of an empty or single graph is safe', () => {
  assert.deepEqual(autoPositions({}), {})
  assert.deepEqual(autoPositions(world(loc('a'))), { a: [50, 50] })
})

test('map positions follow the scenario grid by label and fall back to auto layout for the rest', () => {
  const g = world(loc('a', ['b'], { label: 'x' }), loc('b', ['a'], { label: 'y' }), loc('c', [], { label: 'zzz' }))
  const p = mapPositions(g, ['x y'])
  assert.equal(p.a[0], 25)
  assert.equal(p.b[0], 75)
  assert.equal(p.a[1], p.b[1])
  assert.ok(p.c)
  assert.notDeepEqual(p.c, p.a)
  assert.notDeepEqual(p.c, p.b)
})

test('map positions without a grid use auto layout for all', () => {
  const g = world(loc('a', ['b']), loc('b', ['a']))
  assert.equal(Object.keys(mapPositions(g, null)).length, 2)
})

test('compactGridLayout collapses rows and columns the card board leaves empty', () => {
  // Act 1 of Before the Black Throne: a 5x5 grid padded around three cards.
  const rows = [
    'posn0102 pos0002 pos0102 pos0202 pos0302',
    'posn0101 pos0001 pos0101 pos0201 pos0301',
    'posn0100 pos0000 pos0100 pos0200 pos0300',
    'posn01n01 pos00n01 pos01n01 pos02n01 pos03n01',
    'posn01n02 pos00n02 pos01n02 pos02n02 pos03n02',
  ]
  assert.deepEqual(compactGridLayout(rows, new Set(['pos0000', 'pos0201', 'pos02n01'])), [
    'pos0001 pos0201',
    'pos0000 pos0200',
    'pos00n01 pos02n01',
  ])
  // A cell on offer keeps its row and column, the way the card board shows a clickable empty position.
  assert.deepEqual(compactGridLayout(rows, new Set(['pos0000', 'pos0100'])), ['pos0000 pos0100'])
  assert.deepEqual(compactGridLayout(rows, new Set()), [])
})

const pairsOf = (ids) => ids.flatMap((a, i) => ids.slice(i + 1).map((b) => [a, b]))
const keyOf = ([a, b]) => [a, b].sort().join('-')

test('a row of 4 that all connect keeps one link per gap and forms one lane', () => {
  const at = { a: [10, 50], b: [35, 50], c: [60, 50], d: [85, 50] }
  const { links, lanes } = foldRowLinks(pairsOf(['a', 'b', 'c', 'd']), (id) => at[id], () => true)
  assert.deepEqual(links.map(keyOf).sort(), ['a-b', 'b-c', 'c-d'])
  assert.equal(lanes.length, 1)
  assert.deepEqual(lanes[0].members, ['a', 'b', 'c', 'd'])
  assert.deepEqual([...lanes[0].ends].sort(), ['a', 'd'])
})

test('a column folds the same way', () => {
  const at = { a: [50, 10], b: [50, 40], c: [50, 70] }
  const { links, lanes } = foldRowLinks(pairsOf(['a', 'b', 'c']), (id) => at[id], () => true)
  assert.deepEqual(links.map(keyOf).sort(), ['a-b', 'b-c'])
  assert.equal(lanes.length, 1)
})

test('a link with no location between its ends stays', () => {
  const at = { a: [10, 50], b: [30, 50], c: [70, 50] }
  const { links, lanes } = foldRowLinks([['a', 'b'], ['b', 'c']], (id) => at[id], () => true)
  assert.equal(links.length, 2)
  assert.equal(lanes.length, 0)
})

test('the long link stays when the middle location is not joined to both ends', () => {
  const at = { a: [10, 50], b: [50, 50], c: [90, 50] }
  const { links } = foldRowLinks([['a', 'b'], ['a', 'c']], (id) => at[id], () => true)
  assert.equal(links.length, 2)
})

test('a link that may not fold (one-way, barriers) stays', () => {
  const at = { a: [10, 50], b: [50, 50], c: [90, 50] }
  const { links, lanes } = foldRowLinks(pairsOf(['a', 'b', 'c']), (id) => at[id], (x, y) => keyOf([x, y]) !== 'a-c')
  assert.equal(links.length, 3)
  assert.equal(lanes.length, 0)
})

test('locations dragged off the line keep their long link', () => {
  const at = { a: [10, 50], b: [50, 70], c: [90, 50] }
  const { links } = foldRowLinks(pairsOf(['a', 'b', 'c']), (id) => at[id], () => true)
  assert.equal(links.length, 3)
})
