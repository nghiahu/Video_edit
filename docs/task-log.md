# Nhật ký task — Video-analysis và Video-edit

Tài liệu này ghi lại các task đã làm ở **hai dự án** của bộ tài liệu edit:
- **Video-analysis** (`E:\Bộ tài liệu edit\Video-analysis`): phân tích và lưu footage gốc thành metadata có thể tìm kiếm.
- **Video-edit** (`E:\Bộ tài liệu edit\Video-edit`): skill dựng video, thư viện hiệu ứng, renderer preview.

(`Tiem-edit-nho` chỉ là phần tham khảo, không tính task.)

> **Cách đọc độ tin cậy.** Mỗi task có trạng thái và bằng chứng. Phần Video-analysis được dựng lại từ **trạng thái file hiện có** (dấu thời gian, số liệu trong metadata) và từ lời người dùng; lịch sử chi tiết lúc làm không còn trong phiên này nên không ghi ngày từng bước. Phần Video-edit ghi theo thứ tự làm. Chỗ nào chưa kiểm chứng đều ghi rõ.

Trạng thái: `xong` · `xong, có giới hạn` · `đã bỏ/tạm tắt` · `chưa làm`.

---

## 1. Tóm tắt nhanh

| Dự án | Việc chính | Trạng thái |
|---|---|---|
| Video-analysis | CLI phân tích, chuẩn metadata v2, 44 video đã phân tích | xong, có giới hạn (không có mốc theo từ) |
| Video-edit | Skill dựng video, Decision Engine, EDL, renderer preview | xong, preview chạy; bản final chưa từng render |
| Video-edit | Thư viện hiệu ứng: camera, thời gian, màu, âm thanh, 31 chuyển cảnh, hệ chữ đợt 0–5 | xong, có giới hạn (hoạt ảnh vào/ra chưa xem hết) |
| Video-edit | Skill `/edit`, hướng dẫn chọn hiệu ứng, lên kịch bản | xong, chưa chạy thử |
| Video-edit | Zoom | tạm tắt theo yêu cầu người dùng |
| Cả hai | Chữ theo lời nói cần mốc từng từ | phần hiển thị xong, nguồn mốc chưa có |

---

## 2. Video-analysis

### VA-01. Công cụ CLI phân tích footage — `xong`
`src/cli.js` + `src/lib/*` (ffmpeg, prepare, validate, sync, search, utils). Lệnh: `status`, `prepare <video>`, `validate <video_id>`, `finalize <video_id>`, `sync`, `search`, `clean`.
- Phần máy làm bằng ffmpeg: đọc thông số (ffprobe), tìm điểm chuyển cảnh có thể có (`scdet`), khoảng lặng (`silencedetect`), cắt đoạn thông minh để đưa cho mô hình xem, dựng khung `summary.md`/`clips.md`.
- **Không có nhận dạng giọng nói hay OCR trong mã.**
- Bằng chứng: thư mục `src/` có mặt, sửa lần cuối ngày 2026-11-20 (dấu thời gian file).

### VA-02. Chuẩn cấu trúc metadata v2 (thuần Markdown) — `xong`
`knowledges/video-analysis-schema.md`: tách **Observed** (quan sát) khỏi **Editorial** (suy luận dựng phim); `processing.json` (manifest, sha256, tín hiệu kỹ thuật), `summary.md` (thông số, Topic Map, Key Moments), `clips.md` (segment có thể tìm kiếm và tái dùng). Chỉ mục dẫn xuất `INDEX.md`, `TOPICS.md`, `SUBJECTS.md` sinh bằng `sync`.

### VA-03. Phân tích 44 video — `xong, có giới hạn`
Theo số liệu đọc từ `processing.json` và `clips.md` trong phiên này:
- 44 video trong `videos/`, cả 44 có metadata, trạng thái `completed`, pipeline `2.0`.
- Tổng thời lượng khoảng 533 giây; 54 segment trong các `clips.md`.
- Trích xuất tín hiệu kỹ thuật từ khoảng 2026-11-20 07:37 đến 08:02 (UTC) theo `processing.json`.
- Nội dung sự kiện: Lễ khai giảng chương trình đào tạo Phân tích Dữ liệu (cảnh phòng học, MC, diễn giả, học viên).
- **Giới hạn:** lời thoại, mô tả và độ tin cậy do một **mô hình khác** xem và nghe video rồi viết tay vào `clips.md`, có chỗ `speech: low/medium` và tên bị che (`[đơn vị chuyển đổi số]`). **Không có mốc theo từng từ**; mốc chỉ theo đoạn clip.
- Trạng thái "đã hoàn thành" theo lời người dùng; tôi chưa kiểm lại từng clip.

