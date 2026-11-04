import { useMemo } from 'react';

/** Décor 2.5D en CSS pour les appareils sans WebGL : même histoire, mêmes choix. */
export default function WebGLFallback() {
  const stars = useMemo(
    () => Array.from({ length: 70 }, (_, i) => ({ left: (i * 37) % 100, top: (i * 53) % 70, d: (i % 7) * 0.6, s: 1 + (i % 3) })),
    [],
  );
  return (
    <div className="fallback-sky" aria-hidden="true">
      {stars.map((s, i) => (
        <i key={i} style={{ left: s.left + '%', top: s.top + '%', animationDelay: s.d + 's', width: s.s, height: s.s }} />
      ))}
      <div className="fallback-star" />
      <div className="fallback-hills back" />
      <div className="fallback-hills" />
    </div>
  );
}

export function hasWebGL(): boolean {
  try {
    if (new URLSearchParams(location.search).has('nowebgl')) return false;
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}
