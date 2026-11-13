import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

/* The Longest Night: sprite set and board registration. */
const toUrl = (src) => 'data:text/javascript;base64,' + Buffer.from(ts.transpile(src, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })).toString('base64')
const read = (file) => readFileSync(new URL(`../src/arkham/${file}`, import.meta.url), 'utf8')
const { islandImage, islandSetFiles } = await import(toUrl(read('scene-island-sprites.ts')))
const { hemlockOverview } = await import(toUrl(read('hemlock-overview.ts').replace(/'\.\/scene-anchors-the-dream-eaters'/, JSON.stringify(toUrl(read('scene-anchors-the-dream-eaters.ts'))))))

const NIGHT = 'img/scenes/hemlock-vale/longest-night'
const FARMS = ['10631', '10632', '10633', '10634', '10635']
const FIELDS = ['10636', '10637', '10638', '10639', '10640']
const isWebp = (file) => readFileSync(new URL(`../public/${file}`, import.meta.url)).subarray(8, 12).toString('ascii') === 'WEBP'

test('the Farmhouse is always up, farms face down on the farm back, fields on the field back', () => {
  assert.equal(islandImage(NIGHT, 'c10630', false), `${NIGHT}/10630.webp`)
  for (const code of [...FARMS, ...FIELDS]) assert.equal(islandImage(NIGHT, `c${code}`, true), `${NIGHT}/${code}.webp`, code)
  for (const code of FARMS) assert.equal(islandImage(NIGHT, `c${code}`, false), `${NIGHT}/farm-back.webp`, code)
  for (const code of FIELDS) assert.equal(islandImage(NIGHT, `c${code}`, false), `${NIGHT}/field-back.webp`, code)
  for (const file of islandSetFiles(NIGHT)) {
    assert.ok(existsSync(new URL(`../public/${file}`, import.meta.url)), file)
    assert.ok(isWebp(file), file)
  }
})

test('the board is the empty field with the sprite folder and no anchors', () => {
  const board = hemlockOverview('c10626', 'c10626')
  assert.equal(board?.image, 'img/scenes/hemlock-vale/longest-night-fields.webp')
  assert.equal(board?.islands, NIGHT)
  assert.equal(Object.keys(board?.anchors ?? {}).length, 0)
  assert.ok(isWebp(board.image))
})
