import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

const transpile = name => ts.transpile(
  readFileSync(new URL(`../src/arkham/${name}.ts`, import.meta.url), 'utf8'),
  { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
)
const moduleUrl = source => 'data:text/javascript;base64,' + Buffer.from(source).toString('base64')
const { innsmouthStoryArtFor, innsmouthStoryArtByPassage } = await import(moduleUrl(
  transpile('innsmouthStoryArt').replace('./narration', moduleUrl(transpile('narration'))),
))

const localeRoot = new URL('../src/locales/en/theInnsmouthConspiracy/', import.meta.url)
const readLocale = file => JSON.parse(readFileSync(new URL(file, localeRoot), 'utf8'))
const i18n = passage => ({ tag: 'I18nEntry', key: 'theInnsmouthConspiracy.' + passage, variables: {} })

test('Innsmouth campaign selects story art through flavor wrappers', () => {
  const entries = [
    i18n('intoTheMaelstrom.resolutions.xp.bonus'),
    { tag: 'ModifyEntry', modifiers: ['ResolutionEntry'], entry: i18n('intoTheMaelstrom.resolutions.resolution4.body') },
  ]
  assert.equal(innsmouthStoryArtFor('07', entries), 'maelstrom-flare-victory')
  assert.equal(innsmouthStoryArtFor('03', entries), undefined)
  assert.equal(innsmouthStoryArtFor(undefined, entries), undefined)
  assert.equal(innsmouthStoryArtFor('07', [i18n('intoTheMaelstrom.resolutions.xp.bonus')]), undefined)
})

test('shared moments reuse illustrations and divergent outcomes stay distinct', () => {
  const art = passage => innsmouthStoryArtFor('07', [i18n(passage)])
  assert.equal(art('thePitOfDespair.resolutions.noResolution.body'), art('thePitOfDespair.resolutions.resolution1.body'))
  assert.equal(art('aLightInTheFog.resolutions.resolution2.body'), art('aLightInTheFog.resolutions.resolution4.body'))
  assert.equal(art('theLairOfDagon.intro2.body'), art('theLairOfDagon.intro3.body'))
  assert.equal(art('theLairOfDagon.resolutions.resolution3.body'), art('theLairOfDagon.resolutions.resolution4.body'))

  const distinctPairs = [
    ['devilReef.intro2.body', 'devilReef.intro3.body'],
    ['theLairOfDagon.intro4.body', 'theLairOfDagon.intro5.body'],
    ['theLairOfDagon.resolutions.resolution2.body', 'theLairOfDagon.resolutions.resolution3.body'],
    ['aLightInTheFog.resolutions.resolution1.body', 'aLightInTheFog.resolutions.resolution2.body'],
    ['aLightInTheFog.resolutions.resolution2.body', 'aLightInTheFog.resolutions.resolution3.body'],
    ['intoTheMaelstrom.resolutions.resolution2.body', 'intoTheMaelstrom.resolutions.resolution3.body'],
    ['intoTheMaelstrom.resolutions.resolution4.body', 'intoTheMaelstrom.resolutions.resolution5.body'],
    ['intoTheMaelstrom.resolutions.resolution6.body', 'intoTheMaelstrom.resolutions.resolution7.body'],
    ['intoTheMaelstrom.resolutions.noResolution.body', 'intoTheMaelstrom.resolutions.resolution8.body'],
    ['epilogue.epilogue2.body', 'epilogue.flashback15.body'],
  ]
  for (const [first, second] of distinctPairs) {
    const firstArt = art(first)
    const secondArt = art(second)
    assert.ok(firstArt && secondArt)
    assert.notEqual(firstArt, secondArt, `${first} and ${second}`)
  }
})

test('all scenario narrative intros and resolution bodies are illustrated', () => {
  const scenarioFolder = new URL('scenarios/', localeRoot)
  for (const file of readdirSync(scenarioFolder).filter(file => file.endsWith('.json'))) {
    const scenario = file.slice(0, -5)
    const data = readLocale(`scenarios/${file}`)
    for (const [key, entry] of Object.entries(data)) {
      if (!/^(intro\d*|townInfo)$/.test(key)) continue
      const passage = `${scenario}.${key}${typeof entry === 'object' ? '.body' : ''}`
      assert.ok(innsmouthStoryArtByPassage[passage], passage)
    }
    for (const [key, entry] of Object.entries(data.resolutions ?? {})) {
      if (!entry.body) continue
      const passage = `${scenario}.resolutions.${key}.body`
      assert.ok(innsmouthStoryArtByPassage[passage], passage)
    }
  }
})

test('each mapped passage exists in English and Vietnamese locales and has a bundled WebP image', () => {
  const loadCampaign = lang => {
    const root = new URL(`../src/locales/${lang}/theInnsmouthConspiracy/`, import.meta.url)
    const story = JSON.parse(readFileSync(new URL('base.json', root), 'utf8'))
    for (const file of readdirSync(new URL('scenarios/', root))) {
      if (file.endsWith('.json')) {
        story[file.slice(0, -5)] = JSON.parse(readFileSync(new URL(`scenarios/${file}`, root), 'utf8'))
      }
    }
    return story
  }
  const enStory = loadCampaign('en')
  const viStory = loadCampaign('vi')

  for (const [passage, asset] of Object.entries(innsmouthStoryArtByPassage)) {
    const enEntry = passage.split('.').reduce((value, key) => value?.[key], enStory)
    const viEntry = passage.split('.').reduce((value, key) => value?.[key], viStory)
    assert.equal(typeof enEntry, 'string', `en:${passage}`)
    assert.equal(typeof viEntry, 'string', `vi:${passage}`)
    const path = `innsmouth-story/${asset}.webp`
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
