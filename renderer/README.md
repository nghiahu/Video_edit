# Renderer preview

Đọc EDL + preset, render video preview (và bản cuối sau khi người dùng duyệt). Remotion + ffmpeg. Đã chạy thử trên clip thật.

## Dùng
```powershell
npm install                                              # một lần
node renderer/cli.js validate --edl projects/<id>/edl.json
node renderer/cli.js preview  --edl projects/<id>/edl.json   # → projects/<id>/out/preview.mp4
node renderer/cli.js final    --edl projects/<id>/edl.json   # → projects/<id>/out/final.mp4
```
- `validate`: kiểm tra EDL theo `schema/edl.md` (mốc, preset, khóa thông số, ngân sách, `hold` tối thiểu, style bị cấm); in cảnh báo (khoảng cách tối thiểu, L-cut làm câm clip sau...).
- `preview`: tạo proxy 540p (ffmpeg) trong `projects/<id>/proxy/`, render 960×540 (cao 540, giữ tỉ lệ), CRF 28.
- `final`: dùng footage gốc, độ phân giải `project.resolution`, CRF 18. **Từ chối chạy khi còn quyết định `proposed`.** Chỉ chạy sau khi người dùng duyệt: đặt `status: "approved"` trong EDL, hoặc thêm `--approve-proposed` khi người dùng đã duyệt toàn bộ. Quyết định `removed` luôn bị bỏ qua.
- Lần render đầu Remotion tự tải Chrome headless (cần internet). Font Google tải lúc render.
- Có thể thấy dòng `Protocol error (Page.bringToFront): Target closed` ở cuối render: cảnh báo của Remotion khi đóng tab, không ảnh hưởng kết quả.

## Cấu trúc
```
renderer/
├── cli.js            validate | preview | final
├── lib/edl.mjs       đọc, kiểm tra, "giải" EDL thành dữ liệu frame (thuần Node)
└── src/              composition Remotion (index.jsx, Root.jsx, Video.jsx, util.js, fonts.js)
```
Nguồn video lấy từ `../Video-analysis/videos/` theo `video_id` (đọc `relative_path` trong `summary.md`).

## Cách áp từng kỹ thuật
| Kỹ thuật | Hiện thực |
|---|---|
| `hard_cut` | Nối clip theo `source_in/out` (điểm cắt đã nằm trong EDL; tham số `out_tail`/`in_lead` là hướng dẫn cho AI khi chọn điểm cắt, renderer không tự dời) |
| `punch_in` | Scale lớp hình theo easing quanh `anchor_point` (`upper_third` = 50% 33%); `return`: `cut` (về 1.0 ngay sau `hold`), `zoom_out`, `keep`. Tự rút `hold` nếu vượt hết clip |
| `kinetic_text` | Lớp chữ có font preset (23 phông đăng ký trong `typography/font-registry.json`, chỉ nạp phông mà EDL dùng), `fade`/`fade_up`/`scale_fade`; cỡ chữ nhân theo chiều cao/1080; `hold` mặc định theo công thức tối thiểu |
| `j_l_cut` | Tiếng tách khỏi hình. L: tiếng clip trước kéo dài sang `tail` giây (kẹp theo độ dài file nguồn), clip sau câm `tail` giây đầu rồi vào dần. J: tiếng clip sau vào trước `lead` giây (kẹp theo `source_in`), clip trước nhỏ dần |
| `lower_third` | Khối tên + chức danh (cấp 2), vạch nhấn tuỳ chọn, trượt nhẹ từ trái, hiện `duration` giây; cần `name`, `title` trong `parameters` |
| `cross_dissolve` | Mờ chồng căn giữa điểm cắt, dùng "tay cầm" ở hai clip (không đổi tổng độ dài); tự rút nếu thiếu tay cầm và cảnh báo; chỉ tác động hình, không tác động tiếng |
| `slow_push` | Scale tăng đều (linear hoặc smoothstep) từ điểm neo đến hết `duration` (0 = hết clip), rồi giữ |
| `punch_out` | Cùng cơ chế `punch_in` nhưng khung giữ ở `start_scale` trước điểm bắt đầu, rồi lùi về 1.0 |
| `subtitles` | `parameters.cues` (mảng `{source_time, duration, text}`), mỗi cue một khối chữ ở đáy, nền mờ; `validate` kiểm tra ≤ 2 dòng, ≤ 42 ký tự/dòng, duration ≥ 1 s, cảnh báo > 17 ký tự/giây |
| `color_grade_basic` | CSS `brightness/contrast/saturate` trên hình + lớp ấm/lạnh `soft-light`; áp theo cửa sổ trong clip (`duration: 0` = cả clip). Cảnh báo nếu chỉ chỉnh một số clip |
| `vignette` | Lớp gradient radial tối dần ra mép, vào/ra mượt theo `ramp` |
| `sfx_cue` | Tra mã trong `assets/sfx/sfxlib.json`, đặt file sao cho tiếng "đập" (`a` giây) rơi đúng mốc anchor, âm lượng theo `v` hoặc `volume`; file được liên kết vào thư mục public của lần render |
| `b_roll_insert` | Không có quyết định riêng: là mẫu dựng timeline (clip + điểm nối) |
| `audio_ducking` | Đường cong dB cho nhạc: hạ trước vùng nói `lead`, hạ trong `attack`, nâng lại trong `release`; gộp vùng nói gần nhau. Cần `audio.music.file`; nếu `null` thì bỏ qua và cảnh báo |

