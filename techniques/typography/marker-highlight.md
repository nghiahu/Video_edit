---
id: marker_highlight
name: Marker Highlight (Vệt bút dạ sau chữ)
group: typography
roles: [emphasis, information]
status: usable
source_of_values: convention
---

# Marker Highlight

## 1. Mục đích
Tô một **vệt bút dạ** phía sau cả dòng chữ hoặc chỉ vài từ khóa, như người dùng bút highlight trên giấy, để kéo mắt tới ý chính. Phong cách thân thiện, giáo dục, social; không phải phong cách documentary.

## 2. Khi nên dùng
- Câu ngắn (tối đa 14 từ, 2 dòng) có **một cụm từ khóa** cần đọc trước: dùng `marker_keywords` với `highlight_words`.
- Nội dung giáo dục, hướng dẫn, mẹo, ghi chú, vlog: cả dòng có vệt (`marker_yellow`, `marker_pink`).
- Muốn nhấn mà không cần phóng to chữ như `big_text`.

## 3. Khi không nên dùng
- Style documentary: cả ba preset nằm trong `forbidden_styles` (validate báo lỗi); dùng `kinetic_text_editorial` hoặc `text_box_underline` thay (`R-MARK-2`).
- Chữ đang cần tương phản với màu vệt mà không đảm bảo được (chữ trắng trên vệt vàng nhạt, xem mục 9).
- Câu quá dài hoặc nhiều cụm cần tô: vệt phủ gần hết dòng thì mất tác dụng nhấn (`R-MARK-4`).
- Cùng khung đã có chữ nhấn khác (một cấp nhấn mỗi khung).
- Vệt sẽ che mặt (`R-TXT-3`).

## 4. Thông số
Khối nền `_text_style_base`; giá trị của `marker_yellow` trừ khi ghi khác.

| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `text` hoặc `lines` | – | tối đa 14 từ, 2 dòng | – | medium |
| `highlight_words` (nội dung) | `[]` | mảng chuỗi (từ hoặc cụm có trong chữ) | – | medium |
| `hold` (nội dung) | `0.8 + 0.3 × số_từ`, ≥ 1.0 | ≥ công thức | giây | medium |
| `marker_color` | `#FFE14D` (pink `#FF9EC4`, keywords `#FFD60A`) | CSS color; **bắt buộc** (validate) | – | low |
| `text_color` | `#111111` (pink `#5B1A3A`, keywords `#FFFFFF`) | CSS color | – | low |
| `highlight_color` | `null` (keywords `#111111`) | màu chữ của từ được tô | – | low |
| `marker_top` | 48 | 0–100, < `marker_bottom` | % chiều cao dòng | low |
| `marker_bottom` | 94 | 0–100, > `marker_top` | % chiều cao dòng | low |
| `marker_skew` | −4 (pink −3, keywords −3) | quy ước −8–0 | độ | low |
| `marker_pad_x` | 10 | ≥ 0 | px @1080p | low |
| `marker_delay` | 0.2 (keywords 0.3) | ≥ 0 | giây | low |
| `marker_duration` | 0.45 (keywords 0.4) | > 0 | giây | low |
| `font_size` / `font_weight` | 64 / 700 (keywords 62) | 12–400 (validate) | px @1080p | medium |
| `font_family` | Inter (pink: Nunito) | phông trong registry | – | medium |
| `position` | `lower_middle` | `BLOCK_ENUMS.position` | – | medium |
| `in_animation` | `fade` | `BLOCK_ENUMS.in_animation` | – | low |

Giới hạn `marker_top`, `marker_bottom`, `marker_skew`, `marker_pad_x`, `marker_delay`, `marker_duration` không được `validate` kiểm tra; khoảng ghi trên là quy ước.

**Cách hiện thực (giới hạn thật):** vệt là **gradient nền** (`linear-gradient`, dải từ `marker_top` đến `marker_bottom` của chiều cao dòng) có `background-size` tăng dần từ 0 đến 100% chiều rộng theo `marker_delay`/`marker_duration`; không phải nét bút thật, không có mép lởm chởm. `marker_skew` nghiêng cả vệt **và chữ** trong vệt (`skewX`). `marker_delay` và `marker_duration` được đổi sang khung hình theo fps thực của dự án. Các từ khóa nằm liền nhau được gộp thành một vệt chung (không hở ở dấu cách).

