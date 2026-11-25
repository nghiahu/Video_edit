---
id: countdown_timer
name: Countdown Timer (Đếm ngược)
group: typography
roles: [rhythm, emphasis]
status: usable
source_of_values: convention
---

# Countdown Timer

## 1. Mục đích
Đếm ngược từng bước (3, 2, 1, 0 hoặc mm:ss) để **tạo háo hức trước một khoảnh khắc** (mở màn, công bố, bắt đầu hoạt động) hoặc báo thời gian còn lại. Số đập nhẹ mỗi bước. Thuộc cấp 1 khi dùng số lớn (`countdown_big`), cấp 2 khi là đồng hồ góc khung (`countdown_clock`).

## 2. Khi nên dùng
- Ngay trước một **khoảnh khắc đã biết** trong footage (xuất phát, công bố kết quả, cắt sang cảnh chính) và nhịp dựng cần dồn (`R-CNT-1`).
- Giới thiệu hoạt động có giới hạn thời gian (đồng hồ góc khung).
- Mở video nhịp nhanh, phong cách sự kiện/giải trí.

| Tình huống | Chọn |
|---|---|
| Số lớn 3-2-1, hết thì hiện "GO!" | `countdown_timer` + `countdown_big` |
| Đồng hồ mm:ss ở góc | `countdown_timer` + `countdown_clock` |
| Số liệu tăng dần | `big_number` |
| Tiến độ đầy dần | `progress_bar` |

## 3. Khi không nên dùng
- **Documentary**: cả hai preset đều `forbidden_styles: [documentary]` (số khổng lồ, nhịp đập, glow), validate báo lỗi.
- Không có khoảnh khắc nào để đếm tới, hoặc khoảnh khắc không rơi đúng lúc về 0: đếm ngược thành chi tiết thừa.
- Đếm quá dài: `countdown_from` > 30 (số) hoặc > 3600 (đồng hồ) bị chặn; thực tế > 5–10 bước làm người xem chán.
- Cần tiếng bíp: renderer **không phát âm thanh**, phải thêm SFX riêng.
- Đang có khối chữ cấp 1 khác trong khung.

## 4. Thông số
Giá trị là của khối nền; ngoặc là `big` / `clock`. Cỡ tính cho 1080p.
| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `countdown_from` | `null`; preset 5 / 10 | số nguyên 1–30; `clock`: 1–3600 (validate) | bước | medium |
| `countdown_step` | 1 | 0.25–2 (validate); `clock` nên = 1 (cảnh báo) | giây/bước | medium |
| `countdown_delay` | 0.2 | không kiểm tra | giây | low |
| `countdown_format` | `number` | `number`, `clock` (enum) | – | medium |
| `countdown_end_text` | `""` | chuỗi; không đo, không tính từ | – | low |
| `countdown_pop` | 0.2 (0.22 / 0.06) | 0–0.5 (validate) | độ phóng thêm (tỉ lệ) | low |
| `font_family` / `font_weight` | Anton 400 / Chakra Petch 700 | vai trò `emphasis`/`heading`/`accent` | – | low |
| `font_size` | 420 / 200 (nền 72) | 12–600 (validate) | px @1080p | low |
| `gradient_from` → `to` | `#FFE27A` → `#FF7A3D` (clock: không) | màu CSS | – | low |
| `position` | `center` / `top_right` (`margin` 5) | 9 vị trí | – | low |
| `box_style` | `none` / `rounded` (nền `rgba(8,12,20,0.82)`, đệm 40×14, glow cyan) | enum | – | low |
| `in_animation` / `out_animation` | `none` (0.1) / `fade` (0.2); out `fade` 0.3 | `none`/`fade` ở documentary | – | low |
| `hold` (nội dung) | xem công thức dưới | ≥ công thức | giây | medium |
Số hiện lúc `t` là `from − floor((t − countdown_delay)/step)`, tối thiểu 0; trước hết `delay` vẫn là số `from`. Về 0: hiện `countdown_end_text` (nếu có), nhịp đập nhân 1.5; không có thì hiện `0` hoặc `00:00`. Nhịp đập: phóng `1 + pop` rồi giảm trong 0.3 s đầu mỗi bước (bước < 0.3 s thì bị cắt ngắn). `clock` hiện `mm:ss`, giá trị > 59 s sang phút (chưa xem).

