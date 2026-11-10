import os
import sys
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT = Path(__file__).resolve().parent.parent.parent
CARDS_VI_FILE = ROOT / "frontend" / "public" / "cards_vi.json"
CACHE_FILE = ROOT / "frontend" / "scripts" / "card_translation_cache.json"

TARGET_TYPES = {
    'act', 'agenda', 'location', 'enemy', 'treachery',
    'scenario', 'story', 'key', 'enemy_location'
}

# Known Glossary for high-frequency or iconic Arkham Horror cards and scenario titles
NAME_GLOSSARY = {
    # Scenarios
    'The Gathering': 'Buổi Tụ Họp',
    'The Midnight Masks': 'Những Chiếc Mặt Nạ Lúc Nửa Đêm',
    'The Devourer Below': 'Kẻ Nuốt Chửng Bên Dưới',
    'Extracurricular Activity': 'Hoạt Động Ngoại Khóa',
    'The House Always Wins': 'Nhà Cái Luôn Thắng',
    'The Miskatonic Museum': 'Bảo Tàng Miskatonic',
    'The Essex County Express': 'Tàu Tốc Hành Hạt Essex',
    'Blood on the Altar': 'Máu Trên Bàn Thờ',
    'Undimensioned and Unseen': 'Vô Hình Vô Thứ Nguyên',
    'Where Doom Awaits': 'Nơi Doom Chờ Đón',
    'Lost in Time and Space': 'Lạc Trong Thời Gian và Không Gian',
    'Curtain Call': 'Hạ Màn',
    'The Last King': 'Vị Vua Cuối Cùng',
    'Echoes of the Past': 'Tiếng Vọng Quá Khứ',
    'The Unspeakable Oath': 'Lời Thề Không Thể Thốt Ra',
    'A Phantom of Truth': 'Bóng Ma Của Chân Lý',
    'The Pallid Mask': 'Chiếc Mặt Nạ Tái Nhợt',
    'Black Stars Rise': 'Những Ngôi Sao Đen Mọc Lên',
    'Dim Carcosa': 'Carcosa Mờ Ảo',
    'The Untamed Wilds': 'Miền Hoang Dã Chưa Được Thuần Hóa',
    'The Doom of Eztli': 'Diệt Vong Của Eztli',
    'Threads of Fate': 'Những Sợi Tơ Định Mệnh',
    'The Boundary Beyond': 'Ranh Giới Bên Kia',
    'Heart of the Elders': 'Trái Tim Cổ Xưa',
    'The City of Archives': 'Thành Phố Lưu Trữ',
    'The Depths of Yoth': 'Tầng Sâu Yoth',
    'Shattered Aeons': 'Những Kỷ Nguyên Tan Vỡ',
    'Disappearance at the Twilight Estate': 'Mất Tích Tại Twilight Estate',
    'The Witching Hour': 'Giờ Phù Thủy',
    'At Death\'s Doorstep': 'Trước Cửa Tử',
    'The Secret Name': 'Cái Tên Bí Mật',
    'The Wages of Sin': 'Cái Giá Của Tội Lỗi',
    'For the Greater Good': 'Vì Mục Đích Lớn Lao Hơn',
    'Union and Disillusion': 'Hợp Nhất và Vỡ Mộng',
    'In the Clutches of Chaos': 'Trong Vuốt Của Hỗn Mang',
    'Before the Black Throne': 'Trước Ngai Vàng Đen',
    
    # Common Locations (Core & Dunwich)
    'Study': 'Phòng Làm Việc',
    'Hallway': 'Hành Lang',
    'Attic': 'Gác Xép',
    'Cellar': 'Hầm Rượu',
    'Parlor': 'Phòng Khách',
    'Your House': 'Ngôi Nhà Của Bạn',
    'Rivertown': 'Rivertown',
    'Southside': 'Southside',
    'Downtown': 'Downtown',
    'Easttown': 'Easttown',
    'Northside': 'Northside',
    'French Hill': 'French Hill',
    'Miskatonic University': 'Đại Học Miskatonic',
    'St. Mary\'s Hospital': 'Bệnh Viện St. Mary',
    'Arkham Woods': 'Rừng Arkham',
    'Graveyard': 'Nghĩa Trang',
    'Ritual Site': 'Khu Vực Nghi Lễ',
    'Main Path': 'Con Đường Chính',
    
    # Common Enemies
    'Swarm of Rats': 'Bầy Chuột',
    'Ghoul Priest': 'Tư Tế Ngạ Quỷ',
    'Icy Ghoul': 'Ngạ Quỷ Băng Giá',
    'Ravenous Ghoul': 'Ngạ Quỷ Háu Đói',
    'Ghoul Minion': 'Tay Sai Ngạ Quỷ',
    'Flesh-Eater': 'Kẻ Ăn Thịt Người',
    'Acolyte': 'Giáo Đồ',
    'Wizard of the Order': 'Pháp Sư Dòng Hội',
    'Hunting Nightgaunt': 'Dạ Quỷ Săn Mồi',
    'Screeching Byakhee': 'Byakhee Thét Gào',
    'The Masked Hunter': 'Thợ Săn Mang Mặt Nạ',
    'Yithian Observer': 'Người Quan Sát Yithian',
    'Relentless Dark Young': 'Hắc Súc Bất Tuyệt',
    'Goat Spawn': 'Dê Con Tà Ác',
    'Young Deep One': 'Người Sâu Trẻ Tuổi',
    
    # Common Treacheries
    'Locked Door': 'Cánh Cửa Bị Khóa',
    'Crypt Chill': 'Khí Lạnh Hầm Mộ',
    'Ancient Evils': 'Tà Ác Cổ Xưa',
    'Obscuring Fog': 'Sương Mù Che Khuất',
    'Frozen in Fear': 'Chết Lặng Trong Sợ Hãi',
    'Rotting Remains': 'Hài Cốt Thối Rữa',
    'Grasping Hands': 'Những Bàn Tay Níu Giữ',
    'Dissonant Voices': 'Những Âm Thanh Bất Hòa',
    'Mysterious Chanting': 'Lời Tụng Niệm Bí Ẩn',
    'On Wings of Darkness': 'Trên Đôi Cánh Bóng Tối',
    'The Yellow Sign': 'Dấu Hiệu Vàng',
    'Offer of Power': 'Lời Mời Gọi Quyền Năng',
    'Dreams of R\'lyeh': 'Giấc Mộng R\'lyeh',
    'Umôrdhoth\'s Wrath': 'Cơn Thịnh Nộ Của Umôrdhoth',
    'Amnesia': 'Mất Trí Nhớ',
    'Paranoia': 'Hoang Tưởng',
    'Hypochondria': 'Chứng Lo Lắng Quá Mức',
    'Psychosis': 'Loạn Thần',
    'Cover Up': 'Che Đậy Dấu Vết',
    'Abandoned and Alone': 'Bị Bỏ Rơi và Đơn Độc',
    'Hospital Debts': 'Nợ Nần Bệnh Viện',
    'Haunted': 'Bị Ám',

    # Acts & Agendas (Core)
    'Trapped': 'Mắc Kẹt',
    'The Barrier': 'Rào Chắn',
    'What Have You Done?': 'Ngươi Đã Làm Gì?',
    'What\'s Going On?!': 'Chuyện Gì Đang Xảy Ra?!',
    'Rise of the Ghouls': 'Sự Trỗi Dậy Của Ngạ Quỷ',
    'They\'re Getting Out!': 'Chúng Đang Thoát Ra!',
    'Predator or Prey?': 'Thợ Săn Hay Con Mồi?',
    'The Arkham Woods': 'Rừng Arkham',
    'The Ritual Begins': 'Nghi Thức Bắt Đầu',
    'Investigating the Trail': 'Điều Tra Dấu Vết',
    'Into the Darkness': 'Tiến Vào Bóng Tối',
    'Disrupting the Ritual': 'Phá Vỡ Nghi Thức',
}

