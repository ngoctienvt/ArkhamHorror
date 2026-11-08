import os
import glob
import json
import re

with open('frontend/public/cards/cards_en.json', 'r', encoding='utf-8') as f:
    cards_en = json.load(f)

card_map = {c['code']: c for c in cards_en if c.get('code', '').startswith('08')}

scenarios_order = [
    ('IceAndDeathPart1', '08501a', 'Ice and Death: Part 1', 'ice-and-death-part-1'),
    ('IceAndDeathPart2', '08501b', 'Ice and Death: Part 2', 'ice-and-death-part-2'),
    ('IceAndDeathPart3', '08501c', 'Ice and Death: Part 3', 'ice-and-death-part-3'),
    ('FatalMirage', '08549', 'Fatal Mirage', 'fatal-mirage'),
    ('ToTheForbiddenPeaks', '08596', 'To the Forbidden Peaks', 'to-the-forbidden-peaks'),
    ('CityOfTheElderThings', '08622', 'City of the Elder Things', 'city-of-the-elder-things'),
    ('TheHeartOfMadnessPart1', '08681a', 'The Heart of Madness: Part 1', 'the-heart-of-madness-part-1'),
    ('TheHeartOfMadnessPart2', '08681b', 'The Heart of Madness: Part 2', 'the-heart-of-madness-part-2'),
]

for mod_name, sc_code, title, slug in scenarios_order:
    print(f"\n=======================================================")
    print(f"[{sc_code}] {title} (slug: {slug})")
    print(f"=======================================================")

    sc_file = f"backend/arkham-api/library/Arkham/Scenario/Scenarios/EdgeOfTheEarth/{mod_name}.hs"
    sc_content = ""
    if os.path.exists(sc_file):
        with open(sc_file, 'r', encoding='utf-8') as f:
            sc_content = f.read()

    # extract actual code from file if different
    m_id = re.search(r'scenario\s+\w+\s+"([^"]+)"\s+"([^"]+)"', sc_content)
    if m_id:
        print(f"Actual Scenario ID: {m_id.group(1)}, Name: {m_id.group(2)}")

    # Look for layout
    layout_matches = re.findall(r'(\[\s*"\.[^\]]+\])', sc_content, re.DOTALL)
    if layout_matches:
        for lm in layout_matches:
            print("Layout grid:")
            for line in lm.split('\n')[:15]:
                print(f"  {line.strip()}")
    else:
        pos_matches = re.findall(r'Pos\s+(-?\d+)\s+(-?\d+)', sc_content)
        if pos_matches:
            print(f"Grid coordinates (Pos x y) detected: {set(pos_matches)}")

    # Check Helpers directory if exists
    help_file = f"backend/arkham-api/library/Arkham/Scenarios/EdgeOfTheEarth/{mod_name}/Helpers.hs"
    if os.path.exists(help_file):
        with open(help_file, 'r', encoding='utf-8') as f:
            help_content = f.read()
            h_layout = re.findall(r'(\[\s*"\.[^\]]+\])', help_content, re.DOTALL)
            if h_layout:
                print("Helper layout:")
                for line in h_layout[0].split('\n')[:15]:
                    print(f"  {line.strip()}")

    # Check Location CardDefs
    loc_defs_file = f"backend/arkham-api/library/Arkham/Location/CardDefs/EdgeOfTheEarth/{mod_name}.hs"
    if not os.path.exists(loc_defs_file):
        # Maybe grouped or named differently
        loc_defs_candidates = glob.glob(f"backend/arkham-api/library/Arkham/Location/CardDefs/EdgeOfTheEarth/*{mod_name}*.hs")
        if loc_defs_candidates:
            loc_defs_file = loc_defs_candidates[0]

    if os.path.exists(loc_defs_file):
        with open(loc_defs_file, 'r', encoding='utf-8') as f:
            loc_content = f.read()
        codes = re.findall(r'"(08\d{3}[a-z]?)"', loc_content)
        print(f"Scenario Locations ({len(codes)} cards):")
        for c in sorted(set(codes)):
            c_info = card_map.get(c, {})
            name = c_info.get('name', 'Unknown')
            subname = c_info.get('subname')
            full = f"{name} ({subname})" if subname else name
            traits = c_info.get('traits', '')
            print(f"  - {c}: {full} [{traits}]")
    else:
        print(f"Loc defs not directly matched: {loc_defs_file}")
