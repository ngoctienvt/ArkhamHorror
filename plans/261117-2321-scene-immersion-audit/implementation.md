# Thực hiện nâng cấp Scene Map

Status: in progress — đã tích hợp 297 tài sản; còn hai gói ảnh bị chặn bởi hạn mức GPT Image. Người dùng đã yêu cầu thực hiện toàn bộ backlog ngày 17/11/2026. Checkpoint cuối và [phần bị chặn](blocked-art.md) thay thế trạng thái các checkpoint cũ bên dưới.

## Phạm vi

- Theo báo cáo audit và coverage; không sửa campaign Dunwich/Path to Carcosa hoặc asset agent khác sở hữu.
- Giữ các cải thiện đã có. Dùng module riêng cho trạng thái/anchor mới, tích hợp tối thiểu vào renderer.
- Theo điều chỉnh của người dùng ngày 18/11: tạm bỏ qua bảy Night of Vespers shell chưa có backend; không tạo concept/brief cho chúng. Giữ The End of Seasons vì đã có setup và diễn biến Act.

## Các gói thực hiện

- [x] Thay bàn: Heart Madness escape, Film Fatale, Dagon, Apiary, Guardians, Phantom.
- [x] Lưới/hoán vị: City/facility, Unstuck, Wendigo, Circus forests/train, Halls; bổ sung Fatal Mirage, Court và Vault.
- [x] Trạng thái cục bộ: Boundary, Dark Matter simulation/Carcosa/Starfall, Usher, Queen Ash, core/elevator/pylons. Core hai mặt cùng minh họa; giữ ảnh, dùng trạng thái nước hiện hữu.
- [ ] Phủ panorama homebrew, challenge và các biến thể môi trường còn thiếu.
- [x] QA file/alpha/contact sheets, snapshot/Undo, tests/typecheck/build và Chrome preview; chưa playtest đầy đủ trên ván backend.

## Kiểm chứng

Debug log Scene Map hiện có được giữ. Mỗi nhóm có tests chọn cảnh và định vị trước/sau thay bàn; ảnh phải tồn tại trong public và được duyệt trước khi nghiệm thu.

## Tiến độ thực hiện 18/11

- Đã tích hợp bộ chọn snapshot riêng: `scene-stage-overview.ts`; không sửa module Dunwich/Carcosa.
- Đã có ảnh + logic: Heart Madness escape, ba thế giới Film Fatale, Dagon caves, Apiary Hive Mind, Phantom bốn pha, Boundary sáu vùng, Fragment hai thực tại, Unstuck vòng, Starfall tàu cập bến, Usher từng phòng, Constellation từng phòng ngập, Masque midnight.
- Đã tạo và ghim panorama: And Then There Were None, Invisible Man, Sleepy Hollow; Guardians Cairo/trước cổng/Abyss. Cairo không lộ Eldritch Gate từ đầu.
- Antarctic: đã tích hợp phòng bám ô, tâm vùng nhiều hàng và Mist-Pylon theo modifier `collapsed`; bộ sprite/nền đang hoàn tất và cần QA tập đầy đủ.
- Queen of Ash: đã tạo ba trạng thái cùng hình học, tách phòng Sluice Control, logic Elokoss/Agenda và tránh phòng úp trùng điểm phòng đã lật. Cần QA ảnh/ghim/test bổ sung.
- Strange Moons: đã tích hợp simulation cục bộ trong orb; sáu ảnh đang tạo. Wendigo: đã tích hợp lưới, bộ sprite đang tạo.
- Đã chạy đạt 13 tests stage + 27 tests graph. Typecheck đã đạt sau module Antarctic; cần chạy lại sau các nhóm tiếp theo.
- Đã xuất và duyệt 19 bản ghim trong `previews/`; đây là QA tranh/ghim, chưa phải kiểm ván trên browser. CLI agent-browser không có trên máy.

## Còn phải hoàn thiện

Checkpoint 18/11, 13:15: Antarctic/Wendigo/simulation đã đủ file; Yoth, On Thin Ice, Labyrinth, Jekyll, End of Seasons và tám alias challenge đã tích hợp. Police asset đã tồn tại và ghim được hiệu chỉnh theo ảnh thực (78,43). Zann đã có sáu biến thể nội thất toàn cảnh, chuyển từ sprite phòng sang mask theo backstage1..4; tiêu âm 013 đã sửa theo phản hồi thành baffle nông sát tường. Hai lượt 017/018 bị prompt thiếu đã bị thay bằng ảnh đúng; không dùng các ảnh lỗi. Chrome preview đã kiểm bốn nội thất khác nhau cùng khung, không còn chông. 27 tests stage/off-map đạt; typecheck đạt sau Zann. Đây vẫn là kiểm snapshot và preview, chưa là playtest đầy đủ.

