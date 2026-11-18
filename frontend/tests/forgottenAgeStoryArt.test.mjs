import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

const transpile = name => ts.transpile(
  readFileSync(new URL(`../src/arkham/${name}.ts`, import.meta.url), 'utf8'),
  { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
)
const moduleUrl = source => 'data:text/javascript;base64,' + Buffer.from(source).toString('base64')
const narrationUrl = moduleUrl(transpile('narration'))
const { entryKeys } = await import(narrationUrl)
const { forgottenAgeStoryArtFor, forgottenAgeStoryArtByPassage } = await import(moduleUrl(
  transpile('forgottenAgeStoryArt').replace('./narration', narrationUrl),
))

const localeRoot = language => new URL(`../src/locales/${language}/theForgottenAge/`, import.meta.url)
const readLocale = (language, file) => JSON.parse(readFileSync(new URL(file, localeRoot(language)), 'utf8'))
const scenarios = readdirSync(new URL('scenarios/', localeRoot('en'))).filter(file => file.endsWith('.json'))
const entry = passage => ({ tag: 'I18nEntry', key: 'theForgottenAge.' + passage, variables: {} })
const art = (passage, id = '53') => forgottenAgeStoryArtFor(id, [entry(passage)])
const leafAt = (value, path) => path.split('.').reduce((parent, key) => parent?.[key], value)

test('the base campaign and Return to share art, including the split Heart of the Elders aliases', () => {
  for (const id of ['04', '53']) {
    assert.equal(art('prologue.body', id), 'untamed-prologue')
    assert.equal(art('heartOfTheElders.part1.intro.intro3', id), 'elders-alejandro-lock')
    assert.equal(art('heartOfTheEldersPart1.part1.intro.intro3', id), 'elders-alejandro-lock')
    assert.equal(art('heartOfTheEldersPart2.part2.resolutions.noResolution.body', id), 'elders-yoth-door')
    assert.equal(art('turnBackTime.resolutions.resolution1.body', id), 'time-journal-locked')
  }
  assert.equal(art('threadsOfFate.intro.intro7'), 'threads-french-hill')
  assert.equal(art('prologue.body', '02'), undefined)
  assert.equal(forgottenAgeStoryArtFor(undefined, [entry('prologue.body')]), undefined)
})

test('a marked-inactive Boundary Beyond branch cannot hide or preview the active scene', () => {
  const inactive = entry('theBoundaryBeyond.intro.ichtaca.ichtacasQuest')
  const active = entry('theBoundaryBeyond.intro.ichtaca.silentJourney')
  const results = [{
    tag: 'ModifyEntry', modifiers: ['GreenEntry'], entry: {
      tag: 'CompositeEntry',
      entries: [
        entry('theBoundaryBeyond.intro.ichtaca.instructions'),
        { tag: 'ModifyEntry', modifiers: ['InvalidEntry'], entry: inactive },
        { tag: 'ModifyEntry', modifiers: ['ValidEntry'], entry: active },
      ],
    },
  }]
  assert.equal(forgottenAgeStoryArtFor('53', results), 'boundary-ichtaca-silent')
  assert.equal(forgottenAgeStoryArtFor('04', [{
    tag: 'ModifyEntry', modifiers: ['InvalidEntry'], entry: active,
  }]), undefined)
  assert.deepEqual(entryKeys(results).slice(-2), [inactive.key, active.key])
})

const routing = new Set([
  'theDoomOfEztli.resolutions.noResolution.body',
  'theDepthsOfYoth.resolutions.noResolution.body',
  'shatteredAeons.resolutions.noResolution.body',
])

function checkScenario(prefix, scenario) {
  for (const [key, value] of Object.entries(scenario.intro ?? {})) {
    if (key === 'body' || /^(intro|part)\d+$/.test(key)) {
      const body = typeof value === 'object' ? '.body' : ''
      assert.ok(art(`${prefix}.intro.${key}${body}`), `${prefix}.intro.${key}${body}`)
    }
    if (prefix === 'theBoundaryBeyond' && typeof value === 'object') {
      for (const branch of Object.keys(value).filter(name => name !== 'instructions')) {
        const passage = `${prefix}.intro.${key}.${branch}`
        assert.ok(art(passage), passage)
      }
    }
  }
  for (const [key, value] of Object.entries(scenario.resolutions ?? {})) {
    if (!value.body) continue
    const passage = `${prefix}.resolutions.${key}.body`
    if (!routing.has(passage)) assert.ok(art(passage), passage)
  }
}

test('every scenario intro and resolution with a story is illustrated', () => {
  for (const file of scenarios) {
    const name = file.slice(0, -5)
    const scenario = readLocale('en', `scenarios/${file}`)
    if (name.startsWith('heartOfTheElders')) {
      checkScenario(`${name}.part1`, scenario.part1)
      checkScenario(`${name}.part2`, scenario.part2)
    } else {
      checkScenario(name, scenario)
    }
  }
  for (const passage of routing) assert.equal(art(passage), undefined, passage)
  assert.equal(art('threadsOfFate.intro.proceedToIntro2'), undefined)
  assert.equal(art('interlude5.theMissingRelic'), undefined)
})

test('the prologue, five interludes, and epilogue cover the campaign prose', () => {
  const base = readLocale('en', 'base.json')
  const dedicated = [
    'prologue.earthIsNotOurs.body', 'prologue.body', 'interlude3.body', 'interlude3.canteen',
    'interlude4.chalk', 'interlude4.blanket', 'interlude5.torches', 'interlude5.senseOfTime', 'epilogue.body',
  ]
  for (const passage of dedicated) assert.ok(art(passage), passage)
  for (const section of ['interlude1', 'interlude2', 'interlude3', 'interlude4', 'interlude5']) {
    for (const [key, value] of Object.entries(base[section])) {
      if (typeof value !== 'string' || !/^_/.test(value.replace(/<[^>]+>/g, '').trim())) continue
      assert.ok(art(`${section}.${key}`), `${section}.${key}`)
    }
  }
})

test('each illustration refers to bilingual text and a bundled WebP', () => {
  const assets = new URL('../src/assets/forgotten-age-story/', import.meta.url)
  const artFiles = [...new Set(Object.values(forgottenAgeStoryArtByPassage))].map(name => name + '.webp').sort()
  const cardFaces = ["story-04325b.webp","story-04326b.webp"]
  assert.deepEqual(readdirSync(assets).sort(), [...artFiles, ...cardFaces].sort())
  for (const file of [...artFiles, ...cardFaces]) {
    const bytes = readFileSync(new URL(file, assets))
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF', file)
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP', file)
  }
  for (const language of ['en', 'vi']) {
    const story = readLocale(language, 'base.json')
    for (const file of scenarios) story[file.slice(0, -5)] = readLocale(language, `scenarios/${file}`)
    for (const passage of Object.keys(forgottenAgeStoryArtByPassage)) {
      assert.equal(typeof leafAt(story, passage), 'string', `${language} ${passage}`)
    }
  }
})

test('matching outcomes share an illustration while changes in decisions or consequences get their own', () => {
  assert.equal(art('shatteredAeons.resolutions.resolution4.body'), art('turnBackTime.resolutions.noResolution.body'))
  assert.equal(art('heartOfTheEldersPart2.part2.resolutions.resolution1.body'), art('heartOfTheEldersPart2.part2.resolutions.resolution2.body'))
  const distinct = [
    ['theUntamedWilds.resolutions.resolution1.body', 'theUntamedWilds.resolutions.resolution2.body'],
    ['interlude2.expeditionsEnd2', 'interlude2.expeditionsEnd3'],
    ['theCityOfArchives.intro.intro2', 'theCityOfArchives.intro.intro3'],
    ['interlude4.theWayIsOpen', 'interlude4.theWayIsShut'],
    ['theDepthsOfYoth.intro.intro7', 'theDepthsOfYoth.intro.intro8'],
    ['interlude5.torchlight', 'interlude5.theAbyss'],
    ['shatteredAeons.resolutions.resolution2.body', 'shatteredAeons.resolutions.resolution3.body'],
  ]
  for (const [first, second] of distinct) {
    assert.ok(art(first) && art(second))
    assert.notEqual(art(first), art(second), `${first} and ${second}`)
  }
})
