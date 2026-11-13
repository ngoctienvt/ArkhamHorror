# Asset plan for Codex: The Longest Night (The Feast of Hemlock Vale)

This file is self-contained. Everything Codex needs is here; do not read any other plan file and do not edit game code. Only produce images and drop them into the folders listed below.

## 1. Purpose

In The Longest Night the investigators defend the Atwood family farm in Hemlock Vale on the second night. The farm is a fixed cross of 10 locations around The Farmhouse; the five farm buildings and four of the five outer fields are shuffled into the cells every game, and the farm buildings are only revealed when entered. So the old single painting (which shows a barn, a coop and so on at fixed places) is replaced by an empty night-field background plus one sprite per location and two shared face-down tiles.

The game draws one sprite per location, in the grid cell the server assigns, over an EMPTY background. So: **the background has no landmarks at all**, and **every sprite is a single freestanding piece on a transparent background**. Each location shown must match its real card art.

## 2. Art style

Painterly digital oil painting that matches the card art of the Arkham Horror LCG (Fantasy Flight Games): soft brush texture, moody Lovecraftian palette, readable at a small size. No photorealism, no cartoon outlines, no pixel art, no 3D render look.

Setting: a besieged New England farm at night in Hemlock Vale: moonlit mud, weathered timber, torchlight, mist, blighted crops, a creeping blood-red and sickly-brown corruption. Dread, not gore.

Hard rules for every image: no text, no letters, no card frame, no icons, no logos, no watermark, no signature, no people, no creatures (unless the card art itself shows one as fixed scenery). **No barricades, fences or barbed wire running between or around the piece** (the game draws barriers itself as tokens on the links; baked-in barricades would contradict them). Torches and ordinary farm fences that belong to the building itself are fine.

## 3. Output list (exact names, sizes, folders)

Sprite folder: `frontend/public/img/scenes/hemlock-vale/longest-night/`  
Background file: `frontend/public/img/scenes/hemlock-vale/longest-night-fields.webp`

| File | Size (px) | Format | Notes |
|---|---|---|---|
| `.../longest-night/10630.webp` | 768×512 (3:2) | WebP q85, alpha | The Farmhouse (always face up, the centre cell). |
| `.../longest-night/10631.webp` | 768×512 (3:2) | WebP q85, alpha | Milkhouse. |
| `.../longest-night/10632.webp` | 768×512 (3:2) | WebP q85, alpha | Vineyard. |
| `.../longest-night/10633.webp` | 768×512 (3:2) | WebP q85, alpha | Coop. |
| `.../longest-night/10634.webp` | 768×512 (3:2) | WebP q85, alpha | Barn. |
| `.../longest-night/10635.webp` | 768×512 (3:2) | WebP q85, alpha | Pasture. |
| `.../longest-night/10636.webp` | 768×512 (3:2) | WebP q85, alpha | Outer Fields: Bloodied Paths. |
| `.../longest-night/10637.webp` | 768×512 (3:2) | WebP q85, alpha | Outer Fields: Desolate Hills. |
| `.../longest-night/10638.webp` | 768×512 (3:2) | WebP q85, alpha | Outer Fields: Blighted Cornfields. |
| `.../longest-night/10639.webp` | 768×512 (3:2) | WebP q85, alpha | Outer Fields: Scorched Knoll. |
| `.../longest-night/10640.webp` | 768×512 (3:2) | WebP q85, alpha | Outer Fields: Rancid Crops. |
| `.../longest-night/farm-back.webp` | 768×512 (3:2) | WebP q85, alpha | Face-down "Atwood Farm" tile. |
| `.../longest-night/field-back.webp` | 768×512 (3:2) | WebP q85, alpha | Face-down "Outer Fields" tile. |
| `frontend/public/img/scenes/hemlock-vale/longest-night-fields.webp` | ≥2560×1440 (16:9) | WebP q88, no alpha | Empty background. |

