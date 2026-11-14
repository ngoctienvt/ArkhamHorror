# Fix: Vietnamese narration (TTS) does not match on-screen text

Date: 2026-11-14. Hand-off for Antigravity. Work from the `frontend/` folder.

## Problem

In a game, the Vietnamese story text on screen (e.g. The Path to Carcosa prologue, "Lời mở đầu") is not what the narrator says.

## Root cause (verified)

- The game does not read the screen text aloud. `src/arkham/composables/useNarration.ts` plays pre-rendered mp3 files
  `public/audio/narration/<lang>/<i18n key>.mp3`, listed in `public/audio/narration/manifest.json` (key -> content hash).
- `scripts/narration/generate_narration.py` renders each key from the text in `src/locales/vi/**` and stores
  `text_hash(text, lang, engine, voice)` in the manifest.
- For `thePathToCarcosa.prologue.body` and `.prologue.lola` the manifest hash does NOT equal the hash of the current
  locale text (neither with the Edge nor the VieNeu engine). So the mp3 was rendered from older / different text
  (likely the `.po` files from `arkham-cards-data`) and the locale JSON was edited afterwards.
- Scope check: Carcosa has 93 vi keys, 45 already match the VieNeu hash (engine `vieneu`, voice `Mỹ Duyên`),
  about 48 are stale. Across all campaigns the quick check found 1215 of 1289 vi keys with a different hash,
  but that check used the Edge engine hash, so the real number is unknown: re-measure with the VieNeu hash (step 1).

## Steps

1. Measure the real stale set. For every campaign dir in `src/locales/vi`, call `collect_story(LOCALE_VI, campaign)` and
   compare `text_hash("\n\n".join(paragraphs), "vi", "vieneu", "Mỹ Duyên")` with `manifest.languages.vi[key]`.
   Write the list of stale keys per campaign into `plans/reports/`.
2. Fix the environment so VieNeu runs (see "Environment state" below).
3. Re-render, campaign by campaign, starting with Carcosa:
   `python scripts/narration/generate_narration.py thePathToCarcosa --lang vi --vi-engine vieneu`
   The script skips keys whose hash already matches, so it is safe to re-run and to resume.
   Do not pass `--vi-po` (the locale JSON is the source of truth for what is on screen).
4. Verify per campaign: re-run the step 1 check, expect 0 stale keys. Spot check the Carcosa prologue in the game
   (hard reload, Ctrl+F5, because mp3 URLs are cached per hash `?v=<hash>`).
5. Optional hardening (small): add a test (e.g. in `tests/`) that fails when a vi key present in the manifest has a hash
   different from the current locale text. This prevents the same drift after future locale edits.
6. Commit only `public/audio/narration/**` plus any test/script change. Large mp3 diff, commit per campaign.

## Environment state (already changed on this machine by Claude)

- Python: `python3` = `C:\Users\PC\AppData\Local\Programs\Python\Python313\python.exe`.
- `pip install vieneu` done there. It pulled `huggingface-hub` 1.33 which broke `transformers`;
  pinned back with `pip install "huggingface-hub>=0.34,<1.0"` (now 0.36.2). `from vieneu import Vieneu` imports OK.
- ffmpeg is on PATH (WinGet Links).
- HF cache `~/.cache/huggingface/hub` has `VieNeu-TTS-v3-Turbo` and the ONNX variant of
  `MOSS-Audio-Tokenizer-Nano`, but VieNeu also tries to load the non-ONNX MOSS tokenizer from huggingface.co.
  Offline mode (`HF_HUB_OFFLINE=1`) fails with LocalEntryNotFoundError; online runs timed out reading huggingface.co.
  Try: `HF_HUB_ETAG_TIMEOUT=60 HF_HUB_DOWNLOAD_TIMEOUT=120`, or pre-download with
  `huggingface-cli download OpenMOSS-Team/MOSS-Audio-Tokenizer-Nano` (confirm exact repo id from the traceback), then run offline.
- A partial run was killed; `git status` shows about 27 changed files under `public/audio/narration`.
  Check `git diff --stat` and the manifest: only keys whose manifest hash was updated are finished; others keep the old
  file and old hash, so a re-run retries them. If unsure, `git checkout -- public/audio/narration` and start clean.

## Acceptance criteria

- Step 1 check reports 0 stale vi keys for every campaign (or a documented list of keys that cannot be rendered).
- Carcosa prologue narration in the browser says the same text as the screen.
- No unrelated files changed.

## Unresolved questions

- Is the on-screen text or the audio the intended source of truth? This plan assumes the locale JSON (screen) wins.
- Render all campaigns now (slow, CPU VieNeu, many files) or only campaigns the user plays?
- Was the engine for the older vi files really VieNeu everywhere? Step 1 will show (Edge-rendered keys would never match).
