# A Thousand Shapes of Horror (06168) Act 2: cầu thang vô tận xoay vòng

Status (2026-11-13): Đã xuất 8 asset và tích hợp hiệu ứng Endless Descent. Kết quả kiểm tra trong [handoff](../261112-2358-dream-eaters-scene-art/codex-handoff.md).
Act 1 (ngôi nhà) là tranh tĩnh, nằm trong plan cha (tranh #9).

## Vì sao tranh tĩnh không đủ

- Khi vào Act 2 (*Searching the Unnamable* lật), mọi location trong nhà bị gỡ; 5 trong 6 lá *Mysterious Stairs* xáo và xếp dọc `mysteriousStairs1` (trên) → `mysteriousStairs5` (dưới). Điều tra viên và The Unnamable đứng ở bậc trên cùng.
- Mỗi lần *Endless Descent* lộ ra: mọi người ở bậc trên cùng bị đẩy xuống bậc kế; bậc trên cùng **úp lại và chuyển xuống đáy**; các bậc còn lại dịch lên một nấc; nhãn đánh lại 1→5; các bậc chưa lật **xáo nhãn** với nhau.
- Vị trí 5 nhãn không đổi, nhưng lá ở mỗi nhãn liên tục đổi. Tranh có 5 bậc vẽ sẵn sẽ không cho thấy bậc nào đã lật, bậc nào vừa "trôi" xuống.

## Hướng làm

Neo theo nhãn trên một nền cầu thang chung (đủ dùng về luật) + sprite theo lá + hiệu ứng trượt khi xoay vòng để người chơi thấy cầu thang "trôi".

### Mỹ thuật (`img/scenes/the-dream-eaters/endless-stairs/`)

| Asset | Kích thước | Ghi chú |
|---|---|---|
| `bg.webp` | 1920×1080 | Giếng cầu thang xoắn vô tận nhìn nghiêng từ trên, đá cũ và gỗ mục chìm vào bóng tối ở cả trên lẫn dưới, **không** có chiếu nghỉ nổi bật, để 5 sprite đặt lên mà không trùng chi tiết vẽ sẵn. Cùng tông noir với tranh nhà Act 1 |
| `06183.webp` … `06188.webp` | 768×512 trong suốt | 6 Mysterious Stairs đã lật, vẽ theo tranh lá thật (skill dynamic-grid §3.2 A), mỗi lá một bóng dáng/màu nhấn |
| `back.webp` | 768×512 trong suốt | Mặt úp *Mysterious Stairs*: một đoạn cầu thang chìm trong sương, không chi tiết riêng |

Tạo qua Codex (`route_media.py image --route local:codex-cli`, lệnh mẫu ở [phase 1 plan cha](../261112-2358-dream-eaters-scene-art/phase-01-static-art.md)). **Mỗi sprite bậc kèm tranh lá của chính nó làm reference** (`assets.arkhamhorror.app/img/arkham/cards/06183.avif`…`06188.avif`); `back.webp` lấy mặt sau *Mysterious Stairs*; nền lấy 2–3 lá stairs làm reference phong cách để cùng chất liệu đá/gỗ.

### Code (chỉ frontend)

1. Hàm chọn tranh của plan cha: layout có `mysteriousStairs1` → nền `endless-stairs/bg` + chế độ sprite (`islands: 'img/scenes/the-dream-eaters/endless-stairs'`).
2. Vị trí: neo theo nhãn `mysteriousStairs1–5`, cột dọc lệch xoắn nhẹ (ví dụ x 50→42→58→44→56, y 12→86) cho có cảm giác giếng xoắn. Không dùng mã lá vì lá đổi ô mỗi lần xoay.
3. Sprite: lá đã lật → `<mã>.webp`; chưa lật → `back.webp`.
4. **Hiệu ứng xoay vòng.** Theo dõi map `locationId → nhãn` giữa hai lần state. Nếu mọi bậc dịch lên đúng 1 nấc và bậc 1 cũ thành bậc 5:
   - Bậc 2–5 trượt lên vị trí mới (`transition` ~500 ms).
   - Bậc 1 cũ mờ dần ở trên rồi hiện lại ở đáy (không cho nó bay xuyên qua cả cột).
   - Các bậc chưa lật đổi nhãn do xáo: chỉ cập nhật vị trí, không cần hiệu ứng riêng (mặt úp giống nhau).
   Nếu thay đổi không khớp mẫu này thì chỉ nhảy thẳng tới vị trí mới.
5. Test: chọn nền theo layout; anchor 5 nhãn; hàm nhận diện "xoay vòng" trả đúng với cặp state trước/sau mẫu (viết thành hàm thuần trong module riêng để test không cần Vue).

### Kiểm tra trên ván

- Act 1 → 2: tranh nhà đổi sang giếng cầu thang, 5 bậc đúng thứ tự card mode, mọi người ở bậc trên.
- Sau Endless Descent: bậc trên cùng úp lại và xuất hiện ở đáy; người chơi ở bậc 2 mới; sprite các bậc đã lật đi theo lá.
- Không bấm lựa chọn hộ người dùng.

## Tiêu chí hoàn thành

- Act 2 không dùng tranh nhà; 5 bậc luôn khớp nhãn server.
- Bậc đã lật hiện đúng tranh lá; bậc úp hiện mặt sau chung.
- Endless Descent có hiệu ứng trượt nhận ra được; trường hợp khác không vỡ layout.
- Test + typecheck pass.

## Quyết định

Đã triển khai hiệu ứng trượt và chuyển bậc trên cùng. Chế độ giảm chuyển động cập nhật ngay vị trí.
