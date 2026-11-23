---
id: glitch
name: Glitch (Nhiễu tín hiệu số)
group: transitions
roles: [energy, tech, impact]
status: usable
source_of_values: convention
---

# Glitch

## 1. Mục đích
Hình bị **xé ngang, lệch kênh màu, giật ngang** tăng dần ở cảnh cũ, cắt giữa nhiễu, rồi nhiễu giảm dần ở cảnh mới. Gợi lỗi tín hiệu số: công nghệ, hacker, cyberpunk, nhịp nhanh.

## 2. Khi nên dùng
- Video công nghệ, game, âm nhạc điện tử, giới thiệu tính năng số với nhịp nhanh.
- Điểm nhấn mạnh trên nhịp trống/beat (hit), một lần cho một chuyển ý lớn.
- Cảnh cũ và mới đều là hình số, màn hình, đồ họa, hợp ngôn ngữ nhiễu.

## 3. Khi không nên dùng
- Style `documentary`: bị cấm rõ (danh sách cấm của style có "glitch").
- Nội dung nghiêm túc, cảm xúc, lễ, phỏng vấn: nhiễu làm mất tính chân thực.
- Người xem nhạy sáng/co giật: hiệu ứng có hình giật và đổi màu theo từng khung hình (xem mục 9).
- Clip quan trọng có chữ nhỏ ngay trước hoặc sau điểm cắt (chữ bị xé không đọc được).
- Lạm dụng: hơn một lần trong ~10 giây, vượt `budget.special_transition`.

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `duration` (tổng vùng, điểm cắt ở giữa) | 0.4 | 0.25–0.6 (renderer chấp nhận 0.15–3) | giây | low |
| `intensity` | 90 | 30–150 | độ dịch của bản đồ xé hình, px ở 1080p | low |
| `shift` | 60 | 0–100 | độ giật ngang cả khung, px ở 1080p | low |
| `split` | 14 | 0–30 | độ lệch kênh đỏ/xanh, px ở 1080p | low |
| `easing` | `linear` | – | **renderer không dùng** `easing` cho kiểu này | low |

Các giá trị tự co theo độ phân giải (nhân `chiều cao/1080`).

Cách hiện thực (tuần tự): vùng chia làm hai nửa quanh điểm cắt. Clip trước (A) có cường độ tăng 0 → 1 trong nửa đầu; clip sau (B) giảm 1 → 0 trong nửa sau. Mỗi frame: (1) bộ lọc SVG `feTurbulence` + `feDisplacementMap` xé hình theo dải ngang, rồi tách kênh đỏ/xanh; (2) cả khung giật ngang một lượng ngẫu nhiên; (3) khoảng 20% số frame bị đổi sắc (`hue-rotate` tới 90 độ, tăng bão hòa); (4) lớp phủ là vạch ngang ngẫu nhiên màu lục lam/hồng (xuất hiện ở khoảng 45% số frame). Mọi giá trị ngẫu nhiên là **số giả ngẫu nhiên xác định theo số khung hình**, nên render lại cho kết quả y hệt.

## 5. Quy trình thực hiện
1. Xác nhận lý do (nhấn mạnh trên beat, chuyển ý lớn, tông công nghệ). Không có → `hard_cut`.
2. Kiểu này `overlap: false`: **không cần tay cầm**. Điểm cắt nằm giữa vùng; mỗi bên có hiệu ứng riêng ngay trong thân clip. Nhưng mỗi clip phải đủ dài: **≥ `duration/2`** (0.2 s với preset). Nếu ngắn hơn, renderer rút `duration` theo clip ngắn nhất và cảnh báo.
3. Chọn `glitch_hit`; giảm `intensity`, `shift`, `split` nếu cần nhẹ hơn.
4. Đặt `anchor.between` hai clip liền kề. Nếu có nhạc, căn điểm cắt đúng beat.
5. Không đặt chữ, lower third trong vùng nối (hình đang bị xé).
6. Âm thanh không đổi theo hiệu ứng; cân nhắc SFX hoặc nhạc nhấn riêng (không thuộc kỹ thuật này).

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `glitch_hit` | 0.4 s: xé hình ngang, lệch kênh màu, cắt giữa nhiễu |

## 7. Quy tắc quyết định
- `R-GLI-1`: NẾU `strategy.style` là `documentary` THÌ **tránh** (cấm).
- `R-GLI-2`: chỉ dùng khi tông video số/công nghệ/năng động; ghi lý do. Ưu tiên Storytelling > Rhythm > Style > Decoration (thường `priority: style`).
- `R-GLI-3`: mỗi video tối đa 1 lần trong khoảng 10 giây; cách chuyển cảnh đặc biệt khác ≥ 3 giây; tính vào `budget.special_transition`.
- `R-GLI-4`: NẾU một trong hai clip ngắn hơn `duration/2` THÌ rút `duration` hoặc dùng `hard_cut`.
- `R-GLI-5`: KHÔNG chồng với `shake_transition`, `rgb_split`, `vhs_distortion` tại cùng điểm nối.
- `R-GLI-6`: `duration` ≤ 0.6 s; không dùng ở nội dung nhắm tới người xem nhạy sáng.

## 8. Ví dụ
Video giới thiệu ứng dụng bảo mật: từ cảnh cảnh báo "đã bị tấn công" sang cảnh giao diện bảo vệ.

```json
{
  "id": "d03",
  "technique": "glitch",
  "preset": "glitch_hit",
  "anchor": { "between": ["c02", "c03"] },
  "duration": 0.4,
  "parameters": { "duration": 0.4, "intensity": 90, "shift": 60, "split": 14 },
  "reason": "Chuyển từ cảnh bị tấn công sang cảnh bảo vệ; nhiễu số khớp chủ đề an ninh mạng",
  "priority": "style",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Dùng ở nội dung nghiêm túc | Lệch tông, mất uy tín | `R-GLI-1/2` |
| Kéo dài quá | > 0.6 s, giật liên tục | `R-GLI-6` |
| Nhiễu đổi màu theo từng frame | Nhấp nháy sắc độ mạnh | Giảm thời lượng và `intensity`; tránh người nhạy sáng |
| Clip quá ngắn | Renderer rút `duration`, cảnh báo | `R-GLI-4` |
| Kỳ vọng `easing` có tác dụng | Đổi `easing` không đổi hiệu ứng | Biết `easing` không dùng cho kiểu này |

## 10. Kiểm tra sau render
- Nhiễu tăng ở cảnh cũ, cắt gọn giữa vùng, giảm ở cảnh mới; hai đầu vùng hình sạch.
- Không có khung hình đen/trống hoặc rìa xé lộ viền trong suốt (bộ lọc SVG là phép xấp xỉ).
- Render lại cùng EDL cho cùng kết quả (số giả ngẫu nhiên xác định).
- Không có cảnh báo clip quá ngắn; chữ không nằm trong vùng nối.
