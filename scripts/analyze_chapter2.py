import glob, os, re

paths = [
    'backend/arkham-api/library/Arkham/Scenario/Scenarios/BrethrenOfAsh',
    'backend/arkham-api/library/Arkham/Scenario/Scenarios/ChildrenOfBlood'
]

for p in paths:
    print(f"=== {p} ===")
    for f in sorted(glob.glob(os.path.join(p, '*.hs'))):
        with open(f, 'r', encoding='utf-8') as fl:
            txt = fl.read()
        m = re.findall(r'scenario(?:With)?\s+\w+\s+"([^"]+)"\s+"([^"]+)"', txt)
        print(f"  {os.path.basename(f)}: {m}")
