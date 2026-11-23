---
id: vhs_distortion
name: VHS Distortion (Méo băng VHS)
group: transitions
roles: [retro, energy, tech]
status: usable
source_of_values: convention
---

# VHS Distortion

## 1. Mục đích
Hình giống băng VHS hỏng: **scanline, vệt sáng trôi dọc, rung ngang, lệch màu, nhòe nhẹ**, tăng ở cảnh cũ, cắt, giảm ở cảnh mới. Gợi hoài niệm thập niên 80–90, video gia đình, retro.

> Giới hạn: đây là phép xấp xỉ bằng bộ lọc và lớp phủ (không có nhiễu hạt thật, không có hiệu ứng "tracking" cuộn hình thật). Lớp scanline có chu kỳ cố định theo pixel, không tự co theo độ phân giải.

## 2. Khi nên dùng
- Video retro, hồi tưởng, nhạc synthwave, nội dung nhắc video gia đình cũ.
- Chuyển giữa tư liệu cũ và cảnh mới trong tông hoài niệm vui.
- Cần hiệu ứng nhẹ hơn `glitch` nhưng có "chất băng".

## 3. Khi không nên dùng
- Style `documentary`: preset cấm.
- Nội dung nghiêm túc, hiện đại, sản phẩm sạch.
- Cảnh có chữ nhỏ ở vùng nối (scanline và nhòe làm chữ khó đọc).
- Cần giữ độ nét/màu chuẩn.
- Chồng cùng `glitch`, `rgb_split`.

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `duration` (tổng vùng, điểm cắt ở giữa) | 0.7 | 0.4–1.0 (renderer chấp nhận 0.15–3) | giây | low |
| `jitter` | 26 | 0–50 | px rung ngang ở 1080p | low |
| `split` | 10 | 0–20 | px lệch kênh đỏ/xanh ở 1080p | low |
| `easing` | `linear` | – | **renderer không dùng** `easing` cho kiểu này | low |

Cách hiện thực (tuần tự): cường độ `i` của clip trước tăng 0 → 1 trong nửa đầu vùng, của clip sau giảm 1 → 0 trong nửa sau. Mỗi frame: rung ngang ngẫu nhiên tối đa `jitter × i`; nhòe tới 2 px, giảm bão hòa tới 35%, tăng tương phản 15%; lệch kênh `split × i` bằng bộ lọc SVG. Lớp phủ toàn khung: vạch scanline đen (chu kỳ 5 px), một dải sáng mờ trôi dọc, và một lớp tối nhẹ (tối đa 25%). Số ngẫu nhiên xác định theo frame, nên render lại giống hệt.

## 5. Quy trình thực hiện
1. Xác nhận lý do (retro, hồi tưởng). Không có → `hard_cut`.
2. `overlap: false`: **không cần tay cầm**; điểm cắt ở giữa vùng, mỗi bên có hiệu ứng riêng trong thân clip. Mỗi clip phải đủ dài **≥ `duration/2`** (0.35 s với preset); ngắn hơn renderer rút `duration` và cảnh báo.
3. Chọn `vhs_glitch`; giảm `jitter`/`split` nếu cảnh có chữ.
4. Đặt `anchor.between`; không đặt chữ trong vùng nối.
5. Âm thanh không đổi theo hiệu ứng.

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `vhs_glitch` | 0.7 s: scanline, rung ngang, lệch màu |

## 7. Quy tắc quyết định
- `R-VHS-1`: NẾU `strategy.style` là `documentary` THÌ **tránh**.
- `R-VHS-2`: chỉ dùng cho tông retro/hồi tưởng/synthwave; ghi lý do. Ưu tiên Storytelling > Style > Decoration.
- `R-VHS-3`: NẾU cảnh có chữ nhỏ hoặc cần nét/màu chuẩn THÌ bỏ hoặc giảm `jitter`, `split`.
- `R-VHS-4`: mỗi clip kề ≥ `duration/2`; không chồng `glitch`/`rgb_split`/`shake_transition`; cách chuyển cảnh đặc biệt khác ≥ 3 giây; tính vào `budget.special_transition`.

## 8. Ví dụ
Video kỷ niệm lớp: từ video quay tay cũ sang cảnh buổi họp lớp hiện tại.

```json
{
  "id": "d02",
  "technique": "vhs_distortion",
  "preset": "vhs_glitch",
  "anchor": { "between": ["c02", "c03"] },
  "duration": 0.7,
  "parameters": { "duration": 0.7, "jitter": 26, "split": 10 },
  "reason": "Chuyển từ video gia đình cũ sang buổi họp lớp hiện tại; méo băng gợi hoài niệm",
  "priority": "style",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Kỳ vọng như băng VHS thật | Scanline đều, thiếu nhiễu hạt | Ghi nhận giới hạn mục 1 |
| `jitter` quá lớn | Hình giật xa, lộ rìa | Giữ ≤ 40 |
| Scanline quá dày ở độ phân giải cao | Vạch mỏng, mất tác dụng ở 4K | Kiểm tra sau render ở độ phân giải thật |
| Dùng ở nội dung hiện đại | Lệch tông | `R-VHS-1/2` |
| Kỳ vọng `easing` có tác dụng | Không đổi gì | Xem bảng thông số |

## 10. Kiểm tra sau render
- Méo tăng ở cảnh cũ, cắt giữa vùng, giảm ở cảnh mới; hai đầu vùng hình sạch.
- Scanline thấy được rõ ở độ phân giải đầu ra; dải sáng trôi không che chi tiết quan trọng.
- Lệch màu không để lại rìa màu sau vùng.
- Không có cảnh báo clip quá ngắn.
