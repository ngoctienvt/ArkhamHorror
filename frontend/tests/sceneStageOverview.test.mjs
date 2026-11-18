import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

const cache = new Map()
function moduleUrl(name) {
  if (cache.has(name)) return cache.get(name)
  const source = readFileSync(new URL(`../src/arkham/${name}.ts`, import.meta.url), 'utf8')
  const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
    .replace(/from ['"]\.\/([^'"]+)['"]/g, (_, imported) => `from ${JSON.stringify(moduleUrl(imported))}`)
  const url = 'data:text/javascript;base64,' + Buffer.from(js).toString('base64')
  cache.set(name, url)
  return url
}
const { stageOverview: selectStageOverview } = await import(moduleUrl('scene-stage-overview'))
function stageOverview(base, state) {
  const board = selectStageOverview(base, state)
  if (board) for (const file of [board.image, board.tileBack,
    ...Object.values(board.tileImages ?? {}), ...(board.layers ?? []).map((layer) => layer.image),
    ...(board.figures ?? []).map((figure) => figure.image)].filter(Boolean)) {
    if (file === 'img/scenes/base.webp') continue
    assert.ok(existsSync(new URL(`../public/${file}`, import.meta.url)), `Missing selected scene asset: ${file}`)
  }
  return board
}
const { sceneSharedReference } = await import(moduleUrl('scene-shared-reference'))
const base = { image: 'img/scenes/base.webp', village: true, fixedPassages: false }
const location = (code, label = code, revealed = true) => ({
  id: label, cardCode: code, label, revealed, enemyLocation: false,
  placement: null, tokens: {}, connectedLocations: [],
})
const snapshot = (id, locations = [], extra = {}) => ({
  id, locations, layout: [], acts: [], agendas: [], enemies: [], meta: {}, ...extra,
})

test('Zann keeps shuffled rooms in their public slots and hides private furnishings', () => {
  const pack = ':the-symphony-of-erich-zann:'
  const front = ['009', '010', '011', '012'].map((code) => location(pack + code))
  const initial = snapshot(pack + '001', front)
  assert.match(stageOverview(base, initial).image, /theatre-closed.webp$/)
  const rooms = ['013', '014', '015', '018'].map((code, i) => location(pack + code, `backstage${i + 1}`, false))
  const state = { ...initial, locations: [...front, location(pack + '019'), ...rooms] }
  const hidden = stageOverview(base, state)
  assert.match(hidden.image, /theatre-open.webp$/)
  assert.equal(hidden.layers.length, 0)
  const shown = stageOverview(base, { ...state, locations: state.locations.map((room) => ({ ...room, revealed: true })) })
  assert.equal(shown.layers.length, 4)
  assert.deepEqual(shown.positions.backstage1, hidden.positions.backstage1)
  assert.ok(shown.layers.some((layer) => layer.image.endsWith('/013.webp')))
  const removed = stageOverview(base, { ...state, locations: state.locations.filter((room) => room.label !== 'backstage2') })
  assert.equal(removed.positions.backstage2, undefined)
  assert.match(removed.layers.at(-1).image, /theatre-voids/)
  assert.equal(stageOverview(base, state).layers.length, 0)
  const lost = stageOverview(base, { ...initial, acts: [{ sequence: { number: 3, side: 'A' } }] })
  assert.match(lost.image, /theatre-open/)
  assert.match(lost.layers.at(-1).image, /theatre-voids/)
})

test('Alaska remains visible when the lair opens and restores on undo', () => {
  const locations = ['09617', '09618', '09619', '09620', '09621', '09622', '09623', '09624'].map((code) => location(code))
  const before = stageOverview(base, snapshot('09609', locations))
  const after = stageOverview(base, snapshot('09609', [...locations, location('09615b')]))
  assert.match(before.image, /on-thin-ice-region/)
  assert.match(after.image, /on-thin-ice-lair/)
  for (const place of locations) assert.deepEqual(before.positions[place.id], after.positions[place.id])
  assert.equal(after.layoutArt, before.layoutArt)
  assert.equal(stageOverview(base, snapshot('09609', locations)).image, before.image)
})

