---
id: comparison_table
name: Comparison Table (Bảng so sánh)
group: typography
roles: [information, comparison]
status: usable
source_of_values: convention
---

# Comparison Table

## 1. Mục đích
Đặt **2–4 cột và vài hàng ngắn** cạnh nhau để người xem so sánh được cách cũ với cách mới, phương án với phương án, trước với sau. Các hàng hiện nối tiếp theo nhịp đọc, một cột có thể được tô nhấn. Thuộc cấp 2 (thông tin) trong `typography/hierarchy.md`.

## 2. Khi nên dùng
- Có **dữ kiện so sánh có nguồn**, mỗi ô là từ khóa hoặc số liệu ngắn (≤ 5 từ), 2–6 tiêu chí (`R-TBL-1`).
- Cần cho thấy khác biệt theo từng tiêu chí, không chỉ một con số.
- Điểm nghỉ của nhịp dựng, trên b-roll hoặc nền làm mờ.

| Tình huống | Chọn |
|---|---|
| So sánh nhiều tiêu chí, 2–4 cột | `comparison_table` |
| Danh sách mục đơn, không so sánh | `bullet_list_reveal` |
| Một con số nổi bật | `big_number` |
| Thanh đầy theo phần trăm | `progress_bar` |

## 3. Khi không nên dùng
- Ô chứa câu dài: **chữ trong ô không xuống dòng thông minh**; validate chặn ô > 5 từ.
- Ít hơn 2 hàng dữ liệu, 1 cột, hoặc hơn 4 cột; hơn 9 dòng; hơn 24 ô (cảnh báo).
- Dữ kiện không có nguồn hoặc không so sánh được (khác đơn vị, khác phạm vi).
- Có lời nói đang đọc đúng nội dung bảng.
- Style documentary với `table_dark` (`forbidden_styles: [documentary]`, validate báo lỗi).

## 4. Thông số
Giá trị là của khối nền; ngoặc là `clean` / `dark`. Cỡ tính cho 1080p.
| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `lines` (nội dung) | – | dòng đầu là tiêu đề cột; ô cách nhau bằng `\|`; 3–9 dòng | – | medium |
| `table` | `false` (preset `true`) | cần `true`; `validate` chặn khi thiếu | – | medium |
| `table_header` | `true` | `false` thì dòng đầu là dữ liệu (cảnh báo) | – | medium |
| `table_highlight_col` | -1 (clean -1; dark 2) | số nguyên 0–(cột−1) hoặc -1 (validate) | chỉ số cột từ 0 | low |
| `table_width` | 0.7 (0.62 / 0.66) | 0.3–0.95 (validate) | tỉ lệ bề ngang khung | low |
| `table_first_col` | 1.3 | không kiểm tra | `fr` (các cột còn lại 1) | low |
| `table_row_padding` | 16 | không kiểm tra | px @1080p (ngang × 1.2) | low |
| `table_bg` | `rgba(15,23,42,0.92)` (clean: `rgba(255,255,255,0.96)`) | màu CSS | – | low |
| `table_header_bg`, `table_header_color` | `#F2C14E`, `#0F172A` (clean: `#0F172A`, `#FFFFFF`) | màu CSS | – | low |
| `table_line_color` | `rgba(255,255,255,0.18)` (clean `rgba(15,23,42,0.14)`) | màu CSS | – | low |
| `table_highlight_bg` | `rgba(242,193,78,0.18)` (clean `…0.35`) | màu CSS | – | low |
| `highlight_color` | `null` (clean `#0F172A`, dark `#FFD84D`) | màu chữ cột nhấn; `null` theo `text_color` | – | low |
| `item_delay` | `null` (preset 0.3); code dự phòng 0.25 | giây; không kiểm tra | giây giữa hai hàng | low |
| `font_size` | 40 (nền 72) | 12–600 (validate) | px @1080p | low |
| `box_radius`, `box_shadow` | 16 / 20; bóng mềm | không kiểm tra | – | low |
| `hold` (nội dung) | xem công thức dưới | ≥ công thức | giây | medium |
Chữ ô: tiêu đề 800, cột đầu 600, ô khác theo `font_weight`; cột đầu căn trái, các cột khác căn giữa. Tiêu đề hiện cùng bảng; hàng dữ liệu thứ i hiện (fade_up) trễ `i × item_delay` sau nửa `in_duration`. `in_animation` áp lên cả bảng.

