# Scene immersion — kết quả triển khai 18–19/11

Trạng thái: **hoàn tất triển khai trong phạm vi**. Hai gói cuối từng bị hạn mức đã tạo và tích hợp ngày 19/11; không còn ảnh chờ tạo. Chưa playtest mọi ván backend. Hai lỗi của lượt test ban đầu đã được xử lý ở bước dọn tests theo yêu cầu người dùng: sửa path Windows, đưa completeness tiếng Trung thành tùy chọn; lượt mặc định hiện đạt 609/609.

## Đã giao

- 304 tài sản GPT Image đã xuất vào `frontend/public/img/scenes/`: 217 sprite có alpha, 87 panorama/nền/biến thể. [Manifest nguồn](../261117-2321-scene-immersion-audit/generated-art.json).
- Chuyển cảnh theo location lifecycle: Heart Madness, Film Fatale, Dagon, Apiary, Guardians, Phantom, Carnevale; giữ Alaska khi mở lair.
- Lưới/phòng đổi vị trí: Antarctic, Fatal Mirage, Court, Grand Vault, Wendigo, Circus, Electric Nightmare, Unstuck và Time Runs Out.
- Biến thể cục bộ: Boundary, Fragment of Carcosa homebrew, Strange Moons, Usher, Constellation, Queen of Ash, School/A Year to Plan; Zann đã bỏ các nêm tiêu âm khổng lồ trông như chông.
- Thêm panorama các homebrew thiếu, End of Seasons có backend; alias tám challenge và location thay thế Relics. Không sửa campaign Dunwich/Carcosa do chat khác phụ trách; bỏ qua bảy Vespers shell theo yêu cầu.
- Bộ chọn dùng snapshot công khai, không cần ghi nhớ lịch sử client. Phòng úp dùng hình chung; bản sao cùng mã vẫn theo ID riêng. Giữ debug log `[Scene Map] Artwork changed`.

## Kiểm chứng và giới hạn

78/78 tests stage/off-map/graph đạt; lint phần thay đổi, typecheck và production compile đạt. Các test kiểm cả ảnh nền, tile/back, mask layer và figure có file thật. Manifest không có file thiếu; mọi sprite có alpha. Đã duyệt contact sheets và các Chrome fixture chính, gồm 9 preview cho hai gói cuối. [Log tests](../261117-2321-scene-immersion-audit/validation-tests.log), [typecheck](../261117-2321-scene-immersion-audit/validation-typecheck.log), [lint](../261117-2321-scene-immersion-audit/validation-lint.log), [build](../261117-2321-scene-immersion-audit/validation-build.log).

Review bằng `ak-code-review` không tìm thấy lỗi runtime xác nhận trong selectors/renderer và các backend đã đối chiếu. Chưa mount/playtest toàn bộ Vue game với backend; không chứng nhận chính xác tuyệt đối mọi màn và mọi nhánh. Một số atlas fixture hiển thị mọi hình khả dụng để kiểm khung, không phải setup gameplay hợp lệ. Build vẫn có cảnh báo chunk lớn và eval từ lottie hiện hữu.

## Hai gói cuối đã hoàn tất

1. Dead Heat: có bộ ngày/đêm/dây leo và sprite lửa nhỏ trong vườn. Đêm theo Agenda 1B, dây leo theo Act 3; lửa chỉ ở nhánh Amaranth `09537b`. Giữ cùng điểm địa danh, hỗ trợ Undo.
2. Fate of the Vale: Nest/cave sprites theo ô hiện tại, backs chung, bản sao giữ ID riêng. Abyss một ảnh chiếm vùng 2×2 ô; nhánh về làng chuyển panorama đêm và bỏ bàn cũ.

Không dùng Gemini hay API CLI thay thế. [Nguồn và chi tiết hoàn tất](../261117-2321-scene-immersion-audit/blocked-art.md), [plan hiện tại](../261117-2321-scene-immersion-audit/implementation.md).

## Lỗi kiểm tra ngoài phạm vi còn lại

Full frontend suite chạy đến kết quả **625/627 đạt**. Hai lỗi không nằm trong các module Scene Map vừa sửa: `scenarioLocalization.test.mjs:56` phát hiện text backend hardcoded ở InTheShadowOfEarth, FatalMirage và ThePallidMask; `ultimatumsAndBoonsZh.test.mjs:24` phát hiện catalog tiếng Trung thiếu khóa Ultimatum/Boon. Không sửa campaign/backend của chat khác hoặc làm yếu tests. [Log đầy đủ](../261117-2321-scene-immersion-audit/validation-frontend-tests.log).

Sau đó xác nhận lỗi thứ nhất là dấu phân cách Windows không khớp allowlist có sẵn; đã normalize path, không thêm ngoại lệ. Theo ưu tiên Việt/Anh do người dùng yêu cầu, kiểm tra Trung chuyển thành lượt tùy chọn. Assertions Scene Map/gameplay giữ nguyên. [Kết quả dọn test: 609/609 đạt, 116.2 giây](../261119-0003-test-suite-cleanup/plan.md).
