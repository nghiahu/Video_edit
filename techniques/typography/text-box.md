---
id: text_box
name: Text Box (Hộp, băng, vạch chữ)
group: typography
roles: [information, emphasis]
status: usable
source_of_values: convention
---

# Text Box

## 1. Mục đích
Đặt một câu hoặc chú thích ngắn (tối đa 2 dòng, 14 từ) trên **nền hộp, băng hoặc vạch** để chữ đọc được trên hình rối. Độ dài giữa `kinetic_text` (nhấn cụm) và `subtitles` (toàn bộ lời).

## 2. Khi nên dùng
- Câu trích, chú thích, ghi chú ngắn cần hiện cố định một lúc (`R-BOX-1`).
- Nền hình rối hoặc sáng không đều, chữ trần dễ chìm: dùng hộp tối (`text_box_dark`) hoặc có vạch (`text_box_bar`).
- Cần ngôn ngữ thị giác "tin tức/trích dẫn" nhẹ: hộp có vạch bên trái.
- Muốn chữ tiết chế, chỉ cần dấu nhấn: `text_box_underline` (gạch chân, không nền).

**Khác với `subtitles`:** phụ đề là chữ **lời nói** theo `cues` (thời điểm riêng từng dòng), nằm cố định ở đáy (`bottom_percent` 8, `max_cps` 17, ≤ 42 ký tự mỗi dòng). `text_box` là **một khối** có `hold` theo công thức, vị trí linh hoạt, có hộp trang trí, và không đồng bộ từng câu nói. Không dùng `text_box` làm phụ đề thay thế.

## 3. Khi không nên dùng
- Nội dung là toàn bộ lời nói: dùng `subtitles` (`R-BOX-3`).
- Chữ dài hơn 14 từ hoặc hơn 2 dòng (validate báo lỗi).
- Nền hình sạch, chữ trắng có bóng đã đọc được: dùng `kinetic_text` hoặc không dùng hộp (hộp là trang trí thừa).
- Hộp sẽ che mặt, tay, hay chữ trên hình (`R-TXT-3`); hộp rộng nên đặt ở vùng đáy-trái/giữa nơi không có mặt.
- Style documentary với `text_box_banner` (cấm).
- Cùng lúc có `subtitles`, `lower_third` hay chữ nhấn khác ở vùng gần.

## 4. Thông số
Khối nền `_text_style_base`; giá trị của `text_box_dark` trừ khi ghi khác.

| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `text` hoặc `lines` | – | tối đa 14 từ, 2 dòng | – | medium |
| `hold` (nội dung) | `0.8 + 0.3 × số_từ`, ≥ 1.0 | ≥ công thức | giây | medium |
| `font_size` | 50 (bar 48, underline 54, banner 56) | 12–600 (validate) | px @1080p | medium |
| `font_weight` | 600 (banner 800) | theo phông | – | medium |
| `box_style` | `rounded` | `rounded`, `bar_left`, `underline`, `rect` | – | medium |
| `box_color` | `rgba(0,0,0,0.6)` (bar 0.55, banner `#B91C2C`) | CSS color | – | low |
| `box_radius` | 16 | chỉ dùng cho `rounded` | px @1080p | low |
| `box_border_width` / `box_border_color` | 0 / `#FFFFFF` (bar 8 / `#F2C14E`; underline 6 / `#F2C14E`) | – | px @1080p | low |
| `box_padding_x` / `box_padding_y` | 36 / 20 | 0–120 / 0–80 (validate) | px @1080p | low |
| `position` | `lower_middle` (bar, banner `lower_left`) | `BLOCK_ENUMS.position` | – | medium |
| `margin` / `margin_bottom` | 6 / 12 (banner 0 / 14) | % khung | % | low |
| `align` | `auto` (bar, banner `left`) | `auto`, `left`, `center`, `right` | – | low |
| `text_transform` | `none` (banner `uppercase`, `letter_spacing` 0.04) | `none`, `uppercase`, `lowercase` | – | low |
| `in_animation` | `fade_up` (bar `fade`, underline `fade`, banner `slide_left`) | `BLOCK_ENUMS.in_animation` | – | low |
| `out_animation` | `fade` (banner `slide_left`) | `BLOCK_ENUMS.out_animation` | – | low |
| `in_duration` / `out_duration` | 0.3 / 0.2 | 0.15–0.4 / 0.1–0.3 (quy ước) | giây | low |

Giới hạn thật: chữ dài **tự xuống dòng** (`white-space: pre-wrap`) khi vượt `max_width_percent` (88%), nhưng `max_lines` trong `validate` chỉ đếm dòng ngắt thủ công (`lines` hoặc `\n`). Hãy chủ động ngắt dòng bằng `lines` hoặc `\n` (tối đa 2) để nhịp đọc đẹp thay vì để máy tự bẻ.

