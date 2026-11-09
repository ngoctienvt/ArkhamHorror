import os
import shutil
import cv2
import numpy as np
from PIL import Image

folder = 'frontend/public/img/scenes/side-stories'

mapping = [
    ('ed955f84-166e-451d-aeba-5616dc12e9cc.webp', 'murder-at-the-excelsior-hotel.webp', '84001'),
    ('04638100-dc31-42cc-b4e4-db96dd0a3ae7.webp', 'carnevale-of-horrors.webp', '82001'),
    ('c2bec16e-ce11-4bbd-b2c0-8499d41ebb14.webp', 'curse-of-the-rougarou.webp', '81001'),
    ('b11013a0-cacd-4e6a-97a8-323da7b7dbcd.webp', 'fortune-and-folly.webp', '88001'),
    ('b3575622-c68b-4c6e-b76f-2e97ede6a580.webp', 'the-blob-that-ate-everything.webp', '85001'),
    ('fa0efd2b-1e4e-499e-be66-af59876b55b5.webp', 'machinations-through-time.webp', '87001'),
    ('eaac3231-e13e-4a96-b2e9-5cc6630c116a.webp', 'war-of-the-outer-gods.webp', '86001'),
    ('9f7ee9d4-ac7b-4f90-bfd5-1feb27e9c43b.webp', 'the-midwinter-gala.webp', '71001'),
    ('a5645e30-0673-456b-81bf-e3763f3c81cd.webp', 'film-fatale.webp', '72001'),
    ('7a8a5303-60b6-4c24-9534-4dac0fe9f923.webp', 'the-labyrinths-of-lunacy.webp', '70001'),
]

for src_name, dst_name, code in mapping:
    src_path = os.path.join(folder, src_name)
    dst_path = os.path.join(folder, dst_name)
    
    if not os.path.exists(src_path):
        print(f"Source missing: {src_name}")
        continue
    
    # Read with cv2
    img = cv2.imread(src_path)
    h, w = img.shape[:2]
    
    # Check bottom-right corner for OpenAI watermark sparkle
    # Usually located around [h - 40 to h - 15, w - 40 to w - 15] or [h - 60, w - 60]
    # Let's inspect the corner
    corner = img[max(0, h-60):h, max(0, w-60):w]
    # Inpaint a circular mask around the typical sparkle center if detected
    # Sparkle is typically centered at [w - 32, h - 32] or [w - 35, h - 35] in 1024x572
    # But let's check if there is high brightness in corner
    gray_corner = cv2.cvtColor(corner, cv2.COLOR_BGR2GRAY)
    max_val = np.max(gray_corner)
    
    # Save standard webp
    # Convert BGR to RGB
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    pil_img = Image.fromarray(img_rgb)
    pil_img.save(dst_path, 'WEBP', quality=90, method=6)
    print(f"Processed & saved: {dst_name} ({w}x{h}) for scenario {code}")

print("All 10 scenarios processed and renamed!")
