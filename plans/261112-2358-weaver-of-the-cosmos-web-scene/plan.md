# Weaver of the Cosmos (06333): mạng nhện + Atlach-Nacha xoay

Status (2026-11-13): Đã xuất 11 asset và tích hợp ba Act. Kết quả kiểm tra trong [handoff](../261112-2358-dream-eaters-scene-art/codex-handoff.md).
Skill: [arkham-dynamic-grid-scene](../../.agents/skills/arkham-dynamic-grid-scene/SKILL.md) (nền không điểm nhấn + sprite theo tranh lá).

## Vì sao tranh tĩnh không dùng được

- Mỗi ô là một lá *The Great Web* rút ngẫu nhiên từ 15 lá thuộc 6 loại (có trùng). Ô nào là loại nào chỉ biết khi chơi.
- Qua Act 1 bàn bị **dựng lại**: từ cột dọc 4 ô thành vòng 8 ô quanh Atlach-Nacha.
- Atlach-Nacha và 4 chân **xoay quanh vòng**. Một tranh tĩnh không thể hiện được chân nào đang ở ô nào.

## Luật (đọc từ backend)

**Act 1 (*Journey Across the Bridge*).** Xáo 15 lá, đặt 4 lá thành cột dọc `theGreatWeb1` (trên) → `theGreatWeb4` (dưới), bắt đầu ở ô trên cùng; doom đặt ở ô dưới theo số Steps of the Bridge. 11 lá còn lại để riêng.

**Act 2 (*The Weaver of the Cosmos*).** Gỡ mọi ô trừ `theGreatWeb4`, đặt thêm 7 lá thành `theGreatWeb5–11`, rồi `SetLayout` lưới 28×12 (mỗi ô chiếm 2 cột × 4–6 hàng):

| Nhãn | Vị trí | Thứ |
|---|---|---|
| `theGreatWeb4` | trên | ô cũ ở đáy Act 1 |
| `theGreatWeb5`…`11` | theo chiều kim đồng hồ: trên-phải, phải, dưới-phải, dưới, dưới-trái, trái, trên-trái | 7 lá mới |
| `atlachNacha` | giữa | chính enemy (dùng `asSelfLocation`, chiếm ô như location); lúc đầu `Global` |
| `legs1`…`legs4` | 4 góc quanh tâm | Legs 347 ở web11, 348 ở web5, 349 ở web9, 350 ở web7 |

**Mỗi chân là 2 thứ cùng lúc** (`asSelfLocation`): một lá nằm ở ô `legs1–4` cạnh tâm (ô này không bao giờ đổi), đồng thời là enemy đứng (`AtLocation`) ở một ô web và tấn công/bị đánh ở đó. Thân Atlach-Nacha lúc đầu cũng vậy: ô `atlachNacha` ở tâm, placement `Global` (Omnipotent).

**Xoay (Act 2, *The Weaver of the Cosmos*, đã xác minh).** Ability 2 của Act rút 1 chaos token; nếu token có giá trị âm `−n` thì gửi `HandleAbilityOption n` cho Atlach-Nacha. Khi thân chưa lật: mỗi chân dời `n` ô theo chiều kim đồng hồ trên vòng 4→5→…→11→4, và `Meta.rotation += 45·n` (mod 360). 8 ô cách nhau đúng 45°, nên 4 chân luôn ở 4 ô chéo xen kẽ, quay như kim đồng hồ.

