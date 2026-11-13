# Asset plan for Codex: The Twisted Hollow (The Feast of Hemlock Vale)

This file is self-contained. Everything Codex needs is here; do not read any other plan file and do not edit game code. Only produce images and drop them into the folders listed below.

## 1. Purpose

In The Twisted Hollow the investigators search the Western Woods at night. Woods cards from a shuffled deck are placed face-down around each location as it is revealed; as the Darkness Level rises, revealed empty locations turn face-down again, and in the second act the whole forest is rebuilt around The Twisted Hollow. The map changes shape and cards flip back to their face-down side, so the old single painting is replaced by an empty forest-floor background plus one sprite per location and one shared face-down 'Western Woods' tile.

The game draws one sprite per location, in the grid cell the server assigns, over an EMPTY background. So: **the background has no landmarks at all**, and **every sprite is a single freestanding piece on a transparent background**. Each location shown must match its real card art.

## 2. Art style

Painterly digital oil painting that matches the card art of the Arkham Horror LCG (Fantasy Flight Games): soft brush texture, moody Lovecraftian palette, readable at a small size. No photorealism, no cartoon outlines, no pixel art, no 3D render look.

Setting: a blighted New England forest at night in Hemlock Vale: moonlit blue-indigo woods, mist, glowing fungi, cosmic corruption leaking through the trees, Lovecraftian dread.

Hard rules for every image: no text, no letters, no card frame, no icons, no logos, no watermark, no signature, no people, no creatures (unless the card art itself shows a fixed statue or skeleton as part of the scenery).

## 3. Output list (exact names, sizes, folders)

Sprite folder: `frontend/public/img/scenes/hemlock-vale/twisted-hollow/`  
Background file: `frontend/public/img/scenes/hemlock-vale/twisted-hollow-woods.webp`

| File | Size (px) | Format | Notes |
|---|---|---|---|
| `frontend/public/img/scenes/hemlock-vale/twisted-hollow/10612.webp` | 768×512 (3:2) | WebP q85, alpha | Glimmering Woods (start location in the campaign).  |
| `frontend/public/img/scenes/hemlock-vale/twisted-hollow/10613.webp` | 768×512 (3:2) | WebP q85, alpha | Blighted Glade.  |
| `frontend/public/img/scenes/hemlock-vale/twisted-hollow/10614.webp` | 768×512 (3:2) | WebP q85, alpha | Poisoned Marsh.  |
| `frontend/public/img/scenes/hemlock-vale/twisted-hollow/10615.webp` | 768×512 (3:2) | WebP q85, alpha | Fecund Thicket.  |
| `frontend/public/img/scenes/hemlock-vale/twisted-hollow/10616.webp` | 768×512 (3:2) | WebP q85, alpha | Mushroom Grove.  |
| `frontend/public/img/scenes/hemlock-vale/twisted-hollow/10617.webp` | 768×512 (3:2) | WebP q85, alpha | Moonlit Clearing.  |
| `frontend/public/img/scenes/hemlock-vale/twisted-hollow/10618.webp` | 768×512 (3:2) | WebP q85, alpha | Crooked Path.  |
| `frontend/public/img/scenes/hemlock-vale/twisted-hollow/10619.webp` | 768×512 (3:2) | WebP q85, alpha | Corpse Grove.  |
| `frontend/public/img/scenes/hemlock-vale/twisted-hollow/10620.webp` | 768×512 (3:2) | WebP q85, alpha | Bear Den.  |
| `frontend/public/img/scenes/hemlock-vale/twisted-hollow/10621.webp` | 768×512 (3:2) | WebP q85, alpha | The Twisted Hollow. Fixed center of the second-act layout: make it the most imposing sprite. |
| `frontend/public/img/scenes/hemlock-vale/twisted-hollow/back.webp` | 512×512 (square) | WebP q85, alpha | Face-down 'Western Woods' tile. Reference: card back `10612b` (identical to `10621b`). |
| `frontend/public/img/scenes/hemlock-vale/twisted-hollow-woods.webp` | ≥2560×1440 (16:9) | WebP q88, no alpha | Empty background. |

Generate sprites at **1536×1024**, backs at **1024×1024**, the background at **1536×864**, then resize in post-processing (section 8). Keep the original PNGs OUTSIDE `frontend/public/` (use `art-src/twisted-hollow/`).

## 4. Reference art (card art wins over any text below)

Real card art: `https://assets.arkhamhorror.app/img/arkham/cards/<code>.avif` (750×1050 card). Convert to PNG and crop the art window. A trailing `b` is the other face of the card. Use at most 8 references per Codex call; normally exactly one reference per sprite (its own card). If a prompt below disagrees with what you see in the reference, **follow the reference**.

```python
# fetch_refs.py  (pip install pillow; if Image.open fails on AVIF: pip install pillow-avif-plugin)
import sys, urllib.request, pathlib
from PIL import Image
out = pathlib.Path('art-src/twisted-hollow/refs'); out.mkdir(parents=True, exist_ok=True)
for code in sys.argv[1:]:
    p = out / f'{code}.avif'
    urllib.request.urlretrieve(f'https://assets.arkhamhorror.app/img/arkham/cards/{code}.avif', p)
    im = Image.open(p).convert('RGB'); w, h = im.size
    im.save(out / f'{code}.png')
    im.crop((0, int(h*0.09), w, int(h*0.50))).save(out / f'{code}-art.png')  # art window only: use THIS as --reference
```

Codes to fetch: `10612 10613 10614 10615 10616 10617 10618 10619 10620 10621 10612b`. Look at each `*-art.png` before generating; if the crop cuts the painting, adjust the crop box.

## 5. Prompts