### VA-04. Chỉ mục và tìm kiếm — `xong`
`INDEX.md` (mục lục 44 video, thể loại, tag, topic), `TOPICS.md` (chỉ mục ngược chủ đề), `SUBJECTS.md` (danh bạ chủ thể, 12 dòng), `search` lọc theo `category/tag/query/topic/role/type/usable/standalone/priority`.

### Việc còn mở của Video-analysis
- Mốc theo từng từ cho chữ theo lời nói: chưa có công cụ (nhận dạng giọng nói) trong máy; đã đề xuất hai hướng (tải mô hình Whisper/PhoWhisper, hoặc file phụ đề có mốc từ), **chờ người dùng quyết**.
- Lời thoại trong `clips.md` chưa được nghe lại bằng người; cần đối chiếu trước khi dùng làm chữ trên hình.

---

## 3. Video-edit — theo thứ tự làm

### Nền tảng

**VE-01. Xác định cấu trúc dự án và phạm vi** — `xong`
Chốt: Video-analysis đã xong; Video-edit là phần phát triển chính; Tiem-edit-nho chỉ tham khảo. Đầu ra mong muốn: kế hoạch (EDL) + video preview, người dùng xác nhận rồi mới render bản cuối.

**VE-02. Skill 5 lớp, Decision Engine, EDL, quy trình** — `xong`
`SKILL.md` điều phối 6 pha; `core/` (nguyên tắc, nhịp, kể chuyện, bố cục, âm thanh, Decision Engine với quy tắc `R-*`); `schema/edl.md` (EDL v1.0, quyết định theo ID, trạng thái proposed/approved/removed); `workflows/` (video-analysis, edit-planning, editing-execution, quality-control); `styles/documentary.md` (style duy nhất có file).

**VE-03. Renderer preview (Remotion + ffmpeg)** — `xong, có giới hạn`
`renderer/cli.js`: `validate`, `preview` (proxy 540p, 960×540), `final` (từ chối khi còn quyết định `proposed`). `renderer/lib/edl.mjs` giải EDL và kiểm tra; `renderer/src/*` dựng hình, chữ, âm thanh.
- Giới hạn: **bản final chưa từng render** ở độ phân giải gốc; âm lượng preview chưa chuẩn hóa (từng đo −27,4 LUFS ở video khai giảng).

### Thư viện kỹ thuật

**VE-04. Camera, thời gian, màu, âm thanh** — `xong, có giới hạn`
`punch_in`, `punch_out`, `slow_push`, `color_grade_basic`, `vignette`, `time_lapse`, `freeze_frame`, `fade_in_out`, `speed_ramp_transition`, `whoosh_synced_cut`, `audio_ducking`, `j_l_cut`, `lower_third`, `subtitles`, `kinetic_text`; mỗi kỹ thuật có tài liệu 10 mục và preset JSON. Một số hiệu ứng (J/L cut, ducking, màu, vignette, time_lapse) **chưa xác nhận bằng mắt/tai** trong lượt kiểm thử tổng hợp.

**VE-05. Thư viện 31 kiểu chuyển cảnh** — `xong`
Bảng `TRANSITIONS` (kiểu "chồng" cần tay cầm, kiểu "tuần tự"), 50 preset, tài liệu từng kiểu; quy tắc giãn cách ≥ 3 s, `flash_strobe` ≤ 3 lần/giây. Quét tự động: không đứng hình; chỉ một đoạn đen đúng với `dip_to_black`. Chưa xem từng chuyển cảnh bằng mắt.

**VE-06. Hệ phông chữ** — `xong`
Đổi sang Inter theo giao diện Rikkei Edu; đăng ký thêm 22 phông (23 phông), phân nhóm và vai trò (`typography/font-registry.json`), có ảnh mẫu; loại Poppins vì thiếu bộ chữ tiếng Việt.

