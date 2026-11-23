---
id: match_cut
name: Match Cut (Cắt khớp)
group: transitions
roles: [meaning, continuity, flow]
status: usable
source_of_values: convention
---

# Match Cut

> **Đây là kỹ thuật dạng mẫu (pattern), không có quyết định riêng trong EDL.** Nó được thực hiện bằng cách đặt hai clip **khác cảnh** cạnh nhau trong `timeline.clips`, chọn `source_out`/`source_in` sao cho hình, chuyển động hoặc ý **khớp nhau ở khung cắt**, nối bằng `hard_cut` (có thể thêm `j_l_cut` để âm thanh nối ý). Renderer không nhận diện hình khớp; người dùng hoặc AI phải tìm cặp cảnh từ mô tả metadata và xem lại clip.

## 1. Mục đích
Làm người xem nhận ra mối liên hệ giữa hai cảnh khác nhau (cùng hình dạng, cùng chuyển động, cùng ý), để chuyển ý hoặc chuyển thời gian một cách gọn và có ý nghĩa.

## 2. Khi nên dùng
- Có hai cảnh thật sự có tương đồng hình học hoặc chuyển động (vòng quay bánh xe → vòng tròn đồng hồ; tay vẫy cùng hướng).
- Chuyển ý có nghĩa: từ "trước khai giảng" sang "sau khai giảng" bằng cùng một vật ở hai thời điểm.
- Cặp cảnh đã có trong footage (b-roll). Match cut tạo ra từ footage sẵn, không tạo mới.
- Documentary: **chấp nhận ở mức cực hiếm**, chỉ khi match có nghĩa thật và tự nhiên. Match cut cầu kỳ là "dấu vết edit" lộ liễu, trái tinh thần tiết chế.

## 3. Khi không nên dùng
- Hai cảnh chỉ "hơi giống", người xem không nhận ra: cú cắt thành cú nhảy khó hiểu.
- Match chỉ vì đẹp mà không có nghĩa nội dung (Decoration thua Storytelling).
- Trong đoạn có lời quan trọng hoặc cảm xúc: match cut làm người xem chú ý hình thay vì lời.
- Hai cảnh khác cỡ khung/hướng quá nhiều, hoặc chủ thể không cùng vị trí trong khung nên không khớp.
- Footage không có cặp cảnh phù hợp: không chèn cảnh lạ để ép match.

## 4. Thông số (hướng dẫn, không phải khóa EDL)
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| Sai lệch vị trí chủ thể giữa hai khung | ≤ 10% chiều rộng khung | 0–15% | tỉ lệ khung | low |
| Sai lệch cỡ/kích thước vật khớp | ≤ 15% | 0–25% | tỉ lệ | low |
| Độ dài cảnh vào sau match | 2.5–4 | 1.5–6 | giây | medium |
| Chênh hướng chuyển động | cùng hướng | cùng hướng | – | medium |
| Tần suất | ≤ 1 mỗi video ngắn | 0–2 | lần | low |
| Điểm nối | `hard_cut` | – | – | medium |

## 5. Quy trình thực hiện
1. Dựa vào `clips.md` (`description`, `keywords`, `topics`) tìm cặp cảnh có tương đồng. Chưa có công cụ tự động; cần người xem hoặc AI mô tả lại khung.
2. Chọn khung hình cụ thể ở mỗi clip nơi hai thứ khớp nhất (vị trí, hình dạng, hướng chuyển động).
3. Đặt `source_out` của clip ra tại khung đó; `source_in` của clip vào tại khung tương ứng.
4. Nếu match theo chuyển động: giữ cùng tốc độ và hướng ở hai bên điểm cắt (xem `cut-on-action.md`).
5. Nối bằng `hard_cut`. Nếu match về ý và có lời: dùng `j_l_cut` để câu nói nối ý hai cảnh.
6. Xem lại cặp khung cạnh nhau; nếu người xem không nhận ra match trong < 1 s thì bỏ kỹ thuật này, dùng `hard_cut` thường.

## 6. Biến thể và preset
Không có preset riêng; dùng `cut_hard` (và `l_cut_standard`/`j_cut_standard` khi cần nối tiếng).
- **Match theo hình:** cùng hình dạng, vị trí (xem thêm `graphic-match.md` cho khớp đồ họa/màu).
- **Match theo chuyển động:** cùng hướng, tốc độ.
- **Match theo ý:** hai cảnh khác hình nhưng cùng ý (lớp học ↔ làm việc), thường kèm lời dẫn.

## 7. Quy tắc quyết định
- `R-MATCH-1`: NẾU không chỉ ra được một yếu tố khớp cụ thể (hình, chuyển động hoặc ý) bằng một câu trong `reason` → không dùng.
- `R-MATCH-2`: NẾU sai lệch vị trí chủ thể > 15% khung → bỏ hoặc chọn khung khác.
- `R-MATCH-3`: NẾU style `documentary` VÀ match không phục vụ nội dung → bỏ (Storytelling > Decoration, `R-STYLE-DOC`).
- `R-MATCH-4`: không đặt match cut giữa lời quan trọng; ưu tiên đoạn không lời.
- `R-MATCH-5`: tối đa 1–2 lần mỗi video ngắn.

## 8. Ví dụ
Cảnh bàn tay học viên viết lên giấy (`c09`) khớp cảnh bàn tay cầm bút lúc ký ở lễ khai giảng (`c10`), cả hai bàn tay ở giữa khung, bút đi cùng hướng.

```json
{
  "id": "d09",
  "technique": "hard_cut",
  "preset": "cut_hard",
  "anchor": { "between": ["c09", "c10"] },
  "duration": 0,
  "parameters": { "cut_on": "action" },
  "reason": "Match cut theo chuyển động bút từ học viên viết bài sang ký tên khai giảng, chuyển ý từ học sang bắt đầu",
  "priority": "storytelling",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```
Phần khớp nằm ở việc chọn `source_out`/`source_in`, không có tham số "match" trong EDL.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Match không rõ | Người xem không thấy liên hệ | Chọn cặp khung khớp hơn hoặc bỏ |
| Lệch vị trí | Vật "nhảy" trong khung ở điểm cắt | `R-MATCH-2` |
| Đổi hướng chuyển động | Cú cắt bị giật | Chọn cặp cùng hướng |
| Ép match khi không có nghĩa | Reason gượng ép | `R-MATCH-1`, `R-MATCH-3` |
| Dùng nhiều lần | Thành thủ thuật lặp | `R-MATCH-5` |

## 10. Kiểm tra sau render
- Xem lại điểm nối nhiều lần: người xem nhận ra liên hệ ngay hay không.
- Khung trước và sau điểm cắt: vị trí, kích thước, hướng khớp.
- Lời/nhạc không bị cụt ở điểm nối.
- Lý do nội dung vẫn đứng được khi bỏ yếu tố đẹp.
