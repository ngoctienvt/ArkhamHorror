"""Read-only scene audit inventory; no game files are changed."""
import json
import re
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent
LIB = ROOT / 'backend/arkham-api/library/Arkham'
overview = (ROOT / 'frontend/src/arkham/hemlock-overview.ts').read_text(encoding='utf-8')
boards = dict(re.findall(r"\['([^']+)', '([^']+)'\]", overview.split('// Places to stand')[0]))
excluded = {'TheDunwichLegacy', 'ReturnToTheDunwichLegacy', 'ThePathToCarcosa', 'ReturnToThePathToCarcosa'}
pattern = re.compile(r'removeLocation|RemoveLocation|ReplaceLocation|replaceLocation|SetLayout|setLayout|locationLayoutL|setLocationLayout|Flood|flood|Cosmos|cosmos|SetScenarioMeta|placeSetAside|placeLocation|placeAll|\bswapLocation|setAside|StandaloneSetup')
records = []
for path in sorted((LIB / 'Scenario/Scenarios').rglob('*.hs')):
    if any(p in excluded for p in path.parts):
        continue
    source = path.read_text(encoding='utf-8')
    definitions = list(re.finditer(r'\b(?:scenarioWith|scenario|sideStoryWith|sideStory_)\s+[^\"]{0,180}"([:\w-]+)"\s+"([^"]+)"', source))
    match = definitions[0] if definitions else re.search(r'\bsideStory\s+[^\"]{0,180}"([:\w-]+)"\s+"([^"]+)"', source)
    records.append({'name': match[2] if match else path.stem,
                    'id': match[1] if match else None,
                    'group': path.parent.name if path.parent.name != 'Scenarios' else 'Standalone',
                    'path': path.relative_to(ROOT).as_posix(), 'homebrew': False,
                    'board': boards.get(match[1]) if match else None,
                    'definitions': [{'id': m[1], 'name': m[2]} for m in definitions]})
for manifest in sorted((ROOT / 'frontend/homebrew').glob('*/scenarios.json')):
    group = ''.join(word.title() for word in manifest.parent.name.split('-'))
    for entry in json.loads(manifest.read_text(encoding='utf-8')):
        paths = list((LIB / 'Homebrew' / group / 'Scenarios').glob('*.hs'))
        path = next((p for p in paths if entry['id'] in p.read_text(encoding='utf-8')), None)
        records.append({'name': entry['name'], 'id': entry['id'], 'group': group,
                        'path': path.relative_to(ROOT).as_posix() if path else None,
                        'homebrew': True, 'board': boards.get(entry['id'])})
for record in records:
    if not record['path']:
        record['events'] = []
        continue
    path = ROOT / record['path']
    text = path.read_text(encoding='utf-8')
    record['scaffold'] = bool(re.search(r'Scenario shell only|scope "scaffold"', text))
    record['events'] = [{'line': i, 'text': line.strip()} for i, line in enumerate(text.splitlines(), 1) if pattern.search(line)]
    record['layout'] = re.findall(r'"([\w.]+(?:\s+[\w.]+)+)"', text[:text.find('instance HasChaosTokenValue') if 'instance HasChaosTokenValue' in text else 7000])
(OUT / 'inventory.json').write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding='utf-8')
for group in dict.fromkeys(r['group'] for r in records):
    group_records = [r for r in records if r['group'] == group]
    print(group, len(group_records), 'boards', sum(bool(r['board']) for r in group_records), 'scaffold', sum(bool(r.get('scaffold')) for r in group_records))

art = []
for folder in (ROOT / 'frontend/public/img/scenes').iterdir():
    if not folder.is_dir() or folder.name in {'the-dunwich-legacy', 'the-path-to-carcosa', 'actors', 'archives'}:
        continue
    art.extend(sorted(folder.glob('*.webp')))
