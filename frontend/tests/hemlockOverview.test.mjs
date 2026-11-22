import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

function moduleUrl(filename, imports = {}) {
  const source = readFileSync(new URL(`../src/arkham/${filename}.ts`, import.meta.url), 'utf8')
  let js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
  for (const [path, url] of Object.entries(imports)) js = js.replace(`'${path}'`, JSON.stringify(url))
  return 'data:text/javascript;base64,' + Buffer.from(js).toString('base64')
}
const { extracurricularCommotion, hemlockOverview, hemlockVillagePosition, museumExhibitArt, spreadingFlamesFire } = await import(moduleUrl('hemlock-overview', {
  './scene-anchors-the-dream-eaters': moduleUrl('scene-anchors-the-dream-eaters'),
}))
const { hiddenSceneArt, revealedScenePositions } = await import(moduleUrl('revealed-scene-positions'))
const { essexTrainArt, essexTrainPosition, hasLocationArt, hiddenChamberPosition } = await import(moduleUrl('scene-location-art'))
const { dunwichCarcosaScene } = await import(moduleUrl('scene-dunwich-carcosa'))

test('the seven reveal maps use shipped panoramas and a common hidden image', () => {
  for (const id of ['11517', '11536', '11587', '12168', '10523', ':ages-unwound:062', ':dark-matter:054']) {
    const board = hemlockOverview(id, id)
    assert.equal(board.islands, undefined)
    for (const path of [board.image, hiddenSceneArt(id)]) {
      assert.equal(readFileSync(new URL(`../public/${path}`, import.meta.url)).toString('ascii', 8, 12), 'WEBP')
    }
  }
})

test('hidden locations use provisional points without leaking their card identity', () => {
  const grid = { visible: [85, 80], first: [10, 28], second: [21, 30], third: [30, 30] }
  const visible = { id: 'visible', cardCode: 'c11541', revealed: true }
  const hidden = ['first', 'second', 'third'].map((id) => ({ id, cardCode: 'c11541', revealed: false }))
  const positions = revealedScenePositions('c11536', [visible, ...hidden], grid)
  assert.deepEqual(positions.visible, [10, 29])
  assert.equal(new Set(Object.values(positions).map(String)).size, 4)
  assert.deepEqual(revealedScenePositions('c11536', [
    visible, ...hidden.map((l) => ({ ...l, cardCode: 'c11545' })),
  ], grid), positions)
})

test('three Abyssal Trenches take three separate painted points once revealed', () => {
  const grid = { a: [20, 30], b: [50, 30], c: [80, 80] }
  const locations = Object.keys(grid).map((id) => ({ id, cardCode: 'c11541', revealed: true }))
  const positions = revealedScenePositions('c11536', locations, grid)
  assert.deepEqual(positions, { a: [10, 29], b: [21, 30], c: [32, 30] })
  assert.deepEqual(revealedScenePositions('c11536', locations.reverse(), grid), positions)
})

test('revealing a trench moves it to its landmark and frees the occupied spot', () => {
  const grid = { placeholder: [10, 29], trench: [50, 83] }
  const locations = [
    { id: 'placeholder', cardCode: 'c11548', revealed: false },
    { id: 'trench', cardCode: 'c11541', revealed: false },
  ]
  const before = revealedScenePositions('c11536', locations, grid)
  assert.deepEqual(before, grid)
  const after = revealedScenePositions('c11536', [locations[0], { ...locations[1], revealed: true }], grid)
  assert.deepEqual(after.trench, before.placeholder)
  assert.notDeepEqual(after.placeholder, before.placeholder)
  assert.deepEqual(grid.trench, [50, 83])
})

test('transformed rooms and alternate card faces retain their painted landmarks', () => {
  const grid = { room: [50, 50] }
  assert.deepEqual(revealedScenePositions('10523', [
    { id: 'room', cardCode: 'c10532b', revealed: false, enemyLocation: true },
  ], grid).room, [22, 26])
  assert.deepEqual(revealedScenePositions(':ages-unwound:062', [
    { id: 'room', cardCode: ':ages-unwound:084', revealed: true },
  ], grid).room, [23, 26])
})

