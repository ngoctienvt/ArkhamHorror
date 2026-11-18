# Audit độ chính xác và diễn biến Scene Map

Ngày 17/11/2026. Phạm vi: official, Return to, challenge và toàn bộ homebrew đang đăng ký; loại The Dunwich Legacy và The Path to Carcosa do agent khác phụ trách. Dark Matter: Fragment of Carcosa vẫn thuộc phạm vi này.

**Còn nhiều chỗ đáng nâng cấp. Quan trọng nhất là đổi đúng không gian đang chơi và giữ đúng quan hệ location trước khi thêm hiệu ứng hoặc tăng chi tiết tranh.** Đợt này là audit và backlog thực hiện, chưa thay code hay generate/thay ảnh game.

## Phạm vi kiểm chứng

- Quét **126 file scenario official** trong phạm vi và **49 ID homebrew** trong 15 package. Đây là số file/đăng ký, không phải số màn độc lập: có wrapper Return to, Prelude và một file chứa hai phần.
- Đọc bộ chọn tranh/ghim, vị trí sau lật, bộ sprite, logic đổi nền của Dream-Eaters và phần canvas. Không chỉ đếm WebP.
- Lưu các điểm thay/gỡ location, đổi layout, flood trong **259 file source**; tập kết quả tìm kiếm là đầu mối, không phải 259 lỗi.
- Xem **139 ảnh WebP cấp toàn cảnh/biến thể** ngoài hai campaign bị loại trừ trên năm contact sheet. Không đếm/xem đầy đủ mọi sprite con hoặc so từng nét với tranh lá bài.
- Đối chiếu sâu các phát hiện bên dưới với Act/Agenda/Location/helper. Các mục còn lại được sàng lọc source và cấu hình, chưa chứng nhận mọi nhánh đều chính xác tuyệt đối.
- [Ma trận từng mục](../261117-2321-scene-immersion-audit/coverage.md), [inventory](../261117-2321-scene-immersion-audit/inventory.json), [kết quả quét lifecycle](../261117-2321-scene-immersion-audit/lifecycle-events.json).

## Cách chọn cảnh phù hợp

| Trạng thái bàn | Cách dựng nên dùng |
|---|---|
| Khu ngoài trời và phòng trong nhà còn chơi đồng thời | Một toàn cảnh, mặt cắt cục bộ trong đúng công trình, hai điểm đứng riêng cho phòng và khu chung |
| Bàn cũ bị gỡ gần hết, chỉ giữ một cổng/cửa | Chuyển hẳn toàn cảnh sang vùng mới. Cổng cũ là mốc ở mép cảnh; không dành nửa màn hình cho khu đã mất |
| Khu cũ vẫn còn và còn đường đi lại | Giữ cả hai vùng có kết nối rõ; có thể thêm chế độ xem từng vùng nhưng không tự giấu location đang chơi |
| Các lá xoay, đổi ô, trượt, có luật theo hàng hoặc đối diện | Nền liên tục + sprite theo ô/ID thực tế. Không ghim identity của lá vào cảnh cố định |
| Chỉ một số nơi cháy/ngập/sụp/đổi thực tại | Các ảnh trạng thái cùng hình học + mask theo từng location; tránh sinh mọi tổ hợp 2^N |
| Chỉ khí hậu/ánh sáng thay đổi | Biến thể cùng bố cục; giữ ghim và góc nhìn |

Không chọn nền chỉ vì điều tra viên đang đứng dưới hầm: đồng đội có thể vẫn ở trên. Trigger chính là **location/layout hiện có và trạng thái công khai**, kết hợp Act/Agenda khi lá thực sự yêu cầu môi trường đổi. Tải lại, Undo và các nhánh đi tắt phải dựng lại được cảnh từ snapshot.

## Ưu tiên 1 — những chỗ cần sửa cấu trúc hoặc trạng thái

### 1. The Heart of Madness II — cần toàn cảnh đường thoát

**Đã xác nhận.** `CollapseThePylons.hs:47–63` và Agenda `ThatWhichHasNoName.hs:54–55` đều gỡ mọi location trừ Gate of Y'quaa rồi dựng tuyến **Gate → bốn Titanic Ramp → Hidden Tunnel**. Có hai đường dẫn đến cùng pha thoát: Act hoặc Agenda.

Hiện scenario `08648b` luôn chọn cùng tranh cơ sở. Năm điểm cuối bị ép ở đáy tranh, Hidden Tunnel ở y=96; đây không phải bố cục mới dành cho pha thoát.

**Nâng cấp:** tranh facility trước biến cố; tranh facility bị miasma/đổ vỡ; **toàn cảnh đường thoát riêng** với cổng phía trái và lối ra bên phải. Khi ramp/tunnel vào bàn và facility cũ đã gỡ, đổi bố cục/ghim. Không lấy số Act lớn nhất làm trigger vì The Final Mirage đồng thời làm Act và Agenda.

### 2. Film Fatale — một phim trường không thể đại diện cả ba thế giới

**Đã xác nhận.** `AndresRequest.hs:110–220` giữ lại một Set, gỡ hai Set còn lại và dựng một trong ba layout: **A Cosmic Journey**, **The Forgotten Island**, **The Abominable Contessa**. Các Act tương ứng kết thúc chuyến đi bằng cách gỡ các location thế giới và khôi phục `initialLayout`.

Hiện chỉ có `side-stories/film-fatale.webp`, sáu mã được ghim trong bảng riêng; thiếu toàn cảnh hành tinh, đảo tiền sử, lâu đài và nhiều địa điểm tương ứng. Không được đặt High Ruler's Bastion hoặc Throne of Blood lên phố phim trường.

