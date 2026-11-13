# Asset plan for Codex: Obsidian Canyons (The Drowned City)

This file is self-contained. Everything Codex needs is here; do not read any other plan file and do not edit game code. Only produce images and drop them into the folders listed below.

## 1. Purpose

Obsidian Canyons is a sky-city: a rectangular grid of floating summit locations of R'lyeh, with cells of empty 'open sky' between them. Locations are placed, swapped, slid by wind and rebuilt during play, so the old single painting is being replaced by an empty sky background plus one sprite per location, a face-down 'Summit' tile, an 'open sky' tile and a wind overlay. Open sky often fills more than half of the grid, so the open-sky tile must be very faint and must never compete with real locations.

The game draws one sprite per location, in the grid cell the server assigns, over an EMPTY background. So: **the background has no landmarks at all**, and **every sprite is a single freestanding piece on a transparent background**. Each location shown must match its real card art.

## 2. Art style

Painterly digital oil painting that matches the card art of the Arkham Horror LCG (Fantasy Flight Games): soft brush texture, moody Lovecraftian palette, readable at a small size. No photorealism, no cartoon outlines, no pixel art, no 3D render look.

Setting: the drowned city R'lyeh risen into the storm: floating cyclopean black-obsidian architecture, thorn-like black spires, non-Euclidean masonry, ochre-orange and acid-green storm light.

Hard rules for every image: no text, no letters, no card frame, no icons, no logos, no watermark, no signature, no people, no creatures (unless the card art itself shows a fixed statue or skeleton as part of the scenery).

## 3. Output list (exact names, sizes, folders)

Sprite folder: `frontend/public/img/scenes/the-drowned-city/obsidian-canyons/`  
Background file: `frontend/public/img/scenes/the-drowned-city/obsidian-canyons-sky.webp`

| File | Size (px) | Format | Notes |
|---|---|---|---|
| `frontend/public/img/scenes/the-drowned-city/obsidian-canyons/11648.webp` | 768×512 (3:2) | WebP q85, alpha | R'lyeh Streets (single-sided start location). Always face up. |
| `frontend/public/img/scenes/the-drowned-city/obsidian-canyons/11649.webp` | 768×512 (3:2) | WebP q85, alpha | Central Spire.  |
| `frontend/public/img/scenes/the-drowned-city/obsidian-canyons/11650.webp` | 768×512 (3:2) | WebP q85, alpha | Floating Spire.  |
| `frontend/public/img/scenes/the-drowned-city/obsidian-canyons/11651.webp` | 768×512 (3:2) | WebP q85, alpha | Western Wall.  |
| `frontend/public/img/scenes/the-drowned-city/obsidian-canyons/11652.webp` | 768×512 (3:2) | WebP q85, alpha | Ancient Dome.  |
| `frontend/public/img/scenes/the-drowned-city/obsidian-canyons/11653.webp` | 768×512 (3:2) | WebP q85, alpha | Eastern Athenaeum (the file is also used for Western Athenaeum `11654`, whose card art is identical).  |
| `frontend/public/img/scenes/the-drowned-city/obsidian-canyons/11655.webp` | 768×512 (3:2) | WebP q85, alpha | Obsidian Cliffs.  |
| `frontend/public/img/scenes/the-drowned-city/obsidian-canyons/11656.webp` | 768×512 (3:2) | WebP q85, alpha | Suspended Reef.  |
| `frontend/public/img/scenes/the-drowned-city/obsidian-canyons/11657.webp` | 768×512 (3:2) | WebP q85, alpha | Hanging Ship.  |
| `frontend/public/img/scenes/the-drowned-city/obsidian-canyons/11658.webp` | 768×512 (3:2) | WebP q85, alpha | Ancient Canyons.  |
| `frontend/public/img/scenes/the-drowned-city/obsidian-canyons/11659.webp` | 768×512 (3:2) | WebP q85, alpha | Dazzling Skyline.  |
| `frontend/public/img/scenes/the-drowned-city/obsidian-canyons/11660.webp` | 768×512 (3:2) | WebP q85, alpha | Aerial Waterfall.  |
| `frontend/public/img/scenes/the-drowned-city/obsidian-canyons/11661.webp` | 768×512 (3:2) | WebP q85, alpha | Magnetic Spires.  |
| `frontend/public/img/scenes/the-drowned-city/obsidian-canyons/11662.webp` | 768×512 (3:2) | WebP q85, alpha | Glyph Orrery (single-sided, always face up). Always face up. |
| `frontend/public/img/scenes/the-drowned-city/obsidian-canyons/summit-back.webp` | 512×512 (square) | WebP q85, alpha | Face-down Summit tile (every unrevealed summit location). Reference: card back `11649b` (identical to `11660b`). |
| `frontend/public/img/scenes/the-drowned-city/obsidian-canyons/open-sky.webp` | 768×512 (3:2) | WebP q85, alpha | Open sky tile. NO card art exists (`xsky` is the code of the Open Sky location, which has no printed card): invent it, see section 5 (revision 2: cool, bright, opaque). |
| `frontend/public/img/scenes/the-drowned-city/obsidian-canyons/wind-streaks.webp` | 1920×1080 | WebP q82, alpha | Overlay: faint horizontal wind/cloud streaks, tileable horizontally, no focal point. |
| `frontend/public/img/scenes/the-drowned-city/obsidian-canyons-sky.webp` | ≥2560×1440 (16:9) | WebP q88, no alpha | Empty background. |

