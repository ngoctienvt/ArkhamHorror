---
title: "Tối ưu UI/UX scene map cho iPad và máy tính bảng"
description: "Làm scene map chơi được bằng ngón tay: vùng chạm đủ lớn, không cần hover, bố cục vừa màn hình iPad, có zoom/pan và kéo thả không bị vô tình"
status: in-progress
priority: P1
created: 2026-11-08
branch: feat/tablet-scene-map
---

# Tối ưu UI/UX scene map cho iPad và máy tính bảng

## Vấn đề hiện tại (đã đối chiếu với code)

Scene map hiện chỉ có một mốc responsive là `max-width: 800px`, tức là dành cho điện thoại. iPad ở chiều ngang (1024 đến 1366 px) và hầu hết iPad chiều dọc (810 đến 834 px) rơi vào bố cục desktop với chuột. Cụ thể:

1. **Vùng chạm nhỏ.** Chỉ có `LocationMarkerPlate.vue:155` nâng nút lên 44px, và chỉ khi `max-width: 800px`. Ngoài mốc đó: nút ⓘ `20×20`, `.main` cao 22px, nút `.go` cao khoảng 20px, `.close` của info card khoảng 20px, `.link-chip` padding 1px, nút `.view` trên thanh map cao khoảng 24px, nút `.eye` của seat card rất nhỏ. Apple khuyến nghị tối thiểu 44pt.
2. **Phụ thuộc hover.**
   - Xem trước thẻ khi rê vào ⓘ: `LocationMarkerPlate.vue:75` (`mouseenter/mouseleave/focus/blur`). Trên cảm ứng, chạm vào ⓘ không hiện preview ổn định.
   - Tay bài nâng lên bằng `.slot:hover` ([LocationHand.vue:48](../../frontend/src/arkham/components/LocationHand.vue)). Bài chỉ lộ 60%, chạm không nâng được.
   - Chi tiết seat hiện bằng `.seat:hover .detail` ([SceneSeatCard.vue:117](../../frontend/src/arkham/components/SceneSeatCard.vue)).
   - Tooltip `title=` cho shroud, clue, doom trên plate và info card không hiện trên iPad.
   - `CardOverlay.vue:178` đã có `matchMedia('(hover: none) and (pointer: coarse)')`, nên có sẵn mẫu để dùng chung.
3. **Kéo thả dễ bị kích hoạt nhầm và chặn cuộn.** [useMapDrag.ts:19](../../frontend/src/arkham/composables/useMapDrag.ts) dùng ngưỡng 5px, quá nhỏ cho ngón tay. `.node.draggable`, `.connection-arrow.draggable` và `.fig` đều `touch-action: none`, nên chạm lên plate hay figure là mất cuộn trang. Không có cách nào phân biệt "kéo để xếp lại bố cục" với "chạm để chọn".
4. **Chật chội khi ba lớp phủ cùng mở.** Action panel rộng 300px bên phải, team slot 242px bên trái, info card 290px (`rightGap` 300). Trên iPad 1024 ngang, vùng map còn khoảng 480px. Trên iPad dọc 820 thì lớp phủ đè lên nhau. Bottom sheet của info card chỉ bật khi `max-width: 800px`.
5. **Không zoom/pan.** Bảng minh họa (`illustratedBoard`) bị ép vừa khung (`overflow: hidden`), plate và figure nhỏ đi theo. Người chơi không phóng to được khu vực mình quan tâm. Cutaway không có cách nào né plate che hình.
6. **Chi tiết thiết bị.** `index.html` chưa có `viewport-fit=cover`, nên không dùng được `env(safe-area-inset-*)` cho tay bài cố định ở đáy (`z-index: 900`) và thanh home của iPad. Chưa chặn double-tap zoom, text selection, callout khi nhấn giữ.

## Mục tiêu

Chơi trọn một lượt (di chuyển, điều tra, xem thẻ địa điểm, đánh bài, chọn choice) trên iPad bằng tay, không cần chuột, không bị chạm nhầm, không có thành phần nào chỉ truy cập được bằng hover.

## Không làm (non-goals)

- Không đổi giao diện desktop có chuột. Mọi thay đổi bám theo `(pointer: coarse)` hoặc kích thước, desktop giữ nguyên.
- Không viết lại card board (`Location.vue`) hay phần còn lại của `Scenario.vue`. Chỉ scene map và những gì nó dùng chung.
- Không làm app native, không làm hỗ trợ bút Apple Pencil riêng.

## Phases

| # | Giai đoạn | Trạng thái |
|---|---|---|
| 1 | [Nhận diện cảm ứng và token kích thước](./phase-01-touch-detection-tokens.md) | Code xong, test node + tc qua, chưa thử trên iPad |
| 2 | [Vùng chạm và cỡ chữ](./phase-02-touch-targets.md) | Code xong, chưa thử trên màn hình |
| 3 | [Thay hover bằng chạm](./phase-03-no-hover-dependency.md) | Code xong, chưa thử trên màn hình |
| 4 | [Bố cục cho iPad dọc và ngang](./phase-04-tablet-layout.md) | Code xong, chưa thử trên màn hình |
| 5 | [Zoom/pan và kéo thả bằng cử chỉ](./phase-05-gestures-zoom-drag.md) | Code xong, test logic qua, chưa thử trên màn hình |
| 6 | [Kiểm tra trên thiết bị giả lập và iPad thật](./phase-06-verify.md) | Kiểm tra tự động xong; thử trên iPad chưa làm |

