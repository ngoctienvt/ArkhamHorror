with open('frontend/src/arkham/hemlock-overview.ts', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("'05062': [45, 75], // Tainted Well", "'05062': [40, 88], // Tainted Well")
text = text.replace("'05137': [65, 52], // Witch House Ruins", "'05137': [67, 50], // Witch House Ruins")
text = text.replace("'05215': [60, 52], // Holding Cells", "'05215': [60, 62], // Holding Cells")

with open('frontend/src/arkham/hemlock-overview.ts', 'w', encoding='utf-8') as f:
    f.write(text)
print('Calibrated TCU anchors successfully!')
