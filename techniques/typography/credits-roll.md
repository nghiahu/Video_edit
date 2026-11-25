---
id: credits_roll
name: Credits Roll (Cuộn tên cuối phim)
group: typography
roles: [information, closing]
status: usable
source_of_values: convention
---

# Credits Roll

## 1. Mục đích
Cuộn danh sách tên (đề mục, vai trò, người thực hiện, lời cảm ơn) **từ đáy lên hết đỉnh khung** ở cuối video, ghi nhận người đóng góp. Thuộc cấp 3 (chữ phụ, đọc lướt) trong `typography/hierarchy.md`; không phải điểm nhấn.

## 2. Khi nên dùng
- Cuối video hoặc cuối chương trình, có danh sách người/đơn vị cần ghi nhận (`R-CRED-1`).
- Danh sách có cấu trúc: vài nhóm, mỗi nhóm có đề mục và các dòng "Vai trò | Tên" hoặc tên đơn.
- Muốn kết có nhịp chậm trên nền mờ tối (`credits_clean`) hoặc nền đen đặc kiểu điện ảnh (`credits_cinema`).

| Tình huống | Chọn |
|---|---|
| Danh sách dài cuộn tự động | `credits_roll` |
| Vài mục hiện nối tiếp, đọc có chủ ý | `bullet_list_reveal` |
| Tên + chức danh người nói | `lower_third` |
| Tiêu đề kết (một câu) | `title_card` |

## 3. Khi không nên dùng
- Danh sách rỗng hoặc chỉ một-hai tên: dùng `title_card` hoặc `lower_third`.
- Quá **40 dòng hoặc 160 từ** (validate báo lỗi): tách khối hoặc rút gọn.
- Tốc độ quá nhanh để đọc tên (> 2.5 dòng/giây, cảnh báo).
- Cần đọc kỹ từng mục: cuộn tự động không dừng, dùng `bullet_list_reveal`.
- Giữa nội dung chính: kỹ thuật này dành cho phần kết.
- Danh sách tên có dấu phức tạp ở 1080p/4K hoặc rất dài: **chưa kiểm chứng**, cần xem preview.

## 4. Thông số
Giá trị là của khối nền; ngoặc là `clean` / `cinema`. Cỡ tính cho 1080p.
| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `credits` | `false` (preset `true`) | bắt buộc `true` (validate) | – | medium |
| `lines` (nội dung) | – | ≤ 40 dòng, ≤ 160 từ (kể cả `##` và `\|`) | – | medium |
| `roll_speed` | 90 (90 / 70) | 30–400 (validate) | px/giây @1080p | low |
| `credits_width` | 0.6 (0.6 / 0.62) | 0.3–1 (validate) | tỉ lệ bề ngang khung | low |
| `credits_group_gap` | 1.2 (1.2 / 1.6) | không kiểm tra | × cỡ chữ, trước đề mục (trừ dòng đầu) | low |
| `credits_heading_color` | `#F2C14E` (cinema `#E9D8A6`) | màu CSS | – | low |
| `credits_heading_weight` | 600 | không kiểm tra | – | low |
| `font_family` / `font_weight` | Inter 500 / Playfair Display 500 | vai trò `heading`/`emphasis`/`subtitle`/`body` | – | low |
| `font_size` | 48 / 56 (nền 72) | 12–600 (validate) | px @1080p | low |
| `line_height` | 1.5 / 1.55 (nền 1.15; code dự phòng 1.3) | không kiểm tra | – | low |
| `bg_mode`, `bg_opacity`, `bg_color` | `dim` 0.55 / `solid` `#05070C` | `none`/`dim`/`blur`/`solid` | – | low |
| `in_animation` / `out_animation` | `none` (0.2) / `none` (0.2) | chỉ ảnh hưởng độ mờ | – | low |
| `hold` (nội dung) | xem công thức dưới | bắt buộc ghi, theo thời gian cuộn | giây | medium |
Định dạng dòng: `## Tên nhóm` là đề mục (cỡ 0.55×, HOA, giãn chữ 0.18 em, màu đề mục, căn giữa); dòng có `|` chia hai cột (vai trò căn phải, mờ 70%, tên căn trái); dòng khác căn giữa. Nội dung bắt đầu ở mép dưới khung lúc t = 0, trôi lên với `roll_speed`, mờ dần ở 12% trên và dưới. Cuộn **bỏ qua** hộp, bullet, icon, `sub_text`.

## 5. Quy trình thực hiện
1. Gom danh sách thành nhóm; viết `##` đề mục, "Vai trò | Tên" và tên đơn; kiểm tra mục 3.
2. Ước chiều cao nội dung `H` (giống validate): mỗi dòng thường `font_size × line_height`; mỗi đề mục `0.55 × font_size × line_height + credits_group_gap × font_size` (dòng đầu không cộng khoảng cách nhóm).
3. Thời gian trôi hết `T = (1080 + H) / roll_speed`; đặt `in_duration + hold + out_duration` trong khoảng `[T − 0.3, T + 1.5]`.
4. Chọn `roll_speed` sao cho `roll_speed / (font_size × line_height) ≤ 2.5` dòng/giây (khuyến nghị ≤ 1.5 cho tên có dấu).
5. Chạy `validate`, xem preview: tên đọc kịp, dấu tiếng Việt đủ, nội dung trôi hết khi khối kết thúc.

