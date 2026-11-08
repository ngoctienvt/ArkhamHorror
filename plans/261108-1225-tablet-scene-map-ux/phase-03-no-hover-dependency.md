# Phase 3: Thay hover bằng chạm

## Bối cảnh

Bốn chỗ trong scene map chỉ dùng được bằng chuột:

1. Xem trước thẻ khi rê vào ⓘ (`LocationMarkerPlate.vue:75`, các hàm `showPreview`/`hidePreview`).
2. Tay bài nâng lên khi `:hover` (`LocationHand.vue:48`). Chỉ lộ 60% lá bài, không đọc được trên iPad.
3. Chi tiết seat hiện khi `.seat:hover .detail` (`SceneSeatCard.vue:117`).
4. `title=` cho shroud, clue, doom, resource, hand trên plate, info card, seat.

`CardOverlay.vue` đã tách `currentPointerType === 'touch'` (dòng 299, 312) và bỏ qua hover khi chạm. Phase này phải thống nhất với nó, không làm hai preview chồng nhau.

## Việc làm

- **Preview thẻ địa điểm.** Khi coarse, chạm ⓘ mở **thẻ thông tin** (`LocationInfoCard`) hiện có, vì thẻ đã có đủ text, flavor, liên kết, action. Bỏ popup preview nổi trên touch (preview hiện chỉ lặp lại nội dung thẻ). Desktop giữ hover.
- **Tay bài.** Khi coarse, chạm một lần vào lá bài để nâng lên và hiện nguyên lá (bài khác hạ xuống); chạm ngoài hoặc chạm lại để hạ. Chơi lá bài bằng nút "Chơi" nổi cạnh lá được nâng (hoặc chạm lần hai), không dùng một lần chạm duy nhất để tránh chơi nhầm. Tuân theo `currentPointerType` của `CardOverlay.vue`, giữ tương thích với kéo thả bài nếu đã có.
- **Seat card.** Khi coarse, chạm vào seat để bật/tắt `.detail` (dùng class `open`, bấm ngoài thì đóng). Giữ hover cho chuột.
- **Tooltip `title=`.** Tạo component nhỏ `TapHint` hoặc thêm bước: chạm vào dải chỉ số trên info card mở danh sách giải thích (shroud, clue, doom, VP) dưới dạng chú thích inline. Trên plate, huy hiệu đã có biểu tượng; legend (`LocationMapLegend.vue`) làm nơi giải thích, đổi nó thành bật bằng chạm và đóng khi chạm ngoài (kiểm tra nó hiện dùng hover hay click).
- Đảm bảo mọi lớp phủ mới đóng được bằng chạm ra ngoài hoặc nút ✕ 44px, và `Esc` vẫn hoạt động cho bàn phím Bluetooth.

## File được sửa

`LocationMarkerPlate.vue`, `LocationHand.vue`, `SceneSeatCard.vue`, `LocationInfoCard.vue`, `LocationMapLegend.vue`, có thể đọc thêm `CardOverlay.vue` và `HandCard`.

## Kiểm tra

- Giả lập touch trong DevTools (bật Touch emulation), thực hiện: xem thẻ địa điểm, nâng bài rồi chơi, mở chi tiết seat, mở legend. Không bước nào cần hover.
- Test thủ công: không có preview nổi nào còn kẹt trên màn hình sau khi chạm.
- Desktop: rê chuột vẫn hiện preview và nâng bài như cũ.

## Rủi ro

Nâng bài bằng chạm là thay đổi hành vi nhạy cảm (có thể chơi nhầm lá). Cần bước xác nhận (nút Chơi) và thử nghiệm trên máy thật ở phase 6.
