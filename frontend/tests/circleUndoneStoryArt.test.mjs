import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

const transpile = name => ts.transpile(
  readFileSync(new URL(`../src/arkham/${name}.ts`, import.meta.url), 'utf8'),
  { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
)
const moduleUrl = source => 'data:text/javascript;base64,' + Buffer.from(source).toString('base64')
const { circleUndoneStoryArtFor, circleUndoneStoryArtByPassage } = await import(moduleUrl(
  transpile('circleUndoneStoryArt').replace('./narration', moduleUrl(transpile('narration'))),
))

const localeRoot = language => new URL(`../src/locales/${language}/theCircleUndone/`, import.meta.url)
const readLocale = (language, file) => JSON.parse(readFileSync(new URL(file, localeRoot(language)), 'utf8'))
const scenarios = readdirSync(new URL('scenarios/', localeRoot('en'))).filter(file => file.endsWith('.json'))
const entry = passage => ({ tag: 'I18nEntry', key: 'theCircleUndone.' + passage, variables: {} })
const art = (passage, id = '54') => circleUndoneStoryArtFor(id, [entry(passage)])

const routing = new Set([
  'theWitchingHour.resolutions.noResolution.body',
  'atDeathsDoorstep.resolutions.noResolution.body',
  'theWagesOfSin.resolutions.noResolution.body',
  'unionAndDisillusion.resolutions.resolution5.body',
  'inTheClutchesOfChaos.resolutions.noResolution.body',
])

test('all narrative scenario intros, investigations and endings have artwork', () => {
  assert.equal(scenarios.length, 9)
  for (const file of scenarios) {
    const name = file.slice(0, -5)
    const { intro, resolutions, interlude1 } = readLocale('en', `scenarios/${file}`)
    for (const key of Object.keys(intro)) {
      if (!/^(body|intro|intro(?:Part)?\d+(?:Part\d+|Mystic)?|.*Intro|deceivingTheLodge)$/.test(key)) continue
      const passage = `${name}.intro.${key}`
      assert.ok(art(passage), passage)
    }
    for (const [key, value] of Object.entries(resolutions)) {
      if (!value.body) continue
      const passage = `${name}.resolutions.${key}.body`
      if (!routing.has(passage)) assert.ok(art(passage), passage)
    }
    for (const key of ['gavriella', 'jerome', 'penny', 'valentino']) {
      if (!interlude1?.[key]) continue
      assert.ok(art(`${name}.interlude1.${key}`), key)
    }
  }
  for (const passage of routing) assert.equal(art(passage), undefined, passage)
  assert.equal(art('disappearanceAtTheTwilightEstate.intro.returnToChoice'), undefined)
  assert.equal(art('forTheGreaterGood.intro.intro2Skip'), undefined)
})

test('Return to Twilight Estate illustrates each of the four tarot fates', () => {
  const name = 'disappearanceAtTheTwilightEstate'
  const { intro } = readLocale('en', `scenarios/${name}.json`)
  const fateArtwork = {
    'disappeared into the mist': 'tarot-vanishes-mist',
    'was claimed by specters': 'tarot-specters-claim',
    'was pulled into the spectral realm': 'tarot-spectral-realm',
    'was taken by the watcher': 'tarot-watcher-takes',
  }
  let found = 0
  for (const [key, description] of Object.entries(intro)) {
    if (typeof description !== 'string' || !/\{name\} (disappeared|was )/.test(description)) continue
    const matchingFate = Object.keys(fateArtwork).find(fate => description.includes(fate))
    assert.ok(matchingFate, key)
    assert.equal(art(`${name}.intro.${key}`), fateArtwork[matchingFate], key)
    found += 1
  }
  assert.equal(found, 22)
})

test('art selects a valid story without revealing failed investigations', () => {
  const gavriella = entry('atDeathsDoorstep.interlude1.gavriella')
  const valentino = entry('atDeathsDoorstep.interlude1.valentino')
  const invalid = { tag: 'ModifyEntry', modifiers: ['GreenEntry', 'InvalidEntry'], entry: gavriella }
  const valid = { tag: 'ModifyEntry', modifiers: ['GreenEntry', 'ValidEntry'], entry: valentino }
  assert.equal(circleUndoneStoryArtFor('05', [invalid]), undefined)
  assert.equal(circleUndoneStoryArtFor('54', [invalid, valid]), 'doorstep-valentino-ball')
  assert.equal(circleUndoneStoryArtFor('04', [valid]), undefined)
  assert.equal(circleUndoneStoryArtFor('05', [valid]), 'doorstep-valentino-ball')
})

test('the prologue, campaign interludes and epilogues cover the campaign narrative', () => {
  const base = readLocale('en', 'base.json')
  assert.ok(art('prologue.body'))
  for (const section of ['interlude2', 'interlude3', 'interlude4', 'epilogue']) {
    for (const [key, value] of Object.entries(base[section])) {
      if (typeof value !== 'string') continue
      const path = `${section}.${key}`
      if (/^(thePriceOfProgress|theInnerCircle|twistOfFate)\d+$|^youAreBeingHunted$/.test(key)
        || (section === 'epilogue' && /^_Read the following/.test(value))) {
        assert.ok(art(path), path)
      }
    }
  }
})

test('changed actions select different art, and the two versions share Anette’s possession scene', () => {
  assert.equal(
    art('unionAndDisillusion.resolutions.resolution4.body', '05'),
    art('unionAndDisillusion.resolutions.returnToResolution4.body', '54'),
  )
  const distinct = [
    ['theWitchingHour.intro.intro2', 'theWitchingHour.intro.intro3'],
    ['interlude2.thePriceOfProgress7', 'interlude2.thePriceOfProgress8'],
    ['forTheGreaterGood.resolutions.resolution1.body', 'forTheGreaterGood.resolutions.resolution2.body'],
    ['unionAndDisillusion.resolutions.resolution3.body', 'unionAndDisillusion.resolutions.resolution10.body'],
    ['beforeTheBlackThrone.resolutions.resolution2.body', 'beforeTheBlackThrone.resolutions.resolution6.body'],
  ]
  for (const [first, second] of distinct) {
    assert.ok(art(first) && art(second))
    assert.notEqual(art(first), art(second), `${first} and ${second}`)
  }
})

test('each mapped passage exists in English and Vietnamese', () => {
  for (const language of ['en', 'vi']) {
    const story = readLocale(language, 'base.json')
    for (const file of scenarios) story[file.slice(0, -5)] = readLocale(language, `scenarios/${file}`)
    for (const passage of Object.keys(circleUndoneStoryArtByPassage)) {
      const value = passage.split('.').reduce((parent, key) => parent?.[key], story)
      assert.equal(typeof value, 'string', `${language} ${passage}`)
    }
  }
})

test('all mapped illustrations have a WebP file', () => {
  const assets = new URL('../src/assets/circle-undone-story/', import.meta.url)
  const names = [...new Set(Object.values(circleUndoneStoryArtByPassage))].map(name => name + '.webp').sort()
  assert.deepEqual(readdirSync(assets).sort(), names)
  for (const name of names) {
    const bytes = readFileSync(new URL(name, assets))
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF', name)
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP', name)
  }
})
