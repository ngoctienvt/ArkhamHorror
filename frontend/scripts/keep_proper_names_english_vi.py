"""Keep proper names (places and people) in English inside cards_vi.json.

Rules (confirmed with the user: proper names and place names stay English):
  * every location / enemy_location card: name = real_name
  * unique character-like cards (enemy/asset/story, is_unique, name without "of/the/in/to/from",
    no leading "The"): name = real_name when the Vietnamese name shares a token with the English one
    (e.g. "Penny Trắng", "Đầm Lầy Barnabas") or is close to it (e.g. "Umorrdhoth"),
    plus MANUAL_ENGLISH for names the translation replaced entirely (Neith -> "Không").
  * the old Vietnamese rendering of each such name is replaced with the English name in the
    text of all cards (case-sensitive, whole word, ambiguous renderings skipped).

Usage: python scripts/keep_proper_names_english_vi.py [--apply]
Then: npm run slim-cards
"""
import difflib
import json
import re
import sys
import unicodedata
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CARDS_VI = ROOT / "public" / "cards_vi.json"
REPORT = ROOT / "scripts" / "keep_proper_names_english_vi.report.txt"

LOCATION_TYPES = {"location", "enemy_location"}
CHARACTER_TYPES = {"enemy", "asset", "story"}
CONNECTORS = re.compile(r"\b(of|the|in|to|from|and|a|an)\b", re.IGNORECASE)

# Proper names the machine translation replaced wholesale (no shared token with the English).
MANUAL_ENGLISH = {
    "Neith", "Pantalone", "Brown Jenkin", "Baron Samedi", "The Rougarou", "Mr. Peabody", "Mr. Grey",
    "Nahab", "Narôgath", "Umôrdhoth", "Yog-Sothoth", "Atlach-Nacha", "Kaman-Thah", "Subject 8L-08",
    '"Wolf-Man" Drew', '"Jazz" Mulligan', 'James "Cookie" Fredericks', "Maria DeSilva",
    "Accademia Bridge", "Grand Rue", "Uptown", "Naomi O'Bannion", "Erynn MacAoidh", "Harlan Earnstone", "August Lindquist",
}


def fold(s):
    s = unicodedata.normalize("NFD", s or "").replace("đ", "d").replace("Đ", "D")
    return "".join(ch for ch in s if unicodedata.category(ch) != "Mn").lower()


def tokens(s):
    return set(re.findall(r"[a-z0-9']{3,}", fold(s)))


_COMMON = None


def common_words():
    """Words that appear in lower case somewhere in English card text/flavor = ordinary vocabulary."""
    global _COMMON
    if _COMMON is None:
        words = set()
        for c in json.loads(CARDS_VI.read_text(encoding="utf-8")):
            for f in ("real_text", "real_back_text", "flavor", "back_flavor"):
                words.update(re.findall(r"\b[a-zà-ÿ][a-zà-ÿ']+\b", fold_keep(c.get(f) or "")))
        _COMMON = words
    return _COMMON


def fold_keep(s):
    return unicodedata.normalize("NFC", s)


def has_proper_token(rn, vn):
    """A place is a named place when the old translation kept an uncommon English word verbatim."""
    kept = tokens(rn) & tokens(vn)
    return any(t not in common_words() for t in kept)


def is_person_like(c):
    rn = c.get("real_name") or ""
    return (
        c.get("is_unique")
        and c.get("type_code") in CHARACTER_TYPES
        and not rn.lower().startswith("the ")
        and not CONNECTORS.search(rn)
    )


def should_be_english(c):
    rn, vn = c.get("real_name") or "", c.get("name") or ""
    if not rn or fold(rn) == fold(vn) and rn == vn:
        return False
    if c.get("type_code") in LOCATION_TYPES:
        # only places whose name kept a proper-noun word untranslated (Arkham, Café Luna); descriptive ones (Attic) stay translated
        return has_proper_token(rn, vn) or rn in MANUAL_ENGLISH
    if rn in MANUAL_ENGLISH:
        return True
    traits = c.get("real_traits") or c.get("traits") or ""
    if c.get("type_code") == "asset" and not re.search(r"\b(Ally|Humanoid)\b", traits):
        return False  # objects/companions keep their translated names
    if re.search(r"\b(Monster|Creature)\b", traits):
        return False
    if is_person_like(c):
        shared = tokens(rn) & tokens(vn)
        return bool(shared) or difflib.SequenceMatcher(None, fold(rn), fold(vn)).ratio() >= 0.8
    return False


def main():
    apply = "--apply" in sys.argv
    cards = json.loads(CARDS_VI.read_text(encoding="utf-8"))
    report, changes = [], defaultdict(set)  # old vi name -> {english names}

    for c in cards:
        if should_be_english(c):
            changes[c["name"]].add(c["real_name"])
            report.append(f"NAME {c['code']} [{c.get('type_code')}]: {c['name']!r} -> {c['real_name']!r}")
            if apply:
                c["name"] = c["real_name"]

    # old rendering -> English in all card texts (unambiguous, distinctive names only)
    repl = {}
    for old, eng in changes.items():
        base = re.sub(r"\s*\((?:[A-Za-z]|(?:v|c|câu)\.?\s?[A-Za-z]+)\)\s*$", "", old, flags=re.IGNORECASE)
        eng_base = re.sub(r"\s*\((?:[A-Za-z]|v\.?\s?[IVX]+)\)\s*$", "", next(iter(eng)))
        eng_base = re.sub(r"^The\s+", "", eng_base)  # mid-sentence Vietnamese text: no English article
        if len(eng) == 1 and (len(base.split()) >= 2 or len(base) >= 8) and base != eng_base:
            repl.setdefault(base, set()).add(eng_base)
    repl = {k: next(iter(v)) for k, v in repl.items() if len(v) == 1}
    pats = [(re.compile(r"(?<![\w])" + re.escape(k) + r"(?![\w])"), v, k) for k, v in
            sorted(repl.items(), key=lambda kv: -len(kv[0]))]

    edited = 0
    for c in cards:
        for field in ("text", "back_text"):
            t = c.get(field)
            if not t:
                continue
            new = t
            for pat, eng, _k in pats:
                new = pat.sub(eng, new)
            if new != t:
                edited += 1
                report.append(f"TEXT {c['code']} {field}:\n   old: {t}\n   new: {new}")
                if apply:
                    c[field] = new
    report.insert(0, f"{sum(len(v) for v in changes.values())} name variants -> English, {len(repl)} text renderings, {edited} texts changed")
    print(report[0])
    REPORT.write_text("\n".join(report), encoding="utf-8")
    if apply:
        CARDS_VI.write_text(json.dumps(cards, ensure_ascii=False, indent=2), encoding="utf-8")
        print("written", CARDS_VI)


if __name__ == "__main__":
    main()
