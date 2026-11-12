# The Dream-Eaters: ảnh Scene Map cho 8 màn

Status (2026-11-13): Đã xuất 32 ảnh và tích hợp 8 Scene Map. Bản xuất và kết quả kiểm tra nằm trong [handoff](codex-handoff.md).
Skill: [arkham-overview-art](../../.agents/skills/arkham-overview-art/SKILL.md) cho màn tĩnh, [arkham-dynamic-grid-scene](../../.agents/skills/arkham-dynamic-grid-scene/SKILL.md) cho màn đặc biệt.

## Mục tiêu

Mỗi màn của The Dream-Eaters có scene map đúng luật: tranh toàn cảnh + điểm neo cho màn có vị trí cố định, và plan riêng cho màn mà tranh tĩnh không thể hiện đúng (lá xoay vòng, lưới dựng lại).

## Ràng buộc

- Chỉ frontend + ảnh. Không sửa backend.
- Card mode là chuẩn về quan hệ trái/phải/trên/dưới.
- Ma trận tổng (`locationLayout` + mọi `SetLayout` trong Act) là nguồn sự thật; mọi ô có tên phải có chỗ trên tranh, kể cả lá `setAside`.
- Lá rơi vào ô ngẫu nhiên (`placeLabeledLocations`, `placeGroup`) phải neo theo **nhãn ô** (`enchantedWoods3`, `basementDoor2`...), không theo mã lá. `hemlockVillagePosition()` đã ưu tiên nhãn.
- **Luôn dùng tranh lá location thật làm image reference** khi tạo mọi tranh nền và sprite (`assets.arkhamhorror.app/img/arkham/cards/<mã>.avif`). Chữ chỉ bổ sung; khác nhau thì theo tranh lá.
- **Tạo ảnh tự động qua Codex** (`generate2dmedia/route_media.py`, route `local:codex-cli`, tối đa 8 reference/lần). Chi tiết lệnh ở phase 1.
- Ảnh đặt ở `frontend/public/img/scenes/the-dream-eaters/<slug>.webp`, WebP q85–90, 200–450 KB, 16:9, không chữ/khung/watermark.
- Thư mục làm việc đang có thay đổi chưa commit (Devil Reef). Plan này không đụng các file đó ngoài `hemlock-overview.ts` (thêm mục mới, không sửa mục cũ).

## Phân loại 8 màn (đọc từ backend)

| Mã | Màn | Cơ chế location | Loại | Số ảnh |
|---|---|---|---|---|
| 06039 | Beyond the Gates of Sleep | Act 1–2 bậc thang đi xuống; *The Final Descent* gỡ bậc thang, đặt 6/7 Enchanted Woods ngẫu nhiên vào `enchantedWoods1–6` | Tĩnh, đổi tranh theo Act | 2 |
| 06063 | Waking Nightmare | Bệnh viện cố định; Act 1 đặt Stairwell + 3 cửa hầm `basementDoor1–3` (Morgue/Operating/Private Room xáo) | Tĩnh, neo theo nhãn | 1 |
| 06119 | The Search for Kadath | Mỗi vùng (Oriab, Mnar, Forbidden Lands, Timeless Realm) **gỡ toàn bộ** location cũ rồi đặt 3 lá mới; thứ tự vùng do người chơi chọn. Hai vùng không bao giờ cùng có mặt (xem dưới) | Tĩnh, mỗi vùng một tranh | 5 |
| 06168 | A Thousand Shapes of Horror | Act 1: nhà + mộ, cửa trên/dưới xáo theo nhóm. Act 2: gỡ hết, 5 Mysterious Stairs xếp dọc, **Endless Descent xoay vòng bậc** | Act 1 tĩnh · **Act 2 đặc biệt** | 1 + plan riêng |
| 06206 | Dark Side of the Moon | Ma trận 4×3 cố định; Act đặt dần Caverns, Black Core, Light Side, White Ship; Moon-Beast Galley tùy điều kiện | Tĩnh | 1 |
| 06247 | Point of No Return | Ma trận 3×5 cố định; 4 Sea of Pitch xáo vào `seaOfPitch1–4`; nhiều lá lật mặt tại chỗ | Tĩnh, neo theo nhãn | 1 |
| 06286 | Where the Gods Dwell | Act 1–2: cao nguyên Leng. *Beyond Dreams* gỡ hết trừ Onyx Castle, đặt 4/6 Forsaken Tower vào `north/south/east/westTower` | Tĩnh, đổi tranh theo Act | 2 |
| 06333 | Weaver of the Cosmos | Act 1: cột 4 mạng nhện (6 loại xáo, có trùng). Act 2: vòng 8 mạng quanh Atlach-Nacha + 4 chân, **Atlach-Nacha xoay** (`Meta.rotation`) | **Đặc biệt** | plan riêng |

Màn đặc biệt có plan riêng:

