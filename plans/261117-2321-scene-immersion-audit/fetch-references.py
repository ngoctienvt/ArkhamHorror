"""Fetch public card artwork from the game's configured CDN, with bounded paths."""
import concurrent.futures
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

from PIL import Image

folder = Path(__file__).resolve().parent / 'references'
folder.mkdir(exist_ok=True)

def fetch(code):
    if not re.fullmatch(r'(?:[0-9]{5}[a-z]{0,2}|:[a-z-]+:[0-9]{3}[a-z]{0,2})', code):
        raise ValueError('Invalid card artwork code')
    stem = code.replace(':', '_')
    target = folder / f'{stem}.png'
    if target.exists():
        return f'CACHED {stem}'
    if code.startswith(':'):
        _, campaign, number = code.split(':')
        path = f'homebrew/{campaign}/cards/{number}.avif'
    else:
        path = f'cards/{code}.avif'
    url = f'https://assets.arkhamhorror.app/img/arkham/{path}'
    try:
        with urllib.request.urlopen(url, timeout=20) as response:
            data = response.read(12_000_000)
        raw = folder / f'{stem}.avif'
        raw.write_bytes(data)
        with Image.open(raw) as picture:
            picture.convert('RGB').save(target)
        return f'OK {stem}'
    except (urllib.error.URLError, OSError) as error:
        return f'FAILED {stem}: {error}'

with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
    for outcome in pool.map(fetch, sys.argv[1:]):
        print(outcome)
