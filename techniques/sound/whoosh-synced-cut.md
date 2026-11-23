---
id: whoosh_synced_cut
name: Whoosh Synced Cut (Âm whoosh khớp điểm cắt)
group: sound
roles: [transition, energy, emphasis]
status: usable
source_of_values: convention
---

# Whoosh Synced Cut

## 1. Mục đích
Gắn một hiệu ứng âm thanh ngắn (whoosh, swoosh, impact) vào điểm cắt để tiếng "đỡ" cho cú chuyển cảnh, nhất là khi cắt đi cùng chuyển động nhanh trên hình. Chỉ có ý nghĩa với style năng động.

## 2. Khi nên dùng
- Cắt nối cảnh có chuyển động nhanh cùng chiều (whip, trượt, zoom nhanh, `speed_ramp_transition`): tiếng whoosh xác nhận cú chuyển.
- Video quảng bá, sự kiện năng động, hoặc tiêu đề/chữ xuất hiện kiểu mạnh.
- Người dùng **đã đưa** sẵn một file âm thanh phù hợp (xem mục 4).
- **Không dành cho documentary**: preset `forbidden_styles: ["documentary"]` và `styles/documentary.md` ghi rõ không dùng SFX trang trí (`core/audio-principles.md`: SFX rất tiết kiệm, documentary gần như không dùng).

## 3. Khi không nên dùng
- Style `documentary` (kiểm tra hợp lệ báo lỗi).
- Điểm cắt nằm trong lời thoại hoặc phần cảm xúc: tiếng SFX lấn tiếng nói (tiếng nói luôn ưu tiên cao hơn SFX, `core/audio-principles.md`).
- Cảnh cắt thường, không có chuyển động đi kèm: whoosh không có lý do vật lý, nghe thừa.
- Dùng ở mọi điểm cắt: mất tác dụng và gây mệt tai.
- Chưa có file âm thanh do người dùng cung cấp: không có gì để gắn.

## 4. Thông số
| Tham số | Mặc định | Khoảng cho phép | Đơn vị | Confidence |
|---|---|---|---|---|
| `file` | không có (bắt buộc) | đường dẫn tương đối từ thư mục dự án tới file âm thanh | – | – |
| `gain_db` | −12 | −40 đến 0 | dB | low |
| `offset` | −0,1 | không kiểm tra; nên −0,25 đến +0,05 | giây (âm = sớm hơn điểm cắt) | low |

**Về file âm thanh:**
- Renderer **không kèm sẵn** file whoosh nào. `parameters.file` là khóa bắt buộc, do người dùng đưa; thiếu thì kiểm tra hợp lệ báo lỗi. Khi render, file được tìm theo đường dẫn tính từ thư mục dự án, và nếu không thấy thì dừng với thông báo.
- Có thể tham khảo mục đích của thư viện `Tiem-edit-nho/public/sfx` để biết nên tìm loại tiếng gì, nhưng thư viện này **không phải phụ thuộc**: luôn dùng file do người dùng chỉ định.
- Renderer phát file **toàn bộ**, không cắt độ dài: chọn file ngắn (≈0,3–1 giây) và đuôi tắt gọn.

**Cách tính vị trí:** điểm cắt = đầu clip B trên timeline (`anchor.between[1]`); âm bắt đầu tại điểm cắt + `offset` (không âm hơn 0). `start_offset` và `duration` của quyết định không được dùng. Mức tiếng thực = `gain_db` nhân với master (âm lượng tổng, kể cả `fade_in_out`).

## 5. Quy trình thực hiện
1. Xác nhận style cho phép và điểm cắt có chuyển động hợp lý.
2. Hỏi người dùng file âm thanh; nếu chưa có, **không đề xuất quyết định này** (không bịa đường dẫn).
3. Chọn `offset`: -0,1 giây để đỉnh của whoosh rơi vào điểm cắt hoặc ngay trước nó (người xem nghe tiếng hơi đến trước). Điều chỉnh theo độ dài tiền-đỉnh của file cụ thể (đo trên file).
4. Chọn `gain_db`: bắt đầu ở -12 và hạ nếu lấn nhạc/tiếng nền; không vượt đỉnh −1 dBFS tổng.
5. Đặt `anchor: { between: ["A","B"] }`.

## 6. Biến thể và preset
| Preset | `gain_db` / `offset` | Dùng khi |
|---|---|---|
| `whoosh_cut_standard` | −12 / −0,1 | Mặc định; luôn phải thêm `parameters.file` |

`forbidden_styles: ["documentary"]`; confidence `low`.

## 7. Quy tắc quyết định
- `R-WHOOSH-1`: NẾU `strategy.style = documentary` THÌ không dùng.
- `R-WHOOSH-2`: NẾU chưa có `parameters.file` do người dùng cung cấp THÌ không tạo quyết định.
- `R-WHOOSH-3`: NẾU điểm cắt có lời thoại (clip A hoặc B `audio: keep` và đang có người nói gần điểm cắt) THÌ hạ `gain_db` ≤ −18 hoặc bỏ.
- `R-WHOOSH-4`: chỉ gắn whoosh vào cắt có chuyển động nhanh đi kèm hoặc `speed_ramp_transition`; không gắn vào `hard_cut` thường.
- `R-WHOOSH-5`: không quá 1 whoosh mỗi ~20 giây video.
- `R-WHOOSH-6`: **tác động lên neo cùng clip:** điểm cắt tính theo đầu clip B nên đã tính các đổi tốc độ phía trước (clip A co lại thì whoosh dịch sớm theo). Nếu B có `time_lapse` hoặc `speed_ramp_transition` ở đầu, vị trí đầu B không đổi nhưng `offset` tính bằng giây đầu ra; không cần chỉnh lại.

## 8. Ví dụ
Điểm cắt giữa `c05` và `c06` trong video recap năng động (style không phải documentary); người dùng cung cấp file `assets/sfx/whoosh-short.wav`.

```json
{
  "id": "d14",
  "technique": "whoosh_synced_cut",
  "preset": "whoosh_cut_standard",
  "anchor": { "between": ["c05", "c06"] },
  "start_offset": 0,
  "duration": 0,
  "parameters": { "file": "assets/sfx/whoosh-short.wav", "gain_db": -14, "offset": -0.12 },
  "reason": "Cắt sang cảnh đoàn rước đi nhanh từ trái sang phải, tiếng whoosh nhẹ xác nhận cú chuyển",
  "priority": "style",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Dùng ở documentary | Kiểm tra hợp lệ báo preset bị cấm | `R-WHOOSH-1` |
| Thiếu `parameters.file` | Kiểm tra hợp lệ báo lỗi cần file | `R-WHOOSH-2` |
| Đường dẫn sai | Render dừng, "không thấy file SFX" | Đường dẫn tương đối từ thư mục dự án |
| Whoosh lấn tiếng nói | Khó nghe lời quanh điểm cắt | `R-WHOOSH-3`, hạ `gain_db` |
| Tiếng trễ so với hình | Whoosh nghe sau cú cắt | Giảm `offset` (âm hơn) |
| File dài | Đuôi tiếng lấn sang cảnh sau | Chọn file ngắn, đuôi tắt gọn |

## 10. Kiểm tra sau render
- Đỉnh whoosh rơi đúng điểm cắt hoặc ngay trước; không trễ.
- Tiếng không lấn lời thoại, nhạc; đỉnh tổng không vượt −1 dBFS.
- File phát đủ, không bị cắt cụt hoặc thừa đuôi.
- Whoosh không xuất hiện ở các điểm cắt thường.
