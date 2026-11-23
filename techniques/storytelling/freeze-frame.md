---
id: freeze_frame
name: Freeze Frame (Đóng băng khung hình)
group: storytelling
roles: [emphasis, punctuation, hold]
status: usable
source_of_values: convention
---

# Freeze Frame

## 1. Mục đích
Dừng hình tại một khoảnh khắc để người xem "chụp" lấy nó: nụ cười, cái bắt tay, cú nâng cúp, khoảnh khắc chốt trước khi chuyển ý. Là dấu chấm câu bằng hình ảnh.

## 2. Khi nên dùng
- Một khoảnh khắc hình ảnh rõ nét và có ý nghĩa (khung hình đẹp, mọi người nhìn vào máy, biểu cảm đỉnh điểm) mà chuyển động xung quanh không cần xem tiếp.
- Cần chỗ để **một chữ** hoặc tiêu đề xuất hiện trên khung tĩnh (tên, năm, con số) mà không cạnh tranh với chuyển động.
- Kết một đoạn hoặc cả video bằng "ảnh chụp kỷ niệm".
- Hợp với **documentary** ở mức tiết chế (preset không cấm style nào), nhưng chỉ khi khoảnh khắc đó thật sự là điểm nhấn của câu chuyện (Storytelling > Decoration).

## 3. Khi không nên dùng
- Khung đang nhòe chuyển động, nhắm mắt, mặt méo, hoặc người trong khung đang giữa cử động: ảnh đứng xấu hơn video.
- Đang có lời thoại quan trọng: tiếng bị tắt suốt lúc đóng băng (xem mục 4).
- Khung hình không có gì đáng nhìn kỹ (chỉ để kéo dài thời lượng): đó là **lấp chỗ**, không phải kể chuyện.
- Quá nhiều lần trong một video: mất giá trị nhấn và làm ngắt nhịp.
- Khi cần giữ đúng đồng bộ với lời thoại hoặc nhạc theo thời lượng nguồn (clip dài ra làm các mốc sau dịch, xem `R-FREEZE-4`).

## 4. Thông số
| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `hold` | 1 (`freeze_hold_1s`); 2 (`freeze_hold_2s`) | 0,3–5 (kiểm tra hợp lệ); thực tế 0,8–2,5 | giây | medium |
| `anchor.source_time` | – | trong `[source_in, source_out]` của clip | giây nguồn | – |

Cách renderer làm:
- Chèn một đoạn `freeze` dài `hold` giây **ngay trước** đoạn phát tiếp tục tại `source_time`. Khung được giữ là khung nguồn tại `source_time`; hình gốc sau điểm đó vẫn phát tiếp **không mất khung nào**.
- Clip dài ra đúng `hold` giây (cộng vào tổng thời lượng).
- **Tiếng bị tắt trong lúc đóng băng**; tiếng gốc của clip dừng rồi tiếp tục khi hình chạy lại (không kéo giãn).
- `duration` của quyết định không dùng; thời lượng đóng băng chỉ do `hold`.
- Đóng băng ở sát `source_out` không có đoạn phát tiếp theo: tránh đặt `source_time` ngay cuối clip, và hãy xem kỹ bản preview.

## 5. Quy trình thực hiện
1. Xác định khoảnh khắc: duyệt quanh `source_time` ±0,2 giây để chọn khung rõ nét nhất.
2. Chọn `hold`: 1 giây cho nhấn nhẹ, 2 giây khi có chữ cần đọc.
3. Nếu đặt chữ lên khung tĩnh, `hold` ≥ thời gian đọc tối thiểu của chữ đó (`core/pacing.md`).
4. Neo `anchor: { clip, source_time }` đúng khung chọn.
5. Kiểm tra tiếng: khoảng im lặng cần được ambience hoặc nhạc che, vì tiếng gốc bị tắt.

## 6. Biến thể và preset
| Preset | `hold` | Dùng khi |
|---|---|---|
| `freeze_hold_1s` | 1 | Nhấn nhẹ, mặc định |
| `freeze_hold_2s` | 2 | Có chữ/tiêu đề trên khung, hoặc cảnh kết |

Cả hai `allowed_styles: ["all"]`; confidence `medium`.

## 7. Quy tắc quyết định
- `R-FREEZE-1`: chỉ đóng băng khung nét, chủ thể không nhòe chuyển động.
- `R-FREEZE-2`: NẾU câu thoại quan trọng đang diễn ra tại `source_time` (`audio: keep`) THÌ tránh.
- `R-FREEZE-3`: không quá 2 lần trong 60 giây video; documentary: tối đa vài lần cả video (Storytelling).
- `R-FREEZE-4`: **tác động lên neo cùng clip:** mọi quyết định neo ở `source_time` **sau** điểm đóng băng bị dời muộn thêm `hold` giây trên timeline. Quyết định neo **đúng** `source_time` đóng băng bắt đầu cùng lúc đoạn đóng băng (chữ hiện trên khung tĩnh). `duration`, `hold`, `start_offset` của quyết định khác tính bằng giây đầu ra, không đổi. `punch_in` hoặc `slow_push` chạy qua điểm đóng băng sẽ **tiếp tục theo giờ đầu ra**, nghĩa là scale chạy cả lúc hình đứng: tránh đặt chúng chồng lên.
- `R-FREEZE-5`: không đặt `freeze_frame` và `time_lapse` trên cùng đoạn cùng clip nếu không có lý do (hai thay đổi nhịp chồng).

## 8. Ví dụ
Clip `c07`: diễn giả và khách mời bắt tay sau lễ trao giải. Đóng băng 2 giây tại khoảnh khắc nắm tay, đặt `lower_third`/tiêu đề lên khung tĩnh.

```json
{
  "id": "d09",
  "technique": "freeze_frame",
  "preset": "freeze_hold_2s",
  "anchor": { "clip": "c07", "source_time": 18.4 },
  "start_offset": 0,
  "duration": 0,
  "parameters": {},
  "reason": "Khoảnh khắc bắt tay là điểm kết của phần trao giải, giữ 2 giây để người xem ghi nhớ trước khi chuyển ý",
  "priority": "storytelling",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Đóng băng trúng khung nhòe/nhắm mắt | Ảnh đứng xấu, mặt méo | `R-FREEZE-1` |
| Mất tiếng đột ngột | Tiếng hiện trường tắt hẳn 1–2 giây | Lót nhạc hoặc ambience; `R-FREEZE-2` |
| Zoom chạy tiếp lúc đóng băng | Khung đứng nhưng scale vẫn đổi | `R-FREEZE-4` |
| Lạm dụng | Cứ vài cảnh lại đứng hình | `R-FREEZE-3` |
| Neo muộn so với dự kiến | Chữ lệch sau điểm đóng băng | Tính lại mốc theo `R-FREEZE-4` |

## 10. Kiểm tra sau render
- Khung đóng băng đúng khoảnh khắc đã chọn và không nhòe.
- Sau khi hết `hold`, hình chạy tiếp liền mạch, không mất khung (không nhảy tới).
- Tiếng gốc im đúng đoạn đóng băng và trở lại; có nhạc/ambience nếu cần.
- Chữ/hiệu ứng khác của clip đã dịch đúng về sau.
