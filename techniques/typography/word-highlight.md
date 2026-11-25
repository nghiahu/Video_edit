---
id: word_highlight
name: Word Highlight (Từ khóa sáng theo lời)
group: typography
roles: [emphasis, clarity, information]
status: usable
source_of_values: convention
---

# Word Highlight

## 1. Mục đích
Hiện **cả câu ngay từ đầu**, rồi cho từ khóa đổi màu (và nảy nhẹ nếu bật) **đúng lúc người nói đọc đến nó**. Người xem đọc được câu và biết từ nào là điểm nhấn. Thuộc cấp 1–3 trong `typography/hierarchy.md` tùy cỡ chữ; một khung chỉ một cấp nhấn.

## 2. Khi nên dùng
- Có câu nói ngắn (≤ 20 từ) và **mốc thời gian theo từng từ đáng tin** (`asr`, `manual`, `subtitle_file`), cần nhấn 1–4 từ khóa.
- Câu thông điệp, định nghĩa, tên khái niệm mà người nói nhấn giọng.
- Muốn chữ có nhịp theo lời mà vẫn tiết chế: `word_highlight_clean` dùng được ở documentary.

**Chọn đúng kỹ thuật:**
| Tình huống | Chọn |
|---|---|
| Phụ đề thường cho lời thoại | `subtitles` (mặc định) |
| Cả câu hiện sẵn, từ khóa sáng đúng lúc nói | `word_highlight` |
| Mọi từ lần lượt sáng như hát | `karaoke_subtitles` |
| Từng từ hiện nối tiếp theo lời | `word_by_word_text` |
| 1–3 từ cực lớn cho video dọc | `shortform_captions` |
| Nhấn nguyên câu, không bám từng từ | `kinetic_text` |

## 3. Khi không nên dùng
- **Không có mốc theo từ thật.** Không tự bịa lời nói hay mốc; `words_source: estimated` chỉ để thử, bản cuối bị `cli.js final` từ chối.
- Lời thoại thông thường không có điểm nhấn: dùng `subtitles`.
- Hơn 20 từ (validate báo lỗi); câu dài thì cắt thành nhiều quyết định theo ý.
- Cùng lúc với `subtitles`, `lower_third`, `kinetic_text` ở vùng dưới (xung đột khối chữ).
- Clip có `time_lapse`, `freeze_frame`, `speed_ramp_transition`: mốc tính theo thời gian nguồn nên lệch (validate cảnh báo).
- Documentary với `word_highlight_pop` (nằm trong `forbidden_styles`).

## 4. Thông số
Khối nền `_text_style_base`, nhánh `words_mode: "highlight"` của `TextBlock.jsx`. Cỡ chữ tính cho 1080p.
| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `words_mode` | `"highlight"` (nền `null`) | bắt buộc `highlight` (validate) | – | medium |
| `words` | – (bắt buộc) | mảng `{text, start, end}`, ≤ 20 từ | giây (thời gian nguồn) | medium |
| `words_source` | – (bắt buộc) | `asr`\|`manual`\|`subtitle_file`\|`estimated` | – | medium |
| `highlight_words` | – (bắt buộc) | mảng từ/cụm; khớp không phân biệt hoa thường, bỏ dấu `. , ! ? ; : " “ ”` | – | medium |
| `highlight_color` | `#FFD84D` (nền `null` thì dùng `#FFD84D`) | màu CSS | – | low |
| `word_pop` | `false` (clean) / `true` (pop); nền `true` | true/false | – | low |
| `word_pop_amount` | 0.14 (pop: 0.16) | 0–0.4 (validate) | tỉ lệ phóng thêm | low |
| `words_tail` | 0.5 | 0–3 (validate) | giây giữ sau từ cuối | low |
| `font_family` / `font_weight` | Inter 600 / Inter 800 | phông trong registry, vai trò `subtitle`/`body`/`emphasis`/`heading` | – | low |
| `font_size` | 56 / 64 | 12–600 | px @1080p | low |
| `max_width_percent` | 78 / 80 | – | % bề ngang | low |
| `position` / `align` | `lower_middle` + `center` | 9 vị trí | – | low |
| `box_style` | `none` (pop: `rounded`, nền `rgba(10,14,24,0.72)`, đệm 36×22, bo 22) | enum | – | low |
| `in_animation` / `out_animation` | `fade` 0.25 s / `fade` 0.25 s | enum | – | low |

### Dữ liệu cần có
- `words` = `[{ "text": "...", "start": giây, "end": giây }]` tính theo **thời gian của video nguồn** (cùng hệ với `anchor.source_time`), tăng dần, **không chồng quá 0.05 s**, mỗi phần tử đủ `text`, `start`, `end` với `end > start`.
- `words_source` bắt buộc; thiếu hoặc ngoài danh sách là lỗi. **Không được tự bịa lời nói hoặc mốc** (quy tắc trung thực của dự án). `Video-analysis` hiện chưa có mốc theo từ và máy chưa có nhận dạng giọng nói: mốc phải đến từ ASR bên ngoài, gõ tay, hoặc file phụ đề.
- `estimated` chỉ cho bản thử: `validate` cảnh báo, `cli.js final` từ chối render.

### Thời gian khối
Không dùng `hold`. Renderer đổi `words` thành mốc tương đối với `anchor.source_time + start_offset`; khối kết thúc ở `end` của từ cuối + `words_tail`, rồi `out_duration`. `decision.duration` bị bỏ qua (không cảnh báo lệch). `anchor.clip` bắt buộc (không dùng `between`).