KEYWORDS_EXACT = [
    ('clues', '__KW_CLUES__'),
    ('clue', '__KW_CLUE__'),
    ('attacks of opportunity', '__KW_AOO__'),
    ('attack of opportunity', '__KW_AOO__'),
    ('scenario reference cards', '__KW_SRC__'),
    ('scenario reference card', '__KW_SRC__'),
    ('encounter discard piles', '__KW_EDP__'),
    ('encounter discard pile', '__KW_EDP__'),
    ('encounter decks', '__KW_ED__'),
    ('encounter deck', '__KW_ED__'),
    ('victory displays', '__KW_VD__'),
    ('victory display', '__KW_VD__'),
    ('discard piles', '__KW_DP__'),
    ('discard pile', '__KW_DP__'),
    ('chaos bags', '__KW_CB__'),
    ('chaos bag', '__KW_CB__'),
    ('chaos tokens', '__KW_CT__'),
    ('chaos token', '__KW_CT__'),
    ('mental traumas', '__KW_MT__'),
    ('mental trauma', '__KW_MT__'),
    ('physical traumas', '__KW_PT__'),
    ('physical trauma', '__KW_PT__'),
    ('threat areas', '__KW_TA__'),
    ('threat area', '__KW_TA__'),
    ('in the shadows', '__KW_ITS__'),
    ('out of play', '__KW_OOP__'),
    ('into play', '__KW_IP__'),
    ('enters play', '__KW_EP__'),
    ('in play', '__KW_INP__'),
    ('direct horror', '__KW_DH__'),
    ('direct damage', '__KW_DD__'),
    ('lead investigators', '__KW_LI__'),
    ('lead investigator', '__KW_LI__'),
    ('investigators', '__KW_INVS__'),
    ('investigator', '__KW_INV__'),
    ('mini-cards', '__KW_MC__'),
    ('mini-card', '__KW_MC__'),
    ('connected locations', '__KW_CLOCS__'),
    ('connected location', '__KW_CLOC__'),
    ('locations', '__KW_LOCS__'),
    ('location', '__KW_LOC__'),
    ('enemies', '__KW_ENMS__'),
    ('enemy', '__KW_ENM__'),
    ('assets', '__KW_ASSTS__'),
    ('asset', '__KW_ASST__'),
    ('events', '__KW_EVNTS__'),
    ('event', '__KW_EVNT__'),
    ('skills', '__KW_SKLS__'),
    ('skill', '__KW_SKL__'),
    ('treacheries', '__KW_TRCHS__'),
    ('treachery', '__KW_TRCH__'),
    ('weaknesses', '__KW_WKNS__'),
    ('weakness', '__KW_WKN__'),
    ('Easy / Standard', '__KW_EASY_STD__'),
    ('Hard / Expert', '__KW_HARD_EXP__'),
]

