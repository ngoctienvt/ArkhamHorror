import os, shutil
from PIL import Image
import cv2
import numpy as np

target_w, target_h = 1920, 1080

def heal_and_resize(src_path, dst_path):
    img_pil = Image.open(src_path).convert('RGB')
    cv_img = cv2.cvtColor(np.array(img_pil), cv2.COLOR_RGB2BGR)
    h, w, _ = cv_img.shape

    # Mask sparkle at bottom-right corner
    mask = np.zeros((h, w), dtype=np.uint8)
    cx, cy = w - 90, h - 80
    cv2.circle(mask, (cx, cy), 32, 255, -1)
    
    inpainted = cv2.inpaint(cv_img, mask, inpaintRadius=12, flags=cv2.INPAINT_TELEA)
    healed_pil = Image.fromarray(cv2.cvtColor(inpainted, cv2.COLOR_BGR2RGB))
    
    resized = healed_pil.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    os.makedirs(os.path.dirname(dst_path), exist_ok=True)
    resized.save(dst_path, 'WEBP', quality=88, method=6)
    print(f"Processed: {os.path.basename(dst_path)} ({os.path.getsize(dst_path) // 1024} KB)")

# Brethren of Ash
boa_dir = 'frontend/public/img/scenes/brethren-of-ash'
boa_map = {
    '569fd087-3b6b-4a9b-9f5a-af15917fd950.webp': 'spreading-flames.webp',
    '07cee8ce-1404-4342-9daa-3cf3923e644f.webp': 'smoke-and-mirrors.webp',
    'badfb1df-ee5f-4594-8b44-ec7673676f8c.webp': 'queen-of-ash.webp',
}

for raw_name, slug in boa_map.items():
    raw_p = os.path.join(boa_dir, raw_name)
    if os.path.exists(raw_p):
        out_p = os.path.join(boa_dir, slug)
        heal_and_resize(raw_p, out_p)
        os.remove(raw_p)

# Children of Blood & Side Stories
rob_dir = 'frontend/public/img/scenes/river-of-blood'
cob_dir = 'frontend/public/img/scenes/children-of-blood'
ss_dir = 'frontend/public/img/scenes/side-stories'

cob_map = {
    '26d6ed79-4f0f-4069-b008-8cb8cd91b803.webp': (cob_dir, 'river-of-blood.webp'),
    'ab5ba768-924a-4adf-b2fe-b6637f7a8abe.webp': (cob_dir, 'new-horizons.webp'),
    'a5935cfb-4321-41ff-bc75-f24941b3ddb7.webp': (cob_dir, 'blood-money.webp'),
    'abbe44df-81c8-4253-badd-37e4ef02e9bc.webp': (ss_dir, 'traces-to-nowhere.webp'),
}

for raw_name, (out_dir, slug) in cob_map.items():
    raw_p = os.path.join(rob_dir, raw_name)
    if os.path.exists(raw_p):
        out_p = os.path.join(out_dir, slug)
        heal_and_resize(raw_p, out_p)
        # Also copy to river-of-blood as fallback
        fallback_p = os.path.join(rob_dir, slug)
        shutil.copy2(out_p, fallback_p)
        os.remove(raw_p)

print("All Chapter 2 images processed successfully!")