## 5. Quy trình thực hiện
1. Lấy câu và mốc từ nguồn đáng tin; ghi `words_source`. Thiếu mốc thì dừng, hỏi hoặc chạy nhận dạng.
2. Chọn 1–4 từ khóa thật sự là ý chính; chép vào `highlight_words` đúng chính tả.
3. Đặt `anchor.source_time` ≤ `start` của từ đầu, lý tưởng cách ≤ 0.5 s (cảnh báo nếu chữ hiện sớm hơn lời > 1 s).
4. Chọn preset theo style (mục 6); tránh chồng chữ khác.
5. Chạy `validate`, rồi xem preview: từ khóa sáng có đúng lúc nói không.

## 6. Biến thể và preset
Đã xem trên preview 960×540 của clip thử (project `projects/demo-text-p3`): cả câu hiện sẵn, từ khóa đổi vàng lần lượt đúng mốc ("phân", "tích", "dữ", "liệu"); `pop` có hộp tối bo góc và từ khóa nảy nhẹ. Mốc trong clip thử là **ước lượng đều 0.42 s/từ** (`estimated`), nên chưa kiểm chứng độ khớp với lời thật.
| Preset | Mô tả | Documentary |
|---|---|---|
| `word_highlight_clean` | Inter 600 cỡ 56, bóng mềm, từ khóa vàng, không nảy | Được phép |
| `word_highlight_pop` | Inter 800 cỡ 64, hộp tối bo góc, từ khóa vàng và nảy | **Cấm** |

## 7. Quy tắc quyết định
- `R-WH-1` (validate): `words` hợp lệ (mục 4), `words_source` hợp lệ, `words_mode: highlight`, `highlight_words` không rỗng, ≤ 20 từ, từ đầu không trước điểm neo, từ cuối không sau `source_out` của clip, `word_pop_amount` ∈ [0, 0.4], `words_tail` ∈ [0, 3].
- `R-WH-2` (cảnh báo): `estimated`; từ kéo dài > 2.5 s; chữ hiện sớm hơn lời > 1 s; clip đổi tốc độ hoặc dừng hình; `highlight_words` không có trong chữ.
- `R-WH-3`: NẾU style `documentary` THÌ chỉ `word_highlight_clean`; phụ đề thường (`subtitles`) vẫn là mặc định cho lời thoại, kỹ thuật này chỉ dùng khi cần nhấn từ khóa.
- `R-WH-4`: mỗi khung một cấp nhấn; không đặt cùng lúc với khối chữ nhấn khác.
- Ưu tiên lớp: Clarity > Style > Decoration (nảy, hộp). `styles/documentary.md` chưa có dòng ngân sách; đề xuất ≤ 3 mỗi video 2 phút (low).

## 8. Ví dụ
Ví dụ **định dạng**, không phải lời thật của ai: năm từ minh họa, `words_source: "manual"`. Clip `c02` có `source_out` ≥ 13.2.
```json
{
  "id": "d12",
  "technique": "word_highlight",
  "preset": "word_highlight_clean",
  "anchor": { "clip": "c02", "source_time": 12.3 },
  "start_offset": 0.0,
  "parameters": {
    "words": [
      { "text": "Hãy", "start": 12.4, "end": 12.6 },
      { "text": "phân", "start": 12.65, "end": 12.95 },
      { "text": "tích", "start": 12.95, "end": 13.2 },
      { "text": "dữ", "start": 13.25, "end": 13.4 },
      { "text": "liệu", "start": 13.4, "end": 13.8 }
    ],
    "words_source": "manual",
    "highlight_words": ["phân tích", "dữ liệu"]
  },
  "reason": "Câu thông điệp có hai cụm khóa, nhấn đúng lúc được nói",
  "priority": "clarity",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```
Khối kéo dài tới 13.8 + 0.5 − 12.3 = 2.0 s từ điểm neo, rồi `out_duration` 0.25 s. `duration` không cần khai.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Mốc bịa hoặc ước lượng đưa vào bản cuối | `words_source: estimated`; `final` từ chối | Lấy mốc thật |
| Thiếu `highlight_words` | validate báo lỗi | Điền 1–4 từ khóa |
| Tô quá nhiều từ | Gần hết câu vàng, mất nhấn | ≤ 4 từ khóa |
| Từ khóa gõ lệch chính tả | Cảnh báo "không có trong chữ"; từ không sáng | Chép đúng như trong `words` |
| Neo quá sớm | Cụm hiện trước lời > 1 s | `source_time` sát từ đầu |
| Dùng `pop` ở documentary | validate báo lỗi | `word_highlight_clean` |
| Dùng `hold` hoặc `duration` mong kéo dài | Bị bỏ qua | Chỉnh `words_tail` |

## 10. Kiểm tra sau render
- Cả câu hiện đủ dấu tiếng Việt; từ khóa đổi màu đúng lúc nghe thấy, không sớm/muộn rõ rệt.
- Từ đã sáng giữ màu đến hết khối; câu không xuống dòng làm bố cục nhảy.
- Chữ nằm trong vùng an toàn, không che mặt, không chồng phụ đề.
- Cần xem preview (chưa kiểm chứng): độ khớp lời thật (cần ASR); hoạt ảnh vào/ra; clip đổi tốc độ hoặc dừng hình; câu dài tự xuống dòng ở 1080p/4K; ngôn ngữ ngoài tiếng Việt; `word_pop_amount` ở cỡ chữ lớn.
