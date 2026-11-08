import os
import io
import json
import urllib.request
from PIL import Image, ImageDraw, ImageFont, ImageFilter

CACHE_DIR = os.path.join(os.path.dirname(__file__), "cache", "cards")
OUTPUT_DIR = os.path.abspath("frontend/public/img/scenes/the-drowned-city/references")
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
    """Fetch card AVIF image from cache or CDN."""
    local_path = os.path.join(CACHE_DIR, f"{code}.avif")
    if os.path.exists(local_path):
        try:
            return Image.open(local_path).convert("RGBA")
        except Exception:
            pass

    url = CDN_URL_TEMPLATE.format(code=code)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = resp.read()
            with open(local_path, "wb") as f:
                f.write(data)
            return Image.open(io.BytesIO(data)).convert("RGBA")
    except Exception as e:
        print(f"Warning: Failed to fetch card {code} from {url}: {e}")
        im = Image.new("RGBA", (750, 1050), (25, 35, 45, 255))
        d = ImageDraw.Draw(im)
        font = get_font(36, bold=True)
        d.text((100, 450), f"Card {code}", fill=(200, 220, 240, 255), font=font)
        return im

# Definition of the 10 scenarios
SCENARIOS = [
    {
        "id": "11501",
        "slug": "one-last-job",
        "title": "Scenario 1: One Last Job",
        "subtitle": "Arkham City Noir Streets & Gang Hideouts",
        "card_w": 180,
        "card_h": 252,
        "locations": [
            {"code": "01134", "name": "Northside", "pos": (20, 25), "cue": "Victorian brick townhouses & train tracks under dim gas lamps"},
            {"code": "01130", "name": "Downtown", "pos": (50, 25), "cue": "First National Bank of Arkham, towering neoclassical columns"},
            {"code": "01132", "name": "Easttown", "pos": (80, 25), "cue": "Gritty police precinct, tenements, narrow cobbled alleyways"},
            {"code": "01125", "name": "Rivertown", "pos": (20, 60), "cue": "Miskatonic river wharves, misty docks, wooden piers & warehouses"},
            {"code": "01129", "name": "Miskatonic Univ.", "pos": (50, 60), "cue": "Gothic university campus, library tower with stained glass"},
            {"code": "11509", "name": "Tillinghast Esoterica", "pos": (80, 60), "cue": "Antique shop with curiosity artifacts in glowing display window"},
            {"code": "11504b", "name": "Hibb's Roadhouse", "pos": (30, 88), "cue": "Seedy tavern and mob roadhouse on the edge of town"},
            {"code": "11505b", "name": "La Bella Luna", "pos": (70, 88), "cue": "Upscale Italian speakeasy restaurant with mafia guards"}
        ],
        "connections": [
            ((20, 25), (50, 25)), ((50, 25), (80, 25)),
            ((20, 25), (20, 60)), ((50, 25), (50, 60)), ((80, 25), (80, 60)),
            ((20, 60), (50, 60)), ((50, 60), (80, 60)),
            ((20, 60), (30, 88)), ((80, 60), (70, 88))
        ]
    },
    {
        "id": "11517",
        "slug": "the-western-wall",
        "title": "Scenario 2: The Western Wall",
        "subtitle": "Abyssal Cliff Descent Along Cyclopean Monolithic Wall",
        "card_w": 160,
        "card_h": 224,
        "locations": [
            {"code": "11530", "name": "Western Wall", "pos": (50, 16), "cue": "Colossal cyclopean basalt wall towering into the ocean abyss"},
            {"code": "11521", "name": "Slick Steps", "pos": (50, 34), "cue": "Wet slippery stairs carved directly out of obsidian sea-cliff"},
            {"code": "11522", "name": "Eroded Shelf", "pos": (35, 52), "cue": "Narrow wave-battered ledge overlooking a sheer vertical drop"},
            {"code": "11523", "name": "Precarious Climb", "pos": (65, 52), "cue": "Vertical climbing face on dark basalt, barnacles and sea-slime"},
            {"code": "11524", "name": "Deadly Pass", "pos": (20, 70), "cue": "Razor-sharp chasm between towering sea-carved needles"},
            {"code": "11526", "name": "Sunken Stairway", "pos": (50, 70), "cue": "Submerged grand staircase plunging into bioluminescent deep"},
            {"code": "11525", "name": "Shallow Den", "pos": (80, 70), "cue": "Damp cavern hollowed into the rock face with sea-beast nests"},
            {"code": "11527", "name": "Drowned Shanty", "pos": (20, 88), "cue": "Waterlogged wooden wreck lodged into deep underwater boulders"},
            {"code": "11529", "name": "Obsidian Foundations", "pos": (50, 88), "cue": "Titanic stone foundation blocks at the seabed level"},
            {"code": "11528", "name": "Shattered Ruins", "pos": (80, 88), "cue": "Cracked prehistoric underwater colonnades covered in anemones"}
        ],
        "connections": [
            ((50, 16), (50, 34)),
            ((50, 34), (35, 52)), ((50, 34), (65, 52)),
            ((35, 52), (20, 70)), ((35, 52), (50, 70)), ((65, 52), (50, 70)), ((65, 52), (80, 70)),
            ((20, 70), (20, 88)), ((50, 70), (50, 88)), ((80, 70), (80, 88))
        ]
    },
    {
        "id": "11536",
        "slug": "the-drowned-quarter",
        "title": "Scenario 3: The Drowned Quarter",
        "subtitle": "Sunken Alien City District Centered on the Barrier Core",
        "card_w": 180,
        "card_h": 252,
        "locations": [
            {"code": "11541", "name": "Abyssal Trench", "pos": (20, 24), "cue": "Pitch-black chasm slicing through the ocean bedrock"},
            {"code": "11542", "name": "Drowned Acropolis", "pos": (50, 24), "cue": "Submerged citadel with monolithic pillars and vaulted pediments"},
            {"code": "11546", "name": "Coral Reef", "pos": (80, 24), "cue": "Bioluminescent coral garden encrusting alien stone statues"},
            {"code": "11544", "name": "Sunken Circle", "pos": (20, 52), "cue": "Circular arrangement of drowned megaliths glowing faintly"},
            {"code": "11540", "name": "Barrier Core", "pos": (50, 52), "cue": "Titanic glowing spherical alien power matrix suspended in ruins"},
            {"code": "11545", "name": "Crumbling Edifices", "pos": (80, 52), "cue": "Massive collapsed non-Euclidean temples tilting into sand"},
            {"code": "11548", "name": "Ancient Gallery", "pos": (20, 80), "cue": "Subaquatic colonnade adorned with deep-sea bas-reliefs"},
            {"code": "11547", "name": "Feeding Grounds", "pos": (50, 80), "cue": "Murky seabed clearing swarming with benthic predators"},
            {"code": "11543", "name": "Collapsed Ruins", "pos": (80, 80), "cue": "Heap of cyclopean blocks sunken deep into sea silt"}
        ],
        "connections": [
            ((20, 24), (50, 24)), ((50, 24), (80, 24)),
            ((20, 24), (20, 52)), ((50, 24), (50, 52)), ((80, 24), (80, 52)),
            ((20, 52), (50, 52)), ((50, 52), (80, 52)),
            ((20, 52), (20, 80)), ((50, 52), (50, 80)), ((80, 52), (80, 80)),
            ((20, 80), (50, 80)), ((50, 80), (80, 80))
        ]
    },
    {
        "id": "11553",
        "slug": "the-apiary",
        "title": "Scenario 4: The Apiary",
        "subtitle": "Subterranean Organic Alien Hive & Living Warrens",
        "card_w": 160,
        "card_h": 224,
        "locations": [
            {"code": "11579", "name": "Hidden Vault", "pos": (50, 15), "cue": "Sealed chitinous chamber pulsing with occult resonance"},
            {"code": "11562", "name": "Growing Fields", "pos": (50, 32), "cue": "Humongous chamber filled with hanging larval sacs & fungi"},
            {"code": "11559", "name": "Apiary Entrance", "pos": (50, 50), "cue": "Mouth of the living hive tunnel, rib-like organic arches"},
            {"code": "11561", "name": "Fleshy Paths (W)", "pos": (22, 50), "cue": "Winding tunnel lined with moist membrane walls and sinews"},
            {"code": "11560", "name": "Fleshy Paths (E)", "pos": (78, 50), "cue": "Glistening biomechanical corridor covered in alien resin"},
            {"code": "11565", "name": "Luminous Tunnels", "pos": (50, 68), "cue": "Corridors illuminated by phosphorescent spores & worms"},
            {"code": "11564", "name": "Corrupted Vault", "pos": (18, 86), "cue": "Mutated fleshy cavern with twisted biomechanical growths"},
            {"code": "11572", "name": "Central Chamber", "pos": (50, 86), "cue": "Pulsing organic nexus chamber with rotating glandular apertures"},
            {"code": "11566", "name": "Spawning Grounds", "pos": (70, 86), "cue": "Incubation pits with translucent egg clusters and amniotic fluid"},
            {"code": "11563", "name": "Churning Chasm", "pos": (88, 86), "cue": "Flesh-lined precipice plunging into churning digestive acids"}
        ],
        "connections": [
            ((50, 15), (50, 32)), ((50, 32), (50, 50)),
            ((50, 50), (22, 50)), ((50, 50), (78, 50)),
            ((50, 50), (50, 68)),
            ((50, 68), (18, 86)), ((50, 68), (50, 86)), ((50, 68), (70, 86)),
            ((70, 86), (88, 86))
        ]
    },
    {
        "id": "11587",
        "slug": "the-grand-vault",
        "title": "Scenario 5: The Grand Vault",
        "subtitle": "Colossal Subterranean Machine Hall & Moving Rail Platform",
        "card_w": 165,
        "card_h": 231,
        "locations": [
            {"code": "11600", "name": "Obsidian Bulwark", "pos": (32, 22), "cue": "Impenetrable black stone barrier with hydraulic pressure valves"},
            {"code": "11601", "name": "Sluice Control", "pos": (50, 22), "cue": "Massive bronze sluice gates channeling torrents of seawater"},
            {"code": "11602", "name": "Grime-Covered Gears", "pos": (68, 22), "cue": "Enormous interlocking iron cogwheels crusted in centuries of brine"},
            {"code": "11593", "name": "The Great Stair", "pos": (14, 52), "cue": "Monumental stone staircase descending into the abyss vault"},
            {"code": "11594", "name": "Moving Platform", "pos": (32, 52), "cue": "Mechanized iron observation gantry gliding along heavy rails"},
            {"code": "11595", "name": "Core of the Vault", "pos": (50, 52), "cue": "Heart of the machine, giant pulsating dynamo with electrical arcs"},
            {"code": "11598", "name": "Chamber of Records", "pos": (68, 52), "cue": "Metal cylinder archives containing hieroglyphic alien scrolls"},
            {"code": "11604", "name": "Chamber of Tablet", "pos": (86, 52), "cue": "Sealed inner sanctum with runic monolith and golden tablet"},
            {"code": "11596", "name": "Shrouded Cistern", "pos": (32, 82), "cue": "Dark vaulted reservoir of stagnant subterranean water"},
            {"code": "11603", "name": "Inscrutable App.", "pos": (50, 82), "cue": "Complex celestial clockwork mechanism of unknown purpose"},
            {"code": "11596", "name": "Submerged Basin", "pos": (68, 82), "cue": "Flooded drainage channel beneath the lower gearworks"}
        ],
        "connections": [
            ((14, 52), (32, 52)), ((32, 52), (50, 52)), ((50, 52), (68, 52)), ((68, 52), (86, 52)),
            ((32, 22), (32, 52)), ((50, 22), (50, 52)), ((68, 22), (68, 52)),
            ((32, 52), (32, 82)), ((50, 52), (50, 82)), ((68, 52), (68, 82))
        ]
    },
    {
        "id": "11612",
        "slug": "court-of-the-ancients",
        "title": "Scenario 6: Court of the Ancients",
        "subtitle": "4-Story Cyclopean Library Tower & Great Central Lift",
        "card_w": 165,
        "card_h": 231,
        "locations": [
            {"code": "11621", "name": "Twisting Catwalks", "pos": (22, 20), "cue": "Dizzying narrow metal catwalks spanning the top level"},
            {"code": "11622b", "name": "Great Lift (Top)", "pos": (45, 20), "cue": "Cage elevator platform docked at the highest terrace"},
            {"code": "11624", "name": "Archive of Stars", "pos": (70, 20), "cue": "Circular ring library containing astrolabes & star charts"},
            {"code": "11626", "name": "Walkway of Dreams", "pos": (22, 42), "cue": "Arched stone bridge adorned with sculptures of slumbering gods"},
            {"code": "11627", "name": "Walkway of Conflict", "pos": (70, 42), "cue": "High terrace overlooking murals of ancient primordial wars"},
            {"code": "11629", "name": "Archive of Memory", "pos": (22, 64), "cue": "Tower chamber filled with crystal memory prisms"},
            {"code": "11628", "name": "Archive of History", "pos": (70, 64), "cue": "Endless shelves of stone tablets etched in R'lyeh script"},
            {"code": "11619", "name": "West Antechamber", "pos": (18, 86), "cue": "Vast pillared entry hall on the western foundation"},
            {"code": "11622", "name": "Great Lift (Base)", "pos": (40, 86), "cue": "Lower elevator winch station with counterweights and chains"},
            {"code": "11620", "name": "East Antechamber", "pos": (62, 86), "cue": "Eastern entrance vestibule flanked by guardian statues"},
            {"code": "11623", "name": "Ancient Altar", "pos": (84, 86), "cue": "Sacrificial altar of black basalt stained with cosmic ichor"}
        ],
        "connections": [
            ((45, 20), (40, 86)), # Lift shaft
            ((22, 20), (45, 20)), ((45, 20), (70, 20)),
            ((22, 42), (42, 42)), ((42, 42), (70, 42)),
            ((22, 64), (42, 64)), ((42, 64), (70, 64)),
            ((18, 86), (40, 86)), ((40, 86), (62, 86)), ((62, 86), (84, 86))
        ]
    },
    {
        "id": "11639",
        "slug": "obsidian-canyons",
        "title": "Scenario 7: Obsidian Canyons",
        "subtitle": "Floating Islands of R'lyeh & Sky Chasms",
        "card_w": 165,
        "card_h": 231,
        "locations": [
            {"code": "11650", "name": "Floating Spire", "pos": (18, 24), "cue": "Slender obsidian obelisk levitating upside down in the mist"},
            {"code": "11659", "name": "Dazzling Skyline", "pos": (40, 24), "cue": "Unearthly alien aurora illuminating floating stone citadels"},
            {"code": "11660", "name": "Aerial Waterfall", "pos": (62, 24), "cue": "Torrents of ocean water pouring endlessly into the empty sky"},
            {"code": "11652", "name": "Ancient Dome", "pos": (84, 24), "cue": "Hemispherical obsidian observatory atop a levitating cliff"},
            {"code": "11658", "name": "Ancient Canyons", "pos": (28, 52), "cue": "Deep gorges of black volcanic glass floating above void"},
            {"code": "11649", "name": "Central Spire", "pos": (50, 52), "cue": "Monolithic spire anchoring gravitational distortion lines"},
            {"code": "11661", "name": "Magnetic Spires", "pos": (72, 52), "cue": "Needles of magnetite crackling with purple static discharge"},
            {"code": "11648", "name": "R'lyeh Streets", "pos": (18, 80), "cue": "Shattered paved plazas with non-Euclidean angles"},
            {"code": "11655", "name": "Obsidian Cliffs", "pos": (40, 80), "cue": "Sheer glass cliffs reflecting the strange starry abyss"},
            {"code": "11656", "name": "Suspended Reef", "pos": (62, 80), "cue": "Floating coral formation kept alive by cosmic moisture"},
            {"code": "11662", "name": "Glyph Orrery", "pos": (84, 80), "cue": "Rotating rings of alien glyphs floating in zero gravity"}
        ],
        "connections": [
            ((18, 80), (40, 80)), ((40, 80), (28, 52)), ((28, 52), (50, 52)),
            ((50, 52), (72, 52)), ((72, 52), (84, 80)),
            ((28, 52), (18, 24)), ((50, 52), (40, 24)), ((72, 52), (62, 24)), ((72, 52), (84, 24))
        ]
    },
    {
        "id": "11673",
        "slug": "sepulchre-of-the-sleeper",
        "title": "Scenario 8: Sepulchre of the Sleeper",
        "subtitle": "The Cyclopean Basalt Tomb of Great Cthulhu",
        "card_w": 180,
        "card_h": 252,
        "locations": [
            {"code": "11677", "name": "Alcove: Ambition", "pos": (50, 18), "cue": "High vaulted niche with glowing runes of conquering willpower"},
            {"code": "11681", "name": "Alcove: Voyage", "pos": (20, 38), "cue": "Carved relief showing cosmic migration across the stars"},
            {"code": "11678", "name": "Alcove: Resilience", "pos": (80, 38), "cue": "Basalt niche depicting eons of slumber beneath the seas"},
            {"code": "11676", "name": "Dreamer's Rest", "pos": (50, 52), "cue": "Titanic cyclopean sarcophagus surrounded by slimy green mist & tentacles"},
            {"code": "11680", "name": "Alcove: Defiance", "pos": (28, 84), "cue": "Shrine etched with sigils resisting the doom of the sleeper"},
            {"code": "11679", "name": "Alcove: Infinity", "pos": (72, 84), "cue": "Occult sanctuary inscribed with geometric equations of eternity"}
        ],
        "connections": [
            ((50, 52), (50, 18)), ((50, 52), (20, 38)), ((50, 52), (80, 38)),
            ((50, 52), (28, 84)), ((50, 52), (72, 84)),
            ((20, 38), (50, 18)), ((50, 18), (80, 38)),
            ((80, 38), (72, 84)), ((72, 84), (28, 84)), ((28, 84), (20, 38))
        ]
    },
    {
        "id": "11682",
        "slug": "the-doom-of-arkham-part-1",
        "title": "Scenario 9: The Doom of Arkham Part I",
        "subtitle": "Gathering Storm & Tidal Waters Breaching the City Quays",
        "card_w": 180,
        "card_h": 252,
        "locations": [
            {"code": "01134", "name": "Northside", "pos": (20, 24), "cue": "Darkened townhouses under storm clouds, lightning flashes"},
            {"code": "01130", "name": "Downtown", "pos": (50, 24), "cue": "First National Bank with cultists massing in the plaza"},
            {"code": "01132", "name": "Easttown", "pos": (80, 24), "cue": "Police station barricaded against violent mobs in the rain"},
            {"code": "01125", "name": "Rivertown", "pos": (20, 52), "cue": "Rising black waters of the Miskatonic overflowing dockside streets"},
            {"code": "01129", "name": "Miskatonic Univ.", "pos": (50, 52), "cue": "Professors barricaded inside library tower with arcane grimoires"},
            {"code": "11685", "name": "Tillinghast (Hidden)", "pos": (80, 52), "cue": "Storefront glowing with uncanny ethereal jade light"},
            {"code": "01128", "name": "St. Mary's Hospital", "pos": (20, 80), "cue": "Emergency ward overflowing with raving catatonic victims"},
            {"code": "01126", "name": "Southside", "pos": (50, 80), "cue": "Historical Society museum with shattered windows & floodwaters"},
            {"code": "01124", "name": "Your House", "pos": (80, 80), "cue": "Warm hearth sanctuary now abandoned as the storm worsens"}
        ],
        "connections": [
            ((20, 24), (50, 24)), ((50, 24), (80, 24)),
            ((20, 24), (20, 52)), ((50, 24), (50, 52)), ((80, 24), (80, 52)),
            ((20, 52), (50, 52)), ((50, 52), (80, 52)),
            ((20, 52), (20, 80)), ((50, 52), (50, 80)), ((80, 52), (80, 80)),
            ((20, 80), (50, 80)), ((50, 80), (80, 80))
        ]
    },
    {
        "id": "11688",
        "slug": "the-doom-of-arkham-part-2",
        "title": "Scenario 10: The Doom of Arkham Part II",
        "subtitle": "Arkham Submerged: Rooftop Sanctuaries Over Drowned Ruins",
        "card_w": 180,
        "card_h": 252,
        "locations": [
            {"code": "11699", "name": "Western Rooftops", "pos": (18, 25), "cue": "High slate roofs with storm-battered chimneys, safe from waves"},
            {"code": "11692", "name": "Northside (Ruined)", "pos": (38, 25), "cue": "Submerged rowhomes with only gable roofs breaking the dark surge"},
            {"code": "11693", "name": "Downtown (Ruined)", "pos": (62, 25), "cue": "Drowned bank facade, marble columns swallowed by seawater"},
            {"code": "11700", "name": "Eastern Rooftops", "pos": (82, 25), "cue": "Industrial warehouse rooftop with makeshift investigator camp"},
            {"code": "11696", "name": "Rivertown (Ruined)", "pos": (50, 55), "cue": "Total vortex of dark swirling sea; ships smashed against brick buildings"},
            {"code": "11695", "name": "Miskatonic (Ruined)", "pos": (28, 80), "cue": "Flooded university quadrangle with half-submerged gothic spires"},
            {"code": "11697", "name": "St. Mary's (Ruined)", "pos": (50, 82), "cue": "Waterlogged hospital halls, debris floating in black brine"},
            {"code": "11698", "name": "Southside (Ruined)", "pos": (72, 80), "cue": "Victorian houses drifting apart in torrential sea currents"}
        ],
        "connections": [
            ((18, 25), (38, 25)), ((38, 25), (62, 25)), ((62, 25), (82, 25)),
            ((18, 25), (50, 55)), ((82, 25), (50, 55)),
            ((50, 55), (28, 80)), ((50, 55), (50, 82)), ((50, 55), (72, 80)),
            ((28, 80), (50, 82)), ((50, 82), (72, 80))
        ]
    }
]

