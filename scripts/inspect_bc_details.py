import os
import re

scenarios = [
    ('FortuneAndFolly', '88001'),
    ('TheBlobThatAteEverything', '85001'),
    ('MachinationsThroughTime', '87001'),
    ('WarOfTheOuterGods', '86001'),
    ('TheMidwinterGala', '71001'),
    ('FilmFatale', '72001'),
    ('TheLabyrinthsOfLunacy', '70001'),
]

for name, code in scenarios:
    p = f"backend/arkham-api/library/Arkham/Scenario/Scenarios/{name}.hs"
    if not os.path.exists(p):
        print(f"File not found: {p}")
        continue
    with open(p, 'r', encoding='utf-8', errors='ignore') as f:
        c = f.read()
    
    print(f"\n==================== {name} ({code}) ====================")
    # find layout
    m_layout = re.search(r'(\w+Layout|initialLayout)\s*::\s*\[GridTemplateRow\]\s*\n\1\s*=\s*\[(.*?)\]', c, re.DOTALL)
    if m_layout:
        print("Layout:")
        for line in m_layout.group(2).strip().splitlines()[:10]:
            print("  ", line.strip())
    else:
        # search locationLayout or places
        m_scen = re.search(r'scenario\s+\w+\s+"[^"]+"\s+"[^"]+"\s+\w+\s*(\[.*?\]|\w+)', c, re.DOTALL)
        if m_scen:
            print("Scenario Layout:")
            for line in m_scen.group(1).strip().splitlines()[:8]:
                print("  ", line.strip())
        else:
            print("Dynamic/Custom Layout")
    
    # find locations
    locs = re.findall(r'Locations\.(\w+)', c)
    unique_locs = sorted(list(set(locs)))
    print("Locations:", unique_locs)
