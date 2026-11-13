import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

const source = readFileSync(new URL('../src/arkham/scene-location-assets.ts', import.meta.url), 'utf8')
const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
const { sceneLocationAssets } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))

test('standees only use assets physically placed at or attached to this location', () => {
  const location = { id: 'barn', assets: ['ajax', 'guest', 'away', 'other-player', 'missing'] }
  const assets = {
    ajax: { id: 'ajax', controller: null, placement: { tag: 'AtLocation', contents: 'barn' } },
    guest: { id: 'guest', controller: 'investigator', placement: { tag: 'AttachedToLocation', contents: 'barn' } },
    away: { id: 'away', placement: { tag: 'AtLocation', contents: 'farmhouse' } },
    'other-player': { id: 'other-player', placement: { tag: 'InPlayArea', contents: 'other-investigator' } },
  }
  assert.deepEqual(sceneLocationAssets(location, assets).map((a) => a.id), ['ajax', 'guest'])

  assets.ajax.placement = { tag: 'InPlayArea', contents: 'investigator' }
  assert.deepEqual(sceneLocationAssets(location, assets).map((a) => a.id), ['guest'])
})
