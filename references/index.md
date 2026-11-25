# Reference Library (khung)

Thư viện video mẫu để AI rút kỹ thuật và thông số từ video đã dựng tốt. **Đã có 12 video mẫu được phân tích** (`REF_001`…`REF_012`, `reviewed: false`, bản độ phân giải thấp, chưa nghe âm thanh) và một dự án mẫu giả định.

## Quy tắc dùng
- Truy xuất theo kỹ thuật/phong cách, rồi **rút kỹ thuật và thông số**; không sao chép video.
- Thông số lấy từ reference ghi `source_of_values: observed:<REF_id>` trong preset hoặc tài liệu.
- Reference chưa được người duyệt (`reviewed: false`) chỉ dùng tham khảo, không dùng để ghi đè giá trị `convention`.

## Cấu trúc đích
```
references/
├── index.md               (file này: danh sách và truy vấn)
├── projects/              dự án mẫu: quyết định, lý do, bài học
│   └── example-event-recap-documentary.md
├── videos/                REF_001–002 (social-edu), REF_003–012 (social); khuôn REF_001/ cho video sau này
│   └── REF_001/ { metadata.json, segments/seg_001.json, keyframes/ }
└── indexes/               (trống) chỉ mục theo kỹ thuật, phong cách
```

## Khuôn segment (cho khi bắt đầu thu thập)
```json
{
  "segment_id": "REF_001_SEG_014",
  "video_id": "REF_001",
  "start": 124.2,
  "end": 128.8,
  "segment_type": "emphasis",
  "techniques": [
    {
      "technique": "punch_in",
      "effect_start": 125.1,
      "effect_end": 125.5,
      "hold_end": 127.2,
      "parameters": { "start_scale": 1.0, "end_scale": 1.12, "duration": 0.4, "easing": "ease_out" },
      "estimated": true
    }
  ],
  "context": { "speech": "...", "reason": "Nhấn câu kết luận" },
  "editing_intent": "Tạo sự chú ý",
  "intensity": 3,
  "reviewed": false
}
```
Thông số đo từ video thường là **ước lượng** (`estimated: true`) cho đến khi người duyệt.

## Pipeline thu thập (sẽ làm sau)
Import → metadata (ffprobe) → scene detect → keyframe quan trọng → transcript/âm thanh → nhận diện kỹ thuật → tạo segment → người duyệt → lập chỉ mục. Tái sử dụng công cụ trích xuất của `Video-analysis` (ffmpeg, scdet, silencedetect), nhưng **không dùng chung schema** vì mục đích khác.

## Danh sách hiện có
| ID | Loại | Ghi chú |
|---|---|---|
| `projects/example-event-recap-documentary.md` | Dự án mẫu (giả định) | Kế hoạch mẫu, chưa phải video thật đã dựng |

## Danh sách video mẫu
| ID | Video | Style | Dùng để học |
|---|---|---|---|
| REF_001 | Webinar Kỷ nguyên AI (1:1) | social-edu | chữ nhấn đỏ, lưới 3 s, glitch zoom-through |
| REF_002 | Phỏng vấn học viên (9:16) | social-edu | phụ đề cụm, thẻ câu hỏi, thanh tên |
| REF_003 | Hormozi: Why do my employees leave (9:16) | social / talking_head | hook hộp đỏ, chia đôi, phụ đề trên đường chia, cắt đa góc |
| REF_004 | Stevie Sells: Fiverr commercial (9:16) | social / fast_ad | so sánh, nhãn màu đổi theo cú cắt, nền mờ cho footage ngang |
| REF_005 | Gawx cinematic tools (9:16) | social / talking_head | b-roll theo lời, tiêu đề xếp chồng, nhãn chương bay vào |
| REF_006 | Rick and Morty storyboard vs final (9:16) | social / so sánh | hai khung chồng, chữ trên dải đen |
| REF_007 | BUCK 7UP (16:9) | social / fast_ad | thẻ chữ khổng lồ, circle wipe màu, easing |
| REF_008 | BUCK FedEx Tall Tales (16:9) | social / animated_story | thẻ tiêu đề né mặt, chữ từng ký tự, logo vẽ trên footage |
| REF_009 | BUCK Airbnb Experiences (16:9) | social / animated_story | nhịp cắt đều, zoom-out giao diện |
| REF_010 | Meta TRIBE v2 explainer (16:9) | social / explainer | dựng dần tại chỗ, chữ từng từ, CTA wipe |
| REF_011 | Linear for Agents (16:9) | social / explainer | UI animation, word roll |
| REF_012 | "Claude có thể edit video…" (9:16) | social / talking_head | sans + serif nghiêng, chữ né mặt, biến hình bố cục |
