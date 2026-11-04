# Registre d'installation et d'exécution des skills

Audit réel du 9 octobre 2026. Les instructions open source sont installées dans `.claude/skills/` ; leur présence ne signifie pas qu'un générateur, Blender ou un test de gameplay a été exécuté. Les résultats de validation du jeu doivent être consignés par l'équipe QA après intégration.

## Sources, versions et sélection

| Origine | Commit figé vérifié par API commits | Licence vérifiée | Décision |
|---|---|---|---|
| majidmanzarpour/threejs-game-skills | 8286774b22a2566bf894dbc825825c16921866af | MIT, copyright Majid Manzarpour 2026 | Production skills retenus ; services payants exclus |
| alton47/threejs-skills | 7b8e25638cff83a6be4926d8f05001022cc80ac3 | MIT, copyright Allan Alton 2026 | Modules techniques retenus |
| majidmanzarpour/blender-game-skills | f0ef29385a03de139957e6f700b801cdc00b7e29 | MIT | Instructions installées ; Blender non exécuté |
| anthropics/skills | dbd4588f9e1033efb41dad4bef2f7947c8993d44 | Apache-2.0 dans chaque skill retenu | Frontend et navigateur retenus |
| JulienDelquignies/three-js-aaa-agent-skill | non accessible | non vérifiable | Métadonnées et tree : GitHub 404 ; recherche par nom sans résultat ; non installé |

Révisions ci-dessus confirmées séparément par l'API GitHub commits (per_page=1), après exploration tree HEAD. Dernières dates de commit vérifiées : pack principal 2026-09-28, alton47 2026-03-25, Blender 2026-09-24, anthropics 2026-10-09. Les fichiers ont été téléchargés par URLs raw figées à ce SHA. Les licences sont jointes à chaque dossier installé.

## Installation et sûreté

Installation manuelle des fichiers texte via connecteur GitHub et apply_patch dans le périmètre du jeu. Méthode équivalente à la copie de `skills/` documentée dans le README et le script d'installation du pack. Aucun script distant lancé via curl, aucune modification de la plateforme BAD/Bryq. Aucun package npm global installé.

`install.sh` a été inspecté : copie via rsync/cp, remplacement des dossiers homonymes par rm -rf et élagage optionnel. Pour éviter tout écrasement, il n'a pas été exécuté ; copie locale de fichiers inspectés. Scripts retenus : inspecteur canvas Node (Playwright/pngjs), vérificateur de preuves Python, gestionnaire de serveurs Python. Ce dernier lance les commandes explicitement fournies avec subprocess ; aucune commande externe n'a été fournie durant son invocation --help.

Tripo, Gemini et ElevenLabs : leurs SKILL.md ont été réellement consultés et écartés de l'installation/exécution, car la génération dépend de services propriétaires et de clés. Aucun probe de profils shell ni appel facturable. Blender : instructions consultées, pipeline non exécuté et aucune génération Blender annoncée.

## Skills individuels

### threejs-game-director

- Origine : https://github.com/majidmanzarpour/threejs-game-skills ; révision et licence dans le tableau ci-dessus.
- Rôle : orchestration, contrat de boucle, intégration et preuves.
- Installation : copie locale de `.claude/skills/threejs-game-director/SKILL.md`, licence et références présentes sélectionnées ; aucun installateur exécuté.
- Action effective : instructions téléchargées et consultées ; recommandations transmises au directeur pour application dans le jeu.
- Fichiers produits : dossier installé ; présent registre. check_evidence.py installé et --help exécuté PASS.
- Résultat : installation réussie. Application au code et tests du jeu à confirmer par rapports d'intégration ; ne pas interpréter cette ligne comme validation du gameplay.
- Limites : pas de dépendance automatique ajoutée, pas de service payant utilisé.

### threejs-gameplay-systems

