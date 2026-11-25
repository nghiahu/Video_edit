// Bộ dựng khối chữ dùng chung cho các kỹ thuật: text_pill, text_box, stacked_text, title_card, big_text, marker_highlight.
// Ba lớp: (1) kiểu chữ (màu, gradient, viền, bóng, glow, hộp, vệt bút dạ), (2) bố cục (dòng, so le, căn đều), (3) hoạt ảnh vào/ra.
import React, { useEffect, useState } from 'react';
import { AbsoluteFill, Img, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp01 } from './util.js';
import { fontFamily } from './fonts.js';
import { rand } from './transitions.js';

const easeOut = (t) => 1 - Math.pow(1 - clamp01(t), 3);
const easeInOut = (t) => { const x = clamp01(t); return x * x * (3 - 2 * x); };
const easeOutBack = (t) => { const x = clamp01(t); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };

const POS = {
  top_left: ['flex-start', 'flex-start'], top_center: ['flex-start', 'center'], top_right: ['flex-start', 'flex-end'],
  middle_left: ['center', 'flex-start'], center: ['center', 'center'], middle_right: ['center', 'flex-end'],
  lower_left: ['flex-end', 'flex-start'], lower_middle: ['flex-end', 'center'], lower_right: ['flex-end', 'flex-end'],
};

/** Hoạt ảnh vào: t = tiến độ 0..1. Trả về { opacity, transform, filter, clipPath }. */
function animIn(kind, t, k) {
  const e = easeOut(t);
  switch (kind) {
    case 'fade': return { opacity: e };
    case 'fade_up': return { opacity: e, transform: `translateY(${(1 - e) * 24 * k}px)` };
    case 'fade_down': return { opacity: e, transform: `translateY(${-(1 - e) * 24 * k}px)` };
    case 'slide_left': return { opacity: Math.min(1, e * 1.6), transform: `translateX(${(1 - e) * 140 * k}px)` };
    case 'slide_right': return { opacity: Math.min(1, e * 1.6), transform: `translateX(${-(1 - e) * 140 * k}px)` };
    case 'slide_up': return { opacity: Math.min(1, e * 1.6), transform: `translateY(${(1 - e) * 90 * k}px)` };
    case 'slide_down': return { opacity: Math.min(1, e * 1.6), transform: `translateY(${-(1 - e) * 90 * k}px)` };
    case 'scale_fade': return { opacity: e, transform: `scale(${0.9 + 0.1 * e})` };
    case 'pop': { const s = 0.55 + 0.45 * easeOutBack(t); return { opacity: Math.min(1, t * 3), transform: `scale(${s})` }; }
    case 'mask_wipe': return { clipPath: `inset(-200px ${((1 - easeInOut(t)) * 100).toFixed(2)}% -200px -200px)` };
    case 'blur_in': return { opacity: e, filter: `blur(${((1 - e) * 20 * k).toFixed(1)}px)` };
    case 'rotate_in': return { opacity: e, transform: `rotate(${-(1 - e) * 12}deg) scale(${0.9 + 0.1 * e})` };
    case 'rotate_y': return { opacity: Math.min(1, t * 2.5), transform: `perspective(${900 * k}px) translateX(${(1 - e) * 260 * k}px) rotateY(${(1 - e) * -70}deg) scale(${0.8 + 0.2 * e})` };
    default: return {};
  }
}

/** Hoạt ảnh ra: t = tiến độ thoát 0..1 (0 = còn nguyên, 1 = biến mất). */
function animOut(kind, t, k) {
  const e = easeInOut(t);
  switch (kind) {
    case 'fade': return { opacity: 1 - e };
    case 'slide_left': return { opacity: 1 - e, transform: `translateX(${-e * 140 * k}px)` };
    case 'slide_right': return { opacity: 1 - e, transform: `translateX(${e * 140 * k}px)` };
    case 'slide_up': return { opacity: 1 - e, transform: `translateY(${-e * 90 * k}px)` };
    case 'slide_down': return { opacity: 1 - e, transform: `translateY(${e * 90 * k}px)` };
    case 'scale_fade': return { opacity: 1 - e, transform: `scale(${1 - 0.08 * e})` };
    case 'mask_wipe': return { clipPath: `inset(-200px -200px -200px ${(e * 100).toFixed(2)}%)` };
    case 'none': return {};
    default: return { opacity: 1 - e };
  }
}

const STAGGER = ['letter_stagger', 'letter_scatter', 'word_stagger', 'line_stagger'];

function shadowLayers(p, k) {
  const layers = [];
  const t = p.shadow_type || 'none';
  if (t === 'soft') layers.push([0, 2 * k, (p.shadow_blur ?? 16) * k, p.shadow_color || 'rgba(0,0,0,0.45)']);
  if (t === 'hard') layers.push([(p.shadow_x ?? 4) * k, (p.shadow_y ?? 4) * k, 0, p.shadow_color || '#000']);
  if (t === 'offset3d') {
    const n = p.shadow_depth ?? 8;
    for (let i = 1; i <= n; i++) layers.push([(p.shadow_x ?? 1) * i * k, (p.shadow_y ?? 1) * i * k, 0, p.shadow_color || '#000']);
  }
  if (p.glow_color && p.glow_size > 0) {
    const g = p.glow_size * k;
    layers.push([0, 0, g * 0.5, p.glow_color], [0, 0, g, p.glow_color], [0, 0, g * 2, p.glow_color]);
  }
  return layers;
}

/** Style của một dòng chữ (màu, viền, bóng, gradient...). */
function textStyle(p, k, size, weight, color) {
  const layers = shadowLayers(p, k);
  const gradient = p.gradient_from && p.gradient_to;
  const s = {
    fontFamily: fontFamily(p.font_family),
    fontWeight: weight ?? p.font_weight,
    fontSize: size,
    lineHeight: p.line_height ?? 1.1,
    letterSpacing: `${p.letter_spacing ?? 0}em`,
    textTransform: p.text_transform && p.text_transform !== 'none' ? p.text_transform : 'none',
    color: color ?? p.text_color,
    fontVariantNumeric: p.value !== undefined && p.value !== null && p.value !== '' ? 'tabular-nums' : 'normal',
    whiteSpace: p.fit_width > 0 ? 'pre' : 'pre-wrap', // chữ dài tự xuống dòng; chữ khớp bề ngang thì giữ nguyên một dòng
  };
  if (p.stroke_width > 0) {
    s.WebkitTextStroke = `${p.stroke_width * k}px ${p.stroke_color || '#000'}`;
    s.paintOrder = 'stroke fill';
  }
  if (p.hollow) s.color = 'transparent';
  if (gradient) {
    s.backgroundImage = `linear-gradient(${p.gradient_angle ?? 90}deg, ${p.gradient_from}, ${p.gradient_to})`;
    s.WebkitBackgroundClip = 'text';
    s.backgroundClip = 'text';
    s.color = 'transparent';
    if (layers.length) s.filter = layers.map((l) => `drop-shadow(${l[0]}px ${l[1]}px ${l[2]}px ${l[3]})`).join(' ');
  } else if (layers.length) {
    s.textShadow = layers.map((l) => `${l[0]}px ${l[1]}px ${l[2]}px ${l[3]}`).join(', ');
  }
  return s;
}

// Biểu tượng nhỏ (24×24, đường vẽ kiểu Material Design) dùng cho location_tag và các nhãn có biểu tượng.
const ICONS = {
  pin: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z',
  clock: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z',
  calendar: 'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z',
  user: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  star: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
  check: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
  doc_alert: 'M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5zM11 11h2v5h-2v-5zm0 6h2v2h-2v-2z',
  alert: 'M12 2L1 21h22L12 2zm1 15h-2v-2h2v2zm0-4h-2V9h2v4z',
};

const Icon = ({ name, size, color }) =>
  ICONS[name] ? (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color || 'currentColor'} style={{ display: 'inline-block', verticalAlign: '-0.16em', marginRight: '0.4em', flexShrink: 0 }}>
      <path d={ICONS[name]} />
    </svg>
  ) : null;

// Đuôi bong bóng thoại: ô vuông xoay 45° cùng màu và viền với hộp.
const Tail = ({ p, k }) => {
  const s = (p.tail_size ?? 26) * k;
  const bw = (p.box_border_width ?? 0) * k;
  const bc = `${bw}px solid ${p.box_border_color || '#fff'}`;
  const pos = {
    bottom_left: { left: '16%', bottom: -s / 2, borderRight: bc, borderBottom: bc },
    bottom_center: { left: `calc(50% - ${s / 2}px)`, bottom: -s / 2, borderRight: bc, borderBottom: bc },
    bottom_right: { right: '16%', bottom: -s / 2, borderRight: bc, borderBottom: bc },
    top_left: { left: '16%', top: -s / 2, borderLeft: bc, borderTop: bc },
    top_center: { left: `calc(50% - ${s / 2}px)`, top: -s / 2, borderLeft: bc, borderTop: bc },
    top_right: { right: '16%', top: -s / 2, borderLeft: bc, borderTop: bc },
    left: { left: -s / 2, top: `calc(50% - ${s / 2}px)`, borderLeft: bc, borderBottom: bc },
    right: { right: -s / 2, top: `calc(50% - ${s / 2}px)`, borderRight: bc, borderTop: bc },
  }[p.tail];
  if (!pos) return null;
  return <div style={{ position: 'absolute', width: s, height: s, background: p.box_color, transform: 'rotate(45deg)', ...pos }} />;
};

