import { useEffect, useRef } from 'react';
import { SONG_ID, ui } from '../content/story.fr';
import { useSettings } from '../state/settings';

/**
 * Lecteur YouTube officiel, visible (pas d'extraction ni de lecteur caché).
 * Il est créé au moment du toucher « C'est parti », ce qui autorise l'autoplay avec le son
 * sur la plupart des Android ; sinon, un ▶ dans la vidéo suffit. Boucle sur la même chanson.
 */
export default function SongDock() {
  const song = useSettings((s) => s.song);
  const frame = useRef<HTMLIFrameElement>(null);

  // Relance « playVideo » par l'API postMessage au cas où l'autoplay serait retenu.
  useEffect(() => {
    if (!song) return;
    const kick = () =>
      frame.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');
    const timers = [600, 1500, 3000].map((t) => setTimeout(kick, t));
    return () => timers.forEach(clearTimeout);
  }, [song]);

  if (!song) return null;
  const origin = encodeURIComponent(location.origin);
  const src = `https://www.youtube-nocookie.com/embed/${SONG_ID}?autoplay=1&loop=1&playlist=${SONG_ID}&playsinline=1&controls=1&rel=0&enablejsapi=1&origin=${origin}`;
  return (
    <aside className="song-dock" aria-label="Lecteur de la chanson" data-testid="song-dock">
      <div className="song-head">
        <strong>{ui.song.title}</strong>
      </div>
      <iframe
        ref={frame}
        title="Notre chanson — vidéo YouTube"
        src={src}
        allow="autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <p className="song-note">
        {ui.song.help}{' '}
        <a href={`https://youtu.be/${SONG_ID}`} target="_blank" rel="noopener noreferrer">
          {ui.song.open}
        </a>
      </p>
    </aside>
  );
}
