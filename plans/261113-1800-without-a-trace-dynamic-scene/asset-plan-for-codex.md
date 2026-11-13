# Asset plan for Codex: Without a Trace (The Scarlet Keys)

This file is self-contained. Everything Codex needs is here; do not read any other plan file and do not edit game code. Only produce images and drop them into the folders listed below.

## 1. Purpose

Without a Trace is the ninth scenario of The Scarlet Keys (scenario code `09681`). The investigators start in the Court of the Outsiders at the centre of the grid. Around it lie concealed mini-cards; when one is exposed, an 'in the shadows' City of Remnants location is placed in the grid at that mini-card's cell and a new one is drawn into the shadows. The cities come from a shuffled deck, so which location lies where, and in which direction the map grows, differs every game. The old single painting cannot match that. It is replaced by an empty violet-dusk background plus one sprite per location and a face-down 'City of Remnants' tile. (The mini-cards are drawn by the game itself.)

The game draws one sprite per location, in the grid cell the server assigns, over an EMPTY background. So: **the background has no landmarks at all**, and **every sprite is a single freestanding piece on a transparent background**. Each location shown must match its real card art.

## 2. Art style

Painterly digital oil painting that matches the card art of the Arkham Horror LCG (Fantasy Flight Games): soft brush texture, moody Lovecraftian palette, readable at a small size. No photorealism, no cartoon outlines, no pixel art, no 3D render look.

Setting: the Otherworld city of remnants beyond the Outside: a dusk-violet alien city of ruined towers, shimmering lilac mist, crystal spires and tall silent statues, impossible masonry, a pale moon, cosmic dread.

Hard rules for every image: no text, no letters, no card frame, no icons, no logos, no watermark, no signature, no people, no creatures (unless the card art itself shows a fixed statue, husk or skeleton as part of the scenery).

> **Sprites shared with other scenarios.** The City of Remnants sprites `09747`-`09750` and `remnants-back` are also used by Congress of the Keys. If finished copies already exist in `frontend/public/img/scenes/the-scarlet-keys/congress-of-the-keys/` (same file names), **copy them here instead of redrawing**.

## 3. Output list (exact names, sizes, folders)

Sprite folder: `frontend/public/img/scenes/the-scarlet-keys/without-a-trace/`  
Background file: `frontend/public/img/scenes/the-scarlet-keys/without-a-trace-otherworld.webp`  

| File | Size (px) | Format | Notes |
|---|---|---|---|
| `frontend/public/img/scenes/the-scarlet-keys/without-a-trace/09688.webp` | 768×512 (3:2) | WebP q85, alpha | Court of the Outsiders (start; always face up). |
| `frontend/public/img/scenes/the-scarlet-keys/without-a-trace/09689.webp` | 768×512 (3:2) | WebP q85, alpha | Outsiders' Lair (last card of the Otherworld deck). |
| `frontend/public/img/scenes/the-scarlet-keys/without-a-trace/09747.webp` | 768×512 (3:2) | WebP q85, alpha | Rambling Route (A, B and C share it). |
| `frontend/public/img/scenes/the-scarlet-keys/without-a-trace/09748.webp` | 768×512 (3:2) | WebP q85, alpha | Alien Frontier (A and B share it). |
| `frontend/public/img/scenes/the-scarlet-keys/without-a-trace/09749.webp` | 768×512 (3:2) | WebP q85, alpha | Weald of Effigies (A and B share it). |
| `frontend/public/img/scenes/the-scarlet-keys/without-a-trace/09750.webp` | 768×512 (3:2) | WebP q85, alpha | Cliffs of Insanity (two copies in the set). |
| `frontend/public/img/scenes/the-scarlet-keys/without-a-trace/remnants-back.webp` | 768×512 (3:2, trimmed) | WebP q85, alpha | Face-down 'City of Remnants'. Reference: card back `09747ab`. |
| `frontend/public/img/scenes/the-scarlet-keys/without-a-trace-otherworld.webp` | ≥2560×1440 (16:9) | WebP q88, no alpha | Empty background: a vast violet dusk haze. |

