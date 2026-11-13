# Phase 2: Tích hợp code (chỉ frontend) — Without a Trace

Status (2026-11-13): chưa làm. Chờ ảnh Phase 1. Mẫu: `plans/261113-1700-obsidian-canyons-dynamic-scene/phase-02-code-integration.md`.

File chính: `frontend/src/arkham/scene-island-sprites.ts`, `frontend/src/arkham/hemlock-overview.ts`, `frontend/src/arkham/components/LocationMap.vue`, `frontend/src/arkham/concealedCards.ts`, `frontend/src/arkham/offMapCards.ts`. Test mẫu: `sceneIslandSprites.test.mjs`, `hemlockOverview.test.mjs`, `offMapCards.test.mjs`.

## A. Bộ sprite `without-a-trace`

1. `scene-island-sprites.ts`: thêm bộ `withoutATrace` bằng `spriteSet`:
   - faces: `own([...])` cho `09688`, `09689`, `09747`-`09750`. Mã A/B/C: `baseCode()` đã bỏ hậu tố a/b/c của mã 5 chữ số, nên `09747a/b/c` → `09747` (xác nhận bằng test, đừng giả định).
   - `fallbackBack = 'remnants-back'`, `square: new Set()`, `spot: 'remnants-back'`; `09688` luôn ngửa.
   - đăng ký `'img/scenes/the-scarlet-keys/without-a-trace': withoutATrace` trong `ISLAND_SETS` (~193-203).
2. `hemlock-overview.ts`: thêm hằng, thêm `['09681', ...]` vào `ISLAND_FOLDERS` (~1155), đổi `boards['09681']` sang `'the-scarlet-keys/without-a-trace-otherworld'`. Grep không còn anchor cho mã location của màn này (đã kiểm: không có).

## B. Co lưới và mini-card (rủi ro chính)

- Xem `LocationMap.vue` computed `layout` (`keep` = location + ô lựa chọn → `compactGridLayout`) và `concealedSpots` (`gridConcealedGroups`, `gridPositions(layout)`; ô không có cell → dải dưới).
- Kiểm trên ván thật: ô concealed-only có xuất hiện trong `locationLayout` không. Nếu không, khi lộ mini-card và City được đặt vào, khung lưới có thể đổi (nhảy). Nếu xảy ra: thêm ô concealed vào `keep` (có test), ghi lại trong phase này.
- Kiểm cách City of Remnants chưa lộ ("in the shadows") hiển thị trong nhóm off-map `shadows` (`offMapCards.ts: at('shadows')`) và không bị đặt vào lưới.
- Kết nối theo ô kề (`connectsToAdjacent`): đường nối lấy từ `connectedLocations`.

## C. Token trên plate

So card mode với plate: clue, doom, enemy, concealed mini-card. Thật sự có gì chưa kiểm.

## D. Việt hóa

`frontend/src/locales/vi/theScarletKeys/scenarios/withoutATrace.json` (xác nhận bằng `ls`; chưa kiểm). Dịch câu còn giống `en`; giữ tên location tiếng Anh.

## E. Test và kiểm tra

1. Test đơn vị: `islandImage` cho từng mã (kể cả A/B/C), `islandSetFiles` đủ file, `hemlockOverview('09681')` trả `islands`, `anchors` rỗng.
2. Chạy:

   ```bash
   cd frontend && node --test tests/hemlockOverview.test.mjs tests/locationGraph.test.mjs tests/sceneIslandSprites.test.mjs tests/innsmouthDynamicScenes.test.mjs tests/offMapCards.test.mjs && npx vue-tsc --noEmit
   ```

3. Trình duyệt (`localhost:8090`, tài khoản của người dùng, ván `SCRATCH…`): ô xuất phát, sau khi lộ một mini-card, sau nhiều lần lộ. Không bấm hộ trong ván thật. Cái nào không tới được ghi "chưa xem trên trình duyệt".
4. Đo độ chồng lấn; kiểm link chạm vào hình (trim alpha).

## F. Dọn tranh cũ và tài liệu

- Chuyển `the-scarlet-keys/without-a-trace.webp` vào `img/scenes/archives/` sau khi `grep` không còn chỗ dùng.
- Thêm Without a Trace vào danh sách màn mẫu ở `.agents/skills/arkham-dynamic-grid-scene/SKILL.md` §1.
- Nếu Congress of the Keys làm trước, dùng chung sprite `09747`-`09750` và `remnants-back`.
