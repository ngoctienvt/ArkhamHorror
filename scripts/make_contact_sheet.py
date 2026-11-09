import os
from PIL import Image

folder = 'frontend/public/img/scenes/side-stories'
files = [
    'ed955f84-166e-451d-aeba-5616dc12e9cc.webp',
    '04638100-dc31-42cc-b4e4-db96dd0a3ae7.webp',
    'c2bec16e-ce11-4bbd-b2c0-8499d41ebb14.webp',
    'b11013a0-cacd-4e6a-97a8-323da7b7dbcd.webp',
    'b3575622-c68b-4c6e-b76f-2e97ede6a580.webp',
    'fa0efd2b-1e4e-499e-be66-af59876b55b5.webp',
    'eaac3231-e13e-4a96-b2e9-5cc6630c116a.webp',
    '9f7ee9d4-ac7b-4f90-bfd5-1feb27e9c43b.webp',
    'a5645e30-0673-456b-81bf-e3763f3c81cd.webp',
    '7a8a5303-60b6-4c24-9534-4dac0fe9f923.webp',
]

# Let's create a contact sheet of all 10 thumbnails
thumb_w, thumb_h = 256, 143
cols = 2
rows = 5
sheet = Image.new('RGB', (thumb_w * cols, thumb_h * rows))

for idx, f in enumerate(files):
    p = os.path.join(folder, f)
    img = Image.open(p).resize((thumb_w, thumb_h))
    c = idx % cols
    r = idx // cols
    sheet.paste(img, (c * thumb_w, r * thumb_h))

sheet.save('C:/Users/PC/.gemini/antigravity/brain/1c158b7d-130f-4715-9b67-c44da80eba98/contact_sheet.jpg')
print('Contact sheet saved to brain/contact_sheet.jpg')
