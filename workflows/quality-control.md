# Kiểm tra chất lượng (QC)

Chạy sau mỗi lần render preview. Mỗi mục: đạt / không đạt / không kiểm tra được. Báo thẳng điều không kiểm tra được, đừng im lặng.

## Hình ảnh
- [ ] **Chữ dễ đọc:** tương phản đủ, cỡ chữ đạt ngưỡng ở `typography/hierarchy.md`, xuất hiện đủ lâu để đọc (xem công thức ở `techniques/typography/kinetic-text.md`).
- [ ] **Chữ không tràn khung, không che mặt** người nói; nằm trong vùng an toàn.
- [ ] **Bố cục sau zoom:** `punch_in` không cắt mất đỉnh đầu hay chủ thể chính.
- [ ] **Nhất quán:** cùng một kiểu chữ, màu, animation trong toàn video.
- [ ] **Không lạm dụng:** số lần mỗi kỹ thuật ≤ `strategy.budget`; không hai `punch_in` liền nhau trong 6 giây.
- [ ] **Chuyển cảnh đúng:** không nhảy trục, không cắt giữa chuyển động nhanh mà không có lý do.

## Âm thanh
- [ ] **Không vỡ tiếng (clipping)**, đỉnh không vượt −1 dBFS.
- [ ] **Loudness** khoảng −16 LUFS (mạng xã hội) hoặc −14 đến −18 LUFS (tùy nền tảng); tiếng nói luôn là phần to nhất.
- [ ] **Đồng bộ** hình và tiếng sau `j_l_cut`: không lệch, không nuốt chữ đầu câu.
- [ ] **Ducking:** nhạc hạ xuống trước khi người nói bắt đầu, hồi lại sau khi nói xong; không bị "nhấp nhô".
- [ ] **Không có tiếng lạ** từ footage gốc (ví dụ tiếng chuông thông báo đã ghi trong `issues`).

## Timeline
- [ ] **Không khung đen** hoặc khung đứng ở cuối/đầu clip.
- [ ] **Không hở** giữa clip, không clip lặp.
- [ ] **Độ dài** gần `target_duration_sec` (± 10%).
- [ ] **Mọi clip tồn tại** và `source_in/out` hợp lệ.

## Báo cáo
Ngắn gọn: danh sách mục không đạt kèm ID quyết định liên quan, và mục không kiểm tra được. Ví dụ: "d05 làm chữ che mặt ở 00:48 — đề xuất đưa chữ xuống thấp hơn."
