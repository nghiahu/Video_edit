---
id: scramble_text
name: Scramble Text (Chữ giải mã)
group: typography
roles: [emphasis, rhythm]
status: usable
source_of_values: convention
---

# Scramble Text

## 1. Mục đích
Chữ xuất hiện dưới dạng **ký tự ngẫu nhiên nhảy liên tục rồi chốt đúng từng ký tự từ trái sang phải**, tạo cảm giác "giải mã" cho tiêu đề công nghệ, dữ liệu, bí mật được tiết lộ. Là chữ nhấn (cấp 1 trong `typography/hierarchy.md`): một khung chỉ một khối.

## 2. Khi nên dùng
- Tiêu đề hoặc cụm nhấn **1–2 dòng, tối đa 6 từ** về công nghệ, dữ liệu, mật mã, "tiết lộ" (`R-SCR-1`).
- Mở đầu một phần có chất công nghệ, game, an ninh mạng; muốn có chuyển động nhưng chữ cuối vẫn là chữ sạch.
- Cần chữ cuối rõ ràng: sau khi giải mã xong chữ đứng yên, không nhiễu tiếp.

**Chọn đúng kỹ thuật:**
| Tình huống | Chọn |
|---|---|
| Ký tự nhảy rồi chốt, chữ cuối sạch | `scramble_text` |
| Chữ nhiễu lặp suốt thời gian hiện | `glitch_text` |
| Chữ gõ dần từng ký tự | `typewriter_text` |
| Chữ nhấn tĩnh, không chuyển động | `big_text` |

## 3. Khi không nên dùng
- Style documentary, trang trọng, cảm xúc: cả hai preset đều có `forbidden_styles: [documentary]` (`R-SCR-2`).
- Hơn 6 từ hoặc hơn 2 dòng (validate báo lỗi).
- Nội dung nghiêm túc hoặc nhạy cảm (tên người, số liệu phải đọc chính xác ngay): ký tự nhảy làm nội dung bị "che" trong lúc giải mã.
- Giải mã xong sát lúc chữ biến mất (validate cảnh báo, `R-SCR-3`).
- Cùng khung có chữ nhấn khác (một cấp nhấn mỗi khung).

## 4. Thông số
Khối nền `_text_style_base`; giá trị theo preset (decode / bold). Cỡ chữ tính cho 1080p.
| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `scramble` | `true` (nền `false`) | bắt buộc `true` (validate) | – | medium |
| `scramble_duration` | 0.9 / 1 | 0.2–3 (validate) | giây | low |
| `scramble_delay` | 0.1 | không kiểm tra | giây | low |
| `scramble_rate` | 24 | không kiểm tra; hợp lý ≤ fps | lần đổi ký tự/giây | low |
| `scramble_chars` | `ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@` (bold: `#%&@*+=0123456789`) | chuỗi ký tự bất kỳ | – | low |
| `font_family` / `font_weight` | Chakra Petch 700 / Anton 400 | phông có vai trò `emphasis`/`heading`/`accent` | – | low |
| `font_size` | 96 / 150 | 12–600 (validate) | px @1080p | low |
| `text_transform` | `uppercase` | `none`/`uppercase`/`lowercase` | – | low |
| `line_height` / `line_gap` | 1.25 / 14 (bold: 1.25 / 18) | `line_gap` ≥ 0.12 × cỡ dòng khi HOA có dấu nhiều dòng (cảnh báo) | – / px | low |
| `text_color` | `#E6FBFF` (bold: `#FFFFFF`) | màu CSS | – | low |
| `glow_color` / `glow_size` | `rgba(0,229,255,0.7)` / 14 (bold: không) | `glow_size` 0–80 | – / px | low |
| `shadow_type` | `none` (bold: `hard`, 6/6) | enum | – | low |
| `position` | `center` | 9 vị trí | – | low |
| `hold` (nội dung) | `0.8 + 0.3 × số_từ`, ≥ 1.0 | ≥ công thức | giây | medium |
| `in_animation` / `out_animation` | `none` / `fade` (`in_duration` 0.1, `out_duration` 0.25) | enum | – | low |
Ký tự thứ `i` (trong tổng `n`, tính cả dấu cách) chốt lúc `scramble_delay + i/(n−1) × scramble_duration`; dấu cách luôn hiện sẵn. Ký tự ngẫu nhiên chọn từ `scramble_chars`, đổi theo `scramble_rate`; ký tự đã chốt lấy từ chữ gốc (đã chuẩn hóa NFC).

