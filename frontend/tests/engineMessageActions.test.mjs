import assert from 'node:assert/strict'
import test from 'node:test'
import { fileURLToPath, URL } from 'node:url'

import { createServer } from 'vite'

/* Unlabelled prompts are explained by reading the engine messages each answer carries. Those messages
are undecoded backend JSON (Aeson `defaultOptions`: `{tag, contents}` with positional fields as an
array, nested sub-message wrappers), so nothing type-checks the argument positions. These tests pin
them for the common actions, using the shapes the backend `Message` constructors encode to. */
async function load(t, path) {
  const server = await createServer({
    root: fileURLToPath(new URL('..', import.meta.url)),
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true, hmr: false },
  })
  t.after(() => server.close())
  return server.ssrLoadModule(path)
}

const abilitySource = (id) => ({ tag: 'AbilitySource', contents: [{ tag: 'EnemySource', contents: id }, 1] })

test('a forced enemy move names the mover and the card that asked', async (t) => {
  const { firstEngineAction } = await load(t, '/src/arkham/engine-message-actions.ts')
  const move = {
    tag: 'Move',
    contents: { moveSource: abilitySource('dianne'), moveTarget: { tag: 'EnemyTarget', contents: 'dianne' }, moveDestination: { tag: 'ToLocation', contents: 'loc-1' } },
  }
  const action = firstEngineAction([move])
  assert.equal(action.key, 'move')
  assert.equal(action.subjectId, 'dianne')
  assert.equal(action.sourceId, 'dianne')
})

test('placing doom through the token sub-message reads amount, token and target', async (t) => {
  const { firstEngineAction } = await load(t, '/src/arkham/engine-message-actions.ts')
  const place = {
    tag: 'TokenMessage',
    contents: { tag: 'PlaceTokens_', contents: [abilitySource('agenda-1'), { tag: 'EnemyTarget', contents: 'ghoul' }, 'Doom', 1] },
  }
  const action = firstEngineAction([place])
  assert.deepEqual(
    { key: action.key, subjectId: action.subjectId, sourceId: action.sourceId, token: action.token, n: action.n },
    { key: 'placeTokens', subjectId: 'ghoul', sourceId: 'agenda-1', token: 'Doom', n: 1 },
  )
})

test('investigator damage reads damage and horror separately', async (t) => {
  const { firstEngineAction } = await load(t, '/src/arkham/engine-message-actions.ts')
  const assign = {
    tag: 'InvestigatorMessage',
    contents: { tag: 'InvestigatorAssignDamage_', contents: ['roland', abilitySource('ghoul'), { tag: 'DamageAny' }, 1, 2] },
  }
  const action = firstEngineAction([assign])
  assert.equal(action.key, 'takeDamage')
  assert.equal(action.subjectId, 'roland')
  assert.equal(action.n, 1)
  assert.equal(action.horror, 2)
})

test('a reaction window offering a hand card reads as playing that card, inside an enemy-attack window', async (t) => {
  const { firstEngineAction, firstWindow } = await load(t, '/src/arkham/engine-message-actions.ts')
  // Shape captured from a live game: Dodge offered while an enemy attacks Roland.
  const window = {
    windowTiming: 'When',
    windowType: {
      tag: 'EnemyAttacks',
      contents: {
        attackTarget: { tag: 'SingleAttackTarget', contents: { tag: 'InvestigatorTarget', contents: 'c01001' } },
        attackEnemy: 'enemy-1',
        attackSource: { tag: 'EnemySource', contents: 'enemy-1' },
      },
    },
  }
  const play = {
    tag: 'InitiatePlayCardWithWindows',
    contents: ['c01001', { tag: 'PlayerCard', contents: { cardCode: 'c01023', id: 'dodge-1' } }, null, { tag: 'NoPayment' }, [window], true],
  }
  const action = firstEngineAction([play])
  assert.equal(action.key, 'playCard')
  assert.equal(action.subjectId, 'dodge-1')
  assert.deepEqual(firstWindow([play]), { type: 'EnemyAttacks', timing: 'When', enemyId: 'enemy-1', targetId: 'c01001' })
})

test('bookkeeping messages before the action are skipped; unknown messages yield null', async (t) => {
  const { firstEngineAction } = await load(t, '/src/arkham/engine-message-actions.ts')
  const discard = { tag: 'Discard', contents: [null, abilitySource('x'), { tag: 'AssetTarget', contents: 'guard-dog' }] }
  assert.equal(firstEngineAction([{ tag: 'CheckWindows', contents: [] }, discard]).subjectId, 'guard-dog')
  assert.equal(firstEngineAction([{ tag: 'SomethingNew', contents: [] }]), null)
})

test('every answer button keeps its engine messages after decoding, not only TargetLabel', async (t) => {
  const { messageDecoder } = await load(t, '/src/arkham/types/Message.ts')
  const raw = { tag: 'Label', label: 'Yes', messages: [{ tag: 'Discard', contents: [] }] }
  const result = await messageDecoder.decodeToPromise(raw)
  assert.equal(result.label, 'Yes')
  assert.deepEqual(result.messages, raw.messages)
})
