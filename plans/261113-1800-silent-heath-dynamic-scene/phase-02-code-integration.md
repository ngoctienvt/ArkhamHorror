# Phase 2: Tích hợp code (chỉ frontend) — The Silent Heath

Status (2026-11-13): chưa làm. Chờ ảnh Phase 1. Mẫu: `plans/261113-1700-lost-sister-dynamic-scene/phase-02-code-integration.md`, `plans/261113-1700-obsidian-canyons-dynamic-scene/phase-02-code-integration.md`.

File chính: `frontend/src/arkham/scene-island-sprites.ts`, `frontend/src/arkham/hemlock-overview.ts`. Test mẫu: `frontend/tests/sceneIslandSprites.test.mjs`, `hemlockOverview.test.mjs`.

## A. Bộ sprite `silent-heath`

1. `scene-island-sprites.ts`: thêm bộ `silentHeath` bằng `spriteSet` (mẫu `pallidMask`):
   - faces: `own([...range(10555, 10560), ...range(10716, 10720)])` (hang có thể dùng đường `../lost-sister/..` nếu muốn chung file).
   - `fallbackBack = 'cavern-back'`, `square: new Set()`, `spot: 'cavern-back'`.
   - 6 lá `10555`-`10560` luôn ngửa (`alwaysFaceUp`).
   - đăng ký `'img/scenes/hemlock-vale/silent-heath': silentHeath` trong `ISLAND_SETS` (~193-203).
2. `hemlock-overview.ts`: thêm hằng `SILENT_HEATH_ISLANDS`, thêm `['10549', SILENT_HEATH_ISLANDS]` vào `ISLAND_FOLDERS` (~1155), đổi `boards['10549']` sang `'hemlock-vale/silent-heath-snowfield'` (hiện đang trỏ `hemlock-vale/silent-heath`). Grep không còn anchor cho `10555`-`10560`.

## B. Co lưới và hướng

- Kiểm `compactGridLayout`/`foldRowLinks` khi lưới nở theo hướng bất kỳ (lair đặt vào ô trống kề); không có lưới cố định.
- Kiểm không location nào bị `isolatedLocationIds` ném sang off-map.
- Kết nối theo ô kề (`connectsToAdjacent`): đường nối đứt nét lấy từ `connectedLocations`.

## C. Token trên plate

So card mode với plate: clue, doom, enemy (côn trùng pha lê), resource. Thật sự có gì chưa kiểm.

## D. Việt hóa

`frontend/src/locales/vi/theFeastOfHemlockVale/scenarios/theSilentHeath.json` (xác nhận bằng `ls`; chưa kiểm). Dịch câu còn giống `en`; giữ tên location tiếng Anh.

## E. Test và kiểm tra

1. Test đơn vị: `islandImage` từng mã (hang úp → `cavern-back`, lật → đúng tranh), `islandSetFiles` đủ file, `hemlockOverview('10549')` trả `islands`, `anchors` rỗng.
2. Chạy:

   ```bash
   cd frontend && node --test tests/hemlockOverview.test.mjs tests/locationGraph.test.mjs tests/sceneIslandSprites.test.mjs tests/innsmouthDynamicScenes.test.mjs tests/offMapCards.test.mjs && npx vue-tsc --noEmit
   ```

3. Trình duyệt (`localhost:8090`, tài khoản của người dùng, ván `SCRATCH…`): ô xuất phát, sau khi Act 1 tiến (3 hang úp), sau khi lật một hang, sau khi lair đặt. Không bấm hộ trong ván thật. Cái nào không tới được ghi "chưa xem trên trình duyệt".
4. Đo độ chồng lấn; kiểm link chạm vào hình (trim alpha).

## F. Dọn tranh cũ và tài liệu

- Chuyển `hemlock-vale/silent-heath.webp` vào `img/scenes/archives/` sau khi `grep` không còn chỗ dùng.
- Thêm Silent Heath vào danh sách màn mẫu ở `.agents/skills/arkham-dynamic-grid-scene/SKILL.md` §1.
