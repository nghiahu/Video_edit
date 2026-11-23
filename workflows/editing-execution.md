# Pha 5–6 — Thực thi, xác nhận, render cuối

## Preview
1. Lưu EDL vào `projects/<project_id>/edl.json`.
2. Tạo proxy cho các clip dùng trong EDL (footage thô là 4K HEVC, nặng): `ffmpeg` chuyển sang H.264, cạnh dài 960 px, 30 fps, AAC. Lưu ở `projects/<project_id>/proxy/`, đặt tên `<video_id>.mp4`.
3. Chạy renderer preview: `node renderer/cli.js preview --edl projects/<project_id>/edl.json`. Đầu ra `projects/<project_id>/out/preview.mp4`.
4. Chạy QC (`workflows/quality-control.md`) trên preview.
5. Báo người dùng: đường dẫn preview, tóm tắt strategy, danh sách quyết định (ID + một dòng), các lo ngại từ QC.

> Renderer đã có (xem `renderer/README.md`): `validate`, `preview`, `final`. CLI tự tạo proxy và từ chối render bản cuối khi còn quyết định `proposed`. Bước 2 (tạo proxy) do CLI làm.

## Vòng xác nhận
- Người dùng nhận xét bằng ID hoặc thời điểm. Ánh xạ về quyết định, ví dụ "zoom ở 00:12" → tìm `decisions` có neo gần mốc đó.
- Sửa **chỉ quyết định bị nhắc**, theo quy tắc ở `schema/edl.md` (mục Quy tắc sửa theo ID). Không viết lại cả kế hoạch.
- Sau sửa: kiểm tra hợp lệ + ngân sách, render lại preview, QC lại.
- Ghi lại phản hồi lặp lại của người dùng (ví dụ "hay bỏ zoom") trong `projects/<project_id>/feedback.md` để dùng cho kế hoạch sau.

## Render bản cuối
Chỉ khi người dùng nói rõ đã duyệt:
1. Đặt `status: approved` cho các quyết định còn lại (trừ `removed`).
2. `node renderer/cli.js final --edl ...` với footage gốc, độ phân giải theo `project.resolution`.
3. QC lại bản cuối (ít nhất: khung đen, loudness, đồng bộ).
4. Báo cáo kết quả và đường dẫn.

## Quy tắc
- Preview và bản cuối dùng **cùng EDL**; khác biệt duy nhất là nguồn footage và chất lượng.
- Không tự render bản cuối chỉ vì preview "trông ổn".
- Không sửa metadata của `Video-analysis`.
