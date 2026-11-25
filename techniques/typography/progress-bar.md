---
id: progress_bar
name: Progress Bar (Thanh tiến độ)
group: typography
roles: [information, rhythm]
status: usable
source_of_values: convention
---

# Progress Bar

## 1. Mục đích
Cho người xem thấy **một đại lượng đang đầy dần đến một mức biết trước** (tiến độ khóa học, mức hoàn thành, tỉ lệ đạt) bằng thanh nằm ngang kèm nhãn và phần trăm. Thuộc cấp 2 (thông tin) trong `typography/hierarchy.md`; bản `progress_bar_pill` to, giữa khung, gần cấp 1.

## 2. Khi nên dùng
- Có **mức phần trăm hoặc tỉ lệ có nguồn** (lời người nói, tài liệu, số liệu chương trình) và muốn thể hiện nó như quá trình, không chỉ một con số (`R-PROG-1`).
- Nhãn ngắn (≤ 6 từ, một dòng) gọi tên đại lượng: "Hoàn thành khóa học".
- Điểm nghỉ của nhịp dựng, trên b-roll rộng hoặc cảnh ít chuyển động.

| Tình huống | Chọn |
|---|---|
| Thanh đầy dần có nhãn + phần trăm | `progress_bar` |
| Một con số lớn đếm chạy, không cần thanh | `big_number` |
| So sánh nhiều tiêu chí | `comparison_table` |
| Đếm lùi thời gian | `countdown_timer` |

## 3. Khi không nên dùng
- **Không có nguồn** cho mức phần trăm; không làm tròn "cho đẹp". Thanh chỉ hiện số nguyên làm tròn, nên 72,4% hiện 72%.
- Muốn thể hiện **đang chờ, chưa biết bao lâu** (indeterminate): hiện thực không có chế độ này, thanh luôn chạy đến `progress_to`.
- Nhiều thanh cùng lúc (một khối một lần, một cấp nhấn mỗi khung).
- Nhãn quá 6 từ hoặc nhiều dòng (validate báo lỗi).
- Style documentary với `progress_bar_pill` (`forbidden_styles: [documentary]`, validate báo lỗi).

## 4. Thông số
Giá trị là của khối nền; ngoặc là `thin` / `pill`. Cỡ tính cho 1080p, nhân `height/1080`.
| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `text` (nội dung) | – (bắt buộc) | ≤ 6 từ, 1 dòng | – | medium |
| `progress_to` | `null`: **phải ghi trong quyết định** | 0–1 (validate) | tỉ lệ | medium |
| `progress_delay` | 0.2 | không kiểm tra | giây | low |
| `progress_duration` | 1.5 (1.6 / 1.8) | 0.3–6 (validate) | giây | low |
| `show_percent` | `true` | true/false | – | medium |
| `bar_width` | 0.5 (0.55 / 0.6) | 0.2–1 (validate) | tỉ lệ bề ngang khung | low |
| `bar_height` | 18 (10 / 36) | 4–80 (validate) | px @1080p | low |
| `bar_color`, `bar_color_to` | `#F2C14E`, `null` (pill: `#FFD84D` → `#FF7A3D`) | màu CSS; có `bar_color_to` thì gradient ngang | – | low |
| `bar_track_color` | `rgba(255,255,255,0.25)` (pill 0.28) | màu CSS | – | low |
| `bar_radius` | 999 | không kiểm tra | px @1080p | low |
| `label_gap` | 12 (thin 12, pill 18) | không kiểm tra | px @1080p | low |
| `font_size` | 72 nền; 40 / 56 | 12–600 (validate) | px @1080p | low |
| `font_family` / `font_weight` | Inter 600 / Inter 800 | Inter có vai trò `subtitle`/`body`/`emphasis` | – | low |
| `position` | `lower_middle` (thin, `margin_bottom` 10) / `center` | 9 vị trí | – | low |
| `hold` (nội dung) | xem công thức dưới | ≥ công thức | giây | medium |
Phần trăm = `round(progress_to × easeInOut)`, thanh chạy từ 0 đến `progress_to` trong `progress_duration` sau `progress_delay`. Nhãn nằm trái, phần trăm nằm phải (số cùng độ rộng chữ số), cả hai cùng cỡ chữ.

## 5. Quy trình thực hiện
1. Xác định mức (0–1) và nguồn; rút nhãn ≤ 6 từ; kiểm tra mục 3.
2. Chọn preset theo style (mục 6).
3. `hold ≥ max(1.0, 0.8 + 0.3 × số_từ_nhãn, progress_delay + progress_duration + 0.6 − in_duration)`.
4. Đặt `duration = in_duration + hold + out_duration` (renderer không dùng `duration` của quyết định).
5. Chạy `validate`, rồi xem preview: thanh đầy đúng mức, nhãn đọc rõ trên nền footage.

