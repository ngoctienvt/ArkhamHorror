# Asset plan for Codex: The Thing in the Depths (The Feast of Hemlock Vale)

Self-contained. Only produce images and drop them into the folders below; do not edit game code and do not read other plan files. The generation route, per-sprite checklist, post-processing script and contact-sheet review are exactly those of `plans/261113-2125-longest-night-dynamic-scene/asset-plan-for-codex.md` (sections 6-9); reuse them with the file lists and prompts below.

## 1. Purpose

In The Thing in the Depths the investigators wade through a sinking bog in Hemlock Vale. The map is a fixed 3×3 grid; every cell holds one bog location and, when the Sinking Ground agenda drowns it, the same cell flips to a card named Open Water. So the game needs, for each of 7 locations, one sprite for the land side and one for its Open Water side, drawn over an EMPTY swamp background. The background has no landmarks at all; each sprite is a single freestanding piece on a transparent background.

Locations are shuffled into cells every game and a location can appear twice in one game, so no sprite may assume a neighbour or a position.

## 2. Art style

Painterly digital oil painting matching the Arkham Horror LCG card art (Fantasy Flight Games): soft brush texture, moody Lovecraftian palette, readable at small size. No photorealism, no cartoon outlines, no pixel art, no 3D render look.

Setting: a misty, drowned cypress swamp at dusk: dark teal water, green algae, rotting boards, lantern glow, sickly red blight in places. Dread, not gore.

Hard rules: no text, no card frame, no icons, no logos, no watermark, no signature, no people, no creatures, no hand-drawn links or arrows between pieces.

Note: three codes can appear twice in one game (`10593`, `10595`, `10596`), so the same sprite may be on screen twice.

## 3. Output list

Sprite folder: `frontend/public/img/scenes/hemlock-vale/thing-in-the-depths/` (note: the old painting `thing-in-the-depths.webp` sits beside this folder; leave it).
Background: `frontend/public/img/scenes/hemlock-vale/thing-in-the-depths-swamp.webp` (≥2560×1440, 16:9, no alpha, WebP q88).
Sprites: 768×512 (3:2), WebP q85, alpha. Generate at 1536×1024, keep originals in `art-src/thing-in-the-depths/` (outside `frontend/public/`).

| File | Card | Notes |
|---|---|---|
| `10593.webp` | Muddy Fen (land) | |
| `10593b.webp` | Open Water of Muddy Fen | |
| `10594.webp` | Tangled Thicket (land) | |
| `10594b.webp` | Open Water of Tangled Thicket | |
| `10595.webp` | Fetid Pool (land) | |
| `10595b.webp` | Open Water of Fetid Pool | |
| `10596.webp` | Flooded Path (land) | |
| `10596b.webp` | Open Water of Flooded Path | |
| `10597.webp` | Abandoned Shack (land) | |
| `10597b.webp` | Open Water of Abandoned Shack | |
| `10598.webp` | Rotten Dock (land) | |
| `10598b.webp` | Open Water of Rotten Dock | |
| `10599.webp` | Covered Bridge (land) | |
| `10599b.webp` | Open Water of Covered Bridge | |

14 sprites + 1 background. There are no face-down tiles in this scenario.

## 4. Reference art

Real card art: `https://assets.arkhamhorror.app/img/arkham/cards/<code>.avif` for `10593a` ... `10599a` (land) and `10593b` ... `10599b` (Open Water). Use the art window as reference, as in the Longest Night plan (script `fetch_refs.py`, crop `0.09-0.50` of the height). Look at every crop first; **the reference decides the object, layout and colours**. If an Open Water card art does not exist, make that sprite from the land card's own colours: the same place seen under dark water, with only its tallest parts (roof, rail, stump, reeds) breaking the surface. The seven Open Water sprites must stay clearly distinct from each other and each must read as "the drowned version of its own land sprite".

## 5. Prompts

Replace `@SUBJECT@` in this template and save each as `art-src/thing-in-the-depths/prompts/<file>.txt`.

TEMPLATE:
```text
Painterly Arkham Horror LCG map sprite, high 3/4 angle, 3:2 landscape, 1536x1024, transparent background with true PNG alpha (if the tool cannot output alpha, use a perfectly flat pure #FF00FF magenta background with no shadow or gradient). Redraw the attached card illustration as a single freestanding location piece, using its props and dominant colors. The piece fills 75-85% of the frame, with a readable silhouette at 120 px wide and a small clear flat spot at the lower center for a tiny standing figure. Edges clean, irregular and soft. Omit card frame, text, icons, logos, watermark, people, living creatures, sky, horizon line, arrows and generic round rock islands. Setting: a misty drowned cypress swamp at dusk, dark teal water, algae, rotting boards, lantern glow, sickly red blight. @SUBJECT@
```

| File | SUBJECT |
|---|---|
| `10593` | A low muddy fen patch of sucking mud, tussocks and reeds. |
| `10594` | A dense knot of tangled thorny thicket and mangrove roots on a small bank. |
| `10595` | A stagnant fetid pool with scum, bubbles and rotting leaves. |
| `10596` | A flooded footpath of half-sunk stepping boards and posts leading into water. |
| `10597` | A leaning abandoned timber shack on stilts with a sagging roof. |
| `10598` | A rotten wooden dock with a moored, half-sunk rowboat. |
| `10599` | A small covered wooden footbridge with a shingle roof. |
| `10593b`-`10599b` | The drowned version of the matching land piece (see section 4): dark open water in the same footprint and colours, ripples, with only the highest parts of the land piece showing above the surface. |

### Background prompt (no reference; 1536x864)

```text
A vast, empty stretch of dark swamp water seen from a high, distant vantage point at dusk, classic Lovecraftian horror digital oil painting, 16:9 widescreen, 1536x864, matching the painterly style of Arkham Horror LCG card art. One seamless expanse of black-teal still water with floating algae, faint mist, a few distant cypress trunks and reeds only at the far borders. NO buildings, NO docks, NO boats, NO bridges, NO lanterns, NO figures and NO focal landmark. Low even lighting; no bursts, no lens flares. CENTER stays calm, dark and low in detail; detail rises gently toward the edges. Uniform composition with no vanishing point so it can be panned, zoomed and cropped. No text, no watermark.
```

Negative list: `dock, boat, bridge, shack, lantern, camp, tent, island, figure, creature, text, logo, watermark, frame, grid, horizon line, center spotlight, moon, sky`.

## 6. Acceptance and delivery

Use the Longest Night checklist (section 7) per sprite, plus: each `b` sprite reads as the drowned twin of its land sprite, and the 14 sprites together can be told apart on a contact sheet at 120 px on `#14161c` and `#5a5a5a` backgrounds (put it in `art-src/thing-in-the-depths/review/`). Deliver 14 sprites + the background + contact sheets, plus a short report: sprites that took several attempts and anything that does not match the card art.
