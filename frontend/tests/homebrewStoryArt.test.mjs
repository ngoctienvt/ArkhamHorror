import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

const source = new URL('../src/', import.meta.url)
const homebrew = new URL('../homebrew/', import.meta.url)
const assets = new URL('assets/homebrew-story/', source)
const read = (path) => readFileSync(new URL(path, source), 'utf8')
const toModuleUrl = (code) => 'data:text/javascript;base64,' + Buffer.from(code).toString('base64')
const compile = (name) => ts.transpile(read(`arkham/${name}.ts`), {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ES2022,
})
const { homebrewStoryArtByPassage, homebrewStoryArtFor } = await import(toModuleUrl(
  compile('homebrewStoryArt').replace('./narration', toModuleUrl(compile('narration'))),
))

function messages(scope, language) {
  const slug = scope.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
  const directory = new URL(`${slug}/locales/${language}/`, homebrew)
  if (!existsSync(directory)) return {}
  return Object.assign({}, ...readdirSync(directory)
    .filter((name) => name.endsWith('.json'))
    .map((name) => JSON.parse(readFileSync(new URL(name, directory), 'utf8'))))
}

test('homebrew art is bundled and resolves against the English and Vietnamese message scopes', () => {
  assert.ok(read('arkham/components/StoryIllustration.vue').includes('../../assets/homebrew-story/*.webp'))
  const expectedFiles = new Set()
  const localesByScope = new Map()
  for (const [key, filename] of Object.entries(homebrewStoryArtByPassage)) {
    const [scope, ...path] = key.split('.')
    if (!localesByScope.has(scope)) {
      const english = messages(scope, 'en')
      localesByScope.set(scope, [english, { ...english, ...messages(scope, 'vi') }])
    }
    for (const locale of localesByScope.get(scope)) {
      assert.equal(typeof path.reduce((value, segment) => value?.[segment], locale), 'string', key)
    }
    const name = `${filename}.webp`
    if (!expectedFiles.has(name)) {
      const bytes = readFileSync(new URL(name, assets))
      assert.equal(bytes.toString('ascii', 8, 16), 'WEBPVP8 ', name)
      assert.equal(bytes.readUInt16LE(26) & 0x3fff, 1536, name)
      assert.equal(bytes.readUInt16LE(28) & 0x3fff, 1024, name)
      expectedFiles.add(name)
    }
  }
  assert.deepEqual(new Set(readdirSync(assets).filter((name) => name.endsWith('.webp'))), expectedFiles)
})

test('Wendigo art distinguishes defeat and victory and skips invalid panels', () => {
  const entry = (key) => ({ tag: 'I18nEntry', key: `againstTheWendigo.scenario.${key}`, variables: {} })
  const defeat = entry('resolutions.noResolution.body')
  const victory = entry('resolutions.resolution1.body')
  assert.equal(homebrewStoryArtFor([defeat]), 'wendigo-back-at-fort')
  assert.equal(homebrewStoryArtFor([{
    tag: 'CompositeEntry',
    entries: [{ tag: 'ModifyEntry', modifiers: ['InvalidEntry'], entry: defeat }, victory],
  }]), 'wendigo-reverts-to-man')
})
