import os
import json
from PIL import Image, ImageDraw, ImageFont

scenes_dir = 'frontend/public/img/scenes/the-edge-of-the-earth'
art_dir = r'C:\Users\PC\.gemini\antigravity\brain\1c158b7d-130f-4715-9b67-c44da80eba98'

def get_font(size, bold=False):
    windir = os.environ.get("WINDIR", "C:\\Windows")
    font_name = "segoeuib.ttf" if bold else "segoeui.ttf"
    font_path = os.path.join(windir, "Fonts", font_name)
    if os.path.exists(font_path):
        return ImageFont.truetype(font_path, size)
    alt = os.path.join(windir, "Fonts", "arialbd.ttf" if bold else "arial.ttf")
    if os.path.exists(alt):
        return ImageFont.truetype(alt, size)
    return ImageFont.load_default()

ice_and_death_anchors = [
    ("Crash Site", (50, 58)),
    ("Precarious Ice Sheet", (35, 56)),
    ("Treacherous Path", (68, 56)),
    ("Barrier Camp", (52, 24)),
    ("Broad Snowdrifts", (28, 78)),
    ("Snow Graves", (15, 88)),
    ("Remnants of Lake's Camp", (18, 46)),
    ("Frozen Shores", (24, 28)),
    ("Icebreaker Landing", (16, 14)),
    ("Icy Wastes", (36, 16)),
    ("Rocky Crags", (78, 24)),
    ("Frigid Cave", (88, 54)),
    ("Crystalline Cavern", (76, 38)),
]

heart_of_madness_anchors = [
    ("The Gate of Y'quaa", (50, 52)),
    ("Mist-Pylon 1 (N)", (50, 22)),
    ("Mist-Pylon 2 (NE)", (78, 30)),
    ("Mist-Pylon 3 (NW)", (19, 30)),
    ("Mist-Pylon 4 (SE)", (88, 68)),
    ("Mist-Pylon 5 (SW)", (12, 68)),
    ("Geothermal Vent", (38, 32)),
    ("Protoplasmic Pool", (30, 42)),
    ("Library of Kós", (65, 36)),
    ("Undercity Altar", (27, 66)),
    ("Hall of Sunless Sea", (74, 68)),
    ("Forsaken Temple", (38, 56)),
    ("Subnautical Sprawl", (82, 54)),
    ("Vaulted Corridor", (64, 52)),
    ("Titanic Ramps", (50, 86)),
    ("A Way Out", (50, 96)),
]

scenarios = [
    {
        'slug': 'ice-and-death-part-1',
        'title': "Ice and Death: Part 1 (08501a)",
        'img': 'ice-and-death-part-1.webp',
        'anchors': ice_and_death_anchors,
    },
    {
        'slug': 'ice-and-death-part-2',
        'title': "Ice and Death: Part 2 (08501b)",
        'img': 'ice-and-death-part-2.webp',
        'anchors': ice_and_death_anchors,
    },
    {
        'slug': 'ice-and-death-part-3',
        'title': "Ice and Death: Part 3 (08501c)",
        'img': 'ice-and-death-part-3.webp',
        'anchors': ice_and_death_anchors,
    },
    {
        'slug': 'fatal-mirage',
        'title': "Fatal Mirage (08549)",
        'img': 'fatal-mirage.webp',
        'anchors': [
            ("Prison of Memories", (50, 52)),
            ("Base Camp", (50, 22)),
            ("Ottoman Front", (18, 25)),
            ("Airfield", (12, 38)),
            ("Deck of the Theodosia", (10, 56)),
            ("Mo'ai Statues", (26, 52)),
            ("Hedge Maze", (20, 80)),
            ("Standing Stones", (58, 85)),
            ("University Halls", (74, 55)),
            ("Dyer's Classroom", (70, 58)),
            ("Deserted Station", (76, 24)),
            ("Alaskan Wilds", (93, 22)),
            ("Riverview Theatre", (91, 52)),
            ("Elder Chamber", (78, 82)),
            ("The Black Stone", (87, 86)),
        ],
    },
    {
        'slug': 'to-the-forbidden-peaks',
        'title': "To the Forbidden Peaks (08596)",
        'img': 'to-the-forbidden-peaks.webp',
        'anchors': [
            ("Deep Drifts (T1)", (8, 92)),
            ("White Bluff (T1)", (10, 55)),
            ("Steep Incline (T2)", (28, 76)),
            ("Narrow Ridge (T2)", (38, 54)),
            ("Rocky Ledge (T3)", (58, 54)),
            ("Snow-Covered Crag (T3)", (57, 34)),
            ("Windswept Path (T4)", (70, 36)),
            ("The Summit (T5)", (78, 14)),
        ],
    },
    {
        'slug': 'city-of-the-elder-things',
        'title': "City of the Elder Things (08621)",
        'img': 'city-of-the-elder-things.webp',
        'anchors': [
            ("Entrance to Depths", (50, 86)),
            ("Ruinous Streets", (50, 72)),
            ("Labyrinthine Chamber", (15, 75)),
            ("Map Room", (86, 78)),
            ("Stone Bridge", (52, 45)),
            ("Submerged Passageway", (54, 58)),
            ("Cylindrical Tower", (25, 28)),
            ("Roofless Rampart", (82, 44)),
            ("Ancient Planetarium", (39, 26)),
            ("Cyclopean Spires", (54, 22)),
            ("Temple of Elder Things", (74, 20)),
        ],
    },
    {
        'slug': 'the-heart-of-madness-part-1',
        'title': "The Heart of Madness: Part 1 (08648a)",
        'img': 'the-heart-of-madness-part-1.webp',
        'anchors': heart_of_madness_anchors,
    },
    {
        'slug': 'the-heart-of-madness-part-2',
        'title': "The Heart of Madness: Part 2 (08648b)",
        'img': 'the-heart-of-madness-part-2.webp',
        'anchors': heart_of_madness_anchors,
    },
]