**Nâng cấp:** tối thiểu bốn nền: phim trường, không gian, đảo, lâu đài. Set còn lại trở thành cửa trở về ở mép cảnh. Nhánh vũ trụ có location nở thêm và Rocket Ship: kiểm bằng lưới/sprite, không ép vào bố cục cố định dự đoán trước. Đổi lại phim trường khi location cũ quay lại.

### 3. The Lair of Dagon — từ hội kín xuống hang, chỉ giữ Grand Entryway

**Đã xác nhận.** `TheFirstOath.hs:50–76` gỡ các nơi khác, giữ Grand Entryway, đặt bảy Tidal Tunnel xáo và dựng lại layout quanh hang/Lair of Dagon; tăng flood.

Hiện dùng một mặt cắt hội kín cố định và chưa có `ISLAND_FOLDERS` cho `07274` như các màn hang Innsmouth khác.

**Nâng cấp:** cảnh lodge ban đầu có cửa xuống; sau biến cố dùng **toàn cảnh hang**, Grand Entryway là lối nối với phía trên. Tunnel xáo dùng sprite và mặt úp chung, nước theo `floodLevel`. Áp dụng cả Return to sau khi kiểm các biến thể tunnel mới.

### 4. The Apiary — cần phân biệt nhánh Lost Pilgrims / Hive Mind

**Đã xác nhận.** `UnsettlingSigns.hs:119–175` ở nhánh Hive Mind giữ bốn location vòng, gỡ các nơi còn lại, đổi vị trí Entrance/Acidic Coelom rồi thêm Central Chamber. Nhánh Lost Pilgrims giữ không gian khác và có các Cultist dưới Lost Campsite.

Hiện chỉ một nền, không theo nhánh. Một số cặp location dùng chung điểm (Luminous/Grasping, Spawning/Starving, Campsite/Acidic). Dùng chung điểm chỉ hợp lệ nếu hai lá không thể đồng thời hiện diện; cần kiểm riêng các bản trong ván và nhóm encounter trước khi chốt ghim.

**Nâng cấp:** toàn cảnh mê cung lúc dò; biến thể tập trung Lost Campsite; **toàn cảnh vòng Hive Mind** có bốn khu bao Central Chamber đúng hướng. Chọn nhánh bằng Central Chamber/các mã còn trên bàn, không chỉ Act 2. Không vẽ Mother chết cứng vào nền vì enemy còn tương tác.

### 5. City of the Elder Things / Heart of Madness I–II — các phòng xáo đang ghim cố định

**Đã xác nhận về mô hình.** City setup có `setUsesGrid`, xáo `cityLandscapes` rồi đặt bằng `placeInGrid`; Heart setup dùng các vòng và spokes xáo. Hiện các scenario này không có trong `ISLAND_FOLDERS`, cũng không có bảng `revealedScenePositions` riêng, trong khi các mã phòng được ghim theo tranh.

**Nâng cấp:** City và facility dùng nền kiến trúc chung, mảnh phòng bám ô xáo; thể hiện nội thất bằng mặt cắt phòng ngay trong ô, không biến tất cả thành đảo đá. Giữ đúng vòng/spokes để đọc kết nối. Chỉ dùng toàn cảnh ghim cố định nếu đã chứng minh việc dời phòng sau lật không phá các luật vị trí của màn; hiện chưa có chứng minh đó.

### 6. The Depths of Yoth — đi xuống tầng mới nhưng vẫn một cảnh

**Đã xác nhận.** `JourneyToTheNexus.hs:40–103` tăng depth, gỡ toàn bộ location và dựng exploration mới; Act có thể quay lại chính nó nên Act number không thể hiện độ sâu.

**Nâng cấp:** một bộ cảnh Yoth ở các mức độ sâu có thể tái dùng, chọn từ metadata depth công khai; lối đi và các nơi đã gỡ không còn được vẽ như khu đang khám phá. Bổ sung ghim/hình cho đầy đủ location của tầng, kiểm nhiều bản và Return to. Không cần vẽ một ảnh cho mọi số depth; vài dải độ sâu + location đang có là đủ.

### 7. The Boundary Beyond — cần trạng thái theo từng khu quá khứ/hiện tại

**Đã xác nhận.** `PastAndPresent.hs:39–61` và `TheBarrierIsThin.hs:30–52` thay các nơi PresentDay bằng Tenochtitlan theo symbol. Source scenario còn xử lý việc thay lại khi location rời bàn. Tranh hiện ghép cả hai thời đại vĩnh viễn, chưa đổi theo mã đang có.

**Nâng cấp:** hai tranh Mexico City / Tenochtitlan cùng địa hình và mask sáu khu. Mỗi location quyết định khu đó là thời đại nào; hỗ trợ trạng thái pha trộn và lúc quay lại. Giữ mặt cắt/địa danh tương ứng cùng vị trí, không tráo các khu có symbol liên hệ.

### 8. On Thin Ice — có thêm Outsiders' Lair nhưng vùng Alaska vẫn còn

**Đã xác nhận.** `ProwlingNightmare.hs:29–35` đặt `09615b`, nối nó với nơi Void Chimera vừa ở và đưa nhân vật tại đó vào hang; không gỡ tất cả Alaska.

**Nâng cấp:** thêm vùng dị giới có lối nối tại location thực tế, hoặc view vùng có thể chuyển qua lại; không đổi toàn bàn thành hang rồi làm mất các location ngoài Alaska còn chơi được. `hemlockVillagePosition` đang bỏ đuôi b, vì thế phải xử lý rõ mã Act mặt sau thành location, không coi là một thẻ Act thông thường.

