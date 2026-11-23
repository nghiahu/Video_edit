---
id: object_wipe
name: Object Wipe (Vật thể che ống kính rồi cắt)
group: transitions
roles: [continuity, flow, scene_change]
status: usable
source_of_values: convention
---

# Object Wipe

> **Đây là kỹ thuật dạng mẫu (pattern), không có quyết định riêng trong EDL, và KHÔNG phải mặt nạ tự động.** Nó được thực hiện bằng cách chọn hai clip mà **trong footage thật** có vật thể đi ngang che kín (hoặc gần kín) ống kính ở cuối clip ra và ở đầu clip vào, rồi cắt `hard_cut` ngay tại lúc khung bị che. Renderer không tạo mặt nạ, không tách vật thể, không tự "quét" hình theo vật thể.

## 1. Mục đích
Che điểm nối bằng một vật thể thật đi qua khung hình (người đi ngang sát máy, cánh cửa, tấm biển, tay che ống kính), để chuyển cảnh gọn mà như liền mạch.

## 2. Khi nên dùng
- Footage đã có vật che kín khung ở cuối clip ra (người đi sát máy, lưng áo choán khung) **và** có vật che ở đầu clip vào (hoặc hai vật cùng màu/tông tối).
- Chuyển địa điểm gần nhau (hành lang sang lớp học) khi muốn nối nhẹ, không dùng dissolve.
- Máy run_and_gun, cảnh sự kiện đông người, nơi vật che xuất hiện tự nhiên.
- Documentary: **chấp nhận được khi là vật che có thật, không dàn dựng** (nó hoạt động như cut on action). Không dùng để làm hiệu ứng "chuyển cảnh trang trí".

## 3. Khi không nên dùng
- Footage **không có** vật che: không tạo ra vật che bằng hậu kỳ (renderer chưa hỗ trợ), không giả lập bằng dissolve đen.
- Vật che chỉ che một phần khung, hình hai bên vẫn thấy rõ: hóa ra jump cut.
- Hai vật che có màu/tông rất khác nhau (áo trắng → áo đen): cú nhảy sáng/tối lộ.
- Cần giữ lời quan trọng ở điểm nối mà vật che làm gián đoạn hình mặt người nói.
- Cảnh vào không có vật che hoặc vật che không khớp hướng đi.

## 4. Thông số (hướng dẫn, không phải khóa EDL)
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| Phần khung bị che tại điểm cắt | ≥ 85% | 70–100% | diện tích khung | low |
| Thời gian vật che choán khung (mỗi clip) | 0.3–0.8 | 0.15–1.2 | giây | low |
| Chênh độ sáng trung bình hai vật che | nhỏ (cùng tông) | – | – | low |
| Điểm cắt trong lúc che | giữa thời gian che | – | – | low |
| Hướng đi của vật che | cùng hướng ở hai clip | cùng hướng | – | medium |
| Điểm nối | `hard_cut`, `cut_on: action` | – | – | medium |

## 5. Quy trình thực hiện
1. Tìm clip có vật che: đọc `description`/`issues`/`keywords` và xem lại clip. Chưa có công cụ phát hiện vật che; phải xác định thủ công.
2. Xác định khoảng thời gian khung bị che ở cuối clip ra (`t_out_cover`) và đầu clip vào (`t_in_cover`).
3. Đặt `source_out` của clip ra trong khoảng che (sau khi che kín); đặt `source_in` của clip vào trong khoảng che ở clip vào.
4. Nối bằng `hard_cut` (`cut_on: action`). Không thêm dissolve (sẽ lộ cả hai khung).
5. Giữ liên tục âm thanh: dùng `j_l_cut` hoặc ambience nối để chỗ nối không "tạch".
6. Xem lại: lúc khung bị che, cú cắt có "biến mất" không; nếu thấy phần hình đổi, dời điểm cắt vào giữa thời gian che.

## 6. Biến thể và preset
Không có preset riêng; dùng `cut_hard`. Không có biến thể tự động.
- **Che bằng người:** người đi ngang sát máy.
- **Che bằng vật cố định:** cột, cánh cửa, tấm biển lướt qua do máy di chuyển.
- **Che bằng tối:** hai clip kết/bắt đầu ở vùng tối (cửa, bóng); gần với hard cut thường.

## 7. Quy tắc quyết định
- `R-OWIPE-1`: NẾU footage không có vật che thật ở **cả hai** clip → không dùng; dùng `hard_cut` thường hoặc kỹ thuật khác.
- `R-OWIPE-2`: NẾU phần khung bị che < 70% tại điểm cắt → không gọi là object wipe; xem lại hoặc bỏ.
- `R-OWIPE-3`: NẾU hai vật che khác hẳn tông sáng/màu → tìm cặp khác.
- `R-OWIPE-4`: NẾU style `documentary` VÀ vật che là dàn dựng → bỏ (Storytelling > Decoration, `R-STYLE-DOC`).
- `R-OWIPE-5`: không dùng khi câu then chốt đang nói.

## 8. Ví dụ
Máy quay hành lang sự kiện (`c17`): một người đi sát máy, lưng choán khung. Cảnh lớp học (`c18`) bắt đầu bằng người cầm tài liệu lướt ngang sát máy từ cùng phía.

```json
{
  "id": "d11",
  "technique": "hard_cut",
  "preset": "cut_hard",
  "anchor": { "between": ["c17", "c18"] },
  "duration": 0,
  "parameters": { "cut_on": "action", "out_tail": 0.0, "in_lead": 0.0 },
  "reason": "Cắt tại lúc người đi ngang che kín khung ở cuối c17 và đầu c18 để chuyển từ hành lang sang lớp học",
  "priority": "storytelling",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```
Điểm cắt thật nằm ở `source_out` của `c17` và `source_in` của `c18`, chọn vào lúc khung bị che.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Che chưa kín | Thấy hình hai bên nhảy | Dời cắt vào giữa thời gian che |
| Ngược hướng | Vật che đi hai hướng khác | Chọn cặp cùng hướng |
| Nhảy sáng/tối | Chênh sáng đột ngột | `R-OWIPE-3` |
| Mong đợi hiệu ứng tự động | Không có mặt nạ trong renderer | Ghi rõ trong `reason`: dựa vào footage thật |
| Tiếng đứt | "Tạch" ở chỗ nối | `j_l_cut`, ambience |

## 10. Kiểm tra sau render
- Tại điểm cắt khung thực sự bị che kín; xem chậm để chắc không thấy hình nhảy.
- Hướng di chuyển vật che liền mạch.
- Tông sáng không đổi đột ngột; âm thanh liền.
- Nếu không đạt thì quay về `hard_cut` thường, không cố giữ ý đồ.
