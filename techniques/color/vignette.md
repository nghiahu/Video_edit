---
id: vignette
name: Vignette (Tối viền khung)
group: color
roles: [focus, mood]
status: usable
source_of_values: convention
---

# Vignette

## 1. Mục đích
Làm tối nhẹ vùng mép khung để dồn mắt vào giữa và tạo cảm giác khép, ấm, tập trung. Khi dùng đúng, người xem không nhận ra có vignette.

## 2. Khi nên dùng
- Cảnh chủ thể ở giữa, nền mép sáng hoặc rối (hành lang, cửa sổ sáng, người đi lại ở rìa).
- Khoảnh khắc cần tập trung hoặc cảm xúc (kèm `slow_push`, nhạc êm).
- Đồng bộ nhẹ cho nhiều clip như một lớp hoàn thiện.

## 3. Khi không nên dùng
- Chủ thể ở mép khung hoặc có thông tin quan trọng ở góc (slide lệch, chữ trên hình).
- Footage đã tối, hoặc cảnh cần không khí thoáng, sáng.
- Cường độ cao làm rõ ra "viền đen" (trông như lỗi).
- Style cần hình sạch tin tức/tài liệu mà không cần cảm xúc.
- Chồng nhiều lớp (grade mạnh + vignette mạnh + hiệu ứng khác): hình nặng nề.

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `strength` (độ tối ở mép) | 0.22 | 0.10–0.40 (tối đa 0.5) | 0–1 | medium |
| `softness` (bán kính vùng sáng nguyên) | 0.55 | 0.40–0.70 | tỉ lệ | medium |
| `ramp` (vào/ra mượt) | 0.3 | 0.2–0.6 | giây | medium |
| `duration` (trường của quyết định) | 0 (hết clip) | 0 hoặc > 0 | giây | – |

`softness` càng lớn, vùng sáng nguyên ở giữa càng rộng và vùng tối càng hẹp, nhưng chuyển từ sáng sang tối ở rìa gắt hơn.

## 5. Quy trình thực hiện
1. Kiểm tra mép khung không chứa nội dung cần thấy.
2. Chọn `vignette_subtle` (mặc định). Chỉ lên `vignette_standard` khi nền mép thật sự gây xao nhãng.
3. `duration: 0` để phủ cả clip; hoặc đặt số giây cho một đoạn (vào/ra mượt theo `ramp`).
4. Nếu dùng cho nhiều clip, dùng **cùng** `strength` để đồng bộ.
5. Xem preview: nếu nhận ra có viền tối, giảm `strength`.

## 6. Biến thể và preset
| Preset | `strength` | Dùng khi |
|---|---|---|
| `vignette_subtle` | 0.22 | Mặc định, gần như không nhận ra |
| `vignette_standard` | 0.35 | Nền mép rối, cần dồn mắt rõ hơn |

## 7. Quy tắc quyết định
- `R-VIG-1`: chỉ khi chủ thể ở giữa và mép khung không có thông tin cần thấy.
- `R-VIG-2`: `strength` ≤ 0.4 trừ lý do rõ ràng; documentary ≤ 0.25.
- `R-VIG-3`: không kết hợp với `color_grade_basic` mạnh trên cùng clip.
- `R-VIG-4`: nếu bỏ vignette mà video không tệ hơn → bỏ.

## 8. Ví dụ
Cảnh toàn lớp học tĩnh, nền mép có cửa sổ sáng. Thêm vignette nhẹ cho cả clip.

```json
{
  "id": "d10",
  "technique": "vignette",
  "preset": "vignette_subtle",
  "anchor": { "clip": "c01", "source_time": 0.5 },
  "duration": 0,
  "parameters": {},
  "reason": "Dồn mắt vào giữa lớp học, giảm ánh sáng gắt ở mép trái",
  "priority": "style",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Quá đậm | Thấy rõ viền đen, trông như lỗi | Giảm `strength` ≤ 0.25 |
| Che thông tin ở góc | Slide/chữ góc bị tối | `R-VIG-1` |
| Áp cho vài clip | Clip có clip không, nhấp nháy tông | Dùng đồng đều hoặc chỉ cảnh có lý do |
| Dùng thay thế bố cục xấu | Hình mép rối vẫn rối | Sửa bố cục/cắt hình thay vì vignette |

## 10. Kiểm tra sau render
- Không nhận ra viền tối khi xem ở tốc độ bình thường (với `subtle`).
- Chủ thể và chữ quan trọng không bị tối đi.
- Vào/ra mượt, không có "bật tắt" đột ngột.
