---
id: shortform_captions
name: Shortform Captions (Phụ đề ngắn cỡ lớn)
group: typography
roles: [emphasis, rhythm, accessibility]
status: usable
source_of_values: convention
---

# Shortform Captions

## 1. Mục đích
Chia lời nói thành **cụm 1–3 từ cỡ rất lớn** giữa khung, mỗi cụm hiện đúng lúc từ đầu cụm được nói và thay nhau, từ khóa tô màu. Kiểu phụ đề của video ngắn dọc: nhịp nhanh, đọc được ở thoáng nhìn. Thuộc cấp 1 (`typography/hierarchy.md`).

## 2. Khi nên dùng
- Video ngắn, dọc (9:16) hoặc nội dung nhịp nhanh, người xem tắt tiếng.
- Có **mốc theo từng từ đáng tin** cho đoạn lời tới 60 từ.
- Muốn nhấn từ khóa trong dòng chảy lời (dùng `highlight_words`).

**Chọn đúng kỹ thuật:**
| Tình huống | Chọn |
|---|---|
| Lời thoại thường | `subtitles` (mặc định) |
| 1–3 từ cực lớn theo cụm | `shortform_captions` |
| Từ đang nói sáng trong cụm dài | `karaoke_subtitles` |
| Từng từ hiện nối tiếp | `word_by_word_text` |
| Cả câu sẵn, từ khóa sáng | `word_highlight` |

## 3. Khi không nên dùng
- **Không có mốc theo từ thật.** Không tự bịa lời hay mốc; `estimated` chỉ để thử, bản cuối bị từ chối.
- Nội dung trang trọng, phỏng vấn, tổng kết sự kiện: **cả hai preset bị cấm ở documentary**.
- Cảnh cần nhìn rõ chủ thể ở giữa khung: chữ cỡ lớn che hình; đổi `position` hoặc dùng `subtitles`.
- Hơn 60 từ mỗi quyết định (validate báo lỗi).
- Cụm hiện < 0.25 s (cảnh báo): người xem không kịp đọc, tăng `chunk_size`.
- Clip đổi tốc độ hoặc dừng hình (mốc lệch, cảnh báo).

## 4. Thông số
Khối nền `_text_style_base`, nhánh `words_mode: "chunks"`. Cỡ chữ tính cho 1080p.
| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `words_mode` | `"chunks"` (nền `null`) | bắt buộc `chunks` (validate) | – | medium |
| `words` / `words_source` | – (bắt buộc) | xem "Dữ liệu cần có"; ≤ 60 từ | giây / enum | medium |
| `chunk_size` | 2 (bold 2, soft 3) | số nguyên 1–3 (validate) | từ/cụm | low |
| `chunk_linger` | 0.5 (cả hai preset 0.4) | 0–2 (validate) | giây giữ sau từ cuối cụm | low |
| `highlight_words` / `highlight_color` | tùy chọn; `#FFD84D` nếu `null` (bold `#FFD84D`, soft `#FF6FB5`) | mảng từ; màu CSS | – | low |
| `word_pop` / `word_pop_amount` | `true` / 0.14 (bold 0.2, soft 0.12) | true/false; 0–0.4 (validate) | tỉ lệ | low |
| `words_tail` | 0.5 | 0–3 (validate) | giây | low |
| `font_family` / `font_weight` / `font_size` | Anton 400 / 190 (soft: Be Vietnam Pro 900 / 120) | vai trò `emphasis`/`heading`/`accent`; 12–600 | px @1080p | low |
| `text_transform` | `uppercase` (bold); soft không đặt | enum | – | low |
| `stroke_width` / `stroke_color` | 8 / `#10131A` (bold); soft không viền | – | px | low |
| `shadow_type` | `hard` 6/6 (bold) / `soft` blur 20 (soft) | enum | – | low |
| `position` / `max_width_percent` | `center` / 90 (soft 86) | 9 vị trí | % | low |
| `in_animation` / `out_animation` | `none` / `none` (0.05 s / 0.1 s) | enum | – | low |

### Dữ liệu cần có
- `words` = `[{ "text": "...", "start": giây, "end": giây }]` theo **thời gian video nguồn** (cùng hệ với `anchor.source_time`), tăng dần, không chồng quá 0.05 s, `end > start`.
- `words_source` bắt buộc ∈ `asr|manual|subtitle_file|estimated`. **Không được tự bịa lời nói hoặc mốc.** `estimated` chỉ cho bản thử: `validate` cảnh báo, `cli.js final` từ chối render.
- Mốc thật từ ASR, gõ tay hoặc file phụ đề; `Video-analysis` hiện chưa có, máy chưa có công cụ nhận dạng.

### Cách chia cụm và thời gian
- Cụm chia **tuần tự** theo `chunk_size` (từ 1 đến `chunk_size`, rồi tiếp), không theo ý hay dấu câu; cụm cuối có thể ít từ hơn.
- Cụm hiện từ `start` của từ đầu cụm; ẩn khi cụm kế bắt đầu, hoặc sau `end` từ cuối cụm + `chunk_linger` nếu cụm kế đến muộn hơn (khoảng giữa không có chữ). Nảy theo `word_pop` cho cả cụm; từ khóa đổi `highlight_color`.
- Trước từ đầu tiên, khung trống. Không dùng `hold`; khối kết thúc ở `end` từ cuối + `words_tail` rồi `out_duration`; `decision.duration` bị bỏ qua. `anchor.clip` bắt buộc.

