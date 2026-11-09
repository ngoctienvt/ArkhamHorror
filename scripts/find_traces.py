import glob, os, re

files = glob.glob('backend/arkham-api/library/Arkham/Scenario/Scenarios/**/*.hs', recursive=True)
for f in files:
    with open(f, 'r', encoding='utf-8') as fl:
        txt = fl.read()
    if '73001' in txt or 'TracesToNowhere' in f or 'traces to nowhere' in txt.lower():
        print("Found:", f)
