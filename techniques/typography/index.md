# Typography & Text Motion — chọn kỹ thuật

**Bắt buộc đọc trước khi thêm chữ:** `typography/font-catalog.md`, `typography/hierarchy.md`.

| Nhu cầu | Kỹ thuật | Tài liệu |
|---|---|---|
| Nhấn ý quan trọng hoặc dữ kiện cụ thể bằng cụm 3–6 từ | `kinetic_text` | `kinetic-text.md` |
| Tên và chức danh người nói, lần đầu xuất hiện | `lower_third` | `lower-third.md` |
| Nhãn ngắn trong hộp bo tròn (con nhộng) | `text_pill` | `text-pill.md` |
| Chữ trong hộp, băng, vạch, gạch chân | `text_box` | `text-box.md` |
| Hai dòng trên dưới, so le, xếp ngăn căn đều | `stacked_text` | `stacked-text.md` |
| Tiêu đề lớn giữa màn hình trên nền tối/mờ/đặc | `title_card` | `title-card.md` |
| Chữ cực lớn khớp bề ngang khung | `big_text` | `big-text.md` |
| Vệt bút dạ sau chữ hoặc từ khóa | `marker_highlight` | `marker-highlight.md` |
| Đổi chương: số chương nhỏ + tên chương lớn | `chapter_title` | `chapter-title.md` |
| Trích dẫn nguyên văn có dấu ngoặc kép, tên người nói | `pull_quote` | `pull-quote.md` |
| Số liệu nổi bật có đếm chạy (số có nguồn) | `big_number` | `big-number.md` |
| Danh sách 2–6 mục hiện nối tiếp | `bullet_list_reveal` | `bullet-list-reveal.md` |
| Nhãn địa điểm, ngày giờ có biểu tượng | `location_tag` | `location-tag.md` |
| Nhãn dán vui (viền dày, nghiêng) | `text_sticker` | `text-sticker.md` |
| Bong bóng thoại có đuôi | `speech_bubble` | `speech-bubble.md` |
| Chú thích có đường chỉ tới điểm cố định | `callout_label` | `callout-label.md` |
| Tag `@tên` hoặc `#chủ_đề` | `social_tag` | `social-tag.md` |
| Chữ đánh máy từng ký tự | `typewriter_text` | `typewriter-text.md` |
| Chữ giải mã (ký tự nhảy rồi chốt) | `scramble_text` | `scramble-text.md` |
| Chữ nhiễu glitch | `glitch_text` | `glitch-text.md` |
| Chữ cắt xén nhìn xuyên thấy video | `text_cutout` | `text-cutout.md` |
| Chữ theo cung, sóng, vòng tròn | `text_on_path` | `text-on-path.md` |
| Thanh tiến độ có nhãn và phần trăm | `progress_bar` | `progress-bar.md` |
| Đếm ngược số lớn hoặc đồng hồ | `countdown_timer` | `countdown-timer.md` |
| Cuộn tên, danh sách cuối phim | `credits_roll` | `credits-roll.md` |
| Bảng so sánh (hàng thêm theo mốc, ô đổi nội dung) | `comparison_table` | `comparison-table.md` |
| Danh sách gạch ngang | `strike_list` | `strike-list.md` |
| Thẻ so sánh A vs B | `compare_cards` | `compare-cards.md` |
| Mũi tên, vòng khoanh vẽ tay | `draw_annotation` | `draw-annotation.md` |
| Nút Follow, ô bình luận | `social_cta` | `social-cta.md` |
| Ảnh bay quanh người nói | `image_float` | `image-float.md` |
| Từ khóa sáng lên đúng lúc được nói | `word_highlight` | `word-highlight.md` |
| Hiện từng từ theo lời | `word_by_word_text` | `word-by-word-text.md` |
| Phụ đề karaoke (từ đang nói sáng) | `karaoke_subtitles` | `karaoke-subtitles.md` |
| Phụ đề 1–3 từ cực lớn | `shortform_captions` | `shortform-captions.md` |
| Phụ đề lời nói (chỉ khi có nguyên văn đáng tin kèm mốc thời gian) | `subtitles` | `subtitles.md` |

Kiểu chữ dùng chung (màu, viền, bóng, glow, hộp, hoạt ảnh) và cách tạo preset chữ mới: `typography/text-style-layer.md`. Kế hoạch các đợt còn lại (số liệu, trích dẫn, phụ đề từng từ...): `layout-catalog.md`.

## Cách chọn nhanh
- Câu có số liệu/tên/mốc → `kinetic_text`.
- Người nói xuất hiện lần đầu và đã biết chắc tên, chức danh → `lower_third` (một lần mỗi người).
- Chữ dài hơn 6 từ → không phải chữ nhấn, dùng phụ đề.
- Mọi quyết định chữ phải qua `R-TXT-1/2/3`.
