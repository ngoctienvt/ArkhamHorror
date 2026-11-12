# Phase 1 — Bộ ảnh Devil Reef (giao Codex)

Theo skill `arkham-dynamic-grid-scene` §3 (bản mới): **tranh trên lá bài là chuẩn**. Mỗi location có tên riêng là một sprite riêng vẽ theo tranh lá đó, địa điểm là chủ thể. Mặt sau chưa lật là sprite chung đơn giản. Thêm nền biển, chiếc thuyền và hai lớp nước.

## 0. Quy tắc bắt buộc

1. **Dùng ảnh lá thật làm reference cho mọi sprite location.** Tải ảnh từ URL trong bảng §3 và đưa vào công cụ tạo ảnh làm image reference. Hình dáng, vật thể chính, bố cục và màu chủ đạo lấy theo tranh. Mô tả bằng chữ chỉ để bổ sung; **khi chữ và tranh khác nhau thì theo tranh**.
2. **Địa điểm là chủ thể**, chiếm 75–85% khung. Không ép mọi lá thành "đảo đá tròn, mặt phẳng ở giữa" (lỗi đã gặp ở Before the Black Throne: 13 lá trông giống nhau).
3. Mỗi lá **một bóng dáng và một màu nhấn riêng** (bảng §3). Không hai lá trùng.
4. Chỉ vẽ lại theo tinh thần tranh, không sao chép nguyên bố cục lá; **bỏ mọi khung, chữ, icon, nhân vật** có trên lá. Tượng (Deep One Grotto, Temple, Shrine) được giữ vì là vật thể của địa điểm, nhưng vẽ là tượng đá, không phải sinh vật sống.

## 1. Quy cách file

| Loại | Canvas tạo | Xuất trong game | Ghi chú |
|---|---|---|---|
| Sprite location có tên (§3) | PNG 1536×1024 (3:2), nền trong suốt | **768×512 WebP q85** | Tên file = mã lá, vd. `07169.webp` |
| Sprite chung / mặt sau (§4) | PNG 1024×1024, nền trong suốt | **512×512 WebP q85** | |
| Thuyền (§5) | PNG 1536×1024, nền trong suốt | **768×512 WebP q85** | |
| Lớp nước (§6) | PNG 1536×1024, nền trong suốt | **768×512 WebP q85** | Cùng khung với sprite location để chồng khít |
| Nền (§7) | 16:9, upscale ≥ ×2 | **3840×2160** (tối thiểu 2560×1440) WebP q88 | |

- Ảnh trong game: `frontend/public/img/scenes/the-innsmouth-conspiracy/devil-reef/` (nền: `frontend/public/img/scenes/the-innsmouth-conspiracy/devil-reef-sea.webp`).
- PNG gốc để ngoài `public/`: `art-src/devil-reef/`. **Không đưa PNG vào `frontend/public/`.**
- Viền alpha sạch (không viền trắng/đen quanh chủ thể), không watermark (xóa ngôi sao Gemini bằng inpaint — snippet OpenCV trong skill §3.1), không chữ, không khung.

## 2. Prompt chung cho sprite location (dán trước mô tả riêng)

```text
Game map sprite of a single location from the stormy 1920s New England coast near Innsmouth, Lovecraftian horror, seen from a high 3/4 angle, isolated on a fully TRANSPARENT background (PNG with alpha), no text, no frame, no drop shadow on the background. Painterly style matching Arkham Horror LCG card art. Use the attached card illustration as the reference for the subject, its shapes, composition and dominant colors; redraw it as a free-standing map piece, without the card frame, text, icons or any living figures. The LOCATION ITSELF is the subject and fills about 80% of a 3:2 landscape canvas (1536x1024); it is NOT a generic round rock island. Any rock or sea base is a thin, minor element at the bottom, its edge breaking into foam that fades to transparent. Strong, unique silhouette that stays recognizable when shrunk to 150 pixels wide, with ONE signature accent color given below. Leave a small flat clear spot at lower-center for a tiny standing figure. Crisp edges for clean alpha.
```

Negative: `generic round island, flat round platform, big empty plateau, symmetrical rock disc, multiple locations, card frame, text, letters, icons, logo, watermark, border, people, living creatures, boat, sky band, horizon, background scenery`.

