# Phase 2: Vùng chạm và cỡ chữ

## Bối cảnh

Quy tắc 44px hiện chỉ có ở `LocationMarkerPlate.vue:155` và chỉ dưới 800px. Danh sách phần tử nhỏ đã đo từ code:

| Phần tử | File:dòng | Kích thước hiện tại |
|---|---|---|
| Nút ⓘ | LocationMarkerPlate.vue:130 | 20×20 |
| Vùng tên `.main` | LocationMarkerPlate.vue:126 | cao 22 |
| Nút `.go` | LocationMarkerPlate.vue:144 | padding 2px 8px |
| Nút `.view` (thanh map, legend) | LocationMap.vue:269, LocationMapLegend.vue:27 | padding 3px 12px |
| `.close`, `.link-chip`, `.act` | LocationInfoCard.vue:122 đến 139 | khoảng 20, 22, 30 |
| Hàng action panel | LocationActionPanel.vue:131 | padding 7px |
| Nút `.eye` seat | SceneSeatCard.vue:114 | rất nhỏ |
| Nút `+` ô lưới trống | LocationMapCanvas.vue:242 | đủ lớn |

## Việc làm

- Trong khối `@media (pointer: coarse)` (hoặc `[data-input="touch"]`) của từng component, áp `min-height: var(--tap-min)` và `min-width: var(--tap-min)` cho các nút ở bảng trên. Với ⓘ dùng vùng chạm 44px nhưng giữ biểu tượng 20px (pseudo-element `::after { inset: -12px }`) để plate không phình ra che tranh nền.
- Khoảng cách giữa hai nút kề nhau tối thiểu `var(--tap-gap)`, để tránh chạm nhầm giữa ⓘ và tên, giữa `.close` và tiêu đề.
- Cỡ chữ: plate `full` trên bảng minh họa 0.82rem, chip 9 đến 10px, `.hud` 9px. Khi coarse nâng sàn lên 13px cho tên, 11px cho chip. Có người chơi đặt `--location-scale` từ Settings, nên dùng `max(var(--tap-min), calc(Npx * var(--location-scale)))` để scale nhỏ không kéo vùng chạm xuống dưới 44px.
- Thêm `touch-action: manipulation` và `-webkit-tap-highlight-color: transparent` cho mọi `button` trong scene map để tắt double-tap zoom và vệt xám của iOS.
- Thêm `user-select: none; -webkit-touch-callout: none` cho plate, figure, thanh map (không áp cho text trong info card để người chơi vẫn chọn chép được).
- Hàng đợi / hàng action panel: tăng padding dọc lên 11px khi coarse.

## File được sửa

`LocationMarkerPlate.vue`, `LocationInfoCard.vue`, `LocationActionPanel.vue`, `LocationMap.vue`, `LocationMapLegend.vue`, `SceneSeatCard.vue`, `LocationMapCanvas.vue` (chỉ phần style).

## Kiểm tra

- Script trong trình duyệt giả lập duyệt `.location-map button, .location-map [role=button]`, in ra phần tử có `getBoundingClientRect()` nhỏ hơn 44 ở coarse. Mục tiêu: danh sách rỗng, ngoại trừ nút có vùng chạm mở rộng bằng pseudo-element (kiểm bằng `elementFromPoint` ở các góc vùng mở rộng).
- Chụp ảnh plate ở `--location-scale` 0.7, 1, 1.3.
- Desktop không đổi.

## Rủi ro

Plate cao hơn sẽ đè nhiều hơn lên tranh nền ở bảng minh họa. Giảm bằng cách chỉ mở rộng vùng chạm, không mở rộng phần nhìn thấy, và dựa vào zoom của phase 5 để người chơi tự phóng to khi cần.
