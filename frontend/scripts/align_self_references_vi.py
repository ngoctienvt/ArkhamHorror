"""Make a card's own name inside its Vietnamese text match the card's Vietnamese name.

For every card whose English text mentions its own name N times but whose Vietnamese text
contains the Vietnamese name fewer than N times, look for spans of the Vietnamese text that
are a partial / garbled rendering of the name (e.g. "Hầm" for "Hầm Rượu", "Người theo dõi
Sanguine" for "Người Theo Dõi Đỏ Thẫm") and replace them with the card's name.

Usage: python scripts/align_self_references_vi.py [--apply]
Then: npm run slim-cards
"""
import difflib
import json
import re
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CARDS_VI = ROOT / "public" / "cards_vi.json"
REPORT = ROOT / "scripts" / "align_self_references_vi.report.txt"
SUFFIX_RE = re.compile(r"\s*\((?:[A-Za-z]|(?:v|c|câu)\.?\s?[A-Za-z]+)\)\s*$", re.IGNORECASE)
STOP = {"của", "và", "các", "những", "trong", "tại", "với", "cho", "từ", "một", "hoặc", "ở", "bị", "đã", "the", "of"}
TOKEN_RE = re.compile(r"[^\s<>\[\]()\"“”.,:;!?]+")


def fold(s):
    s = unicodedata.normalize("NFD", s).replace("đ", "d").replace("Đ", "D")
    return "".join(ch for ch in s if unicodedata.category(ch) != "Mn").lower()


def base(name):
    return SUFFIX_RE.sub("", name or "").strip()


def occurrences(text, name):
    return len(re.findall(re.escape(name), text, re.IGNORECASE))


def find_spans(text, vn):
    """Candidate (start, end) spans of `text` resembling vn, best first, not overlapping the exact name."""
    toks = [(m.start(), m.end(), m.group()) for m in TOKEN_RE.finditer(text)]
    name_toks = [fold(t) for t in vn.split()]
    name_set = {t for t in name_toks if t not in STOP and len(t) >= 3}
    exact = [(m.start(), m.end()) for m in re.finditer(re.escape(vn), text, re.IGNORECASE)]
    cands = []
    for i in range(len(toks)):
        for j in range(i, min(i + len(name_toks) + 1, len(toks))):
            s, e = toks[i][0], toks[j][1]
            if any(s < ee and e > es for es, ee in exact):
                continue
            span = text[s:e]
            words = [fold(t[2]) for t in toks[i : j + 1]]
            inner_ok = all(not re.search(r"[:\n]", text[toks[k][1] : toks[k + 1][0]]) for k in range(i, j))
            if not inner_ok or span.lower() == vn.lower():
                continue
            hit = [w for w in words if w in name_set]
            if not hit or words[0] in STOP or words[-1] in STOP:
                continue
            if not toks[i][2][0].isupper() and len(words) == 1:
                continue  # lone lower-case word is ordinary vocabulary
            ratio = difflib.SequenceMatcher(None, fold(span), fold(vn)).ratio()
            # whole span must be made of name words (garbled/partial) or be very close to the name
            coverage = len(hit) / len(words)
            if coverage >= 0.99 or ratio >= 0.75:
                cands.append((len(words) * 10 + ratio, s, e))
    cands.sort(reverse=True)
    return cands


def main():
    apply = "--apply" in sys.argv
    cards = json.loads(CARDS_VI.read_text(encoding="utf-8"))
    report, fixed, left = [], 0, []
    for c in cards:
        for rk, tk, nk, vk in (("real_text", "text", "real_name", "name"), ("real_back_text", "back_text", "real_back_name", "back_name")):
            rn, vn = base(c.get(nk) or c.get("real_name")), base(c.get(vk) or c.get("name"))
            if not (rn and vn and len(rn) > 3 and c.get(rk) and c.get(tk)) or vn.lower() == rn.lower():
                continue
            want = len(re.findall(r"(?:\bThe\s+)?" + re.escape(rn), c[rk], re.IGNORECASE))
            text = c[tk]
            need = want - occurrences(text, vn)
            if need <= 0:
                continue
            used = []
            for _score, s, e in find_spans(text, vn):
                if need <= 0:
                    break
                if any(s < ue and e > us for us, ue in used):
                    continue
                used.append((s, e))
                need -= 1
            new = text
            for s, e in sorted(used, reverse=True):
                new = new[:s] + vn + new[e:]
            if new != text:
                fixed += 1
                report.append(f"FIX {c['code']} {tk} [{vn}]:\n   old: {text}\n   new: {new}")
                if apply:
                    c[tk] = new
            if need > 0:
                left.append(f"{c['code']} {tk} [{rn} -> {vn}] missing {need}: {new[:160]!r}")
    report.append(f"\n==== STILL UNRESOLVED ({len(left)}) ====")
    report.extend(left)
    print(f"{fixed} texts fixed, {len(left)} still unresolved")
    REPORT.write_text("\n".join(report), encoding="utf-8")
    if apply:
        CARDS_VI.write_text(json.dumps(cards, ensure_ascii=False, indent=2), encoding="utf-8")
        print("written", CARDS_VI)


if __name__ == "__main__":
    main()
