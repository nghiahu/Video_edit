# Chọn hiệu ứng

Đọc file này ở **pha 3 (truy xuất kiến thức)**, trước khi mở từng tài liệu kỹ thuật. Mục đích: đi từ **nhu cầu nội dung** tới **kỹ thuật và preset phù hợp**, không đi từ "hiệu ứng nào đẹp".

> Mọi bảng dưới đây là hướng dẫn chọn (`confidence: low`, theo quy ước). Quyết định cuối vẫn phải qua `core/decision-engine.md`. Hiệu ứng nào chưa được xem bằng mắt trên preview thì đã ghi trong tài liệu kỹ thuật tương ứng và trong `tests/kich-ban-test-tong-hop.md`.

> **Zoom đang tắt mặc định (`R-ZOOM-0`):** mọi chỗ trong file này nhắc `punch_in`, `punch_out`, `slow_push` chỉ để tra cứu. **Không tự chọn** chúng; chỉ dùng khi người dùng yêu cầu rõ. Mặc định là cắt thẳng.

## 1. Ba câu hỏi trước khi chọn
1. **Người xem cần gì ở khoảnh khắc này?** Hiểu một dữ kiện, nhớ một người, thấy thời gian trôi, bị cuốn theo nhịp, hay không cần gì cả. Không cần gì cả thì **không thêm hiệu ứng**.
2. **Cái gì đã có sẵn trong cảnh?** Chữ trên hình (`on_screen_text`), chuyển động camera sẵn có, tiếng động quan trọng. Không chồng lên chúng.
3. **Style và ngân sách còn cho phép không?** Tra `styles/<style>.md`. Style chưa có file thì hỏi người dùng, đừng tự giả định.

Thứ tự ưu tiên khi xung đột: Storytelling > Clarity > Rhythm > Style > Decoration.

## 2. Chọn theo nhu cầu nội dung

| Nhu cầu | Kỹ thuật (preset mặc định) | Điều kiện / lưu ý |
|---|---|---|
| Nhấn một câu quan trọng của người nói | `punch_in` (`punch_in_subtle`) | Khung chưa cận (R-EMP-3), người nói không cử động mạnh; không hai lần cách < 6 s |
| Nhấn một dữ kiện (số, tên, mốc) | `kinetic_text`, hoặc `big_number` nếu là con số cần đếm | Dữ kiện có trong lời thoại hoặc metadata, không tự thêm |
| Giới thiệu người nói lần đầu | `lower_third` (`lower_third_editorial`) | Chỉ lần đầu, 3–5 s; tên và chức danh phải **có nguồn**, nếu chưa biết ghi "Tên minh họa" và báo người dùng |
| Đánh dấu chương, mốc nội dung | `chapter_title`, `title_card` | Chỉ khi video có cấu trúc chương rõ; không dùng làm đệm |
| Trích một câu đáng nhớ | `pull_quote` | Câu phải đúng nguyên văn trong `speech`; confidence thấp thì không trích |
| Liệt kê 2–6 ý | `bullet_list_reveal` | Mỗi mục ≤ 8 từ; ý lấy từ nội dung, không bịa |
| Địa điểm, ngày giờ | `location_tag` | Lấy từ metadata hoặc người dùng; không suy ra |
| So sánh hai ba phương án | `comparison_table` | 2–4 cột, ô ≤ 5 từ, dữ liệu do người dùng cung cấp |
| Phụ đề lời thoại | `subtitles` (`subtitles_standard`) | **Mặc định cho lời thoại**; chỉ khi có nguyên văn đáng tin kèm mốc thời gian |
| Lời nói cần theo từng từ (karaoke, tô từ khóa) | `karaoke_subtitles`, `word_highlight`, `word_by_word_text`, `shortform_captions` | **Chỉ khi có mốc từng từ thật** (nhận dạng giọng nói, thủ công hoặc file phụ đề). Mốc `estimated` chỉ để thử, bản cuối bị chặn |
| Nhấn một chỗ trong cảnh | `callout_label` | Chỉ vào **vật hoặc chữ**, không chỉ vào mặt người; cố định, không bám chuyển động |
| Báo tiến độ hoặc đếm lùi | `progress_bar`, `countdown_timer` | Có dữ liệu thật để đặt `progress_to`; đếm ngược cần hold đủ |
| Cuối phim, danh sách người | `credits_roll` | Danh sách do người dùng cung cấp; tốc độ ≤ 2,5 dòng/giây |
| Gây ấn tượng ở mở đầu | `text_cutout` (`cutout_dive` cho cảnh quay tiến vào), `glitch_text`, `typewriter_text` | Style mạnh; **không dùng ở documentary** trừ `typewriter_clean`/`typewriter_title` |
| Chữ có tính cách (vui, dễ thương) | `text_sticker`, `speech_bubble`, `social_tag` | Style vui; không dùng ở documentary |

