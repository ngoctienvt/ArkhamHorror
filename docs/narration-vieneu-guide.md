# Render lồng tiếng tiếng Việt cho một campaign bằng VieNeu-TTS

Hướng dẫn này ghi lại đúng quy trình đã dùng cho The Scarlet Keys (commit `21b0853`), để áp dụng cho các campaign còn lại. Phần cuối có một prompt soạn sẵn để giao cho Gemini.

## 1. Tổng quan

Script `frontend/scripts/narration/generate_narration.py` làm các việc sau:

1. Chọn các key cốt truyện (intro, resolution, interlude, epilogue…) từ `frontend/src/locales/en/<campaign>/` bằng bộ lọc trong `frontend/scripts/narration/narration_text.py`.
2. Tra bản dịch tiếng Việt của từng đoạn trong các file `.po` của arkham-cards-data. Một key chỉ được giữ khi **mọi** đoạn của nó đều có bản dịch.
3. Đọc từng đoạn bằng VieNeu-TTS (chạy cục bộ trên CPU), nối các đoạn với khoảng lặng rồi cho qua chuỗi hiệu ứng ffmpeg `DARK_FX`.
4. Ghi ra `frontend/public/audio/narration/vi/<key>.mp3` và cập nhật `frontend/public/audio/narration/manifest.json`.

Một key chỉ được render lại khi văn bản, giọng hoặc engine thay đổi, vì hash được lưu trong manifest. Vì vậy chạy lại script là an toàn: nó tiếp tục từ những key còn thiếu.

## 2. Chuẩn bị

