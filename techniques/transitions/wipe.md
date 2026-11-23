---
id: wipe
name: Wipe (Quét)
group: transitions
roles: [graphic_transition, reveal, section_change]
status: usable
source_of_values: convention
---

# Wipe

## 1. Mục đích
Một đường biên quét ngang hoặc dọc qua khung: một phía đã là cảnh mới, phía kia vẫn là cảnh cũ. Kiểu chuyển đồ họa cổ điển, báo hiệu đổi mục, địa điểm hoặc thời gian trong video quảng bá hoặc tổng hợp.

## 2. Khi nên dùng
- Video quảng bá, tổng hợp nhiều mục ngắn, kiểu "đưa tin" hoặc tiêu đề phần.
- Đổi địa điểm hoặc đổi chủ đề có quan hệ song song (so sánh trước/sau, hai nơi).
- Muốn "quét" từ cảnh cũ sang cảnh mới theo một hướng có ý nghĩa (từ trái sang phải = tiến tới).
- **Style documentary: bị cấm** (cả `wipe_right_soft` và `wipe_down_hard` có `forbidden_styles: ["documentary"]`).

## 3. Khi không nên dùng
- Documentary, phỏng vấn, nội dung trang trọng hoặc cảm xúc.
- Giữa các cảnh đời thường, đoạn có thoại liên tục.
- Hai cảnh có đường chân trời hoặc biên sáng tối trùng hướng quét (đường quét lẫn với biên cảnh).
- Không có tay cầm ở hai clip (mục 5).
- Dùng nhiều lần: nhìn như mẫu có sẵn.
- Priority: Decoration.

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `duration` (tổng vùng) | 0.8 (`wipe_right_soft`), 0.6 (`wipe_down_hard`) | 0.4–1.2 (renderer chấp nhận 0.15–3.0) | giây | low |
| `easing` | `ease_in_out` | `linear`, `ease_in`, `ease_out`, `ease_in_out` | – | low |
| `direction` | `right` (soft), `down` (hard) | `left`, `right`, `up`, `down` | – | low |
| `softness` (độ mềm mép) | 12 (soft), 0 (hard) | 0–40 | phần trăm chiều quét của khung (không phải đơn vị 0–1 như `mask_reveal`) | low |

**Cách renderer làm** (`style: wipe`, `overlap: true`): A nằm dưới, hiện đầy đủ suốt vùng; B nằm trên, bị che bằng mặt nạ lộ dần. Hướng: `right` lộ B từ trái sang phải (biên đi sang phải), `left` ngược lại, `down` lộ từ trên xuống dưới, `up` từ dưới lên. `softness` > 0: biên là dải chuyển trong suốt rộng `softness`% chiều quét (mép mềm); `softness` = 0: biên cứng (cắt thẳng đứt đoạn). Không có vệt, viền hay bóng.

## 5. Quy trình thực hiện
1. Xác nhận style không phải documentary, có lý do (đổi mục, đổi địa điểm, so sánh).
2. **Tay cầm**: A và B cùng hiện suốt vùng nên cả hai clip cần đoạn thừa quanh điểm cắt. A cần còn ≥ `duration/2` giây nguồn sau `source_out`; B cần ≥ `duration/2` giây nguồn trước `source_in`. Các đoạn thừa lên hình (cả hai cảnh đều chạy trong vùng quét); tổng độ dài video không đổi. Thiếu thì renderer tự rút `duration` đối xứng và cảnh báo; hết tay cầm thì thành cắt thẳng.
3. Duyệt hai đoạn thừa vì chúng lên hình.
4. Chọn hướng và độ mềm: mép mềm (`softness` 10–20) tự nhiên hơn; mép cứng (0) mang cảm giác "đồ họa/tin tức".
5. Chọn preset `wipe_right_soft` hoặc `wipe_down_hard`.
6. **Âm thanh:** chỉ tác động hình; thêm `j_l_cut` nếu cần nối tiếng.

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `wipe_right_soft` | 0.8 s, quét từ trái sang phải, `softness` 12 |
| `wipe_down_hard` | 0.6 s, quét từ trên xuống, `softness` 0 (mép cứng) |

## 7. Quy tắc quyết định
- `R-WIPE-1`: KHÔNG dùng ở style documentary.
- `R-WIPE-2`: chỉ dùng khi có lý do (đổi mục, địa điểm, so sánh); ghi `reason`.
- `R-WIPE-3`: hướng quét nhất quán, ưu tiên hướng "tiến tới" (trái sang phải).
- `R-WIPE-4`: tay cầm hai clip ≥ `duration/2`.
- `R-WIPE-5`: trong ngân sách `special_transition`, cách chuyển cảnh đặc biệt khác ≥ 3 giây.
- `R-WIPE-6`: không đặt chữ hoặc `punch_in` trong vùng chuyển.

## 8. Ví dụ
Video quảng bá (style `social`): từ cảnh lớp học (c05) quét sang cảnh khu thực hành (c06), biên mềm quét từ trái sang phải.

```json
{
  "id": "d05",
  "technique": "wipe",
  "preset": "wipe_right_soft",
  "anchor": { "between": ["c05", "c06"] },
  "duration": 0.8,
  "parameters": { "duration": 0.8, "direction": "right", "softness": 12 },
  "reason": "Chuyển mục từ lớp học sang khu thực hành trong video quảng bá, quét tiến từ trái sang phải",
  "priority": "style",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Dùng ở documentary | Validator báo lỗi style | `R-WIPE-1` |
| Nhầm đơn vị `softness` | Đặt 0.3 như `mask_reveal`, thành gần mép cứng | `softness` của `wipe` tính theo phần trăm |
| Biên quét lẫn với đường chân trời | Khó thấy đâu là đường quét | Đổi hướng quét |
| Thiếu tay cầm | Hình đứng, cảnh báo khi render | Mục 5 bước 2 |
| Hướng đổi liên tục | Mỗi điểm nối một hướng | `R-WIPE-3` |

## 10. Kiểm tra sau render
- Đường biên quét mượt, tốc độ vừa, hết hẳn ở cuối vùng (thấy B toàn khung).
- Mép mềm hay cứng đúng ý, không có răng cưa hay sọc.
- Không có cảnh báo thiếu tay cầm.
- Chữ trong vùng chuyển đã dời.
- Tiếng ở điểm nối không "tạch".
