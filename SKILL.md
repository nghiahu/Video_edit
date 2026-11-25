---
name: edit-video
description: >-
  Dùng khi người dùng muốn dựng/edit một video từ footage trong kho `Video-analysis`
  (tổng kết sự kiện, talking-head, phỏng vấn, documentary...), hoặc cần chọn hiệu ứng,
  chữ, chuyển cảnh, lên kịch bản cho video đó. Skill lập kịch bản, chiến lược edit,
  Edit Decision List (EDL) có lý do, rồi render preview để người dùng xác nhận trước khi
  render bản cuối. Không dùng để phân tích footage thô (dùng `analyze-video`).
---

# Skill dựng video

> **Gọi nhanh:** gõ `/edit <yêu cầu>` (skill `.claude/skills/edit/SKILL.md`) để agent đọc quy trình và làm trọn từ đầu đến bản preview.

Skill này là **bộ điều phối**. Nó không chứa kiến thức chi tiết: đọc đúng tài liệu ở từng pha, đừng đọc hết thư viện.

## Nguyên tắc không thương lượng
1. **Edit phục vụ nội dung.** Ưu tiên khi xung đột: Storytelling > Clarity > Rhythm > Style > Decoration.
2. **Mỗi hiệu ứng phải có `reason` viết ra được.** Không có lý do thì không đưa vào EDL.
3. **Bắt đầu từ ít.** Mặc định cắt thẳng; thêm hiệu ứng khi có lý do và trong `strategy.budget`.
4. **Không render bản cuối khi người dùng chưa xác nhận preview.**
5. **Không đoán và không bịa.** Chữ trên hình, tên, con số, trích dẫn phải truy ngược được về lời nói/metadata/người dùng, hoặc ghi rõ là minh họa (`R-SRC-1`). Thiếu dữ liệu thì ghi `confidence: low` hoặc hỏi.
6. **Không tự dùng zoom** (`punch_in`, `punch_out`, `slow_push`): mặc định cắt thẳng; chỉ thêm khi người dùng yêu cầu rõ ở cảnh nào, và ghi vào `reason` (`R-ZOOM-0`).
7. **Không đè chữ hay hiệu ứng lên mặt và thân chủ thể chính** (`R-SUBJ-1`; khai báo `subject_box`).
8. **Báo cáo trung thực:** nêu cái đã xem, đã đo, chưa xem, chưa nghe. Agent không nghe được âm thanh; nhờ người dùng nghe.
9. Không sao chép nguyên video mẫu; chỉ rút kỹ thuật và thông số.

## Quy trình
| Pha | Việc | Đọc |
|---|---|---|
| 1. Hiểu footage | Đọc metadata, tìm câu quan trọng, chỗ chèn b-roll, vấn đề | `workflows/video-analysis.md` |
| 2. Kịch bản + chiến lược | Chốt đề bài, cấu trúc, bảng cảnh; chọn style, nhịp, ngân sách | `workflows/script-writing.md`, `workflows/edit-planning.md`, `styles/<style>.md` |
| 3. Chọn hiệu ứng | Từ nhu cầu nội dung → kỹ thuật → preset; đọc đúng tài liệu | `core/effect-selection.md` → `techniques/index.md` → `techniques/<nhóm>/…` |
| 4. Lập kế hoạch (EDL) | Mỗi quyết định qua Decision Engine | `core/decision-engine.md`, `schema/edl.md`, `presets/*.json` |
| 5. Preview | Render bản nhẹ, tự kiểm tra (xem ảnh khung, đo) | `workflows/editing-execution.md`, `workflows/quality-control.md` |
| 6. Xác nhận, render cuối | Sửa theo ID quyết định; render cuối chỉ sau khi được duyệt | `workflows/editing-execution.md` |

Lệnh renderer (`renderer/README.md`):
```powershell
node renderer/cli.js validate --edl projects/<id>/edl.json
node renderer/cli.js preview  --edl projects/<id>/edl.json
node renderer/cli.js final    --edl projects/<id>/edl.json   # từ chối khi còn quyết định proposed hoặc mốc từ ước lượng
```

