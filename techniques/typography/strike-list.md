---
id: strike_list
name: Strike List (Danh sách gạch ngang)
group: typography
roles: [information, emphasis]
status: usable
source_of_values: observed
---

# Strike List

## 1. Mục đích
Bác bỏ niềm tin sai hoặc liệt kê thứ "không cần": từng dòng hiện ra rồi bị **gạch ngang có hoạt ảnh** (vạch chạy từ trái sang), dòng đã gạch mờ đi. Rút từ REF_012 (đoạn đặt kỳ vọng thật).

## 2. Khi nên dùng
- Người nói liệt kê điều sai, hiểu lầm, việc không cần làm ("nhiều người tưởng…").
- Trước khi đưa ra cách đúng: gạch xong rồi mới nói đáp án.

## 3. Khi không nên dùng
- Nội dung không phải phủ định (dùng `bullet_list_reveal`).
- Không có lời nói/nguồn cho từng dòng (`R-SRC-1`).
- Hơn 5 dòng hoặc dòng dài: người xem không kịp đọc trước khi bị gạch.

## 4. Thông số
| Khóa | Mặc định | Ý nghĩa |
|---|---|---|
| `lines` | – | Các dòng (≤ 5, tổng ≤ 30 từ) |
| `strike_lines` | tất cả | Chỉ số dòng bị gạch (để lại dòng đúng không gạch) |
| `strike_delay` | 0.7 | Giây từ lúc khối vào tới vạch đầu |
| `strike_item_delay` | 0.6 | Giây giữa hai vạch |
| `strike_duration` | 0.35 | Thời gian một vạch chạy hết dòng |
| `strike_color`, `strike_width` | đỏ, 6 px | Màu, độ dày vạch (px ở 1080p) |
| `strike_dim` | 0.55 | Độ đậm còn lại của chữ sau khi gạch |
| `item_delay` | 0.5 | Giây giữa hai dòng hiện ra (`line_stagger`) |

## 5. Quy trình thực hiện
1. Lấy các ý sai từ lời nói, rút gọn ≤ 6 từ/dòng.
2. Đặt `strike_delay` khớp lúc người nói bắt đầu bác bỏ; `strike_item_delay` theo nhịp nói.
3. Tính `hold` ≥ mức tối thiểu của `validate` và đủ để vạch cuối chạy xong + ~1 s.

## 6. Biến thể và preset
| Preset | Mô tả | Documentary |
|---|---|---|
| `strike_list_myth` | Thẻ trắng, chữ navy, vạch đỏ, dòng hiện lần lượt | Cấm |

## 7. Quy tắc quyết định
- NẾU người nói phủ định một danh sách THÌ dùng; nếu chỉ một ý THÌ dùng `big_text`.
- Vạch phải xuất hiện **sau** khi dòng đọc được ít nhất ~0,5 s.

## 8. Ví dụ
```json
{
  "id": "d20",
  "technique": "strike_list",
  "preset": "strike_list_myth",
  "anchor": { "clip": "c05", "source_time": 2.0 },
  "start_offset": 0,
  "duration": 0,
  "parameters": { "lines": ["Một phát ăn ngay", "Không cần sửa"], "hold": 3.5 },
  "reason": "Người nói bác bỏ hai hiểu lầm trước khi nêu cách đúng",
  "priority": "clarity",
  "confidence": "medium",
  "reference": "styles/social.md",
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
- Gạch quá sớm, người xem chưa đọc kịp: tăng `strike_delay`.
- Dòng xuống hàng: vạch chỉ phủ phần chiều ngang của khối dòng; giữ dòng ngắn.

## 10. Kiểm tra sau render
- Xem ảnh khung ở lúc hoạt ảnh xong và giữa hoạt ảnh; khung dọc xem ở độ phân giải thật.
- Chữ/hình không đè mặt chủ thể (`R-SUBJ-1`); `validate` không còn cảnh báo vùng an toàn 9:16 hoặc đã ghi lý do.
- Vạch phủ đủ chiều dài chữ, không lệch lên/xuống dấu tiếng Việt.
