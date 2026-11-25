# Lớp kiểu chữ dùng chung (đợt 0)

Sáu kỹ thuật chữ đợt 1 (`text_pill`, `text_box`, `stacked_text`, `title_card`, `big_text`, `marker_highlight`) và chín kỹ thuật đợt 2 (mục 7) cùng dùng một bộ dựng `renderer/src/TextBlock.jsx`. Kiểu chữ không nằm trong code từng kỹ thuật mà nằm trong **preset**, kế thừa một khối nền. Tài liệu này nói khối nền có gì, mỗi khóa làm gì, và cách thêm preset cho một style mới. Kế hoạch tổng: `techniques/typography/layout-catalog.md`. Đây là tài liệu tham chiếu, không theo khuôn 10 mục.

## 1. Cơ chế `extends` và khối nền `_text_style_base`
- Trong `presets/typography-presets.json`, khóa bắt đầu bằng `_` là chú thích hoặc khối nền. `loadPresets` (`renderer/lib/edl.mjs`) gom mọi khóa `_xxx` có trường `parameters` vào bảng `bases`, **không** coi là preset dùng được.
- Preset có `"extends": "_text_style_base"` được nạp thành `parameters = { ...base.parameters, ...preset.parameters }`: khóa trong preset ghi đè khối nền. Khối nền không tồn tại thì `loadPresets` ném lỗi.
- Khi render: `mergeParams` = preset (đã trộn với nền) ghi đè bởi `decision.parameters`. Khóa lạ trong `decision.parameters` bị `validate` chặn, trừ các khóa nội dung `text`, `hold`, `name`, `title`, `cues`, `file`, `lines`, `sub_text`, `highlight_words`, `value` (`CONTENT_KEYS`).
- Vì khối nền chứa **mọi** khóa, một khóa chỉ hợp lệ trong EDL nếu có ở khối nền (hoặc preset). `schema/preset.md` mô tả hợp đồng preset chung; `extends` là mở rộng của lớp này.
- Preset ghi **chỉ phần khác nền** (xem mục 6). Cỡ chữ tính cho 1080p, nhân `height/1080`.

## 2. Bảng tham số của khối nền
Khoảng là các kiểm tra thật trong `validate` (`BLOCK_ENUMS` và khoảng số). "Không kiểm tra" nghĩa là renderer nhận mọi giá trị, tôi chỉ gợi ý; `confidence: low`.

### Phông và màu chữ
| Khóa | Mặc định | Khoảng | Hiện thực (`TextBlock.jsx`) |
|---|---|---|---|
| `font_family` | `Inter` | phải có trong `font-registry.json` và có vai trò hợp kỹ thuật | `fontFamily()` từ `fonts.js` |
| `font_weight` | 700 | cảnh báo nếu phông không có độ đậm đó | `fontWeight`; một dòng có thể ghi đè bằng `weight` |
| `font_size` | 72 | 12–600 (bỏ kiểm khi `fit_width` > 0) | `font_size × height/1080` |
| `line_height` | 1.15 | không kiểm tra | `lineHeight` |
| `letter_spacing` | 0 | không kiểm tra | em, `letterSpacing` |
| `text_transform` | `none` | `none`, `uppercase`, `lowercase` | CSS `textTransform` |
| `text_color` | `#FFFFFF` | màu CSS | `color`; dòng ghi đè bằng `color` |
| `gradient_from`, `gradient_to`, `gradient_angle` | `null`, `null`, 90 | cần **cả hai** màu mới bật | `linear-gradient` + `background-clip: text`, `color: transparent` |

### Viền, bóng, phát sáng
| Khóa | Mặc định | Khoảng | Hiện thực |
|---|---|---|---|
| `stroke_width`, `stroke_color` | 0, `#000000` | `stroke_width` 0–24 | `-webkit-text-stroke` (viền căn giữa nét chữ), `paint-order: stroke fill` |
| `hollow` | `false` | true/false | `color: transparent`: chỉ còn viền, nên cần `stroke_width` > 0 |
| `shadow_type` | `none` | `none`, `soft`, `hard`, `offset3d` | `text-shadow` nhiều lớp |
| `shadow_color` | `rgba(0,0,0,0.45)` | màu CSS | màu bóng (`hard`/`offset3d` dùng `#000` nếu thiếu) |
| `shadow_blur` | 16 | 0–60 | chỉ cho `soft` |
| `shadow_x`, `shadow_y` | 4, 4 | không kiểm tra | `hard`: lệch cố định; `offset3d`: lệch × lớp i |
| `shadow_depth` | 8 | không kiểm tra | số lớp của `offset3d` |
| `glow_color`, `glow_size` | `null`, 0 | `glow_size` 0–80 | 3 lớp `text-shadow` bán kính 0.5×, 1×, 2× `glow_size`; cần cả hai khóa |

Khi có gradient, bóng và glow chuyển sang `filter: drop-shadow(...)` (vì `text-shadow` không đi cùng `background-clip: text`).

### Hộp
| Khóa | Mặc định | Khoảng | Hiện thực |
|---|---|---|---|
| `box_style` | `none` | `none`, `pill`, `rect`, `rounded`, `bar_left`, `underline`, `bubble` | `pill` bo 9999; `rounded` bo `box_radius`; `bubble` bo `box_radius` (mặc định code 28) và là điều kiện để vẽ đuôi (`tail`); `bar_left` viền trái ≥ 6 px; `underline` gạch dưới ≥ 5 px, nền trong suốt |
| `box_color` | `rgba(0,0,0,0)` | màu CSS | nền hộp |
| `box_border_color`, `box_border_width` | `#FFFFFF`, 0 | không kiểm tra | viền hộp (chỉ `pill/rounded/rect/bubble`); `bar_left`, `underline` dùng màu này cho vạch |
| `box_padding_x`, `box_padding_y` | 0, 0 | 0–120, 0–80 | padding hộp |
| `box_radius` | 14 | không kiểm tra | cho `rounded` và `bubble` |
| `box_shadow` | `null` | chuỗi CSS | `box-shadow` |
| `rotate` | 0 | −30 đến 30 | độ, xoay cả khối |

