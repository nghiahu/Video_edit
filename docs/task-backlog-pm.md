# Backlog và nhật ký task — bản quản lý dự án

Phạm vi: **Video-analysis** (phân tích, lưu footage) và **Video-edit** (skill dựng video, thư viện hiệu ứng, renderer). `Tiem-edit-nho` chỉ là tham khảo, không có task.
Nguồn dữ liệu: các lần làm việc đã thực hiện, số liệu đọc lại từ file hiện có, và phản hồi của người dùng. Bản rút gọn: `docs/task-log-danh-sach.md`.

> **Trung thực về bằng chứng.** Mỗi tiêu chí chấp nhận (AC) ghi `✔` khi đã có bằng chứng trong phiên làm việc (lệnh chạy, số đo, ảnh đã xem) và `○` khi **chưa xác nhận**. Task chỉ được coi là *Hoàn thành* khi mọi AC bắt buộc là `✔`; còn `○` thì gọi là *Hoàn thành có điều kiện*. Lịch sử Video-analysis dựng lại từ trạng thái file và lời người dùng; không ghi ngày vì không còn dữ liệu đáng tin.

---

## 1. Thông tin chung

### 1.1 Mục tiêu sản phẩm
Một skill dựng video cho phép: đưa footage + metadata vào → agent lập **kịch bản và kế hoạch dựng (EDL)** có lý do → render **preview** → người dùng xác nhận hoặc sửa theo ID quyết định → chỉ khi đó mới render bản cuối.

### 1.2 Vai trò
| Vai trò | Ai | Trách nhiệm |
|---|---|---|
| Product Owner / Reviewer | Người dùng | Đặt yêu cầu, duyệt kịch bản và preview, quyết định đánh đổi, cho phép tải công cụ/mô hình |
| Thực hiện | Agent | Phân tích, viết tài liệu, lập trình renderer, kiểm thử, báo cáo trung thực |
| Nguồn dữ liệu | Video-analysis | Cung cấp footage và metadata (chỉ đọc từ phía Video-edit) |

### 1.3 Quy ước
- **Mã task:** `VA-NN` (Video-analysis), `VE-NN` (Video-edit).
- **Loại:** Feature · Bug · Doc (tài liệu/quy tắc) · QA (kiểm thử) · Chore (dọn dẹp, dữ liệu) · Spike (tìm hiểu để quyết định).
- **Ưu tiên (MoSCoW):** Must · Should · Could · Won't (lần này).
- **Cỡ (ước lượng tương đối, của tôi, không phải số giờ):** S nhỏ · M vừa · L lớn · XL rất lớn.
- **Trạng thái:** `Hoàn thành` · `Hoàn thành có điều kiện` · `Tạm tắt` · `Đã xóa` · `Mở` · `Bị chặn` (chờ quyết định hoặc phụ thuộc).

### 1.4 Định nghĩa Hoàn thành (DoD)
Một task *Hoàn thành* khi: (1) sản phẩm bàn giao tồn tại và đúng chỗ; (2) `validate` không lỗi và `check-docs` không lỗi nếu có tài liệu; (3) đã **xem hoặc đo** kết quả (ảnh khung, số đo), không chỉ tin vào `validate`; (4) những gì chưa xem/nghe/chạy được ghi rõ; (5) quy tắc mới rút ra được ghi vào tài liệu.

---

## 2. Tổng quan epic và cột mốc

| Epic | Nội dung | Task | Trạng thái |
|---|---|---|---|
| E1 | Video-analysis: phân tích và lưu footage | VA-01…VA-06 | Phần lớn xong; mốc theo từ còn mở |
| E2 | Nền tảng skill và quy trình | VE-01…VE-06 | Xong; thiếu style ngoài documentary |
| E3 | Renderer | VE-07…VE-09 | Preview chạy; chưa có bản final, chưa chuẩn hóa âm lượng |
| E4 | Camera, thời gian, màu, âm thanh | VE-10…VE-11 | Có điều kiện; zoom tạm tắt |
| E5 | Chuyển cảnh | VE-12 | Hoàn thành có điều kiện |
| E6 | Hệ chữ | VE-13…VE-20 | Có điều kiện (chưa xem hoạt ảnh vào/ra) |
| E7 | Chữ theo lời nói | VE-21 | Chờ mốc từng từ |
| E8 | Hướng dẫn, quy tắc, skill `/edit` | VE-22…VE-27 | Xong; `/edit` chưa chạy thử |
| E9 | Kiểm thử | VE-28…VE-29 | Có điều kiện |
| E10 | Quản trị, dọn dẹp | VE-30…VE-34 | Xong; còn dẫn chiếu hỏng |

