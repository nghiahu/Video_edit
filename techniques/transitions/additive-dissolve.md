---
id: additive_dissolve
name: Additive Dissolve (Mờ chồng cộng sáng / film dissolve)
group: transitions
roles: [time_passage, memory, softness]
status: usable
source_of_values: convention
---

# Additive Dissolve

## 1. Mục đích
Hai cảnh chồng lên nhau nhưng **cộng sáng** thay vì pha trộn thường: khung hình sáng lên ở giữa rồi hạ xuống cảnh mới (còn gọi film dissolve). Gợi **trôi thời gian, ký ức, cảm giác phim**; mạnh hơn `cross_dissolve` một bậc nên dùng ít hơn.

## 2. Khi nên dùng
- Chuyển từ cảnh hiện tại sang hồi tưởng, hình ảnh cũ hoặc "nhiều năm sau" (lời dẫn có "ngày ấy", "từ đó").
- Nối hai b-roll chậm, không lời, tông trầm hoặc tối vừa (cảnh tối cộng sáng nhìn mượt hơn cảnh sáng).
- Kết một phần cảm xúc của video, cần "hơi thở" sáng nhẹ trước khi sang phần mới.
- Style documentary: được phép (preset `allowed_styles: all`, không bị cấm), nhưng tính vào `budget.special_transition` chung với `cross_dissolve` (0–2 mỗi video).

## 3. Khi không nên dùng
- Một trong hai clip đã sáng, nhiều vùng gần trắng (trời, đèn sân khấu, bảng chiếu): cộng sáng làm cháy trắng, trông như chớp sáng chứ không phải mờ chồng.
- Đoạn đối thoại/phát biểu liên tục, hoặc hai cảnh cùng thời điểm cùng địa điểm (`hard_cut` đủ).
- Khi có chữ (`kinetic_text`, `lower_third`, `subtitles`) hoặc `punch_in` rơi vào vùng chuyển.
- Khi không có tay cầm ở hai clip (xem mục 5).
- Dùng liền ngay sau `cross_dissolve` hoặc chuyển cảnh đặc biệt khác (cách < 3 s).

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `duration` (tổng vùng chuyển, căn giữa điểm cắt) | 0.8 | 0.5–1.5 (renderer chấp nhận 0.15–3.0) | giây | medium |
| `easing` | `ease_in_out` | `linear`, `ease_in`, `ease_out`, `ease_in_out` | – | medium |

**Cách renderer làm** (`style: additive`, `overlap: true`): clip A giữ nguyên độ đục đến giữa vùng (p = 0.5) rồi mờ dần ra trong nửa sau. Clip B hiện dần đến độ đục đầy đủ ở p = 0.5, với `mix-blend-mode: plus-lighter` (cộng giá trị màu). Vì vậy ở giữa vùng hai hình đều ở độ đục đầy đủ và cộng vào nhau: đó là đỉnh sáng. Mức sáng thực tế phụ thuộc footage; chưa có số đo.

## 5. Quy trình thực hiện
1. Xác nhận có lý do kể chuyện (trôi thời gian, ký ức, kết phần). Không có thì để `hard_cut` (`R-CUT-1`).
2. **Tay cầm**: clip A phải còn ≥ `duration/2` giây nguồn sau `source_out`; clip B phải có ≥ `duration/2` giây nguồn trước `source_in`. Hai đoạn thừa này được hiển thị trong vùng chuyển (không đổi tổng độ dài video). Nếu thiếu, renderer tự rút ngắn đối xứng rồi cảnh báo; nếu hết tay cầm thì bỏ hiệu ứng, thành cắt thẳng.
3. Xem lại hai đoạn thừa: chúng sẽ lên hình. Nếu có cảnh người bước vào, tiếng "cắt", rung máy ở đoạn thừa thì rút `duration` hoặc đổi điểm cắt.
4. Chọn preset `additive_dissolve_soft`, đặt `anchor.between` hai clip liền kề.
5. **Âm thanh:** chỉ tác động hình. Muốn tiếng nối mượt, thêm `j_l_cut` ở cùng điểm nối hoặc để nhạc nền liền mạch.

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `additive_dissolve_soft` | 0.8 s, `ease_in_out`. Preset duy nhất hiện có |

Muốn nhẹ hơn thì rút `duration` về 0.5–0.6 s; nếu vẫn quá sáng thì đổi sang `cross_dissolve` (`dissolve_standard`).

## 7. Quy tắc quyết định
- `R-ADD-1`: chỉ dùng khi có lý do kể chuyện (trôi thời gian, ký ức, kết phần); ghi lý do vào `reason`. Priority `storytelling`.
- `R-ADD-2`: NẾU một trong hai khung có > ~1/3 diện tích rất sáng THÌ tránh, dùng `cross_dissolve`.
- `R-ADD-3`: cùng ngân sách `special_transition` với mọi chuyển cảnh đặc biệt; cách nhau ≥ 3 giây.
- `R-ADD-4`: không đặt chữ hoặc `punch_in` trong vùng chuyển.
- `R-ADD-5`: không dùng trong đoạn đối thoại hoặc phát biểu liên tục.
- `R-ADD-6`: tay cầm hai clip ≥ `duration/2`; không đủ thì rút `duration` hoặc dùng `hard_cut`.

## 8. Ví dụ
Lời dẫn nói "mười năm trước, nơi đây chỉ là một dãy phòng học nhỏ", chuyển từ cảnh toàn cảnh trường hiện tại (c05) sang ảnh quay cũ của trường (c06).

```json
{
  "id": "d05",
  "technique": "additive_dissolve",
  "preset": "additive_dissolve_soft",
  "anchor": { "between": ["c05", "c06"] },
  "duration": 0.8,
  "parameters": { "duration": 0.8 },
  "reason": "Lời dẫn chuyển sang quá khứ; sáng lên ở giữa gợi hồi tưởng",
  "priority": "storytelling",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```

Lưu ý: renderer đọc thời lượng từ `parameters.duration` (ghi đè preset); trường `duration` ở cấp quyết định nên ghi trùng cho nhất quán.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Cháy trắng ở giữa | Một khung gần như trắng toàn bộ vài frame | `R-ADD-2`; rút `duration`; đổi sang `cross_dissolve` |
| Dùng thay cắt thẳng khắp nơi | Video lờ mờ, mất nhịp | `R-ADD-1`, ngân sách |
| Thiếu tay cầm | Hình đứng hoặc nhảy trong vùng chuyển; có cảnh báo khi render | Mục 5 bước 2 |
| Đoạn thừa lộ nội dung thừa | Thấy người lạ, rung máy, đầu/đuôi cảnh xấu | Mục 5 bước 3 |
| Chữ nằm trong vùng sáng | Chữ khó đọc, chồng hai khung | `R-ADD-4` |

## 10. Kiểm tra sau render
- Đỉnh sáng ở giữa có chấp nhận được (không cháy trắng, không mất chi tiết quan trọng quá lâu).
- Không thấy hình bị đứng hoặc nhảy ở đầu/cuối vùng chuyển.
- Không có cảnh báo "không đủ tay cầm" trong log render.
- Tiếng ở điểm nối không "tạch" và không lệch.
- Số lần dùng nằm trong ngân sách `special_transition`.
