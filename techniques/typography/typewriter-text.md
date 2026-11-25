---
id: typewriter_text
name: Typewriter Text (Chữ đánh máy)
group: typography
roles: [information, rhythm, emphasis]
status: usable
source_of_values: convention
---

# Typewriter Text

## 1. Mục đích
Cho chữ **hiện dần từng ký tự** như đang được gõ, để người xem đọc theo nhịp của câu và chú ý vào nội dung đang hình thành. Dùng cho câu dẫn, ghi chú, tiêu đề kể chuyện. Thuộc cấp 1 hoặc 2 trong `typography/hierarchy.md` tùy cỡ chữ; một khung chỉ một cấp nhấn.

## 2. Khi nên dùng
- Câu dẫn hoặc dữ kiện **1–4 dòng, tối đa 24 từ**, người xem cần thời gian đọc và không có lời nói trùng nội dung (`R-TYPE-1`).
- Tiêu đề mở đầu hoặc đoạn chuyển ý, muốn tạo cảm giác "đang viết ra" mà không dùng chuyển động lớn.
- Ghi chú đời thường (`typewriter_note`) hoặc cảnh công nghệ (`typewriter_terminal`) ở style cho phép.
- Chữ có nhịp đọc rõ: số ký tự biết trước, nên tính được thời gian gõ.

**Chọn đúng kỹ thuật:**
| Tình huống | Chọn |
|---|---|
| Chữ gõ dần, nội dung dài đến 24 từ | `typewriter_text` |
| Câu ngắn hiện nguyên khối theo lời nói | `kinetic_text` |
| Chữ phụ đề theo lời thoại | `subtitles` |
| Tiêu đề giải mã, ký tự nhảy rồi chốt | `scramble_text` |

## 3. Khi không nên dùng
- Chữ cần đọc ngay hoặc là phụ đề bám lời nói: gõ dần làm người xem đợi (`R-TYPE-4`).
- Hơn 24 từ hoặc hơn 4 dòng (validate báo lỗi, `R-TYPE-1`); chữ dài thì dùng `pull_quote` hoặc `bullet_list_reveal`.
- `hold` không đủ thời gian gõ cộng thời gian đọc (validate cảnh báo).
- Cùng khung có khối chữ nhấn khác (`R-TYPE-3`).
- Documentary với `typewriter_terminal`, `typewriter_note` (nằm trong `forbidden_styles`, validate báo lỗi).
- Dùng mọi cảnh: mỗi lần gõ chiếm vài giây, lặp nhiều thành nhiễu.

## 4. Thông số
Khối nền `_text_style_base`; giá trị dưới đây theo preset (clean / title / terminal / note). Cỡ chữ tính cho 1080p.
| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `typewriter` | `true` (nền: `false`) | bắt buộc `true` (validate) | – | medium |
| `type_speed` | 18 / 14 / 20 / 12 (nền 16) | 4–60 (validate) | ký tự/giây | low |
| `type_duration` | 0 (nền 0) | > 0 thì thay `type_speed`; không kiểm tra | giây | low |
| `type_delay` | 0.1 | không kiểm tra | giây | low |
| `caret` | `false` / `true` / `true` / `true` (nền `false`) | true/false | – | low |
| `caret_char` | `\|` (terminal `▌`) | một ký tự; không kiểm tra | – | low |
| `caret_blink` | 2 | ≥ 0; 0 = luôn sáng; không kiểm tra | lần/giây | low |
| `caret_color` | `null` (theo `text_color`) | màu CSS | – | low |
| `font_family` / `font_weight` | Inter 500 / Inter 700 / Chakra Petch 500 / Patrick Hand 400 | phông trong registry, vai trò hợp | – | low |
| `font_size` | 56 / 84 / 52 / 70 | 12–600 (validate) | px @1080p | low |
| `text_color` | `#FFFFFF` (terminal `#7CFFB2`, note `#FFF3B0`) | màu CSS | – | low |
| `position` / `align` | `lower_middle`+left / `center`+center / `lower_left`+left / `lower_middle`+center | 9 vị trí | – | low |
| `box_style` | `none` (terminal: `rect`, nền `rgba(8,12,20,0.88)`, đệm 36×26) | enum | – | low |
| `hold` (nội dung) | xem công thức dưới | ≥ công thức | giây | medium |
| `in_animation` / `out_animation` | `none` / `fade` (`in_duration` 0.1, `out_duration` 0.2–0.3) | in nên `none`\|`fade` (cảnh báo) | – | low |
Thời gian gõ `td = số_ký_tự / type_speed` (số ký tự của mọi dòng, gồm khoảng trắng, không gồm ký tự xuống dòng), hoặc `type_duration` nếu > 0. Ký tự chưa hiện **vẫn chiếm chỗ** (trong suốt) nên bố cục không nhảy. Con trỏ rộng 0, luôn sáng khi đang gõ, sau đó nhấp nháy theo `caret_blink`. Chữ không dùng `highlight_words`, vệt bút dạ hay `letter_stagger`.

