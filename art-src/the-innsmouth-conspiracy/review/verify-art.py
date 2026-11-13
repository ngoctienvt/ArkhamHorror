from pathlib import Path
import sys
from PIL import Image, ImageDraw, ImageOps
import numpy as np

ART = Path("art-src/the-innsmouth-conspiracy")
SCENES = Path("frontend/public/img/scenes")
GAME = SCENES / ART.name
REVIEW = ART / "review"
LANCZOS = Image.Resampling.LANCZOS
BACKS = {"yhanthlei-back", "sanctum-back"}
BG = {
    "pit": "pit-of-despair-caverns",
    "maelstrom": "into-the-maelstrom-abyss",
    "fog": "a-light-in-the-fog-cliffs",
    "high-gear": "horror-in-high-gear-moor",
}
MAPPING = [
    line.split("|", 3)[:3]
    for line in (REVIEW / "reference-mapping.txt").read_text(encoding="utf-8").splitlines()
]
REUSE = {
    "pit": ("07102", "07103", "07104", "tunnel-back", "water-partial", "water-full"),
    "maelstrom": ("07102", "07103", "07104", "tunnel-back", "water-partial", "water-full"),
    "fog": ("07102", "07103", "tunnel-back", "water-partial", "water-full"),
}


def target(group, slug):
    if group == "actors":
        return REVIEW / f"candidate-{slug}.webp"
    return GAME / group / f"{slug}.webp"


def source(slug):
    candidates = (ART / "gen").glob(f"{slug}-v*/generated.png")
    return max(candidates, key=lambda path: int(path.parent.name.rsplit("-v", 1)[-1]), default=None)