### 2b. Chọn theo loại cảnh (cảnh nào dùng gì)
Đọc bảng theo từng cảnh trong kịch bản. Mặc định mỗi ô là **không có gì**; chỉ thêm khi có lý do nội dung. Zoom chi tiết: `techniques/camera-motion/zoom-guide.md`.

| Loại cảnh | Camera / zoom | Vào và ra cảnh | Chữ | Âm thanh |
|---|---|---|---|---|
| Mở đầu, toàn cảnh không gian (b-roll tĩnh) | `slow_push_subtle` cả clip | `fade_in_out` (mở từ đen) hoặc cắt thẳng | `title_card`/`lower_third` nhỏ, **không đè chủ thể** | Giữ tiếng không gian, nhạc nền nhỏ |
| Cảnh mở đã có camera chuyển động (dolly, drone tiến vào) | **Không thêm zoom** | Cắt thẳng | `text_cutout` + `cutout_dive` nếu style mạnh (cùng hướng chuyển động) | – |
| Người nói, khung trung, câu thường | Không zoom | `hard_cut`, `j_l_cut` nối câu | Phụ đề hoặc không chữ | Giữ tiếng gốc |
| Người nói, khung trung, **câu then chốt** | `punch_in_subtle` (1 lần) | Không đổi | `kinetic_text` nếu có dữ kiện; không cả zoom lẫn chữ lớn (R-FREQ-4) | `audio_ducking` nếu có nhạc |
| Người nói, khung cận (mặt > 40% chiều cao) | **Không zoom** | Cắt thẳng | Chữ nhỏ ở góc, hoặc không chữ | Giữ tiếng gốc |
| Giới thiệu người nói lần đầu | Không | Không | `lower_third` 3–5 s | – |
| Dữ kiện, con số | Không | Không | `big_number` hoặc `kinetic_text` đặt dưới/bên cạnh người | – |
| Phản ứng học viên, b-roll che chỗ nối | Tĩnh, hoặc `slow_push_subtle` nếu ≥ 4 s | `j_l_cut`: giữ lời trên hình phản ứng | Không | Giữ lời diễn giả (L-cut) |
| Đổi chương, trôi thời gian | Không zoom | `cross_dissolve`, `dip_to_black`, `dip_to_white` | `chapter_title` | Nhạc/chuyển tiếng nhẹ |
| Khoảnh khắc cảm xúc (vỗ tay, lời chúc) | Giữ khung hoặc `slow_push_subtle` | Cắt thẳng | Không | Giữ nguyên tiếng vỗ tay |
| Cảnh đông người, nhiều chuyển động | Không zoom | Cắt thẳng | Chữ nhỏ ở lề nếu cần | – |
| Cảnh có chữ quan trọng trên hình (slide, bảng hiệu) | **Không zoom** (cắt mất mép chữ) | Cắt thẳng | Không đè lên chữ có sẵn | – |
| Kết video | `punch_out_subtle` hoặc `slow_push_subtle` | `dip_to_black`/`fade_out_black` | `credits_roll` nếu có danh sách | Nhạc kết, âm lượng giảm dần |

Cách dùng: với mỗi cảnh trong bảng cảnh của kịch bản, ghi vào cột "kỹ thuật dự kiến" ô tương ứng; cảnh nào không thuộc dòng nào thì để cắt thẳng, không hiệu ứng.

### Chữ: quy tắc vị trí (R-SUBJ-1)
- **Không đặt chữ lên mặt, thân chủ thể chính.** Khai báo `subject_box` cho clip để `validate` cảnh báo.
- Cảnh rộng, chủ thể giữa khung: chữ nằm **dưới** hoặc **hai bên**; tránh `center`.
- Cảnh cận: chữ nhỏ ở góc dưới, hoặc bỏ chữ.
- Chữ phủ giữa khung (`text_cutout`, `big_text`, kiểu `scramble`/`glitch` cỡ lớn) chỉ dùng trên cảnh **không có chủ thể** (b-roll, cảnh trống, cảnh chuyển) hoặc có chủ ý ghi trong `reason`.
- Callout có đường chỉ: tránh cắt qua người nói; điểm chỉ nằm ngoài chủ thể.

