import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import test from 'node:test'
import { createServer } from 'vite'

test('barrier counts are read from scenario meta whichever way a link is named', async (t) => {
  const server = await createServer({ root: resolve('.'), server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' })
  t.after(() => server.close())
  const { barrierKey, barrierCounts, barriersBetween, blockedLinks } = await server.ssrLoadModule('/src/arkham/scenarioBarriers.ts')

  assert.equal(barrierKey('b-id', 'a-id'), 'a-id--b-id')
  assert.equal(barrierKey('a-id', 'b-id'), 'a-id--b-id')

  assert.equal(barrierCounts(null), null)
  assert.equal(barrierCounts({}), null)
  assert.equal(barrierCounts({ barriers: 3 }), null)

  const counts = barrierCounts({ barriers: { 'a-id--b-id': 2, 'b-id--c-id': 0, 'bad': 1 } })
  assert.equal(barriersBetween(counts, 'b-id', 'a-id'), 2)
  assert.equal(barriersBetween(counts, 'c-id', 'b-id'), 0)
  assert.equal(barriersBetween(counts, 'a-id', 'z-id'), 0)
  assert.equal(barriersBetween(null, 'a-id', 'b-id'), 0)

  assert.deepEqual(blockedLinks(counts), [{ a: 'a-id', b: 'b-id', key: 'a-id--b-id', count: 2 }])
  assert.deepEqual(blockedLinks(null), [])
})
