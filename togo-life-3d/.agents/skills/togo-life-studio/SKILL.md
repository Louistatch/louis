---
name: togo-life-studio
description: Orchestrer dans Codex le développement du jeu TOGO LIFE situé au Togo : simulation de vie 3D Three.js, stratégie économique en FCFA virtuels, habitants autonomes, géographie nationale, animation et tests réels.
---

# TOGO LIFE — Studio game director pour Codex

Activer pour toute demande large de nouveau gameplay, stratégie, simulation de vie, qualité « type Sims/SimCity », extension du Togo ou finition 3D. **Ne pas créer un nouveau jeu** : améliorer `togo-life-3d/` ; vérifier `togo-life-3d-preview/` et ses PR si le travail concerne la dernière interface.

## Audit obligatoire
- Lire `AGENTS.md`, `README.md`, `package.json`, `src/main.js`, `src/simulation.js`, `src/npcs.js`, `src/world.js`, `src/geography.js` et les tests existants selon la tâche.
- Vérifier les skills présents dans `.agents/skills/` et, s'ils ont été synchronisés, leurs documents et licences. **Ne pas inventer l'exécution d'un skill.**
- Préférer Three.js (bundle local `vendor/`) à une réécriture Godot. Aucun service payant par défaut.
- Repérer les fichiers générés `dist/` et `TOGO_LIFE_MONTAGNE.html` avant d'éditer : modifier les sources et reconstruire, pas l'inverse.

## Découpage de missions
1. **Game director** : écrire la boucle concrète « décider → agir physiquement → résultat économique/social → progression » et le test de réussite.
2. **Économie** : charger `$togo-life-economy`, garder tous les montants/ressources dans l'état simulé et tester la conservation.
3. **Habitants** : charger `$togo-life-npc-ai`; ajouter du comportement mesurable et des interactions, pas une IA de façade.
4. **Monde** : charger `$togo-life-world-map` ; une ville = vraie différence visuelle/mécanique, les données OSM sont attribuées.
5. **Validation** : charger `$togo-life-quality`; exiger captures du rendu réel, PC/tactile, contrôle WebGL et fallback.

## Critères d'un incrément
Une seule verticale jouable (lieu, métier, besoin, entreprise, interaction) est préférable à 20 menus inertes. Chaque fonctionnalité doit déclarer : action du joueur, état modifié, effet différé, feedback visuel, et au moins un test anti-exploitation ou d'interruption/reprise.

## Delivery
Exécuter `npm test` + `npm run build`. Lancer `python3 -m http.server 8000` depuis ce dossier et, si Playwright/Chromium autorisé, le parcours `tests/browser.py`. Noter les preuves et les limites ; aucune revendication de compatibilité Android sans test sur appareil.