**Cột mốc (không gắn ngày):**
- **M1 Nền tảng** — E1, E2, E3 (preview): đạt.
- **M2 Thư viện hiệu ứng** — E4–E6: đạt có điều kiện.
- **M3 Kiểm chứng và video thật đầu tiên** — chạy `/edit`, xem/nghe bổ sung, bản final: **chưa đạt**.
- **M4 Chữ theo lời và hoàn thiện** — mốc từng từ thật, style mới, tracked/vertical text: **chưa bắt đầu**.

---

## 3. Task chi tiết

### E1 — Video-analysis

#### VA-01. Công cụ dòng lệnh phân tích footage
- **Loại / Ưu tiên / Cỡ:** Feature · Must · L
- **Trạng thái:** Hoàn thành
- **Mô tả:** Là người quản lý kho footage, tôi muốn một CLI trích tín hiệu kỹ thuật và dựng khung metadata để việc phân tích nội dung lặp lại được và kiểm tra được.
- **Phạm vi:** `status`, `prepare`, `validate`, `finalize`, `sync`, `search`, `clean`; ffprobe, `scdet`, `silencedetect`, cắt đoạn thông minh. **Ngoài phạm vi:** nhận dạng giọng nói, OCR.
- **AC:** ✔ có đủ 7 lệnh trong `src/cli.js` · ✔ trích tín hiệu ghi vào `processing.json` (có ở 44 video) · ○ chưa chạy lại lệnh `validate` toàn kho trong phiên này.
- **Bàn giao:** `Video-analysis/src/cli.js`, `src/lib/*`.
- **Ghi chú:** không có ASR trong mã; lời thoại do mô hình khác chép (xem VA-03).

#### VA-02. Chuẩn cấu trúc metadata v2
- **Loại / Ưu tiên / Cỡ:** Doc · Must · M
- **Trạng thái:** Hoàn thành
- **Mô tả:** Tách dữ liệu **quan sát** khỏi **suy luận dựng phim**; mỗi video gồm `processing.json`, `summary.md`, `clips.md`; chỉ mục dẫn xuất sinh tự động.
- **AC:** ✔ tài liệu `knowledges/video-analysis-schema.md` · ✔ cả 44 video theo đúng cấu trúc ba file.
- **Bàn giao:** `knowledges/video-analysis-schema.md`.

#### VA-03. Phân tích 44 video
- **Loại / Ưu tiên / Cỡ:** Chore (dữ liệu) · Must · XL
- **Trạng thái:** Hoàn thành có điều kiện
- **Mô tả:** Mô tả hình ảnh, lời thoại, chủ đề, vai trò dựng và độ tin cậy cho từng đoạn của footage Lễ khai giảng Phân tích Dữ liệu.
- **AC:** ✔ 44/44 video `completed`, pipeline `2.0` · ✔ 54 segment · ○ lời thoại chưa nghe lại bằng người (có `speech: low/medium`, tên bị che) · ○ **không có mốc theo từng từ**.
- **Số liệu:** tổng khoảng 533 giây.
- **Rủi ro:** dùng lời thoại làm chữ trên hình mà chưa nghe lại có thể sai chữ (xem `R-SRC-1`).

#### VA-04. Chỉ mục và tìm kiếm
- **Loại / Ưu tiên / Cỡ:** Feature · Should · S
- **Trạng thái:** Hoàn thành
- **AC:** ✔ `INDEX.md`, `TOPICS.md`, `SUBJECTS.md` sinh bằng `sync` · ✔ `search` lọc theo category/tag/topic/role/type/usable/standalone/priority.

