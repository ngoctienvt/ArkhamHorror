import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

const transpile = name => ts.transpile(
  readFileSync(new URL(`../src/arkham/${name}.ts`, import.meta.url), 'utf8'),
  { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
)
const moduleUrl = source => 'data:text/javascript;base64,' + Buffer.from(source).toString('base64')
const { dunwichStoryArtFor, dunwichStoryArtByPassage } = await import(moduleUrl(
  transpile('dunwichStoryArt').replace('./narration', moduleUrl(transpile('narration'))),
))

const localeRoot = language => new URL(`../src/locales/${language}/theDunwichLegacy/`, import.meta.url)
const readLocale = (language, path) => JSON.parse(readFileSync(new URL(path, localeRoot(language)), 'utf8'))
const scenarioFiles = readdirSync(new URL('scenarios/', localeRoot('en'))).filter(file => file.endsWith('.json'))
const passageEntry = passage => ({ tag: 'I18nEntry', key: 'theDunwichLegacy.' + passage, variables: {} })

const routingPassages = new Set([
  'theHouseAlwaysWins.resolutions.noResolution.body',
  'undimensionedAndUnseen.resolutions.noResolution.body',
  'whereDoomAwaits.resolutions.noResolution.body',
  'interlude1.proceedToArmitagesFate1',
  'interlude1.proceedToArmitagesFate2',
  'epilogue.intro',
])

test('both Dunwich campaigns read the same illustration through nested story entries', () => {
  const passage = 'theEssexCountyExpress.resolutions.defeat'
  const entries = [
    passageEntry('theEssexCountyExpress.resolutions.xp'),
    { tag: 'ModifyEntry', modifiers: ['ResolutionEntry'], entry: passageEntry(passage) },
  ]
  assert.equal(dunwichStoryArtFor('02', entries), 'train-woods-wreck')
  assert.equal(dunwichStoryArtFor('51', entries), 'train-woods-wreck')
  assert.equal(dunwichStoryArtFor('52', entries), undefined)
  assert.equal(dunwichStoryArtFor(undefined, entries), undefined)
})

test('narrative scenario passages are covered without illustrating routing prompts', () => {
  assert.equal(scenarioFiles.length, 8)
  for (const file of scenarioFiles) {
    const scenario = file.slice(0, -5)
    const { intro, resolutions } = readLocale('en', `scenarios/${file}`)
    for (const [key, entry] of Object.entries(intro)) {
      if (!/^(body|part\d+)$/.test(key)) continue
      const passage = `${scenario}.intro.${key}${typeof entry === 'object' ? '.body' : ''}`
      assert.ok(dunwichStoryArtByPassage[passage], passage)
    }
    for (const [key, entry] of Object.entries(resolutions)) {
      if (!entry.body && !/^defeat(?:ed)?$/.test(key)) continue
      const passage = `${scenario}.resolutions.${key}${entry.body ? '.body' : ''}`
      if (!routingPassages.has(passage)) assert.ok(dunwichStoryArtByPassage[passage], passage)
    }
  }
  for (const passage of routingPassages) {
    assert.equal(dunwichStoryArtFor('51', [passageEntry(passage)]), undefined, passage)
  }
})

test('the prologue, both interludes, and both epilogues have story art', () => {
  const base = readLocale('en', 'base.json')
  for (const section of ['prologue', 'interlude1', 'interlude2', 'epilogue']) {
    for (const [key, entry] of Object.entries(base[section])) {
      if (typeof entry !== 'string' || !entry.includes('<p')) continue
      const passage = `${section}.${key}`
      if (routingPassages.has(passage)) continue
      assert.ok(dunwichStoryArtByPassage[passage], passage)
    }
  }
})

test('each illustration has an English and Vietnamese story key and a WebP asset', () => {
  for (const language of ['en', 'vi']) {
    const story = readLocale(language, 'base.json')
    for (const file of scenarioFiles) story[file.slice(0, -5)] = readLocale(language, `scenarios/${file}`)
    for (const passage of Object.keys(dunwichStoryArtByPassage)) {
      const entry = passage.split('.').reduce((value, key) => value?.[key], story)
      assert.equal(typeof entry, 'string', `${language} ${passage}`)
    }
  }
  const assetDir = new URL('../src/assets/dunwich-story/', import.meta.url)
  const expected = [...new Set(Object.values(dunwichStoryArtByPassage))].map(name => name + '.webp').sort()
  assert.deepEqual(readdirSync(assetDir).sort(), expected)
  for (const name of expected) {
    const bytes = readFileSync(new URL(name, assetDir))
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF', name)
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP', name)
  }
})

test('the same Sentinel Hill finale shares art, with distinct art for alternate outcomes', () => {
  const art = passage => dunwichStoryArtFor('51', [passageEntry(passage)])
  assert.equal(art('whereDoomAwaits.resolutions.resolution2.body'), art('lostInTimeAndSpace.resolutions.resolution4.body'))
  const branches = [
    ['theMiskatonicMuseum.resolutions.resolution1.body', 'theMiskatonicMuseum.resolutions.resolution2.body'],
    ['bloodOnTheAltar.resolutions.resolution2.body', 'bloodOnTheAltar.resolutions.resolution3.body'],
    ['undimensionedAndUnseen.intro.part1', 'undimensionedAndUnseen.intro.part2'],
    ['undimensionedAndUnseen.resolutions.resolution1.body', 'undimensionedAndUnseen.resolutions.resolution2.body'],
    ['lostInTimeAndSpace.resolutions.resolution1.body', 'lostInTimeAndSpace.resolutions.resolution2.body'],
    ['epilogue.epilogue1', 'epilogue.epilogue2'],
  ]
  for (const [first, second] of branches) {
    assert.ok(art(first) && art(second))
    assert.notEqual(art(first), art(second), `${first} and ${second}`)
  }
})

test('the story page and both in-game read layouts pass campaign and story entries to the artwork', () => {
  const component = name => readFileSync(new URL(`../src/arkham/components/${name}.vue`, import.meta.url), 'utf8')
  const readPanel = /<StoryIllustration\s+:campaign-id="game\.campaign\?\.id"\s+:entries="question\.flavorText\.body"\s*\/>[\s\S]*?<FormattedEntry/
  assert.match(component('StoryEntry'), readPanel)
  assert.match(component('Question'), new RegExp('class="story-with-card"[\\s\\S]*?' + readPanel.source))
  assert.match(component('Question'), new RegExp('class="intro-text-body"[\\s\\S]*?' + readPanel.source))
})
