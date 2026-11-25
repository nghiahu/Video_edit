---
id: draw_annotation
name: Draw Annotation (Nét vẽ tay tự vẽ)
group: typography
roles: [information, emphasis]
status: usable
source_of_values: observed
---

# Draw Annotation

## 1. Mục đích
Vẽ dần một **mũi tên, đường, vòng khoanh hoặc gạch chân** kiểu vẽ tay (nét hơi rung) để chỉ đúng vật đang được nói tới. Rút từ REF_005 (mũi tên chỉ tia sáng, nét vẽ cây). Có thể kèm nhãn ngắn ở điểm đầu.

## 2. Khi nên dùng
- Lời nói nhắc tới một vật/chi tiết cụ thể trong hình (`R-SM-18`): vẽ đúng lúc lời nhắc.
- Khoanh một con số, một nút trên màn hình, một người trong đám đông.

## 3. Khi không nên dùng
- Vật di chuyển nhiều trong khung (nét đứng yên sẽ lệch; chưa có tracking).
- Vẽ lên mặt người (`R-SUBJ-1`): chỉ vào, không vẽ đè.

## 4. Thông số
| Khóa | Mặc định | Ý nghĩa |
|---|---|---|
| `draw_points` | – | Mảng điểm `[x, y]` (0–1 theo khung). Mũi tên/đường/gạch chân: các điểm nối tiếp, mũi ở điểm cuối. Vòng: `[tâm], [điểm xác định bán kính x, y]` |
| `draw_shape` | `arrow` | `arrow`, `line`, `circle`, `underline` |
| `draw_delay`, `draw_duration` | 0.1, 0.8 | Bắt đầu vẽ, thời gian vẽ hết nét |
| `draw_wobble` | 3 | Độ rung nét tay (px ở 1080p); 0 = thẳng |
| `line_color`, `line_width` | đỏ, 6–7 | Màu, độ dày nét |
| `text` | – | Nhãn tùy chọn ở điểm đầu (`label_x`, `label_y` để đặt chỗ khác) |

## 5. Quy trình thực hiện
1. Xuất khung tại mốc cần vẽ, đọc tọa độ vật (tỉ lệ khung, khung đã cắt nếu là 9:16).
2. Chọn hình dạng; mũi tên đi từ vùng trống tới vật, mũi dừng cách vật một chút.
3. Đặt mốc vào đúng lúc lời nhắc tới vật (cần mốc lời; ước lượng thì ghi `confidence: low`).

## 6. Biến thể và preset
| Preset | Mô tả | Documentary |
|---|---|---|
| `draw_arrow_red` | Mũi tên đỏ vẽ tay, nhãn trắng viền đen | Cấm |
| `draw_circle_red` | Vòng khoanh đỏ | Cấm |
| `draw_underline_yellow` | Gạch chân vàng đậm | Cấm |

## 7. Quy tắc quyết định
- Nét vẽ xuất hiện đúng lúc lời nhắc, không vẽ sẵn (`R-SM-18`).
- Một nét mỗi lần; nét cũ tắt trước khi vẽ nét mới.

## 8. Ví dụ
```json
{
  "id": "d22",
  "technique": "draw_annotation",
  "preset": "draw_arrow_red",
  "anchor": { "clip": "c03", "source_time": 4.2 },
  "start_offset": 0,
  "duration": 0,
  "parameters": { "draw_points": [[0.2, 0.3], [0.32, 0.36], [0.44, 0.44]], "text": "Diễn giả", "hold": 1.6 },
  "reason": "Lời nói nhắc tới diễn giả trên sân khấu; mũi tên chỉ đúng người được nói tới",
  "priority": "clarity",
  "confidence": "low",
  "reference": "styles/social.md",
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
- Tọa độ đo trên khung 16:9 gốc nhưng xuất 9:16: phải đo trên khung đã cắt.
- Nét quá mảnh ở bản preview nhỏ: kiểm ở độ phân giải thật.

## 10. Kiểm tra sau render
- Xem ảnh khung ở lúc hoạt ảnh xong và giữa hoạt ảnh; khung dọc xem ở độ phân giải thật.
- Chữ/hình không đè mặt chủ thể (`R-SUBJ-1`); `validate` không còn cảnh báo vùng an toàn 9:16 hoặc đã ghi lý do.
- Mũi tên chỉ đúng vật ở khung cuối của nét; vật không trôi khỏi đầu mũi trong lúc giữ.
