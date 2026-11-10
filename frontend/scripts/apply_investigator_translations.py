import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
CARDS_VI_FILE = ROOT / "frontend" / "public" / "cards_vi.json"

sys.path.insert(0, str(ROOT / "frontend" / "scripts" / "translations"))

from part1 import TRANSLATIONS_P1
from part2 import TRANSLATIONS_P2
from part3 import TRANSLATIONS_P3
from part4 import TRANSLATIONS_P4
from part5 import TRANSLATIONS_P5

ALL_TRANSLATIONS = {}
ALL_TRANSLATIONS.update(TRANSLATIONS_P1)
ALL_TRANSLATIONS.update(TRANSLATIONS_P2)
ALL_TRANSLATIONS.update(TRANSLATIONS_P3)
ALL_TRANSLATIONS.update(TRANSLATIONS_P4)
ALL_TRANSLATIONS.update(TRANSLATIONS_P5)

def main():
    print(f"Total translations prepared: {len(ALL_TRANSLATIONS)}")

    with open(CARDS_VI_FILE, 'r', encoding='utf-8') as f:
        cards = json.load(f)

    inv_cards = [c for c in cards if c.get('type_code') == 'investigator']
    print(f"Total investigator cards in cards_vi.json: {len(inv_cards)}")

    missing = []
    for c in inv_cards:
        code = c['code']
        if code not in ALL_TRANSLATIONS:
            missing.append(code)

    if missing:
        print(f"ERROR: Missing translations for {len(missing)} cards: {missing}")
        return

    print("SUCCESS: 100% of investigators have translations prepared!")

    # Apply translations to cards_vi.json
    applied_count = 0
    for c in cards:
        if c.get('type_code') == 'investigator':
            code = c['code']
            t = ALL_TRANSLATIONS[code]
            if t.get('subname'):
                c['subname'] = t['subname']
            if t.get('text'):
                c['text'] = t['text']
            if t.get('flavor') is not None:
                c['flavor'] = t['flavor']
            if t.get('back_text') is not None:
                c['back_text'] = t['back_text']
            if t.get('back_flavor') is not None:
                c['back_flavor'] = t['back_flavor']
            applied_count += 1

    print(f"Applied translations to {applied_count} cards.")

    # Write back cards_vi.json
    with open(CARDS_VI_FILE, 'w', encoding='utf-8') as f:
        json.dump(cards, f, ensure_ascii=False, indent=2)

    print(f"Successfully saved updated {CARDS_VI_FILE}")

if __name__ == '__main__':
    main()
