# Decision Engine — khi nào dùng, khi nào không

Đọc file này **mỗi lần lập kế hoạch**. Mỗi quyết định trong EDL phải đi qua năm bước dưới đây. Nếu không qua bước nào thì bỏ quyết định đó.

## Thứ tự ưu tiên (khi hai điều xung đột, bên trên thắng)
1. **Storytelling:** hiệu ứng phải phục vụ nội dung.
2. **Clarity:** người xem phải hiểu và đọc được.
3. **Rhythm:** video phải có nhịp, không đều đều và không dồn dập.
4. **Style:** thống nhất phong cách đã chọn.
5. **Decoration:** chỉ thêm khi thật sự cần, và là lớp đầu tiên bị bỏ khi vượt ngân sách.

Ví dụ: nội dung quan trọng nhưng chữ nhấn mạnh che mặt người nói → ưu tiên Clarity, dời hoặc bỏ chữ. Style documentary mà glitch "trông ngầu" → Decoration thua Style, bỏ.

## Năm bước kiểm tra cho mỗi quyết định

1. **Có lý do nội dung không?** Viết được một câu `reason` gắn với lời thoại, hình ảnh hoặc cấu trúc video. Không viết được thì bỏ.
2. **Điều kiện dùng đạt chưa?** Đối chiếu mục "Khi nên dùng" của kỹ thuật.
3. **Có điều kiện cấm nào không?** Đối chiếu mục "Khi không nên dùng" và các quy tắc bên dưới.
4. **Khoảng cách và ngân sách:** theo bảng "Khoảng cách tối thiểu" và `strategy.budget`.
5. **Hợp phong cách không?** Đối chiếu `styles/<style>.md` (danh sách kỹ thuật cấm/hạn chế).

## Đầu vào để quyết định
- `importance` và `confidence` của câu nói (pha 1).
- Mood và cường độ cảm xúc (`mood` trong `summary.md`, giọng nói).
- Loại clip (`talking_head`, `b_roll`, `run_and_gun`).
- Bố cục hiện tại (cận hay rộng, chủ thể ở đâu; xem `core/composition.md`).
- Quyết định trước đó trong EDL (loại, thời điểm).
- `strategy` đã chọn và ngân sách còn lại.

## Quy tắc (dạng kiểm tra được)

### Nhấn mạnh
- `R-EMP-1`: NẾU câu `importance=high` VÀ cảm xúc ≥ trung bình VÀ clip là `talking_head` VÀ khung không quá cận → cân nhắc `punch_in` (preset theo `motion_style`).
- `R-EMP-2`: NẾU câu chứa **dữ kiện cụ thể** (số liệu, tên, mốc) → ưu tiên `kinetic_text` (chữ) hơn `punch_in`.
- `R-EMP-3`: NẾU khung đã cận (mặt chiếm > 40% chiều cao) → **không** `punch_in`.
- `R-EMP-4`: NẾU người nói đang cử động mạnh hoặc chuyển cảnh trong 1 giây → **không** `punch_in`.

### Zoom
- `R-ZOOM-0`: **không tự đề xuất zoom** (`punch_in`, `punch_out`, `slow_push`). Chỉ đưa vào EDL khi người dùng yêu cầu rõ; `reason` ghi "người dùng yêu cầu". Kỹ thuật và hướng dẫn (`techniques/camera-motion/zoom-guide.md`) vẫn giữ để dùng khi được yêu cầu.

### Chữ và chủ thể
- `R-SUBJ-1`: không đặt chữ, đường chỉ hay hiệu ứng lên mặt và thân chủ thể chính (khai báo `subject_box` của clip; chi tiết ở `core/composition.md`).
- `R-SRC-1`: chữ trên hình, tên người, con số, trích dẫn phải có nguồn (lời nói, metadata, lời người dùng) hoặc được ghi rõ là minh họa; mốc theo từng từ cho chữ theo lời nói phải đến từ nhận dạng giọng nói, thủ công hoặc file phụ đề, không ước lượng cho bản giao.

### Tần suất
- `R-FREQ-1`: không hai `punch_in` cách nhau < 6 giây nguồn, trừ biến thể `double_punch` có chủ đích hài hước.
- `R-FREQ-2`: không vượt `strategy.budget` cho bất kỳ kỹ thuật nào.
- `R-FREQ-3`: NẾU quyết định liền trước cùng kỹ thuật VÀ câu hiện tại `importance != high` → bỏ.
- `R-FREQ-4`: không quá 2 loại hiệu ứng khác nhau chồng trên cùng một câu (ví dụ `punch_in` + `kinetic_text` đủ rồi, không thêm nữa).

### Chữ
- `R-TXT-1`: chữ nhấn mạnh tối đa 3–6 từ mỗi lần; dài hơn thì đó là phụ đề, dùng `subtitles` (chưa có) hoặc cắt ngắn.
- `R-TXT-2`: chữ phải hiện đủ thời gian đọc (xem công thức trong `kinetic-text.md`); không đủ thì bỏ chữ, không rút ngắn dưới ngưỡng.
- `R-TXT-3`: chữ không che mặt, không nằm ngoài vùng an toàn.

### Điểm nối và âm thanh
- `R-CUT-1`: điểm nối mặc định là `hard_cut`. Đổi sang kiểu khác chỉ khi có lý do kể chuyện (trôi thời gian, đổi địa điểm, mở/kết).
- `R-CUT-2`: NẾU đổi người nói hoặc chèn b-roll lên lời đang nói → cân nhắc `j_l_cut`.
- `R-AUD-1`: NẾU có nhạc nền VÀ có tiếng nói → bắt buộc `audio_ducking`.
- `R-AUD-2`: NẾU clip b-roll có tiếng gốc bẩn (`issues` ghi tiếng lạ) → `audio: mute` hoặc lót nhạc.

