---
id: shake_transition
name: Shake Transition (Rung và nhòe rồi cắt)
group: transitions
roles: [impact, energy, beat_sync]
status: usable
source_of_values: convention
---

# Shake Transition

## 1. Mục đích
Khung hình **rung mạnh, xoay nhẹ, phóng nhẹ và nhòe** tăng dần ở cảnh cũ, cắt giữa cú rung, rồi rung giảm dần ở cảnh mới. Cảm giác va chạm, nổ, nhịp bass.

## 2. Khi nên dùng
- Video hành động, thể thao, âm nhạc, game; điểm cắt trùng cú đập trống/bass rõ.
- Cảnh có va chạm, nổ, cú đáp, đòn đánh ở cuối cảnh cũ (rung hợp với nội dung).
- Quảng bá năng động, cần nhấn một cú đánh một lần.

## 3. Khi không nên dùng
- Style `documentary`: bị cấm rõ (danh sách cấm có "rung mạnh").
- **Clip đã rung sẵn** (quay cầm tay mạnh, drone gió, chạy bộ): rung cộng rung gây chóng mặt và không đọc ra là hiệu ứng.
- Nội dung nghiêm túc, cảm xúc, lời thoại quan trọng quanh điểm nối.
- Cảnh có chữ nhỏ ở vùng nối.
- Người xem nhạy với chuyển động (say tàu xe): rung ngẫu nhiên mỗi frame.

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `duration` (tổng vùng, điểm cắt ở giữa) | 0.35 | 0.25–0.5 (renderer chấp nhận 0.15–3) | giây | low |
| `amplitude` | 36 | 10–60 | px dịch tối đa ở 1080p | low |
| `rotate` | 2.5 | 0–5 | độ xoay tối đa | low |
| `blur` | 6 | 0–12 | px nhòe tối đa ở 1080p | low |
| `easing` | `linear` | – | **renderer không dùng** `easing` cho kiểu này | low |

Cách hiện thực (tuần tự): cường độ `i` của clip trước tăng 0 → 1 trong nửa đầu vùng, của clip sau giảm 1 → 0 trong nửa sau. Mỗi frame: dịch ngang/dọc ngẫu nhiên trong ±`amplitude × i`, xoay ngẫu nhiên trong ±`rotate × i`, phóng tới 1.10 lần ở cường độ tối đa (để che rìa khi dịch), và nhòe `blur × i`. Số ngẫu nhiên xác định theo frame, render lại giống hệt. Đây là bộ lọc nhòe đơn giản, **không phải nhòe chuyển động thật** theo hướng rung.

## 5. Quy trình thực hiện
1. Xác nhận lý do (va chạm, nhịp bass). Không có → `hard_cut`.
2. `overlap: false`: **không cần tay cầm**; điểm cắt ở giữa vùng, mỗi bên rung riêng trong thân clip. Mỗi clip phải đủ dài **≥ `duration/2`** (~0.18 s với preset); ngắn hơn renderer rút `duration` và cảnh báo.
3. Kiểm tra cả hai clip kề: có đang rung sẵn không (cầm tay mạnh, drone). Có → bỏ hoặc giảm `amplitude`.
4. Chọn `shake_hit`; căn điểm cắt đúng nhịp.
5. Đặt `anchor.between`; không đặt chữ trong vùng nối.
6. Âm thanh không đổi theo hiệu ứng; SFX/nhạc nhấn (nếu có) thêm riêng.

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `shake_hit` | 0.35 s, `amplitude` 36, `rotate` 2.5, `blur` 6 |

## 7. Quy tắc quyết định
- `R-SHK-1`: NẾU `strategy.style` là `documentary` THÌ **tránh** (cấm).
- `R-SHK-2`: chỉ dùng khi có va chạm/nhịp bass cần nhấn; ghi lý do. Ưu tiên Storytelling > Rhythm > Style > Decoration.
- `R-SHK-3`: NẾU một trong hai clip kề đã rung sẵn THÌ **tránh** hoặc giảm `amplitude` ≤ 15.
- `R-SHK-4`: mỗi clip kề ≥ `duration/2`; không chồng `glitch`/`rgb_split`; cách chuyển cảnh đặc biệt khác ≥ 3 giây; tính vào `budget.special_transition`.
- `R-SHK-5`: `duration` ≤ 0.5 s.

## 8. Ví dụ
Video highlight thể thao: chuyển từ cú sút trúng xà ngang sang phản ứng khán giả, đúng nhịp bass.

```json
{
  "id": "d06",
  "technique": "shake_transition",
  "preset": "shake_hit",
  "anchor": { "between": ["c07", "c08"] },
  "duration": 0.35,
  "parameters": { "duration": 0.35, "amplitude": 36, "rotate": 2.5, "blur": 6 },
  "reason": "Cú sút trúng xà ngang là va chạm; rung khung nhấn khoảnh khắc rồi cắt sang khán giả đúng nhịp bass",
  "priority": "rhythm",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Rung chồng lên clip đã rung | Chóng mặt, không thấy hiệu ứng riêng | `R-SHK-3` |
| Rung kéo dài | > 0.5 s | `R-SHK-5` |
| Lộ rìa khung | Viền đen khi dịch lớn | Giảm `amplitude` (đã có phóng 1.10 che bớt) |
| Kỳ vọng nhòe chuyển động thật | Nhòe đều, không theo hướng | Ghi nhận giới hạn mục 4 |
| Dùng ở nội dung nghiêm túc | Lệch tông | `R-SHK-1/2` |

## 10. Kiểm tra sau render
- Rung tăng ở cảnh cũ, cắt giữa cú rung, giảm ở cảnh mới; hai đầu vùng hình ổn định.
- Không lộ rìa đen/trống ở khung.
- Chủ thể không bị rung quá mức đến mất nhận diện.
- Không có cảnh báo clip quá ngắn; chữ không nằm trong vùng nối.
