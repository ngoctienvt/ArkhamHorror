# Asset plan for Codex: The Lost Sister (The Feast of Hemlock Vale)

This file is self-contained. Everything Codex needs is here; do not read any other plan file and do not edit game code. Only produce images and drop them into the folders listed below.

## 1. Purpose

In The Lost Sister the investigators start at the fishing village Akwan and explore a growing network of coastal caverns: cards from a shuffled Caverns deck are placed one at a time into empty cells next to explored caves. The cave network has a different shape every game, so the old single painting is replaced by an empty cavern background plus one sprite per location and one shared face-down 'Cavern' tile.

The game draws one sprite per location, in the grid cell the server assigns, over an EMPTY background. So: **the background has no landmarks at all**, and **every sprite is a single freestanding piece on a transparent background**. Each location shown must match its real card art.

## 2. Art style

Painterly digital oil painting that matches the card art of the Arkham Horror LCG (Fantasy Flight Games): soft brush texture, moody Lovecraftian palette, readable at a small size. No photorealism, no cartoon outlines, no pixel art, no 3D render look.

Setting: damp coastal caves and a fog-bound fishing harbor in Hemlock Vale, New England: wet rock, bioluminescent fungus, seaweed, weathered wood, Lovecraftian dread.

Hard rules for every image: no text, no letters, no card frame, no icons, no logos, no watermark, no signature, no people, no creatures (unless the card art itself shows a fixed statue or skeleton as part of the scenery).

## 3. Output list (exact names, sizes, folders)

Sprite folder: `frontend/public/img/scenes/hemlock-vale/lost-sister/`  
Background file: `frontend/public/img/scenes/hemlock-vale/lost-sister-caverns.webp`

| File | Size (px) | Format | Notes |
|---|---|---|---|
| `frontend/public/img/scenes/hemlock-vale/lost-sister/10575.webp` | 768×512 (3:2) | WebP q85, alpha | Akwan (village, always face up, start location). Always face up. |
| `frontend/public/img/scenes/hemlock-vale/lost-sister/10576.webp` | 768×512 (3:2) | WebP q85, alpha | Suspended Graveyard. Keep clearly different from 10581 (roots and skeletons vs. skylight chamber). |
| `frontend/public/img/scenes/hemlock-vale/lost-sister/10577.webp` | 768×512 (3:2) | WebP q85, alpha | Hidden Cove.  |
| `frontend/public/img/scenes/hemlock-vale/lost-sister/10578.webp` | 768×512 (3:2) | WebP q85, alpha | Weed-Choked Beach.  |
| `frontend/public/img/scenes/hemlock-vale/lost-sister/10579.webp` | 768×512 (3:2) | WebP q85, alpha | Rocky Shoreline.  |
| `frontend/public/img/scenes/hemlock-vale/lost-sister/10580.webp` | 768×512 (3:2) | WebP q85, alpha | Underground Pools.  |
| `frontend/public/img/scenes/hemlock-vale/lost-sister/10581.webp` | 768×512 (3:2) | WebP q85, alpha | Open Cave.  |
| `frontend/public/img/scenes/hemlock-vale/lost-sister/10582.webp` | 768×512 (3:2) | WebP q85, alpha | Fungal Cave.  |
| `frontend/public/img/scenes/hemlock-vale/lost-sister/10716.webp` | 768×512 (3:2) | WebP q85, alpha | Dry Burrow. 10716-10720 come from the 'Horrors in the Rock' set: 4 of its 6 cards appear in a given game, so all five are needed. |
| `frontend/public/img/scenes/hemlock-vale/lost-sister/10717.webp` | 768×512 (3:2) | WebP q85, alpha | Alkaline Forest.  |
| `frontend/public/img/scenes/hemlock-vale/lost-sister/10718.webp` | 768×512 (3:2) | WebP q85, alpha | Iridescent Passage.  |
| `frontend/public/img/scenes/hemlock-vale/lost-sister/10719.webp` | 768×512 (3:2) | WebP q85, alpha | Overgrown Tunnel.  |
| `frontend/public/img/scenes/hemlock-vale/lost-sister/10720.webp` | 768×512 (3:2) | WebP q85, alpha | Mineral Tunnel.  |
| `frontend/public/img/scenes/hemlock-vale/lost-sister/back.webp` | 512×512 (square) | WebP q85, alpha | Face-down 'Cavern' tile. Reference: card back `10576b` (other caverns such as `10716b` carry the same painting). |
| `frontend/public/img/scenes/hemlock-vale/lost-sister-caverns.webp` | ≥2560×1440 (16:9) | WebP q88, no alpha | Empty background. |

