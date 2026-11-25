---
id: karaoke_subtitles
name: Karaoke Subtitles (Phụ đề karaoke)
group: typography
roles: [accessibility, rhythm, emphasis]
status: usable
source_of_values: convention
---

# Karaoke Subtitles

## 1. Mục đích
Hiện cả cụm lời và **tô sáng từ đang được nói**, từ đã nói đổi sang màu "xong", từ chưa nói mờ đi. Mắt người xem đi theo lời, hợp với đọc lời hát hoặc phụ đề cần nhịp. Là chữ cấp 3 nhưng gây chú ý hơn `subtitles` thường (`typography/hierarchy.md`).

## 2. Khi nên dùng
- Lời hát, vè, đọc rap, hoặc lời thoại nhịp rõ và **có mốc theo từng từ đáng tin**.
- Video ngắn, mạng xã hội, nơi người xem tắt tiếng và muốn chữ "chạy" theo lời.
- Cụm ≤ 16 từ mỗi quyết định; phủ đoạn dài bằng nhiều quyết định nối tiếp theo ý.

**Chọn đúng kỹ thuật:**
| Tình huống | Chọn |
|---|---|
| Lời thoại thường, cần đọc chính xác | `subtitles` (mặc định) |
| Từ đang nói sáng, từ đã nói/chưa nói đổi sắc | `karaoke_subtitles` |
| Cả câu sẵn, chỉ từ khóa sáng | `word_highlight` |
| Từng từ hiện theo lời | `word_by_word_text` |
| 1–3 từ cực lớn | `shortform_captions` |

## 3. Khi không nên dùng
- **Không có mốc theo từ thật.** Không tự bịa lời hay mốc; `estimated` chỉ để thử, bản cuối bị từ chối.
- Lời thoại nghiêm túc, phỏng vấn: phụ đề thường ổn định hơn, ít gây xao nhãng.
- Hơn 16 từ (validate báo lỗi).
- Cùng lúc với `subtitles`, `lower_third` ở vùng dưới.
- Từ bị kéo dài > 2.5 s (cảnh báo): thường là mốc sai.
- **Documentary: cả hai preset bị cấm.**

## 4. Thông số
Khối nền `_text_style_base`, nhánh `words_mode: "karaoke"`. Cỡ chữ tính cho 1080p.
| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `words_mode` | `"karaoke"` (nền `null`) | bắt buộc `karaoke` (validate) | – | medium |
| `words` / `words_source` | – (bắt buộc) | xem "Dữ liệu cần có"; ≤ 16 từ | giây / enum | medium |
| `karaoke_active_color` | `#FFD84D` (bold: `#FF6FB5`) | màu CSS | – | low |
| `karaoke_done_color` | `null` (= `text_color`, nền `#FFFFFF`) | màu CSS hoặc `null` | – | low |
| `karaoke_upcoming_opacity` | 0.45 (clean 0.5, bold 0.55) | 0–1 (validate) | – | low |
| `word_pop` / `word_pop_amount` | `true` / 0.14 | true/false; 0–0.4 (validate) | tỉ lệ | low |
| `words_tail` | 0.5 | 0–3 (validate) | giây | low |
| `font_family` / `font_weight` / `font_size` | Inter 700 / 56 (bold: Be Vietnam Pro 800 / 68) | phông vai trò `subtitle`/`body`/`emphasis`; 12–600 | px @1080p | low |
| `box_style` | `rounded`, nền `rgba(10,14,24,0.7)`, đệm 34×20, bo 20 (bold: không hộp, viền 6 px `#10131A`) | enum | – | low |
| `position` / `max_width_percent` | `lower_middle` / 78 (bold 80) | 9 vị trí | % | low |
| `in_animation` / `out_animation` | `fade` 0.25 s (bold 0.2 s) | enum | – | low |

### Dữ liệu cần có
- `words` = `[{ "text": "...", "start": giây, "end": giây }]` theo **thời gian video nguồn** (cùng hệ với `anchor.source_time`), tăng dần, không chồng quá 0.05 s, `end > start`.
- `words_source` bắt buộc ∈ `asr|manual|subtitle_file|estimated`. **Không được tự bịa lời nói hoặc mốc.** `estimated` chỉ cho bản thử: `validate` cảnh báo, `cli.js final` từ chối render.
- Mốc thật từ ASR, gõ tay hoặc file phụ đề; `Video-analysis` hiện chưa có, máy chưa có công cụ nhận dạng.

### Trạng thái từng từ và thời gian khối
- Đang nói (`start ≤ t < end`): `karaoke_active_color` và nảy. Đã nói: `karaoke_done_color` (hoặc màu chữ). Chưa nói: màu chữ với độ mờ `karaoke_upcoming_opacity`. Từ giữa hai từ (khoảng lặng) tính là "đã nói".
- Cả cụm hiện từ đầu khối (từ chưa nói mờ), nên neo sát từ đầu: cảnh báo nếu chữ hiện sớm hơn lời > 1 s.
- Không dùng `hold`; khối kết thúc ở `end` từ cuối + `words_tail` rồi `out_duration`; `decision.duration` bị bỏ qua. `anchor.clip` bắt buộc. `highlight_words` không tác dụng ở chế độ này.

