---
id: chapter_title
name: Chapter Title (Tiêu đề chương)
group: typography
roles: [structure, emphasis]
status: usable
source_of_values: convention
---

# Chapter Title

## 1. Mục đích
Báo cho người xem biết **một chương mới bắt đầu**: số chương nhỏ phía trên, tên chương lớn bên dưới. Giúp video dài có cấu trúc rõ mà không cần lời dẫn. Thuộc cấp 1 (nhấn) trong `typography/hierarchy.md`; dòng số chương là cấp 2.

## 2. Khi nên dùng
- Video chia chương rõ (mở, bối cảnh, nội dung chính, kết) và mỗi chương dài đủ để cần mốc đánh dấu.
- Có khoảng lời thoại thưa hoặc b-roll rộng ở điểm đổi chương (`R-CHAP-2`).
- Tên chương lấy từ nội dung có nguồn (kịch bản, nội dung chương trình), không tự bịa.

| Tình huống | Chọn |
|---|---|
| Đổi chương, có **số chương** + tên chương | `chapter_title` |
| Tiêu đề video hoặc đoạn, nền phủ cả khung, không cần số chương | `title_card` |
| Hai dòng trên dưới thuần bố cục, không mang nghĩa "chương" | `stacked_text` |
| Nhãn chủ đề nhỏ ở góc, theo suốt đoạn | `text_pill` |

## 3. Khi không nên dùng
- Video ngắn (dưới khoảng 60 giây) hoặc chỉ một mạch ý: chương không có gì để đánh dấu.
- Giữa lúc người nói đang phát biểu thông điệp chính: `editorial` và `bold` làm tối cả khung (`bg_mode: dim`).
- Quá 2 dòng hoặc quá 8 từ kể cả số chương (`validate` chặn). Dòng phụ đặt ở `sub_text`.
- Style documentary với `chapter_title_bold` (`forbidden_styles: [documentary]`, validate báo lỗi).
- Chỉ truyền **một** dòng: dòng đó bị thu theo `line_scales[0]` thành một nhãn nhỏ, không có tên chương lớn (`validate` cảnh báo).
- Dùng cho mỗi cảnh hoặc cùng lúc với `title_card`, `lower_third`, `kinetic_text` (một cấp nhấn mỗi khung).

## 4. Thông số
Khóa kiểu chữ chung xem `typography/text-style-layer.md`. Giá trị là của `chapter_title_editorial`; ngoặc là `bar` / `bold`. Cỡ chữ tính cho 1080p.

| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `lines` | – (bắt buộc) | `["CHƯƠNG 01", "Tên chương"]`; đúng 2 dòng, ≤ 8 từ | – | medium |
| `sub_text` | – | ≤ 12 từ (validate); tính vào `hold` | – | medium |
| `hold` | `0.8 + 0.3 × số_từ`, ≥ 1.0 (tính cả `sub_text`) | ≥ công thức | giây | medium |
| `font_family` / `font_weight` | Playfair Display / 700 (Inter / 800; Anton / 400) | phông có trong registry, vai trò `heading` hoặc `emphasis` | – | medium |
| `font_size` | 110 (96 / 160) | 12–600 (validate) | px @1080p | medium |
| `line_scales` | `[0.52, 1]` (editorial) / `[0.42, 1]` (bar) / `[0.4, 1]` (bold) | mảng số theo thứ tự dòng; không kiểm độ dài | hệ số | low |
| `line_gap` | 14 (editorial) / 12 (bar) / 32 (bold) | ≥ 0 (`validate` cảnh báo nếu thấp hơn 0.12 × cỡ dòng to nhất với chữ hoa có dấu) | px @1080p | medium |
| `line_height` | 1.2 | không kiểm tra; cảnh báo nếu < 1.15 với chữ hoa có dấu nhiều dòng | – | low |
| `position` / `align` | `center` / `left` (`lower_left` / `left`; `center` / `center`) | 9 vị trí; `auto`, `left`, `center`, `right` | – | medium |
| `box_style` | `bar_left` (`bar_left`; `none`) | `bar_left` là đặc trưng | – | medium |
| `box_border_color` / `box_border_width` | `#F2C14E` / 8 (`#B91C2C` / 10) | màu CSS / số px | px @1080p | low |
| `box_color` | `rgba(0,0,0,0)` (`rgba(0,0,0,0.45)`) | màu CSS | – | low |
| `box_padding_x` / `box_padding_y` | 40 / 10 (36 / 16) | 0–120 / 0–80 (validate) | px @1080p | low |
| `bg_mode` / `bg_opacity` | `dim` / 0.5 (`none`; `dim` / 0.65) | `none`, `dim`, `blur`, `solid`; `bg_opacity` không kiểm | – / 0–1 | low |
| `text_transform` / `shadow_type` | `none` / `none` (bold: `uppercase` / `hard` 6,6) | enum của lớp kiểu chữ | – | low |
| `in_animation` / `in_duration` | `fade_up` / 0.6 (0.5 / `slide_up` 0.5) | enum; documentary xem mục 7 | giây | low |
| `out_animation` / `out_duration` | `fade` / 0.4 (0.2 / 0.35) | `none`, `fade` ở documentary | giây | low |

