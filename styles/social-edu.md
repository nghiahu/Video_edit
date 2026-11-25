# Style: Social giáo dục (rút từ hai video mẫu Rikkei Academy)

Cảm giác: nhanh, nhiều chữ, màu thương hiệu rõ, người nói nhìn thẳng vào máy. Dành cho video ngắn quảng bá sự kiện/webinar, phỏng vấn học viên, chia sẻ kinh nghiệm trên nền tảng mạng xã hội.

> **Nguồn và độ tin cậy.** Rút ra từ hai video `REF_001` (webinar, 1:1, 70 s) và `REF_002` (phỏng vấn, 9:16, 121 s): chi tiết và số đo ở `references/videos/`. Chỉ là **hai video, bản 360p, `reviewed: false`**, chưa nghe âm thanh. Mọi con số ở đây là `observed`, `confidence: low`; coi là điểm xuất phát, không phải chuẩn. Không sao chép video, chỉ rút kỹ thuật.

## Hợp với / không hợp với
- **Hợp:** video quảng bá sự kiện, giới thiệu khóa học, phỏng vấn học viên, chia sẻ ngắn trên mạng xã hội; người nói chính diện, nền gọn.
- **Không hợp:** documentary/sự kiện trang trọng (dùng `styles/documentary.md`), lời nhân chứng cần để trần.

## Chiến lược mặc định (`strategy`)
```json
{
  "style": "social_edu",
  "pacing": "fast",
  "visual_intensity": "high",
  "typography_style": "bold_emphasis",
  "transition_style": "mostly_hard_cut",
  "motion_style": "text_driven"
}
```
Mọi quy tắc chung của skill vẫn áp dụng: `R-SUBJ-1` (không đè mặt và thân chủ thể), `R-SRC-1` (chữ phải có nguồn), `R-ZOOM-0` (không tự dùng zoom; hai video mẫu cũng không dùng zoom khi người nói đang nói).

---

## A. Cách làm chữ (kiểu chữ)

| Vai trò | Kiểu (quan sát) | Ghi chú |
|---|---|---|
| **Phụ đề cụm** (REF_002) | Chữ **trắng**, **viền navy dày**, không hộp nền; sans đậm không chân; cụm 2–5 từ | Dải chữ cao ≈ 5,3% chiều cao khung, rộng tối đa ≈ 80% khung |
| **Chữ nhấn đỏ in hoa** (REF_001) | Đỏ ≈ `#D32130`…`#EF2C34`, in hoa, đậm; 1–3 từ (`MỜ NHẠT`, `TRỐNG TRẢI`, `CÒN BẠN`, `SỰ THẬT LÀ`), có thể kèm emoji | Cỡ lớn hơn dòng giải thích; đổi mỗi ~2 s ở đoạn hook |
| **Dòng giải thích navy** (REF_001) | Navy ≈ `#0A1181`, đậm, cỡ nhỏ (≈ 6% chiều cao khung), đặt trên đầu khung | Đi cặp với chữ nhấn đỏ |
| **Thẻ tiêu đề** (REF_001) | Từ khóa chữ viết tay đỏ (`Workshop`) + tiêu đề navy đậm hai dòng; logo hiện sau ~2–3 s | Một lần ở cuối đoạn giới thiệu |
| **Thanh tên** (REF_002) | Chip xanh đậm (≈ `#2F51E1`) chữ trắng cho tên + thanh trắng chữ đen cho chức danh | Dưới cằm, bên trái (x ≈ 6–55%, y ≈ 55–60%) |
| **Thẻ câu hỏi** (REF_002) | Hộp trắng bo góc, viền xanh, chữ xanh đậm nhỏ; huy hiệu `?` vàng (≈ `#E5B506`) gối lên góc trên trái | Rộng ≈ 82% khung, y ≈ 56–72% |
| **Thẻ danh sách** (REF_001) | Thẻ trắng viền xanh, tiêu đề đỏ có biểu tượng (`BẠN SẼ NHẬN ĐƯỢC`), mục tích xanh, logo cuối thẻ | Đặt trên b-roll **làm mờ mạnh** |
| **Nhãn thông tin** (REF_001) | Hộp viền xanh (`ĐẶC BIỆT: …`); chữ đỏ có biểu tượng cho ngày giờ (`⏰ 20h00 – 11/09/2026`) | CTA |
| **Logo** | Góc trên trái nhỏ suốt video (REF_002); thẻ kết logo ≈ 6 s (REF_002) hoặc poster ≈ 3 s (REF_001) | |

