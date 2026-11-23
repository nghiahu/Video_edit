---
id: luma_wipe
name: Luma Wipe (Quét theo dải chuyển sắc)
group: transitions
roles: [reveal, energy, structure]
status: usable
source_of_values: convention
---

# Luma Wipe

## 1. Mục đích
Cảnh mới lộ ra theo một **mẫu chuyển sắc có sẵn** (chéo, mành cuốn, tỏa tròn) thay vì một hình học đơn giản. Cho cảm giác "đồ họa" hơn wipe thẳng.

> Giới hạn quan trọng: luma wipe truyền thống đọc một ảnh xám (luma matte) bất kỳ. Ở thư viện này, renderer **không đọc ảnh luma tùy ý**; nó dựng mặt nạ bằng **dải chuyển sắc CSS** (`linear-gradient`, `repeating-linear-gradient`, `radial-gradient`) theo ba `pattern` cố định: `diagonal`, `blinds`, `radial`. Không có `pattern` nào khác.

## 2. Khi nên dùng
- Video quảng bá, công nghệ, nhạc, nhịp vừa đến nhanh, cần chuyển cảnh nổi nhưng không rườm.
- `diagonal`: chuyển giữa hai cảnh cùng nhóm nội dung, muốn mép quét mềm chéo.
- `blinds`: kiểu mành, hợp chủ đề văn phòng, thiết kế, công nghệ.
- `radial`: lộ hình tỏa từ tâm khung (gần mask reveal nhưng mép kiểm soát bằng `softness`).

## 3. Khi không nên dùng
- Style `documentary`: cả ba preset đều cấm.
- Đoạn lời thoại, phát biểu, nội dung cảm xúc.
- Khi đã dùng `wipe`/`mask_reveal` khác trong video: ba kiểu này trông tương tự, dễ thành lặp.
- Cần mẫu luma riêng của thương hiệu (ảnh matte tùy chỉnh): thư viện này không hỗ trợ.
- Thiếu tay cầm (xem mục 5).

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `duration` | 0.9 | 0.6–1.3 (renderer chấp nhận 0.15–3) | giây | low |
| `easing` | `ease_in_out` | 4 giá trị chuẩn | – | low |
| `pattern` | `diagonal` | `diagonal`, `blinds`, `radial` | – | low |
| `softness` | 18 (`blinds`: 0) | 0–40 | `diagonal`: % chiều dài dải; `radial`: nhân 5 ra pixel; `blinds`: **không dùng** | low |
| `bars` | 10 (chỉ `luma_wipe_blinds`) | 4–24 | số thanh | low |

Cách tính trong renderer (chỉ cảnh mới B bị mặt nạ):
- `diagonal`: gradient 135 độ (từ góc trên trái xuống góc dưới phải), mép mềm rộng `softness` % của dải.
- `blinds`: `bars` thanh dọc đều nhau, mỗi thanh nở từ mép trái của nó tới khi kín; mép luôn cứng, `softness` không có tác dụng.
- `radial`: vòng tròn từ tâm khung, mép mềm khoảng `softness × 5` pixel (tính theo khung hình thực, không co theo độ phân giải).
- `bars` không thuộc danh sách enum kiểm tra; bộ kiểm tra chỉ kiểm `duration`, `easing` và `pattern`.

## 5. Quy trình thực hiện
1. Xác nhận lý do (mở phần, nhịp quảng bá). Không có → `hard_cut`.
2. Kiểu này `overlap: true`: cần **tay cầm**: clip trước còn ≥ `duration/2` giây nguồn sau `source_out`; clip sau còn ≥ `duration/2` giây nguồn trước `source_in`. Renderer tự rút `duration` theo tay cầm dùng được và cảnh báo; không có thì thành cắt thẳng. Tổng độ dài không đổi.
3. Chọn `pattern` theo chủ đề: tech/đồ họa → `blinds` hoặc `radial`; chuyển mềm → `diagonal`.
4. Đặt `anchor.between`; không đặt chữ trong vùng nối.
5. Âm thanh không đổi theo hiệu ứng.

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `luma_wipe_diagonal` | Chéo mép mềm, `softness` 18, 0.9 s |
| `luma_wipe_blinds` | 10 thanh dọc nở ra, mép cứng, 0.9 s |
| `luma_wipe_radial` | Tỏa tròn từ tâm, `softness` 18, 0.9 s |

## 7. Quy tắc quyết định
- `R-LUMA-1`: NẾU `strategy.style` là `documentary` THÌ **tránh**.
- `R-LUMA-2`: chỉ dùng khi có lý do kể chuyện hoặc nhịp; ghi `reason`. Ưu tiên Storytelling > Rhythm > Style > Decoration.
- `R-LUMA-3`: NẾU yêu cầu một mẫu luma tùy chỉnh (ảnh matte) THÌ ghi nhận hạn chế, chọn `pattern` gần nhất hoặc kiểu khác; không giả vờ hỗ trợ.
- `R-LUMA-4`: không dùng nhiều `pattern` khác nhau trong cùng một video.
- `R-LUMA-5`: NẾU thiếu tay cầm THÌ rút `duration` hoặc `hard_cut`.
- `R-LUMA-6`: tính vào `budget.special_transition`; cách chuyển cảnh đặc biệt khác ≥ 3 giây.

## 8. Ví dụ
Video giới thiệu dịch vụ thiết kế: chuyển giữa hai cảnh phòng làm việc kiểu mành cuốn.

```json
{
  "id": "d03",
  "technique": "luma_wipe",
  "preset": "luma_wipe_blinds",
  "anchor": { "between": ["c02", "c03"] },
  "duration": 0.9,
  "parameters": { "duration": 0.9, "pattern": "blinds", "bars": 10, "softness": 0 },
  "reason": "Chuyển sang phần dịch vụ; mành cuốn hợp chủ đề văn phòng và thiết kế",
  "priority": "style",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Kỳ vọng đọc ảnh luma riêng | Không có chỗ nạp ảnh matte | `R-LUMA-3` |
| Đặt `softness` cho `blinds` | Không đổi gì, mép vẫn cứng | Biết `softness` bị bỏ qua ở `blinds` |
| `softness` lớn ở `radial` | Mép loang rộng, vòng không rõ | Giữ 10–25 |
| Trộn nhiều `pattern` | Video thiếu nhất quán | `R-LUMA-4` |
| Thiếu tay cầm | Hình đứng trong vùng nối | Mục 5 bước 2 |

## 10. Kiểm tra sau render
- Mẫu quét đúng `pattern` đã chọn; cuối vùng cảnh mới phủ kín, không sót thanh/mép.
- `blinds`: đủ số thanh `bars`, nở đều.
- Không đứng hình ở hai đầu vùng; không có cảnh báo tay cầm.
- Tiếng liền mạch tại điểm nối.
