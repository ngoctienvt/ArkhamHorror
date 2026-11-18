# Rà soát Scene Map ngoài Dunwich / Carcosa

Status: completed — audit, không thay code hoặc ảnh game.

## Kết quả cần đạt

- Kiểm kê mọi scenario official còn lại, Return to, challenge và 49 scenario homebrew đã đăng ký.
- Tìm sai lệch giữa tranh/ghim hiện tại với vòng đời location; xác định lúc nên đổi toàn cảnh, giữ nhiều vùng hoặc dùng sprite theo ô.
- Phân biệt lỗi xác nhận từ source, đề xuất mỹ thuật và phần backend chưa hoàn thiện.
- Giữ nguyên Dunwich, Path to Carcosa và tài sản agent khác đang làm. Dark Matter: Fragment of Carcosa thuộc homebrew, vẫn trong phạm vi audit.

## Đã làm

1. Đọc README, docs Scene Map, hai skill overview/dynamic grid và các bộ chọn tranh hiện tại.
2. Quét 126 file scenario official trong phạm vi; đọc 49 đăng ký scenario homebrew; lưu inventory và các điểm thay location trong source.
3. Đối chiếu sâu các trường hợp thay bàn/đổi location, đọc Act, Agenda, Location, helper và dữ liệu lá tiếng Anh khi cần.
4. Xem 139 WebP cấp toàn cảnh trên năm contact sheet, không tính sprite con và không tính hai campaign bị loại trừ.
5. Lập báo cáo, ma trận từng mục, thứ tự thực hiện và giới hạn kiểm chứng.
6. Chạy probe chọn cảnh trên source hiện tại: xác nhận các trường hợp còn trả cùng ảnh, Unstuck bỏ qua đổi ô, Halls thiếu ghim và ID chưa hỗ trợ; kiểm liên kết/source/asset tồn tại.

## Tài liệu

- [Báo cáo](../reports/audit-261117-2321-scene-immersion.md)
- [Ma trận bao phủ](coverage.md)
- [Inventory source](inventory.json), [điểm thay location](lifecycle-events.json)
- [Script quét chỉ đọc](scan-scenes.py)

## Tiêu chí nghiệm thu audit

- Mọi file official và đăng ký homebrew trong inventory có phân loại; không coi việc có WebP là đã tích hợp.
- Phát hiện quan trọng có đường dẫn source và mô tả trigger, địa điểm còn/mất và hướng dựng cảnh.
- Ghi rõ chưa chạy ván thực tế, chưa kiểm mọi sprite và chưa thực hiện danh sách nâng cấp.