#### VA-05. Lấy mốc theo từng từ (nhận dạng giọng nói)
- **Loại / Ưu tiên / Cỡ:** Spike → Feature · Should · L
- **Trạng thái:** Bị chặn (chờ quyết định của người dùng)
- **Mô tả:** Là biên tập viên, tôi muốn mốc thời gian từng từ để làm karaoke, tô từ khóa và phụ đề theo lời.
- **Lựa chọn đã nêu:** (a) tải mô hình nhận dạng (Whisper hoặc PhoWhisper; máy đã có `torch`, `transformers`, chưa có mô hình; cần tải) · (b) người dùng cung cấp file phụ đề có mốc từ · (c) phụ đề theo câu dựa trên khoảng lặng thật (không cần tải gì, không làm được karaoke).
- **AC:** ○ chọn hướng · ○ đầu ra đúng định dạng `words: [{text, start, end}]` kèm `words_source: asr|manual|subtitle_file` · ○ so với `clips.md` trên một đoạn ngắn, báo mức lệch · ○ không tự sửa lời.
- **Phụ thuộc:** quyết định của người dùng (và đồng ý tải nếu chọn a).
- **Rủi ro:** độ chính xác tiếng Việt trong phòng vang chưa thử trên máy.

#### VA-06. Rà soát lời thoại trong metadata
- **Loại / Ưu tiên / Cỡ:** Chore · Should · M
- **Trạng thái:** Mở
- **Mô tả:** Người dùng nghe đối chiếu các `speech` có độ tin cậy thấp trước khi dùng làm chữ trên hình.
- **AC:** ○ danh sách đoạn `speech: low` cần nghe · ○ sửa hoặc đánh dấu từng đoạn.
- **Ghi chú:** agent không nghe được âm thanh nên cần người dùng.

---

### E2 — Nền tảng skill và quy trình

#### VE-01. Chốt phạm vi và đầu ra
- **Loại / Ưu tiên / Cỡ:** Spike · Must · S · **Hoàn thành**
- **Kết quả:** Video-analysis đã xong; Video-edit là phần phát triển chính; Tiem-edit-nho chỉ tham khảo; đầu ra là kế hoạch + preview, render cuối sau khi duyệt.
- **AC:** ✔ người dùng xác nhận đầu ra ("Đầu ra của kế hoạch và video bản preview, sau khi tôi xác nhận rồi sẽ render").

#### VE-02. Skill điều phối và quy trình 6 pha
- **Loại / Ưu tiên / Cỡ:** Doc · Must · L · **Hoàn thành**
- **Bàn giao:** `SKILL.md`; `workflows/` (video-analysis, edit-planning, editing-execution, quality-control).
- **AC:** ✔ 6 pha có tài liệu từng pha · ✔ liên kết giữa tài liệu đều tồn tại (đã kiểm) · ○ chưa chạy trọn vòng bằng `/edit`.

#### VE-03. Decision Engine và quy tắc quyết định
- **Loại / Ưu tiên / Cỡ:** Doc · Must · M · **Hoàn thành**
- **Bàn giao:** `core/` (nguyên tắc, nhịp, kể chuyện, bố cục, âm thanh), `core/decision-engine.md` (5 bước kiểm tra, quy tắc `R-*`).
- **AC:** ✔ thứ tự ưu tiên Storytelling > Clarity > Rhythm > Style > Decoration · ✔ mỗi quyết định EDL bắt buộc có `reason`.

#### VE-04. Định dạng EDL v1.0 và kiểm tra hợp lệ
- **Loại / Ưu tiên / Cỡ:** Feature · Must · L · **Hoàn thành**
- **Mô tả:** EDL dùng giây, neo vào clip + `source_time`, trạng thái `proposed|approved|removed`, sửa theo ID.
- **AC:** ✔ `schema/edl.md` · ✔ `validate` kiểm khóa, preset, ngân sách, hold tối thiểu, style bị cấm, phạm vi mốc nguồn · ✔ `examples/edl-documentary-mini.json` hợp lệ.

#### VE-05. Style documentary
- **Loại / Ưu tiên / Cỡ:** Doc · Must · M · **Hoàn thành**
- **AC:** ✔ ngân sách hiệu ứng, kỹ thuật cho phép/cấm · ✔ preset cấm style bị `validate` chặn.

