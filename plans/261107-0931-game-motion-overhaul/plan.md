# Tối ưu toàn bộ animation/hiệu ứng của game: mượt, dễ chịu, dễ theo dõi

Trạng thái: đã triển khai phần lớn (2026-11-07), chưa commit. Xem mục "Kết quả triển khai" cuối file. Nhánh: `feat/location-map`. Phạm vi: `frontend/` (LCG). Backend không đổi.
Nối tiếp [auto-resolve combat effects](../261106-2230-auto-resolve-combat-effects/plan.md), nơi `FxLayer.vue` + `gameDeltaFx.ts` ra đời.

## Kết quả mong muốn

Mọi thay đổi trên bàn đều *nhìn thấy được nó đi từ đâu tới đâu*, theo đúng thứ tự, không chồng chéo:

- Click chọn card/ability: có phản hồi **ngay lập tức** (trước khi server trả lời), không còn cảm giác "bấm mà không biết đã nhận chưa".
- Đánh / bỏ / discard card: card bay từ tay tới đích thật (vùng play, discard pile, threat area, location), không biến mất rồi xuất hiện.
- Token di chuyển (clue từ location sang investigator, resource, doom, clue nộp cho act, uses trên asset): token bay từ nguồn sang đích.
- Trong một update có nhiều chuyện: chạy theo nhịp di chuyển → token chuyển chỗ → trúng đòn/số nổi → card hạ cánh, thay vì tất cả nổ cùng lúc.
- Autopilot chạy nhanh không làm hàng đợi animation phình ra; reduced-motion và các toggle hiện có được tôn trọng ở mọi nơi.

Không làm: đổi luật, sửa Haskell engine, đụng `frontend-3ed`, thêm thư viện animation mới (đã có `gsap` và View Transitions API).

## Hiện trạng (đã đọc source, chưa chạy ván thật)

Có **bốn hệ thống animation độc lập, mỗi cái một đồng hồ riêng**. Đây là gốc của cảm giác rối:

| Hệ thống | Chỗ | Làm gì | Vấn đề |
|---|---|---|---|
| Movement view transition | `views/Game.vue` `applyGameUpdate` (~1347) | `startViewTransition` khi placement investigator/enemy đổi | Chỉ xét investigator + enemy; card và token không tham gia |
| Overlay card flight | `Game.vue` `flyThenDismiss` (~698) + `cardFlight.ts` | Card bay từ DrawSpotlight / revelation về chỗ thật | Chỉ khi có overlay; card đánh từ tay không dùng |
| Hand transition-group | `components/Player.vue` `onEnter/onLeave` (~860) bằng gsap | Clone card bay giữa tay và vùng play của *cùng một* Player | Không tới discard/threat/location; 300ms cứng; animate `width` (gây reflow) |
| FX floaters | `components/FxLayer.vue` + `gameDeltaFx.ts` | Diff snapshot → số nổi, rung, lunge | Chỉ diff investigator/enemy/agenda; clue chỉ là số "+1 clue", không bay; đo DOM **sau** khi state mới đã render nên không biết vị trí nguồn |

Các lỗ hổng cụ thể khác:

- **Không có phản hồi khi chọn**: click → chờ round-trip → mới thấy gì đó.
- **Hai view transition chặn nhau**: `TokenPool.vue` (~271), `Draggable.vue` (~317) cũng gọi `startViewTransition`; gọi lần hai sẽ huỷ lần một.
- **FX chạy sau overlay**: update áp dụng khi `uiLock` đang giữ (DrawSpotlight, revelation) vẫn bắn floater phía sau overlay, người chơi không thấy.
- **Gate không thống nhất**: `FxLayer` chỉ xét `settings.combatFx`; dưới reduced-motion vẫn tạo floater và vẫn `holdFxBusy` → autopilot đợi hiệu ứng không ai thấy. `extraAnimations` (settings.ts ~245) là gate riêng.
- **Thời lượng rải rác**: 300 / 420 / 450 / 460 / 1100ms, easing khác nhau ở `components.css`, `base.css`, `FxLayer.vue`, `Player.vue`. Nhiều `transition: all` trong `SkillTest.vue`, `Question.vue`.
- **Hiệu ứng tốn GPU**: keyframe `fx-hit-*`, `fx-doom-pulse` animate `filter: drop-shadow/brightness` trên ảnh card.
- **Chaos token reveal** (`ChaosBag.vue`) gần như không có animation, dù đây là khoảnh khắc quan trọng nhất của skill test.

