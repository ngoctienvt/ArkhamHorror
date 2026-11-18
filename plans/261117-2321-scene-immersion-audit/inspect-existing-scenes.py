from pathlib import Path
from PIL import Image, ImageDraw, ImageOps

folder = Path(__file__).resolve().parent
public = folder.parents[1] / 'frontend/public/img/scenes'
names = ['side-stories/fortune-and-folly', 'side-stories/machinations-through-time',
         'side-stories/murder-at-the-excelsior-hotel', 'side-stories/war-of-the-outer-gods',
         'the-edge-of-the-earth/fatal-mirage', 'the-drowned-city/court-of-the-ancients',
         'the-drowned-city/the-drowned-quarter-reveal', 'the-drowned-city/the-grand-vault',
         'hemlock-vale/fate-of-the-vale', 'the-scarlet-keys/dead-heat',
         'the-innsmouth-conspiracy/into-the-maelstrom-abyss']
sheet = Image.new('RGB', (1600, 840), '#14242d')
for index, name in enumerate(names):
    x, y = index % 4 * 400, index // 4 * 280
    with Image.open(public / f'{name}.webp') as picture:
        tile = ImageOps.contain(picture.convert('RGB'), (400, 250))
        sheet.paste(tile, (x, y + 25))
    ImageDraw.Draw(sheet).text((x + 3, y + 3), name.split('/')[-1], fill='white')
sheet.save(folder / 'previews/existing-scenes-review.jpg', quality=92)