Hộp bọc **mọi dòng** (một hộp chung), không phải mỗi dòng một hộp.

### Bố cục
| Khóa | Mặc định | Khoảng | Hiện thực |
|---|---|---|---|
| `position` | `lower_middle` | 9 vị trí (mục 3) | bảng `POS` |
| `margin` | 6 | không kiểm tra | % padding cả bốn phía |
| `margin_bottom` | 12 | không kiểm tra | % đáy, chỉ khi `position` bắt đầu bằng `lower` |
| `align` | `auto` | `auto`, `left`, `center`, `right` | `auto` suy từ vị trí ngang |
| `max_width_percent` | 88 | không kiểm tra | bề rộng tối đa của khối; bị bỏ khi `fit_width` > 0 |
| `line_scales`, `line_offsets_em` | `[]`, `[]` | mảng số | cỡ từng dòng và thụt trái (em); không kiểm tra độ dài mảng |
| `line_gap` | 0 (preset nhiều dòng: 12–32) | ≥ 0, px @1080p | khoảng cách cố định cộng thêm giữa các dòng (`marginTop` của dòng từ thứ hai). Cần cho chữ HOA có dấu cỡ lớn đứng dưới dòng nhỏ: giãn dòng tính theo cỡ chữ từng dòng nên không đủ, dấu của dòng to chạm dòng trên. `validate` cảnh báo nếu `line_gap` < 0.12 × cỡ dòng to nhất |
| `justify` | `false` | true/false | **ước lượng theo số ký tự**, kẹp 0.55–2.2, không đo thật |
| `fit_width` | 0 | 0, hoặc 0.3–1 | đo chữ bằng canvas sau khi nạp phông (`delayRender`), chọn cỡ để dòng dài nhất = `fit_width × chiều rộng` |
| `max_font_size` | 600 | không kiểm tra | trần cỡ khi `fit_width` (× `height/1080`) |
| `min_hold_base`, `min_hold_per_word` | 0.8, 0.3 | – | công thức `hold ≥ max(1.0, base + per × số_từ)`; tính **cả `sub_text`** |

### Vệt bút dạ, nền, dòng phụ
| Khóa | Mặc định | Khoảng | Hiện thực |
|---|---|---|---|
| `marker_color` | `null` | màu CSS; `marker_highlight` bắt buộc có | gradient nền (không phải bút thật) |
| `marker_top`, `marker_bottom` | 6, 96 | % chiều cao dòng | giới hạn trên/dưới của vệt |
| `marker_skew`, `marker_pad_x` | 0, 10 | không kiểm tra | `skewX` độ; đệm ngang px |
| `marker_delay`, `marker_duration` | 0.15, 0.4 | giây | vệt lớn dần; đổi giây ra frame bằng **30 fps cố định** |
| `highlight_words`, `highlight_color` | – , `null` | từ phải có trong chữ (chỉ cảnh báo) | không có `highlight_words` thì tô cả dòng; cụm nhiều từ gộp một vệt |
| `bg_mode` | `none` | `none`, `dim`, `blur`, `solid` | nền phủ khung (xem `title-card.md`) |
| `bg_color`, `bg_rgb`, `bg_opacity`, `blur_px` | `#000000`, `0,0,0`, 0.45, 18 | không kiểm tra | `solid` dùng `bg_color`; `dim`/`blur` dùng `bg_rgb` + `bg_opacity`; `blur` thêm `backdrop-filter` |
| `sub_font_size`, `sub_font_weight` | 36, 500 | không kiểm tra | dòng phụ `sub_text` |
| `sub_color`, `sub_font_family`, `sub_gap` | `null`, `null`, 12 | `null` = theo chữ chính | khoảng cách dòng phụ, px |

