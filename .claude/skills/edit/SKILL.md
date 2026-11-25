---
name: edit
description: >-
  Gọi bằng /edit <yêu cầu>. Agent đọc tài liệu quy trình trong Video-edit rồi làm trọn từ đầu
  đến bản preview: hiểu footage trong Video-analysis, lên kịch bản, chọn hiệu ứng, lập EDL,
  validate, render preview, kiểm tra (QC) và báo lại để người dùng xác nhận. Không render bản cuối.
disable-model-invocation: true
argument-hint: "<mô tả video muốn dựng: mục đích, độ dài, style, nền tảng, video/chủ đề nguồn>"
---

# /edit — dựng từ đầu đến bản preview

Yêu cầu của người dùng: **$ARGUMENTS**

Làm việc trong thư mục gốc `Video-edit` (nơi có `SKILL.md`, `core/`, `workflows/`, `renderer/`). Footage và metadata nằm ở `../Video-analysis/`. Nói tiếng Việt. Làm liền một mạch tới bản preview; **chỉ dừng hỏi khi thiếu thứ không thể tự quyết** (xem mục 2).

## 0. Quy tắc cứng (không thương lượng)
Đọc đầy đủ ở `SKILL.md`, tóm tắt:
1. Mặc định **cắt thẳng**; mỗi hiệu ứng phải có `reason` gắn nội dung.
2. **Không tự dùng zoom** (`punch_in`, `punch_out`, `slow_push`): chỉ khi người dùng yêu cầu rõ trong `$ARGUMENTS` hoặc sau đó (`R-ZOOM-0`).
3. **Không đè chữ/hiệu ứng lên mặt và thân chủ thể** (`R-SUBJ-1`); khai báo `subject_box` cho clip có chủ thể và đọc cảnh báo của `validate`.
4. **Không bịa:** chữ trên hình, tên, con số, trích dẫn phải có nguồn (lời nói/metadata/người dùng) hoặc ghi rõ "minh họa" (`R-SRC-1`). Không có mốc theo từng từ thật thì **không dùng** kỹ thuật chữ theo lời (karaoke, tô từ khóa).
5. **Không render bản cuối** (`final`). Dừng ở preview và chờ người dùng.
6. **Báo trung thực:** cái đã xem/đo, cái chưa xem, cái chưa nghe (agent không nghe được âm thanh).

## 1. Đọc tài liệu theo thứ tự (đọc thật, đừng đoán)
1. `SKILL.md` (điều phối, nguyên tắc, bản đồ).
2. `workflows/video-analysis.md`, `workflows/script-writing.md`, `workflows/edit-planning.md`.
3. `core/decision-engine.md`, `core/effect-selection.md`, `core/composition.md`, `core/storytelling.md`, `core/pacing.md`.
4. `styles/<style>.md` của style chọn (hiện chỉ có `documentary`; style khác thì dùng bậc cường độ ở `core/effect-selection.md` mục 4 và nói rõ là chưa có style file).
5. `schema/edl.md`, `workflows/editing-execution.md`, `workflows/quality-control.md`.
6. Khi dùng một kỹ thuật: `techniques/index.md` → tài liệu kỹ thuật đó (mục 2, 3, 4, 7) và preset trong `presets/*.json`. Chữ: thêm `typography/hierarchy.md`, `typography/font-registry.json`.

Chỉ đọc tài liệu kỹ thuật của thứ sẽ dùng, không đọc cả thư viện.

## 2. Khi nào được hỏi người dùng
Hỏi **một lần, gom thành một tin** và dừng, **chỉ** khi:
- `$ARGUMENTS` trống hoặc không nói rõ dựng **video gì từ nguồn nào** (không có chủ đề, không có video_id nào để chọn);
- hai cách hiểu khác hẳn nhau và chọn sai sẽ phí cả bản preview.

Mọi thứ khác **tự quyết bằng mặc định hợp lý và ghi vào `brief.md` mục "Giả định"**: độ dài (theo lượng footage), style (`documentary` nếu sự kiện trang trọng), nhịp, tỉ lệ 16:9, không nhạc nếu chưa có file nhạc, tên/chức danh chưa biết thì không dùng lower third (hoặc ghi "Tên minh họa" nếu cần minh họa). Không dừng chờ duyệt kịch bản; kịch bản và giả định được trình cùng preview.

## 3. Quy trình

### Pha 0 — Dựng khung dự án
- Đặt `slug` ngắn không dấu từ yêu cầu (ví dụ `khai-giang-recap-2`), tạo `projects/<slug>/`.
- Ghi `projects/<slug>/brief.md`: yêu cầu gốc, mục tiêu một câu, thông số (độ dài, tỉ lệ, style, nhịp), **giả định**, **câu hỏi mở**.

