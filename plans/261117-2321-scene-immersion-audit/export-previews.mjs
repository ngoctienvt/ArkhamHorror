import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import ts from '../../frontend/node_modules/typescript/lib/typescript.js'

const cache = new Map()
function moduleUrl(name) {
  if (cache.has(name)) return cache.get(name)
  const source = readFileSync(new URL(`../../frontend/src/arkham/${name}.ts`, import.meta.url), 'utf8')
  const js = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 })
    .replace(/from ['"]\.\/([^'"]+)['"]/g, (_, imported) => `from ${JSON.stringify(moduleUrl(imported))}`)
  const url = 'data:text/javascript;base64,' + Buffer.from(js).toString('base64')
  cache.set(name, url)
  return url
}
const { stageOverview } = await import(moduleUrl('scene-stage-overview'))
const { hemlockOverview, hemlockVillagePosition } = await import(moduleUrl('hemlock-overview'))
const { mapPositions, compactGridLayout } = await import(moduleUrl('locationGraph'))
const rows = []
const add = (id, codes, extra = {}) => {
  const state = { id, layout: [], acts: [], agendas: [], enemies: [], meta: {},
    locations: codes.map((code, i) => ({ id: String(i), label: String(i), cardCode: code, revealed: true,
      modifiers: [], placement: null, tokens: {}, connectedLocations: [] })), ...extra }
  const base = hemlockOverview(id, id, state.layout, state.locations.map((l) => l.label), codes)
  const board = stageOverview(base, state)
  const pins = []
  if (board) for (const location of state.locations) {
    const point = board.positions?.[location.id] ?? (!board.islands && hemlockVillagePosition(location.cardCode, board.anchors, location.label))
    if (point) pins.push([location.cardCode, point])
  }
  const layout = board?.islands ? compactGridLayout(state.layout, new Set(state.locations.map((l) => l.label))) : state.layout
  const fallback = mapPositions(Object.fromEntries(state.locations.map((l) => [l.id, { connectedLocations: [], investigators: [], enemies: [], ...l }])), layout)
  const columns = Math.max(1, ...layout.map((row) => row.trim().split(/\s+/).length))
  const cell = board?.tileSize ?? [92 / columns, 92 / Math.max(1, layout.length)]
  const tiles = Object.entries(board?.tileImages ?? {}).map(([id, image]) => ({ image, point: board.positions?.[id] ?? fallback[id], span: board.tileSpans?.[id] ?? [1, 1], cell }))
  if (board) rows.push({ id: `${id.replaceAll(':', '_')}-${rows.length}`, ...board, pins, tiles })
}
for (const [pack, first, last] of [
  ['the-fall-of-the-house-of-usher', 7, 15], ['consternation-on-the-constellation', 15, 26],
  ['the-masque-of-the-red-death', 7, 14], ['and-then-there-were-none', 5, 10],
  ['the-invisible-man', 9, 15], ['the-legend-of-sleepy-hollow', 6, 11],
]) add(`:${pack}:001`, Array.from({ length: last - first + 1 }, (_, i) => `:${pack}:${String(first + i).padStart(3, '0')}`))
for (const codes of [['008', '009'], ['008', '013', '014', '015'], ['018', '020', '021', '023'], ['023', '016', '017']]) {
  add(':the-phantom-of-the-opera:001', codes.map((code) => `:the-phantom-of-the-opera:${code}`))
}
for (const changed of [false, true]) add(':dark-matter:209', Array.from({ length: 8 }, (_, i) => `:dark-matter:${216 + i}${changed && i >= 2 ? 'b' : ''}`))
add('04161', ['04168', '04169', '04170', '04171', '04172', '04173'])
add('04161', ['04174', '04176', '04178', '04180', '04182', '04184'])
add('83001', ['83008', '83009', '83010', '83011', '83012', '83037', '83038', '83039', '83040', '83041', '83042', '83043', '83044'])
add('83016', ['83022a', '83023a', '83024a', '83025a', '83026a'])
add('72001', ['72050', '72051', '72052', '72053', '72054', '72011'])
add('72001', ['72039', '72040', '72041', '72042', '72043', '72010'])
add('11553', ['11559', '11569', '11570', '11571', '11572'])
add('04161', ['04174', '04169', '04170', '04171', '04172', '04173'])
add(':the-fall-of-the-house-of-usher:001', [':the-fall-of-the-house-of-usher:009b'])
add(':consternation-on-the-constellation:001', [], { locations: [{ id: 'engine', label: 'engineRoom', cardCode: ':consternation-on-the-constellation:015', exhausted: true }] })
for (const side of ['quiet', 'ritual', 'awakened']) add('12168', ['12174', '12175', '12182', '12183', '12184', '12185', '12186', '12187'], {
  enemies: side === 'quiet' ? [] : [{ cardCode: side === 'ritual' ? '12179' : '12179b' }],
})
for (let code = 170; code <= 175; code++) add(':dark-matter:153', [`:dark-matter:${code}`])
const zannFront = ['009', '010', '011', '012', '019'].map((code) => ({ id: code, label: code, cardCode: `:the-symphony-of-erich-zann:${code}`, revealed: true }))
for (const codes of [['013', '014', '015', '016'], ['017', '018', null, '013']]) add(':the-symphony-of-erich-zann:001', [], {
  acts: [{ sequence: { number: 3, side: 'A' } }],
  locations: [...zannFront, ...codes.flatMap((code, i) => code ? [{ id: `room${i}`, label: `backstage${i + 1}`, cardCode: `:the-symphony-of-erich-zann:${code}`, revealed: true }] : [])],
})
add(':circus-ex-mortis:001', ['011', '219', '220', '221', '222', '223', '224', '225'].map((code) => `:circus-ex-mortis:${code}`))
add(':circus-ex-mortis:122', Array.from({ length: 6 }, (_, i) => `:circus-ex-mortis:${129 + i}`))
add(':circus-ex-mortis:122', Array.from({ length: 9 }, (_, i) => `:circus-ex-mortis:${129 + i}`))
add('11553', ['11559', '11560', '11561', '11562', '11563', '11564', '11565', '11566', '11567', '11579'])
add('11553', ['11559', '11560', '11561', '11562', '11563', '11564', '11569', '11570', '11571', '11579'])
add(':ages-unwound:048', ['056', '057', '058', '059', '222', '223', '224', '226', '227', '228', '229', '230'].map((code) => `:ages-unwound:${code}`))
add(':ages-unwound:155', ['169', '170', '171', '172', '222', '223', '173', '224', '225', '226', '227', '228', '229', '230'].map((code) => `:ages-unwound:${code}`))
add(':ages-unwound:155', [':ages-unwound:168'])
add(':ages-unwound:023', Array.from({ length: 10 }, (_, i) => `:ages-unwound:${String(30 + i).padStart(3, '0')}`))
const mirageLabels = ['prisonOfMemories', 'baseCamp', 'deckOfTheTheodosia', 'universityHalls', 'hedgeMaze', 'desertedStation', 'coastalWaters', 'elderChamber', 'riverviewTheatre', 'standingStones', 'airfield', 'alaskanWilds', 'clutteredDormitory', 'dyersClassroom', 'infirmary', 'drKenslersOffice', 'moaiStatues', 'ottomanFront', 'theBlackStone']
add('08549', [], { layout: [
  '. ottomanFront . desertedStation alaskanWilds', 'airfield . baseCamp . infirmary',
  '. coastalWaters prisonOfMemories riverviewTheatre .', 'moaiStatues deckOfTheTheodosia . universityHalls drKenslersOffice',
  '. hedgeMaze standingStones elderChamber clutteredDormitory', '. dyersClassroom . theBlackStone .',
], locations: mirageLabels.map((label, i) => ({ id: label, label, cardCode: String(8556 + i).padStart(5, '0'), revealed: true })) })
for (const codes of [['111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122'], ['111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '142', '143']]) {
  add(':ages-unwound:105', codes.map((code) => `:ages-unwound:${code}`))
}
add('11612', [], { layout: ['catwalks . archive5 .', 'archive4 lift archive3 .', 'archive2 . archive1 .', 'west . east altar'],
  locations: ['11621', '11629', '11628', '11622b', '11627', '11626', '11624', '11619', '11620', '11623'].map((cardCode, i) => ({ id: String(i), label: ['catwalks', 'archive5', 'archive4', 'lift', 'archive3', 'archive2', 'archive1', 'west', 'east', 'altar'][i], cardCode, revealed: true })) })
add('11587', [], { layout: ['a b c d e', 'f g . h i', 'j k l m n'],
  locations: ['11593', '11594', '11595', '11596', '11596', '11598', '11599', '11600', '11601', '11602', '11603', '11604'].map((cardCode, i) => ({ id: String(i), label: 'abcdefghijkl'[i], cardCode, revealed: true })) })
add('82001', [], { locations: Array.from({ length: 8 }, (_, i) => ({ id: String(i), label: `location${i + 1}`, cardCode: String(82008 + i), revealed: true })) })
add('82001', ['82006b'], { enemies: [{ id: 'cnidathqua', cardCode: '82027', asSelfLocation: 'monster', placement: { tag: 'AtLocation', contents: 'boat' } }] })
for (const revealed of [false, true]) add(':dark-matter:054', [], { layout: ['a b c', 'd e f', '. g .'], locations: Array.from({ length: 7 }, (_, i) => ({ id: String(i), label: 'abcdefg'[i], cardCode: `:dark-matter:${String(69 + i).padStart(3, '0')}`, revealed })) })
add(':circus-ex-mortis:074', [], { layout: ['a b c d e', 'f g h i j', 'k l m n o'], locations: Array.from({ length: 15 }, (_, i) => ({ id: String(i), label: 'abcdefghijklmno'[i], cardCode: `:circus-ex-mortis:${String(81 + i).padStart(3, '0')}`, revealed: true })) })
add('09520', ['09526', '09527', '09528', '09529', '09530'])
const heatLocations = ['09526', '09527', '09528', '09529', '09530']
const heatNight = [{ sequence: { step: 2, side: 'A' } }]
const heatVines = [{ id: '09525', sequence: { number: 3, side: 'A' } }]
add('09520', heatLocations, { agendas: heatNight })
add('09520', heatLocations, { acts: heatVines })
add('09520', heatLocations, { agendas: heatNight, acts: heatVines })
for (const agendas of [[], heatNight]) add('09520', heatLocations, { agendas, acts: heatVines, enemies: [{ cardCode: '09537b' }] })
const fateLayout = ['. . caveTop1 caveTop2 . .', '. . . mirrorNestTop . .',
  'caveLeft1 mirrorNestLeft cosmicEmissaryPhantasm cosmicEmissaryAbyss . .',
  'caveLeft2 . cosmicEmissaryBrilliance cosmicEmissaryMiasma mirrorNestRight caveRight1',
  '. . mirrorNestBottom . . caveRight2', '. . caveBottom1 caveBottom2 . .']
const fateNests = ['mirrorNestTop', 'mirrorNestRight', 'mirrorNestBottom', 'mirrorNestLeft'].map((label, i) => ({ id: label, label, cardCode: String(10666 + i), revealed: true }))
add('10651', [], { layout: fateLayout, locations: fateNests })
const fateCaves = ['caveTop1', 'caveTop2', 'caveRight1', 'caveRight2', 'caveBottom1', 'caveLeft1'].map((label, i) => ({ id: label, label, cardCode: String(i === 5 ? 10716 : 10716 + i), revealed: true }))
const fateOpened = fateLayout.map((row) => row.replace(/cosmicEmissary\w+/g, 'theAbyss'))
for (const revealed of [false, true]) add('10651', [], { layout: fateOpened, locations: [...fateNests, ...fateCaves.map((l) => ({ ...l, revealed })), { id: 'abyss', label: 'theAbyss', cardCode: '10670', revealed: true }] })
add('10651', [], { layout: ['. diamond .', 'moon square heart'], locations: [] })
writeFileSync(new URL('preview-boards.json', import.meta.url), JSON.stringify(rows, null, 2))
mkdirSync(new URL('previews/', import.meta.url), { recursive: true })
const publicRoot = new URL('../../frontend/public/', import.meta.url).href
const data = JSON.stringify(rows).replaceAll('<', '\\u003c')
writeFileSync(new URL('previews/scene-browser-preview.html', import.meta.url), `<!doctype html><meta charset="utf-8"><title>Scene pin and mask QA</title>
<style>body{margin:0;background:#101820;color:#ddd;font:14px system-ui}header{padding:8px}main{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden}img{position:absolute;inset:0;width:100%;height:100%;object-fit:fill;pointer-events:none}.pin{position:absolute;transform:translate(-50%,-100%);color:#00e6ff;background:#071d26cc;padding:3px;border:1px solid #00e6ff;border-radius:4px;font-size:11px}.pin:after{content:'';display:block;width:6px;height:6px;background:#00e6ff;border-radius:50%;margin:2px auto}button{margin:2px}</style>
<header><button id="previous">←</button><span id="title"></span><button id="next">→</button></header><main></main>
<script>const boards=${data};const root=${JSON.stringify(publicRoot)};let index=Number(location.hash.slice(1))||0;
function render(){const board=boards[index];document.querySelector('#title').textContent=index+' / '+boards.length+' '+board.id;const main=document.querySelector('main');main.replaceChildren();
for(const layer of [{image:board.image},...(board.layers||[])]){const img=document.createElement('img');img.src=root+layer.image;if(layer.mask)Object.assign(img.style,{maskImage:layer.mask,maskSize:'100% 100%',maskRepeat:'no-repeat'});main.append(img)}
for(const tile of board.tiles||[]){if(!tile.point)continue;const img=document.createElement('img');img.src=root+tile.image;const cellW=main.clientWidth*tile.cell[0]/100*tile.span[0],cellH=main.clientHeight*tile.cell[1]/100*tile.span[1],plate=Math.min(34,cellH*.35),w=Math.min(cellW,(cellH-plate)*1.5),h=w/1.5,offset=-cellH/2+plate+h/2;Object.assign(img.style,{inset:'auto',left:tile.point[0]+'%',top:'calc('+tile.point[1]+'% + '+offset+'px)',width:w+'px',height:h+'px',objectFit:'contain',transform:'translate(-50%,-50%)'});main.append(img)}
for(const figure of board.figures||[]){const img=document.createElement('img');img.src=root+figure.image;Object.assign(img.style,{inset:'auto',left:figure.point[0]+'%',top:figure.point[1]+'%',width:figure.size[0]+'%',height:figure.size[1]+'%',objectFit:'contain',transform:'translate(-50%,-100%)',maskImage:figure.mask||'none'});main.append(img)}
const seen=new Set();for(const [code,[x,y]] of board.pins){if(seen.has(x+','+y))continue;seen.add(x+','+y);const pin=document.createElement('span');pin.className='pin';pin.textContent=code.split(':').pop();Object.assign(pin.style,{left:x+'%',top:y+'%'});main.append(pin)}
document.body.dataset.scene=board.id;Promise.all([...main.querySelectorAll('img')].map(img=>img.decode().catch(()=>null))).then(()=>{document.body.dataset.failedImages=[...main.querySelectorAll('img')].filter(img=>!img.naturalWidth).length})}
document.querySelector('#previous').onclick=()=>{index=(index+boards.length-1)%boards.length;location.hash=index;render()};document.querySelector('#next').onclick=()=>{index=(index+1)%boards.length;location.hash=index;render()};render();</script>`)
console.log(`Exported ${rows.length} boards for pin calibration`)
