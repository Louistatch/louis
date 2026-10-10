# Exécution réelle des skills sur les captures CI3

Les scripts originaux du skill `create-game-assets` ont été appliqués aux captures du [run CI3 38029106766](https://github.com/Louistatch/louis/actions/runs/38029106766), source `f5d80c1dbb0ce31900c575b73df0bea0611f2bea`. `AGENTS.md` et les deux scripts ont été lus avant exécution. Le [rapport JSON](ci3-create-game-assets.json) conserve les commandes exactes, sorties, hashes des dix PNG, hashes des scripts, identification de l'artefact et résultats observés.

**Vérification raster : 10/10 PASS**, PNG lisibles, dimensions physiques `1440×900`, aucun problème signalé, code de sortie 0. Les deux parcours concernés créent un viewport desktop `1440×900` avec le facteur de pixels par défaut de 1. Le test de régression n'a pas atteint ses captures mobiles ; cet audit ne valide donc aucun nouvel écran Android.

Commandes reproductibles avec le même artefact extrait :

```bash
python3 .agents/skills/create-game-assets/scripts/asset_report.py /tmp/togo-market-ci3/*.png /tmp/togo-market-ci3/society-live/*.png --expect-size 1440x900 --json
python3 .agents/skills/create-game-assets/scripts/build_preview_sheet.py /tmp/togo-market-ci3/society-live/*.png --out /tmp/togo-market-ci3-contact-sheet.jpg --columns 3 --cell-size 320
```

**Planche : PASS**, code de sortie 0, `1032×736`, cinq captures de la boucle autonome. La planche a été ouverte, puis les cinq captures autonomes originales ont toutes été examinées à pleine résolution. Aucun PNG de l'artefact n'a été copié par cette mission et la planche dérivée reste dans `/tmp`.

Les contenus observés rendent les décisions économiques compréhensibles : contre-offre de quatre produits à 315 F, total 1 260 F ; vente à 450 F, coût marchandises 315 F, bénéfice 135 F, stock restant 11 ; refus de prix à 1 100 F mémorisés et sept cartes de décisions individuelles ; mêmes décisions affichées après reprise. La vue active montre le personnage, le comptoir, les trottoirs, la chaussée et les contrôles. Les menus sont lisibles sans chevauchement critique à cette résolution. Le rendu demeure stylisé et les visages simples ; aucune image fixe ne prouve la qualité d'une animation.

La provenance du skill est `gamedev-skills/awesome-gamedev-agent-skills`, commit `0a70cfc64672d512c5b5b6006b5dcb5cf90dbdbd`, licence Apache-2.0. Les hashes des deux scripts et de la licence archivée correspondent encore exactement à cette source. Pillow 12.3.0 était déjà disponible ; aucune dépendance, API payante ou ressource extérieure n'a été ajoutée. Les captures représentent les assets originaux du jeu TOGO LIFE, sous la licence MIT du projet.

Les résultats de gameplay restent distincts : **scénario autonome HTTPS 66/66 PASS**, sans erreur, mais **régression CI3 FAIL sur « progressive stop »**, après 14 vérifications réussies sur 15 effectuées. Les tests suivants n'ont pas été exécutés dans ce parcours interrompu. Le probe de livraison HTTP a confirmé `200` et le hash exact du build ; son champ `browserValidated:false` indique que ce probe ne lance lui-même aucun navigateur. La preuve navigateur HTTPS provient du rapport autonome, pas de ce probe HTTP.

Cet audit applique les contrôles techniques et l'inspection en contexte de `create-game-assets`, ainsi que la séparation des preuves exigée par `togo-life-quality`. Il n'annule pas l'échec de régression et ne constitue pas une validation commerciale, d'animation ou de performances matérielles. Le correctif et son nouveau run doivent être documentés séparément.
