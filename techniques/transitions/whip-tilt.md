---
id: whip_tilt
name: Whip Tilt (Hất camera lên/xuống)
group: transitions
roles: [energy, transition_in_motion, reveal]
status: usable
source_of_values: convention
---

# Whip Tilt

## 1. Mục đích
Giống `whip_pan` nhưng theo **trục dọc**: cảnh cũ bay lên (hoặc xuống) khỏi khung kèm nhòe, cảnh mới bay vào từ phía đối diện. Hợp khi ý chuyển là "nhìn lên", "lên cao", "xuống mặt đất" hoặc đổi từ chi tiết sang toàn cảnh theo chiều dọc.

## 2. Khi nên dùng
- Video năng lượng cao khi cảnh đầu kết bằng hướng nhìn lên (người ngước lên, vật bay lên, camera đang tilt) và cảnh sau là bầu trời, tòa nhà, flycam.
- Chuyển từ cảnh mặt đất sang góc nhìn cao (flycam), hoặc ngược lại.
- Nhịp nhanh, chuyển giữa các hoạt động, nhạc có nhịp rõ.
- **Style documentary: bị cấm** (`whip_tilt_up` có `forbidden_styles: ["documentary"]`; `whip_tilt` không nằm trong danh sách cho phép ở documentary).

## 3. Khi không nên dùng
- Style documentary, phỏng vấn, nội dung trang trọng hoặc cảm xúc.
- Trong đoạn có người nói liên tục.
- Hai cảnh không có quan hệ chiều dọc nào (không có lý do hướng lên/xuống; dùng `whip_pan` hoặc `hard_cut`).
- Khung có chữ lớn hoặc thanh tiêu đề cạnh trên/dưới: chữ bị kéo ra khỏi khung theo hướng tilt.
- Dùng nhiều lần liên tiếp hoặc ngay sau `whip_pan` (cách < 3 giây).
- Priority: Decoration.

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `duration` (tổng vùng) | 0.4 | 0.25–0.7 (renderer chấp nhận 0.15–3.0) | giây | low |
| `easing` | `ease_in_out` | enum chung | – | low |
| `direction` | `up` | `up`, `down` | – | low |
| `blur` | 40 | 20–60 | px ở khung cao 1080 | low |
| `travel` | 1.15 | 1.0–1.5 | bội số chiều cao khung | low |

Trục `y` do renderer cố định (`fixed: axis y`). Nếu đặt `direction` là `left`/`right` thì thành phần dọc bằng 0 và mã dùng dự phòng "lên": chỉ dùng `up` hoặc `down`. **`easing` không được `whip` dùng** (như `whip_pan`: A tăng tốc, B giảm tốc cố định).

**Cách renderer làm** (`style: whip`, `overlap: false`): giống `whip_pan` nhưng theo trục dọc. Nửa đầu A bay khỏi khung theo `direction` (`up`: bay lên), nhòe tăng; nửa sau B đi vào từ phía đối diện (với `up`, B đi vào từ dưới lên) và nhòe giảm. Nhòe là Gaussian đều, không theo hướng.

## 5. Quy trình thực hiện
1. Xác nhận style không phải documentary và có lý do chiều dọc (nhìn lên, flycam, lên cao/xuống thấp).
2. **Không cần tay cầm**: điểm cắt nằm giữa vùng, mỗi bên có hiệu ứng riêng ngay trong thân clip. Cả hai clip cần dài **≥ `duration/2`** (0.4 s thì mỗi clip ≥ 0.2 s); thiếu thì renderer rút `duration` và cảnh báo.
3. Hiệu ứng ăn vào nửa cuối A và nửa đầu B; không đặt hành động then chốt ở đó.
4. Chọn `direction` khớp: kết thúc A bằng cảnh hướng lên thì dùng `up`.
5. Chọn preset `whip_tilt_up`; đổi `direction: down` bằng `parameters` khi cần.
6. **Âm thanh:** chỉ tác động hình; thêm `j_l_cut` hoặc `whoosh_synced_cut` nếu cần nối tiếng.

## 6. Biến thể và preset
| Preset | Mô tả |
|---|---|
| `whip_tilt_up` | 0.4 s, hất lên, `blur` 40, `travel` 1.15 |

Có thể chuyển hướng xuống bằng `parameters: { "direction": "down" }` (khóa có trong preset nên hợp lệ).

## 7. Quy tắc quyết định
- `R-TILT-1`: KHÔNG dùng ở style documentary.
- `R-TILT-2`: chỉ dùng khi ý chuyển có chiều dọc hoặc nhịp nhanh; ghi `reason`.
- `R-TILT-3`: `direction` khớp hướng nhìn/chuyển động của footage (nhìn lên thì `up`).
- `R-TILT-4`: không dùng khi có người nói liên tục; không sát `whip_pan` (< 3 giây).
- `R-TILT-5`: cả hai clip dài ≥ `duration/2`.
- `R-TILT-6`: trong ngân sách `special_transition`.

## 8. Ví dụ
Video quảng bá (không phải documentary): người tham dự ngước nhìn khinh khí cầu (c09), chuyển sang cảnh flycam nhìn từ trên cao (c10).

```json
{
  "id": "d09",
  "technique": "whip_tilt",
  "preset": "whip_tilt_up",
  "anchor": { "between": ["c09", "c10"] },
  "duration": 0.4,
  "parameters": { "duration": 0.4, "direction": "up" },
  "reason": "Cảnh trước kết bằng ánh nhìn lên; hất lên dẫn sang cảnh flycam, tăng năng lượng",
  "priority": "style",
  "confidence": "low",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Dùng ở documentary | Validator báo "bị cấm ở style documentary" | `R-TILT-1` |
| Hướng ngược ý | Nhìn lên mà hình đi xuống | `R-TILT-3` |
| Đặt `direction` ngang | Vẫn hất lên (dự phòng) | Chỉ dùng `up`/`down` |
| Chữ bị kéo ra khỏi khung | Tiêu đề trượt theo hình | Dời chữ khỏi vùng chuyển |
| Clip quá ngắn | Cảnh báo khi render | `R-TILT-5` |

## 10. Kiểm tra sau render
- Cảnh cũ ra hẳn khung theo chiều dọc, cảnh mới vào đúng điểm cắt; không thấy hai hình chồng nhau.
- Không có khoảng đen kéo dài ở giữa.
- Hướng khớp ý (không "ngược").
- Nhòe vừa đủ, hình mới nét lại hoàn toàn ở cuối vùng.
- Tiếng ở điểm nối không "tạch".
