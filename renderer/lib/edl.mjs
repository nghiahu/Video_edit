// Thư viện thuần Node: đọc, kiểm tra hợp lệ và "giải" EDL thành dữ liệu frame để composition dựng.
// Hợp đồng: schema/edl.md, schema/preset.md. Mọi thời gian trong EDL là giây; ở đây đổi sang frame.
import fs from 'node:fs';
import path from 'node:path';
import { DURATION_RANGE, ENUMS, TRANSITIONS } from './transitions.mjs';

export const SUPPORTED = [
  ...new Set([
    'punch_in', 'hard_cut', 'j_l_cut', 'kinetic_text', 'audio_ducking', 'lower_third', 'slow_push',
    'subtitles', 'color_grade_basic', 'vignette', 'punch_out',
    'time_lapse', 'freeze_frame', 'speed_ramp_transition', 'fade_in_out', 'whoosh_synced_cut',
    'text_pill', 'text_box', 'stacked_text', 'title_card', 'big_text', 'marker_highlight',
    ...Object.keys(TRANSITIONS),
  ]),
];
const PRIORITIES = ['storytelling', 'clarity', 'rhythm', 'style', 'decoration'];
const STATUSES = ['proposed', 'approved', 'removed'];
const CONTENT_KEYS = ['text', 'hold', 'name', 'title', 'cues', 'file', 'lines', 'sub_text', 'highlight_words']; // trường nội dung quyết định có thể thêm ngoài preset
const MIN_GAP_SEC = { punch_in: 6, kinetic_text: 4, j_l_cut: 3 };
// Đăng ký phông (typography/font-registry.json): kiểm tra phông có trong danh sách và hợp vai trò chữ.
let REGISTRY = null;
try {
  REGISTRY = JSON.parse(fs.readFileSync(new URL('../../typography/font-registry.json', import.meta.url), 'utf8'));
} catch {
  REGISTRY = null;
}
function checkFont(err, warn, id, family, weight, role, size) {
  if (!REGISTRY || !family) return;
  const f = REGISTRY.fonts[family];
  if (!f) { err(`${id}: phông "${family}" chưa đăng ký trong typography/font-registry.json`); return; }
  const wanted = Array.isArray(role) ? role : [role];
  if (!wanted.some((r) => f.roles.includes(r))) err(`${id}: phông "${family}" (${f.category}) không dùng cho vai trò "${wanted.join('/')}" — khả năng đọc quan trọng hơn phong cách; chọn phông có vai trò này (xem font-registry.json)`);
  if (weight && !f.weights.includes(weight)) warn(`${id}: ${family} không có độ đậm ${weight}, renderer dùng độ đậm gần nhất`);
  if (size && f.min_size_px_1080p && size < f.min_size_px_1080p) warn(`${id}: cỡ chữ ${size}px nhỏ hơn mức khuyến nghị ${f.min_size_px_1080p}px cho ${family}`);
}
const TRANSITION_GAP_SEC = 3;
// Khối chữ dùng chung (renderer/src/TextBlock.jsx)
const BLOCK_RULES = {
  text_pill: { maxWords: 5, maxLines: 1, role: ['emphasis', 'accent'] },
  text_box: { maxWords: 14, maxLines: 2, role: ['emphasis', 'accent', 'subtitle'] },
  stacked_text: { maxWords: 10, maxLines: 4, role: ['heading', 'emphasis'] },
  title_card: { maxWords: 10, maxLines: 3, role: ['heading', 'emphasis'] },
  big_text: { maxWords: 3, maxLines: 2, role: ['emphasis', 'heading', 'accent'] },
  marker_highlight: { maxWords: 14, maxLines: 2, role: ['emphasis', 'heading', 'accent'] },
};
const BLOCK_ENUMS = {
  position: ['top_left', 'top_center', 'top_right', 'middle_left', 'center', 'middle_right', 'lower_left', 'lower_middle', 'lower_right'],
  box_style: ['none', 'pill', 'rect', 'rounded', 'bar_left', 'underline'],
  in_animation: ['none', 'fade', 'fade_up', 'fade_down', 'slide_left', 'slide_right', 'slide_up', 'slide_down', 'scale_fade', 'pop', 'mask_wipe', 'blur_in', 'rotate_in', 'letter_stagger', 'word_stagger', 'line_stagger'],
  out_animation: ['none', 'fade', 'slide_left', 'slide_right', 'slide_up', 'slide_down', 'scale_fade', 'mask_wipe'],
  shadow_type: ['none', 'soft', 'hard', 'offset3d'],
  text_transform: ['none', 'uppercase', 'lowercase'],
  bg_mode: ['none', 'dim', 'blur', 'solid'],
  align: ['auto', 'left', 'center', 'right'],
};
export function blockLines(p) {
  const raw = Array.isArray(p.lines) && p.lines.length ? p.lines : String(p.text ?? '').split('\n');
  return raw.map((l) => (typeof l === 'string' ? l : String(l.text ?? '')));
} // khoảng cách tối thiểu giữa hai chuyển cảnh "đặc biệt" bất kỳ

export function loadPresets(root) {
  const dir = path.join(root, 'presets');
  const presets = {};
  const bases = {};
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('-presets.json'))) {
    const obj = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    for (const [k, v] of Object.entries(obj)) {
      if (k.startsWith('_')) { if (v && typeof v === 'object' && v.parameters) bases[k] = v; continue; } // khối nền để preset khác kế thừa (extends)
      if (presets[k]) throw new Error(`Preset trùng ID: ${k}`);
      presets[k] = v;
    }
  }
  // extends: tham số của preset ghi đè tham số của khối nền
  for (const [k, v] of Object.entries(presets)) {
    if (!v.extends) continue;
    const base = bases[v.extends];
    if (!base) throw new Error(`Preset ${k} kế thừa khối nền không tồn tại: ${v.extends}`);
    v.parameters = { ...base.parameters, ...v.parameters };
  }
  return presets;
}

