---
id: location_tag
name: Location Tag (Nhãn địa điểm / ngày giờ)
group: typography
roles: [identification, information]
status: usable
source_of_values: convention
---

# Location Tag

## 1. Mục đích
Gắn một **nhãn địa điểm hoặc ngày giờ** ngắn, có biểu tượng nhỏ đứng trước chữ, để người xem biết "đây là đâu / lúc nào" ngay khi cảnh bắt đầu. Thuộc cấp 2 (thông tin) trong `typography/hierarchy.md`.

## 2. Khi nên dùng
- Mở cảnh mới ở một địa điểm khác, hoặc nhảy thời gian (`cross_dissolve` trôi thời gian) và cần cho người xem định vị.
- Địa điểm hoặc ngày giờ **đã xác nhận** từ lời thoại, tên file, metadata, hoặc người dùng cung cấp. Tối đa 6 từ, đúng 1 dòng (`R-LOC-1`).
- Cần nhãn lặp lại cùng diện mạo ở nhiều cảnh (một preset cho cả video).

| Tình huống | Chọn |
|---|---|
| Địa điểm / ngày giờ, có biểu tượng | `location_tag` |
| Nhãn chủ đề hoặc từ khóa, không biểu tượng | `text_pill` |
| Tên và chức danh người nói | `lower_third` |

## 3. Khi không nên dùng
- Địa điểm, ngày giờ chưa chắc chắn: **không đoán**, không suy từ cảnh quay (`R-LOC-2`).
- Nhãn dài hơn 6 từ hoặc cần xuống dòng (validate báo lỗi).
- Góc đặt nhãn có logo, chữ trên hình, hoặc mặt người (`R-TXT-3`).
- Cùng khung đang có `lower_third` hoặc khối chữ nhấn khác (một cấp nhấn mỗi khung).
- Gắn nhãn ở mọi cảnh: nhãn lặp liên tục thành nhiễu.

## 4. Thông số
Khối nền `_text_style_base`; giá trị là của `location_tag_pin` trừ khi ghi khác. Cỡ chữ tính cho 1080p.

| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `text` | – | 1–6 từ, 1 dòng | – | medium |
| `hold` (nội dung) | `0.8 + 0.3 × số_từ`, ≥ 1.0 | ≥ công thức | giây | medium |
| `icon` | `pin` (`date`: `calendar`, `clock`: `clock`) | `none`, `pin`, `clock`, `calendar`, `user`, `star`, `check` (enum) | – | medium |
| `icon_color` | `#F2C14E` | CSS color; `null` thì theo `text_color` | – | low |
| `font_size` | 40 | 12–600 (validate) | px @1080p | medium |
| `font_weight` / `font_family` | 600 / Inter | phông trong registry, vai trò `emphasis`/`accent`/`subtitle` | – | medium |
| `box_style` | `pill` | nên giữ `pill` | – | medium |
| `box_color` | `rgba(15,18,30,0.78)` | CSS color | – | low |
| `box_padding_x` / `box_padding_y` | 30 / 14 | 0–120 / 0–80 (validate) | px @1080p | low |
| `position` / `margin` | `top_left` (`clock`: `top_right`) / 5 | 9 vị trí / % khung | – / % | medium |
| `in_animation` / `in_duration` | `fade_up` / 0.3 | enum (mục 3 của `text-style-layer.md`) | – / giây | low |
| `out_animation` / `out_duration` | `fade` / 0.2 | enum | – / giây | low |

Giới hạn thật của hiện thực: biểu tượng là SVG 24×24 (nét Material), cỡ = 0.95 × cỡ chữ, chỉ vẽ ở **dòng đầu**, nằm bên trái chữ cách 0.4 em; không có khóa riêng cho cỡ biểu tượng. Đã xem biểu tượng `pin`, `calendar`, `clock`; **`user` và `star` chưa xem** (cần xem preview); `check` chưa xem riêng. `validate` chỉ **cảnh báo** khi `icon` là `none`.

## 5. Quy trình thực hiện
1. Xác định thông tin cần gắn và **nguồn** của nó; không có nguồn thì bỏ kỹ thuật này.
2. Viết nhãn gọn: "Hà Nội", "Phòng B2, tầng 3", "12/09/2025", giữ nguyên chính tả và dấu. Ngày giờ giữ định dạng người dùng cung cấp.
3. Chọn preset theo loại: địa điểm → `pin`, ngày → `date`, giờ → `clock` (mục 6); đổi `icon` nếu cần, một biểu tượng khớp nghĩa.
4. Đặt `position` ở góc không có mặt, logo, chữ trên hình; thường trùng góc nhãn trước để người xem quen chỗ nhìn.
5. `hold = max(1.0, 0.8 + 0.3 × số_từ)`; `duration = in_duration + hold + out_duration`.
6. Chạy `validate`, rồi xem preview.

