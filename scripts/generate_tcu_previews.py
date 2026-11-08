import os
import json
from PIL import Image, ImageDraw, ImageFont

scenes_dir = 'frontend/public/img/scenes/the-circle-undone'
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

scenarios = [
    {
        'slug': 'disappearance-at-the-twilight-estate',
        'title': "Prologue: Disappearance at the Twilight Estate (05043)",
        'img': 'disappearance-at-the-twilight-estate.webp',
        'anchors': [
            ('Entry Hall', (40, 80)),
            ('Victorian Halls', (55, 48)),
            ('Trophy Room', (38, 43)),
            ('Billiards Room', (30, 52)),
            ('Master Bedroom', (78, 48)),
            ('Balcony', (91, 54)),
            ('Office', (30, 22)),
        ]
    },
    {
        'slug': 'the-witching-hour',
        'title': "The Witching Hour (05050)",
        'img': 'the-witching-hour.webp',
        'anchors': [
            ("Witches' Circle", (50, 60)),
            ('Abandoned Mine', (17, 20)),
            ('Cairn Stones', (68, 85)),
            ('The Lonely Tree', (58, 35)),
            ("Child's Tree House", (30, 35)),
            ('Tainted Well', (40, 88)),
            ("Hermit's House", (73, 46)),
            ('Overgrown Barn', (22, 75)),
        ]
    },
    {
        'slug': 'at-deaths-doorstep',
        'title': "At Death's Doorstep (05065)",
        'img': 'at-deaths-doorstep.webp',
        'anchors': [
            ('Entry Hall', (40, 80)),
            ('Victorian Halls', (55, 48)),
            ('Trophy Room', (38, 43)),
            ('Billiards Room', (30, 52)),
            ('Master Bedroom', (78, 48)),
            ('Balcony', (91, 54)),
            ('Office', (30, 22)),
        ]
    },
    {
        'slug': 'the-secret-name',
        'title': "The Secret Name (05120)",
        'img': 'the-secret-name.webp',
        'anchors': [
            ('Moldy Halls', (24, 52)),
            ("Landlord's Quarters", (15, 80)),
            ("Joe Mazurewicz's Room", (24, 38)),
            ("Frank Elwood's Room", (35, 38)),
            ("Walter Gilman's Room", (18, 24)),
            ("Keziah's Room", (58, 24)),
            ("Salem Gaol, 1692", (68, 85)),
            ('Physics Classroom', (35, 24)),
            ('Site of the Sacrifice', (58, 52)),
            ('Strange Geometry', (40, 52)),
            ('Witch House Ruins', (67, 50)),
            ('Twilight Abyss', (80, 75)),
            ('City of Elder Things', (88, 40)),
            ('Court of Great Old Ones', (88, 20)),
        ]
    },
    {
        'slug': 'the-wages-of-sin',
        'title': "The Wages of Sin (05161)",
        'img': 'the-wages-of-sin.webp',
        'anchors': [
            ("Hangman's Brook", (40, 82)),
            ('Haunted Fields', (50, 42)),
            ('The Gallows', (58, 16)),
            ("Heretics' Graves", (26, 45)),
            ('Abandoned Chapel', (78, 46)),
            ('Chapel Attic', (76, 26)),
            ('Chapel Crypt', (88, 60)),
        ]
    },
    {
        'slug': 'for-the-greater-good',
        'title': "For the Greater Good (05197)",
        'img': 'for-the-greater-good.webp',
        'anchors': [
            ('Lodge Gates', (10, 20)),
            ('Lobby', (18, 62)),
            ('Lodge Cellar', (46, 50)),
            ('Lounge', (80, 20)),
            ('Library', (43, 18)),
            ('Vault', (43, 76)),
            ('Lodge Catacombs', (64, 68)),
            ('Ceremony Room', (78, 56)),
            ('Holding Cells', (60, 62)),
            ('Inner Sanctum', (88, 75)),
        ]
    },
    {
        'slug': 'union-and-disillusion',
        'title': "Union and Disillusion (05238)",
        'img': 'union-and-disillusion.webp',
        'anchors': [
            ('Miskatonic River', (50, 18)),
            ('Forbidding Shore', (28, 65)),
            ('Standing Stones', (32, 32)),
            ('Misty Clearing', (75, 32)),
            ('Forsaken Woods', (18, 48)),
            ('Moss-Covered Steps', (82, 48)),
            ('Haunted Spring', (45, 45)),
            ('Decayed Willow', (55, 38)),
            ('The Geist-Trap', (68, 75)),
        ]
    },
    {
        'slug': 'in-the-clutches-of-chaos',
        'title': "In the Clutches of Chaos (05284)",
        'img': 'in-the-clutches-of-chaos.webp',
        'anchors': [
            ("Hangman's Hill", (13, 28)),
            ('Uptown', (15, 62)),
            ('South Church', (20, 80)),
            ('Southside', (35, 72)),
            ('Merchant District', (48, 52)),
            ('Rivertown', (75, 58)),
            ('French Hill', (62, 82)),
            ('Silver Twilight Lodge', (90, 40)),
        ]
    },
    {
        'slug': 'before-the-black-throne',
        'title': "Before the Black Throne (05325)",
        'img': 'before-the-black-throne.webp',
        'anchors': [
            ('Cosmic Ingress', (21, 66)),
            ('Hideous Palace', (73, 26)),
            ('Court of Great Old Ones', (73, 26)),
            ('The Black Throne', (73, 26)),
            ("Dancer's Mist", (58, 70)),
            ('Flight into Oblivion', (78, 80)),
            ('Infinity of Darkness', (10, 50)),
            ('Cosmic Gate', (35, 75)),
            ('Pathway into Void', (45, 52)),
        ]
    }
]