## 5. Quy trình thực hiện
1. Chọn nội dung 1–2 dòng, ≤ 14 từ, ngắt dòng tại chỗ hợp nghĩa; mỗi dòng nên ≤ ~28 ký tự ở cỡ 50 px (quy ước, cần xem preview).
2. Xác nhận cần hộp: nền hình rối hoặc cần trang trí có chủ đích. Nếu không thì dùng chữ khác.
3. Chọn preset theo style (mục 6) và vị trí không che mặt.
4. Tính `hold`; `duration = in_duration + hold + out_duration`.
5. Kiểm tra phối với `subtitles` đang bật: hộp nằm vùng khác, không chồng.
6. Chạy `validate`, xem preview.

## 6. Biến thể và preset
Đã xem trên preview 960×540 của clip thử (khung giữa lúc chữ hiện đủ).
| Preset | Mô tả đã xem | Documentary |
|---|---|---|
| `text_box_dark` | Hộp tối bo góc (bán kính nhỏ ở độ phân giải thấp), chữ trắng, giữa-dưới | Được phép, tiết chế |
| `text_box_bar` | Hộp tối có vạch vàng bên trái, căn trái, hoạt ảnh `fade` | Được phép, tiết chế |
| `text_box_underline` | Chữ gạch chân vàng, không nền, bóng mềm | Được phép, tiết chế |
| `text_box_banner` | Băng đỏ, chữ hoa trắng, trượt vào | **Cấm** (`forbidden_styles`) |

`bar_left` có vạch tối thiểu `6 × k` px; `underline` gạch tối thiểu `5 × k` px dù `box_border_width` nhỏ hơn.

## 7. Quy tắc quyết định
- `R-BOX-1` (validate): ≤ 14 từ, ≤ 2 dòng, `hold` ≥ `max(1.0, 0.8 + 0.3 × số_từ)`, enum hợp lệ, phông có trong registry.
- `R-BOX-2`: NẾU style `documentary` THÌ chỉ `text_box_dark`, `text_box_bar`, `text_box_underline`; ưu tiên `underline` hoặc `dark` (đơn giản hơn); `banner` bị validate từ chối.
- `R-BOX-3`: NẾU nội dung là chữ-theo-lời THÌ dùng `subtitles`; NẾU chỉ cần nhấn cụm ngắn THÌ `kinetic_text`.
- `R-BOX-4`: NẾU nền hình rõ, chữ trần đọc được THÌ bỏ hộp (Clarity chỉ cần khi nền gây khó đọc).
- `R-TXT-3` và một cấp nhấn mỗi khung (`typography/hierarchy.md`); `R-FREQ-2`: không vượt ngân sách.
- Ưu tiên lớp: Clarity > Style > Decoration.

## 8. Ví dụ
Trong clip `c02`, diễn giả đang nói trên nền hậu trường nhiều chi tiết; muốn đặt chú thích hai dòng ở đáy trái, không che mặt. Style documentary dùng `text_box_bar`. 7 từ → hold ≥ 0.8 + 2.1 = 2.9.

```json
{
  "id": "d12",
  "technique": "text_box",
  "preset": "text_box_bar",
  "anchor": { "clip": "c02", "source_time": 12.0 },
  "start_offset": 0.0,
  "duration": 3.5,
  "parameters": { "lines": ["Chương trình đào tạo", "Phân tích Dữ liệu"], "hold": 3.0 },
  "reason": "Chú thích tên chương trình trên nền hậu trường rối; hộp tối giúp đọc rõ",
  "priority": "clarity",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```
`duration` 3.5 = 0.3 + 3.0 + 0.2 (với `in_duration` 0.3 từ khối nền). Nội dung chữ là minh họa.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Câu dài bị bẻ dòng xấu | Máy tự xuống dòng ở chỗ không đẹp | Ngắt 2 dòng bằng `lines` |
| Hộp che mặt/tay | Hộp chồng vùng người | Dời `position`, rút chữ |
| Dùng hộp làm phụ đề | Chữ dài, nhiều câu | Dùng `subtitles` |
| Chồng với phụ đề | Hộp và phụ đề cùng đáy | Dời hộp lên hoặc bỏ |
| Hộp thừa | Nền sạch mà vẫn có hộp | `R-BOX-4` |
| Banner ở documentary | Validate báo lỗi `banner` bị cấm | Đổi `bar` hoặc `underline` |

## 10. Kiểm tra sau render
- Chữ không tràn khung; hai dòng cân nhau tương đối.
- Hộp đủ tương phản với nền; vạch, gạch chân thấy rõ.
- Dấu tiếng Việt hiển thị đủ; đệm hộp đều.
- Không che mặt, nằm trong vùng an toàn; không chồng phụ đề.
- Cần xem preview: hoạt ảnh vào/ra (`slide_left` của banner), 1080p/4K, cảnh có người ở vùng đặt hộp.
