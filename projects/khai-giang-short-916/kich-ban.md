# Kịch bản: Video ngắn 9:16 — "Kỹ năng dữ liệu là lợi thế cạnh tranh" (~51 s)

Style `social` (`styles/social.md`). Dạng: giới thiệu ngắn có luận điểm → ví dụ cộng dồn → khác biệt → kết bằng người thật.
Mốc nguồn theo kịch bản `khai-giang-gioi-thieu` (đã dò quãng lặng). Chữ đều rút từ lời nói trong metadata; **mốc hiện chữ trong clip là ước lượng**.

| # | Clip | Nguồn (s) | Timeline | Lời (metadata, tóm tắt) | Hình (khung dọc) | Chữ + nguồn | Vai trò |
|---|---|---|---|---|---|---|---|
| 1 | 0019 | 0 → 3.63 | 0:00–0:04 | "…kỹ năng làm việc với dữ liệu chính là lợi thế cạnh tranh bền vững cho mỗi cá nhân." | Học viên mở laptop | Khung 0: "Kỹ năng dữ liệu là" + **LỢI THẾ CẠNH TRANH** (lời 0019) | Hook: luận điểm (`R-SM-2`) |
| 2 | 0009 | 0 → 8.5 | 0:04–0:12 | "…học gì, học như thế nào… chương trình Data Analysis do Viện Công nghệ và Kinh tế số, ĐH Bách khoa Hà Nội" | Học viên lắng nghe | Thẻ câu hỏi "Học gì? Học như thế nào?" rồi thẻ tiêu đề "Data Analysis" + đơn vị (lời 0009) | Câu hỏi → tên chương trình (~15%) |
| 3 | 0014 | 0.45 → 5.7 | 0:12–0:17 | "…nền tảng Excel, SQL…" | Qua vai người dùng laptop | **EXCEL · SQL** (lời 0014) | Ví dụ 1 |
| 4 | 0015 | 0 → 5.9 | 0:17–0:23 | "…Python… phân tích nâng cao, tự động hóa quy trình" | Laptop cận | **PYTHON** + "Phân tích nâng cao · tự động hóa" (lời 0015) | Ví dụ 2 |
| 5 | 0017 | 1.79 → 6.51 | 0:23–0:28 | "Tham gia workshop, webinar hàng tháng cùng các chuyên gia" | Màn hình + người trình bày | Hộp "Workshop · webinar hàng tháng" (lời 0017) | Ví dụ 3 |
| 6 | 0033 | 23.85 → 42.0 | 0:28–0:46 | "Có rất nhiều chương trình… khi đi cùng doanh nghiệp… chuyên gia công nghệ… tiếp cận thị trường thực tế… Đấy chính là thế mạnh và sự độc đáo" | Diễn giả trên sân khấu (toàn) | **ĐIỂM KHÁC BIỆT** + danh sách 2 mục cộng dồn, rồi **THẾ MẠNH & SỰ ĐỘC ĐÁO** (lời 0033) | Bằng chứng / khác biệt; nhịp do chữ (`R-SM-20`, `R-SM-25`) |
| 7 | 0049 | 0.55 → 5.5 | 0:46–0:51 | Đếm "3, 2, 1" chụp ảnh tập thể | Ảnh tập thể | **KHÓA 38** + "Data Analysis" | Kết bằng người thật (`R-SM-8`) |

## Tự duyệt
- Hook có chữ từ khung đầu, là luận điểm của cả video; được "trả" bằng ví dụ (3–5) và khác biệt (6).
- Cắt ở quãng lặng giữa câu (gần `R-SM-17`; chưa có mốc từng từ).
- Chữ ở vùng trên khung, né mặt (`R-SM-12`); khai báo `subject_box` từng clip.
- Không zoom, không phụ đề cụm (thiếu mốc lời), không nhạc.
- Rủi ro: cảnh 6 dài 18 s một góc rộng, người nói nhỏ trong khung dọc; nhịp dựa hoàn toàn vào chữ.

## Bản 2 (25/11/2026): thêm thẻ mới
- Cảnh 3–5: thay ba thẻ chữ rời bằng **bảng dựng dần** "Học gì? / Nội dung" (`table_build_social`), mỗi hàng hiện khi lời nói tới, hàng cũ ở lại (`R-SM-25`).
- Cảnh 6: thay danh sách bằng **thẻ so sánh** "Đào tạo riêng (trường đại học) vs Cùng doanh nghiệp (chuyên gia · thị trường)" theo lời 0033, thẻ thứ hai bật sáng; thêm **luân phiên bố cục** 4,3 s (thẻ màn hình là ảnh slide "Lễ khai giảng" chụp từ clip 0005, thẻ dưới là diễn giả).
- Không dùng: gạch ngang (lời không có ý phủ định), ảnh bay (chưa có ảnh kết quả thật), CTA Follow/bình luận (chưa có tên kênh), mũi tên (chưa có tên diễn giả để gắn nhãn).
- Bản 1 giữ ở `edl-v1.json`, `make-edl-v1.cjs`, `out/preview-v1.mp4`; `out/final*.mp4` vẫn là bản 1.
