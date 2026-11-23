---
id: slide
name: Slide (Cảnh mới trượt đè lên cảnh cũ)
group: transitions
roles: [graphic_transition, section_change]
status: usable
source_of_values: convention
---

# Slide

## 1. Mục đích
Cảnh mới **trượt vào đè lên** cảnh cũ; cảnh cũ đứng yên và tối nhẹ. Kiểu chuyển đồ họa gọn, rõ hướng, dùng khi muốn báo "sang mục khác" trong video quảng bá hoặc bài thuyết trình.

## 2. Khi nên dùng
- Video quảng bá, giới thiệu chương trình, tiêu đề các mục (đoạn "đồ họa", không phải cảnh đời thường).
- Chuyển giữa các phần liệt kê (từng bước, từng khóa học) có nhịp đều.
- Muốn B "đến" mà A vẫn là nền (khác `push`: A không bị đẩy đi; khác `swipe`: B không nằm dưới).
- **Style documentary: bị cấm** (`slide_in` có `forbidden_styles: ["documentary"]`; chuyển cảnh trang trí không được phép).

## 3. Khi không nên dùng
- Documentary, phỏng vấn, nội dung cảm xúc hoặc trang trọng.
- Giữa các đoạn đời thường, nội dung có lời thoại: kiểu đồ họa phá cảm giác chân thực.
- Hai cảnh chuyển động camera mạnh (hai chuyển động chồng nhau gây rối).
- Khi không có tay cầm ở hai clip (mục 5).
- Dùng liên tục mọi điểm nối: lặp lại nhàm, thua nhịp `hard_cut`.
- Priority: Decoration.

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `duration` (tổng vùng) | 0.6 | 0.4–1.0 (renderer chấp nhận 0.15–3.0) | giây | low |
| `easing` | `ease_in_out` | `linear`, `ease_in`, `ease_out`, `ease_in_out` | – | low |
| `direction` | `left` | `left`, `right`, `up`, `down` | – | low |

**Cách renderer làm** (`style: slide`, `overlap: true`): trong cả vùng, clip B nằm trên, trượt từ ngoài khung vào vị trí chính; clip A đứng yên bên dưới và tối dần (độ sáng giảm đến khoảng 65%). `direction: left` nghĩa là B đi vào từ bên phải, chạy sang trái; `right`: B vào từ trái; `up`: B vào từ dưới; `down`: B vào từ trên. B hoàn toàn đục (không mờ). Không có bóng đổ ở mép B.

## 5. Quy trình thực hiện
1. Xác nhận style không phải documentary, có lý do (chuyển mục trong video quảng bá, liệt kê).
2. **Tay cầm**: vì A và B cùng hiện trong vùng, cả hai clip phải có đoạn thừa quanh điểm cắt. A cần còn ≥ `duration/2` giây nguồn sau `source_out`; B cần ≥ `duration/2` giây nguồn trước `source_in`. Các đoạn thừa này lên hình (A tiếp tục chạy sau điểm cắt, B đã chạy trước điểm cắt); tổng độ dài video không đổi. Thiếu thì renderer tự rút `duration` đối xứng và cảnh báo; không còn tay cầm thì thành cắt thẳng.
3. Duyệt hai đoạn thừa: chúng hiện thật trên hình (có thể lộ người bước vào, tiếng "cắt", rung máy).
4. Chọn `direction` theo logic kể chuyện (phần sau "đến từ bên phải" thường tự nhiên).
5. Chọn preset `slide_in`.
6. **Âm thanh:** chỉ tác động hình; muốn nối tiếng mượt hãy thêm `j_l_cut` ở cùng điểm nối.

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `slide_in` | 0.6 s, hướng trái (B vào từ phải), A tối nhẹ |

Đổi hướng bằng `parameters: { "direction": "up" }` v.v. Muốn A bị đẩy đi: `push`. Muốn A vuốt đi lộ B: `swipe`.

## 7. Quy tắc quyết định
- `R-SLIDE-1`: KHÔNG dùng ở style documentary.
- `R-SLIDE-2`: chỉ dùng cho chuyển mục đồ họa/nhịp đều, ghi `reason`; không dùng giữa cảnh đời thường có thoại.
- `R-SLIDE-3`: tay cầm hai clip ≥ `duration/2`.
- `R-SLIDE-4`: dùng một hướng thống nhất trong cùng video; đổi hướng khi có lý do (ví dụ sang phần mới).
- `R-SLIDE-5`: không quá `budget.special_transition`; cách chuyển cảnh đặc biệt khác ≥ 3 giây.
- `R-SLIDE-6`: không đặt chữ hoặc `punch_in` trong vùng chuyển.

## 8. Ví dụ
Video giới thiệu khóa học (style `corporate`, không phải documentary): từ cảnh giới thiệu khóa A (c03) sang khóa B (c04), B trượt vào từ bên phải.

```json
{
  "id": "d03",
  "technique": "slide",
  "preset": "slide_in",
  "anchor": { "between": ["c03", "c04"] },
  "duration": 0.6,
  "parameters": { "duration": 0.6, "direction": "left" },
  "reason": "Chuyển sang mục tiếp theo trong danh sách khóa học, B trượt vào đè lên để báo mục mới",
  "priority": "style",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Dùng ở documentary | Validator báo lỗi style | `R-SLIDE-1` |
| Thiếu tay cầm | Hình A hoặc B đứng, có cảnh báo khi render | Mục 5 bước 2 |
| Đoạn thừa lộ nội dung xấu | Thấy rung máy, người lạ trong vùng trượt | Mục 5 bước 3 |
| Lẫn với `push`/`swipe` | A di chuyển khi mong muốn đứng yên | Chọn đúng kỹ thuật (mục 1) |
| Hướng đổi liên tục | Mỗi điểm nối một hướng, rối mắt | `R-SLIDE-4` |

## 10. Kiểm tra sau render
- B trượt vào mượt, đến đúng vị trí cuối vùng; A đứng yên và tối nhẹ.
- Hình nguồn không bị đứng (kiểm tra tay cầm), không có cảnh báo khi render.
- Hướng nhất quán với các điểm nối khác trong video.
- Chữ trong vùng chuyển đã được dời.
- Tiếng ở điểm nối không "tạch".
