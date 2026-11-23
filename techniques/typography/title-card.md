---
id: title_card
name: Title Card (Tiêu đề lớn giữa màn hình)
group: typography
roles: [emphasis, structure]
status: usable
source_of_values: convention
---

# Title Card

## 1. Mục đích
Đặt một tiêu đề lớn ở giữa màn hình trên nền được **làm tối, làm mờ hoặc phủ màu đặc**, để người xem dừng lại và biết một phần mới bắt đầu hoặc kết thúc. Là chữ **cấp 1** (kèm dòng phụ `sub_text` cấp 2) trong `typography/hierarchy.md`.

## 2. Khi nên dùng
- Mở đầu video (tên chương trình, sự kiện) hoặc kết video (lời khép lại, thông tin cuối).
- Đổi chương hoặc chuyển ý lớn, kèm một khoảng nghỉ của lời thoại hoặc cảnh b-roll rộng.
- Nền video rối hoặc chuyển động mạnh, cần làm tối/mờ để tiêu đề đọc được.

## 3. Khi không nên dùng
- Giữa lúc người nói đang phát biểu quan trọng (nền bị tối/mờ che hình và mặt).
- Chữ nhấn ngắn trên cảnh: dùng `kinetic_text`, `stacked_text`.
- Tên người nói: dùng `lower_third`.
- Quá 3 dòng hoặc quá 10 từ (`validate` chặn).
- Documentary: không dùng `title_card_solid` (cấm); `title_card_clean`, `title_card_blur` (hoạt ảnh `fade`) và `title_card_editorial` dùng được. `validate` chỉ cho `in_animation` là `none`, `fade`, `fade_up` ở documentary.
- Trùng với khối chữ khác hoặc quá thường xuyên: tiêu đề che khung nên chỉ vài lần mỗi video.
- Khác `chapter_title` (đợt 2, **chưa làm**, số chương + tên chương): `title_card` chưa có số chương riêng, chỉ là tiêu đề + dòng phụ.

## 4. Thông số
Mọi khóa kiểu chữ chung xem `typography/text-style-layer.md`. Giá trị dưới đây là của `title_card_clean`, trừ khi ghi khác.

| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `text` / `lines` | – (bắt buộc) | 1–3 dòng, ≤ 10 từ | – | medium |
| `sub_text` | – (tùy chọn) | không giới hạn riêng; tính vào `hold` | – | medium |
| `hold` | công thức | ≥ `max(1.0, 0.8 + 0.3 × số_từ)`, số từ gồm **cả** `sub_text` | giây | medium |
| `font_size` | 124 (`blur` 118, `editorial` 112) | 12–400 | px @1080p | medium |
| `bg_mode` | `dim` | `none`, `dim`, `blur`, `solid` | – | medium |
| `bg_opacity` | 0.5 (`blur` 0.3, `editorial` 0.55) | không kiểm tra; dùng cho `dim` và `blur` | 0–1 | low |
| `bg_rgb` | `"0,0,0"` (thừa kế) | chuỗi `r,g,b` | – | low |
| `blur_px` | 18 (`blur` preset: 22) | không kiểm tra; chỉ dùng khi `bg_mode: blur` | px @1080p | low |
| `bg_color` | `#000000` (`solid`: `#0F172A`) | màu CSS; chỉ dùng khi `solid` | – | low |
| `sub_font_size` / `sub_font_weight` | 40 (editorial 36) / 500 | không kiểm tra | px / – | low |
| `sub_font_family` / `sub_color` | `null` / `null` (editorial: `Inter`) | `null` = theo chữ chính | – | low |
| `sub_gap` | 18 (editorial 22) | không kiểm tra | px @1080p | low |
| `in_animation` / `in_duration` | `fade_up` / 0.55 | enum xem lớp kiểu chữ | – / giây | medium |
| `out_animation` / `out_duration` | `fade` / 0.4 | enum xem lớp kiểu chữ | – / giây | medium |
| `position` / `align` | `center` / `center` | 9 vị trí | – | medium |

Cơ chế (theo `TextBlock.jsx`): lớp nền là `AbsoluteFill` phủ cả khung. `dim` = lớp màu `rgba(bg_rgb, bg_opacity)`; `blur` = lớp đó cộng `backdrop-filter: blur(blur_px)`; `solid` = màu đặc `bg_color` (bỏ qua `bg_opacity`). Độ đục của nền chạy theo đường bao vào/ra riêng (min của tiến độ vào và 1 − tiến độ ra), **không** theo `in_animation` (nên `mask_wipe` chỉ quét chữ, nền vẫn hiện mờ dần). `sub_text` thừa kế `letter_spacing`, `line_height`, `text_transform` và bóng của chữ chính, nhưng bỏ viền, gradient, glow; độ đục 0.9. `validate` không kiểm phông và cỡ của `sub_*`.

## 5. Quy trình thực hiện
1. Xác định điểm mở/kết/đổi chương, chọn khoảng lời thoại thưa. Tiêu đề lấy từ nội dung có nguồn (tên chương trình, sự kiện), không tự bịa.
2. Rút tiêu đề ≤ 3 dòng, ≤ 10 từ; thông tin phụ (ngày, địa điểm) để vào `sub_text`.
3. Tính `hold = max(1.0, 0.8 + 0.3 × tổng_từ)`; tổng từ gồm cả `sub_text`. Có thể giữ lâu hơn nếu cảnh cho phép.
4. Chọn preset theo style (mục 6). Documentary: `title_card_clean` hoặc `title_card_editorial`.
5. Kiểm tra đoạn hình phía dưới không chứa nội dung phải đọc (slide, mặt người nói đang nói).
6. Ghi EDL, `status: proposed`; trường `duration` ghi bằng `in + hold + out` cho khớp.

