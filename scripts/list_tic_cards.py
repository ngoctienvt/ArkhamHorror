import json

with open('frontend/public/cards/cards_en.json', 'r', encoding='utf-8') as f:
    cards = json.load(f)

tic_locs = []
for c in cards:
    code = c.get('code', '')
    if code.startswith('07') and c.get('type_code') == 'location':
        tic_locs.append({
            'code': code,
            'name': c.get('name'),
            'subname': c.get('subname'),
            'traits': c.get('traits', '')
        })

print(f"Total TIC location cards found: {len(tic_locs)}")
for l in tic_locs:
    sub = f" ({l['subname']})" if l['subname'] else ""
    print(f"'{l['code']}': {l['name']}{sub} - {l['traits']}")
