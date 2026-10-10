# TOGO LIFE — Montagne Aimant (tranche solo en développement)

Nouvelle architecture isolée de BAD/Bryq : Three.js local, avatar humain original glTF à 22 os et clips Idle/Walk/Run, quartier stylisé de Lomé, caméra troisième personne, collisions cinématiques, huit habitants à horaires, taxis et motos, marché, commerce et logement.

**État exact : build et 30 tests Node réussis. La refonte UI est sur une branche dédiée et dans la [PR #6](https://github.com/Louistatch/louis/pull/6). Chromium a produit quatre captures réelles du monofichier dans le run 38020941245. Leur revue a conduit à remplacer l’avatar et optimiser le décor : cette révision doit encore être contrôlée. Le parcours complet et le mobile restent à valider. Cette tranche n'est pas une livraison commerciale validée.**

Interface : aperçu animé de l'avatar, mini-plan local, objectifs avec distance, vue quartier, journal et bilan du comptoir. Recherches [Townsmen 5](docs/TOWNSMEN_INTERFACE_RESEARCH.md) et [Lagos Life](docs/LAGOS_INTERFACE_RESEARCH.md), avec niveaux de preuve et limites. La carte et la gestion orientent le joueur ; les transactions exigent de se rendre au lieu.

## Lancer

```sh
cd togo-life-3d
npm run build
python3 -m http.server 8000
```

Ouvrir `http://localhost:8000/dist/`. Aucun téléchargement npm ni API payante n'est requis. Le build copie les modules et vérifie leurs imports locaux.

`TOGO_LIFE_MONTAGNE.html` contient aussi le jeu, ses modules, CSS et glTF : ouvrir dans un navigateur moderne acceptant les import maps. Ce mode a été généré, mais reste à tester dans un vrai navigateur.

PC : ZQSD/WASD/flèches, Maj courir, E interagir, M plan, J Ma vie, C vue quartier, glisser pour orienter la caméra. Contrôles tactiles implémentés : joystick, course, action et glisser caméra, avec libération/cancel des pointeurs. Les dialogues mettent la simulation en pause.

## Première vie

1. Choisir prénom, tenue et peau ; créer ou reprendre la sauvegarde locale.
2. Aller au marché au nord du point de départ. Accepter un colis et le porter à l'atelier, ou acheter les produits (350 F par unité).
3. Au comptoir, au sud du marché, investir 9 000 F puis déposer le sac (12 unités maximum).
4. Choisir un prix. À 450 F la demande est forte ; elle baisse à 650/850 F et devient nulle à 1 100 F. Les ventes utilisent du stock pendant les heures d'ouverture.
5. Payer le loyer et aménager la cour accessible. La faim et l'énergie influencent le déplacement.

La monnaie est virtuelle. Une livraison par jour, échéance de contrat, coût du stock, demande et loyer limitent les gains. Les règles sont dans `src/simulation.js` et séparées du rendu. Ce n'est pas une économie multijoueur sécurisée.

## Géographie et assets

Le quartier est une **interprétation artistique originale**, sans relevé OSM chargé. Cinq régions et un annuaire historique de 40 entrées sont disponibles ; aucun voyage, 40 scènes ni seconde ville n'est annoncé. L'annuaire historique inclut Lomé avec un statut différent des préfectures ; une mise à jour administrative sourcée est nécessaire avant expansion.

Three.js r160 et addons : MIT, licence jointe dans `vendor/LICENSE`. Version figée disponible par GitHub durant la panne de proxy ; mise à niveau à valider séparément. Géométries, textures procédurales, avatar et clips : création originale du projet, MIT. `assets/avatar.gltf` est produit par `node scripts/export-avatar.mjs`, sans Blender, mocap, générateur payant ou modèle tiers. Les animations utilisent AnimationMixer et crossfade, sans IK de pied. Les PNJ gardent le rig procédural original pour cette tranche.

## Préservation

`legacy.html`, `game.js`, `style.css` et `TOGO_LIFE_3D.html` conservent le prototype. Le mode de compatibilité pointe vers celui-ci si WebGL échoue. Aucun fichier BAD/Bryq ni document racine n'a été modifié. La tranche initiale a été publiée sur Pages après la PR #5. La refonte UI reste isolée dans la PR #6. Le nouveau workflow ne teste que ce jeu, avec permissions en lecture et sans déploiement.

## Vérification et preuves

```sh
node --test --test-isolation=none tests/*.test.mjs
python3 tests/browser.py --url http://127.0.0.1:8000/dist/
```

La seconde commande nécessite un environnement permettant Chromium. Voir [rapport final](artifacts/final-evidence.md), [skills](docs/SKILLS_EXECUTION_REPORT.md), [recherche Lagos Life](docs/LAGOS_LIFE_RESEARCH.md), [revue indépendante](docs/INDEPENDENT_REVIEW.md) et [évaluation critique](docs/LAGOS_LIFE_EVALUATION.md).

Restent avant commercialisation : validation graphique et animation en captures/vidéo, performance Android réelle, locomotion IK et finition humaine, Rapier/navmesh/traffic robuste, vrais quartiers géographiques, métiers supplémentaires, événements, véhicules possédés, seconde ville distincte et backend multijoueur autoritaire.
