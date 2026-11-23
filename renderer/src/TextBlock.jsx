// Bộ dựng khối chữ dùng chung cho các kỹ thuật: text_pill, text_box, stacked_text, title_card, big_text, marker_highlight.
// Ba lớp: (1) kiểu chữ (màu, gradient, viền, bóng, glow, hộp, vệt bút dạ), (2) bố cục (dòng, so le, căn đều), (3) hoạt ảnh vào/ra.
import React, { useEffect, useState } from 'react';
import { AbsoluteFill, continueRender, delayRender, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp01 } from './util.js';
import { fontFamily } from './fonts.js';

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

const STAGGER = ['letter_stagger', 'word_stagger', 'line_stagger'];

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

function getLines(p) {
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
  const { width: W, fps } = useVideoConfig();
  const p = b.params;
  const k = height / 1080;
  const lines = getLines(p);
  const fit = useFitSize(p, lines, W, k);
  const baseSize = (fit ?? p.font_size) * (fit ? 1 : k);

  const inT = clamp01(frame / Math.max(1, b.inF));
  const outT = clamp01((frame - (b.total - b.outF)) / Math.max(1, b.outF));
  const stagger = STAGGER.includes(p.in_animation);
  const fxIn = stagger ? {} : animIn(p.in_animation, inT, k);
  const fxOut = animOut(p.out_animation, outT, k);
  const wrapStyle = {
    opacity: (fxIn.opacity ?? 1) * (fxOut.opacity ?? 1),
    transform: [fxIn.transform, fxOut.transform, p.rotate ? `rotate(${p.rotate}deg)` : null].filter(Boolean).join(' ') || 'none',
    filter: [fxIn.filter, fxOut.filter].filter(Boolean).join(' ') || 'none',
    clipPath: fxIn.clipPath || fxOut.clipPath || 'none',
    transformOrigin: 'center',
  };

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
    else if (p.box_style === 'bar_left') { boxStyle.borderLeft = `${Math.max(bw, 6 * k)}px solid ${p.box_border_color || '#fff'}`; boxStyle.borderRadius = 0; }
    else if (p.box_style === 'underline') { boxStyle.background = 'transparent'; boxStyle.borderBottom = `${Math.max(bw, 5 * k)}px solid ${p.box_border_color || '#fff'}`; }
    if (bw > 0 && ['pill', 'rounded', 'rect'].includes(p.box_style)) boxStyle.border = `${bw}px solid ${p.box_border_color || '#fff'}`;
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
    padding: `${m}%`, paddingBottom: lower ? `${p.margin_bottom ?? 12}%` : `${m}%`,
  };

  return (
    <AbsoluteFill>
      {backdrop}
      <AbsoluteFill style={container}>
        <div style={{ ...wrapStyle, maxWidth: p.fit_width > 0 ? 'none' : (p.max_width_percent ? `${p.max_width_percent}%` : '88%') }}>
          <div style={{ ...boxStyle, display: 'inline-block' }}>
            {lines.map((l, i) => {
              const st = textStyle(p, k, baseSize * scales[i], l.weight, l.color);
              const lineFx = p.in_animation === 'line_stagger' ? animIn('fade_up', (frame - i * 6 * (p.stagger ?? 1)) / Math.max(1, b.inF * 0.7), k) : {};
              return (
                <div key={i} style={{ ...st, paddingLeft: `${offsets[i]}em`, opacity: lineFx.opacity ?? 1, transform: lineFx.transform }}>
                  {markAll ? <span style={markerSpan()}>{renderWords(l.text, st, i)}</span> : renderWords(l.text, st, i)}
                </div>
              );
            })}
            {p.sub_text ? (
              <div style={{ ...textStyle({ ...p, stroke_width: 0, shadow_type: p.shadow_type, glow_size: 0, gradient_from: null, hollow: false }, k, (p.sub_font_size ?? 36) * k, p.sub_font_weight ?? 500, p.sub_color ?? p.text_color), fontFamily: fontFamily(p.sub_font_family || p.font_family), marginTop: (p.sub_gap ?? 12) * k, opacity: 0.9 }}>
                {p.sub_text}
              </div>
            ) : null}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
