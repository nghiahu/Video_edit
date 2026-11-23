---
id: graphic_match
name: Graphic Match (Khớp đồ họa)
group: transitions
roles: [meaning, flow, composition]
status: usable
source_of_values: convention
---

# Graphic Match

> **Đây là kỹ thuật dạng mẫu (pattern), không có quyết định riêng trong EDL.** Nó được thực hiện bằng cách chọn hai clip có **hình dạng, màu hoặc bố cục tương tự** ở khung cắt, đặt cạnh nhau trong `timeline.clips` và nối bằng `hard_cut` (hoặc `cross_dissolve` rất ngắn nếu hai khung gần như trùng nhau). Renderer không so sánh hình; người dùng hoặc AI chọn cặp bằng mô tả metadata và xem lại clip. Khác `match_cut` ở chỗ nhấn vào **bố cục tĩnh** (hình, màu, đường nét) thay vì chuyển động.

## 1. Mục đích
Nối hai cảnh bằng sự tương đồng thị giác (vòng tròn → vòng tròn, đường chân trời, màu chủ đạo), để người xem thấy mạch hình ảnh và chuyển ý mượt.

## 2. Khi nên dùng
- Hai cảnh có hình/bố cục lặp: đường chân trời ở cùng độ cao, vật tròn ở giữa, mảng màu cùng tông.
- Chuyển giữa hai ý hoặc hai thời điểm mà muốn tạo cảm giác liên tục thị giác.
- Mở/kết một phần: hình khép lại với hình mở đầu.
- Documentary: **chỉ khi tự nhiên** (cảnh sẵn có, không ép). Cho phép ở mức hạn chế, như một lựa chọn tinh tế; không dùng để trang trí.

## 3. Khi không nên dùng
- Hai cảnh chỉ hơi giống, nhưng chủ thể quan trọng khác nhau: người xem bối rối.
- Màu của hai clip khác nhau do lỗi cân bằng trắng: nên chỉnh nhất quán (`color_grade_basic`) thay vì lấy làm "match".
- Có người nói câu then chốt; hình phải nhường cho lời.
- Muốn chuyển cảnh rõ rệt (đổi địa điểm lớn): dùng kỹ thuật khác (`cross_dissolve` với lý do kể chuyện).
- Phải ép bằng zoom/scale để khớp: lộ vết edit, chất lượng hình giảm.

## 4. Thông số (hướng dẫn, không phải khóa EDL)
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| Sai lệch vị trí điểm nhấn giữa hai khung | ≤ 10% | 0–15% | tỉ lệ khung | low |
| Sai lệch độ cao đường chân trời/đường chính | ≤ 5% | 0–10% | tỉ lệ khung | low |
| Chênh tông màu chủ đạo | gần nhau (cùng ấm hoặc cùng lạnh) | – | – | low |
| Độ dài cảnh trước điểm cắt | ≥ 2.5 | 1.5–6 | giây | medium |
| `cross_dissolve` kèm (tùy chọn) | không dùng | `dissolve_short` (xem preset) khi hai khung gần trùng | giây | low |
| Tần suất | ≤ 1–2 mỗi video ngắn | 0–3 | lần | low |

## 5. Quy trình thực hiện
1. Từ `clips.md` tìm cảnh có hình/màu lặp lại (từ khóa mô tả). Chưa có công cụ so khớp ảnh tự động.
2. Chọn khung của clip ra và khung của clip vào mà điểm nhấn trùng vị trí khung.
3. Đặt `source_out` / `source_in` tại các khung đó.
4. Nối bằng `hard_cut`. Chỉ khi hai khung gần như trùng và muốn mềm hơn, thay bằng `cross_dissolve` + `dissolve_short`, nhớ yêu cầu tay cầm ≥ `duration/2` ở hai clip (`R-DIS-1`).
5. Đảm bảo grade màu nhất quán trước khi so (`color_grade_basic`, một preset cho mọi clip).
6. Xem lại: người xem nhận ra tương đồng trong nửa giây hay không.

## 6. Biến thể và preset
Dùng `cut_hard`; biến thể mềm dùng `dissolve_short` (preset thật trong `presets/transition-presets.json`).
- **Khớp hình dạng:** tròn, vuông, đường thẳng.
- **Khớp màu:** mảng màu chủ đạo.
- **Khớp bố cục:** vị trí chủ thể, đường chân trời, quy tắc thirds (xem `core/composition.md`).

## 7. Quy tắc quyết định
- `R-GMATCH-1`: NẾU không chỉ ra được yếu tố khớp cụ thể (hình, màu, bố cục) trong `reason` → không dùng.
- `R-GMATCH-2`: NẾU sai lệch vị trí điểm nhấn > 15% → chọn khung khác hoặc dùng `hard_cut` thường.
- `R-GMATCH-3`: NẾU style `documentary` VÀ chỉ để làm đẹp → bỏ (Storytelling > Decoration).
- `R-GMATCH-4`: nếu dùng `cross_dissolve` kèm, áp `R-DIS-1`, `R-DIS-2`.
- `R-GMATCH-5`: không scale/crop hình chỉ để ép khớp; hình mất chất lượng.

## 8. Ví dụ
Cảnh toàn cảnh sân khấu với ánh đèn tròn ở giữa (`c11`) nối vào cảnh học viên nhìn lên đèn tròn trên trần lớp (`c12`); hai vòng tròn cùng vị trí giữa khung.

```json
{
  "id": "d10",
  "technique": "hard_cut",
  "preset": "cut_hard",
  "anchor": { "between": ["c11", "c12"] },
  "duration": 0,
  "parameters": { "cut_on": "silence" },
  "reason": "Khớp hình vòng tròn ở giữa khung để chuyển từ sân khấu sang lớp học mà liền mạch thị giác",
  "priority": "storytelling",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```
Phần khớp nằm trong việc chọn khung `source_out`/`source_in`; EDL không có tham số khớp.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Khớp lệch | Điểm nhấn nhảy khi cắt | `R-GMATCH-2` |
| Màu lệch do grade | Hai khung khác tông | Áp cùng `color_grade_basic` |
| Ép scale | Hình mờ, lộ pixel | `R-GMATCH-5` |
| Match đẹp nhưng vô nghĩa | `reason` chỉ nói "đẹp" | `R-GMATCH-3` |
| Dissolve kéo dài | Khung chồng lên nhau lòe loẹt | `dissolve_short`, `R-DIS-1` |

## 10. Kiểm tra sau render
- Cặp khung cạnh nhau: hình/màu/bố cục khớp, không nhảy.
- Điểm nối không khiến người xem chú ý hơn nội dung.
- Nếu có dissolve: không chữ hoặc `punch_in` trong vùng mờ chồng.
- Màu hai clip nhất quán sau grade.
