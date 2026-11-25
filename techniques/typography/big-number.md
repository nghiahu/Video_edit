---
id: big_number
name: Big Number (Số liệu nổi bật)
group: typography
roles: [emphasis, information]
status: usable
source_of_values: convention
---

# Big Number

## 1. Mục đích
Đưa **một con số then chốt** lên màn hình thật lớn, đếm chạy từ giá trị đầu đến giá trị cuối, kèm nhãn nhỏ nói số đó là gì. Giúp dữ kiện định lượng ("bao nhiêu") đọng lại hơn lời nói. Thuộc cấp 1 (con số) kèm cấp 2 (nhãn ở `sub_text`) trong `typography/hierarchy.md`.

## 2. Khi nên dùng
- Có **số liệu có nguồn đáng tin** (lời người nói, slide, tài liệu chương trình) và con số là điểm nhấn của đoạn (`R-BN-1`).
- Một con số duy nhất cần nhớ; nhãn ≤ 6 từ.
- Điểm nghỉ của nhịp dựng: sau câu có số, hoặc trên b-roll rộng.

| Tình huống | Chọn |
|---|---|
| Một con số lớn, có đếm chạy | `big_number` |
| Số trong một cụm 3–6 từ ("hơn 1.250 học viên") | `kinetic_text` |
| Chữ khớp bề ngang khung, không cần đếm | `big_text` |
| Nhiều số, bảng, biểu đồ | chưa có kỹ thuật riêng (ngoài phạm vi) |

## 3. Khi không nên dùng
- **Số không có nguồn** hoặc chỉ là ước đoán: không dùng, không làm tròn "cho đẹp", không thêm `+`/`hơn` khi nguồn không nói vậy.
- Con số không phải đại lượng tăng dần: **năm** (2026), số điện thoại, mã số, số thứ tự chương: đếm chạy trông sai nghĩa (nếu bắt buộc, đặt `count_duration: 0`).
- Nhiều hơn một con số cùng lúc (một cấp nhấn mỗi khung).
- Chữ (ngoài tiền tố/hậu tố) quá 3 từ; nhãn quá 6 từ (validate cảnh báo).
- Giữa lúc người nói đang nói thông điệp chính: bản `clean` làm tối khung (`bg_mode: dim`).
- Style documentary với `big_number_bold` (`forbidden_styles: [documentary]`, validate báo lỗi).

## 4. Thông số
Giá trị là của `big_number_clean`; ngoặc là `card` / `bold`. Cỡ chữ tính cho 1080p.

| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `value` | – (bắt buộc) | số hữu hạn (kiểu số JSON, **dấu chấm thập phân**) | – | medium |
| `prefix` / `suffix` | `""` / `""` | chuỗi; tính vào giới hạn 3 từ (ví dụ `"%"`, `"+"`, `" tỷ"`) | – | medium |
| `decimals` | 0 | số nguyên 0–3 (validate) | chữ số | medium |
| `count_from` | 0 | số bất kỳ (có thể lớn hơn `value`: đếm ngược) | – | medium |
| `count_duration` | 1.2 (card 1; bold 1) | 0–4 (validate) | giây | low |
| `count_delay` | 0.1 | không kiểm; tính từ **đầu khối** | giây | low |
| `thousands_sep` | `"."` | chuỗi; `""` hoặc `null` tắt ngăn nghìn | – | medium |
| `sub_text` | – (nhãn) | nên ≤ 6 từ (cảnh báo), tối đa 12 (lỗi); tính vào `hold` | – | medium |
| `hold` | `0.8 + 0.3 × số_từ`, ≥ 1.0 (số = chữ + `sub_text`) | ≥ công thức | giây | medium |
| `font_family` / `font_weight` | Inter / 800 (Inter / 800; Anton / 400) | registry; vai trò `emphasis` hoặc `heading` | – | medium |
| `font_size` | 230 (150 / 320) | 12–600 (validate) | px @1080p | medium |
| `letter_spacing` / `line_height` | −0.03 / 1 (−0.02 / 1; 0 / 1) | không kiểm tra | em / – | low |
| `sub_font_size` / `sub_gap` | 46 / 10 (40 / 8; 56 / 6) | không kiểm tra | px @1080p | low |
| `position` / `align` | `center` / `center` (`lower_left` / `left`; `center` / `center`) | 9 vị trí | – | medium |
| `box_style` | `none` (`rounded` + `box_radius` 22, padding 56/34; `none`) | enum | – | low |
| `bg_mode` / `bg_opacity` | `dim` / 0.4 (`none`; `none`) | enum / 0–1 | – | low |
| `in_animation` / `in_duration` | `fade` / 0.4 (`fade_up` / 0.45; `pop` / 0.4) | enum; documentary xem mục 7 | giây | low |