## Quyết định kiến trúc

**Một "director" duy nhất cho mỗi GameUpdate**, sở hữu toàn bộ timeline:

**State game được áp dụng ngay lập tức; chỉ phần hình ảnh được xếp nhịp.** Bàn chơi luôn bấm được theo state thật.

1. Trước khi gán `game.value`: chụp snapshot state cũ, tính danh sách sự kiện (pure, `gameDeltaFx.ts` mở rộng), và đo rect **chỉ cho nguồn sẽ biến mất** (card bị discard, enemy bị đánh bại).
2. Beat "di chuyển": **một** `startViewTransition` cho cả figure lẫn card đổi vùng, chạy đồng thời, tối đa `--motion-travel`. Không kéo dài view transition để chứa nhiều beat: trong lúc nó chạy người chơi chỉ thấy snapshot, còn click rơi vào DOM thật đã đổi. Guard một-chủ-sở-hữu để `TokenPool`/`Draggable` không huỷ nó.
3. Sau `transition.finished`: đo lại nguồn còn tồn tại (pool clue của location, vì map/tay có thể đã reflow), rồi phát các beat còn lại trên lớp overlay phía trên DOM thật: token transfer → trúng đòn + số nổi → pulse doom/clue. `holdFxBusy` phủ cả timeline.

Director sống trong module mới (`arkham/motion/`), không nhét thêm vào `Game.vue` 5450 dòng.

## Phase

| # | Phase | Xong khi |
|---|---|---|
| 1 | Nền tảng motion: token + gate | Một bộ duration/easing duy nhất (CSS + TS mirror); một hàm `motionLevel()` gộp reduced-motion / extraAnimations / combatFx; reduced-motion vẫn có tín hiệu tĩnh; chỉ toggle tắt hẳn mới bỏ FX |
| 2 | Delta model mở rộng + ghép cặp chuyển token | Node test phủ clue location→investigator, investigator→act, resource, doom mọi entity, uses asset, đổi vùng card; quy tắc mơ hồ có test |
| 3 | Director / timeline | Một update = một timeline có thứ tự beat; rect nguồn đo trước khi render; backlog không phình; FX hoãn khi `uiLock` |
| 4 | Phản hồi chọn tức thì | Card/ability/location được click có trạng thái "đang gửi" ngay; tự xoá khi update tới hoặc lỗi |
| 5 | Card đổi vùng ngoài overlay | Đánh card, discard (cả discard vì quá tay), card vào threat area / gắn lên location đều bay tới đích |
| 6 | Token bay (clue, resource, doom, uses) | Clue điều tra bay từ location tới investigator; nộp clue bay tới act; mơ hồ thì fallback floater |
| 7 | Các khoảnh khắc còn lại | Bảng sự kiện → hiệu ứng hoàn tất (chaos token, skill test, act/agenda advance, mulligan, phase change) |
| 8 | Hiệu năng + dọn dẹp + doc | Không còn `transition: all` ở màn game; hiệu ứng chỉ animate transform/opacity; doc kiến trúc FX trong `docs/` |

Phụ thuộc: 1 → 2 → 3 là xương sống, **bắt buộc trước** 5, 6, 7. Phase 4 độc lập (chỉ cần 1), làm song song với 1–3. Thứ tự thực hiện đã chốt: 1–3 (+4 song song) → 6 → 5 → 7 → 8.

### Phase 1: Nền tảng motion

Files: `frontend/src/styles/tokens.css`, mới `frontend/src/arkham/motion/motionTokens.ts`, `frontend/src/stores/settings.ts`, `frontend/src/arkham/components/FxLayer.vue`, `styles/components.css`, `styles/base.css`.