### Khối nền đợt 2: biểu tượng, ngoặc kép, ký hiệu, đuôi, đường chỉ, số đếm
Nằm trong `_text_style_base` (mặc định bên dưới); mỗi nhóm chỉ có tác dụng khi bật bằng khóa đầu nhóm. Khoảng "enum" là `BLOCK_ENUMS`; khoảng số là `validate`.
| Khóa | Mặc định | Khoảng | Hiện thực |
|---|---|---|---|
| `icon` | `none` | enum `none`, `pin`, `clock`, `calendar`, `user`, `star`, `check` | SVG 24×24, cỡ 0.95 × cỡ chữ, chỉ ở **dòng đầu**, trước chữ cách 0.4 em |
| `icon_color` | `null` | màu CSS; `null` theo `text_color` | tô SVG |
| `quote_mark` | `false` | true/false | bật dấu `“` lớn phía trên khối (chỉ một kiểu, chưa có `”`) |
| `quote_mark_color` | `#F2C14E` | màu CSS | màu dấu ngoặc |
| `quote_mark_size` | 160 | 40–400 | cỡ dấu (px @1080p); chiều cao chiếm 0.5 cỡ |
| `quote_font_family` | `Playfair Display` | không kiểm tra phông này | phông của dấu ngoặc |
| `bullet` | `none` | không kiểm tra; `number` thì đánh số `1.` `2.` ..., giá trị khác là ký tự đầu dòng | mỗi dòng thành hàng flex, ký hiệu rộng tối thiểu 1.1 em |
| `bullet_color` | `null` | màu CSS; `null` theo `text_color` | màu ký hiệu |
| `item_delay` | `null` | giây; không kiểm tra | khoảng cách (giây) giữa hai mục liên tiếp khi `in_animation: line_stagger`; dòng thứ i hiện trễ `i × item_delay` giây (các mục nối tiếp, đã xem trên preview ở `bullet_list_numbered`); `null` thì dòng thứ i trễ `6 × i × stagger` frame |
| `tail` | `none` | enum `none`, `bottom_left`, `bottom_center`, `bottom_right`, `top_left`, `top_center`, `top_right`, `left`, `right` | ô vuông xoay 45°; chỉ vẽ khi `box_style` là `bubble` |
| `tail_size` | 26 | 8–80 | cạnh ô vuông, px @1080p |
| `target_x`, `target_y` | `null`, `null` | 0–1 (callout bắt buộc) | điểm chỉ theo tỉ lệ khung; `target_x` khác `null` bật **chế độ callout** |
| `label_x`, `label_y` | 0.3, 0.25 | 0–1 | tâm nhãn theo tỉ lệ khung (callout bỏ qua `position`, `margin`, `align`) |
| `line_color`, `line_width` | `#F2C14E`, 4 | màu CSS; 1–20 | đường chỉ, px @1080p |
| `line_style` | `arrow` | `line`, `arrow`, `dot`, `ring` (kiểm tra riêng của callout, không có trong `BLOCK_ENUMS`) | đầu mút chỉ hiện khi đường vẽ xong |
| `ring_radius` | 36 | 8–200 | bán kính vòng (`ring`) |
| `line_delay`, `line_duration` | 0.15, 0.45 | giây; không kiểm tra | đường chỉ vẽ dần (`stroke-dashoffset`) |
| `prefix`, `suffix` | `""`, `""` | chuỗi | gắn trước/sau số (`big_number`) |
| `decimals` | 0 | số nguyên 0–3 (`big_number`) | số chữ số thập phân; dấu thập phân luôn là `,` |
| `count_from` | 0 | số; không kiểm tra | giá trị bắt đầu đếm |
| `count_duration`, `count_delay` | 1.2, 0.1 | 0–4 (`big_number`); không kiểm tra `count_delay` | thời gian và trễ đếm chạy; cảnh báo nếu `count_duration + count_delay > hold` |
| `thousands_sep` | `.` | chuỗi; `""` tắt | ký hiệu ngăn nghìn |

Hai khóa quyết định chế độ: **có `value`** (khóa nội dung) thì khối là số đếm chạy một dòng (`tabular-nums`); **có `target_x`** thì khối chuyển sang bố cục callout. Cả hai khác bố cục thường.

### Hoạt ảnh
`in_animation` `fade_up`; `in_duration` 0.3 (khoảng thực tế các preset 0.3–0.7); `out_animation` `fade`; `out_duration` 0.2; `stagger` 1 (hệ số nhân độ trễ khi `*_stagger`). Giây đổi ra frame theo `project.fps`; riêng độ trễ stagger tính theo số frame.

## 3. Chín vị trí, mười sáu hoạt ảnh vào, tám hoạt ảnh ra
- **`position`** (9): `top_left`, `top_center`, `top_right`, `middle_left`, `center`, `middle_right`, `lower_left`, `lower_middle`, `lower_right`.
- **`in_animation`** (16): `none`, `fade`, `fade_up`, `fade_down`, `slide_left`, `slide_right`, `slide_up`, `slide_down`, `scale_fade`, `pop`, `mask_wipe`, `blur_in`, `rotate_in`, `letter_stagger`, `word_stagger`, `line_stagger`.
- **`out_animation`** (8): `none`, `fade`, `slide_left`, `slide_right`, `slide_up`, `slide_down`, `scale_fade`, `mask_wipe`.
- Ba kiểu `*_stagger` không tác động lên cả khối: từng chữ cái, từ hoặc dòng tự `fade_up` trễ dần. `slide_left` khi vào là trượt từ **phải sang trái** (dịch +140 px về 0); khi ra là trượt sang trái.

**Ở style documentary** (`styles/documentary.md`: animation chỉ `fade`, `fade_up` nhẹ, 0.2–0.35 s; cấm bounce, spin/roll, slide/push/swipe/wipe, text graphic wipe, mask reveal, chữ phát sáng, màu rực, "pop" lòe loẹt):
| Nhóm | Kiểu | Tình trạng |
|---|---|---|
| Được | `none`, `fade`, `fade_up`, `line_stagger` | `validate` chỉ chấp nhận bốn giá trị này làm `in_animation` ở documentary (và `none`, `fade` làm `out_animation`); các kiểu khác bị báo lỗi. `line_stagger` được thêm cho `bullet_list_reveal` (từng mục hiện nối tiếp) |
| Cấm | `pop`, `rotate_in`, `slide_*` (vào và ra), `mask_wipe` (vào và ra) | cấm theo danh sách |
| Bị chặn ở documentary | `blur_in`, `fade_down`, `scale_fade`, `slide_*`, `pop`, `rotate_in`, `mask_wipe`, `letter_stagger`, `word_stagger` | `validate` báo lỗi khi `strategy.style = documentary` |
Cấm thêm ở lớp kiểu chữ: `glow_*`, `hollow`, `stroke_width` dày, gradient rực, bóng `hard`/`offset3d`. Cơ chế cấm thật là `forbidden_styles` của preset: `validate` **không** kiểm `in_animation` theo style.