## 5. Quy trình thực hiện
1. Xác định khoảnh khắc đích và bước đếm (thường `from` 3–5, `step` 1).
2. Chọn preset (mục 6); chọn `countdown_end_text` ngắn nếu muốn (≤ 2 từ; "GO!").
3. `hold ≥ countdown_delay + from × step + 0.5 − in_duration` (lỗi nếu thiếu; công thức hold theo số từ **không áp dụng**).
4. Đặt `duration = in_duration + hold + out_duration`; canh để số 0 rơi đúng khoảnh khắc đích (`anchor.source_time + start_offset + delay + from × step`).
5. Chạy `validate`, xem preview.

## 6. Biến thể và preset
Đã xem trên preview 960×540 của clip thử.
| Preset | Mô tả | Documentary |
|---|---|---|
| `countdown_big` | Số Anton cỡ 420 gradient vàng-cam giữa khung | **Cấm** |
| `countdown_clock` | `mm:ss` Chakra Petch trong hộp tối, góc trên phải | **Cấm** |
Đã xem: `countdown_big` 3, 2, 1 rồi "GO!"; `countdown_clock` "00:04", "00:02", "00:01".

## 7. Quy tắc quyết định
- `R-CNT-1` (validate): `countdown_from` nguyên ∈ [1, 30] (`clock`: [1, 3600]); `countdown_step` ∈ [0.25, 2]; `countdown_pop` ∈ [0, 0.5]; `in_duration + hold ≥ delay + from × step + 0.5` (lỗi); `countdown_format` ∈ `number|clock`.
- `R-CNT-2`: NẾU style `documentary` THÌ không dùng (cả hai preset bị cấm).
- `R-CNT-3` (cảnh báo): `clock` với `countdown_step` ≠ 1.
- `R-CNT-4`: NẾU có `countdown_end_text` dài hơn số bắt đầu và `fit_width` > 0 THÌ tránh (chữ cuối không được đo, có thể tràn).
- `R-CNT-5`: không đặt đếm ngược khi không có khoảnh khắc đích; không lặp trong cùng video.
- Ưu tiên lớp: Storytelling (số 0 trùng khoảnh khắc) > Rhythm > Style > Decoration.

## 8. Ví dụ
Clip `c03`, style event_recap: đếm 3-2-1 trước khi cảnh chính bắt đầu. `hold ≥ 0.2 + 3 + 0.5 − 0.1 = 3.6`.
```json
{
  "id": "d03",
  "technique": "countdown_timer",
  "preset": "countdown_big",
  "anchor": { "clip": "c03", "source_time": 18.5 },
  "start_offset": 0.0,
  "duration": 4.0,
  "parameters": { "countdown_from": 3, "countdown_end_text": "GO!", "hold": 3.6 },
  "reason": "Dồn nhịp trước khoảnh khắc xuất phát, số 0 trùng điểm cắt sang cảnh chính",
  "priority": "rhythm",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```
`duration` 4.0 = 0.1 + 3.6 + 0.3. Đồng hồ 10 giây: `countdown_clock`, `hold` ≥ 0.2 + 10 + 0.5 − 0.2 = 10.5.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Hold thiếu | Validate báo lỗi "cần hold ≥ …" | Tính theo công thức |
| Đếm ở documentary | Preset bị cấm | Dùng `progress_bar_thin` hoặc bỏ |
| Số 0 lệch khoảnh khắc | Xem preview: GO! trước/sau cảnh chính | Chỉnh `start_offset` hoặc `countdown_delay` |
| Kỳ vọng có tiếng bíp | Không có âm thanh | Thêm SFX ngoài kỹ thuật này |
| `countdown_step` quá nhỏ | < 0.3 s: nhịp đập bị cắt, khó đọc | Giữ step ≥ 0.5 |
| `end_text` dài | Tràn khung khi `fit_width` | Giữ ≤ 2 từ |

## 10. Kiểm tra sau render
- Số đổi đúng nhịp mỗi `countdown_step`; về 0 hiện "GO!" (hoặc 0) và giữ ≥ 0.5 s.
- Nhịp đập mượt, số không tràn khung (420 px ở 1080p); hộp đồng hồ nằm trong vùng an toàn.
- Cần xem preview (chưa kiểm chứng): hoạt ảnh vào/ra; `countdown_format: clock` với giá trị > 59 s; phối hợp với âm thanh; 1080p/4K.