- Token CSS: `--motion-fast: 160ms` (hover/press), `--motion-base: 280ms` (UI chuyển trạng thái), `--motion-travel: 440ms` (vật bay giữa hai chỗ), `--motion-linger: 1000ms` (số nổi); `--ease-out: cubic-bezier(0.22,1,0.36,1)`, `--ease-in-out: cubic-bezier(0.65,0,0.35,1)`, `--ease-land: cubic-bezier(0.32,0.72,0,1)`. Giá trị TS mirror trong `motionTokens.ts` (import-free để node test đọc được).
- Thay các giá trị cứng ở `components.css` (`::view-transition-group(*)` 420ms), `base.css` (`.card-flight` 460ms), `FX_TIMINGS`, gsap 0.3s trong `Player.vue` bằng token.
- `motionLevel(): 'full' | 'reduced' | 'static' | 'off'` trong settings:
  - `full`: mặc định.
  - `reduced`: tắt extraAnimations. Chỉ giữ chuyển động mang thông tin (bay token/card), ngắn hơn, không rung/lunge.
  - `static`: reduced-motion của OS. **Không translate/scale**, nhưng vẫn giữ tín hiệu tĩnh: badge số mờ dần, highlight ngắn ở đích. Người chọn ít chuyển động vẫn phải biết mình vừa mất 2 máu. Vẫn `holdFxBusy` ngắn để autopilot không lướt qua thông tin.
  - `off`: chỉ khi người chơi tự tắt bằng toggle. Không diff, không floater, không `holdFxBusy`.
  - `combatFx` giữ nguyên ý nghĩa là toggle riêng cho số nổi/rung.
- Sửa lỗi CSS: dưới reduced-motion floater hiện gần như vô hình vì keyframe kết thúc ở `opacity: 0` với `forwards` đè lên `opacity: 1`.

Validation: `npm run tc`, `npm test`. Rủi ro thấp; rollback = revert file.

### Phase 2: Delta model mở rộng + ghép cặp chuyển

Files: `frontend/src/arkham/gameDeltaFx.ts`, `frontend/tests/gameDeltaFx.test.mjs`.

- Snapshot thêm: clue + doom trên location, clue trên act, doom trên mọi entity có token (enemy, asset, treachery), uses trên asset (`tokens` khác Damage/Horror), resource pool chung, và **vùng của mỗi card**: hand, discard, in play, threat area, encounter discard, gắn vào location/enemy.
- Sự kiện mới: `transfer { token, from, to, amount }`, `cardMove { cardId, fromZone, toZone }`.
- Pass ghép cặp: location mất n clue và **đúng một** investigator ở location đó nhận n clue trong cùng update → một `transfer` thay vì hai floater. Tương tự investigator mất clue + act nhận clue (hoặc "spent clue" khi act advance), resource từ pool → investigator, uses asset giảm khi dùng.
- Quy tắc mơ hồ (bắt buộc có test): nhiều investigator cùng location nhận clue, số lượng không khớp, nguồn không xác định → fallback về floater riêng lẻ như hiện tại. Không đoán.
- Giữ module import-free, giữ hành vi cũ (test hiện có phải còn xanh).

Validation: `node --test tests/gameDeltaFx.test.mjs` với fixture thật lấy từ snapshot game (đặc biệt Investigate thành công, Draw card, Play asset, Discard hand-size, Advance act).

### Phase 3: Director / timeline

Files: mới `frontend/src/arkham/motion/updateDirector.ts` (logic thuần: chọn beat, nén thời gian), mới `frontend/src/arkham/motion/useUpdateDirector.ts` (phần DOM), `views/Game.vue` (`applyGameUpdate` gọi director), `components/FxLayer.vue` (thành người vẽ, không còn tự watch game), `composables/useFxBusy.ts`, `components/TokenPool.vue`, `components/Draggable.vue`.

- Thứ tự beat: **[view transition: figure + card đổi vùng cùng lúc] → token transfer → trúng đòn + số nổi → doom/clue trên agenda/act**. Các beat sau view transition chồng nhẹ (beat kế bắt đầu khi beat trước còn ~30%) cho liền mạch.
- Đo rect: nguồn biến mất đo trước khi gán `game.value`; nguồn còn tồn tại và đích đo sau `transition.finished`. Sửa luôn lỗi hiện tại: FxLayer đo vị trí trong lúc snapshot cũ của view transition còn trên màn.
- View transition guard: một biến module `activeTransition`; `TokenPool`/`Draggable` gọi qua helper chung, nếu game transition đang chạy thì áp dụng thẳng không animate.
- Backlog (một quy tắc duy nhất): tối đa **một** timeline đang chạy và **một** đang chờ. Update mới tới khi đã có một cái chờ → bỏ timeline đang chờ, gộp sự kiện của nó vào cái mới; timeline đang chạy tăng tốc ×2 phần còn lại. Không bao giờ có hai cái chờ. Replay fast-forward (`ReplayGame.vue`) bỏ qua FX hoàn toàn.
- `uiLock` đang giữ → gom sự kiện lại, phát khi overlay đóng (sau card flight của `flyThenDismiss`).
- `holdFxBusy(totalMs)` một lần cho cả timeline; autopilot chờ như hiện tại.

