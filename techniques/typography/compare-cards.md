---
id: compare_cards
name: Compare Cards (Thẻ so sánh A vs B)
group: typography
roles: [information, emphasis]
status: usable
source_of_values: observed
---

# Compare Cards

## 1. Mục đích
Đặt 2–3 lựa chọn cạnh nhau ("A vs B"), mỗi thẻ có tiêu đề và chú thích; đến `winner_at` thẻ thắng **bật nền màu nhấn**, thẻ còn lại mờ và nhỏ lại. Rút từ REF_012 ("tốn token vs 0 token") và REF_004 (so sánh hai vế).

## 2. Khi nên dùng
- Người nói so sánh hai cách làm, hai mức giá, cũ/mới và có kết luận bên nào hơn.

## 3. Khi không nên dùng
- Nhiều tiêu chí trên nhiều hàng (dùng `comparison_table`).
- Không có kết luận rõ: bỏ `compare_winner` để không gợi ý sai.

## 4. Thông số
| Khóa | Mặc định | Ý nghĩa |
|---|---|---|
| `lines` | – | 2–3 dòng, mỗi dòng `"tiêu đề|chú thích"` |
| `compare_winner` | không | Chỉ số thẻ thắng (0, 1, 2) |
| `winner_at` | 1.4 | Giây (tính từ lúc khối vào) bật thẻ thắng |
| `card_width` | 0.38 | Bề rộng mỗi thẻ (tỉ lệ khung) |
| `accent_color` | đỏ | Màu nền thẻ thắng và quầng sáng |
| `vs_text` | `vs` | Chữ giữa hai thẻ |
| `item_delay` | 0.45 | Giây giữa hai thẻ bật vào |

## 5. Quy trình thực hiện
1. Rút tiêu đề ≤ 3 từ, chú thích ≤ 5 từ từ lời nói.
2. Đặt `winner_at` đúng lúc người nói chốt bên thắng.
3. Khung dọc: `card_width` ≤ 0.4 để hai thẻ vừa vùng an toàn.

## 6. Biến thể và preset
| Preset | Mô tả | Documentary |
|---|---|---|
| `compare_cards_vs` | Thẻ trắng viền mảnh, chữ navy, thẻ thắng nền đỏ chữ trắng | Cấm |

## 7. Quy tắc quyết định
- Thứ tự thẻ: yếu → mạnh (`R-SM-21`), thẻ thắng đặt sau.
- Chỉ một thẻ thắng.

## 8. Ví dụ
```json
{
  "id": "d21",
  "technique": "compare_cards",
  "preset": "compare_cards_vs",
  "anchor": { "clip": "c06", "source_time": 1.0 },
  "start_offset": 0,
  "duration": 0,
  "parameters": { "lines": ["Chat để sửa|tốn token", "Editor|sửa xong mới xuất"], "hold": 4.0 },
  "reason": "Người nói so sánh hai cách sửa video và chốt cách thứ hai",
  "priority": "clarity",
  "confidence": "medium",
  "reference": "styles/social.md",
  "status": "proposed"
}
```
(Thêm `"compare_winner": 1` khi người nói chốt bên thắng.)

## 9. Lỗi thường gặp
- Tiêu đề dài làm thẻ cao lệch nhau: giữ số chữ hai thẻ tương đương.
- `winner_at` quá sớm: người xem chưa đọc hết hai thẻ.

## 10. Kiểm tra sau render
- Xem ảnh khung ở lúc hoạt ảnh xong và giữa hoạt ảnh; khung dọc xem ở độ phân giải thật.
- Chữ/hình không đè mặt chủ thể (`R-SUBJ-1`); `validate` không còn cảnh báo vùng an toàn 9:16 hoặc đã ghi lý do.
- Thẻ thắng đọc rõ (chữ trắng trên nền nhấn); thẻ thua vẫn đọc được.
