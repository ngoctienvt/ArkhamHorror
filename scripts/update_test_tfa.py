import re

path = 'frontend/tests/hemlockOverview.test.mjs'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

tfa_test = '''
test('The Forgotten Age scenarios select their overview boards', () => {
  assert.equal(hemlockOverview('c04043', 'c04043')?.image, 'img/scenes/the-forgotten-age/the-untamed-wilds.webp')
  assert.equal(hemlockOverview('c04054', 'c04054')?.image, 'img/scenes/the-forgotten-age/the-doom-of-eztli.webp')
  assert.equal(hemlockOverview('c04113', 'c04113')?.image, 'img/scenes/the-forgotten-age/threads-of-fate.webp')
  assert.equal(hemlockOverview('c04161', 'c04161')?.image, 'img/scenes/the-forgotten-age/the-boundary-beyond.webp')
  assert.equal(hemlockOverview('c04205a', 'c04205a')?.image, 'img/scenes/the-forgotten-age/heart-of-the-elders-part-1.webp')
  assert.equal(hemlockOverview('c04205b', 'c04205b')?.image, 'img/scenes/the-forgotten-age/heart-of-the-elders-part-2.webp')
  assert.equal(hemlockOverview('c04237', 'c04237')?.image, 'img/scenes/the-forgotten-age/the-city-of-archives.webp')
  assert.equal(hemlockOverview('c04277', 'c04277')?.image, 'img/scenes/the-forgotten-age/the-depths-of-yoth.webp')
  assert.equal(hemlockOverview('c04314', 'c04314')?.image, 'img/scenes/the-forgotten-age/shattered-aeons.webp')
  assert.equal(hemlockOverview('c04344', 'c04344')?.image, 'img/scenes/the-forgotten-age/turn-back-time.webp')

  // Verify village anchors for key TFA locations
  assert.deepEqual(hemlockVillagePosition('04050'), [73, 27]) // Expedition Camp
  assert.deepEqual(hemlockVillagePosition('04053'), [38, 80]) // Ruins of Eztli
  assert.deepEqual(hemlockVillagePosition('04068'), [50, 88]) // Chamber of Time
  assert.deepEqual(hemlockVillagePosition('04251'), [35, 85]) // Great Library (Pnakotus)
  assert.deepEqual(hemlockVillagePosition('04324'), [40, 52]) // Nexus of N'kai

  // Threads of Fate overrides Arkham anchors with its own wide layout
  const threadsOfFate = hemlockOverview('c04113', 'c04113')?.anchors
  assert.ok(threadsOfFate)
  assert.deepEqual(hemlockVillagePosition('c04128', threadsOfFate), [30, 20]) // Train Tracks
  assert.deepEqual(hemlockVillagePosition('c04141', threadsOfFate), [88, 50]) // Velma's Diner
})
'''

content += tfa_test

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated hemlockOverview.test.mjs with TFA tests!")