SINGLE_KEYWORDS = [
    'Hunter', 'Retaliate', 'Alert', 'Massive', 'Aloof', 'Peril', 'Surge',
    'Elusive', 'Patrol', 'Swarm', 'Hidden',
    'advance', 'advances', 'advanced', 'advancing',
    'doom', 'shroud',
    'damage', 'horror',
    'spawn', 'spawns', 'spawned', 'spawning',
    'parley',
    'evade', 'evades', 'evaded', 'evading',
    'engage', 'engages', 'engaged', 'engaging',
    'disengage', 'disengages', 'disengaged',
    'exhaust', 'exhausts', 'exhausted', 'exhausting',
    'ready', 'readies', 'readied', 'readying',
    'concealed', 'decoy', 'expose', 'shift', 'bearer',
    'Stable', 'Unstable', 'hollow', 'seal', 'locus'
]

PHRASE_UNMASK_MAP = {
    '__KW_CLUES__': 'manh mối',
    '__KW_CLUE__': 'manh mối',
    '__KW_LI__': 'điều tra viên chính',
    '__KW_INVS__': 'các điều tra viên',
    '__KW_INV__': 'điều tra viên',
    '__KW_AOO__': 'đòn cơ hội',
    '__KW_SRC__': 'thẻ tham chiếu màn chơi',
    '__KW_EDP__': 'chồng bài encounter bỏ',
    '__KW_ED__': 'chồng bài encounter',
    '__KW_VD__': 'khu vực trưng bày thành tích',
    '__KW_DP__': 'chồng bài bỏ',
    '__KW_CB__': 'túi hỗn mang',
    '__KW_CT__': 'token hỗn mang',
    '__KW_MT__': 'sang chấn tinh thần',
    '__KW_PT__': 'sang chấn thể chất',
    '__KW_TA__': 'threat area',
    '__KW_ITS__': 'trong bóng tối',
    '__KW_OOP__': 'ngoài màn chơi',
    '__KW_IP__': 'vào chơi',
    '__KW_EP__': 'vào chơi',
    '__KW_INP__': 'trong màn chơi',
    '__KW_DH__': 'tổn thương tinh thần trực tiếp',
    '__KW_DD__': 'tổn thương thể chất trực tiếp',
    '__KW_MC__': 'mini-card',
    '__KW_CLOCS__': 'các địa điểm kết nối',
    '__KW_CLOC__': 'địa điểm kết nối',
    '__KW_LOCS__': 'các địa điểm',
    '__KW_LOC__': 'địa điểm',
    '__KW_ENMS__': 'các kẻ địch',
    '__KW_ENM__': 'kẻ địch',
    '__KW_ASSTS__': 'các asset',
    '__KW_ASST__': 'asset',
    '__KW_EVNTS__': 'các event',
    '__KW_EVNT__': 'event',
    '__KW_SKLS__': 'các skill',
    '__KW_SKL__': 'skill',
    '__KW_TRCHS__': 'các treachery',
    '__KW_TRCH__': 'treachery',
    '__KW_WKNS__': 'các điểm yếu',
    '__KW_WKN__': 'điểm yếu',
    '__KW_EASY_STD__': 'Easy / Standard',
    '__KW_HARD_EXP__': 'Hard / Expert',
}

