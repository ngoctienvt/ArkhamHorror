# Dọn lượt test mặc định

Status: complete.

Người dùng ưu tiên Việt/Anh, cho phép thiếu dịch Trung và muốn giảm thời gian tests. Giữ regression gameplay/Scene Map/decoder; không xóa assertion chỉ vì đang fail. Không sửa dữ liệu dịch/campaign của chat khác.

- [x] Tách 5 suite Trung thành lượt tùy chọn; mặc định markup/icon chỉ kiểm en/vi. Vẫn có lệnh chạy mọi ngôn ngữ.
- [x] Bỏ khởi tạo/biên dịch Vite lặp lại cho chín suite hàm thuần, đóng server khi xong file. Giữ isolation của store/registry tests.
- [x] Sửa normalize dấu phân cách Windows trong kiểm tra locale backend; giữ nguyên allowlist hiện có.
- [x] Chạy tests trọng tâm và toàn bộ profile mặc định; đo thời gian và ghi rõ giới hạn. Cập nhật README phần Tests.

Baseline trước dọn: full suite 627 tests, 625 đạt, 2 lỗi; 289.5 giây ở concurrency 2. Riêng arkhamBuildImport 15 tests với watcher tắt nhưng vẫn tạo server mỗi test: 100.5 giây. Sau dọn phải giữ 15 assertions này và đo lại. Không dùng số tests giảm làm thước đo chất lượng.

Kết quả cuối: `npm test` **609/609 đạt, 116.2 giây**, giảm khoảng **60%** so với lượt baseline 289.5 giây cùng concurrency 2. Một lượt trung gian sau bốn suite cache đạt 609/609 trong 162.8 giây. Kết quả đo phụ thuộc tải máy; đây là số thực tế từ các log, không phải cam kết thời gian cố định.

Assertions gameplay/Scene Map được giữ nguyên. Dọn setup SSR lặp lại ở achievementParts, arkhamBuildImport, customCardExport, debugPlayer, debugSandbox, debugScenarioJump, debugSeals, engineMessageActions và localeIconPlaceholders. Với các suite không cần isolation mới, lần đầu biên dịch, các test sau nạp module cache; riêng case SSR đổi localStorage trong localeIconPlaceholders vẫn có server mới. Store/registry tests không dùng cache chung.

`npm test` chọn 83 file; `test:locales` chọn 7 file kiểm locale, `test:all` chọn đủ 88 file và mở lại kiểm mọi ngôn ngữ. Năm suite Trung không bị xóa: ultimatumsAndBoonsZh, whisperingChaosTranslations, zhCnAchievements, zhCnLocaleLoading, zhCnScenarioLocale. Không chạy lại optional locale completeness vì người dùng đã cho phép thiếu tiếng Trung; lỗi thiếu khóa dịch vẫn có thể xuất hiện khi chủ động chạy lượt đó.

Kiểm chứng: 32 tests trọng tâm đạt; lượt mặc định cuối đạt 609/609; ESLint các test/helper sửa đạt; `node --check` runner/helper đạt; kiểm danh sách cả ba profile. Code review bằng `ak-code-review` xác nhận không mất assertions hoặc thêm rò state trong chín suite cache. Không đổi production code hoặc dịch nội dung mới.

Log: `validation-core-final.log` (cuối), `validation-core.log` (trung gian), `validation-lint.log`; các log đo ban đầu/trọng tâm nằm trong `../261117-2321-scene-immersion-audit/validation-test-speed.log` và `validation-test-cleanup-focused.log`.
