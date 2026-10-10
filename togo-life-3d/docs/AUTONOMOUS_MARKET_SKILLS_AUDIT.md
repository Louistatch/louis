# Skills — tranche marché autonome

Audit réalisé le 10 octobre 2026. Sept skills supplémentaires sont installés dans le dossier natif Codex `.agents/skills/` : cinq instructions de studio propres au projet et deux disciplines open source. Les fichiers existants n'ont pas été remplacés. Leurs **18 fichiers correspondent exactement aux blobs GitHub épinglés** ; les licences et les permissions ont également été vérifiées.

La [provenance détaillée](../.agents/autonomous-market-skills-audit.json) contient les chemins amont, commits, hashes Git et SHA-256, permissions, résultats du validateur et sorties des scripts exécutés. Ce document atteste l'installation et cet audit, pas la validation navigateur des nouveaux mécanismes de marché.

## Sources et installation

Les cinq skills locaux proviennent de [Louistatch/louis, commit `308e9dfbed69e6efa62aaaac68031147a7b6c6ca`](https://github.com/Louistatch/louis/tree/308e9dfbed69e6efa62aaaac68031147a7b6c6ca/togo-life-3d/.agents/skills), branche de la PR #8 `feat/codex-togo-life-studio`. Leur licence est celle du projet, [MIT au même commit](https://github.com/Louistatch/louis/blob/308e9dfbed69e6efa62aaaac68031147a7b6c6ca/togo-life-3d/LICENSE). Le fichier local `LICENSE` conserve exactement le même blob. Aucun merge de cette branche n'a été effectué par cet audit.

Les deux disciplines proviennent de [gamedev-skills/awesome-gamedev-agent-skills, commit `0a70cfc64672d512c5b5b6006b5dcb5cf90dbdbd`](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/tree/0a70cfc64672d512c5b5b6006b5dcb5cf90dbdbd/skills/disciplines), sous Apache-2.0. La [licence déjà archivée](../.agents/skills/LICENSE.gamedev-skills) correspond exactement au blob `c7fc0c6d59cb8129a0e30fe13f5a6118f3933c44` de ce commit. Les dossiers complets ont été copiés, avec leurs références, scripts, modèles et métadonnées d'agent.

La copie manuelle des dossiers vers `.agents/skills/` est une méthode documentée dans la [documentation d'installation officielle épinglée](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/blob/0a70cfc64672d512c5b5b6006b5dcb5cf90dbdbd/docs/INSTALLATION.md), section « Gemini CLI & Codex CLI ». Les contenus ont été récupérés par le connecteur GitHub, inspectés, puis écrits localement. La commande `npx` n'a pas été relancée : le précédent registre d'installation contient son échec réseau `EPERM`. Aucun installateur distant, hook npm ou commande suggérant un générateur payant n'a été exécuté.

| Skill | Licence | Instructions chargées et rôle | Fichiers installés | Vérification |
| --- | --- | --- | --- | --- |
| [togo-life-studio](../.agents/skills/togo-life-studio/SKILL.md) | MIT | Améliorer l'existant ; boucle décider → agir physiquement → conséquence → progression ; orchestrer les disciplines. | `SKILL.md` | Copie exacte, lecture, `validate_file` PASS. |
| [togo-life-economy](../.agents/skills/togo-life-economy/SKILL.md) | MIT | État économique central, transactions conditionnelles, conservation des ressources, double-clic et sauvegardes. | `SKILL.md` | Copie exacte, lecture, `validate_file` PASS. |
| [togo-life-npc-ai](../.agents/skills/togo-life-npc-ai/SKILL.md) | MIT | Séparer données du résident, intentions, navigation et représentation ; décisions à fréquence réduite, mémoire bornée. | `SKILL.md` | Copie exacte, lecture, `validate_file` PASS. |
| [togo-life-world-map](../.agents/skills/togo-life-world-map/SKILL.md) | MIT | Quartier stylisé déclaré ; données nationales historiques distinguées d'une géométrie OSM ; extension progressive. | `SKILL.md` | Copie exacte, lecture, `validate_file` PASS. |
| [togo-life-quality](../.agents/skills/togo-life-quality/SKILL.md) | MIT | Tests logiques et vrais parcours WebGL/tactiles ; captures réelles et limites matérielles déclarées. | `SKILL.md` | Copie exacte, lecture, `validate_file` PASS. |
| [save-systems](../.agents/skills/save-systems/SKILL.md) | Apache-2.0 | Données sérialisables, version explicite, migrations pures, refus des versions futures et validation défensive. | `SKILL.md` et une référence de migration. | Copie exacte, lecture complète, `validate_file` PASS. |
| [create-game-assets](../.agents/skills/create-game-assets/SKILL.md) | Apache-2.0 | Cohérence visuelle, budgets, provenance, formats glTF et proxies de collision ; approbation après inspection dans le moteur. | `SKILL.md`, métadonnées Codex, deux modèles, quatre références et trois fichiers de scripts. | Copie exacte, lecture, `validate_file` PASS ; deux scripts QA réellement exécutés. |

Les cinq disciplines précédemment installées — `ai-behavior-trees-utility-ai`, `game-ai`, `procedural-gen`, `dialogue-systems`, `performance-optimization` — ont été relues et validées à nouveau : **5/5 PASS**. Elles n'ont pas été réinstallées. Leurs principes applicables sont les scores normalisés avec hystérésis, la séparation décision/navigation/mouvement, le hasard déterministe, les choix de dialogue conditionnels et la mesure des performances avant optimisation.

## Audit et exécution des scripts

Le validateur original `.agents/skills-tools/validate-skills.py`, déjà installé, a été chargé par `importlib.util`; sa fonction `validate_file` a été appelée sur chaque nouveau `SKILL.md`. **7/7 PASS**, sans erreur de frontmatter, nom, référence locale ou métadonnée Codex. Ce contrôle porte sur les dossiers sélectionnés, pas sur le catalogue amont complet. Le manifeste JSON fourni avec `create-game-assets` est syntaxiquement valide ; il reste un modèle et ne constitue pas un catalogue d'assets effectivement produits.

Les scripts originaux `asset_report.py` et `build_preview_sheet.py` ont été lus intégralement. Ils importent uniquement la bibliothèque standard et Pillow, lisent les images locales et écrivent, pour la planche, au chemin explicitement demandé. Ils ne contiennent ni accès réseau, ni subprocess, ni paiement, ni accès à des identifiants. Leur syntaxe Python a passé `ast.parse`. Leurs modes exécutables amont `100755` ont été restaurés après inspection ; les autres fichiers sont `100644`.

Leur unique dépendance déclarée est `Pillow>=10,<13`. **Pillow 12.3.0 était déjà installé** ; aucun téléchargement ou ajout de dépendance n'a été nécessaire. Les deux commandes `--help` ont terminé avec le code 0.

Le vérificateur raster a été exécuté sur trois captures authentiques archivées du jeu précédent :

```bash
python3 .agents/skills/create-game-assets/scripts/asset_report.py docs/captures/2026-10-10/mobile-portrait.png --expect-size 585x1266 --json
python3 .agents/skills/create-game-assets/scripts/asset_report.py docs/captures/2026-10-10/mobile-landscape.png --expect-size 1266x585 --json
python3 .agents/skills/create-game-assets/scripts/asset_report.py docs/captures/2026-10-10/desktop-https.png --expect-size 1440x900 --json
```

**3/3 PASS, codes de sortie 0** : PNG lisibles, dimensions physiques exactes, aucune erreur du script. Le premier essai avec les dimensions CSS `390×844` et `844×390` a donné **FAIL**. Les captures encodent un facteur de pixels de 1,5 ; la contrainte a été corrigée, puis les scripts relancés. Les images originales n'ont pas été redimensionnées. Les échecs initiaux et les sorties du rerun sont conservés dans la provenance JSON. Aucune contrainte de transparence ou de palette 48 couleurs n'a été appliquée à ces captures 3D opaques.

Le second script a réellement produit une planche locale de ces trois captures :

```bash
python3 .agents/skills/create-game-assets/scripts/build_preview_sheet.py docs/captures/2026-10-10/mobile-portrait.png docs/captures/2026-10-10/mobile-landscape.png docs/captures/2026-10-10/desktop-https.png --out /tmp/togo-life-market-skills-preview.jpg --columns 3 --cell-size 192
```

**PASS**, code de sortie 0 ; résultat `648×240` ouvert et inspecté. Ce dérivé QA reste dans `/tmp`, hors du dépôt. Il assemble des captures existantes ; il ne représente ni un asset de production, ni une nouvelle capture navigateur, ni une image conceptuelle.

## Limites et application au développement

Ces instructions ont été communiquées aux missions de développement. `save-systems` exige de préserver les anciennes sauvegardes avant d'introduire l'état des résidents, de tester la chaîne de migration et de refuser les versions inconnues. Son exemple de renommage atomique de fichiers POSIX n'est pas à copier tel quel dans `localStorage` : les écritures navigateur doivent être protégées et leur échec géré dans leur propre API. Une sauvegarde locale reste contrôlée par le joueur et ne peut devenir une autorité économique multijoueur.

`create-game-assets` exige une origine et une licence par asset, des dimensions et axes cohérents, des matériaux/rigs examinés dans le vrai rendu et des budgets mesurés. Le contrôle de PNG réalisé ici ne valide pas la topologie, les animations ou la qualité professionnelle des personnages. Aucun Blender, générateur d'assets payant, service LLM, serveur multijoueur ou nouveau navigateur n'a été exécuté par cette mission d'audit.

Les cinq skills locaux ne contiennent pas de scripts d'installation ou de test : ce sont des instructions appliquées par le directeur et les missions spécialisées. Leur installation ne signifie pas que leurs propositions, notamment plusieurs villes, OSM géométrique ou simulation sociale avancée, sont opérationnelles. Les preuves de gameplay, code produit et tests de la nouvelle tranche doivent figurer dans le registre principal de livraison après leurs exécutions réelles.

Le router générique du catalogue amont n'est pas installé par cette sélection de sept dossiers ; le skill local `togo-life-studio` est le directeur explicitement invoqué pour cette mission. La découverte des dossiers par un futur lancement Codex est possible via l'emplacement natif `.agents/skills/`, sans prétendre avoir rafraîchi la liste des skills du client pendant la session.