## Quy ước kỹ thuật
- `project.fps` được làm tròn để render (29.97 → 30). Proxy cũng ép 30 fps.
- Tiếng: toàn bộ tiếng clip và nhạc đi qua lớp âm thanh riêng; lớp hình luôn câm.
- Preview dùng proxy H.264; bản cuối dùng file gốc qua hard link (không tốn dung lượng) trong `projects/<id>/.public-final/`.

## Kết quả kiểm chứng (đã chạy thật)
- Tiếng Việt có dấu hiển thị đúng với Inter (nạp subset `vietnamese`); Poppins bị loại vì không có subset này.
- `punch_in` đo được: chiều rộng slide trên hình tăng đúng ~1.12× ở preset `standard`, mắt giữ vùng 1/3 trên.
- L-cut/J-cut: năng lượng giọng nói tại vùng kéo khớp nguồn trong ~2–3 dB.
- Ducking: độ sâu đo được ≈ 11.6 dB so với mục tiêu 12 dB. Mức tuyệt đối thấp hơn tính toán ~3 dB (chưa tìm nguyên nhân; có thể do mã hóa AAC hoặc chuẩn hóa của Remotion).


## Engine chuyển cảnh dùng chung (31 kiểu)
Bảng kiểu: `renderer/lib/transitions.mjs` (overlap hay tuần tự, có lớp phủ không). Hình: `renderer/src/transitions.js` (`clipFx`, `overlayFx`, `svgFilter`). Preset: `presets/transition-presets.json`. Danh sách và cách chọn: `techniques/transitions/index.md`.
- **Chồng nhau** (cần "tay cầm" ở hai clip, tự rút và cảnh báo nếu thiếu): mờ chồng, cộng sáng, nhòe, morph (xấp xỉ), slide, push, swipe, wipe, parallax, mask reveal, iris, clock, barn door, luma, shape.
- **Tuần tự** (điểm cắt ở giữa, không cần tay cầm): dip đen/trắng, whip pan/tilt, zoom, spin, roll, glitch, rgb split, flash, light leak, film burn, VHS, pixelate, shake, text graphic wipe.
- **Đổi tốc độ** (`time_lapse`, `freeze_frame`, `speed_ramp_transition`): chia clip thành các đoạn tốc độ khác nhau; đoạn đổi tốc độ/đóng băng **không có tiếng**; mốc neo của các hiệu ứng khác được quy đổi theo đoạn.
- **`fade_in_out`** (hình + tiếng toàn video) và **`whoosh_synced_cut`** (file SFX do người dùng cung cấp).
- `validate` kiểm tra thêm: giới hạn chớp (strobes/duration ≤ 3), hướng hợp lệ theo từng kiểu, `steps`, `bars`, `start_angle`, `offset`, lệch giữa `decision.duration` và `parameters.duration` (renderer dùng `parameters.duration`).

### Đã xem/đo trên render thử
- Ảnh ghép 31 kiểu trên clip thật: mờ chồng, cộng sáng, nhòe, dip, whip, slide/push/swipe, zoom, spin, roll, parallax, iris, barn door, shape (hình thoi), glitch, rgb split, flash, light leak, film burn, VHS, pixelate, text graphic wipe hiển thị đúng thiết kế. Spin/roll đã sửa lỗi lộ góc đen (phóng đủ phủ kín khung).
- Đổi tốc độ: đoạn tua và đoạn đóng băng câm, khung đóng băng đứng yên, tổng thời lượng khớp tính toán; fade in/out lên/xuống đúng; SFX gắn đúng điểm cắt.
- **Chưa phân biệt rõ trên ảnh:** wipe, mask reveal, luma wipe, shake. **Chưa kiểm chứng:** mốc neo hiệu ứng khác sau đoạn đổi tốc độ, `time_lapse` > 16x, chi phí render của pixelate.
- Nhiều kiểu là xấp xỉ bằng CSS/SVG (morph cut, light leak, film burn, VHS, parallax, luma wipe); `easing` bị bỏ qua ở các kiểu whip/zoom/spin/roll/hiệu ứng số.

