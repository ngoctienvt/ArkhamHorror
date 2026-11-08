import os

overview_path = 'frontend/src/arkham/hemlock-overview.ts'

with open(overview_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add EotE boards
eote_boards_snippet = """  ['07311', 'the-innsmouth-conspiracy/into-the-maelstrom'],

  // The Edge of the Earth
  ['08501a', 'the-edge-of-the-earth/ice-and-death-part-1'],
  ['08501b', 'the-edge-of-the-earth/ice-and-death-part-2'],
  ['08501c', 'the-edge-of-the-earth/ice-and-death-part-3'],
  ['08549', 'the-edge-of-the-earth/fatal-mirage'],
  ['08596', 'the-edge-of-the-earth/to-the-forbidden-peaks'],
  ['08621', 'the-edge-of-the-earth/city-of-the-elder-things'],
  ['08648a', 'the-edge-of-the-earth/the-heart-of-madness-part-1'],
  ['08648b', 'the-edge-of-the-earth/the-heart-of-madness-part-2'],"""

if "the-edge-of-the-earth/ice-and-death-part-1" not in content:
    content = content.replace("  ['07311', 'the-innsmouth-conspiracy/into-the-maelstrom'],", eote_boards_snippet)
    print("Added EotE boards to boards map")

# 2. Add EotE anchors to villageAnchors
eote_anchors_snippet = """  '07329': [78, 25], // Lair of Hydra (High Temple of Mother Hydra)

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
  '08686': [50, 96], // Hidden Tunnel: A Way Out"""

if "'08502': [50, 58]" not in content:
    content = content.replace("  '07329': [78, 25], // Lair of Hydra (High Temple of Mother Hydra)", eote_anchors_snippet)
    print("Added EotE anchors to villageAnchors")

with open(overview_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("hemlock-overview.ts updated successfully with Edge of the Earth!")
