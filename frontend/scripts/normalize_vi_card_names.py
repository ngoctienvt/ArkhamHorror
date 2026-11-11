"""Make Vietnamese card names consistent across cards_vi.json.

Fixes three classes of inconsistency:
  1. Same English card name translated differently on different cards
     (e.g. "Phòng ăn" vs "Phòng Ăn") and mangled version suffixes
     ("(v. Ii)", "(câu Iii)", "(v. Tôi)") -> one canonical name, suffix copied from real_name.
  2. A curated glossary (NAME_OVERRIDES) for names the machine translation got wrong
     (Coterie family, Sanguine Watcher, Amaranth, ...).
  3. A card's own name inside its text being left in English or translated differently
     from the card's name ("Đặc vụ Phe Phái" vs "Đặc vụ Coterie" / "Chất Coterie").
     Known English/garbled self-references are replaced by the canonical name (no machine translation).

Usage:
  python scripts/normalize_vi_card_names.py            # dry run, writes report only
  python scripts/normalize_vi_card_names.py --apply    # rewrite public/cards_vi.json
  --all-text   also rewrite self-references for every card (review the report first!)
Then run `npm run slim-cards` to refresh public/cards/cards_vi.json.
"""
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
CARDS_VI = ROOT / "public" / "cards_vi.json"
REPORT = ROOT / "scripts" / "normalize_vi_card_names.report.txt"

SUFFIX_RE = re.compile(r"\s*\((?:[A-Za-z]|(?:v|c|câu)\.?\s?[A-Za-z]+)\)\s*$", re.IGNORECASE)

# English base name -> canonical Vietnamese base name (wins over majority vote).
# Decision (confirmed with user): "Coterie" is a proper name and stays untranslated,
# matching the [[Coterie]] trait and the Scarlet Keys campaign/scenario locale files.
NAME_OVERRIDES = {
    "Coterie Agent": "Đặc vụ Coterie",
    "Coterie Envoy": "Phái Viên Coterie",
    "Coterie Enforcer": "Người Thực Thi Coterie",
    "Coterie Assassin": "Sát Thủ Coterie",
    "Coterie Provocateur": "Kẻ Khiêu Khích Coterie",
    "Coterie Library": "Thư Viện Coterie",
}

# Known garbled renderings of a card's own name inside card text -> canonical name.
TEXT_VARIANTS = {
    "Coterie Agent": [r"Chất Coterie", r"Đặc vụ Phe Phái"],
    "Coterie Envoy": [r"Phái viên phe phái", r"Phái Đoàn Phe Phái"],
}


def split_suffix(name):
    m = SUFFIX_RE.search(name or "")
    return ((name or "")[: m.start()].strip(), m.group(0).strip()) if m else ((name or "").strip(), "")


def build_canonical(cards):
    """English base -> (canonical vi base, conflicts).

    Only variants that differ by letter case are merged automatically (most frequent wins).
    Variants with different wording are NOT guessed: they are returned as conflicts for review
    and each card keeps its own name. Untranslated (English) names are left alone.
    """
    votes = defaultdict(Counter)
    for c in cards:
        rn, _ = split_suffix(c.get("real_name"))
        vn, _ = split_suffix(c.get("name"))
        if rn and vn and vn.lower() != rn.lower():
            votes[rn][vn] += 1
    canon, conflicts = {}, {}
    for rn, cnt in votes.items():
        groups = defaultdict(Counter)
        for vn, n in cnt.items():
            groups[vn.lower()][vn] += n
        if len(groups) == 1:
            canon[rn] = next(iter(groups.values())).most_common(1)[0][0]
        else:
            conflicts[rn] = dict(cnt)
    canon.update(NAME_OVERRIDES)
    for rn in NAME_OVERRIDES:
        conflicts.pop(rn, None)
    return canon, conflicts


def name_pattern(rn):
    return re.compile(r"(?:\bThe\s+)?" + re.escape(rn) + r"(?:['’]s)?", re.IGNORECASE)


def replace_refs(line, rn, vn):
    """Swap English / garbled self-references for the canonical name (not inside <b>..</b> or [[..]])."""
    pats = [name_pattern(rn)] + [re.compile(v, re.IGNORECASE) for v in TEXT_VARIANTS.get(rn, [])]
    for pat in pats:
        def sub(m):
            before = line[: m.start()]
            if before.endswith("<b>") or before.endswith("[["):
                return m.group(0)
            return vn + ("'s" if m.group(0).lower().endswith(("'s", "’s")) else "")
        line = pat.sub(sub, line)
    return line


def main():
    apply = "--apply" in sys.argv
    cards = json.loads(CARDS_VI.read_text(encoding="utf-8"))
    canon, conflicts = build_canonical(cards)
    report, renamed, edited, unresolved = [], 0, 0, []

    for c in cards:
        for rk, vk in (("real_name", "name"), ("real_back_name", "back_name")):
            rn, rsuf = split_suffix(c.get(rk))
            if rn and rn in canon and (c.get(vk) or "").lower() != (c.get(rk) or "").lower():
                new = canon[rn] + (" " + rsuf if rsuf else "")
                if c.get(vk) != new:
                    report.append(f"NAME {c['code']}: {c.get(vk)!r} -> {new!r}")
                    c[vk] = new
                    renamed += 1

        for rk, tk, nk in (("real_text", "text", "real_name"), ("real_back_text", "back_text", "real_back_name")):
            rn, _ = split_suffix(c.get(nk) or c.get("real_name"))
            vn = split_suffix(c.get("name" if tk == "text" else "back_name") or "")[0]
            if rn in conflicts and not vn.lower() != rn.lower():
                vn = ""
            if not (rn and vn and vn.lower() != rn.lower() and len(rn) > 3 and c.get(rk) and c.get(tk)):
                continue
            # Card titles are not assumed correct (some are mistranslated proper nouns), so text
            # rewriting is limited to confirmed names unless --all-text is passed for review.
            confirmed = rn in NAME_OVERRIDES or "--all-text" in sys.argv
            new = replace_refs(c[tk], rn, vn) if confirmed else c[tk]
            if new != c[tk]:
                report.append(f"TEXT {c['code']} {tk}:\n   old: {c[tk]}\n   new: {new}")
                c[tk] = new
                edited += 1
            want = len(name_pattern(rn).findall(c[rk]))
            have = len(re.findall(re.escape(vn), c[tk], re.IGNORECASE))
            if have < want:
                unresolved.append(f"{c['code']} {rn!r} -> {vn!r} (en {want}x, vi {have}x): {c[tk][:150]!r}")

    report.append(f"\n==== UNRESOLVED ({len(unresolved)}): own name in text differs from card name ====")
    report.extend(unresolved)
    print(f"{renamed} names, {edited} texts changed, {len(unresolved)} unresolved")
    REPORT.write_text("\n".join(report), encoding="utf-8")
    if apply:
        CARDS_VI.write_text(json.dumps(cards, ensure_ascii=False, indent=2), encoding="utf-8")
        print("written", CARDS_VI)


if __name__ == "__main__":
    main()
