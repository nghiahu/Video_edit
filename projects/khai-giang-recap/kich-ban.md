# Kịch bản đề xuất: Tổng kết Lễ khai giảng khóa 38 Phân tích Dữ liệu

> **Bản nháp chờ duyệt.** Mới đọc metadata của `Video-analysis` (chưa xem lại từng clip, chưa dựng, chưa render). Mốc cắt dưới đây là điểm xuất phát lấy từ `edit_points`, sẽ chốt lại khi lập EDL.

## Mục tiêu
Một câu: *"Cho người chưa dự thấy không khí trang trọng của lễ khai giảng và vì sao chương trình đáng theo."*

## Thông số đề xuất
| Mục | Đề xuất | Lý do |
|---|---|---|
| Độ dài | khoảng 90 giây | Đủ cho mở đầu, 3–4 ý chính của diễn giả, khép lại; không dài quá cho video tổng kết |
| Tỉ lệ | 16:9, 1080p | Footage 4K ngang; chưa nói đăng ở đâu |
| Phong cách | `documentary` | Sự kiện học thuật, trang trọng |
| Nhịp | `moderate` | Có lời phát biểu cần thời gian nghe, xen cảnh học viên |
| Ngôn ngữ chữ | Tiếng Việt | Footage tiếng Việt |
| Nhạc nền | Chưa có file nhạc | Xem câu hỏi bên dưới |

## Cấu trúc
**Chương 1 — Mở đầu (~20 s):** không gian, tên sự kiện, lời chào mừng.
**Chương 2 — Lời diễn giả (~46 s):** 4 ý chính, xen cảnh học viên lắng nghe.
**Chương 3 — Khép lại (~24 s):** lời chúc, tràng vỗ tay, ảnh tập thể.

## Bảng cảnh

| # | Clip | Đoạn (s nguồn) | ≈ giây | Nội dung | Kỹ thuật dự kiến | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | `0004` b-roll | 0.5 – 4.5 | 4 | Dolly toàn cảnh lớp học | `color_grade` | Mute tiếng gốc (có tiếng chuông ở 0:07) |
| 2 | `0005` b-roll | 0.5 – 6.5 | 6 | Tiến vào màn hình "Lễ khai giảng — Phân tích Dữ liệu" | `hard_cut`, `color_grade` | Cảnh đã có dolly: **không** thêm chuyển động |
| 3 | `0006` MC | 7.2 – 17.5 | 10.3 | MC chào mừng, chương trình hợp tác chiến lược với Rikkei Education | `cross_dissolve` vào, `kinetic_text` (dữ kiện hợp tác) | Có chỗ tên viết tắt "không rõ do vang": chỉ hiện chữ phần chắc chắn |
| 4 | `0038` diễn giả | 0 – 6.9 | 6.9 | Tự hào đồng hành cùng Đại học Bách khoa và BKACAD Fintech | `l_cut`/`hard_cut` | Điểm bắt đầu giữa câu, cần nghe lại |
| 5 | `0040` diễn giả | 0 – ~10 | 10 | Định kiến "phân tích dữ liệu chỉ phục vụ một ngành" | `punch_in_subtle` (câu kết ý) | Hết ý trước khi hết clip? cần xác nhận |
| 6 | `0009` b-roll | ~3 giây | 3 | Học viên chăm chú nghe | `l_cut` giữ lời diễn giả | Cảnh phản ứng, che chỗ nối |
| 7 | `0043` diễn giả | 0.77 – 8.14 | 7.4 | "Thế giới thông tin tràn đầy… cái lớn nhất không phải là ai biết nhiều hơn" | `punch_in_subtle` ở "không phải là ai biết nhiều hơn" | **Câu then chốt của video** |
| 8 | `0044` diễn giả | 0 – 8.2 | 8.2 | AI giải quyết bài toán xử lý dữ liệu lớn | – | Liền mạch với #7 (cùng người, cùng mạch ý); cuối clip dở câu |
| 9 | `0045` b-roll | ~3 giây | 3 | Học viên nghe về tinh thần đón nhận thử thách | `l_cut` | Che chỗ cắt |
| 10 | `0036` diễn giả | 0.4 – 8.1 | 7.7 | Khóa học khó hơn, cần theo đến cùng | – | Bắt đầu/kết thúc giữa câu |
| 11 | `0048` MC | ~10 – 26.5 | ~16 | MC chúc mừng học viên khóa 38 + tràng vỗ tay | `cross_dissolve` vào, `punch_in_subtle` ở lời chúc | Mốc cắt chính xác **chưa biết**; cần nghe để lấy trọn câu chúc |
| 12 | `0049` b-roll | 0.5 – 8.5 | 8 | Chụp ảnh tập thể, giơ nắm đấm | `slow_push_subtle` nếu camera tĩnh | Cảnh kết, giữ nguyên tiếng hò reo |

Tổng ≈ 90 giây.

## Ngân sách hiệu ứng (documentary)
`punch_in_subtle` ≤ 3 (cảnh 5, 7, 11) · `kinetic_text` ≤ 3 (chỉ dữ kiện) · `cross_dissolve` 2 (vào cảnh 3 và 11, báo hiệu chuyển chương) · `lower_third`: **0** nếu chưa có tên · `subtitles`: **không dùng** (xem dưới) · `color_grade_basic`: cùng một preset cho mọi clip · không SFX.

## Những chỗ tôi chưa chắc (cần xử lý trước khi dựng)
- **Tên và chức danh các diễn giả** chưa có trong `SUBJECTS.md`. Không đoán: không có thì không dùng `lower_third`.
- **Không có nhạc nền** trong workspace. Không có nhạc thì không có ducking; video sẽ dựa vào tiếng hiện trường.
- **Phụ đề:** lời thoại trong metadata chỉ là trích đoạn (nhiều chỗ vào/ra giữa câu), chưa đủ nguyên văn để làm phụ đề đáng tin.
- **Mốc cắt cảnh 5, 6, 9, 11** là ước lượng; cần nghe lại để cắt đúng điểm hết ý.
- Tên viết tắt của viện đối tác ở cảnh 3 ("không rõ do vang"): chữ hiện trên hình chỉ dùng phần chắc chắn.