**Giới hạn thật của hiện thực** (`TextBlock.jsx`):
- `line_scales` nhân với `font_size` theo thứ tự dòng; dòng không có hệ số lấy 1. Với 3 dòng phải ghi đè `line_scales` đủ 3 phần tử (ví dụ `[0.3, 1, 0.5]`), nếu không dòng thứ 3 to bằng tên chương. Thay vào đó nên để dòng phụ ở `sub_text`.
- Dòng số chương: 110 × 0.52 ≈ 57 px (editorial), 96 × 0.42 ≈ 40 px (bar), 160 × 0.4 = 64 px (bold) ở 1080p, đúng bằng hoặc sát `min_size_px_1080p` trong registry (Playfair 56, Inter 40, Anton 64). `validate` cảnh báo nếu dòng nhỏ nhất (`font_size × min(line_scales)`) thấp hơn mức này. Bản đầu dùng hệ số 0.3–0.38 làm nhãn chỉ ~33 px, nhỏ quá nên đã tăng.
- Mỗi phần tử `lines` có thể là chuỗi hoặc `{text, scale, weight, color}`; dạng đối tượng chưa xem trên preview.
- `bg_mode: dim` phủ **cả khung** theo đường bao riêng, không theo `in_animation`.

## 5. Quy trình thực hiện
1. Chốt danh sách chương từ kịch bản; đánh số liên tục, cùng định dạng hai chữ số (`CHƯƠNG 01`, `CHƯƠNG 02`...).
2. Rút tên chương ≤ 6 từ (số chương chiếm 2 từ trong giới hạn 8).
3. Chọn điểm đặt ở chỗ lời thoại thưa hoặc b-roll rộng; đặt ở đầu chương, không giữa câu nói.
4. Chọn preset theo style (mục 6). Giữ một preset cho mọi chương của video.
5. Tính `hold = max(1.0, 0.8 + 0.3 × tổng_từ)`; `duration = in_duration + hold + out_duration`.
6. Kiểm tra `bar` (`lower_left`) không đè phụ đề hoặc `lower_third`; chạy `validate`, xem preview.

## 6. Biến thể và preset
Đã xem trên preview 960×540 của clip thử (khung tĩnh lúc chữ hiện đủ): số chương nhỏ phía trên, tên chương lớn, cả ba hiển thị đúng.
| Preset | Mô tả | Documentary |
|---|---|---|
| `chapter_title_editorial` | Playfair, vạch vàng trái, nền tối 0.5, giữa khung | **Được**; mặc định (`confidence: medium`) |
| `chapter_title_bar` | Inter 800, vạch đỏ, nền hộp mờ, góc dưới trái, không làm tối khung | **Được**; tránh khi có phụ đề |
| `chapter_title_bold` | Anton hoa, nền tối 0.65, bóng cứng, `slide_up` | **Cấm** (`confidence: low`) |

Hoạt ảnh vào/ra từng kiểu chưa xem: cần xem preview. `in_duration` 0.5–0.6 s dài hơn dải 0.2–0.35 s của documentary; chấp nhận cho khối lớn, chưa kiểm chứng.

