import os
from PIL import Image, ImageDraw, ImageFont

brain_dir = r"C:\Users\PC\.gemini\antigravity\brain\1c158b7d-130f-4715-9b67-c44da80eba98"

def get_font(size, bold=False):
    font_name = 'arialbd.ttf' if bold else 'arial.ttf'
    try:
        return ImageFont.truetype(font_name, size)
    except:
        return ImageFont.load_default()

title_font = get_font(22, bold=True)
label_font = get_font(12, bold=True)

scenarios = [
    {
        'slug': 'curse-of-the-rougarou',
        'title': "Curse of the Rougarou (81001)",
        'img': 'frontend/public/img/scenes/side-stories/curse-of-the-rougarou.webp',
        'anchors': [
            ("New Orleans", (80, 24)),
            ("Unhallowed Land", (20, 26)),
            ("Foul Swamp", (50, 48)),
            ("Riverside", (15, 74)),
            ("Wilderness", (84, 76)),
        ]
    },
    {
        'slug': 'carnevale-of-horrors',
        'title': "Carnevale of Horrors (82001)",
        'img': 'frontend/public/img/scenes/side-stories/carnevale-of-horrors.webp',
        'anchors': [
            ("Rialto Bridge", (50, 18)),
            ("San Marco Basilica", (84, 18)),
            ("Streets of Venice", (88, 48)),
            ("Flooded Square", (82, 76)),
            ("Accademia Bridge", (18, 56)),
            ("Canal-side", (18, 28)),
            ("The Guardian", (10, 85)),
            ("Salute Steps", (38, 78)),
            ("Gondola / Cnidathqua", (54, 50)),
        ]
    },
    {
        'slug': 'fortune-and-folly',
        'title': "Fortune and Folly (88001)",
        'img': 'frontend/public/img/scenes/side-stories/fortune-and-folly.webp',
        'anchors': [
            ("Poker Table", (32, 65)),
            ("Roulette Wheel", (48, 65)),
            ("Baccarat Table", (64, 65)),
            ("Slot Machines", (88, 58)),
            ("VIP Lounge", (80, 26)),
            ("Security Hallway", (68, 86)),
            ("Vault Door", (78, 86)),
            ("Sanctum of Fortune", (92, 86)),
        ]
    },
    {
        'slug': 'machinations-through-time',
        'title': "Machinations Through Time (87001)",
        'img': 'frontend/public/img/scenes/side-stories/machinations-through-time.webp',
        'anchors': [
            ("Arkham Gazette (1890s)", (18, 30)),
            ("O'Malley's Watch Shop", (22, 54)),
            ("River Docks (Past)", (12, 75)),
            ("Arkham Advertiser (1920s)", (52, 28)),
            ("Tick-Tock Club (1920s)", (50, 52)),
            ("Ye Olde Magick Shoppe", (62, 52)),
            ("River Docks (Present)", (48, 76)),
            ("Corrigan Industries (2890s)", (84, 30)),
            ("Arkham Advertiser (2890s)", (82, 54)),
            ("River Docks (Future)", (84, 76)),
        ]
    },
    {
        'slug': 'war-of-the-outer-gods',
        'title': "War of the Outer Gods (86001)",
        'img': 'frontend/public/img/scenes/side-stories/war-of-the-outer-gods.webp',
        'anchors': [
            ("Hub Dimension (Rift)", (50, 20)),
            ("Streets of New York", (25, 62)),
            ("Shrine of Magh'an Ark'at", (50, 68)),
            ("The Burning Pit", (75, 78)),
            ("Athenaeum of the Empty Sky", (85, 38)),
            ("Arkham", (18, 76)),
        ]
    },
    {
        'slug': 'the-midwinter-gala',
        'title': "The Midwinter Gala (71001)",
        'img': 'frontend/public/img/scenes/side-stories/the-midwinter-gala.webp',
        'anchors': [
            ("Lantern Chamber", (22, 74)),
            ("Grand Lobby", (50, 72)),
            ("Ballroom", (78, 74)),
            ("Art Gallery", (25, 36)),
            ("Library & Parlor", (76, 36)),
        ]
    },
    {
        'slug': 'film-fatale',
        'title': "Film Fatale (72001)",
        'img': 'frontend/public/img/scenes/side-stories/film-fatale.webp',
        'anchors': [
            ("Gothic Castle Set", (16, 52)),
            ("Central Lot", (50, 62)),
            ("Pyramid & Jungle Set", (78, 62)),
            ("Soundstages", (48, 28)),
        ]
    },
    {
        'slug': 'the-labyrinths-of-lunacy',
        'title': "The Labyrinths of Lunacy (70001)",
        'img': 'frontend/public/img/scenes/side-stories/the-labyrinths-of-lunacy.webp',
        'anchors': [
            ("Abandoned Warehouse", (50, 18)),
            ("Chamber of Night", (22, 54)),
            ("Labyrinthine Halls", (50, 52)),
            ("Chamber of Decay", (78, 54)),
            ("Chamber of Secrets", (50, 84)),
        ]
    },
]

for scen in scenarios:
    if not os.path.exists(scen['img']):
        print(f"Skipping {scen['slug']}")
        continue

    base = Image.open(scen['img']).convert('RGBA')
    w, h = base.size

    overlay = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Title Banner
    banner_w, banner_h = 440, 46
    draw.rounded_rectangle([15, 15, 15 + banner_w, 15 + banner_h], radius=8, fill=(10, 16, 28, 225), outline=(0, 210, 255, 200), width=2)
    draw.text((25, 22), scen['title'], font=title_font, fill=(255, 255, 255, 255))

    for name, (px, py) in scen['anchors']:
        cx = int(w * px / 100)
        cy = int(h * py / 100)

        r = 12
        draw.ellipse([cx - r - 3, cy - r - 3, cx + r + 3, cy + r + 3], fill=(0, 230, 255, 60))
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(12, 28, 48, 230), outline=(0, 230, 255, 255), width=2)
        draw.ellipse([cx - 4, cy - 4, cx + 4, cy + 4], fill=(255, 215, 0, 255))

        coord_txt = f"{px},{py}"
        full_txt = f"{name} [{coord_txt}]"
        bbox = draw.textbbox((0, 0), full_txt, font=label_font)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]

        tx = max(10, min(w - tw - 16, cx - tw // 2))
        ty = cy - r - th - 8
        if ty < 15:
            ty = cy + r + 6

        draw.rounded_rectangle([tx - 4, ty - 2, tx + tw + 4, ty + th + 4], radius=4, fill=(10, 16, 28, 220), outline=(0, 210, 255, 180), width=1)
        draw.text((tx, ty), full_txt, font=label_font, fill=(255, 255, 255, 255))

    combined = Image.alpha_composite(base, overlay)
    out_path = os.path.join(brain_dir, f"preview_standalone_{scen['slug']}.webp")
    combined.convert('RGB').save(out_path, 'WEBP', quality=88)
    print(f"Generated preview: {out_path}")

print("All standalone previews generated successfully!")
