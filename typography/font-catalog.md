# Font Catalog

Mọi font trong catalog là font Google Fonts (tải qua `@remotion/google-fonts` khi xây renderer). **Chữ trong dự án là tiếng Việt**: chỉ dùng font có đủ glyph dấu tiếng Việt. Cột `Việt` ghi theo hiểu biết hiện tại và **phải xác nhận lại khi nạp font vào renderer** (kiểm tra subset `vietnamese`).

## Phông thương hiệu (mặc định cho mọi style)
**Inter** là phông mặc định của dự án: khớp phông giao diện Rikkei Edu mà người dùng chỉ định (nhận diện bằng cách so sánh dòng chữ trong ảnh với sáu phông ứng viên; Inter khớp nhất ở chữ g một tầng, chữ t cắt vát, khoảng cách chữ hẹp — **chưa xác nhận từ mã nguồn của website**, nếu website dùng phông khác thì đổi ở đây). Cách dùng theo giao diện thương hiệu: **tiêu đề đậm 700, tracking hẹp (−0.02em), thân 400–500**. Mọi preset chữ hiện dùng Inter. Phông khác trong bảng dưới chỉ dùng khi người dùng yêu cầu.

Ghi chú đã kiểm tra khi nạp vào renderer: Poppins **không có** subset tiếng Việt nên không dùng được.

## Phông đã nạp sẵn trong renderer (23 phông)
Nguồn dữ liệu máy đọc: `typography/font-registry.json`. Mọi phông đều có subset tiếng Việt (kiểm tra bằng `getInfo()` của `@remotion/google-fonts`) và đã render thử đủ dấu (xem ảnh mẫu `typography/font-samples.png`). Renderer **chỉ nạp phông mà EDL dùng**; `validate` báo lỗi nếu phông chưa đăng ký hoặc không hợp vai trò chữ (ví dụ phụ đề bằng phông viết tay hoặc bay bổng).

Nhóm theo bảng chọn phông của người dùng: gọn gàng, dễ thương, viết tay, tròn mềm, bay bổng, sang, mạnh, công nghệ.

