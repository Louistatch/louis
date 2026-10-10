# TOGO LIFE — Montagne Aimant (tranche solo en développement)

Nouvelle architecture isolée de BAD/Bryq : Three.js local, avatar humain original glTF à 22 os et clips Idle/Walk/Run, quartier stylisé de Lomé, caméra troisième personne, collisions cinématiques, un fournisseur et sept clients autonomes, taxis et motos, marché, commerce et logement.

**Jouer : [ouvrir TOGO LIFE](https://togo-life-preview.vercel.app).** Hébergement isolé du jeu ; BAD/Bryq préservé, refonte sur branche dédiée sans fusion automatique. Code et changements : [PR #6](https://github.com/Louistatch/louis/pull/6).

État vérifié CI11 (`27d22e9b`) : **31 tests Node, 37 vérifications navigateur et 21 vérifications tactiles réussis**. Chromium a aussi rendu la version HTTPS publiée ; son hash correspond exactement au build. Dock paysage et ombres proches corrigés puis capturés. [Six captures réelles et vidéo](docs/captures/README.md), [mesures et évaluation critique](docs/INTERFACE_VALIDATION_REPORT.md). Rendu SwiftShader en CI : 6,04 FPS PC et 10,49 FPS mobile émulé dans les derniers échantillons, sans certification GPU matériel/Android physique. Cette tranche solo reste en développement.

Skills installés et appliqués : [registre complet](docs/SKILLS_EXECUTION_REPORT.md). Les cinq skills Codex demandés de gamedev-skills sont dans `.agents/skills/`, à commit épinglé, licence Apache-2.0, références présentes et validation réussie. [Application réelle et limites](docs/GAMEDEV_SKILLS_APPLICATION.md). La nouvelle tranche applique réellement BT + Utility AI, dialogue fournisseur à branches, mémoire persistante et sauvegardes migrées. [Contrats et audit](docs/AUTONOMOUS_MARKET_ARCHITECTURE.md), [installation des sept skills supplémentaires](docs/AUTONOMOUS_MARKET_SKILLS_AUDIT.md).

Interface : aperçu animé de l'avatar, mini-plan local, objectifs avec distance, vue quartier, journal et bilan du comptoir. Recherches [Townsmen 5](docs/TOWNSMEN_INTERFACE_RESEARCH.md) et [Lagos Life](docs/LAGOS_INTERFACE_RESEARCH.md), avec niveaux de preuve et limites. La carte et la gestion orientent le joueur ; les transactions exigent de se rendre au lieu.

## Lancer

```sh
cd togo-life-3d
npm run build
python3 -m http.server 8000
```

Ouvrir `http://localhost:8000/dist/`. Aucun téléchargement npm ni API payante n'est requis. Le build copie les modules et vérifie leurs imports locaux.

`TOGO_LIFE_MONTAGNE.html` contient aussi le jeu, ses modules, CSS et glTF : ouvrir dans un navigateur moderne acceptant les import maps. Ce mode a été exécuté dans Chromium en CI ; le même fichier est servi par l’aperçu HTTPS.

PC : ZQSD/WASD/flèches, Maj courir, E interagir, M plan, J Ma vie, C vue quartier, glisser pour orienter la caméra. Contrôles tactiles implémentés : joystick, course, action et glisser caméra, avec libération/cancel des pointeurs. Les dialogues mettent la simulation en pause.

## Première vie

1. Choisir prénom, tenue et peau ; créer ou reprendre la sauvegarde locale.
2. Aller au marché au nord du point de départ. Négocier avec Ama : une offre de 300 F pour quatre produits reçoit une contre-offre de 315 F par produit. Acheter le lot réservé, ou choisir le tarif courant de 350 F. Les livraisons à l’atelier restent une activité facultative.
3. Au comptoir, au sud du marché, investir 9 000 F puis déposer le sac (12 unités maximum).
4. Choisir un prix. À 450 F, les sept budgets initiaux sont compatibles ; un prix à 1 100 F dépasse leurs seuils. Les clients comparent leurs besoins, prix et préférences, viennent au comptoir et paient réellement. Le commerce concurrent vend à 600 F. Ouvrir Ma vie → Commerce pour suivre les décisions et le bénéfice au coût réel.
5. Payer le loyer et aménager la cour accessible. La faim et l'énergie influencent le déplacement.

La monnaie est virtuelle. Une livraison par jour, échéance de contrat, coût du stock, demande et loyer limitent les gains. Les règles sont dans `src/simulation.js` et `src/society.js`, séparées du rendu et exécutées à 4 Hz. Les sauvegardes v2 migrent en v3 avec secours local, sans perdre le commerce ni l’inventaire. Ce n'est pas une économie multijoueur sécurisée.

## Géographie et assets

Le quartier est une **interprétation artistique originale**, sans relevé OSM chargé. Cinq régions et un annuaire historique de 40 entrées sont disponibles ; aucun voyage, 40 scènes ni seconde ville n'est annoncé. L'annuaire historique inclut Lomé avec un statut différent des préfectures ; une mise à jour administrative sourcée est nécessaire avant expansion.

Three.js r160 et addons : MIT, licence jointe dans `vendor/LICENSE`. Version figée disponible par GitHub durant la panne de proxy ; mise à niveau à valider séparément. Géométries, textures procédurales, avatar et clips : création originale du projet, MIT. `assets/avatar.gltf` est produit par `node scripts/export-avatar.mjs`, sans Blender, mocap, générateur payant ou modèle tiers. Les animations utilisent AnimationMixer et crossfade, sans IK de pied. Les PNJ utilisent aussi le personnage articulé à surfaces continues. Les clips restent des animations originales procédurales, sans mocap ni IK.

## Préservation

`legacy.html`, `game.js`, `style.css` et `TOGO_LIFE_3D.html` conservent le prototype. Le mode de compatibilité pointe vers celui-ci si WebGL échoue. Aucun fichier BAD/Bryq ni document racine n'a été modifié. La tranche initiale a été publiée sur Pages après la PR #5. La refonte UI reste isolée dans la PR #6. Les workflows QA ne testent que ce jeu, avec permissions en lecture et sans déploiement. L’aperçu Vercel sert uniquement son build statique dans un projet dédié ; aucun déploiement BAD/Bryq n’a été modifié.

## Vérification et preuves

```sh
node --test --test-isolation=none tests/*.test.mjs
python3 tests/browser.py --url http://127.0.0.1:8000/dist/
python3 scripts/society_browser.py --entry-file dist/TOGO_LIFE_MONTAGNE.html
node scripts/society_profile.mjs
```

La seconde commande nécessite un environnement permettant Chromium. Voir [validation navigateur actuelle](docs/INTERFACE_VALIDATION_REPORT.md), [rapport historique initial](artifacts/final-evidence.md), [skills](docs/SKILLS_EXECUTION_REPORT.md), [recherche Lagos Life](docs/LAGOS_LIFE_RESEARCH.md), [revue indépendante](docs/INDEPENDENT_REVIEW.md) et [évaluation critique](docs/LAGOS_LIFE_EVALUATION.md).

Restent avant commercialisation : performance Android réelle et 60 FPS PC sur GPU matériel, profiling CPU/GPU et session longue/mémoire, Firefox, finition des ombres/humains, preuve de locomotion fluide et appuis/IK, évitement des foules et du trafic, dialogues sociaux plus riches, vrais quartiers géographiques, métiers/carrière, événements, véhicules possédés, seconde ville et backend multijoueur autoritaire. Rapier n’est pas installé. La vidéo actuelle est un flux réel lent avec décalage présentation/diagnostics, sans certification de fluidité.
