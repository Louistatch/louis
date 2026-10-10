# Exécution réelle des skills sur les captures CI6

Source `39daf3befc4fdce95134c1c197d8e591fb412da8`, build SHA-256 `998faadb1a53f2780df6f7bc2dbcc96f81a66cce49ed0c79dea8a9780f2abaea`, [run CI6 38050314316](https://github.com/Louistatch/louis/actions/runs/38050314316). `AGENTS.md` et le workflow `create-game-assets` ont été chargés ; les scripts et la licence épinglés ont été vérifiés à nouveau. Le [rapport JSON CI6](ci6-create-game-assets.json) conserve les commandes réellement exécutées, hashes et observations.

**Audit final : 9/9 PNG PASS.** Les captures archivées correspondent byte pour byte aux originaux de l'artefact final `11669755000`, dont le SHA-256 vérifié est `0ea7d7a2433c96d63a11594bd2e85487175dacf2761f1f0bcd9c7a504bac35f6`. Trois images portrait sont des PNG `585×1266` et le paysage est un PNG `1266×585`, conformément aux viewports CSS `390×844` et `844×390` avec facteur de pixels de 1,5. Les cinq images desktop HTTPS sont des PNG `1440×900`. Aucun redimensionnement n'a été effectué.

```bash
python3 .agents/skills/create-game-assets/scripts/asset_report.py docs/captures/autonomous-market/mobile-onboarding.png docs/captures/autonomous-market/mobile-portrait.png docs/captures/autonomous-market/mobile-commerce.png --expect-size 585x1266 --json
python3 .agents/skills/create-game-assets/scripts/asset_report.py docs/captures/autonomous-market/mobile-landscape.png --expect-size 1266x585 --json
python3 .agents/skills/create-game-assets/scripts/asset_report.py docs/captures/autonomous-market/autonomous-*.png docs/captures/autonomous-market/market-counteroffer.png --expect-size 1440x900 --json
python3 .agents/skills/create-game-assets/scripts/build_preview_sheet.py docs/captures/autonomous-market/autonomous-*.png docs/captures/autonomous-market/market-counteroffer.png --out /tmp/togo-market-ci6-contact-sheet.jpg --columns 3 --cell-size 320
```

Les trois commandes de vérification terminent avec le code 0 et sans problème raster. Les neuf captures ont été ouvertes à pleine résolution. L'accueil affiche l'avatar 3D, les choix de personnalisation et le bouton d'entrée dans la fenêtre. Le portrait et le paysage montrent des contrôles séparés et accessibles. Après défilement de Commerce, le titre, le bouton de fermeture, les sept cartes et les boutons inférieurs restent lisibles. Le HUD portrait reste dense et la notification d'accueil réduit temporairement la surface dégagée du quartier.

**Sonde tactile CI6 : 25/25 PASS**, sans erreur navigateur ou console. Le scénario a vérifié les vrais gestes de joystick, l'arrêt après annulation, la caméra, la stabilité des cartes DOM pendant les mises à jour, la fermeture effective du panneau défilé et les deux orientations. Il a mesuré `7,372 FPS` et `135,643 ms/image` dans une fenêtre active d'environ dix secondes, avec Chromium en rendu logiciel ANGLE/SwiftShader. Ce résultat ne valide pas les objectifs matériels de 30/60 FPS ; aucun appareil Android physique n'a été testé.

**Étape desktop HTTPS terminée : 5/5 PNG PASS.** La planche originale a réellement été produite, code de sortie 0, cinq images et dimensions `1032×736`, puis ouverte et examinée. Elle reste dans `/tmp`. Les captures montrent la contre-offre à 315 F, la vente à 450 F, le stock restant de 11 produits et le bénéfice de 135 F. Les cartes distinguent portefeuille et plafond par produit, gardent les souvenirs du prix refusé à 1 100 F et montrent un voisin choisissant le commerce concurrent. Les mêmes informations sont présentes après reprise. La vue active laisse le joueur et ses contrôles visibles dans le quartier stylisé.

Les résultats bruts du même run final ont été relus et leur source vérifiée :

| Parcours CI6 | Résultat |
| --- | --- |
| Régression du jeu complet | **39/39 PASS**, sans erreur. |
| Contrôles tactiles portrait/paysage | **25/25 PASS**, sans erreur navigateur ou console. |
| Boucle autonome offline | **70/70 PASS**, sans erreur navigateur ou console. |
| Boucle autonome sur le vrai aperçu HTTPS | **70/70 PASS**, sans erreur navigateur ou console. |

Le probe HTTP confirme également `200` et le hash exact du build public. Son champ `browserValidated:false` signifie qu'il ne lance pas lui-même de navigateur ; la preuve de rendu HTTPS vient du scénario autonome distinct. Les résultats positifs de CI6 ne réécrivent pas les échecs historiques CI3/CI5 : ils attestent de nouveaux parcours terminés après correctifs.

Les outils proviennent de `gamedev-skills/awesome-gamedev-agent-skills`, commit `0a70cfc64672d512c5b5b6006b5dcb5cf90dbdbd`, sous Apache-2.0. Les scripts et la licence archivée correspondent toujours exactement aux blobs amont. Pillow 12.3.0 était déjà installé. Les captures représentent les assets originaux MIT de TOGO LIFE ; aucune API payante, nouvelle dépendance ou image conceptuelle n'a été ajoutée par cet audit.

La validité raster et des images fixes ne permettent pas d'approuver la topologie ou des animations professionnelles. Les personnages, visages et environnements restent stylisés ; ce quartier n'est pas un relevé exact de Lomé. Aucun registre principal, README ou PNG n'a été modifié par cette mission ; les captures ont été copiées par le directeur et cet audit a vérifié leur identité avec l'artefact original.
