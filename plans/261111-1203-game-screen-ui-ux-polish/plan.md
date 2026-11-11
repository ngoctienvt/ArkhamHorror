# Plan: Hoàn thiện UI/UX màn hình chơi (Scene map)

Status: draft — chờ duyệt · Branch: main · Ngày: 2026-11-11

## Mục tiêu
Màn hình chơi gọn, đồng nhất theme "Arkham tối + vàng đồng", dễ đọc, không chồng lấn. Người chơi nhìn 1 giây là biết: agenda còn bao nhiêu doom, act cần bao nhiêu clue, có thể advance chưa, đang chọn địa điểm nào, có thể làm gì.

## Phạm vi (các vùng trong screenshot)
| # | Vùng | File chính |
|---|------|-----------|
| A | Thanh mission (Agenda / Act / Thẻ tham chiếu) | `frontend/src/arkham/components/LocationMissionStrip.vue` (480 dòng) |
| B | Thanh tab (Bản đồ · Bảng bài · Hành động · Túi hỗn mang · Chú giải · Deck) | `LocationMap.vue` (bar), `LocationMapLegend.vue` |
| C | Popup xem lá bài + khung bản dịch (nền trắng) | `CardOverlay.vue` (1864 dòng — chỉ đụng phần panel dịch) |
| D | Panel địa điểm đã chọn bên phải ("Lớp Học K2") | `LocationActionPanel.vue`, `LocationInfoCard` |
| E | Tay bài + thanh điều tra viên dưới đáy | `LocationHand.vue`, thanh investigator |

Non-goals: không đổi logic game/backend, không đổi bản đồ isometric, không đổi nội dung dịch.

## Vấn đề hiện tại (từ screenshot + code)
**A. Mission strip — rối nhất**
1. Nguyên nhân gốc: thumbnail `float: right` + `.head` flex-wrap. Ô doom/clue nằm cạnh eyebrow, khi box doom "critical" (đỏ, nhiều dòng) hoặc hàng clue dài → bọc quanh float → tiêu đề 3 panel lệch 3 độ cao khác nhau (y≈270 / 250 / 242).
2. Box doom đỏ chen sát thumbnail, cảnh báo xếp dọc dưới pips → khối nặng, đè mắt.
3. Act: 2 pill giống nhau "Clue 0 / —" và "Advance Act" (đang disabled) → nhiễu. "/ —" vô nghĩa.
4. Thumbnail khác cỡ (92px ngang vs 50px dọc), lá attached nằm lạc góc dưới trái.
5. Flavor in nghiêng 3 dòng + scroll box 5.2em → chiếm chỗ, thanh cuộn nhỏ khó dùng.
6. Không giới hạn chiều cao: strip ăn ~230px/1080px, cướp diện tích bản đồ.
7. Sai ngữ nghĩa doom: pips đếm doom trên lá agenda, cảnh báo đếm `game.totalDoom` → có thể thấy 3/4 pips nhưng ghi "sắp advance".
8. Reference: lưới token 2 cột lẻ số dòng → ô cuối lệch; nền ô `#0003` lổn nhổn.

**B. Thanh tab** — nút rải đều cả bề ngang, không nhóm; "HÀNH ĐỘNG" active nổi bật nhưng "BẢN ĐỒ" cũng nền vàng → không rõ cái nào đang chọn. 3 tầng thanh trên cùng (site nav, toolbar game, tab) ăn ~110px.

**C. Card overlay** — panel dịch nền trắng chói, phá theme tối; khoảng trắng trống lớn dưới chữ; popup che giữa bản đồ và tay bài.

**D. Panel phải** — thứ bậc chữ yếu: tiêu đề địa điểm, trait, stats, khối "Hành động", flavor, "Cơ bản" cùng tông; hàng "Điều tra" có 2 icon hai đầu khó hiểu; "Lá bài in play" bị cắt, phải cuộn.

**E. Đáy màn hình** — tay bài bị cắt nửa dưới, chồng lên thanh Kate Winthrop; stat điều tra viên quá nhỏ.

