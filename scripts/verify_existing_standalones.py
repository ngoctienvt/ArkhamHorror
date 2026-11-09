import os
from PIL import Image

folder = 'frontend/public/img/scenes/side-stories'
scenarios = [
    ('curse-of-the-rougarou.webp', '81001', 'Curse of the Rougarou'),
    ('carnevale-of-horrors.webp', '82001', 'Carnevale of Horrors'),
    ('fortune-and-folly.webp', '88001', 'Fortune and Folly'),
    ('machinations-through-time.webp', '87001', 'Machinations Through Time'),
    ('war-of-the-outer-gods.webp', '86001', 'War of the Outer Gods'),
    ('the-midwinter-gala.webp', '71001', 'The Midwinter Gala'),
    ('film-fatale.webp', '72001', 'Film Fatale'),
    ('the-labyrinths-of-lunacy.webp', '70001', 'The Labyrinths of Lunacy'),
]

for img_name, code, title in scenarios:
    p = os.path.join(folder, img_name)
    if os.path.exists(p):
        img = Image.open(p)
        print(f"[{code}] {title}: exists ({img.size})")
    else:
        print(f"[{code}] {title}: MISSING ({p})")
