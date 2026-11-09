import os

test_path = 'frontend/tests/hemlockOverview.test.mjs'

with open(test_path, 'r', encoding='utf-8') as f:
    content = f.read()

ch2_test_snippet = """  assert.deepEqual(hemlockVillagePosition('08686'), [50, 96]) // Hidden Tunnel: A Way Out
})

test('Chapter 2 overview maps and location positions', () => {
  // Brethren of Ash
  assert.equal(hemlockOverview('12105', '12105')?.image, 'img/scenes/brethren-of-ash/spreading-flames.webp')
  assert.equal(hemlockOverview('12133', '12133')?.image, 'img/scenes/brethren-of-ash/smoke-and-mirrors.webp')
  assert.equal(hemlockOverview('12168', '12168')?.image, 'img/scenes/brethren-of-ash/queen-of-ash.webp')

  // Children of Blood
  assert.equal(hemlockOverview('13001', '13001')?.image, 'img/scenes/children-of-blood/river-of-blood.webp')
  assert.equal(hemlockOverview('13031', '13031')?.image, 'img/scenes/children-of-blood/new-horizons.webp')
  assert.equal(hemlockOverview('13068', '13068')?.image, 'img/scenes/children-of-blood/blood-money.webp')

  // Side Story: Traces to Nowhere
  assert.equal(hemlockOverview('73001', '73001')?.image, 'img/scenes/side-stories/traces-to-nowhere.webp')

  // Locations
  assert.deepEqual(hemlockVillagePosition('12116'), [50, 52]) // Miskatonic Quad
  assert.deepEqual(hemlockVillagePosition('12113'), [16, 74]) // Your Friend's Room
  assert.deepEqual(hemlockVillagePosition('12149'), [18, 22]) // Northside
  assert.deepEqual(hemlockVillagePosition('12151'), [50, 48]) // Merchant District
  assert.deepEqual(hemlockVillagePosition('12175'), [50, 16]) // Sluice Control
  assert.deepEqual(hemlockVillagePosition('12182'), [50, 84]) // Sewer Culvert
  assert.deepEqual(hemlockVillagePosition('13016'), [54, 48]) // Erwin Bridge
  assert.deepEqual(hemlockVillagePosition('13012'), [52, 70]) // River Docks
  assert.deepEqual(hemlockVillagePosition('13039'), [22, 30]) // Factory Floor: West
  assert.deepEqual(hemlockVillagePosition('13051'), [50, 68]) // Descending Tunnel
  assert.deepEqual(hemlockVillagePosition('13077'), [24, 46]) // Dining Hall
  assert.deepEqual(hemlockVillagePosition('73008'), [28, 42]) // Steer's Office
})
"""

if "Chapter 2 overview maps" not in content:
    content = content.replace("  assert.deepEqual(hemlockVillagePosition('08686'), [50, 96]) // Hidden Tunnel: A Way Out\n})", ch2_test_snippet)
    with open(test_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added Chapter 2 test suite")
else:
    print("Chapter 2 test suite already present")
