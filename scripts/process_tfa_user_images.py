import os
from PIL import Image

tfa_dir = 'frontend/public/img/scenes/the-forgotten-age'

mapping = {
    'e6b77446-8aad-41fd-8d92-658a2ec67364.webp': 'the-doom-of-eztli.webp',
    '7e76520c-86e4-4a5a-9751-cfc18ec9a48a.webp': 'threads-of-fate.webp',
    'b5276238-41f7-4cb3-93a2-bc55117407ff.webp': 'the-boundary-beyond.webp',
    'cleaned_file_4_perfect.png': 'heart-of-the-elders-part-2.webp',
    '2a5c9bbb-294f-430a-8a62-23d1dba16527.webp': 'the-city-of-archives.webp',
    '394e5f82-ab00-4edd-9df0-22c39d29a850.webp': 'the-depths-of-yoth.webp',
    '914e5c25-bf67-4a65-8a0e-5d0882973a19.webp': 'shattered-aeons.webp',
    '57a0e4cb-7694-456e-8a73-062b4e97d503.webp': 'turn-back-time.webp',
}

target_w, target_h = 1920, 1080
target_ratio = 16.0 / 9.0

for src_name, dst_name in mapping.items():
    src_path = os.path.join(tfa_dir, src_name)
    dst_path = os.path.join(tfa_dir, dst_name)
    
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
        
        # Remove old raw file
        if src_name != dst_name:
            os.remove(src_path)
            print(f'Removed old file: {src_name}')
    else:
        print(f'Warning: {src_name} not found!')

# For heart-of-the-elders-part-1, use part-2 as fallback if not present
part1_path = os.path.join(tfa_dir, 'heart-of-the-elders-part-1.webp')
part2_path = os.path.join(tfa_dir, 'heart-of-the-elders-part-2.webp')
if not os.path.exists(part1_path) and os.path.exists(part2_path):
    im_part2 = Image.open(part2_path)
    im_part2.save(part1_path, 'WEBP', quality=86, method=6)
    print('Created heart-of-the-elders-part-1.webp as fallback copy')

print('\nAll files in TFA directory:')
for f in sorted(os.listdir(tfa_dir)):
    p = os.path.join(tfa_dir, f)
    if os.path.isfile(p):
        print(f'  {f}: {os.path.getsize(p)} bytes')
