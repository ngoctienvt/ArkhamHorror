import os
import re

tfa_dir = 'backend/arkham-api/library/Arkham/Scenario/Scenarios/TheForgottenAge'

for f in sorted(os.listdir(tfa_dir)):
    if f.endswith('.hs'):
        path = os.path.join(tfa_dir, f)
        with open(path, 'r', encoding='utf-8') as file:
            lines = file.readlines()
        
        print(f'=== {f} ===')
        for i, line in enumerate(lines[:60]):
            if ':: Difficulty ->' in line or ':: HeartOfTheEldersScenarioStep' in line or 'ScenarioAttrs' in line:
                for j in range(max(0, i-2), min(len(lines), i+15)):
                    print(f'{j+1}: {lines[j].rstrip()}')
                break
