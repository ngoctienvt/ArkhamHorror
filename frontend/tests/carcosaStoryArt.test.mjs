import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

const transpile = name => ts.transpile(
  readFileSync(new URL(`../src/arkham/${name}.ts`, import.meta.url), 'utf8'),
  { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
)
const moduleUrl = source => 'data:text/javascript;base64,' + Buffer.from(source).toString('base64')
const { carcosaStoryArtFor, carcosaStoryArtByPassage } = await import(moduleUrl(
  transpile('carcosaStoryArt').replace('./narration', moduleUrl(transpile('narration'))),
))

const localeRoot = new URL('../src/locales/en/thePathToCarcosa/', import.meta.url)
const readLocale = file => JSON.parse(readFileSync(new URL(file, localeRoot), 'utf8'))
const i18n = passage => ({ tag: 'I18nEntry', key: 'thePathToCarcosa.' + passage, variables: {} })

test('base and Return to Carcosa select the same art by story key through flavor wrappers', () => {
  const entries = [
    i18n('dimCarcosa.resolutions.xp'),
    { tag: 'ModifyEntry', modifiers: ['ResolutionEntry'], entry: i18n('dimCarcosa.resolutions.resolution2.body') },
  ]
  assert.equal(carcosaStoryArtFor('03', entries), 'dim-stranger-bow')
  assert.equal(carcosaStoryArtFor('52', entries), 'dim-stranger-bow')
  assert.equal(carcosaStoryArtFor('01', entries), undefined)
  assert.equal(carcosaStoryArtFor(undefined, entries), undefined)
  assert.equal(carcosaStoryArtFor('52', [i18n('dimCarcosa.resolutions.xp')]), undefined)
})

test('art only changes when the depicted scene changes', () => {
  const art = passage => carcosaStoryArtFor('52', [i18n(passage)])
  assert.equal(art('blackStarsRise.resolutions.resolution1.body'), art('dimCarcosa.intro.intro1'))
  assert.equal(art('blackStarsRise.resolutions.resolution3.body'), art('dimCarcosa.resolutions.resolution4.body'))
  assert.notEqual(art('dimCarcosa.resolutions.resolution3.body'), art('dimCarcosa.resolutions.resolution4.body'))
  assert.notEqual(art('curtainCall.intro.body'), art('prologue.body'))
})

test('different actions in recurring settings select their own illustrations', () => {
  const pairs = [
    ['theLastKing.resolutions.resolution1.body', 'interlude1.lunacysReward2'],
    ['echoesOfThePast.resolutions.resolution1.body', 'echoesOfThePast.resolutions.resolution2.body'],
    ['theUnspeakableOath.resolutions.defeated.body', 'theUnspeakableOath.resolutions.resolution1.body'],
    ['interlude1.lunacysReward1', 'aPhantomOfTruth.intro.dream3'],
    ['aPhantomOfTruth.intro.dream5', 'aPhantomOfTruth.intro.dream8.body'],
    ['curtainCall.resolutions.resolution1.body', 'aPhantomOfTruth.intro.dream7'],
    ['aPhantomOfTruth.intro.dream10', 'aPhantomOfTruth.intro.dream11'],
    ['aPhantomOfTruth.intro.dream11', 'aPhantomOfTruth.intro.dream12'],
    ['aPhantomOfTruth.resolutions.resolution1.body', 'aPhantomOfTruth.resolutions.resolution2.body'],
    ['aPhantomOfTruth.resolutions.resolution2.body', 'thePallidMask.intro.intro2'],
  ]
  for (const [first, second] of pairs) {
    const firstArt = carcosaStoryArtFor('03', [i18n(first)])
    const secondArt = carcosaStoryArtFor('03', [i18n(second)])
    assert.ok(firstArt && secondArt)
    assert.notEqual(firstArt, secondArt, `${first} and ${second}`)
    assert.equal(carcosaStoryArtFor('52', [i18n(second)]), secondArt)
  }
})

test('Curtain Call reuses the Stranger encounter when both endings reach that event', () => {
  for (const campaign of ['03', '52']) {
    const art = passage => carcosaStoryArtFor(campaign, [i18n(`curtainCall.resolutions.${passage}.body`)])
    assert.equal(art('noResolution'), 'curtain-call-stranger')
    assert.equal(art('resolution2'), 'curtain-call-stranger')
    assert.equal(art('resolution1'), 'curtain-call-police')
  }
})

const routingPassages = [
  'theLastKing.resolutions.goToR1',
  'theLastKing.resolutions.goToR2',
  'theUnspeakableOath.intro.foundTheWayForward',
  'theUnspeakableOath.intro.didNotFindTheWayForward',
  'aPhantomOfTruth.intro.readIntro1',
  'aPhantomOfTruth.intro.readIntro2',
  'thePallidMask.intro.readIntro1',
  'thePallidMask.intro.readIntro2',
  'blackStarsRise.resolutions.noResolution.body',
  'dimCarcosa.intro.readIntro1',
  'dimCarcosa.intro.readIntro2',
  'dimCarcosa.resolutions.noResolution.body',
]

test('routing instructions do not preview an outcome or displace narrative art', () => {
  for (const passage of routingPassages) {
    assert.equal(carcosaStoryArtFor('52', [i18n(passage)]), undefined, passage)
  }
  assert.equal(carcosaStoryArtFor('52', [
    i18n('dimCarcosa.intro.readIntro1'),
    i18n('dimCarcosa.intro.intro1'),
  ]), 'carcosa-below')
})

test('all scenario narrative intros and resolution bodies are illustrated', () => {
  const scenarioFolder = new URL('scenarios/', localeRoot)
  for (const file of readdirSync(scenarioFolder).filter(file => file.endsWith('.json'))) {
    const scenario = file.slice(0, -5)
    const { intro, resolutions } = readLocale(`scenarios/${file}`)
    for (const [key, entry] of Object.entries(intro)) {
      if (!/^(body|intro\d+|readIntro\d+|dream\d+|awakening|[a-z]+sInformation|(found|didNotFind)TheWayForward)$/.test(key)) continue
      const passage = `${scenario}.intro.${key}${typeof entry === 'object' ? '.body' : ''}`
      if (routingPassages.includes(passage)) continue
      assert.ok(carcosaStoryArtByPassage[passage], passage)
    }
    for (const [key, entry] of Object.entries(resolutions)) {
      if (!entry.body) continue
      const passage = `${scenario}.resolutions.${key}.body`
      if (routingPassages.includes(passage)) continue
      assert.ok(carcosaStoryArtByPassage[passage], passage)
    }
  }
})

test('each mapped passage exists and has a bundled image', () => {
  const story = readLocale('base.json')
  for (const file of readdirSync(new URL('scenarios/', localeRoot))) {
    if (file.endsWith('.json')) story[file.slice(0, -5)] = readLocale(`scenarios/${file}`)
  }
  for (const [passage, asset] of Object.entries(carcosaStoryArtByPassage)) {
    const entry = passage.split('.').reduce((value, key) => value?.[key], story)
    assert.equal(typeof entry, 'string', passage)
    const path = asset === 'campaign-prologue'
      ? 'return-to-carcosa-prologue.webp'
      : `carcosa-story/${asset}.webp`
    assert.ok(existsSync(new URL(`../src/assets/${path}`, import.meta.url)), path)
  }
})

test('the in-game read modal renders the illustration inside its text panel', () => {
  const component = name => readFileSync(new URL(`../src/arkham/components/${name}.vue`, import.meta.url), 'utf8')
  assert.match(component('ChoiceModal'), /<Question v-if="question"/)
  const modalRead = component('Question').split('&& !suppressReadInSkillTest">')[1]
    .split('<div class="question-label dropdown"')[0]
  assert.match(modalRead, /<div v-else class="intro-text-body">\s*<StoryIllustration[\s\S]*?:entries="question\.flavorText\.body"[\s\S]*?<FormattedEntry/)
})
