import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

const source = readFileSync(new URL('../src/arkham/chaosRevealLog.ts', import.meta.url), 'utf8')
const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
const { revealsAfter, lastSeq } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))

const draw = (seq, faces, extra = {}) => ({
  seq,
  body: [{
    tag: 'LogI18n',
    contents: ['log.drawsChaosTokens', {
      investigator: { tag: 'LogRefPart', contents: { name: 'Kate Winthrop' } },
      tokens: { tag: 'LogList', contents: faces.map((face) => ({ tag: 'LogToken', contents: face })) },
    }],
  }],
  children: [],
  group: null,
  ...extra,
})

test('reads who revealed which tokens', () => {
  assert.deepEqual(revealsAfter([draw(5, ['Skull'])], 0), [{ seq: 5, investigator: 'Kate Winthrop', faces: ['Skull'] }])
})

test('ignores reveals already seen', () => {
  assert.deepEqual(revealsAfter([draw(5, ['Skull'])], 5), [])
})

test('finds a reveal nested under another entry', () => {
  const parent = { seq: 4, body: [], children: [draw(6, ['MinusTwo'])], group: null }
  assert.equal(revealsAfter([parent], 0)[0].faces[0], 'MinusTwo')
})

test('leaves skill test reveals to the skill test panel', () => {
  assert.deepEqual(revealsAfter([draw(7, ['Skull'], { group: { id: 'skillTest:abc' } })], 0), [])
})

test('lastSeq is the newest top-level entry', () => {
  assert.equal(lastSeq([draw(3, ['Skull']), draw(9, ['Skull'])]), 9)
  assert.equal(lastSeq([]), 0)
})
