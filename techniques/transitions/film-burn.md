---
id: film_burn
name: Film Burn (Cháy phim)
group: transitions
roles: [nostalgia, impact, warmth]
status: usable
source_of_values: convention
---

# Film Burn

## 1. Mục đích
Một mảng sáng **cam-vàng bùng lên, ngả đỏ ở rìa, rồi tan**, giống đoạn phim nhựa bị cháy khi qua máy chiếu. Mạnh và "thô" hơn `light_leak`.

> Giới hạn: đây là **xấp xỉ bằng gradient tròn** (kèm nhấp nháy ngẫu nhiên), không phải footage cháy phim thật (không có hạt phim, vết xước, rìa lỗ phim).

## 2. Khi nên dùng
- Video hoài cổ, retro, phim ngắn tông cũ, nhạc lo-fi, kỷ niệm.
- Cần một chuyển ý rõ rệt, nổi bật hơn rò sáng.
- Hai cảnh khác mốc thời gian (quá khứ/hiện tại) trong tông hoài niệm.

## 3. Khi không nên dùng
- Style `documentary`: preset cấm.
- Nội dung nghiêm túc, hiện đại, tin tức, kỹ thuật.
- Cảnh cần giữ màu đúng, cảnh người nhạy sáng (xem mục 9).
- Dùng cùng lúc `light_leak` (hai lớp phủ chồng).
- Cảnh trước/sau đã nhiều cam-đỏ (che mất hiệu ứng).

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `duration` (tổng vùng, điểm cắt ở giữa) | 0.8 | 0.5–1.2 (renderer chấp nhận 0.15–3) | giây | low |
| `peak` | 1 | 0.4–1 | độ đục tối đa lớp phủ | low |
| `easing` | `linear` | – | **renderer không dùng** `easing` cho kiểu này | low |

Cách hiện thực: một gradient tròn (trắng kem ở lõi, cam ở giữa, đỏ sẫm ở rìa) trộn `screen`; độ đục = `sin(π·p)^1.2 × peak × hệ số nhấp nháy`, trong đó hệ số nhấp nháy nằm trong khoảng 0.75–1.0 và **đổi mỗi frame** (số giả ngẫu nhiên xác định theo frame); vị trí tâm gradient đổi cứ hai frame một lần trong vùng 30–70% ngang, 40–60% dọc. Kiểu này `overlap: false`: cảnh đổi khi lớp cháy đang đạt đỉnh.

## 5. Quy trình thực hiện
1. Xác nhận lý do (hoài niệm, chuyển mốc thời gian). Không có → `hard_cut`.
2. `overlap: false`: **không cần tay cầm**; điểm cắt ở giữa vùng. Mỗi clip phải đủ dài **≥ `duration/2`** (0.4 s với preset); ngắn hơn renderer rút `duration` và cảnh báo.
3. Chọn `film_burn_classic`; giảm `peak` nếu cảnh đã ấm hoặc cần mềm hơn.
4. Đặt `anchor.between`.
5. Không đặt chữ trong vùng giữa.
6. Âm thanh không đổi theo hiệu ứng.

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `film_burn_classic` | Cháy phim cam-vàng, 0.8 s, `peak` 1 |

## 7. Quy tắc quyết định
- `R-BURN-1`: NẾU `strategy.style` là `documentary` THÌ **tránh**.
- `R-BURN-2`: chỉ dùng cho tông hoài niệm/retro/chuyển mốc thời gian; ghi lý do. Ưu tiên Storytelling > Style > Decoration.
- `R-BURN-3`: NẾU khán giả có thể nhạy sáng THÌ giảm `peak` ≤ 0.6 hoặc bỏ (độ sáng nhấp nháy mỗi frame).
- `R-BURN-4`: không chồng `light_leak`; không đặt chữ trong vùng; cách chuyển cảnh đặc biệt khác ≥ 3 giây; tính vào `budget.special_transition`.

## 8. Ví dụ
Video giới thiệu lịch sử trường: từ ảnh tư liệu cũ sang cảnh sân trường hiện tại, tông hoài niệm.

```json
{
  "id": "d04",
  "technique": "film_burn",
  "preset": "film_burn_classic",
  "anchor": { "between": ["c03", "c04"] },
  "duration": 0.8,
  "parameters": { "duration": 0.8, "peak": 0.8 },
  "reason": "Chuyển từ tư liệu quá khứ sang hiện tại; cháy phim gợi mốc thời gian cũ",
  "priority": "style",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Kỳ vọng như footage cháy phim thật | Trông phẳng, thiếu hạt | Ghi nhận giới hạn mục 1 |
| Nhấp nháy mạnh | Độ sáng đổi mỗi frame, chói | `R-BURN-3`, giảm `peak` |
| Cháy trắng mất chi tiết | Mất hình ở đỉnh | Giảm `peak` |
| Chồng với rò sáng | Hai lớp phủ lộn xộn | `R-BURN-4` |
| Dùng ở nội dung hiện đại nghiêm túc | Lệch tông | `R-BURN-1/2` |

## 10. Kiểm tra sau render
- Lớp cháy lên đỉnh đúng điểm cắt rồi tan hết, hai đầu vùng hình sạch.
- Nhấp nháy ở mức chấp nhận được (không chói); không có chuỗi khung cháy trắng kéo dài.
- Chi tiết cảnh quan trọng vẫn thấy ở đỉnh.
- Không có cảnh báo clip quá ngắn.
