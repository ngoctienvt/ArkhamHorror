import type { Point } from './locationGraph'
import { dreamEatersAnchors, dreamEatersArt } from './scene-anchors-the-dream-eaters'

const boards = new Map([
  // Night of the Zealot
  ['01120', 'night-of-the-zealot/midnight-masks'],
  ['50025', 'night-of-the-zealot/midnight-masks'],
  ['01142', 'night-of-the-zealot/devourer-below'],
  ['50032', 'night-of-the-zealot/devourer-below'],

  // The Dunwich Legacy (Season 2)
  ['02041', 'the-dunwich-legacy/extracurricular-activity'],
  ['51012', 'the-dunwich-legacy/extracurricular-activity'],
  ['02062', 'the-dunwich-legacy/the-house-always-wins'],
  ['51016', 'the-dunwich-legacy/the-house-always-wins'],
  ['02118', 'the-dunwich-legacy/the-miskatonic-museum'],
  ['51025', 'the-dunwich-legacy/the-miskatonic-museum'],
  ['02159', 'the-dunwich-legacy/the-essex-county-express'],
  ['51031', 'the-dunwich-legacy/the-essex-county-express'],
  ['02195', 'the-dunwich-legacy/blood-on-the-altar'],
  ['51032', 'the-dunwich-legacy/blood-on-the-altar'],
  ['51036', 'the-dunwich-legacy/blood-on-the-altar'],
  ['02236', 'the-dunwich-legacy/undimensioned-and-unseen'],
  ['51041', 'the-dunwich-legacy/undimensioned-and-unseen'],
  ['02274', 'the-dunwich-legacy/where-doom-awaits'],
  ['51047', 'the-dunwich-legacy/where-doom-awaits'],
  ['02311', 'the-dunwich-legacy/lost-in-time-and-space'],
  ['51051', 'the-dunwich-legacy/lost-in-time-and-space'],

  // The Feast of Hemlock Vale
  ['10704', 'hemlock-vale/vale-day'],
  ['10677a', 'hemlock-vale/vale-day'],
  ['10679a', 'hemlock-vale/vale-day'],
  ['10679b', 'hemlock-vale/vale-night'],
  ['10523', 'hemlock-vale/hemlock-house'],
  ['10549', 'hemlock-vale/silent-heath'],
  ['10569', 'hemlock-vale/lost-sister'],
  ['10588', 'hemlock-vale/thing-in-the-depths'],
  ['10605', 'hemlock-vale/twisted-hollow'],
  ['10626', 'hemlock-vale/longest-night'],
  ['10651', 'hemlock-vale/fate-of-the-vale'],

  // The Scarlet Keys
  ['09501', 'the-scarlet-keys/riddles-and-rain'],
  ['09520', 'the-scarlet-keys/dead-heat'],
  ['09545', 'the-scarlet-keys/sanguine-shadows'],
  ['09566', 'the-scarlet-keys/dealings-in-the-dark'],
  ['09591', 'the-scarlet-keys/dancing-mad'],
  ['09609', 'the-scarlet-keys/on-thin-ice'],
  ['09635', 'the-scarlet-keys/dogs-of-war'],
  ['09660', 'the-scarlet-keys/shades-of-suffering'],
  ['09681', 'the-scarlet-keys/without-a-trace'],
  ['09694', 'the-scarlet-keys/congress-of-the-keys'],

  // The Path to Carcosa & Return to The Path to Carcosa
  ['03043', 'the-path-to-carcosa/curtain-call'],
  ['52014', 'the-path-to-carcosa/curtain-call'],
  ['03061', 'the-path-to-carcosa/the-last-king'],
  ['52021', 'the-path-to-carcosa/the-last-king'],
  ['03120', 'the-path-to-carcosa/echoes-of-the-past'],
  ['52028', 'the-path-to-carcosa/echoes-of-the-past'],
  ['03159', 'the-path-to-carcosa/the-unspeakable-oath'],
  ['52034', 'the-path-to-carcosa/the-unspeakable-oath'],
  ['03200', 'the-path-to-carcosa/a-phantom-of-truth'],
  ['52040', 'the-path-to-carcosa/a-phantom-of-truth'],
  ['03240', 'the-path-to-carcosa/the-pallid-mask'],
  ['52048', 'the-path-to-carcosa/the-pallid-mask'],
  ['03274', 'the-path-to-carcosa/black-stars-rise'],
  ['52054', 'the-path-to-carcosa/black-stars-rise'],
  ['03316', 'the-path-to-carcosa/dim-carcosa'],
  ['52059', 'the-path-to-carcosa/dim-carcosa'],

  // The Drowned City
  ['11501', 'the-drowned-city/one-last-job'],
  ['11517', 'the-drowned-city/the-western-wall'],
  ['11536', 'the-drowned-city/the-drowned-quarter'],
  ['11553', 'the-drowned-city/the-apiary'],
  ['11587', 'the-drowned-city/the-grand-vault'],
  ['11612', 'the-drowned-city/court-of-the-ancients'],
  ['11639', 'the-drowned-city/obsidian-canyons'],
  ['11673', 'the-drowned-city/sepulchre-of-the-sleeper'],
  ['11682', 'the-drowned-city/the-doom-of-arkham-part-1'],
  ['11688a', 'the-drowned-city/the-doom-of-arkham-part-2'],
  ['11688b', 'the-drowned-city/the-doom-of-arkham-part-2'],

  // The Forgotten Age
  ['04043', 'the-forgotten-age/the-untamed-wilds'],
  ['04054', 'the-forgotten-age/the-doom-of-eztli'],
  ['04113', 'the-forgotten-age/threads-of-fate'],
  ['04161', 'the-forgotten-age/the-boundary-beyond'],
  ['04205a', 'the-forgotten-age/heart-of-the-elders-part-1'],
  ['04205b', 'the-forgotten-age/heart-of-the-elders-part-2'],
  ['04237', 'the-forgotten-age/the-city-of-archives'],
  ['04277', 'the-forgotten-age/the-depths-of-yoth'],
  ['04314', 'the-forgotten-age/shattered-aeons'],
  ['04344', 'the-forgotten-age/turn-back-time'],

  // The Circle Undone
  ['05043', 'the-circle-undone/disappearance-at-the-twilight-estate'],
  ['05050', 'the-circle-undone/the-witching-hour'],
  ['05065', 'the-circle-undone/at-deaths-doorstep'],
  ['05120', 'the-circle-undone/the-secret-name'],
  ['05161', 'the-circle-undone/the-wages-of-sin'],
  ['05197', 'the-circle-undone/for-the-greater-good'],
  ['05238', 'the-circle-undone/union-and-disillusion'],
  ['05284', 'the-circle-undone/in-the-clutches-of-chaos'],
  ['05325', 'the-circle-undone/before-the-black-throne'],
  ['54056', 'the-circle-undone/before-the-black-throne'],

  // The Innsmouth Conspiracy
  ['07041', 'the-innsmouth-conspiracy/the-pit-of-despair'],
  ['07056', 'the-innsmouth-conspiracy/the-vanishing-of-elina-harper'],
  ['07123', 'the-innsmouth-conspiracy/in-too-deep'],
  ['07163', 'the-innsmouth-conspiracy/devil-reef-sea'],
  [':return-to-the-innsmouth-conspiracy:031', 'the-innsmouth-conspiracy/devil-reef-sea'],
  ['07198', 'the-innsmouth-conspiracy/horror-in-high-gear'],
  ['07231', 'the-innsmouth-conspiracy/a-light-in-the-fog'],
  ['07274', 'the-innsmouth-conspiracy/the-lair-of-dagon'],
  ['07311', 'the-innsmouth-conspiracy/into-the-maelstrom'],

  // The Edge of the Earth
  ['08501a', 'the-edge-of-the-earth/ice-and-death-part-1'],
  ['08501b', 'the-edge-of-the-earth/ice-and-death-part-2'],
  ['08501c', 'the-edge-of-the-earth/ice-and-death-part-3'],
  ['08549', 'the-edge-of-the-earth/fatal-mirage'],
  ['08596', 'the-edge-of-the-earth/to-the-forbidden-peaks'],
  ['08621', 'the-edge-of-the-earth/city-of-the-elder-things'],
  ['08648a', 'the-edge-of-the-earth/the-heart-of-madness-part-1'],
  ['08648b', 'the-edge-of-the-earth/the-heart-of-madness-part-2'],

  // Brethren of Ash (Chapter 2, Campaign 12)
  ['12105', 'brethren-of-ash/spreading-flames'],
  ['12133', 'brethren-of-ash/smoke-and-mirrors'],
  ['12168', 'brethren-of-ash/queen-of-ash'],

  // Children of Blood (Chapter 2, Campaign 13)
  ['13001', 'children-of-blood/river-of-blood'],
  ['13031', 'children-of-blood/new-horizons'],
  ['13068', 'children-of-blood/blood-money'],

  // Side Stories / Standalones
  ['81001', 'side-stories/curse-of-the-rougarou'],
  ['82001', 'side-stories/carnevale-of-horrors'],
  ['84001', 'side-stories/murder-at-the-excelsior-hotel'],
  ['85001', 'side-stories/the-blob-that-ate-everything'],
  ['86001', 'side-stories/war-of-the-outer-gods'],
  ['87001', 'side-stories/machinations-through-time'],
  ['88001', 'side-stories/fortune-and-folly'],
  ['70001', 'side-stories/the-labyrinths-of-lunacy'],
  ['71001', 'side-stories/the-midwinter-gala'],
  ['72001', 'side-stories/film-fatale'],
  ['73001', 'side-stories/traces-to-nowhere'],

  // Dark Matter (Homebrew)
  [':dark-matter:014', 'dark-matter/the-tatterdemalion'],
  [':dark-matter:054', 'dark-matter/electric-nightmare'],
  [':dark-matter:089', 'dark-matter/lost-quantum'],
  [':dark-matter:112', 'dark-matter/in-the-shadow-of-earth'],
  [':dark-matter:153', 'dark-matter/strange-moons'],
  [':dark-matter:190', 'dark-matter/the-machine-in-yellow'],
  [':dark-matter:209', 'dark-matter/fragment-of-carcosa'],
  [':dark-matter:243', 'dark-matter/starfall'],

  // Ages Unwound (Homebrew)
  [':ages-unwound:001', 'ages-unwound/night-of-fire'],
  [':ages-unwound:023', 'ages-unwound/the-myriad-gentleman'],
  [':ages-unwound:048', 'ages-unwound/a-world-torn-down'],
  [':ages-unwound:062', 'ages-unwound/unstuck'],
  [':ages-unwound:105', 'ages-unwound/a-year-to-plan'],
  [':ages-unwound:155', 'ages-unwound/a-world-torn-down-again'],
  [':ages-unwound:182', 'ages-unwound/time-runs-out'],
])

