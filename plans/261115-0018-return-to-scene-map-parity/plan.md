# Rà soát Scene Map bản gốc và Return to ngoài Carcosa

Trạng thái ngày 15/11/2026: đã cập nhật đăng ký, tranh và vị trí Scene Map. Phạm vi gồm 38 cặp scenario trong repo: Night of the Zealot (3), Dunwich Legacy (8), Forgotten Age (10), Circle Undone (9) và Return to Innsmouth homebrew (8). Hai phần Heart of the Elders tính riêng. Dùng Carcosa làm mẫu đã triển khai.

Đã thêm hồi quy cho cấu hình 37 cặp dùng chung tranh, cùng kiểm thử cho mặt cắt riêng Return to The Gathering, các phòng mở muộn, toa Essex và hiệu ứng spectral. Các nhóm xáo và Explore dùng một phần tranh của lá lật làm lớp hiển thị ở ô tương ứng. Essex đã chụp trên Chrome với component bản đồ thật, dùng dữ liệu dựng lại lúc đủ bảy toa và sau khi còn bốn toa. Đoạn cầu cao qua sông Miskatonic và khe nứt trên trời được đối chiếu với phần hướng dẫn và Agenda của màn.

Threads of Fate và Shattered Aeons dùng góc nhìn cao từ trên xuống trong một nền liền mạch cho cả hai phiên bản. Đã đo lại các điểm neo trên hai tranh mới bằng ảnh overlay.

## Thứ tự triển khai

1. **Sửa đăng ký ảnh và dùng lại tranh đã đủ chỗ.** Sửa hai ID sai ở Dunwich. Dùng chung tranh cho The House Always Wins, The Miskatonic Museum và For the Greater Good. Với Twilight Estate, hiệu chỉnh bản gốc trên cùng mặt cắt và giữ không khí spectral theo trạng thái màn. Bổ sung các ID dùng được nền hiện có và kiểm alias theo lá thay thế.
2. **Sửa tranh có địa danh cố định.** Ưu tiên Warren Observatory, Loading Docks, Hastings Estate, các phòng Pnakotus, cùng điểm rơi của nhánh mở muộn trong Shattered Aeons. Kiểm tranh bằng overlay toàn bộ địa điểm có thể xuất hiện trước khi quyết định ghim, mở rộng tranh hoặc thêm lớp ảnh.
3. **Ưu tiên sprite cho bố cục biến đổi.** Giữ một nền liền mạch làm bối cảnh. Dùng sprite theo ô thật cho các khu xáo nhiều biến thể, đổi tầng, thay lá hoặc gỡ ô trong lúc chơi. Khi chỉ một phần bản đồ biến đổi, giữ các mốc cố định trên nền và giới hạn sprite ở phần thay đổi. Dùng điểm tạm rồi chuyển nhãn khi lật nếu địa danh có vị trí cuối cùng xác định trên tranh. Áp dụng cùng cách hiển thị cho bản gốc và Return to khi hai bản có cùng cơ chế.
4. **Kiểm cả hai bản.** Chạy kiểm thử Scene Map và TypeScript. Mở các trạng thái setup, trước/sau reveal, cuối Act, thay lá, gỡ lá, và tải lại ván trên desktop và điện thoại. So nhãn, ảnh, token và đường nối với Card Board.

## Night of the Zealot

| Màn và ID gốc → Return to | Phát hiện và việc cần làm |
| --- | --- |
| The Gathering `01104 → 50011` | Bản gốc có Study riêng và house cutaway đã khớp bố cục. Tranh Return to chứa khe nứt, tầng trên và vực dưới nhà. Giữ cảnh Study và mặt cắt theo phiên bản. Nếu dùng chung kiến trúc, dùng biến thể tranh cho trạng thái nhà và kiểm nhãn Study, Hallway, Attic, Cellar, Parlor khi qua Act. |
| The Midnight Masks `01120 → 50025` | Hai bản đã dùng chung ảnh và biến thể Your House cháy. Thiếu điểm theo mã cho bốn lá Return to `50027–50030`: Police Station, Train Station, Museum, Abandoned Warehouse. Gắn vào Easttown, Northside, Miskatonic University, Rivertown tương ứng. Kiểm landmark ở cả hai ảnh; sửa vùng ảnh cục bộ nếu biến thể cần hình khác. Giữ nhánh nhà cháy và vị trí xuất phát. |
| The Devourer Below `01142 → 50032` | Bốn ô Woods được chia từ pool. Return to thêm Great Willow, Lakeside, Corpse-Ridden Clearing, Wooden Bridge. Tranh hiện có Main Path và Ritual Site rõ. Giữ hai landmark đó, bổ sung ảnh woods theo ô hoặc mở rộng tranh nếu muốn các landmark riêng; kiểm Ritual Site xuất hiện muộn. Vault of Earthly Demise là treachery gắn vào enemy. |