## 4. Chọn phông cho một style
Mở `typography/font-registry.json`, chọn theo `category` (xem `typography/pairing-rules.md`): sang (Playfair Display), gọn gàng (Inter, Be Vietnam Pro, Lexend), dễ thương, viết tay, tròn mềm, bay bổng, mạnh (Anton, Bungee), công nghệ (Chakra Petch). Tối đa hai họ trong một video. Kiểm tra `roles`: `validate` chặn phông không có vai trò mà kỹ thuật yêu cầu (`stacked_text`/`title_card`/`chapter_title`: `heading` hoặc `emphasis`; `text_pill`: `emphasis` hoặc `accent`; `big_text`/`text_sticker`: `emphasis`, `heading`, `accent`; `location_tag`/`speech_bubble`/`callout_label`/`social_tag`: `emphasis`, `accent`, `subtitle`...; bảng đầy đủ là `BLOCK_RULES`), và cảnh báo khi `font_size` nhỏ hơn `min_size_px_1080p`.

## 5. Tạo preset kiểu chữ mới cho một style
1. Chọn kỹ thuật (`technique`) đích và nhóm phông; chọn style sẽ cho phép (`allowed_styles`) và cấm (`forbidden_styles`).
2. Thêm vào `presets/typography-presets.json` (đừng đặt tên trùng, ID duy nhất toàn thư mục):
```json
"stacked_small_top_brand": {
  "technique": "stacked_text",
  "extends": "_text_style_base",
  "description": "Hai dòng nhỏ trên lớn dưới, màu thương hiệu.",
  "parameters": { "font_size": 100, "line_scales": [0.42, 1], "text_color": "#F5F1E8", "position": "lower_left", "align": "left" },
  "allowed_styles": ["documentary"],
  "forbidden_styles": [],
  "source_of_values": "convention",
  "confidence": "low"
}
```
3. `parameters` chỉ ghi phần **khác** khối nền. Không dùng khóa không có ở nền (sẽ không có tác dụng và `validate` chặn trong `decision.parameters`).
4. Với style trang trọng: không bật `glow_*`, `hollow`, `stroke_width` dày, `pop`, `rotate_in`, `slide_*`, `mask_wipe`; để `forbidden_styles` cho các style khác nếu cần.
5. Kiểm tra: tạo một EDL thử dùng preset rồi chạy `node renderer/cli.js validate <edl>` (xem `renderer/README.md`); xem preview trước khi nâng `status`. Không tự đặt `confidence: high`.
6. Ghi preset vào mục 6 của tài liệu kỹ thuật tương ứng.

## 6. Giới hạn đã biết của hiện thực
- Viền chữ dùng `-webkit-text-stroke` (căn giữa nét), không phải viền ngoài thật; viền dày ăn vào thân chữ. Kết hợp viền với gradient hoặc `hollow` + gradient: cần xem preview.
- `justify` ước lượng theo số ký tự; `fit_width` mới đo thật (canvas, sau khi phông nạp); chỉ đo **dòng dài nhất theo số ký tự**, nên dòng có chữ rộng nhưng ít ký tự có thể tràn.
- `backdrop-filter` (nền mờ) và vệt bút dạ (gradient nền, không phải bút thật): chưa kiểm ở 1080p/4K.
- Hoạt ảnh vào/ra từng kiểu **chưa xem** (chỉ xem khung tĩnh); cần xem preview. Cảnh chồng khuôn mặt cũng chưa kiểm.
- `validate` không kiểm: cỡ dòng sau nhân `line_scales`, `sub_font_*` (phông, cỡ), độ dài `line_scales`/`line_offsets_em`, `in_duration`/`out_duration`, `bg_opacity`, `marker_*`. `sub_text` bị giới hạn tối đa 12 từ và được tính vào `hold` tối thiểu.
- Trường `duration` của quyết định không điều khiển thời gian khối chữ: thời gian = `in_duration + hold + out_duration`.
- Ngân sách `strategy.budget` đếm `kinetic_text` (khóa `emphasis_text`), `punch_in`, `lower_third`, chuyển cảnh, và từng kỹ thuật khối chữ **chỉ khi** khóa cùng tên kỹ thuật có trong `budget` (không khai báo thì không đếm); chưa có kiểm khoảng cách tối thiểu giữa các khối. `styles/documentary.md` chưa có dòng ngân sách cho kỹ thuật đợt 2.
- Callout cố định: toạ độ tỉ lệ khung hình, không theo dõi chuyển động; đuôi `bubble` là ô vuông xoay (không nhận `box_shadow`); biểu tượng `user`, `star` và đuôi ở các hướng khác `bottom_left`/`bottom_right` chưa xem trên preview.
- Dòng rỗng trong `lines`/`text` vẫn được dựng thành dòng trống dù `validate` bỏ qua khi đếm.

**Giãn dòng với chữ hoa có dấu:** nhiều dòng chữ hoa có dấu tiếng Việt cỡ lớn (ví dụ Anton) cần `line_height` ≥ 1.25; thấp hơn thì dấu và chân chữ của các dòng đè lên nhau (đã gặp ở `stacked_justified` với 0.95). `validate` cảnh báo khi `line_height` < 1.15 với chữ hoa có dấu nhiều dòng.

