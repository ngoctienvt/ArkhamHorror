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
const { dreamEatersStoryArtByPassage, dreamEatersStoryArtFor } = await import(moduleUrl(
  transpile('dreamEatersStoryArt').replace('./narration', moduleUrl(transpile('narration'))),
))

const entry = (key) => ({ tag: 'I18nEntry', key, variables: {} })
const storyEntry = (passage) => entry(`theDreamEaters.${passage}`)

test('Dream-Eaters maps English and Vietnamese narrative keys to bundled WebPs', () => {
  const component = read('arkham/components/StoryIllustration.vue')
  assert.ok(component.includes('../../assets/dream-eaters-story/*.webp'))
  for (const [key, filename] of Object.entries(dreamEatersStoryArtByPassage)) {
    for (const language of ['en', 'vi']) {
      const [section, ...path] = key.split('.')
      const root = `locales/${language}/theDreamEaters`
      const localeFile = section === 'flavorText' ? 'base.json' : `scenarios/${section}.json`
      const story = JSON.parse(read(`${root}/${localeFile}`))
      const group = section === 'flavorText' ? story.flavorText : story
      const paragraph = path.reduce((value, segment) => value?.[segment], group)
      assert.equal(typeof paragraph, 'string', `${language}:${key}`)
    }
    const asset = new URL(`assets/dream-eaters-story/${filename}.webp`, source)
    const bytes = readFileSync(asset)
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF', asset.href)
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP', asset.href)
  }
})

test('lookup follows the actual story branches through nested entries', () => {
  const first = storyEntry('wakingNightmare.flavorText.intro2.body')
  const second = storyEntry('wakingNightmare.flavorText.intro3.body')
  const invalid = { tag: 'ModifyEntry', modifiers: ['InvalidEntry'], entry: first }
  assert.equal(dreamEatersStoryArtFor([first]), 'waking-doctor-joins')
  assert.equal(dreamEatersStoryArtFor([invalid]), undefined)
  assert.equal(dreamEatersStoryArtFor([
    { tag: 'CompositeEntry', entries: [invalid, second] },
  ]), 'waking-doctor-stays')
  assert.equal(dreamEatersStoryArtFor([entry('standalone.wakingNightmare.flavorText.intro3.body')]), undefined)
  assert.equal(dreamEatersStoryArtFor([storyEntry('wakingNightmare.resolutions.noResolutionDefeated.body')]), undefined)
})

test('every selectable dream has its own art inside the wizard reading panel', () => {
  const scenario = JSON.parse(read('locales/en/theDreamEaters/scenarios/beyondTheGatesOfSleep.json'))
  const images = Object.keys(scenario.dreams).map((dream) => dreamEatersStoryArtFor([
    { tag: 'ListEntry', list: [{ entry: storyEntry(`beyondTheGatesOfSleep.dreams.${dream}.body`), nested: [] }] },
  ]))
  assert.ok(images.every(Boolean))
  assert.equal(new Set(images).size, images.length)
  assert.match(read('arkham/components/Question.vue'), /<StoryIllustration [^>]*:entries="wizardFlavorText\.body"/)
})

test('Dream-Eaters illustrates each epilogue and distinguishes the captured group', () => {
  const images = Array.from({ length: 16 }, (_, index) => dreamEatersStoryArtFor([
    storyEntry(`flavorText.epilogue${index + 1}.body`),
  ]))
  assert.ok(images.every(Boolean))
  assert.equal(new Set(images).size, images.length)
  assert.equal(dreamEatersStoryArtFor([storyEntry('flavorText.allCaptured.body')]), 'cat-ship-captured')
  assert.equal(dreamEatersStoryArtFor([storyEntry('flavorText.atLeastOneNotCaptured.body')]), 'cat-ship')
})
