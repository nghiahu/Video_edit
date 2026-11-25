# Style: Social (video ngắn mạng xã hội)

Cảm giác: rõ ý trong vài giây đầu, chữ là một phần của hình, nhịp đến từ **lời nói, cắt cảnh và lớp đồ họa**, không từ zoom. Dành cho video ngắn dọc (TikTok, Reels, Shorts) và ngang (giới thiệu sản phẩm, giải thích kiến thức, tổng kết).

> **Nguồn và độ tin cậy.** Rút từ 10 video mẫu `REF_003`…`REF_012` (phân tích hai lần; lần 2 đọc lại lời nói qua phụ đề in trên hình và xem 2–6 khung/giây toàn bài; chi tiết ở `references/videos/`) và tài liệu web về video ngắn (số liệu yếu). Video mẫu là **bản độ phân giải thấp (360–1024p)**, `reviewed: false`, **chưa nghe âm thanh**. Mọi con số là `observed`, `confidence: low`. Cột "Mẫu" cho biết luật dựa trên mấy video. Không sao chép video, chỉ rút kỹ thuật. Khác `styles/social-edu.md` (rút từ 2 video Rikkei).

## 0. Cách dùng file này
1. Chọn **dạng video** ở mục 1 (quyết định cấu trúc và nhịp).
2. Dựng mạch theo khuôn ở mục 1, rồi áp **chữ** (mục 2–3), **hiệu ứng** (mục 4), **nhịp** (mục 5).
3. Kiểm tra luật ở mục 7. Mọi luật chung vẫn áp dụng: `R-SUBJ-1` (không che mặt và thân chủ thể), `R-SRC-1` (chữ phải có nguồn), `R-ZOOM-0` (không tự zoom). Cả 10 mẫu **không dùng zoom số** trên người nói.
4. Thứ chưa có trong thư viện (mục 8) thì báo người dùng, không giả lập bằng cách khác mà không nói.

```json
{ "style": "social", "substyle": "talking_head", "pacing": "fast", "visual_intensity": "medium",
  "typography_style": "caption_plus_emphasis", "transition_style": "mostly_hard_cut", "motion_style": "graphics_driven" }
```

---

