---
id: stacked_text
name: Stacked Text (Chữ xếp chồng nhiều dòng)
group: typography
roles: [emphasis, information]
status: usable
source_of_values: convention
---

# Stacked Text

## 1. Mục đích
Đặt 2–4 dòng chữ chồng lên nhau với **cỡ khác nhau** để người xem đọc theo thứ tự: một dòng chính (cấp 1) và một dòng bổ nghĩa nhỏ hơn (cấp 2), trong **một** khối chữ. Các bố cục: nhỏ trên-lớn dưới, lớn trên-nhỏ dưới, so le, xếp ngăn căn đều.

## 2. Khi nên dùng
- Một ý có **hai tầng** rõ: nhãn + nội dung ("Khóa đầu tiên" / "Phân tích Dữ liệu"), hoặc dữ kiện + chú thích.
- Cần chữ lớn, có bố cục, không phải một dòng ngang (`kinetic_text`) và không phải tiêu đề cả màn hình (`title_card`).
- Khung có khoảng trống rộng (nền tường, trời, sân) để đặt khối nhiều dòng mà không che mặt.

## 3. Khi không nên dùng
- Chỉ một dòng ngắn: dùng `kinetic_text` hoặc `text_pill`.
- Cần nhận diện người nói: dùng `lower_third` (chữ cấp 2, một thanh tên).
- Cần tiêu đề mở/kết hoặc đổi chương che cả khung: dùng `title_card`.
- Quá 4 dòng hoặc quá 10 từ (`validate` chặn): đó là phụ đề, không phải chữ nhấn.
- Documentary: không dùng `stacked_staggered`, `stacked_justified` (bị cấm, xem mục 6).
- Trùng thời điểm với `kinetic_text`, `lower_third` hoặc khối chữ khác (một cấp nhấn mỗi khung, `typography/hierarchy.md`).
- Vị trí khối đè lên mặt, miệng, tay đang chỉ.

## 4. Thông số
Nội dung: `lines` (mảng chuỗi hoặc `{text, scale, weight, color}`) hoặc `text` có `\n`. Mọi khóa kiểu chữ khác xem `typography/text-style-layer.md`.

| Tham số | Mặc định (theo preset) | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `lines` / `text` | – (bắt buộc) | 1–4 dòng, tổng ≤ 10 từ (do `validate` kiểm) | – | medium |
| `line_scales` | `[0.42,1]` hoặc `[1,0.42]` (`stacked_small_*`); `[]` ở hai preset còn lại | hệ số theo thứ tự dòng, > 0; không có kiểm tra khoảng | × `font_size` | low |
| `line_offsets_em` | `[]`; `[0,1.3]` ở `stacked_staggered` | số theo thứ tự dòng, thụt trái bằng `padding-left` | em | low |
| `justify` | `false`; `true` ở `stacked_justified` | true/false | – | low |
| `font_size` | 104 / 96 / 120 | 12–400 (do `validate` kiểm) | px @1080p | medium |
| `line_height` | 1.15 (nhỏ-trên, nhỏ-dưới, so le) / 1.25 (`stacked_justified`) | ≥ 1.15; `validate` cảnh báo nếu thấp hơn với chữ hoa có dấu | – | medium |
| `in_animation` | `fade_up` (`stacked_small_top`, `stacked_small_bottom`, được phép ở documentary); `line_stagger` (`stacked_staggered`, `stacked_justified`) | xem `text-style-layer.md` | – | medium |
| `in_duration` | 0.5 / 0.55 / 0.6 | không kiểm tra | giây | low |
| `stagger` | 1 (thừa kế) | hệ số nhân độ trễ giữa các dòng; không kiểm tra | – | low |
| `hold` (nội dung) | theo công thức | ≥ `max(1.0, 0.8 + 0.3 × số_từ)` | giây | medium |
| `position` / `align` / `margin` | `lower_left` / `left` / 7 (hai preset đầu); `center` (hai preset sau) | xem lớp kiểu chữ | – | medium |

Cơ chế (theo `TextBlock.jsx`): cỡ dòng i = `font_size × scale_i`, với thứ tự ưu tiên `scale` riêng của dòng, rồi `justify`, rồi `line_scales[i]`, rồi 1. **`justify` chỉ ước lượng theo số ký tự**: `scale_i = trung_bình_ký_tự / ký_tự_dòng_i`, kẹp trong 0.55–2.2. Không đo độ rộng thật, nên các dòng chỉ gần bằng nhau (đã xem trên preview 960×540 của clip thử: các dòng không bằng nhau chính xác). Dòng ngắn nhiều chữ hẹp (ví dụ "I") hoặc phông có độ rộng ký tự khác nhau sẽ lệch rõ hơn.
`line_stagger`: dòng i hiện trễ `i × 6 × stagger` frame, mỗi dòng chạy kiểu `fade_up` trong `0.7 × in_duration`. Độ trễ tính theo frame, không theo giây.

## 5. Quy trình thực hiện
1. Từ lời thoại hoặc slide, tách ý thành **dòng chính** (cấp 1, 1–4 từ) và **dòng phụ** (cấp 2). Giữ nguyên chính xác số, tên.
2. Chọn bố cục theo style (mục 6). Documentary: chỉ `stacked_small_top` hoặc `stacked_small_bottom`.
3. Đếm từ và dòng (≤ 4 dòng, ≤ 10 từ). Tính `hold ≥ 0.8 + 0.3 × số_từ`, ≥ 1.0 s.
4. Chọn `position` không che mặt (`core/composition.md`); khối nằm trong lề ≥ 5%.
5. Kiểm tra cỡ dòng nhỏ sau nhân hệ số ≥ `min_size_px_1080p` của phông (Inter: 40). Với `font_size` 104 và hệ số 0.42, dòng nhỏ ≈ 44 px: sát ngưỡng.
6. Ghi quyết định EDL với `status: proposed`, `reason`, `priority: clarity` hoặc `style`.