def render_scenario_collage(scenario: dict) -> str:
    """Generate a 1920x1080 moodboard collage reference image."""
    W, H = 1920, 1080
    bg = Image.new("RGBA", (W, H), (10, 18, 26, 255))
    draw = ImageDraw.Draw(bg)

    # Draw dark oceanic vignette
    for y in range(H):
        ratio = y / H
        # Deep abyss blue-black gradient
        r = int(7 + ratio * 12)
        g = int(14 + ratio * 15)
        b = int(22 + ratio * 18)
        draw.line([(0, y), (W, y)], fill=(r, g, b, 255))

    # Draw faint blueprint grid
    grid_color = (20, 45, 60, 120)
    for x in range(0, W, 100):
        draw.line([(x, 0), (x, H)], fill=grid_color, width=1)
    for y in range(0, H, 100):
        draw.line([(0, y), (W, y)], fill=grid_color, width=1)

    # Draw connections
    for p1, p2 in scenario.get("connections", []):
        x1, y1 = int(p1[0] * W / 100), int(p1[1] * H / 100)
        x2, y2 = int(p2[0] * W / 100), int(p2[1] * H / 100)
        draw.line([(x1, y1), (x2, y2)], fill=(40, 100, 130, 180), width=3)

    # Draw header banner
    title_font = get_font(32, bold=True)
    sub_font = get_font(18, bold=False)
    draw.rectangle([(0, 0), (W, 65)], fill=(6, 12, 18, 230))
    draw.line([(0, 65), (W, 65)], fill=(30, 80, 110, 255), width=2)
    draw.text((40, 14), scenario["title"].upper(), fill=(220, 235, 245, 255), font=title_font)
    draw.text((W - 40 - draw.textlength(scenario["subtitle"].upper(), font=sub_font), 22),
              scenario["subtitle"].upper(), fill=(100, 175, 210, 255), font=sub_font)

    card_w = scenario.get("card_w", 170)
    card_h = scenario.get("card_h", 238)
    label_font = get_font(14, bold=True)
    tag_font = get_font(12, bold=False)

    for loc in scenario["locations"]:
        code = loc["code"]
        cx = int(loc["pos"][0] * W / 100)
        cy = int(loc["pos"][1] * H / 100)
        left = cx - card_w // 2
        top = cy - card_h // 2
        right = left + card_w
        bottom = top + card_h

        # Fetch card image
        card_img = fetch_card_image(code)
        card_resized = card_img.resize((card_w, card_h), Image.Resampling.LANCZOS)

        # Drop shadow
        shadow = Image.new("RGBA", (card_w + 20, card_h + 20), (0, 0, 0, 0))
        s_draw = ImageDraw.Draw(shadow)
        s_draw.rounded_rectangle([(10, 10), (card_w + 10, card_h + 10)], radius=8, fill=(0, 0, 0, 200))
        shadow = shadow.filter(ImageFilter.GaussianBlur(6))
        bg.paste(shadow, (left - 10, top - 10), shadow)

        # Paste card
        bg.paste(card_resized, (left, top), card_resized)

        # Accent border
        b_draw = ImageDraw.Draw(bg)
        b_draw.rounded_rectangle([(left, top), (right, bottom)], radius=4, outline=(70, 150, 190, 255), width=2)

        # Label pill under card
        lbl_text = f"{loc['name']} ({loc['pos'][0]}%, {loc['pos'][1]}%)"
        tw = int(b_draw.textlength(lbl_text, font=label_font))
        pill_w = max(tw + 20, card_w)
        pill_x1 = cx - pill_w // 2
        pill_y1 = bottom + 6
        pill_x2 = pill_x1 + pill_w
        pill_y2 = pill_y1 + 24

        b_draw.rounded_rectangle([(pill_x1, pill_y1), (pill_x2, pill_y2)], radius=5, fill=(8, 16, 24, 230), outline=(50, 110, 140, 255), width=1)
        b_draw.text((cx - tw // 2, pill_y1 + 4), lbl_text, fill=(240, 245, 250, 255), font=label_font)

    # Save output
    out_filename = f"{scenario['slug']}-layout-ref.png"
    out_path = os.path.join(OUTPUT_DIR, out_filename)
    bg.save(out_path, format="PNG")
    print(f"Generated layout collage: {out_filename}")
    return out_path

def main():
    print("Starting generation of 10 TDC layout reference collages...")
    for sc in SCENARIOS:
        render_scenario_collage(sc)
    print("All 10 reference collages generated successfully in:", OUTPUT_DIR)

if __name__ == "__main__":
    main()