Generate sprites at **1536×1024**, backs at **1024×1024**, the background at **1536×864**, then resize in post-processing (section 8). Keep the original PNGs OUTSIDE `frontend/public/` (use `art-src/obsidian-canyons/`).

## 4. Reference art (card art wins over any text below)

Real card art: `https://assets.arkhamhorror.app/img/arkham/cards/<code>.avif` (750×1050 card). Convert to PNG and crop the art window. A trailing `b` is the other face of the card. Use at most 8 references per Codex call; normally exactly one reference per sprite (its own card). If a prompt below disagrees with what you see in the reference, **follow the reference**.

```python
# fetch_refs.py  (pip install pillow; if Image.open fails on AVIF: pip install pillow-avif-plugin)
import sys, urllib.request, pathlib
from PIL import Image
out = pathlib.Path('art-src/obsidian-canyons/refs'); out.mkdir(parents=True, exist_ok=True)
for code in sys.argv[1:]:
    p = out / f'{code}.avif'
    urllib.request.urlretrieve(f'https://assets.arkhamhorror.app/img/arkham/cards/{code}.avif', p)
    im = Image.open(p).convert('RGB'); w, h = im.size
    im.save(out / f'{code}.png')
    im.crop((0, int(h*0.09), w, int(h*0.50))).save(out / f'{code}-art.png')  # art window only: use THIS as --reference
```

Codes to fetch: `11648 11649 11650 11651 11652 11653 11655 11656 11657 11658 11659 11660 11661 11662 11649b`. Look at each `*-art.png` before generating; if the crop cuts the painting, adjust the crop box.

## 5. Prompts

Every sprite prompt is the TEMPLATE with `@SUBJECT@` replaced by the line in the table. Save it as `art-src/obsidian-canyons/prompts/<code>.txt`.

TEMPLATE:
```text
Painterly Arkham Horror LCG map sprite, high 3/4 angle, 3:2 landscape, 1536x1024, transparent background with true PNG alpha (if the tool cannot output alpha, use a perfectly flat pure #FF00FF magenta background with no shadow or gradient). Redraw the attached card illustration as a single freestanding location piece, using its architecture, props and dominant colors. The location fills 75-85% of the frame, with a readable silhouette at 150 px wide and a small clear flat spot at the lower center for a tiny standing figure. Thin irregular ground at most, edges clean. Omit card frame, text, icons, logos, watermark, people, living creatures, sky, horizon line, generic round rock islands and empty platforms. Setting: the drowned city R'lyeh risen into the storm: floating cyclopean black-obsidian architecture, thorn-like black spires, non-Euclidean masonry, ochre-orange and acid-green storm light. @SUBJECT@
```

