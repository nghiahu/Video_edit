# Nhịp (Pacing)

Nhịp là tốc độ thông tin đến với người xem. Nhịp tốt có **thay đổi có chủ đích**: nhanh khi cần năng lượng, chậm khi cần cảm xúc hoặc suy nghĩ.

## Độ dài cảnh theo mức nhịp
| `pacing` | Độ dài cảnh trung bình (b-roll) | Talking-head giữa các lần đổi khung | Phù hợp |
|---|---|---|---|
| `slow` | 6–10 s | 15–30 s | Documentary, cảm xúc, nội dung nghiêm túc |
| `moderate` | 3–6 s | 8–15 s | Tổng kết sự kiện, phỏng vấn, giới thiệu |
| `fast` | 1–3 s | 4–8 s | Short-form, tiết tấu theo nhạc, quảng bá |

Giá trị tham khảo (`confidence: medium`). Cảnh dài hơn ngưỡng khi có chuyển động camera đẹp hoặc nội dung cần thời gian đọc.

## Talking-head: giữ người xem
- Một góc máy giữ nguyên quá ~15 giây sẽ mỏi. Có ba cách làm mới hình mà không cần hiệu ứng:
  1. Chèn b-roll minh họa (`b_roll_insert`, chưa có tài liệu, dùng `hard_cut`/`j_l_cut`).
  2. Đổi khung (rộng ↔ cận) nếu có hai máy.
  3. `punch_in` nhẹ ở câu quan trọng.
- Cắt bỏ quãng lặng > 0.7 s và từ đệm ("ừm", "à") nếu không phải phần của cảm xúc. Chừa lại hơi thở ngắn 0.15–0.3 s giữa các ý để lời nói không bị nghẹt.

## Cấu trúc nhịp của cả video
- **Mở (5–10 s đầu):** hook. Câu thú vị nhất, hoặc hình mạnh nhất. Nhịp nhanh hơn mức trung bình một chút.
- **Thân:** xen kẽ đoạn có thông tin (chậm vừa) và đoạn giải tỏa (b-roll, nhạc, không lời).
- **Cao trào:** dồn hiệu ứng ở đây, không dàn đều.
- **Kết:** chậm lại, câu kết trọn ý, có khoảng thở trước khi dừng.

## Đo
- Đếm số lần cắt mỗi phút, so với `pacing` đã chọn.
- Với video 2 phút, `moderate`: khoảng 20–35 điểm cắt. Quá ít → tẻ nhạt, quá nhiều → chóng mặt.
- Không có hai đoạn liên tiếp cùng độ dài hệt nhau; nhịp đều như máy thường nghe như robot.
