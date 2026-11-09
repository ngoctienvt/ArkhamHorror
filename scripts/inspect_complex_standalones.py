import os
import re

files = [
    'backend/arkham-api/library/Arkham/Scenario/Scenarios/TheBlobThatAteEverything.hs',
    'backend/arkham-api/library/Arkham/Scenario/Scenarios/WarOfTheOuterGods.hs',
    'backend/arkham-api/library/Arkham/Scenario/Scenarios/TheLabyrinthsOfLunacy.hs',
    'backend/arkham-api/library/Arkham/Scenario/Scenarios/FortuneAndFolly.hs',
]

for p in files:
    name = os.path.basename(p)
    print(f"=== {name} ===")
    with open(p, 'r', encoding='utf-8', errors='ignore') as f:
        c = f.read()
    
    # check location definitions or setup
    locs = re.findall(r'Locations\.(\w+)', c)
    unique_locs = sorted(list(set(locs)))
    print(f"Locations referenced ({len(unique_locs)}): {unique_locs[:15]}")
