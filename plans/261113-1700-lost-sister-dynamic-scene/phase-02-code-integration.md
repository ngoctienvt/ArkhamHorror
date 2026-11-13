# Phase 2: Tích hợp code (chỉ frontend) — The Lost Sister

Status (2026-11-13): §A, §F/§G (bộ sprite, `ISLAND_FOLDERS`, nền, dọn tranh cũ, skill §1) và test xong; test + `vue-tsc` xanh. Chưa làm: kiểm trên trình duyệt (cần đăng nhập), việt hóa (không thêm chữ mới ở frontend nên chưa cần).

File chính: `frontend/src/arkham/scene-island-sprites.ts`, `frontend/src/arkham/hemlock-overview.ts`.

## A. Bộ sprite `lost-sister`

1. `scene-island-sprites.ts`: thêm bộ `lostSister` bằng `spriteSet` (mẫu `pit` dòng ~124, `pallidMask` dòng 172):
   - faces: `own([...range(10575, 10582), ...range(10716, 10720)])`.
   - mặt úp: `fallbackBack = 'back'`; `square: new Set(['back'])`, `spot: 'back'`.
   - luôn lật: `['10575']` (Akwan); `10582` Fungal Cave đặt ở act nên cũng nên luôn lật nếu thấy trên map bị úp (xem E.3).
   - đăng ký `'img/scenes/hemlock-vale/lost-sister': lostSister` trong `ISLAND_SETS` (dòng 193-203).
2. `hemlock-overview.ts`: thêm hằng `LOST_SISTER_ISLANDS = 'img/scenes/hemlock-vale/lost-sister'` (cạnh `PALLID_MASK_ISLANDS`, dòng 1153), `['10569', LOST_SISTER_ISLANDS]` vào `ISLAND_FOLDERS` (dòng 1155), đổi dòng 37 của `boards` sang `'hemlock-vale/lost-sister-caverns'`.
3. Không có điểm neo để xóa. `grep -n "10575\|10576\|10577\|10578\|10579\|10580\|10581\|10582\|1071[6-9]\|10720" hemlock-overview.ts` để chắc.

Lưu ý: tên thư mục sprite `lost-sister/` và tranh cũ `lost-sister.webp` cùng nằm trong `hemlock-vale/`, khác đuôi nên không xung đột.

## B. Co lưới và hướng

- Lưới chỉ nở, tọa độ có thể âm (`Pos (-1) 0`, `Pos 0 (-1)`). Kiểm `compactGridLayout`/`foldRowLinks` (`locationGraph.ts`) với lưới lệch.
- Ray vàng/rào cản chỉ giữa các hang kề nhau; xác nhận kết nối thật (chưa kiểm).

## C. Token trên plate

Clue (Act 1 dùng "clue cuối của location"), doom, enemy (Crustacean/Limulus Hybrid Light/Dark, Cavern Moss), horror trên Suspended Graveyard, Helen/Theo (nếu có). So card mode.

## D. Việt hóa

`frontend/src/locales/vi/theFeastOfHemlockVale/scenarios/` (xác nhận đường dẫn thật bằng `ls`; chưa kiểm). Câu lựa chọn ô ("chọn vị trí đặt lá") nếu còn y hệt `en` thì dịch.

## E. Test và kiểm tra

1. Test đơn vị: `islandImage` cho từng mã, mặt úp, `islandSetFiles` đủ file; `hemlockOverview('10569')` trả `islands` đúng, `anchors` rỗng.
2. Chạy:

   ```bash
   cd frontend && node --test tests/hemlockOverview.test.mjs tests/locationGraph.test.mjs tests/sceneIslandSprites.test.mjs tests/innsmouthDynamicScenes.test.mjs tests/offMapCards.test.mjs && npx vue-tsc --noEmit
   ```

3. Trình duyệt (`localhost:8090`, tài khoản của người dùng, ván `SCRATCH…`): Akwan + 3 hang đầu; sau khi đặt thêm hang; Fungal Cave xuất hiện ở Act 1B (xem nó lật/úp thế nào). Không bấm hộ trong ván thật.
4. Đo chồng lấn sprite khi lưới lớn.

## F. Dọn tranh cũ và tài liệu

- Chuyển `frontend/public/img/scenes/hemlock-vale/lost-sister.webp` vào `img/scenes/archives/lost-sister-static-board.webp` (tên đó vì `archives/lost-sister.webp` đã có bản cũ khác) sau khi `grep` không còn chỗ dùng.
- Thêm The Lost Sister vào danh sách màn mẫu ở `.agents/skills/arkham-dynamic-grid-scene/SKILL.md` §1.
