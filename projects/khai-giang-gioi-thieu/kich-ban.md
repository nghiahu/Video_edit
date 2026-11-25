# Kịch bản: Giới thiệu khóa học từ Lễ khai giảng khóa 38 Phân tích Dữ liệu (~2 phút)

> **Bản nháp, mốc đã dò bằng ffmpeg** (xem "Cách chốt mốc"). Chưa dựng EDL.

## Mục tiêu (một câu)
*"Cho người chưa biết thấy khóa Data Analysis dạy gì, khác biệt ở đâu và vì sao đáng theo."*

## Thông số
| Mục | Giá trị |
|---|---|
| Độ dài | **≈ 2:02 (122 s)** |
| Tỉ lệ / style / nhịp | 16:9 · `documentary` · `moderate` |
| Zoom | Không dùng (theo yêu cầu) |
| Chữ trên hình | Chỉ lấy từ lời nói trong metadata; không phủ lên người |
| Nhạc | Chưa có file |

## Cách chốt mốc
Máy chưa có công cụ nhận dạng giọng nói và metadata không có mốc từng từ. Tôi chạy `ffmpeg silencedetect` (ngưỡng −32 dB) trên từng clip để tìm **quãng lặng**, rồi ghép với số câu và độ dài câu trong `speech` của metadata để biết quãng lặng nào là ranh giới câu. Cột **Tin cậy**: *cao* = quãng lặng trùng đúng chỗ ngắt câu theo metadata; *vừa* = ghép theo độ dài câu, có thể lệch ≲1 s; *thấp* = chưa khớp được, cần nghe 1 lần.

## Bảng cảnh (mốc đã chốt)

