import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

/* The four Innsmouth scenarios that place locations during play (the Pit of Despair, Into the Maelstrom,
 * A Light in the Fog, Horror in High Gear): their sprite sets, the High Gear road reader and slides. */
const load = async (file) => {
  const source = readFileSync(new URL(`../src/arkham/${file}`, import.meta.url), 'utf8')
  const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
  return import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))
}
const { islandImage, islandAspect, islandSpotImage, islandWaterImage, vehicleSprite, islandSetFiles, hasOwnIsland } = await load('scene-island-sprites.ts')
const { readRoadLayout, roadPosition, roadPositions, roadSlides, roadAdvanced } = await load('high-gear-road-model.ts')

const IC = 'img/scenes/the-innsmouth-conspiracy'
const REEF = `${IC}/devil-reef`
const PIT = `${IC}/pit`
const MAELSTROM = `${IC}/maelstrom`
const FOG = `${IC}/fog`
const GEAR = `${IC}/high-gear`
const COSMOS = 'img/scenes/the-circle-undone/cosmos'
const RT = ':return-to-the-innsmouth-conspiracy:'

test('Pit of Despair: own sprites, shared tunnels reached through devil-reef without copying files', () => {
  assert.equal(islandImage(PIT, 'c07047', false), `${PIT}/07047.webp`) // always face up
  assert.equal(islandImage(PIT, 'c07048', true), `${PIT}/07048.webp`)
  assert.equal(islandImage(PIT, 'c07048', false), `${REEF}/tunnel-back.webp`)
  assert.equal(islandImage(PIT, 'c07052a', false), `${REEF}/tunnel-back.webp`)
  assert.equal(islandImage(PIT, 'c07103', true), `${REEF}/07103.webp`)
  assert.equal(islandImage(PIT, `c${RT}067`, true), `${REEF}/07104.webp`)
  assert.equal(islandAspect(PIT, 'c07048', false), 1)
  assert.equal(islandAspect(PIT, 'c07048', true), 3 / 2)
  assert.equal(islandWaterImage(PIT, 'c07102', true, 'FullyFlooded'), `${REEF}/water-full.webp`)
  assert.equal(islandWaterImage(PIT, 'c07102', false, 'FullyFlooded'), undefined)
  assert.equal(islandSpotImage(PIT), `${REEF}/tunnel-back.webp`)
})

test("Into the Maelstrom: Y'ha-nthlei, sanctum and tunnel backs, and the always-face-up places", () => {
  for (const code of ['07319', '07321', '07322', '07323', '07324', '07325', '07326', '07327', '07328', '07329']) {
    assert.equal(islandImage(MAELSTROM, `c${code}`, true), `${MAELSTROM}/${code}.webp`, code)
  }
  for (const code of ['07320', '07328', '07329']) assert.equal(islandImage(MAELSTROM, `c${code}`, false), `${MAELSTROM}/${code}.webp`)
  assert.equal(islandImage(MAELSTROM, 'c07322', false), `${MAELSTROM}/yhanthlei-back.webp`)
  assert.equal(islandImage(MAELSTROM, 'c07326', false), `${MAELSTROM}/sanctum-back.webp`)
  assert.equal(islandImage(MAELSTROM, 'c07319', false), `${REEF}/tunnel-back.webp`)
  assert.equal(islandImage(MAELSTROM, `c${RT}065`, false), `${REEF}/tunnel-back.webp`)
  assert.equal(islandImage(MAELSTROM, `c${RT}066`, true), `${REEF}/07103.webp`)
  assert.equal(islandAspect(MAELSTROM, 'c07324', false), 1)
  assert.equal(islandWaterImage(MAELSTROM, 'c07324', false, 'PartiallyFlooded'), undefined)
})

