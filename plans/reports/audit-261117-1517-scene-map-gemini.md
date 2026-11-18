# Rà soát và triển khai lại Scene Map bằng GPT Image

Đã xem 130 ảnh toàn cảnh trong danh mục và các biến thể được chọn theo trạng thái, chồng điểm neo lên 18 cảnh để kiểm tra sâu, rồi đối chiếu bố cục và vòng đời lá trong Haskell đối với các lỗi được ghi bên dưới. Đây là audit tranh toàn cảnh và cách gắn địa điểm; chưa xác nhận từng nhánh bằng ván chơi trực tiếp. Các nền trống có chủ đích dùng sprite địa điểm động không bị tính là thiếu công trình. Ảnh kể chuyện, portrait và token nằm ngoài phạm vi.

**Kết quả triển khai:** 10 WebP mới đã tích hợp cho mục 2–11. *Spreading Flames* đã được xử lý trước đó bằng bốn nền dùng chung điểm neo. *Doom of Arkham Part II* được hiệu chỉnh điểm neo trên ảnh hiện có.

Quy trình dùng skill `arkham-overview-art` và công cụ GPT Image tích hợp. Đối chiếu mã lá và vòng đời địa điểm trước khi tạo ảnh. Sau khi chọn ảnh, xuất WebP 1920×1080, hiệu chỉnh điểm neo trên hình xuất và kiểm tra luật lựa chọn ảnh bằng snapshot. Khối tiếng Anh bên dưới ghi yêu cầu tạo ảnh cho từng cảnh. Đường dẫn ảnh tính từ `frontend/public/img/scenes/`.

## 1. Spreading Flames — tách rõ Science Hall khỏi Orne Library

**Ảnh trong game:** `brethren-of-ash/spreading-flames.webp`. **Mức sửa:** mở rộng phần tiền cảnh và sửa ghim.

Backend đặt Orne Library **12120** phía trên Quad **12116** và Science Hall **12118** phía dưới. Hai lá cùng vào bàn với Warren Observatory **12119** khi kết thúc *Escape the Dorms*. Hiện cả hai ghim ở `[52,22]`: dòng dành cho **12118** ghi nhầm tên thành Orne Library; vị trí phía dưới gắn vào **12114/12115**, không phải mã Science Hall của màn. Ảnh đã có mái nhà tiền cảnh có thể giữ làm khối Science Hall, nhưng cửa và mặt tiền bị cắt khỏi khung. Vì vậy chỉ vẽ lại hoặc chỉ nới khoảng cách nhãn đều chưa giải quyết đủ.

```text
Edit the attached Spreading Flames background as one 16:9 high-angle view of a 1920s New England university during a nighttime fire. Preserve the central lawn and radial paths, the ivy-covered dormitory on the left, the distinct fire-damaged friend's room or dorm wing at lower left, and the copper-domed observatory on the right. Preserve the tall Gothic Orne Library at the rear center, with its own stone doorway and landing, at about 52% from the left and 25% from the top.

Pull back or reconstruct the lower foreground so the cropped roof becomes a fully identifiable Science Hall centered along the near edge of the quad, with its own independent footprint, front wall, tall rectangular laboratory windows, twin brick ventilation stacks and a wide visible main entrance facing the quad (roughly 51% across, 76–81% down). A broad open lawn physically separates the Science Hall and Orne Library; they share no roof, wing, wall, doorway or foundation. Give all six playable places separate clear ground-level standing spots. Keep embers, dark slate shadows and localized firelight. No labels, people, tokens, arrows, cards, grids, lettering, watermark or collage.
```

