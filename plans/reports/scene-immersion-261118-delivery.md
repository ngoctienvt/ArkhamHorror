# Scene immersion — kết quả triển khai 18/11

Trạng thái: đã tích hợp các bộ ảnh hoàn thành; **chưa hoàn tất toàn bộ plan** vì GPT Image hết hạn mức ở hai gói cuối.

## Đã giao

- 297 tài sản GPT Image đã xuất vào `frontend/public/img/scenes/`: 213 sprite có alpha, 84 panorama/nền/biến thể. [Manifest nguồn](../261117-2321-scene-immersion-audit/generated-art.json).
- Chuyển cảnh theo location lifecycle: Heart Madness, Film Fatale, Dagon, Apiary, Guardians, Phantom, Carnevale; giữ Alaska khi mở lair.
- Lưới/phòng đổi vị trí: Antarctic, Fatal Mirage, Court, Grand Vault, Wendigo, Circus, Electric Nightmare, Unstuck và Time Runs Out.
- Biến thể cục bộ: Boundary, Fragment of Carcosa homebrew, Strange Moons, Usher, Constellation, Queen of Ash, School/A Year to Plan; Zann đã bỏ các nêm tiêu âm khổng lồ trông như chông.
- Thêm panorama các homebrew thiếu, End of Seasons có backend; alias tám challenge và location thay thế Relics. Không sửa campaign Dunwich/Carcosa do chat khác phụ trách; bỏ qua bảy Vespers shell theo yêu cầu.
- Bộ chọn dùng snapshot công khai, không cần ghi nhớ lịch sử client. Phòng úp dùng hình chung; bản sao cùng mã vẫn theo ID riêng. Giữ debug log `[Scene Map] Artwork changed`.

## Kiểm chứng và giới hạn

73/73 tests stage/off-map/graph đạt, typecheck đạt, production compile đạt. Các test kiểm cả ảnh nền, tile/back, mask layer và figure có file thật. Manifest không có file thiếu; mọi sprite có alpha. Đã duyệt toàn bộ contact sheets và các Chrome fixture chính. [Log tests](../261117-2321-scene-immersion-audit/validation-tests.log), [typecheck](../261117-2321-scene-immersion-audit/validation-typecheck.log), [build](../261117-2321-scene-immersion-audit/validation-build.log).

Review bằng `ak-code-review` không tìm thấy lỗi runtime xác nhận trong selectors/renderer và các backend đã đối chiếu. Chưa mount/playtest toàn bộ Vue game với backend; không chứng nhận chính xác tuyệt đối mọi màn và mọi nhánh. Một số atlas fixture hiển thị mọi hình khả dụng để kiểm khung, không phải setup gameplay hợp lệ. Build vẫn có cảnh báo chunk lớn và eval từ lottie hiện hữu.

## Còn bị chặn

1. Dead Heat: mới hiệu chỉnh điểm địa danh, chưa tạo được bộ ngày/đêm/dây leo/vườn cháy. Đã khóa diễn biến theo Agenda 1B, Act 3 và nhánh Amaranth 2B.
2. Fate of the Vale: chưa tạo được sprite Mirror Nest/Abyss và tích hợp các bố cục tương ứng. Nhánh làng đêm hiện có vẫn giữ.

Hai batch đều nhận HTTP 429 `usage_limit_reached`; đã gỡ code thử nghiệm tham chiếu ảnh chưa có. Không dùng Gemini hay API CLI thay thế. [Nguồn, prompt và bước hoàn tất](../261117-2321-scene-immersion-audit/blocked-art.md), [plan hiện tại](../261117-2321-scene-immersion-audit/implementation.md).
