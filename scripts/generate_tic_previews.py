import os
import json
from PIL import Image, ImageDraw, ImageFont

scenes_dir = 'frontend/public/img/scenes/the-innsmouth-conspiracy'
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
        'slug': 'the-pit-of-despair',
        'title': "The Pit of Despair (07041)",
        'img': 'the-pit-of-despair.webp',
        'anchors': [
            ('Unfamiliar Chamber', (50, 52)),
            ('Bone-Ridden Pit', (24, 75)),
            ('Fish Graveyard', (76, 75)),
            ('Altar to Dagon', (65, 52)),
            ('Idol Chamber', (29, 40)),
            ('Sealed Exit', (77, 16)),
            ('Tidal Tunnels', (50, 28)),
        ]
    },
    {
        'slug': 'the-vanishing-of-elina-harper',
        'title': "The Vanishing of Elina Harper (07056)",
        'img': 'the-vanishing-of-elina-harper.webp',
        'anchors': [
            ('Innsmouth Square', (47, 52)),
            ('Fish Street Bridge', (67, 52)),
            ('Innsmouth Harbour', (85, 50)),
            ('First National Grocery', (35, 40)),
            ('Gilman House', (34, 76)),
            ('Esoteric Order of Dagon', (30, 22)),
            ('Marsh Refinery', (48, 18)),
            ('New Church Green', (68, 20)),
            ('Innsmouth Jail', (10, 80)),
            ('Sawbone Alley', (12, 54)),
            ('Shoreward Slums', (54, 72)),
            ('The Little Bookshop', (20, 36)),
            ('The House on Water Street', (80, 28)),
        ]
    },
    {
        'slug': 'in-too-deep',
        'title': "In Too Deep (07123)",
        'img': 'in-too-deep.webp',
        'anchors': [
            ('Fish Street Bridge', (54, 50)),
            ('Innsmouth Harbour', (82, 40)),
            ('Innsmouth Square', (44, 45)),
            ('First National Grocery', (34, 38)),
            ('New Church Green', (32, 16)),
            ('Marsh Refinery', (44, 14)),
            ('Esoteric Order of Dagon', (15, 24)),
            ('Railroad Station', (10, 32)),
            ('Sawbone Alley', (22, 50)),
            ('Gilman House', (12, 65)),
            ('Innsmouth Jail', (15, 85)),
            ('Shoreward Slums', (45, 78)),
            ('Desolate Coastline', (82, 75)),
            ('The House on Water Street', (70, 32)),
            ('The Little Bookshop', (25, 36)),
        ]
    },
    {
        'slug': 'devil-reef',
        'title': "Devil Reef (07163)",
        'img': 'devil-reef.webp',
        'anchors': [
            ('Churning Waters / Fishing Vessel', (50, 52)),
            ('Lonely Isle', (50, 24)),
            ('Waveworn Island', (78, 38)),
            ('Salt Marshes', (24, 32)),
            ('Black Reef', (82, 74)),
            ('Hidden Cove', (18, 76)),
            ("Bootlegger's Hideaway", (15, 62)),
            ('Deep One Grotto', (35, 52)),
            ('Cyclopean Ruins', (70, 56)),
            ('Temple of the Union', (50, 68)),
        ]
    },
    {
        'slug': 'horror-in-high-gear',
        'title': "Horror in High Gear (07198)",
        'img': 'horror-in-high-gear.webp',
        'anchors': [
            ('Dimly Lit Road / The Roadster', (14, 58)),
            ('Cliffside Road', (26, 38)),
            ('Fork in the Road', (50, 44)),
            ('Intersection', (58, 48)),
            ('Tight Turn', (68, 55)),
            ('Desolate Road', (56, 30)),
            ('Long Way Around', (78, 65)),
            ('Falcon Point Approach', (76, 12)),
        ]
    },
    {
        'slug': 'a-light-in-the-fog',
        'title': "A Light in the Fog (07231)",
        'img': 'a-light-in-the-fog.webp',
        'anchors': [
            ('Falcon Point Gatehouse', (14, 32)),
            ('Lighthouse Stairwell', (48, 38)),
            ('Lantern Room', (48, 12)),
            ('Falcon Point Cliffside', (74, 30)),
            ("Lighthouse Keeper's Cottage", (36, 32)),
            ('Sunken Grotto (Upper Depths)', (48, 60)),
            ('Sunken Grotto (Lower Depths)', (80, 75)),
            ('Sunken Grotto (Final Depths)', (88, 85)),
            ('Shrine to Hydra', (68, 76)),
            ('Deep One Nursery', (10, 80)),
            ('The Moon Room', (42, 88)),
            ('Pump Room', (32, 58)),
        ]
    },
    {
        'slug': 'the-lair-of-dagon',
        'title': "The Lair of Dagon (07274)",
        'img': 'the-lair-of-dagon.webp',
        'anchors': [
            ('Hall of Silence', (50, 18)),
            ('Hall of Loyalty', (18, 42)),
            ('Foul Corridors', (50, 42)),
            ('Hall of Rebirth', (82, 42)),
            ('Hall of Blood', (18, 68)),
            ('Grand Entryway', (50, 68)),
            ('Hall of the Deep', (82, 68)),
            ('Doorway to the Depths', (50, 85)),
            ('Lair of Dagon', (50, 93)),
        ]
    },
    {
        'slug': 'into-the-maelstrom',
        'title': "Into the Maelstrom (07311)",
        'img': 'into-the-maelstrom.webp',
        'anchors': [
            ("Lair of Dagon (Father Dagon's Sanctuary)", (24, 25)),
            ("Lair of Hydra (Mother Hydra's High Temple)", (78, 25)),
            ('Gateway to Y\'ha-nthlei', (50, 50)),
            ('Submerged Temple', (18, 50)),
            ('Syzygy Chamber', (30, 42)),
            ('Statues in the Deep', (34, 58)),
            ('Vault of Riches', (85, 52)),
            ('Undersea Corridors', (68, 50)),
            ('Sunken Halls', (50, 68)),
            ('Onyx Guardians', (30, 78)),
            ('Dark Abyss', (58, 85)),
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
    title_text = f"TIC Preview: {sc['title']}"
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
        draw.ellipse([cx - r - 3, cy - r - 3, cx + r + 3, cy + r + 3], outline=(0, 200, 255, 180), width=3)
        # Inner dark badge
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(15, 30, 40, 235), outline=(255, 255, 255, 240), width=2)

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
        ly = cy + r + 6 if cy < h * 0.8 else cy - r - lh - 12
        pad_x, pad_y = 8, 4

        draw.rounded_rectangle([lx - pad_x, ly - pad_y, lx + lw + pad_x, ly + lh + pad_y],
                               radius=5, fill=(10, 20, 30, 220), outline=(0, 200, 255, 210), width=1)
        draw.text((lx, ly), label_str, font=font_label, fill=(245, 245, 245, 255))
        idx += 1

    combined = Image.alpha_composite(base, overlay).convert('RGB')
    out_path = os.path.join(art_dir, f"preview_tic_{sc['slug']}.webp")
    combined.save(out_path, format='WEBP', quality=88)
    print(f"Saved: {out_path} ({os.path.getsize(out_path) // 1024} KB)")

for sc in scenarios:
    render_preview(sc)
print("All TIC previews generated successfully!")
