# Ảnh intro và resolution còn thiếu

Phạm vi gồm campaign chính thức, bản Return to, standalone và nội dung cộng đồng hiện có trong repo. The Innsmouth Conspiracy và bản Return to do người dùng phụ trách.

## Bàn giao ngày 16/11/2026

Đã tích hợp 160 ảnh WebP 1536 × 1024. Đợt tạo ảnh dùng ImageGen tích hợp. Danh sách bên dưới phản ánh những ảnh đã gắn vào khung đọc, còn [prompt và trạng thái theo nhánh](prompts.md) ghi các bố cục đã chuẩn bị.

| Nội dung | Ảnh mới | Trạng thái intro và resolution |
| --- | ---: | --- |
| The Dream-Eaters | 70 | Đã phủ prologue, tám scenario, các nhánh kết cục và 14 giấc mơ trong màn chọn. |
| Brethren of Ash | 17 | Đã phủ prologue và ba scenario. |
| Children of Blood | 19 | Đã phủ intro, prologue và ba scenario. New Horizons R1 và R2 cùng minh họa bước rời nhà máy sau khi biết đến Howard Wilkes. |
| Curse of the Rougarou, Carnevale of Horrors, The Eternal Slumber, The Night’s Usurper, Murder at the Excelsior Hotel, The Blob That Ate Everything, War of the Outer Gods, All or Nothing | 40 | Đã phủ các đoạn intro và kết cục có lời kể. Intro 2 và 3 của Excelsior dùng chung cảnh gõ cửa phòng 225. |
| Bad Blood, By the Book, Fortune and Folly, The Midwinter Gala | 13 | Đã có một phần. Xem mục còn lại bên dưới. |
| The Scarlet Keys | 1 | Đã thêm lời bênh vực của Claret Knight trong Congress of the Keys. |

### Còn lại

- **Bad Blood** · Dựng lại Resolution 2. Ảnh đầu đảo người đang nắm áo và người bị kéo dậy.
- **By the Book** · Resolution 1 và 2.
- **Fortune and Folly** · Hai đoạn chuẩn bị tại Checkpoint và ba resolution của Part II.
- **The Midwinter Gala** · Intro của The Syndicate, The Silver Twilight Lodge, Locals of Kingsport và các nhánh resolution.
- **Standalone chưa có ảnh truyện** · The Labyrinths of Lunacy, Machinations Through Time, Film Fatale, Traces to Nowhere, Read or Die, Red Tide Rising, Laid to Rest, Relics of the Past và Enthralling Encore.
- **Campaign đã có ảnh nhưng còn nhánh thiếu** · Lời mở Edge of the Earth và The Scarlet Keys, các lượt phát biểu riêng trong Congress of the Keys và Investigator Defeat, một số nhánh Prelude của The Feast of Hemlock Vale, phần mở và các Task kể chuyện của The Drowned City. Các đoạn cùng khung đọc với một đoạn đã có ảnh dùng ảnh của chính khung đó. Tách riêng các đoạn Task và các lượt bỏ phiếu do handler hiển thị độc lập.
- **Nội dung cộng đồng** · Các campaign và standalone trong bảng rà soát bên dưới còn thiếu ảnh. Với Consternation on the Constellation, locale và handler hiện tại chỉ có thiết lập và gameplay. Những gói chỉ có locale EN hiển thị lời kể tiếng Anh qua fallback của ứng dụng.

ImageGen trả HTTP 429 do hết hạn mức. Thời điểm mở lại mà dịch vụ báo là khoảng 19:42 ngày 16/11/2026 giờ Việt Nam. Các mục chờ ảnh chưa có mapping vào khung đọc.

## Cách đối chiếu

1. So danh sách nội dung trong frontend và handler Haskell với locale EN, VI và bảng ảnh đang chạy. Đọc các key chưa gắn ảnh trong ngữ cảnh của từng nhánh.
2. Ghi khoảnh khắc và card code trước khi dựng. Dùng lại ảnh khi cùng khoảnh khắc. Các đoạn chỉ tra nhật ký, thiết lập hoặc chuyển sang đoạn khác đi theo phần truyện chứa kết quả.
3. Kiểm tra bố cục ở kích thước khung đọc, xuất WebP 1536 × 1024, rồi nối key vào `StoryIllustration.vue`.
4. Chạy test lookup, kiểm tra file và typecheck. Người chơi kiểm tra trực tiếp khung đọc trong game.