test('A Light in the Fog: lighthouse always up, 07244 flips to the Lighthouse Basement, Holding Cells has its face', () => {
  for (const code of ['07239', '07240', '07241', '07242', '07243', '07245', '07246']) {
    assert.equal(islandImage(FOG, `c${code}`, false), `${FOG}/${code}.webp`, code)
  }
  assert.equal(islandImage(FOG, 'c07244', false), `${FOG}/07244b.webp`)
  assert.equal(islandImage(FOG, 'c07244a', true), `${FOG}/07244.webp`)
  assert.equal(islandImage(FOG, 'c07252', false), `${FOG}/07252b.webp`)
  assert.equal(islandImage(FOG, 'c07252b', true), `${FOG}/07252b.webp`)
  assert.equal(islandImage(FOG, 'c07249', false), `${REEF}/tunnel-back.webp`)
  assert.equal(islandImage(FOG, 'c07249', true), `${FOG}/07249.webp`)
  assert.equal(islandImage(FOG, `c${RT}065`, true), `${REEF}/07102.webp`)
  // Holding Cells cannot be flooded; a Sunken Grotto can.
  assert.equal(islandWaterImage(FOG, 'c07252', true, 'FullyFlooded'), undefined)
  assert.equal(islandWaterImage(FOG, 'c07245', true, 'PartiallyFlooded'), `${REEF}/water-partial.webp`)
})

test('Horror in High Gear: faces by code (a/b/c suffix ignored), the road back, Return to tiles and the two cars', () => {
  assert.equal(islandImage(GEAR, 'c07204c', true), `${GEAR}/07204.webp`)
  assert.equal(islandImage(GEAR, 'c07208b', true), `${GEAR}/07208.webp`)
  assert.equal(islandImage(GEAR, 'c07210', false), `${GEAR}/road-back.webp`)
  assert.equal(islandImage(GEAR, `c${RT}036`, true), `${GEAR}/mud-tracks.webp`)
  assert.equal(islandImage(GEAR, `c${RT}037`, true), `${GEAR}/straight-section.webp`)
  assert.equal(islandAspect(GEAR, 'c07210', false), 3 / 2) // the back is 3:2 like the faces
  assert.equal(vehicleSprite(GEAR, 'c07211a'), `${GEAR}/07211.webp`)
  assert.equal(vehicleSprite(GEAR, 'c07212b'), `${GEAR}/07212.webp`)
  assert.equal(vehicleSprite(GEAR, 'c07178'), undefined)
})

test('a location has its own sprite on a board only when the set drew one for it', () => {
  assert.equal(hasOwnIsland(FOG, 'c07252'), true) // Holding Cells in the off-map box is its sprite
  assert.equal(hasOwnIsland(FOG, 'c07252b'), true)
  assert.equal(hasOwnIsland(FOG, 'c01111'), false) // a stray card: its card is shown instead
  assert.equal(hasOwnIsland(PIT, 'c07102'), true)
  assert.equal(hasOwnIsland(REEF, 'c07169'), true)
  assert.equal(hasOwnIsland(COSMOS, 'c99999'), false)
  assert.equal(hasOwnIsland('', 'c07252'), false) // a board with no sprites shows the card
  assert.equal(hasOwnIsland('img/scenes/unknown', 'c07252'), false)
})

test('every sprite of the four new sets, shared ones included, is a WebP in public/', () => {
  for (const folder of [PIT, MAELSTROM, FOG, GEAR]) {
    const files = islandSetFiles(folder)
    assert.ok(files.length > 5, folder)
    for (const file of files) {
      assert.ok(!file.includes('..'), file)
      const bytes = readFileSync(new URL(`../public/${file}`, import.meta.url))
      assert.equal(bytes.subarray(8, 12).toString('ascii'), 'WEBP', file)
    }
  }
  for (const board of ['pit-of-despair-caverns', 'into-the-maelstrom-abyss', 'a-light-in-the-fog-cliffs', 'horror-in-high-gear-moor']) {
    const bytes = readFileSync(new URL(`../public/${IC}/${board}.webp`, import.meta.url))
    assert.equal(bytes.subarray(8, 12).toString('ascii'), 'WEBP', board)
  }
})

/* The six-row road layout the server sends: one token per column per row. */
const road = (...columns) => Array.from({ length: 6 }, (_, y) => columns.map((column) => column[y]).join(' '))
const ONE = ['.', '.', 'a', 'a', '.', '.']
const TWO = ['.', 'a', 'a', 'b', 'b', '.']
const THREE = ['a', 'a', 'b', 'b', 'c', 'c']
const col = (n, kind) => kind.map((cell) => (cell === '.' ? '.' : `road${n}${cell}`))

