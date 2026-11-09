import os

overview_path = 'frontend/src/arkham/hemlock-overview.ts'

with open(overview_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Chapter 2 boards
ch2_boards_snippet = """  ['08648b', 'the-edge-of-the-earth/the-heart-of-madness-part-2'],

  // Brethren of Ash (Chapter 2, Campaign 12)
  ['12105', 'brethren-of-ash/spreading-flames'],
  ['12133', 'brethren-of-ash/smoke-and-mirrors'],
  ['12168', 'brethren-of-ash/queen-of-ash'],

  // Children of Blood (Chapter 2, Campaign 13)
  ['13001', 'children-of-blood/river-of-blood'],
  ['13031', 'children-of-blood/new-horizons'],
  ['13068', 'children-of-blood/blood-money'],

  // Side Stories (Chapter 2)
  ['73001', 'side-stories/traces-to-nowhere'],"""

if "brethren-of-ash/spreading-flames" not in content:
    content = content.replace("  ['08648b', 'the-edge-of-the-earth/the-heart-of-madness-part-2'],", ch2_boards_snippet)
    print("Added Chapter 2 boards to boards map")

# 2. Add Chapter 2 anchors to villageAnchors
ch2_anchors_snippet = """  '08686': [50, 96], // Hidden Tunnel: A Way Out

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
  '73010': [82, 80], // French Hill

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
  '73008': [28, 42], // Steer's Office
  '73029': [72, 42], // Tick Tock Club
  '73028': [80, 72], // Train Station
  '73030': [20, 74], // Duterte Funeral Home (After Hours) / Bone Pit
  '73031': [20, 74], // Duterte Funeral Home (Something in the Basement)
  '73032': [50, 22], // Meiger Estate (Under New Ownership)
  '73033': [50, 22], // Meiger Estate (Beyond the Black Door)
  '73011': [30, 22], // South Church
  '73012': [82, 36], // Historical Society
  '73027': [18, 52], // Arkham Advertiser"""

if "'12116': [50, 52]" not in content:
    content = content.replace("  '08686': [50, 96], // Hidden Tunnel: A Way Out", ch2_anchors_snippet)
    print("Added Chapter 2 anchors to villageAnchors")

with open(overview_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("hemlock-overview.ts updated successfully with Chapter 2!")
