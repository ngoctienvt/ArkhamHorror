import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import test from 'node:test'

const require = createRequire(import.meta.url)
const { buildHomebrewCards, parseBackendDefs, cleanText, cleanName } = require('../scripts/import-arkham-build-homebrew.cjs')

/* arkham.build names fan-made cards by UUID and files each back as its own
 * hidden "-back" row; the engine names them `:<campaign>:<printed number>`. The
 * importer bridges the two by the card's position, and these tests pin that
 * bridge plus the markup it lets through (the text is rendered with v-html). */

const PROJECT_ID = 'proj'
const project = (cards) => ({
  meta: { code: PROJECT_ID, name: 'Dark Matter' },
  data: { packs: [{ code: PROJECT_ID, name: 'Dark Matter' }], cards },
})
const front = (uuid, position, fields) => ({
  code: uuid,
  back_link: `${uuid}-back`,
  position,
  pack_code: PROJECT_ID,
  encounter_code: `${PROJECT_ID}-the_tatterdemalion`,
  faction_code: 'mythos',
  ...fields,
})
const back = (uuid, position, fields) => ({ code: `${uuid}-back`, hidden: true, position, ...fields })

const defs = (source, name = 'Agendas') => parseBackendDefs([{ name, source }])

test('a card takes its printed number, with its back folded in ArkhamDB-style', () => {
  const cards = buildHomebrewCards({
    slug: 'dark-matter',
    backendDefs: new Map(),
    project: project([
      front('u1', 27, { name: 'Mess Hall', type_code: 'location', shroud: 1, clues: 2, traits: 'Tatterdemalion.', text: '[reaction] Gain 1 resource.' }),
      back('u1', 27, { name: 'Mess Hall', type_code: 'location', flavor: 'The center of the ship.' }),
    ]),
  })

  assert.equal(cards.length, 1)
  const [mess] = cards
  assert.equal(mess.code, ':dark-matter:027')
  assert.equal(mess.name, 'Mess Hall')
  assert.equal(mess.type_name, 'Location')
  assert.equal(mess.shroud, 1)
  assert.equal(mess.clues, 2)
  assert.equal(mess.back_flavor, 'The center of the ship.')
  assert.equal(mess.encounter_code, 'the_tatterdemalion')
  assert.equal(mess.double_sided, true)
})

test('markup is reduced to an attribute-free allowlist', () => {
  assert.equal(cleanName('<family "Chiller"><b>IT</b>'), 'IT')
  assert.equal(
    cleanText('<size 12.0><family "Chiller"><b onclick="x()">Hi</b></family></size> <script>alert(1)</script>'),
    '<b>Hi</b> alert(1)',
  )
  assert.equal(
    cleanText('Connected to <img src="https://eons.arkham.build/project:Images/Double%20Slash.png?cachebust=1" width="22">.'),
    'Connected to Double Slash.',
  )
})

test('several printings of one number are told apart by their backs', () => {
  const backendDefs = defs(`
    a = otherSideIs ":dark-matter:090ab"
      $ agenda ":dark-matter:090aa" "The Quantum Maelstrom" 1 Set.LostQuantum
    b = agenda ":dark-matter:090ba" "The Quantum Maelstrom" 1 Set.LostQuantum
    c = agenda ":dark-matter:090ca" "The Quantum Maelstrom" 1 Set.LostQuantum
    d = (asset ":dark-matter:063ab" ("Alma" <:> "Environmental Controls") Set.ElectricNightmare)
    e = story ":dark-matter:063aa" "Reintegrated" Set.ElectricNightmare
    f = story ":dark-matter:063ba" "Reintegrated" Set.ElectricNightmare
    g = (asset ":dark-matter:063bb" ("David" <:> "Engines") Set.ElectricNightmare)
  `)
  const maelstrom = (uuid, backName) => [
    front(uuid, 90, { name: 'The Quantum Maelstrom', type_code: 'agenda' }),
    back(uuid, 90, { name: backName, type_code: 'agenda' }),
  ]
  const reintegrated = (uuid, backName) => [
    front(uuid, 63, { name: 'Reintegrated', type_code: 'story' }),
    back(uuid, 63, { name: backName, type_code: 'asset' }),
  ]

  const cards = buildHomebrewCards({
    slug: 'dark-matter',
    backendDefs,
    variantBacks: { '090': { 'Observer Effect': 'a', 'Quantum Tunneling': 'b', 'Uncertainty Principle': 'c' } },
    project: project([
      ...maelstrom('m1', 'Uncertainty Principle'),
      ...maelstrom('m2', 'Quantum Tunneling'),
      ...maelstrom('m3', 'Observer Effect'),
      ...reintegrated('r1', 'David'),
      ...reintegrated('r2', 'Alma'),
    ]),
  })
  const byCode = new Map(cards.map((c) => [c.code, c]))

  // Explicit config: arkham.build lists them in the reverse of the engine's order.
  assert.equal(byCode.get(':dark-matter:090aa').back_name, 'Observer Effect')
  assert.equal(byCode.get(':dark-matter:090ab').name, 'Observer Effect')
  assert.equal(byCode.get(':dark-matter:090cb').name, 'Uncertainty Principle')
  // Backend names: the back's name picks the letter.
  assert.equal(byCode.get(':dark-matter:063aa').back_name, 'Alma')
  assert.equal(byCode.get(':dark-matter:063bb').name, 'David')
  assert.equal(byCode.get(':dark-matter:063bb').type_code, 'asset')
})