// Định dạng số kiểu Việt Nam: dấu chấm ngăn nghìn, dấu phẩy thập phân.
function formatNumber(v, decimals, sep) {
  const fixed = Math.abs(v).toFixed(decimals);
  const [int, dec] = fixed.split('.');
  const grouped = sep ? int.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : int;
  return `${v < 0 ? '-' : ''}${grouped}${dec ? `,${dec}` : ''}`;
}

// Dòng chữ của khối. Với big_number (có `value`): số đếm chạy từ count_from đến value; final=true trả về số cuối để đo bề ngang.
function countdownText(p, n) {
  if (p.countdown_format === 'clock') {
    const mm = Math.floor(n / 60), ss = n % 60;
    return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  }
  return String(n);
}
function countdownValue(p, frame, fps) {
  const from = Number(p.countdown_from);
  const step = p.countdown_step ?? 1;
  const el = Math.max(0, frame / fps - (p.countdown_delay ?? 0.2));
  return Math.max(0, from - Math.floor(el / step + 1e-6));
}
function getLines(p, frame, fps, final) {
  if (p.countdown_from !== undefined && p.countdown_from !== null) {
    const n = final ? Number(p.countdown_from) : countdownValue(p, frame, fps);
    return [{ text: n === 0 && p.countdown_end_text ? p.countdown_end_text : countdownText(p, n) }];
  }
  if (p.value !== undefined && p.value !== null && p.value !== '') {
    const to = Number(p.value);
    const from = Number(p.count_from ?? 0);
    const t = final ? 1 : easeOut((frame - (p.count_delay ?? 0.1) * fps) / Math.max(1, (p.count_duration ?? 1.2) * fps));
    const v = from + (to - from) * clamp01(t);
    const sep = p.thousands_sep === undefined ? '.' : p.thousands_sep;
    return [{ text: `${p.prefix ?? ''}${formatNumber(v, p.decimals ?? 0, sep)}${p.suffix ?? ''}` }];
  }
  const raw = Array.isArray(p.lines) && p.lines.length ? p.lines : String(p.text ?? '').split('\n');
  return raw.map((l) => (typeof l === 'string' ? { text: l } : l)).filter((l) => String(l.text ?? '').trim());
}

// Đo độ rộng chữ bằng canvas (sau khi phông nạp xong) để chữ khớp bề ngang khung.
function useFitSize(p, lines, W, k) {
  const need = p.fit_width > 0;
  const [size, setSize] = useState(null);
  const [handle] = useState(() => (need ? delayRender('fit-text') : null));
  useEffect(() => {
    if (!need) return;
    const fam = fontFamily(p.font_family);
    const longest = lines.reduce((a, b) => (String(a.text).length >= String(b.text).length ? a : b), { text: '' }).text;
    const txt = p.text_transform === 'uppercase' ? String(longest).toUpperCase() : String(longest);
    document.fonts.load(`${p.font_weight} 100px ${fam}`, txt).then(() => document.fonts.ready).then(() => {
      const ctx = document.createElement('canvas').getContext('2d');
      ctx.font = `${p.font_weight} 100px ${fam}`;
      const w100 = ctx.measureText(txt).width + (p.letter_spacing ?? 0) * 100 * Math.max(0, txt.length - 1);
      const px = ((p.fit_width * W) / Math.max(1, w100)) * 100;
      setSize(Math.min(px, (p.max_font_size ?? 600) * k));
      continueRender(handle);
    });
  }, []);
  return need ? size : null;
}

