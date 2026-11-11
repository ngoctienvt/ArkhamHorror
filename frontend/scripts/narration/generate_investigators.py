"""Generate Vietnamese narration audio for investigator card back_flavor (biographies).

- Male investigators use 'Đức Trí' (Southern male voice)
- Female investigators use 'Mỹ Duyên' (Southern female voice)
- Outputs to frontend/public/audio/narration/vi/investigators.<code_or_hash>.mp3
- Or investigators.<code_or_unique_id>.mp3
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

INVESTIGATOR_GENDER = {
    '"Ashcan" Pete': 'M',
    '"Skids" O\'Toole': 'M',
    'Agatha Crane': 'F',
    'Agnes Baker': 'F',
    'Akachi Onyele': 'F',
    'Alessandra Zorzi': 'F',
    'Amanda Sharpe': 'F',
    'Amina Zidane': 'F',
    'André Patel': 'M',
    'Bob Jenkins': 'M',
    'Calvin Wright': 'M',
    'Carolyn Fern': 'F',
    'Carson Sinclair': 'M',
    'Charlie Kane': 'M',
    'Cơ Thể của Một Người Yithian': 'M',
    'Daisy Walker': 'F',
    'Daniela Reyes': 'F',
    'Darrell Simmons': 'M',
    'Dexter Drake': 'M',
    'Diana Stanley': 'F',
    'Father Mateo': 'M',
    'Finn Edwards': 'M',
    'Gavriella Mizrah': 'F',
    'George Barnaby': 'M',
    'Gloria Goldberg': 'F',
    'Hank Samson': 'M',
    'Harvey Walters': 'M',
    'Isabelle Barnes': 'F',
    'Jacqueline Fine': 'F',
    'Jenny Barnes': 'F',
    'Jerome Davids': 'M',
    'Jim Culver': 'M',
    'Joe Diamond': 'M',
    'Kate Winthrop': 'F',
    'Kymani Jones': 'F',
    'Kōhaku Narukami': 'M',
    'Leo Anderson': 'M',
    'Lily Chen': 'F',
    'Lola Hayes': 'F',
    'Lucius Galloway': 'M',
    'Luke Robinson': 'M',
    'Mandy Thompson': 'F',
    'Marie Lambeau': 'F',
    'Marion Tavares': 'F',
    'Mark Harrigan': 'M',
    'Michael McGlen': 'M',
    'Miguel de la Cruz': 'M',
    'Minh Thi Phan': 'F',
    'Monterey Jack': 'M',
    'Nathaniel Cho': 'M',
    'Norman Withers': 'M',
    'Patrice Hathaway': 'F',
    'Penny Trắng': 'F',
    'Preston Fairmont': 'M',
    'Rex Murphy': 'M',
    'Rita Young': 'F',
    'Roland Banks': 'M',
    'Sefina Rousseau': 'F',
    'Silas Marsh': 'M',
    'Sister Mary': 'F',
    'Stella Clark': 'F',
    'Tommy Muldoon': 'M',
    'Tony Morgan': 'M',
    'Trish Scarborough': 'F',
    'Ursula Downs': 'F',
    'Valentino Rivas': 'M',
    'Vincent Lee': 'M',
    'Wendy Adams': 'F',
    'William Yorick': 'M',
    'Wilson Richards': 'M',
    'Winifred Habbamock': 'F',
    'Zoey Samaras': 'F',
}

VOICES = {
    'M': 'Đức Trí',
    'F': 'Mỹ Duyên',
}

DARK_FX = ",".join([
    "asetrate=24000*0.92", "aresample=24000", "atempo=1/0.92",
    "bass=g=5:f=120", "treble=g=-4:f=5000", "lowpass=f=7500",
    "aecho=0.8:0.55:55|110|170:0.22|0.13|0.07",
    "acompressor=threshold=-20dB:ratio=3:attack=10:release=250",
    "loudnorm=I=-17:TP=-1.5:LRA=9",
])
PARAGRAPH_PAUSE = 1.1
LEAD_IN = 0.4

def clean_text(raw: str) -> str:
    text = html.unescape(raw)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"[*_]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

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

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Print items without rendering")
    parser.add_argument("--limit", type=int, default=0, help="Limit number of items rendered")
    args = parser.parse_args()

    with open(CARDS_FILE, "r", encoding="utf-8") as f:
        cards = json.load(f)

    inv_cards = [c for c in cards if c.get("type_code") == "investigator" and c.get("back_flavor")]
    print(f"Found {len(inv_cards)} investigator cards with back_flavor.")

    # Distinct texts to render
    # key: text -> { "voice": voice, "hash": h, "cards": [c] }
    unique_items: dict[str, dict] = {}
    for c in inv_cards:
        name = c["name"]
        gender = INVESTIGATOR_GENDER[name]
        voice = VOICES[gender]
        raw_flavor = c["back_flavor"]
        clean = clean_text(raw_flavor)
        h = text_hash(clean, voice)
        
        # Deduplicate identical audio rendering by (clean, voice)
        render_key = f"{voice}::{clean}"
        if render_key not in unique_items:
            unique_items[render_key] = {
                "text": clean,
                "voice": voice,
                "gender": gender,
                "hash": h,
                "primary_code": c["code"],
                "cards": [c],
            }
        else:
            unique_items[render_key]["cards"].append(c)

    print(f"Unique audio files needed: {len(unique_items)}")

    # Load manifest
    manifest = json.loads(MANIFEST_FILE.read_text(encoding="utf-8")) if MANIFEST_FILE.exists() else {"version": 1, "languages": {}}
    vi_manifest = manifest.setdefault("languages", {}).setdefault("vi", {})

    items_to_render = []
    for item in unique_items.values():
        # Check if primary card mp3 exists and has current hash
        primary_key = f"investigators.{item['primary_code']}"
        primary_file = OUT_ROOT / "vi" / f"{primary_key}.mp3"
        needs_render = False
        if not primary_file.exists() or vi_manifest.get(primary_key) != item["hash"]:
            needs_render = True
        
        # Check if any associated card key in manifest is missing
        needs_manifest_update = False
        for c in item["cards"]:
            k = f"investigators.{c['code']}"
            if vi_manifest.get(k) != item["hash"]:
                needs_manifest_update = True

        if needs_render:
            items_to_render.append(item)
        elif needs_manifest_update:
            # File exists, just need to link/copy or update manifest
            for c in item["cards"]:
                k = f"investigators.{c['code']}"
                fpath = OUT_ROOT / "vi" / f"{k}.mp3"
                if not fpath.exists():
                    fpath.write_bytes(primary_file.read_bytes())
                vi_manifest[k] = item["hash"]

    print(f"Items needing TTS render: {len(items_to_render)}")

    if args.dry_run:
        for i, item in enumerate(items_to_render[:10] if not args.limit else items_to_render[:args.limit]):
            codes = [c["code"] for c in item["cards"]]
            names = list({c["name"] for c in item["cards"]})
            print(f"[{i+1}/{len(items_to_render)}] {names[0]} (codes: {codes}) - Voice: {item['voice']} ({item['gender']})")
            print(f"  Hash: {item['hash']} | Chars: {len(item['text'])}")
            print(f"  Preview: {item['text'][:120]}...\n")
        return

    if not items_to_render:
        # Save manifest if updated
        MANIFEST_FILE.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
        print("Everything is up to date!")
        return

    # Initialize VieNeu model
    from vieneu import Vieneu
    print("Loading VieNeu model...")
    vieneu_model = Vieneu()
    preset_voices = {
        "Đức Trí": vieneu_model.get_preset_voice("Đức Trí"),
        "Mỹ Duyên": vieneu_model.get_preset_voice("Mỹ Duyên"),
    }
    print("VieNeu model ready.")

    total_to_do = len(items_to_render) if not args.limit else min(len(items_to_render), args.limit)
    rendered_count = 0

    for i, item in enumerate(items_to_render[:total_to_do]):
        names = list({c["name"] for c in item["cards"]})
        codes = [c["code"] for c in item["cards"]]
        print(f"[{i+1}/{total_to_do}] Rendering {names[0]} (codes: {codes}) with voice '{item['voice']}' ({len(item['text'])} chars)...")

        voice_obj = preset_voices[item["voice"]]
        paragraphs = [p for p in item["text"].split("\n\n") if p.strip()]
        if not paragraphs:
            paragraphs = [item["text"]]

        with tempfile.TemporaryDirectory() as tmp:
            parts = []
            for p_idx, para in enumerate(paragraphs):
                part_file = Path(tmp) / f"{p_idx:03}.wav"
                vieneu_model.save(vieneu_model.infer(text=para, voice=voice_obj), str(part_file))
                parts.append(part_file)

            primary_key = f"investigators.{item['primary_code']}"
            primary_out = OUT_ROOT / "vi" / f"{primary_key}.mp3"
            primary_out.parent.mkdir(parents=True, exist_ok=True)
            master(parts, primary_out)

        # For any duplicate cards with identical text, copy the mastered mp3 file
        primary_bytes = primary_out.read_bytes()
        for c in item["cards"]:
            k = f"investigators.{c['code']}"
            target_out = OUT_ROOT / "vi" / f"{k}.mp3"
            if target_out != primary_out:
                target_out.write_bytes(primary_bytes)
            vi_manifest[k] = item["hash"]

        rendered_count += 1
        # Periodically save manifest
        if rendered_count % 5 == 0 or rendered_count == total_to_do:
            MANIFEST_FILE.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
            print(f"  Saved manifest ({rendered_count}/{total_to_do} rendered).")

    print(f"Done! Successfully rendered {rendered_count} items across {len(inv_cards)} investigator cards.")

if __name__ == "__main__":
    main()
