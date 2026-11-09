import os
import glob
import re

scenarios_dir = 'backend/arkham-api/library/Arkham/Scenario/Scenarios/TheDunwichLegacy'
files = glob.glob(os.path.join(scenarios_dir, '*.hs'))

for fpath in sorted(files):
    fname = os.path.basename(fpath)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    match = re.search(r'("02\d{3}")\s+"([^"]+)"', content)
    info = match.groups() if match else ('???', fname)
    
    # search for layout brackets
    layout_match = re.search(r'scenario(?:With)?\s+[A-Za-z0-9_]+\s+"[^"]+"\s+"[^"]+"[^\n]*\n\s*(\[[^\]]+\])', content)
    if layout_match:
        layout = layout_match.group(1).strip()
    else:
        # find lines starting with [ " or , "
        lines = [line.strip() for line in content.split('\n') if line.strip().startswith('[ "') or line.strip().startswith(', "')]
        layout = '\n'.join(lines[:10]) if lines else "No static layout ([])"
    
    print(f"=== {info[0]}: {info[1]} ({fname}) ===")
    print(layout)
    print()