## 6. Biến thể và preset
Đã xem trên preview 960×540 của clip thử (khung giữa lúc chữ hiện đủ): con nhộng tối có biểu tượng ghim, lịch, đồng hồ, nhận ra được. Cả ba có `forbidden_styles: []`.
| Preset | Mô tả | Documentary |
|---|---|---|
| `location_tag_pin` | Biểu tượng ghim vàng, góc trên trái, `fade_up` | Được phép, ở mức tiết chế |
| `location_tag_date` | Biểu tượng lịch, góc trên trái, `fade_up` | Được phép, ở mức tiết chế |
| `location_tag_clock` | Biểu tượng đồng hồ, góc trên phải, `fade_up` | Được phép, ở mức tiết chế |

`styles/documentary.md` chưa có dòng ngân sách cho `location_tag`: nên coi như `text_pill` (không quá 3 nhãn mỗi video ~2 phút). Hoạt ảnh vào ở documentary chỉ `none|fade|fade_up|line_stagger`, ra chỉ `none|fade` (đều thỏa với preset).

## 7. Quy tắc quyết định
- `R-LOC-1` (validate): `text` ≤ 6 từ, 1 dòng; `hold` ≥ `max(1.0, 0.8 + 0.3 × số_từ)`; enum (`icon`, `position`, `box_style`...) hợp lệ; phông trong registry có vai trò `emphasis`, `accent` hoặc `subtitle`; cảnh báo nếu `icon` là `none`.
- `R-LOC-2`: NẾU địa điểm hoặc ngày giờ chưa được xác nhận THÌ không dùng `location_tag` (cũng không điền "ước đoán").
- `R-LOC-3`: NẾU style `documentary` THÌ dùng tiết chế (mỗi cảnh mới tối đa một nhãn) và giữ `fade_up`/`fade`.
- `R-LOC-4`: NẾU cần tên + chức danh THÌ dùng `lower_third`; NẾU nhãn chỉ là chủ đề THÌ dùng `text_pill`.
- `R-TXT-3`: không che mặt, trong vùng an toàn (`core/composition.md`). Ưu tiên lớp: Clarity > Style > Decoration.

## 8. Ví dụ
Clip `c05` mở ở một địa điểm; người dùng đã cho biết tên. Style documentary, preset `location_tag_pin`. 4 từ → hold ≥ 0.8 + 1.2 = 2.0; chọn 2.5.
```json
{
  "id": "d14",
  "technique": "location_tag",
  "preset": "location_tag_pin",
  "anchor": { "clip": "c05", "source_time": 0.5 },
  "start_offset": 0.0,
  "duration": 3.0,
  "parameters": { "text": "Hội trường Tên minh họa", "hold": 2.5 },
  "reason": "Định vị cảnh mở đầu; địa điểm do người dùng xác nhận",
  "priority": "clarity",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```
`duration` 3.0 = 0.3 + 2.5 + 0.2. Tên địa điểm là minh họa, không phải dữ liệu thật.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Đoán địa điểm / ngày | Nhãn không có nguồn | `R-LOC-2` |
| Nhãn quá dài | > 6 từ, validate lỗi | Rút còn tên địa điểm |
| Biểu tượng sai nghĩa | Ghim cho ngày, lịch cho nơi chốn | Chọn đúng preset / `icon` |
| Lẫn với `text_pill` | Nhãn chủ đề mà có ghim | Dùng `text_pill` |
| Gắn nhãn ở mọi cảnh | Nhãn nối nhau liên tục | Chỉ cảnh đổi địa điểm / thời gian |
| Dùng `user`, `star` không xem | Hình lạ, lệch hàng | Xem preview trước |

## 10. Kiểm tra sau render
- Nhãn đọc trọn; dấu tiếng Việt đủ; con nhộng đệm đều, chữ không tràn.
- Biểu tượng nhận ra được, cùng hàng với chữ, màu tương phản với nền con nhộng.
- Không che mặt, không chạm mép (lề ≥ 5%), không đè logo hay chữ trên hình.
- Cần xem preview: hoạt ảnh vào/ra, biểu tượng `user`/`star`/`check`, cảnh có người ở góc, 1080p/4K.