## Design tokens dùng chung (Phase 0)
Gom màu đang hard-code rải rác (`#c6a873`, `#16221b`, `#ff7a64`, `#5fd88a`, `#9fd3e6` …) vào biến CSS ở `.location-map`:
- `--surface-0` nền strip / `--surface-1` panel / `--surface-2` ô con
- `--line` viền vàng mờ, `--line-strong`
- `--text`, `--text-muted`, `--text-flavor`, `--heading` (serif)
- `--accent-gold`, `--doom` (đỏ), `--clue` (xanh ngọc), `--ready` (xanh lá)
- Thang chữ: eyebrow 0.62rem, body 0.76rem, title 0.95rem serif; khoảng cách 4/8/12px; bo góc 6px; 1 loại shadow.
Mọi phase sau chỉ dùng token → hết lệch tông.

## Phases

### Phase 1 — Mission strip (ưu tiên cao nhất)
1. **Một khung chung cho cả 3 panel** (CSS grid, bỏ float):
   ```
   [eyebrow ............................ ][thumb]
   [Title (serif) ...................... ][thumb]
   [status row: meter ........ chip/nút ]
   [flavor 2 dòng (clamp)                ]
   [rules text                           ]
   [footer: action rows · attached cards ]
   ```
   Thumb mọi panel cùng chiều cao 56px (landscape 78×56, portrait 40×56), căn phải trên cùng. Tiêu đề 3 panel thẳng hàng.
2. **Status row riêng, full width**:
   - Agenda: pips (hoặc bar khi >14) bên trái + chip trạng thái 1 dòng bên phải ("Còn 2 doom", vàng → "Advance vòng tới", đỏ nhạt → "Sắp advance!", đỏ pulse). Pulse chỉ trên chip, không bọc cả box.
   - Doom ngoài lá agenda: hiển thị "+N trong play" nhỏ cạnh pips để meter và cảnh báo khớp nhau.
   - Act: clue pips/bar + nút Advance. Khi chưa đủ: nút ghost mờ, chữ "Cần N clue"; khi đủ: nút xanh pulse. Không biết max: chỉ hiện "◉ 0 clue", bỏ "/ —".
3. **Flavor**: `line-clamp: 2`, bấm để mở/thu (có `aria-expanded`), tooltip đầy đủ. Bỏ scroll box.
4. **Rules text / action rows**: action row dùng `--surface-2`, viền trái màu theo trạng thái (xanh dùng được / xám), không tô full nền xanh chói.
5. **Attached cards**: chuyển vào footer, cỡ 36px, kèm tên rút gọn khi hover.
6. **Reference panel**: cùng khung; token list 1 cột khi panel hẹp, 2 cột khi đủ rộng (`auto-fill`, minmax 220px); bỏ nền ô, dùng đường kẻ mảnh giữa dòng; icon token 22px.
7. **Ngân sách chiều cao**: strip tối đa ~150px ở 1920×1080; panel vượt quá → nút "Thu gọn / Mở rộng" toàn strip (nhớ trạng thái bằng localStorage, try/catch). Chế độ thu gọn: mỗi panel chỉ eyebrow + title + status row (≈56px).
8. **Responsive**: ≥1280px 3 cột (agenda 1fr, act 1fr, reference 0.8fr); 768–1279px agenda+act 1 hàng, reference xuống hàng dưới; <768px xếp dọc, mặc định thu gọn.
9. **Tách file** (480 dòng > 200):
   - `mission-strip-panel-shell.vue` — khung grid + thumb + flavor clamp
   - `mission-strip-doom-meter.vue` — pips/bar/chip/hiệu ứng
   - `mission-strip-clue-meter-advance.vue` — clue + nút advance
   - `mission-strip-reference-panel.vue` — thẻ tham chiếu, day/time, counters
   - `use-mission-strip-panels.ts` — `describe`, `doomLimit`, `clueLimit`, `actionRows`, `attachedTo`
   - `LocationMissionStrip.vue` giữ vai trò ghép.

