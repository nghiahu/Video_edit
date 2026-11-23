# Lớp kiểu chữ dùng chung (đợt 0)

Sáu kỹ thuật chữ đợt 1 (`text_pill`, `text_box`, `stacked_text`, `title_card`, `big_text`, `marker_highlight`) cùng dùng một bộ dựng `renderer/src/TextBlock.jsx`. Kiểu chữ không nằm trong code từng kỹ thuật mà nằm trong **preset**, kế thừa một khối nền. Tài liệu này nói khối nền có gì, mỗi khóa làm gì, và cách thêm preset cho một style mới. Kế hoạch tổng: `techniques/typography/layout-catalog.md`. Đây là tài liệu tham chiếu, không theo khuôn 10 mục.

## 1. Cơ chế `extends` và khối nền `_text_style_base`
- Trong `presets/typography-presets.json`, khóa bắt đầu bằng `_` là chú thích hoặc khối nền. `loadPresets` (`renderer/lib/edl.mjs`) gom mọi khóa `_xxx` có trường `parameters` vào bảng `bases`, **không** coi là preset dùng được.
- Preset có `"extends": "_text_style_base"` được nạp thành `parameters = { ...base.parameters, ...preset.parameters }`: khóa trong preset ghi đè khối nền. Khối nền không tồn tại thì `loadPresets` ném lỗi.
- Khi render: `mergeParams` = preset (đã trộn với nền) ghi đè bởi `decision.parameters`. Khóa lạ trong `decision.parameters` bị `validate` chặn, trừ các khóa nội dung `text`, `hold`, `name`, `title`, `cues`, `file`, `lines`, `sub_text`, `highlight_words` (`CONTENT_KEYS`).
- Vì khối nền chứa **mọi** khóa, một khóa chỉ hợp lệ trong EDL nếu có ở khối nền (hoặc preset). `schema/preset.md` mô tả hợp đồng preset chung; `extends` là mở rộng của lớp này.
- Preset ghi **chỉ phần khác nền** (xem mục 6). Cỡ chữ tính cho 1080p, nhân `height/1080`.

## 2. Bảng tham số của khối nền
Khoảng là các kiểm tra thật trong `validate` (`BLOCK_ENUMS` và khoảng số). "Không kiểm tra" nghĩa là renderer nhận mọi giá trị, tôi chỉ gợi ý; `confidence: low`.

### Phông và màu chữ
| Khóa | Mặc định | Khoảng | Hiện thực (`TextBlock.jsx`) |
|---|---|---|---|
| `font_family` | `Inter` | phải có trong `font-registry.json` và có vai trò hợp kỹ thuật | `fontFamily()` từ `fonts.js` |
| `font_weight` | 700 | cảnh báo nếu phông không có độ đậm đó | `fontWeight`; một dòng có thể ghi đè bằng `weight` |
| `font_size` | 72 | 12–400 (bỏ kiểm khi `fit_width` > 0) | `font_size × height/1080` |
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
| `box_style` | `none` | `none`, `pill`, `rect`, `rounded`, `bar_left`, `underline` | `pill` bo 9999; `rounded` bo `box_radius`; `bar_left` viền trái ≥ 6 px; `underline` gạch dưới ≥ 5 px, nền trong suốt |
| `box_color` | `rgba(0,0,0,0)` | màu CSS | nền hộp |
| `box_border_color`, `box_border_width` | `#FFFFFF`, 0 | không kiểm tra | viền hộp (chỉ `pill/rounded/rect`); `bar_left`, `underline` dùng màu này cho vạch |
| `box_padding_x`, `box_padding_y` | 0, 0 | 0–120, 0–80 | padding hộp |
| `box_radius` | 14 | không kiểm tra | cho `rounded` |
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
| `justify` | `false` | true/false | **ước lượng theo số ký tự**, kẹp 0.55–2.2, không đo thật |
| `fit_width` | 0 | 0, hoặc 0.3–1 | đo chữ bằng canvas sau khi nạp phông (`delayRender`), chọn cỡ để dòng dài nhất = `fit_width × chiều rộng` |
| `max_font_size` | 600 | không kiểm tra | trần cỡ khi `fit_width` (× `height/1080`) |
| `min_hold_base`, `min_hold_per_word` | 0.8, 0.3 | – | công thức `hold ≥ max(1.0, base + per × số_từ)`; tính **cả `sub_text`** |

