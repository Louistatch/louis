/**
 * Toute la narration de l'expérience. Modifier les textes ici,
 * sans toucher aux composants. Rester sobre : gestes concrets > grandes déclarations.
 */

export type CheckpointId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface Reveal {
  id: string;
  title: string;
  text: string;
}

export interface Checkpoint {
  id: CheckpointId;
  /** Nom court du nœud sur la carte mentale. */
  node: string;
  kicker: string;
  title: string;
  paragraphs: string[];
  /** Consigne d'interaction (tap) affichée dans la scène. */
  hint?: string;
  /** Éléments révélés par interaction dans la scène 3D. */
  reveals?: Reveal[];
  cta: string;
}

export const intro = {
  title: 'Opération Belle Étoile',
  subtitle: 'Le chemin vers nous',
  tagline: 'Une étoile a changé ma façon de regarder le ciel.',
  message:
    "Justine, tu m'as dit que je ne savais pas draguer. J'ai donc décidé de te montrer plutôt que de te faire de longs discours.",
  enter: 'Entrer dans notre constellation',
  skip: "Passer l'intro",
  resume: 'Reprendre là où tu t’étais arrêtée',
  duration: 'Environ 5 minutes · à ton rythme · sans son par défaut',
};

export const checkpoints: Checkpoint[] = [
  {
    id: 1,
    node: 'Hello',
    kicker: '25 septembre 2026',
    title: 'Hello Juju',
    paragraphs: [
      'Tout a commencé par un simple « Hello ». Rien d’extraordinaire… et pourtant.',
      'Certaines rencontres arrivent sans prévenir et rallument un coin du ciel.',
    ],
    hint: 'Touche la bulle pour allumer la première étoile.',
    reveals: [{ id: 'first-star', title: 'Première étoile', text: 'Elle porte ton nom : Belle Étoile 🌟' }],
    cta: 'Continuer',
  },
  {
    id: 2,
    node: 'Romantisme',
    kicker: 'Le défi',
    title: 'Le défi du romantisme',
    paragraphs: ['Tu m’as dit : attentionné, oui. Romantique, pas encore.', 'Alors j’ai ouvert le chapitre 1.'],
    hint: 'Touche le livre pour tourner les pages.',
    reveals: [
      {
        id: 'p1',
        title: 'Le livre de romantisme de Louis',
        text: 'Édition très, très limitée. Auteur encore en formation.',
      },
      {
        id: 'p2',
        title: 'Chapitre 1 · Kabyè tchouka tchouka',
        text: 'Règle n°1 : te faire rire avant de faire des promesses.',
      },
      {
        id: 'p3',
        title: 'Chapitre 2 · Apprendre à mieux te connaître',
        text: 'Moins de belles paroles. Plus d’écoute, de patience et de vrais moments.',
      },
    ],
    cta: 'Continuer',
  },
  {
    id: 3,
    node: 'Petits gestes',
    kicker: 'Le jardin',
    title: 'Le jardin des petits gestes',
    paragraphs: [
      'Tu préfères les gestes aux belles paroles. Alors voici trois engagements.',
      'Pas des preuves déjà faites : des intentions que je devrai tenir, jour après jour.',
    ],
    hint: 'Touche les trois lanternes.',
    reveals: [
      {
        id: 'listen',
        title: 'Écouter sans minimiser',
        text: 'Quand quelque chose compte pour toi, l’entendre vraiment, sans le balayer d’une phrase.',
      },
      {
        id: 'present',
        title: 'Être présent par mes actes',
        text: 'Être là dans les petites choses du quotidien, pas seulement dans les mots.',
      },
      {
        id: 'truth',
        title: 'Dire la vérité, même difficile',
        text: 'Préférer une vérité inconfortable à un silence ou à une belle histoire.',
      },
    ],
    cta: 'Continuer',
  },
  {
    id: 4,
    node: 'Kara ⇄ Lomé',
    kicker: 'La distance',
    title: 'Le pont entre Kara et Lomé',
    paragraphs: [
      'Quelques kilomètres peuvent séparer deux personnes. Ce qui les rapproche, c’est l’envie de se retrouver.',
      'J’aimerais t’inviter à un vrai rendez-vous, où l’on pourra parler, rire et apprendre à se connaître.',
    ],
    hint: 'Touche une des deux rives pour allumer le pont.',
    reveals: [{ id: 'bridge', title: 'Le pont est allumé', text: 'Il suffit d’un premier pas de chaque côté.' }],
    cta: 'Continuer',
  },
  {
    id: 5,
    node: 'Tes rêves',
    kicker: 'L’horizon',
    title: 'Tes rêves comptent',
    paragraphs: [
      'Je ne veux pas t’aimer à la place de tes rêves. Je voudrais apprendre à faire de la place aux tiens, comme aux miens.',
      'Tes projets, y compris celui de voyager, t’appartiennent. Un projet commun, s’il naît un jour, se construira avec de vraies discussions et des ajustements des deux côtés.',
    ],
    hint: 'Touche la valise pour ouvrir l’horizon.',
    reveals: [{ id: 'portal', title: 'L’horizon est ouvert', text: 'Et il le restera.' }],
    cta: 'Continuer',
  },
  {
    id: 6,
    node: 'Boussole',
    kicker: 'L’essentiel',
    title: 'La boussole des choses essentielles',
    paragraphs: ['Quatre étoiles pour garder le cap. Pas un test, pas une note : juste ce qui compte pour moi.'],
    hint: 'Touche les quatre étoiles de la boussole.',
    reveals: [
      { id: 'trust', title: 'Confiance', text: 'La mériter, pas la réclamer.' },
      { id: 'loyalty', title: 'Fidélité', text: 'Choisir la même personne, aussi les jours ordinaires.' },
      { id: 'respect', title: 'Respect', text: 'Ta liberté, tes choix et ton rythme comptent autant que les miens.' },
      { id: 'dialogue', title: 'Dialogue', text: 'Parler même quand c’est difficile, plutôt que laisser le silence décider.' },
    ],
    cta: 'Continuer',
  },
  {
    id: 7,
    node: 'Horizon 2027',
    kicker: 'Une possibilité',
    title: 'Horizon 2027',
    paragraphs: [
      'En 2027, si la vie nous le permet et si nous faisons tous les deux ce choix, j’aimerais construire avec toi quelque chose d’assez beau et solide pour envisager le mariage.',
      'Mais tout commence par une décision simple : apprendre à vraiment se choisir.',
    ],
    cta: 'Continuer',
  },
  {
    id: 8,
    node: 'La question',
    kicker: 'Enfin',
    title: 'La question',
    paragraphs: [
      'Justine,',
      'Je ne suis peut-être pas le roi des déclarations.',
      'Mais je sais que tu comptes pour moi.',
      'J’aimerais apprendre à te séduire autrement : avec de l’attention, de la constance, de la vérité et des moments qui nous ressemblent.',
      'Je ne veux pas décider de notre avenir tout seul.',
      'Alors je te pose enfin la question que je n’avais peut-être jamais vraiment osé te poser :',
    ],
    cta: 'Voir les réponses',
  },
];