export const TextBlock = ({ b, height }) => {
  const frame = useCurrentFrame();
  const { width: W, height: Hh, fps } = useVideoConfig();
  const p = b.params;
  // Preset viết cho khung 1080p ngang; khung dọc lấy cạnh ngắn để chữ không tràn bề ngang.
  const k = Math.min(W, Hh) / 1080 * (height / Hh);
  const lines = getLines(p, frame, fps, false);
  const fit = useFitSize(p, getLines(p, 0, fps, true), W, k);
  const baseSize = (fit ?? p.font_size) * (fit ? 1 : k);

  const inT = clamp01(frame / Math.max(1, b.inF));
  const outT = clamp01((frame - (b.total - b.outF)) / Math.max(1, b.outF));
  const stagger = STAGGER.includes(p.in_animation);
  const boxedAtStart = p.box_style && p.box_style !== 'none';
  const fxIn = stagger ? (p.in_animation === 'line_stagger' && boxedAtStart ? animIn('fade', inT, k) : {}) : animIn(p.in_animation, inT, k);
  const fxOut = animOut(p.out_animation, outT, k);
  const wrapStyle = {
    opacity: (fxIn.opacity ?? 1) * (fxOut.opacity ?? 1),
    transform: [fxIn.transform, fxOut.transform, p.rotate ? `rotate(${p.rotate}deg)` : null].filter(Boolean).join(' ') || 'none',
    filter: [fxIn.filter, fxOut.filter].filter(Boolean).join(' ') || 'none',
    clipPath: fxIn.clipPath || fxOut.clipPath || 'none',
    transformOrigin: 'center',
  };
  if (p.countdown_from !== undefined && p.countdown_from !== null) {
    const step = p.countdown_step ?? 1;
    const el = Math.max(0, frame / fps - (p.countdown_delay ?? 0.2));
    const phase = el % step;
    const n = countdownValue(p, frame, fps);
    const pop = (p.countdown_pop ?? 0.2) * (1 - easeOut(phase / 0.3)) * (n === 0 ? 1.5 : 1);
    wrapStyle.transform = [wrapStyle.transform === 'none' ? null : wrapStyle.transform, `scale(${1 + pop})`].filter(Boolean).join(' ');
  }

  // Kích thước từng dòng: line_scales (theo thứ tự) hoặc căn đều theo số ký tự (justify)
  const chars = lines.map((l) => Math.max(1, String(l.text).length));
  const scales = lines.map((l, i) => {
    if (l.scale) return l.scale;
    if (p.justify) { const ref = chars.reduce((s, c) => s + c, 0) / chars.length; return Math.min(2.2, Math.max(0.55, ref / chars[i])); }
    return p.line_scales?.[i] ?? 1;
  });
  const offsets = lines.map((l, i) => p.line_offsets_em?.[i] ?? 0);

  // Hộp nền
  const boxed = p.box_style && p.box_style !== 'none';
  const padX = (p.box_padding_x ?? 0) * k, padY = (p.box_padding_y ?? 0) * k;
  const boxStyle = {};
  if (boxed) {
    boxStyle.background = p.box_color || 'transparent';
    boxStyle.padding = `${padY}px ${padX}px`;
    const bw = (p.box_border_width ?? 0) * k;
    if (p.box_style === 'pill') boxStyle.borderRadius = 9999;
    else if (p.box_style === 'rounded') boxStyle.borderRadius = (p.box_radius ?? 14) * k;
    else if (p.box_style === 'rect') boxStyle.borderRadius = 0;
    else if (p.box_style === 'bubble') boxStyle.borderRadius = (p.box_radius ?? 28) * k;
    else if (p.box_style === 'bar_left') { boxStyle.borderLeft = `${Math.max(bw, 6 * k)}px solid ${p.box_border_color || '#fff'}`; boxStyle.borderRadius = 0; }
    else if (p.box_style === 'underline') { boxStyle.background = 'transparent'; boxStyle.borderBottom = `${Math.max(bw, 5 * k)}px solid ${p.box_border_color || '#fff'}`; }
    if (bw > 0 && ['pill', 'rounded', 'rect', 'bubble'].includes(p.box_style)) boxStyle.border = `${bw}px solid ${p.box_border_color || '#fff'}`;
    if (p.box_shadow) boxStyle.boxShadow = p.box_shadow;
  }

  // Vệt bút dạ: tô nền một phần dưới chữ, lớn dần theo thời gian
  const markerOn = !!p.marker_color;
  const markerProg = markerOn ? easeInOut((frame - (p.marker_delay ?? 0.15) * fps) / Math.max(1, (p.marker_duration ?? 0.4) * fps)) : 0;
  // Từ khóa tô sáng: mỗi cụm trong highlight_words tách thành từng từ; các từ liền nhau được gộp vào MỘT vệt chung (không hở ở dấu cách)
  const hl = new Set((p.highlight_words || []).flatMap((w) => String(w).toLowerCase().split(/\s+/).filter(Boolean)));
  const markAll = markerOn && hl.size === 0;
  const markerBg = () => `linear-gradient(to bottom, transparent ${p.marker_top ?? 48}%, ${p.marker_color} ${p.marker_top ?? 48}%, ${p.marker_color} ${p.marker_bottom ?? 94}%, transparent ${p.marker_bottom ?? 94}%)`;
  const markerSpan = () => ({
    display: 'inline-block',
    backgroundImage: markerBg(),
    backgroundRepeat: 'no-repeat',
    backgroundSize: `${(markerProg * 100).toFixed(1)}% 100%`,
    padding: `0 ${(p.marker_pad_x ?? 10) * k}px`,
    margin: `0 ${-(p.marker_pad_x ?? 10) * k * 0.5}px`,
    ...(p.marker_skew ? { transform: `skewX(${p.marker_skew}deg)` } : {}),
  });

  const renderWords = (text, st, lineIdx) => {
    const parts = String(text).split(/(\s+)/);
    const isHlWord = (w) => hl.has(w.toLowerCase().replace(/[.,!?;:]/g, ''));
    const flags = parts.map((w, i) => (/^\s*$/.test(w) ? !markAll && markerOn && i > 0 && i < parts.length - 1 && isHlWord(parts[i - 1]) && isHlWord(parts[i + 1]) : isHlWord(w)));
    let unit = 0;
    const renderPart = (w, i) => {
      const style = { display: 'inline-block', whiteSpace: 'pre' };
      if (/^\s+$/.test(w)) return <span key={i} style={style}>{w}</span>;
      if (flags[i] && p.highlight_color) style.color = p.highlight_color;
      if (p.in_animation === 'letter_stagger') {
        return (
          <span key={i} style={style}>
            {[...w].map((c, j) => {
              const f = animIn('fade_up', (frame - (unit++) * (p.stagger ?? 1.2)) / Math.max(1, b.inF * 0.5), k);
              return <span key={j} style={{ display: 'inline-block', opacity: f.opacity ?? 0, transform: f.transform }}>{c}</span>;
            })}
          </span>
        );
      }
      if (p.in_animation === 'letter_scatter') {
        const sp = (p.scatter_spread ?? 140) * k;
        const tt = clamp01((frame - (p.scatter_delay ?? 0.05) * fps) / Math.max(1, (p.scatter_duration ?? 0.5) * fps));
        const e2 = easeOut(tt);
        return (
          <span key={i} style={style}>
            {[...w].map((c, j) => {
              const id = (unit++) + lineIdx * 53;
              const dx = (rand(id * 7 + 1, 11) - 0.5) * 2 * sp, dy = (rand(id * 7 + 2, 12) - 0.5) * 2 * sp, rot = (rand(id * 7 + 3, 13) - 0.5) * 120;
              return <span key={j} style={{ display: 'inline-block', opacity: Math.min(1, tt * 3), transform: `translate(${(dx * (1 - e2)).toFixed(1)}px, ${(dy * (1 - e2)).toFixed(1)}px) rotate(${(rot * (1 - e2)).toFixed(1)}deg)` }}>{c}</span>;
            })}
          </span>
        );
      }
      if (p.in_animation === 'word_stagger') {
        const f = animIn('fade_up', (frame - (lineIdx * 6 + (unit++) * 4 * (p.stagger ?? 1))) / Math.max(1, b.inF * 0.6), k);
        return <span key={i} style={{ ...style, opacity: f.opacity ?? 0, transform: f.transform }}>{w}</span>;
      }
      return <span key={i} style={style}>{w}</span>;
    };
    // Gộp các phần được tô liên tiếp vào một vệt
    const out = [];
    let i = 0;
    while (i < parts.length) {
      if (markerOn && !markAll && flags[i]) {
        let j = i;
        while (j < parts.length && flags[j]) j++;
        out.push(<span key={`m${i}`} style={markerSpan()}>{parts.slice(i, j).map((w, n) => renderPart(w, i + n))}</span>);
        i = j;
      } else {
        out.push(renderPart(parts[i], i));
        i++;
      }
    }
    return out;
  };

  // Nền phía sau chữ (title card): làm tối, làm mờ hoặc phủ màu đặc
  const env = Math.min(easeOut(inT), 1 - easeInOut(outT));
  let backdrop = null;
  if (p.bg_mode && p.bg_mode !== 'none') {
    const bs = { opacity: env };
    if (p.bg_mode === 'solid') bs.background = p.bg_color || '#000';
    else { bs.background = `rgba(${p.bg_rgb || '0,0,0'},${p.bg_opacity ?? 0.45})`; if (p.bg_mode === 'blur') { bs.backdropFilter = `blur(${(p.blur_px ?? 18) * k}px)`; bs.WebkitBackdropFilter = bs.backdropFilter; } }
    backdrop = <AbsoluteFill style={bs} />;
  }

  const [jc, ai] = POS[p.position] || POS.center;
  const m = p.margin ?? 6;
  const lower = (p.position || '').startsWith('lower');
  const container = {
    justifyContent: jc, alignItems: ai, textAlign: (p.align && p.align !== 'auto') ? p.align : (ai === 'center' ? 'center' : ai === 'flex-end' ? 'right' : 'left'),
    // CSS % của padding tính theo bề rộng. Khung ngang giữ nguyên cách cũ; khung dọc: lề trên/dưới theo chiều cao, lề hai bên tối đa 6% để chữ không bị ép hẹp.
    ...(W >= Hh
      ? { padding: `${m}%`, paddingBottom: lower ? `${p.margin_bottom ?? 12}%` : `${m}%` }
      : { paddingTop: (m / 100) * Hh, paddingBottom: ((lower ? (p.margin_bottom ?? 12) : m) / 100) * Hh, paddingLeft: `${Math.min(m, 6)}%`, paddingRight: `${Math.min(m, 6)}%` }),
  };

  // ===== Đợt 4: đánh máy, giải mã, glitch =====
  const NFC = (s) => String(s).normalize('NFC');
  const lineChars = lines.map((l) => [...NFC(l.text)]);
  const lineOffsets = [];
  let totalChars = 0;
  for (const c of lineChars) { lineOffsets.push(totalChars); totalChars += c.length; }
  // Đánh máy: số ký tự đã hiện (toàn khối, theo thứ tự dòng); chữ chưa hiện vẫn chiếm chỗ (trong suốt) nên bố cục không nhảy
  const typeDur = p.type_duration > 0 ? p.type_duration : totalChars / Math.max(1, p.type_speed ?? 16);
  const shown = p.typewriter ? Math.floor(clamp01((frame - (p.type_delay ?? 0.1) * fps) / Math.max(1, typeDur * fps)) * totalChars + 1e-4) : totalChars;
  const typing = p.typewriter && shown < totalChars;
  const caretOn = p.typewriter && p.caret && (typing || (p.caret_blink > 0 ? Math.floor(frame / Math.max(1, fps / (2 * p.caret_blink))) % 2 === 0 : true));
  const typedLine = (i) => {
    const chs = lineChars[i];
    const off = lineOffsets[i];
    const nodes = chs.map((c, j) => (
      <span key={j} style={{ opacity: off + j < shown ? 1 : 0 }}>{c}</span>
    ));
    // Con trỏ không chiếm chỗ: đặt sau ký tự cuối đã hiện (nếu thuộc dòng này)
    const caretIdx = shown - off;
    if (caretOn && caretIdx >= 0 && caretIdx <= chs.length && (caretIdx < chs.length || i === lineChars.length - 1)) {
      nodes.splice(Math.min(caretIdx, chs.length), 0, (
        <span key="caret" style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 0, top: 0, color: p.caret_color || p.text_color, WebkitTextStroke: 0 }}>{p.caret_char || '|'}</span>
        </span>
      ));
    }
    return nodes;
  };
  // Giải mã: ký tự nhảy ngẫu nhiên rồi chốt đúng lần lượt từ trái sang phải
  const scramblePool = [...(p.scramble_chars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@')];
  const scrambleLine = (i) => lineChars[i].map((c, j) => {
    const idx = lineOffsets[i] + j;
    if (/\s/.test(c)) return <span key={j}>{c}</span>;
    const settle = (p.scramble_delay ?? 0.1) * fps + (idx / Math.max(1, totalChars - 1)) * (p.scramble_duration ?? 0.9) * fps;
    if (frame >= settle) return <span key={j}>{c}</span>;
    const tick = Math.floor(frame / Math.max(1, fps / (p.scramble_rate ?? 24)));
    const r = scramblePool[Math.floor(rand(tick * 131 + idx * 17, 3) * scramblePool.length)];
    return (
      <span key={j} style={{ position: 'relative', display: 'inline-block' }}>
        <span style={{ opacity: 0 }}>{c}</span>
        <span style={{ position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)', opacity: 0.92 }}>{r}</span>
      </span>
    );
  });
  // Glitch: từng đợt nhiễu ngắn (xác định theo frame): lệch kênh màu, rung ngang, vài dải cắt lệch
  const glTick = Math.floor(frame / 2);
  const gPat = Array.isArray(p.glitch_pattern) && p.glitch_pattern.length ? p.glitch_pattern : null;
  // Có glitch_pattern: nháy đúng các đoạn [bắt đầu, kết thúc] (giây, tính từ đầu khối), ngoài đoạn là chữ sạch; glitch_vanish: chữ biến mất sau đoạn cuối
  if (p.glitch && gPat && p.glitch_vanish && frame >= gPat[gPat.length - 1][1] * fps) return null;
  const glActive = !!p.glitch && (gPat ? gPat.some(([s, e]) => frame >= s * fps && frame < e * fps) : rand(glTick, 31) < (p.glitch_rate ?? 0.35));
  const glMain = glActive ? { split: (p.glitch_split ?? 8) * k * (0.5 + rand(glTick, 32)) } : null;
  const glJitter = glActive ? (rand(glTick, 33) - 0.5) * 2 * (p.glitch_jitter ?? 10) * k : 0;
  const glSlices = glActive
    ? Array.from({ length: p.glitch_slices ?? 2 }, (_, s) => ({ top: rand(glTick, 40 + s) * 80, h: 6 + rand(glTick, 50 + s) * 14, dx: (rand(glTick, 60 + s) - 0.5) * 2 * (p.glitch_jitter ?? 10) * 3 * k }))
    : [];

  // ===== Chữ cắt xén: nền màu phủ khung, chữ là "cửa sổ" nhìn xuyên thấy video =====
  if (p.cutout) {
    const size = baseSize;
    const n = lines.length;
    const lh = (p.line_height ?? 1) * size;
    const txt = (s) => (p.text_transform === 'uppercase' ? NFC(s).toUpperCase() : NFC(s));
    // Lao vào chữ: scale chạy từ cutout_scale_from đến cutout_scale_to suốt thời gian khối quanh điểm (cutout_focus_x, cutout_focus_y); mặc định 1→1 thì chỉ có cú phóng nhẹ lúc vào
    const sFrom = p.cutout_scale_from ?? 1, sTo = p.cutout_scale_to ?? 1;
    const uu = clamp01(frame / Math.max(1, b.total));
    const ez = p.cutout_scale_ease === 'in' ? Math.pow(uu, 2.2) : p.cutout_scale_ease === 'linear' ? uu : p.cutout_scale_ease === 'inout' ? (uu < 0.5 ? 2 * uu * uu : 1 - Math.pow(-2 * uu + 2, 2) / 2) : 1 - Math.pow(1 - uu, 3);
    const sc = sTo !== sFrom ? sFrom + (sTo - sFrom) * ez : 1 + 0.25 * (1 - easeOut(inT));
    const fx = (p.cutout_focus_x ?? 0.5) * W, fy = (p.cutout_focus_y ?? 0.5) * Hh;
    const ow = (p.cutout_outline_width ?? 0) * k;
    const Hc = Hh;
    const texts = lines.map((l, i) => {
      const y = Hc / 2 + (i - (n - 1) / 2) * lh;
      return (
        <text key={i} x={W / 2} y={y} textAnchor="middle" dominantBaseline="central" fontFamily={fontFamily(p.font_family)} fontWeight={p.font_weight} fontSize={size * (scales[i] ?? 1)} letterSpacing={`${p.letter_spacing ?? 0}em`}>
          {txt(l.text)}
        </text>
      );
    });
    return (
      <AbsoluteFill>
        <svg width={W} height={Hc} style={{ position: 'absolute', left: 0, top: 0 }}>
          <defs>
            <mask id={`cut-${b.id}`}>
              <rect width={W} height={Hc} fill="white" />
              <g fill="black" transform={`translate(${fx} ${fy}) scale(${sc}) translate(${-fx} ${-fy})`}>{texts}</g>
            </mask>
          </defs>
          <rect width={W} height={Hc} fill={p.cutout_color || '#0F172A'} fillOpacity={(p.cutout_opacity ?? 0.92) * env} mask={`url(#cut-${b.id})`} />
          {ow > 0 ? (
            <g fill="none" stroke={p.cutout_outline_color || '#fff'} strokeWidth={ow} strokeLinejoin="round" opacity={env} transform={`translate(${fx} ${fy}) scale(${sc}) translate(${-fx} ${-fy})`}>{texts}</g>
          ) : null}
        </svg>
      </AbsoluteFill>
    );
  }

  // ===== Chữ chạy theo đường cong =====
  if (p.path_shape && p.path_shape !== 'none') {
    const Hc = Hh;
    const pw = (p.path_width ?? 0.8) * W;
    const x0 = (W - pw) / 2, x1 = x0 + pw;
    const y0 = (p.path_y ?? 0.5) * Hc;
    const c = (p.path_curve ?? 0.3) * Hc;
    let d;
    if (p.path_shape === 'arc_up') d = `M ${x0} ${y0} Q ${W / 2} ${y0 - 2 * c} ${x1} ${y0}`;
    else if (p.path_shape === 'arc_down') d = `M ${x0} ${y0} Q ${W / 2} ${y0 + 2 * c} ${x1} ${y0}`;
    else if (p.path_shape === 'wave') d = `M ${x0} ${y0} Q ${x0 + pw * 0.25} ${y0 - 2 * c} ${x0 + pw * 0.5} ${y0} T ${x1} ${y0}`;
    else { const r = pw / 2; d = `M ${W / 2 - r} ${y0} A ${r} ${r} 0 1 1 ${W / 2 + r} ${y0} A ${r} ${r} 0 1 1 ${W / 2 - r} ${y0}`; }
    const txt = (p.text_transform === 'uppercase' ? NFC(lines.map((l) => l.text).join(' ')).toUpperCase() : NFC(lines.map((l) => l.text).join(' ')));
    const sh = shadowLayers(p, k).map((l) => `drop-shadow(${l[0]}px ${l[1]}px ${l[2]}px ${l[3]})`).join(' ');
    // Chữ chạy dần ra từ một phía: path_reveal start (từ đầu đường) hoặc end (từ cuối đường); mỗi ký tự hiện nối tiếp, cả chuỗi trượt nhẹ dọc đường
    const rv = p.path_reveal === 'start' || p.path_reveal === 'end' ? p.path_reveal : null;
    const rprog = rv ? clamp01((frame - (p.path_reveal_delay ?? 0.1) * fps) / Math.max(1, (p.path_reveal_duration ?? 0.9) * fps)) : 1;
    const rez = 1 - Math.pow(1 - rprog, 2);
    const baseOff = p.path_shape === 'circle' ? 25 : 50;
    const slideOff = rv ? (rv === 'start' ? -1 : 1) * (p.path_reveal_slide ?? 0.06) * 100 * (1 - rez) : 0;
    const rch = [...txt];
    const edge = 3;
    const front = rez * (rch.length + edge);
    const revealChars = rv ? rch.map((c, i) => {
      const idx = rv === 'start' ? i : rch.length - 1 - i;
      const o = clamp01((front - idx) / edge);
      return <tspan key={i} fillOpacity={o} strokeOpacity={o}>{c}</tspan>;
    }) : txt;
    return (
      <AbsoluteFill>
        {backdrop}
        <div style={{ ...wrapStyle, position: 'absolute', inset: 0 }}>
          <svg width={W} height={Hc} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', filter: sh || undefined }}>
            <defs><path id={`path-${b.id}`} d={d} /></defs>
            <text fontFamily={fontFamily(p.font_family)} fontWeight={p.font_weight} fontSize={p.font_size * k} letterSpacing={`${p.letter_spacing ?? 0}em`} fill={p.hollow ? 'none' : p.text_color} stroke={p.stroke_width > 0 ? (p.stroke_color || '#000') : (p.hollow ? p.text_color : 'none')} strokeWidth={p.stroke_width > 0 ? p.stroke_width * k : (p.hollow ? 3 * k : 0)} paintOrder="stroke fill">
              <textPath href={`#path-${b.id}`} startOffset={`${baseOff + slideOff}%`} textAnchor="middle">{revealChars}</textPath>
            </text>
          </svg>
        </div>
      </AbsoluteFill>
    );
  }

  // Nội dung khối (hộp + dấu ngoặc kép + dòng chữ + dòng phụ + đuôi bong bóng)
  const buildInner = (glx) => (
    <div style={{ ...boxStyle, display: 'inline-block', position: 'relative' }}>
      {p.quote_mark ? (
        <div style={{ fontFamily: fontFamily(p.quote_font_family || 'Playfair Display'), fontWeight: 700, fontSize: (p.quote_mark_size ?? 160) * k, lineHeight: 0.8, height: (p.quote_mark_size ?? 160) * k * 0.5, color: p.quote_mark_color || '#F2C14E' }}>
          {'“'}
        </div>
      ) : null}
      {lines.map((l, i) => {
        const st = textStyle(p, k, baseSize * scales[i], l.weight, l.color);
        if (p.ghost_x) { const gk = 1 - easeOut(inT / Math.max(0.05, p.ghost_time ?? 1)); if (gk > 0.01) st.textShadow = [st.textShadow, ...[1, 2, 3].map((n) => `${(-n * p.ghost_x * k * gk).toFixed(1)}px 0 ${p.ghost_color || 'rgba(255,255,255,0.5)'}`)].filter(Boolean).join(', '); }
        if (glx && glx.split) st.textShadow = [st.textShadow, `${-glx.split}px 0 rgba(255,0,60,0.85)`, `${glx.split}px 0 rgba(0,229,255,0.85)`].filter(Boolean).join(', ');
        const delay = p.item_delay != null ? i * p.item_delay * fps : i * 6 * (p.stagger ?? 1);
        // line_slide: 'left' | 'right' = từng dòng chạy vào từ mép khung bên đó (cần in_animation line_stagger).
        const lineT = clamp01((frame - delay) / Math.max(1, b.inF * 0.7));
        const slideDir = p.line_slide === 'right' ? 1 : -1;
        const lineFx = p.in_animation === 'line_stagger'
          ? (p.line_slide
            ? { opacity: Math.min(1, easeOut(lineT) * 2.2), transform: `translateX(${slideDir * (1 - easeOut(lineT)) * (p.line_slide_distance ?? 900) * k}px)` }
            : animIn('fade_up', (frame - delay) / Math.max(1, b.inF * 0.7), k))
          : {};
        const words = p.typewriter ? typedLine(i) : p.scramble ? scrambleLine(i) : markAll ? <span style={markerSpan()}>{renderWords(l.text, st, i)}</span> : renderWords(l.text, st, i);
        // Gạch ngang có hoạt ảnh (strike_list): vạch chạy từ trái sang, chữ mờ dần sau khi bị gạch
        const strikeOn = p.strike && (!Array.isArray(p.strike_lines) || p.strike_lines.includes(i));
        const stT = strikeOn ? easeInOut((frame - ((p.strike_delay ?? 0.6) + i * (p.strike_item_delay ?? 0.6)) * fps) / Math.max(1, (p.strike_duration ?? 0.35) * fps)) : 0;
        const wordsS = strikeOn ? (
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{ opacity: 1 - (1 - (p.strike_dim ?? 0.55)) * stT }}>{words}</span>
            <span style={{ position: 'absolute', left: '-3%', top: '54%', height: Math.max(2, (p.strike_width ?? 6) * k), width: `${(106 * stT).toFixed(2)}%`, background: p.strike_color || '#E3232F', borderRadius: 999, transform: 'translateY(-50%) rotate(-2deg)', transformOrigin: 'left center' }} />
          </span>
        ) : words;
        const hasBullet = p.bullet && p.bullet !== 'none';
        const bulletEl = hasBullet ? (
          <span style={{ color: p.bullet_color || p.text_color, flexShrink: 0, minWidth: '1.1em', textAlign: 'center', WebkitTextStroke: 0 }}>{p.bullet === 'number' ? `${i + 1}.` : p.bullet}</span>
        ) : null;
        const iconEl = i === 0 && p.icon && p.icon !== 'none' ? <Icon name={p.icon} size={st.fontSize * 0.95} color={p.icon_color || p.text_color} /> : null;
        const lineStyle = { ...st, paddingLeft: `${offsets[i]}em`, opacity: lineFx.opacity ?? 1, transform: lineFx.transform, marginTop: i > 0 ? (p.line_gap ?? 0) * k : 0 };
        if (hasBullet) Object.assign(lineStyle, { display: 'flex', alignItems: 'baseline', gap: '0.5em' });
        return (
          <div key={i} style={lineStyle}>
            {bulletEl}
            {iconEl}
            {hasBullet ? <span style={{ whiteSpace: 'pre-wrap' }}>{wordsS}</span> : wordsS}
          </div>
        );
      })}
      {p.sub_text ? (
        <div style={{ ...textStyle({ ...p, stroke_width: 0, shadow_type: p.shadow_type, glow_size: 0, gradient_from: null, hollow: false, value: undefined }, k, (p.sub_font_size ?? 36) * k, p.sub_font_weight ?? 500, p.sub_color ?? p.text_color), fontFamily: fontFamily(p.sub_font_family || p.font_family), marginTop: (p.sub_gap ?? 12) * k, opacity: 0.9 }}>
          {p.sub_text}
        </div>
      ) : null}
      {p.box_style === 'bubble' && p.tail && p.tail !== 'none' ? <Tail p={p} k={k} /> : null}
      {p.badge_text ? (() => {
        const bs = (p.badge_size ?? 64) * k;
        const c = p.badge_corner || 'top_left';
        const pos = { position: 'absolute', width: bs, height: bs, [c.startsWith('top') ? 'top' : 'bottom']: -bs * 0.45, [c.endsWith('left') ? 'left' : 'right']: -bs * 0.35 };
        const bp = easeOut((frame - (p.badge_delay ?? 0.15) * fps) / Math.max(1, 0.25 * fps));
        return <div style={{ ...pos, borderRadius: 9999, background: p.badge_color || '#E5B506', color: p.badge_text_color || '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fontFamily(p.font_family), fontWeight: 900, fontSize: bs * 0.7, lineHeight: 1, boxShadow: '0 4px 12px rgba(0,0,0,0.25)', transform: `scale(${0.4 + 0.6 * bp})`, opacity: Math.min(1, bp * 2), WebkitTextStroke: 0, textShadow: 'none' }}>{p.badge_text}</div>;
      })() : null}
    </div>
  );
  const innerPlain = buildInner(null);
  const inner0 = p.glitch ? (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div style={{ transform: `translateX(${glJitter}px)` }}>{glActive ? buildInner(glMain) : innerPlain}</div>
      {glSlices.map((s, n) => (
        <div key={n} style={{ position: 'absolute', left: 0, top: 0, width: '100%', clipPath: `inset(${s.top}% 0 ${Math.max(0, 100 - s.top - s.h)}% 0)`, transform: `translateX(${s.dx}px)` }}>{innerPlain}</div>
      ))}
    </div>
  ) : innerPlain;
  const sweepT = p.sweep_line ? clamp01(frame / Math.max(1, (p.sweep_duration ?? 0.4) * fps)) : 1;
  const inner = p.sweep_line ? (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div style={{ clipPath: `inset(-40px ${((1 - easeInOut(sweepT)) * 100).toFixed(2)}% -40px 0)` }}>{inner0}</div>
      {sweepT < 1 ? <div style={{ position: 'absolute', top: '-4%', bottom: '-4%', left: `${(easeInOut(sweepT) * 100).toFixed(2)}%`, width: (p.sweep_width ?? 5) * k, background: p.sweep_color || '#FFFFFF', boxShadow: '0 0 12px rgba(255,255,255,0.8)' }} /> : null}
    </div>
  ) : inner0;

  // ===== Đợt 3: chữ theo lời nói (cần mốc theo từ: b.words = [{ text, s, e }] giây tính từ đầu khối) =====
  if (p.words_mode && b.words && b.words.length) {
    const t = frame / fps;
    const WS = b.words;
    const kwSet = new Set((p.highlight_words || []).flatMap((w) => String(w).toLowerCase().split(/\s+/)).filter(Boolean));
    const normW = (s) => String(s).toLowerCase().replace(/[.,!?;:"“”]/g, '');
    const isKw = (w) => kwSet.has(normW(w.text));
    const popAt = (s) => (p.word_pop === false || t < s ? 1 : 1 + (p.word_pop_amount ?? 0.14) * (1 - easeOut((t - s) / 0.18)));
    const kwColor = p.highlight_color || '#FFD84D';
    const st0 = textStyle(p, k, baseSize, undefined, undefined);
    const sp = <span style={{ whiteSpace: 'pre' }}> </span>;
    let content = null;
    if (p.words_mode === 'karaoke' || p.words_mode === 'highlight') {
      content = WS.map((w, i) => {
        const active = t >= w.s && t < w.e;
        const done = t >= w.e;
        let color = p.text_color, opacity = 1, scale = 1;
        if (p.words_mode === 'karaoke') {
          if (active) { color = p.karaoke_active_color || '#FFD84D'; scale = popAt(w.s); }
          else if (done) color = p.karaoke_done_color || p.text_color;
          else opacity = p.karaoke_upcoming_opacity ?? 0.45;
        } else if (isKw(w) && t >= w.s) { color = kwColor; scale = popAt(w.s); }
        return (
          <React.Fragment key={i}>
            <span style={{ display: 'inline-block', whiteSpace: 'pre', color, opacity, transform: `scale(${scale})` }}>{w.text}</span>
            {i < WS.length - 1 ? sp : null}
          </React.Fragment>
        );
      });
    } else if (p.words_mode === 'by_word') {
      const replace = !!p.word_replace;
      content = WS.map((w, i) => {
        const nextS = i < WS.length - 1 ? WS[i + 1].s : Infinity;
        const shownNow = replace ? t >= w.s && t < nextS : t >= w.s;
        const color = isKw(w) ? kwColor : p.text_color;
        return (
          <React.Fragment key={i}>
            <span style={{ display: replace && !shownNow ? 'none' : 'inline-block', whiteSpace: 'pre', color, opacity: shownNow ? Math.min(1, (t - w.s) / 0.1 + 0.001) : 0, transform: `scale(${shownNow ? popAt(w.s) : 1})` }}>{w.text}</span>
            {!replace && i < WS.length - 1 ? sp : null}
          </React.Fragment>
        );
      });
    } else if (p.words_mode === 'chunks') {
      const size = p.chunk_size ?? 2;
      const chunks = [];
      for (let i = 0; i < WS.length; i += size) { const g = WS.slice(i, i + size); chunks.push({ words: g, s: g[0].s, e: g[g.length - 1].e }); }
      let ci = -1;
      chunks.forEach((c, i) => { if (t >= c.s) ci = i; });
      const cur = chunks[ci];
      if (cur && t < cur.e + (p.chunk_linger ?? 0.5)) {
        content = cur.words.map((w, i) => (
          <React.Fragment key={i}>
            <span style={{ display: 'inline-block', whiteSpace: 'pre', color: isKw(w) ? kwColor : p.text_color }}>{w.text}</span>
            {i < cur.words.length - 1 ? sp : null}
          </React.Fragment>
        ));
        st0.transform = `scale(${popAt(cur.s)})`;
      }
    }
    return (
      <AbsoluteFill>
        {backdrop}
        <AbsoluteFill style={container}>
          <div style={{ ...wrapStyle, maxWidth: p.max_width_percent ? `${p.max_width_percent}%` : '88%' }}>
            {content ? (
              <div style={{ ...boxStyle, display: 'inline-block' }}>
                <div style={st0}>{content}</div>
              </div>
            ) : null}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  // ===== Thanh tiến độ =====
  if (p.progress_to !== undefined && p.progress_to !== null) {
    const pr = clamp01(p.progress_to) * easeInOut((frame - (p.progress_delay ?? 0.2) * fps) / Math.max(1, (p.progress_duration ?? 1.5) * fps));
    const bh = (p.bar_height ?? 18) * k;
    const fill = p.bar_color_to ? `linear-gradient(90deg, ${p.bar_color || '#F2C14E'}, ${p.bar_color_to})` : (p.bar_color || '#F2C14E');
    const lineSt = textStyle(p, k, baseSize, undefined, undefined);
    return (
      <AbsoluteFill>
        {backdrop}
        <AbsoluteFill style={container}>
          <div style={{ ...wrapStyle, width: `${(p.bar_width ?? 0.5) * 100}%` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: (p.label_gap ?? 12) * k }}>
              <div style={lineSt}>{lines[0]?.text}</div>
              {p.show_percent ? <div style={{ ...lineSt, fontVariantNumeric: 'tabular-nums' }}>{Math.round(pr * 100)}%</div> : null}
            </div>
            <div style={{ height: bh, borderRadius: (p.bar_radius ?? 999) * k, background: p.bar_track_color || 'rgba(255,255,255,0.25)', overflow: 'hidden' }}>
              <div style={{ width: `${(pr * 100).toFixed(2)}%`, height: '100%', background: fill, borderRadius: (p.bar_radius ?? 999) * k }} />
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  // ===== Cuộn tên (credits): nội dung trôi từ mép dưới lên hết mép trên với tốc độ cố định =====
  if (p.credits) {
    const speed = (p.roll_speed ?? 90) * k;
    const y = Hh - (frame / fps) * speed;
    const fs0 = baseSize;
    const maskG = 'linear-gradient(to bottom, transparent 0, #000 12%, #000 88%, transparent 100%)';
    return (
      <AbsoluteFill style={{ overflow: 'hidden', WebkitMaskImage: maskG, maskImage: maskG }}>
        {backdrop}
        <div style={{ position: 'absolute', left: `${(1 - (p.credits_width ?? 0.6)) * 50}%`, width: `${(p.credits_width ?? 0.6) * 100}%`, top: 0, transform: `translateY(${y}px)`, opacity: wrapStyle.opacity }}>
          {lines.map((l, i) => {
            const raw = String(l.text);
            if (raw.startsWith('## ')) {
              const st = { ...textStyle(p, k, fs0 * 0.55, p.credits_heading_weight ?? 600, p.credits_heading_color || '#F2C14E'), textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.18em', marginTop: i === 0 ? 0 : (p.credits_group_gap ?? 1.2) * fs0 };
              return <div key={i} style={st}>{raw.slice(3)}</div>;
            }
            const parts = raw.split('|').map((s) => s.trim());
            const st = textStyle(p, k, fs0, undefined, undefined);
            if (parts.length >= 2) {
              return (
                <div key={i} style={{ ...st, display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '0.9em' }}>
                  <div style={{ textAlign: 'right', opacity: 0.7 }}>{parts[0]}</div>
                  <div style={{ textAlign: 'left' }}>{parts[1]}</div>
                </div>
              );
            }
            return <div key={i} style={{ ...st, textAlign: 'center' }}>{raw}</div>;
          })}
        </div>
      </AbsoluteFill>
    );
  }

  const at = (sec) => frame - sec * fps;
  const plainSt = (size, weight, color) => textStyle({ ...p, stroke_width: 0, shadow_type: 'none', glow_size: 0, gradient_from: null, hollow: false }, k, size, weight, color);

  // ===== Thẻ so sánh A vs B: mỗi dòng một thẻ "tiêu đề|chú thích"; thẻ thắng bật sáng ở winner_at =====
  if (p.compare) {
    const cards = lines.map((l) => String(l.text).split('|').map((x) => x.trim()));
    const win = p.compare_winner ?? -1;
    const winT = win >= 0 ? easeOut(at(p.winner_at ?? 1.4) / Math.max(1, 0.35 * fps)) : 0;
    const accent = p.accent_color || '#E3232F';
    const cw = (p.card_width ?? 0.4) * W;
    return (
      <AbsoluteFill>
        {backdrop}
        <AbsoluteFill style={container}>
          <div style={{ opacity: wrapStyle.opacity, filter: wrapStyle.filter, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: (p.card_gap ?? 20) * k }}>
            {cards.map((c, i) => {
              const fx = animIn(p.in_animation === 'none' ? 'fade' : (p.in_animation || 'pop'), at(i * (p.item_delay ?? 0.45)) / Math.max(1, b.inF), k);
              const isWin = i === win;
              const dim = win >= 0 && !isWin ? 1 - 0.5 * winT : 1;
              const sc = isWin ? 1 + 0.07 * winT : 1 - 0.05 * winT;
              const tc = isWin && winT > 0.5 ? (p.win_text_color || '#FFFFFF') : p.text_color;
              return (
                <React.Fragment key={i}>
                  {i > 0 ? <div style={{ ...plainSt(baseSize * 0.62, 900, p.vs_color || '#FFFFFF'), opacity: fx.opacity ?? 1, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{p.vs_text ?? 'vs'}</div> : null}
                  <div style={{ position: 'relative', width: cw, padding: `${(p.box_padding_y ?? 28) * k}px ${(p.box_padding_x ?? 22) * k}px`, borderRadius: (p.box_radius ?? 22) * k, background: p.card_color || '#FFFFFF', border: `${Math.max(1, (p.box_border_width ?? 3) * k)}px solid ${isWin && winT > 0 ? accent : (p.box_border_color || 'rgba(0,0,0,0.12)')}`, overflow: 'hidden', textAlign: 'center', opacity: (fx.opacity ?? 1) * dim, transform: `${fx.transform || ''} scale(${sc.toFixed(4)})`, boxShadow: isWin ? `0 0 ${(36 * k * winT).toFixed(1)}px ${accent}` : (p.box_shadow || '0 8px 24px rgba(0,0,0,0.25)') }}>
                    {isWin ? <div style={{ position: 'absolute', inset: 0, background: accent, opacity: winT }} /> : null}
                    <div style={{ position: 'relative', ...plainSt(baseSize, 800, tc) }}>{c[0]}</div>
                    {c[1] ? <div style={{ position: 'relative', marginTop: 8 * k, ...plainSt((p.sub_font_size ?? 30) * k, 600, isWin && winT > 0.5 ? tc : (p.sub_color || p.text_color)), opacity: 0.85 }}>{c[1]}</div> : null}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  // ===== Nét vẽ tay tự vẽ: mũi tên, đường, vòng tròn, gạch chân (draw_points theo tỉ lệ khung) =====
  if (p.draw) {
    const shape = p.draw_shape || 'arrow';
    const P0 = (p.draw_points || []).map(([x, y]) => [x * W, y * Hh]);
    let pts = [];
    if (shape === 'circle' && P0.length >= 2) {
      const rx = Math.abs(p.draw_points[1][0] - p.draw_points[0][0]) * W, ry = Math.abs(p.draw_points[1][1] - p.draw_points[0][1]) * Hh;
      for (let a = 0; a <= 1.1; a += 0.025) { const t = a * 2 * Math.PI - Math.PI * 0.6; pts.push([P0[0][0] + rx * Math.cos(t), P0[0][1] + ry * Math.sin(t)]); }
    } else {
      for (let i = 0; i < P0.length - 1; i++) for (let j = 0; j < 10; j++) { const u = j / 10; pts.push([P0[i][0] + (P0[i + 1][0] - P0[i][0]) * u, P0[i][1] + (P0[i + 1][1] - P0[i][1]) * u]); }
      if (P0.length) pts.push(P0[P0.length - 1]);
    }
    const wob = (p.draw_wobble ?? 3) * k;
    pts = pts.map(([x, y], i) => (i === 0 || i === pts.length - 1 ? [x, y] : [x + (rand(i * 3 + 1, 21) - 0.5) * 2 * wob, y + (rand(i * 3 + 2, 22) - 0.5) * 2 * wob]));
    let d = pts.length ? `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}` : '';
    for (let i = 1; i < pts.length - 1; i++) { const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2; d += ` Q${pts[i][0].toFixed(1)},${pts[i][1].toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)}`; }
    if (pts.length > 1) d += ` L${pts[pts.length - 1][0].toFixed(1)},${pts[pts.length - 1][1].toFixed(1)}`;
    const prog = easeInOut(at(p.draw_delay ?? 0.1) / Math.max(1, (p.draw_duration ?? 0.8) * fps));
    const col = p.line_color || '#E3232F';
    const lw = (p.line_width ?? 6) * k;
    let head = null;
    if (shape === 'arrow' && P0.length >= 2) {
      const [ax, ay] = P0[P0.length - 1], [bx, by] = P0[P0.length - 2];
      const ang = Math.atan2(ay - by, ax - bx), hl = (p.arrow_size ?? 34) * k;
      const hp = easeOut((prog - 0.85) / 0.15);
      const l1 = [ax - hl * hp * Math.cos(ang - 0.5), ay - hl * hp * Math.sin(ang - 0.5)], l2 = [ax - hl * hp * Math.cos(ang + 0.5), ay - hl * hp * Math.sin(ang + 0.5)];
      head = hp > 0 ? <path d={`M${l1[0].toFixed(1)},${l1[1].toFixed(1)} L${ax.toFixed(1)},${ay.toFixed(1)} L${l2[0].toFixed(1)},${l2[1].toFixed(1)}`} fill="none" stroke={col} strokeWidth={lw} strokeLinecap="round" strokeLinejoin="round" /> : null;
    }
    const lx = (p.label_x ?? (P0.length ? P0[0][0] / W : 0.5)) * W, ly = (p.label_y ?? (P0.length ? P0[0][1] / Hh - 0.04 : 0.5)) * Hh;
    const lab = lines[0] && String(lines[0].text).trim();
    return (
      <AbsoluteFill style={{ opacity: Math.min(1, 1 - easeInOut(outT)) }}>
        <svg width={W} height={Hh} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <path d={d} pathLength={1} fill="none" stroke={col} strokeWidth={lw} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - prog} style={{ filter: p.draw_shadow === false ? 'none' : 'drop-shadow(0 2px 3px rgba(0,0,0,0.35))' }} />
          {head}
        </svg>
        {lab ? (
          <div style={{ position: 'absolute', left: lx, top: ly, transform: 'translate(-50%, -100%)', maxWidth: `${p.max_width_percent ?? 60}%` }}>
            <div style={wrapStyle}>{inner}</div>
          </div>
        ) : null}
      </AbsoluteFill>
    );
  }

  // ===== Kêu gọi mạng xã hội: thẻ kênh có nút Follow được bấm, hoặc ô bình luận đang gõ =====
  if (p.cta) {
    const accent = p.accent_color || '#E3232F';
    const clickF = (p.click_at ?? 1.4) * fps;
    const clicked = frame >= clickF;
    const curT = easeInOut((frame - (clickF - 0.7 * fps)) / Math.max(1, 0.6 * fps));
    const press = clicked && frame < clickF + 0.15 * fps ? 0.9 : 1;
    const cursor = (
      <svg width={34 * k} height={34 * k} viewBox="0 0 24 24" style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(${((1 - curT) * 140 * k).toFixed(1)}px, ${((1 - curT) * 110 * k).toFixed(1)}px) scale(${press})`, opacity: frame > clickF - 0.8 * fps ? 1 : 0, filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.4))' }}>
        <path d="M4 2l16 9-7 1.6L9.5 20z" fill="#FFFFFF" stroke="#111111" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    );
    const card = { position: 'relative', display: 'flex', alignItems: 'center', gap: 16 * k, padding: `${18 * k}px ${22 * k}px`, borderRadius: (p.box_radius ?? 20) * k, background: p.card_color || '#FFFFFF', boxShadow: p.box_shadow || '0 10px 30px rgba(0,0,0,0.3)', width: `${(p.card_width ?? 0.8) * 100}%`, boxSizing: 'border-box' };
    const name = lines[0] ? String(lines[0].text) : '';
    if (p.cta === 'follow') {
      const av = 64 * k;
      return (
        <AbsoluteFill>
          {backdrop}
          <AbsoluteFill style={container}>
            <div style={{ ...wrapStyle, width: '100%', display: 'flex', justifyContent: 'center' }}>
              <div style={card}>
                <div style={{ width: av, height: av, borderRadius: 999, background: accent, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', ...plainSt(av * 0.5, 800, '#FFFFFF') }}>{(p.avatar_text || name.trim()[0] || '•').toUpperCase()}</div>
                <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <div style={plainSt(baseSize, 800, p.text_color)}>{name}</div>
                  {p.sub_text ? <div style={{ ...plainSt((p.sub_font_size ?? 26) * k, 500, p.sub_color || '#6B7280') }}>{p.sub_text}</div> : null}
                </div>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ padding: `${10 * k}px ${22 * k}px`, borderRadius: 999, background: clicked ? (p.done_color || '#E5E7EB') : accent, transform: `scale(${press})`, ...plainSt((p.button_font_size ?? 28) * k, 800, clicked ? '#111111' : '#FFFFFF') }}>{clicked ? (p.button_done ?? 'Đã follow') : (p.button_text ?? 'Follow')}</div>
                  {cursor}
                </div>
              </div>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      );
    }
    // cta === 'comment': nhãn phía trên (sub_text), ô nhập gõ dần chữ, bấm gửi
    const typeF = (p.type_at ?? 0.4) * fps;
    const nChars = Math.max(0, Math.min(name.length, Math.floor(((frame - typeF) / fps) * (p.type_speed ?? 14))));
    const typed = [...name].slice(0, nChars).join('');
    const sent = clicked;
    return (
      <AbsoluteFill>
        {backdrop}
        <AbsoluteFill style={container}>
          <div style={{ ...wrapStyle, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 * k }}>
            {p.sub_text ? <div style={plainSt((p.sub_font_size ?? 30) * k, 700, p.sub_color || '#FFFFFF')}>{p.sub_text}</div> : null}
            {sent ? (
              <div style={{ ...card, opacity: easeOut((frame - clickF) / Math.max(1, 0.3 * fps)) }}>
                <div style={{ width: 44 * k, height: 44 * k, borderRadius: 999, background: accent, flexShrink: 0 }} />
                <div style={{ textAlign: 'left', ...plainSt(baseSize, 600, p.text_color) }}>{name}</div>
              </div>
            ) : (
              <div style={card}>
                <div style={{ flex: 1, textAlign: 'left', ...plainSt(baseSize, 500, typed ? p.text_color : '#9CA3AF') }}>{typed || (p.placeholder ?? 'Thêm bình luận...')}{typed && nChars < name.length ? '|' : ''}</div>
                <div style={{ position: 'relative', width: 52 * k, height: 52 * k, borderRadius: 999, background: nChars >= name.length ? accent : '#D1D5DB', flexShrink: 0, transform: `scale(${press})` }}>
                  <svg viewBox="0 0 24 24" width="60%" height="60%" style={{ position: 'absolute', left: '20%', top: '20%' }}><path d="M3 20l18-8L3 4v6l12 2-12 2z" fill="#FFFFFF" /></svg>
                  {cursor}
                </div>
              </div>
            )}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  // ===== Ảnh bay quanh người nói: quạt (fan), quỹ đạo (orbit), dải chạy (strip), lưới (grid) =====
  if (Array.isArray(p.images) && p.images.length) {
    const n = p.images.length;
    const lay = p.image_layout || 'fan';
    const iw = (p.image_width ?? 0.24) * W, ih = iw * (p.image_aspect ?? 1.5);
    const cx = (p.image_center?.[0] ?? 0.5) * W, cy = (p.image_center?.[1] ?? 0.2) * Hh;
    const R = (p.image_radius ?? 0.42) * W;
    const t = frame / fps;
    const gap = 14 * k;
    const items = p.images.map((src, i) => {
      let x = cx, y = cy, rot = 0;
      const u = n > 1 ? i / (n - 1) : 0.5;
      if (lay === 'fan') { const a = ((p.image_spread ?? 70) * (u - 0.5) * Math.PI) / 180; x = cx + R * Math.sin(a); y = cy + R * (1 - Math.cos(a)) * 0.9; rot = (a * 180) / Math.PI * 0.7; }
      else if (lay === 'orbit') { const a = (2 * Math.PI * i) / n + t * (p.orbit_speed ?? 0.25); x = cx + R * Math.cos(a); y = cy + R * 0.45 * Math.sin(a); rot = Math.cos(a) * 6; }
      else if (lay === 'strip') { const span = n * (iw + gap); x = ((i * (iw + gap) - t * (p.strip_speed ?? 120) * k) % span + span) % span - span / 2 + cx + iw / 2; rot = 0; }
      else { const cols = Math.ceil(Math.sqrt(n)), rows = Math.ceil(n / cols), c = i % cols, r = Math.floor(i / cols); x = cx + (c - (cols - 1) / 2) * (iw + gap); y = cy + (r - (rows - 1) / 2) * (ih + gap); rot = (rand(i, 31) - 0.5) * 6; }
      const fx = animIn('pop', at(i * (p.item_delay ?? 0.12)) / Math.max(1, b.inF), k);
      const bob = lay === 'strip' ? 0 : Math.sin(t * 1.6 + i * 1.3) * 6 * k;
      return (
        <div key={i} style={{ position: 'absolute', left: x - iw / 2, top: y - ih / 2 + bob, width: iw, height: ih, transform: `rotate(${rot.toFixed(2)}deg) ${fx.transform || ''}`, opacity: fx.opacity ?? 1, borderRadius: (p.box_radius ?? 14) * k, overflow: 'hidden', border: `${Math.max(1, (p.image_border ?? 4) * k)}px solid #FFFFFF`, boxShadow: '0 8px 22px rgba(0,0,0,0.35)', background: '#222' }}>
          <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      );
    });
    const lab = lines[0] && String(lines[0].text).trim();
    return (
      <AbsoluteFill style={{ opacity: 1 - easeInOut(outT) }}>
        {backdrop}
        {items}
        {lab ? <AbsoluteFill style={container}><div style={wrapStyle}>{inner}</div></AbsoluteFill> : null}
      </AbsoluteFill>
    );
  }

  // ===== Bảng so sánh: dòng đầu là tiêu đề cột; các ô cách nhau bằng dấu | =====
  if (p.table) {
    const rows = lines.map((l) => String(l.text).split('|').map((s) => s.trim()));
    const hasHead = p.table_header !== false;
    const ncol = Math.max(...rows.map((r) => r.length));
    const firstW = p.table_first_col ?? 1.3;
    const cols = Array.from({ length: ncol }, (_, i) => (i === 0 ? `${firstW}fr` : '1fr')).join(' ');
    const rp = (p.table_row_padding ?? 16) * k;
    const hi = p.table_highlight_col ?? -1;
    return (
      <AbsoluteFill>
        {backdrop}
        <AbsoluteFill style={container}>
          <div style={{ ...wrapStyle, width: `${(p.table_width ?? 0.7) * 100}%` }}>
            <div style={{ background: p.table_bg || 'rgba(15,23,42,0.9)', borderRadius: (p.box_radius ?? 18) * k, overflow: 'hidden', boxShadow: p.box_shadow || undefined }}>
              {rows.map((r, ri) => {
                const head = hasHead && ri === 0;
                const di = hasHead ? ri - 1 : ri;
                const rowAt = !head && Array.isArray(p.row_times) && p.row_times[di] != null ? p.row_times[di] * fps : Math.max(0, di) * (p.item_delay ?? 0.25) * fps + b.inF * 0.5;
                const fx = head ? {} : animIn('fade_up', (frame - rowAt) / Math.max(1, b.inF * 0.7), k);
                return (
                  <div key={ri} style={{ display: 'grid', gridTemplateColumns: cols, background: head ? (p.table_header_bg || '#F2C14E') : (p.table_row_bg || 'transparent'), borderTop: ri > 0 ? `${Math.max(1, 2 * k)}px solid ${p.table_line_color || 'rgba(255,255,255,0.18)'}` : 'none', opacity: fx.opacity ?? 1, transform: fx.transform }}>
                    {Array.from({ length: ncol }, (_, ci) => {
                      const st = textStyle({ ...p, stroke_width: 0, shadow_type: 'none', glow_size: 0, gradient_from: null, hollow: false }, k, baseSize, head ? 800 : (ci === 0 ? 600 : p.font_weight), head ? (p.table_header_color || '#0F172A') : (ci === hi ? (p.highlight_color || p.text_color) : p.text_color));
                      return (
                        (() => {
                          // Thay ô: cell_changes = [{ row (hàng dữ liệu, từ 0), col, text, at (giây) }]; ô đổi có chớp nền nhấn
                          const ch = head || !Array.isArray(p.cell_changes) ? null : p.cell_changes.filter((c) => c.row === di && c.col === ci && frame >= c.at * fps).sort((a, b2) => b2.at - a.at)[0];
                          const since = ch ? (frame - ch.at * fps) / fps : 9;
                          const flash = since < 0.6 ? 1 - since / 0.6 : 0;
                          const swap = since < 0.25 ? easeOut(since / 0.25) : 1;
                          return (
                            <div key={ci} style={{ ...st, padding: `${rp}px ${rp * 1.2}px`, textAlign: ci === 0 ? 'left' : 'center', background: flash > 0 ? `rgba(${p.change_rgb || '227,35,47'},${(0.35 * flash).toFixed(3)})` : (!head && ci === hi ? (p.table_highlight_bg || 'rgba(242,193,78,0.18)') : 'transparent') }}>
                              <span style={{ display: 'inline-block', opacity: swap, transform: `translateY(${((1 - swap) * 10 * k).toFixed(1)}px)` }}>{ch ? ch.text : (r[ci] ?? '')}</span>
                            </div>
                          );
                        })()
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  // Callout: nhãn đặt tại (label_x, label_y), đường chỉ vẽ dần tới (target_x, target_y), đầu mút là mũi tên, chấm hoặc vòng
  if (p.target_x !== undefined && p.target_x !== null) {
    const lx = (p.label_x ?? 0.3) * W, ly = (p.label_y ?? 0.25) * Hh;
    const tx = p.target_x * W, ty = (p.target_y ?? 0.5) * Hh;
    const len = Math.max(1, Math.hypot(tx - lx, ty - ly));
    const prog = easeOut((frame - (p.line_delay ?? 0.15) * fps) / Math.max(1, (p.line_duration ?? 0.45) * fps));
    const lw = (p.line_width ?? 4) * k;
    const col = p.line_color || '#F2C14E';
    const ang = Math.atan2(ty - ly, tx - lx);
    const ah = 34 * k;
    const arrow = `${tx},${ty} ${tx - ah * Math.cos(ang - 0.45)},${ty - ah * Math.sin(ang - 0.45)} ${tx - ah * Math.cos(ang + 0.45)},${ty - ah * Math.sin(ang + 0.45)}`;
    const style = p.line_style || 'arrow';
    const lineOpacity = Math.min(env, 1);
    return (
      <AbsoluteFill>
        {backdrop}
        <svg width={W} height={Hh} style={{ position: 'absolute', left: 0, top: 0, opacity: lineOpacity }}>
          <line x1={lx} y1={ly} x2={tx} y2={ty} stroke={col} strokeWidth={lw} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - prog)} />
          {prog > 0.98 && style === 'arrow' ? <polygon points={arrow} fill={col} /> : null}
          {prog > 0.98 && style === 'dot' ? <circle cx={tx} cy={ty} r={9 * k} fill={col} /> : null}
          {prog > 0.98 && style === 'ring' ? <circle cx={tx} cy={ty} r={(p.ring_radius ?? 36) * k} fill="none" stroke={col} strokeWidth={lw} /> : null}
        </svg>
        <div style={{ position: 'absolute', left: lx, top: ly, transform: 'translate(-50%, -50%)', maxWidth: `${p.max_width_percent ?? 40}%` }}>
          <div style={wrapStyle}>{inner}</div>
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill>
      {backdrop}
      <AbsoluteFill style={container}>
        <div style={{ ...wrapStyle, maxWidth: p.fit_width > 0 ? 'none' : (p.max_width_percent ? `${p.max_width_percent}%` : '88%') }}>
          {inner}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
