# Phase 2: Tích hợp code (chỉ frontend)

Status (2026-11-13): §A–§D, §F xong (bộ `pallidMask`, `ISLAND_FOLDERS`, nền mới, tranh cũ vào `archives/`, 6 nhãn vi, test mới + cập nhật). Test và `vue-tsc` xanh. §E bước 3 (trình duyệt) chưa làm: cần đăng nhập, Act 3 và Return to chưa xem thật.

File chính: `frontend/src/arkham/scene-island-sprites.ts`, `frontend/src/arkham/hemlock-overview.ts`; `LocationMap.vue` / `LocationMapCanvas.vue` chỉ sửa nếu hạ tầng đảo hiện có không đủ. Test mẫu: `frontend/tests/sceneIslandSprites.test.mjs`, `hemlockOverview.test.mjs`, `innsmouthDynamicScenes.test.mjs`.

## A. Bộ sprite `pallid-mask`

1. `scene-island-sprites.ts`: thêm bộ `pallidMask` bằng `spriteSet`:
   - faces: `own([...range(3247, 3257), ...range(52049, 52052)])` (`range()` đệm 5 chữ số nên dùng được cho `52049`).
   - mặt úp: một loại duy nhất, `fallbackBack = 'back'`.
   - luôn lật: không đặc biệt hóa; cờ `revealed` lấy từ state (ô xuất phát đã lật). Kiểm ở bước E.
   - `square: new Set(['back'])`, `spot: 'back'`, không `water`, không `vehicles`.
   - đăng ký `'img/scenes/the-path-to-carcosa/pallid-mask': pallidMask` trong `ISLAND_SETS`.
2. `hemlock-overview.ts`: thêm `PALLID_MASK_ISLANDS` và hai mục `ISLAND_FOLDERS` (`03240`, `52048`). Đổi `boards` của hai mã sang nền mới `the-path-to-carcosa/the-pallid-mask-catacombs`.
3. Không điểm neo cho `03247`–`03257`, `52049`–`52052`: `grep` các mã này trong `hemlock-overview.ts` sau khi đổi nền.

## B. Co lưới và hướng

- `compactGridLayout` và `foldRowLinks` đã xử lý `locationLayout`. Kiểm với layout nở trái/trên (Candlelit Tunnels, Mound of Bones) và lưới co sau Act 3 (lá bị bỏ).
- Catacombs kề nhau theo hàng/cột sẽ ra ray vàng qua `foldRowLinks` nếu là `LocationInRow`; xác nhận nút ↔ và rào cản vẫn đúng trên ván thật.

## C. Token trên plate (skill lỗi #12)

So mọi thứ nằm trên lá ở card mode với plate trên map: clue, doom, resource (ô xuất phát có 1), horror token do Sea of Skulls đặt, enemy (Man in the Pallid Mask, Haruko, Ghoul). Không có chìa khóa, flood, seal.

## D. Việt hóa

Lựa chọn hướng ("above/below/right/left") nằm ở `frontend/src/locales/vi/thePathToCarcosa/scenarios/thePallidMask.json` và bản Return to cùng thư mục (nếu có). So key với `en`, dịch câu còn giống hệt; giữ tên location tiếng Anh, "resource" → "tài nguyên". Nếu không thêm chữ mới ở frontend thì không phải thêm key.

## E. Test và kiểm tra

1. Test đơn vị: `islandImage` cho từng mã lật, mặt úp, hậu tố a/b, mã Return to; `islandSetFiles` đủ file webp (chỉ qua khi đã có ảnh hoặc ảnh tạm); `hemlockOverview('03240')`/`('52048')` trả `islands` đúng và không `anchors`.
2. Chạy:

   ```bash
   cd frontend && node --test tests/hemlockOverview.test.mjs tests/locationGraph.test.mjs tests/sceneIslandSprites.test.mjs tests/innsmouthDynamicScenes.test.mjs tests/offMapCards.test.mjs && npx vue-tsc --noEmit
   ```

3. Trình duyệt (`localhost:8090`, tài khoản của người dùng, pane Browser đang hiện): ván `SCRATCH…`, đối chiếu *Card board* với *Map* (đoạn JS trong skill §5). Xem: ô xuất phát, lá úp, lá vừa lật nở theo từng hướng, Act 3 bỏ lá. Không bấm hộ trong ván thật. Return to và Act 3 nếu không tới được thì ghi "chưa xem trên trình duyệt".
4. Đo chồng lấn `.island` / `.spot` so với kích thước ô.

## F. Dọn tranh cũ và tài liệu

- Chuyển `frontend/public/img/scenes/the-path-to-carcosa/the-pallid-mask.webp` vào `img/scenes/archives/` sau khi `grep` không còn nơi dùng.
- Thêm The Pallid Mask vào danh sách màn mẫu ở `.agents/skills/arkham-dynamic-grid-scene/SKILL.md` §1.
