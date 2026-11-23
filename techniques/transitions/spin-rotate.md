---
id: spin_rotate
name: Spin / Rotate (Xoay và phóng)
group: transitions
roles: [energy, playful, transition_in_motion]
status: usable
source_of_values: convention
---

# Spin / Rotate

## 1. Mục đích
Cảnh cũ xoay và phóng to (kèm nhòe), cảnh mới xuất hiện đang xoay ngược rồi quay về thẳng. Cảm giác **xoay tròn, vui nhộn, bất ngờ**, mạnh hơn `camera_roll` (chỉ nghiêng nhẹ).

## 2. Khi nên dùng
- Video vui, trẻ trung, giải trí hoặc quảng bá năng động (cổ động, hoạt náo).
- Chuyển giữa hai cảnh khác hẳn nhau về chủ đề mà người làm muốn tạo cú "xoay" có chủ đích.
- Nhịp nhạc nhanh, điểm cắt khớp nhịp.
- **Style documentary: bị cấm** (`spin_90` có `forbidden_styles: ["documentary"]`; `spin_rotate` là chuyển cảnh trang trí).

## 3. Khi không nên dùng
- Documentary, phỏng vấn, nội dung trang trọng hoặc cảm xúc.
- Cảnh có đường chân trời hoặc vật thẳng đứng quan trọng (xoay làm người xem mất định hướng).
- Giữa câu thoại hoặc đoạn có người nói.
- Người xem nhạy cảm với chuyển động xoay (nguy cơ chóng mặt); xoay mạnh lặp lại càng tệ.
- Cần nghiêng nhẹ thay vì xoay hẳn: dùng `camera_roll`.
- Priority: Decoration.

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `duration` (tổng vùng) | 0.6 | 0.4–1.0 (renderer chấp nhận 0.15–3.0) | giây | low |
| `easing` | `ease_in_out` | enum chung | – | low |
| `direction` | `right` | `left`, `right` | – | low |
| `angle` (góc xoay cực đại) | 90 | 45–180 | độ | low |
| `scale` (phóng cực đại) | 1.4 | 1.2–2.0 | bội số | low |
| `blur` | 16 | 0–30 | px ở khung cao 1080 | low |

**Cách renderer làm** (`style: spin`, `overlap: false`): nửa đầu chỉ có A: xoay đến `angle` (cùng chiều kim đồng hồ khi `right`, ngược khi `left`), phóng đến `scale`, nhòe đến `blur` (tăng tốc cuối). Nửa sau chỉ có B: bắt đầu ở góc **`-angle`** (ngược chiều), cùng `scale` và nhòe tối đa, rồi xoay về 0 độ, `scale` 1, nhòe 0 (giảm tốc cuối). Trục xoay là tâm khung. **`easing` trong preset không được dùng** (đường cong cố định). Mã đặt giá trị dự phòng 120 độ, 1.5, 18 nếu thiếu; preset đặt 90, 1.4, 16.

**Phủ kín khung:** renderer tự phóng tối thiểu để khung xoay luôn phủ kín màn hình (tham số `fill`, mặc định `true` trong preset; đặt `false` nếu muốn lộ nền đen có chủ đích). Đã xem trên preview 960×540 của hai clip thử: không thấy góc đen ở `spin_90` và `camera_roll_soft`. Phóng thêm làm hình mềm hơn ở nguồn độ phân giải thấp.

**Giới hạn hình học** (ước tính, cần xem preview): tại điểm cắt, A ở `+angle`, B ở `-angle`, nghĩa là hình nhảy `2 × angle` (với 90 độ là 180 độ, tức lộn ngược) và chỉ được che bởi nhòe và phóng. Khung 16:9 xoay 90 độ với `scale` 1.4 không phủ kín (cần khoảng 1.78), nên nền đen có thể lộ ở hai mép trên/dưới quanh điểm cắt.

## 5. Quy trình thực hiện
1. Xác nhận style không phải documentary, có lý do (vui nhộn, nhịp nhạc).
2. **Không cần tay cầm**: kiểu tuần tự; điểm cắt nằm giữa vùng, mỗi bên có hiệu ứng riêng ngay trong thân clip. Mỗi clip phải dài **≥ `duration/2`** (0.6 s thì ≥ 0.3 s). Thiếu thì renderer rút `duration` và cảnh báo.
3. Hiệu ứng ăn vào nửa cuối A và nửa đầu B; không đặt hành động then chốt ở đó.
4. Nếu thấy lộ nền đen hoặc chóng mặt ở preview: tăng `scale`, giảm `angle` hoặc chuyển sang `camera_roll`.
5. Chọn preset `spin_90`.
6. **Âm thanh:** chỉ tác động hình; thêm `whoosh_synced_cut` hoặc `j_l_cut` nếu cần.

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `spin_90` | 0.6 s, xoay phải 90 độ, `scale` 1.4, `blur` 16 |

Phân biệt: `spin_rotate` xoay mạnh (góc lớn), có nhòe, cảm giác "quay tít"; `camera_roll` chỉ nghiêng nhẹ (góc nhỏ), cảm giác máy nghiêng rồi thẳng lại.

## 7. Quy tắc quyết định
- `R-SPIN-1`: KHÔNG dùng ở style documentary.
- `R-SPIN-2`: chỉ dùng cho nội dung vui/năng động có chủ đích; ghi `reason`.
- `R-SPIN-3`: không dùng khi có người nói hoặc cảnh có chân trời quan trọng.
- `R-SPIN-4`: cả hai clip ≥ `duration/2`.
- `R-SPIN-5`: tối đa 1 lần mỗi video; cách chuyển cảnh đặc biệt khác ≥ 3 giây.
- `R-SPIN-6`: nếu lộ nền đen ở preview thì tăng `scale` hoặc giảm `angle`.

## 8. Ví dụ
Video hoạt náo (style `social`): từ cảnh đội thi đấu (c03) xoay sang cảnh khán giả cổ vũ (c04).

```json
{
  "id": "d03",
  "technique": "spin_rotate",
  "preset": "spin_90",
  "anchor": { "between": ["c03", "c04"] },
  "duration": 0.6,
  "parameters": { "duration": 0.6, "direction": "right", "angle": 90 },
  "reason": "Chuyển năng lượng cao từ đội thi sang khán giả cổ vũ, xoay vui nhộn đúng nhịp nhạc",
  "priority": "style",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Dùng ở documentary | Validator báo lỗi style | `R-SPIN-1` |
| Lộ nền đen | Hai mép hoặc góc đen khi xoay | Tăng `scale`; giảm `angle` |
| Điểm cắt nhảy 180 độ | Hình lộn ngược đột ngột dù có nhòe | Giảm `angle`; chuyển `camera_roll` |
| Chóng mặt | Xoay quá lớn, lặp nhiều lần | `R-SPIN-5`, giảm góc |
| Tin `easing` đổi được | Đổi mà không khác | Chỉnh `angle`, `scale`, `blur`, `duration` |
| Nhầm với `camera_roll` | Xoay mạnh khi muốn nghiêng nhẹ | Xem mục 6 |

## 10. Kiểm tra sau render
- Không lộ nền đen đáng kể ở vùng giữa.
- Điểm cắt được che bằng nhòe/phóng, không thấy lộn ngược lộ liễu.
- Hướng xoay đúng `direction`; không quá mức gây chóng mặt.
- Không có cảnh báo clip quá ngắn.
- Tiếng ở điểm nối không "tạch".