## 1. Dạng video và khuôn mạch kể
| Dạng (`substyle`) | Khi dùng | Khuôn mạch (quan sát) | Mẫu |
|---|---|---|---|
| **Hỏi–đáp / chia sẻ dài** (`talking_head`) | Diễn giả trả lời câu hỏi, bài nói | Vấn đề do người hỏi tự nêu (hook) → bình thường hóa → câu hỏi chẩn đoán → **luận điểm có con số ở ~25% thời lượng** → chuyện thật có số liệu → khung lý thuyết → ví dụ từng bước → nguyên tắc chung → nhắc lại luận điểm, dừng | REF_003 |
| **Podcast có khách** (`talking_head`) | Hai người, khách chia sẻ mẹo | Chi tiết lạ nhất làm hook → **phản ứng** người nghe → thẻ đề mục "cách X làm Y:" → luận điểm có b-roll trước/sau → các mẹo, mỗi mẹo một nhãn `TÊN:` → tóm lại → phản ứng "wow" làm cao trào → hình kết không chữ | REF_005 |
| **Hướng dẫn ngắn + mời nhận tài liệu** (`talking_head`) | Dạy một quy trình, có tài liệu/khóa học | Lời hứa (thời gian + đối tượng + lợi ích) kèm ảnh kết quả → các bước có số `Bước x/n` → giảm lo lắng ("không cần tự làm") → cá nhân hóa → kết quả → **đặt kỳ vọng thật** (đoạn dài nhất) → kinh nghiệm bản thân → vấn đề–giải pháp → CTA nhận tài liệu → CTA theo dõi | REF_012 |
| **So sánh A/B** (`fast_ad`) | Hai lựa chọn, trước/sau | Lời hứa so sánh (một take, nhãn nêu cả hai vế) → vế yếu → vế mạnh (leo thang) → nhận xét bằng take khác. Hai vế khác nhịp và chất liệu | REF_004 |
| **Clip ngắn kể một tình huống** | Quảng cáo/gag 10–20 s | Thiết lập → hành động → phản ứng → **chuẩn bị (cảnh ngắn nhất)** → **hé lộ/chốt (cảnh dài nhất)** → gắn thương hiệu | REF_006 |
| **Tổng kết / giới thiệu dự án** | Sự kiện, chiến dịch, sản phẩm mới | Mở im lặng → hậu trường → chi tiết thương hiệu xuất hiện một mình → sản phẩm/nội dung → ứng dụng thực tế → **tường hình nhiều ô làm cao trào** → chốt → hậu trường kết (mặt người thật) → logo | REF_007 |
| **Tôn vinh con người** | Nhân viên, học viên, khách hàng | Mở giữa hành động → leo thang → **thẻ tên sau ~20–25%** → hành động song song → kết quả → **hé lộ gương mặt thật** cùng bố cục → logo viết lên cảnh cuối | REF_008 |
| **Nhiều hoạt động, ít/không lời** | Recap trải nghiệm, du lịch, ngày hội | Mở định vị → hành trình (cảnh nối cảnh bằng chuyển động ~2 s) → **mỗi hoạt động một khối 2–4 cảnh toàn → cận chi tiết → người** → toàn cảnh tổng → thông tin hành động khớp đúng các hoạt động vừa xem → logo | REF_009 |
| **Giải thích kiến thức** (`explainer`) | Một khái niệm, một kết quả nghiên cứu | **Là gì** → **làm gì** (chữ thay đúng chỗ) → **ví dụ** đầu vào → đầu ra, thêm từng hàng, hàng cũ ở lại → **chứng minh** bằng thay một cột → **hành động** (dòng mô tả nhỏ + đường dẫn lớn) | REF_010 |
| **Demo phần mềm / quay màn hình** (`explainer`) | Giới thiệu tính năng, bài học phần mềm | Tiêu đề → 2–3 kịch bản dùng thật, **mỗi kịch bản trọn vòng làm gì → thấy kết quả** (quan trọng nhất trước, dài nhất) → liệt kê độ rộng → quay về tiêu đề mở → logo | REF_011 |

Hoạt hình nhân vật/3D (REF_006–009) **ngoài phạm vi**; chỉ dùng mạch kể, nhịp, chữ, logo.

**Nguyên tắc kể chung (rút từ cả 10):**
- **Hook trả lời "vì sao xem"** trong 1–3 s: vấn đề, chi tiết lạ, lời hứa có con số, hoặc cảnh hành động. Có chữ ngay khung đầu ở dạng người nói (REF_003, 004, 005, 012).
- **Lời hứa của hook phải được trả** trong video (REF_009, 012 đưa bằng chứng/sản phẩm khớp đúng lời hứa).
- **Bằng chứng cụ thể** hơn lời khẳng định: con số, chuyện thật, ảnh kết quả, so sánh dự đoán với thực tế (REF_003, 010, 012).
- **Đóng vòng:** kết nhắc lại luận điểm hoặc quay về tiêu đề mở (REF_003, 011).
- **Người thật ở cuối** tạo cảm xúc với video tổng kết/tôn vinh (REF_007, 008).

## 2. Cách làm chữ
**Hai tầng chữ** (cả 10 mẫu): một tầng đọc liên tục (phụ đề, dòng dẫn) và một tầng nhấn ít, lớn (tiêu đề, số, từ khóa). Bảng màu hẹp, 2–4 màu cho cả video; giải thích kỹ thuật dùng **một màu nhấn** (REF_010).

