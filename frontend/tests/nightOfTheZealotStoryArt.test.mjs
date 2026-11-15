import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

const moduleUrl = name => {
  const source = readFileSync(new URL(`../src/arkham/${name}.ts`, import.meta.url), 'utf8')
  const js = ts.transpile(source, {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ES2022,
  })
  const resolved = name === 'narration' ? js : js.replace('./narration', moduleUrl('narration'))
  return 'data:text/javascript;base64,' + Buffer.from(resolved).toString('base64')
}
const { nightOfTheZealotStoryArtFor: findArt, nightOfTheZealotStoryArtByPassage: art } =
  await import(moduleUrl('nightOfTheZealotStoryArt'))
const i18n = passage => ({ tag: 'I18nEntry', key: 'nightOfTheZealot.' + passage, variables: {} })
const routing = [
  'theMidnightMasks.intro.body',
  'theMidnightMasks.resolutions.noResolution.body',
]

test('both campaigns use the actual nested story entry, skipping routing and hidden passages', () => {
  const entries = [
    i18n(routing[0]),
    { tag: 'ModifyEntry', modifiers: ['InvalidEntry'], entry: i18n('theMidnightMasks.intro2') },
    { tag: 'CompositeEntry', entries: [i18n('theMidnightMasks.intro1')] },
  ]
  assert.equal(findArt('01', entries), 'masks-new-allies')
  assert.equal(findArt('50', entries), 'masks-new-allies')
  assert.equal(findArt('03', entries), undefined)
  assert.equal(findArt(undefined, entries), undefined)
  for (const passage of routing) assert.equal(findArt('50', [i18n(passage)]), undefined)
  assert.equal(findArt('50', [i18n(routing[1]), i18n('theMidnightMasks.resolutions.resolution1.body')]),
    'masks-leads-recorded')
})

test('English and Vietnamese narrative passages have matching keys and a distinct bundled WebP', () => {
  const artworkDir = new URL('../src/assets/night-of-the-zealot-story/', import.meta.url)
  for (const language of ['en', 'vi']) {
    const root = new URL(`../src/locales/${language}/nightOfTheZealot/`, import.meta.url)
    const readJson = path => JSON.parse(readFileSync(new URL(path, root), 'utf8'))
    const passages = ['prologue']
    assert.equal(typeof readJson('base.json').prologue, 'string')

    for (const file of readdirSync(new URL('scenarios/', root)).filter(f => f.endsWith('.json'))) {
      const scenario = file.slice(0, -5)
      const locale = readJson('scenarios/' + file)
      if (locale.intro?.body) passages.push(scenario + '.intro.body')
      for (const key of Object.keys(locale).filter(key => /^intro\d+$/.test(key))) {
        if (typeof locale[key] === 'string') passages.push(scenario + '.' + key)
      }
      for (const [key, entry] of Object.entries(locale.resolutions)) {
        if (entry.body) passages.push(`${scenario}.resolutions.${key}.body`)
      }
    }

    assert.deepEqual(Object.keys(art).sort(), passages.filter(p => !routing.includes(p)).sort(), language)
  }

  const assets = Object.values(art)
  assert.equal(new Set(assets).size, assets.length)
  for (const name of assets) {
    const contents = readFileSync(new URL(name + '.webp', artworkDir))
    assert.equal(contents.toString('ascii', 8, 12), 'WEBP', name)
  }
})
