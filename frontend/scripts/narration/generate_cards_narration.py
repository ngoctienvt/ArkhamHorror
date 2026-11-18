"""Generate Vietnamese narration audio for all Agenda, Act, and Story cards.

Reads frontend/public/cards_vi.json.
Outputs to frontend/public/audio/narration/vi/cards.<key>.mp3
Updates frontend/public/audio/narration/manifest.json

Usage:
    D:/tools/vieneu/Scripts/python.exe frontend/scripts/narration/generate_cards_narration.py --dry-run
    D:/tools/vieneu/Scripts/python.exe frontend/scripts/narration/generate_cards_narration.py --campaign 01
    D:/tools/vieneu/Scripts/python.exe frontend/scripts/narration/generate_cards_narration.py --pack "Core Set"
    D:/tools/vieneu/Scripts/python.exe frontend/scripts/narration/generate_cards_narration.py --type act --limit 10
"""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path

FRONTEND = Path(__file__).resolve().parents[2]
CARDS_FILE = FRONTEND / "public" / "cards_vi.json"
OUT_ROOT = FRONTEND / "public" / "audio" / "narration"
MANIFEST_FILE = OUT_ROOT / "manifest.json"

DEFAULT_VOICE = "auto"

# Campaign to voice mapping (derived from plans/reports/narration-stale-keys-report.json)
CAMPAIGN_VOICES = {
    # Night of the Zealot / Return
    "01": "Mỹ Duyên",
    "50": "Mỹ Duyên",
    # The Dunwich Legacy / Return
    "02": "Đức Trí",
    "51": "Đức Trí",
    # The Path to Carcosa / Return
    "03": "Mỹ Duyên",
    "52": "Mỹ Duyên",
    # The Forgotten Age / Return
    "04": "Đức Trí",
    "53": "Đức Trí",
    # The Circle Undone / Return
    "05": "Mỹ Duyên",
    "54": "Mỹ Duyên",
    # The Dream-Eaters
    "06": "Đức Trí",
    # The Innsmouth Conspiracy
    "07": "Mỹ Duyên",
    # Edge of the Earth
    "08": "Đức Trí",
    # The Scarlet Keys
    "09": "Đức Trí",
    # The Feast of Hemlock Vale
    "10": "Mỹ Duyên",
    # The Drowned City
    "11": "Mỹ Duyên",
    # Brethren of Ash / Core Set 2026
    "12": "Đức Trí",
    # Children of Blood
    "13": "Mỹ Duyên",
}

def voice_for_card(c: dict, forced_voice: str) -> str:
    if forced_voice and forced_voice != "auto":
        return forced_voice
    code = c.get("code", "").replace("c", "")
    prefix = code[:2]
    return CAMPAIGN_VOICES.get(prefix, "Mỹ Duyên")

DARK_FX = ",".join([
    "asetrate=24000*0.92", "aresample=24000", "atempo=1/0.92",
    "bass=g=5:f=120", "treble=g=-4:f=5000", "lowpass=f=7500",
    "aecho=0.8:0.55:55|110|170:0.22|0.13|0.07",
    "acompressor=threshold=-20dB:ratio=3:attack=10:release=250",
    "loudnorm=I=-17:TP=-1.5:LRA=9",
])
PARAGRAPH_PAUSE = 1.1  # seconds between paragraphs
LEAD_IN = 0.4          # seconds lead-in breath