test('End of Seasons expands the restaurant and keeps the ballroom fire after the dining-room flip', () => {
  const pack = ':night-of-vespers:'
  const make = (codes, acts = []) => stageOverview(base, snapshot(pack + '001', codes.map((code) => location(pack + code)), { acts }))
  assert.match(make(['008']).image, /trattoria.webp$/)
  assert.match(make(['008b']).image, /trattoria-brutta/)
  assert.match(make(['008', '013', '017']).image, /restaurant-wing.webp$/)
  assert.match(make(['008', '009']).image, /hotel.webp$/)
  const fire = make(['008b', '013'], [{ sequence: { number: 2, side: 'B' } }])
  assert.match(fire.image, /restaurant-wing-inferno/)
  assert.match(fire.layers[0].image, /restaurant-wing-brutta/)
  assert.match(make(['008', '009'], [{ sequence: { number: 3, side: 'A' } }]).image, /hotel-inferno/)
  assert.match(make(['008', '013']).image, /restaurant-wing.webp$/)
})

test('Yoth tracks current depth through descent and reset for original and Return to', () => {
  for (const id of ['04277', '53059']) for (const [depth, ending] of [[1, '-upper'], [3, '-middle'], [5, ''], [2, '-upper']]) {
    const board = stageOverview(base, snapshot(id, [], { counts: { CurrentDepth: depth } }))
    assert.ok(board.image.endsWith(`the-depths-of-yoth${ending}.webp`))
  }
})

test('police station respects hidden Return to identity and preserves the burned house', () => {
  const make = (revealed) => stageOverview(base, snapshot('50025', [location('50027', 'easttown', revealed)]))
  assert.equal(make(false).image, base.image)
  assert.match(make(true).image, /midnight-masks-police/)
  const burned = { ...base, image: 'img/scenes/night-of-the-zealot/midnight-masks-burned.webp' }
  const board = stageOverview(burned, snapshot('90032', [location('90036')]))
  assert.match(board.image, /midnight-masks-police/)
  assert.equal(board.layers[0].image, burned.image)
  assert.deepEqual(board.positions['90036'], [78, 43])
})

test('Circus backstage basement rooms open from the public location set and undo seals them again', () => {
  const pack = ':circus-ex-mortis:'
  const make = (codes) => stageOverview(base, snapshot(pack + '122', codes.map((code) => location(pack + code))))
  assert.match(make(['129', '130']).image, /bacchanalia-sealed/)
  assert.equal(make(['129', '130']).layers, undefined)
  assert.match(make(['129', '135', '136', '137']).layers[0].image, /bacchanalia.webp$/)
  assert.equal(make(['129', '130']).layers, undefined)
})

test('challenge scenes reuse their physical place and recognize Relics replacement codes', () => {
  for (const [id, parent] of Object.entries({ '90004': '02041', '90011': '02062', '90020': '04113',
    '90032': '01120', '90041': '07056', '90054': '05161', '90065': '04054', '90094': '03043', ':dark-matter:190': '03043' })) {
    assert.equal(sceneSharedReference(`c${id}`), parent)
  }
  const board = stageOverview(base, snapshot('90065'))
  assert.deepEqual(board.anchors['90070'], [82, 82])
  assert.deepEqual(board.anchors['90071'], [50, 84])
  assert.equal(board.image, base.image)
})

test('Electric Nightmare moves room art with each current grid slot, including switch and undo', () => {
  const a = location(':dark-matter:070', 'pos0000')
  const b = location(':dark-matter:074', 'pos0100')
  const initial = snapshot(':dark-matter:054', [a, b], { layout: ['pos0000 pos0100'] })
  const before = stageOverview(base, initial)
  const after = stageOverview(base, { ...initial, locations: [{ ...a, label: b.label }, { ...b, label: a.label }] })
  assert.equal(before.tileImages[a.id], after.tileImages[a.id])
  assert.notEqual(before.tileImages[a.id], before.tileImages[b.id])
  const hidden = stageOverview(base, { ...initial, locations: [{ ...a, revealed: false }, { ...b, revealed: false }] })
  assert.equal(hidden.tileImages[a.id], hidden.tileImages[b.id])
  assert.equal(stageOverview(base, initial).image, before.image)
})

test('Lost Quantum only settles when Quantum Zeno has stabilized all eight Elbrus locations', () => {
  const locations = Array.from({ length: 8 }, (_, i) => ({ ...location(`:dark-matter:${String(96 + i).padStart(3, '0')}`), tokens: { resource: 1 } }))
  const stable = snapshot(':dark-matter:089', locations, { acts: [{ id: ':dark-matter:092', sequence: { number: 2, side: 'A' } }] })
  assert.match(stageOverview(base, stable).image, /lost-quantum-stable/)
  assert.match(stageOverview(base, { ...stable, locations: locations.slice(1) }).image, /lost-quantum.webp$/)
  assert.match(stageOverview(base, { ...stable, acts: [{ id: ':dark-matter:093', sequence: { number: 2, side: 'A' } }] }).image, /lost-quantum.webp$/)
  const undone = { ...stable, locations: locations.map((location, index) => index ? location : { ...location, tokens: {} }) }
  assert.match(stageOverview(base, undone).image, /lost-quantum.webp$/)
})