- Origine : https://github.com/majidmanzarpour/threejs-game-skills ; révision et licence dans le tableau ci-dessus.
- Rôle : input, état, caméra, collisions et économie mesurable.
- Installation : copie locale de `.claude/skills/threejs-gameplay-systems/SKILL.md`, licence et références présentes sélectionnées ; aucun installateur exécuté.
- Action effective : instructions téléchargées et consultées ; recommandations transmises au directeur pour application dans le jeu.
- Fichiers produits : dossier installé ; présent registre. Aucun script de ce skill exécuté.
- Résultat : installation réussie. Application au code et tests du jeu à confirmer par rapports d'intégration ; ne pas interpréter cette ligne comme validation du gameplay.
- Limites : pas de dépendance automatique ajoutée, pas de service payant utilisé.

### threejs-aaa-graphics-builder

- Origine : https://github.com/majidmanzarpour/threejs-game-skills ; révision et licence dans le tableau ci-dessus.
- Rôle : formes détaillées, matériaux partagés et budgets.
- Installation : copie locale de `.claude/skills/threejs-aaa-graphics-builder/SKILL.md`, licence et références présentes sélectionnées ; aucun installateur exécuté.
- Action effective : instructions téléchargées et consultées ; recommandations transmises au directeur pour application dans le jeu.
- Fichiers produits : dossier installé ; présent registre. Aucun script de ce skill exécuté.
- Résultat : installation réussie. Application au code et tests du jeu à confirmer par rapports d'intégration ; ne pas interpréter cette ligne comme validation du gameplay.
- Limites : pas de dépendance automatique ajoutée, pas de service payant utilisé.

### threejs-qa-release

- Origine : https://github.com/majidmanzarpour/threejs-game-skills ; révision et licence dans le tableau ci-dessus.
- Rôle : tests navigateur et captures en jeu.
- Installation : copie locale de `.claude/skills/threejs-qa-release/SKILL.md`, licence et références présentes sélectionnées ; aucun installateur exécuté.
- Action effective : instructions téléchargées et consultées ; recommandations transmises au directeur pour application dans le jeu.
- Fichiers produits : dossier installé ; présent registre. Inspecteur canvas installé ; contrôle Node syntaxique PASS.
- Résultat : installation réussie. Application au code et tests du jeu à confirmer par rapports d'intégration ; ne pas interpréter cette ligne comme validation du gameplay.
- Limites : pas de dépendance automatique ajoutée, pas de service payant utilisé.

### threejs-game-ui-designer

- Origine : https://github.com/majidmanzarpour/threejs-game-skills ; révision et licence dans le tableau ci-dessus.
- Rôle : HUD, contrôles tactiles et zones sûres.
- Installation : copie locale de `.claude/skills/threejs-game-ui-designer/SKILL.md`, licence et références présentes sélectionnées ; aucun installateur exécuté.
- Action effective : instructions téléchargées et consultées ; recommandations transmises au directeur pour application dans le jeu.
- Fichiers produits : dossier installé ; présent registre. Aucun script de ce skill exécuté.
- Résultat : installation réussie. Application au code et tests du jeu à confirmer par rapports d'intégration ; ne pas interpréter cette ligne comme validation du gameplay.
- Limites : pas de dépendance automatique ajoutée, pas de service payant utilisé.

### threejs-debug-profiler

- Origine : https://github.com/majidmanzarpour/threejs-game-skills ; révision et licence dans le tableau ci-dessus.
- Rôle : diagnostics renderer et profiling.
- Installation : copie locale de `.claude/skills/threejs-debug-profiler/SKILL.md`, licence et références présentes sélectionnées ; aucun installateur exécuté.
- Action effective : instructions téléchargées et consultées ; recommandations transmises au directeur pour application dans le jeu.
- Fichiers produits : dossier installé ; présent registre. Aucun script de ce skill exécuté.
- Résultat : installation réussie. Application au code et tests du jeu à confirmer par rapports d'intégration ; ne pas interpréter cette ligne comme validation du gameplay.
- Limites : pas de dépendance automatique ajoutée, pas de service payant utilisé.

### threejs-camera

- Origine : https://github.com/alton47/threejs-skills ; révision et licence dans le tableau ci-dessus.
- Rôle : FOV, projection et suivi.
- Installation : copie locale de `.claude/skills/threejs-camera/SKILL.md`, licence et références présentes sélectionnées ; aucun installateur exécuté.
- Action effective : instructions téléchargées et consultées ; recommandations transmises au directeur pour application dans le jeu.
- Fichiers produits : dossier installé ; présent registre. Aucun script de ce skill exécuté.
- Résultat : installation réussie. Application au code et tests du jeu à confirmer par rapports d'intégration ; ne pas interpréter cette ligne comme validation du gameplay.
- Limites : pas de dépendance automatique ajoutée, pas de service payant utilisé.

