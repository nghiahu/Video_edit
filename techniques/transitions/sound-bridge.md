---
id: sound_bridge
name: Sound Bridge (Cầu nối âm thanh)
group: transitions
roles: [continuity, flow, audio]
status: usable
source_of_values: convention
---

# Sound Bridge

> **Đây là kỹ thuật dạng mẫu (pattern), không có quyết định riêng trong EDL.** Nó là cách dùng `j_l_cut` (preset `j_cut_standard`/`l_cut_standard`) và `audio` của từng clip (`keep`/`mute`/`duck`) để tiếng của cảnh này kéo sang cảnh sau (hoặc tiếng cảnh sau vào trước), nối hai cảnh bằng âm thanh. Hình vẫn nối bằng `hard_cut`. Chưa có SFX/ambience riêng trong renderer (`ambience` còn planned), nên cầu nối chỉ dùng được tiếng **có sẵn trong footage**.

## 1. Mục đích
Làm điểm nối mượt và có ý nghĩa: tiếng liên tục cho cảm giác thời gian liền, hoặc tiếng của cảnh sau dẫn người xem sang cảnh mới trước khi thấy nó.

## 2. Khi nên dùng
- Hai cảnh có ambience khác nhau (sân khấu ồn, phòng học im) và muốn tránh giật.
- Tiếng ý nghĩa nối hai cảnh: tiếng vỗ tay, tiếng chuông, tiếng MC kéo sang b-roll.
- Chuyển địa điểm: nghe tiếng nơi mới (tiếng giảng bài) vài trăm mili giây trước khi thấy hình (J-cut).
- Chèn b-roll lên lời đang nói (L-cut), đã mô tả ở `b-roll-insert.md`.
- Documentary: **rất hợp**; `j_l_cut` được ghi là nên dùng ở điểm nối có lời, và style yêu cầu giữ ambience hiện trường.

## 3. Khi không nên dùng
- Tiếng cầu nối bẩn hoặc chạm sang câu khác (hai người nói chồng): rối.
- Nguồn không còn đủ "đuôi" (L) hoặc "đầu" (J): cắt sát chữ sẽ cụt (`j-l-cut.md`).
- Cú nối cần "đập" (xem `smash_cut`).
- Cầu nối kéo qua cảnh có người đang nói khác, miệng cử động lệch tiếng.
- Clip có tiếng gốc bẩn buộc mute (`R-AUD-2`).

## 4. Thông số (hướng dẫn)
Khớp với `j_l_cut` (đã có trong preset); cột "khoảng" tham khảo từ `j-l-cut.md`.
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `variant` | `l` hoặc `j` | `j`, `l` | – | high |
| `tail` (L) | 0.8 | 0.4–1.5; bằng độ dài b-roll ≤ 4 khi che cả đoạn lời | giây | medium |
| `lead` (J) | 0.5 | 0.3–1.0 | giây | medium |
| `audio_crossfade` | 0.12 | 0.08–0.25 | giây | medium |
| `incoming_audio_gain_db` | 0 | −6–0 | dB | low |
| Cầu nối ambience (tiếng nền thuần, không lời) | 1.0–2.0 | 0.5–3 | giây | low |
| Khoảng cách giữa hai `j_l_cut` | ≥ 3 | ≥ 3 | giây | medium |

## 5. Quy trình thực hiện
1. Xác định tiếng cần bắc cầu (lời, vỗ tay, ambience) và clip nguồn của nó. Kiểm tra nguồn còn đủ đuôi/đầu sạch.
2. Chọn hướng: L (tiếng clip trước kéo qua hình clip sau) hoặc J (tiếng clip sau vào trước hình).
3. Giữ `hard_cut` ở hình, thêm `j_l_cut` cùng `between` (preset `l_cut_standard` hoặc `j_cut_standard`).
4. Đặt `tail`/`lead` trong quãng lặng; đặt `audio_crossfade` ≥ 0.08 s.
5. Clip bị phủ tiếng nên `audio: mute` nếu tiếng gốc của nó xung đột; nếu giữ thì có lý do.
6. Kiểm tra tiếng không chạm sang câu khác và mức tiếng trước/sau điểm nối không chênh đột ngột.
7. **Giới hạn:** chưa có công cụ tạo ambience nối hay tự đo mức nền; nếu footage thiếu tiếng nền sạch để kéo, dùng `j_l_cut` ngắn hoặc chấp nhận `hard_cut` thường.

## 6. Biến thể và preset
| Biến thể | Cách làm | Preset |
|---|---|---|
| Lời nối (L) | Tiếng clip trước kéo qua | `l_cut_standard` |
| Dẫn vào (J) | Tiếng clip sau vào trước | `j_cut_standard` |
| Ambience nối | Giữ ambience clip A dưới hình clip B (cùng nguồn không lời) | `j_l_cut` với `audio_crossfade` dài hơn |
| Vỗ tay/nhạc sự kiện nối | Tiếng sự kiện kéo sang b-roll | `l_cut_standard`, `tail` tăng |

## 7. Quy tắc quyết định
- `R-BRIDGE-1`: NẾU hai clip có ambience khác nhau rõ → ưu tiên có `j_l_cut` (khớp `j-l-cut.md`).
- `R-BRIDGE-2`: NẾU `lead`/`tail` chạm vào quãng nói của câu khác → rút ngắn hoặc bỏ.
- `R-BRIDGE-3`: không quá một `j_l_cut` mỗi 3 giây (`decision-engine.md`).
- `R-BRIDGE-4`: nguồn không đủ đuôi/đầu sạch → không bắc cầu.
- `R-BRIDGE-5`: documentary không dùng SFX nhân tạo để làm cầu nối.

## 8. Ví dụ
Tiếng vỗ tay cuối phát biểu (`c19`) kéo sang cảnh b-roll học viên (`c20`), giữ không khí sự kiện.

```json
{
  "id": "d12",
  "technique": "j_l_cut",
  "preset": "l_cut_standard",
  "anchor": { "between": ["c19", "c20"] },
  "duration": 1.2,
  "parameters": { "variant": "l", "tail": 1.2, "audio_crossfade": 0.15 },
  "reason": "Tiếng vỗ tay kéo sang b-roll học viên để nối không khí sự kiện",
  "priority": "clarity",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```
Cặp `hard_cut` ở hình giữa `c19` và `c20` vẫn cần có.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Tiếng kéo chạm câu khác | Nghe lẫn hai câu | Rút ngắn đến sát quãng lặng |
| Click ở chỗ nối | Có "tạch" | `audio_crossfade` ≥ 0.08 s |
| Cầu nối lặp (nghe hai lần) | Cùng tiếng ở hai nguồn | Mute nguồn trùng |
| Dùng ở mọi điểm nối | Mất ý nghĩa | Chỉ khi cần |
| Nối bằng tiếng bẩn | Nghe tiếng lạ | `R-AUD-2`, `mute` |

## 10. Kiểm tra sau render
- Nghe điểm nối: liên tục, không click, không lẫn câu, không đôi tiếng.
- Mức tiếng trước/sau không chênh đột ngột.
- Hình và tiếng khớp ý (người xem hiểu tiếng đến từ đâu).
- Tiếng nói vẫn là thành phần rõ nhất (`core/audio-principles.md`).
