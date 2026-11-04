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
  title: 'Belle Étoile',
  subtitle: 'Une surprise juste pour toi ❤️',
  tagline: 'Justine, cette fois, je te drague !',
  message:
    "Tu m'as dit : « Tu ne m'as jamais vraiment draguée ! » 😄 Alors j'ai préparé cette surprise. Suis les étoiles, je vais te dire ce que j'ai sur le cœur.",
  enter: "C'est parti ! ❤️",
  skip: 'Passer',
  resume: 'Reprendre là où tu étais ❤️',
  duration: 'Quelques petites étapes · à ton rythme · avec notre chanson 🎵',
};

export const checkpoints: Checkpoint[] = [
  {
    id: 1,
    node: 'Nos messages',
    kicker: 'Nos messages',
    title: 'J’aime parler avec toi 😊',
    paragraphs: [
      'Au début, c’était juste un « Hello ». Maintenant, j’aime nos discussions.',
      'Tu me fais sourire, même de loin.',
    ],
    hint: 'Touche la bulle.',
    reveals: [{ id: 'first-star', title: 'Une étoile s’allume ✨', text: 'Elle s’appelle Belle Étoile. Comme toi 🌟' }],
    cta: 'Continuer',
  },
  {
    id: 2,
    node: 'Ton défi',
    kicker: 'Ton défi',
    title: 'Pas assez romantique ? 😅',
    paragraphs: [
      'Tu m’as dit que je suis attentionné, mais pas romantique.',
      'J’ai bien entendu ! Alors j’ai ouvert mon livre de romantisme…',
    ],
    hint: 'Touche le livre pour tourner les pages.',
    reveals: [
      { id: 'p1', title: 'Mon livre de romantisme', text: 'Édition très limitée. L’auteur apprend encore 😄' },
      { id: 'p2', title: 'Kabyè tchouka tchouka', text: 'Règle n°1 : te faire rire.' },
      { id: 'p3', title: 'Apprendre à te connaître', text: 'Moins de belles paroles. Plus d’écoute et de vrais moments.' },
    ],
    cta: 'Continuer',
  },
  {
    id: 3,
    node: 'Mes intentions',
    kicker: 'Mes intentions',
    title: 'Ce que j’aimerais faire pour toi ❤️',
    paragraphs: ['Les actes comptent plus que les mots. Voici trois promesses que je veux tenir.'],
    hint: 'Touche les trois lanternes.',
    reveals: [
      { id: 'listen', title: 'T’écouter', text: 'Vraiment t’écouter quand tu parles.' },
      { id: 'present', title: 'Être là', text: 'Être présent, même dans les petites choses.' },
      { id: 'truth', title: 'Te dire la vérité', text: 'Toujours être franc avec toi, même quand c’est difficile.' },
    ],
    cta: 'Continuer',
  },
  {
    id: 4,
    node: 'Un rendez-vous',
    kicker: 'Kara ⇄ Lomé',
    title: 'Tu acceptes une sortie avec moi ? 😊',
    paragraphs: [
      'La distance entre Kara et Lomé ne fait pas peur quand on a envie de se voir.',
      'J’aimerais passer un vrai moment avec toi. Juste discuter, rigoler et mieux se connaître.',
    ],
    hint: 'Touche Kara ou Lomé pour allumer le pont.',
    reveals: [{ id: 'bridge', title: 'Le pont est allumé ✨', text: 'Il suffit d’un pas de chaque côté.' }],
    cta: 'Continuer',
  },
  {
    id: 5,
    node: 'Tes rêves',
    kicker: 'Tes rêves',
    title: 'Tes projets sont importants ✨',
    paragraphs: [
      'Tu as tes projets, j’ai les miens. Ton projet de voyage compte, et je ne te demanderai jamais d’y renoncer.',
      'J’aimerais qu’on s’encourage et qu’on soit fiers l’un de l’autre.',
    ],
    hint: 'Touche la valise.',
    reveals: [{ id: 'portal', title: 'L’horizon est ouvert', text: 'Et il le restera ✈️' }],
    cta: 'Continuer',
  },
  {
    id: 6,
    node: 'Pour nous deux',
    kicker: 'Pour nous deux',
    title: 'Pas de jeu avec les sentiments ❤️',
    paragraphs: ['Si on essaie, je veux qu’on garde ces quatre étoiles.'],
    hint: 'Touche les quatre étoiles.',
    reveals: [
      { id: 'trust', title: 'La confiance', text: 'Je veux la mériter.' },
      { id: 'loyalty', title: 'La fidélité', text: 'Te choisir, tous les jours.' },
      { id: 'respect', title: 'Le respect', text: 'Ton rythme et tes choix comptent.' },
      { id: 'dialogue', title: 'Se parler', text: 'Se dire les choses franchement.' },
    ],
    cta: 'Continuer',
  },
  {
    id: 7,
    node: 'Et demain ?',
    kicker: 'Et demain ?',
    title: 'Et si notre histoire allait loin ? ✨',
    paragraphs: [
      'Je rêve d’une vraie histoire, qui pourrait aller jusqu’au mariage, peut-être en 2027.',
      'Mais d’abord, apprenons à nous connaître. On verra ensemble.',
    ],
    cta: 'Continuer',
  },
  {
    id: 8,
    node: 'Ma question',
    kicker: 'Ma question',
    title: 'Justine, tu me plais ❤️',
    paragraphs: [
      'Justine,',
      'Je ne suis pas le roi des belles phrases 😅',
      'Mais tu comptes pour moi.',
      'Je veux te montrer par des actes : de l’attention, de la patience et de la vérité.',
      'Notre avenir, je ne veux pas le décider tout seul. Alors je te pose la question :',
    ],
    cta: 'Voir ma question',
  },
];

