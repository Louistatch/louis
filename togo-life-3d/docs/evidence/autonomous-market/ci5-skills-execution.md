# Exécution réelle des skills sur les captures CI5

Les scripts originaux `asset_report.py` et `build_preview_sheet.py` du skill `create-game-assets` ont été exécutés sur l'artefact du [run CI5 38049623991](https://github.com/Louistatch/louis/actions/runs/38049623991), source `01a79b84c7139c1e81e835d02942327a0ca4354a`. `AGENTS.md` et les instructions du skill ont été lus ; les hashes des scripts et de leur licence ont été vérifiés à nouveau. Le [rapport JSON CI5](ci5-create-game-assets.json) conserve les commandes exactes, résultats, hashes des sept PNG et provenance de l'artefact.

**Contrôle raster : 7/7 PASS**, code de sortie 0 pour chaque groupe. Les cinq captures du scénario HTTPS sont des PNG `1440×900`. Les deux captures portrait sont des PNG `585×1266`, correspondant au viewport CSS `390×844` et au facteur de pixels émulé de 1,5 déclaré dans le rapport mobile. Aucune image n'a été redimensionnée pour satisfaire le contrôle.

Commandes reproductibles avec le même artefact extrait :

```bash
python3 .agents/skills/create-game-assets/scripts/asset_report.py /tmp/togo-market-ci5/society-live/*.png --expect-size 1440x900 --json
python3 .agents/skills/create-game-assets/scripts/asset_report.py /tmp/togo-market-ci5/mobile-probe-portrait-start.png /tmp/togo-market-ci5/mobile-probe-portrait-active.png --expect-size 585x1266 --json
python3 .agents/skills/create-game-assets/scripts/build_preview_sheet.py /tmp/togo-market-ci5/society-live/*.png --out /tmp/togo-market-ci5-contact-sheet.jpg --columns 3 --cell-size 320
```

**Planche : PASS**, code de sortie 0, cinq images, `1032×736`. La planche a été ouverte puis les sept captures originales ont toutes été examinées à pleine résolution. La planche reste dans `/tmp`; aucun PNG n'a été copié par cette mission.

Les captures HTTPS montrent la contre-offre à 315 F pour quatre produits, puis une vente à 450 F : stock restant 11, bénéfice marchandises 135 F et portefeuille du joueur 2 670 F. Les cartes de résidents distinguent désormais leur portefeuille et leur plafond par produit, et montrent le souvenir d'un prix refusé de 1 100 F. Ces cartes restent visibles après restauration de la sauvegarde. Le titre et le bouton de fermeture du panneau Commerce demeurent visibles lors du défilement desktop. La capture du quartier actif montre le personnage, le comptoir, la rue et les habitants avec des contrôles lisibles.

Les deux captures portrait montrent un accueil correctement cadré, son aperçu 3D, les choix de tenue/peau et le bouton d'entrée. Dans le quartier, le joystick et le bouton de course sont séparés du dock. Le HUD supérieur reste dense et le message temporaire d'accueil couvre une partie du bas de la scène. Les personnages et visages restent simplifiés ; aucune image fixe n'établit la qualité professionnelle de leurs mouvements.

Résultats navigateur conservés séparément :

| Parcours CI5 | Résultat réel |
| --- | --- |
| Boucle autonome offline | **70/70 PASS**, parcours terminé, sans erreur. |
| Boucle autonome sur le vrai aperçu HTTPS | **70/70 PASS**, parcours terminé, sans erreur. |
| Régression complète | **FAIL** : 21 vérifications réussies, puis timeout de 60 000 ms ; le reste du parcours n'a pas été validé. |
| Sonde mobile | **FAIL** : 12 vérifications réussies, puis élément DOM détaché lors du défilement ; les contrôles restants et le paysage n'ont pas été validés par ce run. |

Le probe HTTP de livraison confirme `200` et le hash du build public. Son champ brut `browserValidated:false` signifie qu'il ne lance lui-même aucun navigateur ; la preuve de rendu HTTPS vient du scénario autonome distinct. Les deux captures portrait et les premiers contrôles tactiles réussis ne suffisent pas à annoncer une validation mobile complète ou Android sur appareil physique.

Le skill provient de `gamedev-skills/awesome-gamedev-agent-skills`, commit `0a70cfc64672d512c5b5b6006b5dcb5cf90dbdbd`, licence Apache-2.0. Ses deux scripts et la licence archivée sont toujours identiques aux blobs épinglés. Pillow 12.3.0 était déjà installé, sans nouveau téléchargement, API payante ou asset extérieur. Les PNG sont des captures des assets originaux de TOGO LIFE, sous la licence MIT du projet.

Cet audit applique la vérification raster et l'inspection en contexte de `create-game-assets` et la distinction des preuves de `togo-life-quality`. Il ne transforme pas les parcours interrompus en résultats positifs et ne valide ni animation, ni topologie, ni FPS sur matériel réel. Les correctifs du prochain run doivent conserver leur propre source et leurs nouvelles preuves ; ce rapport reste explicitement celui de CI5.