### Pha 1 — Hiểu footage
- Đọc `../Video-analysis/metadata/INDEX.md`, `TOPICS.md`, rồi `summary.md` và `clips.md` của video liên quan (xem `workflows/video-analysis.md`). Tìm thêm bằng CLI của Video-analysis nếu cần (`npm run vid`, xem `../Video-analysis/src/cli.js`). Chỉ đọc, không sửa `Video-analysis`.
- Lọc ứng viên theo `roles`, `usable`, `standalone`, `priority`, `issues`, `confidence`.
- **Xem footage thật:** dùng ffmpeg trích vài khung từ clip đã chọn (ví dụ tại đầu, giữa, cuối đoạn dự kiến) và xem để biết chủ thể ở đâu, có chữ sẵn trên hình không, khung rộng hay cận. Ghi `subject_box` ước lượng. Kiểm `source_in/out` nằm trong độ dài file.
- Lời thoại trong `clips.md` do mô hình khác chép lại, có `confidence`; không có mốc từng từ.

### Pha 2 — Kịch bản
- Theo `workflows/script-writing.md`: mục tiêu, cấu trúc, **bảng cảnh** (clip, mốc nguồn, nội dung quan sát được, kỹ thuật + lý do, chữ trên hình + nguồn, rủi ro). Tự duyệt theo checklist bước 6.
- Lưu `projects/<slug>/kich-ban.md`. Chọn hiệu ứng theo `core/effect-selection.md` (nhu cầu nội dung → kỹ thuật; bảng "cảnh nào dùng gì"; ngân sách của style). Cảnh quan trọng nhất để trần.

### Pha 3–4 — Chọn hiệu ứng và lập EDL
- Dựng `projects/<slug>/edl.json` theo `schema/edl.md`: `timeline.clips` (kèm `subject_box` khi có chủ thể), `strategy` (style, nhịp, ngân sách), `decisions` (mọi quyết định `status: proposed`, có `reason`, `priority`, `confidence`).
- Mỗi quyết định qua 5 bước của `core/decision-engine.md`. Chữ: đúng preset trong `presets/typography-presets.json`, kiểm `forbidden_styles` của style, `hold` đủ đọc.
- Nhạc, âm thanh: chỉ dùng file nhạc có thật trong thư mục dự án; chưa có thì `music.file: null` và ghi vào câu hỏi mở.

### Pha 5 — Validate, render preview, QC
1. `node renderer/cli.js validate --edl projects/<slug>/edl.json`. **Sửa mọi lỗi (✘)**; đọc từng cảnh báo (⚠) và sửa hoặc ghi lý do bỏ qua. Lặp lại tối đa vài lần; nếu một lỗi không sửa được, dừng và báo.
2. `node renderer/cli.js preview --edl projects/<slug>/edl.json` → `projects/<slug>/out/preview.mp4`. Render lâu: chạy nền, đừng hỏi thăm liên tục, đợi thông báo hoàn thành.
3. QC theo `workflows/quality-control.md`, bằng công cụ chứ không bằng cảm giác:
   - độ dài so với mục tiêu (± 10%), `ffprobe`;
   - khung đen và khung đứng (`blackdetect`, `freezedetect`);
   - âm thanh có/không, đỉnh và trung bình (`volumedetect`) nếu có tiếng;
   - **xem ảnh khung** cho mỗi khối chữ ở thời điểm chữ hiện đủ và cho mỗi chuyển cảnh đặc biệt; kiểm chữ không đè mặt, không cắt, dấu tiếng Việt không chạm dòng khác.
4. Sửa lỗi tìm thấy (chỉ quyết định liên quan), validate và render lại nếu cần. Không sửa vô hạn: sau hai vòng sửa còn lỗi thì báo thẳng.

## 4. Báo cáo cuối (một tin, ngắn, tiếng Việt)
1. Đường dẫn preview (`projects/<slug>/out/preview.mp4`) và độ dài.
2. Mục tiêu, style, nhịp, các giả định đã dùng.
3. Cấu trúc kịch bản theo chương (vài dòng), đường dẫn `kich-ban.md` và `edl.json`.
4. Danh sách quyết định (ID + một dòng) nhóm theo loại.
5. **QC:** đã xem/đo gì (kèm kết quả), **chưa xem/chưa nghe gì**, còn lo ngại gì (ví dụ lời thoại chưa nghe lại, mốc cắt giữa câu, âm lượng chưa chuẩn hóa).
6. Câu hỏi mở (tên người, nhạc, mốc cần nghe lại...).
7. Nhắc: chưa render bản cuối; cho nhận xét theo **ID quyết định** hoặc thời điểm để sửa (xem `workflows/editing-execution.md`). Nếu người dùng lặp lại một phản hồi, ghi vào `projects/<slug>/feedback.md`.

Nếu có công cụ gửi file cho người dùng, gửi kèm vài ảnh khung tiêu biểu.

## 5. Không làm
- Không render `final`, không đặt `status: approved` thay người dùng.
- Không sửa `Video-analysis`, không sao chép nguyên video mẫu.
- Không thêm zoom, chữ theo lời có mốc ước lượng, hoặc chữ chưa có nguồn.
- Không tự cài công cụ hoặc tải mô hình (ví dụ nhận dạng giọng nói) khi chưa được người dùng đồng ý.