### threejs-animation

- Origine : https://github.com/alton47/threejs-skills ; révision et licence dans le tableau ci-dessus.
- Rôle : AnimationMixer, clips et transitions.
- Installation : copie locale de `.claude/skills/threejs-animation/SKILL.md`, licence et références présentes sélectionnées ; aucun installateur exécuté.
- Action effective : instructions téléchargées et consultées ; recommandations transmises au directeur pour application dans le jeu.
- Fichiers produits : dossier installé ; présent registre. Aucun script de ce skill exécuté.
- Résultat : installation réussie. Application au code et tests du jeu à confirmer par rapports d'intégration ; ne pas interpréter cette ligne comme validation du gameplay.
- Limites : pas de dépendance automatique ajoutée, pas de service payant utilisé.

### threejs-lighting

- Origine : https://github.com/alton47/threejs-skills ; révision et licence dans le tableau ci-dessus.
- Rôle : éclairage et ombres.
- Installation : copie locale de `.claude/skills/threejs-lighting/SKILL.md`, licence et références présentes sélectionnées ; aucun installateur exécuté.
- Action effective : instructions téléchargées et consultées ; recommandations transmises au directeur pour application dans le jeu.
- Fichiers produits : dossier installé ; présent registre. Aucun script de ce skill exécuté.
- Résultat : installation réussie. Application au code et tests du jeu à confirmer par rapports d'intégration ; ne pas interpréter cette ligne comme validation du gameplay.
- Limites : pas de dépendance automatique ajoutée, pas de service payant utilisé.

### threejs-performance

- Origine : https://github.com/alton47/threejs-skills ; révision et licence dans le tableau ci-dessus.
- Rôle : instancing, culling et mémoire.
- Installation : copie locale de `.claude/skills/threejs-performance/SKILL.md`, licence et références présentes sélectionnées ; aucun installateur exécuté.
- Action effective : instructions téléchargées et consultées ; recommandations transmises au directeur pour application dans le jeu.
- Fichiers produits : dossier installé ; présent registre. Aucun script de ce skill exécuté.
- Résultat : installation réussie. Application au code et tests du jeu à confirmer par rapports d'intégration ; ne pas interpréter cette ligne comme validation du gameplay.
- Limites : pas de dépendance automatique ajoutée, pas de service payant utilisé.

### threejs-loaders

- Origine : https://github.com/alton47/threejs-skills ; révision et licence dans le tableau ci-dessus.
- Rôle : chargement glTF.
- Installation : copie locale de `.claude/skills/threejs-loaders/SKILL.md`, licence et références présentes sélectionnées ; aucun installateur exécuté.
- Action effective : instructions téléchargées et consultées ; recommandations transmises au directeur pour application dans le jeu.
- Fichiers produits : dossier installé ; présent registre. Aucun script de ce skill exécuté.
- Résultat : installation réussie. Application au code et tests du jeu à confirmer par rapports d'intégration ; ne pas interpréter cette ligne comme validation du gameplay.
- Limites : pas de dépendance automatique ajoutée, pas de service payant utilisé.

### threejs-materials

- Origine : https://github.com/alton47/threejs-skills ; révision et licence dans le tableau ci-dessus.
- Rôle : matériaux et textures.
- Installation : copie locale de `.claude/skills/threejs-materials/SKILL.md`, licence et références présentes sélectionnées ; aucun installateur exécuté.
- Action effective : instructions téléchargées et consultées ; recommandations transmises au directeur pour application dans le jeu.
- Fichiers produits : dossier installé ; présent registre. Aucun script de ce skill exécuté.
- Résultat : installation réussie. Application au code et tests du jeu à confirmer par rapports d'intégration ; ne pas interpréter cette ligne comme validation du gameplay.
- Limites : pas de dépendance automatique ajoutée, pas de service payant utilisé.

### threejs-physics

