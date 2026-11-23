# Thiết kế: Bộ Skill Edit Video (Editing Intelligence + Preview Execution)

Ngày: 2026-11-22 · Trạng thái: bản nháp chờ duyệt · Thư mục: `E:\Bộ tài liệu edit\Video-edit`

## 1. Ý định và lý do

Người dùng muốn AI không chỉ "biết dùng công cụ edit" mà có **tư duy của editor**. Skill phải giúp AI trả lời được bốn câu hỏi cho mỗi hiệu ứng:

1. Khi nào nên dùng?
2. Dùng như thế nào?
3. Thông số cụ thể là bao nhiêu?
4. Trong ngữ cảnh video hiện tại, có nên dùng không?

Lý do chia nhỏ kiến thức: một `SKILL.md` khổng lồ làm AI mất tập trung, tham khảo sai kỹ thuật, khó cập nhật và không biết phối hợp hiệu ứng. Vì vậy `SKILL.md` chỉ điều phối; kiến thức chi tiết nằm trong tài liệu riêng và AI chỉ đọc phần cần.

## 2. Đầu ra và vòng làm việc (đã được người dùng xác nhận)

```
footage + metadata ─► kế hoạch edit (EDL) ─► video PREVIEW ─► người dùng xác nhận/sửa ─► render bản cuối
```

- **Đầu vào:** footage, metadata đã phân tích từ `Video-analysis` (transcript, scene, key moments), yêu cầu của người dùng.
- **Đầu ra mỗi lần chạy:** (a) chiến lược edit, (b) Edit Decision List (EDL) có lý do, (c) video preview chất lượng thấp, nhanh.
- **Cổng xác nhận bắt buộc:** không render bản cuối khi người dùng chưa xác nhận.
- **Sửa theo ID:** mỗi quyết định trong EDL có ID riêng; người dùng có thể nói "bỏ quyết định 7", AI chỉ sửa đúng chỗ đó rồi render lại preview.
- **Preview và bản cuối dùng cùng EDL**, chỉ khác chất lượng render.

## 3. Mục tiêu, không phải mục tiêu, phản mục tiêu

**Mục tiêu**
- Bộ kiến thức chia lớp, truy xuất theo nhu cầu (Core, Technique, Style, Typography, Reference).
- Bộ ra quyết định (Decision Engine) có thứ tự ưu tiên rõ.
- Định dạng EDL ổn định làm hợp đồng giữa "ra quyết định" và "thực thi".
- Renderer preview tối thiểu chạy được từ EDL.
- Quy trình QC sau render.

**Không phải mục tiêu (giai đoạn đầu)**
- Thu thập hàng trăm video mẫu; xây thư viện reference đầy đủ (chỉ đặt khung và schema).
- Phủ hết 8 nhóm kỹ thuật (mục tiêu dài hạn 20–30 tài liệu, nhưng lát cắt đầu chỉ làm 5).
- Học từ phản hồi người dùng tự động (ghi nhận phản hồi để sau).
- Thay đổi hoặc viết lại `Video-analysis` (đã hoàn thành, chỉ đọc).
- Phụ thuộc vào `Tiem-edit-nho` (chỉ tham khảo, không bắt buộc).

**Phản mục tiêu (thất bại dù kỹ thuật chạy được)**
- AI nhồi hiệu ứng vì "đẹp": lạm dụng zoom, glitch, bounce không có lý do.
- AI sao chép nguyên video mẫu thay vì rút ra kỹ thuật.
- Kiến thức chỉ mô tả chung chung ("Zoom In: phóng to để gây chú ý") không có điều kiện dùng/không dùng và thông số.
- Preview lệch so với bản cuối.

## 4. Ràng buộc