| Phông | Nhóm | Đặc điểm | Hợp với | Tránh | Vai trò dùng được | Độ đậm có sẵn |
|---|---|---|---|---|---|---|
| **Inter** | thương hiệu | Sans trung tính, rất dễ đọc; phông thương hiệu mặc định | mọi vai trò, phụ đề, lower third, tiêu đề | poster cinematic | tiêu đề, chữ nhấn, phụ đề, thân bài | 100–900 (mặc định tiêu đề 700) |
| **Be Vietnam Pro** | gọn gàng | Sans hiện đại thiết kế riêng cho tiếng Việt, dấu rõ | phụ đề, thân bài, tên người, mọi style | – | tiêu đề, chữ nhấn, phụ đề, thân bài | 100–900 (mặc định tiêu đề 700) |
| **Lexend** | gọn gàng | Sans rộng, thiết kế để tăng khả năng đọc | phụ đề, giáo dục, nội dung cần dễ đọc, thân bài | phong cách cổ điển | tiêu đề, chữ nhấn, phụ đề, thân bài | 100–900 (mặc định tiêu đề 600) |
| **Quicksand** | dễ thương | Sans tròn nhẹ, thân thiện, hiện đại | vlog nhẹ nhàng, giáo dục trẻ em, lifestyle, chữ nhấn vừa | nội dung nghiêm trang, chữ nhỏ trên nền rối (nét mảnh, dùng ≥ 500) | tiêu đề, chữ nhấn, phụ đề, thân bài | 300–700 (mặc định tiêu đề 700) |
| **Nunito** | dễ thương | Sans đầu tròn, ấm, rất dễ đọc | thân bài thân thiện, phụ đề thân thiện, giáo dục, ứng dụng | cinematic, documentary trang trọng | tiêu đề, chữ nhấn, phụ đề, thân bài | 200–900 (mặc định tiêu đề 800) |
| **Mali** | dễ thương | Kiểu chữ bút lông tròn, nét đều, dễ thương | vlog, tiêu đề dễ thương, chữ nhấn ngắn | đoạn dài, phụ đề, nội dung nghiêm túc | tiêu đề, chữ nhấn, điểm nhấn ngắn | 200–700 (mặc định tiêu đề 600) |
| **Baloo 2** | dễ thương | Sans tròn đậm, vui, nổi bật | tiêu đề vui, trẻ em, bán lẻ, sticker text | documentary, nội dung trang trọng | tiêu đề, chữ nhấn, phụ đề | 400–800 (mặc định tiêu đề 700) |
| **Grandstander** | dễ thương | Chữ chơi đùa, nét dày, hơi nghiêng ngả | tiêu đề vui, chữ nhấn kiểu sticker, nội dung trẻ em | nội dung nghiêm túc, phụ đề, đoạn dài | tiêu đề, chữ nhấn, điểm nhấn ngắn | 100–900 (mặc định tiêu đề 800) |
| **Playpen Sans** | viết tay | Nét bút viết tay kiểu học trò, thân mật | ghi chú, nhật ký, caption thân mật | đoạn dài, phụ đề, nội dung nghiêm túc | tiêu đề, chữ nhấn, điểm nhấn ngắn | 100–800 (mặc định tiêu đề 600) |
| **Itim** | viết tay | Viết tay tròn, nét vừa, gần gũi | caption thân mật, chú thích, tiêu đề nhẹ | phụ đề, nội dung trang trọng | tiêu đề, chữ nhấn, điểm nhấn ngắn | 400 (mặc định tiêu đề 400) |
| **Pangolin** | viết tay | Viết tay gọn gàng, dễ đọc | ghi chú, bảng/lớp học, chú thích | phụ đề, nội dung trang trọng | tiêu đề, chữ nhấn, điểm nhấn ngắn | 400 (mặc định tiêu đề 400) |
| **Sriracha** | viết tay | Bút lông nghiêng, cá tính, hơi bụi | tiêu đề cá tính, ẩm thực, lifestyle | đoạn dài, phụ đề, nội dung nghiêm túc | tiêu đề, chữ nhấn, điểm nhấn ngắn | 400 (mặc định tiêu đề 400) |
| **Patrick Hand** | viết tay | Viết tay hẹp, sạch, kiểu truyện tranh/doodle | chú thích, giáo dục, doodle, ghi chú | phụ đề, nội dung trang trọng | tiêu đề, chữ nhấn, điểm nhấn ngắn | 400 (mặc định tiêu đề 400) |
| **Fuzzy Bubbles** | viết tay | Viết tay mềm, nét bút chì xù nhẹ | ghi chú, nhật ký, chữ nhấn nhẹ nhàng | phụ đề, cỡ nhỏ | tiêu đề, chữ nhấn, điểm nhấn ngắn | 400, 700 (mặc định tiêu đề 700) |
| **Comfortaa** | tròn mềm | Hình học tròn, mềm, hiện đại, thoáng | công nghệ nhẹ nhàng, ứng dụng, sức khỏe/wellness, tiêu đề | đoạn dài cỡ nhỏ, nội dung nặng nề | tiêu đề, chữ nhấn, điểm nhấn ngắn | 300–700 (mặc định tiêu đề 700) |
| **Pacifico** | bay bổng | Chữ bút lông liền nét, hoài cổ vui tươi | tiêu đề ngắn, thương hiệu vui, du lịch, ẩm thực | câu dài, chữ nhỏ, phụ đề, nội dung nghiêm túc | tiêu đề, điểm nhấn ngắn | 400 (mặc định tiêu đề 400) |
| **Dancing Script** | bay bổng | Chữ thảo bay nhẹ, nét thanh | lời chúc, cưới hỏi, câu trích, tiêu đề lãng mạn | chữ nhỏ, phụ đề, câu dài | tiêu đề, điểm nhấn ngắn | 400, 500, 600, 700 (mặc định tiêu đề 600) |
| **Lobster** | bay bổng | Script đậm hoài cổ, nhận diện mạnh | tiêu đề món ăn, quán cà phê, biển hiệu vui | câu dài, chữ nhỏ, phụ đề, nội dung nghiêm túc | tiêu đề, điểm nhấn ngắn | 400 (mặc định tiêu đề 400) |
| **Charm** | bay bổng | Script thanh lịch kiểu nghệ thuật | tiêu đề nhẹ nhàng, câu trích, lời chúc | chữ nhỏ, phụ đề, câu dài | tiêu đề, điểm nhấn ngắn | 400, 700 (mặc định tiêu đề 700) |
| **Playfair Display** | sang | Serif editorial tương phản cao, sang trọng | documentary (khi cần serif), luxury, tiêu đề chương, câu trích | gaming, công nghệ, chữ nhỏ | tiêu đề, chữ nhấn, điểm nhấn ngắn | 400–900 (mặc định tiêu đề 700) |
| **Anton** | mạnh | Condensed rất đậm, đập mạnh | tiêu đề short-form, thể thao, chữ nhấn ngắn | câu dài, phụ đề, documentary | tiêu đề, chữ nhấn | 400 (mặc định tiêu đề 400) |
| **Bungee** | mạnh | Display khối vuông kiểu biển hiệu đô thị; chỉ có chữ HOA (chữ thường hiển thị thành chữ hoa) | biển tên, gaming, đô thị, chữ nhấn ngắn | câu dài, phụ đề, nội dung trang trọng | tiêu đề, chữ nhấn, điểm nhấn ngắn | 400 (mặc định tiêu đề 400) |
| **Chakra Petch** | công nghệ | Vuông góc kiểu sci-fi, kỹ thuật | công nghệ, game, dữ liệu, tiêu đề kỹ thuật | nội dung truyền thống, cảm xúc dịu | tiêu đề, chữ nhấn, điểm nhấn ngắn | 300–700 (mặc định tiêu đề 700) |

