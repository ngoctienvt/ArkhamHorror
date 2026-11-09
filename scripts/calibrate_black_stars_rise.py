import os
from PIL import Image, ImageDraw

artifact_dir = r'C:\Users\PC\.gemini\antigravity\brain\da436758-9b2c-456e-b1ae-327d265970c9\new_three'
img_path = 'frontend/public/img/scenes/the-path-to-carcosa/black-stars-rise.webp'
img = Image.open(img_path)
w, h = img.size

anchors = [
    ('cloister', (28, 16)),
    ('knightsHall', (20, 25)),
    ('abbeyChurch', (47, 25)),
    ('northTower', (60, 22)),
    ('brokenSteps', (49, 56)),
    ('outerWall', (82, 46)),
    ('chapelOfStAubert', (17, 54)),
    ('chœurGothique', (34, 50)),
    ('grandRue', (70, 62)),
    ('abbeyTower', (31, 82)),
    ('porteDeLAvancée', (76, 84)),
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

draw_img.save(os.path.join(artifact_dir, 'calibrate_black_stars_rise.webp'))
print('Black Stars Rise calibrated')