// Places to stand in front of the painted buildings, shared by the day and night plates.
const villageAnchors: Record<string, Point> = {
  '10705': [51, 88], // Boarding House
  '10706': [50, 59], // Crossroads
  '10707': [49, 26], // Chapel
  '10708': [21, 85], // Old Mill
  '10709': [16, 47], // Atwood House
  '10710': [83, 27], // General Store
  '10711': [84, 87], // Schoolhouse
  '10712': [81, 55], // Commons
  '10690': [50, 59], // Crossroads on the final day
  '10691': [21, 85], // Old Mill on the final day
  // The Midnight Masks (3x3 Arkham City grid)
  '01134': [18, 18], // Northside
  '01130': [50, 18], // Downtown (First Bank)
  '01131': [50, 18], // Downtown (Arkham Asylum)
  '01132': [82, 18], // Easttown
  '01129': [18, 50], // Miskatonic University
  '01125': [50, 50], // Rivertown
  '01133': [82, 50], // Graveyard
  '01128': [18, 82], // St. Mary's Hospital
  '01126': [50, 82], // Southside (Historical Society)
  '01127': [50, 82], // Southside (Ma's Boarding House)
  '01124': [82, 82], // Your House
  // The Forgotten Age — Scenario 1: The Untamed Wilds
  '04050': [73, 27], // Expedition Camp
  '04071': [50, 48], // Rope Bridge
  '04069': [22, 53], // Path of Thorns
  '04075': [18, 42], // Overgrown Ruins
  '04072': [78, 45], // Serpent's Haven
  '04070': [88, 82], // River Canyon
  '04073': [38, 56], // Circuitous Trail
  '04074': [25, 73], // Temple of the Fang
  '04053': [38, 80], // Ruins of Eztli

  // The Forgotten Age — Scenario 2: The Doom of Eztli & Scenario 9: Turn Back Time
  '04060': [18, 22], // Entryway (Top-Left Sunlit Gate)
  '04063': [20, 52], // Ancient Hall (Serpent Bas-Relief Corridor)
  '04064': [85, 48], // Grand Chamber (Serpent Pillar Hall)
  '04065': [12, 82], // Burial Pit (Skeletal Crypt & Urns)
  '04066': [48, 55], // Underground Ruins (Collapsed Stone Chasm)
  '04067': [82, 82], // Secret Passage (Winding Narrow Stairs)
  '04068': [50, 84], // Chamber of Time (Golden Relic of Ages)

  // The Forgotten Age — Scenario 4: The Boundary Beyond
  '04171': [25, 65], // Zócalo (Colonial Arcaded Plaza)
  '04169': [52, 56], // Metropolitan Cathedral (Twin-Tower Baroque Church)
  '04173': [78, 50], // Coyoacán (Red-Roof Village & Sacred Grove)
  '04170': [18, 33], // Chapultepec Park (Hilltop Castle & Cypress Trees)
  '04168': [45, 80], // Temple Ruins / Templo Mayor (Excavated Sunken Pyramid)
  '04172': [90, 80], // Xochimilco (Canals, Floating Gardens & Boats)

  // The Forgotten Age — Scenario 5: Heart of the Elders (Parts 1 & 2)
  '04206': [50, 20], // Mouth of K'n-yan / Depths Below (Shaft of Surface Skylight)
  '04217': [25, 45], // Time-Wracked Woods
  '04218': [75, 45], // Stone Altar
  '04222': [25, 42], // Vast Passages (Paved Basalt Highway)
  '04224': [75, 42], // Dark Hollow (Vaporous Chasm)
  '04223': [18, 75], // Hall of Idolatry (Coiled Serpent Statues)
  '04226': [50, 75], // Crystal Pillars (Glowing Fluorite Crystals)
  '04227': [80, 80], // Descent to Yoth (Staircase to Red Abyss)

  // The Forgotten Age — Scenario 6: The City of Archives
  '04252': [15, 20], // Yithian Orrery (Brass Celestial Sphere)
  '04253': [56, 20], // Laboratory of the Great Race (Dome with Fluid Vats)
  '04254': [85, 52], // Deconstruction Room (Surgical Dissection Lab)
  '04255': [28, 45], // Towers of Pnakotus (Ramped Cyclopean Towers)
  '04248': [60, 48], // Halls of Pnakotus (Hexagonal Corridor)
  '04245': [85, 82], // Interview Room (Sensory Pods & Consoles)
  '04251': [45, 82], // Great Library (Tiered Manuscript Cylinder Shelves)

  // The Forgotten Age — Scenario 7: The Depths of Yoth
  '04286': [50, 18], // Steps of Yoth
  '04287': [25, 45], // City of the Serpents
  '04295': [75, 45], // Bright Canyon
  '04289': [20, 78], // Crumbling Precipice
  '04292': [50, 78], // Bridge over N'kai
  '04288': [80, 78], // Hall of Heresy

  // The Forgotten Age — Scenario 8: Shattered Aeons
  '04328': [15, 20], // Shores of R'lyeh
  '04333': [45, 20], // Atlantis
  '04331': [82, 20], // Ruins of New York
  '04324': [40, 52], // Nexus of N'kai
  '04330': [70, 52], // A Pocket in Time
  '04335': [90, 52], // Valusia
  '04327': [18, 82], // Yuggoth
  '04332': [48, 82], // Mu
  '04336': [80, 82], // Plateau of Leng

  // The Circle Undone — Scenario 0 & 2: Twilight Estate / At Death's Doorstep
  '05071': [40, 80], // Entry Hall
  '05072': [55, 48], // Victorian Halls
  '05073': [38, 43], // Trophy Room
  '05074': [30, 52], // Billiards Room
  '05075': [78, 48], // Master Bedroom
  '05076': [91, 54], // Balcony
  '05077': [30, 22], // Office
  // Spectral variants share identical physical positions
  '05078': [40, 80],
  '05079': [55, 48],
  '05080': [38, 43],
  '05081': [30, 52],
  '05082': [78, 48],
  '05083': [91, 54],
  '05084': [30, 22],

  // The Circle Undone — Scenario 1: The Witching Hour
  '05055': [50, 60], // Witches' Circle
  '05058': [17, 20], // Abandoned Mine
  '05059': [68, 85], // Cairn Stones
  '05060': [58, 35], // The Lonely Tree / Witch Tree
  '05061': [30, 35], // Child's Tree House
  '05062': [40, 88], // Tainted Well
  '05063': [73, 46], // Hermit's House
  '05064': [22, 75], // Overgrown Barn

  // The Circle Undone — Scenario 3: The Secret Name
  '05128': [24, 52], // Moldy Halls
  '05129': [15, 80], // Landlord's Quarters
  '05130': [24, 38], // Joe Mazurewicz's Room
  '05131': [35, 38], // Frank Elwood's Room
  '05132': [18, 24], // Walter Gilman's Room
  '05133': [58, 24], // Keziah's Room
  '05134': [24, 52], // Moldy Halls (Earlier Tonight)
  '05135': [80, 75], // Twilight Abyss
  '05136': [88, 40], // City of Elder Things
  '05137': [67, 50], // Witch House Ruins
  '05138': [68, 85], // Salem Gaol, 1692
  '05139': [35, 24], // Physics Classroom
  '05140': [88, 20], // Court of the Great Old Ones
  '05141': [58, 52], // Site of the Sacrifice
  '05142': [40, 52], // Strange Geometry / Decrepit Doors

  // The Circle Undone — Scenario 4: The Wages of Sin
  '05166': [40, 82], // Hangman's Brook
  '05167': [50, 42], // Haunted Fields
  '05168': [78, 46], // Abandoned Chapel
  '05169': [58, 16], // The Gallows
  '05170': [58, 16], // The Gallows
  '05171': [26, 45], // Heretics' Graves
  '05172': [26, 45], // Heretics' Graves
  '05173': [88, 60], // Chapel Crypt
  '05174': [88, 60], // Chapel Crypt
  '05175': [76, 26], // Chapel Attic
  '05176': [76, 26], // Chapel Attic

  // The Circle Undone — Scenario 5: For the Greater Good
  '05204': [10, 20], // Lodge Gates
  '05205': [10, 20], // Lodge Gates
  '05206': [18, 62], // Lobby
  '05207': [18, 62], // Lobby
  '05208': [46, 50], // Lodge Cellar
  '05209': [46, 50], // Lodge Cellar
  '05210': [80, 20], // Lounge
  '05211': [43, 76], // Vault
  '05212': [43, 18], // Library
  '05213': [64, 68], // Lodge Catacombs
  '05214': [78, 56], // Ceremony Room
  '05215': [60, 62], // Holding Cells
  '05216': [88, 75], // Inner Sanctum

  // The Circle Undone — Scenario 6: Union and Disillusion
  '05249': [50, 18], // Miskatonic River
  '05250': [28, 65], // Forbidding Shore
  '05251': [32, 32], // Unvisited Isle (Standing Stones)
  '05252': [75, 32], // Unvisited Isle (Misty Clearing)
  '05253': [18, 48], // Unvisited Isle (Forsaken Woods)
  '05254': [82, 48], // Unvisited Isle (Moss-Covered Steps)
  '05255': [45, 45], // Unvisited Isle (Haunted Spring)
  '05256': [55, 38], // Unvisited Isle (Decayed Willow)
  '05257': [68, 75], // The Geist-Trap

  // The Innsmouth Conspiracy — Scenario 1: The Pit of Despair
  '07047': [50, 52], // Unfamiliar Chamber
  '07048': [24, 75], // Bone-Ridden Pit
  '07049': [76, 75], // Fish Graveyard
  '07050': [65, 52], // Altar to Dagon
  '07051': [29, 40], // Idol Chamber
  '07052': [77, 16], // Sealed Exit
  '07102': [50, 28], // Underwater Cavern / Tidal Tunnel
  '07103': [50, 28], // Tidal Pool / Tidal Tunnel
  '07104': [50, 28], // Underground River / Tidal Tunnel

  // The Innsmouth Conspiracy — Scenario 2: The Vanishing of Elina Harper
  '07065': [47, 52], // Innsmouth Square
  '07068': [67, 52], // Fish Street Bridge
  '07066': [85, 50], // Innsmouth Harbour
  '07067': [35, 40], // First National Grocery
  '07064': [34, 76], // Gilman House
  '07070': [30, 22], // Esoteric Order of Dagon
  '07063': [48, 18], // Marsh Refinery
  '07075': [68, 20], // New Church Green
  '07074': [10, 80], // Innsmouth Jail
  '07071': [12, 54], // Sawbone Alley
  '07072': [54, 72], // Shoreward Slums
  '07069': [20, 36], // The Little Bookshop
  '07073': [80, 28], // The House on Water Street

  // The Innsmouth Conspiracy — Scenario 3: In Too Deep
  // The scenario reads east/west from the grid (Skull counts locations east in your row, Cultist pushes you
  // east), so each row runs west to east left to right: Sawbone Alley, Gilman House, Innsmouth Jail, ...
  '07129': [23, 22], // Esoteric Order of Dagon
  '07130': [7, 87], // Sawbone Alley
  '07131': [53, 83], // Shoreward Slums
  '07132': [74, 27], // The House on Water Street
  '07133': [26, 86], // Innsmouth Jail
  '07134': [36, 20], // New Church Green
  '07135': [18, 43], // The Little Bookshop
  '07136': [60, 53], // Fish Street Bridge
  '07137': [33, 40], // First National Grocery
  '07138': [83, 46], // Innsmouth Harbour
  '07139': [42, 51], // Innsmouth Square
  '07140': [14, 71], // Gilman House
  '07141': [51, 15], // Marsh Refinery
  '07142': [8, 34], // Railroad Station
  '07143': [84, 78], // Desolate Coastline

  // The Innsmouth Conspiracy — Scenario 4: Devil Reef follows its growing grid (see ISLAND_FOLDERS).

  // The Innsmouth Conspiracy — Scenario 5: Horror in High Gear
  '07203': [76, 12], // Falcon Point Approach
  '07204': [14, 58], // Dimly Lit Road
  '07205': [26, 38], // Cliffside Road
  '07206': [50, 44], // Fork in the Road
  '07207': [58, 48], // Intersection
  '07208': [68, 55], // Tight Turn
  '07209': [56, 30], // Desolate Road
  '07210': [78, 65], // Long Way Around

  // The Innsmouth Conspiracy — Scenario 6: A Light in the Fog
  '07239': [14, 32], // Falcon Point Gatehouse
  '07240': [48, 38], // Lighthouse Stairwell
  '07241': [48, 12], // Lantern Room
  '07242': [74, 30], // Falcon Point Cliffside
  '07243': [36, 32], // Lighthouse Keeper's Cottage
  '07244': [48, 60], // Sunken Grotto (Upper Depths)
  '07245': [80, 75], // Sunken Grotto (Lower Depths)
  '07246': [88, 85], // Sunken Grotto (Final Depths)
  '07247': [68, 76], // Shrine to Hydra
  '07248': [10, 80], // Deep One Nursery
  '07249': [42, 88], // The Moon Room
  '07250': [60, 60], // Sunken Archives
  '07251': [32, 58], // Pump Room
  '07252': [24, 75], // Holding Cells

  // The Innsmouth Conspiracy — Scenario 7: The Lair of Dagon
  '07283': [50, 68], // Grand Entryway
  '07284': [18, 68], // Hall of Blood
  '07285': [82, 68], // Hall of the Deep
  '07286': [50, 42], // Foul Corridors
  '07287': [18, 42], // Hall of Loyalty
  '07288': [82, 42], // Hall of Rebirth
  '07289': [50, 18], // Hall of Silence
  '07290': [50, 85], // Doorway to the Depths
  '07291': [50, 93], // Lair of Dagon

  // The Innsmouth Conspiracy — Scenario 8: Into the Maelstrom
  '07319': [58, 85], // Dark Abyss
  '07320': [50, 50], // Gateway to Y'ha-nthlei
  '07321': [50, 68], // Sunken Halls
  '07322': [85, 52], // Vault of Riches
  '07323': [68, 50], // Undersea Corridors
  '07324': [34, 58], // Statues in the Deep
  '07325': [18, 50], // Submerged Temple
  '07326': [30, 42], // Syzygy Chamber
  '07327': [30, 78], // Onyx Guardians
  '07328': [24, 25], // Lair of Dagon (Sanctuary of Father Dagon)
  '07329': [78, 25], // Lair of Hydra (High Temple of Mother Hydra)

  // Edge of the Earth — Scenario 1, 2, 3: Ice and Death (Parts 1, 2, 3)
  '08502': [50, 58], // Crash Site
  '08503': [24, 28], // Frozen Shores
  '08504': [68, 56], // Treacherous Path
  '08505': [35, 56], // Precarious Ice Sheet
  '08506': [28, 78], // Broad Snowdrifts
  '08507': [36, 16], // Icy Wastes
  '08508': [78, 24], // Rocky Crags
  '08509': [15, 88], // Snow Graves
  '08510': [16, 14], // Icebreaker Landing
  '08511': [88, 54], // Frigid Cave
  '08512': [52, 24], // Barrier Camp
  '08513': [18, 46], // Remnants of Lake's Camp
  '08514': [76, 38], // Crystalline Cavern

  // Edge of the Earth — Scenario 4: Fatal Mirage
  '08556': [50, 52], // Prison of Memories
  '08557': [50, 22], // Base Camp
  '08558': [10, 56], // Deck of the Theodosia
  '08559': [74, 55], // University Halls
  '08560': [20, 80], // Hedge Maze
  '08561': [76, 24], // Deserted Station
  '08562': [22, 68], // Coastal Waters
  '08563': [78, 82], // Elder Chamber
  '08564': [91, 52], // Riverview Theatre
  '08565': [58, 85], // Standing Stones
  '08566': [12, 38], // Airfield
  '08567': [93, 22], // Alaskan Wilds
  '08568': [82, 64], // Cluttered Dormitory
  '08569': [70, 58], // Dyer's Classroom
  '08570': [78, 46], // Infirmary
  '08571': [72, 44], // Dr. Kensler's Office
  '08572': [26, 52], // Mo'ai Statues
  '08573': [18, 25], // Ottoman Front
  '08574': [87, 86], // The Black Stone

  // Edge of the Earth — Scenario 5: To the Forbidden Peaks
  '08600': [8, 92],  // Deep Drifts (Tier 1 Base)
  '08601': [10, 55], // White Bluff (Tier 1 Base)
  '08602': [28, 76], // Steep Incline (Tier 2 Ascent)
  '08603': [38, 54], // Narrow Ridge (Tier 2 Ascent)
  '08604': [58, 54], // Rocky Ledge (Tier 3 Ledge)
  '08605': [57, 34], // Snow-Covered Crag (Tier 3 Ledge)
  '08606': [70, 36], // Windswept Path (Tier 4 Traverses)
  '08607': [78, 14], // The Summit (Tier 5 Summit)

  // Edge of the Earth — Scenario 6: City of the Elder Things
  '08630': [50, 86], // Hidden Tunnel: Entrance to the Depths
  '08631': [39, 26], // Ancient Planetarium
  '08632': [52, 45], // Stone Bridge
  '08633': [25, 28], // Cylindrical Tower
  '08634': [15, 75], // Labyrinthine Chamber
  '08635': [86, 78], // Map Room
  '08636': [82, 44], // Roofless Rampart
  '08637': [50, 72], // Ruinous Streets
  '08638': [54, 22], // Cyclopean Spires
  '08639': [54, 58], // Submerged Passageway
  '08640': [74, 20], // Temple of the Elder Things

  // Edge of the Earth — Scenario 7 & 8: The Heart of Madness (Parts 1 & 2)
  '08649': [50, 52], // The Gate of Y'quaa: Primordial Seal
  '08650': [38, 32], // Geothermal Vent
  '08651': [38, 56], // Forsaken Temple
  '08652': [65, 36], // Library of Kós
  '08653': [30, 42], // Protoplasmic Pool
  '08654': [74, 68], // Hall of the Sunless Sea
  '08655': [82, 54], // Subnautical Sprawl
  '08656': [64, 52], // Vaulted Corridor
  '08664': [12, 42], // Glacial Grotto
  '08665': [86, 42], // Sculptured Crypt
  '08666': [27, 66], // Undercity Altar
  '08667': [22, 52], // Ichor-Laden Tunnels
  '08668': [48, 12], // Limestone Caverns
  '08674': [12, 68], // Mist-Pylon (South-West)
  '08675': [19, 30], // Mist-Pylon (North-West)
  '08676': [50, 22], // Mist-Pylon (North)
  '08677': [78, 30], // Mist-Pylon (North-East)
  '08678': [88, 68], // Mist-Pylon (South-East)
  '08682': [35, 86], // Titanic Ramp 1
  '08683': [50, 82], // Titanic Ramp 2
  '08684': [65, 86], // Titanic Ramp 3
  '08685': [50, 94], // Titanic Ramp 4
  '08686': [50, 96], // Hidden Tunnel: A Way Out

  // Brethren of Ash — Scenario 1: Spreading Flames
  '12116': [50, 52], // Miskatonic Quad
  '12118': [52, 22], // Orne Library
  '12120': [52, 22], // Orne Library (Alt)
  '12117': [24, 42], // Dormitories
  '12113': [16, 74], // Your Friend's Room
  '12119': [80, 48], // Warren Observatory
  '12114': [50, 80], // Science Hall
  '12115': [50, 80], // Science Hall (Alt)

  // Brethren of Ash — Scenario 2: Smoke and Mirrors
  '12149': [18, 22], // Northside
  '12145': [50, 20], // Downtown (First Bank of Arkham)
  '12146': [50, 20], // Downtown (Arkham Sanatorium)
  '12150': [84, 22], // Easttown
  '12155': [22, 50], // Miskatonic University (In Flames)
  '12156': [22, 50], // Miskatonic University (Quiet Campus)
  '12151': [50, 48], // Merchant District
  '12152': [78, 50], // Waterfront District
  '12147': [18, 80], // Uptown: St. Mary's Hospital
  '12148': [18, 80], // Uptown: Ye Olde Magick Shoppe
  '12153': [50, 80], // Southside
  '12154': [82, 80], // French Hill

  // Brethren of Ash — Scenario 3: Queen of Ash
  '12175': [50, 16], // Sluice Control
  '12174': [50, 36], // Underground Cistern
  '12182': [50, 84], // Sewer Culvert
  '12183': [12, 56], // Sewer Tunnels (Infested Pipes)
  '12184': [32, 56], // Sewer Tunnels (Overgrown Tunnels)
  '12185': [50, 56], // Sewer Tunnels (Flooded Crypt)
  '12186': [68, 56], // Sewer Tunnels (Smuggler's Cache)
  '12187': [88, 56], // Sewer Tunnels (Toxic Waste Pit)

  // Children of Blood — Scenario 1: River of Blood
  '13016': [54, 48], // Erwin Bridge (Dawn)
  '13017': [54, 48], // Erwin Bridge (Dusk)
  '13012': [52, 70], // River Docks (Dawn)
  '13013': [52, 70], // River Docks (Dusk)
  '13008': [20, 68], // Water Street (Dawn)
  '13009': [20, 68], // Water Street (Dusk)
  '13010': [80, 68], // Garrison Street (Dawn)
  '13011': [80, 68], // Garrison Street (Dusk)
  '13014': [52, 28], // Main Street (Dawn)
  '13015': [52, 28], // Main Street (Dusk)
  '13022': [28, 48], // Back Alley (Dawn)
  '13023': [28, 48], // Back Alley (Dusk)
  '13020': [80, 34], // Waterfront Warehouse (Dawn)
  '13021': [80, 34], // Waterfront Warehouse (Dusk)
  '13018': [24, 28], // Unvisited Isle (Dawn)
  '13019': [24, 28], // Unvisited Isle (Dusk)

  // Children of Blood — Scenario 2: New Horizons
  '13039': [22, 30], // Factory Floor: West (Day)
  '13044': [22, 30], // Factory Floor: West (Night)
  '13040': [78, 30], // Factory Floor: East (Day)
  '13045': [78, 30], // Factory Floor: East (Night)
  '13042': [50, 20], // Loading Dock (Day)
  '13047': [50, 20], // Loading Dock (Night)
  '13041': [36, 26], // Manager's Office (Day)
  '13046': [36, 26], // Manager's Office (Night)
  '13043': [64, 26], // Storage (Day)
  '13048': [64, 26], // Storage (Night)
  '13049': [35, 52], // Cavern Entrance: Shallow Tunnels
  '13050': [65, 52], // Cavern Entrance: Darkest Depths
  '13051': [50, 68], // Descending Tunnel
  '13054': [20, 80], // Side Chamber: Shallow Tunnels
  '13057': [80, 80], // Side Chamber: Darkest Depths
  '13052': [32, 76], // Hidden Laboratory: Shallow Tunnels
  '13055': [32, 76], // Hidden Laboratory: Darkest Depths
  '13053': [68, 76], // Locked Chamber: Shallow Tunnels
  '13056': [68, 76], // Locked Chamber: Darkest Depths

  // Children of Blood — Scenario 3: Blood Money
  '13076': [50, 52], // Foyer (Boring Party)
  '13077': [24, 46], // Dining Hall
  '13078': [78, 46], // Study

  // Side Stories — Traces to Nowhere
  '73008': [60, 48], // Steer's Office
  '73009': [46, 52], // Merchant District
  '73010': [78, 14], // French Hill
  '73011': [36, 60], // South Church
  '73012': [74, 51], // Historical Society
  '73027': [88, 59], // Arkham Advertiser
  '73028': [20, 31], // Train Station
  '73029': [17, 82], // Tick Tock Club
  '73030': [55, 75], // Duterte Funeral Home (After Hours)
  '73031': [55, 75], // Duterte Funeral Home (Something in the Basement)
  '73032': [92, 13], // Meiger Estate (Under New Ownership)
  '73033': [92, 13], // Meiger Estate (Beyond the Black Door)
  '73050': [46, 88], // The Portal (Otherworld)
  '73051': [57, 88], // Ethereal Perch (Otherworld)
  '73052': [68, 84], // Bone Pit (Otherworld)
  // Dark Matter — Scenario 1: The Tatterdemalion (ship cutaway rooms)
  ':dark-matter:025': [35, 28], // Escape Pod Bay
  ':dark-matter:026': [60, 28], // Infirmary
  ':dark-matter:041': [81, 31], // Ventilation Shaft
  ':dark-matter:022': [35, 50], // Cargo Hold
  ':dark-matter:027': [60, 50], // Mess Hall
  ':dark-matter:028': [83, 50], // Ship's Bridge
  ':dark-matter:024': [35, 72], // Engine Room
  ':dark-matter:023': [60, 72], // Cryosleep Quarters
  // Dark Matter — Scenario 3: Lost Quantum (Elbrus Station landmarks)
  ':dark-matter:098': [13, 24], // Ice Spires
  ':dark-matter:097': [36, 26], // Crystal Peak
  ':dark-matter:096': [62, 38], // Cold Wastes
  ':dark-matter:101': [87, 26], // Omni-Transmitters
  ':dark-matter:102': [15, 65], // Q-Crystal Mines
  ':dark-matter:103': [41, 61], // Schröd Generators
  ':dark-matter:099': [76, 63], // Landing Craft
  ':dark-matter:100': [36, 85], // Main Facility
  // Dark Matter — Scenario 4: In the Shadow of Earth (Nostalgia II cutaway rooms)
  ':dark-matter:122': [26, 36], // Airlocks
  ':dark-matter:126': [42, 36], // Hydroponics
  ':dark-matter:127': [60, 36], // Infirmary
  ':dark-matter:128': [45, 52], // Ship Mainframe
  ':dark-matter:125': [78, 52], // Flight Deck
  ':dark-matter:123': [49, 68], // Crew Quarters
  ':dark-matter:129': [66, 68], // Telecoms
  ':dark-matter:124': [28, 68], // Engine Room
  // Dark Matter — Scenario 5: Strange Moons (Mi-Go Saturn moon facility)
  ':dark-matter:166': [17, 46], // Dream Diagnostics
  ':dark-matter:169': [60, 38], // Reality Simulator
  ':dark-matter:170': [60, 38], // A Hiding Place (Simulation)
  ':dark-matter:171': [60, 38], // A Mutiny (Simulation)
  ':dark-matter:172': [60, 38], // Adrift in Space (Simulation)
  ':dark-matter:173': [60, 38], // An Accident (Simulation)
  ':dark-matter:174': [60, 38], // City of Cats (Simulation)
  ':dark-matter:175': [60, 38], // Fever Dream (Simulation)
  ':dark-matter:168': [87, 46], // Memory Scanner
  ':dark-matter:165': [38, 36], // Communicator
  ':dark-matter:164': [60, 66], // Brain Storage
  ':dark-matter:167': [50, 88], // Entrance Tunnel
  // Dark Matter — Scenario 7: Fragment of Carcosa (Asteroid & Carcosa ruins cutaway)
  ':dark-matter:217': [30, 22], // Surface of Fragment
  ':dark-matter:216': [67, 16], // Abandoned Lander
  ':dark-matter:220': [36, 40], // Hidden Passage / Palace Gates
  ':dark-matter:218': [50, 50], // Bottomless Pit / Spiral Staircase
  ':dark-matter:223': [22, 68], // Stalagmite Forest / Labyrinths of Tasylock
  ':dark-matter:219': [62, 65], // Cyclopean Caverns / Grand Ballroom
  ':dark-matter:221': [83, 72], // Ice Cavity / Gardens of Thothut
  ':dark-matter:222': [51, 88], // Impassable Ravine / The Yellow Throne

  // Ages Unwound — Scenario 1: Night of Fire (Burning Arkham)
  ':ages-unwound:008': [18, 50], // Rivertown (Your Home in Flames - on the blazing riverfront townhouse)
  ':ages-unwound:009': [50, 50], // Independence Square (Central open cobblestone town plaza with monument)
  ':ages-unwound:010': [50, 18], // Easttown (Colonial townhouses north of the river across the bridge)
  ':ages-unwound:011': [82, 50], // French Hill (Victorian mansions veiled in fog on the hill)
  ':ages-unwound:012': [50, 82], // Twisting Alleys (Winding labyrinthine cobblestone street intersection)
  ':ages-unwound:013': [82, 82], // Winchmore House (Historic colonial manor house with gated courtyard)
  ':ages-unwound:014': [82, 18], // Cramped Passage (Steep narrow alley between brick buildings on upper slope)
  ':ages-unwound:015': [18, 82], // A Place to Hide (Decaying wooden safehouse/sanctuary in the shadows)

  // Ages Unwound — Scenario 2: The Myriad Gentleman (Manor & Gardens)
  ':ages-unwound:030': [62, 50], // Lawn
  ':ages-unwound:031': [62, 80], // Hedge Maze
  ':ages-unwound:032': [85, 80], // Ornate Fountain
  ':ages-unwound:033': [85, 50], // Stables
  ':ages-unwound:034': [38, 50], // Entrance Hall
  ':ages-unwound:035': [38, 80], // Parlor
  ':ages-unwound:036': [15, 80], // Kitchen
  ':ages-unwound:037': [15, 20], // Landing
  ':ages-unwound:038': [15, 50], // Master Bedroom
  ':ages-unwound:039': [38, 20], // Study

  // Ages Unwound — Scenario 3: A World Torn Down (Mount Hollyoke Elementary)
  ':ages-unwound:056': [27, 82], // Front Gates
  ':ages-unwound:057': [88, 16], // Side Building
  ':ages-unwound:058': [11, 25], // Children's Playground
  ':ages-unwound:059': [90, 52], // Sports Field
  ':ages-unwound:222': [47, 43], // Front Hallway (Grand Staircase)
  ':ages-unwound:223': [56, 23], // Rear Corridors (Upper Landing)
  ':ages-unwound:224': [72, 86], // Ritual Circle (A Harnessed Future - Azure)
  ':ages-unwound:225': [60, 80], // Ritual Circle (Gateway to the Past - Violet)
  ':ages-unwound:226': [64, 54], // Cafeteria (Dining Hall)
  ':ages-unwound:227': [71, 35], // Classroom 1 (Right Wing)
  ':ages-unwound:228': [41, 18], // Classroom 2 (Upper Wing)
  ':ages-unwound:229': [74, 27], // Classroom 3
  ':ages-unwound:230': [33, 34], // Principal's Office

  // Ages Unwound — Scenario 4: Unstuck (Temporal Vortex)
  ':ages-unwound:085': [45, 50], // The Timestream (Center Vortex)
  ':ages-unwound:086': [58, 48], // Arkham, Massachusetts (Center Street)
  ':ages-unwound:081': [48, 16], // Millions of Years Ago (Top)
  ':ages-unwound:082': [48, 16], // Millions of Years Ago (Top)
  ':ages-unwound:071': [73, 21], // A World at War (Top-Right)
  ':ages-unwound:072': [73, 21], // A World at War (Top-Right)
  ':ages-unwound:079': [88, 43], // Heart of an Empire (Right)
  ':ages-unwound:080': [88, 43], // Heart of an Empire (Right)
  ':ages-unwound:077': [81, 75], // Banks of the Nile (Bottom-Right)
  ':ages-unwound:078': [81, 75], // Banks of the Nile (Bottom-Right)
  ':ages-unwound:073': [56, 82], // An Earth Long Dead (Bottom)
  ':ages-unwound:074': [56, 82], // An Earth Long Dead (Bottom)
  ':ages-unwound:075': [30, 78], // Arkham, Massachusetts (Bottom-Left)
  ':ages-unwound:076': [30, 78], // Arkham, Massachusetts (Bottom-Left)
  ':ages-unwound:069': [14, 56], // A Disquieting Future (Left)
  ':ages-unwound:070': [14, 56], // A Disquieting Future (Left)
  ':ages-unwound:083': [24, 24], // The Tatterdemalion (Top-Left)
  ':ages-unwound:084': [24, 24], // The Tatterdemalion (Top-Left)

  // Ages Unwound — Scenario 5: A Year to Plan (Global Travel Map)
  ':ages-unwound:111': [31, 20], // Arkham, Massachusetts
  ':ages-unwound:112': [11, 20], // San Francisco
  ':ages-unwound:113': [11, 50], // Mexico City
  ':ages-unwound:114': [31, 50], // London
  ':ages-unwound:115': [50, 20], // Paris
  ':ages-unwound:116': [50, 50], // Rome
  ':ages-unwound:117': [70, 50], // Istanbul
  ':ages-unwound:118': [50, 80], // Cairo
  ':ages-unwound:119': [89, 20], // Tunguska
  ':ages-unwound:120': [70, 80], // Himalayas
  ':ages-unwound:121': [89, 50], // Shanghai
  ':ages-unwound:122': [89, 80], // Sydney
  ':ages-unwound:142': [70, 20], // Another Realm
  ':ages-unwound:143': [31, 80], // The British Library

  // Ages Unwound — Scenario 6: A World Torn Down, Again
  ':ages-unwound:169': [62, 15], // Front Gates
  ':ages-unwound:170': [38, 40], // Side Building
  ':ages-unwound:171': [85, 40], // Children's Playground
  ':ages-unwound:172': [62, 40], // Sports Field
  ':ages-unwound:173': [38, 85], // Ritual Circle (The Present, Fractured)

  // Ages Unwound — Scenario 7: Time Runs Out (Edge of Time)
  ':ages-unwound:189': [50, 62], // Fulcrum of Possibility
  ':ages-unwound:190': [50, 62], // Fulcrum of Possibility
  ':ages-unwound:191': [50, 88], // Days That Never Were
  ':ages-unwound:192': [50, 88], // Days That Never Were
  ':ages-unwound:193': [70, 62], // Secrets Long Forgotten
  ':ages-unwound:194': [70, 62], // Secrets Long Forgotten
  ':ages-unwound:195': [50, 38], // Today, a Thousand Times
  ':ages-unwound:196': [50, 38], // Today, a Thousand Times
  ':ages-unwound:197': [30, 38], // What Could Be
  ':ages-unwound:198': [30, 38], // What Could Be
  ':ages-unwound:199': [30, 62], // What Could Never Be
  ':ages-unwound:200': [30, 62], // What Could Never Be
  ':ages-unwound:201': [70, 88], // Dawn of the Universe
  ':ages-unwound:202': [70, 88], // Dawn of the Universe
  ':ages-unwound:203': [10, 38], // The End of All Things
  ':ages-unwound:204': [10, 38], // The End of All Things
  ':ages-unwound:205': [90, 62], // The Past
  ':ages-unwound:206': [70, 38], // The Present
  ':ages-unwound:207': [10, 15], // The Future

  // The Drowned City — Scenario 1: One Last Job uses its own anchors (see boardAnchors).

  // The Drowned City — Scenario 2: The Western Wall
  '11530': [50, 16], // Western Wall
  '11521': [50, 34], // Slick Steps
  '11522': [35, 52], // Eroded Shelf
  '11523': [65, 52], // Precarious Climb
  '11524': [20, 70], // Deadly Pass
  '11526': [50, 70], // Sunken Stairway
  '11525': [80, 70], // Shallow Den
  '11527': [20, 88], // Drowned Shanty
  '11529': [50, 88], // Obsidian Foundations
  '11528': [80, 88], // Shattered Ruins
  '11532': [50, 88], // Undersea Vault

  // The Drowned City — Scenario 3: The Drowned Quarter
  '11540': [50, 52], // Barrier Core
  '11541': [20, 24], // Abyssal Trench
  '11542': [50, 24], // Drowned Acropolis (Ephemeral Ruins)
  '11543': [80, 80], // Drowned Acropolis (Collapsed Ruins)
  '11544': [20, 52], // Blasted Ruins (Sunken Circle)
  '11545': [80, 52], // Blasted Ruins (Crumbling Edifices)
  '11546': [80, 24], // Coral Reef (Statuary Garden)
  '11547': [50, 80], // Coral Reef (Feeding Grounds)
  '11548': [20, 80], // Ancient Gallery

  // The Drowned City — Scenario 4: The Apiary
  '11579': [50, 15], // Hidden Vault
  '11562': [50, 32], // Growing Fields
  '11559': [50, 50], // Apiary Entrance
  '11561': [22, 50], // Fleshy Paths (Western Burrows)
  '11560': [78, 50], // Fleshy Paths (Eastern Burrows)
  '11565': [50, 68], // Luminous Tunnels
  '11569': [50, 68], // Grasping Corridor
  '11564': [18, 86], // Corrupted Vault
  '11572': [50, 86], // Central Chamber
  '11566': [70, 86], // Spawning Grounds
  '11570': [70, 86], // Starving Corridor
  '11563': [88, 86], // Churning Chasm
  '11567': [50, 92], // Lost Campsite
  '11571': [50, 92], // Acidic Coelom

  // The Drowned City — Scenario 5: The Grand Vault
  '11600': [32, 22], // Obsidian Bulwark
  '11601': [50, 22], // Sluice Control
  '11602': [68, 22], // Grime-Covered Gears
  '11593': [14, 52], // The Great Stair
  '11594': [32, 52], // Moving Platform
  '11595': [50, 52], // Core of the Vault
  '11598': [68, 52], // Chamber of Records (Arm)
  '11599': [68, 52], // Chamber of Records (Earth)
  '11604': [86, 52], // Chamber of the Tablet
  '11596': [32, 82], // Shrouded Cistern
  '11603': [50, 82], // Inscrutable Apparatus

  // The Drowned City — Scenario 6: Court of the Ancients
  '11621': [22, 20], // Twisting Catwalks
  '11622': [40, 86], // Great Lift (Base)
  '11624': [70, 20], // Ring Library (Archive of the Stars)
  '11625': [70, 20], // Ring Library (Archive of the Ancients)
  '11626': [22, 42], // Lofty Walkway (Archive of Dreams)
  '11627': [70, 42], // Lofty Walkway (Archive of Conflict)
  '11629': [22, 64], // Luminous Archives (Archive of Memory)
  '11628': [70, 64], // Luminous Archives (Archive of History)
  '11619': [18, 86], // West Antechamber
  '11620': [62, 86], // East Antechamber
  '11623': [84, 86], // Ancient Altar

  // The Drowned City — Scenario 7: Obsidian Canyons
  '11650': [18, 24], // Floating Spire
  '11659': [40, 24], // Dazzling Skyline
  '11660': [62, 24], // Aerial Waterfall
  '11652': [84, 24], // Ancient Dome
  '11658': [28, 52], // Ancient Canyons
  '11649': [50, 52], // Central Spire
  '11661': [72, 52], // Magnetic Spires
  '11648': [18, 80], // R'lyeh Streets
  '11655': [40, 80], // Obsidian Cliffs
  '11656': [62, 80], // Suspended Reef
  '11662': [84, 80], // Glyph Orrery
  '11651': [50, 16], // Western Wall (Canyons)

  // The Drowned City — Scenario 8: Sepulchre of the Sleeper
  '11677': [50, 18], // Story of Ambition
  '11681': [20, 38], // Story of the Voyage
  '11678': [80, 38], // Story of Resilience
  '11676': [50, 52], // Dreamer's Rest
  '11680': [28, 84], // Story of Defiance
  '11679': [72, 84], // Story of Infinity

  // The Drowned City — Scenario 9: The Doom of Arkham Part I
  '11685': [80, 52], // Tillinghast Esoterica (Ephemeral Shop)

  // The Drowned City — Scenario 10: The Doom of Arkham Part II
  '11699': [18, 25], // Western Rooftops
  '11692': [38, 25], // Northside (Ruined)
  '11693': [62, 25], // Downtown (Ruined)
  '11700': [82, 25], // Eastern Rooftops
  '11696': [50, 55], // Rivertown (Ruined)
  '11695': [28, 80], // Miskatonic University (Ruined)
  '11697': [50, 82], // St. Mary's Hospital (Ruined)
  '11698': [72, 80], // Southside (Ruined)
}

