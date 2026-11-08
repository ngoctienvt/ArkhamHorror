import os
import re

dir_path = 'backend/arkham-api/library/Arkham/Location/CardDefs/TheForgottenAge'

for f in sorted(os.listdir(dir_path)):
    if f.endswith('.hs'):
        print(f'=== {f} ===')
        path = os.path.join(dir_path, f)
        with open(path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Look for location card definitions:
        # e.g.: name = location "04xxx" "Card Name"
        # or locationWith ... "04xxx" "Card Name"
        matches = re.findall(r'(\w+)\s*=\s*(?:location|locationWith[^\"]*)\s*"([0-9a-zA-Z]+)"\s*"([^"]+)"', content)
        for var_name, code, name in matches:
            print(f'  {var_name}: code="{code}", name="{name}"')
