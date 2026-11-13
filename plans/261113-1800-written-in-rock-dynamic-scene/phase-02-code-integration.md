# Phase 2: Tích hợp code (chỉ frontend) — Written in Rock

Status (2026-11-13): chưa làm. Chờ ảnh Phase 1. Mẫu: `plans/261113-1700-obsidian-canyons-dynamic-scene/phase-02-code-integration.md`, `plans/261113-1605-pallid-mask-dynamic-scene/phase-02-code-integration.md`.

File chính: `frontend/src/arkham/scene-island-sprites.ts`, `frontend/src/arkham/hemlock-overview.ts`. Test mẫu: `frontend/tests/sceneIslandSprites.test.mjs`, `hemlockOverview.test.mjs`.

## A. Bộ sprite `written-in-rock`

1. `scene-island-sprites.ts`: thêm bộ `writtenInRock` bằng `spriteSet` (mẫu `pallidMask`, `spriteSet(own([...]), [], 'back')`):
   - faces: `own([...range(10508, 10516), ...range(10716, 10720)])`.
   - Hang dùng chung: nếu muốn dùng chung file với Lost Sister thì dùng đường `../lost-sister/<tên>` qua `spriteFile()` thay vì copy; nếu copy file thì `own`.
   - Mặt úp: hang → `cavern-back`, rail → `rail-back` (hai mặt úp khác nhau: cần map theo mã chứ không chỉ `fallbackBack`; đọc `spriteSet` xem có hỗ trợ không, nếu không thì thêm tham số, ghi lại).
   - `10508`, `10509` luôn hiện một mặt (`alwaysFaceUp`).
   - `square: new Set()`, `spot: 'cavern-back'`.
   - đăng ký `'img/scenes/hemlock-vale/written-in-rock': writtenInRock` trong `ISLAND_SETS` (~dòng 193-203).
2. `hemlock-overview.ts`:
   - thêm hằng `WRITTEN_IN_ROCK_ISLANDS`, thêm `['10501', WRITTEN_IN_ROCK_ISLANDS]` vào `ISLAND_FOLDERS` (~1155).
   - đổi `boards` cho `10501` sang `'hemlock-vale/written-in-rock-mine'`.
   - **Gỡ early-return `if (scenario === '10501') {...}`** (trả `written-in-rock-descent|maze`, `fixedPassages`, `village: true`). Trước khi gỡ: grep `fixedPassages` và `village` ở `LocationMap.vue`/`LocationMapCanvas.vue` để xem hai cờ này dùng cho gì; giữ hành vi cần thiết (ví dụ `village`).
3. Xe goòng: dùng mô hình `SceneVehicle` (xem `vehicleSprite`, `headingAfterMove`): thêm vehicle `mine-cart.webp` gắn với asset `10507`. `faceRight` chỉ trái/phải: hướng ray dọc là câu hỏi mở.
4. Lớp `rail-arm` (tùy chọn): chỉ làm khi có cách lấy `railIcons` từ state; nếu không thì bỏ khỏi danh sách giao.

## B. Co lưới và hướng

- Kiểm `compactGridLayout`/`foldRowLinks` với hàng 5 ô (Act 1) và khối 5×4 + Rail Exit (Act 2). Rail Exit ngoài khối: kiểm không bị `isolatedLocationIds` ném sang off-map nếu nó vẫn có kết nối.
- Sau trượt/đổi chỗ: sprite phải theo `locationLayout`, không cache ô.
- Kết nối ray theo biểu tượng, không theo ô: kiểm đường nối đứt nét lấy từ `connectedLocations` thật, không suy từ ô kề.
- Vị trí Control Station sau cave-in: chưa kiểm, xem khi test.

## C. Token trên plate

So card mode với plate: clue, doom, enemy, chìa khóa nếu có, mine cart. Thật sự có gì ở đây chưa kiểm.

## D. Việt hóa

Chuỗi liên quan ở `frontend/src/locales/vi/theFeastOfHemlockVale/scenarios/` (xác nhận đường dẫn bằng `ls`; chưa kiểm). Dịch câu còn giống `en`; giữ tên location tiếng Anh.

## E. Test và kiểm tra

1. Test đơn vị: `islandImage` từng mã (mặt úp hang vs rail, `10508`/`10509` luôn lật), `islandSetFiles` đủ file, `hemlockOverview('10501')` trả `islands` đúng, `anchors` rỗng, không còn `fixedPassages`.
2. Chạy:

   ```bash
   cd frontend && node --test tests/hemlockOverview.test.mjs tests/locationGraph.test.mjs tests/sceneIslandSprites.test.mjs tests/innsmouthDynamicScenes.test.mjs tests/offMapCards.test.mjs && npx vue-tsc --noEmit
   ```

3. Trình duyệt (`localhost:8090`, tài khoản của người dùng, ván `SCRATCH…`): Act 1 (hàng 5 ô), sau cave-in (khối rail), sau một lần trượt. Không bấm hộ trong ván thật. Cái nào không tới được ghi "chưa xem trên trình duyệt".
4. Đo độ chồng lấn sprite so với ô; kiểm link chạm vào hình (bài học trim alpha).

## F. Dọn tranh cũ và tài liệu

- Chuyển `written-in-rock-descent.webp`, `written-in-rock-maze.webp` vào `img/scenes/archives/` sau khi `grep` không còn chỗ dùng.
- Thêm Written in Rock vào danh sách màn mẫu ở `.agents/skills/arkham-dynamic-grid-scene/SKILL.md` §1.
