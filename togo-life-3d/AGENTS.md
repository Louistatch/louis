# TOGO LIFE — instructions du studio Codex / Claude

Le dossier `togo-life-3d/` est **un jeu web Three.js existant**, pas un projet Godot. Son état réel fait autorité sur toute proposition de migration : `src/main.js`, `src/world.js`, `src/npcs.js`, `src/simulation.js`, `src/geography.js`, `assets/`, `vendor/`, `tests/`, `index.html`, `scripts/build.mjs`. `togo-life-3d-preview/` est une prévisualisation séparée et peut contenir un travail plus récent ; vérifier sa branche/PR avant de synchroniser.

## Mission produit
Construire TOGO LIFE, **simulation de vie et de stratégie économique 3D au Togo**, jouable sur ordinateur puis smartphone : déplacements réels, commerces, revenus/dépenses, professions, foyers, décisions ayant des conséquences, habitants crédibles, extension géographique progressive. Pas de prototype à clics, faux screenshots ou marketing à la place du gameplay. Les habitants ont des objectifs et contraintes, pas seulement des déplacements décoratifs.

## Agents / expertises (rôles virtuels, pas de collaborateurs réellement recrutés)
- **Game Director / CTO** : priorités, architecture modulaire, compatibilité, preuves de livraison.
- **Economy Designer** : boucles économiques en FCFA virtuels, stock, risque, équilibre, anti-exploitation.
- **NPC Systems Engineer** : besoins, horaires, mémoire, objectifs, navigation et performance.
- **Togo GIS Engineer** : lieux togolais, OSM, attribution, sources, cartes et niveaux réellement différents.
- **3D Technical Artist / Motion** : direction artistique cohérente, personnages, rigging, animation, éclairage.
- **QA / Accessibility** : PC, Android réel, navigateur, WebGL, fallback et captures vérifiables.

## Usage avec Codex
Lancer Codex **depuis ce dossier** pour découvrir `.agents/skills/`. Charger `$togo-life-studio` pour les demandes larges, puis les skills spécialisés : `$togo-life-economy`, `$togo-life-npc-ai`, `$togo-life-world-map`, `$togo-life-quality`. Les skills Three.js approuvés déjà rangés dans `.claude/skills/` peuvent être copiés **sans écraser** via `node scripts/sync-codex-skills.mjs` (voir `docs/CODEX_STUDIO.md`). Ne pas prétendre que tous les skills externes ont été installés : distinguer ceux présents et ceux seulement recommandés.

## Règles non négociables
1. **Préserver les acquis** : ne pas casser `main`, les fichiers BAD/Bryq du dépôt racine, `legacy.html` ni la prévisualisation ; proposer des changements isolés et des tests.
2. **Moteur actuel = Three.js**. Ne proposer Godot qu'avec une migration explicitement demandée et un avantage démontré. Construire d'abord sur la stack qui fonctionne.
3. **Open source seulement** : contrôler la licence des bibliothèques, modèles 3D, textures, données et skills. Pas de clés secrètes, API payantes, dépendances propriétaires ou lancement de scripts distants non audités.
4. **Géographie véridique** : `src/geography.js` fournit une nomenclature historique de 5 régions/40 entrées, pas une carte OSM 3D validée du pays. Utiliser des limites administratives sourcées. Ne pas appeler une distance à vol d'oiseau « temps de trajet » et ne pas présenter un décor stylisé comme une reproduction exacte.
5. **Simulation déterministe** : l'économie est la source de vérité, distincte du renderer. Argent du jeu = FCFA **virtuels**, aucun vrai paiement. Garder sauvegardes existantes compatibles et tests sur les invariants.
6. **PNJ mesurables** : autonomie = objectifs, emploi du temps, besoins, interactions et conséquences observables ; limiter les agents actifs, éviter les appels LLM continus à chaque frame.
7. **Livrables honnêtes** : lancer `npm test` puis `npm run build` ; si environnement navigateur disponible, exécuter `python3 tests/browser.py --url http://127.0.0.1:8000/dist/` après lancement du serveur. Rapporter explicitement PASS, FAIL, BLOCKED et les captures réelles. Ne jamais inventer de FPS.
8. **Premier parcours** : tester création du personnage, déplacements, marché, achat, transport, ouverture du comptoir, ventes, besoins, sauvegarde/reprise sur PC et tactile.
9. **Priorité au plaisir de jeu** : chaque tranche apporte une action nouvelle, un arbitrage ou une conséquence visible, pas uniquement une interface.

## Flux conseillé
Auditer la branche et les tests → choisir un seul scénario vertical (ex. commerçant du marché à Lomé) → écrire critères d'acceptation → modifier moteur / IA / rendu sans détruire l'existant → tests Node → build → vrais tests et captures navigateur → bilan des limites → PR sans fusion forcée.