Màu thương hiệu: **đỏ + xanh navy/xanh dương + trắng**. Dùng màu thương hiệu của dự án thay cho màu ở đây khi khác.

## B. Cách chèn chữ (vị trí, nhịp, thời lượng)
- **Mở bằng chữ trong ~1 giây đầu** (câu hỏi hoặc tự giới thiệu), rồi đảo ý (`SỰ THẬT LÀ…`).
- **Không để màn hình im chữ quá vài giây** ở video quảng bá; chữ đổi theo ý nói.
- **Chữ nhấn:** 1–3 từ, hiện ≤ ~2 s; dòng giải thích đi kèm nhỏ hơn.
- **Phụ đề cụm:** mọi lời nói đều có chữ; cụm đổi **trung vị 1,07 s** (khoảng 0,2–3,4 s); **chữ vẫn chạy trên b-roll** khi giọng tiếp tục.
- **Thẻ câu hỏi:** hiện lúc bắt đầu câu hỏi, giữ ≈ 3,7 s, mờ ra ~0,25 s rồi phụ đề cụm vào đúng vị trí.
- **Thanh tên:** hiện ~1 s sau khi mở, giữ ≈ 4 s, một lần.
- **Danh sách:** mỗi mục một nhịp 3,0 s (xem D).
- **Vị trí:** phụ đề tâm khoảng 65% chiều cao (dưới cằm, trên thân); chữ nhấn ở trên đầu hoặc giữa khung ở cảnh không che mặt. **Hai video mẫu đặt chữ lên thân người nói nhưng không che mặt**; skill giữ `R-SUBJ-1`: chữ không che mặt và thân trên, khai báo `subject_box`.

## C. Cách chèn hiệu ứng (đã quan sát, thời lượng tính theo khung 30 fps)
| Hiệu ứng | Khi dùng (quan sát) | Thời lượng | Ánh xạ sang thư viện |
|---|---|---|---|
| Mở từ trắng mờ (blur/flash-in) | Khung đầu video | ~0,2–0,3 s | `dip_to_white` / `fade_in_out` (gần đúng) |
| **Glitch zoom-through** | Đổi cảnh trong hook: cảnh cũ mờ, phóng to, tách màu RGB; cảnh mới là ô nhỏ phóng dần đầy khung | ~0,3–0,4 s | `glitch` hoặc `rgb_split` + `zoom_transition` (chưa có kiểu "ô nhỏ phóng ra" đúng như mẫu) |
| **Whip-blur-in** sau mờ dần | Sang b-roll | ~0,3–0,5 s | `whip_pan` (gần đúng) |
| **Blur-zoom** che cú đổi khung | Vào câu hỏi | ~0,4 s | `blur_dissolve`/`zoom_transition` (gần đúng) |
| **Quét đường trắng rồi mở thanh tên** | Thanh tên | ~0,4 s | `lower_third` (khác kiểu hoạt ảnh) |
| **Thẻ câu hỏi hiện mờ + phóng nhẹ** | Câu hỏi | ~0,4 s vào, ~0,25 s ra | `text_box` với `scale_fade` (thiếu huy hiệu `?`) |
| **Chữ bật có bóng mờ kéo ngang** | Chữ nhấn đỏ | ~0,4 s | `big_text` với `pop` (gần đúng) |
| **Chữ rải từng ký tự rồi dồn về hàng** | Dòng giải thích navy | ~0,5 s | `scramble_text`/`letter_stagger` (gần đúng) |
| **Sticker biểu tượng bật lên** | Nhấn ý (CV có dấu chấm than) | ngắn | `text_sticker` (thiếu thư viện biểu tượng) |
| **Thẻ trên b-roll mờ nặng** | Danh sách quyền lợi | – | `title_card_blur` hoặc `bg_mode: blur` + `bullet_list_reveal` |
| **Logo 3D trượt vào** | Thẻ kết | ~1 s | chưa có (dùng thẻ logo tĩnh) |

