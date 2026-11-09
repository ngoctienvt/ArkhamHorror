import os
import glob
import re

scenarios_dir = 'backend/arkham-api/library/Arkham/Scenario/Scenarios/ThePathToCarcosa'
files = glob.glob(os.path.join(scenarios_dir, '*.hs'))

for fpath in sorted(files):
    fname = os.path.basename(fpath)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract scenario function
    match = re.search(r'scenario(?:With)?\s+([A-Za-z0-9_]+)\s+"([^"]+)"\s+"([^"]+)"[^\n]*\n\s*(\[[^\]]+\])', content)
    if match:
        s_type, s_code, s_name, s_layout = match.groups()
        print(f"=== {s_code}: {s_name} ({fname}) ===")
        print(s_layout.strip())
        print()
    else:
        # Try finding layout in another way
        m2 = re.search(r'("03\d{3}")\s+"([^"]+)"', content)
        print(f"=== File {fname}: {m2.groups() if m2 else 'Unknown'} ===")
        # search for layout brackets
        lines = [line.strip() for line in content.split('\n') if line.strip().startswith('[ "') or line.strip().startswith(', "')]
        for l in lines[:10]:
            print("  ", l)
        print()
