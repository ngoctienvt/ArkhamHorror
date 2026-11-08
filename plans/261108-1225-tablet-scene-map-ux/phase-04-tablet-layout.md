# Phase 4: Bố cục cho iPad dọc và ngang

## Bối cảnh

`LocationMap.vue` có ba lớp phủ cố định kích thước: team slot 242px (trái), action panel 300px (phải, `padding-right: 300px` cho map), info card 290px (`rightGap` 300). Bottom sheet chỉ bật dưới 800px (`LocationInfoCard.vue:144`). Chiều cao map là `calc(100dvh - 60px - var(--hand-h))`; tay bài `position: fixed` ở `z-index: 900`.

Ví dụ 1080×810 ngang: 1080 − 242 − 300 = 538px cho map khi cả hai bên mở, info card mở thì còn ít hơn. 820×1180 dọc: team slot và panel gần như phủ hết bề ngang.

## Việc làm

- **Tablet ngang (1024 đến 1366, coarse):** action panel thu còn rail 72px chứa biểu tượng action, bấm mở rộng ra 300px dạng overlay (không đẩy map). Team slot thu thành dải seat ngang trên cùng map (avatar + thanh HP/SAN nhỏ), chạm mở chi tiết. Info card nổi bên phải panel như cũ nhưng giới hạn `max-height` theo viewport.
- **Tablet dọc (744 đến 1023, coarse):** dùng bottom sheet cho cả info card và action panel (mở rộng điều kiện hiện tại từ `max-width: 800px` sang `layoutClass` của phase 1). Sheet kéo được lên xuống bằng thanh nắm, `--sheet-max` 56dvh, lớp mờ phía sau chạm để đóng. Action panel mặc định mở (giữ `panelOpen = true` như hiện nay) ở dạng sheet thấp: chỉ hiện thanh nắm và hàng action đầu tiên (khoảng 30% chiều cao), kéo lên để xem hết, vuốt xuống để thu nhỏ. Nút "Hành động" ở map bar vẫn bật/tắt hẳn và có chấm báo khi có choice đang chờ.
- **Map bar:** gom các nút ít dùng (chaos bag, decks, bật tắt chữ plate, reset layout, legend) vào menu "⋯" khi bề ngang dưới 900px, để các nút chính không bị xuống dòng và cao thêm.
- **Tay bài và thanh home:** `padding-bottom: env(safe-area-inset-bottom)` cho `.hand-dock`; `--hand-h` cộng thêm phần inset. Khi một sheet mở, tay bài hạ xuống để không che.
- **Xoay máy:** `ResizeObserver`/`useElementSize` của canvas đã đo lại; kiểm tra plate vẫn trong stage sau khi xoay và panel không giữ trạng thái sai.
- **Cutaway The Gathering:** `HOUSE_ROOMS` định vị plate theo % nên scale được; xác nhận `font-size: clamp(9px, 1.5cqh, 12px)` của plate `room` không rơi dưới sàn 13px của phase 2 (nới `clamp` khi coarse, hoặc cho plate room cuộn chữ).

## File được sửa

`LocationMap.vue`, `LocationInfoCard.vue`, `LocationActionPanel.vue`, `SceneSeatCard.vue`, `LocationHand.vue`, `LocationMapCanvas.vue` (padding/ khoảng trống stage), `Scenario.vue` (nơi gắn `#scene-team-slot`, chỉ nếu cần).

## Kiểm tra

Ma trận: {744×1133, 810×1080, 820×1180, 1024×1366} × {dọc, ngang} × {panel đóng, panel mở, info card mở, cả hai}. Mỗi ô: không lớp phủ đè nhau, vùng map còn ít nhất 50% bề rộng ở ngang, nút map bar không xuống dòng. Chụp ảnh lưu vào `plans/reports/`.

## Rủi ro

Đây là phase lớn nhất và đụng nhiều lớp phủ. Làm theo từng khối (info card, panel, team, map bar), mỗi khối một commit nhỏ, để dễ hoàn tác. Cân nhắc tách `LocationMap.vue` (đang 288 dòng) khi thêm logic sheet, ví dụ `LocationSheet.vue` dùng chung.
