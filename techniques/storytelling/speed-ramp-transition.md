---
id: speed_ramp_transition
name: Speed Ramp Transition (Chuyển cảnh tăng/giảm tốc)
group: storytelling
roles: [transition, energy, rhythm]
status: usable
source_of_values: convention
---

# Speed Ramp Transition

## 1. Mục đích
Tăng tốc cuối clip A rồi giảm tốc đầu clip B quanh điểm cắt, tạo cảm giác "lao qua" từ cảnh này sang cảnh kia. Là kỹ thuật chuyển cảnh năng lượng cao, kiểu video sự kiện, thể thao, du lịch.

## 2. Khi nên dùng
- Video có phong cách năng động (recap sự kiện, quảng bá) và cắt giữa hai cảnh chuyển động theo cùng hướng/nhịp.
- Cả hai clip đủ dài và có chuyển động đều ở đoạn cuối A và đoạn đầu B.
- Tối đa 1 đến 2 lần trong video; dùng để đánh dấu bước ngoặt (từ phần này sang phần khác).
- **Không dành cho documentary**: preset `forbidden_styles: ["documentary"]` (kiểm tra hợp lệ báo lỗi nếu dùng ở style này).

## 3. Khi không nên dùng
- Style `documentary` (bị cấm; `core/decision-engine.md`, `styles/documentary.md`).
- Phần có lời thoại ở cuối A hoặc đầu B: tiếng của đoạn ramp bị tắt.
- Clip ngắn: đoạn ramp tiêu thụ nhiều nguồn hơn thời lượng hiển thị (xem mục 4), có thể rút ngắn hoặc không đủ.
- Cảnh tĩnh, không có chuyển động: tăng tốc không tạo cảm giác gì.
- Clip A hoặc B đang có `time_lapse`, `freeze_frame`, `j_l_cut` hoặc chuyển cảnh chồng (dissolve...) tại cùng điểm nối.

## 4. Thông số
| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `factor` | 5 (`standard`); 3 (`gentle`) | 1,5–10 | × | low |
| `duration` | 0,6 (`standard`); 0,8 (`gentle`) | 0,2–1,5 | giây đầu ra, **mỗi phía** | low |
| `steps` | 6 | không kiểm tra; nên 4–10 | bậc | low |
| `anchor.between` | – | hai clip liền kề `["A","B"]` | – | – |

Cách renderer làm:
- Ramp chia thành `steps` bậc, mỗi bậc dài `duration/steps` giây đầu ra. Tốc độ bậc thứ i (tính từ 0): ramp ra `1 + (factor−1)·(i+0,5)/steps`; ramp vào là đối xứng ngược. Vì lấy giữa bậc nên **không bao giờ chạm đúng `factor`** (với `factor` 5, `steps` 6: tốc độ từ ≈1,33 đến ≈4,67; với `factor` 3: ≈1,17 đến ≈2,83).
- **Tiêu thụ nguồn nhiều hơn thời lượng hiển thị**: với `speed_ramp_standard`, mỗi phía dùng ≈1,8 giây nguồn để hiển thị 0,6 giây. Với `speed_ramp_gentle`: ≈1,6 giây nguồn cho 0,8 giây. Clip A cần ≥ chừng đó nguồn ở cuối (tính từ `source_out`), clip B ở đầu (tính từ `source_in`). Clip ngắn hơn bị rút và renderer ghi cảnh báo "quá ngắn".
- Cả hai clip **co lại**: mỗi phía ngắn đi `nguồn tiêu thụ − duration` (≈1,2 giây ở `standard`, ≈0,8 giây ở `gentle`). Mọi mốc sau đó dịch sớm.
- Điểm nối vẫn là **cắt thẳng** giữa hai clip; không có lớp phủ, không chồng. Chỉ tốc độ thay đổi.
- **Chưa có nhòe chuyển động (motion blur)**: chỉ đổi tốc độ phát, nên ở tốc độ cao hình có thể giật và không có cảm giác "lướt" như speed ramp thật có blur. Đây là hạn chế đã biết.
- **Tiếng của hai đoạn ramp bị tắt**; phần còn lại của clip giữ tiếng bình thường.
- Tốc độ phát do Remotion `playbackRate`; mỗi bậc là một đoạn video riêng, có thể thấy bước nhảy tốc độ nếu `steps` ít.

