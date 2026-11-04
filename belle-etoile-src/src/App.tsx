import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ui } from './content/story.fr';
import { useJourney } from './state/journeyStore';
import { useSettings } from './state/settings';
import { MapPanel, SettingsSheet, TopBar } from './ui/AccessibleControls';
import { celebrate, chime } from './ui/audio';
import { ChoicePanel, FinalLetter } from './ui/FinalChoice';
import IntroScreen from './ui/IntroScreen';
import NarrativeOverlay from './ui/NarrativeOverlay';
import Outcome from './ui/Outcome';
import { useSwipe } from './ui/useSwipe';
import WebGLFallback, { hasWebGL } from './ui/WebGLFallback';

// La 3D est chargée à part : le texte d'intro s'affiche avant three.js.
const SceneCanvas = lazy(() => import('./three/SceneCanvas'));

class GLBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function Loading() {
  return (
    <div className="loading" role="status">
      <span className="spinner" aria-hidden="true" /> Les étoiles s’allument…
    </div>
  );
}

export default function ExperienceShell() {
  const [webgl, setWebgl] = useState(() => hasWebGL());
  const [settings, setSettings] = useState(false);
  const mode = useJourney((s) => s.mode);
  const current = useJourney((s) => s.current);
  const answer = useJourney((s) => s.answer);
  const next = useJourney((s) => s.next);
  const prev = useJourney((s) => s.prev);
  const reduce = useSettings((s) => s.reduceMotion);
  const explore = useSettings((s) => s.explore);
  const stage = useRef<HTMLDivElement>(null);
  const [stageEl, setStageEl] = useState<HTMLDivElement | null>(null);
  useEffect(() => setStageEl(stage.current), []);

  const onLeft = useCallback(() => mode === 'scene' && next(), [mode, next]);
  const onRight = useCallback(() => (mode === 'scene' || mode === 'choice') && prev(), [mode, prev]);
  useSwipe(stageEl, onLeft, onRight, !explore);

  // carillon discret à chaque révélation, accord doux pour « oui » (si le son est activé)
  useEffect(
    () =>
      useJourney.subscribe((s, p) => {
        const n = Object.values(s.revealed).flat().length;
        const o = Object.values(p.revealed).flat().length;
        if (n > o) chime();
        if (s.answer === 'yes' && p.answer !== 'yes') celebrate();
      }),
    [],
  );

  // contexte WebGL perdu → bascule sur la version légère
  useEffect(() => {
    const onLost = () => setWebgl(false);
    window.addEventListener('webglcontextlost', onLost, true);
    return () => window.removeEventListener('webglcontextlost', onLost, true);
  }, []);

  const sceneKey = mode === 'intro' ? 'intro' : mode === 'map' ? 'map' : mode === 'scene' ? String(current) : 'final';

  return (
    <div className={`shell ${reduce ? 'reduce' : ''} mode-${mode} ${answer ? 'answer-' + answer : ''}`}>
      <div className="stage" ref={stage}>
        {webgl ? (
          <GLBoundary onError={() => setWebgl(false)}>
            <Suspense fallback={<Loading />}>
              <SceneCanvas />
            </Suspense>
          </GLBoundary>
        ) : (
          <WebGLFallback />
        )}
        <div key={sceneKey} className="fade-veil" aria-hidden="true" />
      </div>
      {!webgl && mode !== 'intro' && <p className="fallback-note">{ui.noWebgl}</p>}
      {mode !== 'intro' && <TopBar onSettings={() => setSettings(true)} />}
      <main className="overlay">
        {mode === 'intro' && <IntroScreen />}
        {mode === 'scene' && current < 8 && <NarrativeOverlay key={current} />}
        {mode === 'scene' && current === 8 && <FinalLetter />}
        {mode === 'choice' && <ChoicePanel />}
        {mode === 'outcome' && answer && <Outcome />}
        {mode === 'map' && <MapPanel />}
      </main>
      {settings && <SettingsSheet webgl={webgl} onClose={() => setSettings(false)} />}
    </div>
  );
}
