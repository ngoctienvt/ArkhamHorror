#!/usr/bin/env python3
"""Comprehensive Normalization and Translation Script for Arkham Horror Vietnamese Cards.
Standardizes syntax, grammar, Arkham terminology, and translates player and encounter card templates.
Applies to frontend/public/cards_vi.json and frontend/homebrew/*/cards_vi.json.
"""

import json
import os
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
PUBLIC_CARDS_VI = ROOT / "frontend" / "public" / "cards_vi.json"
HOMEBREW_AGES = ROOT / "frontend" / "homebrew" / "ages-unwound" / "cards_vi.json"
HOMEBREW_DARK = ROOT / "frontend" / "homebrew" / "dark-matter" / "cards_vi.json"
SLIM_SCRIPT = ROOT / "frontend" / "scripts" / "slim-cards.cjs"

RULES = [
    # 1. Google Translate Glitches
    (r'ở mức địa điểm bình thường', 'tại địa điểm bình thường của nó', 0),
    (r'ở mức địa điểm này', 'tại địa điểm này', 0),
    (r'ở mức địa điểm', 'tại địa điểm', 0),
    (r'được đấu nối với', 'được kết nối với', 0),
    (r'Mặc dù có kẻ địch', 'Trong khi có kẻ địch', 0),
    (r'Nếu không có các kẻ địch nào', 'Nếu không có kẻ địch nào', 0),
    (r'Nếu không có các kẻ địch', 'Nếu không có kẻ địch nào', 0),
    (r'Nếu không có các manh mối', 'Nếu không có manh mối nào', 0),
    (r'Nếu không có các asset', 'Nếu không có asset nào', 0),
    (r'không phải các địa điểm', 'không phải địa điểm', 0),
    (r'vấn đề này', 'địa điểm này', 0),
    (r'Hồi máu (\d+) damage', r'Hồi \1 damage', 0),
    (r'Hồi máu (\d+) horror', r'Hồi \1 horror', 0),
    (r'đặt (\d+) doom vào agenda', r'đặt \1 doom lên agenda', 0),
    (r'đặt (\d+) doom vào', r'đặt \1 doom lên', 0),
    (r'bài kiểm tra kỹ năng', 'bài kiểm tra skill', 0),
    (r'tổn thương thể chất trực tiếp', 'direct damage', 0),
    (r'tổn thương tinh thần trực tiếp', 'direct horror', 0),
    (r'tổn thương thể chất', 'damage', 0),
    (r'tổn thương tinh thần', 'horror', 0),
    (r'sang chấn thể chất', 'physical trauma', 0),
    (r'sang chấn tinh thần', 'mental trauma', 0),
    (r'chưa từ chức sẽ là bị giết', 'chưa resign sẽ bị giết', 0),
    (r'trở thành advance', 'advance', 0),

    # 2. Phases & Terminology
    (r'giai đoạn thần thoại', 'giai đoạn Mythos', re.IGNORECASE),
    (r'giai đoạn điều tra', 'giai đoạn Investigation', re.IGNORECASE),
    (r'giai đoạn kẻ thù', 'giai đoạn Enemy', re.IGNORECASE),
    (r'giai đoạn bảo trì', 'giai đoạn Upkeep', re.IGNORECASE),
    (r'\btừ chức\b', 'resign', re.IGNORECASE),
    (r'\bchương trình nghị sự\b', 'agenda', re.IGNORECASE),
    (r'\bchương trình làm việc\b', 'agenda', re.IGNORECASE),
    (r'\bchương trình\b', 'agenda', re.IGNORECASE),
    (r'\bthua (\d+) hành động\b', r'mất \1 hành động', re.IGNORECASE),

    # 3. Decks & Piles
    (r'chồng bài gặp gỡ bỏ', 'chồng bài encounter bỏ', re.IGNORECASE),
    (r'chồng bài gặp gỡ', 'chồng bài encounter', re.IGNORECASE),
    (r'bộ bài chạm trán', 'chồng bài encounter', re.IGNORECASE),
    (r'chồng bài chạm trán', 'chồng bài encounter', re.IGNORECASE),
    (r'bộ bài encounter', 'chồng bài encounter', re.IGNORECASE),
    (r'chồng bài gặp gỡ', 'chồng bài encounter', re.IGNORECASE),
    (r'bộ bài của bạn', 'chồng bài của bạn', re.IGNORECASE),
    (r'bộ bài của họ', 'chồng bài của họ', re.IGNORECASE),
    (r'bộ bài', 'chồng bài', re.IGNORECASE),
    (r'khu vực chiến thắng', 'khu vực trưng bày thành tích', re.IGNORECASE),
    (r'túi hỗn loạn', 'túi hỗn mang', re.IGNORECASE),
    (r'token hỗn loạn', 'token hỗn mang', re.IGNORECASE),

    # 4. Play Areas
    (r'vào chơi vào threat area của bạn', 'vào threat area của bạn', 0),
    (r'vào chơi trong threat area của bạn', 'vào threat area của bạn', 0),
    (r'vào chơi', 'vào màn chơi', 0),
    (r'khi chơi', 'trong màn chơi', 0),
    (r'rời đi khỏi màn chơi', 'rời khỏi màn chơi', 0),
    (r'rời đi', 'rời khỏi màn chơi', 0),

    # 5. Limits
    (r'\(Limit (\d+) per game\.?\)', r'(Giới hạn \1 lần mỗi ván chơi.)', re.IGNORECASE),
    (r'\(Limit once per game\.?\)', '(Giới hạn 1 lần mỗi ván chơi.)', re.IGNORECASE),
    (r'\(Limit (\d+) per round\.?\)', r'(Giới hạn \1 lần mỗi vòng.)', re.IGNORECASE),
    (r'\(Limit once per round\.?\)', '(Giới hạn 1 lần mỗi vòng.)', re.IGNORECASE),
    (r'\(Limit (\d+) per turn\.?\)', r'(Giới hạn \1 lần mỗi lượt.)', re.IGNORECASE),
    (r'\(Limit once per turn\.?\)', '(Giới hạn 1 lần mỗi lượt.)', re.IGNORECASE),
    (r'\(Group limit once per game\.?\)', '(Giới hạn nhóm 1 lần mỗi ván chơi.)', re.IGNORECASE),
    (r'\(Group limit once per round\.?\)', '(Giới hạn nhóm 1 lần mỗi vòng.)', re.IGNORECASE),
    (r'\(Group limit once per turn\.?\)', '(Giới hạn nhóm 1 lần mỗi lượt.)', re.IGNORECASE),
    (r'\(Giới hạn một lần cho mỗi trò chơi\.?\)', '(Giới hạn 1 lần mỗi ván chơi.)', re.IGNORECASE),
    (r'\(Giới hạn một lần mỗi trò chơi\.?\)', '(Giới hạn 1 lần mỗi ván chơi.)', re.IGNORECASE),
    (r'\(Giới hạn một lần mỗi trò chơi\)', '(Giới hạn 1 lần mỗi ván chơi.)', re.IGNORECASE),
    (r'\(Giới hạn 1 lần mỗi trò chơi\.?\)', '(Giới hạn 1 lần mỗi ván chơi.)', re.IGNORECASE),
    (r'\(Giới hạn nhóm một lần cho mỗi trò chơi\.?\)', '(Giới hạn nhóm 1 lần mỗi ván chơi.)', re.IGNORECASE),
    (r'\(Giới hạn nhóm một lần mỗi trò chơi\.?\)', '(Giới hạn nhóm 1 lần mỗi ván chơi.)', re.IGNORECASE),
    (r'\(Giới hạn một lần mỗi lượt\.?\)', '(Giới hạn 1 lần mỗi lượt.)', re.IGNORECASE),
    (r'\(Giới hạn một lần mỗi vòng\.?\)', '(Giới hạn 1 lần mỗi vòng.)', re.IGNORECASE),
    (r'\(Limit once per test\.\)', '(Giới hạn 1 lần mỗi bài kiểm tra.)', re.IGNORECASE),
    (r'\(Limit once per phase\.\)', '(Giới hạn 1 lần mỗi giai đoạn.)', re.IGNORECASE),
    (r'\(Limit 1 per test\.\)', '(Giới hạn 1 lần mỗi bài kiểm tra.)', re.IGNORECASE),

    # 6. Trait noun ordering
    (r'(\[\[[A-Za-z0-9_\s]+\]\])\s+địa điểm', r'địa điểm \1', 0),
    (r'(\[\[[A-Za-z0-9_\s]+\]\])\s+kẻ địch', r'kẻ địch \1', 0),
    (r'không phải\s+kẻ địch\s+(\[\[[A-Za-z0-9_\s]+\]\])', r'kẻ địch không phải \1', 0),
    (r'kẻ địch không phải\s+(\[\[[A-Za-z0-9_\s]+\]\])\s+kẻ địch', r'kẻ địch không phải \1', 0),
    (r'ready\s+kẻ địch', r'kẻ địch đang ready', 0),
    (r'exhausted\s+kẻ địch', r'kẻ địch đang exhausted', 0),
    (r'hunter\s+kẻ địch', r'kẻ địch hunter', 0),

    # 7. Player Card Templates
    (r'([A-Za-z\s\.\'\"]+) deck only\.', r'Chỉ dành cho bộ bài \1.', 0),
    (r'\bPlay only during your turn\.', 'Chỉ chơi trong lượt của bạn.', re.IGNORECASE),
    (r'\bPlay only if\b', 'Chỉ chơi nếu', re.IGNORECASE),
    (r'\bPlay during any \[fast\] window\.', 'Chơi trong bất kỳ thời điểm [fast] nào.', re.IGNORECASE),
    (r'\bMax 1 committed per skill test\.', 'Tối đa commit 1 lá mỗi bài kiểm tra skill.', re.IGNORECASE),
    (r'\bMax 1 committed per test\.', 'Tối đa commit 1 lá mỗi bài kiểm tra.', re.IGNORECASE),
    (r'\bThis action does not provoke attacks of opportunity\.', 'Hành động này không kích hoạt đòn cơ hội.', re.IGNORECASE),
    (r'\bDoes not provoke attacks of opportunity\.', 'Không kích hoạt đòn cơ hội.', re.IGNORECASE),
    (r'\bThis attack deals \+(\d+) damage\.', r'Đòn tấn công này gây thêm +\1 damage.', re.IGNORECASE),
    (r'\bThis attack deals \+(\d+) damage', r'Đòn tấn công này gây thêm +\1 damage', re.IGNORECASE),
    (r'\bLimit 1 per deck\.', 'Giới hạn 1 lá mỗi bộ bài.', re.IGNORECASE),
    (r'\bLimit 1 per deck', 'Giới hạn 1 lá mỗi bộ bài', re.IGNORECASE),
    (r'\bLimit 1 per investigator\.', 'Giới hạn 1 lá cho mỗi điều tra viên.', re.IGNORECASE),
    (r'\bLimit 1 per investigator', 'Giới hạn 1 lá cho mỗi điều tra viên', re.IGNORECASE),
    (r'\bLimit 1 (\[\[[A-Za-z0-9_\s]+\]\]) per investigator\.', r'Giới hạn 1 \1 cho mỗi điều tra viên.', re.IGNORECASE),
    (r'\bFast\. Play when\b', 'Fast. Chơi khi', re.IGNORECASE),
    (r'\bFast\. Play after\b', 'Fast. Chơi sau khi', re.IGNORECASE),
    (r'\bFast\. Play during\b', 'Fast. Chơi trong', re.IGNORECASE),
    (r'\bAttach to your location\.?', 'Đính kèm vào địa điểm của bạn.', re.IGNORECASE),
    (r'\bAttach to a connecting location\.?', 'Đính kèm vào một địa điểm kết nối.', re.IGNORECASE),
    (r'\bShuffle your deck\.?', 'Xáo trộn lại chồng bài của bạn.', re.IGNORECASE),
    (r'\bSearch the top (\d+) cards of your deck for\b', r'Tìm trong \1 lá bài trên cùng của chồng bài bạn', re.IGNORECASE),
    (r'\bSearch your deck for\b', 'Tìm trong chồng bài của bạn', re.IGNORECASE),
    (r'\badd it to your hand\.?', 'thêm lá bài đó vào tay bạn.', re.IGNORECASE),
    (r'\badd them to your hand\.?', 'thêm các lá bài đó vào tay bạn.', re.IGNORECASE),
    (r'\bDiscover (\d+) manh mối at your location\.?', r'Khám phá \1 manh mối tại địa điểm của bạn.', re.IGNORECASE),
    (r'\bDiscover (\d+) manh mối at a connecting location\.?', r'Khám phá \1 manh mối tại một địa điểm kết nối.', re.IGNORECASE),
    (r'\bDeal \+(\d+) damage for this attack\.?', r'Gây thêm +\1 damage cho đòn tấn công này.', re.IGNORECASE),
    (r'\bYou get \+(\d+) (\[[a-z_]+\]) for this attack\.?', r'Bạn nhận được +\1 \2 cho đòn tấn công này.', re.IGNORECASE),
    (r'\bYou get \+(\d+) (\[[a-z_]+\]) for this skill test\.?', r'Bạn nhận được +\1 \2 cho bài kiểm tra skill này.', re.IGNORECASE),
    (r'\bYou get \+(\d+) (\[[a-z_]+\]) for this test\.?', r'Bạn nhận được +\1 \2 cho bài kiểm tra này.', re.IGNORECASE),
    (r'\bYou get \+(\d+) (\[[a-z_]+\]) for this investigation\.?', r'Bạn nhận được +\1 \2 cho lần điều tra này.', re.IGNORECASE),
    (r'\bYou get \+(\d+) (\[[a-z_]+\])\.?', r'Bạn nhận được +\1 \2.', re.IGNORECASE),
    (r'\bTest (\[[a-z_]+\]) \((\d+)\)\.?', r'Kiểm tra \1 (\2).', re.IGNORECASE),
    (r'\bIf this skill test is successful, draw (\d+) cards?\.?', r'Nếu bài kiểm tra skill này thành công, rút \1 lá bài.', re.IGNORECASE),
    (r'\bIf this test is successful, draw (\d+) cards?\.?', r'Nếu bài kiểm tra này thành công, rút \1 lá bài.', re.IGNORECASE),
    (r'\bIf this skill test is successful,', 'Nếu bài kiểm tra skill này thành công,', re.IGNORECASE),
    (r'\bIf this test is successful,', 'Nếu bài kiểm tra này thành công,', re.IGNORECASE),
    (r'\bIf you succeed by (\d+) or more,', r'Nếu bạn thành công từ \1 điểm trở lên,', re.IGNORECASE),
    (r'\bIf you succeed,', 'Nếu bạn thành công,', re.IGNORECASE),
    (r'\bIf you fail by (\d+) or more,', r'Nếu bạn thất bại từ \1 điểm trở lên,', re.IGNORECASE),
    (r'\bIf you fail,', 'Nếu bạn thất bại,', re.IGNORECASE),
    (r'\bFor each point you fail by,', 'Với mỗi điểm bạn thất bại,', re.IGNORECASE),
    (r'\bFor each point you succeed by,', 'Với mỗi điểm bạn thành công,', re.IGNORECASE),
    (r'\bDraw (\d+) cards? and gain (\d+) resources?\.?', r'Rút \1 lá bài và nhận \2 resource.', re.IGNORECASE),
    (r'\bDraw (\d+) cards?\.?', r'Rút \1 lá bài.', re.IGNORECASE),
    (r'\bGain (\d+) resources?\.?', r'Nhận \1 resource.', re.IGNORECASE),
    (r'\bHeal (\d+) damage from your investigator\.?', r'Hồi \1 damage cho điều tra viên của bạn.', re.IGNORECASE),
    (r'\bHeal (\d+) horror from your investigator\.?', r'Hồi \1 horror cho điều tra viên của bạn.', re.IGNORECASE),
    (r'\bSpend (\d+) ammo:', r'Chi tiêu \1 ammo:', re.IGNORECASE),
    (r'\bSpend (\d+) charges?:', r'Chi tiêu \1 charge:', re.IGNORECASE),
    (r'\bSpend (\d+) secrets?:', r'Chi tiêu \1 secret:', re.IGNORECASE),
    (r'\bSpend (\d+) supplies?:', r'Chi tiêu \1 supply:', re.IGNORECASE),
    (r'\bSpend (\d+) resources?:', r'Chi tiêu \1 resource:', re.IGNORECASE),
    (r'\bTake 1 additional action during your turn\.?', 'Thực hiện thêm 1 hành động trong lượt của bạn.', re.IGNORECASE),
    (r'\bAutomatically evade a non-\[\[Elite\]\] enemy at your location\.?', 'Tự động evade một kẻ địch không phải [[Elite]] tại địa điểm của bạn.', re.IGNORECASE),
    (r'\bAutomatically evade the attacked enemy\.?', 'Tự động evade kẻ địch bị tấn công.', re.IGNORECASE),
    (r'\bCancel that attack\.?', 'Hủy bỏ đòn tấn công đó.', re.IGNORECASE),
    (r'\bCancel that effect\.?', 'Hủy bỏ hiệu ứng đó.', re.IGNORECASE),
    (r'\bUses \((\d+) ammo\)\.?', r'Uses (\1 ammo).', re.IGNORECASE),
    (r'\bUses \((\d+) charges?\)\.?', r'Uses (\1 charge).', re.IGNORECASE),
    (r'\bUses \((\d+) secrets?\)\.?', r'Uses (\1 secret).', re.IGNORECASE),
    (r'\bUses \((\d+) supplies?\)\.?', r'Uses (\1 supply).', re.IGNORECASE),
    (r'\bAfter you successfully investigate:', 'Sau khi bạn điều tra thành công:', re.IGNORECASE),
    (r'\bYour location gets -(\d+) shroud for this investigation\.', r'Địa điểm của bạn nhận -\1 shroud cho lần điều tra này.', re.IGNORECASE),
    (r'\bWhen you would fail a skill test', 'Khi bạn chuẩn bị thất bại một bài kiểm tra skill', re.IGNORECASE),
    (r'\bGet \+(\d+) to your skill value for that test\.', r'Nhận +\1 vào giá trị skill của bạn cho bài kiểm tra đó.', re.IGNORECASE),
    (r'\bWhen an enemy attack deals damage to ([A-Za-z\s\.\'\"]+):', r'Khi một đòn tấn công của kẻ địch gây damage lên \1:', re.IGNORECASE),
    (r'\bDeal (\d+) damage to the attacking enemy\.', r'Gây \1 damage lên kẻ địch đang tấn công.', re.IGNORECASE),
    (r'\bWhen an enemy attacks an investigator at your location', 'Khi một kẻ địch tấn công một điều tra viên tại địa điểm của bạn', re.IGNORECASE),
    (r'\bChoose an investigator at your location\.', 'Chọn một điều tra viên tại địa điểm của bạn.', re.IGNORECASE),
    (r'\bChoose an enemy at your location\.', 'Chọn một kẻ địch tại địa điểm của bạn.', re.IGNORECASE),
    (r'\bHeal (\d+) damage from that investigator\.', r'Hồi \1 damage cho điều tra viên đó.', re.IGNORECASE),
    (r'\bHeal (\d+) horror from that investigator\.', r'Hồi \1 horror cho điều tra viên đó.', re.IGNORECASE),
    (r'\bYou may play the topmost event in your chồng bài bỏ as if it were in your hand\.', 'Bạn có thể chơi lá event trên cùng trong chồng bài bỏ của mình như thể nó đang ở trên tay bạn.', re.IGNORECASE),
    (r'\bPlace it on the bottom of your deck instead of in your discard pile\.', 'Đặt lá bài đó vào đáy chồng bài của bạn thay vì vào chồng bài bỏ.', re.IGNORECASE),
    (r'\bThis evasion attempt uses (\[[a-z_]+\]) instead of (\[[a-z_]+\])\.', r'Lần né tránh này dùng \1 thay vì \2.', re.IGNORECASE),
    (r'\bDeal (\d+) damage to the enemy just evaded\.', r'Gây \1 damage lên kẻ địch vừa bị evade.', re.IGNORECASE),
]

