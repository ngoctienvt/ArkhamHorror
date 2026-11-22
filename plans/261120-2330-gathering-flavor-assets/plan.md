# Kế hoạch asset theo diễn biến The Gathering

Trạng thái: đề xuất, chưa triển khai. Phạm vi: The Gathering `01104` và Return to The Gathering `50011`. Mục tiêu là cho người chơi đọc được những thay đổi quan trọng trong căn nhà qua các lớp ảnh độc lập, dựa trên chữ của lá và snapshot thực tế; không thay luật, không vẽ lại toàn cảnh nếu một lớp ảnh phù hợp. Đây không phải kế hoạch cho toàn bộ Dunwich/Carcosa.

Điều chỉnh theo yêu cầu người dùng: bỏ phương án phủ sàn Hallway và các lớp texture biến đổi bề mặt tương tự. Chỉ xét asset đồ vật độc lập có thể đặt tự nhiên vào cảnh; các đề xuất môi trường hoặc sửa nền trong bảng dưới không còn thuộc phạm vi thực hiện.

## Nguồn đã đối chiếu

- Dữ liệu tiếng Anh hai mặt các lá trong `mcp/data/cards.json`: `01105`–`01115`, `50012`–`50024`; setup và vòng đời trong `backend/arkham-api/library/Arkham/Scenario/Scenarios/{NightOfTheZealot/TheGathering,ReturnToNightOfTheZealot/ReturnToTheGathering}.hs`.
- Xử lý Act/Agenda tại `backend/arkham-api/library/Arkham/{Act,Agenda}/Cards/` của hai scenario; đặc biệt `Trapped`, `MysteriousGateway`, `TheBarrier`, `WhatHaveYouDone`, `WhatsGoingOn`, `RiseOfTheGhouls` và `TheyreGettingOut`.
- Location gốc và Return trong `backend/arkham-api/library/Arkham/Location/Cards/`; tranh `house-cutaway.webp`, `study.webp`, `return-to-the-gathering.webp`; `frontend/src/arkham/scene-gathering-barrier.ts`, `components/LocationMap.vue`, `components/LocationMapCanvas.vue`, `hemlock-overview.ts`.
- Rào Parlor đã có asset và selector dựa trên location úp + modifier Blocked; giữ nguyên hành vi, bao gồm hoàn tác. Study gốc đang có nền riêng khi chỉ còn Study; Return dùng bố cục riêng. Return chọn ngẫu nhiên Attic/Cellar gốc hoặc Return, do đó không được chọn hình chỉ theo tên phòng.

## Ma trận asset đề xuất

