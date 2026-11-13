# Obsidian Canyons (The Drowned City): Scene Map lưới động

Status (2026-11-13): ảnh đã xong (Codex), code đã tích hợp (sprite set, `ISLAND_FOLDERS`, nền mới, tranh cũ vào `archives/`, test mới `obsidianHemlockDynamicScenes.test.mjs`; test + `vue-tsc` xanh). **Chưa xem trên trình duyệt**, chưa commit. Skill: `.agents/skills/arkham-dynamic-grid-scene/SKILL.md`.

Đường dẫn backend dưới đây tính từ `backend/arkham-api/library/Arkham/`. `OC` = `Scenario/Scenarios/TheDrownedCity/ObsidianCanyons.hs`, `H` = `Scenarios/TheDrownedCity/ObsidianCanyons/Helpers.hs`.

## Mục tiêu

Bỏ tranh tĩnh `the-drowned-city/obsidian-canyons` (12 điểm neo cố định ở `hemlock-overview.ts:797-809`, không khớp luật vì lưới đổi chỗ liên tục). Thay bằng nền trời trống + mỗi location một sprite vẽ theo tranh lá thật + mặt úp "Summit" + ô "open sky" + lớp gió. Chỉ bản gốc `11639` (chưa tìm thấy bản Return to cho màn này: chưa grep, ghi là chưa kiểm).

## Vì sao là lưới động (đã đọc backend)

Đặc thù: "open sky" là một lá location thật (`Locations.openSky`, `H:77-78`), không phải ô trống, nên một nửa lưới có thể là trời.

## Bảng luật đã kiểm

