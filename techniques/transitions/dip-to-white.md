---
id: dip_to_white
name: Dip to White (Chói trắng rồi lên cảnh mới)
group: transitions
roles: [memory, dream, relief]
status: usable
source_of_values: convention
---

# Dip to White

## 1. Mục đích
Hình sáng chói dần lên trắng, cảnh mới hiện ra từ trắng. Gợi **hồi tưởng, giấc mơ, nhẹ nhõm, "mở ra"**; ấm và lạc quan hơn `dip_to_black`.

## 2. Khi nên dùng
- Chuyển sang hồi tưởng hoặc giấc mơ, kèm lời dẫn nhẹ nhàng.
- Cảm giác nhẹ nhõm, hy vọng, mở đầu giai đoạn mới tích cực (ví dụ từ khó khăn sang kết quả).
- Cả hai cảnh sáng, nhiều ánh nắng, tông ấm: trắng ăn khớp với tông ảnh.
- Style documentary: được phép (preset không cấm), tính vào `budget.special_transition` (0–2 mỗi video).

## 3. Khi không nên dùng
- Nội dung nghiêm trang, trang trọng, buồn: trắng chói không hợp (dùng `dip_to_black` hoặc `cross_dissolve`).
- Cảnh tối, ban đêm: chuyển từ tối lên trắng gây chói mắt người xem.
- Giữa các cảnh cùng đoạn (dip làm gãy nhịp; `hard_cut` đủ).
- Khi cần "kết thúc video" (dùng `fade_in_out` với `fade_out_white`).
- Khi footage có vùng cháy sáng sẵn: trắng chồng trắng mất chi tiết.
- Khi một clip ngắn hơn `duration/2` (mục 5).

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `duration` (tổng vùng chuyển) | 1.0 (`dip_to_white_standard`), 0.5 (`dip_to_white_quick`) | 0.4–1.5 (renderer chấp nhận 0.15–3.0) | giây | medium |
| `easing` | `ease_in_out` | `linear`, `ease_in`, `ease_out`, `ease_in_out` | – | medium |

Màu luôn là `#ffffff`, cố định bởi renderer; **không đặt `color` trong `parameters`**.

**Cách renderer làm** (`style: dip`, `overlap: false`, có lớp phủ): giống `dip_to_black` nhưng lớp phủ trắng. Độ đục tăng từ 0 đến 1 ở nửa đầu, giảm về 0 ở nửa sau; A hiện nửa đầu, B hiện nửa sau, đổi clip lúc trắng kín. Lớp phủ nằm dưới chữ (chữ trắng trên nền trắng sẽ biến mất; chữ tối vẫn thấy).

## 5. Quy trình thực hiện
1. Xác nhận lý do kể chuyện (hồi tưởng, nhẹ nhõm, mở giai đoạn mới). Không có thì `hard_cut`.
2. **Không cần tay cầm** (kiểu tuần tự, không chồng). Điểm cắt nằm giữa vùng; mỗi bên có hiệu ứng riêng ngay trong thân clip nên cả hai clip cần dài **≥ `duration/2`**. Thiếu thì renderer rút và cảnh báo.
3. Nửa cuối A bị sáng dần và nửa đầu B hiện từ trắng: tránh để lời nói then chốt hoặc chi tiết cần xem rơi vào đó.
4. Chọn `dip_to_white_standard` (1.0 s) hoặc `dip_to_white_quick` (0.5 s).
5. **Âm thanh:** chỉ tác động hình; muốn tiếng nối mượt hay chuyển cảnh âm thì thêm `j_l_cut` ở cùng điểm nối.
6. Tránh chữ trắng hoặc sáng trong vùng chuyển.

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `dip_to_white_standard` | 1.0 s |
| `dip_to_white_quick` | 0.5 s |

## 7. Quy tắc quyết định
- `R-DIPW-1`: chỉ dùng khi có lý do kể chuyện (hồi tưởng, giấc mơ, nhẹ nhõm); ghi `reason`.
- `R-DIPW-2`: NẾU nội dung trang trọng, buồn hoặc cảnh tối THÌ tránh, dùng `dip_to_black` hoặc `cross_dissolve`.
- `R-DIPW-3`: tối đa 2 mỗi video và cách chuyển cảnh đặc biệt khác ≥ 3 giây.
- `R-DIPW-4`: cả hai clip dài ≥ `duration/2`.
- `R-DIPW-5`: không đặt chữ sáng trong vùng chuyển.
- `R-DIPW-6`: không dùng trong đoạn đối thoại liên tục.

## 8. Ví dụ
Lời dẫn: "Và rồi, sau tất cả, họ đã làm được". Chuyển từ cảnh học viên ôn bài tối muộn (c08) sang cảnh trao chứng nhận ban ngày (c09), tông nhẹ nhõm.

```json
{
  "id": "d06",
  "technique": "dip_to_white",
  "preset": "dip_to_white_quick",
  "anchor": { "between": ["c08", "c09"] },
  "duration": 0.5,
  "parameters": { "duration": 0.5 },
  "reason": "Từ chặng vất vả sang kết quả tích cực; chói trắng gợi nhẹ nhõm, dùng bản nhanh để không quá phô",
  "priority": "storytelling",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Dùng ở nội dung trang trọng/buồn | Cảm xúc lệch, trắng chói lạc tông | `R-DIPW-2` |
| Chuyển từ cảnh tối | Mắt bị chói đột ngột | Chọn `dip_to_black` hoặc dissolve |
| Chữ trắng biến mất | Phụ đề hoặc tên chìm trong nền trắng | `R-DIPW-5` |
| Clip quá ngắn | Cảnh báo khi render, hiệu ứng bị rút | `R-DIPW-4` |
| Dùng thay cắt thẳng | Video "nháy" nhiều lần | `R-DIPW-1`, ngân sách |

## 10. Kiểm tra sau render
- Trắng kín đúng điểm cắt; không có frame "nhấp" cảnh khác.
- Mức chói chấp nhận được, không làm đau mắt; không mất chi tiết ở A hoặc B.
- Không có cảnh báo clip quá ngắn.
- Chữ trong vùng chuyển còn đọc được hoặc đã dời.
- Tiếng ở điểm nối liền, không "tạch".
