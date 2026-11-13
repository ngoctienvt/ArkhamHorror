# The Innsmouth Conspiracy: 4 màn lưới động còn lại

Status (2026-11-13): phase 1 đã xuất đủ 53 ảnh, phase 2 đã tích hợp (chưa commit; test + typecheck xanh; đã xem trên trình duyệt: Pit, Maelstrom, Fog, High Gear) · Branch: main · Skill: `.agents/skills/arkham-dynamic-grid-scene/SKILL.md`

## Mục tiêu

Đưa 4 màn còn dùng tranh tĩnh + điểm neo sang kiểu Devil Reef / Before the Black Throne: nền trống, mỗi location một sprite vẽ theo tranh lá thật, đặt theo `locationLayout` server gửi về. Áp dụng cho cả bản gốc lẫn Return to.

| Màn | Mã gốc | Return to | Vì sao tranh tĩnh sai |
|---|---|---|---|
| The Pit of Despair | `07041` | `:return-to-the-innsmouth-conspiracy:018` | 8 Tidal Tunnel xáo; Act 1 và *The Escape* lấp thêm ô trái/phải/dưới các lá đã lật, lưới mở rộng xuống dưới |
| Into the Maelstrom | `07311` | `:048` | 8 Tidal Tunnel xáo quanh Gateway (3×3); *Back into the Depths* đặt sanctum, Y'ha-nthlei, 2 Lair theo 4 bố cục tùy số người chơi |
| A Light in the Fog | `07231` | `:039` | Act 1 lưới cố định, nhưng *Finding the Path* / *Unchanging as the Sea* thêm 2 Sunken Grotto và 9 Tidal Tunnel xáo vào 3 hàng dưới |
| Horror in High Gear | `07198` | `:035` | Đường xếp theo cột `roadNa/b/c`; mỗi lần tiến lên rút Road deck + *Long Way Around* đặt cột mới bên phải, cột sau bị gỡ |

Không làm: Elina Harper, Lair of Dagon (layout cố định), In Too Deep (đã làm rào cản), Devil Reef (xong).

## Ràng buộc

- **Chỉ frontend.** Không sửa backend; frontend chỉ đọc state, không tự thêm luật.
- Card mode là chuẩn về vị trí trái/phải/trên/dưới.
- Tranh lá thật là chuẩn cho mọi sprite (skill §3.2 A). Codex xem tranh rồi mới viết mô tả.
- **Ảnh tạo một đợt duy nhất** ([phase 1](phase-01-codex-art.md)). Code ([phase 2](phase-02-code-integration.md)) làm được trước với ảnh tạm; ảnh thật chỉ thay file.
- Worktree đang có thay đổi chưa commit của Dream-Eaters (`hemlock-overview.ts`, `LocationMapCanvas.vue`, `scene-island-sprites.ts`...). Xây tiếp trên đó, không ghi đè.
- Không bấm lựa chọn hộ trong ván thật của người dùng.

## Phases

| # | Phase | Ai làm | File |
|---|---|---|---|
| 1 | Toàn bộ ảnh 4 màn: 47 sprite + 4 nền + 2 standee xe địch vẽ lại | Codex (một đợt) | [phase-01-codex-art.md](phase-01-codex-art.md) |
| 2A | Hạ tầng chung: sprite dùng chung giữa các thư mục | Claude | [phase-02-code-integration.md](phase-02-code-integration.md) §A |
| 2B | The Pit of Despair | Claude | §B |
| 2C | Into the Maelstrom | Claude | §C |
| 2D | A Light in the Fog | Claude | §D |
| 2E | Horror in High Gear (đường trượt + 2 xe) | Claude | §E |
| 2F | Test, đối chiếu card mode, dọn tranh cũ | Claude | §F |

2B–2E độc lập nhau sau 2A (mỗi màn một bộ sprite, một mục trong `ISLAND_FOLDERS`).

## Tiêu chí hoàn thành

- 4 màn (gốc + Return to) không còn tranh có location vẽ sẵn và không còn điểm neo theo mã lá trong `hemlock-overview.ts` (`07047`–`07052`, `07203`–`07209`, `07239`…, `07319`–`07329`).
- Mỗi location hiện đúng một sprite theo tranh lá, cùng vị trí tương đối như card mode, kể cả sau khi lưới mở rộng / dựng lại theo Act.
- Lá úp hiện mặt sau đúng loại (Tidal Tunnel, Y'ha-nthlei, Y'ha-nthlei Sanctum, Old Innsmouth Road, Lighthouse Basement).
- Ô ngập có lớp nước (Pit, Maelstrom, Light in the Fog).
- High Gear: cột mới xuất hiện bên phải, cột sau biến mất có hiệu ứng trượt; 2 xe là object, thấy ai đang ngồi trong xe.
- Test + typecheck pass; contact sheet ảnh đã duyệt.

## Rủi ro

- Server công khai có thể khác code upstream. Frontend luôn lấy `locationLayout` từ state; bảng luật trong phase 2 chỉ để hiểu.
- High Gear dùng layout chuỗi có ô trải nhiều hàng (cột 2 lá: `a` chiếm hàng 1–3, `b` hàng 4–6), không phải `usesGrid`. `compactGridLayout` hiện chưa xử lý ô trải hàng → phải viết bộ đọc riêng (§E).
- Lưới Maelstrom Act 2 rộng tới 7×5 → ô nhỏ. Mọi thứ vẽ thêm tính theo kích thước ô.

## Quyết định (2026-11-13)

1. Location tách rời (không ô lưới, không kết nối), vd. Holding Cells `07252b`, vào hộp off-map cạnh reference card, áp dụng mọi màn; trên màn có bộ sprite thì hiện bằng sprite (kèm người đứng trên đó), không hiện dạng lá (phase 2 §A.6).
2. 4 tranh tĩnh cũ chuyển vào `img/scenes/archives/` (phase 2 §F).
3. Standee xe địch: vẽ lại `07213`, `07214` trong đợt ảnh; giữ `07215`.

## Câu hỏi còn mở

Không còn.
