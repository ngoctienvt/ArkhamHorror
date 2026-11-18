---
title: "Gộp Hành động vào sidebar bên phải"
description: "Dùng chung sidebar trạng thái lượt, Hành động và Nhật ký trong Scene Map"
status: in-progress
priority: P1
effort: "3h"
tags: [scene-map, sidebar, frontend]
created: 2026-11-17
---

# Gộp Hành động vào sidebar bên phải

## Bố cục đề xuất

```text
┌───────────────────────────────┐
│ Giai đoạn · Lượt · Lời nhắc   │
├───────────────────────────────┤
│ Hành động                     │
│ Danh sách cuộn khi cần        │  ≈ 2/3 chiều cao
│ Còn N hành động · Kết thúc lượt│
├───────────────────────────────┤
│ Nhật ký cuộn riêng            │  ≈ 1/3 chiều cao
│ Ô nhập chat                   │
└───────────────────────────────┘
```

Tính tỷ lệ theo phần chiều cao còn lại sau khối trạng thái lượt. Nút sidebar của ván chơi thu hoặc mở cả Hành động và Nhật ký. Fit to screen cũng có nút này.

Áp dụng khi Scene Map đang dùng sidebar ghim bên phải. Ở bề rộng từ 800 px trở xuống, Nhật ký dùng ngăn kéo và bảng Hành động hiện trên hoặc dưới bản đồ. Yêu cầu xem địa điểm hoặc lựa chọn mới chỉ có trong bảng Hành động mở lại sidebar khi cần.

Kế hoạch dùng các kết quả đã có của [đợt chỉnh UI Scene Map](../261117-1055-scene-mode-ui-ux-polish/plan.md), gồm gộp xem địa điểm, bố cục theo vùng bản đồ và loại nút Kết thúc lượt lặp. Phần bố cục ghim desktop trong kế hoạch này dùng sidebar chung. Bố cục khi sidebar là drawer tiếp tục theo các quyết định về điện thoại và tablet của hai kế hoạch hiện tại.

## Phases

| # | Phase | Status |
|---|-------|--------|
| 1 | [Gắn bảng Hành động và kiểm tra bố cục](./phase-01-start.md) | Đã triển khai, đã thử trên trình duyệt với dữ liệu kiểm thử |

## Tiêu chí nghiệm thu

- [x] Với sidebar ghim đang mở, bảng Hành động nằm giữa trạng thái lượt và Nhật ký, chiếm khoảng hai phần ba vùng chia.
- [x] Danh sách dài có vùng cuộn riêng. Nút Kết thúc lượt và ô chat nhận click khi nhật ký trống.
- [ ] So số hàng thấy ngay và quãng cuộn với bố cục cũ trên cùng một ván có nhiều lựa chọn.
- [ ] Scene Map chỉ hiện một bảng Hành động. Chuyển chế độ, bật/tắt sidebar hoặc vào Fit to screen đều giữ đường truy cập lựa chọn và Kết thúc lượt.
