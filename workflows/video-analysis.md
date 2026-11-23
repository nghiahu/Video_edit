# Pha 1 — Hiểu footage

Mục tiêu: biết footage có gì và chỗ nào đáng chú ý, trước khi nghĩ đến hiệu ứng. Dựa vào metadata của `Video-analysis`, chỉ xem lại clip khi metadata không đủ.

## Việc cần làm
1. **Chọn clip.** Đọc `metadata/INDEX.md` và `TOPICS.md`, lọc theo yêu cầu người dùng. Với mỗi clip dùng được, đọc `summary.md` và `clips.md`.
2. **Ghi vào bảng tổng hợp** cho từng clip: `video_id`, `video_type`, độ dài, `mood`, có lời thoại không, `quality` (hình/tiếng), `issues`.
3. **Tìm câu quan trọng** (chỉ với clip có lời thoại): đọc `speech` và đánh dấu câu thuộc loại:
   - kết luận hoặc thông điệp chính ("điểm khởi đầu", "điều quan trọng nhất là...");
   - con số hoặc dữ kiện cụ thể;
   - bất ngờ, đổi hướng, cảm xúc mạnh;
   - câu mở đầu hoặc kết thúc ý.
   Mỗi câu gán `importance: high | medium | low` kèm `confidence` (vì không có điểm nhấn giọng).
4. **Tìm chỗ chèn b-roll:** đoạn nói dài (> ~8 giây nhìn một khung) hoặc nội dung trừu tượng mà `clips.md` có b-roll liên quan (so `topics`, `keywords`).
5. **Tìm vấn đề:** tiếng ồn, rung, quá sáng/tối, nói vấp, quãng lặng dài (`silence_ranges`). Quyết định cắt hay chấp nhận.
6. **Chọn điểm cắt vào/ra** từ `edit_points`; nếu không có thì dùng `silence_ranges` và `scene_change_candidates`.

## Đầu ra (ghi lại để các pha sau dùng)
```json
{
  "video_type": "event_recap",
  "clips": [
    { "video_id": "...", "type": "talking_head", "duration": 42.3, "mood": "calm",
      "usable_range": [1.0, 40.5], "issues": ["tiếng chuông 00:07"] }
  ],
  "key_moments": [
    { "video_id": "...", "time": 14.2, "text": "...", "importance": "high", "confidence": "medium" }
  ],
  "b_roll_opportunities": [ { "after_clip": "...", "topic": "học viên ngồi học" } ],
  "editing_requirements": ["giọng nói rõ", "bỏ tiếng chuông 00:07"]
}
```

## Khi thiếu dữ liệu
- Cần mốc chính xác theo từ cho một quyết định (ví dụ `kinetic_text` cần khớp lời): transcribe lại riêng đoạn đó, hoặc nới `start_offset`, và ghi `confidence: low`.
- Metadata ghi `confidence: low` cho clip: xem lại clip trước khi dựa vào.
