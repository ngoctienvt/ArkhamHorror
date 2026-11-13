import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

/* The Thing in the Depths: each bog location and its Open Water side have a sprite of their own. */
const toUrl = (src) => 'data:text/javascript;base64,' + Buffer.from(ts.transpile(src, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })).toString('base64')
const read = (file) => readFileSync(new URL(`../src/arkham/${file}`, import.meta.url), 'utf8')
const { islandAspect, islandImage, islandSetFiles } = await import(toUrl(read('scene-island-sprites.ts')))
const { hemlockOverview } = await import(toUrl(read('hemlock-overview.ts').replace(/'\.\/scene-anchors-the-dream-eaters'/, JSON.stringify(toUrl(read('scene-anchors-the-dream-eaters.ts'))))))

const DEPTHS = 'img/scenes/hemlock-vale/thing-in-the-depths'
const LAND = ['10593', '10594', '10595', '10596', '10597', '10598', '10599']
const isWebp = (file) => readFileSync(new URL(`../public/${file}`, import.meta.url)).subarray(8, 12).toString('ascii') === 'WEBP'

test('thing_in_the_depths_sprites_land_and_open_water_have_own_sprite_face_up_or_down', () => {
  for (const code of LAND) {
    for (const revealed of [true, false]) {
      assert.equal(islandImage(DEPTHS, `c${code}a`, revealed), `${DEPTHS}/${code}.webp`, `${code}a ${revealed}`)
      assert.equal(islandImage(DEPTHS, `c${code}b`, revealed), `${DEPTHS}/${code}b.webp`, `${code}b ${revealed}`)
    }
    assert.equal(islandAspect(DEPTHS, `c${code}a`, true), 3 / 2)
  }
})

test('thing_in_the_depths_sprites_foreign_card_gets_plain_water_patch_not_a_location_sprite', () => {
  assert.equal(islandImage(DEPTHS, 'c11111', true), `${DEPTHS}/back.webp`)
  assert.equal(islandImage(DEPTHS, 'c11111', false), `${DEPTHS}/back.webp`)
})

test('thing_in_the_depths_sprites_every_file_exists_and_is_webp', () => {
  const files = islandSetFiles(DEPTHS)
  assert.equal(files.length, 15)
  for (const file of files) {
    assert.ok(existsSync(new URL(`../public/${file}`, import.meta.url)), file)
    assert.ok(isWebp(file), file)
  }
})

test('thing_in_the_depths_board_is_the_empty_swamp_with_sprite_folder_and_no_anchors', () => {
  const board = hemlockOverview('c10588', 'c10588')
  assert.equal(board?.image, 'img/scenes/hemlock-vale/thing-in-the-depths-swamp.webp')
  assert.equal(board?.islands, DEPTHS)
  assert.equal(Object.keys(board?.anchors ?? {}).length, 0)
  assert.ok(isWebp(board.image))
})
