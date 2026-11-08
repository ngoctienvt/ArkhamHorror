import os

backend_dir = 'backend/arkham-api/library/Arkham/Scenario/Scenarios/EdgeOfTheEarth'
for name, start in [('FatalMirage.hs', 47), ('ToTheForbiddenPeaks.hs', 49)]:
    p = os.path.join(backend_dir, name)
    with open(p, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    print(f"=== {name} ===")
    for i in range(start-1, min(start+10, len(lines))):
        print(f"{i+1}: {lines[i].strip()}")
