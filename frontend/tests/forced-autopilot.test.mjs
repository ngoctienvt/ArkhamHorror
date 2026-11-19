import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRenderer, nextTick, ref } from 'vue'
import ts from 'typescript'

const compile = (path) => ts.transpile(readFileSync(new URL(path, import.meta.url), 'utf8'), {
  target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022,
})
const dataUrl = (js) => 'data:text/javascript;base64,' + Buffer.from(js).toString('base64')
const policyUrl = dataUrl(compile('../src/arkham/autoAnswerPolicy.ts'))
const source = compile('../src/arkham/composables/useAutopilot.ts')
  .replace("from 'vue'", `from '${import.meta.resolve('vue')}'`)
  .replace("from '@/arkham/autoAnswerPolicy'", `from '${policyUrl}'`)
const { useAutopilot } = await import(dataUrl(source))
const forced = { tag: 'AbilityLabel', ability: { type: { tag: 'ForcedAbility' } } }

// Mount the real composable with Vue lifecycle and reactivity; no browser needed.
const renderer = createRenderer({
  createComment: () => ({}), insert() {}, remove() {}, parentNode: () => null,
  nextSibling: () => null,
})
function mount(t, choices, blocked = false) {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const submitted = []
  const options = {
    enabled: ref(false), question: ref({ tag: 'ChooseOne' }), choices: ref(choices),
    step: ref(1), blocked: ref(blocked), hasRevealedCards: ref(false), isCommitWindow: ref(false),
    submit: (index) => submitted.push(index),
  }
  const app = renderer.createApp({ setup() { useAutopilot(options); return () => null } })
  app.mount({})
  t.after(() => app.unmount())
  return { options, submitted }
}

test('Forced activates with autopilot off, once per step', async (t) => {
  const { options, submitted } = mount(t, [forced])
  t.mock.timers.tick(1000)
  assert.deepEqual(submitted, [0])
  options.choices.value = [forced]
  await nextTick()
  t.mock.timers.tick(2000)
  assert.deepEqual(submitted, [0])
  options.step.value++
  await nextTick()
  t.mock.timers.tick(1000)
  assert.deepEqual(submitted, [0, 0])
})

test('Forced waits while a request or overlay blocks answers', async (t) => {
  const { options, submitted } = mount(t, [forced], true)
  t.mock.timers.tick(2000)
  assert.deepEqual(submitted, [])
  options.blocked.value = false
  await nextTick()
  t.mock.timers.tick(1000)
  assert.deepEqual(submitted, [0])
})

test('multiple Forced effects and optional automation still wait with autopilot off', async (t) => {
  const { options, submitted } = mount(t, [forced, forced])
  t.mock.timers.tick(2000)
  assert.deepEqual(submitted, [])
  options.choices.value = [{ tag: 'AbilityLabel', ability: { type: { tag: 'ReactionAbility' } } }]
  await nextTick()
  t.mock.timers.tick(2000)
  assert.deepEqual(submitted, [])
})

test('enabled automation resolves Forced consequences and preserves real decisions', async (t) => {
  const { options, submitted } = mount(t, [forced])
  options.enabled.value = true
  await nextTick()
  t.mock.timers.tick(1000)
  async function advance(choices, question = { tag: 'ChooseOne' }) {
    options.step.value++
    options.choices.value = choices
    options.question.value = question
    await nextTick()
    t.mock.timers.tick(1500)
  }
  await advance([{ tag: 'Label', label: 'Take 1 horror' }, { tag: 'Label', label: 'Discard a card' }])
  assert.deepEqual(submitted, [0])
  // After the player decides, the engine may still ask for an acknowledgement.
  await advance([{ tag: 'Label', label: 'Apply consequence' }])
  assert.deepEqual(submitted, [0, 0])
  await advance([{ tag: 'AbilityLabel', ability: { type: { tag: 'ReactionAbility' } } }, { tag: 'SkipTriggersButton' }])
  assert.deepEqual(submitted, [0, 0])
  await advance([{ tag: 'EndTurnButton' }], { tag: 'ChooseOne', isPlayerWindow: true })
  assert.deepEqual(submitted, [0, 0])
})

test('a completed Forced does not enable unrelated next-round draws with autopilot off', async (t) => {
  const { options, submitted } = mount(t, [forced])
  t.mock.timers.tick(1000)
  options.step.value++
  options.choices.value = [{ tag: 'TargetLabel', target: { tag: 'EncounterDeckTarget' } }]
  await nextTick()
  t.mock.timers.tick(2000)
  assert.deepEqual(submitted, [0])
})