test('High Gear reader: a tile spans two rows of its column, one tile centred between rows 3 and 4', () => {
  const grid = readRoadLayout(road(col(1, ONE), col(2, ONE), col(3, ONE)))
  assert.equal(grid.columns, 3)
  assert.equal(grid.rows, 6)
  assert.deepEqual(grid.cells.road1a, { column: 0, rowCenter: 3, rows: 2 })
  assert.deepEqual(grid.cells.road3a, { column: 2, rowCenter: 3, rows: 2 })
  assert.deepEqual(roadPosition(grid, 'road1a'), [(0.5 / 3) * 100, 50])
  assert.deepEqual(roadPosition(grid, 'road3a'), [(2.5 / 3) * 100, 50])
  assert.equal(roadPosition(grid, 'road9a'), undefined)
})

test('High Gear reader: two and three tiles in a column stack on rows 2-3 / 4-5 and 1-2 / 3-4 / 5-6', () => {
  const two = readRoadLayout(road(col(1, ONE), col(2, TWO), col(3, THREE)))
  assert.deepEqual(two.cells.road2a, { column: 1, rowCenter: 2, rows: 2 })
  assert.deepEqual(two.cells.road2b, { column: 1, rowCenter: 4, rows: 2 })
  assert.deepEqual(two.cells.road3a, { column: 2, rowCenter: 1, rows: 2 })
  assert.deepEqual(two.cells.road3b, { column: 2, rowCenter: 3, rows: 2 })
  assert.deepEqual(two.cells.road3c, { column: 2, rowCenter: 5, rows: 2 })
  // Tiles of one column share an x; a taller column does not change the width of the others.
  const positions = roadPositions(two)
  assert.equal(positions.road2a[0], positions.road2b[0])
  assert.equal(positions.road3a[0], positions.road3c[0])
  assert.ok(positions.road2a[1] < positions.road2b[1])
})

test('High Gear reader: columns behind the last investigator are gone, the rest keep their order', () => {
  const driven = readRoadLayout(road(col(2, ONE), col(3, THREE), col(4, TWO)))
  assert.equal(driven.columns, 3)
  assert.equal(driven.cells.road2a.column, 0)
  assert.equal(driven.cells.road3c.column, 1)
  assert.equal(driven.cells.road4b.column, 2)
  assert.equal(driven.cells.road1a, undefined)
})

test('High Gear reader ignores empty columns and has nothing to read in an empty layout', () => {
  const gap = readRoadLayout(road(col(1, ONE), ['.', '.', '.', '.', '.', '.'], col(3, ONE)))
  assert.equal(gap.columns, 2)
  assert.equal(gap.cells.road3a.column, 1)
  assert.equal(readRoadLayout(null), undefined)
  assert.equal(readRoadLayout([]), undefined)
  assert.equal(readRoadLayout(['. .', '. .']), undefined)
})

test('High Gear slides: a new column enters on the right, the rear columns leave, the rest shift left', () => {
  const before = roadPositions(readRoadLayout(road(col(1, ONE), col(2, ONE), col(3, ONE))))
  const ids = (positions, prefix) => Object.fromEntries(Object.entries(positions).map(([label, at]) => [`${prefix}${label}`, at]))
  // Same locations keep their id when the road moves on; only their label (and so cell) changes.
  const beforeById = { l1: before.road1a, l2: before.road2a, l3: before.road3a }
  const grown = readRoadLayout(road(col(1, ONE), col(2, ONE), col(3, ONE), col(4, ONE)))
  const grownById = { l1: roadPosition(grown, 'road1a'), l2: roadPosition(grown, 'road2a'), l3: roadPosition(grown, 'road3a'), l4: roadPosition(grown, 'road4a') }
  const growth = roadSlides(beforeById, grownById)
  assert.deepEqual(growth.entering, ['l4'])
  assert.deepEqual(growth.leaving, [])
  assert.equal(roadAdvanced(growth), true)
  assert.ok(growth.shifting.every((s) => s.dx > 0 && s.dy === 0)) // squeezed left: they start to the right of where they end

  const trimmed = readRoadLayout(road(col(2, ONE), col(3, ONE), col(4, ONE)))
  const trimmedById = { l2: roadPosition(trimmed, 'road2a'), l3: roadPosition(trimmed, 'road3a'), l4: roadPosition(trimmed, 'road4a') }
  const drop = roadSlides(grownById, trimmedById)
  assert.deepEqual(drop.leaving, ['l1'])
  assert.deepEqual(drop.entering, [])
  assert.equal(roadAdvanced(drop), true)
  assert.ok(ids(before, 'x'))

  const still = roadSlides(trimmedById, { ...trimmedById })
  assert.equal(roadAdvanced(still), false)
  assert.deepEqual(still.shifting, [])
})