for start in range(0, len(art), 30):
    page = Image.new('RGB', (1500, 5 * 195), '#10151a')
    draw = ImageDraw.Draw(page)
    for index, path in enumerate(art[start:start+30]):
        x, y = (index % 5) * 300, (index // 5) * 162
        with Image.open(path) as original:
            original.thumbnail((296, 133))
            page.paste(original, (x, y))
        label = path.parent.name + '/' + path.stem
        draw.text((x+2, y+134), label[:47], fill='white')
        draw.text((x+2, y+147), label[47:94], fill='white')
    page.save(OUT / f'contact-sheet-{start//30+1}.jpg', quality=86)
events = []
change = re.compile(r'removeLocation|RemoveLocation|ReplaceLocation|replaceLocation|SetLayout|setLayout|locationLayoutL|setLocationLayout|Flood|flood|\bswapLocation|RemoveAllLocations|SetGlobal|updateLocation|SetLocationLabel')
for path in sorted(LIB.rglob('*.hs')):
    if any(p in excluded for p in path.parts):
        continue
    if not any(p in {'Scenarios', 'Acts', 'Agendas', 'Locations'} for p in path.parts) and not ('Cards' in path.parts and any(p in {'Act', 'Agenda', 'Location'} for p in path.parts)):
        continue
    lines = path.read_text(encoding='utf-8').splitlines()
    hits = [{'line': i, 'text': line.strip()} for i, line in enumerate(lines, 1) if change.search(line) and not line.strip().startswith(('--', 'import'))]
    if hits:
        events.append({'path': path.relative_to(ROOT).as_posix(), 'hits': hits})
(OUT / 'lifecycle-events.json').write_text(json.dumps(events, ensure_ascii=False, indent=2), encoding='utf-8')
print('records', len(records), 'art', len(art), 'event files', len(events))

# A disposition is an audit finding, not a claim that a scenario was playtested.
decisions = {
    '08648b': ('Sửa', 'Pha escape: giữ Gate, toàn cảnh bốn Ramp và Hidden Tunnel; cả Act/Agenda đều kích hoạt'),
    '08648a': ('Sửa', 'Facility xáo theo vòng/spoke; mô hình phòng theo ô thay ghim mã cố định'),
    '08621': ('Sửa', 'City landscapes xáo vào grid, cần hình bám ô của từng bản'),
    '72001': ('Sửa', 'Phim trường và ba thế giới riêng; trở lại studio; nhánh cosmos theo lưới'),
    '07274': ('Sửa', 'Lodge → hang, chỉ Grand Entryway còn lại; tunnel xáo'),
    '11553': ('Sửa', 'Lost Pilgrims / Hive Mind: gỡ, dời và mở Central Chamber theo nhánh'),
    '04277': ('Sửa', 'Tầng Yoth reset theo depth, không theo số Act'),
    '04161': ('Sửa', 'Mask từng nơi PresentDay / Tenochtitlan theo location hiện tại'),
    '09609': ('Sửa', 'Thêm Lair nối đúng nơi Chimera, Alaska vẫn còn'),
    '12168': ('Sửa', 'Cistern, Sluice Control và diễn biến Fire/Elokoss theo state'),
    '70001': ('Sửa', 'Ba group/layout, nhiều Halls phải có điểm theo ID/label'),
    '83001': ('Thiếu scene', 'Cairo/sa mạc/Explore; chưa đăng ký panorama'),
    '83016': ('Thiếu scene', 'Trước cổng → toàn cảnh Abyss khi bàn cũ rời play'),
    '07311': ('Đề xuất', 'Đổi background hang → Yha-nthlei; giữ sprite/layout 1–4 người'),
    '07231': ('Đề xuất', 'Sau khi Falcon Point mất, tập trung toàn vùng ngầm; giữ flood sprite'),
    '09520': ('Sửa', 'Ngày/đêm từ Gnashing Teeth, vines theo nhánh ritual công khai'),
    '08549': ('Đề xuất', '19 memory landmarks, làm rõ phòng bên trong ký ức; không ép thành campus thật'),
    '11536': ('Đề xuất', 'Core active/inactive và nước theo từng nơi; giữ điểm sau lật'),
    '11612': ('Đề xuất', 'Nhánh East/West, elevator active và mức nước'),
    '11587': ('Đề xuất', 'Moving Platform hoán đổi, flood; kiểm vị trí sau lật theo luật ô'),
    '10651': ('Đề xuất', 'Đã về village; kiểm thêm cosmicEmissary/abyssRevealed layouts'),
    '05120': ('Giữ + QA', 'Đã đổi Witch House → Otherworld và hai Strange Geometry riêng'),
    '05161': ('Giữ + QA', 'Đã có chapel attic/crypt, Spectral cục bộ và toàn cảnh'),
    '07123': ('Giữ + QA', 'Đã có bốn mức thủy triều, vẫn kiểm nước location thực'),
    '07056': ('Giữ + QA', 'Đã sửa panorama thị trấn và ghim'),
    '11688a': ('Giữ + QA', 'Đã mask Ruined theo từng mã thay thế'),
    '12105': ('Giữ + QA', 'Đã có bốn ảnh và nguồn lửa liên tục; room rời không reset lửa'),
    '12133': ('Giữ + QA', 'Các khu Arkham vẫn cùng chơi; chưa xác nhận cần thay toàn cảnh'),
    '13001': ('Giữ + QA', 'Đã có ngày/đêm và Dusk difficulty'),
    '13031': ('Giữ + QA', 'Đã có factory/caves và ngày/đêm'),
    '13068': ('Giữ + QA', 'Đã có Bloody Night khi Foyer thay lá'),
    '73001': ('Giữ + QA', 'Đã mở cutaway ngầm; chưa có bằng chứng nên xóa hết phố'),
    '87001': ('Đề xuất', 'Ba thời đại đồng thời: giữ các vùng, không theo riêng người đang đi'),
    '86001': ('Đề xuất', 'Ba cult/Agenda độc lập, môi trường theo vùng và Hub'),
    '85001': ('Giữ + QA', 'Đã sprite theo grid; kiểm nơi bị Blob ăn'),
    '82001': ('Sửa', 'Kiểm tuyến vòng/hướng và location xáo; sprite theo slot'),
    '84001': ('Đề xuất', 'Giữ khách sạn 10 nơi; nhánh threat cuối không lộ trước khi công khai'),
    '88001': ('Đề xuất', 'Casino cutaway; kiểm cả 88001b/heist và phòng mở muộn'),
    '71001': ('Giữ + QA', 'Đã có phòng sau lật; chưa khóa trigger biến thể môi trường'),
    ':dark-matter:014': ('Giữ + QA', 'Tàu có cutaway; phòng/Scanning theo thông tin công khai'),
    ':dark-matter:054': ('Đề xuất', 'Ba hoán vị school và switch; kiểm quan hệ ô sau reveal'),
    ':dark-matter:089': ('Đề xuất', 'Station unstable/stable: chưa khóa trigger mỹ thuật'),
    ':dark-matter:112': ('Giữ + QA', 'Nostalgia II; không lộ Crew/Imitation trước khi scan'),
    ':dark-matter:153': ('Sửa', 'Simulator thay cục bộ bằng một trong sáu Simulation rồi có thể trở lại'),
    ':dark-matter:190': ('Sửa', 'Nội thất nhà hát và phòng CurtainCall reused cần ghim theo scenario'),
    ':dark-matter:209': ('Sửa', 'Cave/Carcosa từng nơi, giữ surface; hai lớp với mask'),
    ':dark-matter:243': ('Sửa', 'Hai tàu là location cập bến theo host; nơi bị Dark Matter gỡ'),
    ':ages-unwound:001': ('Đề xuất', 'Phố rời/quay lại deck, mặt úp không lộ identity; giữ Arkham panorama có điều kiện'),
    ':ages-unwound:023': ('Đề xuất', 'Nhà/vườn cùng toàn cảnh, phòng đúng tầng; chưa xác nhận thay toàn bàn'),
    ':ages-unwound:048': ('Đề xuất', 'School variants/classrooms, cửa bị gỡ và Ritual Circle loại trừ nhau'),
    ':ages-unwound:062': ('Sửa', 'Vòng tám slot theo state; across/clockwise không neo theo identity'),
    ':ages-unwound:105': ('Đề xuất', 'Địa lý world map, Library trong London, Realm nối Paris, mùa không phủ cả thế giới'),
    ':ages-unwound:155': ('Sửa', 'Featureless Streets → school; hai Act deck/timeline độc lập'),
    ':ages-unwound:182': ('Sửa', 'Nơi xuống dưới Agenda rồi đổi entity; xóa/đổi hình theo state'),
}
challenge_notes = {
    '90004': 'Read or Die: campus + Faculty/Alchemy; dependency agent Dunwich',
    '90011': 'All or Nothing: Clover Club + variants; dependency agent Dunwich',
    '90020': 'Bad Blood: Arkham thêm Diner, TownHall, Shoppe và nơi nhánh',
    '90032': 'By the Book: có thể reuse Arkham sau mapping đúng',
    '90041': 'Red Tide Rising: Innsmouth có Grocery/Gilman/Bookshop',
    '90054': 'Laid to Rest: reuse graveyard nhưng trigger challenge riêng',
    '90065': 'Relics of the Past: Eztli thêm Inner Chamber/variants',
    '90094': 'Enthralling Encore: nhà hát; dependency asset agent Carcosa',
}
for key, note in challenge_notes.items():
    decisions[key] = ('Thiếu scene', note)

homebrew_notes = {
    'AgainstTheWendigo': 'Valley 3×4, Uncharted xáo, sprite đúng hướng/ô',
    'AndThenThereWereNone': 'Nhà/đảo, rooms trong nhà, terrace/shed ngoài; Method bí mật',
    'ConsternationOnTheConstellation': 'Ship decks, mở phòng, sinking và lifeboat theo state/nhánh',
    'TheFallOfTheHouseOfUsher': 'Manor cutaway + Tarn mở muộn, Decadent/Ruined từng phòng',
    'TheInvisibleMan': 'Countryside/cabins/stream, dấu vết theo thông tin công khai',
    'TheLegendOfSleepyHollow': 'Church/tree/farm/swamp/school khác mốc, đường rừng thật',
    'TheMasqueOfTheRedDeath': 'Ballroom + bảy phòng màu; tiệc → Victim theo Act',
    'ThePhantomOfTheOpera': 'Foyer → Opera House → Sewers → Lair/Parlor/Organ, đổi toàn cảnh',
    'TheStrangeCaseOfDrJekyllAndMrHyde': 'Industrial Arkham, lab cutaway, location variants loại trừ',
    'TheSymphonyOfErichZann': 'Nhà hát, bốn Backstage chọn trong sáu, Musician enemy trong phòng',
}
circus_notes = {
    'One Night Only': 'Big Top ba ring cùng lều, circus grounds và cửa thoát',
    'The Primrose Path': 'Rừng tám ô xáo, luật adjacency, sprite theo ô',
    "Harm's Way": 'Lều/Crowded Row theo grid, enemy-as-location cần tương tác',
    'All Points West': 'Đoàn tàu, toa Freight/Special đổi tại ArrivingAt',
    'Piper at the Gates of Dawn': 'Tái dùng circus, thêm vùng/entity theo state',
    'Bacchanalia': 'Manor cutaway, balcony/cellars/dungeon đúng tầng',
    'Red Sunrise': 'Row/path/layout thay, sprite bám ô; khóa ánh sáng trước khi vẽ',
    'Thousand to One': 'Chuỗi rừng, cụm Destiny mở muộn, nơi bị gỡ biến mất',
}
lines = ['# Ma trận bao phủ Scene Map', '',
         'Sàng lọc source/cấu hình và tranh panorama; không phải danh sách các ván đã playtest. ',
         '“Giữ + QA” không chứng nhận mọi nhánh chính xác. “Đề xuất” cần khóa trigger trước khi generate.', '',
         '[Báo cáo và bằng chứng sâu](../reports/audit-261117-2321-scene-immersion.md).', '']
for group in dict.fromkeys(r['group'] for r in records):
    lines.extend([f'## {group}', '', '| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |', '|---|---|---|---|'])
    for r in (item for item in records if item['group'] == group):
        ident = r['id'] or '?'
        mode = r['board'] or 'Chưa đăng ký panorama'
        if group == 'TheDreamEaters':
            mode = 'dreamEatersArt / các vùng'
        if ident == '01104':
            mode = 'Study → house cutaway (logic riêng)'
        status, note = decisions.get(ident, ('Giữ + QA', 'Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván'))
        if r['homebrew'] and not r['board']:
            status = 'Thiếu scene'
            note = homebrew_notes.get(group, 'Bổ sung panorama sau khi khóa tập location/trigger')
            if group == 'CircusExMortis':
                note = circus_notes[r['name']]
            if group == 'NightOfVespers':
                status, note = ('Thiếu scene', 'End of Seasons: Trattoria/rooms, đổi bàn và inferno theo Act/state')
                if r.get('scaffold'):
                    status, note = ('Backend shell', 'Chưa có setup/lifecycle đủ; chỉ làm concept, chưa nghiệm thu trigger')
        if group.startswith('ReturnTo'):
            status, note = 'Theo bản gốc + QA', 'Áp phát hiện bản gốc; kiểm location bổ sung/thay thế và mã Return to riêng'
            if ident == ':return-to-the-innsmouth-conspiracy:043':
                status, note = 'Sửa', 'LairDagon lodge → cave, tunnel Return, flood theo state'
        source = f"[{r['name']}](../../{r['path']})" if r['path'] else r['name']
        lines.append(f"| {source} `{ident}` | {mode} | {status} | {note} |")
        if len(r.get('definitions', [])) > 1:
            extras = ', '.join(f"`{entry['id']}` {entry['name']}" for entry in r['definitions'][1:])
            lines.append(f'| Cùng file, định nghĩa thêm | {extras} | Đã kiểm kê | Đọc cùng source, không tính thành file mới |')
    lines.append('')
lines.extend(['## Giới hạn', '', 'Chưa kiểm browser mọi nhánh, mọi sprite hoặc mọi bản lá. Bảy NightOfVespers shell cần backend trước. Dunwich/PathToCarcosa không nằm trong ma trận; các challenge dùng chung tài sản chỉ ghi dependency, không sửa phạm vi agent khác.', ''])
(OUT / 'coverage.md').write_text('\n'.join(lines), encoding='utf-8')
