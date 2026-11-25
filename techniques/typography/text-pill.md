---
id: text_pill
name: Text Pill (Nhãn con nhộng)
group: typography
roles: [identification, information, emphasis]
status: usable
source_of_values: convention
---

# Text Pill

## 1. Mục đích
Gắn một **nhãn ngắn** (tên người, chủ đề, từ khóa, địa điểm) trong hộp bo tròn hết cỡ, để người xem biết "đây là gì / ai" trong một cái liếc mắt. Thuộc cấp 2 (thông tin) trong `typography/hierarchy.md`, trừ khi dùng làm nhãn nhấn duy nhất của khung.

## 2. Khi nên dùng
- Cần nhãn **một dòng, tối đa 5 từ**: tên chủ đề của đoạn, tên địa điểm, tên công cụ, một từ khóa lặp lại (`R-PILL-1`).
- Chỉ cần định danh **một vế** (chỉ tên hoặc chỉ chủ đề), không có chức danh đi kèm.
- Muốn nhãn nằm ở góc trên (mặc định `top_left`) để không tranh vùng dưới với phụ đề và `lower_third`.
- Nhãn lặp lại nhiều lần trong video cần cùng một diện mạo (một preset cho cả video).

**Chọn pill thay vì hai kỹ thuật kia khi:**
| Tình huống | Chọn |
|---|---|
| Nhãn một dòng, không cần chức danh | `text_pill` |
| Tên **và** chức danh (hai dòng), lần đầu người xuất hiện | `lower_third` |
| Cụm từ nhấn ý theo lời nói, cần chuyển động và nằm giữa-thấp | `kinetic_text` |

## 3. Khi không nên dùng
- Nhãn dài hơn 5 từ hoặc cần xuống dòng (validate báo lỗi, `R-PILL-1`).
- Cần tên + chức danh: dùng `lower_third` (`R-LT-1`).
- Cùng lúc đang có `lower_third`, `kinetic_text` hay chữ nhấn khác: một cấp nhấn mỗi khung (`R-PILL-3`).
- Góc trên đang có logo, đồng hồ, chữ trên hình hoặc bị mặt người/đầu che (`R-TXT-3`).
- Style documentary với `text_pill_brand`, `text_pill_cute` (nằm trong `forbidden_styles`, validate báo lỗi).
- Dùng pill cho mọi cảnh: nhãn lặp lại liên tục thành nhiễu.

## 4. Thông số
Khối nền `_text_style_base`; giá trị dưới đây là của `text_pill_clean` trừ khi ghi khác. Cỡ chữ tính cho 1080p, renderer nhân theo độ phân giải.

| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `text` | – | 1–5 từ, 1 dòng | – | medium |
| `hold` (nội dung) | `0.8 + 0.3 × số_từ`, ≥ 1.0 | ≥ công thức | giây | medium |
| `font_size` | 40 (brand 42, cute 46) | 12–600 (validate) | px @1080p | medium |
| `font_weight` | 600 (brand 700, cute 700) | theo phông | – | medium |
| `font_family` | Inter (cute: Baloo 2) | phông có trong `font-registry.json` | – | medium |
| `box_style` | `pill` | `pill` (đặc trưng kỹ thuật) | – | medium |
| `box_color` | `rgba(15,18,30,0.78)` | CSS color | – | low |
| `box_border_width` / `box_border_color` | 0 / `#FFFFFF` (outline 3, cute 3 + `#FFB3CE`) | 0–… px | px @1080p | low |
| `box_padding_x` / `box_padding_y` | 30 / 14 | 0–120 / 0–80 (validate) | px @1080p | low |
| `position` | `top_left` | 9 vị trí trong `BLOCK_ENUMS.position` | – | medium |
| `margin` | 5 | % khung | % | medium |
| `in_animation` | `fade_up` (outline `fade`, brand/cute `pop`) | `BLOCK_ENUMS.in_animation` | – | low |
| `in_duration` / `out_duration` | 0.3 / 0.2 | 0.15–0.4 / 0.1–0.3 (quy ước) | giây | low |
| `rotate` | 0 (cute −2) | −30–30 (validate) | độ | low |
| `shadow_type` | `none` (brand `soft`, blur 14) | `none`, `soft`, `hard`, `offset3d` | – | low |

`box_radius` không có tác dụng với pill (code đặt `borderRadius: 9999`). `box_shadow` có trong khối nền nhưng không preset pill nào dùng.

## 5. Quy trình thực hiện
1. Rút nhãn từ lời thoại hoặc metadata: 1–5 từ, giữ nguyên chính tả và dấu. Tên người chỉ dùng khi có nguồn xác nhận.
2. Kiểm tra mục 3 và `R-PILL-*`; nếu cần chức danh, chuyển sang `lower_third`.
3. Chọn preset theo style (mục 6). Giữ một preset pill cho cả video.
4. Đặt `position` ở góc không có mặt, logo hay chữ trên hình; mặc định `top_left`, đổi `top_right` nếu góc trái bận.
5. Tính `hold = max(1.0, 0.8 + 0.3 × số_từ)`; `duration = in_duration + hold + out_duration`.
6. Chạy `validate`, rồi xem preview (độ dài nhãn so với khung, tương phản với nền).

