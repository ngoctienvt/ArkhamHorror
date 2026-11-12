# Devil Reef: scene map lưới động + thuyền là object

Status: draft, chờ duyệt · Branch: main · Skill: `.agents/skills/arkham-dynamic-grid-scene/SKILL.md`

## Mục tiêu

1. Bỏ tranh tĩnh `devil-reef.webp` + điểm neo. Thay bằng nền biển trống và **mỗi địa điểm một sprite riêng vẽ theo tranh lá thật** (skill §3.2), đặt theo lưới server gửi về. Lý do: Tidal Tunnel / Unfathomable Depths chỉ xuất hiện khi lật đảo, và vị trí phụ thuộc lá nào rơi vào ghế nào.
2. **Fishing Vessel là object trên bản đồ**: thấy ai đang ở trên thuyền, bấm thuyền để Lên/Rời, lái thuyền sang ô Ocean kề, thuyền trượt sang ô mới.
3. Mực nước theo flood level ở từng ô.
4. Áp dụng cho cả bản gốc `07163` lẫn Return to `:return-to-the-innsmouth-conspiracy:031`.

## Ràng buộc

- **Chỉ frontend.** Không sửa backend. Engine chạy trên arkhamhorror.app; frontend chỉ đọc state và gửi lựa chọn server đã đưa ra, không tự thêm luật.
- Card mode (bảng bài) là chuẩn về thứ tự trái/phải/trên/dưới.
- `hemlock-overview.ts`, `LocationMapCanvas.vue` đang có thay đổi chưa commit (Before the Black Throne cosmos). Plan này xây tiếp trên đó, không ghi đè.
- Không bấm lựa chọn hộ trong ván thật của người dùng.

## Luật lưới (đọc từ backend, upstream)

| Thứ | Ô |
|---|---|
| Churning Waters `07168` | (0,0), lật sẵn, Fully Flooded, thuyền + mọi điều tra viên trong thuyền |
| 5 đảo (xáo, mặt sau "Devil Reef") | (0,3), (4,2), (−4,2), (4,−2), (−4,−2); Return to thêm Cave Mouth ở (0,−3) |
| Tidal Tunnel / Unfathomable Depths | Đặt khi dùng ability của đảo (`islandCells`): tối đa 2 ô ra ngoài từ ghế đảo |
| Shrine to Hydra (RT `:032`) | (0,6) |
| Lưới tối đa | x ∈ [−6, 6], y ∈ [−5, 6], rất thưa → bắt buộc dùng `compactGridLayout` |

## Phases

| # | Phase | Ai làm | File |
|---|---|---|---|
| 1 | Bộ ảnh theo tranh lá (nền, 15 sprite location, 3 mặt sau, thuyền, 2 lớp nước) | Codex | [phase-01-art-assets.md](phase-01-art-assets.md) |
| 2 | Lưới động + đảo theo mã lá | Claude | [phase-02-code-integration.md](phase-02-code-integration.md) §A |
| 3 | Thuyền là object (ai trên thuyền, Lên/Rời, lái) | Claude | §B |
| 4 | Mực nước theo flood | Claude | §C |
| 5 | Test, đối chiếu card mode, Việt hóa | Claude | §D |

Phase 2–5 làm được với ảnh tạm (đá trơn + thuyền placeholder) trong lúc chờ Phase 1; ảnh thật chỉ thay file, không đổi code.

## Tiêu chí hoàn thành

- Map Devil Reef không còn tranh có đảo vẽ sẵn; mỗi location hiện đúng một sprite (nhận ra được ở rộng ~150px), cùng vị trí tương đối như card mode, kể cả sau khi lật đảo sinh thêm Tunnel/Depths.
- Thuyền vẽ ở đúng ô của Fishing Vessel; điều tra viên trong thuyền đứng trên boong, người ngoài đứng trên đảo.
- Bấm thuyền mở các lựa chọn server đang cho (Lên/Rời có nhãn rõ, Di chuyển thuyền); khi server hỏi chọn ô đích, ô Ocean hợp lệ sáng lên; thuyền trượt sang ô mới.
- Ô Partially/Fully Flooded có lớp nước tương ứng.
- Return to (6 đảo, Cave Mouth, Shrine to Hydra, Tunnel RT, thuyền V2) hiện đúng ảnh.
- Test + typecheck pass; không còn điểm neo `07168`–`07177` trong `hemlock-overview.ts`.

## Rủi ro

- Server công khai có thể khác code upstream trong repo (vị trí `islandCells`). Frontend luôn lấy `locationLayout` từ state nên không lệ thuộc; chỉ bảng ở trên là để hiểu.
- Ô đệm rộng → ô nhỏ. Mọi thứ vẽ thêm (đảo, thuyền, nước, ô "+") phải tính theo kích thước ô, không px cố định (lỗi đã gặp ở Before the Black Throne).

## Câu hỏi còn mở

- Khi lưới chỉ có 6 ô lúc đầu, ô sẽ rất to; có cần trần kích thước đảo (vd. tối đa 260px) để map không trông trống không?
