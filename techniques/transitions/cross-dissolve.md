---
id: cross_dissolve
name: Cross Dissolve (Mờ chồng)
group: transitions
roles: [time_passage, softness, section_break]
status: usable
source_of_values: convention
---

# Cross Dissolve

## 1. Mục đích
Hai cảnh mờ chồng lên nhau để báo hiệu **thời gian trôi qua, đổi địa điểm hoặc sang phần mới**, hoặc để làm mềm cảm xúc ở mở/kết đoạn. Không phải cách nối mặc định (mặc định là `hard_cut`).

## 2. Khi nên dùng
- Trôi thời gian ("sau đó", "đến buổi chiều").
- Đổi địa điểm lớn hoặc sang chương mới của video.
- Mở đầu hoặc kết thúc video/đoạn, cần cảm giác khép lại êm.
- Hai b-roll nhịp chậm, không lời, cảm xúc trầm.

## 3. Khi không nên dùng
- Thay cho cắt thẳng trong đoạn đối thoại hoặc phát biểu (làm chậm và mờ nhịp).
- Hai cảnh cùng thời điểm, cùng địa điểm (`hard_cut` đủ).
- Khi style cần nhịp nhanh, năng lượng cao.
- Nhiều lần liên tiếp: quá hai lần mỗi video ở documentary (vượt `budget.special_transition`).
- Khi hai clip không có "tay cầm" (phần thừa quanh điểm cắt) để mờ chồng (xem mục 5).

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `duration` (tổng thời gian mờ chồng) | 0.6 | 0.3–1.2 | giây | medium |
| `easing` | `ease_in_out` | `ease_in_out` | – | medium |

Mờ chồng được **căn giữa điểm cắt**: nửa đầu nằm trước điểm cắt (cuối clip trước), nửa sau nằm sau điểm cắt.

## 5. Quy trình thực hiện
1. Xác nhận điểm nối cần báo hiệu chuyển đoạn (trôi thời gian, đổi địa điểm, mở/kết). Không có lý do kể chuyện → để `hard_cut`.
2. Kiểm tra **tay cầm**: clip trước còn ≥ `duration/2` giây nguồn sau `source_out`; clip sau còn ≥ `duration/2` giây nguồn trước `source_in`. Không đủ thì rút `duration` hoặc dùng `hard_cut`. Renderer tự rút nếu thiếu và cảnh báo.
3. Chọn preset: `dissolve_standard` (0.6 s) hoặc `dissolve_short` (0.4 s).
4. Đặt `anchor.between` hai clip liền kề.
5. **Âm thanh:** mờ chồng chỉ tác động hình. Nếu cần tiếng nối mượt, thêm `j_l_cut` ở cùng điểm nối, hoặc để nhạc nền liền mạch.
6. Đừng đặt `punch_in`, chữ nhấn hoặc `lower_third` rơi vào vùng mờ chồng (hình đang pha trộn, chữ khó đọc).

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `dissolve_standard` | 0.6 s, mặc định |
| `dissolve_short` | 0.4 s, nhẹ |

## 7. Quy tắc quyết định
- `R-DIS-1`: chỉ dùng khi có lý do kể chuyện (trôi thời gian, đổi địa điểm, mở/kết). Ghi lý do vào `reason`.
- `R-DIS-2`: không quá `strategy.budget.special_transition` mỗi video; cách nhau ≥ 3 giây.
- `R-DIS-3`: không dùng trong đoạn đối thoại/phát biểu liên tục.
- `R-DIS-4`: không đặt chữ hoặc `punch_in` trong vùng mờ chồng.
- `R-CUT-1`: mặc định vẫn là `hard_cut`.

## 8. Ví dụ
Chuyển từ phần MC mở đầu sang b-roll toàn cảnh lớp học, báo hiệu bước vào phần mới.

```json
{
  "id": "d03",
  "technique": "cross_dissolve",
  "preset": "dissolve_standard",
  "anchor": { "between": ["c02", "c03"] },
  "duration": 0.6,
  "parameters": { "duration": 0.6 },
  "reason": "Sang phần mới của video: từ lời mở đầu sang cảnh toàn lớp học, mờ chồng báo hiệu chuyển đoạn",
  "priority": "storytelling",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Dùng thay cắt thẳng khắp nơi | Video trôi lờ mờ, mất nhịp | `R-DIS-1`, ngân sách |
| Mờ chồng quá dài | > 1.2 s, hai hình chồng nhau lâu | Giữ 0.4–0.8 s |
| Thiếu tay cầm | Hình đứng hoặc nhảy trong vùng mờ | Kiểm tra mục 5 bước 2 |
| Chữ nằm trong vùng mờ | Chữ chồng lên hai khung hình | `R-DIS-4` |

## 10. Kiểm tra sau render
- Mờ chồng mượt, không khựng khung ở đầu hoặc cuối.
- Không thấy hình nguồn bị đứng (thiếu tay cầm).
- Tiếng ở điểm nối không "tạch" và không lệch.
- Số lần dùng trong ngân sách.
