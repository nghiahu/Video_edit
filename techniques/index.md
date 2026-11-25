# Danh mục kỹ thuật

ID dưới đây là khóa chung: tài liệu kỹ thuật, preset, EDL, quy tắc quyết định và reference đều tham chiếu cùng ID. Thêm kỹ thuật mới thì thêm vào đây trước.

Trạng thái: `usable` = có tài liệu đầy đủ theo khuôn; `planned` = chưa viết.
Cột **Cách thực hiện**: `renderer` = có quyết định riêng trong EDL và renderer dựng hình/tiếng; `mẫu` = pattern thực hiện bằng cách sắp xếp clip và điểm nối, không có quyết định riêng trong EDL.

## 01. Camera & Motion — `techniques/camera-motion/`
| ID | Mô tả ngắn | Cách thực hiện | Trạng thái |
|---|---|---|---|
| `punch_in` | Phóng nhanh để nhấn mạnh một câu hoặc biểu cảm | renderer | usable |
| `punch_out` | Lùi ra để mở không gian, kết thúc ý | renderer | usable |
| `slow_push` | Đẩy chậm liên tục tạo cảm xúc | renderer | usable |
| `camera_shake` | Rung nhẹ tạo năng lượng | – | planned |

(Whip pan, whip tilt, zoom, spin, camera roll dùng làm chuyển cảnh nên nằm ở nhóm 03.)

## 02. Typography & Text Motion — `techniques/typography/`
| ID | Mô tả ngắn | Cách thực hiện | Trạng thái |
|---|---|---|---|
| `kinetic_text` | Chữ xuất hiện có chuyển động để nhấn ý | renderer | usable |
| `lower_third` | Thanh tên/chức danh dưới màn hình | renderer | usable |
| `subtitles` | Phụ đề dễ đọc (cần nguyên văn đáng tin) | renderer | usable |
| `text_pill` | Con nhộng: nhãn ngắn trong hộp bo tròn | renderer | usable |
| `text_box` | Hộp/băng/vạch chữ, gạch chân | renderer | usable |
| `stacked_text` | Hai dòng trên dưới, so le, xếp ngăn căn đều | renderer | usable |
| `title_card` | Tiêu đề lớn giữa màn hình trên nền tối/mờ/đặc | renderer | usable |
| `big_text` | Chữ cực lớn khớp bề ngang khung | renderer | usable |
| `marker_highlight` | Vệt bút dạ sau chữ hoặc từ khóa | renderer | usable |
| `chapter_title` | Số chương nhỏ + tên chương lớn | renderer | usable |
| `pull_quote` | Trích dẫn có dấu ngoặc kép lớn, tên người nói | renderer | usable |
| `big_number` | Số liệu nổi bật, đếm chạy, nhãn nhỏ | renderer | usable |
| `bullet_list_reveal` | Danh sách hiện từng mục | renderer | usable |
| `location_tag` | Nhãn địa điểm/ngày giờ có biểu tượng | renderer | usable |
| `text_sticker` | Nhãn dán: viền dày, bóng cứng, nghiêng | renderer | usable |
| `speech_bubble` | Bong bóng thoại có đuôi | renderer | usable |
| `callout_label` | Nhãn có đường chỉ tới một điểm cố định | renderer | usable |
| `social_tag` | Tag @tên hoặc #chủ_đề | renderer | usable |
| `typewriter_text` | Chữ đánh máy từng ký tự, con trỏ tuỳ chọn | renderer | usable |
| `scramble_text` | Chữ giải mã: ký tự nhảy rồi chốt đúng từ trái sang phải | renderer | usable |
| `glitch_text` | Chữ nhiễu glitch (lệch kênh màu, rung, dải cắt lệch) | renderer | usable |
| `text_cutout` | Chữ cắt xén: nền màu phủ khung, nhìn xuyên nét chữ thấy video; preset `cutout_dive` lao vào chữ cho cảnh mở đầu tiến tới | renderer | usable |
| `text_on_path` | Chữ chạy theo cung, sóng hoặc vòng tròn | renderer | usable |
| `progress_bar` | Thanh tiến độ có nhãn và phần trăm | renderer | usable |
| `countdown_timer` | Đếm ngược số lớn hoặc đồng hồ mm:ss | renderer | usable |
| `credits_roll` | Cuộn tên, danh sách cuối phim | renderer | usable |
| `comparison_table` | Bảng so sánh 2–4 cột, hàng hiện nối tiếp | renderer | usable |
| `strike_list` | Danh sách gạch ngang có hoạt ảnh (bác bỏ niềm tin sai) | renderer | usable |
| `compare_cards` | Thẻ so sánh A vs B, thẻ thắng bật sáng | renderer | usable |
| `draw_annotation` | Mũi tên, vòng khoanh, gạch chân vẽ tay tự vẽ | renderer | usable |
| `social_cta` | Nút Follow được bấm, ô bình luận gõ chữ | renderer | usable |
| `image_float` | Ảnh kết quả bay quanh người nói (quạt, quỹ đạo, dải, lưới) | renderer | usable |
| `tracked_text` | Chữ ghim theo vật chuyển động (cần tracking) | – | planned |
| `word_highlight` | Từ khóa sáng lên đúng lúc được nói (cần mốc theo từ) | renderer | usable |
| `word_by_word_text` | Hiện từng từ theo lời (cần mốc theo từ) | renderer | usable |
| `karaoke_subtitles` | Phụ đề, từ đang nói sáng lên (cần mốc theo từ) | renderer | usable |
| `shortform_captions` | Phụ đề 1–3 từ cực lớn, từ khóa đổi màu (cần mốc theo từ) | renderer | usable |

