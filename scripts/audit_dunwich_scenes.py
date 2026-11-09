import os
from PIL import Image, ImageDraw

artifact_dir = r'C:\Users\PC\.gemini\antigravity\brain\da436758-9b2c-456e-b1ae-327d265970c9\dunwich_audit'
os.makedirs(artifact_dir, exist_ok=True)

scenarios = [
    {
        'id': '02041',
        'slug': 'extracurricular-activity',
        'title': 'Extracurricular Activity',
        'layout': [
            "triangle plus    hourglass squiggle",
            "square   diamond circle    .",
            ".        equals  t         ."
        ]
    },
    {
        'id': '02062',
        'slug': 'the-house-always-wins',
        'title': 'The House Always Wins',
        'layout': [
            ".    .      .        backHallDoorway1 .",
            ".    .      triangle backHallDoorway1 .",
            "moon circle triangle diamond          backHallDoorway2",
            "moon circle square   diamond          backHallDoorway2",
            ".    .      square   backHallDoorway3 .",
            ".    .      .        backHallDoorway3 ."
        ]
    },
    {
        'id': '02118',
        'slug': 'the-miskatonic-museum',
        'title': 'The Miskatonic Museum',
        'layout': None # dynamic exhibition halls
    },
    {
        'id': '02159',
        'slug': 'the-essex-county-express',
        'title': 'The Essex County Express',
        'layout': None # train cars
    },
    {
        'id': '02195',
        'slug': 'blood-on-the-altar',
        'title': 'Blood on the Altar',
        'layout': [
            ". houseInTheReedsHiddenChamber houseInTheReedsHiddenChamber houseInTheReeds houseInTheReeds schoolhouse schoolhouse schoolhouseHiddenChamber schoolhouseHiddenChamber .",
            "congregationalChurchHiddenChamber congregationalChurchHiddenChamber congregationalChurch congregationalChurch villageCommons  villageCommons osbornsGeneralStore osbornsGeneralStore osbornsGeneralStoreHiddenChamber osbornsGeneralStoreHiddenChamber",
            ". burnedRuinsHiddenChamber burnedRuinsHiddenChamber burnedRuins burnedRuins bishopsBrook bishopsBrook bishopsBrookHiddenChamber bishopsBrookHiddenChamber ."
        ]
    },
    {
        'id': '02236',
        'slug': 'undimensioned-and-unseen',
        'title': 'Undimensioned and Unseen',
        'layout': [
            ". blastedHeath devilsHopYard",
            ". blastedHeath devilsHopYard",
            "dunwichVillage tenAcreMeadow .",
            "dunwichVillage tenAcreMeadow whateleyRuins",
            ". coldSpringGlen whateleyRuins",
            ". coldSpringGlen ."
        ]
    },
    {
        'id': '02274',
        'slug': 'where-doom-awaits',
        'title': 'Where Doom Awaits',
        'layout': [
            "divergingPath1 divergingPath2 divergingPath3",
            "baseOfTheHill ascendingPath sentinelPeak",
            "alteredPath1 alteredPath2 alteredPath3"
        ]
    },
    {
        'id': '02311',
        'slug': 'lost-in-time-and-space',
        'title': 'Lost in Time and Space',
        'layout': None # cosmic
    }
]

def grid_positions(rows):
    cells = [r.strip().split() for r in rows]
    width = max(len(r) for r in cells)
    height = len(cells)
    sums = {}
    for y, row in enumerate(cells):
        for x, label in enumerate(row):
            if label == '.' or label == '':
                continue
            sx, sy, n = sums.get(label, (0, 0, 0))
            sums[label] = (sx + x + 0.5, sy + y + 0.5, n + 1)
    return {
        label: (round((sx / n / width) * 100, 1), round((sy / n / height) * 100, 1))
        for label, (sx, sy, n) in sums.items()
    }

for sc in scenarios:
    img_path = f"frontend/public/img/scenes/the-dunwich-legacy/{sc['slug']}.webp"
    if not os.path.exists(img_path):
        print(f"Image NOT found: {img_path}")
        continue
    
    img = Image.open(img_path)
    w, h = img.size
    draw_img = img.copy()
    draw = ImageDraw.Draw(draw_img)
    
    if sc['layout']:
        positions = grid_positions(sc['layout'])
        for label, (px, py) in positions.items():
            cx = int(w * px / 100)
            cy = int(h * py / 100)
            
            bw = min(170, max(80, len(label) * 8 + 14))
            bh = 22
            draw.rectangle([(cx - bw//2, cy - bh//2), (cx + bw//2, cy + bh//2)], fill=(20, 30, 20), outline=(230, 197, 132), width=1)
            draw.text((cx - bw//2 + 4, cy - bh//2 + 4), f"{label[:15]} [{px},{py}]", fill=(0, 255, 255))
            draw.ellipse([(cx - 5, cy - 5), (cx + 5, cy + 5)], fill=(255, 0, 0))
    else:
        draw.text((50, 50), f"{sc['title']} (Dynamic layout)", fill=(255, 255, 0))
    
    out_path = os.path.join(artifact_dir, f"audit_{sc['slug']}.webp")
    draw_img.save(out_path)
    print(f"Saved audit for {sc['title']} -> {out_path} ({w}x{h})")