| Loại chữ | Quy cách (quan sát) | Mẫu |
|---|---|---|
| **Phụ đề cụm** | 1–4 từ, ~3% chiều cao khung, trắng (hoặc kem→vàng), viền/bóng tối, không hộp; in thường (REF_003) hoặc in hoa (REF_005) | 003, 005 |
| **Phụ đề mã hóa** (tùy chọn) | Trắng = người nói chính; **vàng nghiêng** = người thứ hai; vàng nghiêng trong ngoặc kép = lời trích/tưởng tượng; **đậm ~1 từ/cụm** = từ khóa (ưu tiên số); nghiêng = nhấn giọng; **cỡ ~2,5×** = khái niệm đang hiện trong hình; `*dấu sao*` = tiếng động | 003 |
| **Hai dòng sans nhỏ + serif nghiêng lớn** | Dòng dẫn sans đậm nhỏ, dòng nhấn serif nghiêng lớn vào sau ~0,5 s; từ khóa trong câu tô màu nhấn | 012 |
| **Tiêu đề hook trong hộp** | Hộp đỏ thuần, chữ trắng in hoa trong ngoặc kép, 2 dòng, rộng ~73% khung | 003 |
| **Tiêu đề xếp chồng** | Xen cỡ nhỏ/lớn (~1:2,2), hiện từng từ theo lời | 005 |
| **Nhãn chương `TÊN:`** | Đỏ, in hoa, dấu hai chấm, trên b-roll; lời nói chạy ngay dưới bằng chữ trắng lớn | 005 |
| **Nhãn vế/đoạn** | Hộp đặc màu theo vế (đen = chung, đỏ = A, vàng chữ đen = B), có emoji | 004 |
| **Thẻ số lớn** | Số tách thành thẻ riêng, có đếm (0 → 20; 89% → 100%); bộ đếm bước `Bước x/n` nhỏ ở góc | 012 |
| **Thẻ chữ khổng lồ** | 1–3 từ chiếm 55–80% khung, chỉ trên nền phẳng; dấu câu là chi tiết thương hiệu | 007 |
| **Thẻ trích dẫn** | Nền mờ toàn khung, dấu ngoặc kép, chữ serif nghiêng | 012 |
| **Nhãn bảng/giao diện** | In hoa nhỏ giãn chữ cho nhãn cột; chữ giao diện trắng ngà trên nền tối, cỡ đọc được trên điện thoại | 010, 011 |

## 3. Cách chèn chữ (vị trí, thời điểm)
**Thời điểm**
- **Phụ đề đổi ~0,9 s/cụm** (REF_003 đếm 17 cụm/15 s; REF_005 ~0,5–1 s), cụm chốt ý giữ tới ~2 s. Hiện cắt cứng hoặc từng từ đồng bộ lời (cần mốc lời thật, `R-SRC-1`).
- **Tắt phụ đề khi không có lời** (REF_003).
- **Nhãn đoạn vào sau cú cắt 2–3 khung, ra trước cú cắt 2 khung**, bật/tắt cứng (REF_004, đo từng khung).
- **Dòng 2 sau dòng 1 ~0,25–0,5 s**; chữ hiện từng dòng (REF_007, 012).
- **Thẻ tiêu đề/tên sau phần mở** (~20–25% thời lượng) với video kể chuyện (REF_008); với dạng người nói thì tiêu đề hook ở khung 0 (REF_003).
- **Chữ khớp cử chỉ** khi footage có (giơ 5 ngón ↔ "5 công cụ") (REF_012).

**Vị trí**
- **Không che mặt:** chữ quanh mặt (trên đầu, ngang ngực, cạnh đầu), đổi theo từng cảnh thay vì một dải cố định (REF_012); phụ đề giữa khung y ≈ 44–52% hoặc 76–79% (REF_003, 005). Khai báo `subject_box`.
- **Chữ là bản lề** giữa thẻ màn hình (trên) và thẻ mặt (dưới) (REF_012).
- **Thẻ chữ khổng lồ chỉ trên nền phẳng/sạch** (REF_007).
- **Footage khác tỉ lệ trong khung dọc:** đặt giữa, lấp bằng bản mờ của chính nó; nhãn ngay trên mép vùng sắc nét (REF_004).
- **Chữ mới thay chữ cũ đúng vị trí** (REF_010).
- **Vùng an toàn 9:16** (bên thứ ba, không chính thức): TikTok chừa ~108 px trên, 320 dưới, 60 trái, 120 phải (1080×1920); Reels chừa ~220 px trên, 420 dưới.

