# Phase 2: Tích hợp code (chỉ frontend) — Congress of the Keys

Status (2026-11-13): chưa làm. Chờ ảnh Phase 1. Mẫu: `plans/261113-1700-obsidian-canyons-dynamic-scene/phase-02-code-integration.md`, và phase 2 của Without a Trace (cùng bẫy mini-card).

File chính: `frontend/src/arkham/scene-island-sprites.ts`, `frontend/src/arkham/hemlock-overview.ts`, `frontend/src/arkham/components/LocationMap.vue`, `frontend/src/arkham/concealedCards.ts`, `frontend/src/arkham/offMapCards.ts`.

## A. Bộ sprite `congress-of-the-keys`

1. `scene-island-sprites.ts`: thêm bộ `congressOfTheKeys` bằng `spriteSet`:
   - faces: `own([...])` cho `09704`, `09706`, `09708`, `09710`, `09712`-`09714`, `09747`-`09750`; thêm ánh xạ Lair → Sanctum: `'09705': '09704'`, `'09707': '09706'`, `'09709': '09708'`, `'09711': '09710'` (nếu `baseCode`/`own` không tự gộp; xác nhận bằng test).
   - Hai mặt úp khác nhau: Sanctuary (`09706`, `09708`, `09710` + Lair) → `sanctuary-back`; City (`09747`-`09750`) → `remnants-back`. Đọc `spriteSet` xem có map mặt úp theo mã không; nếu chỉ có `fallbackBack` thì thêm tham số, ghi lại.
   - `09704`, `09712` luôn ngửa; `09713`, `09714` một sprite cho cả hai mặt.
   - đăng ký `'img/scenes/the-scarlet-keys/congress-of-the-keys': congressOfTheKeys` trong `ISLAND_SETS` (~193-203).
2. `hemlock-overview.ts`: thêm hằng, `['09694', ...]` vào `ISLAND_FOLDERS` (~1155).
3. Hai nền: `boards['09694']` hiện chỉ một ảnh. Cần chọn `congress-halls` (Act 1) vs `congress-otherworld` (Act 2-4). Điều kiện chuyển: chưa kiểm; đề xuất: có `The Knotted Tower` (`09712`) trong state hoặc mã act. Đọc cách `hemlockOverview` nhận state trước khi thiết kế; nếu chỉ nhận mã màn thì cần thêm tham số (việc code, ghi rõ).

## B. Co lưới, hướng, mini-card

- Xem `LocationMap.vue`: `layout` (`compactGridLayout(rows, keep)`), `concealedSpots` (ô không có cell → dải dưới). Xác nhận ô concealed-only có vào `locationLayout`; nếu không, thêm vào `keep` (có test).
- Kiểm Act 1: bố cục chuỗi hay lưới; sanctuary đổi thứ tự có theo `locationLayout` không.
- Kết nối: chỉ `TheKnottedTower` theo ô kề; còn lại theo biểu tượng in: đường nối lấy từ `connectedLocations`, đừng suy từ ô.
- Kiểm City chưa lộ ở nhóm off-map `shadows` (`offMapCards.ts`), không lọt vào lưới.

## C. Token trên plate

So card mode với plate: clue, doom, enemy, concealed mini-card, chìa Scarlet nếu có. Thật sự có gì chưa kiểm.

## D. Việt hóa

`frontend/src/locales/vi/theScarletKeys/scenarios/congressOfTheKeys.json` (xác nhận bằng `ls`; chưa kiểm). Dịch câu còn giống `en`; giữ tên location tiếng Anh.

## E. Test và kiểm tra

1. Test đơn vị: `islandImage` mọi mã (kể cả Lair→Sanctum, A/B/C), mặt úp Sanctuary vs City, `islandSetFiles` đủ file, `hemlockOverview('09694')` trả `islands` + nền đúng theo pha, `anchors` rỗng.
2. Chạy:

   ```bash
   cd frontend && node --test tests/hemlockOverview.test.mjs tests/locationGraph.test.mjs tests/sceneIslandSprites.test.mjs tests/innsmouthDynamicScenes.test.mjs tests/offMapCards.test.mjs && npx vue-tsc --noEmit
   ```

3. Trình duyệt (`localhost:8090`, tài khoản của người dùng, ván `SCRATCH…`): Act 1 (thứ tự sanctuary), sau khi sang tháp, sau khi lộ City. Không bấm hộ trong ván thật. Cái nào không tới được ghi "chưa xem trên trình duyệt".
4. Đo độ chồng lấn; kiểm link chạm vào hình (trim alpha).

## F. Dọn tranh cũ và tài liệu

- Chuyển `the-scarlet-keys/congress-of-the-keys.webp` vào `img/scenes/archives/` sau khi `grep` không còn chỗ dùng.
- Thêm Congress of the Keys vào danh sách màn mẫu ở `.agents/skills/arkham-dynamic-grid-scene/SKILL.md` §1.
- Nếu Without a Trace làm trước, copy `09747`-`09750`, `remnants-back`, nền Otherworld.
