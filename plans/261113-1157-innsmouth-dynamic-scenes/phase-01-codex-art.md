# Phase 1: Toàn bộ ảnh 4 màn Innsmouth (giao Codex, một đợt)

Làm theo skill `arkham-dynamic-grid-scene` §3 và giữ nguyên quy cách đã dùng cho Devil Reef ([phase-01 Devil Reef](../261112-2054-devil-reef-dynamic-scene/phase-01-art-assets.md)). Tổng: **47 sprite + 4 nền + 2 standee xe địch vẽ lại = 53 ảnh**.

## 0. Quy tắc bắt buộc

1. **Tranh lá thật là reference cho mọi sprite location.** Trước khi viết prompt cho một lá: tải tranh, mở ra xem, ghi một dòng "vật thể chính + màu chủ đạo" vào `art-src/the-innsmouth-conspiracy/notes.txt`, rồi mới viết mô tả. Tên lá thường gợi sai (bài học Black Throne), nên các gợi ý trong bảng dưới **chỉ là phỏng đoán theo tên**; khi khác tranh thì theo tranh.
2. **Địa điểm là chủ thể**, chiếm 75–85% khung. Không ép thành "đảo đá tròn, mặt phẳng ở giữa".
3. Trong **cùng một màn**, mỗi lá một bóng dáng và một màu nhấn riêng (lấy từ màu chủ đạo của tranh; nếu hai lá trùng thì chọn màu phụ của tranh).
4. Bỏ khung, chữ, icon, nhân vật sống. Tượng giữ lại nhưng vẽ là đá.
5. Các bản `a`/`b`/`c` cùng tên có cùng tranh → một file. Tidal Tunnel Return to (`:065`–`:067`) dùng chung tranh với `07102`–`07104` → **không vẽ lại**, đã có trong `devil-reef/`.

## 1. Quy cách file

| Loại | Canvas tạo | Xuất trong game |
|---|---|---|
| Sprite location | PNG 1536×1024 (3:2), nền trong suốt | WebP 768×512 q85, tên = mã lá (vd. `07320.webp`) |
| Mặt sau chưa lật | PNG 1024×1024, nền trong suốt | WebP 512×512 q85 |
| Xe (High Gear) | PNG 1536×1024, nền trong suốt | WebP 768×512 q85, đầu xe hướng PHẢI |
| Nền | 16:9 1536×864, upscale ≥ ×2 | WebP 3840×2160 (tối thiểu 2560×1440) q88 |

- Thư mục trong game: `frontend/public/img/scenes/the-innsmouth-conspiracy/<thư mục màn>/` (bảng §3–§6). Nền đặt ngay trong `the-innsmouth-conspiracy/`.
- PNG gốc, prompt, reference, contact sheet: `art-src/the-innsmouth-conspiracy/{refs,prompts,gen,review}/`. **Không đưa PNG vào `frontend/public/`.**
- Alpha sạch, không watermark (inpaint theo skill §3.1), không chữ, không khung.

### Lệnh tạo ảnh

```bash
python ~/.codex/skills/generate2dmedia/scripts/route_media.py image --route codex-cli --prompt-file art-src/the-innsmouth-conspiracy/prompts/<slug>.txt --reference art-src/the-innsmouth-conspiracy/refs/<mã>.png --size 1536x1024 --out-dir art-src/the-innsmouth-conspiracy/gen/<slug>-v1
```

- Prompt phải ghi `3:2, 1536x1024, transparent background` (sprite) hoặc `16:9 widescreen, 1536x864` (nền); route lấy kích thước từ prompt.
- Mỗi lần chạy ra thư mục mới (`-v1`, `-v2`…), không ghi đè. Lỗi đăng nhập/quota thì dừng và báo, không chuyển sang vẽ bằng code.

### Reference

URL tranh lấy từ `frontend/public/cards.json` (trường `imagesrc`, mặt sau `backimagesrc`). Nếu trống: `https://assets.arkhamhorror.app/img/arkham/cards/<mã>.avif` (mặt sau thêm `b`); lá Return to: `https://assets.arkhamhorror.app/img/arkham/homebrew/return-to-the-innsmouth-conspiracy/cards/<số>.avif`. Đổi sang PNG trước khi đưa vào route.

## 2. Prompt chung cho sprite location

Dán trước mô tả riêng; thay `<SETTING>` theo màn (§3–§6).