def clean_speech_text(raw: str | None) -> str:
    """Transform card text / flavor / rules into clean, natural Vietnamese speech text."""
    if not raw:
        return ""
    text = html.unescape(raw)

    # Line break & paragraph tags
    text = re.sub(r"<\s*br\s*/?>", "\n", text, flags=re.I)
    text = re.sub(r"<\s*hr\s*/?>", "\n\n", text, flags=re.I)
    text = re.sub(r"<\s*p\s*>", "", text, flags=re.I)
    text = re.sub(r"<\s*/\s*p\s*>", "\n\n", text, flags=re.I)

    # Resolution arrows: (->R1), (&rarr;R2), (<b>→R1</b>), etc.
    text = re.sub(r"\(?\s*(?:<[^>]+>)*\s*(?:→|->|&rarr;)\s*R(\d+)\s*(?:<[^>]+>)*\s*\)?", r" Chuyển tới Kết cục \1. ", text)
    text = re.sub(r"\(?\s*(?:<[^>]+>)*\s*(?:→|->|&rarr;)\s*(?:<[^>]+>)*\s*", r" Chuyển tới ", text)

    # Bold keywords in Arkham
    text = re.sub(r"<b>\s*(?:Objective|Mục tiêu)\s*</b>\s*(?:—|–|-|:)?\s*", "Mục tiêu: ", text, flags=re.I)
    text = re.sub(r"<b>\s*(?:Forced|Bắt buộc)\s*</b>\s*(?:—|–|-|:)?\s*", "Bắt buộc: ", text, flags=re.I)
    text = re.sub(r"<b>\s*(?:Revelation|Mặc khải)\s*</b>\s*(?:—|–|-|:)?\s*", "Mặc khải: ", text, flags=re.I)
    text = re.sub(r"<b>\s*Spawn\s*</b>\s*(?:—|–|-|:)?\s*", "Xuất hiện: ", text, flags=re.I)
    text = re.sub(r"<b>\s*Prey\s*</b>\s*(?:—|–|-|:)?\s*", "Con mồi: ", text, flags=re.I)
    text = re.sub(r"<b>\s*Action\s*</b>\s*(?:—|–|-|:)?\s*", "Hành động: ", text, flags=re.I)

    # Game tokens & symbols
    replacements = [
        (r"\[action\]\s*:?", "Hành động: "),
        (r"\[fast\]\s*:?", "Hành động nhanh: "),
        (r"\[free-triggered\]\s*:?", "Kích hoạt tự do: "),
        (r"\[reaction\]\s*:?", "Phản ứng: "),
        (r"\[per_investigator\]", "cho mỗi điều tra viên"),
        (r"\[willpower\]", "ý chí"),
        (r"\[intellect\]", "trí tuệ"),
        (r"\[combat\]", "chiến đấu"),
        (r"\[agility\]", "nhanh nhẹn"),
        (r"\[wild\]", "hoang dã"),
        (r"\[skull\]", "đầu lâu"),
        (r"\[cultist\]", "giáo phái"),
        (r"\[tablet\]", "bản đá"),
        (r"\[elder_thing\]", "thực thể cổ xưa"),
        (r"\[auto_fail\]", "tự động thất bại"),
        (r"\[elder_sign\]", "dấu ấn cổ xưa"),
        (r"\[curse\]", "nguyền rủa"),
        (r"\[frost\]", "băng giá"),
    ]
    for pattern, rep in replacements:
        text = re.sub(pattern, rep, text, flags=re.I)

    # Card action terms
    text = re.sub(r"(?<!Star\s)\bSpawn\b", "Xuất hiện", text)
    text = re.sub(r"\badvance\b", "tiến tới", text, flags=re.I)
    text = re.sub(r"\bresign\b", "rút lui", text, flags=re.I)

    # Trait brackets e.g. [[Ghoul]] -> Ghoul, [Monster] -> Monster
    text = re.sub(r"\[\[(.*?)\]\]", r"\1", text)
    text = re.sub(r"\[([A-Z][a-zA-Z_]+)\]", r"\1", text)
    # Remove any unhandled bracket tokens
    text = re.sub(r"\[\w+\]", "", text)

    # Clean HTML tags
    text = re.sub(r"<[^>]+>", " ", text)

    # Formatting symbols
    text = re.sub(r"[*_]", "", text)
    text = re.sub(r"\s*—\s*", ", ", text)
    text = re.sub(r"\s*–\s*", ", ", text)
    text = re.sub(r":\s*,", ":", text)

    # Clean bullet dashes at line starts
    text = re.sub(r"^\s*[-•]\s*", "", text, flags=re.M)

    # Clean multiple spaces & normalize lines
    lines = [re.sub(r"[ \t]+", " ", line).strip() for line in text.split("\n")]
    return "\n".join([line for line in lines if line]).strip()

def text_hash(text: str, voice: str) -> str:
    return hashlib.sha1(
        f"{voice}|{DARK_FX}|{PARAGRAPH_PAUSE}|{LEAD_IN}|vieneu|{text}".encode("utf-8")
    ).hexdigest()[:12]