**Định dạng số (đã đọc trong `formatNumber`, kiểu Việt):**
- Dấu **chấm** ngăn nghìn, dấu **phẩy** thập phân, cố định: `value: 1250` → `1.250`; `value: 98.5` với `decimals: 1` → `98,5`. Không đổi được dấu thập phân.
- `value` phải là số JSON; chuỗi kiểu Việt `"98,5"` là `NaN`, validate báo lỗi. `decimals: 0` với `98.5` hiển thị **`99`** (làm tròn): phải đặt `decimals` đúng với nguồn.
- Số âm có dấu `-` phía trước; `prefix`, `suffix` nối nguyên văn quanh số (`"%"`, `"+"`, `" tỷ đồng"`).
- Khi có `value`, code bỏ qua `text`/`lines` và bật `font-variant-numeric: tabular-nums` (chữ số cùng độ rộng) cho dòng số, để các chữ số không nhảy trong lúc đếm. Số chữ số tăng dần vẫn làm bề rộng khối đổi; với `align: center` khối có thể dịch nhẹ. Phông Anton có hỗ trợ `tnum` hay không: cần xem preview.
- Đếm chạy dùng easing ease-out (nhanh trước, chậm dần cuối) từ `count_from` đến `value`; nhãn `sub_text` hiện ngay từ đầu.

## 5. Quy trình thực hiện
1. Xác định số liệu và **nguồn** (câu nói, slide, tài liệu); ghi nguồn vào `reason`. Chép đúng giá trị, đơn vị và độ chính xác.
2. Đổi sang số JSON dấu chấm; chọn `decimals` khớp nguồn; quyết định `suffix` (`%`, `+` chỉ khi nguồn nói "hơn/trên") và nhãn `sub_text` ≤ 6 từ.
3. Tính `hold = max(1.0, 0.8 + 0.3 × (từ_chữ + từ_nhãn))`; bảo đảm số hiện trọn sau khi đếm xong ít nhất 1.0 s: `hold ≥ count_delay + count_duration + 1.0 − in_duration` (`confidence: low`).
4. Chọn preset theo style (mục 6); chạy `validate` (cảnh báo nếu đếm xong sau `hold`), xem preview.

## 6. Biến thể và preset
Đã xem trên preview 960×540 của clip thử (khung tĩnh lúc chữ hiện đủ): "1.250+" và "98,5%" hiển thị đúng kiểu Việt, nhãn nhỏ bên dưới.
| Preset | Mô tả | Documentary |
|---|---|---|
| `big_number_clean` | Inter 800, 230 px, nền tối 0.4, bóng mềm, `fade` | **Được**; mặc định |
| `big_number_card` | Thẻ tối bo góc, dưới trái, 150 px, `fade_up` | **Được**; ít che hình hơn |
| `big_number_bold` | Anton 320 px gradient vàng-cam, bóng cứng, chữ hoa, `pop` | **Cấm** (`confidence: low`) |

Chữ hoa của `bold` áp cho cả `suffix` và `sub_text` (ví dụ `tỷ` thành `TỶ`). Cảnh đang đếm (số thay đổi từng khung) và hoạt ảnh vào/ra chưa xem: cần xem preview.

