# Phase 2: Bố cục theo bề rộng vùng map

Giải quyết C1, C3, C4. Đây là nền cho phase 3, 4, 5.

## Vấn đề gốc

`touchLayout.ts` chọn lớp bố cục từ `window.innerWidth` và `pointer: coarse`. Hai hệ quả:

- Log bên phải (205–300px) không được tính, nên cửa sổ 1280px chỉ còn 965px cho scene map, và panel 280px che thêm gần một phần ba.
- Cửa sổ chuột hẹp (laptop chia đôi màn hình, 820px) luôn là `desktop`, map còn 308px.

## Thiết kế

Thêm một trục thứ hai, độc lập với `data-layout` hiện có: **`data-width`** trên `.location-map`, tính từ bề rộng thật của chính phần tử đó (`useElementSize` của `@vueuse/core`).

| `data-width` | Bề rộng vùng map | Panel hành động | Info card | Mission strip |
|---|---|---|---|---|
| `wide` | từ 1100px | cột nổi bên phải 280px | cạnh panel | một hàng đầy đủ |
| `medium` | 700–1099px | cột nổi 240px, khối About thu gọn mặc định | thay chỗ panel (không đứng cạnh) | một hàng, tiêu đề cắt bằng dấu ba chấm |
| `narrow` | dưới 700px | bottom sheet dạng thấp, kéo lên để xem hết | bottom sheet | dạng chip (phase 3) |

Quy tắc ghép với `data-layout` cũ: `tablet-portrait` và `phone` luôn ứng xử như `narrow`; `tablet-landscape` theo bề rộng đo được. Nhờ đó hành vi tablet đã làm ở plan `261108-1225` giữ nguyên.

Thêm trục chiều cao **`data-height="short"`** khi `.map-layout` thấp hơn 420px (Fit to screen ở 768px, laptop 720px): khối About trong panel thu gọn mặc định để các nút hành động hiện ngay, mission strip dùng dạng một hàng thấp.

## File

- `frontend/src/arkham/touchLayout.ts`: thêm hàm thuần `widthClassFor(mapWidth)` và `heightClassFor(mapHeight)`, cùng hằng số ngưỡng.
- `frontend/src/arkham/composables/useTouchMode.ts` hoặc composable mới `useMapSizeClass.ts`: đo phần tử, trả về hai lớp.
- `frontend/src/arkham/components/LocationMap.vue`: gắn `data-width` / `data-height`; `sheetLayout`, `panelBelow`, `collapsedBar` đọc từ lớp mới thay vì chỉ từ `layoutClass`.
- `frontend/src/arkham/components/LocationActionPanel.vue`: nhận prop `compact` (About thu gọn), bề rộng 240px ở `medium`.
- `frontend/src/arkham/components/LocationInfoCard.vue`: quy tắc bottom sheet chuyển từ `[data-layout='tablet-portrait']` và `@media (max-width: 800px)` sang `[data-width='narrow']`.
- `frontend/tests/touchLayout.test.mjs`: thêm ca cho hai hàm mới.

## Việc cần làm

1. Viết `widthClassFor` / `heightClassFor` và test (ngưỡng biên: 699/700, 1099/1100, 419/420).
2. Đo `.location-map` và gắn hai thuộc tính. Thêm độ trễ nhỏ (hysteresis 16px) quanh ngưỡng để không nhấp nháy khi kéo cửa sổ.
3. Chuyển các `@media (max-width: 800px)` trong `LocationMap.vue`, `LocationInfoCard.vue`, `LocationMarkerPlate.vue`, `LocationMapCanvas.vue`, `SceneSeatCard.vue` sang `[data-width='narrow']`. Liệt kê từng chỗ trước khi sửa; `@media` nào thuộc về phần ngoài scene map thì để nguyên.
4. Điện thoại (C4): thay "panel nằm dưới map trong trang dài" bằng bottom sheet dạng thấp như tablet dọc, để map giữ `min-height: 45dvh` và người chơi không phải cuộn trang giữa map và hành động.
5. `data-height='short'`: About thu gọn, mission strip thấp.

## Kiểm tra

- 1280×720 có log mở: `data-width='medium'`, panel 240px, vùng map thấy được từ 700px.
- 820×1180 cửa sổ chuột: `data-width='narrow'`, panel là bottom sheet, map dùng trọn bề rộng.
- Fit to screen 1366×768: nút Investigate thấy được mà không cần cuộn panel.
- 1920×1080: không đổi so với trước.

## Rủi ro

Đổi `@media` sang thuộc tính dữ liệu có thể bỏ sót quy tắc trong component con dùng `:deep`. Dùng grep `max-width: 800px` trên toàn bộ component scene map làm danh sách kiểm.
