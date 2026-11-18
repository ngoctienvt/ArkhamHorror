import assert from 'node:assert/strict'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import { createServer } from 'vite'

test('a board story read spotlights its story face and flips from its asset face', async (t) => {
  const server = await createServer({
    root: fileURLToPath(new URL('..', import.meta.url)),
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true, hmr: false },
  })
  t.after(() => server.close())
  const { storyCardRead, storyCardIllustration } = await server.ssrLoadModule('/src/arkham/storyCardRead.ts')
  const choice = {
    tag: 'TargetLabel',
    target: { tag: 'StoryTarget', contents: 'story' },
    messages: [{ tag: 'StoryMessage', contents: { tag: 'ResolveStory' } }],
  }
  const game = {
    question: { player: { tag: 'ChooseOne', choices: [choice] } },
    focusedCards: [],
    stories: {
      story: {
        id: 'story', cardId: 'card', art: '01120b', flippedArt: '01120',
        flipped: false, tokens: {}, otherSide: { tag: 'AssetTarget', contents: 'asset' },
      },
    },
  }
  const read = storyCardRead(game, 'player')
  assert.equal(read.card.contents.art, '01120b')
  assert.equal(read.card.contents.id, 'card')
  assert.equal(read.flip, true)
  assert.equal(read.index, 0)
  assert.equal(read.backArt, '01120')

  game.stories.story.flipped = true
  const reversed = storyCardRead(game, 'player')
  assert.equal(reversed.card.contents.art, '01120')
  assert.equal(reversed.backArt, '01120b')

  choice.messages = []
  assert.equal(storyCardRead(game, 'player'), null)

  for (let id = 8575; id <= 8583; id++) {
    const front = `0${id}`
    const back = `${front}b`
    const artwork = storyCardIllustration(back)
    assert.ok(artwork, back)
    assert.equal(storyCardIllustration(front), undefined)
    assert.equal(storyCardIllustration(`c${back}`), artwork)
    const file = new URL(`../src/assets/edge-of-the-earth-story/${artwork}.webp`, import.meta.url)
    assert.equal(readFileSync(file).toString('ascii', 8, 12), 'WEBP')
  }
  assert.equal(storyCardIllustration('08559b'), undefined)
})