| Thành phần | Vị trí / lệnh |
|---|---|
| Python có cài VieNeu | `D:\tools\vieneu\Scripts\python.exe` |
| ffmpeg, ffprobe | phải có trên PATH (`ffmpeg -version`) |
| Node (để chạy test) | `node --test tests/narration.test.mjs` trong `frontend/` |
| Biến môi trường | `PYTHONIOENCODING=utf-8` (bắt buộc, tên giọng có dấu) |
| File `.po` tiếng Việt | `…\acd\i18n\vi\campaigns\<mã>\` |

**Lưu ý về thư mục `.po`:** bản đang dùng nằm trong thư mục scratchpad tạm của một session cũ:
`C:\Users\PC\AppData\Local\Temp\claude\863a1c946eead139\a528921e-9afe-4632-986a-69a26c88762e\scratchpad\acd\i18n\vi\campaigns\`.
Thư mục Temp có thể bị dọn bất cứ lúc nào. Nên chép cả thư mục `acd\i18n\vi\campaigns` sang một nơi cố định (ví dụ `D:\tools\arkham-cards-data\i18n\vi\campaigns`) rồi dùng đường dẫn mới.

## 3. Bảng campaign và mã `.po`

| Campaign (thư mục locale) | Mã `.po` | Trạng thái |
|---|---|---|
| `nightOfTheZealot` | `notz` | Xong (giọng Edge) |
| `theFeastOfHemlockVale` | `fhv` | Xong (giọng Edge) |
| `theScarletKeys` | `tskc` | Xong (VieNeu, Mỹ Duyên) |
| `theDunwichLegacy` | `dwl` | Chưa |
| `thePathToCarcosa` | `ptc` | Chưa |
| `theForgottenAge` | `tfa` | Chưa |
| `theCircleUndone` | `tcu` | Chưa |
| `theDreamEaters` | `tdea` **và** `tdeb` (truyền cả hai) | Chưa |
| `theInnsmouthConspiracy` | `tic` | Chưa |
| `edgeOfTheEarth` | `eoe` | Chưa |
| `theDrownedCity` | `tdc` | Chưa (kiểm tra mã) |
| `brethrenOfAsh` | `boa` (cần kiểm tra) | Chưa |
| `childrenOfBlood` | `cob` (cần kiểm tra) | Chưa |

Các mã có ghi "cần kiểm tra" là suy đoán từ tên viết tắt. Hãy mở một file `.po` trong thư mục đó, xem các `msgid` có khớp với văn bản tiếng Anh trong locale của campaign hay không. `--vi-po` có thể truyền nhiều lần (`--vi-po A --vi-po B`).

Hai campaign đã làm bằng Edge **không** cần làm lại. Engine mặc định vẫn là `edge`, nên hash của chúng không đổi.

## 4. Quy trình cho một campaign

Mọi lệnh chạy trong thư mục `frontend/`. Ví dụ dưới đây dùng `theDunwichLegacy` / `dwl`; thay bằng campaign cần làm.

### Bước 1: Dry-run để xem văn bản sẽ được đọc

```bash
PYTHONIOENCODING=utf-8 D:/tools/vieneu/Scripts/python.exe scripts/narration/generate_narration.py theDunwichLegacy --lang en --dry-run > dwl_en.txt
```

```bash
PYTHONIOENCODING=utf-8 D:/tools/vieneu/Scripts/python.exe scripts/narration/generate_narration.py theDunwichLegacy --lang vi --vi-po "<thư mục po>/dwl" --dry-run > dwl_vi.txt
```

- Mỗi key bắt đầu bằng một dòng `=== [lang] <key>`. Đếm số key bằng `grep -c "^===" dwl_en.txt`.
- Đầu file `dwl_vi.txt` liệt kê các key "no full translation". Những key này bị bỏ qua; như vậy là chấp nhận được, chỉ cần ghi lại trong báo cáo.

### Bước 2: Soát lỗi lọt luật chơi

Chỉ **văn xuôi cốt truyện** được đọc. Đọc file tiếng Anh (bộ lọc chạy trên tiếng Anh, không phải tiếng Việt) và tìm những thứ không được phép lọt vào:

- các bước setup, sổ chiến dịch (campaign log), XP, chaos token;
- nhãn lựa chọn, "The lead investigator must decide (choose one)";
- các dòng "Proceed to…", "Record that…", "Read the rules…", "If neither… proceed as normal";
- tiêu đề trơ trọi ("The Foundation", "Dossier #14-C");
- dòng đếm phiếu ("X votes 'yea'").

Lệnh lọc nhanh các đoạn khả nghi:

```bash
grep -nE "^(Read|If |Proceed|Check|Record|Add|Remove|Place|Choose|Shuffle|Search|Each investigator|The lead investigator)|chaos|campaign log|encounter set|\bXP\b" dwl_en.txt
```

### Bước 3: Nếu có lỗi lọt, siết bộ lọc thật hẹp

Sửa `scripts/narration/narration_text.py`. Các điểm có thể chỉnh:

| Hằng / hàm | Dùng khi |
|---|---|
| `SKIP_SEGMENTS` | cả một nhánh key là luật (ví dụ `headings`, `slay`) |
| `CHOICE_SEGMENT` | tên key là nhãn lựa chọn (`proceedTo…`, `if…`) |
| `INSTRUCTION_START` | đoạn văn **bắt đầu** bằng câu chỉ dẫn |
| `RULES_ANYWHERE` | cụm từ luật nằm giữa đoạn |
| `drop_titles` / `_is_title_line` | tiêu đề ngắn; hiện chỉ áp dụng cho key có segment `interludes` |

**Quy tắc vàng: sửa bộ lọc không được làm thay đổi văn bản của các campaign đã render.** Nếu văn bản của Zealot, Hemlock hoặc Scarlet Keys đổi, hash của chúng đổi theo và lần chạy sau sẽ render lại toàn bộ. Với Hemlock (giọng Edge), điều đó cũng đồng nghĩa với việc bị throttle.

Cách kiểm tra:

1. Trước khi sửa, chụp lại kết quả trích xuất từ bản gốc trong git:

   ```bash
   git show HEAD:frontend/scripts/narration/narration_text.py > /tmp/narration_text_orig.py
   ```

2. Sau khi sửa, so sánh `collect_story(...)` của bản gốc và bản mới cho `nightOfTheZealot`, `theFeastOfHemlockVale`, `theScarletKeys` (và mọi campaign đã render). Kết quả phải **giống hệt**.
3. Đếm số key dry-run `--lang en`: Zealot phải là **16**, Hemlock **123**, Scarlet Keys **164**.

Khi gặp lần trước: luật "bỏ dòng tiêu đề ngắn" áp dụng toàn cục đã xoá dòng ngày tháng "June 1926" và chữ ký thư trong Hemlock. Vì vậy luật đó phải giới hạn trong key `interludes`. Nếu một luật mới ảnh hưởng tới campaign cũ, hãy giới hạn phạm vi của nó theo cách tương tự.

### Bước 4: Render thật (chạy nền, khoảng 13 giây mỗi đoạn)

Ước lượng thời gian trước: Scarlet Keys có 445 đoạn và mất khoảng 1 giờ 45 phút.

```bash
PYTHONIOENCODING=utf-8 D:/tools/vieneu/Scripts/python.exe -u scripts/narration/generate_narration.py theDunwichLegacy --lang vi --vi-po "<thư mục po>/dwl" --vi-engine vieneu --vi-voice "Mỹ Duyên" > render_dwl.log 2>&1; echo "exit $?" >> render_dwl.log
```

- **Luôn dùng `-u`.** Không có nó, Python đệm stdout khi ghi ra file, log trông như đứng yên dù vẫn đang chạy.
- Dùng `--lang vi` để không render tiếng Anh.
- Mã thoát `0` là xong; `2` nghĩa là còn key chưa render, khi đó chạy lại cùng lệnh.

### Bước 5: Theo dõi mà không tạo tiến trình trùng

Lần trước đã xảy ra lỗi: tưởng tiến trình đã chết (vì log trống và lệnh kiểm tra bị cắt bằng `head -3`), nên khởi động thêm một tiến trình. Hai tiến trình cùng ghi đè `manifest.json` và có thể làm mất mục của nhau.

Trước khi khởi động lại, **luôn** kiểm tra xem đã có tiến trình nào chạy chưa:

```bash
powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \"Name='python.exe'\" | Where-Object { $_.CommandLine -like '*generate_narration*' } | Select-Object ProcessId,CreationDate"
```

Mỗi lần chạy có **hai** dòng (một launcher của venv và một python thật). Nếu thấy nhiều hơn một cặp, dừng cặp cũ bằng `taskkill /PID <id> /T /F`.

Cách xem tiến độ: đếm file mp3 và mục manifest của campaign đó; hai số phải bằng nhau.

```bash
ls public/audio/narration/vi | grep -c "^theDunwichLegacy"
```

### Bước 6: Xác minh

1. Chạy lại lệnh render một lần nữa. Nó phải kết thúc nhanh mà không render key nào; nếu có thì tức là còn thiếu.
2. Số mục manifest của campaign bằng số key dry-run `--lang vi`.
3. Các mục cũ trong manifest (của mọi campaign khác) giữ nguyên hash so với `git show HEAD:frontend/public/audio/narration/manifest.json`.
4. `node --test tests/narration.test.mjs` pass, kể cả test "every manifest entry has its mp3 on disk".
5. Kiểm tra hai file bằng ffprobe; thời lượng phải hợp lý (vài chục giây đến vài phút):

   ```bash
   ffprobe -v error -show_entries format=duration -of csv=p=0 public/audio/narration/vi/<key>.mp3
   ```

6. Nghe thử một hai file để chắc giọng đúng và không có đoạn luật chơi.

### Bước 7: Commit

Working tree thường có thay đổi của session khác. Chỉ stage đúng các đường dẫn của việc này, không stash, không đổi nhánh:

```bash
git add -- frontend/public/audio/narration frontend/scripts/narration
```

```bash
git diff --cached --name-only
```

```bash
git commit -m "feat: Vietnamese narration for <Campaign> with a local VieNeu voice"
```

Câu ghi nguồn VieNeu (CC BY-NC 4.0) đã có trong `frontend/src/locales/en/gameBoard/game_bar.json`, không cần thêm lại.

## 5. Các điểm dễ sai

| Hiện tượng | Nguyên nhân | Cách xử lý |
|---|---|---|
| Log trống hàng chục phút | stdout bị đệm | dùng `python -u`; xem tiến độ qua số file mp3 |
| Mục manifest mất / render lại | hai tiến trình chạy song song | kiểm tra tiến trình trước khi chạy; chỉ giữ một |
| Campaign cũ bị render lại | sửa bộ lọc làm đổi văn bản của nó | so sánh `collect_story` với bản gốc trước khi render |
| `UnicodeEncodeError` | thiếu `PYTHONIOENCODING=utf-8` | đặt biến môi trường |
| Key bị liệt kê "no full translation" | `.po` thiếu hoặc lệch câu | chấp nhận bỏ qua và ghi vào báo cáo |
| Cảnh báo "unauthenticated requests to the HF Hub" | VieNeu tải model | vô hại, bỏ qua |
| Cảnh báo CRLF khi `git add` manifest | Python trên Windows ghi CRLF | vô hại, git tự chuẩn hoá |

## 6. Prompt soạn sẵn cho Gemini

Thay `<CAMPAIGN>`, `<MÃ_PO>` và `<THƯ_MỤC_PO>` trước khi gửi.

```text
Bạn làm việc trong repo Arkham Horror online, thư mục frontend/. Hãy render lồng tiếng
tiếng Việt cho campaign <CAMPAIGN> bằng VieNeu-TTS, giọng preset "Mỹ Duyên", rồi commit.
Đọc docs/narration-vieneu-guide.md trước và làm đúng các bước trong đó.

