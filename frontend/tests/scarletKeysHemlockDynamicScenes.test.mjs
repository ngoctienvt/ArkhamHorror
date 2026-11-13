import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

/* Written in Rock, The Silent Heath, Without a Trace and Congress of the Keys: sprite sets and board registration. */
const toUrl = (src) => 'data:text/javascript;base64,' + Buffer.from(ts.transpile(src, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })).toString('base64')
const read = (file) => readFileSync(new URL(`../src/arkham/${file}`, import.meta.url), 'utf8')
const { islandImage, islandAspect, islandSetFiles, islandRails, vehicleSprite } = await import(toUrl(read('scene-island-sprites.ts')))
const { hemlockOverview } = await import(toUrl(read('hemlock-overview.ts').replace(/'\.\/scene-anchors-the-dream-eaters'/, JSON.stringify(toUrl(read('scene-anchors-the-dream-eaters.ts'))))))

const ROCK = 'img/scenes/hemlock-vale/written-in-rock'
const HEATH = 'img/scenes/hemlock-vale/silent-heath'
const TRACE = 'img/scenes/the-scarlet-keys/without-a-trace'
const CONGRESS = 'img/scenes/the-scarlet-keys/congress-of-the-keys'
const isWebp = (file) => readFileSync(new URL(`../public/${file}`, import.meta.url)).subarray(8, 12).toString('ascii') === 'WEBP'
const caves = ['10716', '10717', '10718', '10719', '10720']

test('Written in Rock: cave and rail backs, single-sided stations, mine cart', () => {
  for (const code of caves) {
    assert.equal(islandImage(ROCK, `c${code}`, true), `${ROCK}/${code}.webp`, code)
    assert.equal(islandImage(ROCK, `c${code}`, false), `${ROCK}/cavern-back.webp`, code)
  }
  for (const code of ['10510', '10511', '10512', '10513', '10514', '10515', '10516']) {
    assert.equal(islandImage(ROCK, `c${code}`, true), `${ROCK}/${code}.webp`, code)
    assert.equal(islandImage(ROCK, `c${code}`, false), `${ROCK}/rail-back.webp`, code)
  }
  assert.equal(islandImage(ROCK, 'c10510a', true), `${ROCK}/10510.webp`)
  for (const code of ['10508', '10509']) assert.equal(islandImage(ROCK, `c${code}`, false), `${ROCK}/${code}.webp`, code)
  assert.equal(vehicleSprite(ROCK, 'c10507'), `${ROCK}/mine-cart.webp`)
  assert.equal(islandAspect(ROCK, 'c10510', false), 3 / 2)
})

test('The Silent Heath: start locations and lairs always up, caves face down', () => {
  for (const code of ['10555', '10556', '10557', '10558', '10559', '10560']) {
    assert.equal(islandImage(HEATH, `c${code}`, false), `${HEATH}/${code}.webp`, code)
  }
  for (const code of caves) {
    assert.equal(islandImage(HEATH, `c${code}`, true), `${HEATH}/${code}.webp`, code)
    assert.equal(islandImage(HEATH, `c${code}`, false), `${HEATH}/cavern-back.webp`, code)
  }
})

test('Without a Trace: Remnants share a back and A/B/C printings share art', () => {
  assert.equal(islandImage(TRACE, 'c09688', false), `${TRACE}/09688.webp`)
  assert.equal(islandImage(TRACE, 'c09689', true), `${TRACE}/09689.webp`)
  assert.equal(islandImage(TRACE, 'c09689', false), `${TRACE}/remnants-back.webp`)
  for (const code of ['09747', '09748', '09749', '09750']) {
    assert.equal(islandImage(TRACE, `c${code}`, false), `${TRACE}/remnants-back.webp`, code)
    for (const suffix of ['', 'a', 'b', 'c']) assert.equal(islandImage(TRACE, `c${code}${suffix}`, true), `${TRACE}/${code}.webp`, code + suffix)
  }
})