## 6. Biến thể và preset
Đã xem trên preview 960×540 của clip thử (`projects/demo-text-p5`), khung tĩnh nhiều thời điểm.
| Preset | Mô tả | Documentary |
|---|---|---|
| `progress_bar_thin` | Thanh mảnh dưới đáy, nhãn trái, phần trăm phải, bóng mềm | Được phép |
| `progress_bar_pill` | Thanh dày gradient vàng-cam giữa khung, chữ Inter 800 | **Cấm** |
Đã xem: thin đầy dần đến 72% (7% → 65% → 72%); pill đến 100% (7% → 81% → 100%).

## 7. Quy tắc quyết định
- `R-PROG-1` (validate): `progress_to` ∈ [0, 1]; `bar_width` ∈ [0.2, 1]; `bar_height` ∈ [4, 80]; `progress_duration` ∈ [0.3, 6]; nhãn ≤ 6 từ, 1 dòng; phông có vai trò hợp; `hold` ≥ `max(1.0, 0.8 + 0.3 × số_từ)` (lỗi).
- `R-PROG-2`: NẾU style `documentary` THÌ chỉ `progress_bar_thin`; `in_animation` chỉ `none|fade|fade_up|line_stagger`, `out_animation` chỉ `none|fade`.
- `R-PROG-3` (cảnh báo): `progress_duration + progress_delay + 0.6 > in_duration + hold` thì tăng `hold` hoặc giảm `progress_duration`.
- `R-PROG-4`: NẾU mức không có nguồn hoặc không biết trước THÌ bỏ kỹ thuật, dùng lời nói hoặc `kinetic_text`.
- `R-PROG-5`: một khối `progress_bar` mỗi khung, không chồng với khối cấp 1 khác.
- Ưu tiên lớp: Clarity (số đúng, đọc kịp) > Style > Decoration (gradient, bóng). `styles/documentary.md` chưa có dòng ngân sách; đề xuất ≤ 2 mỗi video 2 phút (low).

## 8. Ví dụ
Clip `c01`, style documentary: nêu mức hoàn thành 72% từ số liệu chương trình. Nhãn 3 từ; `hold ≥ max(1.7, 0.2 + 1.6 + 0.6 − 0.3 = 2.1)` = 2.1, chọn 3.2 (đã chạy trong clip thử).
```json
{
  "id": "d01",
  "technique": "progress_bar",
  "preset": "progress_bar_thin",
  "anchor": { "clip": "c01", "source_time": 8.1 },
  "start_offset": 0.0,
  "duration": 3.8,
  "parameters": { "text": "Tải dữ liệu", "progress_to": 0.72, "hold": 3.2 },
  "reason": "Thể hiện mức hoàn thành 72% như một quá trình, nhãn ngắn, không trùng lời nói",
  "priority": "clarity",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```
`duration` 3.8 = 0.3 (`in_duration`) + 3.2 + 0.3 (`out_duration`). Nhãn và mức là minh họa.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Quên `progress_to` | Preset yêu cầu ghi rõ (`requires`) và `validate` chặn khi thiếu hoặc không phải số; nếu lọt qua, thanh không hiện, chỉ chữ thường | Luôn ghi `progress_to` trong quyết định |
| Thanh đầy sát lúc biến mất | Cảnh báo "thanh đầy lúc …" | Tăng `hold` (≥ 0.6 s ở mức cuối) |
| Pill ở documentary | Validate báo lỗi preset bị cấm | `progress_bar_thin` |
| Dùng thay chỉ báo chờ | Thanh luôn đến mức cuối, không lặp | Bỏ kỹ thuật |
| Nhãn dài | > 6 từ, validate báo lỗi | Rút nhãn |
| Chữ phần trăm đè nền sáng | Khó đọc | Thêm `bg_mode: dim` hoặc đổi `position` |

## 10. Kiểm tra sau render
- Thanh đầy đúng mức; số phần trăm khớp `progress_to`; nhãn không bị cắt, nằm trong vùng an toàn.
- Còn ≥ 0.6 s ở mức cuối trước khi mờ ra.
- Cần xem preview (chưa kiểm chứng): hoạt ảnh vào/ra từng kiểu; thanh ở hai đầu khung (`bar_width` 1); nhãn dài hơn thanh; 1080p/4K.
