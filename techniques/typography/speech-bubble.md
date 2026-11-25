---
id: speech_bubble
name: Speech Bubble (Bong bóng thoại)
group: typography
roles: [identification, information, emphasis]
status: usable
source_of_values: convention
---

# Speech Bubble

## 1. Mục đích
Đặt một câu nói vào **bong bóng có đuôi** chỉ về phía người nói, để người xem hiểu ngay "ai nói câu này". Giọng vui, truyện tranh, thân thiện; nội dung là lời nói thật hoặc câu thoại có nguồn.

## 2. Khi nên dùng
- Câu ngắn (tối đa 14 từ, 3 dòng; `R-BUB-1`) do **người nói thật nói** trong clip, hoặc câu thoại do người dùng cung cấp.
- Biết **vị trí người nói trong khung** (từ phân tích hình, hoặc người dùng cho biết) để đặt đuôi đúng hướng.
- Style vui (vlog, trẻ em, hoạt hình thực tế, mạng xã hội).

| Tình huống | Chọn |
|---|---|
| Câu thoại gắn với người nói, đuôi chỉ người | `speech_bubble` |
| Câu trích có tên người nói, trang trọng | `pull_quote` |
| Lời nói liên tục theo thời gian | `subtitles` |

## 3. Khi không nên dùng
- Style `documentary`: cả ba preset có `forbidden_styles: ["documentary"]`.
- **Bịa lời** cho người nói hoặc đưa lời không có nguồn (`R-BUB-3`).
- Không biết người nói đứng đâu: đuôi chỉ sai người gây hiểu lầm; dùng `text_box` hoặc phụ đề.
- Câu dài hơn 14 từ hoặc quá 3 dòng (validate lỗi); lời nói liên tục (dùng phụ đề).
- Bong bóng sẽ che mặt người nói hoặc người khác (`R-TXT-3`).

## 4. Thông số
Khối nền `_text_style_base`; giá trị là của `speech_bubble_white` trừ khi ghi khác. Cỡ chữ tính cho 1080p.

| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `text` (hoặc `lines`) | – | 1–14 từ, ≤ 3 dòng | – | medium |
| `hold` (nội dung) | `0.8 + 0.3 × số_từ`, ≥ 1.0 | ≥ công thức | giây | medium |
| `box_style` | `bubble` | **bắt buộc `bubble`** (validate lỗi nếu khác) | – | medium |
| `tail` | `bottom_left` (`dark`: `bottom_right`) | `none`, `bottom_left`, `bottom_center`, `bottom_right`, `top_left`, `top_center`, `top_right`, `left`, `right` (8 hướng + `none`; enum) | – | low |
| `tail_size` | 42 | 8–80 (validate) | px @1080p | low |
| `box_radius` | 32 (`dark` 30, `cute` 40) | không kiểm tra (mặc định code 28) | px @1080p | low |
| `box_color` | `#FFFFFF` (`dark`: `#1E1B2E`, `cute`: `#FFE1EC`) | CSS color | – | low |
| `box_border_width` / `box_border_color` | 0 (`dark` 3 `#FFFFFF`, `cute` 5 `#FFB3CE`) | không kiểm tra | px @1080p | low |
| `box_padding_x` / `box_padding_y` | 48 / 28 | 0–120 / 0–80 (validate) | px @1080p | low |
| `box_shadow` | `0 6px 24px rgba(0,0,0,0.3)` (white) | chuỗi CSS | – | low |
| `font_family` / `font_size` | Nunito 700 / 48 (`dark`: Inter 600 / 46; `cute`: Baloo 2 700 / 52, `text_color` `#B0305F`) | 12–600; Baloo 2 ≥ 48 | px @1080p | medium |
| `position` / `margin_bottom` | `lower_left` / 18 (`dark`: `lower_right`) | 9 vị trí / % đáy | – | medium |
| `max_width_percent` | 55 | không kiểm tra | % khung | low |
| `rotate` | 0 (`cute` −2) | −30–30 (validate) | độ | low |
| `in_animation` | `pop` | enum | – | low |

Hiện thực của đuôi (`Tail` trong `TextBlock.jsx`): một **ô vuông cạnh `tail_size` xoay 45°**, cùng `box_color`, chỉ vẽ hai cạnh viền phía ngoài; đặt ở 16% từ mép trái/phải (`*_left`, `*_right`), chính giữa (`*_center`) hoặc giữa cạnh (`left`, `right`). Đuôi **không** nhận `box_shadow` nên bóng của hộp và đuôi có thể lệch. Đuôi chỉ là hình thoi nhọn ngắn, không phải đuôi cong của truyện tranh. Đã xem `bottom_left` và `bottom_right` (đuôi khá nhỏ ở `tail_size` 30–42); các hướng khác **cần xem preview**.