## 7. Quy tắc quyết định
- `R-BN-1`: **chỉ dùng số liệu có nguồn đáng tin**; không tự bịa, không ước lượng; ghi nguồn trong `reason`. Không có nguồn thì không dùng `big_number`.
- `R-BN-2` (validate): `value` là số hữu hạn; `decimals` nguyên 0–3; `count_duration` 0–4; chữ ≤ 3 từ, 1 dòng; `hold` đủ công thức; cảnh báo nếu `count_duration + count_delay > in_duration + hold` (số đếm xong sau khi chữ đã biến mất) hoặc nhãn > 6 từ.
- `R-BN-3`: con số trên hình khớp con số người nói (nếu đang nói); lệch thì sửa theo nguồn.
- `R-BN-4`: NẾU `strategy.style = documentary` THÌ chỉ `big_number_clean` hoặc `big_number_card`; `in_animation` chỉ `none|fade|fade_up|line_stagger`, `out_animation` chỉ `none|fade`.
- `R-BN-5`: một cấp nhấn mỗi khung; không cùng lúc `kinetic_text`, `lower_third`, `subtitles`.
- Ngân sách: `documentary.md` chưa có dòng riêng; AI tự giữ ≤ 2–3 lần mỗi video 2 phút (`confidence: low`).
- Ưu tiên: Storytelling/Clarity > Style > Decoration.

## 8. Ví dụ
Giả định minh họa: người dẫn nói một con số về số học viên tham dự trong clip `c05` (số 1250 chỉ là minh họa). `value` + `+` là 1 từ, nhãn 4 từ → hold ≥ 0.8 + 1.5 = 2.3; chọn 3.0. Đếm xong lúc 1.3 s; số hiện trọn sau đó 0.4 + 3.0 − 1.3 = 2.1 s ≥ 1.0.
```json
{
  "id": "d14",
  "technique": "big_number",
  "preset": "big_number_clean",
  "anchor": { "clip": "c05", "source_time": 12.0 },
  "start_offset": 0.0,
  "duration": 3.75,
  "parameters": { "value": 1250, "suffix": "+", "sub_text": "học viên tham dự", "hold": 3.0 },
  "reason": "Nguồn: lời người dẫn ở clip c05 (12.3 s), nói 'hơn 1.250'; số là dữ kiện chính của đoạn, ghi đúng như nguồn",
  "priority": "storytelling",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```
`duration` 3.75 = 0.4 + 3.0 + 0.35. Con số và nhãn trong ví dụ là minh họa, không phải dữ liệu thật.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Số không nguồn / làm tròn tùy ý | `reason` không ghi nguồn, số lệch lời nói | `R-BN-1`, `R-BN-3` |
| `value` kiểu chuỗi "98,5" | validate báo `value` không phải số | Dùng số JSON `98.5` |
| `decimals` thiếu | `98.5` hiện `99` | `decimals: 1` |
| Đếm xong sau khi chữ biến mất | validate cảnh báo | Tăng `hold` hoặc giảm `count_duration` |
| Đếm một năm, mã số | "2026" chạy từ 0 | `count_duration: 0` hoặc dùng `kinetic_text` |
| Số quá dài, tràn khung | > ~10 ký tự ở 230 px | Giảm `font_size` (cần xem preview) |
| `bold` ở documentary | validate báo lỗi | `clean` hoặc `card` |

## 10. Kiểm tra sau render
- Số cuối **đúng từng chữ số** so với nguồn; dấu chấm ngăn nghìn, dấu phẩy thập phân đúng; `prefix`/`suffix` đúng.
- Số đếm xong và đứng yên đủ lâu để đọc; nhãn đọc được, nhỏ hơn rõ (≥ 1.4×).
- Trong lúc đếm, chữ số không nhảy vị trí khó chịu (kiểm tra `tabular-nums`, nhất là Anton).
- Không sát mép (lề ≥ 5%), không che mặt; nền tối đủ đọc nhưng không đen kịt.
- Cần xem preview: chuyển động đếm, hoạt ảnh `pop`/`fade`/`fade_up`, số nhiều chữ số, 1080p/4K.
