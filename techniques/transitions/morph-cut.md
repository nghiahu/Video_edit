---
id: morph_cut
name: Morph Cut (xấp xỉ: mờ chồng cực ngắn + nhòe + phóng nhẹ)
group: transitions
roles: [jump_cut_smoothing, talking_head_cleanup]
status: usable
source_of_values: convention
---

# Morph Cut

> **Giới hạn quan trọng:** đây **không phải morph quang học** (không dò khuôn mặt, không nội suy chuyển động). Renderer chỉ làm mờ chồng rất ngắn kèm nhòe nhẹ và phóng nhẹ để **che** chỗ nhảy hình. Chỗ nhảy càng lớn thì càng lộ.

## 1. Mục đích
Làm dịu chỗ nhảy hình khi cắt bỏ từ đệm, quãng ngập ngừng hoặc câu nói lại trong **cùng một khung người nói**, để người xem ít nhận ra có cắt.

## 2. Khi nên dùng
- Cắt bỏ "ừm", "à", quãng lặng hoặc lần nói lại trong cùng một cú máy cố định (talking head, phỏng vấn).
- Đầu và đuôi chỗ cắt gần như cùng tư thế: đầu, vai, tay lệch nhau rất ít (ước lượng: chỗ nhảy vài phần trăm khung hình; con số này cần thử trên footage thật).
- Ánh sáng, nền và độ nét ở hai bên giống nhau (cùng cú máy, không đổi khẩu độ hay lấy nét).
- Muốn tránh `punch_in` hoặc b-roll phủ lên chỗ cắt mà vẫn giữ người nói chính trên hình.

## 3. Khi không nên dùng
- **Người nói đổi tư thế nhiều** (cúi, nghiêng, đưa tay lên mặt, quay đầu) giữa hai bên điểm cắt: hai đầu chồng nhau thành "bóng ma" trong ~0.25 s; kỹ thuật thất bại.
- Hai clip khác cú máy, khác góc, khác khung, khác địa điểm (đó là chuyển cảnh thật, dùng `cross_dissolve` hoặc `hard_cut`).
- Chỗ nhảy hình rất lớn hoặc nhiều lần liên tiếp trong vài giây (nhìn như rung hình).
- Người nói đang cử động mạnh hoặc nhấn giọng ngay điểm cắt (nhòe làm mất biểu cảm).
- Khi đã có `b_roll_insert` hoặc `j_l_cut` + b-roll che được chỗ cắt: không cần thêm morph.
- Không có tay cầm (mục 5).

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `duration` (tổng vùng chuyển) | 0.25 | 0.15–0.4 (renderer chấp nhận 0.15–3.0) | giây | low |
| `easing` | `ease_in_out` | `linear`, `ease_in`, `ease_out`, `ease_in_out` | – | low |
| `blur` (nhòe cực đại) | 3 | 0–6 | px ở khung cao 1080 | low |

**Cách renderer làm** (`style: morph`, `overlap: true`): clip A nhòe tăng dần (đến `blur`), giữ độ đục đầy đủ; clip B hiện dần (độ đục 0 đến 1), bắt đầu phóng 3% rồi về 100% và nhòe giảm về 0. Không có dò điểm đặc trưng, không biến dạng hình. Với `duration` 0.25 s, mỗi bên điểm cắt chỉ khoảng 0.125 s (vài frame), nên `confidence` đặt `low`.