## 7. Chín kỹ thuật đợt 2 và preset
Cùng dùng `TextBlock.jsx` và khối nền; chỉ khác phần bật khóa và preset. Tài liệu từng kỹ thuật nằm trong `techniques/typography/`. Cột cuối là `forbidden_styles` của preset.
| Kỹ thuật | Preset | Cấm ở documentary |
|---|---|---|
| `chapter_title` | `chapter_title_editorial`, `chapter_title_bar`, `chapter_title_bold` | `bold` |
| `pull_quote` | `pull_quote_editorial`, `pull_quote_clean`, `pull_quote_bold` | `bold` |
| `big_number` | `big_number_clean`, `big_number_card`, `big_number_bold` | `bold` |
| `bullet_list_reveal` | `bullet_list_clean`, `bullet_list_numbered`, `bullet_list_check` | không |
| `location_tag` | `location_tag_pin`, `location_tag_date`, `location_tag_clock` | không |
| `text_sticker` | `text_sticker_white`, `text_sticker_pop` | cả hai |
| `speech_bubble` | `speech_bubble_white`, `speech_bubble_dark`, `speech_bubble_cute` | cả ba |
| `callout_label` | `callout_label_dot`, `callout_label_arrow`, `callout_label_ring` | `arrow`, `ring` |
| `social_tag` | `social_tag_at`, `social_tag_hash` | cả hai |

Giới hạn `validate` của từng kỹ thuật (từ/dòng tối đa): `chapter_title` 8/3, `pull_quote` 30/4, `big_number` 3/1, `bullet_list_reveal` 36/6, `location_tag` 6/1, `text_sticker` 4/2, `speech_bubble` 14/3, `callout_label` 8/2, `social_tag` 3/1. Kiểm tra riêng: `big_number` cần `value` là số; `bullet_list_reveal` ≥ 2 mục, mỗi mục ≤ 8 từ; `speech_bubble` cần `box_style: bubble`; `callout_label` cần `target_x`, `target_y` trong [0, 1]; `social_tag` cảnh báo khi không bắt đầu bằng `@`/`#`; `location_tag` cảnh báo khi `icon` là `none`.

**Dấu chạm dòng trên (đã gặp ở `chapter_title_bold`):** dòng chữ hoa Anton cỡ 160 px có dấu ("KHỞI ĐẦU") đứng ngay dưới nhãn 64 px làm hook và dấu mũ chạm vào chữ phía trên dù `line_height` đã 1.25. Khắc phục bằng `line_gap` (32 px cho preset này). Quy tắc chung: chữ hoa có dấu nhiều dòng cần `line_height` ≥ 1.25 **và** `line_gap` ≥ 0.12 × cỡ dòng to nhất.

## 8. Đợt 4: hiệu ứng ký tự
Năm kỹ thuật `typewriter_text`, `scramble_text`, `glitch_text`, `text_cutout`, `text_on_path` dùng cùng `TextBlock.jsx` và khối nền; mỗi nhóm khóa chỉ có tác dụng khi bật bằng khóa đầu nhóm. Mặc định là của `_text_style_base`; khoảng là kiểm tra thật trong `validate`. Tài liệu từng kỹ thuật nằm trong `techniques/typography/`.
| Khóa | Mặc định | Khoảng | Hiện thực |
|---|---|---|---|
| `typewriter` | `false` | bắt buộc `true` với `typewriter_text` | chữ hiện từng ký tự; ký tự chưa hiện vẫn chiếm chỗ (trong suốt) |
| `type_speed` | 16 | 4–60 ký tự/giây | thời gian gõ = số ký tự / `type_speed` |
| `type_duration` | 0 | > 0 thì thay `type_speed`; không kiểm tra | giây |
| `type_delay` | 0.1 | không kiểm tra | giây trước khi bắt đầu gõ |
| `caret` | `false` | true/false | con trỏ rộng 0, đặt sau ký tự đã hiện |
| `caret_char` | `\|` | một ký tự; không kiểm tra | |
| `caret_blink` | 2 | ≥ 0 (0 = luôn sáng); không kiểm tra | lần nháy/giây sau khi gõ xong (đang gõ luôn sáng) |
| `caret_color` | `null` | màu CSS | `null` theo `text_color` |
| `scramble` | `false` | bắt buộc `true` với `scramble_text` | ký tự nhảy rồi chốt từ trái sang phải |
| `scramble_chars` | `ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@` | chuỗi bất kỳ | tập ký tự nhảy |
| `scramble_duration` | 0.9 | 0.2–3 | giây từ ký tự đầu đến ký tự cuối chốt |
| `scramble_delay` | 0.1 | không kiểm tra | giây |
| `scramble_rate` | 24 | không kiểm tra | lần đổi ký tự/giây |
| `glitch` | `false` | bắt buộc `true` với `glitch_text` | nhiễu theo đợt, xét mỗi 2 frame (phụ thuộc fps) |
| `glitch_rate` | 0.3 | 0–0.6 | xác suất một đợt bật |
| `glitch_split` | 8 | 0–24 | px @1080p, lệch kênh đỏ/lục lam |
| `glitch_jitter` | 10 | 0–40 | px @1080p, rung ngang |
| `glitch_slices` | 2 | không kiểm tra | số dải cắt lệch |
| `glitch_pattern` | null (preset `glitch_*`: `[[0.1,0.35],[0.5,0.75],[1.7,2.0]]`) | mảng đoạn `[bắt đầu, kết thúc]` giây từ đầu khối, tăng dần, không chồng; đoạn cuối ≤ tổng thời gian khối | nháy đúng các đoạn này, ngoài đoạn là chữ sạch; null thì nháy ngẫu nhiên theo `glitch_rate` |
| `glitch_vanish` | false (preset `glitch_*`: true) | boolean | chữ biến mất ngay sau đoạn nháy cuối (cần `glitch_pattern`) |
| `cutout` | `false` | bắt buộc `true` với `text_cutout` | SVG mask: lớp màu phủ khung, chữ là cửa sổ |
| `cutout_color` | `#0F172A` | màu CSS | cảnh báo nếu thiếu |
| `cutout_opacity` | 0.92 | 0–1; cảnh báo nếu < 0.7 | |
| `cutout_outline_width` | 0 | không kiểm tra | px @1080p |
| `cutout_outline_color` | `#FFFFFF` | màu CSS | |
| `cutout_scale_from`, `cutout_scale_to` | 1, 1 (preset `cutout_dive`: 1 → 7) | 0.5–12 | chữ phóng dần suốt thời gian khối; khác nhau thì thay cú phóng nhẹ lúc vào |
| `cutout_scale_ease` | `out` (`cutout_dive`: `in`) | out|in|inout|linear | `in` = tăng tốc như lao vào |
| `cutout_focus_x`, `cutout_focus_y` | 0.5, 0.5 | 0–1 (tỉ lệ khung) | điểm chữ phóng quanh (điểm lao vào) |
| `path_shape` | `none` | `none`, `arc_up`, `arc_down`, `wave`, `circle` (`BLOCK_ENUMS`); `text_on_path` bắt buộc ≠ `none` | SVG `textPath` |
| `path_curve` | 0.3 | 0–0.6 | tỉ lệ chiều cao khung; `circle` bỏ qua |
| `path_width` | 0.8 | 0.2–1 | tỉ lệ chiều rộng khung; với `circle` là đường kính |
| `path_y` | 0.5 | 0–1 | tỉ lệ chiều cao khung |
| `path_reveal` | `none` (preset `path_*`: `start`) | none|start|end | chữ chạy dần ra từ đầu hoặc cuối đường (từng ký tự hiện nối tiếp) |
| `path_reveal_duration`, `path_reveal_delay` | 0.9 (preset 1.0), 0.1 | 0.2–3; ≥ 0 | giây |
| `path_reveal_slide` | 0.06 | 0–0.3 | cả chuỗi trượt nhẹ dọc đường khi chạy ra, tỉ lệ chiều dài đường |

