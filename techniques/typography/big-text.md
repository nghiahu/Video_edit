---
id: big_text
name: Big Text (Chữ cực lớn khớp khung)
group: typography
roles: [emphasis, rhythm]
status: usable
source_of_values: convention
---

# Big Text

## 1. Mục đích
Một từ hoặc cụm cực ngắn (tối đa 3 từ) phóng to đến hết bề ngang khung bằng `fit_width`, như áp phích hoặc tiêu đề mở cảnh. Mạnh nhất trong họ chữ: dùng rất hiếm.

## 2. Khi nên dùng
- Mốc đổi nhịp: mở/kết đoạn, từ khóa cảm xúc, con số chủ đạo (1–3 từ).
- Video social, quảng bá, nhịp nhanh, có b-roll hoặc nền sạch phía sau.
- Cần "một cú đập" chữ mà không dùng chuyển cảnh.

## 3. Khi không nên dùng
- Style documentary: cả ba preset nằm trong `forbidden_styles` (validate báo lỗi); thay bằng `kinetic_text_editorial` hoặc `title_card_editorial` (`R-BIG-2`).
- Nền có **mặt người** hoặc chủ thể quan trọng ở giữa khung: chữ chiếm gần hết khung và che (`R-TXT-3`).
- Hơn 3 từ hoặc hơn 2 dòng (validate báo lỗi).
- Khi chữ phải nằm lâu: chữ che toàn cảnh làm người xem mất hình; giữ ngắn (`R-BIG-3`).
- Khi đã có chữ nhấn khác trong khung (một cấp nhấn mỗi khung).
- Lặp lại nhiều lần: mất tác dụng.

## 4. Thông số
Khối nền `_text_style_base`; giá trị của `big_text_solid` trừ khi ghi khác.

| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `text` hoặc `lines` | – | 1–3 từ, tối đa 2 dòng | – | medium |
| `hold` (nội dung) | `0.8 + 0.3 × số_từ`, ≥ 1.0 | ≥ công thức; nên ≤ 3.0 | giây | low |
| `fit_width` | 0.9 (gradient 0.88) | 0.3–1, hoặc 0 để tắt (validate) | tỉ lệ bề ngang khung | medium |
| `max_font_size` | 520 (gradient 420) | cỡ trần tính cho 1080p | px @1080p | low |
| `font_size` | 72 (chỉ dùng khi `fit_width` = 0) | 12–600 (validate) | px @1080p | low |
| `font_family` | Anton (gradient: Inter, weight 900) | phông có vai trò `emphasis`/`heading`/`accent` | – | medium |
| `text_transform` | `uppercase` (gradient `none`) | `none`, `uppercase`, `lowercase` | – | low |
| `line_height` | 0.95 (gradient 1.1 từ nền) | – | hệ số | low |
| `hollow` / `stroke_width` / `stroke_color` | `false` / 0 / `#000000` (outline: `true` / 7 / `#FFFFFF`) | stroke 0–24 (validate) | px @1080p | low |
| `gradient_from` / `gradient_to` / `gradient_angle` | `null` (gradient: `#FF6B6B` / `#FFD93D` / 90) | CSS color, độ | – | low |
| `shadow_type` | `hard` (x, y = 8; outline `none`; gradient `soft`, blur 24) | `none`, `soft`, `hard`, `offset3d` | – | low |
| `position` | `center` | `BLOCK_ENUMS.position` | – | medium |
| `in_animation` | `pop` (outline `mask_wipe`, gradient `scale_fade`) | `BLOCK_ENUMS.in_animation` | – | low |
| `in_duration` / `out_duration` | 0.35 / 0.2 (outline 0.45 / 0.2; gradient 0.4 / 0.2 từ nền) | – | giây | low |

**Cách `fit_width` hoạt động (giới hạn thật):** khi `fit_width` > 0, renderer chờ phông nạp xong, đo **dòng dài nhất tính theo số ký tự** bằng canvas ở cỡ 100 px (cộng `letter_spacing`), rồi tính cỡ sao cho độ rộng đó bằng `fit_width × chiều rộng video`, và cắt bởi `max_font_size × k` (k = chiều cao / 1080). Hệ quả: `font_size` bị bỏ qua; chữ ngắn (một từ) sẽ bị trần `max_font_size` chặn, nên không chạm 90% bề ngang; dòng dài nhất tính theo ký tự có thể không phải dòng rộng nhất; `validate` không kiểm tra `max_font_size`, và khi `fit_width` > 0 bỏ qua cảnh báo cỡ chữ tối thiểu. Viền chữ dùng `-webkit-text-stroke`; chữ rỗng (`hollow`) là màu chữ trong suốt với viền; gradient là `background-clip: text`, bóng của gradient là `drop-shadow`.