Generate sprites at **1536×1024**, backs at **1536×1024**, the background at **1536×864**, then trim and resize in post-processing (section 8). Backs are **3:2 flat tiles trimmed to their edges, not square** (a square tile with transparent margins leaves dashed links floating away from the art). Keep the original PNGs OUTSIDE `frontend/public/` (use `art-src/without-a-trace/`).

## 4. Reference art (card art wins over any text below)

Real card art: `https://assets.arkhamhorror.app/img/arkham/cards/<code>.avif` (about 750×1050 card). Convert to PNG and crop the art window. A trailing `b` is the other face of the card (the face-down / unrevealed side). Use at most 8 references per Codex call; normally exactly one reference per sprite (its own card). If a prompt below disagrees with what you see in the reference, **follow the reference**.

The A/B/C versions of Rambling Route, Alien Frontier and Weald of Effigies carry the SAME painting: one sprite each. Court of the Outsiders (`09688`) repeats its painting on the face-down side (`09688b`), but it is the start location and is always face up. Every other location is placed face down: its face-down side is the shared 'City of Remnants' back (`09747ab`, same painting as `09689b`).

```python
# fetch_refs.py  (pip install pillow; Pillow 10+ opens AVIF natively, otherwise: pip install pillow-avif-plugin)
import sys, urllib.request, pathlib
from PIL import Image
out = pathlib.Path('art-src/without-a-trace/refs'); out.mkdir(parents=True, exist_ok=True)
CROP = {}   # code -> (left, top, right, bottom) fractions, for cards whose art window differs
for code in sys.argv[1:]:
    name = code[:-1] if code.endswith('a') and not code.endswith('ab') else code   # 10510a -> 10510, so files match the prompts
    p = out / f'{name}.avif'
    urllib.request.urlretrieve(f'https://assets.arkhamhorror.app/img/arkham/cards/{code}.avif', p)
    im = Image.open(p).convert('RGB'); w, h = im.size
    im.save(out / f'{name}.png')
    l, t, r, b = CROP.get(code, (0, 0.09, 1, 0.50))
    im.crop((int(w*l), int(h*t), int(w*r), int(h*b))).save(out / f'{name}-art.png')  # art window only: use THIS as --reference
```

Codes to fetch: `09688 09689 09747a 09748a 09749a 09750 09747ab`. Files are saved under the base code (`10510a` is saved as `10510-art.png`, backs keep their suffix, e.g. `10716b-art.png`). Look at each `*-art.png` before generating; if the crop cuts the painting, adjust the crop box. A code that returns a grey generic placeholder card (about 50 KB) is wrong: do not use it as a reference.

## 5. Prompts

Every sprite prompt is the TEMPLATE with `@SUBJECT@` replaced by the line in the table. Save it as `art-src/without-a-trace/prompts/<code>.txt`.

TEMPLATE:
```text
Painterly Arkham Horror LCG map sprite, high 3/4 angle, 3:2 landscape, 1536x1024, transparent background with true PNG alpha (if the tool cannot output alpha, use a perfectly flat pure #FF00FF magenta background with no shadow or gradient). Redraw the attached card illustration as a single freestanding location piece, using its architecture, props and dominant colors. The location fills 75-85% of the frame, with a readable silhouette at 150 px wide and a small clear flat spot at the lower center for a tiny standing figure. Thin irregular ground at most, edges clean. Omit card frame, text, icons, logos, watermark, people, living creatures, sky, horizon line, generic round rock islands and empty platforms. Setting: the Otherworld city of remnants beyond the Outside: a dusk-violet alien city of ruined towers, shimmering lilac mist, crystal spires and tall silent statues, impossible masonry, a pale moon, cosmic dread. @SUBJECT@
```

