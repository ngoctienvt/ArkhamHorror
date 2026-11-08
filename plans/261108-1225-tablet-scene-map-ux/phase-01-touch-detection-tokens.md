# Phase 1: Nhận diện cảm ứng và token kích thước

## Bối cảnh

Hiện chỉ có `@media (max-width: 800px)` và một chỗ `matchMedia('(hover: none) and (pointer: coarse)')` trong `CardOverlay.vue:178`. Không có chỗ dùng chung nên mỗi component tự đoán.

## Việc làm

- Tạo `frontend/src/arkham/composables/useTouchMode.ts`: trả về `isCoarse` (reactive, theo `matchMedia('(pointer: coarse)')` và `(hover: none)`), và `layoutClass` (`phone` < 744, `tablet-portrait` 744 đến 1023 , `tablet-landscape` 1024 đến 1366 khi coarse, còn lại `desktop`). Dùng `useMediaQuery` từ `@vueuse/core` (đã có trong dự án).
- Trong `LocationMap.vue`, gắn `data-input="touch|mouse"` và `data-layout="..."` lên `.location-map`. CSS các phase sau bám vào hai thuộc tính này hoặc `@media (pointer: coarse)`.
- Định nghĩa token trên `.location-map`: `--tap-min: 44px`, `--tap-gap: 8px`, `--sheet-max: 56dvh`. Desktop để `--tap-min: 0px` để quy tắc `min-height: var(--tap-min)` không đổi gì.
- Cập nhật `frontend/index.html`: `viewport-fit=cover`. Thêm `padding-bottom: env(safe-area-inset-bottom)` cho khối cần (làm ở phase 4).
- Thay `CardOverlay.vue:178` dùng composable mới nếu logic trùng khớp, không đổi hành vi.

## Kết quả

- Logic thuần ở `src/arkham/touchLayout.ts` (`layoutClassFor`, `inputModeFor`), bọc reactive bởi `composables/useTouchMode.ts`. Test: `tests/touchLayout.test.mjs`.
- `LocationMap.vue` gắn `data-input` và `data-layout` lên root, định nghĩa `--tap-min` (0px với chuột, 44px với cảm ứng), `--tap-gap`, `--sheet-max`.
- `index.html` thêm `viewport-fit=cover`.
- **Không đổi `CardOverlay.vue`**: biến `isMobile` ở đó dùng `(hover: none) and (pointer: coarse)` cho hành vi overlay thẻ riêng, đổi nguồn không mang lại lợi ích và rủi ro hồi quy. Để phase 3 xem lại khi làm preview.
- Ngưỡng chọn: dưới hoặc bằng 743 là phone; chạm 744 đến 1023 là tablet dọc; chạm 1024 đến 1366 là tablet ngang; còn lại desktop. Máy cảm ứng có chuột/trackpad (`hover: hover`) vẫn tính là `mouse` cho `data-input`.

## File được sửa

`composables/useTouchMode.ts` (mới), `LocationMap.vue`, `frontend/index.html`, `CardOverlay.vue` (chỉ thay nguồn matchMedia).

## Kiểm tra

- Test node cho hàm thuần chọn `layoutClass` theo chiều rộng và `coarse`.
- Mở DevTools giả lập iPad, xác nhận `data-input="touch"`; trên desktop vẫn là `mouse`.
- Ảnh chụp desktop trước/sau giống nhau.

## Rủi ro và hoàn tác

Thấp. Chỉ thêm thuộc tính và biến CSS. Hoàn tác bằng xoá composable và các thuộc tính.
