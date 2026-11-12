# Phase 2–5 — Tích hợp code (frontend only)

Làm trên các thay đổi chưa commit của Before the Black Throne (`hemlock-overview.ts`, `LocationMapCanvas.vue`). Không đụng `backend/`.

## A. Lưới động + đảo theo mã lá

**`frontend/src/arkham/hemlock-overview.ts`**

1. Đổi `COSMOS_SCENARIOS` / `COSMOS_ISLANDS` / `COSMOS_ISLAND_CODES` thành một bảng cấu hình theo skill §4:
   ```ts
   type IslandSet = { folder: string; image: (code: string, revealed: boolean) => string }
   const ISLAND_SETS: Record<string, IslandSet> = { '05325': cosmos, '54056': cosmos, '07163': devilReef, ':return-to-the-innsmouth-conspiracy:031': devilReef }
   ```
   `cosmosIslandImage(folder, code, revealed)` đổi thành `islandImage(board, code, revealed)` (giữ tên cũ làm alias nếu test đang gọi). Tỷ lệ ảnh qua `cosmosIslandAspect()`: sprite location 3:2 (768×512), mặt sau vuông (512×512).
2. Bộ Devil Reef: bảng `mã → file`, có chuẩn hóa `a/b` và mã RT:
   - Đảo `07169`–`07173`, RT `:033` → mặt sau `reef-back`; lật → `07169`… / `cave-mouth`.
   - Tunnel `07102` `07103` `07104` `07174a/b` RT `:065/:066/:067` → mặt sau `tunnel-back`; lật → `07102`/`07103`/`07104`/`07174` (RT dùng ảnh bản gốc cùng tên).
   - Depths `07175a/b` `07176a/b` `07177a/b` → mặt sau `depths-back`; lật → `07175`/`07176`/`07177`.
   - Đảo RT `:033` lật → `cave-mouth`. `07168` → `07168` (luôn lật). RT `:032` → `shrine-to-hydra`.
   - Mã lạ (lá từ set khác rơi vào lưới) → `reef-back`.
3. `boards`: `07163` (và RT) trỏ nền mới `the-innsmouth-conspiracy/devil-reef-sea`.
4. **Xóa điểm neo `07168`–`07177`** trong `boardAnchors` (dòng ~390–400). Sau đó `grep -n "0716[89]\|0717[0-7]" hemlock-overview.ts` phải rỗng ở phần anchor.
5. Xóa `public/img/scenes/the-innsmouth-conspiracy/devil-reef.webp` khi nền mới đã có.

**`LocationMapCanvas.vue`**: lớp `.island` đang gọi `cosmosIslandImage(...)` → gọi hàm mới. Giữ `cosmosCell`/`islandWidth` (sprite 3:2 rộng `min(rộng ô, cao ô × 1.5)`, sprite vuông `min(rộng ô, cao ô × 1.2)`), `canDrag=false`, ô "+" theo kích thước ô, nền `contain`. Ô "+" dùng `reef-back` thay vì `cosmos.webp` (lấy từ IslandSet, không hard-code).

## B. Thuyền là object

File mới `frontend/src/arkham/components/SceneVehicle.vue` (+ helper thuần `frontend/src/arkham/scene-vehicle-model.ts` để test được).

Model (thuần, không Vue):
- Tìm asset là phương tiện có ảnh: `07178`, RT `:034` (bảng `VEHICLE_SPRITES` trong `hemlock-overview.ts`, cùng thư mục đảo).
- Ô của thuyền: `asset.placement.tag === 'AtLocation'` → location id.
- Hành khách: điều tra viên có `placement` `{ tag: 'InVehicle', contents: vehicleId }`.
- Hướng: lưu ô trước đó; `x` mới < `x` cũ → quay trái (`scaleX(-1)`).
- Lựa chọn của thuyền: các `AbilityLabel` trong câu hỏi hiện tại có `sourceEntityId(ability.source) === vehicleId`. Nhãn Lên/Rời dùng `vehicleEnterExitMove` (đã có ở `vehicle-enter-exit-ability.ts`); ability 1 → "Di chuyển thuyền" (key mới `locationMap.vehicle.move`).

Hiển thị (`LocationMapCanvas.vue`, chỉ khi board có `islands` và có sprite):
- Vẽ `SceneVehicle` trong ô của thuyền, lệch xuống-phải tâm ô ~25% kích thước ô để không che plate, rộng ≈ 0.6 × `cosmosCell.island`.
- Hành khách vẽ trên boong (dùng lại portrait/actor sprite đang dùng cho standee). **Kiểm tra trước khi code**: hiện người trong thuyền được vẽ ở đâu (actor sprites từ commit `076c8553ac`), và `location.investigators` có gồm người `InVehicle` không. Người trong thuyền phải bị loại khỏi phần vẽ trên đảo để không vẽ 2 lần.
- Di chuyển: `transition: left/top 600ms ease-in-out`, tắt khi `prefers-reduced-motion`.
- Bấm thuyền: nếu có đúng 1 lựa chọn → gửi luôn (`emit('choose', index)`); nhiều lựa chọn → popover nhỏ liệt kê (dùng lại `AbilityButton` để nhãn và icon thống nhất với bảng bên phải). Không có lựa chọn → mở card Fishing Vessel (giống hover card hiện tại).
- Lái thuyền: sau khi chọn "Di chuyển thuyền", server hỏi `chooseTargetM` ô Ocean → các plate đã có trạng thái `targetable` sẵn. Thêm viền sáng lên **đảo** của ô đó (không chỉ plate) để dễ bấm.
- Không bao giờ tự sinh lựa chọn; mọi thứ đi qua `choices` server gửi.

## C. Mực nước theo flood

- Trong lớp `.island` thêm overlay `water-partial` / `water-full` (3:2, từ IslandSet) theo `location.floodLevel`, cùng khung với sprite, `pointer-events: none`.
- Chuyển mức: `transition: opacity 800ms`. Giữ token flood trên plate (đã làm).
- `07168` (Churning Waters) là biển sẵn → bỏ overlay.

## D. Kiểm tra + Việt hóa

- Test: mở rộng `tests/hemlockOverview.test.mjs` — ảnh đúng cho mỗi mã (mặt sau/lật, a/b, RT), mọi file webp được tham chiếu tồn tại; test mới cho `scene-vehicle-model` (ô, hành khách, hướng, lọc lựa chọn).
  `node --test tests/hemlockOverview.test.mjs tests/locationGraph.test.mjs tests/sceneVehicleModel.test.mjs`
- Typecheck: `npx vue-tsc --noEmit -p tsconfig.json --composite false`; eslint các file đã sửa.
- Đối chiếu card mode trên ván thật theo skill §5 (đọc vị trí, **không bấm lựa chọn**). Lưu ý ván hiện tại mới có 6 ô; kiểm tra lúc lật đảo khi người dùng chơi tới.
- Đo chồng lấn: `.island`, thuyền, `.spot` không tràn sang ô kề.
- Việt hóa: key mới trong `locales/vi/base.json` + `en`; rà `locales/vi/theInnsmouthConspiracy/scenarios/devilReef.json` tìm giá trị còn giống bản `en`.

## Rollback

Tất cả thay đổi nằm trong `hemlock-overview.ts`, `LocationMapCanvas.vue`, file mới và ảnh mới. Trả `boards['07163']` về `devil-reef` + khôi phục anchors là quay lại map cũ.