**Act 3 (*The Scheme's Demise*, đã xác minh): không dựng lại bàn.** Khi Act 2 lật, Atlach-Nacha bị `Flip`: bỏ ô tâm (`asSelfLocation = Nothing`), người dẫn đầu chọn một ô web nhiều doom nhất để đặt nó. Từ đó, đầu mỗi Mythos phase (ability 2 của Act 3) rút token; giá trị âm `−n` thì **chỉ thân** đi `n` ô theo vòng (chân và góc xoay không đổi nữa). Ô tâm để trống. Thắng khi đánh bại Atlach-Nacha. Vòng 8 ô giữ nguyên tới hết màn.

**Card mode đang vẽ thế nào (đã xác minh, `Scenario.vue`).** Lá Atlach-Nacha có `data-rotation="enemy.meta?.rotation"`; code xoay cả lá thân lẫn 4 lá chân quanh tâm ảnh thân bằng CSS `rotate()`, `transition 0.5s`. Backend có gửi `meta.rotation` trong JSON enemy (frontend đọc `meta` dạng thô). Map chỉ cần làm đúng như vậy.

## Hướng làm

Theo skill dynamic-grid: **nền không có location** + **sprite cho từng loại web** đặt theo lưới server, cộng **một object Atlach-Nacha xoay được** ở tâm.

### Mỹ thuật

| Asset | File (`img/scenes/the-dream-eaters/weaver/`) | Ghi chú |
|---|---|---|
| Nền Act 1 | `bg-bridge.webp` 1920×1080 | Khoảng không vũ trụ tím than, một sợi tơ khổng lồ chạy dọc giữa tranh, không nút, không nhện |
| Nền Act 2 | `bg-ring.webp` 1920×1080 | Cùng khoảng không, một mạng nhện tròn mờ khổng lồ, 8 nan tỏa từ tâm; **không** vẽ nút location trên mạng |
| 6 sprite web | `06340.webp` … `06345.webp` 768×512, nền trong suốt | Web Stairs, Cosmic Web, Tangled Web, Prison of Cocoons, Vast Web, Web-Woven Island. **Vẽ theo tranh lá thật** (skill §3.2 A), mỗi loại một bóng dáng + màu nhấn riêng |
| Sprite web úp | `back.webp` 512×512 | Mặt sau *The Great Web* chưa lật, hình chung đơn giản |
| Thân Atlach-Nacha | `atlach-nacha.webp` 1024×1024 trong suốt | Nhìn thẳng từ trên xuống, đầu và bụng phân biệt rõ. Chân là enemy riêng. Đặt tâm xoay giữa phần đầu-ngực để gốc các chân nối vào thân. |
| 4 chân | `legs.webp` (dùng chung) 512×1024 | Một chân dài nhìn từ trên, gốc ở đáy ảnh, xoay để chỉ về ô web |

Tạo qua Codex (`route_media.py image --route local:codex-cli`, lệnh mẫu ở [phase 1 plan cha](../261112-2358-dream-eaters-scene-art/phase-01-static-art.md)). **Mỗi sprite web phải kèm tranh lá của chính nó làm reference** (`assets.arkhamhorror.app/img/arkham/cards/06340.avif`…`06345.avif`); thân và chân Atlach-Nacha lấy reference từ lá enemy `06346`–`06350` (kiểm tra mã khi tải); mặt sau từ lá *The Great Web* chưa lật. Nền lấy 1–2 lá web làm reference phong cách.

Prompt nền giữ nguyên prompt void của skill, thêm: `a single colossal glowing spider-silk strand` (Act 1) hoặc `a faint colossal radial spider web spanning the void, eight spokes from the center, no nodes, no spider` (Act 2).

### Code (chỉ frontend)

1. `hemlock-overview.ts`: thêm 06333 vào bảng thư mục sprite (`ISLAND_FOLDERS`); nền chọn theo layout: có `atlachNacha` → `bg-ring`, còn lại → `bg-bridge`. `cosmosIslandImage()` / `scene-island-sprites.ts`: mã web đã lật → `<mã>.webp`, chưa lật → `back.webp`.
2. **Hình học vòng tròn thay cho lưới.** Lưới 28×12 có ô span nhiều hàng, còn `compactGridLayout` dựa trên ô đơn. Với Act 2 tính tâm ô từ bounding box của mỗi nhãn trong `locationLayout` (min/max hàng, cột) rồi quy ra %, thay vì đếm ô. Kiểm tra lại cả card mode hiển thị span ra sao để giữ đúng quan hệ.
3. **Object Atlach-Nacha** (component mới `SceneAtlachNacha.vue`, cùng kiểu `SceneVehicle.vue`):
   - Act 2: thân + 4 chân là một nhóm ở tâm vòng, xoay bằng `rotate(<enemy.meta.rotation>deg)` với `transition` ~500 ms (như card mode). Góc 0° thì chân chỉ về web11 (trên-trái), web5 (trên-phải), web9 (dưới-trái), web7 (dưới-phải).
   - Kiểm tra chéo: mỗi chân phải chỉ đúng ô web mà enemy Legs đó đang `AtLocation`. Nếu lệch (server khác repo), ưu tiên vẽ theo ô thật của enemy.
   - Chân bị đánh bại (enemy biến mất khỏi `game.enemies` hoặc `OutOfPlay`): ẩn chân đó, các chân khác giữ nguyên.
   - Act 3: thân rời tâm (không còn `asSelfLocation`, placement `AtLocation`). Vẽ thân nhỏ lại đứng trên ô web đó, khi đổi ô thì **trượt theo cung tròn** qua các ô giữa, không cắt ngang tâm. Tâm để trống (có thể giữ 4 chân đứng yên ở góc cuối cùng).
   - Bấm vào thân/chân mở đúng lựa chọn server đang cho (đánh, né), như enemy thường. Hiện `sceneTargetFallback.ts` coi chân là "không bấm được trên map" và đẩy lựa chọn ra danh sách riêng; khi object chân bấm được thì bỏ chân khỏi danh sách đó.
4. Test: chọn nền theo layout; vị trí 8 ô theo bounding box; góc của chân khớp ô; sprite đủ 6 + back.

### Kiểm tra trên ván

- Act 1: 4 sprite dọc đúng thứ tự card mode.
- Sau Act 1 → 2: nền đổi, 8 ô thành vòng đúng chiều kim đồng hồ, chân ở web5/7/9/11.
- Sau một lần xoay: thân xoay 45°×n, mỗi chân chỉ đúng ô mới, mọi thứ khác giữ nguyên.
- Không bấm lựa chọn hộ người dùng; muốn thử xoay thì dùng ván thử riêng hoặc debug scenario jump.

## Tiêu chí hoàn thành

- Không còn tranh tĩnh có web vẽ sẵn cho 06333; mọi ô là sprite theo loại lá.
- Atlach-Nacha và chân luôn khớp vị trí state; góc xoay hiển thị đúng `Meta.rotation`.
- Test + typecheck pass.

## Rủi ro

- Server công khai có thể khác repo. Card mode đang dùng `meta.rotation` nên trường này có trong JSON; dự phòng vẫn là suy góc từ ô của Legs 347 so với web11.
- Ô span 2×4–6 trong card mode làm thứ tự khác lưới thường; phải đối chiếu card mode trước khi viết hình học.

## Quyết định

- Kích thước nhóm thân + chân ở Act 2: đường kính ~45% cạnh ngắn của stage, đầu chân dừng trước mép ô web để không che sprite web. Thân ở Act 3 thu bằng ~60% một ô web.

Không còn câu hỏi mở.