- [Weaver of the Cosmos: mạng nhện + Atlach-Nacha xoay](../261112-2358-weaver-of-the-cosmos-web-scene/plan.md)
- [A Thousand Shapes of Horror Act 2: cầu thang vô tận xoay vòng](../261112-2358-endless-stairs-scene/plan.md)

**Kadath: các vùng không tương tác nhau (đã xác minh).** Mọi lần sang vùng mới đều chạy chung một khối setup (`SetScenarioMeta` trong `TheSearchForKadath.hs`): chụp danh sách mọi location đang có, đặt 3 lá của vùng mới, dời **toàn bộ** điều tra viên tới thành phố chính của vùng (`placeAllAt`), bỏ clue, xả enemy (trừ Tenebrous Nightgaunt), rồi gỡ mọi location cũ. Vùng đã đi được ghi vào `meta.regions` và không thể quay lại. Vì vậy cả nhóm luôn đứng chung một vùng, không có đường nối giữa hai vùng → mỗi vùng một tranh riêng. Thứ tự: bắt đầu ở Kingdom of the Skai (Ulthar, Skai River, Dylath-Leen); Act 1 cho chọn 1 trong 4 vùng; các Act vùng sau cho chọn vùng chưa đi; hết vùng hoặc đủ 10 Signs of the Gods thì kết thúc.

**Kadath: City-Which-Appears-on-No-Map và Temple of Unattainable Desires (đã xác minh)** đều thuộc vùng Timeless Realm, xuất hiện dần: lật Hazuth-Kleg → story *Unattainable Desires* đặt Temple; lật Temple → story *The City Inside* đặt City. Tranh Timeless Realm vẽ đủ 5 điểm ngay từ đầu (2 điểm sau để trống cho tới khi lá ra), đúng thứ tự trong ma trận: Serannian trên, Celephaïs và City cùng hàng giữa, Hazuth-Kleg và Temple cùng hàng dưới.

Kadath, Beyond the Gates và Where the Gods Dwell đổi tranh theo nhóm location đang chơi. Code ưu tiên nhãn của location đang có mặt vì ma trận có thể khai báo cả các nhóm chưa đặt.

## Phases

| # | Phase | File | Ai làm |
|---|---|---|---|
| 1 | Tạo 13 tranh tĩnh qua Codex, reference là tranh lá (prompt + kiểm tra + hậu kỳ) | [phase-01-static-art.md](phase-01-static-art.md) | Claude gọi Codex CLI |
| 2 | Tích hợp tranh tĩnh: `boards`, chọn tranh theo layout, điểm neo, test | [phase-02-static-integration.md](phase-02-static-integration.md) | Claude |
| 3 | Weaver of the Cosmos | plan riêng | Claude + ảnh sprite |
| 4 | Endless Stairs (Thousand Shapes Act 2) | plan riêng | Claude + 1 ảnh nền |

Phase 2 chạy được ngay khi có tranh đầu tiên; mỗi màn tích hợp độc lập. Phase 3, 4 không phụ thuộc phase 1–2.

## Thứ tự đề xuất

Waking Nightmare → Dark Side of the Moon → Point of No Return → Beyond the Gates → Where the Gods Dwell → Kadath → Thousand Shapes Act 1. Màn đầu là màn mở campaign *Web of Dreams*/*Dream-Quest*, hay được chơi nhất.

## Tiêu chí hoàn thành

- 7 màn tĩnh có tranh; mọi lá trong ma trận tổng (kể cả `setAside`) có điểm neo, sai số ≤ ±2%, đã duyệt qua ảnh preview overlay.
- Lá xáo ngẫu nhiên neo theo nhãn; đổi ván không làm lệch.
- Tranh tự đổi đúng lúc qua Act / qua vùng (Beyond the Gates, Kadath ×5, Where the Gods Dwell, Thousand Shapes Act 1 → plan stairs).
- `node --test frontend/tests/hemlockOverview.test.mjs` và typecheck pass.
- Hai màn đặc biệt có plan riêng đã duyệt.

## Rủi ro

- Server công khai có thể chạy code khác repo. Nhãn ô lấy từ state nên không phụ thuộc; chỉ bảng phân loại ở trên dựa vào code repo.
- `hemlock-overview.ts` đã 1218 dòng. Anchor của Dream-Eaters để trong module riêng (phase 2).
- Prompt viết từ tên lá dễ sai bản chất (bài học Before the Black Throne). Bắt buộc mở tranh lá thật trước khi chốt prompt (phase 1, bước 1).

## Câu hỏi còn mở

Đã chốt (2026-11-13): Kadath làm 5 tranh vùng riêng; City/Temple vẽ trong tranh Timeless Realm; Weaver giải quyết trong plan riêng; Codex không giới hạn số lần chạy, được chạy lại tới khi tranh đạt.

Không còn câu hỏi mở.
