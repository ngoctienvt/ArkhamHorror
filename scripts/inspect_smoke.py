with open('backend/arkham-api/library/Arkham/Scenario/Scenarios/BrethrenOfAsh/SmokeAndMirrors.hs', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i, line in enumerate(lines[60:110], start=61):
    print(f"{i}: {line.strip()}")
