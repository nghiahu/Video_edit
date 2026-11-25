# Danh sách task (bản dễ đọc)

Bản rút gọn của `docs/task-log.md`. Chi tiết, bằng chứng và giới hạn xem bản đầy đủ.

Ký hiệu: ✅ xong · 🟡 xong nhưng có chỗ chưa kiểm · ⏸ tạm tắt · 🗑 đã xóa · ⬜ chưa làm

---

## Video-analysis (phân tích và lưu footage)

- ✅ Công cụ dòng lệnh: `status`, `prepare`, `validate`, `finalize`, `sync`, `search`, `clean`
- ✅ Chuẩn metadata v2 (tách phần quan sát và phần suy luận dựng phim)
- 🟡 Phân tích 44 video (khoảng 533 giây, 54 đoạn): lời thoại do mô hình khác chép, chưa có mốc từng từ
- ✅ Chỉ mục: `INDEX.md`, `TOPICS.md`, `SUBJECTS.md`; tìm kiếm theo chủ đề, vai trò, loại đoạn

---

## Video-edit (dựng video)

### Nền tảng
- ✅ Chốt phạm vi: Video-edit là chính, kế hoạch + preview trước, render cuối sau khi duyệt
- ✅ Skill điều phối 6 pha, Decision Engine, định dạng EDL, quy trình
- 🟡 Renderer: `validate`, `preview`, `final`. Đã render thử `final` (2 clip 4K → 1080p, 10,9 s, `projects/test-final` (đã xóa 25/11/2026)); **âm lượng chưa chuẩn hóa** (đo −33,8 LUFS)

### Thư viện hiệu ứng
- 🟡 Camera, thời gian, màu, âm thanh (J/L cut, ducking, màu, vignette chưa xem/nghe kỹ)
- ✅ 31 kiểu chuyển cảnh
- ✅ 23 phông chữ (Inter + 22 phông) có ảnh mẫu
- 🟡 Hệ chữ dùng chung, đợt 0 đến 5: hoạt ảnh vào/ra chưa xem
  - ✅ Đợt 1: pill, hộp, hai dòng, tiêu đề, chữ lớn, bút dạ
  - ✅ Đợt 2: chương, trích dẫn, số liệu, danh sách, địa điểm, nhãn dán, bong bóng thoại, callout, tag
  - ✅ Đợt 4: đánh máy, giải mã, glitch, chữ cắt xén, chữ theo đường cong
  - ✅ Đợt 5: thanh tiến độ, đếm ngược, cuộn tên, bảng so sánh
  - 🟡 Đợt 3: chữ theo lời nói, phần hiển thị xong nhưng cần mốc từng từ thật

### Hướng dẫn và công cụ
- ✅ Hướng dẫn chọn hiệu ứng (cảnh nào dùng gì) và hướng dẫn lên kịch bản
- 🟡 Skill `/edit` (làm từ đầu đến preview): có project `khai-giang-gioi-thieu` (kịch bản, EDL, preview 122 s, ngày 23/11) chạy ngoài phiên này; chưa được đánh giá
- 🟡 Kịch bản kiểm thử tổng hợp: đã xem 29 kiểu chữ ở khung tĩnh; các project thử đã xóa
- ⏸ Zoom: tạm tắt theo yêu cầu của bạn
- 🗑 Dọn `projects/`: đã xóa 16 thư mục, gồm video khai giảng và các project thử

---

### Style và video mẫu (cập nhật 25/11/2026)
- ✅ 3 style: `documentary`, `social-edu` (rút từ 2 video Rikkei), `social` (rút từ 10 video mẫu, 10 dạng video, 26 luật `R-SM-*`)
- ✅ 12 video mẫu phân tích (`references/videos/REF_001…REF_012`); 3 video đọc được lời qua phụ đề; chưa nghe âm thanh
- 🟡 Preset `social_edu`: 27 preset chữ, đã render thử (project thử đã xóa 25/11/2026); chưa thử trên video 9:16 thật
- 🟡 Renderer thêm: huy hiệu, vệt quét, bóng mờ kéo ngang, chữ rải ký tự, xoay 3D vào, 2 biểu tượng mới
- ⬜ Phần còn thiếu của style `social` (luân phiên bố cục, gạch ngang, thẻ so sánh, vẽ dần SVG, CTA mạng xã hội…)
- 🟡 `sfx_cue` (hiệu ứng âm) và một số sửa renderer: thêm ngoài các phiên của tôi; tài liệu `sfx-cue.md` còn 3 lỗi `check-docs`

## Quy tắc rút ra từ phản hồi của bạn

- ✅ Không đè chữ hoặc hiệu ứng lên mặt và thân chủ thể chính
- ✅ Chữ, tên, con số, trích dẫn phải có nguồn hoặc ghi rõ là minh họa
- ✅ Không tự dùng zoom
- ✅ Báo trung thực cái đã xem, chưa xem, chưa nghe

---

## Lỗi đã tìm ra và sửa

- ✅ Chữ chèn dòng nhau, vệt bút dạ tô nửa vời
- ✅ Con trỏ đánh máy nằm dưới hàng chữ
- ✅ Nhãn thử đè lên chữ của hai kiểu
- ✅ Đường sóng làm chữ đè nhau
- ✅ Zoom giật (khung đầu nhảy, zoom về 1.0 trong một khung); sau đó bạn yêu cầu bỏ zoom

---

## Việc còn lại

- ⬜ Lấy mốc theo từng từ (cần bạn chọn: tải mô hình nhận dạng giọng nói hoặc dùng file phụ đề có mốc từ)
- ⬜ Chạy thử `/edit` với một yêu cầu thật
- ⬜ Xem hoạt ảnh vào/ra của các kiểu chữ
- ⬜ Nghe âm thanh preview và chuẩn hóa âm lượng (agent không nghe được)
- ⬜ Render thử bản `final` ở độ phân giải gốc
- ⬜ Sửa các tài liệu còn nhắc tới project đã xóa
- ⬜ Thêm style ngoài `documentary`
- ⬜ Chữ theo vật chuyển động (`tracked_text`) và chữ dọc (`vertical_text`)
- ⬜ Nghe lại lời trong metadata Video-analysis trước khi dùng làm chữ trên hình
