import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

const source = readFileSync(new URL('../src/arkham/hemlock-overview.ts', import.meta.url), 'utf8')
const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
const { hemlockOverview, hemlockVillagePosition, hemlockHousePosition } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))

const scenarios = {
  '10501': 'written-in-rock-descent',
  '10523': 'hemlock-house',
  '10549': 'silent-heath',
  '10569': 'lost-sister',
  '10588': 'thing-in-the-depths',
  '10605': 'twisted-hollow',
  '10626': 'longest-night',
  '10651': 'fate-of-the-vale',
  '10704': 'vale-day',
  '10677a': 'vale-day',
  '10679a': 'vale-day',
  '10679b': 'vale-night',
}

function expectWebp(overview, art) {
  const expected = `img/scenes/hemlock-vale/${art}.webp`
  assert.equal(overview?.image, expected)
  const bytes = readFileSync(new URL(`../public/${overview.image}`, import.meta.url))
  assert.equal(bytes.toString('ascii', 8, 12), 'WEBP')
}

test('every playable Hemlock Vale board selects a shipped overview', () => {
  for (const [id, art] of Object.entries(scenarios)) {
    expectWebp(hemlockOverview('c' + id, 'c' + id), art)
  }
  assert.equal(hemlockOverview('c01104', 'c01104'), undefined)
})

test('Written in Rock selects the rail board after the cave-in on either reference printing', () => {
  for (const reference of ['c10501', 'c10502']) {
    assert.equal(hemlockOverview('c10501', reference).fixedPassages, true)
    const maze = hemlockOverview('c10501', reference + 'b')
    assert.equal(maze.fixedPassages, false)
    expectWebp(maze, 'written-in-rock-maze')
  }
})

test('Fate of the Vale changes backdrop only when the game lays out the nighttime village', () => {
  expectWebp(hemlockOverview('c10651', 'c10651', ['nest1 theAbyss nest2']), 'fate-of-the-vale')
  expectWebp(hemlockOverview('c10651', 'c10651', ['moon  diamond  star']), 'vale-night')
})

test('the village anchors cover all eight landmarks on both printed faces', () => {
  const anchors = new Set()
  for (let code = 10705; code <= 10712; code += 1) {
    const position = hemlockVillagePosition(`c${code}a`)
    assert.ok(position)
    assert.deepEqual(hemlockVillagePosition(`${code}b`), position)
    anchors.add(position.join(','))
  }
  assert.equal(anchors.size, 8)
  assert.deepEqual(hemlockVillagePosition('c10690a'), hemlockVillagePosition('c10706a'))
  assert.deepEqual(hemlockVillagePosition('c10691b'), hemlockVillagePosition('c10708b'))
  assert.equal(hemlockVillagePosition('c10543'), undefined)
})

test('the house keeps the foyer and attic on their painted floors as the board changes', () => {
  assert.deepEqual(hemlockHousePosition('pos0000'), [50, 75])
  assert.deepEqual(hemlockHousePosition('pos0003'), [50, 13])
  assert.deepEqual(hemlockHousePosition('posn0102'), [18, 31])
  assert.deepEqual(hemlockHousePosition('pos00n01'), [50, 92])
  assert.equal(hemlockHousePosition('posn0103'), undefined)
})

test('Night of the Zealot scenarios select their overview boards', () => {
  assert.equal(hemlockOverview('c01120', 'c01120')?.image, 'img/scenes/night-of-the-zealot/midnight-masks.webp')
  assert.equal(hemlockOverview('c01142', 'c01142')?.image, 'img/scenes/night-of-the-zealot/devourer-below.webp')
})

