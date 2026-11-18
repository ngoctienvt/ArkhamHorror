"""Contact sheets and alpha diagnostics for the shipped generated assets."""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageOps

folder = Path(__file__).resolve().parent
public = folder.parents[1] / 'frontend/public/img/scenes'
output = folder / 'previews'
output.mkdir(exist_ok=True)
entries = json.loads((folder / 'generated-art.json').read_text(encoding='utf-8'))
groups = {'sprites': [], 'panoramas': []}
alpha = []
for entry in entries:
    path = public / entry['output']
    if not path.exists():
        print('MISSING', entry['output'])
        continue
    with Image.open(path) as original:
        sprite = original.mode == 'RGBA'
        group = 'sprites' if sprite else 'panoramas'
        tile = Image.new('RGB', (400, 280), '#14242d')
        picture = ImageOps.contain(original.convert('RGBA'), (400, 250))
        tile.paste(picture, ((400 - picture.width) // 2, 25), picture)
        ImageDraw.Draw(tile).text((4, 5), entry['output'], fill='white')
        groups[group].append(tile)
        if sprite:
            channel = original.getchannel('A')
            alpha.append({'file': entry['output'], 'extrema': channel.getextrema(),
                          'bbox': channel.point(lambda v: 255 if v > 40 else 0).getbbox(), 'size': original.size})
for group, tiles in groups.items():
    for start in range(0, len(tiles), 12):
        batch = tiles[start:start + 12]
        sheet = Image.new('RGB', (1600, ((len(batch) + 3) // 4) * 280), '#14242d')
        for index, tile in enumerate(batch):
            sheet.paste(tile, ((index % 4) * 400, (index // 4) * 280))
        sheet.save(output / f'generated-{group}-{start // 12 + 1}.jpg', quality=90)
(folder / 'sprite-alpha.json').write_text(json.dumps(alpha, indent=2), encoding='utf-8')
print({key: len(value) for key, value in groups.items()})