## 6. Biến thể và preset
Đã xem trên preview 960×540 của clip thử (`projects/demo-text-p5`).
| Preset | Mô tả | Documentary |
|---|---|---|
| `credits_clean` | Inter nhỏ trôi từ đáy, nền tối nhẹ, đề mục vàng | Được phép |
| `credits_cinema` | Playfair trên nền đen đặc, chậm hơn, đề mục tách xa | Được phép |
Đã xem: `credits_clean` có đề mục vàng "SẢN XUẤT"/"CẢM ƠN", dòng "Vai trò | Tên" chia hai cột, mờ ở mép; `credits_cinema` trôi chậm hơn. `credits_cinema` che hoàn toàn footage: chỉ dùng ở thẻ kết.

## 7. Quy tắc quyết định
- `R-CRED-1` (validate): `credits: true`; ≤ 40 dòng, ≤ 160 từ; `roll_speed` ∈ [30, 400]; `credits_width` ∈ [0.3, 1]; `font_size` ∈ [12, 600]; **lỗi** nếu `in + hold + out + 0.3 < (1080 + H) / roll_speed`; **cảnh báo** nếu `in + hold + out − T > 1.5` s (màn hình trống) hoặc `roll_speed / (font_size × line_height) > 2.5` dòng/giây.
- `R-CRED-2`: NẾU style `documentary` THÌ cả hai preset được phép; `in_animation` chỉ `none|fade|fade_up|line_stagger`, `out_animation` chỉ `none|fade`.
- `R-CRED-3`: công thức `hold` theo số từ bị bỏ qua; `hold` phải ghi rõ (thiếu thì `hold` mặc định = mức tối thiểu và thường báo lỗi cuộn).
- `R-CRED-4`: tên, vai trò, lời cảm ơn lấy từ nguồn xác nhận; không bịa tên (ví dụ dùng "Tên minh họa").
- Ưu tiên lớp: Clarity (đọc kịp, không thiếu tên) > Style > Decoration. Tối đa một khối mỗi video, ở phần kết.

## 8. Ví dụ
Clip `c06`, style documentary: cuộn nhóm "Sản xuất" và "Cảm ơn" bằng `credits_clean`, `roll_speed` 90. `H` = 39.6 + 3 × 72 + 97.2 + 3 × 72 = 568.8 px; `T = (1080 + 568.8)/90 ≈ 18.3` s; chọn `hold` 18.0.
```json
{
  "id": "d05",
  "technique": "credits_roll",
  "preset": "credits_clean",
  "anchor": { "clip": "c06", "source_time": 34.1 },
  "start_offset": 0.0,
  "duration": 18.4,
  "parameters": {
    "lines": ["## Sản xuất", "Đạo diễn | Tên minh họa", "Quay phim | Tên minh họa", "Dựng phim | Tên minh họa",
              "## Cảm ơn", "Học viên khóa 38", "Đội ngũ Rikkei Education", "Tất cả khách mời"],
    "roll_speed": 90,
    "hold": 18.0
  },
  "reason": "Ghi nhận người thực hiện ở phần kết, cuộn chậm để đọc kịp tên",
  "priority": "clarity",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```
`duration` 18.4 = 0.2 + 18.0 + 0.2. Clip thử dùng `roll_speed` 130 với `hold` 12.5. Tên là minh họa.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Khối ngắn hơn thời gian trôi | Validate báo lỗi "cuộn … cần ~… s" | Tăng `hold` hoặc `roll_speed` |
| Khối dài hơn nhiều | Màn hình trống cuối; cảnh báo > 1.5 s | Giảm `hold` |
| Quá nhanh | Cảnh báo > 2.5 dòng/giây; không đọc kịp tên | Giảm `roll_speed` hoặc rút dòng |
| Quên `credits: true` | Chữ hiện như đoạn thường; validate báo lỗi | Dùng preset |
| Dòng "Vai trò \| Tên" thiếu `\|` | Căn giữa thay vì hai cột | Kiểm tra dấu `\|` |
| Mong hộp/bullet/icon | Cuộn bỏ qua | Dùng kỹ thuật khác |

## 10. Kiểm tra sau render
- Nội dung vào từ đáy, trôi liên tục, dòng cuối ra hết trước khi khối kết thúc; không đứng khoảng trống dài.
- Đề mục vàng hoa, hai cột thẳng hàng; chữ có dấu không đè nhau; mờ mép trên/dưới đều.
- Cần xem preview (chưa kiểm chứng): hoạt ảnh vào/ra; danh sách rất dài; tên dấu phức tạp ở 1080p/4K; nền `solid` che hết footage đúng ý.