test('Dunwich Legacy scenarios select their overview boards', () => {
  assert.equal(hemlockOverview('c02041', 'c02041')?.image, 'img/scenes/the-dunwich-legacy/extracurricular-activity.webp')
  assert.equal(hemlockOverview('c02062', 'c02062')?.image, 'img/scenes/the-dunwich-legacy/the-house-always-wins.webp')
  assert.equal(hemlockOverview('c02118', 'c02118')?.image, 'img/scenes/the-dunwich-legacy/the-miskatonic-museum.webp')
  assert.equal(hemlockOverview('c02159', 'c02159')?.image, 'img/scenes/the-dunwich-legacy/the-essex-county-express.webp')
  assert.equal(hemlockOverview('c02195', 'c02195')?.image, 'img/scenes/the-dunwich-legacy/blood-on-the-altar.webp')
  assert.equal(hemlockOverview('c02236', 'c02236')?.image, 'img/scenes/the-dunwich-legacy/undimensioned-and-unseen.webp')
  assert.equal(hemlockOverview('c02274', 'c02274')?.image, 'img/scenes/the-dunwich-legacy/where-doom-awaits.webp')
  assert.equal(hemlockOverview('c02311', 'c02311')?.image, 'img/scenes/the-dunwich-legacy/lost-in-time-and-space.webp')
})

test('The Scarlet Keys scenarios select their overview boards', () => {
  assert.equal(hemlockOverview('c09501', 'c09501')?.image, 'img/scenes/the-scarlet-keys/riddles-and-rain.webp')
  assert.equal(hemlockOverview('c09520', 'c09520')?.image, 'img/scenes/the-scarlet-keys/dead-heat.webp')
  assert.equal(hemlockOverview('c09545', 'c09545')?.image, 'img/scenes/the-scarlet-keys/sanguine-shadows.webp')
  assert.equal(hemlockOverview('c09566', 'c09566')?.image, 'img/scenes/the-scarlet-keys/dealings-in-the-dark.webp')
  assert.equal(hemlockOverview('c09591', 'c09591')?.image, 'img/scenes/the-scarlet-keys/dancing-mad.webp')
  assert.equal(hemlockOverview('c09609', 'c09609')?.image, 'img/scenes/the-scarlet-keys/on-thin-ice.webp')
  assert.equal(hemlockOverview('c09635', 'c09635')?.image, 'img/scenes/the-scarlet-keys/dogs-of-war.webp')
  assert.equal(hemlockOverview('c09660', 'c09660')?.image, 'img/scenes/the-scarlet-keys/shades-of-suffering.webp')
  assert.equal(hemlockOverview('c09681', 'c09681')?.image, 'img/scenes/the-scarlet-keys/without-a-trace.webp')
  assert.equal(hemlockOverview('c09694', 'c09694')?.image, 'img/scenes/the-scarlet-keys/congress-of-the-keys.webp')
})

