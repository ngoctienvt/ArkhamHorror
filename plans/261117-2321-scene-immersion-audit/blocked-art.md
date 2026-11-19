# Hai gói ảnh cuối — đã hoàn tất 19/11/2026

Trạng thái: đã tạo, xuất và tích hợp. Hai lần thử ngày 18/11 từng bị HTTP 429 `usage_limit_reached`; lần tiếp tục sau 00:03 ngày 19/11 tạo ảnh thành công. Không còn phụ thuộc hạn mức ở hai gói này. Nguồn PNG và WebP có trong `generated-art.json`.

## Dead Heat

Giữ năm điểm địa danh và cặp mã Abandoned trong `scene-dead-heat.ts`. Thêm bốn tài sản:

- `the-scarlet-keys/dead-heat-night.webp`.
- `the-scarlet-keys/dead-heat-vines.webp`.
- `the-scarlet-keys/dead-heat-night-vines.webp`.
- `the-scarlet-keys/dead-heat-garden-fire.webp` (sprite RGBA, cùng lửa tự phát sáng dùng được cả ngày/đêm).

Đêm từ Agenda 1B (side B hoặc flipped), hoặc Agenda bước >1. Dây leo theo Act 3 `09525`, độc lập thời điểm trong ngày. LayoutArt chung giữ camera/zoom và điểm location qua các biến thể.

Act 2B có hai nhánh. Nhánh đánh bại Amaranth lật/ReplaceEnemy sang `09537b` sau khi đổ brazier, nên chỉ nhánh đó thêm lửa trong Bahia Palace Gardens. Nhánh đặt Razin `09538` không thêm lửa. Lửa là figure tại `[81,41]`, kích thước `[11,18]`; không phủ cả thành phố hay đè lên đài phun nước. Enemy cuối rời play kết thúc Act 3 và scenario, nên không lưu lịch sử cháy riêng trên client.

Nguồn đã đọc: `Scenario/Scenarios/TheScarletKeys/DeadHeat.hs`, `Act/Cards/TheScarletKeys/DeadHeat/RitualOfLifeAndDeath.hs`, `QueenOfNothingAtAll.hs`, `Enemy/Cards/TheScarletKeys/DeadHeat/AmaranthLurkingCorruption.hs`, `Location/CardDefs/TheScarletKeys/DeadHeat.hs`, ảnh lá trong `references/09521b.png`, `09524b.png`, `09525.png`.

Prompt nền: sửa ảnh Marrakesh 16:9, giữ camera/kiến trúc/năm địa danh; đêm ánh trăng xanh và đèn vàng. Hai bản dây leo thêm dây gai trên đường và tường nhưng giữ mọi đường đi và công trình đọc được, không cháy. Sprite lửa: brazier đồng đổ, tàn tích nghi thức và khói, không người/công trình/nền đất, alpha trong suốt, đủ viền cả đáy.

## Fate of the Vale

`scene-fate-of-the-vale.ts` dùng `tiledScene` theo snapshot. Thêm ba sprite RGBA, tất cả đủ viền/đáy:

- `hemlock-vale/fate/nest.webp`: tinh thể hồng xanh trên nền đá tím đen theo tranh lá.
- `hemlock-vale/fate/abyss.webp`: xoáy trắng xanh theo Spiraling Oblivion, không bóng người.
- `hemlock-vale/fate/back.webp`: nền đá tím trung tính cho Nest úp.

Đã xem cả bốn tranh `10666..10669`: cùng minh họa. Bốn Nest vẫn giữ ID và public layout label riêng. Hang `10716..10720` dùng sprite `silent-heath` sẵn có; hai Dry Burrow cùng mã không gộp ID. Hang úp dùng `cavern-back`.

`cosmicEmissaryLayout` giữ Nest quanh trung tâm, hang được thêm vào nhãn cave tương ứng. `abyssRevealedLayout` có `theAbyss` lặp trên 2×2 ô: ảnh Abyss một ID ở tâm vùng, `tileSpans` theo kích thước vùng thực. Canvas dùng cùng kích thước cho sprite, plate và clipping đường nối. Nhánh `hemlockValeLayout` có `diamond` trả về panorama làng đêm hiện hữu, không giữ sprite Nest/hang cũ. Không tạo location giả từ Emissary hoặc Story.

Nguồn: `Scenario/Scenarios/TheFeastOfHemlockVale/FateOfTheVale.hs`, `Act/Cards/TheFeastOfHemlockVale/FateOfTheVale/LostSelf.hs`, `Location/CardDefs/TheFeastOfHemlockVale/FateOfTheVale.hs`, `HorrorsInTheRock.hs`. Tham chiếu hình: `references/10668.png`, `10669.png`, `10670.png`.

Prompt sprite: isometric 3:2 painterly cosmic horror, PNG alpha, chừa đủ viền kể cả mũi đá dưới; không chữ/thẻ/UI/nhân vật. Nest là đá tinh thể tím, tinh thể khúc xạ lơ lửng phía sau sàn trống và cành đen. Abyss là xoáy trắng xanh trên nền đá đen. Back là sàn tím tối không tinh thể nhận diện/cổng.

## Kiểm chứng

78/78 tests stage/off-map/graph đã đạt sau tích hợp; typecheck và production compile đạt. Các preview cuối ở `previews/browser-complete-53.png` đến `61.png`; HTML có 62 fixture boards. Đã review nguồn selectors/renderer/backend bằng `ak-code-review`, không có lỗi runtime xác nhận. Chưa mount/playtest mọi ván Vue/backend; giữ giới hạn này khi nghiệm thu.