def mask_text(text):
    placeholders = {}
    idx = 0

    # 1. Bold effect starters: <b>Objective</b>, <b>Forced</b>, <b>Revelation</b>, etc.
    def repl_b(m):
        nonlocal idx
        ph = f'QXZ{idx}QXZ'
        idx += 1
        placeholders[ph] = m.group(0)
        return ph
    text = re.sub(r'<b>(Objective|Forced|Revelation|Prey|Spawn|Haunted|Resign\.|Shift|Action|Reaction|Fast)</b>', repl_b, text, flags=re.IGNORECASE)

    # 2. [[Trait]]
    def repl_trait(m):
        nonlocal idx
        ph = f'QXZ{idx}QXZ'
        idx += 1
        placeholders[ph] = m.group(0)
        return ph
    text = re.sub(r'\[\[.*?\]\]', repl_trait, text)

    # 3. [token]
    def repl_token(m):
        nonlocal idx
        ph = f'QXZ{idx}QXZ'
        idx += 1
        placeholders[ph] = m.group(0)
        return ph
    text = re.sub(r'\[[a-zA-Z0-9_]+\]', repl_token, text)

    # 4. Other HTML tags: <i>, </b>, <p>, etc.
    def repl_tag(m):
        nonlocal idx
        ph = f'QXZ{idx}QXZ'
        idx += 1
        placeholders[ph] = m.group(0)
        return ph
    text = re.sub(r'</?[a-zA-Z0-9]+[^>]*>', repl_tag, text)

    # 5. Exact multi-word game phrases
    for kw, ph_code in KEYWORDS_EXACT:
        pattern = r'\b' + re.escape(kw) + r'\b'
        def repl_exact(m, code=ph_code):
            nonlocal idx
            ph = f'{code}_{idx}QXZ'
            idx += 1
            placeholders[ph] = m.group(0)
            return ph
        text = re.sub(pattern, repl_exact, text, flags=re.IGNORECASE)

    # 6. Single game keywords
    for kw in sorted(SINGLE_KEYWORDS, key=lambda x: len(x), reverse=True):
        pattern = r'\b' + re.escape(kw) + r'\b'
        def repl_single(m):
            nonlocal idx
            ph = f'QKW{idx}QKW'
            idx += 1
            placeholders[ph] = m.group(0)
            return ph
        text = re.sub(pattern, repl_single, text, flags=re.IGNORECASE)

    return text, placeholders

def unmask_text(text, placeholders):
    for ph, orig in placeholders.items():
        replacement = orig
        for code, vi_text in PHRASE_UNMASK_MAP.items():
            if code in ph:
                replacement = vi_text
                break
        
        pattern = re.escape(ph).replace(r'\_', r'[\_\s]?')
        text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)

    # Post-processing fixes for natural Vietnamese phrasing in Arkham style
    text = re.sub(r'\bhãy lấy\b', 'nhận', text, flags=re.IGNORECASE)
    text = re.sub(r'\blấy\s+(\d+)\s+damage\b', r'nhận \1 damage', text, flags=re.IGNORECASE)
    text = re.sub(r'\blấy\s+(\d+)\s+horror\b', r'nhận \1 horror', text, flags=re.IGNORECASE)
    text = re.sub(r'\blấy\s+1\s+clue\b', 'lấy 1 clue', text, flags=re.IGNORECASE)
    text = re.sub(r'\bngười chơi\b', 'điều tra viên', text, flags=re.IGNORECASE)
    text = re.sub(r'\bvòng chơi\b', 'vòng', text, flags=re.IGNORECASE)
    text = re.sub(r'\bsử dụng evade\b', 'evade', text, flags=re.IGNORECASE)
    text = re.sub(r'\bsử dụng engage\b', 'engage', text, flags=re.IGNORECASE)
    text = re.sub(r'\bsử dụng parley\b', 'parley', text, flags=re.IGNORECASE)
    text = re.sub(r'  +', ' ', text)
    return text.strip()

