import sys
sys.path.insert(0, "scripts/narration")
import json
from pathlib import Path
from narration_text import collect_story
from generate_narration import text_hash, LOCALE_EN, LOCALE_VI, OUT_ROOT, MANIFEST

manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
vi_manifest = manifest["languages"].get("vi", {})

CAMPAIGN_VOICES = {
    "theDunwichLegacy": "Đức Trí",
    "thePathToCarcosa": "Mỹ Duyên",
    "theForgottenAge": "Đức Trí",
    "theCircleUndone": "Mỹ Duyên",
    "theDreamEaters": "Đức Trí",
    "theInnsmouthConspiracy": "Mỹ Duyên",
    "edgeOfTheEarth": "Đức Trí",
    "theScarletKeys": "Đức Trí",
    "theFeastOfHemlockVale": "Mỹ Duyên",
    "theDrownedCity": "Mỹ Duyên",
    "nightOfTheZealot": "Mỹ Duyên",
    "returnToNightOfTheZealot": "Mỹ Duyên",
    "returnToTheDunwichLegacy": "Đức Trí",
    "returnToThePathToCarcosa": "Mỹ Duyên",
    "returnToTheForgottenAge": "Đức Trí",
    "returnToTheCircleUndone": "Mỹ Duyên",
    "darkMatter": "Mỹ Duyên",
    "childrenOfBlood": "Mỹ Duyên",
    "agesUnwound": "Đức Trí",
    "brethrenOfAsh": "Đức Trí",
}

vi_dirs = [p.name for p in LOCALE_VI.iterdir() if p.is_dir()]
results = {}

total_vieneu = 0
total_stale = 0

for c in sorted(vi_dirs):
    story_en = collect_story(LOCALE_EN, c)
    story_vi = collect_story(LOCALE_VI, c)
    if not story_en or not story_vi:
        continue
    voice = CAMPAIGN_VOICES.get(c, "Mỹ Duyên")
    
    matches_vieneu = 0
    matches_edge = 0
    stale_keys = []
    
    for k in sorted(story_en.keys()):
        if k not in story_vi:
            continue
        text = "\n\n".join(story_vi[k])
        h_v = text_hash(text, "vi", "vieneu", voice)
        h_e = text_hash(text, "vi", "edge", "")
        curr = vi_manifest.get(k)
        if curr == h_v:
            matches_vieneu += 1
        elif curr == h_e:
            matches_edge += 1
            stale_keys.append((k, "matches_edge_not_vieneu"))
        else:
            stale_keys.append((k, f"curr={curr}, exp_v={h_v}"))
            
    total_vieneu += matches_vieneu
    total_stale += len(stale_keys)
    results[c] = {
        "total_keys": len(story_en),
        "voice": voice,
        "matches_vieneu": matches_vieneu,
        "matches_edge": matches_edge,
        "stale_count": len(stale_keys),
        "stale_keys": stale_keys
    }

print("Campaign Audit Summary:")
for c, r in results.items():
    tot = r["total_keys"]
    v = r["matches_vieneu"]
    e = r["matches_edge"]
    s = r["stale_count"]
    vc = r["voice"]
    print(f"{c:30} | Total: {tot:3} | VieNeu: {v:3} | Edge: {e:3} | Stale: {s:3} (Voice: {vc})")

print(f"\nOverall: VieNeu Matches = {total_vieneu}, Stale = {total_stale}")

# Save detailed report
report_path = Path("../plans/reports/narration-stale-keys-report.json")
report_path.parent.mkdir(parents=True, exist_ok=True)
report_path.write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Report saved to {report_path}")
