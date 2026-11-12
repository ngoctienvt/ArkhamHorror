import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

// referenceTokenX.ts is import-free on purpose so it can be loaded here without the Vue toolchain.
const source = readFileSync(new URL('../src/arkham/referenceTokenX.ts', import.meta.url), 'utf8')
const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
const { referenceX, referenceXDetail, parseXDefinition, xDefinitionIn, tokenBadge, autoFailsNow } = await import(
  'data:text/javascript;base64,' + Buffer.from(js).toString('base64')
)

const thing = (extra = {}) => ({ traits: [], doom: 0, clues: 0, ...extra })
const ctx = (extra = {}) => ({
  enemies: [], locations: [], agendas: [], assets: [], treacheries: [], victoryDisplay: [],
  doomInPlay: 0, agendaNumber: 1, actNumber: 1, you: { horror: 0, damage: 0, hand: 0, clues: 0, keys: 0 },
  investigatorKeys: 0, explorationDeck: null, counters: {}, ...extra,
})

test('The Untamed Wilds: vengeance, locations (max 5) and exploration deck (max 5)', () => {
  const c = ctx({
    victoryDisplay: [thing({ vengeance: 1 }), thing({ vengeance: 0 }), thing({ vengeance: 2 })],
    locations: Array.from({ length: 7 }, () => thing()),
    explorationDeck: 3,
  })
  assert.equal(referenceX('-X. X is the number of vengeance points in the victory display.', c), 3)
  assert.equal(referenceX('-X. X is the number of locations in play (max 5).', c), 5)
  assert.equal(referenceX('-X. X is the number of cards in the exploration deck (max 5).', c), 3)
  assert.equal(referenceX('-X. X is 1 higher than the number of vengeance points in the victory display.', c), 4)
})

test('wrappers: twice, half rounded up and down, plus, minimum', () => {
  const c = ctx({ doomInPlay: 5, agendaNumber: 2, actNumber: 3 })
  assert.equal(parseXDefinition('twice the current act number')(c), 6)
  assert.equal(parseXDefinition('half the number of doom in play (rounded up)')(c), 3)
  assert.equal(parseXDefinition('half the number of doom in play, rounded down')(c), 2)
  assert.equal(parseXDefinition('the number of the current act plus the number of the current agenda')(c), 5)
  assert.equal(parseXDefinition('2 plus the current agenda number')(c), 4)
  assert.equal(parseXDefinition('the amount of doom in play (max 3)')(c), 3)
})

test('traits, your location and the victory display', () => {
  const c = ctx({
    enemies: [thing({ traits: ['Cultist'], doom: 2, yours: true }), thing({ traits: ['Monster'], doom: 1 }), thing({ traits: ['Cultist'], doom: 3 })],
    locations: [thing({ yours: true, shroud: 4, printedShroud: 2 })],
    victoryDisplay: [thing({ name: 'Unfinished Business', type: 'StoryType' }), thing({ traits: ['Cultist'], type: 'EnemyType' })],
  })
  assert.equal(referenceX('-X. X is the number of [[Cultist]] enemies in play.', c), 2)
  assert.equal(referenceX('-X. X is the number of [[Cultist]] enemies at your location.', c), 1)
  assert.equal(referenceX('-X. X is the highest number of doom on a [[Cultist]] enemy in play.', c), 3)
  assert.equal(referenceX('-X. X is the shroud value of your location.', c), 4)
  assert.equal(referenceX('-X. X is the base shroud value of your location.', c), 2)
  assert.equal(referenceX('-X. X is the number of copies of Unfinished Business in the victory display.', c), 1)
  assert.equal(referenceX('-X. X is 1 plus the number of story cards in the victory display.', c), 2)
  assert.equal(referenceX('-X. X is the number of [[Cultist]] enemies in the victory display, to a maximum of 3.', c), 1)
})

test('scenario counters are found by name', () => {
  const c = ctx({ counters: { stormintensity: 4, depth: 2 } })
  assert.equal(referenceX('-X. X is the current Storm Intensity.', c), 4)
  assert.equal(referenceX('-X. X is 1 more than the current depth level.', c), 3)
})

test('an unreadable sentence, or a line with no X, gives null', () => {
  const c = ctx()
  assert.equal(referenceX('-X. X is the number of memories Agnes Baker has collected.', c), null)
  assert.equal(referenceX('-2. If you fail, take 1 horror.', c), null)
  assert.equal(xDefinitionIn('-2.'), null)
})

test('most X sentences on the reference cards are read', () => {
  const cards = JSON.parse(readFileSync(new URL('../public/cards.json', import.meta.url), 'utf8'))
  const list = Array.isArray(cards) ? cards : Object.values(cards)
  let total = 0
  let read = 0
  for (const card of list) {
    for (const key of ['text', 'back_text']) {
      const text = card[key] ?? ''
      if (!/^(Easy|Hard|Expert|Standard)/.test(text)) continue
      for (const line of text.split('\n')) {
        const definition = xDefinitionIn(line.replace(/\[\[([^\]]+)\]\]/g, '[[$1]]'))
        if (!definition) continue
        total += 1
        if (parseXDefinition(definition)) read += 1
      }
    }
  }
  assert.ok(total > 100, `expected many X sentences, found ${total}`)
  assert.ok(read / total >= 0.6, `only ${read}/${total} X sentences are read`)
})

test('a capped X reports the count before the cap', () => {
  const c = ctx({ locations: Array.from({ length: 7 }, () => thing()) })
  assert.deepEqual(referenceXDetail('-X. X is the number of locations in play (max 5).', c), { value: 5, raw: 7 })
  assert.deepEqual(referenceXDetail('-X. X is the number of locations in play.', c), { value: 7, raw: 7 })
})

test('the badge carries the current modifier and how hard it hits', () => {
  assert.deepEqual(tokenBadge('-X', { value: 0, raw: 0 }, false), { modifier: 0, tier: 'zero' })
  assert.deepEqual(tokenBadge('-X', { value: 2, raw: 2 }, false), { modifier: -2, tier: 'mild' })
  assert.deepEqual(tokenBadge('-X', { value: 5, raw: 7 }, false), { modifier: -5, tier: 'bad' })
  assert.deepEqual(tokenBadge('-2', null, false), { modifier: -2, tier: 'mild' })
  assert.deepEqual(tokenBadge('+1', null, false), { modifier: 1, tier: 'good' })
  assert.deepEqual(tokenBadge('-X', null, false), { modifier: null, tier: 'unknown' })
  assert.deepEqual(tokenBadge('-2', null, true), { modifier: null, tier: 'fail' })
})

test('the poison line fails the test only while you are poisoned', () => {
  const line = '-2. If you are poisoned, this test automatically fails instead.'
  assert.equal(autoFailsNow(line, ctx()), false)
  assert.equal(autoFailsNow(line, ctx({ you: { horror: 0, damage: 0, hand: 0, clues: 0, keys: 0, poisoned: true } })), true)
  assert.equal(autoFailsNow('-2. Take 1 horror.', ctx({ you: { horror: 0, damage: 0, hand: 0, clues: 0, keys: 0, poisoned: true } })), false)
})
