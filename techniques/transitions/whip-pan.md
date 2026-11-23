---
id: whip_pan
name: Whip Pan (Quay ngang nhanh)
group: transitions
roles: [energy, transition_in_motion, location_change]
status: usable
source_of_values: convention
---

# Whip Pan

## 1. Mục đích
Cảnh cũ bay ngang khỏi khung kèm nhòe, cảnh mới bay vào từ phía đối diện rồi dừng, giả cảm giác camera quay ngang rất nhanh. Cắt **giữa chuyển động**, tạo năng lượng và nhịp nhanh khi đổi địa điểm hoặc đổi người.

## 2. Khi nên dùng
- Video năng lượng cao (quảng bá, recap sôi động, highlight hoạt động), nhịp nhanh.
- Hai cảnh liền nhau về ý nghĩa "chỗ này sang chỗ kia" và cảnh đầu có sẵn chuyển động ngang cùng hướng (người đi, camera đang pan).
- Chuyển nhanh giữa các hoạt động song song trong cùng sự kiện, nhạc có nhịp rõ.
- **Style documentary: bị cấm** (`whip_pan` nằm trong danh sách cấm của `styles/documentary.md`; cả hai preset có `forbidden_styles: ["documentary"]`, validator báo lỗi nếu dùng).

## 3. Khi không nên dùng
- Style documentary, phỏng vấn, nội dung trang trọng hoặc cảm xúc.
- Giữa các câu thoại, trong đoạn có người nói liên tục (làm hỏng nhịp nghe/nhìn).
- Hai cảnh có hướng chuyển động ngược với hướng whip (người đang đi sang phải mà whip sang trái làm "giật ngược").
- Dùng nhiều hơn 1–2 lần trong cùng đoạn: nhanh quá thành mệt mắt.
- Khung có vật thể bám cạnh/chữ lớn (chữ bị nhòe và văng ra ngoài khung).
- Priority: Decoration; luôn bị loại đầu tiên khi vượt ngân sách.

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `duration` (tổng vùng) | 0.35 | 0.25–0.6 (renderer chấp nhận 0.15–3.0) | giây | low |
| `easing` | `ease_in_out` | enum chung | – | low |
| `direction` | `left` (`whip_pan_fast`), `right` (`whip_pan_right`) | `left`, `right` | – | low |
| `blur` | 40 | 20–60 | px ở khung cao 1080 | low |
| `travel` | 1.15 | 1.0–1.5 | bội số chiều rộng khung | low |

Trục `x` do renderer cố định (`fixed: axis x`). **`easing` trong preset thực tế không được `whip` dùng**: mã dùng cứng đường cong tăng tốc (ease in) cho A và giảm tốc (ease out) cho B (xem mục 9, "điểm lệch").

**Cách renderer làm** (`style: whip`, `overlap: false`): vùng chuyển chia đôi tại điểm cắt. Nửa đầu chỉ có A: A trượt khỏi khung theo `direction` (tăng tốc), nhòe tăng; ở cuối nửa đầu A đã nằm ngoài khung (`travel` > 1 để chắc chắn ra hẳn). Nửa sau chỉ có B: B từ ngoài khung phía đối diện trượt vào (giảm tốc), nhòe giảm về 0. `direction: left` nghĩa là nội dung bay sang trái (B đi vào từ bên phải). Nhòe là bộ lọc Gaussian đều mọi hướng, **không phải** nhòe chuyển động theo hướng. Quanh điểm cắt có thể có một khoảng rất ngắn (thường dưới một frame ở 30 fps) hiện nền đen vì cả hai hình đều ngoài khung.

## 5. Quy trình thực hiện
1. Xác nhận phong cách cho phép (không phải documentary) và có lý do kể chuyện (đổi địa điểm, nhịp nhanh).
2. **Không cần tay cầm**: kiểu tuần tự; điểm cắt nằm giữa vùng, mỗi bên có hiệu ứng riêng ngay trong thân clip của mình. Vì thế A và B mỗi clip phải dài **≥ `duration/2`** (0.35 s thì mỗi clip ≥ khoảng 0.18 s). Thiếu thì renderer rút `duration` và cảnh báo.
3. Hiệu ứng dùng chính hình trong thân clip: nửa cuối A bị trượt, nửa đầu B bị trượt vào. Hành động quan trọng đừng đặt ở đó.
4. Chọn `direction` khớp với chuyển động trong footage (người đi sang trái thì whip `left`).
5. Chọn preset `whip_pan_fast` hoặc `whip_pan_right`.
6. **Âm thanh:** chỉ tác động hình. Muốn nối tiếng mượt hoặc tạo cảm giác "vèo", dùng `j_l_cut` hoặc `whoosh_synced_cut` ở cùng điểm nối (ngoài phạm vi tài liệu này).

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `whip_pan_fast` | 0.35 s, hướng trái, `blur` 40, `travel` 1.15 |
| `whip_pan_right` | 0.35 s, hướng phải |

Cần dọc (hất lên/xuống): xem `whip_tilt`.

## 7. Quy tắc quyết định
- `R-WHIP-1`: KHÔNG dùng ở style documentary (cấm trong style và preset).
- `R-WHIP-2`: chỉ dùng khi nhịp nhanh và có lý do kể chuyện (đổi địa điểm/đổi hoạt động); ghi `reason`.
- `R-WHIP-3`: `direction` khớp hướng chuyển động chính của footage; không ngược chiều.
- `R-WHIP-4`: không dùng trong lúc có người nói liên tục; không quá 1–2 lần mỗi đoạn.
- `R-WHIP-5`: cả hai clip dài ≥ `duration/2`.
- `R-WHIP-6`: cách chuyển cảnh đặc biệt khác ≥ 3 giây và nằm trong `budget.special_transition`.

## 8. Ví dụ
Video quảng bá sự kiện (style `social`, không phải documentary): từ cảnh học viên đi vào phòng (c05, người đi sang trái) sang cảnh nhóm làm việc ở phòng khác (c06).

```json
{
  "id": "d08",
  "technique": "whip_pan",
  "preset": "whip_pan_fast",
  "anchor": { "between": ["c05", "c06"] },
  "duration": 0.35,
  "parameters": { "duration": 0.35, "direction": "left" },
  "reason": "Đổi sang hoạt động khác, nhịp nhanh; hướng trái khớp chuyển động người đi",
  "priority": "style",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Dùng ở documentary | Validator báo "preset bị cấm ở style documentary" | `R-WHIP-1` |
| Hướng ngược chuyển động | Người đi ngược chiều khi vào/ra khung | `R-WHIP-3` |
| Quá nhiều lần | Mệt mắt, nhịp loạn | `R-WHIP-4`, ngân sách |
| Clip quá ngắn | Cảnh báo khi render | `R-WHIP-5` |
| Kỳ vọng nhòe chuyển động thật | Nhòe đều hai chiều, không vệt ngang | Biết giới hạn, có thể giảm `blur` hoặc chọn kỹ thuật khác |
| Điểm lệch preset - mã | Đổi `easing` mà không đổi hiệu ứng | Chỉ chỉnh `duration`, `blur`, `travel` |

## 10. Kiểm tra sau render
- Cảnh cũ ra hẳn khung và cảnh mới vào đúng điểm cắt; không thấy hai hình chồng nhau.
- Không có frame đen kéo dài ở giữa (một frame đen thoáng qua là chấp nhận được; hơn thế thì giảm `travel` hoặc rút `duration`).
- Nhòe vừa đủ, không phá nhận dạng chủ thể sau khi vào khung.
- Hướng khớp chuyển động; không giật ngược.
- Tiếng ở điểm nối không "tạch".
