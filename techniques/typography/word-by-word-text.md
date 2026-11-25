---
id: word_by_word_text
name: Word By Word Text (Từng từ theo lời)
group: typography
roles: [emphasis, rhythm, information]
status: usable
source_of_values: convention
---

# Word By Word Text

## 1. Mục đích
Cho chữ **hiện từng từ đúng lúc được nói**: hoặc nối tiếp rồi ở lại thành câu hoàn chỉnh, hoặc mỗi lúc một từ thay nhau giữa khung. Tạo nhịp theo lời và dồn sự chú ý vào đúng từ đang nghe. Thuộc cấp 1 (`typography/hierarchy.md`); một khung chỉ một cấp nhấn.

## 2. Khi nên dùng
- Câu thông điệp ngắn (≤ 20 từ) có **mốc theo từng từ đáng tin**, cần nhịp mạnh: mở video, hook, câu chốt.
- Chế độ tích luỹ (`word_by_word_stack`): muốn câu hình thành dần mà bố cục không nhảy.
- Chế độ thay nhau (`word_by_word_single`): nhịp nhanh, từng từ to giữa khung, video ngắn.

**Chọn đúng kỹ thuật:**
| Tình huống | Chọn |
|---|---|
| Phụ đề thường | `subtitles` (mặc định) |
| Chữ hiện dần từng ký tự, không theo lời | `typewriter_text` |
| Từng từ hiện theo lời | `word_by_word_text` |
| Cả câu sẵn, từ khóa sáng | `word_highlight` |
| 1–3 từ cực lớn theo cụm | `shortform_captions` |

## 3. Khi không nên dùng
- **Không có mốc theo từ thật.** Không tự bịa lời nói hay mốc; `estimated` chỉ để thử, bản cuối bị từ chối.
- Lời thoại thường cần đọc liền mạch: `subtitles` (đọc từng từ hiện ra mệt khi dài).
- Hơn 20 từ (validate báo lỗi).
- Cùng khung có khối chữ nhấn hoặc phụ đề khác (một cấp nhấn mỗi khung).
- Clip đổi tốc độ hoặc dừng hình: mốc lệch (validate cảnh báo).
- **Documentary: cả hai preset bị cấm** (`forbidden_styles`).

## 4. Thông số
Khối nền `_text_style_base`, nhánh `words_mode: "by_word"`. Cỡ chữ tính cho 1080p.
| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `words_mode` | `"by_word"` (nền `null`) | bắt buộc `by_word` (validate) | – | medium |
| `words` / `words_source` | – (bắt buộc) | xem "Dữ liệu cần có"; ≤ 20 từ | giây / enum | medium |
| `word_replace` | `false` (stack) / `true` (single); nền `false` | true/false | – | low |
| `word_pop` | `true` | true/false | – | low |
| `word_pop_amount` | 0.14 (single: 0.2) | 0–0.4 (validate) | tỉ lệ phóng thêm | low |
| `highlight_words`, `highlight_color` | tùy chọn; màu `#FFD84D` nếu `null` | mảng từ; màu CSS | – | low |
| `words_tail` | 0.5 | 0–3 (validate) | giây | low |
| `font_family` / `font_weight` / `font_size` | Inter 800 / 72 (single: Anton 400 / 200, HOA) | phông có vai trò `heading`/`emphasis`/`accent`…; cỡ 12–600 | px @1080p | low |
| `position` / `align` | `center` + `center` | 9 vị trí | – | low |
| `max_width_percent` | 76 (single: nền 88) | – | % | low |
| `in_animation` / `out_animation` | `none` 0.05 s / `fade` 0.3 s (single 0.2 s) | enum | – | low |

### Dữ liệu cần có
- `words` = `[{ "text": "...", "start": giây, "end": giây }]` theo **thời gian video nguồn** (cùng hệ với `anchor.source_time`), tăng dần, không chồng quá 0.05 s, `end > start`.
- `words_source` bắt buộc ∈ `asr|manual|subtitle_file|estimated`. **Không được tự bịa lời nói hoặc mốc.** `estimated` chỉ cho bản thử: `validate` cảnh báo, `cli.js final` từ chối render.
- Mốc phải đến từ ASR, gõ tay hoặc file phụ đề; `Video-analysis` hiện chưa có và máy chưa có công cụ nhận dạng.

### Cách hiện từ
- Tích luỹ (`word_replace: false`): từ hiện khi `t ≥ start` và ở lại; từ chưa hiện **vẫn chiếm chỗ** (trong suốt) nên bố cục không nhảy.
- Thay nhau (`true`): từ chỉ hiện từ `start` của nó đến `start` của từ kế (từ cuối ở lại đến hết khối); từ ẩn không chiếm chỗ.
- Mỗi từ mờ vào trong 0.1 s và nảy theo `word_pop`. Nếu có `highlight_words`, từ khóa dùng `highlight_color`.
- Thời gian khối: không dùng `hold`; kết thúc ở `end` từ cuối + `words_tail`, rồi `out_duration`; `decision.duration` bị bỏ qua. `anchor.clip` bắt buộc.

