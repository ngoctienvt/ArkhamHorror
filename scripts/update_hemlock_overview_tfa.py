import re

path = 'frontend/src/arkham/hemlock-overview.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add TFA to boards
tfa_boards = '''  // The Forgotten Age
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
'''

target_boards = "  // Dark Matter (Homebrew)"
if target_boards in content:
    content = content.replace(target_boards, tfa_boards + '\n' + target_boards)
else:
    print("Could not find target_boards!")

# 2. Add TFA villageAnchors
tfa_anchors = '''  // The Forgotten Age — Scenario 1: The Untamed Wilds
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
  '04060': [18, 22], // Entryway
  '04063': [45, 22], // Ancient Hall
  '04064': [78, 22], // Grand Chamber
  '04065': [18, 62], // Burial Pit
  '04066': [45, 62], // Underground Ruins
  '04067': [78, 62], // Secret Passage
  '04068': [50, 88], // Chamber of Time

  // The Forgotten Age — Scenario 4: The Boundary Beyond
  '04171': [20, 25], // Zócalo
  '04169': [50, 25], // Metropolitan Cathedral
  '04173': [80, 25], // Coyoacán
  '04170': [25, 75], // Chapultepec Park
  '04168': [50, 75], // Temple Ruins
  '04172': [78, 75], // Xochimilco

  // The Forgotten Age — Scenario 5: Heart of the Elders (Parts 1 & 2)
  '04206': [50, 20], // Mouth of K'n-yan
  '04217': [25, 45], // Time-Wracked Woods
  '04218': [75, 45], // Stone Altar
  '04222': [25, 42], // Vast Passages
  '04224': [75, 42], // Dark Hollow
  '04223': [20, 75], // Hall of Idolatry
  '04226': [50, 75], // Crystal Pillars
  '04227': [80, 75], // Descent to Yoth

  // The Forgotten Age — Scenario 6: The City of Archives
  '04252': [28, 20], // Yithian Orrery
  '04253': [52, 20], // Laboratory of the Great Race
  '04254': [78, 20], // Deconstruction Room
  '04255': [15, 55], // Towers of Pnakotus
  '04248': [50, 55], // Halls of Pnakotus
  '04245': [85, 55], // Interview Room
  '04251': [35, 85], // Great Library

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
'''

target_anchors = "  // Dark Matter — Scenario 1: The Tatterdemalion"
if target_anchors in content:
    content = content.replace(target_anchors, tfa_anchors + '\n' + target_anchors)
else:
    print("Could not find target_anchors!")

# 3. Add Threads of Fate to boardAnchors
tfa_board_anchors = '''  'the-forgotten-age/threads-of-fate': {
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
'''

target_board_anchors = "  'the-drowned-city/one-last-job': {"
if target_board_anchors in content:
    content = content.replace(target_board_anchors, tfa_board_anchors + '  ' + target_board_anchors.lstrip())
else:
    print("Could not find target_board_anchors!")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated hemlock-overview.ts successfully!")