def raw_api_translate(text, max_retries=3):
    if not text or not text.strip():
        return text
    
    url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=' + urllib.parse.quote(text)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    
    for attempt in range(max_retries):
        try:
            with urllib.request.urlopen(req, timeout=12) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                res = ''.join([p[0] for p in data[0] if p[0]])
                return res
        except Exception as e:
            if attempt == max_retries - 1:
                return text
            time.sleep(0.5 * (attempt + 1))
    return text

def translate_name_string(name, cache):
    if not name or not name.strip():
        return name
    name_clean = name.strip()
    if name_clean in NAME_GLOSSARY:
        return NAME_GLOSSARY[name_clean]
    if name_clean in cache:
        return cache[name_clean]
    
    raw = raw_api_translate(name_clean)
    # Post fixes on name
    res = re.sub(r'\bma cà rồng\b', 'Ngạ Quỷ', raw, flags=re.IGNORECASE)
    res = re.sub(r'\bngười sùng bái\b', 'Tín Đồ', res, flags=re.IGNORECASE)
    # Title Case in Vietnamese
    words = res.split(' ')
    stopwords = {'của', 'và', 'trong', 'với', 'ở', 'tại', 'những', 'các', 'cho', 'từ', 'hoặc', 'trên'}
    res = ' '.join(w.capitalize() if len(w) > 2 and w.lower() not in stopwords else w for w in words)
    
    cache[name_clean] = res
    return res

def translate_text_string(text, cache):
    if not text or not text.strip():
        return text
    text_clean = text.strip()
    if text_clean in cache:
        return cache[text_clean]
    
    masked, placeholders = mask_text(text_clean)
    raw = raw_api_translate(masked)
    unmasked = unmask_text(raw, placeholders)
    
    cache[text_clean] = unmasked
    return unmasked

def load_cache():
    if CACHE_FILE.exists():
        try:
            return json.loads(CACHE_FILE.read_text(encoding='utf-8'))
        except Exception:
            return {}
    return {}

def save_cache(cache):
    try:
        CACHE_FILE.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding='utf-8')
    except Exception as e:
        print(f"Error saving cache: {e}")

