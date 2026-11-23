// Engine chuyển cảnh dùng chung (hàm thuần, chạy trong composition).
// Một transition = vùng [start, start+dur) quanh điểm cắt. p = tiến độ 0..1 trên cả vùng.
//  - overlap=true : clip A (kéo dài sau điểm cắt) và clip B (kéo dài trước điểm cắt) cùng hiện trong cả vùng.
//  - overlap=false: A chỉ hiện nửa đầu (p<0.5), B chỉ hiện nửa sau (p>=0.5); mỗi bên có hiệu ứng riêng (q: 0..1 trong nửa của nó).
import { clamp01 } from './util.js';

const smooth = (t) => t * t * (3 - 2 * t);
const EASE = {
  linear: (t) => t,
  ease_in: (t) => t * t * t,
  ease_out: (t) => 1 - Math.pow(1 - t, 3),
  ease_in_out: smooth,
};
export const ease = (name, t) => (EASE[name] || smooth)(clamp01(t));

// Số giả ngẫu nhiên có tính xác định theo frame (render lại luôn ra kết quả giống nhau).
export const rand = (n, salt = 0) => {
  const x = Math.sin((n + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const DIR = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] };
const dirOf = (p, def = 'left') => DIR[p.direction || def] || DIR[def];

function shapePoints(shape, cx, cy, r) {
  const pts = [];
  const poly = (n, rot = -Math.PI / 2, inner = 1) => {
    const m = n * (inner < 1 ? 2 : 1);
    for (let i = 0; i < m; i++) {
      const rr = inner < 1 && i % 2 === 1 ? r * inner : r;
      const a = rot + (i * 2 * Math.PI) / m;
      pts.push(`${(cx + rr * Math.cos(a)).toFixed(1)}px ${(cy + rr * Math.sin(a)).toFixed(1)}px`);
    }
  };
  if (shape === 'diamond') poly(4);
  else if (shape === 'hexagon') poly(6, 0);
  else if (shape === 'triangle') poly(3);
  else if (shape === 'star') poly(5, -Math.PI / 2, 0.42);
  else return null;
  return `polygon(${pts.join(',')})`;
}

/** Hiệu ứng áp lên một clip trong một transition. Trả về null nếu clip không bị ảnh hưởng ở frame này. */
export function clipFx(tr, role, abs, W, H) {
  const p = clamp01((abs - tr.start) / tr.dur);
  const par = tr.params || {};
  const k = H / 1080;
  const e = (t) => ease(par.easing, t);
  const out = { style: {}, svg: null };
  const S = out.style;
  let q = p;
  if (!tr.overlap) {
    if (role === 'a' && p >= 0.5) return null;
    if (role === 'b' && p < 0.5) return null;
    q = role === 'a' ? p * 2 : (p - 0.5) * 2;
  } else if (abs < tr.start || abs >= tr.start + tr.dur) return null;

  const [dx, dy] = dirOf(par, 'left');
  const pct = (v) => `${(v * 100).toFixed(3)}%`;

  switch (tr.style) {
    case 'dissolve':
      if (role === 'b') S.opacity = e(p);
      break;
    case 'additive':
      if (role === 'a') S.opacity = p < 0.5 ? 1 : 1 - e((p - 0.5) * 2);
      else { S.opacity = Math.min(1, e(Math.min(1, p * 2))); S.mixBlendMode = 'plus-lighter'; }
      break;
    case 'blur_dissolve': {
      const bm = (par.blur ?? 24) * k;
      if (role === 'a') S.filter = `blur(${(bm * e(p)).toFixed(1)}px)`;
      else { S.opacity = e(p); S.filter = `blur(${(bm * (1 - e(p))).toFixed(1)}px)`; }
      break;
    }
    case 'morph':
      if (role === 'b') { S.opacity = e(p); S.transform = `scale(${1 + 0.03 * (1 - e(p))})`; S.filter = `blur(${((par.blur ?? 3) * k * (1 - e(p))).toFixed(1)}px)`; }
      else S.filter = `blur(${((par.blur ?? 3) * k * e(p)).toFixed(1)}px)`;
      break;
    case 'dip':
      break; // chỉ có lớp phủ màu (xem overlayFx)
    case 'whip': {
      const horiz = par.axis !== 'y';
      const [vx, vy] = horiz ? [dx, 0] : [0, dy || -1];
      const size = horiz ? W : H;
      const bm = (par.blur ?? 36) * k;
      const t = role === 'a' ? ease('ease_in', q) : 1 - ease('ease_out', q);
      const sign = role === 'a' ? 1 : -1;
      const off = (horiz ? vx : vy) * sign * t * (par.travel ?? 1.15) * size;
      S.transform = horiz ? `translateX(${off.toFixed(1)}px)` : `translateY(${off.toFixed(1)}px)`;
      S.filter = `blur(${(bm * (role === 'a' ? ease('ease_in', q) : 1 - q)).toFixed(1)}px)`;
      break;
    }
    case 'slide':
      // B trượt vào đè lên A (A đứng yên, tối nhẹ)
      if (role === 'b') S.transform = `translate(${pct(-dx * (1 - e(p)))}, ${pct(-dy * (1 - e(p)))})`;
      else S.filter = `brightness(${1 - 0.35 * e(p)})`;
      break;
    case 'push':
      if (role === 'a') S.transform = `translate(${pct(dx * e(p))}, ${pct(dy * e(p))})`;
      else S.transform = `translate(${pct(-dx * (1 - e(p)))}, ${pct(-dy * (1 - e(p)))})`;
      break;
    case 'swipe':
      // A trượt đi để lộ B đứng yên bên dưới
      if (role === 'a') { S.transform = `translate(${pct(dx * e(p))}, ${pct(dy * e(p))})`; S.zIndex = 2; S.boxShadow = '0 0 60px rgba(0,0,0,0.5)'; }
      else { S.zIndex = 1; S.transform = `scale(${0.96 + 0.04 * e(p)})`; }
      break;
    case 'wipe': {
      if (role !== 'b') break;
      const soft = par.softness ?? 0;
      const v = e(p);
      const deg = { right: 90, left: 270, down: 180, up: 0 }[par.direction || 'right'] ?? 90;
      if (soft > 0) {
        const pos = v * (100 + soft) - soft;
        S.maskImage = S.WebkitMaskImage = `linear-gradient(${deg}deg, #000 ${pos.toFixed(2)}%, transparent ${(pos + soft).toFixed(2)}%)`;
      } else {
        const r = (1 - v) * 100;
        S.clipPath = { right: `inset(0 ${r}% 0 0)`, left: `inset(0 0 0 ${r}%)`, down: `inset(0 0 ${r}% 0)`, up: `inset(${r}% 0 0 0)` }[par.direction || 'right'];
      }
      break;
    }
    case 'zoom': {
      const zm = par.zoom ?? 2.2;
      const bm = (par.blur ?? 30) * k;
      if (role === 'a') {
        const t = ease('ease_in', q);
        S.transform = `scale(${1 + (zm - 1) * t})`; S.filter = `blur(${(bm * t).toFixed(1)}px) brightness(${1 + 0.4 * t})`;
      } else {
        const t = ease('ease_out', q);
        S.transform = `scale(${1 + (zm - 1) * (1 - t)})`; S.filter = `blur(${(bm * (1 - t)).toFixed(1)}px) brightness(${1 + 0.4 * (1 - t)})`;
      }
      break;
    }
    case 'spin':
    case 'roll': {
      const ang = (par.angle ?? (tr.style === 'spin' ? 90 : 20)) * (par.direction === 'left' ? -1 : 1);
      const sc = par.scale ?? (tr.style === 'spin' ? 1.4 : 1.2);
      const bm = (par.blur ?? (tr.style === 'spin' ? 16 : 8)) * k;
      // Phóng tối thiểu để khung xoay vẫn phủ kín màn hình (không lộ góc đen), trừ khi fill=false.
      const aspect = Math.max(W / H, H / W);
      const cover = (deg) => {
        const r = (Math.abs(deg) * Math.PI) / 180;
        return par.fill === false ? 1 : Math.cos(r) + aspect * Math.sin(r);
      };
      if (role === 'a') {
        const t = ease('ease_in', q);
        const a = ang * t;
        S.transform = `rotate(${a}deg) scale(${Math.max(1 + (sc - 1) * t, cover(a)).toFixed(3)})`; S.filter = `blur(${(bm * t).toFixed(1)}px)`;
      } else {
        const t = ease('ease_out', q);
        const a = -ang * (1 - t);
        S.transform = `rotate(${a}deg) scale(${Math.max(1 + (sc - 1) * (1 - t), cover(a)).toFixed(3)})`; S.filter = `blur(${(bm * (1 - t)).toFixed(1)}px)`;
      }
      break;
    }
    case 'parallax': {
      const v = e(p);
      if (role === 'a') { S.transform = `translate(${(dx * v * 0.3 * W).toFixed(1)}px, ${(dy * v * 0.3 * H).toFixed(1)}px) scale(${1 + 0.06 * v})`; S.filter = `brightness(${1 - 0.4 * v})`; }
      else { S.transform = `translate(${(-dx * (1 - v) * W).toFixed(1)}px, ${(-dy * (1 - v) * H).toFixed(1)}px) scale(${1 + 0.08 * (1 - v)})`; }
      break;
    }
    case 'mask_reveal': {
      if (role !== 'b') break;
      const [ox, oy] = [par.origin_x ?? 0.5, par.origin_y ?? 0.5];
      const R = Math.hypot(Math.max(ox, 1 - ox) * W, Math.max(oy, 1 - oy) * H);
      const soft = (par.softness ?? 0.25) * R;
      const r = e(p) * (R + soft);
      S.maskImage = S.WebkitMaskImage = `radial-gradient(circle at ${(ox * 100).toFixed(1)}% ${(oy * 100).toFixed(1)}%, #000 ${Math.max(0, r - soft).toFixed(1)}px, transparent ${r.toFixed(1)}px)`;
      break;
    }
    case 'iris': {
      const [ox, oy] = [par.origin_x ?? 0.5, par.origin_y ?? 0.5];
      const R = Math.hypot(Math.max(ox, 1 - ox) * W, Math.max(oy, 1 - oy) * H);
      const v = e(p);
      if ((par.mode || 'open') === 'open') { if (role === 'b') S.clipPath = `circle(${(R * v).toFixed(1)}px at ${ox * 100}% ${oy * 100}%)`; }
      else if (role === 'a') { S.zIndex = 2; S.clipPath = `circle(${(R * (1 - v)).toFixed(1)}px at ${ox * 100}% ${oy * 100}%)`; }
      else S.zIndex = 1;
      break;
    }
    case 'clock': {
      if (role !== 'b') break;
      const deg = e(p) * 360;
      const from = par.start_angle ?? 0;
      S.maskImage = S.WebkitMaskImage = `conic-gradient(from ${from}deg at 50% 50%, #000 0deg ${deg.toFixed(2)}deg, transparent ${(deg + 0.6).toFixed(2)}deg)`;
      break;
    }
    case 'barn': {
      if (role !== 'b') break;
      const v = e(p);
      const horizontal = (par.orientation || 'vertical') === 'horizontal';
      const to = horizontal ? '180deg' : '90deg';
      if ((par.mode || 'open') === 'open') {
        const w = v * 50;
        S.maskImage = S.WebkitMaskImage = `linear-gradient(${to}, transparent ${(50 - w).toFixed(2)}%, #000 ${(50 - w).toFixed(2)}%, #000 ${(50 + w).toFixed(2)}%, transparent ${(50 + w).toFixed(2)}%)`;
      } else {
        const w = v * 50;
        S.maskImage = S.WebkitMaskImage = `linear-gradient(${to}, #000 ${w.toFixed(2)}%, transparent ${w.toFixed(2)}%, transparent ${(100 - w).toFixed(2)}%, #000 ${(100 - w).toFixed(2)}%)`;
      }
      break;
    }
    case 'luma': {
      if (role !== 'b') break;
      const v = e(p);
      const pat = par.pattern || 'diagonal';
      const soft = par.softness ?? 18;
      if (pat === 'blinds') {
        const n = par.bars ?? 10;
        const bar = W / n;
        S.maskImage = S.WebkitMaskImage = `repeating-linear-gradient(90deg, #000 0px, #000 ${(v * bar).toFixed(1)}px, transparent ${(v * bar).toFixed(1)}px, transparent ${bar.toFixed(1)}px)`;
      } else if (pat === 'radial') {
        const R = Math.hypot(W / 2, H / 2);
        const r = v * (R + soft * 5);
        S.maskImage = S.WebkitMaskImage = `radial-gradient(circle at 50% 50%, #000 ${Math.max(0, r - soft * 5).toFixed(1)}px, transparent ${r.toFixed(1)}px)`;
      } else {
        const pos = v * (100 + soft) - soft;
        S.maskImage = S.WebkitMaskImage = `linear-gradient(135deg, #000 ${pos.toFixed(2)}%, transparent ${(pos + soft).toFixed(2)}%)`;
      }
      break;
    }
    case 'shape': {
      if (role !== 'b') break;
      const R = Math.hypot(W / 2, H / 2) * 1.25;
      const r = e(p) * R;
      const shape = par.shape || 'diamond';
      if (shape === 'circle') S.clipPath = `circle(${r.toFixed(1)}px at 50% 50%)`;
      else if (shape === 'rounded_square') { const half = r * 0.85; S.clipPath = `inset(max(0px, calc(50% - ${half.toFixed(1)}px)) round ${(half * 0.25).toFixed(1)}px)`; }
      else S.clipPath = shapePoints(shape, W / 2, H / 2, r);
      break;
    }
    case 'glitch': {
      const i = role === 'a' ? q : 1 - q;
      const f = Math.floor(abs);
      const shift = (rand(f, 1) - 0.5) * 2 * i * (par.shift ?? 60) * k;
      S.transform = `translateX(${shift.toFixed(1)}px)`;
      out.svg = { kind: 'glitch', scale: i * (par.intensity ?? 90) * k, split: i * (par.split ?? 14) * k, seed: f % 97 };
      if (rand(f, 2) > 0.8) S.filter = `hue-rotate(${Math.round(rand(f, 3) * 90)}deg) saturate(1.4)`;
      break;
    }
    case 'rgb': {
      const i = role === 'a' ? q : 1 - q;
      out.svg = { kind: 'rgb', split: Math.pow(i, 1.5) * (par.split ?? 28) * k };
      break;
    }
    case 'pixel': {
      const i = role === 'a' ? q : 1 - q;
      const size = Math.round(1 + Math.pow(i, 2) * ((par.size ?? 48) * k - 1));
      if (size > 1) out.svg = { kind: 'pixel', size };
      break;
    }
    case 'vhs': {
      const i = role === 'a' ? q : 1 - q;
      const f = Math.floor(abs);
      const jitter = (rand(f, 5) - 0.5) * 2 * i * (par.jitter ?? 26) * k;
      S.transform = `translateX(${jitter.toFixed(1)}px)`;
      S.filter = `blur(${(i * 2 * k).toFixed(1)}px) saturate(${(1 - 0.35 * i).toFixed(2)}) contrast(${(1 + 0.15 * i).toFixed(2)})`;
      out.svg = { kind: 'rgb', split: i * (par.split ?? 10) * k };
      break;
    }
    case 'shake': {
      const i = role === 'a' ? q : 1 - q;
      const f = Math.floor(abs);
      const amp = (par.amplitude ?? 36) * k * i;
      S.transform = `translate(${((rand(f, 7) - 0.5) * 2 * amp).toFixed(1)}px, ${((rand(f, 8) - 0.5) * 2 * amp).toFixed(1)}px) rotate(${((rand(f, 9) - 0.5) * 2 * (par.rotate ?? 2.5) * i).toFixed(2)}deg) scale(${(1 + 0.1 * i).toFixed(3)})`;
      S.filter = `blur(${(i * (par.blur ?? 6) * k).toFixed(1)}px)`;
      break;
    }
    default:
      break;
  }
  return out;
}

/** Lớp phủ trên cả khung (flash, rò sáng, cháy phim, scanline, tấm đồ họa, nhúng màu). Trả về mảng {style, text?}. */
export function overlayFx(tr, abs, W, H) {
  const p = clamp01((abs - tr.start) / tr.dur);
  const par = tr.params || {};
  const k = H / 1080;
  const bell = Math.sin(Math.PI * p);
  const layers = [];
  const f = Math.floor(abs);
  switch (tr.style) {
    case 'dip': {
      const o = p < 0.5 ? ease(par.easing, p * 2) : ease(par.easing, (1 - p) * 2);
      layers.push({ style: { background: par.color || '#000', opacity: o } });
      break;
    }
    case 'flash': {
      const n = par.strobes ?? 1;
      let o = Math.pow(bell, par.sharpness ?? 2.2);
      if (n > 1) o *= 0.55 + 0.45 * Math.abs(Math.cos(Math.PI * n * p));
      layers.push({ style: { background: par.color || '#fff', opacity: Math.min(1, o * (par.peak ?? 1)) } });
      break;
    }
    case 'leak': {
      const o = Math.pow(bell, 1.4) * (par.peak ?? 0.9);
      const x = 20 + 60 * p;
      layers.push({ style: { background: `radial-gradient(ellipse at ${x}% 30%, rgba(255,120,40,0.95), rgba(255,60,90,0.55) 35%, transparent 65%), radial-gradient(ellipse at ${100 - x}% 80%, rgba(255,200,80,0.8), transparent 55%)`, opacity: o, mixBlendMode: 'screen' } });
      break;
    }
    case 'burn': {
      const flicker = 0.75 + 0.25 * rand(f, 11);
      const o = Math.pow(bell, 1.2) * (par.peak ?? 1) * flicker;
      layers.push({ style: { background: `radial-gradient(circle at ${30 + 40 * rand(f >> 1, 12)}% ${40 + 20 * rand(f >> 1, 13)}%, rgba(255,245,200,1), rgba(255,170,40,0.9) 30%, rgba(200,40,0,0.6) 60%, transparent 85%)`, opacity: o, mixBlendMode: 'screen' } });
      break;
    }
    case 'vhs': {
      const o = Math.pow(bell, 0.8);
      layers.push({ style: { background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.38) 0px, rgba(0,0,0,0.38) 2px, transparent 2px, transparent 5px)', opacity: o } });
      const barY = ((p * 1.8 + rand(f >> 2, 14) * 0.2) % 1) * 100;
      layers.push({ style: { top: `${barY}%`, height: `${12}%`, background: 'rgba(255,255,255,0.10)', opacity: o, filter: `blur(${6 * k}px)` } });
      layers.push({ style: { background: `rgba(0,0,0,${(0.25 * o).toFixed(3)})` } });
      break;
    }
    case 'glitch': {
      if (rand(f, 21) > 0.55) {
        const y = rand(f, 22) * 90, h = 2 + rand(f, 23) * 9;
        layers.push({ style: { top: `${y}%`, height: `${h}%`, background: rand(f, 24) > 0.5 ? 'rgba(0,255,255,0.35)' : 'rgba(255,0,100,0.35)', opacity: bell, mixBlendMode: 'screen' } });
      }
      break;
    }
    case 'graphic': {
      // Tấm màu trượt qua khung: phủ kín ở giữa vùng (lúc đó clip đổi), rồi trượt tiếp ra ngoài.
      const [dx] = dirOf(par, 'right');
      const t = p < 0.5 ? ease('ease_out', p * 2) - 1 : ease('ease_in', (p - 0.5) * 2); // -1..0 rồi 0..1
      const text = par.text ? String(par.text) : null;
      layers.push({
        style: {
          transform: `translateX(${(t * dx * 100).toFixed(2)}%)`,
          background: par.color || '#B91C2C',
          justifyContent: 'center', alignItems: 'center',
        },
        text,
        textStyle: { fontFamily: 'Inter', fontWeight: 800, fontSize: (par.font_size ?? 96) * k, color: par.text_color || '#fff', letterSpacing: '-0.02em', transform: `translateX(${(t * dx * -30).toFixed(2)}%)`, opacity: 1 - Math.min(1, Math.abs(t) * 1.4) },
      });
      break;
    }
    default:
      break;
  }
  return layers;
}

/** Mô tả bộ lọc SVG cho clip (glitch, rgb, pixel). */
export function svgFilter(id, svg) {
  if (!svg) return null;
  const rgb = (input, split) => ({
    children: [
      ['feColorMatrix', { in: input, type: 'matrix', values: '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0', result: 'r' }],
      ['feOffset', { in: 'r', dx: split, dy: 0, result: 'ro' }],
      ['feColorMatrix', { in: input, type: 'matrix', values: '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0', result: 'g' }],
      ['feColorMatrix', { in: input, type: 'matrix', values: '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0', result: 'b' }],
      ['feOffset', { in: 'b', dx: -split, dy: 0, result: 'bo' }],
      ['feBlend', { in: 'ro', in2: 'g', mode: 'screen', result: 'rg' }],
      ['feBlend', { in: 'rg', in2: 'bo', mode: 'screen' }],
    ],
  });
  if (svg.kind === 'rgb') return { id, ...rgb('SourceGraphic', svg.split) };
  if (svg.kind === 'pixel') {
    const s = svg.size;
    return {
      id,
      children: [
        ['feFlood', { x: s / 2, y: s / 2, width: 1, height: 1 }],
        ['feComposite', { width: s, height: s }],
        ['feTile', { result: 't' }],
        ['feComposite', { in: 'SourceGraphic', in2: 't', operator: 'in' }],
        ['feMorphology', { operator: 'dilate', radius: s / 2 }],
      ],
    };
  }
  if (svg.kind === 'glitch') {
    return {
      id,
      children: [
        ['feTurbulence', { type: 'fractalNoise', baseFrequency: '0.0008 0.35', numOctaves: 1, seed: svg.seed, result: 'n' }],
        ['feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale: svg.scale, xChannelSelector: 'R', yChannelSelector: 'G', result: 'd' }],
        ...rgb('d', svg.split).children,
      ],
    };
  }
  return null;
}
