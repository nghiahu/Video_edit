---
id: bullet_list_reveal
name: Bullet List Reveal (Danh sách hiện từng mục)
group: typography
roles: [information, structure]
status: usable
source_of_values: convention
---

# Bullet List Reveal

## 1. Mục đích
Liệt kê **2–6 ý ngắn** trong một hộp, mỗi mục hiện nối tiếp theo nhịp, để người xem theo kịp một chuỗi ý (các bước, nội dung chương trình, lợi ích) mà không bị ngợp. Thuộc cấp 2 (thông tin) trong `typography/hierarchy.md`.

## 2. Khi nên dùng
- Người nói đang **liệt kê** (ba nội dung, các bước) hoặc cần tóm lại một chuỗi ý ngắn, có nguồn (lời nói, kịch bản, slide).
- Mỗi mục là cụm danh từ hoặc câu rất ngắn (`R-BL-1`).
- Cần cấu trúc dễ quét mắt hơn một đoạn chữ liền.

| Tình huống | Chọn |
|---|---|
| 2–6 mục ngắn hiện nối tiếp | `bullet_list_reveal` |
| Một cụm 3–6 từ nhấn ý | `kinetic_text` |
| Hai dòng trên dưới, không phải danh sách | `stacked_text` |
| Câu dài, lời nói liên tục | `subtitles` |

## 3. Khi không nên dùng
- Mục dài hơn 8 từ, dưới 2 mục, trên 6 mục, tổng quá 36 từ (`validate` chặn).
- Danh sách quá dài để đọc kịp: khuyến nghị **không quá 3–5 mục** (mục 7); dài hơn thì chia nhiều lần (mục 5).
- Nội dung không có nguồn, tự bịa các "ý chính" mà người nói không nói.
- Cùng lúc `subtitles`, `lower_third`, `kinetic_text` hoặc khối chữ khác.
- Chồng mặt người: hộp chiếm nhiều diện tích (6 mục × 52 px × 1.35 ≈ 420 px, gần 40% chiều cao 1080p, chưa kể đệm).
- Dùng liên tục: danh sách lặp lại mỗi đoạn thành nhiễu, trái tinh thần documentary tiết chế.

## 4. Thông số
Giá trị là của `bullet_list_clean`; ngoặc là `numbered` / `check`. Cỡ chữ tính cho 1080p.

| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `lines` | – (bắt buộc) | 2–6 mục (validate), mỗi mục ≤ 8 từ, tổng ≤ 36 từ | – | medium |
| `sub_text` | – | ≤ 12 từ; tính vào `hold`; hiện dưới danh sách | – | low |
| `hold` | `0.8 + 0.3 × tổng_từ`, ≥ 1.0 (tính cả `sub_text`) | ≥ công thức | giây | medium |
| `bullet` | `•` (`number`; `✓`) | `•`, `number`, `✓`, ký tự bất kỳ, `none`; không kiểm tra | – | medium |
| `bullet_color` | `#F2C14E` (`#F2C14E`; `#4ADE80`) | màu CSS; rỗng thì theo màu chữ | – | low |
| `item_delay` | 0.55 (0.6; 0.55) | không kiểm; `null` = 6 khung × `stagger` mỗi mục | giây | low |
| `in_animation` | `line_stagger` | từng mục `fade_up` trễ dần | – | medium |
| `in_duration` / `out_duration` | 0.5 / 0.3 (0.5 / 0.2; 0.5 / 0.2) | mỗi mục fade trong 0.7 × `in_duration` | giây | low |
| `font_family` / `font_weight` | Inter / 600 | registry; vai trò `heading`, `emphasis` hoặc `subtitle` | – | medium |
| `font_size` / `line_height` | 52 / 1.35 | 12–600 (validate) / không kiểm | px @1080p / – | medium |
| `box_style` | `rounded` (`bar_left`; `rounded`) | enum | – | medium |
| `box_color` | `rgba(0,0,0,0.62)` (`0.55`; `0.62`) | màu CSS | – | low |
| `box_radius` | 18 (–; 20) | không kiểm tra | px @1080p | low |
| `box_border_color` / `box_border_width` | – (`#F2C14E` / 8; –) | chỉ `bar_left` dùng làm vạch | px @1080p | low |
| `box_padding_x` / `box_padding_y` | 44 / 28 (40 / 24; 48 / 30) | 0–120 / 0–80 (validate) | px @1080p | low |
| `position` / `align` | `lower_left` / `left` (`middle_left`; `center`) | 9 vị trí | – | medium |