Giới hạn `validate` (từ/dòng tối đa): `typewriter_text` 24/4, `scramble_text` 6/2, `glitch_text` 5/2, `text_cutout` 3/2, `text_on_path` 8/1. Kiểm tra riêng: `typewriter_text` cảnh báo khi thời gian gõ + `type_delay` + 0.6 s vượt `in_duration + hold` và khi `in_animation` không phải `none`/`fade`; `scramble_text` cảnh báo tương tự với `scramble_delay + scramble_duration`; `text_cutout` cảnh báo `font_size` < 200 (không áp khi `fit_width`), `cutout_opacity` < 0.7, `font_weight` < 700 khi phông có độ đậm ≥ 700.

**Giới hạn của hiện thực:** nhánh `text_cutout` căn giữa khung và bỏ qua hộp, `sub_text`, bullet, icon, bóng, `position`, `in_animation`; nhánh `text_on_path` bỏ qua hộp, `sub_text`, `position`, `fit_width`, glow, gradient; cả hai chỉ áp `text_transform: uppercase` (không áp `lowercase`). Nhịp nhiễu của `glitch` tính theo frame nên đổi theo `project.fps`; chưa đo an toàn nhấp nháy. Chỉ `typewriter_clean` và `typewriter_title` được phép ở documentary; mọi preset đợt 4 khác có "documentary" trong `forbidden_styles`.

## 9. Đợt 5: số liệu và danh sách
Bốn kỹ thuật `progress_bar`, `countdown_timer`, `credits_roll`, `comparison_table` dùng cùng `TextBlock.jsx` và khối nền; mỗi nhóm khóa chỉ có tác dụng khi bật bằng khóa đầu nhóm (`progress_to`, `countdown_from`, `credits`, `table`). Mặc định là của `_text_style_base`; khoảng là kiểm tra thật trong `validate` ("không kiểm tra" nghĩa là renderer nhận mọi giá trị; confidence `low`). Tài liệu từng kỹ thuật nằm trong `techniques/typography/`.
| Khóa | Mặc định | Khoảng | Hiện thực |
|---|---|---|---|
| `countdown_from` | `null` | số nguyên 1–30 (`clock`: 1–3600); **có giá trị thì khối là đếm ngược một dòng** | số bắt đầu; hiện `from − floor((t − delay)/step)`, tối thiểu 0 |
| `countdown_step` | 1 | 0.25–2; `clock` nên = 1 (cảnh báo) | giây mỗi bước |
| `countdown_delay` | 0.2 | không kiểm tra | giây trước bước đầu (trong lúc đó vẫn hiện số `from`) |
| `countdown_format` | `number` | `number`, `clock` (`BLOCK_ENUMS`) | `clock` hiện `mm:ss` |
| `countdown_end_text` | `""` | chuỗi; không đo, không tính từ | thay số 0 khi khác rỗng |
| `countdown_pop` | 0.2 | 0–0.5 | phóng thêm rồi giảm trong 0.3 s đầu mỗi bước; số 0 nhân 1.5 |
| `progress_to` | `null` | 0–1; **có giá trị thì khối là thanh tiến độ** | mức cuối; phần trăm là số nguyên làm tròn |
| `progress_delay` | 0.2 | không kiểm tra | giây |
| `progress_duration` | 1.5 | 0.3–6 | giây, easeInOut; cảnh báo nếu `delay + duration + 0.6 > in_duration + hold` |
| `show_percent` | `true` | true/false | phần trăm bên phải nhãn |
| `bar_width` | 0.5 | 0.2–1 | tỉ lệ bề ngang khung |
| `bar_height` | 18 | 4–80 | px @1080p |
| `bar_color`, `bar_color_to` | `#F2C14E`, `null` | màu CSS | có `bar_color_to` thì gradient ngang |
| `bar_track_color` | `rgba(255,255,255,0.25)` | màu CSS | nền rãnh |
| `bar_radius` | 999 | không kiểm tra | px @1080p |
| `label_gap` | 12 | không kiểm tra | px, nhãn đến thanh |
| `credits` | `false` | bắt buộc `true` với `credits_roll` | bật chế độ cuộn |
| `roll_speed` | 90 | 30–400 | px/giây @1080p; nội dung bắt đầu từ mép dưới lúc t = 0 |
| `credits_width` | 0.6 | 0.3–1 | tỉ lệ bề ngang khung, căn giữa |
| `credits_group_gap` | 1.2 | không kiểm tra | × cỡ chữ, trước đề mục (trừ dòng đầu) |
| `credits_heading_color` | `#F2C14E` | màu CSS | đề mục `## …` (0.55×, HOA, giãn 0.18 em) |
| `credits_heading_weight` | 600 | không kiểm tra | |
| `table` | `false` | `true` với `comparison_table`; **không được validate kiểm** | bật chế độ bảng |
| `table_header` | `true` | `false` thì dòng đầu là dữ liệu (cảnh báo) | hàng đầu là tiêu đề cột |
| `table_bg` | `rgba(15,23,42,0.92)` | màu CSS | nền bảng |
| `table_header_bg`, `table_header_color` | `#F2C14E`, `#0F172A` | màu CSS | hàng tiêu đề |
| `table_line_color` | `rgba(255,255,255,0.18)` | màu CSS | đường kẻ giữa hàng |
| `table_highlight_col` | -1 | số nguyên 0–(cột−1) hoặc -1 | chỉ số cột nhấn (từ 0) |
| `table_highlight_bg` | `rgba(242,193,78,0.18)` | màu CSS | nền ô cột nhấn (chữ cột nhấn dùng `highlight_color`) |
| `table_row_padding` | 16 | không kiểm tra | px @1080p dọc; ngang × 1.2 |
| `table_first_col` | 1.3 | không kiểm tra | độ rộng cột đầu theo `fr` (cột khác 1fr) |
| `table_width` | 0.7 | 0.3–0.95 | tỉ lệ bề ngang khung |

