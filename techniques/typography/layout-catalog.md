# Danh sách bố cục và kiểu chữ (kế hoạch)

> **Trạng thái:** đợt 0 (lớp kiểu chữ + hoạt ảnh dùng chung) và đợt 1 (`text_pill`, `text_box`, `stacked_text`, `title_card`, `big_text`, `marker_highlight`) **đã làm**; các đợt 2–5 còn `planned`. Mỗi đợt làm xong sẽ có tài liệu theo khuôn 10 mục, preset JSON, render thử và được đưa vào `techniques/index.md` như các kỹ thuật khác.

## Cách chia để không phải làm 50 lần cùng một việc
Chữ trong video gồm ba lớp độc lập. Làm chung từng lớp một lần, các kỹ thuật dùng lại.

1. **Lớp kiểu chữ** (trông thế nào): màu, viền, bóng, phát sáng, nền, hộp. Dùng chung cho mọi kỹ thuật.
2. **Lớp bố cục** (xếp thế nào): một dòng, hai dòng trên dưới, so le, xếp ngăn, chữ dọc, chữ xoay, chữ cong.
3. **Lớp hoạt ảnh** (vào ra thế nào): hiện, trượt, phóng, đánh máy, quét mặt nạ...

Kỹ thuật (ID dùng trong EDL) = một **chức năng** (tiêu đề, nhãn, số liệu, phụ đề...) ghép ba lớp trên. Các biến thể là preset, không phải kỹ thuật riêng.

## Lớp 1 — Kiểu chữ dùng chung (làm trước, đợt 0)
| Thành phần | Mô tả | Cách làm trong renderer | Độ khó |
|---|---|---|---|
| Màu đặc, gradient | Màu đơn hoặc chuyển màu | CSS, `background-clip: text` | thấp |
| Viền ngoài (stroke) | Viền một lớp, viền đôi, chữ rỗng chỉ có viền | `-webkit-text-stroke`, `paint-order` | thấp |
| Bóng mềm | Bóng nhòe | `text-shadow` | thấp |
| Bóng cứng, bóng lệch 3D | Bóng đặc lệch góc, nhiều lớp | `text-shadow` nhiều lớp | thấp |
| Chữ nổi khối (extrude) | Độ dày giả 3D | chồng nhiều bóng | trung bình |
| Phát sáng (glow/neon) | Viền sáng nhòe | `text-shadow` màu, nhiều tầng | thấp |
| Hạt nhiễu (grain) | Nhiễu phủ lên chữ | lớp SVG `feTurbulence` | trung bình |
| Hộp nền | Hộp chữ nhật, bo góc, **con nhộng** (bo tròn hết cỡ), băng ngang | `div` có `border-radius`, `padding` | thấp |
| Gạch chân, vạch nhấn | Vạch dưới chữ hoặc vạch bên | pseudo-element | thấp |
| Vệt bút dạ | Nền tô lệch như bút highlight | gradient/`clip-path` lệch | trung bình |
| Nhãn dán | Viền trắng dày, bóng, hơi nghiêng | stroke + shadow + `rotate` | thấp |
| Khoảng cách chữ, hoa/thường | tracking, chữ hoa, chữ thường | CSS | thấp |

## Lớp 2 — Bố cục
| ID bố cục | Mô tả | Độ khó |
|---|---|---|
| `single_line` | Một dòng (đã có ở `kinetic_text`) | thấp |
| `two_line_stacked` | Hai dòng trên dưới: nhỏ trên lớn dưới hoặc ngược lại | thấp |
| `two_line_staggered` | Hai dòng so le, dòng dưới thụt vào | thấp |
| `stacked_justified` | Mỗi từ một dòng, cỡ khác nhau, căn đều hai mép | trung bình |
| `vertical_text` | Chữ xếp dọc | thấp |
| `rotated_text` | Chữ xoay nghiêng | thấp |
| `curved_text` | Chữ chạy theo đường cong | trung bình (SVG `textPath`) |

## Lớp 3 — Hoạt ảnh vào/ra (dùng chung)
Đã có: `fade`, `fade_up`, `scale_fade`. Dự kiến thêm (khoảng 15): trượt từ cạnh, bật nảy (bounce, chỉ cho style vui), phóng bung, xoay vào, quét mặt nạ (mask reveal), hiện từng chữ cái, hiện từng từ, hiện từng dòng so le, đánh máy, giải mã (scramble), cuộn số, mờ nhòe vào, mực loang, rung nhẹ, rơi và nảy. Quy tắc theo style (ví dụ documentary cấm bounce) giữ nguyên như đang có.

## Kỹ thuật dự kiến theo đợt

### Đợt 0 — Nền (**đã làm**, xem `typography/text-style-layer.md`)
Lớp kiểu chữ ở trên + một bộ hoạt ảnh vào/ra dùng chung + sửa renderer để chữ nhận các thuộc tính mới qua preset. Kết quả: mọi preset chữ có thể bật viền, bóng, hộp, phát sáng.

