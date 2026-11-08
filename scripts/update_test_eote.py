import os

test_path = 'frontend/tests/hemlockOverview.test.mjs'

with open(test_path, 'r', encoding='utf-8') as f:
    content = f.read()

eote_test_snippet = """  assert.deepEqual(hemlockVillagePosition('07328'), [24, 25]) // Lair of Dagon (Sanctuary)
})

test('Edge of the Earth overview maps and location positions', () => {
  // Scenario boards
  assert.equal(hemlockOverview('08501a', '08501')?.image, 'img/scenes/the-edge-of-the-earth/ice-and-death-part-1.webp')
  assert.equal(hemlockOverview('08501b', '08501')?.image, 'img/scenes/the-edge-of-the-earth/ice-and-death-part-2.webp')
  assert.equal(hemlockOverview('08501c', '08501')?.image, 'img/scenes/the-edge-of-the-earth/ice-and-death-part-3.webp')
  assert.equal(hemlockOverview('08549', '08549')?.image, 'img/scenes/the-edge-of-the-earth/fatal-mirage.webp')
  assert.equal(hemlockOverview('08596', '08596')?.image, 'img/scenes/the-edge-of-the-earth/to-the-forbidden-peaks.webp')
  assert.equal(hemlockOverview('08621', '08621')?.image, 'img/scenes/the-edge-of-the-earth/city-of-the-elder-things.webp')
  assert.equal(hemlockOverview('08648a', '08648')?.image, 'img/scenes/the-edge-of-the-earth/the-heart-of-madness-part-1.webp')
  assert.equal(hemlockOverview('08648b', '08648')?.image, 'img/scenes/the-edge-of-the-earth/the-heart-of-madness-part-2.webp')

  // Sample location anchors across all scenarios
  assert.deepEqual(hemlockVillagePosition('08502'), [50, 58]) // Crash Site
  assert.deepEqual(hemlockVillagePosition('08509'), [15, 88]) // Snow Graves
  assert.deepEqual(hemlockVillagePosition('08512'), [52, 24]) // Barrier Camp
  assert.deepEqual(hemlockVillagePosition('08514'), [76, 38]) // Crystalline Cavern
  assert.deepEqual(hemlockVillagePosition('08556'), [50, 52]) // Prison of Memories
  assert.deepEqual(hemlockVillagePosition('08560'), [20, 80]) // Hedge Maze
  assert.deepEqual(hemlockVillagePosition('08564'), [91, 52]) // Riverview Theatre
  assert.deepEqual(hemlockVillagePosition('08600'), [8, 92])  // Deep Drifts
  assert.deepEqual(hemlockVillagePosition('08607'), [78, 14]) // The Summit
  assert.deepEqual(hemlockVillagePosition('08630'), [50, 86]) // Hidden Tunnel: Entrance to the Depths
  assert.deepEqual(hemlockVillagePosition('08632'), [52, 45]) // Stone Bridge
  assert.deepEqual(hemlockVillagePosition('08640'), [74, 20]) // Temple of the Elder Things
  assert.deepEqual(hemlockVillagePosition('08649'), [50, 52]) // The Gate of Y'quaa: Primordial Seal
  assert.deepEqual(hemlockVillagePosition('08676'), [50, 22]) // Mist-Pylon (North)
  assert.deepEqual(hemlockVillagePosition('08686'), [50, 96]) // Hidden Tunnel: A Way Out
})
"""

if "Edge of the Earth overview maps" not in content:
    content = content.replace("  assert.deepEqual(hemlockVillagePosition('07328'), [24, 25]) // Lair of Dagon (Sanctuary)\n})", eote_test_snippet)
    with open(test_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added EotE test suite")
else:
    print("EotE test suite already present")
