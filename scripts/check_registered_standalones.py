with open('frontend/src/arkham/hemlock-overview.ts', 'r', encoding='utf-8') as f:
    c = f.read()

standalones = [
    ('81001', 'Curse of the Rougarou'),
    ('82001', 'Carnevale of Horrors'),
    ('70001', 'The Labyrinths of Lunacy'),
    ('84001', 'Murder at the Excelsior Hotel'),
    ('85001', 'The Blob That Ate Everything'),
    ('86001', 'War of the Outer Gods'),
    ('87001', 'Machinations Through Time'),
    ('88001', 'Fortune and Folly'),
    ('71001', 'The Midwinter Gala'),
    ('72001', 'Film Fatale'),
    ('73001', 'Traces to Nowhere'),
    ('90004', 'Read or Die'),
    ('90011', 'All or Nothing'),
    ('90020', 'Bad Blood'),
    ('90032', 'By the Book'),
    ('90041', 'Red Tide Rising'),
    ('90054', 'Laid to Rest'),
    ('90065', 'Relics of the Past'),
    ('90094', 'Enthralling Encore'),
]

print("=== Standalone Registration in hemlock-overview.ts ===")
for code, name in standalones:
    registered = f"'{code}'" in c or f'"{code}"' in c
    status = "REGISTERED" if registered else "NOT YET"
    print(f"[{status}] {code}: {name}")
