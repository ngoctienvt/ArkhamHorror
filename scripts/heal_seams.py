import glob, os
import cv2
import numpy as np

scenes_dir = 'frontend/public/img/scenes/the-edge-of-the-earth'
art_dir = r'C:\Users\PC\.gemini\antigravity\brain\1c158b7d-130f-4715-9b67-c44da80eba98'

files = glob.glob(os.path.join(scenes_dir, '*.webp'))

for f in files:
    img = cv2.imread(f)
    h, w, _ = img.shape
    
    # Calculate seam coordinates
    px = int(120 * w / 1024)
    py = int(120 * h / 572)
    
    x1 = w - px
    y1 = h - py
    
    # Create mask for the seam borders (width ~ 10px)
    mask = np.zeros((h, w), dtype=np.uint8)
    
    # Top border of the patch
    mask[max(0, y1 - 6):min(h, y1 + 6), x1:w] = 255
    # Left border of the patch
    mask[y1:h, max(0, x1 - 6):min(w, x1 + 6)] = 255
    
    # Inpaint the seam lines using Navier-Stokes based inpainting
    inpainted = cv2.inpaint(img, mask, inpaintRadius=7, flags=cv2.INPAINT_TELEA)
    
    cv2.imwrite(f, inpainted, [cv2.IMWRITE_WEBP_QUALITY, 88])
    print(f"Healed seam for: {os.path.basename(f)}")

print("All seams healed cleanly!")