export const question =
  'Est-ce que tu veux qu’on essaie, toi et moi ? Une vraie relation, sérieuse, à notre rythme ❤️';

export type Answer = 'yes' | 'talk' | 'no';

export const answers: { id: Answer; label: string }[] = [
  { id: 'yes', label: 'Oui, j’accepte ❤️' },
  { id: 'talk', label: 'On en parle d’abord 💬' },
  { id: 'no', label: 'Je préfère dire non' },
];

export const outcomes: Record<Answer, { title: string; lines: string[]; postscript?: string; action: string }> = {
  yes: {
    title: 'Tu me fais sourire ! ✨',
    lines: ['Merci pour ton oui ❤️', 'On commence par un joli rendez-vous ? Je veux te découvrir pour de vrai.'],
    postscript: 'Et qui sait… un jour, si on en a tous les deux envie : Mme TATCHIDA ✨',
    action: 'Revoir les étoiles',
  },
  talk: {
    title: 'On en parle 💬',
    lines: ['Bien sûr. Dis-moi ce que tu en penses.', 'On a le temps, rien ne presse.'],
    action: 'Revoir les étoiles',
  },
  no: {
    title: 'Merci ❤️',
    lines: ['Merci d’avoir regardé ma surprise.', 'Je respecte ton choix.'],
    action: 'Fermer',
  },
};

export const ui = {
  map: 'Étapes',
  mapTitle: 'Les étapes de ma surprise',
  mapHint: 'Touche une étoile pour revoir un moment.',
  prev: 'Précédent',
  skip: 'Passer',
  restart: 'Recommencer',
  close: 'Fermer',
  settings: 'Réglages',
  sound: 'Chanson',
  reduceMotion: 'Moins d’animations',
  quality: 'Qualité 3D',
  explore: 'Tourner autour de la scène (glisser)',
  locked: 'Bientôt…',
  noWebgl: 'Ton téléphone n’affiche pas la 3D : voici la version simple, avec les mêmes étapes.',
  privacy: 'Ta réponse n’est ni enregistrée ni envoyée automatiquement. Elle part seulement si tu choisis de l’envoyer sur WhatsApp.',
  whatsapp: 'Envoyer ma réponse à Louis 💬',
  whatsappNote: 'Ouvre WhatsApp avec le message déjà écrit : tu n’as plus qu’à appuyer sur Envoyer.',
  end: 'C’est la fin. Tu peux fermer la page quand tu veux.',
  song: {
    title: '♪ Notre chanson ❤️',
    play: '♪ Chanson',
    help: 'Si le son ne démarre pas, touche ▶ dans la vidéo.',
    open: 'Ouvrir sur YouTube',
  },
};

/** Chanson (vidéo YouTube officielle choisie par Louis). Lancée au toucher de « C'est parti ». */
export const SONG_ID = 'PSZTZwoIJEc';

/** Numéro WhatsApp de Louis (Togo, +228), sans « + » ni espaces. */
export const WHATSAPP_NUMBER = '22892548838';

/** Message pré-rempli selon la réponse : c'est elle qui décide de l'envoyer. */
export const whatsappMessages: Record<Answer, string> = {
  yes: 'Oui, j’accepte ❤️🌟 — Belle Étoile',
  talk: 'J’ai vu ta surprise Belle Étoile 🌟 J’aimerais qu’on en parle 💬',
  no: 'J’ai regardé ta surprise Belle Étoile 🌟 Ma réponse est non, mais merci.',
};

export const whatsappLink = (a: Answer) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessages[a])}`;
