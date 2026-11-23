# Style: Documentary (hiện đại)

Cảm giác: trang trọng, chân thực, tiết chế. Để nội dung và con người dẫn dắt; edit không nên lộ ra.

## Hợp với
Tổng kết sự kiện nghiêm túc (lễ khai giảng, hội thảo), phỏng vấn, giới thiệu chương trình, câu chuyện cá nhân.

## Chiến lược mặc định (điền vào `strategy`)
```json
{
  "style": "documentary",
  "pacing": "moderate",
  "visual_intensity": "low_to_medium",
  "typography_style": "editorial",
  "transition_style": "mostly_hard_cut",
  "motion_style": "subtle"
}
```
`pacing` đổi sang `slow` cho nội dung cảm xúc; `moderate` cho tổng kết sự kiện.

## Ngân sách hiệu ứng (tham khảo, cho video ~2 phút; nhân theo độ dài)
| Kỹ thuật | Tối đa | Ghi chú |
|---|---|---|
| `punch_in` | 4–6 | Chỉ `punch_in_subtle`; không hai lần cách < 6 s |
| `kinetic_text` | 3–4 | `kinetic_text_editorial` hoặc `minimal` |
| `j_l_cut` | tuỳ chỗ cần | Nên có ở các điểm nối có lời |
| `lower_third` | 1 mỗi người nói | Lần đầu xuất hiện, 3–5 s, `lower_third_editorial` |
| `slow_push` | 1–2 | Chỉ `slow_push_subtle` trên b-roll tĩnh dài |
| `cross_dissolve` (chuyển cảnh đặc biệt) | 0–2 | Chỉ khi trôi thời gian, đổi địa điểm, mở/kết; `dissolve_standard` hoặc `short` |
| `b_roll_insert` | theo nhu cầu | B-roll khớp nghĩa, L-cut giữ lời |
| `punch_out` | 1–2 | `punch_out_subtle`, ở kết đoạn hoặc mở cảnh |
| `subtitles` | khi cần | Chỉ khi có nguyên văn đáng tin; `subtitles_standard` |
| `color_grade_basic` | cùng preset mọi clip | `grade_neutral_clean` hoặc `grade_warm_documentary`; không làm gì nếu màu đã đều |
| `vignette` | tuỳ chọn | `vignette_subtle`, `strength` ≤ 0.25 |
| `text_pill` | ≤ 3 | Chỉ `text_pill_clean`, `text_pill_outline` |
| `text_box` | ≤ 3 | Chỉ `text_box_dark`, `text_box_bar`, `text_box_underline` |
| `stacked_text` | ≤ 2 | Chỉ `stacked_small_top`, `stacked_small_bottom` |
| `title_card` | ≤ 2 (mở và kết) | `title_card_clean`, `title_card_blur`, `title_card_editorial`; thời gian vào được dài hơn mức chung (0.5–0.8 s) |
| `big_text`, `marker_highlight` | không dùng | Không có preset nào hợp documentary |
| SFX | 0 | Documentary không dùng SFX trang trí |

## Được
- `hard_cut` là điểm nối chính.
- `punch_in_subtle` ở câu thông điệp.
- `kinetic_text_editorial` ở dữ kiện cụ thể.
- `audio_ducking` mọi lúc có nhạc + lời.
- Nhạc nền êm, không lời, chậm.
- B-roll rộng, ổn định, có chuyển động tự nhiên của camera (dolly, pan chậm).

## Cấm
Glitch, bounce, elastic, RGB split, rung mạnh, whip pan/tilt, zoom transition, spin/roll, slide/push/swipe/wipe, các kiểu che-lộ hình dạng (iris, clock, barn door, luma, shape, mask reveal), flash/strobe, light leak, film burn, VHS, pixelate, text graphic wipe, SFX trang trí (`whoosh_synced_cut`), chữ phát sáng, màu chữ rực, animation chữ kiểu "pop" lòe loẹt.

**Chuyển cảnh được phép ở documentary:** cắt thẳng và các kiểu cắt mẫu (`jump_cut` chỉ khi nhỏ, `cut_on_action`, `match_cut`...), `j_l_cut`, `sound_bridge`, `cross_dissolve`, `additive_dissolve`, `blur_dissolve`, `morph_cut`, `dip_to_black`, `dip_to_white`, `fade_in_out`, cùng `time_lapse` và `freeze_frame` khi có lý do kể chuyện.

## Typography
- Phông: **Inter** cho mọi chữ (nhấn 700, thân/phụ đề 400–500, tracking hẹp −0.02em ở chữ lớn), theo giao diện thương hiệu Rikkei Edu. Xem `typography/`.
- Màu: trắng ngà, xám nhạt, một màu nhấn ấm (vàng dịu) nếu cần.
- Animation: `fade`, `fade_up` nhẹ; 0.2–0.35 s.

## Âm thanh
- Tiếng nói rõ nhất; nhạc `base_db` −16 đến −18 dBFS, ducking `duck_voice_music`.
- Giữ ambience hiện trường khi chuyển cảnh để tạo cảm giác chân thực.

## Màu
Trung tính, hơi ấm; tương phản vừa; không nhuộm màu mạnh (chưa có tài liệu màu — giữ nguyên màu footage).

## Ví dụ nhịp: tổng kết lễ khai giảng 2 phút
- 0:00–0:08 hook: cú dolly lớp học + câu thông điệp của MC.
- 0:08–0:50 bối cảnh: MC giới thiệu chương trình, xen b-roll học viên (L-cut).
- 0:50–1:40 nội dung chính: diễn giả phát biểu, 2–3 dữ kiện hiện chữ, 3–4 `punch_in_subtle` ở câu then chốt.
- 1:40–2:00 kết: câu khép lại + cảnh rộng, nhạc nâng nhẹ, dừng ở hơi thở trọn.