test('Ages school starts with Featureless Streets and follows present locations independently of the past act deck', () => {
  const pack = ':ages-unwound:'
  const acts = [{ deckId: 2, sequence: { number: 4, side: 'B' } }]
  const before = snapshot(pack + '155', [location(pack + '168')], { acts })
  assert.match(stageOverview(base, before).image, /featureless-streets/)
  const after = stageOverview(base, snapshot(pack + '155', [location(pack + '169'), location(pack + '172')], { acts }))
  assert.match(after.image, /school-sealed/)
  assert.equal(after.layers, undefined)
  assert.match(stageOverview(base, before).image, /featureless-streets/)
})

test('all three temporal Ritual Circles can coexist, while hidden classrooms stay undisclosed', () => {
  const pack = ':ages-unwound:'
  const codes = ['173', '224', '225', '227', '228', '229']
  const state = snapshot(pack + '155', codes.map((code) => location(pack + code, code, false)))
  const hidden = stageOverview(base, state)
  assert.equal(hidden.layers.length, 1)
  assert.equal((decodeURIComponent(hidden.layers[0].mask).match(/<polygon/g) ?? []).length, 3)
  assert.equal(new Set(codes.map((code) => hidden.anchors[pack + code].join(','))).size, 6)
  const revealed = stageOverview(base, { ...state, locations: state.locations.map((room) => ({ ...room, revealed: true })) })
  assert.equal((decodeURIComponent(revealed.layers[0].mask).match(/<polygon/g) ?? []).length, 6)
})

test('Time Runs Out removes old location art when a card leaves and supports actual Paradox locations', () => {
  const pack = ':ages-unwound:'
  const a = location(pack + '189', 'circle')
  const b = location(pack + '191', 'square')
  const before = stageOverview(base, snapshot(pack + '182', [a, b]))
  const paired = stageOverview(base, snapshot(pack + '182', [location(pack + '190', 'circle')]))
  assert.equal(paired.tileImages.circle, before.tileImages.circle)
  const after = stageOverview(base, snapshot(pack + '182', [location(pack + '202b', 'hourglass')]))
  assert.equal(after.tileImages.circle, undefined)
  assert.equal(after.tileImages.square, undefined)
  assert.match(after.tileImages.hourglass, /202b.webp$/)
  assert.equal(stageOverview(base, snapshot(pack + '182', [a, b])).tileImages.circle, before.tileImages.circle)
})

test('Night of Fire provisional points depend on public badges, not unrevealed identity', () => {
  const make = (code) => stageOverview(base, snapshot(':ages-unwound:001', [location(`:ages-unwound:${code}`, 'moon', false)]))
  assert.deepEqual(make('010').positions.moon, make('013').positions.moon)
})

test('A Year to Plan keeps the world and independently opens the London library and Paris realm', () => {
  const pack = ':ages-unwound:'
  const make = (codes) => stageOverview(base, snapshot(pack + '105', codes.map((code) => location(pack + code))))
  const before = make(['114', '115'])
  assert.equal(before.layers, undefined)
  assert.equal((decodeURIComponent(make(['114', '143']).layers[0].mask).match(/<polygon/g) ?? []).length, 1)
  const both = make(['114', '115', '142', '143'])
  assert.equal((decodeURIComponent(both.layers[0].mask).match(/<polygon/g) ?? []).length, 2)
  assert.deepEqual(both.anchors[pack + '114'], before.anchors[pack + '114'])
  assert.notDeepEqual(both.anchors[pack + '143'], both.anchors[pack + '114'])
  assert.equal(make(['114', '115']).layers, undefined)
})

test('Fatal Mirage keeps all nineteen memory illustrations distinct and hides unknown memories', () => {
  const memories = Array.from({ length: 19 }, (_, i) => location(String(8556 + i).padStart(5, '0')))
  const board = stageOverview(base, snapshot('08549', memories))
  assert.equal(new Set(Object.values(board.tileImages)).size, 19)
  const hidden = stageOverview(base, snapshot('08549', memories.map((room) => ({ ...room, revealed: false }))))
  assert.equal(new Set(Object.values(hidden.tileImages)).size, 1)
  assert.equal(stageOverview(base, snapshot('08549', [])).tileImages['08568'], undefined)
})

