# Tạo lại sprite location cho Before the Black Throne

**Trạng thái:** đã tạo và kiểm tra 13 PNG → chờ duyệt / tích hợp code
**Màn:** Before the Black Throne (`05325`) và Return to (`54056`)
**Skill liên quan:** [arkham-dynamic-grid-scene](../../.agents/skills/arkham-dynamic-grid-scene/SKILL.md)

**Điều chỉnh khi đối chiếu:** Tranh gốc của lá là chuẩn cho hình dáng, vật thể và màu chính. Bảng mô tả bên dưới là phác thảo ban đầu; khi khác tranh, dùng tranh gốc. Ví dụ: `54058` là cụm trụ xanh có sừng với dải đỏ; `05337` là dãy phiến đá nguyên dẫn vào vùng sáng hồng tím; `05340` giữ các vòm đá nối tiếp. `cosmos` vẫn là mảnh đá đơn giản cho lá úp. Bộ PNG đã lưu tạm đúng thư mục bên dưới; WebP và code đang chạy chưa đổi.

## Vì sao làm lại

Bộ đảo hiện tại dùng chung một khung "đảo đá lơ lửng, mặt phẳng ở giữa", đặc trưng của lá chỉ nằm ở rìa. Trên map mỗi ô chỉ rộng khoảng 200px và cao khoảng 90px, nên phần rìa biến mất và 13 lá trông như 13 hòn đảo giống nhau.

## Hướng mỹ thuật mới: địa điểm là chính, đá chỉ là đế

1. **Địa điểm chiếm 75–85% khung hình.** Cung điện, ngai vàng, cổng, sương... là chủ thể. Đế đá (nếu có) chỉ là một mảng mỏng phía dưới, hoặc bỏ hẳn nếu địa điểm tự lơ lửng được (sương, vực, khe nứt).
2. **Mỗi lá một bóng dáng (silhouette) riêng**, nhận ra được khi chỉ nhìn bóng đen. Không có hai lá cùng dáng "khối tròn dẹt".
3. **Mỗi lá một màu nhấn riêng** (bảng dưới), trên nền tông chung tím than / chàm cho đồng bộ.
4. **Khung ngang 3:2** vì ô trên map rộng hơn cao. Chủ thể trải theo chiều ngang, không vươn quá cao.
5. **Có chỗ đứng cho standee:** một khoảng phẳng nhỏ ở nửa dưới, chính giữa (khoảng 25% bề rộng). Không cần mặt phẳng lớn như bản cũ.
6. **Tham khảo artwork lá thật** (mở lá trong tab Card board, hoặc tra mã lá trên ArkhamDB) để giữ đúng tinh thần, nhưng vẽ mới, không sao chép bố cục.

## Prompt chung (dán trước mô tả riêng của từng lá)

```text
Game map sprite of a single otherworldly location from Lovecraftian cosmic horror, seen from a high 3/4 angle, isolated on a fully TRANSPARENT background (PNG with alpha), no text, no frame, no drop shadow on the background. Painterly style matching Arkham Horror LCG card art, base palette of deep indigo and violet with ONE strong signature accent color given below. The LOCATION ITSELF is the subject and fills about 80% of a 3:2 landscape canvas (1536x1024); it is NOT a generic floating rock island. Any rock base is a thin, minor element at the bottom only. Strong, unique silhouette that stays recognizable when shrunk to 150 pixels wide. Leave a small flat clear spot at lower-center for a tiny standing figure. High contrast between the subject and its accent glow, crisp edges for clean alpha.
```

Negative (nếu công cụ hỗ trợ): `generic floating island, flat round platform, big empty plateau, symmetrical rock disc, multiple locations, text, logo, watermark, frame, background scenery, sky, stars filling the canvas`.

## Mô tả riêng từng lá

