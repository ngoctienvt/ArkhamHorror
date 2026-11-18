# Ma trận bao phủ Scene Map

Sàng lọc source/cấu hình và tranh panorama; không phải danh sách các ván đã playtest. 
“Giữ + QA” không chứng nhận mọi nhánh chính xác. “Đề xuất” cần khóa trigger trước khi generate.

Đây là ma trận audit ban đầu. Trạng thái triển khai mới nhất nằm trong [implementation.md](implementation.md); không dùng các ô “Thiếu scene” lịch sử bên dưới để suy ra hiện vẫn thiếu.

[Báo cáo và bằng chứng sâu](../reports/audit-261117-2321-scene-immersion.md).

## Standalone

| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |
|---|---|---|---|
| [All or Nothing](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/AllOrNothing.hs) `90011` | Chưa đăng ký panorama | Thiếu scene | All or Nothing: Clover Club + variants; dependency agent Dunwich |
| [Bad Blood](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/BadBlood.hs) `90020` | Chưa đăng ký panorama | Thiếu scene | Bad Blood: Arkham thêm Diner, TownHall, Shoppe và nơi nhánh |
| [By the Book](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/ByTheBook.hs) `90032` | Chưa đăng ký panorama | Thiếu scene | By the Book: có thể reuse Arkham sau mapping đúng |
| [Carnevale of Horrors](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/CarnevaleOfHorrors.hs) `82001` | side-stories/carnevale-of-horrors | Sửa | Kiểm tuyến vòng/hướng và location xáo; sprite theo slot |
| [Curse of the Rougarou](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/CurseOfTheRougarou.hs) `81001` | side-stories/curse-of-the-rougarou | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [Enthralling Encore](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/EnthrallingEncore.hs) `90094` | Chưa đăng ký panorama | Thiếu scene | Enthralling Encore: nhà hát; dependency asset agent Carcosa |
| [Film Fatale](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/FilmFatale.hs) `72001` | side-stories/film-fatale | Sửa | Phim trường và ba thế giới riêng; trở lại studio; nhánh cosmos theo lưới |
| [Fortune And Folly](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/FortuneAndFolly.hs) `88001` | side-stories/fortune-and-folly | Đề xuất | Casino cutaway; kiểm cả 88001b/heist và phòng mở muộn |
| Cùng file, định nghĩa thêm | `88001b` Fortune And Folly | Đã kiểm kê | Đọc cùng source, không tính thành file mới |
| [Laid to Rest](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/LaidToRest.hs) `90054` | Chưa đăng ký panorama | Thiếu scene | Laid to Rest: reuse graveyard nhưng trigger challenge riêng |
| [Machinations Through Time](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/MachinationsThroughTime.hs) `87001` | side-stories/machinations-through-time | Đề xuất | Ba thời đại đồng thời: giữ các vùng, không theo riêng người đang đi |
| [Murder at the Excelsior Hotel](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/MurderAtTheExcelsiorHotel.hs) `84001` | side-stories/murder-at-the-excelsior-hotel | Đề xuất | Giữ khách sạn 10 nơi; nhánh threat cuối không lộ trước khi công khai |
| [Read or Die](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/ReadOrDie.hs) `90004` | Chưa đăng ký panorama | Thiếu scene | Read or Die: campus + Faculty/Alchemy; dependency agent Dunwich |
| [Red Tide Rising](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/RedTideRising.hs) `90041` | Chưa đăng ký panorama | Thiếu scene | Red Tide Rising: Innsmouth có Grocery/Gilman/Bookshop |
| [Relics of the Past](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/RelicsOfThePast.hs) `90065` | Chưa đăng ký panorama | Thiếu scene | Relics of the Past: Eztli thêm Inner Chamber/variants |
| [The Blob That Ate Everything](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheBlobThatAteEverything.hs) `85001` | side-stories/the-blob-that-ate-everything | Giữ + QA | Đã sprite theo grid; kiểm nơi bị Blob ăn |
| [The Labyrinths of Lunacy](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheLabyrinthsOfLunacy.hs) `70001` | side-stories/the-labyrinths-of-lunacy | Sửa | Ba group/layout, nhiều Halls phải có điểm theo ID/label |
| [The Midwinter Gala](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheMidwinterGala.hs) `71001` | side-stories/the-midwinter-gala | Giữ + QA | Đã có phòng sau lật; chưa khóa trigger biến thể môi trường |
| [Traces to Nowhere](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TracesToNowhere.hs) `73001` | side-stories/traces-to-nowhere | Giữ + QA | Đã mở cutaway ngầm; chưa có bằng chứng nên xóa hết phố |
| [War of the Outer Gods](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/WarOfTheOuterGods.hs) `86001` | side-stories/war-of-the-outer-gods | Đề xuất | Ba cult/Agenda độc lập, môi trường theo vùng và Hub |

## BrethrenOfAsh

| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |
|---|---|---|---|
| [Queen of Ash](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/BrethrenOfAsh/QueenOfAsh.hs) `12168` | brethren-of-ash/queen-of-ash | Sửa | Cistern, Sluice Control và diễn biến Fire/Elokoss theo state |
| [Smoke and Mirrors](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/BrethrenOfAsh/SmokeAndMirrors.hs) `12133` | brethren-of-ash/smoke-and-mirrors | Giữ + QA | Các khu Arkham vẫn cùng chơi; chưa xác nhận cần thay toàn cảnh |
| [Spreading Flames](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/BrethrenOfAsh/SpreadingFlames.hs) `12105` | brethren-of-ash/spreading-flames | Giữ + QA | Đã có bốn ảnh và nguồn lửa liên tục; room rời không reset lửa |

## ChildrenOfBlood

| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |
|---|---|---|---|
| [Blood Money](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/ChildrenOfBlood/BloodMoney.hs) `13068` | children-of-blood/blood-money | Giữ + QA | Đã có Bloody Night khi Foyer thay lá |
| [New Horizons](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/ChildrenOfBlood/NewHorizons.hs) `13031` | children-of-blood/new-horizons | Giữ + QA | Đã có factory/caves và ngày/đêm |
| [River of Blood](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/ChildrenOfBlood/RiverOfBlood.hs) `13001` | children-of-blood/river-of-blood | Giữ + QA | Đã có ngày/đêm và Dusk difficulty |

## EdgeOfTheEarth

| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |
|---|---|---|---|
| [City of the Elder Things](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/EdgeOfTheEarth/CityOfTheElderThings.hs) `08621` | the-edge-of-the-earth/city-of-the-elder-things | Sửa | City landscapes xáo vào grid, cần hình bám ô của từng bản |
| [Fatal Mirage](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/EdgeOfTheEarth/FatalMirage.hs) `08549` | the-edge-of-the-earth/fatal-mirage | Đề xuất | 19 memory landmarks, làm rõ phòng bên trong ký ức; không ép thành campus thật |
| [Ice and Death](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/EdgeOfTheEarth/IceAndDeathPart1.hs) `08501a` | the-edge-of-the-earth/ice-and-death-part-1 | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [Ice and Death](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/EdgeOfTheEarth/IceAndDeathPart2.hs) `08501b` | the-edge-of-the-earth/ice-and-death-part-2 | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [Ice and Death](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/EdgeOfTheEarth/IceAndDeathPart3.hs) `08501c` | the-edge-of-the-earth/ice-and-death-part-3 | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [The Heart of Madness](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/EdgeOfTheEarth/TheHeartOfMadnessPart1.hs) `08648a` | the-edge-of-the-earth/the-heart-of-madness-part-1 | Sửa | Facility xáo theo vòng/spoke; mô hình phòng theo ô thay ghim mã cố định |
| [The Heart of Madness](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/EdgeOfTheEarth/TheHeartOfMadnessPart2.hs) `08648b` | the-edge-of-the-earth/the-heart-of-madness-part-2 | Sửa | Pha escape: giữ Gate, toàn cảnh bốn Ramp và Hidden Tunnel; cả Act/Agenda đều kích hoạt |
| [To the Forbidden Peaks](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/EdgeOfTheEarth/ToTheForbiddenPeaks.hs) `08596` | the-edge-of-the-earth/to-the-forbidden-peaks | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |

## GuardiansOfTheAbyss

| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |
|---|---|---|---|
| [The Eternal Slumber](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/GuardiansOfTheAbyss/TheEternalSlumber.hs) `83001` | Chưa đăng ký panorama | Thiếu scene | Cairo/sa mạc/Explore; chưa đăng ký panorama |
| [The Night's Usurper](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/GuardiansOfTheAbyss/TheNightsUsurper.hs) `83016` | Chưa đăng ký panorama | Thiếu scene | Trước cổng → toàn cảnh Abyss khi bàn cũ rời play |

## NightOfTheZealot

| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |
|---|---|---|---|
| [The Devourer Below](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/NightOfTheZealot/TheDevourerBelow.hs) `01142` | night-of-the-zealot/devourer-below | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [The Gathering](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/NightOfTheZealot/TheGathering.hs) `01104` | Study → house cutaway (logic riêng) | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [The Midnight Masks](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/NightOfTheZealot/TheMidnightMasks.hs) `01120` | night-of-the-zealot/midnight-masks | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |

## ReturnToNightOfTheZealot

| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |
|---|---|---|---|
| [The Devourer Below](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/ReturnToNightOfTheZealot/ReturnToTheDevourerBelow.hs) `50032` | night-of-the-zealot/devourer-below | Theo bản gốc + QA | Áp phát hiện bản gốc; kiểm location bổ sung/thay thế và mã Return to riêng |
| [Return to The Gathering](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/ReturnToNightOfTheZealot/ReturnToTheGathering.hs) `50011` | night-of-the-zealot/return-to-the-gathering | Theo bản gốc + QA | Áp phát hiện bản gốc; kiểm location bổ sung/thay thế và mã Return to riêng |
| [Return to The Midnight Masks](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/ReturnToNightOfTheZealot/ReturnToTheMidnightMasks.hs) `50025` | night-of-the-zealot/midnight-masks | Theo bản gốc + QA | Áp phát hiện bản gốc; kiểm location bổ sung/thay thế và mã Return to riêng |

## ReturnToTheCircleUndone

| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |
|---|---|---|---|
| [Return to At Death's Doorstep](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/ReturnToTheCircleUndone/ReturnToAtDeathsDoorstep.hs) `54024` | the-circle-undone/return-to-the-twilight-estate | Theo bản gốc + QA | Áp phát hiện bản gốc; kiểm location bổ sung/thay thế và mã Return to riêng |
| [Return to Before the Black Throne](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/ReturnToTheCircleUndone/ReturnToBeforeTheBlackThrone.hs) `54056` | the-circle-undone/before-the-black-throne | Theo bản gốc + QA | Áp phát hiện bản gốc; kiểm location bổ sung/thay thế và mã Return to riêng |
| [Return to Disappearance at the Twilight Estate](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/ReturnToTheCircleUndone/ReturnToDisappearanceAtTheTwilightEstate.hs) `54016` | the-circle-undone/return-to-the-twilight-estate | Theo bản gốc + QA | Áp phát hiện bản gốc; kiểm location bổ sung/thay thế và mã Return to riêng |
| [Return to For the Greater Good](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/ReturnToTheCircleUndone/ReturnToForTheGreaterGood.hs) `54042` | the-circle-undone/return-to-for-the-greater-good | Theo bản gốc + QA | Áp phát hiện bản gốc; kiểm location bổ sung/thay thế và mã Return to riêng |
| [Return to In the Clutches of Chaos](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/ReturnToTheCircleUndone/ReturnToInTheClutchesOfChaos.hs) `54049` | the-circle-undone/in-the-clutches-of-chaos | Theo bản gốc + QA | Áp phát hiện bản gốc; kiểm location bổ sung/thay thế và mã Return to riêng |
| [Return to The Secret Name](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/ReturnToTheCircleUndone/ReturnToTheSecretName.hs) `54029` | the-circle-undone/the-secret-name | Theo bản gốc + QA | Áp phát hiện bản gốc; kiểm location bổ sung/thay thế và mã Return to riêng |
| [Return to The Wages of Sin](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/ReturnToTheCircleUndone/ReturnToTheWagesOfSin.hs) `54034` | the-circle-undone/the-wages-of-sin | Theo bản gốc + QA | Áp phát hiện bản gốc; kiểm location bổ sung/thay thế và mã Return to riêng |
| [Return to The Witching Hour](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/ReturnToTheCircleUndone/ReturnToTheWitchingHour.hs) `54017` | the-circle-undone/the-witching-hour | Theo bản gốc + QA | Áp phát hiện bản gốc; kiểm location bổ sung/thay thế và mã Return to riêng |
| [Return to Union and Disillusion](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/ReturnToTheCircleUndone/ReturnToUnionAndDisillusion.hs) `54046` | the-circle-undone/union-and-disillusion | Theo bản gốc + QA | Áp phát hiện bản gốc; kiểm location bổ sung/thay thế và mã Return to riêng |

## ReturnToTheForgottenAge

| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |
|---|---|---|---|
| [Return to Heart of the Elders](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/ReturnToTheForgottenAge/ReturnToHeartOfTheEldersPart1.hs) `53045` | the-forgotten-age/heart-of-the-elders-part-1 | Theo bản gốc + QA | Áp phát hiện bản gốc; kiểm location bổ sung/thay thế và mã Return to riêng |
| [Return to The Heart of the Elders](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/ReturnToTheForgottenAge/ReturnToHeartOfTheEldersPart2.hs) `53048` | the-forgotten-age/heart-of-the-elders-part-2 | Theo bản gốc + QA | Áp phát hiện bản gốc; kiểm location bổ sung/thay thế và mã Return to riêng |
| [Return to Shattered Aeons](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/ReturnToTheForgottenAge/ReturnToShatteredAeons.hs) `53061` | the-forgotten-age/shattered-aeons | Theo bản gốc + QA | Áp phát hiện bản gốc; kiểm location bổ sung/thay thế và mã Return to riêng |
| [Return to The Boundary Beyond](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/ReturnToTheForgottenAge/ReturnToTheBoundaryBeyond.hs) `53038` | the-forgotten-age/the-boundary-beyond | Theo bản gốc + QA | Áp phát hiện bản gốc; kiểm location bổ sung/thay thế và mã Return to riêng |
| [Return to The City of Archives](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/ReturnToTheForgottenAge/ReturnToTheCityOfArchives.hs) `53053` | the-forgotten-age/the-city-of-archives | Theo bản gốc + QA | Áp phát hiện bản gốc; kiểm location bổ sung/thay thế và mã Return to riêng |
| [Return to The Depths of Yoth](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/ReturnToTheForgottenAge/ReturnToTheDepthsOfYoth.hs) `53059` | the-forgotten-age/the-depths-of-yoth | Theo bản gốc + QA | Áp phát hiện bản gốc; kiểm location bổ sung/thay thế và mã Return to riêng |
| [Return to The Doom of Eztli](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/ReturnToTheForgottenAge/ReturnToTheDoomOfEztli.hs) `53017` | the-forgotten-age/the-doom-of-eztli | Theo bản gốc + QA | Áp phát hiện bản gốc; kiểm location bổ sung/thay thế và mã Return to riêng |
| [Return to The Untamed Wilds](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/ReturnToTheForgottenAge/ReturnToTheUntamedWilds.hs) `53016` | the-forgotten-age/the-untamed-wilds | Theo bản gốc + QA | Áp phát hiện bản gốc; kiểm location bổ sung/thay thế và mã Return to riêng |
| [Return to Threads of Fate](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/ReturnToTheForgottenAge/ReturnToThreadsOfFate.hs) `53028` | the-forgotten-age/threads-of-fate | Theo bản gốc + QA | Áp phát hiện bản gốc; kiểm location bổ sung/thay thế và mã Return to riêng |
| [Return to Shattered Aeons](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/ReturnToTheForgottenAge/ReturnToTurnBackTime.hs) `53066` | the-forgotten-age/turn-back-time | Theo bản gốc + QA | Áp phát hiện bản gốc; kiểm location bổ sung/thay thế và mã Return to riêng |

## TheCircleUndone

| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |
|---|---|---|---|
| [At Death's Doorstep](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheCircleUndone/AtDeathsDoorstep.hs) `05065` | the-circle-undone/return-to-the-twilight-estate | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [Before the Black Throne](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheCircleUndone/BeforeTheBlackThrone.hs) `05325` | the-circle-undone/before-the-black-throne | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [Disappearance at the Twilight Estate](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheCircleUndone/DisappearanceAtTheTwilightEstate.hs) `05043` | the-circle-undone/return-to-the-twilight-estate | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [For the Greater Good](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheCircleUndone/ForTheGreaterGood.hs) `05197` | the-circle-undone/return-to-for-the-greater-good | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [In the Clutches of Chaos](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheCircleUndone/InTheClutchesOfChaos.hs) `05284` | the-circle-undone/in-the-clutches-of-chaos | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [The Secret Name](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheCircleUndone/TheSecretName.hs) `05120` | the-circle-undone/the-secret-name | Giữ + QA | Đã đổi Witch House → Otherworld và hai Strange Geometry riêng |
| [The Wages of Sin](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheCircleUndone/TheWagesOfSin.hs) `05161` | the-circle-undone/the-wages-of-sin | Giữ + QA | Đã có chapel attic/crypt, Spectral cục bộ và toàn cảnh |
| [The Witching Hour](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheCircleUndone/TheWitchingHour.hs) `05050` | the-circle-undone/the-witching-hour | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [Union and Disillusion](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheCircleUndone/UnionAndDisillusion.hs) `05238` | the-circle-undone/union-and-disillusion | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |

## TheDreamEaters

| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |
|---|---|---|---|
| [A Thousand Shapes of Horror](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheDreamEaters/AThousandShapesOfHorror.hs) `06168` | dreamEatersArt / các vùng | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [Beyond the Gates of Sleep](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheDreamEaters/BeyondTheGatesOfSleep.hs) `06039` | dreamEatersArt / các vùng | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [Dark Side of the Moon](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheDreamEaters/DarkSideOfTheMoon.hs) `06206` | dreamEatersArt / các vùng | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [Point of No Return](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheDreamEaters/PointOfNoReturn.hs) `06247` | dreamEatersArt / các vùng | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [The Search for Kadath](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheDreamEaters/TheSearchForKadath.hs) `06119` | dreamEatersArt / các vùng | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [Waking Nightmare](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheDreamEaters/WakingNightmare.hs) `06063` | dreamEatersArt / các vùng | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [Weaver of the Cosmos](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheDreamEaters/WeaverOfTheCosmos.hs) `06333` | dreamEatersArt / các vùng | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [Where the Gods Dwell](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheDreamEaters/WhereTheGodsDwell.hs) `06286` | dreamEatersArt / các vùng | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |

## TheDrownedCity

| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |
|---|---|---|---|
| [Court of the Ancients](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheDrownedCity/CourtOfTheAncients.hs) `11612` | the-drowned-city/court-of-the-ancients | Đề xuất | Nhánh East/West, elevator active và mức nước |
| [Obsidian Canyons](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheDrownedCity/ObsidianCanyons.hs) `11639` | the-drowned-city/obsidian-canyons-sky | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [One Last Job](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheDrownedCity/OneLastJob.hs) `11501` | the-drowned-city/one-last-job | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [Sepulchre of the Sleeper](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheDrownedCity/SepulchreOfTheSleeper.hs) `11673` | the-drowned-city/sepulchre-of-the-sleeper | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [The Apiary](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheDrownedCity/TheApiary.hs) `11553` | the-drowned-city/the-apiary | Sửa | Lost Pilgrims / Hive Mind: gỡ, dời và mở Central Chamber theo nhánh |
| [The Doom of Arkham Pt I](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheDrownedCity/TheDoomOfArkhamPartI.hs) `11682` | the-drowned-city/the-doom-of-arkham-part-1 | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [The Doom of Arkham Pt II](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheDrownedCity/TheDoomOfArkhamPartII.hs) `11688a` | the-drowned-city/the-doom-of-arkham-part-2 | Giữ + QA | Đã mask Ruined theo từng mã thay thế |
| [The Drowned Quarter](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheDrownedCity/TheDrownedQuarter.hs) `11536` | the-drowned-city/the-drowned-quarter-reveal | Đề xuất | Core active/inactive và nước theo từng nơi; giữ điểm sau lật |
| [The Grand Vault](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheDrownedCity/TheGrandVault.hs) `11587` | the-drowned-city/the-grand-vault | Đề xuất | Moving Platform hoán đổi, flood; kiểm vị trí sau lật theo luật ô |
| [The Western Wall](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheDrownedCity/TheWesternWall.hs) `11517` | the-drowned-city/the-western-wall | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |

## TheFeastOfHemlockVale

| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |
|---|---|---|---|
| [Fate of the Vale](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheFeastOfHemlockVale/FateOfTheVale.hs) `10651` | hemlock-vale/fate-of-the-vale | Đề xuất | Đã về village; kiểm thêm cosmicEmissary/abyssRevealed layouts |
| [Hemlock House](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheFeastOfHemlockVale/HemlockHouse.hs) `10523` | hemlock-vale/hemlock-house-reveal | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [The Vale](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheFeastOfHemlockVale/PreludeDawnOfTheFinalDay.hs) `10679a` | hemlock-vale/vale-day | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [The Vale](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheFeastOfHemlockVale/PreludeDawnOfTheSecondDay.hs) `10677a` | hemlock-vale/vale-day | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [The Vale](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheFeastOfHemlockVale/PreludeTheFinalEvening.hs) `10679b` | hemlock-vale/vale-night | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [The Vale](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheFeastOfHemlockVale/PreludeWelcomeToHemlockVale.hs) `10704` | hemlock-vale/vale-day | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [The Longest Night](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheFeastOfHemlockVale/TheLongestNight.hs) `10626` | hemlock-vale/longest-night-fields | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [The Lost Sister](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheFeastOfHemlockVale/TheLostSister.hs) `10569` | hemlock-vale/lost-sister-caverns | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [The Silent Heath](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheFeastOfHemlockVale/TheSilentHeath.hs) `10549` | hemlock-vale/silent-heath-snowfield | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [The Thing in the Depths](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheFeastOfHemlockVale/TheThingInTheDepths.hs) `10588` | hemlock-vale/thing-in-the-depths-swamp | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [The Twisted Hollow](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheFeastOfHemlockVale/TheTwistedHollow.hs) `10605` | hemlock-vale/twisted-hollow-woods | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [Written in Rock](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheFeastOfHemlockVale/WrittenInRock.hs) `10501` | hemlock-vale/written-in-rock-mine | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |

## TheForgottenAge

| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |
|---|---|---|---|
| [Heart of the Elders, Part 1](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheForgottenAge/HeartOfTheElders.hs) `04205a` | the-forgotten-age/heart-of-the-elders-part-1 | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| Cùng file, định nghĩa thêm | `04205b` Heart of the Elders, Part 2, `04205` Heart of the Elders | Đã kiểm kê | Đọc cùng source, không tính thành file mới |
| [Shattered Aeons](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheForgottenAge/ShatteredAeons.hs) `04314` | the-forgotten-age/shattered-aeons | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [The Boundary Beyond](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheForgottenAge/TheBoundaryBeyond.hs) `04161` | the-forgotten-age/the-boundary-beyond | Sửa | Mask từng nơi PresentDay / Tenochtitlan theo location hiện tại |
| [The City of Archives](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheForgottenAge/TheCityOfArchives.hs) `04237` | the-forgotten-age/the-city-of-archives | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [The Depths of Yoth](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheForgottenAge/TheDepthsOfYoth.hs) `04277` | the-forgotten-age/the-depths-of-yoth | Sửa | Tầng Yoth reset theo depth, không theo số Act |
| [The Doom of Eztli](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheForgottenAge/TheDoomOfEztli.hs) `04054` | the-forgotten-age/the-doom-of-eztli | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [The Untamed Wilds](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheForgottenAge/TheUntamedWilds.hs) `04043` | the-forgotten-age/the-untamed-wilds | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [Threads of Fate](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheForgottenAge/ThreadsOfFate.hs) `04113` | the-forgotten-age/threads-of-fate | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [Turn Back Time](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheForgottenAge/TurnBackTime.hs) `04344` | the-forgotten-age/turn-back-time | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |

## TheInnsmouthConspiracy

| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |
|---|---|---|---|
| [A Light in the Fog](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheInnsmouthConspiracy/ALightInTheFog.hs) `07231` | the-innsmouth-conspiracy/a-light-in-the-fog-cliffs | Đề xuất | Sau khi Falcon Point mất, tập trung toàn vùng ngầm; giữ flood sprite |
| [Devil Reef](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheInnsmouthConspiracy/DevilReef.hs) `07163` | the-innsmouth-conspiracy/devil-reef-sea | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [Horror in High Gear](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheInnsmouthConspiracy/HorrorInHighGear.hs) `07198` | the-innsmouth-conspiracy/horror-in-high-gear-moor | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [In Too Deep](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheInnsmouthConspiracy/InTooDeep.hs) `07123` | the-innsmouth-conspiracy/in-too-deep | Giữ + QA | Đã có bốn mức thủy triều, vẫn kiểm nước location thực |
| [Into the Maelstrom](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheInnsmouthConspiracy/IntoTheMaelstrom.hs) `07311` | the-innsmouth-conspiracy/into-the-maelstrom-abyss | Đề xuất | Đổi background hang → Yha-nthlei; giữ sprite/layout 1–4 người |
| [The Lair of Dagon](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheInnsmouthConspiracy/TheLairOfDagon.hs) `07274` | the-innsmouth-conspiracy/the-lair-of-dagon | Sửa | Lodge → hang, chỉ Grand Entryway còn lại; tunnel xáo |
| [The Pit of Despair](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheInnsmouthConspiracy/ThePitOfDespair.hs) `07041` | the-innsmouth-conspiracy/pit-of-despair-caverns | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [The Vanishing of Elina Harper](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheInnsmouthConspiracy/TheVanishingOfElinaHarper.hs) `07056` | the-innsmouth-conspiracy/the-vanishing-of-elina-harper | Giữ + QA | Đã sửa panorama thị trấn và ghim |

## TheScarletKeys

| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |
|---|---|---|---|
| [Congress of the Keys](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheScarletKeys/CongressOfTheKeys.hs) `09694` | the-scarlet-keys/congress-halls | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [Dancing Mad](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheScarletKeys/DancingMad.hs) `09591` | the-scarlet-keys/dancing-mad | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [Dead Heat](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheScarletKeys/DeadHeat.hs) `09520` | the-scarlet-keys/dead-heat | Sửa | Ngày/đêm từ Gnashing Teeth, vines theo nhánh ritual công khai |
| [Dealings in the Dark](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheScarletKeys/DealingsInTheDark.hs) `09566` | the-scarlet-keys/dealings-in-the-dark | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [Dogs of War](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheScarletKeys/DogsOfWar.hs) `09635` | the-scarlet-keys/dogs-of-war | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [On Thin Ice](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheScarletKeys/OnThinIce.hs) `09609` | the-scarlet-keys/on-thin-ice | Sửa | Thêm Lair nối đúng nơi Chimera, Alaska vẫn còn |
| [Riddles and Rain](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheScarletKeys/RiddlesAndRain.hs) `09501` | the-scarlet-keys/riddles-and-rain | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [Sanguine Shadows](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheScarletKeys/SanguineShadows.hs) `09545` | the-scarlet-keys/sanguine-shadows | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [Shades of Suffering](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheScarletKeys/ShadesOfSuffering.hs) `09660` | the-scarlet-keys/shades-of-suffering | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |
| [Without a Trace](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheScarletKeys/WithoutATrace.hs) `09681` | the-scarlet-keys/without-a-trace-otherworld | Giữ + QA | Chưa xác nhận lỗi đổi toàn cảnh; kiểm variant, phòng mở muộn và ghim trên ván |

## AgainstTheWendigo

| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |
|---|---|---|---|
| [Against the Wendigo](../../backend/arkham-api/library/Arkham/Homebrew/AgainstTheWendigo/Scenarios/AgainstTheWendigo.hs) `:against-the-wendigo:001` | Chưa đăng ký panorama | Thiếu scene | Valley 3×4, Uncharted xáo, sprite đúng hướng/ô |

## AgesUnwound

| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |
|---|---|---|---|
| [Night of Fire](../../backend/arkham-api/library/Arkham/Homebrew/AgesUnwound/Scenarios/NightOfFire.hs) `:ages-unwound:001` | ages-unwound/night-of-fire | Đề xuất | Phố rời/quay lại deck, mặt úp không lộ identity; giữ Arkham panorama có điều kiện |
| [The Myriad Gentleman](../../backend/arkham-api/library/Arkham/Homebrew/AgesUnwound/Scenarios/TheMyriadGentleman.hs) `:ages-unwound:023` | ages-unwound/the-myriad-gentleman | Đề xuất | Nhà/vườn cùng toàn cảnh, phòng đúng tầng; chưa xác nhận thay toàn bàn |
| [A World Torn Down](../../backend/arkham-api/library/Arkham/Homebrew/AgesUnwound/Scenarios/AWorldTornDown.hs) `:ages-unwound:048` | ages-unwound/a-world-torn-down | Đề xuất | School variants/classrooms, cửa bị gỡ và Ritual Circle loại trừ nhau |
| [Unstuck](../../backend/arkham-api/library/Arkham/Homebrew/AgesUnwound/Scenarios/Unstuck.hs) `:ages-unwound:062` | ages-unwound/unstuck | Sửa | Vòng tám slot theo state; across/clockwise không neo theo identity |
| [A Year to Plan](../../backend/arkham-api/library/Arkham/Homebrew/AgesUnwound/Scenarios/AYearToPlan.hs) `:ages-unwound:105` | ages-unwound/a-year-to-plan | Đề xuất | Địa lý world map, Library trong London, Realm nối Paris, mùa không phủ cả thế giới |
| [A World Torn Down, Again](../../backend/arkham-api/library/Arkham/Homebrew/AgesUnwound/Scenarios/AWorldTornDownAgain.hs) `:ages-unwound:155` | ages-unwound/a-world-torn-down-again | Sửa | Featureless Streets → school; hai Act deck/timeline độc lập |
| [Time Runs Out](../../backend/arkham-api/library/Arkham/Homebrew/AgesUnwound/Scenarios/TimeRunsOut.hs) `:ages-unwound:182` | ages-unwound/time-runs-out | Sửa | Nơi xuống dưới Agenda rồi đổi entity; xóa/đổi hình theo state |

## AndThenThereWereNone

| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |
|---|---|---|---|
| [And Then There Were None](../../backend/arkham-api/library/Arkham/Homebrew/AndThenThereWereNone/Scenarios/AndThenThereWereNone.hs) `:and-then-there-were-none:001` | Chưa đăng ký panorama | Thiếu scene | Nhà/đảo, rooms trong nhà, terrace/shed ngoài; Method bí mật |

## CircusExMortis

| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |
|---|---|---|---|
| [One Night Only](../../backend/arkham-api/library/Arkham/Homebrew/CircusExMortis/Scenarios/OneNightOnly.hs) `:circus-ex-mortis:001` | Chưa đăng ký panorama | Thiếu scene | Big Top ba ring cùng lều, circus grounds và cửa thoát |
| [The Primrose Path](../../backend/arkham-api/library/Arkham/Homebrew/CircusExMortis/Scenarios/ThePrimrosePath.hs) `:circus-ex-mortis:017` | Chưa đăng ký panorama | Thiếu scene | Rừng tám ô xáo, luật adjacency, sprite theo ô |
| [Harm's Way](../../backend/arkham-api/library/Arkham/Homebrew/CircusExMortis/Scenarios/HarmsWay.hs) `:circus-ex-mortis:040` | Chưa đăng ký panorama | Thiếu scene | Lều/Crowded Row theo grid, enemy-as-location cần tương tác |
| [All Points West](../../backend/arkham-api/library/Arkham/Homebrew/CircusExMortis/Scenarios/AllPointsWest.hs) `:circus-ex-mortis:074` | Chưa đăng ký panorama | Thiếu scene | Đoàn tàu, toa Freight/Special đổi tại ArrivingAt |
| [Piper at the Gates of Dawn](../../backend/arkham-api/library/Arkham/Homebrew/CircusExMortis/Scenarios/PiperAtTheGatesOfDawn.hs) `:circus-ex-mortis:108` | Chưa đăng ký panorama | Thiếu scene | Tái dùng circus, thêm vùng/entity theo state |
| [Bacchanalia](../../backend/arkham-api/library/Arkham/Homebrew/CircusExMortis/Scenarios/Bacchanalia.hs) `:circus-ex-mortis:122` | Chưa đăng ký panorama | Thiếu scene | Manor cutaway, balcony/cellars/dungeon đúng tầng |
| [Red Sunrise](../../backend/arkham-api/library/Arkham/Homebrew/CircusExMortis/Scenarios/RedSunrise.hs) `:circus-ex-mortis:153` | Chưa đăng ký panorama | Thiếu scene | Row/path/layout thay, sprite bám ô; khóa ánh sáng trước khi vẽ |
| [Thousand to One](../../backend/arkham-api/library/Arkham/Homebrew/CircusExMortis/Scenarios/ThousandToOne.hs) `:circus-ex-mortis:190` | Chưa đăng ký panorama | Thiếu scene | Chuỗi rừng, cụm Destiny mở muộn, nơi bị gỡ biến mất |

## ConsternationOnTheConstellation

| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |
|---|---|---|---|
| [Consternation on the Constellation](../../backend/arkham-api/library/Arkham/Homebrew/ConsternationOnTheConstellation/Scenarios/ConsternationOnTheConstellation.hs) `:consternation-on-the-constellation:001` | Chưa đăng ký panorama | Thiếu scene | Ship decks, mở phòng, sinking và lifeboat theo state/nhánh |

## DarkMatter

| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |
|---|---|---|---|
| [The Tatterdemalion](../../backend/arkham-api/library/Arkham/Homebrew/DarkMatter/Scenarios/TheTatterdemalion.hs) `:dark-matter:014` | dark-matter/the-tatterdemalion | Giữ + QA | Tàu có cutaway; phòng/Scanning theo thông tin công khai |
| [Electric Nightmare](../../backend/arkham-api/library/Arkham/Homebrew/DarkMatter/Scenarios/ElectricNightmare.hs) `:dark-matter:054` | dark-matter/electric-nightmare | Đề xuất | Ba hoán vị school và switch; kiểm quan hệ ô sau reveal |
| [Lost Quantum](../../backend/arkham-api/library/Arkham/Homebrew/DarkMatter/Scenarios/LostQuantum.hs) `:dark-matter:089` | dark-matter/lost-quantum | Đề xuất | Station unstable/stable: chưa khóa trigger mỹ thuật |
| [In the Shadow of Earth](../../backend/arkham-api/library/Arkham/Homebrew/DarkMatter/Scenarios/InTheShadowOfEarth.hs) `:dark-matter:112` | dark-matter/in-the-shadow-of-earth | Giữ + QA | Nostalgia II; không lộ Crew/Imitation trước khi scan |
| [Strange Moons](../../backend/arkham-api/library/Arkham/Homebrew/DarkMatter/Scenarios/StrangeMoons.hs) `:dark-matter:153` | dark-matter/strange-moons | Sửa | Simulator thay cục bộ bằng một trong sáu Simulation rồi có thể trở lại |
| [The Machine in Yellow](../../backend/arkham-api/library/Arkham/Homebrew/DarkMatter/Scenarios/TheMachineInYellow.hs) `:dark-matter:190` | dark-matter/the-machine-in-yellow | Sửa | Nội thất nhà hát và phòng CurtainCall reused cần ghim theo scenario |
| [Fragment of Carcosa](../../backend/arkham-api/library/Arkham/Homebrew/DarkMatter/Scenarios/FragmentOfCarcosa.hs) `:dark-matter:209` | dark-matter/fragment-of-carcosa | Sửa | Cave/Carcosa từng nơi, giữ surface; hai lớp với mask |
| [Starfall](../../backend/arkham-api/library/Arkham/Homebrew/DarkMatter/Scenarios/Starfall.hs) `:dark-matter:243` | dark-matter/starfall | Sửa | Hai tàu là location cập bến theo host; nơi bị Dark Matter gỡ |

## NightOfVespers

| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |
|---|---|---|---|
| [The End of Seasons](../../backend/arkham-api/library/Arkham/Homebrew/NightOfVespers/Scenarios/TheEndOfSeasons.hs) `:night-of-vespers:001` | Chưa đăng ký panorama | Thiếu scene | End of Seasons: Trattoria/rooms, đổi bàn và inferno theo Act/state |
| [Behind Closed Doors](../../backend/arkham-api/library/Arkham/Homebrew/NightOfVespers/Scenarios/BehindClosedDoors.hs) `:night-of-vespers:037` | Chưa đăng ký panorama | Backend shell | Chưa có setup/lifecycle đủ; chỉ làm concept, chưa nghiệm thu trigger |
| [Dancing with Death](../../backend/arkham-api/library/Arkham/Homebrew/NightOfVespers/Scenarios/DancingWithDeath.hs) `:night-of-vespers:075` | Chưa đăng ký panorama | Backend shell | Chưa có setup/lifecycle đủ; chỉ làm concept, chưa nghiệm thu trigger |
| [The Teachings of Aradia](../../backend/arkham-api/library/Arkham/Homebrew/NightOfVespers/Scenarios/TheTeachingsOfAradia.hs) `:night-of-vespers:105` | Chưa đăng ký panorama | Backend shell | Chưa có setup/lifecycle đủ; chỉ làm concept, chưa nghiệm thu trigger |
| [The City of Fog](../../backend/arkham-api/library/Arkham/Homebrew/NightOfVespers/Scenarios/TheCityOfFog.hs) `:night-of-vespers:136` | Chưa đăng ký panorama | Backend shell | Chưa có setup/lifecycle đủ; chỉ làm concept, chưa nghiệm thu trigger |
| [The Garden of Bones](../../backend/arkham-api/library/Arkham/Homebrew/NightOfVespers/Scenarios/TheGardenOfBones.hs) `:night-of-vespers:168` | Chưa đăng ký panorama | Backend shell | Chưa có setup/lifecycle đủ; chỉ làm concept, chưa nghiệm thu trigger |
| [A Chorus of Suffering](../../backend/arkham-api/library/Arkham/Homebrew/NightOfVespers/Scenarios/AChorusOfSuffering.hs) `:night-of-vespers:214` | Chưa đăng ký panorama | Backend shell | Chưa có setup/lifecycle đủ; chỉ làm concept, chưa nghiệm thu trigger |
| [Mother's Mercy](../../backend/arkham-api/library/Arkham/Homebrew/NightOfVespers/Scenarios/MothersMercy.hs) `:night-of-vespers:257` | Chưa đăng ký panorama | Backend shell | Chưa có setup/lifecycle đủ; chỉ làm concept, chưa nghiệm thu trigger |

## ReturnToTheInnsmouthConspiracy

| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |
|---|---|---|---|
| [Return to The Pit of Despair](../../backend/arkham-api/library/Arkham/Homebrew/ReturnToTheInnsmouthConspiracy/Scenarios/ReturnToThePitOfDespair.hs) `:return-to-the-innsmouth-conspiracy:018` | the-innsmouth-conspiracy/pit-of-despair-caverns | Theo bản gốc + QA | Áp phát hiện bản gốc; kiểm location bổ sung/thay thế và mã Return to riêng |
| [Return to The Vanishing of Elina Harper](../../backend/arkham-api/library/Arkham/Homebrew/ReturnToTheInnsmouthConspiracy/Scenarios/ReturnToTheVanishingOfElinaHarper.hs) `:return-to-the-innsmouth-conspiracy:022` | the-innsmouth-conspiracy/the-vanishing-of-elina-harper | Theo bản gốc + QA | Áp phát hiện bản gốc; kiểm location bổ sung/thay thế và mã Return to riêng |
| [Return to In Too Deep](../../backend/arkham-api/library/Arkham/Homebrew/ReturnToTheInnsmouthConspiracy/Scenarios/ReturnToInTooDeep.hs) `:return-to-the-innsmouth-conspiracy:028` | the-innsmouth-conspiracy/in-too-deep | Theo bản gốc + QA | Áp phát hiện bản gốc; kiểm location bổ sung/thay thế và mã Return to riêng |
| [Return to Devil Reef](../../backend/arkham-api/library/Arkham/Homebrew/ReturnToTheInnsmouthConspiracy/Scenarios/ReturnToDevilReef.hs) `:return-to-the-innsmouth-conspiracy:031` | the-innsmouth-conspiracy/devil-reef-sea | Theo bản gốc + QA | Áp phát hiện bản gốc; kiểm location bổ sung/thay thế và mã Return to riêng |
| [Return to Horror in High Gear](../../backend/arkham-api/library/Arkham/Homebrew/ReturnToTheInnsmouthConspiracy/Scenarios/ReturnToHorrorInHighGear.hs) `:return-to-the-innsmouth-conspiracy:035` | the-innsmouth-conspiracy/horror-in-high-gear-moor | Theo bản gốc + QA | Áp phát hiện bản gốc; kiểm location bổ sung/thay thế và mã Return to riêng |
| [Return to A Light in the Fog](../../backend/arkham-api/library/Arkham/Homebrew/ReturnToTheInnsmouthConspiracy/Scenarios/ReturnToALightInTheFog.hs) `:return-to-the-innsmouth-conspiracy:039` | the-innsmouth-conspiracy/a-light-in-the-fog-cliffs | Theo bản gốc + QA | Áp phát hiện bản gốc; kiểm location bổ sung/thay thế và mã Return to riêng |
| [Return to The Lair of Dagon](../../backend/arkham-api/library/Arkham/Homebrew/ReturnToTheInnsmouthConspiracy/Scenarios/ReturnToTheLairOfDagon.hs) `:return-to-the-innsmouth-conspiracy:043` | the-innsmouth-conspiracy/the-lair-of-dagon | Sửa | LairDagon lodge → cave, tunnel Return, flood theo state |
| [Return to Into the Maelstrom](../../backend/arkham-api/library/Arkham/Homebrew/ReturnToTheInnsmouthConspiracy/Scenarios/ReturnToIntoTheMaelstrom.hs) `:return-to-the-innsmouth-conspiracy:048` | the-innsmouth-conspiracy/into-the-maelstrom-abyss | Theo bản gốc + QA | Áp phát hiện bản gốc; kiểm location bổ sung/thay thế và mã Return to riêng |

## TheFallOfTheHouseOfUsher

| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |
|---|---|---|---|
| [The Fall of the House of Usher](../../backend/arkham-api/library/Arkham/Homebrew/TheFallOfTheHouseOfUsher/Scenarios/TheFallOfTheHouseOfUsher.hs) `:the-fall-of-the-house-of-usher:001` | Chưa đăng ký panorama | Thiếu scene | Manor cutaway + Tarn mở muộn, Decadent/Ruined từng phòng |

## TheInvisibleMan

| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |
|---|---|---|---|
| [The Invisible Man](../../backend/arkham-api/library/Arkham/Homebrew/TheInvisibleMan/Scenarios/TheInvisibleMan.hs) `:the-invisible-man:001` | Chưa đăng ký panorama | Thiếu scene | Countryside/cabins/stream, dấu vết theo thông tin công khai |

## TheLegendOfSleepyHollow

| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |
|---|---|---|---|
| [The Legend of Sleepy Hollow](../../backend/arkham-api/library/Arkham/Homebrew/TheLegendOfSleepyHollow/Scenarios/TheLegendOfSleepyHollow.hs) `:the-legend-of-sleepy-hollow:001` | Chưa đăng ký panorama | Thiếu scene | Church/tree/farm/swamp/school khác mốc, đường rừng thật |

## TheMasqueOfTheRedDeath

| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |
|---|---|---|---|
| [The Masque of the Red Death](../../backend/arkham-api/library/Arkham/Homebrew/TheMasqueOfTheRedDeath/Scenarios/TheMasqueOfTheRedDeath.hs) `:the-masque-of-the-red-death:001` | Chưa đăng ký panorama | Thiếu scene | Ballroom + bảy phòng màu; tiệc → Victim theo Act |

## ThePhantomOfTheOpera

| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |
|---|---|---|---|
| [The Phantom of the Opera](../../backend/arkham-api/library/Arkham/Homebrew/ThePhantomOfTheOpera/Scenarios/ThePhantomOfTheOpera.hs) `:the-phantom-of-the-opera:001` | Chưa đăng ký panorama | Thiếu scene | Foyer → Opera House → Sewers → Lair/Parlor/Organ, đổi toàn cảnh |

## TheStrangeCaseOfDrJekyllAndMrHyde

| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |
|---|---|---|---|
| [The Strange Case of Dr. Jekyll and Mr. Hyde](../../backend/arkham-api/library/Arkham/Homebrew/TheStrangeCaseOfDrJekyllAndMrHyde/Scenarios/TheStrangeCaseOfDrJekyllAndMrHyde.hs) `:the-strange-case-of-dr-jekyll-and-mr-hyde:001` | Chưa đăng ký panorama | Thiếu scene | Industrial Arkham, lab cutaway, location variants loại trừ |

## TheSymphonyOfErichZann

| Màn / ID | Scene hiện tại | Kết luận | Việc cần làm |
|---|---|---|---|
| [The Symphony of Erich Zann](../../backend/arkham-api/library/Arkham/Homebrew/TheSymphonyOfErichZann/Scenarios/TheSymphonyOfErichZann.hs) `:the-symphony-of-erich-zann:001` | Chưa đăng ký panorama | Thiếu scene | Nhà hát, bốn Backstage chọn trong sáu, Musician enemy trong phòng |

## Giới hạn

Chưa kiểm browser mọi nhánh, mọi sprite hoặc mọi bản lá. Bảy NightOfVespers shell cần backend trước. Dunwich/PathToCarcosa không nằm trong ma trận; các challenge dùng chung tài sản chỉ ghi dependency, không sửa phạm vi agent khác.