- Nội dung kiến thức là Markdown + JSON; AI đọc theo từng phần (progressive disclosure), `SKILL.md` giữ ngắn.
- Thông số tính theo **giây**; bộ thực thi quy đổi ra frame theo fps của video.
- Mỗi thông số ghi nguồn: `convention` (quy ước ngành) hoặc `observed:<REF_id>` (đo được từ video mẫu), kèm độ tin cậy.
- Quy tắc quyết định ở dạng kiểm tra được: điều kiện → hành động → độ ưu tiên.
- Thứ tự ưu tiên khi xung đột: 1 Storytelling > 2 Clarity > 3 Rhythm > 4 Visual style > 5 Decoration.
- Ba loại kiến thức phải tách bạch: **Rule** (quy tắc), **Technique** (cách thực hiện), **Reference** (ví dụ thực tế).
- `Video-analysis` tách "quan sát khách quan" khỏi "suy luận dựng phim"; skill này tôn trọng ranh giới đó và chỉ đọc metadata của nó.

## 5. Các hướng tiếp cận đã xem xét

| Hướng | Nội dung | Đánh đổi |
|---|---|---|
| A. Theo từng lớp | Viết hết Core, rồi hết Technique, rồi Typography… | Đơn giản, nhưng đến cuối mới biết AI dùng được hay không |
| **B. Lát cắt dọc (được chọn)** | Một phong cách + ít kỹ thuật, đủ mọi lớp ở mức mỏng, chạy end-to-end tới preview | Chứng minh vòng "4 câu hỏi" sớm; tốn thêm công làm renderer tối thiểu |
| C. Thư viện video mẫu trước | Phân tích hàng loạt video mẫu | Tốn nhất và sai thứ tự: phụ thuộc danh mục ID kỹ thuật chưa có |

Người dùng chọn B, mở rộng để gồm renderer preview.

## 6. Thiết kế

### 6.1. Hai hệ thống liên kết

- **Editing Intelligence** (ra quyết định): Editing Skill, Technique Library, Reference Library, Decision Engine.
- **Editing Execution** (biến quyết định thành video): renderer (Remotion là lựa chọn mặc định do người dùng nhắc tới) nhận EDL.

Hai hệ thống chỉ giao tiếp qua EDL và preset ID, để đổi engine render không phải viết lại kiến thức.

### 6.2. Cấu trúc thư mục (đích dài hạn; lát cắt đầu chỉ tạo phần in đậm)

```
Video-edit/
├── SKILL.md                      # điều phối, ngắn
├── core/                         # editing-principles, storytelling, pacing, composition, audio-principles
├── techniques/<nhóm>/            # index.md + từng kỹ thuật .md
├── typography/                   # font-catalog, pairing-rules, hierarchy, styles/
├── styles/                       # documentary.md, ...
├── references/                   # index, videos, projects (chỉ khung ở lát cắt đầu)
├── presets/                      # motion/typography/transition/sound .json
├── workflows/                    # video-analysis, edit-planning, editing-execution, quality-control
├── schema/                       # technique-doc, edl, preset, reference-segment
└── renderer/                     # renderer preview (lát cắt đầu)
```

### 6.3. Ba hợp đồng phải chốt trước khi viết nội dung

1. **Danh mục ID kỹ thuật** (ví dụ `punch_in`, `hard_cut`, `kinetic_text`, `j_l_cut`, `audio_ducking`). Technique doc, preset, reference segment, quy tắc quyết định đều tham chiếu cùng ID.
2. **Khuôn tài liệu kỹ thuật** gồm: mục đích; khi nên dùng; khi không nên; thông số (kèm nguồn + độ tin cậy); quy trình; biến thể; ví dụ thực tế; lỗi thường gặp (anti-patterns); điều kiện quyết định cho "có nên dùng ở ngữ cảnh này".
3. **Định dạng EDL.** Mỗi quyết định: `id`, `timestamp` (giây), `technique`, `preset`, `parameters`, `reason`, `reference` (tùy chọn), `confidence`. Kèm khối chiến lược ở đầu (style, pacing, visual_intensity, typography_style, transition_style, motion_style).

