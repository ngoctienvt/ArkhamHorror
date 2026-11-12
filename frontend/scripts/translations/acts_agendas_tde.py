"""Translations for The Dream-Eaters (TDE) act and agenda cards."""
from typing import Dict, Any

TRANSLATIONS_TDE_ACTS_AGENDAS: Dict[str, Dict[str, Any]] = {'06040': {'name': 'Hành Trình Qua Cánh Cổng',
           'text': '<b>Forced</b> - Khi doom được đặt lên agenda này trong giai đoạn mythos, nếu có bất kỳ điều tra '
                   'viên nào đang ở địa điểm [[Steps]]: Đặt thêm 1 doom lên agenda này.',
           'flavor': 'Từ giấc mơ ban đầu của bạn, bạn đã bị cuốn vào một cõi mộng quen thuộc: chính là cõi mộng mà '
                     'Virgil Gray đã băng qua trong câu chuyện của ông trong <u>Tales from Nevermore</u>. Điều này có '
                     'thật không? Hay tâm trí bạn chỉ đơn giản đang gợi lên những gì nó mong đợi được thấy?',
           'back_name': 'Trò Lừa Của Tâm Trí',
           'back_text': '<b>Nếu đang là act 1, 2, hoặc 3, hãy đọc phần sau:</b>\n'
                        '<i><blockquote>Những bậc thang bắt đầu vặn vẹo như một con rắn đang cuộn mình tỉnh giấc. Bạn '
                        'cố gắng giữ thăng bằng, nhưng không có gì để bạn bám vào để an toàn khi những bậc thang '
                        'nghiêng ngả và lật nhào.</blockquote></i>\n'
                        'Mỗi điều tra viên còn sống sót bị đánh bại và chịu 1 tổn thương thể chất. Mỗi điều tra viên '
                        'đó có thể kiểm tra [willpower] (3) trước khi bị đánh bại để nhớ ra rằng tất cả những điều này '
                        'chỉ là một giấc mơ. Mỗi điều tra viên thành công bị đánh bại và chịu 1 tổn thương tinh thần '
                        'thay vào đó.<hr>\n'
                        '<b>Nếu đang là act 4, hãy đọc phần sau:</b>\n'
                        '<i><blockquote>"Cứu với! Làm ơn! Có ai không!" Giọng nói vang lên từ những hàng cây, cách xa '
                        'lối đi. Bình thường, trò lừa kiểu này sẽ không thể đánh lừa được bạn, nhưng giọng nói này quá '
                        'đỗi quen thuộc không thể phớt lờ. Một người thân yêu, có lẽ vậy, hoặc một ai đó bạn từng làm '
                        'họ thất vọng trong lúc nguy nan. Chẳng còn quan trọng nữa. Giờ đã quá muộn rồi. Bạn xoay '
                        'người tìm kiếm con đường, nhưng nó không còn ở đâu nữa.</blockquote></i>\n'
                        'Ghi vào Campaign Log <i>the dreamers strayed from the path</i>. Mỗi điều tra viên còn sống '
                        'sót bị đánh bại và chịu 1 tổn thương tinh thần.',
           'back_flavor': ''},
 '06041': {'name': 'Bước Vào Dreamlands',
           'text': 'Không rút bài từ chồng bài encounter trong giai đoạn mythos.\n'
                   '<b>Objective</b> - Nếu một điều tra viên tiến vào The Cavern of Flame, ngay lập tức advance.',
           'flavor': 'Cánh cửa dẫn ra khỏi giấc mơ ban đầu đưa bạn đến một cầu thang bằng đá. Hàng ngàn cầu thang khác '
                     'nhau hợp nhất tại đây, tạo thành một giao điểm bất khả tri của những bậc thang nơi các thế giới '
                     'và câu chuyện hội tụ. Nơi các bậc thang gặp nhau, chúng tạo thành một lối đi xoắn ốc duy nhất '
                     'dẫn sâu hơn vào xứ sở của những giấc mơ.',
           'back_name': 'Các Tư Tế Của Dreamlands',
           'back_text': 'Mỗi điều tra viên mất toàn bộ manh mối của họ.\n'
                        'Đưa các kẻ địch Nasht và Kaman-Thah đang để riêng vào chơi tại The Cavern of Flame.\n'
                        'Giấc ngủ của bạn ngày càng sâu hơn. Thêm 1 token [skull] vào túi chaos cho phần còn lại của '
                        'chiến dịch.',
           'back_flavor': 'Ở trung tâm hang động là một cột lửa được bảo vệ bởi hai người đàn ông râu ria mặc áo '
                          'choàng. Bạn nhận ra cảnh tượng này từ những trang viết của Virgil Gray. Các tư tế, hang '
                          'động: tất cả đều đúng như ông đã miêu tả. Hoặc là bạn đã mạo hiểm bước vào cùng một cõi '
                          'mộng, hoặc là bạn đang chia sẻ ảo tưởng của ông. "Ngươi phải được thử thách," một trong '
                          'những tư tế nói một cách đầy bí ẩn. "Thử thách cam go của ngươi sẽ vô cùng lớn lao, và vì '
                          'thế, bài kiểm tra của ngươi cũng sẽ như vậy."'},
 '06042': {'name': 'Thử Thách Của Nasht và Kaman-Thah',
           'text': 'Không rút bài từ chồng bài encounter trong giai đoạn mythos.\n'
                   '<b>Objective</b> - Nếu cả Nasht lẫn Kaman-Thah đều không ở trong màn chơi, ngay lập tức advance.',
           'flavor': 'Những cánh cổng vàng có then cài phía bên kia sẽ không mở ra cho bạn. Chỉ có các tư tế mới có '
                     'thể phán xét xem bạn có xứng đáng để bước qua những bậc thang bên dưới hay không. Họ bắt chéo vũ '
                     'khí của mình - một cây kích thép và một lưỡi hái bạc - trước cổng.',
           'back_name': 'Cẩn Trọng Con Đường Phía Trước',
           'back_text': 'Mỗi điều tra viên mất toàn bộ manh mối của họ.\n'
                        'Đưa các địa điểm Seven Hundred Steps, Base of the Steps, và The Enchanted Path đang để riêng '
                        'vào chơi.\n'
                        'Giấc ngủ của bạn ngày càng sâu hơn. Thêm 1 token [skull] vào túi chaos cho phần còn lại của '
                        'chiến dịch.',
           'back_flavor': 'Hài lòng rằng bạn xứng đáng bước vào Dreamlands, các tư tế bước sang một bên để bạn đi qua, '
                          'và cánh cổng phía bên kia mở ra. Trước khi bạn bước qua, một trong số họ túm lấy cổ tay bạn '
                          'và đưa ra lời cảnh báo cuối cùng: "Hành trình của ngươi sẽ đưa ngươi vượt ra ngoài vùng đất '
                          'của các vị thần. Con mắt của sự hỗn loạn hiện đang dõi theo ngươi. Hãy đi theo con đường, '
                          'và ngươi sẽ được an toàn. Nhưng hãy coi chừng!" Ông siết chặt tay hơn. "Đừng đi lạc khỏi '
                          'con đường!"'},
 '06043': {'name': 'Lần Xuống Cuối Cùng',
           'text': 'Không rút bài từ chồng bài encounter trong giai đoạn mythos.\n'
                   '<b>Objective</b> - Nếu mỗi điều tra viên đều đang ở The Enchanted Path, ngay lập tức advance.',
           'flavor': 'Những bậc thang xoắn ốc đi xuống bên dưới dường như kéo dài đến vô tận.',
           'back_name': 'Bước Vào Mê Hoặc',
           'back_text': 'Mỗi điều tra viên mất toàn bộ manh mối của họ.\n'
                        'Giấc ngủ của bạn ngày càng sâu hơn. Thêm 1 token [skull] vào túi chaos cho phần còn lại của '
                        'chiến dịch.\n'
                        'Loại bỏ mỗi địa điểm [[Steps]] khỏi trò chơi.\n'
                        'Chọn ngẫu nhiên 6 trong số các địa điểm Enchanted Woods đang để riêng để đưa vào chơi. Loại '
                        'bỏ bản sao còn lại khỏi trò chơi.\n'
                        'Xáo trộn tất cả các lá bài scenario đang để riêng còn lại, ngoại trừ Laboring Gug và Randolph '
                        'Carter <i>(Expert Dreamer)</i>, để tạo thành chồng bài encounter. <i>(Kể từ bây giờ, các điều '
                        'tra viên rút bài từ chồng bài encounter trong mỗi giai đoạn mythos, như bình thường.)</i>',
           'back_flavor': 'Khi bạn chạm tới chân cầu thang, bạn thấy mình đang ở trong một khu rừng sồi thế giới khác. '
                          'Tầng rừng phủ đầy lá rụng của vô số năm tháng, và xung quanh bạn là những loài nấm phát '
                          'quang đủ hình dạng và chủng loại. Mặt đất bị đâm thủng bởi những bộ rễ khẳng khiu, và những '
                          'cái cây bị siết chặt bởi những dây leo xâm lấn. Một lối mòn đất quanh co dẫn sâu hơn vào '
                          'rừng.'},
 '06044': {'name': 'Con Đường',
           'text': '<b>Forced</b> - Sau lần đầu tiên có bất kỳ điều tra viên nào tiến vào một địa điểm Enchanted '
                   'Woods: Ghi vào Campaign Log <i>the dreamers strayed from the path</i>.\n'
                   '<b>Objective</b> - Chỉ các điều tra viên tại The Enchanted Path mới có thể cùng nhau chi trả số '
                   'lượng manh mối cần thiết, theo nhóm, để advance.',
           'flavor': 'Tất cả những gì bạn phải làm là tiếp tục bám theo con đường.',
           'back_name': 'Những Vị Khách Mới',
           'back_text': 'Các điều tra viên phải quyết định (chọn một):\n'
                        '- Lùi lại và quan sát cảnh tượng siêu thực này diễn ra. <b>(→R1)</b>\n'
                        '- Ngắt lời con mèo đầy sẹo và tự mình xử lý chuyện này. <b>(→R2)</b>',
           'back_flavor': 'Khi bạn đến gần bìa rừng, nhiều sinh vật giống loài gặm nhấm xuất hiện hơn, túa ra từ các '
                          'hang hốc và những thân cây rỗng tổ ong. Chẳng mấy chốc, cả khu rừng như sống dậy với sự '
                          'hiện diện của chúng. Chúng bao vây bạn và kêu ríu rít bằng một thứ ngôn ngữ mà bạn bằng '
                          'cách nào đó hiểu được: "Kẻ xâm nhập." "Chúng đi cùng lũ mèo." "Những kẻ mộng mơ mới." '
                          '"Không, chúng đi theo con mèo đen." "Nhưng con mèo đen không có ở đây." "Chúng ta đông; '
                          'chúng thì ít." Một vài con gầm gừ trầm đục khi chúng bắt đầu áp sát. Ngay lúc đó, bạn nghe '
                          'thấy một giọng nói của con người vang lên: "Tất cả chuyện này có nghĩa là gì?" Chủ nhân của '
                          'giọng nói là một thanh niên tóc vàng với vẻ mặt không hề nao núng. Theo sát hai bên anh là '
                          'một đàn mèo giận dữ, từng con bước đều bên cạnh anh, ngoại trừ một con mèo già đầy sẹo dẫn '
                          'đầu. Bạn nhận ra người đàn ông không nói với bạn, mà nói với những sinh vật xung quanh bạn, '
                          'những kẻ đang lùi dần lại khi bị quở trách. Sau đó, trước sự ngạc nhiên ngày càng lớn của '
                          'bạn, con mèo có sẹo cất tiếng: "Vật cống nạp của các ngươi đã trễ hạn!"'},
 '06064': {'name': "Hành Lang Của St. Mary's",
           'text': '',
           'flavor': 'Một cảm giác nặng nề, đáng ngại ám ảnh bạn khi bạn thám hiểm Bệnh viện St. Mary. Những dãy hành '
                     'lang của nó tối tăm đến rợn người và trống rỗng ngoài người hộ lý thỉnh thoảng đi tuần đêm muộn. '
                     'Đèn chập chờn, và những bóng đen dường như lao vút từ góc này sang góc khác. Mê cung hành lang '
                     'của bệnh viện bắt đầu mang một vẻ mờ ảo như trong giấc mơ. Bạn nhận thấy thêm một con nhện khác '
                     'đang bò lên chân mình và phủi nó đi, tự hỏi điều gì đang khiến chúng xuất hiện thường xuyên như '
                     'vậy.',
           'back_name': 'Những Diễn Biến Đáng Lo Ngại',
           'back_text': 'Xáo trộn encounter set <i>Spiders</i> đang để riêng và mỗi bản sao của Outbreak đang để riêng '
                        'vào chồng bài encounter, cùng với chồng bài encounter bỏ.\n'
                        'Rút lá bài story The Infestation Begins đang để riêng và giải quyết nội dung của nó.',
           'back_flavor': 'Khi bạn tiếp tục thám hiểm bệnh viện, những điều kỳ lạ mà bạn quan sát được ngày càng trở '
                          'nên thường xuyên hơn. Mạng nhện dày đặc, đen sì giờ đây bao phủ các góc của mọi căn phòng. '
                          'Nhện bò dọc theo tường và trần nhà, xuất hiện dường như từ hư không và biến mất cũng nhanh '
                          'như vậy. Đó không chỉ là do bạn tưởng tượng - một dịch hại nhện đã cắm rễ bên trong bệnh '
                          'viện. Và không chỉ là những con nhện thông thường: chúng to lớn hơn bình thường, với những '
                          'chiếc chân dài, lởm chởm, đầy gai nhọn và những cái bụng lớn đầy lông lá. Có lẽ điều đáng '
                          'lo ngại hơn nữa là hoàn toàn vắng bóng nhân viên bệnh viện đi lại trong các hành lang. '
                          'Ngoài vài người hộ lý cảnh giác và sợ hãi, bạn không thấy nhân viên nào khác, thậm chí '
                          'không có cả y tá hay bác sĩ. Mọi người đã đi đâu hết rồi?'},
 '06065': {'name': 'Dịch Hại Lan Tràn',
           'text': '<b>Forced</b> - Vào cuối giai đoạn mythos: Thực hiện một kiểm tra dịch hại (infestation test).',
           'flavor': 'Một sự hiện diện quái dị đã tràn ngập St. Mary. Nó ẩn náu bên trong những bức tường và quan sát '
                     'bạn từ mọi phía. Chỉ trong vài phút, nó đã giăng tơ dày đặc, dính nhớp khắp mọi căn phòng bạn '
                     'ghé thăm. Đèn hoặc chập chờn hoặc tắt ngúm trên khắp bệnh viện, và một số máy móc y tế tiên tiến '
                     'hơn bị hỏng hóc và phủ đầy mạng nhện.',
           'back_name': 'Địa Ngục Bùng Phát',
           'back_text': 'Tìm mỗi kẻ địch Suspicious Orderly trong màn chơi và thay thế nó bằng kẻ địch Corrupted '
                        'Orderly đang để riêng <i>(nó giữ nguyên trạng thái trò chơi, tất cả token, và tất cả lá bài '
                        'gắn kèm)</i>.\n'
                        'Tìm trong chồng bài encounter và chồng bài bỏ mỗi bản sao của Suspicious Orderly và loại bỏ '
                        'chúng khỏi trò chơi.\n'
                        'Xáo trộn encounter set <i>Agents of Atlach-Nacha</i> đang để riêng, mỗi kẻ địch Corrupted '
                        'Orderly đang để riêng còn lại, và chồng bài encounter bỏ vào chồng bài encounter.\n'
                        'Thêm 1 token [skull] và 1 token [cultist] vào túi dịch hại (infestation bag).',
           'back_flavor': 'Đột nhiên, sự hỗn loạn bùng phát trong bệnh viện. Tiếng lách cách và đổ vỡ vang lên từ bên '
                          'trong những bức tường. Trong bóng tối, bạn hầu như không thể nhận ra hình thù của những '
                          'sinh vật kỳ lạ giống nhện đang chạy tán loạn từ xa. Khi rẽ qua một góc, bạn phát hiện một '
                          'hộ lý đang quằn quại trên sàn nhà bóng loáng, co giật dữ dội như thể bị một thế lực hiểm '
                          'độc chiếm hữu. Bạn lao đến bên anh ta và lật anh ta nằm ngửa... và thấy rằng gần như toàn '
                          'bộ khuôn mặt của anh ta bị bao phủ bởi lớp mạng nhện dày đặc, và đôi mắt anh ta mở to và mờ '
                          'đục. Anh ta không hề phản ứng khi bạn lay mạnh anh ta.'},
 '06066': {'name': 'Bệnh Viện Kinh Hoàng',
           'text': '<b>Forced</b> - Vào cuối giai đoạn mythos: Thực hiện một kiểm tra dịch hại (infestation test).\n'
                   'Mỗi kẻ địch [[Spider]] tại một địa điểm bị dịch hại nhận +1 fight và +1 evade.',
           'flavor': 'Toàn bộ tòa nhà đã bị xâm lấn bởi một cái ác độc địa - thứ gì đó không tuân theo các quy luật '
                     'của tự nhiên. Bạn cần tìm cách nào đó để ngăn chặn nó hoặc trốn thoát trước khi nó nuốt chửng cả '
                     'bạn nữa.',
           'back_name': 'Cuộc Trốn Chạy Tuyệt Vọng',
           'back_text': 'Trong Campaign Log của bạn, hãy ghi lại 8 vạch kiểm đếm bên cạnh "Steps of the Bridge."\n'
                        '<b>(→R4)</b>',
           'back_flavor': 'Dịch hại đã thâu tóm toàn bộ bệnh viện. Không một căn phòng nào còn nguyên vẹn. Bạn chạy '
                          'đua qua những dãy hành lang của nó, tuyệt vọng tìm kiếm lối thoát, và chỉ tìm thấy những '
                          'bức tường phủ đầy mạng nhện, các nạn nhân bị bọc trong những cái kén tơ, và xác nhân viên '
                          'bệnh viện treo lơ lửng từ trần nhà.'},
 '06067': {'name': 'Tìm Kiếm Câu Trả Lời',
           'text': '',
           'flavor': 'Có điều gì đó không ổn với những người đồng hành của bạn, và trong khi y học đã tiến xa, nó '
                     'không thể giải thích được những gì đang xảy ra với họ. Bạn đã quyết định tự mình tìm hiểu xem có '
                     'điều gì bất thường và chấn chỉnh lại mọi thứ.',
           'back_name': 'Một Manh Mối Đầy Hứa Hẹn',
           'back_text': 'Đưa các địa điểm Stairwell và Basement Door đang để riêng vào chơi.\n'
                        'Kiểm tra agenda hiện tại.\n'
                        '- Nếu đang là agenda 2 hoặc 3, thực hiện một kiểm tra dịch hại (infestation test).\n'
                        '- Nếu đang là agenda 1, ngay lập tức advance sang agenda 2.',
           'back_flavor': 'Từ hồ sơ bệnh viện và những mẩu đối thoại thì thầm, bạn có thể thu thập được thông tin rằng '
                          'gần đây có một bệnh nhân khác trong bệnh viện có tình trạng phản ánh gần như y hệt bạn bè '
                          'của bạn. Sau nhiều tuần hôn mê, bệnh nhân đột ngột tỉnh dậy một cách khó hiểu ngay sáng '
                          'nay. Hoang mang, các bác sĩ đã cách ly bệnh nhân ở đâu đó trong tầng hầm của bệnh viện, '
                          'phía dưới khu điều trị phía đông.'},
 '06068': {'name': 'Tìm Kiếm Bệnh Nhân',
           'text': '<b>Objective</b> - Nếu một điều tra viên kiểm soát Randolph Carter, advance.',
           'flavor': 'Bạn cần tìm hiểu nơi bệnh nhân bí ẩn này đang được giữ. Nếu bạn có thể tìm thấy họ và nói chuyện '
                     'với họ, có lẽ họ có thể cung cấp một số câu trả lời về những gì đang xảy ra với bạn bè của bạn.',
           'back_name': 'Lời Khai Của Carter',
           'back_text': 'Xáo trộn chồng bài encounter bỏ vào chồng bài encounter.',
           'back_flavor': 'Sau một hồi thuyết phục, bạn cố gắng thuyết phục được người đàn ông tóc vàng lắng nghe câu '
                          'chuyện của bạn. Khi bạn giải thích cho anh ta những gì đã xảy ra với những người đồng hành '
                          'của mình, anh lắc đầu với sự thấu hiểu trầm ngâm. "Tôi biết gã Virgil này sẽ gây rắc rối '
                          'mà. Giá như tôi thuyết phục được anh ta đừng viết câu chuyện đó..." Bạn hỏi anh ý là gì, và '
                          'anh thở dài một hơi thật dài trước khi giải thích chi tiết: "Tất cả đều là sự thật. Toàn bộ '
                          'chuyện đó. Dreamlands là có thật. Và tôi tin rằng có thứ gì đó đang khiến nó hòa nhập vào '
                          'thế giới tỉnh thức. Đó là nguồn gốc của tất cả những thứ này," anh giải thích, chỉ tay về '
                          'phía những mạng nhện ở các góc phòng. "Với sự giúp đỡ của bạn, tôi có thể tạm thời ngăn '
                          'chặn sự lây lan của dịch hại. Sau đó chúng ta có thể điều tra sâu hơn về vấn đề này." Anh '
                          'đứng dậy khỏi chiếc giường xếp và bắt tay bạn. "Nhân tiện, tên tôi là Randolph. Randolph '
                          'Carter."'},
 '06069': {'name': 'Khống Chế Dịch Bệnh',
           'text': 'Mỗi địa điểm bị dịch hại nhận: "[action]: Kiểm tra [willpower] (X) để cố gắng phong ấn vết nứt '
                   'rạn. X là shroud của địa điểm này. Các điều tra viên tại địa điểm này có thể chi trả 1 '
                   '[per_investigator] manh mối, theo nhóm, để tự động thành công. Nếu bạn thành công, thay thế token '
                   'damage trên địa điểm này bằng một token horror. Trong phần còn lại của trò chơi, địa điểm này '
                   'không thể trở nên bị dịch hại."\n'
                   '<b>Objective</b> - Nếu không có địa điểm nào bị dịch hại trong màn chơi, advance.',
           'flavor': 'Với sự trợ giúp của Randolph Carter, bạn phải cố gắng đóng các vết nứt rạn đã mở ra giữa '
                     'Dreamlands và thế giới tỉnh thức.',
           'back_name': 'Bước Tiếp Theo',
           'back_text': 'Kiểm tra Campaign Log.\n'
                        '- <i>Nếu Dr. Maheswaran tham gia cuộc điều tra</i> và bà ấy đang ở trong màn chơi khi màn '
                        'chơi kết thúc, <b>(→R1)</b>.\n'
                        '- <i>Nếu Dr. Maheswaran tham gia cuộc điều tra</i> và bà ấy không ở trong màn chơi khi màn '
                        'chơi kết thúc, <b>(→R2)</b>.\n'
                        '- <i>Nếu Dr. Maheswaran ở lại với các bệnh nhân của mình</i> , <b>(→R3)</b>.',
           'back_flavor': '<blockquote><i>Khi vết nứt cuối cùng được phong ấn, dịch hại chấm dứt, và bệnh viện trở lại '
                          'bình thường. "Làm tốt lắm," Randolph nói. "Tuy nhiên, tôi tin rằng vấn đề này cần phải điều '
                          'tra thêm. Chúng ta không biết điều gì đã khiến chuyện này xảy ra." Bạn nhắc anh rằng còn có '
                          'vấn đề về những người đồng hành của bạn, những người vẫn không chịu thức dậy. "Vâng, dĩ '
                          'nhiên rồi— cả chuyện đó nữa. Hãy đến một nơi nào đó riêng tư để chúng ta có thể bàn bạc xem '
                          'bước tiếp theo của chúng ta nên là gì. Đáng buồn thay, tôi không tin rằng có điều gì chúng '
                          'ta có thể làm thêm để giúp đỡ bạn bè của bạn ở đây." Bạn không biết Randolph ám chỉ "ở đây" '
                          'là "bệnh viện" hay "ở đây" là "thế giới tỉnh thức", nhưng dù thế nào đi nữa, điều đó cũng '
                          'chẳng báo trước điềm lành cho những người đồng hành của bạn.</i></blockquote>'},
 '06120': {'name': 'Hành Trình Băng Qua Dreamlands',
           'text': '[action] Nếu bạn đang ở một địa điểm [[Port]]: <b>Resign.</b> Mạo hiểm tiến vào cõi vô định đã trở '
                   'nên quá nguy hiểm, vì vậy bạn trở về nơi an toàn với những thông tin mình đã thu thập được.',
           'flavor': 'Bất chấp lời khuyên của những cư dân vùng Dreamlands, bạn và những người đồng hành vẫn tìm kiếm '
                     'Kadath vô danh, nơi các vị thần ngự trị.',
           'back_name': 'Cuộc Truy Đuổi Của Hải Tặc',
           'back_text': 'Xáo trộn cả hai kẻ địch Corsair of Leng đang để riêng vào chồng bài encounter, cùng với chồng '
                        'bài encounter bỏ.',
           'back_flavor': 'Nhiều tháng đã trôi qua kể từ khi bạn lần đầu tiên khởi hành từ Ulthar. Trên đường đi, bạn '
                          'đã nhìn thấy nhiều địa danh tuyệt mỹ và gặp gỡ nhiều người kỳ lạ và thú vị. Một số người '
                          'rất hữu ích, cho bạn những lời khuyên thông thái hoặc chỉ cho bạn đúng hướng. Tuy nhiên, '
                          'hầu hết đều nhìn bạn với sự nghi ngờ và cảnh giác. Có lẽ là vì bạn là một kẻ mộng mơ đến từ '
                          'thế giới bên ngoài, hoặc có lẽ là vì bạn đủ dại dột và bị nguyền rủa để tìm kiếm những nơi '
                          'bị cấm đoán của Dreamlands.\n'
                          'Nhưng chính lũ hải tặc Corsair mới thực sự khiến bạn khiếp sợ. Xuyên suốt chuyến hành trình '
                          'của mình, bạn phát hiện chúng truy đuổi bạn hết lần này đến lần khác. "Người xứ Leng," '
                          'những cư dân của Dreamlands gọi chúng như vậy: những sinh vật giống nhân mã rừng satyr với '
                          'móng guốc thay vì bàn chân và những chiếc sừng cong lớn nhô ra từ trán. Chúng căng buồm '
                          'trên những chiếc thuyền chiến galley dài, đen nhánh với những cánh buồm đen. Bạn không biết '
                          'tại sao chúng lại săn lùng bạn không ngừng nghỉ, và bạn cũng không muốn tìm hiểu để làm '
                          'gì.'},
 '06121': {'name': 'Thuộc Hạ Của Outer Gods',
           'text': '[action] Nếu bạn đang ở một địa điểm [[Port]]: <b>Resign.</b> Mạo hiểm tiến vào cõi vô định đã trở '
                   'nên quá nguy hiểm, vì vậy bạn trở về nơi an toàn với những thông tin mình đã thu thập được.',
           'flavor': 'Có lẽ tìm kiếm Kadath quả thực là một chuyến đi mạo hiểm đầy tai ương. Dẫu vậy, sự tò mò vẫn gặm '
                     'nhấm tâm trí bạn. Nơi an nghỉ của các vị thần có thể nắm giữ bằng chứng gì cho bạn?',
           'back_name': 'Bị Bắt Giữ!',
           'back_text': 'Mỗi điều tra viên còn sống sót bị đánh bại.',
           'back_flavor': 'Bạn đã trốn tránh lũ Corsair trong nhiều tuần kể từ khi cuộc truy đuổi của chúng bắt đầu. '
                          'Mỗi lần chúng xuất hiện, bạn đều có thể tuột khỏi bàn tay kẹp chặt của chúng, nhưng thòng '
                          'lọng ngày càng siết chặt hơn sau mỗi lần trốn thoát. Dẫu vậy, bạn vẫn kiên trì với hy vọng '
                          'có thể tìm thấy Kadath trước khi vận may của mình cạn kiệt.\n'
                          'Tuy nhiên, ngay cả với tất cả thông tin bạn đã khám phá ra, Kadath vẫn lẩn tránh bạn, và lũ '
                          'Corsair đang bám sát gót bạn. Bạn cố gắng tìm đường đến nơi an toàn, nhưng bạn đã đánh giá '
                          'thấp mức độ mà những sinh vật này sẵn sàng làm để bắt giữ bạn. Chúng đã cắt đứt mọi lối '
                          'thoát của bạn và tước đoạt mọi nơi trú ẩn an toàn của bạn. Bạn chẳng còn nơi nào để chạy '
                          'trốn nữa. Như những kẻ đi săn theo đàn, chúng bao vây lấy bạn...'},
 '06122': {'name': 'Vương Quốc Sông Skai',
           'text': '<b>Objective</b> - Vào cuối vòng chơi, các điều tra viên tại một địa điểm [[Port]] có thể cùng '
                   'nhau chi trả số lượng manh mối cần thiết, theo nhóm, để advance.',
           'flavor': '"Qua những vùng đồng bằng màu mỡ trải dài xuống sông Skai, chàng thấy khói bốc lên từ những ống '
                     'khói của các ngôi nhà tranh, và khắp mọi nơi là những hàng rào, những thửa ruộng cày và những '
                     'mái tranh của một vùng đất thanh bình."\n'
                     ' — H. P. Lovecraft, <u>The Dream-Quest of Unknown Kadath</u>',
           'back_name': 'Ra Biển!',
           'back_text': 'Tìm kiếm trong chồng bài encounter, chồng bài bỏ, và tất cả các khu vực chơi Cats of Ulthar, '
                        'mỗi bản sao của Pack of Vooniths, và mỗi lá bài thuộc encounter set <i>Zoogs</i>, và loại bỏ '
                        'chúng khỏi trò chơi.\n'
                        'Xáo trộn mỗi bản sao của Priest of a Thousand Masks đang để riêng vào chồng bài encounter, '
                        'cùng với chồng bài encounter bỏ.\n'
                        'Các điều tra viên phải quyết định (chọn một):\n'
                        '- Ghé thăm hòn đảo Oriab ở phía nam. Giải quyết <b>Oriab Setup</b> trong Campaign Guide.\n'
                        '- Ghé thăm vùng đất cổ xưa Mnar ở phía tây. Giải quyết <b>Mnar Setup</b> trong Campaign '
                        'Guide.\n'
                        '- Ghé thăm Forbidden Lands ở phía bắc. Giải quyết <b>Forbidden Lands Setup</b> trong Campaign '
                        'Guide.\n'
                        '- Ghé thăm vương quốc Timeless Realm ở phía đông. Giải quyết <b>Timeless Realm Setup</b> '
                        'trong Campaign Guide.',
           'back_flavor': 'Bạn tìm thấy một thuyền trưởng sẵn lòng cho bạn quá cảnh đến những vùng đất xa xôi của '
                          'Dreamlands, nơi bạn có thể tìm thấy những dấu hiệu từ các vị thần để chỉ đường cho bạn '
                          'hướng tới Kadath.'},
 '06123': {'name': 'Hòn Đảo Oriab',
           'text': '<b>Objective</b> - Tìm kiếm và khám phá càng nhiều Dấu Hiệu Của Các Thần (Signs of the Gods) tại '
                   'vùng này càng tốt. Vào cuối vòng chơi, nếu mỗi điều tra viên đều đang ở cùng một địa điểm '
                   '[[Port]], bạn có thể di chuyển sang một vùng khác bằng cách advance act này.\n'
                   '<b>Objective</b> - Nếu các điều tra viên đã khám phá 10 Dấu Hiệu Của Các Thần, tiến tới '
                   '<b>(→R1)</b>.',
           'flavor': 'Về phía nam là hòn đảo núi lửa nhỏ nhưng trù phú Oriab, sừng sững ngọn núi lửa đã tắt tên là '
                     'Ngranek. Vịnh Baharna, được đánh dấu bởi ngọn hải đăng đôi Thon và Thal, nhìn ra Biển Nam.',
           'back_name': 'Đi Đâu Bây Giờ?',
           'back_text': 'Xáo trộn chồng bài encounter bỏ vào chồng bài encounter.\n'
                        'Các điều tra viên phải quyết định (chọn một). Bạn không thể chọn một địa điểm bạn đã ghé '
                        'thăm. Nếu bạn đã ghé thăm từng khu vực được liệt kê, tiến tới <b>(→R1)</b>.\n'
                        '- Ghé thăm vùng đất cổ xưa Mnar ở phía tây. Giải quyết <b>Mnar Setup</b> trong Campaign '
                        'Guide.\n'
                        '- Ghé thăm Forbidden Lands ở phía bắc. Giải quyết <b>Forbidden Lands Setup</b> trong Campaign '
                        'Guide.\n'
                        '- Ghé thăm vương quốc Timeless Realm ở phía đông. Giải quyết <b>Timeless Realm Setup</b> '
                        'trong Campaign Guide.',
           'back_flavor': 'Khi bạn bước lên tàu của mình một lần nữa, bạn thấy thủy thủ đoàn đang chất các thùng hàng '
                          'hóa thương mại: lông thú, quặng, các loại gia vị ngoại lai, và những thứ tương tự. "Chúng '
                          'ta sẽ kiếm bộn tiền với những thứ này khi trở về đất liền," vị thuyền trưởng vừa nói vừa vỗ '
                          'vai bạn. "Hy vọng các bạn cũng đã tìm thấy những gì mình đang tìm kiếm. Giờ các bạn muốn '
                          'hướng về đâu tiếp theo?"'},
 '06124': {'name': 'Tai Ương Từng Đến Trước Đây',
           'text': '<b>Objective</b> - Tìm kiếm và khám phá càng nhiều Dấu Hiệu Của Các Thần (Signs of the Gods) tại '
                   'vùng này càng tốt. Vào cuối vòng chơi, nếu mỗi điều tra viên đều đang ở cùng một địa điểm '
                   '[[Port]], bạn có thể di chuyển sang một vùng khác bằng cách advance act này.\n'
                   '<b>Objective</b> - Nếu các điều tra viên đã khám phá 10 Dấu Hiệu Của Các Thần, tiến tới '
                   '<b>(→R1)</b>.',
           'flavor': 'Vùng đất cổ xưa, huyền thoại Mnar là một trong những vùng lâu đời nhất ở Dreamlands, nơi các bộ '
                     'lạc du mục lang thang đã định cư các thành bang ngày càng phát triển về quy mô và quyền lực qua '
                     'vô số thời đại, cho đến khi chúng trở thành những đô thị tráng lệ như ngày nay.',
           'back_name': 'Đi Đâu Bây Giờ?',
           'back_text': 'Tìm kiếm trong chồng bài encounter, chồng bài bỏ, và tất cả các khu vực chơi kẻ địch Beings '
                        'of Ib và loại bỏ nó khỏi trò chơi.\n'
                        'Xáo trộn chồng bài encounter bỏ vào chồng bài encounter.\n'
                        'Các điều tra viên phải quyết định (chọn một). Bạn không thể chọn một địa điểm bạn đã ghé '
                        'thăm. Nếu bạn đã ghé thăm từng khu vực được liệt kê, tiến tới <b>(→R1)</b>.\n'
                        '- Ghé thăm hòn đảo Oriab ở phía nam. Giải quyết <b>Oriab Setup</b> trong Campaign Guide.\n'
                        '- Ghé thăm Forbidden Lands ở phía bắc. Giải quyết <b>Forbidden Lands Setup</b> trong Campaign '
                        'Guide.\n'
                        '- Ghé thăm vương quốc Timeless Realm ở phía đông. Giải quyết <b>Timeless Realm Setup</b> '
                        'trong Campaign Guide.',
           'back_flavor': 'Sau khi đã cạn kiệt các lựa chọn tại vùng đất này, bạn quay trở lại tàu của mình. Vị thuyền '
                          'trưởng ra lệnh cho thủy thủ đoàn chuẩn bị rời cảng. "Tôi cứ ngỡ các bạn sẽ không quay lại '
                          'kịp lúc, nhưng các bạn đã ở đây rồi," vị thuyền trưởng cười toe toét nói. "Sao nào? Giờ đi '
                          'đâu?"'},
 '06125': {'name': 'Tìm Kiếm Màn Đêm',
           'text': '<b>Objective</b> - Tìm kiếm và khám phá càng nhiều Dấu Hiệu Của Các Thần (Signs of the Gods) tại '
                   'vùng này càng tốt. Vào cuối vòng chơi, nếu mỗi điều tra viên đều đang ở cùng một địa điểm '
                   '[[Port]], bạn có thể di chuyển sang một vùng khác bằng cách advance act này.\n'
                   '<b>Objective</b> - Nếu các điều tra viên đã khám phá 10 Dấu Hiệu Của Các Thần, tiến tới '
                   '<b>(→R1)</b>.',
           'flavor': 'Từ sự an toàn tương đối của thành phố tráng lệ Ilek-Vad, bạn có thể băng qua khung cảnh kỳ dị và '
                     'như địa ngục của Forbidden Lands. Phía đông của vùng đất cằn cỗi và cháy sém này là những vùng '
                     'đất đã bị tàn phá bởi bầy đàn của Màn Đêm.',
           'back_name': 'Đi Đâu Bây Giờ?',
           'back_text': 'Tìm kiếm trong chồng bài encounter, chồng bài bỏ, và tất cả các khu vực chơi các kẻ địch '
                        'Horde of Night và Stalking Manticore và loại bỏ từng kẻ địch đó khỏi trò chơi.\n'
                        'Xáo trộn chồng bài encounter bỏ vào chồng bài encounter.\n'
                        'Các điều tra viên phải quyết định (chọn một). Bạn không thể chọn một địa điểm bạn đã ghé '
                        'thăm. Nếu bạn đã ghé thăm từng khu vực được liệt kê, tiến tới <b>(→R1)</b>.\n'
                        '- Ghé thăm hòn đảo Oriab ở phía nam. Giải quyết <b>Oriab Setup</b> trong Campaign Guide.\n'
                        '- Ghé thăm vùng đất cổ xưa Mnar ở phía tây. Giải quyết <b>Mnar Setup</b> trong Campaign '
                        'Guide.\n'
                        '- Ghé thăm vương quốc Timeless Realm ở phía đông. Giải quyết <b>Timeless Realm Setup</b> '
                        'trong Campaign Guide.',
           'back_flavor': 'Cuối cùng bạn cũng trở lại tàu của mình, sẵn sàng bỏ lại vùng đất bị nguyền rủa này ở phía '
                          'sau. "Chúng ta đừng nán lại nơi bị thần linh ruồng bỏ này thêm nữa," vị thuyền trưởng nói, '
                          'quát tháo ra lệnh cho thủy thủ đoàn của mình. "Ilek-Vad có thể là một viên ngọc quý, nhưng '
                          'những vùng đất phía xa đầy rẫy hiểm nguy. Chọn một hướng đi đi. Bất kỳ hướng nào cũng được. '
                          'Miễn là nó cách xa nơi này."'},
 '06126': {'name': 'Sắc Lệnh Của Nhà Vua',
           'text': '<b>Objective</b> - Tìm kiếm và khám phá càng nhiều Dấu Hiệu Của Các Thần (Signs of the Gods) tại '
                   'vùng này càng tốt. Vào cuối vòng chơi, nếu mỗi điều tra viên đều đang ở cùng một địa điểm '
                   '[[Port]], bạn có thể di chuyển sang một vùng khác bằng cách advance act này.\n'
                   '<b>Objective</b> - Nếu các điều tra viên đã khám phá 10 Dấu Hiệu Của Các Thần, tiến tới '
                   '<b>(→R1)</b>.',
           'flavor': 'Phần lớn vương quốc thung lũng Ooth-Nargai, được cai trị bởi kẻ mộng mơ Kuranes, thoát khỏi sự '
                     'kìm kẹp của thời gian. Không có gì ở đây bị già đi hay rơi vào tình trạng hư nát. Đó là một cõi '
                     'của những điều kỳ diệu và phi thường - có bao nhiêu năm tháng trôi qua ở đây trước khi bạn kịp '
                     'nhận ra?',
           'back_name': 'Đi Đâu Bây Giờ?',
           'back_text': 'Tìm kiếm trong chồng bài encounter, chồng bài bỏ, và tất cả các khu vực chơi kẻ địch The '
                        'Crawling Mist và loại bỏ nó khỏi trò chơi.\n'
                        'Xáo trộn chồng bài encounter bỏ vào chồng bài encounter.\n'
                        'Các điều tra viên phải quyết định (chọn một). Bạn không thể chọn một địa điểm bạn đã ghé '
                        'thăm. Nếu bạn đã ghé thăm từng khu vực được liệt kê, tiến tới <b>(→R1)</b>.\n'
                        '- Ghé thăm hòn đảo Oriab ở phía nam. Giải quyết <b>Oriab Setup</b> trong Campaign Guide.\n'
                        '- Ghé thăm vùng đất cổ xưa Mnar ở phía tây. Giải quyết <b>Mnar Setup</b> trong Campaign '
                        'Guide.\n'
                        '- Ghé thăm Forbidden Lands ở phía bắc. Giải quyết <b>Forbidden Lands Setup</b> trong Campaign '
                        'Guide.',
           'back_flavor': 'Thủy thủ đoàn của tàu càu nhàu phản đối khi bạn tuyên bố ý định rời đi. "Ai mà trách họ '
                          'được chứ?" vị thuyền trưởng ghé sát vào và nói nhỏ trong khi thủy thủ đoàn chuẩn bị cho '
                          'chuyến hải hành. "Họ sẽ ở lại cảng ở đây mãi mãi nếu họ có thể. Nhưng than ôi, biển cả đang '
                          'vẫy gọi. Vậy, tiếp theo chúng ta sẽ hướng về đâu?"'},
 '06207': {'name': 'Khuấy Động Tĩnh Lặng',
           'text': '',
           'flavor': 'Sự tĩnh lặng của nơi này khiến người ta đinh tai nhức óc. Không có tiếng gió rít qua không '
                     'trung, không có tiếng chim hót, không có bất kỳ âm thanh vu vơ nào. Đây là một thế giới chết. '
                     'Mặc dù bạn biết nguy hiểm rình rập quanh mọi ngóc ngách, bạn không nghe thấy bất kỳ dấu hiệu nào '
                     'của những con quái thú hay lũ Corsair coi nơi này là nhà. Bạn phải giữ im lặng hơn nữa để ẩn '
                     'mình.',
           'back_name': 'Vứt Chìa Khóa Đi',
           'back_text': 'Xáo trộn chồng bài encounter bỏ vào chồng bài encounter.\n'
                        'Tăng mức báo động (alarm level) của mỗi điều tra viên thêm 1.',
           'back_flavor': 'Một tiếng rít duy nhất xé toạc sự tĩnh lặng, và theo bản năng bạn cúi người tìm chỗ nấp. '
                          'Bạn đã từng nhìn thấy những sinh vật này trước đây: những quái vật ghê tởm, không mắt bay '
                          'dọc theo những chiếc thuyền chiến galley đen của lũ hải tặc Corsair. Những thứ khủng khiếp '
                          'làm bằng xương và lớp da màng dai như da thuộc.\n'
                          'Một đàn lượn vòng và rít lên trên đầu. Bạn đã bị phát hiện chưa? Chẳng còn quan trọng nữa. '
                          'Bạn không thể ở lại đây thêm nữa.'},
 '06208': {'name': 'Báo Động Được Kéo Lên',
           'text': '',
           'flavor': 'Bước chân của bạn dồn dập hơn khi sự truy đuổi của những sinh vật trở nên điên cuồng hơn theo '
                     'từng phút trôi qua. Sự tĩnh lặng mà bạn từng nguyền rủa đã bị phá vỡ; những tiếng rít chói tai '
                     'kinh khủng điểm xuyết trong đêm còn tồi tệ hơn gấp bội.',
           'back_name': 'Chạy Đi, Thỏ Ơi, Chạy Đi!',
           'back_text': 'Xáo trộn chồng bài encounter bỏ vào chồng bài encounter.\n'
                        'Tăng mức báo động (alarm level) của mỗi điều tra viên thêm 1.\n'
                        '<hr><b>Kiểm tra Campaign Log. <i>Nếu các điều tra viên đã mở đường xông vào ngôi đền</i>, hãy '
                        'đọc phần sau:</b>\n'
                        '<i><blockquote>...nhưng chẳng có ai tới cả.</blockquote></i>\n'
                        'Điều tra viên dẫn đầu tìm kiếm trong chồng bài encounter và chồng bài bỏ 1 bản sao của Cats '
                        'from Saturn và rút nó.\n'
                        '<hr><b>Nếu không, hãy đọc phần sau:</b>\n'
                        '<i><blockquote>...và trước sự ngạc nhiên của bạn, một đội quân mèo đáp xuống ngay trước mặt '
                        'bạn, đã phóng qua cõi hư không của chính vũ trụ. Bạn nhận ra con mèo đứng đầu đội hình là con '
                        'mèo xám già có vết sẹo mà bạn đã gặp nhiều tháng trước. "Chạy đi, con người!" nó hét lên. '
                        '"Chúng tôi sẽ cầm chân chúng!"</blockquote></i>',
           'back_flavor': 'Lối thoát của bạn bị cắt đứt khi một bầy sinh vật uyển chuyển bao vây bạn. Thoạt nhìn, bạn '
                          'ngỡ chúng là mèo, nhưng hình dáng của chúng chỉ mơ hồ giống mèo. Thứ mà bạn tưởng nhầm là '
                          'lông mao thực chất giống như một chuỗi các hoa văn, giống như những đường chạm trổ kỳ lạ. '
                          'Bạn thầm cầu nguyện xin sự cứu giúp...'},
 '06209': {'name': 'Chúng Đã Áp Sát!',
           'text': '(Gợi ý — Trò chơi sẽ không kết thúc khi agenda này advance... nhưng các thuộc hạ của Nyarlathotep '
                   'sẽ siết chặt chiếc thòng lọng của chúng.)',
           'flavor': 'Toàn bộ cư dân trên Mặt Trăng giờ đây đã trỗi dậy chống lại bạn. Đằng sau mỗi góc khuất, một '
                     'nhóm Corsair nằm mai phục, hoặc một đàn mèo săn rình rập để dồn bạn về phía những chủ nhân tàn '
                     'độc của chúng. Bầu trời phía trên tràn ngập những quái thú có cánh và những chiếc thuyền chiến '
                     'galley đen. Nếu bạn không thể tìm đường trở lại Trái Đất, bạn chắc chắn sẽ bị bắt giữ.',
           'back_name': 'Giờ Tàn Sát',
           'back_text': 'Tăng mức báo động (alarm level) của mỗi điều tra viên thêm 1.\n'
                        'Mỗi điều tra viên nhận horror bằng một nửa mức báo động của họ (làm tròn lên).\n'
                        'Đặt lại chồng bài agenda về agenda 3a. Sau đó, đặt 2 doom lên agenda đó.',
           'back_flavor': 'Chẳng còn nơi nào để chạy trốn nữa.'},
 '06210': {'name': 'Trong Bụng Quái Thú Mặt Trăng',
           'text': '<b>Objective</b> - Chỉ các điều tra viên tại City of the Moon-Beasts mới có thể cùng nhau chi trả '
                   'số lượng manh mối cần thiết, theo nhóm, để advance.',
           'flavor': 'Virgil Gray đang bị giam cầm ở một nơi nào đó trong thành phố rộng lớn, kỳ dị của loài quái thú '
                     'mặt trăng moon-beast. Bạn phải thật im lặng và khôn khéo nếu muốn tìm thấy ông và trốn thoát mà '
                     'không bị chú ý.',
           'back_name': 'Giải Cứu Kịp Thời',
           'back_text': 'Chọn một điều tra viên tại City of the Moon-Beasts để nắm quyền kiểm soát story asset Virgil '
                        'Gray <i>(Truly Inspired)</i> đang để riêng.\n'
                        'Kiểm tra Campaign Log: <i>Nếu Randolph bị bắt</i>, chủ sở hữu của lá bài đó đưa story asset '
                        'Randolph Carter <i>(Expert Dreamer)</i> đang để riêng vào tay họ.',
           'back_flavor': 'Sau nhiều giờ luồn lách qua những tháp đá lở loét và tìm kiếm khắp mọi nơi, cuối cùng bạn '
                          'cũng phát hiện ra một nhóm tù nhân bị xiềng xích đang bị dẫn đi thành một hàng từ các bến '
                          'tàu đến nơi nào đó chẳng ai hay. May mắn thay, họ chỉ được canh gác bởi hai tên Corsair hôi '
                          'hám. Bạn tạo ra một sự xao nhãng đủ lớn để tách cặp đôi này ra, sau đó lẻn qua để giải '
                          'thoát các tù nhân.'},
 '06211': {'name': 'Thám Hiểm Mặt Trăng',
           'text': '<b>Objective</b> - Chỉ các điều tra viên tại Temple of the Moon Lizard mới có thể cùng nhau chi '
                   'trả số lượng manh mối cần thiết, theo nhóm, để advance.',
           'flavor': 'Bây giờ khi các bạn đã đoàn tụ, đã đến lúc rời khỏi tảng đá này. Randolph thông báo cho bạn rằng '
                     'mặt sáng của Mặt Trăng sẽ an toàn khỏi tầm với của lũ quái thú mặt trăng moon-beast, những kẻ '
                     'chỉ cư ngụ ở mặt này. Tuy nhiên, khoảng cách quá xa để bạn có thể đi bộ. Bạn sẽ phải tìm một '
                     'cách khác để trốn thoát.',
           'back_name': 'Xuyên Qua Trung Tâm',
           'back_text': 'Đưa các địa điểm Caverns Beneath the Moon <i>(Dark Side)</i> và The Black Core đang để riêng '
                        'vào chơi.\n'
                        'Spawn Moon Lizard đang để riêng tại The Black Core, exhausted.\n'
                        'Xáo trộn chồng bài encounter bỏ vào chồng bài encounter.',
           'back_flavor': 'Trong khi phần lớn ngôi đền này được dành để tôn thờ một bức tượng thần mà các sinh vật cư '
                          'ngụ trên mặt trăng gọi là "Moon Lizard", bạn cũng tìm thấy một số tài liệu nhắc đến một '
                          'loại hồ chứa chất nhầy đen nguyên thủy không xa bên dưới bề mặt, thứ liên kết phần lõi của '
                          'Mặt Trăng lại với nhau. "Những văn tự này ngụ ý rằng toàn bộ bề mặt của Mặt Trăng được kết '
                          "nối bởi 'lõi' này qua nhiều chiều không gian. Có lẽ chúng ta có thể sử dụng nó để băng qua "
                          'phía bên kia của Mặt Trăng," Randolph gợi ý.\n'
                          '"Hoặc sang thế giới bên kia," Virgil nói thêm.\n'
                          '"Vâng, một trong hai," Randolph thản nhiên đáp lại. "Đó vẫn là lựa chọn duy nhất của chúng '
                          'ta."'},
 '06212': {'name': 'Lõi Của Mặt Trăng',
           'text': 'Không thể khám phá manh mối từ The Black Core ngoại trừ như một kết quả của một cuộc điều tra '
                   'thành công.\n'
                   '<b>Objective</b> - Nếu mỗi điều tra viên còn sống sót đều đang ở The Black Core và nó không có '
                   'manh mối nào trên đó, advance.',
           'flavor': 'Bạn gạt bỏ sự hoài nghi của mình và đi xuống bên dưới lớp vỏ Mặt Trăng. Để đến được phía bên kia '
                     'của Mặt Trăng, bạn phải vượt qua lõi đen của nó, một chất lỏng đa chiều không gian nơi những cơn '
                     'ác mộng được sinh ra.',
           'back_name': 'Sang Phía Bên Kia',
           'back_text': 'Đưa các địa điểm Caverns Beneath the Moon <i>(Light Side)</i>, Light Side of the Moon, và The '
                        'White Ship đang để riêng vào chơi.',
           'back_flavor': 'Hồ dịch đen bên dưới bề mặt Mặt Trăng rộng hàng dặm và sôi sùng sục những túi khí ấm, độc '
                          'hại. Hầu hết đáy hồ hoàn toàn là chất rắn, và có vẻ như kế hoạch của Randolph thực sự là '
                          'một ngõ cụt. Sau đó, bạn bước một bước cuối cùng, và chân bạn hẫng vào... hư không. Trước '
                          'khi bạn kịp phản ứng, bạn bị kéo tuột xuống dưới bề mặt. Bạn cố hét lên lời cảnh báo tới '
                          'những người đồng hành của mình, nhưng những lời nói của bạn bị lõi đen nuốt chửng, cùng với '
                          'phần còn lại của cơ thể bạn. Phổi bạn hầu như không còn không khí. Bạn cố gắng không la hét '
                          'khi bị cuốn đi bởi một dòng nước ngầm dữ dội. Khi cuối cùng bạn ngoi lên, bạn đang ở trong '
                          'một căn phòng khác giống hệt căn phòng bạn vừa rời khỏi, chỉ có điều bạn có thể thấy một '
                          'chùm ánh sáng xuyên qua lớp vỏ màu xám phía trên bạn. Chốc lát sau, phần còn lại của nhóm '
                          'bạn cũng ngoi lên. "Chúng ta đã qua được chưa?" Virgil hỏi. "Chà, tôi cứ ngỡ đó chắc chắn '
                          'là hồi kết rồi chứ. Chuyện này sẽ làm nên một chương sách đầy kịch tính đấy!"'},
 '06213': {'name': 'Cuộc Giải Cứu Bất Ngờ',
           'text': '<b>Objective</b> - Tìm đường rời khỏi Mặt Trăng. <i>(Bạn sẽ được hướng dẫn khi nào cần '
                   'advance.)</i>',
           'flavor': 'Bề mặt của mặt sáng của Mặt Trăng được tuần tra bởi những con tàu giương buồm băng qua bầu trời '
                     'lặng gió. Tuy nhiên, có một con tàu trông khác biệt so với phần còn lại. Thân tàu của nó hoàn '
                     'toàn nguyên vẹn và tỏa sáng, phát ra ánh hào quang màu trắng vào màn đêm. "The White Ship!" '
                     'Randolph thở dốc.',
           'back_name': 'Vị Thuyền Trưởng',
           'back_text': '<b>(→R1)</b>',
           'back_flavor': 'Khi nhóm của bạn đã an toàn trên con tàu White Ship, bạn cầu xin thuyền trưởng của tàu rời '
                          'khỏi Mặt Trăng ngay lập tức. Bạn không muốn ở lại nơi đầy hiểm nguy này lâu hơn mức cần '
                          'thiết. "Chưa đâu," vị thuyền trưởng trả lời với một nụ cười hòa nhã. Bạn van nài ông, nhưng '
                          'ông giơ một tay lên ra hiệu giữ im lặng, dõi mắt nhìn vào khoảng không xa xăm. Bạn nheo mắt '
                          'nhìn ngược ánh sáng từ mặt trời đang treo lơ lửng bất động trên bầu trời tối thẫm. Ở đằng '
                          'kia, cách đó hàng dặm, bạn phát hiện ra thứ đã thu hút ánh nhìn của vị thuyền trưởng: một '
                          'con chim có nhiều cánh và thậm chí còn nhiều màu sắc hơn thế, lông của nó sáng rực và sống '
                          'động. Nó đậu trên một công trình kiến trúc bằng đá đổ nát và tự rỉa lông. Sau đó, ngay khi '
                          'sự kiên nhẫn của bạn bắt đầu cạn kiệt, nó phóng mình vào không gian, và vị thuyền trưởng '
                          'kéo mỏ neo của con tàu lên.'},
 '06169a': {'name': 'Ngôi Nhà Không Tên',
            'text': '',
            'flavor': 'Ngôi nhà mà Randolph gọi là "The Unnamable" không có gì nổi bật để nhìn ngắm. Tòa nhà tồi tàn '
                      'từ thế kỷ thứ mười bảy này đã bị bỏ hoang trong nhiều thập kỷ và đã rơi vào tình trạng đổ nát. '
                      'Cửa ra vào của nó bị cào xước và rỗ chằng chịt, hầu hết các ô cửa sổ đều vỡ vụn, và chuột bọ bò '
                      'lúc nhúc quanh móng nhà.',
            'back_name': '',
            'back_text': '',
            'back_flavor': ''},
 '06170': {'name': 'Thứ Không Tên',
           'text': 'Mỗi Swarm of Rats nhận swarming 1.\n'
                   '<b>Forced</b> - Vào đầu lượt của bạn, nếu The Unnamable đang ready và ở địa điểm của bạn: Kiểm tra '
                   '[willpower] (2). Nếu thất bại, nó tấn công bạn <i>(ngay cả khi nó không engaged)</i>.',
           'flavor': 'Bạn đã cảm thấy một sự hiện diện tà ác ẩn nấp ở đây kể từ khi bạn đến. Thực thể này thách thức '
                     'mọi sự miêu tả. Đôi khi nó dường như vô định hình; vào những lúc khác, nó hiện thân thành vô số '
                     'hình dạng và đặc điểm. Thỉnh thoảng bạn có thể nhận ra một đặc điểm cụ thể - một con mắt, một '
                     'chiếc sừng, một vết sẹo tì vết - nhưng nó biến mất ngay khi bạn tập trung nhìn vào nó.',
           'back_name': 'Nó Trở Nên Táo Tợn Hơn',
           'back_text': 'Xáo trộn chồng bài encounter bỏ vào chồng bài encounter.',
           'back_flavor': 'Thời gian không còn nhiều. Thực thể, trước đây dường như bằng lòng ẩn mình và quan sát bạn '
                          'từ xa, giờ đây căng tràn sức mạnh và đuổi theo bạn với sự hung hãn không ngừng nghỉ. Nó '
                          'quằn quại và giãy giụa, dường như xuất hiện ở khắp mọi nơi cùng một lúc. Bạn phải nhanh '
                          'chóng đối mặt với nỗi sợ hãi của mình, nếu không bạn sẽ không bao giờ tìm được đường vào '
                          'Dreamlands.'},
 '06171': {'name': 'Kẻ Chết Không Tên',
           'text': 'Mỗi Swarm of Rats nhận swarming 2.\n'
                   'The Unnamable mất aloof và nhận massive.\n'
                   '<b>Forced</b> - Vào đầu lượt của bạn, nếu The Unnamable đang ready và ở địa điểm của bạn: Kiểm tra '
                   '[willpower] (2). Nếu thất bại, nó tấn công bạn <i>(ngay cả khi nó không engaged)</i>.',
           'flavor': '"Có một cơn lốc gió tàn khốc, lạnh như băng, và rồi tiếng lách cách của những viên gạch vỡ và '
                     'thạch cao rơi; nhưng tôi đã may mắn ngất đi trước khi kịp hiểu điều đó có nghĩa là gì."\n'
                     ' — H. P. Lovecraft, "The Unnamable"',
           'back_name': 'Nó Có Thật',
           'back_text': '<b>(→R2)</b>',
           'back_flavor': 'Trước sự ngạc nhiên của bạn, âm thanh đáng sợ nhất - âm thanh sẽ mãi mãi khắc sâu vào ký ức '
                          'của bạn về những sự kiện trong đêm - không phải là những tiếng kêu ai oán, vọng lại vô vọng '
                          'của con quái vật không tên hay tiếng giòn rụm như giấy của những xác chết khô khốc đang bị '
                          'ngấu nghiến trong nghĩa địa. Đó chỉ là tiếng cọt kẹt đơn thuần của một cánh cửa sổ mắt '
                          'cáo.\n'
                          'Randolph trở nên đơ cứng và tái mét. Bạn nhận ra ẩn ý ngay sau khi anh nhớ lại âm thanh đó. '
                          'Tất cả các khung cửa sổ trong nhà đều đã rơi rụng từ lâu - tất cả chỉ trừ một cái duy nhất. '
                          'Đó là cửa sổ căn gác xép nơi giấu kín bóng tối ma quỷ bị nguyền rủa: thứ không có tên. Nó '
                          'vươn tay ra đón lấy bạn.'},
 '06172': {'name': 'Tìm Kiếm The Unnamable',
           'text': '<b>Objective</b> - Thám hiểm ngôi nhà để tìm đường vào Dreamlands. <i>(Tìm và hoàn thành một mục '
                   'tiêu trên một lá bài scenario khác để advance.)</i>',
           'flavor': 'Bạn vẫn không chắc chắn chính xác mình phải tìm gì bên trong ngôi nhà cũ, nhưng Randolph khẳng '
                     'định rằng bạn cần xác định vị trí của chiếc "chìa khóa". Dường như bạn không có lựa chọn nào '
                     'khác ngoài việc tìm kiếm ngôi nhà và xem mình có thể phát hiện được gì.',
           'back_name': 'Vào Nơi Sâu Thẳm',
           'back_text': 'Để The Unnamable sang một bên. Nó giữ nguyên tất cả token và lá bài gắn kèm.\n'
                        'Loại bỏ mỗi địa điểm khỏi trò chơi (hoặc đặt nó vào khu vực trưng bày thành tích nếu nó có '
                        '<b>Victory X</b> và không có manh mối nào trên đó). Các điều tra viên không bị đánh bại trong '
                        'quá trình này. <i>(Các kẻ địch khác và lá bài gắn kèm tại những địa điểm đó bị bỏ.)</i>\n'
                        'Xáo trộn các địa điểm Mysterious Stairs đang để riêng và đưa 5 địa điểm trong số đó vào chơi '
                        'theo một đường thẳng đứng. Loại bỏ địa điểm Mysterious Stairs còn lại khỏi trò chơi.\n'
                        'Đặt mỗi điều tra viên và kẻ địch The Unnamable đang để riêng tại địa điểm Mysterious Stairs '
                        'cao nhất, lật mở nó.\n'
                        'Tìm kiếm trong chồng bài encounter và chồng bài bỏ cả hai bản sao của Locked Door và cả hai '
                        'bản sao của Secrets in the Attic, và loại bỏ chúng khỏi trò chơi.\n'
                        'Xáo trộn mỗi bản sao của Endless Descent đang để riêng vào chồng bài encounter, cùng với '
                        'chồng bài encounter bỏ.',
           'back_flavor': 'Ngôi mộ mở ra một cầu thang trải dài sâu vào lòng đất trước khi biến mất vào bóng tối.'},
 '06173': {'name': 'Những Bậc Thang Bất Tận',
           'text': 'Trong khi địa điểm Mysterious Stairs thấp nhất được lật mở, nó nhận: "[action]: <b>Resign.</b>"\n'
                   '<b>Objective</b> - Chạm tới đáy cầu thang. Nếu mỗi điều tra viên chưa bị đánh bại đã resign, '
                   'advance.',
           'flavor': 'Những bậc thang dường như đi xuống mãi mãi. Mỗi lần bạn nghĩ mình sắp đến nơi, bạn lại rẽ qua '
                     'một góc khác và thấy hàng trăm bậc thang nữa.',
           'back_name': 'Cưỡng Ép Tiến Vào',
           'back_text': '<b>(→R1)</b>',
           'back_flavor': 'Những tiếng kêu ai oán tuyệt vọng của sinh vật không tên - dù nó là gì hay đã từng là gì - '
                          'vang vọng khắp hang động phi tự nhiên từ rất xa phía trên bạn. "Nó không thể chạm tới chúng '
                          'ta ở dưới này," Randolph nói, thở phào nhẹ nhõm. Đó là một chuyến đi xuống đầy đau đớn, '
                          'nhưng cuối cùng bạn cũng an toàn khỏi sinh vật không thể miêu tả đó. Dẫu vậy, sự an toàn '
                          'của bạn chỉ là thoáng qua. Cầu thang cuộn xoắn bên dưới bạn mà không thấy điểm dừng. Những '
                          'ô cửa sổ trên bức tường đá của ngọn tháp nhìn ra một vùng cảnh quan vô tận gồm những mỏm đá '
                          'lởm chởm và những đỉnh núi cằn cỗi, được chiếu sáng mờ ảo bởi ánh sáng phốt pho màu xám. '
                          'Bạn vẫn còn cách đáy thế giới ngầm này nhiều dặm, và ai biết được bạn có thể tìm thấy những '
                          'điều kinh hoàng nào một khi đặt chân tới nơi?\n'
                          '"Đây mới chỉ là sự khởi đầu," Randolph cảnh báo bạn. "Giờ không còn đường quay lại nữa rồi. '
                          'Bạn đã sẵn sàng để tiếp tục chưa?"'},
 '06248': {'name': 'Một Cõi Hiểm Ác',
           'text': '',
           'flavor': 'Underworld là một cõi hang động khổng lồ, gần như là một thế giới hoàn toàn tách biệt. Trần của '
                     'nó ở quá xa đến mức nó cũng có thể xem như một bầu trời u ám, mây mù che phủ. Các bức tường hang '
                     'động được chiếu sáng lờ mờ bởi một thứ ánh sáng xám chập chờn không rõ nguồn gốc. Bạn lang thang '
                     'qua những hầm mộ quanh co để tìm đường về phía trước, nhưng bạn không thể rũ bỏ được cảm giác '
                     'mình đang bị theo dõi.',
           'back_name': 'Lối Đi Tối Dần',
           'back_text': 'Xáo trộn chồng bài encounter bỏ vào chồng bài encounter.\n'
                        'Đặt 1 damage lên lá bài tham chiếu scenario (scenario reference card).',
           'back_flavor': 'Một làn sóng đau đớn và buồn nôn bất ngờ ập đến trên bạn, và trong một thoáng chốc ngắn '
                          'ngủi, dường như chính kết cấu của thực tại đang bị xé toạc. Cảm giác đó qua đi nhanh chóng, '
                          'nhưng rõ ràng là có điều gì đó không ổn.'},
 '06249': {'name': 'Bị Quái Vật Bao Vây',
           'text': '(Gợi ý — Trò chơi không nhất thiết phải kết thúc khi agenda này advance... nhưng tính ổn định của '
                   'thực tại sẽ tiếp tục bị phá vỡ.)',
           'flavor': 'Khi bạn tiếp tục thám hiểm, những sinh vật của Underworld trở nên kích động và bắt đầu truy đuổi '
                     'bạn, như thể bị thúc đẩy bởi một thế lực vô hình nào đó.',
           'back_name': 'Kẻ Dệt Lưới Áp Sát',
           'back_text': 'Mỗi điều tra viên phải hoặc bỏ 1 lá bài ngẫu nhiên từ tay họ hoặc mất 2 tài nguyên.\n'
                        'Xáo trộn chồng bài encounter bỏ vào chồng bài encounter.\n'
                        'Đặt 1 damage lên lá bài tham chiếu scenario (scenario reference card). Sau đó:\n'
                        '- Nếu có từ 5 token damage trở lên trên lá bài tham chiếu scenario, tiến tới <b>(→R2)</b>.\n'
                        '- Nếu không, lật mặt agenda này lại.',
           'back_flavor': 'Một lần nữa bạn lại bị rung chuyển bởi một cảm giác bất ổn bất ngờ khi thực tại dịch chuyển '
                          'và uốn cong xung quanh bạn. Làn sóng dữ dội hơn trước, và nó dường như bắt nguồn từ Biển '
                          'Nhựa Đường Sea of Pitch ở nơi sâu thẳm của Underworld.'},
 '06250': {'name': 'Bước Vào Underworld (bản I)',
           'text': '<b>Forced</b> - Sau khi một kẻ địch có từ 1 manh mối trở lên trên đó bị đánh bại: Nắm quyền kiểm '
                   'soát từng manh mối đó.\n'
                   '<b>Objective</b> - Thám hiểm vùng này. <i>(Bạn sẽ được hướng dẫn khi nào cần advance.)</i>',
           'flavor': 'Bạn đã thành công bước vào Dreamlands, nhưng nơi này không hẳn là những gì bạn mong đợi. Bạn '
                     'đang ở Underworld, và sẽ phải mất nhiều công sức để tìm phương hướng ở nơi hiểm ác này.',
           'back_name': 'Một Đồng Minh U Buồn',
           'back_text': 'Đưa từng địa điểm [[Vale]] đang để riêng vào chơi.\n'
                        'Tìm từng lá bài thuộc encounter set <i>Ghouls</i> và encounter set <i>Striking Fear</i> (ngay '
                        'cả khi chúng ở ngoài màn chơi). Loại bỏ chúng khỏi trò chơi.\n'
                        'Xáo trộn các encounter set <i>Terror of the Vale</i> và <i>Nightgaunts</i> đang để riêng vào '
                        'chồng bài encounter, cùng với chồng bài bỏ.',
           'back_flavor': 'Bạn vội vã giải thích trong hoảng loạn tất cả những gì đã xảy ra với mình. Khi con ghoul '
                          'nghe thấy cái tên "Randolph Carter", thái độ của nó thay đổi. Nó hỏi điều gì đã xảy ra với '
                          'Randolph, và bạn kể cho nó nghe về số phận của người bạn mình. Nỗi buồn xâm chiếm sinh vật '
                          'này. Nó tự giới thiệu mình là Richard Pickman, và nói với bạn rằng Randolph đã từng là bạn '
                          'của nó. Nó đồng ý để bạn đi qua trong yên bình, nhưng không quên đưa ra lời cảnh báo: những '
                          'sự kiện kỳ lạ đang xảy ra bên trong Underworld. Nó kể về những thế lực đen tối đang lan '
                          'rộng khắp thung lũng bên dưới Plain of the Ghouls, về những kẻ dệt lưới ghê tởm bò dọc theo '
                          'các bức tường hang động, và về một tiếng hú rợn người vang vọng khắp cõi giới. Tất cả những '
                          'thứ đó, nó giải thích bằng thứ giọng lảm nhảm khó hiểu, đều bắt nguồn từ một nơi: một đại '
                          'dương nhựa đường ở tầng sâu nhất của cõi giới.'},
 '06251': {'name': 'Bước Vào Underworld (bản II)',
           'text': '<b>Forced</b> - Sau khi một kẻ địch có từ 1 manh mối trở lên trên đó bị đánh bại: Nắm quyền kiểm '
                   'soát từng manh mối đó.\n'
                   '<b>Objective</b> - Tìm Richard Upton Pickman. <i>(Bạn sẽ được hướng dẫn khi nào cần advance.)</i>',
           'flavor': 'Bạn đã thành công bước vào Dreamlands, nhưng nơi này không hẳn là những gì bạn mong đợi. Bạn '
                     'đang ở Underworld, và sẽ phải mất nhiều công sức để tìm phương hướng ở nơi hiểm ác này.',
           'back_name': 'Một Đồng Minh Khó Ngờ',
           'back_text': 'Chọn một điều tra viên để nắm quyền kiểm soát story asset Richard Upton Pickman đang để '
                        'riêng. Trong phần còn lại của scenario, nếu Richard Upton Pickman rời khỏi màn chơi, loại bỏ '
                        'ông khỏi trò chơi.\n'
                        'Đưa từng địa điểm [[Vale]] đang để riêng vào chơi.\n'
                        'Tìm từng lá bài thuộc encounter set <i>Striking Fear</i> (ngay cả khi chúng ở ngoài màn '
                        'chơi). Loại bỏ chúng khỏi trò chơi.\n'
                        'Xáo trộn các encounter set <i>Terror of the Vale</i> và <i>Nightgaunts</i> đang để riêng vào '
                        'chồng bài encounter, cùng với chồng bài bỏ.',
           'back_flavor': 'Randolph cất tiếng reo nhận biết khi con ghoul tiến lại gần. Anh và sinh vật này bắt tay và '
                          'trò chuyện trong một lúc ngắn, sau đó anh giới thiệu nó với bạn. "Đây là con ghoul mà tôi '
                          'đã kể với các bạn. Nó là một người bạn cũ của tôi, và nó đã đề nghị dẫn chúng ta qua '
                          'Underworld. Tuy nhiên, nó có một số tin xấu..." Randolph tiếp tục giải thích: những sự việc '
                          'kỳ lạ đang diễn ra bên trong Underworld. Anh kể về những thế lực đen tối đang lan tràn khắp '
                          'thung lũng bên dưới Plain of the Ghouls, về những kẻ dệt lưới ghê tởm bò dọc các bức tường '
                          'hang động, và về một tiếng hú khủng khiếp vang rền khắp cõi giới. Tất cả những điều đó, anh '
                          'nói, đều bắt nguồn từ một nơi: một đại dương nhựa đường ở tầng sâu nhất của cõi giới.'},
 '06252': {'name': 'Chuyến Đi Xuống',
           'text': '<b>Forced</b> - Sau khi một kẻ địch có từ 1 manh mối trở lên trên đó bị đánh bại: Nắm quyền kiểm '
                   'soát từng manh mối đó.\n'
                   '<b>Objective</b> - Tìm đường đến Biển Nhựa Đường Sea of Pitch. <i>(Bạn sẽ được hướng dẫn khi nào '
                   'cần advance.)</i>',
           'flavor': 'Con đường dẫn đến thung lũng bên dưới đầy rẫy hiểm nguy. Bạn sẽ phải trèo xuống từ một nơi mà '
                     'Pickman gọi là "Crag of the Ghouls," nơi những sinh vật này vứt bỏ những phần thức ăn rùng rợn '
                     'thừa thãi trong các bữa ăn ghê rợn của chúng. Bạn chỉ có thể tưởng tượng nơi sâu thẳm sẽ như thế '
                     'nào.',
           'back_name': 'Lối Băng Qua',
           'back_text': 'Đưa từng địa điểm [[Depths]] đang để riêng vào chơi.\n'
                        'Xáo trộn các encounter set <i>Descent into the Pitch</i> và <i>Agents of Atlach-Nacha</i> '
                        'đang để riêng vào chồng bài encounter, cùng với chồng bài bỏ.',
           'back_flavor': 'Cái hố ngày càng hẹp lại khi bạn tìm đường xuyên qua phía bên kia của bức tường đá. Khi '
                          'cuối cùng bạn chui ra, bạn thấy mình đang ở bờ của một đại dương khổng lồ chứa đầy nhựa '
                          'đường đen như hắc ín. Những mạng lưới năng lượng màu tím phát quang lan rộng trên bề mặt '
                          'của nó, khiến bạn dâng lên nỗi kinh hoàng bất an. Liệu điều này có liên quan đến những điều '
                          'kinh hoàng mà bạn đã chứng kiến trong Bệnh viện St. Mary không? Ngay khi bạn bắt đầu tự hỏi '
                          'phải làm gì tiếp theo, bạn phát hiện ra một vài chiếc thuyền chèo bằng gỗ đen neo đậu ở một '
                          'vịnh nhỏ gần đó. Thân của mỗi chiếc thuyền đều được khắc một phù hiệu kỳ lạ. Đây là may '
                          'mắn, hay định mệnh? Dù thế nào đi nữa, bạn cũng quyết tâm vượt biển và truy tìm nguồn gốc '
                          'của sự điên loạn này.'},
 '06253': {'name': 'Biển Nhựa Đường',
           'text': '<b>Forced</b> - Sau khi một kẻ địch có từ 1 manh mối trở lên trên đó bị đánh bại: Nắm quyền kiểm '
                   'soát từng manh mối đó.\n'
                   '<b>Objective</b> - Tìm nguồn gốc của sự biến dạng. <i>(Bạn sẽ được hướng dẫn khi nào cần '
                   'advance.)</i>',
           'flavor': 'Bạn đẩy thuyền ra ngoài mặt nước đen ngòm, hôi thối. Biển cả hoàn toàn tĩnh lặng, ngoại trừ '
                     'những gợn sóng phát ra từ mái chèo của bạn.',
           'back_name': 'Tiến Vào Vực Sâu',
           'back_text': '<b>(→R1)</b>',
           'back_flavor': 'Tia sáng kỳ lạ phát ra từ cấu trúc cổng đá cổ xưa bùng lên thành một chùm sáng chói mắt, '
                          'thiêu đốt võng mạc của bạn và khiến bạn phải nhắm chặt mắt lại. Không khí xung quanh bạn '
                          'bắt đầu rung chuyển và xoay chuyển, như thể bị hút vào một cơn lốc vô hình. Ngay khi bạn '
                          'chuẩn bị nhảy khỏi bục đá, một lực kéo dữ dội giật mạnh lấy bạn, nhấc bổng bạn lên khỏi mặt '
                          'đất và kéo bạn vào giữa cánh cổng.\n'
                          'Bạn trôi nổi giữa không gian vô tận, một khoảng không thăm thẳm không có đất liền hay bầu '
                          'trời. Trước mặt bạn là một mạng lưới những sợi tơ mỏng manh, phát quang vắt ngang khoảng hư '
                          'không vô biên. Từng sợi tơ đơn lẻ rung lên với năng lượng vũ trụ. Nhìn theo những sợi tơ '
                          'vào cõi vô định, bạn thấy chúng kết nối với nhau, tạo thành một chiếc cầu tơ khổng lồ bắc '
                          'qua khoảng cách vô tận giữa các thế giới.\n'
                          'Bạn đang ở ranh giới giữa hai thực tại... và người dệt nên cây cầu này đang ở ngay trước '
                          'mắt bạn.'},
 '06334': {'name': 'Đại Công Trình',
           'text': '*Agenda này nhận +2 [per_investigator] doom threshold.\n'
                   '<b>Forced</b> - Khi agenda này advance: Không loại bỏ doom khỏi các địa điểm trong màn chơi.',
           'flavor': 'Từng sợi một, từng sợi một, những con nhện dệt nên một mạng lưới rộng lớn, phức tạp bắc ngang '
                     'qua khoảng hư không thăm thẳm giữa các thế giới. Công việc của chúng diễn ra một cách tàn nhẫn, '
                     'lạnh lùng, có phương pháp và không bao giờ ngừng nghỉ.',
           'back_name': 'Từng Sợi Tơ',
           'back_text': 'Xáo trộn chồng bài encounter bỏ vào chồng bài encounter.',
           'back_flavor': 'Một làn sóng chấn động dữ dội bất ngờ xé toạc tấm mạng tơ vũ trụ, khiến những mảng đá trôi '
                          'nổi rung lắc dữ dội. Một vết rách lớn mở toang giữa các sợi tơ, để lộ một góc nhìn thoáng '
                          'qua về thế giới tỉnh thức: những tòa nhà chọc trời của thành phố Arkham, đang lấp lánh dưới '
                          'ánh đèn của màn đêm muộn. Nhưng hình ảnh đó nhanh chóng bị che khuất khi hàng trăm con nhện '
                          'lao vào để vá lại vết rạn nứt bằng những lớp tơ mới, dày đặc và kiên cố hơn bao giờ hết.'},
 '06335': {'name': 'Mạng Nhện Lan Rộng',
           'text': '*Agenda này nhận +2 [per_investigator] doom threshold.\n'
                   '<b>Forced</b> - Khi agenda này advance: Không loại bỏ doom khỏi các địa điểm trong màn chơi.',
           'flavor': 'Trong khoảng hư không giữa các thực tại này, không thể có hy vọng hay niềm vui. Chỉ có sự lao '
                     'dịch không ngừng của những con nhện đang thực hiện công trình vĩ đại của chúng, ngày càng tiến '
                     'gần hơn tới sự hoàn tất sau mỗi khoảnh khắc trôi qua.',
           'back_name': 'Của Các Vì Sao và Mạng Nhện',
           'back_text': 'Xáo trộn chồng bài encounter bỏ vào chồng bài encounter.',
           'back_flavor': 'Một ánh sáng lóe lên từ xa, phía bên kia những sợi tơ thanh mảnh vô hình: một vụ nổ cách xa '
                          'hàng ngàn năm ánh sáng. Ánh sáng rực rỡ gợn sóng khắp cây cầu mạng nhện. Những sợi tơ phản '
                          'chiếu ánh quang của một tinh vân vỡ vụn. Một ánh sáng rực rỡ thiêu đốt con ngươi của bạn. '
                          'Khi ánh sáng mờ dần, cây cầu lấp lánh năng lượng vũ trụ. Mọi chuyện sắp kết thúc rồi. Chẳng '
                          'bao lâu nữa cây cầu sẽ kết nối hai thế giới, và sẽ chẳng còn lại gì ngoài Atlach-Nacha và '
                          'đàn nhện của nó.'},
 '06336': {'name': 'Các Thực Tại Đan Xen',
           'text': '*Agenda này nhận +2 [per_investigator] doom threshold.',
           'flavor': 'Ở phía xa, cách xa vô số chân trời, những vì sao lấp lánh và bùng cháy với sức mạnh của vô số '
                     'thế giới khác. Những sợi tơ lấp lánh bao quanh bạn đập rộn rã cùng một thứ ánh sáng.',
           'back_name': 'Các Thế Giới Va Chạm',
           'back_text': '<b>(→R2)</b>',
           'back_flavor': 'Có một luồng không khí bất ngờ ùa tới và một âm thanh gãy răng rắc vang lên, như thể một '
                          'ngàn khúc xương cùng lúc khớp vào vị trí. Những mạng tơ xung quanh bạn đều nhấp nháy với '
                          'sức mạnh khôn lường, các luồng không khí chuyển dịch qua lại theo cùng một nhịp điệu đều '
                          'đặn. Ở tận cùng của khoảng hư không, ánh sáng mặt trời chiếu xuyên qua - một luồng sáng '
                          'theo đúng nghĩa đen ở cuối đường hầm chính là cõi giới của Atlach-Nacha. Bạn kinh hoàng '
                          'nhìn những con nhện đang tràn ngập nơi này lần lượt bò về phía ánh sáng.'},
 '06337': {'name': 'Hành Trình Băng Qua Cây Cầu',
           'text': 'Mỗi địa điểm được kết nối với từng địa điểm phía trên và phía dưới nó.\n'
                   '<b>Objective</b> - Nếu mỗi điều tra viên đều đang ở địa điểm thấp nhất, họ có thể cùng nhau chi '
                   'trả số lượng manh mối cần thiết, theo nhóm, để advance.',
           'flavor': 'Bạn nhận ra rằng giờ đây mình không còn ở Dreamlands hay thế giới tỉnh thức nữa, mà là ở một nơi '
                     'hoàn toàn khác: một khoảng hư không đen tối tăm tối nơi Kẻ Dệt Lưới Vũ Trụ Weaver of the Cosmos '
                     'cư ngụ. Không chỉ thế giới của bạn đang bị đe dọa, mà cả Dreamlands cũng vậy.',
           'back_name': 'Ranh Giới Của Giấc Mơ',
           'back_text': 'Đọc <b>Scenario Interlude: The Spider Queen</b> trong Campaign Guide. Sau đó, advance sang '
                        'Act 2a - "The Weaver of the Cosmos."',
           'back_flavor': ''},
 '06338': {'name': 'Kẻ Dệt Lưới Vũ Trụ',
           'text': '[action] Chi trả 1 manh mối: Gây 3 damage cho một kẻ địch [[Ancient One]] tại địa điểm của bạn.\n'
                   '<b>Forced</b> - Khi giai đoạn mythos bắt đầu: Rút ngẫu nhiên một token từ túi chaos. Nếu chỉ số '
                   'modifier của nó là âm, xoay Atlach-Nacha theo chiều kim đồng hồ X lần. X là chỉ số âm của token '
                   'đó.\n'
                   '<b>Objective</b> - Nếu 4 Legs of Atlach-Nacha nằm trong khu vực trưng bày thành tích, advance.',
           'flavor': 'Atlach-Nacha đang bị xao nhãng bởi công việc vô tri của nó. Bây giờ là cơ hội của bạn!',
           'back_name': 'Cơn Thịnh Nộ Của Nữ Hoàng',
           'back_text': 'Lật mặt lá bài trung tâm của Atlach-Nacha lại, sang mặt kẻ địch của nó. Đặt nó tại địa điểm '
                        'có nhiều doom nhất.',
           'back_flavor': 'Sau khi chặt đứt những chiếc chân của con nhện gớm ghiếc và tháo dỡ các mạng tơ mà nó đứng '
                          'lên, bạn hy vọng rằng điều này sẽ khiến sinh vật đó rơi thẳng vào khoảng hư không vô tận '
                          'bên dưới. Nhưng khi nó rơi xuống, nhiều chiếc chân mảnh khảnh, lởm chởm gai nhọn hơn mọc ra '
                          'từ dưới bụng nó, và nó bám chặt vào một mỏm đá gần đó, vừa kịp giữ mình lại. Cái miệng gớm '
                          'ghiếc trải dài hết chiều dài của chiếc đầu giống như loài sâu của nó ngoác rộng ra. Từ đó '
                          'phát ra một tiếng rít như một ngàn chiếc móng tay cào trên bảng đen.'},
 '06339': {'name': 'Âm Mưu Sụp Đổ',
           'text': '[action] Chi trả 1 manh mối: Gây 3 damage cho một kẻ địch [[Ancient One]] tại địa điểm của bạn.\n'
                   '<b>Forced</b> - Khi giai đoạn mythos bắt đầu: Rút ngẫu nhiên một token từ túi chaos. Nếu chỉ số '
                   'modifier của nó là âm, di chuyển Atlach-Nacha theo chiều kim đồng hồ X lần. X là chỉ số âm của '
                   'token đó.\n'
                   '<b>Objective</b> - Nếu Atlach-Nacha bị đánh bại, advance.',
           'flavor': 'Bạn là tuyến phòng thủ cuối cùng chống lại những sinh vật đang âm mưu nuốt chửng thế giới của '
                     'bạn.',
           'back_name': 'Rơi Xuống Vực',
           'back_text': '<b>(→R1)</b>',
           'back_flavor': 'Sinh vật này quằn quại dữ dội khi mạng lưới tơ của nó bị xé toạc. Ánh sáng lấp lánh biến '
                          'mất khỏi các sợi tơ của cây cầu. Ở đằng xa, chuỗi ánh sáng vũ trụ vụt tắt, từng ngôi sao '
                          'một biến mất. Tiếng rít đau đớn của con nhện làm đinh tai nhức óc. Bạn không chắc liệu có '
                          'thể giết được một sinh vật như thế này hay không, nhưng bạn đã gây tổn hại cho nó nhiều hơn '
                          'khi phá hủy công trình cả đời của nó so với những gì bạn có thể làm bằng đạn và lưỡi dao.\n'
                          'Khi những sợi tơ nhện dệt nên bị bung ra, nhiều mỏm đá lơ lửng của cõi giới này vỡ vụn và '
                          'sụp đổ vào cõi hư không vô tận bên dưới. Bạn cố gắng tìm thứ gì đó để đứng lên hoặc bám '
                          'lấy. Không có sự chống đỡ của cây cầu mạng nhện, toàn bộ chiều không gian sụp đổ xung quanh '
                          'bạn.\n'
                          'Với một tiếng rít tuyệt vọng cuối cùng vang vọng khắp thế giới giữa các thế giới này, '
                          'Atlach-Nacha lao thẳng vào bóng tối vĩnh hằng bên dưới. Bạn nhanh chóng rơi theo sau nó.'}}
