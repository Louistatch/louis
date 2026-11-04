import { create } from 'zustand';
import type { Answer, CheckpointId } from '../content/story.fr';
import * as J from './journey';

const KEY = 'belle-etoile:progress:v1';

function load(): J.JourneyState {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? J.fromSaved(JSON.parse(raw)) : J.initialState();
  } catch {
    return J.initialState();
  }
}

function save(s: J.JourneyState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(J.toSaved(s)));
  } catch {
    /* stockage indisponible (navigation privée) : on continue sans sauvegarde */
  }
}

interface Store extends J.JourneyState {
  hasSaved: boolean;
  start: () => void;
  goTo: (id: CheckpointId) => void;
  next: () => void;
  prev: () => void;
  openMap: () => void;
  reveal: (id: CheckpointId, item: string) => void;
  revealNext: (id: CheckpointId) => void;
  choose: (a: Answer) => void;
  backToMap: () => void;
  restart: () => void;
}

const initial = load();

export const useJourney = create<Store>((set, get) => {
  const apply = (fn: (s: J.JourneyState) => J.JourneyState) => {
    const s = get();
    const nextState = fn({ mode: s.mode, current: s.current, visited: s.visited, revealed: s.revealed, answer: s.answer });
    set(nextState);
    save(nextState);
  };
  return {
    ...initial,
    hasSaved: initial.visited.length > 0,
    start: () => apply(J.start),
    goTo: (id) => apply((s) => J.goTo(s, id)),
    next: () => apply(J.next),
    prev: () => apply(J.prev),
    openMap: () => apply(J.openMap),
    reveal: (id, item) => apply((s) => J.reveal(s, id, item)),
    revealNext: (id) => apply((s) => J.revealNext(s, id)),
    choose: (a) => apply((s) => J.choose(s, a)),
    backToMap: () => apply(J.backToMap),
    restart: () => {
      try {
        localStorage.removeItem(KEY);
      } catch {
        /* rien */
      }
      set({ ...J.restart(), hasSaved: false });
    },
  };
});