test('Court archives can share a printed illustration while remaining separate places on different floors', () => {
  const state = snapshot('11612', [location('11624', 'pos0001'), location('11625', 'pos0202'), location('11622', 'pos0100')])
  const before = stageOverview(base, state)
  assert.ok(before.islands)
  assert.equal(before.tileImages.pos0001, before.tileImages.pos0202)
  assert.equal(Object.keys(before.tileImages).length, 3)
  const moved = stageOverview(base, { ...state, locations: [...state.locations.slice(0, 2), { ...state.locations[2], label: 'pos0103', cardCode: '11622b' }] })
  assert.equal(moved.tileImages.pos0100, before.tileImages.pos0100)
  assert.equal(moved.anchors && Object.keys(moved.anchors).length, 0)
})

test('Grand Vault platform art follows its id through swaps and duplicate cisterns stay separate', () => {
  const platform = location('11594', 'pos0101')
  const first = location('11596', 'pos0201')
  const second = location('11596', 'pos0301')
  const state = snapshot('11587', [platform, first, second])
  const before = stageOverview(base, state)
  assert.equal(Object.keys(before.tileImages).length, 3)
  const after = stageOverview(base, { ...state, locations: [{ ...platform, label: first.label }, { ...first, label: platform.label }, second] })
  assert.equal(after.tileImages[platform.id], before.tileImages[platform.id])
  assert.notEqual(after.tileImages[platform.id], after.tileImages[first.id])
  assert.equal(after.tileImages[first.id], after.tileImages[second.id])
})

test('Carnevale follows clockwise public slots and only changes to lagoon after the old ring leaves', () => {
  const city = [location('82008', 'location1'), location('82011', 'location2'), location('82009', 'location8')]
  const before = stageOverview(base, snapshot('82001', city))
  assert.ok(before.positions.location2[0] > before.positions.location1[0])
  assert.ok(before.positions.location8[0] < before.positions.location1[0])
  const shuffled = stageOverview(base, snapshot('82001', [{ ...city[1], cardCode: '82015' }]))
  assert.deepEqual(shuffled.positions.location2, before.positions.location2)
  const boat = location('82006b', 'gondola')
  assert.ok(stageOverview(base, snapshot('82001', [...city, boat])).islands)
  const departed = stageOverview(base, snapshot('82001', [boat]))
  assert.match(departed.image, /carnevale\/gondola.webp$/)
  assert.equal(departed.tileImages, undefined)
  assert.equal(departed.positions.location1, undefined)
  const beast = { id: 'cnidathqua', cardCode: '82027', asSelfLocation: 'cnidathqua', placement: { tag: 'AtLocation', contents: 'gondola' } }
  const attacked = stageOverview(base, snapshot('82001', [boat], { enemies: [beast] }))
  assert.match(attacked.figures[0].image, /cnidathqua.webp$/)
  assert.match(attacked.figures[0].mask, /transparent/)
  assert.equal(stageOverview(base, snapshot('82001', [boat], { enemies: [{ ...beast, placement: { tag: 'OutOfPlay' } }] })).figures, undefined)
  assert.ok(stageOverview(base, snapshot('82001', city)).islands)
})

test('War of the Outer Gods keeps all three cult regions and opens Hub only from its public location', () => {
  const state = snapshot('86001', ['86014', '86015', '86018', '86021'].map((code) => location(code)), {
    agendas: [{ sequence: { step: 3, side: 'B' } }, { sequence: { step: 1, side: 'A' } }],
  })
  const before = stageOverview(base, state)
  assert.match(before.image, /before-hub.webp$/)
  const after = stageOverview(base, { ...state, locations: [...state.locations, location('86024')] })
  assert.equal(after, base)
  assert.match(stageOverview(base, state).image, /before-hub.webp$/)
})

test('Circus ringmaster uses the public enemy entity and disappears when defeated', () => {
  const make = (cardCode, placement = { tag: 'AtLocations', contents: ['ring1', 'ring2', 'ring3'] }) => stageOverview(base,
    snapshot(':circus-ex-mortis:108', [], { enemies: [{ id: 'blake', cardCode, asSelfLocation: 'sylvesterBlake', placement }] }))
  assert.match(make(':circus-ex-mortis:118').figures[0].image, /118.webp$/)
  assert.match(make(':circus-ex-mortis:118b').figures[0].image, /118b.webp$/)
  assert.equal(make(':circus-ex-mortis:118b', { tag: 'OutOfPlay', contents: 'VictoryDisplayZone' }).figures, undefined)
})

