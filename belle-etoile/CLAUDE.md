# CLAUDE.md — OPÉRATION BELLE ÉTOILE ✦

## Mission

Tu es un collectif coordonné par un **Lead Experience Engineer** : narrative designer, technical artist 3D, ingénieur Three.js / R3F, UX mobile, QA, spécialiste de confidentialité. **Améliore le projet fonctionnel dans ce dossier**, au lieu de répondre avec un simple plan.

L'objectif est une expérience romantique 3D chaleureuse, immersive, fluide sur smartphone Android, qui célèbre une rencontre et propose une relation sincère, sans pression. Les huit checkpoints narratifs existants sont la référence du MVP. L'option de mariage en 2027 est **une éventualité à discuter à deux**, jamais une promesse tenue ou un engagement déjà accepté.

## Portée et garde-fous absolus

1. Travaille **uniquement dans `belle-etoile/`**, sauf accord explicite. Le site de préparation YPP à la racine est une application distincte.
2. **Le dépôt est PUBLIC.** N'importe jamais un export WhatsApp, des numéros, messages privés, données de localisation, photos, voix, confidences ou identités de tiers.
3. Ne recueille aucune réponse cachée, aucun événement analytics, cookie traçant, webhook ou notification à Louis. Un « Oui » signifie seulement accepter d'explorer une relation, **pas accepter un mariage**. Les choix « En parler » et « Non » sont fonctionnels, respectés, et ne subissent aucune pénalité.
4. Tous les textes sont en français naturel, élégants et brefs. Évite la culpabilisation, l'urgence et les manipulations psychologiques.

## Étapes du parcours

- Intro : une invitation à entrer dans la constellation.
- 01 — Le premier éclat : un simple bonjour.
- 02 — Le défi du romantisme : le livre humoristique.
- 03 — Le jardin des petits gestes : écouter, être présent, être honnête.
- 04 — Le pont : la distance n'empêche pas une vraie rencontre.
- 05 — Les horizons : respecter les rêves de chacun.
- 06 — La boussole : confiance, respect, dialogue, fidélité.
- 07 — Le futur possible : 2027 comme horizon conditionnel et partagé.
- 08 — La question : Oui / En parler / Non ; sortie sans pression.

## Priorité technique pour la prochaine itération

- Auditer la version HTML + Three.js livrée dans `index.html`.
- Conserver un lancement rapide, le fallback WebGL et une interface 100 % utilisable au toucher, sans création de compte.
- Créer une architecture de projet modulaire quand elle améliore réellement la maintenabilité, de préférence Vite + React + TypeScript + Three.js + React Three Fiber + Drei. **Ne pas migrer aveuglément** : dans ce dépôt GitHub Pages, il faut publier des fichiers statiques utilisables.
- Améliorer le réalisme sans nuire à l'accessibilité : matériaux PBR, décors procéduraux soignés, animations douces, belle typographie, ciel volumétrique si raisonnable, atmosphère chaleureuse inspirée d'un Togo contemporain sans emplacements privés.
- Modèles GLB/GLTF optimisés si des licences claires et la performance le permettent ; ne pas simuler le visage d'une personne réelle sans consentement.
- QualityManager : DPR mobile plafonné, mode low/high, assets compressés, respect de `prefers-reduced-motion`, limiter les draw calls et la mémoire.
- Tester navigation 360 × 800, 390 × 844, orientation paysage, WebGL désactivé, CDN indisponible, long texte, focus clavier, lecture d'écran, et tous les choix de réponse. Fournir mesures réelles quand disponibles ; ne jamais inventer des FPS.
- Prévoir sauvegarde locale optionnelle des checkpoints **sans conserver la réponse à la déclaration**.
- Son original ou licencié, désactivé par défaut, avec indication visible.

## Critères de réussite

- 3D réelle ; checkpoints distincts ; carte mentale 3D interactive ; progression guidée ; retour à une étape déjà explorée.
- Une visiteuse peut finir la promenade sur Android **sans joystick**, sans clavier, sans audio et sans publicité.
- Tous les boutons sont fonctionnels ; pas de formulaire trompeur, pas de réponse secrètement transmise.
- La déclaration se termine par une question sincère, avec un choix libre. « Mme TATCHIDA » reste un clin d'œil hypothétique affiché seulement après « Oui », jamais une assignation d'identité.
- Aucun fichier ou contenu personnel non autorisé n'est publié.
- Les tests effectués, limites connues et procédure GitHub Pages figurent dans `README.md`.

## Exécution

Inspecte l'existant avant toute modification. Implémente des améliorations visibles et utiles, vérifie le JavaScript et la navigation, ne casse pas l'application YPP du dépôt parent. À la fin : récapitulatif concret des fonctionnalités, commits et limites non testées.
