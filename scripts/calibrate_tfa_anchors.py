path = 'frontend/src/arkham/hemlock-overview.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Refine TFA anchors to match the user's generated artwork
old_anchors = '''  // The Forgotten Age — Scenario 2: The Doom of Eztli & Scenario 9: Turn Back Time
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
  '04251': [35, 85], // Great Library'''

new_anchors = '''  // The Forgotten Age — Scenario 2: The Doom of Eztli & Scenario 9: Turn Back Time
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
  '04251': [45, 82], // Great Library (Tiered Manuscript Cylinder Shelves)'''

if old_anchors in content:
    content = content.replace(old_anchors, new_anchors)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated anchors in hemlock-overview.ts successfully!")
else:
    print("Could not find old_anchors!")