**Giới hạn thật của hiện thực** (`TextBlock.jsx`):
- Ký hiệu đầu dòng là một phần tử riêng cùng màu `bullet_color`, rộng ≥ 1.1 em; `number` hiển thị `1.`, `2.`... theo thứ tự, **không** thay đổi được kiểu số. `✓` lấy từ phông dự phòng nếu phông chính thiếu (đã xem hiển thị đúng).
- Mục hiện lúc `i × item_delay` giây (tính từ **đầu khối**), mỗi mục `fade_up` 24 px. Mục dài tự xuống dòng trong hộp (`max_width_percent` 88).
- Với `line_stagger`, nếu preset có hộp nền thì **cả hộp hiện dần (`fade`) trong `in_duration`** trong khi các mục hiện nối tiếp: mục thứ i hiện trễ `i × item_delay` giây rồi chạy `fade_up` trong `0.7 × in_duration`. Đã xem trên preview: ở 0,85 giây mới có 2 mục, mục 3 chưa hiện; ở 1,9 giây đủ ba mục.
- `validate` không kiểm `item_delay`, `bullet`, `bullet_color`.


**Chạy vào từ mép khung (`line_slide`):** thêm `line_slide: "left"` (hoặc `"right"`) và tuỳ chọn `line_slide_distance` (px @1080p, mặc định 900) cùng `in_animation: line_stagger`: từng mục trượt vào từ mép khung bên đó, trễ `item_delay` giây mỗi mục. Dùng ở style không phải documentary. Đã xem khung tĩnh trên preview `khai-giang-gioi-thieu`; chưa xem chuyển động.

## 5. Quy trình thực hiện
1. Rút các mục từ nguồn có thật (lời nói, kịch bản); giữ đúng nội dung, mỗi mục cụm ngắn, chính tả đủ dấu.
2. Đếm: 2–6 mục, mỗi mục ≤ 8 từ, tổng ≤ 36 từ; nên 3–5 mục, mỗi mục ≤ 5 từ (`confidence: low`).
3. **Khi nào chia nhiều lần hiện:** NẾU > 5 mục, hoặc tổng từ > 20, hoặc các mục thuộc hai nhóm ý khác nhau THÌ chia thành hai quyết định liên tiếp, mỗi cái ≤ 4 mục, cách nhau ≥ 1.0 s (không chồng nhau), bám theo nhịp người nói.
4. Chọn `bullet` theo ý: `•` cho ý ngang hàng, `number` cho thứ tự/bước, `✓` cho kết quả đạt được.
5. Tính `hold = max(1.0, 0.8 + 0.3 × tổng_từ)`; kiểm tra `hold ≥ (n − 1) × item_delay + 0.7 × in_duration + 1.5` (mục cuối còn hiện đủ ≥ 1.5 s, `confidence: low`). Danh sách dài phải giữ lâu: 13 từ → 4.7 s, 20 từ → 6.8 s, 36 từ → 11.6 s.
6. `duration = in_duration + hold + out_duration`; chạy `validate`, xem preview.

## 6. Biến thể và preset
Đã xem trên preview 960×540 của clip thử (khung tĩnh lúc chữ hiện đủ): chấm vàng, số, dấu tích xanh ✓ đều hiện đúng, hộp nền hiển thị. Việc từng mục hiện nối tiếp chưa xem.
| Preset | Mô tả | Documentary |
|---|---|---|
| `bullet_list_clean` | Hộp tối bo góc, chấm vàng, dưới trái | **Được**; mặc định |
| `bullet_list_numbered` | Vạch vàng bên trái, đánh số, giữa-trái | **Được** (cho thứ tự/bước) |
| `bullet_list_check` | Hộp tối, dấu ✓ xanh `#4ADE80`, giữa khung (`confidence: low`) | Không cấm, nhưng xanh sáng hơi rực: ưu tiên hai preset trên |

