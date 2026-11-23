---
id: fade_in_out
name: Fade In / Fade Out (Mở từ màu, kết xuống màu)
group: transitions
roles: [opening, closing, closure]
status: usable
source_of_values: convention
---

# Fade In / Fade Out

> **Khác các chuyển cảnh còn lại:** `fade_in_out` **không dùng `anchor.between`**. Nó neo vào **một clip** bằng `anchor.clip` + `source_time` (giây trong file nguồn) và không nối hai clip. Nó áp lên **cả khung hình và tiếng** của toàn video (tiếng chỉ khi `audio: true`).

## 1. Mục đích
Mở video từ màn đen (hoặc màu khác) hoặc kết video xuống màn đen/trắng. Là **dấu mở đầu và kết thúc** của cả video, không phải cách nối hai cảnh giữa video.

## 2. Khi nên dùng
- Mở video: hình lên từ đen kèm tiếng nhỏ dần lên (`fade_in_black`), nhất là khi cảnh đầu là b-roll toàn cảnh êm.
- Kết video: hình xuống đen, tiếng nhỏ dần (`fade_out_black`) sau câu khép lại.
- Kết video tông ấm, nhẹ (hồi tưởng, lời cảm ơn): `fade_out_white`.
- Style documentary: dùng được và không tính vào `budget.special_transition` (renderer không đưa `fade_in_out` vào nhóm chuyển cảnh đặc biệt khi đếm ngân sách).

## 3. Khi không nên dùng
- Ở giữa video để nối hai đoạn: dùng `dip_to_black` hoặc `cross_dissolve` (không phải `fade_in_out`).
- Khi video mở bằng câu hook ngay khung đầu (hook cần hình và tiếng rõ từ giây 0): fade in làm trễ hook.
- Khi video là phần ghép vào chuỗi lớn hơn, đã có fade ở chỗ ghép.
- Kết video bằng fade quá dài làm cụt hơi cuối câu hoặc lấn vào chữ kết (xem mục 9).
- Cảnh đầu/cuối vốn đã đen: fade vô nghĩa.

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `where` | `in` hoặc `out` (theo preset) | `in`, `out` | – | high (tính chất kỹ thuật: bắt buộc một trong hai) |
| `duration` | 1.0 (`fade_in_black`), 1.2 (`fade_out_black`), 1.0 (`fade_out_white`) | 0.5–2.0 (renderer kiểm tra hợp lệ trong 0.2–3.0) | giây | medium |
| `color` | `#000000` hoặc `#ffffff` | mã màu hex | – | medium |
| `audio` | `true` | `true`, `false` | – | medium |

**Cách renderer làm:**
- `in`: lớp phủ màu phủ kín ở frame neo rồi độ đục giảm tuyến tính về 0 trong `duration`. Vùng fade bắt đầu **tại** frame neo.
- `out`: độ đục tăng tuyến tính từ 0 lên 1 trong `duration`, kết thúc **tại** frame neo (vùng bắt đầu `duration` trước điểm neo; nếu clip/video ngắn hơn thì rút).
- Fade là tuyến tính (không có `easing` trong preset).
- Lớp màu nằm **trên cả chữ** (phụ đề, `lower_third`, `kinetic_text` cũng bị phủ).
- Tiếng: nếu `audio: true`, âm lượng mọi nguồn (tiếng clip, SFX, nhạc nền) nhân với hệ số tuyến tính 0 đến 1 (`in`) hoặc 1 đến 0 (`out`) trong vùng fade.

