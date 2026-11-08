import re

path = 'frontend/src/arkham/hemlock-overview.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add TCU to boards
tcu_boards = '''  // The Circle Undone
  ['05043', 'the-circle-undone/disappearance-at-the-twilight-estate'],
  ['05050', 'the-circle-undone/the-witching-hour'],
  ['05065', 'the-circle-undone/at-deaths-doorstep'],
  ['05120', 'the-circle-undone/the-secret-name'],
  ['05161', 'the-circle-undone/the-wages-of-sin'],
  ['05197', 'the-circle-undone/for-the-greater-good'],
  ['05238', 'the-circle-undone/union-and-disillusion'],
  ['05284', 'the-circle-undone/in-the-clutches-of-chaos'],
  ['05325', 'the-circle-undone/before-the-black-throne'],
'''

target_boards = "  // Dark Matter (Homebrew)"
if target_boards in content:
    content = content.replace(target_boards, tcu_boards + '\n' + target_boards)
else:
    print("Could not find target_boards!")

# 2. Add TCU villageAnchors
tcu_anchors = '''  // The Circle Undone — Scenario 0 & 2: Twilight Estate / At Death's Doorstep
  '05071': [40, 80], // Entry Hall
  '05072': [55, 48], // Victorian Halls
  '05073': [38, 43], // Trophy Room
  '05074': [30, 52], // Billiards Room
  '05075': [78, 48], // Master Bedroom
  '05076': [15, 55], // Balcony
  '05077': [30, 22], // Office
  // Spectral variants share identical physical positions
  '05078': [40, 80],
  '05079': [55, 48],
  '05080': [38, 43],
  '05081': [30, 52],
  '05082': [78, 48],
  '05083': [15, 55],
  '05084': [30, 22],

  // The Circle Undone — Scenario 1: The Witching Hour
  '05055': [50, 60], // Witches' Circle
  '05058': [17, 20], // Abandoned Mine
  '05059': [68, 85], // Cairn Stones
  '05060': [58, 35], // The Lonely Tree / Witch Tree
  '05061': [30, 35], // Child's Tree House
  '05062': [45, 75], // Tainted Well
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
  '05137': [65, 52], // Witch House Ruins
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

  // The Circle Undone — Scenario 8: Before the Black Throne
  '05332': [21, 66], // Cosmic Ingress
  '05333': [73, 26], // Hideous Palace
  '05334': [73, 26], // Court of the Great Old Ones
  '05335': [73, 26], // The Black Throne
  '05336': [58, 70], // Dancer's Mist
  '05337': [78, 80], // Flight into Oblivion
  '05338': [10, 50], // Infinity of Darkness
  '05339': [35, 75], // Cosmic Gate
  '05340': [45, 52], // Pathway into Void
'''

target_anchors = "  // Dark Matter — Scenario 1: The Tatterdemalion"
if target_anchors in content:
    content = content.replace(target_anchors, tcu_anchors + '\n' + target_anchors)
else:
    print("Could not find target_anchors!")

# 3. Add In the Clutches of Chaos to boardAnchors
tcu_board_anchors = '''  'the-circle-undone/in-the-clutches-of-chaos': {
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
'''

target_board_anchors = "  'the-drowned-city/one-last-job': {"
if target_board_anchors in content:
    content = content.replace(target_board_anchors, tcu_board_anchors + '  ' + target_board_anchors.lstrip())
else:
    print("Could not find target_board_anchors!")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated hemlock-overview.ts with TCU successfully!")