// Boards that reuse cards from another scenario (e.g. the Midnight Masks Arkham districts)
// but arrange them differently, so the shared anchors would contradict the real connections.
const boardAnchors: Record<string, Record<string, Point>> = {
  // Curtain Call: Arkham Theatre (Lobby, Auditorium, Balcony, Backstage, Doorways)
  'the-path-to-carcosa/curtain-call': {
    lobbyDoorway1: [8, 20],
    lobbyDoorway3: [8, 48],
    lobbyDoorway2: [8, 80],
    lobby: [19, 70],
    balcony: [38, 42],
    theatre: [57, 66],
    backstage: [82, 74],
    backstageDoorway1: [91, 20],
    backstageDoorway3: [91, 52],
    backstageDoorway2: [91, 82],
    '03048': [57, 66], // Theatre
    '03049': [19, 70], // Lobby
    '03050': [38, 42], // Balcony
    '03051': [82, 74], // Backstage
  },
  // The Last King: Ward Family Manor (Dining Room, Gallery, Courtyard, Ballroom, Living Room, Foyer)
  'the-path-to-carcosa/the-last-king': {
    diningRoom: [22, 22],
    gallery: [82, 18],
    courtyard: [58, 36],
    ballroom: [24, 66],
    livingRoom: [78, 62],
    foyer: [50, 84],
    '03066': [50, 84], // Foyer
    '03067': [58, 36], // Courtyard
    '03068': [78, 62], // Living Room
    '03069': [24, 66], // Ballroom
    '03070': [22, 22], // Dining Room
    '03071': [82, 18], // Gallery
  },
  // Echoes of the Past: Georgian manor 3-floor architectural cutaway
  // 3rd Floor (Attic/Offices), 2nd Floor (Quiet Halls mezzanine/Library), Ground Floor (Entry Hall foyer/Exhibits)
  'the-path-to-carcosa/echoes-of-the-past': {
    groundFloor1: [15, 80],
    entryHall: [42, 80],
    groundFloor2: [70, 80],
    secondFloor1: [15, 52],
    quietHalls1: [41, 52],
    secondFloor2: [64, 52],
    hiddenLibrary: [77, 52],
    thirdFloor1: [16, 28],
    quietHalls2: [39, 28],
    thirdFloor2: [64, 28],
    '03127': [42, 80], // Entry Hall
    '03131': [41, 52], // Quiet Halls (2nd Floor)
    '03135': [39, 28], // Quiet Halls (3rd Floor)
    '03139': [77, 52], // Hidden Library
  },
  // The Unspeakable Oath: Arkham Asylum (Courtyard/Garden, Facilities, Subterranean Confinement)
  'the-path-to-carcosa/the-unspeakable-oath': {
    garden: [38, 25],
    yard: [62, 25],
    kitchen: [10, 52],
    messHall: [32, 52],
    asylumHallsWesternPatientWing: [52, 52],
    asylumHallsEasternPatientWing: [69, 52],
    infirmary: [88, 52],
    basementHall: [12, 84],
    patientConfinement1: [35, 84],
    patientConfinement3: [52, 84],
    patientConfinement4: [68, 84],
    patientConfinement2: [84, 84],
    '03170': [10, 52], // Kitchen
    '03171': [32, 52], // Mess Hall
    '03172': [88, 52], // Infirmary
    '03173': [62, 25], // Yard
    '03174': [38, 25], // Garden
    '03175': [12, 84], // Basement Hall
    '03168': [52, 52], // Western Wing
    '03169': [69, 52], // Eastern Wing
  },
  // A Phantom of Truth: 1920s Paris (West-to-East Topology)
  'the-path-to-carcosa/a-phantom-of-truth': {
    grandGuignol: [10, 16],
    opéraGarnier: [21, 41],
    gareDOrsay: [12, 74],
    montmartre: [38, 18],
    gardensOfLuxembourg: [52, 57],
    montparnasse: [42, 88],
    canalSaintMartin: [68, 16],
    leMarais: [68, 38],
    notreDame: [74, 71],
    pèreLachaiseCemetery: [88, 22],
    '03206': [10, 16], // Grand Guignol
    '03207': [21, 41], // Opéra Garnier
    '03208': [12, 74], // Gare d'Orsay
    '03209': [38, 18], // Montmartre
    '03210': [68, 38], // Le Marais
    '03211': [74, 71], // Notre-Dame
    '03212': [52, 57], // Gardens of Luxembourg
    '03213': [68, 16], // Canal Saint-Martin
    '03214': [88, 22], // Père Lachaise Cemetery
    '03215': [42, 88], // Montparnasse
  },
  // Black Stars Rise: Mont Saint-Michel Fortress & Abbey
  'the-path-to-carcosa/black-stars-rise': {
    cloister: [28, 16],
    knightsHall: [20, 25],
    abbeyChurch: [47, 25],
    northTower: [60, 22],
    brokenSteps: [49, 56],
    outerWall: [82, 46],
    chapelOfStAubert: [17, 54],
    chœurGothique: [34, 50],
    grandRue: [70, 62],
    abbeyTower: [31, 82],
    porteDeLAvancée: [76, 84],
    '03284': [28, 16], // Cloister
    '03285': [20, 25], // Knights' Hall
    '03286': [60, 22], // North Tower
    '03287': [47, 25], // Abbey Church
    '03288': [82, 46], // Outer Wall
    '03289': [17, 54], // Chapel of St. Aubert
    '03290': [49, 56], // Broken Steps
    '03291': [34, 50], // Chœur Gothique
    '03292': [70, 62], // Grand Rue
    '03293': [31, 82], // Abbey Tower
    '03294': [76, 84], // Porte de l'Avancée
  },
  // One Last Job mirrors the scenario's 3x3 card grid exactly, so the map reads like the table:
  //   .            La Bella Luna   Hibb's Roadhouse
  //   Northside    Downtown        Easttown
  //   Tillinghast  Miskatonic U.   Rivertown
  'the-forgotten-age/threads-of-fate': {
    '04128': [30, 20], // Train Tracks
    '04143': [55, 20], // Town Hall
    '04126': [80, 20], // Police Station
    '04142': [12, 50], // Curiositie Shoppe
    '01134': [30, 50], // Northside
    '01130': [50, 50], // Downtown (First Bank)
    '01131': [50, 50], // Downtown (Asylum)
    '01132': [70, 50], // Easttown
    '04141': [88, 50], // Velma's Diner
    '04117': [25, 82], // Eztli Exhibit
    '01129': [48, 82], // Miskatonic University
    '01125': [72, 82], // Rivertown
    '04133': [90, 82], // Black Cave
  },
  'the-circle-undone/in-the-clutches-of-chaos': {
    '05302': [13, 28], // Hangman's Hill
    '05304': [13, 28], // Hangman's Hill
    '05296': [15, 62], // Uptown
    '05297': [15, 62], // Uptown
    '05298': [20, 80], // South Church
    '05299': [20, 80], // South Church
    '05294': [35, 72], // Southside
    '05295': [35, 72], // Southside
    '05300': [48, 52], // Merchant District
    '05301': [48, 52], // Merchant District
    '05292': [75, 58], // Rivertown
    '05293': [75, 58], // Rivertown
    '05290': [62, 82], // French Hill
    '05291': [62, 82], // French Hill
    '05303': [90, 40], // Silver Twilight Lodge
    '05305': [90, 40], // Silver Twilight Lodge
  },
      'side-stories/curse-of-the-rougarou': {
    '81008': [80, 24], // Garden District (New Orleans)
    '81018': [20, 26], // Overgrown Cairns (Unhallowed Land)
    '81016': [50, 48], // Foul Swamp (Bayou)
    '81010': [50, 48], // Brackish Waters
    '81007': [20, 26], // Cursed Shores
    '81013': [50, 48], // Forgotten Marsh
    '81012': [15, 74], // Faubourg Marigny (Riverside)
    '81014': [84, 76], // Trapper's Cabin (Wilderness)
  },
  'side-stories/carnevale-of-horrors': {
    '82008': [51, 23], // 1. San Marco Basilica
    '82013': [75, 20], // 2. Bridge of Sighs
    '82010': [86, 38], // 3. Streets of Venice
    '82014': [84, 75], // 4. Flooded Square
    '82012': [50, 90], // 5. Venetian Garden
    '82009': [18, 76], // 6. Canal-side
    '82015': [24, 45], // 7. Accademia Bridge
    '82011': [20, 26], // 8. Rialto Bridge
    '82016': [86, 38], // The Guardian
    '82006': [50, 52], // Gondola / Cnidathqua
  },
  'side-stories/fortune-and-folly': {
    '88010': [32, 65], // Poker Table
    '88011': [48, 65], // Roulette Wheel
    '88012': [64, 65], // Baccarat Table
    '88013': [88, 58], // Slot Machines
    '88014': [80, 26], // Casino Lounge
    '88015': [80, 26], // High Rollers Table
    '88016': [68, 86], // Staff Access Hallway
    '88018': [68, 86], // Guard Room
    '88020': [68, 86], // Counting Room
    '88021': [78, 86], // Vault Door
    '88022': [92, 86], // Relic Room (Sanctum of Fortune)
  },
  'side-stories/machinations-through-time': {
    '87007': [18, 30], // Arkham Gazette (1890s)
    '87008': [22, 54], // O'Malley's Watch Shop (1890s)
    '87009': [12, 75], // River Docks Past (1890s)
    '87010': [20, 42], // Miskatonic U Past (1890s)
    '87016': [52, 28], // Arkham Advertiser Present (1920s)
    '87017': [50, 52], // Tick-Tock Club Present (1920s)
    '87018': [48, 76], // River Docks Present (1920s)
    '87019': [50, 40], // Miskatonic U Present (1920s)
    '87020': [62, 52], // Ye Olde Magick Shoppe
    '87025': [82, 54], // Arkham Advertiser Future (2890s)
    '87027': [84, 76], // River Docks Future (2890s)
    '87028': [80, 42], // Miskatonic U Future (2890s)
    '87029': [84, 30], // Corrigan Industries (2890s)
  },
  'side-stories/war-of-the-outer-gods': {
    '86014': [54, 76], // Arkham Crossroads
    '86015': [66, 42], // Streets of Providence
    '86016': [66, 42], // Athenaeum of the Empty Sky
    '86017': [85, 45], // The Arcade
    '86018': [93, 76], // Streets of Montreal
    '86019': [93, 76], // Chateau Ramezay
    '86020': [93, 76], // Shrine of Magh'an Ark'at
    '86021': [20, 30], // Streets of New York
    '86022': [29, 65], // The Burning Pit
    '86023': [8, 70],  // The Penthouse
    '86024': [72, 10], // Hub Dimension (Eclipse)
  },
  'side-stories/the-midwinter-gala': {
    '71007': [50, 72], // Lobby
    '71008': [22, 74], // Lantern Chamber
    '71009': [25, 36], // Art Gallery
    '71010': [78, 74], // Ballroom
    '71011': [78, 84], // Barroom
    '71012': [76, 36], // Bedroom / Library
  },
  'side-stories/film-fatale': {
    '72009': [48, 28], // Space Set (Soundstage)
    '72010': [78, 62], // Jungle Set
    '72011': [16, 52], // Gothic Set
    '72039': [16, 38], // Western Ridge
    '72041': [84, 38], // Eastern Ridge
    '72042': [78, 75], // Jungle River
  },
  'side-stories/the-labyrinths-of-lunacy': {
    '70032': [50, 18], // Abandoned Warehouse
    '70023': [22, 54], // Chamber of Night
    '70028': [22, 68], // Chamber of Hunger
    '70021': [22, 80], // Chamber of Sorrows
    '70029': [78, 54], // Chamber of Decay
    '70030': [78, 68], // Chamber of Rot
    '70031': [78, 80], // Chamber of Poison
    '70024': [50, 36], // Chamber of Regret
    '70019': [50, 44], // Chamber of Rain
    '70026': [50, 54], // Labyrinthine Halls
    '70016': [50, 84], // Chamber of Secrets
  },
  'side-stories/traces-to-nowhere': {
    '73008': [60, 48], // Steer's Office
    '73009': [46, 52], // Merchant District
    '73010': [78, 14], // French Hill
    '73011': [36, 60], // South Church
    '73012': [74, 51], // Historical Society
    '73027': [88, 59], // Arkham Advertiser
    '73028': [20, 31], // Train Station
    '73029': [17, 82], // Tick Tock Club
    '73030': [55, 75], // Duterte Funeral Home (After Hours)
    '73031': [55, 75], // Duterte Funeral Home (Something in the Basement)
    '73032': [92, 13], // Meiger Estate (Under New Ownership)
    '73033': [92, 13], // Meiger Estate (Beyond the Black Door)
    '73050': [46, 88], // The Portal
    '73051': [57, 88], // Ethereal Perch
    '73052': [68, 84], // Bone Pit
  },
  'the-drowned-city/one-last-job': {
    '11505': [51, 19], // La Bella Luna (Italian restaurant with red awnings)
    '11504': [88, 17], // Hibb's Roadhouse (Rustic wooden roadhouse on hill)
    '01134': [18, 43], // Northside (Victorian townhouses & elevated tram)
    '01130': [56, 46], // Downtown (First Bank of Arkham neoclassical facade)
    '01131': [56, 46], // Downtown (Arkham Asylum)
    '01132': [73, 53], // Easttown (Tenements & blue-lanterned police station)
    '11509': [15, 74], // Tillinghast Esoterica (Emerald-green glowing curiosity shop)
    '01129': [45, 76], // Miskatonic University (Gothic halls & quad)
    '01125': [82, 82], // Rivertown (Wharves, piers & riverboats)
  },
}

