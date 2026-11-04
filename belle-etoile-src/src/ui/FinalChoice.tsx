import { useEffect, useState } from 'react';
import { answers, checkpoints, question } from '../content/story.fr';
import { useJourney } from '../state/journeyStore';
import { useSettings } from '../state/settings';

/** CP8 — texte progressif (sautable), puis trois choix égaux. Aucun minuteur, aucune pression. */
export function FinalLetter() {
  const reduce = useSettings((s) => s.reduceMotion);
  const lines = checkpoints[7].paragraphs;
  const [shown, setShown] = useState(reduce ? lines.length : 1);
  const next = useJourney((s) => s.next);
  const prev = useJourney((s) => s.prev);
  useEffect(() => {
    if (shown >= lines.length) return;
    const t = setTimeout(() => setShown((n) => n + 1), 1800);
    return () => clearTimeout(t);
  }, [shown, lines.length]);
  const all = shown >= lines.length;
  return (
    <section className="card letter" aria-labelledby="letter-title" data-testid="cp-8">
      <p className="kicker">8/8 · {checkpoints[7].kicker}</p>
      <h2 id="letter-title" className="sr-only">
        {checkpoints[7].title}
      </h2>
      <div className="card-body" aria-live="polite">
        {lines.slice(0, shown).map((p, i) => (
          <p key={i} className="fade-in">
            {p}
          </p>
        ))}
        {all && <p className="question fade-in">{question}</p>}
      </div>
      <div className="card-actions">
        <button className="btn ghost" onClick={prev} aria-label="Étape précédente">
          ←
        </button>
        {all ? (
          <button className="btn primary" onClick={next} data-testid="continue">
            {checkpoints[7].cta}
          </button>
        ) : (
          <button className="btn primary" onClick={() => setShown(lines.length)} data-testid="show-all">
            Tout afficher
          </button>
        )}
      </div>
    </section>
  );
}

export function ChoicePanel() {
  const choose = useJourney((s) => s.choose);
  const prev = useJourney((s) => s.prev);
  return (
    <section className="card choices" aria-labelledby="q-title" data-testid="choices">
      <h2 id="q-title" className="question">
        {question}
      </h2>
      <p className="muted small">Toutes les réponses sont bienvenues. Prends ton temps.</p>
      <div className="choice-list">
        {answers.map((a) => (
          <button key={a.id} className="btn choice" onClick={() => choose(a.id)} data-testid={`answer-${a.id}`}>
            {a.label}
          </button>
        ))}
      </div>
      <button className="btn link" onClick={prev}>
        Relire la lettre
      </button>
    </section>
  );
}