Validation: node test cho `updateDirector.ts` (sắp beat, nén thời gian, gộp backlog). Phần DOM kiểm thủ công.
Rủi ro: cao nhất của plan, đụng luồng update. Giữ nhánh cũ sau flag `motionDirector` trong settings cho tới khi phase 5–6 ổn; rollback = tắt flag.

### Phase 4: Phản hồi chọn tức thì

Files: `views/Game.vue` (chỗ gửi answer), mới `frontend/src/arkham/motion/pendingChoice.ts`, `components/Card.vue`, `components/Location.vue`, `components/AbilityButton.vue`, `components/AbilityTextRow.vue`, `components/Question.vue`, `components/ChoiceModal.vue`.

- Khi gửi answer: đánh dấu phần tử được click (`data-pending-choice`) → nâng nhẹ + viền sáng + các lựa chọn khác mờ đi (opacity, 160ms). Xoá khi GameUpdate tới hoặc khi request lỗi (kèm rung nhẹ báo lỗi).
- Card trong tay được chọn để đánh: nhấc lên khỏi tay ngay (transform), để khi update tới thì phase 5 cho nó bay tiếp từ vị trí đã nhấc, không giật về.
- Chọn nhiều (discard vì quá tay, commit skill): card đã chọn có trạng thái chọn rõ (nhấc + dấu tick), đếm "đã chọn x/y".
- Hover/press: chuẩn hoá về `--motion-fast`, chỉ transform/opacity.
- Không áp dụng cho câu trả lời do autopilot gửi hay của seat khác, nếu không màn hình sẽ nhấp nháy liên tục.

Validation: kiểm thủ công trên preview; ghi lại các loại target đã phủ.

### Phase 5: Card đổi vùng ngoài overlay

Files: `cardFlight.ts`, `components/Player.vue`, `components/Location.vue`, `components/Enemy.vue`, discard pile components (có `data-card-flight-pile`), `views/Game.vue`.

- Tổng quát hoá card flight: director nhận `cardMove` từ phase 2, dùng chung cơ chế `data-card-flight` / `data-card-flight-pile` đã có, chạy trong view transition chung của phase 3.
- Bao phủ: tay → vùng play, tay → discard (đánh event, discard vì quá tay, bị treachery bắt bỏ), tay/encounter → threat area, card gắn lên location/enemy, card trong play → discard (asset hết uses, ally chết), deck → tay ngoài DrawSpotlight.
- Thay transition-group gsap trong `Player.vue`: bỏ animate `width` (gây reflow cả hàng tay), dùng FLIP transform cho các card còn lại khép vào. Card rời tay được view transition lo.
- Card của seat khác / tab ẩn: không có destination laid out → bỏ qua (dùng `laidOutDestination` sẵn có).

Validation: thủ công từng đường trên preview + `debugSandbox` / debug card move (`debugCardMove.ts`) để dựng tình huống.

### Phase 6: Token bay

Files: mới `frontend/src/arkham/components/TokenFlightLayer.vue` (hoặc mở rộng `FxLayer.vue`), `components/Location.vue`, `components/Act.vue`, `components/Agenda.vue`, `components/Investigator.vue`, `components/LocationStandees.vue`, `components/LocationMapCanvas.vue`, `components/TokenPool.vue`.

