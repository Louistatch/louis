import { describe, expect, it } from 'vitest';
import * as J from '../src/state/journey';
import { checkpoints } from '../src/content/story.fr';

const walkToChoice = () => {
  let s = J.start(J.initialState());
  for (let i = 0; i < 7; i++) s = J.next(s);
  return J.next(s); // CP8 -> choix
};

describe('parcours', () => {
  it('a 8 checkpoints avec titre et CTA', () => {
    expect(checkpoints.map((c) => c.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    checkpoints.forEach((c) => expect(c.title && c.cta && c.paragraphs.length).toBeTruthy());
  });

  it('démarre sur CP1 et le marque visité', () => {
    const s = J.start(J.initialState());
    expect(s.mode).toBe('scene');
    expect(s.current).toBe(1);
    expect(s.visited).toEqual([1]);
  });

  it('avance jusqu’au choix final', () => {
    const s = walkToChoice();
    expect(s.mode).toBe('choice');
    expect(s.visited).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('bloque les étapes non débloquées sur la carte, autorise le retour', () => {
    let s = J.start(J.initialState());
    expect(J.goTo(s, 5)).toBe(s);
    s = J.next(s);
    s = J.goTo(s, 3);
    expect(s.current).toBe(3);
    s = J.goTo(s, 1);
    expect(s.current).toBe(1);
  });

  it('précédent depuis le choix revient à la scène 8', () => {
    const s = J.prev(walkToChoice());
    expect(s.mode).toBe('scene');
    expect(s.current).toBe(8);
  });

  it('révèle les éléments dans l’ordre sans doublon et ignore les inconnus', () => {
    let s = J.start(J.initialState());
    s = J.revealNext(s, 2);
    s = J.revealNext(s, 2);
    expect(s.revealed[2]).toEqual(['p1', 'p2']);
    expect(J.reveal(s, 2, 'p1')).toBe(s);
    expect(J.reveal(s, 2, 'nope')).toBe(s);
  });
});

describe('réponses', () => {
  for (const a of ['yes', 'talk', 'no'] as const) {
    it(`« ${a} » mène à l’écran de résultat correspondant`, () => {
      const s = J.choose(walkToChoice(), a);
      expect(s.mode).toBe('outcome');
      expect(s.answer).toBe(a);
    });
  }

  it('ne permet pas de répondre hors de l’écran de choix', () => {
    const s = J.start(J.initialState());
    expect(J.choose(s, 'yes')).toBe(s);
  });

  it('la réponse n’est jamais sauvegardée', () => {
    const s = J.choose(walkToChoice(), 'yes');
    expect(JSON.stringify(J.toSaved(s))).not.toContain('yes');
    expect(J.fromSaved(J.toSaved(s)).answer).toBeNull();
  });

  it('« en parler » peut revenir à la carte', () => {
    const s = J.backToMap(J.choose(walkToChoice(), 'talk'));
    expect(s.mode).toBe('map');
    expect(s.answer).toBeNull();
  });
});

describe('sauvegarde', () => {
  it('rejette des données corrompues', () => {
    expect(J.fromSaved('x')).toEqual(J.initialState());
    const s = J.fromSaved({ current: 42, visited: [1, 99, 'a', 2], revealed: { 3: ['listen', 5], 77: ['x'] } });
    expect(s.current).toBe(1);
    expect(s.visited).toEqual([1, 2]);
    expect(s.revealed).toEqual({ 3: ['listen'] });
  });
});
