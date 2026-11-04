import { useEffect, useState } from 'react';
import { outcomes, ui } from '../content/story.fr';
import { useJourney } from '../state/journeyStore';

export default function Outcome() {
  const answer = useJourney((s) => s.answer)!;
  const backToMap = useJourney((s) => s.backToMap);
  const o = outcomes[answer];
  const [ps, setPs] = useState(false);
  const [closed, setClosed] = useState(false);
  useEffect(() => {
    setPs(false);
    setClosed(false);
  }, [answer]);
  const onAction = () => (answer === 'no' ? setClosed(true) : backToMap());
  return (
    <section className={`card outcome outcome-${answer}`} aria-live="polite" data-testid={`outcome-${answer}`}>
      <h2>{o.title}</h2>
      <div className="card-body">
        {o.lines.map((l, i) => (
          <p key={i} className="fade-in">
            {l}
          </p>
        ))}
        {o.postscript &&
          (ps ? (
            <p className="postscript fade-in" data-testid="postscript">
              {o.postscript}
            </p>
          ) : (
            <button className="btn link" onClick={() => setPs(true)} data-testid="show-postscript">
              Un dernier petit mot (facultatif)…
            </button>
          ))}
        {closed && <p className="muted">{ui.end}</p>}
        <p className="muted small">{ui.privacy}</p>
      </div>
      {!closed && (
        <div className="card-actions">
          <button className="btn primary" onClick={onAction} data-testid="outcome-action">
            {o.action}
          </button>
        </div>
      )}
    </section>
  );
}
