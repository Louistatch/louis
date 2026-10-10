# Application du pack gamedev-skills à TOGO LIFE

Les cinq skills demandés ont été lus et installés à `.agents/skills/`, avec toutes leurs références, licence Apache-2.0 et commit `0a70cfc64672d512c5b5b6006b5dcb5cf90dbdbd`. [Origine](https://github.com/gamedev-skills/awesome-gamedev-agent-skills). [Provenance locale](../.agents/gamedev-skills-source.json). [Validation réelle](evidence/2026-10-10/skills-install-validation.json) : cinq fichiers valides, noms uniques et références présentes.

La commande npx demandée a réellement été tentée, en mode projet Codex, sans scripts npm de cycle de vie ni télémétrie. Échec EPERM sur le registre npm avant téléchargement. Alternative officielle appliquée : copie complète des cinq dossiers dans .agents/skills/, telle que [docs/INSTALLATION.md](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/blob/0a70cfc64672d512c5b5b6006b5dcb5cf90dbdbd/docs/INSTALLATION.md) la décrit. Aucun installateur du pack, service payant, secret ou droit système ajouté. Les 17 fichiers de skills/licence ont été vérifiés identiques aux blobs GitHub épinglés.

## Revue concrète du code

| Skill appliqué | Fichier inspecté et constat | Décision / limite |
|---|---|---|
| game-ai | src/npcs.js : 12 waypoints, 11 liens, recherche BFS lors d’un changement de destination ; séparation décision/route/mouvement présente | Graphe petit et arborescent, chemin unique : pas besoin d’ajouter A* pour ce quartier. Steering doux, sans gestion robuste d’obstacles dynamiques ou navmesh. |
| ai-behavior-trees-utility-ai | src/npcs.js : cinq destinations selon horaires, marche/idle, interruption par changement de routine ; aucun blackboard/score Utility ou runtime BT | Ne pas rebaptiser cette logique BT. Revue des risques d’oscillation et allocations ; une conversion n’est justifiée qu’avec besoins gradués/interactions plus riches et mesure AI. |
| procedural-gen | src/world.js : texture 256 px générée avec seed locale 37, boucle bornée 16 000, géométrie urbaine auteur ; pas de Math.random dans ce générateur | Génération de texture reproductible. Pas de ville procédurale, d’OSM ou de terrain noise ajouté. Le spawn et les destinations sont validés par tests existants ; pas de sweep de villes prétendu. |
| dialogue-systems | src/main.js/interact et src/simulation.js/talk : une option de conseil, identité PNJ et liste persistante limitant le farming | Ce n’est pas un graphe de dialogue branché. Aucun eval ni Ink/Yarn ajouté ; les strings actuelles nécessitent futur catalogue de line IDs pour localisation. |
| performance-optimization | Rapports CI9/CI11, renderer.info et profils UI réels | Nouvel outil .agents/skills-tools/evaluate_render_budget.py exécuté ; budgets connus passants, FPS bas, cible hardware non validée, goulot CPU/GPU inconnu. Pas d’optimisation spéculative déclarée gagnante. |

## Fichiers et exécutions

- 5 SKILL.md, 11 références et licence Apache-2.0 installés ; provenance épinglée en JSON.
- Validateur amont standard-library `.agents/skills-tools/validate-skills.py` inspecté puis ses fonctions originales validate_file et validate_unique_names exécutées sur les cinq dossiers : PASS. Les checks catalogue/router/plugins de l’intégralité du dépôt ne s’appliquent pas à cette installation partielle et n’ont pas été déclarés exécutés.
- Analyseur original du projet `.agents/skills-tools/evaluate_render_budget.py` produit [budget-review.json](evidence/2026-10-10/budget-review.json). Cinq contrôles réels vérifient valeurs manquantes, booléens/négatifs, dépassement, zéro connu et refus d’un rapport navigateur en échec : [résultat](evidence/2026-10-10/budget-self-checks.json).
- Le build public reste bit-identique. Aucun nouveau BT, dialogue branché, générateur de ville ou gain FPS n’est annoncé comme livré par l’installation.

Commande reproductible de revue, depuis togo-life-3d :

```sh
python3 .agents/skills-tools/evaluate_render_budget.py \
  --input docs/evidence/2026-10-10/performance-profiles.json \
  --output /tmp/togo-life-budget-review.json
```

Les cinq skills sont prêts pour le prochain développement Codex. Leur installation n’élimine pas les limites techniques observées du jeu ; [validation complète](INTERFACE_VALIDATION_REPORT.md) et [registre](SKILLS_EXECUTION_REPORT.md).
