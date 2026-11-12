# Retranslate Vietnamese Act/Agenda cards from the English source

Status: completed (100% finished with 0 audit flags across all 698 cards). Date: 2026-11-12.

## Problem

The Vietnamese act/agenda translations were not translated from the real card text. Many were written from memory or guessed. An audit against `frontend/public/cards_en.json` flagged **639 of 698** act/agenda cards (1,799 fields). The errors fall into these groups:

| Error type | Example |
|---|---|
| Rules invented | 81002 back "Darkened Skies" (shuffle discard, move The Rougarou…) became "Rougarou Đi Săn: Spawn The Rougarou at a random location". |
| Wrong objective or resolution | 02047: wrong Objective text, `(→R2)` instead of `(→R3)`. |
| Back side invented where none exists | 82002 has no back in English, but vi has "Bóng Đen Nhật Thực" plus text and flavor (~155 fields). |
| Flavor summarized or made up | ~1,200 fields shorter than 60% of the English length (81002 flavor reduced to one generic sentence). |
| Wrong numbers or icons | ~490 fields with different numbers (doom, clues, test difficulty), ~200 with different `[icon]` tokens. |
| Copied from another card | 02119/02120/02121 share one text (~270 fields). |
| Not translated | ~120 fields still in English. |

Agendas 04044 and 04045 were already fixed by hand and can serve as the quality reference.

## Goal and acceptance criteria

- Every act/agenda field present in English (`name`, `text`, `flavor`, `back_name`, `back_text`, `back_flavor`) has a **complete, faithful** Vietnamese translation. No summarizing, no added sentences.
- Fields that are empty in English are **empty in Vietnamese**. Remove invented back sides.
- Numbers, `[icon]` tokens, `<b>…</b>`/`<i>…</i>` tags, `(→R1)` resolution markers and line breaks (`\n`) match the English exactly.
- `python plans/261112-1432-retranslate-acts-agendas-vi/audit_acts_agendas.py frontend` reports no `nums`, `icons`, `presence`, `dup` or `untranslated` flags. Any remaining `len ratio` flag must be checked by hand and be justified.
- `npm test` in `frontend/` has no new failures. Two failures are known and pre-existing: the hardcoded English scenario text test and the Chinese Ultimatum/Boon test.

## Inputs prepared for you

`worklist/*.json` contains one file per translation source file. Each entry has:

```json
{ "code": "02047", "type": "act", "pack": "dwl", "scenario": "Extracurricular Activity",
  "source_file": "acts_agendas_dunwich.py",
  "audit_flags": ["back_text: nums en=['3'] vi=['2']", "..."],
  "en": { "name": "...", "text": "...", "flavor": "...", "back_name": "...", "back_text": "...", "back_flavor": "..." },
  "vi_current": { "...": "current (often wrong) Vietnamese" } }
```

- **Always translate from `en`.** Use `vi_current` only to reuse good wording and card names. Never trust its content.
- Files `acts_agendas_*.json` map to the existing `frontend/scripts/translations/acts_agendas_*.py`.
- Files `NEW_<pack>.json` (107 cards: core_2026, tdcc, film_fatale, guardians, wgd, uad, rttcu, …) are **already scaffolded** in `frontend/scripts/translations/acts_agendas_extra.py`, which is registered in `apply_encounter_translations.py`. Every value there is still the English source, followed by a `# TODO vi` comment. Translate each value in place and delete its `# TODO vi` comment. Values set to `""` are invented back sides; keep them empty. Finish this file before running apply. Once you are done, `grep -c "TODO vi" acts_agendas_extra.py` must return 0.
- Cards with no audit flags (59) can stay, but do a quick spot-check.

## Translation rules

1. Translate the full text, sentence by sentence. Flavor text is literary prose, so keep the tone; do not compress it.
2. Keep these English as in existing vi cards: card names inside rules text (`The Rougarou`, `Poisoned`, `Agents of Yig`), encounter set names, traits in `[[Trait]]`, keywords such as `<b>Objective</b>`, `<b>Forced</b>`, `<b>Explore.</b>`, `<b>Resign.</b>`. See `frontend/scripts/keep_proper_names_english_vi.py` for the list it enforces.
3. Use the game terms already used across `cards_vi.json`: doom, clue, damage, horror, threat area, encounter deck, chồng bài encounter bỏ, điều tra viên, advance, spawn, kiểm tra [willpower] (3), Lead Investigator → điều tra viên dẫn đầu. Prefer consistency with existing cards over a new term.
4. The `name`/`back_name` fields are translated (title case, as in the current data). Keep a good existing `name`; fix only a wrong one. `back_name` must translate the English `back_name`, which differs from `name` for agendas and acts.
5. Do not touch `real_*` fields or non-text fields.

## Steps

Process one `worklist` file at a time, smallest first, and commit after each so mistakes are easy to revert.

1. For each entry, write the new Vietnamese fields into the matching `.py` dict entry (`"code": { "name": ..., "flavor": ..., ... }`). Set fields that are missing in English to `""` so apply clears the invented ones.
   - **Note:** `apply_encounter_translations.py` skips keys whose value is `None` but writes `""`. Check this once on 82002.
2. Apply:
   ```bash
   cd frontend && python scripts/apply_encounter_translations.py
   ```
   This writes `public/cards_vi.json` and runs `slim-cards.cjs`, which regenerates `public/cards/cards_vi.json` with `.gz` and `.br`.
3. Re-run the post-processors so proper names and self-references stay consistent:
   ```bash
   python scripts/keep_proper_names_english_vi.py --apply
   python scripts/align_self_references_vi.py --apply
   node scripts/slim-cards.cjs
   ```
   Review their report files. They must not revert your text to the old version.
4. Audit:
   ```bash
   python ../plans/261112-1432-retranslate-acts-agendas-vi/audit_acts_agendas.py .
   ```
   Fix every flag for the cards you processed.
5. Update `frontend/scripts/card_translation_cache.json` for the changed strings if those codes appear there. `translate_encounter_cards.py` and `translate_flavor_texts.py` read this cache and could otherwise reintroduce old text.
6. When all files are done: run `npm test`, then `npm run build` (refreshes `frontend/dist`). Hover a few cards in game (81002, 02047, 82002, 04044) and check both sides.

## Suggested order (cards in file, flagged)

core 17/9 · tic 30/30 · eote 37/37 · tcu 37/37 · tde 42/42 · fhv 48/47 · dunwich 56/39 · carcosa 61/61 · tsk 63/63 · tfa 88/87 · standalones 112/111 · extra (NEW_*) 107/79.

## Risks

- **Post-processors can overwrite your text.** `keep_proper_names_english_vi.py` and `align_self_references_vi.py` rewrite card names. Check their diffs.
- **Codes with suffixes** (`01121a`, `50026a`) are separate cards. Translate each from its own English entry.
- **Rollback:** `git checkout -- frontend/public/cards_vi.json frontend/public/cards frontend/scripts/translations`.

## Decisions

- The `NEW_*` packs are translated too (user decision, 2026-11-12).
- After Gemini finishes, Claude reviews the result: it runs the audit script and spot-checks translations against `en`.
