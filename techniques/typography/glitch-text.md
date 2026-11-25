---
id: glitch_text
name: Glitch Text (Chữ nhiễu)
group: typography
roles: [emphasis, rhythm]
status: usable
source_of_values: convention
---

# Glitch Text

## 1. Mục đích
Chữ bị **nhiễu từng đợt ngắn**: lệch kênh màu đỏ/lục lam, rung ngang, vài dải cắt lệch, xen kẽ khung sạch. Gợi cảm giác tín hiệu hỏng, công nghệ, căng thẳng. Là chữ nhấn (cấp 1 trong `typography/hierarchy.md`) và là kỹ thuật **rủi ro nhất** của nhóm chữ vì có thể gây khó chịu.

## 2. Khi nên dùng
- Tiêu đề hoặc cụm nhấn **1–2 dòng, tối đa 5 từ** ở video công nghệ, game, an ninh mạng, MV, teaser dồn dập (`R-GLT-1`).
- Mở đầu hoặc đoạn chuyển có chủ ý "lỗi hệ thống", thời gian hiện ngắn (2–3 s).
- Nền hình tối hoặc đơn giản, để lệch màu đỏ/lục lam đọc được.

**Chọn đúng kỹ thuật:**
| Tình huống | Chọn |
|---|---|
| Chữ nhiễu lặp suốt thời gian hiện | `glitch_text` |
| Chữ nhảy rồi chốt, kết quả sạch | `scramble_text` |
| Chữ nhấn tĩnh | `big_text` |

## 3. Khi không nên dùng
- Style documentary: glitch, RGB split nằm trong danh sách **Cấm** của `styles/documentary.md`; cả hai preset có `forbidden_styles: [documentary]` (`R-GLT-2`).
- Người xem nhạy ánh sáng hoặc nền tảng có quy định về nhấp nháy: nhiễu đổi trạng thái nhiều lần mỗi giây; **chưa đo** tần số nháy thực tế (`R-GLT-3`).
- Hơn 5 từ hoặc hơn 2 dòng; chữ nhỏ (nhiễu làm mất dấu tiếng Việt).
- Nội dung nghiêm túc, cảm xúc, tên người cần đọc rõ.
- Cùng khung có chữ nhấn khác; dùng nhiều lần liên tiếp.

## 4. Thông số
Khối nền `_text_style_base`; giá trị theo preset (cyber / bold). Cỡ chữ tính cho 1080p.
| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `glitch` | `true` (nền `false`) | bắt buộc `true` (validate) | – | medium |
| `glitch_rate` | 0.3 / 0.4 (nền 0.3) | 0–0.6 (validate, **lỗi** nếu vượt) | xác suất mỗi đợt | low |
| `glitch_split` | 8 / 12 (nền 8) | 0–24 (validate) | px @1080p | low |
| `glitch_jitter` | 10 / 16 (nền 10) | 0–40 (validate) | px @1080p | low |
| `glitch_slices` | 2 / 3 (nền 2) | số nguyên ≥ 0; không kiểm tra, hợp lý ≤ 4 | dải | low |
| `glitch_pattern` | `[[0.1,0.35],[0.5,0.75],[1.7,2.0]]` (cả hai preset) | đoạn `[bắt đầu, kết thúc]` giây, tăng dần, không chồng; `validate` chặn sai dạng và đoạn cuối quá hết khối, cảnh báo đoạn > 0.5 s | giây | low |
| `glitch_vanish` | true | boolean; cảnh báo nếu khối còn > 0.3 s sau đoạn cuối | – | low |
| `font_family` / `font_weight` | Chakra Petch 700 / Anton 400 | vai trò `emphasis`/`heading`/`accent` | – | low |
| `font_size` | 120 / 200 | 12–600 (validate) | px @1080p | low |
| `text_transform` | `uppercase` | enum | – | low |
| `line_height` / `line_gap` | 1.25 / 16 (bold: 1.25 / 24) | `line_gap` ≥ 0.12 × cỡ dòng khi HOA có dấu nhiều dòng (cảnh báo) | – / px | low |
| `shadow_type` | `none` (bold: `hard`, 6/6) | enum | – | low |
| `position` | `center` | 9 vị trí | – | low |
| `hold` (nội dung) | `0.8 + 0.3 × số_từ`, ≥ 1.0 | ≥ công thức | giây | medium |
| `in_animation` / `out_animation` | `none` / `none` (`in_duration` 0.1, `out_duration` 0.15) | enum | – | low |
Cơ chế (`TextBlock.jsx`): mỗi **2 frame** (`glTick = floor(frame / 2)`) bốc ngẫu nhiên xác định theo frame; nếu nhỏ hơn `glitch_rate` thì đợt nhiễu bật. Trong đợt: chữ lệch ngang ±`glitch_jitter`; bóng đỏ trái và lục lam phải lệch `glitch_split` × (0.5–1.5); `glitch_slices` dải cắt, mỗi dải là một bản sao chữ trượt ngang đến ±3 × `glitch_jitter`. Vì tính theo frame, **nhịp nhiễu phụ thuộc `project.fps`** (30 fps: 15 đợt xét/giây; 60 fps: 30).

