import * as THREE from 'three';

const cache = new Map<string, THREE.Texture>();

/** Halo radial (étoiles, lanternes, lucioles) : remplace un bloom coûteux. */
export function glowTexture(): THREE.Texture {
  const k = 'glow';
  if (cache.has(k)) return cache.get(k)!;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.18, 'rgba(255,255,255,0.75)');
  grd.addColorStop(0.45, 'rgba(255,255,255,0.18)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  cache.set(k, t);
  return t;
}

export interface LabelOpts {
  font?: string;
  color?: string;
  bg?: string | null;
  padding?: number;
  width?: number;
  lineHeight?: number;
  align?: CanvasTextAlign;
  title?: string;
  titleFont?: string;
  titleColor?: string;
  height?: number;
}

/** Texte rendu dans un canvas (pas de police à télécharger). */
export function textTexture(text: string, o: LabelOpts = {}): { tex: THREE.Texture; aspect: number } {
  const k = 'txt:' + text + JSON.stringify(o);
  const cached = cache.get(k);
  const width = o.width ?? 512;
  const pad = o.padding ?? 24;
  const font = o.font ?? '600 44px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
  const lh = o.lineHeight ?? 56;
  const c = document.createElement('canvas');
  const g = c.getContext('2d')!;
  // découpe en lignes
  const wrap = (str: string, f: string) => {
    g.font = f;
    const out: string[] = [];
    for (const para of str.split('\n')) {
      let line = '';
      for (const w of para.split(' ')) {
        const t = line ? line + ' ' + w : w;
        if (g.measureText(t).width > width - pad * 2 && line) {
          out.push(line);
          line = w;
        } else line = t;
      }
      out.push(line);
    }
    return out;
  };
  const titleFont = o.titleFont ?? '700 46px Georgia, "Times New Roman", serif';
  const tLines = o.title ? wrap(o.title, titleFont) : [];
  const lines = text ? wrap(text, font) : [];
  const h = o.height ?? Math.ceil(pad * 2 + tLines.length * (lh + 6) + (tLines.length ? 18 : 0) + lines.length * lh);
  if (cached) return { tex: cached, aspect: width / h };
  c.width = width;
  c.height = h;
  if (o.bg) {
    g.fillStyle = o.bg;
    const r = 28;
    g.beginPath();
    g.roundRect(0, 0, width, h, r);
    g.fill();
  }
  g.textAlign = o.align ?? 'center';
  g.textBaseline = 'top';
  const x = g.textAlign === 'center' ? width / 2 : pad;
  let y = pad;
  if (tLines.length) {
    g.font = titleFont;
    g.fillStyle = o.titleColor ?? o.color ?? '#fff';
    for (const l of tLines) {
      g.fillText(l, x, y);
      y += lh + 6;
    }
    y += 18;
  }
  g.font = font;
  g.fillStyle = o.color ?? '#fff';
  for (const l of lines) {
    g.fillText(l, x, y);
    y += lh;
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  cache.set(k, tex);
  return { tex, aspect: width / h };
}
