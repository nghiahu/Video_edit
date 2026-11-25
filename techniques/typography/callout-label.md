---
id: callout_label
name: Callout Label (Nhãn chú thích có đường chỉ)
group: typography
roles: [identification, information, emphasis]
status: usable
source_of_values: convention
---

# Callout Label

## 1. Mục đích
Đặt một **nhãn ngắn** ở một chỗ trong khung và vẽ **đường chỉ** tới một điểm cụ thể của hình (một bộ phận máy, một chi tiết trên màn hình, một vật trên bàn), để người xem nhìn đúng chỗ đang được nói tới.

## 2. Khi nên dùng
- Có **điểm cần chỉ** xác định bằng toạ độ tỉ lệ khung hình: `target_x`, `target_y` (0–1).
- Chủ thể **đứng yên** trong suốt thời gian hiện, hoặc clip tĩnh (ảnh chụp màn hình, b-roll tĩnh, cảnh khóa máy).
- Nhãn ≤ 8 từ, ≤ 2 dòng (`R-CAL-1`); nội dung là tên bộ phận, số liệu ngắn có nguồn.

| Tình huống | Chọn |
|---|---|
| Nhãn chỉ vào điểm cố định trên hình | `callout_label` |
| Nhãn đặt cạnh, không cần chỉ điểm | `text_box`, `text_pill` |
| Nhãn **bám** vật chuyển động | `tracked_text` (đợt 5, **chưa làm**) |

## 3. Khi không nên dùng
- Điểm cần chỉ **chuyển động** hay camera di chuyển: callout là **cố định**, không theo dõi chuyển động, đường chỉ sẽ lệch khỏi vật (`R-CAL-2`). Chờ `tracked_text`.
- Không biết chính xác toạ độ điểm chỉ (không đoán).
- Đường chỉ hoặc nhãn che mặt, chủ thể, hoặc vùng người xem cần nhìn (`R-TXT-3`).
- Nhãn trong suốt hoặc nền quá nhạt (đường chỉ vẽ **phía sau** nhãn, sẽ xuyên qua chữ; validate cảnh báo).
- Nhãn dài hơn 8 từ hoặc quá 2 dòng.

## 4. Thông số
Khối nền `_text_style_base`; giá trị là của `callout_label_dot` trừ khi ghi khác. Cỡ chữ tính cho 1080p.

| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `text` (hoặc `lines`) | – | 1–8 từ, ≤ 2 dòng | – | medium |
| `hold` (nội dung) | `0.8 + 0.3 × số_từ`, ≥ 1.0 | ≥ công thức | giây | medium |
| `target_x` / `target_y` | 0.5 / 0.5 (khối nền `null`) | 0–1 (validate, lỗi nếu ngoài); **bắt buộc ghi rõ trong quyết định** (preset có `requires`) | tỉ lệ khung | medium |
| `label_x` / `label_y` | 0.27 / 0.2 (khối nền 0.3 / 0.25) | 0–1 (validate) | tỉ lệ khung | medium |
| `line_style` | `dot` (`arrow`, `ring` theo preset) | `line`, `arrow`, `dot`, `ring` (validate) | – | low |
| `line_color` / `line_width` | `#FFFFFF` / 3 (`arrow`, `ring`: `#F2C14E` / 4) | CSS color / 1–20 (validate) | px @1080p | low |
| `ring_radius` | 36 (`ring` preset: 40) | 8–200 (validate) | px @1080p | low |
| `line_delay` / `line_duration` | 0.15 / 0.45 | không kiểm tra | giây | low |
| `box_style` / `box_color` | `rounded` / `#111827` | CSS color; không để trong suốt | – | low |
| `box_radius` / `box_padding_x` / `box_padding_y` | 14 / 30 / 16 | 0–120 / 0–80 (validate padding) | px @1080p | low |
| `font_size` / `font_weight` | 44 / 600 | 12–600 | px @1080p | medium |
| `max_width_percent` | 36 | không kiểm tra | % khung | low |
| `in_animation` / `in_duration` | `fade` / 0.35 | enum | – / giây | low |

Hiện thực: nhãn đặt tâm tại (`label_x`, `label_y`) rồi dịch −50% (không dùng `position`, `margin`, `align`); đường thẳng nối **tâm nhãn** tới điểm chỉ, vẽ **trước** nhãn trong DOM nên nằm dưới nhãn (nhãn có nền đặc thì che phần đường bên trong). Đường vẽ dần bằng `stroke-dashoffset` trong `line_duration` sau `line_delay` (đổi giây ra frame theo `project.fps`); đầu mút (`arrow`, `dot` bán kính cố định 9, `ring`) chỉ hiện khi đường vẽ xong (> 98%). `line` không có đầu mút. Đường chỉ mờ dần theo vào/ra nhưng **không** theo `in_animation` của nhãn. Toạ độ không cập nhật theo thời gian.

