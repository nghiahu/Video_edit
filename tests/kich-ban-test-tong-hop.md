# Kịch bản kiểm thử tổng hợp

Mục đích: dựng một lượt các kỹ thuật đã làm để xem bằng mắt có chạy đúng không, thay vì tin vào `validate`. **Toàn bộ chữ trong các clip thử là nội dung minh họa do người viết kịch bản đặt** (không phải lời nói hay thông tin thật trong video); mốc theo từ của đợt 3 là ước lượng (`words_source: estimated`).

## Cách chạy
```powershell
node renderer/cli.js validate --edl projects/test-tong-hop-a/edl.json
node renderer/cli.js validate --edl projects/test-tong-hop-c/edl.json
node renderer/cli.js preview  --edl projects/test-tong-hop-a/edl.json   # → projects/test-tong-hop-a/out/preview.mp4
node renderer/cli.js preview  --edl projects/test-tong-hop-c/edl.json   # → projects/test-tong-hop-c/out/preview.mp4
node renderer/cli.js preview  --edl projects/demo-transitions/edl.json  # phần B: 31 kiểu chuyển cảnh
```
Phần A và C do `scratchpad/gen-test-all.cjs` sinh (ghép các demo đã chạy cho A, mỗi kỹ thuật một preset cho C). Bản **final** của C sẽ bị từ chối vì còn mốc `estimated` (đúng thiết kế).

## Phần A — máy quay, thời gian, màu, âm thanh (`test-tong-hop-a`, ~60 s)
Mỗi nhóm có nhãn nhận diện ở góc trên trái.
| Nhóm | Kỹ thuật | Cần thấy | Cần nghe |
|---|---|---|---|
| A1 · Thời gian, fade | `fade_in_out`, `time_lapse`, `freeze_frame`, `speed_ramp_transition`, `whoosh_synced_cut`, `punch_in` | mờ vào từ đen; đoạn tua nhanh ×4 rồi trở lại; dừng hình 1 s; chuyển tốc độ giữa clip 2 và 3; zoom nhanh giữ nguyên | tiếng whoosh ở chỗ cắt giữa clip 3 và 4 |
| A2 · J/L cut, ducking | `hard_cut`, `j_l_cut`, `audio_ducking`, `punch_in` | cắt gọn; zoom ra lại sau 0,8 s | tiếng clip trước kéo sang cảnh sau (L), tiếng clip sau vào trước hình (J); nhạc nền hạ xuống khi có giọng |
| A3 · Màu, vignette | `color_grade_basic`, `vignette`, `punch_out`, `subtitles` | màu ấm hai clip đầu, góc tối nhẹ, zoom lùi, phụ đề 2 cue (có cảnh báo tốc độ đọc 26,5 ký tự/s ở cue 1) | – |
| A4 · Slow push, dissolve | `slow_push`, `cross_dissolve`, `lower_third` | zoom chậm đều; mờ chồng không nhấp nháy; khối tên + chức danh (nội dung minh họa) | – |
| A5 · Cắt, chữ động | `hard_cut`, `audio_ducking`, `kinetic_text`, `punch_in` | chữ nhấn "Chứng nhận Đại học Bách khoa" hiện đủ, zoom nhẹ | nhạc hạ khi nói |

## Phần B — chuyển cảnh (`demo-transitions`, 31 kiểu)
Xem lần lượt từng chuyển cảnh: không có khung đen thừa, không khựng hay lặp khung, không lộ mép; kiểu "chồng" dùng được tay cầm (cảnh báo khi thiếu tay cầm là bình thường với clip ngắn); thời lượng đúng `duration`.

