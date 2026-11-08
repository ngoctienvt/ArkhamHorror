import json

with open('frontend/public/cards/cards_en.json', 'r', encoding='utf-8') as f:
    cards = json.load(f)

tcu_locs = []
for c in cards:
    code = c.get('code', '')
    if code.startswith('05') and c.get('type_code') == 'location':
        tcu_locs.append({
            'code': code,
            'name': c.get('name'),
            'subname': c.get('subname'),
            'traits': c.get('traits', '')
        })

print(f'Total TCU locations found: {len(tcu_locs)}')
for l in tcu_locs:
    print(f"{l['code']}: {l['name']} ({l['subname'] or ''}) - {l['traits']}")
