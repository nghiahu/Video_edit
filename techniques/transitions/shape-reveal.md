---
id: shape_reveal
name: Shape Reveal (Lộ hình trong hình khối)
group: transitions
roles: [reveal, theme, energy]
status: usable
source_of_values: convention
---

# Shape Reveal

## 1. Mục đích
Cảnh mới lộ ra **bên trong một hình khối nở dần từ tâm khung** (thoi, lục giác, ngôi sao), mép cứng. Hình khối mang ý nghĩa chủ đề: công nghệ, ăn mừng, thiết kế.

## 2. Khi nên dùng
- `shape_reveal_hexagon`: chủ đề công nghệ, khoa học, mạng lưới.
- `shape_reveal_star`: khoảnh khắc ăn mừng, trao giải, thành tích, nội dung vui.
- `shape_reveal_diamond`: chủ đề sang trọng, thời trang, sản phẩm cao cấp.
- Video quảng bá/năng động, cần một cú nhấn đồ họa có chủ đề.

## 3. Khi không nên dùng
- Style `documentary`: cả ba preset đều cấm.
- Khi hình khối không liên hệ nội dung (hình sao cho nội dung nghiêm túc, hình thoi vô cớ): trông như hiệu ứng mẫu.
- Nội dung cảm xúc nặng, lời thoại quan trọng quanh điểm nối.
- Đã dùng nhiều kiểu chuyển cảnh đặc biệt khác trong video.
- Thiếu tay cầm (xem mục 5).

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `duration` | 0.9 | 0.6–1.3 (renderer chấp nhận 0.15–3) | giây | low |
| `easing` | `ease_in_out` | 4 giá trị chuẩn | – | low |
| `shape` | `diamond` / `hexagon` / `star` theo preset | `diamond`, `hexagon`, `star` (xem ghi chú) | – | low |

Cách tính: hình đa giác tâm ở giữa khung, bán kính tăng theo `easing` từ 0 đến khoảng 1.25 lần nửa đường chéo khung, nên cuối vùng hình phủ kín khung. Chỉ cảnh mới (B) bị cắt theo hình; mép cứng, không có tham số mép mềm. Sao 5 cánh có bán kính trong bằng 0.42 bán kính ngoài; lục giác có đỉnh ở hai bên trái/phải.

Ghi chú: code còn nhận `circle`, `triangle`, `rounded_square` (có trong danh sách enum) nhưng **không có preset** cho các giá trị này; muốn dùng phải ghi đè `parameters.shape` và coi như chưa chuẩn hóa.

## 5. Quy trình thực hiện
1. Chọn hình theo chủ đề nội dung (xem mục 2). Không có chủ đề rõ → dùng kiểu khác hoặc `hard_cut`.
2. Kiểu này `overlap: true`: cần **tay cầm**: clip trước còn ≥ `duration/2` giây nguồn sau `source_out`; clip sau còn ≥ `duration/2` giây nguồn trước `source_in`. Renderer tự rút `duration` theo tay cầm dùng được và cảnh báo; không có thì thành cắt thẳng. Tổng độ dài không đổi.
3. Đặt `anchor.between`; không đặt chữ trong vùng nối.
4. Tâm hình luôn là tâm khung; nên chọn clip sau có chủ thể ở giữa.
5. Âm thanh không đổi theo hiệu ứng.

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `shape_reveal_diamond` | Hình thoi nở dần, 0.9 s |
| `shape_reveal_hexagon` | Lục giác nở dần (công nghệ), 0.9 s |
| `shape_reveal_star` | Ngôi sao nở dần (vui, ăn mừng), 0.9 s |

## 7. Quy tắc quyết định
- `R-SHAPE-1`: NẾU `strategy.style` là `documentary` THÌ **tránh**.
- `R-SHAPE-2`: chọn hình khớp chủ đề (hexagon: công nghệ; star: ăn mừng; diamond: cao cấp); ghi lý do. Ưu tiên Storytelling > Style > Decoration.
- `R-SHAPE-3`: NẾU nội dung nghiêm túc, trang trọng THÌ không dùng `star`.
- `R-SHAPE-4`: NẾU thiếu tay cầm THÌ rút `duration` hoặc `hard_cut`.
- `R-SHAPE-5`: một video dùng một `shape`; tính vào `budget.special_transition`; cách chuyển cảnh đặc biệt khác ≥ 3 giây.

## 8. Ví dụ
Video tổng kết cuộc thi lập trình: sang phần trao giải, lục giác hợp chủ đề công nghệ.

```json
{
  "id": "d07",
  "technique": "shape_reveal",
  "preset": "shape_reveal_hexagon",
  "anchor": { "between": ["c08", "c09"] },
  "duration": 0.9,
  "parameters": { "duration": 0.9, "shape": "hexagon" },
  "reason": "Mở phần trao giải cuộc thi lập trình; lục giác gợi chủ đề công nghệ",
  "priority": "style",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Hình không hợp chủ đề | Sao ở cảnh nghiêm túc, người xem thấy lố | `R-SHAPE-2/3` |
| Chủ thể lệch tâm | Bị hình cắt giữa chừng | Chọn clip sau có chủ thể ở giữa |
| Dùng `shape` không có preset | Kết quả chưa được cân chỉnh | Ghi chú mục 4 |
| Trộn nhiều hình | Video thiếu nhất quán | `R-SHAPE-5` |
| Thiếu tay cầm | Hình đứng trong vùng nối | Mục 5 bước 2 |

## 10. Kiểm tra sau render
- Hình đúng loại, đúng tâm, nở đều, cuối vùng phủ kín khung (không sót góc).
- Mép cứng gọn, không nhấp nháy.
- Không đứng hình ở hai đầu vùng; không có cảnh báo tay cầm.
- Tiếng liền mạch tại điểm nối.
