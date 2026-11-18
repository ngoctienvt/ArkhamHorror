import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageOps

folder = Path(__file__).resolve().parent / 'references'
pattern, name = sys.argv[1:3]
files = sorted(folder.glob(pattern))
columns = min(6, max(1, len(files)))
sheet = Image.new('RGB', (columns * 190, ((len(files) + columns - 1) // columns) * 285), '#182027')
draw = ImageDraw.Draw(sheet)
for index, path in enumerate(files):
    x, y = (index % columns) * 190, (index // columns) * 285
    with Image.open(path) as image:
        image = ImageOps.contain(image.convert('RGB'), (186, 260))
        sheet.paste(image, (x, y))
    draw.text((x, y + 262), path.stem, fill='white')
sheet.save(folder / name, quality=90)
print(folder / name)
