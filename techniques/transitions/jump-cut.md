---
id: jump_cut
name: Jump Cut (Cắt nhảy)
group: transitions
roles: [rhythm, trimming]
status: usable
source_of_values: convention
---

# Jump Cut

> **Đây là kỹ thuật dạng mẫu (pattern), không có quyết định riêng trong EDL.** Nó được thực hiện bằng cách chia một clip nguồn thành hai clip liền nhau trong `timeline.clips` (cùng `video_id`, `source_out` của clip trước nhỏ hơn `source_in` của clip sau, tức là bỏ đoạn giữa), nối bằng `hard_cut`. Có thể thêm `j_l_cut` (L) để giữ ambience qua chỗ nhảy. Renderer không cần hỗ trợ thêm.

## 1. Mục đích
Bỏ quãng lặng, từ đệm, câu nói hỏng ngay trong một khung hình giữ nguyên, để lời nói gọn và nhịp nhanh hơn. Người xem thấy hình "nhảy" nhẹ (người nói đổi tư thế chút ít) nhưng lời liền mạch.

## 2. Khi nên dùng
- Quãng lặng > 0.7 s hoặc từ đệm ("ừm", "à") trong `silence_ranges`/transcript, không mang cảm xúc (`core/pacing.md`).
- Câu bị nói lại, vấp, hoặc lặp ý: giữ lần nói tốt.
- Khung rộng hoặc người nói ít cử động, nên chỗ nhảy hầu như không thấy.
- Phần bị cắt ngắn (khoảng 0.5–3 s). Cắt dài hơn thì ý bị hụt, nên thêm b-roll che.
- Documentary: **chấp nhận ở mức hạn chế** với phỏng vấn, khi chỗ nhảy được che bằng b-roll (`b_roll_insert`) hoặc nhảy rất nhỏ. Jump cut trần lộ liễu không hợp style tiết chế (xem `hard-cut.md`, `R-STYLE-DOC`).

## 3. Khi không nên dùng
- Hai nửa cùng khung, cùng cỡ cận, người nói đổi tư thế rõ (đầu nghiêng, vai trôi): chỗ nhảy lộ, nên thêm b-roll hoặc đổi cỡ khung.
- Khoảng lặng là phần của cảm xúc (nghẹn, ngừng suy nghĩ trước câu nặng).
- Hai nửa nằm giữa cùng một câu mà nhịp thở bị cụt: nghe như bị "nuốt chữ".
- Nhiều nhát nhảy liên tiếp trong vài giây (cảm giác vlog, không phải documentary).
- Nền chuyển động mạnh (đám đông, cây, người đi lại) làm chỗ nhảy hiện rõ.

## 4. Thông số (hướng dẫn, không phải khóa EDL)
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| Độ dài đoạn bỏ | 0.8–2 | 0.4–4 | giây | low |
| Hơi thở chừa lại giữa hai nửa | 0.15–0.3 | 0.1–0.4 | giây | medium |
| `out_tail` (chừa sau chữ cuối ở nửa trước) | 0.15 | 0.05–0.3 | giây | medium |
| `in_lead` (chừa trước chữ đầu ở nửa sau) | 0.10 | 0.05–0.25 | giây | medium |
| Khoảng cách tối thiểu giữa hai jump cut không che | ≥ 8 | 5–15 | giây đầu ra | low |
| Mức "đổi khung" để che nhảy (nếu có `punch_in`) | 1.0 → 1.08 | 1.05–1.12 | tỉ lệ | low |