### Nội dung trừu tượng, thiếu hình
- `R-ABS-1`: NẾU nội dung trừu tượng VÀ không có b-roll phù hợp → ưu tiên `kinetic_text` hoặc motion graphics (khi có), **không** chèn b-roll không liên quan.

### Tên người, chuyển đoạn, đẩy chậm, b-roll
- `R-LT-1`: mỗi người tối đa một `lower_third`, ở lần đầu xuất hiện có lời; chỉ khi biết chắc tên và chức danh (không đoán).
- `R-LT-2`: không hiện cùng lúc với `kinetic_text`; dời `lower_third`.
- `R-DIS-1`: `cross_dissolve` chỉ khi có lý do kể chuyện (trôi thời gian, đổi địa điểm, mở/kết); không dùng trong đoạn đối thoại liên tục; cần tay cầm ≥ `duration/2` ở cả hai clip.
- `R-DIS-2`: không vượt `budget.special_transition`; cách nhau ≥ 3 giây; không đặt chữ hoặc `punch_in` trong vùng mờ chồng.
- `R-PUSH-1`: `slow_push` chỉ cho clip tĩnh dài ≥ 4 giây, không chồng chuyển động camera sẵn hoặc `punch_in` trên cùng clip.
- `R-PUSH-2`: tối đa khoảng 1 `slow_push` mỗi 20–30 giây trong documentary.
- `R-BROLL-1`: `b_roll_insert` chỉ khi b-roll khớp nghĩa hoặc cần che cắt; b-roll `mute`; không chèn khi người nói đang cảm xúc mạnh hoặc nói câu then chốt.

### Phụ đề, màu, vignette, lùi khung
- `R-SUB-1`: `subtitles` chỉ cho lời có nguyên văn đáng tin; không điền chỗ thiếu bằng suy đoán.
- `R-SUB-2`: ≤ 2 dòng, ≤ 42 ký tự/dòng, tốc độ đọc ≤ 17 ký tự/giây, mỗi cue ≥ 1.0 s.
- `R-SUB-3`: không cùng lúc với `lower_third` hoặc `kinetic_text`.
- `R-COL-1`: `color_grade_basic` áp cùng một preset cho mọi clip; footage đã đều màu thì không làm gì.
- `R-VIG-1`: `vignette` chỉ khi chủ thể ở giữa và mép khung không có thông tin cần thấy; documentary `strength` ≤ 0.25.
- `R-OUT-1`: `punch_out` để "thả" sau ý nặng, mở cảnh hoặc kết đoạn; không liền ngay sau `punch_in` (cách ≥ 3 s), không chồng `slow_push` hay chuyển động camera sẵn.

### Thư viện chuyển cảnh mở rộng
- Quy tắc riêng của từng kiểu (ví dụ `R-WHIP-*`, `R-IRIS-*`, `R-GLITCH-*`) nằm ở **mục 7 của tài liệu kỹ thuật tương ứng** trong `techniques/transitions/`, `techniques/storytelling/`, `techniques/sound/`. Đọc tài liệu của kiểu định dùng trước khi đưa vào EDL.
- `R-TRANS-1`: mọi chuyển cảnh khác cắt thẳng cần `reason` gắn với kể chuyện (trôi thời gian, đổi địa điểm, mở/kết, nhịp nhạc), không dùng vì "trông đẹp" (Decoration thua Storytelling).
- `R-TRANS-2`: tối đa một kiểu chuyển cảnh đặc biệt trên mỗi điểm nối; hai kiểu đặc biệt cách nhau ≥ 3 giây; tổng ≤ `budget.special_transition`.
- `R-TRANS-3`: giữ một "ngôn ngữ chuyển cảnh" nhất quán trong cả video (tối đa 2–3 kiểu khác nhau).
- `R-TRANS-4`: `flash_strobe` không quá 3 lần chớp mỗi chuyển cảnh (an toàn cho người nhạy sáng).
- `R-TRANS-5`: kiểu chuyển cảnh chỉ tác động hình; nếu hai clip có tiếng nền lệch nhau rõ, thêm `j_l_cut`/`sound_bridge` ở cùng điểm nối.

### Theo phong cách
- `R-STYLE-DOC`: style `documentary` cấm glitch, bounce, elastic, RGB split, rung mạnh, chuyển cảnh trang trí. Chuyển động chỉ ở mức `subtle`.

## Khoảng cách tối thiểu (giây nguồn, giữa hai quyết định)
| Cặp | Tối thiểu |
|---|---|
| `punch_in` – `punch_in` | 6 |
| `kinetic_text` – `kinetic_text` | 4 |
| `punch_in` – `kinetic_text` (cùng câu) | cho phép, nhưng tính là 2 loại chồng (R-FREQ-4) |
| `j_l_cut` – `j_l_cut` | 3 |

## Xử lý khi vượt ngân sách
Xếp các quyết định cùng kỹ thuật theo `priority` (storytelling > clarity > rhythm > style > decoration), rồi theo `importance` của câu. Giữ đủ ngân sách từ trên xuống, chuyển phần còn lại sang `status: removed` kèm lý do "vượt ngân sách".

## Khi quy tắc mâu thuẫn hoặc thiếu
- Hai quy tắc mâu thuẫn: áp theo thứ tự ưu tiên ở đầu file và ghi vào `reason`.
- Không quy tắc nào bao phủ tình huống: chọn phương án **ít hiệu ứng hơn**, đặt `confidence: low`, và nói rõ với người dùng ở bước báo cáo.
