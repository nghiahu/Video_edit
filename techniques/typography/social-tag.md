---
id: social_tag
name: Social Tag (Tag @tên / #chủ_đề)
group: typography
roles: [identification, information]
status: usable
source_of_values: convention
---

# Social Tag

## 1. Mục đích
Gắn một **tài khoản `@tên`** hoặc **hashtag `#chủ_đề`** trong con nhộng ngắn, để người xem biết nên theo dõi ai hoặc video thuộc chủ đề nào. Thuộc cấp 2 (thông tin) trong `typography/hierarchy.md`.

## 2. Khi nên dùng
- Có tài khoản hoặc hashtag **thật và đã xác nhận** (người dùng cung cấp, có trong lời thoại hoặc metadata): không bịa, không đoán tên tài khoản.
- Video cho mạng xã hội, vlog, giới thiệu kênh; tối đa 3 từ, 1 dòng (`R-SOC-1`).
- Tag hiện ngắn, ở góc ít vướng, thường một lần ở đầu hoặc cuối đoạn.

| Tình huống | Chọn |
|---|---|
| `@tài_khoản` hoặc `#chủ_đề` | `social_tag` |
| Nhãn chủ đề thường, không `@`/`#` | `text_pill` |
| Tên người và chức danh | `lower_third` |

## 3. Khi không nên dùng
- Style `documentary`: cả hai preset có `forbidden_styles: ["documentary"]` (validate báo lỗi).
- Tài khoản, hashtag **chưa xác nhận** hoặc suy đoán (`R-SOC-2`).
- Cần logo hoặc biểu tượng nền tảng (Facebook, TikTok...): thư viện **không có** logo thương hiệu nền tảng, không tạo hay giả lập logo (`R-SOC-3`).
- Chữ không bắt đầu bằng `@` hoặc `#` (validate cảnh báo): đúng ra không phải social tag.
- Dài hơn 3 từ hoặc nhiều dòng; góc đặt có mặt, logo, chữ trên hình (`R-TXT-3`).

## 4. Thông số
Khối nền `_text_style_base`; giá trị là của `social_tag_at` trừ khi ghi khác. Cỡ chữ tính cho 1080p.

| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `text` | – | 1–3 từ, 1 dòng, nên bắt đầu `@`/`#` | – | medium |
| `hold` (nội dung) | `0.8 + 0.3 × số_từ`, ≥ 1.0 | ≥ công thức (1 từ: 1.1 s) | giây | medium |
| `font_family` / `font_weight` | Inter / 700 (`hash`: 800) | vai trò `emphasis`/`accent`/`subtitle` | – | medium |
| `font_size` | 44 | 12–600 (validate); Inter ≥ 40 | px @1080p | medium |
| `text_color` | `#FFFFFF` (`hash`: `#1A1020`) | CSS color | – | low |
| `box_style` | `pill` | nên giữ `pill` | – | medium |
| `box_color` | `#111827` (`hash`: `linear-gradient(90deg,#FF8FB7,#FFD93D)`) | chuỗi CSS nền | – | low |
| `box_padding_x` / `box_padding_y` | 34 / 14 (`hash` 36 / 14) | 0–120 / 0–80 (validate) | px @1080p | low |
| `position` / `margin` | `lower_left` / 6 | 9 vị trí / % | – / % | medium |
| `in_animation` | `slide_right` (`hash`: `pop`) | enum | – | low |
| `out_animation` | `slide_right` (`hash`: `fade` mặc định) | enum | – | low |
| `in_duration` | 0.4 | không kiểm tra | giây | low |

Hiện thực: không có khóa riêng cho `@` hay `#`: chỉ là chữ trong `text`. `box_color` dạng gradient CSS được dùng làm `background` (đã xem hiển thị đúng); dùng biểu tượng (`icon`) cho social tag **không** có ý nghĩa (mặc định `none`). Chữ `#chủ_đề` dùng gạch dưới thay dấu cách để đếm là 1 từ.

## 5. Quy trình thực hiện
1. Lấy tài khoản/hashtag từ nguồn xác nhận; giữ nguyên chính tả, hoa thường, dấu gạch dưới.
2. Kiểm tra style (documentary → bỏ) và mục 3.
3. Chọn preset (mục 6): `@` → `social_tag_at`, `#` → `social_tag_hash`.
4. Đặt `position` ở góc không bận; mặc định `lower_left` dễ trùng phụ đề/`lower_third`, nên cân nhắc `top_left`/`top_right`.
5. `hold = max(1.0, 0.8 + 0.3 × số_từ)`; `duration = in_duration + hold + out_duration`.
6. `validate`, rồi xem preview.

## 6. Biến thể và preset
Đã xem trên preview 960×540 của clip thử (khung giữa lúc chữ hiện đủ): con nhộng đen `@tên`, con nhộng gradient hồng-vàng `#tag`.
| Preset | Mô tả | Documentary |
|---|---|---|
| `social_tag_at` | Con nhộng đen `#111827`, chữ trắng đậm, trượt từ trái vào | **Cấm** |
| `social_tag_hash` | Con nhộng gradient hồng-vàng, chữ đen đậm, `pop` | **Cấm** |

Vì cả hai bị cấm, style documentary không có tag mạng xã hội; muốn nêu tài khoản thì dùng `text_pill_clean` hoặc `lower_third` (nếu là tên người). Hoạt ảnh `slide_right` và `pop` cũng ngoài danh sách của documentary.

## 7. Quy tắc quyết định
- `R-SOC-1` (validate): `text` ≤ 3 từ, 1 dòng; `hold` ≥ công thức; enum hợp lệ; phông vai trò `emphasis`/`accent`/`subtitle`; **cảnh báo** nếu `text` không bắt đầu bằng `@` hoặc `#`.
- `R-SOC-2`: chỉ dùng tài khoản/hashtag **thật và đã xác nhận**; không bịa, không đoán.
- `R-SOC-3`: không dùng logo hoặc thương hiệu nền tảng; chỉ chữ.
- `R-SOC-4` (validate qua `forbidden_styles`): NẾU style `documentary` THÌ không dùng.
- `R-TXT-3`: không che mặt, không đè phụ đề; một cấp nhấn mỗi khung. Ưu tiên lớp: Clarity > Style > Decoration.

## 8. Ví dụ
Vlog, clip `c09`, người dùng cho biết tài khoản. Style vlog vui, dùng `social_tag_at`. 1 từ → hold ≥ 1.1; chọn 2.0; đặt góc trên phải để khỏi vướng phụ đề.
```json
{
  "id": "d50",
  "technique": "social_tag",
  "preset": "social_tag_at",
  "anchor": { "clip": "c09", "source_time": 1.0 },
  "start_offset": 0.0,
  "duration": 2.6,
  "parameters": { "text": "@ten_minh_hoa", "position": "top_right", "hold": 2.0 },
  "reason": "Nêu tài khoản đã được người dùng xác nhận ở đầu đoạn",
  "priority": "style",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```
`duration` 2.6 = 0.4 + 2.0 + 0.2. Tên tài khoản là minh họa, không phải tài khoản thật.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Bịa tài khoản/hashtag | Không có nguồn | `R-SOC-2` |
| Thiếu `@`/`#` | validate cảnh báo | Thêm ký tự đúng hoặc dùng `text_pill` |
| Dùng logo nền tảng | Yêu cầu biểu tượng thương hiệu | Chỉ chữ; không có logo trong thư viện |
| Dùng ở documentary | validate lỗi | `text_pill_clean` |
| Đè phụ đề | `lower_left` trùng vùng phụ đề | Đổi `position` |
| Hiện quá lâu / lặp | Tag ở mọi cảnh | Một hai lần mỗi video |

## 10. Kiểm tra sau render
- Chữ đọc rõ, `@`/`#`/gạch dưới hiện đủ; chữ đen trên gradient đủ tương phản.
- Con nhộng đệm đều, không tràn; gradient đúng hướng.
- Không che mặt, không đè phụ đề, lề ≥ 5%.
- Cần xem preview: hoạt ảnh `slide_right`/`pop` vào và ra, chữ dài hơn, 1080p/4K.
