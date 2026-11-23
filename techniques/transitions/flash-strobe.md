---
id: flash_strobe
name: Flash / Strobe (Chớp sáng)
group: transitions
roles: [impact, energy, beat_sync]
status: usable
source_of_values: convention
---

# Flash / Strobe

## 1. Mục đích
Một lớp màu (mặc định trắng) **chớp lên phủ cả khung** quanh điểm cắt rồi tắt; cảnh đổi khi khung đang sáng nhất. Tạo cú nhấn tức thì, hợp nhịp mạnh, ảnh chụp, đèn sân khấu. Biến thể `strobes > 1` chớp nhiều lần.

## 2. Khi nên dùng
- Video âm nhạc, sự kiện sôi động, thể thao, quảng bá: nhấn điểm cắt trên một nhịp trống rõ.
- Một cú `flash_white` (1 lần) khi cần "ánh đèn máy ảnh" hoặc "bùng nổ" ở chuyển ý lớn.
- Chuyển giữa hai cảnh khác hẳn nhau về địa điểm/nhịp, cần che chỗ nhảy.

## 3. Khi không nên dùng
- Style `documentary`: cả hai preset đều cấm.
- Nội dung nghiêm túc, cảm xúc; tối/ban đêm cần mắt thích nghi.
- Khán giả có thể là người nhạy sáng, trẻ em, hoặc video đăng nơi công cộng: xem mục An toàn.
- Hai lần chớp cách nhau gần (xem An toàn); chớp nhiều lần liên tục trong cùng video.
- Cảnh trước/sau đã sáng gần trắng (hiệu ứng mất tác dụng).

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `duration` (tổng vùng) | 0.3 (`flash_white`) / 1.0 (`flash_strobe_3`) | 0.2–0.6 cho 1 chớp (renderer chấp nhận 0.15–3) | giây | low |
| `color` | `#ffffff` | màu hex | – | low |
| `sharpness` | 2.2 (`flash_white`) / 1.6 (`flash_strobe_3`) | 1–4 (lớn hơn = chớp gọn hơn) | – | low |
| `strobes` | 1 / 3 | 1–3 | số nhịp chớp | low |
| `peak` | 1 | 0.3–1 | độ đục tối đa của lớp phủ | low |
| `easing` | `linear` | – | **renderer không dùng** `easing` cho kiểu này | low |

Cách hiện thực: lớp phủ toàn khung có độ đục = `sin(π·p)^sharpness × peak` (p = tiến độ 0..1), đạt đỉnh ở giữa vùng. Với `strobes > 1`, độ đục nhân thêm hệ số `0.55 + 0.45·|cos(π·strobes·p)|` (khoảng 0.55–1), nên là điều biến độ sáng chứ không tắt hẳn giữa các nhịp. Kiểu này `overlap: false`: điểm cắt ở giữa vùng khi khung đang sáng nhất.

## An toàn (bắt buộc đọc)
Chớp sáng liên tục nhanh có thể gây khó chịu hoặc nguy hiểm với người nhạy sáng. Theo tinh thần hướng dẫn WCAG 2.3.1 và quy ước ngành phát sóng (không phải kiểm định):
- **Không quá 3 lần chớp trong bất kỳ 1 giây.**
- **Không quá 3 lần chớp trong một chuyển cảnh** (`strobes` ≤ 3).
- Tránh chớp đỏ bão hòa.
- Hai chuyển cảnh chớp cách nhau tối thiểu 3 giây (khớp quy tắc cách nhau của thư viện).

Giới hạn an toàn (renderer kiểm tra): khi `strobes` > 1 thì `strobes / duration` phải ≤ 3 (tối đa 3 lần chớp mỗi giây), nếu không `validate` báo lỗi. Preset `flash_strobe_3` vì vậy đặt `duration: 1.0` cho 3 chớp. Một chớp đơn (`flash_white`) không bị giới hạn này.

## 5. Quy trình thực hiện
1. Xác nhận lý do và kiểm tra An toàn. Không chắc khán giả → dùng `flash_white` (1 chớp) hoặc `hard_cut`.
2. Kiểu này `overlap: false`: **không cần tay cầm**. Cảnh đổi giữa vùng; mỗi bên hiện hình bình thường dưới lớp sáng. Mỗi clip phải đủ dài **≥ `duration/2`**; ngắn hơn renderer rút `duration` và cảnh báo.
3. Chọn preset; kiểm tra `strobes / duration ≤ 3`.
4. Đặt `anchor.between`; căn điểm cắt đúng nhịp nếu có nhạc.
5. Không đặt chữ trong vùng chớp (bị lấn sáng).

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `flash_white` | Một chớp trắng 0.3 s |
| `flash_strobe_3` | 3 nhịp chớp trong 1.0 s (đúng giới hạn 3 lần/giây) |

## 7. Quy tắc quyết định
- `R-FLASH-1`: NẾU `strategy.style` là `documentary` THÌ **tránh**.
- `R-FLASH-2`: chỉ dùng khi có nhịp/va chạm cần nhấn; ghi lý do. Ưu tiên Storytelling > Rhythm > Style > Decoration.
- `R-FLASH-3`: `strobes` ≤ 3 và `strobes / duration` ≤ 3 (không quá 3 chớp/giây).
- `R-FLASH-4`: NẾU khán giả chưa rõ hoặc video công khai rộng THÌ ưu tiên `flash_white` hoặc bỏ.
- `R-FLASH-5`: hai chuyển cảnh chớp cách nhau ≥ 3 giây; tính vào `budget.special_transition`.
- `R-FLASH-6`: tránh `color` đỏ bão hòa; giữ trắng hoặc màu thương hiệu dịu.

## 8. Ví dụ
Video highlight hội thao: chuyển từ pha xuất phát sang pha về đích trên một nhịp trống.

```json
{
  "id": "d08",
  "technique": "flash_strobe",
  "preset": "flash_white",
  "anchor": { "between": ["c06", "c07"] },
  "duration": 0.3,
  "parameters": { "duration": 0.3, "color": "#ffffff", "sharpness": 2.2, "strobes": 1, "peak": 1 },
  "reason": "Nhấn chuyển sang pha về đích đúng nhịp trống; một chớp duy nhất để an toàn",
  "priority": "rhythm",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Ghi đè `strobes`/`duration` vượt 3 lần/giây | `validate` báo lỗi | Tăng `duration` hoặc giảm `strobes`, hoặc dùng `flash_white` |
| Chớp liên tiếp nhiều điểm nối | Màn hình nhấp nháy dồn dập | `R-FLASH-5` |
| Chớp đỏ bão hòa | Chói mắt, khó chịu | `R-FLASH-6` |
| Chữ nằm trong vùng chớp | Chữ biến mất | Dời chữ |
| Dùng ở cảnh đã sáng | Không thấy hiệu ứng | Đổi kiểu nối |

## 10. Kiểm tra sau render
- Đếm số lần chớp trong 1 giây quanh điểm nối: ≤ 3.
- Đỉnh sáng trùng điểm cắt; cảnh mới hiện sạch sau vùng.
- Không có khung hình bị cháy trắng kéo dài.
- Điểm chớp gần nhất cách ≥ 3 giây.
