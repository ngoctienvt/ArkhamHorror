import os
import re

root = 'backend/arkham-api/library/Arkham/Scenario/Scenarios'
files = [f for f in os.listdir(root) if os.path.isfile(os.path.join(root, f)) and f.endswith('.hs')]
print(f'Total standalone/root scenarios: {len(files)}')

scenarios = []
for f in sorted(files):
    path = os.path.join(root, f)
    with open(path, 'r', encoding='utf-8', errors='ignore') as fp:
        content = fp.read()
    
    # Try regex match
    m = re.search(r'(scenario|sideStory)\s+\w+\s+"([^"]+)"\s+"([^"]+)"', content)
    if m:
        scenarios.append({
            'file': f,
            'id': m.group(2),
            'title': m.group(3),
            'func': m.group(1)
        })
    else:
        # try another pattern
        m2 = re.search(r'"(\d{5})"', content)
        scenarios.append({
            'file': f,
            'id': m2.group(1) if m2 else '???',
            'title': f.replace('.hs', ''),
            'func': 'unknown'
        })

for s in scenarios:
    print(f"{s['id']}: {s['title']} ({s['file']}) [{s['func']}]")