**VE-07. Hệ kiểu chữ dùng chung `TextBlock` (đợt 0–5)** — `xong, có giới hạn`
Một bộ dựng chữ `renderer/src/TextBlock.jsx` + khối nền `_text_style_base` + preset. Theo đợt:
- Đợt 0–1: lớp kiểu chữ, `text_pill`, `text_box`, `stacked_text`, `title_card`, `big_text`, `marker_highlight`.
- Đợt 2: `chapter_title`, `pull_quote`, `big_number`, `bullet_list_reveal`, `location_tag`, `text_sticker`, `speech_bubble`, `callout_label`, `social_tag`.
- Đợt 4: `typewriter_text`, `scramble_text`, `glitch_text` (nhịp: nháy 2 lần, dừng, nháy lần cuối rồi biến mất), `text_cutout` (kèm `cutout_dive` lao vào chữ), `text_on_path` (chữ chạy dần ra từ một phía).
- Đợt 5: `progress_bar`, `countdown_timer`, `credits_roll`, `comparison_table`.
- Đợt 3 (chữ theo lời): `word_highlight`, `word_by_word_text`, `karaoke_subtitles`, `shortform_captions` — **phần hiển thị xong**, cần mốc từng từ thật; mốc `estimated` chỉ cho bản thử, `final` từ chối chạy.
- Quy mô hiện tại: 75 kỹ thuật được renderer hỗ trợ; 87 tài liệu kỹ thuật được `check-docs` kiểm; 158 preset (tính cả khối nền).
- Giới hạn: hoạt ảnh vào/ra của các kiểu chữ **chưa xem**; chữ tiếng Việt dài ở 1080p/4K chưa kiểm; `vertical_text` chưa làm.

### Lỗi tìm ra và đã sửa (trong lúc kiểm thử)
- Chữ chèn dòng nhau (dòng HOA có dấu, `line_height`/`line_gap`); vệt bút dạ tô nửa vời; hộp nền, viền; mục danh sách hiện cùng lúc (`item_delay`); `chapter_title` tối đa 2 dòng.
- Con trỏ đánh máy nằm dưới hàng chữ (đã đặt cùng hàng).
- Nhãn nhận diện trong bài test đè lên `text_pill` và `location_tag` (chuyển sang góc trên phải).
- Đường sóng của chữ theo đường cong làm chữ đè nhau (đổi sang đường Q/T); vòng tròn quá to.
- `validate` các EDL đợt trước báo sai do khóa `words_mode` rỗng (đã sửa).
- Lỗ hổng validate: `progress_to` rỗng lọt, thiếu `table: true` không bị chặn (đã vá).
- **Zoom giật:** `ease_out` làm khung đầu nhảy 1,9% scale; `return: cut` đưa scale về 1.0 trong một khung (7% và 12%). Đã đổi preset sang `ease_in_out`, rồi sang "giữ zoom đến điểm cắt". Người dùng sau đó yêu cầu **bỏ zoom**.

### Quy tắc nảy sinh từ phản hồi của người dùng
| Quy tắc | Nội dung | Ở đâu |
|---|---|---|
| `R-SUBJ-1` | Không đè chữ/hiệu ứng lên mặt và thân chủ thể chính; khai báo `subject_box`, `validate` cảnh báo khi chồng > 20% | `core/composition.md`, `schema/edl.md`, `renderer/lib/edl.mjs` |
| `R-SRC-1` | Chữ trên hình, tên, con số, trích dẫn phải có nguồn hoặc ghi rõ "minh họa"; mốc từng từ phải thật, không ước lượng cho bản giao | `core/decision-engine.md` |
| `R-ZOOM-0` | Không tự đề xuất zoom (`punch_in`, `punch_out`, `slow_push`); chỉ khi người dùng yêu cầu rõ | `SKILL.md`, `core/decision-engine.md`, `core/effect-selection.md` |
| Trung thực | Nêu cái đã xem/đo, chưa xem, chưa nghe; không nghe được âm thanh nên nhờ người dùng nghe | `SKILL.md` |

### Kiểm thử và hướng dẫn

