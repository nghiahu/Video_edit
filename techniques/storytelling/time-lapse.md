---
id: time_lapse
name: Time-lapse (Tua nhanh)
group: storytelling
roles: [pacing, compression, rhythm]
status: usable
source_of_values: convention
---

# Time-lapse

## 1. Mục đích
Nén một quá trình dài, lặp đi lặp lại (dựng sân khấu, dọn dẹp, viết, nấu, đông người đến dần) thành vài giây để người xem thấy "kết quả đã đến thế nào" mà không phải xem hết. Đây là cách **rút ngắn thời gian**, khác `hard_cut` (bỏ hẳn đoạn giữa) vì vẫn cho thấy tiến trình liên tục.

## 2. Khi nên dùng
- Đoạn footage dài (≥ ~20 giây nguồn) mà hình thay đổi chậm và đều: bàn ghế được xếp, hội trường đầy dần, bảng được viết, cây đổ bóng.
- Đoạn **không có lời thoại quan trọng** (tiếng bị tắt trong đoạn tua, xem mục 4).
- Camera tĩnh hoặc chuyển động rất chậm: tua nhanh giữ được cảm giác ổn định.
- Cần nén thời lượng để đạt `target_duration_sec` mà không bỏ mất ý "quá trình".
- Hợp với **documentary**: preset không cấm style nào. Lớp ưu tiên: Storytelling (kể quá trình) hoặc Rhythm (nén nhịp), không phải Decoration.

## 3. Khi không nên dùng
- Đoạn có người nói quan trọng hoặc tiếng hiện trường mang nội dung (tiếng sẽ bị tắt trong đoạn tua, không thể giữ).
- Chuyển động của chủ thể là nội dung cần xem rõ (biểu cảm, cử chỉ, trao nhận): tua nhanh biến thành hài hước ngoài ý muốn.
- Cảnh handheld rung hoặc pan nhanh: tua nhanh làm rung khó chịu.
- Clip quá ngắn: `span` + `rate` làm đoạn đầu ra dưới ~1 giây thì không kịp thấy.
- Hai `time_lapse` liên tiếp trong cùng một mạch kể: người xem mất mốc thời gian.

## 4. Thông số
| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `rate` | 8 (`time_lapse_8x`); 4 (`time_lapse_4x`) | 1.5–32 (kiểm tra hợp lệ); nên dùng 4–16 | × | medium |
| `span` | 0 (từ điểm neo đến hết clip) | ≥ 0; > 0 = số giây **nguồn** tính từ điểm neo | giây | medium |
| `anchor.source_time` | – | trong `[source_in, source_out]` của clip | giây nguồn | – |

Tính thời lượng đầu ra của đoạn tua: `span_nguồn / rate`. Ví dụ 52 giây nguồn ở 8× còn 6,5 giây.

Giới hạn hiện thực (cần biết):
- Tốc độ phát do Remotion `OffthreadVideo` `playbackRate`; renderer cho phép `rate` đến 32 nhưng **chưa kiểm chứng** Remotion có giữ đúng tốc độ trên 16×. Nên giữ ≤ 16 và xem lại bản preview.
- Chỉ **đổi tốc độ phát**, không trộn khung hay nhòe chuyển động: ở tốc độ cao, chuyển động có thể giật (stutter), đặc biệt khi `rate` không chia hết nhịp khung.
- Đoạn đầu ra ngắn hơn 1 khung bị bỏ khỏi timeline.
- **Tiếng của đoạn tua bị tắt hoàn toàn** (renderer chỉ giữ tiếng của đoạn tốc độ 1×). Không có tùy chọn giữ tiếng đã tăng cao độ.

## 5. Quy trình thực hiện
1. Xác nhận đoạn là quá trình lặp, không lời (mục 2, 3).
2. Chọn điểm bắt đầu tua: `anchor: { clip, source_time }` là giây nguồn nơi tốc độ bắt đầu tăng (cắt thẳng, không ramp).
3. Chọn `span`: 0 nếu tua đến hết clip; hoặc số giây nguồn nếu muốn quay về 1× sau đó.
4. Chọn `rate`: 4× cho quá trình còn nhìn ra chuyển động; 8× trở lên cho quá trình rất chậm.
5. Nếu `span` kết thúc giữa clip, đoạn sau trở lại tốc độ 1× và **tiếng quay lại** từ đó.
6. Cân nhắc đặt `kinetic_text` hoặc `lower_third` ghi mốc thời gian ("Trước giờ khai mạc 3 tiếng") để người xem hiểu đây là tua.

