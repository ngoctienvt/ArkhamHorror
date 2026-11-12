import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

const source = readFileSync(new URL('../src/arkham/sceneTargetFallback.ts', import.meta.url), 'utf8')
const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
const { sceneFallbackTargets } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))

const target = (tag, contents) => ({ tag: 'TargetLabel', target: { tag, contents } })
const game = {
  enemies: {
    e1: { cardCode: '01116', placement: { tag: 'AtLocation', contents: 'l1' }, flipped: false },
    e2: { cardCode: '01117', placement: { tag: 'InThreatArea', contents: 'i1' }, flipped: false },
    leg: { cardCode: '06231', placement: { tag: 'AsSelfLocation', contents: 'legs1' }, flipped: false },
  },
  locations: {
    l1: { cardCode: '01111', revealed: true },
    l2: { cardCode: '03200', revealed: false, placement: { tag: 'InPlayArea', contents: 'i1' } },
  },
  assets: {
    a1: { cardCode: '01030', placement: { tag: 'InPlayArea', contents: 'i1' } },
    a2: { cardCode: '01031', placement: { tag: 'AttachedToAsset', contents: ['a1', null] } },
    a3: { cardCode: '01032', placement: { tag: 'AtLocation', contents: 'l1' } },
  },
  events: {}, skills: {}, treacheries: {},
  stories: { c08601: { art: '08601', flippedArt: '08601b', flipped: true, placement: { tag: 'AsSelfLocation', contents: 'pathForward' } } },
  scarletKeys: { c09501: { stability: 'Unstable', placement: { tag: 'AtLocation', contents: 'l1' } } },
  concealed: { k1: {} },
}

test('keeps board targets the scene cannot click and drops those the scene already offers', () => {
  const choices = [
    target('EnemyTarget', 'e1'),           // 0: enemy at a location on a plain map
    target('EnemyTarget', 'e2'),           // 1: engaged, in the threat area
    target('EnemyTarget', 'leg'),          // 2: an enemy that is a location
    target('LocationTarget', 'l1'),        // 3: on the map, picked from its plate
    target('LocationTarget', 'l2'),        // 4: in a play area, not on the map
    target('AssetTarget', 'a1'),           // 5: in a play area
    target('AssetTarget', 'a2'),           // 6: attached to an asset in a play area
    target('AssetTarget', 'a3'),           // 7: lying at a location
    target('StoryTarget', 'c08601'),       // 8: a story in a grid cell
    target('ScarletKeyTarget', 'c09501'),  // 9: a key at a location
    target('ConcealedCardTarget', 'k1'),   // 10: concealed, listed on its own
    target('InvestigatorTarget', 'i1'),    // 11: player tabs
    { tag: 'Label', label: 'Done' },       // 12: not a target
  ]
  const result = sceneFallbackTargets(game, choices, new Set(['l1']))
  assert.deepEqual(result.map((r) => r.index), [0, 2, 4, 7, 8, 9])
  assert.deepEqual(result.find((r) => r.id === 'l2'), { index: 4, id: 'l2', kind: 'location', code: '03200', art: '03200', side: 'b' })
  assert.deepEqual(result.find((r) => r.kind === 'story'), { index: 8, id: 'c08601', kind: 'story', code: '08601', art: '08601b', side: '' })
  assert.equal(result.find((r) => r.kind === 'scarletKey').side, 'b')
})

test('a target whose card is gone is left out', () => {
  assert.deepEqual(sceneFallbackTargets(game, [target('EnemyTarget', 'missing')], new Set()), [])
})

test('a target already drawn as a clickable spider part stays off the fallback panel', () => {
  const choices = [target('EnemyTarget', 'leg'), target('EnemyTarget', 'e1')]
  assert.deepEqual(sceneFallbackTargets(game, choices, new Set(), new Set(['leg'])).map((entry) => entry.id), ['e1'])
})

const { sceneFallbackTokens, scenePanelOnlyCount } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))
const component = (tag, investigatorId, tokenType) => ({ tag, component: { tag: 'InvestigatorComponent', investigatorId, tokenType } })

test('lists investigator tokens the hidden token row would answer, but not your own take-a-resource', () => {
  const choices = [
    component('ComponentLabel', 'i1', 'ResourceToken'),          // 0: your basic "gain a resource"
    component('ComponentLabel', 'i1', 'DamageToken'),            // 1: assign damage to you
    component('AuxiliaryComponentLabel', 'i1', 'ResourceToken'), // 2: auxiliary, kept
    component('ComponentLabel', 'i2', 'ResourceToken'),          // 3: someone else's resources
    { tag: 'ComponentLabel', component: { tag: 'AssetComponent', assetId: 'a1', tokenType: 'DamageToken' } }, // 4: asset, player zone
  ]
  assert.deepEqual(sceneFallbackTokens(choices, 'i1').map((r) => r.index), [1, 2, 3])
})

test('counts every choice only the panel can answer', () => {
  const choices = [
    target('EnemyTarget', 'e1'),            // board enemy
    target('ConcealedCardTarget', 'k1'),    // concealed
    { tag: 'KeyLabel', key: { tag: 'RedKey' } },
    component('ComponentLabel', 'i1', 'HorrorToken'),
    target('LocationTarget', 'l1'),         // on the map: not counted
  ]
  assert.equal(scenePanelOnlyCount(game, choices, new Set(['l1']), 'i1'), 4)
  assert.equal(scenePanelOnlyCount(game, [target('LocationTarget', 'l1')], new Set(['l1']), 'i1'), 0)
})
