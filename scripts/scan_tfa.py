import os
import re

tfa_dir = 'backend/arkham-api/library/Arkham/Scenario/Scenarios/TheForgottenAge'

for f in sorted(os.listdir(tfa_dir)):
    if f.endswith('.hs'):
        path = os.path.join(tfa_dir, f)
        with open(path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # match scenario id and name
        m = re.search(r'scenario\s+(\w+)\s+"([^"]+)"\s+"([^"]+)"', content)
        if m:
            sc_type, sc_id, sc_name = m.groups()
            print(f'=== {f} ===')
            print(f'Type: {sc_type}, ID: {sc_id}, Name: {sc_name}')
        else:
            print(f'=== {f} === (custom constructor)')
            # look for scenarioWith or similar
            m2 = re.search(r'"(04\d{3}[a-z]?)"', content)
            if m2:
                print(f'ID: {m2.group(1)}')
        
        # look for layout
        layout_match = re.search(r'\[\s*"[^"]*"\s*(?:,\s*"[^"]*"\s*)+\]', content)
        if layout_match:
            print('Layout:')
            print(layout_match.group(0))
        else:
            print('No static string layout found.')
        print()