### 6.4. Quy trình sáu pha của skill

1. Video Understanding → 2. Editing Strategy → 3. Reference Retrieval → 4. Edit Planning (EDL) → 5. Execution (preview, rồi bản cuối sau xác nhận) → 6. Quality Control (visual: dễ đọc, tràn chữ, bố cục, lạm dụng hiệu ứng; audio: clipping, loudness, đồng bộ; timeline: khung đen, hở, trùng).

### 6.5. Decision Engine

Đầu vào: transcript, mức nhấn giọng, cảm xúc, ngữ cảnh cảnh quay, bố cục, phong cách hiện tại, các kỹ thuật vừa dùng. Quy tắc mẫu: câu quan trọng + cảm xúc ≥ trung bình → cân nhắc `punch_in`; không dùng liên tiếp cùng một kỹ thuật ở đoạn không quan trọng; nội dung trừu tượng không có B-roll → cân nhắc motion graphics/typography. Xung đột giải quyết theo thứ tự ưu tiên ở mục 4. Phong cách documentary cấm tự ý dùng glitch/bounce/RGB split.

### 6.6. Typography

Font catalog (đặc điểm, phù hợp/không phù hợp, weight, cỡ theo độ phân giải, line height, letter spacing, hoa/thường, màu, nền/đổ bóng, animation, font phối hợp được), preset kiểu chữ, quy tắc chọn font theo phong cách và vai trò chữ (emphasis, subtitle), quy tắc phối font. Lát cắt đầu chỉ cần đủ cho documentary và subtitle/kinetic text.

### 6.7. Reference Library (chỉ đặt khung ở lát cắt đầu)

Bốn cấp dữ liệu: video metadata → editing segments → technique analysis → keyframes/transcript, cùng index theo kỹ thuật/phong cách. Tái sử dụng được pipeline trích xuất của `Video-analysis` (ffmpeg, scene detect, silence) nhưng **không dùng chung schema**, vì mục đích khác (học kỹ thuật từ video đã dựng, không phải tìm footage thô). Cách dùng: truy xuất rồi rút ra kỹ thuật, không sao chép.

## 7. Lát cắt dọc đầu tiên (phạm vi giai đoạn 1)

- **Phong cách:** documentary / talking-head (nhận từ xác nhận của người dùng).
- **Năm kỹ thuật:** `punch_in`, `hard_cut`, `kinetic_text`, `j_l_cut`, `audio_ducking`.
- **Gồm:** SKILL.md; Editing Core mỏng; năm technique doc theo khuôn; style documentary; typography tối thiểu; ba schema ở mục 6.3; bộ quy tắc quyết định nhỏ; workflow sáu pha; renderer preview tối thiểu cho năm kỹ thuật.
- **Tiêu chí hoàn thành:** với một clip thật lấy từ `Video-analysis`, AI lập được EDL có lý do, render được preview, người dùng sửa một quyết định theo ID và preview được render lại đúng chỗ; không có hiệu ứng thừa trái với quy tắc documentary.

## 7b. Dữ liệu đầu vào thực tế và các quyết định bổ sung (sau builder check)

**Dữ liệu `Video-analysis` đã kiểm tra thực tế:** 44 clip DJI quay 17/11/2026 (4K HEVC, 29.97 fps, tiếng Việt, sự kiện Lễ khai giảng khóa Phân tích Dữ liệu): 22 `b_roll`, 13 `run_and_gun`, 9 `talking_head`. Mỗi `<video_id>/` có `summary.md` (YAML: duration, fps, resolution, language, video_type, mood, topics; Topic Map; Key Moments), `clips.md` (segment có mốc `HH:MM:SS.mmm`, `speech` là lời thoại trích dẫn từng đoạn, `camera`, `shot_type`, `editorial.roles`, `edit_points.in/out`, `quality`, `issues`) và `processing.json` (`scene_change_candidates`, `silence_ranges`). **Không có** timestamp theo từng từ, **không có** điểm nhấn giọng hay điểm cảm xúc. Hệ quả: Decision Engine suy ra mức quan trọng của câu nói từ chính văn bản lời thoại (do AI đánh giá) cộng với tín hiệu có sẵn (quãng lặng, `key moments`, `mood`); mốc thời gian chính xác ở cấp từ, nếu cần, lấy bằng bước phụ (ví dụ transcribe lại clip đó). Đây là đầu vào, không đổi `Video-analysis`.

