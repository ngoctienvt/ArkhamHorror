import os
import re

tfa_dir = 'backend/arkham-api/library/Arkham/Scenario/Scenarios/TheForgottenAge'

scenarios = [
    ('TheUntamedWilds.hs', '04043', 'The Untamed Wilds'),
    ('TheDoomOfEztli.hs', '04054', 'The Doom of Eztli'),
    ('ThreadsOfFate.hs', '04113', 'Threads of Fate'),
    ('TheBoundaryBeyond.hs', '04161', 'The Boundary Beyond'),
    ('HeartOfTheElders.hs', '04205a/b', 'Heart of the Elders Part 1 & 2'),
    ('TheCityOfArchives.hs', '04237', 'The City of Archives'),
    ('TheDepthsOfYoth.hs', '04277', 'The Depths of Yoth'),
    ('ShatteredAeons.hs', '04314', 'Shattered Aeons'),
    ('TurnBackTime.hs', '04344', 'Turn Back Time'),
]

for filename, sc_id, sc_name in scenarios:
    path = os.path.join(tfa_dir, filename)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # find placed locations in Setup
    placed = re.findall(r'Locations\.(\w+)', content)
    unique_placed = list(dict.fromkeys(placed))
    
    print(f'=== {sc_name} ({sc_id}) ===')
    print('  Referenced Locations:', ', '.join(unique_placed[:12]))