test('Circus Dark Youngs keep their public grid corners independently of their defeated siblings', () => {
  const initial = snapshot(':circus-ex-mortis:040', [location(':circus-ex-mortis:047', 'pos0000')], {
    layout: ['posn0101 . pos0101', '. pos0000 .', 'posn01n01 . pos01n01'],
    enemies: [{ id: 'young', cardCode: ':circus-ex-mortis:065', asSelfLocation: 'posn0101', placement: { tag: 'InPosition', contents: { x: -1, y: 1 } } }],
  })
  const board = stageOverview(base, initial)
  assert.equal(board.figures.length, 1)
  assert.ok(board.figures[0].point[0] < board.positions.pos0000[0])
  assert.ok(board.figures[0].point[1] < board.positions.pos0000[1])
  assert.equal(stageOverview(base, { ...initial, enemies: [] }).figures.length, 0)
})

test('Red Sunrise preserves grouped row order and public Path Forward cells', () => {
  const state = snapshot(':circus-ex-mortis:153', [
    { ...location(':circus-ex-mortis:162', 'posn0101'), group: { key: 'row1', index: 1 } },
    { ...location(':circus-ex-mortis:166', 'pos0101'), group: { key: 'row1', index: 0 } },
  ], { layout: ['row1 row1 row1 row1 path1 path1'], stories: [{ id: 'path', placement: { tag: 'AsSelfLocation', contents: 'path1' }, flipped: true }] })
  const board = stageOverview(base, state)
  assert.ok(board.positions.pos0101[0] < board.positions.posn0101[0])
  assert.ok(board.figures[0].point[0] > board.positions.posn0101[0])
  const hidden = stageOverview(base, { ...state, locations: state.locations.map((room) => ({ ...room, revealed: false })) })
  assert.equal(hidden.tileImages.pos0101, hidden.tileImages.posn0101)
  assert.equal(stageOverview(base, { ...state, stories: [] }).figures.length, 0)
})

test('escape panorama follows location lifecycle through either advancement path and undo', () => {
  const before = snapshot('08648b', [location('08649'), location('08674')])
  assert.match(stageOverview(base, before).image, /facility-floor.webp$/)
  const after = stageOverview(base, snapshot('c08648b', [location('c08682', 'titanicRamp1')]))
  assert.match(after.image, /the-heart-of-madness-escape/)
  assert.equal(Object.keys(after.anchors).length, 6)
  assert.ok(after.anchors.theGateOfYquaa[0] < after.anchors.hiddenTunnel[0])
  assert.match(stageOverview(base, before).image, /facility-floor.webp$/)
})

test('Film Fatale selects each world and restores the studio after its locations leave', () => {
  for (const [code, suffix] of [['72027', 'cosmos'], ['72043', 'jungle'], ['72054', 'castle']]) {
    const board = stageOverview(base, snapshot('72001', [location(code)]))
    assert.ok(board.image.endsWith(`film-fatale-${suffix}.webp`))
  }
  assert.equal(stageOverview(base, snapshot('72001', [location('72008'), location('72009')])), base)
})

test('tidal cave phase supports original and Return to without retaining lodge anchors', () => {
  for (const id of ['07274', ':return-to-the-innsmouth-conspiracy:043']) {
    assert.equal(stageOverview(base, snapshot(id, [location('07283', 'grandEntryway')])), base)
    const board = stageOverview(base, snapshot(id, [location('07290', 'tidalTunnel3')]))
    assert.match(board.image, /dagon-caves/)
    assert.ok(board.islands)
    assert.deepEqual(board.anchors, {})
  }
})

test('Hive Mind scene requires its Central Chamber, rather than merely Act 2', () => {
  const pilgrims = snapshot('11553', [location('11559b'), location('11567')], {
    acts: [{ sequence: { number: 2, side: 'A' } }],
  })
  assert.match(stageOverview(base, pilgrims).image, /the-apiary-region/)
  const hive = stageOverview(base, snapshot('11553', [location('11572')]))
  assert.match(hive.image, /hive-mind/)
  assert.ok(hive.anchors['11569'][1] < hive.anchors['11572'][1])
  assert.ok(hive.anchors['11571'][1] > hive.anchors['11572'][1])
})

test('hidden dynamic locations use a common back independently of private identity', () => {
  const make = (code) => stageOverview(base, snapshot('72001', [location('72027'), location(code, 'hidden', false)]))
  assert.equal(make('72028').tileImages.hidden, make('72031').tileImages.hidden)
  assert.notEqual(make('72028').tileImages['72027'], make('72028').tileBack)
})