Danh sách kế hoạch các kiểu bố cục và kiểu chữ (chưa làm, chia theo đợt): `techniques/typography/layout-catalog.md`. ID dự kiến:
- Đợt 0 và 1: **đã làm** (lớp kiểu chữ dùng chung, `text_pill`, `text_box`, `stacked_text`, `title_card`, `big_text`, `marker_highlight`).
- Đợt 2: **đã làm** (`chapter_title`, `pull_quote`, `big_number`, `bullet_list_reveal`, `location_tag`, `text_sticker`, `speech_bubble`, `callout_label`, `social_tag`).
- Đợt 3: **đã làm phần hiển thị** (`word_highlight`, `word_by_word_text`, `karaoke_subtitles`, `shortform_captions`); **cần mốc theo từ thật** (nhận dạng giọng nói, thủ công hoặc file phụ đề) — chưa có công cụ lấy mốc trong máy.
- Đợt 4: **đã làm** (`typewriter_text`, `scramble_text`, `glitch_text`, `text_cutout`, `text_on_path`); `vertical_text` chưa làm (chữ dọc dùng tạm `rotate`).
- Đợt 5: **đã làm** (`comparison_table`, `credits_roll`, `countdown_timer`, `progress_bar`); `tracked_text` còn `planned` (cần công cụ theo dõi chuyển động).
`tracked_text` ở trạng thái `planned`.

## 03. Transitions — `techniques/transitions/`
Chi tiết chọn kiểu: `techniques/transitions/index.md`.

**Kiểu cắt (không hiệu ứng hình)**
| ID | Mô tả ngắn | Cách thực hiện |
|---|---|---|
| `hard_cut` | Cắt thẳng, mặc định | renderer |
| `j_l_cut` | Tách tiếng và hình ở điểm nối | renderer |
| `jump_cut` | Bỏ đoạn giữa cùng một khung | mẫu |
| `cut_on_action` | Cắt đúng lúc có hành động | mẫu |
| `smash_cut` | Cắt đột ngột từ yên sang ồn hoặc ngược lại | mẫu |
| `match_cut` | Cắt khớp hình, chuyển động hoặc ý | mẫu |
| `graphic_match` | Khớp hình dạng, màu, bố cục giữa hai khung | mẫu |
| `cross_cut` | Cắt xen hai mạch song song | mẫu |
| `cutaway_insert` | Cảnh chèn (cầu nối tới `b_roll_insert`) | mẫu |
| `object_wipe` | Vật thể che kín ống kính rồi cắt | mẫu |
| `sound_bridge` | Tiếng cảnh này nối sang cảnh sau | mẫu |

**Mờ và hòa trộn**
| ID | Mô tả ngắn | Cách thực hiện |
|---|---|---|
| `cross_dissolve` | Mờ chồng, trôi thời gian | renderer |
| `additive_dissolve` | Mờ chồng cộng sáng (film dissolve) | renderer |
| `blur_dissolve` | Mờ chồng kèm nhòe | renderer |
| `morph_cut` | Xấp xỉ morph cut bằng mờ chồng cực ngắn (không phải morph quang học) | renderer |
| `dip_to_black` | Xuống đen rồi lên cảnh mới | renderer |
| `dip_to_white` | Chói trắng rồi lên cảnh mới | renderer |
| `fade_in_out` | Mở/kết video từ/xuống một màu (cả tiếng) | renderer |

