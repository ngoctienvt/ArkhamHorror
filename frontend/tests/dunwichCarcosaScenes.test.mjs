import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

const source = readFileSync(new URL('../src/arkham/scene-dunwich-carcosa.ts', import.meta.url), 'utf8')
const moduleSource = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
const { dunwichCarcosaScene } = await import('data:text/javascript;base64,' + Buffer.from(moduleSource).toString('base64'))

const state = (acts = [], agendas = [], locations = [], reminders = []) => ({ acts, agendas, locations, reminders })
const act = (id, number, side = 'A') => ({ id: `c${id}`, sequence: { number, side } })
const agenda = (id, step, side = 'A', flipped = false) => ({
  id: `c${id}`, sequence: { step, side }, flipped, deckId: 1,
})
const board = (art) => ({
  image: `img/scenes/${art}.webp`, fixedPassages: false, village: true,
  anchors: { lobbyDoorway1: [7, 55], '03049': [55, 66], '03053': [9, 38] },
})
const image = (art, snapshot) => dunwichCarcosaScene(board(art), snapshot).image

test('Dunwich scenery follows the actual card back and later state', () => {
  const cases = [
    ['the-dunwich-legacy/return-to-the-house-always-wins', '02064', 2, 'damaged'],
    ['the-dunwich-legacy/undimensioned-and-unseen', '02238', 2, 'storm'],
    ['the-dunwich-legacy/blood-on-the-altar', '02196', 1, 'night'],
    ['the-dunwich-legacy/essex-county-rails', '02160', 1, 'maw'],
  ]
  for (const [art, id, step, suffix] of cases) {
    assert.equal(image(art, state([], [agenda(id, step)])), `img/scenes/${art}.webp`)
    assert.equal(image(art, state([], [agenda(id, step, 'B', true)])), `img/scenes/${art}-${suffix}.webp`)
    assert.equal(image(art, state([], [agenda(id, step + 1)])), `img/scenes/${art}-${suffix}.webp`)
  }
  const museum = 'the-dunwich-legacy/return-to-the-miskatonic-museum'
  assert.match(image(museum, state([], [agenda('02119', 1, 'B', true)])), /-shadows.webp$/)
  assert.match(image(museum, state([], [agenda('02120', 2, 'B', true)])), /-darkness.webp$/)
  const hill = 'the-dunwich-legacy/where-doom-awaits'
  assert.match(image(hill, state([act('02277', 1)], [agenda('02275', 1)])), /-quiet.webp$/)
  assert.match(image(hill, state([act('02277', 1)], [agenda('02275', 1, 'B', true)])), /-warped.webp$/)
  assert.match(image(hill, state([act('02278', 2, 'B')], [agenda('02275', 1)])), /-gate.webp$/)
  assert.match(image(hill, state([act('02277', 1)], [agenda('02275', 1)])), /-quiet.webp$/)
})

test('Black Stars Rise keeps flood and vortex agendas independent', () => {
  const art = 'the-path-to-carcosa/black-stars-rise'
  const quietTide = agenda('03275', 1)
  const quietSky = agenda('03278', 1, 'C')
  const flood = agenda('03276a', 2, 'B', true)
  const vortex = agenda('03279a', 2, 'D', true)
  assert.equal(image(art, state([], [quietTide, quietSky])), `img/scenes/${art}-revised.webp`)
  assert.match(image(art, state([], [flood, quietSky])), /-flood.webp$/)
  assert.match(image(art, state([], [quietTide, vortex])), /-vortex.webp$/)
  const combined = dunwichCarcosaScene(board(art), state([], [flood, vortex]))
  assert.match(combined.image, /-flood.webp$/)
  assert.match(combined.locationEffect.image, /-vortex.webp$/)
  assert.match(combined.locationEffect.mask, /linear-gradient/)
  assert.match(image(art, state([], [agenda('03276b', 2, 'B', true), quietSky])), /-revised.webp$/)
  assert.match(image(art, state([], [quietTide, agenda('03279b', 2, 'D', true)])), /-revised.webp$/)
  assert.match(image(art, state([act('03281', 3)], [vortex])), /-vortex.webp$/)
  assert.match(image(art, state([act('03282', 3)], [flood])), /-flood.webp$/)
})

