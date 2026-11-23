---
name: edit-video
description: >-
  Dùng khi người dùng muốn dựng/edit một video từ footage trong kho `Video-analysis`
  (tổng kết sự kiện, talking-head, phỏng vấn, documentary...). Skill lập chiến lược edit,
  Edit Decision List (EDL) có lý do, rồi render preview để người dùng xác nhận trước khi
  render bản cuối. Không dùng để phân tích footage thô (dùng `analyze-video`).
---

# Skill dựng video

Skill này là **bộ điều phối**. Nó không chứa kiến thức chi tiết: hãy đọc đúng tài liệu cần dùng ở từng pha, đừng đọc hết thư viện.

## Nguyên tắc không thương lượng
1. **Edit phải phục vụ nội dung.** Thứ tự ưu tiên khi xung đột: Storytelling > Clarity > Rhythm > Style > Decoration.
2. **Mỗi hiệu ứng phải có lý do viết ra được.** Không có `reason` thì không đưa vào EDL.
3. **Bắt đầu từ ít.** Thêm hiệu ứng khi có lý do; không thêm vì "trông đẹp". Tuân theo `strategy.budget`.
4. **Không bao giờ render bản cuối khi người dùng chưa xác nhận preview.**
5. **Không sao chép nguyên video mẫu.** Chỉ rút kỹ thuật và thông số.
6. **Không đoán khi thiếu dữ liệu.** Thiếu thì ghi `confidence: low` hoặc hỏi người dùng.

## Quy trình sáu pha
Chi tiết từng pha ở `workflows/`. Đọc file của pha đang làm.

| Pha | Việc | Đọc |
|---|---|---|
| 1. Hiểu footage | Đọc metadata, tìm câu quan trọng, chỗ chèn b-roll, vấn đề | `workflows/video-analysis.md` |
| 2. Chiến lược edit | Chọn phong cách, nhịp, cường độ, ngân sách hiệu ứng | `workflows/edit-planning.md` (mục Chiến lược), `styles/<style>.md` |
| 3. Truy xuất kiến thức | Chọn kỹ thuật cần dùng, đọc đúng tài liệu | `techniques/index.md` → `techniques/<nhóm>/index.md` → tài liệu kỹ thuật |
| 4. Lập kế hoạch | Tạo EDL, mỗi quyết định qua Decision Engine | `core/decision-engine.md`, `schema/edl.md`, `presets/*.json` |
| 5. Thực thi preview | Render bản nhẹ, tự kiểm tra | `workflows/editing-execution.md`, `workflows/quality-control.md` |
| 6. Xác nhận và render cuối | Sửa theo ID, render lại, rồi bản cuối khi được duyệt | `workflows/editing-execution.md` |

## Bản đồ tài liệu
```
core/             Nguyên tắc nền: editing-principles, pacing, storytelling, composition,
                  audio-principles, decision-engine   ← đọc decision-engine ở mọi lần lập kế hoạch
techniques/       Mỗi kỹ thuật một file theo khuôn schema/technique-template.md
typography/       font-catalog, pairing-rules, hierarchy (bắt buộc đọc trước khi thêm chữ)
styles/           Phong cách: documentary (hiện có)
presets/          JSON thông số: motion, typography, transition, sound
references/       Video mẫu và dự án mẫu (khung + một dự án mẫu)
schema/           Hợp đồng: edl.md, technique-template.md, preset.md
workflows/        Quy trình từng pha
examples/         EDL mẫu chạy được
```

## Ba loại kiến thức — đừng trộn
- **Rule** (quy tắc): `core/`, mục "Quy tắc quyết định" trong từng kỹ thuật. Quyết định được hay không.
- **Technique** (cách làm): `techniques/`, `presets/`. Làm thế nào, thông số bao nhiêu.
- **Reference** (ví dụ): `references/`, `examples/`. Trông thực tế ra sao.

## Dữ liệu đầu vào từ `Video-analysis`
Đọc `../Video-analysis/metadata/<video_id>/{summary.md, clips.md, processing.json}`. Các trường dùng chính: `duration_sec`, `fps`, `resolution`, `video_type`, `mood`, `speech` theo đoạn, `edit_points`, `quality`, `issues`, `scene_change_candidates`, `silence_ranges`. **Không có** mốc theo từng từ hay điểm nhấn giọng: tự đánh giá độ quan trọng từ văn bản lời thoại và ghi `confidence`. Chỉ đọc, không sửa `Video-analysis`.

## Khi nào hỏi người dùng
- Mục đích, độ dài, nền tảng đăng hoặc phong cách còn mơ hồ: đưa đề xuất kèm lý do, một câu hỏi một lần.
- Một quyết định đi ngược quy tắc phong cách nhưng có lý do mạnh: nêu rõ và để người dùng quyết.
- Sau preview: luôn dừng và chờ xác nhận.

## Đầu ra mỗi lần chạy
1. Khối `strategy` (pha 2).
2. EDL theo `schema/edl.md`.
3. Video preview.
4. Báo cáo QC ngắn: đã kiểm tra gì, còn lo ngại gì.
