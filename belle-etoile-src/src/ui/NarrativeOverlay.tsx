import { useState } from 'react';
import { checkpoints } from '../content/story.fr';
import { useJourney } from '../state/journeyStore';

/** Carte de récit : texte court, éléments à révéler (aussi accessibles sans 3D), un CTA principal. */
export default function NarrativeOverlay() {
  const current = useJourney((s) => s.current);
  const revealed = useJourney((s) => s.revealed[current] ?? []);
  const reveal = useJourney((s) => s.reveal);
  const next = useJourney((s) => s.next);
  const prev = useJourney((s) => s.prev);
  const [collapsed, setCollapsed] = useState(false);
  const cp = checkpoints[current - 1];
  const items = cp.reveals ?? [];
  const done = items.every((i) => revealed.includes(i.id));
  // le livre se feuillette dans l'ordre
  const ordered = cp.id === 2;
  return (
    <section className={`card ${collapsed ? 'collapsed' : ''}`} aria-labelledby="cp-title" data-testid={`cp-${cp.id}`}>
      <button className="card-handle" onClick={() => setCollapsed((c) => !c)} aria-expanded={!collapsed} aria-label={collapsed ? 'Afficher le texte' : 'Réduire le texte pour voir la scène'}>
        <span />
      </button>
      <p className="kicker">
        {cp.id}/8 · {cp.kicker}
      </p>
      <h2 id="cp-title">{cp.title}</h2>
      {!collapsed && (
        <div className="card-body">
          {cp.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {items.length > 0 && (
            <>
              {!done && cp.hint && <p className="hint">👆 {cp.hint}</p>}
              <ul className="reveals" aria-live="polite">
                {items.map((it, i) => {
                  const on = revealed.includes(it.id);
                  const canTap = !on && (!ordered || i === revealed.length);
                  return (
                    <li key={it.id}>
                      {on ? (
                        <div className="reveal-item on">
                          <strong>{it.title}</strong>
                          <span>{it.text}</span>
                        </div>
                      ) : (
                        <button className="reveal-item" disabled={!canTap} onClick={() => reveal(cp.id, it.id)} data-testid={`reveal-${it.id}`}>
                          <span aria-hidden="true">✦</span> {ordered ? `Page ${i + 1}` : items.length > 1 ? `Découvrir n°${i + 1}` : 'Découvrir'}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      )}
      <div className="card-actions">
        <button className="btn ghost" onClick={prev} disabled={current === 1} aria-label="Étape précédente">
          ←
        </button>
        <button className="btn primary" onClick={next} data-testid="continue">
          {cp.cta}
        </button>
      </div>
    </section>
  );
}
