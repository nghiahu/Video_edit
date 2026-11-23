# Dự án mẫu: Tổng kết sự kiện, phong cách documentary

> **Đây là kế hoạch mẫu giả định**, viết để dạy AI cách suy nghĩ từ đầu vào đến quyết định. Không phải kết quả của một video thật đã dựng. Dùng làm khuôn lập luận, đừng coi là số liệu đã kiểm chứng.

## Đầu vào
- Footage: clip DJI trong `Video-analysis` (lễ khai giảng khóa Phân tích Dữ liệu): b-roll lớp học, MC mở đầu, diễn giả phát biểu.
- Yêu cầu: video tổng kết ~2 phút, trang trọng, không lạm dụng hiệu ứng.

## Mục tiêu edit
Một câu: "Cho người chưa dự thấy được không khí trang trọng và giá trị của chương trình đào tạo."

## Quyết định chiến lược (pha 2)
| Trục | Chọn | Vì sao |
|---|---|---|
| style | documentary | Sự kiện học thuật, cần trang trọng |
| pacing | moderate | Có lời phát biểu cần thời gian nghe, xen b-roll |
| visual_intensity | low | Nội dung mạnh, hiệu ứng chỉ làm rối |
| budget | punch_in 4, kinetic_text 3 | ~2 phút, theo `styles/documentary.md` |

## Chuỗi quyết định biên tập
1. **Mở bằng b-roll dolly lớp học** (b-roll, mute tiếng gốc vì có tiếng chuông thông báo — `R-AUD-2`).
2. **Nối sang MC bằng `hard_cut`** (chuyển từ rộng sang trung cảnh, cắt ở quãng lặng).
3. **Ducking nhạc dưới lời MC** (`R-AUD-1`).
4. **Chèn b-roll học viên lên lời MC bằng L-cut** khi MC nhắc đến học viên (giữ lời, đổi hình).
5. **Chữ cho dữ kiện** (tên chương trình đã có trên slide nên không lặp chữ; chỉ chữ cho dữ kiện chưa có hình).
6. **`punch_in_subtle` ở 2–3 câu thông điệp**, không quá một lần mỗi 6 giây.
7. **Kết bằng cảnh rộng**, nhạc nâng nhẹ, dừng ở hơi thở trọn.

## Kỹ thuật dùng và lý do
| Kỹ thuật | Lý do chọn | Lý do không chọn cái khác |
|---|---|---|
| `hard_cut` | Nhịp trang trọng | Chuyển cảnh trang trí làm mất tính documentary |
| `j_l_cut` (L) | Giữ lời MC khi đổi hình | Cắt thẳng sẽ cụt lời và lộ điểm nối |
| `kinetic_text` editorial | Dữ kiện cần đọc được | Phụ đề đầy đủ làm rối khi lời đã rõ |
| `punch_in_subtle` | Nhấn nhẹ câu thông điệp | `standard`/`aggressive` quá "social" |
| `audio_ducking` | Lời luôn rõ | – |

## Timeline mẫu
| Giờ ra | Nội dung | Kỹ thuật |
|---|---|---|
| 0:00–0:06 | Dolly lớp học | – (mute) |
| 0:06–0:16 | MC mở đầu | `hard_cut` vào, `audio_ducking` |
| 0:16–0:22 | B-roll học viên trên lời MC | `l_cut_standard` |
| … | … | … |

## Bài học (để rút kinh nghiệm)
- Khi nội dung trừu tượng không có b-roll, dùng chữ hoặc giữ người nói, **không chèn b-roll không liên quan**.
- Ít nhưng đúng chỗ luôn tốt hơn nhiều nhưng rải đều.
- Footage có chữ sẵn trên hình (slide): đừng lặp chữ, hãy bổ sung điều chưa có trên hình.