## Độ phủ theo bộ

| Bộ | Kết quả rà soát |
| --- | --- |
| Night of the Zealot | Có bộ ảnh, lượt quét locale không phát hiện đoạn intro/resolution kể chuyện thiếu ảnh. |
| The Dunwich Legacy, The Path to Carcosa, The Forgotten Age, The Circle Undone | Có bộ ảnh. Các ứng viên còn lại chủ yếu là đoạn điều hướng, lựa chọn hoặc locale lặp. Cần đối chiếu theo handler để chốt. |
| Edge of the Earth | Có bộ ảnh. Lời trích mở campaign là ứng viên riêng. |
| The Scarlet Keys | Có bộ ảnh. Cần rà các lời dẫn lúc xét xử Coterie, lời thoại tùy điều tra viên và kết cục bị hạ trong Congress of the Keys. |
| The Feast of Hemlock Vale | Có bộ ảnh. Cần rà hai nhánh lúc mở Prelude 2 và các đoạn kết First Evening, Second Evening. |
| The Drowned City | Có bộ ảnh. Cần rà các đoạn intro tách thành nhiều key, đoạn dành cho từng Task, cùng các nhánh bổ sung của The Doom of Arkham. |
| The Dream-Eaters | Chưa có bộ ảnh truyện trước đợt này. Có tám scenario và phần mở campaign. |
| Brethren of Ash, Children of Blood | Chưa có bộ ảnh truyện. |
| Standalone chính thức | Locale gồm Curse of the Rougarou, Carnevale of Horrors, The Eternal Slumber, The Night’s Usurper, Murder at the Excelsior Hotel, Fortune and Folly, The Midwinter Gala, Film Fatale, Traces to Nowhere, The Blob That Ate Everything, War of the Outer Gods, Machinations Through Time, The Labyrinths of Lunacy, Read or Die, All or Nothing, Bad Blood, By the Book, Red Tide Rising, Laid to Rest, Relics of the Past, Enthralling Encore. Guardians of the Abyss cung cấp scope chung cho cặp scenario Ai Cập. |
| Campaign cộng đồng | Ages Unwound, Circus Ex Mortis, Dark Matter và Night of Vespers chưa có bộ ảnh truyện. |
| Standalone cộng đồng | Against the Wendigo, And Then There Were None, The Fall of the House of Usher, The Invisible Man, The Legend of Sleepy Hollow, The Masque of the Red Death, The Phantom of the Opera, The Strange Case of Dr. Jekyll and Mr. Hyde và The Symphony of Erich Zann có đoạn truyện cần ảnh. Locale của Consternation on the Constellation chỉ chứa thiết lập nên cần xác minh nguồn lời kể trước khi dựng. |

## Khoảnh khắc đã chọn

### Curse of the Rougarou

| Key dưới `standalone.curseOfTheRougarou` | Khoảnh khắc |
| --- | --- |
| `intro.body` | Minnie Klein trao bản thảo bài báo cho điều tra viên ở Velma’s Diner. |
| `resolutions.resolution1.body` | Điều tra viên tự chôn cất Lady Esprit, card 81019, trong đầm lầy. |
| `resolutions.resolution2.body` | Lady Esprit giải lời nguyền trước thi thể người vừa trở lại hình người. |
| `resolutions.resolution3.body` | Người từng hóa Rougarou nắm tay điều tra viên, cảnh báo về lời nguyền. |

`noResolution` chuyển thẳng đến Resolution 1 trong cả locale và handler.

### Carnevale of Horrors

