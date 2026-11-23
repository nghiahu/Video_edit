# Nguyên tắc âm thanh

Người xem tha thứ cho hình xấu dễ hơn tiếng xấu. Âm thanh phải rõ trước, hay sau.

## Thứ tự ưu tiên
1. **Tiếng nói** luôn là thứ to và rõ nhất khi có người nói.
2. **Âm thanh hiện trường** (ambience) giữ cảm giác chân thực.
3. **Nhạc nền** hỗ trợ cảm xúc, không cạnh tranh với tiếng nói.
4. **SFX** (whoosh, impact...) rất tiết kiệm; documentary gần như không dùng.

## Mức tham khảo (`confidence: medium`)
| Thành phần | Mức |
|---|---|
| Tiếng nói (đỉnh) | khoảng −6 đến −3 dBFS |
| Tổng thể (loudness) | khoảng −16 LUFS (mạng xã hội); −14 đến −18 tùy nền tảng |
| Nhạc nền khi không có tiếng nói (`base_db`) | −14 đến −18 dBFS tùy thể loại |
| Nhạc nền khi có tiếng nói | `base_db` hạ thêm 8–16 dB (mặc định 12 dB, tức khoảng −28 dBFS) |
| Đỉnh tuyệt đối | không vượt −1 dBFS |

## Quy tắc
- **Ducking bắt buộc** khi nhạc chạy cùng tiếng nói (xem `techniques/sound/audio-ducking.md`).
- **Tiếng lạ trong footage** (chuông điện thoại, tiếng ồn) ghi trong `issues` của metadata: cắt, mute, hoặc lót nhạc/ambience.
- **Nối clip:** hai clip có tiếng nền khác nhau tạo cảm giác "giật". Dùng `j_l_cut` hoặc ambience nối (`ambience`, chưa có) để làm mượt.
- **Cuối clip:** không cắt trúng giữa âm (đuôi hơi, âm cuối). Chừa 0.05–0.15 s.
- **Quãng lặng:** không để im tuyệt đối. Nếu bỏ tiếng nói, luôn còn ambience hoặc nhạc.
- **Khoảng lặng có chủ đích:** trước câu quan trọng, hạ nhạc hoặc ngưng nhạc 0.3–0.5 s tạo sức nặng.
