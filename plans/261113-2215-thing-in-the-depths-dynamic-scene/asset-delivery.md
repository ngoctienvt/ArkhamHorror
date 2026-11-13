# The Thing in the Depths — bàn giao asset

Bộ ảnh dùng ImageGen trực tiếp. Có 14 sprite WebP 768×512 có alpha và một nền WebP RGB 2560×1440. Ảnh PNG gốc và 15 prompt nằm trong `art-src/thing-in-the-depths/`. Nền gốc từ ImageGen là 1672×941 và được căn về 16:9 khi phóng lên 2560×1440.

Hai bảng kiểm trong `art-src/thing-in-the-depths/review/` hiển thị mặt đất ở hàng trên và Open Water ở hàng dưới, theo thứ tự 10593–10599. Tất cả sprite có alpha bằng 0 ở bốn góc và giữa cạnh trên. Kích thước tệp sprite khoảng 80–117 kB. Muddy Fen và Covered Bridge giữ dáng thấp tự nhiên nên khoảng trống theo chiều dọc lớn hơn mục tiêu khoảng 10% ở một số mặt.

Bảy mặt Open Water của bộ bài cùng dùng một tranh đầm lầy. Mỗi sprite Open Water giữ địa hình, màu nhấn hoặc công trình từ mặt đất tương ứng để nhận ra cặp khi lật. Mặt đất được vẽ lại từ góc nhìn trên cao. Những chi tiết được thêm rõ nhất là thuyền buộc cạnh Rotten Dock, đèn ở Abandoned Shack và hoa tím trên mái Covered Bridge. Các sprite được chọn ở lần tạo trực tiếp đầu tiên. Một lượt thử ảnh nền qua CLI đã kết thúc sau khi đổi hướng và ảnh đó không được dùng trong bộ bàn giao.
