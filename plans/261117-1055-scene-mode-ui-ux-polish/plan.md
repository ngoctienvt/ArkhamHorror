---
title: "Hoàn thiện UI/UX scene mode trên mọi kích thước màn hình"
description: "Sửa các chỗ che khuất, bỏ thông tin lặp, làm thanh điều khiển và bố cục scene map co giãn đúng từ điện thoại đến màn hình 1080p"
status: in-progress
priority: P1
created: 2026-11-17
---

# Hoàn thiện UI/UX scene mode trên mọi kích thước màn hình

## Cách khảo sát

Đọc code `LocationMap.vue` và các component con, rồi chạy ván Extracurricular Activity trên dev server (cổng 8090) và chụp ở 1920×1080, 1440×900, 1366×768, 1280×720, 1024×768, 820×1180 (cửa sổ chuột), 375×812 (giả lập cảm ứng), cả chế độ Fit to screen. Số đo dưới đây lấy từ `getBoundingClientRect()` của trang thật.

Chưa khảo sát: iPad thật, ván nhiều người (team panel, nhiều standee), các scenario dạng lưới/cutaway, tablet cảm ứng (công cụ không giả lập được `pointer: coarse` ở bề rộng trên 768).

## Vấn đề tìm thấy

### A. Che khuất, mất chức năng (nặng nhất)

| # | Vấn đề | Bằng chứng |
|---|---|---|
| A1 | Tay bài che nút **End turn** và dòng "còn N hành động" của panel hành động. | Dock tay bài cao 112px, `--hand-h` chỉ chừa 39px (`LocationHand.vue:37`). Ở 1366×768 chân panel nằm y 670–722, tay bài bắt đầu từ y 656: bị che hoàn toàn. 1280×720 cũng vậy; 1440×900 che một nửa nút. Chỉ 1920×1080 là thấy đủ. |
| A2 | Trên điện thoại, thanh game bar vỡ: cao 100px, các nút Map / Card board / Actions / Arrange rộng 34px chồng lên nhau và tràn khỏi mép phải (x 338–423 trên màn 375). Nút mở log cũng nằm ngoài màn hình. | Thanh map bị teleport vào `#game-bar-scene-slot`, slot này còn 0–17px. |
| A3 | Ở 1024×768 (cửa sổ chuột) slot còn 287px, các nút thanh map chồng chữ lên nhau. | Ảnh chụp 1024×768. `collapsedBar` chỉ bật cho `tablet-portrait`. |
| A4 | Nút bật **Team panel** không thể bấm tới. | Nút 👥 nằm trong `.zoom-controls`, khối này chỉ vẽ khi `canZoom`, mà `MAP_ZOOM_ENABLED = false`. Team mặc định ẩn nên người chơi không có cách nào mở. |
| A5 | Trên điện thoại, thanh tab điều tra viên (sticky) che nút End turn ở cuối panel hành động. | Ảnh 375×812 sau khi cuộn. |
| A6 | Thẻ phóng to khi rê chuột đè lên chính info card vừa mở, che nút Move / Investigate. | Ảnh 1440×900 sau khi bấm plate. |

### B. Thông tin lặp và yếu tố thừa

| # | Vấn đề |
|---|---|
| B1 | Chữ trên lá địa điểm hiện tới bốn lần cùng lúc: khối About trong panel, mục "Location & Scenario" ngay bên dưới (cùng dòng Resign), info card, và thẻ phóng to khi rê chuột. |
| B2 | Hai nút End turn: dưới lá điều tra viên (`Investigator.vue:700`) và ở chân panel. |
| B3 | Số hành động còn lại hiện ở ba nơi: đầu log, chân panel, tab người chơi. |
| B4 | Info card (290px) mở cạnh panel (280px): hai cột chữ che 570px của bản đồ, trong khi bấm vào địa điểm đang đứng thì nội dung hai cột gần như giống nhau. |
| B5 | Tài liệu `docs/scene-maps.md` nói có pinch-zoom/pan nhưng tính năng đang tắt. |