## 5. Quy trình thực hiện
1. Chọn tiêu chí và nội dung ô từ nguồn; mỗi ô ≤ 5 từ; kiểm tra mục 3.
2. Viết `lines`: dòng đầu tiêu đề cột, các hàng sau cùng số ô; chọn `table_highlight_col` (ví dụ cột "Cách mới").
3. `hold ≥ max(1.0, 0.8 + 0.3 × số_từ)`, số từ tính **bỏ dấu `|`** (cả tiêu đề); cộng thêm thời gian hàng cuối hiện (≈ `0.5 × in_duration + (hàng − 1) × item_delay + 0.7 × in_duration`).
4. Đặt `duration = in_duration + hold + out_duration`.
5. Chạy `validate`, xem preview: các ô không tràn, cột nhấn thấy rõ.

## 6. Biến thể và preset
Đã xem trên preview 960×540 của clip thử (`projects/demo-text-p5`).
| Preset | Mô tả | Documentary |
|---|---|---|
| `table_clean` | Nền trắng, tiêu đề xanh đậm, chữ tối, bóng nhẹ | Được phép |
| `table_dark` | Nền tối, tiêu đề vàng, cột nhấn (cột 2) tô nền vàng nhạt | **Cấm** |
Đã xem: tiêu đề cột đậm, các hàng hiện nối tiếp (`item_delay` 0.3), cột "Cách mới" tô nhấn, đủ ba hàng dữ liệu ở thời điểm cuối. Ở clip thử, `table_clean` nhận `table_highlight_col: 2` từ quyết định (preset để -1).

## 7. Quy tắc quyết định
- `R-TBL-1` (validate): 2–4 cột; ≥ 2 hàng dữ liệu (≥ 3 dòng); ≤ 9 dòng, ≤ 70 từ (đếm cả `|`); mỗi hàng đúng số ô như dòng đầu; không ô trống; mỗi ô ≤ 5 từ; `table_highlight_col` ∈ [0, cột−1] hoặc -1; `table_width` ∈ [0.3, 0.95]; cảnh báo > 24 ô hoặc `table_header: false`; `hold` ≥ `max(1.0, 0.8 + 0.3 × số_từ)`.
- `R-TBL-2`: NẾU style `documentary` THÌ chỉ `table_clean`; `in_animation` chỉ `none|fade|fade_up|line_stagger`, `out_animation` chỉ `none|fade`.
- `R-TBL-3`: NẾU nội dung là so sánh thật THÌ nhấn đúng một cột; không tô nhiều cột.
- `R-TBL-4`: NẾU có lời nói đọc cùng nội dung THÌ rút bảng thành 2–3 hàng.
- Ưu tiên lớp: Clarity (ô ngắn, đọc kịp) > Style > Decoration. `styles/documentary.md` chưa có dòng ngân sách; đề xuất ≤ 1–2 mỗi video 2 phút (low).

## 8. Ví dụ
Clip `c13`, style documentary: so sánh cách cũ và cách mới ba tiêu chí bằng `table_clean`. 21 từ (bỏ `|`) nên `hold ≥ 0.8 + 6.3 = 7.1`, chọn 7.2.
```json
{
  "id": "d07",
  "technique": "comparison_table",
  "preset": "table_clean",
  "anchor": { "clip": "c13", "source_time": 30.5 },
  "start_offset": 0.0,
  "duration": 7.85,
  "parameters": {
    "lines": ["Tiêu chí | Cách cũ | Cách mới", "Thời gian | 3 giờ | 20 phút", "Chi phí | Cao | Thấp", "Độ chính xác | Vừa | Cao"],
    "table_highlight_col": 2,
    "hold": 7.2
  },
  "reason": "So sánh ba tiêu chí giữa hai cách làm, nhấn cột cách mới",
  "priority": "clarity",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```
`duration` 7.85 = 0.35 + 7.2 + 0.3. Nội dung là minh họa.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Ô dài | Validate báo ô > 5 từ; tràn ô | Rút còn từ khóa |
| Số ô lệch hàng | Validate báo hàng thiếu/thừa ô | Kiểm tra dấu `\|` |
| Quên `table: true` | `validate` chặn (cần `table: true`); nếu lọt qua, chữ hiện như đoạn thường | Dùng preset |
| `table_dark` ở documentary | Preset bị cấm | `table_clean` |
| Tô nhiều cột / nhấn sai cột | Mất trọng tâm | Một cột nhấn |
| Hold thiếu | Hàng cuối chưa kịp đọc | Cộng thời gian hiện hàng |

## 10. Kiểm tra sau render
- Tiêu đề cột đậm; các hàng hiện lần lượt; hàng cuối còn đủ thời gian đọc; cột nhấn rõ, chữ đọc được trên nền ô.
- Ô không tràn hoặc bị cắt; cột đầu căn trái, cột khác căn giữa; bảng nằm trong vùng an toàn.
- Cần xem preview (chưa kiểm chứng): hoạt ảnh vào/ra từng kiểu; bảng 4 cột; chữ dài trong ô; 1080p/4K.