## 4. Hiệu ứng và chuyển cảnh
**Mặc định: cắt thẳng** (cả 10 mẫu). Hiệu ứng chỉ dùng khi có việc cụ thể:

| Việc cần làm | Cách (quan sát) | Thời lượng | Thư viện |
|---|---|---|---|
| Đổi đoạn trong video người nói mà không cắt | **Luân phiên 3–4 bố cục** (mặt toàn khung / thẻ màn hình + thẻ mặt / thẻ toàn khung / sơ đồ), nền thẻ là chính cảnh mặt làm mờ | đổi ~4 s, chuyển ~0,3 s | `layout_cards` (`layout_cards_screen_top`) |
| Vào thẻ số/thẻ ý | Mờ nét sang thẻ | ~0,3 s | `blur_dissolve` (gần đúng) |
| Chỉ vào vật đang nói tới | Mũi tên/nét vẽ **tự vẽ đúng lúc lời nhắc** | ~1–1,5 s | `draw_annotation` (`draw_arrow_red`, `draw_circle_red`, `draw_underline_yellow`) |
| Liệt kê, dựng thông tin | Thêm từng mục, mục cũ ở lại hoặc mờ đi | 0,3–0,5 s/mục (UI); ~3,5 s/mục (cần hiểu) | `bullet_list_reveal`; `comparison_table` với `row_times`, `cell_changes` (`table_build_social`) |
| Bác bỏ niềm tin sai | Danh sách, **gạch ngang từng mục** | ~0,5 s/mục | `strike_list` (`strike_list_myth`) |
| Đặt kỳ vọng, tiến độ | Thanh tiến độ có số | ~1 s | `progress_bar` |
| So sánh hai lựa chọn | Hai thẻ cạnh nhau "A vs B", thẻ thắng bật sáng | ~1 s | `compare_cards` (`compare_cards_vs`) |
| Danh sách cần tích | Thẻ kính, tích lần lượt | ~0,5 s/mục | `bullet_list_check` (gần đúng) |
| Bằng chứng kết quả | Ảnh kết quả bay quanh người nói / dải ảnh / lưới ảnh | 1–2 s | `image_float` (`image_fan_head`, `image_orbit_head`, `image_strip_top`) |
| Liệt kê độ rộng nhanh | Đổi từ cuối câu, phần đầu giữ yên | 3–4 khung đổi, giữ ~0,4–0,7 s | **chưa có** |
| Ngăn hai vế | Màn đen + nhãn | ~1 s | `dip_to_black` + `text_box` |
| Che cú cắt | Vật đi ngang sát máy có sẵn trong footage | – | cắt thủ công |
| Nối cảnh rời rạc | Một chi tiết lặp lại (màu, vật) cùng vị trí qua cú cắt | – | cắt thủ công |
| Cao trào montage | Tường hình nhiều ô | ~3–4 s | **chưa có** |
| Chữ nhấn có năng lượng | Glitch vào | 0,2–0,3 s | `glitch_text` |
| CTA đường dẫn | Wipe mềm mở lộ, giữ | ~0,9 s + ~2,7 s | `mask_wipe` |
| CTA mạng xã hội | Mô phỏng ô bình luận / nút Follow được bấm | ~2–3 s | `social_cta` (`social_cta_follow`, `social_cta_comment`) |
| Logo kết | Viết lên cảnh cuối khi người rời khung, hoặc vẽ nét trên nền trơn rồi giữ im lặng | ~1 s + ~1,5 s | `social_end_logo` (gần đúng) |

**Không dùng:** zoom số, chuyển cảnh trang trí không có lý do. Màn hình chia đôi người nói: người dùng không cần (25/11/2026); nguyên tắc thay thế là **cho thấy cái đang được nói tới bằng b-roll toàn khung**.

