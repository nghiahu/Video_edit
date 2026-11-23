---
id: montage
name: Montage (Chuỗi cảnh dồn ý)
group: storytelling
roles: [compression, rhythm, emotion]
status: usable
source_of_values: convention
---

# Montage

> **Đây là kỹ thuật dạng mẫu (pattern), không có quyết định riêng trong EDL.** Nó được thực hiện bằng cách đặt một chuỗi clip ngắn liên tiếp trong `timeline.clips`, nối bằng `hard_cut` (hiếm khi `cross_dissolve`), thường để `audio: mute` cho các clip và để nhạc nền (`audio.music`) dẫn nhịp. Renderer không có công cụ dựng montage, không tự chọn cảnh hay tự phân bố độ dài; người dùng hoặc AI chọn và sắp xếp thủ công.

## 1. Mục đích
Dồn nhiều ý hoặc một khoảng thời gian dài vào vài giây: tổng kết một quá trình, thể hiện không khí chung, hoặc nâng cảm xúc bằng chuỗi hình ngắn.

## 2. Khi nên dùng
- Tổng kết quá trình (một tuần học, ngày khai giảng) bằng 5–10 cảnh ngắn, không cần lời dẫn.
- Giữa hai đoạn có lời, cần "thở": chuỗi b-roll theo nhạc.
- Hook (5–10 s đầu) hoặc kết video: cảm xúc chung, không thông tin chi tiết.
- Footage có nhiều cảnh b-roll sạch, ổn định và liên quan cùng một chủ đề.
- Documentary: **hợp ở mức tiết chế** (nhịp `slow`/`moderate`, nhạc êm, hard cut). Montage dồn dập kiểu quảng cáo không hợp style.

## 3. Khi không nên dùng
- Nội dung cần giải thích hoặc dữ kiện (số liệu, tên): dùng cảnh dài + chữ (`kinetic_text`).
- Không đủ b-roll khớp chủ đề: tránh lấp bằng cảnh vô nghĩa (`R-BROLL-1`).
- Đoạn có lời quan trọng chưa nói xong.
- Footage chất lượng không đều, tông màu lệch: nhìn rối khi cắt nhanh.
- Video quá ngắn (≤ 30 s): montage chiếm hết, không còn nội dung chính.

## 4. Thông số (hướng dẫn, không phải khóa EDL)
Theo `core/pacing.md` (độ dài cảnh theo `pacing`):
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| Độ dài mỗi cảnh, `slow` | 4–6 | 3–8 | giây | medium |
| Độ dài mỗi cảnh, `moderate` | 2–4 | 1.5–5 | giây | medium |
| Độ dài mỗi cảnh, `fast` | 1–2 | 0.7–3 | giây | medium |
| Số cảnh trong một montage | 5–8 | 4–12 | cảnh | low |
| Tổng độ dài montage | 15–30 | 8–45 | giây | low |
| Biến thiên độ dài giữa các cảnh | ±20% | 10–40% | tỉ lệ | low |
| Nhạc | `base_db` −16 đến −18 | – | dBFS | medium |
| Tiếng gốc cảnh | `mute` (hoặc `duck`) | – | – | high |
| Điểm nối | `hard_cut` | `cross_dissolve` rất hiếm | – | medium |

## 5. Quy trình thực hiện
1. Nêu ý của montage bằng một câu (ví dụ "một ngày đầu học, từ cổng đến lớp"). Không có ý thì không dựng.
2. Lọc b-roll theo `topics`/`keywords` và `editorial.usable`; loại cảnh `issues` nặng.
3. Sắp xếp theo logic: thời gian, địa điểm (rộng → cận), hoặc cảm xúc tăng dần. Mở bằng cảnh rộng, kết bằng cảnh có hơi thở.
4. Đặt độ dài từng cảnh theo bảng; biến thiên nhẹ, không đều như máy.
5. Nối bằng `hard_cut`, chọn điểm cắt tránh giữa chuyển động camera (`hard-cut.md`) hoặc khớp chuyển động (`cut-on-action.md`).
6. Nhạc: có nhạc nền chạy suốt; mute tiếng gốc hoặc `duck` nếu có ambience đẹp. Nếu muốn cắt đúng nhịp, xem `beat-sync-cut.md` (cần danh sách mốc nhịp do người dùng cung cấp).
7. Kiểm tra: không hai cảnh liên tiếp trùng nội dung, độ sáng/tông liền nhau.

## 6. Biến thể và preset
Không có preset riêng.
- **Thời gian trôi:** cùng địa điểm ở các thời điểm khác nhau.
- **Không khí:** nhiều cảnh nhỏ cùng chủ đề (học viên, bàn, bảng).
- **Cảm xúc:** nhịp chậm, nhạc êm, hơi thở cuối.
- **Theo nhạc:** cắt khớp nhịp (xem `beat-sync-cut.md`).

## 7. Quy tắc quyết định
- `R-MONT-1`: NẾU không nêu được ý của chuỗi trong một câu `reason` → không dựng montage.
- `R-MONT-2`: NẾU độ dài cảnh trung bình ngắn hơn mức `pacing` của style (documentary: `slow`/`moderate`) → nới dài hoặc bớt cảnh.
- `R-MONT-3`: NẾU có nhạc VÀ có tiếng nói trong cùng đoạn → `audio_ducking` bắt buộc (`R-AUD-1`).
- `R-MONT-4`: không hai cảnh liên tiếp cùng nội dung (`R-BROLL-4`).
- `R-MONT-5`: không vượt ~25% tổng thời lượng video cho montage (documentary), trừ khi nội dung vốn là chuỗi hình.

## 8. Ví dụ
Montage 12 giây, `moderate`, tổng kết "ngày đầu học": cổng trường, hành lang, lớp học, học viên ghi chép.

```json
{
  "timeline_pattern": [
    { "id": "c24", "video_id": "<cong_truong>", "source_in": 0.5, "source_out": 3.5, "audio": "mute" },
    { "id": "c25", "video_id": "<hanh_lang>", "source_in": 2.0, "source_out": 4.5, "audio": "mute" },
    { "id": "c26", "video_id": "<lop_hoc>", "source_in": 1.0, "source_out": 4.5, "audio": "mute" },
    { "id": "c27", "video_id": "<hoc_vien_ghi_chep>", "source_in": 0.0, "source_out": 2.5, "audio": "mute" }
  ],
  "decisions_pattern": [
    { "technique": "hard_cut", "anchor": { "between": ["c24", "c25"] } },
    { "technique": "hard_cut", "anchor": { "between": ["c25", "c26"] } },
    { "technique": "hard_cut", "anchor": { "between": ["c26", "c27"] } }
  ]
}
```
Khuôn minh họa có chỗ `<...>` cần điền, không phải EDL chạy được. Nhạc nền khai báo ở `audio.music`.

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Cảnh quá ngắn | Không đọc được, chóng mặt | Theo bảng `pacing` |
| Nhịp đều như máy | Cảnh cùng độ dài | Biến thiên ±20% |
| Cảnh lệch chủ đề | Hình xen không liên quan | `R-MONT-1` |
| Tiếng gốc lọt vào | Nghe tạp âm | `mute` |
| Montage quá dài | Người xem chán | `R-MONT-5` |

## 10. Kiểm tra sau render
- Một câu nêu được ý của chuỗi; người xem cảm nhận được ý đó.
- Đếm số cắt trong montage, so với `pacing`.
- Nhạc đều, không bị cụt; không tiếng lạ.
- Tông màu/độ sáng liền nhau giữa các cảnh.
