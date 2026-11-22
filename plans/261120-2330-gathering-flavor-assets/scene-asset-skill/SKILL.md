---
name: arkham-scene-assets
description: Tạo, kiểm tra và tích hợp asset trong suốt vào Scene Map Arkham Horror LCG, dựa trên flavor text, trạng thái ván và phối cảnh tranh hiện có.
---

# Asset cho Scene Map Arkham

Dùng khi thêm đồ vật hoặc hiệu ứng hiển thị theo trạng thái lên một cảnh hiện có. Tôn trọng lựa chọn của người dùng: chỉ thêm ở vị trí cố định khi thật sự có thể hòa vào nền; bỏ qua vị trí chia ngẫu nhiên hoặc vật thể cần sửa địa hình nếu không có vị trí phù hợp. Không phủ texture sàn, tường hay mảng lớn chỉ để bắt chước biến đổi môi trường.

## Khảo sát

1. Đọc intro, cả hai mặt flavor và luật của location/Act/Agenda trong dữ liệu lá; phân biệt nội dung công khai khi lá úp với nội dung chỉ biết sau khi lật. Đọc scenario, card definitions và xử lý backend để xác minh setup, set-aside, các nhánh, modifier, phiên bản Return to và vòng đời.
2. Xem ảnh đang dùng, các biến thể và điểm neo. Với một vật thể hãy ghi mã lá, ý nghĩa, điều kiện bắt đầu/kết thúc, đối tượng neo và tọa độ. Không tự thêm dây xích, chướng ngại hoặc sinh vật khi câu chuyện không nói; không vẽ cố định enemy hay ally đã có entity.
3. Chỉ dùng snapshot có thể khôi phục sau reload/undo. Sự kiện một lần hoặc nhánh bị mất khi sang Act sau không đủ làm cờ bền vững. Nếu không xác định được trạng thái chính xác thì không tự đoán; ghi hạn chế.

## Tạo và ghép

4. Với vật thể phù hợp, dùng image generation tạo asset riêng có alpha, cùng góc nhìn, kích thước, ánh sáng và bảng màu với nền; không chữ, biểu tượng, khung bài hoặc nền giả. Giữ ảnh gốc và kiểm tra alpha. Không giả định asset đẹp ở kích thước gốc sẽ đẹp khi thu nhỏ.
5. Thử ghép lên từng ảnh thực tế dùng chung bố cục, gồm các biến thể Act/Agenda và Return to. Kiểm chân vật thể chạm đúng mặt đất/bàn, hướng sáng, mép alpha, lớp che trước/sau, tỷ lệ, nhãn và token. Dùng đúng hình học renderer: `StageBoard.figures` neo tại đáy khung và `object-fit: contain` có thể tạo khoảng trống; kiểm ở desktop, mobile và zoom nếu có thể. Không giao hình nổi hoặc đè lệch nền như thể đã hoàn chỉnh.
6. Tái dùng renderer và patterns hiện có, gắn ảnh theo trạng thái có thật và scenario chính xác. Giữ tương tác, thứ tự lớp, state, debug log DEV và các thay đổi khác. Không lộ mặt úp; tái xuất hiện đúng sau undo, reload, thay modifier và các nhánh.

## Kiểm tra

7. Thêm test tập trung cho trước/sau, mọi biến thể, vắng lá, bản gốc/Return, undo và các trường hợp đặc biệt có thể xảy ra. Chạy test gần nhất và typecheck. Duyệt ảnh ghép; nếu có local game, xác minh UI trong ván và ở các kích cỡ. Nếu chưa làm được, báo rõ giới hạn, không khẳng định đã kiểm tra trực tiếp.
8. Ghi những trường hợp đã xét nhưng bỏ qua cùng nguyên nhân cụ thể; cập nhật tài liệu hành vi khi cần. Không coi thiếu asset là lỗi nếu nó không hòa được tự nhiên hoặc thiếu trạng thái đáng tin cậy.
