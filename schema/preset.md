# Hợp đồng preset

Preset là bộ thông số đặt tên sẵn, nằm trong `presets/*.json`. EDL tham chiếu preset bằng ID, và `parameters` trong EDL **ghi đè** từng khóa của preset.

## Cấu trúc một preset
```json
"punch_in_subtle": {
  "technique": "punch_in",
  "description": "...",
  "parameters": { "end_scale": 1.07, "duration": 0.35 },
  "allowed_styles": ["documentary"],
  "forbidden_styles": [],
  "source_of_values": "convention",
  "confidence": "medium"
}
```

| Trường | Ý nghĩa |
|---|---|
| `technique` | ID kỹ thuật (trùng `techniques/index.md`) |
| `parameters` | Khóa phải thuộc bảng "Thông số" của tài liệu kỹ thuật đó |
| `allowed_styles` / `forbidden_styles` | `["all"]` hoặc danh sách style; `forbidden_styles` thắng khi xung đột |
| `source_of_values` | `convention` hoặc `observed:<REF_id>` |
| `confidence` | `low`, `medium`, `high` |

## Kế thừa (`extends`)
Một preset có thể ghi `"extends": "_ten_khoi_nen"`. Khối nền là mục có khóa bắt đầu bằng `_` và có `parameters` (renderer không coi nó là preset dùng được). `parameters` của preset ghi đè từng khóa của khối nền, và **khóa được phép ghi đè trong EDL là hợp của cả hai**. Hiện có khối nền `_text_style_base` (kiểu chữ dùng chung, trong `presets/typography-presets.json`).

## Quy tắc
- Mỗi file chỉ chứa preset của một nhóm: `motion`, `typography`, `transition`, `sound`, `color` (tên file `<nhóm>-presets.json`; renderer tự đọc mọi file khớp mẫu này).
- ID preset duy nhất toàn bộ thư mục `presets/`.
- Khóa bắt đầu bằng `_` (ví dụ `_doc`) là chú thích, renderer bỏ qua.
- `decision.parameters` có thể thêm **trường nội dung** mà preset không có (ví dụ `text`, `hold` của `kinetic_text`; `name`, `title` của `lower_third`); mọi khóa khác phải có trong preset.
- Giải quyết thông số khi render: `thông số cuối = preset.parameters` ghi đè bởi `decision.parameters`.
- Khi `decision.preset` nằm trong `forbidden_styles` của `strategy.style` → quyết định không hợp lệ.