test('The Path to Carcosa scenarios select their overview boards', () => {
  // Base
  assert.equal(hemlockOverview('c03043', 'c03043')?.image, 'img/scenes/the-path-to-carcosa/curtain-call.webp')
  assert.equal(hemlockOverview('c03061', 'c03061')?.image, 'img/scenes/the-path-to-carcosa/the-last-king.webp')
  assert.equal(hemlockOverview('c03120', 'c03120')?.image, 'img/scenes/the-path-to-carcosa/echoes-of-the-past.webp')
  assert.equal(hemlockOverview('c03159', 'c03159')?.image, 'img/scenes/the-path-to-carcosa/the-unspeakable-oath.webp')
  assert.equal(hemlockOverview('c03200', 'c03200')?.image, 'img/scenes/the-path-to-carcosa/a-phantom-of-truth.webp')
  assert.equal(hemlockOverview('c03240', 'c03240')?.image, 'img/scenes/the-path-to-carcosa/the-pallid-mask.webp')
  assert.equal(hemlockOverview('c03274', 'c03274')?.image, 'img/scenes/the-path-to-carcosa/black-stars-rise.webp')
  assert.equal(hemlockOverview('c03316', 'c03316')?.image, 'img/scenes/the-path-to-carcosa/dim-carcosa.webp')

  // Return to
  assert.equal(hemlockOverview('c52014', 'c52014')?.image, 'img/scenes/the-path-to-carcosa/curtain-call.webp')
  assert.equal(hemlockOverview('c52021', 'c52021')?.image, 'img/scenes/the-path-to-carcosa/the-last-king.webp')
  assert.equal(hemlockOverview('c52028', 'c52028')?.image, 'img/scenes/the-path-to-carcosa/echoes-of-the-past.webp')
  assert.equal(hemlockOverview('c52034', 'c52034')?.image, 'img/scenes/the-path-to-carcosa/the-unspeakable-oath.webp')
  assert.equal(hemlockOverview('c52040', 'c52040')?.image, 'img/scenes/the-path-to-carcosa/a-phantom-of-truth.webp')
  assert.equal(hemlockOverview('c52048', 'c52048')?.image, 'img/scenes/the-path-to-carcosa/the-pallid-mask.webp')
  assert.equal(hemlockOverview('c52054', 'c52054')?.image, 'img/scenes/the-path-to-carcosa/black-stars-rise.webp')
  assert.equal(hemlockOverview('c52059', 'c52059')?.image, 'img/scenes/the-path-to-carcosa/dim-carcosa.webp')

  // Curtain Call: Arkham Theatre anchors
  const curtainCall = hemlockOverview('c03043', 'c03043').anchors
  assert.deepEqual(hemlockVillagePosition('03048', curtainCall), [57, 66]) // Theatre
  assert.deepEqual(hemlockVillagePosition('03049', curtainCall), [19, 70]) // Lobby
  assert.deepEqual(hemlockVillagePosition('03050', curtainCall), [38, 42]) // Balcony
  assert.deepEqual(hemlockVillagePosition('03051', curtainCall), [82, 74]) // Backstage
  assert.deepEqual(hemlockVillagePosition('', curtainCall, 'lobbyDoorway1'), [8, 20])
  assert.deepEqual(hemlockVillagePosition('', curtainCall, 'backstageDoorway1'), [91, 20])

  // The Last King: Ward Family Manor anchors
  const theLastKing = hemlockOverview('c03061', 'c03061').anchors
  assert.deepEqual(hemlockVillagePosition('03066', theLastKing), [50, 84]) // Foyer
  assert.deepEqual(hemlockVillagePosition('03067', theLastKing), [58, 36]) // Courtyard
  assert.deepEqual(hemlockVillagePosition('03068', theLastKing), [78, 62]) // Living Room
  assert.deepEqual(hemlockVillagePosition('03069', theLastKing), [24, 66]) // Ballroom
  assert.deepEqual(hemlockVillagePosition('03070', theLastKing), [22, 22]) // Dining Room
  assert.deepEqual(hemlockVillagePosition('03071', theLastKing), [82, 18]) // Gallery

  // Echoes of the Past: 3-floor Georgian manor cutaway anchors
  const echoes = hemlockOverview('c03120', 'c03120').anchors
  assert.deepEqual(hemlockVillagePosition('03127', echoes), [42, 80]) // Entry Hall
  assert.deepEqual(hemlockVillagePosition('03131', echoes), [41, 52]) // Quiet Halls (2nd Floor)
  assert.deepEqual(hemlockVillagePosition('03135', echoes), [39, 28]) // Quiet Halls (3rd Floor)
  assert.deepEqual(hemlockVillagePosition('03139', echoes), [77, 52]) // Hidden Library
  assert.deepEqual(hemlockVillagePosition('', echoes, 'groundFloor1'), [15, 80])
  assert.deepEqual(hemlockVillagePosition('', echoes, 'groundFloor2'), [70, 80])
  assert.deepEqual(hemlockVillagePosition('', echoes, 'secondFloor1'), [15, 52])
  assert.deepEqual(hemlockVillagePosition('', echoes, 'secondFloor2'), [64, 52])
  assert.deepEqual(hemlockVillagePosition('', echoes, 'thirdFloor1'), [16, 28])
  assert.deepEqual(hemlockVillagePosition('', echoes, 'thirdFloor2'), [64, 28])

  // The Unspeakable Oath: Arkham Asylum cutaway anchors
  const asylum = hemlockOverview('c03159', 'c03159').anchors
  assert.deepEqual(hemlockVillagePosition('03170', asylum), [10, 52]) // Kitchen
  assert.deepEqual(hemlockVillagePosition('03171', asylum), [32, 52]) // Mess Hall
  assert.deepEqual(hemlockVillagePosition('03172', asylum), [88, 52]) // Infirmary
  assert.deepEqual(hemlockVillagePosition('03173', asylum), [62, 25]) // Yard
  assert.deepEqual(hemlockVillagePosition('03174', asylum), [38, 25]) // Garden
  assert.deepEqual(hemlockVillagePosition('03175', asylum), [12, 84]) // Basement Hall
  assert.deepEqual(hemlockVillagePosition('', asylum, 'patientConfinement1'), [35, 84])
  assert.deepEqual(hemlockVillagePosition('', asylum, 'patientConfinement3'), [52, 84])
  assert.deepEqual(hemlockVillagePosition('', asylum, 'patientConfinement4'), [68, 84])
  assert.deepEqual(hemlockVillagePosition('', asylum, 'patientConfinement2'), [84, 84])

  // A Phantom of Truth: Paris anchors
  const paris = hemlockOverview('c03200', 'c03200').anchors
  assert.deepEqual(hemlockVillagePosition('03206', paris), [10, 16]) // Grand Guignol
  assert.deepEqual(hemlockVillagePosition('03207', paris), [21, 41]) // Opéra Garnier
  assert.deepEqual(hemlockVillagePosition('03208', paris), [12, 74]) // Gare d'Orsay
  assert.deepEqual(hemlockVillagePosition('03209', paris), [38, 18]) // Montmartre
  assert.deepEqual(hemlockVillagePosition('03210', paris), [68, 38]) // Le Marais
  assert.deepEqual(hemlockVillagePosition('03211', paris), [74, 71]) // Notre-Dame
  assert.deepEqual(hemlockVillagePosition('03212', paris), [52, 57]) // Gardens of Luxembourg
  assert.deepEqual(hemlockVillagePosition('03213', paris), [68, 16]) // Canal Saint-Martin
  assert.deepEqual(hemlockVillagePosition('03214', paris), [88, 22]) // Père Lachaise Cemetery
  assert.deepEqual(hemlockVillagePosition('03215', paris), [42, 88]) // Montparnasse

  // Black Stars Rise: Mont Saint-Michel anchors
  const montSaintMichel = hemlockOverview('c03274', 'c03274').anchors
  assert.deepEqual(hemlockVillagePosition('03284', montSaintMichel), [28, 16]) // Cloister
  assert.deepEqual(hemlockVillagePosition('03285', montSaintMichel), [20, 25]) // Knights' Hall
  assert.deepEqual(hemlockVillagePosition('03286', montSaintMichel), [60, 22]) // North Tower
  assert.deepEqual(hemlockVillagePosition('03287', montSaintMichel), [47, 25]) // Abbey Church
  assert.deepEqual(hemlockVillagePosition('03288', montSaintMichel), [82, 46]) // Outer Wall
  assert.deepEqual(hemlockVillagePosition('03289', montSaintMichel), [17, 54]) // Chapel of St. Aubert
  assert.deepEqual(hemlockVillagePosition('03290', montSaintMichel), [49, 56]) // Broken Steps
  assert.deepEqual(hemlockVillagePosition('03291', montSaintMichel), [34, 50]) // Chœur Gothique
  assert.deepEqual(hemlockVillagePosition('03292', montSaintMichel), [70, 62]) // Grand Rue
  assert.deepEqual(hemlockVillagePosition('03293', montSaintMichel), [31, 82]) // Abbey Tower
  assert.deepEqual(hemlockVillagePosition('03294', montSaintMichel), [76, 84]) // Porte de l'Avancée
})

