# Storytelling & Pacing — chọn kỹ thuật

| Nhu cầu | Kỹ thuật | Cách thực hiện | Tài liệu |
|---|---|---|---|
| Minh họa lời nói, che chỗ cắt, làm mới hình talking-head | `b_roll_insert` | mẫu | `b-roll-insert.md` |
| Dồn nhiều ý hoặc quãng thời gian vào chuỗi cảnh ngắn | `montage` | mẫu | `montage.md` |
| Cắt theo nhịp nhạc (cần danh sách mốc nhịp do người dùng cung cấp) | `beat_sync_cut` | mẫu | `beat-sync-cut.md` |
| Tua nhanh một quá trình dài, lặp lại | `time_lapse` | renderer | `time-lapse.md` |
| Đổi bố cục không cắt: thẻ màn hình + thẻ mặt (9:16) | `layout_cards` | renderer | `layout-cards.md` |
| Giữ lại một khoảnh khắc bằng khung đóng băng | `freeze_frame` | renderer | `freeze-frame.md` |
| Tăng tốc rồi giảm tốc qua điểm nối | `speed_ramp_transition` | renderer | `speed-ramp-transition.md` |

## Cách chọn nhanh
- Khung talking-head quá dài, hoặc cần minh họa → `b_roll_insert`, nối bằng `hard_cut` + `j_l_cut` (L).
- Không có b-roll khớp nghĩa → đừng chèn; dùng `kinetic_text` hoặc giữ người nói.
- `time_lapse`, `freeze_frame`, `speed_ramp_transition` làm **tắt tiếng** đoạn bị đổi tốc độ và làm đổi độ dài clip (mọi mốc sau đó trên timeline dịch theo).
- Đọc `core/storytelling.md` và `core/pacing.md` trước.
