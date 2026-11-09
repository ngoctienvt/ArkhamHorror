import os
from PIL import Image, ImageDraw

artifact_dir = r'C:\Users\PC\.gemini\antigravity\brain\da436758-9b2c-456e-b1ae-327d265970c9'
img_path = 'frontend/public/img/scenes/the-path-to-carcosa/curtain-call.webp'
img = Image.open(img_path)
w, h = img.size

# In Curtain Call:
# Left section: Lobby (x: 0 to ~32%). Grand curved staircase, lobby doors, entrance foyer.
# - lobby: main floor of foyer (x ~ 19%, y ~ 70%)
# - lobbyDoorway1: upper landing / door on balcony (x ~ 8%, y ~ 20%)
# - lobbyDoorway2: lower door / exit (x ~ 9%, y ~ 75% or 80%)
# - lobbyDoorway3: mid door (x ~ 8%, y ~ 48%)
#
# Center section: Theatre Auditorium & Stage (x: 32% to ~68%).
# - balcony: upper mezzanine balcony seats (x ~ 38%, y ~ 42%)
# - theatre: main stage floor / orchestra (x ~ 57%, y ~ 66%)
#
# Right section: Backstage (x: 68% to 100%).
# - backstage: backstage wooden floor (x ~ 82%, y ~ 75%)
# - backstageDoorway1: upper fly loft / catwalks (x ~ 90%, y ~ 22%)
# - backstageDoorway2: dressing room / stage door floor (x ~ 90%, y ~ 85%)
# - backstageDoorway3: mid level catwalk (x ~ 90%, y ~ 54%)

anchors = [
    ('lobbyDoorway1', (8, 20)),
    ('lobbyDoorway3', (8, 48)),
    ('lobbyDoorway2', (8, 80)),
    ('lobby', (19, 70)),
    ('balcony', (38, 42)),
    ('theatre', (57, 66)),
    ('backstage', (82, 74)),
    ('backstageDoorway1', (91, 20)),
    ('backstageDoorway3', (91, 52)),
    ('backstageDoorway2', (91, 82)),
]

draw_img = img.copy()
draw = ImageDraw.Draw(draw_img)

for name, (px, py) in anchors:
    cx = int(w * px / 100)
    cy = int(h * py / 100)
    bw, bh = 140, 24
    draw.rectangle([(cx - bw//2, cy - bh//2), (cx + bw//2, cy + bh//2)], fill=(20, 25, 20), outline=(230, 197, 132), width=2)
    draw.text((cx - bw//2 + 5, cy - bh//2 + 5), f"{name} [{px},{py}]", fill=(0, 255, 255))
    draw.ellipse([(cx - 6, cy + 18 - 6), (cx + 6, cy + 18 + 6)], fill=(255, 0, 0))

draw_img.save(os.path.join(artifact_dir, 'calibrate_curtain_call.webp'))
print('Curtain call test generated')
