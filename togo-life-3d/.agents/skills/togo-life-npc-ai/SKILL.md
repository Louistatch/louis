---
name: togo-life-npc-ai
description: Rendre les habitants de TOGO LIFE crédibles et autonomes avec horaires, métiers, besoins, objectifs, mémoire locale, relations sociales, déplacements et interactions observables.
---

# Habitants autonomes sans coût LLM permanent

`src/npcs.js` définit 8 habitants, un graphe de déplacement et des horaires. `src/character.js` anime leurs modèles. Ne pas appeler ce comportement initial une véritable simulation sociale avancée.

## Architecture proposée
- Séparer **état du résident** (identité, foyer, métier, besoins, argent fictif, relations, objectifs) de la **représentation 3D** et de l'ordonnanceur.
- Mise à jour des décisions avec un `tick` de simulation (secondes/minutes de jeu), pas à chaque frame. Mouvement fluide interpolé via `update(dt)`.
- Planificateur simple d'abord : utility scores / GOAP / finite state machine, agenda journalier, objectifs dépendant de fatigue, argent, profession, lieu et interactions.
- Mémoire locale compacte : événements datés, relations, dernières interactions ; limite de taille, sérialisation déterministe, aucun dialogue sensible exfiltré.
- Interaction substantielle : négociation, demande de travail, vente/achat, conseil du voisin, réputation ; impacts explicites sur l'économie et la sauvegarde.
- Optimiser : PNJ hors écran simulés à faible fréquence ; LOD et culling ; contrôler collision et navigation pour éviter les superpositions et téléportations.

## Définition de terminé
Le joueur peut suivre au moins un résident sur un cycle visible, changer sa trajectoire par une décision, quitter/revenir et retrouver une conséquence cohérente. Tester horaires, migration de sauvegarde, grands `dt`, pause, performances PC/mobile.