#### VE-06. Thêm style ngoài documentary
- **Loại / Ưu tiên / Cỡ:** Doc · Should · L · **Mở**
- **Mô tả:** Hiện chỉ documentary có file; bậc cường độ khác chỉ là gợi ý (độ tin cậy thấp).
- **AC:** ○ người dùng nêu loại style cần (sự kiện sôi động, vlog, quảng bá…) · ○ file style kèm ngân sách và danh sách cho/cấm · ○ preset gắn `allowed_styles` đúng.
- **Phụ thuộc:** thông tin từ người dùng về style.

---

### E3 — Renderer

#### VE-07. Renderer preview (Remotion + ffmpeg)
- **Loại / Ưu tiên / Cỡ:** Feature · Must · XL · **Hoàn thành có điều kiện**
- **Mô tả:** `validate`, `preview` (proxy 540p → 960×540), `final` (từ chối khi còn `proposed` hoặc mốc từ `estimated`).
- **AC:** ✔ preview chạy trên nhiều EDL, đúng độ dài dự kiến · ✔ cổng chặn `final` hoạt động trong mã · ○ **chưa chạy `final`** · ○ phần mềm chưa thử trên footage 4K ở độ phân giải đầu ra thật.

#### VE-08. Render thử bản final
- **Loại / Ưu tiên / Cỡ:** QA · Must · M · **Mở**
- **AC:** ○ một EDL đã duyệt render ra độ phân giải `project.resolution` · ○ QC bản final (khung đen, loudness, đồng bộ) · ○ thời gian render ghi lại.
- **Phụ thuộc:** một video thật được duyệt (VE-34).

#### VE-09. Chuẩn hóa âm lượng
- **Loại / Ưu tiên / Cỡ:** Feature · Should · M · **Mở**
- **Mô tả:** Preview từng đo −27,4 LUFS (video khai giảng), thấp hơn mục tiêu của `quality-control.md`.
- **AC:** ○ bước chuẩn hóa vào mục tiêu LUFS theo nền tảng · ○ đo trước và sau · ○ đỉnh không vượt −1 dBFS.
- **Ghi chú:** nghe thật cần người dùng.

---

### E4 — Camera, thời gian, màu, âm thanh

#### VE-10. Kỹ thuật camera, thời gian, màu, âm thanh
- **Loại / Ưu tiên / Cỡ:** Feature · Must · XL · **Hoàn thành có điều kiện**
- **Phạm vi:** `punch_in/out`, `slow_push`, `color_grade_basic`, `vignette`, `time_lapse`, `freeze_frame`, `fade_in_out`, `speed_ramp_transition`, `whoosh_synced_cut`, `audio_ducking`, `j_l_cut`, `lower_third`, `subtitles`, `kinetic_text`; mỗi kỹ thuật một tài liệu 10 mục và preset.
- **AC:** ✔ `fade_in` (độ sáng 0 → ~124 trong 1 s) và `freeze_frame` (đứng 1,03 s) đo bằng ffmpeg · ✔ nhãn, phụ đề, khối tên, chữ nhấn hiện đúng · ○ chưa xác nhận bằng mắt/tai: `time_lapse`, `speed_ramp_transition`, `whoosh_synced_cut`, `j_l_cut`, `audio_ducking`, màu, vignette.

#### VE-11. Sửa zoom giật và tạm tắt zoom
- **Loại / Ưu tiên / Cỡ:** Bug · Must · M · **Hoàn thành; zoom Tạm tắt**
- **Mô tả:** Người dùng báo zoom giật, rồi "hơi zoom một chút rồi thả ra, trông buồn cười", sau đó yêu cầu bỏ.
- **Nguyên nhân đã tìm:** `ease_out` làm khung đầu nhảy 1,9% scale; `return: cut` đưa scale về 1.0 trong một khung (7% và 12%); sau sửa lần 1 vẫn là nhịp vào–ra ngắn.
- **Đã làm:** `ease_in_out`, giữ zoom đến điểm cắt, cảnh báo zoom quá ngắn/dài, `zoom-guide.md`.
- **AC:** ✔ số đo bước scale lớn nhất (7,00% → 0,62%; 12,00% → 1,61%) · ✔ render đối chiếu bằng `YDIF` · ○ chưa xem bằng mắt trên video thật.
- **Quyết định cuối:** quy tắc `R-ZOOM-0` — không tự dùng zoom, chỉ khi người dùng yêu cầu.

---

### E5 — Chuyển cảnh

