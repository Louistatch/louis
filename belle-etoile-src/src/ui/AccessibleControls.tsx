import { useEffect, useState } from 'react';
import { checkpoints, ui } from '../content/story.fr';
import { isUnlocked } from '../state/journey';
import { useJourney } from '../state/journeyStore';
import { useSettings, type QualityChoice } from '../state/settings';
import { setSound } from './audio';

export function TopBar({ onSettings }: { onSettings: () => void }) {
  const mode = useJourney((s) => s.mode);
  const visited = useJourney((s) => s.visited.length);
  const openMap = useJourney((s) => s.openMap);
  const sound = useSettings((s) => s.sound);
  const toggle = useSettings((s) => s.setSound);
  return (
    <header className="topbar">
      <button className="pill" onClick={openMap} disabled={mode === 'map'} data-testid="open-map" aria-label="Ouvrir la carte de la constellation">
        ✦ {ui.map} <span className="count">{visited}/8</span>
      </button>
      <div className="row">
        <button
          className="pill icon"
          onClick={() => {
            toggle(!sound);
            setSound(!sound);
          }}
          aria-pressed={sound}
          aria-label={sound ? 'Couper le son' : 'Activer le son'}
          data-testid="sound"
        >
          {sound ? '🔊' : '🔇'}
        </button>
        <button className="pill icon" onClick={onSettings} aria-label={ui.settings} data-testid="open-settings">
          ⚙︎
        </button>
      </div>
    </header>
  );
}

export function SettingsSheet({ onClose, webgl }: { onClose: () => void; webgl: boolean }) {
  const s = useSettings();
  const restart = useJourney((x) => x.restart);
  const [fps, setFps] = useState<number | null>(null);
  useEffect(() => {
    const t = setInterval(() => setFps((window as unknown as { __fps?: number }).__fps ?? null), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <section className="sheet" role="dialog" aria-modal="true" aria-labelledby="settings-title" onClick={(e) => e.stopPropagation()}>
        <h2 id="settings-title">{ui.settings}</h2>
        <label className="toggle">
          <input type="checkbox" checked={s.reduceMotion} onChange={(e) => s.setReduceMotion(e.target.checked)} />
          <span>{ui.reduceMotion}</span>
        </label>
        {webgl && (
          <>
            <label className="toggle">
              <input type="checkbox" checked={s.explore} onChange={(e) => s.setExplore(e.target.checked)} data-testid="explore" />
              <span>{ui.explore}</span>
            </label>
            <fieldset className="quality">
              <legend>
                {ui.quality}
                {fps ? <small> · {fps} i/s</small> : null}
              </legend>
              {(['auto', 'low', 'medium', 'high'] as QualityChoice[]).map((q) => (
                <label key={q}>
                  <input type="radio" name="q" checked={s.quality === q} onChange={() => s.setQuality(q)} />
                  <span>{{ auto: `Auto (${s.effective})`, low: 'Légère', medium: 'Moyenne', high: 'Haute' }[q]}</span>
                </label>
              ))}
            </fieldset>
          </>
        )}
        <p className="muted small">{ui.privacy}</p>
        <div className="sheet-actions">
          <button
            className="btn ghost"
            onClick={() => {
              restart();
              onClose();
            }}
            data-testid="restart"
          >
            {ui.restart}
          </button>
          <button className="btn primary" onClick={onClose}>
            {ui.close}
          </button>
        </div>
      </section>
    </div>
  );
}

/** Liste accessible de la carte (doublon tactile/lecteur d'écran de la carte 3D). */
export function MapPanel() {
  const s = useJourney();
  return (
    <section className="card map-card" aria-labelledby="map-title" data-testid="map">
      <h2 id="map-title">{ui.mapTitle}</h2>
      <p className="muted small">{ui.mapHint}</p>
      <ol className="map-list">
        {checkpoints.map((c) => {
          const open = isUnlocked(s, c.id);
          const visited = s.visited.includes(c.id);
          return (
            <li key={c.id}>
              <button className={`map-node ${visited ? 'visited' : ''}`} disabled={!open} onClick={() => s.goTo(c.id)} data-testid={`node-${c.id}`}>
                <span className="dot" aria-hidden="true">{visited ? '★' : open ? '✦' : '·'}</span>
                <span>{open ? c.node : ui.locked}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
