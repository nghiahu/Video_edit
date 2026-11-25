---
id: text_cutout
name: Text Cutout (Chữ cắt xén)
group: typography
roles: [emphasis, identification]
status: usable
source_of_values: convention
---

# Text Cutout

## 1. Mục đích
Phủ khung hình bằng một **lớp màu đặc**, trong đó chữ là "cửa sổ" nhìn xuyên thấy video bên dưới. Chữ cỡ rất lớn trở thành khung nhìn vào cảnh quay, dùng làm tiêu đề mở đầu hoặc tên chương trình. Là chữ nhấn cấp 1 (`typography/hierarchy.md`) và che gần hết khung.

## 2. Khi nên dùng
- Tiêu đề **1–2 dòng, tối đa 3 từ**, cỡ chữ rất lớn (≥ 200 px @1080p), ở mở đầu hoặc kết (`R-CUT-1`).
- Cảnh nền có hình rõ, nhiều chi tiết hoặc chuyển động đẹp để nhìn qua nét chữ.
- Muốn tiêu đề có sức nặng điện ảnh, không cần phụ đề hay chữ phụ cùng khung.

**Chọn đúng kỹ thuật:**
| Tình huống | Chọn |
|---|---|
| Chữ khung nhìn vào video, phủ nền màu | `text_cutout` |
| Chữ to có viền/bóng, video nguyên vẹn xung quanh | `big_text` |
| Tiêu đề có nền mờ hoặc nền tối nhẹ | `title_card` |

## 3. Khi không nên dùng
- Style documentary: cả hai preset có `forbidden_styles: [documentary]`; lớp phủ màu đặc che hình, trái với "để nội dung và con người dẫn dắt" (`R-CUT-2`).
- Hơn 3 từ hoặc hơn 2 dòng (validate báo lỗi); chữ dài làm phải thu nhỏ cỡ, mất hiệu ứng.
- Cảnh nền phẳng, tối hoặc ít chi tiết: qua nét chữ chỉ thấy mảng màu.
- Cần chữ phụ, hộp, biểu tượng, bóng trong cùng khối: nhánh cutout **bỏ qua** các khóa này.
- Chữ nét mảnh hoặc cỡ < 200 px: không nhìn xuyên được (validate cảnh báo).

## 4. Thông số
Khối nền `_text_style_base`; giá trị theo preset (bold / outline). Cỡ chữ tính cho 1080p.
| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `cutout` | `true` (nền `false`) | bắt buộc `true` (validate) | – | medium |
| `cutout_color` | `#0F172A` / `#111827` (nền `#0F172A`) | màu CSS; cảnh báo nếu thiếu | – | low |
| `cutout_opacity` | 0.92 / 0.9 (nền 0.92) | 0–1 (lỗi nếu ngoài); cảnh báo nếu < 0.7 | tỉ lệ | low |
| `cutout_outline_width` | 0 / 4 (nền 0) | ≥ 0; không kiểm tra | px @1080p | low |
| `cutout_outline_color` | `#FFFFFF` | màu CSS | – | low |
| `cutout_scale_from` / `cutout_scale_to` | 1 / 1 (`cutout_dive`: 1 / 7) | 0.5–12 (validate chặn ngoài khoảng) | hệ số | low |
| `cutout_scale_ease` | `out` (`cutout_dive`: `in`) | `out`, `in`, `inout`, `linear` | – | low |
| `cutout_focus_x` / `cutout_focus_y` | 0.5 / 0.5 | 0–1 | tỉ lệ khung | low |
| `font_family` / `font_weight` | Anton 400 / Inter 900 | vai trò `heading`/`emphasis`; cảnh báo nếu phông có độ đậm ≥ 700 mà `font_weight` < 700 | – | low |
| `font_size` | 420 / 360 | 12–600 (lỗi); cảnh báo nếu < 200 (không áp khi `fit_width`) | px @1080p | low |
| `line_height` | 1 | không kiểm tra | – | low |
| `text_transform` | `uppercase` | chỉ `uppercase` được áp; `lowercase` bị bỏ qua | – | low |
| `line_scales` | `[]` | áp từng dòng | hệ số | low |
| `in_duration` / `out_duration` | 0.5 / 0.3 | không kiểm tra | giây | low |
| `hold` (nội dung) | `0.8 + 0.3 × số_từ`, ≥ 1.0 | ≥ công thức | giây | medium |
Hiện thực (`TextBlock.jsx`, nhánh `p.cutout`, SVG mask): chữ luôn **căn giữa khung** (bỏ qua `position`, `margin`, `align`, `line_gap`); lớp màu mờ vào/ra theo `in_duration`/`out_duration`, chữ phóng từ 1.25× về 1× trong `in_duration`; **không dùng** `in_animation`, `out_animation`, `rotate`. Bỏ qua: hộp nền, `sub_text`, `bullet`, `icon`, bóng, glow, gradient, `text_color`, `bg_mode`. Viền (khi `cutout_outline_width` > 0) vẽ nét quanh chữ.

## 5. Quy trình thực hiện
1. Chọn cảnh nền có hình rõ; rút tiêu đề ≤ 3 từ, giữ dấu; kiểm tra mục 3.
2. Chọn preset (mục 6); giữ `font_size` ≥ 200, phông đậm.
3. Đặt `hold ≥ max(1.0, 0.8 + 0.3 × số_từ)`; vì lớp phủ che gần hết khung, đừng kéo dài quá mức cần đọc.
4. Đặt `duration = in_duration + hold + out_duration`.
5. Chạy `validate`; xem preview xem video có hiện qua nét chữ không.

