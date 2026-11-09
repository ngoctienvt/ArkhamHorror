import os
from PIL import Image, ImageDraw, ImageFont

artifact_dir = r'C:\Users\PC\.gemini\antigravity\brain\da436758-9b2c-456e-b1ae-327d265970c9\carcosa_audit'
os.makedirs(artifact_dir, exist_ok=True)

scenarios = [
    {
        'id': '03043',
        'slug': 'curtain-call',
        'title': 'Curtain Call',
        'layout': [
            "lobbyDoorway1 .     balcony .         backstageDoorway1",
            "lobbyDoorway3 lobby theatre backstage backstageDoorway3",
            "lobbyDoorway2 .     .       .         backstageDoorway2"
        ]
    },
    {
        'id': '03061',
        'slug': 'the-last-king',
        'title': 'The Last King',
        'layout': [
            "diningRoom .         gallery",
            "ballroom   courtyard livingRoom",
            ".          foyer     ."
        ]
    },
    {
        'id': '03159',
        'slug': 'the-unspeakable-oath',
        'title': 'The Unspeakable Oath',
        'layout': [
            ".       .       .        .        garden                        garden                        .                             .                             .                   .",
            ".       .       .        .        yard                          yard                          .                             .                             .                   .",
            "kitchen kitchen messHall messHall asylumHallsWesternPatientWing asylumHallsWesternPatientWing asylumHallsEasternPatientWing asylumHallsEasternPatientWing infirmary           infirmary",
            ".       .       .        .        patientConfinement1           patientConfinement1           basementHall                  basementHall                  patientConfinement2 patientConfinement2",
            ".       .       .        .        .                             patientConfinement3           patientConfinement3           patientConfinement4           patientConfinement4 ."
        ]
    },
    {
        'id': '03200',
        'slug': 'a-phantom-of-truth',
        'title': 'A Phantom of Truth',
        'layout': [
            "grandGuignol .                   canalSaintMartin .",
            "grandGuignol montmartre           canalSaintMartin pèreLachaiseCemetery",
            "opéraGarnier montmartre           leMarais         pèreLachaiseCemetery",
            "opéraGarnier .                   leMarais         .",
            "gareDOrsay   gardensOfLuxembourg notreDame        .",
            "gareDOrsay   gardensOfLuxembourg notreDame        .",
            ".            montparnasse        .                .",
            ".            montparnasse        .                ."
        ]
    },
    {
        'id': '03240',
        'slug': 'the-pallid-mask',
        'title': 'The Pallid Mask',
        'layout': None # dynamic catacombs
    },
    {
        'id': '03274',
        'slug': 'black-stars-rise',
        'title': 'Black Stars Rise',
        'layout': [
            ".                cloister      .           northTower      .",
            "knightsHall      cloister      .           northTower      .",
            "knightsHall      abbeyChurch    brokenSteps .               outerWall",
            "chapelOfStAubert abbeyChurch    brokenSteps .               outerWall",
            "chapelOfStAubert chœurGothique  .           grandRue        .",
            ".                chœurGothique  .           grandRue        .",
            ".                abbeyTower     .           porteDeLAvancée .",
            ".                abbeyTower     .           porteDeLAvancée ."
        ]
    },
    {
        'id': '03316',
        'slug': 'dim-carcosa',
        'title': 'Dim Carcosa',
        'layout': [
            ".          darkSpires      .",
            ".          depthsOfDemhe   .",
            "dimStreets palaceOfTheKing ruinsOfCarcosa",
            ".          bleakPlains     .",
            ".          shoresOfHali    ."
        ]
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
    img_path = f"frontend/public/img/scenes/the-path-to-carcosa/{sc['slug']}.webp"
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
            
            bw = min(160, max(80, len(label) * 8 + 14))
            bh = 22
            draw.rectangle([(cx - bw//2, cy - bh//2), (cx + bw//2, cy + bh//2)], fill=(20, 30, 20), outline=(230, 197, 132), width=1)
            draw.text((cx - bw//2 + 4, cy - bh//2 + 4), f"{label} [{px},{py}]", fill=(0, 255, 255))
            draw.ellipse([(cx - 5, cy - 5), (cx + 5, cy + 5)], fill=(255, 0, 0))
    else:
        draw.text((50, 50), "Dynamic grid layout", fill=(255, 255, 0))
    
    out_path = os.path.join(artifact_dir, f"audit_{sc['slug']}.webp")
    draw_img.save(out_path)
    print(f"Saved audit for {sc['title']} -> {out_path} ({w}x{h})")
