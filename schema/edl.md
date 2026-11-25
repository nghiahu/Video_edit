# Hợp đồng EDL (Edit Decision List) — v1.0

EDL là **cầu nối duy nhất** giữa phần ra quyết định (skill này) và phần thực thi (renderer). Renderer chỉ đọc EDL và preset; không đọc tài liệu kiến thức.

## Nguyên tắc
0. **`strategy.style` trùng tên file trong `styles/`** (hiện có `documentary`); preset dùng cùng tên trong `allowed_styles`/`forbidden_styles`.
1. **Thời gian tính bằng giây** (số thực). Renderer tự quy đổi ra frame theo `project.fps`.
2. **Thời gian đầu ra không lưu cứng.** Timeline là danh sách clip theo thứ tự; vị trí trên video cuối được tính ra. Xóa hoặc dời một clip không làm hỏng các quyết định khác.
3. **Hiệu ứng neo vào clip** (`clip` + `source_time` là giây trong file nguồn), không neo vào giờ đầu ra.
4. **Mỗi quyết định có ID** (`d01`, `d02`...) để người dùng sửa: "bỏ d07", "d03 nhẹ hơn".
5. **Mỗi quyết định có `reason`** và `priority` (lớp ưu tiên bị chi phối). Không có lý do thì không được vào EDL.

## Cấu trúc

```json
{
  "edl_version": "1.0",
  "project": {
    "id": "recap-khai-giang-v1",
    "title": "Tổng kết Lễ khai giảng",
    "fps": 29.97,
    "resolution": "1920x1080",
    "aspect": "16:9",
    "language": "vi",
    "target_duration_sec": 120
  },
  "strategy": {
    "style": "documentary",
    "pacing": "moderate",
    "visual_intensity": "low_to_medium",
    "typography_style": "editorial",
    "transition_style": "mostly_hard_cut",
    "motion_style": "subtle",
    "budget": { "punch_in": 6, "emphasis_text": 4, "special_transition": 2 }
  },
  "timeline": {
    "clips": [
      {
        "id": "c01",
        "video_id": "DJI_20261117183730_0004_D_AZ1",
        "source_in": 0.5,
        "source_out": 11.0,
        "audio": "mute"
      }
    ]
  },
  "decisions": [
    {
      "id": "d01",
      "technique": "punch_in",
      "preset": "punch_in_subtle",
      "anchor": { "clip": "c01", "source_time": 4.2 },
      "start_offset": -0.1,
      "duration": 0.35,
      "parameters": { "start_scale": 1.0, "end_scale": 1.1, "easing": "ease_out_cubic", "hold": 1.2, "return": "cut" },
      "reason": "Câu kết luận của diễn giả, cần nhấn mạnh",
      "priority": "storytelling",
      "confidence": "medium",
      "reference": null,
      "status": "proposed"
    }
  ],
  "audio": {
    "music": { "file": null, "base_db": -16, "duck_amount_db": 12 }
  }
}
```

## Trường

### `timeline.clips[]`
| Trường | Ý nghĩa |
|---|---|
| `id` | `c01`, `c02`... theo thứ tự tạo, không đổi khi sắp xếp lại |
| `video_id` | Khớp `metadata/<video_id>` của `Video-analysis` |
| `source_in` / `source_out` | Giây trong file nguồn |
| `audio` | `keep` (giữ tiếng gốc), `mute`, hoặc `duck` (hạ nhỏ dưới nhạc/voice khác) |
| `frame_x`, `frame_y` | (tuỳ chọn, mặc định 0.5) vị trí khung cắt cố định khi tỉ lệ nguồn khác khung xuất (ví dụ footage 16:9 xuất 9:16): 0 = sát trái/trên, 1 = sát phải/dưới. Là khung tĩnh, **không phải zoom** (không vi phạm `R-ZOOM-0`). `subject_box` tính theo khung đã cắt |
| `subject_box` | (tuỳ chọn) `[x0, y0, x1, y1]` tỉ lệ khung hình (0–1) của chủ thể chính trong clip; `validate` cảnh báo khi khối chữ ước lượng chồng lên > 20% (xem R-SUBJ-1 trong `core/composition.md`). Ước lượng thô: chưa theo dõi chủ thể chuyển động, phải tự khai báo theo từng clip |

### `decisions[]`
| Trường | Ý nghĩa |
|---|---|
| `id` | `d01`... không bao giờ dùng lại sau khi bị xóa |
| `technique` | ID trong `techniques/index.md` |
| `preset` | ID trong `presets/*.json` (tùy chọn nhưng nên có) |
| `anchor` | Hiệu ứng thường: `{ "clip": "c01", "source_time": 4.2 }`. Hiệu ứng ở điểm nối: `{ "between": ["c01","c02"] }` |
| `start_offset` | Giây lệch so với điểm neo (âm = bắt đầu trước điểm neo). Mặc định 0 |
| `duration` | Giây. Hiệu ứng ở điểm nối thì là độ dài vùng nối |
| `parameters` | Ghi đè thông số của preset. Khóa phải thuộc danh sách của kỹ thuật đó |
| `reason` | Một câu giải thích vì sao, bắt buộc |
| `priority` | `storytelling` \| `clarity` \| `rhythm` \| `style` \| `decoration` |
| `confidence` | `low` \| `medium` \| `high` |
| `reference` | ID segment tham khảo, hoặc `null` |
| `status` | `proposed` → `approved` → (`removed`). Chỉ `approved` mới vào bản cuối |

### Quy tắc sửa theo ID
- "Bỏ d07": đặt `status: removed`, không xóa dòng và không đánh lại ID.
- "Nhẹ hơn": đổi preset sang bậc thấp hơn hoặc giảm `parameters`, ghi lại vào `reason`.
- Đổi thứ tự hoặc cắt lại clip: chỉ sửa `timeline.clips`; hiệu ứng neo vào clip nên tự theo.
- Sau mỗi sửa phải chạy lại kiểm tra ngân sách và quy tắc trong `core/decision-engine.md`.

## Kiểm tra hợp lệ (renderer và AI đều áp dụng)
- Mọi `anchor.clip` tồn tại; `source_time` nằm trong `[source_in, source_out]` của clip.
- Mọi `technique` có trong danh mục; mọi khóa `parameters` hợp lệ với kỹ thuật đó.
- Số quyết định `approved` + `proposed` theo từng kỹ thuật không vượt `strategy.budget`.
- Không hai quyết định cùng kỹ thuật chồng lên nhau trên cùng một clip (trừ khi kỹ thuật cho phép).