**Quyết định của người viết (chưa được người dùng duyệt):**
- **Môi trường chạy:** skill dạng Claude Code skill (`SKILL.md` + tài liệu), cùng quy ước với `Video-analysis/.agents/skills`. Kèm một CLI nhỏ cho renderer, ví dụ `node renderer/cli.js preview --edl <file>` và `... final --edl <file>`, giống phong cách `node src/cli.js`. Nghiệm thu bằng chạy tay trên clip thật.
- **Footage và audio:** footage đọc từ file cục bộ. Vì nguồn là 4K HEVC nên preview dùng bản proxy (ffmpeg chuyển sang H.264 độ phân giải thấp); bản cuối dùng file gốc. Remotion xử lý cả hình lẫn tiếng (cắt, `j_l_cut`, `audio_ducking` bằng volume theo thời gian) trên cùng một đường code cho preview và bản cuối, để hai bản không lệch nhau. ffmpeg chỉ dùng để tạo proxy và đo loudness. Rủi ro: cắt nối audio chéo clip là phần khó nhất với renderer React, sẽ thử sớm.
- **Ngữ nghĩa EDL:** EDL là một timeline thật gồm danh sách clip theo thứ tự (`clip_id`, `source_in`, `source_out`) cộng các hiệu ứng gắn vào clip. Thời gian đầu ra được tính ra, không lưu cứng. Hiệu ứng neo vào `clip_id` + thời điểm trong nguồn, nên xóa hoặc dời một cú cắt không làm lệch các hiệu ứng còn lại. Hiệu ứng có `start` và `duration` (giây); riêng `hard_cut`, `j_l_cut` là thuộc tính của điểm nối giữa hai clip.
- **Giá trị `convention`:** chấp nhận các thông số tham khảo theo quy ước ngành (ví dụ scale punch-in 1.08–1.15, ducking khoảng −12 dB) với độ tin cậy ghi rõ; người dùng có thể chỉnh. Khi có thư viện reference, giá trị đo được (`observed`) sẽ thay dần.
- **Tiếng Việt:** footage và chữ trên video là tiếng Việt, nên font trong typography và renderer phải hỗ trợ đủ dấu tiếng Việt; quy tắc ngắt dòng cũng tính đến tiếng Việt.

## 8. Các lựa chọn do người viết tự quyết (người dùng chưa duyệt)

- Thông số tính theo giây, quy đổi frame ở bộ thực thi.
- Ghi nguồn và độ tin cậy cho mỗi thông số.
- Quy tắc quyết định viết ở dạng kiểm tra được.
- Dùng lại pipeline trích xuất của `Video-analysis`, không dùng chung schema.
- Remotion là engine render mặc định cho renderer preview.
- Ghi phản hồi người dùng để AI học dần: để giai đoạn sau.

## 9. Để lại cho người xây

- Ngôn ngữ tài liệu (đề xuất: văn xuôi tiếng Việt, ID và khóa JSON tiếng Anh).
- Độ phân giải/fps cụ thể của preview.
- Cách tách ID quyết định trong EDL (đánh số tuần tự hay theo timestamp).
- Chi tiết cách renderer áp từng kỹ thuật (easing, quy đổi giây ra frame).
- Cách lấy mốc thời gian cấp từ nếu một quyết định cần độ chính xác cao hơn dữ liệu `Video-analysis`.