- Đang làm Circus: đã đọc setup/Act/EnemyAsSelfLocation và tải tranh lá công khai; xác nhận các bản Crowded Row/Secluded Tent/Towering Dark Young dùng chung tranh. Panorama grounds và Bacchanalia đang tạo. Backlog bên dưới chưa được đánh dấu hoàn thành chỉ vì đã có asset.

Checkpoint tiếp theo 18/11 buổi chiều:

- Circus: đủ 54 sprite, 6 nền/panorama, `scene-circus.ts` đã tích hợp cả 8 scenario. Đọc enemy từ `state.enemies` và Path Forward từ `state.stories`, không giả chúng là location trong JSON. Figures chỉ là artwork; thẻ tương tác đặc biệt hiện có vẫn do Card Board/UI hiện hữu xử lý. Red Sunrise giữ nhóm hàng và thứ tự `group.index`; Harm's Way giữ 4 góc Dark Young kể cả khi một enemy rời play. Cần QA browser và asset toàn bộ nhánh.
- Apiary: đã xác nhận Hive Mind gỡ tất cả ngoài vòng 4 phòng + Central Chamber; không đảo quyết định này. Lost Pilgrims giữ hang cũ. Đã tạo region mới đủ 10 khu và đang bổ sung bản Nest cùng khung; module `scene-apiary.ts` chọn theo tập location, giữ Hive Mind panorama 5 phòng.
- Dark Matter: Electric Nightmare đổi sang sprite bám ô (7 phòng + back + floor đã có); Lost Quantum có variant ổn định chỉ khi Act Quantum Zeno `:dark-matter:092` và đủ 8 Elbrus đều có resource. Không dùng Act number 2 vì Destabilization cũng là Act 2. Machine in Yellow dùng chung Ward Theatre bằng alias, không sửa asset Carcosa.
- Challenge: đủ tám alias + ba mã thay thế Relics `90070/71/72` đã ghim vào phòng tương ứng. Thêm tests. 29 stage tests đạt ở checkpoint này; typecheck đã đạt sau Dark Matter/Circus, cần chạy lại sau Ages.
- Ages: `scene-ages-unwound.ts` đã thêm school, Featureless Streets, Time Runs Out tiles, Myriad và Night of Fire anchors. School có ba Classroom riêng. Again có thể đặt CẢ BA Ritual Circle 173/224/225; đọc Acts BigAndUgly_161/DoorwayToTheUnknown_162, không coi chúng loại trừ nhau. School temporal master đã tạo, sealed master và Featureless Streets đang tạo; cần mask/ghim QA. Time Runs Out đang tạo 12 sprite từ tranh lá; normal paired printings chung địa danh, các back location thực 189b/191b/201b/202b được phân biệt. Mất location dưới Agenda => sprite biến mất theo snapshot. World map refined đang tạo cho Library trong London và Realm nối Paris; CHƯA tích hợp branch 105.
- Carnevale: đã xác nhận Gondola `82006b` gỡ TOÀN BỘ Venice cũ (`Locations/.../Gondola.hs`). Cần vòng sprite theo location1..8 trước đó, full lagoon/Gondola sau đó. 10 sprite Venice và 2 nền đang tạo. Boss Cnidathqua là ENEMY 82027; 82006 là Act Get to the Boats, không dùng làm monster reference. CHƯA viết module Carnevale.
- Còn đọc kỹ: Great Lift Court di chuyển giữa level theo PlaceGrid (không được ghim mã 11622 mãi ở đáy); Barrier Core active/inactive của Drowned Quarter; Moving Platform Grand Vault swap; Dead Heat ngày/đêm và vines; Hub Dimension War trước/sau công khai. Contact sheet `previews/existing-scenes-review.jpg` đã duyệt tổng quan. Fortune/Folly đã có 14 phòng cutaway; Excelsior 10 nơi; Machinations cả 3 thời đại cùng khung; Maelstrom background trống là nền phụ cho sprite, không phải thiếu ảnh.

Các job tạo ảnh có thể bị ngắt bởi steering: kiểm file/manifest thực tế trước khi gọi lại, không tin cell ID cũ. Không nhận xong toàn bộ plan cho tới khi bổ sung checks, QA và cập nhật danh sách còn lại.

- Thu hồi tất cả job tạo ảnh; kiểm alpha, khung hình và asset existence cho toàn bộ nhánh mới.
- Official: Yoth theo CurrentDepth; On Thin Ice giữ Alaska khi mở lair; Labyrinth ba nhóm; Lost Pilgrims; Fog/Maelstrom biến đổi môi trường; các đề xuất trong coverage chưa khóa trigger.
- Homebrew: Erich Zann, Jekyll/Hyde (arrangement là vùng tham chiếu, không phải năm tòa nhà nữa); Circus; các mốc Ages Unwound; Machine in Yellow; Lost Quantum; End of Seasons.
- Night of Vespers: bảy shell được người dùng cho phép tạm bỏ qua; không còn là hạng mục phải thực hiện đợt này.
- Challenge tám ID và các nhánh Return to tương ứng; không chạm asset campaign agent khác.
- Tests bổ sung cho Queen/simulation/Wendigo/Guardians và các nhóm sau; typecheck, review, QA browser trong khả năng thực tế.

