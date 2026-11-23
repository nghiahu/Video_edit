// Hàm thuần dùng trong composition (không dùng module Node).
export const clamp01 = (t) => Math.min(Math.max(t, 0), 1);
export const easeOutCubic = (t) => 1 - Math.pow(1 - clamp01(t), 3);
export const easeOutQuad = (t) => 1 - (1 - clamp01(t)) * (1 - clamp01(t));
export const easeFn = (name) => (name === 'ease_out_quad' ? easeOutQuad : easeOutCubic);
export const dbToLin = (db) => Math.pow(10, db / 20);

// Nội suy tuyến tính theo mảng [[frame, value], ...] tăng dần.
export function lerpCurve(curve, f) {
  if (!curve.length) return 0;
  if (f <= curve[0][0]) return curve[0][1];
  for (let i = 1; i < curve.length; i++) {
    if (f <= curve[i][0]) {
      const [f0, v0] = curve[i - 1];
      const [f1, v1] = curve[i];
      return v0 + ((v1 - v0) * (f - f0)) / Math.max(1e-9, f1 - f0);
    }
  }
  return curve[curve.length - 1][1];
}

// Hệ số âm lượng (0..1+) của một đoạn tiếng tại frame f (tính từ đầu đoạn).
export function segVolume(seg, f) {
  let v = seg.g;
  if (f < seg.headMute) v = 0;
  else if (seg.headRamp > 0 && f < seg.headMute + seg.headRamp) v *= (f - seg.headMute) / seg.headRamp;
  if (seg.tailLen > 0 && f >= seg.tailAt) v *= clamp01(1 - (f - seg.tailAt) / seg.tailLen);
  return Math.max(0, v);
}

// Scale của một punch_in tại frame f (giờ đầu ra).
export function punchScale(p, f) {
  const rel = f - p.start;
  if (rel < 0) return p.preScale ?? 1; // punch_out: khung đã zoom sẵn trước khi lùi ra
  const e = easeFn(p.easing);
  const up = p.startScale + (p.endScale - p.startScale) * e(rel / p.inF);
  if (rel < p.inF) return up;
  if (rel < p.inF + p.holdF) return p.endScale;
  if (p.ret === 'keep') return p.endScale;
  if (p.ret === 'zoom_out') {
    const r = (rel - p.inF - p.holdF) / p.returnF;
    return r >= 1 ? 1 : p.endScale + (1 - p.endScale) * e(r);
  }
  return 1; // 'cut': trở về khung gốc ngay sau khi hết giữ
}

// Scale của slow_push tại frame f: tăng đều từ start đến hết dur, rồi giữ nguyên.
export function pushScale(p, f) {
  const t = clamp01((f - p.start) / Math.max(1, p.dur));
  const e = p.easing === 'ease_in_out' ? t * t * (3 - 2 * t) : t;
  return p.startScale + (p.endScale - p.startScale) * e;
}

export const ORIGIN = { upper_third: '50% 33%', center: '50% 50%', face: '50% 40%' };
