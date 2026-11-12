# Giao việc cho Codex: 32 ảnh The Dream-Eaters

Status (2026-11-13): Đã xuất 32 WebP và tích hợp Scene Map cho 8 kịch bản. Xem bản xuất, overlay và kết quả kiểm tra ở cuối file.

## Vì sao giao tay

`route_media.py ... --route codex-cli` không chạy được trên máy này:

1. `~/.codex/config.toml` đặt `model = "gpt-6.1-sol"`; tài khoản ChatGPT báo `model_not_found` (gpt-5, 5.4, 5.5 cũng bị từ chối). Codex CLI không có model nào dùng được → không có công cụ ảnh.
2. Script skill còn truyền cờ `sleep_tool` mà codex-cli 0.147.0 không biết (đã tránh bằng bản sao ở scratchpad, nhưng lỗi 1 vẫn chặn).

Nếu bạn sửa được model (`codex` đăng nhập đúng gói, hoặc đổi `model` trong config sang model tài khoản được dùng), có thể chạy lệnh ở cuối file. Nếu không, mở Codex (app/CLI) và giao nguyên file này.

## Quy tắc (bắt buộc)

- Mọi ảnh phải đính **tranh lá location thật** làm reference. Ảnh đã tải sẵn ở `art-src/the-dream-eaters/refs/<mã>.png` (phần tranh đã cắt khỏi khung lá, 705×~457; bản gốc cả lá: `refs/<mã>.avif`). Khi chữ và tranh lá khác nhau thì theo tranh lá. Bỏ khung, chữ, icon, nhân vật trên lá.
- Nền 16:9, tạo 1536×864 hoặc lớn hơn; sprite 3:2 (1536×1024) **nền trong suốt**; không chữ, khung, watermark, lưới, người.
- Mỗi ảnh tạo ra thư mục/tên riêng, lưu `art-src/the-dream-eaters/gen/<slug>-vN.png`. Chưa đạt thì tạo lại tới khi đạt.
- Prompt chi tiết của 13 tranh tĩnh: [phase-01-static-art.md](phase-01-static-art.md) (mục "Prompt nháp"); sửa mô tả landmark theo tranh lá. Prompt Waking Nightmare đã viết sẵn ở `art-src/the-dream-eaters/prompts/waking-nightmare.txt`.
- Tông màu: Web of Dreams (Waking Nightmare, Thousand Shapes, Point of No Return) = noir 1920s sơn dầu; Dreamlands = huyền ảo bão hòa (hổ phách, ngọc bích, tím, trăng bạc), vẫn sơn dầu.
- Prompt chuẩn của skill: 3 phần (Master Shot / Spatial Landmarks / Lighting) + negative `comic panels, split screen, multi-panel, grid, borders, frames, text labels, watermark, cartoonish, 3d plastic`. Mỗi prompt nói rõ thứ tự reference ("Reference 1 = …, place it LEFT").

## Hậu kỳ và đặt file

```bash
python -I art-src/the-dream-eaters/finalize.py <kind> <png> <đường dẫn đích không đuôi>
```

Đích tính từ `frontend/public/img/scenes/the-dream-eaters/`. `kind`: `bg` (→1920×1080 q88), `sprite` (→768×512 RGBA), `square` (→512²), `big` (→1024², đặt `NOTRIM=1` cho thân Atlach-Nacha), `tall` (→512×1024, `NOTRIM=1` cho chân). Nếu ảnh dính ngôi sao watermark góc dưới phải thêm `INPAINT=1`. PNG gốc giữ ở `art-src/`, không đưa vào `public/`.

## A. 13 tranh tĩnh (kind `bg`, đích `<slug>`)

