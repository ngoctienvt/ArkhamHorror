# Phase 3: Thanh điều khiển và mission strip co giãn

Giải quyết A2, A3, C2. Cần phase 2.

## Thanh map

Hiện tại thanh map được teleport vào `#game-bar-scene-slot` trong game bar. Slot này là phần còn lại sau bảy nút của game bar (Campaign, View, Settings, Debug, Undo, Fit to screen, File Bug), nên ở 1024px chỉ còn 287px và ở điện thoại còn 0–17px.

### Thiết kế

Xếp nút theo mức ưu tiên, ẩn dần vào menu ⋯ khi thiếu chỗ:

| Ưu tiên | Nút | Luôn hiện |
|---|---|---|
| 1 | Map / Card board (segmented) | có |
| 1 | Actions (kèm badge số lựa chọn chờ) | có |
| 2 | Decks | khi đủ chỗ |
| 3 | Team, Legend, Weather, Reset layout, Expand text, Arrange, gập mission strip | vào ⋯ trước |

- Đo bề rộng slot bằng `useElementSize`. Nếu slot hẹp hơn tổng bề rộng nhóm ưu tiên 1 (khoảng 260px), **không teleport**: thanh map tự đứng một hàng riêng phía trên mission strip (đúng như Fit to screen đang làm).
- Mở rộng `collapsedBar` từ "chỉ tablet dọc" thành "khi nhóm công cụ không vừa". Nhóm ưu tiên 3 vào ⋯ trước, Decks vào sau.
- Điện thoại: thanh map luôn là hàng riêng, ba nút ưu tiên 1 chia đều bề rộng, phần còn lại trong ⋯.
- Menu ⋯ đóng khi bấm ra ngoài và khi nhấn Escape (hiện chỉ đóng khi bấm vào map).

Game bar tự vỡ trên điện thoại (cao 100px, chữ rải rác) là lỗi của `Game.vue`, nằm ngoài scene map. Plan này chỉ bảo đảm thanh map không phụ thuộc vào nó; ghi lại để xử lý riêng.

## Mission strip

Hiện ba thẻ Agenda / Act / Reference tự xuống dòng, cao từ 69px (1920) tới 202px (điện thoại).

### Thiết kế

- `wide`: giữ như hiện tại, một hàng.
- `medium`: ép một hàng (`flex-wrap: nowrap`), tiêu đề cắt bằng dấu ba chấm, thẻ Reference chỉ còn các token và biểu tượng (tên scenario đã có ở log và tiêu đề trang). Cao tối đa 64px.
- `narrow` và điện thoại: ba chip trên một hàng, mỗi chip gồm nhãn ngắn và số quan trọng (Agenda: doom/ngưỡng; Act: clue/ngưỡng; Reference: biểu tượng). Bấm chip mở thẻ đầy đủ dạng popover. Cao tối đa 48px, hoặc 96px nếu nút Advance Act đang sẵn sàng (hiện thêm một hàng cho nút đó).
- Nút Advance Act khi sẵn sàng phải luôn nhìn thấy ở mọi dạng, không bị giấu sau chip.

## File

- `frontend/src/arkham/components/LocationMap.vue` (thanh map, điều kiện teleport, menu ⋯)
- `frontend/src/arkham/components/LocationMissionStrip.vue`, `MissionStripPanel.vue`, `MissionStripReference.vue`, `MissionStripMeter.vue`
- `frontend/src/locales/*.json` nếu cần nhãn ngắn cho chip

## Kiểm tra

- 1024×768 có log mở: không nút nào chồng lên nút khác (so `getBoundingClientRect` từng cặp).
- 375×812: ba nút Map / Card board / Actions nằm trọn trong màn hình, mỗi nút cao từ 44px.
- Mission strip: đo chiều cao ở 8 kích thước, khớp bảng trên.
- Agenda sắp đầy doom và Act đủ clue vẫn hiện trạng thái cảnh báo ở dạng chip.

## Rủi ro

Mission strip còn chứa thẻ ngoài map (`MissionStripOffMap`), thumbnail đính kèm và sprite cho các scenario dạng đảo. Dạng chip phải có chỗ cho chúng, tối thiểu là một chip "+N" mở popover.