| # | Clip | Vào → Ra (s nguồn) | Dài | Timeline | Nội dung | Vì sao chọn | Căn cứ mốc | Tin cậy |
|---|---|---|---|---|---|---|---|---|
| 1 | `0005` | 0.5 → 6.5 | 6.0 | 0:00–0:06 | Cú máy tiến vào màn hình tên sự kiện | Metadata: `high`, hợp làm cảnh mở đầu; đã có chuyển động | Mốc theo metadata; tắt tiếng gốc | cao |
| 2 | `0006` | 7.45 → 17.5 | 10.05 | 0:06–0:16 | MC chào mừng, nêu tên khóa Data Analysis và hợp tác chiến lược | Segment `hook` + `standalone` duy nhất, nêu đúng tên khóa | Lặng 7.12–7.50 (trước câu) và 17.51–17.87 (sau câu) | cao |
| 3 | `0007` | 0 → 6.9 | 6.9 | 0:16–0:23 | MC: "cái nhìn tổng quan… lộ trình, phương pháp học, giá trị chuyên môn…" | Câu dẫn sang phần giới thiệu chương trình; đổi góc so với #2 | Lời hết ở 6.91, câu dở ("trong thời gian…") | vừa (câu dở, che bằng `cross_dissolve` sang #4) |
| 4 | `0009` | 0 → 8.5 | 8.5 | 0:23–0:31 | Học viên nghe; lời: "học gì, học như thế nào… chương trình Data Analysis do Viện Công nghệ và Kinh tế số, ĐH Bách khoa" | `high`; nêu bài toán và đơn vị đào tạo | Mốc theo metadata (`in 0 / out 8.5`); lặng 3.5–4.0 là ngắt câu | cao |
| 5 | `0013` | 0 → 5.5 | 5.5 | 0:31–0:37 | Lời: "…đào tạo bài bản, thực tiễn, gắn với đầu ra nghề nghiệp rõ ràng…" | Thêm vào vì #6–#10 rút ngắn sau khi dò mốc; nói đầu ra nghề nghiệp | Không có quãng lặng; ra ở cuối clip | vừa (có thể cắt giữa từ "phân tích") |
| 6 | `0014` | 0.45 → 5.7 | 5.25 | 0:37–0:42 | Qua vai hai người dùng laptop; lời: "…nền tảng Excel, SQL…" | Hình khớp lời, trả lời "học gì" | Lặng 0.11–0.48 (đầu câu) và 5.68–6.05 (hết câu, trước "Một điểm…") | cao |
| 7 | `0015` | 0 → 5.9 | 5.9 | 0:42–0:48 | Lời: "…Python… phân tích nâng cao, tự động hóa quy trình" | `high`; bậc tiếp theo sau Excel/SQL | Lặng 5.87–6.18 sau "tự động hóa quy trình", bỏ phần "tiếp cận các bài toán…" dở câu | cao |
| 8 | `0016` | 2.74 → 7.1 | 4.36 | 0:48–0:53 | Lời: "Sau khi hoàn thành chương trình… giấy chứng nhận độc quyền" | Giá trị đầu ra | Lặng 2.52–2.74 là ngắt câu (hết "…sau khi tốt nghiệp"), vào câu mới; hết ở cuối clip | vừa (kết câu lơ lửng, cắt luôn sang #9) |
| 9 | `0017` | 1.79 → 6.51 | 4.72 | 0:53–0:58 | Lời: "Tham gia workshop, webinar hàng tháng cùng các chuyên gia…" | Quyền lợi thêm (cập nhật kiến thức) | Lặng 1.46–1.79 (đầu câu) và 6.51–6.79 (trước "Sau hơn 2 năm triển…") | cao |
| 10 | `0019` | 0 → 3.63 | 3.63 | 0:58–1:01 | Lời: "…kỹ năng làm việc với dữ liệu chính là lợi thế cạnh tranh bền vững cho mỗi cá nhân." | `high`; câu chốt chương 2 | Lặng 3.63–3.86 sau hết câu | cao (đầu câu thiếu vì clip vào giữa câu) |
| 11 | `0033` | 23.85 → 42.0 | 18.15 | 1:01–1:19 | Diễn giả: "Có rất nhiều chương trình do ĐH Bách khoa… đi cùng doanh nghiệp… thế mạnh và sự độc đáo của chương trình này" | Điểm khác biệt duy nhất nói thẳng bằng lời | Lặng dài 21.5–23.9 (2.4 s) đúng giữa câu 2 và 3; lặng 42.0–43.4 sau câu kết. Né người đi ngang (7–21 s) | cao |
| 12 | `0036` + hình `0046` (0–3.5) | 0.4 → 8.2 | 7.8 | 1:19–1:27 | Diễn giả: "…khó khăn hơn chương trình khác… theo đến cùng… dành thời gian, công sức…" | Nói thật khóa khó, cần kiên trì; `key_quote`. Cắt xen `0046` (L-cut) che chỗ vào giữa câu | Lặng 8.24–8.47 sau cụm cuối; các lặng trong clip (1.9–2.7, 3.8–4.3, 5.0–5.6) chưa khớp được với chỗ ngắt câu | **thấp** |
| 13 | `0047` | 3.3 → 14.5 | 11.2 | 1:27–1:38 | Diễn giả: "các em… nhìn thấy những cơ hội giúp có công việc, góc nhìn mới về nghề, người anh người chị dìu dắt…" | Lời mời với 3 lợi ích cụ thể. Bỏ câu "đổi tầng lớp, cái này là có thật" (≥14.7) | Lặng 2.4–3.3 (sau "có giá trị") và 14.4–14.7 (hết "thuận lợi hơn") | vừa |
| 14 | `0048` | 5.95 → 25.0 | 19.05 | 1:38–1:57 | MC: "Chúc các anh chị… hành trình chất lượng… biến kiến thức thành năng lực thực tế… Chúc khóa Data Analysis thành công tốt đẹp ạ!" + vỗ tay | Lời chúc nêu đúng giá trị khóa; vỗ tay làm điểm kết | Lặng 5.62–5.94 (sau "…khóa 38"), lặng 22.2–22.9 sau lời chúc, vỗ tay tới ~25 (metadata: vỗ tay 22–26.5, "Sau đây thì em xin…" sau đó) | vừa |
| 15 | `0049` | 0.55 → 5.5 | 4.95 | 1:57–2:02 | Ảnh tập thể, tiếng đếm "3, 2, 1, Hòooo… Xong chưa?" | `high`, cảnh kết. Âm thanh hiện trường hết ở ≈4.6, sau đó lặng đến 10 s nên ra ở 5.5 | Lặng 0–0.55 (đầu), lặng bắt đầu 4.59 | cao |

**Tổng ≈ 122 s (2:02).**

## Thay đổi so với bản nháp trước
- Quãng lặng cho thấy nhiều b-roll lời giới thiệu (`0016`, `0017`, `0019`) có ý trọn ngắn hơn dự tính, nên chương 2 từ ≈41 s xuống ≈38 s; bù bằng thêm `0013`.
- `0033` chốt vào ở 23.85 s (trước ước lượng 24 s) nhờ lặng dài 2.4 s.
- `0048` vào sớm hơn (5.95 s thay vì 8 s) để mở đúng đầu câu "Chúc các anh chị…", nên dài thêm ≈3 s; `0049` ngắn lại vì hết tiếng ở 4.6 s.

## Ngân sách hiệu ứng (đã chốt trong `edl.json`)
- Zoom: **0**. `cross_dissolve`: 2 (giữa #10 và #11 đổi chương; giữa #14 và #15 sang cảnh kết; chọn chỗ có đủ "tay cầm" ở hai clip). `j_l_cut`: 1 (#12 sang #13, lời diễn giả giữ trên hình học viên). `lower_third`: 0 (chưa có tên). Phụ đề: không.
- Chữ: 3 `text_pill_clean`, chỉ từ lời nói: "Excel, SQL" (#6, góc trên trái), "Python" (#7, góc trên phải), "Workshop, webinar hàng tháng" (#9, góc trên trái). Bỏ nhãn "Chứng nhận" (#8) vì slide trên hình đã ghi "Lễ tốt nghiệp"; chữ chạy nhãn ở góc trên để khỏi đè người ngồi laptop.
- #11, #13, #14: diễn giả/MC ở xa giữa sân khấu; nếu có chữ thì đặt phía dưới hoặc bên cạnh.

## Còn mở
1. **#12 (`0036`)** mốc độ tin cậy thấp: nghe 1 lần để chốt, hoặc đổi sang `0043` (0.77–8.14, `high`, `standalone`) nếu không cần ý "khó, theo đến cùng".
2. Mốc **vừa** (#3, #5, #8, #13, #14): lệch tối đa ≈1 s, nên nghe chỗ cắt khi dựng bản thử.
3. Nhạc nền, tên diễn giả và đơn vị đối tác, nơi đăng (16:9 hay 9:16), có giữ ý "đổi tầng lớp" không (hiện bỏ).

## Cập nhật sau phản hồi (effect và title)
Người dùng giữ nguyên các đoạn cắt, nhưng muốn **nhiều title và thẻ đa dạng** (tiêu đề mở đầu kiểu chữ khoét "KHAI GIẢNG", thẻ khi MC nói, danh sách chạy vào từng dòng ở đoạn "học gì, học như thế nào"). Bản mới có 19 thẻ chữ (xem `edl.json`, d07–d25) cộng 2 mờ chồng và 1 L-cut, style `event_recap`. Thêm kiểu `line_slide` cho `bullet_list_reveal` (từng dòng chạy vào từ mép khung).
