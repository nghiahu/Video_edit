---
id: subtitles
name: Subtitles (Phụ đề)
group: typography
roles: [accessibility, clarity, information]
status: usable
source_of_values: convention
---

# Subtitles

## 1. Mục đích
Hiển thị lời nói thành chữ để người xem hiểu khi tắt tiếng, nghe khó (ồn, giọng xa) hoặc cần đọc chính xác. Đây là chữ **cấp 3** (`typography/hierarchy.md`): ổn định, không gây chú ý; **khả năng đọc quan trọng hơn phong cách**.

## 2. Khi nên dùng
- Video đăng nơi người xem thường tắt tiếng (mạng xã hội).
- Footage có tiếng khó nghe (hội trường vang, ồn) mà nội dung quan trọng.
- Người dùng yêu cầu phụ đề hoặc cần tiếp cận người khiếm thính.
- Có **nguyên văn lời nói chính xác kèm mốc thời gian** đáng tin.

## 3. Khi không nên dùng
- **Thiếu nguyên văn đáng tin.** Metadata của `Video-analysis` thường chỉ có lời thoại trích từng đoạn, có chỗ "…", có chỗ "không rõ". Không bịa phần thiếu. Chỉ dựng cue cho phần chắc chắn, hoặc transcribe lại đoạn đó.
- Đoạn không có lời (b-roll, nhạc).
- Cùng lúc với `lower_third` hoặc `kinetic_text` ở vùng dưới (xung đột khối chữ).
- Cue dài quá giới hạn đọc (xem mục 4): sửa cách chia cue, không ép đọc nhanh.
- Style cần tối giản mà nội dung đã rõ và đăng nơi có tiếng.

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `cues` | – | mảng `{source_time, duration, text}` | – | high |
| `duration` mỗi cue | 1.5–4 | ≥ 1.0 | giây | medium |
| `max_lines` | 2 | 1–2 | dòng | medium |
| `max_chars_per_line` | 42 | 32–42 | ký tự | medium |
| `max_cps` (tốc độ đọc tối đa) | 17 | 14–20 | ký tự/giây | medium |
| `font_size` | 46 | 44–54 | px @1080p | medium |
| `bottom_percent` | 8 | 8–12 | % chiều cao | medium |
| `background` | `rgba(0,0,0,0.5)` | hộp mờ hoặc `none` | – | medium |

Mỗi cue: `source_time` là giây trong file nguồn của clip neo; `duration` là giây hiển thị; `text` có thể có `\n` để ngắt dòng. Cue không chồng nhau.

## 5. Quy trình thực hiện
1. Xác nhận có nguyên văn đáng tin cho đoạn cần phụ đề. Thiếu thì dừng, hỏi hoặc transcribe lại (`workflows/video-analysis.md`).
2. Chia lời thành cue theo **ý/nhịp ngắt câu**, không theo số ký tự máy móc. Mỗi cue 1–2 dòng, ≤ 42 ký tự/dòng, ngắt dòng ở chỗ ngắt cụm từ (không tách "Đại học | Bách khoa" thành hai dòng nếu tránh được).
3. Đặt `source_time` đúng lúc người nói bắt đầu cụm đó (cho phép lệch ≤ 0.1 s); `duration` đủ để đọc: `duration ≥ số_ký_tự / max_cps`, tối thiểu 1.0 s. Giữ thêm ~0.2–0.3 s sau khi nói xong nếu không đè cue sau.
4. Kiểm tra không chồng `lower_third`/`kinetic_text` cùng lúc; nếu trùng, dời chữ khác hoặc tạm ẩn phụ đề (nội dung nhấn quan trọng hơn).
5. Viết **đúng chính tả và dấu tiếng Việt**; giữ nguyên lời nói (không "sửa văn" quá tay); bỏ tiếng đệm nếu bỏ cả trong âm thanh.
6. Một quyết định `subtitles` thường phủ một clip; sửa theo ID ở cấp quyết định (cue sửa trực tiếp trong `cues`).

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `subtitles_standard` | Nền mờ tối, đọc tốt ở mọi nền; mặc định |
| `subtitles_clean` | Không nền, bóng mềm; chỉ khi nền hình tối và đơn giản |

## 7. Quy tắc quyết định
- `R-SUB-1`: chỉ tạo cue cho lời có nguyên văn đáng tin; không điền chỗ thiếu bằng suy đoán.
- `R-SUB-2`: ≤ 2 dòng, ≤ 42 ký tự/dòng, tốc độ đọc ≤ `max_cps`, cue ≥ 1.0 s.
- `R-SUB-3`: không cùng lúc với `lower_third` hoặc `kinetic_text`.
- `R-SUB-4`: khả năng đọc thắng phong cách (Clarity > Style).
- `R-TXT-3`: không che mặt; nền mờ giúp đọc nhưng đừng đặt cao hơn `bottom_percent` 12%.

## 8. Ví dụ
Diễn giả nói đoạn ngắn ở clip `c02`, có nguyên văn chắc chắn:

```json
{
  "id": "d08",
  "technique": "subtitles",
  "preset": "subtitles_standard",
  "anchor": { "clip": "c02", "source_time": 1.4 },
  "start_offset": 0,
  "duration": 5.5,
  "parameters": {
    "cues": [
      { "source_time": 1.4, "duration": 3.2, "text": "Giá trị nhận được từ chứng nhận\ncủa Đại học Bách khoa" },
      { "source_time": 4.7, "duration": 2.2, "text": "suy cho cùng vẫn là một sự bảo chứng" }
    ]
  },
  "reason": "Người xem có thể tắt tiếng; lời diễn giả có nguyên văn rõ ràng để làm phụ đề",
  "priority": "clarity",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```
Nguyên văn trong ví dụ là **minh họa theo mô tả footage**, cần đối chiếu với giọng nói thật trước khi dùng. Cue 1: 55 ký tự / 3.2 s ≈ 17 ký tự/giây (đúng ngưỡng); cue 2: 36 ký tự / 2.2 s ≈ 16 ký tự/giây. Khi `validate` cảnh báo tốc độ đọc, hãy kéo dài cue hoặc chia nhỏ câu chứ đừng bỏ qua.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Bịa chỗ thiếu | Cue chứa chữ không có trong lời nói | `R-SUB-1` |
| Quá nhanh | `cps` > 17, đọc không kịp | Chia cue, kéo dài |
| Ngắt dòng xấu | Tách tên riêng/cụm danh từ | Ngắt ở chỗ ngắt cụm từ |
| Che mặt hoặc chữ trên hình | Phụ đề đè slide/mặt | Giữ `bottom_percent` 8–12 |
| Sai dấu | Mất dấu hoặc sai chính tả | Soát từng cue, xem preview |
| Chồng khối chữ | `lower_third` cùng lúc | `R-SUB-3` |

## 10. Kiểm tra sau render
- Đọc được trọn vẹn không phải tua lại ở tốc độ bình thường.
- Khớp lời nói (lệch ≤ ~0.15 s).
- Tối đa 2 dòng, không tràn khung, tương phản đủ.
- Không chồng khối chữ khác.
