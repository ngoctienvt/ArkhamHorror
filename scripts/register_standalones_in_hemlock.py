with open('frontend/src/arkham/hemlock-overview.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update boards mapping for all standalones
old_board_entry = "  // Side Stories (Chapter 2)\n  ['73001', 'side-stories/traces-to-nowhere'],"
new_board_entries = """  // Side Stories / Standalones
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
  ['73001', 'side-stories/traces-to-nowhere'],"""

if old_board_entry in content:
    content = content.replace(old_board_entry, new_board_entries)
    print("Updated boards map!")

# 2. Add boardAnchors for all standalones
standalone_anchors = """  'side-stories/curse-of-the-rougarou': {
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
    '82011': [50, 18], // Rialto Bridge
    '82008': [84, 18], // San Marco Basilica
    '82010': [88, 48], // Streets of Venice
    '82014': [82, 76], // Flooded Square
    '82012': [38, 78], // Venetian Garden (Salute Steps)
    '82016': [10, 85], // The Guardian
    '82015': [18, 56], // Accademia Bridge
    '82009': [18, 28], // Canal-side
    '82006': [54, 50], // Gondola
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
    '86014': [18, 76], // Arkham
    '86015': [25, 62], // Streets of New York
    '86016': [85, 38], // Athenaeum of the Empty Sky
    '86017': [18, 62], // The Arcade
    '86018': [80, 54], // Streets of Montreal
    '86019': [82, 46], // Chateau Ramezay
    '86020': [50, 68], // Shrine of Magh'an Ark'at
    '86022': [75, 78], // The Burning Pit
    '86023': [25, 48], // The Penthouse
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
"""

if "'side-stories/traces-to-nowhere': {" in content:
    content = content.replace("'side-stories/traces-to-nowhere': {", standalone_anchors + "  'side-stories/traces-to-nowhere': {")
    print("Added boardAnchors for all standalones!")

with open('frontend/src/arkham/hemlock-overview.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("hemlock-overview.ts successfully updated!")
