# Phase 5: Zoom/pan và kéo thả bằng cử chỉ

## Bối cảnh

- `useMapDrag.ts`: ngưỡng kéo 5px, tính offset theo `stage.getBoundingClientRect()`, nuốt click sau khi kéo. `touch-action: none` ở `.node.draggable`, `.connection-arrow.draggable`, `.fig` làm ngón tay chạm vào các phần tử này là không cuộn được, và mọi cú chạm nhẹ có thể thành kéo nhầm.
- Không có zoom/pan. Bảng minh họa và cutaway ép vừa khung (`LocationMapCanvas.vue:213`), nên plate và figure nhỏ.

## Việc làm

1. **Chế độ "Sắp xếp" bằng nút.** Thêm trạng thái `arrangeMode` (không lưu, mặc định tắt) và nút bật/tắt 44px "Sắp xếp" trên map bar (chỉ hiện ở bản đồ không phải cutaway, vì cutaway không kéo được). Khi tắt: `beginDrag` trả về ngay với `pointerType === 'touch'`, plate/figure/mũi tên không nhận kéo. Khi bật: kéo ngay, ngưỡng 10px cho ngón tay, plate có viền nét đứt và hiện chú thích "Kéo để đặt lại". Chuột giữ hành vi cũ (kéo luôn, ngưỡng 5px), vì chuột không có vấn đề vuốt nhầm.
2. **`touch-action`.** Mặc định `touch-action: manipulation` trên plate, mũi tên, figure để vuốt vẫn cuộn trang. Chỉ khi `arrangeMode` bật mới đặt `touch-action: none` (class trên `.map-layout`). Cách này tránh được rắc rối iOS đọc `touch-action` lúc pointerdown.
3. **Zoom/pan cho stage** (không áp cho cutaway The Gathering). Thêm composable `useMapViewport.ts`: giữ `scale` (1 đến 3), `tx`, `ty`; xử lý pinch hai ngón (Pointer Events, không thêm thư viện), pan một ngón khi đã zoom > 1 và bắt đầu trên nền (không phải trên plate), chạm đúp để về 1, kẹp biên để không trôi khỏi tranh. Áp `transform` lên một lớp bọc bên trong `.map-canvas`, không lên `.map-scroll`. Khi `arrangeMode` bật thì pan một ngón bị tắt, hai ngón vẫn zoom. Nút "−", "+", "⟲" 44px ở góc map cho người không dùng cử chỉ.
4. **Phản ánh scale vào kéo thả.** `beginDrag` hiện chia cho kích thước stage theo `getBoundingClientRect()`, vẫn đúng với phần tử đã bị `transform` vì rect là kích thước sau transform; vẫn phải test lại ở scale ≠ 1 và dùng chung `scale` cho chế độ `px` của figure.
5. **Chống kéo trang.** `overscroll-behavior: contain` trên map, để vuốt trên map không kéo lại trang (rubber-band) hay lùi lịch sử bằng cử chỉ cạnh.
6. Đặt `plate` ở dưới mức zoom lớn: cân nhắc giữ kích thước plate cố định theo màn hình (nghịch scale) để chữ không phình theo ảnh; hỏi lại người chơi ở phase 6.

## File được sửa

`composables/useMapDrag.ts`, `composables/useMapViewport.ts` (mới), `LocationMapCanvas.vue`, `LocationStandees.vue` (cursor/touch-action của `.fig`), `LocationMap.vue` (nút zoom và nút Sắp xếp).

## Kiểm tra

- Test node cho phần thuần: tính scale/translate từ hai điểm chạm, kẹp biên, nhận diện giữ vs vuốt (không cần DOM).
- Giả lập touch: với Sắp xếp tắt, vuốt một ngón trên plate thì trang cuộn và plate không nhúc nhích; bật Sắp xếp thì kéo được plate, figure, mũi tên; pinch zoom, chạm đúp reset, kéo plate ở scale 2 không bị lệch. Cutaway không zoom.
- Desktop: kéo chuột, không thay đổi; bánh xe chuột không zoom (tránh xung đột với cuộn trang), trừ khi giữ Ctrl (tuỳ chọn).

## Rủi ro

Safari iOS xử lý `touch-action` và pointer capture khác Chrome; cần thử máy thật. Gesture hai ngón có thể xung đột với zoom trang của Safari nếu thiếu `touch-action: none` trên vùng zoom.
