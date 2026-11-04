import { checkpoints, type Answer, type CheckpointId } from '../content/story.fr';

/** État de progression déterministe, sans dépendance au DOM (testable). */
export type Mode = 'intro' | 'scene' | 'map' | 'choice' | 'outcome';

export interface JourneyState {
  mode: Mode;
  current: CheckpointId;
  visited: CheckpointId[];
  /** Éléments révélés par checkpoint (lanternes, pages, étoiles…). */
  revealed: Partial<Record<CheckpointId, string[]>>;
  /** Réponse finale : jamais persistée, reste dans la session. */
  answer: Answer | null;
}

export const LAST: CheckpointId = 8;

export const initialState = (): JourneyState => ({
  mode: 'intro',
  current: 1,
  visited: [],
  revealed: {},
  answer: null,
});

const clamp = (n: number): CheckpointId => Math.min(LAST, Math.max(1, n)) as CheckpointId;
const markVisited = (v: CheckpointId[], id: CheckpointId) => (v.includes(id) ? v : [...v, id].sort((a, b) => a - b));

/** Plus haut checkpoint accessible : tous les visités + le suivant. */
export const maxUnlocked = (s: JourneyState): CheckpointId =>
  clamp(s.visited.length ? Math.max(...s.visited) + 1 : 1);

export const isUnlocked = (s: JourneyState, id: CheckpointId) => id <= maxUnlocked(s);

export function start(s: JourneyState): JourneyState {
  return { ...s, mode: 'scene', current: s.current, visited: markVisited(s.visited, s.current) };
}

export function goTo(s: JourneyState, id: CheckpointId): JourneyState {
  if (!isUnlocked(s, id)) return s;
  return { ...s, mode: 'scene', current: id, visited: markVisited(s.visited, id) };
}

export function next(s: JourneyState): JourneyState {
  if (s.current === LAST) return { ...s, mode: 'choice' };
  const id = clamp(s.current + 1);
  return { ...s, mode: 'scene', current: id, visited: markVisited(s.visited, id) };
}

export function prev(s: JourneyState): JourneyState {
  if (s.mode === 'choice') return { ...s, mode: 'scene' };
  if (s.current === 1) return s;
  return { ...s, mode: 'scene', current: clamp(s.current - 1) };
}

export function openMap(s: JourneyState): JourneyState {
  return { ...s, mode: 'map' };
}

export function reveal(s: JourneyState, id: CheckpointId, item: string): JourneyState {
  const known = checkpoints.find((c) => c.id === id)?.reveals?.some((r) => r.id === item);
  if (!known) return s;
  const list = s.revealed[id] ?? [];
  if (list.includes(item)) return s;
  return { ...s, revealed: { ...s.revealed, [id]: [...list, item] } };
}

/** Révèle l'élément suivant non encore vu (livre : pages dans l'ordre). */
export function revealNext(s: JourneyState, id: CheckpointId): JourneyState {
  const items = checkpoints.find((c) => c.id === id)?.reveals ?? [];
  const seen = s.revealed[id] ?? [];
  const nextItem = items.find((r) => !seen.includes(r.id));
  return nextItem ? reveal(s, id, nextItem.id) : s;
}

/** Les trois réponses sont traitées à égalité : aucune n'est bloquée ni redirigée. */
export function choose(s: JourneyState, answer: Answer): JourneyState {
  if (s.mode !== 'choice') return s;
  return { ...s, mode: 'outcome', answer };
}

export function backToMap(s: JourneyState): JourneyState {
  return { ...s, mode: 'map', answer: null };
}

export function restart(): JourneyState {
  return initialState();
}

/** Ce qui est sauvegardé localement : uniquement la progression, jamais la réponse. */
export function toSaved(s: JourneyState) {
  return { current: s.current, visited: s.visited, revealed: s.revealed };
}

export function fromSaved(raw: unknown): JourneyState {
  const base = initialState();
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Partial<ReturnType<typeof toSaved>>;
  const valid = (n: unknown): n is CheckpointId => Number.isInteger(n) && (n as number) >= 1 && (n as number) <= LAST;
  const visited = Array.isArray(r.visited) ? (r.visited.filter(valid) as CheckpointId[]) : [];
  const revealed: JourneyState['revealed'] = {};
  if (r.revealed && typeof r.revealed === 'object') {
    for (const [k, v] of Object.entries(r.revealed)) {
      const id = Number(k);
      if (valid(id) && Array.isArray(v)) revealed[id] = v.filter((x) => typeof x === 'string');
    }
  }
  return { ...base, current: valid(r.current) ? r.current : 1, visited: [...new Set(visited)].sort(), revealed };
}
