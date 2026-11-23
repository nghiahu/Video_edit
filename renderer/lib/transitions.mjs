// Bảng định nghĩa các kỹ thuật chuyển cảnh do engine dùng chung (renderer/src/transitions.js) hiện thực.
// style: tên kiểu trong engine; overlap: A và B cùng hiện (cần "tay cầm" ở hai clip); hasOverlay: có lớp phủ toàn khung.
// fixed: tham số cố định ghi đè preset (ví dụ màu của dip).
export const TRANSITIONS = {
  cross_dissolve: { style: 'dissolve', overlap: true, hasOverlay: false },
  additive_dissolve: { style: 'additive', overlap: true, hasOverlay: false },
  blur_dissolve: { style: 'blur_dissolve', overlap: true, hasOverlay: false },
  morph_cut: { style: 'morph', overlap: true, hasOverlay: false },
  dip_to_black: { style: 'dip', overlap: false, hasOverlay: true, fixed: { color: '#000000' } },
  dip_to_white: { style: 'dip', overlap: false, hasOverlay: true, fixed: { color: '#ffffff' } },
  whip_pan: { style: 'whip', overlap: false, hasOverlay: false, fixed: { axis: 'x' } },
  whip_tilt: { style: 'whip', overlap: false, hasOverlay: false, fixed: { axis: 'y' } },
  slide: { style: 'slide', overlap: true, hasOverlay: false },
  push: { style: 'push', overlap: true, hasOverlay: false },
  swipe: { style: 'swipe', overlap: true, hasOverlay: false },
  wipe: { style: 'wipe', overlap: true, hasOverlay: false },
  zoom_transition: { style: 'zoom', overlap: false, hasOverlay: false },
  spin_rotate: { style: 'spin', overlap: false, hasOverlay: false },
  camera_roll: { style: 'roll', overlap: false, hasOverlay: false },
  parallax_transition: { style: 'parallax', overlap: true, hasOverlay: false },
  mask_reveal: { style: 'mask_reveal', overlap: true, hasOverlay: false },
  iris_wipe: { style: 'iris', overlap: true, hasOverlay: false },
  clock_wipe: { style: 'clock', overlap: true, hasOverlay: false },
  split_barn_door: { style: 'barn', overlap: true, hasOverlay: false },
  luma_wipe: { style: 'luma', overlap: true, hasOverlay: false },
  shape_reveal: { style: 'shape', overlap: true, hasOverlay: false },
  glitch: { style: 'glitch', overlap: false, hasOverlay: true },
  rgb_split: { style: 'rgb', overlap: false, hasOverlay: false },
  flash_strobe: { style: 'flash', overlap: false, hasOverlay: true },
  light_leak: { style: 'leak', overlap: false, hasOverlay: true },
  film_burn: { style: 'burn', overlap: false, hasOverlay: true },
  vhs_distortion: { style: 'vhs', overlap: false, hasOverlay: true },
  pixelate_mosaic: { style: 'pixel', overlap: false, hasOverlay: false },
  shake_transition: { style: 'shake', overlap: false, hasOverlay: false },
  text_graphic_wipe: { style: 'graphic', overlap: false, hasOverlay: true },
};

// Giá trị cho phép của các tham số dạng liệt kê.
export const ENUMS = {
  direction: ['left', 'right', 'up', 'down'],
  easing: ['linear', 'ease_in', 'ease_out', 'ease_in_out'],
  mode: ['open', 'close'],
  orientation: ['vertical', 'horizontal'],
  pattern: ['diagonal', 'blinds', 'radial'],
  shape: ['circle', 'diamond', 'hexagon', 'triangle', 'star', 'rounded_square'],
  where: ['in', 'out'],
};

export const DURATION_RANGE = [0.15, 3.0];