## 6. Biến thể và preset
Hai preset đã xem trên preview 960×540 của clip thử (khung tĩnh nhiều thời điểm): nền xanh đen phủ khung, nét chữ cho thấy video; `cutout_outline` có viền trắng mảnh. Chữ cỡ 360–420 px.
| Preset | Mô tả | Documentary |
|---|---|---|
| `cutout_bold` | Anton HOA 420 px, nền `#0F172A` 0.92 | **Cấm** |
| `cutout_outline` | Inter 900 HOA 360 px, nền `#111827` 0.9, viền trắng 4 px | **Cấm** |
Chưa có preset dùng được ở documentary; cần tiêu đề thì dùng `title_card_clean` hoặc `title_card_editorial`.

## 7. Quy tắc quyết định
- `R-CUT-1` (validate): `cutout: true`; ≤ 3 từ, ≤ 2 dòng; `cutout_opacity` ∈ [0, 1]; `font_size` ∈ [12, 600]; `hold` ≥ `max(1.0, 0.8 + 0.3 × số_từ)`; vai trò phông `heading`/`emphasis`; enum hợp lệ.
- `R-CUT-2`: NẾU style `documentary` THÌ không dùng.
- `R-CUT-3` (cảnh báo): `font_size` < 200 (không áp khi `fit_width`), `cutout_opacity` < 0.7, hoặc phông có độ đậm ≥ 700 mà `font_weight` < 700 thì tăng hoặc đổi.
- `R-CUT-4`: NẾU cần phụ đề, hộp, biểu tượng hoặc bóng THÌ dùng kỹ thuật khác; cutout bỏ qua chúng.
- `R-CUT-5`: chỉ một tiêu đề cutout mỗi khung, không đồng thời chữ nhấn khác (che gần hết khung).
- Ưu tiên lớp: Clarity (chữ đọc được qua nét xuyên) > Style > Decoration (viền).

## 8. Ví dụ
Tiêu đề mở đầu trên cảnh toàn cảnh rộng trong clip `c01`, style không phải documentary (hiện chỉ có `documentary` trong `styles/`; ví dụ minh họa quyết định). 2 từ nên `hold` ≥ 1.4; chọn 2.5 để người xem nhìn cả hình.
```json
{
  "id": "d02",
  "technique": "text_cutout",
  "preset": "cutout_bold",
  "anchor": { "clip": "c01", "source_time": 1.0 },
  "start_offset": 0.0,
  "duration": 3.3,
  "parameters": { "text": "Mở đầu", "hold": 2.5 },
  "reason": "Tiêu đề mở video trên cảnh toàn cảnh nhiều chi tiết, tạo sức nặng",
  "priority": "style",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```
`duration` 3.3 = 0.5 + 2.5 + 0.3. Nội dung chữ là minh họa.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Chữ quá nhỏ, mảnh | Cảnh báo `font_size` < 200 hoặc `font_weight` < 700 | Cỡ ≥ 200, phông đậm |
| Nền phủ gần trong suốt | `cutout_opacity` < 0.7, chữ lẫn nền | 0.9–0.95 |
| Cảnh nền phẳng | Qua nét chữ chỉ thấy mảng màu | Đổi cảnh hoặc dùng `title_card` |
| Kỳ vọng hộp, bóng, phụ đề | Không thấy hiệu ứng | Nhánh cutout bỏ qua (`R-CUT-4`) |
| Dùng ở documentary | Validate báo `forbidden_styles` | `title_card_*` |
| Chữ dài tràn khung | > 3 từ; validate báo lỗi | Rút chữ |

### Lao vào chữ (preset `cutout_dive`)
Khi `cutout_scale_to` ≠ `cutout_scale_from`, chữ phóng dần **suốt thời gian khối** quanh điểm (`cutout_focus_x`, `cutout_focus_y`) với đường `cutout_scale_ease` (`in` = tăng tốc, cảm giác lao vào). Nét chữ là vector nên không vỡ nét. Khi chữ lớn gấp nhiều lần, phần nhìn xuyên thấy video rộng ra; cuối cùng nền màu mờ đi (`out_animation: fade`, nên `out_duration` ≥ 0.4 s; `validate` cảnh báo nếu phóng > ×3 mà `out_duration` ngắn hơn) và hình hiện trọn.
- **Gợi ý dùng:** làm cảnh mở đầu cho cảnh quay có chuyển động tiến vào (drone bay tới, dolly in, đi bộ tiến vào hội trường): chữ lao vào cùng hướng với camera nên hai chuyển động cộng hưởng; hoặc làm điểm chuyển từ tiêu đề sang cảnh đầu tiên. Tránh cảnh quay đang lùi ra hoặc quay ngang.
- Chọn `cutout_focus_x/y` vào chỗ rỗng của chữ (khoảng giữa hai chữ cái, lỗ chữ) nếu muốn "chui qua" chữ; đặt vào giữa nét chữ thì màn hình bị che dày hơn lúc cuối.
- Đã xem trên preview 960×540 (preset `cutout_dive`, hold 2.0 s, tổng 3.0 s, tâm khung): chữ lớn dần, đến giữa chừng chỉ còn vài chữ cái, rồi nền mờ đi và hình hiện trọn. Chưa kiểm chứng: tâm lao vào lệch khỏi giữa khung; thời lượng ngắn dưới 2 s (chữ lao nhanh có thể khó đọc kịp); 1080p/4K.

## 10. Kiểm tra sau render
- Nét chữ cho thấy video rõ (chữ nhận ra được); phần phủ đúng màu và độ mờ.
- Viền (nếu có) đều, không răng cưa; dấu tiếng Việt không dính hoặc cụt.
- Chữ nằm trong khung (không tràn mép) và căn giữa.
- Cần xem preview (chưa kiểm chứng): hoạt ảnh vào/ra (phóng + mờ); cutout với **chữ tiếng Việt dài**; 1080p/4K.