| Hạng mục | Luật | Nguồn |
|---|---|---|
| Dùng lưới | `setUsesGrid` | `OC:148` |
| Ô xuất phát | R'lyeh Streets tại `Pos 0 0` (góc dưới-trái, sơ đồ Act 1 cao 3 hàng × rộng 4 cột) | `OC:234-236` |
| Open sky ban đầu | `Pos 1 0`, `Pos 0 1`, `Pos 2 1`, `Pos 1 2` | `OC:238-240` |
| Ô Summit ban đầu | 7 ô `Pos 2 0, 3 0, 1 1, 3 1, 0 2, 2 2, 3 2` rút từ ĐÁY deck Summit | `OC:239`, `OC:243-247` |
| Deck Summit | Central Spire xáo vào 3 lá trên cùng; còn lại rút từ đáy | `OC:249-254`, rút đáy `H:199-206` |
| Open sky thừa | để set-aside; số open sky thay các lá Fear bị bỏ | `OC:194-209`, `OC:241` |
| Thêm lá vào khoảng trống | khe hở bên trong khung lưới được lấp bằng lá đáy deck Summit; không bao giờ nở ra ngoài khung | `H:638-655`, `OC:318-326` |
| Gió (Eastern/Western Winds) | mỗi hàng: lá Summit/open sky ngoài cùng phía gió bị bỏ (về đầu deck Summit hoặc kho Victory), cả hàng trượt 1 ô, ô trống đầu kia lấp bằng lá đáy deck. Hàng 1,3 thổi trái; 2,4 thổi phải | `H:229-257`, `H:280-298`, `H:604-612` |
| Lá không trượt | lá có modifier `CannotBeMoved`/không có trait Summit (R'lyeh Streets, Glyph Orrery, spire đã lật…) | `H:88-90`, `H:83-85` |
| Act 2 (cả hai nhánh) | dựng lại: mọi open sky + Summit (trừ lá neo) xáo về deck, lưới 3×5 với Central Spire trái hàng giữa, `s` = open sky | `H:320-330`, `H:380-415`; gọi từ `Act/Cards/TheDrownedCity/ObsidianCanyons/ScouringTheSpires.hs:45`, `SearchingTheSpires.hs:67` |
| Act 3 | dựng lại lưới 4×5 với Floating Spire góc trên-trái | `H:337-347`; `DeadlySkies.hs:45` |
| Kích thước tối đa | 5 cột × 4 hàng (Act 3). Khung chỉ co/đổi theo layout, không nở khi lá rời đi | `H:337-347`, `H:638-655` |
| Kết nối | mỗi lá nối với lá/open sky kề cạnh (agenda khai báo `gridAdjacencyConnections`); khoảng cách = Manhattan | `H:116-135`, `H:214-221` |
| Open sky | không vào được, không điều tra được, không đặt clue; một số hiệu ứng cho phép bước lên | `H:66-71`, `H:657-661` |
| Mặt úp | mọi lá Summit chưa lật dùng chung mặt úp Summit; Central Spire, Floating Spire có hai mặt; R'lyeh Streets và Glyph Orrery một mặt | `OC:149-165`; so ảnh (xem dưới) |
| Cố định vs xáo | vị trí xuất phát cố định theo sơ đồ; lá Summit xáo ngẫu nhiên; vị trí đổi theo gió/act | `OC:231-254` |
| Day/night | không có (không phải Hemlock Vale). Gió là "trạng thái hình ảnh" duy nhất: Eastern vs Western Winds là một story card (`OC:256-257`) | `OC:256-257` |
| Trạng thái hình ảnh | hướng gió (E/W, hàng 1,3 trái; 2,4 phải); lá lật/úp | `H:604-612` |

## Danh sách sprite (14 + 3 phụ + 1 nền)

Chi tiết từng sprite (mã, prompt, ref URL) nằm trong [asset-plan-for-codex.md](asset-plan-for-codex.md), file tự đủ để giao riêng cho Codex.

- 14 sprite: `11648`–`11653`, `11655`–`11662` (`11653` và `11654` Western/Eastern Athenaeum cùng một tranh; so ảnh thấy giống hệt, dùng chung một file).
- `summit-back` (từ `11649b`; mặt úp Summit giống hệt `11660b`), `open-sky` (không có tranh lá: CDN trả ảnh placeholder cho `xsky`, phải tự bịa), `wind-streaks` (lớp phủ).
- nền: `the-drowned-city/obsidian-canyons-sky.webp`.

## Phases

| # | Phase | Ai làm | File |
|---|---|---|---|
| 1 | Toàn bộ ảnh | Codex (người dùng giao) | [asset-plan-for-codex.md](asset-plan-for-codex.md) |
| 2 | Tích hợp code, test, kiểm trình duyệt, dọn tranh cũ | Claude | [phase-02-code-integration.md](phase-02-code-integration.md) |

## Tiêu chí hoàn thành

- `11639` không còn tranh có location vẽ sẵn, không còn 12 điểm neo; tranh cũ chuyển `archives/`.
- Mỗi lá hiện đúng một sprite ở đúng ô; open sky hiện ô trời mờ, không tranh chỗ với lá thật.
- Sau mỗi lần gió thổi và sau Act 2/Act 3 dựng lại, bản đồ khớp card mode.
- Test + `vue-tsc` pass; contact sheet đã duyệt; đã xem trên trình duyệt (`localhost:8090`, tài khoản của người dùng, ván `SCRATCH`).

## Đã kiểm vs chưa kiểm

Đã kiểm (đọc code): mọi dòng trong bảng luật; ảnh lá đã so từng cặp (Summit back, 11653 vs 11654).

CHƯA kiểm:
- `locationLayout` và `connectedLocations` thật của ván Obsidian (chưa xem trình duyệt). Quan trọng: open sky đã là location thật nên `compactGridLayout` sẽ vẽ nó; cần xác nhận không bị `isolatedLocationIds` ném sang off-map (`offMapCards.ts`) vì open sky không vào được.
- Card mode hiển thị Open Sky ra sao.
- `xsky` thật sự không có tranh (kết luận từ CDN trả placeholder, chưa thử nhiều mã).

## Rủi ro / câu hỏi mở

1. Open sky chiếm 1/3–1/2 lưới: nếu sprite open sky quá đậm sẽ che lá thật. Ảnh phải mờ, rìa tan hẳn.
2. Lớp gió cần kiểu `weather` mới (`WEATHER` ở `hemlock-overview.ts:1172` hiện chỉ có `storm-sea`); đây là việc code, không chỉ ảnh. Có thể bỏ lớp gió ở bản đầu nếu tốn công.
3. Lá trượt giữa ô: nếu frontend dùng CSS transition theo `locationLayout` thì trượt mượt, nếu không sẽ nhảy. Xem khi test.
4. `11653`/`11654` trùng tranh: cần xác nhận hai lá không bao giờ cùng nằm trên lưới (nếu cùng nằm, người chơi thấy hai sprite y hệt, chấp nhận được nhưng nên ghi chú).
5. Mặt Central Spire/Floating Spire sau khi lật và "không còn trait Summit" (`H:380-390` bình luận): kiểm sprite chọn đúng mặt khi lật.
6. Bản Return to của màn này: chưa kiểm có hay không.
