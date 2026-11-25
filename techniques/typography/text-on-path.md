---
id: text_on_path
name: Text on Path (Chữ chạy theo đường cong)
group: typography
roles: [emphasis, identification]
status: usable
source_of_values: convention
---

# Text on Path

## 1. Mục đích
Cho **một dòng chữ ngắn chạy dọc một đường cong** (vòng cung, sóng, vòng tròn) để tạo hình huy hiệu, logo, dấu triện hoặc nét vui tươi. Chữ trở thành một họa tiết, nên là chữ nhấn cấp 1 và chỉ dùng cụm ngắn.

## 2. Khi nên dùng
- Nhãn **đúng một dòng, tối đa 8 từ**: tên chương trình, khẩu hiệu ngắn, tên sự kiện dạng huy hiệu (`R-PATH-1`).
- Cần hình dạng: vòng cung phía trên logo hoặc đối tượng, đường sóng vui tươi, dấu triện tròn.
- Nền thoáng, không có mặt người ở vùng đường cong chạy qua.

**Chọn đúng kỹ thuật:**
| Tình huống | Chọn |
|---|---|
| Một dòng cong theo hình | `text_on_path` |
| Nhãn thẳng trong hộp bo tròn | `text_pill` |
| Chữ nhấn thẳng, to | `big_text` |

## 3. Khi không nên dùng
- Style documentary: cả ba preset có `forbidden_styles: [documentary]` (`R-PATH-2`).
- Nhiều dòng (validate lỗi vì `maxLines` 1) hoặc > 8 từ.
- Cần hộp nền hoặc `sub_text`: nhánh path **bỏ qua** hai thứ này.
- Chữ dài hơn đường (vòng tròn, cung): phần vượt chiều dài đường **không được vẽ** (`R-PATH-3`).
- Chữ phải đọc nhanh, nội dung quan trọng: chữ cong, đảo chiều ở đỉnh khó đọc hơn chữ thẳng.
- Chữ gần mép khung hoặc đè mặt người.

## 4. Thông số
Khối nền `_text_style_base`; giá trị theo preset (arc_up / wave / circle). Cỡ chữ tính cho 1080p.
| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `path_shape` | `arc_up` / `wave` / `circle` (nền `none`) | `arc_up`, `arc_down`, `wave`, `circle`; bắt buộc ≠ `none` (validate) | – | medium |
| `path_curve` | 0.25 / 0.1 / (không ghi, nền 0.3) | 0–0.6 (validate) | tỉ lệ chiều cao khung | low |
| `path_width` | 0.8 / 0.85 / 0.32 (nền 0.8) | 0.2–1 (validate) | tỉ lệ chiều rộng khung | low |
| `path_y` | 0.55 / 0.5 / 0.5 (nền 0.5) | 0–1 (validate) | tỉ lệ chiều cao khung | low |
| `path_reveal` | `start` (cả ba preset) | `none`, `start`, `end`; `validate` cảnh báo nếu không có | – | low |
| `path_reveal_duration` / `path_reveal_delay` | 1.0 / 0.1 | 0.2–3 (validate) / không kiểm | giây | low |
| `path_reveal_slide` | 0.06 | 0–0.3 (validate) | tỉ lệ đường | low |
| `font_family` / `font_weight` | Playfair Display 700 / Baloo 2 800 / Anton 400 | vai trò `emphasis`/`heading`/`accent`/`subtitle` | – | low |
| `font_size` | 84 / 96 / 64 | 12–600 (validate; renderer **không** dùng `fit_width`) | px @1080p | low |
| `letter_spacing` | 0.08 / 0 / 0.12 | không kiểm tra | em | low |
| `text_transform` | `uppercase` / `none` / `uppercase` | chỉ `uppercase` được áp; `lowercase` bị bỏ qua | – | low |
| `text_color` | `#FFFFFF` / `#FFD84D` / `#FFFFFF` | màu CSS | – | low |
| `stroke_width`, `hollow` | 0, `false` | `stroke_width` 0–24; `hollow` vẽ viền 3 px | px @1080p | low |
| `shadow_type` | `soft` / `hard` (4/4) / `soft` | enum; áp bằng `drop-shadow` | – | low |
| `hold` (nội dung) | `0.8 + 0.3 × số_từ`, ≥ 1.0 | ≥ công thức | giây | medium |
| `in_animation` / `out_animation` | `fade` / `fade` (`in_duration` 0.4, `out_duration` 0.3) | enum; áp lên cả khối | – | low |
Hình học (`TextBlock.jsx`, nhánh `p.path_shape`, SVG `textPath`): đường nằm giữa theo chiều ngang, rộng `path_width × W`, tại độ cao `path_y × H`. `arc_up`/`arc_down`: đỉnh lệch `path_curve × H` lên/xuống so với hai đầu. `wave`: một đỉnh và một đáy biên độ `path_curve × H`. `circle`: đường kính `path_width × W`, chữ bắt đầu từ đỉnh (căn giữa tại 25% chu vi), **bỏ qua `path_curve`**. Chữ đặt trên đường, căn giữa. Khi circle có đường kính > chiều cao khung (`path_width × W > H`, tức `path_width` > 0.5625 ở 16:9) vòng bị cắt mép (suy từ hình học, low).
Bỏ qua: hộp nền, `sub_text`, `bullet`, `icon`, `position`, `margin`, `align`, `line_height`, glow, gradient, `fit_width`; nhiều dòng bị nối thành một dòng bằng dấu cách (nhưng validate đã chặn nhiều dòng).

