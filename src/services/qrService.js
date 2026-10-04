// All QR-library-specific generation, rendering geometry, export and share preparation.
import { encodeQR } from '@/lib/qr/encoder';

export function generateMatrix(content, errorCorrection = 'M') {
  return encodeQR(content, errorCorrection);
}

export function safeMatrix(project) {
  if (!project?.encoded) return null;
  try {
    return generateMatrix(project.encoded, project.customization.errorCorrection);
  } catch {
    return null;
  }
}

let sample = null;
export function sampleMatrix() {
  if (!sample) sample = generateMatrix('GLIMPSE · QR ATELIER', 'M');
  return sample;
}

const inFinder = (x, y, n) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);

// Shared geometry used by both the live React preview and the exported SVG/PNG.
export function computeLayout(matrix, margin, logo) {
  const n = matrix.length;
  const total = n + margin * 2;
  const c = total / 2;
  const modules = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!matrix[y][x] || inFinder(x, y, n)) continue;
      const mx = x + margin;
      const my = y + margin;
      const dx = c - (mx + 0.5);
      const dy = c - (my + 0.5);
      const dist = Math.hypot(dx, dy) / (n / 2);
      modules.push({ x: mx, y: my, tx: dx * 0.85, ty: dy * 0.85, delay: Math.round(dist * 420 + ((x * 7 + y * 13) % 11) * 14) });
    }
  }
  const finders = [[0, 0], [n - 7, 0], [0, n - 7]].map(([fx, fy]) => ({ x: fx + margin, y: fy + margin }));
  let logoBox = null;
  if (logo?.dataUrl) {
    const s = n * logo.scale;
    logoBox = { x: c - s / 2, y: c - s / 2, size: s, pad: Math.max(0.6, s * 0.08) };
  }
  return { n, total, modules, finders, logo: logoBox };
}

export function moduleShape(style, x, y) {
  if (style === 'dot') return { tag: 'circle', attrs: { cx: x + 0.5, cy: y + 0.5, r: 0.46 } };
  if (style === 'rounded') return { tag: 'rect', attrs: { x: x + 0.06, y: y + 0.06, width: 0.88, height: 0.88, rx: 0.32 } };
  return { tag: 'rect', attrs: { x, y, width: 1.02, height: 1.02 } };
}

const FINDER_RADII = { square: [0, 0, 0], rounded: [2, 1.3, 0.9], dot: [3.5, 2.5, 1.5] };

export function finderRects(style, f) {
  const [r0, r1, r2] = FINDER_RADII[style] || FINDER_RADII.square;
  return [
    { x: f.x, y: f.y, size: 7, rx: r0, layer: 'fg' },
    { x: f.x + 1, y: f.y + 1, size: 5, rx: r1, layer: 'bg' },
    { x: f.x + 2, y: f.y + 2, size: 3, rx: r2, layer: 'fg' },
  ];
}

export function gradientSpec(gradient, total) {
  const c = total / 2;
  if (gradient.type === 'radial') return { tag: 'radialGradient', attrs: { cx: c, cy: c, r: c * 1.05, gradientUnits: 'userSpaceOnUse' } };
  const a = (gradient.angle * Math.PI) / 180;
  const dx = Math.cos(a) * c;
  const dy = Math.sin(a) * c;
  return { tag: 'linearGradient', attrs: { x1: c - dx, y1: c - dy, x2: c + dx, y2: c + dy, gradientUnits: 'userSpaceOnUse' } };
}

const attrs = (o) => Object.entries(o).map(([k, v]) => `${k}="${typeof v === 'number' ? +v.toFixed(3) : v}"`).join(' ');

export function buildSVGString(matrix, c, size = c.size, { omitLogo = false } = {}) {
  const L = computeLayout(matrix, c.margin, c.logo);
  const fill = c.gradient.enabled ? 'url(#qg)' : c.foregroundColor;
  const parts = [`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${size}" height="${size}" viewBox="0 0 ${L.total} ${L.total}">`];
  if (c.gradient.enabled) {
    const g = gradientSpec(c.gradient, L.total);
    parts.push(`<defs><${g.tag} id="qg" ${attrs(g.attrs)}><stop offset="0" stop-color="${c.foregroundColor}"/><stop offset="1" stop-color="${c.gradient.color}"/></${g.tag}></defs>`);
  }
  parts.push(`<rect width="${L.total}" height="${L.total}" fill="${c.backgroundColor}"/>`);
  parts.push(`<g fill="${fill}">`);
  L.modules.forEach((m) => {
    const s = moduleShape(c.moduleStyle, m.x, m.y);
    parts.push(`<${s.tag} ${attrs(s.attrs)}/>`);
  });
  parts.push('</g>');
  L.finders.forEach((f) => finderRects(c.moduleStyle, f).forEach((r) => {
    parts.push(`<rect ${attrs({ x: r.x, y: r.y, width: r.size, height: r.size, rx: r.rx })} fill="${r.layer === 'bg' ? c.backgroundColor : fill}"/>`);
  }));
  if (L.logo && !omitLogo) {
    const { x, y, size: s, pad } = L.logo;
    parts.push(`<rect ${attrs({ x: x - pad, y: y - pad, width: s + pad * 2, height: s + pad * 2, rx: pad * 1.2 })} fill="${c.backgroundColor}"/>`);
    parts.push(`<image ${attrs({ x, y, width: s, height: s })} preserveAspectRatio="xMidYMid meet" href="${c.logo.dataUrl}" xlink:href="${c.logo.dataUrl}"/>`);
  }
  parts.push('</svg>');
  return parts.join('');
}