Ngân sách tham khảo (từ hai mẫu, `confidence: low`): chuyển cảnh đặc biệt **~2–3 lần/phút** (REF_001 có glitch zoom-through ở ~9 s và whip-blur-in ở ~34 s); b-roll phủ lên lời nói chiếm **~14%** thời lượng (REF_002: 4 đoạn, 3,1–5,7 s mỗi đoạn); chữ nhấn liên tục.

## D. Motion và nhịp chuyển động
- **Máy quay: tĩnh.** Cả hai mẫu không thấy zoom/punch trong cảnh người nói (chưa đo kỹ); chuyển động đến từ **chữ và chuyển cảnh**. Khớp `R-ZOOM-0`.
- **Nhịp theo lưới.** Phần liệt kê quyền lợi (REF_001) cắt hoặc hiện mục mới **đúng bội số 3,0 s** (37,0 / 40,0 / 43,0 / 46,0 / 49,0 / 52,0 s). Dùng lưới nhịp cố định cho các danh sách: `item_delay` 3,0 s.
- **Chuyển cảnh che cú đổi khung.** Ở REF_002, blur-zoom (~0,4 s) che một cú đổi khung ngay lúc vào thẻ câu hỏi; ở REF_001 glitch zoom-through che chuyển địa điểm.
- **B-roll che chỗ nối** và để giọng tiếp tục (L-cut): chữ phụ đề không dừng khi sang b-roll.

## E. Cấu trúc gợi ý
| Video | Cấu trúc (quan sát) |
|---|---|
| Quảng bá webinar (REF_001, ~70 s) | Hook câu hỏi ~9 s → vấn đề ~12 s → giải pháp, thẻ tiêu đề ~12 s → quyền lợi trên b-roll ~20 s (lưới 3 s) → CTA có ngày giờ và quà ~12 s → thẻ kết ~3 s |
| Phỏng vấn (REF_002, ~121 s) | Chào + thanh tên ~5 s → câu hỏi (thẻ) → trả lời có phụ đề cụm, xen b-roll 3–6 s → câu hỏi tiếp (ba thẻ) → thẻ logo kết ~6 s |

## F. Luật gợi ý (`confidence: low`, quan sát hai video)
- `R-SOC-1`: 1 giây đầu có chữ (câu hỏi hoặc tên người nói).
- `R-SOC-2`: phụ đề cụm 2–5 từ; không để cụm tồn tại > ~3,5 s.
- `R-SOC-3`: chữ nhấn 1–3 từ, ≤ 2 s; luôn đi cặp dòng giải thích nhỏ hơn.
- `R-SOC-4`: b-roll che chỗ nối dài 3–6 s, chiếm khoảng 10–15% thời lượng; giữ giọng và phụ đề chạy tiếp.
- `R-SOC-5`: danh sách theo lưới cố định (3,0 s mỗi mục).
- `R-SOC-6`: kết bằng thẻ logo hoặc poster (3–6 s); lời kêu gọi có ngày giờ cụ thể (chỉ khi người dùng cung cấp, `R-SRC-1`).
- `R-SOC-7`: chuẩn hóa âm lượng cuối về khoảng **−14 LUFS**, đỉnh ≤ −1 dBFS (hai mẫu đo −14,1 LUFS, đỉnh −1,0 và −0,7 dBFS); phải **đo**, agent không nghe được.

