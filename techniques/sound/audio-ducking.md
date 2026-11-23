---
id: audio_ducking
name: Audio Ducking (Hạ nhạc khi có tiếng nói)
group: sound
roles: [clarity, balance]
status: usable
source_of_values: convention
---

# Audio Ducking

## 1. Mục đích
Tự động hạ nhạc nền khi có người nói và nâng lại khi họ ngừng, để tiếng nói luôn rõ mà nhạc vẫn giữ cảm xúc.

## 2. Khi nên dùng
- **Bắt buộc** khi có nhạc nền chạy cùng tiếng nói (`R-AUD-1`).
- Tiếng nói quan trọng (phát biểu, phỏng vấn, voiceover).
- Nhạc có nhiều tần số trùng dải giọng nói (nhạc có lời, dày nhạc cụ).

## 3. Khi không nên dùng
- Không có nhạc nền: không cần.
- Đoạn không có tiếng nói: giữ mức nhạc "không có tiếng nói", đừng hạ.
- Khi người nói rất ngắn và rời rạc: nhạc sẽ "nhấp nhô". Gộp các quãng nói gần nhau thành một vùng duck liền (xem `merge_gap`).

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `base_db` (mức nhạc khi không có tiếng nói) | −16 | −20 – −12 | dBFS | medium |
| `duck_amount_db` (hạ bao nhiêu khi có tiếng nói) | 12 | 8 – 16 | dB | medium |
| `lead` (bắt đầu hạ trước lúc nói) | 0.25 | 0.15 – 0.4 | giây | medium |
| `attack` (thời gian hạ) | 0.30 | 0.15 – 0.5 | giây | medium |
| `release` (thời gian nâng lại) | 0.70 | 0.4 – 1.2 | giây | medium |
| `merge_gap` (khoảng lặng nhỏ hơn thì giữ duck liền) | 1.0 | 0.6 – 1.5 | giây | medium |
| `speech_source` | `clip_speech` | `clip_speech` | – | – |

Mức nhạc khi có tiếng nói ≈ `base_db − duck_amount_db` (mặc định −28 dBFS). Mức tiếng nói đỉnh khoảng −6 đến −3 dBFS.

## 5. Quy trình thực hiện
1. Xác định **vùng có tiếng nói** từ các clip `audio: keep` hoặc voiceover: dùng `speech` trong `clips.md` (có mốc đoạn) và `silence_ranges` (phần còn lại là có tiếng).
2. Gộp các vùng cách nhau < `merge_gap` thành một vùng duck liền.
3. Ở mỗi vùng: bắt đầu hạ tại `đầu vùng − lead`, hạ trong `attack`; nâng lại sau `cuối vùng`, trong `release`.
4. Trước câu quan trọng muốn có sức nặng, có thể hạ **thấp thêm** hoặc ngưng nhạc 0.3–0.5 giây (tuỳ ý kể chuyện).
5. Với b-roll không tiếng nói hoặc ambience: giữ nhạc ở `base_db`, đừng hạ.
6. Ghi các vùng duck vào EDL như các quyết định `audio_ducking` (mỗi vùng một quyết định, hoặc một quyết định phủ toàn bộ nếu preset hỗ trợ `auto`).

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `duck_voice_music` | Mặc định: hạ 12 dB, attack 0.3 s, release 0.7 s |
| `duck_voice_music_deep` | Hạ 16 dB, dùng khi nhạc dày hoặc tiếng nói nhỏ |
| `duck_voice_music_light` | Hạ 8 dB, dùng khi nhạc thưa, ambient |

## 7. Quy tắc quyết định
- `R-AUD-1` (có nhạc + có tiếng nói → bắt buộc).
- NẾU nhạc có lời (hát) → dùng `deep`, hoặc đổi nhạc không lời.
- NẾU sau khi duck mà vẫn lấn tiếng nói (QC thấy khó nghe) → tăng `duck_amount_db` thêm 3 dB, kiểm tra lại.

## 8. Ví dụ
Clip `c02` (source 1.0–40.0 giây) là MC nói liên tục có nhạc nền, nghỉ 0.6 giây ở giữa rồi nói tiếp. Quyết định neo vào **đầu vùng có tiếng nói** (`start_offset: 0`) và `duration` bằng độ dài vùng nói; việc hạ nhạc **trước** lúc nói do tham số `lead` tự lo, không cộng thêm vào `start_offset`.

```json
{
  "id": "d02",
  "technique": "audio_ducking",
  "preset": "duck_voice_music",
  "anchor": { "clip": "c02", "source_time": 1.0 },
  "start_offset": 0,
  "duration": 39.0,
  "parameters": { "duck_amount_db": 12, "attack": 0.3, "release": 0.7, "merge_gap": 1.0 },
  "reason": "MC phát biểu liên tục, nhạc nền phải hạ để lời rõ; hai quãng nói cách 0.6 s gộp thành một vùng duck",
  "priority": "clarity",
  "confidence": "high",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Nhạc nhấp nhô | Nhạc lên xuống theo từng câu | `merge_gap` ≥ 1.0 s |
| Hạ trễ, nuốt chữ đầu | Nhạc còn to khi bắt đầu nói | Có `lead` 0.25 s |
| Nâng lại quá nhanh | Nhạc "bật" ngay sau câu cuối | `release` ≥ 0.5 s |
| Hạ quá sâu | Nhạc gần như biến mất, mất cảm xúc | 8–14 dB là đủ |
| Quên duck khi có voiceover | Nhạc lấn giọng | `R-AUD-1` |

## 10. Kiểm tra sau render
- Nghe lướt ở âm lượng bình thường: mọi câu nói nghe rõ không cần căng tai.
- Nhạc hạ trước khi người nói mở miệng, nâng lại mượt, không bật.
- Loudness tổng và đỉnh trong giới hạn (`workflows/quality-control.md`).
