# Phase 2: Tích hợp tranh tĩnh

Làm theo từng màn ngay khi tranh của màn đó qua bước duyệt ở phase 1.

## File

| File | Việc |
|---|---|
| `frontend/src/arkham/scene-anchors-the-dream-eaters.ts` (mới) | `boardAnchors` của 13 tranh và hàm chọn tranh theo layout. Tách riêng vì `hemlock-overview.ts` đã 1218 dòng |
| `frontend/src/arkham/hemlock-overview.ts` | Import module trên; gộp anchor vào `boardAnchors`; gọi hàm chọn tranh trong `hemlockOverview()` trước khi tra `boards` |
| `frontend/tests/hemlockOverview.test.mjs` | Test tranh được chọn + tọa độ kỳ vọng |

## Chọn tranh

Màn một tranh (06063, 06206, 06247) tra trực tiếp trong module Dream-Eaters. Màn nhiều tranh ưu tiên nhãn location đang có mặt. Ma trận tổng của Kadath chứa nhãn của cả năm vùng:

| Mã | Điều kiện trong layout | Tranh |
|---|---|---|
| 06039 | có `enchantedWoods1`…`6` và không có `seventySteps`/`sevenHundredSteps` | `beyond-the-gates-woods` |
| | còn lại | `beyond-the-gates-steps` |
| 06119 | có `baharna` / `kadatheron` / `ilekVad` / `celephaïs` (hoặc `cityWhichAppearsOnNoMap`) | `kadath-oriab` / `kadath-mnar` / `kadath-forbidden-lands` / `kadath-timeless-realm` |
| | còn lại | `kadath-kingdom-of-the-skai` |
| 06168 | có `mysteriousStairs1` | giao cho plan Endless Stairs (trả về tranh stairs) |
| | còn lại | `thousand-shapes-house` |
| 06286 | có `northTower` | `where-the-gods-dwell-towers` |
| | còn lại | `where-the-gods-dwell-leng` |

Layout Haskell dùng nhãn `celephaïs`. Test chọn nền kiểm tra chuỗi có dấu này.

Hàm thuần `dreamEatersArt(scenario, layout, activeLabels)` dùng được trong test không cần Vue.

## Điểm neo

- Lá cố định: key là mã lá (`'06070': [x, y]`).
- Ô xáo ngẫu nhiên: key là nhãn (`basementDoor1`, `enchantedWoods3`, `seaOfPitch2`, `upstairsDoorway1`, `northTower`...). `hemlockVillagePosition()` tra nhãn trước mã, nên lá nào rơi vào ô cũng đứng đúng chỗ.
- Anchor để trong `boardAnchors['the-dream-eaters/<slug>']`, không đưa vào `villageAnchors` (mã 06xxx không trùng màn khác nhưng giữ thống nhất theo tranh).
- Lá lật mặt (Point of No Return, Kadath, Moon-Beast Galley) giữ mã gốc; `hemlockVillagePosition()` đã cắt hậu tố `a/b`.

## Kiểm tra

1. `node --test frontend/tests/hemlockOverview.test.mjs`: mỗi tranh tồn tại trên đĩa; hàm chọn tranh trả đúng với layout mẫu lấy từ backend (layout đầu màn và layout sau `SetLayout`/sau khi gỡ); mỗi lá trong bảng phase 1 có anchor.
2. `npm --prefix frontend run tc` không lỗi.
3. Trên ván thật (pane Browser đang hiện, không bấm lựa chọn hộ người dùng): so thứ tự trái/phải/trên/dưới giữa tab *Card board* và tab *Map* bằng đoạn script trong skill dynamic-grid §5.
4. `grep` mã 06xxx trong `hemlock-overview.ts` để chắc không có anchor trùng.

## Việt hóa

Không có chữ mới trên map. Nếu màn nào phát sinh nhãn lựa chọn chưa dịch, xử lý theo [arkham-vi-localization](../../.agents/skills/arkham-vi-localization/SKILL.md).