| Ưu tiên | Asset và bằng chứng | Điều kiện / giới hạn |
|---|---|---|
| P1 | **Sàn đất, bùn và tường bẩn tại Hallway**: `01112` và `50017` mặt lật nói sàn gỗ đã thành đường đất, tường dính bùn. Ảnh gốc hiện vẫn là sàn gỗ bóng. | Khi Hallway tương ứng có mặt và đã lật; bám thực tế location, không đợi Agenda. Dùng lớp phủ khớp phối cảnh, không che rào, nhãn hoặc đường nối. Không tự suy diễn toàn bộ nhà biến đổi cùng lúc. |
| P1 | **Xác quái treo móc, máu nhỏ vào thùng ở Attic**: `01113` và `50018` đều mô tả chi tiết này; Act `01109` dùng thùng từ gác xép. | Chỉ khi Attic tương ứng đã lật; cả hai bản Attic đều có thể được chọn trong Return. Không gắn sinh vật sống hay biểu thị enemy. Bảo đảm cảnh đủ rõ nhưng không lấn nhãn. |
| P1 | **Lối xuyên bức tường mục, dính máu ở Return**: `50012` mặt B nói đập bức tường giữa bedroom và bathroom; `50017` là Hole in the Wall. | Ảnh Return đã vẽ sẵn lỗ tím, nên trước khi location xuất hiện dùng miếng tường phủ khít và bỏ khi location `50017` thực sự vào bàn; kiểm tra trường hợp location vào bàn sớm do Study `50013` đưa địa điểm có enemy spawn vào chơi. Vết tường hỏng là nội dung được xác nhận; màu tím/cửa vũ trụ là cách thể hiện mỹ thuật, không khẳng định lá yêu cầu. Kiểm phối cảnh vì tranh đặt các phòng khác topology mô tả. |
| P2 | **Phòng ngủ bị biến dạng**: `50015` mặt lật có ga rách, ký hiệu lạ, máu dưới cửa tủ. | Chỉ khi Bedroom đã lật. Bộ overlay ga/ký hiệu và vệt máu vừa đủ, tránh vẽ quái trong tủ như enemy đang ở đó; âm thanh nhai là flavor chứ không chứng minh enemy đã spawn. |
| P2 | **Phòng tắm ô nhiễm**: `50016` mặt lật có dịch xanh đặc trong bồn và mốc trên tường. Tranh hiện có bồn trắng sạch. | Chỉ khi Bathroom lật. Hai lớp phối cảnh hoặc một overlay gộp, không che điểm đứng. Không thể hiện âm thanh/mùi thành dấu hiệu cơ chế mới. |
| P2 | **Thang và vùng phía trên Attic Return**: `50018` có thang xuyên mái; `50019` khi lật là cánh đồng mộ, mỗi mộ mang một nhánh gia phả. | Thang khi `50018` lật; vùng mộ khi `50019` đã lật và ở trong play. Nền Return đã có xoáy trên mái nhưng chưa phải đồng mộ; thử overlay có chiều sâu và lớp che trước khi location có mặt. Nếu không thể làm rõ mà không phá phối cảnh, ghi giới hạn và đề xuất chỉnh cục bộ nền để làm lớp lót, không tự thay toàn cảnh. |
| P2 | **Hang băng và hố xác**: `01114`/`50020` mặt lật là đường hầm, hang băng thay cellar; `50021` mặt lật là hố ổ ghoul chứa xác thối. | Cellar đúng mã và đã lật: thêm cửa hang/băng nếu nền hiện tại chưa đủ. `50021` chỉ hiện hố xác sau khi lá đó được lật; nền Return đã có hang sâu, cân chỉnh asset theo phối cảnh. Không gắn bầy ghoul cố định. |
| P2 | **Nhà mục và sàn rạn nứt theo Agenda**: `01105` B tường mục, nhiều phòng thành đất; `01106` A sàn sụp, thấy đường hầm; B có ghoul phá đất. | Đánh giá overlay mục nát từ khi Agenda 1B đã diễn ra (Agenda 2 trở đi), các vết nứt từ Agenda 2A; kiểm mặt B và snapshot thực tế, không dựa vào số doom. Vị trí cụ thể là lựa chọn mỹ thuật. Không vẽ ghoul cố định hoặc xác định sàn sụp chặn đường nếu luật không nói. Xử lý riêng điều kiện Hallway đã biến đổi để tránh phủ trùng. |
| P3 | **Cửa trên sàn Study gốc**: `01108` B tìm thấy cửa dưới tấm thảm và nhảy xuống Hallway. | Đây là sự kiện chuyển tiếp; backend ngay sau đó chuyển investigator, bỏ Study và đổi nền. Chỉ làm hiệu ứng ngắn nếu event/mặt B thực sự được frontend cung cấp; không dựng từ Act 2 snapshot hay duy trì cửa trên Hallway. Nếu không có sự kiện tin cậy, ghi là không triển khai. |

Study Return có gateway ngay trong Act `50012` A; không nhầm gateway này với Hole in the Wall xuất hiện về sau. `01107` B và lựa chọn đốt nhà `01110` B kết thúc scenario: không hiển thị nhà cháy suốt Act 3, và chỉ xét hiệu ứng kết thúc nếu UI có trạng thái lựa chọn đáng tin cậy. Ghoul Priest, Lita và các enemy đã có entity riêng: chỉ hiển thị theo entity thực tế, không gắn vào ảnh nền. Rào Parlor không bị thay bằng rào chung theo mọi modifier.

## Trình tự thực hiện