def fit_location(image):
    size = image.size
    alpha = image.getchannel("A")
    solid = alpha.point(lambda value: 255 if value >= 48 else 0).getbbox()
    if not solid:
        return image
    width = solid[2] - solid[0]
    height = solid[3] - solid[1]
    occupancy = max(width / size[0], height / size[1])
    if occupancy <= 0.85:
        return image
    factor = 0.84 / occupancy
    reduced = image.resize(tuple(round(value * factor) for value in size), LANCZOS)
    output = Image.new("RGBA", size)
    output.paste(reduced, tuple((outer - inner) // 2 for outer, inner in zip(size, reduced.size)))
    return output


ROAD_TOP, ROAD_BOTTOM = 211, 301
ROAD_BLEND = 104


def road_bounds(pixels, x):
    opaque = np.flatnonzero(pixels[:, x, 3] >= 180)
    runs = np.split(opaque, np.flatnonzero(np.diff(opaque) > 1) + 1)
    best = max(runs, key=len)
    if len(best) < 18:
        raise ValueError(f"no continuous road surface at x={x}")
    return best[0], best[-1] + 1


def align_road(image):
    pixels = np.asarray(image.convert("RGBa"), dtype=float)
    height, width = pixels.shape[:2]
    rows = np.arange(height)
    aligned = pixels.copy()
    for edge, direction in ((0, 1), (width - 1, -1)):
        top, bottom = road_bounds(pixels, edge)
        for distance in range(ROAD_BLEND):
            x = edge + direction * distance
            weight = (1 + np.cos(np.pi * distance / ROAD_BLEND)) / 2
            edge_rows = np.interp(rows, [0, ROAD_TOP, ROAD_BOTTOM, height - 1],
                                  [0, top, bottom, height - 1])
            sample = rows + (edge_rows - rows) * weight
            for channel in range(4):
                aligned[:, x, channel] = np.interp(sample, rows, pixels[:, x, channel])
    return aligned


def match_road_edges(image, reference):
    aligned = align_road(image)
    standard = align_road(reference)
    # Blend the ends into a shared cross-section sampled from Falcon Point Approach.
    # Work in premultiplied alpha so the original shoulder fades stay clean.
    width = image.width
    blend = 48
    for distance in range(blend):
        weight = (1 + np.cos(np.pi * distance / blend)) / 2
        for x in (distance, width - 1 - distance):
            seam = standard[:, distance]
            aligned[:, x] = aligned[:, x] * (1 - weight) + seam * weight
    return Image.frombytes("RGBa", image.size, np.rint(aligned).clip(0, 255).astype(np.uint8).tobytes()).convert("RGBA")


def export():
    report = []
    for slug in BG.values():
        file = source(slug)
        if file:
            with Image.open(file) as raw:
                output = ImageOps.fit(raw.convert("RGB"), (3840, 2160), LANCZOS)
                path = GAME / f"{slug}.webp"
                if not path.exists() or path.stat().st_mtime < file.stat().st_mtime or "force" in sys.argv:
                    output.save(path, quality=88, method=6)
                report.append(f"{slug} {raw.size} -> {output.size} RGB")
    for group, slug, _ in MAPPING:
        file = source(slug)
        if not file:
            continue
        with Image.open(file) as raw:
            sprite = raw.convert("RGBA")
        alpha = sprite.getchannel("A")
        lo, hi = alpha.getextrema()
        bounds = alpha.point(lambda value: 255 if value > 20 else 0).getbbox()
        if lo != 0 or hi < 240 or not bounds:
            report.append(f"ERROR {slug} unusable alpha ({lo}, {hi})")
            continue
        if hi < 255:
            sprite.putalpha(alpha.point(lambda value: round(value * 255 / hi)))
        if group == "actors":
            size = (640, round(640 * sprite.height / sprite.width))
            output = sprite.resize(size, LANCZOS)
        else:
            size = (512, 512) if slug in BACKS else (768, 512)
            if group == "high-gear" and slug not in ("07211", "07212"):
                with Image.open(source("07203")) as road_reference:
                    standard = road_reference.convert("RGBA").resize(size, LANCZOS)
                try:
                    output = match_road_edges(sprite.resize(size, LANCZOS), standard)
                except ValueError as error:
                    report.append(f"ERROR {slug} {error}")
                    continue
            else:
                output = ImageOps.pad(sprite, size, LANCZOS, color=(0, 0, 0, 0))
                if group != "high-gear" and slug not in BACKS:
                    output = fit_location(output)
        path = target(group, slug)
        path.parent.mkdir(parents=True, exist_ok=True)
        if not path.exists() or path.stat().st_mtime < file.stat().st_mtime or "force" in sys.argv:
            output.save(path, quality=85, alpha_quality=100, method=6)
        with Image.open(path) as check:
            assert check.size == size and check.mode == "RGBA"
            assert check.getchannel("A").getextrema() == (0, 255)
        final_bounds = output.getchannel("A").point(lambda value: 255 if value >= 48 else 0).getbbox()
        coverage = max((final_bounds[2] - final_bounds[0]) / size[0], (final_bounds[3] - final_bounds[1]) / size[1])
        report.append(f"{slug} {sprite.size} -> {size} RGBA, foreground occupancy {coverage:.0%}, source alpha max {hi}")
    (REVIEW / "export-checks.txt").write_text("\n".join(report) + "\n", encoding="utf-8")


def paste(canvas, file, rect, silhouette=False):
    x, y, w, h = rect
    with Image.open(file) as opened:
        sprite = ImageOps.contain(opened.convert("RGBA"), (w, h), LANCZOS)
    if silhouette:
        mask = sprite.getchannel("A").point(lambda value: 255 if value >= 128 else 0)
        sprite = Image.new("RGBA", sprite.size, (0, 0, 0, 255))
        sprite.putalpha(mask)
    canvas.paste(sprite, (x + (w - sprite.width) // 2, y + (h - sprite.height) // 2), sprite)


def sheets():
    for group, slug in BG.items():
        bg = GAME / f"{slug}.webp"
        if not bg.exists():
            continue
        comparable = [
            (name, target(item_group, name), ref)
            for item_group, name, ref in MAPPING
            if (item_group == group or (group == "high-gear" and item_group == "actors"))
            and target(item_group, name).exists()
        ]
        if not comparable:
            continue
        items = comparable + [
            (name, GAME / "devil-reef" / f"{name}.webp", None)
            for name in REUSE.get(group, ())
        ]
        size = (740, ((len(items) + 3) // 4) * 134)
        with Image.open(bg) as image:
            contact = ImageOps.fit(image.convert("RGB"), size, LANCZOS)
        silhouettes = Image.new("RGB", size, "#aaaaaa")
        for i, (_, file, _) in enumerate(items):
            rect = (i % 4 * 185 + 17, i // 4 * 134 + 6, 150, 122)
            paste(contact, file, rect)
            paste(silhouettes, file, rect, silhouette=True)
        contact.save(REVIEW / f"{group}-contact.png")
        silhouettes.save(REVIEW / f"{group}-silhouettes.png")

        compare = Image.new("RGB", (855, ((len(comparable) + 2) // 3) * 171), "#151c21")
        draw = ImageDraw.Draw(compare)
        for i, (name, file, ref) in enumerate(comparable):
            x, y = i % 3 * 285, i // 3 * 171
            paste(compare, file, (x + 5, y + 4, 154, 138))
            paste(compare, ART / "refs" / f"{ref}.png", (x + 165, y + 4, 110, 138))
            draw.text((x + 10, y + 145), name, fill="white")
        compare.save(REVIEW / f"{group}-compare.png")

    roads = [target("high-gear", slug) for slug in ("07203", "07208", "07207", "road-back")]
    if all(file.exists() for file in roads):
        with Image.open(GAME / f"{BG['high-gear']}.webp") as image:
            chain = ImageOps.fit(image.convert("RGB"), (1536, 256), LANCZOS)
        for i, file in enumerate(roads):
            paste(chain, file, (i * 384, 0, 384, 256))
        chain.save(REVIEW / "high-gear-chain.png")


if "sheets" not in sys.argv:
    export()
sheets()