test('Unstuck follows clockwise slots after swaps while paired versions share only their art', () => {
  const initial = snapshot(':ages-unwound:062', [
    location(':ages-unwound:069', 'location1'), location(':ages-unwound:071', 'location5'),
  ])
  const before = stageOverview(base, initial)
  assert.ok(before.positions.location1[1] < before.positions.location5[1])
  const swapped = stageOverview(base, { ...initial, locations: [
    { ...initial.locations[0], label: 'location5' }, { ...initial.locations[1], label: 'location1' },
  ] })
  assert.deepEqual(swapped.positions.location1, before.positions.location5)
  assert.deepEqual(swapped.positions.location5, before.positions.location1)
  const alternate = stageOverview(base, snapshot(':ages-unwound:062', [location(':ages-unwound:070', 'location1')]))
  assert.equal(alternate.tileImages.location1, before.tileImages.location1)
})

test('Antarctic shuffled rooms follow slots and pylons collapse independently from public modifiers', () => {
  const left = location('08650', 'facility2')
  const right = location('08652', 'facility3')
  const pylon = { ...location('08674', 'facility1'), modifiers: [{ type: { tag: 'ScenarioModifier', contents: 'collapsed' } }] }
  const state = snapshot('08648b', [left, right, pylon], {
    layout: ['. facility1 .', 'facility2 facility1 facility3', 'facility2 . facility3'],
  })
  const board = stageOverview(base, state)
  assert.equal(board.positions.facility1[0], 50)
  assert.ok(Math.abs(board.positions.facility1[1] - 100 / 3) < 1e-10)
  assert.ok(board.positions.facility2[0] < board.positions.facility3[0])
  assert.match(board.tileImages.facility1, /pylon-collapsed.webp$/)
  const reset = stageOverview(base, { ...state, locations: [left, right, { ...pylon, modifiers: [] }] })
  assert.match(reset.tileImages.facility1, /\/pylon.webp$/)
  const city = (code) => stageOverview(base, snapshot('08621', [location(code, 'unknown', false)]))
  assert.equal(city('08631').tileImages.unknown, city('08640').tileImages.unknown)
  assert.equal(board.anchors['08650'], undefined)
})

test('Starfall docks both ship locations at their host and removes destinations with the snapshot', () => {
  const pack = ':dark-matter:'
  const host = location(pack + '259', 'earth')
  const ships = ['250', '255'].map((code) => ({ ...location(pack + code, code), placement: { tag: 'AttachedToLocation', contents: host.id } }))
  const board = stageOverview(base, snapshot(pack + '243', [host, ...ships]))
  assert.ok(board.positions['250'][0] < board.positions.earth[0])
  assert.ok(board.positions['255'][0] > board.positions.earth[0])
  assert.equal(board.positions['250'][1], board.positions['255'][1])
  const removed = stageOverview(base, snapshot(pack + '243', ships))
  assert.equal(removed.tileImages.earth, undefined)
  const hidden = stageOverview(base, snapshot(pack + '243', [location(pack + '252', 'planet', false)]))
  assert.match(hidden.tileImages.planet, /mars-hidden.webp$/)
})

test('Phantom changes full panorama as the old opera and sewer locations leave play', () => {
  for (const [codes, image] of [
    [['008', '009'], 'foyer'], [['008', '013', '014', '015'], 'opera-house'],
    [['018', '020', '021', '023'], 'sewers'], [['023', '016', '017'], 'domain'],
  ]) {
    const state = snapshot(':the-phantom-of-the-opera:001', codes.map((code) => location(`:the-phantom-of-the-opera:${code}`)))
    assert.ok(stageOverview(undefined, state).image.endsWith(`/${image}.webp`))
  }
})

test('Boundary Beyond renders independent temporal regions and reverses them on undo', () => {
  const initial = snapshot('04161', [location('04168'), location('04169'), location('04170')])
  const before = stageOverview(base, initial)
  assert.match(before.image, /-present.webp$/)
  const mixed = stageOverview(base, { ...initial, locations: [location('04174'), ...initial.locations.slice(1)] })
  assert.match(mixed.layers[0].image, /-ancient.webp$/)
  assert.equal(mixed.layers.length, 1)
  const after = stageOverview(base, snapshot('53038', [location('04174'), location('04176'), location('04178')]))
  assert.match(after.image, /-ancient.webp$/)
  assert.equal(after.layoutArt, before.layoutArt)
  assert.deepEqual(stageOverview(base, initial), before)
})

