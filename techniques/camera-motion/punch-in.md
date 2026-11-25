---
id: punch_in
name: Punch-in Zoom
group: camera-motion
roles: [emphasis, attention, rhythm]
status: usable
source_of_values: convention
---

# Punch-in Zoom

> Độ mượt, độ lớn và cách đặt zoom: xem `zoom-guide.md`. Preset subtle và standard đã đổi sang `ease_in_out` và **giữ zoom đến điểm cắt** (không còn "zoom rồi thả"), sau khi thấy giật (khung đầu nhảy 1,9% scale; về 1.0 trong một khung) và trông như nháy.

## 1. Mục đích
Phóng nhanh vào khung hình ở đúng điểm nhấn của một câu nói, biểu cảm hoặc thông tin để kéo sự chú ý của người xem, đồng thời tạo nhịp cho đoạn talking-head dài.

## 2. Khi nên dùng
- Người nói vừa nói một câu **kết luận hoặc thông điệp chính** (`importance: high`).
- Có thông tin gây bất ngờ, hoặc đổi hướng nội dung.
- Đoạn talking-head đã giữ một khung > ~10 giây, cần làm mới nhịp (và câu đó đáng nhấn).
- Chuyển từ phần dẫn sang phần quan trọng.
- Nguồn đủ nét: nguồn 4K dựng ra 1080p thoải mái; nguồn 1080p dựng ra 1080p chỉ nên đến ~1.10.

## 3. Khi không nên dùng
- Hai `punch_in` cách nhau < 6 giây nguồn mà không có lý do (trừ `double_punch` có chủ đích).
- Người nói đang cử động mạnh, hoặc khung sắp chuyển cảnh trong vòng 1 giây.
- Khung đã cận (mặt chiếm > 40% chiều cao).
- Clip có camera chuyển động sẵn (dolly, pan, handheld rung).
- Style cần cảm giác tĩnh, trầm (cinematic chậm, nội dung nghiêm trang) — chỉ dùng `punch_in_subtle`, rất ít.
- Câu không quan trọng chỉ để "cho đỡ nhàm" khi có b-roll thay thế phù hợp hơn.
- Vượt `strategy.budget.punch_in`.

## 4. Thông số
| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `start_scale` | 1.0 | 1.0 | × | high |
| `end_scale` | 1.10 (subtle) / 1.18 (standard) / 1.25 (aggressive) | 1.05–1.30 | × | medium |
| `duration` (thời gian vào) | 1.0 (subtle) / 0.7 (standard) / 0.25 (aggressive) | 0.25–1.0 | giây | medium |
| `easing` | `ease_in_out` (subtle, standard) / `ease_out_quad` (aggressive) | `ease_in_out`, `ease_out_cubic`, `ease_out_quad`; `validate` cảnh báo nếu khung đầu nhảy > 0,8% scale | – | medium |
| `hold` (giữ ở scale cuối) | 1.0; **chỉ dùng khi `return: zoom_out`** (cut/keep giữ đến hết clip) | 0.5–2.0 | giây | medium |
| `return` | `keep` (subtle, standard) / `cut` (aggressive) | `cut`, `keep` (cả hai: **giữ zoom đến hết clip**, điểm cắt kế tiếp đặt lại khung), `zoom_out` (lùi ra, chỉ khi cố ý) | – | medium |
| `return_duration` (nếu `zoom_out`) | 0.7 | 0.3–1.0 | giây | low |
| `anchor_point` | `upper_third` | `upper_third`, `center`, `face` | – | medium |
| `start_offset` (so với điểm nhấn) | −0.1 | −0.2–0.0 | giây | medium |