const scenarios = {
  '10501': 'written-in-rock-mine',
  '10523': 'hemlock-house-reveal',
  '10549': 'silent-heath-snowfield',
  '10569': 'lost-sister-caverns',
  '10588': 'thing-in-the-depths-swamp',
  '10605': 'twisted-hollow-woods',
  '10626': 'longest-night-fields',
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

test('Dream-Eaters selects the current board, including Kadath with every region in its layout', () => {
  const kadath = ['ulthar baharna kadatheron ilekVad celephaïs']
  const cases = [
    ['06063', [], [], 'waking-nightmare', ['06070', '06074', 'basementDoor2']],
    ['06039', ['seventySteps enchantedWoods1'], ['seventySteps'], 'beyond-the-gates-steps', ['06045', '06049']],
    ['06039', ['seventySteps enchantedWoods1'], ['enchantedWoods1'], 'beyond-the-gates-woods', ['06049', 'enchantedWoods6']],
    ['06119', kadath, ['ulthar'], 'kadath-kingdom-of-the-skai', ['06127', '06129']],
    ['06119', kadath, ['baharna'], 'kadath-oriab', ['06136', '06138']],
    ['06119', kadath, ['kadatheron'], 'kadath-mnar', ['06130', '06131', '06132']],
    ['06119', kadath, ['ilekVad'], 'kadath-forbidden-lands', ['06133', '06135']],
    ['06119', kadath, ['celephaïs'], 'kadath-timeless-realm', ['06139', '06142', '06143']],
    ['06168', ['frontPorchEntryway mysteriousStairs1'], ['frontPorchEntryway'], 'thousand-shapes-house', ['06174', 'upstairsDoorway2']],
    ['06206', [], [], 'dark-side-of-the-moon', ['06214', '06223']],
    ['06247', [], [], 'point-of-no-return', ['06053', 'seaOfPitch1', 'seaOfPitch4']],
    ['06286', ['onyxGates'], ['onyxGates'], 'where-the-gods-dwell-leng', ['06298', '06299']],
    ['06286', ['northTower'], ['northTower'], 'where-the-gods-dwell-towers', ['06299', 'northTower', 'westTower']],
    ['06168', ['mysteriousStairs1'], ['mysteriousStairs1'], 'endless-stairs/bg', []],
    ['06333', ['theGreatWeb1', 'theGreatWeb4'], ['theGreatWeb1', 'theGreatWeb4'], 'weaver/bg-bridge', []],
    ['06333', ['theGreatWeb4', 'atlachNacha'], ['theGreatWeb4'], 'weaver/bg-ring', []],
    ['06333', ['theGreatWeb4 theGreatWeb5'], ['theGreatWeb4', 'theGreatWeb5'], 'weaver/bg-ring', []],
  ]
  for (const [code, layout, placed, name, keys] of cases) {
    const overview = hemlockOverview('c' + code, code, layout, placed)
    assert.equal(overview?.image, `img/scenes/the-dream-eaters/${name}.webp`)
    assert.equal(readFileSync(new URL(`../public/${overview.image}`, import.meta.url)).toString('ascii', 8, 12), 'WEBP')
    assert.equal(overview.islands, keys.length ? undefined : overview.image.slice(0, overview.image.lastIndexOf('/')))
    for (const key of keys) assert.ok(overview.anchors[key], key)
  }
  const hospital = hemlockOverview('06063', '06063')
  assert.equal(hospital.revealRoomAnchors, true)
  assert.deepEqual(hemlockVillagePosition('c06075b', hospital.anchors, 'basementDoor2'), [63, 58])
  assert.deepEqual(hemlockVillagePosition('c06075b', hospital.anchors, 'basementDoor2', true), [17, 89])
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

test('Night of the Zealot scenarios select their overview boards', () => {
  assert.equal(hemlockOverview('c01120', 'c01120')?.image, 'img/scenes/night-of-the-zealot/midnight-masks.webp')
  assert.equal(hemlockOverview('c01142', 'c01142')?.image, 'img/scenes/night-of-the-zealot/devourer-below.webp')
})

test('Midnight Masks reflects the house outcome in the campaign log', () => {
  const intact = 'img/scenes/night-of-the-zealot/midnight-masks.webp'
  const burned = 'img/scenes/night-of-the-zealot/midnight-masks-burned.webp'
  const houseBurned = { tag: 'NightOfTheZealotKey', contents: 'YourHouseHasBurnedToTheGround' }
  const houseStanding = { tag: 'NightOfTheZealotKey', contents: 'YourHouseIsStillStanding' }
  for (const id of ['c01120', 'c50025']) {
    const image = (log) => hemlockOverview(id, 'c01120', null, [], [], log)?.image
    assert.equal(image(), intact)
    assert.equal(image({ recorded: [houseStanding], recordedCounts: [] }), intact)
    assert.equal(image({ recorded: [houseBurned], recordedCounts: [] }), burned)
    assert.equal(image({ recorded: [], recordedCounts: [[houseBurned, 1]] }), burned)
  }
  assert.equal(readFileSync(new URL(`../public/${burned}`, import.meta.url)).toString('ascii', 8, 12), 'WEBP')
})

test('Excelsior has anchors for every room and Blob uses the live grid', () => {
  const hotel = hemlockOverview('c84001', 'c84001')
  const blob = hemlockOverview('c85001', 'c85001')
  for (const board of [hotel, blob]) {
    assert.equal(readFileSync(new URL(`../public/${board.image}`, import.meta.url)).toString('ascii', 8, 12), 'WEBP')
  }
  const rooms = [
    'hotelRoof', 'room245', 'room212', 'secondFloorHall', 'room225',
    'suiteBalcony', 'restaurant', 'foyer', 'office', 'basement',
  ]
  const points = rooms.map((label) => hemlockVillagePosition('', hotel.anchors, label))
  assert.ok(points.every(Boolean))
  assert.equal(new Set(points.map(String)).size, rooms.length)
  assert.equal(blob.anchors, undefined)
  assert.equal(blob.islands, 'img/scenes/side-stories/blob')
})

test('Dunwich Legacy scenarios select their overview boards', () => {
  assert.equal(hemlockOverview('c02041', 'c02041')?.image, 'img/scenes/the-dunwich-legacy/extracurricular-activity.webp')
  assert.equal(hemlockOverview('c02062', 'c02062')?.image, 'img/scenes/the-dunwich-legacy/return-to-the-house-always-wins.webp')
  assert.equal(hemlockOverview('c02118', 'c02118')?.image, 'img/scenes/the-dunwich-legacy/return-to-the-miskatonic-museum.webp')
  assert.equal(hemlockOverview('c02159', 'c02159')?.image, 'img/scenes/the-dunwich-legacy/essex-county-rails.webp')
  assert.equal(hemlockOverview('c02195', 'c02195')?.image, 'img/scenes/the-dunwich-legacy/blood-on-the-altar.webp')
  assert.equal(hemlockOverview('c02236', 'c02236')?.image, 'img/scenes/the-dunwich-legacy/undimensioned-and-unseen.webp')
  assert.equal(hemlockOverview('c02274', 'c02274')?.image, 'img/scenes/the-dunwich-legacy/where-doom-awaits.webp')
  assert.equal(hemlockOverview('c02311', 'c02311')?.image, 'img/scenes/the-dunwich-legacy/lost-in-time-and-space.webp')
})

test('Extracurricular Activity changes art at the Science Building disturbance and keeps location anchors', () => {
  for (const id of ['c02041', 'c51012']) {
    const snapshot = (number, actSide, step, agendaSide, flipped = false) => hemlockOverview(
      id, '02041', null, [], [], null, 'none',
      extracurricularCommotion(
        [{ sequence: { number, side: actSide } }],
        [{ sequence: { step, side: agendaSide }, flipped }],
      ),
    )
    const quiet = snapshot(1, 'A', 1, 'A')
    assert.deepEqual(snapshot(1, 'B', 1, 'B', true), quiet)
    assert.deepEqual(snapshot(2, 'A', 2, 'A'), quiet)
    const commotion = snapshot(2, 'B', 1, 'A')
    assert.match(commotion.image, /extracurricular-activity-science-commotion\.webp$/)
    assert.deepEqual(snapshot(3, 'A', 2, 'A'), commotion)
    assert.deepEqual(snapshot(1, 'A', 2, 'B'), commotion)
    assert.deepEqual(snapshot(1, 'A', 2, 'A', true), commotion)
    assert.deepEqual(snapshot(1, 'A', 3, 'A'), commotion)
    assert.deepEqual(snapshot(2, 'A', 2, 'A'), quiet) // Undo or loading an earlier snapshot.
    for (const board of [quiet, commotion]) {
      assert.equal(readFileSync(new URL(`../public/${board.image}`, import.meta.url)).toString('ascii', 8, 12), 'WEBP')
      assert.deepEqual(board.anchors, {
        '02048': [53, 54], '02049': [19, 88], '02050': [30, 57], '02051': [53, 36],
        '02052': [61, 22], '02053': [77, 43], '02054': [89, 29], '02055': [89, 29],
        '02056': [78, 77], '02057': [88, 89], '51013': [22, 18],
      })
    }
  }
})

test('Dunwich and Carcosa variants compose with original and Return to boards', () => {
  const cases = [
    ['02062', '51015', '02064', 2, 'damaged'],
    ['02118', '51020', '02119', 1, 'shadows'],
    ['02159', '51025', '02160', 1, 'maw'],
    ['02195', '51032', '02196', 1, 'night'],
    ['02236', '51041', '02238', 2, 'storm'],
    ['03061', '52021', '03062', 1, 'madness'],
  ]
  for (const [original, returned, agendaId, step, suffix] of cases) {
    const snapshot = {
      acts: [], locations: [], reminders: [],
      agendas: [{ id: `c${agendaId}`, sequence: { step, side: 'B' }, flipped: true, deckId: 1 }],
    }
    const first = dunwichCarcosaScene(hemlockOverview(`c${original}`, `c${original}`), snapshot)
    const second = dunwichCarcosaScene(hemlockOverview(`c${returned}`, `c${original}`), snapshot)
    assert.deepEqual(first, second, returned)
    assert.match(first.image, new RegExp(`-${suffix}\\.webp$`))
    assert.equal(readFileSync(new URL(`../public/${first.image}`, import.meta.url)).toString('ascii', 8, 12), 'WEBP')
  }
})

test('Return to IDs select the same shipped overview as their base scenarios', () => {
  const pairs = [
    ['01120', '50025'], ['01142', '50032'],
    ['02041', '51012'], ['02062', '51015'], ['02118', '51020'], ['02159', '51025'],
    ['02195', '51032'], ['02236', '51041'], ['02274', '51047'], ['02311', '51053'],
    ['04043', '53016'], ['04054', '53017'], ['04113', '53028'], ['04161', '53038'],
    ['04205a', '53045'], ['04205b', '53048'], ['04237', '53053'], ['04277', '53059'],
    ['04314', '53061'], ['04344', '53066'],
    ['05043', '54016'], ['05050', '54017'], ['05065', '54024'], ['05120', '54029'],
    ['05161', '54034'], ['05197', '54042'], ['05238', '54046'], ['05284', '54049'], ['05325', '54056'],
    ...Object.entries({
      '07041': '018', '07056': '022', '07123': '028', '07163': '031', '07198': '035', '07231': '039',
      '07274': '043', '07311': '048',
    }).map(([base, suffix]) => [base, `:return-to-the-innsmouth-conspiracy:${suffix}`]),
  ]
  for (const [base, variant] of pairs) {
    const original = hemlockOverview(`c${base}`, `c${base}`)
    const returned = hemlockOverview(`c${variant}`, `c${base}`)
    assert.deepEqual(returned, original, variant)
    assert.equal(readFileSync(new URL(`../public/${returned.image}`, import.meta.url)).toString('ascii', 8, 12), 'WEBP')
  }
  for (const cardCode of ['51031', '51036', '51051']) {
    assert.equal(hemlockOverview(cardCode, cardCode), undefined)
  }
})

test('Essex train holds its painted slots when the rear cars are removed', () => {
  const slots = Array.from({ length: 7 }, (_, i) => essexTrainPosition(`pos0${i}00`))
  assert.deepEqual(slots, ['trainCar6', 'trainCar5', 'trainCar4', 'trainCar3', 'trainCar2', 'trainCar1', 'engineCar'].map(essexTrainPosition))
  assert.deepEqual(slots.slice(3), ['trainCar3', 'trainCar2', 'trainCar1', 'engineCar'].map(essexTrainPosition))
  const art = (cardCode, revealed) => essexTrainArt({ id: 'car', label: 'trainCar2', cardCode, revealed })
  const cars = ['02167', '02172', '02173', '02174', '51029', '51030']
  assert.equal(new Set(cars.map(code => art(code, false))).size, 1)
  const files = new Set([...cars.map(code => art(code, true)), art('51028', false), art('02167', false)])
  assert.equal(files.size, 8)
  for (const path of files) {
    assert.equal(readFileSync(new URL(`../public/${path}`, import.meta.url)).toString('ascii', 8, 12), 'WEBP')
  }
})

test('Twilight Estate spectral treatment follows the scenario and current locations', () => {
  assert.equal(hemlockOverview('05043', '05043').spectral, true)
  for (const id of ['05065', '54024']) {
    assert.equal(hemlockOverview(id, '05065', null, [], ['c05071']).spectral, undefined)
    assert.equal(hemlockOverview(id, '05065', null, [], ['c05078']).spectral, true)
  }
})

test('Locations added later resolve to distinct scenery and shuffled art uses the live label', () => {
  for (const [id, codes] of [
    ['51012', ['02050', '51013']], ['53028', ['53034b', '53029b']],
    ['53053', ['53055', '53056', '53057']], ['53061', ['53062', '53063', '53064']],
  ]) {
    const anchors = hemlockOverview(id, id).anchors
    const points = codes.map(code => hemlockVillagePosition(code, anchors))
    assert.ok(points.every(Boolean))
    assert.equal(new Set(points.map(String)).size, codes.length)
  }
  const woods = { id: 'woods', label: 'woods3', cardCode: '01150', revealed: false }
  assert.equal(hasLocationArt('night-of-the-zealot/devourer-below', woods), false)
  assert.equal(hasLocationArt('night-of-the-zealot/devourer-below', { ...woods, revealed: true }), false)
  assert.equal(hasLocationArt('night-of-the-zealot/devourer-below', { ...woods, label: 'ritualSite' }), false)
  assert.deepEqual(hiddenChamberPosition([74, 62]), [63, 73])
})

test('Return to scenes select their playable IDs and have anchors for the added locations', () => {
  const scenes = [
    ['50011', '01104', ['50014', '50015', '50016', '50017', '50019', '50021']],
    ['51015', '02062', ['51017']],
    ['52028', '03120', ['52029', '52030', '52031', '52032']],
    ['52059', '03316', ['52061', '52062', '52063']],
    ['54024', '05065', ['54027']],
    ['54016', '05043', ['54028']],
    ['54042', '05197', ['54044', '54045']],
  ]
  for (const [id, reference, codes] of scenes) {
    const map = hemlockOverview(`c${id}`, `c${reference}`)
    assert.match(map.image, /\/return-to-/)
    assert.equal(readFileSync(new URL(`../public/${map.image}`, import.meta.url)).toString('ascii', 8, 12), 'WEBP')
    const points = codes.map((code) => map.anchors[code])
    assert.ok(points.every(Boolean), id)
    assert.equal(new Set(points.map(String)).size, codes.length)
  }
})

test('Echoes basement rooms move from the assigned slot to the correct room on reveal', () => {
  const board = hemlockOverview('c52028', 'c03120')
  assert.equal(board.revealRoomAnchors, true)
  for (const code of ['c52030', 'c52031', 'c52032']) {
    for (const label of ['basement1', 'basement2']) {
      assert.deepEqual(hemlockVillagePosition(code, board.anchors, label), board.anchors[label])
      assert.deepEqual(hemlockVillagePosition(code, board.anchors, label, true), board.anchors[code.slice(1)])
      assert.notDeepEqual(board.anchors[label], board.anchors[code.slice(1)])
    }
  }
})

test('Museum exhibits use their assigned halls and show art only after reveal', () => {
  const board = hemlockOverview('c51020', 'c02118')
  assert.equal(board.museumExhibits, true)
  assert.equal(readFileSync(new URL(`../public/${board.image}`, import.meta.url)).toString('ascii', 8, 12), 'WEBP')
  assert.deepEqual(hemlockOverview('c02118', 'c02118'), board)
  for (const code of ['02132', '02133', '02134', '02135', '02136', '02137', '51021', '51022']) {
    assert.equal(museumExhibitArt(`c${code}`, false), undefined)
    const art = museumExhibitArt(`c${code}`, true)
    assert.equal(readFileSync(new URL(`../public/${art}`, import.meta.url)).toString('ascii', 8, 12), 'WEBP')
    for (let hall = 1; hall <= 6; hall++) {
      const label = `hall${hall}`
      assert.deepEqual(hemlockVillagePosition(code, board.anchors, label), board.anchors[label])
    }
  }
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
  assert.equal(hemlockOverview('c09681', 'c09681')?.image, 'img/scenes/the-scarlet-keys/without-a-trace-otherworld.webp')
  assert.equal(hemlockOverview('c09694', 'c09694')?.image, 'img/scenes/the-scarlet-keys/congress-halls.webp')
})

test('The Path to Carcosa scenarios select their overview boards', () => {
  // Base
  assert.equal(hemlockOverview('c03043', 'c03043')?.image, 'img/scenes/the-path-to-carcosa/return-to-curtain-call.webp')
  assert.equal(hemlockOverview('c03061', 'c03061')?.image, 'img/scenes/the-path-to-carcosa/the-last-king.webp')
  assert.equal(hemlockOverview('c03120', 'c03120')?.image, 'img/scenes/the-path-to-carcosa/return-to-echoes-of-the-past.webp')
  assert.equal(hemlockOverview('c03159', 'c03159')?.image, 'img/scenes/the-path-to-carcosa/the-unspeakable-oath.webp')
  assert.equal(hemlockOverview('c03200', 'c03200')?.image, 'img/scenes/the-path-to-carcosa/a-phantom-of-truth.webp')
  assert.equal(hemlockOverview('c03240', 'c03240')?.image, 'img/scenes/the-path-to-carcosa/the-pallid-mask-catacombs.webp')
  assert.equal(hemlockOverview('c03274', 'c03274')?.image, 'img/scenes/the-path-to-carcosa/black-stars-rise.webp')
  assert.equal(hemlockOverview('c03316', 'c03316')?.image, 'img/scenes/the-path-to-carcosa/return-to-dim-carcosa.webp')

  // Return to
  assert.equal(hemlockOverview('c52014', 'c03043')?.image, 'img/scenes/the-path-to-carcosa/return-to-curtain-call.webp')
  assert.equal(hemlockOverview('c52021', 'c52021')?.image, 'img/scenes/the-path-to-carcosa/the-last-king.webp')
  assert.equal(hemlockOverview('c52028', 'c03120')?.image, 'img/scenes/the-path-to-carcosa/return-to-echoes-of-the-past.webp')
  assert.equal(hemlockOverview('c52034', 'c52034')?.image, 'img/scenes/the-path-to-carcosa/the-unspeakable-oath.webp')
  assert.equal(hemlockOverview('c52040', 'c52040')?.image, 'img/scenes/the-path-to-carcosa/a-phantom-of-truth.webp')
  assert.equal(hemlockOverview('c52048', 'c52048')?.image, 'img/scenes/the-path-to-carcosa/the-pallid-mask-catacombs.webp')
  assert.equal(hemlockOverview('c52054', 'c52054')?.image, 'img/scenes/the-path-to-carcosa/black-stars-rise.webp')
  assert.equal(hemlockOverview('c52059', 'c03316')?.image, 'img/scenes/the-path-to-carcosa/return-to-dim-carcosa.webp')

  // The Pallid Mask: grid grows during play, so sprites instead of anchors
  for (const id of ['c03240', 'c52048']) {
    assert.equal(hemlockOverview(id, id)?.islands, 'img/scenes/the-path-to-carcosa/pallid-mask')
    assert.equal(hemlockOverview(id, id)?.anchors, undefined)
  }

  // Curtain Call: Arkham Theatre anchors
  const curtainCall = hemlockOverview('c03043', 'c03043').anchors
  assert.deepEqual(hemlockVillagePosition('03049', curtainCall), [55, 66]) // Theatre
  assert.deepEqual(hemlockVillagePosition('03050', curtainCall), [16, 62]) // Lobby
  assert.deepEqual(hemlockVillagePosition('03051', curtainCall), [37, 50]) // Balcony
  assert.deepEqual(hemlockVillagePosition('03052', curtainCall), [80, 63]) // Backstage

  // The Last King: Ward Family Manor anchors
  const theLastKing = hemlockOverview('c03061', 'c03061').anchors
  assert.deepEqual(hemlockVillagePosition('03070', theLastKing), [50, 84]) // Foyer
  assert.deepEqual(hemlockVillagePosition('03074', theLastKing), [58, 36]) // Courtyard
  assert.deepEqual(hemlockVillagePosition('03072', theLastKing), [78, 62]) // Living Room
  assert.deepEqual(hemlockVillagePosition('03071', theLastKing), [24, 66]) // Ballroom
  assert.deepEqual(hemlockVillagePosition('03075', theLastKing), [22, 22]) // Dining Room
  assert.deepEqual(hemlockVillagePosition('03073', theLastKing), [82, 18]) // Gallery

  // Echoes of the Past: 3-floor Georgian manor cutaway anchors
  const echoes = hemlockOverview('c03120', 'c03120').anchors
  assert.deepEqual(hemlockVillagePosition('03127', echoes), [48, 65]) // Entry Hall
  assert.deepEqual(hemlockVillagePosition('03131', echoes), [49, 43]) // Quiet Halls (2nd Floor)
  assert.deepEqual(hemlockVillagePosition('03135', echoes), [49, 23]) // Quiet Halls (3rd Floor)
  assert.deepEqual(hemlockVillagePosition('03139', echoes), [92, 42]) // Hidden Library
  assert.deepEqual(hemlockVillagePosition('', echoes, 'groundFloor1'), [22, 65])
  assert.deepEqual(hemlockVillagePosition('', echoes, 'groundFloor2'), [76, 65])
  assert.deepEqual(hemlockVillagePosition('', echoes, 'secondFloor1'), [25, 43])
  assert.deepEqual(hemlockVillagePosition('', echoes, 'secondFloor2'), [73, 43])
  assert.deepEqual(hemlockVillagePosition('', echoes, 'thirdFloor1'), [26, 24])
  assert.deepEqual(hemlockVillagePosition('', echoes, 'thirdFloor2'), [72, 24])

  // The Unspeakable Oath: Arkham Asylum cutaway anchors
  const asylum = hemlockOverview('c03159', 'c03159').anchors
  assert.deepEqual(hemlockVillagePosition('03172', asylum), [11, 55]) // Kitchen
  assert.deepEqual(hemlockVillagePosition('03173', asylum), [29, 55]) // Mess Hall
  assert.deepEqual(hemlockVillagePosition('03174', asylum), [86, 55]) // Infirmary
  assert.deepEqual(hemlockVillagePosition('03175', asylum), [74, 26]) // Yard
  assert.deepEqual(hemlockVillagePosition('03176', asylum), [25, 26]) // Garden
  assert.deepEqual(hemlockVillagePosition('03177', asylum), [51, 88]) // Basement Hall
  assert.deepEqual(hemlockVillagePosition('', asylum, 'patientConfinement1'), [15, 73])
  assert.deepEqual(hemlockVillagePosition('', asylum, 'patientConfinement3'), [15, 93])
  assert.deepEqual(hemlockVillagePosition('', asylum, 'patientConfinement4'), [85, 93])
  assert.deepEqual(hemlockVillagePosition('', asylum, 'patientConfinement2'), [85, 73])

  // A Phantom of Truth: Paris anchors
  const paris = hemlockOverview('c03200', 'c03200').anchors
  assert.deepEqual(hemlockVillagePosition('03211', paris), [10, 16]) // Grand Guignol
  assert.deepEqual(hemlockVillagePosition('03212', paris), [21, 41]) // Opéra Garnier
  assert.deepEqual(hemlockVillagePosition('03214', paris), [12, 74]) // Gare d'Orsay
  assert.deepEqual(hemlockVillagePosition('03209', paris), [38, 18]) // Montmartre
  assert.deepEqual(hemlockVillagePosition('03217', paris), [68, 38]) // Le Marais
  assert.deepEqual(hemlockVillagePosition('03219', paris), [74, 71]) // Notre-Dame
  assert.deepEqual(hemlockVillagePosition('03220', paris), [52, 57]) // Gardens of Luxembourg
  assert.deepEqual(hemlockVillagePosition('03216', paris), [68, 16]) // Canal Saint-Martin
  assert.deepEqual(hemlockVillagePosition('03215', paris), [88, 22]) // Père Lachaise Cemetery
  assert.deepEqual(hemlockVillagePosition('03208', paris), [42, 88]) // Montparnasse

  // Black Stars Rise: Mont Saint-Michel anchors
  const montSaintMichel = hemlockOverview('c03274', 'c03274').anchors
  assert.deepEqual(hemlockVillagePosition('03294', montSaintMichel), [31, 25]) // Cloister
  assert.deepEqual(hemlockVillagePosition('03295', montSaintMichel), [23, 39]) // Knights' Hall
  assert.deepEqual(hemlockVillagePosition('03287', montSaintMichel), [88, 32]) // North Tower
  assert.deepEqual(hemlockVillagePosition('03291', montSaintMichel), [40, 48]) // Abbey Church
  assert.deepEqual(hemlockVillagePosition('03285', montSaintMichel), [85, 57]) // Outer Wall
  assert.deepEqual(hemlockVillagePosition('03296', montSaintMichel), [11, 76]) // Chapel of St. Aubert
  assert.deepEqual(hemlockVillagePosition('03290', montSaintMichel), [45, 66]) // Broken Steps
  assert.deepEqual(hemlockVillagePosition('03292', montSaintMichel), [53, 33]) // Chœur Gothique
  assert.deepEqual(hemlockVillagePosition('03284', montSaintMichel), [72, 56]) // Grand Rue
  assert.deepEqual(hemlockVillagePosition('03298', montSaintMichel), [60, 8]) // Abbey Tower
  assert.deepEqual(hemlockVillagePosition('03283', montSaintMichel), [80, 90]) // Porte de l'Avancée
})

test('Both Curtain Call boards route private rooms from the doorway to their painted room', () => {
  const board = hemlockOverview('c03043', 'c03043')
  assert.deepEqual(board, hemlockOverview('c52014', 'c03043'))
  assert.equal(board.revealRoomAnchors, true)
  assert.equal(readFileSync(new URL(`../public/${board.image}`, import.meta.url)).toString('ascii', 8, 12), 'WEBP')
  const doors = [
    ['lobbyDoorway', ['03053', '03054', '03055', '52018']],
    ['backstageDoorway', ['03056', '03057', '03058', '52019']],
  ]
  const rooms = new Set()
  for (const [prefix, codes] of doors) {
    for (const code of codes) {
      const room = board.anchors[code]
      assert.ok(room, code)
      rooms.add(String(room))
      for (const slot of [1, 2, 3]) {
        const label = prefix + slot
        assert.deepEqual(hemlockVillagePosition(`c${code}`, board.anchors, label), board.anchors[label])
        assert.deepEqual(hemlockVillagePosition(`c${code}`, board.anchors, label, true), room)
        assert.notDeepEqual(board.anchors[label], room)
      }
    }
  }
  assert.equal(rooms.size, 8)
})

test('Both Echoes boards share the cutaway including the late Hidden Library', () => {
  assert.deepEqual(hemlockOverview('c03120', 'c03120'), hemlockOverview('c52028', 'c03120'))
})

test('Dim Carcosa keeps card variants in the same painted district when replaced', () => {
  const board = hemlockOverview('c03316', 'c03316')
  assert.deepEqual(board, hemlockOverview('c52059', 'c03316'))
  const variants = {
    shoresOfHali: ['03325a'],
    bleakPlains: ['03326a', '03326c'],
    ruinsOfCarcosa: ['03327a', '03327c', '03327e'],
    dimStreets: ['03328a', '03328c', '03328e'],
    depthsOfDemhe: ['03329a', '03329c'],
    darkSpires: ['03330'],
    palaceOfTheKing: ['03331', '52060'],
  }
  for (const [district, codes] of Object.entries(variants)) {
    assert.ok(board.anchors[district])
    for (const code of codes) {
      assert.deepEqual(hemlockVillagePosition(`c${code}`, board.anchors), board.anchors[district])
    }
  }
})

test('The Drowned City scenarios select their overview boards', () => {
  assert.equal(hemlockOverview('c11501', 'c11501')?.image, 'img/scenes/the-drowned-city/one-last-job.webp')
  assert.equal(hemlockOverview('c11517', 'c11517')?.image, 'img/scenes/the-drowned-city/the-western-wall.webp')
  assert.equal(hemlockOverview('c11536', 'c11536')?.image, 'img/scenes/the-drowned-city/the-drowned-quarter-reveal.webp')
  assert.equal(hemlockOverview('c11553', 'c11553')?.image, 'img/scenes/the-drowned-city/the-apiary.webp')
  assert.equal(hemlockOverview('c11587', 'c11587')?.image, 'img/scenes/the-drowned-city/the-grand-vault.webp')
  assert.equal(hemlockOverview('c11612', 'c11612')?.image, 'img/scenes/the-drowned-city/court-of-the-ancients.webp')
  assert.equal(hemlockOverview('c11639', 'c11639')?.image, 'img/scenes/the-drowned-city/obsidian-canyons-sky.webp')
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
  assert.deepEqual(hemlockVillagePosition('11572'), [50, 86]) // Central Chamber (Apiary)
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
  assert.deepEqual(hemlockVillagePosition('c04128', threadsOfFate), [18, 15]) // Train Tracks
  assert.deepEqual(hemlockVillagePosition('c04141', threadsOfFate), [86, 30]) // Velma's Diner
})

test('The Circle Undone scenarios select their overview boards', () => {
  assert.equal(hemlockOverview('c05043', 'c05043')?.image, 'img/scenes/the-circle-undone/return-to-the-twilight-estate.webp')
  assert.equal(hemlockOverview('c05050', 'c05050')?.image, 'img/scenes/the-circle-undone/the-witching-hour.webp')
  assert.equal(hemlockOverview('c05065', 'c05065')?.image, 'img/scenes/the-circle-undone/return-to-the-twilight-estate.webp')
  assert.equal(hemlockOverview('c05120', 'c05120')?.image, 'img/scenes/the-circle-undone/the-secret-name-house.webp')
  assert.equal(hemlockOverview('c05161', 'c05161')?.image, 'img/scenes/the-circle-undone/the-wages-of-sin.webp')
  assert.equal(hemlockOverview('c05197', 'c05197')?.image, 'img/scenes/the-circle-undone/return-to-for-the-greater-good.webp')
  assert.equal(hemlockOverview('c05238', 'c05238')?.image, 'img/scenes/the-circle-undone/union-and-disillusion.webp')
  assert.equal(hemlockOverview('c05284', 'c05284')?.image, 'img/scenes/the-circle-undone/in-the-clutches-of-chaos.webp')
  assert.equal(hemlockOverview('c05325', 'c05325')?.image, 'img/scenes/the-circle-undone/before-the-black-throne.webp')

  // Verify village anchors for key TCU locations
  assert.deepEqual(hemlockVillagePosition('05077'), [30, 22]) // Office (Twilight Estate)
  assert.deepEqual(hemlockVillagePosition('05084'), [30, 22]) // Office Spectral
  assert.deepEqual(hemlockVillagePosition('05055'), [50, 60]) // Witches' Circle
  assert.deepEqual(hemlockVillagePosition('05169'), [57, 22]) // The Gallows
  assert.deepEqual(hemlockVillagePosition('05216'), [88, 75]) // Inner Sanctum (Silver Twilight)
  assert.deepEqual(hemlockVillagePosition('05257'), [68, 75]) // The Geist-Trap
  assert.equal(hemlockVillagePosition('05333'), undefined) // Hideous Palace: the Cosmos follows its grid, not painted spots

  // In the Clutches of Chaos has its own Arkham anchors
  const chaos = hemlockOverview('c05284', 'c05284')?.anchors
  assert.ok(chaos)
  assert.deepEqual(hemlockVillagePosition('c05302', chaos), [13, 28]) // Hangman's Hill
  assert.deepEqual(hemlockVillagePosition('c05298', chaos), [20, 80]) // South Church
})

test('The Innsmouth Conspiracy scenarios select their overview boards', () => {
  assert.equal(hemlockOverview('c07041', 'c07041')?.image, 'img/scenes/the-innsmouth-conspiracy/pit-of-despair-caverns.webp')
  assert.equal(hemlockOverview('c07056', 'c07056')?.image, 'img/scenes/the-innsmouth-conspiracy/the-vanishing-of-elina-harper.webp')
  assert.equal(hemlockOverview('c07123', 'c07123')?.image, 'img/scenes/the-innsmouth-conspiracy/in-too-deep-early-tide.webp')
  assert.equal(hemlockOverview('c07163', 'c07163')?.image, 'img/scenes/the-innsmouth-conspiracy/devil-reef-sea.webp')
  assert.equal(hemlockOverview('c07198', 'c07198')?.image, 'img/scenes/the-innsmouth-conspiracy/horror-in-high-gear-moor.webp')
  assert.equal(hemlockOverview('c07231', 'c07231')?.image, 'img/scenes/the-innsmouth-conspiracy/a-light-in-the-fog-cliffs.webp')
  assert.equal(hemlockOverview('c07274', 'c07274')?.image, 'img/scenes/the-innsmouth-conspiracy/the-lair-of-dagon.webp')
  assert.equal(hemlockOverview('c07311', 'c07311')?.image, 'img/scenes/the-innsmouth-conspiracy/into-the-maelstrom-abyss.webp')

  // The four scenarios that place locations during play stand each on a sprite of its own, in the original and
  // in Return to, and keep no per-card anchor.
  const IC = 'img/scenes/the-innsmouth-conspiracy'
  const RT = ':return-to-the-innsmouth-conspiracy:'
  for (const [ids, folder, board] of [
    [['c07041', `c${RT}018`], 'pit', 'pit-of-despair-caverns'],
    [['c07311', `c${RT}048`], 'maelstrom', 'into-the-maelstrom-abyss'],
    [['c07231', `c${RT}039`], 'fog', 'a-light-in-the-fog-cliffs'],
    [['c07198', `c${RT}035`], 'high-gear', 'horror-in-high-gear-moor'],
  ]) {
    for (const id of ids) {
      const overview = hemlockOverview(id, id)
      assert.equal(overview?.islands, `${IC}/${folder}`, id)
      assert.equal(overview?.image, `${IC}/${board}.webp`, id)
      assert.equal(overview?.anchors, undefined, id)
    }
  }
  for (const code of ['07047', '07052', '07102', '07203', '07209', '07239', '07252', '07319', '07329']) {
    assert.equal(hemlockVillagePosition(code), undefined, code)
  }
  // Verify village anchors for key TIC locations
  assert.deepEqual(hemlockVillagePosition('07065'), [47, 54]) // Innsmouth Square
  assert.deepEqual(hemlockVillagePosition('07068'), [64, 51]) // Fish Street Bridge
  // Devil Reef follows its growing grid, so its locations have no painted spot.
  assert.equal(hemlockVillagePosition('07168'), undefined) // Churning Waters
  assert.equal(hemlockVillagePosition('07171'), undefined) // Waveworn Island
  assert.deepEqual(hemlockVillagePosition('07289'), [50, 18]) // Hall of Silence
  assert.deepEqual(hemlockVillagePosition('07283'), [50, 68]) // Grand Entryway
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

test('Spreading Flames follows agenda narration even after the bedroom and Fire! leave play', () => {
  const room = { id: 'room', cardCode: 'c12113', modifiers: [] }
  const library = { id: 'library', cardCode: 'c12120', modifiers: [] }
  const attachedFire = (location) => ({
    fire: { cardCode: 'c12129', placement: { tag: 'AttachedToLocation', contents: location.id } },
  })
  const overview = (step, flipped, locations, treacheries = {}) => hemlockOverview(
    'c12105', '12105', null, [], locations.map(({ cardCode }) => cardCode), null,
    spreadingFlamesFire([{ sequence: { step, side: flipped ? 'B' : 'A' }, flipped }], locations, treacheries),
  )
  const before = overview(1, false, [room])
  const burning = overview(1, false, [room], attachedFire(room))
  const ignition = overview(1, true, [room])
  const dorm = overview(2, false, [library], attachedFire(library))
  const escalation = overview(2, true, [library])
  const campus = overview(3, false, [library])
  assert.equal(before.image, 'img/scenes/brethren-of-ash/spreading-flames.webp')
  assert.equal(burning.image, 'img/scenes/brethren-of-ash/spreading-flames-burning.webp')
  assert.equal(ignition.image, 'img/scenes/brethren-of-ash/spreading-flames-dorm-fire.webp')
  assert.equal(dorm.image, ignition.image)
  assert.equal(campus.image, 'img/scenes/brethren-of-ash/spreading-flames-campus-fire.webp')
  assert.equal(escalation.image, campus.image)
  assert.equal(overview(1, false, [room], attachedFire(library)).image, before.image)
  for (const board of [before, burning, dorm, campus]) {
    assert.equal(readFileSync(new URL(`../public/${board.image}`, import.meta.url)).toString('ascii', 8, 12), 'WEBP')
    assert.deepEqual(hemlockVillagePosition('c12113', board.anchors), [14, 65])
    assert.deepEqual(hemlockVillagePosition('c12117', board.anchors), [29, 42])
  }
})

test('Chapter 2 overview maps and location positions', () => {
  // Brethren of Ash
  assert.equal(hemlockOverview('12105', '12105')?.image, 'img/scenes/brethren-of-ash/spreading-flames.webp')
  assert.equal(hemlockOverview('12133', '12133')?.image, 'img/scenes/brethren-of-ash/smoke-and-mirrors.webp')
  assert.equal(hemlockOverview('12168', '12168')?.image, 'img/scenes/brethren-of-ash/queen-of-ash.webp')

  // Children of Blood
  assert.equal(hemlockOverview('13001', '13001')?.image, 'img/scenes/children-of-blood/river-of-blood-day.webp')
  assert.equal(hemlockOverview('13031', '13031')?.image, 'img/scenes/children-of-blood/new-horizons-factory.webp')
  assert.equal(hemlockOverview('13068', '13068')?.image, 'img/scenes/children-of-blood/blood-money.webp')

  // Side Story: Traces to Nowhere
  assert.equal(hemlockOverview('73001', '73001')?.image, 'img/scenes/side-stories/traces-to-nowhere.webp')

  // Locations
  assert.deepEqual(hemlockVillagePosition('12113'), [14, 65]) // Your Friend's Room
  assert.deepEqual(hemlockVillagePosition('12116'), [55, 47]) // Miskatonic Quad
  assert.deepEqual(hemlockVillagePosition('12117'), [29, 42]) // Dormitories
  assert.deepEqual(hemlockVillagePosition('12118'), [52, 81]) // Science Hall
  assert.deepEqual(hemlockVillagePosition('12119'), [79, 47]) // Warren Observatory
  assert.deepEqual(hemlockVillagePosition('12120'), [57, 27]) // Orne Library
  assert.deepEqual(hemlockVillagePosition('12149'), [18, 22]) // Northside
  assert.deepEqual(hemlockVillagePosition('12151'), [50, 48]) // Merchant District
})

test('Traces to Nowhere opens the city cutaway only while an Otherworld location is in play', () => {
  const snapshot = (codes) => hemlockOverview('c73001', '73001', null, [], codes)
  const city = ['c73028', 'c73031', 'c73033']
  for (const codes of [city, [...city, 'c73051'], [...city, 'c73050', 'c73051', 'c73052'], city]) {
    const board = snapshot(codes)
    const hasOtherworld = codes.includes('c73051')
    assert.equal(board.image, `img/scenes/side-stories/traces-to-nowhere${hasOtherworld ? '-otherworld' : ''}.webp`)
    assert.equal(readFileSync(new URL(`../public/${board.image}`, import.meta.url)).toString('ascii', 8, 12), 'WEBP')
    for (const code of codes) {
      const [, y] = hemlockVillagePosition(code, board.anchors)
      if (hasOtherworld) assert.equal(y >= 65, code.startsWith('c7305'))
    }
  }
})

test('agenda and location snapshots select the matching scenery and retain the same map geometry', () => {
  function snapshot(id, codes = [], step = 1, flipped = false, side = flipped ? 'B' : 'A') {
    const board = hemlockOverview(id, id, null, [], codes, null, 'none', false,
      [{ sequence: { step, side }, flipped }])
    assert.equal(readFileSync(new URL(`../public/${board.image}`, import.meta.url)).toString('ascii', 8, 12), 'WEBP')
    return board
  }
  const riverCodes = ['c13008', 'c13012', 'c13016']
  const river = [
    snapshot('13001', riverCodes, 1), snapshot('13001', riverCodes, 1, true),
    snapshot('13001', riverCodes, 2), snapshot('13001', riverCodes, 2, false, 'B'),
    snapshot('13001', riverCodes, 3), snapshot('13001', riverCodes, 3, true),
    snapshot('13001', riverCodes, 4), snapshot('13001', riverCodes, 1),
  ]
  assert.deepEqual(river.map(({ image }) => image.split('-').at(-1)), [
    'day.webp', 'night.webp', 'night.webp', 'day.webp', 'day.webp', 'night.webp', 'night.webp', 'day.webp',
  ])
  assert.equal(snapshot('13001', ['c13009', 'c13013']).image, 'img/scenes/children-of-blood/river-of-blood.webp')
  assert.match(snapshot('13001', ['c13009', 'c13013'], 2).image, /-night.webp$/)
  for (const board of river) assert.strictEqual(board.anchors, river[0].anchors)

  const closedDay = snapshot('13031', ['c13039', 'c13040'])
  const openDay = snapshot('13031', ['c13039', 'c13049'])
  const closedNight = snapshot('13031', ['c13044', 'c13045'])
  const openNight = snapshot('13031', ['c13044', 'c13050'])
  assert.match(closedDay.image, /new-horizons-factory.webp$/)
  assert.match(openDay.image, /new-horizons.webp$/)
  assert.match(closedNight.image, /new-horizons-factory-night.webp$/)
  assert.match(openNight.image, /new-horizons-night.webp$/)
  for (const board of [closedDay, closedNight, openDay, openNight]) {
    assert.strictEqual(board.anchors, closedDay.anchors)
    assert.equal(board.revealRoomAnchors, true)
    assert.equal(board.layoutArt ?? board.image.slice(11, -5), 'children-of-blood/new-horizons')
  }
  assert.match(snapshot('13068', ['c13076b']).image, /-bloody-night.webp$/)
  assert.match(snapshot('13068', ['c13076']).image, /blood-money.webp$/)

  for (const id of ['05161', 'c54034']) {
    assert.match(snapshot(id, ['c05167'], 1).image, /the-wages-of-sin.webp$/)
    assert.equal(snapshot(id, ['c05167'], 1).spectralPlaces, undefined)
    const mixed = snapshot(id, ['c05167b', 'c05168'], 1)
    assert.equal(mixed.spectralPlaces.mask.match(/radial-gradient/g).length, 1)
    assert.match(mixed.spectralPlaces.image, /-spectral.webp$/)
    assert.match(snapshot(id, ['c05167b'], 1, true).image, /the-wages-of-sin-spectral.webp$/)
    assert.equal(snapshot(id, ['c05167b'], 2).spectralPlaces, undefined)
    assert.match(snapshot(id, ['c05167b'], 2).image, /the-wages-of-sin-spectral.webp$/)
    assert.deepEqual(hemlockVillagePosition('c05175b'), [84, 40])
    assert.deepEqual(hemlockVillagePosition('c05173b'), [86, 83])
  }
  for (const id of ['07123', 'c:return-to-the-innsmouth-conspiracy:028']) {
    const stages = [snapshot(id), snapshot(id, [], 1, true), snapshot(id, [], 2, true), snapshot(id, [], 3, true)]
    assert.deepEqual(stages.map(({ image }) => image.split('/').at(-1)), [
      'in-too-deep-early-tide.webp', 'in-too-deep.webp', 'in-too-deep-midtown-tide.webp', 'in-too-deep-high-tide.webp',
    ])
    assert.ok(stages.every(({ layoutArt, image }) =>
      (layoutArt ?? image.slice(11, -5)) === 'the-innsmouth-conspiracy/in-too-deep'))
  }
})

test('Cthulhu ruins only the districts whose replacement locations are present', () => {
  const snapshot = (codes) => hemlockOverview('11688a', '11688a', null, [], codes)
  assert.equal(snapshot(['c11696', 'c01134', 'c01130']).ruinedDistricts, undefined)
  const once = snapshot(['c11696', 'c11694', 'c01134'])
  assert.match(once.ruinedDistricts.image, /part-2-ruined.webp$/)
  assert.equal(once.ruinedDistricts.mask.match(/radial-gradient/g).length, 1)
  assert.match(once.ruinedDistricts.mask, /88% 41%/)
  const twice = snapshot(['c11694', 'c11697'])
  assert.equal(twice.ruinedDistricts.mask.match(/radial-gradient/g).length, 2)
  assert.equal(snapshot(['c11696', 'c01134', 'c01130']).ruinedDistricts, undefined)
  assert.equal(readFileSync(new URL(`../public/${once.ruinedDistricts.image}`, import.meta.url)).toString('ascii', 8, 12), 'WEBP')
})

test('The Secret Name replaces the boarding house with the current Otherworld panorama', () => {
  const board = (id, codes) => hemlockOverview(id, id, null, [], codes)
  for (const id of ['05120', '54029']) {
    const house = board(id, ['c05128', 'c05132'])
    const otherworld = board(id, ['c05133', 'c05142'])
    assert.match(house.image, /the-secret-name-house.webp$/)
    assert.equal(otherworld.image, `img/scenes/the-circle-undone/the-secret-name-${id === '54029' ? 'return-' : ''}otherworld.webp`)
    for (const state of [house, otherworld]) {
      assert.equal(readFileSync(new URL(`../public/${state.image}`, import.meta.url)).toString('ascii', 8, 12), 'WEBP')
    }
    assert.notEqual(house.layoutArt, otherworld.layoutArt)
  }
  const locations = [
    { id: 'room', cardCode: 'c05133', revealed: true },
    { id: 'door', cardCode: 'c05138', revealed: false },
    { id: 'a', cardCode: 'c05142', revealed: true },
    { id: 'b', cardCode: 'c05142', revealed: true },
    { id: 'city', cardCode: 'c05136', revealed: true },
  ]
  const grid = { room: [50, 50], door: [60, 70], a: [95, 40], b: [95, 80], city: [30, 30] }
  const positions = revealedScenePositions('05120', locations, grid)
  assert.deepEqual(positions.room, [48, 58])
  assert.notDeepEqual(positions.a, positions.b)
  assert.equal(new Set(Object.values(positions).map((p) => p.join(','))).size, locations.length)
  const reversed = revealedScenePositions('05120', [...locations].reverse(), grid)
  assert.deepEqual(positions, reversed)
  const revealed = revealedScenePositions('05120', locations.map((l) =>
    l.id === 'door' ? { ...l, revealed: true } : l), grid)
  assert.deepEqual(revealed.door, [33, 92])
  const extraCodes = ['54030', '54031', '54032', '54033']
  const extras = extraCodes.map((cardCode) => ({ id: cardCode, cardCode, revealed: true }))
  const extraGrid = Object.fromEntries(extras.map(({ id }, i) => [id, [i * 20, 90]]))
  const returnPositions = revealedScenePositions('54029', [...locations, ...extras], { ...grid, ...extraGrid })
  for (const code of extraCodes) assert.ok(returnPositions[code])
  assert.equal(new Set(Object.values(returnPositions).map((p) => p.join(','))).size, locations.length + extras.length)
})

test('repainted scenes cover all coexisting locations with distinct anchors', () => {
  const scenes = [
    ['13068', [13076, 13077, 13078, 13079, 13080, 13081, 13082]],
    ['13001', [13008, 13010, 13012, 13014, 13016, 13018, 13020, 13022]],
    ['13031', [13039, 13040, 13041, 13042, 13043, 13049, 13051, 13052, 13053, 13054]],
    ['06063', [6070, 6071, 6072, 6073, 6074, 6075, 6076, 6077]],
    ['71001', Array.from({ length: 8 }, (_, i) => i + 71007)],
    ['86001', Array.from({ length: 11 }, (_, i) => i + 86014)],
    ['81001', Array.from({ length: 12 }, (_, i) => i + 81007)],
    ['88001b', Array.from({ length: 14 }, (_, i) => i + 88009)],
    ['11688a', Array.from({ length: 9 }, (_, i) => i + 11692)],
  ]
  for (const [id, codes] of scenes) {
    const board = hemlockOverview(id, id)
    const points = codes.map((code) => {
      const key = String(code).padStart(5, '0')
      assert.ok(board.anchors[key], `${id}: missing ${key}`)
      return board.anchors[key].join(',')
    })
    assert.equal(new Set(points).size, codes.length, `${id}: shared anchor`)
  }
  const doom = hemlockOverview('11688a', '11688a').anchors
  assert.deepEqual(hemlockVillagePosition('01132', doom, 'easttown'), hemlockVillagePosition('11694', doom))
  const factory = hemlockOverview('13031', '13031')
  assert.notDeepEqual(hemlockVillagePosition('13052', factory.anchors, 'sideChamber2'),
    hemlockVillagePosition('13052', factory.anchors, 'sideChamber2', factory.revealRoomAnchors))
  const gala = hemlockOverview('71001', '71001')
  assert.notDeepEqual(hemlockVillagePosition('71011', gala.anchors, 'groundFloor1'),
    hemlockVillagePosition('71011', gala.anchors, 'groundFloor1', gala.revealRoomAnchors))
})

test('Standalone / Side Stories select their overview boards and location positions', () => {
  const standalones = [
    { id: '81001', img: 'img/scenes/side-stories/curse-of-the-rougarou.webp' },
    { id: '82001', img: 'img/scenes/side-stories/carnevale-of-horrors.webp' },
    { id: '88001', img: 'img/scenes/side-stories/fortune-and-folly.webp' },
    { id: '88001b', img: 'img/scenes/side-stories/fortune-and-folly.webp' },
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
  assert.deepEqual(hemlockVillagePosition('81008', rougarou?.anchors), [16, 24])

  const carnevale = hemlockOverview('82001', 'reference')
  assert.deepEqual(hemlockVillagePosition('82011', carnevale?.anchors), [20, 26])

  const fortune = hemlockOverview('88001', 'reference')
  assert.deepEqual(hemlockVillagePosition('88011', fortune?.anchors), [57, 65])
})

test('In Too Deep plates run west to east from left to right in every row', () => {
  // The scenario's grid rows, west to east (Skull counts locations east of you, Cultist pushes you east).
  const rows = [
    ['07142', '07129', '07134', '07141', '07132'],
    ['07135', '07137', '07139', '07136', '07138'],
    ['07130', '07140', '07133', '07131', '07143'],
  ]
  for (const row of rows) {
    const xs = row.map((code) => hemlockVillagePosition(code)[0])
    assert.deepEqual([...xs].sort((a, b) => a - b), xs, `row ${row.join(', ')} drawn as x ${xs.join(', ')}`)
  }
})

test('Island boards: Before the Black Throne and Devil Reef stand each location on its own sprite', () => {
  assert.equal(hemlockOverview('c05325', 'c05325')?.islands, 'img/scenes/the-circle-undone/cosmos')
  assert.equal(hemlockOverview('c54056', 'c05325')?.islands, 'img/scenes/the-circle-undone/cosmos')
  assert.equal(hemlockOverview('c05284', 'c05284')?.islands, undefined)
  assert.equal(hemlockOverview('c07163', 'c07163')?.islands, 'img/scenes/the-innsmouth-conspiracy/devil-reef')
  const returnTo = hemlockOverview('c:return-to-the-innsmouth-conspiracy:031', 'c:return-to-the-innsmouth-conspiracy:031')
  assert.equal(returnTo?.islands, 'img/scenes/the-innsmouth-conspiracy/devil-reef')
  assert.equal(returnTo?.image, 'img/scenes/the-innsmouth-conspiracy/devil-reef-sea.webp')
})