test('Fragment of Carcosa preserves lander and camera across independently flipped cave rooms', () => {
  const id = ':dark-matter:209'
  const surface = location(':dark-matter:216', 'lander')
  const before = stageOverview(base, snapshot(id, [surface, location(':dark-matter:219', 'room')]))
  const mixed = stageOverview(base, snapshot(id, [surface, location(':dark-matter:219b', 'room')]))
  assert.equal(before.image, mixed.image)
  assert.deepEqual(before.positions.lander, mixed.positions.lander)
  assert.match(mixed.layers[0].image, /manifest.webp$/)
  assert.match(mixed.layers[0].mask, /data:image\/svg\+xml/)
  const hidden = stageOverview(base, snapshot(id, [surface, location(':dark-matter:219b', 'room', false)]))
  assert.equal(hidden.layers, undefined)
  const all = stageOverview(base, snapshot(id, [surface, ...['218', '219', '220', '221', '222', '223'].map((code) => location(`:dark-matter:${code}b`))]))
  assert.match(all.image, /manifest.webp$/)
  assert.equal(all.layoutArt, before.layoutArt)
  assert.equal(stageOverview(base, snapshot(id, [surface])).layers, undefined)
})

test('Usher only ruins the flipped room, while Constellation uses exhausted deck rooms as water state', () => {
  const usher = stageOverview(undefined, snapshot(':the-fall-of-the-house-of-usher:001', [location(':the-fall-of-the-house-of-usher:009b')]))
  assert.match(usher.layers[0].image, /-ruined.webp$/)
  const id = ':consternation-on-the-constellation:001'
  const dry = stageOverview(undefined, snapshot(id, [{ ...location(':consternation-on-the-constellation:015'), exhausted: false, floodLevel: 'FullyFlooded' }]))
  assert.equal(dry.layers, undefined)
  const wet = stageOverview(undefined, snapshot(id, [{ ...location(':consternation-on-the-constellation:015'), exhausted: true }]))
  assert.match(wet.layers[0].image, /-flooded.webp$/)
  const outside = stageOverview(undefined, snapshot(id, [{ ...location(':consternation-on-the-constellation:025'), exhausted: true }]))
  assert.equal(outside.layers, undefined)
})

test('Queen of Ash follows either public advancement path and keeps unknown tunnels out of revealed rooms', () => {
  const id = '12168'
  const rooms = [location('12185', 'sewerTunnels1'), location('12183', 'sewerTunnels3', false), location('12184', 'sewerTunnels2', false)]
  const quiet = stageOverview(base, snapshot(id, rooms))
  assert.match(quiet.image, /-chambers.webp$/)
  assert.notDeepEqual(quiet.positions.sewerTunnels1, quiet.positions.sewerTunnels3)
  assert.equal(new Set(Object.values(quiet.positions).map((point) => point.join(','))).size, 3)
  const changedPrivateIdentity = stageOverview(base, snapshot(id, [rooms[0], { ...rooms[1], cardCode: '12187' }, rooms[2]]))
  assert.deepEqual(changedPrivateIdentity.positions, quiet.positions)
  const ritual = stageOverview(base, snapshot(id, rooms, { enemies: [{ cardCode: '12179' }] }))
  assert.match(ritual.image, /-ritual.webp$/)
  const fromAgenda = stageOverview(base, snapshot(id, rooms, { agendas: [{ sequence: { step: 2, side: 'B' }, flipped: false }] }))
  const fromEnemy = stageOverview(base, snapshot(id, rooms, { enemies: [{ cardCode: '12179b' }] }))
  assert.match(fromAgenda.image, /-awakened.webp$/)
  assert.equal(fromEnemy.image, fromAgenda.image)
  assert.equal(stageOverview(base, snapshot(id, rooms, { agendas: [{ sequence: { step: 2, side: 'A' }, flipped: true }] })).image, fromAgenda.image)
  assert.deepEqual(fromEnemy.positions, quiet.positions)
  assert.equal(stageOverview(base, snapshot(id, rooms)).image, quiet.image)
})

test('Strange Moons only replaces the active public simulation inside the same facility', () => {
  const id = ':dark-matter:153'
  for (const code of ['170', '171', '172', '173', '174', '175']) {
    const board = stageOverview(base, snapshot(id, [location(`:dark-matter:${code}`)]))
    assert.equal(board.image, base.image)
    assert.equal(board.layers.length, 1)
    assert.ok(board.layers[0].image.endsWith(`/simulations/${code}.webp`))
  }
  const hidden = stageOverview(base, snapshot(id, [location(':dark-matter:174', 'sim', false)]))
  assert.equal(hidden, base)
  assert.equal(stageOverview(base, snapshot(id, [location(':dark-matter:169')])), base)
})