## 5. Quy trình thực hiện
1. Xác nhận style cho phép (không phải documentary) và cả hai clip đều chuyển động ở chỗ nối.
2. Kiểm tra độ dài nguồn: A còn ≥ ~2 giây trước `source_out`, B còn ≥ ~2 giây sau `source_in` (với `standard`).
3. Chọn preset: `speed_ramp_gentle` là mặc định an toàn; `standard` khi cần mạnh.
4. Đặt `anchor: { between: ["A","B"] }`. Không dùng `start_offset`.
5. Đặt đoạn ramp sau khi chắc chắn không có chuyển cảnh chồng khác tại điểm nối (`R-RAMP-4`).
6. Xem lại preview: tốc độ lên/xuống phải liền, không khựng.

## 6. Biến thể và preset
| Preset | `factor` / `duration` / `steps` | Dùng khi |
|---|---|---|
| `speed_ramp_gentle` | 3 / 0,8 / 6 | Nhẹ, hợp video sự kiện vừa phải |
| `speed_ramp_standard` | 5 / 0,6 / 6 | Mạnh, video quảng bá, thể thao |

Cả hai `forbidden_styles: ["documentary"]`, confidence `low`.

## 7. Quy tắc quyết định
- `R-RAMP-1`: NẾU `strategy.style = documentary` THÌ tránh (kiểm tra hợp lệ báo lỗi).
- `R-RAMP-2`: NẾU nguồn còn lại ở cuối A hoặc đầu B ít hơn nguồn tiêu thụ của ramp (≈1,8 giây `standard`, ≈1,6 giây `gentle`) THÌ tránh hoặc dùng preset nhẹ hơn.
- `R-RAMP-3`: NẾU có lời thoại cần giữ ở cuối A hoặc đầu B THÌ tránh (tiếng ramp bị tắt).
- `R-RAMP-4`: không chồng với `j_l_cut` hoặc chuyển cảnh đặc biệt khác tại cùng điểm nối. Lưu ý: đoạn ramp không phải tốc độ 1× nên **không có tiếng**, kéo theo phần kéo tiếng của `j_l_cut` bị bỏ.
- `R-RAMP-5`: không quá 1 lần mỗi ~30 giây video (cũng tính vào ngân sách chuyển cảnh đặc biệt khi có).
- `R-RAMP-6`: **tác động lên neo cùng clip:** `source_time` của quyết định khác (`punch_in`, chữ...) neo trong phần ramp được quy đổi theo tốc độ, bị nén; còn `duration`/`hold` vẫn tính theo giây đầu ra. Tránh neo hiệu ứng khác vào đoạn ramp (cuối A, đầu B). Mọi mốc **sau** đoạn ramp của A dịch sớm (clip A co lại), và của B cũng vậy.

## 8. Ví dụ
Hai clip chạy bộ liên tiếp trong video recap thể thao (không phải documentary), nối bằng tăng/giảm tốc nhẹ.

```json
{
  "id": "d12",
  "technique": "speed_ramp_transition",
  "preset": "speed_ramp_gentle",
  "anchor": { "between": ["c04", "c05"] },
  "start_offset": 0,
  "duration": 0,
  "parameters": {},
  "reason": "Hai cảnh chạy cùng hướng, chuyển từ vòng khởi động sang vòng thi đấu; tăng tốc nhẹ làm bước ngoặt rõ hơn",
  "priority": "rhythm",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Dùng ở documentary | Kiểm tra hợp lệ báo preset bị cấm | `R-RAMP-1` |
| Clip quá ngắn | Cảnh báo "quá ngắn cho đoạn tăng tốc" | `R-RAMP-2` |
| Kỳ vọng nhòe chuyển động | Hình tăng tốc nhưng giật, không "lướt" | Ghi rõ hạn chế; dùng `gentle` |
| Mất lời | Câu cuối của A hoặc câu đầu của B không nghe | `R-RAMP-3` |
| Neo chữ vào đoạn ramp | Chữ xuất hiện lệch/ngắn | `R-RAMP-6` |

## 10. Kiểm tra sau render
- Tăng tốc ở cuối A liền, giảm tốc ở đầu B liền; không đứng hình hay giật nhảy.
- Tổng thời lượng hai clip đúng (mỗi bên co lại theo mục 4).
- Tiếng im đúng đoạn ramp và trở lại sau đó.
- Cảnh báo "quá ngắn" không xuất hiện khi render.
- Ghi nhận vấn đề: chưa có nhòe chuyển động. Nếu hình trông "cơ học", giảm `factor`.
