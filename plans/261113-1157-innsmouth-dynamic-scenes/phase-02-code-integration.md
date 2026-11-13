# Phase 2: Tích hợp code (chỉ frontend)

Status (2026-11-13): đã làm xong §A–§F (chưa commit). Chưa kiểm: Maelstrom Act 2 với 1–4 người chơi, hiệu ứng trượt High Gear khi tiến cột, bản Return to, Holding Cells trong hộp off-map trên trình duyệt (chỉ có test đơn vị).

Làm được trước khi có ảnh: thiếu file thì tạm trỏ về sprite có sẵn (`devil-reef/tunnel-back`, `cosmos`). Ảnh thật về chỉ thay file, không đổi code.

File chính: `frontend/src/arkham/scene-island-sprites.ts`, `frontend/src/arkham/hemlock-overview.ts`, `frontend/src/arkham/components/LocationMap.vue`, `LocationMapCanvas.vue`, `SceneVehicle` (đang dùng cho Fishing Vessel). Test: `frontend/tests/` (mẫu `dreamEatersScene.test.mjs`, `hemlockOverview.test.mjs`).

Mã Return to viết tắt `RT:0xx` = `:return-to-the-innsmouth-conspiracy:0xx`.

## A. Hạ tầng chung

1. **Sprite dùng chung giữa các thư mục.** Pit, Maelstrom, Light in the Fog dùng lại `07102`–`07104`, `tunnel-back`, `water-partial`, `water-full` của `devil-reef/`. Cho phép `IslandSet.sprite` (và `water`) trả về tên có thư mục khác, vd. `../devil-reef/07102`, và `islandImage` / `islandWaterImage` chuẩn hóa thành `img/scenes/the-innsmouth-conspiracy/devil-reef/07102.webp`. Không chép file.
2. Gom `FLOODED_CAVERNS` (`07102`–`07104`, `RT:065`–`RT:067` → sprite gốc) thành hằng dùng chung cho Devil Reef và 3 bộ mới.
3. Bộ mới chỉ khai báo bảng `mã → sprite`, mặt sau theo loại, `square`, `spot`, `water`, `vehicles`, theo đúng khuôn `devilReef`.
4. `hemlock-overview.ts`: thêm 8 mục vào `ISLAND_FOLDERS` (4 màn × gốc/RT), đổi `boards` sang nền mới, xóa điểm neo theo mã lá của 4 màn.
6. **Quy tắc chung: location tách rời → hộp off-map.** Location đang in play mà nhãn không có trong `locationLayout` **và** không nối với location nào (`connectedLocations` rỗng, không ai nối tới nó) thì không vẽ trên map, mà vào hộp off-map cạnh reference card (`offMapCards.ts`, nhóm `reference`, trường `locations`). Áp dụng cho mọi màn, không chỉ Innsmouth. Map bỏ qua các location này khi tính vị trí, để không còn plate lơ lửng ở góc.
   - **Hiện bằng sprite, không bằng lá:** nếu màn có bộ sprite (`illustratedBoard.islands`) và `islandImage` cho ra sprite riêng của lá, `MissionStripOffMap.vue` vẽ sprite đó thay cho `<Location>`: plate tên như trên map, điều tra viên/enemy đang ở đó đứng trên sprite, bấm vào mở cùng thông tin và lựa chọn như plate trên map (dùng lại `LocationInfoCard` và handler `choose`). Màn không có sprite hoặc lá không có sprite riêng thì giữ `<Location>` như hiện tại.
   - Test: hàm chọn "sprite hay lá" cho location trong hộp (có bộ sprite + có mặt riêng → sprite; còn lại → lá). Test trong `offMapCards.test.mjs`: location tách rời vào nhóm `reference`; location có ô hoặc có kết nối thì không.
7. Test: `islandImage` cho mỗi bộ (mặt lật, mặt úp từng loại, mã RT, mã có hậu tố a/b/c, đường dẫn dùng chung đã chuẩn hóa).

## B. The Pit of Despair (`07041`, `RT:018`) → `pit/`

Luật (backend `ThePitOfDespair.hs`, `Act/.../ThePit.hs`, `TheEscape.hs`):