## 3. Sprite location có tên (theo tranh lá)

Reference: `https://assets.arkhamhorror.app/img/arkham/cards/<mã>.avif`; lá homebrew Return to: `https://assets.arkhamhorror.app/img/arkham/homebrew/return-to-the-innsmouth-conspiracy/cards/<số>.avif`.

| File | Lá (mã reference) | Tranh lá cho thấy (chuẩn) | Bóng dáng sprite | Màu nhấn | Mô tả riêng cho prompt |
|---|---|---|---|---|---|
| `07168.webp` | Churning Waters (`07168`) | Biển đêm dưới trăng tròn sau mây, nước xanh ngọc phát sáng, đầu một sinh vật có mắt sáng nhô lên giữa sóng, nhiều ngọn sóng nhọn | Một vùng biển xoáy dựng sóng nhọn, không có đất | Xanh ngọc phát sáng | a patch of heaving night sea under pale moonlight, the water glowing turquoise from below, jagged peaked wave crests and swirling foam, a dark eddy with a faint pair of glowing eyes just under the surface; no land at all |
| `07169.webp` | Lonely Isle (`07169`) | Một mỏm đá cao nhọn như ngọn tháp giữa sóng trắng, trời vàng chanh bệnh hoạn, đàn chim biển lượn | Mỏm đá đơn độc cao, nhọn, nghiêng | Vàng chanh / lục nhạt | a single tall, sharp, leaning spire of sea rock rising from crashing white surf, bathed in sickly yellow-green light, a few gulls circling its tip |
| `07170.webp` | Hidden Cove (`07170`) | Dải vách đá dài màu xanh đen kéo ngang, chân vách sóng trắng, đêm lạnh | Vách đá dài nằm ngang ôm lấy một vụng nhỏ | Xanh chàm | a long low dark-blue cliff headland stretching sideways and curling around a small sheltered cove, white surf at its foot, cold night light |
| `07171.webp` | Waveworn Island (`07171`) | Đảo đá sáng màu xếp tầng có cây xanh, sương trắng mù, một đảo đá nhỏ hơn bên phải, nước xanh lục | Đảo đá phân tầng + đảo con bên cạnh | Trắng sương / xanh bạc hà | a pale terraced rocky island with patches of green, wrapped in bright white sea mist, a smaller rock islet beside it, teal water |
| `07172.webp` | Salt Marshes (`07172`) | Đầm lầy phẳng màu nâu vàng, lau sậy và bụi cây khô trụi lá, ánh sáng mờ hổ phách | Mảng đầm thấp, rộng, lởm chởm cây khô | Hổ phách / nâu đất | a flat low salt marsh of ochre reeds, leafless dead shrubs and brackish pools in hazy amber light |
| `07173.webp` | Black Reef (`07173`) | Rạn đá đen lởm chởm giữa bão, tia sét trắng xanh đánh xuống, sóng xám | Rạn đá đen răng cưa, có tia sét | Trắng điện (sét) | a jagged black reef of wet broken rock in a storm, a crackling white-blue lightning bolt striking behind it, grey waves breaking over it |
| `07102.webp` | Underwater Cavern (`07102`, RT `:065` dùng chung) | Cửa hang dưới nước, nước xanh lục, rong biển hai bên, khoảng tối tròn ở giữa | Vòm hang tròn ngập nước | Xanh lục rong | a round flooded cave mouth seen under clear green water, tall kelp fronds on both sides, a dark circular opening in the middle |
| `07103.webp` | Tidal Pool (`07103`, RT `:066` dùng chung) | Hang có vũng nước phát sáng xanh điện, tia sáng rọi từ trên, phản quang hồng tím | Vũng nước tròn phát sáng trong vòng đá | Xanh điện + hồng | a rock basin holding a pool of glowing electric-blue water with pink reflections, a shaft of light falling into it |
| `07104.webp` | Underground River (`07104`, RT `:067` dùng chung) | Hang đá vôi vàng nâu, nhũ đá, lối đi gỗ dọc vách phải, dòng sông bên dưới | Khe hang dài có dòng sông và lối gỗ | Vàng đất / vàng óng | a golden-ochre limestone cave channel with stalactites, a dark river running through it and a narrow wooden walkway along one wall |
| `07174.webp` | Bootlegger's Hideaway (`07174a`, `07174b`) | Hang ngập nước sáng xanh lơ, giàn gỗ/bến tạm, thùng rượu nổi, bóng một khối hình Deep One mờ ảo phía sau | Bến gỗ trong hang + thùng rượu | Xanh lơ phát sáng | a flooded sea-cave smugglers' dock of wooden scaffolding with rum barrels floating and stacked, glowing cyan water, a vague ghostly fish-like shape carved into the rock behind |
| `07175.webp` | Deep One Grotto (`07175a`, `07175b`) | Hai hình Deep One to lớn có vây, ngồi khom, ánh sáng xám bạc từ trên | Hai tượng cá-người khom ngồi | Bạc xám | a grotto with two hulking crouching fish-headed Deep One stone idols with spiny fins, pale silver light falling on them from above |
| `07176.webp` | Cyclopean Ruins (`07176a`, `07176b`) | Sảnh tối xanh ngọc thẫm, vòng tượng trùm áo khổng lồ quanh sàn đá tròn chạm khắc | Sàn tròn chạm khắc + vòng tượng cao | Xanh ngọc thẫm | a sunken hall of colossal hooded statues standing in a ring around a round carved stone floor with concentric patterns, dark teal gloom |
| `07177.webp` | Temple of the Union (`07177a`, `07177b`) | Phòng đá cổ, sàn có rãnh phát sáng kẻ ô, hai tượng trắng đầu tròn (Dagon và Hydra) trên bệ, phiến đá đổ bên trái | Bệ hai tượng trắng + sàn rãnh sáng | Trắng xương + ánh vàng | a dark ancient temple chamber, a stone floor cut with glowing gridded channels, two pale bulbous idols on a dais, a fallen stone slab to one side |
| `cave-mouth.webp` | Cave Mouth (RT `:033`) | Đường hầm đá mở ra vùng nước sáng bên ngoài, đuốc cháy trên vách trái, sàn nước | Miệng hang hình vòm dài | Cam đuốc / lam lạnh | a long rock tunnel mouth opening onto bright cold water outside, a burning torch on the wall, a wet stone and water floor |
| `shrine-to-hydra.webp` | Shrine to Hydra (RT `:032`) | Hang xanh ô liu đục, tượng nữ phình to (Hydra) trên bệ đá, nến/đồ cúng | Tượng phình trên bệ | Xanh ô liu đục | a murky olive-green cave shrine, a squat bloated idol of a sea goddess on a stone pedestal, candles and pearl offerings at its feet |

