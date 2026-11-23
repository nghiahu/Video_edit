---
id: light_leak
name: Light Leak (Rò sáng)
group: transitions
roles: [warmth, nostalgia, softness]
status: usable
source_of_values: convention
---

# Light Leak

## 1. Mục đích
Ánh sáng ấm (cam, đỏ, vàng) **tràn qua khung** quanh điểm cắt rồi tan, gợi phim nhựa, kỷ niệm, hoàng hôn. Mềm hơn `flash_strobe`.

> Giới hạn: đây là **lớp phủ gradient CSS màu ấm trộn kiểu `screen`**, không phải footage rò sáng thật (không có hạt phim, không có biến thiên tự nhiên của ánh sáng thật). Trông "sạch" và đồ họa hơn.

## 2. Khi nên dùng
- Video kỷ niệm, du lịch, cưới, tổng kết năm; nhạc êm, nhịp chậm đến vừa.
- Chuyển giữa các cảnh nắng/ấm, hoàng hôn, khoảnh khắc đẹp.
- Muốn một chuyển cảnh trang trí nhẹ, ấm, không giật.

## 3. Khi không nên dùng
- Style `documentary`: preset cấm (trang trí).
- Nội dung nghiêm túc, tin tức, phỏng vấn, kỹ thuật.
- Cảnh lạnh, đêm xanh, y tế: màu ấm lệch tông.
- Cảnh cần giữ đúng màu (sản phẩm, đồ ăn cần chuẩn màu).
- Dùng cùng lúc với `film_burn` (hai lớp phủ chồng).

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `duration` (tổng vùng, điểm cắt ở giữa) | 0.9 | 0.6–1.4 (renderer chấp nhận 0.15–3) | giây | low |
| `peak` | 0.9 | 0.4–1 | độ đục tối đa lớp phủ | low |
| `easing` | `linear` | – | **renderer không dùng** `easing` cho kiểu này | low |

Cách hiện thực: lớp phủ gồm hai gradient elip (cam-đỏ trên, vàng dưới), điểm sáng trượt ngang theo tiến độ (từ khoảng 20% sang 80%), độ đục = `sin(π·p)^1.4 × peak` (đỉnh ở giữa vùng), trộn `screen`. Màu cố định, không có tham số đổi màu. Kiểu này `overlap: false`: cảnh đổi khi lớp phủ đang rõ nhất.

## 5. Quy trình thực hiện
1. Xác nhận lý do (ấm, hoài niệm, chuyển cảnh nhẹ). Không có → `hard_cut`.
2. `overlap: false`: **không cần tay cầm**; điểm cắt ở giữa vùng, mỗi bên hiện bình thường dưới lớp sáng. Mỗi clip phải đủ dài **≥ `duration/2`** (0.45 s với preset); ngắn hơn renderer rút `duration` và cảnh báo.
3. Chọn `light_leak_warm`; giảm `peak` nếu cảnh đã ấm.
4. Đặt `anchor.between`.
5. Không đặt chữ trong vùng giữa (bị lấn sáng).
6. Âm thanh không đổi theo hiệu ứng; nhạc nền êm hợp hơn SFX.

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `light_leak_warm` | Gradient ấm cam-vàng, 0.9 s, `peak` 0.9 |

## 7. Quy tắc quyết định
- `R-LEAK-1`: NẾU `strategy.style` là `documentary` THÌ **tránh**.
- `R-LEAK-2`: chỉ dùng cho nội dung ấm/kỷ niệm/cảm xúc nhẹ; ghi lý do. Ưu tiên Storytelling > Style > Decoration.
- `R-LEAK-3`: NẾU hai cảnh có màu lạnh hoặc cần đúng màu THÌ bỏ hoặc giảm `peak` ≤ 0.5.
- `R-LEAK-4`: không đặt chữ trong vùng; không chồng với `film_burn`; tính vào `budget.special_transition`; cách chuyển cảnh đặc biệt khác ≥ 3 giây.

## 8. Ví dụ
Video tổng kết kỳ nghỉ: chuyển từ cảnh biển trưa sang cảnh hoàng hôn.

```json
{
  "id": "d05",
  "technique": "light_leak",
  "preset": "light_leak_warm",
  "anchor": { "between": ["c05", "c06"] },
  "duration": 0.9,
  "parameters": { "duration": 0.9, "peak": 0.9 },
  "reason": "Chuyển từ biển buổi trưa sang hoàng hôn; ánh ấm tràn qua gợi hoài niệm",
  "priority": "style",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Kỳ vọng như footage rò sáng thật | Trông phẳng, đồ họa | Ghi nhận giới hạn mục 1 |
| Cháy trắng một mảng | Chi tiết cảnh mất ở đỉnh | Giảm `peak` |
| Lệch tông với cảnh lạnh | Màu cam trên nền xanh lạnh | `R-LEAK-3` |
| Chữ trong vùng | Chữ lẫn trong lớp sáng | `R-LEAK-4` |
| Kỳ vọng `easing` có tác dụng | Không đổi gì | Xem bảng thông số |

## 10. Kiểm tra sau render
- Lớp ấm đạt đỉnh đúng điểm cắt rồi tan hết; hai đầu vùng hình sạch.
- Không cháy sáng mất chi tiết quan trọng.
- Màu cảnh trở về đúng sau vùng.
- Không có cảnh báo clip quá ngắn.
