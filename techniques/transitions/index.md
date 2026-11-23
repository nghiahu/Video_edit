# Transitions — chọn kỹ thuật

Bắt đầu với `hard_cut` ở mọi điểm nối (`R-CUT-1`). Chỉ đổi sang kiểu khác khi có **lý do kể chuyện**, ghi trong `reason`. Danh sách đầy đủ ID và cách thực hiện: `techniques/index.md`, mục 03.

## Chọn theo ý đồ
| Ý đồ | Kỹ thuật phù hợp |
|---|---|
| Nối thông thường, không gây chú ý | `hard_cut`, `cut_on_action`, `j_l_cut` |
| Bỏ quãng lặng/từ đệm trong cùng một khung | `jump_cut`, `morph_cut` |
| Che điểm nối bằng cảnh khác | `b_roll_insert`, `cutaway_insert` |
| Trôi thời gian, đổi địa điểm, ký ức | `cross_dissolve`, `additive_dissolve`, `blur_dissolve`, `dip_to_black`, `dip_to_white` |
| Mở hoặc kết video | `fade_in_out` |
| Nối bằng ý hoặc hình ảnh | `match_cut`, `graphic_match`, `sound_bridge` |
| Hai mạch song song | `cross_cut` |
| Gây bất ngờ | `smash_cut`, `flash_strobe` |
| Chuyển động mạnh, năng lượng cao | `whip_pan`, `whip_tilt`, `zoom_transition`, `spin_rotate`, `camera_roll`, `shake_transition`, `speed_ramp_transition` |
| Chuyển kiểu đồ họa (video quảng bá, tiêu đề) | `slide`, `push`, `swipe`, `wipe`, `parallax_transition`, `text_graphic_wipe` |
| Che/lộ hình có hình dạng | `mask_reveal`, `iris_wipe`, `clock_wipe`, `split_barn_door`, `luma_wipe`, `shape_reveal`, `object_wipe` |
| Cảm giác số, retro, nhiễu | `glitch`, `rgb_split`, `vhs_distortion`, `pixelate_mosaic` |
| Cảm giác phim, ấm | `light_leak`, `film_burn` |
| Theo nhịp nhạc | `beat_sync_cut`, `whoosh_synced_cut`, `montage` |

## Hai nhóm kỹ thuật theo cách thực hiện
- **Chồng nhau (`overlap`)**: cần "tay cầm" (đoạn thừa quanh điểm cắt ở cả hai clip) — mờ chồng, slide, push, swipe, wipe, parallax, các kiểu mặt nạ/che-lộ, morph cut. Renderer tự rút ngắn và cảnh báo nếu thiếu.
- **Tuần tự**: điểm cắt nằm giữa vùng, mỗi bên có hiệu ứng riêng trong thân clip nên **không cần tay cầm** nhưng cần clip đủ dài (≥ duration/2) — dip, whip, zoom, spin, roll, glitch, rgb, flash, light leak, film burn, vhs, pixelate, shake, text graphic wipe.

## Style documentary
Chỉ cho phép: cắt thẳng, các kiểu cắt mẫu, `j_l_cut`, `cross_dissolve`, `additive_dissolve`, `blur_dissolve`, `morph_cut`, `dip_to_*`, `fade_in_out`, `time_lapse`, `freeze_frame`. Cấm mọi chuyển cảnh trang trí còn lại (xem `forbidden_styles` trong preset).

## Hạn chế chung
- Mọi chuyển cảnh chồng và tuần tự chỉ tác động **hình**. Muốn nối tiếng mượt, thêm `j_l_cut` hoặc `sound_bridge` ở cùng điểm nối.
- Không dùng hai chuyển cảnh đặc biệt sát nhau (khoảng cách ≥ 3 giây; `validate` cảnh báo) và không vượt `strategy.budget.special_transition`.
- Đọc `core/decision-engine.md` và mục "Quy tắc quyết định" của từng kỹ thuật trước khi đưa vào EDL.
