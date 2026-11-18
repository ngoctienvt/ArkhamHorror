# Phase 4: Gộp panel, bỏ thông tin lặp

Giải quyết B1–B4. Cần phase 2. **Chờ người dùng chốt câu hỏi 1 và 2 trong plan.md trước khi làm.**

## Nguyên tắc

Mỗi thông tin có đúng một chỗ ở:

| Thông tin | Chỗ ở duy nhất |
|---|---|
| Tên, shroud, clue, doom của địa điểm | plate trên map |
| Chữ và flavor của lá địa điểm | panel bên phải, khối About (thu gọn được) |
| Khả năng bấm được của địa điểm | danh sách hành động trong panel |
| End turn và số hành động còn lại | chân panel |
| Ảnh lá bài đầy đủ | thẻ phóng to khi rê chuột / nhấn giữ |

## Việc cần làm

1. **Khối About không lặp khả năng (B1).** `LocationAboutBlock.vue` đang tách chữ lá bài thành từng dòng, kể cả dòng khả năng (Resign). Khi dòng đó cũng có trong danh sách hành động của panel (so theo `sourceId` và `kind` mà `attachText` đã gắn), About bỏ dòng đó. Kết quả: About chỉ còn traits, số liệu, hiệu ứng thụ động và flavor; khả năng chỉ hiện một lần, ở dạng nút bấm được.
2. **Một cột thay vì hai (B4), phương án đề xuất.** Bỏ info card nổi. Panel bên phải có hai trạng thái:
   - "Đang đứng": như hiện tại.
   - "Đang xem: tên địa điểm": khi bấm một plate khác. Đầu panel có nút "← về chỗ đang đứng". Nội dung là About của địa điểm đó, các đường nối (chip bấm được), và nút Move / Investigate / Choose nếu server đang cho phép. Các mục Basic, Enemies, In play ẩn đi vì không thuộc địa điểm đang xem.
   - Chân panel (End turn) giữ nguyên ở cả hai trạng thái.
   - Bấm plate của địa điểm đang đứng chỉ mở panel (nếu đang đóng), không tạo thêm gì.
   - Ở `narrow` panel là bottom sheet nên trạng thái "đang xem" cũng là sheet đó, không có sheet thứ hai.

   Phương án thay thế nếu người dùng muốn giữ info card: info card chỉ hiện khi địa điểm được bấm **khác** địa điểm đang đứng, và ở `medium` nó thay chỗ panel thay vì đứng cạnh.
3. **Một nút End turn (B2).** Trong scene mode, khi panel hành động đang hiện, ẩn nút End turn dưới lá điều tra viên (`Investigator.vue:700`). Khi panel đóng, nút đó hiện lại để người chơi luôn có một nút.
4. **Số hành động (B3).** Giữ ở chân panel và trên tab người chơi (tab cần cho ván nhiều người). Phần đầu log là thành phần chung với Card Board, để nguyên.
5. **Logic thuần tách riêng.** Việc quyết định "panel đang ở trạng thái nào, hiện mục nào" viết thành hàm thuần trong một file `.ts` không import Vue để test bằng node, theo mẫu `touchLayout.ts`.

## File

- `frontend/src/arkham/components/LocationActionPanel.vue` (thêm trạng thái "đang xem"; file sẽ vượt 300 dòng nên tách phần "đang xem" thành `LocationInspectSection.vue`)
- `frontend/src/arkham/components/LocationAboutBlock.vue`
- `frontend/src/arkham/components/LocationInfoCard.vue` (bỏ hoặc thu hẹp vai trò, tuỳ phương án)
- `frontend/src/arkham/components/LocationMap.vue` (`inspect`, `closeCard`, quản lý focus)
- `frontend/src/arkham/components/Investigator.vue` (điều kiện hiện End turn)
- file mới `frontend/src/arkham/location-panel-mode.ts` và test `frontend/tests/locationPanelMode.test.mjs`

## Kiểm tra

- Đứng ở Miskatonic Quad: chuỗi "Resign." xuất hiện đúng một lần trong DOM nhìn thấy được của scene map.
- Bấm Orne Library: panel chuyển sang "Đang xem", có nút Move; bấm "← về chỗ đang đứng" quay lại danh sách hành động; Escape cũng quay lại và focus trở về plate đã bấm.
- Khi server yêu cầu chọn địa điểm (`selectIndex !== -1`), bấm plate vẫn gửi choice ngay như cũ.
- Panel mở: chỉ một nút End turn nhìn thấy. Đóng panel: nút dưới lá điều tra viên hiện lại.
- Bàn phím: Tab đi qua plate, panel, chân panel theo thứ tự đọc.

## Rủi ro

Info card hiện dùng cho cả địa điểm ngoài map (Holding Cells, `isolatedIds`) và được mission strip gọi qua `@inspect`. Trạng thái "đang xem" phải nhận cả hai nguồn đó.
