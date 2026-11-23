# Camera & Motion — chọn kỹ thuật

| Nhu cầu | Kỹ thuật | Tài liệu |
|---|---|---|
| Nhấn mạnh một câu hoặc biểu cảm trong talking-head | `punch_in` | `punch-in.md` |
| Mở không gian, nhả căng thẳng, kết đoạn (lùi ra từ khung đã zoom) | `punch_out` | `punch-out.md` |
| Tạo năng lượng bằng rung (chưa có) | `camera_shake` | planned |
| Chuyển cảnh nhanh bằng quay ngang (chưa có) | `whip_pan` | planned |
| Đẩy chậm suốt cảnh tĩnh để tạo cảm xúc, dẫn vào chủ thể | `slow_push` | `slow-push.md` |

## Cách chọn nhanh
- Clip talking-head, câu `importance: high`, khung `medium` → `punch_in`.
- B-roll hoặc cảnh tĩnh dài ≥ 4 giây, không lời → cân nhắc `slow_push` (preset `subtle`).
- `punch_in` và `slow_push` không dùng chung trên một clip.
- Khung đã `close` hoặc clip đã có camera chuyển động → **không** thêm chuyển động; để nguyên.
- Style `documentary` → chỉ `punch_in_subtle`, rất ít.

Đọc `core/decision-engine.md` trước khi đưa bất kỳ chuyển động camera nào vào EDL.