| Thứ | Ô |
|---|---|
| Unfamiliar Chamber `07047` | (0,0), lật sẵn, điểm xuất phát |
| 3 Tidal Tunnel xáo | (−1,0), (1,0), (0,−1) |
| Tunnel deck còn lại | `07048`, `07049`, `07102`×2, `07103`×2, `07104`×2 (RT thay bằng `:065`–`:067`) |
| Lấp thêm | Act 1 lật và ability 1 của *The Escape*: ô trống trái/phải/dưới mỗi lá đã lật |
| Set aside | `07050` Altar to Dagon, `07051` Idol Chamber, `07052` Sealed Exit (vào bàn theo luật server, frontend chỉ đọc) |

Code:
- Bộ `pit`: mặt lật = sprite riêng (`07047`–`07052`) hoặc `../devil-reef/0710x`; mặt úp = `../devil-reef/tunnel-back`; `07047` luôn lật.
- Có flood: dùng `water` của Devil Reef.
- Lưới mở rộng xuống dưới (y âm). Kiểm tra `compactGridLayout` giữ đúng thứ tự trên/dưới như card mode.

## C. Into the Maelstrom (`07311`, `RT:048`) → `maelstrom/`

Luật (`IntoTheMaelstrom.hs`, `Act/.../BackIntoTheDepths.hs`):

| Thứ | Ô |
|---|---|
| Gateway to Y'ha-nthlei `07320` | (0,0), lật sẵn |
| 8 Tidal Tunnel xáo | 8 ô quanh (0,0): `07319`×2, `07102`–`07104`×2 (RT thay bằng `:065`–`:067`) |
| *Back into the Depths* | 4 sanctum (`07324`–`07327`) + 5–7 Y'ha-nthlei (`07321`×2, `07322`×2, `07323`×3) + `07328` Lair of Dagon + `07329` Lair of Hydra, tọa độ theo 4 bố cục (1–4 người chơi), hàng y −1…−3 |

Code:
- Bộ `maelstrom`: mặt úp theo loại — Tidal Tunnel → `../devil-reef/tunnel-back`; `07321`–`07323` → `yhanthlei-back`; `07324`–`07327` → `sanctum-back`; `07320`, `07328`, `07329` luôn lật.
- Có flood (kiểm lại trên ván; nếu màn không dùng flood thì để `water` vẫn vô hại).
- Kiểm tra cả 4 bố cục Act 2 (debug jump với 1, 2, 3, 4 người chơi): ô không đè nhau, sprite không vượt ô.

## D. A Light in the Fog (`07231`, `RT:039`) → `fog/`

Luật (`ALightInTheFog.hs`, `FindingThePath.hs`, `UnchangingAsTheSea.hs`):

| Thứ | Ô |
|---|---|
| Act 1 | Gatehouse `07239` (0,0), Cliffside `07242` (1,0), Stairwell `07240` (2,0), Cottage `07243` (3,0), Lantern Room `07241` (2,1) |
| Lighthouse Basement / Sunken Grotto Upper `07244` | Lật thành Sunken Grotto khi qua Act 1 |
| Act 2 | Sunken Grotto `07245` (2,−2), `07246` (2,−3); 9 Tidal Tunnel xáo vào cột x = 0, 1, 3 của hàng y −1…−3: `07247`–`07251`, `07102`×2, `07103`×2 (không có `07104`; RT tương tự với `:065`, `:066`) |
| Holding Cells `07252b` | Mặt sau của story *Captured!* (`placeStory` lúc setup); *Taken Captive* đưa người vào đó. Không có `placeInGrid` → không có ô lưới |

Code:
- Cả màn dùng sprite (một đường code, không giữ tranh tĩnh cho Act 1).
- `07244`: úp → `07244b` (Lighthouse Basement), lật → `07244`. `07252` (Captured!/Holding Cells) → `07252b`, luôn lật.
- Tidal Tunnel úp → `../devil-reef/tunnel-back`. Có flood.
- **Holding Cells vào hộp off-map cạnh reference card** (quyết định của người dùng), không vẽ trên map. Nó không nối với location nào (`location HoldingCells … 3 (PerPlayer 1)`, không `connectsTo`) và không có ô lưới. Trong hộp, Holding Cells hiện bằng **sprite `fog/07252b`** chứ không phải lá bài (quyết định của người dùng), theo quy tắc chung ở §A.6.
- Tunnel Act 2 chỉ nối theo hàng (`LocationInRow`); đường nối trên map phải theo `connectedLocations` của server, không suy từ ô kề.

