---
name: togo-life-quality
description: Tester et fiabiliser TOGO LIFE 3D sur PC et Android : Three.js, navigateur WebGL, entrée tactile, animation, économie, caméra, sauvegarde, performances, captures et preuves vérifiables.
---

# QA avant toute annonce de livraison

## Commandes
Depuis `togo-life-3d/` :
```bash
npm test
npm run build
python3 -m http.server 8000
# Dans un second terminal si Playwright/Chromium est disponible :
python3 tests/browser.py --url http://127.0.0.1:8000/dist/
```

## Scénarios prioritaires
1. Charger sans erreur, personnage visible, marcher/courir, caméra et collision.
2. Acheter au marché, transporter physiquement, investir au comptoir, déposer, fixer prix, observer la vente.
3. Horaires et animations de PNJ, réaction aux interactions, non-superposition.
4. Pause qui arrête la simulation ; reprise et sauvegarde versionnée intactes ; scénarios de fraude.
5. Affichage 1440×900 et 390×844, doigts/joystick, texte, menus, adaptation aux faibles GPU, fallback sans WebGL.
6. Relever appels de rendu, triangles, consommation GPU si accessibles ; mesurer FPS sur matériel représentatif, jamais sur estimation.

## Preuves et blocages
Créer les captures **uniquement avec le vrai jeu exécuté** et les placer dans `artifacts/`. Pour chaque test relever PASS/FAIL/BLOCKED, environnement, commit, bug, reproduction, correctif et rerun. Un `npm test` vert n'est pas une validation visuelle, et un navigateur en rendu logiciel ne prouve pas les performances Android. Ne pas annoncer multijoueur ou 40 villes opérationnelles sans preuve.
