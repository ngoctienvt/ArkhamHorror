# The Lost Sister (Feast of Hemlock Vale): Scene Map lưới động

Status (2026-11-13): ảnh đã xong (Codex), code đã tích hợp (sprite set, `ISLAND_FOLDERS`, nền mới, tranh cũ vào `archives/`, test mới `obsidianHemlockDynamicScenes.test.mjs`; test + `vue-tsc` xanh). **Chưa xem trên trình duyệt**, chưa commit. Skill: `.agents/skills/arkham-dynamic-grid-scene/SKILL.md`.

`LS` = `backend/arkham-api/library/Arkham/Scenario/Scenarios/TheFeastOfHemlockVale/TheLostSister.hs`; các đường dẫn khác tính từ `backend/arkham-api/library/Arkham/`.

## Mục tiêu

Bỏ tranh tĩnh `hemlock-vale/lost-sister` (`hemlock-overview.ts:37`). Thay bằng nền hang trống + sprite theo tranh lá thật + mặt úp "Cavern". Không có điểm neo cho màn này (đã grep `hemlock-overview.ts`: chỉ có dòng `boards` 37).

## Vì sao là lưới động

Mạng hang nở theo từng lá rút từ deck và hình dạng khác nhau mỗi ván; vẫn dùng một tranh duy nhất thì vị trí các lá không khớp.

## Bảng luật đã kiểm

| Hạng mục | Luật | Nguồn |
|---|---|---|
| Dùng lưới | `setUsesGrid` | `LS:141` |
| Ô xuất phát | Akwan tại `Pos 0 0`, luôn mở (một mặt) | `LS:159-160` |
| Ba hang đầu | 3 lá đầu của deck Caverns đặt tại `Pos (-1) 0`, `Pos 0 (-1)`, `Pos 1 0` | `LS:173-175` |
| Deck Caverns | xáo các location của TheLostSister (trừ Fungal Cave) + Horrors in the Rock (đã bỏ 2 lá), 3 lá đầu lên lưới, phần còn lại thành deck | `LS:162-177` |
| Fungal Cave | set-aside; Act 1 sang mặt B đặt nó cạnh một location Coastal còn ô trống, rồi đặt thêm lá để Fungal Cave có đủ 4 lá kề | `Act/Cards/TheFeastOfHemlockVale/TheLostSister/TheMissingSibling.hs:55-82` |
| Cách thêm lá | (1) Act 1: khi lấy clue cuối của location, lá Caverns kế tiếp đặt vào MỘT ô trống kề (chọn); (2) Suspended Graveyard: tốn 1 horror, đặt lá kế tiếp vào ô trống kề của nó (một lần/ván); (3) Codex Theta: đặt lá kế vào ô trống kề hang gần nhất, hoặc xuống đáy | `TheMissingSibling.hs:38-49`; `Location/Cards/TheFeastOfHemlockVale/TheLostSister/SuspendedGraveyard.hs:20-45`; `LS:330-346` |
| Xem trước deck | Akwan parley: nhìn 3 lá trên cùng, xếp lại (không đổi lưới) | `Location/Cards/.../TheLostSister/Akwan.hs:21-36` |
| Gỡ lá / đổi hình dạng | KHÔNG có (đã đọc cả hai agenda và ba act: không có remove/flip/shuffle lưới) | `Agenda/Cards/.../TheLostSister/IntoTheCaves.hs`, `DarknessClosesIn.hs`, `Act/.../OnTheTrail.hs`, `FaceToCarapace.hs` |
| Kích thước tối đa | không có trần cứng; lưới chỉ nở. Tối đa lý thuyết = Akwan + toàn bộ deck (xem sprite: 12 hang + Fungal Cave) | suy ra từ `LS:162-177` (chưa đếm số lá thực tế mỗi độ khó/số người) |
| Kết nối | không khai báo riêng trong file màn; dùng kết nối lưới mặc định (kề cạnh) | CHƯA kiểm (cần `connectedLocations` thật) |
| Mặt úp | lá Caverns đặt vào lưới ở trạng thái chưa lật (Cavern); dùng mặt úp Cavern chung | so ảnh `10576b` với `10716b` gần giống nhau |
| Cố định vs xáo | Akwan cố định; mọi hang xáo ngẫu nhiên; 3 hang đầu trên 3 hướng cố định | `LS:173-175` |
| Trạng thái hình ảnh | Dark (trait của hang) ↔ enemy Light/Dark; ban ngày/đêm theo Hemlock Day | `LS:50-55`, `LS:397-424` |
| Day/night | `getCampaignDay`/`getCampaignTime` chỉ đổi trait/modifier, KHÔNG đổi tranh lá (so ảnh chưa thấy tranh ngày/đêm khác nhau). Nền một bản là đủ | `LS:146-153` |
| Return to | chưa tìm thấy bản Return to của màn Hemlock Vale (chưa grep) | CHƯA kiểm |

