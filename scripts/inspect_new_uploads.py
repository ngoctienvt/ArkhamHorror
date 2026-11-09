import os
from PIL import Image

folder = 'frontend/public/img/scenes/side-stories'
files = [f for f in os.listdir(folder) if f.endswith('.webp') and f != 'traces-to-nowhere.webp']

print(f"Total {len(files)} new files found:")
# sort by creation/mtime
files_with_time = [(f, os.path.getmtime(os.path.join(folder, f))) for f in files]
files_with_time.sort(key=lambda x: x[1])

for f, t in files_with_time:
    p = os.path.join(folder, f)
    img = Image.open(p)
    print(f"{f}: size={img.size}, mode={img.mode}")
