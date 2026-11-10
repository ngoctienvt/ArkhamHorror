import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT = Path(__file__).resolve().parent.parent.parent
CARDS_VI_FILE = ROOT / "frontend" / "public" / "cards_vi.json"
CACHE_FILE = ROOT / "frontend" / "scripts" / "card_translation_cache.json"

TARGET_TYPES = {
    'act', 'agenda', 'location', 'enemy', 'treachery',
    'scenario', 'story', 'key', 'enemy_location'
}

VN_REGEX = re.compile(r'[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]', re.IGNORECASE)

def mask_flavor(text):
    placeholders = {}
    idx = 0

    # 1. [[Trait]]
    def repl_trait(m):
        nonlocal idx
        ph = f'QXZ{idx}QXZ'
        idx += 1
        placeholders[ph] = m.group(0)
        return ph
    text = re.sub(r'\[\[.*?\]\]', repl_trait, text)

    # 2. [token]
    def repl_token(m):
        nonlocal idx
        ph = f'QXZ{idx}QXZ'
        idx += 1
        placeholders[ph] = m.group(0)
        return ph
    text = re.sub(r'\[[a-zA-Z0-9_]+\]', repl_token, text)

    # 3. HTML tags: <i>, </b>, <p>, etc.
    def repl_tag(m):
        nonlocal idx
        ph = f'QXZ{idx}QXZ'
        idx += 1
        placeholders[ph] = m.group(0)
        return ph
    text = re.sub(r'</?[a-zA-Z0-9]+[^>]*>', repl_tag, text)

    return text, placeholders

def unmask_flavor(text, placeholders):
    for ph, orig in placeholders.items():
        pattern = re.escape(ph).replace(r'\_', r'[\_\s]?')
        text = re.sub(pattern, orig, text, flags=re.IGNORECASE)
    text = re.sub(r'  +', ' ', text)
    return text.strip()

def raw_api_translate(text, max_retries=3):
    if not text or not text.strip():
        return text
    url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=' + urllib.parse.quote(text)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    for attempt in range(max_retries):
        try:
            with urllib.request.urlopen(req, timeout=12) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                res = ''.join([p[0] for p in data[0] if p[0]])
                return res
        except Exception:
            if attempt == max_retries - 1:
                return text
            time.sleep(0.5 * (attempt + 1))
    return text

def translate_flavor_string(flavor, cache):
    if not flavor or not flavor.strip():
        return flavor
    clean = flavor.strip()
    if clean in cache:
        return cache[clean]
    
    masked, placeholders = mask_flavor(clean)
    raw = raw_api_translate(masked)
    unmasked = unmask_flavor(raw, placeholders)
    
    cache[clean] = unmasked
    return unmasked

def load_cache():
    if CACHE_FILE.exists():
        try:
            return json.loads(CACHE_FILE.read_text(encoding='utf-8'))
        except Exception:
            return {}
    return {}

def save_cache(cache):
    try:
        CACHE_FILE.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding='utf-8')
    except Exception as e:
        print(f"Error saving cache: {e}")

def main():
    print(f"Loading {CARDS_VI_FILE}...")
    cards = json.loads(CARDS_VI_FILE.read_text(encoding='utf-8'))
    cache = load_cache()
    print(f"Loaded {len(cache)} cached items.")

    flavors_to_translate = set()
    encounter_cards = []

    for c in cards:
        is_target = (
            c.get('type_code') in TARGET_TYPES or
            bool(c.get('encounter_code')) or
            c.get('subtype_code') in ('weakness', 'basicweakness')
        )
        if not is_target:
            continue
        encounter_cards.append(c)

        fl = c.get('flavor')
        if fl and isinstance(fl, str) and fl.strip() and not VN_REGEX.search(fl):
            flavors_to_translate.add(fl.strip())

        bfl = c.get('back_flavor')
        if bfl and isinstance(bfl, str) and bfl.strip() and not VN_REGEX.search(bfl):
            flavors_to_translate.add(bfl.strip())

    print(f"Target encounter cards: {len(encounter_cards)}")
    uncached = [f for f in flavors_to_translate if f not in cache]
    print(f"Total unique flavors needing translation: {len(flavors_to_translate)} (Uncached: {len(uncached)})")

    if uncached:
        print(f"\n--- Translating {len(uncached)} flavors with 10 workers ---")
        done_count = 0
        with ThreadPoolExecutor(max_workers=10) as executor:
            future_to_flavor = {executor.submit(translate_flavor_string, f, cache): f for f in uncached}
            for future in as_completed(future_to_flavor):
                done_count += 1
                if done_count % 100 == 0 or done_count == len(uncached):
                    print(f"Flavor progress: {done_count}/{len(uncached)}")
                    save_cache(cache)
        save_cache(cache)
        print("Flavor translation complete.")

    # Apply back to cards
    print("\nApplying flavor translations to cards...")
    updated_count = 0
    for c in encounter_cards:
        changed = False
        fl = c.get('flavor')
        if fl and isinstance(fl, str) and fl.strip():
            tr = cache.get(fl.strip())
            if tr and tr != fl:
                c['flavor'] = tr
                changed = True

        bfl = c.get('back_flavor')
        if bfl and isinstance(bfl, str) and bfl.strip():
            tr = cache.get(bfl.strip())
            if tr and tr != bfl:
                c['back_flavor'] = tr
                changed = True

        if changed:
            updated_count += 1

    print(f"Updated flavor on {updated_count} cards.")
    CARDS_VI_FILE.write_text(json.dumps(cards, ensure_ascii=False, indent=2) + "\n", encoding='utf-8')
    print("Saved cards_vi.json.")

if __name__ == "__main__":
    main()
