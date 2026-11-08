with open('frontend/src/arkham/hemlock-overview.ts', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("'07050': [78, 28], // Altar to Dagon", "'07050': [65, 52], // Altar to Dagon")
text = text.replace("'07051': [22, 28], // Idol Chamber", "'07051': [29, 40], // Idol Chamber")

with open('frontend/src/arkham/hemlock-overview.ts', 'w', encoding='utf-8') as f:
    f.write(text)

with open('scripts/generate_tic_previews.py', 'r', encoding='utf-8') as f:
    prev = f.read()

prev = prev.replace("('Altar to Dagon', (78, 28))", "('Altar to Dagon', (65, 52))")
prev = prev.replace("('Idol Chamber', (22, 28))", "('Idol Chamber', (29, 40))")

with open('scripts/generate_tic_previews.py', 'w', encoding='utf-8') as f:
    f.write(prev)

print("Calibrated The Pit of Despair anchors successfully!")
