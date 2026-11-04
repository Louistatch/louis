/**
 * Son 100 % original, synthétisé en direct (WebAudio) : nappe douce + carillons.
 * Aucun fichier audio à télécharger, aucun droit tiers. Désactivé par défaut.
 */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let pad: { stop: () => void } | null = null;

function ensure() {
  if (ctx) return ctx;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0.0;
  master.connect(ctx.destination);
  return ctx;
}

function startPad() {
  const c = ensure();
  if (!c || !master || pad) return;
  const filter = c.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 900;
  filter.connect(master);
  // accord doux (ré majeur 7) : ré, fa#, la, do#
  const freqs = [146.83, 185.0, 220.0, 277.18];
  const nodes = freqs.map((f, i) => {
    const o = c.createOscillator();
    o.type = i % 2 ? 'triangle' : 'sine';
    o.frequency.value = f;
    const g = c.createGain();
    g.gain.value = 0.05;
    const lfo = c.createOscillator();
    lfo.frequency.value = 0.07 + i * 0.03;
    const lg = c.createGain();
    lg.gain.value = 0.03;
    lfo.connect(lg).connect(g.gain);
    o.connect(g).connect(filter);
    o.start();
    lfo.start();
    return [o, lfo];
  });
  pad = { stop: () => nodes.flat().forEach((n) => n.stop()) };
}

export function setSound(on: boolean) {
  const c = ensure();
  if (!c || !master) return;
  if (on) {
    void c.resume();
    startPad();
    master.gain.cancelScheduledValues(c.currentTime);
    master.gain.linearRampToValueAtTime(0.6, c.currentTime + 1.5);
  } else {
    master.gain.cancelScheduledValues(c.currentTime);
    master.gain.linearRampToValueAtTime(0, c.currentTime + 0.4);
  }
}

export function chime(notes: number[] = [880, 1318.5], spacing = 0.12) {
  if (!ctx || !master || master.gain.value < 0.01) return;
  notes.forEach((f, i) => {
    const t = ctx!.currentTime + i * spacing;
    const o = ctx!.createOscillator();
    o.type = 'sine';
    o.frequency.value = f;
    const g = ctx!.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.12, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
    o.connect(g).connect(master!);
    o.start(t);
    o.stop(t + 1.7);
  });
}

export const celebrate = () => chime([587.33, 739.99, 880, 1174.66, 1479.98], 0.18);
