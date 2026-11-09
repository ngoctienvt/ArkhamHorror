import os
from PIL import Image
import cv2
import numpy as np

def heal_watermark(img_pil):
    cv_img = cv2.cvtColor(np.array(img_pil), cv2.COLOR_RGB2BGR)
    h, w, _ = cv_img.shape
    
    mask = np.zeros((h, w), dtype=np.uint8)
    cx, cy = w - 90, h - 80
    cv2.circle(mask, (cx, cy), 32, 255, -1)
    
    inpainted = cv2.inpaint(cv_img, mask, inpaintRadius=12, flags=cv2.INPAINT_TELEA)
    return Image.fromarray(cv2.cvtColor(inpainted, cv2.COLOR_BGR2RGB))

test_im = Image.open('frontend/public/img/scenes/brethren-of-ash/569fd087-3b6b-4a9b-9f5a-af15917fd950.webp').convert('RGB')
healed = heal_watermark(test_im)
healed.save('test_healed.webp', 'WEBP', quality=88)
print('Saved test_healed.webp')
