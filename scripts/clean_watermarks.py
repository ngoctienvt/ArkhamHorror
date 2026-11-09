import cv2
import numpy as np
import os

artifact_dir = r'C:\Users\PC\.gemini\antigravity\brain\da436758-9b2c-456e-b1ae-327d265970c9\new_three'
files = [
    'the-unspeakable-oath.webp',
    'a-phantom-of-truth.webp',
    'black-stars-rise.webp',
]

for fname in files:
    fpath = os.path.join('frontend/public/img/scenes/the-path-to-carcosa', fname)
    img = cv2.imread(fpath)
    h, w = img.shape[:2]
    
    # Sparkle watermark is located at approx x: w-115 to w-85, y: h-100 to h-70
    # Let's inspect the mask in that area
    mask = np.zeros((h, w), dtype=np.uint8)
    
    # Sparkle bounding box
    sx1, sy1, sx2, sy2 = w - 120, h - 105, w - 80, h - 65
    roi = img[sy1:sy2, sx1:sx2]
    gray_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    
    # The sparkle is a semi-transparent white/gray diamond
    # Inpaint circle around center (sx1 + 20, sy1 + 20) with radius 18
    cx, cy = (sx1 + sx2) // 2, (sy1 + sy2) // 2
    cv2.circle(mask, (cx, cy), 18, 255, -1)
    
    # For the-unspeakable-oath, also remove the text at bottom center
    if 'unspeakable' in fname:
        # text is around y = 556 to 570, x = 330 to 690
        # The background there is pure black floor
        img[554:572, 300:720] = [0, 0, 0]
    
    # Inpaint sparkle
    inpainted = cv2.inpaint(img, mask, inpaintRadius=12, flags=cv2.INPAINT_TELEA)
    
    # Save back to frontend/public/img/scenes/the-path-to-carcosa
    # and to artifact
    cv2.imwrite(fpath, inpainted, [cv2.IMWRITE_WEBP_QUALITY, 90])
    cv2.imwrite(os.path.join(artifact_dir, f"cleaned_{fname}"), inpainted, [cv2.IMWRITE_WEBP_QUALITY, 90])
    print(f"Cleaned {fname} successfully")
