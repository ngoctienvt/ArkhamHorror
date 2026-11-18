# Scene Map theo địa điểm và Act/Agenda

Đã bổ sung hoặc thay 17 WebP 1920×1080 bằng công cụ GPT Image tích hợp, ở tám màn ngoài phần Dunwich/Carcosa do agent khác phụ trách. Đã xem ảnh với điểm neo chồng, giải mã từng WebP và kiểm tra lựa chọn tranh từ snapshot.

## Kết quả

| Màn | Điều kiện chọn cảnh | Nội dung sửa |
|---|---|---|
| River of Blood | Agenda 1/3 ban ngày, 2/4 ban đêm, mặt B chuyển sang giai đoạn kế. Bộ Dusk bắt đầu lúc hoàng hôn | Bổ sung hai nền ngày/đêm dùng chung hình học và ghim của tám nơi |
| New Horizons | Bộ mã Day/Night xác định ánh sáng, mã hang 13049–13057 xác định mở mặt cắt | Bổ sung nhà máy khi chưa mở hang ở cả ngày/đêm, và mặt cắt hang ban đêm. Ghép với nền hang ban ngày đã có |
| Blood Money | Foyer đổi sang 13076b | Bổ sung Bloody Night, bối cảnh tối và dấu vết bạo lực nhẹ trong sảnh |
| The Wages of Sin và Return to | Mã location mặt b cho Spectral cục bộ, từ Agenda 1B cho toàn cảnh | Vẽ lại nền vật lý và thêm nền Spectral. Attic là mặt cắt tầng mái, Crypt ở dưới nền đất |
| In Too Deep và Return to | Agenda 1A, 1B/2A, 2B/3A, 3B/4A | Bổ sung early tide, midtown tide và high tide. Nền cũ làm mức coastal surge. Hiệu chỉnh 15 ghim |
| The Vanishing of Elina Harper và Return to | Dùng nền thị trấn ở giai đoạn tìm kiếm | Sửa mảng lỗi ở bờ biển, dọn chữ trang trí, làm rõ nhà tù, cửa hàng và các lối vào, căn lại 13 ghim |
| The Doom of Arkham Part II | Mã lá thay thế 11692–11698 cho từng khu Ruined | Nền đầu có Rivertown đã hủy hoại. Chỉ phủ tranh hủy hoại lên các khu đã bị thay lá, bằng mặt nạ vùng mềm |
| The Secret Name và Return to | Keziah's Room 05133 xuất hiện sau Act đầu | Ba nền gồm nhà trọ, Otherworld bản gốc và Otherworld Return to. Bốn phòng Return to có địa danh riêng, hai Strange Geometry có hai điểm. Vị trí sau khi lật theo mã lá và ID từng bản |

Các bộ thay thế cùng hình học giữ góc zoom. The Secret Name đổi toàn bộ bố cục nên đặt lại góc nhìn. Có debug log khi ảnh Scene Map đổi trong bản development.

## Tài sản đã tích hợp

Đường dẫn tính từ `frontend/public/img/scenes/`.

| Thư mục | File |
|---|---|
| children-of-blood | river-of-blood-day.webp, river-of-blood-night.webp |
| children-of-blood | new-horizons-night.webp, new-horizons-factory.webp, new-horizons-factory-night.webp |
| children-of-blood | blood-money-bloody-night.webp |
| the-circle-undone | the-wages-of-sin.webp, the-wages-of-sin-spectral.webp |
| the-circle-undone | the-secret-name-house.webp, the-secret-name-otherworld.webp, the-secret-name-return-otherworld.webp |
| the-innsmouth-conspiracy | in-too-deep-early-tide.webp, in-too-deep-midtown-tide.webp, in-too-deep-high-tide.webp |
| the-innsmouth-conspiracy | the-vanishing-of-elina-harper.webp |
| the-drowned-city | the-doom-of-arkham-part-2.webp, the-doom-of-arkham-part-2-ruined.webp |

## Đặc tả prompt đã dùng

Các biến thể dùng ảnh tham chiếu, yêu cầu giữ góc máy, khung 16:9, silhouette, cửa và sàn của cùng bố cục. Tranh sạch, phong cách sơn dầu digital thập niên 1920, ánh sáng đủ đọc lối đi. Xuất WebP quality 88 sau khi chọn ảnh.

- River of Blood — đổi ánh sáng thành ban ngày hoặc nửa đêm, giữ đảo, cầu, bến và ngõ.
- New Horizons — giữ năm khu nhà máy. Trước khi mở hang, các khoang bí mật được che bằng nền đá và cửa xuống. Biến thể đêm có cửa sổ và bến hàng tối, đèn dầu giữ sàn rõ.
- Blood Money — giữ bố cục bảy phòng, chuyển ngoại cảnh sang đêm và thêm dấu vết hỗn loạn nhẹ tại Foyer.
- Wages of Sin — tạo mặt cắt mái nhà nguyện có tầng áp mái, hầm mộ dưới nền đất, sáu mốc ngoài trời và trong công trình nhận diện riêng. Biến thể Spectral chỉ đổi ánh sáng và sương.
- Innsmouth — early tide có phố còn trên mặt nước, midtown tide cho nước tràn phố giữa, high tide tăng ngập các phố thấp. Làm sạch chữ sông và mảng lỗi bờ biển trong Vanishing.
- Doom of Arkham II — giữ vortex Rivertown giữa tranh, khôi phục các công trình quanh nó cho nền ban đầu. Từ nền này tạo ảnh các khu bị nước và hủy hoại để phủ theo mã lá.
- Secret Name — tạo mặt cắt nhà trọ với năm không gian. Toàn cảnh sau Act có Keziah's Room ở giữa, sáu Unknown Places, Site of the Sacrifice và hai nhánh bậc thang. Return to bổ sung Temple of R'lyeh, Price Manor, 9th Ward và Library of Ebla.

## Kiểm chứng và giới hạn

- 101 test Scene Map thuộc nhóm đã chạy đều qua. Lượt kiểm tra tập trung loại riêng test tổng hợp Carcosa, vì agent khác đang hiệu chỉnh tọa độ và tài sản của campaign đó.
- Kiểm tra TypeScript bằng `npm --prefix frontend run tc` đã qua. Đã giải mã đủ 17 WebP 1920×1080, kiểm tra diff và thêm debug log cho quá trình đổi nền.
- Test bao gồm mặt A/B, sequence side B khi flipped chưa đồng bộ, hoàn tác trạng thái, mã Day/Night, Foyer trước/sau thay lá, Spectral cục bộ, Return to, hai Strange Geometry và nhiều khu Ruined cùng lúc.
- Đã đọc nhánh setup, Act, Agenda và định nghĩa location tương ứng trong backend. Những mốc luật là nguồn chọn trạng thái, mức lửa/nước/sương vẽ trên nền là diễn họa. Token trên location thể hiện trạng thái luật thực tế.
- Chưa kiểm tra bằng ván chơi trực tiếp, vì chưa có server lắng nghe ở localhost 8080/8090 khi kiểm tra. Đợt này kiểm chứng các màn trong bảng, chưa xác nhận mọi nhánh homebrew và mọi tổ hợp của toàn danh mục.
- Các lượt tạo thử Dunwich/Carcosa chồng phạm vi đã dừng. Hai ảnh nền vừa thay và phần tọa độ Mont Saint-Michel do lượt này sửa đã trả về trạng thái trước đó, sau khi kiểm tra đúng nội dung của mình. Agent kia tiếp tục phần đó.
