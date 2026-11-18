# Phase 1: Sửa che khuất và nút không bấm được

Giải quyết A1, A4, A5, A6. Không đổi bố cục, chỉ sửa lỗi.

## File

- `frontend/src/arkham/components/LocationHand.vue` (biến `--hand-h`)
- `frontend/src/arkham/components/LocationMap.vue` (`.action-overlay`, `.zoom-controls`, thanh map)
- `frontend/src/arkham/components/LocationInfoCard.vue` (`max-height`)
- `frontend/src/arkham/components/LocationActionPanel.vue` (chân panel trên điện thoại)
- `frontend/src/arkham/components/CardOverlay.vue` (bỏ qua khi info card đang mở)

## Việc cần làm

1. **Tay bài che chân panel (A1).** `LocationHand.vue:37` trừ đi phần bài nhô lên (`0.4 * 1.4 * 130`) nên `--hand-h` chỉ là phần "nghỉ" 39px, trong khi dock thật cao 112px. Thêm biến thứ hai `--hand-cover` bằng chiều cao thật của dock. Trong `LocationMap.vue`:
   - `.action-overlay { bottom: calc(var(--panel-gap) + var(--hand-cover, 0px) - var(--hand-h, 0px)) }` để chân panel dừng ngay trên mép bài.
   - `.info-card` dùng cùng phép tính cho `max-height`.
   - Giữ `--hand-h` như cũ cho chiều cao `.location-map` để map không bị thu nhỏ.
2. **Team panel (A4).** Chuyển nút 👥 ra khỏi `.zoom-controls` vào nhóm công cụ của thanh map, cạnh Decks. Chỉ hiện khi ván có từ hai điều tra viên. Dùng chữ (`locationMap.team`) như các nút khác, không dùng emoji.
3. **Điện thoại: End turn bị tab người chơi che (A5).** Cho `.action-below .foot` `position: sticky; bottom: calc(var(--hand-cover) + chiều cao tab)` hoặc thêm `margin-bottom` bằng chiều cao thanh tab sticky. Đo chiều cao tab bằng biến CSS do `PlayerTabs.vue` đặt, không hard-code.
4. **Thẻ phóng to đè info card (A6).** Khi info card của một địa điểm đang mở, `CardOverlay` không hiện preview cho plate của chính địa điểm đó (info card đã có đủ chữ và ảnh thu nhỏ). Preview cho plate khác vẫn hoạt động.

## Kiểm tra

- Ở 1280×720, 1366×768, 1440×900: `document.elementFromPoint` tại tâm `.end-turn` trả về chính nút đó.
- Ván hai người: bấm Team trên thanh map, panel hiện và ẩn.
- 375×812: cuộn tới cuối panel, nút End turn không nằm dưới thanh tab.
- Bấm một plate: info card hiện, không có thẻ phóng to đè lên.

## Rủi ro

`--hand-cover` thay đổi theo số bài và cỡ bài trong Settings; phải lấy từ `ResizeObserver` sẵn có, không tính tay.
