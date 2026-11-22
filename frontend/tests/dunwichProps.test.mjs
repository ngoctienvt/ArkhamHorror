import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

const source = readFileSync(new URL('../src/arkham/scene-dunwich-props.ts', import.meta.url), 'utf8')
const code = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
const { dunwichProps } = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'))
const board = { image: 'campus.webp', figures: [{ id: 'existing' }] }

test('burner follows the actual Alchemy Labs in both versions, including undo', () => {
  for (const scenario of ['02041', 'c51012']) {
    assert.equal(dunwichProps(board, scenario, []), board)
    const result = dunwichProps(board, scenario, [{ cardCode: 'c02057' }])
    assert.deepEqual(result.figures.map((figure) => figure.id), ['existing', 'alchemy-burner'])
    assert.equal(dunwichProps(board, scenario, []), board)
    assert.deepEqual(dunwichProps(board, scenario, [{ cardCode: 'c02057b' }]), result)
  }
  assert.equal(dunwichProps(board, '02062', [{ cardCode: '02057' }]), board)
  assert.equal(dunwichProps(undefined, '02041', [{ cardCode: '02057' }]), undefined)
  assert.equal(readFileSync(new URL('../public/img/scenes/the-dunwich-legacy/alchemy-burner.webp', import.meta.url)).toString('ascii', 8, 12), 'WEBP')
})

test('Sentinel Peak wall follows the unrevealed location, including both campaigns and undo', () => {
  const peak = { cardCode: 'c02284', revealed: false }
  for (const scenario of ['02274', 'c51047']) {
    const blocked = dunwichProps(board, scenario, [peak])
    assert.deepEqual(blocked.figures.map((figure) => figure.id), ['existing', 'sentinel-arcane-wall'])
    assert.equal(dunwichProps(board, scenario, [{ ...peak, revealed: true }]), board)
    assert.equal(dunwichProps(board, scenario, []), board)
    assert.deepEqual(dunwichProps(board, scenario, [peak]), blocked)
  }
  assert.equal(dunwichProps(board, '02041', [peak]), board)
  assert.equal(readFileSync(new URL('../public/img/scenes/the-dunwich-legacy/sentinel-arcane-wall.webp', import.meta.url)).toString('ascii', 8, 12), 'WEBP')
})
