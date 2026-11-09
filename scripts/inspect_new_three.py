import os
from PIL import Image, ImageDraw

artifact_dir = r'C:\Users\PC\.gemini\antigravity\brain\da436758-9b2c-456e-b1ae-327d265970c9\new_three'
os.makedirs(artifact_dir, exist_ok=True)

files = [
    'the-unspeakable-oath.webp',
    'a-phantom-of-truth.webp',
    'black-stars-rise.webp',
]

for fname in files:
    fpath = os.path.join('frontend/public/img/scenes/the-path-to-carcosa', fname)
    img = Image.open(fpath)
    w, h = img.size
    print(f"{fname}: {w}x{h}, mode={img.mode}")
    img.save(os.path.join(artifact_dir, f"raw_{fname}"))

print("Copied raw files to artifact dir")