Generate sprites at **1536×1024**, the background at **1536×864**, then resize in post-processing (section 8). Keep the original PNGs OUTSIDE `frontend/public/` (use `art-src/longest-night/`).

## 4. Reference art (card art wins over any text below)

Real card art: `https://assets.arkhamhorror.app/img/arkham/cards/<code>.avif` (750×1050 card). Convert to PNG and crop the art window. A trailing `b` is the other face of the card. Use one reference per sprite (its own card). If a prompt below disagrees with what you see in the reference, **follow the reference**.

```python
# fetch_refs.py  (pip install pillow; if Image.open fails on AVIF: pip install pillow-avif-plugin)
import sys, urllib.request, pathlib
from PIL import Image
out = pathlib.Path('art-src/longest-night/refs'); out.mkdir(parents=True, exist_ok=True)
for code in sys.argv[1:]:
    p = out / f'{code}.avif'
    urllib.request.urlretrieve(f'https://assets.arkhamhorror.app/img/arkham/cards/{code}.avif', p)
    im = Image.open(p).convert('RGB'); w, h = im.size
    im.save(out / f'{code}.png')
    im.crop((0, int(h*0.09), w, int(h*0.50))).save(out / f'{code}-art.png')  # art window only: use THIS as --reference
```

Codes to fetch: `10630 10631 10632 10633 10634 10635 10636 10637 10638 10639 10640` and the other faces `10631b 10632b 10633b 10634b 10635b 10636b 10637b 10638b 10639b 10640b`. Look at each `*-art.png` before generating; if the crop cuts the painting, adjust the crop box. **Card data check:** for `10631`-`10635` the front shows the real building and the back is titled "Atwood Farm" (the face-down state). For `10636`-`10640` the front shows the field; the face-down state is titled "Outer Fields". If a `b` image does not exist for the Outer Fields, build `field-back` from the five fronts instead (a plain blighted field patch, no landmark).

**Backs:** open the five `10631b`-`10635b` images side by side. If they share one painting, make one `farm-back` from `10631b`. If they differ, still make ONE `farm-back` (an unremarkable farm yard patch in the common colors) and say so in your report. Same rule for `field-back` with `10636b`-`10640b`.

## 5. Prompts

Every sprite prompt is the TEMPLATE with `@SUBJECT@` replaced by the line in the table. Save it as `art-src/longest-night/prompts/<code>.txt`.

TEMPLATE:
```text
Painterly Arkham Horror LCG map sprite, high 3/4 angle, 3:2 landscape, 1536x1024, transparent background with true PNG alpha (if the tool cannot output alpha, use a perfectly flat pure #FF00FF magenta background with no shadow or gradient). Redraw the attached card illustration as a single freestanding location piece, using its architecture, props and dominant colors. The location fills 75-85% of the frame, with a readable silhouette at 120 px wide and a small clear flat spot at the lower center for a tiny standing figure. Thin irregular ground at most, edges clean. Omit card frame, text, icons, logos, watermark, people, living creatures, sky, horizon line, barricades between pieces, generic round rock islands and empty platforms. Setting: a besieged New England farm at night in Hemlock Vale: moonlit mud, weathered timber, torchlight, mist, blighted crops, creeping blood-red and sickly-brown corruption. @SUBJECT@
```

The SUBJECT lines below are written from the card NAMES only (I could not view the card art): **the reference image decides the object, layout and colors**; use these lines just to know what to expect.