- Origine : https://github.com/alton47/threejs-skills ; révision et licence dans le tableau ci-dessus.
- Rôle : Rapier, proxies et pas fixe.
- Installation : copie locale de `.claude/skills/threejs-physics/SKILL.md`, licence et références présentes sélectionnées ; aucun installateur exécuté.
- Action effective : instructions téléchargées et consultées ; recommandations transmises au directeur pour application dans le jeu.
- Fichiers produits : dossier installé ; présent registre. Aucun script de ce skill exécuté.
- Résultat : installation réussie. Application au code et tests du jeu à confirmer par rapports d'intégration ; ne pas interpréter cette ligne comme validation du gameplay.
- Limites : pas de dépendance automatique ajoutée, pas de service payant utilisé.

### frontend-design

- Origine : https://github.com/anthropics/skills ; révision et licence dans le tableau ci-dessus.
- Rôle : identité visuelle et interface.
- Installation : copie locale de `.claude/skills/frontend-design/SKILL.md`, licence et références présentes sélectionnées ; aucun installateur exécuté.
- Action effective : instructions téléchargées et consultées ; recommandations transmises au directeur pour application dans le jeu.
- Fichiers produits : dossier installé ; présent registre. Aucun script de ce skill exécuté.
- Résultat : installation réussie. Application au code et tests du jeu à confirmer par rapports d'intégration ; ne pas interpréter cette ligne comme validation du gameplay.
- Limites : pas de dépendance automatique ajoutée, pas de service payant utilisé.

### webapp-testing

- Origine : https://github.com/anthropics/skills ; révision et licence dans le tableau ci-dessus.
- Rôle : reconnaissance et Playwright.
- Installation : copie locale de `.claude/skills/webapp-testing/SKILL.md`, licence et références présentes sélectionnées ; aucun installateur exécuté.
- Action effective : instructions téléchargées et consultées ; recommandations transmises au directeur pour application dans le jeu.
- Fichiers produits : dossier installé ; présent registre. with_server.py installé et --help exécuté PASS.
- Résultat : installation réussie. Application au code et tests du jeu à confirmer par rapports d'intégration ; ne pas interpréter cette ligne comme validation du gameplay.
- Limites : pas de dépendance automatique ajoutée, pas de service payant utilisé.

### blender-image-to-3d

- Origine : https://github.com/majidmanzarpour/blender-game-skills ; révision et licence dans le tableau ci-dessus.
- Rôle : pipeline modèles optimisés.
- Installation : copie locale de `.claude/skills/blender-image-to-3d/SKILL.md`, licence et références présentes sélectionnées ; aucun installateur exécuté.
- Action effective : instructions téléchargées et consultées ; recommandations transmises au directeur pour application dans le jeu.
- Fichiers produits : dossier installé ; présent registre. Aucun script de ce skill exécuté.
- Résultat : installation réussie. Application au code et tests du jeu à confirmer par rapports d'intégration ; ne pas interpréter cette ligne comme validation du gameplay.
- Limites : aucun Blender lancé, aucun modèle exporté par ce skill.

## Commandes réellement exécutées

Dans `/workspace/louis/togo-life-3d` :

```sh
python3 .claude/skills/webapp-testing/scripts/with_server.py --help
python3 .claude/skills/threejs-game-director/scripts/check_evidence.py --help
node --check .claude/skills/threejs-qa-release/scripts/inspect-threejs-canvas.mjs
```

Chaque commande : exit 0. Ces vérifications prouvent la présence/usage des aides et la syntaxe Node, pas la qualité visuelle ni les performances du jeu.

## Consignes appliquées à la préparation

- Le director a orienté la séparation des missions et le contrat de preuves ; recommandations envoyées au directeur : vraie boucle achat/transport/vente, caméra FOV 45–60°, capsule physique séparée du mesh, animation Idle/Walk/Run avec crossfade et test de mouvement réel.
- Graphics : formes avant effets, matériaux partagés, textures procédurales ; point de départ mobile 150 draw calls, 300k triangles, 40 textures, un soleil 1024 et DPR 1.5. Ce sont des budgets, pas des résultats mesurés.
- QA : desktop/mobile en jeu actif, mouvement non figé, erreur console/network et production preview. Scores visuels non déclarés sans captures inspectées ; les anchors binaires n'ont pas été importés et le score premium du pack n'est donc pas validé.
- Frontend : palette spécifique au lieu, interface courte, clavier/focus, mobile et reduced motion ; ne pas substituer une page marketing au jeu.