## 5. Quy trình thực hiện
1. Có lời và mốc thật; ghi `words_source`; chia lời thành cụm ≤ 16 từ theo ý, ngắt ở chỗ nghỉ.
2. Mỗi cụm là một quyết định riêng, `anchor.source_time` ≤ `start` của từ đầu cụm (≤ 0.5 s).
3. Chọn preset: nền tối bo góc (`clean`) khi nền hình sáng/rối; viền (`bold`) khi hình tối.
4. Không đặt cùng `subtitles`; hai cụm liền nhau không được chồng khối (cụm sau bắt đầu sau khi cụm trước hết `words_tail`, hoặc giảm `words_tail`).
5. `validate`, xem preview.

## 6. Biến thể và preset
Đã xem trên preview 960×540 của clip thử (`projects/demo-text-p3`; mốc ước lượng đều 0.42 s/từ, chưa kiểm chứng với lời thật): `karaoke_clean` từ đang nói vàng, đã nói trắng, chưa nói mờ (0.5), nền tối bo góc; `karaoke_bold` chữ viền, từ đang nói hồng.
| Preset | Mô tả | Documentary |
|---|---|---|
| `karaoke_clean` | Inter 700 cỡ 56, hộp tối bo góc, từ đang nói vàng | **Cấm** |
| `karaoke_bold` | Be Vietnam Pro 800 cỡ 68, viền, từ đang nói hồng, không hộp | **Cấm** |

## 7. Quy tắc quyết định
- `R-KAR-1` (validate): `words` hợp lệ, `words_source` hợp lệ, `words_mode: karaoke`, ≤ 16 từ, từ đầu không trước điểm neo, từ cuối không sau `source_out`, `karaoke_upcoming_opacity` ∈ [0, 1], `word_pop_amount` ∈ [0, 0.4], `words_tail` ∈ [0, 3].
- `R-KAR-2` (cảnh báo): `estimated`; từ > 2.5 s; chữ hiện sớm hơn lời > 1 s; clip đổi tốc độ hoặc dừng hình.
- `R-KAR-3`: NẾU style `documentary` THÌ không dùng; dùng `subtitles` (`subtitles_standard`).
- `R-KAR-4`: phụ đề thường vẫn là mặc định cho lời thoại; karaoke chỉ khi có lý do (lời hát, video ngắn, nhịp).
- `R-KAR-5`: khả năng đọc thắng phong cách: màu từ đang nói phải tách rõ nền và màu "xong".
- Ngân sách đề xuất: dùng nhất quán trong một đoạn, không xen với `subtitles` thường (low).

## 8. Ví dụ
Ví dụ **định dạng**, không phải lời thật của ai: năm từ minh họa, `words_source: "manual"`. Clip `c04` có `source_out` ≥ 20.
```json
{
  "id": "d16",
  "technique": "karaoke_subtitles",
  "preset": "karaoke_clean",
  "anchor": { "clip": "c04", "source_time": 18.0 },
  "parameters": {
    "words": [
      { "text": "Một", "start": 18.1, "end": 18.4 },
      { "text": "hai", "start": 18.45, "end": 18.8 },
      { "text": "ba", "start": 18.85, "end": 19.2 },
      { "text": "bắt", "start": 19.25, "end": 19.5 },
      { "text": "đầu", "start": 19.5, "end": 19.9 }
    ],
    "words_source": "manual"
  },
  "reason": "Đoạn đếm nhịp, cần mắt người xem đi theo từng từ",
  "priority": "rhythm",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```
Khối kéo dài 19.9 + 0.5 − 18.0 = 2.4 s từ điểm neo, rồi 0.25 s ra.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Dùng thay phụ đề cho lời nghiêm túc | Chữ nhảy màu gây xao nhãng | `subtitles` |
| Mốc ước lượng ở bản cuối | `estimated`; `final` từ chối | Mốc thật |
| Neo quá sớm | Cụm mờ hiện trước lời > 1 s | `source_time` sát từ đầu |
| Màu đang nói gần màu nền | Khó phân biệt | Đổi `karaoke_active_color` hoặc dùng hộp |
| Cụm quá dài | > 16 từ, validate lỗi; xuống dòng | Cắt thành nhiều quyết định |
| Hai cụm chồng khối | Hai khối cùng hiện | Giảm `words_tail` |

## 10. Kiểm tra sau render
- Từ sáng đúng lúc nghe thấy, đổi sang màu "xong" khi qua; từ chưa nói mờ nhưng vẫn đọc được.
- Đủ dấu tiếng Việt; hộp/viền không che mặt; chữ trong vùng an toàn.
- Cụm không nhảy bố cục khi từ nảy.
- Cần xem preview (chưa kiểm chứng): độ khớp lời thật (cần ASR); hoạt ảnh vào/ra; cụm dài tự xuống dòng ở 1080p/4K; clip đổi tốc độ; ngôn ngữ ngoài tiếng Việt.
