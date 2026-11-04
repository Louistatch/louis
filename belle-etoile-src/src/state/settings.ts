import { create } from 'zustand';

export type Quality = 'low' | 'medium' | 'high';
export type QualityChoice = Quality | 'auto';

interface Settings {
  sound: boolean;
  reduceMotion: boolean;
  quality: QualityChoice;
  /** Niveau effectif (auto peut descendre si le téléphone peine). */
  effective: Quality;
  explore: boolean;
  setSound: (v: boolean) => void;
  setReduceMotion: (v: boolean) => void;
  setQuality: (v: QualityChoice) => void;
  setEffective: (v: Quality) => void;
  setExplore: (v: boolean) => void;
}

const KEY = 'belle-etoile:prefs:v1';

export function detectQuality(): Quality {
  if (typeof navigator === 'undefined') return 'medium';
  const cores = navigator.hardwareConcurrency ?? 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const mobile = /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);
  if (cores <= 4 || mem <= 3) return 'low';
  if (mobile) return 'medium';
  return 'high';
}

function loadPrefs(): Partial<Pick<Settings, 'reduceMotion' | 'quality'>> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}');
  } catch {
    return {};
  }
}

function savePrefs(p: Pick<Settings, 'reduceMotion' | 'quality'>) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* rien */
  }
}

const prefersReduced =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const saved = loadPrefs();
const q0: QualityChoice = saved.quality ?? 'auto';

export const useSettings = create<Settings>((set, get) => ({
  // Son toujours désactivé au chargement.
  sound: false,
  reduceMotion: saved.reduceMotion ?? !!prefersReduced,
  quality: q0,
  effective: q0 === 'auto' ? detectQuality() : q0,
  explore: false,
  setSound: (sound) => set({ sound }),
  setReduceMotion: (reduceMotion) => {
    set({ reduceMotion });
    savePrefs({ reduceMotion, quality: get().quality });
  },
  setQuality: (quality) => {
    set({ quality, effective: quality === 'auto' ? detectQuality() : quality });
    savePrefs({ reduceMotion: get().reduceMotion, quality });
  },
  setEffective: (effective) => set({ effective }),
  setExplore: (explore) => set({ explore }),
}));

export const budget = (q: Quality) =>
  ({
    low: { dpr: 1, stars: 500, fireflies: 16, grass: 160, segments: 16 },
    medium: { dpr: 1.5, stars: 1100, fireflies: 32, grass: 420, segments: 24 },
    high: { dpr: 2, stars: 2000, fireflies: 60, grass: 900, segments: 32 },
  })[q];