## 7. Quy tắc quyết định
- `R-CHAP-1` (validate): ≤ 2 dòng, ≤ 8 từ; `hold ≥ max(1.0, 0.8 + 0.3 × số_từ)` tính cả `sub_text`; enum, phông, vai trò hợp lệ.
- `R-CHAP-2`: NẾU lời thoại đang có thông điệp chính THÌ dời tới chỗ thưa hoặc bỏ.
- `R-CHAP-3`: NẾU `strategy.style = documentary` THÌ chỉ `chapter_title_editorial` hoặc `chapter_title_bar`; `in_animation` chỉ `none|fade|fade_up|line_stagger`, `out_animation` chỉ `none|fade`.
- `R-CHAP-4`: luôn truyền **đúng 2 dòng** (số + tên), số chương liên tục và không lặp.
- `R-CHAP-5`: một cấp nhấn mỗi khung; không cùng lúc `title_card`, `lower_third`, `kinetic_text`, `subtitles`.
- Ngân sách: `documentary.md` chưa có dòng cho `chapter_title`; AI tự giữ mỗi chương một lần (`confidence: low`), có thể đặt `strategy.budget.chapter_title` (validate tính khóa này).
- Ưu tiên: Clarity > Style > Decoration.

## 8. Ví dụ
Giả định minh họa: chương 2 của video tổng kết, clip `c05` là cảnh b-roll rộng. 6 từ → hold ≥ 0.8 + 1.8 = 2.6; chọn 3.0.
```json
{
  "id": "d12",
  "technique": "chapter_title",
  "preset": "chapter_title_editorial",
  "anchor": { "clip": "c05", "source_time": 1.0 },
  "start_offset": 0.0,
  "duration": 4.0,
  "parameters": { "lines": ["CHƯƠNG 02", "Dữ liệu và câu chuyện"], "hold": 3.0 },
  "reason": "Đánh dấu đổi chương trên cảnh rộng, chưa có lời thoại",
  "priority": "clarity",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```
`duration` 4.0 = 0.6 + 3.0 + 0.4. Tên chương là minh họa, không phải dữ liệu thật.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Truyền một dòng | Chỉ thấy nhãn nhỏ, không có tên lớn | Luôn hai dòng (`R-CHAP-4`) |
| Thêm dòng thứ 3 | `validate` chặn (tối đa 2 dòng) | Dùng `sub_text` cho dòng phụ |
| Đảo thứ tự dòng | Số chương lớn, tên nhỏ | `lines[0]` là số, `lines[1]` là tên |
| Dùng `bold` ở documentary | validate báo lỗi | `editorial` hoặc `bar` |
| Số chương nhỏ khó đọc | Nhãn nhỏ chìm trên nền sáng | Xem preview; tăng `font_size` hoặc `line_scales[0]` |
| Chồng phụ đề (`bar`) | Hai khối chữ ở dưới trái | Đổi sang `editorial` hoặc dời |
| Làm tối khi người nói đang nói | Khung tối giữa câu | `R-CHAP-2` |

## 10. Kiểm tra sau render
- Số chương và tên chương đọc trọn trong thời gian hiện; dấu tiếng Việt đủ (chữ hoa có dấu của `bold` không đè dòng; `line_height` 1.2 thấp hơn khuyến nghị 1.25).
- Dòng số chương đủ to để đọc ở kích cỡ thật; tỉ lệ số : tên rõ (≥ 1.4×, hiện ~2.6–3.3×).
- Vạch và hộp đều, không sát mép (lề ≥ 5%); không che mặt, không đè phụ đề.
- Cần xem preview: hoạt ảnh `fade_up`, `slide_up`, vào/ra nền tối; cảnh chữ chồng mặt người; 1080p/4K.

**Lưu ý đã gặp trên render thử:** ở `chapter_title_bold` dấu của "KHỞI ĐẦU" (cỡ 160 px) từng chạm vào nhãn "CHƯƠNG 01" ở trên dù `line_height` 1.25; thêm `line_gap` 32 px đã tách hai dòng (đã xem lại trên preview 960×540).