test('The Drowned City scenarios select their overview boards', () => {
  assert.equal(hemlockOverview('c11501', 'c11501')?.image, 'img/scenes/the-drowned-city/one-last-job.webp')
  assert.equal(hemlockOverview('c11517', 'c11517')?.image, 'img/scenes/the-drowned-city/the-western-wall.webp')
  assert.equal(hemlockOverview('c11536', 'c11536')?.image, 'img/scenes/the-drowned-city/the-drowned-quarter.webp')
  assert.equal(hemlockOverview('c11553', 'c11553')?.image, 'img/scenes/the-drowned-city/the-apiary.webp')
  assert.equal(hemlockOverview('c11587', 'c11587')?.image, 'img/scenes/the-drowned-city/the-grand-vault.webp')
  assert.equal(hemlockOverview('c11612', 'c11612')?.image, 'img/scenes/the-drowned-city/court-of-the-ancients.webp')
  assert.equal(hemlockOverview('c11639', 'c11639')?.image, 'img/scenes/the-drowned-city/obsidian-canyons.webp')
  assert.equal(hemlockOverview('c11673', 'c11673')?.image, 'img/scenes/the-drowned-city/sepulchre-of-the-sleeper.webp')
  assert.equal(hemlockOverview('c11682', 'c11682')?.image, 'img/scenes/the-drowned-city/the-doom-of-arkham-part-1.webp')
  assert.equal(hemlockOverview('c11688a', 'c11688a')?.image, 'img/scenes/the-drowned-city/the-doom-of-arkham-part-2.webp')
  assert.equal(hemlockOverview('c11688b', 'c11688b')?.image, 'img/scenes/the-drowned-city/the-doom-of-arkham-part-2.webp')

  // Verify village anchors for key TDC locations
  // One Last Job follows its scenario grid: Tillinghast left of Miskatonic, Miskatonic left of Rivertown.
  const oneLastJob = hemlockOverview('c11501', 'c11501').anchors
  const tillinghast = hemlockVillagePosition('c11509', oneLastJob)
  const miskatonic = hemlockVillagePosition('c01129', oneLastJob)
  const rivertown = hemlockVillagePosition('c01125', oneLastJob)
  assert.ok(tillinghast[0] < miskatonic[0] && miskatonic[0] < rivertown[0])
  assert.deepEqual(hemlockVillagePosition('c01134', oneLastJob), [18, 43]) // Northside directly above Tillinghast
  assert.deepEqual(tillinghast, [15, 74])
  // Midnight Masks keeps its own Arkham grid, untouched by the One Last Job layout.
  const midnightMasks = hemlockOverview('c01120', 'c01120').anchors
  assert.equal(midnightMasks, undefined)
  assert.deepEqual(hemlockVillagePosition('c01129', midnightMasks), [18, 50]) // Miskatonic University
  assert.deepEqual(hemlockVillagePosition('c01125', midnightMasks), [50, 50]) // Rivertown
  assert.deepEqual(hemlockVillagePosition('c01134', midnightMasks), [18, 18]) // Northside
  assert.deepEqual(hemlockVillagePosition('11540'), [50, 52]) // Barrier Core
  assert.deepEqual(hemlockVillagePosition('11572'), [50, 86]) // Central Chamber (Apiary)
  assert.deepEqual(hemlockVillagePosition('11595'), [50, 52]) // Core of the Vault
  assert.deepEqual(hemlockVillagePosition('11676'), [50, 52]) // Dreamer's Rest (Sepulchre)
})

