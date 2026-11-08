import os
import re

tfa_dir = 'backend/arkham-api/library/Arkham/Scenario/Scenarios/TheForgottenAge'

for f in sorted(os.listdir(tfa_dir)):
    if f.endswith('.hs'):
        path = os.path.join(tfa_dir, f)
        with open(path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # look for scenario or scenarioWith
        print(f'=== {f} ===')
        for line in content.splitlines():
            if 'scenario' in line and ('"04' in line or 'Scenario' in line):
                print(' ', line.strip())
            if 'instance IsScenario' in line or 'instance RunMessage' in line:
                pass
