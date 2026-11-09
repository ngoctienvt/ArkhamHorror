import glob, os, re

dirs = [
    'backend/arkham-api/library/Arkham/Location/CardDefs/BrethrenOfAsh',
    'backend/arkham-api/library/Arkham/Location/CardDefs/ChildrenOfBlood',
]

for d in dirs:
    print(f"\n==================== {d} ====================")
    if not os.path.exists(d):
        print("Directory does not exist")
        continue
    for f in sorted(glob.glob(os.path.join(d, '*.hs'))):
        print(f"\n--- File: {os.path.basename(f)} ---")
        with open(f, 'r', encoding='utf-8') as fl:
            txt = fl.read()
        # Find all location declarations
        matches = re.findall(r'(\w+)\s*=\s*(?:location|locationWith[a-zA-Z_]*)\s*(?:[$\(].*?)?"(\d{5}[a-z]?)"\s*(?:\("([^"]+)"\s*<:>\s*"([^"]+)"\)|\"([^\"]+)\")', txt, re.DOTALL)
        if matches:
            for m in matches:
                var_name = m[0]
                code = m[1]
                sub1 = m[2]
                sub2 = m[3]
                title = m[4]
                full_title = f"{sub1}: {sub2}" if sub1 else title
                print(f"  [{code}] {full_title} ({var_name})")
        else:
            # Fallback regex
            all_codes = re.findall(r'"(\d{5}[a-z]?)"', txt)
            print(f"  Codes found: {all_codes}")
