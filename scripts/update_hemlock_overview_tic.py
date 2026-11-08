import os

overview_path = 'frontend/src/arkham/hemlock-overview.ts'

with open(overview_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add TIC boards
tic_boards_snippet = """  ['05325', 'the-circle-undone/before-the-black-throne'],

  // The Innsmouth Conspiracy
  ['07041', 'the-innsmouth-conspiracy/the-pit-of-despair'],
  ['07056', 'the-innsmouth-conspiracy/the-vanishing-of-elina-harper'],
  ['07123', 'the-innsmouth-conspiracy/in-too-deep'],
  ['07163', 'the-innsmouth-conspiracy/devil-reef'],
  ['07198', 'the-innsmouth-conspiracy/horror-in-high-gear'],
  ['07231', 'the-innsmouth-conspiracy/a-light-in-the-fog'],
  ['07274', 'the-innsmouth-conspiracy/the-lair-of-dagon'],
  ['07311', 'the-innsmouth-conspiracy/into-the-maelstrom'],"""

if "the-innsmouth-conspiracy/the-pit-of-despair" not in content:
    content = content.replace("  ['05325', 'the-circle-undone/before-the-black-throne'],", tic_boards_snippet)
    print("Added TIC boards to boards map")

# 2. Add TIC anchors to villageAnchors
tic_anchors_snippet = """  '05340': [45, 52], // Pathway into Void

  // The Innsmouth Conspiracy — Scenario 1: The Pit of Despair
  '07047': [50, 52], // Unfamiliar Chamber
  '07048': [24, 75], // Bone-Ridden Pit
  '07049': [76, 75], // Fish Graveyard
  '07050': [78, 28], // Altar to Dagon
  '07051': [22, 28], // Idol Chamber
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
  '07129': [15, 24], // Esoteric Order of Dagon
  '07130': [22, 50], // Sawbone Alley
  '07131': [45, 78], // Shoreward Slums
  '07132': [70, 32], // The House on Water Street
  '07133': [15, 85], // Innsmouth Jail
  '07134': [32, 16], // New Church Green
  '07135': [25, 36], // The Little Bookshop
  '07136': [54, 50], // Fish Street Bridge
  '07137': [34, 38], // First National Grocery
  '07138': [82, 40], // Innsmouth Harbour
  '07139': [44, 45], // Innsmouth Square
  '07140': [12, 65], // Gilman House
  '07141': [44, 14], // Marsh Refinery
  '07142': [10, 32], // Railroad Station
  '07143': [82, 75], // Desolate Coastline

  // The Innsmouth Conspiracy — Scenario 4: Devil Reef
  '07168': [50, 52], // Churning Waters / Fishing Vessel
  '07169': [50, 24], // Lonely Isle
  '07170': [18, 76], // Hidden Cove
  '07171': [78, 38], // Waveworn Island
  '07172': [24, 32], // Salt Marshes
  '07173': [82, 74], // Black Reef
  '07174': [15, 62], // Bootlegger's Hideaway
  '07175': [35, 52], // Deep One Grotto
  '07176': [70, 56], // Cyclopean Ruins
  '07177': [50, 68], // Temple of the Union

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
  '07329': [78, 25], // Lair of Hydra (High Temple of Mother Hydra)"""

if "'07047'" not in content:
    content = content.replace("  '05340': [45, 52], // Pathway into Void", tic_anchors_snippet)
    print("Added TIC anchors to villageAnchors")

with open(overview_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated hemlock-overview.ts for TIC successfully!")
