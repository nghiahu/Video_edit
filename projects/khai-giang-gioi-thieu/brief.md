# Brief: Giới thiệu khóa Phân tích Dữ liệu từ Lễ khai giảng khóa 38

**Yêu cầu gốc:** "Tạo kịch bản về ngày khai giảng, giới thiệu khóa học khoảng 2 phút, lấy dữ liệu từ metadata, từ giây nào đến giây nào, chọn đoạn nào và tại sao" → sau đó "Chốt mốc" → "/edit Bắt đầu edit".

**Mục tiêu một câu:** Cho người chưa biết thấy khóa Data Analysis dạy gì, khác biệt ở đâu và vì sao đáng theo.

## Thông số
| Mục | Giá trị |
|---|---|
| Độ dài | ≈ 122 s (mục tiêu 120 s, ±10%) |
| Tỉ lệ / độ phân giải | 16:9, 1920×1080 (footage 4K) |
| Style / nhịp | `event_recap` (chưa có style file; theo yêu cầu người dùng muốn nhiều title/thẻ đa dạng), `moderate`, `visual_intensity: medium` |
| Nguồn | 15 clip trong `Video-analysis` (mã `0005`–`0049`) |
| Kịch bản | `kich-ban.md` (mốc đã dò quãng lặng bằng ffmpeg) |

## Giả định
1. **Không có nhạc nền** (không có file trong workspace): `music.file: null`, video chạy bằng tiếng hiện trường và lời nói. Không có ducking.
2. **Không zoom** (người dùng đã yêu cầu bỏ).
3. **Nhiều title và thẻ** theo yêu cầu: tiêu đề khoét chữ mở đầu, thẻ ngày, thẻ tên khóa, tiêu đề chương, danh sách chạy vào từng dòng, trích dẫn. Tên chương và ngày 17/11/2026 (lấy từ tên file) là nhãn biên tập, cần xác nhận.
3b. **Không lower_third**: chưa biết tên và chức danh diễn giả.
4. **Không phụ đề**: lời thoại trong metadata là trích đoạn, không có mốc từng từ.
5. Clip `0005` đặt `mute`: tiếng gốc chỉ −38,8 dB trung bình (gần như im), có một đỉnh −12 dB chưa rõ nguồn.
6. Không chỉnh màu (footage cùng một phòng, ánh sáng đều).
7. Cắt `0036` thành hai phần để làm L-cut: hình diễn giả 3,6 s rồi hình học viên (`0046`) 4,2 s trong khi lời diễn giả chạy tiếp tới 8,2 s.
8. Bỏ câu "đổi tầng lớp, cái này là có thật" của `0047`.

## Câu hỏi mở
- Nhạc nền (có file chưa?), tên diễn giả và đơn vị đối tác, nơi đăng (16:9 hay 9:16).
- Mốc **thấp/vừa** (xem `kich-ban.md`) chưa nghe lại: cảnh `0036` (c12), `0047` (c14), `0048` (c15) và các điểm cắt giữa câu của b-roll giới thiệu.
- Ba nhãn chữ (Excel, SQL / Python / Workshop…) đặt theo ước lượng vị trí từ trong câu: cần nghe xem nhãn có hiện đúng lúc từ được nói không.
