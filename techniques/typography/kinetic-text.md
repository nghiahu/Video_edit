---
id: kinetic_text
name: Kinetic Text (Chữ nhấn mạnh có chuyển động)
group: typography
roles: [emphasis, information, rhythm]
status: usable
source_of_values: convention
---

# Kinetic Text

## 1. Mục đích
Đưa một cụm từ ngắn lên màn hình, có chuyển động ngắn, để nhấn ý chính hoặc làm rõ thông tin cụ thể (số liệu, tên, mốc) mà tiếng nói đang nhắc đến.

## 2. Khi nên dùng
- Câu có **dữ kiện cụ thể**: con số, tên, mốc thời gian (`R-EMP-2`).
- Từ khóa trụ cột của thông điệp.
- Nội dung trừu tượng không có hình minh họa (`R-ABS-1`).
- Khi muốn nhấn mà khung đã quá cận không `punch_in` được.

## 3. Khi không nên dùng
- Chữ dài hơn 6 từ (đó là phụ đề, không phải chữ nhấn) — `R-TXT-1`.
- Không đủ thời gian để đọc (xem công thức ở mục 4) — `R-TXT-2`.
- Chữ sẽ che mặt người nói hoặc chữ có sẵn trên hình — `R-TXT-3`.
- Dùng cho **mọi** câu nói. Chữ nhấn mạnh chỉ cho ý quan trọng.
- Style documentary chọn "minimal" nhưng nội dung đã đủ rõ.
- Vượt `strategy.budget.emphasis_text`.

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `text` | – | 1–6 từ | – | high |
| `max_words` | 6 | 3–6 | từ | medium |
| `hold` (thời gian hiện đủ) | công thức dưới | ≥ 1.0 | giây | medium |
| `in_duration` | 0.25 | 0.15–0.35 | giây | medium |
| `out_duration` | 0.2 | 0.1–0.3 | giây | medium |
| `in_animation` | `fade_up` | `fade`, `fade_up`, `scale_fade` | – | medium |
| `out_animation` | `fade` | `fade`, `none` | – | medium |
| `position` | `lower_middle` | `lower_middle`, `center`, `lower_left` | – | medium |
| `min_hold_base` | 0.8 | 0.8 | giây | medium |
| `min_hold_per_word` | 0.3 | 0.25–0.35 | giây/từ | medium |
| `highlight_words` | [] | từ trong `text` | – | low |
| `typography_preset` | theo style | ID trong `presets/typography-presets.json` | – | medium |

**Thời gian hiện tối thiểu (tiếng Việt):** `hold ≥ 0.8 + 0.3 × số_từ` giây, và không dưới 1.0 giây. Ví dụ 4 từ → ≥ 2.0 giây. Nếu câu nói ngắn hơn, vẫn giữ chữ đủ `hold`, đừng rút ngắn dưới ngưỡng. Nếu không đủ chỗ trong clip → bỏ chữ.

## 5. Quy trình thực hiện
1. Chọn **cụm từ** từ lời thoại: rút gọn còn 3–6 từ giữ ý chính; dữ kiện giữ nguyên chính xác (số, tên).
2. Kiểm tra điều kiện ở mục 3, khoảng cách ≥ 4 giây nguồn với chữ nhấn trước đó.
3. Chọn preset chữ theo `typography_style` (xem `typography/`). **Phải đọc `typography/font-catalog.md` và `typography/hierarchy.md` trước.**
4. Đặt thời điểm: chữ vào **cùng lúc hoặc trễ tối đa 0.1 giây sau** từ được nhắc; vào trước thì lộ nội dung.
5. Chọn `position` không che mặt (xem `core/composition.md`); nếu có `on_screen_text` trong clip, đặt ở vùng trống.
6. Tính `hold` theo công thức; kiểm tra chữ không bị cắt bởi điểm nối clip (nếu bị, rút bớt `hold` nhưng không dưới ngưỡng, hoặc dời).
7. Kiểm tra chính tả tiếng Việt và dấu (xem lỗi ở mục 9).

## 6. Biến thể và preset
| Preset | Phong cách | Dùng khi |
|---|---|---|
| `kinetic_text_editorial` | Inter 700, tracking hẹp, `fade_up`, màu trắng ngà | Documentary, sự kiện nghiêm túc |
| `kinetic_text_emphasis` | Chữ đậm, `scale_fade`, nhấn từ khóa bằng màu | Social, nhấn mạnh rõ |
| `kinetic_text_minimal` | Chữ nhỏ, `fade`, không nền | Rất tiết chế |

## 7. Quy tắc quyết định
- `R-EMP-2`, `R-TXT-1`, `R-TXT-2`, `R-TXT-3`, `R-FREQ-2`, `R-FREQ-4`.
- NẾU style `documentary` THÌ chỉ `kinetic_text_editorial` hoặc `kinetic_text_minimal`; cấm `bounce`, `elastic`, `glitch`.
- NẾU chữ trùng nghĩa 100% với hình (slide đã ghi y hệt) → bỏ chữ.

## 8. Ví dụ
MC nói: "Chương trình **đào tạo Phân tích Dữ liệu** khai giảng khóa đầu tiên." Slide trên hình đã ghi tên chương trình nên không cần chữ lặp lại; chọn nhấn dữ kiện khác — "khóa đầu tiên".

```json
{
  "id": "d06",
  "technique": "kinetic_text",
  "preset": "kinetic_text_editorial",
  "anchor": { "clip": "c02", "source_time": 9.6 },
  "start_offset": 0.0,
  "duration": 2.5,
  "parameters": {
    "text": "Khóa đầu tiên",
    "position": "lower_middle",
    "hold": 2.0,
    "in_animation": "fade_up",
    "out_animation": "fade"
  },
  "reason": "Dữ kiện 'khóa đầu tiên' chưa có trên slide, cần đọc được bằng mắt",
  "priority": "clarity",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```
Ở ví dụ này `duration` = `in_duration` (0.3) + `hold` (2.0) + `out_duration` (0.2) = 2.5; `hold` 2.0 ≥ 0.8 + 0.3 × 3 = 1.7.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Chữ quá dài | > 6 từ, phải đọc nhanh | Cắt còn từ khóa |
| Chữ biến mất trước khi đọc xong | `hold` < công thức | Giữ đủ hoặc bỏ chữ |
| Che mặt hoặc chữ trên hình | Chồng với vùng mặt/slide | Dời `position` hoặc bỏ |
| Lệch với lời | Chữ xuất hiện trước khi người nói nhắc | Vào đúng hoặc trễ ≤ 0.1 s |
| Lỗi dấu tiếng Việt | Font không có glyph, dấu bị rơi hoặc đổi font | Chỉ dùng font trong `font-catalog.md` có hỗ trợ tiếng Việt, nhìn kỹ preview |
| Animation lòe loẹt | Bounce/elastic ở documentary | Chọn preset `editorial` |
| Dùng ở mọi câu | Vượt ngân sách | Chỉ ý quan trọng |

## 10. Kiểm tra sau render
- Đọc được trọn vẹn bằng mắt ở tốc độ bình thường (thử đọc thầm ở tốc độ chậm).
- Tương phản đủ trên nền; không bị chìm vào hình.
- Dấu tiếng Việt hiển thị đủ, không bể.
- Không che mặt, không tràn khung.
