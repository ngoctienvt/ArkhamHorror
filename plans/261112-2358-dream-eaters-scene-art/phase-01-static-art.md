# Phase 1: 13 tranh tĩnh

Theo [arkham-overview-art](../../.agents/skills/arkham-overview-art/SKILL.md) §3–5. Mỗi tranh đi qua 5 bước dưới đây; prompt ở cuối file là bản nháp để sửa sau bước 1.

## Quy tắc bắt buộc: tranh lá location là reference

Mọi tranh (và mọi sprite ở hai plan đặc biệt) **phải đưa ảnh lá location thật vào công cụ tạo ảnh làm reference**. Hình dáng, vật thể chính, bố cục và màu chủ đạo của từng landmark lấy theo tranh lá; mô tả chữ chỉ để bổ sung, khi chữ và tranh khác nhau thì theo tranh. Bỏ khung, chữ, icon, nhân vật có trên lá.

- Nguồn: `https://assets.arkhamhorror.app/img/arkham/cards/<mã>.avif` (lá 2 mặt: `<mã>a` / `<mã>b`; lá chưa lật dùng mặt sau nếu cần).
- Tải về `art-src/the-dream-eaters/refs/<mã>.avif`, đổi sang PNG (`pillow-avif-plugin` hoặc `ffmpeg -i x.avif x.png`) vì route Codex nhận PNG/JPEG/WebP.
- Lá ở ô xáo ngẫu nhiên (cửa hầm, Enchanted Woods, Sea of Pitch, Forsaken Tower, cửa phòng): đưa **mặt sau chung** hoặc 1–2 lá đại diện làm reference cho phong cách, prompt yêu cầu hình chung cho cả nhóm.
- Codex nhận tối đa **8 reference/lần**. Tranh có > 8 lá (#1, #9, #10, #11): ưu tiên lá cố định và lá nổi bật nhất; lá còn lại tả bằng chữ rút từ tranh lá (ghi vào cột "Tranh lá cho thấy" trong bảng ref, như plan Devil Reef).
- Prompt phải nói rõ thứ tự reference, ví dụ `Reference 1 is the card art of Ulthar (place it LEFT), reference 2 is Skai River (CENTER)...`.

## Route tạo ảnh: Codex

Tạo ảnh tự động qua skill `generate2dmedia` của Codex, route `local:codex-cli` (đã kiểm tra bằng `forge_doctor.py`: codex-cli 0.147.0 sẵn sàng, chạy trên tài khoản Codex đã đăng nhập, không có API key OpenAI/Gemini). Một lệnh cho mỗi tranh, chạy từ gốc project:

```bash
python ~/.codex/skills/generate2dmedia/scripts/route_media.py image --route local:codex-cli --prompt-file art-src/the-dream-eaters/prompts/<slug>.txt --reference art-src/the-dream-eaters/refs/<mã1>.png --reference art-src/the-dream-eaters/refs/<mã2>.png --size 1536x1024 --out-dir art-src/the-dream-eaters/gen/<slug>-v1
```

- Route CLI lấy kích thước từ prompt, nên prompt phải ghi `16:9 widescreen, 1536x864` (nền) hoặc `3:2, 1536x1024, transparent background` (sprite).
- Mỗi lần chạy ra thư mục mới (`-v1`, `-v2`...) gồm `generated.png`, `job.json`, `prompt.txt`; không ghi đè.
- Lần chạy đầu ghi nhận route VERIFIED; nếu lỗi đăng nhập/quota thì dừng và báo người dùng, không chuyển sang vẽ bằng code.
- Mở `generated.png` bằng Read để tự duyệt trước khi hậu kỳ.

## Quy trình cho mỗi tranh

1. **Tải reference** các lá của tranh (mục trên) và ghi 1 dòng "vật thể chính + màu chủ đạo" cho từng lá. Sửa phần mô tả landmark trong prompt theo tranh lá.
2. **Kiểm tra lân cận.** Đọc `[Symbol]` kết nối trong `Location/CardDefs/TheDreamEaters/<Scenario>.hs`. Lá nối nhau phải đứng gần nhau trên tranh (Proximity Rule).
3. **Tạo ảnh qua Codex** bằng mẫu 3 phần + negative prompt chuẩn của skill, kèm reference. 16:9, không người, không chữ. Đặt mỗi landmark trong tranh cạnh tranh lá tương ứng để so; lệch bản chất thì sửa prompt và chạy lại.
4. **Hậu kỳ:** xóa watermark (`cv2.inpaint` Telea r12–15), upscale nếu < 1920 px, WebP q85–90, 200–450 KB.
5. **Duyệt:** chạy overlay preview pin (skill §6), sửa đến khi mỗi pin nằm đúng cửa/chân công trình, không nhãn đè nhau.

Ô `.` trong ma trận vẽ thành cảnh trống (sương, đá, nước, rừng), không có công trình.

## Hai tông màu

| Nhánh | Màn | Bảng màu |
|---|---|---|
| Thế giới thức + Underworld (*Web of Dreams*) | Waking Nightmare, Thousand Shapes, Point of No Return | Noir 1920s: than chì, nâu umber, đèn khí vàng; Underworld chuyển sang xanh rêu, tím than, phát quang nấm |
| Dreamlands (*Dream-Quest*) | Beyond the Gates, Kadath, Dark Side of the Moon, Where the Gods Dwell | Huyền ảo bão hòa hơn: hoàng hôn hổ phách, ngọc bích, tím ngọc, ánh trăng bạc; vẫn sơn dầu, không hoạt hình |

## Danh sách tranh

| # | File (`img/scenes/the-dream-eaters/`) | Màn / giai đoạn | Neo theo | Lá (mã → ô hàng,cột) |
|---|---|---|---|---|
| 1 | `waking-nightmare.webp` | 06063 toàn màn | mã + nhãn | waitingRoom 06070 (1,1) · recordsOffice 06073 (0,1) · emergencyRoom 06071 (2,0) · experimentalTherapiesWard 06072 (2,2) · stairwell 06074 (3,2) · nhãn `basementDoor1` (3,1), `basementDoor2` (4,2), `basementDoor3` (3,3) |
| 2 | `beyond-the-gates-steps.webp` | 06039 Act 1–2 | mã | seventySteps 06045 (0,1) · theCavernOfFlame 06046 (1,2) · sevenHundredSteps 06047 (2,1) · baseOfTheSteps 06048 (3,1) · theEnchantedPath 06049 (4,1) ở chân tranh |
| 3 | `beyond-the-gates-woods.webp` | 06039 sau *The Final Descent* | mã + nhãn | theEnchantedPath 06049 (4,1) giữa trên · nhãn `enchantedWoods1–6` theo ma trận 2 cột × 3 hàng hai bên đường |
| 4 | `kadath-kingdom-of-the-skai.webp` | 06119 lúc đầu | mã | ulthar 06127 · skaiRiver 06128 · dylathLeen 06129 |
| 5 | `kadath-oriab.webp` | 06119 vùng Oriab | mã | baharna 06136 · mtNgranek 06137 · namelessRuins 06138 |
| 6 | `kadath-mnar.webp` | 06119 vùng Mnar | mã | kadatheron 06130 · sarnath 06131 · ruinsOfIb 06132 |
| 7 | `kadath-forbidden-lands.webp` | 06119 vùng Forbidden Lands | mã | ilekVad 06133 · forbiddenLands 06134 · zulanThek 06135 |
| 8 | `kadath-timeless-realm.webp` | 06119 vùng Timeless Realm | mã | celephais 06139 · serannian 06140 · hazuthKleg 06141 · templeOfUnattainableDesires 06142 (ra khi lật Hazuth-Kleg) · cityWhichAppearsOnNoMap 06143 (ra khi lật Temple) |
| 9 | `thousand-shapes-house.webp` | 06168 Act 1 | mã + nhãn | burialGround 06174 (3,2) · frontPorchEntryway 06175 (2,2) · upstairsHallway 06178 (1,2) · attic 06181 (0,2) · unmarkedTomb 06182 (3,3) · nhãn `upstairsDoorway1` (0,1), `upstairsDoorway2` (0,3), `downstairsDoorway1` (2,1), `downstairsDoorway2` (2,3) |
| 10 | `dark-side-of-the-moon.webp` | 06206 toàn màn | mã | theWhiteShip 06223 (0,0) · lightSideOfTheMoon 06222 (0,1) · cavernsLightSide 06221 (0,2) · cityOfTheMoonBeasts 06215 (1,0) · theDarkCrater 06216 (1,1) · theBlackCore 06220 (1,2) · templeOfTheMoonLizard 06217 (2,0) · moonForest 06218 (2,1) · cavernsDarkSide 06219 (2,2) · moonBeastGalley 06214 (3,1) |
| 11 | `point-of-no-return.webp` | 06247 toàn màn | mã + nhãn | enchantedWoods (Stone Trapdoor 06053) (0,0) · towerOfKoth 06256 (0,1) · seaOfBones 06259 (0,2) · peaksOfThok 06260 (0,3) · vaultsOfZin 06254 (1,0) · cityOfGugs 06255 (1,1) · valeOfPnath 06261 (1,2) · plainOfTheGhouls 06257 (2,0) · cragOfTheGhouls 06258 (2,1) · nhãn `seaOfPitch1` (0,4), `seaOfPitch2` (1,3), `seaOfPitch3` (2,3), `seaOfPitch4` (2,4) |
| 12 | `where-the-gods-dwell-leng.webp` | 06286 Act 1–2 | mã | plateauOfLeng 06295 (0,1) · monasteryOfLeng 06297 (1,0) · coldWastes 06296 (1,1) · onyxGates 06298 (2,1) · theOnyxCastle 06299 (2,2) |
| 13 | `where-the-gods-dwell-towers.webp` | 06286 sau *Beyond Dreams* | mã + nhãn | theOnyxCastle 06299 giữa · nhãn `northTower`, `southTower`, `eastTower`, `westTower` |

Ghi chú theo tranh:

- **#1, #9, #11, #13 có ô xáo ngẫu nhiên.** Vẽ ô đó bằng hình chung trong nhóm (cửa hầm, cửa phòng, vịnh biển nhựa đen, ngọn tháp đá) để lá nào rơi vào cũng hợp. Không vẽ chi tiết riêng của Morgue, Library, từng Sea of Pitch hay từng Forsaken Tower.
- **#2 → #3** dùng chung Enchanted Path để chuyển cảnh liền mạch: #2 kết thúc bằng cổng rừng ở đáy, #3 mở đầu bằng chính cổng đó ở trên.
- **#4–#8**: các vùng không bao giờ cùng có mặt (cả nhóm luôn dời chung sang vùng mới, vùng cũ bị gỡ), nên mỗi tranh là một vùng độc lập. Mỗi vùng chỉ 3–5 điểm, nên bố cục rộng, điểm cách nhau ≥ 25% chiều ngang. Giữ thứ tự trái/phải giống ma trận tổng để card mode và map khớp.
- **#10**: mặt trăng có hai nửa: hàng trên sáng (Light Side, White Ship), hàng dưới tối. Black Core là lõi phát sáng bên phải; Moon-Beast Galley là thuyền ở đáy giữa.
- **#11** là Underworld: hang khổng lồ, không có trời. Stone Trapdoor ở góc trên trái là lối từ Enchanted Woods xuống.

## Prompt nháp

Phần 3 (Lighting & Mood) và negative prompt dùng bản chuẩn của skill, trừ khi ghi khác. Với Dreamlands thêm vào phần 3: `dreamlike luminous haze, saturated amber and jade accents, silver moonlight`.

### #1 Waking Nightmare

```text
A 2.5D architectural cutaway of St. Mary's Hospital, Arkham, 1920s, at night, classic Lovecraftian cosmic noir digital oil painting, 16:9 widescreen. One seamless building cut open like a dollhouse, a faint sickly violet dream-rot creeping through the walls.
- TOP FLOOR CENTER-LEFT: a records office with tall wooden filing cabinets and a green banker's lamp.
- MIDDLE FLOOR CENTER-LEFT: a quiet waiting room with rows of wooden benches and a reception desk.
- MIDDLE FLOOR FAR-LEFT: an emergency room with iron hospital beds and white curtains.
- MIDDLE FLOOR CENTER-RIGHT: an experimental therapies ward with strange brass apparatus and restraint chairs.
- BASEMENT: a dim stone corridor with a concrete stairwell descending at center-right, and three identical heavy steel basement doors: one left of the stairwell, one directly below it, one on the far right.
```

### #2 Beyond the Gates of Sleep: steps

```text
A towering vertical dreamscape seen from a high angle, a colossal spiral stair carved into luminous cloud-cliffs descending into the Dreamlands, classic Lovecraftian dream fantasy digital oil painting, 16:9 widescreen.
- TOP CENTER: a short flight of seventy pale steps emerging from mist.
- UPPER RIGHT: a cavern mouth glowing with pillars of cold flame where two robed priests' shrine stands (no figures).
- MIDDLE CENTER: the long winding seven hundred steps, carved stone spiralling down.
- LOWER CENTER: a broad stone landing at the base of the steps.
- BOTTOM CENTER: the entrance of an enchanted forest path between giant gnarled trees.
```

### #3 Beyond the Gates of Sleep: Enchanted Woods

```text
A high-angle panoramic view of the Enchanted Woods of the Dreamlands at twilight, classic Lovecraftian dream fantasy digital oil painting, 16:9 widescreen. A single glowing forest path runs from the top center down the middle; on both sides, six distinct clearings in the dense ancient forest, three on the left and three on the right, each a soft open glade connected to the path by narrow trails. Giant twisted oaks, bioluminescent fungi, drifting fireflies, a pale moon behind the canopy.
```

### #4–#8 The Search for Kadath (mỗi vùng một prompt)

```text
#4: A high-angle panoramic view of the Kingdom of the Skai in the Dreamlands at golden afternoon. LEFT: the peaceful hill town of Ulthar with steep red roofs, cobbled lanes and many cats on walls. CENTER: the Skai River winding through green meadows with an old stone bridge. RIGHT: the dark port city of Dylath-Leen with basalt towers and black galleys moored at its quays.
#5: The Isle of Oriab across a dark sea. LEFT: a field of nameless black ruins half-swallowed by sand. CENTER-LEFT: the huge grey mountain Ngranek with a vast face carved into its peak. RIGHT: the terraced harbour city of Baharna with porphyry wharves.
#6: The land of Mnar beside a still grey lake. CENTER: the ancient city of Sarnath in grand ruin. RIGHT: Kadatheron, a city of carved stone and bronze statues. LOWER CENTER: the drowned Ruins of Ib in green lake water, strange lizard idols.
#7: The Forbidden Lands, a cold violet desert. LEFT: Zulan-Thek, a dark walled citadel. CENTER-LEFT: empty wind-carved dunes and black obelisks. CENTER: Ilek-Vad, a city of glass turrets on high cliffs over a twilight sea.
#8: The Timeless Realm. CENTER-LEFT: Celephaïs, a gleaming marble city with gilded minarets by the sea. UPPER CENTER-LEFT: Serannian, a pink cloud city floating in the sky above it. LOWER CENTER-LEFT: Hazuth-Kleg, a mountain city. CENTER-RIGHT (same height as Celephaïs): a shimmering city under a baleful star that seems to fade from existence. LOWER RIGHT (same height as Hazuth-Kleg): a radiant temple of impossible golden domes.
```

Mỗi prompt bắt đầu bằng câu chuẩn "A panoramic, wide-angle bird's-eye view of ... classic Lovecraftian dream fantasy digital oil painting, 16:9 widescreen. The scene is a single seamless connected environment with ..." của skill.

### #9 A Thousand Shapes of Horror: house

```text
A 2.5D architectural cutaway of a decaying 18th-century Arkham house with no name, at midnight, classic Lovecraftian cosmic noir digital oil painting, 16:9 widescreen. The house is cut open in cross-section above an overgrown graveyard.
- ATTIC (top center): low slanted beams, a boarded round window.
- UPSTAIRS: a narrow hallway in the center flanked by two identical closed panelled doors, one on the left and one on the right.
- GROUND FLOOR: a sagging front porch and entryway in the center flanked by two identical closed doors, left and right.
- BELOW (foreground): an ancient burial ground with leaning slate headstones directly under the house, and to the right a moss-covered unmarked stone tomb half-sunk in the earth.
```

Cột `mysteriousStairs` bên trái ma trận chỉ có ở Act 2, khi nhà đã bị gỡ; tranh này không cần chừa chỗ cho nó (xem plan Endless Stairs).

```text
```

### #10 Dark Side of the Moon

```text
A panoramic, high-angle view across the surface of the Dreamlands moon, classic Lovecraftian dream fantasy digital oil painting, 16:9 widescreen. The upper band is lit in pale silver light, the lower band is the shadowed dark side.
- UPPER LEFT: a white sailing ship docked at a crystal pier.
- UPPER CENTER: bright cratered plains of the light side.
- UPPER RIGHT and LOWER RIGHT: two cavern mouths leading inward, joined by a tunnel to a glowing molten core visible through a rift on the right.
- MIDDLE LEFT: a city of windowless grey towers of the moon-beasts.
- MIDDLE CENTER: a vast dark crater.
- LOWER LEFT: a temple with lizard-shaped columns.
- LOWER CENTER: a fungal forest of pale, toad-like trees.
- BOTTOM CENTER: a black galley with oars moored at a dark pool.
```

### #11 Point of No Return

```text
A panoramic, high-angle view of the Underworld beneath the Dreamlands, an immense cavern with no sky, classic Lovecraftian cosmic horror digital oil painting, 16:9 widescreen. Phosphorescent fungi and cold green light.
- UPPER LEFT: a stone trapdoor opening in the cavern ceiling with tree roots hanging through.
- UPPER CENTER-LEFT: the colossal Tower of Koth with giant steps.
- UPPER CENTER: a sea of bones, a plain of white skeletons.
- UPPER RIGHT: the needle-sharp Peaks of Thok.
- MIDDLE LEFT: the vaults of Zin, dark arches carved in rock.
- MIDDLE CENTER-LEFT: the cyclopean city of the Gugs, monolithic towers.
- MIDDLE CENTER: the Vale of Pnath, a deep valley heaped with bones.
- LOWER LEFT: a desolate plain of ghouls with burrows.
- LOWER CENTER-LEFT: a jagged crag with a narrow ascending path.
- RIGHT THIRD: a black tar sea split into four separate dark bays, one at upper right, two in the middle right, one at lower right.
```

### #12 Where the Gods Dwell: Leng

```text
A panoramic, high-angle view of the frozen Plateau of Leng at night, classic Lovecraftian cosmic horror digital oil painting, 16:9 widescreen. Purple-black sky, sparse campfires.
- UPPER CENTER: the bleak plateau with stone huts.
- MIDDLE LEFT: a windowless stone monastery with a single tall dome.
- CENTER: endless cold wastes of ice and wind.
- LOWER CENTER: towering onyx gates set in a cliff.
- LOWER RIGHT: the immense onyx castle of Kadath, black towers vanishing into the stars.
```

### #13 Where the Gods Dwell: Forsaken Towers

```text
A high-angle, symmetrical view of the onyx castle of Kadath at the summit of the world, classic Lovecraftian cosmic horror digital oil painting, 16:9 widescreen. CENTER: the great onyx castle. Around it, four separate tall stone towers on lonely crags connected to the castle by narrow bridges: one directly above (north), one directly below (south), one on the far left (west), one on the far right (east). All four towers share the same ruined dark stone silhouette with a faint glow at the top.
```

## Output

- 13 file WebP ở `frontend/public/img/scenes/the-dream-eaters/`.
- PNG gốc và ảnh preview overlay để ngoài `public/`.
- Bảng tọa độ pin đã duyệt cho từng tranh (chuyển sang phase 2).
