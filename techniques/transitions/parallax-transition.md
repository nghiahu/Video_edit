---
id: parallax_transition
name: Parallax Transition (Hai lớp trượt tốc độ khác nhau)
group: transitions
roles: [graphic_transition, depth, section_change]
status: usable
source_of_values: convention
---

# Parallax Transition

> **Giới hạn quan trọng:** đây **không có bản đồ chiều sâu thật** và không tách vật thể theo khoảng cách. Chỉ có hai lớp phẳng (nguyên khung A và nguyên khung B) trượt với tốc độ khác nhau để *gợi* chiều sâu.

## 1. Mục đích
Cảnh cũ trôi chậm và tối dần ở phía sau, cảnh mới trượt vào nhanh hơn ở phía trước. Hiệu ứng tốc độ lệch nhau gợi cảm giác lớp trước/lớp sau, mềm và "đắt" hơn `slide` thường.

## 2. Khi nên dùng
- Video quảng bá, giới thiệu chương trình, trình chiếu có nhịp chậm vừa (0.8–1.0 s), nơi muốn chuyển đồ họa mà vẫn êm.
- Chuyển mục có hai cảnh bố cục tương tự (cùng khung, cùng mật độ), nơi trượt hai tốc độ nhìn tự nhiên.
- Muốn B "tới" mạnh nhưng A không biến mất đột ngột.
- **Style documentary: bị cấm** (`parallax_slide` có `forbidden_styles: ["documentary"]`).

## 3. Khi không nên dùng
- Documentary, phỏng vấn, nội dung trang trọng hoặc cảm xúc.
- Cảnh có chữ hoặc chi tiết cần đọc ở mép (chữ bị trượt đi và phóng nhẹ).
- Giữa câu thoại hoặc đoạn có người nói.
- Hy vọng có chiều sâu thật (vật gần di chuyển nhanh, vật xa chậm trong cùng cảnh): kỹ thuật này không làm được.
- Không có tay cầm ở hai clip (mục 5).
- Priority: Decoration.

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `duration` (tổng vùng) | 0.9 | 0.6–1.2 (renderer chấp nhận 0.15–3.0) | giây | low |
| `easing` | `ease_in_out` | `linear`, `ease_in`, `ease_out`, `ease_in_out` | – | low |
| `direction` | `left` | `left`, `right`, `up`, `down` | – | low |

Không có tham số chỉnh tỉ lệ tốc độ: hệ số cố định trong mã.

**Cách renderer làm** (`style: parallax`, `overlap: true`): clip B nằm trên, trượt từ ngoài khung vào (đi trọn 100% khung), kèm phóng 108% về 100%. Clip A bên dưới trôi cùng hướng nhưng chỉ khoảng 30% khung, phóng nhẹ đến 106% và tối dần đến 60% độ sáng. `left`: B vào từ bên phải chạy sang trái, A trôi sang trái chậm. Hai lớp vẫn là hai hình phẳng; không có tách tiền cảnh/hậu cảnh.

## 5. Quy trình thực hiện
1. Xác nhận style không phải documentary, có lý do (chuyển mục đồ họa, nhịp êm).
2. **Tay cầm**: A và B cùng hiện suốt vùng nên cả hai clip cần đoạn thừa quanh điểm cắt. A cần còn ≥ `duration/2` giây nguồn sau `source_out`; B cần ≥ `duration/2` giây nguồn trước `source_in`. Các đoạn thừa lên hình (A chạy tiếp, B đã chạy từ trước điểm cắt); tổng độ dài video không đổi. Thiếu thì renderer tự rút `duration` đối xứng và cảnh báo; hết tay cầm thì thành cắt thẳng.
3. Duyệt hai đoạn thừa vì chúng lên hình.
4. Chọn `direction` nhất quán trong cả chuỗi.
5. Chọn preset `parallax_slide` (0.9 s; thời gian dài hơn `slide` để thấy lệch tốc độ).
6. **Âm thanh:** chỉ tác động hình; thêm `j_l_cut` nếu cần nối tiếng.

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `parallax_slide` | 0.9 s, hướng trái, hai lớp trượt tốc độ khác nhau |

Phân biệt với `slide`: ở `slide` A đứng yên, B trượt vào; ở `parallax_transition` A cũng trôi chậm cùng hướng và phóng nhẹ.

## 7. Quy tắc quyết định
- `R-PARA-1`: KHÔNG dùng ở style documentary.
- `R-PARA-2`: chỉ dùng cho chuyển mục đồ họa nhịp êm; ghi `reason`.
- `R-PARA-3`: không hứa hẹn chiều sâu thật khi báo cáo với người dùng (chỉ gợi cảm giác).
- `R-PARA-4`: tay cầm hai clip ≥ `duration/2`.
- `R-PARA-5`: trong ngân sách `special_transition`, cách chuyển cảnh đặc biệt khác ≥ 3 giây.
- `R-PARA-6`: không đặt chữ hoặc `punch_in` trong vùng chuyển.

## 8. Ví dụ
Video giới thiệu cơ sở vật chất (style `corporate`): từ cảnh phòng học (c02) sang phòng thí nghiệm (c03), hai cảnh bố cục tương tự.

```json
{
  "id": "d02",
  "technique": "parallax_transition",
  "preset": "parallax_slide",
  "anchor": { "between": ["c02", "c03"] },
  "duration": 0.9,
  "parameters": { "duration": 0.9, "direction": "left" },
  "reason": "Chuyển sang khu vực kế tiếp trong video giới thiệu, hai lớp trượt gợi chiều sâu mà vẫn êm",
  "priority": "style",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Dùng ở documentary | Validator báo lỗi style | `R-PARA-1` |
| Hy vọng chiều sâu thật | Vật trong cảnh không tách lớp | `R-PARA-3` |
| Thiếu tay cầm | Hình đứng, cảnh báo khi render | Mục 5 bước 2 |
| Chữ mép trượt mất | Chữ bị đẩy ra ngoài khung | Dời chữ khỏi vùng chuyển |
| Nhầm với `slide` | A đứng yên khi cần trôi (hoặc ngược lại) | Xem mục 6 |

## 10. Kiểm tra sau render
- Lệch tốc độ A và B nhìn tự nhiên; A tối dần đến 60% mà không "bẩn".
- Không thấy hở mép hoặc nền đen giữa A và B.
- Hình nguồn không bị đứng (tay cầm), không có cảnh báo khi render.
- Chữ trong vùng chuyển đã dời.
- Tiếng ở điểm nối không "tạch".
