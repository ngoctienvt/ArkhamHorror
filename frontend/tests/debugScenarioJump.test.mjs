import assert from 'node:assert/strict'
import test from 'node:test'
import { fileURLToPath, URL } from 'node:url'

import { createServer } from 'vite'

/* The debug scenario jump sends a raw engine message, so nothing type-checks its
shape against the Haskell constructors. These tests pin the message and the
jump list (including Return To campaigns, whose scenarios are the base
campaign's returnTo codes) against the real scenario data. */
async function load(t) {
  const server = await createServer({
    root: fileURLToPath(new URL('..', import.meta.url)),
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true, hmr: false },
  })
  t.after(() => server.close())
  const jump = await server.ssrLoadModule('/src/arkham/debugScenarioJump.ts')
  const scenarios = (await server.ssrLoadModule('/src/arkham/data/scenarios.ts')).default
  const campaigns = (await server.ssrLoadModule('/src/arkham/data/campaigns.json')).default
  return { ...jump, scenarios, campaigns }
}

test('the jump message ends the scenario with an override step after clearing the UI', async (t) => {
  const { scenarioJumpMessage } = await load(t)
  assert.deepEqual(scenarioJumpMessage('01120'), {
    tag: 'Run',
    contents: [
      { tag: 'ClearUI' },
      { tag: 'EndOfScenario', contents: { tag: 'ScenarioStep', contents: 'c01120' } },
    ],
  })
  // An already prefixed id is not prefixed twice.
  assert.equal(scenarioJumpMessage('c01120').contents[1].contents.contents, 'c01120')
})

test('Night of the Zealot lists its three scenarios in order', async (t) => {
  const { scenarioJumpTargets, scenarios, campaigns } = await load(t)
  const codes = scenarioJumpTargets('01', scenarios, campaigns).map((s) => s.code)
  assert.deepEqual(codes, ['01104', '01120', '01142'])
})

test('a Return To campaign lists the Return To scenario codes', async (t) => {
  const { scenarioJumpTargets, scenarios, campaigns } = await load(t)
  const list = scenarioJumpTargets('50', scenarios, campaigns)
  assert.deepEqual(list.map((s) => s.code), ['50011', '50025', '50032'])
  assert.equal(list[0].name, 'Return to the Gathering')
})

test('an unknown campaign has no entries', async (t) => {
  const { scenarioJumpTargets, scenarios, campaigns } = await load(t)
  assert.deepEqual(scenarioJumpTargets('zz', scenarios, campaigns), [])
})
