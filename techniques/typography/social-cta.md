---
id: social_cta
name: Social CTA (Nút Follow, ô bình luận)
group: typography
roles: [information, call_to_action]
status: usable
source_of_values: observed
---

# Social CTA

## 1. Mục đích
Lời kêu gọi mô phỏng giao diện mạng xã hội: **thẻ kênh** có con trỏ bấm "Follow" → "Đã follow", hoặc **ô bình luận** gõ dần chữ rồi bấm gửi. Rút từ REF_012 (hai lời kêu gọi cuối video).

## 2. Khi nên dùng
- Cuối video ngắn, khi người dùng cung cấp tên kênh/handle thật hoặc câu bình luận cần người xem gõ (ví dụ nhận tài liệu).

## 3. Khi không nên dùng
- Chưa có tên kênh, handle thật (`R-SRC-1`): không tự đặt.
- Video trang trọng (documentary).

## 4. Thông số
| Khóa | Mặc định | Ý nghĩa |
|---|---|---|
| `cta` | – | `follow` hoặc `comment` |
| `text` | – | Follow: tên kênh. Comment: câu được gõ |
| `sub_text` | – | Follow: handle. Comment: nhãn phía trên ô ("Bình luận để nhận…") |
| `click_at` | 1.4–2.2 | Giây con trỏ bấm (nút đổi trạng thái / gửi bình luận) |
| `button_text`, `button_done` | Follow, Đã follow | Chữ nút trước/sau bấm |
| `type_at`, `type_speed` | 0.4, 16 | Comment: lúc bắt đầu gõ, ký tự/giây |
| `accent_color`, `card_color` | đỏ, trắng | Màu nút/avatar, màu thẻ |

## 5. Quy trình thực hiện
1. Lấy tên kênh, handle, câu bình luận từ người dùng.
2. Comment: `click_at` ≥ `type_at` + số ký tự / `type_speed` + 0,3 s.
3. `hold` đủ cho `click_at` + ~1 s sau bấm.

## 6. Biến thể và preset
| Preset | Mô tả | Documentary |
|---|---|---|
| `social_cta_follow` | Thẻ trắng, avatar tròn đỏ, nút Follow đỏ → xám "Đã follow" | Cấm |
| `social_cta_comment` | Nhãn trắng phía trên, ô trắng gõ chữ, nút gửi đỏ | Cấm |

## 7. Quy tắc quyết định
- Tối đa hai lời kêu gọi, đặt cuối video (`R-SM-6`, REF_012).
- Thẻ nằm trong vùng an toàn 9:16.

## 8. Ví dụ
```json
{
  "id": "d23",
  "technique": "social_cta",
  "preset": "social_cta_follow",
  "anchor": { "clip": "c09", "source_time": 1.0 },
  "start_offset": 0,
  "duration": 0,
  "parameters": { "text": "Tên kênh", "sub_text": "@handle", "hold": 2.4 },
  "reason": "Lời kêu gọi theo dõi cuối video; tên kênh do người dùng cung cấp",
  "priority": "clarity",
  "confidence": "medium",
  "reference": "styles/social.md",
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
- Con trỏ bấm trước khi gõ xong: tăng `click_at`.
- Tên kênh dài tràn thẻ: rút gọn hoặc giảm `font_size`.

## 10. Kiểm tra sau render
- Xem ảnh khung ở lúc hoạt ảnh xong và giữa hoạt ảnh; khung dọc xem ở độ phân giải thật.
- Chữ/hình không đè mặt chủ thể (`R-SUBJ-1`); `validate` không còn cảnh báo vùng an toàn 9:16 hoặc đã ghi lý do.
- Xem khung trước và sau `click_at`: nút đổi chữ/màu, con trỏ nằm đúng trên nút.