export const svgDataUrl = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

export function projectThumbnail(project, px = 360) {
  const matrix = safeMatrix(project);
  return matrix ? svgDataUrl(buildSVGString(matrix, project.customization, px)) : null;
}

// Draws a logo onto an existing canvas using separate image loading to avoid
// the canvas-taint that occurs when an SVG data-URL embeds a foreign <image>.
async function drawLogoOnCanvas(canvas, matrix, c) {
  const L = computeLayout(matrix, c.margin, c.logo);
  if (!L.logo) return;
  const ctx = canvas.getContext('2d');
  const scale = c.size / L.total;
  const { x, y, size: s, pad } = L.logo;

  // Draw the background rect that clears space for the logo
  ctx.fillStyle = c.backgroundColor;
  const rx = pad * 1.2 * scale;
  const bx = (x - pad) * scale;
  const by = (y - pad) * scale;
  const bw = (s + pad * 2) * scale;
  const bh = (s + pad * 2) * scale;
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(bx, by, bw, bh, rx);
  } else {
    // Fallback for browsers without roundRect
    ctx.moveTo(bx + rx, by);
    ctx.arcTo(bx + bw, by, bx + bw, by + bh, rx);
    ctx.arcTo(bx + bw, by + bh, bx, by + bh, rx);
    ctx.arcTo(bx, by + bh, bx, by, rx);
    ctx.arcTo(bx, by, bx + bw, by, rx);
    ctx.closePath();
  }
  ctx.fill();

  // Draw the logo image directly (not through SVG) to avoid canvas tainting
  const logoImg = new Image();
  logoImg.src = c.logo.dataUrl;
  await logoImg.decode();
  ctx.drawImage(logoImg, x * scale, y * scale, s * scale, s * scale);
}

export async function exportImage(project, format = 'png') {
  const c = project.customization;
  const matrix = generateMatrix(project.encoded, c.errorCorrection);
  const hasLogo = Boolean(c.logo?.dataUrl);

  // For SVG export, embed everything including the logo (no taint issue in SVG files)
  if (format === 'svg') {
    const svg = buildSVGString(matrix, c, c.size);
    return new Blob([svg], { type: 'image/svg+xml' });
  }

  // For raster export, render SVG without the logo to avoid canvas tainting,
  // then draw the logo separately from its own Image element.
  const svg = buildSVGString(matrix, c, c.size, { omitLogo: hasLogo });
  const img = new Image();
  img.src = svgDataUrl(svg);
  await img.decode();
  const canvas = document.createElement('canvas');
  canvas.width = c.size;
  canvas.height = c.size;
  canvas.getContext('2d').drawImage(img, 0, 0, c.size, c.size);

  // Composite the logo onto the canvas directly
  if (hasLogo) {
    await drawLogoOnCanvas(canvas, matrix, c);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not create the image.'))), 'image/png');
  });
}

export function fileName(name, format) {
  const base = (name || 'qr-code').trim().replace(/[^\w\- ]+/g, '').replace(/\s+/g, '-').toLowerCase();
  return `${base || 'qr-code'}.${format}`;
}

export function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

// Shares only the image file - never the encoded content.
export async function shareImage(blob, name) {
  const file = new File([blob], fileName(name, 'png'), { type: 'image/png' });
  if (!navigator.canShare?.({ files: [file] })) return 'unsupported';
  try {
    await navigator.share({ files: [file], title: name });
    return 'shared';
  } catch (e) {
    return e?.name === 'AbortError' ? 'cancelled' : 'unsupported';
  }
}

export async function copyImage(blob) {
  if (!navigator.clipboard?.write || typeof window.ClipboardItem === 'undefined') {
    throw new Error("Copying images isn't supported in this browser.");
  }
  await navigator.clipboard.write([new window.ClipboardItem({ 'image/png': blob })]);
}

// Downscales very large logos so they can't bloat storage or break rendering.
export async function prepareLogo(file) {
  const MAX = 512;
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const w = img.naturalWidth || MAX;
    const h = img.naturalHeight || MAX;
    const scale = Math.min(1, MAX / Math.max(w, h));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    return { dataUrl: canvas.toDataURL('image/png'), downscaled: scale < 1 || file.size > 1024 * 1024 };
  } finally {
    URL.revokeObjectURL(url);
  }
}