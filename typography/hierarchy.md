# Phân cấp thông tin trên chữ

Trên màn hình, người xem chỉ đọc được một ý tại một thời điểm. Phân cấp nói cho họ biết đọc cái gì trước.

## Ba cấp
| Cấp | Vai trò | Ví dụ | Nhận biết |
|---|---|---|---|
| 1 — Nhấn | Điều quan trọng nhất ngay lúc này | "Khóa đầu tiên" | To nhất, đậm nhất, một chỗ duy nhất trong khung |
| 2 — Thông tin | Hỗ trợ, thêm bối cảnh | Tên + chức danh người nói | Nhỏ hơn cấp 1, một hoặc hai dòng |
| 3 — Nền | Phụ đề, chú thích | Câu nói đầy đủ | Nhỏ nhất, ổn định, không gây chú ý |

## Quy tắc
- **Một cấp 1 mỗi khung.** Không hai chữ nhấn cùng lúc.
- Cấp 1 và cấp 3 không xuất hiện cùng lúc trừ khi cấp 3 là phụ đề bắt buộc; khi đó cấp 1 đặt vùng khác và không che phụ đề.
- Chênh lệch cỡ giữa các cấp ≥ 1.4× (ví dụ 84 px → 48 px → 40 px không đủ tách; 84 → 48 → 34 thì được).
- Mỗi cấp khác nhau ít nhất hai trong ba yếu tố: cỡ, weight, màu/độ mờ.
- **Lề:** ≥ 5% mỗi bên; cấp 1 giữa-thấp; lower third bên trái, cách đáy ~12–15% chiều cao.
- **Thời gian:** cấp 1 hiện đủ `hold` theo công thức `kinetic-text.md`; cấp 2 (lower third) hiện 3–5 giây; cấp 3 theo lời nói.

## Khi mâu thuẫn
- Chữ quan trọng nhưng không đọc kịp → rút ngắn chữ, đừng rút `hold`.
- Chữ che mặt → dời chữ, đừng dời mặt (không thể), đừng bỏ qua.
- Hai thông tin cạnh tranh → giữ cái quan trọng hơn theo nội dung; cái còn lại để lời nói hoặc bỏ.