Các bản `a`/`b` cùng tên có cùng tranh → một file. Tunnel bản Return to có tranh y hệt bản gốc → dùng chung file.

## 4. Sprite chung (mặt sau chưa lật, ô "+")

Theo skill §3.2 B: đơn giản, cùng tông với nền biển, **có mặt phẳng đủ rộng cho nhân vật đứng**, không chi tiết gây nhầm là một địa điểm cụ thể. Khung vuông. Ba loại mặt sau mang thông tin luật (đảo / Tidal Tunnel / Unfathomable Depths) nên làm ba ảnh, phân biệt chủ yếu bằng màu.

```text
Simple game map tile seen from a high 3/4 angle, isolated on a fully TRANSPARENT background, square canvas, painterly Arkham Horror LCG style. A low, plain, featureless piece with a wide flat top for small standing figures, edge breaking into sea foam that fades to transparent. Deliberately unremarkable, no landmarks, no text.
```

| File | Dùng cho | Mô tả riêng | Màu |
|---|---|---|---|
| `reef-back.webp` | Đảo chưa lật ("Devil Reef"): `07169`–`07173`, RT `:033`; ô "+" | a low dark reef mound of wet rock barely above the waves | Đỏ rỉ / cam máu mờ (theo mặt sau "Devil Reef") |
| `tunnel-back.webp` | "Tidal Tunnel" chưa lật: `07102` `07103` `07104` `07174a/b` RT `:065/:066/:067` | a shallow round rock basin with a dark swirling water hole in it | Lam (theo mặt sau "Tidal Tunnel") |
| `depths-back.webp` | "Unfathomable Depths" chưa lật: `07175a/b` `07176a/b` `07177a/b` | a flat sunken stone ledge under deep black-blue water, faint glow far below | Xanh đen thẳm |