| Code | Card | SUBJECT (written after looking at the card art) |
|---|---|---|
| `09688` | Court of the Outsiders | A circular, arcaded stone courtyard with a central fountain basin, tall columns around it and a clock tower at the far side, lit by violet dusk. Accent blue-violet slate. |
| `09689` | Outsiders' Lair | A night-blue swirling galaxy vortex above a violet web-like structure strung with glowing yellow-green nodes. Accent deep blue and magenta. |
| `09747` | Rambling Route (A, B and C share it) | Sheer broken towers and tilted masonry in dark violet gloom, a pale moon glowing among the ruins. Accent charcoal violet. |
| `09748` | Alien Frontier (A and B share it) | A lilac mist plain with jagged amethyst crystal spires and a cluster of blue coral-like bubbles at the right. Accent lilac. |
| `09749` | Weald of Effigies (A and B share it) | Shallow glowing lilac water among tall, slender alien humanoid statues with swept-back limbs. Accent lilac-white. |
| `09750` | Cliffs of Insanity | A dark fortress-like cliff face of spikes and black stone with glowing magenta eyes, hanging chains, a pink-orange sky glow behind it. Accent black and magenta. |

### City of Remnants back tile (reference `09747ab-art.png`, size 1536x1024)

```text
Simple game map tile seen from a high 3/4 angle, isolated on a fully TRANSPARENT background (or flat pure #FF00FF), landscape 3:2 canvas 1536x1024, painterly Arkham Horror LCG style. A low, plain slab of violet-grey stone with a thin ridge of tiny spired ruins and one small bridge along its back edge. Deliberately unremarkable: no landmark, no text, no people, no creatures. The piece fills 75-85% of the frame with edges fading cleanly to transparent and a wide flat top for a small standing figure, in the palette of the attached card back.
```

### Background prompt (no reference, size 1536x864)

```text
A vast, empty violet dusk haze seen from high above, classic Lovecraftian digital oil painting, 16:9 widescreen, 1536x864, matching the painterly style of Arkham Horror LCG card art. One seamless expanse of layered indigo and lilac mist with soft translucent veils and a scattering of tiny faint stars, NO buildings, NO towers, NO crystals, NO statues, NO moon disc, NO figures and NO focal landmark. A few tiny out-of-focus dark debris shards near the borders only. Low, even lighting; no lens flare, no god rays. CENTER stays calm, dark and low in detail; detail rises gently toward the edges. Uniform composition with no vanishing point so it can be panned, zoomed and cropped in any direction. No text, no watermark.
```

Negative list for backgrounds: `structure, building, ruin, tower, city, door, stairs, furniture, rail, track, creature, tentacle, face, figure, text, logo, watermark, frame, grid, tiles, panels, horizon line, center spotlight, lens flare, god rays`.

## 6. Codex route

```bash
python ~/.codex/skills/generate2dmedia/scripts/route_media.py image --route codex-cli \
  --prompt-file art-src/without-a-trace/prompts/<code>.txt \
  --reference art-src/without-a-trace/refs/<code>-art.png \
  --size 1536x1024 --out-dir art-src/without-a-trace/gen/<code>-v1
```

- The route name `route_media.py` accepts is `codex-cli` (or `local` for any local CLI). The label `local:codex-cli` is internal and the argument parser rejects it.
- At most **8 reference images per Codex call**. Normally exactly one reference per sprite (its own card art). Backs: their own back card. The background: no `--reference`, `--size 1536x864`.
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
- [ ] **Trimmed to the alpha bounding box** (section 8): every side of the drawn piece lies within about 10% of the frame edge. The game clips connection lines at 80% of the sprite frame, so empty margins show up as gaps between the dashed link and the art.

## 8. Post-processing (before dropping files in)