def main():
    print(f"Loading cards from {CARDS_VI_FILE}...")
    cards = json.loads(CARDS_VI_FILE.read_text(encoding='utf-8'))
    print(f"Total cards in file: {len(cards)}")
    
    cache = load_cache()
    print(f"Loaded {len(cache)} cached translations.")

    # 1. Gather all unique strings that need translation
    names_to_translate = set()
    texts_to_translate = set()

    encounter_cards = []
    for c in cards:
        is_target = (
            c.get('type_code') in TARGET_TYPES or
            bool(c.get('encounter_code')) or
            c.get('subtype_code') in ('weakness', 'basicweakness')
        )
        if not is_target:
            continue
        encounter_cards.append(c)

        # Check name
        if c.get('real_name'):
            # Only translate if not already translated
            if not c.get('name') or c.get('name') == c.get('real_name'):
                names_to_translate.add(c['real_name'].strip())
        
        # Check subname
        if c.get('real_subname'):
            if not c.get('subname') or c.get('subname') == c.get('real_subname'):
                names_to_translate.add(c['real_subname'].strip())

        # Check text
        if c.get('real_text'):
            if not c.get('text') or c.get('text') == c.get('real_text'):
                texts_to_translate.add(c['real_text'].strip())

        # Check flavor
        if c.get('flavor') and not c.get('real_flavor'):
            # flavor in cards_vi is sometimes identical to English
            pass

        # Check back_name
        if c.get('real_back_name'):
            if not c.get('back_name') or c.get('back_name') == c.get('real_back_name'):
                names_to_translate.add(c['real_back_name'].strip())
        elif c.get('back_name') and not c.get('real_back_name'):
            # Sometimes back_name exists without real_back_name
            pass

        # Check back_text
        if c.get('real_back_text'):
            if not c.get('back_text') or c.get('back_text') == c.get('real_back_text'):
                texts_to_translate.add(c['real_back_text'].strip())
        elif c.get('back_text') and not c.get('real_back_text'):
            pass

    print(f"Encounter/Scenario cards: {len(encounter_cards)}")
    uncached_names = [n for n in names_to_translate if n not in cache and n not in NAME_GLOSSARY]
    uncached_texts = [t for t in texts_to_translate if t not in cache]
    print(f"Unique names to translate: {len(names_to_translate)} (Uncached: {len(uncached_names)})")
    print(f"Unique texts to translate: {len(texts_to_translate)} (Uncached: {len(uncached_texts)})")

    # 2. Translate uncached names in parallel
    if uncached_names:
        print(f"\n--- Translating {len(uncached_names)} uncached names with 10 workers ---")
        done_count = 0
        with ThreadPoolExecutor(max_workers=10) as executor:
            future_to_name = {executor.submit(translate_name_string, n, cache): n for n in uncached_names}
            for future in as_completed(future_to_name):
                done_count += 1
                if done_count % 100 == 0 or done_count == len(uncached_names):
                    print(f"Names progress: {done_count}/{len(uncached_names)}")
                    save_cache(cache)
        save_cache(cache)
        print("Names translation complete.")

    # 3. Translate uncached texts in parallel
    if uncached_texts:
        print(f"\n--- Translating {len(uncached_texts)} uncached texts with 10 workers ---")
        done_count = 0
        with ThreadPoolExecutor(max_workers=10) as executor:
            future_to_text = {executor.submit(translate_text_string, t, cache): t for t in uncached_texts}
            for future in as_completed(future_to_text):
                done_count += 1
                if done_count % 100 == 0 or done_count == len(uncached_texts):
                    print(f"Texts progress: {done_count}/{len(uncached_texts)}")
                    save_cache(cache)
        save_cache(cache)
        print("Texts translation complete.")

    # 4. Apply translations back to cards array
    print("\nApplying translations to cards array...")
    updated_cards = 0
    for c in encounter_cards:
        changed = False

        # name
        if c.get('real_name') and (not c.get('name') or c.get('name') == c.get('real_name')):
            rn = c['real_name'].strip()
            tr = NAME_GLOSSARY.get(rn) or cache.get(rn)
            if tr:
                c['name'] = tr
                changed = True

        # subname
        if c.get('real_subname') and (not c.get('subname') or c.get('subname') == c.get('real_subname')):
            rs = c['real_subname'].strip()
            tr = NAME_GLOSSARY.get(rs) or cache.get(rs)
            if tr:
                c['subname'] = tr
                changed = True

        # text
        if c.get('real_text') and (not c.get('text') or c.get('text') == c.get('real_text')):
            rt = c['real_text'].strip()
            tr = cache.get(rt)
            if tr:
                c['text'] = tr
                changed = True

        # back_name
        if c.get('real_back_name') and (not c.get('back_name') or c.get('back_name') == c.get('real_back_name')):
            rbn = c['real_back_name'].strip()
            tr = NAME_GLOSSARY.get(rbn) or cache.get(rbn)
            if tr:
                c['back_name'] = tr
                changed = True
        elif c.get('back_name') and not c.get('real_back_name'):
            bn = c['back_name'].strip()
            tr = NAME_GLOSSARY.get(bn) or cache.get(bn)
            if tr and tr != bn:
                c['back_name'] = tr
                changed = True

        # back_text
        if c.get('real_back_text') and (not c.get('back_text') or c.get('back_text') == c.get('real_back_text')):
            rbt = c['real_back_text'].strip()
            tr = cache.get(rbt)
            if tr:
                c['back_text'] = tr
                changed = True
        elif c.get('back_text') and not c.get('real_back_text'):
            bt = c['back_text'].strip()
            tr = cache.get(bt)
            if tr and tr != bt:
                c['back_text'] = tr
                changed = True

        if changed:
            updated_cards += 1

    print(f"Updated {updated_cards} encounter cards in memory.")

    # 5. Write back cards_vi.json
    print(f"Writing updated cards to {CARDS_VI_FILE}...")
    CARDS_VI_FILE.write_text(json.dumps(cards, ensure_ascii=False, indent=2) + "\n", encoding='utf-8')
    print("Write complete!")

if __name__ == "__main__":
    main()
