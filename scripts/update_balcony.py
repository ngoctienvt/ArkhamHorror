with open('frontend/src/arkham/hemlock-overview.ts', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("'05076': [15, 55], // Balcony", "'05076': [91, 54], // Balcony")
text = text.replace("'05083': [15, 55],", "'05083': [91, 54],")

with open('frontend/src/arkham/hemlock-overview.ts', 'w', encoding='utf-8') as f:
    f.write(text)

with open('scripts/generate_tcu_previews.py', 'r', encoding='utf-8') as f:
    prev = f.read()

prev = prev.replace("('Balcony', (15, 55))", "('Balcony', (91, 54))")

with open('scripts/generate_tcu_previews.py', 'w', encoding='utf-8') as f:
    f.write(prev)

print('Updated Balcony position in hemlock-overview.ts and generate_tcu_previews.py')