## 5. Quy trình thực hiện
1. Kiểm tra style: documentary thì không dùng.
2. Chọn 1–3 từ; chữ hoa ở preset Anton, kiểm tra dấu tiếng Việt (phông Anton có subset tiếng Việt theo registry, cần xem preview).
3. Kiểm tra phía sau không có mặt người ở giữa; nếu có thì không dùng hoặc đổi `position`.
4. Chọn preset: `solid` (rõ nhất), `outline` (nhẹ hơn, nền cần tối), `gradient` (màu rực).
5. Chọn `hold` ngắn, đủ công thức (ví dụ 2 từ ≥ 1.4 s), tránh quá 3 s.
6. `duration = in_duration + hold + out_duration`; chạy `validate`, xem preview.

## 6. Biến thể và preset
Đã xem trên preview 960×540 của clip thử (khung giữa lúc chữ hiện đủ).
| Preset | Mô tả đã xem | Documentary |
|---|---|---|
| `big_text_solid` | Chữ hoa Anton khớp bề ngang khung (đo bằng canvas), bóng cứng | **Cấm** |
| `big_text_outline` | Chữ rỗng chỉ có viền; trước đây bị cắt mép phải khi quét mặt nạ, **đã sửa** | **Cấm** |
| `big_text_gradient` | Gradient cam-vàng, bóng mềm | **Cấm** |

Không preset nào dùng được ở documentary. Cần xem preview: chữ rỗng trên nền sáng, hoạt ảnh `pop`/`scale_fade`/`mask_wipe`.

## 7. Quy tắc quyết định
- `R-BIG-1` (validate): ≤ 3 từ, ≤ 2 dòng, `hold` ≥ `max(1.0, 0.8 + 0.3 × số_từ)`, `fit_width` trong 0.3–1 (hoặc 0), enum hợp lệ, phông có vai trò `emphasis`/`heading`/`accent` trong registry.
- `R-BIG-2`: NẾU style `documentary` THÌ không dùng; thay bằng `kinetic_text_editorial` hoặc `title_card_editorial`.
- `R-BIG-3`: giữ chữ ngắn: `hold` nên không quá ~3 giây (quy ước, chưa kiểm tra bởi validate).
- `R-BIG-4`: NẾU phía sau có mặt người ở giữa khung THÌ không dùng, hoặc đặt `position` khác (`R-TXT-3`).
- Một cấp nhấn mỗi khung; `R-FREQ-2`, không vượt ngân sách. Ưu tiên lớp: Clarity > Style > Decoration.

## 8. Ví dụ
Video quảng bá khóa học (style không phải documentary), mở cảnh `c05` bằng nền sạch: "Khai giảng". 1 từ, hold ≥ 1.1 nhưng không dưới 1.0; chọn 1.6.

```json
{
  "id": "d14",
  "technique": "big_text",
  "preset": "big_text_solid",
  "anchor": { "clip": "c05", "source_time": 0.5 },
  "start_offset": 0.0,
  "duration": 2.15,
  "parameters": { "text": "Khai giảng", "hold": 1.6 },
  "reason": "Mở cảnh bằng một từ khóa lớn trên nền sạch, không có mặt người ở giữa",
  "priority": "style",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```
`duration` 2.15 = 0.35 (`in_duration`) + 1.6 + 0.2. Nội dung chữ là minh họa. Ở documentary, ví dụ này bị `validate` từ chối.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Che mặt hoặc cả cảnh | Chữ phủ phần giữa khung có người | `R-BIG-4`, đổi `position` hoặc bỏ |
| Chữ nằm quá lâu | `hold` > 3 s, người xem mất hình | Giữ ngắn (`R-BIG-3`) |
| Quá 3 từ | Validate báo lỗi | Rút còn từ khóa |
| Chọn phông mảnh/nhỏ | `fit_width` phóng to nét mảnh mất nét | Dùng Anton/Inter đậm |
| Chữ rỗng chìm trên nền sáng | Viền trắng trên cảnh sáng | Dùng `solid` hoặc nền tối |
| Dùng ở documentary | Validate báo cấm | `kinetic_text_editorial` |

## 10. Kiểm tra sau render
- Chữ khớp bề ngang như kỳ vọng, không tràn mép, không cắt cạnh khi `mask_wipe`.
- Dấu tiếng Việt hiển thị đủ ở cỡ lớn (cần xem preview).
- Không che mặt hay chủ thể; nền phía sau đọc được cảnh.
- Chữ hiện đủ lâu để đọc nhưng không giữ quá dài.
- Cần xem preview: 1080p/4K, hoạt ảnh vào/ra từng kiểu, thời gian render.