Generate sprites at **1536×1024**, backs at **1024×1024**, the background at **1536×864**, then resize in post-processing (section 8). Keep the original PNGs OUTSIDE `frontend/public/` (use `art-src/lost-sister/`).

## 4. Reference art (card art wins over any text below)

Real card art: `https://assets.arkhamhorror.app/img/arkham/cards/<code>.avif` (750×1050 card). Convert to PNG and crop the art window. A trailing `b` is the other face of the card. Use at most 8 references per Codex call; normally exactly one reference per sprite (its own card). If a prompt below disagrees with what you see in the reference, **follow the reference**.

```python
# fetch_refs.py  (pip install pillow; if Image.open fails on AVIF: pip install pillow-avif-plugin)
import sys, urllib.request, pathlib
from PIL import Image
out = pathlib.Path('art-src/lost-sister/refs'); out.mkdir(parents=True, exist_ok=True)
for code in sys.argv[1:]:
    p = out / f'{code}.avif'
    urllib.request.urlretrieve(f'https://assets.arkhamhorror.app/img/arkham/cards/{code}.avif', p)
    im = Image.open(p).convert('RGB'); w, h = im.size
    im.save(out / f'{code}.png')
    im.crop((0, int(h*0.09), w, int(h*0.50))).save(out / f'{code}-art.png')  # art window only: use THIS as --reference
```

Codes to fetch: `10575 10576 10577 10578 10579 10580 10581 10582 10716 10717 10718 10719 10720 10576b`. Look at each `*-art.png` before generating; if the crop cuts the painting, adjust the crop box.

## 5. Prompts

Every sprite prompt is the TEMPLATE with `@SUBJECT@` replaced by the line in the table. Save it as `art-src/lost-sister/prompts/<code>.txt`.

TEMPLATE:
```text
Painterly Arkham Horror LCG map sprite, high 3/4 angle, 3:2 landscape, 1536x1024, transparent background with true PNG alpha (if the tool cannot output alpha, use a perfectly flat pure #FF00FF magenta background with no shadow or gradient). Redraw the attached card illustration as a single freestanding location piece, using its architecture, props and dominant colors. The location fills 75-85% of the frame, with a readable silhouette at 150 px wide and a small clear flat spot at the lower center for a tiny standing figure. Thin irregular ground at most, edges clean. Omit card frame, text, icons, logos, watermark, people, living creatures, sky, horizon line, generic round rock islands and empty platforms. Setting: damp coastal caves and a fog-bound fishing harbor in Hemlock Vale, New England: wet rock, bioluminescent fungus, seaweed, weathered wood, Lovecraftian dread. @SUBJECT@
```

| Code | Card | SUBJECT (written after looking at the card art) |
|---|---|---|
| `10575` | Akwan (village, always face up, start location) | A weathered grey-brown wooden fishing shack on stilts at a misty harbor, with a crane/derrick and a small empty rowboat, steep misty cliffs behind. Palette cold grey-blue and weathered brown. |
| `10576` | Suspended Graveyard | A cave mouth wrapped in tangled green roots and vines with skeletons hanging from them, glowing orange light pouring in, tiny flame-like specks. Accent orange glow on deep green. |
| `10577` | Hidden Cove | A stormy grey cove with the broken ribs of a wooden shipwreck in the foreground and other wrecks and masts beyond. Muted grey-brown. |
| `10578` | Weed-Choked Beach | A rocky overhang above a beach thick with yellow-green seaweed, blue water at the left. Accent yellow-green. |
| `10579` | Rocky Shoreline | A dark teal beach with foam and gnarled rock tors, an enormous clawed pincer shadow on olive sand. Accent olive and teal. |
| `10580` | Underground Pools | A dark blue cavern with glowing cyan pools and stalagmites. Accent cyan. |
| `10581` | Open Cave | A cave chamber with a skylight hole in the ceiling, warm orange-brown walls, a glowing pale floor patch with golden specks. Accent warm gold. |
| `10582` | Fungal Cave | A dark cavern with glowing yellow-orange strands hanging from the ceiling and clusters of glowing blue mushroom caps on the floor. Accent blue glow and gold strands. |
| `10716` | Dry Burrow | A dry amber-brown burrow with one burning torch at the left, stone pillars and a dark pit on the floor. Accent amber. |
| `10717` | Alkaline Forest | A black cave forest of blood-red dripping curtains and root pillars. Accent red. |
| `10718` | Iridescent Passage | A swirling pastel white-lavender-blue iridescent whirlpool of light forming a winding path. Accent pearl white-blue. |
| `10719` | Overgrown Tunnel | A round tunnel choked with thick brown roots around a black center, tiny mushrooms at the bottom. Accent earth brown. |
| `10720` | Mineral Tunnel | A spiral tunnel of electric-blue crystal shards with one beam of light cutting through. Accent electric blue. |