L'application concrète au code, les captures et le profiling doivent être complétés après les modifications finales, avec chemins et commandes réels. Aucune fonctionnalité commerciale, multijoueur ou couverture nationale n'est certifiée par l'installation d'un skill.


## Application réelle après intégration — 10 octobre

Le directeur a lu les cinq production SKILL.md (gameplay, graphics, UI, debug, QA), frontend-design et webapp-testing ; références physics-engine-selection, genre-design, game-feel, technical-art, authoring-recipes, shader-cookbook, visual-scorecard, ui-patterns, debug-playbook, release-checks, visual-test-harness, playtest-bot, evidence-manifest lues.

| Skills effectivement appliqués | Actions/fichiers produits | Vérification réelle / limite |
|---|---|---|
| game-director + gameplay-systems | `artifacts/game-progress.md`, `src/main.js`, `src/controller.js`, `src/simulation.js` ; boucle stock/transport/prix/demande et collisions à pas fixe | Tests économie/collisions ; navigateur bloqué |
| aaa-graphics-builder + materials + lighting + performance | `src/world.js`, rendu PBR/soleil/sky, textures locales, instancing, proxies caméra simples | Construction monde et positions vérifiées en Node ; aucun score premium validé |
| animation + loaders | `assets/avatar.gltf`, `scripts/export-avatar.mjs`, `src/avatar-loader.js` ; 22 os, Idle/Walk/Run, AnimationMixer/crossfade | Fichier glTF réellement exporté puis parsé/testé en Node ; motion capture en jeu non réalisée |
| game-ui-designer + frontend-design | `index.html`, `life.css`, HUD, dialogues, partage sans prénom, joystick pointer events | Imports/build validés ; responsive/touch non validés en navigateur |
| debug-profiler + qa-release + webapp-testing | `tests/browser.py`, diagnostics opt-in `?qa=1`, `artifacts/browser-results.json`, build/unit logs | Playwright réellement lancé : BLOCKED avant page à cause de restriction socket. Zéro capture et zéro test navigateur réussi |
| camera | Caméra amortie FOV 52°, anti-obstruction via proxies dans controller/main | Test segment-proxy réussi ; mouvement visuel non inspecté |

Physics : instructions consultées et choix explicite de collisions cinématiques locales ; Rapier non installé. Blender et générateurs 3D/image/audio : aucune exécution revendiquée. Les sons runtime sont des oscillateurs Web Audio originaux.

Build exécuté : `node scripts/build.mjs` (statique + monofichier). Tests : `node --test --test-isolation=none tests/*.test.mjs` : 14 tests réussis. Les scripts auxiliaires du director/QA ne remplacent pas le Playwright bloqué. Voir `artifacts/final-evidence.md` pour résultats et blocages exacts.

Exécution finale auxiliaire : director `check_evidence.py` sur le rapport : FAIL (inspection canvas absente), fichiers build/browser/avatar reconnus. QA `inspect-threejs-canvas.mjs` : tentative, échec de module Node Playwright manquant ; log conservé. La version Playwright Python est installée mais Chromium reste bloqué. Aucun npx/download non inspecté ni programme payant exécuté pour masquer ces limites.

## Application réelle à la refonte UI (10 octobre 2026)

Skills installés précédemment, versions et licences inchangées. Le skill threejs-game-ui-designer et sa référence ui-patterns.md ont été relus puis appliqués à index.html, life.css et src/main.js : HUD compact, contrôles 48px, plans, fiches contextuelles, création du personnage et menu. frontend-design a été relu et appliqué : direction palette/typo liée au jeu, abandon de l’accroche de présentation, critique et corrections dans docs/INTERFACE_DESIGN.md et docs/INTERFACE_REVIEW.md. Les instructions caméra/animation ont guidé src/avatar-preview.js et la vue quartier. Aucun générateur payant ni asset tiers ajouté.