test('Dark Matter scenarios select their overview boards', () => {
  assert.equal(hemlockOverview(':dark-matter:014', ':dark-matter:014')?.image, 'img/scenes/dark-matter/the-tatterdemalion.webp')
  assert.equal(hemlockOverview(':dark-matter:054', ':dark-matter:054')?.image, 'img/scenes/dark-matter/electric-nightmare.webp')
  assert.equal(hemlockOverview(':dark-matter:089', ':dark-matter:089')?.image, 'img/scenes/dark-matter/lost-quantum.webp')
  assert.equal(hemlockOverview(':dark-matter:112', ':dark-matter:112')?.image, 'img/scenes/dark-matter/in-the-shadow-of-earth.webp')
  assert.equal(hemlockOverview(':dark-matter:153', ':dark-matter:153')?.image, 'img/scenes/dark-matter/strange-moons.webp')
  assert.equal(hemlockOverview(':dark-matter:190', ':dark-matter:190')?.image, 'img/scenes/dark-matter/the-machine-in-yellow.webp')
  assert.equal(hemlockOverview(':dark-matter:209', ':dark-matter:209')?.image, 'img/scenes/dark-matter/fragment-of-carcosa.webp')
  assert.equal(hemlockOverview(':dark-matter:243', ':dark-matter:243')?.image, 'img/scenes/dark-matter/starfall.webp')
})

