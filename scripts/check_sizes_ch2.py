import os
from PIL import Image

paths = [
    'frontend/public/img/scenes/brethren-of-ash/569fd087-3b6b-4a9b-9f5a-af15917fd950.webp',
    'frontend/public/img/scenes/brethren-of-ash/07cee8ce-1404-4342-9daa-3cf3923e644f.webp',
    'frontend/public/img/scenes/brethren-of-ash/badfb1df-ee5f-4594-8b44-ec7673676f8c.webp',
    'frontend/public/img/scenes/river-of-blood/26d6ed79-4f0f-4069-b008-8cb8cd91b803.webp',
    'frontend/public/img/scenes/river-of-blood/ab5ba768-924a-4adf-b2fe-b6637f7a8abe.webp',
    'frontend/public/img/scenes/river-of-blood/a5935cfb-4321-41ff-bc75-f24941b3ddb7.webp',
    'frontend/public/img/scenes/river-of-blood/abbe44df-81c8-4253-badd-37e4ef02e9bc.webp',
]

for p in paths:
    if os.path.exists(p):
        im = Image.open(p)
        print(os.path.basename(p), im.size)
