import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

const source = readFileSync(new URL('../src/arkham/scene-scarlet-props.ts', import.meta.url), 'utf8')
const code = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
const { scarletProps } = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'))

test('ravens follow the Tower location without leaking the set-aside card', () => {
  const board = { image: 'img/scenes/the-scarlet-keys/riddles-and-rain.webp', figures: [{ id: 'existing' }] }
  const tower = { cardCode: 'c09516', revealed: false }
  assert.equal(scarletProps(board, '09501', []), board)
  const visible = scarletProps(board, 'c09501', [tower])
  assert.deepEqual(visible.figures.map(({ id }) => id), ['existing', 'tower-ravens'])
  assert.deepEqual(scarletProps(board, '09501', [{ ...tower, revealed: true }]), visible)
  assert.equal(scarletProps(board, '09501', []), board)
  assert.equal(scarletProps(board, '09520', [tower]), board)
  assert.equal(scarletProps({ image: 'other.webp' }, '09501', [tower]).figures, undefined)
  assert.equal(scarletProps(undefined, '09501', [tower]), undefined)
  assert.equal(readFileSync(new URL('../public/img/scenes/the-scarlet-keys/tower-ravens.webp', import.meta.url)).toString('ascii', 8, 12), 'WEBP')
})