## 5. Quy trình thực hiện
1. Rút cụm chữ 1–6 từ, giữ dấu tiếng Việt; kiểm tra mục 3.
2. Chọn preset (mục 6) và `scramble_duration`; chữ ngắn thì 0.6–1.0 s.
3. Đặt `hold ≥ max(1.0, 0.8 + 0.3 × số_từ, scramble_delay + scramble_duration + 0.6 − in_duration)`.
4. Đặt `duration = in_duration + hold + out_duration`.
5. Chạy `validate`; xem preview: giữa chừng ký tự nhảy, cuối cùng đúng chữ.

## 6. Biến thể và preset
Hai preset đã xem trên preview 960×540 của clip thử (khung tĩnh nhiều thời điểm): ký tự ngẫu nhiên nhảy rồi chốt lần lượt từ trái sang phải (thấy "DỮ ƫUE" giữa chừng), kết quả đúng chữ.
| Preset | Mô tả | Documentary |
|---|---|---|
| `scramble_decode` | Chakra Petch HOA 96 px, ánh sáng xanh lam | **Cấm** |
| `scramble_bold` | Anton HOA 150 px, bóng cứng, ký tự nhảy là ký hiệu và số | **Cấm** |
Chưa có preset dùng được ở documentary; nếu style đòi hỏi, dùng `big_text` hoặc `title_card`.

## 7. Quy tắc quyết định
- `R-SCR-1` (validate): `scramble: true`; ≤ 6 từ, ≤ 2 dòng; `scramble_duration` ∈ [0.2, 3]; `hold` ≥ `max(1.0, 0.8 + 0.3 × số_từ)`; phông có vai trò `emphasis`/`heading`/`accent`; enum hợp lệ.
- `R-SCR-2`: NẾU style `documentary` THÌ không dùng kỹ thuật này (mọi preset bị validate từ chối).
- `R-SCR-3` (cảnh báo): `scramble_delay + scramble_duration + 0.6 > in_duration + hold` thì tăng `hold` hoặc giảm `scramble_duration`; người xem cần ≥ 0.6 s đọc chữ đã chốt.
- `R-SCR-4`: NẾU nội dung cần đọc chính xác ngay (tên, số) THÌ dùng chữ tĩnh thay vì giải mã.
- Ưu tiên lớp: Clarity (chữ cuối đọc được, đủ thời gian đọc) > Style (đúng chất công nghệ) > Decoration (glow, ký tự lạ).

## 8. Ví dụ
Mở phần về dữ liệu trong clip `c04`, style không phải documentary (hiện thư mục `styles/` chỉ có `documentary`, nên ví dụ này chỉ minh họa quyết định, chưa chạy trọn bộ `validate` với `strategy.style`). 4 từ nên `hold` ≥ 2.0; giải mã xong lúc 1.0 s, cộng 0.6 = 1.6 ≤ 0.1 + 2.0.
```json
{
  "id": "d07",
  "technique": "scramble_text",
  "preset": "scramble_decode",
  "anchor": { "clip": "c04", "source_time": 6.0 },
  "start_offset": 0.0,
  "duration": 2.35,
  "parameters": { "text": "Dữ liệu là gì", "hold": 2.0 },
  "reason": "Mở phần giải thích dữ liệu bằng tiêu đề giải mã, hợp chất công nghệ của cảnh",
  "priority": "style",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```
`duration` 2.35 = 0.1 + 2.0 + 0.25. Nội dung chữ là minh họa.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Giải mã quá chậm | `scramble_duration` ≥ 2 cho chữ ngắn, chữ lâu mới đọc được | 0.6–1.2 s cho 1–4 từ |
| Chữ cuối hiện quá ngắn | Cảnh báo "giải mã xong lúc …" | Tăng `hold` |
| Dùng ở documentary | Validate báo lỗi `forbidden_styles` | Dùng `big_text`/`title_card` |
| Ký tự lạ lẫn vào chữ Việt | Ký hiệu chiếm hết chỗ trong `scramble_chars` | Chọn bộ ký tự phù hợp (bold dùng ký hiệu và số) |
| Nhiều dòng HOA có dấu dính | Dấu chạm dòng trên | `line_gap` ≥ 0.12 × cỡ dòng (cảnh báo) |
| Quên `scramble: true` | Chữ hiện thẳng; validate báo lỗi | Dùng preset |

## 10. Kiểm tra sau render
- Giữa chừng ký tự nhảy; chốt từ trái sang phải; chữ cuối đúng chính tả, đủ dấu.
- Dấu cách giữ nguyên, bố cục không nhảy khi ký tự chốt.
- Còn ≥ 0.6 s đọc chữ cuối; chữ không che mặt.
- Cần xem preview (chưa kiểm chứng): hoạt ảnh vào/ra; ký tự nhảy với chữ tiếng Việt dài hoặc hai dòng; 1080p/4K.