Thứ tự phụ thuộc: phase 1 trước tất cả. Phase 2 và 3 sửa các file khác nhau (2: plate, info card, panel, thanh map; 3: preview, hand, seat) nên làm song song được sau phase 1. Phase 4 cần xong 2 để biết kích thước thật của từng khối. Phase 5 độc lập về file (`useMapDrag.ts`, canvas) nhưng nên làm sau 4 vì zoom ảnh hưởng toạ độ stage. Phase 6 làm cuối, và kiểm nhanh sau mỗi phase.

## Thiết bị mục tiêu (CSS px)

| Máy | Dọc | Ngang |
|---|---|---|
| iPad mini 6 | 744×1133 | 1133×744 |
| iPad 10.2 | 810×1080 | 1080×810 |
| iPad Air 11" / Pro 11" | 820×1180 / 834×1194 | 1180×820 / 1194×834 |
| iPad Pro 12.9" | 1024×1366 | 1366×1024 |
| Android tablet phổ biến | 800×1280 | 1280×800 |

Ưu tiên cao nhất: 1080×810 và 1180×820 (ngang, vì chơi bài thường đặt máy ngang) và 820×1180 (dọc).

## Tiêu chí hoàn thành

- [ ] Mọi phần tử bấm được trong scene map có vùng chạm tối thiểu 44×44 px khi `pointer: coarse`, kể cả khi người chơi đặt `--location-scale` nhỏ trong Settings.
- [ ] Không có thông tin hay thao tác nào chỉ lộ ra qua `:hover`, `mouseenter` hoặc `title=` trên thiết bị cảm ứng.
- [ ] Ở 1080×810 ngang, mở cả action panel, team slot và info card vẫn còn vùng map nhìn rõ (ít nhất 50% chiều rộng) và không có lớp phủ nào đè lên lớp khác.
- [ ] Ở 820×1180 dọc, info card và action panel là bottom sheet / drawer (action panel mặc định mở ở dạng thấp), không che nút của map bar.
- [ ] Kéo thả plate, figure, mũi tên chỉ xảy ra khi đang bật nút "Sắp xếp". Khi tắt, vuốt một ngón trên plate vẫn cuộn được trang.
- [ ] Có pinch-zoom, kéo hai ngón để pan, chạm hai lần để về vị trí mặc định trên bảng minh họa và map dạng node (không áp cho cutaway The Gathering). Có nút "reset zoom" cho người không dùng cử chỉ.
- [ ] Tay bài không bị thanh home che, chạm một lần để nâng bài, chạm lần nữa (hoặc nút) để chơi.
- [ ] Desktop có chuột nhìn và hoạt động y như trước (so ảnh chụp trước/sau ở 1440×900).
- [ ] `npm test`, `npm run lint` và build vẫn qua. Có test node cho phần logic thuần (nhận cử chỉ, chọn mức scale).

## Rủi ro

- Phần lớn phần tử trong `LocationMapCanvas.vue` định vị bằng phần trăm trên stage. Thêm lớp `transform: scale()` cho zoom làm lệch `getBoundingClientRect()` trong `beginDrag`. Phase 5 phải tính lại theo scale hiện tại.
- `CardOverlay.vue` đã có logic chạm riêng (`currentPointerType === 'touch'`). Cần đọc kỹ để không làm hai cơ chế đè nhau (phase 3).
- Không có iPad thật trong môi trường dev. Giả lập bằng Chrome DevTools không tái hiện được hành vi `touch-action`, callout, safe-area của Safari. Phase 6 cần một lượt thử trên máy thật.

## Câu hỏi chưa chốt

1. ~~Máy mục tiêu?~~ **Đã chốt: iPad nói chung**, không nhắm một đời máy. Hỗ trợ cả dải mini đến Pro 12.9" bằng breakpoint theo bề rộng và `pointer: coarse`, Safari là trình duyệt chính; safe-area xử lý sẵn để chạy được cả khi thêm vào màn hình chính.
2. ~~Kéo thả plate~~ **Đã chốt: dùng nút "Sắp xếp" bật/tắt** trên thanh map. Khi tắt, chạm và vuốt không bao giờ kéo plate/figure/mũi tên. Không dùng nhấn giữ.
3. ~~Zoom cho cutaway~~ **Đã chốt: không zoom cutaway The Gathering** (cutaway đã luôn vừa khung). Zoom/pan chỉ cho bảng minh họa và map dạng node.
4. ~~Action panel mặc định~~ **Đã chốt: mặc định mở**, cả iPad dọc lẫn ngang. Trên iPad dọc panel mở dưới dạng bottom sheet thấp (chỉ hiện hàng đầu và thanh nắm, kéo lên để xem hết) để không che map.
