"""Translations for The Feast of Hemlock Vale (FHV) act and agenda cards."""
from typing import Dict, Any

TRANSLATIONS_FHV_ACTS_AGENDAS: Dict[str, Dict[str, Any]] = {'10528': {'name': 'Những Bức Tường Sống',
           'text': '<b>Forced</b> - Khi giai đoạn mythos kết thúc: Thực hiện một kiểm tra săn mồi (predation test).\n'
                   '[fast] Hoặc đặt 1 [per_investigator] manh mối của bạn lên địa điểm của bạn hoặc loại bỏ một ấn '
                   'phong khỏi nó: Ready nó và lật mặt nó lại.',
           'flavor': 'Hoặc ngôi nhà này còn sống, hoặc sinh vật bên trong những bức tường của nó đã phát triển bao '
                     'trùm toàn bộ nơi này. Hy vọng duy nhất của bạn lúc này là bảo đảm an toàn cho tất cả các căn '
                     'phòng, biến nơi này thành đống gạch vụn, hoặc bỏ chạy và đảm bảo không ai mạo hiểm đến gần nơi '
                     'này thêm một lần nào nữa.',
           'back_name': 'Những Bức Tường Khép Lại...',
           'back_text': 'Mỗi điều tra viên còn sống sót chưa resign bị đánh bại và chịu 1 tổn thương tinh thần.',
           'back_flavor': 'Gỗ nứt toác và vỡ vụn khi những bức tường ép sát xung quanh bạn. Đồ đạc đổ nhào, dọn đường '
                          'cho nhiều xúc tu trườn bò hơn của sinh vật. Chúng quấn lấy tay chân bạn và ghim bạn xuống '
                          'sàn khi trần nhà hạ xuống, vặn vẹo và méo mó. Đó là một cơ quan đang đập phập phồng, một '
                          'chiếc dạ dày đang ngấu nghiến bữa ăn của nó. Gỗ, keo trám và vữa bao bọc lấy bạn khi những '
                          'tiếng ầm ầm của ngôi nhà tan biến thành tiếng nghiến ngấu nghẹt thở.\n'
                          'Các giác quan của bạn tràn ngập một luồng adrenaline dữ dội, và bạn vùng thoát khỏi sự kẹp '
                          'chặt của sinh vật đó. Đầu óc đau như búa bổ, bạn lao ra khỏi ngôi nhà khi những cánh cửa '
                          'của nó đập mở rồi đóng sầm lại như những cái miệng đói khát.'},
 '10503': {'name': 'Khảo Sát Lòng Đất',
           'text': '<b>Forced</b> - Khi agenda này advance: Chuyển toàn bộ doom trên nó sang agenda tiếp theo.\n'
                   '[action] Rút lá bài trên cùng của chồng bài encounter: Chuyển 1 tài nguyên từ địa điểm của bạn '
                   'sang lá bài tham chiếu scenario, dưới dạng phế liệu (scrap). Nếu lá bài encounter vừa rút là một '
                   'treachery [[Power]], nhận 5 tài nguyên.',
           'flavor': 'Mỏ cũ đầy những máy móc đổ nát và một đường ray cũ kỹ. Những bí mật nào được khắc ghi trong đá '
                     'bên dưới?',
           'back_name': 'Sập Hầm',
           'back_text': 'Gây 2 damage cho mỗi điều tra viên và 1 direct damage cho mỗi asset [[Ally]] họ kiểm soát.\n'
                        'Lật mở địa điểm Control Station và di chuyển mỗi điều tra viên còn sống sót đến đó.\n'
                        'Mỗi điều tra viên mất toàn bộ manh mối của họ.\n'
                        'Advance act.',
           'back_flavor': 'Một thanh xà gỗ oằn mình với một tiếng răng rắc sắc nhọn, giáng thẳng xuống đầu bạn. Lực va '
                          'chạm của cú đánh gần như hạ gục bạn. Thêm nhiều chấn động làm rung chuyển hang động từ sâu '
                          'hơn bên trong mỏ.'},
 '10504': {'name': 'Chuyến Đi Nguy Hiểm',
           'text': 'Các địa điểm có story asset trên đó không thể bị trượt hoặc tráo đổi.\n'
                   'Mỗi kẻ địch nhận keyword hunter và giải quyết keyword hunter của nó thêm một lần nữa trong giai '
                   'đoạn kẻ địch.\n'
                   'Khi một kẻ địch di chuyển, mỗi địa điểm liền kề được coi là kết nối với địa điểm của nó.',
           'flavor': 'Giờ thì bạn đã biết tại sao North Point Mine bị bỏ hoang. Những nỗi kinh hoàng quằn quại và '
                     'những người thợ mỏ cuồng loạn lảng vảng trong các đường hầm, đói khát bữa ăn tiếp theo của '
                     'chúng.',
           'back_name': 'Sụp Đổ Hoàn Toàn',
           'back_text': 'Mỗi điều tra viên còn sống sót bị đánh bại và chịu 1 tổn thương thể chất hoặc 1 tổn thương '
                        'tinh thần.',
           'back_flavor': 'Đường hầm sụp đổ phía sau xe goòng để lộ ra một hang động chứa đầy những tinh thể màu tím '
                          'phát quang. Chiếc xe tông vào một tảng đá hất văng bạn lao đầu vào bóng tối. Khi thêm nhiều '
                          'chấn động làm rung chuyển đường hầm, bạn cuống cuồng chạy để vượt lên trước vụ sập hầm, '
                          'kinh hãi trước những gì có thể xảy ra nếu bạn bị mắc kẹt tại đây. Khi bạn chạy nước rút qua '
                          'một cái xác thối rữa, há hốc mồm, bạn gần như buồn nôn vì mùi hôi thối, rồi vấp phải một '
                          'tảng đá rơi và đập đầu.\n'
                          'Bạn tỉnh dậy nhiều giờ sau đó, đầu đau như búa bổ, và bàng hoàng tự hỏi trong cơn mê muội '
                          'cho đến khi bạn ngửi thấy mùi không khí trong lành và lần theo nó ra khỏi mỏ.'},
 '10505': {'name': 'Hạ Xuống Khu Mỏ',
           'text': '<b>Objective</b> - Vào cuối vòng chơi, nếu mỗi điều tra viên còn sống sót đều đang ở Control '
                   'Station, advance. <i>(Gợi ý: Hãy đến Control Station trước khi agenda advance!)</i>',
           'flavor': 'Bạn nhận ra tiếng vo ve kỳ lạ trong không khí phát ra từ các khối tinh thể đang rung động. Có '
                     'điều gì đó kỳ lạ, mặc dù bạn không thể nói rõ là gì...',
           'back_name': 'Không Có Đường Quay Lại',
           'back_text': 'Loại bỏ mỗi địa điểm [[Cave]] khỏi trò chơi <i>(bỏ toàn bộ kẻ địch, token, và lá bài gắn kèm '
                        'tại những địa điểm đó)</i>. Nếu River Hawthorne đang ở trong màn chơi nhưng không thuộc quyền '
                        'kiểm soát của bất kỳ điều tra viên nào, loại bỏ họ khỏi trò chơi.\n'
                        'Mỗi điều tra viên mất toàn bộ manh mối ngoại trừ 2 manh mối của họ.\n'
                        'Nếu đang là agenda 1a, advance agenda trực tiếp sang agenda 2a <i>(không giải quyết agenda '
                        '1b)</i>.\n'
                        'Cuộc tìm kiếm vật tư của bạn sẽ giúp bạn định hướng bất cứ thứ gì phía trước. Lật lá bài tham '
                        'chiếu scenario sang mặt kia của nó, chuyển toàn bộ phế liệu (scrap) trên đó sang mặt đó, dưới '
                        'dạng công tắc (switch).\n'
                        'Đọc <b>Scenario interlude: The Cave-In</b> <i>(trang 10)</i>.',
           'back_flavor': 'Một tảng đá lớn rơi từ trần hang xuống, suýt chút nữa trúng bạn. Nhiều tảng đá khác rơi ra, '
                          'buộc bạn phải tiến sâu hơn.'},
 '10506': {'name': 'Mê Cung Lòng Đất',
           'text': '[fast] Trong lượt của bạn, chi trả 1 [per_investigator] manh mối, theo nhóm: Hoặc trượt một địa '
                   'điểm vào một ô trống liền kề, hoặc tráo đổi 2 địa điểm liền kề.\n'
                   '[action] Chi trả 1 [per_investigator] tài nguyên: Trượt một địa điểm đã lật mở vào một ô trống '
                   'liền kề. (Giới hạn cả nhóm một lần mỗi vòng.)\n'
                   '[action] Nếu story asset Prismatic Shard đang ở địa điểm của bạn: Nắm quyền kiểm soát nó.\n'
                   '<b>Objective</b> - Hãy đến Rail Exit! Khi Mine Cart tiến vào Rail Exit, ngay lập tức advance.',
           'flavor': 'Lối thoát duy nhất ra khỏi North Point Mine là qua mê cung của các đường hầm đường ray.',
           'back_name': 'Cuối Cùng Cũng An Toàn',
           'back_text': 'Kiểm tra phần sau:\n'
                        '- Nếu một điều tra viên kiểm soát Simeon Atwood, <b>(→R1)</b>.\n'
                        '- Nếu một điều tra viên kiểm soát Leah Atwood, <b>(→R2)</b>.\n'
                        '- Nếu Simeon Atwood đang để riêng hoặc vẫn ở trong màn chơi và không thuộc quyền kiểm soát '
                        'của điều tra viên, <b>(→R3)</b>.\n'
                        '- Nếu Leah Atwood đang để riêng hoặc vẫn ở trong màn chơi và không thuộc quyền kiểm soát của '
                        'điều tra viên, <b>(→R4)</b>.\n'
                        '- Nếu không có điều nào ở trên là đúng, <b>(→R5)</b>.',
           'back_flavor': 'Tia lửa bắn tung tóe khỏi đường ray khi bạn đạp phanh xe goòng cho đến khi dừng hẳn.'},
 '10525': {'name': 'Sự Tĩnh Lặng Rợn Người',
           'text': '',
           'flavor': 'Những bước chân đầu tiên của bạn vào trang viên cũ đi kèm với mùi hôi thối và cảm giác mãnh liệt '
                     'bị theo dõi. Không khí quá đỗi tĩnh lặng, và đối với một ngôi nhà bỏ hoang, lại có một sự thiếu '
                     'vắng bụi bặm đáng lo ngại trên đồ đạc và sàn nhà. Nếu không có ai sống ở đây trong nhiều năm, '
                     'tại sao cảm giác như mọi thứ vừa mới di chuyển gần đây?',
           'back_name': 'Ngôi Nhà Sống',
           'back_text': 'Xáo trộn mỗi bản sao của các treachery Out of the Walls và Pulled In đang để riêng vào chồng '
                        'bài encounter, cùng với chồng bài encounter bỏ.\n'
                        'Tìm địa điểm [[Dormant]] chưa phong ấn gần với nhiều điều tra viên nhất. Lật mặt địa điểm đó '
                        'sang mặt kẻ địch-địa điểm của nó.\n'
                        'Tìm lá bài story The Predatory House đang để riêng và giải quyết nội dung của nó.',
           'back_flavor': 'Trước âm thanh của tiếng gỗ cọt kẹt, bạn xoay người đối mặt với hành lang nơi bạn vừa đi '
                          'qua. Mọi thứ trông vẫn như cũ, nhưng bạn không thể rũ bỏ được cảm giác rằng mọi thứ đã khác '
                          'đi một cách tinh vi. Thở phào nhẹ nhõm, bạn tiếp tục cuộc điều tra, chỉ để thấy đồ đạc '
                          'trong phòng bạn đang tự ổn định vào vị trí, giống như những đứa trẻ đang chơi trò chơi ghế '
                          'âm nhạc. Một xúc tu nhớp nháp rút lui giữa một khe hở trên gỗ.\n'
                          'Những lời đồn đại liên quan đến Hemlock House chỉ đúng một nửa. Có thứ gì đó đang sống bên '
                          'trong những bức tường của nó. Nhưng đó là một thứ tồi tệ hơn nhiều so với những gì bạn có '
                          'thể tưởng tượng.'},
 '10526': {'name': 'Ngôi Nhà Cựa Mình (bản I)',
           'text': '<b>Forced</b> - Khi giai đoạn mythos kết thúc: Thực hiện một kiểm tra săn mồi (predation test).\n'
                   '[fast] Hoặc đặt 1 [per_investigator] manh mối của bạn lên địa điểm của bạn hoặc loại bỏ một ấn '
                   'phong khỏi nó: Ready nó và lật mặt nó lại.',
           'flavor': 'Đó không chỉ đơn thuần là sự phá hoại của lũ chuột hay các sinh vật rừng ám ảnh trang viên đổ '
                     'nát này. Có thứ gì đó ghê tởm sống trong Hemlock House. Nó đào bới xuyên qua sàn nhà, quằn quại '
                     'bên trong những bức tường, và quan sát bạn bằng những con mắt đói khát vô hình.',
           'back_name': 'Nó Còn Sống!',
           'back_text': 'Xáo trộn chồng bài encounter bỏ vào chồng bài encounter. Tìm địa điểm [[Dormant]] chưa phong '
                        'ấn gần với nhiều điều tra viên nhất. Lật mặt địa điểm đó sang mặt kẻ địch-địa điểm của nó.',
           'back_flavor': 'Ngôi nhà rên rỉ và cọt kẹt, như thể nó vẫn đang lún xuống. Sự chuyển động khuấy động ở khóe '
                          'mắt bạn: chính sàn nhà gợn sóng như nước khi có thứ gì đó chuyển động bên dưới những tấm '
                          'ván cũ cọt kẹt.'},
 '10527': {'name': 'Ngôi Nhà Cựa Mình (bản II)',
           'text': '<b>Forced</b> - Khi giai đoạn mythos kết thúc: Thực hiện một kiểm tra săn mồi (predation test).\n'
                   '[fast] Hoặc đặt 1 [per_investigator] manh mối của bạn lên địa điểm của bạn hoặc loại bỏ một ấn '
                   'phong khỏi nó: Ready nó và lật mặt nó lại.',
           'flavor': 'Đó không chỉ đơn thuần là sự phá hoại của lũ chuột hay các sinh vật rừng ám ảnh trang viên đổ '
                     'nát này. Có thứ gì đó ghê tởm sống trong Hemlock House. Nó đào bới xuyên qua sàn nhà, quằn quại '
                     'bên trong những bức tường, và quan sát bạn bằng những con mắt đói khát vô hình.',
           'back_name': 'Tối Tăm và Giông Bão',
           'back_text': 'Tìm địa điểm [[Dormant]] chưa phong ấn gần với nhiều điều tra viên nhất. Lật mặt địa điểm đó '
                        'sang mặt kẻ địch-địa điểm của nó.\n'
                        'Gắn một treachery Fire! đang để riêng vào địa điểm ngoài cùng bên trái ở tầng cao nhất. Xáo '
                        'trộn mỗi bản sao khác của Fire! vào chồng bài encounter, cùng với chồng bài encounter bỏ.',
           'back_flavor': 'Cơn mưa xối xả đập liên hồi lên mái nhà. Bầu trời bên ngoài bị bao phủ bởi những đám mây '
                          'đen, chỉ được chiếu sáng bởi những tia chớp ngắn ngủi ở phía xa. Da bạn nổi gai ốc khi '
                          'những tiếng rên rỉ và cọt kẹt bị át đi bởi tiếng sấm gầm và cơn mưa rào trút nước vào cửa '
                          'sổ. Ngay lúc đó, ánh sáng rực rỡ tràn ngập căn phòng, và một tiếng nổ vang rền vọng lại từ '
                          'tầng trên cùng của ngôi nhà. Mùi gỗ cháy bay thoang thoảng xuống các hành lang. Sét đã đánh '
                          'trúng ngôi nhà!'},
 '10529': {'name': 'Dịch Hại Kỳ Lạ',
           'text': 'Không thể khám phá manh mối từ các địa điểm không có điều tra viên.\n'
                   '[action] Nếu địa điểm của bạn chưa phong ấn và là [[Dormant]], các điều tra viên tại địa điểm đó '
                   'chi trả 1 [per_investigator] manh mối, theo nhóm: Đặt 1 tài nguyên lên đó, dưới dạng một ấn phong '
                   '(seal).\n'
                   '<b>Objective</b> - Vào cuối vòng chơi, nếu có tổng cộng 7 địa điểm được phong ấn và/hoặc trong khu '
                   'vực trưng bày thành tích, advance.',
           'flavor': '',
           'back_name': 'Những Bức Tường Bằng Thịt',
           'back_text': '<b>Nếu có nhiều ấn phong trong màn chơi hơn kẻ địch-địa điểm trong khu vực trưng bày thành '
                        'tích:</b>\n'
                        '<blockquote><i>Những nỗ lực của bạn để dập tắt dịch hại kỳ lạ dường như đã chọc giận nó. Một '
                        'tiếng rít khó chịu làm rung chuyển nền móng ngôi nhà, và không khí tràn ngập mùi hôi thối ghê '
                        'tởm của một thứ khủng khiếp bên dưới.</i></blockquote>\n'
                        'Đưa kẻ địch-địa điểm Shapeless Cellar đang để riêng vào chơi tại Cellar Floor, càng gần cột ở '
                        'giữa càng tốt.\n'
                        'Advance sang act 2a đang để riêng "The Heart of the House" và loại bỏ act 2a "Against the '
                        'House" khỏi trò chơi.\n'
                        '<hr>\n'
                        '<b>Nếu có nhiều kẻ địch-địa điểm trong khu vực trưng bày thành tích hơn ấn phong trong màn '
                        'chơi:</b>\n'
                        '<blockquote><i>Nền móng ngôi nhà rung chuyển khi một căn phòng khác đe dọa sụp đổ. Nếu bạn '
                        'phá sập ngôi nhà này, quái vật sống bên trong nó sẽ không tồn tại được lâu.</i></blockquote>\n'
                        'Advance sang act 2a đang để riêng "Against the House" và loại bỏ act 2a "The Heart of the '
                        'House" khỏi trò chơi.',
           'back_flavor': ''},
 '10530': {'name': 'Chống Lại Ngôi Nhà',
           'text': 'Không thể khám phá manh mối từ các địa điểm không có điều tra viên.\n'
                   '<b>Objective</b> - Phá sập ngôi nhà này! Nếu không có địa điểm nào trong màn chơi, ngay lập tức '
                   'advance <i>(điều này xảy ra trước khi các điều tra viên bị đánh bại do không ở tại một địa '
                   'điểm)</i>.',
           'flavor': 'Phong ấn sinh vật này lại sẽ không giải quyết được vấn đề gì. Bất kể loại quái vật nào đã chiếm '
                     'lấy Hemlock House, nó cần phải bị tiêu diệt.',
           'back_name': 'Sự Sụp Đổ Của Gia Tộc Hemlock',
           'back_text': '<b>(→R1)</b> <i>(trang 18)</i>.',
           'back_flavor': 'Bạn thoát ra vừa kịp lúc khi tàn tích cuối cùng của Hemlock House sụp đổ thành đống gạch '
                          'vụn và hoang tàn. Qua làn khói bụi đất cát mù mịt, bạn nhìn thấy những xúc tu còn lại của '
                          'sinh vật trườn vào nền móng của nó và rút lui xuống lòng đất. Dù nó là gì đi nữa, giờ nó đã '
                          'biến mất.'},
 '10531': {'name': 'Trái Tim Của Ngôi Nhà',
           'text': 'Không thể khám phá manh mối từ các địa điểm không có điều tra viên.\n'
                   '[action] Nếu địa điểm của bạn chưa phong ấn và là [[Dormant]], các điều tra viên tại địa điểm đó '
                   'chi trả 1 [per_investigator] manh mối, theo nhóm: Đặt 1 tài nguyên lên đó, dưới dạng một ấn phong '
                   '(seal).\n'
                   '<b>Forced</b> - Sau khi một kẻ địch-địa điểm tấn công bạn: Di chuyển (từng địa điểm một) đến '
                   'Shapeless Cellar.\n'
                   '<b>Objective</b> - Khi Shapeless Cellar nằm trong khu vực trưng bày thành tích, advance.',
           'flavor': 'Nếu bạn muốn phong ấn ngôi nhà vĩnh viễn, bạn phải đào sâu vào hầm mộ ghê tởm bên dưới.',
           'back_name': 'Yên Nghỉ',
           'back_text': 'Lật mỗi kẻ địch-địa điểm sang mặt địa điểm của nó. Đặt 1 tài nguyên, dưới dạng một ấn phong, '
                        'lên mỗi địa điểm [[Dormant]] chưa phong ấn.\n'
                        '<b>(→R1)</b> <i>(trang 18)</i>.',
           'back_flavor': 'Ngôi nhà rùng mình, rồi đứng yên. Việc phong ấn các khe nứt và ngóc ngách nơi sinh vật đang '
                          'chọc thủng qua các bức tường dường như đã buộc nó phải rút lui, hoặc có lẽ nằm ngủ yên một '
                          'thời gian. Hy vọng nó sẽ không trỗi dậy trở lại, nhưng trong thời gian chờ đợi, di sản của '
                          'gia đình Hemlock vẫn đứng vững. Có lẽ theo thời gian, họ có thể tìm ra cách để tiêu diệt '
                          'sinh vật này vĩnh viễn.'},
 '10550': {'name': 'Sự Tĩnh Lặng Đáng Lo Ngại',
           'text': '<b>Forced</b> - Khi doom được đặt lên agenda này, nếu kẻ địch Brood Queen đang để riêng: Rút các '
                   'token từ túi chaos bằng số lượng kẻ địch [[Insect]] trong khu vực trưng bày thành tích. Nếu một '
                   'token [skull] hoặc [auto_fail] được rút, spawn kẻ địch Brood Queen đang để riêng.',
           'flavor': 'Vùng đất khô cằn hoàn toàn tĩnh lặng. Một ánh hào quang quyến rũ bao trùm lên mọi thứ.',
           'back_name': 'Những Sinh Vật Kỳ Lạ',
           'back_text': 'Bỏ các lá bài từ trên cùng của chồng bài encounter cho đến khi một kẻ địch [[Insect]] bị bỏ. '
                        'Điều tra viên dẫn đầu rút kẻ địch đó.\n'
                        'Xáo trộn chồng bài encounter bỏ vào chồng bài encounter.',
           'back_flavor': 'Mùi hôi nồng nặc bốc lên từ một nơi nào đó sâu bên dưới. Tiếng lách cách của hàng trăm '
                          'chiếc chân tràn ngập không khí trước khi một con côn trùng quái dị chui lên từ lòng đất. Nó '
                          'có làn da nhợt nhạt, mờ đục và một đôi cánh đen teo tóp rủ xuống lưng. Sinh vật này nhìn '
                          'chằm chằm vào bạn bằng đôi mắt vô hồn như hạt cườm, vẫy đôi râu để loan báo sự hiện diện '
                          'của bạn.'},
 '10551': {'name': 'Hoang Tàn (bản I)',
           'text': 'Mỗi kẻ địch [[Insect]] mất aloof.\n'
                   '<b>Forced</b> - Khi doom được đặt lên agenda này, nếu kẻ địch Brood Queen đang để riêng: Rút các '
                   'token từ túi chaos bằng số lượng kẻ địch [[Insect]] trong khu vực trưng bày thành tích. Nếu một '
                   'token có biểu tượng được rút, spawn kẻ địch Brood Queen đang để riêng.',
           'flavor': 'Lũ côn trùng chạy tán loạn tới lui, hoảng sợ trước sự hiện diện của bạn.',
           'back_name': 'Bị Bủa Vây!',
           'back_text': 'Mỗi điều tra viên chưa bị loại khỏi màn chơi bị đánh bại và chịu 1 tổn thương thể chất.',
           'back_flavor': 'Một đàn côn trùng lính lao xuống tấn công bạn, chặn đứng mọi lối thoát. Một trong số chúng '
                          'cắm vòi hút vào thân bạn với hiệu suất gần như cơ học. Bạn cảm thấy đau đớn, sau đó tê '
                          'liệt, rồi chẳng còn gì khi ngất lịm đi.\n'
                          'Bạn tỉnh lại nhiều giờ sau đó, phủ đầy muối, trong một hang động khô ráo. Đầu óc đau nhức, '
                          'bạn lảo đảo bước ra khỏi hang vào vùng đất hoang khô cằn. Vết thương bên sườn bạn rỉ ra '
                          'chất độc màu xanh lam nhờn dính, nhưng nó dường như không gây chết người...'},
 '10552': {'name': 'Hoang Tàn (bản II)',
           'text': 'Mỗi kẻ địch [[Insect]] mất aloof và patrol và nhận hunter.\n'
                   '<b>Forced</b> - Khi doom được đặt lên agenda này, nếu kẻ địch Brood Queen đang để riêng: Rút các '
                   'token từ túi chaos bằng số lượng kẻ địch [[Insect]] trong khu vực trưng bày thành tích. Nếu một '
                   'token có biểu tượng được rút, spawn kẻ địch Brood Queen đang để riêng.',
           'flavor': 'Lũ côn trùng chạy tán loạn tới lui, hoảng sợ trước sự hiện diện của bạn.',
           'back_name': 'Bị Bủa Vây!',
           'back_text': 'Mỗi điều tra viên còn sống sót chưa bị loại khỏi màn chơi bị đánh bại và chịu 1 tổn thương '
                        'thể chất.',
           'back_flavor': 'Một đàn côn trùng lao xuống bạn, chặn đứng mọi lối thoát. Một con lao tới với độ chính xác '
                          'gần như cơ học, cắm vòi hút vào cơ thể bạn. Cơn đau nhói co thắt khắp người bạn, theo sau '
                          'là cảm giác tê dại. Con côn trùng màu trắng sữa rút chiếc vòi đen đang nhỏ giọt chất lỏng '
                          'màu xanh lam ra khi tầm nhìn của bạn bắt đầu quay cuồng. Ngất đi quả là một sự giải thoát '
                          'nhân từ.\n'
                          'Bạn tỉnh lại nhiều giờ sau đó, phủ đầy muối, trong một căn phòng khô ráo dưới lòng đất. Đầu '
                          'đau như búa bổ, bạn lảo đảo bước ra khỏi hang vào vùng đất hoang khô cằn. Vết thương bên '
                          'hông bạn rỉ ra chất độc màu xanh nhạt, nhưng dường như không nguy hiểm đến tính mạng...'},
 '10553': {'name': 'Một Di Sản Đã Mất',
           'text': '<b>Objective</b> - Khi vòng chơi kết thúc, các điều tra viên tại Pearl Estate Ruins có thể cùng '
                   'nhau chi trả số lượng manh mối cần thiết, theo nhóm, để advance.',
           'flavor': 'Di sản của Pearl Ridge là một câu chuyện đáng chú ý giữa những người dân địa phương. Nhà Pearl '
                     'là một gia đình nổi bật giống như nhà Hemlock và Atwood, nhưng gia đình này đã biến mất trong '
                     'một sự cố kỳ lạ vào năm 1906. Chuyện gì có thể đã xảy ra ở đây?',
           'back_name': '"The Warrens"',
           'back_text': 'Đưa ngẫu nhiên ba địa điểm đang để riêng từ encounter set <i>Horrors in the Rock</i> vào '
                        'chơi, chưa lật mở, liền kề với ba địa điểm xuất phát như giải thích ở trang 20 của Campaign '
                        'Guide.\n'
                        'Lấy các địa điểm đang để riêng còn lại (Salt Chamber, Larval Tunnel, và Crystal Nursery) cùng '
                        'với 3 lá bài trên cùng của chồng bài encounter. Xáo trộn chúng lại với nhau và chia ngẫu '
                        'nhiên 1 lá bài úp bên dưới mỗi địa điểm.',
           'back_flavor': 'Giữa những tàn tích của Pearl Estate, bạn tìm thấy cuốn nhật ký của Susan Pearl. Cuốn nhật '
                          'ký ghi lại chi tiết các nỗ lực khám phá các đường hầm bên dưới sườn núi. Chúng được gọi là '
                          '"The Warrens" do cấu trúc giống như mê cung của chúng. Có lẽ một số thành viên của gia đình '
                          'Pearl đã biến mất trong các đường hầm xung quanh, nhưng tại sao? Bạn quyết định điều tra.'},
 '10554': {'name': 'Tìm Kiếm Vùng Đất Hoang',
           'text': '[action] Nếu không có manh mối nào trên địa điểm của bạn: Rút lá bài trên cùng bên dưới địa điểm '
                   'của bạn.\n'
                   '[fast] Các điều tra viên tại địa điểm của bạn chi trả 1 [per_investigator] manh mối, theo nhóm: '
                   'Nhìn lá bài trên cùng bên dưới địa điểm của bạn. Bạn có thể đặt lá bài đó xuống dưới cùng của '
                   'chồng bài của nó.\n'
                   '<b>Objective</b> - Nếu mỗi điều tra viên chưa bị đánh bại đã resign và có từ 1 Crystal Remains trở '
                   'lên trong khu vực trưng bày thành tích, advance.',
           'flavor': 'The Warrens có khả năng là nơi an nghỉ cuối cùng của gia đình Pearl. Nghiên cứu hài cốt của họ '
                     'có thể làm sáng tỏ những gì thực sự đã xảy ra ở đây.',
           'back_name': 'Yên Nghỉ',
           'back_text': 'Kiểm tra số lượng Crystal Remains trong khu vực trưng bày thành tích.\n'
                        '- Nếu có chính xác 3 Crystal Remains, <b>(→R1)</b> <i>(trang 22)</i>.\n'
                        '- Nếu không, <b>(→R2)</b> <i>(trang 22)</i>.',
           'back_flavor': 'Mùi phân hủy và pheromone của những sinh vật kỳ lạ hòa quyện tạo thành một mùi xạ hương tồi '
                          'tệ độc nhất vô nhị. Bước ra khỏi hang động, bạn đặt thành viên cuối cùng của nơi mà bạn cho '
                          'là gia đình Pearl xuống. Dư lượng axit từ những khối tinh thể kỳ lạ của họ đốt cháy làn da '
                          'bạn. Những thi thể thật đau đớn khi nhìn vào, khuôn mặt họ đông cứng trong nỗi thống khổ '
                          'thầm lặng. Một sự hiện diện vô hình, nặng nề bao trùm không khí phía trên những xác chết, '
                          'mặc dù không có chuyển động, không có gió hay bụi. Chỉ là một sự chuyển động của thứ gì đó '
                          'trong không khí. Bạn cảm thấy một sự mệt mỏi sâu sắc, đau nhức đến tận xương tủy.'},
 '10570': {'name': 'Vào Các Hang Động',
           'text': 'Các lá bài tại địa điểm [[Dark]] sử dụng hiệu ứng <b>(Đêm [night])</b>. Các lá bài tại tất cả các '
                   'địa điểm khác sử dụng hiệu ứng <b>(Ngày [day])</b>.',
           'flavor': 'Sóng vỗ vào bờ, đe dọa xóa sạch những dấu chân dẫn vào các hang động ven biển. Bạn thoáng thấy '
                     'ánh sáng xanh mờ ảo sâu bên trong các đường hầm.',
           'back_name': 'Bị Săn Đuổi',
           'back_text': 'Spawn một trong những kẻ địch Crustacean Hybrid đang để riêng tại địa điểm [[Coastal]] gần '
                        'với nhiều điều tra viên nhất, mặt <i>(In the Light)</i> ngửa.\n'
                        'Mỗi điều tra viên tại một địa điểm [[Dark]] phải bỏ 1 lá bài ngẫu nhiên từ tay họ.\n'
                        'Đặt doom lên agenda 2a bằng số ngày hiện tại.',
           'back_flavor': 'Tiếng vo ve, lách cách vang vọng từ các bức tường đường hầm. Một sinh vật lớn giống cua nhô '
                          'lên từ một hồ thủy triều gần đó, râu đung đưa trong không khí như thể đang tìm kiếm bạn. '
                          'Thứ này di chuyển nhanh đến kinh ngạc trên hàng chục chiếc chân, và mai của nó phủ đầy '
                          'những con hà sắc nhọn cùng những sợi tảo bẹ và rong biển thối rữa. Bất kể nó là gì, nó phát '
                          'ra mùi hôi thối kinh khủng nhất mà bạn từng ngửi thấy.'},
 '10571': {'name': 'Bóng Tối Khép Lại',
           'text': 'Các lá bài tại địa điểm [[Dark]] sử dụng hiệu ứng <b>(Đêm [night])</b>. Các lá bài tại tất cả các '
                   'địa điểm khác sử dụng hiệu ứng <b>(Ngày [day])</b>.',
           'flavor': 'Các bức tường hang động sống động với những mảng nấm đang cựa mình, dịch chuyển. Và chúng dường '
                     'như đang theo dõi bạn.',
           'back_name': 'Bao Phủ Trong Rêu',
           'back_text': 'Mỗi điều tra viên còn sống sót chưa resign bị đánh bại và chịu 1 tổn thương tinh thần.',
           'back_flavor': 'Bạn thấy mình bị bao vây trong bóng tối bởi hàng chục bóng đen, đang lách cách và ríu rít. '
                          'Đáng lo ngại hơn nữa là lớp rêu phát sáng mềm mại lan rộng khắp các bức tường và trần nhà '
                          'trơn trượt của hang động thủy triều. Khi các sinh vật và lớp rêu chuyển động ép sát lại, '
                          'gần đến nghẹt thở, bạn mất thăng bằng và ngã vào một tấm thảm rêu dày đặc. Nhìn gần, bạn '
                          'thấy những chồi nhỏ và những khối gai nhọn trong đám rêu đang đập phập phồng và quay về '
                          'phía bạn như hàng trăm cái miệng nhỏ xíu.\n'
                          'Khi bạn cảm thấy tứ chi mình tê dại, một đôi bàn tay kéo bạn ra khỏi đám rêu. Helen Peters '
                          'kéo cả người bạn ra khỏi hang, miệng lẩm bẩm chửi rủa.'},
 '10572': {'name': 'Người Em Mất Tích',
           'text': '<b>Forced</b> - Sau khi manh mối cuối cùng được khám phá từ một địa điểm [[Cave]]: Đưa lá bài trên '
                   'cùng của chồng bài Caverns vào chơi liền kề với địa điểm đó.\n'
                   '<b>Objective</b> - Tìm Elizabeth Peters! Nếu các điều tra viên "tìm thấy một dây xích chó bị đứt" '
                   'và "tìm thấy một chuỗi dấu chân", ngay lập tức advance.',
           'flavor': 'Elizabeth Peters đã mất tích trong những hang động ven biển này khi đuổi theo chú chó của gia '
                     'đình. Helen quyết tâm đưa cô bé trở về.',
           'back_name': 'Một Dấu Vết Phát Sáng',
           'back_text': 'Chọn một địa điểm [[Coastal]] (không có điều tra viên, nếu có thể). Đưa địa điểm Fungal Cave '
                        'đang để riêng vào chơi liền kề với địa điểm được chọn.\n'
                        'Đưa lá bài trên cùng của chồng bài Caverns vào chơi, liền kề với Fungal Cave. Lặp lại điều '
                        'này cho đến khi Fungal Cave được kết nối với bốn địa điểm, hoặc chồng bài Caverns trống rỗng.',
           'back_flavor': '"Nó còn sống. Dù tôi nghi ngờ Bruce cũng vậy," Helen nói, một tay nắm chặt chiếc dây xích '
                          'chó bị đứt. Bạn đi theo cô khi cô lần theo dấu chân sâu hơn vào bóng tối. Khi mắt bạn điều '
                          'chỉnh lại với ánh sáng yếu, bạn nhận thấy những dấu chân phát sáng với những tàn dư của '
                          'loại nấm phát quang sinh học bao phủ sàn hang.\n'
                          '"Lối này. Hãy chuẩn bị cho mọi tình huống," Helen nói. Bạn trấn tĩnh lại và bước đều bên '
                          'cạnh cô. Phía trước, tiếng lách cách và vo ve đáng lo ngại cho bạn biết rằng bạn còn lâu '
                          'mới đơn độc...'},
 '10573': {'name': 'Theo Dấu Vết',
           'text': '[action] Chi trả 1 [per_investigator] manh mối và chọn một kẻ địch tại một địa điểm [[Dark]] kết '
                   'nối: Di chuyển kẻ địch đó đến địa điểm của bạn.\n'
                   '<b>Objective</b> - Khi một điều tra viên tiến vào Fungal Cave, ngay lập tức advance.',
           'flavor': 'Những dấu chân phát sáng của Lizzie dẫn đến một căn phòng chưa được khám phá sâu trong các hang '
                     'động. Qua chuyến khám phá, giờ đây bạn đã biết cách dụ những sinh vật đói khát phủ đầy rêu phát '
                     'sáng ra khỏi bóng tối và bước vào ánh sáng.',
           'back_name': 'Quái Vật Giáp Xác',
           'back_text': 'Spawn Limulus Hybrid đang để riêng tại Fungal Cave.\n'
                        'Loại bỏ Helen Peters khỏi trò chơi. Nếu Theo Peters đang thuộc quyền kiểm soát của bất kỳ '
                        'điều tra viên nào, <b>([codex] Σ)</b> <i>(trang 25)</i>.',
           'back_flavor': '"Chị Helen!" Tiếng kêu the the, tuyệt vọng của Elizabeth xé tan sự tĩnh lặng. Một cô gái '
                          'trẻ với khuôn mặt tròn và bộ quần áo rách rưới tập tễnh bước ra khỏi bóng tối để ôm chầm '
                          'lấy chị gái mình. Khi hai chị em ôm nhau, cuộc đoàn tụ của họ bị cắt ngắn bởi một tiếng rít '
                          'kinh hoàng. Một con giáp xác khổng lồ to bằng một ngôi nhà tiến tới, đôi càng giơ lên đầy '
                          'đe dọa. Hình dáng bóng loáng, trơn trượt của sinh vật này được chiếu sáng bằng màu xanh lá '
                          'cây và xanh lam bởi rêu trong hang, và nó phát ra một mùi giống như động vật có vỏ thối '
                          'rữa.\n'
                          '"Em có đi được không?" Helen hỏi em gái mình. Lizzie lắc đầu. Khi sinh vật khổng lồ đến gần '
                          'hơn, bạn bảo hai người hãy chạy đi. Helen trông có vẻ giằng xé một lúc, rồi gật đầu cảm ơn '
                          'trước khi bế em gái mình rời đi.'},
 '10574': {'name': 'Mặt Đối Mặt Với Mai Cua',
           'text': '[action] Chi trả 1 [per_investigator] manh mối và chọn một kẻ địch tại một địa điểm [[Dark]] kết '
                   'nối: Di chuyển kẻ địch đó đến địa điểm của bạn.\n'
                   '<b>Objective</b> - Nếu Limulus Hybrid bị đánh bại, ngay lập tức advance.',
           'flavor': 'Quái vật từ sâu thẳm của các hang động rình rập bạn qua các đường hầm. Bạn chỉ có thể hy vọng '
                     'mình có thể câu đủ thời gian cho Helen và em gái cô trốn thoát.',
           'back_name': 'Càng Lớn Càng...',
           'back_text': '<b>(→R1)</b> <i>(trang 26)</i>.',
           'back_flavor': 'Quái vật khổng lồ quằn quại và giãy giụa, thân hình to lớn của nó rung lên trong cơn hấp '
                          'hối dữ dội. Cuối cùng, quái vật cũng nằm yên. Một chất lỏng màu xanh lam chảy ra từ mắt và '
                          'mai của nó, bốc mùi giống như động vật có vỏ thối rữa tồi tệ hơn nữa. Bịt mũi và miệng lại, '
                          'bạn quay trở lại Akwan.'},
 '10606': {'name': 'Bóng Tối Sâu Dần',
           'text': '<b>Forced</b> - Sau khi một địa điểm được lật mở: Đưa các địa điểm từ trên cùng của chồng bài '
                   'Woods vào chơi ở phía trên, phía dưới, bên trái và bên phải của địa điểm đó.\n'
                   '<b>Forced</b> - Khi giai đoạn điều tra kết thúc: Mỗi điều tra viên tại một địa điểm [[Dark]] phải '
                   'hoặc rút một kẻ địch trong vùng truy đuổi (pursuit) có chỉ số evade cao nhất hoặc nhận 1 horror '
                   '(không thể bị hủy bỏ).',
           'flavor': 'Khu rừng tĩnh lặng ngân vang những âm thanh của các sinh vật đói khát và những bóng đen rình '
                     'rập.',
           'back_name': 'Bóng Tối Hội Tụ',
           'back_text': 'Thêm 1 tài nguyên vào mức bóng tối hiện tại. Nếu mức bóng tối hiện tại là 6+ và bạn đang chơi '
                        'ở Chế độ Chiến dịch, mỗi điều tra viên còn sống sót bị đánh bại và chịu 1 tổn thương thể '
                        'chất.\n'
                        'Nếu không, hãy thực hiện các bước sau:\n'
                        '- Đưa mỗi kẻ địch tại một địa điểm [[Dark]] và không engaged với một điều tra viên vào khu '
                        'vực truy đuổi (pursuit area).\n'
                        '- Xáo trộn từng địa điểm [[Dark]] chưa lật mở cùng với 2 lá bài trên cùng của chồng bài Woods '
                        'và đặt chúng lên trên cùng của chồng bài Woods. Lật mỗi địa điểm [[Dark]] trống đã lật mở '
                        'sang mặt chưa lật mở của nó, bỏ tất cả các token.\n'
                        '- Đưa các địa điểm từ trên cùng của chồng bài Woods vào chơi ở phía trên, phía dưới, bên trái '
                        'và bên phải của mỗi địa điểm có điều tra viên.\n'
                        '- Điều tra viên có Vale Lantern kiểm tra [willpower] (X), trong đó X là mức bóng tối hiện '
                        'tại. Nếu họ thất bại, họ phải chọn một kẻ địch trong khu vực truy đuổi để spawn engaged với '
                        'họ.\n'
                        'Flip this card back to agenda 1a.',
           'back_flavor': ''},
 '10607a': {'name': 'Vào Khu Rừng',
            'text': 'Mỗi kẻ địch không có hướng dẫn spawn nhận "<b>Spawn</b> - Khi kẻ địch này được rút từ chồng bài '
                    'encounter: Đưa kẻ địch này vào khu vực truy đuổi (pursuit area)."\n'
                    '<b>Objective</b> - Vào cuối vòng chơi, nếu mỗi điều tra viên đều đang ở cùng một địa điểm '
                    '[[Lair]], họ có thể cùng nhau chi trả số lượng manh mối cần thiết, theo nhóm, để advance.',
            'flavor': 'Bertie đã đi lạc vào khu rừng rậm rạp này. Bạn phải tìm thấy cậu trước khi bóng tối nuốt chửng '
                      'tất cả.',
            'back_name': '',
            'back_text': '',
            'back_flavor': ''},
 '10608': {'name': 'Bertie Ở Đâu?',
           'text': '[fast] Chi trả 1 manh mối: Nhìn mặt lật mở của một địa điểm liền kề.\n'
                   '<b>Objective</b> - Tìm Bertie Musgrave. Cậu bé bị lạc sâu trong rừng! <i>(Không advance cho đến '
                   'khi bạn được hướng dẫn.)</i>',
           'flavor': 'Những cái cây khép lại khi bạn lần theo dấu vết của Bertie sâu hơn vào rừng.',
           'back_name': 'Tránh Vỏ Dưa Gặp Vỏ Dừa...',
           'back_text': 'Đưa story asset Bertie Musgrave đang để riêng vào chơi dưới quyền kiểm soát của bất kỳ điều '
                        'tra viên nào. Đưa mỗi kẻ địch không engaged vào khu vực truy đuổi. Xáo trộn mỗi địa điểm khác '
                        'ngoại trừ địa điểm The Twisted Hollow vào chồng bài Woods và đưa chúng vào chơi theo sơ đồ ở '
                        'trang 36.\n'
                        'Tìm kiếm trong tất cả các khu vực trong và ngoài màn chơi kẻ địch Ursine Hybrid, hồi toàn bộ '
                        'damage trên nó, và spawn nó tại The Twisted Hollow. Advance act và chồng bài agenda sang '
                        'agenda đặc biệt "Back to the Vale!", chuyển toàn bộ doom từ agenda hiện tại sang nó. Nó vừa '
                        'là act hiện tại vừa là agenda hiện tại.',
           'back_flavor': '"Tránh xa ra!" một giọng nói quen thuộc the thé vang lên. Một quả thông vút qua tai bạn. '
                          'Bertie ngó ra từ một hốc cây trên thân cây khổng lồ. "Là các bạn!" cậu bé ríu rít mừng rỡ. '
                          '"Cháu cứ ngỡ mình tiêu đời rồi - nhưng các bạn đã ở đây!" Đôi mắt cậu mở to khi một tiếng '
                          'gầm khò khè quen thuộc vang vọng khắp hốc cây.'},
 '10609': {'name': 'Trở Lại Vale!',
           'text': '[fast] Hoặc exhaust Vale Lantern hoặc chi trả 1 [per_investigator] manh mối, theo nhóm: Nhìn mặt '
                   'lật mở của một địa điểm liền kề. Bạn có thể di chuyển đến địa điểm đó.\n'
                   '<b>Objective</b> - Nếu mỗi điều tra viên chưa bị đánh bại đã resign, <b>(→R1)</b> <i>(trang '
                   '38)</i>.',
           'flavor': 'Cùng với Bertie, bạn phải tìm đường trở lại Hemlock Vale.',
           'back_name': 'Khu Rừng Đói Khát',
           'back_text': 'Thêm 1 tài nguyên vào mức bóng tối hiện tại. Nếu mức bóng tối hiện tại là 6, mỗi điều tra '
                        'viên còn sống sót bị đánh bại và chịu 1 tổn thương thể chất <b>(→R2)</b> <i>(trang 38)</i>.\n'
                        'Nếu không, theo thứ tự lượt chơi, mỗi người chơi phải chọn một kẻ địch trong khu vực truy '
                        'đuổi và spawn nó tại địa điểm [[Dark]] gần nhất. Nếu họ không thể, họ phải bỏ các lá bài từ '
                        'trên cùng của chồng bài encounter cho đến khi một kẻ địch bị bỏ và spawn nó tại địa điểm '
                        '[[Dark]] gần nhất.\n'
                        'Lật mặt lá bài này lại.',
           'back_flavor': 'Khu rừng khép lại và âm thanh của những hàm răng thèm thuồng cùng những chiếc nanh nghiến '
                          'ngấu tràn ngập không khí. Một tiếng hú bệnh hoạn vang lên từ bụi rậm và âm thanh quen thuộc '
                          'của một tiếng ho khò khè báo trước sự tiếp cận của con gấu.'},
 '10628': {'name': 'Cuộc Tấn Công Dồn Dập',
           'text': 'Khi kiểm tra doom threshold, doom trên các lá bài khác ngoài agenda này sẽ trừ đi khỏi tổng doom '
                   'trong màn chơi thay vì cộng vào.\n'
                   '<b>Forced</b> - Khi một hiệu ứng lá bài đặt doom lên agenda: Đặt nó lên story asset The Captives '
                   'thay vào đó.\n'
                   '<b>Forced</b> - Sau khi doom được đặt lên agenda này: Theo thứ tự lượt chơi, mỗi điều tra viên rút '
                   'lá bài trên cùng của chồng bài Enemy.',
           'flavor': 'Hy vọng duy nhất của bạn là cầm cự cho đến bình minh.',
           'back_name': 'Một Sự Hy Sinh Cuối Cùng',
           'back_text': 'Điều tra viên dẫn đầu phải quyết định (chọn một):\n'
                        '- Mỗi điều tra viên chưa bị đánh bại chịu 1 tổn thương tinh thần.\n'
                        '- Chọn một cư dân dưới quyền kiểm soát của một điều tra viên. Cư dân đó bước vào giữa bạn và '
                        'quái vật, hy sinh bản thân. Trong Campaign Log, gạch bỏ tên của cư dân được chọn. Trong ghi '
                        'chú của Cư Dân đó, hãy ghi lại <i>[name] đã hy sinh bản thân vì các điều tra viên</i>.\n'
                        'Advance act.',
           'back_flavor': 'Những tia nắng đầu tiên của bình minh gửi những vệt màu tím và đỏ thẫm trên bầu trời, xóa '
                          'nhòa những vì sao. Khi bạn đối mặt với bình minh đang tới, một quái vật đã ngã xuống trỗi '
                          'dậy từ một đống xác chết bị xé toạc để lao về phía bạn. Bạn hầu như không có thời gian để '
                          'phản ứng!'},
 '10629': {'name': 'Đêm Dài Nhất',
           'text': '[fast] Trong lượt của bạn, chi trả 1 manh mối: Đặt 1 rào chắn (barrier), mồi nhử (decoy), hoặc bẫy '
                   '(trap) tại địa điểm của bạn.\n'
                   '[action]: <b>Resign.</b> Sau đó, nếu mỗi điều tra viên chưa bị đánh bại đã resign, <b>(→R3)</b> '
                   '<i>(trang 50)</i>.\n'
                   '<b>Objective</b> - Sống sót qua đêm và bảo vệ càng nhiều tù nhân càng tốt. <i>(Không advance cho '
                   'đến khi bạn được hướng dẫn.)</i>',
           'flavor': 'Bạn phải bảo vệ các tù nhân!',
           'back_name': 'Trong Gang Tấc',
           'back_text': '<b>Nếu có từ 4 damage trở xuống trên The Captives:</b>\n'
                        '<blockquote><i>Bất chấp cuộc tấn công dồn dập dường như bất tận, tương đối ít tù nhân bị tổn '
                        'hại. Khi bạn quan sát khung cảnh đổ nát bên trong trang trại, một số tù nhân khóc nấc trong '
                        'tay, và những người khác nhìn bạn với ánh mắt trách móc. Làm sao bạn có thể thuyết phục họ '
                        'rằng mạng sống của họ xứng đáng được cứu?</i></blockquote>\n'
                        '<b>(→R1)</b> <i>(trang 50)</i>.\n'
                        '<hr>\n'
                        '<b>Nếu không:</b>\n'
                        '<blockquote><i>Trang trại là một nhà mồ chứa đầy máu me và nội tạng. Khi đối mặt với cuộc tấn '
                        'công dồn dập, nhiều tù nhân đã la hét bỏ chạy thẳng vào hàm của những quái vật. Ánh sáng buổi '
                        'sáng chiếu rọi một cảnh tượng sẽ ám ảnh những giấc mơ của bạn.</i></blockquote>\n'
                        '<b>(→R2)</b> <i>(trang 50)</i>.',
           'back_flavor': ''},
 '10652': {'name': 'Sự Tĩnh Lặng',
           'text': 'Nếu bạn nhìn vào kẻ địch Cosmic Emissary quá 15 giây mỗi lần, bạn bị <b>phát điên (driven '
                   'insane)</b>.\n'
                   '<b>Forced</b> - Khi bạn rút 1 hoặc nhiều lá bài từ chồng bài encounter: Thay vào đó, lật mở các lá '
                   'bài từ dưới cùng của The Abyss cho đến khi một lá bài có mặt lưng bài encounter được lật mở và rút '
                   'nó <i>(tất cả các lá bài được lật mở khác được đặt lên trên cùng của The Abyss)</i>.',
           'flavor': 'Một hình thù xám xịt chập chờn trong làn khí xoáy ốc.',
           'back_name': 'Tâm Trí Tan Biến',
           'back_text': 'Mỗi điều tra viên kiểm tra [willpower] hoặc [intellect] (4). Với mỗi điểm họ thất bại, họ '
                        'phải hoặc chịu 1 horror hoặc xáo trộn lá bài trên cùng của bộ bài của họ vào The Abyss.',
           'back_flavor': 'Bạn cảm thấy những tiếng thì thầm trong đầu, nói bằng một thứ ngôn ngữ ngoài hành tinh gồm '
                          'những tiếng lách cách, vo ve và thứ âm nhạc kỳ lạ, trầm bổng. Nghe có vẻ quen thuộc. Một '
                          'hình thù mờ ảo xuất hiện từ màn sương cuồn cuộn và vươn tay về phía bạn. Khi bạn cảm thấy '
                          'tâm trí mình bắt đầu trống rỗng, bạn không thể nhịn được cười. Chính xác thì bạn đã quên '
                          'điều gì? Chắc nó chẳng quan trọng đâu.'},
 '10653': {'name': 'Chướng Khí',
           'text': 'Nếu bạn nhìn vào kẻ địch Cosmic Emissary quá 15 giây mỗi lần, bạn bị <b>phát điên (driven '
                   'insane)</b>.\n'
                   '<b>Forced</b> - Khi bạn rút 1 hoặc nhiều lá bài từ chồng bài encounter: Thay vào đó, lật mở các lá '
                   'bài từ dưới cùng của The Abyss cho đến khi một lá bài có mặt lưng bài encounter được lật mở và rút '
                   'nó <i>(tất cả các lá bài được lật mở khác được đặt lên trên cùng của The Abyss)</i>.',
           'flavor': 'Những hình thù ác mộng kết tụ lại trong làn sương mù.',
           'back_name': 'Bản Thân Tan Biến',
           'back_text': 'Mỗi điều tra viên kiểm tra [combat] hoặc [agility] (4). Với mỗi điểm họ thất bại, họ phải '
                        'hoặc chịu 1 damage hoặc xáo trộn lá bài trên cùng của bộ bài của họ vào The Abyss.',
           'back_flavor': 'Hơi nước bốc lên từ mặt đất, kết tụ thành những hình dạng thô ráp, hữu hình. Một khối tinh '
                          'thể lởm chởm nhô lên khỏi mặt đất khi bạn loạng choạng bước về phía trước trong cơn mê '
                          'muội. Càng hít thở thứ khí độc xung quanh, bạn càng cảm thấy yếu ớt hơn. Sự sống và sinh '
                          'lực của bạn đang bị rút cạn.'},
 '10654': {'name': 'Vòng Xoắn Ốc',
           'text': 'Nếu bạn nhìn vào kẻ địch Cosmic Emissary quá 15 giây mỗi lần, bạn bị <b>phát điên (driven '
                   'insane)</b>.\n'
                   '<b>Forced</b> - Khi bạn rút 1 hoặc nhiều lá bài từ chồng bài encounter: Thay vào đó, lật mở các lá '
                   'bài từ dưới cùng của The Abyss cho đến khi một lá bài có mặt lưng bài encounter được lật mở và rút '
                   'nó <i>(tất cả các lá bài được lật mở khác được đặt lên trên cùng của The Abyss)</i>.',
           'flavor': 'Tầm nhìn của bạn khúc xạ như kính vỡ.',
           'back_name': 'Bữa Tiệc Của Chính Bạn',
           'back_text': 'Toàn bộ Hemlock Isle đã bị biến đổi trong cuộc thăng thiên vĩ đại. Mỗi điều tra viên bị '
                        '<b>nuốt chửng (devoured)</b> bởi Colour Out of Space <i>(họ bị</i> <b>giết</b><i>)</i>.',
           'back_flavor': 'Không khí gợn sóng dừng lại, rồi cuộn xoáy thành vô số khuôn mặt, hình thù và dáng vẻ. Bạn '
                          'vật lộn để thở khi không khí bị hút cạn khỏi phổi và cuốn vào một cột ánh sáng. Ánh hào '
                          'quang bay lên bầu trời đêm như một ngôi sao băng rơi ngược chiều, nghiền nát mọi thứ xung '
                          'quanh bạn thành cát bụi. Cây cối héo úa và khô cằn, còn muông thú tháo chạy bị biến thành '
                          'xương và tro tàn. Thân xác bạn thăng hoa, tan biến vào ánh hào quang chói lòa cùng với mọi '
                          'thứ khác trên Hemlock Isle.\n'
                          'Bạn đã thấu hiểu vị trí của mình trong cõi vô tận.'},
 '10655': {'name': 'Ký Ức Vụn Vỡ',
           'text': '[reaction] Sau khi bạn thành công một bài kiểm tra kỹ năng tại một địa điểm [[Lair]] trong lượt '
                   'của bạn: Lật mở các lá bài từ dưới cùng của The Abyss cho mỗi điểm bạn thành công. Rút 1 trong số '
                   'đó, xáo trộn phần còn lại, và đặt chúng lên trên cùng của The Abyss.\n'
                   '[fast] Chi trả 1 manh mối: Bạn nhận +2 giá trị kỹ năng cho bài kiểm tra kỹ năng này.\n'
                   '<b>Objective</b> - Nếu mỗi người chơi đều có lá bài điều tra viên "đích thực" của họ, advance.',
           'flavor': 'Tạii ssa o n óllạii ss án g t hếế TTôi đan ng mm ơơ ư?',
           'back_name': 'Ex Nihilo',
           'back_text': 'Đặt manh mối lên mỗi địa điểm đã lật mở cho đến giá trị manh mối của nó.\n'
                        'Kiểm tra Campaign Log và thu thập encounter set <i>Residents</i> đang để riêng và các địa '
                        'điểm [[Cave]] đang để riêng.\n'
                        '- Mother Rachel đã bị <b>nuốt chửng (devoured)</b>. Gạch bỏ tên của Mother Rachel.\n'
                        '- Xáo trộn mỗi cư dân có tên bị gạch bỏ vào The Abyss, cùng với mỗi địa điểm [[Cave]].\n'
                        '- Mỗi điều tra viên có thể chọn 1 cư dân ở Mức Độ Mối Quan Hệ từ 4 trở lên để đưa vào chơi '
                        'dưới quyền kiểm soát của họ, mặt asset ngửa.\n'
                        '- Để mỗi lá bài còn lại từ encounter set <i>Residents</i> sang một bên, ngoài màn chơi.',
           'back_flavor': 'Khi bạn tỉnh táo lại, bạn ngước nhìn bầu trời đầy sao và mặt trăng đỏ như máu ở tít trên '
                          'cao. Bạn có thể tìm thấy một lối đi trở lại bề mặt.'},
 '10656': {'name': 'Bản Ngã Đánh Mất',
           'text': '[reaction] Sau khi bạn thành công một bài kiểm tra kỹ năng tại một địa điểm [[Lair]] trong lượt '
                   'của bạn: Lật mở các lá bài từ dưới cùng của The Abyss cho mỗi điểm bạn thành công. Rút 1 trong số '
                   'đó, xáo trộn phần còn lại, và đặt chúng lên trên cùng của The Abyss.\n'
                   '[fast] Chi trả 1 manh mối: Bạn nhận +2 giá trị kỹ năng cho bài kiểm tra kỹ năng này.\n'
                   '<b>Objective</b> - Vào cuối vòng chơi, nếu có từ 3 địa điểm [[Cave]] đã lật mở trở lên trong màn '
                   'chơi không có manh mối nào trên đó, advance.',
           'flavor': 'Bạn phải tìm đường trở về Vale!',
           'back_name': 'Chuyển Giao Trách Nhiệm',
           'back_text': 'Mỗi điều tra viên mất toàn bộ manh mối của họ.\n'
                        'Kiểm tra Campaign Log và tiến tới <b>Scenario Interlude: Fate of the Vale</b> <i>(trang '
                        '64)</i>. Các điều tra viên phải quyết định hướng hành động của họ (chọn một):\n'
                        '- "Hãy kết thúc chuyện này." (Bạn chỉ có thể chọn lựa chọn này nếu <i>Dr. Marquez has a '
                        'hunch</i> <b>và</b> <i>Dr. Marquez has a plan</i>. Bạn cũng có thể chọn lựa chọn này nếu '
                        '<i>Gideon finished the tale of the</i> Annabelle Lee.) Tiến tới <b>Fate of the Vale 1</b>.\n'
                        '- "Cứu lấy Vale!" (Bạn chỉ có thể chọn lựa chọn này nếu <i>The Hemlock Family made a '
                        'truce</i> và/hoặc <i>The Peters family was reunited</i>.) Tiến tới <b>Fate of the Vale '
                        '2</b>.\n'
                        '- "Thiêu rụi tất cả." (Bạn chỉ có thể chọn lựa chọn này nếu <i>The Vale is full of '
                        'fireworks</i>.) Tiến tới <b>Fate of the Vale 3</b>.\n'
                        '- "Thoát thân để giữ mạng sống." Tiến tới <b>Fate of the Vale 4</b>.',
           'back_flavor': 'Dr. Marquez chỉ lên một gờ đá dốc đứng bấp bênh dẫn ngược lên bề mặt. Với một con đường rõ '
                          'ràng để thoát ra khỏi căn phòng phát sáng, bạn phải cân nhắc xem nên làm gì tiếp theo.'},
 '10657': {'name': 'Định Mệnh Của Vale (bản I)',
           'text': '[reaction] Sau khi bạn thành công một bài kiểm tra kỹ năng tại một địa điểm [[Lair]] trong lượt '
                   'của bạn: Lật mở các lá bài từ dưới cùng của The Abyss cho mỗi điểm bạn thành công. Rút từng lá bài '
                   'kẻ địch một mặt được lật mở bởi hiệu ứng này. Loại bỏ mỗi lá bài được lật mở khác khỏi trò chơi.\n'
                   '[fast] Chi trả 1 manh mối: Bạn nhận +2 giá trị kỹ năng cho bài kiểm tra kỹ năng này.\n'
                   '<b>Objective</b> - Vào cuối vòng chơi, nếu mỗi điều tra viên còn sống sót đều đang ở The Abyss, '
                   'các điều tra viên có thể cùng nhau chi trả số lượng manh mối cần thiết, theo nhóm, để advance.',
           'flavor': 'Dr. Marquez cần sự giúp đỡ của bạn để cứu lấy Vale!',
           'back_name': 'Ad Nihilum',
           'back_text': 'Các điều tra viên phải quyết định <i>(chọn một)</i>:\n'
                        '- Để Dr. Marquez thực hiện kế hoạch của bà <b>(→R1)</b> <i>(trang 66)</i>.\n'
                        '- Tự chúng ta làm điều đó <b>(→R2)</b> <i>(trang 67)</i>. (Bạn chỉ có thể chọn điều này nếu '
                        'một điều tra viên kiểm soát story asset Prismatic Shard.)',
           'back_flavor': 'Bạn đứng cạnh Dr. Marquez dưới chân một gò đất gồm những xác chết khô khốc. Phía trên, Vực '
                          'Thẳm Abyss chập chờn trong bầu không khí tĩnh lặng, lạnh lẽo. Một hình thù dạng người mờ ảo '
                          'vươn về phía bạn khi ánh hào quang lại bùng lên, sáng chói mắt. "Vô ích thôi. Chúng ta cần '
                          'phải phá vỡ nó. Cho nó ăn thứ gì đó mà nó không thể \'tiêu hóa\'," Dr. Marquez nói một cách '
                          'trầm ngâm. Bà đưa cho bạn chiếc túi đeo chéo chứa đầy các ghi chép khảo sát và mẫu vật. '
                          '"Tôi muốn bạn giữ thứ này." Bạn hỏi tại sao. "Cần có ai đó kể cho Dr. Armitage câu chuyện '
                          'về thứ này..." mắt bà nheo lại, nhìn chằm chằm vào ánh ngũ sắc chập chờn. "...thứ màu sắc '
                          'từ ngoài không gian này."'},
 '10658': {'name': 'Định Mệnh Của Vale (bản II)',
           'text': '[action] Chọn và bỏ 1 lá bài từ tay bạn: <b>Parley.</b> Kiểm tra [willpower] hoặc [intellect] (3). '
                   'Nếu thành công, rút lá bài [[Resident]] bên dưới địa điểm của bạn, mặt kẻ địch ngửa. Bạn có thể '
                   'chi trả 1 [per_investigator] manh mối để đưa nó vào chơi exhausted.\n'
                   '<b>Objective</b> - Nếu không có kẻ địch [[Resident]] nào bên dưới các địa điểm hoặc trong màn '
                   'chơi, bạn có thể cùng nhau chi trả số lượng manh mối cần thiết, theo nhóm, để advance.',
           'flavor': 'Bạn sẽ phải nói lý lẽ với những cư dân đang cuồng loạn... hoặc đánh ngất họ.',
           'back_name': 'Đến Ngọn Hải Đăng!',
           'back_text': '<b>(→R3)</b> <i>(trang 67)</i>.',
           'back_flavor': '"Lên xe tải mau!" Một cư dân vẫy đám đông người dân địa phương đang bàng hoàng bước lên xe. '
                          'Những người sống sót còn lại chen chúc trên những chiếc xe tải và xe đạp cũ kỹ rồi lái xe '
                          'xuống con đường phía nam quanh co. Khi bạn đi qua bến cảng đổ nát, một cột ánh sáng thuần '
                          'khiết phóng lên từ trung tâm ngôi làng theo sau là một đám mây nhờn, nhớp nháp. Đoàn người '
                          'sống sót vừa mới lánh nạn trong ngọn hải đăng phía nam thì một làn sóng chấn động không khí '
                          'nóng xé toạc hòn đảo với sức mạnh của một cơn bão.'},
 '10659': {'name': 'Định Mệnh Của Vale (bản III)',
           'text': '[action] Chi trả X [per_investigator] manh mối: Đặt X tài nguyên lên địa điểm của bạn, dưới dạng '
                   'bùi nhùi (kindling) (bạn có thể chi trả 5 tài nguyên hoặc bỏ một asset [[Item]] bạn kiểm soát để '
                   'đặt thêm 1 bùi nhùi).\n'
                   '[action] Nếu địa điểm của bạn có lượng bùi nhùi trên đó bằng hoặc lớn hơn giá trị shroud của nó, '
                   'loại bỏ toàn bộ bùi nhùi khỏi nó: Rút 1 treachery Fire! đang để riêng. (Giới hạn cả nhóm một lần '
                   'mỗi địa điểm.)\n'
                   '<b>Objective</b> - Khi vòng chơi kết thúc, nếu có 5 bản sao của Fire! trong màn chơi, ngay lập tức '
                   'advance.',
           'flavor': 'Hy vọng duy nhất của bạn để ngăn chặn thứ này là thiêu rụi hòn đảo bị nguyền rủa này. Toàn bộ '
                     'nó.',
           'back_name': 'Chìm Trong Biển Lửa',
           'back_text': '<b>(→R4)</b> <i>(trang 67)</i>.',
           'back_flavor': 'Pháo hoa phóng vút lên bầu trời khi Hemlock Vale bị ngọn lửa nuốt chửng. Những luồng sáng '
                          'rít lên và tiếng nổ lách tách lớn gần như làm xao nhãng khỏi trận hỏa hoạn tàn khốc khi nó '
                          'thiêu rụi cảnh vật. Những chùm pháo hoa đỏ, vàng và xanh phóng lên không trung rồi phát nổ '
                          'trên bầu trời đêm.\n'
                          'Bạn và Dr. Marquez cùng vài người sống sót còn lại thực hiện chuyến hành trình đến vùng cực '
                          'nam của hòn đảo để lánh nạn trong một ngọn hải đăng đổ nát. Khi bạn nhìn ngọn lửa qua ô cửa '
                          'sổ lấm lem, một vệt ánh sáng xám mỏng manh phóng lên từ trung tâm ngôi làng, rồi vụt tắt. '
                          'Một ánh sáng lân tinh nhỏ bé rơi thẳng trở lại đám cháy như một ngôi sao băng.'},
 '10660': {'name': 'Định Mệnh Của Vale (bản IV)',
           'text': '[action] Nếu có ít nhất 5 trong số các điều sau là đúng (<i>the investigators found gas</i>, '
                   "<i>the investigators found Theo's truck</i>, <i>the road is clear</i>, <i>the survey notes were "
                   'recovered</i>, <i>Bertie is fleeing</i>, <i>the samples were found</i>): <b>Resign.</b> Bạn chạy '
                   'trốn khỏi Vale.\n'
                   '<b>Objective</b> - Thoát thân để giữ mạng sống! Nếu mỗi điều tra viên chưa bị đánh bại đã resign, '
                   'advance.',
           'flavor': 'Bạn phải chạy trốn để giữ lấy mạng sống của mình!',
           'back_name': 'Chỉ Mới Là Sự Khởi Đầu...',
           'back_text': '<b>(→R5)</b> <i>(trang 67)</i>.',
           'back_flavor': 'Cùng với Dr. Marquez, bạn tập hợp vài người sống sót còn lại và chen chúc lên chiếc xe tải '
                          'màu xanh da trời của Theo. Người dân địa phương hét to chỉ đường khi bạn lái xe về phía nam '
                          'theo con đường quanh co dẫn đến điểm cực nam của hòn đảo. Run rẩy vì adrenaline, nhóm người '
                          'sống sót nhỏ của bạn lánh nạn trong ngọn hải đăng đổ nát.\n'
                          'Trước khi bước vào, bạn quay lại nhìn một cảnh tượng mà bạn sẽ không bao giờ quên. Một cột '
                          'ánh sáng thuần khiết phóng lên từ Vale, cuốn theo đám mây nhớp nháp dầu mỡ sau đuôi nó. Một '
                          'làn sóng chấn động xé toạc hòn đảo, và bạn khuỵu gối xuống, kiệt sức, như thể nhiều năm '
                          'tuổi thọ của bạn đã bị đánh cắp trong một khoảnh khắc duy nhất. Bạn bị mê hoặc bởi ánh sáng '
                          'rực rỡ khi nó phóng vút qua tầng bình lưu và tiến vào không gian.'},
 '10681': {'name': 'Chào Mừng Đến Hemlock Vale!',
           'text': '<b>Forced</b> - Khi bạn rút một lá bài điểm yếu (weakness): hủy bỏ hiệu ứng revelation của nó và '
                   'bỏ nó.',
           'flavor': 'Đoàn khảo sát Miskatonic đang ở lại Hemlock Vale và chuẩn bị cho chuyến thám hiểm hôm nay. Người '
                     'dân địa phương càng tin tưởng bạn, bạn sẽ càng hiểu rõ hơn về bản chất của Hemlock Isle.',
           'back_name': 'Đến Lúc Bắt Tay Vào Việc!',
           'back_text': 'Mỗi điều tra viên resign <b>(→R1)</b> <i>(trang 9)</i>.',
           'back_flavor': 'Bertie tiến lại gần, thở không ra hơi. "Dr. Marquez yêu cầu sự có mặt ngay lập tức của các '
                          'bạn," cậu vừa thở hổn hển vừa xen vào cuộc trò chuyện của bạn. "Và tin tôi đi, bà ấy sẽ '
                          'không thích chút nào nếu các bạn đến muộn đâu."'},
 '10682': {'name': 'Bình Minh Ngày Đầu Tiên',
           'text': 'Các điều tra viên không thể nhận damage/horror hoặc bị đánh bại.\n'
                   '<b>Objective</b> - Kết bạn với người dân địa phương và chuẩn bị cho cuộc khảo sát đầu tiên! '
                   '<i>(Tham khảo luật ở trang 6 để biết thêm thông tin về phần mở đầu preludes)</i>',
           'flavor': 'Ngôi làng tràn ngập sự phấn khích! Trẻ em chơi đùa dọc ven đường đeo mặt nạ động vật, trong khi '
                     'những người khác treo những bông hoa sặc sỡ trên mái hiên và dọc theo hàng rào.',
           'back_name': 'Ánh Hào Quang Rực Rỡ',
           'back_text': '<b>Nếu bạn lật act này trong khi hoặc sau khi chơi phần mở đầu Bình Minh Ngày Đầu Tiên, hãy '
                        'đọc phần sau:</b>\n'
                        '<blockquote><i>Vị ngọt ngào của không khí và màu sắc rực rỡ thật choáng ngợp. Mạch máu của '
                        'bạn đập rộn ràng như có dòng điện chạy qua khi lớp da gà bò dọc cánh tay và làn da bạn ngứa '
                        'ran, gần như dưới một cái vuốt ve vô hình. Bạn không đơn độc, bạn chưa bao giờ đơn độc, nhưng '
                        'kẻ đang ở cùng bạn chính là bạn, và bạn, và bạn, và bạn, và bạn và bạn và và và và\n'
                        'Bạn bắt gặp chính mình đang ngước nhìn lên bầu trời như thủy tinh, hoang mang và say sưa '
                        'trong sự kỳ diệu.</i></blockquote>\n'
                        'Bạn (và chỉ riêng bạn) nhận được 1 kinh nghiệm thưởng. <i>(không chi tiêu nó cho đến khi được '
                        'hướng dẫn.)</i>',
           'back_flavor': ''},
 '10683': {'name': 'Những Đám Mây Đen',
           'text': '<b>Forced</b> - Khi bạn rút một lá bài điểm yếu (weakness): hủy bỏ hiệu ứng revelation của nó và '
                   'bỏ nó.',
           'flavor': 'Những đám mây ảm đạm đe dọa cơn mưa khi sấm sét rền vang trên đầu. Người dân địa phương tất bật '
                     'chuẩn bị.',
           'back_name': 'Cơn Đói Gặm Nhấm',
           'back_text': 'Kiểm tra campaign log:\n'
                        '<i>Nếu Bertie đã được giải cứu,</i> <b>(→R1)</b> <i>(trang 42)</i>.\n'
                        'Nếu không, <b>(→R2)</b> <i>(trang 42)</i>.',
           'back_flavor': 'Bạn tập hợp lại tại nhà trọ. Bà Olmstead dọn ra một bữa ăn gồm bánh mì ngô phết bơ ấm nóng, '
                          'củ cải nướng to bằng nắm tay, và một đống trứng dầu màu xám. Bụng bạn réo lên khi bạn gặm '
                          'nhấm một chút khẩu phần dã chiến của mình thay vì cùng thưởng thức.'},
 '10684': {'name': 'Bình Minh Ngày Thứ Hai',
           'text': 'Các điều tra viên không thể nhận damage/horror hoặc bị đánh bại.\n'
                   '<b>Objective</b> - Trò chuyện với người dân địa phương và tìm hiểu thêm về Hemlock Isle!',
           'flavor': 'Ngôi làng tiếp tục chuẩn bị với sự kiên định vui vẻ, bất chấp thời tiết ảm đạm.',
           'back_name': 'Một Sai Lầm',
           'back_text': '<b>Nếu bạn lật act này trong khi hoặc sau khi chơi phần mở đầu Bình Minh Ngày Thứ Hai, hãy '
                        'đọc phần sau:</b>\n'
                        '<blockquote><i>Khi bạn đi qua ngôi làng, một cơn chóng mặt ập đến và bạn loạng choạng bước về '
                        'phía trước, đưa tay ra để giữ thăng bằng. Bạn bị cứa vào lòng bàn tay ở góc của một chồng '
                        'gương và kêu lên vì đau đớn khi những hạt mưa dày đặc, nặng hạt bắt đầu rơi '
                        'xuống.</i></blockquote>\n'
                        '<b>([codex] 17)</b> <i>(trang 42).</i>',
           'back_flavor': ''},
 '10686': {'name': 'Tất Cả Đều Tràn Ngập Tình Yêu',
           'text': '<b>Forced</b> - Khi bạn rút một lá bài điểm yếu (weakness): Hủy bỏ hiệu ứng revelation của nó và '
                   'bỏ nó.',
           'flavor': 'Người dân vùng Vale khiêu vũ với nguồn năng lượng gần như cuồng loạn. Âm nhạc huyên náo và mùi '
                     'hương nước hoa ngọt ngào vương vấn trong không khí.',
           'back_name': 'Sự Lựa Chọn Của Bertie',
           'back_text': '<b>Kiểm tra Campaign Log. Nếu <i>Bertie had an epiphany</i>:</b>\n'
                        '<blockquote><i>Bạn gặp lại Dr. Marquez tại Nhà trọ. Bertie tiến lại gần bạn với ánh mắt cuồng '
                        'dại lấp lánh, khoác chiếc áo choàng màu trắng vàng của xứ Vale. "Cháu đã quyết định tham gia '
                        'Lễ hội ngày hôm nay - suốt cả ngày. Cháu hiểu điều này có thể khiến học bổng của cháu gặp '
                        'nguy hiểm nhưng -" Trước khi Dr. Marquez kịp khiển trách cậu, chàng trai trẻ đã chạy vụt qua '
                        'đám đông vũ công.</i></blockquote>\n'
                        '<b>(→R2)</b> <i>(trang 54)</i>.\n'
                        '<hr><b>Nếu không:</b>\n'
                        '<blockquote><i>Bạn gặp lại Dr. Marquez tại Nhà trọ. Bertie tiếp cận bạn và vị giáo sư với sự '
                        'phấn khích lộ rõ. "Cháu vừa có một phát hiện về Hemlock Isle. Chuỗi thức ăn ở đây thật hỗn '
                        'loạn. Kẻ săn mồi lại bị con mồi săn lùng - thật thi vị, phải không? Thứ gì đó trong thức ăn '
                        'hoặc nước uống gây ra sự cuồng loạn - thực tế là toàn bộ lễ kỷ niệm này là một dạng cuồng '
                        'loạn," cậu chỉ tay về phía những bóng người lâng lâng và những đứa trẻ đang nhảy '
                        'múa.</i></blockquote>\n'
                        '<b>(→R1)</b> <i>(trang 54)</i>.',
           'back_flavor': ''},
 '10687': {'name': 'Bình Minh Ngày Cuối Cùng',
           'text': '<b>Objective</b> - Trò chuyện với người dân địa phương và chuẩn bị tinh thần cho Lễ hội.',
           'flavor': 'Một ánh sáng tuyệt đẹp bao trùm lên mọi thứ, lấp lánh trong không khí xung quanh bạn.',
           'back_name': 'Niềm Phúc Lạc',
           'back_text': '<b>Nếu bạn lật act này trong khi hoặc sau khi chơi phần mở đầu Bình Minh Ngày Cuối Cùng, hãy '
                        'đọc phần sau:</b>\n'
                        '<blockquote><i>bạn không thể nói tại sao nhưng bạn biết tại sao bạn lại ở đây bạn ở đây để '
                        'xem để thấy để biết để nhận thức để cảm nhận để thấu hiểu để giữ trong tim chân lý của vũ trụ '
                        'rằng bạn chỉ là một hạt bụi trong ánh sáng rực rỡ của sự vô tận và rằng một làn gió thoảng '
                        'duy nhất sẽ đưa bạn xoáy sâu vào quên lãng một khoảnh khắc duy nhất và bạn sẽ không còn tồn '
                        'tại nữa nếu bạn từng thực sự tồn tại tại sao bạn lại nhìn vào ánh hào quang tại sao bạn lại '
                        'nhìn chằm chằm quá lâu vào ánh sáng chói lòa rực rỡ của những vì sao</i></blockquote>\n'
                        'Bạn phải hoặc chịu 1 tổn thương tinh thần hoặc tìm trong bộ sưu tập một điểm yếu [[Madness]] '
                        'cơ bản ngẫu nhiên và thêm nó vào bộ bài của bạn. Nó không tính vào giới hạn kích thước bộ bài '
                        'của bạn. Bạn nhận được 2 kinh nghiệm thưởng.',
           'back_flavor': ''},
 '10688': {'name': 'Bữa Tiệc Tuyệt Vời',
           'text': '<b>Objective</b> - Đối đầu với Mother Rachel! Nếu Mother Rachel bị đánh bại: <b>(→R1)</b>.',
           'flavor': 'Bàn tiệc tràn ngập những món ăn kỳ lạ nhưng hấp dẫn lạ thường. Dân làng tụ tập lại, chia sẻ '
                     'những nụ cười rạng rỡ và những cái nhìn đầy ẩn ý.',
           'back_name': 'Đỉnh Điểm',
           'back_text': 'Mỗi điều tra viên bị đánh bại và chịu 1 tổn thương tinh thần hoặc 1 tổn thương thể chất.',
           'back_flavor': 'Các bào tử phát quang lơ lửng trong không khí xung quanh hình nộm, thắp sáng những chiếc '
                          'gương và tắm lễ hội trong ánh hào quang thần tiên kỳ ảo. Bạn hít vào và cảm thấy miệng và '
                          'cổ họng mình vo ve một cảm giác ngứa ran nhẹ nhàng. Điều cuối cùng bạn nghe thấy khi ngất '
                          'đi là tiếng sáo và tiếng trống lục lạc trầm bổng.'},
 '10689': {'name': 'Bắt Đầu Lễ Hội',
           'text': 'Bạn không thể kích hoạt các mục codex [codex].\n'
                   '[reaction] Sau khi bạn evade một kẻ địch [[Resident]] từ 2 điểm trở lên: Thêm chúng vào khu vực '
                   'trưng bày thành tích.\n'
                   '<b>Objective</b> - Nếu có 1 cộng thêm 1 [per_investigator] lá bài [[Resident]] trong khu vực trưng '
                   'bày thành tích, <b>(→R3)</b> <i>(trang 60)</i>.',
           'flavor': 'Mọi chuẩn bị đã hoàn tất. Lễ hội Feast of Hemlock Vale chính thức bắt đầu.',
           'back_name': 'Sự Thăng Hoa',
           'back_text': 'Mỗi điều tra viên resign.',
           'back_flavor': '"Làm tốt lắm," Mother Rachel nói với bạn. Những ánh sáng nhảy múa trên bầu trời phía trên '
                          'khi những cư dân cuối cùng của Vale được dẫn dắt một cách ngoan ngoãn đến vị trí của họ tại '
                          'bàn tiệc. Một số nhìn bạn với vẻ mặt hối hận, cảm thấy bị phản bội một cách chính đáng. Khi '
                          'bạn bước tới để nhận chỗ ngồi của mình tại bàn tiệc, Mother Rachel bước ra chắn đường bạn.\n'
                          '"Không phải vị trí của các bạn là ngồi cùng chúng tôi. Các bạn là vị khách danh dự của '
                          'chúng tôi," bà mỉm cười. Bạn cảm thấy một cú đánh mạnh vào sau gáy, và rồi chẳng còn gì '
                          'nữa.'},
 '10589': {'name': 'Vùng Nước Chấn Động',
           'text': '[action]: <b>Resign.</b> Bạn chạy trốn khỏi đầm lầy.\n'
                   '<b>Forced</b> – Khi lượt của bạn kết thúc, nếu bạn đang ở một địa điểm [[Bog]]: Đặt 1 damage lên '
                   'địa điểm của bạn, dưới dạng hố sụt (sinkhole) (thay vào đó là 2 hố sụt nếu có 1 hoặc 2 điều tra '
                   'viên trong trò chơi).\n'
                   '<b>Forced</b> – Nếu một địa điểm có từ 3 hố sụt trở lên trên đó: Loại bỏ toàn bộ hố sụt khỏi nó và '
                   'lật mặt nó lại.',
           'flavor': 'Những chấn động nhẹ gợn sóng qua vùng cảnh quan trôi nổi. Đầm lầy là một khu rừng rậm rạp màu mỡ '
                     'của những bông hoa rực rỡ và những hình ảnh phản chiếu bóng loáng, đầy dầu mỡ.',
           'back_name': 'Một Cú Suýt Chết',
           'back_text': 'Lật địa điểm ở trung tâm sang mặt [[Sunken]] của nó, bỏ toàn bộ token và lá bài người chơi '
                        'gắn kèm. Spawn kẻ địch Thing in the Depths đang để riêng tại đó.',
           'back_flavor': 'Một tiếng gầm xé tai vang vọng khắp đầm lầy, theo sau là vài đợt sóng cuộn qua vùng cảnh '
                          'quan trôi nổi. Bạn cảm thấy một cơn rung chuyển trầm thấp bên dưới, và lao mình đến nơi an '
                          'toàn ngay trước khi một quái vật khủng khiếp phun trào từ bên dưới. Những hàng răng mỏng, '
                          'sắc như kim nghiến ngấu không khí nơi bạn vừa đứng, và những cuống mắt ghê rợn quay lại '
                          'nhìn bạn đầy đói khát.'},
 '10590': {'name': 'Quái Vật Trong Đầm Lầy',
           'text': '<b>Forced</b> – Khi lượt của bạn kết thúc, nếu bạn đang ở một địa điểm [[Bog]]: Đặt 1 damage lên '
                   'địa điểm của bạn, dưới dạng hố sụt (sinkhole) (thay vào đó là 2 hố sụt nếu có 1 hoặc 2 điều tra '
                   'viên trong trò chơi).\n'
                   '<b>Forced</b> – Nếu một địa điểm có từ 3 hố sụt trở lên trên đó: Loại bỏ toàn bộ hố sụt khỏi nó và '
                   'lật mặt nó lại.\n'
                   '<b>Objective</b> – Nếu Thing in the Depths bị đánh bại, <b>(→R4)</b>.',
           'flavor': 'Đầm lầy rung chuyển với những con sóng cao chót vót!',
           'back_name': 'Suýt Trở Thành Bữa Ăn',
           'back_text': 'Mỗi điều tra viên còn sống sót bị đánh bại và chịu 1 tổn thương thể chất.',
           'back_flavor': 'Khi bạn né sang một bên để tránh một xúc tu đang vồ lấy, hai chiếc xúc tu khác quấn quanh '
                          'chân và cổ bạn. Con quái vật gớm ghiếc trồi lên bên dưới bạn, trơn bóng với dịch nhờn, và '
                          'mở to chiếc miệng góc cạnh rộng hoác. Bạn vùng vẫy dữ dội, và xé toạc các mô phủ đầy rêu tụ '
                          'quanh các xúc tu đang giữ bạn. Một chuyển động bất ngờ của một bông hoa màu bạc làm chuyển '
                          'hướng sự chú ý của sinh vật ra khỏi bạn, và nó thả bạn xuống để đuổi theo con mồi mới của '
                          'nó. Bạn nhảy bật trở lại bờ biển và ngã gục trong cơn ngất xỉu bên vệ đường.'},
 '10591': {'name': 'Khảo Sát Thực Vật',
           'text': '<b>Objective</b> – Vào cuối vòng chơi, các điều tra viên tại địa điểm North Shore có thể cùng nhau '
                   'chi trả số lượng manh mối cần thiết, theo nhóm, để advance. <i>(Xem sơ đồ Sắp Đặt Địa Điểm ở trang '
                   '28 của campaign guide cho địa điểm North Shore.)</i>',
           'flavor': 'Đầm lầy được cho là nguồn gốc của mẫu vật đã thu hút Dr. Marquez đến hòn đảo ngay từ đầu. Bạn có '
                     'rất nhiều việc phải làm.',
           'back_name': 'Gò Đất Khôn Ngoan',
           'back_text': 'Spawn kẻ địch Chelydran Hybrid đang để riêng tại địa điểm North Shore. Chọn một địa điểm liền '
                        'kề với địa điểm của Chelydran Hybrid và spawn 1 trong những kẻ địch Grasping Tendril đang để '
                        'riêng tại địa điểm đó.\n'
                        'Xáo trộn mỗi kẻ địch Grasping Tendril đang để riêng khác vào chồng bài encounter cùng với '
                        'chồng bài bỏ.',
           'back_flavor': 'Bạn đến một cái ao tròn tĩnh lặng ở bờ đông bắc của đầm lầy. Trên đỉnh một gò hoa dại là '
                          'một bông hoa chứa ancaloit màu bạc rất giống với mẫu vật đã thu hút Dr. Marquez đến Hemlock '
                          'Isle. Khi bạn đến gần, bông hoa phồng lên giải phóng một đám bào tử, rồi khép lại. Mùi của '
                          'các bào tử rất dễ chịu, gần giống như đinh hương, nhưng càng đọng lại lâu thì càng trở nên '
                          'đắng ngắt. Đột nhiên gò hoa chuyển động. Một cái đầu bò sát lớn nhô lên khỏi mặt nước và '
                          'nhìn bạn bằng đôi mắt thông minh trước khi bơi nhanh đi.'},
 '10592': {'name': 'Phát Hiện Của Cả Cuộc Đời',
           'text': '[fast] Các điều tra viên tại một địa điểm duy nhất liền kề với địa điểm của Chelydran Hybrid chi '
                   'trả 1 [per_investigator] manh mối, theo nhóm: Trong phần còn lại của vòng chơi, thay đổi địa điểm '
                   'tuần tra (patrol location) của Chelydran Hybrid sang địa điểm đó.\n'
                   '<b>Forced</b> – Vào cuối giai đoạn kẻ địch: Chelydran Hybrid nhận 1 damage cho mỗi kẻ địch '
                   '[[Abomination]] ready tại địa điểm của nó.\n'
                   '<b>Objective</b> – Vào cuối vòng chơi, nếu Chelydran Hybrid đang ở Địa Điểm Xuất Phát (Starting '
                   'Location), ngay lập tức advance.',
           'flavor': 'Sinh vật lớn giống rùa có hoa đang di chuyển. Có lẽ bạn có thể dồn nó đến nơi an toàn.',
           'back_name': 'Giải Phẫu Kỳ Lạ',
           'back_text': '<blockquote><i>Bạn dồn sinh vật bò sát vào một vũng nước lấp lánh, nơi nó chìm vào bùn, rõ '
                        'ràng đã kiệt sức. Khi nó bắt đầu nhai một mớ hoa rối rắm, bạn phác thảo vài nét và ghi chép '
                        'về chiếc mai mọc mầm của sinh vật này. Bông hoa ancaloit trên lưng nó dường như đập phập '
                        'phồng. Rút ra một chiếc kéo tỉa, bạn chuẩn bị lấy một mẫu vật.</i></blockquote>\n'
                        '<hr>Nếu là <b>Ngày 1</b>, hãy đọc phần sau. Nếu không, <b>(→R1)</b>.\n'
                        '<blockquote><i>"Dừng lại!" Dr. Marquez hét lên. "Bông hoa đó là ký sinh. Giờ nó là một phần '
                        'cơ thể của sinh vật này. Không thể biết nó đã cắm rễ sâu đến mức nào." Bà chỉ vào thân cây mờ '
                        'đục dày cộm của bông hoa: chất lỏng màu trắng nhờn dính bơm qua nó như một động mạch. "Nếu '
                        'bông hoa chết, vật chủ của nó cũng sẽ chết theo."</i></blockquote>\n'
                        '<b>(→R2)</b> <i>(trang 30)</i>.',
           'back_flavor': ''}}
