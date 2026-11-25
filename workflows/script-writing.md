# Lên kịch bản

Dùng ở **pha 2–3**, trước khi lập EDL. Kịch bản là bản **nháp chờ người dùng duyệt**: chọn cảnh nào, theo thứ tự nào, nói gì bằng chữ, dùng hiệu ứng gì và vì sao. Chưa phải EDL.

> Quy tắc không thương lượng: **mọi nội dung trên hình (chữ, tên, số, trích dẫn) phải truy ngược được** về một trong ba nguồn: lời nói/metadata của footage, lời người dùng, hoặc ghi rõ là **minh họa**. Không bịa lời nói, tên người, con số. Mốc thời gian và lời thoại trong `clips.md` là kết quả một mô hình khác xem video viết ra, có `confidence`; chưa kiểm lại thì ghi "cần nghe lại".

## Bước 1. Chốt đề bài (hỏi một câu một lần nếu thiếu)
| Mục | Hỏi hoặc suy ra từ |
|---|---|
| Mục tiêu một câu | "Cho người xem … thấy/hiểu/làm …" (ví dụ trong `projects/khai-giang-recap/kich-ban.md`) |
| Đối tượng và nền tảng | Quyết định tỉ lệ khung (16:9, 9:16) và nhịp |
| Độ dài | Đừng nhồi nhiều thông điệp vào đoạn ngắn |
| Style | `styles/<style>.md`; style chưa có file thì đề xuất và hỏi (xem `core/effect-selection.md`, mục 4) |
| Chữ và ngôn ngữ | Tiếng Việt có dấu → xem `typography/`; ai cung cấp tên và chức danh? |
| Nhạc và âm thanh | Có file nhạc chưa? Chưa có thì nói rõ, không giả định |

## Bước 2. Gom ứng viên từ metadata
Đọc `../Video-analysis/metadata/<video_id>/{summary.md, clips.md}` và `INDEX.md`/`TOPICS.md`.
1. Lọc đoạn có `roles` như `key_quote`, `conclusion`, `narrative`, `usable: yes`, `standalone: yes`, `priority: high`.
2. Đánh dấu rủi ro: `issues` (`bad_audio`...), đoạn bắt đầu/kết thúc giữa câu, `speech` confidence thấp, `requires_context`.
3. Tìm b-roll che chỗ nối: cảnh học viên, không gian, phản ứng.
4. Ghi vị trí chủ thể (`person_01`...) và có `on_screen_text` hay không (để né chồng chữ, R-SUBJ-1).

## Bước 3. Dựng cấu trúc
Theo `core/storytelling.md`: mở (gây chú ý, nêu bối cảnh), thân (3–4 ý, mỗi ý một đoạn), kết (khép lại, lời chúc, cảnh kết). **Không bắt buộc theo thứ tự quay**; sắp theo mạch ý. Điền mục tiêu thời lượng từng chương.

| Loại video | Gợi ý cấu trúc (điểm xuất phát, `confidence: low`) |
|---|---|
| Tổng kết sự kiện | Không khí → bối cảnh → 3–4 ý chính → phản ứng → khép lại |
| Giới thiệu chương trình | Vấn đề → chương trình → điểm khác biệt → lời mời |
| Phỏng vấn / talking head | Câu hook → ý chính xen b-roll → kết ý |
| Video ngắn dọc | Hook trong 2–3 s → một ý → kết; chữ lớn, nhịp nhanh (style chưa có file, hỏi người dùng) |

## Bước 4. Bảng cảnh
Một dòng một cảnh. Mẫu:

| # | Clip / đoạn | Mốc nguồn (s) | ≈ giây | Nội dung quan sát được | Kỹ thuật dự kiến và lý do | Chữ trên hình (nguồn) | Rủi ro, cần xác nhận |
|---|---|---|---|---|---|---|---|

Quy tắc điền:
- **Nội dung quan sát được** copy từ `visual`/`speech` trong `clips.md`, không diễn giải thêm.
- **Kỹ thuật dự kiến** chọn theo `core/effect-selection.md`; mặc định chỉ `hard_cut`. Mỗi kỹ thuật kèm một câu lý do.
- **Chữ trên hình** ghi nguồn: `metadata` (keyword, on_screen_text), `người dùng`, hoặc `minh họa`. Trích dẫn phải đúng nguyên văn `speech`, confidence ≥ medium.
- **Rủi ro**: mốc cắt chưa xác nhận, đoạn giữa câu, âm thanh kém, chủ thể giữa khung nên chữ phải xuống dưới/bên cạnh.

## Bước 5. Phân bổ hiệu ứng
1. Đặt ngân sách theo style và độ dài (`styles/<style>.md`, hoặc bảng bậc ở `core/effect-selection.md`).
2. Đi từ nhu cầu nội dung tới kỹ thuật (bảng "Chọn theo nhu cầu nội dung"), không đi từ hiệu ứng.
3. Giãn cách: `punch_in` cách ≥ 6 s, chuyển cảnh đặc biệt cách ≥ 3 s, không dồn hiệu ứng ở cùng một khoảnh khắc.
4. Đoạn quan trọng nhất (câu then chốt, khoảnh khắc cảm xúc): **bậc 0**, để nội dung tự đứng.
5. Chữ phủ giữa khung hoặc hiệu ứng ký tự mạnh chỉ trên cảnh không có chủ thể.

## Bước 6. Tự duyệt trước khi đưa người dùng
- [ ] Mỗi cảnh phục vụ mục tiêu một câu? Bỏ cảnh nào cũng không mất ý thì bỏ.
- [ ] Mạch ý nghe liền? Có chỗ nhảy ý giữa hai người nói không?
- [ ] Đoạn nào bắt đầu/kết thúc giữa câu hoặc giữa tiếng? Đã ghi "cần nghe lại"?
- [ ] Mọi chữ trên hình có nguồn? Có gì là suy đoán không?
- [ ] Hiệu ứng nào trùng loại, trùng thời điểm, hay đè lên chủ thể?
- [ ] Tổng thời lượng khớp mục tiêu (± 10%)?

## Bước 7. Trình người dùng
Gửi: mục tiêu, thông số đề xuất, cấu trúc theo chương, bảng cảnh, danh sách **câu hỏi mở** (thiếu tên, chưa có nhạc, mốc cần nghe lại). Dừng và chờ duyệt. Sau khi duyệt mới chuyển thành EDL (`workflows/edit-planning.md`, pha 4), rồi kiểm thử bằng preview (`workflows/editing-execution.md`).

## Chữ theo lời nói (đợt 3)
Muốn karaoke, tô từ khóa hay phụ đề từng từ cần mốc từng từ. `Video-analysis` hiện **không có**, máy chưa có công cụ nhận dạng giọng nói. Trong kịch bản chỉ ghi "cần mốc theo từ" và hỏi người dùng nguồn mốc (nhận dạng giọng nói, thủ công, file phụ đề có mốc từ). Không dùng mốc ước lượng cho bản giao.

## Ví dụ
`projects/khai-giang-recap/kich-ban.md`: một kịch bản tổng kết sự kiện theo khuôn trên (mục tiêu một câu, thông số, cấu trúc ba chương, bảng 12 cảnh). Dùng làm mẫu định dạng, không sao chép nội dung.
