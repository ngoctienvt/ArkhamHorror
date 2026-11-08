import os
import re

tcu_dir = 'backend/arkham-api/library/Arkham/Scenario/Scenarios/TheCircleUndone'

for f in sorted(os.listdir(tcu_dir)):
    if f.endswith('.hs'):
        path = os.path.join(tcu_dir, f)
        with open(path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        print(f'=== {f} ===')
        # match scenario constructor
        m = re.search(r'scenario(?:With)?\s+(\w+)\s+"([^"]+)"\s+"([^"]+)"', content)
        if m:
            sc_type, sc_id, sc_name = m.groups()
            print(f'Type: {sc_type}, ID: {sc_id}, Name: {sc_name}')
        else:
            m2 = re.search(r'"(05\d{3}[a-z]?)"', content)
            if m2:
                print(f'ID: {m2.group(1)}')
        
        # look for layout
        layout_match = re.search(r'\[\s*"[^"]*"\s*(?:,\s*"[^"]*"\s*)+\]', content)
        if layout_match:
            print('Layout:')
            print(layout_match.group(0))
        else:
            print('No static string layout found.')
        
        # locations
        locs = re.findall(r'Locations\.(\w+)', content)
        unique_locs = list(dict.fromkeys(locs))
        print('Locations:', ', '.join(unique_locs[:10]))
        print()