## Khối chữ dùng chung (đợt 0 và 1)
`renderer/src/TextBlock.jsx` dựng sáu kỹ thuật chữ: `text_pill`, `text_box`, `stacked_text`, `title_card`, `big_text`, `marker_highlight`. Ba lớp: kiểu chữ (màu, gradient, viền, chữ rỗng, bóng, glow, hộp, vệt bút dạ), bố cục (dòng, so le, căn đều ước lượng theo số ký tự, khớp bề ngang khung bằng đo canvas) và hoạt ảnh vào/ra (16 + 8 kiểu). Preset kế thừa khối nền `_text_style_base`. Chữ `fit_width` đo phông sau khi nạp. Đã xem ảnh render thử của cả 22 preset (khung tĩnh); **chưa xem** hoạt ảnh từng kiểu và hiển thị ở 1080p/4K.

### Đợt 2
Thêm vào `TextBlock.jsx`: biểu tượng nhỏ (`icon`), dấu ngoặc kép lớn (`quote_mark`), số đếm chạy định dạng Việt (`value`, `decimals`, `prefix`, `suffix`), ký hiệu đầu dòng và hiện từng mục (`bullet`, `item_delay`), bong bóng thoại có đuôi (`box_style: bubble`, `tail`), callout có đường chỉ vẽ dần tới điểm cố định (`target_x`, `target_y`; **không** bám vật chuyển động). Chín kỹ thuật đợt 2 dùng chung các khả năng này. Đã xem ảnh render thử của cả 25 preset (khung tĩnh).

### Đợt 4
Thêm vào `TextBlock.jsx`: đánh máy (`typewriter`, `type_speed`, `caret`; ký tự chưa hiện vẫn chiếm chỗ nên bố cục không nhảy), giải mã (`scramble`, ký tự ngẫu nhiên chốt từ trái sang phải), glitch (`glitch`; nhiễu theo frame, xác định, có `glitch_rate` ≤ 0.6), chữ cắt xén (`cutout`: SVG mask, bỏ qua hộp/sub_text) và chữ theo đường cong (`path_shape`: arc_up, arc_down, wave, circle; một dòng). Năm kỹ thuật đợt 4 dùng chung. Đã xem khung tĩnh của 13 preset ở nhiều thời điểm; hoạt ảnh vào/ra chưa xem.

### Đợt 5
Thêm vào `TextBlock.jsx`: thanh tiến độ (`progress_to`, nhãn + phần trăm làm tròn), đếm ngược (`countdown_from`, `countdown_step`, `countdown_format` number|clock, nhịp đập mỗi lần đổi số, chữ kết thúc `countdown_end_text`), cuộn tên (`credits`, `roll_speed`; dòng `## ` là đề mục, dòng `a | b` chia hai cột; mờ dần mép trên/dưới) và bảng so sánh (`table`; ô cách nhau bằng `|`, hàng hiện nối tiếp). `validate` ước lượng thời gian cuộn so với chiều cao danh sách và chặn khi thiếu. Đã xem khung tĩnh của 8 preset ở nhiều thời điểm; hoạt ảnh vào/ra chưa xem. `tracked_text` chưa làm.

### Đợt 3
Chữ theo lời nói: `parameters.words = [{text, start, end}]` (giây theo thời gian video nguồn) và `words_source` (asr|manual|subtitle_file|estimated). Renderer **không tự nhận dạng giọng nói**, chỉ đọc mốc có sẵn; thời gian khối tự tính từ từ cuối + `words_tail`. Bốn chế độ `words_mode`: `karaoke`, `highlight`, `by_word`, `chunks`. `estimated` chỉ cho bản thử: `validate` cảnh báo, `final` từ chối chạy. Đã xem hiển thị 8 preset với mốc ước lượng; độ khớp với lời nói thật chưa kiểm.

## Chưa làm
- Fade cuối nhạc, ambience nối, SFX, các kỹ thuật `planned` trong `techniques/index.md`.
- Kiểm tra QC tự động (loudness, khung đen) — hiện QC theo `workflows/quality-control.md` làm bằng tay/ffmpeg.
- Hiển thị overlay ID quyết định trên preview để người dùng dễ nói "bỏ d07".
