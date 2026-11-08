import os
import glob
import json
import re

tic_files = glob.glob('backend/arkham-api/library/Arkham/Scenario/Scenarios/TheInnsmouthConspiracy/*.hs')

print(f"Found {len(tic_files)} TIC scenario files:")

scenarios = []
for fpath in sorted(tic_files):
    fname = os.path.basename(fpath)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    # extract scenario id and name
    m = re.search(r'scenario\s+\w+\s+"([^"]+)"\s+"([^"]+)"', content)
    if m:
        sc_id = m.group(1)
        sc_name = m.group(2)
    else:
        m2 = re.search(r'"(07\d{3})"', content)
        sc_id = m2.group(1) if m2 else "unknown"
        sc_name = fname.replace('.hs', '')

    # extract layout grid if present
    layout_m = re.findall(r'\[\s*"([^"]+)"(?:\s*,\s*"([^"]+)")*\s*\]', content)
    
    # search for locationLayout or grid lines
    grid_lines = []
    lines = content.split('\n')
    recording = False
    for line in lines:
        if ('[' in line and ('".' in line or '"pos' in line or '"unvisited' in line or '"rail' in line or '"dock' in line or '"innsmouth' in line or '"reef' in line)) or (recording and '"' in line):
            grid_lines.append(line.strip())
            recording = True
            if ']' in line:
                recording = False
        elif recording:
            grid_lines.append(line.strip())
            if ']' in line:
                recording = False

    scenarios.append({
        'file': fname,
        'id': sc_id,
        'name': sc_name,
        'grid': grid_lines
    })

for s in scenarios:
    print(f"\n==========================================")
    print(f"Scenario: {s['name']} ({s['id']}) - {s['file']}")
    if s['grid']:
        print("Grid:")
        for g in s['grid']:
            print(f"  {g}")
    else:
        print("No static string grid found (might use dynamic placement or grid template)")
