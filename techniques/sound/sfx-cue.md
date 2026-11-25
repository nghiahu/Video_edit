---
id: sfx_cue
name: SFX Cue (Âm thanh từ thư viện, khớp mốc)
group: sound
roles: [emphasis, transition, rhythm]
status: usable
source_of_values: convention
---

# SFX Cue

## 1. Mục đích
Gắn một hiệu ứng âm thanh **từ thư viện có sẵn** (`assets/sfx/`) vào một mốc bất kỳ: lúc chữ hiện, lúc một dòng danh sách chạy vào, lúc chuyển cảnh. Khác `whoosh_synced_cut` (chỉ ở điểm cắt, phải đưa file riêng): `sfx_cue` tra file theo mã trong danh mục và tự căn mốc "đập".

Thư viện lấy từ `Tiem-edit-nho/public/sfx` (106 file, 7 nhóm: `01_hook`, `02_chuyen_canh`, `03_nhan_manh`, `04_don_dap`, `05_cham_hoi_hop`, `06_nghi_nha`, `07_hai_phan_ung`), kèm 2 nhạc nền `nhac-nen-nhe-nhang.mp3`, `nhac-nen-may-lua.mp3`. Danh mục: `assets/sfx/sfxlib.json`.

## 2. Khi nên dùng
- Style không phải `documentary` (event_recap, giới thiệu, social): chữ hiện, tiêu đề chương, danh sách, màn che.
- Mỗi âm gắn với **một sự kiện nhìn thấy** (chữ hiện, dòng vào, chuyển cảnh).
- Giữ nhẹ: âm lượng 0.2–0.4, không gắn mọi khối chữ.

## 3. Khi không nên dùng
- `documentary`: preset `forbidden_styles: ["documentary"]` (validate báo lỗi).
- Chồng lên tiếng nói quan trọng, khoảnh khắc cảm xúc, tiếng vỗ tay.
- Gắn vào mọi khối chữ hoặc mọi điểm cắt: mệt tai.

## 4. Thông số
| Tham số | Mặc định | Khoảng | Ghi chú |
|---|---|---|---|
| `sfx` | – (bắt buộc) | mã trong `sfxlib.json`, ví dụ `03_nhan_manh/pop_chu_hien.wav` | thiếu hoặc sai mã thì validate báo lỗi |
| `volume` | theo `v` của danh mục | (0, 1] | tuyệt đối, không phải dB |
| `align` | `true` | `true`/`false` | `true`: bắt đầu sớm `a` giây (mốc "đập" trong danh mục) để đỉnh tiếng rơi đúng mốc; `false`: phát từ mốc |

Mốc: `anchor` kiểu `{clip, source_time}` (cộng `start_offset`) hoặc `{between:[A,B]}` (đầu clip B). Nếu mốc "đập" sớm hơn đầu video, phần đầu file bị cắt và có cảnh báo. File `loop: true` trong danh mục lặp suốt đến hết video: chỉ dùng cho tiếng nền.

## 5. Quy trình thực hiện
1. Xác nhận style cho phép; xác định sự kiện nhìn thấy cần âm.
2. Chọn nhóm: `01_hook` mở đầu, `02_chuyen_canh` chuyển cảnh, `03_nhan_manh` chữ/danh sách, `06_nghi_nha` kết hoặc dừng.
3. Mở `sfxlib.json` xem `a`, `v`, `sec`; chọn file ngắn cho chữ (≤ 0.5 s), dài hơn cho màn che.
4. Đặt `anchor` trùng với quyết định chữ/chuyển cảnh tương ứng; với dòng danh sách cộng `i × item_delay`.
5. Chạy `validate`, render, nghe lại (agent không nghe được: nhờ người dùng).

## 6. Ví dụ
```json
{
  "id": "d26", "technique": "sfx_cue", "preset": "sfx_cue_standard",
  "anchor": { "clip": "c04", "source_time": 3.3 },
  "start_offset": 0, "duration": 0.5,
  "parameters": { "sfx": "02_chuyen_canh/swipe_ui_luot.wav", "volume": 0.22 },
  "reason": "Tiếng vuốt khi dòng đầu của danh sách chạy vào",
  "priority": "decoration", "confidence": "low", "reference": null, "status": "proposed"
}
```

## 7. Quy tắc quyết định
- `R-SFX-1` (validate): `sfx` có trong danh mục và file tồn tại; `volume` ∈ (0, 1].
- `R-SFX-2`: `documentary` không dùng.
- `R-SFX-3`: tiếng nói luôn ưu tiên hơn SFX; hạ `volume` hoặc bỏ nếu SFX chồng lên lời quan trọng.
- Ưu tiên lớp: thường `decoration`/`rhythm`; chỉ dùng `style` cho tiêu đề mở đầu và chuyển cảnh chính.

## 8. Giới hạn đã biết
- Đã chạy thật: đo thấy tiếng boom ở đoạn câm của clip mở đầu, whoosh ở màn che. **Chưa nghe** để đánh giá độ vừa tai và độ khớp.
- Một số file là bản Mixkit; kiểm giấy phép trước khi phát hành.
- Cả thư viện đã copy nguyên (≈ 29 MB), kể cả nhóm chưa dùng.
