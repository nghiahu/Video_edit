---
id: text_graphic_wipe
name: Text / Graphic Wipe (Tấm đồ họa quét ngang)
group: transitions
roles: [branding, section_break, energy]
status: usable
source_of_values: convention
---

# Text / Graphic Wipe

## 1. Mục đích
Một **tấm màu (mặc định đỏ thương hiệu `#B91C2C`) quét ngang qua khung**, che kín ở giữa vùng (lúc đó cảnh đổi) rồi trượt tiếp ra ngoài. Có thể kèm một dòng chữ ngắn (tên phần, tên thương hiệu). Dùng làm "ngăn chương" mang nhận diện thương hiệu.

## 2. Khi nên dùng
- Video có cấu trúc chương/phần rõ, cần ngăn phần bằng tên hoặc logo chữ.
- Video quảng bá, giới thiệu chương trình, đào tạo có nhận diện thương hiệu.
- Cần che chỗ nhảy giữa hai cảnh khác hẳn nhau và đồng thời hiện tên phần.

## 3. Khi không nên dùng
- Style `documentary`: preset cấm (trang trí lộ liễu; có lower third riêng cho thông tin).
- Chuyển trong cùng một phần: tấm che kín khung làm đứt mạch.
- Đoạn lời thoại, phát biểu liên tục.
- Chữ dài (> 6 từ) hoặc chữ nhỏ cần đọc kỹ (thời gian chữ rõ ngắn, xem mục 4).
- Quá nhiều lần trong một video (tấm che kín khung gây mỏi).

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `duration` (tổng vùng, cảnh đổi ở giữa) | 1.1 | 0.9–1.8 (renderer chấp nhận 0.15–3) | giây | low |
| `direction` | `right` | `left`, `right` (xem ghi chú) | – | low |
| `color` | `#B91C2C` | màu hex | – | low |
| `text` | `""` (rỗng) | 0–6 từ | chuỗi | low |
| `text_color` | `#ffffff` | màu hex, tương phản với `color` | – | low |
| `font_size` | 96 | 64–140 | px ở 1080p (co theo độ phân giải) | low |
| `easing` | `ease_in_out` | – | **renderer không dùng** `easing` cho kiểu này (tấm đi vào dùng ease-out, đi ra dùng ease-in cố định) | low |

Cách hiện thực: lớp phủ toàn khung. Nửa đầu vùng, tấm trượt vào (giảm tốc) tới khi **phủ kín khung đúng giữa vùng**; nửa sau trượt tiếp ra phía cùng hướng (tăng tốc). Chữ dùng **Inter đậm (800)**, khoảng cách chữ hẹp −0.02em, hiện trên tấm, mờ dần khi tấm rời giữa, dịch ngược chiều nhẹ (hiệu ứng thị sai). Khi `text` rỗng chỉ có tấm màu.

Ghi chú `direction`: engine chỉ chuyển động ngang, nên `validate` chỉ chấp nhận `left` hoặc `right` (`up`/`down` bị báo lỗi).

Khả năng đọc của chữ (suy từ công thức, chưa đo): chữ chỉ rõ nhất khi tấm phủ kín; độ đục chữ ≥ 0.8 trong khoảng nửa giữa của vùng, tức ~0.55 s với `duration` 1.1. Vì vậy: tối đa **6 từ**, nên 1–3 từ; nếu hơn 3 từ thì tăng `duration` ≥ 1.6 s. Chưa xác nhận renderer tự xuống dòng nên giữ chữ ngắn để vừa chiều ngang khung. Màu chữ và màu tấm phải tương phản đủ đọc (ví dụ trắng trên đỏ `#B91C2C`).

## 5. Quy trình thực hiện
1. Xác nhận điểm nối là ranh giới phần/chương. Không phải → `hard_cut` hoặc kiểu nhẹ hơn.
2. `overlap: false`: **không cần tay cầm**. Cảnh cũ hiện đến giữa vùng, cảnh mới hiện từ giữa vùng, lúc đó tấm đang phủ kín nên chỗ đổi bị che. Mỗi clip phải đủ dài **≥ `duration/2`** (0.55 s với preset); ngắn hơn renderer rút `duration` và cảnh báo.
3. Chọn `text` (tên phần, ≤ 6 từ, tốt nhất 1–3 từ) hoặc để trống nếu chỉ cần tấm màu.
4. Dùng màu thương hiệu (mặc định đỏ `#B91C2C`) và phông Inter đậm; kiểm tra tương phản.
5. Đặt `anchor.between`; không đặt chữ khác trong vùng.
6. Âm thanh không đổi theo hiệu ứng; có thể đệm bằng nhạc nối chương.

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `text_graphic_wipe_brand` | Tấm đỏ thương hiệu quét sang phải, 1.1 s, `text` rỗng, chữ trắng 96 px |

## 7. Quy tắc quyết định
- `R-TGW-1`: NẾU `strategy.style` là `documentary` THÌ **tránh**.
- `R-TGW-2`: chỉ dùng ở ranh giới phần/chương; ghi lý do. Ưu tiên Storytelling > Clarity > Style > Decoration.
- `R-TGW-3`: `text` ≤ 6 từ (khuyến nghị 1–3); NẾU > 3 từ THÌ `duration` ≥ 1.6 s.
- `R-TGW-4`: `direction` chỉ `left` hoặc `right`.
- `R-TGW-5`: màu chữ tương phản đủ với `color` (đọc rõ khi tấm phủ kín); phông Inter đậm.
- `R-TGW-6`: mỗi clip kề ≥ `duration/2`; cách chuyển cảnh đặc biệt khác ≥ 3 giây; tính vào `budget.special_transition`.

## 8. Ví dụ
Video giới thiệu khóa học: ngăn sang phần "Lộ trình học".

```json
{
  "id": "d04",
  "technique": "text_graphic_wipe",
  "preset": "text_graphic_wipe_brand",
  "anchor": { "between": ["c03", "c04"] },
  "duration": 1.1,
  "parameters": { "duration": 1.1, "direction": "right", "color": "#B91C2C", "text": "Lộ trình học", "text_color": "#ffffff", "font_size": 96 },
  "reason": "Ngăn sang phần Lộ trình học; tấm thương hiệu che chỗ đổi cảnh và hiện tên phần",
  "priority": "clarity",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Chữ quá dài | Không đọc kịp hoặc tràn khung | `R-TGW-3` |
| `direction` `up`/`down` | `validate` báo lỗi (engine chỉ dịch ngang) | `R-TGW-4` |
| Chữ tương phản thấp | Khó đọc khi đổi `color` | `R-TGW-5` |
| Dùng giữa cùng một phần | Đứt mạch | Chỉ dùng ở ranh giới phần |
| Kỳ vọng `easing` có tác dụng | Không đổi gì | Xem bảng thông số |

## 10. Kiểm tra sau render
- Tấm phủ kín khung đúng giữa vùng; cảnh đổi khi tấm kín, không lộ nhảy hình.
- Chữ đọc trọn vẹn khi tấm phủ kín, không bị cắt cạnh khung; phông là Inter đậm.
- Tấm trượt ra hết; không còn viền màu ở đầu/cuối.
- Không có cảnh báo clip quá ngắn.