### Cavern back tile (reference `10576b-art.png`, size 1024x1024)

```text
Simple game map tile seen from a high 3/4 angle, isolated on a fully TRANSPARENT background (or flat pure #FF00FF), square canvas 1024x1024, painterly Arkham Horror LCG style. A low, plain irregular slab of damp dark blue-grey cave rock with a wide flat top for small standing figures, faint blue vein-like cracks and a few tiny blue pebbles as on the attached card back, edges fading to transparent. Deliberately unremarkable: no landmark, no cave mouth, no pool, no text, no people.
```

### Background prompt (no reference)

```text
A vast, empty cave floor seen from a high, distant vantage point, classic Lovecraftian horror digital oil painting, 16:9 widescreen, 1536x864, matching the painterly style of Arkham Horror LCG card art. One seamless expanse of wet dark rock, packed sand and shallow tide-pool glints with NO structures, NO cave mouth, NO boats, NO figures and NO focal landmark. Near-black blue-grey and cold teal, faint seaweed fragments and tiny scattered shells, subtle black water stains, very faint cyan bioluminescent glints only at the far edges. Low even lighting; no bursts, no lens flares. CENTER stays calm, dark and low in detail; detail rises gently toward the edges. Uniform composition with no vanishing point so it can be panned, zoomed and cropped in any direction. No text, no watermark.
```

Negative list for the background: `cave mouth, archway, tunnel, boat, house, tower, skeleton, mushroom cluster, figure, creature, text, logo, watermark, frame, grid, horizon line, center spotlight`.

## 6. Codex route

```bash
python ~/.codex/skills/generate2dmedia/scripts/route_media.py image --route codex-cli \
  --prompt-file art-src/lost-sister/prompts/<code>.txt \
  --reference art-src/lost-sister/refs/<code>-art.png \
  --size 1536x1024 --out-dir art-src/lost-sister/gen/<code>-v1
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

- [x] 13 sprites (10575-10582, 10716-10720) + `back.webp` (14 files)
- [x] `lost-sister-caverns.webp` background
- [x] Contact sheets next to the PNG originals
- [x] Short report: sprites that needed several attempts and anything that does not match the card art

## Kết quả (2026-11-13)

- Đã xuất và kiểm tra đủ **15 WebP**. Đã đối chiếu vật thể chính, màu và bóng dáng với tranh lá ở khoảng 150 px.
- [Nền tối](../../art-src/lost-sister/review/sprites-dark.jpg) · [Nền xám](../../art-src/lost-sister/review/sprites-grey.jpg) · [Đối chiếu tranh lá](../../art-src/lost-sister/review/sprites-vs-cards.jpg).
- Đã dùng bản v2 cho `10582` (Fungal Cave), `10718` (Iridescent Passage) và `10720` (Mineral Tunnel) để bỏ kết cấu gỗ và công trình phát sinh từ bản v1. `10718` dùng dải sáng uốn chữ S làm bề mặt đứng.
- Tạo bằng ImageGen tích hợp. PNG nguồn và prompt nằm trong `art-src/lost-sister/`. Nền xuất 2560×1440.
