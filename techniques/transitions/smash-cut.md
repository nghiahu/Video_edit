---
id: smash_cut
name: Smash Cut (Cắt đập)
group: transitions
roles: [surprise, contrast, emphasis]
status: usable
source_of_values: convention
---

# Smash Cut

> **Đây là kỹ thuật dạng mẫu (pattern), không có quyết định riêng trong EDL.** Nó được thực hiện bằng `hard_cut` giữa hai clip có **tương phản mạnh** về mức tiếng và/hoặc hình, kèm quyết định `audio` của từng clip (`keep`/`mute`/`duck`) và **không** thêm `j_l_cut` hay `cross_dissolve` ở điểm đó. Renderer không đo mức tiếng; người dùng hoặc AI đánh giá tương phản từ `quality`/mô tả clip và nghe lại.

## 1. Mục đích
Gây sốc hoặc bất ngờ: từ yên lặng sang ồn ào (hoặc ngược lại), từ cảnh tĩnh sang cảnh dồn dập, để nhấn một chuyển biến trong câu chuyện.

## 2. Khi nên dùng
- Kịch bản có hai trạng thái đối lập rõ: phòng chờ im lặng, sau đó sân khấu đông người vỗ tay.
- Lời kể chuẩn bị ("cả khán phòng im lặng...") rồi cắt sang tiếng ồn chứng minh.
- Mở video: hook bằng cảnh ồn bất ngờ sau nền tĩnh (nếu dùng thì tiết chế).
- **Documentary: chỉ ở mức thấp và có lý do kể chuyện** (đối lập thật của sự kiện). Smash cut không nằm trong danh sách cấm, nhưng nhịp trang trọng khiến nên dùng cực ít, không quá 0–1 lần mỗi video 2 phút.

## 3. Khi không nên dùng
- Không có tương phản thật trong footage: "gây bất ngờ" bằng cách cắt đột ngột mà hai cảnh tương tự là vô nghĩa.
- Đang giữa lời nói hoặc cảm xúc nghiêm túc (phát biểu tưởng niệm, câu chuyện cá nhân buồn).
- Cảnh ồn có tiếng quá to khiến người nghe giật mình khó chịu (đỉnh gần 0 dBFS); phải hạ trước.
- Nhạc nền đang chạy êm: cú đập lẫn với nhạc dễ thành rối.
- Điểm nối vốn cần mượt (cùng thời gian, địa điểm): dùng `hard_cut`/`j_l_cut`.

## 4. Thông số (hướng dẫn, không phải khóa EDL)
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| Chênh mức tiếng giữa hai cảnh ở điểm cắt | ≥ 12 | 10–24 | dB | low |
| Mức đỉnh cảnh ồn sau điểm cắt | ≤ −6 | −10 đến −3 | dBFS | medium |
| Đoạn yên lặng/ambience thưa trước điểm cắt | 1.0–2.5 | 0.5–4 | giây | low |
| Khoảng cách tối thiểu giữa hai smash cut | ≥ 30 | 20–60 | giây đầu ra | low |
| `audio_crossfade` tại điểm cắt | 0 (không) | 0–0.04 (chỉ chống click) | giây | medium |
| Điểm nối | `hard_cut`, `cut_on: action` hoặc `silence` | – | – | medium |

## 5. Quy trình thực hiện
1. Xác định hai cảnh đối lập: ghi mức tiếng ước lượng (nghe lại clip; chưa có công cụ đo loudness tự động).
2. Đặt cảnh yên lặng (`c_a`) kết thúc ở một nhịp tĩnh; giữ ambience nhỏ, tránh im tuyệt đối (`core/audio-principles.md`).
3. Đặt cảnh ồn (`c_b`) bắt đầu **ngay đỉnh tiếng/hành động**, không có đoạn dẫn vào mờ.
4. Nối bằng `hard_cut`. Không thêm `j_l_cut` hoặc dissolve, vì chúng làm mềm cú đập.
5. Hạ mức tiếng cảnh ồn bằng `audio: duck` hoặc chọn đoạn nguồn đã cân đối để đỉnh ≤ −6 dBFS.
6. Nếu có nhạc: hoặc ngưng nhạc ở cảnh yên (khoảng lặng có chủ đích), hoặc để nhạc không đổi qua điểm cắt.
7. Xem lại: không phải là "tạch" lỗi kỹ thuật; nếu click, thêm `audio_crossfade` ≤ 0.04 s.

## 6. Biến thể và preset
Không có preset riêng; dùng `cut_hard`.
- **Yên → ồn:** biến thể phổ biến.
- **Ồn → yên:** cắt đột ngột sang im lặng để nhấn ý (nên còn ambience nhỏ).
- **Hình mạnh, tiếng liền:** đổi hình đột ngột nhưng giữ một tiếng liên tục (mềm hơn).

## 7. Quy tắc quyết định
- `R-SMASH-1`: NẾU không có tương phản ≥ khoảng 12 dB hoặc tương phản rõ về hình/nội dung giữa hai cảnh → không dùng smash cut.
- `R-SMASH-2`: NẾU cảnh sau có đỉnh > −6 dBFS → hạ mức trước khi dùng.
- `R-SMASH-3`: NẾU style `documentary` VÀ chưa có lý do kể chuyện ghi trong `reason` → bỏ (Storytelling thắng Decoration).
- `R-SMASH-4`: không hai smash cut cách nhau < 30 s đầu ra.
- `R-SMASH-5`: không thêm SFX (documentary không dùng SFX trang trí).

## 8. Ví dụ
Cảnh phòng chờ yên lặng trước giờ khai giảng (`c07`, ambience nhỏ), sau đó cắt sang tiếng vỗ tay khi sân khấu mở màn (`c08`).

```json
{
  "id": "d08",
  "technique": "hard_cut",
  "preset": "cut_hard",
  "anchor": { "between": ["c07", "c08"] },
  "duration": 0,
  "parameters": { "cut_on": "action", "out_tail": 0.0, "in_lead": 0.0 },
  "reason": "Cắt đập từ phòng chờ yên tĩnh sang tiếng vỗ tay mở màn để nhấn khoảnh khắc bắt đầu",
  "priority": "storytelling",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```
Không có tham số "smash" riêng; hiệu ứng nằm ở lựa chọn clip và mức tiếng.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Ồn quá to | Giật mình, đỉnh gần 0 dBFS | Hạ mức, `duck` |
| Không tương phản thật | Cú cắt như hard cut thường | `R-SMASH-1` |
| Im tuyệt đối trước cú cắt | Nghe như lỗi mất tiếng | Giữ ambience |
| Dùng nhiều lần | Mất tác dụng, thành thủ thuật | `R-SMASH-4` |
| Lẫn nhạc | Nhạc và cảnh ồn chồng | Ngưng hoặc giữ nhạc không đổi |

## 10. Kiểm tra sau render
- Nghe điểm cắt: chênh mức tiếng đúng ý, không click, đỉnh không vượt −1 dBFS.
- Cảnh sau đủ lý do nội dung để cú đập "hợp lý".
- Tổng số smash cut trong video nằm trong ngân sách thấp.
