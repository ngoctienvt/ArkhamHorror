"""Debug pin overlays only; never writes production artwork."""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageOps

folder = Path(__file__).resolve().parent
public = folder.parents[1] / 'frontend/public'
output = folder / 'previews'
output.mkdir(exist_ok=True)
thumbnails = []
for board in json.loads((folder / 'preview-boards.json').read_text(encoding='utf-8')):
    path = public / board['image']
    if not path.exists():
        print('PENDING', board['image'])
        continue
    with Image.open(path) as original:
        picture = ImageOps.contain(original.convert('RGB'), (1280, 720))
    draw = ImageDraw.Draw(picture)
    seen = set()
    for code, point in board['pins']:
        x, y = point
        if (x, y) in seen:
            continue
        seen.add((x, y))
        px, py = round(x * picture.width / 100), round(y * picture.height / 100)
        label = f"{code.rsplit(':', 1)[-1]} [{x:g},{y:g}]"
        draw.ellipse((px - 6, py - 6, px + 6, py + 6), fill='#00e6ff', outline='black', width=2)
        lx, ly = min(max(0, px - 30), picture.width - 120), max(0, py - 24)
        draw.rectangle((lx, ly, lx + 120, ly + 15), fill='#071d26')
        draw.text((lx + 3, ly + 1), label, fill='#00e6ff')
    picture.save(output / f"{board['id']}.webp", quality=90)
    thumb = Image.new('RGB', (640, 385), '#101820')
    thumb.paste(picture.resize((640, 360)), (0, 25))
    ImageDraw.Draw(thumb).text((5, 6), board['id'], fill='white')
    thumbnails.append(thumb)
for start in range(0, len(thumbnails), 6):
    batch = thumbnails[start:start + 6]
    sheet = Image.new('RGB', (1280, ((len(batch) + 1) // 2) * 385), '#101820')
    for index, thumb in enumerate(batch):
        sheet.paste(thumb, ((index % 2) * 640, (index // 2) * 385))
    sheet.save(output / f'pin-review-{start // 6 + 1}.jpg', quality=90)
print('Rendered', len(thumbnails), 'debug pin previews')