**VE-08. Kịch bản kiểm thử tổng hợp** — `xong, có giới hạn`
`tests/kich-ban-test-tong-hop.md`: ba phần (A: máy quay/thời gian/màu/âm thanh; B: 31 chuyển cảnh; C: 29 preset chữ). Đã xem một khung giữa lúc hiện cho cả 29 preset chữ; đo `fade_in` và `freeze_frame` ở phần A bằng ffmpeg. **Các project thử đã bị xóa** (xem VE-12), tài liệu vẫn nhắc tới chúng.

**VE-09. Hướng dẫn chọn hiệu ứng và lên kịch bản** — `xong`
`core/effect-selection.md` (nhu cầu → kỹ thuật; chuyển cảnh theo ý nghĩa; bảng "cảnh nào dùng gì"; bậc cường độ; danh sách preset hợp documentary sinh từ file preset), `workflows/script-writing.md` (7 bước từ đề bài tới trình duyệt), `techniques/camera-motion/zoom-guide.md` (đang tạm tắt).

**VE-10. Skill `/edit`** — `xong, chưa chạy thử`
`.claude/skills/edit/SKILL.md`: gõ `/edit <yêu cầu>`, agent đọc quy trình rồi làm tới bản preview và dừng, không render `final`. Chưa chạy thử trên yêu cầu thật; có thể cần khởi động lại phiên để nhận skill.

**VE-11. Video thật: tổng kết lễ khai giảng** — `đã xóa`
Có kịch bản `kich-ban.md`, EDL và preview `khai-giang-recap`; người dùng từng duyệt kịch bản và xem lỗi hiển thị. Chưa đối chiếu từng chữ với metadata. **Đã bị xóa cùng thư mục `projects/`.**

**VE-12. Dọn `projects/`** — `xong`
Theo yêu cầu "xóa tất cả trong projects": xóa vĩnh viễn 16 thư mục (12 demo, `khai-giang-recap`, `test-tong-hop-a/c`, `test-zoom`). Hệ quả: các script sinh bài test (ở thư mục tạm của phiên) không tái tạo được phần A; tài liệu đợt 3–5 và `tests/kich-ban-test-tong-hop.md` dẫn tới project không còn.

---

## 4. Việc còn mở (backlog)

| # | Việc | Phụ thuộc / ghi chú |
|---|---|---|
| 1 | Lấy mốc theo từng từ (nhận dạng giọng nói hoặc file phụ đề) | Cần người dùng chọn hướng; tải mô hình cần đồng ý trước |
| 2 | Chạy thử `/edit` trên một yêu cầu thật | Mở phiên trong `Video-edit` |
| 3 | Xem hoạt ảnh vào/ra của các kiểu chữ ở mọi preset | Chưa xem lượt nào |
| 4 | Nghe âm thanh preview (J/L cut, ducking), chuẩn hóa âm lượng | Agent không nghe được |
| 5 | Render thử bản final ở độ phân giải gốc | Chưa từng chạy |
| 6 | Sửa tài liệu dẫn chiếu tới project đã xóa | `tests/…`, tài liệu đợt 3–5 |
| 7 | Thêm style file ngoài `documentary` | Hiện style khác chỉ có bậc cường độ gợi ý, độ tin cậy thấp |
| 8 | `tracked_text`, `vertical_text` | `tracked_text` cần theo dõi chuyển động |
| 9 | Đối chiếu lời/chữ trong `clips.md` với bản nghe thật | Video-analysis |
| 10 | Zoom | Tạm tắt; mở lại khi người dùng yêu cầu |

---

## 5. Mẫu thêm task mới

```markdown
### VE-NN. <Tên task> — `<trạng thái>`
<Việc đã làm một hai câu>
- Bằng chứng: <lệnh chạy, file, số liệu, ảnh đã xem>
- Giới hạn: <chưa kiểm chứng gì>
- Liên quan: <quy tắc, file, task khác>
```
Quy ước: số hiệu `VA-NN` (Video-analysis) hoặc `VE-NN` (Video-edit); chỉ ghi `xong` khi có bằng chứng; điều chưa xem, chưa nghe, chưa chạy phải ghi ở dòng "Giới hạn".