`item_delay` (khối nền: `null`) cũng điều khiển độ trễ giữa các hàng bảng; code dùng 0.25 s khi `null`. Giới hạn `validate` (từ/dòng tối đa): `progress_bar` 6/1, `countdown_timer` 2/1 (chỉ tính số bắt đầu), `credits_roll` 160/40, `comparison_table` 70/9. Dấu `|` và `##` được đếm là một từ khi kiểm tối đa nhưng `|` bị bỏ khi tính `hold` tối thiểu. Kiểm tra riêng: `progress_bar` kiểm khoảng số; `countdown_timer` cần `hold ≥ delay + from × step + 0.5 − in_duration`; `credits_roll` chặn khi khối ngắn hơn `(1080 + chiều cao nội dung)/roll_speed − 0.3` s; `comparison_table` kiểm 2–4 cột, ≥ 2 hàng dữ liệu, ô đủ, ô ≤ 5 từ, cảnh báo > 24 ô. `hold` tối thiểu theo số từ **không áp** cho `credits_roll` và `countdown_timer`.

**Giới hạn của hiện thực:** `progress_to` rỗng (`null`) vượt kiểm tra khoảng của `validate` nên thanh không hiện mà không báo lỗi; không có chế độ vô định. Cuộn credits bỏ qua hộp, bullet, icon, `sub_text`, `position`; hoạt ảnh vào/ra chỉ đổi độ mờ. Bảng không xuống dòng thông minh trong ô, `in_animation` áp lên cả bảng, hàng hiện nối tiếp bằng `fade_up` cố định. Đếm ngược không phát âm thanh; `countdown_end_text` không được đo khi `fit_width`. Preset documentary được phép: `progress_bar_thin`, `credits_clean`, `credits_cinema`, `table_clean`; cấm: `progress_bar_pill`, `countdown_big`, `countdown_clock`, `table_dark`. Chưa xem trên preview: hoạt ảnh vào/ra từng kiểu, bảng 4 cột, chữ dài trong ô, credits dài hoặc tên dấu phức tạp ở 1080p/4K, thanh ở hai đầu khung, `clock` > 59 giây.

## 10. Đợt 3: chữ theo lời nói
Bốn kỹ thuật `word_highlight`, `word_by_word_text`, `karaoke_subtitles`, `shortform_captions` dùng cùng `TextBlock.jsx` (nhánh `p.words_mode && b.words`) và khối nền. Khác các đợt trước: cần **mốc thời gian theo từng từ** (`parameters.words`). `Video-analysis` hiện không có mốc này và máy chưa có công cụ nhận dạng giọng nói; renderer không tự nhận dạng, chỉ đọc mốc có sẵn. Tài liệu từng kỹ thuật nằm trong `techniques/typography/`. Mặc định là của `_text_style_base`; khoảng là kiểm tra thật trong `validate` ("không kiểm tra" nghĩa là renderer nhận mọi giá trị; confidence `low`).
| Khóa | Mặc định | Khoảng | Hiện thực |
|---|---|---|---|
| `words_mode` | `null` | `karaoke`, `highlight`, `by_word`, `chunks` (`BLOCK_ENUMS`); **bắt buộc khớp kỹ thuật** (sai là lỗi) | có giá trị cùng `words` thì khối dựng theo lời; `karaoke_subtitles` → `karaoke`, `word_highlight` → `highlight`, `word_by_word_text` → `by_word`, `shortform_captions` → `chunks` |
| `words_tail` | 0.5 | 0–3 (validate) | giây giữ sau `end` của từ cuối trước khi ra; thời gian khối = từ đầu khối đến `end` + `words_tail`, rồi `out_duration` |
| `word_pop` | `true` | true/false | từ (hoặc cả cụm ở `chunks`) phóng thêm rồi giảm trong 0.18 s khi bắt đầu được nói; `false` tắt (`word_highlight_clean`) |
| `word_pop_amount` | 0.14 | 0–0.4 (validate) | tỉ lệ phóng thêm |
| `word_replace` | `false` | true/false | chỉ `by_word`: `true` mỗi lúc một từ (từ ẩn không chiếm chỗ); `false` tích luỹ (từ chưa hiện vẫn chiếm chỗ, bố cục không nhảy) |
| `karaoke_active_color` | `#FFD84D` | màu CSS | chỉ `karaoke`: từ đang nói |
| `karaoke_done_color` | `null` | màu CSS hoặc `null` (= `text_color`) | chỉ `karaoke`: từ đã nói |
| `karaoke_upcoming_opacity` | 0.45 | 0–1 (validate) | chỉ `karaoke`: độ mờ từ chưa nói |
| `chunk_size` | 2 | số nguyên 1–3 (validate) | chỉ `chunks`: số từ mỗi cụm, chia tuần tự |
| `chunk_linger` | 0.5 | 0–2 (validate) | giây giữ cụm sau `end` từ cuối cụm cho đến khi cụm sau bắt đầu |

