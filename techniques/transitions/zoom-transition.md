---
id: zoom_transition
name: Zoom Transition (Phóng nhanh vào rồi bung ra cảnh mới)
group: transitions
roles: [energy, impact, transition_in_motion]
status: usable
source_of_values: convention
---

# Zoom Transition

## 1. Mục đích
Cảnh cũ bị phóng nhanh vào kèm nhòe và sáng lên; ở điểm cắt hình đang phóng to và nhòe nhất, cảnh mới bắt đầu từ trạng thái phóng to rồi "bung" về cỡ thường. Tạo cú **va chạm, tăng tốc**, hợp nhịp nhạc mạnh hoặc cú chuyển bất ngờ.

## 2. Khi nên dùng
- Video quảng bá, trailer, highlight; nhạc có nhịp mạnh rơi đúng điểm cắt.
- Chuyển từ cảnh nhỏ/toàn sang cảnh khác với "cú nhảy vào" (ví dụ từ tiêu đề sang nội dung).
- Nhấn một khoảnh khắc "ồ" hoặc đổi nhịp rõ rệt.
- **Style documentary: bị cấm** (`zoom_transition` nằm trong danh sách cấm `styles/documentary.md`; preset `zoom_in_punch` có `forbidden_styles: ["documentary"]`).

## 3. Khi không nên dùng
- Documentary, phỏng vấn, nội dung trang trọng hoặc cảm xúc.
- Giữa câu thoại hoặc đoạn có người nói (phóng và nhòe làm mất mặt người nói).
- Footage độ phân giải thấp hoặc đã nhòe (phóng ×2.4 làm vỡ hạt dù đã nhòe).
- Chuyển cảnh liên tục nhiều lần (nhịp mệt mắt).
- Không đủ độ dài mỗi clip (mục 5).
- Priority: Decoration, loại đầu tiên khi vượt ngân sách.

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `duration` (tổng vùng) | 0.5 | 0.3–0.8 (renderer chấp nhận 0.15–3.0) | giây | low |
| `easing` | `ease_in_out` | enum chung | – | low |
| `zoom` (mức phóng cực đại) | 2.4 | 1.5–3.0 | bội số kích thước | low |
| `blur` | 30 | 10–50 | px ở khung cao 1080 | low |

**Cách renderer làm** (`style: zoom`, `overlap: false`): vùng chia đôi tại điểm cắt. Nửa đầu chỉ có A: phóng từ 1 lên `zoom` (tăng tốc cuối), nhòe tăng đến `blur`, độ sáng tăng đến khoảng 140%. Nửa sau chỉ có B: bắt đầu ở `zoom`, nhòe `blur` và sáng 140%, giảm dần về 1, nhòe 0, sáng 100% (giảm tốc cuối). Hai nửa khớp nhau ở điểm cắt (cùng độ phóng, nhòe, sáng) nên chỗ cắt bị che. Phóng điểm trung tâm của khung (không chọn được tâm). **`easing` trong preset không được `zoom` dùng**: mã dùng cứng đường cong tăng tốc cho A, giảm tốc cho B.

## 5. Quy trình thực hiện
1. Xác nhận style không phải documentary, có lý do (nhịp nhạc, đổi nhịp, tiêu đề sang nội dung).
2. **Không cần tay cầm**: kiểu tuần tự; điểm cắt nằm giữa vùng, mỗi bên có hiệu ứng riêng ngay trong thân clip. Mỗi clip phải dài **≥ `duration/2`** (0.5 s thì ≥ 0.25 s). Thiếu thì renderer rút `duration` theo clip ngắn nhất và cảnh báo.
3. Hiệu ứng ăn vào nửa cuối A và nửa đầu B; hành động then chốt đừng ở đó.
4. Căn điểm cắt theo nhịp nhạc (nếu có): đỉnh phóng/nhòe rơi đúng beat.
5. Chọn preset `zoom_in_punch`; giảm `zoom` và `blur` nếu footage nhiều chi tiết nhỏ.
6. **Âm thanh:** chỉ tác động hình. Tiếng "vút" hoặc nối tiếng cần `whoosh_synced_cut` hoặc `j_l_cut` riêng.

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `zoom_in_punch` | 0.5 s, `zoom` 2.4, `blur` 30 |

## 7. Quy tắc quyết định
- `R-ZOOMT-1`: KHÔNG dùng ở style documentary.
- `R-ZOOMT-2`: chỉ dùng khi có nhịp mạnh hoặc cú đổi nhịp có chủ đích; ghi `reason`.
- `R-ZOOMT-3`: không dùng khi có người nói liên tục ở A hoặc B.
- `R-ZOOMT-4`: cả hai clip ≥ `duration/2`.
- `R-ZOOMT-5`: không quá 1–2 lần mỗi video; cách chuyển cảnh đặc biệt khác ≥ 3 giây.
- `R-ZOOMT-6`: đừng chồng `punch_in` hoặc `slow_push` trên cùng clip ngay sát điểm cắt (hai chuyển động zoom chồng nhau).

## 8. Ví dụ
Trailer sự kiện (style `social`): từ cảnh tiêu đề (c01) bung vào cảnh đám đông (c02) đúng nhịp trống.

```json
{
  "id": "d01",
  "technique": "zoom_transition",
  "preset": "zoom_in_punch",
  "anchor": { "between": ["c01", "c02"] },
  "duration": 0.5,
  "parameters": { "duration": 0.5, "zoom": 2.4, "blur": 30 },
  "reason": "Đỉnh phóng khớp nhịp trống đầu, bung vào cảnh đám đông để mở đầu trailer",
  "priority": "style",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Dùng ở documentary | Validator báo lỗi style | `R-ZOOMT-1` |
| Vỡ hạt khi phóng lớn | Cảnh bị bệt hoặc răng cưa trước khi nhòe | Giảm `zoom`; dùng footage nét |
| Phóng giữa câu thoại | Mặt người nói bị nhòe, mất ý | `R-ZOOMT-3` |
| Tin `easing` đổi được | Đổi mà hiệu ứng không đổi | Chỉnh `duration`, `zoom`, `blur` |
| Quá dày | Mệt mắt | `R-ZOOMT-5` |

## 10. Kiểm tra sau render
- Hai nửa khớp nhau ở điểm cắt (không nhảy độ phóng, nhòe hay sáng).
- Đỉnh phóng nằm đúng beat (nếu theo nhạc).
- Độ sáng 140% không cháy chi tiết quan trọng.
- Không có cảnh báo "clip quá ngắn".
- Tiếng ở điểm nối: không "tạch"; thêm âm thanh nếu cần.
