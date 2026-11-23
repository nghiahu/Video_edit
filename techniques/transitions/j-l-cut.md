---
id: j_l_cut
name: J-cut / L-cut
group: transitions
roles: [continuity, rhythm, flow]
status: usable
source_of_values: convention
---

# J-cut / L-cut

## 1. Mục đích
Tách hình và tiếng ở điểm nối để cú chuyển mượt hơn, như cách người ta nghe và nhìn tự nhiên.
- **J-cut:** tiếng của clip sau **vào trước** khi hình chuyển sang (nghe rồi mới thấy).
- **L-cut:** tiếng của clip trước **kéo dài** sang hình của clip sau (thấy người khác trong khi vẫn nghe người nói trước).

## 2. Khi nên dùng
- Đổi người nói trong hội thoại hoặc phỏng vấn: L-cut cho thấy phản ứng của người nghe.
- Chèn b-roll lên lời đang nói: L-cut (giữ tiếng người nói, hình chuyển sang b-roll minh họa).
- Dẫn vào cảnh mới bằng tiếng của cảnh đó (J-cut): ví dụ tiếng đám đông, tiếng nói của MC vang lên trước khi thấy MC.
- Hai clip có tiếng nền khác nhau: tiếng nối làm mượt chỗ lệch (`core/audio-principles.md`).
- Style documentary, phỏng vấn, kể chuyện.

## 3. Khi không nên dùng
- Khi tiếng của hai clip nghe rõ lẫn nhau và gây rối (hai người nói chồng).
- Clip b-roll có tiếng gốc bẩn mà bạn muốn mute: không thể kéo tiếng gốc sang (`R-AUD-2`).
- Điểm nối cần "đập" mạnh có chủ đích (smash cut).
- Không còn đủ "đuôi" tiếng hoặc "đầu" tiếng ở nguồn để kéo (cắt sát chữ sẽ bị cụt).

## 4. Thông số
| Tham số | Mặc định | Khoảng | Đơn vị | Confidence |
|---|---|---|---|---|
| `variant` | `l` | `j`, `l` | – | high |
| `lead` (J: tiếng vào trước hình) | 0.5 | 0.3–1.0 | giây | medium |
| `tail` (L: tiếng kéo dài sang hình sau) | 0.8 | 0.4–1.5 (kéo ngắn); hoặc bằng đúng độ dài b-roll (≤ 4 s) khi b-roll **che cả đoạn lời** | giây | medium |
| `audio_crossfade` | 0.12 | 0.08–0.25 | giây | medium |
| `incoming_audio_gain_db` | 0 | −6–0 | dB | low |

## 5. Quy trình thực hiện
1. Xác định điểm nối `between: [cA, cB]` đã có (thường đã là `hard_cut`; `j_l_cut` bổ sung phần âm thanh, không thay hình).
2. Chọn biến thể:
   - Chèn b-roll lên lời người nói: **L** (tiếng clip trước kéo qua).
   - Dẫn vào người nói mới: **J** (tiếng clip sau vào trước).
3. Kiểm tra nguồn có đủ "đuôi" (L) hoặc "đầu" (J) hay không: tiếng ở khoảng đó phải sạch (không chạm vào câu khác, không có tiếng lạ).
4. Đặt `lead`/`tail`; đặt `audio_crossfade` ngắn để chỗ nối không "tạch".
5. Kiểm tra b-roll che được phần hình của clip sau mà không cắt mất thông tin cần thấy (chữ trên hình, người đang chỉ vào).

**Kiểu "che cả đoạn lời" (cutaway):** đặt `tail` = độ dài b-roll, và clip nói tiếp theo bắt đầu ở `source_in = source_out của clip trước + tail` (cùng nguồn). Lời liền mạch suốt b-roll, không có khoảng câm; renderer thấy các mốc này khớp nhau thì không mờ đuôi tiếng ở đường nối. Xem `techniques/storytelling/b-roll-insert.md`.

## 6. Biến thể và preset
| Preset | Biến thể | Mặc định |
|---|---|---|
| `l_cut_standard` | L | `tail` 0.8 s |
| `j_cut_standard` | J | `lead` 0.5 s |

## 7. Quy tắc quyết định
- `R-CUT-2` (đổi người nói hoặc chèn b-roll lên lời → cân nhắc).
- NẾU clip nối có tiếng nền khác nhau rõ → ưu tiên có `j_l_cut` hoặc ambience nối.
- NẾU `lead/tail` kéo chạm vào quãng nói của câu khác → rút ngắn đến sát quãng lặng hoặc bỏ.
- Không quá một `j_l_cut` mỗi 3 giây.

## 8. Ví dụ
MC nói đoạn dài; b-roll học viên ngồi học chèn lên khi MC nhắc "các bạn học viên", nhưng tiếng MC giữ nguyên.

```json
{
  "id": "d05",
  "technique": "j_l_cut",
  "preset": "l_cut_standard",
  "anchor": { "between": ["c03", "c04"] },
  "duration": 0.8,
  "parameters": { "variant": "l", "tail": 0.8, "audio_crossfade": 0.12 },
  "reason": "Giữ lời MC trong lúc chuyển sang b-roll học viên, tránh cú cắt cụt lời",
  "priority": "clarity",
  "confidence": "medium",
  "reference": null,
  "status": "proposed"
}
```

## 9. Lỗi thường gặp
| Lỗi | Nhận biết | Cách tránh |
|---|---|---|
| Kéo tiếng chạm sang câu khác | Nghe lẫn hai câu | Giới hạn `tail`/`lead` trong quãng lặng |
| Tiếng nối "tạch" | Có click hoặc nhảy mức | `audio_crossfade` ≥ 0.08 s |
| Lệch miệng/tiếng | Hình người nói đang mở miệng nhưng tiếng ở clip khác | Chỉ dùng khi hình không thấy miệng người nói (b-roll) |
| Dùng J/L ở mọi điểm nối | Video nghe như một dòng chảy không dứt | Chỉ ở chỗ thật sự cần |

## 10. Kiểm tra sau render
- Nghe điểm nối: tiếng liên tục, không click, không lẫn hai câu.
- Hình b-roll che đúng khoảng; khi quay lại người nói, tiếng và hình khớp.
- Mức tiếng trước/sau điểm nối không chênh đột ngột.