## Phần C — kỹ thuật chữ đợt 1–5 (`test-tong-hop-c`, ~02:55)
Mỗi kỹ thuật một preset, có nhãn "Đợt N · kỹ thuật" ở góc trên phải (trừ credits và chữ cắt xén phủ khung).
| ID | Thời gian | Đợt | Kỹ thuật | Preset | Cần thấy |
|---|---|---|---|---|---|
| d01 | 00:00–00:05 | Đợt 1 | `text_pill` | `text_pill_clean` | Con nhộng đọc rõ, đúng chữ "Khách mời", không bị cắt |
| d02 | 00:05–00:10 | Đợt 1 | `text_box` | `text_box_dark` | Hộp tối, 2 dòng, lề đều |
| d03 | 00:10–00:15 | Đợt 1 | `stacked_text` | `stacked_small_top` | Hai dòng chồng, dòng nhỏ phía trên, dấu tiếng Việt không chạm dòng trên |
| d04 | 00:15–00:20 | Đợt 1 | `title_card` | `title_card_clean` | Tiêu đề + dòng phụ, nền làm tối |
| d05 | 00:20–00:25 | Đợt 1 | `big_text` | `big_text_solid` | Chữ tràn ngang khung, không tràn quá mép |
| d06 | 00:25–00:30 | Đợt 1 | `marker_highlight` | `marker_yellow` | Vệt bút dạ phủ kín dưới chữ, không nửa vời |
| d07 | 00:30–00:35 | Đợt 2 | `chapter_title` | `chapter_title_editorial` | 2 dòng, số chương nhỏ phía trên, dấu không chạm |
| d08 | 00:35–00:45 | Đợt 2 | `pull_quote` | `pull_quote_editorial` | Dấu ngoặc kép vàng, câu trích, tên ở dòng phụ |
| d09 | 00:45–00:50 | Đợt 2 | `big_number` | `big_number_clean` | Số đếm chạy 0 → 1.250 (dấu chấm ngăn nghìn), có dấu +, nhãn nhỏ bên dưới |
| d10 | 00:50–01:00 | Đợt 2 | `bullet_list_reveal` | `bullet_list_clean` | 3 mục hiện nối tiếp, ký hiệu đầu dòng |
| d11 | 01:00–01:05 | Đợt 2 | `location_tag` | `location_tag_pin` | Biểu tượng ghim + "Hà Nội" trong con nhộng tối |
| d12 | 01:05–01:10 | Đợt 2 | `text_sticker` | `text_sticker_white` | Chữ viền dày, hơi nghiêng |
| d13 | 01:10–01:15 | Đợt 2 | `speech_bubble` | `speech_bubble_white` | Bong bóng thoại có đuôi |
| d14 | 01:15–01:20 | Đợt 2 | `callout_label` | `callout_label_dot` | Nhãn + đường chỉ vẽ dần tới chấm ở giữa khung |
| d15 | 01:20–01:25 | Đợt 2 | `social_tag` | `social_tag_at` | "@rikkeiedu" trong con nhộng đen |
| d16 | 01:25–01:35 | Đợt 4 | `typewriter_text` | `typewriter_title` | Chữ hiện từng ký tự, con trỏ **cùng hàng** với chữ và nhấp nháy, bố cục không nhảy |
| d17 | 01:35–01:40 | Đợt 4 | `scramble_text` | `scramble_decode` | Ký tự nhảy rồi chốt từ trái sang phải thành "DỮ LIỆU" |
| d18 | 01:40–01:45 | Đợt 4 | `glitch_text` | `glitch_cyber` | Nháy 2 lần, dừng cho đọc, nháy lần cuối rồi biến mất (tổng 2,0 s) |
| d19 | 01:45–01:50 | Đợt 4 | `text_cutout` | `cutout_bold` | cutout_bold: nền xanh đen phủ khung, nét chữ cho thấy video; cutout_dive: chữ lao vào rồi hình hiện trọn |
| d20 | 01:50–01:55 | Đợt 4 | `text_cutout` | `cutout_dive` | cutout_bold: nền xanh đen phủ khung, nét chữ cho thấy video; cutout_dive: chữ lao vào rồi hình hiện trọn |
| d21 | 01:55–02:00 | Đợt 4 | `text_on_path` | `path_arc_up` | Chữ chạy dần ra theo cung từ trái sang phải, không hiện đột ngột |
| d22 | 02:00–02:05 | Đợt 5 | `progress_bar` | `progress_bar_pill` | Thanh gradient chạy tới 100%, phần trăm khớp độ dài thanh |
| d23 | 02:05–02:10 | Đợt 5 | `countdown_timer` | `countdown_big` | 3 → 2 → 1 → "GO!", mỗi lần đổi số có nhịp đập |
| d24 | 02:10–02:25 | Đợt 5 | `credits_roll` | `credits_clean` | Chữ trôi từ đáy lên hết đỉnh, mờ dần mép trên và dưới, đề mục vàng, cột "Vai trò | Tên" |
| d25 | 02:25–02:35 | Đợt 5 | `comparison_table` | `table_dark` | Bảng 3 cột, hàng hiện nối tiếp, cột "Cách mới" tô nhấn |
| d26 | 02:35–02:40 | Đợt 3 | `word_highlight` | `word_highlight_pop` | Từ khóa "khóa", "học" chuyển vàng đúng lúc (mốc ước lượng) |
| d27 | 02:40–02:45 | Đợt 3 | `word_by_word_text` | `word_by_word_stack` | Từ hiện nối tiếp và ở lại (mốc ước lượng) |
| d28 | 02:45–02:50 | Đợt 3 | `karaoke_subtitles` | `karaoke_clean` | Từ đang nói sáng vàng, từ đã nói trắng, từ chưa nói mờ (mốc ước lượng) |
| d29 | 02:50–02:55 | Đợt 3 | `shortform_captions` | `shortform_captions_bold` | Cụm 2 từ cực lớn, từ khóa vàng (mốc ước lượng) |