## Chọn nhanh
- **Không chắc dùng hiệu ứng gì:** `core/effect-selection.md` (bảng nhu cầu → kỹ thuật; chuyển cảnh theo ý nghĩa; bậc cường độ; danh sách preset hợp documentary).
- **Chưa có kịch bản:** `workflows/script-writing.md` (đề bài → ứng viên → cấu trúc → bảng cảnh → tự duyệt → trình duyệt).
- **Zoom (khi nào, bao nhiêu, vì sao giật):** `techniques/camera-motion/zoom-guide.md`.
- **Cảnh nào dùng gì:** `core/effect-selection.md`, mục 2b.
- **Chữ, phông, bố cục:** `techniques/typography/index.md`, `typography/` (font-registry, hierarchy, pairing, text-style-layer).
- **Chữ theo lời nói (karaoke, tô từ khóa):** cần mốc từng từ thật; hiện chưa có công cụ lấy mốc (nhận dạng giọng nói, thủ công, hoặc file phụ đề có mốc từ). Bản giao không dùng mốc ước lượng.

## Bản đồ tài liệu
```
core/        editing-principles, pacing, storytelling, composition, audio-principles,
             decision-engine, effect-selection   ← đọc decision-engine mỗi lần lập kế hoạch
techniques/  mỗi kỹ thuật một file (khuôn schema/technique-template.md): camera-motion, color,
             sound, storytelling, transitions, typography
typography/  font-catalog, font-registry, pairing-rules, hierarchy, text-style-layer, samples
styles/      documentary (tiết chế), social-edu (rút từ 2 video Rikkei), social (video ngắn: talking_head, fast_ad,
             explainer, animated_story; rút từ 10 video mẫu); đều tin cậy thấp
presets/     JSON thông số: motion, typography, transition, time, sound, color
references/  video mẫu REF_001…REF_012 (phân tích số đo, danh sách ở references/index.md), dự án mẫu
examples/    EDL mẫu chạy được (edl-documentary-mini.json)
schema/      edl.md, technique-template.md, preset.md
workflows/   video-analysis, script-writing, edit-planning, editing-execution, quality-control
renderer/    validate / preview / final (Remotion + ffmpeg)
projects/    EDL, kịch bản, preview từng dự án (có các project demo-*, test-tong-hop-*)
tests/       kich-ban-test-tong-hop.md (kịch bản kiểm thử tổng hợp)
```

## Ba loại kiến thức, đừng trộn
- **Rule:** `core/`, mục "Quy tắc quyết định" của từng kỹ thuật. Được dùng hay không.
- **Technique:** `techniques/`, `presets/`. Làm thế nào, thông số bao nhiêu.
- **Reference:** `references/`, `examples/`. Trông thực tế ra sao.

## Dữ liệu đầu vào từ `Video-analysis`
Đọc `../Video-analysis/metadata/<video_id>/{summary.md, clips.md, processing.json}`. Trường dùng chính: `duration_sec`, `fps`, `resolution`, `speech` theo đoạn, `roles`, `usable`, `issues`, `confidence`, `scene_change_candidates`, `silence_ranges`. Lời thoại và mô tả là do một mô hình khác xem và nghe video viết ra, có mức tin cậy; **không có mốc từng từ**. Chỉ đọc, không sửa `Video-analysis`.

## Khi nào hỏi người dùng
- Mục đích, độ dài, nền tảng hoặc style còn mơ hồ: đề xuất kèm lý do, một câu hỏi một lần.
- Style chưa có file (hiện có `documentary`, `social-edu`, `social`; hai style sau chỉ rút từ video mẫu, chưa duyệt): hỏi trước khi dùng bậc cường độ cao hoặc áp luật của `social-edu`.
- Thiếu tên, chức danh, nhạc, mốc theo từ: hỏi, không tự điền.
- Một quyết định đi ngược quy tắc nhưng có lý do mạnh: nêu rõ và để người dùng quyết.
- Sau preview: luôn dừng và chờ xác nhận.

## Đầu ra mỗi lần chạy
1. Kịch bản nháp (pha 2) kèm câu hỏi mở.
2. Khối `strategy` và EDL theo `schema/edl.md`.
3. Video preview.
4. Báo cáo QC ngắn: đã xem/đo gì, chưa xem/nghe gì, còn lo ngại gì.