## 5. Quy trình thực hiện
1. Có lời và mốc thật; ghi `words_source`; chọn 1–4 từ khóa thật sự quan trọng vào `highlight_words`.
2. Chọn `chunk_size`: nói nhanh (≥ 4 từ/giây) thì 3; nói chậm thì 1–2. Kiểm cụm nào hiện < 0.25 s.
3. `anchor.source_time` ≤ `start` từ đầu (≤ 0.5 s trước).
4. Chọn preset; không đặt cùng phụ đề hay chữ nhấn khác.
5. `validate`, xem preview ở đúng tỉ lệ khung (đặc biệt 9:16).

## 6. Biến thể và preset
Đã xem trên preview 960×540 của clip thử (`projects/demo-text-p3`; mốc ước lượng đều 0.42 s/từ, chưa kiểm chứng với lời thật): `bold` cụm 2 từ cực lớn giữa khung, từ khóa vàng ("PHÂN TÍCH", "DỮ LIỆU"); `soft` cụm 3 từ cỡ lớn, từ khóa hồng.
| Preset | Mô tả | Documentary |
|---|---|---|
| `shortform_captions_bold` | Anton HOA cỡ 190, viền đen, bóng cứng, cụm 2 từ, từ khóa vàng | **Cấm** |
| `shortform_captions_soft` | Be Vietnam Pro 900 cỡ 120, bóng mềm, cụm 3 từ, từ khóa hồng | **Cấm** |

## 7. Quy tắc quyết định
- `R-SFC-1` (validate): `words` hợp lệ, `words_source` hợp lệ, `words_mode: chunks`, ≤ 60 từ, `chunk_size` nguyên ∈ [1, 3], `chunk_linger` ∈ [0, 2], từ đầu không trước điểm neo, từ cuối không sau `source_out`, `word_pop_amount` ∈ [0, 0.4], `words_tail` ∈ [0, 3].
- `R-SFC-2` (cảnh báo): `estimated`; cụm hiện < 0.25 s; clip đổi tốc độ hoặc dừng hình.
- `R-SFC-3`: NẾU style `documentary` THÌ không dùng; dùng `subtitles`.
- `R-SFC-4`: phụ đề thường vẫn là mặc định; chỉ dùng cho video ngắn dọc hoặc nhịp nhanh có chủ đích.
- `R-SFC-5`: chữ cỡ lớn không được che mặt/chủ thể; ưu tiên Clarity > Rhythm > Style.

## 8. Ví dụ
Ví dụ **định dạng**, không phải lời thật của ai: sáu từ minh họa, `words_source: "manual"`, `chunk_size` 3 ghi đè. Clip `c05` có `source_out` ≥ 9.
```json
{
  "id": "d18",
  "technique": "shortform_captions",
  "preset": "shortform_captions_soft",
  "anchor": { "clip": "c05", "source_time": 7.0 },
  "parameters": {
    "words": [
      { "text": "Ba", "start": 7.1, "end": 7.35 },
      { "text": "mẹo", "start": 7.4, "end": 7.7 },
      { "text": "nhỏ", "start": 7.75, "end": 8.0 },
      { "text": "giúp", "start": 8.1, "end": 8.35 },
      { "text": "bạn", "start": 8.4, "end": 8.6 },
      { "text": "nhanh", "start": 8.65, "end": 9.0 }
    ],
    "words_source": "manual",
    "highlight_words": ["nhanh"]
  },
  "reason": "Câu ngắn ở video dọc, chia hai cụm 3 từ, nhấn từ khóa cuối",
  "priority": "rhythm",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```
Cụm 1 ("Ba mẹo nhỏ") hiện 7.1–8.1 (đến khi cụm 2 bắt đầu); cụm 2 hiện từ 8.1, ẩn sau 9.0 + 0.4 = 9.4. Khối kéo dài tới 9.0 + 0.5 − 7.0 = 2.5 s từ điểm neo.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Mốc ước lượng ở bản cuối | `estimated`; `final` từ chối | Mốc thật |
| Dùng ở documentary | validate báo lỗi | `subtitles` |
| `chunk_size` 1 với lời nhanh | Cảnh báo cụm < 0.25 s | Tăng lên 2–3 |
| Cụm cắt giữa cụm từ | "Đại học | Bách khoa" bị tách | Chấp nhận (chia tuần tự) hoặc sửa mốc/gộp |
| Chữ che mặt | Chữ cỡ 190 giữa khung | Đổi `position` hoặc `font_size` |
| Tô quá nhiều từ khóa | Mất nhấn | ≤ 4 từ khóa |
| Khoảng lặng dài | Khung trống sau `chunk_linger` | Bình thường; tăng `chunk_linger` nếu muốn giữ |

## 10. Kiểm tra sau render
- Cụm đổi đúng lúc nghe thấy; từ khóa đổi màu; đủ dấu tiếng Việt (chữ hoa Anton có dấu không đè nhau).
- Mỗi cụm đủ thời gian đọc (≥ 0.25 s, nên ≥ 0.4 s); chữ không tràn bề ngang, không che mặt.
- Khung trống hợp lý ở khoảng lặng.
- Cần xem preview (chưa kiểm chứng): độ khớp lời thật (cần ASR); hoạt ảnh vào/ra; clip đổi tốc độ; cụm dài tự xuống dòng ở 1080p/4K; ngôn ngữ ngoài tiếng Việt; từ khóa dài; `word_pop_amount` ở cỡ chữ lớn; khung dọc 9:16.