Thông tin:
- Python: D:/tools/vieneu/Scripts/python.exe, luôn đặt PYTHONIOENCODING=utf-8 và dùng -u.
- File .po tiếng Việt: <THƯ_MỤC_PO>/<MÃ_PO> (truyền bằng --vi-po).
- Lệnh render: scripts/narration/generate_narration.py <CAMPAIGN> --lang vi --vi-po ...
  --vi-engine vieneu --vi-voice "Mỹ Duyên"

Yêu cầu:
1. Dry-run --lang en và --lang vi. Soát văn bản tiếng Anh: chỉ văn xuôi cốt truyện được đọc,
   không setup, campaign log, nhãn lựa chọn, "proceed to / record that", tiêu đề trơ trọi.
2. Nếu có luật chơi lọt vào, sửa narration_text.py thật hẹp. Sau khi sửa, chứng minh
   collect_story() của nightOfTheZealot (16 key), theFeastOfHemlockVale (123 key) và
   theScarletKeys (164 key) giống hệt bản trong git HEAD. Nếu khác, thu hẹp luật lại.
3. Render chạy nền. Trước khi khởi động, kiểm tra không có tiến trình generate_narration nào
   đang chạy. Không bao giờ chạy hai tiến trình cùng lúc. Chạy lại cho tới khi lần chạy
   cuối không còn key nào để render.
4. Xác minh: số mục manifest của campaign bằng số key dry-run vi; mục của các campaign khác
   không đổi hash; node --test tests/narration.test.mjs pass; ffprobe hai file có thời lượng hợp lý.
5. Chỉ stage frontend/public/audio/narration/** và frontend/scripts/narration/**. Không stash,
   không đổi nhánh, không đụng file khác. Commit trên nhánh hiện tại với message
   "feat: Vietnamese narration for <Campaign> with a local VieNeu voice".
6. Báo cáo: số key render / số key chọn, các key bỏ qua vì thiếu bản dịch, thay đổi bộ lọc
   (nếu có) và hash commit.
```

Làm từng campaign một, mỗi campaign một commit. Không chạy song song nhiều campaign: CPU chỉ đủ cho một model VieNeu (mỗi tiến trình chiếm khoảng 6 GB RAM), và các tiến trình sẽ ghi đè manifest của nhau.