export function hemlockVillagePosition(code: string, anchors?: Record<string, Point>, label?: string): Point | undefined {
  const key = code.replace(/^c/, '').replace(/[ab]$/, '')
  return (label ? anchors?.[label] : undefined) ?? anchors?.[key] ?? villageAnchors[key]
}

const houseRows: Record<string, number> = {
  '03': 13, '02': 31, '01': 50, '00': 75, n01: 92,
}

export function hemlockHousePosition(label: string): Point | undefined {
  const cell = /^pos(n01|00|01)(n01|00|01|02|03)$/.exec(label)
  if (!cell) return undefined
  const [, column, row] = cell
  if ((row === '03' || row === 'n01') && column !== '00') return undefined
  return [column === 'n01' ? 18 : column === '01' ? 82 : 50, houseRows[row]]
}

export type HemlockOverview = {
  image: string
  fixedPassages: boolean
  village?: boolean
  house?: boolean
  anchors?: Record<string, Point>
  /** Folder of floating-island sprites drawn under each location, for boards with no painted places. */
  islands?: string
  /** Moving weather drawn over the painted background (rain, swell, fog, lightning); the picture stays still. */
  weather?: 'storm-sea'
}

/* Grids that grow or reshuffle during play (Before the Black Throne's Cosmos, Devil Reef as islands are
 * explored) cannot be painted ahead of time. Each location instead stands on a sprite of its own, drawn under
 * its plate; `scene-island-sprites.ts` picks the sprite from this folder. */