1. **Khảo sát trạng thái và art**: kiểm `study.webp` và hai nền ở kích thước chạy thật; lập bảng card code, mặt lật, vị trí neo và điều kiện qua tất cả nhánh. Xác nhận dữ liệu Act/Agenda side, location trong play, revealed, modifier và event/undo có tới frontend; phân biệt trạng thái công khai với thông tin lá úp. Xác nhận `50017` có thể được đặt sớm và các trường hợp Attic/Cellar gốc hoặc Return.
2. **Tạo asset**: tạo PNG/WebP trong suốt, từng nhóm độc lập và cùng góc máy/ánh sáng với nền hiện hữu. Vẽ tường che lỗ Return thành lớp có nội dung đục; các chi tiết còn lại dùng alpha. Xem thử bằng cách chồng lên từng nền; lựa chọn màu/số lượng không có trong flavor phải ghi là mỹ thuật. Không tạo chữ giả, token, nhân vật hoặc lối đi giả.
3. **Tích hợp**: mở rộng selector hiện có hoặc tách helper tập trung nếu cần; tái dùng `StageBoard.figures`, đường original và Return trong `LocationMap.vue`, tránh biến thể riêng cho mỗi ảnh toàn cảnh. Chọn theo snapshot; không tính luật ở frontend. Xử lý thứ tự lớp, tỷ lệ, neo riêng từng nền, không nhận pointer, không đổi zoom/drag. Thêm debug log chỉ trong DEV cho thay đổi bộ asset / lý do chọn; tránh log mỗi lần render.
4. **Kiểm thử và duyệt**: unit test selector cho các mốc ma trận, không rò rỉ lá úp, bản gốc/Return, hai biến thể Attic/Cellar, location vắng, location xuất hiện sớm, Act/Agenda side nếu có, thay modifier, reload và undo. Chạy test gần nhất, test map liên quan và `npm --prefix frontend run tc`. Duyệt bằng browser với screenshot trước/sau tại desktop và mobile, zoom/drag và cả bản đồ lẫn bàn thẻ; nếu không tạo được snapshot hợp lệ ghi rõ phần chưa kiểm. Kiểm tra ảnh WebP tải được, alpha, sai lệch phối cảnh và va chạm với nhãn/token.
5. **Hoàn thiện**: rà diff giữ nguyên thay đổi khác của người dùng; cập nhật `docs/scene-maps.md` chỉ cho hành vi thực đã giao. Phân biệt asset chưa thực hiện vì thiếu tín hiệu hoặc không khả thi với asset đã hoàn tất.

## Nghiệm thu

- Mỗi asset có trích nguồn lá/mặt, trigger thực tế và vị trí neo; hiện và biến mất đúng khi reveal, undo, reload và thay nhánh.
- Không tiết lộ nội dung mặt lật, enemy hoặc location set-aside trước khi trạng thái công khai cho phép; không biến flavor thành luật.
- Trạng thái Return chọn biến thể ngẫu nhiên hoạt động đúng; lỗ tường không xuất hiện từ đầu hoặc bị che khi đã vào play.
- Không làm mất khả năng tương tác, không đổi nền toàn cảnh khi overlay đủ dùng; art thống nhất và không gây hiểu nhầm lối đi.
- Ghi lại kết quả test tự động và kiểm thị giác; nếu chưa kiểm được trong ván thật thì nêu giới hạn.

## Rủi ro và câu hỏi còn mở

- Cần xác minh snapshot Agenda có thể phân biệt 1A/1B và 2A/2B trong khoảng chuyển; nếu không, chỉ dùng trạng thái bền vững quan sát được, không tạo hiệu ứng sai thời điểm.
- Bố cục Return đặt bedroom và bathroom khác tầng và đã vẽ lỗ tím cùng xoáy mái: cần thử lớp che thực tế; có thể không sửa chính xác địa lý chỉ bằng overlay nhỏ. Nếu vậy ghi rõ phạm vi chỉnh cục bộ cần thiết trước khi thay nền.
- Mô tả đất tại Hallway và Agenda có thể chồng lên nhau; cần quyết định ưu tiên lớp dựa trên cả location và Agenda, không giả định thứ tự hai mốc.
