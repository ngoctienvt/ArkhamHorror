# Phase 6: Kiểm tra trên thiết bị giả lập và iPad thật

## Việc làm

1. **Tự động (node --test, `npm run lint`, build).** Giữ `npm test` xanh. Thêm test cho `useTouchMode` (chọn layout), logic cử chỉ, và kẹp biên zoom. Không thêm test giả để cho qua; chỉ test logic thuần.
2. **Giả lập trình duyệt.** Dùng Browser pane / Playwright với viewport theo bảng thiết bị trong `plan.md`, bật emulation touch và chạy kịch bản: vào scene The Gathering (cutaway), một bảng minh họa (Hemlock Vale hoặc Drowned City), một map dạng node. Mỗi cảnh: chạm plate → mở thẻ, chạm action, di chuyển, điều tra, nâng và chơi bài, mở seat, zoom, kéo plate bằng nhấn giữ, xoay máy. Chụp ảnh vào `plans/reports/`. Xem `frontend/harness/README.md` xem có sẵn flow nào dùng lại được.
3. **Quét vùng chạm.** Chạy script duyệt các nút trong `.location-map` ở coarse, lập danh sách vi phạm dưới 44px (xem phase 2).
4. **Hồi quy desktop.** So ảnh 1440×900 chuột trước/sau cho ba cảnh trên.
5. **iPad thật (bắt buộc trước khi đánh dấu xong).** Một lượt chơi 10 phút trên iPad Safari và, nếu người chơi dùng, bản thêm vào màn hình chính: ghi lại lỗi chạm nhầm, vùng khó với tới, hiệu năng khi pinch (khung hình), thanh địa chỉ co giãn làm đổi `100dvh`.
6. Cập nhật `status` của plan và từng phase; ghi mục "Tablet" ngắn vào tài liệu người dùng hoặc README nếu có chỗ hợp (cử chỉ: nhấn giữ để kéo, chạm đúp để reset).

## Tiêu chí qua

Toàn bộ checklist ở `plan.md`, cộng báo cáo ngắn trong `plans/reports/` liệt kê những gì đã thử trên máy thật và những gì chưa thử được.

## Kết quả (2026-11-08)

Đã chạy:
- `npm test`: 290/292 qua. Hai test lỗi là `scenarioLocalization` (chuỗi tiếng Anh cứng trong `InTheShadowOfEarth.hs`, `FatalMirage.hs`, `ThePallidMask.hs`) và `ultimatumsAndBoonsZh` (catalog tiếng Trung thiếu khoá `deckErrors.*`, `currentlyDisabled`). Cả hai không liên quan đến thay đổi này và không đụng khoá `locationMap.*` mới.
- `npm run tc` (vue-tsc): sạch. `eslint src/arkham`: 0 lỗi (68 cảnh báo có sẵn).
- Vite dev server (đang chạy ở :8080) biên dịch được mọi component và composable đã sửa (HTTP 200).
- Test node mới: `touchLayout.test.mjs` (6), `mapViewport.test.mjs` (9).

Chưa làm được:
- Chưa mở scene trong trình duyệt vì backend (:3002) không chạy, nên chưa có ảnh chụp, chưa quét vùng chạm bằng script, chưa so ảnh desktop trước/sau.
- Chưa thử trên iPad thật: cử chỉ pinch/pan, `touch-action` trên Safari, safe-area, thanh địa chỉ co giãn.
- Ma trận kích thước × chiều máy × lớp phủ ở phase 4 chưa chạy.

Việc tiếp theo: bật backend, tạo game The Gathering + một bảng minh họa, chạy ma trận bằng Browser pane với emulation touch, rồi thử 10 phút trên iPad.
