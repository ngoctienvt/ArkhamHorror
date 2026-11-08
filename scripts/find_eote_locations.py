import glob, os, re

files = glob.glob('backend/arkham-api/library/Arkham/Location/CardDefs/EdgeOfTheEarth/*.hs')
all_locs = {}
for f in sorted(files):
    scenario_name = os.path.splitext(os.path.basename(f))[0]
    with open(f, 'r', encoding='utf-8') as fl:
        txt = fl.read()
    # Match pattern:
    # "08xxx" followed by title
    # or location "08xxx" "Title"
    # or ("Hidden Tunnel" <:> "Entrance to the Depths")
    blocks = re.split(r'\n(?=[a-z]\w*\s*::\s*CardDef)', txt)
    for b in blocks:
        code_m = re.search(r'"(08\d{3}[a-z]?)"', b)
        if not code_m:
            continue
        code = code_m.group(1)
        # title
        # match ("Title" <:> "Subtitle") or "Title"
        title_sub = re.search(r'\("([^"]+)"\s*<:>\s*"([^"]+)"\)', b)
        if title_sub:
            title = f"{title_sub.group(1)}: {title_sub.group(2)}"
        else:
            # find all string literals after code
            strings = re.findall(r'"([^"]+)"', b)
            # find first string that is not the code and not "shelter"
            title = "Unknown"
            for s in strings:
                if s != code and s != "shelter" and not s.startswith("08"):
                    title = s
                    # if there is unrevealed title, the second one might be revealed
                    if len(strings) > 3 and "locationWithUnrevealed" in b:
                        # find second non-code string
                        revealed = [st for st in strings if st not in (code, "shelter") and not st.startswith("08")]
                        if len(revealed) >= 2:
                            title = f"{revealed[1]} (unrev: {revealed[0]})"
                    break
        all_locs[code] = (title, scenario_name)

print(f"Total locations found: {len(all_locs)}")
by_scen = {}
for code, (title, scen) in sorted(all_locs.items()):
    by_scen.setdefault(scen, []).append((code, title))

for scen, locs in by_scen.items():
    print(f"\n=== {scen} ({len(locs)}) ===")
    for c, t in locs:
        print(f"  '{c}': {t}")
