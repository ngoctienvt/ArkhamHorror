# Phase 5: Plate, đường nối, cỡ chữ, trạng thái

Giải quyết D1–D4 và B5. Cần phase 2.

## Việc cần làm

1. **Plate không đè nhau (D1).** Sau khi tính `positions`, chạy một bước đẩy nhẹ: với mỗi cặp plate có hộp bao giao nhau, dịch plate theo trục dọc cho tới khi hết giao (tối đa bằng chiều cao một plate, không vượt khỏi stage). Viết thành hàm thuần `nudgeOverlappingPlates(rects)` trong file `.ts` riêng, có test. Vị trí người chơi đã kéo tay (`useMapDrag` offsets) được ưu tiên, không bị đẩy.
2. **Plate dạng gọn khi map hẹp.** Ở `data-width='narrow'`, plate chỉ còn shroud + tên (cắt ở 14 ký tự) + clue; nút ↔ rời khỏi plate vì nút di chuyển đã nằm trên đường nối. Vùng chạm 44px vẫn giữ bằng `::before` như hiện tại, nhưng hộp nhìn thấy nhỏ lại để không che tranh.
3. **Nút di chuyển trên đường nối không đè plate (D1).** Nút ↔ đặt ở trung điểm đường nối; nếu trung điểm rơi vào hộp bao của một plate thì trượt dọc đường nối về phía xa plate đó cho tới khi ra khỏi hộp. Cùng file hàm thuần ở mục 1.
4. **Cỡ nút và chữ (D2).** Nút thanh map: `min-height: 24px` với chuột (hiện 21px). Chữ nhỏ nhất trong scene map: 11px (hiện có 10px và 10.9px); rà theo danh sách cỡ chữ đo được: 10, 10.9 → 11.
5. **Chỉ báo đang tải (D3).** Khi `game` chưa có hoặc scene chưa dựng xong, `.location-map` hiện khung chờ (nền gradient sẵn có + dòng "Đang tải bàn chơi…") thay vì vùng trống. Tìm đúng chỗ quyết định trong `Scenario.vue` / `Game.vue` trước khi sửa; nếu việc chờ nằm ở tầng `Game.vue` thì đặt chỉ báo ở đó.
6. **Trạng thái không chỉ bằng màu (D4).** Plate đang đứng thêm biểu tượng ghim nhỏ trước tên; plate đi tới được đã có nút ↔ trên đường nối. Nhờ đó chú giải (Legend) trở thành tuỳ chọn và có thể nằm trong ⋯.
7. **Dòng trạng thái lượt khi log bị ẩn (C3).** Trong Fit to screen (và khi người chơi đóng log), thanh map hiện một chip ngắn "Lượt của X · phase" lấy từ cùng dữ liệu mà đầu log đang dùng. Khi log mở thì không hiện, để không lặp.
8. **Tài liệu (B5).** Sửa mục 5 của `docs/scene-maps.md` cho đúng thực tế: zoom/pan đang tắt; mô tả ba lớp bố cục theo bề rộng. Cập nhật mục tương ứng trong `README.md` nếu có nhắc pinch-zoom.

## File

- `frontend/src/arkham/components/LocationMapCanvas.vue` (áp dụng kết quả đẩy plate, vị trí nút đường nối)
- file mới `frontend/src/arkham/map-plate-collision.ts` và test `frontend/tests/mapPlateCollision.test.mjs`
- `frontend/src/arkham/components/LocationMarkerPlate.vue`
- `frontend/src/arkham/components/LocationMap.vue` (cỡ nút, chip trạng thái lượt)
- `frontend/src/arkham/components/Scenario.vue` hoặc `views/Game.vue` (chỉ báo tải)
- `docs/scene-maps.md`, `README.md`

## Kiểm tra

- Extracurricular Activity ở 1024×768 và 375×812: không cặp plate nào giao nhau quá 25% diện tích; không nút ↔ nào nằm trong hộp bao của plate.
- Một scenario cutaway (The Gathering) và một scenario lưới (Dream-Eaters): bố cục không đổi so với trước, vì cutaway dùng `roomPlates` cố định và không qua bước đẩy.
- Tải lại trang: thấy khung chờ cho tới khi map hiện.
- Fit to screen: chip lượt hiện; tắt Fit to screen và mở log: chip biến mất.

## Rủi ro

Bước đẩy plate chạy mỗi lần `positions` đổi. Phải là phép tính O(n²) nhỏ trên số địa điểm (thường dưới 20) và cho kết quả ổn định (cùng đầu vào cho cùng đầu ra) để plate không nhảy giữa các lần cập nhật.