```text
Game map sprite of a single location from <SETTING>, Lovecraftian horror, seen from a high 3/4 angle, isolated on a fully TRANSPARENT background (PNG with alpha), 3:2, 1536x1024, no text, no frame, no drop shadow on the background. Painterly style matching Arkham Horror LCG card art. Use the attached card illustration as the reference for the subject, its shapes, composition and dominant colors; redraw it as a free-standing map piece, without the card frame, text, icons or any living figures. The LOCATION ITSELF is the subject and fills about 80% of the canvas; it is NOT a generic round rock island. Any base is a thin, minor element at the bottom that fades to transparent. Strong, unique silhouette that stays recognizable when shrunk to 150 pixels wide, with ONE signature accent color given below. Leave a small flat clear spot at lower-center for a tiny standing figure. Crisp edges for clean alpha.
```

Negative: `generic round island, flat round platform, big empty plateau, symmetrical rock disc, multiple locations, card frame, text, letters, icons, logo, watermark, border, people, living creatures, sky band, horizon, background scenery`.

Prompt mặt sau (khung vuông, cố ý đơn giản):

```text
Simple game map tile seen from a high 3/4 angle, isolated on a fully TRANSPARENT background, square canvas 1024x1024, painterly Arkham Horror LCG style. A low, plain, featureless piece with a wide flat top for small standing figures, edge fading to transparent. Deliberately unremarkable, no landmarks, no text. <MÔ TẢ RIÊNG>
```

Prompt nền: dùng mẫu skill §3.1 (khoảng trống không điểm nhấn, giữa tối và êm, không đường chân trời), thay bảng màu và chất liệu theo cột "Nền" của từng màn.

## 3. The Pit of Despair → `pit/` (6 sprite)

`<SETTING>` = `a flooded underwater cave system beneath Innsmouth, dripping wet rock, cold green-black water`.

| File | Lá (mã) | Gợi ý theo tên (kiểm lại theo tranh) |
|---|---|---|
| `07047.webp` | Unfamiliar Chamber | Hang đá ẩm nơi tỉnh dậy, nước ngập mắt cá |
| `07048.webp` | Bone-Ridden Pit | Hố đầy xương |
| `07049.webp` | Fish Graveyard | Bãi xác cá, xương cá trên đá |
| `07050.webp` | Altar to Dagon | Bệ thờ đá chạm hình cá |
| `07051.webp` | Idol Chamber | Phòng có tượng thần |
| `07052.webp` | Sealed Exit | Lối ra bị bịt đá |

Dùng lại từ `devil-reef/` (không tạo): `07102`, `07103`, `07104`, `tunnel-back`, `water-partial`, `water-full`.

Nền `pit-of-despair-caverns.webp`: bóng tối hang ngầm vô tận nhìn từ cao, đá ướt xanh đen mờ ở rìa, mặt nước đen loang, vài giọt sáng lân tinh; không vòm, không cửa hang, không lối đi ở giữa.

## 4. Into the Maelstrom → `maelstrom/` (11 sprite + 2 mặt sau)

`<SETTING>` = `the sunken cyclopean city of Y'ha-nthlei on the deep ocean floor, green-black water, bioluminescent glow`.

| File | Lá (mã) | Gợi ý theo tên (kiểm lại theo tranh) |
|---|---|---|
| `07319.webp` | Dark Abyss (Tidal Tunnel, ×2) | Khe vực tối dưới đáy biển |
| `07320.webp` | Gateway to Y'ha-nthlei | Cổng đá khổng lồ vào thành |
| `07321.webp` | Sunken Halls (×2) | Sảnh đá chìm |
| `07322.webp` | Vault of Riches (×2) | Hầm vàng bạc |
| `07323.webp` | Undersea Corridors (×3) | Hành lang đá dưới biển |
| `07324.webp` | Statues in the Deep (Sanctum) | Tượng đá dưới sâu |
| `07325.webp` | Submerged Temple (Sanctum) | Đền chìm |
| `07326.webp` | Syzygy Chamber (Sanctum) | Phòng thiên văn / hàng thẳng |
| `07327.webp` | Onyx Guardians (Sanctum) | Tượng canh mã não đen |
| `07328.webp` | Lair of Dagon | Hang ổ của Dagon (không vẽ Dagon, chỉ chỗ ở) |
| `07329.webp` | Lair of Hydra | Hang ổ của Hydra (không vẽ Hydra) |
| `yhanthlei-back.webp` | Mặt sau "Y'ha-nthlei" (`07321`–`07323`) | Mặt đá lát cổ dưới nước, màu theo mặt sau lá |
| `sanctum-back.webp` | Mặt sau "Y'ha-nthlei Sanctum" (`07324`–`07327`) | Như trên nhưng có viền đá chạm khắc, màu khác hẳn `yhanthlei-back` |

