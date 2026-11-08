import os
import io
import json
import urllib.request
from PIL import Image, ImageDraw, ImageFont

CACHE_DIR = os.path.join(os.path.dirname(__file__), "cache", "cards")
OUTPUT_DIR = os.path.abspath("frontend/public/img/scenes/the-forgotten-age/references")
os.makedirs(CACHE_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

CDN_URL_TEMPLATE = "https://assets.arkhamhorror.app/img/arkham/cards/{code}.avif"

def get_font(size: int, bold: bool = False):
    windir = os.environ.get("WINDIR", "C:\\Windows")
    font_name = "segoeuib.ttf" if bold else "segoeui.ttf"
    font_path = os.path.join(windir, "Fonts", font_name)
    if os.path.exists(font_path):
        return ImageFont.truetype(font_path, size)
    alt = os.path.join(windir, "Fonts", "arialbd.ttf" if bold else "arial.ttf")
    if os.path.exists(alt):
        return ImageFont.truetype(alt, size)
    return ImageFont.load_default()

def fetch_card_image(code: str) -> Image.Image:
    clean_code = code.replace("c", "")
    local_path = os.path.join(CACHE_DIR, f"{clean_code}.avif")
    if os.path.exists(local_path):
        try:
            return Image.open(local_path).convert("RGBA")
        except Exception:
            pass

    url = CDN_URL_TEMPLATE.format(code=clean_code)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = resp.read()
            with open(local_path, "wb") as f:
                f.write(data)
            return Image.open(io.BytesIO(data)).convert("RGBA")
    except Exception as e:
        print(f"Warning: Failed to fetch card {clean_code} from {url}: {e}")
        im = Image.new("RGBA", (750, 1050), (25, 35, 45, 255))
        d = ImageDraw.Draw(im)
        font = get_font(36, bold=True)
        d.text((100, 450), f"Card {clean_code}", fill=(200, 220, 240, 255), font=font)
        return im

SCENARIOS = [
    {
        "id": "04043",
        "slug": "the-untamed-wilds",
        "title": "Scenario 1: The Untamed Wilds",
        "subtitle": "South American Rainforest Exploration & Eztli Ruins",
        "card_w": 180,
        "card_h": 252,
        "locations": [
            {"code": "04050", "name": "Expedition Camp", "pos": (50, 15), "cue": "Tents, campfire, crates and equipment at jungle edge"},
            {"code": "04069", "name": "Path of Thorns", "pos": (30, 32), "cue": "Dense briars and suffocating thorn bushes"},
            {"code": "04071", "name": "Rope Bridge", "pos": (50, 32), "cue": "Frayed suspension bridge crossing dizzying gorge"},
            {"code": "04072", "name": "Serpent's Haven", "pos": (70, 32), "cue": "Hissing pit of vipers coiled around roots"},
            {"code": "04070", "name": "River Canyon", "pos": (18, 55), "cue": "Rushing whitewater churning through jungle canyon"},
            {"code": "04073", "name": "Circuitous Trail", "pos": (38, 55), "cue": "Twisting muddy jungle footpath under dripping ferns"},
            {"code": "04075", "name": "Overgrown Ruins", "pos": (62, 55), "cue": "Ancient weathered stone carved steps engulfed in vines"},
            {"code": "04074", "name": "Temple of the Fang", "pos": (82, 55), "cue": "Carved stone serpent idol and ziggurat wall"},
            {"code": "04053", "name": "Ruins of Eztli", "pos": (50, 82), "cue": "Colossal stepped pyramid temple rising above canopy"},
        ]
    },
    {
        "id": "04054",
        "slug": "the-doom-of-eztli",
        "title": "Scenario 2: The Doom of Eztli",
        "subtitle": "Interior Architecture & Chambers of Ancient Pyramid",
        "card_w": 180,
        "card_h": 252,
        "locations": [
            {"code": "04060", "name": "Entryway", "pos": (18, 22), "cue": "Monolithic stone gate bathed in exterior jungle sunlight"},
            {"code": "04063", "name": "Ancient Hall", "pos": (45, 22), "cue": "Carved bas-reliefs of serpentine deities along corridor"},
            {"code": "04064", "name": "Grand Chamber", "pos": (78, 22), "cue": "Vaulted stone hall with colossal pillars and sacrificial brazier"},
            {"code": "04065", "name": "Burial Pit", "pos": (18, 62), "cue": "Dark crypt littered with skeletal remains and earthen urns"},
            {"code": "04066", "name": "Underground Ruins", "pos": (45, 62), "cue": "Subterranean collapsed stone galleries and stalactites"},
            {"code": "04067", "name": "Secret Passage", "pos": (78, 62), "cue": "Concealed narrow chute through cracked cyclopean masonry"},
            {"code": "04068", "name": "Chamber of Time", "pos": (50, 88), "cue": "Sanctum holding the Relic of Ages, shimmering golden temporal aura"},
        ]
    },
    {
        "id": "04113",
        "slug": "threads-of-fate",
        "title": "Scenario 3: Threads of Fate",
        "subtitle": "Arkham City Expanded Urban Investigation",
        "card_w": 160,
        "card_h": 224,
        "locations": [
            {"code": "04128b", "name": "Train Tracks", "pos": (30, 20), "cue": "Arkham railway depot and switching yard under gas lamps"},
            {"code": "04143", "name": "Town Hall", "pos": (55, 20), "cue": "Civic municipal building, dome, grand steps"},
            {"code": "04126b", "name": "Police Station", "pos": (80, 20), "cue": "Red-brick precinct house with blue globe lamps"},
            {"code": "04142", "name": "Curiositie Shoppe", "pos": (12, 50), "cue": "Dusty antique shop with exotic relics in window"},
            {"code": "01134", "name": "Northside", "pos": (30, 50), "cue": "Victorian rowhouses, elevated tracks"},
            {"code": "01130", "name": "Downtown", "pos": (50, 50), "cue": "First National Bank, wide avenue"},
            {"code": "01132", "name": "Easttown", "pos": (70, 50), "cue": "Industrial tenements, brick alleys"},
            {"code": "04141", "name": "Velma's Diner", "pos": (88, 50), "cue": "Warm neon-lit diner with counter and booths"},
            {"code": "04117b", "name": "Eztli Exhibit", "pos": (25, 82), "cue": "Museum gallery with glass cases displaying Mesoamerican idols"},
            {"code": "01129", "name": "Miskatonic Univ.", "pos": (48, 82), "cue": "Gothic collegiate hall, clock tower"},
            {"code": "01125", "name": "Rivertown", "pos": (72, 82), "cue": "Misty harbor docks, wooden piers, warehouses"},
            {"code": "04133b", "name": "Black Cave", "pos": (90, 82), "cue": "Sinister limestone cavern entrance on outskirts"},
        ]
    },
    {
        "id": "04161",
        "slug": "the-boundary-beyond",
        "title": "Scenario 4: The Boundary Beyond",
        "subtitle": "Mexico City Colliding with Aztec Tenochtitlan Through Time Rifts",
        "card_w": 170,
        "card_h": 238,
        "locations": [
            {"code": "04171", "name": "Zócalo / Templo Mayor", "pos": (20, 25), "cue": "Colonial plaza overlapping with colossal stepped Aztec pyramid"},
            {"code": "04169", "name": "Metropolitan Cathedral", "pos": (50, 25), "cue": "Baroque cathedral towers tearing into celestial rift"},
            {"code": "04173", "name": "Coyoacán / Sacred Woods", "pos": (80, 25), "cue": "Cobblestone plaza bleeding into primeval sacred Aztec grove"},
            {"code": "04170", "name": "Chapultepec Park", "pos": (25, 75), "cue": "Hilltop castle, cypress trees, floating temporal shards"},
            {"code": "04168", "name": "Temple Ruins", "pos": (50, 75), "cue": "Excavation site with ancient stone serpent carvings"},
            {"code": "04172", "name": "Xochimilco Canals", "pos": (78, 75), "cue": "Lush chinampa floating gardens and ancient reed-lined canals"},
        ]
    },
    {
        "id": "04205a",
        "slug": "heart-of-the-elders-part-1",
        "title": "Scenario 5a: Heart of the Elders (Part 1)",
        "subtitle": "The Cavern's Maw & Jungle Sinkhole Descent",
        "card_w": 180,
        "card_h": 252,
        "locations": [
            {"code": "04206", "name": "Mouth of K'n-yan", "pos": (50, 20), "cue": "Gargantuan dark sinkhole opening gaping into abyss"},
            {"code": "04217", "name": "Time-Wracked Woods", "pos": (25, 45), "cue": "Twisted ancient jungle trees glowing with temporal luminescence"},
            {"code": "04218", "name": "Stone Altar", "pos": (75, 45), "cue": "Bloodstained sacrificial obsidian slab encircled by runes"},
            {"code": "04071", "name": "Rope Bridge", "pos": (30, 78), "cue": "Suspension bridge over chasms surrounding the sinkhole"},
            {"code": "04075", "name": "Overgrown Ruins", "pos": (70, 78), "cue": "Carved monoliths collapsed into thick emerald foliage"},
        ]
    },
    {
        "id": "04205b",
        "slug": "heart-of-the-elders-part-2",
        "title": "Scenario 5b: Heart of the Elders (Part 2)",
        "subtitle": "Subterranean K'n-yan Caverns & Phosphorescent Depths",
        "card_w": 180,
        "card_h": 252,
        "locations": [
            {"code": "04206b", "name": "The Depths Below", "pos": (50, 18), "cue": "Entrance grotto looking up at distant surface skylight"},
            {"code": "04222", "name": "Vast Passages", "pos": (25, 42), "cue": "Colossal underground highway paved in ancient basalt blocks"},
            {"code": "04224", "name": "Dark Hollow", "pos": (75, 42), "cue": "Pitch-black abyss shrouded in cold subterranean mist"},
            {"code": "04223", "name": "Hall of Idolatry", "pos": (20, 75), "cue": "Carved serpent statues flanking an underground temple hall"},
            {"code": "04226", "name": "Crystal Pillars", "pos": (50, 75), "cue": "Giant glowing green-blue fluorite crystals illuminating cavern"},
            {"code": "04227", "name": "Descent to Yoth", "pos": (80, 75), "cue": "Steep precipice staircase plunging into red glowing depths"},
        ]
    },
    {
        "id": "04237",
        "slug": "the-city-of-archives",
        "title": "Scenario 6: The City of Archives",
        "subtitle": "Pnakotus Alien Metropolis & Great Library of the Yithians",
        "card_w": 180,
        "card_h": 252,
        "locations": [
            {"code": "04252", "name": "Yithian Orrery", "pos": (28, 20), "cue": "Enormous brass and crystal planetary mechanism tracking alien stars"},
            {"code": "04253", "name": "Lab of Great Race", "pos": (52, 20), "cue": "Bizarre scientific vats, crystalline tubes, and biomechanical arrays"},
            {"code": "04254", "name": "Deconstruction Room", "pos": (78, 20), "cue": "Surgical dissection chamber with metal tables and strange beam emitters"},
            {"code": "04255", "name": "Towers of Pnakotus", "pos": (15, 55), "cue": "Cyclopean windowless stone towers without stairs, smooth ramps"},
            {"code": "04248", "name": "Halls of Pnakotus", "pos": (50, 55), "cue": "Vast hexagonal corridors constructed for colossal cone-shaped beings"},
            {"code": "04245", "name": "Interview Room", "pos": (85, 55), "cue": "Chamber with sensory apparatus for interrogating temporal minds"},
            {"code": "04251", "name": "Great Library", "pos": (35, 85), "cue": "Limitless tiers of metal cylinders and ancient alien scrolls"},
        ]
    },
    {
        "id": "04277",
        "slug": "the-depths-of-yoth",
        "title": "Scenario 7: The Depths of Yoth",
        "subtitle": "Red-Lit Abyssal Cavern of the Serpent People",
        "card_w": 180,
        "card_h": 252,
        "locations": [
            {"code": "04286", "name": "Steps of Yoth", "pos": (50, 18), "cue": "Endless spiral staircase cut into black obsidian cliff face"},
            {"code": "04287", "name": "City of Serpents", "pos": (25, 45), "cue": "Basalt temples carved like coiled snakes, bathed in red volcanic light"},
            {"code": "04295", "name": "Bright Canyon", "pos": (75, 45), "cue": "Chasm radiating violent fiery red glow from subterranean lava lakes"},
            {"code": "04289", "name": "Crumbling Precipice", "pos": (20, 78), "cue": "Collapsing rock ledge overhang above a bottomless crimson void"},
            {"code": "04292", "name": "Bridge over N'kai", "pos": (50, 78), "cue": "Narrow ancient stone arch over black subterranean pitch-lake"},
            {"code": "04288", "name": "Hall of Heresy", "pos": (80, 78), "cue": "Sunken blasphemous shrine with obsidian serpent altar"},
        ]
    },
    {
        "id": "04314",
        "slug": "shattered-aeons",
        "title": "Scenario 8: Shattered Aeons",
        "subtitle": "Cosmic Nexus of N'kai & Colliding Historical Eras",
        "card_w": 170,
        "card_h": 238,
        "locations": [
            {"code": "04328", "name": "Shores of R'lyeh", "pos": (15, 20), "cue": "Non-Euclidean cyclopean black stone rising from raging alien sea"},
            {"code": "04333", "name": "Atlantis", "pos": (45, 20), "cue": "Gilded spires of submerged golden civilization encased in aqua light"},
            {"code": "04331", "name": "Ruins of New York", "pos": (82, 20), "cue": "Crumbling futuristic skyscrapers choked by ash and temporal storms"},
            {"code": "04324", "name": "Nexus of N'kai", "pos": (40, 52), "cue": "Swirling vortex of spacetime tear, temporal ribbons intertwining"},
            {"code": "04330", "name": "A Pocket in Time", "pos": (70, 52), "cue": "Isolated bubble of calm twilight amid collapsing cosmic reality"},
            {"code": "04335", "name": "Valusia", "pos": (90, 52), "cue": "Prehistoric serpent empire capital of dark stone castles"},
            {"code": "04327", "name": "Yuggoth", "pos": (18, 82), "cue": "Black pitch rivers under twin moons of the frozen outer planet"},
            {"code": "04332", "name": "Mu", "pos": (48, 82), "cue": "Tropical sunken continent with colossal basalt carvings and palms"},
            {"code": "04336", "name": "Plateau of Leng", "pos": (80, 82), "cue": "Bleak windswept frozen plateau with monastery of masked priests"},
        ]
    },
    {
        "id": "04344",
        "slug": "turn-back-time",
        "title": "Scenario 9: Turn Back Time",
        "subtitle": "Eztli Temple Crumbling Under Temporal Paradox",
        "card_w": 180,
        "card_h": 252,
        "locations": [
            {"code": "04060", "name": "Entryway", "pos": (18, 22), "cue": "Temple entrance warping as golden time-rifts fracture the stone"},
            {"code": "04063", "name": "Ancient Hall", "pos": (45, 22), "cue": "Corridors phasing between pristine ancient era and decayed ruins"},
            {"code": "04064", "name": "Grand Chamber", "pos": (78, 22), "cue": "Colossal columns cracking under gravitational temporal shifts"},
            {"code": "04065", "name": "Burial Pit", "pos": (18, 62), "cue": "Crypt bathed in eerie amber hourglass sands and shadows"},
            {"code": "04066", "name": "Underground Ruins", "pos": (45, 62), "cue": "Crumbling masonry dissolving into temporal vortex sparks"},
            {"code": "04067", "name": "Secret Passage", "pos": (78, 62), "cue": "Flickering temporal doorway between past and future"},
            {"code": "04068", "name": "Chamber of Time", "pos": (50, 88), "cue": "The shattered core of the temporal relic pulsating violently"},
        ]
    }
]

def generate_collage(sc):
    W, H = 1920, 1080
    canvas = Image.new("RGBA", (W, H), (14, 18, 22, 255))
    draw = ImageDraw.Draw(canvas)
    
    # Background subtle gradient / grid
    for y in range(0, H, 40):
        draw.line([(0, y), (W, y)], fill=(20, 26, 32, 255), width=1)
    for x in range(0, W, 40):
        draw.line([(x, 0), (x, H)], fill=(20, 26, 32, 255), width=1)
        
    title_font = get_font(32, bold=True)
    sub_font = get_font(18, bold=False)
    draw.text((40, 25), sc["title"].upper(), fill=(240, 210, 120, 255), font=title_font)
    draw.text((40, 65), sc["subtitle"], fill=(160, 180, 200, 255), font=sub_font)
    
    card_w = sc.get("card_w", 180)
    card_h = sc.get("card_h", 252)
    
    loc_font = get_font(14, bold=True)
    cue_font = get_font(11, bold=False)
    
    for loc in sc["locations"]:
        px = int(W * loc["pos"][0] / 100)
        py = int(H * loc["pos"][1] / 100)
        
        card_img = fetch_card_image(loc["code"])
        card_resized = card_img.resize((card_w, card_h), Image.Resampling.LANCZOS)
        
        box_x = px - card_w // 2
        box_y = py - card_h // 2
        
        # Shadow
        draw.rectangle([box_x - 3, box_y - 3, box_x + card_w + 3, box_y + card_h + 3], fill=(0, 0, 0, 180))
        canvas.paste(card_resized, (box_x, box_y), card_resized if card_resized.mode == "RGBA" else None)
        
        # Border
        draw.rectangle([box_x, box_y, box_x + card_w, box_y + card_h], outline=(200, 180, 120, 255), width=2)
        
        # Label banner
        label = f"{loc['name']} ({loc['pos'][0]}%, {loc['pos'][1]}%)"
        draw.rectangle([box_x, box_y + card_h, box_x + card_w, box_y + card_h + 24], fill=(20, 25, 30, 240))
        draw.text((box_x + 5, box_y + card_h + 4), label, fill=(255, 255, 255, 255), font=loc_font)

    out_path = os.path.join(OUTPUT_DIR, f"{sc['slug']}-layout-ref.png")
    canvas.save(out_path, "PNG")
    print(f"Generated layout collage: {out_path}")

def main():
    print(f"Generating 10 reference collages for The Forgotten Age...")
    for sc in SCENARIOS:
        generate_collage(sc)
    print("Done generating all collages!")

if __name__ == "__main__":
    main()