### Phase 2 — Thanh tab
- Chia 3 nhóm: trái = chế độ xem (Bản đồ | Bảng bài) dạng segmented control; giữa = hành động chính (Hành động); phải = tiện ích (Túi hỗn mang, Chú giải, Deck) dạng nút ghost nhỏ.
- 1 kiểu active duy nhất: nền vàng đồng + chữ tối; inactive: viền mảnh, chữ vàng nhạt.
- Thêm nút thu gọn mission strip ở nhóm phải (liên kết Phase 1.7).
- Giữ hành vi gập "⋯" trên tablet dọc.

### Phase 3 — Card overlay / panel dịch
- Panel dịch theo theme tối: `--surface-1`, chữ `--text`, tiêu đề serif `--heading`, flavor `--text-flavor`, viền `--line`.
- Chiều cao panel = vừa nội dung (không kéo dài bằng ảnh), căn trên với ảnh lá bài.
- Vị trí popup: ưu tiên không che vùng địa điểm đang hover và tay bài (đặt cạnh con trỏ, giới hạn trong viewport).
- Chỉ sửa CSS/vị trí khối panel dịch trong `CardOverlay.vue`; scout kỹ trước vì file 1864 dòng.

### Phase 4 — Panel địa điểm bên phải
- Thứ bậc: Tên (serif lớn) → trait nghiêng nhỏ → hàng stats (shroud, clue, VP) dạng chip → khối "Hành động" của địa điểm (viền trái vàng) → flavor (clamp 2 dòng) → nhóm "Cơ bản".
- Nhóm "Cơ bản": lưới 2 cột cho Nhận tài nguyên / Rút bài; "Điều tra" full width nút chính, icon kỹ năng giải thích bằng tooltip; "Kết thúc lượt" tách xuống cuối, kiểu nút cảnh báo nhẹ.
- Header (tên + nút đóng) sticky; nội dung cuộn bên dưới để "Lá bài in play" không bị cắt cụt.

### Phase 5 — Tay bài & thanh điều tra viên
- Đảm bảo `--hand-h` cộng đúng chiều cao thanh investigator để tay bài không chồng lên.
- Tay bài: lá hiện ≥70% chiều cao khi nghỉ, hover nâng lên đủ lá.
- Thanh investigator: tăng cỡ số stat (≥0.85rem), icon màu theo kỹ năng, khoảng cách đều.

### Phase 6 — Kiểm thử & đánh bóng
- Chụp trước/sau ở 1920×1080, 1366×768, tablet dọc 768×1024.
- Trạng thái cần kiểm: agenda critical; act đủ clue (nút advance sáng); max clue không rõ; doom >14 (bar); có lá attached vào agenda; thẻ tham chiếu mặt Khó; Hemlock Vale day/time + counters; homebrew reference; strip thu gọn; `prefers-reduced-motion`.
- `npm run build` / type-check frontend sạch.

## Không được làm hỏng
- `data-image` / `data-card-code` trên thumb và lá attached (CardOverlay hover dựa vào đây).
- Mọi đường `emit('choose', index)`: advance, action row, AbilityButton.
- Hiệu ứng pip gain/loss, delta "+1/−1", tôn trọng reduced-motion.
- Bar fallback khi max >14; parse homebrew reference; REFERENCE_TEXT_VI.
- Layout tablet (`data-layout='tablet-portrait'`, sheet panel).

## Thứ tự & phụ thuộc
Phase 0 → Phase 1 (lớn nhất, tác động mạnh nhất) → Phase 2 (nút thu gọn phụ thuộc P1) → Phase 3, 4, 5 độc lập nhau → Phase 6.

## Tiêu chí hoàn thành
- Tiêu đề 3 panel thẳng hàng; strip ≤150px ở 1080p; không còn nền trắng; không phần tử nào chồng lấn/bị cắt ở 3 kích thước; meter doom và cảnh báo luôn khớp số.

## Câu hỏi chưa giải quyết
1. Các thuật ngữ "Agenda", "Act", "Advance Act", "Clue", "Doom" trong bản vi đang để tiếng Anh — giữ nguyên có chủ đích hay dịch (vd "Âm mưu", "Màn", "Tiến màn", "Manh mối")?
2. Strip mặc định mở hay thu gọn trên desktop?
3. Có muốn giảm 3 tầng thanh trên cùng (site nav + toolbar + tab) thành 2 không? Việc này đụng layout ngoài màn chơi.