export const question =
  'Accepterais-tu que nous commencions une relation sincère, sérieuse, à notre rythme, avec l’envie de voir jusqu’où notre histoire peut nous mener ?';

export type Answer = 'yes' | 'talk' | 'no';

export const answers: { id: Answer; label: string }[] = [
  { id: 'yes', label: 'Oui, j’accepte ❤️' },
  { id: 'talk', label: 'J’aimerais qu’on en parle 💬' },
  { id: 'no', label: 'Je préfère ne pas m’engager' },
];

export const outcomes: Record<Answer, { title: string; lines: string[]; postscript?: string; action: string }> = {
  yes: {
    title: 'Merci 🌟',
    lines: ['Alors commençons par un vrai rendez-vous.', 'Merci de me donner cette chance. 🌟'],
    postscript: 'Et peut-être qu’un jour, si nous le choisissons ensemble… Mme TATCHIDA ✨',
    action: 'Revoir la constellation',
  },
  talk: {
    title: 'On en parle',
    lines: ['J’aimerais t’écouter.', 'Aucune réponse n’est urgente.'],
    action: 'Revenir à la constellation',
  },
  no: {
    title: 'Merci',
    lines: ['Merci d’avoir parcouru cet univers.', 'Je respecte entièrement ton choix.'],
    action: 'Fermer',
  },
};

export const ui = {
  map: 'Carte',
  mapTitle: 'Notre constellation',
  mapHint: 'Touche une étoile pour (re)visiter un moment.',
  prev: 'Précédent',
  skip: 'Passer',
  restart: 'Recommencer',
  close: 'Fermer',
  settings: 'Réglages',
  sound: 'Son',
  reduceMotion: 'Réduire les animations',
  quality: 'Qualité 3D',
  explore: 'Explorer (glisser pour tourner)',
  locked: 'Encore à découvrir',
  noWebgl: 'Ton téléphone n’affiche pas la 3D : voici la version légère, avec la même histoire.',
  privacy: 'Rien n’est enregistré ni envoyé : ta réponse reste sur cet écran.',
  end: 'Fin du parcours. Tu peux fermer cette page quand tu veux.',
};