## The Dunwich Legacy

| Màn và ID gốc → Return to | Phát hiện và việc cần làm |
| --- | --- |
| Extracurricular Activity `02041 → 51012` | Return to chọn Orne Library hoặc Warren Observatory. Tranh campus có thể dùng chung bố cục, cần đối chiếu hoặc thêm mái vòm Observatory và điểm neo riêng, tránh chồng lên Orne Library. Kiểm thêm Faculty Offices, Dormitories và Alchemy Labs mở muộn của hai bản. |
| The House Always Wins `02062 → 51015` | Dùng tranh Return to cho cả hai. Backend dùng cùng các cửa `backHallDoorway1–3`; bật `revealRoomAnchors` cho bản gốc. Kiểm cả ba phòng Art Gallery, VIP Area, Back Alley và mã Lounge `51016`; Stage chỉ hiện nhãn khi lá `51017` vào ván. |
| The Miskatonic Museum `02118 → 51020` | Hai bản dùng cùng layout `hall1–hall6` từ helper. Dùng tranh Museum mới và lớp hiện vật cho cả hai. Lá lật hiển thị hiện vật tại hall đã chia. Kiểm Restricted Hall nằm trong đúng ô đã rút và các lá Medieval Exhibit / Archives của Return to. |
| The Essex County Express `02159 → 51025` | Sửa `51031` đang trỏ tranh vì đây là asset Engineer. Sáu toa được xáo, Return to thêm Freight Car, Baggage Car và biến thể đầu máy. Agenda gỡ dần toa bên trái. Dùng nền và toa bám vị trí thật, đoàn tàu phải mất đúng toa khi portal nuốt, đầu máy giữ phía trước. |
| Blood on the Altar `02195 → 51032` | `51036` là mã location, bỏ khỏi bảng scenario. Các biến thể là cùng địa danh; thêm alias theo khu vực. Kiểm Hidden Chamber được mở tại địa điểm chứa nó, tránh vẽ sẵn một buồng interact sai chỗ. |
| Undimensioned and Unseen `02236 → 51041` | Cùng các địa danh đã có, giữ tranh. Kiểm sáu cặp biến thể và Brood di chuyển qua đúng điểm trong hai bản. |
| Where Doom Awaits `02274 → 51047` | Thêm alias Base of the Hill và Ascending Path Warped and Twisted. Tranh đồi hiện thiếu landmark rõ cho Abandoned Camp và Fathomless Lake. Giữ Sentinel Peak, dùng tranh mở rộng hoặc sprite cho hai nhóm đường mòn được lấy ngẫu nhiên; thử đường mở ở cả hai Act/bản. |
| Lost in Time and Space `02311 → 51053` | Đổi `51051` vì đó là location của Where Doom Awaits. Helper đã có nhãn cho Indecipherable Stairs, Towering Luminosity, Unstable Vortex, Realms Beyond; hiệu chỉnh theo layout trước khi cân nhắc sửa tranh. Kiểm nhiều bản Endless Bridge/Tear Through Space và location rút từ encounter deck xuất hiện hoặc biến mất ở hai bản. |

## The Forgotten Age

Cả 10 ID Return to dưới đây thiếu trong bảng `boards`. Bổ sung theo nhóm sau, đưa điều kiện Explore và ghép địa danh vào cùng đợt thay vì mặc định trỏ tất cả về nền gốc.

