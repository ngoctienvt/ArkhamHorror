# Phase 2: Tích hợp code (chỉ frontend) — The Longest Night

Status (2026-11-13): đã có ảnh và đã tích hợp code (sprite set `longestNight`, `LONGEST_NIGHT_ISLANDS`, nền `longest-night-fields`); tranh tĩnh cũ đã chuyển vào `archives/`. Còn lại: kiểm trình duyệt, Việt hóa, đo chồng lấn 6x5.

File chính: `frontend/src/arkham/scene-island-sprites.ts`, `frontend/src/arkham/hemlock-overview.ts`.

## A. Bộ sprite `longest-night`

1. `scene-island-sprites.ts`: thêm bộ `longestNight` bằng `spriteSet` (mẫu `lostSister`/`pallidMask`):
   - faces: `own(range(10630, 10640))` (`range` đệm 5 chữ số, mã lá là `10630`…`10640`).
   - mặt úp theo loại lá: `[range(10631, 10635), 'farm-back']`, fallback `'field-back'` (Outer Fields `10636`-`10640` mặc định úp).
   - luôn lật: `['10630']` (The Farmhouse không có mặt úp).
   - `square: new Set()` (hai back là 3:2 như mặt lật), `spot: 'field-back'`.
   - đăng ký `'img/scenes/hemlock-vale/longest-night': longestNight` trong `ISLAND_SETS`.
2. `hemlock-overview.ts`: thêm hằng `LONGEST_NIGHT_ISLANDS = 'img/scenes/hemlock-vale/longest-night'` cạnh `SILENT_HEATH_ISLANDS`, `['10626', LONGEST_NIGHT_ISLANDS]` vào `ISLAND_FOLDERS`, đổi dòng `['10626', 'hemlock-vale/longest-night']` trong `boards` sang `'hemlock-vale/longest-night-fields'`.
3. Không có điểm neo để xóa; `grep -n "1063[0-9]\|10640" hemlock-overview.ts` để chắc.

Lưu ý: thư mục sprite `longest-night/` và tranh cũ `longest-night.webp` cùng nằm trong `hemlock-vale/`, khác đuôi nên không xung đột.

## B. Lưới và đường nối

- Lưới cố định chữ thập, không nở (xem plan.md). `compactGridLayout` giữ hàng/cột có lá: 6 cột × 5 hàng, ô nhỏ. Đo chồng lấn sprite (`.island`) với kích thước ô.
- Đường nối là kề cạnh lưới; ô rỗng ở góc chữ thập không có lá nên không vẽ.
- Hàng 3 lá liền nhau (Outer Fields – Atwood – Farmhouse – Atwood – Atwood – Outer Fields trên trục x) có thể bị `foldRowLinks` gộp thành ray vàng khi các khe hai chiều và không rào cản; xem trên map có đẹp không (ray dừng nơi có rào cản, khe có rào vẫn giữ nút barricade).

## C. Rào cản, mồi nhử, bẫy (token trên plate / đường nối)

- Kiểm `barrierCounts(scenario.meta)` đọc đúng JSON của `Meta.barriers :: Map (SortedPair LocationId) Int` (`Scenarios/TheFeastOfHemlockVale/TheLongestNight/Helpers.hs`): khóa kiểu `"idA--idB"`. Đây là chỗ chưa kiểm (In Too Deep dùng cùng kiểu nên khả năng cao đúng).
- Decoy = token horror, trap = token damage trên lá (`placeTokens … Horror/Damage`). So card mode với plate trên map: hai loại token này có hiện không.

## D. Việt hóa

`frontend/src/locales/vi/theFeastOfHemlockVale/scenarios/` (xác nhận đường dẫn thật bằng `ls`). Các câu "placeDecoy/placeTrap/placeBarrier" nếu còn y hệt `en` thì dịch.

## E. Test và kiểm tra

1. Test đơn vị: `islandImage` cho từng mã, mặt úp (`10631`-`10635` úp → `farm-back`; `10636`-`10640` úp → `field-back`; `10630` luôn lật), `islandSetFiles` đủ file; `hemlockOverview('10626')` trả `islands` đúng, `anchors` rỗng, `image` là nền mới. Thêm vào `tests/obsidianHemlockDynamicScenes.test.mjs` hoặc `tests/sceneIslandSprites.test.mjs` theo mẫu có sẵn.
2. Chạy:

   ```bash
   cd frontend && node --test tests/hemlockOverview.test.mjs tests/locationGraph.test.mjs tests/sceneIslandSprites.test.mjs tests/innsmouthDynamicScenes.test.mjs tests/offMapCards.test.mjs && npx vue-tsc --noEmit
   ```

3. Trình duyệt (`localhost:8090`, tài khoản của người dùng, ván `SCRATCH…`): đủ 10 lá chữ thập; lá Atwood Farm úp rồi lật khi bước vào; rào cản hiện trên đường nối. Không bấm hộ trong ván thật.

## F. Dọn tranh cũ và tài liệu

- Chuyển `frontend/public/img/scenes/hemlock-vale/longest-night.webp` vào `img/scenes/archives/longest-night-static-board.webp` sau khi `grep` không còn chỗ dùng (kể cả `tests/hemlockOverview.test.mjs` dòng `'10626': 'longest-night'`: đổi sang tên nền mới).
- Thêm The Longest Night vào danh sách màn mẫu ở `.agents/skills/arkham-dynamic-grid-scene/SKILL.md` §1.
