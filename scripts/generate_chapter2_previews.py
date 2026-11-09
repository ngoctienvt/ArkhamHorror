import os
from PIL import Image, ImageDraw, ImageFont

brain_dir = r"C:\Users\PC\.gemini\antigravity\brain\1c158b7d-130f-4715-9b67-c44da80eba98"

def get_font(size, bold=False):
    font_name = 'arialbd.ttf' if bold else 'arial.ttf'
    try:
        return ImageFont.truetype(font_name, size)
    except:
        return ImageFont.load_default()

scenarios = [
    {
        'slug': 'spreading-flames',
        'title': "Spreading Flames (12105)",
        'img': 'frontend/public/img/scenes/brethren-of-ash/spreading-flames.webp',
        'anchors': [
            ("River Docks", (18, 50)),
            ("River Street", (48, 48)),
            ("Merchant District", (78, 46)),
            ("Miskatonic River", (32, 78)),
            ("Warehouse District", (68, 76)),
        ],
    },
    {
        'slug': 'smoke-and-mirrors',
        'title': "Smoke and Mirrors (12133)",
        'img': 'frontend/public/img/scenes/brethren-of-ash/smoke-and-mirrors.webp',
        'anchors': [
            ("Northside", (18, 22)),
            ("Downtown", (50, 20)),
            ("Easttown", (84, 22)),
            ("Miskatonic U.", (22, 50)),
            ("Merchant District", (50, 48)),
            ("Waterfront", (78, 50)),
            ("Uptown", (18, 80)),
            ("Southside", (50, 80)),
            ("French Hill", (82, 80)),
        ],
    },
    {
        'slug': 'queen-of-ash',
        'title': "Queen of Ash (12168)",
        'img': 'frontend/public/img/scenes/brethren-of-ash/queen-of-ash.webp',
        'anchors': [
            ("Sluice Control", (50, 16)),
            ("Underground Cistern", (50, 36)),
            ("Sewer Culvert", (50, 84)),
            ("Infested Pipes", (12, 56)),
            ("Overgrown Tunnels", (32, 56)),
            ("Flooded Crypt", (50, 56)),
            ("Smuggler's Cache", (68, 56)),
            ("Sewer Incline", (88, 56)),
        ],
    },
    {
        'slug': 'river-of-blood',
        'title': "River of Blood (13001)",
        'img': 'frontend/public/img/scenes/children-of-blood/river-of-blood.webp',
        'anchors': [
            ("Riverside Park", (20, 28)),
            ("Erwin Bridge", (54, 48)),
            ("Industrial District", (82, 32)),
            ("River Docks", (52, 70)),
            ("Riverboat Landing", (80, 75)),
        ],
    },
    {
        'slug': 'new-horizons',
        'title': "New Horizons (13031)",
        'img': 'frontend/public/img/scenes/children-of-blood/new-horizons.webp',
        'anchors': [
            ("Factory Floor: West", (22, 30)),
            ("Assembly Line", (50, 30)),
            ("Factory Floor: East", (78, 30)),
            ("Storage Yard", (22, 48)),
            ("Foreman's Office", (50, 48)),
            ("Loading Bay", (78, 48)),
            ("Chemical Vat", (22, 68)),
            ("Descending Tunnel", (50, 68)),
            ("Refinery Vault", (78, 68)),
        ],
    },
    {
        'slug': 'blood-money',
        'title': "Blood Money (13068)",
        'img': 'frontend/public/img/scenes/children-of-blood/blood-money.webp',
        'anchors': [
            ("Grand Foyer", (50, 18)),
            ("Dining Hall", (24, 46)),
            ("Ballroom", (50, 46)),
            ("Study", (78, 46)),
            ("Veranda", (24, 76)),
            ("Courtyard", (50, 76)),
            ("Conservatory", (78, 76)),
        ],
    },
    {
        'slug': 'traces-to-nowhere',
        'title': "Traces to Nowhere (73001)",
        'img': 'frontend/public/img/scenes/side-stories/traces-to-nowhere.webp',
        'anchors': [
            ("Train Station", (20, 31)),
            ("Tick-Tock Club", (17, 82)),
            ("South Church", (36, 60)),
            ("Merchant District", (46, 52)),
            ("Steer's Office", (60, 48)),
            ("Historical Society", (74, 51)),
            ("French Hill", (78, 14)),
            ("Meiger Estate", (92, 13)),
            ("Arkham Advertiser", (88, 59)),
            ("Duterte Funeral Home", (55, 75)),
            ("Bone Pit / Crypt", (68, 84)),
        ],
    },
]

title_font = get_font(26, bold=True)
label_font = get_font(13, bold=True)

for scen in scenarios:
    if not os.path.exists(scen['img']):
        print(f"Skipping {scen['slug']}: file not found: {scen['img']}")
        continue

    base = Image.open(scen['img']).convert('RGBA')
    w, h = base.size

    overlay = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Title Banner
    banner_w, banner_h = 480, 52
    draw.rounded_rectangle([15, 15, 15 + banner_w, 15 + banner_h], radius=10, fill=(10, 16, 28, 225), outline=(0, 210, 255, 200), width=2)
    draw.text((30, 25), scen['title'], font=title_font, fill=(255, 255, 255, 255))

    for name, (px, py) in scen['anchors']:
        cx = int(w * px / 100)
        cy = int(h * py / 100)

        r = 13
        draw.ellipse([cx - r - 3, cy - r - 3, cx + r + 3, cy + r + 3], fill=(0, 230, 255, 60))
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(12, 28, 48, 230), outline=(0, 230, 255, 255), width=2)
        draw.ellipse([cx - 4, cy - 4, cx + 4, cy + 4], fill=(255, 215, 0, 255))

        coord_txt = f"{px},{py}"
        full_txt = f"{name} [{coord_txt}]"
        bbox = draw.textbbox((0, 0), full_txt, font=label_font)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]

        tx = max(10, min(w - tw - 16, cx - tw // 2))
        ty = cy - r - th - 10
        if ty < 15:
            ty = cy + r + 6

        draw.rounded_rectangle([tx - 4, ty - 2, tx + tw + 4, ty + th + 4], radius=5, fill=(10, 16, 28, 220), outline=(0, 210, 255, 180), width=1)
        draw.text((tx, ty), full_txt, font=label_font, fill=(255, 255, 255, 255))

    combined = Image.alpha_composite(base, overlay)
    out_path = os.path.join(brain_dir, f"preview_ch2_{scen['slug']}.webp")
    combined.convert('RGB').save(out_path, 'WEBP', quality=88)
    print(f"Generated preview: {out_path}")

print("All Chapter 2 previews updated!")
