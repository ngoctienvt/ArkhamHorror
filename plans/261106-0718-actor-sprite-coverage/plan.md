---
title: "Sprite cho toàn bộ investigator và enemy"
description: "Đối chiếu artwork theo mã thẻ và tạo sprite cho Location Scene"
status: pending
priority: P1
created: 2026-11-06
---

# Sprite cho toàn bộ investigator và enemy

Mỗi investigator và enemy có thể xuất hiện trong Location Scene của frontend LCG có sprite trong suốt cùng phong cách với Roland và Ghoul. Lấy danh mục từ phiên bản game trong repo, gồm campaign tích hợp, homebrew có sẵn, enemy weakness, enemy đặc biệt và các dạng nhân vật xuất hiện trong scene. Thẻ custom do người chơi thêm sau khi phát hành tiếp tục dùng art của chính thẻ qua fallback.

| Giai đoạn | Nội dung | Trạng thái |
|---|---|---|
| [1](./phase-01-start.md) | Chốt roster và ảnh reference theo từng mã | Pending |
| [2](./phase-02-reference-pilot.md) | Tạo lô thử và chốt chuẩn hình | Pending |
| [3](./phase-03-production-integration.md) | Tạo hết các lô, tích hợp và nghiệm thu | Pending |

## Hiện trạng

- `frontend/public/img/scenes/actors/` có tám WebP từ demo. Roland, Rats, Ghoul Priest, Umôrdhoth và Hunting Nightgaunt là các mapping có sẵn cần xác minh bằng ảnh gốc trước khi duyệt lại. Lita nằm ngoài roster nếu game render dưới dạng ally.
- `sceneSprites.ts` gán cả `01172` Hunting Nightgaunt và `01175` Screeching Byakhee vào `nightgaunt.webp`. Ghoul và Cultist dùng ảnh chung theo trait. Các lượt hiển thị đó chưa được tính là hoàn thành.
- `frontend/public/cards.json` có 100 dòng investigator và 609 dòng enemy. Đây là số dòng metadata, gồm các bản in và có thể thiếu mã nội bộ. Số sprite cần tạo được chốt ở giai đoạn 1.

## Nghiệm thu

- [ ] 100% mã trong roster đã chốt có sprite riêng hoặc mapping dùng lại đã xác nhận cùng artwork và cùng hình dạng.
- [ ] Mỗi sprite có mã thẻ, reference đã mở và đối chiếu, dấu vết duyệt và đường dẫn đầu ra. Không còn hồ sơ thiếu reference hoặc asset ở thời điểm nghiệm thu.
- [ ] Scene tải đúng WebP trên các cấu hình phục vụ ảnh đang hỗ trợ. Kiểm tra ảnh đúng ở kích thước chơi thực tế trên desktop và mobile.

## Tiến độ sản xuất

- Lô đầu đã tích hợp 32 WebP tạo từ mặt thẻ đúng mã, gồm Core Set và năm investigator Dunwich. Core Set còn dùng hai sprite demo Roland và Swarm of Rats đã đối chiếu. Ghoul Priest, Umôrdhoth và Hunting Nightgaunt có sprite mới theo thẻ.
- [Danh sách reference và SHA-256](./generated-references.csv) ghi nguồn của từng ảnh tạo. Những phần cơ thể nằm ngoài khung tranh gốc được dựng thêm để tạo standee toàn thân.
- Đợt ưu tiên đã đủ 112 mã investigator và 55 mã enemy của The Feast of Hemlock Vale trong roster runtime. Thêm 57 sprite sơn dầu theo mẫu thành phố ban đêm, gồm 54 investigator và ba enemy Hemlock Vale. Giữ các sprite đã tích hợp từ những đợt trước.
- [Roster runtime](./runtime-roster.csv) ghi mã và đường dẫn sprite. Các enemy thuộc những campaign khác vẫn được theo dõi trong kế hoạch tổng.

Khi mở lô mới, đối chiếu vùng minh họa giữa các bản in trước khi gửi tạo. Chỉ dùng chung sprite nếu hình và hình dạng trùng nhau, kể cả khi mã hoặc thông số thẻ khác. Với artwork bán thân, dùng một sprite toàn thân làm mẫu khung hình và dùng lá bài đúng mã để giữ nhận dạng. Kiểm tra ảnh đầu ra thấy trọn hình người từ đầu đến chân hoặc toàn bộ hình dạng của quái trước khi tích hợp.

