import { useEffect } from 'react';

/** Glissement horizontal (≥ 60 px, plutôt horizontal) → précédent / suivant. */
export function useSwipe(el: HTMLElement | null, onLeft: () => void, onRight: () => void, enabled: boolean) {
  useEffect(() => {
    if (!el || !enabled) return;
    let x0 = 0, y0 = 0, t0 = 0, active = false;
    const down = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      active = true;
      x0 = e.clientX;
      y0 = e.clientY;
      t0 = performance.now();
    };
    const up = (e: PointerEvent) => {
      if (!active) return;
      active = false;
      const dx = e.clientX - x0, dy = e.clientY - y0;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5 && performance.now() - t0 < 800) (dx < 0 ? onLeft : onRight)();
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointerup', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointerup', up);
    };
  }, [el, onLeft, onRight, enabled]);
}