Trois sous-agents ont produit des modules/tests : src/ui-model.js (six tests), src/neighborhood-map.js (quatre tests), src/avatar-preview.js (syntaxe/import vérifiés). Une revue indépendante a corrigé sélecteurs, events tactiles réels et préparé scripts/ci_browser.py. Total logique à cette révision : 30 tests passants (dont quatre tests du journal persistant et un test de séparation des habitants et un test de normalisation/blend des poids du skin) ; build statique et monofichier réussis. Playwright/webapp-testing est appliqué au parcours réel tests/browser.py. Chromium local est bloqué avant page ; le workflow autonome GitHub doit produire la preuve navigateur avant toute affirmation de validation graphique.

La revue du run Chromium 38020941245 a réellement inspecté quatre captures desktop. Le résultat avatar figurine a été rejeté, puis remplacé par un skin profilé continu avec poids articulés ; scripts/export-avatar.mjs a régénéré le glTF. L’agent environnement a instancié palmiers, motos et taxis, allégé les soumissions d’ombres et corrigé la multiplication des teintes de textures. Le responsable a séparé les PNJ, ajouté un repère joueur et hiérarchisé le commerce fermé. Les instructions de performance, animation et revue QA ont donc produit des modifications vérifiables, pas une affirmation de qualité finale. La mesure de 2,8 FPS SwiftShader appartient à la version avant ces corrections. La nouvelle mesure et le mobile seront consignés après exécution. Firefox a échoué WebGL ; continue-on-error dans le workflow ne constitue pas une validation.


## Exécution vérifiée en navigateur — run CI 38023920158