## 5. Motion và nhịp
| Dạng | Cảnh/phút | Trung vị cảnh | Nguồn nhịp |
|---|---|---|---|
| Hỏi–đáp đa máy (REF_003) | 16 | 2,8 s | Cắt đổi góc ở ranh giới cụm từ |
| Podcast + b-roll (REF_005) | 35 | 1,4 s | Cắt + b-roll ~40% thời lượng |
| Quảng cáo nhanh (REF_004 đoạn QC, REF_007) | 50–55 | 0,9–1 s | Cắt dày |
| Recap không lời (REF_009) | ~28 | 2,2 s | Cắt đều |
| Hướng dẫn, giải thích, demo (REF_010–012) | gần như không cắt | – | Đổi bố cục ~4 s, đổi chữ 1–3 s, con trỏ bấm |

- **Cắt ở ranh giới cụm từ**, không cắt giữa câu (REF_003: 30/39 điểm cắt; REF_005: 20/22 điểm cắt lệch ≤ 0,15 s so với lúc đổi cụm phụ đề). Cần mốc lời nói thật.
- **Chọn hình theo nghĩa câu đang nói:** nhắc người → mặt người đó; nói "mọi người" → khán giả; danh từ cụ thể → cảnh của chính vật đó; cặp đối lập → cặp b-roll trước/sau; giải thích dài → giữ người nghe trên màn (REF_003, 005).
- **Phản ứng người nghe làm dấu chấm câu** sau hook và trước kết (REF_005).
- **Tương phản nhịp:** người nói không cắt ↔ nội dung chèn cắt dày (REF_004); dồn nén ở cảnh chuẩn bị (ngắn nhất), để thở ở cảnh chốt (dài nhất) (REF_006).
- **Nhịp tăng dần đến cao trào** rồi chậm lại ở kết (REF_007).
- **Khoảng lặng:** dạng hội thảo giữ khoảng lặng 0,3–1 s (REF_003); dạng hướng dẫn/UGC cắt liền (REF_012).
- **Easing:** vào ease-out mạnh (dừng sau ~7 khung), ra ease-in ngay trước cú cắt (REF_007).
- **Màu thống nhất:** footage nhiều nguồn dùng một bản chỉnh màu chung (REF_009).
- **Theo beat nhạc:** giả thuyết (REF_007 ~117 BPM, REF_009 ~83 BPM), **chưa xác nhận** vì chưa nghe.

## 6. Âm thanh (đo, chưa nghe)
Độ to các mẫu từ −8,8 đến −38,7 LUFS; nhóm quảng cáo quá to (đỉnh > 0 dBFS). **Chuẩn hóa về khoảng −14 LUFS, đỉnh ≤ −1 dBFS** (như `R-SOC-7`). Phải đo; agent không nghe được.

## 7. Luật (`confidence: low`; số trong ngoặc là số video ủng hộ)
**Kể chuyện**
- `R-SM-1` (10): chọn dạng video ở mục 1 trước, dựng mạch theo khuôn.
- `R-SM-2` (4): hook có chữ từ khung đầu ở dạng người nói; lời hứa của hook phải được trả trong video.
- `R-SM-3` (1): talking head dài đưa luận điểm có con số trước ~25% thời lượng, phần sau là bằng chứng.
- `R-SM-4` (3): bằng chứng cụ thể (số, chuyện thật, ảnh kết quả, so sánh) thay cho lời khẳng định.
- `R-SM-5` (1): hướng dẫn có đoạn đặt kỳ vọng thật (không hứa hoàn hảo).
- `R-SM-6` (2): đóng vòng: kết nhắc lại luận điểm hoặc tiêu đề mở; đi sâu (ví dụ chi tiết) rồi đi rộng (liệt kê nhanh).
- `R-SM-7` (1): thẻ tiêu đề/tên đặt sau phần mở khi video kể chuyện.
- `R-SM-8` (2): video tổng kết/tôn vinh kết bằng gương mặt người thật trước logo.
- `R-SM-9` (2): mỗi hoạt động/kịch bản một khối trọn vẹn (toàn → chi tiết → người; hoặc làm gì → kết quả).

