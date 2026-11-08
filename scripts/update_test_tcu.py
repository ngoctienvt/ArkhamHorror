path = 'frontend/tests/hemlockOverview.test.mjs'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

tcu_test = '''
test('The Circle Undone scenarios select their overview boards', () => {
  assert.equal(hemlockOverview('c05043', 'c05043')?.image, 'img/scenes/the-circle-undone/disappearance-at-the-twilight-estate.webp')
  assert.equal(hemlockOverview('c05050', 'c05050')?.image, 'img/scenes/the-circle-undone/the-witching-hour.webp')
  assert.equal(hemlockOverview('c05065', 'c05065')?.image, 'img/scenes/the-circle-undone/at-deaths-doorstep.webp')
  assert.equal(hemlockOverview('c05120', 'c05120')?.image, 'img/scenes/the-circle-undone/the-secret-name.webp')
  assert.equal(hemlockOverview('c05161', 'c05161')?.image, 'img/scenes/the-circle-undone/the-wages-of-sin.webp')
  assert.equal(hemlockOverview('c05197', 'c05197')?.image, 'img/scenes/the-circle-undone/for-the-greater-good.webp')
  assert.equal(hemlockOverview('c05238', 'c05238')?.image, 'img/scenes/the-circle-undone/union-and-disillusion.webp')
  assert.equal(hemlockOverview('c05284', 'c05284')?.image, 'img/scenes/the-circle-undone/in-the-clutches-of-chaos.webp')
  assert.equal(hemlockOverview('c05325', 'c05325')?.image, 'img/scenes/the-circle-undone/before-the-black-throne.webp')

  // Verify village anchors for key TCU locations
  assert.deepEqual(hemlockVillagePosition('05077'), [30, 22]) // Office (Twilight Estate)
  assert.deepEqual(hemlockVillagePosition('05084'), [30, 22]) // Office Spectral
  assert.deepEqual(hemlockVillagePosition('05055'), [50, 60]) // Witches' Circle
  assert.deepEqual(hemlockVillagePosition('05169'), [58, 16]) // The Gallows
  assert.deepEqual(hemlockVillagePosition('05216'), [88, 75]) // Inner Sanctum (Silver Twilight)
  assert.deepEqual(hemlockVillagePosition('05257'), [68, 75]) // The Geist-Trap
  assert.deepEqual(hemlockVillagePosition('05333'), [73, 26]) // Hideous Palace (Azathoth)

  // In the Clutches of Chaos has its own Arkham anchors
  const chaos = hemlockOverview('c05284', 'c05284')?.anchors
  assert.ok(chaos)
  assert.deepEqual(hemlockVillagePosition('c05302', chaos), [13, 28]) // Hangman's Hill
  assert.deepEqual(hemlockVillagePosition('c05298', chaos), [20, 80]) // South Church
})
'''

content += tcu_test

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated hemlockOverview.test.mjs with TCU tests!")
