---
id: lower_third
name: Lower Third (Thanh tên và chức danh)
group: typography
roles: [information, identification]
status: usable
source_of_values: convention
---

# Lower Third

## 1. Mục đích
Cho người xem biết người đang nói là ai (tên, chức danh) mà không cần người nói tự giới thiệu. Đây là chữ **cấp 2** trong `typography/hierarchy.md`: hỗ trợ, không giành sự chú ý với nội dung.

## 2. Khi nên dùng
- Lần **đầu tiên** một người xuất hiện và nói (diễn giả, MC, khách mời).
- Người đó có vai trò quan trọng với nội dung mà người xem chưa biết.
- Video dùng ngoài bối cảnh sự kiện (người xem không quen mặt).

## 3. Khi không nên dùng
- Lần xuất hiện thứ hai trở đi của cùng một người trong video (không lặp lại).
- Đã có chữ tên sẵn trên hình (slide, bảng tên lớn) rõ ràng và đọc được.
- Trùng thời điểm với `kinetic_text` hoặc chữ khác (một cấp nhấn mỗi khung; xem `hierarchy.md`).
- Người xuất hiện chưa đầy 3 giây (không đủ để đọc).
- Chưa biết chắc tên/chức danh: **không đoán**, hỏi người dùng hoặc bỏ.
- Vượt `strategy.budget.lower_third`.

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `name` | – | bắt buộc, 1–5 từ | – | high |
| `title` | – | tuỳ chọn, ≤ 8 từ | – | high |
| `duration` (trường của quyết định, tổng thời gian hiện) | 4.0 | 3–5 (tối thiểu 2) | giây | medium |
| `in_duration` | 0.35 | 0.25–0.5 | giây | medium |
| `out_duration` | 0.3 | 0.2–0.4 | giây | medium |
| `name_font_size` / `title_font_size` | 44 / 30 | 38–48 / 26–34 | px @1080p | medium |
| `accent_bar` | true | true/false | – | medium |
| `position` | `lower_left` | `lower_left` | – | medium |

Vị trí: trái, cách mép 6%, cách đáy 12%. Với video dọc, nâng thêm ~6% để tránh giao diện nền tảng.

## 5. Quy trình thực hiện
1. Từ pha 1, lấy người **mới xuất hiện** (`person_xx` trong `clips.md`, kèm `speaker`/`visibility: on_camera`). Chỉ đưa tên và chức danh người dùng cung cấp hoặc có trong metadata/slide; không suy diễn.
2. Chọn thời điểm: sau khi người đó nói được ~0.5–1 giây (không ngay frame đầu), hoặc ngay khi họ vào khung.
3. `duration` 3–5 giây; nếu đoạn của người đó ngắn hơn 3 giây thì bỏ.
4. Kiểm tra không chồng với `kinetic_text`/`punch_in` đang diễn ra: dời lower third sang trước hoặc sau.
5. Tên viết **đúng chính tả và dấu**, viết hoa chữ cái đầu mỗi từ của tên; chức danh viết thường theo thông lệ (hoặc hoa chữ đầu nếu là tên tổ chức).
6. Kiểm tra vùng dưới-trái không che chữ trên hình (slide) hoặc tay/người.

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `lower_third_editorial` | Vạch nhấn vàng dịu + tên đậm + chức danh mờ hơn; mặc định cho documentary |
| `lower_third_minimal` | Chỉ chữ, không vạch; rất tiết chế |

## 7. Quy tắc quyết định
- `R-LT-1`: mỗi người nhận **tối đa một** lower third trong video, ở lần đầu xuất hiện có lời.
- `R-LT-2`: không hiện cùng lúc với `kinetic_text`; nếu trùng, ưu tiên cái quan trọng hơn theo nội dung (thường là chữ nhấn), dời lower third.
- `R-LT-3`: không dùng khi thiếu thông tin chắc chắn về tên/chức danh.
- `R-TXT-3`: không che mặt, không nằm ngoài vùng an toàn.

## 8. Ví dụ
Diễn giả nam áo polo nâu đỏ phát biểu trên bục (clip `c02`); người dùng đã cho biết tên và chức danh.

```json
{
  "id": "d07",
  "technique": "lower_third",
  "preset": "lower_third_editorial",
  "anchor": { "clip": "c02", "source_time": 2.0 },
  "start_offset": 0.0,
  "duration": 4.0,
  "parameters": { "name": "Nguyễn Văn A", "title": "Đại diện nhà trường" },
  "reason": "Lần đầu diễn giả xuất hiện và nói; người xem cần biết vai trò",
  "priority": "clarity",
  "confidence": "high",
  "reference": null,
  "status": "proposed"
}
```
Tên và chức danh trong ví dụ là **giả định minh họa**, không phải dữ liệu thật của footage.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Hiện lại nhiều lần cho cùng người | Nhiều `lower_third` cùng `name` | `R-LT-1` |
| Hiện quá ngắn | `duration` < 3 s | Giữ 3–5 s hoặc bỏ |
| Đoán tên/chức danh | Không có nguồn xác nhận | Hỏi người dùng |
| Chồng chữ nhấn | Hai khối chữ cùng lúc | Dời thời điểm |
| Sai dấu tiếng Việt | Tên bị mất dấu | Chép đúng nguồn, kiểm tra preview |

## 10. Kiểm tra sau render
- Đọc được hết trong thời gian hiện ở tốc độ bình thường.
- Không che mặt hay chữ trên hình; không tràn mép trái.
- Vào và ra mượt, không giật.
- Chỉ một khối chữ trên khung tại mọi thời điểm.
