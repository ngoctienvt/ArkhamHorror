# Without a Trace (The Scarlet Keys): Scene Map lưới động

Status (2026-11-13): CHỈ MỚI LÀ KẾ HOẠCH. Chưa sinh ảnh, chưa sửa code, chưa commit, chưa xem trên trình duyệt. Skill: `.agents/skills/arkham-dynamic-grid-scene/SKILL.md`. Mã màn: `09681`.

Đường dẫn backend tính từ `backend/arkham-api/library/Arkham/`. `WAT` = `Scenario/Scenarios/TheScarletKeys/WithoutATrace.hs`, `TSKH` = `Campaigns/TheScarletKeys/Helpers.hs` (`handleCityOfRemnants`).

## Mục tiêu

Thay tranh tĩnh `the-scarlet-keys/without-a-trace` (`boards['09681']`) bằng nền hoàng hôn tím trống + mỗi location một sprite vẽ theo tranh lá thật + mặt úp "City of Remnants".

## Vì sao là lưới động

Điều tra viên bắt đầu ở Court of the Outsiders giữa lưới. Quanh đó là các mini-card (concealed) tại ô lưới; khi một mini-card được lộ, một location City of Remnants "in the shadows" được đặt vào ĐÚNG ô đó, rồi rút lá mới vào bóng tối. Các City lấy từ deck xáo ngẫu nhiên: lá nào ở ô nào, lưới nở hướng nào đều khác nhau mỗi ván.

## Bảng luật đã kiểm

| Hạng mục | Luật | Nguồn |
|---|---|---|
| Dùng lưới | `setUsesGrid`, đặt lá qua `PlaceGrid (GridLocation pos lid)` | `WAT` |
| Ô xuất phát | Court of the Outsiders giữa lưới | `WAT` |
| Mini-card | `PlaceConcealedCard (InPosition pos)`, lưu ở `meta.concealedCards` | `WAT`, `TSKH` |
| Rút vào bóng | lá City of Remnants vào vùng `InTheShadows` (off-map `shadows`) | `WAT`, `TSKH` |
| Lộ mini-card | lá thay thế đặt vào ô mini-card đó | `handleCityOfRemnants` |
| Deck | deck Otherworld xáo ngẫu nhiên; Outsiders' Lair (`09689`) ở cuối | `WAT` |
| Kết nối | Court, Lair, Rambling Route, Cliffs dùng `connectsToAdjacent` (theo ô kề) | cardDefs `BeyondTheBeyond` |
| Mặt úp | City of Remnants úp chung mặt "Remnants" (`09747ab` = `09689b`); Court (`09688`) một mặt | so ảnh CDN |
| Tranh chung | A/B/C Rambling Route (`09747`), A/B Alien Frontier (`09748`), A/B Weald of Effigies (`09749`) cùng tranh; Cliffs (`09750`) có 2 bản | so ảnh CDN |

## Cái bẫy của frontend

`LocationMap.vue` `layout` tính `compactGridLayout(rows, keep)` với `keep` = location + ô lựa chọn. Mini-card chỉ-có-ô (concealed) chưa có location: `concealedSpots` dùng `gridConcealedGroups` + `gridPositions(layout)`; ô không có cell rơi xuống dải dưới. Cần kiểm: ô concealed nằm TRONG layout hay chỉ trong meta; nếu ngoài layout, khi location mới được đặt vào ô đó lưới có thể co lại làm mọi thứ nhảy. Xem `concealedCards.ts`, `locationGraph.ts:110`.

## Danh sách sprite (6 + 1 mặt úp + 1 nền)

[asset-plan-for-codex.md](asset-plan-for-codex.md): `09688`, `09689`, `09747`-`09750`, `remnants-back`, nền `the-scarlet-keys/without-a-trace-otherworld.webp`. Các sprite `09747`-`09750` và `remnants-back` dùng chung với Congress of the Keys: "bỏ qua nếu file đã tồn tại / copy".

## Phases

| # | Phase | Ai làm | File |
|---|---|---|---|
| 1 | Toàn bộ ảnh | Codex (người dùng giao) | [asset-plan-for-codex.md](asset-plan-for-codex.md) |
| 2 | Tích hợp code, test, kiểm trình duyệt, dọn tranh cũ | Claude | [phase-02-code-integration.md](phase-02-code-integration.md) |

## Tiêu chí hoàn thành

- `09681` không còn tranh có location vẽ sẵn; tranh cũ chuyển `archives/`.
- Mỗi City hiện đúng ở ô của mini-card đã lộ; lưới không nhảy khi lộ.
- Test + `vue-tsc` pass; contact sheet duyệt; xem trình duyệt (ván `SCRATCH`).

## Đã kiểm vs chưa kiểm

Đã kiểm (đọc code): bảng luật, tranh dùng chung, kết nối theo ô kề.

CHƯA kiểm: `locationLayout` thật; ô concealed có vào `locationLayout` không; City of Remnants chưa lộ hiển thị thế nào trong nhóm off-map `shadows`; Return to.

## Rủi ro / câu hỏi mở

1. Lưới nhảy khi lộ mini-card (xem bẫy trên).
2. Sprite dùng chung với Congress: giữ cùng tên file để copy.
3. Court là sân tròn có vòng cột; cần khác biệt rõ với 5 City.
