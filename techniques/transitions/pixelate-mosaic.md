---
id: pixelate_mosaic
name: Pixelate / Mosaic (Vỡ hạt vuông)
group: transitions
roles: [energy, tech, retro]
status: usable
source_of_values: convention
---

# Pixelate / Mosaic

## 1. Mục đích
Hình **vỡ thành các ô vuông to dần** ở cảnh cũ, cắt khi ô lớn nhất, rồi cảnh mới rõ lại dần từ ô lớn về nét. Gợi game 8-bit, số hóa, hiệu ứng "tải ảnh".

> Giới hạn hiện thực: dùng **bộ lọc SVG** (lấy mẫu một điểm mỗi ô rồi nở ra thành ô vuông). Đây là xấp xỉ mosaic, không phải bộ lọc mosaic gốc của phần mềm dựng. Chi phí render **có thể cao** khi ô lớn (bộ lọc `feMorphology` bán kính lớn trên toàn khung hình); chưa đo, cần thử ở độ phân giải đầu ra.

## 2. Khi nên dùng
- Video game, công nghệ, pixel art, giới thiệu ứng dụng số.
- Chuyển giữa cảnh đời thật và cảnh màn hình/số hóa.
- Nhấn một chuyển ý nhanh, vui, kiểu retro.

## 3. Khi không nên dùng
- Style `documentary`: preset cấm.
- Nội dung nghiêm túc, cảm xúc.
- Cảnh có mặt người cần giữ nhận diện: có thể gây liên tưởng che mặt/kiểm duyệt.
- Máy dựng yếu hoặc bản preview cần nhanh: chi phí render cao (xem mục 4).
- Cảnh có chữ nhỏ ở vùng nối.

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `duration` (tổng vùng, điểm cắt ở giữa) | 0.6 | 0.4–0.9 (renderer chấp nhận 0.15–3) | giây | low |
| `size` (kích thước ô lớn nhất) | 48 | 16–64 | px ở 1080p (co theo độ phân giải) | low |
| `easing` | `linear` | – | **renderer không dùng** `easing` cho kiểu này | low |

Cách hiện thực (tuần tự): cường độ `i` của clip trước tăng 0 → 1 trong nửa đầu vùng, của clip sau giảm 1 → 0 trong nửa sau. Kích thước ô = `1 + i² × (size − 1)`; khi ô ≤ 1 px thì không áp bộ lọc, hình nguyên. Ô lớn nhất đạt ở điểm cắt. Do dùng bình phương, ô to lên chậm rồi nhanh dần.

## 5. Quy trình thực hiện
1. Xác nhận lý do (game/số hóa/retro). Không có → `hard_cut`.
2. `overlap: false`: **không cần tay cầm**; điểm cắt ở giữa vùng. Mỗi clip phải đủ dài **≥ `duration/2`** (0.3 s với preset); ngắn hơn renderer rút `duration` và cảnh báo.
3. Chọn `pixelate_burst`; giảm `size` nếu muốn nhẹ hơn hoặc máy render chậm.
4. Đặt `anchor.between`; không đặt chữ trong vùng nối.
5. Khi preview chậm, thử `size` nhỏ hơn hoặc `duration` ngắn hơn.
6. Âm thanh không đổi theo hiệu ứng.

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `pixelate_burst` | 0.6 s, ô lớn nhất 48 px |

## 7. Quy tắc quyết định
- `R-PIX-1`: NẾU `strategy.style` là `documentary` THÌ **tránh**.
- `R-PIX-2`: chỉ dùng khi tông game/số hóa/retro; ghi lý do. Ưu tiên Storytelling > Style > Decoration.
- `R-PIX-3`: NẾU cảnh có mặt người cần nhận diện hoặc chữ nhỏ ở vùng nối THÌ bỏ hoặc giảm `size`.
- `R-PIX-4`: mỗi clip kề ≥ `duration/2`; cách chuyển cảnh đặc biệt khác ≥ 3 giây; tính vào `budget.special_transition`.
- `R-PIX-5`: NẾU render chậm bất thường THÌ giảm `size` hoặc đổi kiểu (ghi lại trong `reason`).

## 8. Ví dụ
Video giới thiệu game: từ cảnh người chơi ngồi trước màn hình sang cảnh bên trong trò chơi.

```json
{
  "id": "d03",
  "technique": "pixelate_mosaic",
  "preset": "pixelate_burst",
  "anchor": { "between": ["c02", "c03"] },
  "duration": 0.6,
  "parameters": { "duration": 0.6, "size": 48 },
  "reason": "Chuyển từ người chơi vào thế giới game; vỡ hạt vuông gợi số hóa",
  "priority": "style",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Render chậm | Thời gian dựng tăng rõ ở các khung có ô lớn | `R-PIX-5` |
| Ô không vuông hoàn hảo/rìa lạ | Ô lệch ở rìa khung (phép xấp xỉ SVG) | Kiểm tra sau render; giảm `size` |
| Che mặt người | Ô che nhận diện | `R-PIX-3` |
| Dùng ở nội dung nghiêm túc | Lệch tông | `R-PIX-1/2` |
| Kỳ vọng `easing` có tác dụng | Không đổi gì | Xem bảng thông số |

## 10. Kiểm tra sau render
- Ô lớn dần ở cảnh cũ, lớn nhất tại điểm cắt, nhỏ dần về nét ở cảnh mới; hai đầu vùng hình sạch.
- Ô vuông đều, không có dải lệch/trống ở rìa khung.
- Thời gian render trong mức chấp nhận được.
- Không có cảnh báo clip quá ngắn.
