---
id: swipe
name: Swipe (Cảnh cũ vuốt đi, lộ cảnh mới)
group: transitions
roles: [graphic_transition, reveal]
status: usable
source_of_values: convention
---

# Swipe

## 1. Mục đích
Cảnh cũ như một tấm bị **vuốt đi** khỏi khung, lộ ra cảnh mới nằm bên dưới. Cảm giác "lật bỏ, kéo màn" gọn; nhấn vào việc cảnh cũ rời đi (khác `slide`: B đè lên; khác `push`: hai cảnh cùng trượt).

## 2. Khi nên dùng
- Video quảng bá, giới thiệu hoặc UI-demo, khi muốn cảnh cũ "đóng lại" để lộ nội dung mới ngay sau nó.
- Chuyển nhanh giữa hai mục mà cảnh sau là "đáp án/kết quả" của cảnh trước (lộ ra).
- Hai cảnh đều có khung rõ (không bị ranh giới ảnh bóng mờ làm rối).
- **Style documentary: bị cấm** (`swipe_left` có `forbidden_styles: ["documentary"]`).

## 3. Khi không nên dùng
- Documentary, phỏng vấn, nội dung trang trọng hoặc cảm xúc.
- Đoạn có lời thoại liên tục hoặc giữa các cảnh đời thường (đồ họa phá cảm giác chân thực).
- Cảnh cũ nền tối hoặc nhiều chi tiết sát mép (vệt bóng và mép vuốt lộ lỗi).
- Không có tay cầm ở hai clip (mục 5).
- Dùng liên tục nhiều điểm nối.
- Priority: Decoration.

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `duration` (tổng vùng) | 0.5 | 0.3–0.8 (renderer chấp nhận 0.15–3.0) | giây | low |
| `easing` | `ease_in_out` | `linear`, `ease_in`, `ease_out`, `ease_in_out` | – | low |
| `direction` | `left` | `left`, `right`, `up`, `down` | – | low |

**Cách renderer làm** (`style: swipe`, `overlap: true`): clip A nằm lớp trên (`z-index: 2`, có đặt bóng đổ `0 0 60px rgba(0,0,0,0.5)`), trượt khỏi khung theo `direction` (đi 100% khung). Clip B nằm lớp dưới (`z-index: 1`), đứng tại chỗ nhưng phóng từ 96% lên 100% trong vùng (hiệu ứng "tiến lên" rất nhẹ). `left`: A vuốt sang trái, B lộ ra từ phía phải. Bóng đổ có hiển thị hay không phụ thuộc cách vùng chứa clip được dựng; chưa kiểm chứng trên bản render, hãy xem preview.

## 5. Quy trình thực hiện
1. Xác nhận style không phải documentary, có lý do (lộ nội dung mới, chuyển mục).
2. **Tay cầm**: A và B cùng hiện suốt vùng nên cả hai clip cần đoạn thừa quanh điểm cắt. A cần còn ≥ `duration/2` giây nguồn sau `source_out`; B cần ≥ `duration/2` giây nguồn trước `source_in`. Các đoạn thừa lên hình: A chạy tiếp sau điểm cắt trong lúc bị vuốt đi, B đã chạy trước điểm cắt khi đang lộ ra; tổng độ dài video không đổi. Thiếu thì renderer tự rút `duration` đối xứng và cảnh báo; hết tay cầm thì thành cắt thẳng.
3. Duyệt nội dung hai đoạn thừa (B đã chạy trước điểm cắt và đã nhìn thấy).
4. Chọn `direction`: ưu tiên hướng A rời khung ngược với hướng chuyển động chính của A.
5. Chọn preset `swipe_left`.
6. **Âm thanh:** chỉ tác động hình; thêm `j_l_cut` nếu cần nối tiếng.

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `swipe_left` | 0.5 s, A vuốt sang trái, lộ B |

Phân biệt ba kiểu cùng họ:
- `slide`: B trượt vào **đè lên** A; A đứng yên và tối nhẹ.
- `push`: A và B **cùng trượt**, dính nhau.
- `swipe`: A **trượt đi**, B **đứng yên** bên dưới (có phóng nhẹ).

## 7. Quy tắc quyết định
- `R-SWIPE-1`: KHÔNG dùng ở style documentary.
- `R-SWIPE-2`: chỉ dùng khi muốn "lộ" cảnh sau như kết quả/mục kế tiếp; ghi `reason`.
- `R-SWIPE-3`: tay cầm hai clip ≥ `duration/2`.
- `R-SWIPE-4`: không dùng cho cảnh cũ tối hoặc cần nhìn rõ mép khung.
- `R-SWIPE-5`: trong ngân sách `special_transition`, cách chuyển cảnh đặc biệt khác ≥ 3 giây.
- `R-SWIPE-6`: không đặt chữ hoặc `punch_in` trong vùng chuyển.

## 8. Ví dụ
Video giới thiệu chương trình học (style `corporate`): từ cảnh câu hỏi/bối cảnh (c02) vuốt đi lộ cảnh kết quả học viên (c03).

```json
{
  "id": "d02",
  "technique": "swipe",
  "preset": "swipe_left",
  "anchor": { "between": ["c02", "c03"] },
  "duration": 0.5,
  "parameters": { "duration": 0.5, "direction": "left" },
  "reason": "Cảnh bối cảnh vuốt đi để lộ kết quả học viên ngay sau, nhấn mối quan hệ nguyên nhân - kết quả",
  "priority": "style",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Dùng ở documentary | Validator báo lỗi style | `R-SWIPE-1` |
| Nhầm với `slide`/`push` | A di chuyển khi không mong muốn | Xem mục 6 |
| Thiếu tay cầm | Hình đứng, có cảnh báo khi render | Mục 5 bước 2 |
| Bóng đổ không hiển thị | Mép A không có bóng, nhìn phẳng | Chấp nhận; xem preview, báo lại nếu cần cải tiến renderer |
| Cảnh B lộ đoạn thừa xấu | B đã chạy trước điểm cắt, thấy rung/người lạ | Mục 5 bước 3 |

## 10. Kiểm tra sau render
- A rời khung mượt, B lộ ra đúng vị trí và không bị hở mép (không thấy nền đen).
- B phóng nhẹ không gây giật.
- Không có cảnh báo thiếu tay cầm.
- Chữ trong vùng chuyển đã dời.
- Tiếng ở điểm nối không "tạch".
