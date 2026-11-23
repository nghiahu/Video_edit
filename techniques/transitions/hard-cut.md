---
id: hard_cut
name: Hard Cut (Cắt thẳng)
group: transitions
roles: [rhythm, continuity]
status: usable
source_of_values: convention
---

# Hard Cut

## 1. Mục đích
Chuyển từ clip này sang clip khác ngay lập tức, không hiệu ứng. Đây là điểm nối mặc định của mọi video. Người xem không nhận ra cú cắt tốt, chỉ thấy câu chuyện chạy liền mạch.

## 2. Khi nên dùng
- Mặc định cho mọi điểm nối nếu không có lý do kể chuyện để dùng kiểu khác (`R-CUT-1`).
- Hai cảnh cùng thời điểm, cùng địa điểm, hoặc ý nối tiếp.
- Cắt theo hành động (người đang đứng lên, tay đang đưa) hoặc theo câu nói (hết ý, đầu ý mới).
- Chuyển giữa talking-head và b-roll minh họa.

## 3. Khi không nên dùng (cần kỹ thuật khác)
- Trôi thời gian, đổi địa điểm lớn, mở/kết video: cân nhắc `cross_dissolve` (chưa có tài liệu) hoặc giữ hard cut nhưng có b-roll đệm.
- Hai clip cùng người nói, cùng khung, chỉ khác lời: dễ tạo cú "nhảy hình" (jump cut) lộ liễu. Thêm b-roll che, hoặc đổi cỡ khung bằng `punch_in` nhẹ ở điểm nối, hoặc chấp nhận jump cut nếu style cho phép (phong cách vlog).
- Nhảy trục: người nhìn trái rồi nhìn phải ở cảnh sau mà không có lý do.

## 4. Thông số
Hard cut không có thông số hoạt cảnh. Quyết định nằm ở **điểm cắt**:

| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `out_tail` (chừa sau điểm hết ý ở clip ra) | 0.15 | 0.05–0.3 | giây | medium |
| `in_lead` (chừa trước điểm bắt đầu ý ở clip vào) | 0.10 | 0.05–0.25 | giây | medium |
| `cut_on` | `speech_end` | `speech_end`, `action`, `silence`, `beat` | – | medium |

## 5. Quy trình chọn điểm cắt
1. Lấy `edit_points.in/out` từ `clips.md` làm điểm xuất phát.
2. Tìm quãng lặng gần điểm đó trong `silence_ranges` (cắt trong quãng lặng thì không cắt phạm vào chữ).
3. Cắt ra sau khi hết ý + `out_tail`; cắt vào trước khi ý mới bắt đầu - `in_lead`.
4. Với clip b-roll: cắt khi chuyển động chủ đạo kết thúc hoặc ngay trước khi nó bắt đầu, tránh cắt giữa chuyển động camera.
5. Kiểm tra liên tục: hướng nhìn, hướng di chuyển, tông ánh sáng nối tiếp tự nhiên.

## 6. Biến thể
- **Cut on action:** cắt đúng lúc có chuyển động, che được điểm nối.
- **Cut on speech:** cắt ở nhịp ngắt câu.
- **Jump cut:** cắt bỏ giữa chừng cùng một khung (bỏ quãng lặng/từ đệm). Chỉ dùng khi style cho phép và phần cắt nhỏ.
- **Smash cut:** cắt đột ngột từ yên lặng sang ồn hoặc ngược lại để gây bất ngờ. Chỉ khi có lý do kể chuyện.

## 7. Quy tắc quyết định
- `R-CUT-1`, `R-CUT-2` trong `core/decision-engine.md`.
- NẾU hai clip nối là cùng người nói, cùng khung → thêm b-roll hoặc đổi khung, không để jump cut trần trong style documentary.
- NẾU điểm nối rơi giữa một chuyển động camera dài → dời điểm cắt đến khi chuyển động ngừng.

## 8. Ví dụ
Nối cú máy dolly lớp học (`c01`, b-roll) vào MC bắt đầu nói (`c02`, talking-head).

```json
{
  "id": "d01",
  "technique": "hard_cut",
  "preset": "cut_hard",
  "anchor": { "between": ["c01", "c02"] },
  "duration": 0,
  "parameters": { "cut_on": "speech_end", "out_tail": 0.15, "in_lead": 0.1 },
  "reason": "Chuyển từ toàn cảnh lớp học sang MC mở đầu, cắt thẳng giữ nhịp trang trọng",
  "priority": "rhythm",
  "confidence": "high",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Cắt trúng giữa chữ | Nghe cụt âm cuối | Cắt trong `silence_ranges`, chừa `out_tail` |
| Cắt giữa chuyển động camera | Hình như bị giật | Dời điểm cắt đến khi chuyển động ngừng |
| Nhảy trục | Hướng nhìn đảo bất ngờ | Kiểm tra hướng trước khi nối |
| Cắt quá sớm khi chưa kịp đọc chữ | Chữ trên hình bị cắt đứt | Giữ đủ thời gian đọc |
| Mọi cú cắt đều cùng độ dài | Nhịp đều như máy | Xen kẽ cảnh dài ngắn theo `core/pacing.md` |

## 10. Kiểm tra sau render
- Nghe lướt: không cụt chữ, không "tạch" khi nối.
- Xem lướt: hướng nhìn và chuyển động liên tục.
- Tiếng nền hai clip không lệch đột ngột (nếu lệch cân nhắc `j_l_cut`).
