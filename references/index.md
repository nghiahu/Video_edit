# Reference Library (khung)

Thư viện video mẫu để AI rút kỹ thuật và thông số từ video đã dựng tốt. **Hiện chưa có video mẫu nào được phân tích** — chỉ có khung và một dự án mẫu giả định.

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
├── videos/                (trống) metadata + segment của từng video mẫu
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
