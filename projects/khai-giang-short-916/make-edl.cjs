// Sinh edl.json cho project khai-giang-short-916 (chạy: node projects/khai-giang-short-916/make-edl.cjs)
const fs = require('fs');
const path = require('path');
const vid = (n) => {
  const m = { '0019': '185317', '0009': '184933', '0014': '185141', '0015': '185159', '0017': '185250', '0033': '185917', '0049': '191922' };
  return `DJI_20261117${m[n]}_${n}_D_AZ1`;
};
const clips = [
  { id: 'c01', n: '0019', in: 0, out: 3.63, fx: 0.28, sb: [0.1, 0.22, 0.9, 1] },
  { id: 'c02', n: '0009', in: 0, out: 8.5, fx: 0.55, sb: [0.1, 0.3, 1, 1] },
  { id: 'c03', n: '0014', in: 0.45, out: 5.7, fx: 0.65, sb: [0.15, 0.35, 1, 1] },
  { id: 'c04', n: '0015', in: 0, out: 5.9, fx: 0.65, sb: [0, 0.32, 1, 1] },
  { id: 'c05', n: '0017', in: 1.79, out: 6.51, fx: 0.8, sb: [0.72, 0.3, 1, 1] },
  { id: 'c06', n: '0033', in: 23.85, out: 42.0, fx: 0.48, sb: [0.38, 0.4, 0.62, 0.66] },
  { id: 'c07', n: '0049', in: 0.55, out: 5.5, fx: 0.43, sb: [0, 0.42, 1, 0.92] },
].map((c) => ({ id: c.id, video_id: vid(c.n), source_in: c.in, source_out: c.out, audio: 'keep', frame_x: c.fx, subject_box: c.sb }));