test('duplicate rows of one printing collapse to one record', () => {
  const cards = buildHomebrewCards({
    slug: 'dark-matter',
    backendDefs: defs('t = treachery ":dark-matter:088" "SURPRISE!" Set.TheBoogeyman 2', 'Treacheries'),
    project: project([
      { code: 'a', position: 88, name: '<b>SURPRISE!</b>', type_code: 'treachery' },
      { code: 'b', position: 88, name: '<b>SURPRISE!</b>', type_code: 'treachery' },
    ]),
  })
  assert.deepEqual(cards.map((c) => [c.code, c.name]), [[':dark-matter:088', 'SURPRISE!']])
})

test('engine cards arkham.build lacks still get their printed name', () => {
  const backendDefs = parseBackendDefs([
    {
      name: 'Assets',
      source: `
      x = storyAsset
          ":dark-matter:291"
          ("Grand Unified Theory" <:> "Fundamental Forces")
          3
      y = (storyAsset ":dark-matter:133" "Lt. \\"Archer\\" Michaels" 1 Set.X)`,
    },
  ])
  const cards = buildHomebrewCards({ slug: 'dark-matter', backendDefs, project: project([]) })
  const byCode = new Map(cards.map((c) => [c.code, c]))

  assert.equal(byCode.get(':dark-matter:291').name, 'Grand Unified Theory')
  assert.equal(byCode.get(':dark-matter:291').subname, 'Fundamental Forces')
  assert.equal(byCode.get(':dark-matter:291').type_code, 'asset')
  assert.equal(byCode.get(':dark-matter:133').name, 'Lt. "Archer" Michaels')
})

test('a card with a back does not get a second name-only record for its b side', () => {
  const cards = buildHomebrewCards({
    slug: 'dark-matter',
    backendDefs: defs('a = location ":dark-matter:027" "Mess Hall"\nb = location ":dark-matter:027b" "Mess Hall"', 'Locations'),
    project: project([
      front('u1', 27, { name: 'Mess Hall', type_code: 'location' }),
      back('u1', 27, { name: 'Mess Hall', type_code: 'location' }),
    ]),
  })
  assert.deepEqual(cards.map((c) => c.code), [':dark-matter:027'])
})

const { apiDefsToBackendDefs, mergeBackendDefs } = require('../scripts/import-arkham-build-homebrew.cjs')

test('a number arkham.build files under another card keeps the engine name, not the wrong text', () => {
  const conflicts = []
  const backendDefs = apiDefsToBackendDefs([
    { cardCode: 'c:circus-ex-mortis:029', name: { title: 'Moonlit Forest', subtitle: null }, cardType: 'LocationType' },
    { cardCode: 'c:circus-ex-mortis:253', name: { title: 'Unleashed Chaos', subtitle: null }, cardType: 'AgendaType' },
  ])

  const cards = buildHomebrewCards({
    slug: 'circus-ex-mortis',
    backendDefs,
    onConflict: (code) => conflicts.push(code),
    project: project([
      { code: 'a', position: 29, name: 'Curse of the Rougarou', type_code: 'act', text: 'Wrong card.' },
      { code: 'b', position: 253, name: 'Unleashed Chaos (Acceleration)', type_code: 'agenda', text: 'Right card.' },
    ]),
  })
  const byCode = new Map(cards.map((c) => [c.code, c]))

  assert.deepEqual(conflicts, [':circus-ex-mortis:029'])
  assert.equal(byCode.get(':circus-ex-mortis:029').name, 'Moonlit Forest')
  assert.equal(byCode.get(':circus-ex-mortis:029').text, undefined)
  // A qualifier arkham.build adds is the same card.
  assert.equal(byCode.get(':circus-ex-mortis:253').text, 'Right card.')
})

test('a campaign arkham.build does not publish still gets every engine name', () => {
  const apiDefs = apiDefsToBackendDefs([
    {
      cardCode: 'c:ages-unwound:008',
      name: { title: 'Arkham Streets', subtitle: null },
      revealedName: { title: 'Rivertown', subtitle: 'Your Home in Flames' },
      cardTraits: ['Arkham'],
      revealedCardTraits: ['Arkham', 'Central'],
      cardType: 'LocationType',
      doubleSided: true,
    },
    { cardCode: 'c:ages-unwound:142', name: { title: 'Wings of Time', subtitle: null }, cardType: 'ActType', stage: 1 },
  ])
  // The API lists fronts only; a back side comes from the CardDefs parse.
  const parsed = parseBackendDefs([{ name: 'Acts', source: 'x = act ":ages-unwound:142b" "Destination" Set.X' }])

  const cards = buildHomebrewCards({ slug: 'ages-unwound', project: null, backendDefs: mergeBackendDefs(apiDefs, parsed) })
  const byCode = new Map(cards.map((c) => [c.code, c]))

  // Revealed side first, ArkhamDB-style.
  assert.equal(byCode.get(':ages-unwound:008').name, 'Rivertown')
  assert.equal(byCode.get(':ages-unwound:008').subname, 'Your Home in Flames')
  assert.equal(byCode.get(':ages-unwound:008').back_name, 'Arkham Streets')
  assert.equal(byCode.get(':ages-unwound:008').traits, 'Arkham. Central.')
  assert.equal(byCode.get(':ages-unwound:008').type_name, 'Location')
  assert.equal(byCode.get(':ages-unwound:142').stage, 1)
  assert.equal(byCode.get(':ages-unwound:142b').name, 'Destination')
})
