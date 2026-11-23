---
id: mask_reveal
name: Mask Reveal (Lộ hình từ một điểm)
group: transitions
roles: [reveal, emphasis, energy]
status: usable
source_of_values: convention
---

# Mask Reveal

## 1. Mục đích
Cảnh mới **lộ ra từ một điểm trên khung** qua vòng tròn mép mềm lan dần, đè lên cảnh cũ. Hướng mắt người xem tới điểm xuất phát (tâm khung, hoặc một góc) và tạo cảm giác "mở ra".

> Giới hạn quan trọng: đây là mặt nạ **tròn mép mềm** đặt tại tọa độ `origin_x/origin_y` cố định theo khung hình. Nó **không** bám theo vật thể hay người trong cảnh (không phải mặt nạ theo đối tượng, không có tracking).

## 2. Khi nên dùng
- Mở một phần mới có tính "khám phá", "bắt đầu" (đầu phần giới thiệu sản phẩm, chuyển sang chương mới của video quảng bá).
- Điểm xuất phát có ý nghĩa với bố cục: chủ thể cảnh mới nằm gần góc/tâm bạn chọn (đặt `origin` trùng chỗ chủ thể).
- Style năng động, tech, quảng bá, nhịp vừa đến nhanh.

## 3. Khi không nên dùng
- Style `documentary`: preset ghi `forbidden_styles: ["documentary"]` (chuyển cảnh trang trí, lộ liễu).
- Trong đoạn đối thoại, phát biểu, nội dung cảm xúc nghiêm túc: vòng tròn lan ra làm người xem để ý hiệu ứng thay vì lời nói.
- Khi chủ thể cảnh mới lệch xa điểm `origin` và vòng tròn mở ngang qua mặt người: mặt bị cắt nửa trong ~0.5 s.
- Hai kỹ thuật đặc biệt sát nhau (< 3 giây) hoặc vượt `budget.special_transition`.
- Hai clip không có tay cầm (xem mục 5).

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `duration` (tổng vùng nối) | 1 | 0.6–1.4 (renderer chấp nhận 0.15–3) | giây | low |
| `easing` | `ease_in_out` | `linear` / `ease_in` / `ease_out` / `ease_in_out` | – | low |
| `origin_x` | 0.5 (`mask_reveal_corner`: 0.1) | 0–1 | tỉ lệ chiều rộng, 0 = trái | low |
| `origin_y` | 0.5 (`mask_reveal_corner`: 0.9) | 0–1 | tỉ lệ chiều cao, 0 = trên | low |
| `softness` | 0.25 (`mask_reveal_corner`: 0.3) | 0–0.5 | tỉ lệ bán kính phủ tối đa | low |

Cách tính trong renderer: bán kính phủ kín `R` = khoảng cách từ điểm gốc tới góc xa nhất; bề rộng mép mềm = `softness × R`; bán kính tăng theo `easing` từ 0 đến `R + mép mềm`, nên cuối vùng cảnh mới phủ kín khung.

## 5. Quy trình thực hiện
1. Xác nhận điểm nối cần "mở phần mới" (lý do kể chuyện hoặc nhịp). Không có lý do → `hard_cut`.
2. Kiểu này có `overlap: true`: cần **tay cầm**. Clip trước phải còn ≥ `duration/2` giây nguồn sau `source_out`; clip sau còn ≥ `duration/2` giây nguồn trước `source_in`. Renderer tự rút `duration` theo phần tay cầm dùng được và ghi cảnh báo; không có tay cầm thì bỏ hiệu ứng, thành cắt thẳng. Tổng thời lượng video không đổi.
3. Chọn `origin` theo bố cục clip sau: chủ thể giữa khung → `mask_reveal_center`; chủ thể ở góc dưới trái → `mask_reveal_corner`.
4. Đặt `anchor.between` hai clip liền kề.
5. Hình cảnh cũ vẫn chạy bên dưới trong suốt vùng nối; đừng để cảnh cũ có chữ/lower third rơi vào vùng này.
6. Âm thanh: hiệu ứng chỉ tác động hình; xử lý tiếng riêng (`j_l_cut`, nhạc liền mạch).

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `mask_reveal_center` | Từ tâm khung, 1 s, `softness` 0.25 |
| `mask_reveal_corner` | Từ góc dưới trái (0.1, 0.9), 1 s, `softness` 0.3 |

## 7. Quy tắc quyết định
- `R-MASK-1`: NẾU `strategy.style` là `documentary` THÌ **tránh** (đã bị cấm trong preset).
- `R-MASK-2`: chỉ dùng khi có lý do kể chuyện hoặc nhịp (mở phần mới); ghi vào `reason`. Ưu tiên: Storytelling > Rhythm > Style > Decoration, nên thường mang `priority: style`.
- `R-MASK-3`: NẾU chủ thể chính clip sau cách `origin` quá xa (ví dụ ở góc đối diện) THÌ đổi `origin` về gần chủ thể hoặc dùng cách nối khác.
- `R-MASK-4`: NẾU thiếu tay cầm (< `duration/2` mỗi bên) THÌ rút `duration` hoặc dùng `hard_cut`.
- `R-MASK-5`: tính vào `budget.special_transition`; cách chuyển cảnh đặc biệt khác ≥ 3 giây.
- `R-MASK-6`: không đặt chữ hay `punch_in` trong vùng nối.

## 8. Ví dụ
Video quảng bá phần mềm: từ cảnh logo sang cảnh giao diện, nút chính ở góc dưới trái.

```json
{
  "id": "d05",
  "technique": "mask_reveal",
  "preset": "mask_reveal_corner",
  "anchor": { "between": ["c03", "c04"] },
  "duration": 1,
  "parameters": { "duration": 1, "origin_x": 0.1, "origin_y": 0.9, "softness": 0.3 },
  "reason": "Mở phần giới thiệu giao diện; nút chính nằm góc dưới trái nên vòng lộ hình xuất phát từ đó",
  "priority": "style",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Hiểu nhầm là mặt nạ theo vật thể | Vòng tròn không bám theo người di chuyển | Dùng đúng bản chất: điểm cố định trong khung |
| `origin` lệch chủ thể | Mặt/chủ thể bị vòng tròn cắt giữa chừng | `R-MASK-3` |
| Thiếu tay cầm | Hình đứng hoặc nhảy trong vùng lộ | Kiểm tra mục 5 bước 2 |
| `softness` quá nhỏ | Mép cứng, giống iris | Giữ ≥ 0.2 nếu muốn mềm |
| Lạm dụng | Nhiều kiểu lộ hình khác nhau trong một video | `R-MASK-5`, giữ một ngôn ngữ chuyển cảnh |

## 10. Kiểm tra sau render
- Vòng lộ hình bắt đầu đúng điểm `origin` và phủ kín khung đến hết vùng, không còn viền cảnh cũ.
- Mép mềm mượt, không răng cưa lộ rõ.
- Không có hình nguồn đứng ở đầu hoặc cuối vùng (tay cầm đủ); không có cảnh báo tay cầm trong log.
- Tiếng ở điểm nối không "tạch"; không có chữ trong vùng nối.