| # | Slug | Reference (theo thứ tự, ≤ 8) |
|---|---|---|
| 1 | `waking-nightmare` | 06070 Waiting Room, 06071 Emergency Room, 06072 Experimental Therapies Ward, 06073 Records Office, 06074 Stairwell, 06075 Morgue (chỉ lấy không khí tầng hầm) |
| 2 | `beyond-the-gates-steps` | 06045 Seventy Steps, 06046 Cavern of Flame, 06047 Seven Hundred Steps, 06048 Base of the Steps, 06049 Enchanted Path |
| 3 | `beyond-the-gates-woods` | 06049 Enchanted Path; thêm 1–2 lá Enchanted Woods (xem mã trong `Location/CardDefs/TheDreamEaters/BeyondTheGatesOfSleep.hs`, tải `https://assets.arkhamhorror.app/img/arkham/cards/<mã>.avif`) |
| 4 | `kadath-kingdom-of-the-skai` | 06127 Ulthar, 06128 Skai River, 06129 Dylath-Leen |
| 5 | `kadath-oriab` | 06136 Baharna, 06137 Mt. Ngranek, 06138 Nameless Ruins |
| 6 | `kadath-mnar` | 06130 Kadatheron, 06131 Sarnath, 06132 Ruins of Ib |
| 7 | `kadath-forbidden-lands` | 06133 Ilek-Vad, 06134 Forbidden Lands, 06135 Zulan-Thek |
| 8 | `kadath-timeless-realm` | 06139 Celephaïs, 06140 Serannian, 06141 Hazuth-Kleg, 06142 Temple of Unattainable Desires, 06143 City-Which-Appears-on-No-Map |
| 9 | `thousand-shapes-house` | 06174 Burial Ground, 06175 Front Porch/Entryway, 06178 Upstairs Hallway, 06181 Attic, 06182 Unmarked Tomb |
| 10 | `dark-side-of-the-moon` | 06223 White Ship, 06222 Light Side, 06221 Caverns (Light), 06215 City of the Moon-Beasts, 06216 Dark Crater, 06220 Black Core, 06217 Temple of the Moon Lizard, 06218 Moon Forest (06219 Caverns Dark Side, 06214 Galley: mô tả bằng chữ) |
| 11 | `point-of-no-return` | 06256 Tower of Koth, 06259 Sea of Bones, 06260 Peaks of Thok, 06254 Vaults of Zin, 06255 City of Gugs, 06261 Vale of Pnath, 06257 Plain of the Ghouls, 06258 Crag of the Ghouls (06053 Stone Trapdoor + Sea of Pitch: mô tả bằng chữ) |
| 12 | `where-the-gods-dwell-leng` | 06295 Plateau of Leng, 06297 Monastery of Leng, 06296 Cold Wastes, 06298 Onyx Gates, 06299 The Onyx Castle |
| 13 | `where-the-gods-dwell-towers` | 06299 The Onyx Castle + 06300 (một Forsaken Tower làm phong cách; cả 6 tháp 06300–06305 đều cùng bóng đá đổ nát, vẽ giống hệt nhau) |

Vị trí từng landmark (trái/phải/trên/dưới) và ô xáo ngẫu nhiên: bảng "Danh sách tranh" ở [phase-01-static-art.md](phase-01-static-art.md). Giữ đúng thứ tự trái/phải của ma trận; lá nối nhau đứng gần nhau.

## B. Weaver of the Cosmos (06333), đích `weaver/…`

Nền vũ trụ + sprite; **không** vẽ nút location trên mạng. Chi tiết plan: [weaver plan](../261112-2358-weaver-of-the-cosmos-web-scene/plan.md).

| File đích | kind | Reference | Nội dung |
|---|---|---|---|
| `weaver/bg-bridge` | bg | 06340, 06341 | Khoảng không vũ trụ tím than (prompt void của skill dynamic-grid §3.1), một sợi tơ nhện khổng lồ phát sáng chạy dọc giữa tranh, không nút, không nhện |
| `weaver/bg-ring` | bg | 06342, 06344 | Cùng khoảng không, một mạng nhện tròn mờ khổng lồ 8 nan tỏa từ tâm, không nút, không nhện; giữa tranh êm |
| `weaver/06340` | sprite | 06340 Web Stairs | sprite location vẽ theo tranh lá (prompt sprite chuẩn ở mục D) |
| `weaver/06341` | sprite | 06341 Cosmic Web | như trên |
| `weaver/06342` | sprite | 06342 Tangled Web | như trên |
| `weaver/06343` | sprite | 06343 Prison of Cocoons | như trên |
| `weaver/06344` | sprite | 06344 Vast Web | như trên |
| `weaver/06345` | sprite | 06345 Web-Woven Island | như trên |
| `weaver/back` | square | mặt sau *The Great Web* (tải `06340b`… nếu có, hoặc lá úp), 06340 làm màu | tấm mạng nhện chung đơn giản, có mặt phẳng cho nhân vật đứng, không chi tiết riêng |
| `weaver/atlach-nacha` | big (`NOTRIM=1`) | 06346 Atlach-Nacha | nhìn thẳng từ trên xuống, đầu và bụng phân biệt rõ, chân tách riêng, tâm xoay đặt giữa phần đầu-ngực; nền trong suốt 1024² |
| `weaver/legs` | tall (`NOTRIM=1`) | 06348, 06349, 06350 (chân) | một chân nhện dài nhìn từ trên, **gốc ở đáy ảnh**, chỉ thẳng lên; trong suốt, 512×1024 |