### Vệt bút dạ, nền, dòng phụ
| Khóa | Mặc định | Khoảng | Hiện thực |
|---|---|---|---|
| `marker_color` | `null` | màu CSS; `marker_highlight` bắt buộc có | gradient nền (không phải bút thật) |
| `marker_top`, `marker_bottom` | 48, 94 | % chiều cao dòng | giới hạn trên/dưới của vệt |
| `marker_skew`, `marker_pad_x` | 0, 10 | không kiểm tra | `skewX` độ; đệm ngang px |
| `marker_delay`, `marker_duration` | 0.15, 0.4 | giây | vệt lớn dần; đổi giây ra frame bằng **30 fps cố định** |
| `highlight_words`, `highlight_color` | – , `null` | từ phải có trong chữ (chỉ cảnh báo) | không có `highlight_words` thì tô cả dòng; cụm nhiều từ gộp một vệt |
| `bg_mode` | `none` | `none`, `dim`, `blur`, `solid` | nền phủ khung (xem `title-card.md`) |
| `bg_color`, `bg_rgb`, `bg_opacity`, `blur_px` | `#000000`, `0,0,0`, 0.45, 18 | không kiểm tra | `solid` dùng `bg_color`; `dim`/`blur` dùng `bg_rgb` + `bg_opacity`; `blur` thêm `backdrop-filter` |
| `sub_font_size`, `sub_font_weight` | 36, 500 | không kiểm tra | dòng phụ `sub_text` |
| `sub_color`, `sub_font_family`, `sub_gap` | `null`, `null`, 12 | `null` = theo chữ chính | khoảng cách dòng phụ, px |

### Hoạt ảnh
`in_animation` `fade_up`; `in_duration` 0.3; `out_animation` `fade`; `out_duration` 0.2; `stagger` 1 (hệ số nhân độ trễ khi `*_stagger`). Giây đổi ra frame theo `project.fps`; riêng độ trễ stagger tính theo số frame.

## 3. Chín vị trí, mười sáu hoạt ảnh vào, tám hoạt ảnh ra
- **`position`** (9): `top_left`, `top_center`, `top_right`, `middle_left`, `center`, `middle_right`, `lower_left`, `lower_middle`, `lower_right`.
- **`in_animation`** (16): `none`, `fade`, `fade_up`, `fade_down`, `slide_left`, `slide_right`, `slide_up`, `slide_down`, `scale_fade`, `pop`, `mask_wipe`, `blur_in`, `rotate_in`, `letter_stagger`, `word_stagger`, `line_stagger`.
- **`out_animation`** (8): `none`, `fade`, `slide_left`, `slide_right`, `slide_up`, `slide_down`, `scale_fade`, `mask_wipe`.
- Ba kiểu `*_stagger` không tác động lên cả khối: từng chữ cái, từ hoặc dòng tự `fade_up` trễ dần. `slide_left` khi vào là trượt từ **phải sang trái** (dịch +140 px về 0); khi ra là trượt sang trái.

**Ở style documentary** (`styles/documentary.md`: animation chỉ `fade`, `fade_up` nhẹ, 0.2–0.35 s; cấm bounce, spin/roll, slide/push/swipe/wipe, text graphic wipe, mask reveal, chữ phát sáng, màu rực, "pop" lòe loẹt):
| Nhóm | Kiểu | Tình trạng |
|---|---|---|
| Được | `none`, `fade`, `fade_up` | `validate` chỉ chấp nhận ba giá trị này làm `in_animation` ở documentary (và `none`, `fade` làm `out_animation`); các kiểu khác bị báo lỗi |
| Cấm | `pop`, `rotate_in`, `slide_*` (vào và ra), `mask_wipe` (vào và ra) | cấm theo danh sách |
| Bị chặn ở documentary | `blur_in`, `fade_down`, `scale_fade`, `slide_*`, `pop`, `rotate_in`, `mask_wipe`, `letter_stagger`, `word_stagger`, `line_stagger` | `validate` báo lỗi khi `strategy.style = documentary` |
Cấm thêm ở lớp kiểu chữ: `glow_*`, `hollow`, `stroke_width` dày, gradient rực, bóng `hard`/`offset3d`. Cơ chế cấm thật là `forbidden_styles` của preset: `validate` **không** kiểm `in_animation` theo style.

## 4. Chọn phông cho một style
Mở `typography/font-registry.json`, chọn theo `category` (xem `typography/pairing-rules.md`): sang (Playfair Display), gọn gàng (Inter, Be Vietnam Pro, Lexend), dễ thương, viết tay, tròn mềm, bay bổng, mạnh (Anton, Bungee), công nghệ (Chakra Petch). Tối đa hai họ trong một video. Kiểm tra `roles`: `validate` chặn phông không có vai trò mà kỹ thuật yêu cầu (`stacked_text`/`title_card`: `heading` hoặc `emphasis`; `text_pill`: `emphasis` hoặc `accent`; `big_text`: `emphasis`, `heading`, `accent`...), và cảnh báo khi `font_size` nhỏ hơn `min_size_px_1080p`.

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
- Ngân sách `strategy.budget` chỉ đếm `kinetic_text`, `punch_in`, `lower_third`, chuyển cảnh; sáu kỹ thuật khối chữ chưa được đếm, cũng chưa có kiểm khoảng cách tối thiểu giữa các khối.
- Dòng rỗng trong `lines`/`text` vẫn được dựng thành dòng trống dù `validate` bỏ qua khi đếm.

**Giãn dòng với chữ hoa có dấu:** nhiều dòng chữ hoa có dấu tiếng Việt cỡ lớn (ví dụ Anton) cần `line_height` ≥ 1.25; thấp hơn thì dấu và chân chữ của các dòng đè lên nhau (đã gặp ở `stacked_justified` với 0.95). `validate` cảnh báo khi `line_height` < 1.15 với chữ hoa có dấu nhiều dòng.