const COSMOS_ISLANDS = 'img/scenes/the-circle-undone/cosmos'
const DEVIL_REEF_ISLANDS = 'img/scenes/the-innsmouth-conspiracy/devil-reef'
const ISLAND_FOLDERS = new Map([
  ['05325', COSMOS_ISLANDS],
  ['54056', COSMOS_ISLANDS],
  ['07163', DEVIL_REEF_ISLANDS],
  [':return-to-the-innsmouth-conspiracy:031', DEVIL_REEF_ISLANDS],
])
/* Boards whose sea is alive: Devil Reef is explored by boat through a storm. */
const WEATHER = new Map<string, NonNullable<HemlockOverview['weather']>>([
  ['07163', 'storm-sea'],
  [':return-to-the-innsmouth-conspiracy:031', 'storm-sea'],
])

export function hemlockOverview(id: string, reference: string, layout?: readonly string[] | null, activeLabels?: readonly string[]): HemlockOverview | undefined {
  const scenario = id.replace(/^c/, '')
  if (scenario === '10501') {
    // The reference flips when the cave-in replaces the caves with rails.
    const fixedPassages = !reference.endsWith('b')
    const art = fixedPassages ? 'written-in-rock-descent' : 'written-in-rock-maze'
    return { image: `img/scenes/hemlock-vale/${art}.webp`, fixedPassages, village: true }
  }
  // Some branches of the finale leave the Abyss and rebuild the village board.
  const isNightVale = scenario === '10651' && layout?.some((row) => row.trim().split(/\s+/).includes('diamond'))
  const dreamArt = dreamEatersArt(scenario, layout, activeLabels)
  const art = dreamArt ?? (isNightVale ? 'hemlock-vale/vale-night' : boards.get(scenario))
  if (!art) return undefined
  const islands = dreamArt?.includes('/endless-stairs/') || dreamArt?.includes('/weaver/')
    ? `img/scenes/${dreamArt.slice(0, dreamArt.lastIndexOf('/'))}` : ISLAND_FOLDERS.get(scenario)
  return {
    image: `img/scenes/${art}.webp`,
    fixedPassages: false,
    village: true,
    house: art.endsWith('hemlock-house'),
    anchors: dreamEatersAnchors[art] ?? boardAnchors[art],
    ...(islands ? { islands } : {}),
    ...(WEATHER.has(scenario) ? { weather: WEATHER.get(scenario) } : {}),
  }
}