Ghi chú: **Bungee** chỉ có chữ hoa. Phông viết tay, bay bổng và đậm chỉ dành cho **cụm ngắn** (tiêu đề, chữ nhấn, tối đa 6 từ), không dùng cho phụ đề hoặc đoạn dài. Cỡ chữ tối thiểu khuyến nghị cho từng phông nằm ở `min_size_px_1080p` trong registry (`validate` cảnh báo nếu nhỏ hơn). Phông mặc định của dự án vẫn là **Inter**; phông khác chỉ dùng khi style hoặc người dùng chỉ định, bằng cách ghi đè `font_family` và `font_weight` trong `parameters` của quyết định.

Thêm phông mới: kiểm tra `getInfo()` có subset `vietnamese`, thêm vào `font-registry.json` và `renderer/src/fonts.js`.

## Danh sách phông chưa nạp (tham khảo)
Các phông dưới đây chưa có trong renderer; muốn dùng phải đăng ký như mục trên.

| Font | Đặc điểm | Việt | Phù hợp | Không phù hợp |
|---|---|---|---|---|
| **Be Vietnam Pro** | Sans hiện đại, thiết kế cho tiếng Việt | ✔ (đã nạp, xem registry) | Phụ đề, thân bài, tên người, mọi style | – |
| **Inter** (mặc định) | Sans sạch, rất dễ đọc; đậm 700 cho tiêu đề | ✔ (đã nạp và render thử) | Mọi vai trò: nhấn mạnh, phụ đề, lower third, tiêu đề | Poster cinematic |
| **Montserrat** | Sans hình học, hiện đại | ✔ | Tiêu đề social, tên chương trình | Documentary tự nhiên (hơi "quảng cáo") |
| **Playfair Display** | Serif editorial, tương phản cao | ✔ (đã nạp, xem registry) | Documentary, tiêu đề chương, luxury | Gaming, tech UI, cỡ chữ nhỏ |
| **Lora** | Serif êm, dễ đọc | ✔ | Câu trích dẫn, documentary, cỡ vừa | Short-form năng lượng cao |
| **Anton** | Condensed rất đậm, đập mạnh | ✔ (đã nạp, xem registry) | Nhấn mạnh short-form, tiêu đề ngắn | Câu dài, documentary |
| **Oswald** | Condensed vừa, mạnh | ✔ (cần xác nhận) | Tiêu đề thể thao, nhấn mạnh | Đoạn dài |
| **Space Grotesk** | Sans kỹ thuật, cá tính | ✔ (cần xác nhận) | Tech, dữ liệu, tiêu đề công nghệ | Nội dung truyền thống |
| **IBM Plex Mono** | Monospace | ✔ (cần xác nhận) | Dữ liệu, thông số, overlay kỹ thuật | Tiêu đề thông thường |
| **Bebas Neue** | Condensed hoa, mạnh | ✘ (không đủ dấu Việt) | **Tránh** cho chữ tiếng Việt | – |