## Preset đã tạo (`presets/typography-presets.json`, `source_of_values: observed`, `confidence: low`)
Chỉ dùng kỹ thuật chữ có sẵn; `allowed_styles: [social_edu, social]`, cấm `documentary`. Đã render thử ở project thử `test-social-edu` (đã xóa 25/11/2026) (xem khung preview 960×540).
| Preset | Kỹ thuật | Vai trò | Ghi chú |
|---|---|---|---|
| `social_caption_chunk` | text_box | Phụ đề cụm 2–5 từ | Trắng, viền navy 10 px, không hộp, ~65% chiều cao. **Nằm trên thân người nói**: khai báo `subject_box` chỉ phần đầu, nếu không `validate` cảnh báo (xung đột với `R-SUBJ-1`, người dùng quyết) |
| `social_emphasis_red` | big_text | Chữ nhấn đỏ in hoa 1–3 từ | Nảy vào, trên đầu khung |
| `social_note_navy` | text_box | Dòng giải thích navy | Nhỏ; thấy yếu trên nền sáng có trần, cần kiểm từng cảnh |
| `social_question_card` | text_box | Thẻ câu hỏi | Trắng viền xanh; **chưa có huy hiệu "?"**; mặc định `top_center` để không che người nói (mẫu đặt giữa-dưới, đè thân); đã render thử ở 16:9, chưa thử 9:16; người nói cận cảnh sát mép trên thì đổi `position` |
| `social_name_chip` + `social_title_bar` | text_pill + text_box | Thanh tên + chức danh | Hai quyết định cùng thời điểm; chưa có hoạt ảnh quét đường trắng |
| `social_list_card` | bullet_list_reveal | Danh sách, 3,0 s mỗi mục | Đã render: hiện tuần tự, tích xanh đúng; **mặc định `center` che người nói**, nên đặt trên b-roll/nền không có người hoặc đổi `position` |
| `social_title_card` | title_card | Thẻ tiêu đề trên nền mờ | Đã render: đọc được, nền mờ hơi bạc; chữ hơi nhỏ, cân nhắc tăng `font_size` |
| `social_info_box` | text_box | Hộp thông tin viền xanh | Đã render: đúng |
| `social_date_tag` | location_tag | Ngày giờ chữ đỏ, biểu tượng đồng hồ | Đã render |
Đã xem khung: caption, emphasis, note, question, name chip, title bar, date tag (đúng màu, đọc được ở 960×540). Đã xem thêm list_card, title_card, info_box (project thử `test-social-edu-2` (đã xóa 25/11/2026)). Chưa nghe âm; chưa thử trên video 9:16 thật; font là Inter (mẫu không rõ font).

## G. Thẻ và hiệu ứng riêng của mẫu: đã làm thử
Thêm vào renderer (`TextBlock.jsx`) và preset; đã render thử ở project thử `test-social-edu-b` (đã xóa 25/11/2026) (xem khung 960×540):
| Preset | Làm gì | Kết quả xem khung |
|---|---|---|
| `social_question_badge` | Huy hiệu `?` vàng gối góc thẻ câu hỏi (`badge_text`…) | Đúng |
| `social_name_sweep` + `social_title_bar_sweep` | Đường trắng quét ngang rồi mở chip và thanh chức danh (`sweep_line`) | Đúng |
| `social_emphasis_ghost` | Chữ đỏ có vệt bóng mờ kéo ngang rồi tan (`ghost_x`) | Thấy vệt kéo ở ~0,15 s đầu |
| `social_note_scatter` | Ký tự rải rồi dồn về hàng (`in_animation: letter_scatter`) | Đúng |
| `social_sticker_cv` | Sticker chữ kèm biểu tượng tài liệu có dấu chấm than (icon `doc_alert`, `alert`) | Biểu tượng hiện, khá nhỏ |
| `social_end_logo` | Thẻ kết nền trắng, chữ/logo xoay 3D trượt vào (`in_animation: rotate_y`) | Trượt vào thấy rõ; độ nghiêng 3D nhẹ, khó thấy |
Chữ `LOGO` là chỗ giữ chỗ, chưa có tệp logo thật (renderer chưa nhận ảnh logo). **Vẫn chưa có:** glitch zoom-through đúng kiểu "ô nhỏ phóng ra", thư viện sticker/biểu tượng đầy đủ (mới 2 biểu tượng), logo dạng ảnh.

### Thẻ có sẵn trong thư viện, bản màu social_edu
Đã render thử ở project thử `test-social-edu-a` (đã xóa 25/11/2026): `social_big_number`, `social_pull_quote`, `social_callout`, `social_speech_bubble`, `social_sticker`, `social_tag_blue`, `social_chapter`, `social_progress`, `social_table`, `social_countdown`. Tất cả hiện đúng; đặt lệch trái/phải để chừa người nói giữa khung. Lưu ý: `social_progress` và `social_countdown` cùng vùng trái, không đặt đồng thời; nhãn nhỏ `social_big_number` khó đọc trên nền tối.

## H. Chưa kiểm chứng
- Mọi giá trị đến từ hai video 360p, một nguồn; chưa so với video khác của cùng thương hiệu.
- Không biết font thật; chưa nghe (nhạc nền, hiệu ứng âm).
- Con số kích thước chữ là ước lượng từ điểm ảnh ở độ phân giải thấp.
- Preset đã tạo (mục trên) nhưng mới xem một phần; hiệu ứng riêng của mẫu (mục G) vẫn chưa có.
