import os
import json
import sys
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
CARDS_VI_FILE = ROOT / "frontend" / "public" / "cards_vi.json"
SLIM_SCRIPT = ROOT / "frontend" / "scripts" / "slim-cards.cjs"

sys.path.insert(0, str(ROOT / "frontend" / "scripts" / "translations"))

from acts_agendas_core import TRANSLATIONS_CORE_ACTS_AGENDAS
from acts_agendas_dunwich import TRANSLATIONS_DUNWICH_ACTS_AGENDAS
from acts_agendas_carcosa import TRANSLATIONS_CARCOSA_ACTS_AGENDAS
from acts_agendas_tfa import TRANSLATIONS_TFA_ACTS_AGENDAS
from acts_agendas_tcu import TRANSLATIONS_TCU_ACTS_AGENDAS
from acts_agendas_tde import TRANSLATIONS_TDE_ACTS_AGENDAS
from acts_agendas_tic import TRANSLATIONS_TIC_ACTS_AGENDAS
from acts_agendas_eote import TRANSLATIONS_EOTE_ACTS_AGENDAS
from acts_agendas_tsk import TRANSLATIONS_TSK_ACTS_AGENDAS
from acts_agendas_fhv import TRANSLATIONS_FHV_ACTS_AGENDAS
from acts_agendas_standalones import TRANSLATIONS_STANDALONES_ACTS_AGENDAS
from acts_agendas_extra import TRANSLATIONS_EXTRA_ACTS_AGENDAS

def apply_translations(translation_dict, campaign_name="Batch"):
    print(f"Loading {CARDS_VI_FILE}...")
    with open(CARDS_VI_FILE, 'r', encoding='utf-8') as f:
        cards = json.load(f)

    cards_map = {c['code']: c for c in cards}
    applied_count = 0

    for code, t in translation_dict.items():
        if code not in cards_map:
            print(f"Warning: Card {code} not found in cards_vi.json")
            continue
        c = cards_map[code]
        if 'name' in t and t['name'] is not None:
            c['name'] = t['name']
        if 'subname' in t and t['subname'] is not None:
            c['subname'] = t['subname']
        if 'text' in t and t['text'] is not None:
            c['text'] = t['text']
        if 'flavor' in t and t['flavor'] is not None:
            c['flavor'] = t['flavor']
        if 'back_name' in t and t['back_name'] is not None:
            c['back_name'] = t['back_name']
        if 'back_subname' in t and t['back_subname'] is not None:
            c['back_subname'] = t['back_subname']
        if 'back_text' in t and t['back_text'] is not None:
            c['back_text'] = t['back_text']
        if 'back_flavor' in t and t['back_flavor'] is not None:
            c['back_flavor'] = t['back_flavor']
        applied_count += 1

    print(f"Applied {applied_count}/{len(translation_dict)} translations for {campaign_name}.")

    tmp_file = CARDS_VI_FILE.with_suffix('.tmp')
    with open(tmp_file, 'w', encoding='utf-8') as f:
        json.dump(cards, f, ensure_ascii=False, indent=2)
    os.replace(tmp_file, CARDS_VI_FILE)

    print(f"Saved {CARDS_VI_FILE}. Rebuilding slim cards...")
    res = subprocess.run(["node", str(SLIM_SCRIPT), "cards_vi.json"], capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Error rebuilding slim cards: {res.stderr}")
    else:
        print(res.stdout.strip())
        print("Slim cards rebuild complete!")

if __name__ == '__main__':
    batch = sys.argv[1] if len(sys.argv) > 1 else "all"
    to_apply = {}
    name = ""
    if batch == "standalones":
        to_apply = TRANSLATIONS_STANDALONES_ACTS_AGENDAS
        name = "Standalones & Side Scenarios"
    elif batch == "extra":
        to_apply = TRANSLATIONS_EXTRA_ACTS_AGENDAS
        name = "Extra Acts & Agendas (New Packs)"
    else:
        to_apply.update(TRANSLATIONS_CORE_ACTS_AGENDAS)
        to_apply.update(TRANSLATIONS_DUNWICH_ACTS_AGENDAS)
        to_apply.update(TRANSLATIONS_CARCOSA_ACTS_AGENDAS)
        to_apply.update(TRANSLATIONS_TFA_ACTS_AGENDAS)
        to_apply.update(TRANSLATIONS_TCU_ACTS_AGENDAS)
        to_apply.update(TRANSLATIONS_TDE_ACTS_AGENDAS)
        to_apply.update(TRANSLATIONS_TIC_ACTS_AGENDAS)
        to_apply.update(TRANSLATIONS_EOTE_ACTS_AGENDAS)
        to_apply.update(TRANSLATIONS_TSK_ACTS_AGENDAS)
        to_apply.update(TRANSLATIONS_FHV_ACTS_AGENDAS)
        to_apply.update(TRANSLATIONS_STANDALONES_ACTS_AGENDAS)
        to_apply.update(TRANSLATIONS_EXTRA_ACTS_AGENDAS)
        name = "100% of ALL Acts & Agendas (All Campaigns + Standalones)"
    apply_translations(to_apply, name)