### C. Bố cục không co giãn theo chỗ trống thật

| # | Vấn đề | Bằng chứng |
|---|---|---|
| C1 | Bố cục chọn theo bề rộng **cửa sổ** và loại con trỏ, không theo bề rộng **vùng map**. Log chiếm 205–300px nên vùng map hẹp hơn nhiều. Cửa sổ chuột hẹp luôn là `desktop`. | 1280×720: map thấy được 673px. 1024×768: 461px. 820×1180: 308px, các plate dồn vào một dải hẹp. |
| C2 | Mission strip tự xuống dòng, ăn chiều cao map. | Cao 69px ở 1920, 85px ở 1366, 92px ở 1280, 104px ở 1024, 156px ở 820, 202px ở điện thoại. |
| C3 | Fit to screen ở 1366×768: map còn 351px cao, panel 327px chỉ đủ hiện khối About, phải cuộn mới thấy Investigate. Log bị ẩn nên không còn chỗ nào báo đang ở phase nào, lượt của ai. | Số đo fit-screen. |
| C4 | Điện thoại: map cao 281px, plate phóng to theo chuẩn 44px nên đè lên nhau và che gần hết tranh; trang dài (strip 202 + map 281 + panel 607). | Ảnh 375×812. |

### D. Dễ đọc và phản hồi

| # | Vấn đề |
|---|---|
| D1 | Plate đè lên nhau và nút di chuyển ↔ nằm đè lên tên plate ("Miskato↔Quad") khi map hẹp hơn khoảng 1000px. |
| D2 | 14 nút trong scene map nhỏ hơn 24px (nút thanh map cao 21px), dưới mức tối thiểu WCAG 2.5.8 cho chuột. Cỡ chữ nhỏ nhất 10px. |
| D3 | Khi tải ván, bàn trống khoảng 15–20 giây (chỉ thấy tay bài), không có chỉ báo đang tải. |
| D4 | Trạng thái nút chỉ phân biệt bằng màu viền (xanh = đi được, vàng = đang đứng); chú giải nằm sau nút "? Legend". |

## Mục tiêu

Ở mọi kích thước từ 375×667 đến 1920×1080, bằng chuột hoặc ngón tay: không nút nào bị che, mỗi thông tin chỉ có một chỗ ở, vùng map luôn là phần lớn nhất của màn hình, và người mới nhìn vào biết ngay lượt của ai, bấm vào đâu.

## Không làm

- Không đổi tranh nền, toạ độ anchor, hay logic chọn choice (mỗi nút vẫn gửi đúng index cũ).
- Không viết lại Card Board, log, hay khu vực người chơi ngoài những chỗ scene mode đang dùng chung.
- Không bật lại zoom/pan trong plan này (chỉ gỡ phụ thuộc vào nó và sửa tài liệu).
- Không thêm tính năng chơi mới.

## Phases

| # | Giai đoạn | Giải quyết | Trạng thái |
|---|---|---|---|
| 1 | [Sửa che khuất và nút không bấm được](./phase-01-fix-occlusion-and-unreachable-controls.md) | A1, A4, A5, A6 | Code xong, đã thử trên trình duyệt. A6 hết vì info card đã gộp vào panel; thẻ phóng to khi rê chuột vẫn như cũ |
| 2 | [Bố cục theo bề rộng vùng map](./phase-02-container-driven-layout.md) | C1, C3, C4 | Code xong, đã thử. Điện thoại giữ panel dưới map (không đổi sang bottom sheet), map cao 52dvh |
| 3 | [Thanh điều khiển và mission strip co giãn](./phase-03-responsive-bar-and-mission-strip.md) | A2, A3, C2 | Code xong, đã thử. Mission strip gập thành hàng chip khi map dưới 1100px (mở bằng ▾), không làm popover riêng |
| 4 | [Gộp panel, bỏ thông tin lặp](./phase-04-single-location-panel-dedup.md) | B1–B4 | Code xong, đã thử. Làm theo phương án gộp; `LocationInfoCard.vue` đã xoá |
| 5 | [Plate, đường nối, cỡ chữ, trạng thái](./phase-05-plate-legibility-and-feedback.md) | D1–D4, B5 | Code xong, đã thử. Plate dạng gọn riêng cho map hẹp chưa làm |
| 6 | [Kiểm tra ma trận màn hình](./phase-06-verify-screen-matrix.md) | tất cả | Đã thử 1920×1080, 1366×768 (+ Fit to screen), 1280×720, 1024×768, 820×1180 chuột, 375×812 cảm ứng. Chưa thử: 1440×900 sau khi sửa, iPad cảm ứng, scenario dạng lưới/đảo và cutaway The Gathering |

