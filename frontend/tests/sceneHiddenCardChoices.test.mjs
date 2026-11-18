import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

const load = async (file) => {
  const source = readFileSync(new URL(`../src/arkham/${file}`, import.meta.url), 'utf8')
  const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
  return import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))
}
const { sceneHiddenCardChoices } = await load('sceneHiddenCardChoices.ts')
const { sceneFallbackTokens } = await load('sceneTargetFallback.ts')

const pick = (id) => ({ tag: 'TargetLabel', target: { tag: 'CardIdTarget', contents: id } })
const player = (id, cardCode) => ({ tag: 'PlayerCard', contents: { id, cardCode } })
const game = {
  scenario: {
    discard: [{ id: 'sd1', cardCode: '01163' }],
    victoryDisplay: [{ tag: 'EncounterCard', contents: { id: 'vd1', cardCode: '01116' } }],
    setAsideCards: [player('sa1', '01117')],
    deckDiscards: [[{ tag: 'SpecialDeck' }, [player('dd1', '01118')]]],
  },
  removedFromPlay: [],
  locations: { l1: { cardsUnderneath: [player('lu1', '01119')] } },
  acts: {}, agendas: {},
}

test('lists card choices from zones only the card board draws', () => {
  const choices = [pick('sd1'), pick('vd1'), pick('sa1'), pick('dd1'), pick('lu1')]
  assert.deepEqual(sceneHiddenCardChoices(game, choices).map((c) => [c.index, c.cardCode]),
    [[0, '01163'], [1, '01116'], [2, '01117'], [3, '01118'], [4, '01119']])
})

test('leaves out cards the scene already shows (hand) and non-card choices', () => {
  const choices = [pick('inHand'), { tag: 'Label', label: 'Done' }, { tag: 'TargetLabel', target: { tag: 'EnemyTarget', contents: 'sd1' } }]
  assert.deepEqual(sceneHiddenCardChoices(game, choices), [])
})

test('a token choice that heals is marked as healing, an assignment is not', () => {
  const component = { tag: 'InvestigatorComponent', investigatorId: 'i1', tokenType: 'HorrorToken' }
  const heal = { tag: 'ComponentLabel', component, messages: [{ tag: 'HealHorror' }] }
  const assign = { tag: 'ComponentLabel', component, messages: [{ tag: 'InvestigatorMessage' }] }
  assert.deepEqual(sceneFallbackTokens([heal, assign], 'other').map((t) => t.heal), [true, false])
})
