---
id: color_grade_basic
name: Color Grade cơ bản
group: color
roles: [consistency, mood, polish]
status: usable
source_of_values: convention
---

# Color Grade cơ bản

## 1. Mục đích
Chỉnh nhẹ độ sáng, tương phản, bão hòa và độ ấm/lạnh để các clip khác nhau **trông như cùng một video** và hợp với mood. Mục tiêu chính là **nhất quán**, không phải "nhuộm màu cho đẹp".

## 2. Khi nên dùng
- Các clip quay ở thời điểm/ánh sáng hơi khác nhau, khi ghép cạnh nhau thấy lệch tông.
- Cần tạo mood nhất quán (ấm trang trọng, lạnh công nghệ).
- Hình hơi nhạt, phẳng cần tăng nhẹ tương phản.
- Áp **cùng một preset cho tất cả clip** trong video (hoặc cùng nhóm cảnh) để đồng bộ.

## 3. Khi không nên dùng
- Footage đã đẹp và đồng đều: để nguyên (không làm gì là hợp lệ).
- Chỉnh mạnh làm da người đổi màu bất thường, hoặc làm mất màu thương hiệu/slide trên hình.
- Chỉ chỉnh một số clip, để clip khác nguyên (gây lệch tông; `validate` sẽ cảnh báo).
- Style cần màu nguyên bản chân thực (tin tức, ghi hình tài liệu) mà chỉ cần cân bằng nhẹ.
- Đây không phải color grading chuyên nghiệp (không có đường cong, không có LUT, không có masking). Cần nhiều hơn thì dùng công cụ chuyên dụng.

## 4. Thông số
| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `brightness` | 0.0 | −0.15 … +0.15 | cộng thêm | medium |
| `contrast` | 1.05 | 0.85 … 1.20 | hệ số | medium |
| `saturation` | 1.03 | 0.70 … 1.30 | hệ số | medium |
| `warmth` | 0.0 | −1 (lạnh) … +1 (ấm) | – | low |

Mức dùng an toàn: `brightness` ±0.05, `contrast` 1.02–1.10, `saturation` 0.92–1.08, `warmth` ±0.4. Vượt thì kiểm tra kỹ preview (da người, slide).

`warmth` thực hiện bằng lớp màu cam (ấm) hoặc xanh (lạnh) hòa `soft-light` với độ mờ ≈ `|warmth| × 0.5`.

## 5. Quy trình thực hiện
1. Xem các clip dùng trong video (preview hoặc khung hình): có lệch tông, quá tối/nhạt, quá ám màu không? Không có → bỏ qua kỹ thuật này.
2. Chọn **một** preset cho cả video theo mood (`grade_neutral_clean` mặc định; `grade_warm_documentary`; `grade_cool_tech`).
3. Tạo một quyết định `color_grade_basic` cho **mỗi clip** (cùng preset), `duration: 0` (phủ cả clip).
4. Clip lệch hẳn (ví dụ quá tối): chỉnh riêng `brightness`/`warmth` ở clip đó, nhưng giữ các giá trị còn lại giống nhau.
5. Kiểm tra: da người tự nhiên, trắng vẫn trắng, chữ trên slide không ám màu, hai clip kề nhau không lệch.

## 6. Biến thể và preset
| Preset | Cảm giác |
|---|---|
| `grade_neutral_clean` | Gần nguyên bản, sạch |
| `grade_warm_documentary` | Ấm nhẹ, hơi giảm bão hòa |
| `grade_cool_tech` | Hơi lạnh, nhấn công nghệ |

## 7. Quy tắc quyết định
- `R-COL-1`: áp cùng preset cho mọi clip; không chỉ một số clip.
- `R-COL-2`: không dùng khi footage đã đồng đều; ưu tiên không làm gì.
- `R-COL-3`: không vượt "mức dùng an toàn" trừ khi có lý do kể chuyện và đã xem preview.
- `R-COL-4`: khi mood ở metadata (`overall_mood`) là `calm`/`formal` → ưu tiên `neutral_clean` hoặc `warm_documentary`.

## 8. Ví dụ
Hai clip cùng sự kiện: b-roll lớp học hơi lạnh, clip diễn giả hơi ấm. Dùng cùng preset để kéo gần.

```json
{
  "id": "d09",
  "technique": "color_grade_basic",
  "preset": "grade_neutral_clean",
  "anchor": { "clip": "c01", "source_time": 0.5 },
  "duration": 0,
  "parameters": {},
  "reason": "Đồng bộ tông giữa b-roll và clip diễn giả",
  "priority": "style",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```
(Lặp lại với `c02`, `c03`... cùng preset.)

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Chỉ chỉnh một clip | Lệch tông giữa các clip | `R-COL-1` |
| Da người ám cam/xanh | Mặt trông bất thường | Giảm `warmth`, kiểm tra |
| Quá bão hòa/tương phản | Màu chói, mất chi tiết vùng sáng/tối | Giữ trong mức an toàn |
| Chữ trên slide đổi màu | Slide xanh thành tím | Giảm `warmth` |
| Chỉnh khi không cần | Hình tệ hơn nguyên bản | `R-COL-2` |

## 10. Kiểm tra sau render
- Hai clip kề nhau không lệch tông rõ.
- Da người tự nhiên; trắng không ám màu.
- Không mất chi tiết ở vùng sáng/tối.
- So khung trước/sau của một clip để chắc chắn thay đổi là nhẹ và có chủ đích.