#### VE-12. Thư viện 31 kiểu chuyển cảnh
- **Loại / Ưu tiên / Cỡ:** Feature · Should · XL · **Hoàn thành có điều kiện**
- **Mô tả:** Bảng `TRANSITIONS` (kiểu chồng cần tay cầm, kiểu tuần tự), 50 preset, tài liệu từng kiểu, quy tắc giãn cách ≥ 3 s, `flash_strobe` ≤ 3 lần/giây.
- **AC:** ✔ `validate` hợp lệ · ✔ quét tự động: không đứng hình, chỉ một đoạn đen 0,13 s đúng với `dip_to_black` · ○ chưa xem từng chuyển cảnh bằng mắt trong lượt kiểm thử cuối.

---

### E6 — Hệ chữ

#### VE-13. Hệ phông chữ
- **Loại / Ưu tiên / Cỡ:** Feature · Must · M · **Hoàn thành**
- **Kết quả:** Inter theo giao diện Rikkei Edu; đăng ký 22 phông thêm (tổng 23), phân nhóm và vai trò; có ảnh mẫu; loại Poppins vì thiếu bộ chữ tiếng Việt.
- **AC:** ✔ `font-registry.json` · ✔ `validate` chặn phông chưa đăng ký hoặc sai vai trò · ✔ ảnh mẫu đã xem.

#### VE-14. Lớp kiểu chữ dùng chung và đợt 1
- **Loại / Ưu tiên / Cỡ:** Feature · Must · L · **Hoàn thành có điều kiện**
- **Phạm vi:** `TextBlock` + `_text_style_base` + preset; `text_pill`, `text_box`, `stacked_text`, `title_card`, `big_text`, `marker_highlight`.
- **AC:** ✔ xem ảnh khung các preset · ○ hoạt ảnh vào/ra chưa xem.

#### VE-15. Đợt 2
- **Loại / Ưu tiên / Cỡ:** Feature · Should · L · **Hoàn thành có điều kiện**
- **Phạm vi:** `chapter_title`, `pull_quote`, `big_number` (đếm số kiểu Việt), `bullet_list_reveal`, `location_tag`, `text_sticker`, `speech_bubble`, `callout_label`, `social_tag`.
- **AC:** ✔ xem khung tĩnh 25 preset · ○ biểu tượng `user`, `star`, đuôi bong bóng ở hướng khác chưa xem · ○ callout cố định, không bám vật chuyển động.

#### VE-16. Đợt 4
- **Loại / Ưu tiên / Cỡ:** Feature · Should · L · **Hoàn thành có điều kiện**
- **Phạm vi:** `typewriter_text`, `scramble_text`, `glitch_text` (nháy 2 lần, dừng, nháy lần cuối rồi biến mất), `text_cutout` (kèm `cutout_dive`), `text_on_path` (chữ chạy dần ra từ một phía).
- **AC:** ✔ xem ảnh nhiều thời điểm cho 13 preset · ✔ đo nhịp nháy glitch bằng độ bão hòa theo khung (đúng 0,1–0,35 / 0,5–0,75 / 1,7–2,0 s) · ○ độ an toàn nhấp nháy với người nhạy ánh sáng chưa đo tần số · ○ typewriter nhiều dòng, chữ dài phủ kín vòng tròn chưa xem.

#### VE-17. Đợt 5
- **Loại / Ưu tiên / Cỡ:** Feature · Could · L · **Hoàn thành có điều kiện**
- **Phạm vi:** `progress_bar`, `countdown_timer`, `credits_roll`, `comparison_table`.
- **AC:** ✔ xem khung tĩnh 8 preset nhiều thời điểm · ✔ `validate` ước lượng thời gian cuộn so với chiều cao danh sách · ○ bảng 4 cột, danh sách rất dài, đồng hồ > 59 giây chưa xem · ○ không phát tiếng bíp.

#### VE-18. Sửa lỗi hiển thị chữ
- **Loại / Ưu tiên / Cỡ:** Bug · Must · M · **Hoàn thành**
- **Đã sửa (đều do người dùng phát hiện hoặc kiểm thử phát hiện):** dòng HOA có dấu chèn nhau (`line_height`, `line_gap`), vệt bút dạ tô nửa vời, mục danh sách hiện cùng lúc (`item_delay`), con trỏ đánh máy nằm dưới hàng chữ, đường sóng làm chữ đè nhau, vòng tròn quá to, nhãn thử đè lên chữ.
- **AC:** ✔ mỗi lỗi có render xem lại sau sửa.

