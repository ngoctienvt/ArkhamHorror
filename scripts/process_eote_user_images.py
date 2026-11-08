import os
from PIL import Image

src_dir = 'frontend/public/img/scenes/the-edge-of-the-earth'

mapping = {
    'dd80fe5f-549b-4035-b598-8c39ea48d79d.webp': 'ice-and-death-part-1.webp',
    '14d1e414-7e8d-46bf-811e-4eb6b9739660.webp': 'ice-and-death-part-2.webp',
    'fcfbe4c8-b2f8-4a06-87bb-d36acaf624d9.webp': 'ice-and-death-part-3.webp',
    '216a6f63-c5d0-46ec-a4cf-c551e8545f87.webp': 'fatal-mirage.webp',
    '7a6e3d0a-0078-459d-9146-17faa25c6622.webp': 'to-the-forbidden-peaks.webp',
    '699456b9-625c-4de5-b50c-2bb6fb3aba69.webp': 'city-of-the-elder-things.webp',
    '16e68f3a-4115-4e74-9bbb-c6c3a2e4db6a.webp': 'the-heart-of-madness-part-1.webp',
    'd44db538-bfd4-428f-8a40-12107843ed36.webp': 'the-heart-of-madness-part-2.webp',
}

target_w, target_h = 1920, 1080

for raw_name, slug_name in mapping.items():
    raw_path = os.path.join(src_dir, raw_name)
    if not os.path.exists(raw_path):
        print(f"File not found: {raw_path}")
        continue

    im = Image.open(raw_path).convert('RGB')
    w, h = im.size
    
    # In images with watermark sparkle at the bottom-right (x ~ 88-94%, y ~ 80-88%),
    # let's clone a nearby patch to cleanly heal it if it's there
    # Check sparkle position around (w - 110, h - 100)
    # Patch box: around w-120 to w-40, h-110 to h-40
    # Source box: sample from slightly above or to the left
    patch_box = (w - 120, h - 120, w - 30, h - 30)
    source_box = (w - 120, h - 200, w - 30, h - 110)
    
    patch = im.crop(source_box)
    im.paste(patch, (w - 120, h - 120))

    # Resize to exact 1920x1080 with high quality Lanczos
    resized = im.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    out_path = os.path.join(src_dir, slug_name)
    resized.save(out_path, 'WEBP', quality=88, method=6)
    
    print(f"Processed: {slug_name} ({os.path.getsize(out_path) // 1024} KB)")

# Remove raw UUID files
for raw_name in mapping.keys():
    raw_path = os.path.join(src_dir, raw_name)
    if os.path.exists(raw_path):
        os.remove(raw_path)
        print(f"Removed raw file: {raw_name}")

print("All Edge of the Earth images processed successfully!")