const base = { priority: 'clarity', reference: 'styles/social.md', status: 'proposed' };
const txt = (id, technique, preset, clip, t, hold, params, reason, confidence = 'medium', extra = {}) => ({
  id, technique, preset, anchor: { clip, source_time: t }, start_offset: 0, duration: 0,
  parameters: { ...params, hold }, reason, confidence, ...base, ...extra,
});
const decisions = [];
for (let i = 0; i < clips.length - 1; i++) {
  decisions.push({ id: `d0${i + 1}`, technique: 'hard_cut', preset: 'cut_hard', anchor: { between: [clips[i].id, clips[i + 1].id] }, start_offset: 0, duration: 0,
    parameters: { cut_on: 'silence', out_tail: 0.15, in_lead: 0.1 }, reason: 'Cắt thẳng ở quãng lặng giữa câu (mốc đã dò bằng silencedetect); style social mặc định cắt thẳng', priority: 'rhythm', confidence: 'medium', reference: null, status: 'proposed' });
}
let n = 10;
const D = () => `d${n++}`;
decisions.push(
  txt(D(), 'text_box', 'social_caption_chunk', 'c01', 0.0, 2.9, { text: 'Kỹ năng dữ liệu là', position: 'top_center', margin: 6.6, in_animation: 'none' },
    'Hook có chữ từ khung đầu (R-SM-2): nêu luận điểm của cả video; lời 0019 "kỹ năng làm việc với dữ liệu chính là…"', 'high'),
  txt(D(), 'big_text', 'social_emphasis_red', 'c01', 0.25, 2.7, { text: 'LỢI THẾ', margin: 9.4, fit_width: 0.62 },
    'Từ nhấn của luận điểm, lời 0019 "…lợi thế cạnh tranh bền vững"', 'high'),
  txt(D(), 'text_box', 'social_caption_chunk', 'c01', 0.5, 2.4, { text: 'cạnh tranh bền vững', position: 'top_center', margin: 20.5, in_animation: 'fade_up', in_duration: 0.25 },
    'Phần còn lại của câu luận điểm (hai tầng chữ), lời 0019', 'high'),
  txt(D(), 'text_box', 'social_question_badge', 'c02', 0.2, 3.0, { text: 'Học gì? Học như thế nào?', margin: 6, font_size: 46 },
    'Câu hỏi khán giả đang có, lời 0009 "học gì, học như thế nào"; thẻ câu hỏi đặt trên, né mặt người nghe', 'medium'),
  txt(D(), 'title_card', 'social_title_card', 'c02', 4.4, 3.3, { text: 'Data Analysis', sub_text: 'ĐH Bách khoa Hà Nội', font_size: 92, sub_font_size: 38 },
    'Tên chương trình xuất hiện sau hook (~15% thời lượng, R-SM-7); lời 0009 nêu đơn vị đào tạo. Thẻ nền mờ thay cảnh tạm thời', 'medium'),
  txt(D(), 'comparison_table', 'table_build_social', 'c03', 0.45, 15.2, { text: 'Học gì?|Nội dung\nNền tảng|Excel · SQL\nNâng cao|Python · tự động hóa\nCập nhật|Workshop hàng tháng', position: 'top_center', margin: 6, row_times: [0.8, 5.85, 13.15] },
    'Thông tin cộng dồn trên một bố cục cố định (R-SM-25): mỗi hàng hiện khi lời nói tới, hàng cũ ở lại. Lời 0014 "Excel, SQL", 0015 "Python… tự động hóa quy trình", 0017 "workshop, webinar hàng tháng". Mốc hàng ước lượng', 'medium'),
  txt(D(), 'big_text', 'social_emphasis_red', 'c06', 24.3, 2.6, { text: 'ĐIỂM KHÁC BIỆT', margin: 6.5, fit_width: 0.76 },
    'Mở phần khác biệt; cảnh 18 s một góc rộng nên nhịp dựa vào chữ (R-SM-20)', 'medium'),
  txt(D(), 'compare_cards', 'compare_cards_vs', 'c06', 27.4, 5.3, { lines: ['Đào tạo riêng|trường đại học', 'Cùng doanh nghiệp|chuyên gia · thị trường'], compare_winner: 1, winner_at: 2.8, card_width: 0.35, font_size: 44, sub_font_size: 30 },
    'So sánh đúng như lời 0033: "rất nhiều chương trình do ĐH Bách khoa cung cấp, nhưng khi đi cùng doanh nghiệp… chuyên gia công nghệ… thị trường thực tế"; thẻ thắng bật khi người nói chốt (mốc ước lượng)', 'low'),
  { id: D(), technique: 'layout_cards', preset: 'layout_cards_screen_top', anchor: { clip: 'c06', source_time: 33.5 }, start_offset: 0, duration: 4.3, parameters: { screen_image: 'img/slide.jpg', screen_fit: 'contain', screen_bg: '#0B0F3A' },
    reason: 'Đoạn 18 s một góc rộng: đổi bố cục để đổi nhịp và cho thấy màn hình tên chương trình (ảnh chụp từ clip 0005 cùng buổi); không cắt, không zoom (R-SM-20)', confidence: 'medium', priority: 'clarity', reference: 'styles/social.md', status: 'proposed' },
  txt(D(), 'text_box', 'social_caption_chunk', 'c06', 38.4, 3.0, { text: 'Thế mạnh và sự', position: 'top_center', margin: 6, in_animation: 'none' },
    'Câu chốt phần khác biệt (dòng dẫn), lời 0033. Mốc ước lượng', 'low'),
  txt(D(), 'big_text', 'social_emphasis_red', 'c06', 38.6, 2.8, { text: 'ĐỘC ĐÁO', margin: 10.4, fit_width: 0.6 },
    'Câu chốt phần khác biệt, lời 0033 "Đấy chính là thế mạnh và sự độc đáo của chương trình này". Mốc ước lượng', 'low'),
  txt(D(), 'big_text', 'social_emphasis_red', 'c07', 0.6, 3.4, { text: 'KHÓA 38', margin: 6, fit_width: 0.55 },
    'Kết bằng người thật (R-SM-8): ảnh tập thể; "khóa 38" theo lời MC clip 0048', 'medium'),
  txt(D(), 'text_box', 'social_caption_chunk', 'c07', 1.0, 3.0, { text: 'Data Analysis', position: 'top_center', margin: 13.3, in_animation: 'fade_up', in_duration: 0.25 },
    'Tên chương trình nhắc lại ở kết (đóng vòng, R-SM-6)', 'medium'),
);

const edl = {
  _note: 'Video ngắn 9:16 từ lễ khai giảng khóa 38. Sinh bằng make-edl.cjs. Mốc hiện chữ trong clip là ước lượng (không có mốc từng từ).',
  edl_version: '1.0',
  project: { id: 'khai-giang-short-916', title: 'Kỹ năng dữ liệu là lợi thế cạnh tranh (9:16)', fps: 29.97, resolution: '1080x1920', aspect: '9:16', language: 'vi', target_duration_sec: 51 },
  strategy: { style: 'social', substyle: 'talking_head', pacing: 'fast', visual_intensity: 'medium', typography_style: 'caption_plus_emphasis', transition_style: 'mostly_hard_cut', motion_style: 'graphics_driven', budget: { punch_in: 0, special_transition: 0 } },
  timeline: { clips },
  decisions,
  audio: { music: { file: null, base_db: -16, duck_amount_db: 12 } },
};
fs.writeFileSync(path.join(__dirname, 'edl.json'), JSON.stringify(edl, null, 2));
console.log('edl.json:', clips.length, 'clip,', decisions.length, 'quyết định');
