---
id: layout_cards
name: Layout Cards (Luân phiên bố cục thẻ màn hình + thẻ mặt)
group: storytelling
roles: [structure, rhythm]
status: usable
source_of_values: observed
---

# Layout Cards

## 1. Mục đích
Đổi bố cục mà không cắt cảnh: **thẻ màn hình** (ảnh hoặc video khác) ở trên, **thẻ mặt** (chính clip người nói) ở dưới, nền là chính clip làm mờ. Khung mặt thu từ toàn khung về thẻ (~0,35 s), thẻ màn hình trượt xuống; hết thời gian thì ngược lại. Rút từ REF_012 (luân phiên bố cục ~4 s, `R-SM-20`).

## 2. Khi nên dùng
- Video hướng dẫn/giải thích cần cho thấy màn hình, ảnh, sản phẩm **trong khi giữ mặt người nói**.
- Tạo nhịp cho đoạn nói dài không có góc máy khác.

## 3. Khi không nên dùng
- Chưa có ảnh/video màn hình thật.
- Khung 16:9 (bố cục thiết kế cho 9:16; ngang thì dùng b-roll toàn khung).

## 4. Thông số
| Khóa | Mặc định | Ý nghĩa |
|---|---|---|
| `screen_image` | – | Ảnh thẻ màn hình (tương đối thư mục dự án) |
| `screen_video`, `screen_source_in` | – | Hoặc video_id + giây bắt đầu |
| `screen_rect`, `face_rect` | trên 7–46%, dưới 50–94% | Vị trí hai thẻ `[x0, y0, x1, y1]` |
| `screen_fit` | `cover` | `cover` hoặc `contain` |
| `card_radius`, `card_border` | 28, 3 | Bo góc, viền thẻ |
| `bg_blur`, `bg_brightness` | 28, 0.75 | Độ mờ, độ sáng nền |
| `in_duration`, `out_duration` | 0.35, 0.3 | Thời gian biến hình vào/ra |
| `duration` (quyết định) | – | Thời gian giữ bố cục (giây) |

## 5. Quy trình thực hiện
1. `anchor.clip` là clip người nói; `duration` 3–5 s.
2. Khung mặt cắt theo `frame_x` của clip; kiểm mặt nằm trong thẻ dưới.
3. Đặt chữ ở khe giữa hai thẻ hoặc trên thẻ màn hình, không che mặt.

## 6. Biến thể và preset
| Preset | Mô tả | Documentary |
|---|---|---|
| `layout_cards_screen_top` | Màn hình trên, mặt dưới, nền mờ tối | Cấm |

## 7. Quy tắc quyết định
- Đây là khung tĩnh, **không phải zoom** (`R-ZOOM-0` không áp dụng); không thêm phóng to.
- Luân phiên ~4 s; không giữ quá 6 s.

## 8. Ví dụ
```json
{
  "id": "d25",
  "technique": "layout_cards",
  "preset": "layout_cards_screen_top",
  "anchor": { "clip": "c04", "source_time": 2.0 },
  "start_offset": 0,
  "duration": 4.0,
  "parameters": { "screen_image": "img/screen.jpg" },
  "reason": "Người nói hướng dẫn thao tác; cho thấy màn hình mà vẫn giữ mặt",
  "priority": "clarity",
  "confidence": "medium",
  "reference": "styles/social.md",
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
- `duration` vượt hết clip: renderer tự cắt và cảnh báo.
- Mặt bị cắt mất trong thẻ dưới: chỉnh `frame_x` của clip hoặc `face_rect`.

## 10. Kiểm tra sau render
- Xem ảnh khung ở lúc hoạt ảnh xong và giữa hoạt ảnh; khung dọc xem ở độ phân giải thật.
- Chữ/hình không đè mặt chủ thể (`R-SUBJ-1`); `validate` không còn cảnh báo vùng an toàn 9:16 hoặc đã ghi lý do.
- Xem khung giữa lúc biến hình và lúc giữ: thẻ không lệch, nền mờ không lộ mép.
