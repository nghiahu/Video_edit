---
id: b_roll_insert
name: B-roll Insert (Chèn cảnh minh họa)
group: storytelling
roles: [illustration, cover_cut, pacing]
status: usable
source_of_values: convention
---

# B-roll Insert

> **Đây là kỹ thuật dạng mẫu (pattern), không có quyết định riêng trong EDL.** Nó được thực hiện bằng cách đặt clip b-roll vào `timeline.clips` kèm điểm nối (`hard_cut`, và `j_l_cut` kiểu L để giữ lời). Renderer không cần hỗ trợ thêm.

## 1. Mục đích
Chèn cảnh minh họa lên phần người nói (hoặc giữa hai phần) để: minh họa nội dung, che chỗ cắt/nhảy hình, làm mới hình khi một góc máy kéo dài, tạo nhịp thở.

## 2. Khi nên dùng
- Người nói nhắc đến thứ cụ thể mà b-roll có (học viên, lớp học, màn hình, địa điểm).
- Một khung talking-head kéo dài > ~10–15 giây (`core/pacing.md`).
- Bỏ đoạn giữa của một câu, cần che chỗ nhảy hình.
- Sau một ý nặng, cho người xem một khung rộng để thấm.

## 3. Khi không nên dùng
- Không có b-roll **liên quan** thật sự: **không chèn b-roll vô nghĩa** để lấp chỗ. Dùng chữ (`kinetic_text`) hoặc giữ người nói (`R-ABS-1`).
- Khoảnh khắc cảm xúc mạnh của người nói (mặt, ánh mắt là nội dung chính).
- Câu then chốt cần người xem nhìn mặt người nói.
- B-roll có tiếng gốc bẩn mà không thể mute (đã mute thì ổn).
- B-roll chất lượng kém (ghi trong `quality`/`issues`) so với footage chính.

## 4. Thông số (hướng dẫn, không phải khóa EDL)
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| Độ dài mỗi b-roll | 2.5–4 | 1.5–6 | giây | medium |
| Điểm vào b-roll | sau khi người nói bắt đầu ý ≥ 1.0 s | ≥ 0.8 | giây | medium |
| Điểm quay lại người nói | trước khi câu then chốt ≥ 0.5 s | ≥ 0.3 | giây | medium |
| Tiếng b-roll | `mute` | `mute`, `duck` | – | high |
| Nối vào | `hard_cut` + `j_l_cut` (L) | – | – | medium |
| Tỉ lệ b-roll trên đoạn talking-head | ≤ 50% | 30–50% | – | low |

## 5. Quy trình thực hiện
1. Từ pha 1, lấy `b_roll_opportunities` (đoạn nói dài hoặc nội dung có hình minh họa).
2. Tìm b-roll **khớp nghĩa**: so `topics`, `concepts`, `keywords` trong `clips.md` với nội dung câu nói; đọc `editorial.usable` và `issues`.
3. Chọn đoạn b-roll theo `edit_points` của nó; độ dài 2.5–4 giây.
4. Cắt talking-head thành hai clip (`c_a` trước, `c_b` sau) quanh vùng b-roll: `c_a` kết thúc, b-roll (`c_x`, `audio: mute`), rồi `c_b` tiếp tục (nguồn của `c_b` bắt đầu **đúng chỗ lời tiếp nối**).
5. Giữ lời liền mạch: thêm `j_l_cut` kiểu L giữa `c_a` và `c_x` (lời của `c_a` kéo qua b-roll); nguồn của `c_b` phải bắt đầu sau phần lời đã kéo, hoặc chấp nhận người xem không thấy miệng ở đoạn đó.
6. Kiểm tra liên tục: người nói không "nhảy vị trí" bất thường khi quay lại; nhịp b-roll không đều như máy.

## 6. Biến thể
- **Illustrate:** b-roll khớp nghĩa trực tiếp.
- **Cover cut:** b-roll che chỗ nhảy hình khi bỏ đoạn lời.
- **Breathing shot:** khung rộng sau ý nặng, không cần khớp nghĩa chặt (nhưng vẫn phải cùng bối cảnh).
- **Cutaway reaction:** cảnh phản ứng của người nghe (nếu có footage).

## 7. Quy tắc quyết định
- `R-BROLL-1`: chỉ chèn khi b-roll **khớp nghĩa** hoặc cần che cắt; không chèn "cho đỡ nhàm" (`R-ABS-1`).
- `R-BROLL-2`: b-roll `audio: mute` (trừ khi ambience sạch và có lý do giữ).
- `R-BROLL-3`: không b-roll trong lúc người nói cảm xúc mạnh hoặc nói câu then chốt.
- `R-BROLL-4`: không hai b-roll liên tiếp cùng nội dung; mỗi cảnh 1.5–6 giây.
- `R-CUT-2`: dùng `j_l_cut` kiểu L để giữ lời.

## 8. Ví dụ
MC nói 14 giây liên tục về chương trình, nhắc đến "các bạn học viên". Cắt thành `c02` (MC, 0–6 giây), chèn `c03` (b-roll học viên ngồi học, 3 giây, mute), rồi `c04` (MC, tiếp lời).

```json
{
  "timeline_pattern": [
    { "id": "c02", "video_id": "<talking_head>", "source_in": 1.2, "source_out": 7.0, "audio": "keep" },
    { "id": "c03", "video_id": "<b_roll_hoc_vien>", "source_in": 0.5, "source_out": 3.5, "audio": "mute" },
    { "id": "c04", "video_id": "<talking_head>", "source_in": 10.5, "source_out": 15.0, "audio": "keep" }
  ],
  "decisions_pattern": [
    { "technique": "hard_cut", "anchor": { "between": ["c02", "c03"] } },
    { "technique": "j_l_cut", "preset": "l_cut_standard", "anchor": { "between": ["c02", "c03"] }, "reason": "Giữ lời MC khi chuyển sang b-roll học viên" },
    { "technique": "hard_cut", "anchor": { "between": ["c03", "c04"] } }
  ]
}
```
Đây là khuôn minh họa (có chỗ `<...>` cần điền), không phải EDL chạy được.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| B-roll không liên quan | Hình và lời lệch nghĩa | `R-BROLL-1` |
| Lời bị cụt khi chèn | Nghe mất chữ ở điểm nối | L-cut, cắt trong quãng lặng |
| Nhảy vị trí khi quay lại | Người nói đổi tư thế đột ngột | Chọn điểm quay lại gần tư thế cũ |
| B-roll quá dài | > 6 giây, người xem quên lời | 2.5–4 giây |
| Tiếng gốc b-roll lọt vào | Nghe tiếng chuông hoặc ồn | `audio: mute` |

## 10. Kiểm tra sau render
- Hình minh họa đúng nội dung đang nói tại từng thời điểm.
- Lời liền mạch qua các điểm nối, không cụt, không lặp.
- Quay lại người nói tự nhiên.
- Tổng tỉ lệ b-roll trong khoảng cho phép.
