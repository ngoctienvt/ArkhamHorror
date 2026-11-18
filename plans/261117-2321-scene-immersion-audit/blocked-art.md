# Hai gói ảnh còn bị chặn

Ngày 18/11/2026, built-in GPT Image trả HTTP 429 `usage_limit_reached` ở cả hai batch mới. Không có file nào của hai batch được xuất; đã gỡ mọi đường dẫn tới ảnh chưa tồn tại. Không chuyển Gemini/API CLI. Đây là phần CHƯA HOÀN THÀNH của plan, không phải phần được người dùng cho phép bỏ.

## Dead Heat

Đã hiệu chỉnh năm địa danh và các mã Abandoned trong `scene-dead-heat.ts`. Chưa có biến thể ngày/đêm/dây leo/lửa; hiện giữ ảnh ngày cũ.

Nguồn đã đọc: `Scenario/Scenarios/TheScarletKeys/DeadHeat.hs`, `Location/CardDefs/TheScarletKeys/DeadHeat.hs`, các ảnh lá `references/09521b.png`, `09524b.png`, `09525.png`.

Trigger đã khóa:

- Đêm từ Agenda 1B (`sequence.step === 1` và side B/flipped), hoặc bước Agenda > 1.
- Dây leo theo Act 3 `09525`: lời dẫn nói dây leo phủ đường phố. Act 2B có hai nhánh; KHÔNG giới hạn dây leo vào riêng nhánh Razin.
- Nhánh đánh bại Amaranth ở Act 2B làm cháy tàn tích nghi thức/các thi thể trong Bahia Palace Gardens. Amaranth `09537b` là dấu hiệu công khai của nhánh này; đối chiếu lưu trạng thái lâu dài trước khi chỉ dùng sự hiện diện enemy.
- Razin `09538` được đặt ở vườn ở nhánh còn lại. Không vẽ lửa trên cả thành phố hoặc cháy từ một địa điểm ngẫu nhiên.

Tạo từ `frontend/public/img/scenes/the-scarlet-keys/dead-heat.webp`, giữ nguyên camera/địa hình. Tối thiểu ba bản `dead-heat-night.webp`, `dead-heat-vines.webp`, `dead-heat-night-vines.webp`; sau đó hai bản vườn cháy cùng camera và ánh sáng tương ứng hoặc sprite lửa cục bộ có alpha. Không ghép mảng ngày vào ảnh đêm.

Prompt nền: “Edit this Arkham scene map, exact same 16:9 framing and camera, preserve all five places at exactly the same coordinates. Historical Marrakesh 1920s painted game illustration. No text, no UI, no new landmarks. Entire buildings remain framed. Palace garden upper-right, train station upper-middle, tombs upper-left, square bottom-middle, tannery bottom-right.”

Thêm cho đêm: “Change only time of day to deep moonlit blue night, legible warm lamps in windows. No vines, no flames.”

Thêm cho dây leo: “Unnatural dark thorny vines choke and wind along city streets and courtyards across the image. Keep streets readable and every landmark intact. No flames.” Giữ ngày cho bản vines, đổi đêm cho night-vines.

Thêm cho nhánh lửa: “A small toppled ancient brazier has ignited ritual remnants inside the upper-right palace garden. Visible local fire and smoke within that garden only. Preserve surrounding streets, tombs, station, tanneries, and camera.”

## Fate of the Vale

Hiện giữ artwork và nhánh làng ban đêm sẵn có. Chưa tích hợp sprite Mirror Nest/Abyss mới vì batch tạo chúng bị chặn. Không để lại module thử nghiệm trỏ file thiếu.

Nguồn: `Scenario/Scenarios/TheFeastOfHemlockVale/FateOfTheVale.hs`, `Act/Cards/TheFeastOfHemlockVale/FateOfTheVale/LostSelf.hs`, `Location/CardDefs/TheFeastOfHemlockVale/FateOfTheVale.hs`, `HorrorsInTheRock.hs`.

- `cosmicEmissaryLayout`: bốn Mirror Nest xáo mã `10666..10669` quanh trung tâm; cave labels có thể được điền sau. Các lá Nest cùng tranh (đã xem 10666/10667; xem tiếp 10668/10669 trước khi dùng chung).
- `abyssRevealedLayout`: Abyss `10670` chiếm vùng giữa nhiều ô. Dùng tâm vùng lặp nhãn thật, không dùng bốn vị trí khác nhau cho một location.
- Nhánh `hemlockValeLayout` có `diamond` bỏ Nest/caves và về làng đêm. Giữ selector làng hiện tại.
- Hang `10716..10720` đã có sprite dùng chung trong `hemlock-vale/silent-heath/`; Dry Burrow quantity 2, giữ riêng ID. Lá úp dùng `cavern-back`.
- Emissary và Abyss story không phải location JSON thông thường. Tránh tạo location giả; giữ giao diện tương tác hiện hữu.

Tạo ba sprite RGBA 3:2, chừa đủ viền/đáy, phong cách isometric painted cosmic horror, không chữ/thẻ/UI/nhân vật:

1. `hemlock-vale/fate/nest.webp`, tham chiếu `references/10666.png`: “A mirror nest: jagged black and violet crystalline cavern ledge, enormous faceted pink-blue prismatic crystal above a walkable clear rock floor, twisting bare black branches and iridescent mist. Entire ledge and lower rock tip fully framed on transparent background.”
2. `hemlock-vale/fate/abyss.webp`, tham chiếu `references/10670.png`: “Spiraling Oblivion: an oval supernatural teal-white vortex of whirling fractured light and dark shreds surrounded by black floating rock, with an empty central entry platform. No humanoid silhouette. Entire sprite on transparent background.”
3. `hemlock-vale/fate/back.webp`: “An unknown mirror nest: neutral shadowy jagged black crystal rock ledge with low dull purple mist, open unobstructed floor. No identifying central crystal or portal. Entire sprite on transparent background.”

Sau khi tạo: tích hợp `tiledScene`, nền cosmos trống đã có, thêm tests shuffled nests/cavern backs/duplicate Dry Burrow/Abyss lặp ô/về làng/Undo; kiểm Chrome cả hai bố cục. Chỉ đánh dấu plan complete khi hai gói trên xong và qua checks.