## E. Horror in High Gear (`07198`, `RT:035`) → `high-gear/`

Luật (`HorrorInHighGear.hs`, `HorrorInHighGear/Helpers.hs`):

- Không dùng `usesGrid`. Layout 6 hàng, mỗi cột là `roadN`; ô một lá chiếm hàng 3–4 (`roadNa`), cột 2 lá: `a` hàng 2–3, `b` hàng 4–5; cột 3 lá: `a` 1–2, `b` 3–4, `c` 5–6.
- Đầu ván: 3 cột `road1a road2a road3a`, xe của Thomas Dawson (`07211`) và Elina Harper (`07212`) ở cột trước nhất.
- Mỗi lần tiến lên (`road`): rút 1 lá Road deck + (n−1) *Long Way Around*, xáo, đặt cột `road(N+1)` bên phải.
- `advanceRoad` gỡ các cột phía sau điều tra viên cuối cùng (`SetLayout` mới).
- Pool 14 lá đường (RT thêm `:036` Mud Tracks, `:037` Straight Section) xáo; 3 lá đầu vào bàn, còn lại thành Road deck, Falcon Point Approach `07203` xáo vào 3 lá cuối deck.

Code:
1. **Bộ đọc layout ô trải hàng** (hàm thuần, module riêng, có test): từ `locationLayout` → `label → { col, rowCenter }`. Cột lấy theo thứ tự cột trong chuỗi (sau khi bỏ cột toàn `.`), hàng giữa = trung bình các hàng ô chiếm. Không dùng `compactGridLayout`.
2. Vị trí: cột chia đều chiều ngang; hàng theo `rowCenter` / 6. Sprite 3:2 cùng kích thước để mặt đường nối liền giữa các cột.
3. Bộ `high-gear`: mặt lật = mã gốc (`07204`…, hậu tố a/b/c bỏ qua), `RT:036` → `mud-tracks`, `RT:037` → `straight-section`; úp → `road-back` (3:2, không vào `square`).
4. **Xe là object** (dùng lại `SceneVehicle`): `vehicles: { '07211': '07211', '07212': '07212' }`. Ai ngồi trong xe đứng trên xe; bấm xe mở lựa chọn server đang cho (lên/xuống, lái), không thêm luật.
5. **Hiệu ứng trượt** (như Endless Stairs): so map `locationId → cột` giữa hai state. Cột mới bên phải trượt vào; cột bị gỡ phía sau mờ dần sang trái; các cột còn lại dịch sang vị trí mới (~500 ms). Nền trượt ngang theo (hoặc lặp ngang) để có cảm giác xe chạy. `prefers-reduced-motion`: nhảy thẳng.
6. Test: bộ đọc layout (1/2/3 lá một cột, cột bị gỡ), nhận diện "thêm cột / gỡ cột".

## F. Kiểm tra, dọn dẹp

1. `npm test` + typecheck (vue-tsc) pass.
2. Mỗi màn (gốc + RT), dùng debug scenario jump, không đụng ván thật: đối chiếu card mode từng bước luật ở bảng trên; chụp màn hình map ở desktop và tablet.
3. Việt hóa: nhãn/tooltip mới (xe, mặt sau) có trong `vi` cùng các ngôn ngữ đang có key.
4. Chuyển 4 tranh tĩnh cũ (`the-pit-of-despair.webp`, `into-the-maelstrom.webp`, `a-light-in-the-fog.webp`, `horror-in-high-gear.webp`) từ `img/scenes/the-innsmouth-conspiracy/` vào `img/scenes/archives/` (quyết định của người dùng); grep để chắc không còn chỗ nào trỏ tới đường dẫn cũ; xóa điểm neo cũ.
5. Cập nhật skill `arkham-dynamic-grid-scene` §1: thêm 4 màn vào danh sách màn mẫu, ghi chú bộ đọc layout ô trải hàng của High Gear.
