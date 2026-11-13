import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

const source = readFileSync(new URL('../src/arkham/sceneSprites.ts', import.meta.url), 'utf8')
const cardImages = readFileSync(new URL('../src/arkham/cardImages.ts', import.meta.url), 'utf8')
const cardArt = cardImages.match(/export function cardArt\([\s\S]*?\n}/)?.[0]
assert.ok(cardArt)
const js = ts.transpile(source.replace(/^import .*$/m, cardArt), {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ES2022,
})
const { spriteFor, storyAssetSpriteFor } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))

test('generated sprites resolve by exact card code and load from public assets', () => {
  const actors = new URL('../public/img/scenes/actors/', import.meta.url)
  const files = readdirSync(actors).filter((file) => /^\d{5}[a-z]?\.webp$/.test(file))
  assert.ok(files.includes('01002.webp'))
  for (const file of files) {
    const code = file.slice(0, -'.webp'.length)
    const path = spriteFor(`c${code}`)
    assert.equal(path, `img/scenes/actors/${code}.webp`)
    const asset = readFileSync(new URL(`../public/${path}`, import.meta.url))
    assert.equal(asset.toString('ascii', 8, 12), 'WEBP')
  }
})

test('an unregistered card or back falls through to its own card art', () => {
  for (const code of ['01002b', 'unregistered-enemy', 'constructor']) {
    assert.equal(spriteFor(code), null)
  }
})

test('Hunting Nightgaunt and Screeching Byakhee do not share a sprite', () => {
  assert.ok(spriteFor('01172'))
  assert.equal(spriteFor('01175'), 'img/scenes/actors/01175.webp')
  assert.notEqual(spriteFor('01175'), spriteFor('01172'))
})

test('Story Asset standees resolve registered campaign faces and reprints', () => {
  const registry = source.match(/const STORY_ASSET_SPRITES[^\n]*\n([\s\S]*?)\n}/)?.[1]
  assert.ok(registry)
  for (const [, code, file] of registry.matchAll(/'([^']+)': '([^']+)'/g)) {
    const path = storyAssetSpriteFor(`c${code}`)
    assert.equal(path, `img/scenes/actors/${file}.webp`)
    assert.equal(readFileSync(new URL(`../public/${path}`, import.meta.url)).toString('ascii', 8, 12), 'WEBP')
  }
  assert.equal(storyAssetSpriteFor('c03076a'), 'img/scenes/actors/03076a.webp')
  assert.equal(storyAssetSpriteFor('c08587'), storyAssetSpriteFor('c08714'))
  assert.equal(storyAssetSpriteFor('c12115'), storyAssetSpriteFor('c02040'))
  assert.notEqual(storyAssetSpriteFor('c73049'), storyAssetSpriteFor('c73059'))
  assert.equal(storyAssetSpriteFor('c:dark-matter:131'), 'img/scenes/actors/_dark-matter_131.webp')
  assert.equal(storyAssetSpriteFor('c:circus-ex-mortis:064b'), storyAssetSpriteFor('c:circus-ex-mortis:059b'))
  for (const code of ['c10522', 'c07178', 'c01175', 'c03076b', 'constructor']) {
    assert.equal(storyAssetSpriteFor(code), null)
  }
})

test('animal and creature Story Assets use their own artwork', () => {
  const codes = ['08738', '10642', '54061', '83058', '85030', ':dark-matter:305']
  const paths = codes.map((code) => storyAssetSpriteFor(`c${code}`))
  assert.ok(paths.every(Boolean))
  assert.equal(new Set(paths).size, codes.length)
  assert.equal(storyAssetSpriteFor('c06030'), null) // Miss Doyle is a deckbuilding asset.
})

test('Hemlock Vale residents use separate sprites on the asset and enemy faces', () => {
  for (const code of ['10693', '10694', '10695', '10696', '10697', '10698', '10699', '10700', '10701']) {
    assert.equal(storyAssetSpriteFor(`c${code}`), `img/scenes/actors/${code}.webp`)
    assert.equal(spriteFor(`c${code}b`), `img/scenes/actors/${code}b.webp`)
    assert.equal(storyAssetSpriteFor(`c${code}b`), null)
  }
})
