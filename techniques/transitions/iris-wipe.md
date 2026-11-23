---
id: iris_wipe
name: Iris Wipe (Mống mắt)
group: transitions
roles: [reveal, retro, focus]
status: usable
source_of_values: convention
---

# Iris Wipe

## 1. Mục đích
Một vòng tròn **mép cứng** mở rộng (cảnh mới lộ ra bên trong) hoặc thu hẹp (cảnh cũ co về một điểm), gợi phim hoạt hình/phim câm cổ điển. Dồn mắt người xem vào một điểm.

## 2. Khi nên dùng
- Nội dung vui nhộn, hoạt hình, mang hơi hướng hoài cổ hoặc châm biếm nhẹ.
- `iris_open`: mở cảnh mới từ một chủ thể ở giữa khung (mặt, logo, sản phẩm).
- `iris_close`: khép cảnh cũ vào một điểm nhấn, kết một đoạn gag hoặc một ý "tròn vòng".
- Style năng động, thiếu nhi, quảng bá vui.

## 3. Khi không nên dùng
- Style `documentary`: bị cấm trong preset (trang trí lộ liễu, giọng điệu hoài cổ không hợp nội dung nghiêm túc).
- Video trang trọng (lễ, hội thảo), phỏng vấn, nội dung cảm xúc nặng.
- Chủ thể không ở gần `origin`: vòng tròn cắt ngang mặt người.
- Video đã dùng nhiều kiểu chuyển cảnh đặc biệt khác: iris rất dễ nhận ra, lặp lại gây phản cảm.
- Thiếu tay cầm (xem mục 5).

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `duration` | 0.9 | 0.6–1.2 (renderer chấp nhận 0.15–3) | giây | low |
| `easing` | `ease_in_out` | 4 giá trị chuẩn (`linear`, `ease_in`, `ease_out`, `ease_in_out`) | – | low |
| `mode` | `open` (`iris_open`) / `close` (`iris_close`) | `open`, `close` | – | low |
| `origin_x` | 0.5 | 0–1 | tỉ lệ chiều rộng | low |
| `origin_y` | 0.5 | 0–1 | tỉ lệ chiều cao | low |

Cách tính: bán kính tối đa `R` = khoảng cách từ `origin` tới góc xa nhất, nên vòng tròn phủ kín hoặc thu về 0 đúng cuối vùng.
- `open`: cảnh mới (clip B) hiện trong `circle(R × tiến_độ)` đè lên cảnh cũ.
- `close`: cảnh cũ (clip A) nằm trên, bị cắt thành `circle(R × (1 − tiến_độ))` co dần; cảnh mới nằm dưới và lộ ra phía ngoài vòng.

## 5. Quy trình thực hiện
1. Xác nhận lý do (gag, kết đoạn, mở cảnh có chủ thể ở giữa). Không có lý do → `hard_cut`.
2. Kiểu này `overlap: true`: cần **tay cầm**. Clip trước còn ≥ `duration/2` giây nguồn sau `source_out`; clip sau còn ≥ `duration/2` giây nguồn trước `source_in`. Renderer tự rút `duration` theo tay cầm dùng được và cảnh báo; không có tay cầm thì thành cắt thẳng. Tổng độ dài không đổi.
3. Chọn `mode`: mở cảnh mới → `open`; muốn "khép" cảnh cũ → `close`.
4. Đặt `origin_x/origin_y` trùng chủ thể quan trọng (mặc định tâm khung).
5. Đặt `anchor.between` hai clip liền kề; tránh chữ trong vùng nối.
6. Âm thanh không đổi theo hiệu ứng; xử lý riêng nếu cần.

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `iris_open` | Vòng tròn nở từ tâm, cảnh mới lộ bên trong, 0.9 s |
| `iris_close` | Cảnh cũ co về tâm, lộ cảnh mới, 0.9 s |

## 7. Quy tắc quyết định
- `R-IRIS-1`: NẾU `strategy.style` là `documentary` THÌ **tránh**.
- `R-IRIS-2`: chỉ dùng khi tông video vui/hoài cổ hoặc có điểm nhấn tròn trịa; ghi lý do. Ưu tiên Storytelling > Style > Decoration (thường `priority: style`).
- `R-IRIS-3`: NẾU chủ thể quan trọng lệch xa `origin` THÌ đổi `origin` hoặc đổi cách nối.
- `R-IRIS-4`: không dùng cả `open` lẫn `close` ở hai điểm nối liền kề; cách chuyển cảnh đặc biệt khác ≥ 3 giây; tính vào `budget.special_transition`.
- `R-IRIS-5`: NẾU thiếu tay cầm THÌ rút `duration` hoặc `hard_cut`.

## 8. Ví dụ
Video quảng bá trò chơi thiếu nhi: từ cảnh bé cười chuyển sang cảnh nhân vật hoạt hình ở giữa khung.

```json
{
  "id": "d02",
  "technique": "iris_wipe",
  "preset": "iris_open",
  "anchor": { "between": ["c01", "c02"] },
  "duration": 0.9,
  "parameters": { "duration": 0.9, "mode": "open", "origin_x": 0.5, "origin_y": 0.5 },
  "reason": "Mở vào cảnh nhân vật ở giữa khung, giọng vui hợp tông video thiếu nhi",
  "priority": "style",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Dùng ở video nghiêm túc | Hiệu ứng "hề", lệch tông | `R-IRIS-1/2` |
| `origin` sai chủ thể | Vòng tròn cắt mặt | `R-IRIS-3` |
| Nhầm `open`/`close` | Cảnh cũ co khi muốn nở, hoặc ngược lại | Đọc mục 4 |
| Thiếu tay cầm | Hình đứng trong vùng nối | Mục 5 bước 2 |
| Lặp nhiều lần | Nhàm, mất giá trị nhấn | `R-IRIS-4` |

## 10. Kiểm tra sau render
- Vòng tròn có tâm đúng `origin`; mép cứng, sạch; cuối vùng phủ kín (open) hoặc thu hết (close).
- Cảnh cũ/mới không đứng hình trong vùng nối; không có cảnh báo tay cầm.
- Chủ thể chính không bị cắt xấu giữa chừng.
- Tiếng liền mạch tại điểm nối.
