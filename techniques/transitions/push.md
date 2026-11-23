---
id: push
name: Push (Cảnh mới đẩy cảnh cũ ra khỏi khung)
group: transitions
roles: [graphic_transition, section_change, energy]
status: usable
source_of_values: convention
---

# Push

> Tên kỹ thuật chuyển cảnh `push` khác `slow_push` (đẩy máy chậm trong một cảnh) và khác `punch_in`. Ở đây là hai cảnh dính liền nhau và cùng chạy ngang khung.

## 1. Mục đích
Cảnh mới đẩy cảnh cũ ra khỏi khung: hai hình dính vào nhau và cùng trượt một hướng. Cảm giác "lật trang" nhanh, rõ hướng; dùng cho video quảng bá, slideshow, các mục nối tiếp.

## 2. Khi nên dùng
- Video quảng bá hoặc tổng hợp nhiều hoạt động ngắn, nhịp đều (mỗi cảnh vài giây).
- Slideshow ảnh hoặc cảnh tĩnh nối nhau có logic "tiếp theo".
- Hai cảnh đều có bố cục tương tự (cùng khung, cùng mật độ), trượt cùng nhau trông tự nhiên hơn.
- **Style documentary: bị cấm** (`push_left` có `forbidden_styles: ["documentary"]`).

## 3. Khi không nên dùng
- Documentary, phỏng vấn, nội dung cảm xúc hoặc trang trọng.
- Đoạn có lời thoại liên tục hoặc cảnh quan trọng (kiểu đồ họa kéo sự chú ý khỏi nội dung).
- Hai cảnh đang có chuyển động camera mạnh ngược chiều trượt.
- Không có tay cầm ở hai clip (mục 5).
- Dùng liên tục mọi điểm nối (nhàm, như PowerPoint).
- Priority: Decoration.

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `duration` (tổng vùng) | 0.7 | 0.4–1.0 (renderer chấp nhận 0.15–3.0) | giây | low |
| `easing` | `ease_in_out` | `linear`, `ease_in`, `ease_out`, `ease_in_out` | – | low |
| `direction` | `left` | `left`, `right`, `up`, `down` | – | low |

**Cách renderer làm** (`style: push`, `overlap: true`): A trượt hẳn khỏi khung theo hướng `direction` (đi 100% khung) và B trượt vào từ phía đối diện, hai mép sát nhau, cùng tốc độ. `left`: A đi sang trái, B vào từ phải. Không có mờ, nhòe hay bóng; hai hình đều đục suốt vùng.

## 5. Quy trình thực hiện
1. Xác nhận style không phải documentary, có lý do (nhịp đều, chuyển mục).
2. **Tay cầm**: cả A và B cùng hiện suốt vùng nên cần đoạn thừa quanh điểm cắt ở hai clip. A cần còn ≥ `duration/2` giây nguồn sau `source_out`; B cần ≥ `duration/2` giây nguồn trước `source_in`. Các đoạn thừa lên hình (A chạy tiếp sau điểm cắt trong lúc bị đẩy đi, B đã chạy trước điểm cắt khi đang vào); tổng độ dài video không đổi. Thiếu thì renderer tự rút `duration` đối xứng và cảnh báo; không còn tay cầm thì thành cắt thẳng.
3. Duyệt hai đoạn thừa vì chúng nhìn thấy được.
4. Chọn `direction` đồng bộ với logic dẫn dắt (ví dụ luôn `left` cho "tiếp theo").
5. Chọn preset `push_left`.
6. **Âm thanh:** chỉ tác động hình; thêm `j_l_cut` ở cùng điểm nối nếu cần nối tiếng.

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `push_left` | 0.7 s, A đi sang trái, B vào từ phải |

Đổi hướng bằng `parameters: { "direction": "up" }` v.v. Phân biệt:
- `slide`: B đè lên A, A đứng yên và tối nhẹ.
- `push`: cả A và B cùng trượt, dính nhau.
- `swipe`: A vuốt đi, B đứng yên bên dưới.

## 7. Quy tắc quyết định
- `R-PUSHT-1`: KHÔNG dùng ở style documentary.
- `R-PUSHT-2`: chỉ dùng khi nhịp đều, nhiều cảnh ngắn hoặc chuyển mục đồ họa; ghi `reason`.
- `R-PUSHT-3`: tay cầm hai clip ≥ `duration/2`.
- `R-PUSHT-4`: giữ một hướng thống nhất cho cùng chuỗi.
- `R-PUSHT-5`: trong ngân sách `special_transition`, cách chuyển cảnh đặc biệt khác ≥ 3 giây.
- `R-PUSHT-6`: không đặt chữ hoặc `punch_in` trong vùng chuyển.

## 8. Ví dụ
Video tổng hợp hoạt động (style `social`): chuyển từ cảnh hoạt động buổi sáng (c04) sang buổi chiều (c05).

```json
{
  "id": "d04",
  "technique": "push",
  "preset": "push_left",
  "anchor": { "between": ["c04", "c05"] },
  "duration": 0.7,
  "parameters": { "duration": 0.7, "direction": "left" },
  "reason": "Chuyển nhịp đều giữa hoạt động buổi sáng và buổi chiều trong video tổng hợp",
  "priority": "style",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Dùng ở documentary | Validator báo lỗi style | `R-PUSHT-1` |
| Thiếu tay cầm | Hình A hoặc B đứng khi trượt; cảnh báo khi render | Mục 5 bước 2 |
| Nhầm với `slow_push` | Hiểu là đẩy máy trong cảnh | Chọn đúng kỹ thuật |
| Lẫn với `slide`/`swipe` | A di chuyển trong khi mong muốn đứng yên (hoặc ngược lại) | Xem mục 6 |
| Đoạn thừa lộ nội dung xấu | Thấy rung máy, người lạ lúc trượt | Mục 5 bước 3 |

## 10. Kiểm tra sau render
- Hai hình trượt sát nhau, không có khe hở hoặc chồng.
- Hướng đúng ý và nhất quán trong chuỗi.
- Hình nguồn không bị đứng (kiểm tra tay cầm), không có cảnh báo khi render.
- Chữ trong vùng chuyển đã dời.
- Tiếng ở điểm nối không "tạch".
