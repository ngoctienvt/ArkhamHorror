import os
from PIL import Image, ImageDraw

artifact_dir = r'C:\Users\PC\.gemini\antigravity\brain\da436758-9b2c-456e-b1ae-327d265970c9\new_three'
img_path = 'frontend/public/img/scenes/the-path-to-carcosa/the-unspeakable-oath.webp'
img = Image.open(img_path)
w, h = img.size

anchors = [
    ('garden', (38, 25)),
    ('yard', (62, 25)),
    ('kitchen', (10, 52)),
    ('messHall', (32, 52)),
    ('asylumHallsWesternPatientWing', (52, 52)),
    ('asylumHallsEasternPatientWing', (69, 52)),
    ('infirmary', (88, 52)),
    ('basementHall', (12, 84)),
    ('patientConfinement1', (35, 84)),
    ('patientConfinement3', (52, 84)),
    ('patientConfinement4', (68, 84)),
    ('patientConfinement2', (84, 84)),
]

draw_img = img.copy()
draw = ImageDraw.Draw(draw_img)

for name, (px, py) in anchors:
    cx = int(w * px / 100)
    cy = int(h * py / 100)
    bw, bh = 130, 24
    draw.rectangle([(cx - bw//2, cy - bh//2), (cx + bw//2, cy + bh//2)], fill=(20, 25, 20), outline=(230, 197, 132), width=2)
    draw.text((cx - bw//2 + 5, cy - bh//2 + 5), f"{name[:14]} [{px},{py}]", fill=(0, 255, 255))
    draw.ellipse([(cx - 6, cy + 18 - 6), (cx + 6, cy + 18 + 6)], fill=(255, 0, 0))

draw_img.save(os.path.join(artifact_dir, 'calibrate_unspeakable_oath.webp'))
print('Unspeakable Oath calibrated')
