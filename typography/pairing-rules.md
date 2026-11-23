# Quy tắc phối font

Tối đa **hai** họ font trong một video (một cho tiêu đề/nhấn, một cho thân/phụ đề). Phối theo **tương phản có chủ đích**, không phải theo "hai font đẹp".

## Nguyên tắc
1. Một font **cá tính** (tiêu đề) + một font **trung tính** (thân, phụ đề).
2. Hai font phải khác rõ ràng (serif ↔ sans, hoặc đậm-hẹp ↔ thanh-rộng), không phải hai sans na ná nhau.
3. Phụ đề luôn dùng font trung tính, **dễ đọc là trên hết**.
4. Cả hai font phải có subset tiếng Việt.

## Cặp gợi ý (đều có glyph tiếng Việt nếu font gốc có)
| Tiêu đề / nhấn | Thân / phụ đề | Cảm giác | Dùng cho |
|---|---|---|---|
| **Inter 700–800** | **Inter 400–500** | Hiện đại, sạch, đúng thương hiệu | **Mặc định cho mọi style (một họ font, phân cấp bằng weight và cỡ)** |
| Playfair Display | Be Vietnam Pro | Editorial, trang trọng | Chỉ khi người dùng yêu cầu chất serif |
| Playfair Display | Inter | Editorial, sạch | Documentary quốc tế |
| Lora | Be Vietnam Pro | Ấm, gần gũi | Phỏng vấn, câu chuyện cá nhân |
| Montserrat | Inter | Hiện đại, rõ ràng | Corporate, sự kiện giáo dục |
| Space Grotesk | IBM Plex Mono | Công nghệ, dữ liệu | Tech, phân tích dữ liệu |
| Anton | Inter | Mạnh, đập | Short-form năng lượng cao |

## Không phối
- Hai serif khác nhau.
- Hai font display/condensed.
- Font viết tay hoặc trang trí với font có cá tính mạnh.
- Font không có subset tiếng Việt ở bất kỳ vai trò nào.

## Quy tắc chọn theo ngữ cảnh (có thể kiểm tra)
- Mặc định mọi style: một họ **Inter**; phân cấp bằng weight (700–800 nhấn, 500 thân) và cỡ, không cần phối họ thứ hai.
- `style = documentary` với yêu cầu serif của người dùng → tiêu đề: serif editorial (`Playfair Display`/`Lora`); thân: sans trung tính (`Be Vietnam Pro`/`Inter`).
- `style = tech` → sans hình học + monospace.
- `style = short_form_high_energy` → display đậm/condensed + sans trung tính.
- `text_role = emphasis` → font tiêu đề, weight 600–800.
- `text_role = subtitle` → font trung tính; **ưu tiên khả năng đọc hơn phong cách**.
- Mâu thuẫn giữa phong cách và khả năng đọc → khả năng đọc thắng (Clarity > Style).

## Chọn phông theo ý đồ (các nhóm trong bảng chọn phông)
Mặc định vẫn là Inter. Khi một style cần cá tính riêng, chọn theo nhóm dưới đây (vai trò và độ đậm xem `typography/font-registry.json`). Nguyên tắc: **một họ cá tính cho tiêu đề/chữ nhấn + một họ trung tính cho phụ đề và thân bài** (tối đa hai họ).

| Cảm giác của style | Nhóm cho tiêu đề/chữ nhấn | Gợi ý | Phụ đề và thân bài (trung tính) |
|---|---|---|---|
| Trang trọng, tài liệu | sang | Playfair Display | Be Vietnam Pro hoặc Inter |
| Sạch, hiện đại, thương hiệu | gọn gàng | Inter, Be Vietnam Pro, Lexend | cùng họ |
| Vui, dễ thương, trẻ em, vlog nhẹ | dễ thương | Baloo 2, Grandstander, Mali, Nunito, Quicksand | Nunito hoặc Quicksand (≥ 500) |
| Thân mật, nhật ký, ghi chú | viết tay | Playpen Sans, Patrick Hand, Pangolin, Itim, Fuzzy Bubbles | Nunito hoặc Be Vietnam Pro |
| Mềm, nhẹ nhàng, ứng dụng, wellness | tròn mềm | Comfortaa | Nunito hoặc Quicksand |
| Lãng mạn, lời chúc, ẩm thực, du lịch | bay bổng | Pacifico, Lobster, Dancing Script, Charm | Be Vietnam Pro hoặc Nunito |
| Năng lượng cao, thể thao, short-form | mạnh | Anton, Bungee | Inter hoặc Lexend |
| Công nghệ, dữ liệu, game | công nghệ | Chakra Petch | Inter hoặc Lexend |

Quy tắc kiểm tra được: `validate` chặn phông không có vai trò `subtitle` ở phụ đề và phông không có vai trò chữ nhấn (`emphasis` hoặc `accent`) ở `kinetic_text`; cảnh báo khi cỡ chữ nhỏ hơn `min_size_px_1080p` của phông. Chữ bay bổng và viết tay: tối đa 3–4 từ mỗi lần, cỡ lớn, tuyệt đối không dùng cho câu dài.
