# Phase 2: Tích hợp code (chỉ frontend) — Obsidian Canyons

Status (2026-11-13): §A, §F/§G (bộ sprite, `ISLAND_FOLDERS`, nền, dọn tranh cũ, skill §1) và test xong; test + `vue-tsc` xanh. Chưa làm: kiểm trên trình duyệt (cần đăng nhập), việt hóa (không thêm chữ mới ở frontend nên chưa cần).

File chính: `frontend/src/arkham/scene-island-sprites.ts`, `frontend/src/arkham/hemlock-overview.ts`. Test mẫu: `frontend/tests/sceneIslandSprites.test.mjs`, `hemlockOverview.test.mjs`, `innsmouthDynamicScenes.test.mjs`.

## A. Bộ sprite `obsidian-canyons`

1. `scene-island-sprites.ts`: thêm bộ `obsidianCanyons` bằng `spriteSet` (xem `pit` quanh dòng 124 và `pallidMask` dòng 172 làm mẫu):
   - faces: `own([...range(11648, 11653), ...range(11655, 11662)])` cộng `'11654': '11653'` (Western Athenaeum dùng chung tranh Eastern; xác nhận bằng so ảnh).
   - `open-sky`: lá `xsky` luôn hiện `open-sky` bất kể `revealed` (thêm vào faces: `{ xsky: 'open-sky' }` và `alwaysFaceUp: ['xsky']`). Kiểm mã thật của lá open sky trong `Location/CardDefs/TheDrownedCity/ObsidianCanyons.hs`; nếu mã khác `xsky` thì đổi.
   - mặt úp: `fallbackBack = 'summit-back'`; `square: new Set(['summit-back'])`, `spot: 'summit-back'`.
   - luôn lật: `11648` (R'lyeh Streets) và `11662` (Glyph Orrery) một mặt.
   - đăng ký `'img/scenes/the-drowned-city/obsidian-canyons': obsidianCanyons` trong `ISLAND_SETS` (dòng 193-203).
2. `hemlock-overview.ts`: thêm hằng `OBSIDIAN_CANYONS_ISLANDS = 'img/scenes/the-drowned-city/obsidian-canyons'` (cạnh `PALLID_MASK_ISLANDS`, dòng 1153), thêm `['11639', OBSIDIAN_CANYONS_ISLANDS]` vào `ISLAND_FOLDERS` (dòng 1155), đổi dòng 80 của `boards` sang `'the-drowned-city/obsidian-canyons-sky'`.
3. XÓA 12 điểm neo `hemlock-overview.ts:797-809` (đầu `// The Drowned City — Scenario 7: Obsidian Canyons`), rồi `grep -n "1164[89]\|1165\|1166[012]" hemlock-overview.ts` để chắc không còn mã nào còn neo.

Lưu ý: thư mục `.../obsidian-canyons/` (sprite) và `obsidian-canyons.webp` (tranh cũ) cùng nằm trong `the-drowned-city/` — trùng tên thư mục/tệp chỉ khác đuôi, không xung đột, nhưng nhớ chuyển tranh cũ khi xong.

## B. Co lưới và hướng

- Kiểm `compactGridLayout` + `foldRowLinks` (`locationGraph.ts`) với lưới 4×3, 5×3, 5×4 và với open sky nằm giữa.
- Open sky không vào được nên không có kết nối đường đi; kiểm `isolatedLocationIds` (`offMapCards.ts`) không đẩy open sky sang vùng off-map. Nếu bị đẩy thì thêm ngoại lệ ở bước này (ghi lại trong phase).
- Ray vàng giữa các lá kề nhau: chỉ vẽ khi thật sự nối (open sky không nối được để đi nhưng vẫn "connected" cho "-1 for each open sky adjacent").

## C. Token trên plate

So card mode với plate: clue (không đặt lên open sky, `H:657-661`), doom, enemy (Star Spawn, spawn trên "farthest location not open sky"), resource. Không có chìa khóa/flood.

## D. Việt hóa

Chuỗi hướng/lựa chọn nằm trong `frontend/src/locales/vi/theDrownedCity/scenarios/` (xác nhận đường dẫn bằng `ls`; chưa kiểm). Dịch câu còn giống hệt `en`; giữ tên location tiếng Anh.

## E. Lớp gió (tùy chọn, tách riêng)

`WEATHER` (`hemlock-overview.ts:1172`) hiện chỉ có `storm-sea`. Thêm kiểu `wind` dùng `wind-streaks.webp` cần sửa type `HemlockOverview['weather']` và `LocationMapCanvas.vue`. Làm sau khi bản bản đồ chạy được; nếu không thì bỏ file `wind-streaks.webp` khỏi danh sách giao.

## F. Test và kiểm tra

1. Test đơn vị: `islandImage` cho từng mã (lật/úp, `11654`→`11653`, `xsky`), `islandSetFiles` đủ file, `hemlockOverview('11639')` trả `islands` đúng và `anchors` rỗng.
2. Chạy:

   ```bash
   cd frontend && node --test tests/hemlockOverview.test.mjs tests/locationGraph.test.mjs tests/sceneIslandSprites.test.mjs tests/innsmouthDynamicScenes.test.mjs tests/offMapCards.test.mjs && npx vue-tsc --noEmit
   ```

3. Trình duyệt (`localhost:8090`, tài khoản của người dùng, ván `SCRATCH…`): ô xuất phát, open sky, sau một lần gió, sau Act 2 và Act 3. Không bấm hộ trong ván thật. Cái nào không tới được thì ghi "chưa xem trên trình duyệt".
4. Đo độ chồng lấn sprite so với ô.

## G. Dọn tranh cũ và tài liệu

- Chuyển `frontend/public/img/scenes/the-drowned-city/obsidian-canyons.webp` vào `img/scenes/archives/` sau khi `grep` không còn chỗ dùng.
- Thêm Obsidian Canyons vào danh sách màn mẫu ở `.agents/skills/arkham-dynamic-grid-scene/SKILL.md` §1.