## 5. Quy trình thực hiện
1. Có câu và mốc thật; ghi `words_source`.
2. Chọn chế độ: câu đầy đủ cần đọc → tích luỹ; nhịp nhanh từng từ → thay nhau.
3. Đặt `anchor.source_time` ≤ `start` từ đầu, sát lời nhất có thể.
4. Kiểm tra từ nào ngắn hơn ~0.2 s (khó nhìn kịp ở chế độ thay nhau).
5. `validate`, rồi xem preview: từ hiện có khớp lời không, bố cục có nhảy không.

## 6. Biến thể và preset
Đã xem trên preview 960×540 của clip thử (`projects/demo-text-p3`; mốc ước lượng đều 0.42 s/từ, chưa kiểm chứng với lời thật): `stack` hiện nối tiếp và ở lại, bố cục không nhảy; `single` mỗi lúc một từ Anton hoa giữa khung, thay nhau.
| Preset | Mô tả | Documentary |
|---|---|---|
| `word_by_word_stack` | Inter 800 cỡ 72, tích luỹ, bóng mềm | **Cấm** |
| `word_by_word_single` | Anton HOA cỡ 200, một từ mỗi lúc, bóng cứng 6/6 | **Cấm** |

## 7. Quy tắc quyết định
- `R-WBW-1` (validate): `words` hợp lệ, `words_source` hợp lệ, `words_mode: by_word`, ≤ 20 từ, từ đầu không trước điểm neo, từ cuối không sau `source_out`, `word_pop_amount` ∈ [0, 0.4], `words_tail` ∈ [0, 3].
- `R-WBW-2` (cảnh báo): `estimated`; clip đổi tốc độ hoặc dừng hình.
- `R-WBW-3`: NẾU style `documentary` THÌ không dùng; chọn `subtitles` hoặc `word_highlight_clean`.
- `R-WBW-4`: phụ đề thường vẫn là mặc định; chỉ dùng khi có lý do (hook, câu chốt, video ngắn dọc).
- `R-WBW-5`: một khung một cấp nhấn; không đặt cùng phụ đề.
- Ưu tiên lớp: Clarity > Rhythm > Style. Ngân sách đề xuất ≤ 2 mỗi video 2 phút (low).

## 8. Ví dụ
Ví dụ **định dạng**, không phải lời thật của ai: bốn từ minh họa, `words_source: "manual"`, chế độ tích luỹ. Clip `c03` có `source_out` ≥ 6.4.
```json
{
  "id": "d14",
  "technique": "word_by_word_text",
  "preset": "word_by_word_stack",
  "anchor": { "clip": "c03", "source_time": 5.0 },
  "parameters": {
    "words": [
      { "text": "Bắt", "start": 5.1, "end": 5.35 },
      { "text": "đầu", "start": 5.4, "end": 5.7 },
      { "text": "từ", "start": 5.75, "end": 5.9 },
      { "text": "đây", "start": 5.95, "end": 6.4 }
    ],
    "words_source": "manual"
  },
  "reason": "Câu mở hook ngắn, nhịp theo lời để giữ người xem",
  "priority": "rhythm",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```
Khối kéo dài 6.4 + 0.5 − 5.0 = 1.9 s từ điểm neo, rồi 0.3 s ra. Muốn chế độ thay nhau thì dùng `word_by_word_single`.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Mốc ước lượng ở bản cuối | `estimated`; `final` từ chối | Mốc thật |
| Dùng ở documentary | validate báo lỗi | `subtitles` / `word_highlight_clean` |
| Câu dài hiện từng từ | Người xem đợi, > 12 từ | Dùng `subtitles` hoặc cắt câu |
| Từ quá ngắn ở chế độ thay nhau | Từ chớp < 0.2 s | Gộp từ hoặc dùng tích luỹ |
| Quên `words_source` | validate báo lỗi | Ghi nguồn mốc |
| Mong `hold` kéo dài khối | Bị bỏ qua | Dùng `words_tail` |

## 10. Kiểm tra sau render
- Từ hiện đúng lúc nghe thấy; đủ dấu tiếng Việt; câu cuối hoàn chỉnh (tích luỹ).
- Tích luỹ: bố cục không nhảy khi thêm từ. Thay nhau: từ nằm giữa khung, không tràn bề ngang.
- Còn thời gian đọc sau từ cuối (`words_tail`); chữ trong vùng an toàn.
- Cần xem preview (chưa kiểm chứng): độ khớp lời thật (cần ASR); hoạt ảnh vào/ra; clip đổi tốc độ; `word_pop_amount` ở cỡ chữ lớn; 1080p/4K; ngôn ngữ ngoài tiếng Việt.
