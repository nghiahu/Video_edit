---
id: split_barn_door
name: Split / Barn Door (Cánh cửa chia đôi)
group: transitions
roles: [reveal, structure, energy]
status: usable
source_of_values: convention
---

# Split / Barn Door

## 1. Mục đích
Cảnh mới lộ ra qua **một dải mở rộng từ vạch giữa** (cửa mở) hoặc **hai dải dồn từ hai mép vào giữa** (cửa đóng), theo chiều dọc hoặc ngang. Cho cảm giác gọn, có cấu trúc, hợp ý "mở/đóng".

## 2. Khi nên dùng
- Chuyển giữa hai cảnh đối ứng (trước/sau, A/B) trong video quảng bá, giới thiệu tính năng.
- Mở phần mới: `barn_door_open` (cửa mở từ giữa); khép lại: `barn_door_close`.
- Video công nghệ, bán hàng, nhịp vừa đến nhanh, bố cục cảnh mới đối xứng.

## 3. Khi không nên dùng
- Style `documentary`: cả hai preset đều cấm.
- Cảnh có chủ thể lệch về một phía mà vạch giữa cắt ngang (mặt người nằm đúng đường chia).
- Đoạn lời thoại hoặc cảm xúc cần liền mạch.
- Gần một chuyển cảnh đặc biệt khác (< 3 giây) hoặc vượt `budget.special_transition`.
- Thiếu tay cầm (xem mục 5).

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `duration` | 0.8 | 0.5–1.2 (renderer chấp nhận 0.15–3) | giây | low |
| `easing` | `ease_in_out` | 4 giá trị chuẩn | – | low |
| `mode` | `open` (`barn_door_open`) / `close` (`barn_door_close`) | `open`, `close` | – | low |
| `orientation` | `vertical` (open) / `horizontal` (close) | `vertical`, `horizontal` | – | low |

Cách tính (chỉ cảnh mới B bị mặt nạ, cảnh cũ nằm bên dưới):
- `open`: B hiện trong dải tâm có bề rộng tăng từ 0 đến toàn khung.
- `close`: B hiện ở hai mép; hai dải mép dồn vào tâm tới khi kín khung.
- `orientation: vertical`: gradient ngang, vạch chia thẳng đứng (hai cánh trái/phải). `horizontal`: gradient dọc, vạch chia nằm ngang (hai cánh trên/dưới).

## 5. Quy trình thực hiện
1. Xác nhận lý do (đối ứng, mở/đóng phần). Không có → `hard_cut`.
2. Kiểu này `overlap: true`: cần **tay cầm**: clip trước còn ≥ `duration/2` giây nguồn sau `source_out`; clip sau còn ≥ `duration/2` giây nguồn trước `source_in`. Renderer tự rút `duration` theo tay cầm dùng được và cảnh báo; không có tay cầm thì thành cắt thẳng. Tổng độ dài không đổi.
3. Chọn `mode` và `orientation` theo bố cục: cảnh mới đối xứng/chủ thể ở giữa phù hợp `open`; khung cảnh ngang rộng phù hợp `vertical`.
4. Đặt `anchor.between`; không đặt chữ trong vùng nối.
5. Âm thanh không đổi theo hiệu ứng.

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `barn_door_open` | Mở từ vạch giữa dọc, 0.8 s |
| `barn_door_close` | Hai mép ngang dồn vào giữa, 0.8 s |

## 7. Quy tắc quyết định
- `R-BARN-1`: NẾU `strategy.style` là `documentary` THÌ **tránh**.
- `R-BARN-2`: chỉ dùng khi hai cảnh đối ứng hoặc đánh dấu mở/đóng phần; ghi lý do. Ưu tiên Storytelling > Style > Decoration.
- `R-BARN-3`: NẾU mặt người nằm đúng đường chia của `orientation` đã chọn THÌ đổi `orientation` hoặc kiểu nối.
- `R-BARN-4`: NẾU thiếu tay cầm THÌ rút `duration` hoặc `hard_cut`.
- `R-BARN-5`: tính vào `budget.special_transition`; cách chuyển cảnh đặc biệt khác ≥ 3 giây.

## 8. Ví dụ
Video giới thiệu ứng dụng: so sánh giao diện cũ và mới, cảnh mới mở ra từ giữa khung.

```json
{
  "id": "d06",
  "technique": "split_barn_door",
  "preset": "barn_door_open",
  "anchor": { "between": ["c04", "c05"] },
  "duration": 0.8,
  "parameters": { "duration": 0.8, "mode": "open", "orientation": "vertical" },
  "reason": "Chuyển từ giao diện cũ sang giao diện mới (đối ứng trước/sau); cửa mở từ giữa nhấn ý 'mở ra'",
  "priority": "style",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Vạch chia cắt mặt | Khuôn mặt bị chẻ đôi giữa vùng | `R-BARN-3` |
| Nhầm `open`/`close` | Cảnh mới lộ từ vị trí ngược dự kiến | Đọc mục 4 |
| Nhầm `orientation` | Cửa mở theo chiều ngược ý | `vertical` = vạch chia thẳng đứng |
| Thiếu tay cầm | Hình đứng trong vùng nối | Mục 5 bước 2 |
| Dùng nhiều kiểu wipe khác nhau | Video lộn xộn | Giữ một ngôn ngữ chuyển cảnh |

## 10. Kiểm tra sau render
- Dải mở/đóng đối xứng đúng hướng; cuối vùng cảnh mới phủ kín, không còn vạch sót.
- Mép dải sạch, không nhấp nháy.
- Không đứng hình ở hai đầu vùng; không có cảnh báo tay cầm.
- Tiếng liền mạch tại điểm nối.
