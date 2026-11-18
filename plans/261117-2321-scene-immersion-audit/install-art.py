"""Export approved GPT Image originals as project WebP; retain original sources."""
import json
import msvcrt
import sys
from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[2]
manifest = Path(__file__).with_name('generated-art.json')
source, relative = sys.argv[1:3]
destination = (root / 'frontend/public/img/scenes' / relative).resolve()
destination.relative_to((root / 'frontend/public/img/scenes').resolve())
destination.parent.mkdir(parents=True, exist_ok=True)
with Image.open(source) as original:
    if '--sprite' in sys.argv:
        converted = ImageOps.fit(original.convert('RGBA'), (768, 512), method=Image.Resampling.LANCZOS)
    else:
        converted = ImageOps.fit(original.convert('RGB'), (1920, 1080), method=Image.Resampling.LANCZOS)
    converted.save(destination, quality=88, method=6)
entry = {'source': source, 'output': relative, 'size': destination.stat().st_size}
with manifest.with_suffix('.lock').open('a+b') as lock:
    if lock.tell() == 0:
        lock.write(b'0')
        lock.flush()
    lock.seek(0)
    msvcrt.locking(lock.fileno(), msvcrt.LK_LOCK, 1)
    try:
        entries = json.loads(manifest.read_text(encoding='utf-8')) if manifest.exists() else []
        entries = [item for item in entries if item['output'] != relative] + [entry]
        manifest.write_text(json.dumps(entries, ensure_ascii=False, indent=2), encoding='utf-8')
    finally:
        lock.seek(0)
        msvcrt.locking(lock.fileno(), msvcrt.LK_UNLCK, 1)
print(relative, destination.stat().st_size)
