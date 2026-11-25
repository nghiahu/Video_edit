#!/usr/bin/env node
// Renderer CLI: validate | preview | final.
// Dùng: node renderer/cli.js <validate|preview|final> --edl projects/<id>/edl.json [--approve-proposed] [--out file]
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadPresets, readEdl, renderFps, resolveEdl, validateEdl } from './lib/edl.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VIDEO_ANALYSIS = path.join(ROOT, '..', 'Video-analysis');
const PREVIEW_HEIGHT = 540;

function parseArgs(argv) {
  const [cmd, ...rest] = argv;
  const o = { cmd, flags: new Set() };
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === '--edl') o.edl = rest[++i];
    else if (a === '--out') o.out = rest[++i];
    else if (a.startsWith('--')) o.flags.add(a.slice(2));
  }
  return o;
}

function die(msg) {
  console.error(`LỖI: ${msg}`);
  process.exit(1);
}

function run(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (r.error) throw r.error;
  return r;
}

function findSource(videoId) {
  const summary = path.join(VIDEO_ANALYSIS, 'metadata', videoId, 'summary.md');
  if (fs.existsSync(summary)) {
    const m = fs.readFileSync(summary, 'utf8').match(/^relative_path:\s*(.+)$/m);
    if (m) {
      const p = path.join(VIDEO_ANALYSIS, m[1].trim().replace(/^["']|["']$/g, ''));
      if (fs.existsSync(p)) return p;
    }
  }
  const dir = path.join(VIDEO_ANALYSIS, 'videos');
  if (fs.existsSync(dir)) {
    const f = fs.readdirSync(dir).find((x) => x.toLowerCase().startsWith(videoId.toLowerCase()));
    if (f) return path.join(dir, f);
  }
  return null;
}

function probe(file) {
  const r = run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=codec_type', '-of', 'json', file]);
  if (r.status !== 0) throw new Error(`ffprobe lỗi với ${file}: ${r.stderr}`);
  const j = JSON.parse(r.stdout);
  return { duration: parseFloat(j.format.duration), hasAudio: (j.streams || []).some((s) => s.codec_type === 'audio') };
}

function gatherSources(edl) {
  const sources = {};
  const info = {};
  const extra = (edl.decisions || []).filter((d) => d.technique === 'layout_cards' && d.status !== 'removed' && d.parameters?.screen_video).map((d) => d.parameters.screen_video);
  for (const id of new Set([...edl.timeline.clips.map((c) => c.video_id), ...extra])) {
    const p = findSource(id);
    if (!p) continue;
    sources[id] = p;
    info[id] = probe(p);
  }
  return { sources, info };
}

function printReport({ errors, warnings }) {
  for (const w of warnings) console.log(`  ⚠ ${w}`);
  for (const e of errors) console.log(`  ✘ ${e}`);
}

function makeProxy(src, dst, fps) {
  if (fs.existsSync(dst) && fs.statSync(dst).mtimeMs >= fs.statSync(src).mtimeMs) return false;
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  const r = run('ffmpeg', [
    '-y', '-v', 'error', '-i', src,
    '-map', '0:v:0', '-map', '0:a:0?',
    '-vf', `scale=-2:${PREVIEW_HEIGHT},fps=${fps}`,
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '26', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '128k', '-ac', '2', '-ar', '48000',
    '-movflags', '+faststart', dst,
  ]);
  if (r.status !== 0) throw new Error(`ffmpeg tạo proxy lỗi (${path.basename(src)}): ${r.stderr}`);
  return true;
}

function linkOrCopy(src, dst) {
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  if (fs.existsSync(dst)) fs.rmSync(dst);
  try {
    fs.linkSync(src, dst); // hard link: tức thì, không tốn dung lượng (cùng ổ đĩa)
  } catch {
    fs.copyFileSync(src, dst);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!['validate', 'preview', 'final'].includes(args.cmd) || !args.edl) {
    die('Cú pháp: node renderer/cli.js <validate|preview|final> --edl <đường dẫn edl.json> [--approve-proposed] [--out <file>]');
  }
  const edlPath = path.resolve(args.edl);
  if (!fs.existsSync(edlPath)) die(`Không thấy EDL: ${edlPath}`);
  const projectDir = path.dirname(edlPath);
  const edl = readEdl(edlPath);
  const presets = loadPresets(ROOT);

  console.log(`EDL: ${edl.project.title || edl.project.id} · style ${edl.strategy.style} · ${edl.decisions.length} quyết định`);
  const { sources, info } = gatherSources(edl);
  const report = validateEdl(edl, presets, info);
  // Ảnh dùng trong EDL (image_float.images, layout_cards.screen_image): đường dẫn tương đối thư mục dự án
  for (const d of edl.decisions.filter((x) => x.status !== 'removed')) {
    const imgs = [...(Array.isArray(d.parameters?.images) ? d.parameters.images : []), ...(d.parameters?.screen_image ? [d.parameters.screen_image] : [])];
    for (const im of imgs) if (!fs.existsSync(path.resolve(projectDir, String(im)))) report.errors.push(`${d.id}: không thấy file ảnh ${im} (tính từ thư mục dự án)`);
    if (d.parameters?.screen_video && !sources[d.parameters.screen_video]) report.errors.push(`${d.id}: không thấy video nguồn ${d.parameters.screen_video}`);
  }
  printReport(report);
  if (report.errors.length) die(`EDL không hợp lệ (${report.errors.length} lỗi)`);
  if (args.cmd === 'validate') {
    console.log(`OK: EDL hợp lệ (${report.warnings.length} cảnh báo).`);
    return;
  }

  // Cổng xác nhận: bản cuối chỉ dùng quyết định đã approved.
  const isFinal = args.cmd === 'final';
  const proposed = edl.decisions.filter((d) => d.status === 'proposed');
  let include = ['proposed', 'approved'];
  if (isFinal) {
    const est = edl.decisions.filter((d) => d.status !== 'removed' && d.parameters?.words_source === 'estimated');
    if (est.length) die(`Bản cuối bị chặn: ${est.map((d) => d.id).join(', ')} dùng mốc theo từ ước lượng (words_source: estimated), chỉ dành cho bản thử. Thay bằng mốc thật (nhận dạng giọng nói, thủ công hoặc file phụ đề) hoặc bỏ các quyết định đó.`);
    if (proposed.length && !args.flags.has('approve-proposed')) {
      die(
        `Còn ${proposed.length} quyết định chưa được duyệt (${proposed.map((d) => d.id).join(', ')}). ` +
          'Chỉ render bản cuối sau khi người dùng xác nhận: đặt status "approved" trong EDL, ' +
          'hoặc thêm --approve-proposed nếu người dùng đã duyệt toàn bộ.'
      );
    }
    include = ['approved', 'proposed'].filter((s) => s === 'approved' || args.flags.has('approve-proposed'));
  }

  const fps = renderFps(edl);
  const missing = [...new Set(edl.timeline.clips.map((c) => c.video_id))].filter((id) => !sources[id]);
  if (missing.length) die(`Thiếu file nguồn: ${missing.join(', ')}`);

  const resolved = resolveEdl(edl, presets, { include, sourceInfo: info });
  for (const w of resolved.warnings) console.log(`  ⚠ ${w}`);

  // Thư mục public cho Remotion (staticFile)
  const publicDir = path.join(projectDir, isFinal ? '.public-final' : 'proxy');
  fs.mkdirSync(publicDir, { recursive: true });
  const media = {};
  for (const [id, src] of Object.entries(sources)) {
    if (isFinal) {
      media[id] = `${id}${path.extname(src)}`;
      linkOrCopy(src, path.join(publicDir, media[id]));
    } else {
      media[id] = `${id}.mp4`;
      process.stdout.write(`Proxy ${id} ... `);
      console.log(makeProxy(src, path.join(publicDir, media[id]), fps) ? 'đã tạo' : 'dùng lại');
    }
  }
  if (resolved.music) {
    const mp = path.resolve(projectDir, resolved.music.file);
    if (!fs.existsSync(mp)) die(`Không thấy file nhạc: ${mp}`);
    const rel = `music/${path.basename(mp)}`;
    linkOrCopy(mp, path.join(publicDir, rel));
    resolved.music.file = rel;
  }

  const copyImg = (id, src, i) => {
    const sp = path.resolve(projectDir, String(src));
    const rel = `img/${id}_${i}${path.extname(sp).toLowerCase()}`;
    linkOrCopy(sp, path.join(publicDir, rel));
    return rel;
  };
  for (const b of resolved.textBlocks || []) if (Array.isArray(b.params.images)) b.params = { ...b.params, images: b.params.images.map((im, i) => copyImg(b.id, im, i)) };
  for (const L of resolved.layouts || []) if (L.params.screen_image) L.screenImage = copyImg(L.id, L.params.screen_image, 's');
  for (const x of resolved.sfx || []) {
    const sp = path.resolve(projectDir, x.file);
    if (!fs.existsSync(sp)) die(`Không thấy file SFX của ${x.id}: ${sp}`);
    const rel = `sfx/${x.rel || path.basename(sp)}`;
    linkOrCopy(sp, path.join(publicDir, rel));
    x.file = rel;
  }

  const [W, H] = edl.project.resolution.split('x').map(Number);
  const height = isFinal ? H : PREVIEW_HEIGHT;
  const width = isFinal ? W : Math.round((PREVIEW_HEIGHT * W) / H / 2) * 2;
  const inputProps = { resolved, media, width, height };

  const { bundle } = await import('@remotion/bundler');
  const { renderMedia, selectComposition } = await import('@remotion/renderer');
  console.log('Đóng gói composition ...');
  const serveUrl = await bundle({ entryPoint: path.join(ROOT, 'renderer', 'src', 'index.jsx'), publicDir });
  const composition = await selectComposition({ serveUrl, id: 'Edl', inputProps, logLevel: 'warn' });

  const outDir = path.join(projectDir, 'out');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.resolve(args.out || path.join(outDir, isFinal ? 'final.mp4' : 'preview.mp4'));
  console.log(`Render ${isFinal ? 'BẢN CUỐI' : 'preview'} ${width}x${height} · ${composition.durationInFrames} frame @ ${fps}fps ...`);
  let last = -1;
  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    crf: isFinal ? 18 : 28,
    outputLocation: outFile,
    inputProps,
    logLevel: 'warn',
    onProgress: ({ progress }) => {
      const pct = Math.floor(progress * 10) * 10;
      if (pct !== last) { last = pct; process.stdout.write(`  ${pct}%\n`); }
    },
  });
  const probeOut = probe(outFile);
  console.log(`Xong: ${outFile}`);
  console.log(`Độ dài ${probeOut.duration.toFixed(2)}s (dự kiến ${(composition.durationInFrames / fps).toFixed(2)}s), có tiếng: ${probeOut.hasAudio}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