Source `b1db3bbb75741522642dfc963b8d98eddfe371a4`, 10 octobre 2026. Les limites locales historiques ci-dessus ont été contournées par un exécuteur GitHub Actions réel ; elles ne sont pas effacées. [Run et artifacts](https://github.com/Louistatch/louis/actions/runs/38023920158).

| Skills appliqués | Actions réellement exécutées | Résultat / fichiers |
|---|---|---|
| director, gameplay-systems, camera, animation, loaders | `npm test`, `npm run build`, puis `scripts/ci_browser.py --transport offline` sur Chromium 151.0.7922.34 ; touches, boutons, transactions et reload réels | 31 tests Node et 37 vérifications navigateur PASS ; `browser-results.json`, huit captures dont achat/vente/partage, sauvegarde conservée |
| game-ui-designer, frontend-design, webapp-testing | `scripts/mobile_probe.py`, CDP touchStart/touchCancel et glissement caméra ; captures portrait/paysage inspectées par directeur et agent review | 19 vérifications PASS ; mouvement 2,38 m, arrêt Idle, rotation yaw 0,42 rad ; `mobile-probe.json` et trois PNG. Le débordement visuel du dock paysage détecté après les checks est corrigé ensuite, à contre-vérifier |
| aaa-graphics-builder, lighting, materials, performance, debug-profiler | `scripts/visual_probe.py --engine chromium`, mesure RAF en jeu actif, renderer.info et GPU identifiés | Quatre captures locales PASS ; mobiles 5,59 FPS dans l’échantillon indépendant, PC 3,90 FPS dans le parcours. SwiftShader logiciel : objectifs Android/PC non validés |
| qa-release, animation | `scripts/capture_motion.py`, screenshots réels et FFmpeg VFR | WebM produit ; preuve PARTIELLE : quatre phases d’entrée mais seulement Idle/Walk observés après les captures. Le parcours fonctionnel observe Run ; cette vidéo ne certifie ni course fluide ni animation professionnelle |
| webapp-testing, qa-release | `scripts/public_preview.py`, puis `visual_probe.py --engine chromium --prefix live --url https://togo-life-preview.vercel.app` | HTTPS 200, 1 874 536 octets, SHA256 identique au build ; quatre captures HTTPS et entrée en jeu PASS ; zéro erreur dans ces probes |

Firefox : échec WebGL. Les étapes `continue-on-error` ne sont jamais comptées comme validation ; seuls les rapports JSON effectivement passants le sont. Les références visuelles de Townsmen 5 et Lagos Life servent à l’analyse, sans import de leurs assets. Les nouvelles corrections d’ombres et de dock nécessitent un nouveau run.

### Skill d’hébergement effectivement appliqué

`vercel:deployments-cicd` fourni par le connecteur Vercel, source cloud `c8/deployments-cicd`, instructions lues le 10 octobre ; aucune origine GitHub ou licence open source inventée. Installation : skill préinstallé, chargé via `skills.read`. Actions : création du projet isolé `togo-life-preview`, déploiement de `index.html` contenant exclusivement le monofichier du jeu, contrôle READY puis preuve HTTPS en CI. Fichier produit : build du jeu hébergé ; aucun fichier BAD/Bryq modifié. Le target technique Vercel est `production` dans ce nouveau projet exclusivement consacré à l’aperçu, car l’API a rejeté `preview` ; ce n’est pas une fusion GitHub sur main. Authentification publique désactivée pour rendre le jeu accessible. Aucune clé, fonction serveur, API payante ou message envoyé à un tiers.


## Validation finale CI9 / CI11 et scripts originaux exécutés

10 octobre 2026. Contenu du jeu `6740be8f053944bf027c4497c96786e13d0dc762`, SHA-256 monofichier `6f97f6457696e37ad504ab4c0a24cd79f59744175379ea810594ac8262d1cfbe`. Les commits QA ultérieurs jusqu’à `27d22e9bc55217f1c3e533dc76f0b47c4b167b60` ne changent pas ces octets.

[CI11 navigateur](https://github.com/Louistatch/louis/actions/runs/38025435352) : 31 tests Node, 37 assertions navigateur et 21 assertions tactiles PASS ; JSON bruts dans [evidence/2026-10-10/ci11](evidence/2026-10-10/ci11). HTTP/hash public identique et probe HTTPS réel PASS. Les corrections de dock/ombres ont été jugées sur les captures CI9 réellement inspectées. Firefox reste échec WebGL, pas une validation.

[CI9 audit de skills](https://github.com/Louistatch/louis/actions/runs/38024687518) a **réellement exécuté** les deux scripts installés du pack principal :

```sh
node .claude/skills/threejs-qa-release/scripts/inspect-threejs-canvas.mjs \
  --url https://togo-life-preview.vercel.app?qa=1 \
  --out artifacts/original-inspector --run-id ci-38024687518 --wait 1000
python3 .claude/skills/threejs-game-director/scripts/check_evidence.py . \
  --manifest artifacts/director-manifest.json
```

Résultats : inspector desktop result.ok true, canvas d’accueil non vide, PNG réel, zéro erreur console/page ; director PASS quatre artifacts présents. Rapports originaux [inspector](evidence/2026-10-10/original-inspector.json), [manifest](evidence/2026-10-10/director-manifest.json), [sortie](evidence/2026-10-10/director-check.txt). **Limites :** accueil, pas parcours actif ; compteurs budget nuls dans l’inspector, aucune certification premium ou FPS déduite. Les noms de chemins d’origine sont conservés après archivage ; le checker a tourné dans le layout CI. Dépendances de test temporaires @playwright/test 1.62.0 Apache-2.0 et pngjs 7.0.0 MIT, ajoutées sans scripts npm, sans lock modifié ni dépendance runtime.

Les instructions performance/QA ont aussi guidé scripts/performance_profiles.py : trois profils réellement sélectionnés via l’UI et dix secondes actives chacun. [Rapport](evidence/2026-10-10/performance-profiles.json) : balanced 4,62 FPS, low 3,82, high 3,83 en SwiftShader ; aucun gain du mode low affirmé. Compteurs connus, timings CPU/GPU absents. [CI11 motion](https://github.com/Louistatch/louis/actions/runs/38025435266) exécute qa/capture_screencast.py et FFmpeg : 24 JPEG réels et WebM VFR, états réels indépendants. PASS de couverture, **pas validation de fluidité** : décalage images/diagnostics et 1,76 image reçue/s. [Limites et mesures complètes](INTERFACE_VALIDATION_REPORT.md).

Mise à jour hébergement : le dernier déploiement du projet isolé sert le monofichier dans index.html **et les trois fichiers de secours conservés** legacy.html/game.js/style.css. L’alias public correspond au build vérifié, source 6740be8f ; aucune modification ou mise en production de BAD/Bryq.

## Cinq skills Codex demandés — gamedev-skills

Origine commune : [gamedev-skills/awesome-gamedev-agent-skills](https://github.com/gamedev-skills/awesome-gamedev-agent-skills). Licence **Apache-2.0** jointe à `.agents/skills/LICENSE.gamedev-skills`. Commit commun **0a70cfc64672d512c5b5b6006b5dcb5cf90dbdbd** (9 octobre 2026). Installation limitée au jeu, Codex, pas globale.

Commande demandée réellement tentée avec confirmation non interactive, npm ignore-scripts, cache dans /workspace/research, DISABLE_TELEMETRY/DO_NOT_TRACK : `npx skills add gamedev-skills/awesome-gamedev-agent-skills -a codex --skill ai-behavior-trees-utility-ai --skill game-ai --skill procedural-gen --skill dialogue-systems --skill performance-optimization -y`. **Échec EPERM du registre npm avant téléchargement** ; ne pas prétendre que npx a installé le pack. Alternative officielle [copie locale](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/blob/0a70cfc64672d512c5b5b6006b5dcb5cf90dbdbd/docs/INSTALLATION.md) réellement appliquée via GitHub à commit épinglé. 17 fichiers licence/skills/références byte-identiques aux blobs d’origine. Aucun script exécutable dans ces cinq dossiers ; scripts du CLI et validateur inspectés, aucune permission système ajoutée. Version CLI lue sur GitHub : 1.7.2 ; **pas téléchargée/exécutée**.

| Skill | Rôle / action effective | Fichiers produits | Tests / résultat | Limite |
|---|---|---|---|---|
| ai-behavior-trees-utility-ai | SKILL.md et références utility/best-practices lus, audit horaires/routines de src/npcs.js, mémoire/Running/hystérésis examinés | Dossier complet installé, GAMEDEV_SKILLS_APPLICATION.md | Validateur amont sur SKILL.md/références PASS | Aucun runtime BT/Utility ajouté |
| game-ai | Instructions/pathfinding lus, revue graphe 12 waypoints/11 liens, recherche lors changement de but et steering | Dossier complet, rapport d’application | Validateur PASS ; navigateur constate PNJ atteignant destinations | Pas navmesh, obstacles dynamiques ou crowd robuste |
| procedural-gen | Instructions/noise lus, revue seed 37/texture bornée, séparation contenu et rendu | Dossier complet, rapport d’application | Validateur PASS ; tests spawn/parcours déjà passants | Pas nouvelle ville générée ni noise terrain |
| dialogue-systems | Instructions/runner lus, revue option talk/persistance/anti-farming, choix graph minimal sans langage à venir | Dossier complet, rapport d’application | Validateur PASS ; checks anti-farming existants | Pas dialogue branché, Ink/Yarn ou localisation livrés |
| performance-optimization | Instructions/profiling-budgets lus, revue mesures, code d’analyse budget réel avec données manquantes distinctes | Dossier complet ; .agents/skills-tools/evaluate_render_budget.py ; budget-review.json | Analyse exécutée, cinq checks de fiabilité PASS | Goulot CPU/GPU inconnu ; pas gain FPS ni hardware validé |

Validateur amont standard-library installé à .agents/skills-tools/validate-skills.py, fonctions originales validate_file/validate_unique_names effectivement exécutées sur les cinq dossiers : **5 PASS**, références/noms valides. Les checks de catalogue/router/plugins globaux du dépôt source ne sont pas applicables à ce sous-ensemble et n’ont pas été exécutés. [Résultat](evidence/2026-10-10/skills-install-validation.json), [provenance](../.agents/gamedev-skills-source.json), [revue détaillée](GAMEDEV_SKILLS_APPLICATION.md).

Au total, **21 skills open source installés** (16 historiques Claude + cinq Codex) ; leurs niveaux d’application diffèrent et sont décrits ci-dessus. Blender reste installé/instructions seulement, sans Blender exécuté. Le skill cloud Vercel est compté séparément, sans licence GitHub inventée. Aucun sous-agent indisponible n’est présenté comme ayant produit une nouvelle revue ; la dernière revue de flux vidéo et l’application de ce nouveau pack ont été réalisées par le directeur.
