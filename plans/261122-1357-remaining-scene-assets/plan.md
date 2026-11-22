# Asset cho các campaign và standalone còn lại

Trạng thái: đang thực hiện. Chỉ thêm vật thể có nguồn flavor, điểm neo cố định và ghép tự nhiên; không gắn cứng vào location xáo ngẫu nhiên hoặc tiết lộ mặt úp.

## Đã thực hiện

- Murder at the Excelsior Hotel: Office `84018`, giấy tờ và chìa khóa trên bàn khi được lật. Kiểm tra điều kiện, bỏ location và undo bằng test; cần kiểm tra trong ván thật.
- Room 212 `84016`: đã thử hộp lọ trên giường; loại bản thử vì che khung giường, không hòa cảnh.
- The Circle Undone, For the Greater Good: Ceremony Room `05214` nằm trong nhóm Sanctum Doorway xáo; không cố định altar vào một ô.
- The Unspeakable Oath: Kitchen `03172` đã có bếp và nồi trong nền; chưa tìm được vị trí thêm chi tiết mà không đè vật thể hiện có.
- The Scarlet Keys, Riddles and Rain: đàn quạ tại Tower of London `09516`, theo flavor mặt úp; chỉ xuất hiện khi lá có trong ván. Đã xem ảnh ghép và kiểm tra điều kiện, chưa kiểm tra trong ván thật.
- The Circle Undone, The Secret Name: các phòng `05130` và `05131` thuộc nhóm Decrepit Door xáo vị trí, không gắn đạo cụ cố định.
- The Feast of Hemlock Vale, Written in Rock: Control Station `10508` đổi ô trong quá trình chơi, không gắn thùng thuốc nổ vào nền cố định.

## Còn lại

- Rà từng campaign, Return to, standalone và scene homebrew có nền, dùng inventory `../261117-2321-scene-immersion-audit/coverage.md` làm điểm xuất phát; audit đó không thay thế kiểm tra flavor và vị trí asset.
- Đối chiếu location hai mặt, setup, backend, mọi biến thể nền và trạng thái công khai trước khi thiết kế asset.
- Với từng ứng viên hợp lệ: tạo và kiểm tra alpha, phối cảnh, lớp che, tỷ lệ; tích hợp theo snapshot, kiểm tra reload/undo và chạy test, typecheck.
- Kiểm tra ảnh thực tế trên giao diện ván khi có trạng thái phù hợp; ghi rõ những trường hợp không thể ghép tự nhiên.
