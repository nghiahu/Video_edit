---
id: blur_dissolve
name: Blur Dissolve (Mờ chồng nhòe)
group: transitions
roles: [time_passage, dreamlike, softness]
status: usable
source_of_values: convention
---

# Blur Dissolve

## 1. Mục đích
Cảnh cũ nhòe dần trong khi cảnh mới hiện ra từ trạng thái nhòe rồi nét lại. Tạo cảm giác **mơ màng, hồi tưởng, "mắt chớp"** hoặc chuyển tâm trạng mềm; bớt lộ hình hai cảnh chồng nhau so với `cross_dissolve` khi hai bố cục khác nhau nhiều.

## 2. Khi nên dùng
- Chuyển sang hồi tưởng, giấc mơ, suy nghĩ nội tâm (lời dẫn trầm, chậm).
- Hai cảnh có bố cục khác hẳn (một cận mặt, một toàn cảnh) mà `cross_dissolve` làm hai hình chồng lộ liễu.
- Mở hoặc kết một đoạn cảm xúc, cần cảm giác mềm hơn dissolve thường.
- Style documentary: được phép, nhưng tính vào `budget.special_transition` (0–2 mỗi video).

## 3. Khi không nên dùng
- Đoạn nội dung thông tin, đối thoại, phát biểu: nhòe làm người xem mất chi tiết đang cần theo dõi.
- Khi cảnh có chữ hoặc bảng biểu cần đọc ngay sát điểm cắt.
- Cảnh vốn đã nhòe hoặc thiếu nét (nhòe chồng nhòe nhìn như lỗi lấy nét).
- Dùng nhiều lần liên tiếp hoặc như hiệu ứng "đẹp" mặc định (Decoration thua Storytelling).
- Khi không có tay cầm ở hai clip (mục 5).

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `duration` (tổng vùng chuyển) | 0.7 | 0.4–1.2 (renderer chấp nhận 0.15–3.0) | giây | medium |
| `easing` | `ease_in_out` | `linear`, `ease_in`, `ease_out`, `ease_in_out` | – | medium |
| `blur` (độ nhòe cực đại) | 24 | 8–40 | px ở khung cao 1080 (renderer nhân theo chiều cao khung) | low |

**Cách renderer làm** (`style: blur_dissolve`, `overlap: true`): clip A giữ độ đục đầy đủ nhưng nhòe tăng dần từ 0 đến `blur`. Clip B hiện dần (độ đục 0 đến 1) và nhòe giảm từ `blur` về 0. Nếu quyết định không đặt `blur`, mã dùng giá trị dự phòng 28; preset đặt 24. Nhòe là bộ lọc làm mờ Gaussian của trình duyệt, không phải nhòe theo hướng.

## 5. Quy trình thực hiện
1. Xác nhận có lý do kể chuyện (hồi tưởng, nội tâm, chuyển mềm giữa hai bố cục khác hẳn). Không có thì dùng `cross_dissolve` hoặc `hard_cut`.
2. **Tay cầm**: A còn ≥ `duration/2` giây nguồn sau `source_out`; B có ≥ `duration/2` giây trước `source_in`. Các đoạn thừa này lên hình trong vùng chuyển (tổng độ dài video không đổi). Thiếu thì renderer tự rút ngắn đối xứng và cảnh báo; không còn tay cầm thì thành cắt thẳng.
3. Duyệt nội dung hai đoạn thừa (đừng để lộ tiếng "cắt", người bước vào, rung máy).
4. Chọn `blur_dissolve_soft`; giảm `blur` nếu footage nhiều chi tiết nhỏ cần giữ.
5. **Âm thanh:** chỉ tác động hình; muốn tiếng nối mượt, thêm `j_l_cut` ở cùng điểm nối.

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `blur_dissolve_soft` | 0.7 s, `blur` 24, `ease_in_out`. Preset duy nhất hiện có |

## 7. Quy tắc quyết định
- `R-BLUR-1`: chỉ dùng khi có lý do kể chuyện (hồi tưởng, nội tâm, đổi tâm trạng, mở/kết). Priority `storytelling`.
- `R-BLUR-2`: không dùng trong đoạn thông tin hoặc đối thoại cần theo dõi chi tiết.
- `R-BLUR-3`: ngân sách chung `special_transition`; cách chuyển cảnh đặc biệt khác ≥ 3 giây.
- `R-BLUR-4`: không đặt chữ hoặc `punch_in` trong vùng chuyển.
- `R-BLUR-5`: tay cầm hai clip ≥ `duration/2`.
- `R-BLUR-6`: NẾU hai cảnh cùng bố cục, cùng địa điểm THÌ `cross_dissolve` hoặc `hard_cut`, không cần nhòe.

## 8. Ví dụ
Lời dẫn: "Có những buổi chiều, tôi vẫn nhớ tiếng trống khai giảng đầu tiên". Chuyển từ cảnh người nói (c03) sang cảnh sân trường vắng (c04).

```json
{
  "id": "d02",
  "technique": "blur_dissolve",
  "preset": "blur_dissolve_soft",
  "anchor": { "between": ["c03", "c04"] },
  "duration": 0.7,
  "parameters": { "duration": 0.7, "blur": 24 },
  "reason": "Chuyển từ lời kể sang cảnh hồi tưởng; hai bố cục khác nhau nên nhòe làm chuyển mềm hơn mờ chồng thường",
  "priority": "storytelling",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Nhòe quá nặng | Cảnh mất nội dung nhiều frame, trông như lỗi lấy nét | Giảm `blur` (8–24) hoặc rút `duration` |
| Dùng ở đoạn thông tin | Người xem mất chi tiết đang nói | `R-BLUR-2` |
| Thiếu tay cầm | Hình đứng, có cảnh báo khi render | Mục 5 bước 2 |
| Dùng như hiệu ứng "đẹp" mặc định | Quá hai lần mỗi video | Ngân sách, `R-BLUR-1` |
| Hy vọng ra nhòe chuyển động thật | Nhòe đều mọi hướng, không theo hướng | Biết giới hạn; dùng `whip_pan` nếu cần cảm giác chuyển động (không dùng ở documentary) |

## 10. Kiểm tra sau render
- Nhòe lên rồi xuống mượt, không giật ở đầu/cuối vùng.
- Cảnh mới nét hoàn toàn ở cuối vùng chuyển.
- Không có cảnh báo thiếu tay cầm.
- Tiếng ở điểm nối không "tạch".
- Số lần dùng nằm trong ngân sách.
