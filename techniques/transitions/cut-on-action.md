---
id: cut_on_action
name: Cut on Action (Cắt theo hành động)
group: transitions
roles: [continuity, flow]
status: usable
source_of_values: convention
---

# Cut on Action

> **Đây là kỹ thuật dạng mẫu (pattern), không có quyết định riêng trong EDL.** Nó được thực hiện bằng cách chọn `source_out` của clip ra và `source_in` của clip vào nằm **giữa một hành động đang diễn ra**, rồi nối bằng `hard_cut` (`cut_on: action`). Renderer không phát hiện hành động; người dùng hoặc AI xác định mốc từ mô tả trong metadata hoặc xem lại clip.

## 1. Mục đích
Che điểm nối bằng chuyển động: mắt người xem bị cuốn theo hành động nên không để ý cú cắt. Hành động tiếp diễn qua hai cảnh làm câu chuyện liền mạch.

## 2. Khi nên dùng
- Hai góc/cỡ khung khác nhau của cùng một hành động (đưa tay mở cửa, đứng dậy, đi vào lớp, lật trang, cầm micro).
- Chuyển từ cảnh rộng sang cận cùng sự việc (b-roll sự kiện, cảnh sinh hoạt).
- Muốn điểm nối "vô hình" đúng với tinh thần documentary: **hợp style, là lựa chọn mặc định tốt** khi có nhiều góc.
- Metadata hoặc quan sát cho thấy hành động rõ, có đầu và cuối (`edit_points` của b-roll).

## 3. Khi không nên dùng
- Chỉ có một clip (một khung) của hành động: không có cảnh để nối.
- Hành động không có điểm giữa rõ (đứng yên, nói chuyện): dùng `cut_on: speech_end` hoặc `silence`.
- Hai cảnh khác thời điểm hoặc địa điểm: hành động không còn nối nhau (xem `cross_dissolve`).
- Cảnh đưa vào đảo trục hoặc đảo hướng chuyển động (người đang đi sang phải, cảnh sau đi sang trái không có lý do).
- Hành động bị che mặt hoặc rung quá mạnh (run_and_gun) khiến khó xác định điểm giữa.

## 4. Thông số (hướng dẫn, không phải khóa EDL)
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| Điểm cắt trong hành động | 30–60% tiến trình hành động | 25–70% | tỉ lệ | low |
| Chồng hành động giữa hai clip (clip vào lặp lại phần cuối hành động) | 0 (không lặp) | 0–0.2 | giây | low |
| Độ dài cảnh vào tối thiểu sau điểm cắt | 1.5 | ≥ 1.0 | giây | medium |
| Chênh cỡ khung giữa hai cảnh | ≥ 1 cấp (rộng → trung → cận) | 1–2 | cấp | medium |
| `cut_on` | `action` | – | – | medium |

## 5. Quy trình thực hiện
1. Tìm hành động có đầu cuối rõ: đọc `description`/`keywords` trong `clips.md` và xem lại clip (chưa có công cụ nhận diện chuyển động).
2. Chọn hai clip (hoặc hai khoảng trong cùng nguồn nếu quay đa máy) cùng ghi lại hành động đó.
3. Đặt `source_out` của clip ra ở **giữa** hành động (khi tay đang đưa, bước chân đang rơi), không ở lúc nó vừa xong.
4. Đặt `source_in` của clip vào ở **cùng pha hành động** (tay đang chạm cửa), thường sớm hơn 0–0.2 s so với pha ở clip ra để bù cảm giác thời gian.
5. Nối bằng `hard_cut`, `cut_on: action`.
6. Kiểm tra hướng chuyển động và hướng nhìn nhất quán, nền ánh sáng nối tự nhiên.
7. Nếu có tiếng hiện trường: dùng `j_l_cut` để âm thanh hành động (tiếng cửa, bước chân) chạy liền qua điểm nối.

## 6. Biến thể và preset
Dùng `cut_hard` của `hard_cut`; không có preset riêng.
- **Cut on movement:** hành động của chủ thể.
- **Cut on camera move:** cắt khi camera pan/dolly đang chạy, nối với cảnh cũng có chuyển động cùng hướng. Chỉ khi hai chuyển động cùng chiều; nếu không, lộ.
- **Cut on gaze:** cắt khi người quay nhìn sang hướng khác, cảnh sau là thứ họ nhìn.

## 7. Quy tắc quyết định
- `R-ACT-1`: NẾU điểm nối rơi lúc hành động đã dừng hẳn → dời cắt vào giữa hành động.
- `R-ACT-2`: NẾU chênh cỡ khung giữa hai cảnh < 1 cấp (gần như cùng khung) → tránh, thành jump cut (xem `jump-cut.md`).
- `R-ACT-3`: NẾU hướng di chuyển hai cảnh ngược nhau không lý do → đổi cảnh hoặc dời cắt.
- `R-ACT-4`: NẾU hành động thuộc phần câu then chốt của người nói → ưu tiên Storytelling, không cắt khỏi mặt người nói.
- `R-CUT-1`: vẫn là `hard_cut`, không thêm hiệu ứng.

## 8. Ví dụ
Quay hai máy một học viên bước vào lớp: cảnh rộng (`c05`) người đang đưa tay đẩy cửa, cảnh cận (`c06`) bàn tay đang chạm cửa.

```json
{
  "id": "d06",
  "technique": "hard_cut",
  "preset": "cut_hard",
  "anchor": { "between": ["c05", "c06"] },
  "duration": 0,
  "parameters": { "cut_on": "action", "out_tail": 0.0, "in_lead": 0.0 },
  "reason": "Cắt khi tay đang đẩy cửa để che điểm nối rộng sang cận",
  "priority": "storytelling",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```
Điểm cắt thật được đặt qua `source_out` của `c05` và `source_in` của `c06`. Các giá trị `out_tail`/`in_lead` bằng 0 vì điểm cắt không dựa vào lời nói. Renderer không tự dời điểm cắt theo `out_tail`/`in_lead` (README renderer: đó chỉ là hướng dẫn cho AI), nên mọi điểm cắt phải nằm sẵn trong `source_in`/`source_out`.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Cắt sau khi hành động xong | Cú cắt lộ, hành động như bị lặp | Dời `source_out` vào giữa hành động |
| Lặp hoặc bỏ mất pha hành động | Tay "nhảy" lùi hoặc tiến | Chỉnh `source_in` về đúng pha |
| Đảo trục | Hướng đi đảo bất ngờ | `R-ACT-3` |
| Cùng khung | Giống jump cut | `R-ACT-2` |
| Tiếng hành động lệch | Tiếng cửa nghe hai lần | `j_l_cut` hoặc mute một nguồn |

## 10. Kiểm tra sau render
- Xem chậm điểm nối: hành động liền mạch, không giật, không lặp.
- Hướng chuyển động và hướng nhìn giữ nguyên.
- Tiếng hiện trường liền (nếu có), không đôi tiếng.
- Cú cắt không "nhìn thấy" khi xem ở tốc độ thường.
