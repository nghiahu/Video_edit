// EDL kiểm thử các tính năng mới của style social (chữ minh họa, không phải sản phẩm). Chạy: node projects/test-social-new/make-edl.cjs
const fs = require('fs');
const path = require('path');
const clips = [
  { id: 'c01', video_id: 'DJI_20261117185917_0033_D_AZ1', source_in: 23.85, source_out: 42.0, audio: 'keep', frame_x: 0.48, subject_box: [0.36, 0.38, 0.64, 0.66] },
  { id: 'c02', video_id: 'DJI_20261117185141_0014_D_AZ1', source_in: 0.45, source_out: 5.7, audio: 'keep', frame_x: 0.65, subject_box: [0.15, 0.4, 1, 1] },
  { id: 'c03', video_id: 'DJI_20261117191922_0049_D_AZ1', source_in: 0.55, source_out: 7.5, audio: 'keep', frame_x: 0.43, subject_box: [0, 0.42, 1, 0.92] },
];
const R = 'Kiểm thử tính năng mới style social; nội dung chữ là minh họa';
const dec = (id, technique, preset, clip, t, params, extra = {}) => ({ id, technique, preset, anchor: { clip, source_time: t }, start_offset: 0, duration: 0, parameters: params, reason: R, priority: 'style', confidence: 'low', reference: 'styles/social.md', status: 'proposed', ...extra });
const decisions = [
  { id: 'd01', technique: 'hard_cut', preset: 'cut_hard', anchor: { between: ['c01', 'c02'] }, start_offset: 0, duration: 0, parameters: { cut_on: 'silence', out_tail: 0.15, in_lead: 0.1 }, reason: R, priority: 'rhythm', confidence: 'low', reference: null, status: 'proposed' },
  { id: 'd02', technique: 'hard_cut', preset: 'cut_hard', anchor: { between: ['c02', 'c03'] }, start_offset: 0, duration: 0, parameters: { cut_on: 'silence', out_tail: 0.15, in_lead: 0.1 }, reason: R, priority: 'rhythm', confidence: 'low', reference: null, status: 'proposed' },
  dec('d10', 'strike_list', 'strike_list_myth', 'c01', 24.0, { lines: ['Một phát ăn ngay', 'Không cần sửa', 'Bắt chước mọi thứ'], hold: 4.1 }),
  dec('d11', 'compare_cards', 'compare_cards_vs', 'c01', 28.6, { lines: ['Tốn token|chat để sửa', '0 token|sửa xong mới xuất'], compare_winner: 1, hold: 4.1, winner_at: 2.0 }),
  dec('d12', 'layout_cards', 'layout_cards_screen_top', 'c01', 33.2, { screen_image: 'img/screen.jpg' }, { duration: 4.0 }),
  dec('d13', 'image_float', 'image_fan_head', 'c01', 37.3, { images: ['img/r0.jpg', 'img/r1.jpg', 'img/r2.jpg', 'img/r3.jpg', 'img/r4.jpg'], text: 'Làm chục video', hold: 2.4 }),
  dec('d14', 'draw_annotation', 'draw_arrow_red', 'c01', 40.0, { draw_points: [[0.22, 0.3], [0.33, 0.36], [0.44, 0.44]], text: 'Diễn giả', hold: 1.6 }),
  dec('d15', 'comparison_table', 'table_build_social', 'c02', 0.45, { text: 'Bước|Công cụ\n1|Excel\n2|SQL', row_times: [0.4, 1.4], cell_changes: [{ row: 1, col: 1, text: 'SQL + Python', at: 2.8 }], hold: 4.2 }),
  dec('d16', 'draw_annotation', 'draw_circle_red', 'c02', 1.0, { draw_points: [[0.42, 0.62], [0.62, 0.7]], hold: 2.0 }),
  dec('d17', 'social_cta', 'social_cta_follow', 'c03', 0.6, { text: 'Kênh minh họa', sub_text: '@kenh', hold: 2.0, click_at: 1.3 }),
  dec('d18', 'social_cta', 'social_cta_comment', 'c03', 3.0, { text: 'Xin tài liệu', sub_text: 'Bình luận nhận tài liệu', click_at: 1.6, hold: 3.2 }),
];
const edl = {
  _note: 'Kiểm thử: luân phiên bố cục, gạch ngang, thẻ A vs B, nét vẽ tay, ảnh bay, bảng dựng dần, CTA, vùng an toàn 9:16. Chữ minh họa.',
  edl_version: '1.0',
  project: { id: 'test-social-new', title: 'Thử tính năng mới style social', fps: 29.97, resolution: '1080x1920', aspect: '9:16', language: 'vi', target_duration_sec: 28 },
  strategy: { style: 'social', substyle: 'talking_head', pacing: 'fast', visual_intensity: 'medium', typography_style: 'caption_plus_emphasis', transition_style: 'mostly_hard_cut', motion_style: 'graphics_driven', budget: { punch_in: 0, special_transition: 0 } },
  timeline: { clips },
  decisions,
  audio: { music: { file: null, base_db: -16, duck_amount_db: 12 } },
};
fs.writeFileSync(path.join(__dirname, 'edl.json'), JSON.stringify(edl, null, 2));
console.log('ok', decisions.length);
