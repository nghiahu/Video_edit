# Hướng dẫn zoom: khi nào, bao nhiêu, nhanh chậm ra sao

> **Tạm tắt:** theo yêu cầu người dùng, không tự dùng zoom (`R-ZOOM-0` trong `core/decision-engine.md`). File này chỉ dùng khi người dùng yêu cầu zoom ở cảnh cụ thể.

Đọc trước khi đưa `punch_in`, `punch_out` hoặc `slow_push` vào EDL. Ba kỹ thuật dùng chung một cơ chế: phóng lớp hình quanh một điểm neo. Zoom "bừa" và "giật" thường do năm lỗi: đặt sai chỗ, sai độ lớn, sai tốc độ, **nhảy khung khi về 1.0**, và **zoom rồi thả ngay** (trông như nháy, buồn cười).

**Nguyên tắc dựng:** zoom đi cùng một ý rồi kết thúc ở **điểm cắt**. Không zoom vào rồi thả ra trong cùng một cảnh; muốn đổi khung thì để điểm cắt làm việc đó.

> Con số trong file này: các giới hạn của `validate` và preset là **quy ước** (`confidence: low`). Bảng đo độ mượt (mục 3) là **đo thật**: tính đường cong scale theo từng khung ở 30 fps, kèm render đối chiếu chênh lệch giữa hai khung liền nhau (`YDIF`).

## 1. Zoom hay không? (chọn theo nội dung, không theo cảm giác)

| Tình huống | Quyết định | Vì sao |
|---|---|---|
| Câu then chốt của người nói (`importance: high`), khung trung (`medium`) | `punch_in_subtle`, bắt đầu **ngay trước** từ nhấn, giữ đến hết ý | Zoom đi cùng ý |
| Khung đã cận (mặt chiếm > 40% chiều cao) | **Không zoom** (R-EMP-3) | Cắt mất đỉnh đầu, mặt đầy khung |
| Người nói đang cử động mạnh, hoặc sắp cắt trong 1 s | Không zoom (R-EMP-4) | Hai chuyển động chồng nhau |
| Toàn cảnh tĩnh dài ≥ 4 s, không lời (b-roll, cảnh mở) | `slow_push_subtle` suốt cảnh | Dẫn mắt vào chủ thể, không gây chú ý |
| Cảnh kết, khép lại, "thở" sau ý nặng | `punch_out` (lùi ra) | Mở bối cảnh |
| Clip đã có chuyển động camera (dolly, drone bay tới, pan, rung) | **Không thêm zoom** | Chồng chuyển động gây rối |
| Cảnh đông người, nhiều chuyển động | Không zoom | Zoom làm cảnh nhiễu |
| Vỗ tay, phản ứng cảm xúc | Giữ khung hoặc cắt, không zoom | Để khoảnh khắc tự đứng |
| Khung có chữ quan trọng trên hình (slide, bảng hiệu) | Không zoom | Cắt mất mép chữ |

Hỏi trước khi zoom: **zoom này làm người xem hiểu hay cảm nhận được điều gì mà không zoom thì không có?** Không trả lời được thì bỏ. Không zoom hai lần trong 6 s (R-FREQ-1); documentary chỉ `punch_in_subtle`, rất ít.

## 2. Zoom bao nhiêu (độ lớn)

| Loại khung | Mức zoom cuối gợi ý | Ghi chú |
|---|---|---|
| Toàn cảnh (người nhỏ trong khung) | `slow_push`: 1.03–1.05 | `punch_in` ít khi cần; nếu dùng ≤ 1.10 |
| Trung (`medium`) | `punch_in_subtle`: 1.08–1.12 (preset 1.10) | Mắt còn ở khoảng 1/3 trên khung sau zoom. Dưới ~1.05 trông như "hơi nhúc nhích", không thành ý đồ |
| Trung, sự kiện sôi động | `punch_in_standard`: 1.15–1.20 (preset 1.18) | Không dùng ở documentary |
| Cận (`close`) | không zoom | |
| Nguồn 1080p dựng 1080p | tối đa ≈ 1.10 | Phóng quá làm mềm hình |
| Nguồn 4K dựng 1080p | `validate` cho đến 1.30 | Vẫn nên ≤ 1.20 |

Quy tắc kiểm: sau zoom đỉnh đầu không bị cắt, mắt còn trong 1/3 trên, không cắt chữ trên hình. Kiểm bằng ảnh khung ở scale cuối.

## 3. Zoom mượt và không "thả"

Ba lỗi đã gặp và đã sửa trong renderer và preset:

