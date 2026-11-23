---
id: beat_sync_cut
name: Beat-sync Cut (Cắt theo nhịp nhạc)
group: storytelling
roles: [rhythm, energy, music]
status: usable
source_of_values: convention
---

# Beat-sync Cut

> **Đây là kỹ thuật dạng mẫu (pattern), không có quyết định riêng trong EDL.** Nó được thực hiện bằng cách tính độ dài từng clip trong `timeline.clips` sao cho điểm cắt đầu ra rơi vào mốc nhịp nhạc, rồi nối bằng `hard_cut` (`cut_on: beat`, một giá trị tham khảo đã có ở `hard-cut.md`). **Chưa có công cụ phát hiện nhịp nhạc** trong skill hoặc renderer: danh sách mốc nhịp `beats` (giây trong file nhạc) phải do người dùng cung cấp hoặc đo bằng công cụ ngoài; renderer cũng không tự làm tròn điểm cắt vào mốc nhịp.

## 1. Mục đích
Làm hình và nhạc ăn khớp: cú cắt rơi đúng nhịp để người xem cảm thấy tiết tấu nhất quán và có năng lượng.

## 2. Khi nên dùng
- Nhạc nền có nhịp rõ, ổn định, và đã có danh sách `beats` đáng tin.
- Đoạn không lời dẫn (montage, hook, kết) với b-roll, nơi nhạc là yếu tố dẫn nhịp.
- Nhiều cảnh ngắn cần sắp theo tiết tấu thay vì theo lời.
- Documentary: **chỉ cho đoạn montage không lời, nhịp chậm đến vừa**, cắt vào nhịp mạnh (downbeat) chứ không cắt mọi nhịp. Đoạn có lời không cắt theo nhạc.

## 3. Khi không nên dùng
- Chưa có `beats` đáng tin: không đoán bằng tai rồi ghi như đo được.
- Đoạn có tiếng nói/phát biểu: cắt theo lời (`cut_on: speech_end`).
- Nhạc không có nhịp rõ, hoặc đổi nhịp liên tục (nhạc không lời kiểu ambient).
- Style `documentary` mà nhạc nhanh, dồn dập: nhịp cắt nhanh làm mất sự trang trọng.
- Cảnh cần đủ thời gian để đọc chữ hoặc quan sát chi tiết.

## 4. Thông số (hướng dẫn, không phải khóa EDL)
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `beats` | do người dùng cung cấp | danh sách tăng dần | giây (trong file nhạc) | low |
| Nhịp cắt | cắt mỗi 2 hoặc 4 nhịp | 1–8 nhịp | nhịp | low |
| Cắt vào mốc: cửa sổ lệch cho phép | ±0.06 | ±0.04–±0.12 | giây | low |
| Cắt hơi trước mốc (cảm giác "đúng nhịp") | −0.03 đến −0.05 | 0 đến −0.08 | giây | low |
| Độ dài cảnh (documentary, nhịp chậm) | ≥ 2.5 | 2–6 | giây | medium |
| Điểm nối | `hard_cut` | – | – | medium |
| Tiếng gốc cảnh | `mute` | `mute`, `duck` | – | high |

Công thức tham khảo: nếu `beats` đều, `bpm` = 60 / chu kỳ nhịp; độ dài cảnh = số nhịp × chu kỳ nhịp. Ví dụ 90 bpm, chu kỳ 0.667 s, 4 nhịp ≈ 2.67 s.

## 5. Quy trình thực hiện
1. Lấy danh sách `beats` từ người dùng hoặc từ công cụ ngoài skill. Nếu chỉ có bpm và mốc đầu, tính các mốc theo `beat_k = first_beat + k * 60 / bpm`, ghi rõ là ước lượng (confidence `low`) và cho người dùng kiểm tra.
2. Xác định khoảng thời gian đầu ra nơi nhạc phát và các mốc nhịp tương ứng (trừ độ trễ nhạc bắt đầu `audio.music` nếu có).
3. Chọn mốc cắt: mỗi 2 hoặc 4 nhịp (nhịp mạnh trước).
4. **Làm tròn điểm cắt vào mốc:** với mỗi điểm cắt dự kiến t (thời gian đầu ra), chọn mốc gần nhất; nếu lệch > cửa sổ cho phép, chỉnh `source_out` của clip ra (hoặc `source_in` của clip vào) cho đến khi độ dài clip khớp mốc. Điểm cắt rơi vào mốc chứ không dịch mốc.
5. Nếu điểm cắt thích hợp về hình rơi giữa hai mốc, ưu tiên cắt hình (hành động, `cut-on-action.md`) và chấp nhận lệch trong cửa sổ, hoặc đổi độ dài cảnh để khớp mốc kế.
6. Nối bằng `hard_cut` (`cut_on: beat`). Tiếng gốc clip `mute` (hoặc `duck`).
7. Xem preview, nghe cú cắt có "đúng nhịp"; nếu mốc nhịp sai thì cú cắt lệch cảm giác.

