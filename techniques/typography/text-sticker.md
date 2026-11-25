---
id: text_sticker
name: Text Sticker (Nhãn dán chữ)
group: typography
roles: [emphasis, decoration]
status: usable
source_of_values: convention
---

# Text Sticker

## 1. Mục đích
Một cụm chữ **cực ngắn** trông như miếng dán: viền dày bao quanh, bóng cứng lệch xuống, nghiêng nhẹ, bật nảy vào. Tạo giọng vui, trẻ trung, gây chú ý tức thì. Là chữ nhấn (cấp 1) của khung, không phải chữ thông tin.

## 2. Khi nào nên dùng
- Style vui: vlog, trẻ em, bán lẻ, giải trí, mạng xã hội, video ngắn (xem `styles/`; tra `allowed_styles`).
- Cụm 1–4 từ, tối đa 2 dòng (`R-STK-1`): phản ứng ("Tuyệt vời!"), điểm nhấn hài, tên chương trình nhẹ nhàng.
- Cảnh nền không quá rối, để viền dày và màu rực tách được khỏi hình.
- Chỉ **một** sticker mỗi khung (một cấp nhấn mỗi khung).

| Tình huống | Chọn |
|---|---|
| Cụm vui, viền dày, nghiêng | `text_sticker` |
| Cụm cực lớn khớp bề ngang | `big_text` |
| Nhấn ý theo lời nói, tiết chế | `kinetic_text` |

## 3. Khi không nên dùng
- Style `documentary` và mọi style trang trọng: cả hai preset có `forbidden_styles: ["documentary"]`, validate báo lỗi.
- Nội dung nghiêm túc, cảm xúc nặng, thông tin chính xác cần đọc kỹ (số liệu, tên người).
- Chữ dài hơn 4 từ hoặc quá 2 dòng (`R-STK-1`).
- Nền sáng chói hoặc quá rối làm mất tương phản; chữ che mặt người nói (`R-TXT-3`).
- Phông khó đọc: chữ phải **đọc rõ trong một cái liếc**, tương phản với viền.

## 4. Thông số
Khối nền `_text_style_base`; giá trị là của `text_sticker_white` trừ khi ghi khác. Cỡ chữ tính cho 1080p.

| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `text` (hoặc `lines`) | – | 1–4 từ, ≤ 2 dòng | – | medium |
| `hold` (nội dung) | `0.8 + 0.3 × số_từ`, ≥ 1.0 | ≥ công thức | giây | medium |
| `font_family` | Baloo 2 (`pop`: Grandstander) | phông trong registry, vai trò `emphasis`/`accent`/`heading` | – | medium |
| `font_weight` | 800 (`pop`: 900) | theo phông | – | medium |
| `font_size` | 96 | 12–600 (validate); Grandstander ≥ 56 | px @1080p | medium |
| `text_color` | `#FF4F8B` (`pop`: `#FFE14D`) | CSS color | – | low |
| `stroke_width` | 16 (`pop`: 14) | 0–24 (validate) | px @1080p | low |
| `stroke_color` | `#FFFFFF` (`pop`: `#2A1B4A`) | CSS color | – | low |
| `shadow_type` | `hard` | `none`, `soft`, `hard`, `offset3d` | – | low |
| `shadow_x` / `shadow_y` | 6 / 7 | không kiểm tra | px @1080p | low |
| `shadow_color` | `rgba(0,0,0,0.35)` (`pop`: 0.4) | CSS color | – | low |
| `rotate` | −5 (`pop`: 4) | −30–30 (validate) | độ | low |
| `position` | `center` | 9 vị trí | – | medium |
| `in_animation` / `in_duration` | `pop` / 0.4 | enum | – / giây | low |

Viền dùng `-webkit-text-stroke` căn giữa nét chữ kèm `paint-order: stroke fill`: viền dày dễ ăn vào thân chữ nếu phông mảnh, nên dùng độ đậm 800–900. Khối nền có `shadow_depth`, `glow_*`, `hollow` nhưng preset sticker không dùng.