## Danh sách sprite (13 + 1 mặt úp + 1 nền)

Chi tiết trong [asset-plan-for-codex.md](asset-plan-for-codex.md): `10575` Akwan, `10576`–`10582` (bảy hang của scenario), `10716`–`10720` (năm hang Horrors in the Rock; mỗi ván chỉ 4 trong 6 lá xuất hiện nên cần cả năm), `back` Cavern, nền `hemlock-vale/lost-sister-caverns.webp`.

## Phases

| # | Phase | Ai làm | File |
|---|---|---|---|
| 1 | Toàn bộ ảnh | Codex (người dùng giao) | [asset-plan-for-codex.md](asset-plan-for-codex.md) |
| 2 | Tích hợp code, test, kiểm trình duyệt, dọn tranh cũ | Claude | [phase-02-code-integration.md](phase-02-code-integration.md) |

## Tiêu chí hoàn thành

- `10569` không còn tranh có location vẽ sẵn; tranh cũ vào `archives/`.
- Mỗi hang hiện đúng sprite theo tranh lá tại ô của nó; lá úp hiện mặt úp Cavern; Akwan luôn mặt mở.
- Lưới nở đúng hướng/vị trí như card mode.
- Test + `vue-tsc` pass; contact sheet đã duyệt; đã xem trên trình duyệt (`localhost:8090`, tài khoản của người dùng).

## Đã kiểm vs chưa kiểm

Đã kiểm (đọc code): mọi dòng backend ở bảng; sơ bộ so ảnh mặt úp và tranh lá.

CHƯA kiểm: `locationLayout`/`connectedLocations` thật; kết nối giữa các hang (mặc định lưới?); số lá thực tế trong deck theo độ khó; dữ liệu `10582b` có lệch không (Fungal Cave `10582` và `10582b` cùng tranh: có vẻ lá này không bao giờ úp trên lưới vì nó đặt thẳng ở act, chưa xác nhận trạng thái lật khi vào lưới); Return to.

## Rủi ro / câu hỏi mở

1. Trạng thái "Dark": có nên có dấu hiệu hình ảnh (tối hơn) cho hang Dark? Hiện không phải yêu cầu; để mở. Luật ảnh hưởng enemy/điều tra viên chứ không đổi tranh lá.
2. Lá Caverns thật sự úp hay mở lúc đặt vào lưới? `placeLocationInGrid_` đặt lá chưa lật; mặt nào hiển thị trong card mode cần xem thực tế.
3. Một số lá có tranh gần giống nhau (`10576` Suspended Graveyard với `10581` Open Cave; `10575` Akwan và `10577` Hidden Cove): ảnh phải phân biệt được ở 150 px (đã đưa vào checklist).
4. Lưới có thể nở bất đối xứng (cả trái/dưới, tọa độ âm): xác nhận `compactGridLayout` xử lý số âm.
5. Số hang tối đa lớn (12+1) → sprite phải đủ nhỏ để không chồng; đo ở bước test.
