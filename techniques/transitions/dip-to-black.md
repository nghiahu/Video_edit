---
id: dip_to_black
name: Dip to Black (Xuống đen rồi lên cảnh mới)
group: transitions
roles: [chapter_break, closure, time_passage]
status: usable
source_of_values: convention
---

# Dip to Black

## 1. Mục đích
Hình tối dần xuống đen, cảnh mới sáng dần lên từ đen. Báo hiệu **khép một đoạn, chuyển chương, trôi thời gian dài** hoặc đổi địa điểm lớn; mạnh và "dứt khoát" hơn `cross_dissolve`.

## 2. Khi nên dùng
- Kết một chương/phần của video và sang chương hoàn toàn khác (ví dụ từ phần phát biểu sang phần hoạt động).
- Trôi thời gian dài ("sáng hôm sau", "một tuần sau") hoặc đổi địa điểm lớn, khi hai cảnh không liên quan về hình.
- Sau một đoạn nặng cảm xúc, cần khoảng lặng trước đoạn mới.
- Style documentary: được phép (preset không cấm), tính vào `budget.special_transition` (0–2 mỗi video). Với kết/mở cả video, dùng `fade_in_out`, không dùng dip.

## 3. Khi không nên dùng
- Giữa các cảnh cùng đoạn, cùng mạch (dip làm gãy nhịp; `hard_cut` đủ).
- Đang có nhạc cao trào hoặc người nói giữa câu: màn đen làm đứt cảm xúc.
- Dùng nhiều lần: mỗi lần dip là một "chấm hết"; quá hai lần mỗi video là phô diễn.
- Footage tối sẵn: đen chồng đen, người xem tưởng lỗi mất hình.
- Khi một trong hai clip quá ngắn (mục 5: cần mỗi bên ≥ `duration/2`).

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `duration` (tổng vùng chuyển) | 1.0 (`dip_to_black_standard`), 0.6 (`dip_to_black_quick`) | 0.5–1.6 (renderer chấp nhận 0.15–3.0) | giây | medium |
| `easing` | `ease_in_out` | `linear`, `ease_in`, `ease_out`, `ease_in_out` | – | medium |

Màu luôn là `#000000`, do renderer cố định (`fixed`) theo kỹ thuật; **không đặt `color` trong `parameters`** (khóa không có trong preset sẽ bị báo lỗi).

**Cách renderer làm** (`style: dip`, `overlap: false`, có lớp phủ): một lớp màu đen phủ toàn khung, độ đục tăng từ 0 đến 1 ở nửa đầu vùng (p từ 0 đến 0.5), giảm từ 1 về 0 ở nửa sau. Clip A chỉ hiện nửa đầu, clip B chỉ hiện nửa sau; đổi clip xảy ra đúng lúc màn đen kín. Lớp phủ nằm **dưới** chữ (phụ đề, `lower_third`, `kinetic_text` vẫn hiện trên nền đen).

## 5. Quy trình thực hiện
1. Xác nhận ranh giới chương/trôi thời gian thật sự. Không có thì `hard_cut` (`R-CUT-1`).
2. **Không cần tay cầm**: kiểu này tuần tự (không chồng). Điểm cắt nằm giữa vùng, mỗi bên có hiệu ứng riêng ngay trong thân clip của nó. Vì vậy mỗi clip phải đủ dài: **≥ `duration/2`**. Nếu một clip ngắn hơn, renderer rút `duration` theo clip ngắn hơn và cảnh báo.
3. Hiệu ứng "ăn" vào thân clip: nửa cuối của A bị tối dần, nửa đầu của B sáng dần. Đừng đặt hành động quan trọng hay lời nói then chốt ở khoảng này.
4. Chọn preset: `dip_to_black_standard` (1.0 s) cho chuyển chương; `dip_to_black_quick` (0.6 s) khi nhịp nhanh hơn.
5. **Âm thanh:** chỉ tác động hình. Tiếng gốc ở A và B vẫn phát bình thường; nếu muốn tiếng cũng tắt dần và lên lại, hạ/thay tiếng bằng nhạc nền liền mạch hoặc `j_l_cut`. Không dùng `fade_in_out` để làm tiếng cho điểm nối giữa video.
6. Tránh chữ trong vùng đen (chữ nổi trên màn đen trông như lỗi).

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `dip_to_black_standard` | 1.0 s, chuyển chương |
| `dip_to_black_quick` | 0.6 s, nhanh hơn |

## 7. Quy tắc quyết định
- `R-DIPB-1`: chỉ dùng ở ranh giới chương, trôi thời gian dài hoặc đổi địa điểm lớn; ghi lý do vào `reason`.
- `R-DIPB-2`: tối đa 2 mỗi video và cách chuyển cảnh đặc biệt khác ≥ 3 giây (ngân sách `special_transition`).
- `R-DIPB-3`: cả hai clip dài ≥ `duration/2` (thường ≥ 0.5 s với preset standard).
- `R-DIPB-4`: không dùng trong đoạn đối thoại liên tục hoặc khi nhạc đang cao trào.
- `R-DIPB-5`: không đặt chữ trong vùng đen.
- `R-DIPB-6`: mở/kết cả video dùng `fade_in_out`, không dùng dip.

## 8. Ví dụ
Kết phần phát biểu của diễn giả (c06), sang phần hoạt động của học viên vào buổi chiều (c07).

```json
{
  "id": "d04",
  "technique": "dip_to_black",
  "preset": "dip_to_black_standard",
  "anchor": { "between": ["c06", "c07"] },
  "duration": 1.0,
  "parameters": { "duration": 1.0 },
  "reason": "Kết phần phát biểu, sang phần hoạt động buổi chiều; xuống đen báo hiệu chuyển chương",
  "priority": "storytelling",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Dip giữa hai cảnh cùng đoạn | Video đứt nhịp, như vô số "chấm hết" | `R-DIPB-1` |
| Clip quá ngắn | Cảnh báo "clip quá ngắn" khi render; hiệu ứng bị rút | `R-DIPB-3` |
| Cắt lời đang nói | Câu nói tắt mờ cùng hình | Chọn điểm nối ở cuối ý/hơi thở |
| Chữ nổi trên nền đen | Phụ đề hoặc tên lơ lửng giữa màn đen | Dời chữ ra ngoài vùng chuyển |
| Mong tiếng tự tắt theo hình | Tiếng vẫn phát khi hình đen | Dùng nhạc nền liền hoặc `j_l_cut` |

## 10. Kiểm tra sau render
- Màn đen kín xuất hiện đúng điểm cắt, không có frame "nhấp" cảnh khác.
- Thời lượng tối/sáng vừa (không quá lâu gây tưởng mất hình).
- Không có cảnh báo clip quá ngắn.
- Tiếng ở vùng đen: liền mạch, không để tiếng thoại bị tắt đột ngột.
- Số lần dùng nằm trong ngân sách.
