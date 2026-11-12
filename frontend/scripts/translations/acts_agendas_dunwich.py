"""Translations for The Dunwich Legacy act and agenda cards."""
from typing import Dict, Any

TRANSLATIONS_DUNWICH_ACTS_AGENDAS: Dict[str, Dict[str, Any]] = {'02042': {'name': 'Những Dãy Hành Lang Tĩnh Lặng',
           'text': '',
           'flavor': 'Bạn đã đến khuôn viên Đại học Miskatonic để tìm kiếm Giáo sư Warren Rice. Các lớp học đã kết '
                     'thúc, và một sự im lặng kỳ bí bao trùm không khí phía trên sân trường.',
           'back_name': 'Có Thứ Gì Đó Cựa Mình',
           'back_text': 'Mỗi điều tra viên có từ 5 lá bài trở lên trong chồng bài bỏ của mình chịu 1 horror. Mỗi điều '
                        'tra viên có từ 10 lá bài trở lên trong chồng bài bỏ của mình chịu 2 horror thay vào đó.\n'
                        'Nếu người chơi đã hoàn thành The House Always Wins, advance trực tiếp sang agenda 2b. Nếu '
                        'Extracurricular Activity là kịch bản đầu tiên trong chiến dịch, advance sang agenda 2a.',
           'back_flavor': 'Trường đại học im ắng như chết. Những bóng đen cuộn quanh chân bạn khi bạn bước đi, và bạn '
                          'thề rằng có thứ gì đó đang bám theo từng bước chân của bạn. Đó chỉ là do bạn tưởng tượng? '
                          'Hay thực sự có ai đó - hoặc thứ gì đó - đang rình rập bạn?'},
 '02043': {'name': 'Nửa Đêm Thanh Vắng',
           'text': 'Kích thước bàn tay tối đa của mỗi điều tra viên bị giảm đi 3 trong khi kiểm tra kích thước bàn tay '
                   'của mình trong giai đoạn upkeep.',
           'flavor': 'Sự biến mất của Giáo sư Rice không phải là điều bất thường duy nhất tại trường đại học. Bạn '
                     'không chắc chắn chính xác điều gì đang diễn ra, nhưng bạn bắt đầu tin rằng Armitage đã đúng khi '
                     'nhờ bạn giúp đỡ.',
           'back_name': 'Một Thí Nghiệm Thất Bại',
           'back_text': 'Nếu địa điểm Dormitories không ở trong màn chơi, đưa nó vào chơi.\n'
                        'Nếu The Experiment đang ở trong màn chơi, di chuyển nó 1 địa điểm về phía Dormitories.\n'
                        'Nếu The Experiment không ở trong màn chơi, spawn nó tại Science Building.',
           'back_flavor': 'Một tiếng thét sợ hãi vang vọng khắp khuôn viên trường, và nhiều sinh viên tháo chạy khỏi '
                          'khu phía đông của trường đại học, nơi có tòa nhà Science. Liệu sự hỗn loạn này có liên quan '
                          'đến sự mất tích của Giáo sư Rice?'},
 '02044': {'name': 'Quái Thú Xổng Chuồng',
           'text': '<b>Forced</b> - Khi agenda này chuẩn bị advance do chạm ngưỡng doom threshold: Thay vào đó, loại '
                   'bỏ toàn bộ doom trong màn chơi và di chuyển The Experiment 1 địa điểm về phía Dormitories.\n'
                   '<b>Objective</b> - Nếu The Experiment tiến vào Dormitories, advance.',
           'flavor': 'Một loại sinh vật hoang dã nào đó đang xổng chuồng. Bất kể nó là gì, dường như nó đang hướng về '
                     'phía khu ký túc xá đại học.',
           'back_name': 'Không Đủ Nhanh',
           'back_text': 'Mỗi điều tra viên ngay lập tức chịu 3 horror. Sau đó, tiến tới <b>(→R4)</b>.',
           'back_flavor': 'Trước khi bạn kịp hành động, bạn nghe thấy tiếng la hét từ phía bắc của khuôn viên trường. '
                          'Bạn bắt đầu tìm đường về phía tiếng la hét, tầm nhìn của bạn tối sầm lại theo từng bước '
                          'chân. Ngay khi sinh vật đó lọt vào tầm mắt, bạn cảm thấy bóng tối bao trùm lấy mình, và một '
                          'lực kéo kéo bạn ra khỏi ý thức. Mọi thứ trở nên đen kịt, và bạn ngất lịm đi.'},
 '02045': {'name': 'Sau Giờ Học',
           'text': '',
           'flavor': 'Giáo sư Rice được nhìn thấy lần cuối cách đây vài giờ bởi một trong những sinh viên của '
                     'Armitage, trong tòa nhà Humanities.',
           'back_name': 'Bác Lao Công Trưởng',
           'back_text': 'Xáo trộn chồng bài encounter bỏ và "Jazz" Mulligan đang để riêng vào chồng bài encounter.',
           'back_flavor': 'Bạn không thể tìm thấy Giáo sư Rice, nhưng một trong những sinh viên bạn nói chuyện đã nhắc '
                          'đến một người đàn ông kỳ lạ bước vào văn phòng của Rice. Thật không may, cánh cửa dẫn vào '
                          'các văn phòng khoa bị khóa vào giờ muộn này. Người sinh viên nói rằng bác lao công trưởng, '
                          '"Jazz", có thể cho bạn vào, nếu bạn có thể tìm thấy ông ấy.'},
 '02046': {'name': 'Tung Tích Của Rice',
           'text': '[action] Chi trả 1 manh mối: Bỏ 5 lá bài trên cùng của chồng bài encounter (10 lá trên cùng thay '
                   'vào đó nếu chỉ có 1 người chơi trong trò chơi).\n'
                   '<b>Forced</b> - Nếu bạn bỏ "Jazz" Mulligan vì bất kỳ lý do gì, giải quyết hiệu ứng revelation của '
                   'ông ấy.\n'
                   '<b>Objective</b> - Khi bạn nắm quyền kiểm soát "Jazz" Mulligan, advance.',
           'flavor': 'Lo lắng cho sự an toàn của Giáo sư Rice, bạn tìm kiếm bác lao công trưởng, người có thể mở cửa '
                     'cho bạn vào những khu vực bị khóa trong khuôn viên trường.',
           'back_name': 'The Experiment Đã Xổng Ra!',
           'back_text': 'Nếu địa điểm Alchemy Labs không ở trong màn chơi, đưa nó vào chơi. Nếu bạn đang ở Agenda 1 '
                        'hoặc 2, spawn The Experiment tại Alchemy Labs.\n'
                        'Nếu bạn đã hoàn thành The House Always Wins, đưa Alchemical Concoction đang để riêng vào chơi '
                        'bên dưới Alchemy Labs. Nếu Extracurricular Activity là kịch bản đầu tiên của chiến dịch, loại '
                        'bỏ Alchemical Concoction đang để riêng khỏi trò chơi thay vào đó.',
           'back_flavor': 'Bạn thuyết phục "Jazz" rằng có điều gì đó kỳ lạ đang diễn ra, và Giáo sư Rice có thể đang '
                          'gặp nguy hiểm. Ông ấy không đủ tin tưởng để giao chìa khóa cho bạn, nhưng đồng ý đi cùng '
                          'bạn.\n'
                          'Đột nhiên, bạn nghe thấy một tiếng đổ vỡ phát ra từ tòa nhà Science, và một sinh viên lao '
                          'về phía bạn. "Cứu với!" cậu kêu lên. "Có một loại động vật nào đó xổng chuồng trong phòng '
                          'thí nghiệm hóa học! Cháu chỉ vừa thoáng nhìn thấy nó, nhưng..." Cậu rùng mình. "Cháu nghĩ '
                          'nó đang hướng đến khu ký túc xá! Các bác phải làm gì đó đi!"'},
 '02047': {'name': 'An Toàn Học Đường',
           'text': '<b>Objective</b> - Tìm và hoàn thành một mục tiêu trên một lá bài encounter khác.',
           'flavor': 'Bạn chỉ có vài khoảnh khắc để phản ứng. Bạn có thể cảnh báo các sinh viên trong khu ký túc xá và '
                     'hộ tống họ đến nơi an toàn, hoặc tiếp tục nhiệm vụ tìm kiếm Giáo sư Rice trong các văn phòng '
                     'khoa. Hoặc, có lẽ bạn có thể cố gắng tiêu diệt con quái thú đang đe dọa khuôn viên trường.',
           'back_name': 'Cái Chết Của Quái Thú',
           'back_text': '<b>(→R3)</b>',
           'back_flavor': 'Sinh vật quái dị phát ra một tiếng thét khủng khiếp khi nó gục ngã trước những vết thương '
                          'và đổ sụp xuống đất. Một mùi hôi thối bốc ra từ cái xác khi da thịt nó bắt đầu sủi bọt và '
                          'sôi lên. Sự nhẹ nhõm của bạn chuyển thành ghê tởm khi cơ thể nó bắt đầu co lại và tan rã. '
                          'Vài phút sau, cái xác gần như bốc hơi hoàn toàn thành một khối dính nhớp, và mùi hôi thối '
                          'biến mất. Bên trong những tàn dư của cơ thể sinh vật, tất cả những gì bạn tìm thấy là một '
                          'bộ xương - cấu trúc xương của một loài chó.'},
 '02063': {'name': 'Clover Club',
           'text': 'Mỗi kẻ địch [[Criminal]] nhận Aloof.\n'
                   '<b>Forced</b> - Nếu một điều tra viên gây damage cho một kẻ địch [[Criminal]]: Ngay lập tức '
                   'advance.',
           'flavor': 'Bạn đã bước vào Sòng bạc Clover Club để tìm kiếm Tiến sĩ Morgan. Câu lạc bộ nhộn nhịp vào giờ '
                     'muộn này, tràn ngập những khách quen muốn thư giãn và uống rượu, hoặc thử vận may lớn. Bạn dường '
                     'như không gặp nhiều nguy hiểm.',
           'back_name': 'Đúng Hướng',
           'back_text': 'Xáo trộn chồng bài encounter bỏ vào chồng bài encounter.\n'
                        'Nếu người chơi đã hoàn thành Extracurricular Activity, advance trực tiếp sang agenda 2b. Nếu '
                        'The House Always Wins là kịch bản đầu tiên trong chiến dịch, advance sang agenda 2a.',
           'back_flavor': 'Những câu hỏi thăm dò của bạn đã thu hút sự chú ý của nhiều người đàn ông - những tên côn '
                          'đồ được thuê, nhìn bề ngoài là biết. "Francis không muốn bị quấy rầy đâu," một tên trong số '
                          'chúng nói. "Chúng tôi khuyên các người nên rời khỏi đây trước khi chúng tôi buộc các người '
                          'phải rời đi."'},
 '02064': {'name': 'Côn Đồ Ngầm',
           'text': '',
           'flavor': 'Hầu hết những khách quen khác dường như không để ý đến những tên xã hội đen và côn đồ đang vây '
                     'quanh bạn. Nhưng bạn nhận ra bản chất thực sự của điều này - bạn sắp bị ăn đòn tơi bời.',
           'back_name': 'Hỗn Loạn Bất Ngờ',
           'back_text': 'Spawn một kẻ địch ngẫu nhiên từ encounter set <em>Hideous Abominations</em> đang để riêng tại '
                        'Clover Club Lounge. Xáo trộn phần còn lại của encounter set đó, encounter set <em>Striking '
                        'Fear</em> đang để riêng, và chồng bài encounter bỏ vào chồng bài encounter.\n'
                        'Di chuyển tất cả điều tra viên và các kẻ địch chưa engaged từ La Bella Luna đến Clover Club '
                        'Lounge. Loại bỏ La Bella Luna khỏi trò chơi.',
           'back_flavor': 'Bạn nghe thấy một tiếng đổ vỡ từ đâu đó bên ngoài và những tiếng thét đau đớn trong phòng '
                          'chờ lounge. Một quái vật kinh hoàng phá tung lối vào câu lạc bộ, nghiền nát cầu thang và '
                          'húc đổ cả dân xã hội đen lẫn khách chơi.'},
 '02065': {'name': 'Hỗn Loạn Tại Clover Club',
           'text': '<b>Forced</b> - Khi giai đoạn kẻ địch bắt đầu: Bỏ mỗi kẻ địch [[Criminal]] ở cùng địa điểm với một '
                   'kẻ địch [[Abomination]].',
           'flavor': 'Giữa cơn hỗn loạn và hoang mang, những quái vật kỳ lạ tấn công tất cả mọi người trong câu lạc '
                     'bộ. Những tiếng la hét vang vọng khắp các hành lang khi máu bắt đầu bắn tung tóe.',
           'back_name': 'Tòa Nhà Sụp Đổ',
           'back_text': '<b>(→R4)</b>',
           'back_flavor': 'Khi những quái vật kỳ lạ tiếp tục tàn phá câu lạc bộ, nền móng của tòa nhà rung chuyển và '
                          'lắc lư dữ dội. Bạn tháo chạy về phía lối thoát hiểm, nhưng bạn bị kẹt trong đống đổ nát sụp '
                          'xuống khi câu lạc bộ bị phá hủy hoàn toàn.'},
 '02066': {'name': 'Vận May Kẻ Mới Chơi',
           'text': '[reaction] Khi bạn tiết lộ một chaos token: Bạn có thể coi token đó như thể nó là bất kỳ token nào '
                   'khác trong túi chaos. Nếu bạn làm vậy, hãy nhớ rằng bạn đã "gian lận" ("cheated"). (Giới hạn cả '
                   'nhóm một lần mỗi vòng.)\n'
                   '<b>Objective</b> - Khi các điều tra viên đã thu thập đủ số lượng manh mối cần thiết, họ phải ngay '
                   'lập tức chi trả chúng và advance.',
           'flavor': 'Bạn cần tìm Tiến sĩ Morgan. Câu lạc bộ đông nghẹt; có lẽ có ai đó biết ông ấy đang ở đâu.',
           'back_name': 'Tay Chơi Lớn',
           'back_text': 'Đưa Darkened Hall đang để riêng vào chơi.\n'
                        'Nếu đang là Agenda 1, bỏ các lá bài từ trên cùng của chồng bài encounter cho đến khi một kẻ '
                        'địch [[Criminal]] bị bỏ, và spawn kẻ địch đó tại Darkened Hall.',
           'back_flavor': 'Sau khi nói chuyện với một số con bạc và nhân viên phục vụ, có vẻ như Tiến sĩ Morgan dạo '
                          'này thắng khá đậm. Thay vì rút tiền thắng cược, ông đã bị thuyết phục cược gấp đôi. Ông '
                          'được nhìn thấy lần cuối khi bước vào hành lang có người canh gác gần phía sau phòng chơi '
                          'bài.'},
 '02067': {'name': 'Trò Chơi Cá Cược',
           'text': '<b>Objective</b> - Chỉ các điều tra viên trong VIP Area mới có thể cùng nhau chi trả số lượng manh '
                   'mối cần thiết, theo nhóm, để advance.',
           'flavor': 'Tiến sĩ Morgan đang ở đâu đó trong khu vực riêng tư của câu lạc bộ, nơi chỉ VIP và các quản lý '
                     'câu lạc bộ mới được phép vào. Nếu bạn muốn tìm thấy ông ấy, bạn sẽ phải lẻn vào hoặc thậm chí '
                     'chiến đấu mở đường vào.',
           'back_name': 'Số Phận Của Tiến Sĩ Morgan',
           'back_text': '<b>Nếu người chơi chưa hoàn thành Extracurricular Activity:</b><blockquote><i>Bạn tìm thấy '
                        'Tiến sĩ Morgan đang đánh bạc trong một trong những phòng VIP... nhưng dường như ông đang chơi '
                        'bài với hai thi thể bất tỉnh, đồng tử của ông giãn ra như đang trong cơn mê. Ông dường như '
                        'không thể ngừng cười, mỉm cười và trò chuyện với những "người chơi" khác.</i></blockquote>Đưa '
                        'Dr. Morgan đang để riêng vào chơi tại VIP Area. Advance sang Act 3a - "All In."\n'
                        '<hr><b>Nếu người chơi đã hoàn thành Extracurricular Activity:</b><blockquote><em>Các phòng '
                        'VIP tràn ngập những thi thể đẫm máu bị xé rách của những khách chơi bất hạnh. Dường như không '
                        'có dấu vết nào của Tiến sĩ Morgan. Bạn nghe thấy tiếng la hét và tiếng súng nổ từ khu vực '
                        'chính của câu lạc bộ.</em></blockquote>Đưa Peter Clover đang để riêng vào chơi tại Clover '
                        'Club Bar. Tìm kiếm trong chồng bài encounter (hoặc ngoài màn chơi) một kẻ địch '
                        '[[Abomination]], và spawn nó tại Clover Club Bar. Advance sang Act 3a - "Fold."',
           'back_flavor': ''},
 '02068': {'name': 'Tất Tay',
           'text': 'Trong khi Dr. Morgan không bị kiểm soát bởi một người chơi, ông nhận "[action]: <b>Parley.</b> '
                   'Kiểm tra [willpower] (3) để lay Tiến sĩ Morgan tỉnh khỏi cơn mê muội của ông. Nếu thành công, đặt '
                   '1 manh mối từ ngân hàng token lên ông. Nếu có 1 [per_investigator] manh mối trên Dr. Morgan, nắm '
                   'quyền kiểm soát ông."\n'
                   '<b>Objective</b> - Nếu mỗi điều tra viên chưa bị đánh bại đã resign, advance.',
           'flavor': 'Có hay không có Tiến sĩ Morgan, bạn cũng phải thoát khỏi nơi này. Nhanh lên.',
           'back_name': 'An Toàn... Hiện Tại Là Vậy',
           'back_text': '- Nếu một điều tra viên resign với Dr. Francis Morgan dưới quyền kiểm soát của mình, '
                        '<b>(→R2)</b>\n'
                        '- Nếu không, <b>(→R1)</b>',
           'back_flavor': 'Bạn thoát khỏi câu lạc bộ, cố gắng hết sức để trông kín đáo khi vài chiếc xe hơi tấp vào '
                          'gần đường. Một số người đàn ông và phụ nữ mặt lạnh như tiền bước ra, chạy về phía lối vào '
                          'nhà hàng để kiểm soát tình hình. Một người trong số họ nhìn chằm chằm vào bạn, tay đặt trên '
                          'báng khẩu súng lục .38 của hắn, nhưng may mắn thay hắn quay sự chú ý trở lại phần còn lại '
                          'của nhóm mình và theo họ vào câu lạc bộ. Bạn thở phào nhẹ nhõm...'},
 '02069': {'name': 'Bỏ Bài',
           'text': 'Trong khi Peter Clover không bị kiểm soát bởi một người chơi, ông nhận "[action]: <b>Parley.</b> '
                   'Kiểm tra [willpower] (3) để thuyết phục Peter đi theo bạn. Nếu thành công, đặt 1 manh mối từ ngân '
                   'hàng token lên ông. Nếu có 1 [per_investigator] manh mối trên Peter Clover, nắm quyền kiểm soát '
                   'ông."\n'
                   '<b>Objective</b> - Nếu mỗi điều tra viên chưa bị đánh bại đã resign, advance.',
           'flavor': '"Miễn phí đồ uống cho bất kỳ ai đưa tôi biến khỏi nơi quỷ quái này!" Một người đàn ông hét lên '
                     'từ quầy bar.',
           'back_name': 'Thoát Khỏi Câu Lạc Bộ',
           'back_text': '- Nếu một điều tra viên resign với Peter Clover dưới quyền kiểm soát của mình, <b>(→R3)</b>\n'
                        '- Nếu không, <b>(→R1)</b>',
           'back_flavor': 'Bạn tìm đường hướng về những con phố trơn trượt vì mưa của Arkham.'},
 '02119': {'name': 'Khu Vực Hạn Chế',
           'text': '<b>Forced</b> - Khi Hunting Horror tiến vào chơi: Gắn bản sao Shadow-spawned đang để riêng vào nó, '
                   'hoặc thêm 1 tài nguyên vào Shadow-spawned nếu nó đã được gắn.',
           'flavor': 'Tiến sĩ Armitage đã giao bản dịch tiếng Latinh của cuốn The Necronomicon của trường đại học cho '
                     'cộng sự của mình, Harold Walsted, người phụ trách Bảo tàng Đại học Miskatonic. Lo ngại rằng ai '
                     'đó vẫn có thể đang truy lùng cuốn sách, bạn đã đến bảo tàng để thu hồi nó.',
           'back_name': 'Sinh Vật Của Hư Không',
           'back_text': 'Nếu Hunting Horror đang ở trong màn chơi, thêm 1 doom vào nó.\n'
                        'Nếu Hunting Horror không ở trong màn chơi, tìm kiếm trong chồng bài encounter, chồng bài bỏ, '
                        'và hư không (the void) Hunting Horror và spawn nó tại Museum Halls, nếu có thể. Xáo trộn '
                        'chồng bài encounter bỏ vào chồng bài encounter.',
           'back_flavor': 'Từ bóng tối của những dãy hành lang bảo tàng, một sinh vật khủng khiếp trườn ra, dài ngoằng '
                          'và uốn lượn như rắn, được đẩy đi bởi đôi cánh da đen kịt.'},
 '02120': {'name': 'Bóng Tối Sâu Thẳm Hơn',
           'text': '<b>Forced</b> - Khi Hunting Horror tiến vào chơi: Gắn bản sao Shadow-spawned đang để riêng vào nó, '
                   'hoặc thêm 1 tài nguyên vào Shadow-spawned nếu nó đã được gắn.',
           'flavor': 'Những bóng đen trong bảo tàng lớn dần và trở nên tăm tối hơn. Khi những cái bóng dài ra và dịch '
                     'chuyển, chúng bắt đầu gợi lên thân hình gân guốc của một sinh vật kỳ dị đang lao vút ở rìa nhận '
                     'thức của bạn...',
           'back_name': 'Bị Săn Đuổi Ráo Riết',
           'back_text': 'Nếu Hunting Horror đang ở trong màn chơi, thêm 1 doom vào nó.\n'
                        'Nếu Hunting Horror không ở trong màn chơi, tìm kiếm trong chồng bài encounter, chồng bài bỏ, '
                        'và hư không (the void) Hunting Horror và spawn nó tại Museum Halls, nếu có thể. Xáo trộn '
                        'chồng bài encounter bỏ vào chồng bài encounter.',
           'back_flavor': 'Sinh vật không hề buông tha, truy đuổi bạn khắp bảo tàng.'},
 '02121': {'name': 'Trong Mọi Góc Khuất',
           'text': '<b>Forced</b> - Khi Hunting Horror tiến vào chơi: Gắn bản sao Shadow-spawned đang để riêng vào nó, '
                   'hoặc thêm 1 tài nguyên vào Shadow-spawned nếu nó đã được gắn.',
           'flavor': 'Sinh vật trong bảo tàng ngày càng lớn hơn và đáng sợ hơn theo từng khoảnh khắc trôi qua. Cơ thể '
                     'của nó trườn từ bóng tối này sang bóng tối khác, mọi ngóc ngách của mọi căn phòng đều là nơi ẩn '
                     'náu tiềm tàng của con quái thú ghê tởm.',
           'back_name': 'Bị Đuổi Ra Ngoài',
           'back_text': 'Mỗi điều tra viên chưa resign bị đánh bại và chịu 1 tổn thương thể chất.',
           'back_flavor': 'Không có cách nào đánh bại sinh vật trong bảo tàng, bạn tháo chạy. Trong mọi góc khuất của '
                          'mỗi hành lang, thân thể trườn bò của con quái vật rắn có thể được nhìn thấy, những dãy hành '
                          'lang bảo tàng ngày càng tối tăm hơn với sự hiện diện của sinh vật này. Khi bạn đến lối vào, '
                          'nó chặn cửa và tấn công bạn bằng những chiếc răng nanh khủng khiếp của nó. Bạn hầu như chỉ '
                          'vừa đủ thoát khỏi tòa nhà để giữ lấy mạng sống, mặc dù ảnh hưởng từ nọc độc của sinh vật sẽ '
                          'để lại vết sẹo mãi mãi.'},
 '02122': {'name': 'Tìm Đường Vào Trong',
           'text': '',
           'flavor': 'Thật không may, lối vào Bảo tàng được khóa chặt vào giờ muộn này. Một nhân viên bảo vệ có thể '
                     'nhìn thấy qua cửa sổ phía trước của tòa nhà, hoàn toàn không để ý đến xung quanh. Có lẽ bạn có '
                     'thể tìm cách thu hút sự chú ý của anh ta và thuyết phục anh ta cho bạn vào.',
           'back_name': 'Bước Vào Trong',
           'back_text': '<b>Nếu bạn đã chi trả manh mối để advance:\n'
                        '</b><blockquote><i>Bạn tìm thấy cửa sổ gần người bảo vệ nhất và gõ đủ to để thu hút sự chú ý '
                        'của anh ta. Anh ta giật mình nhảy dựng lên, rồi mở hé cửa sổ. "Các người muốn gì?" anh ta rụt '
                        'rè hỏi. Bạn giải thích tình hình cho anh ta và nói với anh ta rằng anh ta đang gặp nguy hiểm '
                        'nghiêm trọng. Anh ta cẩn thận mở cửa trước của Bảo tàng, lắc đầu. "Đáng lẽ hôm nay tôi thậm '
                        'chí còn không phải làm việc ở đây..."</i></blockquote>Chọn một điều tra viên để nắm quyền '
                        'kiểm soát asset Adam Lynch đang để riêng. Lật mở Museum Halls. Advance sang Act 2a - "Night '
                        'at the Museum."\n'
                        '<hr><b>Nếu bạn đã thực hiện thành công khả năng [action] trên Museum Halls để advance:\n'
                        '</b><blockquote><i>Với sức mạnh phi thường, bạn phá tung cánh cửa vào Bảo tàng, gây ra tiếng '
                        'động đáng kể khi làm vậy. Nhân viên bảo vệ nhìn thấy bạn bước vào, kêu lên vì sợ hãi, và lao '
                        'về phía sau của bảo tàng.</i></blockquote>Cánh cửa dẫn vào Museum Halls đã bị phá vỡ. Lật mở '
                        'Museum Halls. Advance sang Act 2a - "Breaking and Entering."',
           'back_flavor': ''},
 '02123': {'name': 'Một Đêm Tại Bảo Tàng',
           'text': '<b>Objective</b> - Nếu một điều tra viên tiến vào Exhibit Hall (<i>Restricted Hall</i>), advance.',
           'flavor': 'Cuốn Necronomicon đang được lưu giữ trong một Phòng Hạn Chế Restricted Hall ở đâu đó trong bảo '
                     'tàng. Adam hầu như không biết đường đi lối lại, và giật mình trước mỗi tiếng cọt kẹt của tòa nhà '
                     'cũ. "Tôi mới bắt đầu làm việc ở đây tuần trước," anh giải thích. "Các bạn bảo có rắc rối gì đang '
                     'xảy ra cơ?" Bạn không nỡ kể cho anh nghe toàn bộ câu chuyện.',
           'back_name': 'Số Phận Của Người Quản Lý',
           'back_text': 'Tìm kiếm trong chồng bài encounter, chồng bài bỏ, hư không (the void), và tất cả các khu vực '
                        'chơi Hunting Horror, và đặt nó tại Exhibit Hall (<i>Restricted Hall</i>), ready.\n'
                        'Advance sang Act 3a.',
           'back_flavor': 'Khi bạn bước vào phòng hạn chế, bạn thấy người quản lý bảo tàng đang nằm trong một vũng '
                          'máu, ruột gan ông bị văng tung tóe trong một cảnh tượng kỳ dị. Bụng bạn cồn cào và bạn phải '
                          'cố kìm nén cơn buồn nôn. Bất kể thứ gì đã làm chuyện này, nó vẫn còn ở gần đây...'},
 '02124': {'name': 'Đột Nhập Trái Phép',
           'text': '<b>Objective</b> - Nếu một điều tra viên tiến vào Exhibit Hall (<i>Restricted Hall</i>), advance.',
           'flavor': 'Cuốn Necronomicon đang được lưu giữ trong một Phòng Hạn Chế Restricted Hall ở đâu đó trong bảo '
                     'tàng.',
           'back_name': 'Số Phận Của Người Bảo Vệ',
           'back_text': 'Chọn một điều tra viên để nắm quyền kiểm soát asset Harold Walsted đang để riêng.\n'
                        'Tìm kiếm trong chồng bài encounter, chồng bài bỏ, hư không (the void), và tất cả các khu vực '
                        'chơi Hunting Horror, và đặt nó tại Exhibit Hall (<i>Restricted Hall</i>), ready.\n'
                        'Advance sang Act 3a.',
           'back_flavor': 'Khi bạn bước vào Phòng Hạn Chế, bạn thấy người quản lý bảo tàng đang nắm chặt một bức tượng '
                          'trang trí như thể nó là một chiếc gậy, bộ com-lê của ông dính đầy máu, vẻ mặt hoảng loạn. '
                          'Người bảo vệ bạn nhìn thấy trước đó nằm trong một vũng máu gần đó, ruột gan anh ta văng '
                          'tung tóe trong một cảnh tượng ghê rợn. Bụng bạn quặn thắt và bạn phải cố kìm nén cơn buồn '
                          'nôn. "Tôi đã cố ngăn nó lại, nhưng..." người quản lý nói nhỏ, giọng run rẩy. Bất kể thứ gì '
                          'đã làm chuyện này, nó vẫn còn ở gần đây...'},
 '02125': {'name': 'Tìm Kiếm Cổ Thư',
           'text': '<b>Objective</b> - Nếu không còn manh mối nào trong Exhibit Hall <i>(Restricted Hall)</i>, '
                   'advance.',
           'flavor': 'Ở đâu đó trong khu vực này là bản dịch tiếng Latinh của cuốn Necronomicon do Olaus Wormius thực '
                     'hiện. Bạn phải tìm thấy nó và trốn thoát trong khi còn có thể!',
           'back_name': 'The Necronomicon',
           'back_text': 'Các điều tra viên phải quyết định (chọn một):\n'
                        '- Nó quá nguy hiểm để giữ lại. Chúng ta phải phá hủy nó. <b>(→R1)</b>\n'
                        '- Nó quá giá trị để phá hủy. Chúng ta phải giữ nó an toàn. <b>(→R2)</b>',
           'back_flavor': 'Cuối cùng, bạn cũng tìm thấy chiếc hộp có khóa chứa cuốn Necronomicon.\n'
                          'Cuốn sách cổ đồ sộ, dài hơn tám trăm trang, chứa đầy đủ các hình ảnh rùng rợn, công thức, '
                          'bùa chú, lời tiên tri và mô tả về những sinh vật từ bên ngoài ngưỡng cửa không gian.\n'
                          'Không còn nghi ngờ gì nữa, đó là một cuốn sách nguy hiểm... Nhưng những bí mật của nó có '
                          'thể rất hữu ích.'},
 '02160': {'name': 'Vết Rách Trong Thực Tại',
           'text': '',
           'flavor': 'Khi chuyến tàu đến Dunwich dừng lại một cách đột ngột rung chuyển, bạn nhìn ra ngoài cửa sổ phía '
                     'sau và thấy một vết rách khổng lồ trên bầu trời, như một vết rách trên một mảnh vải. Vài toa tàu '
                     'phía sau cùng bị kéo giật ngược trở lại, và có một tiếng nghiến kim loại khủng khiếp khi chúng '
                     'bị tách rời. Các toa tàu lật nhào lên phía trên và tiến vào vết nứt rạn trên bầu trời. Những '
                     'hành khách gần đó đang hoảng loạn, những người khác đang co ro trên ghế ngồi của mình, và một cụ '
                     'ông đã ngất lịm đi vì sợ hãi.',
           'back_name': 'Tiếp Tục Di Chuyển!',
           'back_text': 'Loại bỏ địa điểm ngoài cùng bên trái khỏi trò chơi (hoặc đặt nó vào khu vực trưng bày thành '
                        'tích nếu nó có Victory X và không có manh mối nào trên đó). Mỗi điều tra viên tại địa điểm đó '
                        'bị đánh bại. Mỗi kẻ địch và asset tại địa điểm đó bị bỏ.\n'
                        'Bỏ tất cả các manh mối do các điều tra viên kiểm soát.',
           'back_flavor': 'Toa sau cùng của đoàn tàu tách rời ra khi bị kéo ngược trở lại. Trước sự kinh hoàng của '
                          'bạn, nó bay bổng lên khỏi đường ray và bị cánh cổng phía trên bạn nuốt chửng.'},
 '02161': {'name': 'Cái Miệng Rộng Ra',
           'text': '',
           'flavor': 'Vết rách ngày càng lớn hơn, và bạn có thể cảm thấy toa sau cùng của đoàn tàu đang rung lắc khi '
                     'nó bị kéo ngược trở lại. Tình hình đe dọa bùng phát thành hỗn loạn khi nhiều hành khách nhận ra '
                     'mối nguy hiểm mà họ đang gặp phải. Một số hành khách đang tìm chỗ trốn, trong khi những người '
                     'khác đang chạy tán loạn khắp các khoang trong nỗi khiếp sợ.',
           'back_name': 'Đừng Dừng Lại!',
           'back_text': 'Loại bỏ địa điểm ngoài cùng bên trái khỏi trò chơi (hoặc đặt nó vào khu vực trưng bày thành '
                        'tích nếu nó có Victory X và không có manh mối nào trên đó). Mỗi điều tra viên tại địa điểm đó '
                        'bị đánh bại. Mỗi kẻ địch và asset tại địa điểm đó bị bỏ.\n'
                        'Bỏ tất cả các manh mối do các điều tra viên kiểm soát.',
           'back_flavor': 'Toa tàu tiếp theo bị xé toạc về phía sau với một lực dữ dội. Một người đàn ông trung niên '
                          'bám vào bằng đầu ngón tay khi toa tàu bay không hề bị cản trở về phía vết nứt. Chỉ trong '
                          'chốc lát, toa tàu bị nuốt chửng hoàn toàn, và người đàn ông buông tay thay vì bị kéo vào '
                          'cõi hư không. Ông bắt đầu rơi xuống, nhưng bị lực hút của vết nứt tóm lấy và cuốn vào bên '
                          'trong dù thế nào đi nữa.'},
 '02162': {'name': 'Lăn Ngược Trở Lại',
           'text': '',
           'flavor': 'Lực kéo của vết nứt trên bầu trời dường như mạnh hơn, và toàn bộ đoàn tàu bắt đầu lăn ngược trở '
                     'lại dọc theo đường ray. Những toa sau cùng của đoàn tàu bắt đầu rung bần bật, lực hút của vết '
                     'nứt đe dọa tách rời chúng. Bạn phải thoát ra khỏi những toa tàu này nhanh nhất có thể!',
           'back_name': 'Nó Đang Nhanh Hơn!',
           'back_text': 'Loại bỏ từng địa điểm trong số hai địa điểm ngoài cùng bên trái khỏi trò chơi (hoặc đặt nó '
                        'vào khu vực trưng bày thành tích nếu một trong hai có Victory X và không có manh mối nào trên '
                        'đó). Mỗi điều tra viên tại những địa điểm đó bị đánh bại. Mỗi kẻ địch và asset tại những địa '
                        'điểm đó bị bỏ.\n'
                        'Bỏ tất cả các manh mối do các điều tra viên kiểm soát.',
           'back_flavor': 'Hai toa tàu gần cánh cổng nhất bị cắt đứt khỏi phần còn lại của đoàn tàu bởi một luồng hơi '
                          'nước nóng không thể tưởng tượng nổi, thứ cắt xuyên qua kim loại như dao cắt qua bơ. Các toa '
                          'tàu bị hút lên trên và bay vào cánh cổng. Thứ gì đó phía trên đoàn tàu phát ra một tiếng '
                          'rít khủng khiếp, mặc dù đối với tai bạn, nó giống như âm thanh the thé của một ống dẫn hơi '
                          'bị vỡ.'},
 '02163': {'name': 'Bị Cuốn Vào',
           'text': '',
           'flavor': 'Cánh cổng kêu lách tách đầy uy lực khi sức mạnh của nó tăng lên. Đất và đá từ rìa cây cầu phía '
                     'sau bạn bị xé toạc khỏi mặt đất và cây cối bị bật rễ, bị cuốn vào cánh cổng. Một hành khách trẻ '
                     'tuổi đập vỡ cửa sổ toa tàu của bạn và hét lên: "Chúng ta phải biến khỏi đây thôi!" Cậu nhảy ra '
                     'khỏi cửa sổ, nhưng trước khi chạm xuống dòng sông bên dưới, cậu bị quắp trong móng vuốt của một '
                     'sinh vật bay nhanh, và bị mang đi khuất tầm mắt. Một vệt hơi nước để lại sau đường bay của sinh '
                     'vật.',
           'back_name': 'Không Nơi Nào An Toàn',
           'back_text': 'Loại bỏ từng địa điểm trong số hai địa điểm ngoài cùng bên trái khỏi trò chơi (hoặc đặt nó '
                        'vào khu vực trưng bày thành tích nếu một trong hai có Victory X và không có manh mối nào trên '
                        'đó). Mỗi điều tra viên tại những địa điểm đó bị đánh bại. Mỗi kẻ địch và asset tại những địa '
                        'điểm đó bị bỏ.\n'
                        'Bỏ tất cả các manh mối do các điều tra viên kiểm soát.',
           'back_flavor': 'Hai toa tàu sau cùng bắt đầu tan chảy khi chúng chứa đầy hơi nước quá nhiệt. Kim loại bị '
                          'biến dạng, và các hành khách bên trong gào thét trong đau đớn cùng cực. Các toa tàu bị xé '
                          'toạc khỏi đường ray xe lửa cùng với các thanh tà vẹt và những mảng cầu phía sau bạn.'},
 '02164': {'name': 'Hết Thời Gian',
           'text': '',
           'flavor': 'Vết rách trên bầu trời vặn vẹo và rung chuyển, hoàn toàn biến dạng. Kích thước của nó giờ đây '
                     'khổng lồ, hình dạng của nó méo mó và dịch chuyển, như thể nó sắp sửa nổ tung.',
           'back_name': 'Bị Hút Vào Trong',
           'back_text': 'Mỗi điều tra viên ngay lập tức bị đánh bại và chịu 1 tổn thương tinh thần. <b>(&rarr;R2)</b>',
           'back_flavor': 'Toàn bộ cây cầu nứt toác dưới áp lực của cánh cổng, và gãy vụn ra. Thay vì lao xuống sông, '
                          'các toa tàu còn lại bị kéo lên trời, hướng về phía vết rách. Bạn bám chặt lấy để giữ lấy '
                          'mạng sống và gào thét trong kinh hoàng khi bị kéo vào cánh cổng. Sau đó, mọi thứ tối đen '
                          'như mực.'},
 '02165': {'name': 'Chạy Đi!',
           'text': '<b>Objective</b> - Nếu một điều tra viên tiến vào Engine Car, ngay lập tức advance.',
           'flavor': 'Đoàn tàu đã dừng lại trên một cây cầu cao phía trên Sông Miskatonic - bạn có thể sống sót sau cú '
                     'ngã, nhưng bạn không mấy lạc quan về cơ hội của mình. Lựa chọn tốt nhất của bạn là đến toa đầu '
                     'máy nhanh nhất có thể và làm cho đoàn tàu chạy trở lại.',
           'back_name': 'Đôi Cánh Bằng Hơi Nước',
           'back_text': '<b>Điều tra viên tiến vào Engine Car đọc phần sau (thành tiếng):\n'
                        '</b><blockquote><i>Một toa tiếp than chứa đầy than chặn đường bạn đến buồng lái đầu máy. Nuốt '
                        'nỗi sợ hãi vào trong, bạn trèo ra khỏi cửa sổ gần đó và trèo lên nóc đoàn tàu, băng qua toa '
                        'tiếp than. Chuyển động lùi đều đặn của đoàn tàu khiến bạn khó giữ thăng bằng. Khi bạn đến '
                        'gần, một sinh vật có cánh lao vút xuống từ phía trên, cơ thể của nó cấu thành từ hơi nước '
                        'nóng hổi.</i></blockquote>Bạn phải quyết định (chọn một):\n'
                        '- Kiểm tra [agility] (3) để cố gắng né tránh sinh vật. Nếu bạn thất bại, bạn nhảy quá xa và '
                        'chỉ vừa đủ bám vào thành tàu, treo lơ lửng để giữ mạng sống. Mặc dù bạn cố gắng kéo mình lên, '
                        'nhưng trải nghiệm này thật kinh hoàng. Bạn chịu 1 tổn thương tinh thần.\n'
                        '- Kiểm tra [combat] (3) để cố gắng chịu đựng sức nóng tột độ của sinh vật. Nếu bạn thất bại, '
                        'sinh vật bay xuyên qua người bạn và sức nóng thiêu đốt bạn. Bạn chịu 1 tổn thương thể chất.',
           'back_flavor': ''},
 '02166': {'name': 'Khởi Động Đầu Máy Xe Lửa!',
           'text': '<b>Objective</b> - Nếu không có manh mối nào trong Engine Car, ngay lập tức advance.',
           'flavor': 'Bạn đã tìm cách đến được buồng lái đầu máy, nhưng giờ bạn phải khởi động lại động cơ để có thể '
                     'chạy thoát khỏi lực hút của cánh cổng!',
           'back_name': 'Chuyển Động Tiến Lên',
           'back_text': '<b>(&rarr;R1)</b>',
           'back_flavor': 'Đầu máy gầm lên sống lại và bắt đầu chuyển động. Bạn xúc than vào buồng đốt của đầu máy và '
                          'cảm thấy nhẹ nhõm khi thấy đoàn tàu đang di chuyển về phía trước dọc theo đường ray một lần '
                          'nữa.'},
 '02196': {'name': 'Những Vụ Mất Tích Kỳ Lạ',
           'text': '',
           'flavor': 'Sự chào đón bạn ở Dunwich rất lạnh nhạt. Một chuỗi các vụ mất tích đã khiến người dân vốn đã xa '
                     'cách càng thêm căng thẳng. Hầu hết họ nhìn bạn với sự nghi ngờ, và rất ít người sẵn lòng giúp đỡ '
                     'trong cuộc điều tra của bạn. Ai biết được điều gì sẽ xảy ra nếu bạn không sớm tìm ra vị trí của '
                     'những người dân thị trấn mất tích...',
           'back_name': 'Máu Đầu Tiên',
           'back_text': 'Nếu có từ 3 vật hiến tế tiềm năng trở lên, hãy chọn ngẫu nhiên một trong số họ và đặt lá bài '
                        'đó bên dưới chồng bài agenda, mà không nhìn vào nó.',
           'back_flavor': 'Những con chim whippoorwill tụ tập dọc theo những mái nhà kiểu gambrel của Dunwich và bắt '
                          'đầu rít lên vui mừng. Người dân Dunwich tin rằng sự hiện diện của chim whippoorwill báo '
                          'trước cái chết sắp xảy ra của một ai đó. Chúng khao khát cái chết của bạn chăng? Hay nạn '
                          'nhân là một ai khác?'},
 '02197': {'name': 'Cơn Đói Của Cổ Thần',
           'text': '',
           'flavor': 'Khi mặt trời lặn, những người dân thị trấn sợ hãi rút lui vào nhà của họ và khóa chặt cửa. Rõ '
                     'ràng đối với bạn là nhiều người trong số họ biết nhiều hơn những gì họ đang nói ra. Một cảm giác '
                     'buồn nôn quặn thắt trong bụng bạn khi bản chất thực sự của ngôi làng trở nên rõ ràng.',
           'back_name': 'Những Con Phố Bị Bỏ Rơi',
           'back_text': 'Nếu có từ 2 vật hiến tế tiềm năng trở lên, hãy chọn ngẫu nhiên một trong số họ và đặt lá bài '
                        'đó bên dưới chồng bài agenda, mà không nhìn vào nó.',
           'back_flavor': 'Nhiều chim whippoorwill hơn đổ xô về làng Dunwich khi màn đêm buông xuống. Những người dân '
                          'thị trấn khác, vốn nổi tiếng mê tín, vô cùng khiếp sợ trước sự hiện diện của loài chim này. '
                          'Với những cánh cửa xung quanh bạn đã đóng và khóa chặt, bạn thấy mình cô độc trên những con '
                          'đường của Dunwich.'},
 '02198': {'name': 'Nuôi Dưỡng Quái Thú',
           'text': '',
           'flavor': 'Tiếng kêu the the nhịp nhàng của lũ chim whippoorwill tràn ngập màn đêm. Nếu những điều mê tín '
                     'của Dunwich là đúng, bài hát của chúng báo trước cái chết sắp ập đến... Nhưng là dành cho ai?',
           'back_name': 'Máu Trên Bàn Thờ',
           'back_text': 'Mỗi điều tra viên phải ngay lập tức resign.',
           'back_flavor': 'Lũ chim whippoorwill kêu quang quác suốt đêm đồng loạt tản ra, như thể bằng cách nào đó '
                          'chúng hài lòng với diễn biến của các sự kiện.'},
 '02199': {'name': 'Tìm Kiếm Câu Trả Lời',
           'text': '<b>Objective</b> - Khi một điều tra viên tiến vào The Hidden Chamber, advance.',
           'flavor': 'Những vụ mất tích trong thị trấn có thể liên quan đến các sự kiện ở Arkham. Bạn nghi ngờ rằng có '
                     'điều gì đó khủng khiếp đang diễn ra. Bạn phải tìm ra nơi những người dân thị trấn mất tích đang '
                     'bị giam giữ để vạch trần âm mưu này.',
           'back_name': 'Những Gì Đã Bị Che Giấu',
           'back_text': 'Lật mở mỗi địa điểm chưa lật mở.\n'
                        'Di chuyển toàn bộ manh mối trong màn chơi (bao gồm cả những manh mối trên mỗi điều tra viên) '
                        'đến The Hidden Chamber.\n'
                        'Spawn kẻ địch Silas Bishop đang để riêng tại The Hidden Chamber.',
           'back_flavor': 'Bạn tìm được đường vào căn phòng bí mật nơi bạn tin rằng những người mất tích đang bị giam '
                          'giữ, nhưng những điều kinh hoàng đối mặt với bạn ở đó làm xói mòn ranh giới tỉnh táo của '
                          'bạn. Bị trói bằng xiềng xích trong một góc hẻo lánh của căn phòng là một sinh vật không thể '
                          'gọi tên với khuôn mặt của một người đàn ông. Nó thở khò khè và vật lộn để giải thoát chính '
                          'mình khi nhận thấy bạn bước vào. Vô số cái miệng bao phủ cơ thể sinh vật dính đầy máu và '
                          'gân thịt, như thể nó vừa mới ăn gần đây.\n'
                          'Với một tiếng kêu ộp ộp ghê tởm, sinh vật cất lời bằng bảy cái miệng: "Ss... se... eth...?" '
                          'Sau đó nó chồm về phía trước như muốn tóm lấy bạn, và vài sợi xích của nó đứt tung.'},
 '02200': {'name': 'Căn Phòng Của Quái Thú',
           'text': '<b>Objective</b> - Nếu Silas Bishop bị đánh bại: <b>(→R1)\n'
                   'Objective</b> - Nếu không còn manh mối nào trong Hidden Chamber, advance.',
           'flavor': 'Con quái thú đáng thương chồm tới tóm lấy bạn bằng những cánh tay nhớp nháp, nhiều hàm răng của '
                     'nó cắn lại vì đói khát. Giết chết nó sẽ là một sự giải thoát nhân từ. Nhưng có lẽ có điều gì '
                     'khác cần khám phá về sinh vật này…',
           'back_name': 'Trục Xuất Sinh Vật',
           'back_text': 'Nếu The Necronomicon đang ở trong màn chơi: <b>(→R2)\n</b>Nếu không: <b>(→R3)</b>',
           'back_flavor': 'Bất chấp nguy hiểm, bạn dũng cảm đối mặt với sự hiện diện kinh hoàng của con quái thú và '
                          'điều tra thêm trước khi giết nó. Những gì bạn tìm thấy xác nhận những nghi ngờ tồi tệ nhất '
                          'của bạn. Một số đoạn nhật ký do "Seth Bishop" viết mô tả quá trình cho sinh vật ăn chi tiết '
                          'đến rùng mình - lúc đầu là cà chua, sau đó là thú săn nhỏ, rồi đến gia súc, và cuối cùng là '
                          "'vật hiến tế người'. Nhưng phần đáng lo ngại nhất là Seth gọi sinh vật bằng tên: 'Silas'."},
 '02237': {'name': 'Những Sinh Vật Cuồng Nộ',
           'text': '<b>Forced</b> - Vào cuối giai đoạn kẻ địch: Di chuyển mỗi kẻ địch Brood of Yog-Sothoth một lần về '
                   'phía một địa điểm ngẫu nhiên.',
           'flavor': 'Những báo cáo về các thực thể đáng sợ tàn phá khắp vùng nông thôn đã khiến các công dân Dunwich '
                     'hoảng loạn. Tồi tệ hơn, những sinh vật này dường như vô hình trước mắt thường.',
           'back_name': 'Tai Họa Giáng Xuống',
           'back_text': 'Xáo trộn chồng bài encounter bỏ vào chồng bài encounter.\n'
                        'Spawn 1 trong những kẻ địch Brood of Yog-Sothoth đang để riêng tại một địa điểm ngẫu nhiên, '
                        'nếu có thể.',
           'back_flavor': 'Một chiếc xe bán tải cũ dừng lại dọc theo những con đường mòn phong sương của Dunwich. '
                          'Người tài xế - Joe Osborn - gọi bạn qua cửa sổ vỡ phía người lái, động cơ xe vẫn đang nổ '
                          'máy. "Nó ở trang trại nhà Erick!" ông hét lên. "Nó phá tan nát chỗ của họ rồi. Tội nghiệp '
                          'Henry và Martha..."\n'
                          'Bạn hỏi Osborn vị trí trang trại nhà Erick, và nó xác nhận nỗi sợ tồi tệ nhất của bạn. Để '
                          'cuộc tấn công đó diễn ra gần đây, chắc chắn phải có nhiều quái vật hơn đang xổng chuồng.'},
 '02238': {'name': 'Chờ Đợi Thời Cơ',
           'text': '<b>Forced</b> - Vào cuối giai đoạn kẻ địch: Di chuyển mỗi kẻ địch Brood of Yog-Sothoth một lần về '
                   'phía một địa điểm ngẫu nhiên.',
           'flavor': 'Thỉnh thoảng một cơn gió, quét lên từ Cold Spring Glen, sẽ mang theo một chút mùi hôi thối khôn '
                     'tả vào bầu không khí đêm nặng nề... Nhưng nỗi kinh hoàng được mong đợi đã không xuất hiện. Bất '
                     'kể thứ gì ở dưới hẻm núi đều đang chờ đợi thời cơ, và Armitage nói với các đồng nghiệp rằng sẽ '
                     'là tự sát nếu cố tấn công nó trong bóng tối.\n'
                     '— H.P. Lovecraft, "The Dunwich Horror"',
           'back_name': 'Không Nơi Ẩn Nấp',
           'back_text': 'Xáo trộn chồng bài encounter bỏ vào chồng bài encounter.\n'
                        '<hr><b>Nếu có một Brood of Yog-Sothoth đang để riêng, điều tra viên dẫn đầu đọc phần sau '
                        '(thành tiếng):</b>\n'
                        '<blockquote><i>Những đám mây bão ảm đạm cuộn xoáy trên đầu và một tấm màn mưa trút xuống vùng '
                        'nông thôn. Khi cơn mưa rào ngày càng dữ dội, bạn lánh nạn trong một túp lều nửa đổ nát gần '
                        'đó. Có một tia chớp lóe lên, và trong ánh sáng ngắn ngủi, bạn phát hiện ra hình bóng của một '
                        'thứ gì đó to lớn trong mưa. Không báo trước, những cái cây ở xa uốn cong, mặc dù dường như '
                        'không có gì uốn cong chúng. Khoảnh khắc sau, một lực với sức mạnh của một chiếc xe tải đâm '
                        'sầm vào nơi trú ẩn của bạn.</i></blockquote>\n'
                        'Spawn 1 trong những kẻ địch Brood of Yog-Sothoth đang để riêng tại địa điểm của điều tra viên '
                        'dẫn đầu, nếu có thể. Sau đó, mỗi điều tra viên tại địa điểm đó kiểm tra [agility] (4). Con '
                        'Brood of Yog-Sothoth mới spawn thực hiện một cuộc tấn công chống lại mỗi điều tra viên thất '
                        'bại bài kiểm tra kỹ năng này.',
           'back_flavor': ''},
 '02239': {'name': 'Nỗi Kinh Hoàng Được Giải Phóng',
           'text': 'Mỗi kẻ địch [[Abomination]] nhận +1 fight và +1 evade.\n'
                   '<b>Forced</b> - Vào cuối giai đoạn kẻ địch: Di chuyển mỗi kẻ địch Brood of Yog-Sothoth một lần về '
                   'phía một địa điểm ngẫu nhiên.',
           'flavor': 'Không phải trò đùa khi theo dõi một thứ to lớn như một ngôi nhà mà người ta không thể nhìn thấy, '
                     'nhưng lại mang tất cả sự độc ác hiểm độc của một con quỷ.\n'
                     '— H.P. Lovecraft, "The Dunwich Horror"',
           'back_name': 'Lên Những Ngọn Đồi',
           'back_text': '<b>(→R1)</b>',
           'back_flavor': 'Có một tiếng ầm ầm quái dị khắp vùng nông thôn, mặc dù không thể biết nguồn gốc của nó là '
                          'những sinh vật bạn săn lùng hay chính những ngọn núi. Ngay sau đó, bạn tìm thấy nhiều dấu '
                          'vết hơn của những sinh vật dẫn lên phía những ngọn đồi: một con đường rộng ba mươi foot gồm '
                          'những bụi cây bị nghiền nát và cây cối bị gãy như que củi. Kiệt sức vì trận chiến, và màn '
                          'đêm đang buông xuống nhanh chóng, bạn quyết định hướng tới nơi an toàn thay vì lần theo '
                          'những dấu vết địa ngục này.'},
 '02240': {'name': 'Chữ Viết Saracen',
           'text': '<b>Objective</b> - Chỉ các điều tra viên tại Whateley Ruins mới có thể cùng nhau chi trả số lượng '
                   'manh mối cần thiết, theo nhóm, để advance.',
           'flavor': 'Những con quái vật xé toạc hạt Dunwich miễn nhiễm với các vũ khí truyền thống. Chỉ bằng cách đọc '
                     'một câu thần chú đặc biệt, các sinh vật mới có thể bị đánh bại. Trước tiên, bạn phải tìm kiếm '
                     'trong đống đổ nát của ngôi nhà của Wilbur Whateley để tìm các phần cuối cùng của bản văn thế '
                     'giới khác.',
           'back_name': 'Thu Được Công Thức',
           'back_text': '<b>Kiểm tra Campaign Log. Nếu Dr. Armitage sống sót sau The Dunwich '
                        'Legacy:</b><blockquote><i>"Đây rồi!" Armitage thở phào nhẹ nhõm, ghi lại những cụm từ cuối '
                        'cùng của công thức. "Tôi đã dịch xong phần cuối cùng của nó." Ông rùng mình khi đưa cho bạn '
                        'bản văn, những từ ngữ gợi lại ký ức về trận chiến của ông với sinh vật. "Tôi hy vọng đây là '
                        'lần cuối cùng tôi phải đọc nó," ông thừa nhận. "Nhưng nếu chúng ta không làm gì, kết quả cuối '
                        'cùng sẽ tồi tệ hơn rất, rất nhiều."</i></blockquote>Mỗi điều tra viên đưa 1 Esoteric Formula '
                        'đang để riêng vào chơi.\n'
                        '<b>Nếu Dr. Armitage được liệt kê dưới mục "Sacrificed to Yog-Sothoth":</b><blockquote><i>Sử '
                        'dụng thông tin có trong tàn tích của ngôi nhà Whateley, bạn có thể chép lại phần còn lại của '
                        'công thức mà trước đây Dr. Armitage đã sử dụng để tiêu diệt con thú đã quấy phá Dunwich. Tuy '
                        'nhiên, nỗ lực này khiến bạn chậm mất vài giờ.</i></blockquote>Mỗi điều tra viên đưa 1 '
                        'Esoteric Formula đang để riêng vào chơi. Đặt 1 doom lên agenda hiện tại.',
           'back_flavor': ''},
 '02241': {'name': 'Chúng Phải Bị Tiêu Diệt!',
           'text': '<b>Objective</b> - Đánh bại càng nhiều kẻ địch Brood of Yog-Sothoth càng tốt. Nếu không còn bản '
                   'sao nào của Brood of Yog-Sothoth trong màn chơi hoặc đang để riêng, advance.',
           'flavor': 'Với công thức trong tay, cuối cùng bạn cũng có phương tiện để tiêu diệt những sinh vật đang tàn '
                     'phá Dunwich... nhưng chỉ khi bạn có thể sống sót đủ lâu.',
           'back_name': 'Bầy Con Đã Chấm Dứt',
           'back_text': '<b>(→R2)</b>',
           'back_flavor': 'Khi bạn hoàn thành câu thần chú, sinh vật ghê tởm kêu lên bằng một giọng khàn khàn, phi '
                          'nhân tính. Nó ầm ầm và răng rắc, những âm tiết trong tiếng kêu ộp ộp của nó khác xa tiếng '
                          'Anh. Khi tiếng kêu của nó dứt, sinh vật tự co rút lại, và rồi, không có chút cảnh báo nào, '
                          'nó biến mất. Tất cả những gì còn lại là một mùi hôi thối và một vết ố kinh tởm làm hỏng '
                          'thảm thực vật nơi con quái thú từng đứng.'},
 '02275': {'name': 'Hiệu Triệu Các Cổ Thần',
           'text': '',
           'flavor': 'Khi bạn đến gần Sentinel Hill, bạn nghe thấy những nghi thức tiếng Latinh cổ xưa gầm vang khắp '
                     'màn đêm. Thời điểm hành động đã đến. Nếu bạn không thể ngăn chặn những kẻ phù thủy ở Dunwich, ai '
                     'biết được chúng có thể giải phóng những nỗi kinh hoàng nào lên thế giới?',
           'back_name': 'Thế Giới Bị Biến Đổi',
           'back_text': 'Xáo trộn chồng bài encounter bỏ vào chồng bài encounter.',
           'back_flavor': 'Khi bạn khám phá những con đường xung quanh Sentinel Hill, tiếng tụng niệm trên đỉnh đồi '
                          'dâng lên đến cao trào và mang một phẩm chất của thế giới khác, vang vọng qua những hàng cây '
                          'như thể được mang đi bởi những dòng chảy vô hình.\n'
                          'Thế giới bắt đầu thay đổi. Cỏ cây tan biến như đường trong tách trà. Một bầu trời bao la vô '
                          'tận xẻ dọc thực tại bạn thấy trước mắt, và bạn cảm thấy bị lôi cuốn vào đó, kinh hãi và '
                          'kính sợ. Quyền năng bí thuật bị bóp méo và thấm đẫm xung quanh bạn, tạo ra những biến đổi '
                          'kỳ lạ trên mảnh đất.'},
 '02276': {'name': 'Cầu Xin Sức Mạnh',
           'text': '',
           'flavor': 'Các Cổ Thần đã từng hiện hữu, các Cổ Thần đang hiện hữu, và các Cổ Thần sẽ mãi hiện hữu. Không '
                     'phải trong những không gian chúng ta biết, mà là giữa chúng, Họ bước đi thanh thản và nguyên sơ, '
                     'không chiều kích và vô hình trước mắt chúng ta. Yog-Sothoth biết cánh cổng. Yog-Sothoth là cánh '
                     'cổng. Yog-Sothoth là chìa khóa và là người gác cổng. Quá khứ, hiện tại, tương lai, tất cả là một '
                     'trong Yog-Sothoth. Ngài biết nơi các Cổ Thần đã đột phá vào thời xa xưa, và nơi Họ sẽ lại đột '
                     'phá lần nữa. Ngài biết nơi Họ đã giẫm chân lên những cánh đồng của trái đất, và nơi Họ vẫn đang '
                     'giẫm đạp, và tại sao không ai có thể chiêm ngưỡng Họ',
           'back_name': 'Phần Thưởng Cho Sự Phục Vụ',
           'back_text': '<b>(→R2)</b>',
           'back_flavor': 'Tiếng tụng niệm đạt đến đỉnh điểm, và tại đỉnh của Sentinel Hill, một vết rách mở ra trên '
                          'kết cấu của bầu trời, xé toạc các đám mây và cắt xuyên qua chính không khí.\n'
                          'Bạn nhìn thấy một thực thể không thể miêu tả - những khối cầu, mắt, miệng, dịch nhầy - tràn '
                          'ra từ vết nứt. Những kẻ phù thủy gọi tên nó khi hình dạng của nó thấm vào bầu trời, lan '
                          'rộng ra phía trên mặt đất: "Ia! Ia! Yog-Sothoth! Ia! Ia! Yog-Sothoth!"\n'
                          'Trước khi bài tụng niệm hân hoan của chúng có thể tiếp tục, chúng bị khối vật chất đang lớn '
                          'dần bóp nghẹt, và không còn được nghe thấy nữa.\n'
                          'Trước sự kinh hoàng của bạn, sự mở rộng của khối vật chất không hề dừng lại.'},
 '02277': {'name': 'Con Đường Đến Ngọn Đồi',
           'text': '<b>Objective</b> - Khi các điều tra viên đã thu thập đủ số lượng manh mối cần thiết, họ phải ngay '
                   'lập tức chi trả chúng và advance.',
           'flavor': 'Một năng lượng bí thuật rực rỡ lấp đầy không khí với một cơn lạnh buốt tận xương tủy. Năng lượng '
                     'xoáy dọc theo con đường mòn bị nghiền nát trước mặt bạn, và thấm xuống vài con đường khác trước '
                     'khi biến mất.',
           'back_name': 'Một Vật Hiến Tế Đã Thực Hiện',
           'back_text': 'Loại bỏ toàn bộ manh mối khỏi mỗi địa điểm trong màn chơi. Sự hiện diện bí thuật che giấu con '
                        'đường xa hơn lên đồi đã mờ dần. Lật mở Ascending Path.',
           'back_flavor': 'Trong cuộc tìm kiếm qua những con đường mòn trong rừng quanh chân đồi Sentinel Hill, bạn '
                          'bắt gặp một cảnh tượng kinh ngạc. Một đàn cừu nằm chết trên mặt đất trong một bãi đất trống '
                          'hẻo lánh, những xác chết đẫm máu của chúng được xếp theo một mô hình kỳ lạ nhưng cẩn thận. '
                          'Bịt mũi trước mùi hôi thối của cái chết, bạn bước qua những con cừu bị xé xác trên đường '
                          'đến trung tâm của đội hình kỳ quặc.\n'
                          'Ở trung tâm đàn cừu là xác của một người đàn ông. Một viên ngọc trong suốt đã được ấn chặt '
                          'vào trán ông ta, làm lún phần trước của hộp sọ. Đôi mắt ông mở to, khuôn mặt vặn vẹo trong '
                          'một ảo ảnh sợ hãi, như thể đang cầu xin bạn thương xót. Dù biết rõ hơn, bạn vẫn kiểm tra '
                          'mạch đập. Khi bạn chạm vào da người đàn ông, viên ngọc trên trán ông tan biến, và khu rừng '
                          'xung quanh bạn dường như quang đãng trở lại.'},
 '02278': {'name': 'Lên Đồi (bản I)',
           'text': 'Manh mối không thể được đặt lên các địa điểm không phải [[Altered]].\n'
                   '<b>Objective</b> - Khi một điều tra viên tiến vào Sentinel Peak, advance.',
           'flavor': 'Khi bạn leo lên đồi, môi trường xung quanh bạn ngày càng trở nên kỳ lạ và thuộc về thế giới '
                     'khác. Năng lượng bí thuật cảm thấy mạnh hơn nữa ở đây, nổ lách tách trong không khí và bò ran '
                     'trên làn da bạn.',
           'back_name': 'Phá Vỡ Mô Hình',
           'back_text': 'Loại bỏ kẻ địch Seth Bishop đang để riêng khỏi trò chơi.',
           'back_flavor': 'Đến gần đỉnh Sentinel Hill, bạn đối mặt với vài người dân Dunwich. Người đàn ông ở giữa '
                          'vòng tròn của họ tụng niệm bằng tiếng Latinh trong khi những người khác cúi đầu tôn kính. '
                          '"Seth Bishop?" bạn hỏi một cách phỏng đoán. Người đàn ông ở giữa ngước nhìn để đáp lại, xác '
                          'nhận những nghi ngờ của bạn. Bạn van nài người đàn ông dừng sự điên rồ này lại, nhưng ông '
                          'ta không trả lời. Bạn rút ra chiếc mặt dây chuyền chòm sao bằng bạc mà bạn tìm thấy trên '
                          'thi thể của Silas và đưa cho Seth. "Đây là tất cả những gì chúng tôi tìm thấy về em trai '
                          'ông," bạn hét lên át tiếng gió hú. "Đây có phải là số phận ông muốn cho chính mình không? '
                          'Cho tất cả chúng ta?" Bạn ném chiếc mặt dây chuyền xuống đất. Choáng váng trước cảnh tượng '
                          'đó, ông ta lảo đảo lùi lại và vấp ngã trong bài thần chú của mình, mắt mở to. Khi ông ngã '
                          'xuống, bàn thờ phía sau ông nứt toác ra, và một luồng năng lượng tuôn ra từ tảng đá, xoáy '
                          'vào một cánh cổng mở nuốt chửng người đàn ông. Bạn hầu như chỉ vừa kịp ghìm gót chân và bám '
                          'vào một tảng đá gần đó để chống lại lực kéo của cánh cổng.'},
 '02279': {'name': 'Lên Đồi (bản II)',
           'text': 'Manh mối không thể được đặt lên các địa điểm không phải [[Altered]].\n'
                   '<b>Objective</b> - Khi một điều tra viên tiến vào Sentinel Peak, advance.',
           'flavor': 'Khi bạn leo lên đồi, môi trường xung quanh bạn ngày càng trở nên kỳ lạ và thuộc về thế giới '
                     'khác. Năng lượng bí thuật cảm thấy mạnh hơn nữa ở đây, nổ lách tách trong không khí và bò ran '
                     'trên làn da bạn.',
           'back_name': 'Tra Chìa Khóa',
           'back_text': 'Đưa kẻ địch Seth Bishop đang để riêng vào chơi tại Sentinel Peak.',
           'back_flavor': 'Đến gần đỉnh Sentinel Hill, bạn đối mặt với vài người dân Dunwich. Người đàn ông ở giữa '
                          'vòng tròn của họ phát ra một tiếng cười điên dại. Bạn nhận ra người đàn ông - Seth Bishop - '
                          'từ lời miêu tả mà những người dân thị trấn đã cung cấp cho bạn trước đó. Phía sau ông, vài '
                          'người đàn ông và phụ nữ khác cúi đầu tôn kính, tụng niệm bằng tiếng Latinh. "Chúng ta đã '
                          'làm được!" ông cười khanh khách. "Chúng ta đã hoàn thành những gì Lão Whateley và thằng con '
                          'hoang của lão không thể làm được!" Bạn nhìn trong sự ghê tởm khi đôi mắt ông mờ đi và giật '
                          'giật, như thể ông đang đọc thứ gì đó vô hình. "Giờ tôi có thể thấy rồi… cuối cùng tôi cũng '
                          'thấy rồi!" Ông giơ hai tay lên trời và bia đá của bàn thờ phía sau ông nứt toác ra. Một '
                          'luồng năng lượng tuôn ra từ tảng đá, kết tụ thành hình dạng một cánh cổng mở. Seth bám chặt '
                          'vào tảng đá trước mặt để tránh bị hút vào cánh cổng, nhưng vài người khác giật mình và bị '
                          'kéo xuyên qua nó. Bạn hầu như chỉ vừa kịp ghìm gót chân và bám vào một tảng đá gần đó kịp '
                          'lúc để chống lại lực kéo của cánh cổng. Seth đứng dậy, với vẻ mặt đầy tự hào.'},
 '02280': {'name': 'Lên Đồi (bản III)',
           'text': 'Manh mối không thể được đặt lên các địa điểm không phải [[Altered]].\n'
                   '<b>Objective</b> - Khi một điều tra viên tiến vào Sentinel Peak, advance.',
           'flavor': 'Khi bạn leo lên đồi, môi trường xung quanh bạn ngày càng trở nên kỳ lạ và thuộc về thế giới '
                     'khác. Năng lượng bí thuật cảm thấy mạnh hơn nữa ở đây, nổ lách tách trong không khí và bò ran '
                     'trên làn da bạn.',
           'back_name': 'Ý Chí Biến Đổi',
           'back_text': 'Đưa kẻ địch Seth Bishop đang để riêng vào chơi tại Sentinel Peak, với 1 [per_investigator] '
                        'damage trên ông ta.',
           'back_flavor': 'Đến gần đỉnh Sentinel Hill, bạn đối mặt với vài người dân Dunwich. Người đàn ông ở giữa '
                          'vòng tròn của họ đang tuyệt vọng cố gắng hoàn thành một câu thần chú tiếng Latinh. "Nó '
                          'không hiệu nghiệm, Seth!" một người đàn ông khác hét lên. "Chúng ta sẽ làm gì đây?" Người '
                          'đàn ông ở giữa dừng bài tụng và rút ra một con dao thợ đóng giày. "Người cha yêu cầu một '
                          'vật hiến tế bằng máu," ông tuyên bố, và khuôn mặt ông vặn vẹo thành một biểu cảm điên dại. '
                          'Trước khi bạn kịp phản ứng, ông ta rạch cổ tay trái bằng con dao, khuỵu gối xuống trong đau '
                          'đớn cùng cực. Bia đá của bàn thờ phía sau ông nứt toác ra. Một luồng năng lượng tuôn ra từ '
                          'tảng đá, kết tụ thành hình dạng một cánh cổng mở. Seth bám chặt vào tảng đá trước mặt để '
                          'tránh bị hút vào cánh cổng, nhưng vài người khác giật mình và bị kéo xuyên qua nó. Bạn hầu '
                          'như chỉ vừa kịp ghìm gót chân và bám vào một tảng đá gần đó kịp lúc để chống lại lực kéo '
                          'của cánh cổng. Seth đứng dậy, bị thương nhưng còn sống. Một vẻ mặt tự hào lan tỏa khắp '
                          'khuôn mặt đau đớn của ông.'},
 '02281': {'name': 'Cánh Cổng Mở Ra',
           'text': '<b>Objective</b> - Chỉ các điều tra viên tại Sentinel Peak mới có thể cùng nhau chi trả số lượng '
                   'manh mối cần thiết, theo nhóm, để advance.',
           'flavor': 'Từ đống đổ nát của bia đá trên bàn thờ tại đỉnh đồi, một cánh cổng năng lượng sôi sục rực rỡ đã '
                     'xuất hiện. Một lực như bão tố phun trào từ cánh cổng, uốn cong cây cối và kéo các mảnh vỡ vào '
                     'trong đó. Tiếng gào thét của cơn cuồng phong át đi mọi âm thanh khác. Bằng cách nào đó, bạn phải '
                     'tìm ra cách để đóng cánh cổng.',
           'back_name': 'Nhìn Vào Vực Thẳm',
           'back_text': '<b>(→R1)</b>',
           'back_flavor': 'Bạn không biết làm thế nào để đóng cánh cổng đang cuộn xoáy trước mặt mình, và theo từng '
                          'khoảnh khắc trôi qua, lực hút từ bên trong nó ngày càng mạnh mẽ hơn. Bạn lo sợ rằng bất kỳ '
                          'thực thể nào mà những kẻ phù thủy đã triệu hồi từ cõi bên ngoài đang đến gần. Không còn '
                          'thời gian để lãng phí, bạn quay sang cuốn sách mở trên bàn thờ đá, tuyệt vọng tìm kiếm câu '
                          'trả lời.'},
 '02312': {'name': 'Tất Cả Là Một',
           'text': '<b>Forced</b> - Sau khi bạn bị di chuyển đến một địa điểm bởi một hiệu ứng lá bài encounter: Chịu '
                   '1 horror.',
           'flavor': 'Những con đường bằng âm thanh và màu sắc trải dài vô tận về mọi hướng, rải rác những công trình '
                     'kiến trúc bất khả thi, và phủ đầy thảm thực vật kỳ dị của người ngoài hành tinh. Các đường nét '
                     'giữa các vật thể lởm chởm và dịch chuyển, và làn da bạn cảm giác như thể đang bị lộn ngược từ '
                     'trong ra ngoài.',
           'back_name': 'Những Tiếng Vọng Quen Thuộc',
           'back_text': 'Xáo trộn chồng bài encounter bỏ vào chồng bài encounter. Sau đó, bỏ các lá bài từ trên cùng '
                        "cho đến khi một địa điểm bị bỏ. Điều tra viên dẫn đầu giải quyết hiệu ứng 'revelation' của "
                        'địa điểm đó.\n'
                        '<b>Kiểm tra Campaign Log. Nếu các điều tra viên không cứu được các sinh viên, hãy đọc phần '
                        'sau:</b>\n'
                        '"Một sinh vật giống chó khổng lồ, xa lạ trước mắt bạn nhưng lại quen thuộc, xuất hiện trước '
                        'mặt bạn. Sinh vật lao về phía trước, và bạn chuẩn bị chống đỡ nó, nhưng trước sự ngạc nhiên '
                        'của bạn, nó chạy xuyên qua bạn, hướng về một tòa nhà mà vài khoảnh khắc trước không hề ở phía '
                        'sau bạn: Derby Hall từ Đại học Miskatonic. Sinh vật phá tung cửa trước của tòa nhà và bạn '
                        'nghe thấy những tiếng thét hoảng loạn từ bên trong, theo sau là tiếng răng rắc của xương gãy '
                        'và những tiếng kêu đau đớn."\n'
                        'Mỗi điều tra viên chịu 1 horror, bất kể địa điểm của họ.',
           'back_flavor': ''},
 '02313': {'name': 'Quá Khứ, Hiện Tại và Tương Lai',
           'text': '<b>Forced</b> - Sau khi bạn bị di chuyển đến một địa điểm bởi một hiệu ứng lá bài encounter: Chịu '
                   '1 horror.',
           'flavor': 'Khi bạn băng qua cõi giới này, bạn thỉnh thoảng thoáng thấy thực tại - những cảnh tượng từ những '
                     'ký ức cũ, những viễn cảnh gần đây hơn từ vài ngày qua, và đôi khi thậm chí là những sự kiện mà '
                     'bạn không nhớ là đã từng xảy ra…',
           'back_name': 'Cái Giá Của Thất Bại',
           'back_text': 'Xáo trộn chồng bài encounter bỏ vào chồng bài encounter. Sau đó, bỏ các lá bài từ trên cùng '
                        "cho đến khi một địa điểm bị bỏ. Điều tra viên dẫn đầu giải quyết hiệu ứng 'revelation' của "
                        'địa điểm đó.\n'
                        '<b>Kiểm tra Campaign Log. Nếu có ít nhất một cái tên được ghi lại dưới mục "Sacrificed to '
                        'Yog-Sothoth", hãy đọc phần sau:</b>\n'
                        '"Bạn nghe thấy một giọng nói quen thuộc gọi tên bạn, và bạn bước vào một tòa nhà có hình thù '
                        'bất khả thi bằng đá nứt nẻ. "Không… đừng!" giọng nói kêu lên. Bạn lao về phía giọng nói, '
                        'xuống một dãy bậc thang dốc, hẹp. Khi chạm tới đáy, bạn thấy mình đang ở trong căn phòng bí '
                        'mật từ Dunwich. Bị trói bằng xiềng xích, bạn nhìn thấy những người mà bạn đã không cứu được, '
                        'đẫm máu và bị tàn tật. Một sinh vật mang khuôn mặt đàn ông đang ăn từ một xác chết trên mặt '
                        'đất. Đầu của cái xác quay lại đối mặt với bạn, và một cơn đau nhói đâm vào tim bạn."\n'
                        'Mỗi điều tra viên kiểm tra [willpower] (X), trong đó X là số lượng tên được ghi lại dưới mục '
                        '"Sacrificed to Yog-Sothoth". Với mỗi điểm một điều tra viên thất bại, điều tra viên đó chịu 1 '
                        'damage.',
           'back_flavor': ''},
 '02314': {'name': 'Đột Phá Xuyên Qua',
           'text': '<b>Forced</b> - Sau khi bạn bị di chuyển đến một địa điểm bởi một hiệu ứng lá bài encounter: Chịu '
                   '1 horror.',
           'flavor': 'Xuyên suốt chiều không gian biến dạng này, bất kể bạn du hành đến đâu, đều có một hình thù ám '
                     'ảnh ở phía xa. Ban đầu, nó xuất hiện như một chiếc đĩa, giống như một mặt trăng đen với nhiều '
                     'cánh tay ngoe nguẩy. Nhưng khi thời gian trôi qua, bạn có thể nhận ra nó đang ngày càng lớn hơn '
                     'và lớn hơn…',
           'back_name': 'Chìa Khóa và Cánh Cổng',
           'back_text': '<b>Revelation</b> - Spawn kẻ địch Yog-Sothoth đang để riêng tại The Edge of the Universe. Nếu '
                        'The Edge of the Universe không ở trong màn chơi, spawn nó tại Another Dimension thay vào đó. '
                        'Advance sang agenda 4a.',
           'back_flavor': ''},
 '02315': {'name': 'Hồi Kết Của Vạn Vật',
           'text': '<b>Forced</b> - Sau khi bạn bị di chuyển bởi một hiệu ứng lá bài encounter: Chịu 1 horror.\n'
                   '<b>Forced</b> - Nếu Yog-Sothoth bị đánh bại, <b>(→R3)</b>.',
           'flavor': 'Hình thù ở phía xa đập tan các rào cản của chiều không gian này, nhiều cánh tay của nó vươn ra '
                     'bao trùm mọi thứ bạn nhìn thấy. Thân thể của nó như một chất nhầy, phủ đầy mắt và miệng. Bạn cảm '
                     'thấy nhỏ bé tầm thường, như một con bọ, bên cạnh vẻ hùng vĩ đáng sợ của sinh vật.',
           'back_name': 'Yog-Sothoth Tấn Công!',
           'back_text': 'Theo thứ tự lượt chơi, Yog-Sothoth tấn công mỗi điều tra viên trong màn chơi, bất kể địa điểm '
                        'hiện tại của Yog-Sothoth. Sau đó, lật mặt agenda này trở lại mặt "a" của nó.',
           'back_flavor': 'Tìm kiếm vết rạn nứt mà từ đó bạn đã tiến vào chiều không gian này, nỗi kinh hoàng ngoài '
                          'không gian vung đòn dữ dội, nghiền nát toàn bộ các cõi giới trong sự kìm kẹp của nó.'},
 '02316': {'name': 'Ngoài Thế Giới Này',
           'text': '[action]: Bỏ 3 lá bài trên cùng của chồng bài encounter. Chọn một địa điểm bị bỏ bởi hiệu ứng này '
                   "và giải quyết khả năng 'revelation' của nó.",
           'flavor': 'Bằng cách nào đó, bạn phải tìm đường băng qua vùng cảnh quan xa lạ này để tìm điểm giao thoa '
                     'nexus đã được miêu tả trong cuốn sách của Lão Whateley.',
           'back_name': 'Giao Điểm Của Các Chiều Không Gian',
           'back_text': 'Đưa địa điểm The Edge of the Universe đang để riêng vào chơi.',
           'back_flavor': 'Một ánh sáng lung linh ở đằng xa, và bạn tiến về phía nó để điều tra. Ánh sáng mỏng manh '
                          'trôi xa khỏi bạn, lơ lửng qua các cánh cổng kỳ lạ của cõi giới, leo lên những cầu thang '
                          'lượn vòng, và băng qua những rào cản mà bạn không thể vượt qua. Không nản lòng, bạn tiếp '
                          'tục lần theo dấu vết của nó.'},
 '02317': {'name': 'Tiến Vào Cõi Xa Xăm',
           'text': '[action]: Bỏ 3 lá bài trên cùng của chồng bài encounter. Chọn một địa điểm bị bỏ bởi hiệu ứng này '
                   "và giải quyết khả năng 'revelation' của nó.\n"
                   '<b>Objective</b> - Nếu một điều tra viên tiến vào The Edge of the Universe, advance.',
           'flavor': 'Bạn tiếp tục lần theo vệt sáng mỏng manh, mặc dù địa hình hiểm trở khiến nó trở thành một mục '
                     'tiêu khó đuổi theo.',
           'back_name': 'Rìa Của Thế Giới',
           'back_text': '',
           'back_flavor': 'Bạn chạm tới một cõi hư không đen kịt dày đặc đến khó tin, và nhận ra rằng nơi này là nơi '
                          'toàn bộ thực tại - tất cả những gì đang là và tất cả những gì sẽ mãi là - kết thúc. Ở trung '
                          'tâm của nó, bạn nhìn thấy một vết rách nhỏ xíu, lơ lửng ngay ngoài tầm với. Khi bạn nhìn '
                          'qua vết rách, bạn ngạc nhiên khi thấy đỉnh của Sentinel Hill. Bằng cách nào đó, bạn đã đến '
                          'được phía bên kia của vết rách. Bây giờ bạn phải tìm cách đóng nó lại vĩnh viễn.'},
 '02318': {'name': 'Đóng Vết Rách',
           'text': '[action]: Bỏ 3 lá bài trên cùng của chồng bài encounter. Chọn một địa điểm bị bỏ bởi hiệu ứng này '
                   "và giải quyết khả năng 'revelation' của nó.\n"
                   '<b>Objective</b> - Chỉ các điều tra viên tại The Edge of the Universe mới có thể cùng nhau chi trả '
                   'số lượng manh mối cần thiết, theo nhóm, để advance.',
           'flavor': 'Những hòn đá kỳ dị trên mặt đất được khắc một loại ấn phong nào đó. Đến gần chúng khiến một '
                     'giọng nói vang vào tâm trí bạn, nói bằng một thứ ngôn ngữ ngoài hành tinh.',
           'back_name': 'Hàn Gắn Vết Rách',
           'back_text': 'Loại bỏ Edge of the Universe khỏi trò chơi.\n'
                        'Đưa địa điểm Tear Through Time đang để riêng vào chơi.',
           'back_flavor': 'Bạn hoàn toàn kiệt sức, không biết có thể làm gì để đóng vết rách lại. Nó quá xa để chạm '
                          'tới, và không có gì bạn làm tạo ra bất kỳ tác dụng nào. Không có gì ở đây để hướng dẫn bạn '
                          'ngoài những lời lẽ kỳ quái đang thấm vào tâm trí bạn. Ngay lúc đó, bạn nghe thấy một giọng '
                          'nói quen thuộc trong dàn hợp xướng vang vọng, và cảm thấy mình bị thôi thúc phải lặp lại '
                          'nó. "Claude ostium…" Ban đầu bạn thì thầm, những từ ngữ ở ngay đầu lưỡi bạn. Bạn nhắm mắt '
                          'lại để tập trung, và tiếng vang ngày càng lớn hơn. Khi nó kết thúc và bạn mở mắt ra, bạn '
                          'chỉ đối mặt với một vực thẳm đen như mực, và vết rách đã biến mất.'},
 '02319': {'name': 'Tìm Một Con Đường Mới',
           'text': '[action]: Bỏ 3 lá bài trên cùng của chồng bài encounter. Chọn một địa điểm bị bỏ bởi hiệu ứng này '
                   "và giải quyết khả năng 'revelation' của nó.\n"
                   '<b>Objective</b> - Nếu mỗi điều tra viên chưa bị đánh bại đã resign, advance.',
           'flavor': 'Không có con đường rõ ràng nào để thoát khỏi chiều không gian này, bạn tìm kiếm một con đường '
                     'khác.',
           'back_name': 'Thực Tại Vẫy Gọi',
           'back_text': '<b>(→R1)</b>',
           'back_flavor': 'Bạn phát hiện ra một con đường trông có vẻ quen thuộc và đi theo nó. Ngay cả khi nhiệm vụ '
                          'của bạn đã hoàn thành, giờ đây bạn hiểu rằng khi đóng vết rách lại, bạn có thể không bao '
                          'giờ trở về nhà được nữa. Nỗi sợ bị lạc ở đây mãi mãi thúc đẩy bạn tiến về phía trước, qua '
                          'một cổng tò vò dẫn vào một hành lang mọc um tùm cỏ dại. Một cánh cửa gỗ ẩm ướt dẫn bạn ra '
                          'một khoang trời mưa phùn mỏng manh và bầu trời tối sầm. Xi măng biến thành sỏi, rồi đá cẩm '
                          'thạch, rồi thép, rồi cỏ. Bạn băng qua những đồng cỏ dài đến khó tin và tìm đường qua những '
                          'khu rừng rậm rạp trước khi sự mệt mỏi cuối cùng cũng ập đến. Cạn kiệt mọi năng lượng, bạn '
                          'không thể đi tiếp được nữa. Cơ thể bạn ngã quỵ.'},
 '51026': {'name': 'Nơi Có Khói',
           'text': '',
           'flavor': 'Khi chuyến tàu đến Dunwich dừng lại một cách đột ngột rung chuyển, bạn nhìn ra ngoài cửa sổ phía '
                     'sau và thấy một vết rách khổng lồ trên bầu trời, như một vết rách trên một mảnh vải. Từ vết rách '
                     'này, một quái thú có cánh xuất hiện. Nó phát ra một tiếng rít đau đớn và lao xuống đoàn tàu.',
           'back_name': '',
           'back_text': '',
           'back_flavor': ''},
 '51027': {'name': 'Vết Rách Trong Thực Tại (bản II)',
           'text': '',
           'flavor': 'Lực hút của cánh cổng mạnh lên với sự hiện diện của con quái thú có cánh. Vài toa tàu sau cùng '
                     'bị kéo giật ngược trở lại, và có một tiếng nghiến kim loại khủng khiếp khi chúng bị tách rời. '
                     'Các toa tàu lật nhào lên phía trên và tiến vào vết nứt rạn trên bầu trời. Những hành khách gần '
                     'đó đang hoảng loạn, những người khác đang co ro trên ghế ngồi của mình, và một cụ ông đã ngất '
                     'lịm đi vì sợ hãi.',
           'back_name': 'Tiếp Tục Di Chuyển!',
           'back_text': 'Loại bỏ địa điểm ngoài cùng bên trái khỏi trò chơi (hoặc đặt nó vào khu vực trưng bày thành '
                        'tích nếu nó có Victory X và không có manh mối nào trên đó). Mỗi điều tra viên tại địa điểm đó '
                        'bị đánh bại. Mỗi kẻ địch và asset tại địa điểm đó bị bỏ.\n'
                        'Bỏ tất cả các manh mối do các điều tra viên kiểm soát.',
           'back_flavor': 'Toa sau cùng của đoàn tàu bị tách ra khi bị kéo giật lùi lại. Trước sự kinh hoàng của '
                          'bạn, nó nhấc bổng lên khỏi đường ray và bị cánh cổng phía trên bạn nuốt chửng.'},
 '51054': {'name': 'Đột Phá Xuyên Qua (bản II)',
           'text': '<b>Forced</b> - Sau khi bạn bị di chuyển đến một địa điểm bởi một hiệu ứng lá bài encounter: Chịu '
                   '1 horror.',
           'flavor': 'Xuyên suốt chiều không gian biến dạng này, bất kể bạn du hành đến đâu, đều có một hình thù ám '
                     'ảnh ở phía xa. Ban đầu, nó xuất hiện như một chiếc đĩa, giống như một mặt trăng đen với nhiều '
                     'cánh tay ngoe nguẩy. Nhưng khi thời gian trôi qua, bạn có thể nhận ra nó đang ngày càng lớn hơn '
                     'và lớn hơn…',
           'back_name': 'Chìa Khóa và Cánh Cổng (bản II)',
           'back_text': '<b>Revelation</b> - Di chuyển Yog-Sothoth đến The Edge of the Universe (hoặc Another '
                        'Dimension nếu The Edge of the Universe không ở trong màn chơi). Loại bỏ Realms Beyond khỏi '
                        'trò chơi và advance sang agenda 4a. Bỏ qua nội dung trên Realms Beyond trong khi giải quyết '
                        'khả năng này.',
           'back_flavor': ''},
 '51055': {'name': 'Tiến Vào Cõi Xa Xăm (bản II)',
           'text': '[action]: Bỏ 3 lá bài trên cùng của chồng bài encounter. Chọn một địa điểm bị bỏ bởi hiệu ứng này '
                   "và giải quyết khả năng 'revelation' của nó.\n"
                   '<b>Objective</b> - Nếu một điều tra viên tiến vào The Edge of the Universe, advance.',
           'flavor': 'Bạn tiếp tục lần theo vệt sáng mỏng manh, mặc dù địa hình hiểm trở khiến nó trở thành một mục '
                     'tiêu khó đuổi theo.',
           'back_name': 'Vật Chứa Đang Chờ Đợi',
           'back_text': 'Spawn kẻ địch Seth Bishop <i>(Thrall of Yog-Sothoth)</i> đang để riêng tại The Edge of the '
                        'Universe.',
           'back_flavor': 'Bạn chạm tới một cõi hư không đen kịt dày đặc đến khó tin, và nhận ra rằng nơi này là nơi '
                          'toàn bộ thực tại - tất cả những gì đang là và tất cả những gì sẽ mãi là - kết thúc. Ở trung '
                          'tâm của nó, bạn nhìn thấy một vết rách nhỏ xíu, lơ lửng ngay ngoài tầm với. Bằng cách nào '
                          'đó, bạn đã đến được phía bên kia của cánh cổng phía trên Sentinel Hill.\n'
                          'Ngay lúc đó, một giọng nói từ bóng tối phía xa gọi bạn: "Biến đi." Vệt sáng mỏng manh bạn '
                          'đang đi theo vụt bay vào bóng tối. Khoảnh khắc sau, khuôn mặt biến dạng, vặn vẹo của Seth '
                          'Bishop xuất hiện. Da thịt ông ta cựa quậy với một sự đột biến phi tự nhiên. Đôi mắt ông mở '
                          'to, tràn ngập ác ý độc địa. "Biến đi! Giờ ta là vật chứa của ngài! Ta có tri thức của các '
                          'cổ nhân! Giờ thì, cút đi… hoặc chết!" Ông ta cười khanh khách điên dại khi thân xác bị điều '
                          'khiển, dị dạng của ông tập tễnh tiến về phía trước\n'
                          'Bạn phải tìm cách đóng vết rách lại vĩnh viễn, nhưng trước tiên bạn phải đối phó với Seth - '
                          'nghĩa là với sinh vật mà ông ta đã trở thành.'}}