## 5. Quy trình thực hiện
1. Lấy câu thoại thật (hoặc có nguồn); không sửa nghĩa. Rút ≤ 14 từ, bỏ từ thừa.
2. Xác định người nói và **vị trí họ trong khung** (trái/phải, cao/thấp so với bong bóng).
3. Chọn `position` của bong bóng và `tail` để đuôi chỉ về phía người nói: người ở **dưới/trái-dưới** bong bóng thì `bottom_left`; ở phải thì `bottom_right`; ở cạnh bong bóng thì `left`/`right`; ở trên thì `top_*`.
4. Chọn preset (mục 6) theo tông video; giữ một preset cho cả video.
5. `hold = max(1.0, 0.8 + 0.3 × số_từ)`; `duration = in_duration + hold + out_duration`. Hold nên chiếm lúc người nói đang nói.
6. `validate`, rồi xem preview (đuôi có chỉ đúng người, không che mặt).

## 6. Biến thể và preset
Đã xem trên preview 960×540 của clip thử (khung giữa lúc chữ hiện đủ): bong bóng có đuôi, trắng / tối viền trắng / hồng nhạt nghiêng.
| Preset | Mô tả | Documentary |
|---|---|---|
| `speech_bubble_white` | Trắng, chữ xám đậm Nunito, đuôi dưới trái | **Cấm** |
| `speech_bubble_dark` | Tối `#1E1B2E` viền trắng 3, chữ trắng, đuôi dưới phải | **Cấm** |
| `speech_bubble_cute` | Hồng nhạt viền hồng 5, Baloo 2, nghiêng −2°, đuôi dưới trái | **Cấm** |

## 7. Quy tắc quyết định
- `R-BUB-1` (validate): `text` ≤ 14 từ, ≤ 3 dòng; **`box_style` phải là `bubble`**; `tail` thuộc enum; `tail_size` 8–80; `hold` ≥ công thức; phông có vai trò `emphasis`, `accent` hoặc `subtitle`.
- `R-BUB-2`: NẾU biết vị trí người nói THÌ đặt `tail` chỉ về phía họ; NẾU không biết THÌ không dùng bong bóng.
- `R-BUB-3`: chỉ dùng cho lời người nói **thật nói** hoặc câu thoại có nguồn; không bịa, không gán lời cho người thật.
- `R-BUB-4` (validate qua `forbidden_styles`): NẾU style `documentary` THÌ không dùng.
- `R-TXT-3`, một cấp nhấn mỗi khung. Ưu tiên lớp: Clarity > Style > Decoration.

## 8. Ví dụ
Clip `c04`, người nói đứng ở phần trên-trái khung (đã biết từ phân tích hình), bong bóng đặt ở góc dưới trái nên đuôi phải chỉ **lên**: dùng `speech_bubble_white` và ghi đè `tail: top_left`. 5 từ → hold ≥ 0.8 + 1.5 = 2.3; chọn 3.0.
```json
{
  "id": "d30",
  "technique": "speech_bubble",
  "preset": "speech_bubble_white",
  "anchor": { "clip": "c04", "source_time": 12.0 },
  "start_offset": 0.0,
  "duration": 3.6,
  "parameters": { "text": "Mình bắt đầu thôi nào!", "tail": "top_left", "hold": 3.0 },
  "reason": "Câu người nói thật nói trong clip; đuôi chỉ lên phía người nói ở trên-trái",
  "priority": "style",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```
`duration` 3.6 = 0.4 + 3.0 + 0.2. Lời thoại là minh họa. `tail` là khóa có trong preset nên được phép ghi đè.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Đuôi chỉ sai người | Đuôi hướng xuống nhưng người ở trên | `R-BUB-2`, đổi `tail` |
| Bịa lời | Câu không có trong lời thoại | `R-BUB-3` |
| `box_style` khác `bubble` | validate lỗi | Giữ `bubble` |
| Dùng ở documentary | validate báo `forbidden_styles` | `text_box` hoặc `subtitles` |
| Bong bóng che mặt | Hộp đè mặt người nói | Dời `position`, rút chữ |
| Câu quá dài | > 14 từ hoặc 4 dòng | Rút gọn |

## 10. Kiểm tra sau render
- Đuôi chỉ đúng người nói, dính liền hộp, không hở, viền liền ở chỗ nối.
- Chữ đọc rõ trong bong bóng, không tràn; dấu tiếng Việt đủ.
- Không che mặt; hộp trong vùng an toàn.
- Cần xem preview: đuôi ở các hướng khác `bottom_left`/`bottom_right`, hoạt ảnh `pop`, bóng hộp và đuôi, người nói đang chuyển động, 1080p/4K.