## 5. Quy trình thực hiện
1. Xác nhận style cho phép và đối tượng xem; nếu không chắc, không dùng (mục 3).
2. Rút cụm chữ 1–5 từ, giữ dấu; chọn preset (mục 6).
3. Giữ `glitch_rate` ≤ 0.4 trừ khi có lý do; thời gian hiện ngắn nhất đủ đọc: `hold = max(1.0, 0.8 + 0.3 × số_từ)`.
4. Đặt `duration = in_duration + hold + out_duration`.
5. Chạy `validate`, xem preview, đặc biệt khung sạch xen kẽ để chữ đọc được.

## 6. Biến thể và preset
Hai preset đã xem trên preview 960×540 của clip thử (khung tĩnh nhiều thời điểm): từng đợt nhiễu ngắn, lệch kênh đỏ/lục lam, rung ngang, dải cắt lệch; có khung sạch xen kẽ (`glitch_rate` 0.3–0.4).
| Preset | Mô tả | Documentary |
|---|---|---|
| `glitch_cyber` | Chakra Petch HOA 120 px, nhiễu vừa | **Cấm** |
| `glitch_bold` | Anton HOA 200 px, nhiễu mạnh hơn, bóng cứng | **Cấm** |
Chưa có preset nào dùng được ở documentary.

## 7. Quy tắc quyết định
- `R-GLT-1` (validate): `glitch: true`; ≤ 5 từ, ≤ 2 dòng; `glitch_rate` ∈ [0, 0.6]; `glitch_jitter` ∈ [0, 40]; `glitch_split` ∈ [0, 24]; `hold` ≥ `max(1.0, 0.8 + 0.3 × số_từ)`; phông có vai trò `emphasis`/`heading`/`accent`; enum hợp lệ.
- `R-GLT-2`: NẾU style `documentary` THÌ không dùng.
- `R-GLT-3`: NẾU nội dung có khả năng đến người nhạy ánh sáng hoặc nền tảng giới hạn nhấp nháy THÌ không dùng; giữ `glitch_rate` ≤ 0.4 và thời gian hiện ≤ 3 s (low; ngưỡng 0.6 trong validate chỉ chặn quá dày, **không** chứng minh an toàn).
- `R-GLT-4`: NẾU `glitch_slices` > 4 THÌ giảm (mỗi dải dựng thêm một bản sao chữ, tốn render; không có kiểm tra).
- `R-GLT-5`: không dùng hai lần cách nhau gần; không cùng khung với chữ nhấn khác.
- Ưu tiên lớp: Clarity (chữ đọc được ở khung sạch) > Style > Decoration (độ nhiễu).

## 8. Ví dụ
Tiêu đề đoạn "mất tín hiệu" trong clip `c05`, style không phải documentary (hiện chỉ có `documentary` trong `styles/`, nên ví dụ chỉ minh họa quyết định). 4 từ nên `hold` ≥ 2.0.
```json
{
  "id": "d09",
  "technique": "glitch_text",
  "preset": "glitch_cyber",
  "anchor": { "clip": "c05", "source_time": 2.0 },
  "start_offset": 0.0,
  "duration": 2.25,
  "parameters": { "text": "Tín hiệu bị nhiễu", "hold": 2.0 },
  "reason": "Tiêu đề ngắn cho đoạn mất tín hiệu, khớp chất công nghệ của cảnh",
  "priority": "style",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```
`duration` 2.25 = 0.1 + 2.0 + 0.15. Nội dung chữ là minh họa.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Nhiễu quá dày | `glitch_rate` sát 0.6, chữ gần như không có khung sạch | ≤ 0.4 |
| Lệch quá lớn | `glitch_split` > 16, chữ xấu | Giữ 8–12 |
| Dùng ở documentary | Validate báo `forbidden_styles` | Dùng chữ tĩnh |
| Dùng cho chữ dài | > 5 từ; validate báo lỗi | Rút chữ |
| Nền sáng, chữ chìm | Bóng đỏ/lục lam khó thấy | Nền tối hoặc đổi kỹ thuật |
| Quên `glitch: true` | Chữ không nhiễu; validate báo lỗi | Dùng preset |

**Nhịp mặc định theo yêu cầu người dùng:** nháy hai lần, dừng (chữ sạch để đọc), nháy lần cuối rồi chữ biến mất (`glitch_pattern` + `glitch_vanish`; hold 1.8 s cho tổng 2.0 s). Khi có `glitch_pattern`, `glitch_rate` không dùng. Đã đo trên preview (độ bão hòa vùng chữ theo frame): ba đợt nháy đúng các đoạn 0.1–0.35, 0.5–0.75, 1.7–2.0 s, chữ sạch ở giữa, hết chữ lúc 2.0 s.

## 10. Kiểm tra sau render
- Đợt nhiễu ngắn, có khung sạch xen kẽ; chữ đọc trọn ở khung sạch, dấu tiếng Việt đủ.
- Lệch kênh đỏ/lục lam, rung ngang, dải cắt đúng độ lớn; không che mặt.
- Nhịp nhiễu ở fps thật của video (nhịp phụ thuộc fps).
- Cần xem preview (chưa kiểm chứng): hoạt ảnh vào/ra; an toàn nhấp nháy với người nhạy ánh sáng (đã chặn `glitch_rate` ≤ 0.6 nhưng **chưa đo** tần số nháy); 1080p/4K.