### 9. Queen of Ash — thiếu diễn biến cháy và trạng thái nghi thức

**Đã xác nhận.** `SearchTheSewers.hs:38–55` tạo Elokoss Faint Embers, Fire! tại Cistern và mở Sluice Control. `ARitual.hs:43–68` chuyển Elokoss Mother of Flame kể cả nếu chưa tới đúng Act, rồi bỏ Act deck.

Hiện panorama cống đã đúng hướng hơn nhưng không đổi theo Agenda/ritual.

**Nâng cấp:** cống trước nghi thức → cistern đang cháy/nghi thức mở → lửa lan khi Mother of Flame thức dậy. Nước/lửa cục bộ theo trạng thái luật. Sluice Control cần phòng công trình thật, không chỉ một ghim giữa nước. Không bắt buộc đổi hết bố cục vì phần lớn cống vẫn còn.

### 10. Guardians of the Abyss — hai màn chưa có panorama đăng ký

**Đã xác nhận.** `83001` và `83016` không có trong bộ chọn tranh. `IntoTheGate.hs:43–53` dựng layout vực thẳm mới, chuyển mọi người sang A Dream Betwixt rồi gỡ mọi location khác.

**Nâng cấp:** The Eternal Slumber cần Cairo + sa mạc/di tích với phần Explore; The Night's Usurper cần bối cảnh trước cổng và **toàn cảnh Abyss riêng** sau cổng. Chỉ giữ dấu vết cổng quay về nếu luật cho phép; không tự vẽ đường di chuyển ngược đã không tồn tại.

### 11. The Labyrinths of Lunacy — ba nhóm, nhiều bản Labyrinthine Halls

**Đã xác nhận.** Setup chọn layout riêng Group A/B/C (`TheLabyrinthsOfLunacy.hs:136–185`). Bảng hiện có mã `70026` Labyrinthine Halls nhưng chưa có điểm riêng cho `70025` và `70027`; cả ba là các lá Halls khác nhau. Nhóm B cũng có số phòng khác hẳn.

**Nâng cấp:** bố cục theo nhóm; nhiều Halls cấp điểm theo ID/label thay vì chỉ mã. Giai đoạn escape có thể tái dùng vùng Warehouse khi nó mở, với đúng các phòng còn trong bàn.

## Homebrew — không bỏ qua phần thiếu toàn bộ Scene Map

**49 ID được kiểm kê. 23 đã có panorama đăng ký; 26 chưa có.** Trong 26 đó có 7 scenario Night of Vespers còn là shell backend. Có ảnh card vẫn không có nghĩa là có toàn cảnh.

### Dark Matter — tám màn có tranh, nhưng nhiều trạng thái còn thiếu

| Màn | Hiện trạng / bằng chứng | Nâng cấp nên làm |
|---|---|---|
| The Tatterdemalion | Có mặt cắt tàu, tám mốc phòng. Scanning mở nội dung; chưa thấy lý do phải thay toàn tàu mỗi Act | Giữ mặt cắt; kiểm phòng nào thực sự vào play và ánh sáng/nguồn điện theo lá cụ thể. Không tự hiện thứ trong scanning deck |
| Electric Nightmare | Đã có điểm tạm rồi dời phòng sau lật. Ba Act PublicSchool187V10/V20/V30 đặt phòng theo ba hoán vị khác nhau | Kiểm ba setup và các switch; nếu luật phụ thuộc ô thì phòng phải chuyển theo ô, không theo identity cố định. Đừng coi hiện đã hỗ trợ reveal là đã kiểm hết các hoán vị |
| Lost Quantum | Một panorama trạm băng. Có mechanic ổn định lượng tử | Bộ trạng thái trạm chưa ổn định / ổn định theo dữ liệu công khai, giữ ghim; chỉ là đề xuất cho tới khi khóa trigger chính xác |
| In the Shadow of Earth | Có mặt cắt Nostalgia II; scanning và Crew/Imitation là nội dung bí mật | Giữ tàu; kiểm mỗi phòng và lối đi. Chỉ đổi môi trường khi sự kiện công khai yêu cầu, không hiển thị sớm Imitation |
| **Strange Moons** | `DarkMatter/Helpers.hs:687–709`: scanned Simulation thay Reality Simulator, bản cũ nằm bên dưới. Sáu simulation đang dùng chung một điểm, chưa đổi hình phòng | **Phòng simulator trong căn cứ + sáu ảnh simulation thay cục bộ**. Không mở sáu phòng giả cùng lúc, không biến cả căn cứ thành City of Cats |
| **The Machine in Yellow** | Setup dùng Theatre/Lobby/Balcony/Backstage và sáu phòng từ Curtain Call; tranh hiện là máy công nghệ, chưa có bảng riêng neo các mã phòng reused cho tranh này | Mặt cắt nhà hát với đặc điểm máy/giấc mơ đúng câu chuyện; ghim mã reused theo scenario. Phòng sau cửa được thể hiện trong cùng kiến trúc khi mở. Phối hợp khi mượn asset nhà hát từ agent Carcosa, không sửa file họ đang làm |
| **Fragment of Carcosa** | `Helpers.hs:1048–1080`: Cave đổi thành Carcosa ngay tại chỗ, surface không đổi; có thể lật từng vùng | Hai lớp hang / Carcosa khớp hình học + mask theo mã từng phòng, hỗ trợ hỗn hợp. Không chỉ đổi sắc toàn tranh. Vẫn giữ lander và bề mặt chưa bị thay |
| **Starfall** | Hai starship location đổi label `l<host>`/`r<host>` khi cập bến; DarkMatterAgenda gỡ location có ≥3 horror. Chưa có scene model riêng cho các bến/địa điểm này | Nền hệ mặt trời + hành tinh/colony riêng, **hai tàu là sprite di chuyển theo host**. Xóa/biến dạng nơi đã bị gỡ, giữ bí mật nơi chưa scan. Không dùng tàu asset model nguyên xi vì đây là location có placement AttachedToLocation |