def render_preview(sc):
    img_path = os.path.join(scenes_dir, sc['img'])
    if not os.path.exists(img_path):
        print(f"Skipping missing: {img_path}")
        return

    base = Image.open(img_path).convert('RGBA')
    overlay = Image.new('RGBA', base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    w, h = base.size

    # Scenario Header
    header_font = get_font(32, bold=True)
    title_text = f"TCU Preview: {sc['title']}"
    bbox = draw.textbbox((0, 0), title_text, font=header_font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.rectangle([20, 20, 40 + tw, 36 + th], fill=(10, 15, 25, 220), outline=(212, 175, 55, 240), width=2)
    draw.text((30, 26), title_text, font=header_font, fill=(255, 230, 160, 255))

    font_badge = get_font(18, bold=True)
    font_label = get_font(17, bold=True)

    # De-duplicate identical coordinates for badge stacking
    coord_groups = {}
    for name, (pct_x, pct_y) in sc['anchors']:
        pt = (pct_x, pct_y)
        if pt not in coord_groups:
            coord_groups[pt] = []
        coord_groups[pt].append(name)

    idx = 1
    for (pct_x, pct_y), names in coord_groups.items():
        cx = int(w * pct_x / 100.0)
        cy = int(h * pct_y / 100.0)

        r = 24
        # Glowing outer ring
        draw.ellipse([cx - r - 3, cy - r - 3, cx + r + 3, cy + r + 3], outline=(255, 215, 0, 160), width=3)
        # Inner dark badge
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(15, 25, 45, 235), outline=(255, 255, 255, 240), width=2)

        badge_num = str(idx)
        bb = draw.textbbox((0, 0), badge_num, font=font_badge)
        bw = bb[2] - bb[0]
        bh = bb[3] - bb[1]
        draw.text((cx - bw / 2, cy - bh / 2 - 2), badge_num, font=font_badge, fill=(255, 225, 120, 255))

        # Label text box
        label_str = " / ".join(names)
        bb_lbl = draw.textbbox((0, 0), label_str, font=font_label)
        lw = bb_lbl[2] - bb_lbl[0]
        lh = bb_lbl[3] - bb_lbl[1]

        lx = cx - lw / 2
        # Position label above or below marker
        ly = cy + r + 6 if cy < h * 0.8 else cy - r - lh - 12
        pad_x, pad_y = 8, 4

        draw.rounded_rectangle([lx - pad_x, ly - pad_y, lx + lw + pad_x, ly + lh + pad_y],
                               radius=5, fill=(10, 15, 25, 215), outline=(212, 175, 55, 200), width=1)
        draw.text((lx, ly), label_str, font=font_label, fill=(245, 245, 245, 255))
        idx += 1

    combined = Image.alpha_composite(base, overlay).convert('RGB')
    out_path = os.path.join(art_dir, f"preview_tcu_{sc['slug']}.webp")
    combined.save(out_path, format='WEBP', quality=88)
    print(f"Saved: {out_path} ({os.path.getsize(out_path) // 1024} KB)")

for sc in scenarios:
    render_preview(sc)
print("All TCU previews generated successfully!")
