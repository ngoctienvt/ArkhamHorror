# Phase 2: Tích hợp code (frontend): The Thing in the Depths

Status (2026-11-13): A, C, E đã làm (76 test + vue-tsc pass). Còn D: xem trên trình duyệt.

## A. Sprite

1. `scene-island-sprites.ts`: bộ `thingInTheDepths`. Faces: 7 đất `10593`-`10599` và 7 nước hở `10593b`-`10599b`; mọi lá luôn ngửa (cho cả 14 vào `alwaysFaceUp`). `square: new Set()`; `spot` là một file có sẵn (ví dụ `10593b`) vì màn không có ô trống để đặt thẻ.
2. Giải bài `baseCode` (xem plan.md): phân biệt `a` và `b`, giữ các bộ khác không đổi.
3. Đăng ký `'img/scenes/hemlock-vale/thing-in-the-depths'` trong `ISLAND_SETS`. Trong `hemlock-overview.ts` thêm `THING_IN_THE_DEPTHS_ISLANDS`, `['10588', …]` vào `ISLAND_FOLDERS`, và đổi `boards['10588']` sang `hemlock-vale/thing-in-the-depths-swamp`.
4. Xóa `boardAnchors['hemlock-vale/thing-in-the-depths']`, hằng `OPEN_WATER_CARDS`, và khối `.open-water` (template + CSS) trong `LocationMapCanvas.vue`.

## B. Lưới và đường nối

3×3 cố định nên ô lớn. Kiểm sprite không chồng lên plate, và đường nối giữa hai ô kề đọc rõ.

## C. Test

Thêm test (mẫu `tests/longestNightDynamicScene.test.mjs`): `islandImage` cho 7 lá `a` và 7 lá `b`; file sprite tồn tại và là WebP; `hemlockOverview('c10588','c10588')` trả `islands` đúng, `anchors` rỗng. Chạy:

```bash
cd frontend && node --test tests/hemlockOverview.test.mjs tests/locationGraph.test.mjs tests/sceneIslandSprites.test.mjs tests/longestNightDynamicScene.test.mjs && npx vue-tsc --noEmit
```

## D. Trình duyệt

`localhost:8090`, tài khoản người dùng: đủ 9 ô; lá lật đổi sang sprite nước; không bấm hộ trong ván thật.

## E. Dọn

Chuyển `hemlock-vale/thing-in-the-depths.webp` vào `archives/thing-in-the-depths-static-board.webp` sau khi `grep` không còn chỗ dùng (đổi dòng `'10588': …` trong `tests/hemlockOverview.test.mjs`). Thêm màn vào danh sách mẫu ở `.agents/skills/arkham-dynamic-grid-scene/SKILL.md` §1.

