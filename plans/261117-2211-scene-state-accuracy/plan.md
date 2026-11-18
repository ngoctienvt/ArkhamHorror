# Scene Map theo vòng đời địa điểm

Đã hoàn tất phạm vi tám màn bên dưới. Đã tích hợp 17 ảnh, qua 101 test Scene Map tập trung và kiểm tra TypeScript. Dunwich/Carcosa do agent khác phụ trách theo xác nhận của người dùng.

## Mục tiêu

Cải thiện nhận diện địa điểm và chọn tranh theo trạng thái hiện tại của ván. Đối chiếu backend trước khi tạo ảnh, kiểm tra điểm neo trên ảnh cuối, giữ hành vi tải lại và hoàn tác.

## Phạm vi

- River of Blood, New Horizons, Blood Money, The Wages of Sin, In Too Deep, The Vanishing of Elina Harper, The Doom of Arkham Part II, The Secret Name.
- Giữ các biến thể Extracurricular Activity đang được chỉnh trong workspace.
- Tái sử dụng nền và sprite động đã có cho các màn xây lại lưới. Theo dõi nước theo location bằng token hiện có, chọn nền theo các mốc môi trường có bằng chứng.

## Thực hiện

1. Đọc setup, Act, Agenda, mã location và cấu hình Scene Map.
2. Tạo ảnh bằng GPT Image tích hợp. Các biến thể cùng cảnh dùng chung bố cục.
3. Hiệu chỉnh ghim và lựa chọn ảnh từ snapshot. Hiện riêng các khu Ruined theo lá thay thế ở Doom of Arkham II.
4. Thêm regression tests và chạy TypeScript. Ghi kết quả kiểm tra trong báo cáo.

## Nghiệm thu

- Location cùng tồn tại có điểm riêng, phòng nằm đúng trong công trình.
- Ngày/đêm, khám phá hang, chuyển Spectral và hủy hoại đúng mốc backend.
- Lá úp chuyển từ cửa/ô tạm vào nơi tương ứng khi lật, hai Strange Geometry giữ điểm riêng.
- Ảnh thay thế tải được, không đổi zoom khi bố cục giữ nguyên.
- Công khai phạm vi kiểm chứng, trạng thái chưa xác minh trong ván chơi trực tiếp.

Kết quả và giới hạn được ghi trong [báo cáo kiểm chứng](../reports/audit-261117-2211-scene-state-accuracy.md).
