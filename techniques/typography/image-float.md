---
id: image_float
name: Image Float (Ảnh bay quanh người nói)
group: typography
roles: [information, evidence]
status: usable
source_of_values: observed
---

# Image Float

## 1. Mục đích
Đưa **ảnh kết quả** (sản phẩm, video đã làm, ảnh sự kiện) bật vào quanh người nói làm bằng chứng: xếp **quạt** trên đầu, **quỹ đạo** quanh đầu, **dải chạy** ngang, hoặc **lưới**. Rút từ REF_012 (thẻ ảnh lơ lửng ở hook, quạt ảnh, dải ảnh, lưới ảnh trước CTA).

## 2. Khi nên dùng
- Người nói nhắc tới kết quả, số lượng sản phẩm, "đã làm chục video".
- Hook cần bằng chứng nhìn thấy được ngay.

## 3. Khi không nên dùng
- Không có ảnh thật của dự án (không dùng ảnh minh họa giả làm bằng chứng, `R-SRC-1`).
- Ảnh che mặt người nói: đặt `image_center` trên đầu hoặc hai bên.

## 4. Thông số
| Khóa | Mặc định | Ý nghĩa |
|---|---|---|
| `images` | – | 1–12 đường dẫn ảnh, tương đối thư mục dự án (renderer chép vào `img/`) |
| `image_layout` | `fan` | `fan`, `orbit`, `strip`, `grid` |
| `image_center` | [0.5, 0.1–0.3] | Tâm bố cục (tỉ lệ khung) |
| `image_width`, `image_aspect` | 0.2–0.24, 1.4–1.6 | Bề rộng thẻ ảnh (tỉ lệ khung), cao/rộng |
| `image_radius`, `image_spread` | 0.42, 70° | Bán kính quạt/quỹ đạo, góc xòe quạt |
| `orbit_speed`, `strip_speed` | 0.25, 120 | Tốc độ quay (rad/giây), tốc độ dải (px/giây ở 1080p) |
| `item_delay` | 0.1 | Giây giữa hai ảnh bật vào |
| `text` | – | Nhãn tùy chọn (vị trí theo `position`) |

## 5. Quy trình thực hiện
1. Chuẩn bị ảnh trong thư mục dự án (ví dụ `img/`), cắt dọc nếu thẻ dọc.
2. Xem khung để đặt `image_center` tránh mặt.
3. `validate` báo thiếu file ảnh nếu đường dẫn sai.

## 6. Biến thể và preset
| Preset | Mô tả | Documentary |
|---|---|---|
| `image_fan_head` | Quạt 5 ảnh trên đầu | Cấm |
| `image_orbit_head` | Ảnh quay quanh đầu | Cấm |
| `image_strip_top` | Dải ảnh chạy ngang trên khung | Cấm |

## 7. Quy tắc quyết định
- Chỉ ảnh có thật của dự án/người dùng.
- Xuất hiện đúng lúc lời nhắc tới kết quả.

## 8. Ví dụ
```json
{
  "id": "d24",
  "technique": "image_float",
  "preset": "image_fan_head",
  "anchor": { "clip": "c02", "source_time": 3.0 },
  "start_offset": 0,
  "duration": 0,
  "parameters": { "images": ["img/r0.jpg", "img/r1.jpg", "img/r2.jpg"], "text": "Làm chục video", "hold": 2.4 },
  "reason": "Lời nói nhắc đã làm nhiều video; ảnh thật của các video làm bằng chứng",
  "priority": "storytelling",
  "confidence": "medium",
  "reference": "styles/social.md",
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
- Ảnh quá nhỏ trên điện thoại: `image_width` ≥ 0.2 ở khung dọc.
- Quạt tràn mép trên: hạ `image_center` hoặc giảm `image_radius`.

## 10. Kiểm tra sau render
- Xem ảnh khung ở lúc hoạt ảnh xong và giữa hoạt ảnh; khung dọc xem ở độ phân giải thật.
- Chữ/hình không đè mặt chủ thể (`R-SUBJ-1`); `validate` không còn cảnh báo vùng an toàn 9:16 hoặc đã ghi lý do.
- Tất cả ảnh hiện đủ, không vỡ; không che mặt người nói.