## 6. Biến thể và preset
Tra `forbidden_styles` trong `presets/typography-presets.json`:

| Preset | Mô tả | Documentary |
|---|---|---|
| `title_card_clean` | Inter 800, nền làm tối 0.5, `fade_up`, bóng mềm | **Được**; mặc định |
| `title_card_editorial` | Playfair Display 700, dòng phụ Inter, nền tối 0.55, `fade` 0.8 s | **Được** (cần serif; `confidence: low`) |
| `title_card_blur` | Nền làm mờ 22 px, hoạt ảnh vào `fade` | Được phép, tiết chế |
| `title_card_solid` | Nền xanh đen đặc, quét `mask_wipe` | **Cấm** |

Đã xem trên preview 960×540 của clip thử: làm tối nền, làm mờ nền, serif Playfair, nền xanh đen đặc; dòng phụ hiển thị nhỏ hơn. Hoạt ảnh vào/ra chưa xem: cần xem preview. Lưu ý `in_duration` 0.55–0.8 s dài hơn dải 0.2–0.35 s của documentary vì khối lớn; chấp nhận cho tiêu đề, nhưng chưa kiểm chứng.

## 7. Quy tắc quyết định
- `R-TC-1`: tối đa 3 dòng, 10 từ; `hold ≥ max(1.0, 0.8 + 0.3 × số_từ)` tính cả `sub_text` (`validate` chặn).
- `R-TC-2`: chỉ đặt ở mở đầu, kết hoặc đổi chương; không đè lên đoạn người nói đang nói thông điệp chính.
- `R-TC-3`: NẾU `strategy.style = documentary` THÌ chỉ `title_card_clean`, `title_card_blur`, `title_card_editorial`; tránh `mask_wipe` và `solid`; `validate` chặn `in_animation` ngoài `none|fade|fade_up`.
- `R-TC-4`: một cấp nhấn mỗi khung: không đặt cùng lúc `kinetic_text`, `stacked_text`, `lower_third`.
- `R-TC-5`: chênh cỡ chữ chính/`sub_text` ≥ 1.4× (hiện 3.1×).
- `R-TXT-3`: chữ trong lề an toàn ≥ 5%; do nền phủ cả khung nên mặt bị tối/mờ: chỉ dùng khi mặt không phải trọng tâm lúc đó.
- Ngân sách: code chưa đếm `title_card` vào `strategy.budget`; AI tự giữ ≤ 2–3 lần mỗi video 2 phút (ước lượng, `confidence: low`).

## 8. Ví dụ
Giả định minh họa: mở đầu video tổng kết lễ khai giảng, clip `c01` là cảnh rộng sân trường.

```json
{
  "id": "d01",
  "technique": "title_card",
  "preset": "title_card_clean",
  "anchor": { "clip": "c01", "source_time": 0.5 },
  "start_offset": 0.0,
  "duration": 4.75,
  "parameters": { "text": "Lễ khai giảng", "sub_text": "Khóa Phân tích Dữ liệu đầu tiên" },
  "reason": "Mở đầu video: nêu sự kiện trên cảnh rộng, chưa có lời thoại",
  "priority": "clarity",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```
`text` 3 từ + `sub_text` 7 từ = 10 từ. Không có `hold` nên renderer dùng công thức `0.8 + 0.3 × 10 = 3.8 s`; tổng = 0.55 + 3.8 + 0.4 = 4.75 s, ghi vào `duration` cho khớp (renderer không dùng `duration` của quyết định cho khối chữ). Muốn lâu hơn thì thêm `hold`, không bao giờ thấp hơn công thức.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| `hold` không tính `sub_text` | `validate` báo `hold` nhỏ hơn mức tối thiểu | Đếm cả `sub_text` |
| Dùng `solid`/`mask_wipe` ở documentary | Lỗi `validate` hoặc cảm giác lòe loẹt | `title_card_clean` |
| Tiêu đề quá dài | >3 dòng hoặc >10 từ | Chuyển ý phụ sang `sub_text` hoặc bỏ |
| Che đoạn người nói | Hình bị tối/mờ khi có lời | Dời sang chỗ thưa lời |
| Lạm dụng | Nhiều title card trong video ngắn | Giữ ở mở/kết/đổi chương |
| Nhầm `bg_opacity` ở `solid` | Đổi mà không thấy khác | `solid` bỏ qua `bg_opacity` |

## 10. Kiểm tra sau render
- Tiêu đề và `sub_text` đọc trọn trong thời gian hiện; `sub_text` nhỏ hơn rõ, vẫn đọc được.
- Nền làm tối/mờ đủ để tách chữ nhưng không đen kịt; vào/ra nền mượt (chưa xem: cần xem preview).
- Chữ nằm giữa, không sát mép; dấu tiếng Việt đúng.
- Chưa kiểm ở 1080p/4K; `backdrop-filter` mờ có thể khác ở độ phân giải khác: cần xem preview.