## 3. Chọn chuyển cảnh theo ý nghĩa

Mặc định là **cắt thẳng** (`hard_cut`). Chuyển cảnh đặc biệt chỉ khi có ý nghĩa. Bảng đầy đủ theo ý đồ: `techniques/transitions/index.md`; mỗi kỹ thuật có tài liệu riêng trong cùng thư mục.

| Ý nghĩa | Gợi ý | Tránh |
|---|---|---|
| Trôi thời gian, đổi địa điểm, mở/kết | `cross_dissolve`, `dip_to_black`, `fade_in_out` | Dùng dissolve giữa hai cảnh có cùng nhịp liên tục |
| Hai cảnh cùng chủ đề, nối liền mạch | `hard_cut` + `j_l_cut` | Chuyển cảnh trang trí che chỗ nối |
| Bỏ quãng lặng hoặc từ đệm trong cùng một khung | `morph_cut` (hoặc cắt nhảy) | Khung đổi nhiều giữa hai đoạn |
| Đổi chương, nhấn nhịp | `dip_to_white`, `blur_dissolve` | Dùng liên tiếp |
| Năng lượng, vui, nhanh | `whip_pan`, `slide`, `push`, `swipe`, `zoom_transition` | Ở style trang trọng |
| Phong cách số, công nghệ | `glitch`, `rgb_split`, `pixelate_mosaic`, `shake_transition` | Hai kiểu liền nhau; nhấp nháy mạnh (`flash_strobe` ≤ 3 lần/giây) |
| Hoài niệm, cinema | `light_leak`, `film_burn`, `vhs_distortion` | Footage hiện đại, mood nghiêm túc |
| Cuối đoạn có chữ | `text_graphic_wipe` | Chữ dài, đè người |

Quy tắc chung: không hai chuyển cảnh đặc biệt cách nhau < 3 s (`TRANSITION_GAP_SEC`); kiểu "chồng" cần tay cầm ở hai clip.

## 4. Chọn theo cường độ phong cách

`documentary` có style file đầy đủ; `social-edu` (`styles/social-edu.md`) có file nhưng chỉ rút từ hai video mẫu (tin cậy thấp). Các bậc dưới là điểm xuất phát; style khác chưa có file thì **hỏi người dùng**, và ghi `confidence: low`.

| Bậc | Dùng cho | Chuyển cảnh | Chữ | Chuyển động | Ghi chú |
|---|---|---|---|---|---|
| 0 — Không hiệu ứng | Lời nhân chứng, khoảnh khắc cảm xúc | `hard_cut` | Phụ đề nếu cần | Không | Mặc định cho đoạn quan trọng |
| 1 — Tiết chế (documentary) | Sự kiện trang trọng, phỏng vấn, giới thiệu chương trình | `hard_cut`, `cross_dissolve`, `dip_to_black`, `j_l_cut` | Danh sách mục 5 | `*_subtle` | Ngân sách ở `styles/documentary.md` |
| 2 — Vừa | Tổng kết sự kiện sôi động, video giới thiệu | Thêm `whip_pan`, `slide`, `push` | Thêm `big_number`, `text_box`, `callout_label` | `punch_in_standard`, `time_lapse` | Chưa có style file: đề xuất và hỏi |
| 3 — Mạnh | Video ngắn, mở đầu bắt mắt, nội dung vui | Thêm kiểu số và hoài niệm | Thêm sticker, glitch, cutout, shortform | `punch_in` mạnh, `speed_ramp` | Chưa có style file; **cần người dùng chọn rõ**, và vẫn né chủ thể |

## 5. Preset hợp style documentary
Danh sách sinh từ `presets/*.json` (preset có `forbidden_styles` chứa `documentary` bị loại), tính đến lúc viết:

