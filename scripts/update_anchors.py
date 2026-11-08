p = 'frontend/src/arkham/hemlock-overview.ts'
with open(p, 'r', encoding='utf-8') as f:
    content = f.read()

target = "  ':ages-unwound:207': [10, 15], // The Future\n}"
replacement = """  ':ages-unwound:207': [10, 15], // The Future

  // The Drowned City — Scenario 1: One Last Job
  '11509': [80, 60], // Tillinghast Esoterica
  '11504': [30, 88], // Hibb's Roadhouse
  '11505': [70, 88], // La Bella Luna

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
}"""

# handle CRLF or LF
if target not in content and target.replace('\n', '\r\n') in content:
    target = target.replace('\n', '\r\n')
    replacement = replacement.replace('\n', '\r\n')

if target in content:
    content = content.replace(target, replacement)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(content)
    print('Updated hemlock-overview.ts successfully!')
else:
    print('Target not found in file.')