### Ages Unwound — cả bảy cần kiểm theo cơ chế thời gian

| Màn | Phát hiện / cách nâng cấp |
|---|---|
| Night of Fire | OnTheLam/GettingYourBearings gỡ và xáo lại các phố trống vào ArkhamStreetsDeck. Giữ tranh Arkham tổng thể có thể hợp lý, nhưng không để mặt úp lộ identity; cần thể hiện nơi đã xác định và lửa đúng vị trí. Chưa đủ bằng chứng để ép toàn màn sang lưới động |
| The Myriad Gentleman | Có nhà và vườn; giữ một toàn cảnh với mặt cắt nhà. Kiểm Landing/Master Bedroom/Study thuộc cùng kiến trúc, không dựng thành nhà riêng. Chưa xác nhận cần đổi hẳn cảnh theo Act |
| A World Torn Down | Nhiều phòng school và nhóm Classroom khác nhau/loại trừ nhau; Ritual Circle chỉ một biến thể. Thể hiện sân trường + nội thất đúng tầng, ghim Classroom theo từng bản; đóng những lối bị gỡ tại TheBoundary_052 |
| **Unstuck** | `swapRingPositions` trong helper đổi label và dựng lại các cạnh vòng; có luật across/clockwise. `revealed-scene-positions.ts` lại ghim các lá lật vào địa danh cố định. **Đổi sang vòng tám sprite theo slot**, hỗ trợ BadTimes thay version ngay tại chỗ. Một panorama cố định không thể hiện đúng across sau hoán đổi |
| A Year to Plan | Bản đồ thế giới phù hợp. Neo theo địa lý trên tranh; Another Realm là cổng gắn Paris, British Library nằm trong London. Seasonal Agenda nên dùng khí sắc/đường hành trình chứ không làm cả Trái Đất cùng một mùa. Đây là đề xuất mỹ thuật |
| **A World Torn Down, Again** | `ADimensionOfItsOwn.hs:21–36` gỡ Featureless Streets và mở grounds. Có **hai Act deck**, present A/B và past C/D. Cần scene các giai đoạn street → school, phân biệt hiện tại/quá khứ bằng vùng và version. Không dùng max số Act hoặc chỉ mặt A/B để chọn một timeline cho mọi người |
| **Time Runs Out** | Location xuống dưới Agenda deck rồi mặt sau có thể là story/enemy/treachery/Paradox location (`Helpers.hs:174–220`). Dùng vùng biến mất/thay dạng theo entity thực tế. Ghép ba nhánh Past/Present/Future và phòng còn play, không để panorama luôn đầy đủ các đảo cũ |

### Circus Ex Mortis — cả tám chưa có panorama đăng ký

| Màn | Thiết kế ưu tiên |
|---|---|
| One Night Only | Toàn cảnh đoàn xiếc; ba ring là ba vùng trong **cùng Big Top**, cổng thoát mở theo location, không vẽ ba lều rời |
| The Primrose Path | Rừng trăng với tám lá xáo quanh Forest Passage; adjacency có tác dụng luật. Nền rừng + sprite ô đúng placement, Cabin/Overlook/Encampment là mốc riêng |
| Harm's Way | Khu lều và Crowded Row dựng bằng grid; enemy có thể làm location. Sprite theo ô, chừa hình ảnh entity-location tương tác được; không thay nó bằng landmark chết trong nền |
| **All Points West** | Đoàn tàu có đổi Freight/Special Car tại mỗi ArrivingAt. Cảnh tuyến đường + toa thay được, nội thất mặt cắt và cảnh ngoài cửa theo chặng; không ghim mỗi loại toa vào một vị trí vĩnh viễn |
| Piper at the Gates of Dawn | Trở lại đoàn xiếc: tái dùng cấu trúc One Night Only, thêm vùng Sylvester Blake/hiện thân chỉ khi hiện diện; ánh sáng theo diễn biến thật |
| Bacchanalia | Mặt cắt manor: balcony trên cao, cellars/dungeon dưới đất; các không gian banquet/parlor/garden tách điểm. Chỉ công khai vice/khách khi game đã cho biết |
| Red Sunrise | Source thay layout, có row/path và Ritual Clearing. Dựng sprites theo hàng/đường thực tế, giữ nơi đang tiếp cận; khóa trigger ánh sáng từ Agenda/text trước khi tạo bộ biến thể |
| Thousand to One | Chuỗi rừng đi xuống và cụm bốn Destiny bên phải; Primal Forest/High Thicket có thể bị gỡ. Mở vùng Destiny theo story, xóa vùng đã mất. Shub-Niggurath là entity tương tác, không vẽ cố định vào nền |

### Night of Vespers — một màn làm được ngay, bảy màn cần hoàn thiện backend trước