#### VE-19. Kiểm hoạt ảnh vào/ra của các kiểu chữ
- **Loại / Ưu tiên / Cỡ:** QA · Should · M · **Mở**
- **Mô tả:** Chưa lượt nào xem hoạt ảnh vào/ra của các preset (chỉ khung tĩnh khi chữ hiện đủ).
- **AC:** ○ lấy khung ở 3 thời điểm đầu/giữa/cuối của in và out cho từng kỹ thuật · ○ ghi lỗi và sửa · ○ cập nhật mục "Chưa kiểm chứng" trong tài liệu kỹ thuật.

#### VE-20. Chữ dọc và chữ bám vật chuyển động
- **Loại / Ưu tiên / Cỡ:** Feature · Could · XL · **Mở**
- **Mô tả:** `vertical_text` (hiện dùng tạm `rotate`), `tracked_text` (cần theo dõi chuyển động; chưa có công cụ).
- **AC:** ○ chọn cách tracking (công cụ như OpenCV, hoặc người dùng chấm mốc rồi nội suy) · ○ `callout_label` bám theo vật.
- **Phụ thuộc:** quyết định về công cụ tracking.

---

### E7 — Chữ theo lời nói

#### VE-21. Phụ đề theo lời (đợt 3): hiển thị
- **Loại / Ưu tiên / Cỡ:** Feature · Should · L · **Hoàn thành có điều kiện**
- **Phạm vi:** `word_highlight`, `word_by_word_text`, `karaoke_subtitles`, `shortform_captions`; định dạng `words` + `words_source`.
- **AC:** ✔ xem hiển thị 8 preset với mốc ước lượng · ✔ `validate` chặn mốc chồng, thiếu nguồn, mốc trước điểm neo · ✔ `final` từ chối khi còn `estimated` · ○ độ khớp với lời thật chưa kiểm (cần VA-05) · ○ clip có đổi tốc độ sẽ lệch mốc (chỉ cảnh báo).
- **Phụ thuộc:** VA-05.

---

### E8 — Hướng dẫn, quy tắc, skill `/edit`

#### VE-22. Hướng dẫn chọn hiệu ứng
- **Loại / Ưu tiên / Cỡ:** Doc · Must · M · **Hoàn thành**
- **Bàn giao:** `core/effect-selection.md` (nhu cầu → kỹ thuật, chuyển cảnh theo ý nghĩa, bảng "cảnh nào dùng gì", bậc cường độ, preset hợp documentary sinh từ file preset).
- **AC:** ✔ `check-docs` không lỗi · ○ các bậc cường độ ngoài documentary là quy ước (tin cậy thấp), chưa kiểm với người dùng.

#### VE-23. Hướng dẫn lên kịch bản
- **Loại / Ưu tiên / Cỡ:** Doc · Must · M · **Hoàn thành**
- **Bàn giao:** `workflows/script-writing.md` (7 bước từ đề bài đến trình duyệt, bảng cảnh mẫu, checklist tự duyệt).
- **AC:** ✔ mọi tài liệu dẫn chiếu tồn tại · ○ chưa dùng để lên kịch bản một video mới.

#### VE-24. Quy tắc không đè chủ thể (`R-SUBJ-1`)
- **Loại / Ưu tiên / Cỡ:** Feature + Doc · Must · M · **Hoàn thành có điều kiện**
- **Nguồn:** người dùng phản ánh chữ/hiệu ứng đè lên mặt diễn giả.
- **Đã làm:** trường `subject_box` của clip; `validate` ước lượng vùng chữ và cảnh báo khi chồng > 20%; cảnh báo riêng cho callout chỉ vào người.
- **AC:** ✔ chạy trên video test: 15 chỗ nghi đè được liệt kê · ○ vùng chữ chỉ ước lượng thô, `subject_box` mới ước lượng bằng mắt và dùng chung · ○ **chưa chuyển các chữ ra khỏi diễn giả** trong video thử (người dùng chưa quyết).

