---
id: pull_quote
name: Pull Quote (Trích dẫn nổi bật)
group: typography
roles: [emphasis, storytelling]
status: usable
source_of_values: convention
---

# Pull Quote

## 1. Mục đích
Đưa **một câu nói đáng nhớ** của một người lên màn hình, kèm dấu ngoặc kép lớn và tên người nói, để người xem dừng lại ở ý quan trọng nhất của câu chuyện. Thuộc cấp 1 (câu trích) kèm cấp 2 (tên người nói, ở `sub_text`) trong `typography/hierarchy.md`.

## 2. Khi nên dùng
- Có **nguyên văn đáng tin** của một câu nói gọn, mang ý chính (cảm xúc, nhận định, bài học), biết chắc người nói.
- Câu trích đứng riêng được, hiểu không cần ngữ cảnh dài: ≤ 30 từ, ≤ 4 dòng (`R-PQ-1`); nên ≤ 20 từ ở documentary (`confidence: low`).
- Điểm nghỉ của nhịp dựng: kết đoạn, mở chương, giữa b-roll rộng.

| Tình huống | Chọn |
|---|---|
| Một câu đáng nhớ, có tên người nói | `pull_quote` |
| Lời nói liên tục, chạy theo từng cue | `subtitles` |
| Cụm 3–6 từ nhấn dữ kiện, có chuyển động | `kinetic_text` |
| Tên và chức danh người nói | `lower_third` |

## 3. Khi không nên dùng
- **Không có nguyên văn đáng tin** hoặc chỉ có đoạn "…", "không rõ" trong metadata: không tự bổ sung, không diễn đạt lại (liên hệ `R-SUB-1` của `subtitles`).
- Không chắc người nói là ai: không ghi tên đoán.
- Câu quá 30 từ hoặc quá 4 dòng (`validate` chặn); tên người nói quá 12 từ (`sub_text`).
- Cùng lúc với `subtitles`, `lower_third` hoặc khối chữ khác: hai khối cạnh tranh (một cấp nhấn mỗi khung).
- Chồng lên mặt người đang nói (`pull_quote_editorial` và `bold` làm tối cả khung, `bg_mode: dim`).
- Style documentary với `pull_quote_bold` (`forbidden_styles: [documentary]`, validate báo lỗi).

## 4. Thông số
Giá trị là của `pull_quote_editorial`; ngoặc là `clean` / `bold`. Cỡ chữ tính cho 1080p.

| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `text` hoặc `lines` | – (bắt buộc) | ≤ 30 từ, ≤ 4 dòng khai báo | – | medium |
| `sub_text` | – (tên người nói) | ≤ 12 từ; tính vào `hold` | – | medium |
| `hold` | `0.8 + 0.3 × số_từ`, ≥ 1.0 (tính cả `sub_text`) | ≥ công thức | giây | medium |
| `font_family` / `font_weight` | Playfair Display / 600 (Inter / 600; Inter / 800) | registry; vai trò `heading`, `emphasis`, `accent` hoặc `subtitle` | – | medium |
| `font_size` | 64 (54 / 72) | 12–600 (validate) | px @1080p | medium |
| `line_height` | 1.25 (1.25 / 1.15) | không kiểm tra | – | low |
| `quote_mark` | `true` | `true`/`false` | – | medium |
| `quote_mark_color` | `#F2C14E` (`#F2C14E` / `#FF6B6B`) | màu CSS | – | low |
| `quote_mark_size` | 300 (240 / 340) | 40–400 (validate) | px @1080p | low |
| `quote_font_family` | `Playfair Display` | tên phông; **không** kiểm bằng validate | – | low |
| `sub_font_family` / `sub_font_size` | Inter / 34 (theo chữ chính / 32; / 36) | không kiểm tra | px @1080p | low |
| `sub_gap` | 26 (18 / 24) | không kiểm tra | px @1080p | low |
| `position` / `align` | `center` / `left` (`lower_left` / `left`; `center` / `center`) | 9 vị trí | – | medium |
| `max_width_percent` | 66 (62 / 72) | không kiểm tra | % khung | low |
| `bg_mode` / `bg_opacity` | `dim` / 0.5 (`none`; `dim` / 0.6) | enum / 0–1 | – | low |
| `in_animation` / `in_duration` | `fade` / 0.7 (`fade_up` / 0.5; `scale_fade` / 0.5) | enum; documentary xem mục 7 | giây | low |
| `out_duration` | 0.5 (0.2 / 0.2) | – | giây | low |

**Giới hạn thật của hiện thực:**
- Code chỉ vẽ **dấu mở “** (cố định, `fontWeight` 700, căn theo `align` của khối, đã xem căn giữa với `pull_quote_bold`). **Không có dấu đóng**; đừng gõ thêm dấu ngoặc kép vào `text` kẻo thành hai dấu mở.
- Dấu ngoặc nằm trong khối, trên dòng đầu; chiều cao dành cho nó = 0.5 × `quote_mark_size`, nên `quote_mark_size` lớn làm khối cao thêm.
- `maxLines` đếm dòng khai báo (`lines` hoặc `\n`), không đếm dòng tự xuống theo bề ngang. Ước tính ở 1080p, câu 30 từ có thể thành 4–6 dòng nhìn thấy (`bold` dễ dài nhất): cần xem preview.
- `sub_text` thừa kế đổ bóng, `letter_spacing`, `text_transform` của chữ chính nhưng bỏ viền, gradient, glow; không tự thêm dấu gạch đầu dòng.