## 6. Biến thể và preset
Tra `forbidden_styles` trong `presets/typography-presets.json`:

| Preset | Mô tả | Documentary |
|---|---|---|
| `stacked_small_top` | Nhỏ trên, lớn dưới, căn trái, bóng mềm, `lower_left` | **Được** (`forbidden_styles` rỗng) |
| `stacked_small_bottom` | Lớn trên, nhỏ dưới, căn trái | **Được** |
| `stacked_staggered` | Dòng dưới thụt 1.3 em, bóng cứng, giữa khung | **Cấm** |
| `stacked_justified` | Mỗi từ một dòng, Anton hoa, căn đều ước lượng, bóng cứng | **Cấm** |

Đã xem trên preview 960×540 của clip thử: bốn preset hiển thị đúng như mô tả (nhỏ-trên-lớn-dưới, lớn-trên-nhỏ-dưới, so le với dòng dưới thụt vào, xếp ngăn Anton hoa 4 dòng). Hoạt ảnh `line_stagger` chưa xem: cần xem preview.

## 7. Quy tắc quyết định
- `R-STACK-1`: tối đa 4 dòng và 10 từ; vượt thì rút ý hoặc dùng `subtitles`.
- `R-STACK-2`: `hold ≥ max(1.0, 0.8 + 0.3 × số_từ)` (cả dòng phụ). Không đủ chỗ thì bỏ chữ, đừng rút `hold`.
- `R-STACK-3`: NẾU `strategy.style = documentary` THÌ chỉ `stacked_small_top` hoặc `stacked_small_bottom`; `validate` chặn hai preset còn lại.
- `R-STACK-4`: mỗi khối có **một** dòng cấp 1; chênh cỡ dòng chính/phụ ≥ 1.4× (hệ số 0.42 cho tỉ lệ ≈ 2.4×).
- `R-STACK-5`: không dùng `justify` khi nội dung cần dàn đều chính xác (căn đều chỉ ước lượng).
- `R-TXT-3`: không che mặt, nằm trong vùng an toàn.
- Chọn kỹ thuật: một dòng → `kinetic_text`; tên người → `lower_third`; tiêu đề che khung → `title_card`; hai tầng trong vùng trống → `stacked_text`.
- Lưu ý: ngân sách `emphasis_text` trong code chỉ đếm `kinetic_text`; `stacked_text` chưa được đếm. AI nên tự tính chung vào ngân sách chữ nhấn của `documentary.md`.

## 8. Ví dụ
Giả định minh họa: MC nhắc khóa đầu tiên của chương trình ở clip `c03`; vùng trống bên trái-dưới.

```json
{
  "id": "d09",
  "technique": "stacked_text",
  "preset": "stacked_small_top",
  "anchor": { "clip": "c03", "source_time": 6.4 },
  "start_offset": 0.0,
  "duration": 3.7,
  "parameters": { "lines": ["Khóa đầu tiên", "Phân tích Dữ liệu"], "hold": 3.0 },
  "reason": "Câu thông điệp có hai tầng: nhãn và tên chương trình; vùng trái-dưới trống",
  "priority": "clarity",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```
7 từ → `hold` tối thiểu 2.9 s, chọn 3.0. Tổng hiện = `in_duration` 0.5 + 3.0 + `out_duration` 0.2 = 3.7 s; trường `duration` của quyết định không điều khiển thời gian khối chữ (renderer dùng vào + `hold` + ra), nên ghi cho khớp.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Dòng nhỏ quá nhỏ | Dòng phụ < 40 px @1080p (Inter), `validate` không báo vì chỉ kiểm `font_size` gốc | Tăng `font_size` hoặc hệ số |
| `justify` lệch | Các dòng dài ngắn khác nhau rõ | Chỉ dùng với phông condensed, hoặc đặt `line_scales` tay |
| Dùng preset cấm ở documentary | Lỗi `validate` | Đổi sang `stacked_small_*` |
| Quá nhiều dòng/từ | >4 dòng hoặc >10 từ | Rút ý |
| Chồng với chữ khác | Hai khối cùng lúc | Dời thời điểm |
| Che mặt | Khối `center` đè người nói | Đổi `position` |

## 10. Kiểm tra sau render
- Đọc hết ở tốc độ bình thường trong thời gian hiện; dòng nhỏ nhất vẫn đọc được trên nền thật.
- Thứ tự dòng hiện (`line_stagger`) từ trên xuống, mượt: cần xem preview.
- Dòng không tràn mép, không vượt vùng an toàn; không che mặt (chưa kiểm chứng trên cảnh có mặt người: cần xem preview).
- Dấu tiếng Việt đúng; `justify` chấp nhận chênh lệch nhưng không méo.
- Một khối chữ duy nhất trong khung tại mọi thời điểm; chưa kiểm ở 1080p/4K.

**Lưu ý về giãn dòng (đã gặp trên render thử):** chữ tiếng Việt có dấu nhiều dòng với `line_height` thấp (≈ 0.95) làm dấu và chân chữ của dòng này đè lên dòng kia, rõ nhất ở chữ hoa cỡ lớn (ví dụ "HỌC" và "DỮ LIỆU" với Anton). Thử bốn mức 0.95, 1.1, 1.2, 1.3 trên preview 960×540: 0.95 đè rõ, 1.1 vẫn sát, từ 1.2 trở lên tách hẳn. Vì vậy `stacked_justified` dùng 1.25.