- Thêm `data-fx-target` cho pool clue/doom của location, act, asset (uses), resource của investigator, ở cả chế độ Cards, Map và Scene.
- Mỗi `transfer`: vẽ n token (ảnh `tokens/clue.png` v.v., tối đa 5 cái, quá thì 1 token + số) bay theo cung cong nhẹ, so le 60ms; pool nguồn giảm số **khi token rời**, pool đích tăng **khi token tới** (giữ số hiển thị cũ tới lúc đó, cùng ý tưởng `displayedClues`/`inFlight` đã có cho debug drag). Con số giữ lại **chỉ là hiển thị**, state thật đã đổi; nó nhảy về giá trị thật ngay khi có update kế hoặc khi backlog gộp.
- Doom đặt lên agenda/enemy: token rơi từ trên xuống + pulse transform (thay `filter`).
- Nguồn hoặc đích không có trên màn → fallback floater phase 1.

Validation: thủ công: Investigate thành công ở cả 3 chế độ xem, nộp clue để advance act, Mythos đặt doom, dùng asset có uses.

### Phase 7: Các khoảnh khắc còn lại

Kiểm kê (đã grep, cần xác nhận lại bằng mắt khi làm):

| Sự kiện | Hiện tại | Thiếu | Làm |
|---|---|---|---|
| Rút chaos token | `ChaosBag.vue`: chỉ `transition` filter/transform 0.2s | Không có cảm giác "rút ra từ túi" | Token bay ra từ túi, lật, dừng 400ms rồi về khu kết quả; token bị cancel/redraw có hiệu ứng riêng |
| Kết quả skill test | `SkillTest.vue`: `transition: all` | Thành/bại không nổi bật | Đếm số tổng, banner thành công/thất bại ngắn; commit card bay vào vùng commit và bay về discard sau test |
| Act/Agenda advance | `Scenario.vue` `deck-advance` leave 420ms | Mặt mới xuất hiện không có nhịp | Lật card (tái dùng `useCardFlip`), sau đó doom/clue reset có beat riêng |
| Lật location (unrevealed → revealed) | `useCardFlip` | Kiểm lại timing theo token | Chuẩn hoá duration |
| Enemy spawn / di chuyển / bị đánh bại | movement VT + `fx-defeated` | Spawn không có hiệu ứng | Spawn: xuất hiện từ encounter deck (card flight) |
| Đổi phase / round | chưa rõ | Dễ lỡ việc đã sang Mythos | Banner phase ngắn, không chặn tương tác, toggle riêng trong Settings |
| Mulligan | `MulliganPanel.vue` TransitionGroup 0.18–0.25s | Ổn, chỉ chuẩn hoá token | Chuẩn hoá |
| Damage/horror/lunge | FxLayer | Animate `filter` | Đổi sang transform + overlay màu (phase 8) |
| Toast | `components/Toasts.vue` | Kiểm lại | Chuẩn hoá |

Mỗi dòng là một commit nhỏ, đi qua director nếu là thay đổi state game.

### Phase 8: Hiệu năng, dọn dẹp, doc

- Thay `transition: all` ở `SkillTest.vue`, `Question.vue` và các component màn game bằng thuộc tính cụ thể.
- Keyframe `fx-hit-*`, `fx-doom-pulse`: bỏ `filter` trên ảnh card, dùng pseudo-element overlay màu với opacity.
- `will-change` chỉ gắn trong lúc chạy, gỡ khi xong.
- Kiểm tra bằng Performance panel trên preview: một update lớn (Mythos với nhiều doom + enemy di chuyển) không rớt frame dài > 50ms.
- Viết `docs/game-motion.md`: director, thứ tự beat, cách thêm `data-fx-target` / `data-card-flight` cho component mới, gate motion.

## Ràng buộc chung

- Hiệu ứng chỉ animate `transform` và `opacity` (trừ view transition do trình duyệt lo).
- Không chặn input: tương tác vẫn được trong lúc animate (đã có `::view-transition { pointer-events: none }`); chỉ autopilot đợi.
- Bỏ qua anchor 0x0 (tab ẩn, seat khác) như logic sẵn có.
- Tôn trọng `motionLevel()` ở mọi chỗ mới.
- Comment trong code giải thích bất biến, không ghi số phase.

## Kiểm thử

- Tự động: node test cho delta model (phase 2) và logic director (phase 3); `npm run tc`, `npm run lint`, `npm test` mỗi phase.
- Thủ công: preview trình duyệt, dùng debug sandbox / debug card move để dựng tình huống; một ván Night of the Zealot ngắn chạy autopilot để kiểm backlog.
- Nói thẳng: phần hình ảnh (cảm giác mượt, thứ tự beat trên màn) **không có unit test**, chỉ kiểm bằng mắt.

