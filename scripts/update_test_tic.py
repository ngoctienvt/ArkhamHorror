test_tic_snippet = """
test('The Innsmouth Conspiracy scenarios select their overview boards', () => {
  assert.equal(hemlockOverview('c07041', 'c07041')?.image, 'img/scenes/the-innsmouth-conspiracy/the-pit-of-despair.webp')
  assert.equal(hemlockOverview('c07056', 'c07056')?.image, 'img/scenes/the-innsmouth-conspiracy/the-vanishing-of-elina-harper.webp')
  assert.equal(hemlockOverview('c07123', 'c07123')?.image, 'img/scenes/the-innsmouth-conspiracy/in-too-deep.webp')
  assert.equal(hemlockOverview('c07163', 'c07163')?.image, 'img/scenes/the-innsmouth-conspiracy/devil-reef.webp')
  assert.equal(hemlockOverview('c07198', 'c07198')?.image, 'img/scenes/the-innsmouth-conspiracy/horror-in-high-gear.webp')
  assert.equal(hemlockOverview('c07231', 'c07231')?.image, 'img/scenes/the-innsmouth-conspiracy/a-light-in-the-fog.webp')
  assert.equal(hemlockOverview('c07274', 'c07274')?.image, 'img/scenes/the-innsmouth-conspiracy/the-lair-of-dagon.webp')
  assert.equal(hemlockOverview('c07311', 'c07311')?.image, 'img/scenes/the-innsmouth-conspiracy/into-the-maelstrom.webp')

  // Verify village anchors for key TIC locations
  assert.deepEqual(hemlockVillagePosition('07047'), [50, 52]) // Unfamiliar Chamber
  assert.deepEqual(hemlockVillagePosition('07052'), [77, 16]) // Sealed Exit
  assert.deepEqual(hemlockVillagePosition('07065'), [47, 52]) // Innsmouth Square
  assert.deepEqual(hemlockVillagePosition('07068'), [67, 52]) // Fish Street Bridge
  assert.deepEqual(hemlockVillagePosition('07168'), [50, 52]) // Churning Waters
  assert.deepEqual(hemlockVillagePosition('07171'), [78, 38]) // Waveworn Island
  assert.deepEqual(hemlockVillagePosition('07203'), [76, 12]) // Falcon Point Approach
  assert.deepEqual(hemlockVillagePosition('07241'), [48, 12]) // Lantern Room (Lighthouse)
  assert.deepEqual(hemlockVillagePosition('07247'), [68, 76]) // Shrine to Hydra
  assert.deepEqual(hemlockVillagePosition('07289'), [50, 18]) // Hall of Silence
  assert.deepEqual(hemlockVillagePosition('07283'), [50, 68]) // Grand Entryway
  assert.deepEqual(hemlockVillagePosition('07320'), [50, 50]) // Gateway to Y'ha-nthlei
  assert.deepEqual(hemlockVillagePosition('07328'), [24, 25]) // Lair of Dagon (Sanctuary)
})
"""

test_file = 'frontend/tests/hemlockOverview.test.mjs'

with open(test_file, 'r', encoding='utf-8') as f:
    content = f.read()

if "The Innsmouth Conspiracy scenarios select their overview boards" not in content:
    content = content.strip() + "\n" + test_tic_snippet
    with open(test_file, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated hemlockOverview.test.mjs with TIC tests!")
else:
    print("TIC tests already present")