| Màn và ID gốc → Return to | Phát hiện và việc cần làm |
| --- | --- |
| The Untamed Wilds `04043 → 53016` | Tranh rừng hiện có camp, cầu và thác. Neo điểm xuất phát, đối chiếu các slot theo biểu tượng. Có Riverside Temple, Waterfall, Trail of the Dead, Cloud Forest thay thế trong deck; dùng điểm/sprite tương ứng với thẻ đã khám phá. |
| The Doom of Eztli `04054 → 53017` | Return to có bộ Rearranged by Time và năm phòng riêng (Snake Pit, Throne Room, Tomb of the Ancients, Mosaic Chamber, Sealed Passage). Hiệu chỉnh hành lang cố định rồi kiểm Explore và dãy `pos1…pos9`; dùng sprite ở ô game quyết định. |
| Threads of Fate `04113 → 53028` | Hai Act Return to đặt **Loading Docks** và **The Hastings Estate**. Mở rộng tranh Arkham và bố trí điểm neo riêng; kiểm các tuyến điều tra mở hai điểm muộn và giữ các điểm cũ. |
| The Boundary Beyond `04161 → 53038` | Giữ sáu vị trí theo slot. Ưu tiên sprite hiện đại và cổ đại theo lá đang chiếm từng ô vì mỗi vị trí có thể đổi thời đại riêng. Kiểm đổi một ô và đổi lại, trong khi năm ô còn lại giữ đúng hình. |
| Heart of the Elders I `04205a → 53045` | Hai ảnh Part I/II hiện thể hiện cùng cảnh hang. Part I cần nền rừng và Mouth of K’n-yan, các nhánh khám phá có thể dùng bộ rừng Untamed Wilds nếu phù hợp. Làm cho cả bản gốc lẫn Return to. |
| Heart of the Elders II `04205b → 53048` | Giữ nền hang làm ứng viên, bổ sung Ruins of K’n-yan, Chthonian Depths, Subterranean Swamp, Treacherous Descent theo slot Explore. Kiểm điểm kết thúc và không chia sẻ nền Part I. |
| The City of Archives `04237 → 53053` | Return to thêm Southern Corridors ở setup, Cyclopean Vaults và Alien Conservatory mở sau. Cần sửa tranh cùng bố cục Pnakotus rồi dùng cho hai bản; hiệu chỉnh cả ba Interview Room theo layout. |
| The Depths of Yoth `04277 → 53059` | Ưu tiên nền vực đỏ với sprite theo location trên tầng hiện tại. Khi dựng tầng tiếp theo, kiểm ô, token và đường nối cập nhật theo Card Board. |
| Shattered Aeons `04314 → 53061` | Có Great Hall of Celeano trong deck và hai điểm set aside Buenos Aires, Ultima Thule. Bổ sung ba khu và anchor riêng; kiểm lớp Explore và các nhãn biến thể trong layout trước khi dùng chung tranh. |
| Turn Back Time `04344 → 53066` | Dùng lại bộ location Rearranged by Time và năm phòng của Doom of Eztli. Tái dùng sprite/điểm cùng cấu trúc, giữ cảnh thời gian riêng; thử entryway, Chamber of Time và chuỗi Explore của hai bản. |

## The Circle Undone

| Màn và ID gốc → Return to | Phát hiện và việc cần làm |
| --- | --- |
| Disappearance at the Twilight Estate `05043 → 54016` và At Death’s Doorstep `05065 → 54024` | Đã có tranh Return to dùng chung với Wine Cellar. Có thể dùng chung hình học cho bản gốc. Giữ diện mạo spectral ở prologue và khi màn sau đổi sang spectral bằng xử lý ảnh theo trạng thái; hai mã Wine Cellar chung điểm, chỉ hiện khi được đặt. |
| The Witching Hour `05050 → 54017` | Thiếu ID. Return to thêm Witch Tree, Unmarked Graveyard và ba Woods đặt sau; tùy lựa chọn còn có bốn Woods từ Devourer Below. Giữ Witches’ Circle làm mốc. Dùng art woods theo nhóm ô hoặc điểm lật, kiểm setup phân tán người chơi và giai đoạn các nhóm nối lại. |
| The Secret Name `05120 → 54029` | Thiếu ID. Return to thêm Temple of R’lyeh, The Price Manor, The 9th Ward và Library of Ebla vào pool Unknown Places. Bổ sung landmark hoặc sprite cổng chuyển cảnh. Kiểm hai Strange Geometry cùng mã có hai điểm riêng, cùng Decrepit Door mở dần trong cả hai bản. |
| The Wages of Sin `05161 → 54034` | Thiếu ID. Dùng cùng tranh, alias cho cặp Hangman’s Brook thường/spectral mới về đúng mốc cũ. Kiểm toàn bàn khi chuyển spectral. |
| For the Greater Good `05197 → 54042` | Dùng mặt cắt Return to cho cả hai. Kiểm các điểm tạm Sanctum Doorway và đích Ceremony Room, Holding Cells; hai phòng Relic Storage, Shrouded Archive có chỗ riêng cho Return to. Kiểm Lounge biến thể, Inner Sanctum và điều kiện mở đường. |
| Union and Disillusion `05238 → 54046` | Thiếu ID. Giữ sông, Forbidding Shore và Geist-Trap. Rà cách chia nhóm Unvisited Isle trước/sau lật. Thêm điểm úp trung tính nếu nhãn hoặc hình hiện tại tiết lộ Isle, neo về đúng địa danh khi lật. |
| In the Clutches of Chaos `05284 → 54049` | Thiếu ID. Giữ nền Arkham nứt vỡ, bổ sung alias sáu biến thể Return to theo district. Kiểm các rift và nhãn ở đúng khu. |
| Before the Black Throne `05325 → 54056` | Đã có nền và folder sprite chung Cosmos, gồm Nightmare Breach, Interstellar Abyss, Winding Gulf. Giữ cấu hình, kiểm hồi quy lúc đặt/chuyển lưới ở Act cuối. |

