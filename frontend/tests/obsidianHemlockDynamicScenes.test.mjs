import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

/* Obsidian Canyons, The Lost Sister and The Twisted Hollow: sprite sets and board registration. */
const load = async (file) => {
  const source = readFileSync(new URL(`../src/arkham/${file}`, import.meta.url), 'utf8')
  const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
  return import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))
}
const { islandImage, islandAspect, islandSetFiles } = await load('scene-island-sprites.ts')
const overviewSource = readFileSync(new URL('../src/arkham/hemlock-overview.ts', import.meta.url), 'utf8')
const anchorsSource = readFileSync(new URL('../src/arkham/scene-anchors-the-dream-eaters.ts', import.meta.url), 'utf8')
const toUrl = (src) => 'data:text/javascript;base64,' + Buffer.from(ts.transpile(src, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })).toString('base64')
const { hemlockOverview } = await import(toUrl(overviewSource.replace(/'\.\/scene-anchors-the-dream-eaters'/, JSON.stringify(toUrl(anchorsSource)))))

const OBS = 'img/scenes/the-drowned-city/obsidian-canyons'
const LOST = 'img/scenes/hemlock-vale/lost-sister'
const HOLLOW = 'img/scenes/hemlock-vale/twisted-hollow'
const isWebp = (file) => readFileSync(new URL(`../public/${file}`, import.meta.url)).subarray(8, 12).toString('ascii') === 'WEBP'

test('Obsidian Canyons: faces, shared Summit back, open sky, shared Athenaeum art', () => {
  for (const code of ['11649', '11650', '11651', '11652', '11653', '11655', '11656', '11657', '11658', '11659', '11660', '11661']) {
    assert.equal(islandImage(OBS, `c${code}`, true), `${OBS}/${code}.webp`, code)
    assert.equal(islandImage(OBS, `c${code}`, false), `${OBS}/summit-back.webp`, code)
  }
  assert.equal(islandImage(OBS, 'c11654', true), `${OBS}/11653.webp`)
  for (const code of ['11648', '11662']) assert.equal(islandImage(OBS, `c${code}`, false), `${OBS}/${code}.webp`, code)
  assert.equal(islandImage(OBS, 'xsky', false), `${OBS}/open-sky.webp`)
  assert.equal(islandImage(OBS, 'xsky', true), `${OBS}/open-sky.webp`)
  assert.equal(islandAspect(OBS, 'c11649', false), 1)
  assert.equal(islandAspect(OBS, 'c11649', true), 3 / 2)
})

test('The Lost Sister: faces, one shared cave back, Akwan always up', () => {
  for (const code of ['10576', '10577', '10578', '10579', '10580', '10581', '10582', '10716', '10717', '10718', '10719', '10720']) {
    assert.equal(islandImage(LOST, `c${code}`, true), `${LOST}/${code}.webp`, code)
    assert.equal(islandImage(LOST, `c${code}`, false), `${LOST}/back.webp`, code)
  }
  assert.equal(islandImage(LOST, 'c10575', false), `${LOST}/10575.webp`)
})

test('The Twisted Hollow: faces and one shared Western Woods back', () => {
  for (let n = 10612; n <= 10621; n++) {
    assert.equal(islandImage(HOLLOW, `c${n}`, true), `${HOLLOW}/${n}.webp`)
    assert.equal(islandImage(HOLLOW, `c${n}`, false), `${HOLLOW}/back.webp`)
  }
})

test('every sprite and board file exists and is WebP', () => {
  assert.equal(islandSetFiles(OBS).length, 16)
  assert.equal(islandSetFiles(LOST).length, 14)
  assert.equal(islandSetFiles(HOLLOW).length, 11)
  for (const file of [...islandSetFiles(OBS), ...islandSetFiles(LOST), ...islandSetFiles(HOLLOW)]) {
    assert.ok(existsSync(new URL(`../public/${file}`, import.meta.url)), file)
    assert.ok(isWebp(file), file)
  }
})

test('boards use the empty backgrounds and sprite folders, with no leftover anchors', () => {
  const cases = [
    ['c11639', 'img/scenes/the-drowned-city/obsidian-canyons-sky.webp', OBS],
    ['c10569', 'img/scenes/hemlock-vale/lost-sister-caverns.webp', LOST],
    ['c10605', 'img/scenes/hemlock-vale/twisted-hollow-woods.webp', HOLLOW],
  ]
  for (const [id, image, islands] of cases) {
    const board = hemlockOverview(id, id)
    assert.equal(board?.image, image, id)
    assert.equal(board?.islands, islands, id)
    assert.ok(isWebp(image), image)
    assert.equal(Object.keys(board?.anchors ?? {}).length, 0, id)
  }
})
