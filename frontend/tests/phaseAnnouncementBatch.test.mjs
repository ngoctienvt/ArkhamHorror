import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

const source = readFileSync(new URL('../src/arkham/motion/phaseAnnouncementBatch.ts', import.meta.url), 'utf8')
const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
const { orderPhaseBatch, opensPhaseBatch } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))

const phase = (p) => ({ tag: 'PhaseChanged', contents: p })
const update = { tag: 'GameUpdate', contents: '{}' }
// Wire shape: a record constructor, so its fields sit beside the tag.
const upkeepDraw = { tag: 'GameDrewCards', player: 'p1', title: 'drew', cards: [], kind: 'upkeep' }
const otherDraw = { tag: 'GameDrewCards', player: 'p1', title: 'drew', cards: [], kind: 'card' }
const revelation = { tag: 'GameCardOnly', contents: {} }
const log = { tag: 'GameMessage', contents: 'x' }

test('a batch with no phase change keeps the server order', () => {
  const batch = [otherDraw, log, update]
  assert.deepEqual(orderPhaseBatch(batch), batch)
})

test('end of round: Enemy and Upkeep are announced before the upkeep draw and the board', () => {
  // Wire order: the draw is broadcast while the engine runs, the board after
  // commit, the phases last.
  const batch = [upkeepDraw, update, phase('EnemyPhase'), phase('UpkeepPhase')]
  assert.deepEqual(orderPhaseBatch(batch), [phase('EnemyPhase'), phase('UpkeepPhase'), upkeepDraw, update])
})

test('phases entered after upkeep come after the upkeep draw, before what followed it', () => {
  const batch = [upkeepDraw, revelation, update, phase('EnemyPhase'), phase('UpkeepPhase'), phase('MythosPhase')]
  assert.deepEqual(orderPhaseBatch(batch), [
    phase('EnemyPhase'), phase('UpkeepPhase'), upkeepDraw, phase('MythosPhase'), revelation, update,
  ])
})

test('without an upkeep draw every phase is announced first', () => {
  const batch = [revelation, log, update, phase('EnemyPhase'), phase('UpkeepPhase'), phase('MythosPhase')]
  assert.deepEqual(orderPhaseBatch(batch), [
    phase('EnemyPhase'), phase('UpkeepPhase'), phase('MythosPhase'), revelation, log, update,
  ])
})

test('only draws, revelations and board updates open a batch', () => {
  assert.equal(opensPhaseBatch(update), true)
  assert.equal(opensPhaseBatch(upkeepDraw), true)
  assert.equal(opensPhaseBatch(revelation), true)
  assert.equal(opensPhaseBatch(log), false)
  assert.equal(opensPhaseBatch(phase('EnemyPhase')), false)
})