test('Congress of the Keys: Lair and Sanctum share art, sanctuaries and Remnants have their own backs', () => {
  const pairs = [['09705', '09704'], ['09707', '09706'], ['09709', '09708'], ['09711', '09710']]
  for (const [lair, sanctum] of pairs) {
    assert.equal(islandImage(CONGRESS, `c${lair}`, true), `${CONGRESS}/${sanctum}.webp`, lair)
    assert.equal(islandImage(CONGRESS, `c${sanctum}`, true), `${CONGRESS}/${sanctum}.webp`, sanctum)
  }
  for (const code of ['09706', '09707', '09708', '09709', '09710', '09711']) {
    assert.equal(islandImage(CONGRESS, `c${code}`, false), `${CONGRESS}/sanctuary-back.webp`, code)
  }
  for (const code of ['09704', '09712']) assert.equal(islandImage(CONGRESS, `c${code}`, false), `${CONGRESS}/${code}.webp`, code)
  for (const code of ['09713', '09714', '09747', '09750']) {
    assert.equal(islandImage(CONGRESS, `c${code}`, true), `${CONGRESS}/${code}.webp`, code)
  }
  assert.equal(islandImage(CONGRESS, 'c09748', false), `${CONGRESS}/remnants-back.webp`)
})

test('every sprite and board file exists and is WebP', () => {
  assert.equal(islandSetFiles(ROCK).length, 18)
  assert.equal(islandSetFiles(HEATH).length, 12)
  assert.equal(islandSetFiles(TRACE).length, 7)
  assert.equal(islandSetFiles(CONGRESS).length, 13)
  for (const file of [ROCK, HEATH, TRACE, CONGRESS].flatMap(islandSetFiles)) {
    assert.ok(existsSync(new URL(`../public/${file}`, import.meta.url)), file)
    assert.ok(isWebp(file), file)
  }
})

test('boards use the empty backgrounds and sprite folders, with no anchors; Congress switches to the Otherworld at the tower', () => {
  const cases = [
    ['c10501', 'img/scenes/hemlock-vale/written-in-rock-mine.webp', ROCK],
    ['c10549', 'img/scenes/hemlock-vale/silent-heath-snowfield.webp', HEATH],
    ['c09681', 'img/scenes/the-scarlet-keys/without-a-trace-otherworld.webp', TRACE],
    ['c09694', 'img/scenes/the-scarlet-keys/congress-halls.webp', CONGRESS],
  ]
  for (const [id, image, islands] of cases) {
    const board = hemlockOverview(id, id)
    assert.equal(board?.image, image, id)
    assert.equal(board?.islands, islands, id)
    assert.equal(board?.fixedPassages, false, id)
    assert.ok(isWebp(image), image)
    assert.equal(Object.keys(board?.anchors ?? {}).length, 0, id)
  }
  assert.equal(hemlockOverview('c09694', 'c09694', null, [], ['c09704', 'c09706'])?.image, 'img/scenes/the-scarlet-keys/congress-halls.webp')
  const tower = hemlockOverview('c09694', 'c09694', null, [], ['c09712', 'c09747a'])
  assert.equal(tower?.image, 'img/scenes/the-scarlet-keys/congress-otherworld.webp')
  assert.ok(isWebp(tower.image))
})

test('Written in Rock: revealed rail tiles carry their printed tracks, the A and B printings differ', () => {
  assert.deepEqual(islandRails(ROCK, 'c10512a', true)?.turns, [90, 270])
  assert.deepEqual(islandRails(ROCK, 'c10512b', true)?.turns, [0, 180])
  assert.deepEqual(islandRails(ROCK, 'c10515', true)?.turns, [0, 90, 180, 270])
  assert.equal(islandRails(ROCK, 'c10515', false), undefined)
  assert.deepEqual(islandRails(ROCK, 'c10509', false)?.turns, [180])
  assert.equal(islandRails(ROCK, 'c10716', true), undefined)
  assert.equal(islandRails(HEATH, 'c10555', true), undefined)
  assert.equal(islandRails(ROCK, 'c10512a', true)?.src, `${ROCK}/rail-arm.webp`)
})
