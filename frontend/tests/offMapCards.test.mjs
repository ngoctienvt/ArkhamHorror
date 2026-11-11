import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

const source = readFileSync(new URL('../src/arkham/offMapCards.ts', import.meta.url), 'utf8')
const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
const { offMapGroups } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))

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
