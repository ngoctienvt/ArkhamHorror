import assert from 'node:assert/strict'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import ts from '../../frontend/node_modules/typescript/lib/typescript.js'

const root = new URL('../../', import.meta.url)
function moduleUrl(name, imports = {}) {
  const source = readFileSync(new URL(`frontend/src/arkham/${name}.ts`, root), 'utf8')
  let js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
  for (const [path, url] of Object.entries(imports)) js = js.replace(`'${path}'`, JSON.stringify(url))
  return 'data:text/javascript;base64,' + Buffer.from(js).toString('base64')
}
const { hemlockOverview, hemlockVillagePosition } = await import(moduleUrl('hemlock-overview', {
  './scene-anchors-the-dream-eaters': moduleUrl('scene-anchors-the-dream-eaters'),
}))
const { revealedScenePositions } = await import(moduleUrl('revealed-scene-positions'))
const evidence = []
for (const id of ['83001', '83016', '90004', '90011', '90020', '90032', '90041', '90054', '90065', '90094']) {
  assert.equal(hemlockOverview(id, id), undefined)
}
evidence.push('Confirmed: Guardians 2 IDs and challenge 8 IDs have no panorama selector.')
for (const [id, afterLayout, afterCodes] of [
  ['08648b', ['theGateOfYquaa titanicRamp1 titanicRamp2 titanicRamp3 titanicRamp4 hiddenTunnel'], ['08649', '08682', '08683', '08684', '08685', '08686']],
  ['72001', ['lostAsteroid1 spaceSet lostAsteroid2', 'teetawnPassage highRulersBastion tothisBarrens'], ['72009', '72027', '72028']],
  ['07274', ['tidalTunnel1 tidalTunnel2', 'grandEntryway lairOfDagon'], []],
  ['11553', ['centralChamber'], ['11559', '11569', '11570', '11571', '11572']],
]) {
  const initial = hemlockOverview(id, id)
  const after = hemlockOverview(id, id, afterLayout, undefined, afterCodes)
  assert.equal(after.image, initial.image)
  evidence.push(`Confirmed: ${id} retains ${after.image} in supplied late-board snapshot.`)
}
const places = [
  { id: 'a', cardCode: ':ages-unwound:069', revealed: true },
  { id: 'b', cardCode: ':ages-unwound:071', revealed: true },
]
const before = revealedScenePositions(':ages-unwound:062', places, { a: [20, 50], b: [80, 50] })
const after = revealedScenePositions(':ages-unwound:062', places, { a: [80, 50], b: [20, 50] })
assert.deepEqual(after, before)
evidence.push('Confirmed: Unstuck revealed landmarks ignore a swap of the underlying slot coordinates.')
for (const code of ['70025', '70027']) {
  const board = hemlockOverview('70001', '70001')
  assert.equal(hemlockVillagePosition(code, board.anchors), undefined)
}
evidence.push('Confirmed: Labyrinthine Halls 70025/70027 have no landmark coordinates.')

const inventory = JSON.parse(readFileSync(new URL('inventory.json', import.meta.url), 'utf8'))
assert.equal(inventory.length, 175)
assert.equal(inventory.filter((r) => r.homebrew).length, 49)
assert.equal(inventory.filter((r) => r.homebrew && !r.board).length, 26)
assert.equal(inventory.filter((r) => r.scaffold).length, 7)
for (const record of inventory) {
  assert.ok(record.id && record.path, `Incomplete inventory: ${record.name}`)
  assert.ok(existsSync(new URL(record.path, root)), `Missing source ${record.path}`)
  if (record.board) assert.ok(existsSync(new URL(`frontend/public/img/scenes/${record.board}.webp`, root)), `Missing board ${record.board}`)
}
for (const name of ['plan.md', 'coverage.md', '../reports/audit-261117-2321-scene-immersion.md']) {
  const file = new URL(name, import.meta.url)
  const source = readFileSync(file, 'utf8')
  for (const [, target] of source.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    if (target.startsWith('http') || target.startsWith('#')) continue
    assert.ok(existsSync(new URL(target.split('#')[0], file)), `Broken link: ${target}`)
  }
}
evidence.push('Verified: 175 inventory rows, 49 homebrew IDs, 26 without panorama, 7 backend shells; source and Markdown links exist.')
evidence.push('Scope: source-level and pure selector probes only; no live-game or browser verification.')
writeFileSync(new URL('verification.log', import.meta.url), evidence.join('\n') + '\n')
console.log(evidence.join('\n'))