### Đợt 1 — Dùng nhiều nhất (**đã làm**)
| ID | Mô tả | Ghi chú |
|---|---|---|
| `text_pill` | **Con nhộng**: nhãn ngắn trong hộp bo tròn (tên, từ khóa, tag) | hộp + chữ |
| `text_box` | Hộp/băng/banner chữ (nhiều kiểu hộp) | hộp + chữ |
| `stacked_text` | Hai dòng trên dưới, so le, hoặc xếp ngăn căn đều | dùng bố cục lớp 2 |
| `title_card` | Tiêu đề lớn giữa màn hình, nền trơn hoặc video làm mờ | cần nền làm mờ |
| `big_text` | Chữ cực lớn, tràn khung, 1–2 từ | cần cỡ chữ theo khung |
| `marker_highlight` | Từ hoặc dòng có vệt bút dạ | vệt tô lệch |

### Đợt 2 — Thông tin và trang trí
| ID | Mô tả |
|---|---|
| `chapter_title` | Số chương cộng tên chương |
| `pull_quote` | Trích dẫn có dấu ngoặc lớn, tên người nói |
| `big_number` | Con số nổi bật kèm nhãn nhỏ, có đếm số chạy |
| `bullet_list_reveal` | Danh sách hiện từng dòng |
| `location_tag` | Nhãn địa điểm, mốc thời gian |
| `text_sticker` | Nhãn dán chữ có viền trắng, nghiêng nhẹ |
| `speech_bubble` | Bong bóng thoại |
| `callout_label` | Chú thích có đường/mũi tên chỉ (cố định, không bám vật thể) |
| `social_tag` | Tag kiểu `@tên`, `#chủ_đề` |

### Đợt 3 — Chữ đi theo lời nói (**cần mốc thời gian theo từng từ**)
| ID | Mô tả |
|---|---|
| `word_highlight` | Tô sáng từ khóa đúng lúc được nói |
| `word_by_word_text` | Hiện từng từ theo lời |
| `karaoke_subtitles` | Phụ đề, từ đang nói sáng lên |
| `shortform_captions` | Phụ đề 1–3 từ cực lớn ở giữa, từ khóa đổi màu |

Metadata `Video-analysis` hiện **không có mốc theo từ**, và trong máy chưa có công cụ nhận dạng giọng nói. Đợt này cần một bước lấy mốc từ trước (cài công cụ nhận dạng, hoặc người dùng cung cấp file phụ đề có mốc từ). Làm sau khi chốt cách lấy mốc.

### Đợt 4 — Hiệu ứng chữ
| ID | Mô tả |
|---|---|
| `typewriter_text` | Chữ đánh máy |
| `scramble_text` | Chữ giải mã (ký tự nhảy rồi hiện đúng) |
| `glitch_text` | Chữ nhiễu glitch |
| `text_cutout` | Chữ cắt xén, nhìn xuyên qua chữ thấy video |
| `text_on_path` | Chữ chạy theo đường cong |
| `vertical_text`, `rotated_text` | Chữ dọc, chữ xoay (có thể gộp vào bố cục) |

### Đợt 5 — Khó hoặc để sau
| ID | Mô tả | Vì sao để sau |
|---|---|---|
| `tracked_text` | Chữ ghim theo vật thể chuyển động | cần theo dõi chuyển động (tracking), chưa có công cụ |
| `comparison_table` | Bảng so sánh | nhiều dữ liệu cấu trúc, cần thiết kế riêng |
| `credits_roll` | Cuối phim cuộn tên hoặc xếp danh sách | cần dữ liệu danh sách và nhịp cuộn |
| `countdown_timer` | Đồng hồ đếm ngược | cần thiết kế số lớn và nhịp |
| `progress_bar` | Thanh tiến độ | làm cùng `big_number` nếu cần |

## Quy ước chung cho mọi kỹ thuật chữ (sẽ kiểm tra bằng `validate`)
- Phông phải có trong `typography/font-registry.json` và đúng vai trò (phụ đề không dùng phông viết tay hoặc bay bổng).
- Chữ nhấn tối đa 6 từ; thời gian hiện tối thiểu theo công thức đọc đã có (`min_hold`).
- Tương phản chữ với nền phải đọc được; kiểu có hộp hoặc viền được ưu tiên khi nền rối.
- Cấp chữ (nhấn, thông tin, nền) theo `typography/hierarchy.md`: một cấp nhấn mỗi khung.
- Style documentary chỉ cho kiểu tiết chế (không viền dày, không phát sáng, không sticker, không bounce).

## Việc cần bạn quyết trước khi làm
1. **Làm đợt nào trước?** Đề xuất: đợt 0 rồi đợt 1 (kiểu con nhộng, hộp, hai dòng, title card, chữ lớn, vệt bút dạ).
2. **Đợt 3** (chữ theo lời): bạn muốn cài công cụ nhận dạng giọng nói, hay bạn có sẵn file phụ đề có mốc thời gian?
3. **Style nào sẽ dùng các kiểu này?** Nếu bạn nói trước loại style (ví dụ vlog dễ thương, tin tức, quảng bá công nghệ), tôi sẽ ưu tiên preset và phông cho đúng style đó.