#### VE-25. Quy tắc nguồn nội dung (`R-SRC-1`) và chốt chặn final
- **Loại / Ưu tiên / Cỡ:** Doc + Feature · Must · S · **Hoàn thành**
- **Nguồn:** người dùng hỏi nội dung chữ thử lấy từ đâu; xác nhận chữ thử là do agent tự đặt.
- **AC:** ✔ `words_source` bắt buộc · ✔ `final` từ chối mốc `estimated` · ✔ quy tắc ghi vào `SKILL.md`, `decision-engine.md`.

#### VE-26. Quy tắc không tự dùng zoom (`R-ZOOM-0`)
- **Loại / Ưu tiên / Cỡ:** Doc · Must · S · **Hoàn thành**
- **AC:** ✔ ghi vào `SKILL.md`, `decision-engine.md`, `effect-selection.md`, `zoom-guide.md` · ○ `validate` chưa chặn zoom (quy tắc chỉ là hướng dẫn cho agent).

#### VE-27. Skill `/edit` (từ đầu đến preview)
- **Loại / Ưu tiên / Cỡ:** Feature · Must · M · **Hoàn thành có điều kiện**
- **Mô tả:** Gõ `/edit <yêu cầu>`: agent đọc quy trình, lập kịch bản, EDL, validate, render preview, QC, báo cáo và dừng chờ duyệt.
- **Bàn giao:** `.claude/skills/edit/SKILL.md`.
- **AC:** ✔ mọi đường dẫn tham chiếu tồn tại · ○ **chưa chạy thử trên yêu cầu thật** · ○ cần mở phiên trong `Video-edit` (có thể phải khởi động lại để nhận skill).

---

### E9 — Kiểm thử

#### VE-28. Kịch bản kiểm thử tổng hợp
- **Loại / Ưu tiên / Cỡ:** QA · Must · L · **Hoàn thành có điều kiện**
- **Bàn giao:** `tests/kich-ban-test-tong-hop.md`; ba phần A (camera/thời gian/màu/âm), B (31 chuyển cảnh), C (29 preset chữ).
- **AC:** ✔ xem 1 khung cho cả 29 preset chữ · ✔ quét tự động phần B · ○ phần A chỉ đo `fade_in`, `freeze_frame`; còn lại chưa xác nhận · ○ **các project thử đã bị xóa** (VE-32), tài liệu còn nhắc tới.

#### VE-29. Xem và nghe bổ sung
- **Loại / Ưu tiên / Cỡ:** QA · Should · M · **Mở**
- **AC:** ○ người dùng nghe J/L cut và ducking · ○ xem `time_lapse`, `speed_ramp`, `whoosh`, màu, vignette · ○ xem từng chuyển cảnh trong phần B.
- **Ghi chú:** phần nghe chỉ người dùng làm được.

---

### E10 — Quản trị và dọn dẹp

#### VE-30. Nhật ký task
- **Loại / Ưu tiên / Cỡ:** Doc · Should · S · **Hoàn thành**
- **Bàn giao:** `docs/task-log.md`, `docs/task-log-danh-sach.md`, tài liệu này.

#### VE-31. Video thật: tổng kết lễ khai giảng
- **Loại / Ưu tiên / Cỡ:** Feature · Must · XL · **Đã xóa**
- **Kết quả đã có:** kịch bản, EDL, preview; người dùng từng duyệt kịch bản và xem lỗi hiển thị.
- **AC:** ○ chưa đối chiếu từng chữ với metadata · ○ chưa đóng gói bản final.
- **Ghi chú:** bị xóa cùng thư mục `projects/` theo yêu cầu.

#### VE-32. Dọn thư mục `projects/`
- **Loại / Ưu tiên / Cỡ:** Chore · Should · S · **Hoàn thành**
- **Kết quả:** xóa vĩnh viễn 16 thư mục (12 demo, `khai-giang-recap`, `test-tong-hop-a/c`, `test-zoom`).
- **Hệ quả:** script sinh bài test (ở thư mục tạm của phiên) không tái tạo được phần A; tài liệu đợt 3–5 và `tests/…` còn dẫn chiếu hỏng.

#### VE-33. Sửa dẫn chiếu tới project đã xóa
- **Loại / Ưu tiên / Cỡ:** Chore · Should · S · **Mở**
- **AC:** ○ rà `grep` mọi tài liệu nhắc `projects/demo*` và `test-tong-hop*` · ○ đổi thành "đã xóa" hoặc bỏ ví dụ · ○ `check-docs` vẫn không lỗi.

