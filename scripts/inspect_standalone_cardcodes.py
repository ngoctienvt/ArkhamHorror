import os
import re

card_def_dirs = [
    'backend/arkham-api/library/Arkham/Location/CardDefs',
    'backend/arkham-api/library/Arkham/Location/CardDefs/SideStory',
]

scenarios = [
    ('CurseOfTheRougarou', '81001'),
    ('CarnevaleOfHorrors', '82001'),
    ('FortuneAndFolly', '88001'),
    ('MachinationsThroughTime', '87001'),
    ('WarOfTheOuterGods', '86001'),
    ('TheMidwinterGala', '71001'),
    ('FilmFatale', '72001'),
    ('TheLabyrinthsOfLunacy', '70001'),
    ('MurderAtTheExcelsiorHotel', '84001'),
    ('TheBlobThatAteEverything', '85001'),
]

for name, code in scenarios:
    # search for file
    found = None
    for root, dirs, files in os.walk('backend/arkham-api/library/Arkham/Location'):
        for f in files:
            if f.lower() == f"{name.lower()}.hs":
                found = os.path.join(root, f)
                break
        if found:
            break
    
    print(f"\n=== {name} ({code}) ===")
    if found:
        with open(found, 'r', encoding='utf-8', errors='ignore') as fp:
            c = fp.read()
        matches = re.findall(r'(\w+)\s*=\s*(?:location|locationWithUnrevealed|storyOnBack\s*\$\s*location|location_)\s*"(\w+)"\s*(?:\([^\)]+\)|"([^"]+)")', c)
        for var, ccode, title in matches:
            print(f"  {var} -> {ccode} ({title})")
        if not matches:
            # find all string pairs
            matches2 = re.findall(r'"(\d{5})"\s+"([^"]+)"', c)
            for ccode, title in matches2:
                print(f"  {ccode}: {title}")
    else:
        print("  CardDef file not found directly.")