## 5. Quy trình thực hiện
1. Chọn style: nếu documentary thì **không dùng** kỹ thuật này.
2. Chọn câu ngắn; xác định cụm từ khóa (1 cụm, tối đa 3–4 từ).
3. Chọn preset: tô cả dòng (`marker_yellow`/`marker_pink`) hoặc chỉ từ khóa (`marker_keywords` + `highlight_words`).
4. Truyền `highlight_words` đúng chính tả như trong chữ; cụm nhiều từ được tách thành từng từ, và các từ liền nhau được gộp thành **một vệt liền** (không hở ở dấu cách). Khớp theo từ nguyên vẹn, không phân biệt hoa/thường; dấu `. , ! ? ; :` ở cuối từ được bỏ khi so khớp.
5. Kiểm tra tương phản chữ và vệt (mục 9); tính `hold`; `duration = in_duration + hold + out_duration`.
6. Chạy `validate` (cảnh báo nếu `highlight_words` không có trong chữ), xem preview.

## 6. Biến thể và preset
Đã xem trên preview 960×540 của clip thử (khung giữa lúc chữ hiện đủ).
| Preset | Mô tả đã xem | Documentary |
|---|---|---|
| `marker_yellow` | Vệt vàng liền dải sau cả dòng, chữ đen, nghiêng nhẹ | **Cấm** |
| `marker_pink` | Vệt hồng liền dải sau cả dòng, chữ Nunito tím đậm | **Cấm** |
| `marker_keywords` | Chỉ các từ trong `highlight_words` có vệt vàng, chữ đổi đen; cụm nhiều từ gộp một vệt | **Cấm** |

Cả ba nằm trong `forbidden_styles: [documentary]`; không có preset marker nào dùng được ở documentary.

## 7. Quy tắc quyết định
- `R-MARK-1` (validate): ≤ 14 từ, ≤ 2 dòng, `marker_color` có giá trị, `hold` ≥ `max(1.0, 0.8 + 0.3 × số_từ)`, enum hợp lệ, phông trong registry.
- `R-MARK-2`: NẾU style `documentary` THÌ không dùng; thay bằng `kinetic_text_editorial` (nhấn cụm) hoặc `text_box_underline` (gạch chân tiết chế).
- `R-MARK-3`: preset `marker_keywords` **bắt buộc** có `parameters.highlight_words` không rỗng (`validate` báo lỗi nếu thiếu); các preset `marker_yellow`/`marker_pink` không truyền thì tô cả dòng.
- `R-MARK-4`: số từ được tô ≤ khoảng một nửa số từ của dòng, để vệt còn tác dụng nhấn.
- `R-TXT-3`, một cấp nhấn mỗi khung, `R-FREQ-2`. Ưu tiên lớp: Clarity (tương phản, đọc được) > Style > Decoration.

## 8. Ví dụ
Video hướng dẫn kiểu social/giáo dục (style không phải documentary), clip `c04`: "Học xong là làm được việc", muốn tô cụm "làm được việc". 6 từ → hold ≥ 0.8 + 1.8 = 2.6.

```json
{
  "id": "d13",
  "technique": "marker_highlight",
  "preset": "marker_keywords",
  "anchor": { "clip": "c04", "source_time": 7.5 },
  "start_offset": 0.0,
  "duration": 3.5,
  "parameters": {
    "text": "Học xong là làm được việc",
    "highlight_words": ["làm được việc"],
    "hold": 3.0
  },
  "reason": "Cụm kết quả đầu ra cần được đọc trước; chỉ tô cụm, không tô cả câu",
  "priority": "clarity",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```
`duration` 3.5 = 0.3 + 3.0 + 0.2. Nội dung chữ là minh họa. Ở style documentary, ví dụ này bị `validate` từ chối.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Chữ không tương phản với vệt | Chữ trắng trên vệt vàng nhạt, chữ khó đọc | Dùng chữ tối (`#111111`) trên vệt sáng; chữ trắng chỉ khi vệt đậm |
| Quên `highlight_words` ở `marker_keywords` | Cả dòng bị tô | Luôn truyền (`R-MARK-3`) |
| `highlight_words` sai chính tả | Không tô, `validate` cảnh báo | Chép đúng từ trong chữ |
| Tô quá nhiều từ | Vệt chiếm gần cả dòng | `R-MARK-4` |
| Dùng ở documentary | Validate báo cấm | `kinetic_text_editorial` |
| Vệt lệch so với chữ | Dòng 2 hàng, vệt bị cắt đầu/cuối | Xem preview, chỉnh `marker_top`/`marker_bottom` |

## 10. Kiểm tra sau render
- Chữ và vệt đủ tương phản; đọc được ở tốc độ bình thường.
- Vệt phủ liền qua dấu cách giữa các từ khóa; không hở, không lệch trên/dưới chữ.
- Dấu tiếng Việt hiển thị đủ, không bị vệt che.
- Cần xem preview: vệt quét đúng thời điểm (`marker_delay`), 1080p/4K, nghiêng (`marker_skew`) không làm chữ vỡ, cảnh có người.
