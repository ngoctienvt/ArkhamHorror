import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

const source = readFileSync(new URL('../src/arkham/offMapCards.ts', import.meta.url), 'utf8')
const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
const { offMapGroups, isolatedLocationIds } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))

const at = (tag, contents) => ({ placement: { tag, contents } })
const game = {
  enemies: {
    shadow: at('InTheShadows'),
    hunter: at('OutOfPlay', 'PursuitZone'),
    void1: at('OutOfPlay', 'VoidZone'), void2: at('OutOfPlay', 'VoidZone'),
    deep: at('OutOfPlay', 'TheDepths'),
    setAside: at('OutOfPlay', 'SetAsideZone'),
    boss: { ...at('OtherPlacement', 'Global'), asSelfLocation: null },
    web: { ...at('OtherPlacement', 'Global'), asSelfLocation: 'web' },
    onMap: at('AtLocation', 'l1'),
  },
  investigators: { i1: at('InTheShadows'), i2: at('AtLocation', 'l1') },
  locations: { l1: {}, sl: {} },
  stories: { s1: at('OtherPlacement', 'Global') },
  assets: { a1: at('OtherPlacement', 'Global'), a2: at('InPlayArea', 'i2') },
  treacheries: { t1: at('NextToScenarioReference'), t2: at('NextToAgenda') },
}
const scenario = { meta: { locationsInShadows: { left: 'sl', middle: null, right: 'gone' } } }

test('groups every off-map card by zone, in order', () => {
  const groups = Object.fromEntries(offMapGroups(game, scenario).map((g) => [g.kind, g]))
  assert.deepEqual(Object.keys(groups), ['shadows', 'pursuit', 'void', 'depths', 'global', 'reference'])
  assert.deepEqual(groups.shadows.locations, ['sl'])
  assert.deepEqual(groups.shadows.enemies, ['shadow'])
  assert.deepEqual(groups.shadows.investigators, ['i1'])
  assert.deepEqual(groups.pursuit.enemies, ['hunter'])
  assert.deepEqual(groups.void.enemies, ['void1'])
  assert.deepEqual(groups.depths.enemies, ['deep'])
  assert.deepEqual(groups.global.enemies, ['boss'])
  assert.deepEqual(groups.global.stories, ['s1'])
  assert.deepEqual(groups.global.assets, ['a1'])
  assert.deepEqual(groups.reference.treacheries, ['t1'])
})

test('nothing off the map gives no groups', () => {
  const plain = { enemies: { e: at('AtLocation', 'l1') }, investigators: {}, locations: {}, stories: {}, assets: {}, treacheries: {} }
  assert.deepEqual(offMapGroups(plain, null), [])
})

test('a location on no grid cell and with no connection goes to the reference box', () => {
  const layout = ['gate stairs', '. cells2']
  const locations = {
    l1: { label: 'gate', placement: null, connectedLocations: ['l2'] },
    l2: { label: 'stairs', placement: null, connectedLocations: ['l1'] },
    cells: { label: 'holdingCells', placement: null, connectedLocations: [] },
    linked: { label: 'extra', placement: null, connectedLocations: ['l1'] },
    reached: { label: 'extra2', placement: null, connectedLocations: [] },
    aside: { label: 'aside', placement: { tag: 'OutOfPlay' }, connectedLocations: [] },
  }
  locations.l1.connectedLocations.push('reached')
  assert.deepEqual(isolatedLocationIds(locations, layout), ['cells'])
  const game = { enemies: {}, investigators: {}, stories: {}, assets: {}, treacheries: {}, locations }
  const groups = offMapGroups(game, { locationLayout: layout, meta: {} })
  assert.deepEqual(groups.find((g) => g.kind === 'reference').locations, ['cells'])
})

test('Jekyll arrangement stays in the reference group while matching real locations stay on the scene', () => {
  const code = ':the-strange-case-of-dr-jekyll-and-mr-hyde:008'
  const locations = {
    pharmacy: { cardCode: code, label: 'drugstore', placement: null, connectedLocations: [] },
    formula: { cardCode: code, label: 'arrangement1', placement: null, connectedLocations: [] },
    unrelated: { cardCode: '01111', label: 'arrangement2', placement: null, connectedLocations: [] },
  }
  const layout = ['drugstore .', 'arrangement1 arrangement2']
  assert.deepEqual(isolatedLocationIds(locations, layout), ['formula'])
  const groups = offMapGroups({ enemies: {}, investigators: {}, stories: {}, assets: {}, treacheries: {}, locations }, { locationLayout: layout, meta: {} })
  assert.deepEqual(groups.find((group) => group.kind === 'reference').locations, ['formula'])
})

test('isolation needs a grid layout and a label: a lone Study or an unlabelled card is not isolated', () => {
  const lone = { study: { label: 'study', placement: null, connectedLocations: [] } }
  assert.deepEqual(isolatedLocationIds(lone, null), [])
  assert.deepEqual(isolatedLocationIds(lone, []), [])
  assert.deepEqual(isolatedLocationIds({ x: { label: '', placement: null, connectedLocations: [] } }, ['a b']), [])
  assert.deepEqual(isolatedLocationIds({ c: { label: 'cosmos', placement: null, connectedLocations: [] } }, ['a b']), [])
  assert.deepEqual(isolatedLocationIds({ s: { label: 'study', placement: null, connectedLocations: [] } }, ['study']), [])
})
