import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

const source = new URL('../src/', import.meta.url)
const read = (path) => readFileSync(new URL(path, source), 'utf8')
const transpile = (name) => ts.transpile(read(`arkham/${name}.ts`), {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ES2022,
})
const moduleUrl = (code) => 'data:text/javascript;base64,' + Buffer.from(code).toString('base64')
const { lateCampaignStoryArt, lateCampaignStoryArtFor } = await import(moduleUrl(
  transpile('lateCampaignStoryArt').replace('./narration', moduleUrl(transpile('narration'))),
))

function localeEntries(language, prefix) {
  const root = new URL(`locales/${language}/${prefix}/`, source)
  const entries = {}
  for (const file of readdirSync(root, { recursive: true, encoding: 'utf8' })) {
    if (!file.endsWith('.json')) continue
    const story = JSON.parse(readFileSync(new URL(file.replaceAll('\\', '/'), root), 'utf8'))
    const name = file.split(/[\\/]/).at(-1).slice(0, -5)
    if (name === 'base' || name === 'interludes') Object.assign(entries, story)
    else entries[name] = story
  }
  return entries
}

test('the story map serves both languages and every mapped WebP is bundled', () => {
  const component = read('arkham/components/StoryIllustration.vue')
  for (const { prefix, directory, passages } of Object.values(lateCampaignStoryArt)) {
    assert.ok(component.includes(`../../assets/${directory}/*.webp`), directory)
    const en = localeEntries('en', prefix)
    const vi = localeEntries('vi', prefix)
    for (const [key, file] of Object.entries(passages)) {
      for (const [lang, stories] of [['en', en], ['vi', vi]]) {
        const text = key.split('.').reduce((value, segment) => value?.[segment], stories)
        assert.equal(typeof text, 'string', `${lang}:${prefix}.${key}`)
      }
      const path = `assets/${directory}/${file}.webp`
      const buffer = readFileSync(new URL(path, source))
      assert.equal(buffer.toString('ascii', 8, 12), 'WEBP', path)
    }
  }
})

test('lookup follows nested narrative keys and excludes invalid and foreign entries', () => {
  const entry = {
    tag: 'I18nEntry',
    key: 'theDrownedCity.prologue.body',
    variables: {},
  }
  const invalid = { tag: 'ModifyEntry', modifiers: ['InvalidEntry'], entry }
  const narrative = { tag: 'ModifyEntry', modifiers: ['ResolutionEntry'], entry }
  assert.equal(lateCampaignStoryArtFor('11', [invalid]), undefined)
  assert.equal(lateCampaignStoryArtFor('08', [narrative]), undefined)
  assert.equal(lateCampaignStoryArtFor(undefined, [narrative]), undefined)
  assert.equal(lateCampaignStoryArtFor('11', [
    { tag: 'CompositeEntry', entries: [invalid, narrative] },
  ]), 'drowned-city-story/drowned-eerie-arkham')
})