## C. Endless Stairs (06168 Act 2), đích `endless-stairs/…`

Chi tiết plan: [endless-stairs plan](../261112-2358-endless-stairs-scene/plan.md).

| File đích | kind | Reference | Nội dung |
|---|---|---|---|
| `endless-stairs/bg` | bg | 06183, 06185, 06187 (phong cách đá/gỗ) | Giếng cầu thang xoắn vô tận nhìn nghiêng từ trên, đá cũ và gỗ mục chìm vào bóng tối cả trên lẫn dưới, **không** chiếu nghỉ nổi bật; noir cùng tông tranh nhà |
| `endless-stairs/06183` … `06188` | sprite | từng lá cùng mã | 6 Mysterious Stairs đã lật, mỗi lá một bóng dáng và màu nhấn riêng |
| `endless-stairs/back` | sprite | một lá bất kỳ làm phong cách | đoạn cầu thang chìm trong sương, không chi tiết riêng |

## D. Prompt sprite location chuẩn

```text
Game map sprite of a single location, Lovecraftian dream/cosmic horror, seen from a high 3/4 angle, isolated on a fully TRANSPARENT background (PNG with alpha), 3:2 landscape, 1536x1024. No text, no frame, no drop shadow. Painterly, matching Arkham Horror LCG card art. Use the attached card illustration as the reference for the subject, shapes, composition and dominant colors; redraw it as a free-standing map piece without the card frame, text, icons or living figures. The LOCATION ITSELF fills about 80% of the canvas. Strong unique silhouette recognizable at 150 px wide, ONE signature accent color taken from the reference. Leave a small flat clear spot at lower-center for a tiny standing figure. Crisp edges for clean alpha. [mô tả riêng rút từ tranh lá]
```

Negative: `generic round island, flat round platform, multiple locations, card frame, text, icons, watermark, border, people, background scenery, sky band`.

Duyệt trước khi giao lại: contact sheet 150 px, đoán đúng tên từng sprite không cần nhãn; hai sprite không trùng bóng dáng/màu.

## E. Lệnh chạy tự động (nếu sửa được model Codex)

```bash
python <scratchpad>/g2m/scripts/route_media.py image --route codex-cli --prompt-file art-src/the-dream-eaters/prompts/<slug>.txt --reference art-src/the-dream-eaters/refs/<mã>.png ... --size 1536x1024 --out-dir art-src/the-dream-eaters/gen/<slug>-v1
```

(`<scratchpad>/g2m` là bản sao skill đã bỏ cờ `sleep_tool`; hoặc dùng bản gốc nếu bạn nâng codex-cli ≥ 0.153.)

## Sau khi có ảnh

Báo lại thư mục ảnh; phần còn lại (anchor, `scene-anchors-the-dream-eaters.ts`, `SceneAtlachNacha.vue`, hiệu ứng stairs, test) làm ở session code theo [phase-02](phase-02-static-integration.md) và 2 plan đặc biệt.

## F. Sửa góc nhìn sau lượt tạo đầu (2026-11-13)

Lượt đầu của Codex ra 19 ảnh; nhiều ảnh là **phong cảnh nhìn ngang** (có đường chân trời, bầu trời, mặt trăng, công trình quay mặt về người xem), không hợp làm nền map có điểm neo. Mọi tranh nền tĩnh phải theo khối prompt này (dán đầu mỗi prompt, thay cho "panoramic view"):

```text
Camera: a high-angle, near top-down bird's-eye game-map view, about 65-75 degrees looking down, like an illustrated tabletop board. NO horizon line, NO sky, NO moon, NO sunset, NO aurora: the ground plane fills the whole frame edge to edge. Each landmark is a separate compact structure seen from above, about 15-20% of the frame width, set on its own patch of ground with clear open space (paths, water, rock) between landmarks so a small round marker can sit at each entrance. Landmarks are spread evenly across the frame in the grid positions listed below; nothing important within 6% of the border. Do not make a cinematic vista or a single big hero object.
```

### Bản xuất sau feedback