COMPILED_RULES = [(re.compile(p, f), repl) for p, repl, f in RULES]

def clean_text(txt):
    if not txt:
        return txt
    for r, repl in COMPILED_RULES:
        txt = r.sub(repl, txt)
    return txt

def process_file(file_path):
    print(f"Processing {file_path}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        cards = json.load(f)

    updated = 0
    for c in cards:
        t = c.get('text')
        bt = c.get('back_text')
        fl = c.get('flavor')
        bfl = c.get('back_flavor')

        nt = clean_text(t) if t else t
        nbt = clean_text(bt) if bt else bt
        nfl = clean_text(fl) if fl else fl
        nbfl = clean_text(bfl) if bfl else bfl

        if nt != t or nbt != bt or nfl != fl or nbfl != bfl:
            c['text'] = nt
            c['back_text'] = nbt
            c['flavor'] = nfl
            c['back_flavor'] = nbfl
            updated += 1

    tmp = file_path.with_suffix('.tmp')
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(cards, f, ensure_ascii=False, indent=2)
    os.replace(tmp, file_path)
    print(f"Updated {updated}/{len(cards)} cards in {file_path}.")

def main():
    process_file(PUBLIC_CARDS_VI)
    if HOMEBREW_AGES.exists():
        process_file(HOMEBREW_AGES)
    if HOMEBREW_DARK.exists():
        process_file(HOMEBREW_DARK)

    print("Rebuilding slim cards...")
    res = subprocess.run(["node", str(SLIM_SCRIPT)], capture_output=True, text=True)
    if res.returncode != 0:
        print("Slim rebuild error:", res.stderr)
    else:
        print(res.stdout.strip())
        print("Done!")

if __name__ == '__main__':
    main()