Font ngoài danh sách chỉ thêm sau khi xác nhận có subset `vietnamese` và ghi vào đây.

## Thông số theo vai trò (độ phân giải 1920×1080; 4K nhân 2)

| Vai trò | Cỡ chữ | Weight | Line-height | Letter-spacing | Hoa/thường | Ghi chú |
|---|---|---|---|---|---|---|
| Chữ nhấn mạnh (kinetic) | 72–96 px | 600–800 | 1.1 | 0 đến +1% | Câu thường (sentence case); hoa chỉ ở condensed | 3–6 từ, tối đa 2 dòng |
| Tiêu đề chương | 80–120 px | 500–700 (serif) | 1.1 | +1% đến +4% | Tuỳ style | Hợp documentary |
| Lower third: tên | 40–48 px | 600–700 | 1.15 | 0 | Viết hoa chữ cái đầu | Dòng 1 |
| Lower third: chức danh | 28–34 px | 400–500 | 1.2 | +1% | Thường | Dòng 2, mờ hơn tên |
| Phụ đề | 44–54 px | 500–600 | 1.25 | 0 | Câu thường | Tối đa 2 dòng, ≤ 42 ký tự/dòng |
| Dữ liệu/số liệu | 56–80 px | 500–700 | 1.1 | 0 | – | Dùng mono hoặc số tabular nếu so sánh |

Cỡ chữ tối thiểu để đọc được trên điện thoại (video dọc 1080×1920): ≥ 56 px cho nhấn mạnh, ≥ 44 px cho phụ đề.

## Màu và nền
- Chữ trắng ngà (`#F5F2EA`) hoặc trắng (`#FFFFFF`) là mặc định trên nền tối/trung tính.
- Từ khóa nhấn: vàng ấm (`#F2C14E`) hoặc màu thương hiệu; **tối đa một màu nhấn** trên video.
- Nền chữ: không nền khi tương phản đủ; hộp mờ tối (`rgba(0,0,0,0.45)`, bo góc 8–12 px, padding 16–24 px) khi nền phức tạp; đổ bóng mềm (blur 12–20 px, opacity 0.35–0.5) là phương án thứ ba.
- Tương phản tối thiểu giữa chữ và nền: 4.5:1 (đo trên vùng đặt chữ).

## Animation phù hợp từng font/style
| Style | Animation | Tránh |
|---|---|---|
| Documentary | `fade`, `fade_up` (dịch lên 12–24 px) | Bounce, elastic, scale mạnh |
| Corporate | `fade`, `slide` ngắn | Glitch |
| Social/short-form | `scale_fade`, pop | Hiệu ứng kéo dài > 0.4 s |

## Font có thể phối hợp
Xem `typography/pairing-rules.md`.