## 5. Quy trình thực hiện
1. Rút câu từ lời thoại hoặc ghi chú, giữ chính tả và dấu; kiểm tra mục 3.
2. Đếm từ và ký tự; chọn preset theo style (mục 6).
3. Tính `td`; đặt `hold ≥ max(1.0, 0.8 + 0.3 × số_từ, td + type_delay + 0.6 − in_duration)`.
4. Đặt `duration = in_duration + hold + out_duration` (renderer không dùng `duration` của quyết định).
5. Chạy `validate`, rồi xem preview: tốc độ gõ có đọc kịp, con trỏ, xuống dòng.

## 6. Biến thể và preset
Bốn preset đã xem trên preview 960×540 của clip thử (khung tĩnh nhiều thời điểm): chữ hiện dần từng ký tự, bố cục không nhảy, con trỏ rộng 0 nhấp nháy.
| Preset | Mô tả | Documentary |
|---|---|---|
| `typewriter_clean` | Inter 500, trắng, không hộp, không con trỏ, bóng mềm | Được phép |
| `typewriter_title` | Inter 700 cỡ 84 giữa khung, con trỏ, nền `dim` 0.35 | Được phép |
| `typewriter_terminal` | Chakra Petch xanh lá trên hộp tối, con trỏ khối `▌` | **Cấm** |
| `typewriter_note` | Patrick Hand vàng nhạt, bóng cứng | **Cấm** |
Đã xem: terminal có hộp tối + chữ xanh lá; note viết tay vàng nhạt.

## 7. Quy tắc quyết định
- `R-TYPE-1` (validate): `typewriter: true`; ≤ 24 từ, ≤ 4 dòng; `type_speed` ∈ [4, 60]; `hold` ≥ `max(1.0, 0.8 + 0.3 × số_từ)` (lỗi); phông có vai trò `heading`/`emphasis`/`subtitle`/`accent`/`body`; enum hợp lệ.
- `R-TYPE-2`: NẾU style `documentary` THÌ chỉ `typewriter_clean` hoặc `typewriter_title`; `in_animation` chỉ `none|fade|fade_up|line_stagger`, `out_animation` chỉ `none|fade`.
- `R-TYPE-3`: NẾU cùng khung có khối chữ nhấn khác THÌ bỏ hoặc dời (một cấp chữ nhấn mỗi khung).
- `R-TYPE-4`: NẾU chữ cần đọc ngay hoặc đang trùng lời nói THÌ dùng `kinetic_text` hoặc `subtitles`.
- `R-TYPE-5` (cảnh báo): `td + type_delay + 0.6 > in_duration + hold` thì tăng `hold` hoặc `type_speed`. Khuyến nghị `type_speed` ≤ 24 để đọc kịp (low, ước lượng, chưa thử với người xem).
- Ưu tiên lớp: Clarity (đọc kịp) > Style > Decoration (con trỏ, bóng). `styles/documentary.md` chưa có dòng ngân sách cho kỹ thuật này; đề xuất ≤ 2 mỗi video 2 phút (low).

## 8. Ví dụ
Câu dẫn đầu chương trình trong clip `c02`, style documentary dùng `typewriter_clean`. 10 từ, 42 ký tự, `type_speed` 18 nên `td` ≈ 2.33 s; `hold` ≥ max(3.8, 2.33 + 0.1 + 0.6 − 0.1 = 2.93) = 3.8, chọn 4.0.
```json
{
  "id": "d05",
  "technique": "typewriter_text",
  "preset": "typewriter_clean",
  "anchor": { "clip": "c02", "source_time": 3.0 },
  "start_offset": 0.0,
  "duration": 4.4,
  "parameters": { "text": "Khóa học mở đầu bằng buổi gặp mặt học viên", "hold": 4.0 },
  "reason": "Câu dẫn mở đoạn, người xem cần thời gian đọc, không trùng lời nói",
  "priority": "clarity",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```
`duration` 4.4 = 0.1 (`in_duration`) + 4.0 + 0.3 (`out_duration`). Nội dung chữ là minh họa.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Gõ xong sát lúc chữ biến mất | Cảnh báo "gõ xong lúc …" | Tăng `hold` hoặc `type_speed` |
| Gõ quá chậm | `type_speed` < 10 với câu dài, người xem sốt ruột | Rút câu hoặc tăng tốc |
| Dùng thay phụ đề | Chữ gõ lệch lời nói | `subtitles` (`R-TYPE-4`) |
| Preset lòe loẹt ở documentary | `terminal`/`note`; validate báo lỗi | `clean` hoặc `title` |
| `in_animation` mạnh | `pop`, `slide_*` làm chồng hiệu ứng | Chỉ `none`/`fade` (validate cảnh báo) |
| Quên `typewriter: true` | Chữ hiện nguyên khối; validate báo lỗi | Dùng preset hoặc ghi rõ |

## 10. Kiểm tra sau render
- Chữ hiện từng ký tự, đủ dấu tiếng Việt; chốt đúng câu khi gõ xong.
- Bố cục không nhảy khi thêm ký tự; con trỏ nhấp nháy, không chiếm chỗ.
- Còn ≥ 0.6 s đọc sau khi gõ xong; chữ không che mặt, nằm trong vùng an toàn.
- Cần xem preview (chưa kiểm chứng): hoạt ảnh vào/ra; chữ **nhiều dòng** và con trỏ ở đầu dòng 2; glyph `▌` của Chakra Petch; 1080p/4K.
