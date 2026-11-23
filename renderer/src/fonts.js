// Nạp phông theo nhu cầu của EDL (resolved.fonts). Danh sách phông và vai trò: typography/font-registry.json.
// Mọi phông đều có subset tiếng Việt. Thêm phông mới: kiểm tra getInfo() có subset "vietnamese", thêm vào registry và vào MODS bên dưới.
import * as m0 from '@remotion/google-fonts/Inter';
import * as m1 from '@remotion/google-fonts/BeVietnamPro';
import * as m2 from '@remotion/google-fonts/Lexend';
import * as m3 from '@remotion/google-fonts/Quicksand';
import * as m4 from '@remotion/google-fonts/Nunito';
import * as m5 from '@remotion/google-fonts/Mali';
import * as m6 from '@remotion/google-fonts/Baloo2';
import * as m7 from '@remotion/google-fonts/Grandstander';
import * as m8 from '@remotion/google-fonts/PlaypenSans';
import * as m9 from '@remotion/google-fonts/Itim';
import * as m10 from '@remotion/google-fonts/Pangolin';
import * as m11 from '@remotion/google-fonts/Sriracha';
import * as m12 from '@remotion/google-fonts/PatrickHand';
import * as m13 from '@remotion/google-fonts/FuzzyBubbles';
import * as m14 from '@remotion/google-fonts/Comfortaa';
import * as m15 from '@remotion/google-fonts/Pacifico';
import * as m16 from '@remotion/google-fonts/DancingScript';
import * as m17 from '@remotion/google-fonts/Lobster';
import * as m18 from '@remotion/google-fonts/Charm';
import * as m19 from '@remotion/google-fonts/PlayfairDisplay';
import * as m20 from '@remotion/google-fonts/Anton';
import * as m21 from '@remotion/google-fonts/Bungee';
import * as m22 from '@remotion/google-fonts/ChakraPetch';

const MODS = {
  "Inter": m0,
  "Be Vietnam Pro": m1,
  "Lexend": m2,
  "Quicksand": m3,
  "Nunito": m4,
  "Mali": m5,
  "Baloo 2": m6,
  "Grandstander": m7,
  "Playpen Sans": m8,
  "Itim": m9,
  "Pangolin": m10,
  "Sriracha": m11,
  "Patrick Hand": m12,
  "Fuzzy Bubbles": m13,
  "Comfortaa": m14,
  "Pacifico": m15,
  "Dancing Script": m16,
  "Lobster": m17,
  "Charm": m18,
  "Playfair Display": m19,
  "Anton": m20,
  "Bungee": m21,
  "Chakra Petch": m22,
};

const WANT_SUBSETS = ['vietnamese', 'latin', 'latin-ext'];
const loaded = {};

function loadOne(family, weight) {
  const mod = MODS[family];
  if (!mod) return null;
  const key = family + '|' + weight;
  if (loaded[key]) return loaded[key];
  const info = mod.getInfo();
  const avail = Object.keys(info.fonts.normal || {}).map(Number);
  const w = avail.reduce((best, x) => (Math.abs(x - weight) < Math.abs(best - weight) ? x : best), avail[0]);
  const subsets = WANT_SUBSETS.filter((s) => info.fonts.normal[String(w)]?.[s]);
  try {
    loaded[key] = mod.loadFont('normal', { weights: [String(w)], subsets });
  } catch (e) {
    console.error(`Không nạp được font ${family} ${weight}:`, e.message);
    loaded[key] = null;
  }
  return loaded[key];
}

/** Nạp các phông EDL cần: [{ family, weight }]. Gọi nhiều lần an toàn (có bộ nhớ đệm). */
export function ensureFonts(list = []) {
  loadOne('Inter', 500); // phông dự phòng
  for (const f of list) loadOne(f.family, f.weight);
}

export function fontFamily(name) {
  const hit = Object.keys(loaded).find((k) => k.startsWith(name + '|') && loaded[k]);
  return hit ? loaded[hit].fontFamily : loaded['Inter|500']?.fontFamily || 'Inter, sans-serif';
}