def master(parts: list[Path], out: Path) -> None:
    inputs = [arg for p in parts for arg in ("-i", str(p))]
    pads = "".join(f"[{i}:a]aresample=24000,apad=pad_dur={PARAGRAPH_PAUSE}[p{i}];" for i in range(len(parts)))
    joined = "".join(f"[p{i}]" for i in range(len(parts)))
    graph = f"{pads}{joined}concat=n={len(parts)}:v=0:a=1,adelay={int(LEAD_IN * 1000)},{DARK_FX}[out]"
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", graph,
         "-map", "[out]", "-ac", "1", "-ar", "24000", "-c:a", "libmp3lame", "-b:a", "48k", "-f", "mp3", str(out)],
        check=True,
    )

def collect_card_targets(cards: list[dict], args) -> list[dict]:
    """Collect all targets (front and back sides) for Act, Agenda, and Story cards."""
    targets = []

    for c in cards:
        kind = c.get("type_code")
        if kind not in ["act", "agenda", "story"]:
            continue

        code = c.get("code", "")
        bare_code = code.replace("c", "")

        # Apply filters
        if args.type and kind != args.type:
            continue
        if args.code and bare_code != args.code.replace("c", ""):
            continue
        if args.campaign:
            camp_prefix = args.campaign.zfill(2)
            if not bare_code.startswith(camp_prefix):
                continue
        if args.pack and args.pack.lower() not in c.get("pack_name", "").lower():
            continue

        # Front side content
        name = clean_speech_text(c.get("name"))
        flavor_raw = c.get("flavor") or ""
        text_raw = c.get("text") or ""

        # For story cards, check if flavor is inside blockquote in text
        if kind == "story" and not flavor_raw and "<blockquote>" in text_raw:
            m = re.search(r"<blockquote><i>(.*?)</i></blockquote>", text_raw, re.DOTALL)
            if not m:
                m = re.search(r"<blockquote>(.*?)</blockquote>", text_raw, re.DOTALL)
            if m:
                flavor_raw = m.group(1).strip()
                text_raw = re.sub(r"<blockquote>.*?</blockquote>", "", text_raw, flags=re.DOTALL).strip()

        flavor = clean_speech_text(flavor_raw)
        rules_text = clean_speech_text(text_raw)

        if name or flavor or rules_text:
            alias_keys = [f"cards.{code}", f"cards.{code}a", f"cards.{code}.a"]
            if bare_code != code:
                alias_keys.extend([f"cards.{bare_code}", f"cards.{bare_code}a", f"cards.{bare_code}.a"])
            targets.append({
                "card": c,
                "kind": kind,
                "side": "a",
                "code": code,
                "primary_key": f"cards.{code}",
                "alias_keys": list(dict.fromkeys(alias_keys)),
                "title": name,
                "flavor": flavor,
                "text": rules_text,
                "pack": c.get("pack_name", ""),
            })

        # Back side content (if present)
        b_name = clean_speech_text(c.get("back_name")) or name
        b_flavor = clean_speech_text(c.get("back_flavor"))
        b_text = clean_speech_text(c.get("back_text"))

        has_back_content = bool(b_flavor or b_text or (c.get("double_sided") and c.get("back_name")))
        if has_back_content:
            back_key = f"cards.{code}b"
            alias_keys = [back_key, f"cards.{code}.b"]
            if bare_code != code:
                alias_keys.extend([f"cards.{bare_code}b", f"cards.{bare_code}.b"])
            if code.endswith("a"):
                base = code[:-1]
                alias_keys.extend([f"cards.{base}b", f"cards.{base}.b"])

            targets.append({
                "card": c,
                "kind": kind,
                "side": "b",
                "code": code,
                "primary_key": back_key,
                "alias_keys": list(dict.fromkeys(alias_keys)),
                "title": b_name,
                "flavor": b_flavor,
                "text": b_text,
                "pack": c.get("pack_name", ""),
            })

    return targets

