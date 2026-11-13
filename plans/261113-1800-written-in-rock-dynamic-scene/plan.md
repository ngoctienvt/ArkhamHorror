# Written in Rock (The Feast of Hemlock Vale): Scene Map lưới động

Status (2026-11-13): CHỈ MỚI LÀ KẾ HOẠCH. Chưa sinh ảnh, chưa sửa code, chưa commit, chưa xem trên trình duyệt. Skill: `.agents/skills/arkham-dynamic-grid-scene/SKILL.md`. Mã màn: `10501`.

Lưu ý nhỏ: brief gốc ghi màn này thuộc The Forgotten Age; backend và locale cho thấy nó thuộc `TheFeastOfHemlockVale`, nên thư mục ảnh là `hemlock-vale/`.

Đường dẫn backend tính từ `backend/arkham-api/library/Arkham/`. `WR` = `Scenario/Scenarios/TheFeastOfHemlockVale/WrittenInRock.hs`, `WRH` = `.../WrittenInRock/Helpers.hs`.

## Mục tiêu

Thay hai tranh tĩnh `written-in-rock-descent` (Act 1) và `written-in-rock-maze` (Act 2+) bằng nền hầm mỏ trống + mỗi location một sprite vẽ theo tranh lá thật + mặt úp "Cavern" và "Rail Tunnel" + sprite xe goòng + (tùy chọn) lớp ray.

## Vì sao là lưới động

- Act 1: hàng 5 ô (Control Station + 4 hang rút ngẫu nhiên từ 6 lá Horrors in the Rock). Hang bị úp, lật khi tới.
- Cave-in (Act 2): bỏ hang, dựng khối 5×4 "Rail Tunnel" xáo ngẫu nhiên + Rail Exit; ô trượt/đổi chỗ khi chơi (`CanBeSlid`, `swapLocations`).
- Kết nối giữa tile Rail do biểu tượng ray in trên lá (`ConnectedToWhen`/`railIcons`), KHÔNG theo ô lưới. Một tranh tĩnh không thể đúng.

## Bảng luật đã kiểm

| Hạng mục | Luật | Nguồn |
|---|---|---|
| Dùng lưới | `setUsesGrid` | `WR` |
| Act 1 | Control Station + 4 hang, đặt vào hàng bằng `placeInGrid`/`PlaceGrid` | `WR`, `Act/.../WrittenInRock/DescentIntoTheMines.hs` |
| Hang | 6 lá `10716`-`10720` (Dry Burrow có 2 bản), kết nối `connectsToAdjacent` (theo ô kề) | `Location/CardDefs/.../WrittenInRock.hs` |
| Cave-in | `TheUndergroundMaze` dựng khối rail 5×4, Rail Exit ngoài khối | `Act/.../TheUndergroundMaze.hs`, `WRH` |
| Rail tile | A/B cùng tranh; nối theo `cdMeta "rails"` + `ConnectedToWhen`; trượt/đổi chỗ được | `WRH`, `Location/.../RailBridge`, `LeftTurnA` |
| Control Station | `connectsToAdjacent`; vị trí sau cave-in: CHƯA KIỂM | `Location/.../ControlStation` |
| Mine cart | asset `10507` = phương tiện "chuyển động" theo ray (agenda Dangerous Ride) | `Agenda/.../DangerousRide.hs`, `Asset/Cards/TheFeastOfHemlockVale.hs` |
| Mặt úp | hang: mặt úp chung "Cavern" (`10716b`); rail: mặt úp chung "Rail Tunnel" (`10515b`); `10508`/`10509` mặt sau lặp tranh trước | so ảnh CDN |
| Lưới lớn nhất | khối 5×4 + Rail Exit | `WRH` |

## Cái bẫy của frontend (QUAN TRỌNG)

`hemlock-overview.ts` có early-return riêng cho `10501`: chọn `written-in-rock-descent` hoặc `-maze` theo `reference.endsWith('b')` (cờ `fixedPassages`, `village: true`). Phải gỡ/thay early-return này bằng đường `islands`+`boards` thông thường, nếu không sprite sẽ không bao giờ được dùng. Không có điểm neo nào cho mã location của màn này (đã grep).

## Danh sách sprite (17 + 1 tùy chọn + 1 nền)

Chi tiết (prompt, URL tranh lá) ở [asset-plan-for-codex.md](asset-plan-for-codex.md): 9 location `10508`-`10516`, 5 hang `10716`-`10720` (dùng chung với Lost Sister/Silent Heath: copy nếu đã có), `cavern-back`, `rail-back`, `mine-cart`, tùy chọn `rail-arm`, nền `hemlock-vale/written-in-rock-mine.webp`.

## Phases

| # | Phase | Ai làm | File |
|---|---|---|---|
| 1 | Toàn bộ ảnh | Codex (người dùng giao) | [asset-plan-for-codex.md](asset-plan-for-codex.md) |
| 2 | Tích hợp code, test, kiểm trình duyệt, dọn tranh cũ | Claude | [phase-02-code-integration.md](phase-02-code-integration.md) |

## Tiêu chí hoàn thành

- `10501` không còn dùng hai tranh cũ, không còn early-return; tranh cũ chuyển `archives/`.
- Mỗi lá một sprite đúng ô; sau trượt/đổi chỗ bản đồ khớp card mode; xe goòng hiện đúng chỗ.
- Test + `vue-tsc` pass; contact sheet đã duyệt; đã xem trên trình duyệt (ván `SCRATCH`).

## Đã kiểm vs chưa kiểm

Đã kiểm (đọc code): bảng luật, mặt sau chung, early-return `10501`, không có anchor.

CHƯA kiểm: `locationLayout`/`connectedLocations` thật trên ván sống; chiều trục y và cách ánh xạ hướng ray; vị trí Control Station sau cave-in; hướng nhìn xe goòng (mô hình `SceneVehicle` chỉ có `faceRight` trái/phải); card mode vẽ xe goòng ra sao.

## Rủi ro / câu hỏi mở

1. Hướng ray: KHÔNG vẽ cứng vào sprite (lá A/B cùng tranh nhưng ray khác). Cách xử lý: lớp `rail-arm` phủ theo `railIcons` (tùy chọn) hoặc chỉ dựa vào đường nối đứt nét của game.
2. Xe goòng chỉ quay trái/phải; ray dọc sẽ nhìn lệch. Chấp nhận hoặc thêm hướng mới (việc code).
3. Hang dùng chung ảnh với Lost Sister/Silent Heath: ưu tiên copy để đồng nhất.
4. Return to màn này: chưa kiểm.