| Code | Card | SUBJECT (written after looking at the card art) |
|---|---|---|
| `11648` | R'lyeh Streets (single-sided start location) | A gold-lit cyclopean alley: a tall black angular doorway slab leaning on the left, black thorn-like coral spires and bare twisted black trees, molten amber light pooling on the stone floor. Palette amber/ochre and black. |
| `11649` | Central Spire | A lone dark tilted tower rising from a field of black spikes, crowned by a swirling acid-green vortex of smoke and light; olive-ochre glow. Accent acid green. |
| `11650` | Floating Spire | Jagged dark rock spires at dusk with several broken rock slabs floating in mid-air between them and a few tiny warm lights; purple and burnt orange. Accent dusk purple. |
| `11651` | Western Wall | A massive moss-covered cyclopean cliff wall veined with glowing yellow-green lines, a thin waterfall falling at its right, black thorn spikes at the base; olive and grey-green. |
| `11652` | Ancient Dome | A low stepped dome of black stone with tall dark pillars behind it and one small orange lantern glow at the left; cold slate blue-grey. |
| `11653` | Eastern Athenaeum (the file is also used for Western Athenaeum `11654`, whose card art is identical) | A giant organic pine-cone-shaped tower of green and gold scales wrapped by curved black blades, standing in green mist, orange thorn forest behind. Accent green-gold. |
| `11655` | Obsidian Cliffs | A dark green-black sheer obsidian cliff with brown overgrown ruined masonry at the left and a faint trickle of water; murky and heavy. Accent murky brown-green. |
| `11656` | Suspended Reef | A huge purple-black coral-like arch of rock hanging in the air, pale lavender-pink light glowing under and through it, a thin waterfall at the right. Accent lavender. |
| `11657` | Hanging Ship | A spiked wooden sailing ship stranded and tilted on top of a narrow rock tower, pale crystal spikes at the left, burning orange sunset behind. Accent sunset orange. It slides between cells in play, so keep it a compact piece. |
| `11658` | Ancient Canyons | Narrow dark vertical canyon walls of black spikes and tendrils, shafts of yellow-green light fanning down from above. Accent yellow-green rays. |
| `11659` | Dazzling Skyline | A blinding yellow-orange sun haze above a skyline of black thorn spires with a pale blue-grey tower at the left. Accent blinding yellow-orange. |
| `11660` | Aerial Waterfall | A giant hooded dark elder-god head carved into a cliff, water pouring from its mouth like a tentacle into green mist, orange thorn forest behind. Accent orange and green. |
| `11661` | Magnetic Spires | Black spires wrapped by crackling electric-green arcs and dark smoke. Accent electric green. |
| `11662` | Glyph Orrery (single-sided, always face up) | A teal-cyan holographic orrery of orbiting spheres with one glowing glyph hovering over a pale hexagonal pedestal on dark machinery. Accent cyan. Draw the glyph as an abstract swirl, never readable text. |

### Summit back tile (reference `11649b-art.png`, size 1024x1024)

```text
Simple game map tile seen from a high 3/4 angle, isolated on a fully TRANSPARENT background (or flat pure #FF00FF), square canvas 1024x1024, painterly Arkham Horror LCG style. A low, plain irregular slab of black obsidian rock with a wide flat top for a small standing figure, edges fading to transparent, lit by a red-orange sunset glow like the attached card back. Deliberately unremarkable: no landmark, no tower, no text, no people. A few thorn-like spikes at the rim only.
```

### Open sky tile (REVISION 2: no reference, size 1536x1024; replaces the first, too faint version)

Role: open sky is EMPTY AIR between the floating summits. Players must read it at a glance as "a gap, you cannot stand here", clearly different from a location, and clearly visible (not faint). The board background is warm ochre-orange and olive; every location sprite is dark, warm, solid rock. So the tile is a COOL, bright, fully opaque patch of stormy sky: pale teal and blue-white cloud with a gentle wind swirl, a crisp irregular torn edge with a thin rim of dark floating obsidian shards, and no ground at all.

```text
Painterly Arkham Horror LCG map tile, 3:2 landscape 1536x1024, on a TRANSPARENT background (or flat pure #FF00FF with no shadow or gradient). A single freestanding irregular patch of OPEN SKY, like a ragged window torn in the sky: a roiling bank of luminous pale teal, steel-blue and blue-white storm cloud with a soft wind spiral curling through it, and a few tiny cold sparks of light deep inside. The patch is fully opaque, bright and clearly readable, with a crisp irregular ragged outline (not feathered, not faded). Along its rim float a few small dark jagged obsidian shards, as if the floating city has been torn away around it. It fills 70-80% of the frame, symmetrical enough to sit in a grid cell. Absolutely NO ground, NO platform, NO flat standing spot, NO tower, NO building, NO ship, NO creature, NO person, NO text, NO frame, NO watermark. Cool teal and blue palette only, so it contrasts with warm orange-red rock. Style: soft brush texture, moody Lovecraftian, matches the Arkham Horror LCG card art.
```

