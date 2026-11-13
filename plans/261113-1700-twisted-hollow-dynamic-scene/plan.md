# The Twisted Hollow (Feast of Hemlock Vale): Scene Map lưới động

Status (2026-11-13): ảnh đã xong (Codex), code đã tích hợp (sprite set, `ISLAND_FOLDERS`, nền mới, tranh cũ vào `archives/`, test mới `obsidianHemlockDynamicScenes.test.mjs`; test + `vue-tsc` xanh). **Chưa xem trên trình duyệt**, chưa commit. Skill: `.agents/skills/arkham-dynamic-grid-scene/SKILL.md`.

`TH` = `backend/arkham-api/library/Arkham/Scenario/Scenarios/TheFeastOfHemlockVale/TheTwistedHollow.hs`; `DD` = `Agenda/Cards/TheFeastOfHemlockVale/TheTwistedHollow/DeepeningDark.hs`; `WB` = `Act/Cards/TheFeastOfHemlockVale/TheTwistedHollow/WheresBertie.hs` (hai đường dẫn sau tính từ `backend/arkham-api/library/Arkham/`).

## Mục tiêu

Bỏ tranh tĩnh `hemlock-vale/twisted-hollow` (`hemlock-overview.ts:39`). Thay bằng nền rừng trống + sprite theo tranh lá thật + mặt úp "Western Woods". Không có điểm neo cho màn này (chỉ có dòng `boards`).

## Vì sao là lưới động (đã đọc backend)

Rừng nở khi lật lá, lá đã lật mà trống bị lật úp lại khi Darkness tăng, và ở Act 2 cả rừng bị dựng lại quanh The Twisted Hollow: ba tình huống mà tranh tĩnh không thể hiện.

## Bảng luật đã kiểm

