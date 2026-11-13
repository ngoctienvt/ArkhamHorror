# The Longest Night (Feast of Hemlock Vale): Scene Map sprite theo từng địa điểm

Status (2026-11-13): đã điều tra backend, kết luận bỏ tranh tĩnh. **Đã có ảnh, code đã tích hợp (xem phase-02).** Skill: `.agents/skills/arkham-dynamic-grid-scene/SKILL.md`.

`LN` = `backend/arkham-api/library/Arkham/Scenario/Scenarios/TheFeastOfHemlockVale/TheLongestNight.hs`; các đường dẫn khác tính từ `backend/arkham-api/library/Arkham/`.

## Mục tiêu

Bỏ tranh tĩnh `hemlock-vale/longest-night` (`hemlock-overview.ts`, dòng `['10626', ...]` trong `boards`). Thay bằng nền ruộng đêm trống + sprite theo tranh lá thật + hai mặt úp ("Atwood Farm", "Outer Fields"). Không có điểm neo cho màn này (đã grep `hemlock-overview.ts`: chỉ có dòng `boards`).

## Vì sao không giữ tranh tĩnh

Tranh hiện tại vẽ sẵn nhà kho đỏ, chuồng gà, nhà đá, nhà chính, bãi rào cừu theo một bố cục cụm. Backend cho thấy ba điều làm tranh sai luật:

1. **Xáo lá vào ô cố định.** Năm lá Atwood Farm xáo rồi đặt vào năm ô `(-1,0) (-2,0) (1,0) (0,-1) (0,1)` (`LN:234-238`); bốn trong năm lá Outer Fields (bỏ một lá ngẫu nhiên) xáo vào bốn ô `(-3,0) (2,0) (0,-2) (0,2)` (`LN:222-232`, `LN:240-244`). Chỉ The Farmhouse cố định (`Pos 0 0`, `LN:234`). Một ván, Coop có thể đứng ở ô phía bắc; trên tranh tĩnh plate "Coop" sẽ nằm đè lên cái nhà kho vẽ sẵn.
2. **Hình dạng lưới là chữ thập 6 cột × 5 hàng** (x từ -3 đến 2, y từ -2 đến 2), lệch về phía tây, không phải cụm công trình trong tranh. Không điểm neo theo mã lá nào đúng được vì mã lá đổi ô mỗi ván.
3. **Mặt úp.** Lá Atwood Farm vào ván ở mặt "Atwood Farm" (chưa biết là nhà gì) và chỉ lật khi vào (`LN` dùng `locationWithUnrevealed_`, `Location/CardDefs/TheFeastOfHemlockVale/TheLongestNight.hs`). Tranh tĩnh để lộ trước danh tính.

## Bảng luật đã kiểm

| Hạng mục | Luật | Nguồn |
|---|---|---|
| Dùng lưới | `setUsesGrid` | `LN:204` |
| Lưới có lớn/trượt/đổi ô giữa ván không | KHÔNG. Đã đọc act (`Act/Cards/TheFeastOfHemlockVale/TheLongestNight/TheLongestNight.hs`), agenda (`TheOnslaught.hs`) và 11 location (`Location/Cards/TheFeastOfHemlockVale/TheLongestNight/*.hs`): không có `PlaceGrid`, `swapLocation`, `LocationInDirection` hay đổi `Pos`. Chỉ đổi: rào cản, mồi nhử, bẫy, token | các file nêu |
| Ô cố định | The Farmhouse `Pos 0 0`, luôn lật (không có mặt úp) | `LN:234`, CardDef `10630` |
| Ô xáo | Atwood Farm ×5 (Milkhouse `10631`, Vineyard `10632`, Coop `10633`, Barn `10634`, Pasture `10635`) vào 5 ô; Outer Fields (Bloodied Paths `10636`, Desolate Hills `10637`, Blighted Cornfields `10638`, Scorched Knoll `10639`, Rancid Crops `10640`) bỏ 1 lá ngẫu nhiên, 4 lá vào 4 ô | `LN:222-244` |
| Kết nối | `connectsToAdjacent` (kề cạnh lưới) ở cả 11 lá; đường nối khác chỉ là rào cản (meta `Barriers` giữa hai lá kề) | các lá; `Scenarios/.../TheLongestNight/Helpers.hs` (`Meta.barriers`) |
| Rào cản | Nằm giữa hai lá kề, lưu trong `scenario.meta.barriers`; không đổi ô lá. Frontend đã có `barrierCounts` (`scenarioBarriers.ts`) | `LN:556-561` |
| Mặt úp | Atwood Farm: mặt sau của `10631`-`10635` ghi "Atwood Farm". Outer Fields: dữ liệu `cards_en.json` ghi `back_name = None`, tên úp là "Outer Fields" (CardDef `locationWithUnrevealed_ ... "Outer Fields"`) | `cards_en.json`, CardDef |
| Return to | chưa tìm thấy bản Return to của màn Hemlock Vale | CHƯA kiểm |

## Danh sách ảnh (11 sprite + 2 mặt úp + 1 nền)

Chi tiết trong [asset-plan-for-codex.md](asset-plan-for-codex.md): `10630` The Farmhouse; `10631`-`10635` năm Atwood Farm; `10636`-`10640` năm Outer Fields; `farm-back`, `field-back`; nền `hemlock-vale/longest-night-fields.webp`.

## Phases

| # | Phase | Ai làm | File |
|---|---|---|---|
| 1 | Toàn bộ ảnh | Codex (người dùng giao) | [asset-plan-for-codex.md](asset-plan-for-codex.md) |
| 2 | Tích hợp code, test, kiểm trình duyệt, dọn tranh cũ | Claude | [phase-02-code-integration.md](phase-02-code-integration.md) |

## Tiêu chí hoàn thành

- `10626` không còn tranh có công trình vẽ sẵn; tranh cũ vào `archives/`.
- Mỗi lá hiện sprite đúng tranh lá tại ô của nó; lá chưa lật hiện mặt úp; The Farmhouse luôn mặt mở.
- Lưới chữ thập 6×5 hiển thị đúng như card mode; rào cản vẫn hiện trên đường nối.
- Test + `vue-tsc` pass; contact sheet đã duyệt; đã xem trên trình duyệt (`localhost:8090`, tài khoản của người dùng).

## Đã kiểm vs chưa kiểm

Đã kiểm (đọc code): setup, act, agenda, 11 location, helpers; ảnh tĩnh hiện tại (xem trực tiếp).

CHƯA kiểm: `locationLayout` thật trên ván; việc `barrierCounts(scenario.meta)` có đọc đúng dạng JSON của `Map (SortedPair LocationId) Int` của màn này không (In Too Deep dùng cùng kiểu nên khả năng cao đúng); mặt úp Outer Fields trên ảnh lá thật (cần nhìn `10636b`-`10640b`); Return to.

## Rủi ro / câu hỏi mở

1. Ô trong chữ thập 6×5 nhỏ (mỗi cột ~1/6 bề ngang): sprite phải đọc được ở ~120 px. Đo chồng lấn ở bước test.
2. Outer Fields có thể dùng chung một tranh mặt úp; nếu năm mặt sau khác nhau thì cần năm back riêng (xem asset plan mục 4).
3. Rào cản/mồi nhử/bẫy là token trên plate/đường nối, không vẽ vào sprite (nếu vẽ rào vào sprite sẽ lệch số đếm thật).
