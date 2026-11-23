---
id: rgb_split
name: RGB Split (Tách kênh màu)
group: transitions
roles: [energy, impact, tech]
status: usable
source_of_values: convention
---

# RGB Split

## 1. Mục đích
Ba kênh màu **tách lệch nhau theo chiều ngang** (đỏ sang một bên, xanh dương sang bên kia) tăng dần ở cảnh cũ, cắt, rồi tụ lại ở cảnh mới. Cảm giác va chạm, rung màu, dạng "quang sai" mạnh. Nhẹ hơn `glitch` vì hình không bị xé.

## 2. Khi nên dùng
- Video âm nhạc, thể thao, công nghệ, quảng bá năng động; nhấn một điểm cắt trên nhịp mạnh.
- Cảnh có nhiều màu tương phản, đường nét rõ (tách kênh dễ nhìn thấy).
- Cần hiệu ứng tức thì (0.3–0.5 s), không muốn hình méo toàn khung.

## 3. Khi không nên dùng
- Style `documentary`: bị cấm rõ (danh sách cấm của style có "RGB split").
- Nội dung nghiêm túc, cảm xúc, phỏng vấn, lời thoại quan trọng.
- Cảnh chữ nhỏ ở ngay điểm nối (chữ viền đỏ/xanh khó đọc).
- Cần giữ màu chính xác (sản phẩm cần đúng màu, thương hiệu): tách kênh làm sai màu tạm thời.
- Dùng cùng lúc `glitch`/`vhs_distortion` tại điểm nối.

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `duration` (tổng vùng, điểm cắt ở giữa) | 0.4 | 0.25–0.6 (renderer chấp nhận 0.15–3) | giây | low |
| `split` | 28 | 8–50 | px lệch mỗi kênh ở 1080p (co theo độ phân giải) | low |
| `easing` | `linear` | – | **renderer không dùng** `easing` cho kiểu này | low |

Cách hiện thực (tuần tự): cường độ `i` của clip trước tăng 0 → 1 trong nửa đầu vùng, của clip sau giảm 1 → 0 trong nửa sau. Độ lệch = `split × i^1.5` (lên chậm rồi gắt dần). Bộ lọc SVG tách kênh đỏ (dịch phải) và xanh dương (dịch trái), kênh lục giữ nguyên, rồi trộn lại bằng `screen`. Vì bộ lọc chỉ dịch ngang, viền khung có thể bị rìa màu ở độ lệch lớn.

## 5. Quy trình thực hiện
1. Xác nhận lý do (nhấn mạnh, nhịp beat, tông năng động). Không có → `hard_cut`.
2. Kiểu này `overlap: false`: **không cần tay cầm**. Điểm cắt ở giữa vùng; mỗi bên tự có hiệu ứng trong thân clip. Mỗi clip phải đủ dài: **≥ `duration/2`** (0.2 s với preset). Ngắn hơn thì renderer rút `duration` và cảnh báo.
3. Chọn `rgb_split_hit`; giảm `split` nếu cảnh nhiều chữ.
4. Đặt `anchor.between`; căn điểm cắt đúng beat nếu có nhạc.
5. Không đặt chữ trong vùng nối.
6. Âm thanh không đổi theo hiệu ứng.

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `rgb_split_hit` | 0.4 s, `split` 28 |

## 7. Quy tắc quyết định
- `R-RGB-1`: NẾU `strategy.style` là `documentary` THÌ **tránh** (cấm).
- `R-RGB-2`: chỉ dùng khi tông năng động/âm nhạc/thể thao/công nghệ; ghi lý do. Ưu tiên Storytelling > Rhythm > Style > Decoration.
- `R-RGB-3`: NẾU cảnh có chữ nhỏ hoặc cần đúng màu sản phẩm THÌ giảm `split` hoặc dùng kiểu khác.
- `R-RGB-4`: mỗi clip kề điểm nối ≥ `duration/2`; cách chuyển cảnh đặc biệt khác ≥ 3 giây; tính vào `budget.special_transition`.
- `R-RGB-5`: không chồng với `glitch`, `vhs_distortion`, `shake_transition` tại cùng điểm nối.

## 8. Ví dụ
Video highlight thể thao: chuyển giữa hai pha ghi bàn trên nhịp trống.

```json
{
  "id": "d09",
  "technique": "rgb_split",
  "preset": "rgb_split_hit",
  "anchor": { "between": ["c11", "c12"] },
  "duration": 0.4,
  "parameters": { "duration": 0.4, "split": 28 },
  "reason": "Nhấn chuyển sang pha ghi bàn thứ hai đúng nhịp trống; tách màu tạo cảm giác va chạm",
  "priority": "rhythm",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| `split` quá lớn | Hình ma ba lớp, rìa màu lộ | Giữ ≤ 40 |
| Dùng ở cảnh chữ nhỏ | Chữ không đọc được trong vùng nối | `R-RGB-3` |
| Dùng cho nội dung nghiêm túc | Lệch tông | `R-RGB-1/2` |
| Clip quá ngắn | Cảnh báo rút `duration` | `R-RGB-4` |
| Kỳ vọng `easing` có tác dụng | Đổi `easing` không khác gì | Xem bảng thông số |

## 10. Kiểm tra sau render
- Độ lệch tăng ở cảnh cũ, cắt giữa vùng, tụ lại ở cảnh mới; hai đầu vùng hình trùng khít.
- Không có viền trong suốt/đen ở rìa khung khi độ lệch lớn.
- Màu cảnh mới trở về đúng sau vùng nối.
- Không có cảnh báo clip quá ngắn.
