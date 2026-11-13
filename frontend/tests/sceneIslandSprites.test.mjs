import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

const load = async (file) => {
  const source = readFileSync(new URL(`../src/arkham/${file}`, import.meta.url), 'utf8')
  const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
  return import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))
}
const { islandImage, islandAspect, islandSpotImage, islandWaterImage, vehicleSprite, islandSetFiles } = await load('scene-island-sprites.ts')
const { sceneVehicles, passengersOf, riders, headingAfterMove, facingOf } = await load('scene-vehicle-model.ts')

const COSMOS = 'img/scenes/the-circle-undone/cosmos'
const REEF = 'img/scenes/the-innsmouth-conspiracy/devil-reef'
const RT = ':return-to-the-innsmouth-conspiracy:'

test('Cosmos: revealed locations have their own 3:2 sprite, face-down cards stand on the round rock', () => {
  assert.equal(islandImage(COSMOS, 'c05335', true), `${COSMOS}/05335.webp`)
  assert.equal(islandImage(COSMOS, 'c05335', false), `${COSMOS}/cosmos.webp`)
  assert.equal(islandImage(COSMOS, 'c99999', true), `${COSMOS}/cosmos.webp`)
  assert.equal(islandAspect(COSMOS, 'c05335', true), 3 / 2)
  assert.equal(islandAspect(COSMOS, 'c05335', false), 1)
  assert.equal(islandAspect(COSMOS, 'c99999', true), 1)
  assert.equal(islandSpotImage(COSMOS), `${COSMOS}/cosmos.webp`)
  assert.equal(islandWaterImage(COSMOS, 'c05335', true, 'FullyFlooded'), undefined)
})

test('Devil Reef: each revealed location shows the sprite drawn after its card, face-down cards their back', () => {
  for (const code of ['07168', '07169', '07170', '07171', '07172', '07173', '07102', '07103', '07104']) {
    assert.equal(islandImage(REEF, `c${code}`, true), `${REEF}/${code}.webp`, code)
  }
  // Double-sided Tidal Tunnel and Unfathomable Depths cards share one sprite per card.
  assert.equal(islandImage(REEF, 'c07174a', true), `${REEF}/07174.webp`)
  assert.equal(islandImage(REEF, 'c07175b', true), `${REEF}/07175.webp`)
  assert.equal(islandImage(REEF, 'c07177a', true), `${REEF}/07177.webp`)
  // Backs: the islands show "Devil Reef", tunnels "Tidal Tunnel", the depths "Unfathomable Depths".
  assert.equal(islandImage(REEF, 'c07169', false), `${REEF}/reef-back.webp`)
  assert.equal(islandImage(REEF, 'c07103', false), `${REEF}/tunnel-back.webp`)
  assert.equal(islandImage(REEF, 'c07174b', false), `${REEF}/tunnel-back.webp`)
  assert.equal(islandImage(REEF, 'c07176a', false), `${REEF}/depths-back.webp`)
  assert.equal(islandImage(REEF, 'c01111', true), `${REEF}/reef-back.webp`) // a stray card from another set
  // Churning Waters is face up from the start.
  assert.equal(islandImage(REEF, 'c07168', false), `${REEF}/07168.webp`)
  assert.equal(islandAspect(REEF, 'c07169', true), 3 / 2)
  assert.equal(islandAspect(REEF, 'c07169', false), 1)
  assert.equal(islandSpotImage(REEF), `${REEF}/reef-back.webp`)
})

test('Return to Devil Reef: Cave Mouth, Shrine to Hydra, the shared tunnel art and the second vessel', () => {
  assert.equal(islandImage(REEF, `c${RT}033`, true), `${REEF}/cave-mouth.webp`)
  assert.equal(islandImage(REEF, `c${RT}033`, false), `${REEF}/reef-back.webp`)
  assert.equal(islandImage(REEF, `c${RT}032`, false), `${REEF}/shrine-to-hydra.webp`)
  assert.equal(islandImage(REEF, `c${RT}065`, true), `${REEF}/07102.webp`)
  assert.equal(islandImage(REEF, `c${RT}066`, true), `${REEF}/07103.webp`)
  assert.equal(islandImage(REEF, `c${RT}067`, true), `${REEF}/07104.webp`)
  assert.equal(islandImage(REEF, `c${RT}067`, false), `${REEF}/tunnel-back.webp`)
  assert.equal(vehicleSprite(REEF, 'c07178'), `${REEF}/fishing-vessel.webp`)
  assert.equal(vehicleSprite(REEF, `c${RT}034`), `${REEF}/fishing-vessel.webp`)
  assert.equal(vehicleSprite(REEF, 'c01020'), undefined)
  assert.equal(vehicleSprite(COSMOS, 'c07178'), undefined)
})

