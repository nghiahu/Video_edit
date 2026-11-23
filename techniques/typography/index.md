# Typography & Text Motion — chọn kỹ thuật

**Bắt buộc đọc trước khi thêm chữ:** `typography/font-catalog.md`, `typography/hierarchy.md`.

| Nhu cầu | Kỹ thuật | Tài liệu |
|---|---|---|
| Nhấn ý quan trọng hoặc dữ kiện cụ thể bằng cụm 3–6 từ | `kinetic_text` | `kinetic-text.md` |
| Tên và chức danh người nói, lần đầu xuất hiện | `lower_third` | `lower-third.md` |
| Nhãn ngắn trong hộp bo tròn (con nhộng) | `text_pill` | `text-pill.md` |
| Chữ trong hộp, băng, vạch, gạch chân | `text_box` | `text-box.md` |
| Hai dòng trên dưới, so le, xếp ngăn căn đều | `stacked_text` | `stacked-text.md` |
| Tiêu đề lớn giữa màn hình trên nền tối/mờ/đặc | `title_card` | `title-card.md` |
| Chữ cực lớn khớp bề ngang khung | `big_text` | `big-text.md` |
| Vệt bút dạ sau chữ hoặc từ khóa | `marker_highlight` | `marker-highlight.md` |
| Tô sáng từ khóa theo lời (chưa có) | `word_highlight` | planned |
| Phụ đề lời nói (chỉ khi có nguyên văn đáng tin kèm mốc thời gian) | `subtitles` | `subtitles.md` |

Kiểu chữ dùng chung (màu, viền, bóng, glow, hộp, hoạt ảnh) và cách tạo preset chữ mới: `typography/text-style-layer.md`. Kế hoạch các đợt còn lại (số liệu, trích dẫn, phụ đề từng từ...): `layout-catalog.md`.

## Cách chọn nhanh
- Câu có số liệu/tên/mốc → `kinetic_text`.
- Người nói xuất hiện lần đầu và đã biết chắc tên, chức danh → `lower_third` (một lần mỗi người).
- Chữ dài hơn 6 từ → không phải chữ nhấn, dùng phụ đề.
- Mọi quyết định chữ phải qua `R-TXT-1/2/3`.