## 5. Quy trình thực hiện
1. Từ pha 1, lấy câu `importance: high` và thời điểm bắt đầu từ/cụm từ nhấn (`source_time`). Nếu chỉ có mốc cấp đoạn, dùng đầu câu và ghi `confidence: low`.
2. Kiểm tra điều kiện ở mục 3 (khung, chuyển động, khoảng cách, ngân sách).
3. Chọn preset theo `motion_style` (subtle/standard/aggressive).
4. Đặt `start_offset` để zoom bắt đầu **ngay trước** hoặc **đúng** điểm nhấn, không sau.
5. Chọn `anchor_point`: `upper_third` (mắt trong vùng 1/3 trên) cho talking-head; `center` cho chủ thể ở giữa.
6. Chọn `hold` đủ để hết ý nhấn (thường đến hết cụm từ), rồi `return`:
   - `keep` hoặc `cut` (mặc định): **giữ zoom đến hết clip**; điểm cắt kế tiếp đặt lại khung. Vì vậy phải **cắt clip ở cuối ý** (đặt `source_out` ngay sau câu), để zoom đi cùng cả ý rồi "hết" ở điểm cắt. Zoom rồi thả ngay trong cùng cảnh trông như nháy.
   - `zoom_out`: chỉ khi cố ý (reveal) và cả vòng vào–giữ–ra ≥ 2 s; `validate` cảnh báo nếu ngắn hơn.
   - `keep`: giữ scale mới đến hết clip — chỉ khi từ điểm này nội dung chuyển sang cảm xúc sâu hơn.
7. Kiểm tra sau zoom: mắt còn trong vùng 1/3 trên, đỉnh đầu không bị cắt.

## 6. Biến thể và preset
| Biến thể | `end_scale` | Preset | Dùng khi |
|---|---|---|---|
| Subtle | 1.05–1.08 | `punch_in_subtle` | Documentary, phỏng vấn nghiêm túc |
| Standard | 1.10–1.15 | `punch_in_standard` | Tổng kết sự kiện, social vừa phải |
| Aggressive | 1.20–1.30 | `punch_in_aggressive` | Short-form năng lượng cao (không dùng cho documentary) |
| Double | 2 lần, mỗi lần +0.08 | `punch_in_double` | Chỉ hài hước/nhịp có chủ đích |

## 7. Quy tắc quyết định
- `R-EMP-1`, `R-EMP-3`, `R-EMP-4`, `R-FREQ-1`, `R-FREQ-3`, `R-FREQ-4` trong `core/decision-engine.md`.
- NẾU `style = documentary` THÌ chỉ `punch_in_subtle`, ngân sách ≈ 1 lần / 20–30 giây talking-head.
- NẾU câu chứa dữ kiện cụ thể THÌ ưu tiên `kinetic_text`; `punch_in` chỉ thêm nếu vẫn còn lý do riêng.

## 8. Ví dụ
Người dẫn chương trình nói: "Và hôm nay chính là **điểm khởi đầu** của hành trình." (clip talking-head, khung `medium`, nguồn 4K, dựng 1080p, style documentary).

- Điểm nhấn: cụm "điểm khởi đầu", `source_time` 14.2 trong `c03`.
- Không có `punch_in` nào trong 6 giây trước; ngân sách còn.

```json
{
  "id": "d04",
  "technique": "punch_in",
  "preset": "punch_in_subtle",
  "anchor": { "clip": "c03", "source_time": 14.2 },
  "start_offset": -0.1,
  "duration": 0.35,
  "parameters": { "end_scale": 1.07, "hold": 1.4, "return": "cut", "anchor_point": "upper_third" },
  "reason": "Câu thông điệp 'điểm khởi đầu' của MC, nhấn nhẹ theo phong cách documentary",
  "priority": "storytelling",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```
Sau khi giữ 1.4 giây, cắt sang b-roll học viên ngồi học (`return: cut`).

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Zoom quá nhanh gây giật | Duration < 0.2 s | Giữ 0.25–0.5 s, easing ra dần |
| Scale quá lớn làm mất bố cục | Đỉnh đầu bị cắt, mắt ra khỏi 1/3 trên | Giới hạn theo bậc, kiểm tra anchor |
| Lệch với nội dung | Zoom tới khi câu đã nói xong | `start_offset` âm nhẹ, dùng mốc đúng từ |
| Zoom ở mọi câu | Số `punch_in` > ngân sách, khoảng cách < 6 s | Quy tắc tần suất, chỉ giữ câu `high` |
| Zoom làm nguồn vỡ | Nguồn 1080p, scale > 1.15 | Kiểm tra `resolution` nguồn |
| Chồng với camera đang chuyển động | Clip có `camera: dolly/pan` | Bỏ `punch_in` |

## 10. Kiểm tra sau render
- Chuyển động vào mượt, không khựng ở frame đầu/cuối.
- Mắt người nói vẫn nằm vùng 1/3 trên khung; không cắt đỉnh đầu.
- Điểm nhấn khớp với từ cần nhấn (không lệch quá ~0.15 s).
- Quanh đó không có hiệu ứng thứ ba chồng lên.