## Return to The Innsmouth Conspiracy (homebrew)

| Màn và ID gốc → hậu tố ID `:return-to-the-innsmouth-conspiracy:` | Phát hiện và việc cần làm |
| --- | --- |
| The Vanishing of Elina Harper `07056 → 022`, In Too Deep `07123 → 028` | Thiếu hai ID. Dùng panorama riêng đang có của từng màn vì layout khác nhau. Kiểm nhãn địa danh theo từng màn, cùng vị trí barricade và flooding của In Too Deep. |
| The Lair of Dagon `07274 → 043` | Thiếu ID. Dùng chung đền chính và alias các biến thể Doorway to the Depths. Rà cả Flooded Caverns trong encounter set (Tidal Pool, Underground River, Underwater Cavern) với các lá Homebrew thay thế; cấp ảnh theo ô thực nếu chúng vào ván. |
| The Pit of Despair `07041 → 018`, Devil Reef `07163 → 031`, Horror in High Gear `07198 → 035`, A Light in the Fog `07231 → 039`, Into the Maelstrom `07311 → 048` | Đã đăng ký nền và bộ sprite cho cả hai bản. Giữ và chạy hồi quy vị trí, ngập nước, phương tiện, lá rời lưới và mã homebrew. |

## Tiêu chí hoàn thành

- Bảng `boards` khớp ID scenario backend, test từng ID gốc và Return to. Khi đổi tài sản hoặc dùng sprite, kiểm đường dẫn WebP và các code thẻ có thể đặt lên bàn.
- Đối chiếu nhãn layout, mã thẻ và điểm neo với tranh thật; mọi phòng mở muộn có vị trí riêng hoặc sprite đúng ô. Kiểm các lá trùng mã cùng xuất hiện, lá thay thế cùng khu vực và trạng thái sau khi tải lại.
- Lá úp giữ thông tin công khai. Sau reveal, nhãn, token và đường nối bám điểm vừa chọn. Không thay backend hay luật di chuyển để khớp hình.
- Chạy `node --test frontend/tests/hemlockOverview.test.mjs frontend/tests/sceneIslandSprites.test.mjs frontend/tests/innsmouthDynamicScenes.test.mjs` và `npm --prefix frontend run tc`. Chụp preview có overlay và lưu kết quả browser cho các màn sửa.

Nguồn đối chiếu trong repo: `backend/arkham-api/library/Arkham/Scenario/Scenarios`, `Location/CardDefs`, `Act/Cards`, `Agenda/Cards`, `Homebrew/ReturnToTheInnsmouthConspiracy`, `frontend/src/arkham/hemlock-overview.ts`, `scene-island-sprites.ts` và tranh WebP hiện có.

## Chưa xác minh

- Chưa chơi thử đủ 38 cặp trên trình duyệt. Cần kiểm các nhánh Explore, nhóm location xáo và cảnh spectral trong ván có token và lựa chọn thật.