Acceptance for this tile: (1) at 150 px wide on both the dark (#14161c) and the warm orange background it is obviously a sky gap and not a rock island; (2) edges are crisp with alpha 0 at the four corners; (3) no part looks walkable; (4) brightness is clearly above the background (not faint); (5) no text, mark or watermark. Output file stays `open-sky.webp` (768x512, WebP q85, alpha).

### Wind streaks overlay (no reference, size 1920x1080)

```text
Faint horizontal streaks of wind-blown cloud and mist, painterly, on a PURE BLACK background, pale warm-white streaks only, 1920x1080, left and right edges match so it can tile horizontally. Streaks are thin, long and low-contrast, scattered evenly across the whole frame, no focal point, no object, no text.
```

### Background prompt (no reference)

```text
A vast, empty stormy sky seen from high above the clouds, classic Lovecraftian digital oil painting, 16:9 widescreen, 1536x864, matching the painterly style of Arkham Horror LCG card art. One seamless expanse of layered cloud and haze with NO spires, NO buildings, NO city, NO ship, NO figures and NO focal landmark. Deep ochre-orange and olive-green storm light in the upper area, bruised violet and near-black cloud below, faint acid-green flashes only at the far edges, a few tiny out-of-focus dark rock shards near the borders. Low, even lighting; no sun disc, no lens flare, no god rays. CENTER stays calm, dark and low in detail; detail rises gently toward the edges. Uniform composition with no vanishing point so it can be panned, zoomed and cropped in any direction. No text, no watermark.
```

Negative list for the background: `spire, tower, city, building, ruin, ship, sun, moon, planet, creature, tentacle, face, figure, text, logo, watermark, frame, grid, horizon line, center spotlight, lightning bolt in the center`.

## 6. Codex route

```bash
python ~/.codex/skills/generate2dmedia/scripts/route_media.py image --route codex-cli \
  --prompt-file art-src/obsidian-canyons/prompts/<code>.txt \
  --reference art-src/obsidian-canyons/refs/<code>-art.png \
  --size 1536x1024 --out-dir art-src/obsidian-canyons/gen/<code>-v1
```

- The route name `route_media.py` accepts is `codex-cli` (or `local` for any local CLI). The label `local:codex-cli` is internal and the argument parser rejects it.
- Backs: `--size 1024x1024`. Background: no `--reference`, `--size 1536x864`.
- Every attempt goes in a new `-v2`, `-v3` folder; never overwrite.
- Known environment issue: Codex CLI 0.147.0 does not know the `sleep_tool` feature flag that `cli_media.py` disables (`CODEX_DISABLED`, around line 132), so the route can fail with `Unknown feature flag: sleep_tool`. Either upgrade Codex to 0.153+ or run a copy of the skill with `"sleep_tool"` removed from `CODEX_DISABLED`.
- On login or quota errors: stop and report. Do not draw the images with code.

## 7. Per-sprite acceptance checklist

Tick every box before moving a sprite into `frontend/public/`:

- [ ] Same main object, silhouette and dominant colors as the reference card art (check side by side).
- [ ] The location fills 75-85% of the frame; the flat standing spot at lower center is free of detail.
- [ ] Recognizable at 150 px wide on a dark background without a label.
- [ ] Different silhouette or accent color from every other sprite in the set.
- [ ] Transparent background: the four corners and the middle of the top edge have alpha 0 (no baked checkerboard, no magenta fringe, no halo).
- [ ] No text, frame, watermark, sparkle or star mark, signature, person or creature.
- [ ] Clean edges at 768×512 (no jagged alpha, nothing cut off at the border).

## 8. Post-processing (before dropping files in)

```python
# post.py   usage: python post.py in.png out.webp sprite|back|bg|overlay
import sys, numpy as np
from PIL import Image
inp, outp, kind = sys.argv[1:4]
im = Image.open(inp).convert('RGBA'); a = np.array(im)

# 1. Watermark check: look at the bottom-right and top-right 12% corners by eye. Remove a stray mark with
#    cv2.inpaint:  m = np.zeros(a.shape[:2], np.uint8); cv2.circle(m, (x, y), r, 255, -1)
#                  a[..., :3] = cv2.inpaint(a[..., :3], m, 9, cv2.INPAINT_TELEA)

# 2. Keying: only when the image has no real alpha (corner alpha == 255) on sprite/back.
if kind in ('sprite', 'back') and a[0, 0, 3] == 255:
    r, g, b = [a[..., i].astype(int) for i in range(3)]
    dist = np.sqrt((r - 255) ** 2 + g ** 2 + (b - 255) ** 2)        # distance to #FF00FF
    alpha = np.clip((dist - 60) / 80, 0, 1)                           # soft edge
    a[..., 3] = (alpha * 255).astype(np.uint8)
    spill = np.minimum(r, b) - g                                       # despill magenta on edge pixels
    m = (alpha > 0) & (alpha < 1)
    a[..., 0][m] = np.clip(r[m] - spill[m] * 0.6, 0, 255)
    a[..., 2][m] = np.clip(b[m] - spill[m] * 0.6, 0, 255)
im = Image.fromarray(a)

# 3. Overlay layers are drawn pale-on-black: alpha = brightness.
if kind == 'overlay':
    g = np.array(im.convert('L'))
    im = Image.fromarray(np.dstack([np.full_like(g, 235)] * 3 + [g]))

# 4. Resize (Lanczos) and save.
size = {'sprite': (768, 512), 'back': (512, 512), 'bg': (2560, 1440), 'overlay': (1920, 1080)}[kind]
quality = {'sprite': 85, 'back': 85, 'bg': 88, 'overlay': 82}[kind]
im = im.resize(size, Image.LANCZOS)
im.save(outp, 'WEBP', quality=quality, method=6)

# 5. Alpha check (must print 0 0 0 0 0 for sprites/backs/overlays)
if kind != 'bg':
    al = np.array(im)[..., 3]
    print('corner alpha', al[0, 0], al[0, -1], al[-1, 0], al[-1, -1], 'top-mid', al[0, al.shape[1] // 2])
```

Rules: AI output is usually 1024-1536 px, so the background MUST be upscaled (Lanczos) to at least 2560×1440; sprites are downscaled to 768×512. Keep files small (sprite under 250 KB, background under 1.5 MB); lower the WebP quality to 80 if larger.

## 9. Final review (contact sheet)

Build a contact sheet of all sprites at about 150 px wide on a dark (#14161c) background and another on a mid-grey (#5a5a5a) background. You must be able to name every location without labels, the set must look like one painter made it, and no two sprites may share a silhouette or accent color. Then report what you delivered and what you could not match.

## 10. Delivery checklist

- [x] 14 sprites `11648`-`11662` (no `11654`), `summit-back`, `open-sky`, `wind-streaks` in the sprite folder (17 files)
- [x] `obsidian-canyons-sky.webp` background
- [x] Contact sheets (dark and grey) saved next to the PNG originals
- [x] Short report: which sprites needed several attempts and which could not match the card art

## Kết quả (2026-11-13)

- Đã xuất và kiểm tra đủ **18 WebP**. Đã đối chiếu vật thể chính, màu và bóng dáng với tranh lá ở khoảng 150 px.
- [Nền tối](../../art-src/obsidian-canyons/review/sprites-dark.jpg) · [Nền xám](../../art-src/obsidian-canyons/review/sprites-grey.jpg) · [Đối chiếu tranh lá](../../art-src/obsidian-canyons/review/sprites-vs-cards.jpg).
- Không có sprite cần tạo lại. `11662` giữ nét xoáy cyan dạng dấu trừu tượng từ tranh lá. Open Sky được giảm alpha tối đa khoảng 18%. Hai mép ngang của overlay gió cùng trong suốt để lặp theo chiều ngang.
- Tạo bằng ImageGen tích hợp. PNG nguồn và prompt nằm trong `art-src/obsidian-canyons/`. Nền xuất 2560×1440.
