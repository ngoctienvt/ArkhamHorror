import os
from PIL import Image, ImageDraw

artifact_dir = r'C:\Users\PC\.gemini\antigravity\brain\da436758-9b2c-456e-b1ae-327d265970c9\new_three'
img_path = 'frontend/public/img/scenes/the-path-to-carcosa/a-phantom-of-truth.webp'
img = Image.open(img_path)
w, h = img.size

anchors = [
    ('grandGuignol', (10, 16)),
    ('opéraGarnier', (21, 41)),
    ('gareDOrsay', (12, 74)),
    ('montmartre', (38, 18)),
    ('gardensOfLuxembourg', (52, 57)),
    ('montparnasse', (42, 88)),
    ('canalSaintMartin', (68, 16)),
    ('leMarais', (68, 38)),
    ('notreDame', (74, 71)),
    ('pèreLachaiseCemetery', (88, 22)),
]

draw_img = img.copy()
draw = ImageDraw.Draw(draw_img)

for name, (px, py) in anchors:
    cx = int(w * px / 100)
    cy = int(h * py / 100)
    bw, bh = 140, 24
    draw.rectangle([(cx - bw//2, cy - bh//2), (cx + bw//2, cy + bh//2)], fill=(20, 25, 20), outline=(230, 197, 132), width=2)
    draw.text((cx - bw//2 + 5, cy - bh//2 + 5), f"{name[:14]} [{px},{py}]", fill=(0, 255, 255))
    draw.ellipse([(cx - 6, cy + 18 - 6), (cx + 6, cy + 18 + 6)], fill=(255, 0, 0))

draw_img.save(os.path.join(artifact_dir, 'calibrate_phantom_of_truth.webp'))
print('Phantom of Truth calibrated')
