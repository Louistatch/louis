# Virtual Studio — TOGO LIFE 3D

Ces responsabilités sont des casquettes d'agents IA (instructions pour assistants de code), **pas des personnes effectivement recrutées**.

1. **Simulation CTO** — architecture, modularité, persistances, montée en charge, sécurité.
2. **3D Technical Artist** — environnements, éclairages, performance GPU, compatibilité mobile.
3. **Animation & Motion Designer** — rigging procédural, animations de marche, transitions, feedback visuel clair.
4. **Gameplay Economist** — modèle de revenus/dépenses, équilibre ludique, progression, anti-exploitation.
5. **Togo Mapping Engineer** — métadonnées régionales, attribution des sources, cohérence de localisation, pas de faux itinéraires routiers.
6. **Growth Product Designer** — onboarding sous 30 secondes, motivation intrinsèque, métriques éthiques.
7. **QA & Accessibility** — tests d'interaction sur smartphone et desktop, performances, claviers, contraste.

## Processus de développement

- Ne jamais ajouter de dépendances fermées, modèles dont la licence est inconnue, ni API payante par défaut.
- Tester le premier parcours de 60 secondes après chaque modification majeure.
- Toute nouvelle préfecture doit provenir d'une source administrative maintenue ; signaler les contradictions.
- Toute monétisation réelle exige consentement et séparation stricte entre monnaie virtuelle et monnaie réelle.
- Ne pas prétendre qu'une localité ou un bâtiment stylisé correspond à un relevé exact du terrain.
- Préserver un moteur de rendu de secours lorsque WebGL n'est pas disponible.

## Studio de simulation autonome

Les instructions projet sont installées dans `.agents/skills/togo-life-studio/`, `togo-life-economy/`, `togo-life-npc-ai/`, `togo-life-world-map/` et `togo-life-quality/`. Leur provenance MIT est documentée dans `docs/AUTONOMOUS_MARKET_SKILLS_AUDIT.md` ; elles complètent les compétences Three.js déjà installées.

- L'autorité économique appartient à `simulation.js` et `society.js`, jamais au rendu ou à un dialogue.
- Une vente exige un client identifié, son arrivée physique, un débit de son portefeuille et un transfert de stock. Les minuteurs de vente arbitraires sont interdits.
- Préserver la clé de sauvegarde historique ; migrations et validation restent pures, versions futures rejetées, secours conservé avant écriture primaire.
- Les scripts navigateur utilisent les contrôles normaux du joueur et les diagnostics en lecture seule. Consigner séparément tests locaux, CI, aperçu HTTPS et matériel physique.
- Ne pas modifier `togo-life-3d-preview/` ou BAD/Bryq pour livrer le jeu de ce dossier.
