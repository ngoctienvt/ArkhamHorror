# Phase 1: Ảnh The Pallid Mask (giao Codex)

Làm theo skill `arkham-dynamic-grid-scene` §3. **Tổng 17 ảnh**: 15 sprite location + 1 mặt úp + 1 nền.

## Kết quả (2026-11-13)

- Đã xuất đủ 17 WebP theo đường dẫn ở dưới. Đã đọc lại từng file để kiểm tra định dạng và kích thước. Cả 16 sprite có alpha và góc trong suốt. Nền có kích thước 3344×1881.
- Đã đối chiếu vật thể chính, màu và bóng dáng ở kích thước khoảng 150 px. [Contact sheet](../../art-src/the-pallid-mask/review/sprites.jpg) · [So với tranh lá](../../art-src/the-pallid-mask/review/sprites-vs-cards.jpg).
- Dùng ImageGen tích hợp với từng tranh tham chiếu sau khi tự động duyệt chặn lệnh CLI. PNG nguồn nằm trong `art-src/the-pallid-mask/gen/`. Khi xuất, sprite được căn lại khoảng trống theo đường bao alpha. Bản gốc mặt úp là 1254×1254, WebP đúng 512×512.

## Đã chuẩn bị sẵn (`art-src/the-pallid-mask/`)

- `refs/<mã>.png`: tranh cả lá (750×1050); `refs/<mã>-art.png`: phần tranh đã cắt (750×430), dùng làm `--reference`. `refs/03247b.png`: mặt úp Catacombs.
- `notes.txt`: mỗi lá một dòng "vật thể chính + màu chủ đạo", đọc từ tranh thật.
- `mk_prompts.py` → `prompts/<mã>.txt`, `prompts/back.txt`, `prompts/background.txt`. Sửa prompt rồi chạy lại script.
- `review/refs-a.jpg`, `review/refs-b.jpg`: contact sheet các lá để đối chiếu.

## Quy tắc (yêu cầu cố định của người dùng)

1. Mỗi sprite dùng tranh lá thật làm reference; chữ chỉ bổ sung, tranh thắng khi mâu thuẫn.
2. Địa điểm chiếm 75–85% khung, 3:2, 1536×1024, nền trong suốt, không chữ/khung/người/watermark.
3. Mỗi lá một bóng dáng và một màu nhấn riêng. Cặp dễ trùng: Candlelit Tunnels / Stone Archways (cùng cam); Bone-Filled Cavern / Mound of Bones / Blocked Passage (đống xương).
4. Mặt úp: 1024×1024 vuông, đá trơn có mặt phẳng đủ rộng cho nhân vật, không điểm nhấn.
5. Nền: 16:9 1536×864, giữa ~60% tối và êm, không vật thể giống location, upscale ×2 (≥ 2560×1440), xóa watermark nếu có.

## Lệnh

```bash
python ~/.codex/skills/generate2dmedia/scripts/route_media.py image --route codex-cli \
  --prompt-file art-src/the-pallid-mask/prompts/<mã>.txt \
  --reference art-src/the-pallid-mask/refs/<mã>-art.png \
  --size 1536x1024 --out-dir art-src/the-pallid-mask/gen/<mã>-v1
```

- `--route` là `codex-cli` (không phải `local:codex-cli`). Mỗi lần ra thư mục mới (`-v2`…).
- **Lưu ý môi trường:** Codex CLI trên máy là 0.147.0, không biết cờ `sleep_tool` mà `scripts/cli_media.py` (`CODEX_DISABLED`) luôn tắt, nên route báo `Unknown feature flag: sleep_tool`. Hoặc nâng Codex lên 0.153+, hoặc chạy bản sao skill đã bỏ `"sleep_tool"` khỏi `CODEX_DISABLED`. Đã thử bản sao: chạy được và ra `generated.png` cho `03247` (ảnh thử đã xóa, chưa duyệt).
- Mặt úp: `--reference refs/03247b.png --size 1024x1024`. Nền: không reference, `--size 1536x864`.
- Lỗi đăng nhập/quota thì dừng và báo, không vẽ bằng code.

## Xuất file

| File | Định dạng |
|---|---|
| `frontend/public/img/scenes/the-path-to-carcosa/pallid-mask/<mã>.webp` (`03247`–`03257`, `52049`–`52052`) | WebP 768×512 q85 |
| `.../pallid-mask/back.webp` | WebP 512×512 q85 |
| `frontend/public/img/scenes/the-path-to-carcosa/the-pallid-mask-catacombs.webp` (nền) | WebP ≥2560×1440 q88 |

PNG gốc để ngoài `public/`.

## Duyệt trước khi tích hợp

1. Contact sheet ~150px rộng trên nền tối: gọi đúng tên từng lá không cần nhãn.
2. Đặt cạnh tranh lá thật: cùng vật thể chính, cùng màu chủ đạo.
3. Không hai lá trùng bóng dáng hoặc màu nhấn.