**Chuyển động**
| ID | Mô tả ngắn | Cách thực hiện |
|---|---|---|
| `whip_pan` | Quay ngang nhanh | renderer |
| `whip_tilt` | Quay dọc nhanh | renderer |
| `slide` | Cảnh mới trượt đè lên | renderer |
| `push` | Cảnh mới đẩy cảnh cũ ra | renderer |
| `swipe` | Cảnh cũ vuốt đi để lộ cảnh mới | renderer |
| `wipe` | Quét theo hướng, mép cứng hoặc mềm | renderer |
| `zoom_transition` | Phóng nhanh xuyên qua điểm cắt | renderer |
| `spin_rotate` | Xoay và phóng | renderer |
| `camera_roll` | Nghiêng camera nhẹ | renderer |
| `parallax_transition` | Hai lớp trượt tốc độ khác nhau | renderer |

**Che hoặc lộ hình**
| ID | Mô tả ngắn | Cách thực hiện |
|---|---|---|
| `mask_reveal` | Lộ cảnh mới từ một điểm, mép mềm | renderer |
| `iris_wipe` | Mống mắt mở/đóng | renderer |
| `clock_wipe` | Quét như kim đồng hồ | renderer |
| `split_barn_door` | Cánh cửa mở/đóng | renderer |
| `luma_wipe` | Quét theo dải sáng (chéo, mành, tỏa tròn) | renderer |
| `shape_reveal` | Lộ cảnh trong hình nở dần (thoi, lục giác, sao…) | renderer |
| `text_graphic_wipe` | Tấm màu (kèm chữ) quét qua khung | renderer |

**Hiệu ứng số**
| ID | Mô tả ngắn | Cách thực hiện |
|---|---|---|
| `glitch` | Nhiễu tín hiệu | renderer |
| `rgb_split` | Tách kênh màu | renderer |
| `flash_strobe` | Chớp sáng, strobe | renderer |
| `light_leak` | Rò sáng ấm | renderer |
| `film_burn` | Cháy phim | renderer |
| `vhs_distortion` | Méo băng VHS | renderer |
| `pixelate_mosaic` | Vỡ hạt vuông | renderer |
| `shake_transition` | Rung mạnh rồi cắt | renderer |

## 04. Motion Graphics — `techniques/motion-graphics/`
`callout`, `circle_highlight`, `ui_overlay` — planned.

## 05. Color & Visual Treatment — `techniques/color/`
| ID | Mô tả ngắn | Cách thực hiện | Trạng thái |
|---|---|---|---|
| `color_grade_basic` | Cân bằng sáng, tương phản, bão hòa, ấm/lạnh; mục tiêu nhất quán | renderer | usable |
| `vignette` | Tối nhẹ viền khung để dồn mắt vào giữa | renderer | usable |
| `film_grain` | Hạt phim | – | planned |

## 06. Sound Design — `techniques/sound/`
| ID | Mô tả ngắn | Cách thực hiện | Trạng thái |
|---|---|---|---|
| `audio_ducking` | Hạ nhạc nền khi có tiếng nói | renderer | usable |
| `whoosh_synced_cut` | SFX (whoosh, impact) gắn vào điểm cắt, file do người dùng cung cấp | renderer | usable |
| `sfx_cue` | SFX từ thư viện `assets/sfx` (mã file), tiếng "đập" rơi đúng mốc anchor | renderer | usable |
| `impact`, `riser`, `ambience` | SFX khác | – | planned |

## 07. Compositing — `techniques/compositing/`
`split_screen` — planned. (Mask reveal đã chuyển sang nhóm 03.)

## 08. Storytelling & Pacing — `techniques/storytelling/`
| ID | Mô tả ngắn | Cách thực hiện | Trạng thái |
|---|---|---|---|
| `b_roll_insert` | Chèn cảnh minh họa | mẫu | usable |
| `montage` | Chuỗi cảnh ngắn dồn ý hoặc thời gian | mẫu | usable |
| `beat_sync_cut` | Cắt theo nhịp nhạc (cần mốc nhịp do người dùng cung cấp) | mẫu | usable |
| `time_lapse` | Tua nhanh một đoạn | renderer | usable |
| `layout_cards` | Luân phiên bố cục: thẻ màn hình + thẻ mặt trên nền mờ (khung dọc) | renderer | usable |
| `freeze_frame` | Đóng băng khung hình | renderer | usable |
| `speed_ramp_transition` | Tăng tốc cuối clip A, giảm tốc đầu clip B | renderer | usable |

---

Mỗi nhóm có file `index.md` riêng liệt kê kỹ thuật để AI chọn đúng tài liệu rồi mới đọc: `camera-motion`, `typography`, `transitions`, `color`, `sound`, `storytelling`.

Khi một kiểu **không** hợp style đang chọn (ví dụ documentary cấm hầu hết hiệu ứng trang trí), xem `forbidden_styles` trong preset và `styles/<style>.md`.