```python
# post.py   usage: python post.py in.png out.webp sprite|back|vehicle|arm|bg|overlay
import sys, numpy as np
from PIL import Image
inp, outp, kind = sys.argv[1:4]
im = Image.open(inp).convert('RGBA'); a = np.array(im)

# 1. Watermark check: look at the bottom-right and top-right 12% corners by eye. Remove a stray mark with
#    cv2.inpaint:  m = np.zeros(a.shape[:2], np.uint8); cv2.circle(m, (x, y), r, 255, -1)
#                  a[..., :3] = cv2.inpaint(a[..., :3], m, 9, cv2.INPAINT_TELEA)

# 2. Keying: only when the image has no real alpha (corner alpha == 255) on sprite/back/vehicle/arm.
if kind in ('sprite', 'back', 'vehicle', 'arm') and a[0, 0, 3] == 255:
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

# 4. Trim to the alpha bounding box and fit the frame (sprite, back, vehicle): the drawn piece must fill its frame.
size = {'sprite': (768, 512), 'back': (768, 512), 'vehicle': (512, 384), 'arm': (512, 512), 'bg': (2560, 1440), 'overlay': (1920, 1080)}[kind]
if kind in ('sprite', 'back', 'vehicle'):
    box = im.getchannel('A').point(lambda v: 255 if v > 40 else 0).getbbox()
    im = im.crop(box)
    scale = min(size[0] / im.width, size[1] / im.height)
    im = im.resize((max(1, round(im.width * scale)), max(1, round(im.height * scale))), Image.LANCZOS)
    canvas = Image.new('RGBA', size, (0, 0, 0, 0))
    canvas.paste(im, ((size[0] - im.width) // 2, size[1] - im.height), im)   # centered, resting on the bottom edge
    im = canvas
else:
    im = im.resize(size, Image.LANCZOS)

# 5. Save.
quality = {'sprite': 85, 'back': 85, 'vehicle': 85, 'arm': 85, 'bg': 88, 'overlay': 82}[kind]
im.save(outp, 'WEBP', quality=quality, method=6)

# 6. Checks. Corner alpha must print 0 0 0 0 0; margins of every sprite/back/vehicle should be <= ~10 (percent of the frame).
if kind != 'bg':
    al = np.array(im)[..., 3]
    print('corner alpha', al[0, 0], al[0, -1], al[-1, 0], al[-1, -1], 'top-mid', al[0, al.shape[1] // 2])
if kind in ('sprite', 'back', 'vehicle'):
    l, t, r, bt = Image.fromarray(al).point(lambda v: 255 if v > 40 else 0).getbbox()
    print('margins %% L %.0f T %.0f R %.0f B %.0f' % (100 * l / size[0], 100 * t / size[1], 100 * (size[0] - r) / size[0], 100 * (size[1] - bt) / size[1]))
```

Rules: AI output is usually 1024-1536 px, so the background MUST be upscaled (Lanczos) to at least 2560×1440; sprites are trimmed then fitted to 768×512. If a margin is above ~10% on a side, the piece is too small or too lopsided in the frame: regenerate or crop tighter. Keep files small (sprite under 250 KB, background under 1.5 MB); lower the WebP quality to 80 if larger.

## 9. Final review (contact sheet)

Build a contact sheet of all sprites at about 150 px wide on a dark (#14161c) background and another on a mid-grey (#5a5a5a) background. You must be able to name every location without labels, the set must look like one painter made it, and the Court of the Outsiders (a courtyard) must differ clearly from the five Otherworld cities. Then put each sprite next to its real card art and check the same main object and dominant color. Report what you delivered and what you could not match.

## 10. Delivery checklist

- [ ] 6 location sprites `09688`, `09689`, `09747`-`09750`
- [ ] `remnants-back.webp` (7 files)
- [ ] `without-a-trace-otherworld.webp` background
- [ ] Contact sheets (dark and grey) saved next to the PNG originals in `art-src/without-a-trace/`
- [ ] Margin report of every sprite (section 8) pasted in the final message
- [ ] Short report: which sprites needed several attempts and which could not match the card art
