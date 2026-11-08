import json

with open('frontend/public/cards/cards_en.json', 'r', encoding='utf-8') as f:
    cards = json.load(f)

eote_locs = []
for c in cards:
    code = c.get('code', '')
    if code.startswith('08') and c.get('type_code') == 'location':
        eote_locs.append({
            'code': code,
            'name': c.get('name'),
            'subname': c.get('subname'),
            'traits': c.get('traits', '')
        })

print(f"Total EotE location cards: {len(eote_locs)}")

groups = {
    'Ice and Death': [],
    'Fatal Mirage': [],
    'To the Forbidden Peaks': [],
    'City of the Elder Things': [],
    'The Heart of Madness': []
}

for l in eote_locs:
    c = l['code']
    num = int(c[:5])
    if 8502 <= num <= 8514:
        groups['Ice and Death'].append(l)
    elif 8556 <= num <= 8574:
        groups['Fatal Mirage'].append(l)
    elif 8600 <= num <= 8607:
        groups['To the Forbidden Peaks'].append(l)
    elif 8630 <= num <= 8640:
        groups['City of the Elder Things'].append(l)
    elif 8649 <= num <= 8686:
        groups['The Heart of Madness'].append(l)
    else:
        print(f"Other: {c} {l['name']}")

for gname, locs in groups.items():
    print(f"\n=== {gname} ({len(locs)} cards) ===")
    for l in locs:
        sub = f" ({l['subname']})" if l['subname'] else ""
        print(f"  '{l['code']}': {l['name']}{sub} [{l['traits']}]")