Thứ tự: phase 1 độc lập, làm trước vì là lỗi đang chặn người chơi. Phase 2 là nền cho 3 và 4 (cả hai đọc lớp bố cục mới). Phase 3 và 4 sửa file khác nhau nên làm song song được. Phase 5 sau 2 (plate compact phụ thuộc lớp bố cục). Phase 6 cuối, và chụp nhanh sau mỗi phase.

## Tiêu chí hoàn thành

- [ ] Ở cả 8 kích thước trong ma trận phase 6, nút End turn và mọi nút của thanh map nằm trọn trong màn hình, không bị phần tử nào đè (kiểm bằng `elementFromPoint` tại tâm nút).
- [ ] Team panel bật/tắt được từ thanh map khi ván có từ hai điều tra viên.
- [ ] Chữ của một lá địa điểm chỉ hiện một lần trên màn hình tại một thời điểm; chỉ còn một nút End turn nhìn thấy được.
- [ ] Vùng map không bị cột nào che quá 40% bề rộng; dưới 700px bề rộng vùng map thì panel là bottom sheet.
- [ ] Mission strip không cao quá 64px khi vùng map từ 700px trở lên, và không quá 96px trên điện thoại.
- [ ] Không còn hai plate đè lên nhau quá 25% diện tích ở ván Extracurricular Activity tại 1024×768 và 375×812.
- [ ] Nút trong scene map cao tối thiểu 24px với chuột, 44px với ngón tay; chữ nhỏ nhất 11px.
- [ ] Ở 1920×1080 giao diện không xấu đi: so ảnh trước/sau, khác biệt chỉ nằm ở các mục đã liệt kê.
- [ ] `npm test`, `npm run tc`, `npm run lint` qua; có test node cho hàm chọn lớp bố cục mới.

## Rủi ro

- `LocationMap.vue` (536 dòng) và `LocationMapCanvas.vue` (1052 dòng) dùng CSS một dòng dày đặc; sửa bố cục dễ va vào các scenario đặc biệt (cutaway, dream grid, đường High Gear). Phase 6 phải chụp ít nhất một ván mỗi loại.
- Plan `261108-1225-tablet-scene-map-ux` còn dở ở bước thử trên iPad thật. Plan này đổi cách chọn lớp bố cục (phase 2) nên phải giữ nguyên hành vi `tablet-portrait` / `tablet-landscape` đã làm, chỉ thêm nguồn quyết định mới.
- Gộp info card vào panel (phase 4) đổi thói quen của người đang chơi. Cần người dùng chốt trước khi làm (xem câu hỏi 1).

## Câu hỏi chưa chốt

1. Phase 4 đề xuất gộp info card vào panel bên phải (một cột, hai trạng thái "đang đứng" / "đang xem"). Đồng ý gộp, hay giữ info card riêng và chỉ bỏ phần chữ lặp?
2. Khi panel hành động đang mở, ẩn hẳn nút End turn dưới lá điều tra viên, hay giữ cả hai?
3. Trên cửa sổ hẹp (vùng map dưới 700px), có cho log tự thu lại để nhường chỗ cho map không, hay luôn để người chơi tự đóng?
4. Zoom/pan đang tắt (`MAP_ZOOM_ENABLED = false`): giữ tắt và sửa tài liệu, hay muốn bật lại trong một plan riêng?
