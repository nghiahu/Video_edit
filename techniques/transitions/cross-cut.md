---
id: cross_cut
name: Cross Cut (Cắt xen)
group: transitions
roles: [storytelling, rhythm, parallelism]
status: usable
source_of_values: convention
---

# Cross Cut

> **Đây là kỹ thuật dạng mẫu (pattern), không có quyết định riêng trong EDL.** Nó được thực hiện bằng cách xen kẽ các clip thuộc hai (hoặc nhiều) mạch song song trong `timeline.clips` (A1, B1, A2, B2...), nối bằng `hard_cut`, và dùng `j_l_cut` khi lời hoặc tiếng của một mạch chạy qua mạch kia. Renderer không biết "mạch"; người dùng hoặc AI đặt thứ tự và xác định mạch dựa trên `topics`/`concepts` trong metadata.

## 1. Mục đích
Cho người xem thấy hai việc xảy ra song song (hoặc cùng chủ đề từ hai phía) để so sánh, tạo căng thẳng hoặc thể hiện mối liên hệ.

## 2. Khi nên dùng
- Hai mạch hành động xảy ra cùng lúc trong sự kiện: hậu trường chuẩn bị và sân khấu diễn ra.
- Hai nhân vật/ý đối chiếu: một học viên kể về khó khăn, giảng viên kể về phương pháp.
- Footage phỏng vấn hai người nói về cùng chủ đề, ghép luân phiên theo ý.
- Tổng kết sự kiện nhiều địa điểm (lớp học, sân khấu, hành lang) cùng một khoảng thời gian.
- Documentary: **hợp**, là kỹ thuật dựng bình thường khi nội dung song song thật; chỉ cần giữ nhịp tiết chế.

## 3. Khi không nên dùng
- Hai mạch không có liên hệ nội dung hoặc thời gian rõ: người xem không hiểu vì sao xen.
- Chỉ có một mạch (chỉ có một nhóm footage): chuyển sang `b_roll_insert`.
- Mỗi mạch thiếu footage nên các đoạn xen quá ngắn, vụn.
- Câu nói quan trọng đang diễn ra; cắt xen làm người xem mất mạch lời.
- Chưa phân biệt được hai mạch bằng hình (hai cảnh trông giống nhau, đặc biệt không có chữ/dấu hiệu nhận biết).

## 4. Thông số (hướng dẫn, không phải khóa EDL)
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| Độ dài mỗi lần xen (mức `moderate`) | 3–6 | 2–8 | giây | medium |
| Độ dài mỗi lần xen (mức `slow`) | 6–10 | 4–12 | giây | medium |
| Số mạch | 2 | 2–3 | mạch | medium |
| Số lần xen liên tiếp trước khi hợp mạch | 2–4 | 2–6 | lần | low |
| Nhịp co dần về cao trào (rút ngắn mỗi vòng) | 10–20% | 0–30% | tỉ lệ | low |
| Điểm nối | `hard_cut` (+ `j_l_cut` khi qua lời) | – | – | medium |

## 5. Quy trình thực hiện
1. Từ pha phân tích: đặt nhãn mạch (A, B) cho từng clip theo `topics`/địa điểm/người. Chưa có công cụ gán tự động.
2. Lên thứ tự xen kẽ: A1, B1, A2, B2... Mỗi mạch phải tự có tiến triển, không lặp cùng ý.
3. Cắt mỗi đoạn theo `edit_points`, độ dài theo `core/pacing.md`.
4. Nối bằng `hard_cut`. Nếu lời của mạch A tiếp tục khi sang mạch B: thêm `j_l_cut` kiểu L (`l_cut_standard`), tuân thủ khoảng cách `j_l_cut` ≥ 3 s.
5. Ở mạch có tiếng nền khác nhau, giữ ambience hoặc `j_l_cut` để chỗ nối không giật.
6. Kết: hai mạch hội tụ (cùng cảnh, cùng câu) hoặc dừng ở cảnh rộng có hơi thở.

## 6. Biến thể và preset
Dùng `cut_hard`, `l_cut_standard`, `j_cut_standard`; không có preset riêng.
- **Song song thời gian:** hai việc xảy ra cùng lúc.
- **Đối chiếu ý:** hai quan điểm/đối tượng.
- **Dồn nhịp:** độ dài xen rút ngắn dần để tăng căng thẳng (dùng hạn chế ở documentary).

## 7. Quy tắc quyết định
- `R-XCUT-1`: NẾU không nêu được liên hệ giữa hai mạch trong `reason` (cùng thời điểm, cùng chủ đề, đối chiếu) → không dùng.
- `R-XCUT-2`: NẾU mỗi lần xen < 2 s ở nhịp `moderate`/`slow` → gộp lại, quá vụn.
- `R-XCUT-3`: NẾU hai mạch nhìn giống nhau, không nhận ra → thêm dấu hiệu (lower_third, chữ định vị) hoặc bỏ.
- `R-XCUT-4`: không cắt xen giữa câu then chốt; chờ hết ý.
- `R-XCUT-5`: các `j_l_cut` cách nhau ≥ 3 s.

## 8. Ví dụ
Đoạn "hậu trường chuẩn bị" (A) xen "sân khấu khai giảng" (B), mỗi lần 4–5 giây, có tiếng MC trên sân khấu kéo sang cảnh hậu trường (L-cut).

```json
{
  "timeline_pattern": [
    { "id": "c13", "video_id": "<hau_truong>", "source_in": 0.0, "source_out": 4.5, "audio": "keep" },
    { "id": "c14", "video_id": "<san_khau>", "source_in": 2.0, "source_out": 6.0, "audio": "keep" },
    { "id": "c15", "video_id": "<hau_truong>", "source_in": 4.5, "source_out": 8.5, "audio": "keep" },
    { "id": "c16", "video_id": "<san_khau>", "source_in": 6.0, "source_out": 10.5, "audio": "keep" }
  ],
  "decisions_pattern": [
    { "technique": "hard_cut", "anchor": { "between": ["c13", "c14"] } },
    { "technique": "j_l_cut", "preset": "l_cut_standard", "anchor": { "between": ["c14", "c15"] },
      "reason": "Tiếng MC sân khấu kéo sang cảnh hậu trường để hai mạch liền nhau", "priority": "clarity", "confidence": "medium", "status": "proposed" }
  ]
}
```
Khuôn minh họa có chỗ `<...>` cần điền, không phải EDL chạy được.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Hai mạch lẫn nhau | Không phân biệt cảnh nào là cảnh nào | `R-XCUT-3` |
| Xen quá vụn | Cảnh < 2 s, chóng mặt | `R-XCUT-2` |
| Một mạch lặp ý | Mạch không tiến triển | Mỗi lần xen mang thông tin mới |
| Nhịp đều như máy | Mọi đoạn cùng độ dài | Biến thiên độ dài (`core/pacing.md`) |
| Tiếng nền giật | Ambience đổi đột ngột | `j_l_cut` hoặc ambience nối |

## 10. Kiểm tra sau render
- Người xem tách được hai mạch mà không cần giải thích.
- Mỗi lần xen đủ dài để đọc nội dung (chữ nếu có).
- Âm thanh liền, không click ở các điểm nối.
- Điểm hội tụ cuối có ý nghĩa, không đột ngột.