Nguồn: [scenario](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/BrethrenOfAsh/SpreadingFlames.hs#L36), [mã lá](../../backend/arkham-api/library/Arkham/Location/CardDefs/BrethrenOfAsh/MiskatonicUniversity.hs#L25), [Act](../../backend/arkham-api/library/Arkham/Act/Cards/BrethrenOfAsh/SpreadingFlames/EscapeTheDorms.hs#L46), [ghim hiện tại](../../frontend/src/arkham/hemlock-overview.ts#L516).

## 2. Blood Money — bổ sung phòng thật sự có trên bàn

**Ảnh trong game:** `children-of-blood/blood-money.webp`. **Mức sửa:** vẽ lại mặt cắt.

Nền và điểm neo chủ yếu phục vụ Foyer **13076**, Dining Hall **13077** và Study **13078**. Office **13081** và Kitchen **13080** đã được đặt từ đầu; Master Bedroom **13079** và Balcony **13082** (Easy/Standard) được đặt sau. Cửa két và nhà kính trong ảnh không thay cho các phòng này. Giữ cùng vị trí Foyer **13076/13076b** vì đó là cùng một sảnh qua hai trạng thái.

```text
Rebuild the attached 1920s Wilkes mansion as one continuous 16:9 architectural cutaway, preserving the black-and-white Foyer, amber lighting, twin staircase and red-tablecloth Dining Hall. Show seven identifiable playable spaces. On the main level, from left to right through real doorways, show a compact Office with a desk and filing cabinets, a separate book-lined Study with reading chairs, the Dining Hall with its long table, and the Kitchen connected to the Dining Hall through a service doorway, with a range and prep counters. The Foyer is a spacious entrance and stair hall adjoining the Study and Dining Hall, with its own clear floor landing. Upstairs show a separate Master Bedroom with a bed, reached from the house, and an adjacent outdoor Balcony with a railing and independent standing room. The balcony is beside the bedroom, not a stair landing; the Office is not a corner of the Study and the Kitchen is not a sideboard in the Dining Hall. Reallocate the decorative vault and greenhouse space to the required rooms. Keep all seven floor areas visible, with walls, door thresholds and room for a marker. No people, labels, lettering, UI, tokens, watermark or panel borders.
```

Nguồn: [setup](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/ChildrenOfBlood/BloodMoney.hs#L261), [Act mở phòng](../../backend/arkham-api/library/Arkham/Act/Cards/ChildrenOfBlood/BloodMoney/DealOrNoDeal.hs#L49), [ghim](../../frontend/src/arkham/hemlock-overview.ts#L579).

## 3. Fortune and Folly — không dùng chung một góc cho ba phòng hậu trường

**Ảnh trong game:** `side-stories/fortune-and-folly.webp`. **Mức sửa:** nới mặt cắt casino và sửa mapping cả hai phần.

Casino Lounge **88015** và High Roller's Table **88014** đang chung `[80,26]`. Staff Access Hallway **88016**, Guard Room **88018** và Counting Room **88020** cùng `[68,86]`; Security Office **88017** và Owner's Office **88019** cũng không có điểm riêng trong bảng này. Hậu trường ảnh hiện quá ít chỗ để gắn ổn định. Phần II dùng ID **88001b**; registry chỉ có **88001**, cần trỏ phần II vào nền sau khi có ảnh phù hợp. Các bản Calm/Busy của cùng một nơi giữ chung điểm.

```text
Expand the attached art-deco casino into one seamless 16:9 architectural cutaway. Keep a large public Casino Floor and four legible gaming stations with distinct surfaces: Poker Table, Roulette Wheel, Baccarat Table, and a bank of Slot Machines. Give the Casino Lounge its own room with sofas and a bar, and the High Roller's Table a different private room with one prominent gaming table; separate them with a real partition and separate entrances.

Pull back to show a substantial staff wing. Draw a clearly walkable Staff Access Hallway, a separate Security Office with keys and surveillance equipment appropriate to the period, a Guard Room with a bench and lockers, an Owner's Office with a formal desk, and a Counting Room with cash cages and sorting counters. Make the thick Vault Door its own vestibule and make the Relic Room a distinct chamber beyond it, with an occult exhibit at the back and empty standing space in front. Show all fourteen areas at readable scale in one coherent building; never place several functional rooms inside the same undivided rectangle. Keep the gold-lit 1920s mood. No people, signs, labels, card art UI, watermark, comic panels or inset boxes.
```

Nguồn: [hai scenario ID và bố cục](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/FortuneAndFolly.hs#L63), [đặt phòng phần II](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/FortuneAndFolly.hs#L610), [ghim](../../frontend/src/arkham/hemlock-overview.ts#L1131).

## 4. The Midwinter Gala — đủ ba phòng mỗi tầng và một tầng hầm

**Ảnh trong game:** `side-stories/the-midwinter-gala.webp`. **Mức sửa:** phân lại tầng và phòng trong mặt cắt.

Ground Floor có Art Gallery **71009**, Ballroom **71010**, Barroom **71011** với Lobby **71007**. Second Floor có ba lá riêng Bedroom **71012**, Library **71013**, Parlor **71014**, được đưa lên từ Act. Bảng hiện ghi “Bedroom / Library” ở một điểm và thiếu hai mã cuối; vùng Lantern Chamber **71008** trông như nhà kính cùng tầng với Lobby dù backend xác định là Basement. Vẽ đủ nội thất; khi lật cần dùng điểm theo mã lá và giữ cửa chung cho lá úp vì hai nhóm được xáo.

```text
Edit the attached snowy 1920s manor into a single wide 16:9 architectural cutaway with three unambiguous levels. On the ground floor show four independent readable spaces: a grand Lobby with the staircase, an Art Gallery with framed paintings and a viewing aisle, a Ballroom with an open dance floor, and a separate Barroom with counter and stools. On the second floor show three distinct, fully walled rooms with doors off the upper landing: a Bedroom with a bed, a Library with full-height bookcases, and a Parlor with a fireplace and seating. Place the Lantern Chamber alone beneath the Lobby in a clearly subterranean stone room, reached by a descending stair; a lantern may light the chamber, but it is not a conservatory. Leave a clear floor area inside every room and keep all eight spaces visible at once. Use the original winter exterior and warm interior palette, without guests, labels, lettering, UI, frames or watermark.
```

Nguồn: [bố cục](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheMidwinterGala.hs#L75), [lá và tầng](../../backend/arkham-api/library/Arkham/Location/CardDefs/TheMidwinterGala.hs), [ghim](../../frontend/src/arkham/hemlock-overview.ts#L1172).

## 5. War of the Outer Gods — tách phố khỏi công trình và tách ba thành phố

**Ảnh trong game:** `side-stories/war-of-the-outer-gods.webp`. **Mức sửa:** bố cục lại nền thành các cụm địa danh.

Providence **86015** và Athenaeum **86016** đang cùng `[66,42]`; Streets of Montréal **86018**, Chateau Ramezay **86019** và Shrine **86020** cùng `[93,76]`. Tất cả là lá riêng cùng lên bàn. Eclipse có thể giữ để chỉ hướng đến Hub Dimension **86024**, nhưng Hub cần mặt sàn riêng vì Act đặt nó thành location.

```text
Rebuild the attached apocalyptic cosmic-noir map as a single 16:9 high-angle scene seen through adjoining reality rifts. Create physically distinct 1920s city clusters, with separate walkable streets and landmarks. In the middle use a modest Arkham crossroads and ritual square as the junction. Across the upper portion place Montréal: a walkable old-stone street, the separate walled Chateau Ramezay with its courtyard and entry gate, and the Shrine of Magh'an Ark'at in a different enclosed ritual precinct. Lower left show New York City streets, an excavated Burning Pit and a distinct exposed Penthouse roof terrace. Lower right show Providence streets, a glass-roofed commercial Arcade, and the Athenaeum of the Empty Sky as an independent stone building with a separate entrance. Show the Hub Dimension as a walkable otherworldly platform off to the right, with the eclipse behind it, not as an eclipse in the sky alone. Let broken avenues, bridges and rifts join the scene from one camera; each playable landmark has its own clear landing and silhouette. No labels, signs, grid, UI, figures, inset panels or watermark.
```

Nguồn: [bố cục và setup](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/WarOfTheOuterGods.hs#L37), [địa điểm được đặt](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/WarOfTheOuterGods.hs#L161), [ghim](../../frontend/src/arkham/hemlock-overview.ts#L1159).

## 6. New Horizons — tách hai phòng nhà máy và các buồng dưới hang

**Ảnh trong game:** `children-of-blood/new-horizons.webp`. **Mức sửa:** chỉnh vùng giữa các sàn và đáy mặt cắt.

Điểm của Manager's Office và Storage nằm ở rìa các sàn, nhưng ảnh không cho thấy hai phòng rõ ràng. Ở dưới, Hidden Laboratory và Locked Chamber đọc như hai vị trí trong cùng hai khối hang lớn với Side Chamber thường. Giữ nhà máy và hố thang, thêm vách cửa, bệ đứng. Day/Night dùng cùng bố cục nhà máy; Shallow Tunnels và Darkest Depths là nhánh. Ba Side Chamber có thể được xáo trước khi lật; không in danh tính lên cửa úp.

```text
Edit the attached New Horizons factory-and-cavern cross-section in one seamless 16:9 frame. Retain the West Factory Floor with boilers, the East Factory Floor with production benches, the freight Loading Dock, and the central shaft and descending stairs. Between the factory floors carve out a real Manager's Office with walls, a window, desk, records and a visible doorway; on the other side add an independent Storage room with shelves and crates. Neither is a corner of a factory floor or a shared dock. Below keep separately readable Shallow Tunnels and Darkest Depths entrance thresholds, each joining the descending passage. Rebuild the lower playable side-chamber band as three separate rooms carved into the same rock: a Hidden Laboratory with lab stands, a Locked Chamber behind a durable locked door, and a plain rocky Side Chamber. Rock walls separate all three floor landings; none is marked only with a color change on a shared floor. Keep mine timber, cold rock and rusty 1920s machinery. No captions, UI, characters, arrows, grids, panels or watermark.
```

Nguồn: [bố cục và nhánh setup](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/ChildrenOfBlood/NewHorizons.hs#L42), [mã và tên lá](../../backend/arkham-api/library/Arkham/Location/CardDefs/ChildrenOfBlood/NewHorizons.hs), [ghim](../../frontend/src/arkham/hemlock-overview.ts#L558).

## 7. Waking Nightmare — ba cửa đang có, ba phòng phía sau chưa thấy

**Ảnh trong game:** `the-dream-eaters/waking-nightmare.webp`. **Mức sửa:** mở rộng tầng hầm.

Game đặt ngẫu nhiên ba Basement Door; khi lật ra Morgue **06075**, Operating Room **06076**, Private Room **06077**. Ảnh chỉ cho thấy cửa/hành lang tầng dưới; cấu hình cũng chỉ có `basementDoor1–3`. Đây là vấn đề thiếu nội thất tương ứng sau khi lật. Giữ cửa chung cho lá úp, ghim theo mã sau khi lật; cửa được xáo nên không gán cứng thứ tự cửa cho tên phòng.

```text
Expand the attached St. Mary's Hospital scene downwards into one coherent 16:9 architectural cutaway. Preserve the visible upstairs Emergency Room, Waiting Room, Records Office and Experimental Therapies Ward. Keep their shared Stairwell and a readable lower landing with three equally anonymous basement door thresholds. Behind and below that corridor show three distinct destination rooms as clearly separated architectural bays: a cold tiled Morgue with metal drawers and a slab; an Operating Room with a surgical table and overhead lights; and a Private Room with one patient's bed, privacy screen and side cabinet. Connect the basement wing to the same Stairwell. Use a common vanishing angle and leave visible floor near the three thresholds and all three room destinations. Keep the 1920s hospital amber and sickly green palette, without signs, letters, people, tokens, UI or watermark.
```

Nguồn: [bố cục](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TheDreamEaters/WakingNightmare.hs#L33), [Act xáo cửa](../../backend/arkham-api/library/Arkham/Act/Cards/TheDreamEaters/WakingNightmare/LookingForAnswers.hs#L19), [ghim](../../frontend/src/arkham/scene-anchors-the-dream-eaters.ts#L5).

## 8. Traces to Nowhere — mở mặt cắt khi Otherworld vào bàn

**Ảnh trong game:** `side-stories/traces-to-nowhere.webp` và `side-stories/traces-to-nowhere-otherworld.webp`.

Ban đầu dùng toàn cảnh Arkham. Codex *Pulled Below* ở nhà tang lễ hoặc *Across the Threshold* ở dinh thự Meiger có thể đưa riêng Ethereal Perch **73051** vào bàn. Interlude *The Culprit* đưa cả nhóm xuống Bone Pit **73052**, đưa các địa điểm Otherworld còn lại vào bàn và chuyển thẳng sang Agenda 4A. Thành phố vẫn hoạt động. *The Portal* **73050** cho phép quay lại các địa điểm Arkham đã lật. Ảnh mặt cắt được chọn ngay khi một trong ba mã xuất hiện, kể cả trước Agenda 4. Các địa điểm chưa vào bàn chưa có điểm tương tác.

```text
Extend the rain-soaked 1920s Arkham view into a single widescreen panorama with the city in the upper 64% and the underground Otherworld below. Retain the station clock tower, church, club street entrance, civic building, newspaper factory and gated hill estate. Draw one continuous stair from the basement arch inside Duterte Funeral Home's fenced grounds down to the central underground stone bridge, Ethereal Perch. Restore the club's green-awning door as an ordinary street entrance. Connect the bridge to a luminous Portal on its own landing at lower left and the Bone Pit at lower right with a dry landing on its rim. A small teal glint at Meiger Estate can hint at a second supernatural entrance. No text, markers or UI.
```

Nguồn: [The Culprit và Agenda 4A](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/TracesToNowhere.hs#L198), [codex xuống Ethereal Perch](../../backend/arkham-api/library/Arkham/Scenarios/TracesToNowhere/Helpers.hs#L435), [quay về Arkham từ The Portal](../../backend/arkham-api/library/Arkham/Location/Cards/TracesToNowhere/ThePortal.hs#L39).

## 9. Queen of Ash — đúng vị trí, sai nhận diện hai hầm

**Ảnh trong game:** `brethren-of-ash/queen-of-ash.webp`. **Mức sửa:** chỉnh hai khoang tại chỗ.

Có đủ 8 điểm. Hầm giữa dưới bể mang ghim Flooded Crypt **12185** nhưng đang đọc như hốc khô có đốm lửa; khoang phải **12187** là Toxic Waste Pit, không phải “Sewer Incline” như script preview cũ. Dòng nước đổ hiện tại thiếu dấu hiệu bể chất thải. Giữ logic lật lá và bộ điểm đang dùng.

```text
Inpaint only two existing chambers in the attached Queen of Ash sewer cutaway, preserving its exact widescreen camera, walls, cistern and all other room centers. Change the dark central arch below the cistern (about 52% across, 60% down) into a clearly flooded burial crypt: visible ankle-to-knee-deep still water, submerged stone coffins, wet burial niches and ripples, plus a dry lip for a marker. Make the large rightmost tunnel (about 88% across, 61% down) visibly open onto a Toxic Waste Pit with a contained sump, corroded discharge pipes and a separate maintenance ledge, rather than just an ordinary descending drain. Keep the other six destinations recognizable and separate, with the grated Sewer Culvert still below the middle. Keep the 16:9 cinematic sewer lighting. No letters, symbols, grid, UI, characters, watermark or extra rooms.
```

Nguồn: [mã lá](../../backend/arkham-api/library/Arkham/Location/CardDefs/BrethrenOfAsh/QueenOfAsh.hs), [điểm khi lật](../../frontend/src/arkham/revealed-scene-positions.ts#L34).

## 10. River of Blood — làm rõ đảo và ngõ; giữ bố cục hai bờ

**Ảnh trong game:** `children-of-blood/river-of-blood.webp`. **Mức sửa:** chỉnh cục bộ. Ảnh có công trình phía xa bên trái nhưng đường nước không tách nó thành một đảo đọc được; Back Alley **13022/13023** đang ghim ngay mép nước, không có ngõ hẹp rõ ở đó. Có thể tận dụng ngõ nếu chọn được lối có sẵn; chỉ cần vẽ thêm phần còn thiếu. Dawn/Dusk là hai bộ lá cùng địa hình, không cần hai bộ công trình.

```text
Edit the attached 1920s river map locally in one 16:9 high-angle panorama. Keep Erwin Bridge, River Docks, Waterfront Warehouse and the three already legible streets (Main Street, Garrison Street and Water Street) in their existing neighborhoods. Make the upper-left Unvisited Isle an unmistakable small landmass surrounded by visible water on all sides; give it a shore landing and a separate walkable path, with no hidden land bridge merging it into the far bank. Add a narrow but easily visible Back Alley cut between blank brick side walls by the near-left waterfront, with a dry cobblestone landing and a clear mouth into the street. Do not put the alley marker space in the river or on a dock. Use one continuous river and keep the warm red dusk light, no characters, lettering, signs, labels, grid, UI or watermark.
```

Nguồn: [bố cục và nhánh Dawn/Dusk](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/ChildrenOfBlood/RiverOfBlood.hs#L43), [lá](../../backend/arkham-api/library/Arkham/Location/CardDefs/ChildrenOfBlood/RiverOfBlood.hs), [ghim](../../frontend/src/arkham/hemlock-overview.ts#L540).

## 11. Curse of the Rougarou — nhiều địa điểm mở muộn vẫn dùng chung một vũng

**Ảnh trong game:** `side-stories/curse-of-the-rougarou.webp`. **Mức sửa:** nới nền hoặc dùng các cụm sprite nếu muốn giữ ảnh.

Brackish Waters **81010**, Forgotten Marsh **81013** và Foul Swamp **81016** trùng `[50,48]`; Cursed Shores **81007** và Overgrown Cairns **81018** trùng `[20,26]`. Màn bắt đầu ở một nhóm, sau đó Act đưa các lá set-aside vào bàn. Các nhóm có thể cùng tồn tại. Phần tranh hiện có thiên về một đầm nước trung tâm với vài nhà ven bờ, nên không đủ điểm có đặc trưng riêng cho tất cả các cụm.

```text
Expand the attached moonlit Louisiana bayou into one readable 16:9 high-angle landscape. Keep continuous waterways and group the land into four connected districts with independent walkable clearings. For New Orleans, place Cursed Shores at a muddy shoreline near two distinct side sites: the elegant Garden District and a modest Broadmoor neighborhood. For Riverside, show Brackish Waters as a clearly separate tidal inlet, close to Audubon Park and the distinct Faubourg Marigny streetfront. For Wilderness, separate reed-filled Forgotten Marsh from a dry Trapper's Cabin clearing and a dense Twisted Underbrush trail. For Unhallowed, show Foul Swamp as a black cypress pool, with two clearly different adjacent banks: stone Overgrown Cairns and an open Ritual Grounds clearing. Use dry banks, raised roots, small piers and paths to separate all twelve standing areas; never use one central puddle to stand for multiple locations. Preserve moonlight and dark vegetation. No people, letters, labels, UI, grids or watermark.
```

Nguồn: [setup](../../backend/arkham-api/library/Arkham/Scenario/Scenarios/CurseOfTheRougarou.hs#L75), [Act mở các nhóm](../../backend/arkham-api/library/Arkham/Act/Cards/CurseOfTheRougarou/FindingLadyEsprit.hs#L34), [ghim](../../frontend/src/arkham/hemlock-overview.ts#L1108).

## Kiểm tra các cảnh dùng lại ảnh hiện có

| Cảnh | Kết quả đối chiếu và bước tiếp theo |
|---|---|
| *Extracurricular Activity* (kể cả Return to) | Ảnh campus đã có dãy công trình riêng và khoảng sân; không lấy lỗi **12118/12120** của *Spreading Flames* để kết luận cảnh này cũng thiếu Science Hall. |
| *One Last Job* | Các khối La Bella Luna, Hibb's, Tillinghast, Đại học và Rivertown tách được. Downtown **01130/01131** là các lựa chọn của cùng khu; không coi trùng ghim là hai lá cùng nằm trên một điểm. Có thể làm biến thể kiến trúc cho từng lá nếu muốn đạt độ chính xác tới từng mặt thẻ. |
| *Smoke and Mirrors* | Bố cục 3×3 đã tách các khu. Cặp Downtown, Uptown và Đại học là các biến thể theo ván/chặng. Nếu cần phân biệt mỗi biến thể, cân nhắc ảnh lớp theo lá; không vẽ thêm ô cho tất cả cùng lúc. |
| *Blood on the Altar* | Hidden Chamber mở từ vị trí được chọn trong ván và frontend đặt cạnh lối vào. Không ghim cứng một hầm bí mật vào duy nhất một căn nhà. |
| *Doom of Arkham Part II* | Đã đặt Easttown **11694** trên cụm công nghiệp bên phải và dùng chung điểm theo khu phố trước/sau khi Ruined. Hai mái nhà, Rivertown, đại học, bệnh viện và Southside có điểm riêng. |
| *The Vanishing of Elina Harper* / *In Too Deep* | Các cụm nhà, cầu, cảng, cải đạo/nhà thờ và xưởng nhận diện được. Kiểm tra điểm lối vào từng mốc, nhất là nhà ghim gần mép ảnh, trước khi đặt vẽ lại cả thị trấn. |
| *The Boundary Beyond* và các cảnh nền/sprite động | Nhiều neo trùng do thay lá hiện tại bằng địa điểm cổ cùng ô, hoặc nền đơn sắc để game tự đặt sprite theo ván. Không yêu cầu tách thành công trình cố định chỉ vì đọc thấy trùng tọa độ. |

## Kiểm tra sau tích hợp

- Đã xem ảnh cuối cùng với điểm neo chồng lên từng nền. Các phòng được bố trí theo vật dụng và vách ngăn nhận diện. Lá cửa úp của *Waking Nightmare*, *The Midwinter Gala* và *New Horizons* dùng điểm tạm, rồi chuyển đến nội thất sau khi lật.
- Kiểm tra bằng mã lá thực tế gồm các phòng mở qua Act, hai phần của *Fortune and Folly*, hai trạng thái của *Traces to Nowhere* và vị trí Easttown trước/sau Ruined.
- 50 test Scene Map và kiểm tra kiểu TypeScript đã qua. Đã giải mã đủ 10 WebP 1920×1080 và kiểm tra điểm neo bằng ảnh chồng. Chưa kiểm tra trong ván chơi trực tiếp.
- Cả hai biến thể Dawn/Dusk của *River of Blood* và Day/Night của *New Horizons* dùng chung tranh của từng màn. Trong *New Horizons*, buồng khóa có phần nội thất nhìn được sau cánh cửa sắt.
- Các đoạn mô tả lỗi ở mục 1–7 và 9–11 ghi nhận hình trước đợt sửa. Các màn ngoài danh sách đã qua sàng lọc ảnh, với độ phủ hạn chế đối với tổ hợp ván động và homebrew.
