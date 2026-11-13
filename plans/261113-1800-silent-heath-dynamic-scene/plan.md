# The Silent Heath (The Feast of Hemlock Vale): Scene Map lưới động

Status (2026-11-13): CHỈ MỚI LÀ KẾ HOẠCH. Chưa sinh ảnh, chưa sửa code, chưa commit, chưa xem trên trình duyệt. Skill: `.agents/skills/arkham-dynamic-grid-scene/SKILL.md`. Mã màn: `10549`.

Đường dẫn backend tính từ `backend/arkham-api/library/Arkham/`. `SH` = `Scenario/Scenarios/TheFeastOfHemlockVale/TheSilentHeath.hs`.

## Mục tiêu

Thay tranh tĩnh `hemlock-vale/silent-heath` (frontend `boards['10549']`) bằng nền tuyết trống + mỗi location một sprite vẽ theo tranh lá thật + mặt úp "Cavern".

## Vì sao là lưới động

Ba location khởi đầu cố định (Pearl Estate Ruins, Ashen Slope, Crystal Grove). Khi Act 1 tiến lên, 3 trong 6 hang "Horrors in the Rock" rút ngẫu nhiên được đặt úp quanh chúng; sau đó 3 lair (Salt Chamber, Larval Tunnel, Crystal Nursery) đặt vào ô trống cạnh người lật. Bản đồ nở theo hướng khác nhau mỗi ván: tranh tĩnh không khớp.

## Bảng luật đã kiểm

| Hạng mục | Luật | Nguồn |
|---|---|---|
| Dùng lưới | `setUsesGrid`; location đặt qua `placeInGrid` | `SH` |
| Khởi đầu | `PearlEstateRuins`, `AshenSlope`, `CrystalGrove` (cố định) | `SH`, `Location/Locations/.../` |
| Hang | 3 hang ngẫu nhiên đặt úp khi Act 1 tiến; kết nối `connectsToAdjacent` | `Act/.../ALostLegacy.hs`, `SearchingTheHeath.hs` |
| Lair | `SaltChamber`, `LarvalTunnel`, `CrystalNursery` đặt vào ô trống kề người lật | các file location |
| Kết nối | mọi location dùng `connectsToAdjacent` (theo ô kề) | cardDefs |
| Mặt úp | hang úp chung "Cavern" (`10716b`); 6 lá còn lại luôn ngửa | so ảnh CDN |
| Lưới tối đa | chưa đếm (6 location + hang); lưới nở theo khoảng trống | chưa kiểm |
| Day/night | không có (trạng thái hình ảnh duy nhất: ô nào lật/úp) | chưa thấy |

## Danh sách sprite (11 + 1 nền)

[asset-plan-for-codex.md](asset-plan-for-codex.md): 6 location `10555`-`10560`, 5 hang `10716`-`10720` (dùng chung với Lost Sister/Written in Rock: copy nếu đã có), `cavern-back`, nền `hemlock-vale/silent-heath-snowfield.webp`.

## Phases

| # | Phase | Ai làm | File |
|---|---|---|---|
| 1 | Toàn bộ ảnh | Codex (người dùng giao) | [asset-plan-for-codex.md](asset-plan-for-codex.md) |
| 2 | Tích hợp code, test, kiểm trình duyệt, dọn tranh cũ | Claude | [phase-02-code-integration.md](phase-02-code-integration.md) |

## Tiêu chí hoàn thành

- `10549` dùng `islands`, không còn tranh có location vẽ sẵn; tranh cũ chuyển `archives/`.
- Mỗi lá một sprite đúng ô; hang úp hiện `cavern-back`, lật hiện đúng tranh.
- Test + `vue-tsc` pass; contact sheet duyệt; đã xem trình duyệt (ván `SCRATCH`).

## Đã kiểm vs chưa kiểm

Đã kiểm (đọc code): bảng luật, không có anchor cho mã location màn này, kết nối theo ô kề.

CHƯA kiểm: `locationLayout` thật; lưới lớn nhất; hướng lair đặt (thứ tự `emptyPositions`); Return to.

## Rủi ro / câu hỏi mở

1. Hang dùng chung với 2 màn khác: copy file để đồng nhất.
2. 3 vị trí khởi đầu ngoài trời vs hang trong nhà: sprite phải phân biệt rõ.
3. Nền tuyết phải trống hoàn toàn để không đè lên ô.
