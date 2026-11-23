# Bố cục

Quyết định kỹ thuật dựa trên bố cục: `punch_in` có cắt chủ thể không, chữ đặt ở đâu, b-roll nên rộng hay cận.

## Cỡ khung (shot size) — đọc từ `shot_type` trong `clips.md`
| Cỡ | Mô tả | Hệ quả khi dựng |
|---|---|---|
| `wide` | Toàn cảnh, thấy không gian | Hợp mở cảnh, b-roll, nhịp thở. Có chỗ cho chữ |
| `medium` | Nửa người | Khung chuẩn cho talking-head. `punch_in` dùng được |
| `close` | Mặt, vai | Đã cận. **Tránh `punch_in`** |
| `detail` | Chi tiết (tay, màn hình) | Dùng ngắn, đi kèm câu nói liên quan |

## Quy tắc ba phần và khoảng đầu
- Mắt người nói nên nằm gần 1/3 trên của khung. Khi `punch_in`, giữ mắt trong vùng này: dùng điểm neo zoom ở **mắt/ngực trên**, không phải tâm khung nếu tâm khung lệch.
- Khoảng trống phía trên đầu (headroom) không nhỏ hơn khoảng 5% chiều cao khung sau zoom.
- Người nhìn lệch về một bên → chừa khoảng trống phía hướng nhìn (chỗ đó thường hợp để đặt chữ).

## Vùng an toàn cho chữ
- Chừa lề ≥ 5% chiều rộng/cao mỗi bên (video dọc: ≥ 8% phía dưới vì giao diện nền tảng).
- Chữ nhấn mạnh: vùng giữa-thấp, dưới mặt người nói, **không che mặt, miệng, tay đang chỉ**.
- Phụ đề: cách đáy ~8–12% chiều cao.
- Nếu clip đã có chữ trên hình (`on_screen_text` trong `clips.md`, ví dụ slide hoặc bảng hiệu), không đè chữ khác lên đó.

## Zoom và độ phân giải nguồn
Footage 4K dựng ra 1080p cho phép zoom đến ~200% mà vẫn nét. Footage 1080p dựng ra 1080p: zoom > 115% bắt đầu mềm. Kiểm tra `resolution` của nguồn so với `project.resolution` trước khi chọn bậc `punch_in`.

## Chuyển động camera sẵn có
Clip có dolly, pan hoặc handheld rung (`camera` trong `clips.md`): **không chồng thêm** `punch_in` hay rung. Để chuyển động tự nhiên của camera làm việc.