## 5. Quy trình thực hiện
1. **Mở video:** neo vào **clip đầu**, `source_time` = `source_in` của clip đó; `where: in`. **Kết video:** neo vào **clip cuối**, `source_time` = `source_out`; `where: out`. Mốc phải nằm trong `[source_in, source_out]` của clip, nếu không renderer báo lỗi.
2. **Không cần tay cầm**: fade phủ lên chính thân clip, không mở rộng hình ra ngoài điểm cắt. Tuy vậy clip phải đủ dài để chứa vùng fade (≥ `duration`; đặt `duration` quá dài thì vùng fade lấn sang clip bên cạnh).
3. Chọn preset: `fade_in_black` (mở), `fade_out_black` (kết), `fade_out_white` (kết nhẹ).
4. Điều chỉnh `audio`: để `true` khi muốn tiếng cũng nhỏ dần cùng hình (mặc định). Đặt `false` nếu cố ý giữ tiếng/nhạc liền (ví dụ nhạc kết đã tự nhỏ).
5. Kiểm tra chữ ở vùng fade: tên lower third hay phụ đề cuối bị phủ màu (mục 9).
6. Mỗi video thường chỉ có tối đa một `in` và một `out`.

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `fade_in_black` | Mở từ đen, 1.0 s, tiếng lên dần |
| `fade_out_black` | Kết xuống đen, 1.2 s, tiếng nhỏ dần |
| `fade_out_white` | Kết xuống trắng, 1.0 s |

## 7. Quy tắc quyết định
- `R-FADE-1`: chỉ ở đầu (`in`) và cuối (`out`) video; giữa video dùng kỹ thuật khác.
- `R-FADE-2`: `in` neo vào clip đầu tại `source_in`; `out` neo vào clip cuối tại `source_out`.
- `R-FADE-3`: `duration` ≤ độ dài clip chứa nó; tối đa khoảng 2 s ở documentary.
- `R-FADE-4`: NẾU câu hook ở frame đầu THÌ không `fade_in`, hoặc rút `duration` xuống ≤ 0.5 s.
- `R-FADE-5`: không để chữ then chốt (tên, số liệu) rơi vào vùng fade vì lớp màu phủ cả chữ.
- `R-FADE-6`: mỗi video tối đa một `in` và một `out`.

## 8. Ví dụ
Mở video tổng kết bằng cảnh toàn cảnh sân trường lúc sáng sớm (clip đầu c01, `source_in` = 0.5 s trong file nguồn): hình lên từ đen, tiếng lên dần.

```json
{
  "id": "d01",
  "technique": "fade_in_out",
  "preset": "fade_in_black",
  "anchor": { "clip": "c01", "source_time": 0.5 },
  "duration": 1.0,
  "parameters": { "where": "in", "duration": 1.0 },
  "reason": "Mở video bằng cảnh toàn cảnh êm, lên từ đen để vào bài nhẹ nhàng",
  "priority": "storytelling",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```

Kết video: clip cuối c12 có `source_out` = 18.4 s:

```json
{
  "id": "d12",
  "technique": "fade_in_out",
  "preset": "fade_out_black",
  "anchor": { "clip": "c12", "source_time": 18.4 },
  "duration": 1.2,
  "parameters": { "where": "out", "duration": 1.2 },
  "reason": "Khép video sau câu cảm ơn, hình và tiếng nhỏ dần",
  "priority": "storytelling",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Neo bằng `between` | Báo lỗi: `fade_in_out` cần `anchor.clip` | Dùng `anchor.clip` + `source_time` |
| `source_time` không đúng đầu/cuối | Fade `in` không bắt đầu từ frame 0 của video (các frame trước không đen) | `R-FADE-2` |
| Chữ kết bị phủ | Phụ đề hoặc tên cuối chìm trong màu | `R-FADE-5`; dời chữ ra trước vùng fade |
| Fade out cắt hơi cuối câu | Lời cuối nhỏ đi giữa chừng | Cho `source_out` sau hơi thở; rút `duration` |
| Fade in che hook | Giây đầu đen, mất ý | `R-FADE-4` |
| Nhạc/SFX bị nhỏ theo ngoài ý muốn | Tiếng nhạc hạ cùng hình | Đặt `audio: false` nếu muốn giữ tiếng riêng |

## 10. Kiểm tra sau render
- Frame đầu hoàn toàn là màu fade (với `in`); tại điểm kết, hình đã tối hoặc trắng gần kín (ở frame cuối cùng có thể chưa đạt đúng 100%, vì độ đục tuyến tính theo frame).
- Tiếng nhỏ dần/lên dần theo hình, không "tạch" hoặc còn nhạc bất ngờ.
- Chữ ở vùng fade còn đúng ý (hoặc đã dời).
- `duration` không dài hơn clip chứa nó.
- Không dùng fade ở giữa video.
