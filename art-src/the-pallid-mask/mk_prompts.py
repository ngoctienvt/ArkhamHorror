import os
base = ("Painterly Arkham Horror LCG map sprite, high 3/4 angle, 3:2, 1536x1024, transparent background with true PNG alpha. "
 "Redraw the attached card illustration as a single freestanding location piece using its architecture, props and dominant colors. "
 "Location fills 75-85% of frame, with a small clear flat spot at lower center for a tiny standing figure and a readable silhouette at 150 px. "
 "Thin irregular ground at most. Omit card frame, text, icons, logos, watermark, people, living creatures, sky, horizon, generic round rock islands and empty platforms. "
 "Setting: the catacombs beneath Carcosa-haunted Paris-style ossuary, bone walls, damp stone. ")
d = {
'03247':"A tilted heavy stone slab doorway, the Gate to Hell, set into a stone chamber; two wall torches burn on either side; a narrow gap in the slab glows yellow-orange. Cold blue-grey stone, amber accent.",
'03248':"A long vaulted brick corridor with a row of dark arches on each side and a blazing white-yellow glow at the far end; warm orange brick, orange accent.",
'03249':"A recess whose back is a wall of stacked skulls, with a large burning lamp bowl on a stone pedestal in front, fire orange, flanked by grey-blue stone pillars.",
'03250':"A low cavern whose whole floor is heaped with bones and skulls, brown-orange rock, a tiny green glow in a far opening. Green accent.",
'03251':"A circular chamber floor of skulls and bones arranged in a radiating spiral around a dark central well hole, blue-gold tones, gold accent.",
'03252':"A curved red-orange rock tunnel studded with dozens of small candle flames along its walls and floor. Red-orange accent.",
'03253':"A huge cylindrical pillar of stacked bones rising in a blue-black circular chamber, toxic green mist curling at one side. Toxic green accent.",
'03254':"A black rock wall pierced by a round vertical shaft that glows white-blue like an eclipse ring, ringed by rough stone. Electric blue accent.",
'03255':"A flooded stone corridor with pale teal mist hanging over still water, walls lit yellow by distant lamps. Teal accent.",
'03256':"A candlelit corridor completely choked by a heap of skulls and bones, small yellow candles glowing behind the pile, blue-teal gloom. Teal-blue with yellow candle accent.",
'03257':"A vast ossuary hall with long rows of tiny candles on the floor and a tall dark stone monolith at right, golden light. Gold accent.",
'52049':"Wooden-framed shelves packed with skulls forming an ossuary wall, with a dark side passage opening at one side and light fog; brown-grey tones. Brown accent.",
'52050':"A big heap of bones and skulls piled under dark arched niches full of skulls, purple-violet gloom. Violet accent.",
'52051':"A large skull resting on an old book and an unrolled yellowed map on a rough stone slab, skull-lined wall behind. Parchment amber accent.",
'52052':"A tunnel of tightly packed skulls opening to a huge blazing yellow-orange sun-like light at its end. Blazing yellow-orange accent.",
}
os.makedirs('prompts', exist_ok=True)
for k, v in d.items():
    open(f'prompts/{k}.txt', 'w', encoding='utf-8').write(base + v)
open('prompts/back.txt','w',encoding='utf-8').write(
 "Simple game map tile seen from a high 3/4 angle, isolated on a fully TRANSPARENT background, square canvas 1024x1024, painterly Arkham Horror LCG style. "
 "A low, plain irregular slab of damp dark catacomb stone and bone-dust with a wide flat top for small standing figures, edges fading to transparent. "
 "Deliberately unremarkable, no landmarks, a few tiny bone fragments only, no skull focal point, no text, no people. Muted brown-grey with a faint red-orange tint matching the attached card back.")
open('prompts/background.txt','w',encoding='utf-8').write(
 "A vast, empty catacomb floor seen from a high, distant vantage point, classic Lovecraftian horror digital oil painting, 16:9 widescreen, 1536x864, matching the painterly style of Arkham Horror LCG card art. "
 "One seamless expanse of dark stone and packed earth with NO structures, NO doorway, NO spiral stair, NO gate, NO torches in the center, NO figures and NO focal landmark. "
 "Near-black brown and cold blue-black, faint bone-dust, damp stone cracks and a few scattered tiny bone fragments, subtle black water stains, faint warm amber glints only at the very edges. "
 "Low even lighting, no bursts or lens flares. CENTER stays calm, dark and low in detail; detail rises gently toward the edges with a few skull-lined wall fragments barely visible at the borders. "
 "Uniform composition with no vanishing point so it can be panned, zoomed and cropped in any direction. No text.")