## Quyết định đã chốt (2026-11-07)

1. **Setting tốc độ animation: có.** Ba mức Bình thường / Nhanh / Tắt, nhân hệ số vào token thời lượng ở phase 1. "Tắt" chính là mức `off` của `motionLevel()`.
2. **Thứ tự sau nền tảng:** phase 4 (phản hồi chọn) làm song song ngay với 1–3; sau xương sống làm phase 6 (token/clue bay) **trước** phase 5 (card đổi vùng), rồi 7, 8.
3. **Multiplayer:** hành động của người chơi khác animate **đầy đủ, cùng tốc độ** như của mình (không nén thời gian). Riêng phản hồi chọn của phase 4 vẫn chỉ áp dụng cho chính mình.
4. **Banner đổi phase/round: có**, ngắn, không chặn tương tác, có toggle riêng trong Settings.

## Câu hỏi chưa giải quyết

Không còn câu hỏi chặn việc bắt đầu. Cần xác nhận khi làm phase 7: trạng thái animation thật của phase change và Toasts (mới grep, chưa nhìn bằng mắt).

## Kết quả triển khai (2026-11-07)

Đã làm:
- Phase 1: token motion (`styles/tokens.css`, `arkham/motion/motionTokens.ts`), `motionLevel` 4 mức, setting tốc độ Bình thường/Nhanh/Tắt, toggle banner phase. Reduced-motion của OS = `static` (vẫn có số và glow, không chuyển động).
- Phase 2: `gameDeltaFx.ts` theo dõi clue location/act, doom mọi entity, uses asset, vùng card; ghép cặp transfer theo luật không đoán; "clue bay vào act" chỉ khi act thật sự advance. 13 test.
- Phase 3: `motion/viewTransitionGuard.ts` (một chủ view transition; TokenPool, Draggable, Game dùng chung); FxLayer thành director có baseline, hoãn khi `uiLock` hoặc đang view transition, gộp update thay vì xếp hàng; `fxBusy` gồm cả trạng thái "đang chờ phát" để autopilot không chạy chen.
- Phase 4: `motion/pendingChoice.ts` đánh dấu lựa chọn của chính người chơi tới khi update về (không áp dụng cho autopilot/seat khác).
- Phase 5: card đổi vùng (deck → tay, tay → play, → discard, gắn lên location...) bay trong view transition của update; discard người chơi là flight pile; hand transition-group bỏ qua card đang bay.
- Phase 6: token clue/resource bay theo cung; số ở nguồn/đích giữ giá trị cũ và đổi từng token (`motion/tokenHolds.ts`) ở Location, map plate, Resources, standee, scene seat card.
- Phase 7: chaos token trồi lên + lật; verdict skill test có nhịp; `PhaseBanner.vue`.
- Phase 8 (một phần): bỏ `transition: all` ở SkillTest/Question; rung/nảy dùng `rotate`/`scale` riêng để không đè transform có sẵn; doc `docs/game-motion.md`.

Đã kiểm trên ván "Test" (local): pending choice bật/tắt đúng; Investigate thành công → token clue bay từ Rivertown và hạ cánh lên Diana; đánh Enchanted Armor → view transition card bay hoàn tất, không bị huỷ. Pane trình duyệt bị throttle nên không đánh giá được độ mượt/thời gian thật.

Chưa làm:
- FLIP thay animation `width` của hand trong `Player.vue` (chỉ đổi sang token thời lượng).
- Xoá dấu pending kèm rung khi request lỗi (hiện chỉ tự xoá sau 8s).
- Đếm "đã chọn x/y" khi chọn nhiều card.
- Lật act/agenda theo nhịp mới, enemy spawn bay từ encounter deck, commit card bay vào/ra vùng commit.
- Chuẩn hoá mulligan và toast.
- Bỏ FX khi replay tua nhanh. Replay vẫn mount FxLayer; tua nhanh không làm hàng đợi phình (các update gộp lại) nhưng vẫn phát hiệu ứng.
- Đo Performance panel.
