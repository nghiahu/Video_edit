---
id: punch_out
name: Punch-out (Lùi ra mở khung)
group: camera-motion
roles: [release, reveal, closure]
status: usable
source_of_values: convention
---

# Punch-out

## 1. Mục đích
Clip bắt đầu ở khung đã **zoom nhẹ** rồi **lùi ra** về khung gốc, để mở không gian, nhả căng thẳng hoặc khép lại một ý. Đối nghịch của `punch_in`: punch_in dồn sự chú ý vào, punch_out thả ra.

## 2. Khi nên dùng
- Sau một ý nặng, khi cần "thở" và cho thấy bối cảnh rộng hơn.
- Mở cảnh: bắt đầu tập trung vào chủ thể rồi mở ra toàn cảnh (reveal).
- Kết đoạn hoặc kết video: lùi ra tạo cảm giác khép lại.
- Hai clip cùng người nói, cùng khung nối nhau: khung sau bắt đầu hơi zoom rồi lùi, làm mới hình và che nhảy hình nhẹ.

## 3. Khi không nên dùng
- Ngay sau một `punch_in` (cặp zoom vào/ra liền nhau gây cảm giác nhịp cơ học) trừ khi có chủ đích.
- Clip có camera chuyển động sẵn (dolly, pan, rung).
- Nguồn không đủ độ phân giải để zoom sẵn (zoom 1.08 trên nguồn 1080p dựng 1080p làm mềm hình).
- Clip quá ngắn (< 2 giây): chưa kịp cảm nhận.
- Khoảnh khắc cần giữ khung chặt cho cảm xúc.
- Chồng với `slow_push` trên cùng clip.

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `start_scale` | 1.08 | 1.05–1.15 (tối đa 1.3) | × | medium |
| `duration` (thời gian lùi) | 1.0 (subtle) / 0.9 (standard) | 0.5–1.2 (cho phép 0.3–1.5) | giây | medium |
| `easing` | `ease_in_out` | `ease_in_out`, `ease_out_cubic`, `ease_out_quad` | – | medium |
| `anchor_point` | `upper_third` | `upper_third`, `center`, `face` | – | medium |
| `start_offset` | 0 | 0–1.0 | giây | low |

Trước thời điểm bắt đầu lùi, khung giữ ở `start_scale` (nghĩa là clip mở đã zoom sẵn). Đặt `start_offset` > 0 để giữ khung zoom thêm một lúc rồi mới lùi.

## 5. Quy trình thực hiện
1. Xác định vị trí cần "thả": sau ý nặng, đầu cảnh mở, hoặc cuối đoạn.
2. Kiểm tra điều kiện ở mục 3 (camera, độ phân giải, khoảng cách với `punch_in`).
3. Chọn preset (`punch_out_subtle` cho documentary).
4. Neo vào clip, `source_time` ở điểm bắt đầu lùi (thường đầu clip).
5. Chọn `anchor_point`: giữ mắt trong 1/3 trên.
6. Kiểm tra khung đầu clip (đã zoom) và khung cuối (về 1.0): bố cục đều ổn, không cắt đầu.

## 6. Biến thể và preset
| Preset | `start_scale` | Dùng khi |
|---|---|---|
| `punch_out_subtle` | 1.08 | Documentary, mở/kết nhẹ |
| `punch_out_standard` | 1.15 | Sự kiện, social vừa phải |

## 7. Quy tắc quyết định
- `R-OUT-1`: dùng khi cần "thả" sau ý nặng, mở cảnh hoặc kết đoạn; không dùng chỉ để trang trí.
- `R-OUT-2`: không liền ngay sau `punch_in` (cách ≥ 3 giây) và không chồng `slow_push`/chuyển động camera sẵn.
- `R-OUT-3`: kiểm tra độ phân giải nguồn như `punch_in`.
- `R-FREQ-1` áp dụng chung cho các chuyển động zoom: tránh dồn dập.

## 8. Ví dụ
Clip kết video: diễn giả nói câu khép lại. Clip bắt đầu ở khung hơi zoom, lùi ra để mở không gian.

```json
{
  "id": "d11",
  "technique": "punch_out",
  "preset": "punch_out_subtle",
  "anchor": { "clip": "c04", "source_time": 5.0 },
  "start_offset": 0,
  "duration": 0.8,
  "parameters": {},
  "reason": "Câu khép lại của diễn giả; lùi ra mở khung để kết đoạn êm",
  "priority": "storytelling",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Khung zoom ngay từ frame đầu trông lạ | Khung đầu clip bị chặt bất thường | Dùng ở nơi có lý do (reveal/kết) |
| Ngay sau punch_in | Vào rồi ra liền, nhịp cơ học | Cách ≥ 3 giây |
| Nguồn thấp phân giải | Hình mềm ở khung zoom | Kiểm tra `resolution` nguồn |
| Chồng chuyển động camera | Cảnh vừa dolly vừa lùi | Bỏ |

## 10. Kiểm tra sau render
- Chuyển động lùi mượt, không khựng ở cuối.
- Khung đầu clip (đã zoom) vẫn có bố cục tốt, không cắt đỉnh đầu.
- Điểm bắt đầu lùi khớp nhịp nội dung.