Dùng lại từ `devil-reef/`: `07102`–`07104`, `tunnel-back`, hai lớp nước.

Nền `into-the-maelstrom-abyss.webp`: đáy đại dương sâu thẳm nhìn từ cao, nước xanh đen, cát và bùn tối, các vệt sáng sinh học mờ, bụi trôi lơ lửng; không công trình, không tượng, không sinh vật.

## 5. A Light in the Fog → `fog/` (15 sprite)

`<SETTING>` = `Falcon Point lighthouse on a foggy cliff above the sea near Innsmouth, and the flooded grottoes beneath it`. Năm lá mặt đất dùng tông sương xám lạnh, các lá hang dùng tông hang ngầm, để người chơi thấy rõ trên bờ / dưới hang.

| File | Lá (mã) | Gợi ý theo tên (kiểm lại theo tranh) |
|---|---|---|
| `07239.webp` | Falcon Point Gatehouse | Nhà gác cổng đá |
| `07240.webp` | Lighthouse Stairwell | Thân hải đăng, cầu thang xoắn |
| `07241.webp` | Lantern Room | Buồng đèn trên đỉnh |
| `07242.webp` | Falcon Point Cliffside | Vách đá ven biển |
| `07243.webp` | Lighthouse Keeper's Cottage | Nhà người gác đèn |
| `07244b.webp` | Lighthouse Basement (mặt úp của `07244`) | Tầng hầm hải đăng |
| `07244.webp` | Sunken Grotto (Upper Depths) | Hang chìm tầng trên |
| `07245.webp` | Sunken Grotto (Lower Depths) | Hang chìm tầng dưới |
| `07246.webp` | Sunken Grotto (Final Depths) | Đáy hang |
| `07247.webp` | Shrine to Hydra | Điện thờ Hydra (khác lá RT `:032` của Devil Reef) |
| `07248.webp` | Deep One Nursery | Ổ trứng Deep One |
| `07249.webp` | The Moon Room | Phòng trăng |
| `07250.webp` | Sunken Archives | Kho sách chìm |
| `07251.webp` | Pump Room | Phòng bơm |
| `07252b.webp` | Holding Cells | Phòng giam trong hang. Sprite này hiện trong hộp off-map cạnh reference card (không nằm trên lưới), nên giữ khung 3:2 và chỗ đứng ở giữa dưới cho điều tra viên bị giam |

Dùng lại từ `devil-reef/`: `07102`, `07103` (Underground River bị loại khỏi màn này), `tunnel-back`, hai lớp nước.

Nền `a-light-in-the-fog-cliffs.webp`: sương mù dày trên biển đêm nhìn từ cao, tông xám bạc ở nửa trên chuyển dần sang tối xanh đen ở nửa dưới (để hàng hang ngầm ở dưới vẫn hợp); không hải đăng, không vách đá, không đường chân trời.

## 6. Horror in High Gear → `high-gear/` (10 sprite + 1 mặt sau + 2 xe)

`<SETTING>` = `the Old Innsmouth Road at night in heavy fog, 1920s New England backwoods`.

**Quy tắc riêng cho đoạn đường:** mỗi sprite là một đoạn đường đất chạy ngang, **vào ở giữa mép trái và ra ở giữa mép phải, cùng độ cao và cùng bề rộng mặt đường**, để các cột đặt cạnh nhau trông như một con đường liền. Đặc điểm của lá (vách đá, ngã ba, khúc cua…) nằm hai bên và trên mặt đường.

| File | Lá (mã) | Gợi ý theo tên (kiểm lại theo tranh) |
|---|---|---|
| `07203.webp` | Falcon Point Approach | Đoạn cuối dẫn tới mũi đất, thấy ánh hải đăng xa (vẫn ra ở mép phải) |
| `07204.webp` | Dimly Lit Road (a/b/c) | Đường tối, một ngọn đèn đường lẻ loi |
| `07205.webp` | Cliffside Road (a/b) | Đường men vách đá |
| `07206.webp` | Fork in the Road (a/b) | Ngã ba, có biển chỉ đường |
| `07207.webp` | Intersection (a/b) | Ngã tư |
| `07208.webp` | Tight Turn (a/b/c) | Khúc cua gắt |
| `07209.webp` | Desolate Road (a/b) | Đường hoang trống trải |
| `07210.webp` | Long Way Around (×6) | Đường vòng qua rừng |
| `mud-tracks.webp` | Mud Tracks (RT `:036`) | Vệt bùn lầy |
| `straight-section.webp` | Straight Section (RT `:037`) | Đoạn thẳng |
| `road-back.webp` | Mặt sau "Old Innsmouth Road" | Đoạn đường mờ trong sương, vẫn vào/ra ở giữa hai mép; khung **3:2** (ngoại lệ) để nối liền với đoạn khác |
| `07211.webp` | Thomas Dawson's Car | Xe hơi 1920s theo tranh lá, nhìn 3/4 từ cao, đầu xe hướng PHẢI, đèn pha sáng |
| `07212.webp` | Elina Harper's Car | Như trên, kiểu xe và màu khác hẳn xe Dawson |