## 5. Quy trình thực hiện
1. Chọn cụm 1–4 từ có nguồn (lời thoại hoặc ý của người dùng), không bịa câu.
2. Kiểm tra style: nếu `documentary` hoặc trang trọng thì bỏ kỹ thuật này.
3. Chọn preset (mục 6) theo tông nền: viền trắng cho nền tối/trung tính, viền tím đậm cho nền sáng; giữ một preset cho cả video.
4. `position` mặc định `center`; dời nếu che mặt. Giữ `rotate` trong ±8° để đọc dễ.
5. `hold = max(1.0, 0.8 + 0.3 × số_từ)`; `duration = in_duration + hold + out_duration`.
6. `validate`, rồi xem preview (độ đọc của chữ, viền không ăn thân chữ).

## 6. Biến thể và preset
Đã xem trên preview 960×540 của clip thử (khung giữa lúc chữ hiện đủ): chữ viền trắng / tím dày, nghiêng, bóng cứng.
| Preset | Mô tả | Documentary |
|---|---|---|
| `text_sticker_white` | Chữ hồng Baloo 2, viền trắng 16, nghiêng −5° | **Cấm** |
| `text_sticker_pop` | Chữ vàng Grandstander, viền tím đậm 14, nghiêng 4° | **Cấm** |

## 7. Quy tắc quyết định
- `R-STK-1` (validate): `text` ≤ 4 từ và ≤ 2 dòng; `hold` ≥ công thức; `stroke_width` 0–24, `rotate` −30–30; enum hợp lệ; phông có vai trò `emphasis`, `accent` hoặc `heading`.
- `R-STK-2` (validate qua `forbidden_styles`): NẾU style `documentary` THÌ không dùng cả hai preset.
- `R-STK-3`: NẾU style vui (vlog, trẻ em, mạng xã hội) VÀ nội dung phù hợp THÌ cân nhắc; NẾU nội dung nghiêm túc THÌ tránh.
- `R-STK-4`: NẾU nền sáng và chữ sáng, hoặc không thấy tương phản giữa chữ và viền THÌ đổi preset hoặc màu.
- `R-TXT-3`, một cấp nhấn mỗi khung. Ưu tiên lớp: Clarity > Style > Decoration (sticker là Decoration nên phải đọc rõ trước).

## 8. Ví dụ
Vlog thử món mới, clip `c02`, người nói reo lên; style vlog vui, nền trung tính. 2 từ → hold ≥ 1.4; chọn 1.6.
```json
{
  "id": "d21",
  "technique": "text_sticker",
  "preset": "text_sticker_white",
  "anchor": { "clip": "c02", "source_time": 6.2 },
  "start_offset": 0.0,
  "duration": 2.2,
  "parameters": { "text": "Quá ngon!", "hold": 1.6 },
  "reason": "Nhấn phản ứng vui của người nói ngay lúc họ reo; style vlog cho phép sticker",
  "priority": "style",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```
`duration` 2.2 = 0.4 + 1.6 + 0.2. Nội dung là minh họa.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Dùng ở documentary | validate báo `forbidden_styles` | Chọn `text_pill_clean` hoặc `kinetic_text` |
| Chữ khó đọc | Viền dày ăn thân chữ, màu gần màu nền | Tăng độ đậm, đổi màu viền |
| Quá nhiều sticker | Nhiều nhãn liên tiếp | Một sticker mỗi khung, thưa |
| Dùng cho thông tin quan trọng | Số liệu, tên trong sticker | Dùng `big_number`, `lower_third` |
| Nghiêng quá tay | `rotate` > 8° | Giữ ±8° |
| Che mặt | Sticker ở giữa đè mặt | Dời `position` |

## 10. Kiểm tra sau render
- Chữ đọc rõ ngay lần nhìn đầu; viền đều, không ăn mất nét; dấu tiếng Việt không bị viền nuốt.
- Bóng cứng lệch đúng chiều, không đè khối chữ khác; góc nghiêng hợp.
- Không che mặt, không chạm mép.
- Cần xem preview: hoạt ảnh `pop`, nền sáng, chữ có dấu nhiều dòng, 1080p/4K.
