---
id: slow_push
name: Slow Push (Đẩy chậm)
group: camera-motion
roles: [emotion, attention, life]
status: usable
source_of_values: convention
---

# Slow Push

## 1. Mục đích
Phóng rất chậm và đều trong suốt một cảnh để tạo cảm giác tiến vào chủ thể, tăng cảm xúc, hoặc làm cho cảnh tĩnh "có hơi thở". Khác `punch_in`: không nhấn một điểm, mà dẫn dắt cảm xúc cả cảnh.

## 2. Khi nên dùng
- B-roll hoặc cảnh tĩnh (camera `static`) kéo dài ≥ ~4 giây, đặc biệt đoạn không lời.
- Khoảnh khắc cảm xúc, trang trọng, cần thời gian thấm.
- Cảnh mở hoặc kết video.
- Nguồn đủ độ phân giải (4K dựng ra 1080p là lý tưởng).

## 3. Khi không nên dùng
- Clip đã có chuyển động camera (dolly, pan, handheld): chồng thêm sẽ rối. Kiểm tra `camera` trong `clips.md`.
- Cùng clip với `punch_in` (hai chuyển động chồng nhau, `R-FREQ-4`).
- Cảnh dưới ~3 giây (không kịp cảm nhận).
- Cảnh có chữ quan trọng trên hình (slide) mà scale làm cắt mất mép chữ.
- Mọi clip trong video (mất tác dụng và gây say).
- Người nói đang cử động mạnh.

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `start_scale` | 1.0 | 1.0 | × | high |
| `end_scale` | 1.04 | 1.02–1.12 | × | medium |
| `duration` | 0 (đến hết clip) | 0 hoặc 3–15 | giây | medium |
| `easing` | `ease_in_out` | `linear`, `ease_in_out` | – | medium |
| `anchor_point` | `center` | `center`, `upper_third`, `face` | – | medium |

Tốc độ tham khảo: tăng khoảng 1–2% mỗi giây là gần như không nhận ra; trên 3% mỗi giây bắt đầu thành "zoom". Với `end_scale` 1.04 trên cảnh 8 giây, tốc độ ≈ 0.5%/giây.

## 5. Quy trình thực hiện
1. Xác nhận cảnh phù hợp (mục 2) và không chồng chuyển động (mục 3).
2. Chọn `end_scale` theo cảm xúc: 1.03–1.05 (tinh tế), 1.06–1.10 (rõ), >1.10 tránh.
3. `duration: 0` để đẩy suốt clip; hoặc đặt số giây rồi giữ nguyên ở scale cuối.
4. Chọn `anchor_point`: `center` cho cảnh rộng; `upper_third`/`face` cho người.
5. `ease_in_out` cho cảm giác mượt; `linear` khi cần tốc độ đều tuyệt đối.
6. Kiểm tra mép khung sau khi scale: không lộ viền đen (nguồn đã fill, nên không), không cắt chữ quan trọng.

## 6. Biến thể và preset
| Preset | `end_scale` | Dùng khi |
|---|---|---|
| `slow_push_subtle` | 1.04 | Documentary, mặc định |
| `slow_push_standard` | 1.08 | Sự kiện, social vừa phải |

`slow_pull` (kéo lùi) chưa hỗ trợ: dùng `start_scale` > 1 là sai vì renderer chỉ cho `end_scale` > 1; sẽ thêm khi cần.

## 7. Quy tắc quyết định
- `R-PUSH-1`: chỉ cho clip có `camera: static` (hoặc tương đương) và dài ≥ 4 giây.
- `R-PUSH-2`: không đồng thời `punch_in` trên cùng clip.
- `R-PUSH-3`: tối đa khoảng 1 `slow_push` mỗi 20–30 giây video trong documentary.
- `R-PUSH-4`: không dùng trên cảnh có chữ sẵn quan trọng sát mép khung.

## 8. Ví dụ
Cảnh toàn lớp học tĩnh 6 giây ở đầu video, không lời, tạo không khí chờ đợi trước khi bắt đầu.

```json
{
  "id": "d01",
  "technique": "slow_push",
  "preset": "slow_push_subtle",
  "anchor": { "clip": "c01", "source_time": 0.5 },
  "start_offset": 0,
  "duration": 6.0,
  "parameters": {},
  "reason": "Cảnh toàn lớp học tĩnh ở đầu video, đẩy rất chậm để dẫn người xem vào không khí trang trọng",
  "priority": "storytelling",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Chồng với chuyển động camera sẵn | Cảnh vừa dolly vừa zoom, chóng mặt | `R-PUSH-1` |
| Quá nhanh | Nhìn ra là "zoom" | Giữ ≤ 2%/giây |
| Dùng ở mọi cảnh | Cả video chuyển động đều đều | `R-PUSH-3` |
| Cắt chữ trên slide | Chữ sát mép bị cắt | `R-PUSH-4` |

## 10. Kiểm tra sau render
- Chuyển động không nhận ra là zoom ở tốc độ xem bình thường (với preset `subtle`).
- Khung hình cuối không cắt mất thông tin quan trọng.
- Không có khựng ở đầu hoặc cuối đẩy.
