import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

const source = new URL('../src/', import.meta.url)
const read = (path) => readFileSync(new URL(path, source), 'utf8')
const transpile = (name) => ts.transpile(read(`arkham/${name}.ts`), {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ES2022,
})
const moduleUrl = (code) => 'data:text/javascript;base64,' + Buffer.from(code).toString('base64')
const { standaloneStoryArtByPassage, standaloneStoryArtFor } = await import(moduleUrl(
  transpile('standaloneStoryArt').replace('./narration', moduleUrl(transpile('narration'))),
))

const entry = (key) => ({ tag: 'I18nEntry', key, variables: {} })
const rougarou = 'standalone.curseOfTheRougarou'

test('standalone art uses localized story keys and bundled landscape WebPs', () => {
  const component = read('arkham/components/StoryIllustration.vue')
  assert.ok(component.includes('../../assets/standalone-story/*.webp'))
  for (const [key, filename] of Object.entries(standaloneStoryArtByPassage)) {
    const [, scenario, ...path] = key.split('.')
    for (const language of ['en', 'vi']) {
      const story = JSON.parse(read(`locales/${language}/standalone/${scenario}.json`))
      const paragraph = path.reduce((value, segment) => value?.[segment], story)
      assert.equal(typeof paragraph, 'string', `${language}:${key}`)
    }
    const asset = new URL(`assets/standalone-story/${filename}.webp`, source)
    const bytes = readFileSync(asset)
    assert.equal(bytes.toString('ascii', 8, 16), 'WEBPVP8 ', asset.href)
    assert.equal(bytes.readUInt16LE(26) & 0x3fff, 1536, asset.href)
    assert.equal(bytes.readUInt16LE(28) & 0x3fff, 1024, asset.href)
  }
})

test('Rougarou resolves nested entries without a campaign and skips the mechanical redirect', () => {
  const ending = entry(`${rougarou}.resolutions.resolution2.body`)
  const invalid = {
    tag: 'ModifyEntry',
    modifiers: ['InvalidEntry'],
    entry: entry(`${rougarou}.intro.body`),
  }
  const resolution = { tag: 'ModifyEntry', modifiers: ['ResolutionEntry'], entry: ending }
  assert.equal(standaloneStoryArtFor([entry(`${rougarou}.resolutions.noResolution.body`)]), undefined)
  assert.equal(standaloneStoryArtFor([invalid]), undefined)
  assert.equal(standaloneStoryArtFor([
    { tag: 'CompositeEntry', entries: [invalid, resolution] },
  ]), 'rougarou-curse-lifted')
  const passages = ['intro.body', ...[1, 2, 3].map((n) => `resolutions.resolution${n}.body`)]
  const art = passages.map((key) => standaloneStoryArtFor([entry(`${rougarou}.${key}`)]))
  assert.ok(art.every(Boolean))
  assert.equal(new Set(art).size, passages.length)
})

test('Excelsior shares the knock at room 225 and distinguishes flight from defeat', () => {
  const art = (key) => standaloneStoryArtFor([entry(`standalone.murderAtTheExcelsiorHotel.${key}`)])
  assert.equal(art('intro.intro2'), 'excelsior-knock-225')
  assert.equal(art('intro.intro3'), 'excelsior-knock-225')
  assert.equal(art('resolutions.noResolution.body'), 'excelsior-collapsed-on-carpet')
  assert.equal(art('resolutions.noResolutionResigned.body'), 'excelsior-police-knock')
})

test('the challenge scenarios have distinct introductions and resolutions', () => {
  const scenarios = [
    'allOrNothing', 'badBlood', 'byTheBook', 'readOrDie', 'redTideRising',
    'laidToRest', 'relicsOfThePast', 'enthrallingEncore',
  ]
  for (const scenario of scenarios) {
    const passages = ['intro.body', 'resolutions.resolution1.body', 'resolutions.resolution2.body']
    const images = passages.map((key) => standaloneStoryArtFor([entry(`standalone.${scenario}.${key}`)]))
    assert.ok(images.every(Boolean), scenario)
    assert.equal(new Set(images).size, passages.length, scenario)
  }
})