title_font = get_font(28, bold=True)
label_font = get_font(18, bold=True)
small_font = get_font(14, bold=False)

for scen in scenarios:
    img_path = os.path.join(scenes_dir, scen['img'])
    if not os.path.exists(img_path):
        print(f"Skipping {scen['slug']}: file not found")
        continue

    base = Image.open(img_path).convert('RGBA')
    w, h = base.size

    # Create overlay
    overlay = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Title Banner
    banner_w, banner_h = 560, 60
    draw.rounded_rectangle([20, 20, 20 + banner_w, 20 + banner_h], radius=12, fill=(10, 16, 28, 225), outline=(0, 210, 255, 200), width=2)
    draw.text((40, 32), scen['title'], font=title_font, fill=(255, 255, 255, 255))

    # Draw Anchors
    for name, (px, py) in scen['anchors']:
        cx = int(w * px / 100)
        cy = int(h * py / 100)

        r = 18
        # Outer glow
        draw.ellipse([cx - r - 4, cy - r - 4, cx + r + 4, cy + r + 4], fill=(0, 230, 255, 60))
        # Button circle
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(12, 28, 48, 230), outline=(0, 230, 255, 255), width=3)
        # Inner dot
        draw.ellipse([cx - 5, cy - 5, cx + 5, cy + 5], fill=(255, 215, 0, 255))

        # Label Pill
        coord_txt = f"{px},{py}"
        full_txt = f"{name} [{coord_txt}]"
        bbox = draw.textbbox((0, 0), full_txt, font=label_font)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]

        pill_pad_x = 10
        pill_pad_y = 6
        lx = cx - tw // 2
        ly = cy - r - th - 14

        # Bounds check
        if ly < 10:
            ly = cy + r + 8
        if lx < 10:
            lx = 10
        if lx + tw + pill_pad_x * 2 > w - 10:
            lx = w - 10 - tw - pill_pad_x * 2

        pill_box = [lx - pill_pad_x, ly - pill_pad_y, lx + tw + pill_pad_x, ly + th + pill_pad_y]
        draw.rounded_rectangle(pill_box, radius=8, fill=(10, 16, 26, 220), outline=(0, 210, 255, 180), width=2)
        draw.text((lx, ly), full_txt, font=label_font, fill=(255, 255, 255, 255))

    # Composite
    result = Image.alpha_composite(base, overlay).convert('RGB')
    out_file = os.path.join(art_dir, f"preview_eote_{scen['slug']}.webp")
    result.save(out_file, 'WEBP', quality=88)
    print(f"Generated preview: {os.path.basename(out_file)} ({os.path.getsize(out_file) // 1024} KB)")

print("All Edge of the Earth previews generated successfully!")