Khóa nền liên quan: `highlight_words` (khóa nội dung; **bắt buộc** với `word_highlight`, tùy chọn với `by_word`/`chunks`, **không tác dụng** với `karaoke`), `highlight_color` (`null` thì dùng `#FFD84D`), `min_hold_per_word` (nền 0.3, **không áp** cho bốn kỹ thuật này vì thời gian khối tính từ mốc).

**Định dạng dữ liệu** (khóa nội dung `words`, `words_source` trong `CONTENT_KEYS`):
- `words` = `[{ "text": "...", "start": giây, "end": giây }]` theo **thời gian của video nguồn** (cùng hệ với `anchor.source_time`), tăng dần, không chồng quá 0.05 s, mỗi phần tử đủ `text`, `start`, `end` với `end > start`. Từ cuối không được kết thúc sau `source_out` của clip; từ đầu không được trước điểm neo `anchor.source_time + start_offset` (lỗi). Renderer đổi thành mốc tương đối với điểm neo đó. `anchor.clip` bắt buộc (không dùng `between`).
- `words_source` bắt buộc ∈ `asr` | `manual` | `subtitle_file` | `estimated`. **Không được tự bịa lời nói hoặc mốc** (quy tắc trung thực của dự án). `estimated` chỉ cho bản thử: `validate` cảnh báo và `cli.js final` từ chối render khi còn quyết định (chưa `removed`) dùng nó.
- Không dùng `hold`: thời gian khối do renderer tính; `decision.duration` bị bỏ qua (không cảnh báo lệch).

Giới hạn `validate` (từ tối đa, một "dòng" logic vì chữ tự xuống dòng theo `max_width_percent`): `word_highlight` 20, `word_by_word_text` 20, `karaoke_subtitles` 16, `shortform_captions` 60. Kiểm tra riêng: `word_highlight` cần `highlight_words`; cảnh báo từ kéo dài > 2.5 s (`karaoke`, `highlight`); cảnh báo cụm hiện sớm hơn lời > 1 s (`karaoke`, `highlight`); cảnh báo cụm `chunks` hiện < 0.25 s; cảnh báo khi clip có `time_lapse`, `freeze_frame` hoặc `speed_ramp_transition` (mốc tính theo thời gian nguồn nên lệch).

Preset documentary: chỉ `word_highlight_clean` được phép; `word_highlight_pop`, `word_by_word_stack`, `word_by_word_single`, `karaoke_clean`, `karaoke_bold`, `shortform_captions_bold`, `shortform_captions_soft` đều cấm. Phụ đề thường (`subtitles`) vẫn là lựa chọn mặc định cho lời thoại.

**Đã xem** (preview 960×540 của clip thử, project `projects/demo-text-p3`, mốc **ước lượng đều 0.42 s/từ**, `words_source: estimated`, nên chỉ kiểm chứng cơ chế hiển thị, chưa kiểm chứng độ khớp lời thật): highlight cả câu sẵn và từ khóa đổi vàng lần lượt; by_word tích luỹ không nhảy bố cục, `single` một từ Anton hoa; karaoke vàng/trắng/mờ 0.5; shortform cụm 2 và 3 từ với từ khóa tô màu.
**Chưa kiểm chứng:** độ khớp với lời nói thật (cần ASR); hoạt ảnh vào/ra; clip đổi tốc độ/dừng hình; cụm dài tự xuống dòng khi karaoke ở 1080p/4K; ngôn ngữ ngoài tiếng Việt; chuyển hiện cho từ khóa dài; `word_pop_amount` ở cỡ chữ lớn.

## 11. Tham số bổ sung cho style social_edu
- `badge_text`, `badge_color`, `badge_text_color`, `badge_size`, `badge_corner`, `badge_delay`: huy hiệu tròn gối lên góc hộp (ví dụ dấu `?`).
- `sweep_line`, `sweep_duration`, `sweep_color`, `sweep_width`: đường quét ngang mở khối ra từ trái.
- `ghost_x`, `ghost_color`, `ghost_time`: bóng mờ kéo ngang, tan khi chữ vào.
- `in_animation: letter_scatter` (`scatter_spread`, `scatter_delay`, `scatter_duration`): ký tự rải rồi dồn về hàng; `in_animation: rotate_y`: trượt vào kèm xoay 3D.
- Icon thêm: `doc_alert`, `alert`.