| Kỹ thuật | Preset cho phép |
|---|---|
| `color_grade_basic` | `grade_neutral_clean`, `grade_warm_documentary` |
| `vignette` | `vignette_subtle` |
| `punch_in` | `punch_in_subtle` |
| `punch_out` | `punch_out_subtle` |
| `slow_push` | `slow_push_subtle` |
| `audio_ducking` | `duck_voice_music`, `duck_voice_music_deep`, `duck_voice_music_light` |
| `time_lapse` | `time_lapse_8x`, `time_lapse_4x` |
| `freeze_frame` | `freeze_hold_1s`, `freeze_hold_2s` |
| `hard_cut` | `cut_hard` |
| `j_l_cut` | `l_cut_standard`, `j_cut_standard` |
| `cross_dissolve` | `dissolve_standard`, `dissolve_short` |
| `additive_dissolve` | `additive_dissolve_soft` |
| `blur_dissolve` | `blur_dissolve_soft` |
| `morph_cut` | `morph_cut_quick` |
| `dip_to_black` | `dip_to_black_standard`, `dip_to_black_quick` |
| `dip_to_white` | `dip_to_white_standard`, `dip_to_white_quick` |
| `fade_in_out` | `fade_in_black`, `fade_out_black`, `fade_out_white` |
| `kinetic_text` | `kinetic_text_editorial`, `kinetic_text_minimal` |
| `subtitles` | `subtitles_standard`, `subtitles_clean` |
| `lower_third` | `lower_third_editorial`, `lower_third_minimal` |
| `text_pill` | `text_pill_clean`, `text_pill_outline` |
| `text_box` | `text_box_dark`, `text_box_bar`, `text_box_underline` |
| `stacked_text` | `stacked_small_top`, `stacked_small_bottom` |
| `title_card` | `title_card_clean`, `title_card_blur`, `title_card_editorial` |
| `chapter_title` | `chapter_title_editorial`, `chapter_title_bar` |
| `pull_quote` | `pull_quote_editorial`, `pull_quote_clean` |
| `big_number` | `big_number_clean`, `big_number_card` |
| `bullet_list_reveal` | `bullet_list_clean`, `bullet_list_numbered`, `bullet_list_check` |
| `location_tag` | `location_tag_pin`, `location_tag_date`, `location_tag_clock` |
| `callout_label` | `callout_label_dot` |
| `typewriter_text` | `typewriter_clean`, `typewriter_title` |
| `progress_bar` | `progress_bar_thin` |
| `credits_roll` | `credits_clean`, `credits_cinema` |
| `comparison_table` | `table_clean` |
| `word_highlight` | `word_highlight_clean` |

Kỹ thuật **không có preset nào** cho documentary: các chuyển cảnh đặc biệt (whip, slide, wipe, glitch, light leak…), `whoosh_synced_cut`, `speed_ramp_transition`, `big_text`, `marker_highlight`, `text_sticker`, `speech_bubble`, `social_tag`, `scramble_text`, `glitch_text`, `text_cutout`, `text_on_path`, `countdown_timer`, `word_by_word_text`, `karaoke_subtitles`, `shortform_captions`.

## 6. Dấu hiệu chọn sai
- Hai hiệu ứng khác loại cùng nhấn một khoảnh khắc (zoom + chữ + chuyển cảnh): giữ một.
- Hiệu ứng lặp lại cùng một kiểu quá 3 lần trong video ngắn.
- Chữ nằm trên mặt hoặc thân người nói, hoặc trên chữ có sẵn trong cảnh.
- Chuyển cảnh đặc biệt giữa hai cảnh cùng nhịp liền mạch (cắt thẳng tốt hơn).
- Chữ theo từng từ mà mốc là ước lượng.
- Chữ trên hình có nội dung không truy ngược được về lời nói, metadata hoặc lời người dùng.
- Preview phải xem lại: hoạt ảnh vào/ra, độ đọc được của chữ ở kích thước thật, nhịp.

## 7. Kiểm tra sau khi chọn
1. Mỗi quyết định có `reason` gắn với nội dung (bước 1 của Decision Engine).
2. `validate` không lỗi; xem kỹ cảnh báo về chủ thể, hold, mốc từ.
3. Render preview, xem khung ở vài thời điểm cho mọi khối chữ (đặc biệt lúc chữ hiện đủ và lúc đang hiện).
4. Ghi trong báo cáo QC những gì **chưa xem** hoặc **chưa nghe** (tôi không nghe được âm thanh; nhờ người dùng nghe).