**Chữ**
- `R-SM-10` (10): hai tầng chữ; bảng màu 2–4 màu; giải thích kỹ thuật dùng một màu nhấn.
- `R-SM-11` (2): phụ đề 1–4 từ, ~0,9 s/cụm, đậm ~1 từ khóa (ưu tiên số), tắt khi không có lời. Mã màu theo người nói là tùy chọn.
- `R-SM-12` (3): chữ không che mặt; đặt quanh mặt theo từng cảnh; khai báo `subject_box`.
- `R-SM-13` (1): nhãn đoạn vào sau cú cắt 2–3 khung, ra trước cú cắt 2 khung.
- `R-SM-14` (2): số liệu tách thành thẻ số lớn; dòng 2 sau dòng 1 ~0,25–0,5 s; chữ mới thay chữ cũ đúng vị trí.
- `R-SM-15` (1): thẻ chữ khổng lồ chỉ trên nền phẳng/sạch.
- `R-SM-16` (—): video dọc giữ chữ, mặt, CTA trong vùng an toàn.

**Hình và nhịp**
- `R-SM-17` (2): cắt ở ranh giới cụm từ; hình chọn theo nghĩa câu đang nói.
- `R-SM-18` (2): cho thấy cái đang được nói tới (b-roll đúng nghĩa đen, giao diện thật, người được nhắc); đồ họa chỉ dẫn vẽ dần đúng lúc lời nhắc.
- `R-SM-19` (1): có người nghe/khách thì dùng phản ứng của họ làm dấu chấm câu.
- `R-SM-20` (3): video hướng dẫn/giải thích tạo nhịp bằng đổi bố cục/chữ (~4 s/bố cục, 1–3 s/chữ) thay vì cắt.
- `R-SM-21` (2): tương phản nhịp tạo nghĩa (người nói ít cắt ↔ nội dung chèn cắt dày; chuẩn bị ngắn ↔ chốt dài).
- `R-SM-22` (1): montage dồn nhịp đến một cao trào rồi chậm lại; ít footage thì tái dùng nguồn hình bằng nhiều cách xếp.
- `R-SM-23` (2): một chi tiết lặp lại (màu, vật) làm sợi chỉ nối cảnh; footage nhiều nguồn dùng một bản màu chung.
- `R-SM-24` (2): chuyển cảnh mặc định là cắt thẳng; che cú cắt bằng vật có sẵn trong footage khi cần; không zoom số (`R-ZOOM-0`).
- `R-SM-25` (1): demo màn hình cắt khung cố định sát vùng giao diện (không zoom động); nội dung cũ mờ đi khi có mới.
- `R-SM-26` (—): chuẩn hóa −14 LUFS, đỉnh ≤ −1 dBFS.

## 8. Còn thiếu trong thư viện (ghi nhận, chưa làm)
**Đã làm (25/11/2026, render thử `projects/test-social-new/`):** `layout_cards`, `strike_list`, `compare_cards`, `draw_annotation`, `image_float`, `social_cta`, bảng `row_times`/`cell_changes`, cảnh báo vùng an toàn 9:16 trong `validate`, khung dọc 9:16 (`frame_x`). **Còn thiếu:** sơ đồ cây dựng dần; logo vẽ nét từ SVG thật; tường hình nhiều ô; đổi từ cuối câu; làm mờ vùng ngoài trọng tâm; nền mờ cho footage lệch tỉ lệ; preset hai dòng sans + serif nghiêng; phụ đề mã hóa theo người nói (cần dữ liệu ai nói). Mỗi thứ cần thêm vào renderer và render thử trước khi ghi `usable`. Màn hình chia đôi người nói: **không làm** (người dùng, 25/11/2026).

## 9. Chưa kiểm chứng
- 10 video bản thấp; font không nhận ra; màu sai số ±16 mỗi kênh; mốc từ ảnh ghép ±0,25–1 s, từ chuỗi khung ±1–3 khung.
- Lời nói chỉ biết qua chữ trên hình (REF_003, 005, 012); REF_004, 006–011 không có lời trên hình.
- Chưa nghe: nhạc, hiệu ứng âm, ngữ điệu; nhịp theo beat là giả thuyết.
- Nhiều luật chỉ có 1 video ủng hộ; cần thêm mẫu trước khi nâng `confidence`.
- Vùng an toàn 9:16 lấy từ bên thứ ba.
