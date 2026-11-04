import { useEffect, useState } from 'react';
import { intro } from '../content/story.fr';
import { useJourney } from '../state/journeyStore';
import { useSettings } from '../state/settings';

/** CP0 — écran cinématique (~6 s), sautable à tout moment. */
export default function IntroScreen() {
  const reduce = useSettings((s) => s.reduceMotion);
  const [step, setStep] = useState(reduce ? 4 : 0);
  const start = useJourney((s) => s.start);
  const hasSaved = useJourney((s) => s.hasSaved);
  const restart = useJourney((s) => s.restart);
  const setSong = useSettings((s) => s.setSong);
  // Le toucher lance aussi la chanson : c'est ce geste qui autorise la lecture automatique.
  const go = () => {
    setSong(true);
    start();
  };
  useEffect(() => {
    if (step >= 4) return;
    const t = setTimeout(() => setStep((s) => s + 1), step === 0 ? 900 : 1700);
    return () => clearTimeout(t);
  }, [step]);
  return (
    <section className="intro" aria-labelledby="intro-title">
      <p className={`intro-kicker reveal ${step >= 1 ? 'on' : ''}`}>{intro.tagline}</p>
      <h1 id="intro-title" className={`intro-title reveal ${step >= 0 ? 'on' : ''}`}>
        {intro.title} <span aria-hidden="true">🌟</span>
        <small>{intro.subtitle}</small>
      </h1>
      <p className={`intro-message reveal ${step >= 2 ? 'on' : ''}`}>{intro.message}</p>
      <div className={`intro-actions reveal ${step >= 3 ? 'on' : ''}`}>
        <button className="btn primary big" onClick={go} data-testid="enter">
          {hasSaved ? intro.resume : intro.enter}
        </button>
        {hasSaved && (
          <button className="btn ghost" onClick={() => { restart(); setSong(true); setTimeout(() => useJourney.getState().start(), 0); }}>
            Recommencer depuis le début
          </button>
        )}
        <p className="intro-note">{intro.duration}</p>
      </div>
      {step < 4 && (
        <button className="btn link skip" onClick={() => setStep(4)} data-testid="skip-intro">
          {intro.skip}
        </button>
      )}
    </section>
  );
}
