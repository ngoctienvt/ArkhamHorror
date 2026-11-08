import os
import glob
import json
import re

with open('frontend/public/cards/cards_en.json', 'r', encoding='utf-8') as f:
    cards_en = json.load(f)

card_map = {c['code']: c for c in cards_en if c.get('code', '').startswith('07')}

scenarios_order = [
    ('ThePitOfDespair', '07041', 'The Pit of Despair', 'the-pit-of-despair'),
    ('TheVanishingOfElinaHarper', '07056', 'The Vanishing of Elina Harper', 'the-vanishing-of-elina-harper'),
    ('InTooDeep', '07123', 'In Too Deep', 'in-too-deep'),
    ('DevilReef', '07163', 'Devil Reef', 'devil-reef'),
    ('HorrorInHighGear', '07198', 'Horror in High Gear', 'horror-in-high-gear'),
    ('ALightInTheFog', '07231', 'A Light in the Fog', 'a-light-in-the-fog'),
    ('TheLairOfDagon', '07274', 'The Lair of Dagon', 'the-lair-of-dagon'),
    ('IntoTheMaelstrom', '07311', 'Into the Maelstrom', 'into-the-maelstrom')
]

for mod_name, sc_code, title, slug in scenarios_order:
    print(f"\n=======================================================")
    print(f"[{sc_code}] {title} (slug: {slug})")
    print(f"=======================================================")

    # Read Scenario file
    sc_file = f"backend/arkham-api/library/Arkham/Scenario/Scenarios/TheInnsmouthConspiracy/{mod_name}.hs"
    sc_content = ""
    if os.path.exists(sc_file):
        with open(sc_file, 'r', encoding='utf-8') as f:
            sc_content = f.read()

    # Read Helpers file
    help_file = f"backend/arkham-api/library/Arkham/Scenarios/TheInnsmouthConspiracy/{mod_name}/Helpers.hs"
    help_content = ""
    if os.path.exists(help_file):
        with open(help_file, 'r', encoding='utf-8') as f:
            help_content = f.read()

    # Look for layout in either
    combined = sc_content + "\n" + help_content
    layout_matches = re.findall(r'(\[\s*"\.[^\]]+\])', combined, re.DOTALL)
    if layout_matches:
        for lm in layout_matches:
            print("Layout grid:")
            for line in lm.split('\n'):
                print(f"  {line.strip()}")
    else:
        # Check Pos x y or other grid patterns
        pos_matches = re.findall(r'Pos\s+(-?\d+)\s+(-?\d+)', combined)
        if pos_matches:
            print(f"Grid coordinates (Pos x y) detected: {set(pos_matches)}")
        grid_template = re.findall(r'GridTemplateRow[^\n]+', combined)
        if grid_template:
            print(f"GridTemplateRow: {grid_template}")

    # Find Location CardDefs
    loc_defs_file = f"backend/arkham-api/library/Arkham/Location/CardDefs/TheInnsmouthConspiracy/{mod_name}.hs"
    if os.path.exists(loc_defs_file):
        with open(loc_defs_file, 'r', encoding='utf-8') as f:
            loc_content = f.read()
        codes = re.findall(r'"(07\d{3})"', loc_content)
        print(f"Scenario Locations ({len(codes)} cards):")
        for c in sorted(set(codes)):
            c_info = card_map.get(c, {})
            name = c_info.get('name', 'Unknown')
            subname = c_info.get('subname')
            full = f"{name} ({subname})" if subname else name
            traits = c_info.get('traits', '')
            print(f"  - {c}: {full} [{traits}]")
    else:
        print(f"Loc defs file not found at {loc_defs_file}")
