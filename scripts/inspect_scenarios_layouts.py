import glob, os, re

files = [
    'backend/arkham-api/library/Arkham/Scenario/Scenarios/BrethrenOfAsh/SpreadingFlames.hs',
    'backend/arkham-api/library/Arkham/Scenario/Scenarios/BrethrenOfAsh/SmokeAndMirrors.hs',
    'backend/arkham-api/library/Arkham/Scenario/Scenarios/BrethrenOfAsh/QueenOfAsh.hs',
    'backend/arkham-api/library/Arkham/Scenario/Scenarios/ChildrenOfBlood/RiverOfBlood.hs',
    'backend/arkham-api/library/Arkham/Scenario/Scenarios/ChildrenOfBlood/NewHorizons.hs',
    'backend/arkham-api/library/Arkham/Scenario/Scenarios/ChildrenOfBlood/BloodMoney.hs',
    'backend/arkham-api/library/Arkham/Scenario/Scenarios/TracesToNowhere.hs',
]

for f in files:
    if not os.path.exists(f):
        print(f"File not found: {f}")
        continue
    print(f"\n==================== {os.path.basename(f)} ====================")
    with open(f, 'r', encoding='utf-8') as fl:
        lines = fl.readlines()
    layout_lines = []
    in_layout = False
    for i, line in enumerate(lines):
        if 'scenarioWith' in line or 'scenario ' in line or 'Layout' in line or '[' in line and ('".' in line or '" ' in line or '"trefoil' in line):
            print(f"L{i+1}: {line.strip()}")
            in_layout = True
        elif in_layout:
            if ']' in line:
                print(f"L{i+1}: {line.strip()}")
                in_layout = False
            elif line.strip().startswith('"') or line.strip().startswith(','):
                print(f"L{i+1}: {line.strip()}")