Ảnh xuất và nguồn: `generated-art.json`. Prompt: `prompt-*.txt`. Tạo lại bản ghim: `node export-previews.mjs`, sau đó `python render-previews.py` (chạy từ repo với đường dẫn đầy đủ tới script).

## Checkpoint cuối 18/11 — trạng thái dùng để tiếp tục

Các job ở checkpoint cũ đã được thu hồi: **297 WebP**, gồm **213 sprite RGBA** và **84 panorama/nền/biến thể**. Tất cả file trong manifest tồn tại; 213 sprite đều có alpha trong suốt. Đã duyệt contact sheets 1–18 sprite và 1–7 panorama; không dùng hai ảnh Zann lỗi prompt trước đây.

- Apiary region/Nest đủ 10 địa danh, Hive Mind giữ đúng nhánh gỡ bàn. School sealed/temporal/Featureless Streets đủ và mask ba Classroom/ba Circle theo snapshot; Myriad/Night of Fire ghim đã có.
- A Year to Plan đã tích hợp map clear và mask riêng Library 143/Realm 142. Time Runs Out đủ 12 sprite; backs chỉ ánh xạ khi backend thực sự còn là location.
- Fatal Mirage thay panorama thiếu phòng bằng 19 ảnh ký ức khác nhau + back + floor. Court/Vault dùng lưới thực; Great Lift và Moving Platform không còn ghim cố định; Cistern trùng mã giữ ID riêng. Các mức nước dùng hiệu ứng location sẵn có.
- Carnevale đã tích hợp vòng Venice, Gondola tile, toàn cảnh thuyền sau khi bàn cũ rời play và Cnidathqua công khai. Hiệu ứng mask chân monster hòa vào mặt nước; tương tác enemy vẫn do UI hiện hữu.
- War of the Outer Gods dùng cảnh trước Hub cho tới khi 86024 vào bàn. Ba Agenda không bị gộp thành một mức môi trường toàn cầu. Barrier Core hai mặt cùng tranh; không tự suy diễn “inactive” nghĩa là tắt mọi ánh sáng.
- Dead Heat mới hoàn tất hiệu chỉnh 5 điểm và các mã Abandoned. **Chưa có ảnh đêm/dây leo/lửa**. Fate of the Vale **chưa có sprite mới cho các bố cục Nest/Abyss**, giữ nhánh làng đêm sẵn có. Hai batch GPT Image đều bị `usage_limit_reached`; không để lại tham chiếu file thiếu. Chi tiết nguồn, prompt và bước nối tiếp trong [blocked-art.md](blocked-art.md).
- Tám challenge dùng alias cảnh tương ứng, không sửa asset/module campaign Dunwich/Carcosa. Những đề xuất Fortune/Folly, Excelsior và Machinations giữ thiết kế hiện có sau đối chiếu: các vùng/phòng vẫn cùng tồn tại, threat cuối thể hiện qua entity công khai. Maelstrom giữ nền phụ trống cho các sprite động đã có.

Kiểm chứng cuối: **73/73 tests** stage + off-map + graph; typecheck đạt; Vite production compile đạt. Log: `validation-tests.log`, `validation-typecheck.log`, `validation-build.log`. Build tách khỏi public assets và không chạy prebuild slim-cards. Cảnh báo bundle lớn/eval từ thư viện có sẵn vẫn còn.

Đã xuất **53 fixture boards** trong `previews/scene-browser-preview.html`, chụp thêm 14 Chrome preview và duyệt các nhóm chính (School, world map, Apiary Nest, Fatal Mirage, Court/Vault, Venice/Gondola, Electric backs, train, Dead Heat points). Một số fixture là atlas các bản có thể xuất hiện để kiểm file/khung, không phải ván hợp lệ có tất cả lá cùng lúc. QA này kiểm tranh/mask/ghim, **không phải mount Vue đầy đủ hay playtest mọi ván backend**. `ak-code-review` đã review selectors/renderer và đối chiếu các backend liên quan; không có lỗi runtime xác nhận trong phạm vi review. Các đường dẫn ảnh được kiểm ngay trong mọi invocation test, gồm layers và figures.

Plan còn in progress vì hai gói ảnh nêu trên. Bảy Vespers shell vẫn được bỏ qua theo yêu cầu; không tính chúng vào phần bị chặn. Không tạo dev server, không commit/push, không dừng tiến trình của chat khác.
