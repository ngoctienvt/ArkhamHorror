# The Pallid Mask: Scene Map lưới động

Status (2026-11-13): ảnh đã xong (phase 1), code đã tích hợp (phase 2 §A–§D, §F; chưa commit; test + vue-tsc xanh). **Chưa xem trên trình duyệt**: pane chưa đăng nhập tài khoản người dùng. Skill: `.agents/skills/arkham-dynamic-grid-scene/SKILL.md`

## Mục tiêu

Bỏ tranh tĩnh `the-path-to-carcosa/the-pallid-mask` (hiện không có điểm neo, location rơi về vị trí lưới đè lên tranh). Thay bằng kiểu Devil Reef: nền hầm mộ trống + mỗi location một sprite vẽ theo tranh lá thật, đặt theo `locationLayout` server gửi. Áp dụng cho bản gốc `03240` và Return to `52048`.

## Vì sao là lưới động (đã đọc backend)

- `ThePallidMask.hs`: chỉ đặt ô xuất phát (The Gate to Hell, hoặc một Catacombs xáo ngẫu nhiên nếu "awoke inside the Catacombs") tại `Pos 0 0`. Bản gốc xáo 11 Catacombs còn lại; `Tomb of Shadows` + `Blocked Passage` + 3 lá ngẫu nhiên nằm đáy deck. Return to thêm 4 lá, bỏ 4 lá đầu deck.
- Mỗi Catacombs khi lật đặt lá tiếp theo theo hướng do lá quyết định (`placeAtDirection_`): Gate to Hell (trên + dưới), Stone Archways (phải), Crypt (trên + phải), Bone-Filled Cavern (dưới + phải), Candlelit Tunnels (trái + phải), Labyrinth of Bones (3 lá: trên/dưới/phải), Narrow Shaft (trên hoặc phải), Shivering Pools (dưới hoặc phải), Well of Souls (trên/dưới/phải). Return to: Secret Passage (phải), Mound of Bones (4 lá: trên/dưới/trái/phải), Research Site (trên/dưới/phải của lá bất kỳ), Sea of Skulls (trên/dưới/phải của lá xa nhất, nối với ô đánh dấu).
- Act 3 *The Way Out* (`TheWayOut.hs`): cuối mỗi round **bỏ** lá xa Gate to Hell nhất (kéo người và enemy sang lá nối), nên lưới **co lại** giữa ván. Act 2 *The Path Is Barred* (Return to: Man in the Pallid Mask không di chuyển được) chỉ là luật, không đổi lưới.
- Kết luận: cùng một lá rơi vào ô khác mỗi ván, lưới vừa nở vừa co → đúng tiêu chí "tranh tĩnh không khớp luật".

Không có lá nào "tách rời": mọi Catacombs có ô lưới. Không có phương tiện, không ngập nước.

## Danh sách sprite (15 + 1 mặt úp + 1 nền)

| Mã | Lá | Nhận dạng theo tranh lá (đã xem) |
|---|---|---|
| `03247` | The Gate to Hell | phiến đá nghiêng như cửa, 2 đuốc, khe sáng cam; xanh xám lạnh |
| `03248` | Stone Archways | hành lang gạch vòm, hàng cổng vòm đen, ánh trắng-vàng cuối đường |
| `03249` | Crypt of the Sepulchral Lamp | hốc tường sọ, chậu lửa lớn trước mặt; cam lửa |
| `03250` | Bone-Filled Cavern | sàn hang chất đầy xương và sọ, tia xanh lá xa xa |
| `03251` | Well of Souls | sàn tròn xương xếp xoắn ốc quanh giếng đen; xanh-vàng |
| `03252` | Candlelit Tunnels | đường hầm đá đỏ cam đầy nến nhỏ |
| `03253` | Labyrinth of Bones | cột trụ xương khổng lồ, sương xanh độc bên phải |
| `03254` | Narrow Shaft | vách đen, giếng tròn sáng xanh trắng như nhật thực |
| `03255` | Shivering Pools | hành lang ngập, sương xanh ngọc, tường vàng |
| `03256` | Blocked Passage | hành lang bị đống sọ chặn, nến vàng sau đống, xanh lam |
| `03257` | Tomb of Shadows | đại sảnh, hàng nến nhỏ trên sàn, tháp đá đen bên phải; vàng |
| `52049` | Secret Passage (Return to) | kệ gỗ xếp sọ, lối bên tối, sương nâu |
| `52050` | Mound of Bones (Return to) | đống xương dưới các hốc vòm, tím |
| `52051` | Research Site (Return to) | sọ lớn trên cuốn sách và tấm bản đồ; hổ phách |
| `52052` | Sea of Skulls (Return to) | đường hầm sọ chen chúc, mặt trời vàng cam cuối đường |
| `back` | Catacombs (mặt úp, mọi lá) | ô vuông đá/xương trơn, tông nâu xám pha đỏ cam nhạt |
| nền | `the-pallid-mask-catacombs.webp` | sàn hầm mộ trống, không cổng, không cầu thang, giữa tối và êm |

Tất cả Catacombs dùng chung một mặt úp (`03247b`, `03248b`, `03249b` cùng kích thước file; chưa so từng pixel). Return to dùng đúng mã `52049`–`52052`.

## Phases

| # | Phase | Ai làm | File |
|---|---|---|---|
| 1 | Toàn bộ ảnh (15 sprite + mặt úp + nền) | Codex (người dùng giao) | [phase-01-codex-art.md](phase-01-codex-art.md) |
| 2 | Tích hợp code, test, đối chiếu card mode, dọn tranh cũ | Claude | [phase-02-code-integration.md](phase-02-code-integration.md) |

Phase 2 có thể dùng trực tiếp các file WebP đã xuất trong Phase 1.

## Tiêu chí hoàn thành

- `03240` và `52048` không còn tranh có location vẽ sẵn; tranh cũ chuyển vào `img/scenes/archives/`.
- Mỗi Catacombs hiện đúng một sprite theo tranh lá tại ô của nó, cùng thứ tự trái/phải/trên/dưới như card mode, kể cả khi lưới nở và khi Act 3 gỡ lá.
- Lá úp hiện mặt sau Catacombs; ô xuất phát (đã lật) hiện mặt lật.
- Test + `vue-tsc` pass; contact sheet ảnh đã duyệt; đã xem trên trình duyệt (`localhost:8090`, tài khoản người dùng, ván `SCRATCH`).

## Rủi ro / chưa biết

- Act 3 bỏ lá làm lưới co và có thể tách thành hai mảng; cần xem `locationLayout` thật có ô trống giữa không (card mode dùng `max-content` nên tự co).
- Mound of Bones đặt 4 lá một lần → lưới nở nhanh, ô nhỏ. Mọi thứ vẽ thêm tính theo kích thước ô.
- Chưa có ván tới Act 3 / Return to để xem thật; cần ván `SCRATCH` hoặc debug raw message, và không bấm hộ trong ván thật.
- Sea of Skulls "nối với ô đánh dấu" có thể sinh đường nối giữa hai ô không kề nhau; kiểm bằng `connectedLocations` thật.