test('Curtain Call shows only the chosen hazard at locations with horror', () => {
  const theatre = 'the-path-to-carcosa/return-to-curtain-call'
  const snapshot = state([], [], [
    { id: 'one', label: 'theatre', cardCode: 'c03049', revealed: true, tokens: { Horror: 1 } },
    { id: 'two', label: 'lobbyDoorway1', cardCode: 'c03053', revealed: false, tokens: { Horror: 1 } },
    { id: 'three', label: 'backstage', cardCode: 'c03052', revealed: true, tokens: {} },
  ], ['c03047a'])
  const result = dunwichCarcosaScene(board(theatre), snapshot)
  assert.match(result.locationEffect.image, /-fire.webp$/)
  assert.match(result.locationEffect.mask, /55% 66%/)
  assert.match(result.locationEffect.mask, /7% 55%/)
  assert.doesNotMatch(result.locationEffect.mask, /9% 38%/)
  assert.equal(dunwichCarcosaScene(board(theatre), state([], [], snapshot.locations, ['c52017'])).locationEffect, undefined)
  for (const [id, suffix] of [['03047b', 'ooze'], ['03047c', 'flood'], ['52015', 'mist'], ['52016', 'vines']]) {
    const path = dunwichCarcosaScene(board(theatre), { ...snapshot, reminders: [id] }).locationEffect.image
    assert.match(path, new RegExp(`-${suffix}\\.webp$`))
    assert.equal(readFileSync(new URL(`../public/${path}`, import.meta.url)).toString('ascii', 8, 12), 'WEBP')
  }
  assert.equal(dunwichCarcosaScene(board(theatre), { ...snapshot, locations: [] }).locationEffect, undefined)
})

test('every Dunwich and Carcosa state image exists as WebP', () => {
  const variants = {
    'the-dunwich-legacy/return-to-the-house-always-wins': ['damaged'],
    'the-dunwich-legacy/return-to-the-miskatonic-museum': ['shadows', 'darkness'],
    'the-dunwich-legacy/essex-county-rails': ['maw'],
    'the-dunwich-legacy/blood-on-the-altar': ['night'],
    'the-dunwich-legacy/undimensioned-and-unseen': ['storm'],
    'the-dunwich-legacy/where-doom-awaits': ['quiet', 'warped', 'gate'],
    'the-path-to-carcosa/black-stars-rise': ['revised', 'flood', 'vortex'],
    'the-path-to-carcosa/return-to-curtain-call': ['fire', 'ooze', 'flood', 'mist', 'vines'],
    'the-path-to-carcosa/the-last-king': ['madness'],
    'the-path-to-carcosa/the-unspeakable-oath': ['revised', 'alarm'],
    'the-path-to-carcosa/a-phantom-of-truth': ['dawn'],
    'the-path-to-carcosa/the-pallid-mask-catacombs': ['collapse'],
    'the-path-to-carcosa/return-to-dim-carcosa': ['theatre'],
  }
  for (const [art, suffixes] of Object.entries(variants)) {
    for (const suffix of suffixes) {
      const path = `../public/img/scenes/${art}-${suffix}.webp`
      assert.equal(readFileSync(new URL(path, import.meta.url)).toString('ascii', 8, 12), 'WEBP', path)
    }
  }
})

test('Carcosa state changes preserve the base layout and available artwork', () => {
  const cases = [
    ['the-path-to-carcosa/the-last-king', state([], [agenda('03062', 1, 'B', true)]), '-madness'],
    ['the-path-to-carcosa/the-unspeakable-oath', state([act('03166', 3)]), '-revised'],
    ['the-path-to-carcosa/the-unspeakable-oath', state([act('03166', 3, 'B')]), '-alarm'],
    ['the-path-to-carcosa/a-phantom-of-truth', state([], [agenda('03201', 1, 'B', true)]), '-dawn'],
    ['the-path-to-carcosa/the-pallid-mask-catacombs', state([act('03245', 3)]), '-collapse'],
    ['the-path-to-carcosa/return-to-dim-carcosa', state([act('03320', 1)]), '-theatre'],
    ['the-path-to-carcosa/return-to-dim-carcosa', state([act('03320', 1, 'B')]), ''],
  ]
  for (const [art, snapshot, suffix] of cases) {
    const result = dunwichCarcosaScene(board(art), snapshot)
    assert.equal(result.image, `img/scenes/${art}${suffix}.webp`)
    if (suffix) assert.equal(result.layoutArt, art)
    assert.equal(readFileSync(new URL(`../public/${result.image}`, import.meta.url)).toString('ascii', 8, 12), 'WEBP')
  }
})
