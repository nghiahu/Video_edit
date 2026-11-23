import React from 'react';
import { AbsoluteFill, Audio, Freeze, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp01, dbToLin, easeOutCubic, lerpCurve, ORIGIN, punchScale, pushScale, segVolume } from './util.js';
import { ensureFonts, fontFamily } from './fonts.js';
import { clipFx, overlayFx, svgFilter } from './transitions.js';
import { TextBlock } from './TextBlock.jsx';

// Lớp phủ của transition (flash, rò sáng, scanline, tấm đồ họa, nhúng màu...)
const TransitionOverlay = ({ tr }) => {
  const frame = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const layers = overlayFx(tr, tr.start + frame, W, H);
  return (
    <AbsoluteFill>
      {layers.map((l, i) => (
        <AbsoluteFill key={i} style={{ pointerEvents: 'none', ...l.style }}>
          {l.text ? <div style={l.textStyle}>{l.text}</div> : null}
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};

// Lớp hình: mỗi clip một Sequence, câm tiếng (tiếng xử lý ở lớp âm thanh riêng để làm j/l cut và ducking).
// Gộp style của nhiều transition cùng ảnh hưởng một clip (transform, filter nối chuỗi; thuộc tính khác ghi đè).
function mergeFx(list) {
  const style = {};
  let svg = null;
  for (const r of list) {
    for (const [key, v] of Object.entries(r.style)) {
      if ((key === 'transform' || key === 'filter') && style[key]) style[key] = `${style[key]} ${v}`;
      else style[key] = v;
    }
    if (r.svg) svg = r.svg;
  }
  return { style, svg };
}

const ClipPicture = ({ clip, seqFrom, punches, pushes, grades, vignettes, transitions, media, fps }) => {
  const frame = useCurrentFrame(); // frame tương đối trong Sequence
  const { width: W, height: H } = useVideoConfig();
  const abs = seqFrom + frame; // frame tuyệt đối trên timeline đầu ra
  let scale = 1;
  let origin = ORIGIN.center;
  for (const p of punches) {
    if (p.clip !== clip.id) continue;
    const s = punchScale(p, abs);
    if (s !== 1) {
      scale *= s;
      origin = ORIGIN[p.anchor] || ORIGIN.upper_third;
    }
  }
  for (const p of pushes) {
    if (p.clip !== clip.id || abs < p.start) continue;
    scale *= pushScale(p, abs);
    origin = ORIGIN[p.anchor] || ORIGIN.center;
  }
  // Chỉnh màu cơ bản (filter) + lớp ấm/lạnh (soft-light)
  let filter = 'none';
  let tint = null;
  for (const g of grades) {
    if (g.clip !== clip.id || abs < g.start || abs >= g.end) continue;
    filter = `brightness(${1 + g.brightness}) contrast(${g.contrast}) saturate(${g.saturation})`;
    if (g.warmth) tint = { color: g.warmth > 0 ? '#ff9a3c' : '#3c8cff', opacity: Math.min(1, Math.abs(g.warmth) * 0.5) };
  }
  // Vignette: lớp tối dần ra mép khung, vào/ra mượt
  let vig = null;
  for (const v of vignettes) {
    if (v.clip !== clip.id || abs < v.start || abs >= v.end) continue;
    const ramp = Math.max(1, v.rampF);
    const k = Math.min(1, (abs - v.start) / ramp, (v.end - abs) / ramp);
    vig = { strength: v.strength * clamp01(k), softness: v.softness };
  }
  // Chuyển cảnh: mọi transition liên quan clip này
  const fxList = [];
  for (const tr of transitions) {
    const role = tr.aId === clip.id ? 'a' : tr.bId === clip.id ? 'b' : null;
    if (!role) continue;
    const r = clipFx(tr, role, abs, W, H);
    if (r) fxList.push(r);
  }
  const { style: fxStyle, svg } = mergeFx(fxList);
  const filterId = `fx-${clip.id}`;
  const svgDef = svgFilter(filterId, svg);
  if (svgDef) fxStyle.filter = `${fxStyle.filter ? `${fxStyle.filter} ` : ''}url(#${filterId})`;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', ...fxStyle }}>
      {svgDef ? (
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
              {svgDef.children.map(([name, props], i) => React.createElement(name, { key: i, ...props }))}
            </filter>
          </defs>
        </svg>
      ) : null}
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: origin }}>
        {clip.segs.map((s, i) => {
          // Mỗi đoạn hình có tốc độ riêng (time lapse, speed ramp) hoặc đóng băng (freeze). Đầu/cuối clip mở rộng cho chuyển cảnh chồng.
          const first = i === 0;
          const last = i === clip.segs.length - 1;
          const normal = s.kind === 'play' && s.rate === 1;
          const pre = first && normal ? clip.headExt : 0;
          const post = last && normal ? clip.tailExt : 0;
          const video = (
            <OffthreadVideo
              src={staticFile(media[clip.videoId])}
              startFrom={Math.round(s.srcStart * fps) - pre}
              playbackRate={s.rate}
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter }}
            />
          );
          return (
            <Sequence key={i} from={first ? 0 : clip.headExt + s.from} durationInFrames={s.dur + pre + post} layout="none">
              {s.kind === 'freeze' ? <Freeze frame={0}>{video}</Freeze> : video}
            </Sequence>
          );
        })}
        {tint ? <AbsoluteFill style={{ background: tint.color, opacity: tint.opacity, mixBlendMode: 'soft-light' }} /> : null}
      </AbsoluteFill>
      {vig ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse at center, rgba(0,0,0,0) ${Math.round(vig.softness * 100)}%, rgba(0,0,0,${vig.strength.toFixed(3)}) 100%)`,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

// AbsoluteFill là flex dạng cột: justifyContent = chiều dọc, alignItems = chiều ngang.
const POS = {
  lower_middle: { justifyContent: 'flex-end', alignItems: 'center', paddingBottom: '14%', textAlign: 'center' },
  center: { justifyContent: 'center', alignItems: 'center', textAlign: 'center' },
  lower_left: { justifyContent: 'flex-end', alignItems: 'flex-start', paddingBottom: '14%', paddingLeft: '7%', textAlign: 'left' },
};

const KineticText = ({ t, height }) => {
  const frame = useCurrentFrame();
  const { params: p } = t;
  const k = height / 1080; // preset viết cho 1080p
  const inP = easeOutCubic(frame / Math.max(1, t.inF));
  const outP = clamp01((t.total - frame) / Math.max(1, t.outF));
  const opacity = Math.min(inP, outP);
  let transform = 'none';
  if (p.in_animation === 'fade_up') transform = `translateY(${(1 - inP) * 20 * k}px)`;
  if (p.in_animation === 'scale_fade') transform = `scale(${0.92 + 0.08 * inP})`;

  const hl = new Set((p.highlight_words || []).map((w) => w.toLowerCase()));
  const words = String(p.text).split(/\s+/);
  const shadow = p.shadow ? `0 0 ${p.shadow.blur * k}px rgba(0,0,0,${p.shadow.opacity}), 0 2px ${6 * k}px rgba(0,0,0,${p.shadow.opacity})` : 'none';
  const boxed = p.background && p.background !== 'none';
  const pos = POS[p.position] || POS.lower_middle;

  return (
    <AbsoluteFill style={{ display: 'flex', ...pos }}>
      <div
        style={{
          opacity,
          transform,
          maxWidth: '80%',
          fontFamily: fontFamily(p.font_family),
          fontWeight: p.font_weight,
          fontSize: p.font_size * k,
          lineHeight: p.line_height,
          letterSpacing: `${p.letter_spacing}em`,
          color: p.text_color,
          textShadow: boxed ? 'none' : shadow,
          background: boxed ? p.background : 'transparent',
          borderRadius: (p.background_radius || 0) * k,
          padding: boxed ? `${(p.background_padding || 0) * k}px ${(p.background_padding || 0) * 1.4 * k}px` : 0,
          display: 'inline-block',
        }}
      >
        {words.map((w, i) => (
          <span key={i} style={{ color: hl.has(w.toLowerCase()) ? p.highlight_color : undefined }}>
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Thanh tên + chức danh (cấp 2 trong typography/hierarchy.md)
const LowerThird = ({ t, height }) => {
  const frame = useCurrentFrame();
  const { params: p } = t;
  const k = height / 1080;
  const inP = easeOutCubic(frame / Math.max(1, t.inF));
  const outP = clamp01((t.total - frame) / Math.max(1, t.outF));
  const opacity = Math.min(inP, outP);
  const shadow = p.shadow ? `0 0 ${p.shadow.blur * k}px rgba(0,0,0,${p.shadow.opacity}), 0 2px ${6 * k}px rgba(0,0,0,${p.shadow.opacity})` : 'none';
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'flex-start', paddingLeft: '6%', paddingBottom: '12%' }}>
      <div style={{ opacity, transform: `translateX(${(1 - inP) * -28 * k}px)`, display: 'flex', alignItems: 'stretch', gap: 18 * k, textShadow: shadow }}>
        {p.accent_bar ? <div style={{ width: 5 * k, background: p.accent_color, borderRadius: 3 * k }} /> : null}
        <div>
          <div style={{ fontFamily: fontFamily(p.name_font_family), fontWeight: p.name_font_weight, fontSize: p.name_font_size * k, lineHeight: 1.15, color: p.text_color }}>
            {p.name}
          </div>
          {p.title ? (
            <div style={{ fontFamily: fontFamily(p.title_font_family), fontWeight: p.title_font_weight, fontSize: p.title_font_size * k, lineHeight: 1.25, color: p.title_color, marginTop: 4 * k }}>
              {p.title}
            </div>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Fade in/out toàn khung: màu phủ lên trên mọi lớp (kể cả chữ)
const FadeLayer = ({ f }) => {
  const frame = useCurrentFrame();
  const t = clamp01(frame / Math.max(1, f.total));
  return <AbsoluteFill style={{ background: f.color, opacity: f.mode === 'in' ? 1 - t : t }} />;
};

// Phụ đề: tối đa 2 dòng, vùng đáy, nền mờ nhẹ để dễ đọc
const Subtitle = ({ s, height }) => {
  const frame = useCurrentFrame();
  const p = s.params;
  const k = height / 1080;
  const fade = Math.min(1, frame / 3, (s.total - frame) / 3);
  const boxed = p.background && p.background !== 'none';
  const shadow = p.shadow ? `0 0 ${p.shadow.blur * k}px rgba(0,0,0,${p.shadow.opacity}), 0 2px ${5 * k}px rgba(0,0,0,${p.shadow.opacity})` : 'none';
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: `${p.bottom_percent}%` }}>
      <div
        style={{
          opacity: clamp01(fade),
          fontFamily: fontFamily(p.font_family),
          fontWeight: p.font_weight,
          fontSize: p.font_size * k,
          lineHeight: p.line_height,
          color: p.text_color,
          textAlign: 'center',
          whiteSpace: 'pre-line',
          background: boxed ? p.background : 'transparent',
          borderRadius: (p.background_radius || 0) * k,
          padding: boxed ? `${(p.background_padding || 0) * k}px ${(p.background_padding || 0) * 1.6 * k}px` : 0,
          textShadow: boxed ? 'none' : shadow,
          maxWidth: '86%',
        }}
      >
        {s.text}
      </div>
    </AbsoluteFill>
  );
};

export const EdlVideo = ({ resolved, media, height }) => {
  const { fps } = useVideoConfig();
  ensureFonts(resolved.fonts || []); // chỉ nạp phông mà EDL dùng
  const { clips, punches, pushes = [], grades = [], vignettes = [], subs = [], texts, lowerThirds = [], audioSegs, music, transitions = [], fades = [], sfx = [], textBlocks = [] } = resolved;
  // Fade in/out toàn video: hệ số âm lượng chung theo frame tuyệt đối
  const master = (abs) => {
    let g = 1;
    for (const f of fades) {
      if (!f.audio) continue;
      const t = clamp01((abs - f.from) / f.total);
      if (abs < f.from || abs > f.from + f.total) continue;
      g *= f.mode === 'in' ? t : 1 - t;
    }
    return g;
  };
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {clips.map((c) => {
        const seqFrom = c.from - c.headExt;
        return (
          <Sequence key={c.id} from={seqFrom} durationInFrames={c.dur + c.headExt + c.tailExt} name={`clip ${c.id}`}>
            <ClipPicture clip={c} seqFrom={seqFrom} punches={punches} pushes={pushes} grades={grades} vignettes={vignettes} transitions={transitions} media={media} fps={fps} />
          </Sequence>
        );
      })}

      {transitions.filter((tr) => tr.hasOverlay).map((tr) => (
        <Sequence key={`ov-${tr.id}`} from={tr.start} durationInFrames={tr.dur} name={`transition ${tr.id}`}>
          <TransitionOverlay tr={tr} />
        </Sequence>
      ))}

      {textBlocks.map((b) => (
        <Sequence key={`tb-${b.id}`} from={b.from} durationInFrames={Math.max(1, b.total)} name={`${b.technique} ${b.id}`}>
          <TextBlock b={b} height={height} />
        </Sequence>
      ))}

      {subs.map((s) => (
        <Sequence key={s.id} from={s.from} durationInFrames={Math.max(1, s.total)} name={`subtitle ${s.id}`}>
          <Subtitle s={s} height={height} />
        </Sequence>
      ))}

      {lowerThirds.map((t) => (
        <Sequence key={t.id} from={t.from} durationInFrames={Math.max(1, t.total)} name={`lower third ${t.id}`}>
          <LowerThird t={t} height={height} />
        </Sequence>
      ))}

      {texts.map((t) => (
        <Sequence key={t.id} from={t.from} durationInFrames={Math.max(1, t.total)} name={`text ${t.id}`}>
          <KineticText t={t} height={height} />
        </Sequence>
      ))}

      {fades.map((f) => (
        <Sequence key={`fade-${f.id}`} from={f.from} durationInFrames={Math.max(1, f.total)} name={`fade ${f.id}`}>
          <FadeLayer f={f} />
        </Sequence>
      ))}

      {audioSegs.map((s) => (
        <Sequence key={s.key} from={s.from} durationInFrames={s.dur} name={`audio ${s.key}`}>
          <Audio
            src={staticFile(media[s.videoId])}
            startFrom={Math.round(s.srcFrom * fps)}
            volume={(f) => segVolume(s, f) * master(s.from + f)}
          />
        </Sequence>
      ))}

      {sfx.map((x) => (
        <Sequence key={`sfx-${x.id}`} from={x.from} name={`sfx ${x.id}`}>
          <Audio src={staticFile(x.file)} volume={(f) => x.g * master(x.from + f)} />
        </Sequence>
      ))}

      {music ? (
        <Audio
          src={staticFile(music.file)}
          loop
          volume={(f) => dbToLin(lerpCurve(music.curveDb, f)) * master(f)}
        />
      ) : null}
    </AbsoluteFill>
  );
};