## 5. Thuyền

Reference: `https://assets.arkhamhorror.app/img/arkham/cards/07178.avif` (Fishing Vessel). Bản Return to `:034` chưa có tranh riêng → dùng chung.

| File | Mô tả |
|---|---|
| `fishing-vessel.webp` | Theo tranh lá: thuyền đánh cá gỗ cũ, cột buồm cao với dây chằng, ống khói nhỏ gỉ sét, thân gỗ sẫm. Prompt: `a weathered 1920s wooden fishing trawler with a tall mast and rigging, a small rusty smokestack and a little wheelhouse at the rear, dark wooden hull, nets and a lantern, seen from a high 3/4 angle, bow pointing RIGHT, a wide flat empty open deck at the middle-front for 2-4 tiny standing figures, only a thin ring of wake and foam around the hull fading to transparent, warm amber lantern accent, no people.` Khung 3:2, thuyền ~85% bề rộng. |

Code lật ngang (`scaleX(-1)`) khi thuyền chạy sang trái, nên mũi hướng phải và ánh sáng không quá lệch một bên.

## 6. Lớp nước (flood)

| File | Mô tả |
|---|---|
| `water-partial.webp` | Lớp trong suốt khung 3:2: một lớp nước biển tối mỏng, gợn bọt, phủ **nửa dưới** vùng giữa khung, mép mềm, trông như ~55% độ đục. |
| `water-full.webp` | Cùng phong cách, phủ **gần hết** vùng giữa khung, sẫm hơn, có sóng nhỏ và vệt bọt, ~70% độ đục. |

Hai lớp này chồng lên sprite, nên vùng giữa đủ trong để vẫn thấy địa điểm bên dưới.

## 7. Nền

`devil-reef-sea.webp` — prompt:

```text
A vast stormy night ocean seen from a high, distant vantage point, classic Lovecraftian cosmic horror digital oil painting, 16:9 widescreen, matching Arkham Horror LCG card art. One seamless expanse of dark heaving sea with NO islands, NO rocks, NO land, NO boats, NO lighthouse and NO focal landmark. Deep slate-blue, near-black teal and cold grey-green water, long swell lines, scattered whitecaps and foam streaks, faint rain haze, distant lightning only as soft diffuse light reflected on the water. Low, even lighting. CENTER stays calm, dark and low in detail; slightly more texture toward the edges. Uniform composition with no horizon line and no vanishing point, so it can be panned, zoomed and cropped in any direction.
```

Negative: `island, rock, reef, cliff, land, boat, ship, lighthouse, figure, creature, tentacles, face, eye, sun, moon, horizon line, sky band, lens flare, god rays, center spotlight, text, logo, watermark, frame, grid, tiles`.

Kiểm tra: vùng giữa ~60% tối và êm, không có gì trông giống một location.

## 8. Tự kiểm tra trước khi giao

1. **Contact sheet** `art-src/devil-reef/contact-sheet.png`: mọi sprite thu về **rộng ~150px** trên nền `devil-reef-sea` thu nhỏ. Phải gọi đúng tên từng lá mà không cần nhãn.
2. **Đặt cạnh tranh lá thật** (`art-src/devil-reef/compare-<mã>.png` hoặc một sheet chung): cùng vật thể chính, cùng màu chủ đạo.
3. **Thử bóng đen:** 15 sprite location có bóng dáng khác nhau rõ; không lá nào là "đảo tròn dẹt".
4. Không hai lá trùng màu nhấn; ba mặt sau phân biệt được bằng màu.
5. Kiểm tra alpha: không viền, không watermark; kích thước đúng bảng §1.

## 9. Bàn giao

- 15 sprite location + 3 mặt sau + thuyền + 2 lớp nước (21 file webp) trong `frontend/public/img/scenes/the-innsmouth-conspiracy/devil-reef/`, cộng `devil-reef-sea.webp`.
- Contact sheet, sheet so sánh với tranh lá, PNG gốc trong `art-src/devil-reef/`.
- Ghi chú ảnh nào phải tạo lại nhiều lần hoặc còn chưa ưng.