Every sprite prompt is the TEMPLATE with `@SUBJECT@` replaced by the line in the table. Save it as `art-src/twisted-hollow/prompts/<code>.txt`.

TEMPLATE:
```text
Painterly Arkham Horror LCG map sprite, high 3/4 angle, 3:2 landscape, 1536x1024, transparent background with true PNG alpha (if the tool cannot output alpha, use a perfectly flat pure #FF00FF magenta background with no shadow or gradient). Redraw the attached card illustration as a single freestanding location piece, using its architecture, props and dominant colors. The location fills 75-85% of the frame, with a readable silhouette at 150 px wide and a small clear flat spot at the lower center for a tiny standing figure. Thin irregular ground at most, edges clean. Omit card frame, text, icons, logos, watermark, people, living creatures, sky, horizon line, generic round rock islands and empty platforms. Setting: a blighted New England forest at night in Hemlock Vale: moonlit blue-indigo woods, mist, glowing fungi, cosmic corruption leaking through the trees, Lovecraftian dread. @SUBJECT@
```

| Code | Card | SUBJECT (written after looking at the card art) |
|---|---|---|
| `10612` | Glimmering Woods (start location in the campaign) | A meadow of glowing blue flowers with green fireflies in front of a dark pine forest. Deep blue and teal. Accent firefly green. |
| `10613` | Blighted Glade | A misty blue-violet swamp glade with bare dead trees and distant pines. Accent pale mist. |
| `10614` | Poisoned Marsh | Black marsh water under a dark forest, a glowing yellow thorny coral-like bush in the middle. Accent sickly yellow. |
| `10615` | Fecund Thicket | A dense dark jungle-like thicket with orange-red leaves at the right and a pair of faint glowing eyes in the dark center. Purple and dark green with an orange accent. |
| `10616` | Mushroom Grove | A bioluminescent forest of giant pink and magenta mushrooms and stacked glowing blue fungi. Accent magenta. |
| `10617` | Moonlit Clearing | A moonlit lavender-blue clearing ringed by pines with a dark shape lying on the ground (no birds, no recognizable body). Accent moon lavender. |
| `10618` | Crooked Path | Swirling indigo ornamental woods with a curving path and a bright white moon at the right. Accent moon white. Its art is close to the card back: make the sprite clearly more detailed than the back tile. |
| `10619` | Corpse Grove | Misty grey-blue woods with two huge gnarled trees, a skeletal corpse bound in the right tree and a skull at its base. Accent bone grey. |
| `10620` | Bear Den | Dark purple woods around an enormous glowing yellow-green skull with yellow mushrooms growing around it. Accent toxic yellow. |
| `10621` | The Twisted Hollow | A colossal gnarled trunk with sprawling roots under a crimson-purple nebula sky with floating blue lights. Accent crimson. |

### Western Woods back tile (reference `10612b-art.png`, size 1024x1024)

```text
Simple game map tile seen from a high 3/4 angle, isolated on a fully TRANSPARENT background (or flat pure #FF00FF), square canvas 1024x1024, painterly Arkham Horror LCG style. A low, plain irregular slab of dark indigo mossy forest floor with a wide flat top for small standing figures, faint swirling blue veins and a few tiny pale moss tufts, edges fading to transparent, tinted like the attached card back. Deliberately unremarkable: no trees, no moon, no path, no landmark, no text, no people.
```

### Background prompt (no reference)

```text
A vast, empty forest floor at night seen from a high, distant vantage point, classic Lovecraftian horror digital oil painting, 16:9 widescreen, 1536x864, matching the painterly style of Arkham Horror LCG card art. One seamless expanse of dark moss, leaf litter and ground mist with NO trees in the center, NO path, NO clearing, NO ruins, NO figures and NO focal landmark. Near-black indigo and cold blue-green, faint drifting mist, a few tiny pale mushrooms and scattered twigs, very faint blue glints only at the far edges. Low even lighting; no moon disc, no lens flare, no god rays. CENTER stays calm, dark and low in detail; detail rises gently toward the edges with a few tree roots barely visible at the borders. Uniform composition with no vanishing point so it can be panned, zoomed and cropped in any direction. No text, no watermark.
```

Negative list for the background: `tree trunk in the center, path, clearing, house, ruin, moon, sun, skull, creature, figure, text, logo, watermark, frame, grid, horizon line, center spotlight`.

## 6. Codex route

```bash
python ~/.codex/skills/generate2dmedia/scripts/route_media.py image --route codex-cli \
  --prompt-file art-src/twisted-hollow/prompts/<code>.txt \
  --reference art-src/twisted-hollow/refs/<code>-art.png \
  --size 1536x1024 --out-dir art-src/twisted-hollow/gen/<code>-v1
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

- [x] 10 sprites (10612-10621) + `back.webp` (11 files)
- [x] `twisted-hollow-woods.webp` background
- [x] Contact sheets next to the PNG originals
- [x] Short report: sprites that needed several attempts and anything that does not match the card art

## Kết quả (2026-11-13)

- Đã xuất và kiểm tra đủ **12 WebP**. Đã đối chiếu vật thể chính, màu và bóng dáng với tranh lá ở khoảng 150 px.
- [Nền tối](../../art-src/twisted-hollow/review/sprites-dark.jpg) · [Nền xám](../../art-src/twisted-hollow/review/sprites-grey.jpg) · [Đối chiếu tranh lá](../../art-src/twisted-hollow/review/sprites-vs-cards.jpg).
- Không có sprite cần tạo lại. `10617` thể hiện hình sẫm như một gò đất dưới ánh trăng. `10619` giữ bộ xương gắn trong thân cây như chi tiết cố định của tranh lá.
- Tạo bằng ImageGen tích hợp. PNG nguồn và prompt nằm trong `art-src/twisted-hollow/`. Nền xuất 2560×1440.