test('Ages Unwound scenarios select their overview boards', () => {
  assert.equal(hemlockOverview(':ages-unwound:001', ':ages-unwound:001')?.image, 'img/scenes/ages-unwound/night-of-fire.webp')
  assert.equal(hemlockOverview(':ages-unwound:023', ':ages-unwound:023')?.image, 'img/scenes/ages-unwound/the-myriad-gentleman.webp')
  assert.equal(hemlockOverview(':ages-unwound:048', ':ages-unwound:048')?.image, 'img/scenes/ages-unwound/a-world-torn-down.webp')
  assert.equal(hemlockOverview(':ages-unwound:062', ':ages-unwound:062')?.image, 'img/scenes/ages-unwound/unstuck.webp')
  assert.equal(hemlockOverview(':ages-unwound:105', ':ages-unwound:105')?.image, 'img/scenes/ages-unwound/a-year-to-plan.webp')
  assert.equal(hemlockOverview(':ages-unwound:155', ':ages-unwound:155')?.image, 'img/scenes/ages-unwound/a-world-torn-down-again.webp')
  assert.equal(hemlockOverview(':ages-unwound:182', ':ages-unwound:182')?.image, 'img/scenes/ages-unwound/time-runs-out.webp')
})

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
  assert.deepEqual(hemlockVillagePosition('04068'), [50, 84]) // Chamber of Time
  assert.deepEqual(hemlockVillagePosition('04251'), [45, 82]) // Great Library (Pnakotus)
  assert.deepEqual(hemlockVillagePosition('04324'), [40, 52]) // Nexus of N'kai

  // Threads of Fate overrides Arkham anchors with its own wide layout
  const threadsOfFate = hemlockOverview('c04113', 'c04113')?.anchors
  assert.ok(threadsOfFate)
  assert.deepEqual(hemlockVillagePosition('c04128', threadsOfFate), [30, 20]) // Train Tracks
  assert.deepEqual(hemlockVillagePosition('c04141', threadsOfFate), [88, 50]) // Velma's Diner
})

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
  assert.deepEqual(hemlockVillagePosition('73008'), [60, 48]) // Steer's Office
  assert.deepEqual(hemlockVillagePosition('73028'), [20, 31]) // Train Station
  assert.deepEqual(hemlockVillagePosition('73027'), [88, 59]) // Arkham Advertiser
})

test('Standalone / Side Stories select their overview boards and location positions', () => {
  const standalones = [
    { id: '81001', img: 'img/scenes/side-stories/curse-of-the-rougarou.webp' },
    { id: '82001', img: 'img/scenes/side-stories/carnevale-of-horrors.webp' },
    { id: '88001', img: 'img/scenes/side-stories/fortune-and-folly.webp' },
    { id: '87001', img: 'img/scenes/side-stories/machinations-through-time.webp' },
    { id: '86001', img: 'img/scenes/side-stories/war-of-the-outer-gods.webp' },
    { id: '71001', img: 'img/scenes/side-stories/the-midwinter-gala.webp' },
    { id: '72001', img: 'img/scenes/side-stories/film-fatale.webp' },
    { id: '70001', img: 'img/scenes/side-stories/the-labyrinths-of-lunacy.webp' },
    { id: '73001', img: 'img/scenes/side-stories/traces-to-nowhere.webp' },
  ]

  for (const scen of standalones) {
    const overview = hemlockOverview(scen.id, 'reference')
    assert.ok(overview, `overview exists for ${scen.id}`)
    assert.equal(overview.image, scen.img)
    assert.equal(overview.village, true)
  }

  // Anchor checks
  const rougarou = hemlockOverview('81001', 'reference')
  assert.deepEqual(hemlockVillagePosition('81008', rougarou?.anchors), [80, 24])

  const carnevale = hemlockOverview('82001', 'reference')
  assert.deepEqual(hemlockVillagePosition('82011', carnevale?.anchors), [20, 26])

  const fortune = hemlockOverview('88001', 'reference')
  assert.deepEqual(hemlockVillagePosition('88011', fortune?.anchors), [48, 65])
})