Không preset nào có `forbidden_styles`.

## 7. Quy tắc quyết định
- `R-BL-1` (validate): 2–6 mục; mỗi mục ≤ 8 từ; tổng ≤ 36 từ; `hold` đủ công thức (tính cả `sub_text`); enum, phông, vai trò hợp lệ.
- `R-BL-2`: khuyến nghị ≤ 3–5 mục để người xem đọc kịp; > 5 mục thì chia (mục 5); vượt thì ưu tiên rút mục thay vì rút `hold`.
- `R-BL-3`: NẾU `item_delay` > 1.0 s hoặc có > 4 mục THÌ kiểm tra `hold ≥ (n − 1) × item_delay + 0.7 × in_duration + 1.5`.
- `R-BL-4`: NẾU `strategy.style = documentary` THÌ `in_animation: line_stagger` được phép (`none|fade|fade_up|line_stagger`), `out_animation` chỉ `none|fade`; giữ `item_delay` 0.5–0.7 s, không bật hiệu ứng nảy.
- `R-BL-5`: mục lấy từ nguồn có thật; không thêm ý người nói không nói.
- `R-BL-6`: không cùng lúc `subtitles`, `lower_third`, `kinetic_text`; không che mặt (`R-TXT-3`).
- Ngân sách: `documentary.md` chưa có dòng riêng; AI tự giữ ≤ 2 lần mỗi video 2 phút (`confidence: low`).
- Ưu tiên: Clarity > Style > Decoration.

## 8. Ví dụ
Giả định minh họa: người dẫn liệt kê ba nội dung đào tạo trong clip `c03`. Ba mục 4 + 5 + 4 = 13 từ → hold ≥ 0.8 + 3.9 = 4.7; chọn 4.8. Kiểm tra `R-BL-3`: (3 − 1) × 0.55 + 0.7 × 0.5 + 1.5 = 2.95 ≤ 4.8.
```json
{
  "id": "d15",
  "technique": "bullet_list_reveal",
  "preset": "bullet_list_clean",
  "anchor": { "clip": "c03", "source_time": 8.0 },
  "start_offset": 0.0,
  "duration": 5.6,
  "parameters": {
    "lines": ["Học Python cơ bản", "Làm việc với dữ liệu", "Dự án thực tế"],
    "hold": 4.8
  },
  "reason": "Người dẫn liệt kê ba nội dung theo thứ tự; hiện từng mục bám nhịp lời nói (nguồn: kịch bản clip c03)",
  "priority": "clarity",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```
`duration` 5.6 = 0.5 + 4.8 + 0.3. Nội dung ba mục là minh họa, không phải dữ liệu thật.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Quá nhiều mục | > 5 mục, hộp cao gần nửa khung | Chia nhiều lần (mục 5) |
| Mục dài như câu | > 8 từ, validate báo lỗi | Rút thành cụm |
| `hold` chỉ vừa đủ công thức khi `item_delay` lớn | Mục cuối vừa hiện đã biến mất | `R-BL-3` |
| Hộp hiện trống lúc đầu | Hộp đủ kích cỡ nhưng chưa có chữ | Chấp nhận hoặc `bg` nhẹ; cần xem preview |
| Tự thêm ý | Mục không có trong lời nói | `R-BL-5` |
| Chồng phụ đề, `lower_third` | Hai khối ở dưới trái | Đổi `position` hoặc bỏ |
| Dấu tích xanh sáng ở documentary | Màu chói so với footage | `bullet_list_clean` |

## 10. Kiểm tra sau render
- Từng mục hiện đúng thứ tự, nhịp đều; mục cuối còn đủ thời gian đọc; ký hiệu đầu dòng thẳng hàng, màu đúng.
- Dấu tiếng Việt đủ; `✓` hiển thị đúng; số `1.`, `2.` đúng thứ tự.
- Hộp không chạm mép (lề ≥ 5%), không che mặt, không đè phụ đề.
- Cần xem preview: hoạt ảnh từng mục `line_stagger`, hộp hiện trước chữ (hoặc lúc ra), mục dài xuống dòng, 1080p/4K.