- **The End of Seasons:** đã có setup/location/Acts. Cần panorama có Trattoria del Parche và mặt cắt bếp/bar/ballroom; AFamilyAffair gỡ các nơi cũ và trả nhóm bar/kitchen về quanh Trattoria. IntoTheFire gỡ lá úp. Nên có trạng thái trước/sau đổi bàn và cháy theo sự kiện, không chỉ một ảnh nhà hàng đẹp.
- **Behind Closed Doors, Dancing with Death, The Teachings of Aradia, The City of Fog, The Garden of Bones, A Chorus of Suffering, Mother's Mercy:** source hiện ghi `Scenario shell only`, setup chỉ hiện rules/scaffold, layout rỗng. Có thể thiết kế concept từ thẻ/guide, nhưng **chưa được tích hợp trigger rồi tuyên bố đã chạy đúng**. Cần hoàn thiện setup/location lifecycle hoặc có hợp đồng dữ liệu chuẩn trước. Đây là thiếu implementation thật, không phải chỉ thiếu ảnh.

### Mười standalone homebrew — tất cả chưa có panorama đăng ký

| Màn | Thiết kế / thay đổi cần theo dõi |
|---|---|
| **The Phantom of the Opera** | Chuỗi cảnh rõ nhất: các Grand Foyer → Opera House → **Paris Sewers** → **Phantom's Lair + Hidden Parlor + Organ Chamber**. ChasingGhosts gỡ OperaHouse, ThePhantomsDomain gỡ Sewers. Đổi toàn cảnh từng giai đoạn, chỉ giữ cửa nối hợp lệ |
| **The Fall of the House of Usher** | Mặt cắt manor + Tarn bên ngoài. Phòng Decadent nhận damage rồi **thay bằng Ruined tại chỗ** (`Helpers.flipToRuined`). Hai lớp nguyên/vỡ với mask từng phòng; mở Tarn khi FleetingGlimpses đặt lá. Không chờ Agenda cao mới cho toàn bộ nhà sập |
| **Consternation on the Constellation** | Tàu nhiều deck, bắt đầu Cargo Room/Open Water rồi mở thêm chín phòng; nước theo cơ chế sinking và trạng thái công khai (không mặc định đồng nhất với floodLevel chuẩn). Toàn cảnh mặt cắt tàu + lifeboat ngoài mạn. Hai nhánh Act/Agenda 2 đặt nội dung khác; không vẽ sẵn Colossal Servant |
| **Against the Wendigo** | Valley 3×4, sáu Uncharted xáo ở hai cột ngoài, dòng sông ở cột giữa. Dùng nền valley + sprite theo ô để giữ đúng Bắc/Nam/Đông/Tây. Bản đồ ghim cố định theo tên lá sẽ sai |
| The Masque of the Red Death | Ballroom + **bảy phòng màu** trong cùng manor, đúng chuỗi kết nối. Act Seven Chambers chuyển cuộc tiệc thành thảm sát; biến thể nội thất cùng bố cục, không vẽ khách chết trước khi họ lật Victim |
| And Then There Were None | Nhà/đảo biệt lập, bedrooms tầng trên, terrace ngoài trời, wood shed tách nhà. Giữ bí mật Method và thông tin dưới lá; thêm trạng thái bão chỉ khi text/Agenda xác nhận |
| The Invisible Man | Toàn cảnh countryside với nhà/cabin/shack/stream riêng; dấu vết tàn phá và địa điểm thực tế quan trọng hơn hình một người vô hình bị vẽ sẵn. Cần đọc trigger công khai trước khi thêm dấu chân |
| The Legend of Sleepy Hollow | Church, tree, farmstead, swamp và schoolhouse là các mốc riêng, có đường rừng nối. Nhánh White Plains cần hiện khi playable, giữ threat/enemy là standee |
| The Strange Case of Dr. Jekyll and Mr. Hyde | Khu công nghiệp và phố, các location duplicate chọn một bản. Mặt cắt phòng lab nằm trong đúng công trình; variant theo bản location hiện hành, không mở đồng thời các bản loại trừ nhau |
| The Symphony of Erich Zann | Toàn cảnh/mặt cắt nhà hát, bốn phòng Backstage chọn ngẫu nhiên từ sáu. Bốn Musician enemy được đặt vào các phòng; giữ chúng là entity tương tác, không vẽ chết vào nền. Không vẽ cả sáu phòng như đều đang chơi |

## Các campaign / standalone khác — giữ gì và nâng gì

Các dòng “giữ” nghĩa là chưa tìm được bằng chứng cần đập lại cấu trúc trong lượt sàng lọc này, không phải chứng nhận mọi nhánh đã đúng.