## 5. Quy trình thực hiện
1. Xác nhận hai clip cùng nguồn, cùng khung, liền mạch về nội dung (đoạn bị cắt chỉ là từ đệm hoặc quãng chết).
2. So hai khung ở điểm cắt: vị trí đầu/vai/tay. Lệch lớn thì chọn điểm cắt khác (cắt lúc người nói ở nhịp nghỉ, miệng khép) hoặc dùng `b_roll_insert`.
3. **Tay cầm**: clip A cần còn ≥ `duration/2` giây nguồn sau `source_out`; clip B cần ≥ `duration/2` giây trước `source_in`. Vì cùng nguồn, tay cầm thường chính là đoạn vừa bị cắt bỏ, nên hình trong đoạn này (khoảng 0.125 s) sẽ lên hình lúc chuyển. Thiếu thì renderer tự rút và cảnh báo; không còn thì thành cắt thẳng.
4. Chọn `morph_cut_quick`. Không kéo dài `duration` để "che kỹ hơn": dài hơn thành mờ chồng thường và lộ hai đầu.
5. **Âm thanh:** chỉ tác động hình, tiếng vẫn cắt cứng tại điểm cắt. Cắt ở quãng lặng hoặc hơi thở để tiếng không "tạch"; nếu cần, thêm `j_l_cut` ở cùng điểm nối.

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `morph_cut_quick` | 0.25 s, `blur` 3, `ease_in_out`, `confidence: low`. Preset duy nhất hiện có |

## 7. Quy tắc quyết định
- `R-MORPH-1`: chỉ dùng khi hai clip cùng nguồn, cùng khung (talking head cố định) và nội dung nối liền.
- `R-MORPH-2`: NẾU tư thế người nói (đầu, vai) lệch rõ giữa hai bên điểm cắt THÌ tránh; dùng `b_roll_insert` hoặc chọn điểm cắt khác.
- `R-MORPH-3`: không hai `morph_cut` cách nhau < 3 giây (cũng là ngưỡng cảnh báo của renderer cho chuyển cảnh đặc biệt); nếu cần cắt dày thì xem lại biên tập (cắt ít hơn hoặc phủ b-roll).
- `R-MORPH-4`: giữ `duration` ≤ 0.4 s.
- `R-MORPH-5`: cắt ở quãng lặng để tiếng không "tạch".
- `R-MORPH-6`: priority `clarity` hoặc `rhythm`; luôn ghi vào `reason` chỗ nào bị cắt bỏ.

## 8. Ví dụ
Người dẫn chương trình nói "chúng tôi, ừm, rất vui khi...", cắt bỏ "ừm" (khoảng 0.5 s) giữa hai clip c04 và c05 cùng một cú máy cố định.

```json
{
  "id": "d07",
  "technique": "morph_cut",
  "preset": "morph_cut_quick",
  "anchor": { "between": ["c04", "c05"] },
  "duration": 0.25,
  "parameters": { "duration": 0.25, "blur": 3 },
  "reason": "Bỏ từ đệm 'ừm' trong cùng cú máy; hai bên điểm cắt cùng tư thế nên mờ chồng cực ngắn đủ che chỗ nhảy",
  "priority": "clarity",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Hai đầu chồng nhau ("bóng ma") | Thấy hai khuôn mặt mờ trong ~0.25 s | `R-MORPH-2`; đổi điểm cắt hoặc dùng b-roll |
| Kéo dài để che kỹ | `duration` > 0.4 s, như mờ chồng thường | `R-MORPH-4` |
| Dùng giữa hai khung khác nhau | Nhìn như chuyển cảnh lỗi | `R-MORPH-1` |
| Cắt dày liên tiếp | Hình rung, "thở" mỗi 1–2 giây | `R-MORPH-3`; giảm số lần cắt |
| Tiếng "tạch" ở điểm cắt | Nghe click ở chỗ nối | Cắt ở quãng lặng; thêm `j_l_cut` |
| Tin rằng đây là morph thật | Kỳ vọng khuôn mặt tự khớp | Ghi rõ giới hạn khi báo cáo với người dùng |

## 10. Kiểm tra sau render
- Xem từng frame quanh điểm cắt: không thấy hai đầu chồng nhau rõ ràng; nếu thấy, đổi sang b-roll hoặc điểm cắt khác.
- Nhòe và phóng 3% không làm người nói trông "chớp" hoặc rung.
- Không có cảnh báo thiếu tay cầm.
- Tiếng liền, không click, không lẹm nửa từ.
- Số lần dùng và khoảng cách đạt `R-MORPH-3`.