#### VE-34. Dựng lại video khai giảng bằng `/edit`
- **Loại / Ưu tiên / Cỡ:** Feature · Could · XL · **Mở**
- **Mô tả:** Dựng lại từ đầu sau khi xóa, tuân thủ `R-SUBJ-1`, `R-SRC-1`, `R-ZOOM-0`.
- **Phụ thuộc:** VE-27 (chạy thử `/edit`), VA-06 (lời thoại), yêu cầu cụ thể từ người dùng.

---

## 4. Rủi ro và vấn đề đang mở (RAID)

| # | Loại | Nội dung | Mức | Giảm thiểu / Chủ |
|---|---|---|---|---|
| R1 | Rủi ro | Lời thoại trong metadata do mô hình khác chép, có đoạn tin cậy thấp; dùng làm chữ có thể sai | Cao | Nghe lại (VA-06); `R-SRC-1`; Người dùng |
| R2 | Rủi ro | Bản final chưa từng render; có thể lộ lỗi chỉ xuất hiện ở độ phân giải gốc | Cao | VE-08; Agent + Người dùng |
| R3 | Rủi ro | Agent không nghe được âm thanh; lỗi J/L cut, ducking, âm lượng có thể sót | Cao | Người dùng nghe (VE-29) |
| R4 | Rủi ro | Hoạt ảnh vào/ra của chữ chưa xem lượt nào | Trung bình | VE-19 |
| R5 | Rủi ro | Chữ có thể đè chủ thể; `subject_box` mới là ước lượng thô, dùng chung | Trung bình | Khai báo từng clip; xem preview |
| R6 | Giả định | Chỉ documentary có style file; bậc cường độ khác là quy ước | Trung bình | VE-06 |
| R7 | Phụ thuộc | Chữ theo lời cần mốc từng từ thật | Cao | VA-05 (chờ quyết định) |
| R8 | Vấn đề | Tài liệu còn dẫn chiếu tới project đã xóa; script sinh bài test không còn | Thấp | VE-33 |
| R9 | Rủi ro | Mô hình nhận dạng cần tải (dung lượng vài trăm MB tới hơn 1 GB) | Trung bình | Cần đồng ý trước khi tải |

---

## 5. Đề xuất ưu tiên cho vòng làm tiếp

| Thứ tự | Task | Lý do | Cần quyết định gì |
|---|---|---|---|
| 1 | VE-27 → VE-34: chạy thử `/edit` rồi dựng lại một video thật | Kiểm chứng cả quy trình, ra sản phẩm đầu tiên, lộ lỗi sớm | Yêu cầu video cụ thể |
| 2 | VE-29 / VE-19: xem và nghe bổ sung | Nhiều hiệu ứng chưa kiểm bằng mắt/tai (R3, R4) | Người dùng nghe giúp |
| 3 | VE-08: render thử `final` | Gỡ R2 | Sau khi có preview được duyệt |
| 4 | VA-05 → VE-21: mốc theo từng từ | Mở khóa karaoke và tô từ khóa | Chọn hướng (a/b/c) và đồng ý tải nếu cần |
| 5 | VE-33, VE-06, VE-09 | Dọn nợ tài liệu, thêm style, chuẩn hóa âm lượng | Loại style cần thêm |

---

## 6. Mẫu thẻ task

```markdown
#### <MÃ>. <Tên ngắn, động từ + đối tượng>
- **Loại / Ưu tiên / Cỡ:** <Feature|Bug|Doc|QA|Chore|Spike> · <Must|Should|Could|Won't> · <S|M|L|XL>
- **Trạng thái:** <Hoàn thành|Hoàn thành có điều kiện|Tạm tắt|Đã xóa|Mở|Bị chặn>
- **Mô tả:** Là <vai trò>, tôi muốn <việc> để <giá trị>.
- **Phạm vi:** trong: … · ngoài: …
- **AC:** ✔/○ <tiêu chí kiểm được, có bằng chứng>
- **Bàn giao:** <file, lệnh>
- **Phụ thuộc:** <mã task hoặc quyết định>
- **Rủi ro / Ghi chú:** …
```