| Nhóm | Kết luận |
|---|---|
| Night of the Zealot + Return to | Gathering đã đổi Study → house cutaway; Midnight Masks có house-burned từ log. Giữ cơ chế. Devourer Below/Return cần kiểm các Woods xáo và Ritual Site mở muộn, tránh cảnh/ghim ám chỉ sai lá đang úp. Return Gathering nên kiểm lúc Study rời bàn và các phòng Far Above/Deep Below, không mặc định tất cả đều cùng mở |
| Forgotten Age + Return to | Ngoài Boundary/Yoth ở trên: Untamed Wilds và hai Heart of Elders giữ jungle/cave khác nhau, không ghép lại. Doom of Eztli/Turn Back Time nên có biến thể sụp đổ khi bắt đầu escape nếu lời dẫn xác nhận; Chamber of Time xuất hiện muộn cần vùng nội thất riêng. Threads of Fate giữ full Arkham khi nhiều Act chạy song song; không đổi toàn thành phố theo một Act. City of Archives giữ mặt cắt Pnakotus với các phòng Return đã có. Shattered Aeons nên xóa/mờ vùng thời gian khi location bị gỡ, tránh cảnh luôn đủ các thời đại |
| Circle Undone + Return to | Secret Name/Wages/Spectral Estate đã có biến thể — giữ, bổ sung kiểm ván. Witching Hour có các Woods riêng của từng investigator và Return variants: cần sprite/vùng tránh gộp các nơi độc lập. Union and Disillusion cần ánh sáng brazier theo từng location, không cháy chung cả đảo; For the Greater Good kiểm cửa/phòng mở muộn. Clutches of Chaos thêm trạng thái breach/incursion theo từng khu, không đổi toàn thành phố bằng một số Agenda. Before Black Throne đã dùng cosmos sprite, giữ lưới |
| Dream-Eaters | Các thay cảnh lớn đã có: Gates steps/woods, Kadath theo vùng, Thousand Shapes house/stairs, Gods Dwell Leng/towers, Weaver bridge/ring. **Không làm lại các chuyển cảnh này chỉ vì audit rộng.** Kiểm Point of No Return nhiều Sea of Pitch và các nhóm xáo, Dark Side Moon, Waking Nightmare và các phòng cửa chung ở nhiều bản; thêm biến thể môi trường chỉ khi có source rõ |
| Edge of the Earth | Ngoài ba màn ở trên: Ice and Death I/II/III đã có ba ảnh; nên thống nhất địa hình cùng crash/camp qua ba phần. Fatal Mirage cần làm rõ 19 mốc memory, nhất là Dormitory/Classroom/Office/Infirmary; chúng là ký ức dị giới, không được tự ép thành cùng một campus vật lý. To Forbidden Peaks giữ độ cao và tuyến lên núi, thêm thời tiết đúng mốc nếu được xác nhận |
| Innsmouth + Return to homebrew | Pit/Devil Reef/Fog/High Gear/Maelstrom đã có sprite và flood/vehicle — giữ. **Maelstrom:** khi BackIntoTheDepths gỡ các hang trừ Gateway, nên đổi background sang toàn cảnh Y'ha-nthlei, sprite tiếp tục theo layout 1–4 người; đây là nâng immersion, chưa thiếu việc gỡ token vì locations đã tự cập nhật. Fog sau TheTideRises gỡ FalconPoint có thể đổi môi trường hoàn toàn xuống ngầm. In Too Deep đã có bốn mức thủy triều, Vanishing đã sửa hình; không làm lại vô cớ |
| Scarlet Keys | Congress đã đổi halls → Otherworld khi Tower vào bàn; WithoutTrace đã dùng sprite, giữ. Dead Heat cần ngày → đêm từ Gnashing Teeth 1B và vines theo nhánh ritual/Amaranth, **không gán cháy cả thành phố vì tên Dead Heat**. RiddlesRain/SanguineShadows/DealingsDark/DancingMad giữ thành phố, kiểm phòng thực nằm trong hotel/club; DogsWar ba nhánh vẫn cần mọi khu đang chơi và barrier thật; ShadesSuffering thay trạng thái địa phương theo nội dung công khai, chưa khóa trigger vẽ mới |
| Hemlock Vale | WrittenRock/LostSister/SilentHeath/ThingDepths/TwistedHollow/LongestNight đã sprite theo ô, giữ. HemlockHouse đã giấu phòng trước lật. FateVale đã về village khi layout diamond nhưng còn các nhánh cosmicEmissaryLayout/abyssRevealedLayout: cần đối chiếu đủ để thêm cảnh riêng nếu phần chơi đã chuyển vùng. Prelude dùng cùng làng, nên có final-day không khí lễ hội/biến dạng theo dữ liệu thật, không đổi nhà sai địa lý |
| Drowned City | Doom II đã mask Ruined theo mã. Ngoài Apiary ở trên: DrownedQuarter cần cảnh **core active/inactive** theo 11540 và flood từng nơi, CourtAncients cần elevator inactive/active và nhánh East/West/flood; GrandVault kiểm MovingPlatform hoán đổi và mask nước, không chỉ ghim cố định. WesternWall đã xử lý lá xáo; ObsidianCanyons đã sprite. OneLastJob giữ cảnh phố với nội thất shop/restaurant có thể thêm mặt cắt; Sepulchre kiểm cửa/chamber mở muộn; Doom I có rooftop tiếp cận được và flood theo khu |
| Brethren of Ash | SpreadingFlames đã có bốn ảnh, giữ nguồn lửa nhất quán; room bị gỡ không xóa diễn biến lửa theo Agenda. SmokeMirrors là nhiều khu Arkham còn đồng thời, không đủ bằng chứng phải đổi toàn cảnh. QueenAsh cần bộ nghi thức/lửa như trên |
| Children of Blood | RiverBlood ngày/đêm, NewHorizons factory/caves ngày/đêm, BloodMoney BloodyNight đã làm. Giữ và kiểm trạng thái location thay khi Undo/reload; không tạo thêm biến thể chỉ theo tên Act |
| Carnevale | Các location xáo quanh tuyến vòng, chưa có model sprite riêng. Kiểm hướng đi vòng, nối church và số bản cùng mã; ưu tiên nền Venice + sprite theo slot, thay vì neo identity làm mất hướng theo luật |
| Rougarou | Đã có panorama bayou mới; location xáo phải giữ mặt úp chung và đúng nhóm Bayou/NewOrleans. Chưa thấy yêu cầu đổi toàn bộ cảnh mỗi Agenda |
| Machinations Through Time | Tranh đã biểu diễn ba thời đại đồng thời. Đúng hướng cho bàn có nhiều thời đại cùng tồn tại; không thay toàn nền theo người đang hành động. Cần group/mặt cắt nội thất từng era, đóng/mở vùng theo state thật và phân biệt standalone/epic |
| Fortune and Folly | Đã có casino cutaway. Cần phân biệt cả hai scenario ID 88001/88001b, giai đoạn planning/heist và phòng hạn chế mở muộn; biến thể báo động chỉ từ trạng thái luật đã xác nhận, không số Agenda chung |
| Excelsior Hotel | Cutaway đã có 10 location. Giữ kiến trúc; nên thêm trạng thái theo nhánh threat cuối sau khi kết hợp Leads, nhưng không vẽ hung thủ/hiện thân lên nền khi nó còn là enemy hoặc chưa công khai |
| War of the Outer Gods | Các khu phố và Hub đã vẽ. Ba cult/Agenda độc lập cần **vùng ảnh riêng theo cult/mở Hub**, không một max agenda phủ tận thế lên cả bản đồ |
| Blob | Đã dùng sprite và lưới Blackwater; giữ. Hiệu ứng nơi bị ăn dựa location/removed state, không vẽ sẵn các công trình còn nguyên sau khi biến mất |
| Midwinter Gala | Đã có điểm tạm → phòng đúng sau lật. Giữ; trạng thái mất điện/hỗn loạn chỉ thêm sau khi khóa nhánh bằng source, không tự gán từ tên Agenda |
| Traces to Nowhere | Đã có city → underground cutaway theo location Otherworld. **Các nơi trên phố không bị gỡ hết**, nên hiện chưa có bằng chứng để bỏ toàn bộ phố và chỉ giữ hang. Có thể cho xem riêng vùng ngầm, vẫn truy cập vùng phố và đường nối hợp lệ |

