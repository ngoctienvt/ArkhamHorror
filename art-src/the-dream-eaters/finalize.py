"""Finalize a Codex PNG into the game WebP.
usage: python -I finalize.py <kind> <src.png> <dest-relative-to-frontend/public/img/scenes/the-dream-eaters, no extension>
kinds: bg (16:9 -> 1920x1080 q88, inpaint watermark corner), sprite (3:2 RGBA -> 768x512 q85),
       square (RGBA -> 512x512 q85), big (RGBA square -> 1024x1024 q85), tall (RGBA 1:2 -> 512x1024 q85)."""
import sys, os
from PIL import Image
kind, src, dest = sys.argv[1:4]
root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'frontend', 'public', 'img', 'scenes', 'the-dream-eaters'))
out = os.path.join(root, dest + '.webp'); os.makedirs(os.path.dirname(out), exist_ok=True)
SIZES = {'bg': (1920, 1080, 88), 'sprite': (768, 512, 85), 'square': (512, 512, 85), 'big': (1024, 1024, 85), 'tall': (512, 1024, 85)}
w, h, q = SIZES[kind]
im = Image.open(src).convert('RGB' if kind == 'bg' else 'RGBA')
if kind == 'bg':
    try:
        import cv2, numpy as np
        a = cv2.cvtColor(np.array(im), cv2.COLOR_RGB2BGR); H, W = a.shape[:2]
        m = np.zeros((H, W), np.uint8); cv2.circle(m, (W - 90, H - 80), 40, 255, -1)  # only if a sparkle watermark is present
        if os.environ.get('INPAINT'): a = cv2.inpaint(a, m, 13, cv2.INPAINT_TELEA)
        im = Image.fromarray(cv2.cvtColor(a, cv2.COLOR_BGR2RGB))
    except ImportError: pass
    tw, th = (w, h)
    r = max(tw / im.width, th / im.height)  # cover, then centre-crop to 16:9
    im = im.resize((round(im.width * r), round(im.height * r)), Image.LANCZOS)
    l, t = (im.width - tw) // 2, (im.height - th) // 2
    im = im.crop((l, t, l + tw, t + th))
else:
    bb = im.getbbox() if im.mode == 'RGBA' else None
    if bb and not os.environ.get('NOTRIM'): im = im.crop(bb)  # trim transparent margin, then fit centred in the canvas
    r = min(w * .98 / im.width, h * .98 / im.height)
    im = im.resize((round(im.width * r), round(im.height * r)), Image.LANCZOS)
    canvas = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    # The leg rotates from its root at the bottom of the canvas.
    top = h - im.height if kind == 'tall' and os.environ.get('NOTRIM') else (h - im.height) // 2
    canvas.paste(im, ((w - im.width) // 2, top))
    im = canvas
im.save(out, 'WEBP', quality=q, method=6); print(out, os.path.getsize(out) // 1024, 'KB')