## 5. Quy trình thực hiện
1. Tìm câu trong lời thoại có **nguyên văn xác nhận** và mốc thời gian; xác nhận tên người nói.
2. Chép **đúng từng chữ**, đủ dấu tiếng Việt. Chỉ cắt đầu/cuối câu khi không đổi nghĩa; không sửa ngữ pháp, không thay từ.
3. Đếm từ: câu ≤ 30 (nên ≤ 20); tên người nói đặt ở `sub_text` (có thể kèm chức danh ngắn, ≤ 12 từ).
4. Chọn thời điểm: trên b-roll hoặc cảnh rộng ở chỗ nghỉ, hoặc ngay sau khi người nói vừa nói xong câu đó. Tránh vừa chồng lên đúng lúc có phụ đề cùng câu.
5. Tính `hold = max(1.0, 0.8 + 0.3 × tổng_từ)`; `duration = in + hold + out`.
6. Chọn preset theo style (mục 6), chạy `validate`, xem preview.

## 6. Biến thể và preset
Đã xem trên preview 960×540 của clip thử (khung tĩnh lúc chữ hiện đủ): dấu ngoặc vàng/đỏ lớn, câu trích, tên người ở dòng phụ; editorial serif, clean dưới trái, bold giữa màn hình.
| Preset | Mô tả | Documentary |
|---|---|---|
| `pull_quote_editorial` | Playfair, dấu vàng 300 px, nền tối 0.5, `fade` 0.7 s | **Được**; mặc định |
| `pull_quote_clean` | Inter, dấu vàng 240 px, bóng mềm, dưới trái, `fade_up` | **Được**; ít che hình hơn |
| `pull_quote_bold` | Inter 800 lớn, dấu đỏ cam 340 px, nền tối 0.6, `scale_fade` | **Cấm** (`confidence: low`) |

Hoạt ảnh vào/ra từng kiểu chưa xem: cần xem preview.

## 7. Quy tắc quyết định
- `R-PQ-1` (validate): `text` ≤ 30 từ, ≤ 4 dòng; `sub_text` ≤ 12 từ; `hold` đủ công thức (tính cả `sub_text`); enum, phông, vai trò hợp lệ.
- `R-PQ-2`: trích **nguyên văn đã xác nhận**; nguồn thiếu hoặc mơ hồ thì **không dùng** (liên hệ `R-SUB-1`). Ghi nguồn (clip, mốc thời gian) vào `reason`.
- `R-PQ-3`: tên người nói đúng và chỉ có khi đã biết chắc; không chắc thì bỏ `sub_text`, đừng đoán.
- `R-PQ-4`: thời gian hiện đủ đọc: theo công thức `hold`; câu dài hơn 20 từ nên cộng thêm 0.5–1.0 s (`confidence: low`).
- `R-PQ-5`: NẾU `strategy.style = documentary` THÌ chỉ `pull_quote_editorial` hoặc `pull_quote_clean`; `in_animation` chỉ `none|fade|fade_up|line_stagger`, `out_animation` chỉ `none|fade`.
- `R-PQ-6`: không cùng lúc `subtitles`, `lower_third`, `kinetic_text`; không che mặt (`R-TXT-3`).
- Ngân sách: `documentary.md` chưa có dòng riêng; AI tự giữ ≤ 2 lần mỗi video 2 phút (`confidence: low`).
- Ưu tiên: Clarity > Style > Decoration.

## 8. Ví dụ
Giả định minh họa: cảnh b-roll rộng `c06`, người nói là "Tên minh họa". Câu 10 từ + `sub_text` 3 từ = 13 → hold ≥ 0.8 + 3.9 = 4.7; chọn 4.8.
```json
{
  "id": "d13",
  "technique": "pull_quote",
  "preset": "pull_quote_editorial",
  "anchor": { "clip": "c06", "source_time": 2.0 },
  "start_offset": 0.0,
  "duration": 6.0,
  "parameters": {
    "text": "Dữ liệu không nói dối, chỉ có người đọc sai",
    "sub_text": "Tên minh họa",
    "hold": 4.8
  },
  "reason": "Câu then chốt của diễn giả, nguyên văn từ transcript đã xác nhận (clip c04, 31.2 s); đặt trên b-roll rộng sau khi người nói nói xong",
  "priority": "storytelling",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```
`duration` 6.0 = 0.7 + 4.8 + 0.5. Câu và tên là minh họa, không phải lời thật của footage.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Bịa hoặc "làm đẹp" lời người nói | Chữ trên hình khác transcript | `R-PQ-2` |
| Ghi nhầm tên người nói | Tên không khớp footage | `R-PQ-3`; không chắc thì bỏ |
| Gõ thêm dấu ngoặc kép | Hai dấu “ liền nhau | Chỉ để code vẽ dấu mở |
| Chữ biến mất trước khi đọc xong | `hold` sát công thức, câu dài | `R-PQ-4` |
| Cùng lúc phụ đề | Hai đoạn chữ trên khung | `R-PQ-6` |
| `bold` ở documentary | validate báo lỗi | `editorial` hoặc `clean` |
| Câu quá dài, nhiều dòng | Khối cao, chạm mép | Rút ý hoặc chọn câu khác |

## 10. Kiểm tra sau render
- Chữ trên hình **khớp từng chữ** với nguyên văn đã xác nhận; tên người nói đúng, dấu tiếng Việt đủ.
- Câu đọc trọn ở tốc độ bình thường; số dòng nhìn thấy ≤ 4; không chạm mép (lề ≥ 5%).
- Dấu ngoặc mở đúng vị trí, không đè lên chữ; tên người nhỏ hơn rõ so với câu (≥ 1.4×).
- Cần xem preview: hoạt ảnh `fade`, `fade_up`, `scale_fade`; chữ chồng mặt người; 1080p/4K.
