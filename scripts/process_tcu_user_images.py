import os
from PIL import Image

tcu_dir = 'frontend/public/img/scenes/the-circle-undone'

mapping = {
    'c3adcbd7-3dc6-404e-a80c-adb898314b55.webp': 'at-deaths-doorstep.webp',
    'afa6e905-4c41-473b-919b-9df1533fcfef.webp': 'the-witching-hour.webp',
    'a4bc1e89-66e9-4772-a5fc-de2812c06920.webp': 'the-secret-name.webp',
    'ed4d3a93-3222-47b6-9993-6e6624fbc5eb.webp': 'the-wages-of-sin.webp',
    '220e8fc0-1cfe-4f9b-a719-3d032cccfb08.webp': 'for-the-greater-good.webp',
    '1f957aa8-31b3-4def-9668-a125254eb2b5.webp': 'union-and-disillusion.webp',
    'ae655c81-46e7-4b23-b62b-358cf1b65d57.webp': 'in-the-clutches-of-chaos.webp',
    '91c5bb01-dc04-45e7-a33a-9f35878a0848.webp': 'before-the-black-throne.webp',
}

target_w, target_h = 1920, 1080
target_ratio = 16.0 / 9.0

for src_name, dst_name in mapping.items():
    src_path = os.path.join(tcu_dir, src_name)
    dst_path = os.path.join(tcu_dir, dst_name)
    
    if os.path.exists(src_path):
        im = Image.open(src_path).convert('RGB')
        w, h = im.size
        current_ratio = w / h
        
        if current_ratio > target_ratio:
            new_w = int(h * target_ratio)
            left = (w - new_w) // 2
            im_cropped = im.crop((left, 0, left + new_w, h))
        else:
            new_h = int(w / target_ratio)
            top = (h - new_h) // 2
            im_cropped = im.crop((0, top, w, top + new_h))
            
        im_resized = im_cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)
        im_resized.save(dst_path, 'WEBP', quality=86, method=6)
        print(f'Processed: {src_name} -> {dst_name} (1920x1080)')
        
        if src_name != dst_name:
            os.remove(src_path)
            print(f'Removed old file: {src_name}')
    else:
        print(f'Warning: {src_name} not found!')

# Copy at-deaths-doorstep.webp to disappearance-at-the-twilight-estate.webp for Prologue (05043)
src_twilight = os.path.join(tcu_dir, 'at-deaths-doorstep.webp')
dst_twilight = os.path.join(tcu_dir, 'disappearance-at-the-twilight-estate.webp')
if os.path.exists(src_twilight) and not os.path.exists(dst_twilight):
    im_twilight = Image.open(src_twilight)
    im_twilight.save(dst_twilight, 'WEBP', quality=86, method=6)
    print('Created disappearance-at-the-twilight-estate.webp copy')

print('\nAll files in TCU directory:')
for f in sorted(os.listdir(tcu_dir)):
    p = os.path.join(tcu_dir, f)
    if os.path.isfile(p):
        print(f'  {f}: {os.path.getsize(p)} bytes')
