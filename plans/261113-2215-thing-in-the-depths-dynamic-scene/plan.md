# The Thing in the Depths (Feast of Hemlock Vale): Scene Map sprite theo từng địa điểm

Status (2026-11-13): đã có ảnh (Codex) và đã tích hợp code (bộ `thingInTheDepths`, `baseCode` giữ hậu tố `b` của Open Water, nền `thing-in-the-depths-swamp`); điểm neo và lớp `.open-water` tạm đã bỏ, tranh tĩnh cũ vào `archives/`. Còn lại: xem trên trình duyệt. Skill: `.agents/skills/arkham-dynamic-grid-scene/SKILL.md`. Mã màn: `10588`.

`TD` = `backend/arkham-api/library/Arkham/Scenario/Scenarios/TheFeastOfHemlockVale/TheThingInTheDepths.hs`; `CD` = `backend/arkham-api/library/Arkham/Location/CardDefs/TheFeastOfHemlockVale/TheThingInTheDepths.hs`.

## Vì sao bỏ tranh tĩnh

1. Mỗi lá có hai mặt: đất (Bog) và nước hở (Open Water, trait Sunken). Lá bị `swapLocation` lật tại chỗ, giữ nguyên ô (các file `Location/Cards/TheFeastOfHemlockVale/TheThingInTheDepths/*.hs`). Tranh tĩnh không đổi hình được: bến tàu vẫn nằm đó khi lá đã chìm.
2. Lá nào vào ô nào là ngẫu nhiên: `bogLocations` được xáo rồi `zip` với 9 ô (`TD` đoạn `gridPositions`). Ba ô có tên (Bắc Shore `(1,1)`, ô xuất phát `(-1,-1)`, Cranberry Bog `(1,-1)`) là vị trí cố định, nhưng chúng là nhãn UI, không phải lá. Cảnh vẽ sẵn (trại, bến, bãi đỏ) vì thế không gắn được với lá nào.
3. Ảnh thực tế của người dùng cho thấy một lá xuất hiện nhiều lần (Lối Đi Ngập, Đầm Bùn), tức bộ gặp gỡ có bản sao. Chưa đếm số bản sao trong dữ liệu.

## Bảng luật

| Hạng mục | Luật | Nguồn |
|---|---|---|
| Dùng lưới | `setUsesGrid`, 3×3 cố định, không nở/trượt | `TD` |
| Mặt lá | 7 lá Bog `10593a`-`10599a` (Muddy Fen, Tangled Thicket, Fetid Pool, Flooded Path, Abandoned Shack, Rotten Dock, Covered Bridge) | `CD` |
| Mặt chìm | 7 Open Water `10593b`-`10599b`, lật tại ô cũ qua `swapLocation` | `CD`, các file lá |
| Mặt úp | KHÔNG có: `location_` thường, không `locationWithUnrevealed_`. Mọi lá luôn hiện tranh | `CD` |
| Kết nối | `connectsToAdjacent` | các file lá |
| Ô có tên | Bắc Shore (1,1) có Judith/River; xuất phát (-1,-1); Cranberry Bog (1,-1) cho điểm Codex | `TD` |

## Mục tiêu

Nền đầm lầy trống + 14 sprite (7 đất, 7 nước hở). Sprite đổi ngay khi lá lật; không cần lớp nước phủ nữa. Bỏ tranh tĩnh `hemlock-vale/thing-in-the-depths` và điểm neo tạm.

## Điểm khó cần xử lý trong code (phase 2)

`baseCode()` ở `scene-island-sprites.ts:28-30` cắt hậu tố `a/b/c` của mã lá, nên `10593a` và `10593b` đều thành `10593`, và sprite không phân biệt được đất với nước. Cần một cách riêng: để bộ này nhận mã còn hậu tố, hoặc thêm trường vào `IslandSet`. Chọn cách ít ảnh hưởng nhất tới các bộ khác; `tests/sceneIslandSprites.test.mjs` bảo vệ chúng.

## Phases

| # | Phase | Ai làm | File |
|---|---|---|---|
| 1 | Toàn bộ ảnh (14 sprite + nền) | Codex | [asset-plan-for-codex.md](asset-plan-for-codex.md) |
| 2 | Tích hợp code, test, kiểm trình duyệt, dọn | Claude | [phase-02-code-integration.md](phase-02-code-integration.md) |

## Tiêu chí hoàn thành

- `10588` dùng `islands`; không còn tranh tĩnh hay điểm neo `thing-in-the-depths`; lớp `.open-water` bị bỏ.
- Mỗi ô hiện đúng sprite đất; lá lật hiện đúng sprite nước hở của chính lá đó.
- Test + `vue-tsc` pass, contact sheet duyệt, đã xem trên `localhost:8090` (tài khoản người dùng).

## Đã kiểm thêm (2026-11-13)

- Số bản sao (`cards_en.json`): Muddy Fen `10593` ×2, Fetid Pool `10595` ×2, Flooded Path `10596` ×2, bốn lá còn lại ×1 = 10 lá; `bogLocations` bỏ 1 lá rồi xếp vào 9 ô (`TD`). Mỗi ván có 9 lá, ba mã có thể xuất hiện hai lần, và mỗi mặt `b` cũng có số bản sao tương ứng.
- Mỗi lá `a` và `b` là hai thẻ riêng (`double_sided: false`), nên mặt chìm là một lá khác, ghép đôi qua `otherSideIs`.
- `swapLocation` giữ `locationRevealed` cũ, token, nhãn ô, vị trí, kết nối và mức lụt (`Game/Runner.hs:1582-1599`). Lá lật sang Open Water vẫn có `revealed` như trước. Vì mọi lá luôn ngửa (không có mặt úp), điều này không ảnh hưởng sprite.
- Agenda 1 (Sinking Ground, `10589`) lật ô giữa sang mặt chìm: ô `(0,0)` luôn là Open Water đầu tiên (`cards_en.json`, `back_text`).
- Không có Return to của màn này: `cards_en.json` không có thẻ "Return to the Feast of Hemlock Vale".

## CHƯA kiểm

Tranh thật của mặt `b` từng lá (cần xem ảnh thẻ `10593b`-`10599b`); `locationLayout` thật trên ván.

## Rủi ro / câu hỏi mở

1. Ba mã có thể hiện hai lần trong một ván: hai ô cùng sprite. Chấp nhận được nếu sprite đủ rõ.
2. Nền phải đủ trống để không đè sprite.
3. Trại, bến, bãi đỏ là nhãn vị trí; chỉ hiện bằng nhãn UI, không vẽ vào nền.