def build_spoken_paragraphs(target: dict) -> list[str]:
    """Break target title, flavor, and rules/objective text into spoken paragraphs."""
    paragraphs: list[str] = []
    title = target.get("title", "").strip()
    flavor = target.get("flavor", "").strip()
    text = target.get("text", "").strip()

    def add_clean_paragraph(raw: str):
        p = raw.strip()
        # Ensure it has word characters or digits (not just punctuation/brackets)
        if not re.search(r"[a-zA-Z0-9\u00C0-\u1EF9]", p):
            return
        # If paragraph is very long, split on sentence boundaries
        if len(p) > 250:
            sentences = [s.strip() for s in re.split(r"(?<=[.!?…])\s+", p) if s.strip()]
            for s in sentences:
                if re.search(r"[a-zA-Z0-9\u00C0-\u1EF9]", s):
                    paragraphs.append(s)
        else:
            paragraphs.append(p)

    if title:
        t = title if title.endswith((".", "!", "?", "…", ":")) else f"{title}."
        add_clean_paragraph(t)

    if flavor:
        for p in flavor.split("\n"):
            add_clean_paragraph(p)

    if text:
        for p in text.split("\n"):
            add_clean_paragraph(p)

    return paragraphs

def main():
    parser = argparse.ArgumentParser(description="Generate Vietnamese TTS narration for Act, Agenda, and Story cards.")
    parser.add_argument("--dry-run", action="store_true", help="Print targets without rendering")
    parser.add_argument("--limit", type=int, default=0, help="Limit number of items to render")
    parser.add_argument("--campaign", type=str, default="", help="Filter by campaign code (e.g. '01', '02', '50')")
    parser.add_argument("--pack", type=str, default="", help="Filter by pack name (e.g. 'Core Set')")
    parser.add_argument("--type", choices=["act", "agenda", "story"], default="", help="Filter by card type")
    parser.add_argument("--code", type=str, default="", help="Filter by exact card code")
    parser.add_argument("--voice", type=str, default=DEFAULT_VOICE, help=f"VieNeu voice (default: {DEFAULT_VOICE})")
    parser.add_argument("--overwrite", action="store_true", help="Force re-rendering even if hash exists")
    args = parser.parse_args()

    if not CARDS_FILE.exists():
        print(f"Error: {CARDS_FILE} not found.", file=sys.stderr)
        sys.exit(1)

    cards = json.load(open(CARDS_FILE, "r", encoding="utf-8"))
    targets = collect_card_targets(cards, args)
    print(f"Found {len(targets)} card target faces matching criteria.")

    # Deduplicate by (voice, full_text)
    unique_items: dict[str, dict] = {}
    for tgt in targets:
        tgt_voice = voice_for_card(tgt["card"], args.voice)
        paragraphs = build_spoken_paragraphs(tgt)
        full_text = "\n\n".join(paragraphs)
        if not full_text:
            continue

        h = text_hash(full_text, tgt_voice)
        render_key = f"{tgt_voice}::{full_text}"

        if render_key not in unique_items:
            unique_items[render_key] = {
                "text": full_text,
                "paragraphs": paragraphs,
                "voice": tgt_voice,
                "hash": h,
                "primary_key": tgt["primary_key"],
                "targets": [tgt],
            }
        else:
            unique_items[render_key]["targets"].append(tgt)

    print(f"Unique audio items after deduplication: {len(unique_items)}")

    # Load manifest
    manifest = json.loads(MANIFEST_FILE.read_text(encoding="utf-8")) if MANIFEST_FILE.exists() else {"version": 1, "languages": {}}
    vi_manifest = manifest.setdefault("languages", {}).setdefault("vi", {})

    items_to_render = []
    for item in unique_items.values():
        primary_key = item["primary_key"]
        primary_file = OUT_ROOT / "vi" / f"{primary_key}.mp3"
        needs_render = False

        if args.overwrite or not primary_file.exists() or vi_manifest.get(primary_key) != item["hash"]:
            needs_render = True

        needs_manifest_update = False
        for tgt in item["targets"]:
            for k in tgt["alias_keys"]:
                if vi_manifest.get(k) != item["hash"]:
                    needs_manifest_update = True

        if needs_render:
            items_to_render.append(item)
        elif needs_manifest_update:
            # File exists on disk, link aliases & update manifest
            for tgt in item["targets"]:
                for k in tgt["alias_keys"]:
                    fpath = OUT_ROOT / "vi" / f"{k}.mp3"
                    if not fpath.exists() and primary_file.exists():
                        fpath.write_bytes(primary_file.read_bytes())
                    vi_manifest[k] = item["hash"]

    print(f"Items needing TTS render: {len(items_to_render)}")

    if args.dry_run:
        preview_count = min(len(items_to_render), 10) if not args.limit else min(len(items_to_render), args.limit)
        print(f"\n--- Previewing {preview_count} items ---")
        for i, item in enumerate(items_to_render[:preview_count]):
            tgt0 = item["targets"][0]
            print(f"[{i+1}/{preview_count}] {tgt0['kind'].upper()} {tgt0['code']}{tgt0['side']} - {tgt0['title']} [{tgt0['pack']}] - Voice: {item['voice']}")
            print(f"  Primary key: {item['primary_key']} (Total aliases: {sum(len(t['alias_keys']) for t in item['targets'])})")
            print(f"  Hash: {item['hash']} | Paragraphs: {len(item['paragraphs'])} | Total chars: {len(item['text'])}")
            print(f"  Preview paragraphs:")
            for p in item["paragraphs"][:4]:
                print(f"    - {p}")
            print()
        return

    if not items_to_render:
        MANIFEST_FILE.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
        print("All requested card narrations are up to date!")
        return

    # Load VieNeu
    print("Loading VieNeu TTS model...")
    from vieneu import Vieneu
    vieneu_model = Vieneu()
    preset_voices = {
        "Đức Trí": vieneu_model.get_preset_voice("Đức Trí"),
        "Mỹ Duyên": vieneu_model.get_preset_voice("Mỹ Duyên"),
    }
    print("VieNeu model ready.")

    total_to_do = len(items_to_render) if not args.limit else min(len(items_to_render), args.limit)
    rendered_count = 0

    for i, item in enumerate(items_to_render[:total_to_do]):
        tgt0 = item["targets"][0]
        voice_name = item["voice"]
        print(f"[{i+1}/{total_to_do}] Rendering {tgt0['kind'].upper()} {tgt0['code']}{tgt0['side']} - {tgt0['title']} with '{voice_name}' ({len(item['text'])} chars)...", flush=True)

        voice_obj = preset_voices.get(voice_name, preset_voices["Mỹ Duyên"])
        try:
            with tempfile.TemporaryDirectory() as tmp:
                parts = []
                for p_idx, para in enumerate(item["paragraphs"]):
                    wav = vieneu_model.infer(text=para, voice=voice_obj)
                    if wav is None or len(wav) == 0:
                        continue
                    part_file = Path(tmp) / f"{p_idx:03}.wav"
                    vieneu_model.save(wav, str(part_file))
                    if part_file.exists() and part_file.stat().st_size > 100:
                        parts.append(part_file)

                if not parts:
                    print(f"  Warning: No audio produced for {item['primary_key']}, skipping.", flush=True)
                    continue

                primary_key = item["primary_key"]
                primary_out = OUT_ROOT / "vi" / f"{primary_key}.mp3"
                primary_out.parent.mkdir(parents=True, exist_ok=True)
                master(parts, primary_out)

            primary_bytes = primary_out.read_bytes()
            for tgt in item["targets"]:
                for k in tgt["alias_keys"]:
                    target_out = OUT_ROOT / "vi" / f"{k}.mp3"
                    if target_out != primary_out:
                        target_out.write_bytes(primary_bytes)
                    vi_manifest[k] = item["hash"]

            rendered_count += 1
            if rendered_count % 5 == 0 or rendered_count == total_to_do:
                MANIFEST_FILE.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
                print(f"  Saved manifest ({rendered_count}/{total_to_do} rendered).", flush=True)

        except Exception as e:
            print(f"  Error rendering {tgt0['kind'].upper()} {tgt0['code']}{tgt0['side']}: {e}", file=sys.stderr, flush=True)

    print(f"\nDone! Rendered {rendered_count} unique items into {OUT_ROOT}/vi/.", flush=True)

if __name__ == "__main__":
    main()
