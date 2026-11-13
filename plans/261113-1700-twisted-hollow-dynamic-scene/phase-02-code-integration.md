# Phase 2: Tích hợp code (chỉ frontend) — The Twisted Hollow

Status (2026-11-13): §A, §F/§G (bộ sprite, `ISLAND_FOLDERS`, nền, dọn tranh cũ, skill §1) và test xong; test + `vue-tsc` xanh. Chưa làm: kiểm trên trình duyệt (cần đăng nhập), việt hóa (không thêm chữ mới ở frontend nên chưa cần).

File chính: `frontend/src/arkham/scene-island-sprites.ts`, `frontend/src/arkham/hemlock-overview.ts`.

## A. Bộ sprite `twisted-hollow`

1. `scene-island-sprites.ts`: thêm bộ `twistedHollow` bằng `spriteSet` (mẫu `pit` ~dòng 124, `pallidMask` dòng 172):
   - faces: `own(range(10612, 10621))`.
   - mặt úp: `fallbackBack = 'back'`; `square: new Set(['back'])`, `spot: 'back'`.
   - luôn lật: không cố định; cờ `revealed` lấy từ state (lá lật rồi úp lại phải trở về `back`).
   - đăng ký `'img/scenes/hemlock-vale/twisted-hollow': twistedHollow` trong `ISLAND_SETS` (dòng 193-203).
2. `hemlock-overview.ts`: thêm hằng `TWISTED_HOLLOW_ISLANDS = 'img/scenes/hemlock-vale/twisted-hollow'` (cạnh `PALLID_MASK_ISLANDS`, dòng 1153), `['10605', TWISTED_HOLLOW_ISLANDS]` vào `ISLAND_FOLDERS` (dòng 1155), đổi dòng 39 của `boards` sang `'hemlock-vale/twisted-hollow-woods'`.
3. Không có điểm neo để xóa. `grep -n "1061[2-9]\|10620\|10621" hemlock-overview.ts` để chắc.

Lưu ý: thư mục sprite `twisted-hollow/` và tranh cũ `twisted-hollow.webp` khác đuôi nên không xung đột.

## B. Co lưới và hướng

- Hướng: backend đặt "Bắc" ở `Pos 0 (-1)` (`TH:208`), so với card mode; nếu card mode vẽ Bắc ở trên thì frontend đã lật trục, sprite chỉ việc theo `locationLayout`. Kiểm bằng đoạn JS đối chiếu card mode/map trong skill §5.
- Act 2 dựng lưới 5×4 một lần (`WB:69-86`): kiểm `compactGridLayout` với hàng thưa (hàng 0 chỉ có 3 ô: hai bên + Hollow, hàng 2 chỉ 1 ô).
- Ray vàng/rào cản chỉ ở lá kề nhau; Crooked Path/Where's Bertie dùng "kết nối với lá úp" (`CrookedPath.hs:31-38`): xác nhận ray/nút hiển thị đúng với lá úp.

## C. Token trên plate

Darkness Level (trên scenario, không trên lá), clue, doom, enemy (Stalking Hybrid, Ursine Hybrid, Bertie). Lá úp có token không? so card mode.

## D. Việt hóa

`frontend/src/locales/vi/theFeastOfHemlockVale/scenarios/` (xác nhận đường dẫn bằng `ls`; chưa kiểm). Dịch câu còn y hệt `en`.

## E. Test và kiểm tra

1. Test đơn vị: `islandImage` cho từng mã, lật và úp lại, `islandSetFiles` đủ file; `hemlockOverview('10605')` trả `islands` đúng, `anchors` rỗng.
2. Chạy:

   ```bash
   cd frontend && node --test tests/hemlockOverview.test.mjs tests/locationGraph.test.mjs tests/sceneIslandSprites.test.mjs tests/innsmouthDynamicScenes.test.mjs tests/offMapCards.test.mjs && npx vue-tsc --noEmit
   ```

3. Trình duyệt (`localhost:8090`, tài khoản của người dùng, ván `SCRATCH…`): ô xuất phát + 4 lá, lật một lá và xem 4 lá kề xuất hiện, sau Deepening Dark (lá lật úp lại), sau Act 2 (lưới 5×4). Không bấm hộ trong ván thật; cái nào không tới được ghi "chưa xem trên trình duyệt".
4. Đo chồng lấn sprite.

## F. Dọn tranh cũ và tài liệu

- Chuyển `frontend/public/img/scenes/hemlock-vale/twisted-hollow.webp` vào `img/scenes/archives/twisted-hollow-static-board.webp` (`archives/twisted-hollow.webp` đã có bản khác) sau khi `grep` không còn chỗ dùng.
- Thêm The Twisted Hollow vào danh sách màn mẫu ở `.agents/skills/arkham-dynamic-grid-scene/SKILL.md` §1.