## 6. Biến thể và preset
Bốn preset đã xem trên preview 960×540 của clip thử (một khung giữa lúc chữ hiện đủ): con nhộng hiển thị đúng ở cả bốn.
| Preset | Mô tả | Documentary |
|---|---|---|
| `text_pill_clean` | Nền tối `rgba(15,18,30,0.78)`, chữ trắng, `fade_up` | Được phép, ở mức tiết chế |
| `text_pill_outline` | Chỉ viền 3 px, nền `rgba(0,0,0,0.15)` (gần trong suốt, không hoàn toàn), `fade` | Được phép, ở mức tiết chế |
| `text_pill_brand` | Đỏ `#B91C2C`, chữ trắng đậm, `pop`, bóng mềm | **Cấm** (`forbidden_styles: [documentary]`) |
| `text_pill_cute` | Hồng nhạt `#FFE1EC`, chữ `#B0305F` Baloo 2, nghiêng −2°, `pop` | **Cấm** |

`outline` cần nền hình tối hoặc đơn giản: nền chỉ tối nhẹ nên chữ có thể chìm trên cảnh sáng.

## 7. Quy tắc quyết định
- `R-PILL-1` (validate): `text` ≤ 5 từ và đúng 1 dòng; `hold` ≥ `max(1.0, 0.8 + 0.3 × số_từ)`; enum hợp lệ; phông phải có trong registry.
- `R-PILL-2`: NẾU style `documentary` THÌ chỉ `text_pill_clean` hoặc `text_pill_outline`; hai preset còn lại bị validate từ chối.
- `R-PILL-3`: NẾU cùng khung có `lower_third`, `kinetic_text` hoặc khối chữ khác THÌ dời pill hoặc bỏ (một cấp nhấn mỗi khung).
- `R-PILL-4`: NẾU nhãn cần tên + chức danh THÌ dùng `lower_third`; NẾU cần nhấn ý theo lời nói THÌ dùng `kinetic_text`.
- `R-TXT-3`: không che mặt, nằm trong vùng an toàn (`core/composition.md`); `R-FREQ-2`: không vượt ngân sách.
- Ưu tiên lớp: Clarity (đọc được) > Style (đúng preset theo style) > Decoration (viền, nghiêng, nảy).

## 8. Ví dụ
Đoạn giới thiệu chương trình trong clip `c03`; muốn nhãn chủ đề ở góc trên suốt đoạn nói về nội dung đào tạo. Style documentary nên dùng `text_pill_clean`. Hold: 4 từ → ≥ 0.8 + 1.2 = 2.0.

```json
{
  "id": "d11",
  "technique": "text_pill",
  "preset": "text_pill_clean",
  "anchor": { "clip": "c03", "source_time": 4.0 },
  "start_offset": 0.0,
  "duration": 3.5,
  "parameters": { "text": "Nội dung đào tạo", "hold": 3.0 },
  "reason": "Gắn nhãn chủ đề của đoạn nói; nhãn ngắn, một dòng, không cần chức danh",
  "priority": "clarity",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```
`duration` 3.5 = 0.3 (`in_duration`) + 3.0 (`hold`) + 0.2 (`out_duration`). Nội dung chữ là minh họa, không phải dữ liệu thật của footage.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Nhãn quá dài | > 5 từ, hộp rộng gần hết khung | Rút còn từ khóa (`R-PILL-1`) |
| Dùng pill thay lower third | Tên + chức danh nhồi một dòng | Dùng `lower_third` |
| Preset lòe loẹt ở documentary | `brand`/`cute`; validate báo lỗi | `clean` hoặc `outline` |
| Chữ chìm trên nền sáng | `outline` trên cảnh sáng, khó đọc | Đổi sang `clean` |
| Chồng lên khối chữ khác | Hai khối cùng lúc | `R-PILL-3` |
| Hiện nhanh hơn thời gian đọc | `hold` sát ngưỡng, nhãn lạ | Tăng `hold` hoặc rút nhãn |

## 10. Kiểm tra sau render
- Nhãn đọc trọn ở tốc độ bình thường; dấu tiếng Việt đủ.
- Hộp bo tròn đúng, đệm đều; chữ không tràn hộp (phông không đúng dễ gây lệch).
- Không che mặt, không chạm mép (lề ≥ 5%); không đè logo hay chữ trên hình.
- Cần xem preview: hoạt ảnh vào/ra từng kiểu (`pop`, `fade_up`), cảnh có người ở góc, độ phân giải 1080p/4K.