test('Guardians changes to the Abyss only after its new location set arrives, then restores on undo', () => {
  const before = snapshot('83016', [location('83037')])
  assert.match(stageOverview(undefined, before).image, /cairo-before-gate.webp$/)
  assert.match(stageOverview(undefined, snapshot('83016', [location('83028')])).image, /cairo-expedition.webp$/)
  const beyond = stageOverview(undefined, snapshot('83016', [location('83022a')]))
  assert.match(beyond.image, /the-great-abyss.webp$/)
  assert.ok(beyond.anchors['83025'][0] > beyond.anchors['83026'][0])
  assert.match(stageOverview(undefined, before).image, /cairo-before-gate.webp$/)
})

test('Wendigo preserves the river art across copies and unknown mountains share no temple identity', () => {
  const scene = (codes, revealed = true) => stageOverview(base, snapshot(':against-the-wendigo:001', codes.map((code) => location(`:against-the-wendigo:${code}`, code, revealed))))
  const river = scene(['013', '014', '015'])
  assert.equal(new Set(Object.values(river.tileImages)).size, 1)
  const mountains = scene(['008', '009'], false)
  assert.equal(mountains.tileImages['008'], mountains.tileImages['009'])
  assert.notEqual(mountains.tileImages['008'], scene(['008']).tileImages['008'])
  assert.equal(river.positions, undefined)
})

test('every asset selected by the installed world and cave sets is shipped', () => {
  const cases = [
    snapshot('08648b', [location('08682')]),
    snapshot('72001', ['72027', '72009', '72028', '72029', '72030', '72031', '72034'].map((code) => location(code))),
    snapshot('72001', [location('72043')]), snapshot('72001', [location('72054')]),
    snapshot('11553', [location('11572')]),
    snapshot('07274', ['07283', '07290', '07291', '07102', '07103', '07104'].map((code, i) => location(code, `tidalTunnel${i}`))),
  ]
  for (const state of cases) {
    const board = stageOverview(base, state)
    for (const file of [board.image, board.tileBack, ...Object.values(board.tileImages ?? {})].filter(Boolean)) {
      assert.ok(existsSync(new URL(`../public/${file}`, import.meta.url)), file)
    }
  }
})

test('Dead Heat keeps each abandoned printing on its original physical landmark', () => {
  const initial = snapshot('09520', [location('09526'), location('09530')])
  const day = stageOverview(base, initial)
  assert.match(day.image, /dead-heat.webp$/)
  for (let code = 9526; code <= 9530; code++) {
    assert.deepEqual(day.anchors[String(code).padStart(5, '0')], day.anchors[String(code + 5).padStart(5, '0')])
  }
  assert.equal(stageOverview(base, initial).image, day.image)
})

test('all room families ship both public artwork and their unknown backs', () => {
  const sets = [
    ['08621', '', 8632, 8641], ['08648a', '', 8649, 8666],
    ['08549', '', 8556, 8574], ['11612', '', 11619, 11629], ['11587', '', 11593, 11604],
    ['82001', '', 82008, 82016], ['70001', '', 70016, 70032],
    [':against-the-wendigo:001', ':against-the-wendigo:', 8, 23],
    [':circus-ex-mortis:017', ':circus-ex-mortis:', 21, 34],
    [':circus-ex-mortis:040', ':circus-ex-mortis:', 47, 57],
    [':circus-ex-mortis:074', ':circus-ex-mortis:', 81, 95],
    [':circus-ex-mortis:153', ':circus-ex-mortis:', 160, 177],
    [':circus-ex-mortis:190', ':circus-ex-mortis:', 195, 200],
    [':dark-matter:054', ':dark-matter:', 69, 75],
    [':ages-unwound:182', ':ages-unwound:', 189, 207],
  ]
  for (const [id, prefix, first, last] of sets) for (const revealed of [false, true]) {
    const places = Array.from({ length: last - first + 1 }, (_, i) => {
      const code = prefix + String(first + i).padStart(prefix ? 3 : 5, '0')
      return location(code, `slot${i}`, revealed)
    })
    const board = stageOverview(base, snapshot(id, places))
    assert.ok(board?.tileImages, id)
    assert.equal(Object.keys(board.tileImages).length, places.length, id)
  }
})
