import json

with open('frontend/public/cards/cards_en.json', 'r', encoding='utf-8') as f:
    cards = json.load(f)

tfa_locations = []
for c in cards:
    code = c.get('code', '')
    if code.startswith('04') and c.get('type_code') == 'location':
        tfa_locations.append({
            'code': code,
            'name': c.get('name'),
            'subname': c.get('subname'),
            'pack_code': c.get('pack_code'),
            'traits': c.get('traits', '')
        })

print(f'Total TFA locations found: {len(tfa_locations)}')
for loc in tfa_locations:
    print(f"{loc['code']}: {loc['name']} ({loc['subname'] or ''}) [{loc['pack_code']}] - {loc['traits']}")
