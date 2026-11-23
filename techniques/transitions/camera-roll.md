---
id: camera_roll
name: Camera Roll (Camera nghiêng nhẹ rồi thẳng lại)
group: transitions
roles: [energy, subtle_motion, transition_in_motion]
status: usable
source_of_values: convention
---

# Camera Roll

## 1. Mục đích
Cảnh cũ nghiêng nhẹ (roll) kèm phóng nhẹ và nhòe nhẹ; cảnh mới bắt đầu nghiêng ngược chiều rồi thẳng lại. Cảm giác **máy nghiêng một nhịp rồi vào cảnh mới**, nhẹ và gọn hơn `spin_rotate`.

## 2. Khi nên dùng
- Video năng động vừa phải (vlog, recap sự kiện vui, chuyển hoạt động) cần một cú "nghiêng" nhẹ làm điểm nhấn.
- Chuyển giữa hai cảnh đời thường có cảm giác tay cầm máy, nơi nghiêng nhẹ trông tự nhiên.
- Nhịp nhạc trung bình đến nhanh, điểm cắt khớp nhịp.
- **Style documentary: bị cấm** (`camera_roll_soft` có `forbidden_styles: ["documentary"]`).

## 3. Khi không nên dùng
- Documentary, phỏng vấn, nội dung trang trọng hoặc cảm xúc.
- Cảnh có đường chân trời hoặc vật thẳng đứng nổi bật (nghiêng làm người xem tưởng lỗi máy).
- Giữa câu thoại hoặc đoạn có người nói.
- Cần xoay mạnh, "quay tít": dùng `spin_rotate`. Cần chỉ nhẹ nhõm: `hard_cut`.
- Dùng nhiều lần liên tiếp.
- Priority: Decoration.

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `duration` (tổng vùng) | 0.6 | 0.4–0.9 (renderer chấp nhận 0.15–3.0) | giây | low |
| `easing` | `ease_in_out` | enum chung | – | low |
| `direction` | `right` | `left`, `right` | – | low |
| `angle` (góc nghiêng cực đại) | 20 | 8–30 | độ | low |
| `scale` (phóng cực đại) | 1.2 | 1.1–1.6 | bội số | low |
| `blur` | 8 | 0–16 | px ở khung cao 1080 | low |

**Cách renderer làm** (`style: roll`, `overlap: false`): dùng chung mã với `spin` nhưng giá trị dự phòng nhỏ (20 độ, 1.2, 8). Nửa đầu chỉ có A: nghiêng đến `+angle` (chiều kim đồng hồ khi `right`), phóng đến `scale`, nhòe đến `blur`. Nửa sau chỉ có B: bắt đầu ở `-angle`, cùng `scale` và nhòe, rồi quay về 0 độ, `scale` 1, nhòe 0. Tâm xoay là tâm khung. **`easing` không được dùng** (đường cong cố định: tăng tốc cho A, giảm tốc cho B).

**Phủ kín khung:** renderer tự phóng tối thiểu để khung xoay luôn phủ kín màn hình (tham số `fill`, mặc định `true` trong preset; đặt `false` nếu muốn lộ nền đen có chủ đích). Đã xem trên preview 960×540 của hai clip thử: không thấy góc đen ở `spin_90` và `camera_roll_soft`. Phóng thêm làm hình mềm hơn ở nguồn độ phân giải thấp.

**Giới hạn hình học** (ước tính, cần xem preview): tại điểm cắt A ở `+angle` và B ở `-angle`, nên hình nhảy `2 × angle` (40 độ với preset). Để phủ kín khung 16:9 khi nghiêng 20 độ cần `scale` khoảng 1.55; preset đặt 1.2 nên có thể lộ nền đen ở mép trên/dưới quanh điểm cắt. Nhòe nhẹ chỉ che một phần.

## 5. Quy trình thực hiện
1. Xác nhận style không phải documentary, có lý do (điểm nhấn nhẹ, đổi hoạt động).
2. **Không cần tay cầm**: kiểu tuần tự; điểm cắt nằm giữa vùng, mỗi bên có hiệu ứng riêng ngay trong thân clip. Mỗi clip phải dài **≥ `duration/2`** (0.6 s thì ≥ 0.3 s). Thiếu thì renderer rút `duration` và cảnh báo.
3. Hiệu ứng ăn vào nửa cuối A và nửa đầu B; không đặt hành động then chốt ở đó.
4. Nếu lộ nền đen ở preview: tăng `scale` (hoặc giảm `angle` xuống ~10–12 độ).
5. Chọn preset `camera_roll_soft`.
6. **Âm thanh:** chỉ tác động hình; thêm `j_l_cut` hoặc `whoosh_synced_cut` nếu cần.

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `camera_roll_soft` | 0.6 s, nghiêng phải 20 độ, `scale` 1.2, `blur` 8 |

Phân biệt với `spin_rotate`: `camera_roll` là nghiêng nhẹ (góc ≈ 8–30 độ, ít nhòe), cảm giác máy nghiêng; `spin_rotate` xoay lớn (≥ 45 độ, phóng và nhòe mạnh), cảm giác quay tít.

## 7. Quy tắc quyết định
- `R-ROLL-1`: KHÔNG dùng ở style documentary.
- `R-ROLL-2`: chỉ dùng cho điểm nhấn nhẹ, năng động; ghi `reason`.
- `R-ROLL-3`: không dùng khi có người nói hoặc chân trời quan trọng ở A/B.
- `R-ROLL-4`: cả hai clip ≥ `duration/2`.
- `R-ROLL-5`: không quá 1–2 lần mỗi video; cách chuyển cảnh đặc biệt khác ≥ 3 giây.
- `R-ROLL-6`: nếu lộ nền đen, tăng `scale` hoặc giảm `angle`.

## 8. Ví dụ
Vlog tổng kết sự kiện (style `social`): từ cảnh gian hàng ngoài sân (c06) sang cảnh khán phòng bên trong (c07).

```json
{
  "id": "d06",
  "technique": "camera_roll",
  "preset": "camera_roll_soft",
  "anchor": { "between": ["c06", "c07"] },
  "duration": 0.6,
  "parameters": { "duration": 0.6, "direction": "right", "angle": 20 },
  "reason": "Chuyển từ gian hàng ngoài sân vào khán phòng, nghiêng nhẹ tạo điểm nhấn năng động",
  "priority": "style",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Dùng ở documentary | Validator báo lỗi style | `R-ROLL-1` |
| Lộ nền đen | Mép trên/dưới đen khi nghiêng | Tăng `scale`; giảm `angle` |
| Nhìn như lỗi máy | Chân trời nghiêng khó hiểu | `R-ROLL-3` |
| Tin `easing` đổi được | Đổi mà không khác | Chỉnh `angle`, `scale`, `blur`, `duration` |
| Nhầm với `spin_rotate` | Muốn nghiêng nhẹ mà góc quá lớn | Giữ `angle` ≤ 30 |

## 10. Kiểm tra sau render
- Nghiêng nhẹ, không lộ nền đen đáng kể.
- Điểm cắt (nhảy 2 × góc) được che bởi nhòe/phóng, không thấy lộ liễu.
- Hướng nghiêng đúng `direction`.
- Không có cảnh báo clip quá ngắn.
- Tiếng ở điểm nối không "tạch".