| Mã | Lá | Bóng dáng chủ đạo | Màu nhấn | Mô tả cho Codex |
|---|---|---|---|---|
| 05332 | Cosmic Ingress | Vòng xé rách nằm ngang | Hổ phách / vàng cháy | a huge torn, burning rift in space shaped like a jagged horizontal mouth, amber light pouring out, shards of reality peeling inward, a thin ledge in front of it where travelers arrive |
| 05333 | Hideous Palace | Cụm tháp xiêu vẹo, nhiều đỉnh nhọn lệch | Xanh lục bệnh | an asymmetrical palace of black stone and bone with impossible leaning spires and twisted domes, sickly green windows, walls that look half-organic and breathing |
| 05334 | Court of the Great Old Ones | Vòng ngai đá khổng lồ quanh sân | Lam ngọc | a wide circular court ringed by colossal broken monolith thrones of different alien shapes facing the center, teal witch-light glowing between them, cracked dark plaza |
| 05335 | The Black Throne | Một ngai vàng đen khổng lồ trên vách | Đỏ máu trên nền đen | a gigantic jagged black throne on a precipice, its back rising like a cathedral of obsidian spikes, a vast shapeless blurred mass of Azathoth churning behind it, blood-red bruised glow, tiny flute-playing silhouettes around the base |
| 05339 | Cosmic Gate | Cổng vòm đứng | Tím điện | a tall standing arch made of floating stones locked in orbit, a swirling violet vortex inside the arch, crackling energy arcs between the stones |
| 05340 | Pathway into Void | Con đường hẹp kéo ngang, đứt đoạn | Trắng xương | a narrow winding path of pale bone-white flagstones stretching sideways across the frame, crumbling apart into nothing at both ends, a few stones drifting loose |
| 05336 | Dancer's Mist | Khối sương xoáy, không có đá | Hồng tím (magenta) | a dense spiraling column of magenta mist with faint elongated dancing silhouettes inside it, ribbons of fog curling outward, no rock at all |
| 05337 | Flight into Oblivion | Mảnh vỡ bay ngược lên trên | Lam lạnh (cyan) | a shattered slab breaking apart upward, dozens of rock shards and debris streaming up and away in cyan streaks, as if gravity has reversed |
| 05338 | Infinity of Darkness | Khối chìm, đáy tan thành bóng tối | Xanh đen thẳm | a fragment sinking into an endless black abyss, its underside dissolving into dripping tendrils of darkness, a faint deep-blue rim light on the top edge only |
| 54058 | Nightmare Breach | Mặt đất nứt toác có móng vuốt | Vàng chanh độc | a ragged breach torn open in the ground, sickly acid-yellow light leaking out, clawed shadowy hands reaching up through the cracks |
| 54059 | Interstellar Abyss | Hố sâu hình phễu đầy sao | Lam sao (xanh trời đêm) | a deep funnel-shaped pit seen from above, its inside full of distant stars and galaxies as if it opens onto all of space, rim of broken dark stone |
| 54060 | Winding Gulf | Khe vực xoắn ốc | Bạc / trắng lạnh | a deep chasm twisting in a spiral through a slab of dark rock, silver mist flowing down the spiral, the walls carved by endless winding |
| cosmos | Lá chưa lật | Mảnh đá nhỏ, mờ | Không màu nhấn | a small, plain, dim shard of dark rock with a faint cold edge glow, deliberately unremarkable, no features |

`cosmos` dùng cho lá chưa lật và làm nền mờ cho ô "+". **Làm lại cùng bộ mới**, cùng khung 3:2 và cùng phong cách, để lá chưa lật đứng chung một hàng với các lá khác mà không lạc tông.

## Quy cách file

- PNG nền trong suốt, **1536×1024 (3:2)** cho cả 13 ảnh, kể cả `cosmos`.
- Tên file là mã lá, ví dụ `05335.png`. Đặt tạm ở `frontend/public/img/scenes/the-circle-undone/` như lần trước; bước tích hợp sẽ chuyển sang webp vào thư mục `cosmos/`.
- Không watermark. Viền alpha sạch (không viền trắng/đen quanh chủ thể).

## Tự kiểm tra trước khi giao (cho người tạo ảnh)

1. **Thử thu nhỏ:** thu cả bộ về rộng 150px và đặt cạnh nhau. Phải gọi đúng tên từng lá mà không cần nhãn.
2. **Thử bóng đen:** tô đen toàn bộ chủ thể. 13 bóng phải khác nhau rõ.
3. **Không còn "đảo tròn dẹt"** làm chủ thể ở lá nào (trừ `cosmos`).
4. Màu nhấn đúng bảng, không hai lá trùng màu nhấn.

## Bước tích hợp (Claude làm sau khi có ảnh)

1. Kiểm tra alpha, kích thước, ghép contact sheet để duyệt cùng bạn.
2. Chuyển sang webp, rộng 768px (3:2), q85, ghi đè vào `frontend/public/img/scenes/the-circle-undone/cosmos/`. PNG gốc đưa ra ngoài `public/`.
3. `LocationMapCanvas.vue`: lớp `.island` đổi `aspect-ratio` từ `1` sang `3 / 2`; cỡ trong `cosmosCell` đổi thành `min(rộng ô, cao ô × 1.5)` để ảnh ngang dùng hết bề rộng ô mà vẫn không đè sang ô khác. Ô "+" giữ nguyên.
4. Test: `tests/hemlockOverview.test.mjs` (đủ 13 file webp), typecheck, rồi mở ván thật đo đảo so với ô (không vượt ô) và so vị trí với card mode.
5. Cập nhật mục 3.2 trong skill `arkham-dynamic-grid-scene` theo hướng "địa điểm là chính".

## Tiêu chí hoàn thành

- Nhìn map ở cỡ bình thường, phân biệt được từng lá đã lật mà không cần đọc plate.
- Không sprite nào tràn sang ô bên cạnh, bấm ô "+" vẫn đúng chỗ.
- Bộ ảnh đồng bộ một phong cách và một tông nền.