## 6. Biến thể và preset
Không có preset riêng.
- **Cắt mỗi nhịp mạnh:** nhịp chậm, hợp documentary.
- **Cắt dày dần:** rút ngắn dần số nhịp (4 → 2 → 1) để lên cao trào (hạn chế ở documentary).
- **Cắt theo drop/đoạn nhạc:** chỉ đổi cảnh ở chỗ nhạc đổi đoạn.

## 7. Quy tắc quyết định
- `R-BEAT-1`: NẾU không có `beats` do người dùng cung cấp hoặc đo ngoài skill → không dùng; nói rõ với người dùng, dùng `hard_cut` theo `edit_points`.
- `R-BEAT-2`: NẾU chênh lệch điểm cắt so với mốc > ±0.12 s → chỉnh lại độ dài clip.
- `R-BEAT-3`: NẾU style `documentary` VÀ độ dài cảnh trung bình < 2 s → giảm số nhịp hoặc bỏ.
- `R-BEAT-4`: không cắt theo nhạc trong đoạn có lời; lời ưu tiên (Clarity > Rhythm).
- `R-BEAT-5`: không cắt hình giữa chuyển động camera chỉ để vào nhịp (`hard-cut.md`).

## 8. Ví dụ
Nhạc 90 bpm (chu kỳ ≈ 0.667 s), mốc đầu ở 0.40 s trong file nhạc, cắt mỗi 4 nhịp (≈ 2.67 s). Ba cảnh b-roll, tính ra điểm cắt ở đầu ra ≈ 2.67 s và 5.33 s (tính từ lúc nhạc bắt đầu).

```json
{
  "timeline_pattern": [
    { "id": "c28", "video_id": "<b_roll_1>", "source_in": 0.0, "source_out": 2.67, "audio": "mute" },
    { "id": "c29", "video_id": "<b_roll_2>", "source_in": 1.0, "source_out": 3.67, "audio": "mute" },
    { "id": "c30", "video_id": "<b_roll_3>", "source_in": 0.5, "source_out": 3.17, "audio": "mute" }
  ],
  "decisions_pattern": [
    {
      "technique": "hard_cut", "preset": "cut_hard",
      "anchor": { "between": ["c28", "c29"] }, "duration": 0,
      "parameters": { "cut_on": "beat" },
      "reason": "Cắt đúng mốc nhịp thứ 5 của nhạc (beats do người dùng cung cấp)",
      "priority": "rhythm", "confidence": "low", "status": "proposed"
    }
  ],
  "beats_input": "<danh sách giây do người dùng cung cấp>"
}
```
`beats_input` không phải trường EDL; chỉ là khuôn để ghi đầu vào. Khuôn có chỗ `<...>` cần điền.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Mốc nhịp sai | Cú cắt lệch so với tiếng trống | Kiểm tra `beats` với người dùng |
| Cắt mọi nhịp | Cảnh quá ngắn, giật | Cắt mỗi 2–4 nhịp |
| Điểm cắt giữa chuyển động | Hình giật | `R-BEAT-5` |
| Offset nhạc quên trừ | Toàn bộ điểm cắt lệch cùng một khoảng | Tính độ trễ bắt đầu nhạc |
| Cắt theo nhạc trong đoạn có lời | Lời bị cụt | `R-BEAT-4` |

## 10. Kiểm tra sau render
- Nghe đối chiếu cú cắt và nhịp: đúng hoặc hơi sớm, không trễ.
- Đo độ lệch điểm cắt so với mốc trên preview (nếu có danh sách `beats`); phải nằm trong cửa sổ cho phép.
- Độ dài cảnh trung bình khớp `pacing` của style.
- Nhạc không bị cụt, tiếng gốc không lọt vào.
