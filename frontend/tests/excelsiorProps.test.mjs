import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

const source = readFileSync(new URL('../src/arkham/scene-excelsior-props.ts', import.meta.url), 'utf8')
const code = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
const { excelsiorProps } = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'))

test('office papers follow the revealed location through removal and undo', () => {
  const board = { image: 'hotel.webp', figures: [{ id: 'existing' }] }
  const hidden = { cardCode: 'c84018', revealed: false }
  const revealed = { ...hidden, revealed: true }
  assert.equal(excelsiorProps(board, '84001', []), board)
  assert.equal(excelsiorProps(board, '84001', [hidden]), board)
  const visible = excelsiorProps(board, 'c84001', [revealed])
  assert.deepEqual(visible.figures.map(({ id }) => id), ['existing', 'excelsior-office-documents'])
  assert.equal(excelsiorProps(board, '84001', [hidden]), board)
  assert.deepEqual(excelsiorProps(board, '84001', [revealed]), visible)
  assert.equal(excelsiorProps(board, '84002', [revealed]), board)
  assert.equal(excelsiorProps(undefined, '84001', [revealed]), undefined)
  assert.equal(readFileSync(new URL('../public/img/scenes/side-stories/excelsior-office-documents.webp', import.meta.url)).toString('ascii', 8, 12), 'WEBP')
})