## 5. Quy trình thực hiện
1. Từ `silence_ranges` và transcript xác định đoạn thừa. Chưa có công cụ tự phát hiện từ đệm; người dùng hoặc AI đọc transcript để chọn.
2. Cắt trong quãng lặng quanh đoạn bỏ: clip A kết thúc sau chữ cuối + `out_tail`, clip B bắt đầu trước chữ đầu − `in_lead`.
3. Tạo hai clip cùng `video_id`: `c_a` (`source_out` = điểm A), `c_b` (`source_in` = điểm B > điểm A).
4. Nối bằng `hard_cut` (`cut_on: silence`).
5. Xem lại hai khung ở điểm nhảy: tư thế đầu và vai có lệch rõ không. Renderer không đo được độ lệch này; phải xem preview.
6. Nếu lệch rõ: chèn b-roll che (`b-roll-insert.md`, L-cut giữ lời), hoặc dời điểm cắt đến lúc tư thế gần giống.
7. Giữ ambience: không để im tuyệt đối ở chỗ nối (`core/audio-principles.md`).

## 6. Biến thể và preset
Không có preset riêng; dùng `cut_hard` của `hard_cut`.
- **Trim im lặng:** bỏ quãng lặng giữa hai câu.
- **Trim từ đệm:** bỏ từ thừa trong câu (khó hơn, hay lộ).
- **Che nhảy:** thay bằng b-roll hoặc `punch_in_subtle` ở nửa sau.

## 7. Quy tắc quyết định
- `R-JUMP-1`: NẾU cùng khung, cùng cỡ cận, hai nửa cách nhau < 8 s đầu ra VÀ không b-roll che → tránh (documentary).
- `R-JUMP-2`: NẾU đoạn bỏ < 0.4 s → không cắt, gần như không nghe thấy khác biệt.
- `R-JUMP-3`: NẾU quãng lặng mang cảm xúc hoặc đứng ngay trước câu then chốt → giữ nguyên (Storytelling > Rhythm).
- `R-JUMP-4`: điểm cắt phải nằm trong quãng lặng, không cắt giữa chữ (`R-CUT-1`, `hard-cut.md`).
- `R-JUMP-5`: NẾU ghép > 2 jump cut trần trong 10 s → thêm b-roll hoặc bỏ bớt.

## 8. Ví dụ
Người dẫn nói câu dài, giữa câu có từ đệm "ừm" 1.4 s. Tách `c02` thành `c02a` (đến 6.4 s) và `c02b` (từ 7.8 s).

```json
{
  "timeline_pattern": [
    { "id": "c02a", "video_id": "<talking_head>", "source_in": 1.2, "source_out": 6.4, "audio": "keep" },
    { "id": "c02b", "video_id": "<talking_head>", "source_in": 7.8, "source_out": 14.0, "audio": "keep" }
  ],
  "decisions_pattern": [
    {
      "technique": "hard_cut", "preset": "cut_hard",
      "anchor": { "between": ["c02a", "c02b"] }, "duration": 0,
      "parameters": { "cut_on": "silence", "out_tail": 0.15, "in_lead": 0.1 },
      "reason": "Bỏ từ đệm 1.4 s giữa câu, giữ ý",
      "priority": "rhythm", "confidence": "medium", "status": "proposed"
    }
  ]
}
```
Khuôn minh họa có chỗ `<...>` cần điền. Nếu hai nửa lệch tư thế, thêm một `c03` b-roll giữa `c02a` và `c02b` theo `b-roll-insert.md`.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Cắt trúng chữ | Nghe cụt âm | Cắt trong `silence_ranges`, chừa `out_tail` |
| Nhảy lộ liễu | Đầu/vai giật giữa hai nửa | B-roll che hoặc dời điểm cắt |
| Mất hơi thở | Lời nghẹt, như đọc máy | Chừa 0.15–0.3 s |
| Chuỗi nhảy dày | Nhịp giật như vlog | `R-JUMP-5` |
| Ambience đứt | Nghe "tạch" ở chỗ nhảy | Giữ ambience, `audio_crossfade` ngắn |

## 10. Kiểm tra sau render
- Nghe lướt: mỗi chỗ nhảy không cụt chữ, không "tạch".
- Xem hai khung quanh điểm nhảy: tư thế gần nhau hoặc đã có b-roll che.
- Đếm jump cut trần mỗi phút; documentary nên rất ít.
- Lời vẫn trọn ý, không nghe như bị rút ngắn gượng ép.