## Tự động (không cần mắt)
- `validate` cả 11 EDL demo + 2 EDL kiểm thử: 0 lỗi.
- `check-docs`: mọi ví dụ EDL trong tài liệu hợp lệ, khóa đúng preset.
- Định dạng `words` sai (chồng mốc, thiếu `words_source`, mốc trước điểm neo) bị `validate` chặn.

## Điều bản kiểm thử này **không** kiểm
- Hoạt ảnh vào/ra của từng kiểu chữ ở mọi preset; chữ tiếng Việt dài ở 1080p/4K.
- Độ khớp mốc theo từ với lời nói thật (cần nhận dạng giọng nói).
- Loudness của bản preview (từng đo −27,4 LUFS ở video khai giảng, chưa chuẩn hóa).
- Bản **final** (chưa từng render ở độ phân giải gốc).
- `tracked_text` (chưa làm).

## Kết quả lượt chạy đầu (đã xem / đo)
- **Phần C:** đã xem 1 khung giữa lúc hiện cho cả 29 preset (khung tĩnh; không xem hoạt ảnh vào/ra). Phát hiện nhãn nhận diện từng đè lên `text_pill` và `location_tag` (cùng góc trên trái) và đã chuyển nhãn sang góc trên phải, xem lại hai preset này đã đủ chữ.
- **Phần A:** đo `fade_in_black` (độ sáng 0 → ~124 trong 1 s) và `freeze_frame` (đứng hình 1,03 s) bằng ffmpeg; xem nhãn, phụ đề, khối tên và chữ nhấn. **Chưa xác nhận bằng mắt:** `time_lapse`, `speed_ramp_transition`, `whoosh_synced_cut`, `j_l_cut`, `audio_ducking`, màu và vignette (khung 2 giây một lần không đủ thấy). Âm thanh có tiếng, trung bình −37,9 dB, đỉnh −15,4 dB (chưa chuẩn hóa).
- **Phần B:** quét tự động, không có đứng hình; chỉ một đoạn đen 0,13 s ở ~12 s đúng với `dip_to_black`. Chưa xem từng chuyển cảnh bằng mắt trong lượt này.
