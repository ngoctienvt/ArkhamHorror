import os
from PIL import Image

src_dir = 'frontend/public/img/scenes/the-innsmouth-conspiracy'

mapping = {
    '28e11dd7-3bed-41d9-8ed0-37b6654d7cce.webp': 'the-pit-of-despair.webp',
    '26491e71-b117-477d-a984-8519a8e3a598.webp': 'the-vanishing-of-elina-harper.webp',
    'b26ef5ea-20f3-4187-a114-5567c03757b0.webp': 'in-too-deep.webp',
    '04451168-8e8e-49cd-a0e3-4576b21cfe37.webp': 'devil-reef.webp',
    'a0e1fce4-0cbc-4414-bd39-3bdddb43b4a5.webp': 'horror-in-high-gear.webp',
    '6eaf3c74-fa63-4f78-9ab4-4afb2f4c74b6.webp': 'a-light-in-the-fog.webp',
    '607f49f6-f677-4967-adf9-726d6599058b.webp': 'the-lair-of-dagon.webp',
    'a9a7cecc-bb2a-4937-b528-059092601aa6.webp': 'into-the-maelstrom.webp',
}

target_w, target_h = 1920, 1080

for raw_name, slug_name in mapping.items():
    raw_path = os.path.join(src_dir, raw_name)
    if not os.path.exists(raw_path):
        print(f"File not found: {raw_path}")
        continue

    im = Image.open(raw_path).convert('RGB')
    
    # Clean the bottom-right corner sparkle watermark if present (around x > 90%, y > 88%)
    # By copying neighboring background texture or sampling surrounding pixels
    w, h = im.size
    # Check lower right region
    # Clone patch from slightly above/left to cover the watermark sparkle
    patch_box = (w - 120, h - 120, w - 20, h - 20)
    source_box = (w - 120, h - 180, w - 20, h - 80)
    # Blend/heal patch
    patch = im.crop(source_box)
    im.paste(patch, (w - 120, h - 120))

    # Resize to exact 1920x1080 with high quality Lanczos
    resized = im.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    out_path = os.path.join(src_dir, slug_name)
    resized.save(out_path, 'WEBP', quality=86, method=6)
    
    print(f"Processed: {slug_name} ({os.path.getsize(out_path) // 1024} KB)")

# Remove raw UUID files
for raw_name in mapping.keys():
    raw_path = os.path.join(src_dir, raw_name)
    if os.path.exists(raw_path):
        os.remove(raw_path)
        print(f"Removed raw file: {raw_name}")

print("All TIC images processed successfully!")
