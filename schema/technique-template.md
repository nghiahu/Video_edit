# Khuôn tài liệu kỹ thuật

Mọi file trong `techniques/` đều theo đúng khuôn này. Mục tiêu: sau khi đọc, AI trả lời được 4 câu: **khi nào dùng, dùng thế nào, thông số bao nhiêu, ở ngữ cảnh này có nên dùng không.**

````markdown
---
id: <technique_id>            # snake_case, trùng techniques/index.md
name: <Tên hiển thị>
group: <camera-motion | typography | transitions | motion-graphics | color | sound | compositing | storytelling>
roles: [emphasis, rhythm, ...]  # vai trò editing
status: <draft | usable | verified>
source_of_values: convention  # hoặc observed:<REF_id>
---

# <Tên>

## 1. Mục đích
Một đến hai câu: kỹ thuật này làm người xem cảm thấy hoặc hiểu điều gì.

## 2. Khi nên dùng
Điều kiện cụ thể, quan sát được từ footage hoặc lời thoại.

## 3. Khi không nên dùng
Điều kiện loại trừ. Phần này quan trọng ngang phần 2.

## 4. Thông số
Bảng: tham số | giá trị mặc định | khoảng cho phép | đơn vị. Mỗi dòng ghi `confidence`.

## 5. Quy trình thực hiện
Các bước theo thứ tự cho AI lập quyết định và cho renderer áp dụng.

## 6. Biến thể và preset
Mỗi biến thể trỏ tới `preset` ID trong `presets/*.json`.

## 7. Quy tắc quyết định
Điều kiện máy kiểm tra được: `NẾU ... THÌ cân nhắc / tránh ...`, kèm lớp ưu tiên.

## 8. Ví dụ
Tình huống thật (ưu tiên lấy từ footage của dự án), kèm đoạn EDL tương ứng.

## 9. Lỗi thường gặp (anti-patterns)
Danh sách cụ thể, mỗi dòng có cách nhận biết.

## 10. Kiểm tra sau render
Những gì phải nhìn hoặc đo ở bản preview.
````

## Quy tắc viết
- Không viết kiểu định nghĩa chung chung ("Zoom In: phóng to video"). Phải có điều kiện dùng, điều kiện cấm và con số.
- Con số đánh dấu `confidence`: `high` (đã kiểm chứng trên video thật), `medium` (quy ước ngành phổ biến), `low` (ước lượng, cần thử).
- Mỗi kỹ thuật có ít nhất một ví dụ EDL chạy được theo `schema/edl.md`.