| Hạng mục | Luật | Nguồn |
|---|---|---|
| Dùng lưới | `setUsesGrid` | `TH:132` |
| Ô xuất phát (campaign, đã được Mother Rachel chỉ đường) | Glimmering Woods tại `Pos 0 0` + 4 lá woods ở Bắc `Pos 0 (-1)`, Đông `Pos 1 0`, Nam `Pos 0 1`, Tây `Pos (-1) 0` | `TH:203-210` |
| Ô xuất phát (khác) | một Woods ngẫu nhiên tại `Pos 0 0` (đặt "bỏ qua forced effect"), xáo Glimmering Woods vào phần còn lại rồi 4 lá quanh | `TH:211-224` |
| Standalone | Glimmering Woods bị loại hẳn khỏi bộ | `TH:189-190` |
| Deck Woods | các lá "Western Woods" (trừ Twisted Hollow, Glimmering Woods) xáo; bỏ 0/1/2 lá đầu tùy standalone / ≥3 người / ít hơn; phần dư thành deck | `TH:191-199` |
| Thêm lá khi lật | agenda 1 (Deepening Dark): sau khi MỘT location bị lật, rút lá từ deck đặt vào mọi ô trống kề (đủ 4 hướng, đến hết deck) | `DD:36-38`, `DD:84-91` |
| Agenda tăng (side B) | +1 Darkness; mỗi hang Dark đã lật mà trống bị LẬT ÚP LẠI (`UnrevealLocation`, vẫn nằm trên lưới); các lá Dark chưa lật được xáo vào 2 lá đầu deck; sau đó đặt thêm woods quanh vị trí có điều tra viên | `DD:51-70`, `DD:80-90` |
| Act 2 (Where's Bertie) side B | mọi location trừ Twisted Hollow bị gỡ khỏi lưới và xáo ngược vào deck Woods; The Twisted Hollow đặt `Pos 0 0`; 13 lá đầu deck đặt vào 13 vị trí cố định | `WB:38-60`, `WB:69-86` |
| Bố cục Act 2 | Hollow giữa; hàng `-1`: cột −2…2 (5 ô); hàng `0`: cột −1 và 1; hàng `1`: cột −2…2 (5 ô); hàng `2`: cột 0 | `WB:71-85` |
| Agenda 2 (Back to the Vale) | không đổi lưới (đã đọc; chỉ enemy, Darkness) | `Agenda/Cards/.../TheTwistedHollow/BackToTheVale.hs:39-81` |
| Codex Sigma (Dark Hollow) | gỡ các lá Dark trống khỏi lưới, 3 lá lên đáy deck có chèn The Twisted Hollow; hoặc bước 2: đặt woods quanh người chơi | `TH:353-380` |
| Kích thước tối đa | Act 1: không có trần cứng, nở theo deck. Act 2: 5 cột × 4 hàng (hàng −1…2, cột −2…2) | `WB:71-85` |
| Kết nối | adjacency lưới mặc định (kề cạnh); Crooked Path và Where's Bertie dùng `ConnectedFrom … UnrevealedLocation` | `Location/Cards/.../TheTwistedHollow/CrookedPath.hs:31-38`, `WB:32` |
| Mặt úp | lá Woods đặt vào lưới chưa lật; úp lại sau Deepening Dark (xem trên); dùng mặt úp Western Woods chung | `DD:60-66`; so ảnh `10612b` = `10621b` |
| Cố định vs xáo | Hollow cố định ở giữa (Act 2); Glimmering Woods cố định ở giữa nếu có Rachel dẫn đường; còn lại xáo | `TH:203-224`, `WB:56-58` |
| Trạng thái hình ảnh | Dark (trait in ra từ lá), Darkness Level (token trên scenario); mức tối càng cao nên nền tối hơn (tùy chọn) | `TH:91`, `DD:46-48` |
| Day/night | màn này không có biến thể ngày/đêm (không đọc `getCampaignDay` ở file này) | `TH` toàn file |
| Return to | chưa tìm thấy bản Return to cho Hemlock Vale (chưa grep) | CHƯA kiểm |

## Danh sách sprite (10 + 1 mặt úp + 1 nền)

Chi tiết trong [asset-plan-for-codex.md](asset-plan-for-codex.md): `10612`–`10621` (Glimmering Woods, Blighted Glade, Poisoned Marsh, Fecund Thicket, Mushroom Grove, Moonlit Clearing, Crooked Path, Corpse Grove, Bear Den, The Twisted Hollow), `back` Western Woods, nền `hemlock-vale/twisted-hollow-woods.webp`.

## Phases

| # | Phase | Ai làm | File |
|---|---|---|---|
| 1 | Toàn bộ ảnh | Codex (người dùng giao) | [asset-plan-for-codex.md](asset-plan-for-codex.md) |
| 2 | Tích hợp code, test, kiểm trình duyệt, dọn tranh cũ | Claude | [phase-02-code-integration.md](phase-02-code-integration.md) |

## Tiêu chí hoàn thành

- `10605` không còn tranh có location vẽ sẵn; tranh cũ vào `archives/`.
- Mỗi Woods hiện sprite theo tranh lá khi đã lật, mặt úp Western Woods khi chưa lật hoặc bị lật úp lại.
- Sau Deepening Dark, lá Dark trống chuyển về mặt úp; sau Act 2 lưới đúng 5×4 quanh Twisted Hollow.
- Test + `vue-tsc` pass; contact sheet đã duyệt; đã xem trên trình duyệt (`localhost:8090`, tài khoản của người dùng).

## Đã kiểm vs chưa kiểm

Đã kiểm (đọc code): toàn bộ bảng; so ảnh mặt úp (Western Woods giống hệt nhau).

CHƯA kiểm: `locationLayout`/`connectedLocations` thật; việc `shuffleCardsIntoTopOfDeck` trong `DD:62` có thật sự gỡ các lá Dark chưa lật khỏi lưới hay chỉ xáo bản sao (chưa đọc `shuffleCardsIntoTopOfDeck`); hướng hiển thị: backend đặt "Bắc" ở `Pos 0 (-1)` (hàng thấp) trong khi `GridUp` thuộc hướng +y; cần xem card mode để biết frontend lật trục hay không; Return to.

## Rủi ro / câu hỏi mở

1. Lá bị lật úp lại sau khi đã lật: sprite phải đổi từ mặt lá sang mặt úp trên cùng ô; kiểm `revealed` cập nhật từ state thật.
2. Crooked Path có tranh gần giống mặt úp: sprite phải chi tiết hơn mặt úp (đã ghi trong asset plan) để người chơi phân biệt lá đã lật.
3. Act 2 gỡ toàn bộ lưới rồi dựng lại cùng lúc: `compactGridLayout` phải nhận layout mới mà không để sprite cũ nhấp nháy.
4. Lưới Act 1 nở không giới hạn cả bốn hướng (tọa độ âm); xác nhận compact xử lý.
5. Có nên làm tối nền khi Darkness Level tăng (không nằm trong asset plan; để mở).