## Challenge scenarios chưa được đăng ký panorama

Các ID `90004, 90011, 90020, 90032, 90041, 90054, 90065, 90094` chưa có route panorama; bộ chọn hiện tra ID, không tự fallback theo reference.

| Màn | Cách làm |
|---|---|
| Read or Die | Miskatonic có Faculty Offices hai trạng thái và Alchemy Labs; có thể tái dùng campus nhưng **phải map đúng challenge**. Phụ thuộc asset Dunwich agent khác đang làm |
| All or Nothing | Clover Club, thêm biến thể lounge và tùy chọn Return. Phối hợp agent Dunwich; không tự sửa asset/selector của họ |
| Bad Blood | Panorama Arkham có Velma's Diner, Town Hall, Shoppe và địa điểm nhánh. Không alias mù sang MidnightMasks vì khác tập địa danh |
| By the Book | Có thể dùng Arkham panorama, gắn đúng location/challenge state; không thêm Your House nếu không trong ván |
| Red Tide Rising | Innsmouth với First National Grocery, Gilman House, Little Bookshop; tận dụng panorama Vanishing nếu đủ landmark, bổ sung room/anchor còn thiếu |
| Laid to Rest | Tái dùng WagesOfSin graveyard + chapel attic/crypt; giữ logic challenge riêng, không áp Agenda của bản gốc nguyên xi |
| Relics of the Past | Tái dùng Eztli có Inner Chamber và các variant challenge; cần mapping bổ sung rồi mới dùng chung tranh |
| Enthralling Encore | Dùng nhà hát nhưng challenge có nội dung riêng. Phối hợp agent Carcosa nếu mượn tranh, chưa nằm trong việc audit/sửa campaign của họ |

## Backlog đề xuất để triển khai

1. **Sửa sai không gian đang chơi:** HeartMadnessII escape, FilmFatale bốn thế giới, LairDagon lodge/caves, Apiary các nhánh. Song song bổ sung Unstuck ring, Starfall tàu cập bến và room-simulation/flip của DarkMatter.
2. **Phủ phần chưa có Scene Map:** Guardians hai màn; Phantom, Usher, Constellation, Wendigo; CircusExMortis tám màn; rồi các standalone homebrew còn lại. EndOfSeasons triển khai được; bảy Vespers shell phải có backend trước.
3. **Nâng môi trường dựa state:** Boundary từng thời đại, Yoth theo depth, QueenAsh nghi thức/lửa, DeadHeat ngày/đêm/vines, Maelstrom/Fog đổi background theo location; Core/Elevator/Pylons và các vùng collapse.
4. **Nâng chi tiết/QA:** mặt cắt phòng trong campus/manor/ship/world scenes, nhiều bản cùng mã, Return/challenge; loại các dấu watermark/sparkle còn thấy trên một số tranh cũ; kiểm thống nhất địa hình giữa các biến thể. Không generate ảnh bằng Gemini.

Mỗi gói ảnh cần có: tập location ở từng pha; trigger chọn ảnh; bảng điểm đứng riêng theo pha; ảnh tham chiếu cùng khung cho biến thể; preview có ghim; trạng thái trước/sau/mixed/Undo/reload; source chứng minh khi nào location rời hoặc trở lại bàn. Không chốt số ảnh toàn dự án trước khi khóa đủ nhánh: mask và sprite sẽ giảm rất nhiều ảnh tổ hợp.

## Nguồn chính cho phát hiện ưu tiên

Đường dẫn bên dưới tính từ root repository; số dòng và nội dung đã đọc tại lúc audit. Báo cáo không thay thế source khi agent khác tiếp tục sửa cùng workspace.