## 6. Biến thể và preset
| Preset | `rate` | Dùng khi |
|---|---|---|
| `time_lapse_8x` | 8 | Quá trình dài, thay đổi chậm |
| `time_lapse_4x` | 4 | Muốn nhẹ hơn, còn đọc được chuyển động |

Cả hai `allowed_styles: ["all"]`, không cấm style nào; confidence preset `medium`.

## 7. Quy tắc quyết định
- `R-LAPSE-1`: NẾU clip có lời thoại cần giữ (`audio: keep` và `importance` cao) trong đoạn dự định tua THÌ tránh.
- `R-LAPSE-2`: NẾU `span / rate` < ~1,5 giây THÌ tránh (người xem không kịp hiểu), gộp bằng `hard_cut`.
- `R-LAPSE-3`: NẾU camera `handheld` hoặc `pan` nhanh THÌ tránh; ưu tiên camera `static`.
- `R-LAPSE-4`: không hai `time_lapse` cách nhau < ~10 giây đầu ra trong documentary (Storytelling > Rhythm).
- `R-LAPSE-5`: **tác động lên neo cùng clip:** `source_time` của mọi quyết định khác (`punch_in`, `kinetic_text`, `lower_third`, `subtitles`, `slow_push`...) neo vào đoạn tua được quy đổi theo tốc độ mới: mốc nằm sau điểm neo tua sớm hơn trên timeline (`(t − bắt đầu)/rate`). Nhưng `duration`, `hold`, `start_offset` tính bằng **giây đầu ra** và không được co lại. Vì vậy một `lower_third` 4 giây neo trong đoạn tua 6 giây sẽ chiếm phần lớn đoạn đó; `punch_in` có `hold` dài có thể bị rút khi vượt hết clip (renderer ghi cảnh báo). Tránh neo hiệu ứng nhấn vào giữa đoạn tua.
- `R-LAPSE-6`: mọi mốc của clip **sau** đoạn tua dịch sớm theo; kiểm tra lại nhịp và `target_duration_sec`.

## 8. Ví dụ
Clip `c03` quay tĩnh việc dựng sân khấu, nguồn 12,0 đến 72,0 giây, không lời. Giữ 8 giây đầu ở 1×, sau đó tua 8×: đoạn tua 52 giây nguồn còn 6,5 giây; clip từ 60 giây còn 14,5 giây.

```json
{
  "id": "d05",
  "technique": "time_lapse",
  "preset": "time_lapse_8x",
  "anchor": { "clip": "c03", "source_time": 20.0 },
  "start_offset": 0,
  "duration": 0,
  "parameters": {},
  "reason": "Dựng sân khấu mất cả tiếng, không lời; tua nhanh để người xem thấy sân khấu hoàn thành mà không mất thời gian",
  "priority": "rhythm",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Tua cảnh có người nói | Lời biến mất, hình môi mấp máy | `R-LAPSE-1` |
| Nhấn chữ quá dài trong đoạn tua | Chữ chiếm gần hết đoạn, hiệu ứng bị rút | `R-LAPSE-5` |
| Tua quá nhanh | Hình giật, không đọc được chuyển động | Giảm `rate`, dùng 4× |
| Tua quá ngắn | Đoạn đầu ra < 1,5 giây | `R-LAPSE-2` |
| Bất ngờ mất tiếng | Cảnh đang có tiếng nền rồi im | Ghi nhận trước; dùng nhạc hoặc ambience lót |

## 10. Kiểm tra sau render
- Đoạn tua chuyển động mượt, không giật rõ; tốc độ đúng như mong muốn.
- Tiếng gốc im đúng trong đoạn tua và trở lại đúng điểm sau `span`.
- Tổng thời lượng clip đầu ra đúng với tính toán; các chữ/nhấn neo vào clip nằm đúng khoảnh khắc sau khi dịch.
- Không có khung đen hay nhảy ở hai ranh giới tốc độ.