1. **Easing `ease_out_*` trên thời gian ngắn:** zoom bắt đầu ở tốc độ tối đa ngay khung đầu. `punch_in_subtle` cũ (0,35 s, `ease_out_cubic`, +7%) nhảy **1,9%** scale ở khung đầu tiên; render đối chiếu cho đỉnh `YDIF` ~8,5 so với ~0,4 lúc tĩnh. Preset mới dùng `ease_in_out` (vận tốc và gia tốc bằng 0 hai đầu).
2. **Zoom về 1.0 trong một khung:** bản đầu để `return: cut` giữa cảnh nên scale **nhảy 7%** (subtle) hoặc **12%** (standard) trong đúng một khung, vì không có điểm cắt nào che.
3. **"Zoom hơi hơi rồi thả":** bản sửa đầu cho zoom lùi ra mượt nhưng vẫn là một nhịp vào–ra ngắn, trông như nháy. **Bản hiện tại:** `return: keep` (và `cut`) **giữ zoom đến hết clip**, điểm cắt kế tiếp đặt lại khung. Việc của người lập kế hoạch là đặt `source_out` ngay sau cuối ý. `validate` cảnh báo khi zoom hiện < 2 s trước điểm cắt (quá ngắn), khi giữ > 12 s (nên cắt giữa chừng), và khi vào rồi lùi (`zoom_out`) trong < 2 s.

Số đo (30 fps):

| Cấu hình | Bước scale lớn nhất giữa hai khung | Tốc độ đỉnh | Đỉnh `YDIF` trên render |
|---|---|---|---|
| subtle **cũ** (0,35 s, ease_out_cubic, về bằng cut) | 7,00% (lúc về 1.0) | ≈ 210%/s | (khung đầu 8,5) |
| standard **cũ** (0,3 s, ease_out_cubic, cut) | 12,00% | ≈ 360%/s | – |
| subtle **mới** (1.10, 1,0 s, ease_in_out, giữ đến cắt) | 0,62% | ≈ 19%/s | 3,5 |
| standard **mới** (1.18, 0,7 s, ease_in_out, giữ đến cắt) | 1,61% | ≈ 48%/s | 6,8 |
| thử "nháy" (0,35 s ease_out, lùi 0,3 s) | – | – | 8,5 (và `validate` cảnh báo) |

Quy tắc làm mượt (kiểm bằng `validate`):
- Bước scale ở khung đầu ≤ 0,8% (cảnh báo nếu vượt).
- `ease_in_out` cho subtle và standard; `ease_out_*` chỉ khi **cố tình** muốn cú "đập" (aggressive) và có điểm cắt ngay sau.
- `slow_push`: tăng khoảng 1–2%/giây gần như không nhận ra; trên 3%/giây thành "zoom" (xem `slow-push.md`). Dùng `ease_in_out`.
- Không đổi `anchor_point` giữa các zoom liên tiếp trên cùng clip (hình dịch ngang).
- Không dùng `punch_in` và `slow_push` trên cùng clip (R-FREQ-4).

## 4. Chọn preset theo cảnh

| Cảnh | Preset | Đặt thời điểm | Sau đó |
|---|---|---|---|
| Talking-head trung, câu then chốt, documentary | `punch_in_subtle` (1.10, vào 1,0 s) | `start_offset` −0,1 s so với từ nhấn; **cắt clip ở cuối ý** | giữ zoom đến điểm cắt; khung đặt lại ở cảnh kế |
| Talking-head trung, sự kiện sôi động | `punch_in_standard` (1.18, vào 0,7 s) | như trên | giữ đến điểm cắt |
| Toàn cảnh tĩnh dài, mở video | `slow_push_subtle` (1.04) cả clip | đầu clip | không chồng chữ lớn giữa khung |
| Kết đoạn, kết video | `punch_out_subtle` (1.08 → 1.0, 1,0 s) | đầu cảnh kết | thường kèm `dip_to_black`/`fade_out_black` |
| Nhấn bất ngờ, năng lượng cao (không dùng documentary) | `punch_in_aggressive` (1.25, ease_out) | đúng từ nhấn | cắt thẳng sang cảnh khác ngay sau |

## 5. Quy trình đặt zoom cho một câu
1. Xác định câu và từ nhấn; lấy `source_time` (nếu chỉ có mốc đoạn, ghi `confidence: low`).
2. Kiểm tra mục 1 (khung, chuyển động, khoảng cách, ngân sách).
3. Chọn preset theo cảnh (mục 4); đừng tự đặt `end_scale` ngoài mức ở mục 2.
4. Đặt `start_offset` để zoom bắt đầu ngay trước từ nhấn. **Đặt `source_out` ngay sau cuối ý** để zoom giữ ≥ 2 s rồi kết thúc ở điểm cắt (ý dài hơn 12 s thì cắt giữa chừng bằng một cú cắt sang khung khác).
5. `validate`: không cảnh báo giật, không cảnh báo zoom quá ngắn hoặc quá dài.
6. Render preview và xem 5 khung: trước zoom, giữa lúc vào, scale cuối, giữ, sau điểm cắt. Xem mắt, đỉnh đầu, chữ trên hình.

## 6. Chưa kiểm chứng
- Cảm nhận **bằng mắt** về độ mượt trên video thật (mới đo bằng số, `YDIF` và xem 12 khung tĩnh trên preview 960×540).
- Zoom trên footage 4K gốc ở độ phân giải đầu ra thật.
- Zoom khi footage có rung tay (handheld).
- Điểm neo `face` (không có phát hiện khuôn mặt; điểm neo cố định theo tỉ lệ khung).
- Mức 1.10 và 1.18 là quy ước hợp lý, chưa so với ý người dùng; có thể phải chỉnh.