- [Bộ chọn tranh/ghim](../../frontend/src/arkham/hemlock-overview.ts), [vị trí sau lật](../../frontend/src/arkham/revealed-scene-positions.ts), [chuyển vùng Dream-Eaters](../../frontend/src/arkham/scene-anchors-the-dream-eaters.ts), [render location thực tế](../../frontend/src/arkham/components/LocationMap.vue).
- [HeartMadness escape Act](../../backend/arkham-api/library/Arkham/Act/Cards/EdgeOfTheEarth/TheHeartOfMadness/CollapseThePylons.hs), [escape Agenda](../../backend/arkham-api/library/Arkham/Agenda/Cards/EdgeOfTheEarth/TheHeartOfMadness/ThatWhichHasNoName.hs).
- [FilmFatale đổi thế giới](../../backend/arkham-api/library/Arkham/Act/Cards/FilmFatale/AndresRequest.hs), [LairDagon thay bàn](../../backend/arkham-api/library/Arkham/Act/Cards/TheInnsmouthConspiracy/TheLairOfDagon/TheFirstOath.hs), [Apiary branching](../../backend/arkham-api/library/Arkham/Act/Cards/TheDrownedCity/TheApiary/UnsettlingSigns.hs).
- [Boundary thay thời đại](../../backend/arkham-api/library/Arkham/Act/Cards/TheForgottenAge/TheBoundaryBeyond/PastAndPresent.hs), [Yoth dựng lại tầng](../../backend/arkham-api/library/Arkham/Act/Cards/TheForgottenAge/TheDepthsOfYoth/JourneyToTheNexus.hs), [OnThinIce thêm Lair](../../backend/arkham-api/library/Arkham/Act/Cards/TheScarletKeys/OnThinIce/ProwlingNightmare.hs).
- [QueenAsh thức dậy](../../backend/arkham-api/library/Arkham/Agenda/Cards/BrethrenOfAsh/QueenOfAsh/ARitual.hs), [Guardians đi qua gate](../../backend/arkham-api/library/Arkham/Act/Cards/GuardiansOfTheAbyss/TheNightsUsurper/IntoTheGate.hs), [Labyrinths ba nhóm](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheLabyrinthsOfLunacy.hs).
- [Unstuck vòng xoay](../../backend/arkham-api/library/Arkham/Homebrew/AgesUnwound/Scenarios/Unstuck/Helpers.hs), [hai Act deck](../../backend/arkham-api/library/Arkham/Homebrew/AgesUnwound/Scenarios/AWorldTornDownAgain/Helpers.hs), [TimeRunsOut biến mất](../../backend/arkham-api/library/Arkham/Homebrew/AgesUnwound/Scenarios/TimeRunsOut/Helpers.hs).
- [DarkMatter simulation/flip](../../backend/arkham-api/library/Arkham/Homebrew/DarkMatter/Helpers.hs), [Starfall docking](../../backend/arkham-api/library/Arkham/Homebrew/DarkMatter/Locations/TheCassilda.hs), [Starfall xóa nơi](../../backend/arkham-api/library/Arkham/Homebrew/DarkMatter/Agendas/DarkMatterAgenda.hs).
- [Phantom xuống cống](../../backend/arkham-api/library/Arkham/Homebrew/ThePhantomOfTheOpera/Acts/ChasingGhosts.hs), [Phantom thay cống bằng domain](../../backend/arkham-api/library/Arkham/Homebrew/ThePhantomOfTheOpera/Acts/ThePhantomsDomain.hs), [Usher sập phòng](../../backend/arkham-api/library/Arkham/Homebrew/TheFallOfTheHouseOfUsher/Helpers.hs), [Constellation các deck](../../backend/arkham-api/library/Arkham/Homebrew/ConsternationOnTheConstellation/Scenarios/ConsternationOnTheConstellation.hs), [Wendigo grid](../../backend/arkham-api/library/Arkham/Homebrew/AgainstTheWendigo/Scenarios/AgainstTheWendigo.hs).

## Kiểm tra và giới hạn

- Script audit chạy thành công; đường dẫn source/ảnh trong inventory và các liên kết report được kiểm lại khi kết thúc. Năm contact sheet là bằng chứng xem tranh cấp toàn cảnh, không phải screenshot game.
- [Probe chọn cảnh](../261117-2321-scene-immersion-audit/verify-audit.mjs) và [kết quả](../261117-2321-scene-immersion-audit/verification.log) xác nhận bốn selector còn trả cùng nền ở layout cuối, Unstuck không đổi điểm địa danh khi hoán đổi ô, hai Halls thiếu điểm và 10 ID official/challenge thiếu panorama. Đây là kiểm hàm thuần với snapshot đầu vào, không phải replay backend hoặc ván live.
- Không sửa runtime, test hoặc asset game; không chạy lại typecheck/game tests chỉ để kiểm tài liệu. Không tiếp quản hoặc hoàn tác thay đổi của agent khác.
- Chưa chạy ván thử cho mọi nhánh, số người chơi, các tổ hợp Return/challenge, đa thời đại và nhiều bản cùng mã. Các phát hiện mô hình/thiếu selector đã có bằng chứng source; mức độ che/đè ghim thực tế cần browser snapshot.
- Chưa đưa toàn bộ artwork từng lá qua đối chiếu thị giác. Không dùng chữ “chính xác tuyệt đối” cho các cảnh mới chỉ xem thumbnail/source.

## Chưa xác định

- Trigger mỹ thuật cụ thể cho các đề xuất ghi rõ “chưa khóa” cần đọc thêm lời dẫn lá/guide trước khi generate, không cần hỏi người dùng về luật có thể tra trong dữ liệu.
- Bảy NightOfVespers shell thiếu vòng đời runtime để tích hợp scene chuẩn. Có thể chuẩn bị art brief, nhưng không nghiệm thu hoạt động cho tới khi backend đủ.
