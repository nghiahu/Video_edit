---
id: cutaway_insert
name: Cutaway / Insert (Cảnh cắt chen)
group: transitions
roles: [illustration, cover_cut]
status: usable
source_of_values: convention
---

# Cutaway / Insert

> **Đây là kỹ thuật dạng mẫu (pattern), không có quyết định riêng trong EDL.** Đây là tài liệu cầu nối: cách làm đầy đủ nằm ở `techniques/storytelling/b-roll-insert.md`. Thực hiện bằng cách đặt clip chèn vào `timeline.clips` kèm `hard_cut` và `j_l_cut` (L) để giữ lời. Renderer không cần hỗ trợ thêm.

## 1. Mục đích
Chèn một cảnh ngắn lên mạch chính để che cắt, minh họa hoặc nhấn chi tiết. Hai dạng: **cutaway** (cảnh phụ ngoài hành động chính) và **insert** (cận chi tiết của chính hành động/vật đang diễn ra).

## 2. Khi nên dùng
- Cần che chỗ nhảy hình (`jump-cut.md`) hoặc làm mới khung talking-head > ~10–15 s.
- **Cutaway:** cảnh phản ứng người nghe, cảnh khán phòng, cảnh bối cảnh.
- **Insert:** cận bàn tay ký tên, tờ giấy, màn hình, bảng tên khi người nói nhắc đến.
- Documentary: **hợp**, là công cụ chính thay vì hiệu ứng (xem `styles/documentary.md`, b-roll rộng ổn định).

## 3. Khi không nên dùng
- Không có footage **khớp nghĩa** (`R-BROLL-1`, `R-ABS-1`).
- Người nói đang cảm xúc mạnh hoặc nói câu then chốt (`R-BROLL-3`).
- Clip chèn có tiếng gốc bẩn mà không mute được.
- Chèn hai cảnh liên tiếp cùng nội dung, hoặc cảnh quá dài làm mất mạch lời.

## 4. Thông số (hướng dẫn)
Lấy từ `b-roll-insert.md`.
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| Độ dài cutaway | 2.5–4 | 1.5–6 | giây | medium |
| Độ dài insert (chi tiết) | 1.5–3 | 1–4 | giây | medium |
| Tiếng clip chèn | `mute` | `mute`, `duck` | – | high |
| Nối vào | `hard_cut` + `j_l_cut` (L) | – | – | medium |

## 5. Quy trình thực hiện
1. Xác định nhu cầu (che cắt, minh họa, chi tiết) từ `b_roll_opportunities` hoặc chỗ nhảy hình.
2. Chọn clip theo `topics`/`keywords`, loại clip có `issues` nặng.
3. Cắt mạch chính thành `c_a` và `c_b`, chèn clip phụ ở giữa (`audio: mute`); chi tiết xem `b-roll-insert.md` mục 5.
4. Thêm `j_l_cut` (L) giữa `c_a` và clip chèn để giữ lời.
5. Kiểm tra lời liền, hình chèn đúng thời điểm nhắc đến.

## 6. Biến thể và preset
- **Cutaway:** cảnh ngoài mạch chính (phản ứng, bối cảnh).
- **Insert:** cận chi tiết của chính mạch chính.
- Preset nối: `cut_hard`, `l_cut_standard`.

## 7. Quy tắc quyết định
- `R-CUTAWAY-1`: chọn insert khi chi tiết nằm trong lời đang nói; chọn cutaway khi chỉ cần che hoặc làm mới hình.
- Áp dụng `R-BROLL-1` đến `R-BROLL-4` và `R-CUT-2` trong `b-roll-insert.md`.
- `R-CUTAWAY-2`: không đặt cutaway/insert trong 1.0 s đầu của một ý.

## 8. Ví dụ
Khuôn timeline theo `b-roll-insert.md`; quyết định mẫu cho phần cận chi tiết (insert) bàn tay ký tên chèn lên lời MC:

```json
{
  "id": "d13",
  "technique": "j_l_cut",
  "preset": "l_cut_standard",
  "anchor": { "between": ["c21", "c22"] },
  "duration": 0.8,
  "parameters": { "variant": "l", "tail": 0.8, "audio_crossfade": 0.12 },
  "reason": "Giữ lời MC khi chèn cận bàn tay ký tên (insert)",
  "priority": "clarity",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```
Thứ tự clip `c21` (MC), `c22` (insert, mute), `c23` (MC tiếp lời) và `hard_cut` ở hai điểm nối cần có trong `timeline.clips`.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Cảnh không khớp lời | Hình lệch nghĩa | `R-BROLL-1` |
| Lời cụt | Mất chữ ở điểm nối | L-cut |
| Insert quá dài | Người xem quên lời | ≤ 4 s |
| Tiếng clip chèn lọt vào | Nghe tiếng lạ | `mute` |

## 10. Kiểm tra sau render
- Hình đúng nội dung đang nói.
- Lời liền, không cụt, không lặp.
- Quay lại mạch chính tự nhiên.
