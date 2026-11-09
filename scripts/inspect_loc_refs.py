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
    print(f"\n==================== {os.path.basename(f)} ====================")
    with open(f, 'r', encoding='utf-8') as fl:
        txt = fl.read()
    # Find all location imports or location references
    locs = re.findall(r'Locations\.(\w+)', txt)
    print("Location refs:", sorted(set(locs)))