13 nền WebP 1920×1080 đã kiểm tra trong [thư mục scene](../../frontend/public/img/scenes/the-dream-eaters/). Bản PNG từ ImageGen nằm trong [gen](../../art-src/the-dream-eaters/gen/) và prompt tương ứng trong [prompts](../../art-src/the-dream-eaters/prompts/). Xem [ảnh ghép 13 nền](../../art-src/the-dream-eaters/review/static-backgrounds-contact.jpg).

| Slug | Bản xuất | Ghi chú |
|---|---|---|
| `waking-nightmare` | v4 | Đã bỏ phòng cạnh Stairwell, giữ ba cửa thép. |
| `beyond-the-gates-steps` | v2 | Bản người dùng đã duyệt. |
| `beyond-the-gates-woods` | v1 | Giữ bản đã duyệt, có ảnh thử pin. |
| `kadath-kingdom-of-the-skai` | v2 | Ảnh 1 người dùng chọn. |
| `kadath-oriab` | v2 | Tạo lại theo camera mục F. |
| `kadath-mnar` | v2 | 06130 Kadatheron là hàng cột vàng bên phải, 06131 Sarnath là thành xanh ở giữa. |
| `kadath-forbidden-lands` | v2 | Tạo lại theo camera mục F. |
| `kadath-timeless-realm` | v2 | Temple giữ tháp đỏ và lửa xanh-vàng theo 06142. |
| `thousand-shapes-house` | v2 | Tạo lại theo camera mục F. |
| `dark-side-of-the-moon` | v2 | Ảnh 17 người dùng chọn. Hai cửa hang và Black Core tách riêng. |
| `point-of-no-return` | v2 | Bản người dùng duyệt. Có bốn vịnh Sea of Pitch, hai vịnh dưới nằm cạnh nhau. |
| `where-the-gods-dwell-leng` | v2 | Tạo lại theo camera mục F. |
| `where-the-gods-dwell-towers` | v2 | Ảnh 18 người dùng chọn, nền tuyết tím. |

Xem [overlay điểm neo từ code](../../art-src/the-dream-eaters/review/static-anchor-contact.jpg), [pin Enchanted Woods](../../art-src/the-dream-eaters/review/beyond-the-gates-woods-pin-preview.jpg) và [pin Dark Side of the Moon và Point of No Return](../../art-src/the-dream-eaters/review/temporary-backgrounds-pin-preview.jpg). Pin Stairwell đặt ở chân cầu thang. Xem [đối chiếu tranh lá Kadath](../../art-src/the-dream-eaters/review/kadath-card-comparison.jpg).

19 asset động đã xuất. Sáu mặt lật `06183b`–`06188b` có cùng tranh gốc. Mỗi sprite lấy một đoạn cầu thang khác nhau để phân biệt khi thu nhỏ. Web-Stairs dùng v2 với bậc tơ rõ, chân Atlach-Nacha dùng v2 có khớp và đốt giáp. Xem [ảnh ghép 150 px](../../art-src/the-dream-eaters/review/dynamic-assets-contact.jpg).

### Kiểm tra tích hợp

Thân Atlach-Nacha dùng PNG v2 và prompt v2. Tâm canvas xuất trùng phần đầu-ngực. Xem [bản ghép thân và chân ở 0° và 45°](../../art-src/the-dream-eaters/review/atlach-nacha-rotation-preview.jpg).

- Đủ 32 WebP. Đã kiểm tra kích thước xuất, alpha của sprite và gốc chân ở hàng pixel cuối.
- 58 test Scene Map qua, `vue-tsc` qua. Bộ test frontend chạy 378 test, 376 qua. Hai lỗi còn lại nằm ở chuỗi kịch bản Haskell và danh mục Ultimatum/Boon tiếng Trung. [Log kiểm tra](verification.log).
- Chrome headless chạy component thật với trạng thái kiểm thử. Đã kiểm tra 4 ô cầu tơ, 8 ô vòng, 4 chân, click Atlach-Nacha, xoay 45°, trượt theo cung và chuyển bậc Endless Descent. Không thấy nhãn đè nhau trong lần kiểm tra ở 390 px. [Weaver desktop](../../art-src/the-dream-eaters/review/weaver-render-desktop.png) · [Weaver điện thoại](../../art-src/the-dream-eaters/review/weaver-render-phone.png) · [Endless Stairs điện thoại](../../art-src/the-dream-eaters/review/endless-stairs-render-phone.png).
- Chưa kiểm tra qua ván thật vì API local ở cổng 3002 không chạy.
