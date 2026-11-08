import os
from PIL import Image, ImageDraw, ImageFont

scenes_dir = 'frontend/public/img/scenes/the-forgotten-age'
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
        'slug': 'the-untamed-wilds',
        'title': 'The Untamed Wilds (04043)',
        'anchors': [
            ('Expedition Camp', (73, 27)),
            ('Rope Bridge', (50, 48)),
            ('Path of Thorns', (22, 53)),
            ('Overgrown Ruins', (18, 42)),
            ("Serpent's Haven", (78, 45)),
            ('River Canyon', (88, 82)),
            ('Circuitous Trail', (38, 56)),
            ('Temple of the Fang', (25, 73)),
            ('Ruins of Eztli', (38, 80)),
        ]
    },
    {
        'slug': 'the-doom-of-eztli',
        'title': 'The Doom of Eztli (04054)',
        'anchors': [
            ('Entryway', (18, 22)),
            ('Ancient Hall', (20, 52)),
            ('Grand Chamber', (85, 48)),
            ('Burial Pit', (12, 82)),
            ('Underground Ruins', (48, 55)),
            ('Secret Passage', (82, 82)),
            ('Chamber of Time', (50, 84)),
        ]
    },
    {
        'slug': 'threads-of-fate',
        'title': 'Threads of Fate (04113)',
        'anchors': [
            ('Train Tracks', (30, 20)),
            ('Town Hall', (55, 20)),
            ('Police Station', (80, 20)),
            ('Curiositie Shoppe', (12, 50)),
            ('Northside', (30, 50)),
            ('Downtown', (50, 50)),
            ('Easttown', (70, 50)),
            ("Velma's Diner", (88, 50)),
            ('Eztli Exhibit', (25, 82)),
            ('Miskatonic University', (48, 82)),
            ('Rivertown', (72, 82)),
            ('Black Cave', (90, 82)),
        ]
    },
    {
        'slug': 'the-boundary-beyond',
        'title': 'The Boundary Beyond (04161)',
        'anchors': [
            ('Zócalo', (25, 65)),
            ('Metropolitan Cathedral', (52, 56)),
            ('Coyoacán', (78, 50)),
            ('Chapultepec Park', (18, 33)),
            ('Temple Ruins / Templo Mayor', (45, 80)),
            ('Xochimilco Canals', (90, 80)),
        ]
    },
    {
        'slug': 'heart-of-the-elders-part-2',
        'title': 'Heart of the Elders: Part 2 (04205b)',
        'anchors': [
            ('The Depths Below', (50, 20)),
            ('Vast Passages', (25, 42)),
            ('Dark Hollow', (75, 42)),
            ('Hall of Idolatry', (18, 75)),
            ('Crystal Pillars', (50, 75)),
            ('Descent to Yoth', (80, 80)),
        ]
    },
    {
        'slug': 'the-city-of-archives',
        'title': 'The City of Archives (04237)',
        'anchors': [
            ('Yithian Orrery', (15, 20)),
            ('Lab of Great Race', (56, 20)),
            ('Deconstruction Room', (85, 52)),
            ('Towers of Pnakotus', (28, 45)),
            ('Halls of Pnakotus', (60, 48)),
            ('Interview Room', (85, 82)),
            ('Great Library', (45, 82)),
        ]
    },
    {
        'slug': 'the-depths-of-yoth',
        'title': 'The Depths of Yoth (04277)',
        'anchors': [
            ('Steps of Yoth', (50, 18)),
            ('City of Serpents', (25, 45)),
            ('Bright Canyon', (75, 45)),
            ('Crumbling Precipice', (20, 78)),
            ('Bridge over N\'kai', (50, 78)),
            ('Hall of Heresy', (80, 78)),
        ]
    },
    {
        'slug': 'shattered-aeons',
        'title': 'Shattered Aeons (04314)',
        'anchors': [
            ('Shores of R\'lyeh', (15, 20)),
            ('Atlantis', (45, 20)),
            ('Ruins of New York', (82, 20)),
            ('Nexus of N\'kai', (40, 52)),
            ('A Pocket in Time', (70, 52)),
            ('Valusia', (90, 52)),
            ('Yuggoth', (18, 82)),
            ('Mu', (48, 82)),
            ('Plateau of Leng', (80, 82)),
        ]
    },
    {
        'slug': 'turn-back-time',
        'title': 'Turn Back Time (04344)',
        'anchors': [
            ('Entryway', (18, 22)),
            ('Ancient Hall', (20, 52)),
            ('Grand Chamber', (85, 48)),
            ('Burial Pit', (12, 82)),
            ('Underground Ruins', (48, 55)),
            ('Secret Passage', (82, 82)),
            ('Chamber of Time', (50, 84)),
        ]
    }
]

font_title = get_font(28, bold=True)
font_label = get_font(15, bold=True)

for sc in scenarios:
    img_path = os.path.join(scenes_dir, f"{sc['slug']}.webp")
    if not os.path.exists(img_path):
        continue
        
    im = Image.open(img_path).convert('RGBA')
    overlay = Image.new('RGBA', im.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    W, H = im.size
    
    # Title badge
    draw.rectangle([30, 25, 540, 75], fill=(15, 20, 25, 220), outline=(200, 180, 120, 255), width=2)
    draw.text((45, 33), sc['title'].upper(), fill=(255, 220, 120, 255), font=font_title)
    
    for name, (px_pct, py_pct) in sc['anchors']:
        x = int(W * px_pct / 100)
        y = int(H * py_pct / 100)
        
        r = 16
        draw.ellipse([x - r, y - r, x + r, y + r], fill=(220, 50, 50, 180), outline=(255, 255, 255, 255), width=3)
        draw.ellipse([x - 5, y - 5, x + 5, y + 5], fill=(255, 255, 255, 255))
        
        text = f"{name} [{px_pct}%, {py_pct}%]"
        bbox = font_label.getbbox(text)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        
        pill_w = tw + 20
        pill_h = th + 12
        pill_x = x - pill_w // 2
        pill_y = y - r - pill_h - 4
        
        pill_x = max(10, min(W - pill_w - 10, pill_x))
        if pill_y < 10:
            pill_y = y + r + 6
            
        draw.rectangle([pill_x - 1, pill_y - 1, pill_x + pill_w + 1, pill_y + pill_h + 1], fill=(0, 0, 0, 180))
        draw.rectangle([pill_x, pill_y, pill_x + pill_w, pill_y + pill_h], fill=(20, 28, 36, 230), outline=(120, 200, 255, 255), width=1)
        draw.text((pill_x + 10, pill_y + 4), text, fill=(255, 255, 255, 255), font=font_label)
        
    final_im = Image.alpha_composite(im, overlay).convert('RGB')
    out_file = os.path.join(art_dir, f"preview_{sc['slug']}.webp")
    final_im.save(out_file, 'WEBP', quality=85)
    print(f"Generated preview: preview_{sc['slug']}.webp")

print("All calibrated previews generated!")