Nền `horror-in-high-gear-moor.webp`: vùng đồng hoang và rừng thưa ven biển trong sương đêm nhìn từ cao, trải đều theo chiều ngang (sẽ trượt ngang); **không có đường**, không xe, không nhà.

### 6b. Standee xe địch (vẽ lại, ghi đè vào `actors/`)

`07213.webp` và `07214.webp` hiện vẽ thành một người đàn ông đứng, không có xe. Hai lá này là enemy *Vehicle* nên standee phải là chiếc xe (có thể kèm tài xế/người bắn nhoài ra). `07215` (Hybrid Assassin cưỡi mô tô) đã đúng, giữ nguyên.

| File | Lá (mã) | Yêu cầu (kiểm lại theo tranh) |
|---|---|---|
| `actors/07213.webp` | Pursuing Motorcar | Xe hơi 1920s đang lao tới theo tranh lá, đèn pha chói, kẻ trong xe nhoài ra |
| `actors/07214.webp` | Hit Van | Xe tải / van 1920s theo tranh lá, cửa thùng mở, bóng người cầm vũ khí |

Quy cách giống các standee hiện có trong `actors/`: PNG nền trong suốt, chủ thể chiếm gần trọn khung, không đế, không bóng nền; xuất WebP rộng 640px (giữ tỉ lệ), q85. Xe nhìn 3/4 từ cao, đầu xe hướng **TRÁI** (đuổi theo xe người chơi đang chạy sang phải). Mapping `sceneSprites.ts` đã có sẵn, chỉ thay file. Lưu bản cũ vào `art-src/the-innsmouth-conspiracy/review/old-07213.webp`, `old-07214.webp` trước khi ghi đè.

## 7. Tự kiểm tra trước khi giao

1. **Contact sheet mỗi màn** `art-src/the-innsmouth-conspiracy/review/<màn>-contact.png`: mọi sprite rộng ~150px trên nền của màn đó thu nhỏ. Gọi đúng tên từng lá không cần nhãn.
2. **Sheet so tranh lá** `review/<màn>-compare.png`: sprite cạnh tranh gốc, cùng vật thể chính và màu chủ đạo.
3. **Bóng đen:** trong mỗi màn, các sprite có bóng dáng khác nhau rõ.
4. **High Gear:** ghép 4 đoạn bất kỳ cạnh nhau (`review/high-gear-chain.png`), mặt đường phải liền ở các mép.
5. Alpha sạch, không watermark, đúng kích thước §1.

## 8. Bàn giao

- 47 WebP sprite trong 4 thư mục `pit/`, `maelstrom/`, `fog/`, `high-gear/` + 4 WebP nền trong `the-innsmouth-conspiracy/` + `actors/07213.webp`, `actors/07214.webp` vẽ lại.
- `notes.txt`, contact sheet, sheet so sánh, PNG gốc trong `art-src/the-innsmouth-conspiracy/`.
- Ghi chú ảnh nào phải tạo lại nhiều lần hoặc còn chưa ưng.

## Kết quả 2026-11-13

Đã xuất 47 sprite, 4 nền 3840×2160 và 2 standee xe địch 640 px. Bản standee cũ, PNG gốc, prompt, ghi chú và các sheet đối chiếu nằm trong [thư mục art-src](../../art-src/the-innsmouth-conspiracy/). Dùng Codex CLI đi kèm Desktop qua biến `FORGE_CODEX_EXE` để chạy đúng route.

Kiểm tra định dạng, kích thước và alpha toàn bộ WebP. Đã xem 4 contact sheet, 4 sheet đối chiếu, các bóng đen và [ảnh ghép đường](../../art-src/the-innsmouth-conspiracy/review/high-gear-chain.png). Kiểm tra mép của cả 121 cặp đoạn đường High Gear và chạy 7 test sprite hiện có. Tích hợp Scene Map thuộc phase 2.
