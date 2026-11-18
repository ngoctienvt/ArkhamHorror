# Phase 6: Kiểm tra ma trận màn hình

## Ma trận

| Kích thước | Con trỏ | Log | Ghi chú |
|---|---|---|---|
| 1920×1080 | chuột | mở | mốc "không được xấu đi" |
| 1440×900 | chuột | mở | |
| 1366×768 | chuột | mở và Fit to screen | laptop phổ biến nhất |
| 1280×720 | chuột | mở | |
| 1024×768 | chuột | mở và đóng | |
| 820×1180 | chuột (cửa sổ hẹp) | mở | lớp `narrow` |
| 1180×820, 820×1180 | cảm ứng | đóng | iPad; cần máy thật hoặc DevTools giả lập cảm ứng |
| 375×812, 375×667 | cảm ứng | đóng | điện thoại |

## Ván dùng để thử

Mở bằng tài khoản của người dùng trên `localhost:8090`, chỉ xem, không gửi choice trong ván thật của người khác:

- Extracurricular Activity (tranh toàn cảnh, một điều tra viên)
- một ván hai người (team panel, hai standee cùng ô)
- một ván cutaway (The Gathering hoặc Return to)
- một ván lưới/đảo (Dream-Eaters hoặc Devil Reef)

## Kiểm tra tự động

- `npm test` (gồm các test mới: `touchLayout`, `locationPanelMode`, `mapPlateCollision`)
- `npm run tc`
- `npm run lint`

## Kiểm tra trên trang (mỗi ô của ma trận)

Chạy một đoạn script trong trình duyệt, ghi kết quả vào báo cáo:

1. Với mỗi nút nhìn thấy trong `.location-map` và `.map-bar`: tâm nút nằm trong viewport và `elementFromPoint(tâm)` là chính nút đó hoặc con của nó.
2. Chiều cao mission strip, bề rộng vùng map còn thấy được (bề rộng `.map-layout` trừ panel), so với tiêu chí trong `plan.md`.
3. Số lần chuỗi chữ lá địa điểm xuất hiện trong phần nhìn thấy được.
4. Số nút End turn nhìn thấy.
5. Cặp plate giao nhau quá 25%.
6. Nút thấp hơn 24px (chuột) hoặc 44px (cảm ứng); chữ nhỏ hơn 11px.

Chụp ảnh mỗi ô, lưu vào `plans/261117-1055-scene-mode-ui-ux-polish/screenshots/`, so với ảnh trước khi sửa ở 1920×1080.

## Báo cáo

Viết `plans/reports/tester-<ngày>-scene-mode-screen-matrix.md`: bảng đạt/không đạt theo từng ô, kèm số đo. Mục nào chưa thử được (iPad thật) ghi rõ là chưa thử.

## Dọn dẹp

Dừng dev server đã bật để thử. Trả lại các tuỳ chọn đã đổi trong lúc thử (Fit to screen, đóng/mở log) về như cũ.