| Code | Card | SUBJECT |
|---|---|---|
| `10630` | The Farmhouse (always face up, centre) | The fortified two-storey clapboard farmhouse with boarded windows, one warm lit window and a porch. The largest and most detailed piece of the set. |
| `10631` | Milkhouse | A small stone dairy building with a slate roof and chimney, milk cans and crates at the door. |
| `10632` | Vineyard | Rows of trellised grapevines on a small plot, a few posts, withered leaves. |
| `10633` | Coop | A small timber chicken coop with a ramp and a wire run. |
| `10634` | Barn | A large red gambrel-roof barn with big double doors. |
| `10635` | Pasture | A fenced grazing field with a trough and trampled mud. |
| `10636` | Outer Fields: Bloodied Paths | Muddy cart tracks across a field, dark blood smears. |
| `10637` | Outer Fields: Desolate Hills | Bare, windswept hills with a dead tree. |
| `10638` | Outer Fields: Blighted Cornfields | Dead brown cornstalks in rows under mist. |
| `10639` | Outer Fields: Scorched Knoll | A burnt, smoking hillock with charred stumps. |
| `10640` | Outer Fields: Rancid Crops | Rotting crops with a sickly green-brown sheen. |

### Back tiles (references `10631b` and `10636b`; 1536x1024)

```text
Simple game map tile seen from a high 3/4 angle, isolated on a fully TRANSPARENT background (or flat pure #FF00FF), 3:2 landscape 1536x1024, painterly Arkham Horror LCG style. @BACK@ Deliberately unremarkable: no building, no landmark, no text, no people. A wide flat top for small standing figures, edges fading to transparent, the slab fills 75-85% of the frame.
```

- `farm-back`: `@BACK@` = "A low irregular patch of moonlit farmyard dirt with a little trampled grass and a few boards, in the colors of the attached card back."
- `field-back`: `@BACK@` = "A low irregular patch of dark blighted field earth with sparse dead stalks, in the colors of the attached card back."

### Background prompt (no reference)

```text
A vast, empty stretch of moonlit farmland at night seen from a high, distant vantage point, classic Lovecraftian horror digital oil painting, 16:9 widescreen, 1536x864, matching the painterly style of Arkham Horror LCG card art. One seamless expanse of dark trampled earth, patchy dead grass and shallow mud, with NO buildings, NO fences, NO barns, NO figures and NO focal landmark. Near-black blue-grey and cold umber with faint mist, tiny scattered stones and straw, very faint dark-red stains only at the far edges and a faint line of dead corn at the very borders. Low even lighting; no bursts, no lens flares. CENTER stays calm, dark and low in detail; detail rises gently toward the edges. Uniform composition with no vanishing point so it can be panned, zoomed and cropped in any direction. No text, no watermark.
```

Negative list for the background: `house, barn, silo, fence, barricade, tower, road sign, figure, creature, text, logo, watermark, frame, grid, horizon line, center spotlight, moon, sky`.

## 6. Codex route

```bash
python ~/.codex/skills/generate2dmedia/scripts/route_media.py image --route codex-cli \
  --prompt-file art-src/longest-night/prompts/<code>.txt \
  --reference art-src/longest-night/refs/<code>-art.png \
  --size 1536x1024 --out-dir art-src/longest-night/gen/<code>-v1
```

- The route name `route_media.py` accepts is `codex-cli` (or `local` for any local CLI). The label `local:codex-cli` is internal and the argument parser rejects it.
- Backs: use the matching `10631b` / `10636b` art as `--reference`. Background: no `--reference`, `--size 1536x864`.
- Every attempt goes in a new `-v2`, `-v3` folder; never overwrite.
- Known environment issue: Codex CLI 0.147.0 does not know the `sleep_tool` feature flag that `cli_media.py` disables (`CODEX_DISABLED`, around line 132), so the route can fail with `Unknown feature flag: sleep_tool`. Either upgrade Codex to 0.153+ or run a copy of the skill with `"sleep_tool"` removed from `CODEX_DISABLED`.
- On login or quota errors: stop and report. Do not draw the images with code.

## 7. Per-sprite acceptance checklist

Tick every box before moving a sprite into `frontend/public/`:

- [ ] Same main object, silhouette and dominant colors as the reference card art (check side by side).
- [ ] The location fills 75-85% of the frame; the flat standing spot at lower center is free of detail.
- [ ] Recognizable at 120 px wide on a dark background without a label.
- [ ] Different silhouette or accent color from every other sprite in the set (the five Outer Fields in particular must not look alike).
- [ ] Transparent background: the four corners and the middle of the top edge have alpha 0 (no baked checkerboard, no magenta fringe, no halo).
- [ ] No text, frame, watermark, sparkle or star mark, signature, person or creature, and no barricade between pieces.
- [ ] Clean edges at 768×512 (no jagged alpha, nothing cut off at the border).
- [ ] The alpha box hugs the drawing: each edge of the opaque area is within ~10% of the frame edge (measure with `getchannel('A').point(lambda v: 255 if v>40 else 0).getbbox()`), so the dashed link lines touch the art.

## 8. Post-processing (before dropping files in)

```python
# post.py   usage: python post.py in.png out.webp sprite|bg
import sys, numpy as np
from PIL import Image
inp, outp, kind = sys.argv[1:4]
im = Image.open(inp).convert('RGBA'); a = np.array(im)

# 1. Watermark check: look at the bottom-right and top-right 12% corners by eye. Remove a stray mark with
#    cv2.inpaint:  m = np.zeros(a.shape[:2], np.uint8); cv2.circle(m, (x, y), r, 255, -1)
#                  a[..., :3] = cv2.inpaint(a[..., :3], m, 9, cv2.INPAINT_TELEA)

# 2. Keying: only when the image has no real alpha (corner alpha == 255) on a sprite.
if kind == 'sprite' and a[0, 0, 3] == 255:
    r, g, b = [a[..., i].astype(int) for i in range(3)]
    dist = np.sqrt((r - 255) ** 2 + g ** 2 + (b - 255) ** 2)        # distance to #FF00FF
    alpha = np.clip((dist - 60) / 80, 0, 1)                           # soft edge
    a[..., 3] = (alpha * 255).astype(np.uint8)
    spill = np.minimum(r, b) - g                                       # despill magenta on edge pixels
    m = (alpha > 0) & (alpha < 1)
    a[..., 0][m] = np.clip(r[m] - spill[m] * 0.6, 0, 255)
    a[..., 2][m] = np.clip(b[m] - spill[m] * 0.6, 0, 255)
im = Image.fromarray(a)

# 3. Resize (Lanczos) and save.
size = {'sprite': (768, 512), 'bg': (2560, 1440)}[kind]
quality = {'sprite': 85, 'bg': 88}[kind]
im = im.resize(size, Image.LANCZOS)
im.save(outp, 'WEBP', quality=quality, method=6)

# 4. Alpha check (must print 0 0 0 0 0 for sprites)
if kind != 'bg':
    al = np.array(im)[..., 3]
    print('corner alpha', al[0, 0], al[0, -1], al[-1, 0], al[-1, -1], 'top-mid', al[0, al.shape[1] // 2])
```

Rules: AI output is usually 1024-1536 px, so the background MUST be upscaled (Lanczos) to at least 2560×1440; sprites are downscaled to 768×512. Keep files small (sprite under 250 KB, background under 1.5 MB); lower the WebP quality to 80 if larger.

## 9. Final review (contact sheet)

Build a contact sheet of all 13 sprites at about 120 px wide on a dark (#14161c) background and another on a mid-grey (#5a5a5a) background. You must be able to name every location without labels, the set must look like one painter made it, and no two sprites may share a silhouette or accent color. Put it next to the PNG originals in `art-src/longest-night/review/`. Then report what you delivered and what you could not match.

## 10. Delivery checklist

- [ ] 11 location sprites (`10630`-`10640`) + `farm-back.webp` + `field-back.webp` (13 files)
- [ ] `longest-night-fields.webp` background (≥2560×1440)
- [ ] Contact sheets next to the PNG originals
- [ ] Short report: sprites that needed several attempts, whether the five `b` faces share one painting, and anything that does not match the card art