test('Devil Reef water rises over flooded revealed locations, never over the open sea or a card back', () => {
  assert.equal(islandWaterImage(REEF, 'c07170', true, 'PartiallyFlooded'), `${REEF}/water-partial.webp`)
  assert.equal(islandWaterImage(REEF, 'c07170', true, 'FullyFlooded'), `${REEF}/water-full.webp`)
  assert.equal(islandWaterImage(REEF, 'c07170', true, 'Unflooded'), undefined)
  assert.equal(islandWaterImage(REEF, 'c07170', true, null), undefined)
  assert.equal(islandWaterImage(REEF, 'c07168', true, 'FullyFlooded'), undefined)
  assert.equal(islandWaterImage(REEF, 'c07170', false, 'FullyFlooded'), undefined)
})

test('every sprite an island set refers to is a WebP file in public/', () => {
  for (const folder of [COSMOS, REEF]) {
    for (const file of islandSetFiles(folder)) {
      const bytes = readFileSync(new URL(`../public/${file}`, import.meta.url))
      assert.equal(bytes.subarray(8, 12).toString('ascii'), 'WEBP', file)
    }
  }
  assert.equal(readFileSync(new URL('../public/img/scenes/the-innsmouth-conspiracy/devil-reef-sea.webp', import.meta.url)).subarray(8, 12).toString('ascii'), 'WEBP')
})

test('the Fishing Vessel is drawn at its location with whoever is inside it', () => {
  const game = {
    assets: {
      boat: { id: 'boat', cardCode: 'c07178', placement: { tag: 'AtLocation', contents: 'sea' } },
      gun: { id: 'gun', cardCode: 'c01016', placement: { tag: 'InPlayArea', contents: 'roland' } },
    },
    investigators: {
      roland: { id: 'roland', placement: { tag: 'InVehicle', contents: 'boat' } },
      daisy: { id: 'daisy', placement: { tag: 'AtLocation', contents: 'sea' } },
      agnes: { id: 'agnes', placement: { tag: 'InVehicle', contents: 'boat' } },
    },
  }
  const vehicles = sceneVehicles(game, (code) => vehicleSprite(REEF, code))
  assert.deepEqual(vehicles, [{ id: 'boat', cardCode: 'c07178', locationId: 'sea', image: `${REEF}/fishing-vessel.webp`, passengers: ['roland', 'agnes'] }])
  assert.deepEqual(passengersOf(game, 'gun'), [])
  assert.deepEqual([...riders(vehicles)], ['roland', 'agnes'])
  // A board with no vessel sprite draws no vessel.
  assert.deepEqual(sceneVehicles(game, () => undefined), [])
})

test('the boat turns its bow the way it sails and keeps it on a straight north/south move', () => {
  assert.equal(headingAfterMove(50, 30, 'right'), 'left')
  assert.equal(headingAfterMove(30, 50, 'left'), 'right')
  assert.equal(headingAfterMove(50, 50, 'left'), 'left')
})

test('a vehicle the server rotates (the Mine Cart) carries its facing in degrees', () => {
  const rotated = (degrees) => ({ id: 'a', cardCode: 'c10507', placement: { tag: 'AtLocation', contents: 'l' }, modifiers: [{ type: { tag: 'UIModifier', contents: { tag: 'Rotated', contents: degrees } } }] })
  assert.deepEqual(facingOf(rotated(270)), { facing: 270 })
  assert.deepEqual(facingOf(rotated(-90)), { facing: 270 })
  assert.deepEqual(facingOf({ id: 'a', cardCode: 'c07178', placement: { tag: 'AtLocation', contents: 'l' } }), {})
  const [cart] = sceneVehicles({ assets: { a: rotated(90) }, investigators: {} }, () => 'mine-cart.webp')
  assert.equal(cart.facing, 90)
})