| Key dưới `standalone.carnevaleOfHorrors` | Khoảnh khắc |
| --- | --- |
| `intro.body` | Sheriff Engel chỉ chiếc mặt nạ da đen của Zanni trên bàn. |
| `resolutions.noResolution.body` | Người lái gondola đánh thức điều tra viên bên bến tàu bị tàn phá. |
| `resolutions.resolution1.body` | Nắng làm tan dấu vết cuối cùng còn sót lại của sinh vật cạnh đầm phá. |
| `resolutions.resolution2.body` | Cnidathqua, card 82027, chìm xuống nước trong lúc lông vũ đen rơi. |
| `resolutions.sacrificeMade.body` | Bờ đầm phá vắng người sau cuộc hiến tế, Cnidathqua ở phía xa. |
| `resolutions.abbessSatisfied.body` | Abbess Allegria Di Biase, card 82022, cảm ơn điều tra viên tại basilica. |

### The Dream-Eaters

| Key dưới `theDreamEaters` | Khoảnh khắc và tham chiếu |
| --- | --- |
| `flavorText.prologueOpening.body` | Hai tư tế Kaman-Thah và Nasht, card 06057 và 06058, cảnh báo người mơ dưới chân cầu thang. |
| `flavorText.prologue.body` | Nhóm bắt đầu thử nghiệm tái tạo giấc mơ của Virgil Gray ở Arkham năm 1925. |
| `beyondTheGatesOfSleep.resolutions.noResolution.body` | Mèo già đánh thức điều tra viên, Randolph Carter chờ gần đó, card 06059. |
| `beyondTheGatesOfSleep.resolutions.resolution1.body` | Zoog đặt chim săn xuống làm cống phẩm cho bầy mèo, card 06061. |
| `beyondTheGatesOfSleep.resolutions.resolution2.body` | Zoog trưởng lão trao bầu rượu cây mặt trăng cho điều tra viên. |
| `wakingNightmare.flavorText.intro1.body` | Bác sĩ Maheswaran, card 06080, lùi lại khi nhện xuất hiện từ chăn bệnh nhân. |
| `wakingNightmare.flavorText.intro2.body` | Maheswaran theo điều tra viên ra khỏi phòng bệnh. |
| `wakingNightmare.flavorText.intro3.body` | Maheswaran đứng lại bên giường trong khi điều tra viên rời đi. |
| `wakingNightmare.resolutions.noResolution.body` | Carter, card 06079, đặt tay lên vai điều tra viên tại bệnh viện đã sạch bóng nhện. |
| `wakingNightmare.resolutions.resolution1.body` | Maheswaran bắt mạch cho bệnh nhân và nhận ra tình trạng xấu đi. |
| `wakingNightmare.resolutions.resolution2.body` | Người bệnh thì thầm lời lạ, ghế bác sĩ bỏ trống. |
| `wakingNightmare.resolutions.resolution3.body` | Maheswaran hé cửa sau khi dỡ chướng ngại trong phòng. |
| `wakingNightmare.resolutions.resolution4.body` | Điều tra viên xé màn tơ và thấy ánh sao sau lớp mạng nhện. |
| `wakingNightmare.resolutions.resolution5.body` | Carter bước ra cùng điều tra viên, tiết lộ nhóm đang ngủ bị mắc kẹt trong Dreamlands. |
| `pointOfNoReturn.intro1.body` | Điều tra viên một mình nhìn thấy thành quách của loài Gug. |
| `pointOfNoReturn.intro2.body` | Carter chỉ cho điều tra viên vùng đồng bằng của ghoul. |
| `pointOfNoReturn.resolutions.resolution1.body` | Điều tra viên xuyên qua Sea of Pitch và bám lấy mạng nhện phát sáng. |
| `pointOfNoReturn.resolutions.resolution2.body` | Mèo đen nhìn vào vực đang nuốt Arkham, sát ghế đá của điều tra viên. |
| `darkSideOfTheMoon.intro1.body` | Corsair, card 06105, phục kích thuyền trưởng vừa cắt dây trói cho tù nhân. |
| `darkSideOfTheMoon.intro2.body` | Carter và điều tra viên chuẩn bị rời cảng để giải cứu tù nhân. |
| `darkSideOfTheMoon.resolutions.noResolution.body` | Moon-Beast, card 06229, lôi Carter đi khỏi nhóm trong đền. |
| `darkSideOfTheMoon.resolutions.resolution1.body` | Thuyền Trắng đổi hướng, bám theo chim trời đến đỉnh núi với ánh xanh. |