## 5. Quy trình thực hiện
1. Rút nhãn một dòng ≤ 8 từ, giữ dấu; kiểm tra mục 3.
2. Chọn hình và preset (mục 6). Ước chiều dài chữ so với đường (`R-PATH-3`).
3. Đặt `path_y`, `path_curve` để đường nằm trong khung với lề ≥ 5%: `arc_up` cần `path_y − path_curve − font_size/1080 ≥ 0.05`; `arc_down` cần `path_y + path_curve ≤ 0.95`; `wave` cần `path_y ± path_curve` trong khoảng 0.05–0.95.
4. `hold ≥ max(1.0, 0.8 + 0.3 × số_từ)`; `duration = in_duration + hold + out_duration`.
5. Chạy `validate`; xem preview (chữ không đè nhau, không bị cắt cuối).

## 6. Biến thể và preset
Ba preset đã xem trên preview 960×540 của clip thử (khung tĩnh nhiều thời điểm): `arc_up` cong lên; `wave` lượn mượt (bản đầu dùng đường cong chữ S làm chữ đè nhau, đã đổi sang Q/T); `circle` (`path_width` 0.32) chỉ phủ một phần vòng khi chữ ngắn.
| Preset | Mô tả | Documentary |
|---|---|---|
| `path_arc_up` | Playfair Display HOA, vòng cung lên, bóng mềm | **Cấm** |
| `path_wave` | Baloo 2 vàng `#FFD84D`, sóng, bóng cứng | **Cấm** |
| `path_circle` | Anton HOA, vòng tròn nhỏ (dấu triện) | **Cấm** |
Chưa có preset dùng được ở documentary.

## 7. Quy tắc quyết định
- `R-PATH-1` (validate): `path_shape` ≠ `none` và thuộc enum; đúng 1 dòng, ≤ 8 từ; `path_curve` ∈ [0, 0.6]; `path_width` ∈ [0.2, 1]; `path_y` ∈ [0, 1]; `hold` ≥ `max(1.0, 0.8 + 0.3 × số_từ)`; vai trò phông hợp; enum hợp lệ.
- `R-PATH-2`: NẾU style `documentary` THÌ không dùng.
- `R-PATH-3`: NẾU chữ dài hơn đường THÌ rút chữ, giảm `font_size`/`letter_spacing` hoặc tăng `path_width`; validate **không** kiểm tra chiều dài chữ so với đường.
- `R-PATH-4`: NẾU `circle` và `path_width × W > H` THÌ giảm `path_width` (vòng tràn khung).
- `R-PATH-5`: không cùng khung với chữ nhấn khác; không che mặt (`R-TXT-3`).
- Ưu tiên lớp: Clarity (chữ không đè, đọc được) > Style (hình đúng) > Decoration (bóng, màu).

## 8. Ví dụ
Huy hiệu tên sự kiện phía trên logo trong clip `c01`, style không phải documentary (hiện chỉ có `documentary` trong `styles/`; ví dụ minh họa quyết định). 3 từ nên `hold` ≥ 1.7; chọn 2.5.
```json
{
  "id": "d03",
  "technique": "text_on_path",
  "preset": "path_arc_up",
  "anchor": { "clip": "c01", "source_time": 2.0 },
  "start_offset": 0.0,
  "duration": 3.2,
  "parameters": { "text": "Lễ khai giảng", "hold": 2.5 },
  "reason": "Gắn tên sự kiện dạng huy hiệu cong phía trên logo, một dòng ngắn",
  "priority": "style",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```
`duration` 3.2 = 0.4 + 2.5 + 0.3. Nội dung chữ là minh họa.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Chữ dài hơn đường | Cuối chữ biến mất (circle, cung) | `R-PATH-3` |
| Chữ đè nhau ở sóng | Đường S/gấp khúc làm các ký tự chồng | Dùng `wave` với `path_curve` nhỏ (≤ 0.15) |
| Vòng tràn khung | `circle` với `path_width` lớn | `R-PATH-4` |
| Kỳ vọng hộp, `sub_text`, `position` | Không có tác dụng | Nhánh path bỏ qua; dùng kỹ thuật khác |
| Dùng ở documentary | Validate báo `forbidden_styles` | Dùng `title_card`, `text_pill_clean` |
| `path_shape: none` | Validate báo lỗi | Đặt một hình |

### Chữ chạy dần ra
Chữ **không hiện đột ngột**: với `path_reveal: start` từng ký tự hiện nối tiếp từ đầu đường (cung và sóng: từ trái; vòng tròn: theo chiều kim đồng hồ từ bên trái), mép hiện mờ dần khoảng 3 ký tự, đồng thời cả chuỗi trượt nhẹ theo chiều chạy (`path_reveal_slide`). `end` chạy từ phía ngược lại. Thời gian chạy ra `path_reveal_duration` (mặc định 1.0 s) cộng `path_reveal_delay`; `validate` cảnh báo nếu chạy ra xong chưa đủ 0.6 s đọc trước khi khối kết thúc (tăng `hold`). Preset để `in_animation: none` để không chồng hai hiệu ứng vào. Đã xem trên preview 960×540 (3 preset, 4 thời điểm mỗi preset): chữ lớn dần theo đường từ đầu đến cuối, rồi giữ nguyên. Chưa kiểm chứng: `end`, chữ dài phủ kín vòng tròn, hiệu ứng ra (chỉ mờ theo `out_animation`).

## 10. Kiểm tra sau render
- Chữ chạy mượt theo đường, không đè nhau, không cụt cuối; đủ dấu tiếng Việt.
- Đường nằm trong khung, lề ≥ 5%; đỉnh cung/sóng không chạm mép.
- Bóng, màu đúng preset; không che mặt.
- Cần xem preview (chưa kiểm chứng): hoạt ảnh vào/ra; chữ **dài phủ kín vòng** (`circle`); 1080p/4K.
