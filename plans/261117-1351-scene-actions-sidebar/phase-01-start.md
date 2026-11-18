---
phase: 1
title: "Gắn bảng Hành động và kiểm tra bố cục"
status: todo
priority: P1
effort: "3h"
dependencies: []
---

# Gắn bảng Hành động và kiểm tra bố cục

## Kiến trúc

`Game.vue` quản lý trạng thái mở của sidebar. `LocationMap.vue` quản lý địa điểm đang xem và gửi lựa chọn qua sự kiện `choose`. Dùng một instance `LocationActionPanel` và Vue Teleport có điều kiện để chuyển vị trí render.

## Các bước

1. Chụp trước khi sửa trên cùng một ván có nhiều hành động, ở 1366×768 và 1920×1080. Ghi chiều cao phần cuộn, số hàng thấy ngay và khoảng cuộn tới một thao tác chính trong danh sách. Ảnh người dùng minh họa hai bảng riêng và trạng thái danh sách trống.
2. Thêm vùng đích giữa `GameStatusPanel` và `GameLog` trong `frontend/src/arkham/views/Game.vue`. Cung cấp ref đích khi sidebar thực sự hiện và đang ghim, đồng bộ breakpoint 800 px với CSS drawer hiện có. Dùng grid `minmax(0, 2fr)` và `minmax(0, 1fr)` cho hai vùng nội dung với phần trạng thái tự lấy chiều cao. Khi vùng đích rỗng, cho Nhật ký lấp phần còn lại. Giới hạn tối thiểu cho hàng nhập chat trên cửa sổ thấp. Thu hẹp phạm vi `pointer-events: none` hiện áp cho sidebar nhật ký trống để các nút Hành động vẫn nhận chuột.
3. Chuyển panel vào ref sidebar khi sidebar ghim đang mở. Khi thu sidebar, thu cả panel. Khi Nhật ký dùng drawer, đặt panel ở vị trí cục bộ trên bản đồ. Bỏ nút Hành động và nút đóng riêng. Cập nhật `sceneActionPanelVisible` để `Investigator.vue` hiện nút Kết thúc lượt dự phòng. Mở lại sidebar nếu người chơi bấm xem địa điểm hoặc có lựa chọn mới cần panel.
4. Cho panel lấp vùng được cấp, đưa các biến màu và kích thước chạm theo panel khi Teleport. Chỉ thân danh sách cuộn. Giữ tiêu đề và chân panel trong tầm nhìn. Trong sidebar, mục thông tin địa điểm mặc định thu gọn để các hàng hành động xuất hiện sớm.
5. Thử desktop 1920×1080, 1366×768, cửa sổ 1280×720, hai phía mốc 800 px và điện thoại 375×812. Thu/mở sidebar, thử Fit to screen và chuyển sang Card Board. Thử danh sách trống và dài, nhật ký trống, lượt mình/lượt người khác, lựa chọn cần panel đến khi đang đóng, xem địa điểm rồi quay lại bằng nút và Esc. Kiểm tra click thực tế, thứ tự Tab và một lần gửi đúng choice ở ván thử. So ảnh và số đo với bước 1.
6. Chạy `npm test` và `npm run tc` trong `frontend`, lint các file Vue chạm tới, rồi cập nhật mục bố cục trong `docs/scene-maps.md` theo hành vi đã kiểm chứng.

## Tiêu chí nghiệm thu

- [ ] Bố cục đủ chỗ đạt tỷ lệ 2:1 cho hai vùng sau trạng thái lượt. Nút sidebar thu hoặc mở cả Hành động lẫn Nhật ký.
- [ ] Cuộn một vùng giữ nguyên vị trí cuộn vùng kia. Trạng thái rỗng vẫn cho bấm các điều khiển hợp lệ.
- [ ] Đổi vị trí render hoặc đổi chế độ không làm mất đường vào lựa chọn và không tạo hai nút Kết thúc lượt khả dụng đồng thời.
- [ ] Số đo trước/sau cho thấy ít phải cuộn hơn để tới thao tác chính trên ván thử. Nếu phần thông tin địa điểm khiến kết quả kém hơn, ưu tiên thu gọn mục đó trong vùng dock trước khi điều chỉnh tỷ lệ.

## Rủi ro cần kiểm tra

- Sidebar được tạo và gỡ theo trạng thái ván. Chỉ kích hoạt Teleport khi có ref đích thực tế, và kiểm tra cả lần mở đầu lẫn lần đóng/mở sau.
- Sidebar dùng cho nhiều màn chơi. Chỉ kích hoạt kiểu chia 2:1 khi có bảng Hành động của Scene Map đang dock. Kiểm tra một ván chiến dịch và một ván standalone, cùng chế độ Card Board.

## Kết quả kiểm tra

- Trình duyệt đo tỷ lệ 2:1 ở 1920×1080, 1366×768, 1280×720 và 801×720. Nút Kết thúc lượt và ô chat nhận click khi nhật ký trống. Cuộn danh sách Hành động không dịch vị trí cuộn Nhật ký.
- Kiểm tra thu/mở sidebar, tự mở khi có lựa chọn chỉ hiển thị trong bảng, chuyển qua mốc 800 px, đưa panel xuống dưới bản đồ ở 375×812, rời Scene Map và gửi đúng chỉ số lựa chọn Kết thúc lượt. Bài kiểm tra dùng component thật và dữ liệu cục bộ.
- Còn lượt thử trên ván thật và so số hàng nhìn thấy trước/sau.