## 5. Quy trình thực hiện
1. Xác nhận chủ thể đứng yên và đọc **toạ độ tỉ lệ** của điểm chỉ từ khung hình (hoặc người dùng chỉ).
2. Viết nhãn ≤ 8 từ, có nguồn; số liệu phải đúng.
3. Đặt `label_x`, `label_y` ở vùng trống, cách mặt và chủ thể; chọn hướng đường chỉ ngắn, không cắt qua vùng quan trọng.
4. Chọn preset (mục 6): `dot` ở documentary; `arrow`/`ring` ở style khác. Nhãn giữ nền đặc.
5. `hold = max(1.0, 0.8 + 0.3 × số_từ)` và đủ cho đường vẽ xong (`line_delay + line_duration`); `duration = in_duration + hold + out_duration`.
6. `validate`, rồi xem preview (đầu mút có đúng điểm không).

## 6. Biến thể và preset
Đã xem trên preview 960×540 của clip thử (khung giữa lúc chữ hiện đủ): nhãn tối, đường chỉ vẽ tới điểm chỉ; đầu mút chấm trắng, mũi tên vàng, vòng tròn vàng.
| Preset | Mô tả | Documentary |
|---|---|---|
| `callout_label_dot` | Đường trắng mảnh (3 px) kết thúc bằng chấm | **Được phép**, tiết chế (`forbidden_styles: []`) |
| `callout_label_arrow` | Đường vàng 4 px có mũi tên | **Cấm** |
| `callout_label_ring` | Đường vàng 4 px, vòng tròn bán kính 40 | **Cấm** |

Documentary cho `in_animation` `none|fade|fade_up|line_stagger`, ra `none|fade`; preset đều `fade`. `styles/documentary.md` chưa có dòng ngân sách: dùng tiết chế (như `text_box`).

## 7. Quy tắc quyết định
- `R-CAL-1` (validate): `text` ≤ 8 từ, ≤ 2 dòng; `target_x`, `target_y` trong [0, 1] (lỗi nếu thiếu trong `parameters` của quyết định hoặc ngoài khoảng); `label_x`, `label_y` trong [0, 1]; `line_style` thuộc `line|arrow|dot|ring`; `hold` ≥ công thức; cảnh báo nếu `box_color` trong suốt (alpha 0).
- `R-CAL-2`: NẾU chủ thể hoặc camera chuyển động THÌ không dùng callout (cố định); chờ `tracked_text`.
- `R-CAL-3`: NẾU style `documentary` THÌ chỉ `callout_label_dot`; hai preset kia bị validate từ chối.
- `R-CAL-4`: nhãn giữ nền đặc; đường chỉ và nhãn không che mặt, chủ thể (`R-TXT-3`).
- Một cấp nhấn mỗi khung; ưu tiên lớp: Clarity > Style > Decoration.

## 8. Ví dụ
Clip `c07` là ảnh chụp màn hình tĩnh; chỉ vào nút ở giữa-phải, style documentary nên dùng `callout_label_dot`. 4 từ → hold ≥ 2.0; đường vẽ xong lúc 0.6 s; chọn 2.5.
```json
{
  "id": "d40",
  "technique": "callout_label",
  "preset": "callout_label_dot",
  "anchor": { "clip": "c07", "source_time": 3.0 },
  "start_offset": 0.0,
  "duration": 3.05,
  "parameters": { "text": "Nút Tên minh họa", "target_x": 0.62, "target_y": 0.55, "label_x": 0.3, "label_y": 0.25, "hold": 2.5 },
  "reason": "Chỉ đúng nút đang được nói tới trên ảnh chụp màn hình tĩnh",
  "priority": "clarity",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```
`duration` 3.05 = 0.35 + 2.5 + 0.2. Toạ độ và nhãn là minh họa.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Chỉ vào vật chuyển động | Đường lệch khỏi vật giữa clip | `R-CAL-2` |
| Nhãn trong suốt | Đường xuyên qua chữ; validate cảnh báo | Nền đặc |
| Thiếu `target_x/y` | validate lỗi | Ghi toạ độ [0, 1] |
| Che mặt hoặc chủ thể | Nhãn/đường đè | Dời `label_*` |
| Toạ độ sai | Đầu mút lệch điểm cần chỉ | Đọc lại từ khung, xem preview |
| Dùng `arrow`/`ring` ở documentary | validate báo lỗi | `callout_label_dot` |

## 10. Kiểm tra sau render
- Đầu mút đúng điểm cần chỉ trong cả đoạn hiện; đường vẽ dần mượt, xong trước khi hết `hold`.
- Nhãn đọc rõ, nền đặc, đường không xuyên qua chữ; dấu tiếng Việt đủ.
- Không che mặt, chủ thể; nhãn trong khung, không chạm mép.
- Cần xem preview: hoạt ảnh (`fade`, `pop`...), điểm chỉ bám vật chuyển động (callout cố định), chữ chồng mặt người, 1080p/4K.