export function readEdl(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function renderFps(edl) {
  return Math.round(edl.project.fps);
}

export function mergeParams(decision, presets) {
  const p = decision.preset ? presets[decision.preset] : null;
  return { ...(p ? p.parameters : {}), ...(decision.parameters || {}) };
}

function wordCount(t) {
  return String(t || '').trim().split(/\s+/).filter(Boolean).length;
}

export function minHold(params, text) {
  const base = params.min_hold_base ?? 0.8;
  const per = params.min_hold_per_word ?? 0.3;
  return Math.max(1.0, base + per * wordCount(text));
}

/**
 * Kiểm tra EDL. sourceInfo (tuỳ chọn): { [video_id]: { duration, hasAudio } } để kiểm tra mốc và âm thanh.
 * Trả về { errors: string[], warnings: string[] }.
 */
export function validateEdl(edl, presets, sourceInfo = {}) {
  const errors = [];
  const warnings = [];
  const err = (m) => errors.push(m);
  const warn = (m) => warnings.push(m);

  if (edl.edl_version !== '1.0') err(`edl_version phải là "1.0" (đang là ${edl.edl_version})`);
  if (!edl.project || !edl.project.fps || !edl.project.resolution) err('Thiếu project.fps hoặc project.resolution');
  if (!edl.strategy || !edl.strategy.style) err('Thiếu strategy.style');
  const clips = edl.timeline?.clips || [];
  if (!clips.length) err('timeline.clips trống');
  const byId = {};
  for (const c of clips) {
    if (byId[c.id]) err(`Clip trùng ID ${c.id}`);
    byId[c.id] = c;
    if (!(c.source_out > c.source_in)) err(`${c.id}: source_out phải lớn hơn source_in`);
    if (!['keep', 'mute', 'duck'].includes(c.audio)) err(`${c.id}: audio phải là keep|mute|duck`);
    const info = sourceInfo[c.video_id];
    if (info) {
      if (c.source_in < 0) err(`${c.id}: source_in âm`);
      if (info.duration && c.source_out > info.duration + 0.05) {
        err(`${c.id}: source_out ${c.source_out}s vượt độ dài file ${info.duration.toFixed(2)}s`);
      }
      if (c.audio !== 'mute' && info.hasAudio === false) warn(`${c.id}: audio=${c.audio} nhưng file không có tiếng`);
    } else if (Object.keys(sourceInfo).length) {
      err(`${c.id}: không tìm thấy file nguồn cho video_id ${c.video_id}`);
    }
  }

  const ids = new Set();
  const byTech = {};
  const style = edl.strategy?.style;
  for (const d of edl.decisions || []) {
    if (ids.has(d.id)) err(`Quyết định trùng ID ${d.id}`);
    ids.add(d.id);
    if (!STATUSES.includes(d.status)) err(`${d.id}: status không hợp lệ (${d.status})`);
    if (!d.reason || !String(d.reason).trim()) err(`${d.id}: thiếu reason`);
    if (!PRIORITIES.includes(d.priority)) err(`${d.id}: priority không hợp lệ (${d.priority})`);
    if (!SUPPORTED.includes(d.technique)) {
      err(`${d.id}: kỹ thuật "${d.technique}" chưa được renderer hỗ trợ (hỗ trợ: ${SUPPORTED.join(', ')})`);
      continue;
    }
    if (d.status === 'removed') continue;

    const preset = d.preset ? presets[d.preset] : null;
    if (d.preset && !preset) err(`${d.id}: preset "${d.preset}" không tồn tại`);
    if (preset) {
      if (preset.technique !== d.technique) err(`${d.id}: preset ${d.preset} thuộc kỹ thuật ${preset.technique}, không phải ${d.technique}`);
      if ((preset.forbidden_styles || []).includes(style)) err(`${d.id}: preset ${d.preset} bị cấm ở style ${style}`);
      const allow = preset.allowed_styles || ['all'];
      if (!allow.includes('all') && !allow.includes(style)) err(`${d.id}: preset ${d.preset} không dành cho style ${style}`);
      for (const k of Object.keys(d.parameters || {})) {
        if (!(k in preset.parameters) && !CONTENT_KEYS.includes(k)) err(`${d.id}: khóa thông số lạ "${k}"`);
      }
    }

    const a = d.anchor || {};
    if (a.clip) {
      const c = byId[a.clip];
      if (!c) err(`${d.id}: anchor.clip ${a.clip} không tồn tại`);
      else if (a.source_time < c.source_in - 1e-6 || a.source_time > c.source_out + 1e-6) {
        err(`${d.id}: source_time ${a.source_time} nằm ngoài [${c.source_in}, ${c.source_out}] của ${a.clip}`);
      }
    } else if (a.between) {
      const [x, y] = a.between;
      const ix = clips.findIndex((c) => c.id === x);
      const iy = clips.findIndex((c) => c.id === y);
      if (ix < 0 || iy < 0) err(`${d.id}: anchor.between chứa clip không tồn tại`);
      else if (iy !== ix + 1) err(`${d.id}: anchor.between phải là hai clip liền kề theo thứ tự`);
    } else {
      err(`${d.id}: thiếu anchor`);
    }
    if ((['j_l_cut', 'hard_cut', 'speed_ramp_transition', 'whoosh_synced_cut'].includes(d.technique) || TRANSITIONS[d.technique]) && !a.between) err(`${d.id}: ${d.technique} cần anchor.between`);
    if (['punch_in', 'kinetic_text', 'audio_ducking', 'lower_third', 'slow_push', 'subtitles', 'color_grade_basic', 'vignette', 'punch_out', 'time_lapse', 'freeze_frame', 'fade_in_out'].includes(d.technique) && !a.clip) err(`${d.id}: ${d.technique} cần anchor.clip`);

    const params = mergeParams(d, presets);
    if (d.technique === 'kinetic_text') {
      const words = wordCount(params.text);
      if (!words) err(`${d.id}: kinetic_text thiếu text`);
      if (params.max_words && words > params.max_words) err(`${d.id}: chữ ${words} từ vượt max_words ${params.max_words}`);
      checkFont(err, warn, d.id, params.font_family, params.font_weight, ['emphasis', 'accent'], params.font_size);
      const need = minHold(params, params.text);
      const hold = params.hold ?? need;
      if (hold + 1e-6 < need) err(`${d.id}: hold ${hold}s nhỏ hơn mức tối thiểu ${need.toFixed(2)}s cho ${words} từ`);
    }
    if (d.technique === 'punch_in') {
      if (!(params.end_scale > 1 && params.end_scale <= 1.3)) err(`${d.id}: end_scale ${params.end_scale} ngoài (1, 1.3]`);
      if (!['cut', 'zoom_out', 'keep'].includes(params.return)) err(`${d.id}: return không hợp lệ`);
    }
    if (d.technique === 'j_l_cut') {
      if (!['j', 'l'].includes(params.variant)) err(`${d.id}: variant phải là j hoặc l`);
    }
    if (d.technique === 'audio_ducking' && !(d.duration > 0)) err(`${d.id}: audio_ducking cần duration > 0`);
    if (BLOCK_RULES[d.technique]) {
      const rule = BLOCK_RULES[d.technique];
      const lines = blockLines(params).filter((l) => l.trim());
      const words = lines.join(' ').trim().split(/\s+/).filter(Boolean).length;
      if (!lines.length) err(`${d.id}: ${d.technique} thiếu text (hoặc lines)`);
      if (lines.length > rule.maxLines) err(`${d.id}: ${d.technique} ${lines.length} dòng vượt tối đa ${rule.maxLines}`);
      if (words > rule.maxWords) err(`${d.id}: ${d.technique} ${words} từ vượt tối đa ${rule.maxWords}`);
      for (const [key, allowed] of Object.entries(BLOCK_ENUMS)) {
        if (params[key] !== undefined && !allowed.includes(params[key])) err(`${d.id}: ${key} "${params[key]}" không hợp lệ (${allowed.join('|')})`);
      }
      const rng = { stroke_width: [0, 24], shadow_blur: [0, 60], glow_size: [0, 80], rotate: [-30, 30], fit_width: [0.3, 1], font_size: [12, 400], box_padding_x: [0, 120], box_padding_y: [0, 80] };
      for (const [key, [lo, hi]] of Object.entries(rng)) if (params[key] !== undefined && !(params[key] >= lo && params[key] <= hi) && !(key === 'fit_width' && params[key] === 0)) err(`${d.id}: ${key} ${params[key]} ngoài [${lo}, ${hi}]`);
      checkFont(err, warn, d.id, params.font_family, params.font_weight, rule.role, params.fit_width ? undefined : params.font_size);
      const body = `${lines.join(' ')} ${params.sub_text || ''}`;
      const need = minHold(params, body);
      const hold = params.hold ?? need;
      if (hold + 1e-6 < need) err(`${d.id}: hold ${hold}s nhỏ hơn mức tối thiểu ${need.toFixed(2)}s cho ${body.trim().split(/\s+/).filter(Boolean).length} từ`);
      if (style === 'documentary' && params.in_animation && !['none', 'fade', 'fade_up'].includes(params.in_animation)) err(`${d.id}: style documentary chỉ cho in_animation none|fade|fade_up (đang ${params.in_animation})`);
      if (style === 'documentary' && params.out_animation && !['none', 'fade'].includes(params.out_animation)) err(`${d.id}: style documentary chỉ cho out_animation none|fade (đang ${params.out_animation})`);
      const upperAccent = /[ÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴ]/.test(lines.join(' ')) || (params.text_transform === 'uppercase' && /[\u00C0-\u1EF9]/.test(lines.join(' ')));
      if (lines.length > 1 && params.line_height < 1.15 && upperAccent) {
        warn(`${d.id}: line_height ${params.line_height} quá chặt cho chữ HOA có dấu tiếng Việt nhiều dòng — dấu và chân chữ của các dòng có thể đè lên nhau; dùng ≥ 1.15 (≥ 1.25 nếu chữ hoa cỡ lớn)`);
      }
      if (d.technique === 'marker_highlight' && !params.marker_color) err(`${d.id}: marker_highlight cần marker_color`);
      for (const need of preset?.requires || []) {
        const v = params[need];
        if (v === undefined || v === null || (Array.isArray(v) && !v.length) || v === '') err(`${d.id}: preset ${d.preset} yêu cầu parameters.${need}`);
      }
      const subWords = String(params.sub_text || '').trim().split(/\s+/).filter(Boolean).length;
      if (subWords > 12) err(`${d.id}: sub_text ${subWords} từ vượt tối đa 12`);
      const totalSec = (params.in_duration ?? 0.3) + hold + (params.out_duration ?? 0.2);
      if (d.duration !== undefined && Math.abs(d.duration - totalSec) > 0.3) warn(`${d.id}: duration của quyết định (${d.duration}s) khác tổng thời gian hiện thực tế ${totalSec.toFixed(2)}s (in + hold + out); renderer dùng ${totalSec.toFixed(2)}s`);
      if (Array.isArray(params.highlight_words)) {
        const lw = lines.join(' ').toLowerCase();
        for (const w of params.highlight_words) if (!lw.includes(String(w).toLowerCase())) warn(`${d.id}: highlight_words "${w}" không có trong chữ`);
      }
    }
    if (d.technique === 'lower_third') {
      if (!String(params.name || '').trim()) err(`${d.id}: lower_third thiếu name`);
      checkFont(err, warn, d.id, params.name_font_family, params.name_font_weight, 'heading', params.name_font_size);
      checkFont(err, warn, d.id, params.title_font_family, params.title_font_weight, 'subtitle');
      if (!(d.duration >= 2)) err(`${d.id}: lower_third cần duration ≥ 2s để đọc được`);
      else if (d.duration < 3 || d.duration > 5) warn(`${d.id}: lower_third nên hiện 3–5s (đang ${d.duration}s)`);
    }
    if (d.technique === 'slow_push') {
      if (!(params.end_scale > 1 && params.end_scale <= 1.12)) err(`${d.id}: slow_push end_scale ${params.end_scale} ngoài (1, 1.12]`);
      if (!['linear', 'ease_in_out'].includes(params.easing)) err(`${d.id}: slow_push easing phải là linear|ease_in_out`);
    }
    if (d.technique === 'punch_out') {
      if (!(params.start_scale > 1.03 && params.start_scale <= 1.3)) err(`${d.id}: punch_out start_scale ${params.start_scale} ngoài (1.03, 1.3]`);
      if (!(params.duration >= 0.3 && params.duration <= 1.5)) err(`${d.id}: punch_out duration ${params.duration} ngoài [0.3, 1.5]`);
    }
    if (d.technique === 'time_lapse') {
      if (!(params.rate >= 1.5 && params.rate <= 32)) err(`${d.id}: time_lapse rate ${params.rate} ngoài [1.5, 32]`);
      if (!(params.span >= 0)) err(`${d.id}: time_lapse span phải ≥ 0 (0 = đến hết clip)`);
    }
    if (d.technique === 'freeze_frame') {
      if (!(params.hold >= 0.3 && params.hold <= 5)) err(`${d.id}: freeze_frame hold ${params.hold} ngoài [0.3, 5]`);
    }
    if (d.technique === 'speed_ramp_transition') {
      if (!(params.factor >= 1.5 && params.factor <= 10)) err(`${d.id}: speed_ramp factor ${params.factor} ngoài [1.5, 10]`);
      if (!(params.duration >= 0.2 && params.duration <= 1.5)) err(`${d.id}: speed_ramp duration ${params.duration} ngoài [0.2, 1.5]`);
      if (params.steps !== undefined && !(Number.isInteger(params.steps) && params.steps >= 2 && params.steps <= 12)) err(`${d.id}: speed_ramp steps ${params.steps} phải là số nguyên trong [2, 12]`);
    }
    if (d.technique === 'fade_in_out') {
      if (!['in', 'out'].includes(params.where)) err(`${d.id}: fade_in_out where phải là in|out`);
      if (!(params.duration >= 0.2 && params.duration <= 3)) err(`${d.id}: fade_in_out duration ${params.duration} ngoài [0.2, 3]`);
    }
    if (d.technique === 'whoosh_synced_cut') {
      if (!String(params.file || '').trim()) err(`${d.id}: whoosh_synced_cut cần parameters.file (đường dẫn file âm thanh trong thư mục dự án)`);
      if (!(params.gain_db <= 0 && params.gain_db >= -40)) err(`${d.id}: gain_db ${params.gain_db} ngoài [-40, 0]`);
      if (params.offset !== undefined && !(params.offset >= -1 && params.offset <= 0.5)) err(`${d.id}: whoosh offset ${params.offset} ngoài [-1, 0.5] giây`);
    }
    if (d.technique === 'color_grade_basic') {
      const rng = { brightness: [-0.15, 0.15], contrast: [0.85, 1.2], saturation: [0.7, 1.3], warmth: [-1, 1] };
      for (const [k, [lo, hi]] of Object.entries(rng)) {
        if (!(params[k] >= lo && params[k] <= hi)) err(`${d.id}: ${k} ${params[k]} ngoài [${lo}, ${hi}]`);
      }
    }
    if (d.technique === 'vignette') {
      if (!(params.strength > 0 && params.strength <= 0.5)) err(`${d.id}: vignette strength ${params.strength} ngoài (0, 0.5]`);
    }
    if (d.technique === 'subtitles') {
      checkFont(err, warn, d.id, params.font_family, params.font_weight, 'subtitle', params.font_size);
      const cues = Array.isArray(params.cues) ? params.cues : [];
      const c = byId[a.clip];
      if (!cues.length) err(`${d.id}: subtitles cần parameters.cues (mảng {source_time, duration, text})`);
      let prevEnd = -Infinity;
      for (const [i, cue] of cues.entries()) {
        const tag = `${d.id} cue ${i + 1}`;
        if (c && (cue.source_time < c.source_in - 1e-6 || cue.source_time > c.source_out + 1e-6)) err(`${tag}: source_time ngoài clip ${c.id}`);
        if (!(cue.duration >= 1.0)) err(`${tag}: duration ${cue.duration}s ngắn hơn 1.0s, không đọc kịp`);
        const lines = String(cue.text || '').split('\n');
        if (!String(cue.text || '').trim()) err(`${tag}: text trống`);
        if (lines.length > (params.max_lines || 2)) err(`${tag}: ${lines.length} dòng vượt tối đa ${params.max_lines || 2}`);
        for (const ln of lines) if (ln.length > (params.max_chars_per_line || 42)) err(`${tag}: dòng "${ln.slice(0, 20)}…" dài ${ln.length} > ${params.max_chars_per_line || 42} ký tự`);
        const cps = String(cue.text || '').replace(/\n/g, ' ').length / Math.max(0.1, cue.duration);
        if (cps > (params.max_cps || 17)) warn(`${tag}: tốc độ đọc ${cps.toFixed(1)} ký tự/giây vượt ${params.max_cps || 17} (khó đọc kịp)`);
        if (cue.source_time < prevEnd - 1e-6) err(`${tag}: chồng lên cue trước`);
        prevEnd = cue.source_time + cue.duration;
      }
    }
    if (TRANSITIONS[d.technique]) {
      if (!(params.duration >= DURATION_RANGE[0] && params.duration <= DURATION_RANGE[1])) {
        err(`${d.id}: ${d.technique} duration ${params.duration} ngoài [${DURATION_RANGE[0]}, ${DURATION_RANGE[1]}]`);
      }
      for (const [key, allowed] of Object.entries(ENUMS)) {
        if (params[key] !== undefined && !allowed.includes(params[key])) err(`${d.id}: ${key} "${params[key]}" không hợp lệ (${allowed.join('|')})`);
      }
      for (const key of ['origin_x', 'origin_y', 'softness']) {
        if (params[key] !== undefined && key !== 'softness' && !(params[key] >= 0 && params[key] <= 1)) err(`${d.id}: ${key} phải trong [0, 1]`);
      }
      if (d.technique === 'whip_tilt' && params.direction !== undefined && !['up', 'down'].includes(params.direction)) {
        err(`${d.id}: whip_tilt chỉ hỗ trợ direction up|down`);
      }
      if (d.duration !== undefined && Math.abs(d.duration - params.duration) > 0.05) {
        warn(`${d.id}: duration của quyết định (${d.duration}s) khác parameters.duration (${params.duration}s); renderer dùng ${params.duration}s`);
      }
      if (d.technique === 'flash_strobe') {
        const n = params.strobes ?? 1;
        if (!(Number.isInteger(n) && n >= 1 && n <= 6)) err(`${d.id}: flash_strobe strobes ${n} phải là số nguyên trong [1, 6]`);
        else if (n > 1 && n / params.duration > 3.01) err(`${d.id}: flash_strobe chớp ${(n / params.duration).toFixed(1)} lần/giây vượt giới hạn an toàn 3 lần/giây (strobes/duration ≤ 3): tăng duration hoặc giảm strobes`);
      }
      if (d.technique === 'text_graphic_wipe' && params.direction !== undefined && !['left', 'right'].includes(params.direction)) {
        err(`${d.id}: text_graphic_wipe chỉ hỗ trợ direction left|right (engine chỉ dịch ngang)`);
      }
      if (params.bars !== undefined && !(Number.isInteger(params.bars) && params.bars >= 2 && params.bars <= 40)) err(`${d.id}: bars ${params.bars} phải là số nguyên trong [2, 40]`);
      if (params.start_angle !== undefined && !(params.start_angle >= 0 && params.start_angle < 360)) err(`${d.id}: start_angle ${params.start_angle} ngoài [0, 360)`);
      if (d.technique === 'cross_dissolve' && !(params.duration >= 0.3 && params.duration <= 1.2)) {
        err(`${d.id}: cross_dissolve duration ${params.duration} ngoài [0.3, 1.2]`);
      }
    }
    (byTech[d.technique] ||= []).push(d);
  }

  // Ngân sách
  const budget = edl.strategy?.budget || {};
  const mapBudget = { punch_in: 'punch_in', kinetic_text: 'emphasis_text', lower_third: 'lower_third' };
  for (const [tech, key] of Object.entries(mapBudget)) {
    const n = (byTech[tech] || []).length;
    if (key in budget && n > budget[key]) err(`Vượt ngân sách ${key}: ${n} > ${budget[key]}`);
  }
  for (const tech of Object.keys(BLOCK_RULES)) {
    const n = (byTech[tech] || []).length;
    if (tech in budget && n > budget[tech]) err(`Vượt ngân sách ${tech}: ${n} > ${budget[tech]}`);
  }
  // Mọi chuyển cảnh "đặc biệt" (khác cắt thẳng và j/l cut) tính chung vào special_transition
  const specials = Object.keys(TRANSITIONS).flatMap((t) => byTech[t] || []);
  if ('special_transition' in budget && specials.length > budget.special_transition) {
    err(`Vượt ngân sách special_transition: ${specials.length} > ${budget.special_transition} (${specials.map((d) => d.id).join(', ')})`);
  }

  // Khoảng cách tối thiểu (theo giờ đầu ra ước tính, cảnh báo)
  const starts = {};
  let t = 0;
  for (const c of clips) {
    starts[c.id] = t;
    t += c.source_out - c.source_in;
  }
  for (const [tech, gap] of Object.entries(MIN_GAP_SEC)) {
    const list = (byTech[tech] || [])
      .map((d) => {
        const a = d.anchor;
        const c = a.clip ? byId[a.clip] : byId[a.between?.[1]];
        if (!c) return null;
        const at = a.clip ? starts[c.id] + (a.source_time - c.source_in) : starts[c.id];
        return { id: d.id, at: at + (d.start_offset || 0) };
      })
      .filter(Boolean)
      .sort((x, y) => x.at - y.at);
    for (let i = 1; i < list.length; i++) {
      if (list[i].at - list[i - 1].at < gap) {
        warn(`${list[i - 1].id} và ${list[i].id} (${tech}) cách nhau ${(list[i].at - list[i - 1].at).toFixed(1)}s < ${gap}s tối thiểu`);
      }
    }
  }

  // Hai chuyển cảnh đặc biệt bất kỳ không nên sát nhau
  const tlist = specials
    .map((d) => ({ id: d.id, at: starts[d.anchor.between?.[1]] }))
    .filter((x) => x.at !== undefined)
    .sort((x, y) => x.at - y.at);
  for (let i = 1; i < tlist.length; i++) {
    if (tlist[i].at - tlist[i - 1].at < TRANSITION_GAP_SEC) {
      warn(`${tlist[i - 1].id} và ${tlist[i].id}: hai chuyển cảnh đặc biệt cách nhau ${(tlist[i].at - tlist[i - 1].at).toFixed(1)}s < ${TRANSITION_GAP_SEC}s`);
    }
  }

  // Chữ chồng nhau về thời gian (lower_third dùng vùng dưới-trái, kinetic_text vùng dưới-giữa/giữa)
  const textSpans = [...(byTech.kinetic_text || []), ...(byTech.lower_third || [])].map((d) => {
    const c = byId[d.anchor.clip];
    const at = c ? starts[c.id] + (d.anchor.source_time - c.source_in) + (d.start_offset || 0) : 0;
    const p = mergeParams(d, presets);
    const len = d.technique === 'lower_third' ? d.duration : (p.in_duration || 0.25) + (p.hold ?? minHold(p, p.text)) + (p.out_duration || 0.2);
    return { id: d.id, at, end: at + len };
  });
  for (const d of byTech.subtitles || []) {
    const c = byId[d.anchor.clip];
    for (const [i, cue] of (mergeParams(d, presets).cues || []).entries()) {
      if (!c) continue;
      const at = starts[c.id] + (cue.source_time - c.source_in);
      textSpans.push({ id: `${d.id}/cue${i + 1}`, at, end: at + cue.duration });
    }
  }
  // Nhất quán màu: nếu có chỉnh màu mà chỉ một phần clip được chỉnh
  const graded = new Set((byTech.color_grade_basic || []).map((d) => d.anchor.clip));
  if (graded.size && graded.size < clips.length) {
    warn(`color_grade_basic chỉ áp cho ${[...graded].join(', ')}; clip còn lại (${clips.filter((c) => !graded.has(c.id)).map((c) => c.id).join(', ')}) chưa chỉnh — kiểm tra nhất quán màu`);
  }
  for (let i = 0; i < textSpans.length; i++) {
    for (let j = i + 1; j < textSpans.length; j++) {
      if (textSpans[i].at < textSpans[j].end && textSpans[j].at < textSpans[i].end) {
        warn(`${textSpans[i].id} và ${textSpans[j].id}: hai khối chữ hiện cùng lúc (R-TXT / hierarchy: một cấp 1 mỗi khung)`);
      }
    }
  }
  // slow_push chồng punch_in trên cùng clip
  for (const sp of byTech.slow_push || []) {
    if ((byTech.punch_in || []).some((p) => p.anchor.clip === sp.anchor.clip)) {
      warn(`${sp.id}: slow_push cùng clip ${sp.anchor.clip} với punch_in — hai chuyển động camera chồng nhau (R-FREQ-4)`);
    }
  }

  // Cảnh báo âm thanh j_l_cut
  for (const d of byTech.j_l_cut || []) {
    const [x, y] = d.anchor.between || [];
    const params = mergeParams(d, presets);
    if (params.variant === 'l' && byId[y]?.audio !== 'mute') {
      warn(`${d.id}: L-cut khi clip ${y} giữ tiếng gốc — ${y} sẽ bị câm trong ${params.tail}s đầu để nhường tiếng ${x}`);
    }
    if (byId[x]?.audio === 'mute' && params.variant === 'l') warn(`${d.id}: L-cut nhưng ${x} đang mute, không có tiếng để kéo`);
  }

  const music = edl.audio?.music;
  if ((byTech.audio_ducking || []).length && !(music && music.file)) {
    warn('Có audio_ducking nhưng audio.music.file = null: sẽ không có nhạc để hạ (bỏ qua ducking khi render)');
  }
  return { errors, warnings };
}

/**
 * "Giải" EDL thành dữ liệu frame. Chỉ lấy quyết định có status trong `include`.
 * sourceInfo: { [video_id]: { duration, hasAudio } } (để kẹp phần kéo tiếng j/l không vượt file).
 */
export function resolveEdl(edl, presets, { include = ['proposed', 'approved'], sourceInfo = {} } = {}) {
  const fps = renderFps(edl);
  const warnings = [];
  const F = (sec) => Math.round(sec * fps);

  const decisions = (edl.decisions || []).filter((d) => include.includes(d.status));

  // ---- Retime: time_lapse, freeze_frame, speed_ramp_transition biến một clip thành nhiều đoạn (segs) có tốc độ khác nhau.
  const RETIME = ['time_lapse', 'freeze_frame', 'speed_ramp_transition'];
  const opsFor = (cid) => {
    const ops = [];
    for (const d of decisions.filter((x) => RETIME.includes(x.technique))) {
      const p = mergeParams(d, presets);
      if (d.technique === 'time_lapse' && d.anchor.clip === cid) ops.push({ type: 'rate', t0: d.anchor.source_time, span: p.span, rate: p.rate });
      if (d.technique === 'freeze_frame' && d.anchor.clip === cid) ops.push({ type: 'freeze', t: d.anchor.source_time, hold: p.hold });
      if (d.technique === 'speed_ramp_transition' && d.anchor.between) {
        if (d.anchor.between[0] === cid) ops.push({ type: 'ramp_out', factor: p.factor, dur: p.duration, steps: p.steps || 6 });
        if (d.anchor.between[1] === cid) ops.push({ type: 'ramp_in', factor: p.factor, dur: p.duration, steps: p.steps || 6 });
      }
    }
    return ops;
  };
  const buildSegs = (c, ops) => {
    let ivs = [{ t0: c.source_in, t1: c.source_out, rate: 1, kind: 'play' }];
    const splitAt = (t) => {
      const out = [];
      for (const iv of ivs) {
        if (iv.kind === 'play' && t > iv.t0 + 1e-6 && t < iv.t1 - 1e-6) out.push({ ...iv, t1: t }, { ...iv, t0: t });
        else out.push(iv);
      }
      ivs = out;
    };
    const setRate = (t0, t1, rate) => {
      splitAt(t0); splitAt(t1);
      for (const iv of ivs) if (iv.kind === 'play' && iv.t0 >= t0 - 1e-6 && iv.t1 <= t1 + 1e-6) iv.rate = rate;
    };
    for (const op of ops.filter((o) => o.type === 'rate')) {
      const t1 = op.span > 0 ? Math.min(c.source_out, op.t0 + op.span) : c.source_out;
      setRate(op.t0, t1, op.rate);
    }
    for (const op of ops.filter((o) => o.type === 'ramp_out' || o.type === 'ramp_in')) {
      const n = op.steps, d = op.dur / n;
      const rates = Array.from({ length: n }, (_, i) => (op.type === 'ramp_out' ? 1 + (op.factor - 1) * ((i + 0.5) / n) : op.factor - (op.factor - 1) * ((i + 0.5) / n)));
      const spans = rates.map((r) => r * d);
      const L = spans.reduce((s, v) => s + v, 0);
      let t = op.type === 'ramp_out' ? Math.max(c.source_in, c.source_out - L) : c.source_in;
      if (op.type === 'ramp_out' && c.source_out - L < c.source_in) warnings.push(`speed_ramp: clip ${c.id} quá ngắn cho đoạn tăng tốc, đã rút`);
      for (let i = 0; i < n; i++) {
        const t1 = Math.min(c.source_out, t + spans[i]);
        if (t1 > t + 1e-6) setRate(t, t1, rates[i]);
        t = t1;
      }
    }
    for (const op of ops.filter((o) => o.type === 'freeze')) {
      splitAt(op.t);
      const idx = ivs.findIndex((iv) => iv.kind === 'play' && Math.abs(iv.t0 - op.t) < 1e-6);
      const fz = { t0: op.t, t1: op.t, rate: 0, kind: 'freeze', hold: op.hold };
      if (idx >= 0) ivs.splice(idx, 0, fz); else ivs.push(fz);
    }
    let rel = 0;
    const segs = [];
    for (const iv of ivs) {
      const dur = iv.kind === 'freeze' ? F(iv.hold) : F((iv.t1 - iv.t0) / iv.rate);
      if (dur < 1) continue;
      segs.push({ kind: iv.kind, from: rel, dur, srcStart: iv.t0, srcEnd: iv.t1, rate: iv.kind === 'freeze' ? 1 : iv.rate });
      rel += dur;
    }
    return segs.length ? segs : [{ kind: 'play', from: 0, dur: Math.max(1, F(c.source_out - c.source_in)), srcStart: c.source_in, srcEnd: c.source_out, rate: 1 }];
  };

  let cursor = 0;
  const clips = edl.timeline.clips.map((c) => {
    const segs = buildSegs(c, opsFor(c.id));
    const dur = segs.reduce((s, g) => s + g.dur, 0);
    const out = {
      id: c.id, videoId: c.video_id, from: cursor, dur, srcIn: c.source_in, srcOut: c.source_out, audio: c.audio,
      headExt: 0, tailExt: 0, fadeIn: 0, segs, // headExt/tailExt: phần mở rộng hình cho chuyển cảnh chồng (frame)
    };
    cursor += dur;
    return out;
  });
  const totalFrames = cursor;
  const byId = Object.fromEntries(clips.map((c) => [c.id, c]));

  // Giờ nguồn (giây) → frame đầu ra tuyệt đối, có tính các đoạn đổi tốc độ.
  const outFrameOf = (c, t) => {
    for (const s of c.segs) {
      if (s.kind === 'freeze') { if (Math.abs(t - s.srcStart) < 1e-6) return c.from + s.from; continue; }
      if (t >= s.srcStart - 1e-6 && t <= s.srcEnd + 1e-6) return c.from + s.from + Math.round(((t - s.srcStart) / s.rate) * fps);
    }
    return t < c.srcIn ? c.from : c.from + c.dur;
  };

  const frameOf = (d) => {
    const a = d.anchor;
    if (a.clip) {
      const c = byId[a.clip];
      return outFrameOf(c, a.source_time) + F(d.start_offset || 0);
    }
    return byId[a.between[1]].from + F(d.start_offset || 0);
  };

  // ---- punch_in
  const punches = [];
  for (const d of decisions.filter((x) => x.technique === 'punch_in')) {
    const p = mergeParams(d, presets);
    const c = byId[d.anchor.clip];
    const clipEnd = c.from + c.dur;
    const start = Math.max(c.from, frameOf(d));
    const inF = Math.max(1, F(p.duration));
    let holdF = Math.max(0, F(p.hold));
    const returnF = p.return === 'zoom_out' ? Math.max(1, F(p.return_duration ?? 0.5)) : 0;
    const used = inF + holdF + returnF;
    if (start + used > clipEnd && p.return !== 'keep') {
      holdF = Math.max(0, clipEnd - start - inF - returnF);
      warnings.push(`${d.id}: hiệu ứng vượt hết clip ${c.id}, đã rút hold còn ${(holdF / fps).toFixed(2)}s`);
    }
    punches.push({
      id: d.id, clip: c.id, clipFrom: c.from, clipEnd, start, inF, holdF, returnF,
      endScale: p.end_scale, startScale: p.start_scale ?? 1, easing: p.easing, ret: p.return, anchor: p.anchor_point,
    });
  }

  // ---- punch_out (bắt đầu ở khung đã zoom, lùi dần về 1.0)
  for (const d of decisions.filter((x) => x.technique === 'punch_out')) {
    const p = mergeParams(d, presets);
    const c = byId[d.anchor.clip];
    const start = Math.max(c.from, frameOf(d));
    punches.push({
      id: d.id, clip: c.id, clipFrom: c.from, clipEnd: c.from + c.dur, start, inF: Math.max(1, F(p.duration)), holdF: 0, returnF: 0,
      startScale: p.start_scale, endScale: 1, preScale: p.start_scale, easing: p.easing, ret: 'keep', anchor: p.anchor_point,
    });
  }

  // ---- color_grade_basic, vignette (theo cửa sổ trong clip; duration 0 = hết clip)
  const window = (d, c) => {
    const start = Math.max(c.from, frameOf(d));
    const end = d.duration > 0 ? Math.min(c.from + c.dur, start + F(d.duration)) : c.from + c.dur;
    return { start, end };
  };
  const grades = decisions.filter((x) => x.technique === 'color_grade_basic').map((d) => {
    const p = mergeParams(d, presets);
    const c = byId[d.anchor.clip];
    return { id: d.id, clip: c.id, ...window(d, c), brightness: p.brightness, contrast: p.contrast, saturation: p.saturation, warmth: p.warmth };
  });
  const vignettes = decisions.filter((x) => x.technique === 'vignette').map((d) => {
    const p = mergeParams(d, presets);
    const c = byId[d.anchor.clip];
    return { id: d.id, clip: c.id, ...window(d, c), strength: p.strength, softness: p.softness, rampF: F(p.ramp ?? 0.3) };
  });

  // ---- subtitles (mỗi cue một khối chữ)
  const subs = [];
  for (const d of decisions.filter((x) => x.technique === 'subtitles')) {
    const p = mergeParams(d, presets);
    const c = byId[d.anchor.clip];
    for (const [i, cue] of (p.cues || []).entries()) {
      const from = Math.max(0, outFrameOf(c, cue.source_time));
      const total = Math.min(Math.max(1, F(cue.duration)), totalFrames - from);
      subs.push({ id: `${d.id}.${i + 1}`, from, total, text: cue.text, params: p });
    }
  }

  // ---- slow_push (đẩy chậm liên tục)
  const pushes = [];
  for (const d of decisions.filter((x) => x.technique === 'slow_push')) {
    const p = mergeParams(d, presets);
    const c = byId[d.anchor.clip];
    const clipEnd = c.from + c.dur;
    const start = Math.max(c.from, frameOf(d));
    let dur = p.duration > 0 ? F(p.duration) : clipEnd - start;
    dur = Math.max(1, Math.min(dur, clipEnd - start));
    pushes.push({ id: d.id, clip: c.id, start, dur, startScale: p.start_scale ?? 1, endScale: p.end_scale, easing: p.easing, anchor: p.anchor_point });
  }

  // ---- chuyển cảnh dùng chung (engine: renderer/src/transitions.js; bảng kiểu: lib/transitions.mjs)
  // overlap=true: dùng "tay cầm" (đoạn thừa quanh điểm cắt) của hai clip, không làm đổi tổng độ dài.
  // overlap=false: mỗi bên có hiệu ứng riêng trong thân clip của nó, điểm cắt nằm giữa vùng.
  const transitions = [];
  for (const d of decisions) {
    const spec = TRANSITIONS[d.technique];
    if (!spec) continue;
    const p = { ...mergeParams(d, presets), ...(spec.fixed || {}) };
    const [aId, bId] = d.anchor.between;
    const A = byId[aId], B = byId[bId];
    let h = Math.max(1, Math.round(F(p.duration) / 2));
    if (spec.overlap) {
      const bHandle = Math.floor(B.srcIn * fps);
      const aInfo = sourceInfo[A.videoId];
      const aHandle = aInfo?.duration ? Math.floor((aInfo.duration - A.srcOut) * fps) : h;
      const usable = Math.min(h, bHandle, aHandle);
      if (usable < h) warnings.push(`${d.id}: không đủ "tay cầm" (đoạn thừa quanh điểm cắt) cho ${d.technique} ${p.duration}s, rút còn ${((usable * 2) / fps).toFixed(2)}s`);
      h = usable;
      if (h < 1) { warnings.push(`${d.id}: không có tay cầm, bỏ qua ${d.technique} (thành cắt thẳng)`); continue; }
      A.tailExt = Math.max(A.tailExt, h);
      B.headExt = Math.max(B.headExt, h);
    } else {
      const cap = Math.min(A.dur, B.dur);
      if (h > cap) { warnings.push(`${d.id}: clip quá ngắn cho ${d.technique} ${p.duration}s, rút còn ${((cap * 2) / fps).toFixed(2)}s`); h = cap; }
    }
    transitions.push({
      id: d.id, technique: d.technique, style: spec.style, overlap: spec.overlap, hasOverlay: spec.hasOverlay,
      start: B.from - h, dur: 2 * h, aId, bId, params: p,
    });
  }

  // ---- fade_in_out (hình + tiếng toàn video, xuống/lên màu)
  const fades = [];
  for (const d of decisions.filter((x) => x.technique === 'fade_in_out')) {
    const p = mergeParams(d, presets);
    const at = frameOf(d);
    const total = Math.max(1, F(p.duration));
    const from = p.where === 'in' ? at : Math.max(0, at - total);
    fades.push({ id: d.id, mode: p.where, from, total: Math.min(total, totalFrames - from), color: p.color || '#000000', audio: p.audio !== false });
  }

  // ---- whoosh_synced_cut (SFX gắn vào điểm cắt)
  const sfx = [];
  for (const d of decisions.filter((x) => x.technique === 'whoosh_synced_cut')) {
    const p = mergeParams(d, presets);
    const B = byId[d.anchor.between[1]];
    sfx.push({ id: d.id, file: p.file, from: Math.max(0, B.from + F(p.offset ?? -0.1)), g: Math.pow(10, (p.gain_db ?? -12) / 20) });
  }

  // ---- khối chữ dùng chung (text_pill, text_box, stacked_text, title_card, big_text, marker_highlight)
  const textBlocks = [];
  for (const d of decisions.filter((x) => BLOCK_RULES[x.technique])) {
    const p = mergeParams(d, presets);
    const body = `${blockLines(p).join(' ')} ${p.sub_text || ''}`;
    const inF = F(p.in_duration), outF = F(p.out_duration);
    const holdF = F(p.hold ?? minHold(p, body));
    const from = Math.max(0, frameOf(d));
    let total = inF + holdF + outF;
    if (from + total > totalFrames) { total = totalFrames - from; warnings.push(`${d.id}: khối chữ vượt hết video, đã cắt bớt`); }
    textBlocks.push({ id: d.id, technique: d.technique, from, total, inF, outF, params: p });
  }

  // ---- lower_third
  const lowerThirds = [];
  for (const d of decisions.filter((x) => x.technique === 'lower_third')) {
    const p = mergeParams(d, presets);
    const from = Math.max(0, frameOf(d));
    const total = Math.min(F(d.duration), totalFrames - from);
    lowerThirds.push({ id: d.id, from, total, inF: F(p.in_duration), outF: F(p.out_duration), params: p });
  }

  // ---- kinetic_text
  const texts = [];
  for (const d of decisions.filter((x) => x.technique === 'kinetic_text')) {
    const p = mergeParams(d, presets);
    const inF = F(p.in_duration), outF = F(p.out_duration);
    const holdF = F(p.hold ?? minHold(p, p.text));
    const from = Math.max(0, frameOf(d));
    let total = inF + holdF + outF;
    if (from + total > totalFrames) {
      total = totalFrames - from;
      warnings.push(`${d.id}: chữ vượt hết video, đã cắt bớt`);
    }
    const c = byId[d.anchor.clip];
    if (from + total > c.from + c.dur) warnings.push(`${d.id}: chữ kéo dài qua điểm cắt sang clip sau (hợp lệ nhưng nên kiểm tra khi xem preview)`);
    texts.push({ id: d.id, from, total, inF, outF, params: p });
  }

  // ---- âm thanh clip (base + phần kéo j/l)
  const gainOf = (c) => (c.audio === 'duck' ? 0.251 : 1);
  // Mỗi clip có tiếng cho ra một đoạn tiếng cho từng đoạn hình tốc độ 1x; đoạn đổi tốc độ hoặc đóng băng thì không có tiếng.
  const segs = [];
  const baseFirst = {};
  const baseLast = {};
  for (const c of clips.filter((x) => x.audio !== 'mute')) {
    c.segs.forEach((s, i) => {
      if (s.kind !== 'play' || s.rate !== 1) return;
      const a = {
        key: `${c.id}:b${i}`, videoId: c.videoId, from: c.from + s.from, dur: s.dur, srcFrom: s.srcStart,
        g: gainOf(c), headMute: 0, headRamp: 0, tailAt: 1e9, tailLen: 0,
      };
      segs.push(a);
      if (i === 0) baseFirst[c.id] = a;
      if (i === c.segs.length - 1) baseLast[c.id] = a;
    });
  }
  for (const d of decisions.filter((x) => x.technique === 'j_l_cut')) {
    const p = mergeParams(d, presets);
    const [aId, bId] = d.anchor.between;
    const A = byId[aId], B = byId[bId];
    const cf = Math.max(1, F(p.audio_crossfade ?? 0.12));
    if (p.variant === 'l') {
      let T = F(p.tail);
      const info = sourceInfo[A.videoId];
      if (info?.duration) T = Math.min(T, Math.floor((info.duration - A.srcOut) * fps));
      if (T < 1) { warnings.push(`${d.id}: nguồn ${aId} không còn đủ tiếng sau source_out để kéo L-cut`); continue; }
      if (A.audio !== 'mute') {
        // Nếu clip ngay sau B cùng nguồn và nối liền đúng chỗ tiếng dừng (cắt "che" bằng b-roll) thì không mờ đuôi: tiếng liền mạch.
        const nextClip = clips[clips.indexOf(B) + 1];
        const seamless = nextClip && nextClip.videoId === A.videoId && nextClip.audio !== 'mute'
          && Math.abs(nextClip.srcIn - (A.srcOut + T / fps)) <= 1.5 / fps && T === B.dur;
        segs.push({
          key: `${d.id}:ext`, videoId: A.videoId, from: B.from, dur: T, srcFrom: A.srcOut, g: gainOf(A),
          headMute: 0, headRamp: 0, tailAt: seamless ? 1e9 : Math.max(0, T - cf), tailLen: seamless ? 0 : cf,
        });
      }
      if (baseFirst[bId]) { baseFirst[bId].headMute = T; baseFirst[bId].headRamp = cf; }
      else if (B.audio !== 'mute') warnings.push(`${d.id}: đầu clip ${bId} không có đoạn tiếng tốc độ 1x (đã đổi tốc độ) nên không làm câm được cho L-cut`);
    } else {
      let L = F(p.lead);
      L = Math.min(L, Math.floor(B.srcIn * fps), A.dur);
      if (L < 1) { warnings.push(`${d.id}: ${bId} không còn đủ tiếng trước source_in để kéo J-cut`); continue; }
      if (B.audio !== 'mute') {
        segs.push({
          key: `${d.id}:ext`, videoId: B.videoId, from: B.from - L, dur: L, srcFrom: B.srcIn - L / fps, g: gainOf(B),
          headMute: 0, headRamp: cf, tailAt: 1e9, tailLen: 0,
        });
      }
      if (baseLast[aId]) { baseLast[aId].tailAt = baseLast[aId].dur - L; baseLast[aId].tailLen = cf; }
      else if (A.audio !== 'mute') warnings.push(`${d.id}: cuối clip ${aId} không có đoạn tiếng tốc độ 1x (đã đổi tốc độ) nên J-cut không làm nhỏ tiếng clip trước`);
    }
  }

  // ---- nhạc + ducking
  let music = null;
  const duckDs = decisions.filter((x) => x.technique === 'audio_ducking');
  const musicCfg = edl.audio?.music;
  if (musicCfg && musicCfg.file) {
    const first = duckDs[0] ? mergeParams(duckDs[0], presets) : { base_db: musicCfg.base_db ?? -16, duck_amount_db: musicCfg.duck_amount_db ?? 12, lead: 0.25, attack: 0.3, release: 0.7, merge_gap: 1.0 };
    const baseDb = musicCfg.base_db ?? first.base_db;
    const duck = first.duck_amount_db ?? musicCfg.duck_amount_db ?? 12;
    const leadF = F(first.lead), attF = Math.max(1, F(first.attack)), relF = Math.max(1, F(first.release)), gapF = F(first.merge_gap);
    let regions = duckDs
      .map((d) => ({ s: Math.max(0, frameOf(d)), e: Math.min(totalFrames, Math.max(0, frameOf(d)) + Math.max(1, F(d.duration))) }))
      .sort((a, b) => a.s - b.s);
    const merged = [];
    for (const r of regions) {
      const last = merged[merged.length - 1];
      if (last && r.s - last.e < Math.max(gapF, relF + leadF)) last.e = Math.max(last.e, r.e);
      else merged.push({ ...r });
    }
    const pts = [[0, baseDb]];
    for (const r of merged) {
      const s0 = Math.max(0, r.s - leadF);
      pts.push([s0, baseDb], [s0 + attF, baseDb - duck], [r.e, baseDb - duck], [r.e + relF, baseDb]);
    }
    pts.push([totalFrames, baseDb]);
    // Bảo đảm tăng dần theo frame
    const curveDb = [];
    for (const p of pts) {
      if (curveDb.length && p[0] <= curveDb[curveDb.length - 1][0]) p[0] = curveDb[curveDb.length - 1][0] + 1;
      curveDb.push(p);
    }
    music = { file: musicCfg.file, curveDb };
  }

  // Phông cần nạp (family + độ đậm) cho mọi chữ trong video
  const fontSet = new Map();
  const addFont = (family, weight) => { if (family) fontSet.set(`${family}|${weight}`, { family, weight }); };
  for (const t of texts) addFont(t.params.font_family, t.params.font_weight);
  for (const s of subs) addFont(s.params.font_family, s.params.font_weight);
  for (const tb of textBlocks) { addFont(tb.params.font_family, tb.params.font_weight); if (tb.params.sub_text) addFont(tb.params.sub_font_family || tb.params.font_family, tb.params.sub_font_weight ?? 500); }
  for (const l of lowerThirds) { addFont(l.params.name_font_family, l.params.name_font_weight); addFont(l.params.title_font_family, l.params.title_font_weight); }
  if (transitions.some((tr) => tr.style === 'graphic')) addFont('Inter', 800);
  const fonts = [...fontSet.values()];

  return { fps, totalFrames, clips, punches, pushes, grades, vignettes, subs, texts, lowerThirds, transitions, fades, sfx, fonts, textBlocks, audioSegs: segs, music, warnings };
}
