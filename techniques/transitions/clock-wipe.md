---
id: clock_wipe
name: Clock Wipe (Quét kim đồng hồ)
group: transitions
roles: [reveal, time_passage, energy]
status: usable
source_of_values: convention
---

# Clock Wipe

## 1. Mục đích
Cảnh mới lộ ra theo **cánh quạt quay như kim đồng hồ**, bắt đầu từ 12 giờ và quét một vòng 360 độ quanh tâm khung. Gợi ý niệm thời gian, đếm ngược, lịch trình.

## 2. Khi nên dùng
- Nội dung nói về thời gian, tiến độ, lịch (đếm ngược sự kiện, "24 giờ sau", timeline lộ trình).
- Video quảng bá/giáo dục dạng infographic, nhịp vừa, cần một chuyển cảnh có "chất đồ họa".
- Chuyển giữa hai cảnh có ý nghĩa đối ứng (trước/sau) mà người xem nên so sánh.

## 3. Khi không nên dùng
- Style `documentary`: preset cấm (hiệu ứng trang trí).
- Khi không có liên hệ nào với thời gian: kim đồng hồ quét vô cớ khiến người xem hiểu sai.
- Cảnh có chủ thể ngay tâm khung: đường cắt cánh quạt đi qua mặt người liên tục.
- Đoạn có lời thoại quan trọng trong 1 giây quanh điểm nối.
- Thiếu tay cầm (xem mục 5).

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `duration` | 1 | 0.7–1.5 (renderer chấp nhận 0.15–3) | giây | low |
| `easing` | `ease_in_out` | 4 giá trị chuẩn | – | low |
| `start_angle` | 0 | 0–360 | độ (0 = 12 giờ, quét theo chiều kim đồng hồ) | low |

Cách tính: mặt nạ là `conic-gradient` tại tâm khung (50%, 50%); góc phủ tăng theo `easing` từ 0° đến 360°, mép chỉ rộng khoảng 0.6° (gần như cứng). Cảnh mới (clip B) nằm trong vùng đã quét, cảnh cũ nằm bên dưới. Tâm cố định ở giữa khung, không có tham số đổi tâm. Lưu ý: bộ kiểm tra hợp lệ của renderer không kiểm khoảng của `start_angle`, nên tự giữ trong 0–360.

## 5. Quy trình thực hiện
1. Xác nhận có liên hệ thời gian/tiến độ. Không có → dùng kiểu khác hoặc `hard_cut`.
2. Kiểu này `overlap: true`: cần **tay cầm**: clip trước còn ≥ `duration/2` giây nguồn sau `source_out`; clip sau còn ≥ `duration/2` giây nguồn trước `source_in`. Renderer tự rút `duration` theo tay cầm dùng được và cảnh báo; không có thì thành cắt thẳng. Tổng độ dài không đổi.
3. Chọn `start_angle` (mặc định 0). Đổi góc khi muốn đường quét bắt đầu ở chỗ không cắt qua chủ thể.
4. Đặt `anchor.between`; không đặt chữ trong vùng nối.
5. Âm thanh không đổi theo hiệu ứng; nếu cảnh có lời, giữ tiếng liên tục bằng `j_l_cut` hoặc nhạc nền.

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `clock_wipe_standard` | Quét từ 12 giờ, 1 s, `ease_in_out` |

## 7. Quy tắc quyết định
- `R-CLK-1`: NẾU `strategy.style` là `documentary` THÌ **tránh**.
- `R-CLK-2`: chỉ dùng khi nội dung liên quan thời gian, tiến độ, đếm ngược; ghi lý do. Ưu tiên Storytelling > Style > Decoration.
- `R-CLK-3`: NẾU chủ thể (mặt người) nằm ngay tâm khung THÌ đổi `start_angle` hoặc kiểu khác.
- `R-CLK-4`: NẾU thiếu tay cầm THÌ rút `duration` hoặc `hard_cut`.
- `R-CLK-5`: tính vào `budget.special_transition`; cách chuyển cảnh đặc biệt khác ≥ 3 giây.

## 8. Ví dụ
Video quảng bá sự kiện: từ cảnh bảng đếm ngược "còn 1 ngày" sang cảnh sân khấu ngày diễn ra.

```json
{
  "id": "d04",
  "technique": "clock_wipe",
  "preset": "clock_wipe_standard",
  "anchor": { "between": ["c02", "c03"] },
  "duration": 1,
  "parameters": { "duration": 1, "start_angle": 0 },
  "reason": "Từ cảnh đếm ngược sang ngày diễn ra; kim đồng hồ quét minh họa thời gian trôi",
  "priority": "style",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Dùng vô cớ | Người xem tự hỏi "sao lại đồng hồ?" | `R-CLK-2` |
| Đường quét cắt mặt | Cánh quạt đi qua khuôn mặt giữa khung | `R-CLK-3` |
| `start_angle` ngoài 0–360 | Hướng bắt đầu lạ | Giữ trong khoảng |
| Quá dài | > 1.5 s, kim quét lê thê | Giữ 0.7–1.5 s |
| Thiếu tay cầm | Hình đứng trong vùng nối | Mục 5 bước 2 |

## 10. Kiểm tra sau render
- Cánh quạt bắt đầu đúng hướng `start_angle`, quay thuận chiều kim đồng hồ, kín khung đúng cuối vùng.
- Mép cánh quạt gọn, không răng cưa quá mức.
- Không đứng hình ở hai đầu vùng; không có cảnh báo tay cầm.
- Tiếng liền mạch tại điểm nối.
