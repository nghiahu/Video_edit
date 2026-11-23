# Pha 2–4 — Chiến lược, truy xuất, lập kế hoạch

## Pha 2: Chiến lược edit

Điền khối `strategy` của EDL. Ra quyết định cho từng trục, mỗi trục một lý do ngắn.

| Trục | Cách chọn |
|---|---|
| `style` | Từ mục đích + đối tượng xem + yêu cầu người dùng. Đọc `styles/<style>.md` để biết các lựa chọn đi kèm |
| `pacing` | `slow` (cảnh > 6s), `moderate` (3–6s), `fast` (< 3s). Nghiêm túc/cảm xúc → chậm hơn; mạng xã hội → nhanh hơn |
| `visual_intensity` | `low` / `low_to_medium` / `medium` / `high`. Quyết định ngân sách bên dưới |
| `typography_style` | `editorial`, `bold_emphasis`, `minimal`... khớp `typography/` |
| `transition_style` | Mặc định `mostly_hard_cut`. Chỉ đổi khi style yêu cầu |
| `motion_style` | `subtle`, `standard`, `aggressive` → chọn bậc preset |
| `budget` | Số lần tối đa mỗi kỹ thuật cho toàn video, lấy từ `styles/<style>.md` rồi nhân theo độ dài |

Nếu yêu cầu mơ hồ: **đề xuất kèm lý do**, hỏi một câu, đừng đoán im lặng.

## Pha 3: Truy xuất kiến thức

1. Từ `key_moments` và `b_roll_opportunities` của pha 1, liệt kê **nhu cầu edit** (ví dụ: 8 câu cần nhấn mạnh, 3 đoạn cần chữ, 4 điểm nối clip).
2. Với mỗi nhu cầu, mở `techniques/index.md`, chọn nhóm, đọc `index.md` của nhóm, rồi **chỉ đọc tài liệu của kỹ thuật được chọn** (mục 2, 3, 4, 7).
3. Chọn preset phù hợp `motion_style` từ `presets/`.
4. Nếu có reference khớp (`references/index.md`), rút kỹ thuật + thông số; không sao chép.

## Pha 4: Lập kế hoạch (EDL)

1. **Dựng timeline** (`timeline.clips`): sắp xếp clip theo kịch bản, đặt `source_in/out` theo `edit_points`. Đọc `core/pacing.md` và `core/storytelling.md` trước.
2. **Đặt điểm nối:** mặc định `hard_cut`. Cân nhắc `j_l_cut` cho các chỗ đổi người nói hoặc chèn b-roll (đọc tài liệu kỹ thuật).
3. **Đề xuất quyết định** theo thứ tự: nhấn mạnh (`punch_in`) → chữ (`kinetic_text`) → âm thanh (`audio_ducking`). Mỗi quyết định phải qua **Decision Engine** (`core/decision-engine.md`): kiểm tra điều kiện dùng, điều kiện cấm, khoảng cách với quyết định trước, ngân sách.
4. **Cắt tỉa:** nếu vượt ngân sách, giữ quyết định ưu tiên cao nhất (`storytelling` > `clarity` > ...), bỏ phần còn lại.
5. **Kiểm tra hợp lệ** theo `schema/edl.md` (cuối file).
6. **Tự duyệt nhịp:** đọc lại EDL như một biên tập viên. Có chỗ nào hiệu ứng dồn dập? Có đoạn dài trống không? Sửa trước khi render.

## Đầu ra
EDL đầy đủ, mọi quyết định `status: proposed`.
