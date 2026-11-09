import os
import re

root = 'backend/arkham-api/library/Arkham/Scenario/Scenarios'
files = [f for f in os.listdir(root) if os.path.isfile(os.path.join(root, f)) and f.endswith('.hs')]

for f in sorted(files):
    path = os.path.join(root, f)
    with open(path, 'r', encoding='utf-8', errors='ignore') as fp:
        content = fp.read()
    
    # search layout patterns
    layout_match = re.search(r'(\w+Layout|initialLayout)\s*::\s*\[GridTemplateRow\]\s*\n\1\s*=\s*\[(.*?)\]', content, re.DOTALL)
    scenario_match = re.search(r'(scenario|sideStory)\s+\w+\s+"([^"]+)"\s+"([^"]+)"\s+\w+\s*(\[.*?\]|\w+)', content, re.DOTALL)
    
    layout_str = None
    if layout_match:
        layout_str = layout_match.group(2).strip()
    elif scenario_match:
        layout_str = scenario_match.group(4).strip()
    
    # Also check if it uses custom layout or placeLocation
    title = f.replace('.hs', '')
    print(f"=== {title} ===")
    if layout_str:
        # print first few lines of layout
        lines = [l.strip() for l in layout_str.splitlines() if l.strip()]
        for l in lines[:6]:
            print(f"  {l}")
    else:
        # search for Grid or place
        print("  (Custom or Dynamic placement)")
