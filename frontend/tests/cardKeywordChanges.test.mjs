import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

// cardKeywordChanges.ts is import-free on purpose so it can be loaded here without the Vue toolchain.
const source = readFileSync(new URL('../src/arkham/cardKeywordChanges.ts', import.meta.url), 'utf8')
const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
const { keywordChanges, joinKeywords, splitKeywords, strikeLostKeywords } =
  await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))

const mod = (tag, contents) => ({ type: { tag, contents } })

test('test_keyword_changes_splits_gained_and_lost', () => {
  const r = keywordChanges([mod('AddKeyword', 'Hunter'), mod('RemoveKeyword', 'Aloof'), mod('HealthModifier', 1)])
  assert.deepEqual(r, { gained: ['Hunter'], lost: ['Aloof'] })
})

test('test_keyword_changes_dedupes_and_removal_wins', () => {
  const r = keywordChanges([mod('AddKeyword', 'Hunter'), mod('AddKeyword', 'Hunter'), mod('AddKeyword', 'Aloof'), mod('RemoveKeyword', 'Aloof')])
  assert.deepEqual(r, { gained: ['Hunter'], lost: ['Aloof'] })
})

test('test_keyword_changes_handles_missing_modifiers', () => {
  assert.deepEqual(keywordChanges(undefined), { gained: [], lost: [] })
})

test('test_join_and_split_round_trip', () => {
  assert.equal(joinKeywords([]), undefined)
  assert.deepEqual(splitKeywords(joinKeywords(['Retaliate', 'Hunter'])), ['Retaliate', 'Hunter'])
  assert.deepEqual(splitKeywords(null), [])
})

test('test_strike_marks_printed_keyword_only_in_text', () => {
  const html = '<b>Aloof.</b> Hunter. Forced - When the Aloof enemy...'
  const r = strikeLostKeywords(html, ['Aloof'])
  assert.equal(r.html, '<b><span class="keyword-lost">Aloof</span>.</b> Hunter. Forced - When the Aloof enemy...')
  assert.deepEqual(r.unmatched, [])
})

test('test_strike_ignores_tag_attributes_and_partial_words', () => {
  const html = '<span class="Hunter">Hunters gather.</span>'
  const r = strikeLostKeywords(html, ['Hunter'])
  assert.equal(r.html, html)
  assert.deepEqual(r.unmatched, ['Hunter'])
})
