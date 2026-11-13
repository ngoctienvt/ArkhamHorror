# Congress of the Keys (The Scarlet Keys): Scene Map lưới động

Status (2026-11-13): CHỈ MỚI LÀ KẾ HOẠCH. Chưa sinh ảnh, chưa sửa code, chưa commit, chưa xem trên trình duyệt. Skill: `.agents/skills/arkham-dynamic-grid-scene/SKILL.md`. Mã màn: `09694`.

Đường dẫn backend tính từ `backend/arkham-api/library/Arkham/`. `CK` = `Scenario/Scenarios/TheScarletKeys/CongressOfTheKeys.hs`, `TSKH` = `Campaigns/TheScarletKeys/Helpers.hs`.

## Mục tiêu

Thay tranh tĩnh `the-scarlet-keys/congress-of-the-keys` (`boards['09694']`) bằng hai nền trống (đại sảnh đỏ cho Act 1, trời bão tím cho Act 2-4) + mỗi location một sprite vẽ theo tranh lá thật + hai mặt úp ("Coterie Sanctuary", "City of Remnants").

## Vì sao là lưới động

- Act 1: Scarlet Halls + 3 Coterie Sanctuary (Congress Chamber, Coterie Library, The Key Reliquary) đặt theo THỨ TỰ NGẪU NHIÊN mỗi ván.
- Khi Act 1 tiến, dựng tháp dọc 3 ô cố định (Knotted Tower, Gravity-Defying Climb, Towering Vertex); City of Remnants từ deck xáo được đặt quanh khi lộ mini-card; các act sau dựng lại vị trí mini-card.
- Một tranh nền không thể có cả hai pha, và không thể khớp thứ tự sanctuary ngẫu nhiên.

## Bảng luật đã kiểm

| Hạng mục | Luật | Nguồn |
|---|---|---|
| Dùng lưới | `setUsesGrid` / `PlaceGrid` | `CK` |
| Act 1 | Scarlet Halls + 3 Sanctuary xáo ngẫu nhiên | `CK`, `Act/.../SecretsAndLiesV1/V2/V3` |
| Act 2-4 | tháp: The Knotted Tower, Gravity-Defying Climb, The Towering Vertex: Ruinous Conflux | `ToTheTower`, `TheAscent`, `TheFinalErr` |
| City of Remnants | đặt khi lộ mini-card (`handleCityOfRemnants`) | `TSKH` |
| Kết nối | CHỈ `TheKnottedTower` dùng `connectsToAdjacent`; sanctuary/Halls/Climb/Vertex nối theo biểu tượng in (không phụ thuộc ô) | cardDefs |
| Mặt úp | Sanctuary úp chung (`09707b` = `09706b`, cửa vàng); City of Remnants úp chung `09747ab` | so ảnh CDN |
| Tranh chung | Lair/Sanctum cùng tranh (`09704`=`09705`, `09706`=`09707`, `09708`=`09709`, `09710`=`09711`); A/B/C City cùng tranh | so ảnh CDN |
| Nền | Act 1 (sảnh đỏ) và Act 2-4 (trời tím) khác nhau; điều kiện đổi nền: CHƯA KIỂM | `CK` |

## Cái bẫy của frontend

Giống Without a Trace: ô mini-card concealed và `compactGridLayout` (`LocationMap.vue`, `locationGraph.ts:110`); xác nhận ô concealed-only có trong `locationLayout` không. Thêm: Act 1 có thể dùng bố cục chuỗi (hàng) thay vì lưới, chưa kiểm.

## Danh sách sprite (11 location + 2 mặt úp + 2 nền)

[asset-plan-for-codex.md](asset-plan-for-codex.md): Act 1: `09704`, `09706`, `09708`, `09710`, `sanctuary-back`; tháp: `09712`-`09714`; City: `09747`-`09750`, `remnants-back`; nền `congress-halls.webp` và `congress-otherworld.webp`. Sprite City và nền Otherworld dùng chung với Without a Trace: "bỏ qua nếu file đã tồn tại / copy".

## Phases

| # | Phase | Ai làm | File |
|---|---|---|---|
| 1 | Toàn bộ ảnh | Codex (người dùng giao) | [asset-plan-for-codex.md](asset-plan-for-codex.md) |
| 2 | Tích hợp code, test, kiểm trình duyệt, dọn tranh cũ | Claude | [phase-02-code-integration.md](phase-02-code-integration.md) |

## Tiêu chí hoàn thành

- `09694` không còn tranh có location vẽ sẵn; đúng nền theo pha; tranh cũ chuyển `archives/`.
- Thứ tự sanctuary đúng ô; tháp đúng cột; City đúng ô mini-card.
- Test + `vue-tsc` pass; contact sheet duyệt; xem trình duyệt (ván `SCRATCH`).

## Đã kiểm vs chưa kiểm

Đã kiểm (đọc code): bảng luật, tranh dùng chung, ai dùng `connectsToAdjacent`.

CHƯA kiểm: `locationLayout` thật; bố cục Act 1 (chuỗi vs lưới); điều kiện đổi nền; ô concealed-only có vào `locationLayout`; cách City chưa lộ hiển thị trong `shadows`; Return to.

## Rủi ro / câu hỏi mở

1. Hai nền: cần cơ chế chọn nền theo act (code: `hemlockOverview` hiện trả một ảnh theo `boards`). Cách đơn giản: chọn theo mã tham chiếu act hoặc có `The Knotted Tower` trong state.
2. Gravity-Defying Climb và Vertex bắt đầu úp nhưng mặt sau lặp tranh: một sprite mỗi lá.
3. Mini-card concealed và lưới nhảy khi lộ (xem bẫy).
